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
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
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

//# Newtypes
export type Arn = string;
export type ResourceTagKey = string;
export type ResourceId = string;
export type BillEstimateName = string;
export type ClientToken = string;
export type NextPageToken = string;
export type MaxResults = number;
export type BillScenarioName = string;
export type CostCategoryArn = string;
export type WorkloadEstimateName = string;
export type WorkloadEstimateUsageMaxResults = number;
export type ResourceTagValue = string;
export type Key = string;
export type UsageGroup = string;
export type AccountId = string;
export type ServiceCode = string;
export type UsageType = string;
export type Operation = string;
export type AvailabilityZone = string;
export type Uuid = string;
export type ReservedInstanceInstanceCount = number;
export type SavingsPlanCommitment = number;

//# Schemas
export interface GetPreferencesRequest {}
export const GetPreferencesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPreferencesRequest",
}) as any as S.Schema<GetPreferencesRequest>;
export type RateTypes = string[];
export const RateTypes = S.Array(S.String);
export type ResourceTagKeys = string[];
export const ResourceTagKeys = S.Array(S.String);
export type BatchDeleteBillScenarioCommitmentModificationEntries = string[];
export const BatchDeleteBillScenarioCommitmentModificationEntries = S.Array(
  S.String,
);
export type BatchDeleteBillScenarioUsageModificationEntries = string[];
export const BatchDeleteBillScenarioUsageModificationEntries = S.Array(
  S.String,
);
export type BatchDeleteWorkloadEstimateUsageEntries = string[];
export const BatchDeleteWorkloadEstimateUsageEntries = S.Array(S.String);
export interface GetPreferencesResponse {
  managementAccountRateTypeSelections?: RateTypes;
  memberAccountRateTypeSelections?: RateTypes;
  standaloneAccountRateTypeSelections?: RateTypes;
}
export const GetPreferencesResponse = S.suspend(() =>
  S.Struct({
    managementAccountRateTypeSelections: S.optional(RateTypes),
    memberAccountRateTypeSelections: S.optional(RateTypes),
    standaloneAccountRateTypeSelections: S.optional(RateTypes),
  }),
).annotations({
  identifier: "GetPreferencesResponse",
}) as any as S.Schema<GetPreferencesResponse>;
export interface ListTagsForResourceRequest {
  arn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  arn: string;
  tagKeys: ResourceTagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String, tagKeys: ResourceTagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdatePreferencesRequest {
  managementAccountRateTypeSelections?: RateTypes;
  memberAccountRateTypeSelections?: RateTypes;
  standaloneAccountRateTypeSelections?: RateTypes;
}
export const UpdatePreferencesRequest = S.suspend(() =>
  S.Struct({
    managementAccountRateTypeSelections: S.optional(RateTypes),
    memberAccountRateTypeSelections: S.optional(RateTypes),
    standaloneAccountRateTypeSelections: S.optional(RateTypes),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePreferencesRequest",
}) as any as S.Schema<UpdatePreferencesRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateBillEstimateRequest {
  billScenarioId: string;
  name: string;
  clientToken?: string;
  tags?: Tags;
}
export const CreateBillEstimateRequest = S.suspend(() =>
  S.Struct({
    billScenarioId: S.String,
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBillEstimateRequest",
}) as any as S.Schema<CreateBillEstimateRequest>;
export interface GetBillEstimateRequest {
  identifier: string;
}
export const GetBillEstimateRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetBillEstimateRequest",
}) as any as S.Schema<GetBillEstimateRequest>;
export interface UpdateBillEstimateRequest {
  identifier: string;
  name?: string;
  expiresAt?: Date;
}
export const UpdateBillEstimateRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    name: S.optional(S.String),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateBillEstimateRequest",
}) as any as S.Schema<UpdateBillEstimateRequest>;
export interface DeleteBillEstimateRequest {
  identifier: string;
}
export const DeleteBillEstimateRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteBillEstimateRequest",
}) as any as S.Schema<DeleteBillEstimateRequest>;
export interface DeleteBillEstimateResponse {}
export const DeleteBillEstimateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteBillEstimateResponse",
}) as any as S.Schema<DeleteBillEstimateResponse>;
export interface ListBillEstimateCommitmentsRequest {
  billEstimateId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListBillEstimateCommitmentsRequest = S.suspend(() =>
  S.Struct({
    billEstimateId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBillEstimateCommitmentsRequest",
}) as any as S.Schema<ListBillEstimateCommitmentsRequest>;
export interface ListBillEstimateInputCommitmentModificationsRequest {
  billEstimateId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListBillEstimateInputCommitmentModificationsRequest = S.suspend(
  () =>
    S.Struct({
      billEstimateId: S.String,
      nextToken: S.optional(S.String),
      maxResults: S.optional(S.Number),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "ListBillEstimateInputCommitmentModificationsRequest",
}) as any as S.Schema<ListBillEstimateInputCommitmentModificationsRequest>;
export interface CreateBillScenarioRequest {
  name: string;
  clientToken?: string;
  tags?: Tags;
  groupSharingPreference?: string;
  costCategoryGroupSharingPreferenceArn?: string;
}
export const CreateBillScenarioRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    tags: S.optional(Tags),
    groupSharingPreference: S.optional(S.String),
    costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBillScenarioRequest",
}) as any as S.Schema<CreateBillScenarioRequest>;
export interface GetBillScenarioRequest {
  identifier: string;
}
export const GetBillScenarioRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetBillScenarioRequest",
}) as any as S.Schema<GetBillScenarioRequest>;
export interface UpdateBillScenarioRequest {
  identifier: string;
  name?: string;
  expiresAt?: Date;
  groupSharingPreference?: string;
  costCategoryGroupSharingPreferenceArn?: string;
}
export const UpdateBillScenarioRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    name: S.optional(S.String),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    groupSharingPreference: S.optional(S.String),
    costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateBillScenarioRequest",
}) as any as S.Schema<UpdateBillScenarioRequest>;
export interface DeleteBillScenarioRequest {
  identifier: string;
}
export const DeleteBillScenarioRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteBillScenarioRequest",
}) as any as S.Schema<DeleteBillScenarioRequest>;
export interface DeleteBillScenarioResponse {}
export const DeleteBillScenarioResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteBillScenarioResponse",
}) as any as S.Schema<DeleteBillScenarioResponse>;
export interface ListBillScenarioCommitmentModificationsRequest {
  billScenarioId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListBillScenarioCommitmentModificationsRequest = S.suspend(() =>
  S.Struct({
    billScenarioId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBillScenarioCommitmentModificationsRequest",
}) as any as S.Schema<ListBillScenarioCommitmentModificationsRequest>;
export interface BatchDeleteBillScenarioCommitmentModificationRequest {
  billScenarioId: string;
  ids: BatchDeleteBillScenarioCommitmentModificationEntries;
}
export const BatchDeleteBillScenarioCommitmentModificationRequest = S.suspend(
  () =>
    S.Struct({
      billScenarioId: S.String,
      ids: BatchDeleteBillScenarioCommitmentModificationEntries,
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "BatchDeleteBillScenarioCommitmentModificationRequest",
}) as any as S.Schema<BatchDeleteBillScenarioCommitmentModificationRequest>;
export type ListUsageFilterValues = string[];
export const ListUsageFilterValues = S.Array(S.String);
export interface ListUsageFilter {
  name: string;
  values: ListUsageFilterValues;
  matchOption?: string;
}
export const ListUsageFilter = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: ListUsageFilterValues,
    matchOption: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUsageFilter",
}) as any as S.Schema<ListUsageFilter>;
export type ListUsageFilters = ListUsageFilter[];
export const ListUsageFilters = S.Array(ListUsageFilter);
export interface ListBillScenarioUsageModificationsRequest {
  billScenarioId: string;
  filters?: ListUsageFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListBillScenarioUsageModificationsRequest = S.suspend(() =>
  S.Struct({
    billScenarioId: S.String,
    filters: S.optional(ListUsageFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBillScenarioUsageModificationsRequest",
}) as any as S.Schema<ListBillScenarioUsageModificationsRequest>;
export interface BatchDeleteBillScenarioUsageModificationRequest {
  billScenarioId: string;
  ids: BatchDeleteBillScenarioUsageModificationEntries;
}
export const BatchDeleteBillScenarioUsageModificationRequest = S.suspend(() =>
  S.Struct({
    billScenarioId: S.String,
    ids: BatchDeleteBillScenarioUsageModificationEntries,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDeleteBillScenarioUsageModificationRequest",
}) as any as S.Schema<BatchDeleteBillScenarioUsageModificationRequest>;
export interface CreateWorkloadEstimateRequest {
  name: string;
  clientToken?: string;
  rateType?: string;
  tags?: Tags;
}
export const CreateWorkloadEstimateRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    rateType: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWorkloadEstimateRequest",
}) as any as S.Schema<CreateWorkloadEstimateRequest>;
export interface GetWorkloadEstimateRequest {
  identifier: string;
}
export const GetWorkloadEstimateRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetWorkloadEstimateRequest",
}) as any as S.Schema<GetWorkloadEstimateRequest>;
export interface UpdateWorkloadEstimateRequest {
  identifier: string;
  name?: string;
  expiresAt?: Date;
}
export const UpdateWorkloadEstimateRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    name: S.optional(S.String),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateWorkloadEstimateRequest",
}) as any as S.Schema<UpdateWorkloadEstimateRequest>;
export interface DeleteWorkloadEstimateRequest {
  identifier: string;
}
export const DeleteWorkloadEstimateRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWorkloadEstimateRequest",
}) as any as S.Schema<DeleteWorkloadEstimateRequest>;
export interface DeleteWorkloadEstimateResponse {}
export const DeleteWorkloadEstimateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWorkloadEstimateResponse",
}) as any as S.Schema<DeleteWorkloadEstimateResponse>;
export interface ListWorkloadEstimateUsageRequest {
  workloadEstimateId: string;
  filters?: ListUsageFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListWorkloadEstimateUsageRequest = S.suspend(() =>
  S.Struct({
    workloadEstimateId: S.String,
    filters: S.optional(ListUsageFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWorkloadEstimateUsageRequest",
}) as any as S.Schema<ListWorkloadEstimateUsageRequest>;
export interface BatchDeleteWorkloadEstimateUsageRequest {
  workloadEstimateId: string;
  ids: BatchDeleteWorkloadEstimateUsageEntries;
}
export const BatchDeleteWorkloadEstimateUsageRequest = S.suspend(() =>
  S.Struct({
    workloadEstimateId: S.String,
    ids: BatchDeleteWorkloadEstimateUsageEntries,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDeleteWorkloadEstimateUsageRequest",
}) as any as S.Schema<BatchDeleteWorkloadEstimateUsageRequest>;
export type ListBillEstimatesFilterValues = string[];
export const ListBillEstimatesFilterValues = S.Array(S.String);
export type ListBillEstimateLineItemsFilterValues = string[];
export const ListBillEstimateLineItemsFilterValues = S.Array(S.String);
export type ListBillScenariosFilterValues = string[];
export const ListBillScenariosFilterValues = S.Array(S.String);
export type ListWorkloadEstimatesFilterValues = string[];
export const ListWorkloadEstimatesFilterValues = S.Array(S.String);
export interface ListBillEstimatesFilter {
  name: string;
  values: ListBillEstimatesFilterValues;
  matchOption?: string;
}
export const ListBillEstimatesFilter = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: ListBillEstimatesFilterValues,
    matchOption: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillEstimatesFilter",
}) as any as S.Schema<ListBillEstimatesFilter>;
export type ListBillEstimatesFilters = ListBillEstimatesFilter[];
export const ListBillEstimatesFilters = S.Array(ListBillEstimatesFilter);
export interface FilterTimestamp {
  afterTimestamp?: Date;
  beforeTimestamp?: Date;
}
export const FilterTimestamp = S.suspend(() =>
  S.Struct({
    afterTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    beforeTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "FilterTimestamp",
}) as any as S.Schema<FilterTimestamp>;
export interface ListBillEstimateLineItemsFilter {
  name: string;
  values: ListBillEstimateLineItemsFilterValues;
  matchOption?: string;
}
export const ListBillEstimateLineItemsFilter = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: ListBillEstimateLineItemsFilterValues,
    matchOption: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillEstimateLineItemsFilter",
}) as any as S.Schema<ListBillEstimateLineItemsFilter>;
export type ListBillEstimateLineItemsFilters =
  ListBillEstimateLineItemsFilter[];
export const ListBillEstimateLineItemsFilters = S.Array(
  ListBillEstimateLineItemsFilter,
);
export interface ListBillScenariosFilter {
  name: string;
  values: ListBillScenariosFilterValues;
  matchOption?: string;
}
export const ListBillScenariosFilter = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: ListBillScenariosFilterValues,
    matchOption: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillScenariosFilter",
}) as any as S.Schema<ListBillScenariosFilter>;
export type ListBillScenariosFilters = ListBillScenariosFilter[];
export const ListBillScenariosFilters = S.Array(ListBillScenariosFilter);
export interface BatchUpdateBillScenarioCommitmentModificationEntry {
  id: string;
  group?: string;
}
export const BatchUpdateBillScenarioCommitmentModificationEntry = S.suspend(
  () => S.Struct({ id: S.String, group: S.optional(S.String) }),
).annotations({
  identifier: "BatchUpdateBillScenarioCommitmentModificationEntry",
}) as any as S.Schema<BatchUpdateBillScenarioCommitmentModificationEntry>;
export type BatchUpdateBillScenarioCommitmentModificationEntries =
  BatchUpdateBillScenarioCommitmentModificationEntry[];
