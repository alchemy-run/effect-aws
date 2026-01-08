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
  sdkId: "S3Tables",
  serviceShapeName: "S3TableBuckets",
});
const auth = T.AwsAuthSigv4({ name: "s3tables" });
const ver = T.ServiceVersion("2018-05-10");
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
              `https://s3tables-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://s3tables-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://s3tables.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://s3tables.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceArn = string;
export type TagKey = string;
export type TableBucketARN = string;
export type NamespaceName = string;
export type NextToken = string;
export type ListNamespacesLimit = number;
export type ResourcePolicy = string;
export type VersionToken = string;
export type TableBucketName = string;
export type ListTableBucketsLimit = number;
export type TableName = string;
export type TableARN = string;
export type ListTablesLimit = number;
export type MetadataLocation = string;
export type TagValue = string;
export type IAMRole = string;
export type ErrorMessage = string;
export type AccountId = string;
export type NamespaceId = string;
export type TableBucketId = string;
export type WarehouseLocation = string;
export type PositiveInteger = number;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type NamespaceList = string[];
export const NamespaceList = S.Array(S.String);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tag/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tag/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface CreateNamespaceRequest {
  tableBucketARN: string;
  namespace: NamespaceList;
}
export const CreateNamespaceRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: NamespaceList,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/namespaces/{tableBucketARN}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNamespaceRequest",
}) as any as S.Schema<CreateNamespaceRequest>;
export interface DeleteNamespaceRequest {
  tableBucketARN: string;
  namespace: string;
}
export const DeleteNamespaceRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteNamespaceRequest",
}) as any as S.Schema<DeleteNamespaceRequest>;
export interface DeleteNamespaceResponse {}
export const DeleteNamespaceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteNamespaceResponse",
}) as any as S.Schema<DeleteNamespaceResponse>;
export interface GetNamespaceRequest {
  tableBucketARN: string;
  namespace: string;
}
export const GetNamespaceRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/namespaces/{tableBucketARN}/{namespace}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetNamespaceRequest",
}) as any as S.Schema<GetNamespaceRequest>;
export interface ListNamespacesRequest {
  tableBucketARN: string;
  prefix?: string;
  continuationToken?: string;
  maxNamespaces?: number;
}
export const ListNamespacesRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    continuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuationToken"),
    ),
    maxNamespaces: S.optional(S.Number).pipe(T.HttpQuery("maxNamespaces")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/namespaces/{tableBucketARN}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNamespacesRequest",
}) as any as S.Schema<ListNamespacesRequest>;
export interface DeleteTableBucketEncryptionRequest {
  tableBucketARN: string;
}
export const DeleteTableBucketEncryptionRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/buckets/{tableBucketARN}/encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTableBucketEncryptionRequest",
}) as any as S.Schema<DeleteTableBucketEncryptionRequest>;
export interface DeleteTableBucketEncryptionResponse {}
export const DeleteTableBucketEncryptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTableBucketEncryptionResponse",
}) as any as S.Schema<DeleteTableBucketEncryptionResponse>;
export interface GetTableBucketEncryptionRequest {
  tableBucketARN: string;
}
export const GetTableBucketEncryptionRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableBucketEncryptionRequest",
}) as any as S.Schema<GetTableBucketEncryptionRequest>;
export interface DeleteTableBucketPolicyRequest {
  tableBucketARN: string;
}
export const DeleteTableBucketPolicyRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/buckets/{tableBucketARN}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTableBucketPolicyRequest",
}) as any as S.Schema<DeleteTableBucketPolicyRequest>;
export interface DeleteTableBucketPolicyResponse {}
export const DeleteTableBucketPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTableBucketPolicyResponse",
}) as any as S.Schema<DeleteTableBucketPolicyResponse>;
export interface GetTableBucketPolicyRequest {
  tableBucketARN: string;
}
export const GetTableBucketPolicyRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableBucketPolicyRequest",
}) as any as S.Schema<GetTableBucketPolicyRequest>;
export interface PutTableBucketPolicyRequest {
  tableBucketARN: string;
  resourcePolicy: string;
}
export const PutTableBucketPolicyRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    resourcePolicy: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/buckets/{tableBucketARN}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTableBucketPolicyRequest",
}) as any as S.Schema<PutTableBucketPolicyRequest>;
export interface PutTableBucketPolicyResponse {}
export const PutTableBucketPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutTableBucketPolicyResponse",
}) as any as S.Schema<PutTableBucketPolicyResponse>;
export interface DeleteTableBucketReplicationRequest {
  tableBucketARN: string;
  versionToken?: string;
}
export const DeleteTableBucketReplicationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpQuery("tableBucketARN")),
    versionToken: S.optional(S.String).pipe(T.HttpQuery("versionToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/table-bucket-replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTableBucketReplicationRequest",
}) as any as S.Schema<DeleteTableBucketReplicationRequest>;
export interface DeleteTableBucketReplicationResponse {}
export const DeleteTableBucketReplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTableBucketReplicationResponse",
}) as any as S.Schema<DeleteTableBucketReplicationResponse>;
export interface GetTableBucketReplicationRequest {
  tableBucketARN: string;
}
export const GetTableBucketReplicationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpQuery("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/table-bucket-replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableBucketReplicationRequest",
}) as any as S.Schema<GetTableBucketReplicationRequest>;
export interface DeleteTableBucketRequest {
  tableBucketARN: string;
}
export const DeleteTableBucketRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/buckets/{tableBucketARN}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTableBucketRequest",
}) as any as S.Schema<DeleteTableBucketRequest>;
export interface DeleteTableBucketResponse {}
export const DeleteTableBucketResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTableBucketResponse",
}) as any as S.Schema<DeleteTableBucketResponse>;
export interface DeleteTableBucketMetricsConfigurationRequest {
  tableBucketARN: string;
}
export const DeleteTableBucketMetricsConfigurationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/buckets/{tableBucketARN}/metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTableBucketMetricsConfigurationRequest",
}) as any as S.Schema<DeleteTableBucketMetricsConfigurationRequest>;
export interface DeleteTableBucketMetricsConfigurationResponse {}
export const DeleteTableBucketMetricsConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTableBucketMetricsConfigurationResponse",
}) as any as S.Schema<DeleteTableBucketMetricsConfigurationResponse>;
export interface GetTableBucketRequest {
  tableBucketARN: string;
}
export const GetTableBucketRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableBucketRequest",
}) as any as S.Schema<GetTableBucketRequest>;
export interface GetTableBucketMaintenanceConfigurationRequest {
  tableBucketARN: string;
}
export const GetTableBucketMaintenanceConfigurationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/maintenance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableBucketMaintenanceConfigurationRequest",
}) as any as S.Schema<GetTableBucketMaintenanceConfigurationRequest>;
export interface GetTableBucketMetricsConfigurationRequest {
  tableBucketARN: string;
}
export const GetTableBucketMetricsConfigurationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableBucketMetricsConfigurationRequest",
}) as any as S.Schema<GetTableBucketMetricsConfigurationRequest>;
export interface GetTableBucketStorageClassRequest {
  tableBucketARN: string;
}
export const GetTableBucketStorageClassRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/buckets/{tableBucketARN}/storage-class" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableBucketStorageClassRequest",
}) as any as S.Schema<GetTableBucketStorageClassRequest>;
export interface ListTableBucketsRequest {
  prefix?: string;
  continuationToken?: string;
  maxBuckets?: number;
  type?: string;
}
export const ListTableBucketsRequest = S.suspend(() =>
  S.Struct({
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    continuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuationToken"),
    ),
    maxBuckets: S.optional(S.Number).pipe(T.HttpQuery("maxBuckets")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/buckets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTableBucketsRequest",
}) as any as S.Schema<ListTableBucketsRequest>;
export interface PutTableBucketMetricsConfigurationRequest {
  tableBucketARN: string;
}
export const PutTableBucketMetricsConfigurationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/buckets/{tableBucketARN}/metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTableBucketMetricsConfigurationRequest",
}) as any as S.Schema<PutTableBucketMetricsConfigurationRequest>;
export interface PutTableBucketMetricsConfigurationResponse {}
export const PutTableBucketMetricsConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutTableBucketMetricsConfigurationResponse",
}) as any as S.Schema<PutTableBucketMetricsConfigurationResponse>;
export interface StorageClassConfiguration {
  storageClass: string;
}
export const StorageClassConfiguration = S.suspend(() =>
  S.Struct({ storageClass: S.String }),
).annotations({
  identifier: "StorageClassConfiguration",
}) as any as S.Schema<StorageClassConfiguration>;
export interface PutTableBucketStorageClassRequest {
  tableBucketARN: string;
  storageClassConfiguration: StorageClassConfiguration;
}
export const PutTableBucketStorageClassRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    storageClassConfiguration: StorageClassConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/buckets/{tableBucketARN}/storage-class" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTableBucketStorageClassRequest",
}) as any as S.Schema<PutTableBucketStorageClassRequest>;
export interface PutTableBucketStorageClassResponse {}
export const PutTableBucketStorageClassResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutTableBucketStorageClassResponse",
}) as any as S.Schema<PutTableBucketStorageClassResponse>;
export interface GetTableEncryptionRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
}
export const GetTableEncryptionRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTableEncryptionRequest",
}) as any as S.Schema<GetTableEncryptionRequest>;
export interface DeleteTablePolicyRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
}
export const DeleteTablePolicyRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteTablePolicyRequest",
}) as any as S.Schema<DeleteTablePolicyRequest>;
export interface DeleteTablePolicyResponse {}
export const DeleteTablePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTablePolicyResponse",
}) as any as S.Schema<DeleteTablePolicyResponse>;
export interface GetTablePolicyRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
}
export const GetTablePolicyRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTablePolicyRequest",
}) as any as S.Schema<GetTablePolicyRequest>;
export interface PutTablePolicyRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
  resourcePolicy: string;
}
export const PutTablePolicyRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    resourcePolicy: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutTablePolicyRequest",
}) as any as S.Schema<PutTablePolicyRequest>;
export interface PutTablePolicyResponse {}
export const PutTablePolicyResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "PutTablePolicyResponse" },
) as any as S.Schema<PutTablePolicyResponse>;
export interface DeleteTableReplicationRequest {
  tableArn: string;
  versionToken: string;
}
export const DeleteTableReplicationRequest = S.suspend(() =>
  S.Struct({
    tableArn: S.String.pipe(T.HttpQuery("tableArn")),
    versionToken: S.String.pipe(T.HttpQuery("versionToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/table-replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTableReplicationRequest",
}) as any as S.Schema<DeleteTableReplicationRequest>;
export interface DeleteTableReplicationResponse {}
export const DeleteTableReplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTableReplicationResponse",
}) as any as S.Schema<DeleteTableReplicationResponse>;
export interface GetTableReplicationRequest {
  tableArn: string;
}
export const GetTableReplicationRequest = S.suspend(() =>
  S.Struct({ tableArn: S.String.pipe(T.HttpQuery("tableArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/table-replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableReplicationRequest",
}) as any as S.Schema<GetTableReplicationRequest>;
export interface GetTableReplicationStatusRequest {
  tableArn: string;
}
export const GetTableReplicationStatusRequest = S.suspend(() =>
  S.Struct({ tableArn: S.String.pipe(T.HttpQuery("tableArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/replication-status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableReplicationStatusRequest",
}) as any as S.Schema<GetTableReplicationStatusRequest>;
export interface DeleteTableRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
  versionToken?: string;
}
export const DeleteTableRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    versionToken: S.optional(S.String).pipe(T.HttpQuery("versionToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteTableRequest",
}) as any as S.Schema<DeleteTableRequest>;
export interface DeleteTableResponse {}
export const DeleteTableResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTableResponse",
}) as any as S.Schema<DeleteTableResponse>;
export interface GetTableRequest {
  tableBucketARN?: string;
  namespace?: string;
  name?: string;
  tableArn?: string;
}
export const GetTableRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.optional(S.String).pipe(T.HttpQuery("tableBucketARN")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    tableArn: S.optional(S.String).pipe(T.HttpQuery("tableArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/get-table" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableRequest",
}) as any as S.Schema<GetTableRequest>;
export interface GetTableMaintenanceConfigurationRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
}
export const GetTableMaintenanceConfigurationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTableMaintenanceConfigurationRequest",
}) as any as S.Schema<GetTableMaintenanceConfigurationRequest>;
export interface GetTableMaintenanceJobStatusRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
}
export const GetTableMaintenanceJobStatusRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTableMaintenanceJobStatusRequest",
}) as any as S.Schema<GetTableMaintenanceJobStatusRequest>;
export interface GetTableMetadataLocationRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
}
export const GetTableMetadataLocationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTableMetadataLocationRequest",
}) as any as S.Schema<GetTableMetadataLocationRequest>;
export interface GetTableRecordExpirationConfigurationRequest {
  tableArn: string;
}
export const GetTableRecordExpirationConfigurationRequest = S.suspend(() =>
  S.Struct({ tableArn: S.String.pipe(T.HttpQuery("tableArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/table-record-expiration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableRecordExpirationConfigurationRequest",
}) as any as S.Schema<GetTableRecordExpirationConfigurationRequest>;
export interface GetTableRecordExpirationJobStatusRequest {
  tableArn: string;
}
export const GetTableRecordExpirationJobStatusRequest = S.suspend(() =>
  S.Struct({ tableArn: S.String.pipe(T.HttpQuery("tableArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/table-record-expiration-job-status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableRecordExpirationJobStatusRequest",
}) as any as S.Schema<GetTableRecordExpirationJobStatusRequest>;
export interface GetTableStorageClassRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
}
export const GetTableStorageClassRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTableStorageClassRequest",
}) as any as S.Schema<GetTableStorageClassRequest>;
export interface ListTablesRequest {
  tableBucketARN: string;
  namespace?: string;
  prefix?: string;
  continuationToken?: string;
  maxTables?: number;
}
export const ListTablesRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    continuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuationToken"),
    ),
    maxTables: S.optional(S.Number).pipe(T.HttpQuery("maxTables")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tables/{tableBucketARN}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTablesRequest",
}) as any as S.Schema<ListTablesRequest>;
export interface RenameTableRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
  newNamespaceName?: string;
  newName?: string;
  versionToken?: string;
}
export const RenameTableRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    newNamespaceName: S.optional(S.String),
    newName: S.optional(S.String),
    versionToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "RenameTableRequest",
}) as any as S.Schema<RenameTableRequest>;
export interface RenameTableResponse {}
export const RenameTableResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "RenameTableResponse",
}) as any as S.Schema<RenameTableResponse>;
export interface UpdateTableMetadataLocationRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
  versionToken: string;
  metadataLocation: string;
}
export const UpdateTableMetadataLocationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    versionToken: S.String,
    metadataLocation: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateTableMetadataLocationRequest",
}) as any as S.Schema<UpdateTableMetadataLocationRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface EncryptionConfiguration {
  sseAlgorithm: string;
  kmsKeyArn?: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ sseAlgorithm: S.String, kmsKeyArn: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tag/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateNamespaceResponse {
  tableBucketARN: string;
  namespace: NamespaceList;
}
export const CreateNamespaceResponse = S.suspend(() =>
  S.Struct({ tableBucketARN: S.String, namespace: NamespaceList }),
).annotations({
  identifier: "CreateNamespaceResponse",
}) as any as S.Schema<CreateNamespaceResponse>;
export interface GetNamespaceResponse {
  namespace: NamespaceList;
  createdAt: Date;
  createdBy: string;
  ownerAccountId: string;
  namespaceId?: string;
  tableBucketId?: string;
}
export const GetNamespaceResponse = S.suspend(() =>
  S.Struct({
    namespace: NamespaceList,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    ownerAccountId: S.String,
    namespaceId: S.optional(S.String),
    tableBucketId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetNamespaceResponse",
}) as any as S.Schema<GetNamespaceResponse>;
export interface GetTableBucketEncryptionResponse {
  encryptionConfiguration: EncryptionConfiguration;
}
export const GetTableBucketEncryptionResponse = S.suspend(() =>
  S.Struct({ encryptionConfiguration: EncryptionConfiguration }),
).annotations({
  identifier: "GetTableBucketEncryptionResponse",
}) as any as S.Schema<GetTableBucketEncryptionResponse>;
export interface PutTableBucketEncryptionRequest {
  tableBucketARN: string;
  encryptionConfiguration: EncryptionConfiguration;
}
export const PutTableBucketEncryptionRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    encryptionConfiguration: EncryptionConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/buckets/{tableBucketARN}/encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTableBucketEncryptionRequest",
}) as any as S.Schema<PutTableBucketEncryptionRequest>;
export interface PutTableBucketEncryptionResponse {}
export const PutTableBucketEncryptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutTableBucketEncryptionResponse",
}) as any as S.Schema<PutTableBucketEncryptionResponse>;
export interface GetTableBucketPolicyResponse {
  resourcePolicy: string;
}
export const GetTableBucketPolicyResponse = S.suspend(() =>
  S.Struct({ resourcePolicy: S.String }),
).annotations({
  identifier: "GetTableBucketPolicyResponse",
}) as any as S.Schema<GetTableBucketPolicyResponse>;
export interface ReplicationDestination {
  destinationTableBucketARN: string;
}
export const ReplicationDestination = S.suspend(() =>
  S.Struct({ destinationTableBucketARN: S.String }),
).annotations({
  identifier: "ReplicationDestination",
}) as any as S.Schema<ReplicationDestination>;
export type ReplicationDestinations = ReplicationDestination[];
export const ReplicationDestinations = S.Array(ReplicationDestination);
export interface TableBucketReplicationRule {
  destinations: ReplicationDestinations;
}
export const TableBucketReplicationRule = S.suspend(() =>
  S.Struct({ destinations: ReplicationDestinations }),
).annotations({
  identifier: "TableBucketReplicationRule",
}) as any as S.Schema<TableBucketReplicationRule>;
export type TableBucketReplicationRules = TableBucketReplicationRule[];
export const TableBucketReplicationRules = S.Array(TableBucketReplicationRule);
export interface TableBucketReplicationConfiguration {
  role: string;
  rules: TableBucketReplicationRules;
}
export const TableBucketReplicationConfiguration = S.suspend(() =>
  S.Struct({ role: S.String, rules: TableBucketReplicationRules }),
).annotations({
  identifier: "TableBucketReplicationConfiguration",
}) as any as S.Schema<TableBucketReplicationConfiguration>;
export interface GetTableBucketReplicationResponse {
  versionToken: string;
  configuration: TableBucketReplicationConfiguration;
}
export const GetTableBucketReplicationResponse = S.suspend(() =>
  S.Struct({
    versionToken: S.String,
    configuration: TableBucketReplicationConfiguration,
  }),
).annotations({
  identifier: "GetTableBucketReplicationResponse",
}) as any as S.Schema<GetTableBucketReplicationResponse>;
export interface CreateTableBucketRequest {
  name: string;
  encryptionConfiguration?: EncryptionConfiguration;
  storageClassConfiguration?: StorageClassConfiguration;
  tags?: Tags;
}
export const CreateTableBucketRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    storageClassConfiguration: S.optional(StorageClassConfiguration),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/buckets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTableBucketRequest",
}) as any as S.Schema<CreateTableBucketRequest>;
export interface GetTableBucketResponse {
  arn: string;
  name: string;
  ownerAccountId: string;
  createdAt: Date;
  tableBucketId?: string;
  type?: string;
}
export const GetTableBucketResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    ownerAccountId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    tableBucketId: S.optional(S.String),
    type: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTableBucketResponse",
}) as any as S.Schema<GetTableBucketResponse>;
export interface GetTableBucketMetricsConfigurationResponse {
  tableBucketARN: string;
  id?: string;
}
export const GetTableBucketMetricsConfigurationResponse = S.suspend(() =>
  S.Struct({ tableBucketARN: S.String, id: S.optional(S.String) }),
).annotations({
  identifier: "GetTableBucketMetricsConfigurationResponse",
}) as any as S.Schema<GetTableBucketMetricsConfigurationResponse>;
export interface GetTableBucketStorageClassResponse {
  storageClassConfiguration: StorageClassConfiguration;
}
export const GetTableBucketStorageClassResponse = S.suspend(() =>
  S.Struct({ storageClassConfiguration: StorageClassConfiguration }),
).annotations({
  identifier: "GetTableBucketStorageClassResponse",
}) as any as S.Schema<GetTableBucketStorageClassResponse>;
export interface GetTableEncryptionResponse {
  encryptionConfiguration: EncryptionConfiguration;
}
export const GetTableEncryptionResponse = S.suspend(() =>
  S.Struct({ encryptionConfiguration: EncryptionConfiguration }),
).annotations({
  identifier: "GetTableEncryptionResponse",
}) as any as S.Schema<GetTableEncryptionResponse>;
export interface GetTablePolicyResponse {
  resourcePolicy: string;
}
export const GetTablePolicyResponse = S.suspend(() =>
  S.Struct({ resourcePolicy: S.String }),
).annotations({
  identifier: "GetTablePolicyResponse",
}) as any as S.Schema<GetTablePolicyResponse>;
export interface TableReplicationRule {
  destinations: ReplicationDestinations;
}
export const TableReplicationRule = S.suspend(() =>
  S.Struct({ destinations: ReplicationDestinations }),
).annotations({
  identifier: "TableReplicationRule",
}) as any as S.Schema<TableReplicationRule>;
export type TableReplicationRules = TableReplicationRule[];
export const TableReplicationRules = S.Array(TableReplicationRule);
export interface TableReplicationConfiguration {
  role: string;
  rules: TableReplicationRules;
}
export const TableReplicationConfiguration = S.suspend(() =>
  S.Struct({ role: S.String, rules: TableReplicationRules }),
).annotations({
  identifier: "TableReplicationConfiguration",
}) as any as S.Schema<TableReplicationConfiguration>;
export interface GetTableReplicationResponse {
  versionToken: string;
  configuration: TableReplicationConfiguration;
}
export const GetTableReplicationResponse = S.suspend(() =>
  S.Struct({
    versionToken: S.String,
    configuration: TableReplicationConfiguration,
  }),
).annotations({
  identifier: "GetTableReplicationResponse",
}) as any as S.Schema<GetTableReplicationResponse>;
export interface GetTableMetadataLocationResponse {
  versionToken: string;
  metadataLocation?: string;
  warehouseLocation: string;
}
export const GetTableMetadataLocationResponse = S.suspend(() =>
  S.Struct({
    versionToken: S.String,
    metadataLocation: S.optional(S.String),
    warehouseLocation: S.String,
  }),
).annotations({
  identifier: "GetTableMetadataLocationResponse",
}) as any as S.Schema<GetTableMetadataLocationResponse>;
export interface TableRecordExpirationSettings {
  days?: number;
}
export const TableRecordExpirationSettings = S.suspend(() =>
  S.Struct({ days: S.optional(S.Number) }),
).annotations({
  identifier: "TableRecordExpirationSettings",
}) as any as S.Schema<TableRecordExpirationSettings>;
export interface TableRecordExpirationConfigurationValue {
  status?: string;
  settings?: TableRecordExpirationSettings;
}
export const TableRecordExpirationConfigurationValue = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    settings: S.optional(TableRecordExpirationSettings),
  }),
).annotations({
  identifier: "TableRecordExpirationConfigurationValue",
}) as any as S.Schema<TableRecordExpirationConfigurationValue>;
export interface GetTableRecordExpirationConfigurationResponse {
  configuration: TableRecordExpirationConfigurationValue;
}
export const GetTableRecordExpirationConfigurationResponse = S.suspend(() =>
  S.Struct({ configuration: TableRecordExpirationConfigurationValue }),
).annotations({
  identifier: "GetTableRecordExpirationConfigurationResponse",
}) as any as S.Schema<GetTableRecordExpirationConfigurationResponse>;
export interface GetTableStorageClassResponse {
  storageClassConfiguration: StorageClassConfiguration;
}
export const GetTableStorageClassResponse = S.suspend(() =>
  S.Struct({ storageClassConfiguration: StorageClassConfiguration }),
).annotations({
  identifier: "GetTableStorageClassResponse",
}) as any as S.Schema<GetTableStorageClassResponse>;
export interface UpdateTableMetadataLocationResponse {
  name: string;
  tableARN: string;
  namespace: NamespaceList;
  versionToken: string;
  metadataLocation: string;
}
export const UpdateTableMetadataLocationResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    tableARN: S.String,
    namespace: NamespaceList,
    versionToken: S.String,
    metadataLocation: S.String,
  }),
).annotations({
  identifier: "UpdateTableMetadataLocationResponse",
}) as any as S.Schema<UpdateTableMetadataLocationResponse>;
export interface NamespaceSummary {
  namespace: NamespaceList;
  createdAt: Date;
  createdBy: string;
  ownerAccountId: string;
  namespaceId?: string;
  tableBucketId?: string;
}
export const NamespaceSummary = S.suspend(() =>
  S.Struct({
    namespace: NamespaceList,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    ownerAccountId: S.String,
    namespaceId: S.optional(S.String),
    tableBucketId: S.optional(S.String),
  }),
).annotations({
  identifier: "NamespaceSummary",
}) as any as S.Schema<NamespaceSummary>;
export type NamespaceSummaryList = NamespaceSummary[];
export const NamespaceSummaryList = S.Array(NamespaceSummary);
export interface IcebergUnreferencedFileRemovalSettings {
  unreferencedDays?: number;
  nonCurrentDays?: number;
}
export const IcebergUnreferencedFileRemovalSettings = S.suspend(() =>
  S.Struct({
    unreferencedDays: S.optional(S.Number),
    nonCurrentDays: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergUnreferencedFileRemovalSettings",
}) as any as S.Schema<IcebergUnreferencedFileRemovalSettings>;
export type TableBucketMaintenanceSettings = {
  icebergUnreferencedFileRemoval: IcebergUnreferencedFileRemovalSettings;
};
export const TableBucketMaintenanceSettings = S.Union(
  S.Struct({
    icebergUnreferencedFileRemoval: IcebergUnreferencedFileRemovalSettings,
  }),
);
export interface TableBucketMaintenanceConfigurationValue {
  status?: string;
  settings?: (typeof TableBucketMaintenanceSettings)["Type"];
}
export const TableBucketMaintenanceConfigurationValue = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    settings: S.optional(TableBucketMaintenanceSettings),
  }),
).annotations({
  identifier: "TableBucketMaintenanceConfigurationValue",
}) as any as S.Schema<TableBucketMaintenanceConfigurationValue>;
export type TableBucketMaintenanceConfiguration = {
  [key: string]: TableBucketMaintenanceConfigurationValue;
};
export const TableBucketMaintenanceConfiguration = S.Record({
  key: S.String,
  value: TableBucketMaintenanceConfigurationValue,
});
export interface TableBucketSummary {
  arn: string;
  name: string;
  ownerAccountId: string;
  createdAt: Date;
  tableBucketId?: string;
  type?: string;
}
export const TableBucketSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    ownerAccountId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    tableBucketId: S.optional(S.String),
    type: S.optional(S.String),
  }),
).annotations({
  identifier: "TableBucketSummary",
}) as any as S.Schema<TableBucketSummary>;
export type TableBucketSummaryList = TableBucketSummary[];
export const TableBucketSummaryList = S.Array(TableBucketSummary);
export interface IcebergCompactionSettings {
  targetFileSizeMB?: number;
  strategy?: string;
}
export const IcebergCompactionSettings = S.suspend(() =>
  S.Struct({
    targetFileSizeMB: S.optional(S.Number),
    strategy: S.optional(S.String),
  }),
).annotations({
  identifier: "IcebergCompactionSettings",
}) as any as S.Schema<IcebergCompactionSettings>;
export interface IcebergSnapshotManagementSettings {
  minSnapshotsToKeep?: number;
  maxSnapshotAgeHours?: number;
}
export const IcebergSnapshotManagementSettings = S.suspend(() =>
  S.Struct({
    minSnapshotsToKeep: S.optional(S.Number),
    maxSnapshotAgeHours: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergSnapshotManagementSettings",
}) as any as S.Schema<IcebergSnapshotManagementSettings>;
export type TableMaintenanceSettings =
  | { icebergCompaction: IcebergCompactionSettings }
  | { icebergSnapshotManagement: IcebergSnapshotManagementSettings };
export const TableMaintenanceSettings = S.Union(
  S.Struct({ icebergCompaction: IcebergCompactionSettings }),
  S.Struct({ icebergSnapshotManagement: IcebergSnapshotManagementSettings }),
);
export interface TableMaintenanceConfigurationValue {
  status?: string;
  settings?: (typeof TableMaintenanceSettings)["Type"];
}
export const TableMaintenanceConfigurationValue = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    settings: S.optional(TableMaintenanceSettings),
  }),
).annotations({
  identifier: "TableMaintenanceConfigurationValue",
}) as any as S.Schema<TableMaintenanceConfigurationValue>;
export type TableMaintenanceConfiguration = {
  [key: string]: TableMaintenanceConfigurationValue;
};
export const TableMaintenanceConfiguration = S.Record({
  key: S.String,
  value: TableMaintenanceConfigurationValue,
});
export interface TableRecordExpirationJobMetrics {
  deletedDataFiles?: number;
  deletedRecords?: number;
  removedFilesSize?: number;
}
export const TableRecordExpirationJobMetrics = S.suspend(() =>
  S.Struct({
    deletedDataFiles: S.optional(S.Number),
    deletedRecords: S.optional(S.Number),
    removedFilesSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "TableRecordExpirationJobMetrics",
}) as any as S.Schema<TableRecordExpirationJobMetrics>;
export interface TableSummary {
  namespace: NamespaceList;
  name: string;
  type: string;
  tableARN: string;
  createdAt: Date;
  modifiedAt: Date;
  managedByService?: string;
  namespaceId?: string;
  tableBucketId?: string;
}
export const TableSummary = S.suspend(() =>
  S.Struct({
    namespace: NamespaceList,
    name: S.String,
    type: S.String,
    tableARN: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    managedByService: S.optional(S.String),
    namespaceId: S.optional(S.String),
    tableBucketId: S.optional(S.String),
  }),
).annotations({ identifier: "TableSummary" }) as any as S.Schema<TableSummary>;
export type TableSummaryList = TableSummary[];
export const TableSummaryList = S.Array(TableSummary);
export type TableProperties = { [key: string]: string };
export const TableProperties = S.Record({ key: S.String, value: S.String });
export interface ListNamespacesResponse {
  namespaces: NamespaceSummaryList;
  continuationToken?: string;
}
export const ListNamespacesResponse = S.suspend(() =>
  S.Struct({
    namespaces: NamespaceSummaryList,
    continuationToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNamespacesResponse",
}) as any as S.Schema<ListNamespacesResponse>;
export interface CreateTableBucketResponse {
  arn: string;
}
export const CreateTableBucketResponse = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "CreateTableBucketResponse",
}) as any as S.Schema<CreateTableBucketResponse>;
export interface GetTableBucketMaintenanceConfigurationResponse {
  tableBucketARN: string;
  configuration: TableBucketMaintenanceConfiguration;
}
export const GetTableBucketMaintenanceConfigurationResponse = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String,
    configuration: TableBucketMaintenanceConfiguration,
  }),
).annotations({
  identifier: "GetTableBucketMaintenanceConfigurationResponse",
}) as any as S.Schema<GetTableBucketMaintenanceConfigurationResponse>;
export interface ListTableBucketsResponse {
  tableBuckets: TableBucketSummaryList;
  continuationToken?: string;
}
export const ListTableBucketsResponse = S.suspend(() =>
  S.Struct({
    tableBuckets: TableBucketSummaryList,
    continuationToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTableBucketsResponse",
}) as any as S.Schema<ListTableBucketsResponse>;
export interface PutTableReplicationRequest {
  tableArn: string;
  versionToken?: string;
  configuration: TableReplicationConfiguration;
}
export const PutTableReplicationRequest = S.suspend(() =>
  S.Struct({
    tableArn: S.String.pipe(T.HttpQuery("tableArn")),
    versionToken: S.optional(S.String).pipe(T.HttpQuery("versionToken")),
    configuration: TableReplicationConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/table-replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTableReplicationRequest",
}) as any as S.Schema<PutTableReplicationRequest>;
export interface GetTableMaintenanceConfigurationResponse {
  tableARN: string;
  configuration: TableMaintenanceConfiguration;
}
export const GetTableMaintenanceConfigurationResponse = S.suspend(() =>
  S.Struct({
    tableARN: S.String,
    configuration: TableMaintenanceConfiguration,
  }),
).annotations({
  identifier: "GetTableMaintenanceConfigurationResponse",
}) as any as S.Schema<GetTableMaintenanceConfigurationResponse>;
export interface GetTableRecordExpirationJobStatusResponse {
  status: string;
  lastRunTimestamp?: Date;
  failureMessage?: string;
  metrics?: TableRecordExpirationJobMetrics;
}
export const GetTableRecordExpirationJobStatusResponse = S.suspend(() =>
  S.Struct({
    status: S.String,
    lastRunTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    failureMessage: S.optional(S.String),
    metrics: S.optional(TableRecordExpirationJobMetrics),
  }),
).annotations({
  identifier: "GetTableRecordExpirationJobStatusResponse",
}) as any as S.Schema<GetTableRecordExpirationJobStatusResponse>;
export interface ListTablesResponse {
  tables: TableSummaryList;
  continuationToken?: string;
}
export const ListTablesResponse = S.suspend(() =>
  S.Struct({
    tables: TableSummaryList,
    continuationToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTablesResponse",
}) as any as S.Schema<ListTablesResponse>;
export interface PutTableRecordExpirationConfigurationRequest {
  tableArn: string;
  value: TableRecordExpirationConfigurationValue;
}
export const PutTableRecordExpirationConfigurationRequest = S.suspend(() =>
  S.Struct({
    tableArn: S.String.pipe(T.HttpQuery("tableArn")),
    value: TableRecordExpirationConfigurationValue,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/table-record-expiration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTableRecordExpirationConfigurationRequest",
}) as any as S.Schema<PutTableRecordExpirationConfigurationRequest>;
export interface PutTableRecordExpirationConfigurationResponse {}
export const PutTableRecordExpirationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutTableRecordExpirationConfigurationResponse",
}) as any as S.Schema<PutTableRecordExpirationConfigurationResponse>;
export interface LastSuccessfulReplicatedUpdate {
  metadataLocation: string;
  timestamp: Date;
}
export const LastSuccessfulReplicatedUpdate = S.suspend(() =>
  S.Struct({
    metadataLocation: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "LastSuccessfulReplicatedUpdate",
}) as any as S.Schema<LastSuccessfulReplicatedUpdate>;
export interface ReplicationInformation {
  sourceTableARN: string;
}
export const ReplicationInformation = S.suspend(() =>
  S.Struct({ sourceTableARN: S.String }),
).annotations({
  identifier: "ReplicationInformation",
}) as any as S.Schema<ReplicationInformation>;
export interface TableMaintenanceJobStatusValue {
  status: string;
  lastRunTimestamp?: Date;
  failureMessage?: string;
}
export const TableMaintenanceJobStatusValue = S.suspend(() =>
  S.Struct({
    status: S.String,
    lastRunTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    failureMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "TableMaintenanceJobStatusValue",
}) as any as S.Schema<TableMaintenanceJobStatusValue>;
export interface SchemaField {
  name: string;
  type: string;
  required?: boolean;
}
export const SchemaField = S.suspend(() =>
  S.Struct({ name: S.String, type: S.String, required: S.optional(S.Boolean) }),
).annotations({ identifier: "SchemaField" }) as any as S.Schema<SchemaField>;
export type SchemaFieldList = SchemaField[];
export const SchemaFieldList = S.Array(SchemaField);
export interface ReplicationDestinationStatusModel {
  replicationStatus: string;
  destinationTableBucketArn: string;
  destinationTableArn?: string;
  lastSuccessfulReplicatedUpdate?: LastSuccessfulReplicatedUpdate;
  failureMessage?: string;
}
export const ReplicationDestinationStatusModel = S.suspend(() =>
  S.Struct({
    replicationStatus: S.String,
    destinationTableBucketArn: S.String,
    destinationTableArn: S.optional(S.String),
    lastSuccessfulReplicatedUpdate: S.optional(LastSuccessfulReplicatedUpdate),
    failureMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ReplicationDestinationStatusModel",
}) as any as S.Schema<ReplicationDestinationStatusModel>;
export type ReplicationDestinationStatuses =
  ReplicationDestinationStatusModel[];
export const ReplicationDestinationStatuses = S.Array(
  ReplicationDestinationStatusModel,
);
export interface ManagedTableInformation {
  replicationInformation?: ReplicationInformation;
}
export const ManagedTableInformation = S.suspend(() =>
  S.Struct({ replicationInformation: S.optional(ReplicationInformation) }),
).annotations({
  identifier: "ManagedTableInformation",
}) as any as S.Schema<ManagedTableInformation>;
export type TableMaintenanceJobStatus = {
  [key: string]: TableMaintenanceJobStatusValue;
};
export const TableMaintenanceJobStatus = S.Record({
  key: S.String,
  value: TableMaintenanceJobStatusValue,
});
export interface IcebergSchema {
  fields: SchemaFieldList;
}
export const IcebergSchema = S.suspend(() =>
  S.Struct({ fields: SchemaFieldList }),
).annotations({
  identifier: "IcebergSchema",
}) as any as S.Schema<IcebergSchema>;
export interface PutTableBucketReplicationRequest {
  tableBucketARN: string;
  versionToken?: string;
  configuration: TableBucketReplicationConfiguration;
}
export const PutTableBucketReplicationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpQuery("tableBucketARN")),
    versionToken: S.optional(S.String).pipe(T.HttpQuery("versionToken")),
    configuration: TableBucketReplicationConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/table-bucket-replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTableBucketReplicationRequest",
}) as any as S.Schema<PutTableBucketReplicationRequest>;
export interface PutTableBucketMaintenanceConfigurationRequest {
  tableBucketARN: string;
  type: string;
  value: TableBucketMaintenanceConfigurationValue;
}
export const PutTableBucketMaintenanceConfigurationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    type: S.String.pipe(T.HttpLabel("type")),
    value: TableBucketMaintenanceConfigurationValue,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutTableBucketMaintenanceConfigurationRequest",
}) as any as S.Schema<PutTableBucketMaintenanceConfigurationRequest>;
export interface PutTableBucketMaintenanceConfigurationResponse {}
export const PutTableBucketMaintenanceConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutTableBucketMaintenanceConfigurationResponse",
}) as any as S.Schema<PutTableBucketMaintenanceConfigurationResponse>;
export interface GetTableReplicationStatusResponse {
  sourceTableArn: string;
  destinations: ReplicationDestinationStatuses;
}
export const GetTableReplicationStatusResponse = S.suspend(() =>
  S.Struct({
    sourceTableArn: S.String,
    destinations: ReplicationDestinationStatuses,
  }),
).annotations({
  identifier: "GetTableReplicationStatusResponse",
}) as any as S.Schema<GetTableReplicationStatusResponse>;
export interface PutTableReplicationResponse {
  versionToken: string;
  status: string;
}
export const PutTableReplicationResponse = S.suspend(() =>
  S.Struct({ versionToken: S.String, status: S.String }),
).annotations({
  identifier: "PutTableReplicationResponse",
}) as any as S.Schema<PutTableReplicationResponse>;
export interface GetTableResponse {
  name: string;
  type: string;
  tableARN: string;
  namespace: NamespaceList;
  namespaceId?: string;
  versionToken: string;
  metadataLocation?: string;
  warehouseLocation: string;
  createdAt: Date;
  createdBy: string;
  managedByService?: string;
  modifiedAt: Date;
  modifiedBy: string;
  ownerAccountId: string;
  format: string;
  tableBucketId?: string;
  managedTableInformation?: ManagedTableInformation;
}
export const GetTableResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetTableResponse",
}) as any as S.Schema<GetTableResponse>;
export interface GetTableMaintenanceJobStatusResponse {
  tableARN: string;
  status: TableMaintenanceJobStatus;
}
export const GetTableMaintenanceJobStatusResponse = S.suspend(() =>
  S.Struct({ tableARN: S.String, status: TableMaintenanceJobStatus }),
).annotations({
  identifier: "GetTableMaintenanceJobStatusResponse",
}) as any as S.Schema<GetTableMaintenanceJobStatusResponse>;
export interface PutTableMaintenanceConfigurationRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
  type: string;
  value: TableMaintenanceConfigurationValue;
}
export const PutTableMaintenanceConfigurationRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    type: S.String.pipe(T.HttpLabel("type")),
    value: TableMaintenanceConfigurationValue,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutTableMaintenanceConfigurationRequest",
}) as any as S.Schema<PutTableMaintenanceConfigurationRequest>;
export interface PutTableMaintenanceConfigurationResponse {}
export const PutTableMaintenanceConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutTableMaintenanceConfigurationResponse",
}) as any as S.Schema<PutTableMaintenanceConfigurationResponse>;
export interface IcebergMetadata {
  schema: IcebergSchema;
  properties?: TableProperties;
}
export const IcebergMetadata = S.suspend(() =>
  S.Struct({ schema: IcebergSchema, properties: S.optional(TableProperties) }),
).annotations({
  identifier: "IcebergMetadata",
}) as any as S.Schema<IcebergMetadata>;
export type TableMetadata = { iceberg: IcebergMetadata };
export const TableMetadata = S.Union(S.Struct({ iceberg: IcebergMetadata }));
export interface PutTableBucketReplicationResponse {
  versionToken: string;
  status: string;
}
export const PutTableBucketReplicationResponse = S.suspend(() =>
  S.Struct({ versionToken: S.String, status: S.String }),
).annotations({
  identifier: "PutTableBucketReplicationResponse",
}) as any as S.Schema<PutTableBucketReplicationResponse>;
export interface CreateTableRequest {
  tableBucketARN: string;
  namespace: string;
  name: string;
  format: string;
  metadata?: (typeof TableMetadata)["Type"];
  encryptionConfiguration?: EncryptionConfiguration;
  storageClassConfiguration?: StorageClassConfiguration;
  tags?: Tags;
}
export const CreateTableRequest = S.suspend(() =>
  S.Struct({
    tableBucketARN: S.String.pipe(T.HttpLabel("tableBucketARN")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String,
    format: S.String,
    metadata: S.optional(TableMetadata),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    storageClassConfiguration: S.optional(StorageClassConfiguration),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/tables/{tableBucketARN}/{namespace}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTableRequest",
}) as any as S.Schema<CreateTableRequest>;
export interface CreateTableResponse {
  tableARN: string;
  versionToken: string;
}
export const CreateTableResponse = S.suspend(() =>
  S.Struct({ tableARN: S.String, versionToken: S.String }),
).annotations({
  identifier: "CreateTableResponse",
}) as any as S.Schema<CreateTableResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MethodNotAllowedException extends S.TaggedError<MethodNotAllowedException>()(
  "MethodNotAllowedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Retrieves the storage class configuration for a specific table. This allows you to view the storage class settings that apply to an individual table, which may differ from the table bucket's default configuration.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucketStorageClass` permission to use this operation.
 */
