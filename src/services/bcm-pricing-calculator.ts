import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "BCM Pricing Calculator",
  serviceShapeName: "AWSBCMPricingCalculator",
});
const auth = T.AwsAuthSigv4({ name: "bcm-pricing-calculator" });
const ver = T.ServiceVersion("2024-06-19");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
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
                  ],
                  endpoint: {
                    url: "https://bcm-pricing-calculator-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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
                {
                  conditions: [],
                  endpoint: {
                    url: "https://bcm-pricing-calculator.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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
export class GetPreferencesRequest extends S.Class<GetPreferencesRequest>(
  "GetPreferencesRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const RateTypes = S.Array(S.String);
export const ResourceTagKeys = S.Array(S.String);
export const BatchDeleteBillScenarioCommitmentModificationEntries = S.Array(
  S.String,
);
export const BatchDeleteBillScenarioUsageModificationEntries = S.Array(
  S.String,
);
export const BatchDeleteWorkloadEstimateUsageEntries = S.Array(S.String);
export class GetPreferencesResponse extends S.Class<GetPreferencesResponse>(
  "GetPreferencesResponse",
)({
  managementAccountRateTypeSelections: S.optional(RateTypes),
  memberAccountRateTypeSelections: S.optional(RateTypes),
  standaloneAccountRateTypeSelections: S.optional(RateTypes),
}) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { arn: S.String, tagKeys: ResourceTagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdatePreferencesRequest extends S.Class<UpdatePreferencesRequest>(
  "UpdatePreferencesRequest",
)(
  {
    managementAccountRateTypeSelections: S.optional(RateTypes),
    memberAccountRateTypeSelections: S.optional(RateTypes),
    standaloneAccountRateTypeSelections: S.optional(RateTypes),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateBillEstimateRequest extends S.Class<CreateBillEstimateRequest>(
  "CreateBillEstimateRequest",
)(
  {
    billScenarioId: S.String,
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBillEstimateRequest extends S.Class<GetBillEstimateRequest>(
  "GetBillEstimateRequest",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateBillEstimateRequest extends S.Class<UpdateBillEstimateRequest>(
  "UpdateBillEstimateRequest",
)(
  {
    identifier: S.String,
    name: S.optional(S.String),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBillEstimateRequest extends S.Class<DeleteBillEstimateRequest>(
  "DeleteBillEstimateRequest",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBillEstimateResponse extends S.Class<DeleteBillEstimateResponse>(
  "DeleteBillEstimateResponse",
)({}) {}
export class ListBillEstimateCommitmentsRequest extends S.Class<ListBillEstimateCommitmentsRequest>(
  "ListBillEstimateCommitmentsRequest",
)(
  {
    billEstimateId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBillEstimateInputCommitmentModificationsRequest extends S.Class<ListBillEstimateInputCommitmentModificationsRequest>(
  "ListBillEstimateInputCommitmentModificationsRequest",
)(
  {
    billEstimateId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBillScenarioRequest extends S.Class<CreateBillScenarioRequest>(
  "CreateBillScenarioRequest",
)(
  {
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    tags: S.optional(Tags),
    groupSharingPreference: S.optional(S.String),
    costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBillScenarioRequest extends S.Class<GetBillScenarioRequest>(
  "GetBillScenarioRequest",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateBillScenarioRequest extends S.Class<UpdateBillScenarioRequest>(
  "UpdateBillScenarioRequest",
)(
  {
    identifier: S.String,
    name: S.optional(S.String),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    groupSharingPreference: S.optional(S.String),
    costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBillScenarioRequest extends S.Class<DeleteBillScenarioRequest>(
  "DeleteBillScenarioRequest",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBillScenarioResponse extends S.Class<DeleteBillScenarioResponse>(
  "DeleteBillScenarioResponse",
)({}) {}
export class ListBillScenarioCommitmentModificationsRequest extends S.Class<ListBillScenarioCommitmentModificationsRequest>(
  "ListBillScenarioCommitmentModificationsRequest",
)(
  {
    billScenarioId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDeleteBillScenarioCommitmentModificationRequest extends S.Class<BatchDeleteBillScenarioCommitmentModificationRequest>(
  "BatchDeleteBillScenarioCommitmentModificationRequest",
)(
  {
    billScenarioId: S.String,
    ids: BatchDeleteBillScenarioCommitmentModificationEntries,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ListUsageFilterValues = S.Array(S.String);
export class ListUsageFilter extends S.Class<ListUsageFilter>(
  "ListUsageFilter",
)({
  name: S.String,
  values: ListUsageFilterValues,
  matchOption: S.optional(S.String),
}) {}
export const ListUsageFilters = S.Array(ListUsageFilter);
export class ListBillScenarioUsageModificationsRequest extends S.Class<ListBillScenarioUsageModificationsRequest>(
  "ListBillScenarioUsageModificationsRequest",
)(
  {
    billScenarioId: S.String,
    filters: S.optional(ListUsageFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDeleteBillScenarioUsageModificationRequest extends S.Class<BatchDeleteBillScenarioUsageModificationRequest>(
  "BatchDeleteBillScenarioUsageModificationRequest",
)(
  {
    billScenarioId: S.String,
    ids: BatchDeleteBillScenarioUsageModificationEntries,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWorkloadEstimateRequest extends S.Class<CreateWorkloadEstimateRequest>(
  "CreateWorkloadEstimateRequest",
)(
  {
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    rateType: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWorkloadEstimateRequest extends S.Class<GetWorkloadEstimateRequest>(
  "GetWorkloadEstimateRequest",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateWorkloadEstimateRequest extends S.Class<UpdateWorkloadEstimateRequest>(
  "UpdateWorkloadEstimateRequest",
)(
  {
    identifier: S.String,
    name: S.optional(S.String),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWorkloadEstimateRequest extends S.Class<DeleteWorkloadEstimateRequest>(
  "DeleteWorkloadEstimateRequest",
)(
  { identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWorkloadEstimateResponse extends S.Class<DeleteWorkloadEstimateResponse>(
  "DeleteWorkloadEstimateResponse",
)({}) {}
export class ListWorkloadEstimateUsageRequest extends S.Class<ListWorkloadEstimateUsageRequest>(
  "ListWorkloadEstimateUsageRequest",
)(
  {
    workloadEstimateId: S.String,
    filters: S.optional(ListUsageFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDeleteWorkloadEstimateUsageRequest extends S.Class<BatchDeleteWorkloadEstimateUsageRequest>(
  "BatchDeleteWorkloadEstimateUsageRequest",
)(
  {
    workloadEstimateId: S.String,
    ids: BatchDeleteWorkloadEstimateUsageEntries,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ListBillEstimatesFilterValues = S.Array(S.String);
export const ListBillEstimateLineItemsFilterValues = S.Array(S.String);
export const ListBillScenariosFilterValues = S.Array(S.String);
export const ListWorkloadEstimatesFilterValues = S.Array(S.String);
export class ListBillEstimatesFilter extends S.Class<ListBillEstimatesFilter>(
  "ListBillEstimatesFilter",
)({
  name: S.String,
  values: ListBillEstimatesFilterValues,
  matchOption: S.optional(S.String),
}) {}
export const ListBillEstimatesFilters = S.Array(ListBillEstimatesFilter);
export class FilterTimestamp extends S.Class<FilterTimestamp>(
  "FilterTimestamp",
)({
  afterTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  beforeTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListBillEstimateLineItemsFilter extends S.Class<ListBillEstimateLineItemsFilter>(
  "ListBillEstimateLineItemsFilter",
)({
  name: S.String,
  values: ListBillEstimateLineItemsFilterValues,
  matchOption: S.optional(S.String),
}) {}
export const ListBillEstimateLineItemsFilters = S.Array(
  ListBillEstimateLineItemsFilter,
);
export class ListBillScenariosFilter extends S.Class<ListBillScenariosFilter>(
  "ListBillScenariosFilter",
)({
  name: S.String,
  values: ListBillScenariosFilterValues,
  matchOption: S.optional(S.String),
}) {}
export const ListBillScenariosFilters = S.Array(ListBillScenariosFilter);
export class BatchUpdateBillScenarioCommitmentModificationEntry extends S.Class<BatchUpdateBillScenarioCommitmentModificationEntry>(
  "BatchUpdateBillScenarioCommitmentModificationEntry",
)({ id: S.String, group: S.optional(S.String) }) {}
export const BatchUpdateBillScenarioCommitmentModificationEntries = S.Array(
  BatchUpdateBillScenarioCommitmentModificationEntry,
);
export class UsageAmount extends S.Class<UsageAmount>("UsageAmount")({
  startHour: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  amount: S.Number,
}) {}
export const UsageAmounts = S.Array(UsageAmount);
export class BatchUpdateBillScenarioUsageModificationEntry extends S.Class<BatchUpdateBillScenarioUsageModificationEntry>(
  "BatchUpdateBillScenarioUsageModificationEntry",
)({
  id: S.String,
  group: S.optional(S.String),
  amounts: S.optional(UsageAmounts),
}) {}
export const BatchUpdateBillScenarioUsageModificationEntries = S.Array(
  BatchUpdateBillScenarioUsageModificationEntry,
);
export class ListWorkloadEstimatesFilter extends S.Class<ListWorkloadEstimatesFilter>(
  "ListWorkloadEstimatesFilter",
)({
  name: S.String,
  values: ListWorkloadEstimatesFilterValues,
  matchOption: S.optional(S.String),
}) {}
export const ListWorkloadEstimatesFilters = S.Array(
  ListWorkloadEstimatesFilter,
);
export class BillInterval extends S.Class<BillInterval>("BillInterval")({
  start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  end: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const StringList = S.Array(S.String);
export class ExpressionFilter extends S.Class<ExpressionFilter>(
  "ExpressionFilter",
)({
  key: S.optional(S.String),
  matchOptions: S.optional(StringList),
  values: S.optional(StringList),
}) {}
export class Expression extends S.Class<Expression>("Expression")({
  and: S.optional(S.suspend(() => ExpressionList)),
  or: S.optional(S.suspend(() => ExpressionList)),
  not: S.optional(S.suspend((): S.Schema<Expression, any> => Expression)),
  costCategories: S.optional(ExpressionFilter),
  dimensions: S.optional(ExpressionFilter),
  tags: S.optional(ExpressionFilter),
}) {}
export class HistoricalUsageEntity extends S.Class<HistoricalUsageEntity>(
  "HistoricalUsageEntity",
)({
  serviceCode: S.String,
  usageType: S.String,
  operation: S.String,
  location: S.optional(S.String),
  usageAccountId: S.String,
  billInterval: BillInterval,
  filterExpression: Expression,
}) {}
export class BatchCreateWorkloadEstimateUsageEntry extends S.Class<BatchCreateWorkloadEstimateUsageEntry>(
  "BatchCreateWorkloadEstimateUsageEntry",
)({
  serviceCode: S.String,
  usageType: S.String,
  operation: S.String,
  key: S.String,
  group: S.optional(S.String),
  usageAccountId: S.String,
  amount: S.Number,
  historicalUsage: S.optional(HistoricalUsageEntity),
}) {}
export const BatchCreateWorkloadEstimateUsageEntries = S.Array(
  BatchCreateWorkloadEstimateUsageEntry,
);
export class BatchUpdateWorkloadEstimateUsageEntry extends S.Class<BatchUpdateWorkloadEstimateUsageEntry>(
  "BatchUpdateWorkloadEstimateUsageEntry",
)({
  id: S.String,
  group: S.optional(S.String),
  amount: S.optional(S.Number),
}) {}
export const BatchUpdateWorkloadEstimateUsageEntries = S.Array(
  BatchUpdateWorkloadEstimateUsageEntry,
);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { arn: S.String, tags: Tags },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UpdatePreferencesResponse extends S.Class<UpdatePreferencesResponse>(
  "UpdatePreferencesResponse",
)({
  managementAccountRateTypeSelections: S.optional(RateTypes),
  memberAccountRateTypeSelections: S.optional(RateTypes),
  standaloneAccountRateTypeSelections: S.optional(RateTypes),
}) {}
export class CostAmount extends S.Class<CostAmount>("CostAmount")({
  amount: S.optional(S.Number),
  currency: S.optional(S.String),
}) {}
export class CostDifference extends S.Class<CostDifference>("CostDifference")({
  historicalCost: S.optional(CostAmount),
  estimatedCost: S.optional(CostAmount),
}) {}
export const ServiceCostDifferenceMap = S.Record({
  key: S.String,
  value: CostDifference,
});
export class BillEstimateCostSummary extends S.Class<BillEstimateCostSummary>(
  "BillEstimateCostSummary",
)({
  totalCostDifference: S.optional(CostDifference),
  serviceCostDifferences: S.optional(ServiceCostDifferenceMap),
}) {}
export class GetBillEstimateResponse extends S.Class<GetBillEstimateResponse>(
  "GetBillEstimateResponse",
)({
  id: S.String,
  name: S.optional(S.String),
  status: S.optional(S.String),
  failureMessage: S.optional(S.String),
  billInterval: S.optional(BillInterval),
  costSummary: S.optional(BillEstimateCostSummary),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  groupSharingPreference: S.optional(S.String),
  costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  costCategoryGroupSharingPreferenceEffectiveDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class UpdateBillEstimateResponse extends S.Class<UpdateBillEstimateResponse>(
  "UpdateBillEstimateResponse",
)({
  id: S.String,
  name: S.optional(S.String),
  status: S.optional(S.String),
  failureMessage: S.optional(S.String),
  billInterval: S.optional(BillInterval),
  costSummary: S.optional(BillEstimateCostSummary),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  groupSharingPreference: S.optional(S.String),
  costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  costCategoryGroupSharingPreferenceEffectiveDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ListBillEstimatesRequest extends S.Class<ListBillEstimatesRequest>(
  "ListBillEstimatesRequest",
)(
  {
    filters: S.optional(ListBillEstimatesFilters),
    createdAtFilter: S.optional(FilterTimestamp),
    expiresAtFilter: S.optional(FilterTimestamp),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBillEstimateInputUsageModificationsRequest extends S.Class<ListBillEstimateInputUsageModificationsRequest>(
  "ListBillEstimateInputUsageModificationsRequest",
)(
  {
    billEstimateId: S.String,
    filters: S.optional(ListUsageFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBillEstimateLineItemsRequest extends S.Class<ListBillEstimateLineItemsRequest>(
  "ListBillEstimateLineItemsRequest",
)(
  {
    billEstimateId: S.String,
    filters: S.optional(ListBillEstimateLineItemsFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBillScenarioResponse extends S.Class<CreateBillScenarioResponse>(
  "CreateBillScenarioResponse",
)({
  id: S.String,
  name: S.optional(S.String),
  billInterval: S.optional(BillInterval),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  failureMessage: S.optional(S.String),
  groupSharingPreference: S.optional(S.String),
  costCategoryGroupSharingPreferenceArn: S.optional(S.String),
}) {}
export class GetBillScenarioResponse extends S.Class<GetBillScenarioResponse>(
  "GetBillScenarioResponse",
)({
  id: S.String,
  name: S.optional(S.String),
  billInterval: S.optional(BillInterval),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  failureMessage: S.optional(S.String),
  groupSharingPreference: S.optional(S.String),
  costCategoryGroupSharingPreferenceArn: S.optional(S.String),
}) {}
export class UpdateBillScenarioResponse extends S.Class<UpdateBillScenarioResponse>(
  "UpdateBillScenarioResponse",
)({
  id: S.String,
  name: S.optional(S.String),
  billInterval: S.optional(BillInterval),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  failureMessage: S.optional(S.String),
  groupSharingPreference: S.optional(S.String),
  costCategoryGroupSharingPreferenceArn: S.optional(S.String),
}) {}
export class ListBillScenariosRequest extends S.Class<ListBillScenariosRequest>(
  "ListBillScenariosRequest",
)(
  {
    filters: S.optional(ListBillScenariosFilters),
    createdAtFilter: S.optional(FilterTimestamp),
    expiresAtFilter: S.optional(FilterTimestamp),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchUpdateBillScenarioCommitmentModificationRequest extends S.Class<BatchUpdateBillScenarioCommitmentModificationRequest>(
  "BatchUpdateBillScenarioCommitmentModificationRequest",
)(
  {
    billScenarioId: S.String,
    commitmentModifications:
      BatchUpdateBillScenarioCommitmentModificationEntries,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchUpdateBillScenarioUsageModificationRequest extends S.Class<BatchUpdateBillScenarioUsageModificationRequest>(
  "BatchUpdateBillScenarioUsageModificationRequest",
)(
  {
    billScenarioId: S.String,
    usageModifications: BatchUpdateBillScenarioUsageModificationEntries,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWorkloadEstimateResponse extends S.Class<CreateWorkloadEstimateResponse>(
  "CreateWorkloadEstimateResponse",
)({
  id: S.String,
  name: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  rateType: S.optional(S.String),
  rateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  totalCost: S.optional(S.Number),
  costCurrency: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export class GetWorkloadEstimateResponse extends S.Class<GetWorkloadEstimateResponse>(
  "GetWorkloadEstimateResponse",
)({
  id: S.String,
  name: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  rateType: S.optional(S.String),
  rateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  totalCost: S.optional(S.Number),
  costCurrency: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export class UpdateWorkloadEstimateResponse extends S.Class<UpdateWorkloadEstimateResponse>(
  "UpdateWorkloadEstimateResponse",
)({
  id: S.String,
  name: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  rateType: S.optional(S.String),
  rateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  totalCost: S.optional(S.Number),
  costCurrency: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export class ListWorkloadEstimatesRequest extends S.Class<ListWorkloadEstimatesRequest>(
  "ListWorkloadEstimatesRequest",
)(
  {
    createdAtFilter: S.optional(FilterTimestamp),
    expiresAtFilter: S.optional(FilterTimestamp),
    filters: S.optional(ListWorkloadEstimatesFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchCreateWorkloadEstimateUsageRequest extends S.Class<BatchCreateWorkloadEstimateUsageRequest>(
  "BatchCreateWorkloadEstimateUsageRequest",
)(
  {
    workloadEstimateId: S.String,
    usage: BatchCreateWorkloadEstimateUsageEntries,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchUpdateWorkloadEstimateUsageRequest extends S.Class<BatchUpdateWorkloadEstimateUsageRequest>(
  "BatchUpdateWorkloadEstimateUsageRequest",
)(
  {
    workloadEstimateId: S.String,
    usage: BatchUpdateWorkloadEstimateUsageEntries,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export type ExpressionList = Expression[];
export const ExpressionList = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression),
) as any as S.Schema<ExpressionList>;
export class AddReservedInstanceAction extends S.Class<AddReservedInstanceAction>(
  "AddReservedInstanceAction",
)({
  reservedInstancesOfferingId: S.optional(S.String),
  instanceCount: S.optional(S.Number),
}) {}
export class AddSavingsPlanAction extends S.Class<AddSavingsPlanAction>(
  "AddSavingsPlanAction",
)({
  savingsPlanOfferingId: S.optional(S.String),
  commitment: S.optional(S.Number),
}) {}
export class NegateReservedInstanceAction extends S.Class<NegateReservedInstanceAction>(
  "NegateReservedInstanceAction",
)({ reservedInstancesId: S.optional(S.String) }) {}
export class NegateSavingsPlanAction extends S.Class<NegateSavingsPlanAction>(
  "NegateSavingsPlanAction",
)({ savingsPlanId: S.optional(S.String) }) {}
export const BillScenarioCommitmentModificationAction = S.Union(
  S.Struct({ addReservedInstanceAction: AddReservedInstanceAction }),
  S.Struct({ addSavingsPlanAction: AddSavingsPlanAction }),
  S.Struct({ negateReservedInstanceAction: NegateReservedInstanceAction }),
  S.Struct({ negateSavingsPlanAction: NegateSavingsPlanAction }),
);
export class BillEstimateInputCommitmentModificationSummary extends S.Class<BillEstimateInputCommitmentModificationSummary>(
  "BillEstimateInputCommitmentModificationSummary",
)({
  id: S.optional(S.String),
  group: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  commitmentAction: S.optional(BillScenarioCommitmentModificationAction),
}) {}
export const BillEstimateInputCommitmentModificationSummaries = S.Array(
  BillEstimateInputCommitmentModificationSummary,
);
export class BillScenarioCommitmentModificationItem extends S.Class<BillScenarioCommitmentModificationItem>(
  "BillScenarioCommitmentModificationItem",
)({
  id: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  group: S.optional(S.String),
  commitmentAction: S.optional(BillScenarioCommitmentModificationAction),
}) {}
export const BillScenarioCommitmentModificationItems = S.Array(
  BillScenarioCommitmentModificationItem,
);
export class BatchDeleteBillScenarioCommitmentModificationError extends S.Class<BatchDeleteBillScenarioCommitmentModificationError>(
  "BatchDeleteBillScenarioCommitmentModificationError",
)({
  id: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchDeleteBillScenarioCommitmentModificationErrors = S.Array(
  BatchDeleteBillScenarioCommitmentModificationError,
);
export class BatchDeleteBillScenarioUsageModificationError extends S.Class<BatchDeleteBillScenarioUsageModificationError>(
  "BatchDeleteBillScenarioUsageModificationError",
)({
  id: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const BatchDeleteBillScenarioUsageModificationErrors = S.Array(
  BatchDeleteBillScenarioUsageModificationError,
);
export class BatchDeleteWorkloadEstimateUsageError extends S.Class<BatchDeleteWorkloadEstimateUsageError>(
  "BatchDeleteWorkloadEstimateUsageError",
)({
  id: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const BatchDeleteWorkloadEstimateUsageErrors = S.Array(
  BatchDeleteWorkloadEstimateUsageError,
);
export class ListBillEstimateInputCommitmentModificationsResponse extends S.Class<ListBillEstimateInputCommitmentModificationsResponse>(
  "ListBillEstimateInputCommitmentModificationsResponse",
)({
  items: S.optional(BillEstimateInputCommitmentModificationSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListBillScenarioCommitmentModificationsResponse extends S.Class<ListBillScenarioCommitmentModificationsResponse>(
  "ListBillScenarioCommitmentModificationsResponse",
)({
  items: S.optional(BillScenarioCommitmentModificationItems),
  nextToken: S.optional(S.String),
}) {}
export class BatchDeleteBillScenarioCommitmentModificationResponse extends S.Class<BatchDeleteBillScenarioCommitmentModificationResponse>(
  "BatchDeleteBillScenarioCommitmentModificationResponse",
)({
  errors: S.optional(BatchDeleteBillScenarioCommitmentModificationErrors),
}) {}
export class BatchDeleteBillScenarioUsageModificationResponse extends S.Class<BatchDeleteBillScenarioUsageModificationResponse>(
  "BatchDeleteBillScenarioUsageModificationResponse",
)({ errors: S.optional(BatchDeleteBillScenarioUsageModificationErrors) }) {}
export class BatchDeleteWorkloadEstimateUsageResponse extends S.Class<BatchDeleteWorkloadEstimateUsageResponse>(
  "BatchDeleteWorkloadEstimateUsageResponse",
)({ errors: S.optional(BatchDeleteWorkloadEstimateUsageErrors) }) {}
export const SavingsPlanArns = S.Array(S.String);
export class UsageQuantity extends S.Class<UsageQuantity>("UsageQuantity")({
  startHour: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  unit: S.optional(S.String),
  amount: S.optional(S.Number),
}) {}
export const UsageQuantities = S.Array(UsageQuantity);
export class WorkloadEstimateUsageQuantity extends S.Class<WorkloadEstimateUsageQuantity>(
  "WorkloadEstimateUsageQuantity",
)({ unit: S.optional(S.String), amount: S.optional(S.Number) }) {}
export class BillEstimateSummary extends S.Class<BillEstimateSummary>(
  "BillEstimateSummary",
)({
  id: S.String,
  name: S.optional(S.String),
  status: S.optional(S.String),
  billInterval: S.optional(BillInterval),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const BillEstimateSummaries = S.Array(BillEstimateSummary);
export class BillEstimateCommitmentSummary extends S.Class<BillEstimateCommitmentSummary>(
  "BillEstimateCommitmentSummary",
)({
  id: S.optional(S.String),
  purchaseAgreementType: S.optional(S.String),
  offeringId: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  region: S.optional(S.String),
  termLength: S.optional(S.String),
  paymentOption: S.optional(S.String),
  upfrontPayment: S.optional(CostAmount),
  monthlyPayment: S.optional(CostAmount),
}) {}
export const BillEstimateCommitmentSummaries = S.Array(
  BillEstimateCommitmentSummary,
);
export class BillEstimateInputUsageModificationSummary extends S.Class<BillEstimateInputUsageModificationSummary>(
  "BillEstimateInputUsageModificationSummary",
)({
  serviceCode: S.String,
  usageType: S.String,
  operation: S.String,
  location: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  id: S.optional(S.String),
  group: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  quantities: S.optional(UsageQuantities),
  historicalUsage: S.optional(HistoricalUsageEntity),
}) {}
export const BillEstimateInputUsageModificationSummaries = S.Array(
  BillEstimateInputUsageModificationSummary,
);
export class BillScenarioSummary extends S.Class<BillScenarioSummary>(
  "BillScenarioSummary",
)({
  id: S.String,
  name: S.optional(S.String),
  billInterval: S.optional(BillInterval),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  failureMessage: S.optional(S.String),
  groupSharingPreference: S.optional(S.String),
  costCategoryGroupSharingPreferenceArn: S.optional(S.String),
}) {}
export const BillScenarioSummaries = S.Array(BillScenarioSummary);
export class BatchCreateBillScenarioCommitmentModificationEntry extends S.Class<BatchCreateBillScenarioCommitmentModificationEntry>(
  "BatchCreateBillScenarioCommitmentModificationEntry",
)({
  key: S.String,
  group: S.optional(S.String),
  usageAccountId: S.String,
  commitmentAction: BillScenarioCommitmentModificationAction,
}) {}
export const BatchCreateBillScenarioCommitmentModificationEntries = S.Array(
  BatchCreateBillScenarioCommitmentModificationEntry,
);
export class BatchUpdateBillScenarioCommitmentModificationError extends S.Class<BatchUpdateBillScenarioCommitmentModificationError>(
  "BatchUpdateBillScenarioCommitmentModificationError",
)({
  id: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchUpdateBillScenarioCommitmentModificationErrors = S.Array(
  BatchUpdateBillScenarioCommitmentModificationError,
);
export class BillScenarioUsageModificationItem extends S.Class<BillScenarioUsageModificationItem>(
  "BillScenarioUsageModificationItem",
)({
  serviceCode: S.String,
  usageType: S.String,
  operation: S.String,
  location: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  id: S.optional(S.String),
  group: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  quantities: S.optional(UsageQuantities),
  historicalUsage: S.optional(HistoricalUsageEntity),
}) {}
export const BillScenarioUsageModificationItems = S.Array(
  BillScenarioUsageModificationItem,
);
export class BatchUpdateBillScenarioUsageModificationError extends S.Class<BatchUpdateBillScenarioUsageModificationError>(
  "BatchUpdateBillScenarioUsageModificationError",
)({
  id: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const BatchUpdateBillScenarioUsageModificationErrors = S.Array(
  BatchUpdateBillScenarioUsageModificationError,
);
export class WorkloadEstimateSummary extends S.Class<WorkloadEstimateSummary>(
  "WorkloadEstimateSummary",
)({
  id: S.String,
  name: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  rateType: S.optional(S.String),
  rateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  totalCost: S.optional(S.Number),
  costCurrency: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export const WorkloadEstimateSummaries = S.Array(WorkloadEstimateSummary);
export class WorkloadEstimateUsageItem extends S.Class<WorkloadEstimateUsageItem>(
  "WorkloadEstimateUsageItem",
)({
  serviceCode: S.String,
  usageType: S.String,
  operation: S.String,
  location: S.optional(S.String),
  id: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  group: S.optional(S.String),
  quantity: S.optional(WorkloadEstimateUsageQuantity),
  cost: S.optional(S.Number),
  currency: S.optional(S.String),
  status: S.optional(S.String),
  historicalUsage: S.optional(HistoricalUsageEntity),
}) {}
export const WorkloadEstimateUsageItems = S.Array(WorkloadEstimateUsageItem);
export class BatchCreateWorkloadEstimateUsageItem extends S.Class<BatchCreateWorkloadEstimateUsageItem>(
  "BatchCreateWorkloadEstimateUsageItem",
)({
  serviceCode: S.String,
  usageType: S.String,
  operation: S.String,
  location: S.optional(S.String),
  id: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  group: S.optional(S.String),
  quantity: S.optional(WorkloadEstimateUsageQuantity),
  cost: S.optional(S.Number),
  currency: S.optional(S.String),
  status: S.optional(S.String),
  historicalUsage: S.optional(HistoricalUsageEntity),
  key: S.optional(S.String),
}) {}
export const BatchCreateWorkloadEstimateUsageItems = S.Array(
  BatchCreateWorkloadEstimateUsageItem,
);
export class BatchCreateWorkloadEstimateUsageError extends S.Class<BatchCreateWorkloadEstimateUsageError>(
  "BatchCreateWorkloadEstimateUsageError",
)({
  key: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchCreateWorkloadEstimateUsageErrors = S.Array(
  BatchCreateWorkloadEstimateUsageError,
);
export class BatchUpdateWorkloadEstimateUsageError extends S.Class<BatchUpdateWorkloadEstimateUsageError>(
  "BatchUpdateWorkloadEstimateUsageError",
)({
  id: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const BatchUpdateWorkloadEstimateUsageErrors = S.Array(
  BatchUpdateWorkloadEstimateUsageError,
);
export class CreateBillEstimateResponse extends S.Class<CreateBillEstimateResponse>(
  "CreateBillEstimateResponse",
)({
  id: S.String,
  name: S.optional(S.String),
  status: S.optional(S.String),
  failureMessage: S.optional(S.String),
  billInterval: S.optional(BillInterval),
  costSummary: S.optional(BillEstimateCostSummary),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  groupSharingPreference: S.optional(S.String),
  costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  costCategoryGroupSharingPreferenceEffectiveDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ListBillEstimatesResponse extends S.Class<ListBillEstimatesResponse>(
  "ListBillEstimatesResponse",
)({
  items: S.optional(BillEstimateSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListBillEstimateCommitmentsResponse extends S.Class<ListBillEstimateCommitmentsResponse>(
  "ListBillEstimateCommitmentsResponse",
)({
  items: S.optional(BillEstimateCommitmentSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListBillEstimateInputUsageModificationsResponse extends S.Class<ListBillEstimateInputUsageModificationsResponse>(
  "ListBillEstimateInputUsageModificationsResponse",
)({
  items: S.optional(BillEstimateInputUsageModificationSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListBillScenariosResponse extends S.Class<ListBillScenariosResponse>(
  "ListBillScenariosResponse",
)({
  items: S.optional(BillScenarioSummaries),
  nextToken: S.optional(S.String),
}) {}
export class BatchCreateBillScenarioCommitmentModificationRequest extends S.Class<BatchCreateBillScenarioCommitmentModificationRequest>(
  "BatchCreateBillScenarioCommitmentModificationRequest",
)(
  {
    billScenarioId: S.String,
    commitmentModifications:
      BatchCreateBillScenarioCommitmentModificationEntries,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchUpdateBillScenarioCommitmentModificationResponse extends S.Class<BatchUpdateBillScenarioCommitmentModificationResponse>(
  "BatchUpdateBillScenarioCommitmentModificationResponse",
)({
  items: S.optional(BillScenarioCommitmentModificationItems),
  errors: S.optional(BatchUpdateBillScenarioCommitmentModificationErrors),
}) {}
export class ListBillScenarioUsageModificationsResponse extends S.Class<ListBillScenarioUsageModificationsResponse>(
  "ListBillScenarioUsageModificationsResponse",
)({
  items: S.optional(BillScenarioUsageModificationItems),
  nextToken: S.optional(S.String),
}) {}
export class BatchUpdateBillScenarioUsageModificationResponse extends S.Class<BatchUpdateBillScenarioUsageModificationResponse>(
  "BatchUpdateBillScenarioUsageModificationResponse",
)({
  items: S.optional(BillScenarioUsageModificationItems),
  errors: S.optional(BatchUpdateBillScenarioUsageModificationErrors),
}) {}
export class ListWorkloadEstimatesResponse extends S.Class<ListWorkloadEstimatesResponse>(
  "ListWorkloadEstimatesResponse",
)({
  items: S.optional(WorkloadEstimateSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListWorkloadEstimateUsageResponse extends S.Class<ListWorkloadEstimateUsageResponse>(
  "ListWorkloadEstimateUsageResponse",
)({
  items: S.optional(WorkloadEstimateUsageItems),
  nextToken: S.optional(S.String),
}) {}
export class BatchCreateWorkloadEstimateUsageResponse extends S.Class<BatchCreateWorkloadEstimateUsageResponse>(
  "BatchCreateWorkloadEstimateUsageResponse",
)({
  items: S.optional(BatchCreateWorkloadEstimateUsageItems),
  errors: S.optional(BatchCreateWorkloadEstimateUsageErrors),
}) {}
export class BatchUpdateWorkloadEstimateUsageResponse extends S.Class<BatchUpdateWorkloadEstimateUsageResponse>(
  "BatchUpdateWorkloadEstimateUsageResponse",
)({
  items: S.optional(WorkloadEstimateUsageItems),
  errors: S.optional(BatchUpdateWorkloadEstimateUsageErrors),
}) {}
export class UsageQuantityResult extends S.Class<UsageQuantityResult>(
  "UsageQuantityResult",
)({ amount: S.optional(S.Number), unit: S.optional(S.String) }) {}
export class BillEstimateLineItemSummary extends S.Class<BillEstimateLineItemSummary>(
  "BillEstimateLineItemSummary",
)({
  serviceCode: S.String,
  usageType: S.String,
  operation: S.String,
  location: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  id: S.optional(S.String),
  lineItemId: S.optional(S.String),
  lineItemType: S.optional(S.String),
  payerAccountId: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  estimatedUsageQuantity: S.optional(UsageQuantityResult),
  estimatedCost: S.optional(CostAmount),
  historicalUsageQuantity: S.optional(UsageQuantityResult),
  historicalCost: S.optional(CostAmount),
  savingsPlanArns: S.optional(SavingsPlanArns),
}) {}
export const BillEstimateLineItemSummaries = S.Array(
  BillEstimateLineItemSummary,
);
export class BatchCreateBillScenarioUsageModificationEntry extends S.Class<BatchCreateBillScenarioUsageModificationEntry>(
  "BatchCreateBillScenarioUsageModificationEntry",
)({
  serviceCode: S.String,
  usageType: S.String,
  operation: S.String,
  availabilityZone: S.optional(S.String),
  key: S.String,
  group: S.optional(S.String),
  usageAccountId: S.String,
  amounts: S.optional(UsageAmounts),
  historicalUsage: S.optional(HistoricalUsageEntity),
}) {}
export const BatchCreateBillScenarioUsageModificationEntries = S.Array(
  BatchCreateBillScenarioUsageModificationEntry,
);
export class ListBillEstimateLineItemsResponse extends S.Class<ListBillEstimateLineItemsResponse>(
  "ListBillEstimateLineItemsResponse",
)({
  items: S.optional(BillEstimateLineItemSummaries),
  nextToken: S.optional(S.String),
}) {}
export class BatchCreateBillScenarioUsageModificationRequest extends S.Class<BatchCreateBillScenarioUsageModificationRequest>(
  "BatchCreateBillScenarioUsageModificationRequest",
)(
  {
    billScenarioId: S.String,
    usageModifications: BatchCreateBillScenarioUsageModificationEntries,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchCreateBillScenarioCommitmentModificationItem extends S.Class<BatchCreateBillScenarioCommitmentModificationItem>(
  "BatchCreateBillScenarioCommitmentModificationItem",
)({
  key: S.optional(S.String),
  id: S.optional(S.String),
  group: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  commitmentAction: S.optional(BillScenarioCommitmentModificationAction),
}) {}
export const BatchCreateBillScenarioCommitmentModificationItems = S.Array(
  BatchCreateBillScenarioCommitmentModificationItem,
);
export class BatchCreateBillScenarioCommitmentModificationError extends S.Class<BatchCreateBillScenarioCommitmentModificationError>(
  "BatchCreateBillScenarioCommitmentModificationError",
)({
  key: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const BatchCreateBillScenarioCommitmentModificationErrors = S.Array(
  BatchCreateBillScenarioCommitmentModificationError,
);
export class BatchCreateBillScenarioCommitmentModificationResponse extends S.Class<BatchCreateBillScenarioCommitmentModificationResponse>(
  "BatchCreateBillScenarioCommitmentModificationResponse",
)({
  items: S.optional(BatchCreateBillScenarioCommitmentModificationItems),
  errors: S.optional(BatchCreateBillScenarioCommitmentModificationErrors),
}) {}
export class BatchCreateBillScenarioUsageModificationItem extends S.Class<BatchCreateBillScenarioUsageModificationItem>(
  "BatchCreateBillScenarioUsageModificationItem",
)({
  serviceCode: S.String,
  usageType: S.String,
  operation: S.String,
  location: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  id: S.optional(S.String),
  group: S.optional(S.String),
  usageAccountId: S.optional(S.String),
  quantities: S.optional(UsageQuantities),
  historicalUsage: S.optional(HistoricalUsageEntity),
  key: S.optional(S.String),
}) {}
export const BatchCreateBillScenarioUsageModificationItems = S.Array(
  BatchCreateBillScenarioUsageModificationItem,
);
export class BatchCreateBillScenarioUsageModificationError extends S.Class<BatchCreateBillScenarioUsageModificationError>(
  "BatchCreateBillScenarioUsageModificationError",
)({
  key: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const BatchCreateBillScenarioUsageModificationErrors = S.Array(
  BatchCreateBillScenarioUsageModificationError,
);
export class BatchCreateBillScenarioUsageModificationResponse extends S.Class<BatchCreateBillScenarioUsageModificationResponse>(
  "BatchCreateBillScenarioUsageModificationResponse",
)({
  items: S.optional(BatchCreateBillScenarioUsageModificationItems),
  errors: S.optional(BatchCreateBillScenarioUsageModificationErrors),
}) {}

//# Errors
export class DataUnavailableException extends S.TaggedError<DataUnavailableException>()(
  "DataUnavailableException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
  T.AwsQueryError({ code: "ResourceNotFoundCode", httpResponseCode: 404 }),
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
  T.AwsQueryError({ code: "ConflictCode", httpResponseCode: 409 }),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
  T.AwsQueryError({ code: "ServiceQuotaCode", httpResponseCode: 402 }),
) {}

//# Operations
/**
 * Retrieves the current preferences for Pricing Calculator.
 */
export const getPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPreferencesRequest,
  output: GetPreferencesResponse,
  errors: [DataUnavailableException],
}));
/**
 * Removes one or more tags from a specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves details of a specific bill estimate.
 */
export const getBillEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBillEstimateRequest,
  output: GetBillEstimateResponse,
  errors: [DataUnavailableException, ResourceNotFoundException],
}));
/**
 * Deletes an existing bill estimate.
 */
export const deleteBillEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBillEstimateRequest,
  output: DeleteBillEstimateResponse,
  errors: [ConflictException, DataUnavailableException],
}));
/**
 * Retrieves details of a specific bill scenario.
 */
export const getBillScenario = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBillScenarioRequest,
  output: GetBillScenarioResponse,
  errors: [DataUnavailableException, ResourceNotFoundException],
}));
/**
 * Updates an existing bill scenario.
 */
export const updateBillScenario = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBillScenarioRequest,
  output: UpdateBillScenarioResponse,
  errors: [
    ConflictException,
    DataUnavailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves details of a specific workload estimate.
 */
export const getWorkloadEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkloadEstimateRequest,
  output: GetWorkloadEstimateResponse,
  errors: [DataUnavailableException, ResourceNotFoundException],
}));
/**
 * Updates an existing workload estimate.
 */
export const updateWorkloadEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWorkloadEstimateRequest,
    output: UpdateWorkloadEstimateResponse,
    errors: [
      ConflictException,
      DataUnavailableException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes an existing workload estimate.
 */
export const deleteWorkloadEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWorkloadEstimateRequest,
    output: DeleteWorkloadEstimateResponse,
    errors: [DataUnavailableException],
  }),
);
/**
 * Lists all tags associated with a specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes an existing bill scenario.
 */
export const deleteBillScenario = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBillScenarioRequest,
  output: DeleteBillScenarioResponse,
  errors: [ConflictException, DataUnavailableException],
}));
/**
 * Updates an existing bill estimate.
 */
export const updateBillEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBillEstimateRequest,
  output: UpdateBillEstimateResponse,
  errors: [
    ConflictException,
    DataUnavailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the preferences for Pricing Calculator.
 */
export const updatePreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePreferencesRequest,
  output: UpdatePreferencesResponse,
  errors: [DataUnavailableException, ServiceQuotaExceededException],
}));
/**
 * Lists the input commitment modifications associated with a bill estimate.
 */
export const listBillEstimateInputCommitmentModifications =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBillEstimateInputCommitmentModificationsRequest,
    output: ListBillEstimateInputCommitmentModificationsResponse,
    errors: [DataUnavailableException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the commitment modifications associated with a bill scenario.
 */
export const listBillScenarioCommitmentModifications =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBillScenarioCommitmentModificationsRequest,
    output: ListBillScenarioCommitmentModificationsResponse,
    errors: [DataUnavailableException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Delete commitment that you have created in a Bill Scenario. You can only delete a commitment that you had added and cannot model deletion (or removal) of a existing commitment. If you want model deletion of an existing commitment, see the negate BillScenarioCommitmentModificationAction of BatchCreateBillScenarioCommitmentModification operation.
 *
 * The `BatchDeleteBillScenarioCommitmentModification` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:DeleteBillScenarioCommitmentModification` in your policies.
 */
export const batchDeleteBillScenarioCommitmentModification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDeleteBillScenarioCommitmentModificationRequest,
    output: BatchDeleteBillScenarioCommitmentModificationResponse,
    errors: [
      ConflictException,
      DataUnavailableException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Delete usage that you have created in a Bill Scenario. You can only delete usage that you had added and cannot model deletion (or removal) of a existing usage. If you want model removal of an existing usage, see BatchUpdateBillScenarioUsageModification.
 *
 * The `BatchDeleteBillScenarioUsageModification` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:DeleteBillScenarioUsageModification` in your policies.
 */
export const batchDeleteBillScenarioUsageModification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDeleteBillScenarioUsageModificationRequest,
    output: BatchDeleteBillScenarioUsageModificationResponse,
    errors: [
      ConflictException,
      DataUnavailableException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Delete usage that you have created in a Workload estimate. You can only delete usage that you had added and cannot model deletion (or removal) of a existing usage. If you want model removal of an existing usage, see BatchUpdateWorkloadEstimateUsage.
 *
 * The `BatchDeleteWorkloadEstimateUsage` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:DeleteWorkloadEstimateUsage` in your policies.
 */
export const batchDeleteWorkloadEstimateUsage =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDeleteWorkloadEstimateUsageRequest,
    output: BatchDeleteWorkloadEstimateUsageResponse,
    errors: [
      DataUnavailableException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Creates a new bill scenario to model potential changes to Amazon Web Services usage and costs.
 */
export const createBillScenario = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBillScenarioRequest,
  output: CreateBillScenarioResponse,
  errors: [
    ConflictException,
    DataUnavailableException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Creates a new workload estimate to model costs for a specific workload.
 */
export const createWorkloadEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWorkloadEstimateRequest,
    output: CreateWorkloadEstimateResponse,
    errors: [
      ConflictException,
      DataUnavailableException,
      ServiceQuotaExceededException,
    ],
  }),
);
/**
 * Adds one or more tags to a specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * Create a Bill estimate from a Bill scenario. In the Bill scenario you can model usage addition, usage changes, and usage removal. You can also model commitment addition and commitment removal. After all changes in a Bill scenario is made satisfactorily, you can call this API with a Bill scenario ID to generate the Bill estimate. Bill estimate calculates the pre-tax cost for your consolidated billing family, incorporating all modeled usage and commitments alongside existing usage and commitments from your most recent completed anniversary bill, with any applicable discounts applied.
 */
export const createBillEstimate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBillEstimateRequest,
  output: CreateBillEstimateResponse,
  errors: [
    ConflictException,
    DataUnavailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists all bill estimates for the account.
 */
export const listBillEstimates = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBillEstimatesRequest,
    output: ListBillEstimatesResponse,
    errors: [DataUnavailableException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the commitments associated with a bill estimate.
 */
export const listBillEstimateCommitments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBillEstimateCommitmentsRequest,
    output: ListBillEstimateCommitmentsResponse,
    errors: [DataUnavailableException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the input usage modifications associated with a bill estimate.
 */
export const listBillEstimateInputUsageModifications =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBillEstimateInputUsageModificationsRequest,
    output: ListBillEstimateInputUsageModificationsResponse,
    errors: [DataUnavailableException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all bill scenarios for the account.
 */
export const listBillScenarios = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBillScenariosRequest,
    output: ListBillScenariosResponse,
    errors: [DataUnavailableException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Update a newly added or existing commitment. You can update the commitment group based on a commitment ID and a Bill scenario ID.
 *
 * The `BatchUpdateBillScenarioCommitmentModification` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:UpdateBillScenarioCommitmentModification` in your policies.
 */
export const batchUpdateBillScenarioCommitmentModification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchUpdateBillScenarioCommitmentModificationRequest,
    output: BatchUpdateBillScenarioCommitmentModificationResponse,
    errors: [
      ConflictException,
      DataUnavailableException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Lists the usage modifications associated with a bill scenario.
 */
export const listBillScenarioUsageModifications =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBillScenarioUsageModificationsRequest,
    output: ListBillScenarioUsageModificationsResponse,
    errors: [DataUnavailableException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Update a newly added or existing usage lines. You can update the usage amounts, usage hour, and usage group based on a usage ID and a Bill scenario ID.
 *
 * The `BatchUpdateBillScenarioUsageModification` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:UpdateBillScenarioUsageModification` in your policies.
 */
export const batchUpdateBillScenarioUsageModification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchUpdateBillScenarioUsageModificationRequest,
    output: BatchUpdateBillScenarioUsageModificationResponse,
    errors: [
      ConflictException,
      DataUnavailableException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Lists all workload estimates for the account.
 */
export const listWorkloadEstimates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkloadEstimatesRequest,
    output: ListWorkloadEstimatesResponse,
    errors: [DataUnavailableException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the usage associated with a workload estimate.
 */
export const listWorkloadEstimateUsage =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkloadEstimateUsageRequest,
    output: ListWorkloadEstimateUsageResponse,
    errors: [DataUnavailableException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Create Amazon Web Services service usage that you want to model in a Workload Estimate.
 *
 * The `BatchCreateWorkloadEstimateUsage` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:CreateWorkloadEstimateUsage` in your policies.
 */
export const batchCreateWorkloadEstimateUsage =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchCreateWorkloadEstimateUsageRequest,
    output: BatchCreateWorkloadEstimateUsageResponse,
    errors: [
      ConflictException,
      DataUnavailableException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Update a newly added or existing usage lines. You can update the usage amounts and usage group based on a usage ID and a Workload estimate ID.
 *
 * The `BatchUpdateWorkloadEstimateUsage` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:UpdateWorkloadEstimateUsage` in your policies.
 */
export const batchUpdateWorkloadEstimateUsage =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchUpdateWorkloadEstimateUsageRequest,
    output: BatchUpdateWorkloadEstimateUsageResponse,
    errors: [
      DataUnavailableException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Lists the line items associated with a bill estimate.
 */
export const listBillEstimateLineItems =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBillEstimateLineItemsRequest,
    output: ListBillEstimateLineItemsResponse,
    errors: [DataUnavailableException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Create Compute Savings Plans, EC2 Instance Savings Plans, or EC2 Reserved Instances commitments that you want to model in a Bill Scenario.
 *
 * The `BatchCreateBillScenarioCommitmentModification` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:CreateBillScenarioCommitmentModification` in your policies.
 */
export const batchCreateBillScenarioCommitmentModification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchCreateBillScenarioCommitmentModificationRequest,
    output: BatchCreateBillScenarioCommitmentModificationResponse,
    errors: [
      ConflictException,
      DataUnavailableException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Create Amazon Web Services service usage that you want to model in a Bill Scenario.
 *
 * The `BatchCreateBillScenarioUsageModification` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:CreateBillScenarioUsageModification` in your policies.
 */
export const batchCreateBillScenarioUsageModification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchCreateBillScenarioUsageModificationRequest,
    output: BatchCreateBillScenarioUsageModificationResponse,
    errors: [
      ConflictException,
      DataUnavailableException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }));