export const BatchUpdateBillScenarioCommitmentModificationEntries = S.Array(
  BatchUpdateBillScenarioCommitmentModificationEntry,
);
export interface UsageAmount {
  startHour: Date;
  amount: number;
}
export const UsageAmount = S.suspend(() =>
  S.Struct({
    startHour: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    amount: S.Number,
  }),
).annotations({ identifier: "UsageAmount" }) as any as S.Schema<UsageAmount>;
export type UsageAmounts = UsageAmount[];
export const UsageAmounts = S.Array(UsageAmount);
export interface BatchUpdateBillScenarioUsageModificationEntry {
  id: string;
  group?: string;
  amounts?: UsageAmounts;
}
export const BatchUpdateBillScenarioUsageModificationEntry = S.suspend(() =>
  S.Struct({
    id: S.String,
    group: S.optional(S.String),
    amounts: S.optional(UsageAmounts),
  }),
).annotations({
  identifier: "BatchUpdateBillScenarioUsageModificationEntry",
}) as any as S.Schema<BatchUpdateBillScenarioUsageModificationEntry>;
export type BatchUpdateBillScenarioUsageModificationEntries =
  BatchUpdateBillScenarioUsageModificationEntry[];
export const BatchUpdateBillScenarioUsageModificationEntries = S.Array(
  BatchUpdateBillScenarioUsageModificationEntry,
);
export interface ListWorkloadEstimatesFilter {
  name: string;
  values: ListWorkloadEstimatesFilterValues;
  matchOption?: string;
}
export const ListWorkloadEstimatesFilter = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: ListWorkloadEstimatesFilterValues,
    matchOption: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadEstimatesFilter",
}) as any as S.Schema<ListWorkloadEstimatesFilter>;
export type ListWorkloadEstimatesFilters = ListWorkloadEstimatesFilter[];
export const ListWorkloadEstimatesFilters = S.Array(
  ListWorkloadEstimatesFilter,
);
export interface BillInterval {
  start?: Date;
  end?: Date;
}
export const BillInterval = S.suspend(() =>
  S.Struct({
    start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    end: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "BillInterval" }) as any as S.Schema<BillInterval>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface ExpressionFilter {
  key?: string;
  matchOptions?: StringList;
  values?: StringList;
}
export const ExpressionFilter = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    matchOptions: S.optional(StringList),
    values: S.optional(StringList),
  }),
).annotations({
  identifier: "ExpressionFilter",
}) as any as S.Schema<ExpressionFilter>;
export interface Expression {
  and?: ExpressionList;
  or?: ExpressionList;
  not?: Expression;
  costCategories?: ExpressionFilter;
  dimensions?: ExpressionFilter;
  tags?: ExpressionFilter;
}
export const Expression = S.suspend(() =>
  S.Struct({
    and: S.optional(
      S.suspend(() => ExpressionList).annotations({
        identifier: "ExpressionList",
      }),
    ),
    or: S.optional(
      S.suspend(() => ExpressionList).annotations({
        identifier: "ExpressionList",
      }),
    ),
    not: S.optional(
      S.suspend((): S.Schema<Expression, any> => Expression).annotations({
        identifier: "Expression",
      }),
    ),
    costCategories: S.optional(ExpressionFilter),
    dimensions: S.optional(ExpressionFilter),
    tags: S.optional(ExpressionFilter),
  }),
).annotations({ identifier: "Expression" }) as any as S.Schema<Expression>;
export interface HistoricalUsageEntity {
  serviceCode: string;
  usageType: string;
  operation: string;
  location?: string;
  usageAccountId: string;
  billInterval: BillInterval;
  filterExpression: Expression;
}
export const HistoricalUsageEntity = S.suspend(() =>
  S.Struct({
    serviceCode: S.String,
    usageType: S.String,
    operation: S.String,
    location: S.optional(S.String),
    usageAccountId: S.String,
    billInterval: BillInterval,
    filterExpression: Expression,
  }),
).annotations({
  identifier: "HistoricalUsageEntity",
}) as any as S.Schema<HistoricalUsageEntity>;
export interface BatchCreateWorkloadEstimateUsageEntry {
  serviceCode: string;
  usageType: string;
  operation: string;
  key: string;
  group?: string;
  usageAccountId: string;
  amount: number;
  historicalUsage?: HistoricalUsageEntity;
}
export const BatchCreateWorkloadEstimateUsageEntry = S.suspend(() =>
  S.Struct({
    serviceCode: S.String,
    usageType: S.String,
    operation: S.String,
    key: S.String,
    group: S.optional(S.String),
    usageAccountId: S.String,
    amount: S.Number,
    historicalUsage: S.optional(HistoricalUsageEntity),
  }),
).annotations({
  identifier: "BatchCreateWorkloadEstimateUsageEntry",
}) as any as S.Schema<BatchCreateWorkloadEstimateUsageEntry>;
export type BatchCreateWorkloadEstimateUsageEntries =
  BatchCreateWorkloadEstimateUsageEntry[];