export const getTableBucketStorageClass: (
  input: GetTableBucketStorageClassRequest,
) => Effect.Effect<
  GetTableBucketStorageClassResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const createTable: (
  input: CreateTableRequest,
) => Effect.Effect<
  CreateTableResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableRecordExpirationJobStatus: (
  input: GetTableRecordExpirationJobStatusRequest,
) => Effect.Effect<
  GetTableRecordExpirationJobStatusResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putTableBucketMaintenanceConfiguration: (
  input: PutTableBucketMaintenanceConfigurationRequest,
) => Effect.Effect<
  PutTableBucketMaintenanceConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableReplicationStatus: (
  input: GetTableReplicationStatusRequest,
) => Effect.Effect<
  GetTableReplicationStatusResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const putTableReplication: (
  input: PutTableReplicationRequest,
) => Effect.Effect<
  PutTableReplicationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTable: (
  input: GetTableRequest,
) => Effect.Effect<
  GetTableResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableMaintenanceJobStatus: (
  input: GetTableMaintenanceJobStatusRequest,
) => Effect.Effect<
  GetTableMaintenanceJobStatusResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putTableMaintenanceConfiguration: (
  input: PutTableMaintenanceConfigurationRequest,
) => Effect.Effect<
  PutTableMaintenanceConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTableBuckets: {
  (
    input: ListTableBucketsRequest,
  ): Effect.Effect<
    ListTableBucketsResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTableBucketsRequest,
  ) => Stream.Stream<
    ListTableBucketsResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTableBucketsRequest,
  ) => Stream.Stream<
    TableBucketSummary,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Gets details about the maintenance configuration of a table. For more information, see S3 Tables maintenance in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * - You must have the `s3tables:GetTableMaintenanceConfiguration` permission to use this operation.
 *
 * - You must have the `s3tables:GetTableData` permission to use set the compaction strategy to `sort` or `zorder`.
 */
