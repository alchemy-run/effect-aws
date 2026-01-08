import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "ObservabilityAdmin",
  serviceShapeName: "ObservabilityAdmin",
});
const auth = T.AwsAuthSigv4({ name: "observabilityadmin" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://observabilityadmin-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://observabilityadmin-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://observabilityadmin.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://observabilityadmin.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type RuleName = string;
export type ResourceArn = string;
export type RuleIdentifier = string;
export type AwsResourceExplorerManagedViewArn = string;
export type FailureReason = string;
export type ListCentralizationRulesForOrganizationMaxResults = number;
export type NextToken = string;
export type ResourceIdentifierPrefix = string;
export type ListResourceTelemetryMaxResults = number;
export type AccountIdentifier = string;
export type ListResourceTelemetryForOrganizationMaxResults = number;
export type ListS3TableIntegrationsMaxResults = number;
export type ListTelemetryRulesMaxResults = number;
export type OrganizationUnitIdentifier = string;
export type ListTelemetryRulesForOrganizationMaxResults = number;
export type TagKey = string;
export type TelemetryPipelineName = string;
export type TelemetryPipelineIdentifier = string;
export type ListTelemetryPipelinesMaxResults = number;
export type TagValue = string;
export type TelemetryPipelineConfigurationBody = string;
export type Region = string;
export type SourceFilterString = string;
export type RetentionPeriodInDays = number;
export type ResourceIdentifier = string;
export type LogsFilterString = string;

//# Schemas
export interface GetTelemetryEnrichmentStatusRequest {}
export const GetTelemetryEnrichmentStatusRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTelemetryEnrichmentStatusRequest",
}) as any as S.Schema<GetTelemetryEnrichmentStatusRequest>;
export interface GetTelemetryEvaluationStatusRequest {}
export const GetTelemetryEvaluationStatusRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTelemetryEvaluationStatusRequest",
}) as any as S.Schema<GetTelemetryEvaluationStatusRequest>;
export interface GetTelemetryEvaluationStatusForOrganizationRequest {}
export const GetTelemetryEvaluationStatusForOrganizationRequest = S.suspend(
  () =>
    S.Struct({}).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "GetTelemetryEvaluationStatusForOrganizationRequest",
}) as any as S.Schema<GetTelemetryEvaluationStatusForOrganizationRequest>;
export interface StartTelemetryEnrichmentRequest {}
export const StartTelemetryEnrichmentRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartTelemetryEnrichmentRequest",
}) as any as S.Schema<StartTelemetryEnrichmentRequest>;
export interface StartTelemetryEvaluationRequest {}
export const StartTelemetryEvaluationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartTelemetryEvaluationRequest",
}) as any as S.Schema<StartTelemetryEvaluationRequest>;
export interface StartTelemetryEvaluationResponse {}
export const StartTelemetryEvaluationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartTelemetryEvaluationResponse",
}) as any as S.Schema<StartTelemetryEvaluationResponse>;
export interface StartTelemetryEvaluationForOrganizationRequest {}
export const StartTelemetryEvaluationForOrganizationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartTelemetryEvaluationForOrganizationRequest",
}) as any as S.Schema<StartTelemetryEvaluationForOrganizationRequest>;
export interface StartTelemetryEvaluationForOrganizationResponse {}
export const StartTelemetryEvaluationForOrganizationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartTelemetryEvaluationForOrganizationResponse",
}) as any as S.Schema<StartTelemetryEvaluationForOrganizationResponse>;
export interface StopTelemetryEnrichmentRequest {}
export const StopTelemetryEnrichmentRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopTelemetryEnrichmentRequest",
}) as any as S.Schema<StopTelemetryEnrichmentRequest>;
export interface StopTelemetryEvaluationRequest {}
export const StopTelemetryEvaluationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopTelemetryEvaluationRequest",
}) as any as S.Schema<StopTelemetryEvaluationRequest>;
export interface StopTelemetryEvaluationResponse {}
export const StopTelemetryEvaluationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopTelemetryEvaluationResponse",
}) as any as S.Schema<StopTelemetryEvaluationResponse>;
export interface StopTelemetryEvaluationForOrganizationRequest {}
export const StopTelemetryEvaluationForOrganizationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopTelemetryEvaluationForOrganizationRequest",
}) as any as S.Schema<StopTelemetryEvaluationForOrganizationRequest>;
export interface StopTelemetryEvaluationForOrganizationResponse {}
export const StopTelemetryEvaluationForOrganizationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopTelemetryEvaluationForOrganizationResponse",
}) as any as S.Schema<StopTelemetryEvaluationForOrganizationResponse>;
export type ResourceTypes = string[];
export const ResourceTypes = S.Array(S.String);
export type AccountIdentifiers = string[];
export const AccountIdentifiers = S.Array(S.String);
export type OrganizationUnitIdentifiers = string[];
export const OrganizationUnitIdentifiers = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type TelemetrySourceTypes = string[];
export const TelemetrySourceTypes = S.Array(S.String);
export interface VPCFlowLogParameters {
  LogFormat?: string;
  TrafficType?: string;
  MaxAggregationInterval?: number;
}
export const VPCFlowLogParameters = S.suspend(() =>
  S.Struct({
    LogFormat: S.optional(S.String),
    TrafficType: S.optional(S.String),
    MaxAggregationInterval: S.optional(S.Number),
  }),
).annotations({
  identifier: "VPCFlowLogParameters",
}) as any as S.Schema<VPCFlowLogParameters>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface AdvancedFieldSelector {
  Field: string;
  Equals?: StringList;
  StartsWith?: StringList;
  EndsWith?: StringList;
  NotEquals?: StringList;
  NotStartsWith?: StringList;
  NotEndsWith?: StringList;
}
export const AdvancedFieldSelector = S.suspend(() =>
  S.Struct({
    Field: S.String,
    Equals: S.optional(StringList),
    StartsWith: S.optional(StringList),
    EndsWith: S.optional(StringList),
    NotEquals: S.optional(StringList),
    NotStartsWith: S.optional(StringList),
    NotEndsWith: S.optional(StringList),
  }),
).annotations({
  identifier: "AdvancedFieldSelector",
}) as any as S.Schema<AdvancedFieldSelector>;
export type FieldSelectors = AdvancedFieldSelector[];
export const FieldSelectors = S.Array(AdvancedFieldSelector);
export interface AdvancedEventSelector {
  Name?: string;
  FieldSelectors: FieldSelectors;
}
export const AdvancedEventSelector = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), FieldSelectors: FieldSelectors }),
).annotations({
  identifier: "AdvancedEventSelector",
}) as any as S.Schema<AdvancedEventSelector>;
export type AdvancedEventSelectors = AdvancedEventSelector[];
export const AdvancedEventSelectors = S.Array(AdvancedEventSelector);
export interface CloudtrailParameters {
  AdvancedEventSelectors: AdvancedEventSelectors;
}
export const CloudtrailParameters = S.suspend(() =>
  S.Struct({ AdvancedEventSelectors: AdvancedEventSelectors }),
).annotations({
  identifier: "CloudtrailParameters",
}) as any as S.Schema<CloudtrailParameters>;
export interface ELBLoadBalancerLoggingParameters {
  OutputFormat?: string;
  FieldDelimiter?: string;
}
export const ELBLoadBalancerLoggingParameters = S.suspend(() =>
  S.Struct({
    OutputFormat: S.optional(S.String),
    FieldDelimiter: S.optional(S.String),
  }),
).annotations({
  identifier: "ELBLoadBalancerLoggingParameters",
}) as any as S.Schema<ELBLoadBalancerLoggingParameters>;
export interface SingleHeader {
  Name?: string;
}
export const SingleHeader = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({ identifier: "SingleHeader" }) as any as S.Schema<SingleHeader>;
export interface FieldToMatch {
  SingleHeader?: SingleHeader;
  UriPath?: string;
  QueryString?: string;
  Method?: string;
}
export const FieldToMatch = S.suspend(() =>
  S.Struct({
    SingleHeader: S.optional(SingleHeader),
    UriPath: S.optional(S.String),
    QueryString: S.optional(S.String),
    Method: S.optional(S.String),
  }),
).annotations({ identifier: "FieldToMatch" }) as any as S.Schema<FieldToMatch>;
export type RedactedFields = FieldToMatch[];
export const RedactedFields = S.Array(FieldToMatch);
export interface ActionCondition {
  Action?: string;
}
export const ActionCondition = S.suspend(() =>
  S.Struct({ Action: S.optional(S.String) }),
).annotations({
  identifier: "ActionCondition",
}) as any as S.Schema<ActionCondition>;
export interface LabelNameCondition {
  LabelName?: string;
}
export const LabelNameCondition = S.suspend(() =>
  S.Struct({ LabelName: S.optional(S.String) }),
).annotations({
  identifier: "LabelNameCondition",
}) as any as S.Schema<LabelNameCondition>;
export interface Condition {
  ActionCondition?: ActionCondition;
  LabelNameCondition?: LabelNameCondition;
}
export const Condition = S.suspend(() =>
  S.Struct({
    ActionCondition: S.optional(ActionCondition),
    LabelNameCondition: S.optional(LabelNameCondition),
  }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export type Conditions = Condition[];
export const Conditions = S.Array(Condition);
export interface Filter {
  Behavior?: string;
  Requirement?: string;
  Conditions?: Conditions;
}
export const Filter = S.suspend(() =>
  S.Struct({
    Behavior: S.optional(S.String),
    Requirement: S.optional(S.String),
    Conditions: S.optional(Conditions),
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface LoggingFilter {
  Filters?: Filters;
  DefaultBehavior?: string;
}
export const LoggingFilter = S.suspend(() =>
  S.Struct({
    Filters: S.optional(Filters),
    DefaultBehavior: S.optional(S.String),
  }),
).annotations({
  identifier: "LoggingFilter",
}) as any as S.Schema<LoggingFilter>;
export interface WAFLoggingParameters {
  RedactedFields?: RedactedFields;
  LoggingFilter?: LoggingFilter;
  LogType?: string;
}
export const WAFLoggingParameters = S.suspend(() =>
  S.Struct({
    RedactedFields: S.optional(RedactedFields),
    LoggingFilter: S.optional(LoggingFilter),
    LogType: S.optional(S.String),
  }),
).annotations({
  identifier: "WAFLoggingParameters",
}) as any as S.Schema<WAFLoggingParameters>;
export type LogTypes = string[];
export const LogTypes = S.Array(S.String);
export interface LogDeliveryParameters {
  LogTypes?: LogTypes;
}
export const LogDeliveryParameters = S.suspend(() =>
  S.Struct({ LogTypes: S.optional(LogTypes) }),
).annotations({
  identifier: "LogDeliveryParameters",
}) as any as S.Schema<LogDeliveryParameters>;
export interface TelemetryDestinationConfiguration {
  DestinationType?: string;
  DestinationPattern?: string;
  RetentionInDays?: number;
  VPCFlowLogParameters?: VPCFlowLogParameters;
  CloudtrailParameters?: CloudtrailParameters;
  ELBLoadBalancerLoggingParameters?: ELBLoadBalancerLoggingParameters;
  WAFLoggingParameters?: WAFLoggingParameters;
  LogDeliveryParameters?: LogDeliveryParameters;
}
export const TelemetryDestinationConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "TelemetryDestinationConfiguration",
}) as any as S.Schema<TelemetryDestinationConfiguration>;
export interface TelemetryRule {
  ResourceType?: string;
  TelemetryType: string;
  TelemetrySourceTypes?: TelemetrySourceTypes;
  DestinationConfiguration?: TelemetryDestinationConfiguration;
  Scope?: string;
  SelectionCriteria?: string;
}
export const TelemetryRule = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    TelemetryType: S.String,
    TelemetrySourceTypes: S.optional(TelemetrySourceTypes),
    DestinationConfiguration: S.optional(TelemetryDestinationConfiguration),
    Scope: S.optional(S.String),
    SelectionCriteria: S.optional(S.String),
  }),
).annotations({
  identifier: "TelemetryRule",
}) as any as S.Schema<TelemetryRule>;
export type TagMapInput = { [key: string]: string };
export const TagMapInput = S.Record({ key: S.String, value: S.String });
export interface CreateTelemetryRuleForOrganizationInput {
  RuleName: string;
  Rule: TelemetryRule;
  Tags?: TagMapInput;
}
export const CreateTelemetryRuleForOrganizationInput = S.suspend(() =>
  S.Struct({
    RuleName: S.String,
    Rule: TelemetryRule,
    Tags: S.optional(TagMapInput),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateTelemetryRuleForOrganization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTelemetryRuleForOrganizationInput",
}) as any as S.Schema<CreateTelemetryRuleForOrganizationInput>;
export interface DeleteCentralizationRuleForOrganizationInput {
  RuleIdentifier: string;
}
export const DeleteCentralizationRuleForOrganizationInput = S.suspend(() =>
  S.Struct({ RuleIdentifier: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/DeleteCentralizationRuleForOrganization",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCentralizationRuleForOrganizationInput",
}) as any as S.Schema<DeleteCentralizationRuleForOrganizationInput>;
export interface DeleteCentralizationRuleForOrganizationResponse {}
export const DeleteCentralizationRuleForOrganizationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCentralizationRuleForOrganizationResponse",
}) as any as S.Schema<DeleteCentralizationRuleForOrganizationResponse>;
export interface DeleteS3TableIntegrationInput {
  Arn: string;
}
export const DeleteS3TableIntegrationInput = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteS3TableIntegration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteS3TableIntegrationInput",
}) as any as S.Schema<DeleteS3TableIntegrationInput>;
export interface DeleteS3TableIntegrationResponse {}
export const DeleteS3TableIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteS3TableIntegrationResponse",
}) as any as S.Schema<DeleteS3TableIntegrationResponse>;
export interface DeleteTelemetryRuleInput {
  RuleIdentifier: string;
}
export const DeleteTelemetryRuleInput = S.suspend(() =>
  S.Struct({ RuleIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteTelemetryRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTelemetryRuleInput",
}) as any as S.Schema<DeleteTelemetryRuleInput>;
export interface DeleteTelemetryRuleResponse {}
export const DeleteTelemetryRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTelemetryRuleResponse",
}) as any as S.Schema<DeleteTelemetryRuleResponse>;
export interface DeleteTelemetryRuleForOrganizationInput {
  RuleIdentifier: string;
}
export const DeleteTelemetryRuleForOrganizationInput = S.suspend(() =>
  S.Struct({ RuleIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteTelemetryRuleForOrganization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTelemetryRuleForOrganizationInput",
}) as any as S.Schema<DeleteTelemetryRuleForOrganizationInput>;
export interface DeleteTelemetryRuleForOrganizationResponse {}
export const DeleteTelemetryRuleForOrganizationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTelemetryRuleForOrganizationResponse",
}) as any as S.Schema<DeleteTelemetryRuleForOrganizationResponse>;
export interface GetCentralizationRuleForOrganizationInput {
  RuleIdentifier: string;
}
export const GetCentralizationRuleForOrganizationInput = S.suspend(() =>
  S.Struct({ RuleIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetCentralizationRuleForOrganization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCentralizationRuleForOrganizationInput",
}) as any as S.Schema<GetCentralizationRuleForOrganizationInput>;
export interface GetS3TableIntegrationInput {
  Arn: string;
}
export const GetS3TableIntegrationInput = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetS3TableIntegration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetS3TableIntegrationInput",
}) as any as S.Schema<GetS3TableIntegrationInput>;
export interface GetTelemetryEnrichmentStatusOutput {
  Status?: string;
  AwsResourceExplorerManagedViewArn?: string;
}
export const GetTelemetryEnrichmentStatusOutput = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    AwsResourceExplorerManagedViewArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTelemetryEnrichmentStatusOutput",
}) as any as S.Schema<GetTelemetryEnrichmentStatusOutput>;
export interface GetTelemetryEvaluationStatusOutput {
  Status?: string;
  FailureReason?: string;
}
export const GetTelemetryEvaluationStatusOutput = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTelemetryEvaluationStatusOutput",
}) as any as S.Schema<GetTelemetryEvaluationStatusOutput>;
export interface GetTelemetryEvaluationStatusForOrganizationOutput {
  Status?: string;
  FailureReason?: string;
}
export const GetTelemetryEvaluationStatusForOrganizationOutput = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTelemetryEvaluationStatusForOrganizationOutput",
}) as any as S.Schema<GetTelemetryEvaluationStatusForOrganizationOutput>;
export interface GetTelemetryRuleInput {
  RuleIdentifier: string;
}
export const GetTelemetryRuleInput = S.suspend(() =>
  S.Struct({ RuleIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTelemetryRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTelemetryRuleInput",
}) as any as S.Schema<GetTelemetryRuleInput>;
export interface GetTelemetryRuleForOrganizationInput {
  RuleIdentifier: string;
}
export const GetTelemetryRuleForOrganizationInput = S.suspend(() =>
  S.Struct({ RuleIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTelemetryRuleForOrganization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTelemetryRuleForOrganizationInput",
}) as any as S.Schema<GetTelemetryRuleForOrganizationInput>;
export interface ListCentralizationRulesForOrganizationInput {
  RuleNamePrefix?: string;
  AllRegions?: boolean;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCentralizationRulesForOrganizationInput = S.suspend(() =>
  S.Struct({
    RuleNamePrefix: S.optional(S.String),
    AllRegions: S.optional(S.Boolean),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ListCentralizationRulesForOrganization",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCentralizationRulesForOrganizationInput",
}) as any as S.Schema<ListCentralizationRulesForOrganizationInput>;
export type TelemetryConfigurationState = { [key: string]: string };
export const TelemetryConfigurationState = S.Record({
  key: S.String,
  value: S.String,
});
export interface ListResourceTelemetryForOrganizationInput {
  AccountIdentifiers?: AccountIdentifiers;
  ResourceIdentifierPrefix?: string;
  ResourceTypes?: ResourceTypes;
  TelemetryConfigurationState?: TelemetryConfigurationState;
  ResourceTags?: TagMapInput;
  MaxResults?: number;
  NextToken?: string;
}
export const ListResourceTelemetryForOrganizationInput = S.suspend(() =>
  S.Struct({
    AccountIdentifiers: S.optional(AccountIdentifiers),
    ResourceIdentifierPrefix: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypes),
    TelemetryConfigurationState: S.optional(TelemetryConfigurationState),
    ResourceTags: S.optional(TagMapInput),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListResourceTelemetryForOrganization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceTelemetryForOrganizationInput",
}) as any as S.Schema<ListResourceTelemetryForOrganizationInput>;
export interface ListS3TableIntegrationsInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListS3TableIntegrationsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListS3TableIntegrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListS3TableIntegrationsInput",
}) as any as S.Schema<ListS3TableIntegrationsInput>;
export interface ListTagsForResourceInput {
  ResourceARN: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTagsForResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface ListTelemetryRulesInput {
  RuleNamePrefix?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTelemetryRulesInput = S.suspend(() =>
  S.Struct({
    RuleNamePrefix: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTelemetryRules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTelemetryRulesInput",
}) as any as S.Schema<ListTelemetryRulesInput>;
export interface ListTelemetryRulesForOrganizationInput {
  RuleNamePrefix?: string;
  SourceAccountIds?: AccountIdentifiers;
  SourceOrganizationUnitIds?: OrganizationUnitIdentifiers;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTelemetryRulesForOrganizationInput = S.suspend(() =>
  S.Struct({
    RuleNamePrefix: S.optional(S.String),
    SourceAccountIds: S.optional(AccountIdentifiers),
    SourceOrganizationUnitIds: S.optional(OrganizationUnitIdentifiers),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTelemetryRulesForOrganization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTelemetryRulesForOrganizationInput",
}) as any as S.Schema<ListTelemetryRulesForOrganizationInput>;
export interface StartTelemetryEnrichmentOutput {
  Status?: string;
  AwsResourceExplorerManagedViewArn?: string;
}
export const StartTelemetryEnrichmentOutput = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    AwsResourceExplorerManagedViewArn: S.optional(S.String),
  }),
).annotations({
  identifier: "StartTelemetryEnrichmentOutput",
}) as any as S.Schema<StartTelemetryEnrichmentOutput>;
export interface StopTelemetryEnrichmentOutput {
  Status?: string;
}
export const StopTelemetryEnrichmentOutput = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "StopTelemetryEnrichmentOutput",
}) as any as S.Schema<StopTelemetryEnrichmentOutput>;
export interface TagResourceInput {
  ResourceARN: string;
  Tags: TagMapInput;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagMapInput }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TagResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceInput {
  ResourceARN: string;
  TagKeys: TagKeyList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UntagResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type Regions = string[];
export const Regions = S.Array(S.String);
export interface SourceLogsConfiguration {
  LogGroupSelectionCriteria: string;
  EncryptedLogGroupStrategy: string;
}
export const SourceLogsConfiguration = S.suspend(() =>
  S.Struct({
    LogGroupSelectionCriteria: S.String,
    EncryptedLogGroupStrategy: S.String,
  }),
).annotations({
  identifier: "SourceLogsConfiguration",
}) as any as S.Schema<SourceLogsConfiguration>;
export interface CentralizationRuleSource {
  Regions: Regions;
  Scope?: string;
  SourceLogsConfiguration?: SourceLogsConfiguration;
}
export const CentralizationRuleSource = S.suspend(() =>
  S.Struct({
    Regions: Regions,
    Scope: S.optional(S.String),
    SourceLogsConfiguration: S.optional(SourceLogsConfiguration),
  }),
).annotations({
  identifier: "CentralizationRuleSource",
}) as any as S.Schema<CentralizationRuleSource>;
export interface LogsEncryptionConfiguration {
  EncryptionStrategy: string;
  KmsKeyArn?: string;
  EncryptionConflictResolutionStrategy?: string;
}
export const LogsEncryptionConfiguration = S.suspend(() =>
  S.Struct({
    EncryptionStrategy: S.String,
    KmsKeyArn: S.optional(S.String),
    EncryptionConflictResolutionStrategy: S.optional(S.String),
  }),
).annotations({
  identifier: "LogsEncryptionConfiguration",
}) as any as S.Schema<LogsEncryptionConfiguration>;
export interface LogsBackupConfiguration {
  Region: string;
  KmsKeyArn?: string;
}
export const LogsBackupConfiguration = S.suspend(() =>
  S.Struct({ Region: S.String, KmsKeyArn: S.optional(S.String) }),
).annotations({
  identifier: "LogsBackupConfiguration",
}) as any as S.Schema<LogsBackupConfiguration>;
export interface DestinationLogsConfiguration {
  LogsEncryptionConfiguration?: LogsEncryptionConfiguration;
  BackupConfiguration?: LogsBackupConfiguration;
}
export const DestinationLogsConfiguration = S.suspend(() =>
  S.Struct({
    LogsEncryptionConfiguration: S.optional(LogsEncryptionConfiguration),
    BackupConfiguration: S.optional(LogsBackupConfiguration),
  }),
).annotations({
  identifier: "DestinationLogsConfiguration",
}) as any as S.Schema<DestinationLogsConfiguration>;
export interface CentralizationRuleDestination {
  Region: string;
  Account?: string;
  DestinationLogsConfiguration?: DestinationLogsConfiguration;
}
export const CentralizationRuleDestination = S.suspend(() =>
  S.Struct({
    Region: S.String,
    Account: S.optional(S.String),
    DestinationLogsConfiguration: S.optional(DestinationLogsConfiguration),
  }),
).annotations({
  identifier: "CentralizationRuleDestination",
}) as any as S.Schema<CentralizationRuleDestination>;
export interface CentralizationRule {
  Source: CentralizationRuleSource;
  Destination: CentralizationRuleDestination;
}
export const CentralizationRule = S.suspend(() =>
  S.Struct({
    Source: CentralizationRuleSource,
    Destination: CentralizationRuleDestination,
  }),
).annotations({
  identifier: "CentralizationRule",
}) as any as S.Schema<CentralizationRule>;
export interface UpdateCentralizationRuleForOrganizationInput {
  RuleIdentifier: string;
  Rule: CentralizationRule;
}
export const UpdateCentralizationRuleForOrganizationInput = S.suspend(() =>
  S.Struct({ RuleIdentifier: S.String, Rule: CentralizationRule }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/UpdateCentralizationRuleForOrganization",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCentralizationRuleForOrganizationInput",
}) as any as S.Schema<UpdateCentralizationRuleForOrganizationInput>;
export interface UpdateTelemetryRuleInput {
  RuleIdentifier: string;
  Rule: TelemetryRule;
}
export const UpdateTelemetryRuleInput = S.suspend(() =>
  S.Struct({ RuleIdentifier: S.String, Rule: TelemetryRule }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateTelemetryRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTelemetryRuleInput",
}) as any as S.Schema<UpdateTelemetryRuleInput>;
export interface UpdateTelemetryRuleForOrganizationInput {
  RuleIdentifier: string;
  Rule: TelemetryRule;
}
export const UpdateTelemetryRuleForOrganizationInput = S.suspend(() =>
  S.Struct({ RuleIdentifier: S.String, Rule: TelemetryRule }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateTelemetryRuleForOrganization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTelemetryRuleForOrganizationInput",
}) as any as S.Schema<UpdateTelemetryRuleForOrganizationInput>;
export interface TelemetryPipelineConfiguration {
  Body: string;
}
export const TelemetryPipelineConfiguration = S.suspend(() =>
  S.Struct({ Body: S.String }),
).annotations({
  identifier: "TelemetryPipelineConfiguration",
}) as any as S.Schema<TelemetryPipelineConfiguration>;
export interface ValidateTelemetryPipelineConfigurationInput {
  Configuration: TelemetryPipelineConfiguration;
}
export const ValidateTelemetryPipelineConfigurationInput = S.suspend(() =>
  S.Struct({ Configuration: TelemetryPipelineConfiguration }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ValidateTelemetryPipelineConfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidateTelemetryPipelineConfigurationInput",
}) as any as S.Schema<ValidateTelemetryPipelineConfigurationInput>;
export interface CreateTelemetryPipelineInput {
  Name: string;
  Configuration: TelemetryPipelineConfiguration;
  Tags?: TagMapInput;
}
export const CreateTelemetryPipelineInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Configuration: TelemetryPipelineConfiguration,
    Tags: S.optional(TagMapInput),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateTelemetryPipeline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTelemetryPipelineInput",
}) as any as S.Schema<CreateTelemetryPipelineInput>;
export interface GetTelemetryPipelineInput {
  PipelineIdentifier: string;
}
export const GetTelemetryPipelineInput = S.suspend(() =>
  S.Struct({ PipelineIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTelemetryPipeline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTelemetryPipelineInput",
}) as any as S.Schema<GetTelemetryPipelineInput>;
export interface UpdateTelemetryPipelineInput {
  PipelineIdentifier: string;
  Configuration: TelemetryPipelineConfiguration;
}
export const UpdateTelemetryPipelineInput = S.suspend(() =>
  S.Struct({
    PipelineIdentifier: S.String,
    Configuration: TelemetryPipelineConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateTelemetryPipeline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTelemetryPipelineInput",
}) as any as S.Schema<UpdateTelemetryPipelineInput>;
export interface UpdateTelemetryPipelineOutput {}
export const UpdateTelemetryPipelineOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTelemetryPipelineOutput",
}) as any as S.Schema<UpdateTelemetryPipelineOutput>;
export interface DeleteTelemetryPipelineInput {
  PipelineIdentifier: string;
}
export const DeleteTelemetryPipelineInput = S.suspend(() =>
  S.Struct({ PipelineIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteTelemetryPipeline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTelemetryPipelineInput",
}) as any as S.Schema<DeleteTelemetryPipelineInput>;
export interface DeleteTelemetryPipelineOutput {}
export const DeleteTelemetryPipelineOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTelemetryPipelineOutput",
}) as any as S.Schema<DeleteTelemetryPipelineOutput>;
export interface ListTelemetryPipelinesInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListTelemetryPipelinesInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTelemetryPipelines" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTelemetryPipelinesInput",
}) as any as S.Schema<ListTelemetryPipelinesInput>;
export interface Encryption {
  SseAlgorithm: string;
  KmsKeyArn?: string;
}
export const Encryption = S.suspend(() =>
  S.Struct({ SseAlgorithm: S.String, KmsKeyArn: S.optional(S.String) }),
).annotations({ identifier: "Encryption" }) as any as S.Schema<Encryption>;
export interface Record {
  Data?: string;
  Type?: string;
}
export const Record = S.suspend(() =>
  S.Struct({ Data: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type Records = Record[];
export const Records = S.Array(Record);
export interface CreateS3TableIntegrationInput {
  Encryption: Encryption;
  RoleArn: string;
  Tags?: TagMapInput;
}
export const CreateS3TableIntegrationInput = S.suspend(() =>
  S.Struct({
    Encryption: Encryption,
    RoleArn: S.String,
    Tags: S.optional(TagMapInput),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateS3TableIntegration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateS3TableIntegrationInput",
}) as any as S.Schema<CreateS3TableIntegrationInput>;
export interface CreateTelemetryRuleForOrganizationOutput {
  RuleArn?: string;
}
export const CreateTelemetryRuleForOrganizationOutput = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateTelemetryRuleForOrganizationOutput",
}) as any as S.Schema<CreateTelemetryRuleForOrganizationOutput>;
export interface GetCentralizationRuleForOrganizationOutput {
  RuleName?: string;
  RuleArn?: string;
  CreatorAccountId?: string;
  CreatedTimeStamp?: number;
  CreatedRegion?: string;
  LastUpdateTimeStamp?: number;
  RuleHealth?: string;
  FailureReason?: string;
  CentralizationRule?: CentralizationRule;
}
export const GetCentralizationRuleForOrganizationOutput = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    RuleArn: S.optional(S.String),
    CreatorAccountId: S.optional(S.String),
    CreatedTimeStamp: S.optional(S.Number),
    CreatedRegion: S.optional(S.String),
    LastUpdateTimeStamp: S.optional(S.Number),
    RuleHealth: S.optional(S.String),
    FailureReason: S.optional(S.String),
    CentralizationRule: S.optional(CentralizationRule),
  }),
).annotations({
  identifier: "GetCentralizationRuleForOrganizationOutput",
}) as any as S.Schema<GetCentralizationRuleForOrganizationOutput>;
export interface GetS3TableIntegrationOutput {
  Arn?: string;
  RoleArn?: string;
  Status?: string;
  Encryption?: Encryption;
  DestinationTableBucketArn?: string;
  CreatedTimeStamp?: number;
}
export const GetS3TableIntegrationOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Status: S.optional(S.String),
    Encryption: S.optional(Encryption),
    DestinationTableBucketArn: S.optional(S.String),
    CreatedTimeStamp: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetS3TableIntegrationOutput",
}) as any as S.Schema<GetS3TableIntegrationOutput>;
export interface GetTelemetryRuleOutput {
  RuleName?: string;
  RuleArn?: string;
  CreatedTimeStamp?: number;
  LastUpdateTimeStamp?: number;
  TelemetryRule?: TelemetryRule;
}
export const GetTelemetryRuleOutput = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    RuleArn: S.optional(S.String),
    CreatedTimeStamp: S.optional(S.Number),
    LastUpdateTimeStamp: S.optional(S.Number),
    TelemetryRule: S.optional(TelemetryRule),
  }),
).annotations({
  identifier: "GetTelemetryRuleOutput",
}) as any as S.Schema<GetTelemetryRuleOutput>;
export interface GetTelemetryRuleForOrganizationOutput {
  RuleName?: string;
  RuleArn?: string;
  CreatedTimeStamp?: number;
  LastUpdateTimeStamp?: number;
  TelemetryRule?: TelemetryRule;
}
export const GetTelemetryRuleForOrganizationOutput = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    RuleArn: S.optional(S.String),
    CreatedTimeStamp: S.optional(S.Number),
    LastUpdateTimeStamp: S.optional(S.Number),
    TelemetryRule: S.optional(TelemetryRule),
  }),
).annotations({
  identifier: "GetTelemetryRuleForOrganizationOutput",
}) as any as S.Schema<GetTelemetryRuleForOrganizationOutput>;
export interface ListResourceTelemetryInput {
  ResourceIdentifierPrefix?: string;
  ResourceTypes?: ResourceTypes;
  TelemetryConfigurationState?: TelemetryConfigurationState;
  ResourceTags?: TagMapInput;
  MaxResults?: number;
  NextToken?: string;
}
export const ListResourceTelemetryInput = S.suspend(() =>
  S.Struct({
    ResourceIdentifierPrefix: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypes),
    TelemetryConfigurationState: S.optional(TelemetryConfigurationState),
    ResourceTags: S.optional(TagMapInput),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListResourceTelemetry" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceTelemetryInput",
}) as any as S.Schema<ListResourceTelemetryInput>;
export interface TelemetryRuleSummary {
  RuleName?: string;
  RuleArn?: string;
  CreatedTimeStamp?: number;
  LastUpdateTimeStamp?: number;
  ResourceType?: string;
  TelemetryType?: string;
  TelemetrySourceTypes?: TelemetrySourceTypes;
}
export const TelemetryRuleSummary = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    RuleArn: S.optional(S.String),
    CreatedTimeStamp: S.optional(S.Number),
    LastUpdateTimeStamp: S.optional(S.Number),
    ResourceType: S.optional(S.String),
    TelemetryType: S.optional(S.String),
    TelemetrySourceTypes: S.optional(TelemetrySourceTypes),
  }),
).annotations({
  identifier: "TelemetryRuleSummary",
}) as any as S.Schema<TelemetryRuleSummary>;
export type TelemetryRuleSummaries = TelemetryRuleSummary[];
export const TelemetryRuleSummaries = S.Array(TelemetryRuleSummary);
export interface ListTelemetryRulesForOrganizationOutput {
  TelemetryRuleSummaries?: TelemetryRuleSummaries;
  NextToken?: string;
}
export const ListTelemetryRulesForOrganizationOutput = S.suspend(() =>
  S.Struct({
    TelemetryRuleSummaries: S.optional(TelemetryRuleSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTelemetryRulesForOrganizationOutput",
}) as any as S.Schema<ListTelemetryRulesForOrganizationOutput>;
export interface TestTelemetryPipelineInput {
  Records: Records;
  Configuration: TelemetryPipelineConfiguration;
}
export const TestTelemetryPipelineInput = S.suspend(() =>
  S.Struct({
    Records: Records,
    Configuration: TelemetryPipelineConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TestTelemetryPipeline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestTelemetryPipelineInput",
}) as any as S.Schema<TestTelemetryPipelineInput>;
export interface UpdateCentralizationRuleForOrganizationOutput {
  RuleArn?: string;
}
export const UpdateCentralizationRuleForOrganizationOutput = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateCentralizationRuleForOrganizationOutput",
}) as any as S.Schema<UpdateCentralizationRuleForOrganizationOutput>;
export interface UpdateTelemetryRuleOutput {
  RuleArn?: string;
}
export const UpdateTelemetryRuleOutput = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateTelemetryRuleOutput",
}) as any as S.Schema<UpdateTelemetryRuleOutput>;
export interface UpdateTelemetryRuleForOrganizationOutput {
  RuleArn?: string;
}
export const UpdateTelemetryRuleForOrganizationOutput = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateTelemetryRuleForOrganizationOutput",
}) as any as S.Schema<UpdateTelemetryRuleForOrganizationOutput>;
export interface CreateTelemetryPipelineOutput {
  Arn?: string;
}
export const CreateTelemetryPipelineOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateTelemetryPipelineOutput",
}) as any as S.Schema<CreateTelemetryPipelineOutput>;
export interface CentralizationRuleSummary {
  RuleName?: string;
  RuleArn?: string;
  CreatorAccountId?: string;
  CreatedTimeStamp?: number;
  CreatedRegion?: string;
  LastUpdateTimeStamp?: number;
  RuleHealth?: string;
  FailureReason?: string;
  DestinationAccountId?: string;
  DestinationRegion?: string;
}
export const CentralizationRuleSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CentralizationRuleSummary",
}) as any as S.Schema<CentralizationRuleSummary>;
export type CentralizationRuleSummaries = CentralizationRuleSummary[];
export const CentralizationRuleSummaries = S.Array(CentralizationRuleSummary);
export type TagMapOutput = { [key: string]: string };
export const TagMapOutput = S.Record({ key: S.String, value: S.String });
export interface TelemetryConfiguration {
  AccountIdentifier?: string;
  TelemetryConfigurationState?: TelemetryConfigurationState;
  ResourceType?: string;
  ResourceIdentifier?: string;
  ResourceTags?: TagMapOutput;
  LastUpdateTimeStamp?: number;
}
export const TelemetryConfiguration = S.suspend(() =>
  S.Struct({
    AccountIdentifier: S.optional(S.String),
    TelemetryConfigurationState: S.optional(TelemetryConfigurationState),
    ResourceType: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    ResourceTags: S.optional(TagMapOutput),
    LastUpdateTimeStamp: S.optional(S.Number),
  }),
).annotations({
  identifier: "TelemetryConfiguration",
}) as any as S.Schema<TelemetryConfiguration>;
export type TelemetryConfigurations = TelemetryConfiguration[];
export const TelemetryConfigurations = S.Array(TelemetryConfiguration);
export interface IntegrationSummary {
  Arn?: string;
  Status?: string;
}
export const IntegrationSummary = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "IntegrationSummary",
}) as any as S.Schema<IntegrationSummary>;
export type IntegrationSummaries = IntegrationSummary[];
export const IntegrationSummaries = S.Array(IntegrationSummary);
export type Processors = string[];
export const Processors = S.Array(S.String);
export type Sinks = string[];
export const Sinks = S.Array(S.String);
export interface CreateS3TableIntegrationOutput {
  Arn?: string;
}
export const CreateS3TableIntegrationOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateS3TableIntegrationOutput",
}) as any as S.Schema<CreateS3TableIntegrationOutput>;
export interface ListCentralizationRulesForOrganizationOutput {
  CentralizationRuleSummaries?: CentralizationRuleSummaries;
  NextToken?: string;
}
export const ListCentralizationRulesForOrganizationOutput = S.suspend(() =>
  S.Struct({
    CentralizationRuleSummaries: S.optional(CentralizationRuleSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCentralizationRulesForOrganizationOutput",
}) as any as S.Schema<ListCentralizationRulesForOrganizationOutput>;
export interface ListResourceTelemetryOutput {
  TelemetryConfigurations?: TelemetryConfigurations;
  NextToken?: string;
}
export const ListResourceTelemetryOutput = S.suspend(() =>
  S.Struct({
    TelemetryConfigurations: S.optional(TelemetryConfigurations),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceTelemetryOutput",
}) as any as S.Schema<ListResourceTelemetryOutput>;
export interface ListResourceTelemetryForOrganizationOutput {
  TelemetryConfigurations?: TelemetryConfigurations;
  NextToken?: string;
}
export const ListResourceTelemetryForOrganizationOutput = S.suspend(() =>
  S.Struct({
    TelemetryConfigurations: S.optional(TelemetryConfigurations),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceTelemetryForOrganizationOutput",
}) as any as S.Schema<ListResourceTelemetryForOrganizationOutput>;
export interface ListS3TableIntegrationsOutput {
  IntegrationSummaries?: IntegrationSummaries;
  NextToken?: string;
}
export const ListS3TableIntegrationsOutput = S.suspend(() =>
  S.Struct({
    IntegrationSummaries: S.optional(IntegrationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListS3TableIntegrationsOutput",
}) as any as S.Schema<ListS3TableIntegrationsOutput>;
export interface ListTagsForResourceOutput {
  Tags: TagMapOutput;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: TagMapOutput }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface ListTelemetryRulesOutput {
  TelemetryRuleSummaries?: TelemetryRuleSummaries;
  NextToken?: string;
}
export const ListTelemetryRulesOutput = S.suspend(() =>
  S.Struct({
    TelemetryRuleSummaries: S.optional(TelemetryRuleSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTelemetryRulesOutput",
}) as any as S.Schema<ListTelemetryRulesOutput>;
export type FieldMap = { [key: string]: string };
export const FieldMap = S.Record({ key: S.String, value: S.String });
export interface TelemetryPipelineStatusReason {
  Description?: string;
}
export const TelemetryPipelineStatusReason = S.suspend(() =>
  S.Struct({ Description: S.optional(S.String) }),
).annotations({
  identifier: "TelemetryPipelineStatusReason",
}) as any as S.Schema<TelemetryPipelineStatusReason>;
export interface ValidationError {
  Message?: string;
  Reason?: string;
  FieldMap?: FieldMap;
}
export const ValidationError = S.suspend(() =>
  S.Struct({
    Message: S.optional(S.String),
    Reason: S.optional(S.String),
    FieldMap: S.optional(FieldMap),
  }),
).annotations({
  identifier: "ValidationError",
}) as any as S.Schema<ValidationError>;
export type ValidationErrors = ValidationError[];
export const ValidationErrors = S.Array(ValidationError);
export interface TelemetryPipeline {
  CreatedTimeStamp?: number;
  LastUpdateTimeStamp?: number;
  Arn?: string;
  Name?: string;
  Configuration?: TelemetryPipelineConfiguration;
  Status?: string;
  StatusReason?: TelemetryPipelineStatusReason;
  Tags?: TagMapOutput;
}
export const TelemetryPipeline = S.suspend(() =>
  S.Struct({
    CreatedTimeStamp: S.optional(S.Number),
    LastUpdateTimeStamp: S.optional(S.Number),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Configuration: S.optional(TelemetryPipelineConfiguration),
    Status: S.optional(S.String),
    StatusReason: S.optional(TelemetryPipelineStatusReason),
    Tags: S.optional(TagMapOutput),
  }),
).annotations({
  identifier: "TelemetryPipeline",
}) as any as S.Schema<TelemetryPipeline>;
export interface Source {
  Type?: string;
}
export const Source = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String) }),
).annotations({ identifier: "Source" }) as any as S.Schema<Source>;
export type Sources = Source[];
export const Sources = S.Array(Source);
export interface DataSource {
  Name?: string;
  Type?: string;
}
export const DataSource = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export type DataSources = DataSource[];
export const DataSources = S.Array(DataSource);
export interface ValidateTelemetryPipelineConfigurationOutput {
  Errors?: ValidationErrors;
}
export const ValidateTelemetryPipelineConfigurationOutput = S.suspend(() =>
  S.Struct({ Errors: S.optional(ValidationErrors) }),
).annotations({
  identifier: "ValidateTelemetryPipelineConfigurationOutput",
}) as any as S.Schema<ValidateTelemetryPipelineConfigurationOutput>;
export interface GetTelemetryPipelineOutput {
  Pipeline?: TelemetryPipeline;
}
export const GetTelemetryPipelineOutput = S.suspend(() =>
  S.Struct({ Pipeline: S.optional(TelemetryPipeline) }),
).annotations({
  identifier: "GetTelemetryPipelineOutput",
}) as any as S.Schema<GetTelemetryPipelineOutput>;
export interface PipelineOutputError {
  Message?: string;
}
export const PipelineOutputError = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "PipelineOutputError",
}) as any as S.Schema<PipelineOutputError>;
export interface ConfigurationSummary {
  Sources?: Sources;
  DataSources?: DataSources;
  Processors?: Processors;
  ProcessorCount?: number;
  Sinks?: Sinks;
}
export const ConfigurationSummary = S.suspend(() =>
  S.Struct({
    Sources: S.optional(Sources),
    DataSources: S.optional(DataSources),
    Processors: S.optional(Processors),
    ProcessorCount: S.optional(S.Number),
    Sinks: S.optional(Sinks),
  }),
).annotations({
  identifier: "ConfigurationSummary",
}) as any as S.Schema<ConfigurationSummary>;
export interface PipelineOutput {
  Record?: Record;
  Error?: PipelineOutputError;
}
export const PipelineOutput = S.suspend(() =>
  S.Struct({
    Record: S.optional(Record),
    Error: S.optional(PipelineOutputError),
  }),
).annotations({
  identifier: "PipelineOutput",
}) as any as S.Schema<PipelineOutput>;
export type PipelineOutputs = PipelineOutput[];
export const PipelineOutputs = S.Array(PipelineOutput);
export interface TelemetryPipelineSummary {
  CreatedTimeStamp?: number;
  LastUpdateTimeStamp?: number;
  Arn?: string;
  Name?: string;
  Status?: string;
  Tags?: TagMapOutput;
  ConfigurationSummary?: ConfigurationSummary;
}
export const TelemetryPipelineSummary = S.suspend(() =>
  S.Struct({
    CreatedTimeStamp: S.optional(S.Number),
    LastUpdateTimeStamp: S.optional(S.Number),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    Tags: S.optional(TagMapOutput),
    ConfigurationSummary: S.optional(ConfigurationSummary),
  }),
).annotations({
  identifier: "TelemetryPipelineSummary",
}) as any as S.Schema<TelemetryPipelineSummary>;
export type TelemetryPipelineSummaries = TelemetryPipelineSummary[];
export const TelemetryPipelineSummaries = S.Array(TelemetryPipelineSummary);
export interface CreateCentralizationRuleForOrganizationInput {
  RuleName: string;
  Rule: CentralizationRule;
  Tags?: TagMapInput;
}
export const CreateCentralizationRuleForOrganizationInput = S.suspend(() =>
  S.Struct({
    RuleName: S.String,
    Rule: CentralizationRule,
    Tags: S.optional(TagMapInput),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/CreateCentralizationRuleForOrganization",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCentralizationRuleForOrganizationInput",
}) as any as S.Schema<CreateCentralizationRuleForOrganizationInput>;
export interface TestTelemetryPipelineOutput {
  Results?: PipelineOutputs;
}
export const TestTelemetryPipelineOutput = S.suspend(() =>
  S.Struct({ Results: S.optional(PipelineOutputs) }),
).annotations({
  identifier: "TestTelemetryPipelineOutput",
}) as any as S.Schema<TestTelemetryPipelineOutput>;
export interface ListTelemetryPipelinesOutput {
  PipelineSummaries?: TelemetryPipelineSummaries;
  NextToken?: string;
}
export const ListTelemetryPipelinesOutput = S.suspend(() =>
  S.Struct({
    PipelineSummaries: S.optional(TelemetryPipelineSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTelemetryPipelinesOutput",
}) as any as S.Schema<ListTelemetryPipelinesOutput>;
export interface CreateCentralizationRuleForOrganizationOutput {
  RuleArn?: string;
}
export const CreateCentralizationRuleForOrganizationOutput = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateCentralizationRuleForOrganizationOutput",
}) as any as S.Schema<CreateCentralizationRuleForOrganizationOutput>;
export interface CreateTelemetryRuleInput {
  RuleName: string;
  Rule: TelemetryRule;
  Tags?: TagMapInput;
}
export const CreateTelemetryRuleInput = S.suspend(() =>
  S.Struct({
    RuleName: S.String,
    Rule: TelemetryRule,
    Tags: S.optional(TagMapInput),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateTelemetryRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTelemetryRuleInput",
}) as any as S.Schema<CreateTelemetryRuleInput>;
export interface CreateTelemetryRuleOutput {
  RuleArn?: string;
}
export const CreateTelemetryRuleOutput = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateTelemetryRuleOutput",
}) as any as S.Schema<CreateTelemetryRuleOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
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
).pipe(C.withQuotaError) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String), Errors: S.optional(ValidationErrors) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Disables the resource tags for telemetry feature for your account, stopping the enhancement of telemetry data with additional resource metadata.
 */
