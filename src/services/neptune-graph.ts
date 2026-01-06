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
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
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
  mode?: string;
}
export const GetGraphSummaryInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    mode: S.optional(S.String).pipe(T.HttpQuery("mode")),
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
  state?: string;
}
export const ListQueriesInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String.pipe(
      T.HttpHeader("graphIdentifier"),
      T.HostLabel(),
    ),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
    state: S.optional(S.String).pipe(T.HttpQuery("state")),
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
  tagKeys: TagKeyList;
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
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface RestoreGraphFromSnapshotInput {
  snapshotIdentifier: string;
  graphName: string;
  provisionedMemory?: number;
  deletionProtection?: boolean;
  tags?: TagMap;
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
  subnetIds?: SubnetIds;
  vpcSecurityGroupIds?: SecurityGroupIds;
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
  tags?: TagMap;
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
  importOptions?: (typeof ImportOptions)["Type"];
  failOnError?: boolean;
  source: string;
  format?: string;
  parquetType?: string;
  blankNodeHandling?: string;
  graphIdentifier: string;
  roleArn: string;
}
export const StartImportTaskInput = S.suspend(() =>
  S.Struct({
    importOptions: S.optional(ImportOptions),
    failOnError: S.optional(S.Boolean),
    source: S.String,
    format: S.optional(S.String),
    parquetType: S.optional(S.String),
    blankNodeHandling: S.optional(S.String),
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
export type DocumentValuedMap = { [key: string]: any };
export const DocumentValuedMap = S.Record({ key: S.String, value: S.Any });
export interface VectorSearchConfiguration {
  dimension: number;
}
export const VectorSearchConfiguration = S.suspend(() =>
  S.Struct({ dimension: S.Number }),
).annotations({
  identifier: "VectorSearchConfiguration",
}) as any as S.Schema<VectorSearchConfiguration>;
export interface ExecuteQueryInput {
  graphIdentifier: string;
  queryString: string;
  language: string;
  parameters?: DocumentValuedMap;
  planCache?: string;
  explainMode?: string;
  queryTimeoutMilliseconds?: number;
}
export const ExecuteQueryInput = S.suspend(() =>
  S.Struct({
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
  state?: string;
}
export const GetQueryOutput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    queryString: S.optional(S.String),
    waited: S.optional(S.Number),
    elapsed: S.optional(S.Number),
    state: S.optional(S.String),
  }),
).annotations({
  identifier: "GetQueryOutput",
}) as any as S.Schema<GetQueryOutput>;
export interface ListTagsForResourceOutput {
  tags?: TagMap;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: TagMap;
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
  tags?: TagMap;
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
  status?: string;
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
  }),
).annotations({
  identifier: "DeleteGraphOutput",
}) as any as S.Schema<DeleteGraphOutput>;
export interface GetGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: string;
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
  }),
).annotations({
  identifier: "GetGraphOutput",
}) as any as S.Schema<GetGraphOutput>;
export interface ResetGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: string;
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
  }),
).annotations({
  identifier: "ResetGraphOutput",
}) as any as S.Schema<ResetGraphOutput>;
export interface RestoreGraphFromSnapshotOutput {
  id: string;
  name: string;
  arn: string;
  status?: string;
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
  }),
).annotations({
  identifier: "RestoreGraphFromSnapshotOutput",
}) as any as S.Schema<RestoreGraphFromSnapshotOutput>;
export interface StartGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: string;
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
  }),
).annotations({
  identifier: "StartGraphOutput",
}) as any as S.Schema<StartGraphOutput>;
export interface StopGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: string;
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
  }),
).annotations({
  identifier: "StopGraphOutput",
}) as any as S.Schema<StopGraphOutput>;
export interface UpdateGraphOutput {
  id: string;
  name: string;
  arn: string;
  status?: string;
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
  }),
).annotations({
  identifier: "UpdateGraphOutput",
}) as any as S.Schema<UpdateGraphOutput>;
export interface CreatePrivateGraphEndpointOutput {
  vpcId: string;
  subnetIds: SubnetIds;
  status: string;
  vpcEndpointId?: string;
}
export const CreatePrivateGraphEndpointOutput = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIds,
    status: S.String,
    vpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreatePrivateGraphEndpointOutput",
}) as any as S.Schema<CreatePrivateGraphEndpointOutput>;
export interface DeletePrivateGraphEndpointOutput {
  vpcId: string;
  subnetIds: SubnetIds;
  status: string;
  vpcEndpointId?: string;
}
export const DeletePrivateGraphEndpointOutput = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIds,
    status: S.String,
    vpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeletePrivateGraphEndpointOutput",
}) as any as S.Schema<DeletePrivateGraphEndpointOutput>;
export interface GetPrivateGraphEndpointOutput {
  vpcId: string;
  subnetIds: SubnetIds;
  status: string;
  vpcEndpointId?: string;
}
export const GetPrivateGraphEndpointOutput = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIds,
    status: S.String,
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
  status?: string;
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
    status: S.optional(S.String),
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
  status?: string;
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
    status: S.optional(S.String),
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
  status?: string;
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
    status: S.optional(S.String),
    kmsKeyIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "GetGraphSnapshotOutput",
}) as any as S.Schema<GetGraphSnapshotOutput>;
export interface CancelExportTaskOutput {
  graphId: string;
  roleArn: string;
  taskId: string;
  status: string;
  format: string;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: string;
  statusReason?: string;
}
export const CancelExportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.String,
    roleArn: S.String,
    taskId: S.String,
    status: S.String,
    format: S.String,
    destination: S.String,
    kmsKeyIdentifier: S.String,
    parquetType: S.optional(S.String),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "CancelExportTaskOutput",
}) as any as S.Schema<CancelExportTaskOutput>;
export interface CancelImportTaskOutput {
  graphId?: string;
  taskId: string;
  source: string;
  format?: string;
  parquetType?: string;
  roleArn: string;
  status: string;
}
export const CancelImportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.optional(S.String),
    taskId: S.String,
    source: S.String,
    format: S.optional(S.String),
    parquetType: S.optional(S.String),
    roleArn: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "CancelImportTaskOutput",
}) as any as S.Schema<CancelImportTaskOutput>;
export interface StartImportTaskOutput {
  graphId?: string;
  taskId: string;
  source: string;
  format?: string;
  parquetType?: string;
  roleArn: string;
  status: string;
  importOptions?: (typeof ImportOptions)["Type"];
}
export const StartImportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.optional(S.String),
    taskId: S.String,
    source: S.String,
    format: S.optional(S.String),
    parquetType: S.optional(S.String),
    roleArn: S.String,
    status: S.String,
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
  state?: string;
}
export const QuerySummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    queryString: S.optional(S.String),
    waited: S.optional(S.Number),
    elapsed: S.optional(S.Number),
    state: S.optional(S.String),
  }),
).annotations({ identifier: "QuerySummary" }) as any as S.Schema<QuerySummary>;
export type QuerySummaryList = QuerySummary[];
export const QuerySummaryList = S.Array(QuerySummary);
export interface GraphSummary {
  id: string;
  name: string;
  arn: string;
  status?: string;
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
    status: S.optional(S.String),
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
  subnetIds: SubnetIds;
  status: string;
  vpcEndpointId?: string;
}
export const PrivateGraphEndpointSummary = S.suspend(() =>
  S.Struct({
    vpcId: S.String,
    subnetIds: SubnetIds,
    status: S.String,
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
  status?: string;
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
    status: S.optional(S.String),
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
  status: string;
  format: string;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: string;
  statusReason?: string;
}
export const ExportTaskSummary = S.suspend(() =>
  S.Struct({
    graphId: S.String,
    roleArn: S.String,
    taskId: S.String,
    status: S.String,
    format: S.String,
    destination: S.String,
    kmsKeyIdentifier: S.String,
    parquetType: S.optional(S.String),
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
  format?: string;
  parquetType?: string;
  roleArn: string;
  status: string;
}
export const ImportTaskSummary = S.suspend(() =>
  S.Struct({
    graphId: S.optional(S.String),
    taskId: S.String,
    source: S.String,
    format: S.optional(S.String),
    parquetType: S.optional(S.String),
    roleArn: S.String,
    status: S.String,
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
  queries: QuerySummaryList;
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
  status?: string;
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
  }),
).annotations({
  identifier: "CreateGraphOutput",
}) as any as S.Schema<CreateGraphOutput>;
export interface ListGraphsOutput {
  graphs: GraphSummaryList;
  nextToken?: string;
}
export const ListGraphsOutput = S.suspend(() =>
  S.Struct({ graphs: GraphSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListGraphsOutput",
}) as any as S.Schema<ListGraphsOutput>;
export interface ListPrivateGraphEndpointsOutput {
  privateGraphEndpoints: PrivateGraphEndpointSummaryList;
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
  graphSnapshots: GraphSnapshotSummaryList;
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
  tags?: TagMap;
  publicConnectivity?: boolean;
  kmsKeyIdentifier?: string;
  vectorSearchConfiguration?: VectorSearchConfiguration;
  replicaCount?: number;
  deletionProtection?: boolean;
  importOptions?: (typeof ImportOptions)["Type"];
  maxProvisionedMemory?: number;
  minProvisionedMemory?: number;
  failOnError?: boolean;
  source: string;
  format?: string;
  parquetType?: string;
  blankNodeHandling?: string;
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
    format: S.optional(S.String),
    parquetType: S.optional(S.String),
    blankNodeHandling: S.optional(S.String),
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
export interface ExportFilterPropertyAttributes {
  outputType?: string;
  sourcePropertyName?: string;
  multiValueHandling?: string;
}
export const ExportFilterPropertyAttributes = S.suspend(() =>
  S.Struct({
    outputType: S.optional(S.String),
    sourcePropertyName: S.optional(S.String),
    multiValueHandling: S.optional(S.String),
  }),
).annotations({
  identifier: "ExportFilterPropertyAttributes",
}) as any as S.Schema<ExportFilterPropertyAttributes>;
export type ExportFilterPropertyMap = {
  [key: string]: ExportFilterPropertyAttributes;
};
export const ExportFilterPropertyMap = S.Record({
  key: S.String,
  value: ExportFilterPropertyAttributes,
});
export interface ExportFilterElement {
  properties?: ExportFilterPropertyMap;
}
export const ExportFilterElement = S.suspend(() =>
  S.Struct({ properties: S.optional(ExportFilterPropertyMap) }),
).annotations({
  identifier: "ExportFilterElement",
}) as any as S.Schema<ExportFilterElement>;
export type ExportFilterPerLabelMap = { [key: string]: ExportFilterElement };
export const ExportFilterPerLabelMap = S.Record({
  key: S.String,
  value: ExportFilterElement,
});
export interface ExportFilter {
  vertexFilter?: ExportFilterPerLabelMap;
  edgeFilter?: ExportFilterPerLabelMap;
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
  status: string;
  format: string;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: string;
  statusReason?: string;
  exportTaskDetails?: ExportTaskDetails;
  exportFilter?: ExportFilter;
}
export const GetExportTaskOutput = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetExportTaskOutput",
}) as any as S.Schema<GetExportTaskOutput>;
export interface GetImportTaskOutput {
  graphId?: string;
  taskId: string;
  source: string;
  format?: string;
  parquetType?: string;
  roleArn: string;
  status: string;
  importOptions?: (typeof ImportOptions)["Type"];
  importTaskDetails?: ImportTaskDetails;
  attemptNumber?: number;
  statusReason?: string;
}
export const GetImportTaskOutput = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetImportTaskOutput",
}) as any as S.Schema<GetImportTaskOutput>;
export interface ListExportTasksOutput {
  tasks: ExportTaskSummaryList;
  nextToken?: string;
}
export const ListExportTasksOutput = S.suspend(() =>
  S.Struct({ tasks: ExportTaskSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListExportTasksOutput",
}) as any as S.Schema<ListExportTasksOutput>;
export interface ListImportTasksOutput {
  tasks: ImportTaskSummaryList;
  nextToken?: string;
}
export const ListImportTasksOutput = S.suspend(() =>
  S.Struct({ tasks: ImportTaskSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListImportTasksOutput",
}) as any as S.Schema<ListImportTasksOutput>;
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
export interface GraphDataSummary {
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
  format?: string;
  parquetType?: string;
  roleArn: string;
  status: string;
  importOptions?: (typeof ImportOptions)["Type"];
}
export const CreateGraphUsingImportTaskOutput = S.suspend(() =>
  S.Struct({
    graphId: S.optional(S.String),
    taskId: S.String,
    source: S.String,
    format: S.optional(S.String),
    parquetType: S.optional(S.String),
    roleArn: S.String,
    status: S.String,
    importOptions: S.optional(ImportOptions),
  }),
).annotations({
  identifier: "CreateGraphUsingImportTaskOutput",
}) as any as S.Schema<CreateGraphUsingImportTaskOutput>;
export interface StartExportTaskInput {
  graphIdentifier: string;
  roleArn: string;
  format: string;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: string;
  exportFilter?: ExportFilter;
  tags?: TagMap;
}
export const StartExportTaskInput = S.suspend(() =>
  S.Struct({
    graphIdentifier: S.String,
    roleArn: S.String,
    format: S.String,
    destination: S.String,
    kmsKeyIdentifier: S.String,
    parquetType: S.optional(S.String),
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
  status: string;
  format: string;
  destination: string;
  kmsKeyIdentifier: string;
  parquetType?: string;
  statusReason?: string;
  exportFilter?: ExportFilter;
}
export const StartExportTaskOutput = S.suspend(() =>
  S.Struct({
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
  { message: S.String, reason: S.optional(S.String) },
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
  { message: S.String, reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnprocessableException extends S.TaggedError<UnprocessableException>()(
  "UnprocessableException",
  { message: S.String, reason: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists available Neptune Analytics graphs.
 */
export const listGraphs: {
  (
    input: ListGraphsInput,
  ): Effect.Effect<
    ListGraphsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGraphsInput,
  ) => Stream.Stream<
    ListGraphsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGraphsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
