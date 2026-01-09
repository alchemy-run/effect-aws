import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Neptune Graph",
  serviceShapeName: "AmazonNeptuneGraph",
});
const auth = T.AwsAuthSigv4({ name: "neptune-graph" });
const ver = T.ServiceVersion("2023-11-29");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const {
    Region,
    UseFIPS = false,
    UseDualStack = false,
    Endpoint,
    ApiType,
  } = p;
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
            if (ApiType === "ControlPlane") {
              return e(
                `https://neptune-graph-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              );
            }
            if (ApiType === "DataPlane") {
              return err(
                "Invalid Configuration: fips endpoint is not supported for this API",
              );
            }
            return err("Invalid Configuration: Unknown ApiType");
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (true === _.getAttr(PartitionResult, "supportsFIPS")) {
            if (ApiType === "ControlPlane") {
              return e(
                `https://neptune-graph-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
              );
            }
            if (ApiType === "DataPlane") {
              return err(
                "Invalid Configuration: fips endpoint is not supported for this API",
              );
            }
            return err("Invalid Configuration: Unknown ApiType");
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            if (ApiType === "ControlPlane") {
              return e(
                `https://neptune-graph.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              );
            }
            if (ApiType === "DataPlane") {
              return e(`https://neptune-graph.${Region}.on.aws`);
            }
            return err("Invalid Configuration: Unknown ApiType");
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if (ApiType === "ControlPlane") {
          return e(
            `https://neptune-graph.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (ApiType === "DataPlane") {
          return e(
            `https://${Region}.neptune-graph.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        return err("Invalid Configuration: Unknown ApiType");
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type GraphIdentifier = string;
export type Arn = string;
export type TagKey = string;
export type GraphName = string;
export type KmsKeyArn = string;
export type ReplicaCount = number;
export type ProvisionedMemory = number;
export type PaginationToken = string;
export type MaxResults = number;
export type SnapshotIdentifier = string;
export type VpcId = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type SnapshotName = string;
export type ExportTaskId = string;
export type TaskId = string;
export type RoleArn = string;
export type TagValue = string;
export type VectorSearchDimension = number;
export type GraphId = string;
export type SnapshotId = string;
export type VpcEndpointId = string;
export type ExportFilterLabel = string;
export type ExportFilterOutputPropertyName = string;
export type ExportFilterOutputDataType = string;
export type ExportFilterSourcePropertyName = string;

//# Schemas
export type QueryLanguage = "OPEN_CYPHER" | (string & {});
export const QueryLanguage = S.String;
export type PlanCacheType = "ENABLED" | "DISABLED" | "AUTO" | (string & {});
export const PlanCacheType = S.String;
export type ExplainMode = "STATIC" | "DETAILS" | (string & {});
export const ExplainMode = S.String;
export type GraphSummaryMode = "BASIC" | "DETAILED" | (string & {});
export const GraphSummaryMode = S.String;
export type QueryStateInput =
  | "ALL"
  | "RUNNING"
  | "WAITING"
  | "CANCELLING"
  | (string & {});
export const QueryStateInput = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export type Format =
  | "CSV"
  | "OPEN_CYPHER"
  | "PARQUET"
  | "NTRIPLES"
  | (string & {});
export const Format = S.String;
export type ParquetType = "COLUMNAR" | (string & {});
export const ParquetType = S.String;
export type BlankNodeHandling = "convertToIri" | (string & {});
export const BlankNodeHandling = S.String;
export type ExportFormat = "PARQUET" | "CSV" | (string & {});
export const ExportFormat = S.String;
export interface CancelQueryInput {
  graphIdentifier: string;
  queryId: string;
}
export const CancelQueryInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/queries/{queryId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
    ),
  ),
).annotations({
  identifier: "CancelQueryInput",
}) as any as S.Schema<CancelQueryInput>;
export interface CancelQueryResponse {}
export const CancelQueryResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CancelQueryResponse",
}) as any as S.Schema<CancelQueryResponse>;
export interface GetGraphSummaryInput {
  graphIdentifier: string;
  mode?: GraphSummaryMode;
}
export const GetGraphSummaryInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    mode: S.optional(GraphSummaryMode).pipe(T.HttpQuery("mode")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/summary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
    ),
  ),
).annotations({
  identifier: "GetGraphSummaryInput",
}) as any as S.Schema<GetGraphSummaryInput>;
export interface GetQueryInput {
  graphIdentifier: string;
  queryId: string;
}
export const GetQueryInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/queries/{queryId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
    ),
  ),
).annotations({
  identifier: "GetQueryInput",
}) as any as S.Schema<GetQueryInput>;
export interface ListQueriesInput {
  graphIdentifier: string;
  maxResults: number;
  state?: QueryStateInput;
}
export const ListQueriesInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
    state: S.optional(QueryStateInput).pipe(T.HttpQuery("state")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/queries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
    ),
  ),
).annotations({
  identifier: "ListQueriesInput",
}) as any as S.Schema<ListQueriesInput>;
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface DeleteGraphInput {
  graphIdentifier: string;
  skipSnapshot: boolean;
}
export const DeleteGraphInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    skipSnapshot: S.Boolean.pipe(T.HttpQuery("skipSnapshot")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/graphs/{graphIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "DeleteGraphInput",
}) as any as S.Schema<DeleteGraphInput>;
export interface GetGraphInput {
  graphIdentifier: string;
}
export const GetGraphInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/graphs/{graphIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "GetGraphInput",
}) as any as S.Schema<GetGraphInput>;
export interface ListGraphsInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListGraphsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/graphs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "ListGraphsInput",
}) as any as S.Schema<ListGraphsInput>;
export interface ResetGraphInput {
  graphIdentifier: string;
  skipSnapshot: boolean;
}
export const ResetGraphInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    skipSnapshot: S.Boolean,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/graphs/{graphIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "ResetGraphInput",
}) as any as S.Schema<ResetGraphInput>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface RestoreGraphFromSnapshotInput {
  snapshotIdentifier: string;
  graphName: string;
  provisionedMemory?: number;
  deletionProtection?: boolean;
  tags?: { [key: string]: string | undefined };
  replicaCount?: number;
  publicConnectivity?: boolean;
}
export const RestoreGraphFromSnapshotInput = S.suspend(() =>
  S.Struct({
    snapshotIdentifier: S.String.pipe(T.HttpLabel("snapshotIdentifier")),
    graphName: S.String,
    provisionedMemory: S.optional(S.Number),
    deletionProtection: S.optional(S.Boolean),
    tags: S.optional(TagMap),
    replicaCount: S.optional(S.Number),
    publicConnectivity: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/snapshots/{snapshotIdentifier}/restore",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "RestoreGraphFromSnapshotInput",
}) as any as S.Schema<RestoreGraphFromSnapshotInput>;
export interface StartGraphInput {
  graphIdentifier: string;
}
export const StartGraphInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/graphs/{graphIdentifier}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "StartGraphInput",
}) as any as S.Schema<StartGraphInput>;
export interface StopGraphInput {
  graphIdentifier: string;
}
export const StopGraphInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/graphs/{graphIdentifier}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "StopGraphInput",
}) as any as S.Schema<StopGraphInput>;
export interface UpdateGraphInput {
  graphIdentifier: string;
  publicConnectivity?: boolean;
  provisionedMemory?: number;
  deletionProtection?: boolean;
}
export const UpdateGraphInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    publicConnectivity: S.optional(S.Boolean),
    provisionedMemory: S.optional(S.Number),
    deletionProtection: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/graphs/{graphIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "UpdateGraphInput",
}) as any as S.Schema<UpdateGraphInput>;
export interface CreatePrivateGraphEndpointInput {
  graphIdentifier: string;
  vpcId?: string;
  subnetIds?: string[];
  vpcSecurityGroupIds?: string[];
}
export const CreatePrivateGraphEndpointInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    vpcId: S.optional(S.String),
    subnetIds: S.optional(SubnetIds),
    vpcSecurityGroupIds: S.optional(SecurityGroupIds),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/graphs/{graphIdentifier}/endpoints/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "CreatePrivateGraphEndpointInput",
}) as any as S.Schema<CreatePrivateGraphEndpointInput>;
export interface DeletePrivateGraphEndpointInput {
  graphIdentifier: string;
  vpcId: string;
}
export const DeletePrivateGraphEndpointInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    vpcId: S.String.pipe(T.HttpLabel("vpcId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeletePrivateGraphEndpointInput",
}) as any as S.Schema<DeletePrivateGraphEndpointInput>;
export interface GetPrivateGraphEndpointInput {
  graphIdentifier: string;
  vpcId: string;
}
export const GetPrivateGraphEndpointInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    vpcId: S.String.pipe(T.HttpLabel("vpcId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetPrivateGraphEndpointInput",
}) as any as S.Schema<GetPrivateGraphEndpointInput>;
export interface ListPrivateGraphEndpointsInput {
  graphIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPrivateGraphEndpointsInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/graphs/{graphIdentifier}/endpoints/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "ListPrivateGraphEndpointsInput",
}) as any as S.Schema<ListPrivateGraphEndpointsInput>;
export interface CreateGraphSnapshotInput {
  graphIdentifier: string;
  snapshotName: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateGraphSnapshotInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String,
    snapshotName: S.String,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/snapshots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "CreateGraphSnapshotInput",
}) as any as S.Schema<CreateGraphSnapshotInput>;
export interface DeleteGraphSnapshotInput {
  snapshotIdentifier: string;
}
export const DeleteGraphSnapshotInput = S.suspend(() =>
  S.Struct({
    snapshotIdentifier: S.String.pipe(T.HttpLabel("snapshotIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/snapshots/{snapshotIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "DeleteGraphSnapshotInput",
}) as any as S.Schema<DeleteGraphSnapshotInput>;
export interface GetGraphSnapshotInput {
  snapshotIdentifier: string;
}
export const GetGraphSnapshotInput = S.suspend(() =>
  S.Struct({
    snapshotIdentifier: S.String.pipe(T.HttpLabel("snapshotIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/snapshots/{snapshotIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "GetGraphSnapshotInput",
}) as any as S.Schema<GetGraphSnapshotInput>;
export interface ListGraphSnapshotsInput {
  graphIdentifier?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListGraphSnapshotsInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.optional(S.String).pipe(T.HttpQuery("graphIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/snapshots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "ListGraphSnapshotsInput",
}) as any as S.Schema<ListGraphSnapshotsInput>;
export interface CancelExportTaskInput {
  taskIdentifier: string;
}
export const CancelExportTaskInput = S.suspend(() =>
  S.Struct({
    taskIdentifier: S.String.pipe(T.HttpLabel("taskIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/exporttasks/{taskIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "CancelExportTaskInput",
}) as any as S.Schema<CancelExportTaskInput>;
export interface CancelImportTaskInput {
  taskIdentifier: string;
}
export const CancelImportTaskInput = S.suspend(() =>
  S.Struct({
    taskIdentifier: S.String.pipe(T.HttpLabel("taskIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/importtasks/{taskIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "CancelImportTaskInput",
}) as any as S.Schema<CancelImportTaskInput>;
export interface GetExportTaskInput {
  taskIdentifier: string;
}
export const GetExportTaskInput = S.suspend(() =>
  S.Struct({
    taskIdentifier: S.String.pipe(T.HttpLabel("taskIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/exporttasks/{taskIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "GetExportTaskInput",
}) as any as S.Schema<GetExportTaskInput>;
export interface GetImportTaskInput {
  taskIdentifier: string;
}
export const GetImportTaskInput = S.suspend(() =>
  S.Struct({
    taskIdentifier: S.String.pipe(T.HttpLabel("taskIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/importtasks/{taskIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "GetImportTaskInput",
}) as any as S.Schema<GetImportTaskInput>;
export interface ListExportTasksInput {
  graphIdentifier?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListExportTasksInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.optional(S.String).pipe(T.HttpQuery("graphIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/exporttasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "ListExportTasksInput",
}) as any as S.Schema<ListExportTasksInput>;
export interface ListImportTasksInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListImportTasksInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/importtasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "ListImportTasksInput",
}) as any as S.Schema<ListImportTasksInput>;
export interface NeptuneImportOptions {
  s3ExportPath: string;
  s3ExportKmsKeyId: string;
  preserveDefaultVertexLabels?: boolean;
  preserveEdgeIds?: boolean;
}
export const NeptuneImportOptions = S.suspend(() =>
  S.Struct({
    s3ExportPath: S.String,
    s3ExportKmsKeyId: S.String,
    preserveDefaultVertexLabels: S.optional(S.Boolean),
    preserveEdgeIds: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "NeptuneImportOptions",
}) as any as S.Schema<NeptuneImportOptions>;
export type ImportOptions = { neptune: NeptuneImportOptions };
export const ImportOptions = S.Union(
  S.Struct({ neptune: NeptuneImportOptions }),
);
export interface StartImportTaskInput {
  importOptions?: ImportOptions;
  failOnError?: boolean;
  source: string;
  format?: Format;
  parquetType?: ParquetType;
  blankNodeHandling?: BlankNodeHandling;
  graphIdentifier: string;
  roleArn: string;
}
export const StartImportTaskInput = S.suspend(() =>
  S.Struct({
    importOptions: S.optional(ImportOptions),
    failOnError: S.optional(S.Boolean),
    source: S.String,
    format: S.optional(Format),
    parquetType: S.optional(ParquetType),
    blankNodeHandling: S.optional(BlankNodeHandling),
    graphIdentifier: S.String.pipe(T.HttpLabel("graphIdentifier")),
    roleArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/graphs/{graphIdentifier}/importtasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "StartImportTaskInput",
}) as any as S.Schema<StartImportTaskInput>;
export type DocumentValuedMap = { [key: string]: any | undefined };
export const DocumentValuedMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.Any),
});
export type QueryState = "RUNNING" | "WAITING" | "CANCELLING" | (string & {});
export const QueryState = S.String;
export interface VectorSearchConfiguration {
  dimension: number;
}
export const VectorSearchConfiguration = S.suspend(() =>
  S.Struct({ dimension: S.Number }),
).annotations({
  identifier: "VectorSearchConfiguration",
}) as any as S.Schema<VectorSearchConfiguration>;
export type GraphStatus =
  | "CREATING"
  | "AVAILABLE"
  | "DELETING"
  | "RESETTING"
  | "UPDATING"
  | "SNAPSHOTTING"
  | "FAILED"
  | "IMPORTING"
  | "STARTING"
  | "STOPPING"
  | "STOPPED"
  | (string & {});
export const GraphStatus = S.String;
export type PrivateGraphEndpointStatus =
  | "CREATING"
  | "AVAILABLE"
  | "DELETING"
  | "FAILED"
  | (string & {});
export const PrivateGraphEndpointStatus = S.String;
export type SnapshotStatus =
  | "CREATING"
  | "AVAILABLE"
  | "DELETING"
  | "FAILED"
  | (string & {});
export const SnapshotStatus = S.String;
export type ExportTaskStatus =
  | "INITIALIZING"
  | "EXPORTING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLING"
  | "CANCELLED"
  | "DELETED"
  | (string & {});
export const ExportTaskStatus = S.String;
export type ImportTaskStatus =
  | "INITIALIZING"
  | "EXPORTING"
  | "ANALYZING_DATA"
  | "IMPORTING"
  | "REPROVISIONING"
  | "ROLLING_BACK"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLING"
  | "CANCELLED"
  | "DELETED"
  | (string & {});
export const ImportTaskStatus = S.String;
export interface ExecuteQueryInput {
  graphIdentifier: string;
  queryString: string;
  language: QueryLanguage;
  parameters?: { [key: string]: any | undefined };
  planCache?: PlanCacheType;
  explainMode?: ExplainMode;
  queryTimeoutMilliseconds?: number;
}
export const ExecuteQueryInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    queryString: S.String.pipe(T.JsonName("query")),
    language: QueryLanguage,
    parameters: S.optional(DocumentValuedMap),
    planCache: S.optional(PlanCacheType),
    explainMode: S.optional(ExplainMode).pipe(T.JsonName("explain")),
    queryTimeoutMilliseconds: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/queries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "DataPlane" } }),
    ),
  ),
).annotations({
  identifier: "ExecuteQueryInput",
}) as any as S.Schema<ExecuteQueryInput>;
export interface GetQueryOutput {
  id?: string;
  queryString?: string;
  waited?: number;
  elapsed?: number;
  state?: QueryState;
}
export const GetQueryOutput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    queryString: S.optional(S.String),
    waited: S.optional(S.Number),
    elapsed: S.optional(S.Number),
    state: S.optional(QueryState),
  }),
).annotations({
  identifier: "GetQueryOutput",
}) as any as S.Schema<GetQueryOutput>;
export interface ListTagsForResourceOutput {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface CreateGraphInput {
  graphName: string;
  tags?: { [key: string]: string | undefined };
  publicConnectivity?: boolean;
  kmsKeyIdentifier?: string;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  deletionProtection?: boolean;
  provisionedMemory: number;
}
export const CreateGraphInput = S.suspend(() =>
  S.Struct({
    graphName: S.String,
    tags: S.optional(TagMap),
    publicConnectivity: S.optional(S.Boolean),
    kmsKeyIdentifier: S.optional(S.String),
    vectorSearchConfiguration: S.optional(VectorSearchConfiguration),
    replicaCount: S.optional(S.Number),
    deletionProtection: S.optional(S.Boolean),
    provisionedMemory: S.Number,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/graphs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "CreateGraphInput",
}) as any as S.Schema<CreateGraphInput>;
export interface DeleteGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: GraphStatus;
  statusReason?: string;
  createTime?: Date;
  provisionedMemory?: number;
  endpoint?: string;
  publicConnectivity?: boolean;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  kmsKeyIdentifier?: string;
  sourceSnapshotId?: string;
  deletionProtection?: boolean;
  buildNumber?: string;
}
export const DeleteGraphOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(GraphStatus),
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
  }),
).annotations({
  identifier: "DeleteGraphOutput",
}) as any as S.Schema<DeleteGraphOutput>;
export interface GetGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: GraphStatus;
  statusReason?: string;
  createTime?: Date;
  provisionedMemory?: number;
  endpoint?: string;
  publicConnectivity?: boolean;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  kmsKeyIdentifier?: string;
  sourceSnapshotId?: string;
  deletionProtection?: boolean;
  buildNumber?: string;
}
export const GetGraphOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(GraphStatus),
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
  }),
).annotations({
  identifier: "GetGraphOutput",
}) as any as S.Schema<GetGraphOutput>;
export interface ResetGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: GraphStatus;
  statusReason?: string;
  createTime?: Date;
  provisionedMemory?: number;
  endpoint?: string;
  publicConnectivity?: boolean;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  kmsKeyIdentifier?: string;
  sourceSnapshotId?: string;
  deletionProtection?: boolean;
  buildNumber?: string;
}
export const ResetGraphOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(GraphStatus),
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
  }),
).annotations({
  identifier: "ResetGraphOutput",
}) as any as S.Schema<ResetGraphOutput>;
export interface RestoreGraphFromSnapshotOutput {
  id: string;
  name: string;
  arn: string;
  status?: GraphStatus;
  statusReason?: string;
  createTime?: Date;
  provisionedMemory?: number;
  endpoint?: string;
  publicConnectivity?: boolean;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  kmsKeyIdentifier?: string;
  sourceSnapshotId?: string;
  deletionProtection?: boolean;
  buildNumber?: string;
}
export const RestoreGraphFromSnapshotOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(GraphStatus),
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
  }),
).annotations({
  identifier: "RestoreGraphFromSnapshotOutput",
}) as any as S.Schema<RestoreGraphFromSnapshotOutput>;
export interface StartGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: GraphStatus;
  statusReason?: string;
  createTime?: Date;
  provisionedMemory?: number;
  endpoint?: string;
  publicConnectivity?: boolean;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  kmsKeyIdentifier?: string;
  sourceSnapshotId?: string;
  deletionProtection?: boolean;
  buildNumber?: string;
}
export const StartGraphOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(GraphStatus),
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
  }),
).annotations({
  identifier: "StartGraphOutput",
}) as any as S.Schema<StartGraphOutput>;
export interface StopGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: GraphStatus;
  statusReason?: string;
  createTime?: Date;
  provisionedMemory?: number;
  endpoint?: string;
  publicConnectivity?: boolean;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  kmsKeyIdentifier?: string;
  sourceSnapshotId?: string;
  deletionProtection?: boolean;
  buildNumber?: string;
}
export const StopGraphOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(GraphStatus),
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
  }),
).annotations({
  identifier: "StopGraphOutput",
}) as any as S.Schema<StopGraphOutput>;
export interface UpdateGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: GraphStatus;
  statusReason?: string;
  createTime?: Date;
  provisionedMemory?: number;
  endpoint?: string;
  publicConnectivity?: boolean;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  kmsKeyIdentifier?: string;
  sourceSnapshotId?: string;
  deletionProtection?: boolean;
  buildNumber?: string;
}
export const UpdateGraphOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(GraphStatus),
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
  }),
).annotations({
  identifier: "UpdateGraphOutput",
}) as any as S.Schema<UpdateGraphOutput>;
export interface CreatePrivateGraphEndpointOutput {
  vpcId: string;
  subnetIds: string[];
  status: PrivateGraphEndpointStatus;
  vpcEndpointId?: string;
}
export const CreatePrivateGraphEndpointOutput = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIds,
    status: PrivateGraphEndpointStatus,
    vpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreatePrivateGraphEndpointOutput",
}) as any as S.Schema<CreatePrivateGraphEndpointOutput>;
export interface DeletePrivateGraphEndpointOutput {
  vpcId: string;
  subnetIds: string[];
  status: PrivateGraphEndpointStatus;
  vpcEndpointId?: string;
}
export const DeletePrivateGraphEndpointOutput = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIds,
    status: PrivateGraphEndpointStatus,
    vpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeletePrivateGraphEndpointOutput",
}) as any as S.Schema<DeletePrivateGraphEndpointOutput>;
export interface GetPrivateGraphEndpointOutput {
  vpcId: string;
  subnetIds: string[];
  status: PrivateGraphEndpointStatus;
  vpcEndpointId?: string;
}
export const GetPrivateGraphEndpointOutput = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIds,
    status: PrivateGraphEndpointStatus,
    vpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPrivateGraphEndpointOutput",
}) as any as S.Schema<GetPrivateGraphEndpointOutput>;
export interface CreateGraphSnapshotOutput {
  id: string;
  name: string;
  arn: string;
  sourceGraphId?: string;
  snapshotCreateTime?: Date;
  status?: SnapshotStatus;
  kmsKeyIdentifier?: string;
}
export const CreateGraphSnapshotOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    sourceGraphId: S.optional(S.String),
    snapshotCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(SnapshotStatus),
    kmsKeyIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateGraphSnapshotOutput",
}) as any as S.Schema<CreateGraphSnapshotOutput>;
export interface DeleteGraphSnapshotOutput {
  id: string;
  name: string;
  arn: string;
  sourceGraphId?: string;
  snapshotCreateTime?: Date;
  status?: SnapshotStatus;
  kmsKeyIdentifier?: string;
}
export const DeleteGraphSnapshotOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    sourceGraphId: S.optional(S.String),
    snapshotCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(SnapshotStatus),
    kmsKeyIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteGraphSnapshotOutput",
}) as any as S.Schema<DeleteGraphSnapshotOutput>;
export interface GetGraphSnapshotOutput {
  id: string;
  name: string;
  arn: string;
  sourceGraphId?: string;
  snapshotCreateTime?: Date;
  status?: SnapshotStatus;
  kmsKeyIdentifier?: string;
}
export const GetGraphSnapshotOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    sourceGraphId: S.optional(S.String),
    snapshotCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(SnapshotStatus),
    kmsKeyIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "GetGraphSnapshotOutput",
}) as any as S.Schema<GetGraphSnapshotOutput>;
export interface CancelExportTaskOutput {
  graphId: string;
  roleArn: string;
  taskId: string;
  status: ExportTaskStatus;
  format: ExportFormat;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: ParquetType;
  statusReason?: string;
}
export const CancelExportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.String,
    roleArn: S.String,
    taskId: S.String,
    status: ExportTaskStatus,
    format: ExportFormat,
    destination: S.String,
    kmsKeyIdentifier: S.String,
    parquetType: S.optional(ParquetType),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "CancelExportTaskOutput",
}) as any as S.Schema<CancelExportTaskOutput>;
export interface CancelImportTaskOutput {
  graphId?: string;
  taskId: string;
  source: string;
  format?: Format;
  parquetType?: ParquetType;
  roleArn: string;
  status: ImportTaskStatus;
}
export const CancelImportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.optional(S.String),
    taskId: S.String,
    source: S.String,
    format: S.optional(Format),
    parquetType: S.optional(ParquetType),
    roleArn: S.String,
    status: ImportTaskStatus,
  }),
).annotations({
  identifier: "CancelImportTaskOutput",
}) as any as S.Schema<CancelImportTaskOutput>;
export interface StartImportTaskOutput {
  graphId?: string;
  taskId: string;
  source: string;
  format?: Format;
  parquetType?: ParquetType;
  roleArn: string;
  status: ImportTaskStatus;
  importOptions?: ImportOptions;
}
export const StartImportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.optional(S.String),
    taskId: S.String,
    source: S.String,
    format: S.optional(Format),
    parquetType: S.optional(ParquetType),
    roleArn: S.String,
    status: ImportTaskStatus,
    importOptions: S.optional(ImportOptions),
  }),
).annotations({
  identifier: "StartImportTaskOutput",
}) as any as S.Schema<StartImportTaskOutput>;
export type NodeLabels = string[];
export const NodeLabels = S.Array(S.String);
export type EdgeLabels = string[];
export const EdgeLabels = S.Array(S.String);
export interface QuerySummary {
  id?: string;
  queryString?: string;
  waited?: number;
  elapsed?: number;
  state?: QueryState;
}
export const QuerySummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    queryString: S.optional(S.String),
    waited: S.optional(S.Number),
    elapsed: S.optional(S.Number),
    state: S.optional(QueryState),
  }),
).annotations({ identifier: "QuerySummary" }) as any as S.Schema<QuerySummary>;
export type QuerySummaryList = QuerySummary[];
export const QuerySummaryList = S.Array(QuerySummary);
export type ConflictExceptionReason = "CONCURRENT_MODIFICATION" | (string & {});
export const ConflictExceptionReason = S.String;
export interface GraphSummary {
  id: string;
  name: string;
  arn: string;
  status?: GraphStatus;
  provisionedMemory?: number;
  publicConnectivity?: boolean;
  endpoint?: string;
  replicaCount?: number;
  kmsKeyIdentifier?: string;
  deletionProtection?: boolean;
}
export const GraphSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(GraphStatus),
    provisionedMemory: S.optional(S.Number),
    publicConnectivity: S.optional(S.Boolean),
    endpoint: S.optional(S.String),
    replicaCount: S.optional(S.Number),
    kmsKeyIdentifier: S.optional(S.String),
    deletionProtection: S.optional(S.Boolean),
  }),
).annotations({ identifier: "GraphSummary" }) as any as S.Schema<GraphSummary>;
export type GraphSummaryList = GraphSummary[];
export const GraphSummaryList = S.Array(GraphSummary);
export interface PrivateGraphEndpointSummary {
  vpcId: string;
  subnetIds: string[];
  status: PrivateGraphEndpointStatus;
  vpcEndpointId?: string;
}
export const PrivateGraphEndpointSummary = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIds,
    status: PrivateGraphEndpointStatus,
    vpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "PrivateGraphEndpointSummary",
}) as any as S.Schema<PrivateGraphEndpointSummary>;
export type PrivateGraphEndpointSummaryList = PrivateGraphEndpointSummary[];
export const PrivateGraphEndpointSummaryList = S.Array(
  PrivateGraphEndpointSummary,
);
export interface GraphSnapshotSummary {
  id: string;
  name: string;
  arn: string;
  sourceGraphId?: string;
  snapshotCreateTime?: Date;
  status?: SnapshotStatus;
  kmsKeyIdentifier?: string;
}
export const GraphSnapshotSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    sourceGraphId: S.optional(S.String),
    snapshotCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(SnapshotStatus),
    kmsKeyIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "GraphSnapshotSummary",
}) as any as S.Schema<GraphSnapshotSummary>;
export type GraphSnapshotSummaryList = GraphSnapshotSummary[];
export const GraphSnapshotSummaryList = S.Array(GraphSnapshotSummary);
export interface ExportTaskDetails {
  startTime: Date;
  timeElapsedSeconds: number;
  progressPercentage: number;
  numVerticesWritten?: number;
  numEdgesWritten?: number;
}
export const ExportTaskDetails = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    timeElapsedSeconds: S.Number,
    progressPercentage: S.Number,
    numVerticesWritten: S.optional(S.Number),
    numEdgesWritten: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExportTaskDetails",
}) as any as S.Schema<ExportTaskDetails>;
export interface ImportTaskDetails {
  status: string;
  startTime: Date;
  timeElapsedSeconds: number;
  progressPercentage: number;
  errorCount: number;
  errorDetails?: string;
  statementCount: number;
  dictionaryEntryCount: number;
}
export const ImportTaskDetails = S.suspend(() =>
  S.Struct({
    status: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    timeElapsedSeconds: S.Number,
    progressPercentage: S.Number,
    errorCount: S.Number,
    errorDetails: S.optional(S.String),
    statementCount: S.Number,
    dictionaryEntryCount: S.Number,
  }),
).annotations({
  identifier: "ImportTaskDetails",
}) as any as S.Schema<ImportTaskDetails>;
export interface ExportTaskSummary {
  graphId: string;
  roleArn: string;
  taskId: string;
  status: ExportTaskStatus;
  format: ExportFormat;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: ParquetType;
  statusReason?: string;
}
export const ExportTaskSummary = S.suspend(() =>
  S.Struct({
    graphId: S.String,
    roleArn: S.String,
    taskId: S.String,
    status: ExportTaskStatus,
    format: ExportFormat,
    destination: S.String,
    kmsKeyIdentifier: S.String,
    parquetType: S.optional(ParquetType),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ExportTaskSummary",
}) as any as S.Schema<ExportTaskSummary>;
export type ExportTaskSummaryList = ExportTaskSummary[];
export const ExportTaskSummaryList = S.Array(ExportTaskSummary);
export interface ImportTaskSummary {
  graphId?: string;
  taskId: string;
  source: string;
  format?: Format;
  parquetType?: ParquetType;
  roleArn: string;
  status: ImportTaskStatus;
}
export const ImportTaskSummary = S.suspend(() =>
  S.Struct({
    graphId: S.optional(S.String),
    taskId: S.String,
    source: S.String,
    format: S.optional(Format),
    parquetType: S.optional(ParquetType),
    roleArn: S.String,
    status: ImportTaskStatus,
  }),
).annotations({
  identifier: "ImportTaskSummary",
}) as any as S.Schema<ImportTaskSummary>;
export type ImportTaskSummaryList = ImportTaskSummary[];
export const ImportTaskSummaryList = S.Array(ImportTaskSummary);
export type NodeProperties = string[];
export const NodeProperties = S.Array(S.String);
export type OutgoingEdgeLabels = string[];
export const OutgoingEdgeLabels = S.Array(S.String);
export type EdgeProperties = string[];
export const EdgeProperties = S.Array(S.String);
export interface ExecuteQueryOutput {
  payload: T.StreamingOutputBody;
}
export const ExecuteQueryOutput = S.suspend(() =>
  S.Struct({ payload: T.StreamingOutput.pipe(T.HttpPayload()) }),
).annotations({
  identifier: "ExecuteQueryOutput",
}) as any as S.Schema<ExecuteQueryOutput>;
export interface ListQueriesOutput {
  queries: QuerySummary[];
}
export const ListQueriesOutput = S.suspend(() =>
  S.Struct({ queries: QuerySummaryList }),
).annotations({
  identifier: "ListQueriesOutput",
}) as any as S.Schema<ListQueriesOutput>;
export interface CreateGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: GraphStatus;
  statusReason?: string;
  createTime?: Date;
  provisionedMemory?: number;
  endpoint?: string;
  publicConnectivity?: boolean;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  kmsKeyIdentifier?: string;
  sourceSnapshotId?: string;
  deletionProtection?: boolean;
  buildNumber?: string;
}
export const CreateGraphOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    arn: S.String,
    status: S.optional(GraphStatus),
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
  }),
).annotations({
  identifier: "CreateGraphOutput",
}) as any as S.Schema<CreateGraphOutput>;
export interface ListGraphsOutput {
  graphs: GraphSummary[];
  nextToken?: string;
}
export const ListGraphsOutput = S.suspend(() =>
  S.Struct({ graphs: GraphSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListGraphsOutput",
}) as any as S.Schema<ListGraphsOutput>;
export interface ListPrivateGraphEndpointsOutput {
  privateGraphEndpoints: PrivateGraphEndpointSummary[];
  nextToken?: string;
}
export const ListPrivateGraphEndpointsOutput = S.suspend(() =>
  S.Struct({
    privateGraphEndpoints: PrivateGraphEndpointSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPrivateGraphEndpointsOutput",
}) as any as S.Schema<ListPrivateGraphEndpointsOutput>;
export interface ListGraphSnapshotsOutput {
  graphSnapshots: GraphSnapshotSummary[];
  nextToken?: string;
}
export const ListGraphSnapshotsOutput = S.suspend(() =>
  S.Struct({
    graphSnapshots: GraphSnapshotSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGraphSnapshotsOutput",
}) as any as S.Schema<ListGraphSnapshotsOutput>;
export interface CreateGraphUsingImportTaskInput {
  graphName: string;
  tags?: { [key: string]: string | undefined };
  publicConnectivity?: boolean;
  kmsKeyIdentifier?: string;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  deletionProtection?: boolean;
  importOptions?: ImportOptions;
  maxProvisionedMemory?: number;
  minProvisionedMemory?: number;
  failOnError?: boolean;
  source: string;
  format?: Format;
  parquetType?: ParquetType;
  blankNodeHandling?: BlankNodeHandling;
  roleArn: string;
}
export const CreateGraphUsingImportTaskInput = S.suspend(() =>
  S.Struct({
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
    format: S.optional(Format),
    parquetType: S.optional(ParquetType),
    blankNodeHandling: S.optional(BlankNodeHandling),
    roleArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/importtasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "CreateGraphUsingImportTaskInput",
}) as any as S.Schema<CreateGraphUsingImportTaskInput>;
export type MultiValueHandlingType = "TO_LIST" | "PICK_FIRST" | (string & {});
export const MultiValueHandlingType = S.String;
export interface ExportFilterPropertyAttributes {
  outputType?: string;
  sourcePropertyName?: string;
  multiValueHandling?: MultiValueHandlingType;
}
export const ExportFilterPropertyAttributes = S.suspend(() =>
  S.Struct({
    outputType: S.optional(S.String),
    sourcePropertyName: S.optional(S.String),
    multiValueHandling: S.optional(MultiValueHandlingType),
  }),
).annotations({
  identifier: "ExportFilterPropertyAttributes",
}) as any as S.Schema<ExportFilterPropertyAttributes>;
export type ExportFilterPropertyMap = {
  [key: string]: ExportFilterPropertyAttributes | undefined;
};
export const ExportFilterPropertyMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(ExportFilterPropertyAttributes),
});
export interface ExportFilterElement {
  properties?: { [key: string]: ExportFilterPropertyAttributes | undefined };
}
export const ExportFilterElement = S.suspend(() =>
  S.Struct({ properties: S.optional(ExportFilterPropertyMap) }),
).annotations({
  identifier: "ExportFilterElement",
}) as any as S.Schema<ExportFilterElement>;
export type ExportFilterPerLabelMap = {
  [key: string]: ExportFilterElement | undefined;
};
export const ExportFilterPerLabelMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(ExportFilterElement),
});
export interface ExportFilter {
  vertexFilter?: { [key: string]: ExportFilterElement | undefined };
  edgeFilter?: { [key: string]: ExportFilterElement | undefined };
}
export const ExportFilter = S.suspend(() =>
  S.Struct({
    vertexFilter: S.optional(ExportFilterPerLabelMap),
    edgeFilter: S.optional(ExportFilterPerLabelMap),
  }),
).annotations({ identifier: "ExportFilter" }) as any as S.Schema<ExportFilter>;
export interface GetExportTaskOutput {
  graphId: string;
  roleArn: string;
  taskId: string;
  status: ExportTaskStatus;
  format: ExportFormat;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: ParquetType;
  statusReason?: string;
  exportTaskDetails?: ExportTaskDetails;
  exportFilter?: ExportFilter;
}
export const GetExportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.String,
    roleArn: S.String,
    taskId: S.String,
    status: ExportTaskStatus,
    format: ExportFormat,
    destination: S.String,
    kmsKeyIdentifier: S.String,
    parquetType: S.optional(ParquetType),
    statusReason: S.optional(S.String),
    exportTaskDetails: S.optional(ExportTaskDetails),
    exportFilter: S.optional(ExportFilter),
  }),
).annotations({
  identifier: "GetExportTaskOutput",
}) as any as S.Schema<GetExportTaskOutput>;
export interface GetImportTaskOutput {
  graphId?: string;
  taskId: string;
  source: string;
  format?: Format;
  parquetType?: ParquetType;
  roleArn: string;
  status: ImportTaskStatus;
  importOptions?: ImportOptions;
  importTaskDetails?: ImportTaskDetails;
  attemptNumber?: number;
  statusReason?: string;
}
export const GetImportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.optional(S.String),
    taskId: S.String,
    source: S.String,
    format: S.optional(Format),
    parquetType: S.optional(ParquetType),
    roleArn: S.String,
    status: ImportTaskStatus,
    importOptions: S.optional(ImportOptions),
    importTaskDetails: S.optional(ImportTaskDetails),
    attemptNumber: S.optional(S.Number),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetImportTaskOutput",
}) as any as S.Schema<GetImportTaskOutput>;
export interface ListExportTasksOutput {
  tasks: ExportTaskSummary[];
  nextToken?: string;
}
export const ListExportTasksOutput = S.suspend(() =>
  S.Struct({ tasks: ExportTaskSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListExportTasksOutput",
}) as any as S.Schema<ListExportTasksOutput>;
export interface ListImportTasksOutput {
  tasks: ImportTaskSummary[];
  nextToken?: string;
}
export const ListImportTasksOutput = S.suspend(() =>
  S.Struct({ tasks: ImportTaskSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListImportTasksOutput",
}) as any as S.Schema<ListImportTasksOutput>;
export type LongValuedMap = { [key: string]: number | undefined };
export const LongValuedMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.Number),
});
export type LongValuedMapList = { [key: string]: number | undefined }[];
export const LongValuedMapList = S.Array(LongValuedMap);
export interface NodeStructure {
  count?: number;
  nodeProperties?: string[];
  distinctOutgoingEdgeLabels?: string[];
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
  edgeProperties?: string[];
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
export interface GraphDataSummary {
  numNodes?: number;
  numEdges?: number;
  numNodeLabels?: number;
  numEdgeLabels?: number;
  nodeLabels?: string[];
  edgeLabels?: string[];
  numNodeProperties?: number;
  numEdgeProperties?: number;
  nodeProperties?: { [key: string]: number | undefined }[];
  edgeProperties?: { [key: string]: number | undefined }[];
  totalNodePropertyValues?: number;
  totalEdgePropertyValues?: number;
  nodeStructures?: NodeStructure[];
  edgeStructures?: EdgeStructure[];
}
export const GraphDataSummary = S.suspend(() =>
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
  identifier: "GraphDataSummary",
}) as any as S.Schema<GraphDataSummary>;
export interface GetGraphSummaryOutput {
  version?: string;
  lastStatisticsComputationTime?: Date;
  graphSummary?: GraphDataSummary;
}
export const GetGraphSummaryOutput = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    lastStatisticsComputationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    graphSummary: S.optional(GraphDataSummary),
  }),
).annotations({
  identifier: "GetGraphSummaryOutput",
}) as any as S.Schema<GetGraphSummaryOutput>;
export interface CreateGraphUsingImportTaskOutput {
  graphId?: string;
  taskId: string;
  source: string;
  format?: Format;
  parquetType?: ParquetType;
  roleArn: string;
  status: ImportTaskStatus;
  importOptions?: ImportOptions;
}
export const CreateGraphUsingImportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.optional(S.String),
    taskId: S.String,
    source: S.String,
    format: S.optional(Format),
    parquetType: S.optional(ParquetType),
    roleArn: S.String,
    status: ImportTaskStatus,
    importOptions: S.optional(ImportOptions),
  }),
).annotations({
  identifier: "CreateGraphUsingImportTaskOutput",
}) as any as S.Schema<CreateGraphUsingImportTaskOutput>;
export type ValidationExceptionReason =
  | "CONSTRAINT_VIOLATION"
  | "ILLEGAL_ARGUMENT"
  | "MALFORMED_QUERY"
  | "QUERY_CANCELLED"
  | "QUERY_TOO_LARGE"
  | "UNSUPPORTED_OPERATION"
  | "BAD_REQUEST"
  | (string & {});