export const stopTelemetryEnrichment: (
  input: StopTelemetryEnrichmentRequest,
) => Effect.Effect<
  StopTelemetryEnrichmentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopTelemetryEnrichmentRequest,
  output: StopTelemetryEnrichmentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns the current onboarding status of the telemetry config feature, including the status of the feature and reason the feature failed to start or stop.
 */
export const getTelemetryEvaluationStatus: (
  input: GetTelemetryEvaluationStatusRequest,
) => Effect.Effect<
  GetTelemetryEvaluationStatusOutput,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startTelemetryEnrichment: (
  input: StartTelemetryEnrichmentRequest,
) => Effect.Effect<
  StartTelemetryEnrichmentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTelemetryEnrichmentRequest,
  output: StartTelemetryEnrichmentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns the current status of the resource tags for telemetry feature, which enhances telemetry data with additional resource metadata from Resource Explorer.
 */
export const getTelemetryEnrichmentStatus: (
  input: GetTelemetryEnrichmentStatusRequest,
) => Effect.Effect<
  GetTelemetryEnrichmentStatusOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startTelemetryEvaluation: (
  input: StartTelemetryEvaluationRequest,
) => Effect.Effect<
  StartTelemetryEvaluationResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTelemetryEvaluationRequest,
  output: StartTelemetryEvaluationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Validates a pipeline configuration without creating the pipeline. This operation checks the configuration for syntax errors and compatibility issues.
 */
