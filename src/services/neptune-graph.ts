import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class CancelQueryInput extends S.Class<CancelQueryInput>(
  "CancelQueryInput",
)(
  {
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
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
    queryId: S.String.pipe(T.HttpLabel("queryId")),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
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
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
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
export class DeleteGraphInput extends S.Class<DeleteGraphInput>(
  "DeleteGraphInput",
)(
  {
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    skipSnapshot: S.Boolean.pipe(T.HttpQuery("skipSnapshot")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/graphs/{graphIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class GetGraphInput extends S.Class<GetGraphInput>("GetGraphInput")(
  { graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/graphs/{graphIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class ListGraphsInput extends S.Class<ListGraphsInput>(
  "ListGraphsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/graphs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class ResetGraphInput extends S.Class<ResetGraphInput>(
  "ResetGraphInput",
)(
  {
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    skipSnapshot: S.Boolean,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/graphs/{graphIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class RestoreGraphFromSnapshotInput extends S.Class<RestoreGraphFromSnapshotInput>(
  "RestoreGraphFromSnapshotInput",
)(
  {
    snapshotIdentifier: S.String.pipe(T.HttpLabel("snapshotIdentifier")),
    graphName: S.String,
    provisionedMemory: S.optional(S.Number),
    deletionProtection: S.optional(S.Boolean),
    tags: S.optional(TagMap),
    replicaCount: S.optional(S.Number),
    publicConnectivity: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/snapshots/{snapshotIdentifier}/restore" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class StartGraphInput extends S.Class<StartGraphInput>(
  "StartGraphInput",
)(
  { graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")) },
  T.all(
    T.Http({ method: "POST", uri: "/graphs/{graphIdentifier}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class StopGraphInput extends S.Class<StopGraphInput>("StopGraphInput")(
  { graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")) },
  T.all(
    T.Http({ method: "POST", uri: "/graphs/{graphIdentifier}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class UpdateGraphInput extends S.Class<UpdateGraphInput>(
  "UpdateGraphInput",
)(
  {
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    publicConnectivity: S.optional(S.Boolean),
    provisionedMemory: S.optional(S.Number),
    deletionProtection: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/graphs/{graphIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class CreatePrivateGraphEndpointInput extends S.Class<CreatePrivateGraphEndpointInput>(
  "CreatePrivateGraphEndpointInput",
)(
  {
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    vpcId: S.optional(S.String),
    subnetIds: S.optional(SubnetIds),
    vpcSecurityGroupIds: S.optional(SecurityGroupIds),
  },
  T.all(
    T.Http({ method: "POST", uri: "/graphs/{graphIdentifier}/endpoints/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class DeletePrivateGraphEndpointInput extends S.Class<DeletePrivateGraphEndpointInput>(
  "DeletePrivateGraphEndpointInput",
)(
  {
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    vpcId: S.String.pipe(T.HttpLabel("vpcId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/graphs/{graphIdentifier}/endpoints/{vpcId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class GetPrivateGraphEndpointInput extends S.Class<GetPrivateGraphEndpointInput>(
  "GetPrivateGraphEndpointInput",
)(
  {
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    vpcId: S.String.pipe(T.HttpLabel("vpcId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/graphs/{graphIdentifier}/endpoints/{vpcId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class ListPrivateGraphEndpointsInput extends S.Class<ListPrivateGraphEndpointsInput>(
  "ListPrivateGraphEndpointsInput",
)(
  {
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/graphs/{graphIdentifier}/endpoints/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class CreateGraphSnapshotInput extends S.Class<CreateGraphSnapshotInput>(
  "CreateGraphSnapshotInput",
)(
  {
    graphIdentifier: S.String,
    snapshotName: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/snapshots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class DeleteGraphSnapshotInput extends S.Class<DeleteGraphSnapshotInput>(
  "DeleteGraphSnapshotInput",
)(
  { snapshotIdentifier: S.String.pipe(T.HttpLabel("snapshotIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/snapshots/{snapshotIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class GetGraphSnapshotInput extends S.Class<GetGraphSnapshotInput>(
  "GetGraphSnapshotInput",
)(
  { snapshotIdentifier: S.String.pipe(T.HttpLabel("snapshotIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/snapshots/{snapshotIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class ListGraphSnapshotsInput extends S.Class<ListGraphSnapshotsInput>(
  "ListGraphSnapshotsInput",
)(
  {
    graphIdentifier: S.optional(S.String).pipe(T.HttpQuery("graphIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/snapshots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class CancelExportTaskInput extends S.Class<CancelExportTaskInput>(
  "CancelExportTaskInput",
)(
  { taskIdentifier: S.String.pipe(T.HttpLabel("taskIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/exporttasks/{taskIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class CancelImportTaskInput extends S.Class<CancelImportTaskInput>(
  "CancelImportTaskInput",
)(
  { taskIdentifier: S.String.pipe(T.HttpLabel("taskIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/importtasks/{taskIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class GetExportTaskInput extends S.Class<GetExportTaskInput>(
  "GetExportTaskInput",
)(
  { taskIdentifier: S.String.pipe(T.HttpLabel("taskIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/exporttasks/{taskIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class GetImportTaskInput extends S.Class<GetImportTaskInput>(
  "GetImportTaskInput",
)(
  { taskIdentifier: S.String.pipe(T.HttpLabel("taskIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/importtasks/{taskIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class ListExportTasksInput extends S.Class<ListExportTasksInput>(
  "ListExportTasksInput",
)(
  {
    graphIdentifier: S.optional(S.String).pipe(T.HttpQuery("graphIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/exporttasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class ListImportTasksInput extends S.Class<ListImportTasksInput>(
  "ListImportTasksInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/importtasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class NeptuneImportOptions extends S.Class<NeptuneImportOptions>(
  "NeptuneImportOptions",
)({
  s3ExportPath: S.String,
  s3ExportKmsKeyId: S.String,
  preserveDefaultVertexLabels: S.optional(S.Boolean),
  preserveEdgeIds: S.optional(S.Boolean),
}) {}
export const ImportOptions = S.Union(
  S.Struct({ neptune: NeptuneImportOptions }),
);
export class StartImportTaskInput extends S.Class<StartImportTaskInput>(
  "StartImportTaskInput",
)(
  {
    importOptions: S.optional(ImportOptions),
    failOnError: S.optional(S.Boolean),
    source: S.String,
    format: S.optional(S.String),
    parquetType: S.optional(S.String),
    blankNodeHandling: S.optional(S.String),
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    roleArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/graphs/{graphIdentifier}/importtasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export const DocumentValuedMap = S.Record({ key: S.String, value: S.Any });
export class VectorSearchConfiguration extends S.Class<VectorSearchConfiguration>(
  "VectorSearchConfiguration",
)({ dimension: S.Number }) {}
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
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
export class CreateGraphInput extends S.Class<CreateGraphInput>(
  "CreateGraphInput",
)(
  {
    graphName: S.String,
    tags: S.optional(TagMap),
    publicConnectivity: S.optional(S.Boolean),
    kmsKeyIdentifier: S.optional(S.String),
    vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
    replicaCount: S.optional(S.Number),
    deletionProtection: S.optional(S.Boolean),
    provisionedMemory: S.Number,
  },
  T.all(
    T.Http({ method: "POST", uri: "/graphs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class DeleteGraphOutput extends S.Class<DeleteGraphOutput>(
  "DeleteGraphOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  provisionedMemory: S.optional(S.Number),
  endpoint: S.optional(S.String),
  publicConnectivity: S.optional(S.Boolean),
  vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
  replicaCount: S.optional(S.Number),
  kmsKeyIdentifier: S.optional(S.String),
  sourceSnapshotId: S.optional(S.String),
  deletionProtection: S.optional(S.Boolean),
  buildNumber: S.optional(S.String),
}) {}
export class GetGraphOutput extends S.Class<GetGraphOutput>("GetGraphOutput")({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  provisionedMemory: S.optional(S.Number),
  endpoint: S.optional(S.String),
  publicConnectivity: S.optional(S.Boolean),
  vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
  replicaCount: S.optional(S.Number),
  kmsKeyIdentifier: S.optional(S.String),
  sourceSnapshotId: S.optional(S.String),
  deletionProtection: S.optional(S.Boolean),
  buildNumber: S.optional(S.String),
}) {}
export class ResetGraphOutput extends S.Class<ResetGraphOutput>(
  "ResetGraphOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  provisionedMemory: S.optional(S.Number),
  endpoint: S.optional(S.String),
  publicConnectivity: S.optional(S.Boolean),
  vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
  replicaCount: S.optional(S.Number),
  kmsKeyIdentifier: S.optional(S.String),
  sourceSnapshotId: S.optional(S.String),
  deletionProtection: S.optional(S.Boolean),
  buildNumber: S.optional(S.String),
}) {}
export class RestoreGraphFromSnapshotOutput extends S.Class<RestoreGraphFromSnapshotOutput>(
  "RestoreGraphFromSnapshotOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  provisionedMemory: S.optional(S.Number),
  endpoint: S.optional(S.String),
  publicConnectivity: S.optional(S.Boolean),
  vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
  replicaCount: S.optional(S.Number),
  kmsKeyIdentifier: S.optional(S.String),
  sourceSnapshotId: S.optional(S.String),
  deletionProtection: S.optional(S.Boolean),
  buildNumber: S.optional(S.String),
}) {}
export class StartGraphOutput extends S.Class<StartGraphOutput>(
  "StartGraphOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  provisionedMemory: S.optional(S.Number),
  endpoint: S.optional(S.String),
  publicConnectivity: S.optional(S.Boolean),
  vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
  replicaCount: S.optional(S.Number),
  kmsKeyIdentifier: S.optional(S.String),
  sourceSnapshotId: S.optional(S.String),
  deletionProtection: S.optional(S.Boolean),
  buildNumber: S.optional(S.String),
}) {}
export class StopGraphOutput extends S.Class<StopGraphOutput>(
  "StopGraphOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  provisionedMemory: S.optional(S.Number),
  endpoint: S.optional(S.String),
  publicConnectivity: S.optional(S.Boolean),
  vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
  replicaCount: S.optional(S.Number),
  kmsKeyIdentifier: S.optional(S.String),
  sourceSnapshotId: S.optional(S.String),
  deletionProtection: S.optional(S.Boolean),
  buildNumber: S.optional(S.String),
}) {}
export class UpdateGraphOutput extends S.Class<UpdateGraphOutput>(
  "UpdateGraphOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  provisionedMemory: S.optional(S.Number),
  endpoint: S.optional(S.String),
  publicConnectivity: S.optional(S.Boolean),
  vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
  replicaCount: S.optional(S.Number),
  kmsKeyIdentifier: S.optional(S.String),
  sourceSnapshotId: S.optional(S.String),
  deletionProtection: S.optional(S.Boolean),
  buildNumber: S.optional(S.String),
}) {}
export class CreatePrivateGraphEndpointOutput extends S.Class<CreatePrivateGraphEndpointOutput>(
  "CreatePrivateGraphEndpointOutput",
)({
  vpcId: S.String,
  subnetIds: SubnetIds,
  status: S.String,
  vpcEndpointId: S.optional(S.String),
}) {}
export class DeletePrivateGraphEndpointOutput extends S.Class<DeletePrivateGraphEndpointOutput>(
  "DeletePrivateGraphEndpointOutput",
)({
  vpcId: S.String,
  subnetIds: SubnetIds,
  status: S.String,
  vpcEndpointId: S.optional(S.String),
}) {}
export class GetPrivateGraphEndpointOutput extends S.Class<GetPrivateGraphEndpointOutput>(
  "GetPrivateGraphEndpointOutput",
)({
  vpcId: S.String,
  subnetIds: SubnetIds,
  status: S.String,
  vpcEndpointId: S.optional(S.String),
}) {}
export class CreateGraphSnapshotOutput extends S.Class<CreateGraphSnapshotOutput>(
  "CreateGraphSnapshotOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  sourceGraphId: S.optional(S.String),
  snapshotCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  kmsKeyIdentifier: S.optional(S.String),
}) {}
export class DeleteGraphSnapshotOutput extends S.Class<DeleteGraphSnapshotOutput>(
  "DeleteGraphSnapshotOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  sourceGraphId: S.optional(S.String),
  snapshotCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  kmsKeyIdentifier: S.optional(S.String),
}) {}
export class GetGraphSnapshotOutput extends S.Class<GetGraphSnapshotOutput>(
  "GetGraphSnapshotOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  sourceGraphId: S.optional(S.String),
  snapshotCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  kmsKeyIdentifier: S.optional(S.String),
}) {}
export class CancelExportTaskOutput extends S.Class<CancelExportTaskOutput>(
  "CancelExportTaskOutput",
)({
  graphId: S.String,
  roleArn: S.String,
  taskId: S.String,
  status: S.String,
  format: S.String,
  destination: S.String,
  kmsKeyIdentifier: S.String,
  parquetType: S.optional(S.String),
  statusReason: S.optional(S.String),
}) {}
export class CancelImportTaskOutput extends S.Class<CancelImportTaskOutput>(
  "CancelImportTaskOutput",
)({
  graphId: S.optional(S.String),
  taskId: S.String,
  source: S.String,
  format: S.optional(S.String),
  parquetType: S.optional(S.String),
  roleArn: S.String,
  status: S.String,
}) {}
export class StartImportTaskOutput extends S.Class<StartImportTaskOutput>(
  "StartImportTaskOutput",
)({
  graphId: S.optional(S.String),
  taskId: S.String,
  source: S.String,
  format: S.optional(S.String),
  parquetType: S.optional(S.String),
  roleArn: S.String,
  status: S.String,
  importOptions: S.optional(ImportOptions),
}) {}
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
export class GraphSummary extends S.Class<GraphSummary>("GraphSummary")({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  provisionedMemory: S.optional(S.Number),
  publicConnectivity: S.optional(S.Boolean),
  endpoint: S.optional(S.String),
  replicaCount: S.optional(S.Number),
  kmsKeyIdentifier: S.optional(S.String),
  deletionProtection: S.optional(S.Boolean),
}) {}
export const GraphSummaryList = S.Array(GraphSummary);
export class PrivateGraphEndpointSummary extends S.Class<PrivateGraphEndpointSummary>(
  "PrivateGraphEndpointSummary",
)({
  vpcId: S.String,
  subnetIds: SubnetIds,
  status: S.String,
  vpcEndpointId: S.optional(S.String),
}) {}
export const PrivateGraphEndpointSummaryList = S.Array(
  PrivateGraphEndpointSummary,
);
export class GraphSnapshotSummary extends S.Class<GraphSnapshotSummary>(
  "GraphSnapshotSummary",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  sourceGraphId: S.optional(S.String),
  snapshotCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  kmsKeyIdentifier: S.optional(S.String),
}) {}
export const GraphSnapshotSummaryList = S.Array(GraphSnapshotSummary);
export class ExportTaskDetails extends S.Class<ExportTaskDetails>(
  "ExportTaskDetails",
)({
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  timeElapsedSeconds: S.Number,
  progressPercentage: S.Number,
  numVerticesWritten: S.optional(S.Number),
  numEdgesWritten: S.optional(S.Number),
}) {}
export class ImportTaskDetails extends S.Class<ImportTaskDetails>(
  "ImportTaskDetails",
)({
  status: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  timeElapsedSeconds: S.Number,
  progressPercentage: S.Number,
  errorCount: S.Number,
  errorDetails: S.optional(S.String),
  statementCount: S.Number,
  dictionaryEntryCount: S.Number,
}) {}
export class ExportTaskSummary extends S.Class<ExportTaskSummary>(
  "ExportTaskSummary",
)({
  graphId: S.String,
  roleArn: S.String,
  taskId: S.String,
  status: S.String,
  format: S.String,
  destination: S.String,
  kmsKeyIdentifier: S.String,
  parquetType: S.optional(S.String),
  statusReason: S.optional(S.String),
}) {}
export const ExportTaskSummaryList = S.Array(ExportTaskSummary);
export class ImportTaskSummary extends S.Class<ImportTaskSummary>(
  "ImportTaskSummary",
)({
  graphId: S.optional(S.String),
  taskId: S.String,
  source: S.String,
  format: S.optional(S.String),
  parquetType: S.optional(S.String),
  roleArn: S.String,
  status: S.String,
}) {}
export const ImportTaskSummaryList = S.Array(ImportTaskSummary);
export const NodeProperties = S.Array(S.String);
export const OutgoingEdgeLabels = S.Array(S.String);
export const EdgeProperties = S.Array(S.String);
export class ExecuteQueryOutput extends S.Class<ExecuteQueryOutput>(
  "ExecuteQueryOutput",
)({ payload: T.StreamingOutput.pipe(T.HttpPayload()) }) {}
export class ListQueriesOutput extends S.Class<ListQueriesOutput>(
  "ListQueriesOutput",
)({ queries: QuerySummaryList }) {}
export class CreateGraphOutput extends S.Class<CreateGraphOutput>(
  "CreateGraphOutput",
)({
  id: S.String,
  name: S.String,
  arn: S.String,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  provisionedMemory: S.optional(S.Number),
  endpoint: S.optional(S.String),
  publicConnectivity: S.optional(S.Boolean),
  vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
  replicaCount: S.optional(S.Number),
  kmsKeyIdentifier: S.optional(S.String),
  sourceSnapshotId: S.optional(S.String),
  deletionProtection: S.optional(S.Boolean),
  buildNumber: S.optional(S.String),
}) {}
export class ListGraphsOutput extends S.Class<ListGraphsOutput>(
  "ListGraphsOutput",
)({ graphs: GraphSummaryList, nextToken: S.optional(S.String) }) {}
export class ListPrivateGraphEndpointsOutput extends S.Class<ListPrivateGraphEndpointsOutput>(
  "ListPrivateGraphEndpointsOutput",
)({
  privateGraphEndpoints: PrivateGraphEndpointSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListGraphSnapshotsOutput extends S.Class<ListGraphSnapshotsOutput>(
  "ListGraphSnapshotsOutput",
)({
  graphSnapshots: GraphSnapshotSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateGraphUsingImportTaskInput extends S.Class<CreateGraphUsingImportTaskInput>(
  "CreateGraphUsingImportTaskInput",
)(
  {
    graphName: S.String,
    tags: S.optional(TagMap),
    publicConnectivity: S.optional(S.Boolean),
    kmsKeyIdentifier: S.optional(S.String),
    vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
    replicaCount: S.optional(S.Number),
    deletionProtection: S.optional(S.Boolean),
    importOptions: S.optional(ImportOptions),
    maxProvisionedMemory: S.optional(S.Number),
    minProvisionedMemory: S.optional(S.Number),
    failOnError: S.optional(S.Boolean),
    source: S.String,
    format: S.optional(S.String),
    parquetType: S.optional(S.String),
    blankNodeHandling: S.optional(S.String),
    roleArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/importtasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class ExportFilterPropertyAttributes extends S.Class<ExportFilterPropertyAttributes>(
  "ExportFilterPropertyAttributes",
)({
  outputType: S.optional(S.String),
  sourcePropertyName: S.optional(S.String),
  multiValueHandling: S.optional(S.String),
}) {}
export const ExportFilterPropertyMap = S.Record({
  key: S.String,
  value: ExportFilterPropertyAttributes,
});
export class ExportFilterElement extends S.Class<ExportFilterElement>(
  "ExportFilterElement",
)({ properties: S.optional(ExportFilterPropertyMap) }) {}
export const ExportFilterPerLabelMap = S.Record({
  key: S.String,
  value: ExportFilterElement,
});
export class ExportFilter extends S.Class<ExportFilter>("ExportFilter")({
  vertexFilter: S.optional(ExportFilterPerLabelMap),
  edgeFilter: S.optional(ExportFilterPerLabelMap),
}) {}
export class GetExportTaskOutput extends S.Class<GetExportTaskOutput>(
  "GetExportTaskOutput",
)({
  graphId: S.String,
  roleArn: S.String,
  taskId: S.String,
  status: S.String,
  format: S.String,
  destination: S.String,
  kmsKeyIdentifier: S.String,
  parquetType: S.optional(S.String),
  statusReason: S.optional(S.String),
  exportTaskDetails: S.optional(ExportTaskDetails),
  exportFilter: S.optional(ExportFilter),
}) {}
export class GetImportTaskOutput extends S.Class<GetImportTaskOutput>(
  "GetImportTaskOutput",
)({
  graphId: S.optional(S.String),
  taskId: S.String,
  source: S.String,
  format: S.optional(S.String),
  parquetType: S.optional(S.String),
  roleArn: S.String,
  status: S.String,
  importOptions: S.optional(ImportOptions),
  importTaskDetails: S.optional(ImportTaskDetails),
  attemptNumber: S.optional(S.Number),
  statusReason: S.optional(S.String),
}) {}
export class ListExportTasksOutput extends S.Class<ListExportTasksOutput>(
  "ListExportTasksOutput",
)({ tasks: ExportTaskSummaryList, nextToken: S.optional(S.String) }) {}
export class ListImportTasksOutput extends S.Class<ListImportTasksOutput>(
  "ListImportTasksOutput",
)({ tasks: ImportTaskSummaryList, nextToken: S.optional(S.String) }) {}
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
export class CreateGraphUsingImportTaskOutput extends S.Class<CreateGraphUsingImportTaskOutput>(
  "CreateGraphUsingImportTaskOutput",
)({
  graphId: S.optional(S.String),
  taskId: S.String,
  source: S.String,
  format: S.optional(S.String),
  parquetType: S.optional(S.String),
  roleArn: S.String,
  status: S.String,
  importOptions: S.optional(ImportOptions),
}) {}
export class StartExportTaskInput extends S.Class<StartExportTaskInput>(
  "StartExportTaskInput",
)(
  {
    graphIdentifier: S.String,
    roleArn: S.String,
    format: S.String,
    destination: S.String,
    kmsKeyIdentifier: S.String,
    parquetType: S.optional(S.String),
    exportFilter: S.optional(ExportFilter),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/exporttasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
  ),
) {}
export class StartExportTaskOutput extends S.Class<StartExportTaskOutput>(
  "StartExportTaskOutput",
)({
  graphId: S.String,
  roleArn: S.String,
  taskId: S.String,
  status: S.String,
  format: S.String,
  destination: S.String,
  kmsKeyIdentifier: S.String,
  parquetType: S.optional(S.String),
  statusReason: S.optional(S.String),
  exportFilter: S.optional(ExportFilter),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, reason: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String, reason: S.optional(S.String) },
) {}
export class UnprocessableException extends S.TaggedError<UnprocessableException>()(
  "UnprocessableException",
  { message: S.String, reason: S.String },
) {}

//# Operations
/**
 * Lists available Neptune Analytics graphs.
 */
export const listGraphs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGraphsInput,
  output: ListGraphsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
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
 * Deletes the specified graph. Graphs cannot be deleted if delete-protection is enabled.
 */
export const deleteGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGraphInput,
  output: DeleteGraphOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists private endpoints for a specified Neptune Analytics graph.
 */
export const listPrivateGraphEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPrivateGraphEndpointsInput,
    output: ListPrivateGraphEndpointsOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists available snapshots of a specified Neptune Analytics graph.
 */
export const listGraphSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGraphSnapshotsInput,
  output: ListGraphSnapshotsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a specified export task.
 */
export const getExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportTaskInput,
  output: GetExportTaskOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a specified import task.
 */
export const getImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportTaskInput,
  output: GetImportTaskOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of export tasks.
 */
export const listExportTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExportTasksInput,
  output: ListExportTasksOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists import tasks.
 */
export const listImportTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListImportTasksInput,
  output: ListImportTasksOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specified graph.
 */
export const getGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGraphInput,
  output: GetGraphOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a specified private endpoint.
 */
export const getPrivateGraphEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPrivateGraphEndpointInput,
    output: GetPrivateGraphEndpointOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a specified graph snapshot.
 */
export const getGraphSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGraphSnapshotInput,
  output: GetGraphSnapshotOutput,
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
 * Empties the data from a specified Neptune Analytics graph.
 */
export const resetGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetGraphInput,
  output: ResetGraphOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts the specific graph.
 */
export const startGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartGraphInput,
  output: StartGraphOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops the specific graph.
 */
export const stopGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopGraphInput,
  output: StopGraphOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of a specified Neptune Analytics graph
 */
export const updateGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGraphInput,
  output: UpdateGraphOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a private graph endpoint.
 */
export const deletePrivateGraphEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePrivateGraphEndpointInput,
    output: DeletePrivateGraphEndpointOutput,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the specifed graph snapshot.
 */
export const deleteGraphSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGraphSnapshotInput,
  output: DeleteGraphSnapshotOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancel the specified export task.
 */
export const cancelExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelExportTaskInput,
  output: CancelExportTaskOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified import task.
 */
export const cancelImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelImportTaskInput,
  output: CancelImportTaskOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Import data into existing Neptune Analytics graph from Amazon Simple Storage Service (S3). The graph needs to be empty and in the AVAILABLE state.
 */
export const startImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportTaskInput,
  output: StartImportTaskOutput,
  errors: [
    ConflictException,
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
 * Restores a graph from a snapshot.
 */
export const restoreGraphFromSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreGraphFromSnapshotInput,
    output: RestoreGraphFromSnapshotOutput,
    errors: [
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
 * Create a private graph endpoint to allow private access from to the graph from within a VPC. You can attach security groups to the private graph endpoint.
 *
 * VPC endpoint charges apply.
 */
export const createPrivateGraphEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePrivateGraphEndpointInput,
    output: CreatePrivateGraphEndpointOutput,
    errors: [
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
 * Creates a snapshot of the specific graph.
 */
export const createGraphSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGraphSnapshotInput,
  output: CreateGraphSnapshotOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Neptune Analytics graph.
 */
export const createGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGraphInput,
  output: CreateGraphOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Neptune Analytics graph and imports data into it, either from Amazon Simple Storage Service (S3) or from a Neptune database or a Neptune database snapshot.
 *
 * The data can be loaded from files in S3 that in either the Gremlin CSV format or the openCypher load format.
 */
export const createGraphUsingImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateGraphUsingImportTaskInput,
    output: CreateGraphUsingImportTaskOutput,
    errors: [
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Export data from an existing Neptune Analytics graph to Amazon S3. The graph state should be `AVAILABLE`.
 */
export const startExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExportTaskInput,
  output: StartExportTaskOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