export const getTableMaintenanceConfiguration: (
  input: GetTableMaintenanceConfigurationRequest,
) => Effect.Effect<
  GetTableMaintenanceConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTables: {
  (
    input: ListTablesRequest,
  ): Effect.Effect<
    ListTablesResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTablesRequest,
  ) => Stream.Stream<
    ListTablesResponse,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTablesRequest,
  ) => Stream.Stream<
    TableSummary,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createNamespace: (
  input: CreateNamespaceRequest,
) => Effect.Effect<
  CreateNamespaceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putTableBucketEncryption: (
  input: PutTableBucketEncryptionRequest,
) => Effect.Effect<
  PutTableBucketEncryptionResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets details about a table bucket policy. For more information, see Viewing a table bucket policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucketPolicy` permission to use this operation.
 */
export const getTableBucketPolicy: (
  input: GetTableBucketPolicyRequest,
) => Effect.Effect<
  GetTableBucketPolicyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes the replication configuration for a table bucket. After deletion, new table updates will no longer be replicated to destination buckets, though existing replicated tables will remain in destination buckets.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTableBucketReplication` permission to use this operation.
 */
export const deleteTableBucketReplication: (
  input: DeleteTableBucketReplicationRequest,
) => Effect.Effect<
  DeleteTableBucketReplicationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableBucketReplication: (
  input: GetTableBucketReplicationRequest,
) => Effect.Effect<
  GetTableBucketReplicationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets details on a table bucket. For more information, see Viewing details about an Amazon S3 table bucket in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucket` permission to use this operation.
 */
export const getTableBucket: (
  input: GetTableBucketRequest,
) => Effect.Effect<
  GetTableBucketResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableBucketMetricsConfiguration: (
  input: GetTableBucketMetricsConfigurationRequest,
) => Effect.Effect<
  GetTableBucketMetricsConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTablePolicy: (
  input: GetTablePolicyRequest,
) => Effect.Effect<
  GetTablePolicyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableReplication: (
  input: GetTableReplicationRequest,
) => Effect.Effect<
  GetTableReplicationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableMetadataLocation: (
  input: GetTableMetadataLocationRequest,
) => Effect.Effect<
  GetTableMetadataLocationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the metadata location for a table. The metadata location of a table must be an S3 URI that begins with the table's warehouse location. The metadata location for an Apache Iceberg table must end with `.metadata.json`, or if the metadata file is Gzip-compressed, `.metadata.json.gz`.
 *
 * ### Permissions
 *
 * You must have the `s3tables:UpdateTableMetadataLocation` permission to use this operation.
 */
export const updateTableMetadataLocation: (
  input: UpdateTableMetadataLocationRequest,
) => Effect.Effect<
  UpdateTableMetadataLocationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a namespace. For more information, see Delete a namespace in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteNamespace` permission to use this operation.
 */