export const BatchCreateWorkloadEstimateUsageEntries = S.Array(
  BatchCreateWorkloadEstimateUsageEntry,
);
export interface BatchUpdateWorkloadEstimateUsageEntry {
  id: string;
  group?: string;
  amount?: number;
}
export const BatchUpdateWorkloadEstimateUsageEntry = S.suspend(() =>
  S.Struct({
    id: S.String,
    group: S.optional(S.String),
    amount: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchUpdateWorkloadEstimateUsageEntry",
}) as any as S.Schema<BatchUpdateWorkloadEstimateUsageEntry>;
export type BatchUpdateWorkloadEstimateUsageEntries =
  BatchUpdateWorkloadEstimateUsageEntry[];
export const BatchUpdateWorkloadEstimateUsageEntries = S.Array(
  BatchUpdateWorkloadEstimateUsageEntry,
);
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  arn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String, tags: Tags }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UpdatePreferencesResponse {
  managementAccountRateTypeSelections?: RateTypes;
  memberAccountRateTypeSelections?: RateTypes;
  standaloneAccountRateTypeSelections?: RateTypes;
}
export const UpdatePreferencesResponse = S.suspend(() =>
  S.Struct({
    managementAccountRateTypeSelections: S.optional(RateTypes),
    memberAccountRateTypeSelections: S.optional(RateTypes),
    standaloneAccountRateTypeSelections: S.optional(RateTypes),
  }),
).annotations({
  identifier: "UpdatePreferencesResponse",
}) as any as S.Schema<UpdatePreferencesResponse>;
export interface CostAmount {
  amount?: number;
  currency?: string;
}
export const CostAmount = S.suspend(() =>
  S.Struct({ amount: S.optional(S.Number), currency: S.optional(S.String) }),
).annotations({ identifier: "CostAmount" }) as any as S.Schema<CostAmount>;
export interface CostDifference {
  historicalCost?: CostAmount;
  estimatedCost?: CostAmount;
}
export const CostDifference = S.suspend(() =>
  S.Struct({
    historicalCost: S.optional(CostAmount),
    estimatedCost: S.optional(CostAmount),
  }),
).annotations({
  identifier: "CostDifference",
}) as any as S.Schema<CostDifference>;
export type ServiceCostDifferenceMap = { [key: string]: CostDifference };
export const ServiceCostDifferenceMap = S.Record({
  key: S.String,
  value: CostDifference,
});
export interface BillEstimateCostSummary {
  totalCostDifference?: CostDifference;
  serviceCostDifferences?: ServiceCostDifferenceMap;
}
export const BillEstimateCostSummary = S.suspend(() =>
  S.Struct({
    totalCostDifference: S.optional(CostDifference),
    serviceCostDifferences: S.optional(ServiceCostDifferenceMap),
  }),
).annotations({
  identifier: "BillEstimateCostSummary",
}) as any as S.Schema<BillEstimateCostSummary>;
export interface GetBillEstimateResponse {
  id: string;
  name?: string;
  status?: string;
  failureMessage?: string;
  billInterval?: BillInterval;
  costSummary?: BillEstimateCostSummary;
  createdAt?: Date;
  expiresAt?: Date;
  groupSharingPreference?: string;
  costCategoryGroupSharingPreferenceArn?: string;
  costCategoryGroupSharingPreferenceEffectiveDate?: Date;
}
export const GetBillEstimateResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetBillEstimateResponse",
}) as any as S.Schema<GetBillEstimateResponse>;
export interface UpdateBillEstimateResponse {
  id: string;
  name?: string;
  status?: string;
  failureMessage?: string;
  billInterval?: BillInterval;
  costSummary?: BillEstimateCostSummary;
  createdAt?: Date;
  expiresAt?: Date;
  groupSharingPreference?: string;
  costCategoryGroupSharingPreferenceArn?: string;
  costCategoryGroupSharingPreferenceEffectiveDate?: Date;
}
export const UpdateBillEstimateResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "UpdateBillEstimateResponse",
}) as any as S.Schema<UpdateBillEstimateResponse>;
export interface ListBillEstimatesRequest {
  filters?: ListBillEstimatesFilters;
  createdAtFilter?: FilterTimestamp;
  expiresAtFilter?: FilterTimestamp;
  nextToken?: string;
  maxResults?: number;
}
export const ListBillEstimatesRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(ListBillEstimatesFilters),
    createdAtFilter: S.optional(FilterTimestamp),
    expiresAtFilter: S.optional(FilterTimestamp),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBillEstimatesRequest",
}) as any as S.Schema<ListBillEstimatesRequest>;
export interface ListBillEstimateInputUsageModificationsRequest {
  billEstimateId: string;
  filters?: ListUsageFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListBillEstimateInputUsageModificationsRequest = S.suspend(() =>
  S.Struct({
    billEstimateId: S.String,
    filters: S.optional(ListUsageFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBillEstimateInputUsageModificationsRequest",
}) as any as S.Schema<ListBillEstimateInputUsageModificationsRequest>;
export interface ListBillEstimateLineItemsRequest {
  billEstimateId: string;
  filters?: ListBillEstimateLineItemsFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListBillEstimateLineItemsRequest = S.suspend(() =>
  S.Struct({
    billEstimateId: S.String,
    filters: S.optional(ListBillEstimateLineItemsFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBillEstimateLineItemsRequest",
}) as any as S.Schema<ListBillEstimateLineItemsRequest>;
export interface CreateBillScenarioResponse {
  id: string;
  name?: string;
  billInterval?: BillInterval;
  status?: string;
  createdAt?: Date;
  expiresAt?: Date;
  failureMessage?: string;
  groupSharingPreference?: string;
  costCategoryGroupSharingPreferenceArn?: string;
}
export const CreateBillScenarioResponse = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.optional(S.String),
    billInterval: S.optional(BillInterval),
    status: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    failureMessage: S.optional(S.String),
    groupSharingPreference: S.optional(S.String),
    costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateBillScenarioResponse",
}) as any as S.Schema<CreateBillScenarioResponse>;
export interface GetBillScenarioResponse {
  id: string;
  name?: string;
  billInterval?: BillInterval;
  status?: string;
  createdAt?: Date;
  expiresAt?: Date;
  failureMessage?: string;
  groupSharingPreference?: string;
  costCategoryGroupSharingPreferenceArn?: string;
}
export const GetBillScenarioResponse = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.optional(S.String),
    billInterval: S.optional(BillInterval),
    status: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    failureMessage: S.optional(S.String),
    groupSharingPreference: S.optional(S.String),
    costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBillScenarioResponse",
}) as any as S.Schema<GetBillScenarioResponse>;
export interface UpdateBillScenarioResponse {
  id: string;
  name?: string;
  billInterval?: BillInterval;
  status?: string;
  createdAt?: Date;
  expiresAt?: Date;
  failureMessage?: string;
  groupSharingPreference?: string;
  costCategoryGroupSharingPreferenceArn?: string;
}
export const UpdateBillScenarioResponse = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.optional(S.String),
    billInterval: S.optional(BillInterval),
    status: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    failureMessage: S.optional(S.String),
    groupSharingPreference: S.optional(S.String),
    costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateBillScenarioResponse",
}) as any as S.Schema<UpdateBillScenarioResponse>;
export interface ListBillScenariosRequest {
  filters?: ListBillScenariosFilters;
  createdAtFilter?: FilterTimestamp;
  expiresAtFilter?: FilterTimestamp;
  nextToken?: string;
  maxResults?: number;
}
export const ListBillScenariosRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(ListBillScenariosFilters),
    createdAtFilter: S.optional(FilterTimestamp),
    expiresAtFilter: S.optional(FilterTimestamp),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBillScenariosRequest",
}) as any as S.Schema<ListBillScenariosRequest>;
export interface BatchUpdateBillScenarioCommitmentModificationRequest {
  billScenarioId: string;
  commitmentModifications: BatchUpdateBillScenarioCommitmentModificationEntries;
}
export const BatchUpdateBillScenarioCommitmentModificationRequest = S.suspend(
  () =>
    S.Struct({
      billScenarioId: S.String,
      commitmentModifications:
        BatchUpdateBillScenarioCommitmentModificationEntries,
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "BatchUpdateBillScenarioCommitmentModificationRequest",
}) as any as S.Schema<BatchUpdateBillScenarioCommitmentModificationRequest>;
export interface BatchUpdateBillScenarioUsageModificationRequest {
  billScenarioId: string;
  usageModifications: BatchUpdateBillScenarioUsageModificationEntries;
}
export const BatchUpdateBillScenarioUsageModificationRequest = S.suspend(() =>
  S.Struct({
    billScenarioId: S.String,
    usageModifications: BatchUpdateBillScenarioUsageModificationEntries,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchUpdateBillScenarioUsageModificationRequest",
}) as any as S.Schema<BatchUpdateBillScenarioUsageModificationRequest>;
export interface CreateWorkloadEstimateResponse {
  id: string;
  name?: string;
  createdAt?: Date;
  expiresAt?: Date;
  rateType?: string;
  rateTimestamp?: Date;
  status?: string;
  totalCost?: number;
  costCurrency?: string;
  failureMessage?: string;
}
export const CreateWorkloadEstimateResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CreateWorkloadEstimateResponse",
}) as any as S.Schema<CreateWorkloadEstimateResponse>;
export interface GetWorkloadEstimateResponse {
  id: string;
  name?: string;
  createdAt?: Date;
  expiresAt?: Date;
  rateType?: string;
  rateTimestamp?: Date;
  status?: string;
  totalCost?: number;
  costCurrency?: string;
  failureMessage?: string;
}
export const GetWorkloadEstimateResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetWorkloadEstimateResponse",
}) as any as S.Schema<GetWorkloadEstimateResponse>;
export interface UpdateWorkloadEstimateResponse {
  id: string;
  name?: string;
  createdAt?: Date;
  expiresAt?: Date;
  rateType?: string;
  rateTimestamp?: Date;
  status?: string;
  totalCost?: number;
  costCurrency?: string;
  failureMessage?: string;
}
export const UpdateWorkloadEstimateResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "UpdateWorkloadEstimateResponse",
}) as any as S.Schema<UpdateWorkloadEstimateResponse>;
export interface ListWorkloadEstimatesRequest {
  createdAtFilter?: FilterTimestamp;
  expiresAtFilter?: FilterTimestamp;
  filters?: ListWorkloadEstimatesFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListWorkloadEstimatesRequest = S.suspend(() =>
  S.Struct({
    createdAtFilter: S.optional(FilterTimestamp),
    expiresAtFilter: S.optional(FilterTimestamp),
    filters: S.optional(ListWorkloadEstimatesFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWorkloadEstimatesRequest",
}) as any as S.Schema<ListWorkloadEstimatesRequest>;
export interface BatchCreateWorkloadEstimateUsageRequest {
  workloadEstimateId: string;
  usage: BatchCreateWorkloadEstimateUsageEntries;
  clientToken?: string;
}
export const BatchCreateWorkloadEstimateUsageRequest = S.suspend(() =>
  S.Struct({
    workloadEstimateId: S.String,
    usage: BatchCreateWorkloadEstimateUsageEntries,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchCreateWorkloadEstimateUsageRequest",
}) as any as S.Schema<BatchCreateWorkloadEstimateUsageRequest>;
export interface BatchUpdateWorkloadEstimateUsageRequest {
  workloadEstimateId: string;
  usage: BatchUpdateWorkloadEstimateUsageEntries;
}
export const BatchUpdateWorkloadEstimateUsageRequest = S.suspend(() =>
  S.Struct({
    workloadEstimateId: S.String,
    usage: BatchUpdateWorkloadEstimateUsageEntries,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchUpdateWorkloadEstimateUsageRequest",
}) as any as S.Schema<BatchUpdateWorkloadEstimateUsageRequest>;
export type ExpressionList = Expression[];
export const ExpressionList = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression).annotations({
    identifier: "Expression",
  }),
) as any as S.Schema<ExpressionList>;
export interface AddReservedInstanceAction {
  reservedInstancesOfferingId?: string;
  instanceCount?: number;
}
export const AddReservedInstanceAction = S.suspend(() =>
  S.Struct({
    reservedInstancesOfferingId: S.optional(S.String),
    instanceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "AddReservedInstanceAction",
}) as any as S.Schema<AddReservedInstanceAction>;
export interface AddSavingsPlanAction {
  savingsPlanOfferingId?: string;
  commitment?: number;
}
export const AddSavingsPlanAction = S.suspend(() =>
  S.Struct({
    savingsPlanOfferingId: S.optional(S.String),
    commitment: S.optional(S.Number),
  }),
).annotations({
  identifier: "AddSavingsPlanAction",
}) as any as S.Schema<AddSavingsPlanAction>;
export interface NegateReservedInstanceAction {
  reservedInstancesId?: string;
}
export const NegateReservedInstanceAction = S.suspend(() =>
  S.Struct({ reservedInstancesId: S.optional(S.String) }),
).annotations({
  identifier: "NegateReservedInstanceAction",
}) as any as S.Schema<NegateReservedInstanceAction>;
export interface NegateSavingsPlanAction {
  savingsPlanId?: string;
}
export const NegateSavingsPlanAction = S.suspend(() =>
  S.Struct({ savingsPlanId: S.optional(S.String) }),
).annotations({
  identifier: "NegateSavingsPlanAction",
}) as any as S.Schema<NegateSavingsPlanAction>;
export type BillScenarioCommitmentModificationAction =
  | { addReservedInstanceAction: AddReservedInstanceAction }
  | { addSavingsPlanAction: AddSavingsPlanAction }
  | { negateReservedInstanceAction: NegateReservedInstanceAction }
  | { negateSavingsPlanAction: NegateSavingsPlanAction };
export const BillScenarioCommitmentModificationAction = S.Union(
  S.Struct({ addReservedInstanceAction: AddReservedInstanceAction }),
  S.Struct({ addSavingsPlanAction: AddSavingsPlanAction }),
  S.Struct({ negateReservedInstanceAction: NegateReservedInstanceAction }),
  S.Struct({ negateSavingsPlanAction: NegateSavingsPlanAction }),
);
export interface BillEstimateInputCommitmentModificationSummary {
  id?: string;
  group?: string;
  usageAccountId?: string;
  commitmentAction?: (typeof BillScenarioCommitmentModificationAction)["Type"];
}
export const BillEstimateInputCommitmentModificationSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    group: S.optional(S.String),
    usageAccountId: S.optional(S.String),
    commitmentAction: S.optional(BillScenarioCommitmentModificationAction),
  }),
).annotations({
  identifier: "BillEstimateInputCommitmentModificationSummary",
}) as any as S.Schema<BillEstimateInputCommitmentModificationSummary>;
export type BillEstimateInputCommitmentModificationSummaries =
  BillEstimateInputCommitmentModificationSummary[];
export const BillEstimateInputCommitmentModificationSummaries = S.Array(
  BillEstimateInputCommitmentModificationSummary,
);
export interface BillScenarioCommitmentModificationItem {
  id?: string;
  usageAccountId?: string;
  group?: string;
  commitmentAction?: (typeof BillScenarioCommitmentModificationAction)["Type"];
}
export const BillScenarioCommitmentModificationItem = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    usageAccountId: S.optional(S.String),
    group: S.optional(S.String),
    commitmentAction: S.optional(BillScenarioCommitmentModificationAction),
  }),
).annotations({
  identifier: "BillScenarioCommitmentModificationItem",
}) as any as S.Schema<BillScenarioCommitmentModificationItem>;
export type BillScenarioCommitmentModificationItems =
  BillScenarioCommitmentModificationItem[];
