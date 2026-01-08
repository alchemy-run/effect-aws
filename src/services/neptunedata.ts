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
  sdkId: "neptunedata",
  serviceShapeName: "AmazonNeptuneDataplane",
});
const auth = T.AwsAuthSigv4({ name: "neptune-db" });
const ver = T.ServiceVersion("2023-08-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://neptune-db-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://neptune-db-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://neptune-db.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://neptune-db.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PositiveInteger = number;

//# Schemas
export interface DeletePropertygraphStatisticsRequest {}
export const DeletePropertygraphStatisticsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePropertygraphStatisticsRequest",
}) as any as S.Schema<DeletePropertygraphStatisticsRequest>;
export interface DeleteSparqlStatisticsRequest {}
export const DeleteSparqlStatisticsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSparqlStatisticsRequest",
}) as any as S.Schema<DeleteSparqlStatisticsRequest>;
export interface GetEngineStatusRequest {}
export const GetEngineStatusRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEngineStatusRequest",
}) as any as S.Schema<GetEngineStatusRequest>;
export interface GetPropertygraphStatisticsRequest {}
export const GetPropertygraphStatisticsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPropertygraphStatisticsRequest",
}) as any as S.Schema<GetPropertygraphStatisticsRequest>;
export interface GetSparqlStatisticsRequest {}
export const GetSparqlStatisticsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSparqlStatisticsRequest",
}) as any as S.Schema<GetSparqlStatisticsRequest>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface CancelGremlinQueryInput {
  queryId: string;
}
export const CancelGremlinQueryInput = S.suspend(() =>
  S.Struct({ queryId: S.String.pipe(T.HttpLabel("queryId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/gremlin/status/{queryId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelGremlinQueryInput",
}) as any as S.Schema<CancelGremlinQueryInput>;
export interface CancelLoaderJobInput {
  loadId: string;
}
export const CancelLoaderJobInput = S.suspend(() =>
  S.Struct({ loadId: S.String.pipe(T.HttpLabel("loadId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/loader/{loadId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelLoaderJobInput",
}) as any as S.Schema<CancelLoaderJobInput>;
export interface CancelMLDataProcessingJobInput {
  id: string;
  neptuneIamRoleArn?: string;
  clean?: boolean;
}
export const CancelMLDataProcessingJobInput = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
    clean: S.optional(S.Boolean).pipe(T.HttpQuery("clean")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/ml/dataprocessing/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelMLDataProcessingJobInput",
}) as any as S.Schema<CancelMLDataProcessingJobInput>;
export interface CancelMLModelTrainingJobInput {
  id: string;
  neptuneIamRoleArn?: string;
  clean?: boolean;
}
export const CancelMLModelTrainingJobInput = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
    clean: S.optional(S.Boolean).pipe(T.HttpQuery("clean")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/ml/modeltraining/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelMLModelTrainingJobInput",
}) as any as S.Schema<CancelMLModelTrainingJobInput>;
export interface CancelMLModelTransformJobInput {
  id: string;
  neptuneIamRoleArn?: string;
  clean?: boolean;
}
export const CancelMLModelTransformJobInput = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
    clean: S.optional(S.Boolean).pipe(T.HttpQuery("clean")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/ml/modeltransform/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelMLModelTransformJobInput",
}) as any as S.Schema<CancelMLModelTransformJobInput>;
export interface CancelOpenCypherQueryInput {
  queryId: string;
  silent?: boolean;
}
export const CancelOpenCypherQueryInput = S.suspend(() =>
  S.Struct({
    queryId: S.String.pipe(T.HttpLabel("queryId")),
    silent: S.optional(S.Boolean).pipe(T.HttpQuery("silent")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/opencypher/status/{queryId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelOpenCypherQueryInput",
}) as any as S.Schema<CancelOpenCypherQueryInput>;
export interface CreateMLEndpointInput {
  id?: string;
  mlModelTrainingJobId?: string;
  mlModelTransformJobId?: string;
  update?: boolean;
  neptuneIamRoleArn?: string;
  modelName?: string;
  instanceType?: string;
  instanceCount?: number;
  volumeEncryptionKMSKey?: string;
}
export const CreateMLEndpointInput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    mlModelTrainingJobId: S.optional(S.String),
    mlModelTransformJobId: S.optional(S.String),
    update: S.optional(S.Boolean),
    neptuneIamRoleArn: S.optional(S.String),
    modelName: S.optional(S.String),
    instanceType: S.optional(S.String),
    instanceCount: S.optional(S.Number),
    volumeEncryptionKMSKey: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ml/endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMLEndpointInput",
}) as any as S.Schema<CreateMLEndpointInput>;
export interface DeleteMLEndpointInput {
  id: string;
  neptuneIamRoleArn?: string;
  clean?: boolean;
}
export const DeleteMLEndpointInput = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
    clean: S.optional(S.Boolean).pipe(T.HttpQuery("clean")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/ml/endpoints/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMLEndpointInput",
}) as any as S.Schema<DeleteMLEndpointInput>;
export interface DeleteStatisticsValueMap {
  active?: boolean;
  statisticsId?: string;
}
export const DeleteStatisticsValueMap = S.suspend(() =>
  S.Struct({
    active: S.optional(S.Boolean),
    statisticsId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteStatisticsValueMap",
}) as any as S.Schema<DeleteStatisticsValueMap>;
export interface DeleteSparqlStatisticsOutput {
  statusCode?: number;
  status?: string;
  payload?: DeleteStatisticsValueMap;
}
export const DeleteSparqlStatisticsOutput = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
    status: S.optional(S.String),
    payload: S.optional(DeleteStatisticsValueMap),
  }),
).annotations({
  identifier: "DeleteSparqlStatisticsOutput",
}) as any as S.Schema<DeleteSparqlStatisticsOutput>;
export interface ExecuteFastResetInput {
  action: string;
  token?: string;
}
export const ExecuteFastResetInput = S.suspend(() =>
  S.Struct({ action: S.String, token: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/system" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteFastResetInput",
}) as any as S.Schema<ExecuteFastResetInput>;
export interface ExecuteGremlinExplainQueryInput {
  gremlinQuery: string;
}
export const ExecuteGremlinExplainQueryInput = S.suspend(() =>
  S.Struct({ gremlinQuery: S.String.pipe(T.JsonName("gremlin")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/gremlin/explain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteGremlinExplainQueryInput",
}) as any as S.Schema<ExecuteGremlinExplainQueryInput>;
export interface ExecuteGremlinProfileQueryInput {
  gremlinQuery: string;
  results?: boolean;
  chop?: number;
  serializer?: string;
  indexOps?: boolean;
}
export const ExecuteGremlinProfileQueryInput = S.suspend(() =>
  S.Struct({
    gremlinQuery: S.String.pipe(T.JsonName("gremlin")),
    results: S.optional(S.Boolean).pipe(T.JsonName("profile.results")),
    chop: S.optional(S.Number).pipe(T.JsonName("profile.chop")),
    serializer: S.optional(S.String).pipe(T.JsonName("profile.serializer")),
    indexOps: S.optional(S.Boolean).pipe(T.JsonName("profile.indexOps")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/gremlin/profile" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteGremlinProfileQueryInput",
}) as any as S.Schema<ExecuteGremlinProfileQueryInput>;
export interface ExecuteGremlinQueryInput {
  gremlinQuery: string;
  serializer?: string;
}
export const ExecuteGremlinQueryInput = S.suspend(() =>
  S.Struct({
    gremlinQuery: S.String.pipe(T.JsonName("gremlin")),
    serializer: S.optional(S.String).pipe(T.HttpHeader("accept")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/gremlin" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteGremlinQueryInput",
}) as any as S.Schema<ExecuteGremlinQueryInput>;
export interface ExecuteOpenCypherExplainQueryInput {
  openCypherQuery: string;
  parameters?: string;
  explainMode: string;
}
export const ExecuteOpenCypherExplainQueryInput = S.suspend(() =>
  S.Struct({
    openCypherQuery: S.String.pipe(T.JsonName("query")),
    parameters: S.optional(S.String),
    explainMode: S.String.pipe(T.JsonName("explain")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/opencypher/explain" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteOpenCypherExplainQueryInput",
}) as any as S.Schema<ExecuteOpenCypherExplainQueryInput>;
export interface ExecuteOpenCypherQueryInput {
  openCypherQuery: string;
  parameters?: string;
}
export const ExecuteOpenCypherQueryInput = S.suspend(() =>
  S.Struct({
    openCypherQuery: S.String.pipe(T.JsonName("query")),
    parameters: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/opencypher" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteOpenCypherQueryInput",
}) as any as S.Schema<ExecuteOpenCypherQueryInput>;
export interface GetGremlinQueryStatusInput {
  queryId: string;
}
export const GetGremlinQueryStatusInput = S.suspend(() =>
  S.Struct({ queryId: S.String.pipe(T.HttpLabel("queryId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/gremlin/status/{queryId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGremlinQueryStatusInput",
}) as any as S.Schema<GetGremlinQueryStatusInput>;
export interface GetLoaderJobStatusInput {
  loadId: string;
  details?: boolean;
  errors?: boolean;
  page?: number;
  errorsPerPage?: number;
}
export const GetLoaderJobStatusInput = S.suspend(() =>
  S.Struct({
    loadId: S.String.pipe(T.HttpLabel("loadId")),
    details: S.optional(S.Boolean).pipe(T.HttpQuery("details")),
    errors: S.optional(S.Boolean).pipe(T.HttpQuery("errors")),
    page: S.optional(S.Number).pipe(T.HttpQuery("page")),
    errorsPerPage: S.optional(S.Number).pipe(T.HttpQuery("errorsPerPage")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/loader/{loadId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLoaderJobStatusInput",
}) as any as S.Schema<GetLoaderJobStatusInput>;
export interface GetMLDataProcessingJobInput {
  id: string;
  neptuneIamRoleArn?: string;
}
export const GetMLDataProcessingJobInput = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ml/dataprocessing/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMLDataProcessingJobInput",
}) as any as S.Schema<GetMLDataProcessingJobInput>;
export interface GetMLEndpointInput {
  id: string;
  neptuneIamRoleArn?: string;
}
export const GetMLEndpointInput = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ml/endpoints/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMLEndpointInput",
}) as any as S.Schema<GetMLEndpointInput>;
export interface GetMLModelTrainingJobInput {
  id: string;
  neptuneIamRoleArn?: string;
}
export const GetMLModelTrainingJobInput = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ml/modeltraining/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMLModelTrainingJobInput",
}) as any as S.Schema<GetMLModelTrainingJobInput>;
export interface GetMLModelTransformJobInput {
  id: string;
  neptuneIamRoleArn?: string;
}
export const GetMLModelTransformJobInput = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ml/modeltransform/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMLModelTransformJobInput",
}) as any as S.Schema<GetMLModelTransformJobInput>;
export interface GetOpenCypherQueryStatusInput {
  queryId: string;
}
export const GetOpenCypherQueryStatusInput = S.suspend(() =>
  S.Struct({ queryId: S.String.pipe(T.HttpLabel("queryId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/opencypher/status/{queryId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOpenCypherQueryStatusInput",
}) as any as S.Schema<GetOpenCypherQueryStatusInput>;
export interface GetPropertygraphStreamInput {
  limit?: number;
  iteratorType?: string;
  commitNum?: number;
  opNum?: number;
  encoding?: string;
}
export const GetPropertygraphStreamInput = S.suspend(() =>
  S.Struct({
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    iteratorType: S.optional(S.String).pipe(T.HttpQuery("iteratorType")),
    commitNum: S.optional(S.Number).pipe(T.HttpQuery("commitNum")),
    opNum: S.optional(S.Number).pipe(T.HttpQuery("opNum")),
    encoding: S.optional(S.String).pipe(T.HttpHeader("Accept-Encoding")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/propertygraph/stream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPropertygraphStreamInput",
}) as any as S.Schema<GetPropertygraphStreamInput>;
export interface GetPropertygraphSummaryInput {
  mode?: string;
}
export const GetPropertygraphSummaryInput = S.suspend(() =>
  S.Struct({ mode: S.optional(S.String).pipe(T.HttpQuery("mode")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/propertygraph/statistics/summary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPropertygraphSummaryInput",
}) as any as S.Schema<GetPropertygraphSummaryInput>;
export interface GetRDFGraphSummaryInput {
  mode?: string;
}
export const GetRDFGraphSummaryInput = S.suspend(() =>
  S.Struct({ mode: S.optional(S.String).pipe(T.HttpQuery("mode")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/rdf/statistics/summary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRDFGraphSummaryInput",
}) as any as S.Schema<GetRDFGraphSummaryInput>;
export interface StatisticsSummary {
  signatureCount?: number;
  instanceCount?: number;
  predicateCount?: number;
}
export const StatisticsSummary = S.suspend(() =>
  S.Struct({
    signatureCount: S.optional(S.Number),
    instanceCount: S.optional(S.Number),
    predicateCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "StatisticsSummary",
}) as any as S.Schema<StatisticsSummary>;
export interface Statistics {
  autoCompute?: boolean;
  active?: boolean;
  statisticsId?: string;
  date?: Date;
  note?: string;
  signatureInfo?: StatisticsSummary;
}
export const Statistics = S.suspend(() =>
  S.Struct({
    autoCompute: S.optional(S.Boolean),
    active: S.optional(S.Boolean),
    statisticsId: S.optional(S.String),
    date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    note: S.optional(S.String),
    signatureInfo: S.optional(StatisticsSummary),
  }),
).annotations({ identifier: "Statistics" }) as any as S.Schema<Statistics>;
export interface GetSparqlStatisticsOutput {
  status: string;
  payload: Statistics;
}
export const GetSparqlStatisticsOutput = S.suspend(() =>
  S.Struct({ status: S.String, payload: Statistics }),
).annotations({
  identifier: "GetSparqlStatisticsOutput",
}) as any as S.Schema<GetSparqlStatisticsOutput>;
export interface GetSparqlStreamInput {
  limit?: number;
  iteratorType?: string;
  commitNum?: number;
  opNum?: number;
  encoding?: string;
}
export const GetSparqlStreamInput = S.suspend(() =>
  S.Struct({
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    iteratorType: S.optional(S.String).pipe(T.HttpQuery("iteratorType")),
    commitNum: S.optional(S.Number).pipe(T.HttpQuery("commitNum")),
    opNum: S.optional(S.Number).pipe(T.HttpQuery("opNum")),
    encoding: S.optional(S.String).pipe(T.HttpHeader("Accept-Encoding")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sparql/stream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSparqlStreamInput",
}) as any as S.Schema<GetSparqlStreamInput>;
export interface ListGremlinQueriesInput {
  includeWaiting?: boolean;
}
export const ListGremlinQueriesInput = S.suspend(() =>
  S.Struct({
    includeWaiting: S.optional(S.Boolean).pipe(T.HttpQuery("includeWaiting")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/gremlin/status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGremlinQueriesInput",
}) as any as S.Schema<ListGremlinQueriesInput>;
export interface ListLoaderJobsInput {
  limit?: number;
  includeQueuedLoads?: boolean;
}
export const ListLoaderJobsInput = S.suspend(() =>
  S.Struct({
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    includeQueuedLoads: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeQueuedLoads"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/loader" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLoaderJobsInput",
}) as any as S.Schema<ListLoaderJobsInput>;
export interface ListMLDataProcessingJobsInput {
  maxItems?: number;
  neptuneIamRoleArn?: string;
}
export const ListMLDataProcessingJobsInput = S.suspend(() =>
  S.Struct({
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ml/dataprocessing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMLDataProcessingJobsInput",
}) as any as S.Schema<ListMLDataProcessingJobsInput>;
export interface ListMLEndpointsInput {
  maxItems?: number;
  neptuneIamRoleArn?: string;
}
export const ListMLEndpointsInput = S.suspend(() =>
  S.Struct({
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ml/endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMLEndpointsInput",
}) as any as S.Schema<ListMLEndpointsInput>;
export interface ListMLModelTrainingJobsInput {
  maxItems?: number;
  neptuneIamRoleArn?: string;
}
export const ListMLModelTrainingJobsInput = S.suspend(() =>
  S.Struct({
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ml/modeltraining" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMLModelTrainingJobsInput",
}) as any as S.Schema<ListMLModelTrainingJobsInput>;
export interface ListMLModelTransformJobsInput {
  maxItems?: number;
  neptuneIamRoleArn?: string;
}
export const ListMLModelTransformJobsInput = S.suspend(() =>
  S.Struct({
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    neptuneIamRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("neptuneIamRoleArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ml/modeltransform" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMLModelTransformJobsInput",
}) as any as S.Schema<ListMLModelTransformJobsInput>;
export interface ListOpenCypherQueriesInput {
  includeWaiting?: boolean;
}
export const ListOpenCypherQueriesInput = S.suspend(() =>
  S.Struct({
    includeWaiting: S.optional(S.Boolean).pipe(T.HttpQuery("includeWaiting")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/opencypher/status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOpenCypherQueriesInput",
}) as any as S.Schema<ListOpenCypherQueriesInput>;
export interface ManagePropertygraphStatisticsInput {
  mode?: string;
}
export const ManagePropertygraphStatisticsInput = S.suspend(() =>
  S.Struct({ mode: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/propertygraph/statistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ManagePropertygraphStatisticsInput",
}) as any as S.Schema<ManagePropertygraphStatisticsInput>;
export interface ManageSparqlStatisticsInput {
  mode?: string;
}
export const ManageSparqlStatisticsInput = S.suspend(() =>
  S.Struct({ mode: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sparql/statistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ManageSparqlStatisticsInput",
}) as any as S.Schema<ManageSparqlStatisticsInput>;
export type StringValuedMap = { [key: string]: string };
export const StringValuedMap = S.Record({ key: S.String, value: S.String });
export interface StartLoaderJobInput {
  source: string;
  format: string;
  s3BucketRegion: string;
  iamRoleArn: string;
  mode?: string;
  failOnError?: boolean;
  parallelism?: string;
  parserConfiguration?: StringValuedMap;
  updateSingleCardinalityProperties?: boolean;
  queueRequest?: boolean;
  dependencies?: StringList;
  userProvidedEdgeIds?: boolean;
}
export const StartLoaderJobInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/loader" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartLoaderJobInput",
}) as any as S.Schema<StartLoaderJobInput>;
export interface StartMLDataProcessingJobInput {
  id?: string;
  previousDataProcessingJobId?: string;
  inputDataS3Location: string;
  processedDataS3Location: string;
  sagemakerIamRoleArn?: string;
  neptuneIamRoleArn?: string;
  processingInstanceType?: string;
  processingInstanceVolumeSizeInGB?: number;
  processingTimeOutInSeconds?: number;
  modelType?: string;
  configFileName?: string;
  subnets?: StringList;
  securityGroupIds?: StringList;
  volumeEncryptionKMSKey?: string;
  s3OutputEncryptionKMSKey?: string;
}
export const StartMLDataProcessingJobInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ml/dataprocessing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMLDataProcessingJobInput",
}) as any as S.Schema<StartMLDataProcessingJobInput>;
export interface QueryLanguageVersion {
  version: string;
}
export const QueryLanguageVersion = S.suspend(() =>
  S.Struct({ version: S.String }),
).annotations({
  identifier: "QueryLanguageVersion",
}) as any as S.Schema<QueryLanguageVersion>;
export type DocumentValuedMap = { [key: string]: any };
export const DocumentValuedMap = S.Record({ key: S.String, value: S.Any });
export interface MlConfigDefinition {
  name?: string;
  arn?: string;
}
export const MlConfigDefinition = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "MlConfigDefinition",
}) as any as S.Schema<MlConfigDefinition>;
export type MlModels = MlConfigDefinition[];
export const MlModels = S.Array(MlConfigDefinition);
export type Models = MlConfigDefinition[];
export const Models = S.Array(MlConfigDefinition);
export interface QueryEvalStats {
  waited?: number;
  elapsed?: number;
  cancelled?: boolean;
  subqueries?: any;
}
export const QueryEvalStats = S.suspend(() =>
  S.Struct({
    waited: S.optional(S.Number),
    elapsed: S.optional(S.Number),
    cancelled: S.optional(S.Boolean),
    subqueries: S.optional(S.Any),
  }),
).annotations({
  identifier: "QueryEvalStats",
}) as any as S.Schema<QueryEvalStats>;
export interface GremlinQueryStatus {
  queryId?: string;
  queryString?: string;
  queryEvalStats?: QueryEvalStats;
}
export const GremlinQueryStatus = S.suspend(() =>
  S.Struct({
    queryId: S.optional(S.String),
    queryString: S.optional(S.String),
    queryEvalStats: S.optional(QueryEvalStats),
  }),
).annotations({
  identifier: "GremlinQueryStatus",
}) as any as S.Schema<GremlinQueryStatus>;
export type OpenCypherQueries = GremlinQueryStatus[];
export const OpenCypherQueries = S.Array(GremlinQueryStatus);
export interface CustomModelTrainingParameters {
  sourceS3DirectoryPath: string;
  trainingEntryPointScript?: string;
  transformEntryPointScript?: string;
}
export const CustomModelTrainingParameters = S.suspend(() =>
  S.Struct({
    sourceS3DirectoryPath: S.String,
    trainingEntryPointScript: S.optional(S.String),
    transformEntryPointScript: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomModelTrainingParameters",
}) as any as S.Schema<CustomModelTrainingParameters>;
export interface CustomModelTransformParameters {
  sourceS3DirectoryPath: string;
  transformEntryPointScript?: string;
}
export const CustomModelTransformParameters = S.suspend(() =>
  S.Struct({
    sourceS3DirectoryPath: S.String,
    transformEntryPointScript: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomModelTransformParameters",
}) as any as S.Schema<CustomModelTransformParameters>;
export interface CancelGremlinQueryOutput {
  status?: string;
}
export const CancelGremlinQueryOutput = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "CancelGremlinQueryOutput",
}) as any as S.Schema<CancelGremlinQueryOutput>;
export interface CancelLoaderJobOutput {
  status?: string;
}
export const CancelLoaderJobOutput = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "CancelLoaderJobOutput",
}) as any as S.Schema<CancelLoaderJobOutput>;
export interface CancelMLDataProcessingJobOutput {
  status?: string;
}
export const CancelMLDataProcessingJobOutput = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "CancelMLDataProcessingJobOutput",
}) as any as S.Schema<CancelMLDataProcessingJobOutput>;
export interface CancelMLModelTrainingJobOutput {
  status?: string;
}
export const CancelMLModelTrainingJobOutput = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "CancelMLModelTrainingJobOutput",
}) as any as S.Schema<CancelMLModelTrainingJobOutput>;
export interface CancelMLModelTransformJobOutput {
  status?: string;
}
export const CancelMLModelTransformJobOutput = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "CancelMLModelTransformJobOutput",
}) as any as S.Schema<CancelMLModelTransformJobOutput>;
export interface CancelOpenCypherQueryOutput {
  status?: string;
  payload?: boolean;
}
export const CancelOpenCypherQueryOutput = S.suspend(() =>
  S.Struct({ status: S.optional(S.String), payload: S.optional(S.Boolean) }),
).annotations({
  identifier: "CancelOpenCypherQueryOutput",
}) as any as S.Schema<CancelOpenCypherQueryOutput>;
export interface CreateMLEndpointOutput {
  id?: string;
  arn?: string;
  creationTimeInMillis?: number;
}
export const CreateMLEndpointOutput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    creationTimeInMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateMLEndpointOutput",
}) as any as S.Schema<CreateMLEndpointOutput>;
export interface DeleteMLEndpointOutput {
  status?: string;
}
export const DeleteMLEndpointOutput = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "DeleteMLEndpointOutput",
}) as any as S.Schema<DeleteMLEndpointOutput>;
export interface DeletePropertygraphStatisticsOutput {
  statusCode?: number;
  status?: string;
  payload?: DeleteStatisticsValueMap;
}
export const DeletePropertygraphStatisticsOutput = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
    status: S.optional(S.String),
    payload: S.optional(DeleteStatisticsValueMap),
  }),
).annotations({
  identifier: "DeletePropertygraphStatisticsOutput",
}) as any as S.Schema<DeletePropertygraphStatisticsOutput>;
export interface ExecuteGremlinExplainQueryOutput {
  output?: T.StreamingOutputBody;
}
export const ExecuteGremlinExplainQueryOutput = S.suspend(() =>
  S.Struct({ output: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }),
).annotations({
  identifier: "ExecuteGremlinExplainQueryOutput",
}) as any as S.Schema<ExecuteGremlinExplainQueryOutput>;
export interface ExecuteGremlinProfileQueryOutput {
  output?: T.StreamingOutputBody;
}
export const ExecuteGremlinProfileQueryOutput = S.suspend(() =>
  S.Struct({ output: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }),
).annotations({
  identifier: "ExecuteGremlinProfileQueryOutput",
}) as any as S.Schema<ExecuteGremlinProfileQueryOutput>;
export interface ExecuteOpenCypherExplainQueryOutput {
  results: Uint8Array;
}
export const ExecuteOpenCypherExplainQueryOutput = S.suspend(() =>
  S.Struct({ results: T.Blob.pipe(T.HttpPayload()) }),
).annotations({
  identifier: "ExecuteOpenCypherExplainQueryOutput",
}) as any as S.Schema<ExecuteOpenCypherExplainQueryOutput>;
export interface ExecuteOpenCypherQueryOutput {
  results: any;
}
export const ExecuteOpenCypherQueryOutput = S.suspend(() =>
  S.Struct({ results: S.Any }),
).annotations({
  identifier: "ExecuteOpenCypherQueryOutput",
}) as any as S.Schema<ExecuteOpenCypherQueryOutput>;
export interface GetEngineStatusOutput {
  status?: string;
  startTime?: string;
  dbEngineVersion?: string;
  role?: string;
  dfeQueryEngine?: string;
  gremlin?: QueryLanguageVersion;
  sparql?: QueryLanguageVersion;
  opencypher?: QueryLanguageVersion;
  labMode?: StringValuedMap;
  rollingBackTrxCount?: number;
  rollingBackTrxEarliestStartTime?: string;
  features?: DocumentValuedMap;
  settings?: StringValuedMap;
}
export const GetEngineStatusOutput = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetEngineStatusOutput",
}) as any as S.Schema<GetEngineStatusOutput>;
export interface GetLoaderJobStatusOutput {
  status: string;
  payload: any;
}
export const GetLoaderJobStatusOutput = S.suspend(() =>
  S.Struct({ status: S.String, payload: S.Any }),
).annotations({
  identifier: "GetLoaderJobStatusOutput",
}) as any as S.Schema<GetLoaderJobStatusOutput>;
export interface MlResourceDefinition {
  name?: string;
  arn?: string;
  status?: string;
  outputLocation?: string;
  failureReason?: string;
  cloudwatchLogUrl?: string;
}
export const MlResourceDefinition = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(S.String),
    outputLocation: S.optional(S.String),
    failureReason: S.optional(S.String),
    cloudwatchLogUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "MlResourceDefinition",
}) as any as S.Schema<MlResourceDefinition>;
export interface GetMLModelTrainingJobOutput {
  status?: string;
  id?: string;
  processingJob?: MlResourceDefinition;
  hpoJob?: MlResourceDefinition;
  modelTransformJob?: MlResourceDefinition;
  mlModels?: MlModels;
}
export const GetMLModelTrainingJobOutput = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    id: S.optional(S.String),
    processingJob: S.optional(MlResourceDefinition),
    hpoJob: S.optional(MlResourceDefinition),
    modelTransformJob: S.optional(MlResourceDefinition),
    mlModels: S.optional(MlModels),
  }),
).annotations({
  identifier: "GetMLModelTrainingJobOutput",
}) as any as S.Schema<GetMLModelTrainingJobOutput>;
export interface GetMLModelTransformJobOutput {
  status?: string;
  id?: string;
  baseProcessingJob?: MlResourceDefinition;
  remoteModelTransformJob?: MlResourceDefinition;
  models?: Models;
}
export const GetMLModelTransformJobOutput = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    id: S.optional(S.String),
    baseProcessingJob: S.optional(MlResourceDefinition),
    remoteModelTransformJob: S.optional(MlResourceDefinition),
    models: S.optional(Models),
  }),
).annotations({
  identifier: "GetMLModelTransformJobOutput",
}) as any as S.Schema<GetMLModelTransformJobOutput>;
export interface GetOpenCypherQueryStatusOutput {
  queryId?: string;
  queryString?: string;
  queryEvalStats?: QueryEvalStats;
}
export const GetOpenCypherQueryStatusOutput = S.suspend(() =>
  S.Struct({
    queryId: S.optional(S.String),
    queryString: S.optional(S.String),
    queryEvalStats: S.optional(QueryEvalStats),
  }),
).annotations({
  identifier: "GetOpenCypherQueryStatusOutput",
}) as any as S.Schema<GetOpenCypherQueryStatusOutput>;
export interface ListMLDataProcessingJobsOutput {
  ids?: StringList;
}
export const ListMLDataProcessingJobsOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(StringList) }),
).annotations({
  identifier: "ListMLDataProcessingJobsOutput",
}) as any as S.Schema<ListMLDataProcessingJobsOutput>;
export interface ListMLEndpointsOutput {
  ids?: StringList;
}
export const ListMLEndpointsOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(StringList) }),
).annotations({
  identifier: "ListMLEndpointsOutput",
}) as any as S.Schema<ListMLEndpointsOutput>;
export interface ListMLModelTrainingJobsOutput {
  ids?: StringList;
}
export const ListMLModelTrainingJobsOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(StringList) }),
).annotations({
  identifier: "ListMLModelTrainingJobsOutput",
}) as any as S.Schema<ListMLModelTrainingJobsOutput>;
export interface ListMLModelTransformJobsOutput {
  ids?: StringList;
}
export const ListMLModelTransformJobsOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(StringList) }),
).annotations({
  identifier: "ListMLModelTransformJobsOutput",
}) as any as S.Schema<ListMLModelTransformJobsOutput>;
export interface ListOpenCypherQueriesOutput {
  acceptedQueryCount?: number;
  runningQueryCount?: number;
  queries?: OpenCypherQueries;
}
export const ListOpenCypherQueriesOutput = S.suspend(() =>
  S.Struct({
    acceptedQueryCount: S.optional(S.Number),
    runningQueryCount: S.optional(S.Number),
    queries: S.optional(OpenCypherQueries),
  }),
).annotations({
  identifier: "ListOpenCypherQueriesOutput",
}) as any as S.Schema<ListOpenCypherQueriesOutput>;
export interface RefreshStatisticsIdMap {
  statisticsId?: string;
}
export const RefreshStatisticsIdMap = S.suspend(() =>
  S.Struct({ statisticsId: S.optional(S.String) }),
).annotations({
  identifier: "RefreshStatisticsIdMap",
}) as any as S.Schema<RefreshStatisticsIdMap>;
export interface ManageSparqlStatisticsOutput {
  status: string;
  payload?: RefreshStatisticsIdMap;
}
export const ManageSparqlStatisticsOutput = S.suspend(() =>
  S.Struct({ status: S.String, payload: S.optional(RefreshStatisticsIdMap) }),
).annotations({
  identifier: "ManageSparqlStatisticsOutput",
}) as any as S.Schema<ManageSparqlStatisticsOutput>;
export interface StartLoaderJobOutput {
  status: string;
  payload: StringValuedMap;
}
export const StartLoaderJobOutput = S.suspend(() =>
  S.Struct({ status: S.String, payload: StringValuedMap }),
).annotations({
  identifier: "StartLoaderJobOutput",
}) as any as S.Schema<StartLoaderJobOutput>;
export interface StartMLDataProcessingJobOutput {
  id?: string;
  arn?: string;
  creationTimeInMillis?: number;
}
export const StartMLDataProcessingJobOutput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    creationTimeInMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "StartMLDataProcessingJobOutput",
}) as any as S.Schema<StartMLDataProcessingJobOutput>;
export interface StartMLModelTrainingJobInput {
  id?: string;
  previousModelTrainingJobId?: string;
  dataProcessingJobId: string;
  trainModelS3Location: string;
  sagemakerIamRoleArn?: string;
  neptuneIamRoleArn?: string;
  baseProcessingInstanceType?: string;
  trainingInstanceType?: string;
  trainingInstanceVolumeSizeInGB?: number;
  trainingTimeOutInSeconds?: number;
  maxHPONumberOfTrainingJobs?: number;
  maxHPOParallelTrainingJobs?: number;
  subnets?: StringList;
  securityGroupIds?: StringList;
  volumeEncryptionKMSKey?: string;
  s3OutputEncryptionKMSKey?: string;
  enableManagedSpotTraining?: boolean;
  customModelTrainingParameters?: CustomModelTrainingParameters;
}
export const StartMLModelTrainingJobInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ml/modeltraining" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMLModelTrainingJobInput",
}) as any as S.Schema<StartMLModelTrainingJobInput>;
export interface StartMLModelTransformJobInput {
  id?: string;
  dataProcessingJobId?: string;
  mlModelTrainingJobId?: string;
  trainingJobName?: string;
  modelTransformOutputS3Location: string;
  sagemakerIamRoleArn?: string;
  neptuneIamRoleArn?: string;
  customModelTransformParameters?: CustomModelTransformParameters;
  baseProcessingInstanceType?: string;
  baseProcessingInstanceVolumeSizeInGB?: number;
  subnets?: StringList;
  securityGroupIds?: StringList;
  volumeEncryptionKMSKey?: string;
  s3OutputEncryptionKMSKey?: string;
}
export const StartMLModelTransformJobInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ml/modeltransform" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMLModelTransformJobInput",
}) as any as S.Schema<StartMLModelTransformJobInput>;
export interface FastResetToken {
  token?: string;
}
export const FastResetToken = S.suspend(() =>
  S.Struct({ token: S.optional(S.String) }),
).annotations({
  identifier: "FastResetToken",
}) as any as S.Schema<FastResetToken>;
export interface GremlinQueryStatusAttributes {
  message?: string;
  code?: number;
  attributes?: any;
}
export const GremlinQueryStatusAttributes = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    code: S.optional(S.Number),
    attributes: S.optional(S.Any),
  }),
).annotations({
  identifier: "GremlinQueryStatusAttributes",
}) as any as S.Schema<GremlinQueryStatusAttributes>;
export type GremlinQueries = GremlinQueryStatus[];
export const GremlinQueries = S.Array(GremlinQueryStatus);
export interface LoaderIdResult {
  loadIds?: StringList;
}
export const LoaderIdResult = S.suspend(() =>
  S.Struct({ loadIds: S.optional(StringList) }),
).annotations({
  identifier: "LoaderIdResult",
}) as any as S.Schema<LoaderIdResult>;
export type NodeLabels = string[];
export const NodeLabels = S.Array(S.String);
export type EdgeLabels = string[];
export const EdgeLabels = S.Array(S.String);
export type Classes = string[];
export const Classes = S.Array(S.String);
export interface ExecuteFastResetOutput {
  status: string;
  payload?: FastResetToken;
}
export const ExecuteFastResetOutput = S.suspend(() =>
  S.Struct({ status: S.String, payload: S.optional(FastResetToken) }),
).annotations({
  identifier: "ExecuteFastResetOutput",
}) as any as S.Schema<ExecuteFastResetOutput>;
export interface ExecuteGremlinQueryOutput {
  requestId?: string;
  status?: GremlinQueryStatusAttributes;
  result?: any;
  meta?: any;
}
export const ExecuteGremlinQueryOutput = S.suspend(() =>
  S.Struct({
    requestId: S.optional(S.String),
    status: S.optional(GremlinQueryStatusAttributes),
    result: S.optional(S.Any),
    meta: S.optional(S.Any),
  }),
).annotations({
  identifier: "ExecuteGremlinQueryOutput",
}) as any as S.Schema<ExecuteGremlinQueryOutput>;
export interface GetGremlinQueryStatusOutput {
  queryId?: string;
  queryString?: string;
  queryEvalStats?: QueryEvalStats;
}
export const GetGremlinQueryStatusOutput = S.suspend(() =>
  S.Struct({
    queryId: S.optional(S.String),
    queryString: S.optional(S.String),
    queryEvalStats: S.optional(QueryEvalStats),
  }),
).annotations({
  identifier: "GetGremlinQueryStatusOutput",
}) as any as S.Schema<GetGremlinQueryStatusOutput>;
export interface GetMLDataProcessingJobOutput {
  status?: string;
  id?: string;
  processingJob?: MlResourceDefinition;
}
export const GetMLDataProcessingJobOutput = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    id: S.optional(S.String),
    processingJob: S.optional(MlResourceDefinition),
  }),
).annotations({
  identifier: "GetMLDataProcessingJobOutput",
}) as any as S.Schema<GetMLDataProcessingJobOutput>;
export interface GetMLEndpointOutput {
  status?: string;
  id?: string;
  endpoint?: MlResourceDefinition;
  endpointConfig?: MlConfigDefinition;
}
export const GetMLEndpointOutput = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    id: S.optional(S.String),
    endpoint: S.optional(MlResourceDefinition),
    endpointConfig: S.optional(MlConfigDefinition),
  }),
).annotations({
  identifier: "GetMLEndpointOutput",
}) as any as S.Schema<GetMLEndpointOutput>;
export interface GetPropertygraphStatisticsOutput {
  status: string;
  payload: Statistics;
}
export const GetPropertygraphStatisticsOutput = S.suspend(() =>
  S.Struct({ status: S.String, payload: Statistics }),
).annotations({
  identifier: "GetPropertygraphStatisticsOutput",
}) as any as S.Schema<GetPropertygraphStatisticsOutput>;
export interface ListGremlinQueriesOutput {
  acceptedQueryCount?: number;
  runningQueryCount?: number;
  queries?: GremlinQueries;
}
export const ListGremlinQueriesOutput = S.suspend(() =>
  S.Struct({
    acceptedQueryCount: S.optional(S.Number),
    runningQueryCount: S.optional(S.Number),
    queries: S.optional(GremlinQueries),
  }),
).annotations({
  identifier: "ListGremlinQueriesOutput",
}) as any as S.Schema<ListGremlinQueriesOutput>;
export interface ListLoaderJobsOutput {
  status: string;
  payload: LoaderIdResult;
}
export const ListLoaderJobsOutput = S.suspend(() =>
  S.Struct({ status: S.String, payload: LoaderIdResult }),
).annotations({
  identifier: "ListLoaderJobsOutput",
}) as any as S.Schema<ListLoaderJobsOutput>;
export interface ManagePropertygraphStatisticsOutput {
  status: string;
  payload?: RefreshStatisticsIdMap;
}
export const ManagePropertygraphStatisticsOutput = S.suspend(() =>
  S.Struct({ status: S.String, payload: S.optional(RefreshStatisticsIdMap) }),
).annotations({
  identifier: "ManagePropertygraphStatisticsOutput",
}) as any as S.Schema<ManagePropertygraphStatisticsOutput>;
export interface StartMLModelTrainingJobOutput {
  id?: string;
  arn?: string;
  creationTimeInMillis?: number;
}
export const StartMLModelTrainingJobOutput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    creationTimeInMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "StartMLModelTrainingJobOutput",
}) as any as S.Schema<StartMLModelTrainingJobOutput>;
export interface StartMLModelTransformJobOutput {
  id?: string;
  arn?: string;
  creationTimeInMillis?: number;
}
export const StartMLModelTransformJobOutput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    creationTimeInMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "StartMLModelTransformJobOutput",
}) as any as S.Schema<StartMLModelTransformJobOutput>;
export interface PropertygraphData {
  id: string;
  type: string;
  key: string;
  value: any;
  from?: string;
  to?: string;
}
export const PropertygraphData = S.suspend(() =>
  S.Struct({
    id: S.String,
    type: S.String,
    key: S.String,
    value: S.Any,
    from: S.optional(S.String),
    to: S.optional(S.String),
  }),
).annotations({
  identifier: "PropertygraphData",
}) as any as S.Schema<PropertygraphData>;
export interface SparqlData {
  stmt: string;
}
export const SparqlData = S.suspend(() =>
  S.Struct({ stmt: S.String }),
).annotations({ identifier: "SparqlData" }) as any as S.Schema<SparqlData>;
export type NodeProperties = string[];
export const NodeProperties = S.Array(S.String);
export type OutgoingEdgeLabels = string[];
export const OutgoingEdgeLabels = S.Array(S.String);
export type EdgeProperties = string[];
export const EdgeProperties = S.Array(S.String);
export type Predicates = string[];
export const Predicates = S.Array(S.String);
export interface PropertygraphRecord {
  commitTimestampInMillis: number;
  eventId: StringValuedMap;
  data: PropertygraphData;
  op: string;
  isLastOp?: boolean;
}
export const PropertygraphRecord = S.suspend(() =>
  S.Struct({
    commitTimestampInMillis: S.Number.pipe(T.JsonName("commitTimestamp")),
    eventId: StringValuedMap,
    data: PropertygraphData,
    op: S.String,
    isLastOp: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PropertygraphRecord",
}) as any as S.Schema<PropertygraphRecord>;
export type PropertygraphRecordsList = PropertygraphRecord[];
export const PropertygraphRecordsList = S.Array(PropertygraphRecord);
export interface SparqlRecord {
  commitTimestampInMillis: number;
  eventId: StringValuedMap;
  data: SparqlData;
  op: string;
  isLastOp?: boolean;
}
export const SparqlRecord = S.suspend(() =>
  S.Struct({
    commitTimestampInMillis: S.Number.pipe(T.JsonName("commitTimestamp")),
    eventId: StringValuedMap,
    data: SparqlData,
    op: S.String,
    isLastOp: S.optional(S.Boolean),
  }),
).annotations({ identifier: "SparqlRecord" }) as any as S.Schema<SparqlRecord>;
export type SparqlRecordsList = SparqlRecord[];
export const SparqlRecordsList = S.Array(SparqlRecord);
export type LongValuedMap = { [key: string]: number };
export const LongValuedMap = S.Record({ key: S.String, value: S.Number });
export type LongValuedMapList = LongValuedMap[];
export const LongValuedMapList = S.Array(LongValuedMap);
export interface NodeStructure {
  count?: number;
  nodeProperties?: NodeProperties;
  distinctOutgoingEdgeLabels?: OutgoingEdgeLabels;
}
export const NodeStructure = S.suspend(() =>
  S.Struct({
    count: S.optional(S.Number),
    nodeProperties: S.optional(NodeProperties),
    distinctOutgoingEdgeLabels: S.optional(OutgoingEdgeLabels),
  }),
).annotations({
  identifier: "NodeStructure",
}) as any as S.Schema<NodeStructure>;
export type NodeStructures = NodeStructure[];
export const NodeStructures = S.Array(NodeStructure);
export interface EdgeStructure {
  count?: number;
  edgeProperties?: EdgeProperties;
}
export const EdgeStructure = S.suspend(() =>
  S.Struct({
    count: S.optional(S.Number),
    edgeProperties: S.optional(EdgeProperties),
  }),
).annotations({
  identifier: "EdgeStructure",
}) as any as S.Schema<EdgeStructure>;
export type EdgeStructures = EdgeStructure[];
export const EdgeStructures = S.Array(EdgeStructure);
export interface SubjectStructure {
  count?: number;
  predicates?: Predicates;
}
export const SubjectStructure = S.suspend(() =>
  S.Struct({ count: S.optional(S.Number), predicates: S.optional(Predicates) }),
).annotations({
  identifier: "SubjectStructure",
}) as any as S.Schema<SubjectStructure>;
export type SubjectStructures = SubjectStructure[];
export const SubjectStructures = S.Array(SubjectStructure);
export interface GetPropertygraphStreamOutput {
  lastEventId: StringValuedMap;
  lastTrxTimestampInMillis: number;
  format: string;
  records: PropertygraphRecordsList;
  totalRecords: number;
}
export const GetPropertygraphStreamOutput = S.suspend(() =>
  S.Struct({
    lastEventId: StringValuedMap,
    lastTrxTimestampInMillis: S.Number.pipe(T.JsonName("lastTrxTimestamp")),
    format: S.String,
    records: PropertygraphRecordsList,
    totalRecords: S.Number,
  }),
).annotations({
  identifier: "GetPropertygraphStreamOutput",
}) as any as S.Schema<GetPropertygraphStreamOutput>;
export interface GetSparqlStreamOutput {
  lastEventId: StringValuedMap;
  lastTrxTimestampInMillis: number;
  format: string;
  records: SparqlRecordsList;
  totalRecords: number;
}
export const GetSparqlStreamOutput = S.suspend(() =>
  S.Struct({
    lastEventId: StringValuedMap,
    lastTrxTimestampInMillis: S.Number.pipe(T.JsonName("lastTrxTimestamp")),
    format: S.String,
    records: SparqlRecordsList,
    totalRecords: S.Number,
  }),
).annotations({
  identifier: "GetSparqlStreamOutput",
}) as any as S.Schema<GetSparqlStreamOutput>;
export interface PropertygraphSummary {
  numNodes?: number;
  numEdges?: number;
  numNodeLabels?: number;
  numEdgeLabels?: number;
  nodeLabels?: NodeLabels;
  edgeLabels?: EdgeLabels;
  numNodeProperties?: number;
  numEdgeProperties?: number;
  nodeProperties?: LongValuedMapList;
  edgeProperties?: LongValuedMapList;
  totalNodePropertyValues?: number;
  totalEdgePropertyValues?: number;
  nodeStructures?: NodeStructures;
  edgeStructures?: EdgeStructures;
}
export const PropertygraphSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "PropertygraphSummary",
}) as any as S.Schema<PropertygraphSummary>;
export interface RDFGraphSummary {
  numDistinctSubjects?: number;
  numDistinctPredicates?: number;
  numQuads?: number;
  numClasses?: number;
  classes?: Classes;
  predicates?: LongValuedMapList;
  subjectStructures?: SubjectStructures;
}
export const RDFGraphSummary = S.suspend(() =>
  S.Struct({
    numDistinctSubjects: S.optional(S.Number),
    numDistinctPredicates: S.optional(S.Number),
    numQuads: S.optional(S.Number),
    numClasses: S.optional(S.Number),
    classes: S.optional(Classes),
    predicates: S.optional(LongValuedMapList),
    subjectStructures: S.optional(SubjectStructures),
  }),
).annotations({
  identifier: "RDFGraphSummary",
}) as any as S.Schema<RDFGraphSummary>;
export interface PropertygraphSummaryValueMap {
  version?: string;
  lastStatisticsComputationTime?: Date;
  graphSummary?: PropertygraphSummary;
}
export const PropertygraphSummaryValueMap = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    lastStatisticsComputationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    graphSummary: S.optional(PropertygraphSummary),
  }),
).annotations({
  identifier: "PropertygraphSummaryValueMap",
}) as any as S.Schema<PropertygraphSummaryValueMap>;
export interface RDFGraphSummaryValueMap {
  version?: string;
  lastStatisticsComputationTime?: Date;
  graphSummary?: RDFGraphSummary;
}
export const RDFGraphSummaryValueMap = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    lastStatisticsComputationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    graphSummary: S.optional(RDFGraphSummary),
  }),
).annotations({
  identifier: "RDFGraphSummaryValueMap",
}) as any as S.Schema<RDFGraphSummaryValueMap>;
export interface GetPropertygraphSummaryOutput {
  statusCode?: number;
  payload?: PropertygraphSummaryValueMap;
}
export const GetPropertygraphSummaryOutput = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
    payload: S.optional(PropertygraphSummaryValueMap),
  }),
).annotations({
  identifier: "GetPropertygraphSummaryOutput",
}) as any as S.Schema<GetPropertygraphSummaryOutput>;
export interface GetRDFGraphSummaryOutput {
  statusCode?: number;
  payload?: RDFGraphSummaryValueMap;
}
export const GetRDFGraphSummaryOutput = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
    payload: S.optional(RDFGraphSummaryValueMap),
  }),
).annotations({
  identifier: "GetRDFGraphSummaryOutput",
}) as any as S.Schema<GetRDFGraphSummaryOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withAuthError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class ClientTimeoutException extends S.TaggedError<ClientTimeoutException>()(
  "ClientTimeoutException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withTimeoutError, C.withRetryableError) {}
export class CancelledByUserException extends S.TaggedError<CancelledByUserException>()(
  "CancelledByUserException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withServerError) {}
export class ConstraintViolationException extends S.TaggedError<ConstraintViolationException>()(
  "ConstraintViolationException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withBadRequestError, C.withRetryableError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class BulkLoadIdNotFoundException extends S.TaggedError<BulkLoadIdNotFoundException>()(
  "BulkLoadIdNotFoundException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withBadRequestError, C.withRetryableError) {}
export class IllegalArgumentException extends S.TaggedError<IllegalArgumentException>()(
  "IllegalArgumentException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class FailureByQueryException extends S.TaggedError<FailureByQueryException>()(
  "FailureByQueryException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ExpiredStreamException extends S.TaggedError<ExpiredStreamException>()(
  "ExpiredStreamException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withServerError) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class InvalidNumericDataException extends S.TaggedError<InvalidNumericDataException>()(
  "InvalidNumericDataException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class PreconditionsFailedException extends S.TaggedError<PreconditionsFailedException>()(
  "PreconditionsFailedException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class MissingParameterException extends S.TaggedError<MissingParameterException>()(
  "MissingParameterException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class MalformedQueryException extends S.TaggedError<MalformedQueryException>()(
  "MalformedQueryException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class LoadUrlAccessDeniedException extends S.TaggedError<LoadUrlAccessDeniedException>()(
  "LoadUrlAccessDeniedException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class MemoryLimitExceededException extends S.TaggedError<MemoryLimitExceededException>()(
  "MemoryLimitExceededException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class MethodNotAllowedException extends S.TaggedError<MethodNotAllowedException>()(
  "MethodNotAllowedException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class ParsingException extends S.TaggedError<ParsingException>()(
  "ParsingException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class StreamRecordsNotFoundException extends S.TaggedError<StreamRecordsNotFoundException>()(
  "StreamRecordsNotFoundException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class ReadOnlyViolationException extends S.TaggedError<ReadOnlyViolationException>()(
  "ReadOnlyViolationException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class MLResourceNotFoundException extends S.TaggedError<MLResourceNotFoundException>()(
  "MLResourceNotFoundException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class S3Exception extends S.TaggedError<S3Exception>()(
  "S3Exception",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withBadRequestError, C.withRetryableError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ServerShutdownException extends S.TaggedError<ServerShutdownException>()(
  "ServerShutdownException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withServerError) {}
export class TimeLimitExceededException extends S.TaggedError<TimeLimitExceededException>()(
  "TimeLimitExceededException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class QueryLimitExceededException extends S.TaggedError<QueryLimitExceededException>()(
  "QueryLimitExceededException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class StatisticsNotAvailableException extends S.TaggedError<StatisticsNotAvailableException>()(
  "StatisticsNotAvailableException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class QueryLimitException extends S.TaggedError<QueryLimitException>()(
  "QueryLimitException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}
export class QueryTooLargeException extends S.TaggedError<QueryTooLargeException>()(
  "QueryTooLargeException",
  { detailedMessage: S.String, requestId: S.String, code: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves the status of the graph database on the host.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetEngineStatus IAM action in that cluster.
 */
export const getEngineStatus: (
  input: GetEngineStatusRequest,
) => Effect.Effect<
  GetEngineStatusOutput,
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InternalFailureException
  | InvalidArgumentException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about a specified data processing job. See The `dataprocessing` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:neptune-db:GetMLDataProcessingJobStatus IAM action in that cluster.
 */
export const getMLDataProcessingJob: (
  input: GetMLDataProcessingJobInput,
) => Effect.Effect<
  GetMLDataProcessingJobOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves a list of the `loadIds` for all active loader jobs.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ListLoaderJobs IAM action in that cluster..
 */
export const listLoaderJobs: (
  input: ListLoaderJobsInput,
) => Effect.Effect<
  ListLoaderJobsOutput,
  | BadRequestException
  | BulkLoadIdNotFoundException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InternalFailureException
  | InvalidArgumentException
  | InvalidParameterException
  | LoadUrlAccessDeniedException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Cancels a specified load job. This is an HTTP `DELETE` request. See Neptune Loader Get-Status API for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelLoaderJob IAM action in that cluster..
 */
export const cancelLoaderJob: (
  input: CancelLoaderJobInput,
) => Effect.Effect<
  CancelLoaderJobOutput,
  | BadRequestException
  | BulkLoadIdNotFoundException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InternalFailureException
  | InvalidArgumentException
  | InvalidParameterException
  | LoadUrlAccessDeniedException
  | MissingParameterException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets status information about a specified load job. Neptune keeps track of the most recent 1,024 bulk load jobs, and stores the last 10,000 error details per job.
 *
 * See Neptune Loader Get-Status API for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetLoaderJobStatus IAM action in that cluster..
 */
export const getLoaderJobStatus: (
  input: GetLoaderJobStatusInput,
) => Effect.Effect<
  GetLoaderJobStatusOutput,
  | BadRequestException
  | BulkLoadIdNotFoundException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InternalFailureException
  | InvalidArgumentException
  | InvalidParameterException
  | LoadUrlAccessDeniedException
  | MissingParameterException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Starts a Neptune bulk loader job to load data from an Amazon S3 bucket into a Neptune DB instance. See Using the Amazon Neptune Bulk Loader to Ingest Data.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:StartLoaderJob IAM action in that cluster.
 */
export const startLoaderJob: (
  input: StartLoaderJobInput,
) => Effect.Effect<
  StartLoaderJobOutput,
  | BadRequestException
  | BulkLoadIdNotFoundException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InternalFailureException
  | InvalidArgumentException
  | InvalidParameterException
  | LoadUrlAccessDeniedException
  | MissingParameterException
  | PreconditionsFailedException
  | S3Exception
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves details about an inference endpoint. See Managing inference endpoints using the endpoints command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetMLEndpointStatus IAM action in that cluster.
 */
export const getMLEndpoint: (
  input: GetMLEndpointInput,
) => Effect.Effect<
  GetMLEndpointOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new Neptune ML model training job. See Model training using the `modeltraining` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:StartMLModelTrainingJob IAM action in that cluster.
 */
export const startMLModelTrainingJob: (
  input: StartMLModelTrainingJobInput,
) => Effect.Effect<
  StartMLModelTrainingJobOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new model transform job. See Use a trained model to generate new model artifacts.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:StartMLModelTransformJob IAM action in that cluster.
 */
export const startMLModelTransformJob: (
  input: StartMLModelTransformJobInput,
) => Effect.Effect<
  StartMLModelTransformJobOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Cancels a Neptune ML data processing job. See The `dataprocessing` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelMLDataProcessingJob IAM action in that cluster.
 */
export const cancelMLDataProcessingJob: (
  input: CancelMLDataProcessingJobInput,
) => Effect.Effect<
  CancelMLDataProcessingJobOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Cancels a Neptune ML model training job. See Model training using the `modeltraining` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelMLModelTrainingJob IAM action in that cluster.
 */
export const cancelMLModelTrainingJob: (
  input: CancelMLModelTrainingJobInput,
) => Effect.Effect<
  CancelMLModelTrainingJobOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Cancels a specified model transform job. See Use a trained model to generate new model artifacts.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelMLModelTransformJob IAM action in that cluster.
 */
export const cancelMLModelTransformJob: (
  input: CancelMLModelTransformJobInput,
) => Effect.Effect<
  CancelMLModelTransformJobOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new Neptune ML inference endpoint that lets you query one specific model that the model-training process constructed. See Managing inference endpoints using the endpoints command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CreateMLEndpoint IAM action in that cluster.
 */
export const createMLEndpoint: (
  input: CreateMLEndpointInput,
) => Effect.Effect<
  CreateMLEndpointOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMLEndpoint: (
  input: DeleteMLEndpointInput,
) => Effect.Effect<
  DeleteMLEndpointOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about a Neptune ML model training job. See Model training using the `modeltraining` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetMLModelTrainingJobStatus IAM action in that cluster.
 */
export const getMLModelTrainingJob: (
  input: GetMLModelTrainingJobInput,
) => Effect.Effect<
  GetMLModelTrainingJobOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets information about a specified model transform job. See Use a trained model to generate new model artifacts.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetMLModelTransformJobStatus IAM action in that cluster.
 */
export const getMLModelTransformJob: (
  input: GetMLModelTransformJobInput,
) => Effect.Effect<
  GetMLModelTransformJobOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a list of Neptune ML data processing jobs. See Listing active data-processing jobs using the Neptune ML dataprocessing command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ListMLDataProcessingJobs IAM action in that cluster.
 */
export const listMLDataProcessingJobs: (
  input: ListMLDataProcessingJobsInput,
) => Effect.Effect<
  ListMLDataProcessingJobsOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists existing inference endpoints. See Managing inference endpoints using the endpoints command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ListMLEndpoints IAM action in that cluster.
 */
export const listMLEndpoints: (
  input: ListMLEndpointsInput,
) => Effect.Effect<
  ListMLEndpointsOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listMLModelTrainingJobs: (
  input: ListMLModelTrainingJobsInput,
) => Effect.Effect<
  ListMLModelTrainingJobsOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a list of model transform job IDs. See Use a trained model to generate new model artifacts.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ListMLModelTransformJobs IAM action in that cluster.
 */
export const listMLModelTransformJobs: (
  input: ListMLModelTransformJobsInput,
) => Effect.Effect<
  ListMLModelTransformJobsOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new Neptune ML data processing job for processing the graph data exported from Neptune for training. See The `dataprocessing` command.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:StartMLModelDataProcessingJob IAM action in that cluster.
 */
export const startMLDataProcessingJob: (
  input: StartMLDataProcessingJobInput,
) => Effect.Effect<
  StartMLDataProcessingJobOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | MLResourceNotFoundException
  | PreconditionsFailedException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPropertygraphStream: (
  input: GetPropertygraphStreamInput,
) => Effect.Effect<
  GetPropertygraphStreamOutput,
  | ClientTimeoutException
  | ConstraintViolationException
  | ExpiredStreamException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MemoryLimitExceededException
  | PreconditionsFailedException
  | StreamRecordsNotFoundException
  | ThrottlingException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * The fast reset REST API lets you reset a Neptune graph quicky and easily, removing all of its data.
 *
 * Neptune fast reset is a two-step process. First you call `ExecuteFastReset` with `action` set to `initiateDatabaseReset`. This returns a UUID token which you then include when calling `ExecuteFastReset` again with `action` set to `performDatabaseReset`. See Empty an Amazon Neptune DB cluster using the fast reset API.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ResetDatabase IAM action in that cluster.
 */
export const executeFastReset: (
  input: ExecuteFastResetInput,
) => Effect.Effect<
  ExecuteFastResetOutput,
  | AccessDeniedException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MethodNotAllowedException
  | MissingParameterException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | ServerShutdownException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists active Gremlin queries. See Gremlin query status API for details about the output.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetQueryStatus IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:Gremlin IAM condition key can be used in the policy document to restrict the use of Gremlin queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const listGremlinQueries: (
  input: ListGremlinQueriesInput,
) => Effect.Effect<
  ListGremlinQueriesOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSparqlStream: (
  input: GetSparqlStreamInput,
) => Effect.Effect<
  GetSparqlStreamOutput,
  | ClientTimeoutException
  | ConstraintViolationException
  | ExpiredStreamException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MemoryLimitExceededException
  | PreconditionsFailedException
  | StreamRecordsNotFoundException
  | ThrottlingException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets a graph summary for a property graph.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetGraphSummary IAM action in that cluster.
 */
export const getPropertygraphSummary: (
  input: GetPropertygraphSummaryInput,
) => Effect.Effect<
  GetPropertygraphSummaryOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | StatisticsNotAvailableException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Cancels a Gremlin query. See Gremlin query cancellation for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelQuery IAM action in that cluster.
 */
export const cancelGremlinQuery: (
  input: CancelGremlinQueryInput,
) => Effect.Effect<
  CancelGremlinQueryOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Cancels a specified openCypher query. See Neptune openCypher status endpoint for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:CancelQuery IAM action in that cluster.
 */
export const cancelOpenCypherQuery: (
  input: CancelOpenCypherQueryInput,
) => Effect.Effect<
  CancelOpenCypherQueryOutput,
  | BadRequestException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidNumericDataException
  | InvalidParameterException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves the status of a specified openCypher query.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetQueryStatus IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:OpenCypher IAM condition key can be used in the policy document to restrict the use of openCypher queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const getOpenCypherQueryStatus: (
  input: GetOpenCypherQueryStatusInput,
) => Effect.Effect<
  GetOpenCypherQueryStatusOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidNumericDataException
  | InvalidParameterException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists active openCypher queries. See Neptune openCypher status endpoint for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetQueryStatus IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:OpenCypher IAM condition key can be used in the policy document to restrict the use of openCypher queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const listOpenCypherQueries: (
  input: ListOpenCypherQueriesInput,
) => Effect.Effect<
  ListOpenCypherQueriesOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidNumericDataException
  | InvalidParameterException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets the status of a specified Gremlin query.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetQueryStatus IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:Gremlin IAM condition key can be used in the policy document to restrict the use of Gremlin queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const getGremlinQueryStatus: (
  input: GetGremlinQueryStatusInput,
) => Effect.Effect<
  GetGremlinQueryStatusOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets a graph summary for an RDF graph.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetGraphSummary IAM action in that cluster.
 */
export const getRDFGraphSummary: (
  input: GetRDFGraphSummaryInput,
) => Effect.Effect<
  GetRDFGraphSummaryOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | StatisticsNotAvailableException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets property graph statistics (Gremlin and openCypher).
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:GetStatisticsStatus IAM action in that cluster.
 */
export const getPropertygraphStatistics: (
  input: GetPropertygraphStatisticsRequest,
) => Effect.Effect<
  GetPropertygraphStatisticsOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | StatisticsNotAvailableException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Manages the generation and use of property graph statistics.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ManageStatistics IAM action in that cluster.
 */
export const managePropertygraphStatistics: (
  input: ManagePropertygraphStatisticsInput,
) => Effect.Effect<
  ManagePropertygraphStatisticsOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | StatisticsNotAvailableException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes SPARQL statistics
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:DeleteStatistics IAM action in that cluster.
 */
export const deleteSparqlStatistics: (
  input: DeleteSparqlStatisticsRequest,
) => Effect.Effect<
  DeleteSparqlStatisticsOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | StatisticsNotAvailableException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Manages the generation and use of RDF graph statistics.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ManageStatistics IAM action in that cluster.
 */
export const manageSparqlStatistics: (
  input: ManageSparqlStatisticsInput,
) => Effect.Effect<
  ManageSparqlStatisticsOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | StatisticsNotAvailableException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets RDF statistics (SPARQL).
 */
export const getSparqlStatistics: (
  input: GetSparqlStatisticsRequest,
) => Effect.Effect<
  GetSparqlStatisticsOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | StatisticsNotAvailableException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes statistics for Gremlin and openCypher (property graph) data.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:DeleteStatistics IAM action in that cluster.
 */
export const deletePropertygraphStatistics: (
  input: DeletePropertygraphStatisticsRequest,
) => Effect.Effect<
  DeletePropertygraphStatisticsOutput,
  | AccessDeniedException
  | BadRequestException
  | ClientTimeoutException
  | ConstraintViolationException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MissingParameterException
  | PreconditionsFailedException
  | ReadOnlyViolationException
  | StatisticsNotAvailableException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const executeGremlinExplainQuery: (
  input: ExecuteGremlinExplainQueryInput,
) => Effect.Effect<
  ExecuteGremlinExplainQueryOutput,
  | BadRequestException
  | CancelledByUserException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MalformedQueryException
  | MemoryLimitExceededException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | QueryLimitExceededException
  | QueryLimitException
  | QueryTooLargeException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Executes a Gremlin Profile query, which runs a specified traversal, collects various metrics about the run, and produces a profile report as output. See Gremlin profile API in Neptune for details.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ReadDataViaQuery IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:Gremlin IAM condition key can be used in the policy document to restrict the use of Gremlin queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const executeGremlinProfileQuery: (
  input: ExecuteGremlinProfileQueryInput,
) => Effect.Effect<
  ExecuteGremlinProfileQueryOutput,
  | BadRequestException
  | CancelledByUserException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MalformedQueryException
  | MemoryLimitExceededException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | QueryLimitExceededException
  | QueryLimitException
  | QueryTooLargeException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const executeGremlinQuery: (
  input: ExecuteGremlinQueryInput,
) => Effect.Effect<
  ExecuteGremlinQueryOutput,
  | BadRequestException
  | CancelledByUserException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidParameterException
  | MalformedQueryException
  | MemoryLimitExceededException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | QueryLimitExceededException
  | QueryLimitException
  | QueryTooLargeException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const executeOpenCypherQuery: (
  input: ExecuteOpenCypherQueryInput,
) => Effect.Effect<
  ExecuteOpenCypherQueryOutput,
  | BadRequestException
  | CancelledByUserException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidNumericDataException
  | InvalidParameterException
  | MalformedQueryException
  | MemoryLimitExceededException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | QueryLimitExceededException
  | QueryLimitException
  | QueryTooLargeException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Executes an openCypher `explain` request. See The openCypher explain feature for more information.
 *
 * When invoking this operation in a Neptune cluster that has IAM authentication enabled, the IAM user or role making the request must have a policy attached that allows the neptune-db:ReadDataViaQuery IAM action in that cluster.
 *
 * Note that the neptune-db:QueryLanguage:OpenCypher IAM condition key can be used in the policy document to restrict the use of openCypher queries (see Condition keys available in Neptune IAM data-access policy statements).
 */
export const executeOpenCypherExplainQuery: (
  input: ExecuteOpenCypherExplainQueryInput,
) => Effect.Effect<
  ExecuteOpenCypherExplainQueryOutput,
  | BadRequestException
  | CancelledByUserException
  | ClientTimeoutException
  | ConcurrentModificationException
  | ConstraintViolationException
  | FailureByQueryException
  | IllegalArgumentException
  | InvalidArgumentException
  | InvalidNumericDataException
  | InvalidParameterException
  | MalformedQueryException
  | MemoryLimitExceededException
  | MissingParameterException
  | ParsingException
  | PreconditionsFailedException
  | QueryLimitExceededException
  | QueryLimitException
  | QueryTooLargeException
  | TimeLimitExceededException
  | TooManyRequestsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