export const deleteNamespace: (
  input: DeleteNamespaceRequest,
) => Effect.Effect<
  DeleteNamespaceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTableBucketEncryption: (
  input: DeleteTableBucketEncryptionRequest,
) => Effect.Effect<
  DeleteTableBucketEncryptionResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a table bucket policy. For more information, see Deleting a table bucket policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTableBucketPolicy` permission to use this operation.
 */
export const deleteTableBucketPolicy: (
  input: DeleteTableBucketPolicyRequest,
) => Effect.Effect<
  DeleteTableBucketPolicyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new table bucket policy or replaces an existing table bucket policy for a table bucket. For more information, see Adding a table bucket policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTableBucketPolicy` permission to use this operation.
 */
export const putTableBucketPolicy: (
  input: PutTableBucketPolicyRequest,
) => Effect.Effect<
  PutTableBucketPolicyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a table bucket. For more information, see Deleting a table bucket in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTableBucket` permission to use this operation.
 */
export const deleteTableBucket: (
  input: DeleteTableBucketRequest,
) => Effect.Effect<
  DeleteTableBucketResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTableBucketMetricsConfiguration: (
  input: DeleteTableBucketMetricsConfigurationRequest,
) => Effect.Effect<
  DeleteTableBucketMetricsConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putTableBucketMetricsConfiguration: (
  input: PutTableBucketMetricsConfigurationRequest,
) => Effect.Effect<
  PutTableBucketMetricsConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putTableBucketStorageClass: (
  input: PutTableBucketStorageClassRequest,
) => Effect.Effect<
  PutTableBucketStorageClassResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a table policy. For more information, see Deleting a table policy in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:DeleteTablePolicy` permission to use this operation.
 */