export const ValidationExceptionReason = S.String;
export type UnprocessableExceptionReason =
  | "QUERY_TIMEOUT"
  | "INTERNAL_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "STORAGE_LIMIT_EXCEEDED"
  | "PARTITION_FULL"
  | (string & {});
export const UnprocessableExceptionReason = S.String;
export interface StartExportTaskInput {
  graphIdentifier: string;
  roleArn: string;
  format: ExportFormat;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: ParquetType;
  exportFilter?: ExportFilter;
  tags?: { [key: string]: string | undefined };
}
export const StartExportTaskInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String,
    roleArn: S.String,
    format: ExportFormat,
    destination: S.String,
    kmsKeyIdentifier: S.String,
    parquetType: S.optional(ParquetType),
    exportFilter: S.optional(ExportFilter),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/exporttasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ ApiType: { value: "ControlPlane" } }),
    ),
  ),
).annotations({
  identifier: "StartExportTaskInput",
}) as any as S.Schema<StartExportTaskInput>;
export interface StartExportTaskOutput {
  graphId: string;
  roleArn: string;
  taskId: string;
  status: ExportTaskStatus;
  format: ExportFormat;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: ParquetType;
  statusReason?: string;
  exportFilter?: ExportFilter;
}
export const StartExportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.String,
    roleArn: S.String,
    taskId: S.String,
    status: ExportTaskStatus,
    format: ExportFormat,
    destination: S.String,
    kmsKeyIdentifier: S.String,
    parquetType: S.optional(ParquetType),
    statusReason: S.optional(S.String),
    exportFilter: S.optional(ExportFilter),
  }),
).annotations({
  identifier: "StartExportTaskOutput",
}) as any as S.Schema<StartExportTaskOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, reason: S.optional(ConflictExceptionReason) },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String, reason: S.optional(ValidationExceptionReason) },
).pipe(C.withBadRequestError) {}
export class UnprocessableException extends S.TaggedError<UnprocessableException>()(
  "UnprocessableException",
  { message: S.String, reason: UnprocessableExceptionReason },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists available Neptune Analytics graphs.
 */
export const listGraphs: {
  (
    input: ListGraphsInput,
  ): effect.Effect<
    ListGraphsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGraphsInput,
  ) => stream.Stream<
    ListGraphsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGraphsInput,
  ) => stream.Stream<
    GraphSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGraphsInput,
  output: ListGraphsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "graphs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists active openCypher queries.
 */