export const validateTelemetryPipelineConfiguration: (
  input: ValidateTelemetryPipelineConfigurationInput,
) => Effect.Effect<
  ValidateTelemetryPipelineConfigurationOutput,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTelemetryPipeline: (
  input: GetTelemetryPipelineInput,
) => Effect.Effect<
  GetTelemetryPipelineOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTelemetryPipelineInput,
  output: GetTelemetryPipelineOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Creates a telemetry pipeline for processing and transforming telemetry data. The pipeline defines how data flows from sources through processors to destinations, enabling data transformation and delivering capabilities.
 */
export const createTelemetryPipeline: (
  input: CreateTelemetryPipelineInput,
) => Effect.Effect<
  CreateTelemetryPipelineOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes an S3 Table integration and its associated data. This operation removes the connection between CloudWatch Observability Admin and S3 Tables.
 */
export const deleteS3TableIntegration: (
  input: DeleteS3TableIntegrationInput,
) => Effect.Effect<
  DeleteS3TableIntegrationResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidStateException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * This actions begins onboarding the organization and all member accounts to the telemetry config feature.
 */
export const startTelemetryEvaluationForOrganization: (
  input: StartTelemetryEvaluationForOrganizationRequest,
) => Effect.Effect<
  StartTelemetryEvaluationForOrganizationResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopTelemetryEvaluation: (
  input: StopTelemetryEvaluationRequest,
) => Effect.Effect<
  StopTelemetryEvaluationResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopTelemetryEvaluationRequest,
  output: StopTelemetryEvaluationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * This action offboards the Organization of the caller Amazon Web Services account from the telemetry config feature.
 */