export const deleteTablePolicy: (
  input: DeleteTablePolicyRequest,
) => Effect.Effect<
  DeleteTablePolicyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putTablePolicy: (
  input: PutTablePolicyRequest,
) => Effect.Effect<
  PutTablePolicyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTable: (
  input: DeleteTableRequest,
) => Effect.Effect<
  DeleteTableResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const renameTable: (
  input: RenameTableRequest,
) => Effect.Effect<
  RenameTableResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTableReplication: (
  input: DeleteTableReplicationRequest,
) => Effect.Effect<
  DeleteTableReplicationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets details about a namespace. For more information, see Table namespaces in the *Amazon Simple Storage Service User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetNamespace` permission to use this operation.
 */
export const getNamespace: (
  input: GetNamespaceRequest,
) => Effect.Effect<
  GetNamespaceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableEncryption: (
  input: GetTableEncryptionRequest,
) => Effect.Effect<
  GetTableEncryptionResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableStorageClass: (
  input: GetTableStorageClassRequest,
) => Effect.Effect<
  GetTableStorageClassResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets the encryption configuration for a table bucket.
 *
 * ### Permissions
 *
 * You must have the `s3tables:GetTableBucketEncryption` permission to use this operation.
 */
export const getTableBucketEncryption: (
  input: GetTableBucketEncryptionRequest,
) => Effect.Effect<
  GetTableBucketEncryptionResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Removes the specified user-defined tags from an Amazon S3 Tables resource. You can pass one or more tag keys.
 *
 * For a list of S3 resources that support tagging, see Managing tags for Amazon S3 resources.
 *
 * ### Permissions
 *
 * For tables and table buckets, you must have the `s3tables:UntagResource` permission to use this operation.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listNamespaces: {
  (
    input: ListNamespacesRequest,
  ): Effect.Effect<
    ListNamespacesResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNamespacesRequest,
  ) => Stream.Stream<
    ListNamespacesResponse,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNamespacesRequest,
  ) => Stream.Stream<
    NamespaceSummary,
    | AccessDeniedException
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const createTableBucket: (
  input: CreateTableBucketRequest,
) => Effect.Effect<
  CreateTableBucketResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableBucketMaintenanceConfiguration: (
  input: GetTableBucketMaintenanceConfigurationRequest,
) => Effect.Effect<
  GetTableBucketMaintenanceConfigurationResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putTableBucketReplication: (
  input: PutTableBucketReplicationRequest,
) => Effect.Effect<
  PutTableBucketReplicationResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates or updates the expiration configuration settings for records in a table, including the status of the configuration. If you enable record expiration for a table, records expire and are automatically removed from the table after the number of days that you specify.
 *
 * ### Permissions
 *
 * You must have the `s3tables:PutTableRecordExpirationConfiguration` permission to use this operation.
 */
export const putTableRecordExpirationConfiguration: (
  input: PutTableRecordExpirationConfigurationRequest,
) => Effect.Effect<
  PutTableRecordExpirationConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTableRecordExpirationConfiguration: (
  input: GetTableRecordExpirationConfigurationRequest,
) => Effect.Effect<
  GetTableRecordExpirationConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
