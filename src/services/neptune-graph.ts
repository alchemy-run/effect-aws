import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Neptune Graph",
  serviceShapeName: "AmazonNeptuneGraph",
});
const auth = T.AwsAuthSigv4({ name: "neptune-graph" });
const ver = T.ServiceVersion("2023-11-29");
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
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
    ApiType: {
      required: true,
      documentation:
        "Parameter to determine whether current API is a control plane or dataplane API",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "ApiType" }, "ControlPlane"],
                        },
                      ],
                      endpoint: {
                        url: "https://neptune-graph-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "ApiType" }, "DataPlane"],
                        },
                      ],
                      error:
                        "Invalid Configuration: fips endpoint is not supported for this API",
                      type: "error",
                    },
                    {
                      conditions: [],
                      error: "Invalid Configuration: Unknown ApiType",
                      type: "error",
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
                        true,
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "ApiType" }, "ControlPlane"],
                        },
                      ],
                      endpoint: {
                        url: "https://neptune-graph-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "ApiType" }, "DataPlane"],
                        },
                      ],
                      error:
                        "Invalid Configuration: fips endpoint is not supported for this API",
                      type: "error",
                    },
                    {
                      conditions: [],
                      error: "Invalid Configuration: Unknown ApiType",
                      type: "error",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "ApiType" }, "ControlPlane"],
                        },
                      ],
                      endpoint: {
                        url: "https://neptune-graph.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "ApiType" }, "DataPlane"],
                        },
                      ],
                      endpoint: {
                        url: "https://neptune-graph.{Region}.on.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      error: "Invalid Configuration: Unknown ApiType",
                      type: "error",
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
                {
                  fn: "stringEquals",
                  argv: [{ ref: "ApiType" }, "ControlPlane"],
                },
              ],
              endpoint: {
                url: "https://neptune-graph.{Region}.{PartitionResult#dnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                { fn: "stringEquals", argv: [{ ref: "ApiType" }, "DataPlane"] },
              ],
              endpoint: {
                url: "https://{Region}.neptune-graph.{PartitionResult#dnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              error: "Invalid Configuration: Unknown ApiType",
              type: "error",
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
export class CancelQueryInput extends S.Class<CancelQueryInput>(
  "CancelQueryInput",
)(
  {
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    queryId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/queries/{queryId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
  ),
) {}
export class CancelQueryResponse extends S.Class<CancelQueryResponse>(
  "CancelQueryResponse",
)({}) {}
export class GetGraphSummaryInput extends S.Class<GetGraphSummaryInput>(
  "GetGraphSummaryInput",
)(
  {
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    mode: S.optional(S.String).pipe(T.HttpQuery("mode")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/summary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
  ),
) {}
export class GetQueryInput extends S.Class<GetQueryInput>("GetQueryInput")(
  {
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    queryId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/queries/{queryId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
  ),
) {}
export class ListQueriesInput extends S.Class<ListQueriesInput>(
  "ListQueriesInput",
)(
  {
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
    state: S.optional(S.String).pipe(T.HttpQuery("state")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/queries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
  ),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export const DocumentValuedMap = S.Record({ key: S.String, value: S.Any });
export const TagMap = S.Record({ key: S.String, value: S.String });
export class ExecuteQueryInput extends S.Class<ExecuteQueryInput>(
  "ExecuteQueryInput",
)(
  {
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    queryString: S.String.pipe(T.JsonName("query")),
    language: S.String,
    parameters: S.optional(DocumentValuedMap),
    planCache: S.optional(S.String),
    explainMode: S.optional(S.String).pipe(T.JsonName("explain")),
    queryTimeoutMilliseconds: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/queries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
  ),
) {}
export class GetQueryOutput extends S.Class<GetQueryOutput>("GetQueryOutput")({
  id: S.optional(S.String),
  queryString: S.optional(S.String),
  waited: S.optional(S.Number),
  elapsed: S.optional(S.Number),
  state: S.optional(S.String),
}) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(TagMap) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export const NodeLabels = S.Array(S.String);
export const EdgeLabels = S.Array(S.String);
export class QuerySummary extends S.Class<QuerySummary>("QuerySummary")({
  id: S.optional(S.String),
  queryString: S.optional(S.String),
  waited: S.optional(S.Number),
  elapsed: S.optional(S.Number),
  state: S.optional(S.String),
}) {}
export const QuerySummaryList = S.Array(QuerySummary);
export const NodeProperties = S.Array(S.String);
export const OutgoingEdgeLabels = S.Array(S.String);
export const EdgeProperties = S.Array(S.String);
export class ExecuteQueryOutput extends S.Class<ExecuteQueryOutput>(
  "ExecuteQueryOutput",
)({ payload: T.StreamingOutput.pipe(T.HttpPayload()) }) {}
export class ListQueriesOutput extends S.Class<ListQueriesOutput>(
  "ListQueriesOutput",
)({ queries: QuerySummaryList }) {}
export const LongValuedMap = S.Record({ key: S.String, value: S.Number });
export const LongValuedMapList = S.Array(LongValuedMap);
export class NodeStructure extends S.Class<NodeStructure>("NodeStructure")({
  count: S.optional(S.Number),
  nodeProperties: S.optional(NodeProperties),
  distinctOutgoingEdgeLabels: S.optional(OutgoingEdgeLabels),
}) {}
export const NodeStructures = S.Array(NodeStructure);
export class EdgeStructure extends S.Class<EdgeStructure>("EdgeStructure")({
  count: S.optional(S.Number),
  edgeProperties: S.optional(EdgeProperties),
}) {}
export const EdgeStructures = S.Array(EdgeStructure);
export class GraphDataSummary extends S.Class<GraphDataSummary>(
  "GraphDataSummary",
)({
  numNodes: S.optional(S.Number),
  numEdges: S.optional(S.Number),
  numNodeLabels: S.optional(S.Number),
  numEdgeLabels: S.optional(S.Number),
  nodeLabels: S.optional(NodeLabels),
  edgeLabels: S.optional(EdgeLabels),
  numNodeProperties: S.optional(S.Number),
  numEdgeProperties: S.optional(S.Number),
  nodeProperties: S.optional(LongValuedMapList),
  edgeProperties: S.optional(LongValuedMapList),
  totalNodePropertyValues: S.optional(S.Number),
  totalEdgePropertyValues: S.optional(S.Number),
  nodeStructures: S.optional(NodeStructures),
  edgeStructures: S.optional(EdgeStructures),
}) {}
export class GetGraphSummaryOutput extends S.Class<GetGraphSummaryOutput>(
  "GetGraphSummaryOutput",
)({
  version: S.optional(S.String),
  lastStatisticsComputationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  graphSummary: S.optional(GraphDataSummary),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
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
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, reason: S.optional(S.String) },
) {}
export class UnprocessableException extends S.TaggedError<UnprocessableException>()(
  "UnprocessableException",
  { message: S.String, reason: S.String },
) {}

//# Operations
/**
 * Adds tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels a specified query.
 */
export const cancelQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelQueryInput,
  output: CancelQueryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the status of a specified query.
 *
 * When invoking this operation in a Neptune Analytics cluster, the IAM user or role making the request must have the `neptune-graph:GetQueryStatus` IAM action attached.
 */
export const getQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryInput,
  output: GetQueryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists active openCypher queries.
 */
export const listQueries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListQueriesInput,
  output: ListQueriesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists tags associated with a specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a graph summary for a property graph.
 */
export const getGraphSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGraphSummaryInput,
  output: GetGraphSummaryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Execute an openCypher query.
 *
 * When invoking this operation in a Neptune Analytics cluster, the IAM user or role making the request must have a policy attached that allows one of the following IAM actions in that cluster, depending on the query:
 *
 * - neptune-graph:ReadDataViaQuery
 *
 * - neptune-graph:WriteDataViaQuery
 *
 * - neptune-graph:DeleteDataViaQuery
 */
export const executeQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteQueryInput,
  output: ExecuteQueryOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    UnprocessableException,
    ValidationException,
  ],
}));
