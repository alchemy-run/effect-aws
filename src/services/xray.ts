import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({ sdkId: "XRay", serviceShapeName: "AWSXRay" });
const auth = T.AwsAuthSigv4({ name: "xray" });
const ver = T.ServiceVersion("2016-04-12");
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
                        url: "https://xray-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://xray-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://xray.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://xray.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetEncryptionConfigRequest extends S.Class<GetEncryptionConfigRequest>(
  "GetEncryptionConfigRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/EncryptionConfig" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTraceSegmentDestinationRequest extends S.Class<GetTraceSegmentDestinationRequest>(
  "GetTraceSegmentDestinationRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/GetTraceSegmentDestination" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TraceIdList = S.Array(S.String);
export const InsightStateList = S.Array(S.String);
export const TraceSegmentDocumentList = S.Array(S.String);
export const TraceIdListForRetrieval = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchGetTracesRequest extends S.Class<BatchGetTracesRequest>(
  "BatchGetTracesRequest",
)(
  { TraceIds: TraceIdList, NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/Traces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelTraceRetrievalRequest extends S.Class<CancelTraceRetrievalRequest>(
  "CancelTraceRetrievalRequest",
)(
  { RetrievalToken: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/CancelTraceRetrieval" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelTraceRetrievalResult extends S.Class<CancelTraceRetrievalResult>(
  "CancelTraceRetrievalResult",
)({}) {}
export class DeleteGroupRequest extends S.Class<DeleteGroupRequest>(
  "DeleteGroupRequest",
)(
  { GroupName: S.optional(S.String), GroupARN: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGroupResult extends S.Class<DeleteGroupResult>(
  "DeleteGroupResult",
)({}) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { PolicyName: S.String, PolicyRevisionId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteResourcePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyResult extends S.Class<DeleteResourcePolicyResult>(
  "DeleteResourcePolicyResult",
)({}) {}
export class DeleteSamplingRuleRequest extends S.Class<DeleteSamplingRuleRequest>(
  "DeleteSamplingRuleRequest",
)(
  { RuleName: S.optional(S.String), RuleARN: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteSamplingRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGroupRequest extends S.Class<GetGroupRequest>(
  "GetGroupRequest",
)(
  { GroupName: S.optional(S.String), GroupARN: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/GetGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGroupsRequest extends S.Class<GetGroupsRequest>(
  "GetGroupsRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/Groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIndexingRulesRequest extends S.Class<GetIndexingRulesRequest>(
  "GetIndexingRulesRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/GetIndexingRules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInsightRequest extends S.Class<GetInsightRequest>(
  "GetInsightRequest",
)(
  { InsightId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/Insight" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInsightEventsRequest extends S.Class<GetInsightEventsRequest>(
  "GetInsightEventsRequest",
)(
  {
    InsightId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/InsightEvents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInsightImpactGraphRequest extends S.Class<GetInsightImpactGraphRequest>(
  "GetInsightImpactGraphRequest",
)(
  {
    InsightId: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/InsightImpactGraph" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInsightSummariesRequest extends S.Class<GetInsightSummariesRequest>(
  "GetInsightSummariesRequest",
)(
  {
    States: S.optional(InsightStateList),
    GroupARN: S.optional(S.String),
    GroupName: S.optional(S.String),
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/InsightSummaries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRetrievedTracesGraphRequest extends S.Class<GetRetrievedTracesGraphRequest>(
  "GetRetrievedTracesGraphRequest",
)(
  { RetrievalToken: S.String, NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/GetRetrievedTracesGraph" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSamplingRulesRequest extends S.Class<GetSamplingRulesRequest>(
  "GetSamplingRulesRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/GetSamplingRules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSamplingStatisticSummariesRequest extends S.Class<GetSamplingStatisticSummariesRequest>(
  "GetSamplingStatisticSummariesRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/SamplingStatisticSummaries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServiceGraphRequest extends S.Class<GetServiceGraphRequest>(
  "GetServiceGraphRequest",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ServiceGraph" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTimeSeriesServiceStatisticsRequest extends S.Class<GetTimeSeriesServiceStatisticsRequest>(
  "GetTimeSeriesServiceStatisticsRequest",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
    EntitySelectorExpression: S.optional(S.String),
    Period: S.optional(S.Number),
    ForecastStatistics: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/TimeSeriesServiceStatistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTraceGraphRequest extends S.Class<GetTraceGraphRequest>(
  "GetTraceGraphRequest",
)(
  { TraceIds: TraceIdList, NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/TraceGraph" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTraceSegmentDestinationResult extends S.Class<GetTraceSegmentDestinationResult>(
  "GetTraceSegmentDestinationResult",
)({ Destination: S.optional(S.String), Status: S.optional(S.String) }) {}
export class ListResourcePoliciesRequest extends S.Class<ListResourcePoliciesRequest>(
  "ListResourcePoliciesRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListResourcePolicies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRetrievedTracesRequest extends S.Class<ListRetrievedTracesRequest>(
  "ListRetrievedTracesRequest",
)(
  {
    RetrievalToken: S.String,
    TraceFormat: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListRetrievedTraces" }),
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
  { ResourceARN: S.String, NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListTagsForResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutEncryptionConfigRequest extends S.Class<PutEncryptionConfigRequest>(
  "PutEncryptionConfigRequest",
)(
  { KeyId: S.optional(S.String), Type: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/PutEncryptionConfig" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  {
    PolicyName: S.String,
    PolicyDocument: S.String,
    PolicyRevisionId: S.optional(S.String),
    BypassPolicyLockoutCheck: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutResourcePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTraceSegmentsRequest extends S.Class<PutTraceSegmentsRequest>(
  "PutTraceSegmentsRequest",
)(
  { TraceSegmentDocuments: TraceSegmentDocumentList },
  T.all(
    T.Http({ method: "POST", uri: "/TraceSegments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartTraceRetrievalRequest extends S.Class<StartTraceRetrievalRequest>(
  "StartTraceRetrievalRequest",
)(
  {
    TraceIds: TraceIdListForRetrieval,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartTraceRetrieval" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
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
export class InsightsConfiguration extends S.Class<InsightsConfiguration>(
  "InsightsConfiguration",
)({
  InsightsEnabled: S.optional(S.Boolean),
  NotificationsEnabled: S.optional(S.Boolean),
}) {}
export class UpdateGroupRequest extends S.Class<UpdateGroupRequest>(
  "UpdateGroupRequest",
)(
  {
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
    FilterExpression: S.optional(S.String),
    InsightsConfiguration: S.optional(InsightsConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTraceSegmentDestinationRequest extends S.Class<UpdateTraceSegmentDestinationRequest>(
  "UpdateTraceSegmentDestinationRequest",
)(
  { Destination: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateTraceSegmentDestination" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const UnprocessedTraceIdList = S.Array(S.String);
export class EncryptionConfig extends S.Class<EncryptionConfig>(
  "EncryptionConfig",
)({
  KeyId: S.optional(S.String),
  Status: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const AttributeMap = S.Record({ key: S.String, value: S.String });
export class SamplingRateBoost extends S.Class<SamplingRateBoost>(
  "SamplingRateBoost",
)({ MaxRate: S.Number, CooldownWindowMinutes: S.Number }) {}
export class SamplingRule extends S.Class<SamplingRule>("SamplingRule")({
  RuleName: S.optional(S.String),
  RuleARN: S.optional(S.String),
  ResourceARN: S.String,
  Priority: S.Number,
  FixedRate: S.Number,
  ReservoirSize: S.Number,
  ServiceName: S.String,
  ServiceType: S.String,
  Host: S.String,
  HTTPMethod: S.String,
  URLPath: S.String,
  Version: S.Number,
  Attributes: S.optional(AttributeMap),
  SamplingRateBoost: S.optional(SamplingRateBoost),
}) {}
export class SamplingRuleRecord extends S.Class<SamplingRuleRecord>(
  "SamplingRuleRecord",
)({
  SamplingRule: S.optional(SamplingRule),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SamplingRuleRecordList = S.Array(SamplingRuleRecord);
export class SamplingStatisticsDocument extends S.Class<SamplingStatisticsDocument>(
  "SamplingStatisticsDocument",
)({
  RuleName: S.String,
  ClientID: S.String,
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RequestCount: S.Number,
  SampledCount: S.Number,
  BorrowCount: S.optional(S.Number),
}) {}
export const SamplingStatisticsDocumentList = S.Array(
  SamplingStatisticsDocument,
);
export class SamplingBoostStatisticsDocument extends S.Class<SamplingBoostStatisticsDocument>(
  "SamplingBoostStatisticsDocument",
)({
  RuleName: S.String,
  ServiceName: S.String,
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AnomalyCount: S.Number,
  TotalCount: S.Number,
  SampledAnomalyCount: S.Number,
}) {}
export const SamplingBoostStatisticsDocumentList = S.Array(
  SamplingBoostStatisticsDocument,
);
export class SamplingStrategy extends S.Class<SamplingStrategy>(
  "SamplingStrategy",
)({ Name: S.optional(S.String), Value: S.optional(S.Number) }) {}
export class SamplingRuleUpdate extends S.Class<SamplingRuleUpdate>(
  "SamplingRuleUpdate",
)({
  RuleName: S.optional(S.String),
  RuleARN: S.optional(S.String),
  ResourceARN: S.optional(S.String),
  Priority: S.optional(S.Number),
  FixedRate: S.optional(S.Number),
  ReservoirSize: S.optional(S.Number),
  Host: S.optional(S.String),
  ServiceName: S.optional(S.String),
  ServiceType: S.optional(S.String),
  HTTPMethod: S.optional(S.String),
  URLPath: S.optional(S.String),
  Attributes: S.optional(AttributeMap),
  SamplingRateBoost: S.optional(SamplingRateBoost),
}) {}
export class CreateGroupRequest extends S.Class<CreateGroupRequest>(
  "CreateGroupRequest",
)(
  {
    GroupName: S.String,
    FilterExpression: S.optional(S.String),
    InsightsConfiguration: S.optional(InsightsConfiguration),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEncryptionConfigResult extends S.Class<GetEncryptionConfigResult>(
  "GetEncryptionConfigResult",
)({ EncryptionConfig: S.optional(EncryptionConfig) }) {}
export class GetSamplingRulesResult extends S.Class<GetSamplingRulesResult>(
  "GetSamplingRulesResult",
)({
  SamplingRuleRecords: S.optional(SamplingRuleRecordList),
  NextToken: S.optional(S.String),
}) {}
export class GetSamplingTargetsRequest extends S.Class<GetSamplingTargetsRequest>(
  "GetSamplingTargetsRequest",
)(
  {
    SamplingStatisticsDocuments: SamplingStatisticsDocumentList,
    SamplingBoostStatisticsDocuments: S.optional(
      SamplingBoostStatisticsDocumentList,
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/SamplingTargets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ServiceNames = S.Array(S.String);
export class ErrorStatistics extends S.Class<ErrorStatistics>(
  "ErrorStatistics",
)({
  ThrottleCount: S.optional(S.Number),
  OtherCount: S.optional(S.Number),
  TotalCount: S.optional(S.Number),
}) {}
export class FaultStatistics extends S.Class<FaultStatistics>(
  "FaultStatistics",
)({ OtherCount: S.optional(S.Number), TotalCount: S.optional(S.Number) }) {}
export class EdgeStatistics extends S.Class<EdgeStatistics>("EdgeStatistics")({
  OkCount: S.optional(S.Number),
  ErrorStatistics: S.optional(ErrorStatistics),
  FaultStatistics: S.optional(FaultStatistics),
  TotalCount: S.optional(S.Number),
  TotalResponseTime: S.optional(S.Number),
}) {}
export class HistogramEntry extends S.Class<HistogramEntry>("HistogramEntry")({
  Value: S.optional(S.Number),
  Count: S.optional(S.Number),
}) {}
export const Histogram = S.Array(HistogramEntry);
export const AliasNames = S.Array(S.String);
export class Alias extends S.Class<Alias>("Alias")({
  Name: S.optional(S.String),
  Names: S.optional(AliasNames),
  Type: S.optional(S.String),
}) {}
export const AliasList = S.Array(Alias);
export class Edge extends S.Class<Edge>("Edge")({
  ReferenceId: S.optional(S.Number),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SummaryStatistics: S.optional(EdgeStatistics),
  ResponseTimeHistogram: S.optional(Histogram),
  Aliases: S.optional(AliasList),
  EdgeType: S.optional(S.String),
  ReceivedEventAgeHistogram: S.optional(Histogram),
}) {}
export const EdgeList = S.Array(Edge);
export class ServiceStatistics extends S.Class<ServiceStatistics>(
  "ServiceStatistics",
)({
  OkCount: S.optional(S.Number),
  ErrorStatistics: S.optional(ErrorStatistics),
  FaultStatistics: S.optional(FaultStatistics),
  TotalCount: S.optional(S.Number),
  TotalResponseTime: S.optional(S.Number),
}) {}
export class Service extends S.Class<Service>("Service")({
  ReferenceId: S.optional(S.Number),
  Name: S.optional(S.String),
  Names: S.optional(ServiceNames),
  Root: S.optional(S.Boolean),
  AccountId: S.optional(S.String),
  Type: S.optional(S.String),
  State: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Edges: S.optional(EdgeList),
  SummaryStatistics: S.optional(ServiceStatistics),
  DurationHistogram: S.optional(Histogram),
  ResponseTimeHistogram: S.optional(Histogram),
}) {}
export const ServiceList = S.Array(Service);
export class GetTraceGraphResult extends S.Class<GetTraceGraphResult>(
  "GetTraceGraphResult",
)({ Services: S.optional(ServiceList), NextToken: S.optional(S.String) }) {}
export class GetTraceSummariesRequest extends S.Class<GetTraceSummariesRequest>(
  "GetTraceSummariesRequest",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    TimeRangeType: S.optional(S.String),
    Sampling: S.optional(S.Boolean),
    SamplingStrategy: S.optional(SamplingStrategy),
    FilterExpression: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/TraceSummaries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }) {}
export class PutEncryptionConfigResult extends S.Class<PutEncryptionConfigResult>(
  "PutEncryptionConfigResult",
)({ EncryptionConfig: S.optional(EncryptionConfig) }) {}
export class ResourcePolicy extends S.Class<ResourcePolicy>("ResourcePolicy")({
  PolicyName: S.optional(S.String),
  PolicyDocument: S.optional(S.String),
  PolicyRevisionId: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class PutResourcePolicyResult extends S.Class<PutResourcePolicyResult>(
  "PutResourcePolicyResult",
)({ ResourcePolicy: S.optional(ResourcePolicy) }) {}
export class StartTraceRetrievalResult extends S.Class<StartTraceRetrievalResult>(
  "StartTraceRetrievalResult",
)({ RetrievalToken: S.optional(S.String) }) {}
export class Group extends S.Class<Group>("Group")({
  GroupName: S.optional(S.String),
  GroupARN: S.optional(S.String),
  FilterExpression: S.optional(S.String),
  InsightsConfiguration: S.optional(InsightsConfiguration),
}) {}
export class UpdateGroupResult extends S.Class<UpdateGroupResult>(
  "UpdateGroupResult",
)({ Group: S.optional(Group) }) {}
export class UpdateSamplingRuleRequest extends S.Class<UpdateSamplingRuleRequest>(
  "UpdateSamplingRuleRequest",
)(
  { SamplingRuleUpdate: SamplingRuleUpdate },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateSamplingRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTraceSegmentDestinationResult extends S.Class<UpdateTraceSegmentDestinationResult>(
  "UpdateTraceSegmentDestinationResult",
)({ Destination: S.optional(S.String), Status: S.optional(S.String) }) {}
export const InsightCategoryList = S.Array(S.String);
export class BackendConnectionErrors extends S.Class<BackendConnectionErrors>(
  "BackendConnectionErrors",
)({
  TimeoutCount: S.optional(S.Number),
  ConnectionRefusedCount: S.optional(S.Number),
  HTTPCode4XXCount: S.optional(S.Number),
  HTTPCode5XXCount: S.optional(S.Number),
  UnknownHostCount: S.optional(S.Number),
  OtherCount: S.optional(S.Number),
}) {}
export class ProbabilisticRuleValueUpdate extends S.Class<ProbabilisticRuleValueUpdate>(
  "ProbabilisticRuleValueUpdate",
)({ DesiredSamplingPercentage: S.Number }) {}
export class GroupSummary extends S.Class<GroupSummary>("GroupSummary")({
  GroupName: S.optional(S.String),
  GroupARN: S.optional(S.String),
  FilterExpression: S.optional(S.String),
  InsightsConfiguration: S.optional(InsightsConfiguration),
}) {}
export const GroupSummaryList = S.Array(GroupSummary);
export class RequestImpactStatistics extends S.Class<RequestImpactStatistics>(
  "RequestImpactStatistics",
)({
  FaultCount: S.optional(S.Number),
  OkCount: S.optional(S.Number),
  TotalCount: S.optional(S.Number),
}) {}
export class ServiceId extends S.Class<ServiceId>("ServiceId")({
  Name: S.optional(S.String),
  Names: S.optional(ServiceNames),
  AccountId: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export class AnomalousService extends S.Class<AnomalousService>(
  "AnomalousService",
)({ ServiceId: S.optional(ServiceId) }) {}
export const AnomalousServiceList = S.Array(AnomalousService);
export class InsightEvent extends S.Class<InsightEvent>("InsightEvent")({
  Summary: S.optional(S.String),
  EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ClientRequestImpactStatistics: S.optional(RequestImpactStatistics),
  RootCauseServiceRequestImpactStatistics: S.optional(RequestImpactStatistics),
  TopAnomalousServices: S.optional(AnomalousServiceList),
}) {}
export const InsightEventList = S.Array(InsightEvent);
export class InsightSummary extends S.Class<InsightSummary>("InsightSummary")({
  InsightId: S.optional(S.String),
  GroupARN: S.optional(S.String),
  GroupName: S.optional(S.String),
  RootCauseServiceId: S.optional(ServiceId),
  Categories: S.optional(InsightCategoryList),
  State: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Summary: S.optional(S.String),
  ClientRequestImpactStatistics: S.optional(RequestImpactStatistics),
  RootCauseServiceRequestImpactStatistics: S.optional(RequestImpactStatistics),
  TopAnomalousServices: S.optional(AnomalousServiceList),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const InsightSummaryList = S.Array(InsightSummary);
export class SamplingStatisticSummary extends S.Class<SamplingStatisticSummary>(
  "SamplingStatisticSummary",
)({
  RuleName: S.optional(S.String),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RequestCount: S.optional(S.Number),
  BorrowCount: S.optional(S.Number),
  SampledCount: S.optional(S.Number),
}) {}
export const SamplingStatisticSummaryList = S.Array(SamplingStatisticSummary);
export const ResourcePolicyList = S.Array(ResourcePolicy);
export class TelemetryRecord extends S.Class<TelemetryRecord>(
  "TelemetryRecord",
)({
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  SegmentsReceivedCount: S.optional(S.Number),
  SegmentsSentCount: S.optional(S.Number),
  SegmentsSpilloverCount: S.optional(S.Number),
  SegmentsRejectedCount: S.optional(S.Number),
  BackendConnectionErrors: S.optional(BackendConnectionErrors),
}) {}
export const TelemetryRecordList = S.Array(TelemetryRecord);
export class UnprocessedTraceSegment extends S.Class<UnprocessedTraceSegment>(
  "UnprocessedTraceSegment",
)({
  Id: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const UnprocessedTraceSegmentList = S.Array(UnprocessedTraceSegment);
export const IndexingRuleValueUpdate = S.Union(
  S.Struct({ Probabilistic: ProbabilisticRuleValueUpdate }),
);
export class CreateGroupResult extends S.Class<CreateGroupResult>(
  "CreateGroupResult",
)({ Group: S.optional(Group) }) {}
export class CreateSamplingRuleRequest extends S.Class<CreateSamplingRuleRequest>(
  "CreateSamplingRuleRequest",
)(
  { SamplingRule: SamplingRule, Tags: S.optional(TagList) },
  T.all(
    T.Http({ method: "POST", uri: "/CreateSamplingRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSamplingRuleResult extends S.Class<DeleteSamplingRuleResult>(
  "DeleteSamplingRuleResult",
)({ SamplingRuleRecord: S.optional(SamplingRuleRecord) }) {}
export class GetGroupResult extends S.Class<GetGroupResult>("GetGroupResult")({
  Group: S.optional(Group),
}) {}
export class GetGroupsResult extends S.Class<GetGroupsResult>(
  "GetGroupsResult",
)({ Groups: S.optional(GroupSummaryList), NextToken: S.optional(S.String) }) {}
export class GetInsightEventsResult extends S.Class<GetInsightEventsResult>(
  "GetInsightEventsResult",
)({
  InsightEvents: S.optional(InsightEventList),
  NextToken: S.optional(S.String),
}) {}
export class GetInsightSummariesResult extends S.Class<GetInsightSummariesResult>(
  "GetInsightSummariesResult",
)({
  InsightSummaries: S.optional(InsightSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class GetSamplingStatisticSummariesResult extends S.Class<GetSamplingStatisticSummariesResult>(
  "GetSamplingStatisticSummariesResult",
)({
  SamplingStatisticSummaries: S.optional(SamplingStatisticSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListResourcePoliciesResult extends S.Class<ListResourcePoliciesResult>(
  "ListResourcePoliciesResult",
)({
  ResourcePolicies: S.optional(ResourcePolicyList),
  NextToken: S.optional(S.String),
}) {}
export class PutTelemetryRecordsRequest extends S.Class<PutTelemetryRecordsRequest>(
  "PutTelemetryRecordsRequest",
)(
  {
    TelemetryRecords: TelemetryRecordList,
    EC2InstanceId: S.optional(S.String),
    Hostname: S.optional(S.String),
    ResourceARN: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/TelemetryRecords" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTelemetryRecordsResult extends S.Class<PutTelemetryRecordsResult>(
  "PutTelemetryRecordsResult",
)({}) {}
export class PutTraceSegmentsResult extends S.Class<PutTraceSegmentsResult>(
  "PutTraceSegmentsResult",
)({ UnprocessedTraceSegments: S.optional(UnprocessedTraceSegmentList) }) {}
export class UpdateIndexingRuleRequest extends S.Class<UpdateIndexingRuleRequest>(
  "UpdateIndexingRuleRequest",
)(
  { Name: S.String, Rule: IndexingRuleValueUpdate },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateIndexingRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSamplingRuleResult extends S.Class<UpdateSamplingRuleResult>(
  "UpdateSamplingRuleResult",
)({ SamplingRuleRecord: S.optional(SamplingRuleRecord) }) {}
export class Segment extends S.Class<Segment>("Segment")({
  Id: S.optional(S.String),
  Document: S.optional(S.String),
}) {}
export const SegmentList = S.Array(Segment);
export class InsightImpactGraphEdge extends S.Class<InsightImpactGraphEdge>(
  "InsightImpactGraphEdge",
)({ ReferenceId: S.optional(S.Number) }) {}
export const InsightImpactGraphEdgeList = S.Array(InsightImpactGraphEdge);
export class GraphLink extends S.Class<GraphLink>("GraphLink")({
  ReferenceType: S.optional(S.String),
  SourceTraceId: S.optional(S.String),
  DestinationTraceIds: S.optional(TraceIdList),
}) {}
export const LinksList = S.Array(GraphLink);
export class ForecastStatistics extends S.Class<ForecastStatistics>(
  "ForecastStatistics",
)({
  FaultCountHigh: S.optional(S.Number),
  FaultCountLow: S.optional(S.Number),
}) {}
export const ServiceIds = S.Array(ServiceId);
export class Span extends S.Class<Span>("Span")({
  Id: S.optional(S.String),
  Document: S.optional(S.String),
}) {}
export const SpanList = S.Array(Span);
export class Trace extends S.Class<Trace>("Trace")({
  Id: S.optional(S.String),
  Duration: S.optional(S.Number),
  LimitExceeded: S.optional(S.Boolean),
  Segments: S.optional(SegmentList),
}) {}
export const TraceList = S.Array(Trace);
export class Insight extends S.Class<Insight>("Insight")({
  InsightId: S.optional(S.String),
  GroupARN: S.optional(S.String),
  GroupName: S.optional(S.String),
  RootCauseServiceId: S.optional(ServiceId),
  Categories: S.optional(InsightCategoryList),
  State: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Summary: S.optional(S.String),
  ClientRequestImpactStatistics: S.optional(RequestImpactStatistics),
  RootCauseServiceRequestImpactStatistics: S.optional(RequestImpactStatistics),
  TopAnomalousServices: S.optional(AnomalousServiceList),
}) {}
export class InsightImpactGraphService extends S.Class<InsightImpactGraphService>(
  "InsightImpactGraphService",
)({
  ReferenceId: S.optional(S.Number),
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  Names: S.optional(ServiceNames),
  AccountId: S.optional(S.String),
  Edges: S.optional(InsightImpactGraphEdgeList),
}) {}
export const InsightImpactGraphServiceList = S.Array(InsightImpactGraphService);
export class RetrievedService extends S.Class<RetrievedService>(
  "RetrievedService",
)({ Service: S.optional(Service), Links: S.optional(LinksList) }) {}
export const RetrievedServicesList = S.Array(RetrievedService);
export class UnprocessedStatistics extends S.Class<UnprocessedStatistics>(
  "UnprocessedStatistics",
)({
  RuleName: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const UnprocessedStatisticsList = S.Array(UnprocessedStatistics);
export class TimeSeriesServiceStatistics extends S.Class<TimeSeriesServiceStatistics>(
  "TimeSeriesServiceStatistics",
)({
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EdgeSummaryStatistics: S.optional(EdgeStatistics),
  ServiceSummaryStatistics: S.optional(ServiceStatistics),
  ServiceForecastStatistics: S.optional(ForecastStatistics),
  ResponseTimeHistogram: S.optional(Histogram),
}) {}
export const TimeSeriesServiceStatisticsList = S.Array(
  TimeSeriesServiceStatistics,
);
export class RetrievedTrace extends S.Class<RetrievedTrace>("RetrievedTrace")({
  Id: S.optional(S.String),
  Duration: S.optional(S.Number),
  Spans: S.optional(SpanList),
}) {}
export const TraceSpanList = S.Array(RetrievedTrace);
export class ProbabilisticRuleValue extends S.Class<ProbabilisticRuleValue>(
  "ProbabilisticRuleValue",
)({
  DesiredSamplingPercentage: S.Number,
  ActualSamplingPercentage: S.optional(S.Number),
}) {}
export class BatchGetTracesResult extends S.Class<BatchGetTracesResult>(
  "BatchGetTracesResult",
)({
  Traces: S.optional(TraceList),
  UnprocessedTraceIds: S.optional(UnprocessedTraceIdList),
  NextToken: S.optional(S.String),
}) {}
export class CreateSamplingRuleResult extends S.Class<CreateSamplingRuleResult>(
  "CreateSamplingRuleResult",
)({ SamplingRuleRecord: S.optional(SamplingRuleRecord) }) {}
export class GetInsightResult extends S.Class<GetInsightResult>(
  "GetInsightResult",
)({ Insight: S.optional(Insight) }) {}
export class GetInsightImpactGraphResult extends S.Class<GetInsightImpactGraphResult>(
  "GetInsightImpactGraphResult",
)({
  InsightId: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ServiceGraphStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ServiceGraphEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Services: S.optional(InsightImpactGraphServiceList),
  NextToken: S.optional(S.String),
}) {}
export class GetRetrievedTracesGraphResult extends S.Class<GetRetrievedTracesGraphResult>(
  "GetRetrievedTracesGraphResult",
)({
  RetrievalStatus: S.optional(S.String),
  Services: S.optional(RetrievedServicesList),
  NextToken: S.optional(S.String),
}) {}
export class GetTimeSeriesServiceStatisticsResult extends S.Class<GetTimeSeriesServiceStatisticsResult>(
  "GetTimeSeriesServiceStatisticsResult",
)({
  TimeSeriesServiceStatistics: S.optional(TimeSeriesServiceStatisticsList),
  ContainsOldGroupVersions: S.optional(S.Boolean),
  NextToken: S.optional(S.String),
}) {}
export class ListRetrievedTracesResult extends S.Class<ListRetrievedTracesResult>(
  "ListRetrievedTracesResult",
)({
  RetrievalStatus: S.optional(S.String),
  TraceFormat: S.optional(S.String),
  Traces: S.optional(TraceSpanList),
  NextToken: S.optional(S.String),
}) {}
export const IndexingRuleValue = S.Union(
  S.Struct({ Probabilistic: ProbabilisticRuleValue }),
);
export class IndexingRule extends S.Class<IndexingRule>("IndexingRule")({
  Name: S.optional(S.String),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Rule: S.optional(IndexingRuleValue),
}) {}
export class UpdateIndexingRuleResult extends S.Class<UpdateIndexingRuleResult>(
  "UpdateIndexingRuleResult",
)({ IndexingRule: S.optional(IndexingRule) }) {}
export class SamplingBoost extends S.Class<SamplingBoost>("SamplingBoost")({
  BoostRate: S.Number,
  BoostRateTTL: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class Http extends S.Class<Http>("Http")({
  HttpURL: S.optional(S.String),
  HttpStatus: S.optional(S.Number),
  HttpMethod: S.optional(S.String),
  UserAgent: S.optional(S.String),
  ClientIp: S.optional(S.String),
}) {}
export class TraceUser extends S.Class<TraceUser>("TraceUser")({
  UserName: S.optional(S.String),
  ServiceIds: S.optional(ServiceIds),
}) {}
export const TraceUsers = S.Array(TraceUser);
export class ResourceARNDetail extends S.Class<ResourceARNDetail>(
  "ResourceARNDetail",
)({ ARN: S.optional(S.String) }) {}
export const TraceResourceARNs = S.Array(ResourceARNDetail);
export class InstanceIdDetail extends S.Class<InstanceIdDetail>(
  "InstanceIdDetail",
)({ Id: S.optional(S.String) }) {}
export const TraceInstanceIds = S.Array(InstanceIdDetail);
export class AvailabilityZoneDetail extends S.Class<AvailabilityZoneDetail>(
  "AvailabilityZoneDetail",
)({ Name: S.optional(S.String) }) {}
export const TraceAvailabilityZones = S.Array(AvailabilityZoneDetail);
export const IndexingRuleList = S.Array(IndexingRule);
export class SamplingTargetDocument extends S.Class<SamplingTargetDocument>(
  "SamplingTargetDocument",
)({
  RuleName: S.optional(S.String),
  FixedRate: S.optional(S.Number),
  ReservoirQuota: S.optional(S.Number),
  ReservoirQuotaTTL: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Interval: S.optional(S.Number),
  SamplingBoost: S.optional(SamplingBoost),
}) {}
export const SamplingTargetDocumentList = S.Array(SamplingTargetDocument);
export class GetIndexingRulesResult extends S.Class<GetIndexingRulesResult>(
  "GetIndexingRulesResult",
)({
  IndexingRules: S.optional(IndexingRuleList),
  NextToken: S.optional(S.String),
}) {}
export class GetSamplingTargetsResult extends S.Class<GetSamplingTargetsResult>(
  "GetSamplingTargetsResult",
)({
  SamplingTargetDocuments: S.optional(SamplingTargetDocumentList),
  LastRuleModification: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  UnprocessedStatistics: S.optional(UnprocessedStatisticsList),
  UnprocessedBoostStatistics: S.optional(UnprocessedStatisticsList),
}) {}
export class GetServiceGraphResult extends S.Class<GetServiceGraphResult>(
  "GetServiceGraphResult",
)({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Services: S.optional(ServiceList),
  ContainsOldGroupVersions: S.optional(S.Boolean),
  NextToken: S.optional(S.String),
}) {}
export const AnnotationValue = S.Union(
  S.Struct({ NumberValue: S.Number }),
  S.Struct({ BooleanValue: S.Boolean }),
  S.Struct({ StringValue: S.String }),
);
export class RootCauseException extends S.Class<RootCauseException>(
  "RootCauseException",
)({ Name: S.optional(S.String), Message: S.optional(S.String) }) {}
export const RootCauseExceptions = S.Array(RootCauseException);
export class ErrorRootCauseEntity extends S.Class<ErrorRootCauseEntity>(
  "ErrorRootCauseEntity",
)({
  Name: S.optional(S.String),
  Exceptions: S.optional(RootCauseExceptions),
  Remote: S.optional(S.Boolean),
}) {}
export const ErrorRootCauseEntityPath = S.Array(ErrorRootCauseEntity);
export class ResponseTimeRootCauseEntity extends S.Class<ResponseTimeRootCauseEntity>(
  "ResponseTimeRootCauseEntity",
)({
  Name: S.optional(S.String),
  Coverage: S.optional(S.Number),
  Remote: S.optional(S.Boolean),
}) {}
export const ResponseTimeRootCauseEntityPath = S.Array(
  ResponseTimeRootCauseEntity,
);
export class ValueWithServiceIds extends S.Class<ValueWithServiceIds>(
  "ValueWithServiceIds",
)({
  AnnotationValue: S.optional(AnnotationValue),
  ServiceIds: S.optional(ServiceIds),
}) {}
export const ValuesWithServiceIds = S.Array(ValueWithServiceIds);
export class ErrorRootCauseService extends S.Class<ErrorRootCauseService>(
  "ErrorRootCauseService",
)({
  Name: S.optional(S.String),
  Names: S.optional(ServiceNames),
  Type: S.optional(S.String),
  AccountId: S.optional(S.String),
  EntityPath: S.optional(ErrorRootCauseEntityPath),
  Inferred: S.optional(S.Boolean),
}) {}
export const ErrorRootCauseServices = S.Array(ErrorRootCauseService);
export class ResponseTimeRootCauseService extends S.Class<ResponseTimeRootCauseService>(
  "ResponseTimeRootCauseService",
)({
  Name: S.optional(S.String),
  Names: S.optional(ServiceNames),
  Type: S.optional(S.String),
  AccountId: S.optional(S.String),
  EntityPath: S.optional(ResponseTimeRootCauseEntityPath),
  Inferred: S.optional(S.Boolean),
}) {}
export const ResponseTimeRootCauseServices = S.Array(
  ResponseTimeRootCauseService,
);
export const Annotations = S.Record({
  key: S.String,
  value: ValuesWithServiceIds,
});
export class ErrorRootCause extends S.Class<ErrorRootCause>("ErrorRootCause")({
  Services: S.optional(ErrorRootCauseServices),
  ClientImpacting: S.optional(S.Boolean),
}) {}
export const ErrorRootCauses = S.Array(ErrorRootCause);
export class ResponseTimeRootCause extends S.Class<ResponseTimeRootCause>(
  "ResponseTimeRootCause",
)({
  Services: S.optional(ResponseTimeRootCauseServices),
  ClientImpacting: S.optional(S.Boolean),
}) {}
export const ResponseTimeRootCauses = S.Array(ResponseTimeRootCause);
export class FaultRootCauseEntity extends S.Class<FaultRootCauseEntity>(
  "FaultRootCauseEntity",
)({
  Name: S.optional(S.String),
  Exceptions: S.optional(RootCauseExceptions),
  Remote: S.optional(S.Boolean),
}) {}
export const FaultRootCauseEntityPath = S.Array(FaultRootCauseEntity);
export class FaultRootCauseService extends S.Class<FaultRootCauseService>(
  "FaultRootCauseService",
)({
  Name: S.optional(S.String),
  Names: S.optional(ServiceNames),
  Type: S.optional(S.String),
  AccountId: S.optional(S.String),
  EntityPath: S.optional(FaultRootCauseEntityPath),
  Inferred: S.optional(S.Boolean),
}) {}
export const FaultRootCauseServices = S.Array(FaultRootCauseService);
export class FaultRootCause extends S.Class<FaultRootCause>("FaultRootCause")({
  Services: S.optional(FaultRootCauseServices),
  ClientImpacting: S.optional(S.Boolean),
}) {}
export const FaultRootCauses = S.Array(FaultRootCause);
export class TraceSummary extends S.Class<TraceSummary>("TraceSummary")({
  Id: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Duration: S.optional(S.Number),
  ResponseTime: S.optional(S.Number),
  HasFault: S.optional(S.Boolean),
  HasError: S.optional(S.Boolean),
  HasThrottle: S.optional(S.Boolean),
  IsPartial: S.optional(S.Boolean),
  Http: S.optional(Http),
  Annotations: S.optional(Annotations),
  Users: S.optional(TraceUsers),
  ServiceIds: S.optional(ServiceIds),
  ResourceARNs: S.optional(TraceResourceARNs),
  InstanceIds: S.optional(TraceInstanceIds),
  AvailabilityZones: S.optional(TraceAvailabilityZones),
  EntryPoint: S.optional(ServiceId),
  FaultRootCauses: S.optional(FaultRootCauses),
  ErrorRootCauses: S.optional(ErrorRootCauses),
  ResponseTimeRootCauses: S.optional(ResponseTimeRootCauses),
  Revision: S.optional(S.Number),
  MatchedEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TraceSummaryList = S.Array(TraceSummary);
export class GetTraceSummariesResult extends S.Class<GetTraceSummariesResult>(
  "GetTraceSummariesResult",
)({
  TraceSummaries: S.optional(TraceSummaryList),
  ApproximateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TracesProcessedCount: S.optional(S.Number),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class InvalidPolicyRevisionIdException extends S.TaggedError<InvalidPolicyRevisionIdException>()(
  "InvalidPolicyRevisionIdException",
  { Message: S.optional(S.String) },
) {}
export class LockoutPreventionException extends S.TaggedError<LockoutPreventionException>()(
  "LockoutPreventionException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  { Message: S.optional(S.String) },
) {}
export class RuleLimitExceededException extends S.TaggedError<RuleLimitExceededException>()(
  "RuleLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class PolicyCountLimitExceededException extends S.TaggedError<PolicyCountLimitExceededException>()(
  "PolicyCountLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class PolicySizeLimitExceededException extends S.TaggedError<PolicySizeLimitExceededException>()(
  "PolicySizeLimitExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves the current destination of data sent to `PutTraceSegments` and *OpenTelemetry protocol (OTLP)* endpoint. The Transaction Search feature requires a CloudWatchLogs destination. For more information, see Transaction Search and OpenTelemetry.
 */
export const getTraceSegmentDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTraceSegmentDestinationRequest,
    output: GetTraceSegmentDestinationResult,
    errors: [InvalidRequestException, ThrottledException],
  }),
);
/**
 * Removes tags from an Amazon Web Services X-Ray group or sampling rule. You cannot edit or delete system
 * tags (those with an `aws:` prefix).
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Cancels an ongoing trace retrieval job initiated by `StartTraceRetrieval` using the provided `RetrievalToken`. A successful cancellation will return an HTTP 200 response.
 */
export const cancelTraceRetrieval = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelTraceRetrievalRequest,
    output: CancelTraceRetrievalResult,
    errors: [
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottledException,
    ],
  }),
);
/**
 * Deletes a group resource.
 */
export const deleteGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Deletes a resource policy from the target Amazon Web Services account.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResult,
    errors: [
      InvalidPolicyRevisionIdException,
      InvalidRequestException,
      ThrottledException,
    ],
  }),
);
/**
 * Retrieves the current encryption configuration for X-Ray data.
 */
export const getEncryptionConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEncryptionConfigRequest,
  output: GetEncryptionConfigResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves all sampling rules.
 */
export const getSamplingRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSamplingRulesRequest,
  output: GetSamplingRulesResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves a service graph for one or more specific trace IDs.
 */
export const getTraceGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTraceGraphRequest,
  output: GetTraceGraphResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Returns a list of tags that are applied to the specified Amazon Web Services X-Ray group or sampling rule.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Updates the encryption configuration for X-Ray data.
 */
export const putEncryptionConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEncryptionConfigRequest,
  output: PutEncryptionConfigResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Initiates a trace retrieval process using the specified time range and for the given trace IDs in the Transaction Search generated CloudWatch log group. For more information, see Transaction Search.
 *
 * API returns a `RetrievalToken`, which can be used with `ListRetrievedTraces` or `GetRetrievedTracesGraph` to fetch results. Retrievals will time out after 60 minutes. To execute long time ranges, consider segmenting into multiple retrievals.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation in a monitoring account to retrieve data from a linked source account, as long as both accounts have transaction search enabled.
 *
 * For retrieving data from X-Ray directly as opposed to the Transaction-Search Log group, see BatchGetTraces.
 */
export const startTraceRetrieval = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTraceRetrievalRequest,
  output: StartTraceRetrievalResult,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Updates a group resource.
 */
export const updateGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Modifies the destination of data sent to `PutTraceSegments`. The Transaction Search feature requires the CloudWatchLogs destination. For more information, see Transaction Search.
 */
export const updateTraceSegmentDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateTraceSegmentDestinationRequest,
    output: UpdateTraceSegmentDestinationResult,
    errors: [InvalidRequestException, ThrottledException],
  }));
/**
 * Creates a group resource with a name and a filter expression.
 */
export const createGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Deletes a sampling rule.
 */
export const deleteSamplingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSamplingRuleRequest,
  output: DeleteSamplingRuleResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves group resource details.
 */
export const getGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupRequest,
  output: GetGroupResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves all active group details.
 */
export const getGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupsRequest,
  output: GetGroupsResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * X-Ray reevaluates insights periodically until they're resolved, and records each intermediate state as an
 * event. You can review an insight's events in the Impact Timeline on the Inspect page in the X-Ray
 * console.
 */
export const getInsightEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightEventsRequest,
  output: GetInsightEventsResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves the summaries of all insights in the specified group matching the provided filter values.
 */
export const getInsightSummaries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightSummariesRequest,
  output: GetInsightSummariesResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves information about recent sampling results for all sampling rules.
 */
export const getSamplingStatisticSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSamplingStatisticSummariesRequest,
    output: GetSamplingStatisticSummariesResult,
    errors: [InvalidRequestException, ThrottledException],
  }));
/**
 * Returns the list of resource policies in the target Amazon Web Services account.
 */
export const listResourcePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourcePoliciesRequest,
    output: ListResourcePoliciesResult,
    errors: [InvalidRequestException, ThrottledException],
  }),
);
/**
 * Used by the Amazon Web Services X-Ray daemon to upload telemetry.
 */
export const putTelemetryRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTelemetryRecordsRequest,
  output: PutTelemetryRecordsResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Uploads segment documents to Amazon Web Services X-Ray.
 * A segment document can be a completed segment, an in-progress segment, or an array of
 * subsegments.
 *
 * Segments must include the following fields. For the full segment document schema, see
 * Amazon Web Services X-Ray
 * Segment Documents in the *Amazon Web Services X-Ray Developer Guide*.
 *
 * **Required segment document fields**
 *
 * - `name` - The name of the service that handled the request.
 *
 * - `id` - A 64-bit identifier for the segment, unique among segments in the same trace, in 16
 * hexadecimal digits.
 *
 * - `trace_id` - A unique identifier that connects all segments and subsegments originating from
 * a single client request.
 *
 * - `start_time` - Time the segment or subsegment was created, in floating point seconds in
 * epoch time, accurate to milliseconds. For example, `1480615200.010` or
 * `1.480615200010E9`.
 *
 * - `end_time` - Time the segment or subsegment was closed. For example,
 * `1480615200.090` or `1.480615200090E9`. Specify either an `end_time` or
 * `in_progress`.
 *
 * - `in_progress` - Set to `true` instead of specifying an `end_time` to
 * record that a segment has been started, but is not complete. Send an in-progress segment when your application
 * receives a request that will take a long time to serve, to trace that the request was received. When the
 * response is sent, send the complete segment to overwrite the in-progress segment.
 *
 * A `trace_id` consists of three numbers separated by hyphens. For example,
 * 1-58406520-a006649127e371903a2de979. For trace IDs created by an X-Ray SDK, or by Amazon Web Services services
 * integrated with X-Ray, a trace ID includes:
 *
 * **Trace ID Format**
 *
 * - The version number, for instance, `1`.
 *
 * - The time of the original request, in Unix epoch time, in 8 hexadecimal digits. For
 * example, 10:00AM December 2nd, 2016 PST in epoch time is `1480615200` seconds,
 * or `58406520` in hexadecimal.
 *
 * - A 96-bit identifier for the trace, globally unique, in 24 hexadecimal
 * digits.
 *
 * Trace IDs created via OpenTelemetry have a different format based on the
 * W3C Trace Context specification.
 * A W3C trace ID must be formatted in the X-Ray trace ID format when sending to X-Ray. For example, a W3C
 * trace ID `4efaaf4d1e8720b39541901950019ee5` should be formatted as
 * `1-4efaaf4d-1e8720b39541901950019ee5` when sending to X-Ray. While X-Ray trace IDs include
 * the original request timestamp in Unix epoch time, this is not required or validated.
 */
export const putTraceSegments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTraceSegmentsRequest,
  output: PutTraceSegmentsResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Applies tags to an existing Amazon Web Services X-Ray group or sampling rule.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
    TooManyTagsException,
  ],
}));
/**
 * Modifies a sampling rule's configuration.
 */
export const updateSamplingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSamplingRuleRequest,
  output: UpdateSamplingRuleResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * You cannot find traces through this API if Transaction Search is enabled since trace is not indexed in X-Ray.
 *
 * Retrieves a list of traces specified by ID. Each trace is a collection of segment
 * documents that originates from a single request. Use `GetTraceSummaries` to get a
 * list of trace IDs.
 */
export const batchGetTraces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetTracesRequest,
  output: BatchGetTracesResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves the summary information of an insight. This includes impact to clients and
 * root cause services, the top anomalous services, the category, the state of the insight,
 * and the start and end time of the insight.
 */
export const getInsight = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightRequest,
  output: GetInsightResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves a service graph structure filtered by the specified insight. The service graph is limited to only
 * structural information. For a complete service graph, use this API with the GetServiceGraph API.
 */
export const getInsightImpactGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInsightImpactGraphRequest,
    output: GetInsightImpactGraphResult,
    errors: [InvalidRequestException, ThrottledException],
  }),
);
/**
 * Retrieves a service graph for traces based on the specified `RetrievalToken` from the CloudWatch log group generated by Transaction Search. This API does not initiate a retrieval job. You must first execute `StartTraceRetrieval` to obtain the required `RetrievalToken`.
 *
 * The trace graph describes services that process incoming requests and any downstream services they call, which may include Amazon Web Services resources, external APIs, or databases.
 *
 * The response is empty until the `RetrievalStatus` is *COMPLETE*. Retry the request after the status changes from *RUNNING* or *SCHEDULED* to *COMPLETE* to access the full service graph.
 *
 * When CloudWatch log is the destination, this API can support cross-account observability and service graph retrieval across linked accounts.
 *
 * For retrieving graphs from X-Ray directly as opposed to the Transaction-Search Log group, see GetTraceGraph.
 */
export const getRetrievedTracesGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRetrievedTracesGraphRequest,
    output: GetRetrievedTracesGraphResult,
    errors: [
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottledException,
    ],
  }),
);
/**
 * Get an aggregation of service statistics defined by a specific time
 * range.
 */
export const getTimeSeriesServiceStatistics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTimeSeriesServiceStatisticsRequest,
    output: GetTimeSeriesServiceStatisticsResult,
    errors: [InvalidRequestException, ThrottledException],
  }));
/**
 * Retrieves a list of traces for a given `RetrievalToken` from the CloudWatch log group generated by Transaction Search. For information on what each trace returns, see BatchGetTraces.
 *
 * This API does not initiate a retrieval process. To start a trace retrieval, use `StartTraceRetrieval`, which generates the required `RetrievalToken`.
 *
 * When the `RetrievalStatus` is not *COMPLETE*, the API will return an empty response. Retry the request once the retrieval has completed to access the full list of traces.
 *
 * For cross-account observability, this API can retrieve traces from linked accounts when CloudWatch log is set as the destination across relevant accounts. For more details, see CloudWatch cross-account observability.
 *
 * For retrieving data from X-Ray directly as opposed to the Transaction Search generated log group, see BatchGetTraces.
 */
export const listRetrievedTraces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRetrievedTracesRequest,
  output: ListRetrievedTracesResult,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Modifies an indexing rule’s configuration.
 *
 * Indexing rules are used for determining the sampling rate for spans indexed from CloudWatch Logs. For more information, see Transaction Search.
 */
export const updateIndexingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexingRuleRequest,
  output: UpdateIndexingRuleResult,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Creates a rule to control sampling behavior for instrumented applications. Services
 * retrieve rules with GetSamplingRules, and evaluate each rule in ascending
 * order of *priority* for each request. If a rule matches, the service
 * records a trace, borrowing it from the reservoir size. After 10 seconds, the service
 * reports back to X-Ray with GetSamplingTargets to get updated versions of
 * each in-use rule. The updated rule contains a trace quota that the service can use instead
 * of borrowing from the reservoir.
 */
export const createSamplingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSamplingRuleRequest,
  output: CreateSamplingRuleResult,
  errors: [
    InvalidRequestException,
    RuleLimitExceededException,
    ThrottledException,
  ],
}));
/**
 * Retrieves all indexing rules.
 *
 * Indexing rules are used to determine the server-side sampling rate for spans ingested through the CloudWatchLogs destination and indexed by X-Ray. For more information, see Transaction Search.
 */
export const getIndexingRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexingRulesRequest,
  output: GetIndexingRulesResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Requests a sampling quota for rules that the service is using to sample requests.
 */
export const getSamplingTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSamplingTargetsRequest,
  output: GetSamplingTargetsResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves a document that describes services that process incoming requests, and
 * downstream services that they call as a result. Root services process incoming requests and
 * make calls to downstream services. Root services are applications that use the Amazon Web Services X-Ray SDK.
 * Downstream services can be other applications, Amazon Web Services resources, HTTP web APIs, or SQL
 * databases.
 */
export const getServiceGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceGraphRequest,
  output: GetServiceGraphResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Sets the resource policy to grant one or more Amazon Web Services services and accounts permissions to
 * access X-Ray. Each resource policy will be associated with a specific Amazon Web Services account.
 * Each Amazon Web Services account can have a maximum of 5 resource policies, and each policy name must be
 * unique within that account. The maximum size of each resource policy is 5KB.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResult,
  errors: [
    InvalidPolicyRevisionIdException,
    LockoutPreventionException,
    MalformedPolicyDocumentException,
    PolicyCountLimitExceededException,
    PolicySizeLimitExceededException,
    ThrottledException,
  ],
}));
/**
 * Retrieves IDs and annotations for traces available for a specified time frame using an
 * optional filter. To get the full traces, pass the trace IDs to
 * `BatchGetTraces`.
 *
 * A filter expression can target traced requests that hit specific service nodes or
 * edges, have errors, or come from a known user. For example, the following filter expression
 * targets traces that pass through `api.example.com`:
 *
 * `service("api.example.com")`
 *
 * This filter expression finds traces that have an annotation named `account`
 * with the value `12345`:
 *
 * `annotation.account = "12345"`
 *
 * For a full list of indexed fields and keywords that you can use in filter expressions,
 * see Use filter
 * expressions in the *Amazon Web Services X-Ray Developer Guide*.
 */
export const getTraceSummaries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTraceSummariesRequest,
  output: GetTraceSummariesResult,
  errors: [InvalidRequestException, ThrottledException],
}));
