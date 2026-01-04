import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "neptunedata",
  serviceShapeName: "AmazonNeptuneDataplane",
});
const auth = T.AwsAuthSigv4({ name: "neptune-db" });
const ver = T.ServiceVersion("2023-08-01");
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://neptune-db-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://neptune-db-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://neptune-db.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://neptune-db.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeletePropertygraphStatisticsRequest extends S.Class<DeletePropertygraphStatisticsRequest>(
  "DeletePropertygraphStatisticsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSparqlStatisticsRequest extends S.Class<DeleteSparqlStatisticsRequest>(
  "DeleteSparqlStatisticsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEngineStatusRequest extends S.Class<GetEngineStatusRequest>(
  "GetEngineStatusRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPropertygraphStatisticsRequest extends S.Class<GetPropertygraphStatisticsRequest>(
  "GetPropertygraphStatisticsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSparqlStatisticsRequest extends S.Class<GetSparqlStatisticsRequest>(
  "GetSparqlStatisticsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const StringList = S.Array(S.String);
export class CancelGremlinQueryInput extends S.Class<CancelGremlinQueryInput>(
  "CancelGremlinQueryInput",
)(
  { queryId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/gremlin/status/{queryId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelLoaderJobInput extends S.Class<CancelLoaderJobInput>(
  "CancelLoaderJobInput",
)(
  { loadId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/loader/{loadId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelMLDataProcessingJobInput extends S.Class<CancelMLDataProcessingJobInput>(
  "CancelMLDataProcessingJobInput",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
    clean: S.optional(S.Boolean).pipe(T.HttpQuery("clean")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/ml/dataprocessing/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelMLModelTrainingJobInput extends S.Class<CancelMLModelTrainingJobInput>(
  "CancelMLModelTrainingJobInput",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
    clean: S.optional(S.Boolean).pipe(T.HttpQuery("clean")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/ml/modeltraining/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelMLModelTransformJobInput extends S.Class<CancelMLModelTransformJobInput>(
  "CancelMLModelTransformJobInput",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
    clean: S.optional(S.Boolean).pipe(T.HttpQuery("clean")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/ml/modeltransform/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelOpenCypherQueryInput extends S.Class<CancelOpenCypherQueryInput>(
  "CancelOpenCypherQueryInput",
)(
  {
    queryId: S.String.pipe(T.HttpLabel()),
    silent: S.optional(S.Boolean).pipe(T.HttpQuery("silent")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/opencypher/status/{queryId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMLEndpointInput extends S.Class<CreateMLEndpointInput>(
  "CreateMLEndpointInput",
)(
  {
    id: S.optional(S.String),
    mlModelTrainingJobId: S.optional(S.String),
    mlModelTransformJobId: S.optional(S.String),
    update: S.optional(S.Boolean),
    neptuneIamRoleArn: S.optional(S.String),
    modelName: S.optional(S.String),
    instanceType: S.optional(S.String),
    instanceCount: S.optional(S.Number),
    volumeEncryptionKMSKey: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ml/endpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMLEndpointInput extends S.Class<DeleteMLEndpointInput>(
  "DeleteMLEndpointInput",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
    clean: S.optional(S.Boolean).pipe(T.HttpQuery("clean")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/ml/endpoints/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteStatisticsValueMap extends S.Class<DeleteStatisticsValueMap>(
  "DeleteStatisticsValueMap",
)({ active: S.optional(S.Boolean), statisticsId: S.optional(S.String) }) {}
export class DeleteSparqlStatisticsOutput extends S.Class<DeleteSparqlStatisticsOutput>(
  "DeleteSparqlStatisticsOutput",
)({
  statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
  status: S.optional(S.String),
  payload: S.optional(DeleteStatisticsValueMap),
}) {}
export class ExecuteFastResetInput extends S.Class<ExecuteFastResetInput>(
  "ExecuteFastResetInput",
)(
  { action: S.String, token: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/system" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExecuteGremlinExplainQueryInput extends S.Class<ExecuteGremlinExplainQueryInput>(
  "ExecuteGremlinExplainQueryInput",
)(
  { gremlinQuery: S.String.pipe(T.JsonName("gremlin")) },
  T.all(
    T.Http({ method: "POST", uri: "/gremlin/explain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExecuteGremlinProfileQueryInput extends S.Class<ExecuteGremlinProfileQueryInput>(
  "ExecuteGremlinProfileQueryInput",
)(
  {
    gremlinQuery: S.String.pipe(T.JsonName("gremlin")),
    results: S.optional(S.Boolean).pipe(T.JsonName("profile.results")),
    chop: S.optional(S.Number).pipe(T.JsonName("profile.chop")),
    serializer: S.optional(S.String).pipe(T.JsonName("profile.serializer")),
    indexOps: S.optional(S.Boolean).pipe(T.JsonName("profile.indexOps")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/gremlin/profile" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExecuteGremlinQueryInput extends S.Class<ExecuteGremlinQueryInput>(
  "ExecuteGremlinQueryInput",
)(
  {
    gremlinQuery: S.String.pipe(T.JsonName("gremlin")),
    serializer: S.optional(S.String).pipe(T.HttpHeader("accept")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/gremlin" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExecuteOpenCypherExplainQueryInput extends S.Class<ExecuteOpenCypherExplainQueryInput>(
  "ExecuteOpenCypherExplainQueryInput",
)(
  {
    openCypherQuery: S.String.pipe(T.JsonName("query")),
    parameters: S.optional(S.String),
    explainMode: S.String.pipe(T.JsonName("explain")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/opencypher/explain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExecuteOpenCypherQueryInput extends S.Class<ExecuteOpenCypherQueryInput>(
  "ExecuteOpenCypherQueryInput",
)(
  {
    openCypherQuery: S.String.pipe(T.JsonName("query")),
    parameters: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/opencypher" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGremlinQueryStatusInput extends S.Class<GetGremlinQueryStatusInput>(
  "GetGremlinQueryStatusInput",
)(
  { queryId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/gremlin/status/{queryId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoaderJobStatusInput extends S.Class<GetLoaderJobStatusInput>(
  "GetLoaderJobStatusInput",
)(
  {
    loadId: S.String.pipe(T.HttpLabel()),
    details: S.optional(S.Boolean).pipe(T.HttpQuery("details")),
    errors: S.optional(S.Boolean).pipe(T.HttpQuery("errors")),
    page: S.optional(S.Number).pipe(T.HttpQuery("page")),
    errorsPerPage: S.optional(S.Number).pipe(T.HttpQuery("errorsPerPage")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/loader/{loadId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMLDataProcessingJobInput extends S.Class<GetMLDataProcessingJobInput>(
  "GetMLDataProcessingJobInput",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ml/dataprocessing/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMLEndpointInput extends S.Class<GetMLEndpointInput>(
  "GetMLEndpointInput",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ml/endpoints/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMLModelTrainingJobInput extends S.Class<GetMLModelTrainingJobInput>(
  "GetMLModelTrainingJobInput",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ml/modeltraining/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMLModelTransformJobInput extends S.Class<GetMLModelTransformJobInput>(
  "GetMLModelTransformJobInput",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ml/modeltransform/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOpenCypherQueryStatusInput extends S.Class<GetOpenCypherQueryStatusInput>(
  "GetOpenCypherQueryStatusInput",
)(
  { queryId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/opencypher/status/{queryId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPropertygraphStreamInput extends S.Class<GetPropertygraphStreamInput>(
  "GetPropertygraphStreamInput",
)(
  {
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    iteratorType: S.optional(S.String).pipe(T.HttpQuery("iteratorType")),
    commitNum: S.optional(S.Number).pipe(T.HttpQuery("commitNum")),
    opNum: S.optional(S.Number).pipe(T.HttpQuery("opNum")),
    encoding: S.optional(S.String).pipe(T.HttpHeader("Accept-Encoding")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/propertygraph/stream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPropertygraphSummaryInput extends S.Class<GetPropertygraphSummaryInput>(
  "GetPropertygraphSummaryInput",
)(
  { mode: S.optional(S.String).pipe(T.HttpQuery("mode")) },
  T.all(
    T.Http({ method: "GET", uri: "/propertygraph/statistics/summary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRDFGraphSummaryInput extends S.Class<GetRDFGraphSummaryInput>(
  "GetRDFGraphSummaryInput",
)(
  { mode: S.optional(S.String).pipe(T.HttpQuery("mode")) },
  T.all(
    T.Http({ method: "GET", uri: "/rdf/statistics/summary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StatisticsSummary extends S.Class<StatisticsSummary>(
  "StatisticsSummary",
)({
  signatureCount: S.optional(S.Number),
  instanceCount: S.optional(S.Number),
  predicateCount: S.optional(S.Number),
}) {}
export class Statistics extends S.Class<Statistics>("Statistics")({
  autoCompute: S.optional(S.Boolean),
  active: S.optional(S.Boolean),
  statisticsId: S.optional(S.String),
  date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  note: S.optional(S.String),
  signatureInfo: S.optional(StatisticsSummary),
}) {}
export class GetSparqlStatisticsOutput extends S.Class<GetSparqlStatisticsOutput>(
  "GetSparqlStatisticsOutput",
)({ status: S.String, payload: Statistics }) {}
export class GetSparqlStreamInput extends S.Class<GetSparqlStreamInput>(
  "GetSparqlStreamInput",
)(
  {
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    iteratorType: S.optional(S.String).pipe(T.HttpQuery("iteratorType")),
    commitNum: S.optional(S.Number).pipe(T.HttpQuery("commitNum")),
    opNum: S.optional(S.Number).pipe(T.HttpQuery("opNum")),
    encoding: S.optional(S.String).pipe(T.HttpHeader("Accept-Encoding")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sparql/stream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGremlinQueriesInput extends S.Class<ListGremlinQueriesInput>(
  "ListGremlinQueriesInput",
)(
  { includeWaiting: S.optional(S.Boolean).pipe(T.HttpQuery("includeWaiting")) },
  T.all(
    T.Http({ method: "GET", uri: "/gremlin/status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLoaderJobsInput extends S.Class<ListLoaderJobsInput>(
  "ListLoaderJobsInput",
)(
  {
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    includeQueuedLoads: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeQueuedLoads"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/loader" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMLDataProcessingJobsInput extends S.Class<ListMLDataProcessingJobsInput>(
  "ListMLDataProcessingJobsInput",
)(
  {
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ml/dataprocessing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMLEndpointsInput extends S.Class<ListMLEndpointsInput>(
  "ListMLEndpointsInput",
)(
  {
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ml/endpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMLModelTrainingJobsInput extends S.Class<ListMLModelTrainingJobsInput>(
  "ListMLModelTrainingJobsInput",
)(
  {
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ml/modeltraining" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMLModelTransformJobsInput extends S.Class<ListMLModelTransformJobsInput>(
  "ListMLModelTransformJobsInput",
)(
  {
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ml/modeltransform" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOpenCypherQueriesInput extends S.Class<ListOpenCypherQueriesInput>(
  "ListOpenCypherQueriesInput",
)(
  { includeWaiting: S.optional(S.Boolean).pipe(T.HttpQuery("includeWaiting")) },
  T.all(
    T.Http({ method: "GET", uri: "/opencypher/status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ManagePropertygraphStatisticsInput extends S.Class<ManagePropertygraphStatisticsInput>(
  "ManagePropertygraphStatisticsInput",
)(
  { mode: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/propertygraph/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ManageSparqlStatisticsInput extends S.Class<ManageSparqlStatisticsInput>(
  "ManageSparqlStatisticsInput",
)(
  { mode: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/sparql/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringValuedMap = S.Record({ key: S.String, value: S.String });
export class StartLoaderJobInput extends S.Class<StartLoaderJobInput>(
  "StartLoaderJobInput",
)(
  {
    source: S.String,
    format: S.String,
    s3BucketRegion: S.String.pipe(T.JsonName("region")),
    iamRoleArn: S.String,
    mode: S.optional(S.String),
    failOnError: S.optional(S.Boolean),
    parallelism: S.optional(S.String),
    parserConfiguration: S.optional(StringValuedMap),
    updateSingleCardinalityProperties: S.optional(S.Boolean),
    queueRequest: S.optional(S.Boolean),
    dependencies: S.optional(StringList),
    userProvidedEdgeIds: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/loader" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMLDataProcessingJobInput extends S.Class<StartMLDataProcessingJobInput>(
  "StartMLDataProcessingJobInput",
)(
  {
    id: S.optional(S.String),
    previousDataProcessingJobId: S.optional(S.String),
    inputDataS3Location: S.String,
    processedDataS3Location: S.String,
    sagemakerIamRoleArn: S.optional(S.String),
    neptuneIamRoleArn: S.optional(S.String),
    processingInstanceType: S.optional(S.String),
    processingInstanceVolumeSizeInGB: S.optional(S.Number),
    processingTimeOutInSeconds: S.optional(S.Number),
    modelType: S.optional(S.String),
    configFileName: S.optional(S.String),
    subnets: S.optional(StringList),
    securityGroupIds: S.optional(StringList),
    volumeEncryptionKMSKey: S.optional(S.String),
    s3OutputEncryptionKMSKey: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ml/dataprocessing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class QueryLanguageVersion extends S.Class<QueryLanguageVersion>(
  "QueryLanguageVersion",
)({ version: S.String }) {}
export const DocumentValuedMap = S.Record({ key: S.String, value: S.Any });
export class MlConfigDefinition extends S.Class<MlConfigDefinition>(
  "MlConfigDefinition",
)({ name: S.optional(S.String), arn: S.optional(S.String) }) {}
export const MlModels = S.Array(MlConfigDefinition);
export const Models = S.Array(MlConfigDefinition);
export class QueryEvalStats extends S.Class<QueryEvalStats>("QueryEvalStats")({
  waited: S.optional(S.Number),
  elapsed: S.optional(S.Number),
  cancelled: S.optional(S.Boolean),
  subqueries: S.optional(S.Any),
}) {}
export class GremlinQueryStatus extends S.Class<GremlinQueryStatus>(
  "GremlinQueryStatus",
)({
  queryId: S.optional(S.String),
  queryString: S.optional(S.String),
  queryEvalStats: S.optional(QueryEvalStats),
}) {}
export const OpenCypherQueries = S.Array(GremlinQueryStatus);
export class CustomModelTrainingParameters extends S.Class<CustomModelTrainingParameters>(
  "CustomModelTrainingParameters",
)({
  sourceS3DirectoryPath: S.String,
  trainingEntryPointScript: S.optional(S.String),
  transformEntryPointScript: S.optional(S.String),
}) {}
export class CustomModelTransformParameters extends S.Class<CustomModelTransformParameters>(
  "CustomModelTransformParameters",
)({
  sourceS3DirectoryPath: S.String,
  transformEntryPointScript: S.optional(S.String),
}) {}
export class CancelGremlinQueryOutput extends S.Class<CancelGremlinQueryOutput>(
  "CancelGremlinQueryOutput",
)({ status: S.optional(S.String) }) {}
export class CancelLoaderJobOutput extends S.Class<CancelLoaderJobOutput>(
  "CancelLoaderJobOutput",
)({ status: S.optional(S.String) }) {}
export class CancelMLDataProcessingJobOutput extends S.Class<CancelMLDataProcessingJobOutput>(
  "CancelMLDataProcessingJobOutput",
)({ status: S.optional(S.String) }) {}
export class CancelMLModelTrainingJobOutput extends S.Class<CancelMLModelTrainingJobOutput>(
  "CancelMLModelTrainingJobOutput",
)({ status: S.optional(S.String) }) {}
export class CancelMLModelTransformJobOutput extends S.Class<CancelMLModelTransformJobOutput>(
  "CancelMLModelTransformJobOutput",
)({ status: S.optional(S.String) }) {}
export class CancelOpenCypherQueryOutput extends S.Class<CancelOpenCypherQueryOutput>(
  "CancelOpenCypherQueryOutput",
)({ status: S.optional(S.String), payload: S.optional(S.Boolean) }) {}
export class CreateMLEndpointOutput extends S.Class<CreateMLEndpointOutput>(
  "CreateMLEndpointOutput",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  creationTimeInMillis: S.optional(S.Number),
}) {}
export class DeleteMLEndpointOutput extends S.Class<DeleteMLEndpointOutput>(
  "DeleteMLEndpointOutput",
)({ status: S.optional(S.String) }) {}
export class DeletePropertygraphStatisticsOutput extends S.Class<DeletePropertygraphStatisticsOutput>(
  "DeletePropertygraphStatisticsOutput",
)({
  statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
  status: S.optional(S.String),
  payload: S.optional(DeleteStatisticsValueMap),
}) {}
export class ExecuteGremlinExplainQueryOutput extends S.Class<ExecuteGremlinExplainQueryOutput>(
  "ExecuteGremlinExplainQueryOutput",
)({ output: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class ExecuteGremlinProfileQueryOutput extends S.Class<ExecuteGremlinProfileQueryOutput>(
  "ExecuteGremlinProfileQueryOutput",
)({ output: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class ExecuteOpenCypherExplainQueryOutput extends S.Class<ExecuteOpenCypherExplainQueryOutput>(
  "ExecuteOpenCypherExplainQueryOutput",
)({ results: T.Blob.pipe(T.HttpPayload()) }) {}
export class ExecuteOpenCypherQueryOutput extends S.Class<ExecuteOpenCypherQueryOutput>(
  "ExecuteOpenCypherQueryOutput",
)({ results: S.Any }) {}
export class GetEngineStatusOutput extends S.Class<GetEngineStatusOutput>(
  "GetEngineStatusOutput",
)({
  status: S.optional(S.String),
  startTime: S.optional(S.String),
  dbEngineVersion: S.optional(S.String),
  role: S.optional(S.String),
  dfeQueryEngine: S.optional(S.String),
  gremlin: S.optional(QueryLanguageVersion),
  sparql: S.optional(QueryLanguageVersion),
  opencypher: S.optional(QueryLanguageVersion),
  labMode: S.optional(StringValuedMap),
  rollingBackTrxCount: S.optional(S.Number),
  rollingBackTrxEarliestStartTime: S.optional(S.String),
  features: S.optional(DocumentValuedMap),
  settings: S.optional(StringValuedMap),
}) {}
export class GetLoaderJobStatusOutput extends S.Class<GetLoaderJobStatusOutput>(
  "GetLoaderJobStatusOutput",
)({ status: S.String, payload: S.Any }) {}
export class MlResourceDefinition extends S.Class<MlResourceDefinition>(
  "MlResourceDefinition",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  outputLocation: S.optional(S.String),
  failureReason: S.optional(S.String),
  cloudwatchLogUrl: S.optional(S.String),
}) {}
export class GetMLModelTrainingJobOutput extends S.Class<GetMLModelTrainingJobOutput>(
  "GetMLModelTrainingJobOutput",
)({
  status: S.optional(S.String),
  id: S.optional(S.String),
  processingJob: S.optional(MlResourceDefinition),
  hpoJob: S.optional(MlResourceDefinition),
  modelTransformJob: S.optional(MlResourceDefinition),
  mlModels: S.optional(MlModels),
}) {}
export class GetMLModelTransformJobOutput extends S.Class<GetMLModelTransformJobOutput>(
  "GetMLModelTransformJobOutput",
)({
  status: S.optional(S.String),
  id: S.optional(S.String),
  baseProcessingJob: S.optional(MlResourceDefinition),
  remoteModelTransformJob: S.optional(MlResourceDefinition),
  models: S.optional(Models),
}) {}
export class GetOpenCypherQueryStatusOutput extends S.Class<GetOpenCypherQueryStatusOutput>(
  "GetOpenCypherQueryStatusOutput",
)({
  queryId: S.optional(S.String),
  queryString: S.optional(S.String),
  queryEvalStats: S.optional(QueryEvalStats),
}) {}
export class ListMLDataProcessingJobsOutput extends S.Class<ListMLDataProcessingJobsOutput>(
  "ListMLDataProcessingJobsOutput",
)({ ids: S.optional(StringList) }) {}
export class ListMLEndpointsOutput extends S.Class<ListMLEndpointsOutput>(
  "ListMLEndpointsOutput",
)({ ids: S.optional(StringList) }) {}
export class ListMLModelTrainingJobsOutput extends S.Class<ListMLModelTrainingJobsOutput>(
  "ListMLModelTrainingJobsOutput",
)({ ids: S.optional(StringList) }) {}
export class ListMLModelTransformJobsOutput extends S.Class<ListMLModelTransformJobsOutput>(
  "ListMLModelTransformJobsOutput",
)({ ids: S.optional(StringList) }) {}
export class ListOpenCypherQueriesOutput extends S.Class<ListOpenCypherQueriesOutput>(
  "ListOpenCypherQueriesOutput",
)({
  acceptedQueryCount: S.optional(S.Number),
  runningQueryCount: S.optional(S.Number),
  queries: S.optional(OpenCypherQueries),
}) {}
export class RefreshStatisticsIdMap extends S.Class<RefreshStatisticsIdMap>(
  "RefreshStatisticsIdMap",
)({ statisticsId: S.optional(S.String) }) {}
export class ManageSparqlStatisticsOutput extends S.Class<ManageSparqlStatisticsOutput>(
  "ManageSparqlStatisticsOutput",
)({ status: S.String, payload: S.optional(RefreshStatisticsIdMap) }) {}
export class StartLoaderJobOutput extends S.Class<StartLoaderJobOutput>(
  "StartLoaderJobOutput",
)({ status: S.String, payload: StringValuedMap }) {}
export class StartMLDataProcessingJobOutput extends S.Class<StartMLDataProcessingJobOutput>(
  "StartMLDataProcessingJobOutput",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  creationTimeInMillis: S.optional(S.Number),
}) {}
export class StartMLModelTrainingJobInput extends S.Class<StartMLModelTrainingJobInput>(
  "StartMLModelTrainingJobInput",
)(
  {
    id: S.optional(S.String),
    previousModelTrainingJobId: S.optional(S.String),
    dataProcessingJobId: S.String,
    trainModelS3Location: S.String,
    sagemakerIamRoleArn: S.optional(S.String),
    neptuneIamRoleArn: S.optional(S.String),
    baseProcessingInstanceType: S.optional(S.String),
    trainingInstanceType: S.optional(S.String),
    trainingInstanceVolumeSizeInGB: S.optional(S.Number),
    trainingTimeOutInSeconds: S.optional(S.Number),
    maxHPONumberOfTrainingJobs: S.optional(S.Number),
    maxHPOParallelTrainingJobs: S.optional(S.Number),
    subnets: S.optional(StringList),
    securityGroupIds: S.optional(StringList),
    volumeEncryptionKMSKey: S.optional(S.String),
    s3OutputEncryptionKMSKey: S.optional(S.String),
    enableManagedSpotTraining: S.optional(S.Boolean),
    customModelTrainingParameters: S.optional(CustomModelTrainingParameters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ml/modeltraining" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMLModelTransformJobInput extends S.Class<StartMLModelTransformJobInput>(
  "StartMLModelTransformJobInput",
)(
  {
    id: S.optional(S.String),
    dataProcessingJobId: S.optional(S.String),
    mlModelTrainingJobId: S.optional(S.String),
    trainingJobName: S.optional(S.String),
    modelTransformOutputS3Location: S.String,
    sagemakerIamRoleArn: S.optional(S.String),
    neptuneIamRoleArn: S.optional(S.String),
    customModelTransformParameters: S.optional(CustomModelTransformParameters),
    baseProcessingInstanceType: S.optional(S.String),
    baseProcessingInstanceVolumeSizeInGB: S.optional(S.Number),
    subnets: S.optional(StringList),
    securityGroupIds: S.optional(StringList),
    volumeEncryptionKMSKey: S.optional(S.String),
    s3OutputEncryptionKMSKey: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ml/modeltransform" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FastResetToken extends S.Class<FastResetToken>("FastResetToken")({
  token: S.optional(S.String),
}) {}
export class GremlinQueryStatusAttributes extends S.Class<GremlinQueryStatusAttributes>(
  "GremlinQueryStatusAttributes",
)({
  message: S.optional(S.String),
  code: S.optional(S.Number),
  attributes: S.optional(S.Any),
}) {}
export const GremlinQueries = S.Array(GremlinQueryStatus);
export class LoaderIdResult extends S.Class<LoaderIdResult>("LoaderIdResult")({
  loadIds: S.optional(StringList),
}) {}
export const NodeLabels = S.Array(S.String);
export const EdgeLabels = S.Array(S.String);
export const Classes = S.Array(S.String);
export class ExecuteFastResetOutput extends S.Class<ExecuteFastResetOutput>(
  "ExecuteFastResetOutput",
)({ status: S.String, payload: S.optional(FastResetToken) }) {}
export class ExecuteGremlinQueryOutput extends S.Class<ExecuteGremlinQueryOutput>(
  "ExecuteGremlinQueryOutput",
)({
  requestId: S.optional(S.String),
  status: S.optional(GremlinQueryStatusAttributes),
  result: S.optional(S.Any),
  meta: S.optional(S.Any),
}) {}
export class GetGremlinQueryStatusOutput extends S.Class<GetGremlinQueryStatusOutput>(
  "GetGremlinQueryStatusOutput",
)({
  queryId: S.optional(S.String),
  queryString: S.optional(S.String),
  queryEvalStats: S.optional(QueryEvalStats),
}) {}
export class GetMLDataProcessingJobOutput extends S.Class<GetMLDataProcessingJobOutput>(
  "GetMLDataProcessingJobOutput",
)({
  status: S.optional(S.String),
  id: S.optional(S.String),
  processingJob: S.optional(MlResourceDefinition),
}) {}
export class GetMLEndpointOutput extends S.Class<GetMLEndpointOutput>(
  "GetMLEndpointOutput",
)({
  status: S.optional(S.String),
  id: S.optional(S.String),
  endpoint: S.optional(MlResourceDefinition),
  endpointConfig: S.optional(MlConfigDefinition),
}) {}
export class GetPropertygraphStatisticsOutput extends S.Class<GetPropertygraphStatisticsOutput>(
  "GetPropertygraphStatisticsOutput",
)({ status: S.String, payload: Statistics }) {}
export class ListGremlinQueriesOutput extends S.Class<ListGremlinQueriesOutput>(
  "ListGremlinQueriesOutput",
)({
  acceptedQueryCount: S.optional(S.Number),
  runningQueryCount: S.optional(S.Number),
  queries: S.optional(GremlinQueries),
}) {}
export class ListLoaderJobsOutput extends S.Class<ListLoaderJobsOutput>(
  "ListLoaderJobsOutput",
)({ status: S.String, payload: LoaderIdResult }) {}
export class ManagePropertygraphStatisticsOutput extends S.Class<ManagePropertygraphStatisticsOutput>(
  "ManagePropertygraphStatisticsOutput",
)({ status: S.String, payload: S.optional(RefreshStatisticsIdMap) }) {}
export class StartMLModelTrainingJobOutput extends S.Class<StartMLModelTrainingJobOutput>(
  "StartMLModelTrainingJobOutput",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  creationTimeInMillis: S.optional(S.Number),
}) {}
export class StartMLModelTransformJobOutput extends S.Class<StartMLModelTransformJobOutput>(
  "StartMLModelTransformJobOutput",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  creationTimeInMillis: S.optional(S.Number),
}) {}
export class PropertygraphData extends S.Class<PropertygraphData>(
  "PropertygraphData",
)({
  id: S.String,
  type: S.String,
  key: S.String,
  value: S.Any,
  from: S.optional(S.String),
  to: S.optional(S.String),
}) {}
export class SparqlData extends S.Class<SparqlData>("SparqlData")({
  stmt: S.String,
}) {}
export const NodeProperties = S.Array(S.String);
export const OutgoingEdgeLabels = S.Array(S.String);
export const EdgeProperties = S.Array(S.String);
export const Predicates = S.Array(S.String);
export class PropertygraphRecord extends S.Class<PropertygraphRecord>(
  "PropertygraphRecord",
)({
  commitTimestampInMillis: S.Number.pipe(T.JsonName("commitTimestamp")),
  eventId: StringValuedMap,
  data: PropertygraphData,
  op: S.String,
  isLastOp: S.optional(S.Boolean),
}) {}
export const PropertygraphRecordsList = S.Array(PropertygraphRecord);
export class SparqlRecord extends S.Class<SparqlRecord>("SparqlRecord")({
  commitTimestampInMillis: S.Number.pipe(T.JsonName("commitTimestamp")),
  eventId: StringValuedMap,
  data: SparqlData,
  op: S.String,
  isLastOp: S.optional(S.Boolean),
}) {}
export const SparqlRecordsList = S.Array(SparqlRecord);
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
export class SubjectStructure extends S.Class<SubjectStructure>(
  "SubjectStructure",
)({ count: S.optional(S.Number), predicates: S.optional(Predicates) }) {}
export const SubjectStructures = S.Array(SubjectStructure);
export class GetPropertygraphStreamOutput extends S.Class<GetPropertygraphStreamOutput>(
  "GetPropertygraphStreamOutput",
)({
  lastEventId: StringValuedMap,
  lastTrxTimestampInMillis: S.Number.pipe(T.JsonName("lastTrxTimestamp")),
  format: S.String,
  records: PropertygraphRecordsList,
  totalRecords: S.Number,
}) {}
export class GetSparqlStreamOutput extends S.Class<GetSparqlStreamOutput>(
  "GetSparqlStreamOutput",
)({
  lastEventId: StringValuedMap,
  lastTrxTimestampInMillis: S.Number.pipe(T.JsonName("lastTrxTimestamp")),
  format: S.String,
  records: SparqlRecordsList,
  totalRecords: S.Number,
}) {}
export class PropertygraphSummary extends S.Class<PropertygraphSummary>(
  "PropertygraphSummary",
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
export class RDFGraphSummary extends S.Class<RDFGraphSummary>(
  "RDFGraphSummary",
)({
  numDistinctSubjects: S.optional(S.Number),
  numDistinctPredicates: S.optional(S.Number),
  numQuads: S.optional(S.Number),
  numClasses: S.optional(S.Number),
  classes: S.optional(Classes),
  predicates: S.optional(LongValuedMapList),
  subjectStructures: S.optional(SubjectStructures),
}) {}
export class PropertygraphSummaryValueMap extends S.Class<PropertygraphSummaryValueMap>(
  "PropertygraphSummaryValueMap",
)({
  version: S.optional(S.String),
  lastStatisticsComputationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  graphSummary: S.optional(PropertygraphSummary),
}) {}
export class RDFGraphSummaryValueMap extends S.Class<RDFGraphSummaryValueMap>(
  "RDFGraphSummaryValueMap",
)({
  version: S.optional(S.String),
  lastStatisticsComputationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  graphSummary: S.optional(RDFGraphSummary),
}) {}
export class GetPropertygraphSummaryOutput extends S.Class<GetPropertygraphSummaryOutput>(
  "GetPropertygraphSummaryOutput",
)({
  statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
  payload: S.optional(PropertygraphSummaryValueMap),
}) {}
export class GetRDFGraphSummaryOutput extends S.Class<GetRDFGraphSummaryOutput>(
  "GetRDFGraphSummaryOutput",
)({
  statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
  payload: S.optional(RDFGraphSummaryValueMap),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ClientTimeoutException extends S.TaggedError<ClientTimeoutException>()(
  "ClientTimeoutException",
  {},
) {}
export class ConstraintViolationException extends S.TaggedError<ConstraintViolationException>()(
  "ConstraintViolationException",
  {},
) {}
export class IllegalArgumentException extends S.TaggedError<IllegalArgumentException>()(
  "IllegalArgumentException",
  {},
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  {},
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class MissingParameterException extends S.TaggedError<MissingParameterException>()(
  "MissingParameterException",
  {},
) {}
export class PreconditionsFailedException extends S.TaggedError<PreconditionsFailedException>()(
  "PreconditionsFailedException",
  {},
) {}
export class CancelledByUserException extends S.TaggedError<CancelledByUserException>()(
  "CancelledByUserException",
  {},
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  {},
) {}
export class FailureByQueryException extends S.TaggedError<FailureByQueryException>()(
  "FailureByQueryException",
  {},
) {}
export class InvalidNumericDataException extends S.TaggedError<InvalidNumericDataException>()(
  "InvalidNumericDataException",
  {},
) {}
export class BulkLoadIdNotFoundException extends S.TaggedError<BulkLoadIdNotFoundException>()(
  "BulkLoadIdNotFoundException",
  {},
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  {},
) {}
export class MLResourceNotFoundException extends S.TaggedError<MLResourceNotFoundException>()(
  "MLResourceNotFoundException",
  {},
) {}
export class ReadOnlyViolationException extends S.TaggedError<ReadOnlyViolationException>()(
  "ReadOnlyViolationException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  {},
) {}
export class ParsingException extends S.TaggedError<ParsingException>()(
  "ParsingException",
  {},
) {}
export class StatisticsNotAvailableException extends S.TaggedError<StatisticsNotAvailableException>()(
  "StatisticsNotAvailableException",
  {},
) {}
export class LoadUrlAccessDeniedException extends S.TaggedError<LoadUrlAccessDeniedException>()(
  "LoadUrlAccessDeniedException",
  {},
) {}
export class TimeLimitExceededException extends S.TaggedError<TimeLimitExceededException>()(
  "TimeLimitExceededException",
  {},
) {}
export class MalformedQueryException extends S.TaggedError<MalformedQueryException>()(
  "MalformedQueryException",
  {},
) {}
export class MemoryLimitExceededException extends S.TaggedError<MemoryLimitExceededException>()(
  "MemoryLimitExceededException",
  {},
) {}
export class QueryLimitExceededException extends S.TaggedError<QueryLimitExceededException>()(
  "QueryLimitExceededException",
  {},
) {}
export class QueryLimitException extends S.TaggedError<QueryLimitException>()(
  "QueryLimitException",
  {},
) {}
export class QueryTooLargeException extends S.TaggedError<QueryTooLargeException>()(
  "QueryTooLargeException",
  {},
) {}
export class S3Exception extends S.TaggedError<S3Exception>()("S3Exception", {
  detailedMessage: S.String,
  requestId: S.String,
  code: S.String,
}) {}
export class MethodNotAllowedException extends S.TaggedError<MethodNotAllowedException>()(
  "MethodNotAllowedException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
) {}
export class ExpiredStreamException extends S.TaggedError<ExpiredStreamException>()(
  "ExpiredStreamException",
  {},
) {}
export class ServerShutdownException extends S.TaggedError<ServerShutdownException>()(
  "ServerShutdownException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
) {}
export class StreamRecordsNotFoundException extends S.TaggedError<StreamRecordsNotFoundException>()(
  "StreamRecordsNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}

//# Operations
/**
 * Lists existing inference endpoints. See Managing inference endpoints using the endpoints command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ListMLEndpoints IAM action in that cluster.
 */
export const listMLEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMLEndpointsInput,
  output: ListMLEndpointsOutput,
  errors: [
    BadRequestException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MissingParameterException,
    MLResourceNotFoundException,
    PreconditionsFailedException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Lists Neptune ML model-training jobs. See Model training using the `modeltraining` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:neptune-db:ListMLModelTrainingJobs IAM action in that cluster.
 */
export const listMLModelTrainingJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMLModelTrainingJobsInput,
    output: ListMLModelTrainingJobsOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Returns a list of model transform job IDs. See Use a trained model to generate new model artifacts.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ListMLModelTransformJobs IAM action in that cluster.
 */
export const listMLModelTransformJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMLModelTransformJobsInput,
    output: ListMLModelTransformJobsOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Manages the generation and use of RDF graph statistics.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ManageStatistics IAM action in that cluster.
 */
export const manageSparqlStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ManageSparqlStatisticsInput,
    output: ManageSparqlStatisticsOutput,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      PreconditionsFailedException,
      ReadOnlyViolationException,
      StatisticsNotAvailableException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Creates a new Neptune ML data processing job for processing the graph data exported from Neptune for training. See The `dataprocessing` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:StartMLModelDataProcessingJob IAM action in that cluster.
 */
export const startMLDataProcessingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMLDataProcessingJobInput,
    output: StartMLDataProcessingJobOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Cancels a Gremlin query. See Gremlin query cancellation for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelQuery IAM action in that cluster.
 */
export const cancelGremlinQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelGremlinQueryInput,
  output: CancelGremlinQueryOutput,
  errors: [
    BadRequestException,
    ClientTimeoutException,
    ConcurrentModificationException,
    ConstraintViolationException,
    FailureByQueryException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MissingParameterException,
    ParsingException,
    PreconditionsFailedException,
    TimeLimitExceededException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Cancels a specified load job. This is an HTTP `DELETE` request. See Neptune Loader Get-Status API for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelLoaderJob IAM action in that cluster..
 */
export const cancelLoaderJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelLoaderJobInput,
  output: CancelLoaderJobOutput,
  errors: [
    BadRequestException,
    BulkLoadIdNotFoundException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InternalFailureException,
    InvalidArgumentException,
    InvalidParameterException,
    LoadUrlAccessDeniedException,
    MissingParameterException,
    PreconditionsFailedException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Cancels a Neptune ML data processing job. See The `dataprocessing` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelMLDataProcessingJob IAM action in that cluster.
 */
export const cancelMLDataProcessingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelMLDataProcessingJobInput,
    output: CancelMLDataProcessingJobOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Cancels a Neptune ML model training job. See Model training using the `modeltraining` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelMLModelTrainingJob IAM action in that cluster.
 */
export const cancelMLModelTrainingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelMLModelTrainingJobInput,
    output: CancelMLModelTrainingJobOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Cancels a specified model transform job. See Use a trained model to generate new model artifacts.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelMLModelTransformJob IAM action in that cluster.
 */
export const cancelMLModelTransformJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelMLModelTransformJobInput,
    output: CancelMLModelTransformJobOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Cancels a specified openCypher query. See Neptune openCypher status endpoint for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelQuery IAM action in that cluster.
 */
export const cancelOpenCypherQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelOpenCypherQueryInput,
    output: CancelOpenCypherQueryOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConcurrentModificationException,
      ConstraintViolationException,
      FailureByQueryException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidNumericDataException,
      InvalidParameterException,
      MissingParameterException,
      ParsingException,
      PreconditionsFailedException,
      TimeLimitExceededException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Creates a new Neptune ML inference endpoint that lets you query one specific model that the model-training process constructed. See Managing inference endpoints using the endpoints command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CreateMLEndpoint IAM action in that cluster.
 */
export const createMLEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMLEndpointInput,
  output: CreateMLEndpointOutput,
  errors: [
    BadRequestException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MissingParameterException,
    MLResourceNotFoundException,
    PreconditionsFailedException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Cancels the creation of a Neptune ML inference endpoint. See Managing inference endpoints using the endpoints command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:DeleteMLEndpoint IAM action in that cluster.
 */
export const deleteMLEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMLEndpointInput,
  output: DeleteMLEndpointOutput,
  errors: [
    BadRequestException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MissingParameterException,
    MLResourceNotFoundException,
    PreconditionsFailedException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes statistics for Gremlin and openCypher (property graph) data.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:DeleteStatistics IAM action in that cluster.
 */
export const deletePropertygraphStatistics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeletePropertygraphStatisticsRequest,
    output: DeletePropertygraphStatisticsOutput,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      PreconditionsFailedException,
      ReadOnlyViolationException,
      StatisticsNotAvailableException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }));
/**
 * Deletes SPARQL statistics
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:DeleteStatistics IAM action in that cluster.
 */
export const deleteSparqlStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSparqlStatisticsRequest,
    output: DeleteSparqlStatisticsOutput,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      PreconditionsFailedException,
      ReadOnlyViolationException,
      StatisticsNotAvailableException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Executes an openCypher query. See Accessing the Neptune Graph with openCypher for more information.
 *
 * Neptune supports building graph applications using openCypher, which is currently one of the most popular query languages among developers working with graph databases. Developers, business analysts, and data scientists like openCypher's declarative, SQL-inspired syntax because it provides a familiar structure in which to querying property graphs.
 *
 * The openCypher language was originally developed by Neo4j, then open-sourced in 2015 and contributed to the openCypher project under an Apache 2 open-source license.
 *
 * Note that when invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows one of the following IAM actions in that cluster, depending on the query:
 *
 * - neptune-db:ReadDataViaQuery
 *
 * - neptune-db:WriteDataViaQuery
 *
 * - neptune-db:DeleteDataViaQuery
 *
 * Note also that the neptune-db:QueryLanguage:OpenCypher IAM condition key can be used in the policy document to restrict the use of openCypher queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const executeOpenCypherQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExecuteOpenCypherQueryInput,
    output: ExecuteOpenCypherQueryOutput,
    errors: [
      BadRequestException,
      CancelledByUserException,
      ClientTimeoutException,
      ConcurrentModificationException,
      ConstraintViolationException,
      FailureByQueryException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidNumericDataException,
      InvalidParameterException,
      MalformedQueryException,
      MemoryLimitExceededException,
      MissingParameterException,
      ParsingException,
      PreconditionsFailedException,
      QueryLimitExceededException,
      QueryLimitException,
      QueryTooLargeException,
      TimeLimitExceededException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Retrieves the status of the graph database on the host.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetEngineStatus IAM action in that cluster.
 */
export const getEngineStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEngineStatusRequest,
  output: GetEngineStatusOutput,
  errors: [
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InternalFailureException,
    InvalidArgumentException,
    PreconditionsFailedException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Gets the status of a specified Gremlin query.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetQueryStatus IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:Gremlin IAM condition key can be used in the policy document to restrict the use of Gremlin queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const getGremlinQueryStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetGremlinQueryStatusInput,
    output: GetGremlinQueryStatusOutput,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ClientTimeoutException,
      ConcurrentModificationException,
      ConstraintViolationException,
      FailureByQueryException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      ParsingException,
      PreconditionsFailedException,
      ReadOnlyViolationException,
      TimeLimitExceededException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Gets status information about a specified load job. Neptune keeps track of the most recent 1,024 bulk load jobs, and stores the last 10,000 error details per job.
 *
 * See Neptune Loader Get-Status API for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetLoaderJobStatus IAM action in that cluster..
 */
export const getLoaderJobStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoaderJobStatusInput,
  output: GetLoaderJobStatusOutput,
  errors: [
    BadRequestException,
    BulkLoadIdNotFoundException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InternalFailureException,
    InvalidArgumentException,
    InvalidParameterException,
    LoadUrlAccessDeniedException,
    MissingParameterException,
    PreconditionsFailedException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves information about a specified data processing job. See The `dataprocessing` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:neptune-db:GetMLDataProcessingJobStatus IAM action in that cluster.
 */
export const getMLDataProcessingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMLDataProcessingJobInput,
    output: GetMLDataProcessingJobOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Retrieves details about an inference endpoint. See Managing inference endpoints using the endpoints command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetMLEndpointStatus IAM action in that cluster.
 */
export const getMLEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLEndpointInput,
  output: GetMLEndpointOutput,
  errors: [
    BadRequestException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MissingParameterException,
    MLResourceNotFoundException,
    PreconditionsFailedException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves information about a Neptune ML model training job. See Model training using the `modeltraining` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetMLModelTrainingJobStatus IAM action in that cluster.
 */
export const getMLModelTrainingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMLModelTrainingJobInput,
    output: GetMLModelTrainingJobOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Gets information about a specified model transform job. See Use a trained model to generate new model artifacts.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetMLModelTransformJobStatus IAM action in that cluster.
 */
export const getMLModelTransformJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMLModelTransformJobInput,
    output: GetMLModelTransformJobOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Retrieves the status of a specified openCypher query.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetQueryStatus IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:OpenCypher IAM condition key can be used in the policy document to restrict the use of openCypher queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const getOpenCypherQueryStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOpenCypherQueryStatusInput,
    output: GetOpenCypherQueryStatusOutput,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ClientTimeoutException,
      ConcurrentModificationException,
      ConstraintViolationException,
      FailureByQueryException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidNumericDataException,
      InvalidParameterException,
      MissingParameterException,
      ParsingException,
      PreconditionsFailedException,
      ReadOnlyViolationException,
      TimeLimitExceededException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Gets property graph statistics (Gremlin and openCypher).
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetStatisticsStatus IAM action in that cluster.
 */
export const getPropertygraphStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPropertygraphStatisticsRequest,
    output: GetPropertygraphStatisticsOutput,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      PreconditionsFailedException,
      ReadOnlyViolationException,
      StatisticsNotAvailableException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Gets RDF statistics (SPARQL).
 */
export const getSparqlStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSparqlStatisticsRequest,
  output: GetSparqlStatisticsOutput,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MissingParameterException,
    PreconditionsFailedException,
    ReadOnlyViolationException,
    StatisticsNotAvailableException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Lists active Gremlin queries. See Gremlin query status API for details about the output.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetQueryStatus IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:Gremlin IAM condition key can be used in the policy document to restrict the use of Gremlin queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const listGremlinQueries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGremlinQueriesInput,
  output: ListGremlinQueriesOutput,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ClientTimeoutException,
    ConcurrentModificationException,
    ConstraintViolationException,
    FailureByQueryException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MissingParameterException,
    ParsingException,
    PreconditionsFailedException,
    ReadOnlyViolationException,
    TimeLimitExceededException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves a list of the `loadIds` for all active loader jobs.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ListLoaderJobs IAM action in that cluster..
 */
export const listLoaderJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLoaderJobsInput,
  output: ListLoaderJobsOutput,
  errors: [
    BadRequestException,
    BulkLoadIdNotFoundException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InternalFailureException,
    InvalidArgumentException,
    InvalidParameterException,
    LoadUrlAccessDeniedException,
    PreconditionsFailedException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns a list of Neptune ML data processing jobs. See Listing active data-processing jobs using the Neptune ML dataprocessing command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ListMLDataProcessingJobs IAM action in that cluster.
 */
export const listMLDataProcessingJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMLDataProcessingJobsInput,
    output: ListMLDataProcessingJobsOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Lists active openCypher queries. See Neptune openCypher status endpoint for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetQueryStatus IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:OpenCypher IAM condition key can be used in the policy document to restrict the use of openCypher queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const listOpenCypherQueries = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOpenCypherQueriesInput,
    output: ListOpenCypherQueriesOutput,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ClientTimeoutException,
      ConcurrentModificationException,
      ConstraintViolationException,
      FailureByQueryException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidNumericDataException,
      InvalidParameterException,
      MissingParameterException,
      ParsingException,
      PreconditionsFailedException,
      ReadOnlyViolationException,
      TimeLimitExceededException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Manages the generation and use of property graph statistics.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ManageStatistics IAM action in that cluster.
 */
export const managePropertygraphStatistics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ManagePropertygraphStatisticsInput,
    output: ManagePropertygraphStatisticsOutput,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      PreconditionsFailedException,
      ReadOnlyViolationException,
      StatisticsNotAvailableException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }));
/**
 * Starts a Neptune bulk loader job to load data from an Amazon S3 bucket into a Neptune DB instance. See Using the Amazon Neptune Bulk Loader to Ingest Data.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:StartLoaderJob IAM action in that cluster.
 */
export const startLoaderJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLoaderJobInput,
  output: StartLoaderJobOutput,
  errors: [
    BadRequestException,
    BulkLoadIdNotFoundException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InternalFailureException,
    InvalidArgumentException,
    InvalidParameterException,
    LoadUrlAccessDeniedException,
    MissingParameterException,
    PreconditionsFailedException,
    S3Exception,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a new Neptune ML model training job. See Model training using the `modeltraining` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:StartMLModelTrainingJob IAM action in that cluster.
 */
export const startMLModelTrainingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMLModelTrainingJobInput,
    output: StartMLModelTrainingJobOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Creates a new model transform job. See Use a trained model to generate new model artifacts.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:StartMLModelTransformJob IAM action in that cluster.
 */
export const startMLModelTransformJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMLModelTransformJobInput,
    output: StartMLModelTransformJobOutput,
    errors: [
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      MLResourceNotFoundException,
      PreconditionsFailedException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Executes a Gremlin Explain query.
 *
 * Amazon Neptune has added a Gremlin feature named `explain` that provides is a self-service tool for understanding the execution approach being taken by the Neptune engine for the query. You invoke it by adding an `explain` parameter to an HTTP call that submits a Gremlin query.
 *
 * The explain feature provides information about the logical structure of query execution plans. You can use this information to identify potential evaluation and execution bottlenecks and to tune your query, as explained in Tuning Gremlin queries. You can also use query hints to improve query execution plans.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows one of the following IAM actions in that cluster, depending on the query:
 *
 * - neptune-db:ReadDataViaQuery
 *
 * - neptune-db:WriteDataViaQuery
 *
 * - neptune-db:DeleteDataViaQuery
 *
 * Note that the neptune-db:QueryLanguage:Gremlin IAM condition key can be used in the policy document to restrict the use of Gremlin queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const executeGremlinExplainQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExecuteGremlinExplainQueryInput,
    output: ExecuteGremlinExplainQueryOutput,
    errors: [
      BadRequestException,
      CancelledByUserException,
      ClientTimeoutException,
      ConcurrentModificationException,
      ConstraintViolationException,
      FailureByQueryException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MalformedQueryException,
      MemoryLimitExceededException,
      MissingParameterException,
      ParsingException,
      PreconditionsFailedException,
      QueryLimitExceededException,
      QueryLimitException,
      QueryTooLargeException,
      TimeLimitExceededException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Executes a Gremlin Profile query, which runs a specified traversal, collects various metrics about the run, and produces a profile report as output. See Gremlin profile API in Neptune for details.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ReadDataViaQuery IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:Gremlin IAM condition key can be used in the policy document to restrict the use of Gremlin queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const executeGremlinProfileQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExecuteGremlinProfileQueryInput,
    output: ExecuteGremlinProfileQueryOutput,
    errors: [
      BadRequestException,
      CancelledByUserException,
      ClientTimeoutException,
      ConcurrentModificationException,
      ConstraintViolationException,
      FailureByQueryException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MalformedQueryException,
      MemoryLimitExceededException,
      MissingParameterException,
      ParsingException,
      PreconditionsFailedException,
      QueryLimitExceededException,
      QueryLimitException,
      QueryTooLargeException,
      TimeLimitExceededException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * This commands executes a Gremlin query. Amazon Neptune is compatible with Apache TinkerPop3 and Gremlin, so you can use the Gremlin traversal language to query the graph, as described under The Graph in the Apache TinkerPop3 documentation. More details can also be found in Accessing a Neptune graph with Gremlin.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that enables one of the following IAM actions in that cluster, depending on the query:
 *
 * - neptune-db:ReadDataViaQuery
 *
 * - neptune-db:WriteDataViaQuery
 *
 * - neptune-db:DeleteDataViaQuery
 *
 * Note that the neptune-db:QueryLanguage:Gremlin IAM condition key can be used in the policy document to restrict the use of Gremlin queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const executeGremlinQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteGremlinQueryInput,
  output: ExecuteGremlinQueryOutput,
  errors: [
    BadRequestException,
    CancelledByUserException,
    ClientTimeoutException,
    ConcurrentModificationException,
    ConstraintViolationException,
    FailureByQueryException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MalformedQueryException,
    MemoryLimitExceededException,
    MissingParameterException,
    ParsingException,
    PreconditionsFailedException,
    QueryLimitExceededException,
    QueryLimitException,
    QueryTooLargeException,
    TimeLimitExceededException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Executes an openCypher `explain` request. See The openCypher explain feature for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ReadDataViaQuery IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:OpenCypher IAM condition key can be used in the policy document to restrict the use of openCypher queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const executeOpenCypherExplainQuery =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExecuteOpenCypherExplainQueryInput,
    output: ExecuteOpenCypherExplainQueryOutput,
    errors: [
      BadRequestException,
      CancelledByUserException,
      ClientTimeoutException,
      ConcurrentModificationException,
      ConstraintViolationException,
      FailureByQueryException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidNumericDataException,
      InvalidParameterException,
      MalformedQueryException,
      MemoryLimitExceededException,
      MissingParameterException,
      ParsingException,
      PreconditionsFailedException,
      QueryLimitExceededException,
      QueryLimitException,
      QueryTooLargeException,
      TimeLimitExceededException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }));
/**
 * The fast reset REST API lets you reset a Neptune graph quicky and easily, removing all of its data.
 *
 * Neptune fast reset is a two-step process. First you call `ExecuteFastReset` with `action` set to `initiateDatabaseReset`. This returns a UUID token which you then include when calling `ExecuteFastReset` again with `action` set to `performDatabaseReset`. See Empty an Amazon Neptune DB cluster using the fast reset API.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ResetDatabase IAM action in that cluster.
 */
export const executeFastReset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteFastResetInput,
  output: ExecuteFastResetOutput,
  errors: [
    AccessDeniedException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MethodNotAllowedException,
    MissingParameterException,
    PreconditionsFailedException,
    ReadOnlyViolationException,
    ServerShutdownException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Gets a graph summary for a property graph.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetGraphSummary IAM action in that cluster.
 */
export const getPropertygraphSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPropertygraphSummaryInput,
    output: GetPropertygraphSummaryOutput,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ClientTimeoutException,
      ConstraintViolationException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MissingParameterException,
      PreconditionsFailedException,
      ReadOnlyViolationException,
      StatisticsNotAvailableException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Gets a graph summary for an RDF graph.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetGraphSummary IAM action in that cluster.
 */
export const getRDFGraphSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRDFGraphSummaryInput,
  output: GetRDFGraphSummaryOutput,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ClientTimeoutException,
    ConstraintViolationException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MissingParameterException,
    PreconditionsFailedException,
    ReadOnlyViolationException,
    StatisticsNotAvailableException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Gets a stream for an RDF graph.
 *
 * With the Neptune Streams feature, you can generate a complete sequence of change-log entries that record every change made to your graph data as it happens. `GetSparqlStream` lets you collect these change-log entries for an RDF graph.
 *
 * The Neptune streams feature needs to be enabled on your Neptune DBcluster. To enable streams, set the neptune_streams DB cluster parameter to `1`.
 *
 * See Capturing graph changes in real time using Neptune streams.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetStreamRecords IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:Sparql IAM condition key can be used in the policy document to restrict the use of SPARQL queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const getSparqlStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSparqlStreamInput,
  output: GetSparqlStreamOutput,
  errors: [
    ClientTimeoutException,
    ConstraintViolationException,
    ExpiredStreamException,
    IllegalArgumentException,
    InvalidArgumentException,
    InvalidParameterException,
    MemoryLimitExceededException,
    PreconditionsFailedException,
    StreamRecordsNotFoundException,
    ThrottlingException,
    TooManyRequestsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Gets a stream for a property graph.
 *
 * With the Neptune Streams feature, you can generate a complete sequence of change-log entries that record every change made to your graph data as it happens. `GetPropertygraphStream` lets you collect these change-log entries for a property graph.
 *
 * The Neptune streams feature needs to be enabled on your Neptune DBcluster. To enable streams, set the neptune_streams DB cluster parameter to `1`.
 *
 * See Capturing graph changes in real time using Neptune streams.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetStreamRecords IAM action in that cluster.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that enables one of the following IAM actions, depending on the query:
 *
 * Note that you can restrict property-graph queries using the following IAM context keys:
 *
 * - neptune-db:QueryLanguage:Gremlin
 *
 * - neptune-db:QueryLanguage:OpenCypher
 *
 * See Condition keys available in Neptune IAM data-access policy statements).
 */
export const getPropertygraphStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPropertygraphStreamInput,
    output: GetPropertygraphStreamOutput,
    errors: [
      ClientTimeoutException,
      ConstraintViolationException,
      ExpiredStreamException,
      IllegalArgumentException,
      InvalidArgumentException,
      InvalidParameterException,
      MemoryLimitExceededException,
      PreconditionsFailedException,
      StreamRecordsNotFoundException,
      ThrottlingException,
      TooManyRequestsException,
      UnsupportedOperationException,
    ],
  }),
);