export const BillScenarioCommitmentModificationItems = S.Array(
  BillScenarioCommitmentModificationItem,
);
export interface BatchDeleteBillScenarioCommitmentModificationError {
  id?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchDeleteBillScenarioCommitmentModificationError = S.suspend(
  () =>
    S.Struct({
      id: S.optional(S.String),
      errorCode: S.optional(S.String),
      errorMessage: S.optional(S.String),
    }),
).annotations({
  identifier: "BatchDeleteBillScenarioCommitmentModificationError",
}) as any as S.Schema<BatchDeleteBillScenarioCommitmentModificationError>;
export type BatchDeleteBillScenarioCommitmentModificationErrors =
  BatchDeleteBillScenarioCommitmentModificationError[];
export const BatchDeleteBillScenarioCommitmentModificationErrors = S.Array(
  BatchDeleteBillScenarioCommitmentModificationError,
);
export interface BatchDeleteBillScenarioUsageModificationError {
  id?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const BatchDeleteBillScenarioUsageModificationError = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDeleteBillScenarioUsageModificationError",
}) as any as S.Schema<BatchDeleteBillScenarioUsageModificationError>;
export type BatchDeleteBillScenarioUsageModificationErrors =
  BatchDeleteBillScenarioUsageModificationError[];
export const BatchDeleteBillScenarioUsageModificationErrors = S.Array(
  BatchDeleteBillScenarioUsageModificationError,
);
export interface BatchDeleteWorkloadEstimateUsageError {
  id?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const BatchDeleteWorkloadEstimateUsageError = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDeleteWorkloadEstimateUsageError",
}) as any as S.Schema<BatchDeleteWorkloadEstimateUsageError>;
export type BatchDeleteWorkloadEstimateUsageErrors =
  BatchDeleteWorkloadEstimateUsageError[];