export const stopTelemetryEvaluationForOrganization: (
  input: StopTelemetryEvaluationForOrganizationRequest,
) => Effect.Effect<
  StopTelemetryEvaluationForOrganizationResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTelemetryEvaluationStatusForOrganization: (
  input: GetTelemetryEvaluationStatusForOrganizationRequest,
) => Effect.Effect<
  GetTelemetryEvaluationStatusForOrganizationOutput,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTelemetryRulesForOrganization: {
  (
    input: ListTelemetryRulesForOrganizationInput,
  ): Effect.Effect<
    ListTelemetryRulesForOrganizationOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTelemetryRulesForOrganizationInput,
  ) => Stream.Stream<
    ListTelemetryRulesForOrganizationOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTelemetryRulesForOrganizationInput,
  ) => Stream.Stream<
    TelemetryRuleSummary,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCentralizationRulesForOrganization: {
  (
    input: ListCentralizationRulesForOrganizationInput,
  ): Effect.Effect<
    ListCentralizationRulesForOrganizationOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListCentralizationRulesForOrganizationInput,
  ) => Stream.Stream<
    ListCentralizationRulesForOrganizationOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListCentralizationRulesForOrganizationInput,
  ) => Stream.Stream<
    CentralizationRuleSummary,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listResourceTelemetry: {
  (
    input: ListResourceTelemetryInput,
  ): Effect.Effect<
    ListResourceTelemetryOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceTelemetryInput,
  ) => Stream.Stream<
    ListResourceTelemetryOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceTelemetryInput,
  ) => Stream.Stream<
    TelemetryConfiguration,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listResourceTelemetryForOrganization: {
  (
    input: ListResourceTelemetryForOrganizationInput,
  ): Effect.Effect<
    ListResourceTelemetryForOrganizationOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceTelemetryForOrganizationInput,
  ) => Stream.Stream<
    ListResourceTelemetryForOrganizationOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceTelemetryForOrganizationInput,
  ) => Stream.Stream<
    TelemetryConfiguration,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listS3TableIntegrations: {
  (
    input: ListS3TableIntegrationsInput,
  ): Effect.Effect<
    ListS3TableIntegrationsOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListS3TableIntegrationsInput,
  ) => Stream.Stream<
    ListS3TableIntegrationsOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListS3TableIntegrationsInput,
  ) => Stream.Stream<
    IntegrationSummary,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTelemetryRules: {
  (
    input: ListTelemetryRulesInput,
  ): Effect.Effect<
    ListTelemetryRulesOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTelemetryRulesInput,
  ) => Stream.Stream<
    ListTelemetryRulesOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTelemetryRulesInput,
  ) => Stream.Stream<
    TelemetryRuleSummary,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Updates an existing telemetry rule in your account. If multiple users attempt to modify the same telemetry rule simultaneously, a ConflictException is returned to provide specific error information for concurrent modification scenarios.
 */
