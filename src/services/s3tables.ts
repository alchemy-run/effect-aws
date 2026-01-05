import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "S3Tables",
  serviceShapeName: "S3TableBuckets",
});
const auth = T.AwsAuthSigv4({ name: "s3tables" });
const ver = T.ServiceVersion("2018-05-10");
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
                                url: "https://s3tables-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://s3tables-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://s3tables.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://s3tables.{Region}.{PartitionResult#dnsSuffix}",
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
export const NamespaceList = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tag/{resourceArn}" }),
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
    T.Http({ method: "DELETE", uri: "/tag/{resourceArn}" }),
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
export class CreateNamespaceRequest extends S.Class<CreateNamespaceRequest>(
  "CreateNamespaceRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: NamespaceList,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/namespaces/{tableBucketARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNamespaceRequest extends S.Class<DeleteNamespaceRequest>(
  "DeleteNamespaceRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/namespaces/{tableBucketARN}/{namespace}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNamespaceResponse extends S.Class<DeleteNamespaceResponse>(
  "DeleteNamespaceResponse",
)({}) {}
export class GetNamespaceRequest extends S.Class<GetNamespaceRequest>(
  "GetNamespaceRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/namespaces/{tableBucketARN}/{namespace}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNamespacesRequest extends S.Class<ListNamespacesRequest>(
  "ListNamespacesRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    continuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuationToken"),
    ),
    maxNamespaces: S.optional(S.Number).pipe(T.HttpQuery("maxNamespaces")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/namespaces/{tableBucketARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableBucketEncryptionRequest extends S.Class<DeleteTableBucketEncryptionRequest>(
  "DeleteTableBucketEncryptionRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/buckets/{tableBucketARN}/encryption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableBucketEncryptionResponse extends S.Class<DeleteTableBucketEncryptionResponse>(
  "DeleteTableBucketEncryptionResponse",
)({}) {}
export class GetTableBucketEncryptionRequest extends S.Class<GetTableBucketEncryptionRequest>(
  "GetTableBucketEncryptionRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/encryption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableBucketPolicyRequest extends S.Class<DeleteTableBucketPolicyRequest>(
  "DeleteTableBucketPolicyRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/buckets/{tableBucketARN}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableBucketPolicyResponse extends S.Class<DeleteTableBucketPolicyResponse>(
  "DeleteTableBucketPolicyResponse",
)({}) {}
export class GetTableBucketPolicyRequest extends S.Class<GetTableBucketPolicyRequest>(
  "GetTableBucketPolicyRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableBucketPolicyRequest extends S.Class<PutTableBucketPolicyRequest>(
  "PutTableBucketPolicyRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    resourcePolicy: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/buckets/{tableBucketARN}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableBucketPolicyResponse extends S.Class<PutTableBucketPolicyResponse>(
  "PutTableBucketPolicyResponse",
)({}) {}
export class DeleteTableBucketReplicationRequest extends S.Class<DeleteTableBucketReplicationRequest>(
  "DeleteTableBucketReplicationRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpQuery("tableBucketARN")),
    versionToken: S.optional(S.String).pipe(T.HttpQuery("versionToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/table-bucket-replication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableBucketReplicationResponse extends S.Class<DeleteTableBucketReplicationResponse>(
  "DeleteTableBucketReplicationResponse",
)({}) {}
export class GetTableBucketReplicationRequest extends S.Class<GetTableBucketReplicationRequest>(
  "GetTableBucketReplicationRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpQuery("tableBucketARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/table-bucket-replication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableBucketRequest extends S.Class<DeleteTableBucketRequest>(
  "DeleteTableBucketRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/buckets/{tableBucketARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableBucketResponse extends S.Class<DeleteTableBucketResponse>(
  "DeleteTableBucketResponse",
)({}) {}
export class DeleteTableBucketMetricsConfigurationRequest extends S.Class<DeleteTableBucketMetricsConfigurationRequest>(
  "DeleteTableBucketMetricsConfigurationRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/buckets/{tableBucketARN}/metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableBucketMetricsConfigurationResponse extends S.Class<DeleteTableBucketMetricsConfigurationResponse>(
  "DeleteTableBucketMetricsConfigurationResponse",
)({}) {}
export class GetTableBucketRequest extends S.Class<GetTableBucketRequest>(
  "GetTableBucketRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableBucketMaintenanceConfigurationRequest extends S.Class<GetTableBucketMaintenanceConfigurationRequest>(
  "GetTableBucketMaintenanceConfigurationRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/maintenance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableBucketMetricsConfigurationRequest extends S.Class<GetTableBucketMetricsConfigurationRequest>(
  "GetTableBucketMetricsConfigurationRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableBucketStorageClassRequest extends S.Class<GetTableBucketStorageClassRequest>(
  "GetTableBucketStorageClassRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/storage-class" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTableBucketsRequest extends S.Class<ListTableBucketsRequest>(
  "ListTableBucketsRequest",
)(
  {
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    continuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuationToken"),
    ),
    maxBuckets: S.optional(S.Number).pipe(T.HttpQuery("maxBuckets")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/buckets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableBucketMetricsConfigurationRequest extends S.Class<PutTableBucketMetricsConfigurationRequest>(
  "PutTableBucketMetricsConfigurationRequest",
)(
  { tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")) },
  T.all(
    T.Http({ method: "PUT", uri: "/buckets/{tableBucketARN}/metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableBucketMetricsConfigurationResponse extends S.Class<PutTableBucketMetricsConfigurationResponse>(
  "PutTableBucketMetricsConfigurationResponse",
)({}) {}
export class StorageClassConfiguration extends S.Class<StorageClassConfiguration>(
  "StorageClassConfiguration",
)({ storageClass: S.String }) {}
export class PutTableBucketStorageClassRequest extends S.Class<PutTableBucketStorageClassRequest>(
  "PutTableBucketStorageClassRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    storageClassConfiguration: StorageClassConfiguration,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/buckets/{tableBucketARN}/storage-class" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableBucketStorageClassResponse extends S.Class<PutTableBucketStorageClassResponse>(
  "PutTableBucketStorageClassResponse",
)({}) {}
export class GetTableEncryptionRequest extends S.Class<GetTableEncryptionRequest>(
  "GetTableEncryptionRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/encryption",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTablePolicyRequest extends S.Class<DeleteTablePolicyRequest>(
  "DeleteTablePolicyRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTablePolicyResponse extends S.Class<DeleteTablePolicyResponse>(
  "DeleteTablePolicyResponse",
)({}) {}
export class GetTablePolicyRequest extends S.Class<GetTablePolicyRequest>(
  "GetTablePolicyRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTablePolicyRequest extends S.Class<PutTablePolicyRequest>(
  "PutTablePolicyRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    resourcePolicy: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTablePolicyResponse extends S.Class<PutTablePolicyResponse>(
  "PutTablePolicyResponse",
)({}) {}
export class DeleteTableReplicationRequest extends S.Class<DeleteTableReplicationRequest>(
  "DeleteTableReplicationRequest",
)(
  {
    tableArn: S.String.pipe(T.HttpQuery("tableArn")),
    versionToken: S.String.pipe(T.HttpQuery("versionToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/table-replication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableReplicationResponse extends S.Class<DeleteTableReplicationResponse>(
  "DeleteTableReplicationResponse",
)({}) {}
export class GetTableReplicationRequest extends S.Class<GetTableReplicationRequest>(
  "GetTableReplicationRequest",
)(
  { tableArn: S.String.pipe(T.HttpQuery("tableArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/table-replication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableReplicationStatusRequest extends S.Class<GetTableReplicationStatusRequest>(
  "GetTableReplicationStatusRequest",
)(
  { tableArn: S.String.pipe(T.HttpQuery("tableArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/replication-status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableRequest extends S.Class<DeleteTableRequest>(
  "DeleteTableRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    versionToken: S.optional(S.String).pipe(T.HttpQuery("versionToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTableResponse extends S.Class<DeleteTableResponse>(
  "DeleteTableResponse",
)({}) {}
export class GetTableRequest extends S.Class<GetTableRequest>(
  "GetTableRequest",
)(
  {
    tableBucketARN: S.optional(S.String).pipe(T.HttpQuery("tableBucketARN")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    tableArn: S.optional(S.String).pipe(T.HttpQuery("tableArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/get-table" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableMaintenanceConfigurationRequest extends S.Class<GetTableMaintenanceConfigurationRequest>(
  "GetTableMaintenanceConfigurationRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/maintenance",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableMaintenanceJobStatusRequest extends S.Class<GetTableMaintenanceJobStatusRequest>(
  "GetTableMaintenanceJobStatusRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/maintenance-job-status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableMetadataLocationRequest extends S.Class<GetTableMetadataLocationRequest>(
  "GetTableMetadataLocationRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/metadata-location",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableRecordExpirationConfigurationRequest extends S.Class<GetTableRecordExpirationConfigurationRequest>(
  "GetTableRecordExpirationConfigurationRequest",
)(
  { tableArn: S.String.pipe(T.HttpQuery("tableArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/table-record-expiration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableRecordExpirationJobStatusRequest extends S.Class<GetTableRecordExpirationJobStatusRequest>(
  "GetTableRecordExpirationJobStatusRequest",
)(
  { tableArn: S.String.pipe(T.HttpQuery("tableArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/table-record-expiration-job-status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableStorageClassRequest extends S.Class<GetTableStorageClassRequest>(
  "GetTableStorageClassRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/storage-class",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTablesRequest extends S.Class<ListTablesRequest>(
  "ListTablesRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    continuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuationToken"),
    ),
    maxTables: S.optional(S.Number).pipe(T.HttpQuery("maxTables")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/tables/{tableBucketARN}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RenameTableRequest extends S.Class<RenameTableRequest>(
  "RenameTableRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    newNamespaceName: S.optional(S.String),
    newName: S.optional(S.String),
    versionToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/rename",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RenameTableResponse extends S.Class<RenameTableResponse>(
  "RenameTableResponse",
)({}) {}
export class UpdateTableMetadataLocationRequest extends S.Class<UpdateTableMetadataLocationRequest>(
  "UpdateTableMetadataLocationRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    versionToken: S.String,
    metadataLocation: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/metadata-location",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ sseAlgorithm: S.String, kmsKeyArn: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tag/{resourceArn}" }),
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
export class CreateNamespaceResponse extends S.Class<CreateNamespaceResponse>(
  "CreateNamespaceResponse",
)({ tableBucketARN: S.String, namespace: NamespaceList }) {}
export class GetNamespaceResponse extends S.Class<GetNamespaceResponse>(
  "GetNamespaceResponse",
)({
  namespace: NamespaceList,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  ownerAccountId: S.String,
  namespaceId: S.optional(S.String),
  tableBucketId: S.optional(S.String),
}) {}
export class GetTableBucketEncryptionResponse extends S.Class<GetTableBucketEncryptionResponse>(
  "GetTableBucketEncryptionResponse",
)({ encryptionConfiguration: EncryptionConfiguration }) {}
export class PutTableBucketEncryptionRequest extends S.Class<PutTableBucketEncryptionRequest>(
  "PutTableBucketEncryptionRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    encryptionConfiguration: EncryptionConfiguration,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/buckets/{tableBucketARN}/encryption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableBucketEncryptionResponse extends S.Class<PutTableBucketEncryptionResponse>(
  "PutTableBucketEncryptionResponse",
)({}) {}
export class GetTableBucketPolicyResponse extends S.Class<GetTableBucketPolicyResponse>(
  "GetTableBucketPolicyResponse",
)({ resourcePolicy: S.String }) {}
export class ReplicationDestination extends S.Class<ReplicationDestination>(
  "ReplicationDestination",
)({ destinationTableBucketARN: S.String }) {}
export const ReplicationDestinations = S.Array(ReplicationDestination);
export class TableBucketReplicationRule extends S.Class<TableBucketReplicationRule>(
  "TableBucketReplicationRule",
)({ destinations: ReplicationDestinations }) {}
export const TableBucketReplicationRules = S.Array(TableBucketReplicationRule);
export class TableBucketReplicationConfiguration extends S.Class<TableBucketReplicationConfiguration>(
  "TableBucketReplicationConfiguration",
)({ role: S.String, rules: TableBucketReplicationRules }) {}
export class GetTableBucketReplicationResponse extends S.Class<GetTableBucketReplicationResponse>(
  "GetTableBucketReplicationResponse",
)({
  versionToken: S.String,
  configuration: TableBucketReplicationConfiguration,
}) {}
export class CreateTableBucketRequest extends S.Class<CreateTableBucketRequest>(
  "CreateTableBucketRequest",
)(
  {
    name: S.String,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    storageClassConfiguration: S.optional(StorageClassConfiguration),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/buckets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableBucketResponse extends S.Class<GetTableBucketResponse>(
  "GetTableBucketResponse",
)({
  arn: S.String,
  name: S.String,
  ownerAccountId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  tableBucketId: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export class GetTableBucketMetricsConfigurationResponse extends S.Class<GetTableBucketMetricsConfigurationResponse>(
  "GetTableBucketMetricsConfigurationResponse",
)({ tableBucketARN: S.String, id: S.optional(S.String) }) {}
export class GetTableBucketStorageClassResponse extends S.Class<GetTableBucketStorageClassResponse>(
  "GetTableBucketStorageClassResponse",
)({ storageClassConfiguration: StorageClassConfiguration }) {}
export class GetTableEncryptionResponse extends S.Class<GetTableEncryptionResponse>(
  "GetTableEncryptionResponse",
)({ encryptionConfiguration: EncryptionConfiguration }) {}
export class GetTablePolicyResponse extends S.Class<GetTablePolicyResponse>(
  "GetTablePolicyResponse",
)({ resourcePolicy: S.String }) {}
export class TableReplicationRule extends S.Class<TableReplicationRule>(
  "TableReplicationRule",
)({ destinations: ReplicationDestinations }) {}
export const TableReplicationRules = S.Array(TableReplicationRule);
export class TableReplicationConfiguration extends S.Class<TableReplicationConfiguration>(
  "TableReplicationConfiguration",
)({ role: S.String, rules: TableReplicationRules }) {}
export class GetTableReplicationResponse extends S.Class<GetTableReplicationResponse>(
  "GetTableReplicationResponse",
)({ versionToken: S.String, configuration: TableReplicationConfiguration }) {}
export class GetTableMetadataLocationResponse extends S.Class<GetTableMetadataLocationResponse>(
  "GetTableMetadataLocationResponse",
)({
  versionToken: S.String,
  metadataLocation: S.optional(S.String),
  warehouseLocation: S.String,
}) {}
export class TableRecordExpirationSettings extends S.Class<TableRecordExpirationSettings>(
  "TableRecordExpirationSettings",
)({ days: S.optional(S.Number) }) {}
export class TableRecordExpirationConfigurationValue extends S.Class<TableRecordExpirationConfigurationValue>(
  "TableRecordExpirationConfigurationValue",
)({
  status: S.optional(S.String),
  settings: S.optional(TableRecordExpirationSettings),
}) {}
export class GetTableRecordExpirationConfigurationResponse extends S.Class<GetTableRecordExpirationConfigurationResponse>(
  "GetTableRecordExpirationConfigurationResponse",
)({ configuration: TableRecordExpirationConfigurationValue }) {}
export class GetTableStorageClassResponse extends S.Class<GetTableStorageClassResponse>(
  "GetTableStorageClassResponse",
)({ storageClassConfiguration: StorageClassConfiguration }) {}
export class UpdateTableMetadataLocationResponse extends S.Class<UpdateTableMetadataLocationResponse>(
  "UpdateTableMetadataLocationResponse",
)({
  name: S.String,
  tableARN: S.String,
  namespace: NamespaceList,
  versionToken: S.String,
  metadataLocation: S.String,
}) {}
export class NamespaceSummary extends S.Class<NamespaceSummary>(
  "NamespaceSummary",
)({
  namespace: NamespaceList,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  ownerAccountId: S.String,
  namespaceId: S.optional(S.String),
  tableBucketId: S.optional(S.String),
}) {}
export const NamespaceSummaryList = S.Array(NamespaceSummary);
export class IcebergUnreferencedFileRemovalSettings extends S.Class<IcebergUnreferencedFileRemovalSettings>(
  "IcebergUnreferencedFileRemovalSettings",
)({
  unreferencedDays: S.optional(S.Number),
  nonCurrentDays: S.optional(S.Number),
}) {}
export const TableBucketMaintenanceSettings = S.Union(
  S.Struct({
    icebergUnreferencedFileRemoval: IcebergUnreferencedFileRemovalSettings,
  }),
);
export class TableBucketMaintenanceConfigurationValue extends S.Class<TableBucketMaintenanceConfigurationValue>(
  "TableBucketMaintenanceConfigurationValue",
)({
  status: S.optional(S.String),
  settings: S.optional(TableBucketMaintenanceSettings),
}) {}
export const TableBucketMaintenanceConfiguration = S.Record({
  key: S.String,
  value: TableBucketMaintenanceConfigurationValue,
});
export class TableBucketSummary extends S.Class<TableBucketSummary>(
  "TableBucketSummary",
)({
  arn: S.String,
  name: S.String,
  ownerAccountId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  tableBucketId: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const TableBucketSummaryList = S.Array(TableBucketSummary);
export class IcebergCompactionSettings extends S.Class<IcebergCompactionSettings>(
  "IcebergCompactionSettings",
)({ targetFileSizeMB: S.optional(S.Number), strategy: S.optional(S.String) }) {}
export class IcebergSnapshotManagementSettings extends S.Class<IcebergSnapshotManagementSettings>(
  "IcebergSnapshotManagementSettings",
)({
  minSnapshotsToKeep: S.optional(S.Number),
  maxSnapshotAgeHours: S.optional(S.Number),
}) {}
export const TableMaintenanceSettings = S.Union(
  S.Struct({ icebergCompaction: IcebergCompactionSettings }),
  S.Struct({ icebergSnapshotManagement: IcebergSnapshotManagementSettings }),
);
export class TableMaintenanceConfigurationValue extends S.Class<TableMaintenanceConfigurationValue>(
  "TableMaintenanceConfigurationValue",
)({
  status: S.optional(S.String),
  settings: S.optional(TableMaintenanceSettings),
}) {}
export const TableMaintenanceConfiguration = S.Record({
  key: S.String,
  value: TableMaintenanceConfigurationValue,
});
export class TableRecordExpirationJobMetrics extends S.Class<TableRecordExpirationJobMetrics>(
  "TableRecordExpirationJobMetrics",
)({
  deletedDataFiles: S.optional(S.Number),
  deletedRecords: S.optional(S.Number),
  removedFilesSize: S.optional(S.Number),
}) {}
export class TableSummary extends S.Class<TableSummary>("TableSummary")({
  namespace: NamespaceList,
  name: S.String,
  type: S.String,
  tableARN: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  managedByService: S.optional(S.String),
  namespaceId: S.optional(S.String),
  tableBucketId: S.optional(S.String),
}) {}
export const TableSummaryList = S.Array(TableSummary);
export const TableProperties = S.Record({ key: S.String, value: S.String });
export class ListNamespacesResponse extends S.Class<ListNamespacesResponse>(
  "ListNamespacesResponse",
)({
  namespaces: NamespaceSummaryList,
  continuationToken: S.optional(S.String),
}) {}
export class CreateTableBucketResponse extends S.Class<CreateTableBucketResponse>(
  "CreateTableBucketResponse",
)({ arn: S.String }) {}
export class GetTableBucketMaintenanceConfigurationResponse extends S.Class<GetTableBucketMaintenanceConfigurationResponse>(
  "GetTableBucketMaintenanceConfigurationResponse",
)({
  tableBucketARN: S.String,
  configuration: TableBucketMaintenanceConfiguration,
}) {}
export class ListTableBucketsResponse extends S.Class<ListTableBucketsResponse>(
  "ListTableBucketsResponse",
)({
  tableBuckets: TableBucketSummaryList,
  continuationToken: S.optional(S.String),
}) {}
export class PutTableReplicationRequest extends S.Class<PutTableReplicationRequest>(
  "PutTableReplicationRequest",
)(
  {
    tableArn: S.String.pipe(T.HttpQuery("tableArn")),
    versionToken: S.optional(S.String).pipe(T.HttpQuery("versionToken")),
    configuration: TableReplicationConfiguration,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/table-replication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTableMaintenanceConfigurationResponse extends S.Class<GetTableMaintenanceConfigurationResponse>(
  "GetTableMaintenanceConfigurationResponse",
)({ tableARN: S.String, configuration: TableMaintenanceConfiguration }) {}
export class GetTableRecordExpirationJobStatusResponse extends S.Class<GetTableRecordExpirationJobStatusResponse>(
  "GetTableRecordExpirationJobStatusResponse",
)({
  status: S.String,
  lastRunTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  failureMessage: S.optional(S.String),
  metrics: S.optional(TableRecordExpirationJobMetrics),
}) {}
export class ListTablesResponse extends S.Class<ListTablesResponse>(
  "ListTablesResponse",
)({ tables: TableSummaryList, continuationToken: S.optional(S.String) }) {}
export class PutTableRecordExpirationConfigurationRequest extends S.Class<PutTableRecordExpirationConfigurationRequest>(
  "PutTableRecordExpirationConfigurationRequest",
)(
  {
    tableArn: S.String.pipe(T.HttpQuery("tableArn")),
    value: TableRecordExpirationConfigurationValue,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/table-record-expiration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableRecordExpirationConfigurationResponse extends S.Class<PutTableRecordExpirationConfigurationResponse>(
  "PutTableRecordExpirationConfigurationResponse",
)({}) {}
export class LastSuccessfulReplicatedUpdate extends S.Class<LastSuccessfulReplicatedUpdate>(
  "LastSuccessfulReplicatedUpdate",
)({
  metadataLocation: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ReplicationInformation extends S.Class<ReplicationInformation>(
  "ReplicationInformation",
)({ sourceTableARN: S.String }) {}
export class TableMaintenanceJobStatusValue extends S.Class<TableMaintenanceJobStatusValue>(
  "TableMaintenanceJobStatusValue",
)({
  status: S.String,
  lastRunTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  failureMessage: S.optional(S.String),
}) {}
export class SchemaField extends S.Class<SchemaField>("SchemaField")({
  name: S.String,
  type: S.String,
  required: S.optional(S.Boolean),
}) {}
export const SchemaFieldList = S.Array(SchemaField);
export class ReplicationDestinationStatusModel extends S.Class<ReplicationDestinationStatusModel>(
  "ReplicationDestinationStatusModel",
)({
  replicationStatus: S.String,
  destinationTableBucketArn: S.String,
  destinationTableArn: S.optional(S.String),
  lastSuccessfulReplicatedUpdate: S.optional(LastSuccessfulReplicatedUpdate),
  failureMessage: S.optional(S.String),
}) {}
export const ReplicationDestinationStatuses = S.Array(
  ReplicationDestinationStatusModel,
);
export class ManagedTableInformation extends S.Class<ManagedTableInformation>(
  "ManagedTableInformation",
)({ replicationInformation: S.optional(ReplicationInformation) }) {}
export const TableMaintenanceJobStatus = S.Record({
  key: S.String,
  value: TableMaintenanceJobStatusValue,
});
export class IcebergSchema extends S.Class<IcebergSchema>("IcebergSchema")({
  fields: SchemaFieldList,
}) {}
export class PutTableBucketReplicationRequest extends S.Class<PutTableBucketReplicationRequest>(
  "PutTableBucketReplicationRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpQuery("tableBucketARN")),
    versionToken: S.optional(S.String).pipe(T.HttpQuery("versionToken")),
    configuration: TableBucketReplicationConfiguration,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/table-bucket-replication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableBucketMaintenanceConfigurationRequest extends S.Class<PutTableBucketMaintenanceConfigurationRequest>(
  "PutTableBucketMaintenanceConfigurationRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    type: S.String.pipe(T.HttpLabel("type")),
    value: TableBucketMaintenanceConfigurationValue,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/buckets/{tableBucketARN}/maintenance/{type}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableBucketMaintenanceConfigurationResponse extends S.Class<PutTableBucketMaintenanceConfigurationResponse>(
  "PutTableBucketMaintenanceConfigurationResponse",
)({}) {}
export class GetTableReplicationStatusResponse extends S.Class<GetTableReplicationStatusResponse>(
  "GetTableReplicationStatusResponse",
)({ sourceTableArn: S.String, destinations: ReplicationDestinationStatuses }) {}
export class PutTableReplicationResponse extends S.Class<PutTableReplicationResponse>(
  "PutTableReplicationResponse",
)({ versionToken: S.String, status: S.String }) {}
export class GetTableResponse extends S.Class<GetTableResponse>(
  "GetTableResponse",
)({
  name: S.String,
  type: S.String,
  tableARN: S.String,
  namespace: NamespaceList,
  namespaceId: S.optional(S.String),
  versionToken: S.String,
  metadataLocation: S.optional(S.String),
  warehouseLocation: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  managedByService: S.optional(S.String),
  modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedBy: S.String,
  ownerAccountId: S.String,
  format: S.String,
  tableBucketId: S.optional(S.String),
  managedTableInformation: S.optional(ManagedTableInformation),
}) {}
export class GetTableMaintenanceJobStatusResponse extends S.Class<GetTableMaintenanceJobStatusResponse>(
  "GetTableMaintenanceJobStatusResponse",
)({ tableARN: S.String, status: TableMaintenanceJobStatus }) {}
export class PutTableMaintenanceConfigurationRequest extends S.Class<PutTableMaintenanceConfigurationRequest>(
  "PutTableMaintenanceConfigurationRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    type: S.String.pipe(T.HttpLabel("type")),
    value: TableMaintenanceConfigurationValue,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/tables/{tableBucketARN}/{namespace}/{name}/maintenance/{type}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTableMaintenanceConfigurationResponse extends S.Class<PutTableMaintenanceConfigurationResponse>(
  "PutTableMaintenanceConfigurationResponse",
)({}) {}
export class IcebergMetadata extends S.Class<IcebergMetadata>(
  "IcebergMetadata",
)({ schema: IcebergSchema, properties: S.optional(TableProperties) }) {}
export const TableMetadata = S.Union(S.Struct({ iceberg: IcebergMetadata }));
export class PutTableBucketReplicationResponse extends S.Class<PutTableBucketReplicationResponse>(
  "PutTableBucketReplicationResponse",
)({ versionToken: S.String, status: S.String }) {}
export class CreateTableRequest extends S.Class<CreateTableRequest>(
  "CreateTableRequest",
)(
  {
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String,
    format: S.String,
    metadata: S.optional(TableMetadata),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    storageClassConfiguration: S.optional(StorageClassConfiguration),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/tables/{tableBucketARN}/{namespace}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTableResponse extends S.Class<CreateTableResponse>(
  "CreateTableResponse",
)({ tableARN: S.String, versionToken: S.String }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class MethodNotAllowedException extends S.TaggedError<MethodNotAllowedException>()(
  "MethodNotAllowedException",
  { message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Retrieves the storage class configuration for a specific table. This allows you to view the storage class settings that apply to an individual table, which may differ from the table bucket's default configuration.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucketStorageClass` permission to use this operation.
 */
export const getTableBucketStorageClass = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTableBucketStorageClassRequest,
    output: GetTableBucketStorageClassResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates a new table associated with the given namespace in a table bucket. For more information, see Creating an Amazon S3 table in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * - You must have the `s3tables:CreateTable` permission to use this operation.
 *
 * - If you use this operation with the optional `metadata` request parameter you must have the `s3tables:PutTableData` permission.
 *
 * - If you use this operation with the optional `encryptionConfiguration` request parameter you must have the `s3tables:PutTableEncryption` permission.
 *
 * - If you use this operation with the `storageClassConfiguration` request parameter, you must have the `s3tables:PutTableStorageClass` permission.
 *
 * - To create a table with tags, you must have the `s3tables:TagResource` permission in addition to `s3tables:CreateTable` permission.
 *
 * Additionally, If you choose SSE-KMS encryption you must grant the S3 Tables maintenance principal access to your KMS key. For more information, see Permissions requirements for S3 Tables SSE-KMS encryption.
 */
export const createTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTableRequest,
  output: CreateTableResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the status, metrics, and details of the latest record expiration job for a table. This includes when the job ran, and whether it succeeded or failed. If the job ran successfully, this also includes statistics about the records that were removed.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableRecordExpirationJobStatus` permission to use this operation.
 */
export const getTableRecordExpirationJobStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTableRecordExpirationJobStatusRequest,
    output: GetTableRecordExpirationJobStatusResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Creates a new maintenance configuration or replaces an existing maintenance configuration for a table bucket. For more information, see Amazon S3 table bucket maintenance in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTableBucketMaintenanceConfiguration` permission to use this operation.
 */
export const putTableBucketMaintenanceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutTableBucketMaintenanceConfigurationRequest,
    output: PutTableBucketMaintenanceConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves the replication status for a table, including the status of replication to each destination. This operation provides visibility into replication health and progress.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableReplicationStatus` permission to use this operation.
 */
export const getTableReplicationStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTableReplicationStatusRequest,
    output: GetTableReplicationStatusResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates or updates the replication configuration for a specific table. This operation allows you to define table-level replication independently of bucket-level replication, providing granular control over which tables are replicated and where.
 *
 * ### Permissions
 *
 * - You must have the `s3tables:PutTableReplication` permission to use this operation. The IAM role specified in the configuration must have permissions to read from the source table and write to all destination tables.
 *
 * - You must also have the following permissions:
 *
 * - `s3tables:GetTable` permission on the source table being replicated.
 *
 * - `s3tables:CreateTable` permission for the destination.
 *
 * - `s3tables:CreateNamespace` permission for the destination.
 *
 * - `s3tables:GetTableMaintenanceConfig` permission for the source table.
 *
 * - `s3tables:PutTableMaintenanceConfig` permission for the destination table.
 *
 * - You must have `iam:PassRole` permission with condition allowing roles to be passed to `replication.s3tables.amazonaws.com`.
 */
export const putTableReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTableReplicationRequest,
  output: PutTableReplicationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets details about a table. For more information, see S3 Tables in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTable` permission to use this operation.
 */
export const getTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableRequest,
  output: GetTableResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the status of a maintenance job for a table. For more information, see S3 Tables maintenance in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableMaintenanceJobStatus` permission to use this operation.
 */
export const getTableMaintenanceJobStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTableMaintenanceJobStatusRequest,
    output: GetTableMaintenanceJobStatusResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Creates a new maintenance configuration or replaces an existing maintenance configuration for a table. For more information, see S3 Tables maintenance in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTableMaintenanceConfiguration` permission to use this operation.
 */
export const putTableMaintenanceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutTableMaintenanceConfigurationRequest,
    output: PutTableMaintenanceConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Lists table buckets for your account. For more information, see S3 Table buckets in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:ListTableBuckets` permission to use this operation.
 */
export const listTableBuckets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTableBucketsRequest,
    output: ListTableBucketsResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "continuationToken",
      outputToken: "continuationToken",
      items: "tableBuckets",
      pageSize: "maxBuckets",
    } as const,
  }),
);
/**
 * Gets details about the maintenance configuration of a table. For more information, see S3 Tables maintenance in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * - You must have the `s3tables:GetTableMaintenanceConfiguration` permission to use this operation.
 *
 * - You must have the `s3tables:GetTableData` permission to use set the compaction strategy to `sort` or `zorder`.
 */
export const getTableMaintenanceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTableMaintenanceConfigurationRequest,
    output: GetTableMaintenanceConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * List tables in the given table bucket. For more information, see S3 Tables in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:ListTables` permission to use this operation.
 */
export const listTables = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTablesRequest,
  output: ListTablesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "continuationToken",
    outputToken: "continuationToken",
    items: "tables",
    pageSize: "maxTables",
  } as const,
}));
/**
 * Creates a namespace. A namespace is a logical grouping of tables within your table bucket, which you can use to organize tables. For more information, see Create a namespace in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:CreateNamespace` permission to use this operation.
 */
export const createNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNamespaceRequest,
  output: CreateNamespaceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets the encryption configuration for a table bucket.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTableBucketEncryption` permission to use this operation.
 *
 * If you choose SSE-KMS encryption you must grant the S3 Tables maintenance principal access to your KMS key. For more information, see Permissions requirements for S3 Tables SSE-KMS encryption in the *Amazon Simple Storage Service User Guide*.
 */
export const putTableBucketEncryption = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutTableBucketEncryptionRequest,
    output: PutTableBucketEncryptionResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets details about a table bucket policy. For more information, see Viewing a table bucket policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucketPolicy` permission to use this operation.
 */
export const getTableBucketPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTableBucketPolicyRequest,
    output: GetTableBucketPolicyResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes the replication configuration for a table bucket. After deletion, new table updates will no longer be replicated to destination buckets, though existing replicated tables will remain in destination buckets.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTableBucketReplication` permission to use this operation.
 */
export const deleteTableBucketReplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteTableBucketReplicationRequest,
    output: DeleteTableBucketReplicationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves the replication configuration for a table bucket.This operation returns the IAM role, `versionToken`, and replication rules that define how tables in this bucket are replicated to other buckets.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucketReplication` permission to use this operation.
 */
export const getTableBucketReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTableBucketReplicationRequest,
    output: GetTableBucketReplicationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets details on a table bucket. For more information, see Viewing details about an Amazon S3 table bucket in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucket` permission to use this operation.
 */
export const getTableBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableBucketRequest,
  output: GetTableBucketResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the metrics configuration for a table bucket.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucketMetricsConfiguration` permission to use this operation.
 */
export const getTableBucketMetricsConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTableBucketMetricsConfigurationRequest,
    output: GetTableBucketMetricsConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets details about a table policy. For more information, see Viewing a table policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTablePolicy` permission to use this operation.
 */
export const getTablePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTablePolicyRequest,
  output: GetTablePolicyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the replication configuration for a specific table.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableReplication` permission to use this operation.
 */
export const getTableReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableReplicationRequest,
  output: GetTableReplicationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the location of the table metadata.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableMetadataLocation` permission to use this operation.
 */
export const getTableMetadataLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTableMetadataLocationRequest,
    output: GetTableMetadataLocationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Updates the metadata location for a table. The metadata location of a table must be an S3 URI that begins with the table's warehouse location. The metadata location for an Apache Iceberg table must end with `.metadata.json`, or if the metadata file is Gzip-compressed, `.metadata.json.gz`.
 *
 * ### Permissions
 *
 * You must have the `s3tables:UpdateTableMetadataLocation` permission to use this operation.
 */
export const updateTableMetadataLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTableMetadataLocationRequest,
    output: UpdateTableMetadataLocationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes a namespace. For more information, see Delete a namespace in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteNamespace` permission to use this operation.
 */
export const deleteNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamespaceRequest,
  output: DeleteNamespaceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the encryption configuration for a table bucket.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTableBucketEncryption` permission to use this operation.
 */
export const deleteTableBucketEncryption = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTableBucketEncryptionRequest,
    output: DeleteTableBucketEncryptionResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes a table bucket policy. For more information, see Deleting a table bucket policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTableBucketPolicy` permission to use this operation.
 */
export const deleteTableBucketPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTableBucketPolicyRequest,
    output: DeleteTableBucketPolicyResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates a new table bucket policy or replaces an existing table bucket policy for a table bucket. For more information, see Adding a table bucket policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTableBucketPolicy` permission to use this operation.
 */
export const putTableBucketPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutTableBucketPolicyRequest,
    output: PutTableBucketPolicyResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes a table bucket. For more information, see Deleting a table bucket in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTableBucket` permission to use this operation.
 */
export const deleteTableBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTableBucketRequest,
  output: DeleteTableBucketResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the metrics configuration for a table bucket.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTableBucketMetricsConfiguration` permission to use this operation.
 */
export const deleteTableBucketMetricsConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteTableBucketMetricsConfigurationRequest,
    output: DeleteTableBucketMetricsConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Sets the metrics configuration for a table bucket.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTableBucketMetricsConfiguration` permission to use this operation.
 */
export const putTableBucketMetricsConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutTableBucketMetricsConfigurationRequest,
    output: PutTableBucketMetricsConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Sets or updates the storage class configuration for a table bucket. This configuration serves as the default storage class for all new tables created in the bucket, allowing you to optimize storage costs at the bucket level.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTableBucketStorageClass` permission to use this operation.
 */
export const putTableBucketStorageClass = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutTableBucketStorageClassRequest,
    output: PutTableBucketStorageClassResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes a table policy. For more information, see Deleting a table policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTablePolicy` permission to use this operation.
 */
export const deleteTablePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTablePolicyRequest,
  output: DeleteTablePolicyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new table policy or replaces an existing table policy for a table. For more information, see Adding a table policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTablePolicy` permission to use this operation.
 */
export const putTablePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTablePolicyRequest,
  output: PutTablePolicyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a table. For more information, see Deleting an Amazon S3 table in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTable` permission to use this operation.
 */
export const deleteTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTableRequest,
  output: DeleteTableResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Renames a table or a namespace. For more information, see S3 Tables in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:RenameTable` permission to use this operation.
 */
export const renameTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RenameTableRequest,
  output: RenameTableResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists all of the tags applied to a specified Amazon S3 Tables resource. Each tag is a label consisting of a key and value pair. Tags can help you organize, track costs for, and control access to resources.
 *
 * For a list of S3 resources that support tagging, see Managing tags for Amazon S3 resources.
 *
 * ### Permissions
 *
 * For tables and table buckets, you must have the `s3tables:ListTagsForResource` permission to use this operation.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Applies one or more user-defined tags to an Amazon S3 Tables resource or updates existing tags. Each tag is a label consisting of a key and value pair. Tags can help you organize, track costs for, and control access to your resources. You can add up to 50 tags for each S3 resource.
 *
 * For a list of S3 resources that support tagging, see Managing tags for Amazon S3 resources.
 *
 * ### Permissions
 *
 * For tables and table buckets, you must have the `s3tables:TagResource` permission to use this operation.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the replication configuration for a specific table. After deletion, new updates to this table will no longer be replicated to destination tables, though existing replicated copies will remain in destination buckets.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTableReplication` permission to use this operation.
 */
export const deleteTableReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTableReplicationRequest,
    output: DeleteTableReplicationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets details about a namespace. For more information, see Table namespaces in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetNamespace` permission to use this operation.
 */
export const getNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNamespaceRequest,
  output: GetNamespaceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the encryption configuration for a table.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableEncryption` permission to use this operation.
 */
export const getTableEncryption = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableEncryptionRequest,
  output: GetTableEncryptionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the storage class configuration for a specific table. This allows you to view the storage class settings that apply to an individual table, which may differ from the table bucket's default configuration.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableStorageClass` permission to use this operation.
 */
export const getTableStorageClass = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTableStorageClassRequest,
    output: GetTableStorageClassResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the encryption configuration for a table bucket.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucketEncryption` permission to use this operation.
 */
export const getTableBucketEncryption = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTableBucketEncryptionRequest,
    output: GetTableBucketEncryptionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Removes the specified user-defined tags from an Amazon S3 Tables resource. You can pass one or more tag keys.
 *
 * For a list of S3 resources that support tagging, see Managing tags for Amazon S3 resources.
 *
 * ### Permissions
 *
 * For tables and table buckets, you must have the `s3tables:UntagResource` permission to use this operation.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the namespaces within a table bucket. For more information, see Table namespaces in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:ListNamespaces` permission to use this operation.
 */
export const listNamespaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListNamespacesRequest,
    output: ListNamespacesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "continuationToken",
      outputToken: "continuationToken",
      items: "namespaces",
      pageSize: "maxNamespaces",
    } as const,
  }),
);
/**
 * Creates a table bucket. For more information, see Creating a table bucket in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * - You must have the `s3tables:CreateTableBucket` permission to use this operation.
 *
 * - If you use this operation with the optional `encryptionConfiguration` parameter you must have the `s3tables:PutTableBucketEncryption` permission.
 *
 * - If you use this operation with the `storageClassConfiguration` request parameter, you must have the `s3tables:PutTableBucketStorageClass` permission.
 *
 * - To create a table bucket with tags, you must have the `s3tables:TagResource` permission in addition to `s3tables:CreateTableBucket` permission.
 */
export const createTableBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTableBucketRequest,
  output: CreateTableBucketResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets details about a maintenance configuration for a given table bucket. For more information, see Amazon S3 table bucket maintenance in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucketMaintenanceConfiguration` permission to use this operation.
 */
export const getTableBucketMaintenanceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTableBucketMaintenanceConfigurationRequest,
    output: GetTableBucketMaintenanceConfigurationResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Creates or updates the replication configuration for a table bucket. This operation defines how tables in the source bucket are replicated to destination buckets. Replication helps ensure data availability and disaster recovery across regions or accounts.
 *
 * ### Permissions
 *
 * - You must have the `s3tables:PutTableBucketReplication` permission to use this operation. The IAM role specified in the configuration must have permissions to read from the source bucket and write permissions to all destination buckets.
 *
 * - You must also have the following permissions:
 *
 * - `s3tables:GetTable` permission on the source table.
 *
 * - `s3tables:ListTables` permission on the bucket containing the table.
 *
 * - `s3tables:CreateTable` permission for the destination.
 *
 * - `s3tables:CreateNamespace` permission for the destination.
 *
 * - `s3tables:GetTableMaintenanceConfig` permission for the source bucket.
 *
 * - `s3tables:PutTableMaintenanceConfig` permission for the destination bucket.
 *
 * - You must have `iam:PassRole` permission with condition allowing roles to be passed to `replication.s3tables.amazonaws.com`.
 */
export const putTableBucketReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutTableBucketReplicationRequest,
    output: PutTableBucketReplicationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates or updates the expiration configuration settings for records in a table, including the status of the configuration. If you enable record expiration for a table, records expire and are automatically removed from the table after the number of days that you specify.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTableRecordExpirationConfiguration` permission to use this operation.
 */
export const putTableRecordExpirationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutTableRecordExpirationConfigurationRequest,
    output: PutTableRecordExpirationConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves the expiration configuration settings for records in a table, and the status of the configuration. If the status of the configuration is `enabled`, records expire and are automatically removed from the table after the specified number of days.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableRecordExpirationConfiguration` permission to use this operation.
 */
export const getTableRecordExpirationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTableRecordExpirationConfigurationRequest,
    output: GetTableRecordExpirationConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