export const BatchDeleteWorkloadEstimateUsageErrors = S.Array(
  BatchDeleteWorkloadEstimateUsageError,
);
export interface ListBillEstimateInputCommitmentModificationsResponse {
  items?: BillEstimateInputCommitmentModificationSummaries;
  nextToken?: string;
}
export const ListBillEstimateInputCommitmentModificationsResponse = S.suspend(
  () =>
    S.Struct({
      items: S.optional(BillEstimateInputCommitmentModificationSummaries),
      nextToken: S.optional(S.String),
    }),
).annotations({
  identifier: "ListBillEstimateInputCommitmentModificationsResponse",
}) as any as S.Schema<ListBillEstimateInputCommitmentModificationsResponse>;
export interface ListBillScenarioCommitmentModificationsResponse {
  items?: BillScenarioCommitmentModificationItems;
  nextToken?: string;
}
export const ListBillScenarioCommitmentModificationsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BillScenarioCommitmentModificationItems),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillScenarioCommitmentModificationsResponse",
}) as any as S.Schema<ListBillScenarioCommitmentModificationsResponse>;
export interface BatchDeleteBillScenarioCommitmentModificationResponse {
  errors?: BatchDeleteBillScenarioCommitmentModificationErrors;
}
export const BatchDeleteBillScenarioCommitmentModificationResponse = S.suspend(
  () =>
    S.Struct({
      errors: S.optional(BatchDeleteBillScenarioCommitmentModificationErrors),
    }),
).annotations({
  identifier: "BatchDeleteBillScenarioCommitmentModificationResponse",
}) as any as S.Schema<BatchDeleteBillScenarioCommitmentModificationResponse>;
export interface BatchDeleteBillScenarioUsageModificationResponse {
  errors?: BatchDeleteBillScenarioUsageModificationErrors;
}
export const BatchDeleteBillScenarioUsageModificationResponse = S.suspend(() =>
  S.Struct({
    errors: S.optional(BatchDeleteBillScenarioUsageModificationErrors),
  }),
).annotations({
  identifier: "BatchDeleteBillScenarioUsageModificationResponse",
}) as any as S.Schema<BatchDeleteBillScenarioUsageModificationResponse>;
export interface BatchDeleteWorkloadEstimateUsageResponse {
  errors?: BatchDeleteWorkloadEstimateUsageErrors;
}
export const BatchDeleteWorkloadEstimateUsageResponse = S.suspend(() =>
  S.Struct({ errors: S.optional(BatchDeleteWorkloadEstimateUsageErrors) }),
).annotations({
  identifier: "BatchDeleteWorkloadEstimateUsageResponse",
}) as any as S.Schema<BatchDeleteWorkloadEstimateUsageResponse>;
export type SavingsPlanArns = string[];
export const SavingsPlanArns = S.Array(S.String);
export interface UsageQuantity {
  startHour?: Date;
  unit?: string;
  amount?: number;
}
export const UsageQuantity = S.suspend(() =>
  S.Struct({
    startHour: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    unit: S.optional(S.String),
    amount: S.optional(S.Number),
  }),
).annotations({
  identifier: "UsageQuantity",
}) as any as S.Schema<UsageQuantity>;
export type UsageQuantities = UsageQuantity[];
export const UsageQuantities = S.Array(UsageQuantity);
export interface WorkloadEstimateUsageQuantity {
  unit?: string;
  amount?: number;
}
export const WorkloadEstimateUsageQuantity = S.suspend(() =>
  S.Struct({ unit: S.optional(S.String), amount: S.optional(S.Number) }),
).annotations({
  identifier: "WorkloadEstimateUsageQuantity",
}) as any as S.Schema<WorkloadEstimateUsageQuantity>;
export interface BillEstimateSummary {
  id: string;
  name?: string;
  status?: string;
  billInterval?: BillInterval;
  createdAt?: Date;
  expiresAt?: Date;
}
export const BillEstimateSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.optional(S.String),
    status: S.optional(S.String),
    billInterval: S.optional(BillInterval),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "BillEstimateSummary",
}) as any as S.Schema<BillEstimateSummary>;
export type BillEstimateSummaries = BillEstimateSummary[];
export const BillEstimateSummaries = S.Array(BillEstimateSummary);
export interface BillEstimateCommitmentSummary {
  id?: string;
  purchaseAgreementType?: string;
  offeringId?: string;
  usageAccountId?: string;
  region?: string;
  termLength?: string;
  paymentOption?: string;
  upfrontPayment?: CostAmount;
  monthlyPayment?: CostAmount;
}
export const BillEstimateCommitmentSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    purchaseAgreementType: S.optional(S.String),
    offeringId: S.optional(S.String),
    usageAccountId: S.optional(S.String),
    region: S.optional(S.String),
    termLength: S.optional(S.String),
    paymentOption: S.optional(S.String),
    upfrontPayment: S.optional(CostAmount),
    monthlyPayment: S.optional(CostAmount),
  }),
).annotations({
  identifier: "BillEstimateCommitmentSummary",
}) as any as S.Schema<BillEstimateCommitmentSummary>;
export type BillEstimateCommitmentSummaries = BillEstimateCommitmentSummary[];
export const BillEstimateCommitmentSummaries = S.Array(
  BillEstimateCommitmentSummary,
);
export interface BillEstimateInputUsageModificationSummary {
  serviceCode: string;
  usageType: string;
  operation: string;
  location?: string;
  availabilityZone?: string;
  id?: string;
  group?: string;
  usageAccountId?: string;
  quantities?: UsageQuantities;
  historicalUsage?: HistoricalUsageEntity;
}
export const BillEstimateInputUsageModificationSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BillEstimateInputUsageModificationSummary",
}) as any as S.Schema<BillEstimateInputUsageModificationSummary>;
export type BillEstimateInputUsageModificationSummaries =
  BillEstimateInputUsageModificationSummary[];
export const BillEstimateInputUsageModificationSummaries = S.Array(
  BillEstimateInputUsageModificationSummary,
);
export interface BillScenarioSummary {
  id: string;
  name?: string;
  billInterval?: BillInterval;
  status?: string;
  createdAt?: Date;
  expiresAt?: Date;
  failureMessage?: string;
  groupSharingPreference?: string;
  costCategoryGroupSharingPreferenceArn?: string;
}
export const BillScenarioSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.optional(S.String),
    billInterval: S.optional(BillInterval),
    status: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    failureMessage: S.optional(S.String),
    groupSharingPreference: S.optional(S.String),
    costCategoryGroupSharingPreferenceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "BillScenarioSummary",
}) as any as S.Schema<BillScenarioSummary>;
export type BillScenarioSummaries = BillScenarioSummary[];
export const BillScenarioSummaries = S.Array(BillScenarioSummary);
export interface BatchCreateBillScenarioCommitmentModificationEntry {
  key: string;
  group?: string;
  usageAccountId: string;
  commitmentAction: (typeof BillScenarioCommitmentModificationAction)["Type"];
}
export const BatchCreateBillScenarioCommitmentModificationEntry = S.suspend(
  () =>
    S.Struct({
      key: S.String,
      group: S.optional(S.String),
      usageAccountId: S.String,
      commitmentAction: BillScenarioCommitmentModificationAction,
    }),
).annotations({
  identifier: "BatchCreateBillScenarioCommitmentModificationEntry",
}) as any as S.Schema<BatchCreateBillScenarioCommitmentModificationEntry>;
export type BatchCreateBillScenarioCommitmentModificationEntries =
  BatchCreateBillScenarioCommitmentModificationEntry[];
export const BatchCreateBillScenarioCommitmentModificationEntries = S.Array(
  BatchCreateBillScenarioCommitmentModificationEntry,
);
export interface BatchUpdateBillScenarioCommitmentModificationError {
  id?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchUpdateBillScenarioCommitmentModificationError = S.suspend(
  () =>
    S.Struct({
      id: S.optional(S.String),
      errorCode: S.optional(S.String),
      errorMessage: S.optional(S.String),
    }),
).annotations({
  identifier: "BatchUpdateBillScenarioCommitmentModificationError",
}) as any as S.Schema<BatchUpdateBillScenarioCommitmentModificationError>;
export type BatchUpdateBillScenarioCommitmentModificationErrors =
  BatchUpdateBillScenarioCommitmentModificationError[];
export const BatchUpdateBillScenarioCommitmentModificationErrors = S.Array(
  BatchUpdateBillScenarioCommitmentModificationError,
);
export interface BillScenarioUsageModificationItem {
  serviceCode: string;
  usageType: string;
  operation: string;
  location?: string;
  availabilityZone?: string;
  id?: string;
  group?: string;
  usageAccountId?: string;
  quantities?: UsageQuantities;
  historicalUsage?: HistoricalUsageEntity;
}
export const BillScenarioUsageModificationItem = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BillScenarioUsageModificationItem",
}) as any as S.Schema<BillScenarioUsageModificationItem>;
export type BillScenarioUsageModificationItems =
  BillScenarioUsageModificationItem[];
export const BillScenarioUsageModificationItems = S.Array(
  BillScenarioUsageModificationItem,
);
export interface BatchUpdateBillScenarioUsageModificationError {
  id?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const BatchUpdateBillScenarioUsageModificationError = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchUpdateBillScenarioUsageModificationError",
}) as any as S.Schema<BatchUpdateBillScenarioUsageModificationError>;
export type BatchUpdateBillScenarioUsageModificationErrors =
  BatchUpdateBillScenarioUsageModificationError[];
