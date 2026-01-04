import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "savingsplans",
  serviceShapeName: "AWSSavingsPlan",
});
const auth = T.AwsAuthSigv4({ name: "savingsplans" });
const ver = T.ServiceVersion("2019-06-28");
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
      conditions: [
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }] },
        { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
        { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
      ],
      rules: [
        {
          conditions: [
            { fn: "isSet", argv: [{ ref: "Region" }] },
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
              ],
              endpoint: {
                url: "https://savingsplans.global.api.aws",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "savingsplans",
                      signingRegion: "us-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "booleanEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "supportsDualStack"],
                    },
                    true,
                  ],
                },
              ],
              rules: [
                {
                  conditions: [],
                  endpoint: {
                    url: "https://savingsplans.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
          conditions: [
            { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Region" }] }] },
          ],
          endpoint: {
            url: "https://savingsplans.global.api.aws",
            properties: {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "savingsplans",
                  signingRegion: "us-east-1",
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, false] },
              ],
              endpoint: {
                url: "https://savingsplans.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "savingsplans",
                      signingRegion: "us-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
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
                        url: "https://savingsplans-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://savingsplans-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://savingsplans.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://savingsplans.{Region}.{PartitionResult#dnsSuffix}",
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
export const SavingsPlanArnList = S.Array(S.String);
export const SavingsPlanIdList = S.Array(S.String);
export const SavingsPlanStateList = S.Array(S.String);
export const UUIDs = S.Array(S.String);
export const SavingsPlanPaymentOptionList = S.Array(S.String);
export const SavingsPlanTypeList = S.Array(S.String);
export const SavingsPlanProductTypeList = S.Array(S.String);
export const SavingsPlanRateServiceCodeList = S.Array(S.String);
export const SavingsPlanRateUsageTypeList = S.Array(S.String);
export const SavingsPlanRateOperationList = S.Array(S.String);
export const DurationsList = S.Array(S.Number);
export const CurrencyList = S.Array(S.String);
export const SavingsPlanDescriptionsList = S.Array(S.String);
export const SavingsPlanServiceCodeList = S.Array(S.String);
export const SavingsPlanUsageTypeList = S.Array(S.String);
export const SavingsPlanOperationList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteQueuedSavingsPlanRequest extends S.Class<DeleteQueuedSavingsPlanRequest>(
  "DeleteQueuedSavingsPlanRequest",
)(
  { savingsPlanId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteQueuedSavingsPlan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueuedSavingsPlanResponse extends S.Class<DeleteQueuedSavingsPlanResponse>(
  "DeleteQueuedSavingsPlanResponse",
)({}) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ListTagsForResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReturnSavingsPlanRequest extends S.Class<ReturnSavingsPlanRequest>(
  "ReturnSavingsPlanRequest",
)(
  { savingsPlanId: S.String, clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ReturnSavingsPlan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagMap },
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
  { resourceArn: S.String, tagKeys: TagKeyList },
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
export const ListOfStrings = S.Array(S.String);
export const FilterValuesList = S.Array(S.String);
export class SavingsPlanRateFilter extends S.Class<SavingsPlanRateFilter>(
  "SavingsPlanRateFilter",
)({ name: S.optional(S.String), values: S.optional(ListOfStrings) }) {}
export const SavingsPlanRateFilterList = S.Array(SavingsPlanRateFilter);
export class SavingsPlanFilter extends S.Class<SavingsPlanFilter>(
  "SavingsPlanFilter",
)({ name: S.optional(S.String), values: S.optional(ListOfStrings) }) {}
export const SavingsPlanFilterList = S.Array(SavingsPlanFilter);
export class SavingsPlanOfferingRateFilterElement extends S.Class<SavingsPlanOfferingRateFilterElement>(
  "SavingsPlanOfferingRateFilterElement",
)({ name: S.optional(S.String), values: S.optional(FilterValuesList) }) {}
export const SavingsPlanOfferingRateFiltersList = S.Array(
  SavingsPlanOfferingRateFilterElement,
);
export class SavingsPlanOfferingFilterElement extends S.Class<SavingsPlanOfferingFilterElement>(
  "SavingsPlanOfferingFilterElement",
)({ name: S.optional(S.String), values: S.optional(FilterValuesList) }) {}
export const SavingsPlanOfferingFiltersList = S.Array(
  SavingsPlanOfferingFilterElement,
);
export class CreateSavingsPlanRequest extends S.Class<CreateSavingsPlanRequest>(
  "CreateSavingsPlanRequest",
)(
  {
    savingsPlanOfferingId: S.String,
    commitment: S.String,
    upfrontPaymentAmount: S.optional(S.String),
    purchaseTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateSavingsPlan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSavingsPlanRatesRequest extends S.Class<DescribeSavingsPlanRatesRequest>(
  "DescribeSavingsPlanRatesRequest",
)(
  {
    savingsPlanId: S.String,
    filters: S.optional(SavingsPlanRateFilterList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeSavingsPlanRates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSavingsPlansRequest extends S.Class<DescribeSavingsPlansRequest>(
  "DescribeSavingsPlansRequest",
)(
  {
    savingsPlanArns: S.optional(SavingsPlanArnList),
    savingsPlanIds: S.optional(SavingsPlanIdList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    states: S.optional(SavingsPlanStateList),
    filters: S.optional(SavingsPlanFilterList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeSavingsPlans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSavingsPlansOfferingRatesRequest extends S.Class<DescribeSavingsPlansOfferingRatesRequest>(
  "DescribeSavingsPlansOfferingRatesRequest",
)(
  {
    savingsPlanOfferingIds: S.optional(UUIDs),
    savingsPlanPaymentOptions: S.optional(SavingsPlanPaymentOptionList),
    savingsPlanTypes: S.optional(SavingsPlanTypeList),
    products: S.optional(SavingsPlanProductTypeList),
    serviceCodes: S.optional(SavingsPlanRateServiceCodeList),
    usageTypes: S.optional(SavingsPlanRateUsageTypeList),
    operations: S.optional(SavingsPlanRateOperationList),
    filters: S.optional(SavingsPlanOfferingRateFiltersList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeSavingsPlansOfferingRates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSavingsPlansOfferingsRequest extends S.Class<DescribeSavingsPlansOfferingsRequest>(
  "DescribeSavingsPlansOfferingsRequest",
)(
  {
    offeringIds: S.optional(UUIDs),
    paymentOptions: S.optional(SavingsPlanPaymentOptionList),
    productType: S.optional(S.String),
    planTypes: S.optional(SavingsPlanTypeList),
    durations: S.optional(DurationsList),
    currencies: S.optional(CurrencyList),
    descriptions: S.optional(SavingsPlanDescriptionsList),
    serviceCodes: S.optional(SavingsPlanServiceCodeList),
    usageTypes: S.optional(SavingsPlanUsageTypeList),
    operations: S.optional(SavingsPlanOperationList),
    filters: S.optional(SavingsPlanOfferingFiltersList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeSavingsPlansOfferings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class ReturnSavingsPlanResponse extends S.Class<ReturnSavingsPlanResponse>(
  "ReturnSavingsPlanResponse",
)({ savingsPlanId: S.optional(S.String) }) {}
export class CreateSavingsPlanResponse extends S.Class<CreateSavingsPlanResponse>(
  "CreateSavingsPlanResponse",
)({ savingsPlanId: S.optional(S.String) }) {}
export class SavingsPlan extends S.Class<SavingsPlan>("SavingsPlan")({
  offeringId: S.optional(S.String),
  savingsPlanId: S.optional(S.String),
  savingsPlanArn: S.optional(S.String),
  description: S.optional(S.String),
  start: S.optional(S.String),
  end: S.optional(S.String),
  state: S.optional(S.String),
  region: S.optional(S.String),
  ec2InstanceFamily: S.optional(S.String),
  savingsPlanType: S.optional(S.String),
  paymentOption: S.optional(S.String),
  productTypes: S.optional(SavingsPlanProductTypeList),
  currency: S.optional(S.String),
  commitment: S.optional(S.String),
  upfrontPaymentAmount: S.optional(S.String),
  recurringPaymentAmount: S.optional(S.String),
  termDurationInSeconds: S.optional(S.Number),
  tags: S.optional(TagMap),
  returnableUntil: S.optional(S.String),
}) {}
export const SavingsPlanList = S.Array(SavingsPlan);
export class DescribeSavingsPlansResponse extends S.Class<DescribeSavingsPlansResponse>(
  "DescribeSavingsPlansResponse",
)({
  savingsPlans: S.optional(SavingsPlanList),
  nextToken: S.optional(S.String),
}) {}
export class SavingsPlanRateProperty extends S.Class<SavingsPlanRateProperty>(
  "SavingsPlanRateProperty",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const SavingsPlanRatePropertyList = S.Array(SavingsPlanRateProperty);
export class ParentSavingsPlanOffering extends S.Class<ParentSavingsPlanOffering>(
  "ParentSavingsPlanOffering",
)({
  offeringId: S.optional(S.String),
  paymentOption: S.optional(S.String),
  planType: S.optional(S.String),
  durationSeconds: S.optional(S.Number),
  currency: S.optional(S.String),
  planDescription: S.optional(S.String),
}) {}
export class SavingsPlanOfferingRateProperty extends S.Class<SavingsPlanOfferingRateProperty>(
  "SavingsPlanOfferingRateProperty",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const SavingsPlanOfferingRatePropertyList = S.Array(
  SavingsPlanOfferingRateProperty,
);
export class SavingsPlanOfferingProperty extends S.Class<SavingsPlanOfferingProperty>(
  "SavingsPlanOfferingProperty",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const SavingsPlanOfferingPropertyList = S.Array(
  SavingsPlanOfferingProperty,
);
export class SavingsPlanRate extends S.Class<SavingsPlanRate>(
  "SavingsPlanRate",
)({
  rate: S.optional(S.String),
  currency: S.optional(S.String),
  unit: S.optional(S.String),
  productType: S.optional(S.String),
  serviceCode: S.optional(S.String),
  usageType: S.optional(S.String),
  operation: S.optional(S.String),
  properties: S.optional(SavingsPlanRatePropertyList),
}) {}
export const SavingsPlanRateList = S.Array(SavingsPlanRate);
export class SavingsPlanOfferingRate extends S.Class<SavingsPlanOfferingRate>(
  "SavingsPlanOfferingRate",
)({
  savingsPlanOffering: S.optional(ParentSavingsPlanOffering),
  rate: S.optional(S.String),
  unit: S.optional(S.String),
  productType: S.optional(S.String),
  serviceCode: S.optional(S.String),
  usageType: S.optional(S.String),
  operation: S.optional(S.String),
  properties: S.optional(SavingsPlanOfferingRatePropertyList),
}) {}
export const SavingsPlanOfferingRatesList = S.Array(SavingsPlanOfferingRate);
export class SavingsPlanOffering extends S.Class<SavingsPlanOffering>(
  "SavingsPlanOffering",
)({
  offeringId: S.optional(S.String),
  productTypes: S.optional(SavingsPlanProductTypeList),
  planType: S.optional(S.String),
  description: S.optional(S.String),
  paymentOption: S.optional(S.String),
  durationSeconds: S.optional(S.Number),
  currency: S.optional(S.String),
  serviceCode: S.optional(S.String),
  usageType: S.optional(S.String),
  operation: S.optional(S.String),
  properties: S.optional(SavingsPlanOfferingPropertyList),
}) {}
export const SavingsPlanOfferingsList = S.Array(SavingsPlanOffering);
export class DescribeSavingsPlanRatesResponse extends S.Class<DescribeSavingsPlanRatesResponse>(
  "DescribeSavingsPlanRatesResponse",
)({
  savingsPlanId: S.optional(S.String),
  searchResults: S.optional(SavingsPlanRateList),
  nextToken: S.optional(S.String),
}) {}
export class DescribeSavingsPlansOfferingRatesResponse extends S.Class<DescribeSavingsPlansOfferingRatesResponse>(
  "DescribeSavingsPlansOfferingRatesResponse",
)({
  searchResults: S.optional(SavingsPlanOfferingRatesList),
  nextToken: S.optional(S.String),
}) {}
export class DescribeSavingsPlansOfferingsResponse extends S.Class<DescribeSavingsPlansOfferingsResponse>(
  "DescribeSavingsPlansOfferingsResponse",
)({
  searchResults: S.optional(SavingsPlanOfferingsList),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
  T.AwsQueryError({ code: "InternalServerException", httpResponseCode: 500 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
  T.AwsQueryError({
    code: "ServiceQuotaExceededException",
    httpResponseCode: 402,
  }),
) {}

//# Operations
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the specified Savings Plan.
 */
export const returnSavingsPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReturnSavingsPlanRequest,
  output: ReturnSavingsPlanResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Adds the specified tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
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
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a Savings Plan.
 */
export const createSavingsPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSavingsPlanRequest,
  output: CreateSavingsPlanResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Deletes the queued purchase for the specified Savings Plan.
 */
export const deleteQueuedSavingsPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteQueuedSavingsPlanRequest,
    output: DeleteQueuedSavingsPlanResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Describes the specified Savings Plans.
 */
export const describeSavingsPlans = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSavingsPlansRequest,
    output: DescribeSavingsPlansResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Describes the rates for a specific, existing Savings Plan.
 */
export const describeSavingsPlanRates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSavingsPlanRatesRequest,
    output: DescribeSavingsPlanRatesResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Describes the offering rates for Savings Plans you might want to purchase.
 */
export const describeSavingsPlansOfferingRates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeSavingsPlansOfferingRatesRequest,
    output: DescribeSavingsPlansOfferingRatesResponse,
    errors: [InternalServerException, ValidationException],
  }));
/**
 * Describes the offerings for the specified Savings Plans.
 */
export const describeSavingsPlansOfferings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeSavingsPlansOfferingsRequest,
    output: DescribeSavingsPlansOfferingsResponse,
    errors: [InternalServerException, ValidationException],
  }));