export const updateTelemetryRule: (
  input: UpdateTelemetryRuleInput,
) => Effect.Effect<
  UpdateTelemetryRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTelemetryRuleForOrganization: (
  input: UpdateTelemetryRuleForOrganizationInput,
) => Effect.Effect<
  UpdateTelemetryRuleForOrganizationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTelemetryPipeline: (
  input: UpdateTelemetryPipelineInput,
) => Effect.Effect<
  UpdateTelemetryPipelineOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTelemetryPipelineInput,
  output: UpdateTelemetryPipelineOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Deletes an organization-wide centralization rule. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const deleteCentralizationRuleForOrganization: (
  input: DeleteCentralizationRuleForOrganizationInput,
) => Effect.Effect<
  DeleteCentralizationRuleForOrganizationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTelemetryRule: (
  input: DeleteTelemetryRuleInput,
) => Effect.Effect<
  DeleteTelemetryRuleResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTelemetryRuleForOrganization: (
  input: DeleteTelemetryRuleForOrganizationInput,
) => Effect.Effect<
  DeleteTelemetryRuleForOrganizationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCentralizationRuleForOrganization: (
  input: GetCentralizationRuleForOrganizationInput,
) => Effect.Effect<
  GetCentralizationRuleForOrganizationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getS3TableIntegration: (
  input: GetS3TableIntegrationInput,
) => Effect.Effect<
  GetS3TableIntegrationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetS3TableIntegrationInput,
  output: GetS3TableIntegrationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Retrieves the details of a specific telemetry rule in your account.
 */