export const BatchUpdateBillScenarioUsageModificationErrors = S.Array(
  BatchUpdateBillScenarioUsageModificationError,
);
export interface WorkloadEstimateSummary {
  id: string;
  name?: string;
  createdAt?: Date;
  expiresAt?: Date;
  rateType?: string;
  rateTimestamp?: Date;
  status?: string;
  totalCost?: number;
  costCurrency?: string;
  failureMessage?: string;
}
export const WorkloadEstimateSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "WorkloadEstimateSummary",
}) as any as S.Schema<WorkloadEstimateSummary>;
export type WorkloadEstimateSummaries = WorkloadEstimateSummary[];
export const WorkloadEstimateSummaries = S.Array(WorkloadEstimateSummary);
export interface WorkloadEstimateUsageItem {
  serviceCode: string;
  usageType: string;
  operation: string;
  location?: string;
  id?: string;
  usageAccountId?: string;
  group?: string;
  quantity?: WorkloadEstimateUsageQuantity;
  cost?: number;
  currency?: string;
  status?: string;
  historicalUsage?: HistoricalUsageEntity;
}
export const WorkloadEstimateUsageItem = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "WorkloadEstimateUsageItem",
}) as any as S.Schema<WorkloadEstimateUsageItem>;
export type WorkloadEstimateUsageItems = WorkloadEstimateUsageItem[];
export const WorkloadEstimateUsageItems = S.Array(WorkloadEstimateUsageItem);
export interface BatchCreateWorkloadEstimateUsageItem {
  serviceCode: string;
  usageType: string;
  operation: string;
  location?: string;
  id?: string;
  usageAccountId?: string;
  group?: string;
  quantity?: WorkloadEstimateUsageQuantity;
  cost?: number;
  currency?: string;
  status?: string;
  historicalUsage?: HistoricalUsageEntity;
  key?: string;
}
export const BatchCreateWorkloadEstimateUsageItem = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BatchCreateWorkloadEstimateUsageItem",
}) as any as S.Schema<BatchCreateWorkloadEstimateUsageItem>;
export type BatchCreateWorkloadEstimateUsageItems =
  BatchCreateWorkloadEstimateUsageItem[];
export const BatchCreateWorkloadEstimateUsageItems = S.Array(
  BatchCreateWorkloadEstimateUsageItem,
);
export interface BatchCreateWorkloadEstimateUsageError {
  key?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchCreateWorkloadEstimateUsageError = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateWorkloadEstimateUsageError",
}) as any as S.Schema<BatchCreateWorkloadEstimateUsageError>;
export type BatchCreateWorkloadEstimateUsageErrors =
  BatchCreateWorkloadEstimateUsageError[];
export const BatchCreateWorkloadEstimateUsageErrors = S.Array(
  BatchCreateWorkloadEstimateUsageError,
);
export interface BatchUpdateWorkloadEstimateUsageError {
  id?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const BatchUpdateWorkloadEstimateUsageError = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchUpdateWorkloadEstimateUsageError",
}) as any as S.Schema<BatchUpdateWorkloadEstimateUsageError>;
export type BatchUpdateWorkloadEstimateUsageErrors =
  BatchUpdateWorkloadEstimateUsageError[];
export const BatchUpdateWorkloadEstimateUsageErrors = S.Array(
  BatchUpdateWorkloadEstimateUsageError,
);
export interface CreateBillEstimateResponse {
  id: string;
  name?: string;
  status?: string;
  failureMessage?: string;
  billInterval?: BillInterval;
  costSummary?: BillEstimateCostSummary;
  createdAt?: Date;
  expiresAt?: Date;
  groupSharingPreference?: string;
  costCategoryGroupSharingPreferenceArn?: string;
  costCategoryGroupSharingPreferenceEffectiveDate?: Date;
}
export const CreateBillEstimateResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CreateBillEstimateResponse",
}) as any as S.Schema<CreateBillEstimateResponse>;
export interface ListBillEstimatesResponse {
  items?: BillEstimateSummaries;
  nextToken?: string;
}
export const ListBillEstimatesResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BillEstimateSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillEstimatesResponse",
}) as any as S.Schema<ListBillEstimatesResponse>;
export interface ListBillEstimateCommitmentsResponse {
  items?: BillEstimateCommitmentSummaries;
  nextToken?: string;
}
export const ListBillEstimateCommitmentsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BillEstimateCommitmentSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillEstimateCommitmentsResponse",
}) as any as S.Schema<ListBillEstimateCommitmentsResponse>;
export interface ListBillEstimateInputUsageModificationsResponse {
  items?: BillEstimateInputUsageModificationSummaries;
  nextToken?: string;
}
export const ListBillEstimateInputUsageModificationsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BillEstimateInputUsageModificationSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillEstimateInputUsageModificationsResponse",
}) as any as S.Schema<ListBillEstimateInputUsageModificationsResponse>;
export interface ListBillScenariosResponse {
  items?: BillScenarioSummaries;
  nextToken?: string;
}
export const ListBillScenariosResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BillScenarioSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillScenariosResponse",
}) as any as S.Schema<ListBillScenariosResponse>;
export interface BatchCreateBillScenarioCommitmentModificationRequest {
  billScenarioId: string;
  commitmentModifications: BatchCreateBillScenarioCommitmentModificationEntries;
  clientToken?: string;
}
export const BatchCreateBillScenarioCommitmentModificationRequest = S.suspend(
  () =>
    S.Struct({
      billScenarioId: S.String,
      commitmentModifications:
        BatchCreateBillScenarioCommitmentModificationEntries,
      clientToken: S.optional(S.String).pipe(
        T.HttpHeader("X-Amzn-Client-Token"),
      ),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "BatchCreateBillScenarioCommitmentModificationRequest",
}) as any as S.Schema<BatchCreateBillScenarioCommitmentModificationRequest>;
export interface BatchUpdateBillScenarioCommitmentModificationResponse {
  items?: BillScenarioCommitmentModificationItems;
  errors?: BatchUpdateBillScenarioCommitmentModificationErrors;
}
export const BatchUpdateBillScenarioCommitmentModificationResponse = S.suspend(
  () =>
    S.Struct({
      items: S.optional(BillScenarioCommitmentModificationItems),
      errors: S.optional(BatchUpdateBillScenarioCommitmentModificationErrors),
    }),
).annotations({
  identifier: "BatchUpdateBillScenarioCommitmentModificationResponse",
}) as any as S.Schema<BatchUpdateBillScenarioCommitmentModificationResponse>;
export interface ListBillScenarioUsageModificationsResponse {
  items?: BillScenarioUsageModificationItems;
  nextToken?: string;
}
export const ListBillScenarioUsageModificationsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BillScenarioUsageModificationItems),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillScenarioUsageModificationsResponse",
}) as any as S.Schema<ListBillScenarioUsageModificationsResponse>;
export interface BatchUpdateBillScenarioUsageModificationResponse {
  items?: BillScenarioUsageModificationItems;
  errors?: BatchUpdateBillScenarioUsageModificationErrors;
}
export const BatchUpdateBillScenarioUsageModificationResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BillScenarioUsageModificationItems),
    errors: S.optional(BatchUpdateBillScenarioUsageModificationErrors),
  }),
).annotations({
  identifier: "BatchUpdateBillScenarioUsageModificationResponse",
}) as any as S.Schema<BatchUpdateBillScenarioUsageModificationResponse>;
export interface ListWorkloadEstimatesResponse {
  items?: WorkloadEstimateSummaries;
  nextToken?: string;
}
export const ListWorkloadEstimatesResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(WorkloadEstimateSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadEstimatesResponse",
}) as any as S.Schema<ListWorkloadEstimatesResponse>;
export interface ListWorkloadEstimateUsageResponse {
  items?: WorkloadEstimateUsageItems;
  nextToken?: string;
}
export const ListWorkloadEstimateUsageResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(WorkloadEstimateUsageItems),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadEstimateUsageResponse",
}) as any as S.Schema<ListWorkloadEstimateUsageResponse>;
export interface BatchCreateWorkloadEstimateUsageResponse {
  items?: BatchCreateWorkloadEstimateUsageItems;
  errors?: BatchCreateWorkloadEstimateUsageErrors;
}
export const BatchCreateWorkloadEstimateUsageResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BatchCreateWorkloadEstimateUsageItems),
    errors: S.optional(BatchCreateWorkloadEstimateUsageErrors),
  }),
).annotations({
  identifier: "BatchCreateWorkloadEstimateUsageResponse",
}) as any as S.Schema<BatchCreateWorkloadEstimateUsageResponse>;
export interface BatchUpdateWorkloadEstimateUsageResponse {
  items?: WorkloadEstimateUsageItems;
  errors?: BatchUpdateWorkloadEstimateUsageErrors;
}
export const BatchUpdateWorkloadEstimateUsageResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(WorkloadEstimateUsageItems),
    errors: S.optional(BatchUpdateWorkloadEstimateUsageErrors),
  }),
).annotations({
  identifier: "BatchUpdateWorkloadEstimateUsageResponse",
}) as any as S.Schema<BatchUpdateWorkloadEstimateUsageResponse>;
export interface UsageQuantityResult {
  amount?: number;
  unit?: string;
}
export const UsageQuantityResult = S.suspend(() =>
  S.Struct({ amount: S.optional(S.Number), unit: S.optional(S.String) }),
).annotations({
  identifier: "UsageQuantityResult",
}) as any as S.Schema<UsageQuantityResult>;
export interface BillEstimateLineItemSummary {
  serviceCode: string;
  usageType: string;
  operation: string;
  location?: string;
  availabilityZone?: string;
  id?: string;
  lineItemId?: string;
  lineItemType?: string;
  payerAccountId?: string;
  usageAccountId?: string;
  estimatedUsageQuantity?: UsageQuantityResult;
  estimatedCost?: CostAmount;
  historicalUsageQuantity?: UsageQuantityResult;
  historicalCost?: CostAmount;
  savingsPlanArns?: SavingsPlanArns;
}
export const BillEstimateLineItemSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BillEstimateLineItemSummary",
}) as any as S.Schema<BillEstimateLineItemSummary>;
export type BillEstimateLineItemSummaries = BillEstimateLineItemSummary[];
export const BillEstimateLineItemSummaries = S.Array(
  BillEstimateLineItemSummary,
);
export interface BatchCreateBillScenarioUsageModificationEntry {
  serviceCode: string;
  usageType: string;
  operation: string;
  availabilityZone?: string;
  key: string;
  group?: string;
  usageAccountId: string;
  amounts?: UsageAmounts;
  historicalUsage?: HistoricalUsageEntity;
}
export const BatchCreateBillScenarioUsageModificationEntry = S.suspend(() =>
  S.Struct({
    serviceCode: S.String,
    usageType: S.String,
    operation: S.String,
    availabilityZone: S.optional(S.String),
    key: S.String,
    group: S.optional(S.String),
    usageAccountId: S.String,
    amounts: S.optional(UsageAmounts),
    historicalUsage: S.optional(HistoricalUsageEntity),
  }),
).annotations({
  identifier: "BatchCreateBillScenarioUsageModificationEntry",
}) as any as S.Schema<BatchCreateBillScenarioUsageModificationEntry>;
export type BatchCreateBillScenarioUsageModificationEntries =
  BatchCreateBillScenarioUsageModificationEntry[];