export const listQueries: (
  input: ListQueriesInput,
) => effect.Effect<
  ListQueriesOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const executeQuery: (
  input: ExecuteQueryInput,
) => effect.Effect<
  ExecuteQueryOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | UnprocessableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteGraph: (
  input: DeleteGraphInput,
) => effect.Effect<
  DeleteGraphOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPrivateGraphEndpoints: {
  (
    input: ListPrivateGraphEndpointsInput,
  ): effect.Effect<
    ListPrivateGraphEndpointsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPrivateGraphEndpointsInput,
  ) => stream.Stream<
    ListPrivateGraphEndpointsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPrivateGraphEndpointsInput,
  ) => stream.Stream<
    PrivateGraphEndpointSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPrivateGraphEndpointsInput,
  output: ListPrivateGraphEndpointsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "privateGraphEndpoints",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists available snapshots of a specified Neptune Analytics graph.
 */
export const listGraphSnapshots: {
  (
    input: ListGraphSnapshotsInput,
  ): effect.Effect<
    ListGraphSnapshotsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGraphSnapshotsInput,
  ) => stream.Stream<
    ListGraphSnapshotsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGraphSnapshotsInput,
  ) => stream.Stream<
    GraphSnapshotSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGraphSnapshotsInput,
  output: ListGraphSnapshotsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "graphSnapshots",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a specified export task.
 */
