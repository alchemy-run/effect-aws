import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SupplyChain",
  serviceShapeName: "GalaxyPublicAPIGateway",
});
const auth = T.AwsAuthSigv4({ name: "scn" });
const ver = T.ServiceVersion("2024-01-01");
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
                                url: "https://scn-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://scn-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://scn.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://scn.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export const InstanceNameList = S.Array(S.String);
export const InstanceStateList = S.Array(S.String);
export class GetDataIntegrationEventRequest extends S.Class<GetDataIntegrationEventRequest>(
  "GetDataIntegrationEventRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    eventId: S.String.pipe(T.HttpLabel("eventId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-events/{eventId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataIntegrationFlowExecutionRequest extends S.Class<GetDataIntegrationFlowExecutionRequest>(
  "GetDataIntegrationFlowExecutionRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    flowName: S.String.pipe(T.HttpLabel("flowName")),
    executionId: S.String.pipe(T.HttpLabel("executionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-flows/{flowName}/executions/{executionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataIntegrationEventsRequest extends S.Class<ListDataIntegrationEventsRequest>(
  "ListDataIntegrationEventsRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    eventType: S.optional(S.String).pipe(T.HttpQuery("eventType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-events",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataIntegrationFlowExecutionsRequest extends S.Class<ListDataIntegrationFlowExecutionsRequest>(
  "ListDataIntegrationFlowExecutionsRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    flowName: S.String.pipe(T.HttpLabel("flowName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-flows/{flowName}/executions",
    }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/api/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/api/tags/{resourceArn}" }),
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
export class CreateBillOfMaterialsImportJobRequest extends S.Class<CreateBillOfMaterialsImportJobRequest>(
  "CreateBillOfMaterialsImportJobRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    s3uri: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/api/configuration/instances/{instanceId}/bill-of-materials-import-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBillOfMaterialsImportJobRequest extends S.Class<GetBillOfMaterialsImportJobRequest>(
  "GetBillOfMaterialsImportJobRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api/configuration/instances/{instanceId}/bill-of-materials-import-jobs/{jobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataIntegrationFlowRequest extends S.Class<GetDataIntegrationFlowRequest>(
  "GetDataIntegrationFlowRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api/data-integration/instance/{instanceId}/data-integration-flows/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DataIntegrationFlowS3Options extends S.Class<DataIntegrationFlowS3Options>(
  "DataIntegrationFlowS3Options",
)({ fileType: S.optional(S.String) }) {}
export class DataIntegrationFlowS3SourceConfiguration extends S.Class<DataIntegrationFlowS3SourceConfiguration>(
  "DataIntegrationFlowS3SourceConfiguration",
)({
  bucketName: S.String,
  prefix: S.String,
  options: S.optional(DataIntegrationFlowS3Options),
}) {}
export class DataIntegrationFlowFieldPriorityDedupeField extends S.Class<DataIntegrationFlowFieldPriorityDedupeField>(
  "DataIntegrationFlowFieldPriorityDedupeField",
)({ name: S.String, sortOrder: S.String }) {}
export const DataIntegrationFlowFieldPriorityDedupeFieldList = S.Array(
  DataIntegrationFlowFieldPriorityDedupeField,
);
export class DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration extends S.Class<DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration>(
  "DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration",
)({ fields: DataIntegrationFlowFieldPriorityDedupeFieldList }) {}
export class DataIntegrationFlowDedupeStrategy extends S.Class<DataIntegrationFlowDedupeStrategy>(
  "DataIntegrationFlowDedupeStrategy",
)({
  type: S.String,
  fieldPriority: S.optional(
    DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration,
  ),
}) {}
export class DataIntegrationFlowDatasetOptions extends S.Class<DataIntegrationFlowDatasetOptions>(
  "DataIntegrationFlowDatasetOptions",
)({
  loadType: S.optional(S.String),
  dedupeRecords: S.optional(S.Boolean),
  dedupeStrategy: S.optional(DataIntegrationFlowDedupeStrategy),
}) {}
export class DataIntegrationFlowDatasetSourceConfiguration extends S.Class<DataIntegrationFlowDatasetSourceConfiguration>(
  "DataIntegrationFlowDatasetSourceConfiguration",
)({
  datasetIdentifier: S.String,
  options: S.optional(DataIntegrationFlowDatasetOptions),
}) {}
export class DataIntegrationFlowSource extends S.Class<DataIntegrationFlowSource>(
  "DataIntegrationFlowSource",
)({
  sourceType: S.String,
  sourceName: S.String,
  s3Source: S.optional(DataIntegrationFlowS3SourceConfiguration),
  datasetSource: S.optional(DataIntegrationFlowDatasetSourceConfiguration),
}) {}
export const DataIntegrationFlowSourceList = S.Array(DataIntegrationFlowSource);
export class DataIntegrationFlowSQLTransformationConfiguration extends S.Class<DataIntegrationFlowSQLTransformationConfiguration>(
  "DataIntegrationFlowSQLTransformationConfiguration",
)({ query: S.String }) {}
export class DataIntegrationFlowTransformation extends S.Class<DataIntegrationFlowTransformation>(
  "DataIntegrationFlowTransformation",
)({
  transformationType: S.String,
  sqlTransformation: S.optional(
    DataIntegrationFlowSQLTransformationConfiguration,
  ),
}) {}
export class DataIntegrationFlowS3TargetConfiguration extends S.Class<DataIntegrationFlowS3TargetConfiguration>(
  "DataIntegrationFlowS3TargetConfiguration",
)({
  bucketName: S.String,
  prefix: S.String,
  options: S.optional(DataIntegrationFlowS3Options),
}) {}
export class DataIntegrationFlowDatasetTargetConfiguration extends S.Class<DataIntegrationFlowDatasetTargetConfiguration>(
  "DataIntegrationFlowDatasetTargetConfiguration",
)({
  datasetIdentifier: S.String,
  options: S.optional(DataIntegrationFlowDatasetOptions),
}) {}
export class DataIntegrationFlowTarget extends S.Class<DataIntegrationFlowTarget>(
  "DataIntegrationFlowTarget",
)({
  targetType: S.String,
  s3Target: S.optional(DataIntegrationFlowS3TargetConfiguration),
  datasetTarget: S.optional(DataIntegrationFlowDatasetTargetConfiguration),
}) {}
export class UpdateDataIntegrationFlowRequest extends S.Class<UpdateDataIntegrationFlowRequest>(
  "UpdateDataIntegrationFlowRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    sources: S.optional(DataIntegrationFlowSourceList),
    transformation: S.optional(DataIntegrationFlowTransformation),
    target: S.optional(DataIntegrationFlowTarget),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/api/data-integration/instance/{instanceId}/data-integration-flows/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataIntegrationFlowRequest extends S.Class<DeleteDataIntegrationFlowRequest>(
  "DeleteDataIntegrationFlowRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/api/data-integration/instance/{instanceId}/data-integration-flows/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataIntegrationFlowsRequest extends S.Class<ListDataIntegrationFlowsRequest>(
  "ListDataIntegrationFlowsRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api/data-integration/instance/{instanceId}/data-integration-flows",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataLakeDatasetRequest extends S.Class<GetDataLakeDatasetRequest>(
  "GetDataLakeDatasetRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api/datalake/instance/{instanceId}/namespaces/{namespace}/datasets/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataLakeDatasetRequest extends S.Class<UpdateDataLakeDatasetRequest>(
  "UpdateDataLakeDatasetRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/api/datalake/instance/{instanceId}/namespaces/{namespace}/datasets/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataLakeDatasetRequest extends S.Class<DeleteDataLakeDatasetRequest>(
  "DeleteDataLakeDatasetRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/api/datalake/instance/{instanceId}/namespaces/{namespace}/datasets/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataLakeDatasetsRequest extends S.Class<ListDataLakeDatasetsRequest>(
  "ListDataLakeDatasetsRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api/datalake/instance/{instanceId}/namespaces/{namespace}/datasets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateDataLakeNamespaceRequest extends S.Class<CreateDataLakeNamespaceRequest>(
  "CreateDataLakeNamespaceRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/api/datalake/instance/{instanceId}/namespaces/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataLakeNamespaceRequest extends S.Class<GetDataLakeNamespaceRequest>(
  "GetDataLakeNamespaceRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api/datalake/instance/{instanceId}/namespaces/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataLakeNamespaceRequest extends S.Class<UpdateDataLakeNamespaceRequest>(
  "UpdateDataLakeNamespaceRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/api/datalake/instance/{instanceId}/namespaces/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataLakeNamespaceRequest extends S.Class<DeleteDataLakeNamespaceRequest>(
  "DeleteDataLakeNamespaceRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/api/datalake/instance/{instanceId}/namespaces/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataLakeNamespacesRequest extends S.Class<ListDataLakeNamespacesRequest>(
  "ListDataLakeNamespacesRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api/datalake/instance/{instanceId}/namespaces",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInstanceRequest extends S.Class<CreateInstanceRequest>(
  "CreateInstanceRequest",
)(
  {
    instanceName: S.optional(S.String),
    instanceDescription: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    webAppDnsDomain: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/api/instance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInstanceRequest extends S.Class<GetInstanceRequest>(
  "GetInstanceRequest",
)(
  { instanceId: S.String.pipe(T.HttpLabel("instanceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/api/instance/{instanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateInstanceRequest extends S.Class<UpdateInstanceRequest>(
  "UpdateInstanceRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    instanceName: S.optional(S.String),
    instanceDescription: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/api/instance/{instanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInstanceRequest extends S.Class<DeleteInstanceRequest>(
  "DeleteInstanceRequest",
)(
  { instanceId: S.String.pipe(T.HttpLabel("instanceId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/api/instance/{instanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInstancesRequest extends S.Class<ListInstancesRequest>(
  "ListInstancesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    instanceNameFilter: S.optional(InstanceNameList).pipe(
      T.HttpQuery("instanceNameFilter"),
    ),
    instanceStateFilter: S.optional(InstanceStateList).pipe(
      T.HttpQuery("instanceStateFilter"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/api/instance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DataIntegrationEventDatasetLoadExecutionDetails extends S.Class<DataIntegrationEventDatasetLoadExecutionDetails>(
  "DataIntegrationEventDatasetLoadExecutionDetails",
)({ status: S.String, message: S.optional(S.String) }) {}
export class DataIntegrationEventDatasetTargetDetails extends S.Class<DataIntegrationEventDatasetTargetDetails>(
  "DataIntegrationEventDatasetTargetDetails",
)({
  datasetIdentifier: S.String,
  operationType: S.String,
  datasetLoadExecution: DataIntegrationEventDatasetLoadExecutionDetails,
}) {}
export class DataIntegrationEvent extends S.Class<DataIntegrationEvent>(
  "DataIntegrationEvent",
)({
  instanceId: S.String,
  eventId: S.String,
  eventType: S.String,
  eventGroupId: S.String,
  eventTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  datasetTargetDetails: S.optional(DataIntegrationEventDatasetTargetDetails),
}) {}
export const DataIntegrationEventList = S.Array(DataIntegrationEvent);
export class DataIntegrationFlowS3Source extends S.Class<DataIntegrationFlowS3Source>(
  "DataIntegrationFlowS3Source",
)({ bucketName: S.String, key: S.String }) {}
export class DataIntegrationFlowDatasetSource extends S.Class<DataIntegrationFlowDatasetSource>(
  "DataIntegrationFlowDatasetSource",
)({ datasetIdentifier: S.String }) {}
export class DataIntegrationFlowExecutionSourceInfo extends S.Class<DataIntegrationFlowExecutionSourceInfo>(
  "DataIntegrationFlowExecutionSourceInfo",
)({
  sourceType: S.String,
  s3Source: S.optional(DataIntegrationFlowS3Source),
  datasetSource: S.optional(DataIntegrationFlowDatasetSource),
}) {}
export class DataIntegrationFlowExecutionOutputMetadata extends S.Class<DataIntegrationFlowExecutionOutputMetadata>(
  "DataIntegrationFlowExecutionOutputMetadata",
)({ diagnosticReportsRootS3URI: S.optional(S.String) }) {}
export class DataIntegrationFlowExecution extends S.Class<DataIntegrationFlowExecution>(
  "DataIntegrationFlowExecution",
)({
  instanceId: S.String,
  flowName: S.String,
  executionId: S.String,
  status: S.optional(S.String),
  sourceInfo: S.optional(DataIntegrationFlowExecutionSourceInfo),
  message: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  outputMetadata: S.optional(DataIntegrationFlowExecutionOutputMetadata),
}) {}
export const DataIntegrationFlowExecutionList = S.Array(
  DataIntegrationFlowExecution,
);
export class DataIntegrationEventDatasetTargetConfiguration extends S.Class<DataIntegrationEventDatasetTargetConfiguration>(
  "DataIntegrationEventDatasetTargetConfiguration",
)({ datasetIdentifier: S.String, operationType: S.String }) {}
export class DataIntegrationFlow extends S.Class<DataIntegrationFlow>(
  "DataIntegrationFlow",
)({
  instanceId: S.String,
  name: S.String,
  sources: DataIntegrationFlowSourceList,
  transformation: DataIntegrationFlowTransformation,
  target: DataIntegrationFlowTarget,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const DataIntegrationFlowList = S.Array(DataIntegrationFlow);
export class DataLakeDatasetSchemaField extends S.Class<DataLakeDatasetSchemaField>(
  "DataLakeDatasetSchemaField",
)({ name: S.String, type: S.String, isRequired: S.Boolean }) {}
export const DataLakeDatasetSchemaFieldList = S.Array(
  DataLakeDatasetSchemaField,
);
export class DataLakeDatasetPrimaryKeyField extends S.Class<DataLakeDatasetPrimaryKeyField>(
  "DataLakeDatasetPrimaryKeyField",
)({ name: S.String }) {}
export const DataLakeDatasetPrimaryKeyFieldList = S.Array(
  DataLakeDatasetPrimaryKeyField,
);
export class DataLakeDatasetSchema extends S.Class<DataLakeDatasetSchema>(
  "DataLakeDatasetSchema",
)({
  name: S.String,
  fields: DataLakeDatasetSchemaFieldList,
  primaryKeys: S.optional(DataLakeDatasetPrimaryKeyFieldList),
}) {}
export class DataLakeDatasetPartitionFieldTransform extends S.Class<DataLakeDatasetPartitionFieldTransform>(
  "DataLakeDatasetPartitionFieldTransform",
)({ type: S.String }) {}
export class DataLakeDatasetPartitionField extends S.Class<DataLakeDatasetPartitionField>(
  "DataLakeDatasetPartitionField",
)({ name: S.String, transform: DataLakeDatasetPartitionFieldTransform }) {}
export const DataLakeDatasetPartitionFieldList = S.Array(
  DataLakeDatasetPartitionField,
);
export class DataLakeDatasetPartitionSpec extends S.Class<DataLakeDatasetPartitionSpec>(
  "DataLakeDatasetPartitionSpec",
)({ fields: DataLakeDatasetPartitionFieldList }) {}
export class DataLakeDataset extends S.Class<DataLakeDataset>(
  "DataLakeDataset",
)({
  instanceId: S.String,
  namespace: S.String,
  name: S.String,
  arn: S.String,
  schema: DataLakeDatasetSchema,
  description: S.optional(S.String),
  partitionSpec: S.optional(DataLakeDatasetPartitionSpec),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const DataLakeDatasetList = S.Array(DataLakeDataset);
export class DataLakeNamespace extends S.Class<DataLakeNamespace>(
  "DataLakeNamespace",
)({
  instanceId: S.String,
  name: S.String,
  arn: S.String,
  description: S.optional(S.String),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const DataLakeNamespaceList = S.Array(DataLakeNamespace);
export class Instance extends S.Class<Instance>("Instance")({
  instanceId: S.String,
  awsAccountId: S.String,
  state: S.String,
  errorMessage: S.optional(S.String),
  webAppDnsDomain: S.optional(S.String),
  createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  instanceName: S.optional(S.String),
  instanceDescription: S.optional(S.String),
  kmsKeyArn: S.optional(S.String),
  versionNumber: S.optional(S.Number),
}) {}
export const InstanceList = S.Array(Instance);
export class ListDataIntegrationEventsResponse extends S.Class<ListDataIntegrationEventsResponse>(
  "ListDataIntegrationEventsResponse",
)({ events: DataIntegrationEventList, nextToken: S.optional(S.String) }) {}
export class ListDataIntegrationFlowExecutionsResponse extends S.Class<ListDataIntegrationFlowExecutionsResponse>(
  "ListDataIntegrationFlowExecutionsResponse",
)({
  flowExecutions: DataIntegrationFlowExecutionList,
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: TagMap }) {}
export class SendDataIntegrationEventRequest extends S.Class<SendDataIntegrationEventRequest>(
  "SendDataIntegrationEventRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    eventType: S.String,
    data: S.String,
    eventGroupId: S.String,
    eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String),
    datasetTarget: S.optional(DataIntegrationEventDatasetTargetConfiguration),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-events",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/api/tags/{resourceArn}" }),
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
export class CreateBillOfMaterialsImportJobResponse extends S.Class<CreateBillOfMaterialsImportJobResponse>(
  "CreateBillOfMaterialsImportJobResponse",
)({ jobId: S.String }) {}
export class UpdateDataIntegrationFlowResponse extends S.Class<UpdateDataIntegrationFlowResponse>(
  "UpdateDataIntegrationFlowResponse",
)({ flow: DataIntegrationFlow }) {}
export class DeleteDataIntegrationFlowResponse extends S.Class<DeleteDataIntegrationFlowResponse>(
  "DeleteDataIntegrationFlowResponse",
)({ instanceId: S.String, name: S.String }) {}
export class ListDataIntegrationFlowsResponse extends S.Class<ListDataIntegrationFlowsResponse>(
  "ListDataIntegrationFlowsResponse",
)({ flows: DataIntegrationFlowList, nextToken: S.optional(S.String) }) {}
export class UpdateDataLakeDatasetResponse extends S.Class<UpdateDataLakeDatasetResponse>(
  "UpdateDataLakeDatasetResponse",
)({ dataset: DataLakeDataset }) {}
export class DeleteDataLakeDatasetResponse extends S.Class<DeleteDataLakeDatasetResponse>(
  "DeleteDataLakeDatasetResponse",
)({ instanceId: S.String, namespace: S.String, name: S.String }) {}
export class ListDataLakeDatasetsResponse extends S.Class<ListDataLakeDatasetsResponse>(
  "ListDataLakeDatasetsResponse",
)({ datasets: DataLakeDatasetList, nextToken: S.optional(S.String) }) {}
export class GetDataLakeNamespaceResponse extends S.Class<GetDataLakeNamespaceResponse>(
  "GetDataLakeNamespaceResponse",
)({ namespace: DataLakeNamespace }) {}
export class UpdateDataLakeNamespaceResponse extends S.Class<UpdateDataLakeNamespaceResponse>(
  "UpdateDataLakeNamespaceResponse",
)({ namespace: DataLakeNamespace }) {}
export class DeleteDataLakeNamespaceResponse extends S.Class<DeleteDataLakeNamespaceResponse>(
  "DeleteDataLakeNamespaceResponse",
)({ instanceId: S.String, name: S.String }) {}
export class ListDataLakeNamespacesResponse extends S.Class<ListDataLakeNamespacesResponse>(
  "ListDataLakeNamespacesResponse",
)({ namespaces: DataLakeNamespaceList, nextToken: S.optional(S.String) }) {}
export class GetInstanceResponse extends S.Class<GetInstanceResponse>(
  "GetInstanceResponse",
)({ instance: Instance }) {}
export class UpdateInstanceResponse extends S.Class<UpdateInstanceResponse>(
  "UpdateInstanceResponse",
)({ instance: Instance }) {}
export class DeleteInstanceResponse extends S.Class<DeleteInstanceResponse>(
  "DeleteInstanceResponse",
)({ instance: Instance }) {}
export class ListInstancesResponse extends S.Class<ListInstancesResponse>(
  "ListInstancesResponse",
)({ instances: InstanceList, nextToken: S.optional(S.String) }) {}
export class BillOfMaterialsImportJob extends S.Class<BillOfMaterialsImportJob>(
  "BillOfMaterialsImportJob",
)({
  instanceId: S.String,
  jobId: S.String,
  status: S.String,
  s3uri: S.String,
  message: S.optional(S.String),
}) {}
export class SendDataIntegrationEventResponse extends S.Class<SendDataIntegrationEventResponse>(
  "SendDataIntegrationEventResponse",
)({ eventId: S.String }) {}
export class GetBillOfMaterialsImportJobResponse extends S.Class<GetBillOfMaterialsImportJobResponse>(
  "GetBillOfMaterialsImportJobResponse",
)({ job: BillOfMaterialsImportJob }) {}
export class GetDataIntegrationFlowResponse extends S.Class<GetDataIntegrationFlowResponse>(
  "GetDataIntegrationFlowResponse",
)({ flow: DataIntegrationFlow }) {}
export class GetDataLakeDatasetResponse extends S.Class<GetDataLakeDatasetResponse>(
  "GetDataLakeDatasetResponse",
)({ dataset: DataLakeDataset }) {}
export class CreateDataLakeNamespaceResponse extends S.Class<CreateDataLakeNamespaceResponse>(
  "CreateDataLakeNamespaceResponse",
)({ namespace: DataLakeNamespace }) {}
export class CreateInstanceResponse extends S.Class<CreateInstanceResponse>(
  "CreateInstanceResponse",
)({ instance: Instance }) {}
export class CreateDataLakeDatasetRequest extends S.Class<CreateDataLakeDatasetRequest>(
  "CreateDataLakeDatasetRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    schema: S.optional(DataLakeDatasetSchema),
    description: S.optional(S.String),
    partitionSpec: S.optional(DataLakeDatasetPartitionSpec),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/api/datalake/instance/{instanceId}/namespaces/{namespace}/datasets/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataIntegrationEventResponse extends S.Class<GetDataIntegrationEventResponse>(
  "GetDataIntegrationEventResponse",
)({ event: DataIntegrationEvent }) {}
export class GetDataIntegrationFlowExecutionResponse extends S.Class<GetDataIntegrationFlowExecutionResponse>(
  "GetDataIntegrationFlowExecutionResponse",
)({ flowExecution: DataIntegrationFlowExecution }) {}
export class CreateDataLakeDatasetResponse extends S.Class<CreateDataLakeDatasetResponse>(
  "CreateDataLakeDatasetResponse",
)({ dataset: DataLakeDataset }) {}
export class CreateDataIntegrationFlowRequest extends S.Class<CreateDataIntegrationFlowRequest>(
  "CreateDataIntegrationFlowRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    sources: DataIntegrationFlowSourceList,
    transformation: DataIntegrationFlowTransformation,
    target: DataIntegrationFlowTarget,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/api/data-integration/instance/{instanceId}/data-integration-flows/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataIntegrationFlowResponse extends S.Class<CreateDataIntegrationFlowResponse>(
  "CreateDataIntegrationFlowResponse",
)({ instanceId: S.String, name: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Enable you to programmatically delete an existing data pipeline for the provided Amazon Web Services Supply Chain instance and DataIntegrationFlow name.
 */
export const deleteDataIntegrationFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataIntegrationFlowRequest,
    output: DeleteDataIntegrationFlowResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Enables you to programmatically list all data pipelines for the provided Amazon Web Services Supply Chain instance.
 */
export const listDataIntegrationFlows =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataIntegrationFlowsRequest,
    output: ListDataIntegrationFlowsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "flows",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Get status and details of a BillOfMaterialsImportJob.
 */
export const getBillOfMaterialsImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBillOfMaterialsImportJobRequest,
    output: GetBillOfMaterialsImportJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables you to programmatically view a specific data pipeline for the provided Amazon Web Services Supply Chain instance and DataIntegrationFlow name.
 */
export const getDataIntegrationFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataIntegrationFlowRequest,
    output: GetDataIntegrationFlowResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables you to programmatically view an Amazon Web Services Supply Chain data lake dataset. Developers can view the data lake dataset information such as namespace, schema, and so on for a given instance ID, namespace, and dataset name.
 */
export const getDataLakeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataLakeDatasetRequest,
  output: GetDataLakeDatasetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically update an existing data pipeline to ingest data from the source systems such as, Amazon S3 buckets, to a predefined Amazon Web Services Supply Chain dataset (product, inbound_order) or a temporary dataset along with the data transformation query provided with the API.
 */
export const updateDataIntegrationFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDataIntegrationFlowRequest,
    output: UpdateDataIntegrationFlowResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables you to programmatically update an Amazon Web Services Supply Chain data lake dataset. Developers can update the description of a data lake dataset for a given instance ID, namespace, and dataset name.
 */
export const updateDataLakeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDataLakeDatasetRequest,
    output: UpdateDataLakeDatasetResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables you to programmatically delete an Amazon Web Services Supply Chain data lake dataset. Developers can delete the existing datasets for a given instance ID, namespace, and instance name.
 */
export const deleteDataLakeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataLakeDatasetRequest,
    output: DeleteDataLakeDatasetResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables you to programmatically view the list of Amazon Web Services Supply Chain data lake datasets. Developers can view the datasets and the corresponding information such as namespace, schema, and so on for a given instance ID and namespace.
 */
export const listDataLakeDatasets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataLakeDatasetsRequest,
    output: ListDataLakeDatasetsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "datasets",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Enables you to programmatically view an Amazon Web Services Supply Chain data lake namespace. Developers can view the data lake namespace information such as description for a given instance ID and namespace name.
 */
export const getDataLakeNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataLakeNamespaceRequest,
    output: GetDataLakeNamespaceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables you to programmatically update an Amazon Web Services Supply Chain data lake namespace. Developers can update the description of a data lake namespace for a given instance ID and namespace name.
 */
export const updateDataLakeNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDataLakeNamespaceRequest,
    output: UpdateDataLakeNamespaceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables you to programmatically delete an Amazon Web Services Supply Chain data lake namespace and its underling datasets. Developers can delete the existing namespaces for a given instance ID and namespace name.
 */
export const deleteDataLakeNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataLakeNamespaceRequest,
    output: DeleteDataLakeNamespaceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables you to programmatically retrieve the information related to an Amazon Web Services Supply Chain instance ID.
 */
export const getInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceRequest,
  output: GetInstanceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically update an Amazon Web Services Supply Chain instance description by providing all the relevant information such as account ID, instance ID and so on without using the AWS console.
 */
export const updateInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInstanceRequest,
  output: UpdateInstanceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically delete an Amazon Web Services Supply Chain instance by deleting the KMS keys and relevant information associated with the API without using the Amazon Web Services console.
 *
 * This is an asynchronous operation. Upon receiving a DeleteInstance request, Amazon Web Services Supply Chain immediately returns a response with the instance resource, delete state while cleaning up all Amazon Web Services resources created during the instance creation process. You can use the GetInstance action to check the instance status.
 */
export const deleteInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInstanceRequest,
  output: DeleteInstanceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List flow executions.
 */
export const listDataIntegrationFlowExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataIntegrationFlowExecutionsRequest,
    output: ListDataIntegrationFlowExecutionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "flowExecutions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List all the tags for an Amazon Web ServicesSupply Chain resource. You can list all the tags added to a resource. By listing the tags, developers can view the tag level information on a resource and perform actions such as, deleting a resource associated with a particular tag.
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
 * You can create tags during or after creating a resource such as instance, data flow, or dataset in AWS Supply chain. During the data ingestion process, you can add tags such as dev, test, or prod to data flows created during the data ingestion process in the AWS Supply Chain datasets. You can use these tags to identify a group of resources or a single resource used by the developer.
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
 * Send the data payload for the event with real-time data for analysis or monitoring. The real-time data events are stored in an Amazon Web Services service before being processed and stored in data lake.
 */
export const sendDataIntegrationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendDataIntegrationEventRequest,
    output: SendDataIntegrationEventResponse,
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
 * Enables you to programmatically create an Amazon Web Services Supply Chain data lake namespace. Developers can create the namespaces for a given instance ID.
 */
export const createDataLakeNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataLakeNamespaceRequest,
    output: CreateDataLakeNamespaceResponse,
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
 * Enables you to programmatically create an Amazon Web Services Supply Chain instance by applying KMS keys and relevant information associated with the API without using the Amazon Web Services console.
 *
 * This is an asynchronous operation. Upon receiving a CreateInstance request, Amazon Web Services Supply Chain immediately returns the instance resource, instance ID, and the initializing state while simultaneously creating all required Amazon Web Services resources for an instance creation. You can use GetInstance to check the status of the instance. If the instance results in an unhealthy state, you need to check the error message, delete the current instance, and recreate a new one based on the mitigation from the error message.
 */
export const createInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInstanceRequest,
  output: CreateInstanceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically view the list of Amazon Web Services Supply Chain data lake namespaces. Developers can view the namespaces and the corresponding information such as description for a given instance ID. Note that this API only return custom namespaces, instance pre-defined namespaces are not included.
 */
export const listDataLakeNamespaces =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataLakeNamespacesRequest,
    output: ListDataLakeNamespacesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "namespaces",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List all Amazon Web Services Supply Chain instances for a specific account. Enables you to programmatically list all Amazon Web Services Supply Chain instances based on their account ID, instance name, and state of the instance (active or delete).
 */
export const listInstances = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInstancesRequest,
    output: ListInstancesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "instances",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Enables you to programmatically list all data integration events for the provided Amazon Web Services Supply Chain instance.
 */
export const listDataIntegrationEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataIntegrationEventsRequest,
    output: ListDataIntegrationEventsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "events",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * You can delete tags for an Amazon Web Services Supply chain resource such as instance, data flow, or dataset in AWS Supply Chain. During the data ingestion process, you can delete tags such as dev, test, or prod to data flows created during the data ingestion process in the AWS Supply Chain datasets.
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
 * CreateBillOfMaterialsImportJob creates an import job for the Product Bill Of Materials (BOM) entity. For information on the product_bom entity, see the AWS Supply Chain User Guide.
 *
 * The CSV file must be located in an Amazon S3 location accessible to AWS Supply Chain. It is recommended to use the same Amazon S3 bucket created during your AWS Supply Chain instance creation.
 */
export const createBillOfMaterialsImportJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateBillOfMaterialsImportJobRequest,
    output: CreateBillOfMaterialsImportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Enables you to programmatically view an Amazon Web Services Supply Chain Data Integration Event. Developers can view the eventType, eventGroupId, eventTimestamp, datasetTarget, datasetLoadExecution.
 */
export const getDataIntegrationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataIntegrationEventRequest,
    output: GetDataIntegrationEventResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Get the flow execution.
 */
export const getDataIntegrationFlowExecution =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDataIntegrationFlowExecutionRequest,
    output: GetDataIntegrationFlowExecutionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Enables you to programmatically create an Amazon Web Services Supply Chain data lake dataset. Developers can create the datasets using their pre-defined or custom schema for a given instance ID, namespace, and dataset name.
 */
export const createDataLakeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataLakeDatasetRequest,
    output: CreateDataLakeDatasetResponse,
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
 * Enables you to programmatically create a data pipeline to ingest data from source systems such as Amazon S3 buckets, to a predefined Amazon Web Services Supply Chain dataset (product, inbound_order) or a temporary dataset along with the data transformation query provided with the API.
 */
export const createDataIntegrationFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataIntegrationFlowRequest,
    output: CreateDataIntegrationFlowResponse,
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
