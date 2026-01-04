import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Billing",
  serviceShapeName: "AWSBilling",
});
const auth = T.AwsAuthSigv4({ name: "billing" });
const ver = T.ServiceVersion("2023-09-07");
const proto = T.AwsProtocolsAwsJson1_0();
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
                    url: "https://billing.us-east-1.api.aws",
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
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://billing.us-east-1.api.aws",
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
                            url: "https://billing-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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
                            url: "https://billing-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
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
                            url: "https://billing.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://billing.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
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
export const BillingViewSourceViewsList = S.Array(S.String);
export const BillingViewArnList = S.Array(S.String);
export const BillingViewTypeList = S.Array(S.String);
export const ResourceTagKeyList = S.Array(S.String);
export class AssociateSourceViewsRequest extends S.Class<AssociateSourceViewsRequest>(
  "AssociateSourceViewsRequest",
)(
  { arn: S.String, sourceViews: BillingViewSourceViewsList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBillingViewRequest extends S.Class<DeleteBillingViewRequest>(
  "DeleteBillingViewRequest",
)(
  { arn: S.String, force: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateSourceViewsRequest extends S.Class<DisassociateSourceViewsRequest>(
  "DisassociateSourceViewsRequest",
)(
  { arn: S.String, sourceViews: BillingViewSourceViewsList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBillingViewRequest extends S.Class<GetBillingViewRequest>(
  "GetBillingViewRequest",
)(
  { arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSourceViewsForBillingViewRequest extends S.Class<ListSourceViewsForBillingViewRequest>(
  "ListSourceViewsForBillingViewRequest",
)(
  {
    arn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  key: S.String,
  value: S.optional(S.String),
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, resourceTags: ResourceTagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, resourceTagKeys: ResourceTagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const Values = S.Array(S.String);
export class DimensionValues extends S.Class<DimensionValues>(
  "DimensionValues",
)({ key: S.String, values: Values }) {}
export class TagValues extends S.Class<TagValues>("TagValues")({
  key: S.String,
  values: Values,
}) {}
export class TimeRange extends S.Class<TimeRange>("TimeRange")({
  beginDateInclusive: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  endDateInclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Expression extends S.Class<Expression>("Expression")({
  dimensions: S.optional(DimensionValues),
  tags: S.optional(TagValues),
  timeRange: S.optional(TimeRange),
}) {}
export class UpdateBillingViewRequest extends S.Class<UpdateBillingViewRequest>(
  "UpdateBillingViewRequest",
)(
  {
    arn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    dataFilterExpression: S.optional(Expression),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ActiveTimeRange extends S.Class<ActiveTimeRange>(
  "ActiveTimeRange",
)({
  activeAfterInclusive: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  activeBeforeInclusive: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class StringSearch extends S.Class<StringSearch>("StringSearch")({
  searchOption: S.String,
  searchValue: S.String,
}) {}
export const StringSearches = S.Array(StringSearch);
export class AssociateSourceViewsResponse extends S.Class<AssociateSourceViewsResponse>(
  "AssociateSourceViewsResponse",
)({ arn: S.String }) {}
export class DeleteBillingViewResponse extends S.Class<DeleteBillingViewResponse>(
  "DeleteBillingViewResponse",
)({ arn: S.String }) {}
export class DisassociateSourceViewsResponse extends S.Class<DisassociateSourceViewsResponse>(
  "DisassociateSourceViewsResponse",
)({ arn: S.String }) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ resourceArn: S.String, policy: S.optional(S.String) }) {}
export class ListBillingViewsRequest extends S.Class<ListBillingViewsRequest>(
  "ListBillingViewsRequest",
)(
  {
    activeTimeRange: S.optional(ActiveTimeRange),
    arns: S.optional(BillingViewArnList),
    billingViewTypes: S.optional(BillingViewTypeList),
    names: S.optional(StringSearches),
    ownerAccountId: S.optional(S.String),
    sourceAccountId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSourceViewsForBillingViewResponse extends S.Class<ListSourceViewsForBillingViewResponse>(
  "ListSourceViewsForBillingViewResponse",
)({
  sourceViews: BillingViewSourceViewsList,
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ resourceTags: S.optional(ResourceTagList) }) {}
export class UpdateBillingViewResponse extends S.Class<UpdateBillingViewResponse>(
  "UpdateBillingViewResponse",
)({
  arn: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const BillingViewStatusReasons = S.Array(S.String);
export class CreateBillingViewRequest extends S.Class<CreateBillingViewRequest>(
  "CreateBillingViewRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    sourceViews: BillingViewSourceViewsList,
    dataFilterExpression: S.optional(Expression),
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Client-Token")),
    resourceTags: S.optional(ResourceTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BillingViewHealthStatus extends S.Class<BillingViewHealthStatus>(
  "BillingViewHealthStatus",
)({
  statusCode: S.optional(S.String),
  statusReasons: S.optional(BillingViewStatusReasons),
}) {}
export class BillingViewElement extends S.Class<BillingViewElement>(
  "BillingViewElement",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  billingViewType: S.optional(S.String),
  ownerAccountId: S.optional(S.String),
  sourceAccountId: S.optional(S.String),
  dataFilterExpression: S.optional(Expression),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  derivedViewCount: S.optional(S.Number),
  sourceViewCount: S.optional(S.Number),
  viewDefinitionLastUpdatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  healthStatus: S.optional(BillingViewHealthStatus),
}) {}
export class BillingViewListElement extends S.Class<BillingViewListElement>(
  "BillingViewListElement",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  ownerAccountId: S.optional(S.String),
  sourceAccountId: S.optional(S.String),
  billingViewType: S.optional(S.String),
  healthStatus: S.optional(BillingViewHealthStatus),
}) {}
export const BillingViewList = S.Array(BillingViewListElement);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class CreateBillingViewResponse extends S.Class<CreateBillingViewResponse>(
  "CreateBillingViewResponse",
)({
  arn: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetBillingViewResponse extends S.Class<GetBillingViewResponse>(
  "GetBillingViewResponse",
)({ billingView: BillingViewElement }) {}
export class ListBillingViewsResponse extends S.Class<ListBillingViewsResponse>(
  "ListBillingViewsResponse",
)({ billingViews: BillingViewList, nextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
  T.AwsQueryError({ code: "BillingAccessDenied", httpResponseCode: 403 }),
) {}
export class BillingViewHealthStatusException extends S.TaggedError<BillingViewHealthStatusException>()(
  "BillingViewHealthStatusException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
  T.AwsQueryError({ code: "BillingConflict", httpResponseCode: 409 }),
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
  T.AwsQueryError({ code: "BillingInternalServer", httpResponseCode: 500 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
  T.AwsQueryError({ code: "BillingResourceNotFound", httpResponseCode: 404 }),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
  T.AwsQueryError({ code: "BillingThrottling", httpResponseCode: 429 }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
  T.AwsQueryError({ code: "BillingValidation", httpResponseCode: 400 }),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
  T.AwsQueryError({
    code: "BillingServiceQuotaExceeded",
    httpResponseCode: 402,
  }),
) {}

//# Operations
/**
 * Lists tags associated with the billing view resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * An API operation for adding one or more tags (key-value pairs) to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from a resource. Specify only tag keys in your request. Don't specify the value.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates one or more source billing views with an existing billing view. This allows creating aggregate billing views that combine data from multiple sources.
 */
export const associateSourceViews = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateSourceViewsRequest,
    output: AssociateSourceViewsResponse,
    errors: [
      AccessDeniedException,
      BillingViewHealthStatusException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the specified billing view.
 */
export const deleteBillingView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBillingViewRequest,
  output: DeleteBillingViewResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the association between one or more source billing views and an existing billing view. This allows modifying the composition of aggregate billing views.
 */
export const disassociateSourceViews = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateSourceViewsRequest,
    output: DisassociateSourceViewsResponse,
    errors: [
      AccessDeniedException,
      BillingViewHealthStatusException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns the resource-based policy document attached to the resource in `JSON` format.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * An API to update the attributes of the billing view.
 */
export const updateBillingView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBillingViewRequest,
  output: UpdateBillingViewResponse,
  errors: [
    AccessDeniedException,
    BillingViewHealthStatusException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a billing view with the specified billing view attributes.
 */
export const createBillingView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBillingViewRequest,
  output: CreateBillingViewResponse,
  errors: [
    AccessDeniedException,
    BillingViewHealthStatusException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the metadata associated to the specified billing view ARN.
 */
export const getBillingView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBillingViewRequest,
  output: GetBillingViewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the billing views available for a given time period.
 *
 * Every Amazon Web Services account has a unique `PRIMARY` billing view that represents the billing data available by default. Accounts that use Billing Conductor also have `BILLING_GROUP` billing views representing pro forma costs associated with each created billing group.
 */
export const listBillingViews = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBillingViewsRequest,
  output: ListBillingViewsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the source views (managed Amazon Web Services billing views) associated with the billing view.
 */
export const listSourceViewsForBillingView =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSourceViewsForBillingViewRequest,
    output: ListSourceViewsForBillingViewResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