export const BatchCreateBillScenarioUsageModificationEntries = S.Array(
  BatchCreateBillScenarioUsageModificationEntry,
);
export interface ListBillEstimateLineItemsResponse {
  items?: BillEstimateLineItemSummaries;
  nextToken?: string;
}
export const ListBillEstimateLineItemsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BillEstimateLineItemSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillEstimateLineItemsResponse",
}) as any as S.Schema<ListBillEstimateLineItemsResponse>;
export interface BatchCreateBillScenarioUsageModificationRequest {
  billScenarioId: string;
  usageModifications: BatchCreateBillScenarioUsageModificationEntries;
  clientToken?: string;
}
export const BatchCreateBillScenarioUsageModificationRequest = S.suspend(() =>
  S.Struct({
    billScenarioId: S.String,
    usageModifications: BatchCreateBillScenarioUsageModificationEntries,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchCreateBillScenarioUsageModificationRequest",
}) as any as S.Schema<BatchCreateBillScenarioUsageModificationRequest>;
export interface BatchCreateBillScenarioCommitmentModificationItem {
  key?: string;
  id?: string;
  group?: string;
  usageAccountId?: string;
  commitmentAction?: (typeof BillScenarioCommitmentModificationAction)["Type"];
}
export const BatchCreateBillScenarioCommitmentModificationItem = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    id: S.optional(S.String),
    group: S.optional(S.String),
    usageAccountId: S.optional(S.String),
    commitmentAction: S.optional(BillScenarioCommitmentModificationAction),
  }),
).annotations({
  identifier: "BatchCreateBillScenarioCommitmentModificationItem",
}) as any as S.Schema<BatchCreateBillScenarioCommitmentModificationItem>;
export type BatchCreateBillScenarioCommitmentModificationItems =
  BatchCreateBillScenarioCommitmentModificationItem[];
export const BatchCreateBillScenarioCommitmentModificationItems = S.Array(
  BatchCreateBillScenarioCommitmentModificationItem,
);
export interface BatchCreateBillScenarioCommitmentModificationError {
  key?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const BatchCreateBillScenarioCommitmentModificationError = S.suspend(
  () =>
    S.Struct({
      key: S.optional(S.String),
      errorMessage: S.optional(S.String),
      errorCode: S.optional(S.String),
    }),
).annotations({
  identifier: "BatchCreateBillScenarioCommitmentModificationError",
}) as any as S.Schema<BatchCreateBillScenarioCommitmentModificationError>;
export type BatchCreateBillScenarioCommitmentModificationErrors =
  BatchCreateBillScenarioCommitmentModificationError[];
export const BatchCreateBillScenarioCommitmentModificationErrors = S.Array(
  BatchCreateBillScenarioCommitmentModificationError,
);
export interface BatchCreateBillScenarioCommitmentModificationResponse {
  items?: BatchCreateBillScenarioCommitmentModificationItems;
  errors?: BatchCreateBillScenarioCommitmentModificationErrors;
}
export const BatchCreateBillScenarioCommitmentModificationResponse = S.suspend(
  () =>
    S.Struct({
      items: S.optional(BatchCreateBillScenarioCommitmentModificationItems),
      errors: S.optional(BatchCreateBillScenarioCommitmentModificationErrors),
    }),
).annotations({
  identifier: "BatchCreateBillScenarioCommitmentModificationResponse",
}) as any as S.Schema<BatchCreateBillScenarioCommitmentModificationResponse>;
export interface BatchCreateBillScenarioUsageModificationItem {
  serviceCode: string;
  usageType: string;
  operation: string;
  location?: string;
  availabilityZone?: string;
  id?: string;
  group?: string;
  usageAccountId?: string;
  quantities?: UsageQuantities;
  historicalUsage?: HistoricalUsageEntity;
  key?: string;
}
export const BatchCreateBillScenarioUsageModificationItem = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BatchCreateBillScenarioUsageModificationItem",
}) as any as S.Schema<BatchCreateBillScenarioUsageModificationItem>;
export type BatchCreateBillScenarioUsageModificationItems =
  BatchCreateBillScenarioUsageModificationItem[];
export const BatchCreateBillScenarioUsageModificationItems = S.Array(
  BatchCreateBillScenarioUsageModificationItem,
);
export interface BatchCreateBillScenarioUsageModificationError {
  key?: string;
  errorMessage?: string;
  errorCode?: string;
}
export const BatchCreateBillScenarioUsageModificationError = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateBillScenarioUsageModificationError",
}) as any as S.Schema<BatchCreateBillScenarioUsageModificationError>;
export type BatchCreateBillScenarioUsageModificationErrors =
  BatchCreateBillScenarioUsageModificationError[];
export const BatchCreateBillScenarioUsageModificationErrors = S.Array(
  BatchCreateBillScenarioUsageModificationError,
);
export interface BatchCreateBillScenarioUsageModificationResponse {
  items?: BatchCreateBillScenarioUsageModificationItems;
  errors?: BatchCreateBillScenarioUsageModificationErrors;
}
export const BatchCreateBillScenarioUsageModificationResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(BatchCreateBillScenarioUsageModificationItems),
    errors: S.optional(BatchCreateBillScenarioUsageModificationErrors),
  }),
).annotations({
  identifier: "BatchCreateBillScenarioUsageModificationResponse",
}) as any as S.Schema<BatchCreateBillScenarioUsageModificationResponse>;

//# Errors
export class DataUnavailableException extends S.TaggedError<DataUnavailableException>()(
  "DataUnavailableException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
  T.AwsQueryError({ code: "ResourceNotFoundCode", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
  T.AwsQueryError({ code: "ConflictCode", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
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
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Retrieves the current preferences for Pricing Calculator.
 */
export const getPreferences: (
  input: GetPreferencesRequest,
) => Effect.Effect<
  GetPreferencesResponse,
  DataUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPreferencesRequest,
  output: GetPreferencesResponse,
  errors: [DataUnavailableException],
}));
/**
 * Removes one or more tags from a specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves details of a specific bill estimate.
 */
export const getBillEstimate: (
  input: GetBillEstimateRequest,
) => Effect.Effect<
  GetBillEstimateResponse,
  DataUnavailableException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBillEstimateRequest,
  output: GetBillEstimateResponse,
  errors: [DataUnavailableException, ResourceNotFoundException],
}));
/**
 * Deletes an existing bill estimate.
 */
export const deleteBillEstimate: (
  input: DeleteBillEstimateRequest,
) => Effect.Effect<
  DeleteBillEstimateResponse,
  ConflictException | DataUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBillEstimateRequest,
  output: DeleteBillEstimateResponse,
  errors: [ConflictException, DataUnavailableException],
}));
/**
 * Retrieves details of a specific bill scenario.
 */
export const getBillScenario: (
  input: GetBillScenarioRequest,
) => Effect.Effect<
  GetBillScenarioResponse,
  DataUnavailableException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBillScenarioRequest,
  output: GetBillScenarioResponse,
  errors: [DataUnavailableException, ResourceNotFoundException],
}));
/**
 * Updates an existing bill scenario.
 */
export const updateBillScenario: (
  input: UpdateBillScenarioRequest,
) => Effect.Effect<
  UpdateBillScenarioResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorkloadEstimate: (
  input: GetWorkloadEstimateRequest,
) => Effect.Effect<
  GetWorkloadEstimateResponse,
  DataUnavailableException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkloadEstimateRequest,
  output: GetWorkloadEstimateResponse,
  errors: [DataUnavailableException, ResourceNotFoundException],
}));
/**
 * Updates an existing workload estimate.
 */