export const getExportTask: (
  input: GetExportTaskInput,
) => effect.Effect<
  GetExportTaskOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getImportTask: (
  input: GetImportTaskInput,
) => effect.Effect<
  GetImportTaskOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listExportTasks: {
  (
    input: ListExportTasksInput,
  ): effect.Effect<
    ListExportTasksOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExportTasksInput,
  ) => stream.Stream<
    ListExportTasksOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExportTasksInput,
  ) => stream.Stream<
    ExportTaskSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExportTasksInput,
  output: ListExportTasksOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tasks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists import tasks.
 */
export const listImportTasks: {
  (
    input: ListImportTasksInput,
  ): effect.Effect<
    ListImportTasksOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportTasksInput,
  ) => stream.Stream<
    ListImportTasksOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImportTasksInput,
  ) => stream.Stream<
    ImportTaskSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportTasksInput,
  output: ListImportTasksOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tasks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about a specified graph.
 */
export const getGraph: (
  input: GetGraphInput,
) => effect.Effect<
  GetGraphOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPrivateGraphEndpoint: (
  input: GetPrivateGraphEndpointInput,
) => effect.Effect<
  GetPrivateGraphEndpointOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPrivateGraphEndpointInput,
  output: GetPrivateGraphEndpointOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a specified graph snapshot.
 */
