import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Kendra Ranking",
  serviceShapeName: "AWSKendraRerankingFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "kendra-ranking" });
const ver = T.ServiceVersion("2022-10-19");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
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
                  fn: "booleanEquals",
                  argv: [
                    true,
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "supportsDualStack"],
                    },
                  ],
                },
              ],
              rules: [
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
                          endpoint: {
                            url: "https://kendra-ranking-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                  conditions: [],
                  endpoint: {
                    url: "https://kendra-ranking.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
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
                        url: "https://kendra-ranking-fips.{Region}.{PartitionResult#dnsSuffix}",
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
              conditions: [],
              endpoint: {
                url: "https://kendra-ranking.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class DeleteRescoreExecutionPlanRequest extends S.Class<DeleteRescoreExecutionPlanRequest>(
  "DeleteRescoreExecutionPlanRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/rescore-execution-plans/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRescoreExecutionPlanResponse extends S.Class<DeleteRescoreExecutionPlanResponse>(
  "DeleteRescoreExecutionPlanResponse",
)({}) {}
export class DescribeRescoreExecutionPlanRequest extends S.Class<DescribeRescoreExecutionPlanRequest>(
  "DescribeRescoreExecutionPlanRequest",
)(
  { Id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/rescore-execution-plans/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRescoreExecutionPlansRequest extends S.Class<ListRescoreExecutionPlansRequest>(
  "ListRescoreExecutionPlansRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/rescore-execution-plans" }),
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
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
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
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class CapacityUnitsConfiguration extends S.Class<CapacityUnitsConfiguration>(
  "CapacityUnitsConfiguration",
)({ RescoreCapacityUnits: S.Number }) {}
export class UpdateRescoreExecutionPlanRequest extends S.Class<UpdateRescoreExecutionPlanRequest>(
  "UpdateRescoreExecutionPlanRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CapacityUnits: S.optional(CapacityUnitsConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/rescore-execution-plans/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRescoreExecutionPlanResponse extends S.Class<UpdateRescoreExecutionPlanResponse>(
  "UpdateRescoreExecutionPlanResponse",
)({}) {}
export const TitleTokensList = S.Array(S.String);
export const BodyTokensList = S.Array(S.String);
export class Document extends S.Class<Document>("Document")({
  Id: S.String,
  GroupId: S.optional(S.String),
  Title: S.optional(S.String),
  Body: S.optional(S.String),
  TokenizedTitle: S.optional(TitleTokensList),
  TokenizedBody: S.optional(BodyTokensList),
  OriginalScore: S.Number,
}) {}
export const DocumentList = S.Array(Document);
export class CreateRescoreExecutionPlanRequest extends S.Class<CreateRescoreExecutionPlanRequest>(
  "CreateRescoreExecutionPlanRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    CapacityUnits: S.optional(CapacityUnitsConfiguration),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/rescore-execution-plans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRescoreExecutionPlanResponse extends S.Class<DescribeRescoreExecutionPlanResponse>(
  "DescribeRescoreExecutionPlanResponse",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CapacityUnits: S.optional(CapacityUnitsConfiguration),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class RescoreRequest extends S.Class<RescoreRequest>("RescoreRequest")(
  {
    RescoreExecutionPlanId: S.String.pipe(T.HttpLabel()),
    SearchQuery: S.String,
    Documents: DocumentList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/rescore-execution-plans/{RescoreExecutionPlanId}/rescore",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RescoreExecutionPlanSummary extends S.Class<RescoreExecutionPlanSummary>(
  "RescoreExecutionPlanSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
}) {}
export const RescoreExecutionPlanSummaryList = S.Array(
  RescoreExecutionPlanSummary,
);
export class CreateRescoreExecutionPlanResponse extends S.Class<CreateRescoreExecutionPlanResponse>(
  "CreateRescoreExecutionPlanResponse",
)({ Id: S.String, Arn: S.String }) {}
export class ListRescoreExecutionPlansResponse extends S.Class<ListRescoreExecutionPlansResponse>(
  "ListRescoreExecutionPlansResponse",
)({
  SummaryItems: S.optional(RescoreExecutionPlanSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class RescoreResultItem extends S.Class<RescoreResultItem>(
  "RescoreResultItem",
)({ DocumentId: S.optional(S.String), Score: S.optional(S.Number) }) {}
export const RescoreResultItemList = S.Array(RescoreResultItem);
export class RescoreResult extends S.Class<RescoreResult>("RescoreResult")({
  RescoreId: S.optional(S.String),
  ResultItems: S.optional(RescoreResultItemList),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}

//# Operations
/**
 * Adds a specified tag to a specified rescore execution
 * plan. A rescore execution plan is an Amazon Kendra
 * Intelligent Ranking resource used for provisioning the
 * `Rescore` API. If the tag already exists,
 * the existing value is replaced with the new value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a rescore execution plan. A rescore
 * execution plan is an Amazon Kendra Intelligent
 * Ranking resource used for provisioning the
 * `Rescore` operation.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a rescore execution plan. A rescore execution
 * plan is an Amazon Kendra Intelligent Ranking resource
 * used for provisioning the `Rescore` API. You set
 * the number of capacity units that you require for
 * Amazon Kendra Intelligent Ranking to rescore or re-rank
 * a search service's results.
 *
 * For an example of using the
 * `CreateRescoreExecutionPlan` API, including using
 * the Python and Java SDKs, see Semantically
 * ranking a search service's results.
 */
export const createRescoreExecutionPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRescoreExecutionPlanRequest,
    output: CreateRescoreExecutionPlanResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a rescore execution plan. A rescore execution
 * plan is an Amazon Kendra Intelligent Ranking resource
 * used for provisioning the `Rescore` API.
 */
export const deleteRescoreExecutionPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRescoreExecutionPlanRequest,
    output: DeleteRescoreExecutionPlanResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about a rescore execution plan. A rescore
 * execution plan is an Amazon Kendra Intelligent Ranking
 * resource used for provisioning the `Rescore` API.
 */
export const describeRescoreExecutionPlan =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRescoreExecutionPlanRequest,
    output: DescribeRescoreExecutionPlanResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists your rescore execution plans. A rescore execution plan
 * is an Amazon Kendra Intelligent Ranking resource used for
 * provisioning the `Rescore` API.
 */
export const listRescoreExecutionPlans = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRescoreExecutionPlansRequest,
    output: ListRescoreExecutionPlansResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a list of tags associated with a specified resource.
 * A rescore execution plan is an example of a resource that
 * can have tags associated with it.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a rescore execution plan. A rescore execution plan
 * is an Amazon Kendra Intelligent Ranking resource used for
 * provisioning the `Rescore` API. You can update the
 * number of capacity units you require for Amazon Kendra
 * Intelligent Ranking to rescore or re-rank a search service's
 * results.
 */
export const updateRescoreExecutionPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRescoreExecutionPlanRequest,
    output: UpdateRescoreExecutionPlanResponse,
    errors: [
      AccessDeniedException,
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
 * Rescores or re-ranks search results from a search service
 * such as OpenSearch (self managed). You use the semantic search
 * capabilities of Amazon Kendra Intelligent Ranking to
 * improve the search service's results.
 */
export const rescore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RescoreRequest,
  output: RescoreResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