export const getTelemetryRule: (
  input: GetTelemetryRuleInput,
) => Effect.Effect<
  GetTelemetryRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTelemetryRuleForOrganization: (
  input: GetTelemetryRuleForOrganizationInput,
) => Effect.Effect<
  GetTelemetryRuleForOrganizationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTelemetryPipeline: (
  input: DeleteTelemetryPipelineInput,
) => Effect.Effect<
  DeleteTelemetryPipelineOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists all tags attached to the specified resource. Supports telemetry rule resources and telemetry pipeline resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTelemetryRuleForOrganization: (
  input: CreateTelemetryRuleForOrganizationInput,
) => Effect.Effect<
  CreateTelemetryRuleForOrganizationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createS3TableIntegration: (
  input: CreateS3TableIntegrationInput,
) => Effect.Effect<
  CreateS3TableIntegrationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates an existing centralization rule that applies across an Amazon Web Services Organization. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const updateCentralizationRuleForOrganization: (
  input: UpdateCentralizationRuleForOrganizationInput,
) => Effect.Effect<
  UpdateCentralizationRuleForOrganizationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const testTelemetryPipeline: (
  input: TestTelemetryPipelineInput,
) => Effect.Effect<
  TestTelemetryPipelineOutput,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestTelemetryPipelineInput,
  output: TestTelemetryPipelineOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Returns a list of telemetry pipelines in your account. Returns up to 100 results. If more than 100 telemetry pipelines exist, include the `NextToken` value from the response to retrieve the next set of results.
 */
export const listTelemetryPipelines: {
  (
    input: ListTelemetryPipelinesInput,
  ): Effect.Effect<
    ListTelemetryPipelinesOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTelemetryPipelinesInput,
  ) => Stream.Stream<
    ListTelemetryPipelinesOutput,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTelemetryPipelinesInput,
  ) => Stream.Stream<
    TelemetryPipelineSummary,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createCentralizationRuleForOrganization: (
  input: CreateCentralizationRuleForOrganizationInput,
) => Effect.Effect<
  CreateCentralizationRuleForOrganizationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTelemetryRule: (
  input: CreateTelemetryRuleInput,
) => Effect.Effect<
  CreateTelemetryRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
