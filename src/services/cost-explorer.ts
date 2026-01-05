import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Cost Explorer",
  serviceShapeName: "AWSInsightsIndexService",
});
const auth = T.AwsAuthSigv4({ name: "ce" });
const ver = T.ServiceVersion("2017-10-25");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://ce.us-east-1.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://ce.cn-northwest-1.api.amazonwebservices.com.cn",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "cn-northwest-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://ce.us-iso-east-1.c2s.ic.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-iso-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-b",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://ce.us-isob-east-1.sc2s.sgov.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-isob-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-e",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://ce.eu-isoe-west-1.cloud.adc-e.uk",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "eu-isoe-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-f",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://ce.us-isof-south-1.csp.hci.ic.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-isof-south-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-eusc",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://ce.eusc-de-east-1.api.amazonwebservices.eu",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "eusc-de-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-eusc",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://ce.eusc-de-east-1.api.amazonwebservices.eu",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "eusc-de-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                          endpoint: {
                            url: "https://ce-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
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
                          endpoint: {
                            url: "https://ce-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
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
                          endpoint: {
                            url: "https://ce.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    url: "https://ce.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
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
      type: "tree",
    },
  ],
});

//# Schemas
export class StartSavingsPlansPurchaseRecommendationGenerationRequest extends S.Class<StartSavingsPlansPurchaseRecommendationGenerationRequest>(
  "StartSavingsPlansPurchaseRecommendationGenerationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Values = S.Array(S.String);
export const UsageServices = S.Array(S.String);
export const MetricNames = S.Array(S.String);
export const SavingsPlansDataTypes = S.Array(S.String);
export const AnalysisIds = S.Array(S.String);
export const CostAllocationTagKeyList = S.Array(S.String);
export const ResourceTypesFilterInput = S.Array(S.String);
export const RecommendationIdList = S.Array(S.String);
export const ResourceTagKeyList = S.Array(S.String);
export const MonitorArnList = S.Array(S.String);
export class DeleteAnomalyMonitorRequest extends S.Class<DeleteAnomalyMonitorRequest>(
  "DeleteAnomalyMonitorRequest",
)(
  { MonitorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAnomalyMonitorResponse extends S.Class<DeleteAnomalyMonitorResponse>(
  "DeleteAnomalyMonitorResponse",
)({}) {}
export class DeleteAnomalySubscriptionRequest extends S.Class<DeleteAnomalySubscriptionRequest>(
  "DeleteAnomalySubscriptionRequest",
)(
  { SubscriptionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAnomalySubscriptionResponse extends S.Class<DeleteAnomalySubscriptionResponse>(
  "DeleteAnomalySubscriptionResponse",
)({}) {}
export class DeleteCostCategoryDefinitionRequest extends S.Class<DeleteCostCategoryDefinitionRequest>(
  "DeleteCostCategoryDefinitionRequest",
)(
  { CostCategoryArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCostCategoryDefinitionRequest extends S.Class<DescribeCostCategoryDefinitionRequest>(
  "DescribeCostCategoryDefinitionRequest",
)(
  { CostCategoryArn: S.String, EffectiveOn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAnomalyMonitorsRequest extends S.Class<GetAnomalyMonitorsRequest>(
  "GetAnomalyMonitorsRequest",
)(
  {
    MonitorArnList: S.optional(Values),
    NextPageToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAnomalySubscriptionsRequest extends S.Class<GetAnomalySubscriptionsRequest>(
  "GetAnomalySubscriptionsRequest",
)(
  {
    SubscriptionArnList: S.optional(Values),
    MonitorArn: S.optional(S.String),
    NextPageToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetApproximateUsageRecordsRequest extends S.Class<GetApproximateUsageRecordsRequest>(
  "GetApproximateUsageRecordsRequest",
)(
  {
    Granularity: S.String,
    Services: S.optional(UsageServices),
    ApproximationDimension: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCommitmentPurchaseAnalysisRequest extends S.Class<GetCommitmentPurchaseAnalysisRequest>(
  "GetCommitmentPurchaseAnalysisRequest",
)(
  { AnalysisId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DateInterval extends S.Class<DateInterval>("DateInterval")({
  Start: S.String,
  End: S.String,
}) {}
export const MatchOptions = S.Array(S.String);
export class DimensionValues extends S.Class<DimensionValues>(
  "DimensionValues",
)({
  Key: S.optional(S.String),
  Values: S.optional(Values),
  MatchOptions: S.optional(MatchOptions),
}) {}
export class TagValues extends S.Class<TagValues>("TagValues")({
  Key: S.optional(S.String),
  Values: S.optional(Values),
  MatchOptions: S.optional(MatchOptions),
}) {}
export class CostCategoryValues extends S.Class<CostCategoryValues>(
  "CostCategoryValues",
)({
  Key: S.optional(S.String),
  Values: S.optional(Values),
  MatchOptions: S.optional(MatchOptions),
}) {}
export class Expression extends S.Class<Expression>("Expression")({
  Or: S.optional(S.suspend(() => Expressions)),
  And: S.optional(S.suspend(() => Expressions)),
  Not: S.optional(S.suspend((): S.Schema<Expression, any> => Expression)),
  Dimensions: S.optional(DimensionValues),
  Tags: S.optional(TagValues),
  CostCategories: S.optional(CostCategoryValues),
}) {}
export class GroupDefinition extends S.Class<GroupDefinition>(
  "GroupDefinition",
)({ Type: S.optional(S.String), Key: S.optional(S.String) }) {}
export const GroupDefinitions = S.Array(GroupDefinition);
export class GetCostAndUsageComparisonsRequest extends S.Class<GetCostAndUsageComparisonsRequest>(
  "GetCostAndUsageComparisonsRequest",
)(
  {
    BillingViewArn: S.optional(S.String),
    BaselineTimePeriod: DateInterval,
    ComparisonTimePeriod: DateInterval,
    MetricForComparison: S.String,
    Filter: S.optional(Expression),
    GroupBy: S.optional(GroupDefinitions),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCostAndUsageWithResourcesRequest extends S.Class<GetCostAndUsageWithResourcesRequest>(
  "GetCostAndUsageWithResourcesRequest",
)(
  {
    TimePeriod: DateInterval,
    Granularity: S.String,
    Filter: Expression,
    Metrics: S.optional(MetricNames),
    GroupBy: S.optional(GroupDefinitions),
    BillingViewArn: S.optional(S.String),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCostComparisonDriversRequest extends S.Class<GetCostComparisonDriversRequest>(
  "GetCostComparisonDriversRequest",
)(
  {
    BillingViewArn: S.optional(S.String),
    BaselineTimePeriod: DateInterval,
    ComparisonTimePeriod: DateInterval,
    MetricForComparison: S.String,
    Filter: S.optional(Expression),
    GroupBy: S.optional(GroupDefinitions),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCostForecastRequest extends S.Class<GetCostForecastRequest>(
  "GetCostForecastRequest",
)(
  {
    TimePeriod: DateInterval,
    Metric: S.String,
    Granularity: S.String,
    Filter: S.optional(Expression),
    BillingViewArn: S.optional(S.String),
    PredictionIntervalLevel: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SortDefinition extends S.Class<SortDefinition>("SortDefinition")({
  Key: S.String,
  SortOrder: S.optional(S.String),
}) {}
export const SortDefinitions = S.Array(SortDefinition);
export class GetDimensionValuesRequest extends S.Class<GetDimensionValuesRequest>(
  "GetDimensionValuesRequest",
)(
  {
    SearchString: S.optional(S.String),
    TimePeriod: DateInterval,
    Dimension: S.String,
    Context: S.optional(S.String),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinitions),
    BillingViewArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetReservationCoverageRequest extends S.Class<GetReservationCoverageRequest>(
  "GetReservationCoverageRequest",
)(
  {
    TimePeriod: DateInterval,
    GroupBy: S.optional(GroupDefinitions),
    Granularity: S.optional(S.String),
    Filter: S.optional(Expression),
    Metrics: S.optional(MetricNames),
    NextPageToken: S.optional(S.String),
    SortBy: S.optional(SortDefinition),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetReservationUtilizationRequest extends S.Class<GetReservationUtilizationRequest>(
  "GetReservationUtilizationRequest",
)(
  {
    TimePeriod: DateInterval,
    GroupBy: S.optional(GroupDefinitions),
    Granularity: S.optional(S.String),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinition),
    NextPageToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSavingsPlanPurchaseRecommendationDetailsRequest extends S.Class<GetSavingsPlanPurchaseRecommendationDetailsRequest>(
  "GetSavingsPlanPurchaseRecommendationDetailsRequest",
)(
  { RecommendationDetailId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSavingsPlansCoverageRequest extends S.Class<GetSavingsPlansCoverageRequest>(
  "GetSavingsPlansCoverageRequest",
)(
  {
    TimePeriod: DateInterval,
    GroupBy: S.optional(GroupDefinitions),
    Granularity: S.optional(S.String),
    Filter: S.optional(Expression),
    Metrics: S.optional(MetricNames),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortBy: S.optional(SortDefinition),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSavingsPlansPurchaseRecommendationRequest extends S.Class<GetSavingsPlansPurchaseRecommendationRequest>(
  "GetSavingsPlansPurchaseRecommendationRequest",
)(
  {
    SavingsPlansType: S.String,
    TermInYears: S.String,
    PaymentOption: S.String,
    AccountScope: S.optional(S.String),
    NextPageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    LookbackPeriodInDays: S.String,
    Filter: S.optional(Expression),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSavingsPlansUtilizationRequest extends S.Class<GetSavingsPlansUtilizationRequest>(
  "GetSavingsPlansUtilizationRequest",
)(
  {
    TimePeriod: DateInterval,
    Granularity: S.optional(S.String),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinition),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSavingsPlansUtilizationDetailsRequest extends S.Class<GetSavingsPlansUtilizationDetailsRequest>(
  "GetSavingsPlansUtilizationDetailsRequest",
)(
  {
    TimePeriod: DateInterval,
    Filter: S.optional(Expression),
    DataType: S.optional(SavingsPlansDataTypes),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortBy: S.optional(SortDefinition),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTagsRequest extends S.Class<GetTagsRequest>("GetTagsRequest")(
  {
    SearchString: S.optional(S.String),
    TimePeriod: DateInterval,
    TagKey: S.optional(S.String),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinitions),
    BillingViewArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUsageForecastRequest extends S.Class<GetUsageForecastRequest>(
  "GetUsageForecastRequest",
)(
  {
    TimePeriod: DateInterval,
    Metric: S.String,
    Granularity: S.String,
    Filter: S.optional(Expression),
    BillingViewArn: S.optional(S.String),
    PredictionIntervalLevel: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCommitmentPurchaseAnalysesRequest extends S.Class<ListCommitmentPurchaseAnalysesRequest>(
  "ListCommitmentPurchaseAnalysesRequest",
)(
  {
    AnalysisStatus: S.optional(S.String),
    NextPageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    AnalysisIds: S.optional(AnalysisIds),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCostAllocationTagBackfillHistoryRequest extends S.Class<ListCostAllocationTagBackfillHistoryRequest>(
  "ListCostAllocationTagBackfillHistoryRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCostAllocationTagsRequest extends S.Class<ListCostAllocationTagsRequest>(
  "ListCostAllocationTagsRequest",
)(
  {
    Status: S.optional(S.String),
    TagKeys: S.optional(CostAllocationTagKeyList),
    Type: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCostCategoryDefinitionsRequest extends S.Class<ListCostCategoryDefinitionsRequest>(
  "ListCostCategoryDefinitionsRequest",
)(
  {
    EffectiveOn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SupportedResourceTypes: S.optional(ResourceTypesFilterInput),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCostCategoryResourceAssociationsRequest extends S.Class<ListCostCategoryResourceAssociationsRequest>(
  "ListCostCategoryResourceAssociationsRequest",
)(
  {
    CostCategoryArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSavingsPlansPurchaseRecommendationGenerationRequest extends S.Class<ListSavingsPlansPurchaseRecommendationGenerationRequest>(
  "ListSavingsPlansPurchaseRecommendationGenerationRequest",
)(
  {
    GenerationStatus: S.optional(S.String),
    RecommendationIds: S.optional(RecommendationIdList),
    PageSize: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ProvideAnomalyFeedbackRequest extends S.Class<ProvideAnomalyFeedbackRequest>(
  "ProvideAnomalyFeedbackRequest",
)(
  { AnomalyId: S.String, Feedback: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartCostAllocationTagBackfillRequest extends S.Class<StartCostAllocationTagBackfillRequest>(
  "StartCostAllocationTagBackfillRequest",
)(
  { BackfillFrom: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartSavingsPlansPurchaseRecommendationGenerationResponse extends S.Class<StartSavingsPlansPurchaseRecommendationGenerationResponse>(
  "StartSavingsPlansPurchaseRecommendationGenerationResponse",
)({
  RecommendationId: S.optional(S.String),
  GenerationStartedTime: S.optional(S.String),
  EstimatedCompletionTime: S.optional(S.String),
}) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  Key: S.String,
  Value: S.String,
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, ResourceTags: ResourceTagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, ResourceTagKeys: ResourceTagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateAnomalyMonitorRequest extends S.Class<UpdateAnomalyMonitorRequest>(
  "UpdateAnomalyMonitorRequest",
)(
  { MonitorArn: S.String, MonitorName: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CostCategoryInheritedValueDimension extends S.Class<CostCategoryInheritedValueDimension>(
  "CostCategoryInheritedValueDimension",
)({
  DimensionName: S.optional(S.String),
  DimensionKey: S.optional(S.String),
}) {}
export class CostCategoryRule extends S.Class<CostCategoryRule>(
  "CostCategoryRule",
)({
  Value: S.optional(S.String),
  Rule: S.optional(Expression),
  InheritedValue: S.optional(CostCategoryInheritedValueDimension),
  Type: S.optional(S.String),
}) {}
export const CostCategoryRulesList = S.Array(CostCategoryRule);
export const CostCategorySplitChargeRuleTargetsList = S.Array(S.String);
export const CostCategorySplitChargeRuleParameterValuesList = S.Array(S.String);
export class CostCategorySplitChargeRuleParameter extends S.Class<CostCategorySplitChargeRuleParameter>(
  "CostCategorySplitChargeRuleParameter",
)({ Type: S.String, Values: CostCategorySplitChargeRuleParameterValuesList }) {}
export const CostCategorySplitChargeRuleParametersList = S.Array(
  CostCategorySplitChargeRuleParameter,
);
export class CostCategorySplitChargeRule extends S.Class<CostCategorySplitChargeRule>(
  "CostCategorySplitChargeRule",
)({
  Source: S.String,
  Targets: CostCategorySplitChargeRuleTargetsList,
  Method: S.String,
  Parameters: S.optional(CostCategorySplitChargeRuleParametersList),
}) {}
export const CostCategorySplitChargeRulesList = S.Array(
  CostCategorySplitChargeRule,
);
export class UpdateCostCategoryDefinitionRequest extends S.Class<UpdateCostCategoryDefinitionRequest>(
  "UpdateCostCategoryDefinitionRequest",
)(
  {
    CostCategoryArn: S.String,
    EffectiveStart: S.optional(S.String),
    RuleVersion: S.String,
    Rules: CostCategoryRulesList,
    DefaultValue: S.optional(S.String),
    SplitChargeRules: S.optional(CostCategorySplitChargeRulesList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export type Expressions = Expression[];
export const Expressions = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression),
) as any as S.Schema<Expressions>;
export class AnomalyMonitor extends S.Class<AnomalyMonitor>("AnomalyMonitor")({
  MonitorArn: S.optional(S.String),
  MonitorName: S.String,
  CreationDate: S.optional(S.String),
  LastUpdatedDate: S.optional(S.String),
  LastEvaluatedDate: S.optional(S.String),
  MonitorType: S.String,
  MonitorDimension: S.optional(S.String),
  MonitorSpecification: S.optional(Expression),
  DimensionalValueCount: S.optional(S.Number),
}) {}
export class Subscriber extends S.Class<Subscriber>("Subscriber")({
  Address: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const Subscribers = S.Array(Subscriber);
export class AnomalySubscription extends S.Class<AnomalySubscription>(
  "AnomalySubscription",
)({
  SubscriptionArn: S.optional(S.String),
  AccountId: S.optional(S.String),
  MonitorArnList: MonitorArnList,
  Subscribers: Subscribers,
  Threshold: S.optional(S.Number),
  Frequency: S.String,
  SubscriptionName: S.String,
  ThresholdExpression: S.optional(Expression),
}) {}
export class AnomalyDateInterval extends S.Class<AnomalyDateInterval>(
  "AnomalyDateInterval",
)({ StartDate: S.String, EndDate: S.optional(S.String) }) {}
export class TotalImpactFilter extends S.Class<TotalImpactFilter>(
  "TotalImpactFilter",
)({
  NumericOperator: S.String,
  StartValue: S.Number,
  EndValue: S.optional(S.Number),
}) {}
export const AnomalyMonitors = S.Array(AnomalyMonitor);
export const AnomalySubscriptions = S.Array(AnomalySubscription);
export class RightsizingRecommendationConfiguration extends S.Class<RightsizingRecommendationConfiguration>(
  "RightsizingRecommendationConfiguration",
)({ RecommendationTarget: S.String, BenefitsConsidered: S.Boolean }) {}
export const TagList = S.Array(S.String);
export class CostAllocationTagStatusEntry extends S.Class<CostAllocationTagStatusEntry>(
  "CostAllocationTagStatusEntry",
)({ TagKey: S.String, Status: S.String }) {}
export const CostAllocationTagStatusList = S.Array(
  CostAllocationTagStatusEntry,
);
export const SavingsPlansToExclude = S.Array(S.String);
export class CreateAnomalyMonitorRequest extends S.Class<CreateAnomalyMonitorRequest>(
  "CreateAnomalyMonitorRequest",
)(
  { AnomalyMonitor: AnomalyMonitor, ResourceTags: S.optional(ResourceTagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAnomalySubscriptionRequest extends S.Class<CreateAnomalySubscriptionRequest>(
  "CreateAnomalySubscriptionRequest",
)(
  {
    AnomalySubscription: AnomalySubscription,
    ResourceTags: S.optional(ResourceTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCostCategoryDefinitionResponse extends S.Class<DeleteCostCategoryDefinitionResponse>(
  "DeleteCostCategoryDefinitionResponse",
)({
  CostCategoryArn: S.optional(S.String),
  EffectiveEnd: S.optional(S.String),
}) {}
export class GetAnomaliesRequest extends S.Class<GetAnomaliesRequest>(
  "GetAnomaliesRequest",
)(
  {
    MonitorArn: S.optional(S.String),
    DateInterval: AnomalyDateInterval,
    Feedback: S.optional(S.String),
    TotalImpact: S.optional(TotalImpactFilter),
    NextPageToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAnomalyMonitorsResponse extends S.Class<GetAnomalyMonitorsResponse>(
  "GetAnomalyMonitorsResponse",
)({ AnomalyMonitors: AnomalyMonitors, NextPageToken: S.optional(S.String) }) {}
export class GetAnomalySubscriptionsResponse extends S.Class<GetAnomalySubscriptionsResponse>(
  "GetAnomalySubscriptionsResponse",
)({
  AnomalySubscriptions: AnomalySubscriptions,
  NextPageToken: S.optional(S.String),
}) {}
export class GetCostCategoriesRequest extends S.Class<GetCostCategoriesRequest>(
  "GetCostCategoriesRequest",
)(
  {
    SearchString: S.optional(S.String),
    TimePeriod: DateInterval,
    CostCategoryName: S.optional(S.String),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinitions),
    BillingViewArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Attributes = S.Record({ key: S.String, value: S.String });
export class DimensionValuesWithAttributes extends S.Class<DimensionValuesWithAttributes>(
  "DimensionValuesWithAttributes",
)({ Value: S.optional(S.String), Attributes: S.optional(Attributes) }) {}
export const DimensionValuesWithAttributesList = S.Array(
  DimensionValuesWithAttributes,
);
export class GetDimensionValuesResponse extends S.Class<GetDimensionValuesResponse>(
  "GetDimensionValuesResponse",
)({
  DimensionValues: DimensionValuesWithAttributesList,
  ReturnSize: S.Number,
  TotalSize: S.Number,
  NextPageToken: S.optional(S.String),
}) {}
export class GetRightsizingRecommendationRequest extends S.Class<GetRightsizingRecommendationRequest>(
  "GetRightsizingRecommendationRequest",
)(
  {
    Filter: S.optional(Expression),
    Configuration: S.optional(RightsizingRecommendationConfiguration),
    Service: S.String,
    PageSize: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTagsResponse extends S.Class<GetTagsResponse>(
  "GetTagsResponse",
)({
  NextPageToken: S.optional(S.String),
  Tags: TagList,
  ReturnSize: S.Number,
  TotalSize: S.Number,
}) {}
export class MetricValue extends S.Class<MetricValue>("MetricValue")({
  Amount: S.optional(S.String),
  Unit: S.optional(S.String),
}) {}
export class ForecastResult extends S.Class<ForecastResult>("ForecastResult")({
  TimePeriod: S.optional(DateInterval),
  MeanValue: S.optional(S.String),
  PredictionIntervalLowerBound: S.optional(S.String),
  PredictionIntervalUpperBound: S.optional(S.String),
}) {}
export const ForecastResultsByTime = S.Array(ForecastResult);
export class GetUsageForecastResponse extends S.Class<GetUsageForecastResponse>(
  "GetUsageForecastResponse",
)({
  Total: S.optional(MetricValue),
  ForecastResultsByTime: S.optional(ForecastResultsByTime),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ ResourceTags: S.optional(ResourceTagList) }) {}
export class ProvideAnomalyFeedbackResponse extends S.Class<ProvideAnomalyFeedbackResponse>(
  "ProvideAnomalyFeedbackResponse",
)({ AnomalyId: S.String }) {}
export class CostAllocationTagBackfillRequest extends S.Class<CostAllocationTagBackfillRequest>(
  "CostAllocationTagBackfillRequest",
)({
  BackfillFrom: S.optional(S.String),
  RequestedAt: S.optional(S.String),
  CompletedAt: S.optional(S.String),
  BackfillStatus: S.optional(S.String),
  LastUpdatedAt: S.optional(S.String),
}) {}
export class StartCostAllocationTagBackfillResponse extends S.Class<StartCostAllocationTagBackfillResponse>(
  "StartCostAllocationTagBackfillResponse",
)({ BackfillRequest: S.optional(CostAllocationTagBackfillRequest) }) {}
export class UpdateAnomalyMonitorResponse extends S.Class<UpdateAnomalyMonitorResponse>(
  "UpdateAnomalyMonitorResponse",
)({ MonitorArn: S.String }) {}
export class UpdateAnomalySubscriptionRequest extends S.Class<UpdateAnomalySubscriptionRequest>(
  "UpdateAnomalySubscriptionRequest",
)(
  {
    SubscriptionArn: S.String,
    Threshold: S.optional(S.Number),
    Frequency: S.optional(S.String),
    MonitorArnList: S.optional(MonitorArnList),
    Subscribers: S.optional(Subscribers),
    SubscriptionName: S.optional(S.String),
    ThresholdExpression: S.optional(Expression),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCostAllocationTagsStatusRequest extends S.Class<UpdateCostAllocationTagsStatusRequest>(
  "UpdateCostAllocationTagsStatusRequest",
)(
  { CostAllocationTagsStatus: CostAllocationTagStatusList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCostCategoryDefinitionResponse extends S.Class<UpdateCostCategoryDefinitionResponse>(
  "UpdateCostCategoryDefinitionResponse",
)({
  CostCategoryArn: S.optional(S.String),
  EffectiveStart: S.optional(S.String),
}) {}
export class EC2Specification extends S.Class<EC2Specification>(
  "EC2Specification",
)({ OfferingClass: S.optional(S.String) }) {}
export const CostCategoryValuesList = S.Array(S.String);
export const ResourceTypes = S.Array(S.String);
export const ApproximateUsageRecordsPerService = S.Record({
  key: S.String,
  value: S.Number,
});
export class ComparisonMetricValue extends S.Class<ComparisonMetricValue>(
  "ComparisonMetricValue",
)({
  BaselineTimePeriodAmount: S.optional(S.String),
  ComparisonTimePeriodAmount: S.optional(S.String),
  Difference: S.optional(S.String),
  Unit: S.optional(S.String),
}) {}
export const ComparisonMetrics = S.Record({
  key: S.String,
  value: ComparisonMetricValue,
});
export class CostAndUsageComparison extends S.Class<CostAndUsageComparison>(
  "CostAndUsageComparison",
)({
  CostAndUsageSelector: S.optional(Expression),
  Metrics: S.optional(ComparisonMetrics),
}) {}
export const CostAndUsageComparisons = S.Array(CostAndUsageComparison);
export const CostCategoryNamesList = S.Array(S.String);
export class ServiceSpecification extends S.Class<ServiceSpecification>(
  "ServiceSpecification",
)({ EC2Specification: S.optional(EC2Specification) }) {}
export class ReservationAggregates extends S.Class<ReservationAggregates>(
  "ReservationAggregates",
)({
  UtilizationPercentage: S.optional(S.String),
  UtilizationPercentageInUnits: S.optional(S.String),
  PurchasedHours: S.optional(S.String),
  PurchasedUnits: S.optional(S.String),
  TotalActualHours: S.optional(S.String),
  TotalActualUnits: S.optional(S.String),
  UnusedHours: S.optional(S.String),
  UnusedUnits: S.optional(S.String),
  OnDemandCostOfRIHoursUsed: S.optional(S.String),
  NetRISavings: S.optional(S.String),
  TotalPotentialRISavings: S.optional(S.String),
  AmortizedUpfrontFee: S.optional(S.String),
  AmortizedRecurringFee: S.optional(S.String),
  TotalAmortizedFee: S.optional(S.String),
  RICostForUnusedHours: S.optional(S.String),
  RealizedSavings: S.optional(S.String),
  UnrealizedSavings: S.optional(S.String),
}) {}
export class SavingsPlansPurchaseRecommendationMetadata extends S.Class<SavingsPlansPurchaseRecommendationMetadata>(
  "SavingsPlansPurchaseRecommendationMetadata",
)({
  RecommendationId: S.optional(S.String),
  GenerationTimestamp: S.optional(S.String),
  AdditionalMetadata: S.optional(S.String),
}) {}
export class SavingsPlansUtilization extends S.Class<SavingsPlansUtilization>(
  "SavingsPlansUtilization",
)({
  TotalCommitment: S.optional(S.String),
  UsedCommitment: S.optional(S.String),
  UnusedCommitment: S.optional(S.String),
  UtilizationPercentage: S.optional(S.String),
}) {}
export class SavingsPlansSavings extends S.Class<SavingsPlansSavings>(
  "SavingsPlansSavings",
)({
  NetSavings: S.optional(S.String),
  OnDemandCostEquivalent: S.optional(S.String),
}) {}
export class SavingsPlansAmortizedCommitment extends S.Class<SavingsPlansAmortizedCommitment>(
  "SavingsPlansAmortizedCommitment",
)({
  AmortizedRecurringCommitment: S.optional(S.String),
  AmortizedUpfrontCommitment: S.optional(S.String),
  TotalAmortizedCommitment: S.optional(S.String),
}) {}
export class SavingsPlansUtilizationAggregates extends S.Class<SavingsPlansUtilizationAggregates>(
  "SavingsPlansUtilizationAggregates",
)({
  Utilization: SavingsPlansUtilization,
  Savings: S.optional(SavingsPlansSavings),
  AmortizedCommitment: S.optional(SavingsPlansAmortizedCommitment),
}) {}
export class SavingsPlansUtilizationDetail extends S.Class<SavingsPlansUtilizationDetail>(
  "SavingsPlansUtilizationDetail",
)({
  SavingsPlanArn: S.optional(S.String),
  Attributes: S.optional(Attributes),
  Utilization: S.optional(SavingsPlansUtilization),
  Savings: S.optional(SavingsPlansSavings),
  AmortizedCommitment: S.optional(SavingsPlansAmortizedCommitment),
}) {}
export const SavingsPlansUtilizationDetails = S.Array(
  SavingsPlansUtilizationDetail,
);
export class SavingsPlans extends S.Class<SavingsPlans>("SavingsPlans")({
  PaymentOption: S.optional(S.String),
  SavingsPlansType: S.optional(S.String),
  Region: S.optional(S.String),
  InstanceFamily: S.optional(S.String),
  TermInYears: S.optional(S.String),
  SavingsPlansCommitment: S.optional(S.Number),
  OfferingId: S.optional(S.String),
}) {}
export const SavingsPlansToAdd = S.Array(SavingsPlans);
export class SavingsPlansPurchaseAnalysisConfiguration extends S.Class<SavingsPlansPurchaseAnalysisConfiguration>(
  "SavingsPlansPurchaseAnalysisConfiguration",
)({
  AccountScope: S.optional(S.String),
  AccountId: S.optional(S.String),
  AnalysisType: S.String,
  SavingsPlansToAdd: SavingsPlansToAdd,
  SavingsPlansToExclude: S.optional(SavingsPlansToExclude),
  LookBackTimePeriod: DateInterval,
}) {}
export class CommitmentPurchaseAnalysisConfiguration extends S.Class<CommitmentPurchaseAnalysisConfiguration>(
  "CommitmentPurchaseAnalysisConfiguration",
)({
  SavingsPlansPurchaseAnalysisConfiguration: S.optional(
    SavingsPlansPurchaseAnalysisConfiguration,
  ),
}) {}
export class AnalysisSummary extends S.Class<AnalysisSummary>(
  "AnalysisSummary",
)({
  EstimatedCompletionTime: S.optional(S.String),
  AnalysisCompletionTime: S.optional(S.String),
  AnalysisStartedTime: S.optional(S.String),
  AnalysisStatus: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  AnalysisId: S.optional(S.String),
  CommitmentPurchaseAnalysisConfiguration: S.optional(
    CommitmentPurchaseAnalysisConfiguration,
  ),
}) {}
export const AnalysisSummaryList = S.Array(AnalysisSummary);
export const CostAllocationTagBackfillRequestList = S.Array(
  CostAllocationTagBackfillRequest,
);
export class CostAllocationTag extends S.Class<CostAllocationTag>(
  "CostAllocationTag",
)({
  TagKey: S.String,
  Type: S.String,
  Status: S.String,
  LastUpdatedDate: S.optional(S.String),
  LastUsedDate: S.optional(S.String),
}) {}
export const CostAllocationTagList = S.Array(CostAllocationTag);
export class CostCategoryProcessingStatus extends S.Class<CostCategoryProcessingStatus>(
  "CostCategoryProcessingStatus",
)({ Component: S.optional(S.String), Status: S.optional(S.String) }) {}
export const CostCategoryProcessingStatusList = S.Array(
  CostCategoryProcessingStatus,
);
export class CostCategoryReference extends S.Class<CostCategoryReference>(
  "CostCategoryReference",
)({
  CostCategoryArn: S.optional(S.String),
  Name: S.optional(S.String),
  EffectiveStart: S.optional(S.String),
  EffectiveEnd: S.optional(S.String),
  NumberOfRules: S.optional(S.Number),
  ProcessingStatus: S.optional(CostCategoryProcessingStatusList),
  Values: S.optional(CostCategoryValuesList),
  DefaultValue: S.optional(S.String),
  SupportedResourceTypes: S.optional(ResourceTypes),
}) {}
export const CostCategoryReferencesList = S.Array(CostCategoryReference);
export class CostCategoryResourceAssociation extends S.Class<CostCategoryResourceAssociation>(
  "CostCategoryResourceAssociation",
)({
  ResourceArn: S.optional(S.String),
  CostCategoryName: S.optional(S.String),
  CostCategoryArn: S.optional(S.String),
}) {}
export const CostCategoryResourceAssociations = S.Array(
  CostCategoryResourceAssociation,
);
export class GenerationSummary extends S.Class<GenerationSummary>(
  "GenerationSummary",
)({
  RecommendationId: S.optional(S.String),
  GenerationStatus: S.optional(S.String),
  GenerationStartedTime: S.optional(S.String),
  GenerationCompletionTime: S.optional(S.String),
  EstimatedCompletionTime: S.optional(S.String),
}) {}
export const GenerationSummaryList = S.Array(GenerationSummary);
export const Keys = S.Array(S.String);
export class CreateAnomalyMonitorResponse extends S.Class<CreateAnomalyMonitorResponse>(
  "CreateAnomalyMonitorResponse",
)({ MonitorArn: S.String }) {}
export class CreateAnomalySubscriptionResponse extends S.Class<CreateAnomalySubscriptionResponse>(
  "CreateAnomalySubscriptionResponse",
)({ SubscriptionArn: S.String }) {}
export class CreateCostCategoryDefinitionRequest extends S.Class<CreateCostCategoryDefinitionRequest>(
  "CreateCostCategoryDefinitionRequest",
)(
  {
    Name: S.String,
    EffectiveStart: S.optional(S.String),
    RuleVersion: S.String,
    Rules: CostCategoryRulesList,
    DefaultValue: S.optional(S.String),
    SplitChargeRules: S.optional(CostCategorySplitChargeRulesList),
    ResourceTags: S.optional(ResourceTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetApproximateUsageRecordsResponse extends S.Class<GetApproximateUsageRecordsResponse>(
  "GetApproximateUsageRecordsResponse",
)({
  Services: S.optional(ApproximateUsageRecordsPerService),
  TotalRecords: S.optional(S.Number),
  LookbackPeriod: S.optional(DateInterval),
}) {}
export class GetCostAndUsageRequest extends S.Class<GetCostAndUsageRequest>(
  "GetCostAndUsageRequest",
)(
  {
    TimePeriod: DateInterval,
    Granularity: S.String,
    Filter: S.optional(Expression),
    Metrics: MetricNames,
    GroupBy: S.optional(GroupDefinitions),
    BillingViewArn: S.optional(S.String),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCostCategoriesResponse extends S.Class<GetCostCategoriesResponse>(
  "GetCostCategoriesResponse",
)({
  NextPageToken: S.optional(S.String),
  CostCategoryNames: S.optional(CostCategoryNamesList),
  CostCategoryValues: S.optional(CostCategoryValuesList),
  ReturnSize: S.Number,
  TotalSize: S.Number,
}) {}
export class GetCostForecastResponse extends S.Class<GetCostForecastResponse>(
  "GetCostForecastResponse",
)({
  Total: S.optional(MetricValue),
  ForecastResultsByTime: S.optional(ForecastResultsByTime),
}) {}
export class GetReservationPurchaseRecommendationRequest extends S.Class<GetReservationPurchaseRecommendationRequest>(
  "GetReservationPurchaseRecommendationRequest",
)(
  {
    AccountId: S.optional(S.String),
    Service: S.String,
    Filter: S.optional(Expression),
    AccountScope: S.optional(S.String),
    LookbackPeriodInDays: S.optional(S.String),
    TermInYears: S.optional(S.String),
    PaymentOption: S.optional(S.String),
    ServiceSpecification: S.optional(ServiceSpecification),
    PageSize: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSavingsPlansUtilizationDetailsResponse extends S.Class<GetSavingsPlansUtilizationDetailsResponse>(
  "GetSavingsPlansUtilizationDetailsResponse",
)({
  SavingsPlansUtilizationDetails: SavingsPlansUtilizationDetails,
  Total: S.optional(SavingsPlansUtilizationAggregates),
  TimePeriod: DateInterval,
  NextToken: S.optional(S.String),
}) {}
export class ListCommitmentPurchaseAnalysesResponse extends S.Class<ListCommitmentPurchaseAnalysesResponse>(
  "ListCommitmentPurchaseAnalysesResponse",
)({
  AnalysisSummaryList: S.optional(AnalysisSummaryList),
  NextPageToken: S.optional(S.String),
}) {}
export class ListCostAllocationTagBackfillHistoryResponse extends S.Class<ListCostAllocationTagBackfillHistoryResponse>(
  "ListCostAllocationTagBackfillHistoryResponse",
)({
  BackfillRequests: S.optional(CostAllocationTagBackfillRequestList),
  NextToken: S.optional(S.String),
}) {}
export class ListCostAllocationTagsResponse extends S.Class<ListCostAllocationTagsResponse>(
  "ListCostAllocationTagsResponse",
)({
  CostAllocationTags: S.optional(CostAllocationTagList),
  NextToken: S.optional(S.String),
}) {}
export class ListCostCategoryDefinitionsResponse extends S.Class<ListCostCategoryDefinitionsResponse>(
  "ListCostCategoryDefinitionsResponse",
)({
  CostCategoryReferences: S.optional(CostCategoryReferencesList),
  NextToken: S.optional(S.String),
}) {}
export class ListCostCategoryResourceAssociationsResponse extends S.Class<ListCostCategoryResourceAssociationsResponse>(
  "ListCostCategoryResourceAssociationsResponse",
)({
  CostCategoryResourceAssociations: S.optional(
    CostCategoryResourceAssociations,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListSavingsPlansPurchaseRecommendationGenerationResponse extends S.Class<ListSavingsPlansPurchaseRecommendationGenerationResponse>(
  "ListSavingsPlansPurchaseRecommendationGenerationResponse",
)({
  GenerationSummaryList: S.optional(GenerationSummaryList),
  NextPageToken: S.optional(S.String),
}) {}
export class UpdateAnomalySubscriptionResponse extends S.Class<UpdateAnomalySubscriptionResponse>(
  "UpdateAnomalySubscriptionResponse",
)({ SubscriptionArn: S.String }) {}
export class RecommendationDetailHourlyMetrics extends S.Class<RecommendationDetailHourlyMetrics>(
  "RecommendationDetailHourlyMetrics",
)({
  StartTime: S.optional(S.String),
  EstimatedOnDemandCost: S.optional(S.String),
  CurrentCoverage: S.optional(S.String),
  EstimatedCoverage: S.optional(S.String),
  EstimatedNewCommitmentUtilization: S.optional(S.String),
}) {}
export const MetricsOverLookbackPeriod = S.Array(
  RecommendationDetailHourlyMetrics,
);
export class SavingsPlansPurchaseAnalysisDetails extends S.Class<SavingsPlansPurchaseAnalysisDetails>(
  "SavingsPlansPurchaseAnalysisDetails",
)({
  CurrencyCode: S.optional(S.String),
  LookbackPeriodInHours: S.optional(S.String),
  CurrentAverageCoverage: S.optional(S.String),
  CurrentAverageHourlyOnDemandSpend: S.optional(S.String),
  CurrentMaximumHourlyOnDemandSpend: S.optional(S.String),
  CurrentMinimumHourlyOnDemandSpend: S.optional(S.String),
  CurrentOnDemandSpend: S.optional(S.String),
  ExistingHourlyCommitment: S.optional(S.String),
  HourlyCommitmentToPurchase: S.optional(S.String),
  EstimatedAverageCoverage: S.optional(S.String),
  EstimatedAverageUtilization: S.optional(S.String),
  EstimatedMonthlySavingsAmount: S.optional(S.String),
  EstimatedOnDemandCost: S.optional(S.String),
  EstimatedOnDemandCostWithCurrentCommitment: S.optional(S.String),
  EstimatedROI: S.optional(S.String),
  EstimatedSavingsAmount: S.optional(S.String),
  EstimatedSavingsPercentage: S.optional(S.String),
  EstimatedCommitmentCost: S.optional(S.String),
  LatestUsageTimestamp: S.optional(S.String),
  UpfrontCost: S.optional(S.String),
  AdditionalMetadata: S.optional(S.String),
  MetricsOverLookbackPeriod: S.optional(MetricsOverLookbackPeriod),
}) {}
export const Metrics = S.Record({ key: S.String, value: MetricValue });
export class Group extends S.Class<Group>("Group")({
  Keys: S.optional(Keys),
  Metrics: S.optional(Metrics),
}) {}
export const Groups = S.Array(Group);
export class CostDriver extends S.Class<CostDriver>("CostDriver")({
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  Metrics: S.optional(ComparisonMetrics),
}) {}
export const CostDrivers = S.Array(CostDriver);
export class CoverageHours extends S.Class<CoverageHours>("CoverageHours")({
  OnDemandHours: S.optional(S.String),
  ReservedHours: S.optional(S.String),
  TotalRunningHours: S.optional(S.String),
  CoverageHoursPercentage: S.optional(S.String),
}) {}
export class CoverageNormalizedUnits extends S.Class<CoverageNormalizedUnits>(
  "CoverageNormalizedUnits",
)({
  OnDemandNormalizedUnits: S.optional(S.String),
  ReservedNormalizedUnits: S.optional(S.String),
  TotalRunningNormalizedUnits: S.optional(S.String),
  CoverageNormalizedUnitsPercentage: S.optional(S.String),
}) {}
export class CoverageCost extends S.Class<CoverageCost>("CoverageCost")({
  OnDemandCost: S.optional(S.String),
}) {}
export class Coverage extends S.Class<Coverage>("Coverage")({
  CoverageHours: S.optional(CoverageHours),
  CoverageNormalizedUnits: S.optional(CoverageNormalizedUnits),
  CoverageCost: S.optional(CoverageCost),
}) {}
export class ReservationCoverageGroup extends S.Class<ReservationCoverageGroup>(
  "ReservationCoverageGroup",
)({ Attributes: S.optional(Attributes), Coverage: S.optional(Coverage) }) {}
export const ReservationCoverageGroups = S.Array(ReservationCoverageGroup);
export class ReservationUtilizationGroup extends S.Class<ReservationUtilizationGroup>(
  "ReservationUtilizationGroup",
)({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  Attributes: S.optional(Attributes),
  Utilization: S.optional(ReservationAggregates),
}) {}
export const ReservationUtilizationGroups = S.Array(
  ReservationUtilizationGroup,
);
export const FindingReasonCodes = S.Array(S.String);
export class SavingsPlansCoverageData extends S.Class<SavingsPlansCoverageData>(
  "SavingsPlansCoverageData",
)({
  SpendCoveredBySavingsPlans: S.optional(S.String),
  OnDemandCost: S.optional(S.String),
  TotalCost: S.optional(S.String),
  CoveragePercentage: S.optional(S.String),
}) {}
export class SavingsPlansPurchaseRecommendationSummary extends S.Class<SavingsPlansPurchaseRecommendationSummary>(
  "SavingsPlansPurchaseRecommendationSummary",
)({
  EstimatedROI: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
  EstimatedTotalCost: S.optional(S.String),
  CurrentOnDemandSpend: S.optional(S.String),
  EstimatedSavingsAmount: S.optional(S.String),
  TotalRecommendationCount: S.optional(S.String),
  DailyCommitmentToPurchase: S.optional(S.String),
  HourlyCommitmentToPurchase: S.optional(S.String),
  EstimatedSavingsPercentage: S.optional(S.String),
  EstimatedMonthlySavingsAmount: S.optional(S.String),
  EstimatedOnDemandCostWithCurrentCommitment: S.optional(S.String),
}) {}
export class CostCategory extends S.Class<CostCategory>("CostCategory")({
  CostCategoryArn: S.String,
  EffectiveStart: S.String,
  EffectiveEnd: S.optional(S.String),
  Name: S.String,
  RuleVersion: S.String,
  Rules: CostCategoryRulesList,
  SplitChargeRules: S.optional(CostCategorySplitChargeRulesList),
  ProcessingStatus: S.optional(CostCategoryProcessingStatusList),
  DefaultValue: S.optional(S.String),
}) {}
export class AnalysisDetails extends S.Class<AnalysisDetails>(
  "AnalysisDetails",
)({
  SavingsPlansPurchaseAnalysisDetails: S.optional(
    SavingsPlansPurchaseAnalysisDetails,
  ),
}) {}
export class ResultByTime extends S.Class<ResultByTime>("ResultByTime")({
  TimePeriod: S.optional(DateInterval),
  Total: S.optional(Metrics),
  Groups: S.optional(Groups),
  Estimated: S.optional(S.Boolean),
}) {}
export const ResultsByTime = S.Array(ResultByTime);
export class CostComparisonDriver extends S.Class<CostComparisonDriver>(
  "CostComparisonDriver",
)({
  CostSelector: S.optional(Expression),
  Metrics: S.optional(ComparisonMetrics),
  CostDrivers: S.optional(CostDrivers),
}) {}
export const CostComparisonDrivers = S.Array(CostComparisonDriver);
export class CoverageByTime extends S.Class<CoverageByTime>("CoverageByTime")({
  TimePeriod: S.optional(DateInterval),
  Groups: S.optional(ReservationCoverageGroups),
  Total: S.optional(Coverage),
}) {}
export const CoveragesByTime = S.Array(CoverageByTime);
export class UtilizationByTime extends S.Class<UtilizationByTime>(
  "UtilizationByTime",
)({
  TimePeriod: S.optional(DateInterval),
  Groups: S.optional(ReservationUtilizationGroups),
  Total: S.optional(ReservationAggregates),
}) {}
export const UtilizationsByTime = S.Array(UtilizationByTime);
export class RightsizingRecommendationMetadata extends S.Class<RightsizingRecommendationMetadata>(
  "RightsizingRecommendationMetadata",
)({
  RecommendationId: S.optional(S.String),
  GenerationTimestamp: S.optional(S.String),
  LookbackPeriodInDays: S.optional(S.String),
  AdditionalMetadata: S.optional(S.String),
}) {}
export class RightsizingRecommendationSummary extends S.Class<RightsizingRecommendationSummary>(
  "RightsizingRecommendationSummary",
)({
  TotalRecommendationCount: S.optional(S.String),
  EstimatedTotalMonthlySavingsAmount: S.optional(S.String),
  SavingsCurrencyCode: S.optional(S.String),
  SavingsPercentage: S.optional(S.String),
}) {}
export class RecommendationDetailData extends S.Class<RecommendationDetailData>(
  "RecommendationDetailData",
)({
  AccountScope: S.optional(S.String),
  LookbackPeriodInDays: S.optional(S.String),
  SavingsPlansType: S.optional(S.String),
  TermInYears: S.optional(S.String),
  PaymentOption: S.optional(S.String),
  AccountId: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
  InstanceFamily: S.optional(S.String),
  Region: S.optional(S.String),
  OfferingId: S.optional(S.String),
  GenerationTimestamp: S.optional(S.String),
  LatestUsageTimestamp: S.optional(S.String),
  CurrentAverageHourlyOnDemandSpend: S.optional(S.String),
  CurrentMaximumHourlyOnDemandSpend: S.optional(S.String),
  CurrentMinimumHourlyOnDemandSpend: S.optional(S.String),
  EstimatedAverageUtilization: S.optional(S.String),
  EstimatedMonthlySavingsAmount: S.optional(S.String),
  EstimatedOnDemandCost: S.optional(S.String),
  EstimatedOnDemandCostWithCurrentCommitment: S.optional(S.String),
  EstimatedROI: S.optional(S.String),
  EstimatedSPCost: S.optional(S.String),
  EstimatedSavingsAmount: S.optional(S.String),
  EstimatedSavingsPercentage: S.optional(S.String),
  ExistingHourlyCommitment: S.optional(S.String),
  HourlyCommitmentToPurchase: S.optional(S.String),
  UpfrontCost: S.optional(S.String),
  CurrentAverageCoverage: S.optional(S.String),
  EstimatedAverageCoverage: S.optional(S.String),
  MetricsOverLookbackPeriod: S.optional(MetricsOverLookbackPeriod),
}) {}
export class SavingsPlansCoverage extends S.Class<SavingsPlansCoverage>(
  "SavingsPlansCoverage",
)({
  Attributes: S.optional(Attributes),
  Coverage: S.optional(SavingsPlansCoverageData),
  TimePeriod: S.optional(DateInterval),
}) {}
export const SavingsPlansCoverages = S.Array(SavingsPlansCoverage);
export class SavingsPlansUtilizationByTime extends S.Class<SavingsPlansUtilizationByTime>(
  "SavingsPlansUtilizationByTime",
)({
  TimePeriod: DateInterval,
  Utilization: SavingsPlansUtilization,
  Savings: S.optional(SavingsPlansSavings),
  AmortizedCommitment: S.optional(SavingsPlansAmortizedCommitment),
}) {}
export const SavingsPlansUtilizationsByTime = S.Array(
  SavingsPlansUtilizationByTime,
);
export class UpdateCostAllocationTagsStatusError extends S.Class<UpdateCostAllocationTagsStatusError>(
  "UpdateCostAllocationTagsStatusError",
)({
  TagKey: S.optional(S.String),
  Code: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const UpdateCostAllocationTagsStatusErrors = S.Array(
  UpdateCostAllocationTagsStatusError,
);
export const TagValuesList = S.Array(TagValues);
export class SavingsPlansDetails extends S.Class<SavingsPlansDetails>(
  "SavingsPlansDetails",
)({
  Region: S.optional(S.String),
  InstanceFamily: S.optional(S.String),
  OfferingId: S.optional(S.String),
}) {}
export class CreateCostCategoryDefinitionResponse extends S.Class<CreateCostCategoryDefinitionResponse>(
  "CreateCostCategoryDefinitionResponse",
)({
  CostCategoryArn: S.optional(S.String),
  EffectiveStart: S.optional(S.String),
}) {}
export class DescribeCostCategoryDefinitionResponse extends S.Class<DescribeCostCategoryDefinitionResponse>(
  "DescribeCostCategoryDefinitionResponse",
)({ CostCategory: S.optional(CostCategory) }) {}
export class GetCommitmentPurchaseAnalysisResponse extends S.Class<GetCommitmentPurchaseAnalysisResponse>(
  "GetCommitmentPurchaseAnalysisResponse",
)({
  EstimatedCompletionTime: S.String,
  AnalysisCompletionTime: S.optional(S.String),
  AnalysisStartedTime: S.String,
  AnalysisId: S.String,
  AnalysisStatus: S.String,
  ErrorCode: S.optional(S.String),
  AnalysisDetails: S.optional(AnalysisDetails),
  CommitmentPurchaseAnalysisConfiguration:
    CommitmentPurchaseAnalysisConfiguration,
}) {}
export class GetCostAndUsageResponse extends S.Class<GetCostAndUsageResponse>(
  "GetCostAndUsageResponse",
)({
  NextPageToken: S.optional(S.String),
  GroupDefinitions: S.optional(GroupDefinitions),
  ResultsByTime: S.optional(ResultsByTime),
  DimensionValueAttributes: S.optional(DimensionValuesWithAttributesList),
}) {}
export class GetCostAndUsageComparisonsResponse extends S.Class<GetCostAndUsageComparisonsResponse>(
  "GetCostAndUsageComparisonsResponse",
)({
  CostAndUsageComparisons: S.optional(CostAndUsageComparisons),
  TotalCostAndUsage: S.optional(ComparisonMetrics),
  NextPageToken: S.optional(S.String),
}) {}
export class GetCostAndUsageWithResourcesResponse extends S.Class<GetCostAndUsageWithResourcesResponse>(
  "GetCostAndUsageWithResourcesResponse",
)({
  NextPageToken: S.optional(S.String),
  GroupDefinitions: S.optional(GroupDefinitions),
  ResultsByTime: S.optional(ResultsByTime),
  DimensionValueAttributes: S.optional(DimensionValuesWithAttributesList),
}) {}
export class GetCostComparisonDriversResponse extends S.Class<GetCostComparisonDriversResponse>(
  "GetCostComparisonDriversResponse",
)({
  CostComparisonDrivers: S.optional(CostComparisonDrivers),
  NextPageToken: S.optional(S.String),
}) {}
export class GetReservationCoverageResponse extends S.Class<GetReservationCoverageResponse>(
  "GetReservationCoverageResponse",
)({
  CoveragesByTime: CoveragesByTime,
  Total: S.optional(Coverage),
  NextPageToken: S.optional(S.String),
}) {}
export class GetReservationUtilizationResponse extends S.Class<GetReservationUtilizationResponse>(
  "GetReservationUtilizationResponse",
)({
  UtilizationsByTime: UtilizationsByTime,
  Total: S.optional(ReservationAggregates),
  NextPageToken: S.optional(S.String),
}) {}
export class GetSavingsPlanPurchaseRecommendationDetailsResponse extends S.Class<GetSavingsPlanPurchaseRecommendationDetailsResponse>(
  "GetSavingsPlanPurchaseRecommendationDetailsResponse",
)({
  RecommendationDetailId: S.optional(S.String),
  RecommendationDetailData: S.optional(RecommendationDetailData),
}) {}
export class GetSavingsPlansCoverageResponse extends S.Class<GetSavingsPlansCoverageResponse>(
  "GetSavingsPlansCoverageResponse",
)({
  SavingsPlansCoverages: SavingsPlansCoverages,
  NextToken: S.optional(S.String),
}) {}
export class GetSavingsPlansUtilizationResponse extends S.Class<GetSavingsPlansUtilizationResponse>(
  "GetSavingsPlansUtilizationResponse",
)({
  SavingsPlansUtilizationsByTime: S.optional(SavingsPlansUtilizationsByTime),
  Total: SavingsPlansUtilizationAggregates,
}) {}
export class StartCommitmentPurchaseAnalysisRequest extends S.Class<StartCommitmentPurchaseAnalysisRequest>(
  "StartCommitmentPurchaseAnalysisRequest",
)(
  {
    CommitmentPurchaseAnalysisConfiguration:
      CommitmentPurchaseAnalysisConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCostAllocationTagsStatusResponse extends S.Class<UpdateCostAllocationTagsStatusResponse>(
  "UpdateCostAllocationTagsStatusResponse",
)({ Errors: S.optional(UpdateCostAllocationTagsStatusErrors) }) {}
export class AnomalyScore extends S.Class<AnomalyScore>("AnomalyScore")({
  MaxScore: S.Number,
  CurrentScore: S.Number,
}) {}
export class Impact extends S.Class<Impact>("Impact")({
  MaxImpact: S.Number,
  TotalImpact: S.optional(S.Number),
  TotalActualSpend: S.optional(S.Number),
  TotalExpectedSpend: S.optional(S.Number),
  TotalImpactPercentage: S.optional(S.Number),
}) {}
export class TerminateRecommendationDetail extends S.Class<TerminateRecommendationDetail>(
  "TerminateRecommendationDetail",
)({
  EstimatedMonthlySavings: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
}) {}
export class SavingsPlansPurchaseRecommendationDetail extends S.Class<SavingsPlansPurchaseRecommendationDetail>(
  "SavingsPlansPurchaseRecommendationDetail",
)({
  SavingsPlansDetails: S.optional(SavingsPlansDetails),
  AccountId: S.optional(S.String),
  UpfrontCost: S.optional(S.String),
  EstimatedROI: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
  EstimatedSPCost: S.optional(S.String),
  EstimatedOnDemandCost: S.optional(S.String),
  EstimatedOnDemandCostWithCurrentCommitment: S.optional(S.String),
  EstimatedSavingsAmount: S.optional(S.String),
  EstimatedSavingsPercentage: S.optional(S.String),
  HourlyCommitmentToPurchase: S.optional(S.String),
  EstimatedAverageUtilization: S.optional(S.String),
  EstimatedMonthlySavingsAmount: S.optional(S.String),
  CurrentMinimumHourlyOnDemandSpend: S.optional(S.String),
  CurrentMaximumHourlyOnDemandSpend: S.optional(S.String),
  CurrentAverageHourlyOnDemandSpend: S.optional(S.String),
  RecommendationDetailId: S.optional(S.String),
}) {}
export const SavingsPlansPurchaseRecommendationDetailList = S.Array(
  SavingsPlansPurchaseRecommendationDetail,
);
export const PlatformDifferences = S.Array(S.String);
export class ReservationPurchaseRecommendationMetadata extends S.Class<ReservationPurchaseRecommendationMetadata>(
  "ReservationPurchaseRecommendationMetadata",
)({
  RecommendationId: S.optional(S.String),
  GenerationTimestamp: S.optional(S.String),
  AdditionalMetadata: S.optional(S.String),
}) {}
export class SavingsPlansPurchaseRecommendation extends S.Class<SavingsPlansPurchaseRecommendation>(
  "SavingsPlansPurchaseRecommendation",
)({
  AccountScope: S.optional(S.String),
  SavingsPlansType: S.optional(S.String),
  TermInYears: S.optional(S.String),
  PaymentOption: S.optional(S.String),
  LookbackPeriodInDays: S.optional(S.String),
  SavingsPlansPurchaseRecommendationDetails: S.optional(
    SavingsPlansPurchaseRecommendationDetailList,
  ),
  SavingsPlansPurchaseRecommendationSummary: S.optional(
    SavingsPlansPurchaseRecommendationSummary,
  ),
}) {}
export class RootCauseImpact extends S.Class<RootCauseImpact>(
  "RootCauseImpact",
)({ Contribution: S.Number }) {}
export class EC2ResourceDetails extends S.Class<EC2ResourceDetails>(
  "EC2ResourceDetails",
)({
  HourlyOnDemandRate: S.optional(S.String),
  InstanceType: S.optional(S.String),
  Platform: S.optional(S.String),
  Region: S.optional(S.String),
  Sku: S.optional(S.String),
  Memory: S.optional(S.String),
  NetworkPerformance: S.optional(S.String),
  Storage: S.optional(S.String),
  Vcpu: S.optional(S.String),
}) {}
export class ResourceDetails extends S.Class<ResourceDetails>(
  "ResourceDetails",
)({ EC2ResourceDetails: S.optional(EC2ResourceDetails) }) {}
export class EBSResourceUtilization extends S.Class<EBSResourceUtilization>(
  "EBSResourceUtilization",
)({
  EbsReadOpsPerSecond: S.optional(S.String),
  EbsWriteOpsPerSecond: S.optional(S.String),
  EbsReadBytesPerSecond: S.optional(S.String),
  EbsWriteBytesPerSecond: S.optional(S.String),
}) {}
export class DiskResourceUtilization extends S.Class<DiskResourceUtilization>(
  "DiskResourceUtilization",
)({
  DiskReadOpsPerSecond: S.optional(S.String),
  DiskWriteOpsPerSecond: S.optional(S.String),
  DiskReadBytesPerSecond: S.optional(S.String),
  DiskWriteBytesPerSecond: S.optional(S.String),
}) {}
export class NetworkResourceUtilization extends S.Class<NetworkResourceUtilization>(
  "NetworkResourceUtilization",
)({
  NetworkInBytesPerSecond: S.optional(S.String),
  NetworkOutBytesPerSecond: S.optional(S.String),
  NetworkPacketsInPerSecond: S.optional(S.String),
  NetworkPacketsOutPerSecond: S.optional(S.String),
}) {}
export class EC2ResourceUtilization extends S.Class<EC2ResourceUtilization>(
  "EC2ResourceUtilization",
)({
  MaxCpuUtilizationPercentage: S.optional(S.String),
  MaxMemoryUtilizationPercentage: S.optional(S.String),
  MaxStorageUtilizationPercentage: S.optional(S.String),
  EBSResourceUtilization: S.optional(EBSResourceUtilization),
  DiskResourceUtilization: S.optional(DiskResourceUtilization),
  NetworkResourceUtilization: S.optional(NetworkResourceUtilization),
}) {}
export class ResourceUtilization extends S.Class<ResourceUtilization>(
  "ResourceUtilization",
)({ EC2ResourceUtilization: S.optional(EC2ResourceUtilization) }) {}
export class TargetInstance extends S.Class<TargetInstance>("TargetInstance")({
  EstimatedMonthlyCost: S.optional(S.String),
  EstimatedMonthlySavings: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
  DefaultTargetInstance: S.optional(S.Boolean),
  ResourceDetails: S.optional(ResourceDetails),
  ExpectedResourceUtilization: S.optional(ResourceUtilization),
  PlatformDifferences: S.optional(PlatformDifferences),
}) {}
export const TargetInstancesList = S.Array(TargetInstance);
export class GetSavingsPlansPurchaseRecommendationResponse extends S.Class<GetSavingsPlansPurchaseRecommendationResponse>(
  "GetSavingsPlansPurchaseRecommendationResponse",
)({
  Metadata: S.optional(SavingsPlansPurchaseRecommendationMetadata),
  SavingsPlansPurchaseRecommendation: S.optional(
    SavingsPlansPurchaseRecommendation,
  ),
  NextPageToken: S.optional(S.String),
}) {}
export class StartCommitmentPurchaseAnalysisResponse extends S.Class<StartCommitmentPurchaseAnalysisResponse>(
  "StartCommitmentPurchaseAnalysisResponse",
)({
  AnalysisId: S.String,
  AnalysisStartedTime: S.String,
  EstimatedCompletionTime: S.String,
}) {}
export class RootCause extends S.Class<RootCause>("RootCause")({
  Service: S.optional(S.String),
  Region: S.optional(S.String),
  LinkedAccount: S.optional(S.String),
  LinkedAccountName: S.optional(S.String),
  UsageType: S.optional(S.String),
  Impact: S.optional(RootCauseImpact),
}) {}
export const RootCauses = S.Array(RootCause);
export class ReservationPurchaseRecommendationSummary extends S.Class<ReservationPurchaseRecommendationSummary>(
  "ReservationPurchaseRecommendationSummary",
)({
  TotalEstimatedMonthlySavingsAmount: S.optional(S.String),
  TotalEstimatedMonthlySavingsPercentage: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
}) {}
export class ModifyRecommendationDetail extends S.Class<ModifyRecommendationDetail>(
  "ModifyRecommendationDetail",
)({ TargetInstances: S.optional(TargetInstancesList) }) {}
export class Anomaly extends S.Class<Anomaly>("Anomaly")({
  AnomalyId: S.String,
  AnomalyStartDate: S.optional(S.String),
  AnomalyEndDate: S.optional(S.String),
  DimensionValue: S.optional(S.String),
  RootCauses: S.optional(RootCauses),
  AnomalyScore: AnomalyScore,
  Impact: Impact,
  MonitorArn: S.String,
  Feedback: S.optional(S.String),
}) {}
export const Anomalies = S.Array(Anomaly);
export class GetAnomaliesResponse extends S.Class<GetAnomaliesResponse>(
  "GetAnomaliesResponse",
)({ Anomalies: Anomalies, NextPageToken: S.optional(S.String) }) {}
export class EC2InstanceDetails extends S.Class<EC2InstanceDetails>(
  "EC2InstanceDetails",
)({
  Family: S.optional(S.String),
  InstanceType: S.optional(S.String),
  Region: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  Platform: S.optional(S.String),
  Tenancy: S.optional(S.String),
  CurrentGeneration: S.optional(S.Boolean),
  SizeFlexEligible: S.optional(S.Boolean),
}) {}
export class RDSInstanceDetails extends S.Class<RDSInstanceDetails>(
  "RDSInstanceDetails",
)({
  Family: S.optional(S.String),
  InstanceType: S.optional(S.String),
  Region: S.optional(S.String),
  DatabaseEngine: S.optional(S.String),
  DatabaseEdition: S.optional(S.String),
  DeploymentOption: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  CurrentGeneration: S.optional(S.Boolean),
  SizeFlexEligible: S.optional(S.Boolean),
}) {}
export class RedshiftInstanceDetails extends S.Class<RedshiftInstanceDetails>(
  "RedshiftInstanceDetails",
)({
  Family: S.optional(S.String),
  NodeType: S.optional(S.String),
  Region: S.optional(S.String),
  CurrentGeneration: S.optional(S.Boolean),
  SizeFlexEligible: S.optional(S.Boolean),
}) {}
export class ElastiCacheInstanceDetails extends S.Class<ElastiCacheInstanceDetails>(
  "ElastiCacheInstanceDetails",
)({
  Family: S.optional(S.String),
  NodeType: S.optional(S.String),
  Region: S.optional(S.String),
  ProductDescription: S.optional(S.String),
  CurrentGeneration: S.optional(S.Boolean),
  SizeFlexEligible: S.optional(S.Boolean),
}) {}
export class ESInstanceDetails extends S.Class<ESInstanceDetails>(
  "ESInstanceDetails",
)({
  InstanceClass: S.optional(S.String),
  InstanceSize: S.optional(S.String),
  Region: S.optional(S.String),
  CurrentGeneration: S.optional(S.Boolean),
  SizeFlexEligible: S.optional(S.Boolean),
}) {}
export class MemoryDBInstanceDetails extends S.Class<MemoryDBInstanceDetails>(
  "MemoryDBInstanceDetails",
)({
  Family: S.optional(S.String),
  NodeType: S.optional(S.String),
  Region: S.optional(S.String),
  CurrentGeneration: S.optional(S.Boolean),
  SizeFlexEligible: S.optional(S.Boolean),
}) {}
export class DynamoDBCapacityDetails extends S.Class<DynamoDBCapacityDetails>(
  "DynamoDBCapacityDetails",
)({ CapacityUnits: S.optional(S.String), Region: S.optional(S.String) }) {}
export class InstanceDetails extends S.Class<InstanceDetails>(
  "InstanceDetails",
)({
  EC2InstanceDetails: S.optional(EC2InstanceDetails),
  RDSInstanceDetails: S.optional(RDSInstanceDetails),
  RedshiftInstanceDetails: S.optional(RedshiftInstanceDetails),
  ElastiCacheInstanceDetails: S.optional(ElastiCacheInstanceDetails),
  ESInstanceDetails: S.optional(ESInstanceDetails),
  MemoryDBInstanceDetails: S.optional(MemoryDBInstanceDetails),
}) {}
export class ReservedCapacityDetails extends S.Class<ReservedCapacityDetails>(
  "ReservedCapacityDetails",
)({ DynamoDBCapacityDetails: S.optional(DynamoDBCapacityDetails) }) {}
export class ReservationPurchaseRecommendationDetail extends S.Class<ReservationPurchaseRecommendationDetail>(
  "ReservationPurchaseRecommendationDetail",
)({
  AccountId: S.optional(S.String),
  InstanceDetails: S.optional(InstanceDetails),
  RecommendedNumberOfInstancesToPurchase: S.optional(S.String),
  RecommendedNormalizedUnitsToPurchase: S.optional(S.String),
  MinimumNumberOfInstancesUsedPerHour: S.optional(S.String),
  MinimumNormalizedUnitsUsedPerHour: S.optional(S.String),
  MaximumNumberOfInstancesUsedPerHour: S.optional(S.String),
  MaximumNormalizedUnitsUsedPerHour: S.optional(S.String),
  AverageNumberOfInstancesUsedPerHour: S.optional(S.String),
  AverageNormalizedUnitsUsedPerHour: S.optional(S.String),
  AverageUtilization: S.optional(S.String),
  EstimatedBreakEvenInMonths: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
  EstimatedMonthlySavingsAmount: S.optional(S.String),
  EstimatedMonthlySavingsPercentage: S.optional(S.String),
  EstimatedMonthlyOnDemandCost: S.optional(S.String),
  EstimatedReservationCostForLookbackPeriod: S.optional(S.String),
  UpfrontCost: S.optional(S.String),
  RecurringStandardMonthlyCost: S.optional(S.String),
  ReservedCapacityDetails: S.optional(ReservedCapacityDetails),
  RecommendedNumberOfCapacityUnitsToPurchase: S.optional(S.String),
  MinimumNumberOfCapacityUnitsUsedPerHour: S.optional(S.String),
  MaximumNumberOfCapacityUnitsUsedPerHour: S.optional(S.String),
  AverageNumberOfCapacityUnitsUsedPerHour: S.optional(S.String),
}) {}
export const ReservationPurchaseRecommendationDetails = S.Array(
  ReservationPurchaseRecommendationDetail,
);
export class CurrentInstance extends S.Class<CurrentInstance>(
  "CurrentInstance",
)({
  ResourceId: S.optional(S.String),
  InstanceName: S.optional(S.String),
  Tags: S.optional(TagValuesList),
  ResourceDetails: S.optional(ResourceDetails),
  ResourceUtilization: S.optional(ResourceUtilization),
  ReservationCoveredHoursInLookbackPeriod: S.optional(S.String),
  SavingsPlansCoveredHoursInLookbackPeriod: S.optional(S.String),
  OnDemandHoursInLookbackPeriod: S.optional(S.String),
  TotalRunningHoursInLookbackPeriod: S.optional(S.String),
  MonthlyCost: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
}) {}
export class ReservationPurchaseRecommendation extends S.Class<ReservationPurchaseRecommendation>(
  "ReservationPurchaseRecommendation",
)({
  AccountScope: S.optional(S.String),
  LookbackPeriodInDays: S.optional(S.String),
  TermInYears: S.optional(S.String),
  PaymentOption: S.optional(S.String),
  ServiceSpecification: S.optional(ServiceSpecification),
  RecommendationDetails: S.optional(ReservationPurchaseRecommendationDetails),
  RecommendationSummary: S.optional(ReservationPurchaseRecommendationSummary),
}) {}
export const ReservationPurchaseRecommendations = S.Array(
  ReservationPurchaseRecommendation,
);
export class RightsizingRecommendation extends S.Class<RightsizingRecommendation>(
  "RightsizingRecommendation",
)({
  AccountId: S.optional(S.String),
  CurrentInstance: S.optional(CurrentInstance),
  RightsizingType: S.optional(S.String),
  ModifyRecommendationDetail: S.optional(ModifyRecommendationDetail),
  TerminateRecommendationDetail: S.optional(TerminateRecommendationDetail),
  FindingReasonCodes: S.optional(FindingReasonCodes),
}) {}
export const RightsizingRecommendationList = S.Array(RightsizingRecommendation);
export class GetReservationPurchaseRecommendationResponse extends S.Class<GetReservationPurchaseRecommendationResponse>(
  "GetReservationPurchaseRecommendationResponse",
)({
  Metadata: S.optional(ReservationPurchaseRecommendationMetadata),
  Recommendations: S.optional(ReservationPurchaseRecommendations),
  NextPageToken: S.optional(S.String),
}) {}
export class GetRightsizingRecommendationResponse extends S.Class<GetRightsizingRecommendationResponse>(
  "GetRightsizingRecommendationResponse",
)({
  Metadata: S.optional(RightsizingRecommendationMetadata),
  Summary: S.optional(RightsizingRecommendationSummary),
  RightsizingRecommendations: S.optional(RightsizingRecommendationList),
  NextPageToken: S.optional(S.String),
  Configuration: S.optional(RightsizingRecommendationConfiguration),
}) {}

//# Errors
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class DataUnavailableException extends S.TaggedError<DataUnavailableException>()(
  "DataUnavailableException",
  { Message: S.optional(S.String) },
) {}
export class UnknownMonitorException extends S.TaggedError<UnknownMonitorException>()(
  "UnknownMonitorException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class BillExpirationException extends S.TaggedError<BillExpirationException>()(
  "BillExpirationException",
  { Message: S.optional(S.String) },
) {}
export class BillingViewHealthStatusException extends S.TaggedError<BillingViewHealthStatusException>()(
  "BillingViewHealthStatusException",
  { Message: S.optional(S.String) },
) {}
export class BackfillLimitExceededException extends S.TaggedError<BackfillLimitExceededException>()(
  "BackfillLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class GenerationExistsException extends S.TaggedError<GenerationExistsException>()(
  "GenerationExistsException",
  { Message: S.optional(S.String) },
) {}
export class UnknownSubscriptionException extends S.TaggedError<UnknownSubscriptionException>()(
  "UnknownSubscriptionException",
  { Message: S.optional(S.String) },
) {}
export class UnresolvableUsageUnitException extends S.TaggedError<UnresolvableUsageUnitException>()(
  "UnresolvableUsageUnitException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}
export class RequestChangedException extends S.TaggedError<RequestChangedException>()(
  "RequestChangedException",
  { Message: S.optional(S.String) },
) {}
export class AnalysisNotFoundException extends S.TaggedError<AnalysisNotFoundException>()(
  "AnalysisNotFoundException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Modifies the feedback property of a given cost anomaly.
 */
export const provideAnomalyFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ProvideAnomalyFeedbackRequest,
    output: ProvideAnomalyFeedbackResponse,
    errors: [LimitExceededException],
  }),
);
/**
 * Creates a new cost anomaly detection monitor with the requested type and monitor
 * specification.
 */
export const createAnomalyMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAnomalyMonitorRequest,
    output: CreateAnomalyMonitorResponse,
    errors: [LimitExceededException],
  }),
);
/**
 * Deletes a cost anomaly monitor.
 */
export const deleteAnomalyMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAnomalyMonitorRequest,
    output: DeleteAnomalyMonitorResponse,
    errors: [LimitExceededException, UnknownMonitorException],
  }),
);
/**
 * Deletes a cost category. Expenses from this month going forward will no longer be
 * categorized with this cost category.
 */
export const deleteCostCategoryDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCostCategoryDefinitionRequest,
    output: DeleteCostCategoryDefinitionResponse,
    errors: [LimitExceededException, ResourceNotFoundException],
  }));
/**
 * Retrieves the cost anomaly monitor definitions for your account. You can filter using a
 * list of cost anomaly monitor Amazon Resource Names (ARNs).
 */
export const getAnomalyMonitors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetAnomalyMonitorsRequest,
    output: GetAnomalyMonitorsResponse,
    errors: [
      InvalidNextTokenException,
      LimitExceededException,
      UnknownMonitorException,
    ],
    pagination: {
      inputToken: "NextPageToken",
      outputToken: "NextPageToken",
      items: "AnomalyMonitors",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves estimated usage records for hourly granularity or resource-level data at daily
 * granularity.
 */
export const getApproximateUsageRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApproximateUsageRecordsRequest,
    output: GetApproximateUsageRecordsResponse,
    errors: [DataUnavailableException, LimitExceededException],
  }),
);
/**
 * Retrieves attribute data along with aggregate utilization and savings data for a given
 * time period. This doesn't support granular or grouped data (daily/monthly) in response. You
 * can't retrieve data by dates in a single response similar to
 * `GetSavingsPlanUtilization`, but you have the option to make multiple calls to
 * `GetSavingsPlanUtilizationDetails` by providing individual dates. You can use
 * `GetDimensionValues` in `SAVINGS_PLANS` to determine the possible
 * dimension values.
 *
 * `GetSavingsPlanUtilizationDetails` internally groups data by
 * `SavingsPlansArn`.
 */
export const getSavingsPlansUtilizationDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetSavingsPlansUtilizationDetailsRequest,
    output: GetSavingsPlansUtilizationDetailsResponse,
    errors: [
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the commitment purchase analyses for your account.
 */
export const listCommitmentPurchaseAnalyses =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCommitmentPurchaseAnalysesRequest,
    output: ListCommitmentPurchaseAnalysesResponse,
    errors: [
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
    ],
  }));
/**
 * Retrieves a list of your historical cost allocation tag backfill requests.
 */
export const listCostAllocationTagBackfillHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCostAllocationTagBackfillHistoryRequest,
    output: ListCostAllocationTagBackfillHistoryResponse,
    errors: [InvalidNextTokenException, LimitExceededException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "BackfillRequests",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Get a list of cost allocation tags. All inputs in the API are optional and serve as
 * filters. By default, all cost allocation tags are returned.
 */
export const listCostAllocationTags =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCostAllocationTagsRequest,
    output: ListCostAllocationTagsResponse,
    errors: [InvalidNextTokenException, LimitExceededException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CostAllocationTags",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns the name, Amazon Resource Name (ARN), `NumberOfRules` and effective
 * dates of all cost categories defined in the account. You have the option to use
 * `EffectiveOn` and `SupportedResourceTypes` to return a list of cost categories that were active on a specific
 * date. If there is no `EffectiveOn` specified, you’ll see cost categories that are
 * effective on the current date. If cost category is still effective, `EffectiveEnd`
 * is omitted in the response. `ListCostCategoryDefinitions` supports pagination. The
 * request can have a `MaxResults` range up to 100.
 */
export const listCostCategoryDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCostCategoryDefinitionsRequest,
    output: ListCostCategoryDefinitionsResponse,
    errors: [LimitExceededException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CostCategoryReferences",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns resource associations of all cost categories defined in the account. You have the option to use `CostCategoryArn` to get the association for a specific cost category. `ListCostCategoryResourceAssociations` supports pagination. The request can have a `MaxResults` range up to 100.
 */
export const listCostCategoryResourceAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCostCategoryResourceAssociationsRequest,
    output: ListCostCategoryResourceAssociationsResponse,
    errors: [LimitExceededException, ResourceNotFoundException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CostCategoryResourceAssociations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves a list of your historical recommendation generations within the past 30
 * days.
 */
export const listSavingsPlansPurchaseRecommendationGeneration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSavingsPlansPurchaseRecommendationGenerationRequest,
    output: ListSavingsPlansPurchaseRecommendationGenerationResponse,
    errors: [
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
    ],
  }));
/**
 * Request a cost allocation tag backfill. This will backfill the activation status (either `active` or `inactive`) for all tag keys from `para:BackfillFrom` up to the time this request is made.
 *
 * You can request a backfill once every 24 hours.
 */
export const startCostAllocationTagBackfill =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartCostAllocationTagBackfillRequest,
    output: StartCostAllocationTagBackfillResponse,
    errors: [BackfillLimitExceededException, LimitExceededException],
  }));
/**
 * Deletes a cost anomaly subscription.
 */
export const deleteAnomalySubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAnomalySubscriptionRequest,
    output: DeleteAnomalySubscriptionResponse,
    errors: [LimitExceededException, UnknownSubscriptionException],
  }),
);
/**
 * Updates an existing cost anomaly monitor. The changes made are applied going forward, and
 * doesn't change anomalies detected in the past.
 */
export const updateAnomalyMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAnomalyMonitorRequest,
    output: UpdateAnomalyMonitorResponse,
    errors: [LimitExceededException, UnknownMonitorException],
  }),
);
/**
 * Adds an alert subscription to a cost anomaly detection monitor. You can use each
 * subscription to define subscribers with email or SNS notifications. Email subscribers can set
 * an absolute or percentage threshold and a time frequency for receiving notifications.
 */
export const createAnomalySubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAnomalySubscriptionRequest,
    output: CreateAnomalySubscriptionResponse,
    errors: [LimitExceededException, UnknownMonitorException],
  }),
);
/**
 * Returns a list of resource tags associated with the resource specified by the Amazon
 * Resource Name (ARN).
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [LimitExceededException, ResourceNotFoundException],
}));
/**
 * Removes one or more tags from a resource. Specify only tag keys in your request. Don't
 * specify the value.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [LimitExceededException, ResourceNotFoundException],
}));
/**
 * Retrieves the cost anomaly subscription objects for your account. You can filter using a
 * list of cost anomaly monitor Amazon Resource Names (ARNs).
 */
export const getAnomalySubscriptions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetAnomalySubscriptionsRequest,
    output: GetAnomalySubscriptionsResponse,
    errors: [
      InvalidNextTokenException,
      LimitExceededException,
      UnknownSubscriptionException,
    ],
    pagination: {
      inputToken: "NextPageToken",
      outputToken: "NextPageToken",
      items: "AnomalySubscriptions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves a forecast for how much Amazon Web Services predicts that you will spend over
 * the forecast time period that you select, based on your past costs.
 */
export const getCostForecast = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCostForecastRequest,
  output: GetCostForecastResponse,
  errors: [
    BillingViewHealthStatusException,
    DataUnavailableException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an existing cost anomaly subscription. Specify the fields that you want to update.
 * Omitted fields are unchanged.
 *
 * The JSON below describes the generic construct for each type. See Request Parameters for possible values as they apply to
 * `AnomalySubscription`.
 */
export const updateAnomalySubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAnomalySubscriptionRequest,
    output: UpdateAnomalySubscriptionResponse,
    errors: [
      LimitExceededException,
      UnknownMonitorException,
      UnknownSubscriptionException,
    ],
  }),
);
/**
 * Returns the name, Amazon Resource Name (ARN), rules, definition, and effective dates of a
 * cost category that's defined in the account.
 *
 * You have the option to use `EffectiveOn` to return a cost category that's
 * active on a specific date. If there's no `EffectiveOn` specified, you see a Cost
 * Category that's effective on the current date. If cost category is still effective,
 * `EffectiveEnd` is omitted in the response.
 */
export const describeCostCategoryDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeCostCategoryDefinitionRequest,
    output: DescribeCostCategoryDefinitionResponse,
    errors: [LimitExceededException, ResourceNotFoundException],
  }));
/**
 * Retrieves cost and usage comparisons for your account between two periods within the last
 * 13 months. If you have enabled multi-year data at monthly granularity, you can go back up to
 * 38 months.
 */
export const getCostAndUsageComparisons =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetCostAndUsageComparisonsRequest,
    output: GetCostAndUsageComparisonsResponse,
    errors: [
      BillingViewHealthStatusException,
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "NextPageToken",
      outputToken: "NextPageToken",
      items: "CostAndUsageComparisons",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves key factors driving cost changes between two time periods within the last 13
 * months, such as usage changes, discount changes, and commitment-based savings. If you have
 * enabled multi-year data at monthly granularity, you can go back up to 38 months.
 */
export const getCostComparisonDrivers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetCostComparisonDriversRequest,
    output: GetCostComparisonDriversResponse,
    errors: [
      BillingViewHealthStatusException,
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "NextPageToken",
      outputToken: "NextPageToken",
      items: "CostComparisonDrivers",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the reservation coverage for your account, which you can use to see how much
 * of your Amazon Elastic Compute Cloud, Amazon ElastiCache, Amazon Relational Database Service,
 * or Amazon Redshift usage is covered by a reservation. An organization's management account can
 * see the coverage of the associated member accounts. This supports dimensions, cost categories,
 * and nested expressions. For any time period, you can filter data about reservation usage by
 * the following dimensions:
 *
 * - AZ
 *
 * - CACHE_ENGINE
 *
 * - DATABASE_ENGINE
 *
 * - DEPLOYMENT_OPTION
 *
 * - INSTANCE_TYPE
 *
 * - LINKED_ACCOUNT
 *
 * - OPERATING_SYSTEM
 *
 * - PLATFORM
 *
 * - REGION
 *
 * - SERVICE
 *
 * - TAG
 *
 * - TENANCY
 *
 * To determine valid values for a dimension, use the `GetDimensionValues`
 * operation.
 */
export const getReservationCoverage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetReservationCoverageRequest,
    output: GetReservationCoverageResponse,
    errors: [
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
    ],
  }),
);
/**
 * Retrieves the reservation utilization for your account. Management account in an
 * organization have access to member accounts. You can filter data by dimensions in a time
 * period. You can use `GetDimensionValues` to determine the possible dimension
 * values. Currently, you can group only by `SUBSCRIPTION_ID`.
 */
export const getReservationUtilization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetReservationUtilizationRequest,
    output: GetReservationUtilizationResponse,
    errors: [
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
    ],
  }),
);
/**
 * Retrieves the details for a Savings Plan recommendation. These details include the hourly
 * data-points that construct the cost, coverage, and utilization charts.
 */
export const getSavingsPlanPurchaseRecommendationDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSavingsPlanPurchaseRecommendationDetailsRequest,
    output: GetSavingsPlanPurchaseRecommendationDetailsResponse,
    errors: [DataUnavailableException, LimitExceededException],
  }));
/**
 * Retrieves the Savings Plans covered for your account. This enables you to see how much of
 * your cost is covered by a Savings Plan. An organization’s management account can see the
 * coverage of the associated member accounts. This supports dimensions, cost categories, and
 * nested expressions. For any time period, you can filter data for Savings Plans usage with the
 * following dimensions:
 *
 * - `LINKED_ACCOUNT`
 *
 * - `REGION`
 *
 * - `SERVICE`
 *
 * - `INSTANCE_FAMILY`
 *
 * To determine valid values for a dimension, use the `GetDimensionValues`
 * operation.
 */
export const getSavingsPlansCoverage =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetSavingsPlansCoverageRequest,
    output: GetSavingsPlansCoverageResponse,
    errors: [
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the Savings Plans utilization for your account across date ranges with daily or
 * monthly granularity. Management account in an organization have access to member accounts. You
 * can use `GetDimensionValues` in `SAVINGS_PLANS` to determine the
 * possible dimension values.
 *
 * You can't group by any dimension values for
 * `GetSavingsPlansUtilization`.
 */
export const getSavingsPlansUtilization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSavingsPlansUtilizationRequest,
    output: GetSavingsPlansUtilizationResponse,
    errors: [DataUnavailableException, LimitExceededException],
  }),
);
/**
 * Retrieves a forecast for how much Amazon Web Services predicts that you will use
 * over the forecast time period that you select, based on your past usage.
 */
export const getUsageForecast = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsageForecastRequest,
  output: GetUsageForecastResponse,
  errors: [
    BillingViewHealthStatusException,
    DataUnavailableException,
    LimitExceededException,
    ResourceNotFoundException,
    UnresolvableUsageUnitException,
  ],
}));
/**
 * Requests a Savings Plans recommendation generation. This enables you to calculate a fresh
 * set of Savings Plans recommendations that takes your latest usage data and current Savings
 * Plans inventory into account. You can refresh Savings Plans recommendations up to three times
 * daily for a consolidated billing family.
 *
 * `StartSavingsPlansPurchaseRecommendationGeneration` has no request syntax
 * because no input parameters are needed to support this operation.
 */
export const startSavingsPlansPurchaseRecommendationGeneration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartSavingsPlansPurchaseRecommendationGenerationRequest,
    output: StartSavingsPlansPurchaseRecommendationGenerationResponse,
    errors: [
      DataUnavailableException,
      GenerationExistsException,
      LimitExceededException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Updates status for cost allocation tags in bulk, with maximum batch size of 20. If the tag
 * status that's updated is the same as the existing tag status, the request doesn't fail.
 * Instead, it doesn't have any effect on the tag status (for example, activating the active
 * tag).
 */
export const updateCostAllocationTagsStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCostAllocationTagsStatusRequest,
    output: UpdateCostAllocationTagsStatusResponse,
    errors: [LimitExceededException],
  }));
/**
 * An API operation for adding one or more tags (key-value pairs) to a resource.
 *
 * You can use the `TagResource` operation with a resource that already has tags.
 * If you specify a new tag key for the resource, this tag is appended to the list of tags
 * associated with the resource. If you specify a tag key that is already associated with the
 * resource, the new tag value you specify replaces the previous value for that tag.
 *
 * Although the maximum number of array members is 200, user-tag maximum is 50. The remaining
 * are reserved for Amazon Web Services use.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    LimitExceededException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Queries for available tag keys and tag values for a specified period. You can search
 * the tag values for an arbitrary string.
 */
export const getTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTagsRequest,
  output: GetTagsResponse,
  errors: [
    BillExpirationException,
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    RequestChangedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an existing cost category. Changes made to the cost category rules will be used to
 * categorize the current month’s expenses and future expenses. This won’t change categorization
 * for the previous months.
 */
export const updateCostCategoryDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCostCategoryDefinitionRequest,
    output: UpdateCostCategoryDefinitionResponse,
    errors: [
      LimitExceededException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Creates a new cost category with the requested name and rules.
 */
export const createCostCategoryDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCostCategoryDefinitionRequest,
    output: CreateCostCategoryDefinitionResponse,
    errors: [LimitExceededException, ServiceQuotaExceededException],
  }));
/**
 * Retrieves an array of cost category names and values incurred cost.
 *
 * If some cost category names and values are not associated with any cost, they will not
 * be returned by this API.
 */
export const getCostCategories = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCostCategoriesRequest,
  output: GetCostCategoriesResponse,
  errors: [
    BillExpirationException,
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    RequestChangedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves all available filter values for a specified filter over a period of time. You
 * can search the dimension values for an arbitrary string.
 */
export const getDimensionValues = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDimensionValuesRequest,
  output: GetDimensionValuesResponse,
  errors: [
    BillExpirationException,
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    RequestChangedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves cost and usage metrics for your account. You can specify which cost and
 * usage-related metric that you want the request to return. For example, you can specify
 * `BlendedCosts` or `UsageQuantity`. You can also filter and group your
 * data by various dimensions, such as `SERVICE` or `AZ`, in a specific
 * time range. For a complete list of valid dimensions, see the GetDimensionValues operation. Management account in an organization in Organizations have access to all member accounts.
 *
 * For information about filter limitations, see Quotas and restrictions
 * in the *Billing and Cost Management User Guide*.
 */
export const getCostAndUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCostAndUsageRequest,
  output: GetCostAndUsageResponse,
  errors: [
    BillExpirationException,
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    RequestChangedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves cost and usage metrics with resources for your account. You can specify which
 * cost and usage-related metric, such as `BlendedCosts` or
 * `UsageQuantity`, that you want the request to return. You can also filter and group
 * your data by various dimensions, such as `SERVICE` or `AZ`, in a
 * specific time range. For a complete list of valid dimensions, see the GetDimensionValues operation. Management account in an organization in Organizations have access to all member accounts.
 *
 * Hourly granularity is only available for EC2-Instances (Elastic Compute Cloud)
 * resource-level data. All other resource-level data is available at daily
 * granularity.
 *
 * This is an opt-in only feature. You can enable this feature from the Cost Explorer
 * Settings page. For information about how to access the Settings page, see Controlling
 * Access for Cost Explorer in the Billing and Cost Management User
 * Guide.
 */
export const getCostAndUsageWithResources =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCostAndUsageWithResourcesRequest,
    output: GetCostAndUsageWithResourcesResponse,
    errors: [
      BillExpirationException,
      BillingViewHealthStatusException,
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
      RequestChangedException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Retrieves a commitment purchase analysis result based on the
 * `AnalysisId`.
 */
export const getCommitmentPurchaseAnalysis =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCommitmentPurchaseAnalysisRequest,
    output: GetCommitmentPurchaseAnalysisResponse,
    errors: [
      AnalysisNotFoundException,
      DataUnavailableException,
      LimitExceededException,
    ],
  }));
/**
 * Retrieves the Savings Plans recommendations for your account. First use
 * `StartSavingsPlansPurchaseRecommendationGeneration` to generate a new set of
 * recommendations, and then use `GetSavingsPlansPurchaseRecommendation` to retrieve
 * them.
 */
export const getSavingsPlansPurchaseRecommendation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSavingsPlansPurchaseRecommendationRequest,
    output: GetSavingsPlansPurchaseRecommendationResponse,
    errors: [InvalidNextTokenException, LimitExceededException],
  }));
/**
 * Specifies the parameters of a planned commitment purchase and starts the generation of the
 * analysis. This enables you to estimate the cost, coverage, and utilization impact of your
 * planned commitment purchases.
 */
export const startCommitmentPurchaseAnalysis =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartCommitmentPurchaseAnalysisRequest,
    output: StartCommitmentPurchaseAnalysisResponse,
    errors: [
      DataUnavailableException,
      GenerationExistsException,
      LimitExceededException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Retrieves all of the cost anomalies detected on your account during the time period that's
 * specified by the `DateInterval` object. Anomalies are available for up to 90
 * days.
 */
export const getAnomalies = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetAnomaliesRequest,
    output: GetAnomaliesResponse,
    errors: [InvalidNextTokenException, LimitExceededException],
    pagination: {
      inputToken: "NextPageToken",
      outputToken: "NextPageToken",
      items: "Anomalies",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Gets recommendations for reservation purchases. These recommendations might help you to
 * reduce your costs. Reservations provide a discounted hourly rate (up to 75%) compared to
 * On-Demand pricing.
 *
 * Amazon Web Services generates your recommendations by identifying your On-Demand usage
 * during a specific time period and collecting your usage into categories that are eligible for
 * a reservation. After Amazon Web Services has these categories, it simulates every combination
 * of reservations in each category of usage to identify the best number of each type of Reserved
 * Instance (RI) to purchase to maximize your estimated savings.
 *
 * For example, Amazon Web Services automatically aggregates your Amazon EC2 Linux, shared
 * tenancy, and c4 family usage in the US West (Oregon) Region and recommends that you buy
 * size-flexible regional reservations to apply to the c4 family usage. Amazon Web Services
 * recommends the smallest size instance in an instance family. This makes it easier to purchase
 * a size-flexible Reserved Instance (RI). Amazon Web Services also shows the equal number of
 * normalized units. This way, you can purchase any instance size that you want. For this
 * example, your RI recommendation is for `c4.large` because that is the smallest size
 * instance in the c4 instance family.
 */
export const getReservationPurchaseRecommendation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetReservationPurchaseRecommendationRequest,
    output: GetReservationPurchaseRecommendationResponse,
    errors: [
      DataUnavailableException,
      InvalidNextTokenException,
      LimitExceededException,
    ],
  }));
/**
 * Creates recommendations that help you save cost by identifying idle and underutilized
 * Amazon EC2 instances.
 *
 * Recommendations are generated to either downsize or terminate instances, along with
 * providing savings detail and metrics. For more information about calculation and function, see
 * Optimizing Your Cost with Rightsizing Recommendations in the *Billing and Cost Management User Guide*.
 */
export const getRightsizingRecommendation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRightsizingRecommendationRequest,
    output: GetRightsizingRecommendationResponse,
    errors: [InvalidNextTokenException, LimitExceededException],
  }));