export const getGraphSnapshot: (
  input: GetGraphSnapshotInput,
) => effect.Effect<
  GetGraphSnapshotOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelQuery: (
  input: CancelQueryInput,
) => effect.Effect<
  CancelQueryResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQuery: (
  input: GetQueryInput,
) => effect.Effect<
  GetQueryOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resetGraph: (
  input: ResetGraphInput,
) => effect.Effect<
  ResetGraphOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startGraph: (
  input: StartGraphInput,
) => effect.Effect<
  StartGraphOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopGraph: (
  input: StopGraphInput,
) => effect.Effect<
  StopGraphOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGraph: (
  input: UpdateGraphInput,
) => effect.Effect<
  UpdateGraphOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePrivateGraphEndpoint: (
  input: DeletePrivateGraphEndpointInput,
) => effect.Effect<
  DeletePrivateGraphEndpointOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePrivateGraphEndpointInput,
  output: DeletePrivateGraphEndpointOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specifed graph snapshot.
 */
export const deleteGraphSnapshot: (
  input: DeleteGraphSnapshotInput,
) => effect.Effect<
  DeleteGraphSnapshotOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelExportTask: (
  input: CancelExportTaskInput,
) => effect.Effect<
  CancelExportTaskOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelImportTask: (
  input: CancelImportTaskInput,
) => effect.Effect<
  CancelImportTaskOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startImportTask: (
  input: StartImportTaskInput,
) => effect.Effect<
  StartImportTaskOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getGraphSummary: (
  input: GetGraphSummaryInput,
) => effect.Effect<
  GetGraphSummaryOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restoreGraphFromSnapshot: (
  input: RestoreGraphFromSnapshotInput,
) => effect.Effect<
  RestoreGraphFromSnapshotOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Create a private graph endpoint to allow private access from to the graph from within a VPC. You can attach security groups to the private graph endpoint.
 *
 * VPC endpoint charges apply.
 */
export const createPrivateGraphEndpoint: (
  input: CreatePrivateGraphEndpointInput,
) => effect.Effect<
  CreatePrivateGraphEndpointOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a snapshot of the specific graph.
 */
export const createGraphSnapshot: (
  input: CreateGraphSnapshotInput,
) => effect.Effect<
  CreateGraphSnapshotOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createGraph: (
  input: CreateGraphInput,
) => effect.Effect<
  CreateGraphOutput,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createGraphUsingImportTask: (
  input: CreateGraphUsingImportTaskInput,
) => effect.Effect<
  CreateGraphUsingImportTaskOutput,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGraphUsingImportTaskInput,
  output: CreateGraphUsingImportTaskOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Export data from an existing Neptune Analytics graph to Amazon S3. The graph state should be `AVAILABLE`.
 */
export const startExportTask: (
  input: StartExportTaskInput,
) => effect.Effect<
  StartExportTaskOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