export const updateWorkloadEstimate: (
  input: UpdateWorkloadEstimateRequest,
) => Effect.Effect<
  UpdateWorkloadEstimateResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkloadEstimateRequest,
  output: UpdateWorkloadEstimateResponse,
  errors: [
    ConflictException,
    DataUnavailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an existing workload estimate.
 */
export const deleteWorkloadEstimate: (
  input: DeleteWorkloadEstimateRequest,
) => Effect.Effect<
  DeleteWorkloadEstimateResponse,
  DataUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkloadEstimateRequest,
  output: DeleteWorkloadEstimateResponse,
  errors: [DataUnavailableException],
}));
/**
 * Lists all tags associated with a specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes an existing bill scenario.
 */
export const deleteBillScenario: (
  input: DeleteBillScenarioRequest,
) => Effect.Effect<
  DeleteBillScenarioResponse,
  ConflictException | DataUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBillScenarioRequest,
  output: DeleteBillScenarioResponse,
  errors: [ConflictException, DataUnavailableException],
}));
/**
 * Updates an existing bill estimate.
 */
export const updateBillEstimate: (
  input: UpdateBillEstimateRequest,
) => Effect.Effect<
  UpdateBillEstimateResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePreferences: (
  input: UpdatePreferencesRequest,
) => Effect.Effect<
  UpdatePreferencesResponse,
  DataUnavailableException | ServiceQuotaExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePreferencesRequest,
  output: UpdatePreferencesResponse,
  errors: [DataUnavailableException, ServiceQuotaExceededException],
}));
/**
 * Lists the input commitment modifications associated with a bill estimate.
 */
export const listBillEstimateInputCommitmentModifications: {
  (
    input: ListBillEstimateInputCommitmentModificationsRequest,
  ): Effect.Effect<
    ListBillEstimateInputCommitmentModificationsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillEstimateInputCommitmentModificationsRequest,
  ) => Stream.Stream<
    ListBillEstimateInputCommitmentModificationsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillEstimateInputCommitmentModificationsRequest,
  ) => Stream.Stream<
    BillEstimateInputCommitmentModificationSummary,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listBillScenarioCommitmentModifications: {
  (
    input: ListBillScenarioCommitmentModificationsRequest,
  ): Effect.Effect<
    ListBillScenarioCommitmentModificationsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillScenarioCommitmentModificationsRequest,
  ) => Stream.Stream<
    ListBillScenarioCommitmentModificationsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillScenarioCommitmentModificationsRequest,
  ) => Stream.Stream<
    BillScenarioCommitmentModificationItem,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const batchDeleteBillScenarioCommitmentModification: (
  input: BatchDeleteBillScenarioCommitmentModificationRequest,
) => Effect.Effect<
  BatchDeleteBillScenarioCommitmentModificationResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteBillScenarioUsageModification: (
  input: BatchDeleteBillScenarioUsageModificationRequest,
) => Effect.Effect<
  BatchDeleteBillScenarioUsageModificationResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteWorkloadEstimateUsage: (
  input: BatchDeleteWorkloadEstimateUsageRequest,
) => Effect.Effect<
  BatchDeleteWorkloadEstimateUsageResponse,
  | DataUnavailableException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBillScenario: (
  input: CreateBillScenarioRequest,
) => Effect.Effect<
  CreateBillScenarioResponse,
  | ConflictException
  | DataUnavailableException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWorkloadEstimate: (
  input: CreateWorkloadEstimateRequest,
) => Effect.Effect<
  CreateWorkloadEstimateResponse,
  | ConflictException
  | DataUnavailableException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkloadEstimateRequest,
  output: CreateWorkloadEstimateResponse,
  errors: [
    ConflictException,
    DataUnavailableException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Adds one or more tags to a specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | ServiceQuotaExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * Create a Bill estimate from a Bill scenario. In the Bill scenario you can model usage addition, usage changes, and usage removal. You can also model commitment addition and commitment removal. After all changes in a Bill scenario is made satisfactorily, you can call this API with a Bill scenario ID to generate the Bill estimate. Bill estimate calculates the pre-tax cost for your consolidated billing family, incorporating all modeled usage and commitments alongside existing usage and commitments from your most recent completed anniversary bill, with any applicable discounts applied.
 */
export const createBillEstimate: (
  input: CreateBillEstimateRequest,
) => Effect.Effect<
  CreateBillEstimateResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBillEstimates: {
  (
    input: ListBillEstimatesRequest,
  ): Effect.Effect<
    ListBillEstimatesResponse,
    DataUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillEstimatesRequest,
  ) => Stream.Stream<
    ListBillEstimatesResponse,
    DataUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillEstimatesRequest,
  ) => Stream.Stream<
    BillEstimateSummary,
    DataUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBillEstimatesRequest,
  output: ListBillEstimatesResponse,
  errors: [DataUnavailableException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the commitments associated with a bill estimate.
 */
export const listBillEstimateCommitments: {
  (
    input: ListBillEstimateCommitmentsRequest,
  ): Effect.Effect<
    ListBillEstimateCommitmentsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillEstimateCommitmentsRequest,
  ) => Stream.Stream<
    ListBillEstimateCommitmentsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillEstimateCommitmentsRequest,
  ) => Stream.Stream<
    BillEstimateCommitmentSummary,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listBillEstimateInputUsageModifications: {
  (
    input: ListBillEstimateInputUsageModificationsRequest,
  ): Effect.Effect<
    ListBillEstimateInputUsageModificationsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillEstimateInputUsageModificationsRequest,
  ) => Stream.Stream<
    ListBillEstimateInputUsageModificationsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillEstimateInputUsageModificationsRequest,
  ) => Stream.Stream<
    BillEstimateInputUsageModificationSummary,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listBillScenarios: {
  (
    input: ListBillScenariosRequest,
  ): Effect.Effect<
    ListBillScenariosResponse,
    DataUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillScenariosRequest,
  ) => Stream.Stream<
    ListBillScenariosResponse,
    DataUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillScenariosRequest,
  ) => Stream.Stream<
    BillScenarioSummary,
    DataUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBillScenariosRequest,
  output: ListBillScenariosResponse,
  errors: [DataUnavailableException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Update a newly added or existing commitment. You can update the commitment group based on a commitment ID and a Bill scenario ID.
 *
 * The `BatchUpdateBillScenarioCommitmentModification` operation doesn't have its own IAM permission. To authorize this operation for Amazon Web Services principals, include the permission `bcm-pricing-calculator:UpdateBillScenarioCommitmentModification` in your policies.
 */
export const batchUpdateBillScenarioCommitmentModification: (
  input: BatchUpdateBillScenarioCommitmentModificationRequest,
) => Effect.Effect<
  BatchUpdateBillScenarioCommitmentModificationResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBillScenarioUsageModifications: {
  (
    input: ListBillScenarioUsageModificationsRequest,
  ): Effect.Effect<
    ListBillScenarioUsageModificationsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillScenarioUsageModificationsRequest,
  ) => Stream.Stream<
    ListBillScenarioUsageModificationsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillScenarioUsageModificationsRequest,
  ) => Stream.Stream<
    BillScenarioUsageModificationItem,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const batchUpdateBillScenarioUsageModification: (
  input: BatchUpdateBillScenarioUsageModificationRequest,
) => Effect.Effect<
  BatchUpdateBillScenarioUsageModificationResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listWorkloadEstimates: {
  (
    input: ListWorkloadEstimatesRequest,
  ): Effect.Effect<
    ListWorkloadEstimatesResponse,
    DataUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkloadEstimatesRequest,
  ) => Stream.Stream<
    ListWorkloadEstimatesResponse,
    DataUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkloadEstimatesRequest,
  ) => Stream.Stream<
    WorkloadEstimateSummary,
    DataUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listWorkloadEstimateUsage: {
  (
    input: ListWorkloadEstimateUsageRequest,
  ): Effect.Effect<
    ListWorkloadEstimateUsageResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkloadEstimateUsageRequest,
  ) => Stream.Stream<
    ListWorkloadEstimateUsageResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkloadEstimateUsageRequest,
  ) => Stream.Stream<
    WorkloadEstimateUsageItem,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const batchCreateWorkloadEstimateUsage: (
  input: BatchCreateWorkloadEstimateUsageRequest,
) => Effect.Effect<
  BatchCreateWorkloadEstimateUsageResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchUpdateWorkloadEstimateUsage: (
  input: BatchUpdateWorkloadEstimateUsageRequest,
) => Effect.Effect<
  BatchUpdateWorkloadEstimateUsageResponse,
  | DataUnavailableException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBillEstimateLineItems: {
  (
    input: ListBillEstimateLineItemsRequest,
  ): Effect.Effect<
    ListBillEstimateLineItemsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillEstimateLineItemsRequest,
  ) => Stream.Stream<
    ListBillEstimateLineItemsResponse,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillEstimateLineItemsRequest,
  ) => Stream.Stream<
    BillEstimateLineItemSummary,
    DataUnavailableException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const batchCreateBillScenarioCommitmentModification: (
  input: BatchCreateBillScenarioCommitmentModificationRequest,
) => Effect.Effect<
  BatchCreateBillScenarioCommitmentModificationResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchCreateBillScenarioUsageModification: (
  input: BatchCreateBillScenarioUsageModificationRequest,
) => Effect.Effect<
  BatchCreateBillScenarioUsageModificationResponse,
  | ConflictException
  | DataUnavailableException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateBillScenarioUsageModificationRequest,
  output: BatchCreateBillScenarioUsageModificationResponse,
  errors: [
    ConflictException,
    DataUnavailableException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
