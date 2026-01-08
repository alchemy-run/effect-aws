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
  sdkId: "SupplyChain",
  serviceShapeName: "GalaxyPublicAPIGateway",
});
const auth = T.AwsAuthSigv4({ name: "scn" });
const ver = T.ServiceVersion("2024-01-01");
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
              `https://scn-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://scn-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://scn.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://scn.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type UUID = string;
export type DataIntegrationFlowName = string;
export type DataIntegrationEventNextToken = string;
export type DataIntegrationEventMaxResults = number;
export type DataIntegrationFlowExecutionNextToken = string;
export type DataIntegrationFlowExecutionMaxResults = number;
export type AscResourceArn = string;
export type DataIntegrationEventData = string | redacted.Redacted<string>;
export type DataIntegrationEventGroupId = string;
export type ClientToken = string;
export type TagKey = string;
export type ConfigurationS3Uri = string;
export type DataIntegrationFlowNextToken = string;
export type DataIntegrationFlowMaxResults = number;
export type DataLakeNamespaceName = string;
export type DataLakeDatasetName = string;
export type DataLakeDatasetDescription = string;
export type DataLakeDatasetNextToken = string;
export type DataLakeDatasetMaxResults = number;
export type DataLakeNamespaceDescription = string;
export type DataLakeNamespaceNextToken = string;
export type DataLakeNamespaceMaxResults = number;
export type InstanceName = string;
export type InstanceDescription = string;
export type KmsKeyArn = string;
export type InstanceWebAppDnsDomain = string;
export type InstanceNextToken = string;
export type InstanceMaxResults = number;
export type DataIntegrationDatasetArn = string;
export type TagValue = string;
export type DataIntegrationFlowSourceName = string;
export type DataLakeDatasetSchemaName = string;
export type S3BucketName = string;
export type DataIntegrationFlowS3Prefix = string;
export type DatasetIdentifier = string;
export type DataIntegrationFlowSQLQuery = string | redacted.Redacted<string>;
export type DataLakeDatasetSchemaFieldName = string;
export type AwsAccountId = string;
export type DataIntegrationFlowExecutionDiagnosticReportsRootS3URI = string;
export type DataIntegrationS3ObjectKey = string;
export type DataIntegrationFlowFieldPriorityDedupeFieldName = string;

//# Schemas
export type DataIntegrationEventType =
  | "scn.data.forecast"
  | "scn.data.inventorylevel"
  | "scn.data.inboundorder"
  | "scn.data.inboundorderline"
  | "scn.data.inboundorderlineschedule"
  | "scn.data.outboundorderline"
  | "scn.data.outboundshipment"
  | "scn.data.processheader"
  | "scn.data.processoperation"
  | "scn.data.processproduct"
  | "scn.data.reservation"
  | "scn.data.shipment"
  | "scn.data.shipmentstop"
  | "scn.data.shipmentstoporder"
  | "scn.data.supplyplan"
  | "scn.data.dataset";
export const DataIntegrationEventType = S.Literal(
  "scn.data.forecast",
  "scn.data.inventorylevel",
  "scn.data.inboundorder",
  "scn.data.inboundorderline",
  "scn.data.inboundorderlineschedule",
  "scn.data.outboundorderline",
  "scn.data.outboundshipment",
  "scn.data.processheader",
  "scn.data.processoperation",
  "scn.data.processproduct",
  "scn.data.reservation",
  "scn.data.shipment",
  "scn.data.shipmentstop",
  "scn.data.shipmentstoporder",
  "scn.data.supplyplan",
  "scn.data.dataset",
);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type InstanceNameList = string[];
export const InstanceNameList = S.Array(S.String);
export type InstanceState =
  | "Initializing"
  | "Active"
  | "CreateFailed"
  | "DeleteFailed"
  | "Deleting"
  | "Deleted";
export const InstanceState = S.Literal(
  "Initializing",
  "Active",
  "CreateFailed",
  "DeleteFailed",
  "Deleting",
  "Deleted",
);
export type InstanceStateList = InstanceState[];
export const InstanceStateList = S.Array(InstanceState);
export interface GetDataIntegrationEventRequest {
  instanceId: string;
  eventId: string;
}
export const GetDataIntegrationEventRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    eventId: S.String.pipe(T.HttpLabel("eventId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataIntegrationEventRequest",
}) as any as S.Schema<GetDataIntegrationEventRequest>;
export interface GetDataIntegrationFlowExecutionRequest {
  instanceId: string;
  flowName: string;
  executionId: string;
}
export const GetDataIntegrationFlowExecutionRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    flowName: S.String.pipe(T.HttpLabel("flowName")),
    executionId: S.String.pipe(T.HttpLabel("executionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataIntegrationFlowExecutionRequest",
}) as any as S.Schema<GetDataIntegrationFlowExecutionRequest>;
export interface ListDataIntegrationEventsRequest {
  instanceId: string;
  eventType?: DataIntegrationEventType;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataIntegrationEventsRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    eventType: S.optional(DataIntegrationEventType).pipe(
      T.HttpQuery("eventType"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDataIntegrationEventsRequest",
}) as any as S.Schema<ListDataIntegrationEventsRequest>;
export interface ListDataIntegrationFlowExecutionsRequest {
  instanceId: string;
  flowName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataIntegrationFlowExecutionsRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    flowName: S.String.pipe(T.HttpLabel("flowName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDataIntegrationFlowExecutionsRequest",
}) as any as S.Schema<ListDataIntegrationFlowExecutionsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/api/tags/{resourceArn}" }),
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
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/api/tags/{resourceArn}" }),
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
export interface CreateBillOfMaterialsImportJobRequest {
  instanceId: string;
  s3uri: string;
  clientToken?: string;
}
export const CreateBillOfMaterialsImportJobRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    s3uri: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateBillOfMaterialsImportJobRequest",
}) as any as S.Schema<CreateBillOfMaterialsImportJobRequest>;
export interface GetBillOfMaterialsImportJobRequest {
  instanceId: string;
  jobId: string;
}
export const GetBillOfMaterialsImportJobRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetBillOfMaterialsImportJobRequest",
}) as any as S.Schema<GetBillOfMaterialsImportJobRequest>;
export interface GetDataIntegrationFlowRequest {
  instanceId: string;
  name: string;
}
export const GetDataIntegrationFlowRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataIntegrationFlowRequest",
}) as any as S.Schema<GetDataIntegrationFlowRequest>;
export type DataIntegrationFlowSourceType = "S3" | "DATASET";
export const DataIntegrationFlowSourceType = S.Literal("S3", "DATASET");
export type DataIntegrationFlowFileType = "CSV" | "PARQUET" | "JSON";
export const DataIntegrationFlowFileType = S.Literal("CSV", "PARQUET", "JSON");
export interface DataIntegrationFlowS3Options {
  fileType?: DataIntegrationFlowFileType;
}
export const DataIntegrationFlowS3Options = S.suspend(() =>
  S.Struct({ fileType: S.optional(DataIntegrationFlowFileType) }),
).annotations({
  identifier: "DataIntegrationFlowS3Options",
}) as any as S.Schema<DataIntegrationFlowS3Options>;
export interface DataIntegrationFlowS3SourceConfiguration {
  bucketName: string;
  prefix: string;
  options?: DataIntegrationFlowS3Options;
}
export const DataIntegrationFlowS3SourceConfiguration = S.suspend(() =>
  S.Struct({
    bucketName: S.String,
    prefix: S.String,
    options: S.optional(DataIntegrationFlowS3Options),
  }),
).annotations({
  identifier: "DataIntegrationFlowS3SourceConfiguration",
}) as any as S.Schema<DataIntegrationFlowS3SourceConfiguration>;
export type DataIntegrationFlowLoadType = "INCREMENTAL" | "REPLACE";
export const DataIntegrationFlowLoadType = S.Literal("INCREMENTAL", "REPLACE");
export type DataIntegrationFlowDedupeStrategyType = "FIELD_PRIORITY";
export const DataIntegrationFlowDedupeStrategyType =
  S.Literal("FIELD_PRIORITY");
export type DataIntegrationFlowFieldPriorityDedupeSortOrder = "ASC" | "DESC";
export const DataIntegrationFlowFieldPriorityDedupeSortOrder = S.Literal(
  "ASC",
  "DESC",
);
export interface DataIntegrationFlowFieldPriorityDedupeField {
  name: string;
  sortOrder: DataIntegrationFlowFieldPriorityDedupeSortOrder;
}
export const DataIntegrationFlowFieldPriorityDedupeField = S.suspend(() =>
  S.Struct({
    name: S.String,
    sortOrder: DataIntegrationFlowFieldPriorityDedupeSortOrder,
  }),
).annotations({
  identifier: "DataIntegrationFlowFieldPriorityDedupeField",
}) as any as S.Schema<DataIntegrationFlowFieldPriorityDedupeField>;
export type DataIntegrationFlowFieldPriorityDedupeFieldList =
  DataIntegrationFlowFieldPriorityDedupeField[];
export const DataIntegrationFlowFieldPriorityDedupeFieldList = S.Array(
  DataIntegrationFlowFieldPriorityDedupeField,
);
export interface DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration {
  fields: DataIntegrationFlowFieldPriorityDedupeField[];
}
export const DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration =
  S.suspend(() =>
    S.Struct({ fields: DataIntegrationFlowFieldPriorityDedupeFieldList }),
  ).annotations({
    identifier: "DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration",
  }) as any as S.Schema<DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration>;
export interface DataIntegrationFlowDedupeStrategy {
  type: DataIntegrationFlowDedupeStrategyType;
  fieldPriority?: DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration;
}
export const DataIntegrationFlowDedupeStrategy = S.suspend(() =>
  S.Struct({
    type: DataIntegrationFlowDedupeStrategyType,
    fieldPriority: S.optional(
      DataIntegrationFlowFieldPriorityDedupeStrategyConfiguration,
    ),
  }),
).annotations({
  identifier: "DataIntegrationFlowDedupeStrategy",
}) as any as S.Schema<DataIntegrationFlowDedupeStrategy>;
export interface DataIntegrationFlowDatasetOptions {
  loadType?: DataIntegrationFlowLoadType;
  dedupeRecords?: boolean;
  dedupeStrategy?: DataIntegrationFlowDedupeStrategy;
}
export const DataIntegrationFlowDatasetOptions = S.suspend(() =>
  S.Struct({
    loadType: S.optional(DataIntegrationFlowLoadType),
    dedupeRecords: S.optional(S.Boolean),
    dedupeStrategy: S.optional(DataIntegrationFlowDedupeStrategy),
  }),
).annotations({
  identifier: "DataIntegrationFlowDatasetOptions",
}) as any as S.Schema<DataIntegrationFlowDatasetOptions>;
export interface DataIntegrationFlowDatasetSourceConfiguration {
  datasetIdentifier: string;
  options?: DataIntegrationFlowDatasetOptions;
}
export const DataIntegrationFlowDatasetSourceConfiguration = S.suspend(() =>
  S.Struct({
    datasetIdentifier: S.String,
    options: S.optional(DataIntegrationFlowDatasetOptions),
  }),
).annotations({
  identifier: "DataIntegrationFlowDatasetSourceConfiguration",
}) as any as S.Schema<DataIntegrationFlowDatasetSourceConfiguration>;
export interface DataIntegrationFlowSource {
  sourceType: DataIntegrationFlowSourceType;
  sourceName: string;
  s3Source?: DataIntegrationFlowS3SourceConfiguration;
  datasetSource?: DataIntegrationFlowDatasetSourceConfiguration;
}
export const DataIntegrationFlowSource = S.suspend(() =>
  S.Struct({
    sourceType: DataIntegrationFlowSourceType,
    sourceName: S.String,
    s3Source: S.optional(DataIntegrationFlowS3SourceConfiguration),
    datasetSource: S.optional(DataIntegrationFlowDatasetSourceConfiguration),
  }),
).annotations({
  identifier: "DataIntegrationFlowSource",
}) as any as S.Schema<DataIntegrationFlowSource>;
export type DataIntegrationFlowSourceList = DataIntegrationFlowSource[];
export const DataIntegrationFlowSourceList = S.Array(DataIntegrationFlowSource);
export type DataIntegrationFlowTransformationType = "SQL" | "NONE";
export const DataIntegrationFlowTransformationType = S.Literal("SQL", "NONE");
export interface DataIntegrationFlowSQLTransformationConfiguration {
  query: string | redacted.Redacted<string>;
}
export const DataIntegrationFlowSQLTransformationConfiguration = S.suspend(() =>
  S.Struct({ query: SensitiveString }),
).annotations({
  identifier: "DataIntegrationFlowSQLTransformationConfiguration",
}) as any as S.Schema<DataIntegrationFlowSQLTransformationConfiguration>;
export interface DataIntegrationFlowTransformation {
  transformationType: DataIntegrationFlowTransformationType;
  sqlTransformation?: DataIntegrationFlowSQLTransformationConfiguration;
}
export const DataIntegrationFlowTransformation = S.suspend(() =>
  S.Struct({
    transformationType: DataIntegrationFlowTransformationType,
    sqlTransformation: S.optional(
      DataIntegrationFlowSQLTransformationConfiguration,
    ),
  }),
).annotations({
  identifier: "DataIntegrationFlowTransformation",
}) as any as S.Schema<DataIntegrationFlowTransformation>;
export type DataIntegrationFlowTargetType = "S3" | "DATASET";
export const DataIntegrationFlowTargetType = S.Literal("S3", "DATASET");
export interface DataIntegrationFlowS3TargetConfiguration {
  bucketName: string;
  prefix: string;
  options?: DataIntegrationFlowS3Options;
}
export const DataIntegrationFlowS3TargetConfiguration = S.suspend(() =>
  S.Struct({
    bucketName: S.String,
    prefix: S.String,
    options: S.optional(DataIntegrationFlowS3Options),
  }),
).annotations({
  identifier: "DataIntegrationFlowS3TargetConfiguration",
}) as any as S.Schema<DataIntegrationFlowS3TargetConfiguration>;
export interface DataIntegrationFlowDatasetTargetConfiguration {
  datasetIdentifier: string;
  options?: DataIntegrationFlowDatasetOptions;
}
export const DataIntegrationFlowDatasetTargetConfiguration = S.suspend(() =>
  S.Struct({
    datasetIdentifier: S.String,
    options: S.optional(DataIntegrationFlowDatasetOptions),
  }),
).annotations({
  identifier: "DataIntegrationFlowDatasetTargetConfiguration",
}) as any as S.Schema<DataIntegrationFlowDatasetTargetConfiguration>;
export interface DataIntegrationFlowTarget {
  targetType: DataIntegrationFlowTargetType;
  s3Target?: DataIntegrationFlowS3TargetConfiguration;
  datasetTarget?: DataIntegrationFlowDatasetTargetConfiguration;
}
export const DataIntegrationFlowTarget = S.suspend(() =>
  S.Struct({
    targetType: DataIntegrationFlowTargetType,
    s3Target: S.optional(DataIntegrationFlowS3TargetConfiguration),
    datasetTarget: S.optional(DataIntegrationFlowDatasetTargetConfiguration),
  }),
).annotations({
  identifier: "DataIntegrationFlowTarget",
}) as any as S.Schema<DataIntegrationFlowTarget>;
export interface UpdateDataIntegrationFlowRequest {
  instanceId: string;
  name: string;
  sources?: DataIntegrationFlowSource[];
  transformation?: DataIntegrationFlowTransformation;
  target?: DataIntegrationFlowTarget;
}
export const UpdateDataIntegrationFlowRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    sources: S.optional(DataIntegrationFlowSourceList),
    transformation: S.optional(DataIntegrationFlowTransformation),
    target: S.optional(DataIntegrationFlowTarget),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDataIntegrationFlowRequest",
}) as any as S.Schema<UpdateDataIntegrationFlowRequest>;
export interface DeleteDataIntegrationFlowRequest {
  instanceId: string;
  name: string;
}
export const DeleteDataIntegrationFlowRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDataIntegrationFlowRequest",
}) as any as S.Schema<DeleteDataIntegrationFlowRequest>;
export interface ListDataIntegrationFlowsRequest {
  instanceId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataIntegrationFlowsRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDataIntegrationFlowsRequest",
}) as any as S.Schema<ListDataIntegrationFlowsRequest>;
export interface GetDataLakeDatasetRequest {
  instanceId: string;
  namespace: string;
  name: string;
}
export const GetDataLakeDatasetRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataLakeDatasetRequest",
}) as any as S.Schema<GetDataLakeDatasetRequest>;
export interface UpdateDataLakeDatasetRequest {
  instanceId: string;
  namespace: string;
  name: string;
  description?: string;
}
export const UpdateDataLakeDatasetRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDataLakeDatasetRequest",
}) as any as S.Schema<UpdateDataLakeDatasetRequest>;
export interface DeleteDataLakeDatasetRequest {
  instanceId: string;
  namespace: string;
  name: string;
}
export const DeleteDataLakeDatasetRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDataLakeDatasetRequest",
}) as any as S.Schema<DeleteDataLakeDatasetRequest>;
export interface ListDataLakeDatasetsRequest {
  instanceId: string;
  namespace: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataLakeDatasetsRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDataLakeDatasetsRequest",
}) as any as S.Schema<ListDataLakeDatasetsRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateDataLakeNamespaceRequest {
  instanceId: string;
  name: string;
  description?: string;
  tags?: { [key: string]: string };
}
export const CreateDataLakeNamespaceRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDataLakeNamespaceRequest",
}) as any as S.Schema<CreateDataLakeNamespaceRequest>;
export interface GetDataLakeNamespaceRequest {
  instanceId: string;
  name: string;
}
export const GetDataLakeNamespaceRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataLakeNamespaceRequest",
}) as any as S.Schema<GetDataLakeNamespaceRequest>;
export interface UpdateDataLakeNamespaceRequest {
  instanceId: string;
  name: string;
  description?: string;
}
export const UpdateDataLakeNamespaceRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDataLakeNamespaceRequest",
}) as any as S.Schema<UpdateDataLakeNamespaceRequest>;
export interface DeleteDataLakeNamespaceRequest {
  instanceId: string;
  name: string;
}
export const DeleteDataLakeNamespaceRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDataLakeNamespaceRequest",
}) as any as S.Schema<DeleteDataLakeNamespaceRequest>;
export interface ListDataLakeNamespacesRequest {
  instanceId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataLakeNamespacesRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDataLakeNamespacesRequest",
}) as any as S.Schema<ListDataLakeNamespacesRequest>;
export interface CreateInstanceRequest {
  instanceName?: string;
  instanceDescription?: string;
  kmsKeyArn?: string;
  webAppDnsDomain?: string;
  tags?: { [key: string]: string };
  clientToken?: string;
}
export const CreateInstanceRequest = S.suspend(() =>
  S.Struct({
    instanceName: S.optional(S.String),
    instanceDescription: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    webAppDnsDomain: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/api/instance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInstanceRequest",
}) as any as S.Schema<CreateInstanceRequest>;
export interface GetInstanceRequest {
  instanceId: string;
}
export const GetInstanceRequest = S.suspend(() =>
  S.Struct({ instanceId: S.String.pipe(T.HttpLabel("instanceId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/api/instance/{instanceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceRequest",
}) as any as S.Schema<GetInstanceRequest>;
export interface UpdateInstanceRequest {
  instanceId: string;
  instanceName?: string;
  instanceDescription?: string;
}
export const UpdateInstanceRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    instanceName: S.optional(S.String),
    instanceDescription: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/api/instance/{instanceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInstanceRequest",
}) as any as S.Schema<UpdateInstanceRequest>;
export interface DeleteInstanceRequest {
  instanceId: string;
}
export const DeleteInstanceRequest = S.suspend(() =>
  S.Struct({ instanceId: S.String.pipe(T.HttpLabel("instanceId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/api/instance/{instanceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInstanceRequest",
}) as any as S.Schema<DeleteInstanceRequest>;
export interface ListInstancesRequest {
  nextToken?: string;
  maxResults?: number;
  instanceNameFilter?: string[];
  instanceStateFilter?: InstanceState[];
}
export const ListInstancesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    instanceNameFilter: S.optional(InstanceNameList).pipe(
      T.HttpQuery("instanceNameFilter"),
    ),
    instanceStateFilter: S.optional(InstanceStateList).pipe(
      T.HttpQuery("instanceStateFilter"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/api/instance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInstancesRequest",
}) as any as S.Schema<ListInstancesRequest>;
export type DataIntegrationEventDatasetOperationType =
  | "APPEND"
  | "UPSERT"
  | "DELETE";
export const DataIntegrationEventDatasetOperationType = S.Literal(
  "APPEND",
  "UPSERT",
  "DELETE",
);
export type DataIntegrationEventDatasetLoadStatus =
  | "SUCCEEDED"
  | "IN_PROGRESS"
  | "FAILED";
export const DataIntegrationEventDatasetLoadStatus = S.Literal(
  "SUCCEEDED",
  "IN_PROGRESS",
  "FAILED",
);
export interface DataIntegrationEventDatasetLoadExecutionDetails {
  status: DataIntegrationEventDatasetLoadStatus;
  message?: string;
}
export const DataIntegrationEventDatasetLoadExecutionDetails = S.suspend(() =>
  S.Struct({
    status: DataIntegrationEventDatasetLoadStatus,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "DataIntegrationEventDatasetLoadExecutionDetails",
}) as any as S.Schema<DataIntegrationEventDatasetLoadExecutionDetails>;
export interface DataIntegrationEventDatasetTargetDetails {
  datasetIdentifier: string;
  operationType: DataIntegrationEventDatasetOperationType;
  datasetLoadExecution: DataIntegrationEventDatasetLoadExecutionDetails;
}
export const DataIntegrationEventDatasetTargetDetails = S.suspend(() =>
  S.Struct({
    datasetIdentifier: S.String,
    operationType: DataIntegrationEventDatasetOperationType,
    datasetLoadExecution: DataIntegrationEventDatasetLoadExecutionDetails,
  }),
).annotations({
  identifier: "DataIntegrationEventDatasetTargetDetails",
}) as any as S.Schema<DataIntegrationEventDatasetTargetDetails>;
export interface DataIntegrationEvent {
  instanceId: string;
  eventId: string;
  eventType: DataIntegrationEventType;
  eventGroupId: string;
  eventTimestamp: Date;
  datasetTargetDetails?: DataIntegrationEventDatasetTargetDetails;
}
export const DataIntegrationEvent = S.suspend(() =>
  S.Struct({
    instanceId: S.String,
    eventId: S.String,
    eventType: DataIntegrationEventType,
    eventGroupId: S.String,
    eventTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    datasetTargetDetails: S.optional(DataIntegrationEventDatasetTargetDetails),
  }),
).annotations({
  identifier: "DataIntegrationEvent",
}) as any as S.Schema<DataIntegrationEvent>;
export type DataIntegrationEventList = DataIntegrationEvent[];
export const DataIntegrationEventList = S.Array(DataIntegrationEvent);
export type DataIntegrationFlowExecutionStatus =
  | "SUCCEEDED"
  | "IN_PROGRESS"
  | "FAILED";
export const DataIntegrationFlowExecutionStatus = S.Literal(
  "SUCCEEDED",
  "IN_PROGRESS",
  "FAILED",
);
export interface DataIntegrationFlowS3Source {
  bucketName: string;
  key: string;
}
export const DataIntegrationFlowS3Source = S.suspend(() =>
  S.Struct({ bucketName: S.String, key: S.String }),
).annotations({
  identifier: "DataIntegrationFlowS3Source",
}) as any as S.Schema<DataIntegrationFlowS3Source>;
export interface DataIntegrationFlowDatasetSource {
  datasetIdentifier: string;
}
export const DataIntegrationFlowDatasetSource = S.suspend(() =>
  S.Struct({ datasetIdentifier: S.String }),
).annotations({
  identifier: "DataIntegrationFlowDatasetSource",
}) as any as S.Schema<DataIntegrationFlowDatasetSource>;
export interface DataIntegrationFlowExecutionSourceInfo {
  sourceType: DataIntegrationFlowSourceType;
  s3Source?: DataIntegrationFlowS3Source;
  datasetSource?: DataIntegrationFlowDatasetSource;
}
export const DataIntegrationFlowExecutionSourceInfo = S.suspend(() =>
  S.Struct({
    sourceType: DataIntegrationFlowSourceType,
    s3Source: S.optional(DataIntegrationFlowS3Source),
    datasetSource: S.optional(DataIntegrationFlowDatasetSource),
  }),
).annotations({
  identifier: "DataIntegrationFlowExecutionSourceInfo",
}) as any as S.Schema<DataIntegrationFlowExecutionSourceInfo>;
export interface DataIntegrationFlowExecutionOutputMetadata {
  diagnosticReportsRootS3URI?: string;
}
export const DataIntegrationFlowExecutionOutputMetadata = S.suspend(() =>
  S.Struct({ diagnosticReportsRootS3URI: S.optional(S.String) }),
).annotations({
  identifier: "DataIntegrationFlowExecutionOutputMetadata",
}) as any as S.Schema<DataIntegrationFlowExecutionOutputMetadata>;
export interface DataIntegrationFlowExecution {
  instanceId: string;
  flowName: string;
  executionId: string;
  status?: DataIntegrationFlowExecutionStatus;
  sourceInfo?: DataIntegrationFlowExecutionSourceInfo;
  message?: string;
  startTime?: Date;
  endTime?: Date;
  outputMetadata?: DataIntegrationFlowExecutionOutputMetadata;
}
export const DataIntegrationFlowExecution = S.suspend(() =>
  S.Struct({
    instanceId: S.String,
    flowName: S.String,
    executionId: S.String,
    status: S.optional(DataIntegrationFlowExecutionStatus),
    sourceInfo: S.optional(DataIntegrationFlowExecutionSourceInfo),
    message: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    outputMetadata: S.optional(DataIntegrationFlowExecutionOutputMetadata),
  }),
).annotations({
  identifier: "DataIntegrationFlowExecution",
}) as any as S.Schema<DataIntegrationFlowExecution>;
export type DataIntegrationFlowExecutionList = DataIntegrationFlowExecution[];
export const DataIntegrationFlowExecutionList = S.Array(
  DataIntegrationFlowExecution,
);
export interface DataIntegrationEventDatasetTargetConfiguration {
  datasetIdentifier: string;
  operationType: DataIntegrationEventDatasetOperationType;
}
export const DataIntegrationEventDatasetTargetConfiguration = S.suspend(() =>
  S.Struct({
    datasetIdentifier: S.String,
    operationType: DataIntegrationEventDatasetOperationType,
  }),
).annotations({
  identifier: "DataIntegrationEventDatasetTargetConfiguration",
}) as any as S.Schema<DataIntegrationEventDatasetTargetConfiguration>;
export interface DataIntegrationFlow {
  instanceId: string;
  name: string;
  sources: DataIntegrationFlowSource[];
  transformation: DataIntegrationFlowTransformation;
  target: DataIntegrationFlowTarget;
  createdTime: Date;
  lastModifiedTime: Date;
}
export const DataIntegrationFlow = S.suspend(() =>
  S.Struct({
    instanceId: S.String,
    name: S.String,
    sources: DataIntegrationFlowSourceList,
    transformation: DataIntegrationFlowTransformation,
    target: DataIntegrationFlowTarget,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DataIntegrationFlow",
}) as any as S.Schema<DataIntegrationFlow>;
export type DataIntegrationFlowList = DataIntegrationFlow[];
export const DataIntegrationFlowList = S.Array(DataIntegrationFlow);
export type DataLakeDatasetSchemaFieldType =
  | "INT"
  | "DOUBLE"
  | "STRING"
  | "TIMESTAMP"
  | "LONG";
export const DataLakeDatasetSchemaFieldType = S.Literal(
  "INT",
  "DOUBLE",
  "STRING",
  "TIMESTAMP",
  "LONG",
);
export interface DataLakeDatasetSchemaField {
  name: string;
  type: DataLakeDatasetSchemaFieldType;
  isRequired: boolean;
}
export const DataLakeDatasetSchemaField = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: DataLakeDatasetSchemaFieldType,
    isRequired: S.Boolean,
  }),
).annotations({
  identifier: "DataLakeDatasetSchemaField",
}) as any as S.Schema<DataLakeDatasetSchemaField>;
export type DataLakeDatasetSchemaFieldList = DataLakeDatasetSchemaField[];
export const DataLakeDatasetSchemaFieldList = S.Array(
  DataLakeDatasetSchemaField,
);
export interface DataLakeDatasetPrimaryKeyField {
  name: string;
}
export const DataLakeDatasetPrimaryKeyField = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({
  identifier: "DataLakeDatasetPrimaryKeyField",
}) as any as S.Schema<DataLakeDatasetPrimaryKeyField>;
export type DataLakeDatasetPrimaryKeyFieldList =
  DataLakeDatasetPrimaryKeyField[];
export const DataLakeDatasetPrimaryKeyFieldList = S.Array(
  DataLakeDatasetPrimaryKeyField,
);
export interface DataLakeDatasetSchema {
  name: string;
  fields: DataLakeDatasetSchemaField[];
  primaryKeys?: DataLakeDatasetPrimaryKeyField[];
}
export const DataLakeDatasetSchema = S.suspend(() =>
  S.Struct({
    name: S.String,
    fields: DataLakeDatasetSchemaFieldList,
    primaryKeys: S.optional(DataLakeDatasetPrimaryKeyFieldList),
  }),
).annotations({
  identifier: "DataLakeDatasetSchema",
}) as any as S.Schema<DataLakeDatasetSchema>;
export type DataLakeDatasetPartitionTransformType =
  | "YEAR"
  | "MONTH"
  | "DAY"
  | "HOUR"
  | "IDENTITY";
export const DataLakeDatasetPartitionTransformType = S.Literal(
  "YEAR",
  "MONTH",
  "DAY",
  "HOUR",
  "IDENTITY",
);
export interface DataLakeDatasetPartitionFieldTransform {
  type: DataLakeDatasetPartitionTransformType;
}
export const DataLakeDatasetPartitionFieldTransform = S.suspend(() =>
  S.Struct({ type: DataLakeDatasetPartitionTransformType }),
).annotations({
  identifier: "DataLakeDatasetPartitionFieldTransform",
}) as any as S.Schema<DataLakeDatasetPartitionFieldTransform>;
export interface DataLakeDatasetPartitionField {
  name: string;
  transform: DataLakeDatasetPartitionFieldTransform;
}
export const DataLakeDatasetPartitionField = S.suspend(() =>
  S.Struct({
    name: S.String,
    transform: DataLakeDatasetPartitionFieldTransform,
  }),
).annotations({
  identifier: "DataLakeDatasetPartitionField",
}) as any as S.Schema<DataLakeDatasetPartitionField>;
export type DataLakeDatasetPartitionFieldList = DataLakeDatasetPartitionField[];
export const DataLakeDatasetPartitionFieldList = S.Array(
  DataLakeDatasetPartitionField,
);
export interface DataLakeDatasetPartitionSpec {
  fields: DataLakeDatasetPartitionField[];
}
export const DataLakeDatasetPartitionSpec = S.suspend(() =>
  S.Struct({ fields: DataLakeDatasetPartitionFieldList }),
).annotations({
  identifier: "DataLakeDatasetPartitionSpec",
}) as any as S.Schema<DataLakeDatasetPartitionSpec>;
export interface DataLakeDataset {
  instanceId: string;
  namespace: string;
  name: string;
  arn: string;
  schema: DataLakeDatasetSchema;
  description?: string;
  partitionSpec?: DataLakeDatasetPartitionSpec;
  createdTime: Date;
  lastModifiedTime: Date;
}
export const DataLakeDataset = S.suspend(() =>
  S.Struct({
    instanceId: S.String,
    namespace: S.String,
    name: S.String,
    arn: S.String,
    schema: DataLakeDatasetSchema,
    description: S.optional(S.String),
    partitionSpec: S.optional(DataLakeDatasetPartitionSpec),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DataLakeDataset",
}) as any as S.Schema<DataLakeDataset>;
export type DataLakeDatasetList = DataLakeDataset[];
export const DataLakeDatasetList = S.Array(DataLakeDataset);
export interface DataLakeNamespace {
  instanceId: string;
  name: string;
  arn: string;
  description?: string;
  createdTime: Date;
  lastModifiedTime: Date;
}
export const DataLakeNamespace = S.suspend(() =>
  S.Struct({
    instanceId: S.String,
    name: S.String,
    arn: S.String,
    description: S.optional(S.String),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DataLakeNamespace",
}) as any as S.Schema<DataLakeNamespace>;
export type DataLakeNamespaceList = DataLakeNamespace[];
export const DataLakeNamespaceList = S.Array(DataLakeNamespace);
export interface Instance {
  instanceId: string;
  awsAccountId: string;
  state: InstanceState;
  errorMessage?: string;
  webAppDnsDomain?: string;
  createdTime?: Date;
  lastModifiedTime?: Date;
  instanceName?: string;
  instanceDescription?: string;
  kmsKeyArn?: string;
  versionNumber?: number;
}
export const Instance = S.suspend(() =>
  S.Struct({
    instanceId: S.String,
    awsAccountId: S.String,
    state: InstanceState,
    errorMessage: S.optional(S.String),
    webAppDnsDomain: S.optional(S.String),
    createdTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    instanceName: S.optional(S.String),
    instanceDescription: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    versionNumber: S.optional(S.Number),
  }),
).annotations({ identifier: "Instance" }) as any as S.Schema<Instance>;
export type InstanceList = Instance[];
export const InstanceList = S.Array(Instance);
export interface ListDataIntegrationEventsResponse {
  events: DataIntegrationEvent[];
  nextToken?: string;
}
export const ListDataIntegrationEventsResponse = S.suspend(() =>
  S.Struct({
    events: DataIntegrationEventList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataIntegrationEventsResponse",
}) as any as S.Schema<ListDataIntegrationEventsResponse>;
export interface ListDataIntegrationFlowExecutionsResponse {
  flowExecutions: DataIntegrationFlowExecution[];
  nextToken?: string;
}
export const ListDataIntegrationFlowExecutionsResponse = S.suspend(() =>
  S.Struct({
    flowExecutions: DataIntegrationFlowExecutionList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataIntegrationFlowExecutionsResponse",
}) as any as S.Schema<ListDataIntegrationFlowExecutionsResponse>;
export interface ListTagsForResourceResponse {
  tags: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface SendDataIntegrationEventRequest {
  instanceId: string;
  eventType: DataIntegrationEventType;
  data: string | redacted.Redacted<string>;
  eventGroupId: string;
  eventTimestamp?: Date;
  clientToken?: string;
  datasetTarget?: DataIntegrationEventDatasetTargetConfiguration;
}
export const SendDataIntegrationEventRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    eventType: DataIntegrationEventType,
    data: SensitiveString,
    eventGroupId: S.String,
    eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    datasetTarget: S.optional(DataIntegrationEventDatasetTargetConfiguration),
  }).pipe(
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
  ),
).annotations({
  identifier: "SendDataIntegrationEventRequest",
}) as any as S.Schema<SendDataIntegrationEventRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/api/tags/{resourceArn}" }),
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
export interface CreateBillOfMaterialsImportJobResponse {
  jobId: string;
}
export const CreateBillOfMaterialsImportJobResponse = S.suspend(() =>
  S.Struct({ jobId: S.String }),
).annotations({
  identifier: "CreateBillOfMaterialsImportJobResponse",
}) as any as S.Schema<CreateBillOfMaterialsImportJobResponse>;
export interface UpdateDataIntegrationFlowResponse {
  flow: DataIntegrationFlow;
}
export const UpdateDataIntegrationFlowResponse = S.suspend(() =>
  S.Struct({ flow: DataIntegrationFlow }),
).annotations({
  identifier: "UpdateDataIntegrationFlowResponse",
}) as any as S.Schema<UpdateDataIntegrationFlowResponse>;
export interface DeleteDataIntegrationFlowResponse {
  instanceId: string;
  name: string;
}
export const DeleteDataIntegrationFlowResponse = S.suspend(() =>
  S.Struct({ instanceId: S.String, name: S.String }),
).annotations({
  identifier: "DeleteDataIntegrationFlowResponse",
}) as any as S.Schema<DeleteDataIntegrationFlowResponse>;
export interface ListDataIntegrationFlowsResponse {
  flows: DataIntegrationFlow[];
  nextToken?: string;
}
export const ListDataIntegrationFlowsResponse = S.suspend(() =>
  S.Struct({ flows: DataIntegrationFlowList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDataIntegrationFlowsResponse",
}) as any as S.Schema<ListDataIntegrationFlowsResponse>;
export interface UpdateDataLakeDatasetResponse {
  dataset: DataLakeDataset;
}
export const UpdateDataLakeDatasetResponse = S.suspend(() =>
  S.Struct({ dataset: DataLakeDataset }),
).annotations({
  identifier: "UpdateDataLakeDatasetResponse",
}) as any as S.Schema<UpdateDataLakeDatasetResponse>;
export interface DeleteDataLakeDatasetResponse {
  instanceId: string;
  namespace: string;
  name: string;
}
export const DeleteDataLakeDatasetResponse = S.suspend(() =>
  S.Struct({ instanceId: S.String, namespace: S.String, name: S.String }),
).annotations({
  identifier: "DeleteDataLakeDatasetResponse",
}) as any as S.Schema<DeleteDataLakeDatasetResponse>;
export interface ListDataLakeDatasetsResponse {
  datasets: DataLakeDataset[];
  nextToken?: string;
}
export const ListDataLakeDatasetsResponse = S.suspend(() =>
  S.Struct({ datasets: DataLakeDatasetList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDataLakeDatasetsResponse",
}) as any as S.Schema<ListDataLakeDatasetsResponse>;
export interface GetDataLakeNamespaceResponse {
  namespace: DataLakeNamespace;
}
export const GetDataLakeNamespaceResponse = S.suspend(() =>
  S.Struct({ namespace: DataLakeNamespace }),
).annotations({
  identifier: "GetDataLakeNamespaceResponse",
}) as any as S.Schema<GetDataLakeNamespaceResponse>;
export interface UpdateDataLakeNamespaceResponse {
  namespace: DataLakeNamespace;
}
export const UpdateDataLakeNamespaceResponse = S.suspend(() =>
  S.Struct({ namespace: DataLakeNamespace }),
).annotations({
  identifier: "UpdateDataLakeNamespaceResponse",
}) as any as S.Schema<UpdateDataLakeNamespaceResponse>;
export interface DeleteDataLakeNamespaceResponse {
  instanceId: string;
  name: string;
}
export const DeleteDataLakeNamespaceResponse = S.suspend(() =>
  S.Struct({ instanceId: S.String, name: S.String }),
).annotations({
  identifier: "DeleteDataLakeNamespaceResponse",
}) as any as S.Schema<DeleteDataLakeNamespaceResponse>;
export interface ListDataLakeNamespacesResponse {
  namespaces: DataLakeNamespace[];
  nextToken?: string;
}
export const ListDataLakeNamespacesResponse = S.suspend(() =>
  S.Struct({
    namespaces: DataLakeNamespaceList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataLakeNamespacesResponse",
}) as any as S.Schema<ListDataLakeNamespacesResponse>;
export interface GetInstanceResponse {
  instance: Instance;
}
export const GetInstanceResponse = S.suspend(() =>
  S.Struct({ instance: Instance }),
).annotations({
  identifier: "GetInstanceResponse",
}) as any as S.Schema<GetInstanceResponse>;
export interface UpdateInstanceResponse {
  instance: Instance;
}
export const UpdateInstanceResponse = S.suspend(() =>
  S.Struct({ instance: Instance }),
).annotations({
  identifier: "UpdateInstanceResponse",
}) as any as S.Schema<UpdateInstanceResponse>;
export interface DeleteInstanceResponse {
  instance: Instance;
}
export const DeleteInstanceResponse = S.suspend(() =>
  S.Struct({ instance: Instance }),
).annotations({
  identifier: "DeleteInstanceResponse",
}) as any as S.Schema<DeleteInstanceResponse>;
export interface ListInstancesResponse {
  instances: Instance[];
  nextToken?: string;
}
export const ListInstancesResponse = S.suspend(() =>
  S.Struct({ instances: InstanceList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListInstancesResponse",
}) as any as S.Schema<ListInstancesResponse>;
export type ConfigurationJobStatus =
  | "NEW"
  | "FAILED"
  | "IN_PROGRESS"
  | "QUEUED"
  | "SUCCESS";
export const ConfigurationJobStatus = S.Literal(
  "NEW",
  "FAILED",
  "IN_PROGRESS",
  "QUEUED",
  "SUCCESS",
);
export interface BillOfMaterialsImportJob {
  instanceId: string;
  jobId: string;
  status: ConfigurationJobStatus;
  s3uri: string;
  message?: string;
}
export const BillOfMaterialsImportJob = S.suspend(() =>
  S.Struct({
    instanceId: S.String,
    jobId: S.String,
    status: ConfigurationJobStatus,
    s3uri: S.String,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "BillOfMaterialsImportJob",
}) as any as S.Schema<BillOfMaterialsImportJob>;
export interface SendDataIntegrationEventResponse {
  eventId: string;
}
export const SendDataIntegrationEventResponse = S.suspend(() =>
  S.Struct({ eventId: S.String }),
).annotations({
  identifier: "SendDataIntegrationEventResponse",
}) as any as S.Schema<SendDataIntegrationEventResponse>;
export interface GetBillOfMaterialsImportJobResponse {
  job: BillOfMaterialsImportJob;
}
export const GetBillOfMaterialsImportJobResponse = S.suspend(() =>
  S.Struct({ job: BillOfMaterialsImportJob }),
).annotations({
  identifier: "GetBillOfMaterialsImportJobResponse",
}) as any as S.Schema<GetBillOfMaterialsImportJobResponse>;
export interface GetDataIntegrationFlowResponse {
  flow: DataIntegrationFlow;
}
export const GetDataIntegrationFlowResponse = S.suspend(() =>
  S.Struct({ flow: DataIntegrationFlow }),
).annotations({
  identifier: "GetDataIntegrationFlowResponse",
}) as any as S.Schema<GetDataIntegrationFlowResponse>;
export interface GetDataLakeDatasetResponse {
  dataset: DataLakeDataset;
}
export const GetDataLakeDatasetResponse = S.suspend(() =>
  S.Struct({ dataset: DataLakeDataset }),
).annotations({
  identifier: "GetDataLakeDatasetResponse",
}) as any as S.Schema<GetDataLakeDatasetResponse>;
export interface CreateDataLakeNamespaceResponse {
  namespace: DataLakeNamespace;
}
export const CreateDataLakeNamespaceResponse = S.suspend(() =>
  S.Struct({ namespace: DataLakeNamespace }),
).annotations({
  identifier: "CreateDataLakeNamespaceResponse",
}) as any as S.Schema<CreateDataLakeNamespaceResponse>;
export interface CreateInstanceResponse {
  instance: Instance;
}
export const CreateInstanceResponse = S.suspend(() =>
  S.Struct({ instance: Instance }),
).annotations({
  identifier: "CreateInstanceResponse",
}) as any as S.Schema<CreateInstanceResponse>;
export interface CreateDataLakeDatasetRequest {
  instanceId: string;
  namespace: string;
  name: string;
  schema?: DataLakeDatasetSchema;
  description?: string;
  partitionSpec?: DataLakeDatasetPartitionSpec;
  tags?: { [key: string]: string };
}
export const CreateDataLakeDatasetRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    namespace: S.String.pipe(T.HttpLabel("namespace")),
    name: S.String.pipe(T.HttpLabel("name")),
    schema: S.optional(DataLakeDatasetSchema),
    description: S.optional(S.String),
    partitionSpec: S.optional(DataLakeDatasetPartitionSpec),
    tags: S.optional(TagMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDataLakeDatasetRequest",
}) as any as S.Schema<CreateDataLakeDatasetRequest>;
export interface GetDataIntegrationEventResponse {
  event: DataIntegrationEvent;
}
export const GetDataIntegrationEventResponse = S.suspend(() =>
  S.Struct({ event: DataIntegrationEvent }),
).annotations({
  identifier: "GetDataIntegrationEventResponse",
}) as any as S.Schema<GetDataIntegrationEventResponse>;
export interface GetDataIntegrationFlowExecutionResponse {
  flowExecution: DataIntegrationFlowExecution;
}
export const GetDataIntegrationFlowExecutionResponse = S.suspend(() =>
  S.Struct({ flowExecution: DataIntegrationFlowExecution }),
).annotations({
  identifier: "GetDataIntegrationFlowExecutionResponse",
}) as any as S.Schema<GetDataIntegrationFlowExecutionResponse>;
export interface CreateDataLakeDatasetResponse {
  dataset: DataLakeDataset;
}
export const CreateDataLakeDatasetResponse = S.suspend(() =>
  S.Struct({ dataset: DataLakeDataset }),
).annotations({
  identifier: "CreateDataLakeDatasetResponse",
}) as any as S.Schema<CreateDataLakeDatasetResponse>;
export interface CreateDataIntegrationFlowRequest {
  instanceId: string;
  name: string;
  sources: DataIntegrationFlowSource[];
  transformation: DataIntegrationFlowTransformation;
  target: DataIntegrationFlowTarget;
  tags?: { [key: string]: string };
}
export const CreateDataIntegrationFlowRequest = S.suspend(() =>
  S.Struct({
    instanceId: S.String.pipe(T.HttpLabel("instanceId")),
    name: S.String.pipe(T.HttpLabel("name")),
    sources: DataIntegrationFlowSourceList,
    transformation: DataIntegrationFlowTransformation,
    target: DataIntegrationFlowTarget,
    tags: S.optional(TagMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDataIntegrationFlowRequest",
}) as any as S.Schema<CreateDataIntegrationFlowRequest>;
export interface CreateDataIntegrationFlowResponse {
  instanceId: string;
  name: string;
}
export const CreateDataIntegrationFlowResponse = S.suspend(() =>
  S.Struct({ instanceId: S.String, name: S.String }),
).annotations({
  identifier: "CreateDataIntegrationFlowResponse",
}) as any as S.Schema<CreateDataIntegrationFlowResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Enable you to programmatically delete an existing data pipeline for the provided Amazon Web Services Supply Chain instance and DataIntegrationFlow name.
 */
export const deleteDataIntegrationFlow: (
  input: DeleteDataIntegrationFlowRequest,
) => effect.Effect<
  DeleteDataIntegrationFlowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataIntegrationFlowRequest,
  output: DeleteDataIntegrationFlowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Enables you to programmatically list all data pipelines for the provided Amazon Web Services Supply Chain instance.
 */
export const listDataIntegrationFlows: {
  (
    input: ListDataIntegrationFlowsRequest,
  ): effect.Effect<
    ListDataIntegrationFlowsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataIntegrationFlowsRequest,
  ) => stream.Stream<
    ListDataIntegrationFlowsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataIntegrationFlowsRequest,
  ) => stream.Stream<
    DataIntegrationFlow,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getBillOfMaterialsImportJob: (
  input: GetBillOfMaterialsImportJobRequest,
) => effect.Effect<
  GetBillOfMaterialsImportJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBillOfMaterialsImportJobRequest,
  output: GetBillOfMaterialsImportJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically view a specific data pipeline for the provided Amazon Web Services Supply Chain instance and DataIntegrationFlow name.
 */
export const getDataIntegrationFlow: (
  input: GetDataIntegrationFlowRequest,
) => effect.Effect<
  GetDataIntegrationFlowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataIntegrationFlowRequest,
  output: GetDataIntegrationFlowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically view an Amazon Web Services Supply Chain data lake dataset. Developers can view the data lake dataset information such as namespace, schema, and so on for a given instance ID, namespace, and dataset name.
 */
export const getDataLakeDataset: (
  input: GetDataLakeDatasetRequest,
) => effect.Effect<
  GetDataLakeDatasetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDataIntegrationFlow: (
  input: UpdateDataIntegrationFlowRequest,
) => effect.Effect<
  UpdateDataIntegrationFlowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataIntegrationFlowRequest,
  output: UpdateDataIntegrationFlowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically update an Amazon Web Services Supply Chain data lake dataset. Developers can update the description of a data lake dataset for a given instance ID, namespace, and dataset name.
 */
export const updateDataLakeDataset: (
  input: UpdateDataLakeDatasetRequest,
) => effect.Effect<
  UpdateDataLakeDatasetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataLakeDatasetRequest,
  output: UpdateDataLakeDatasetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically delete an Amazon Web Services Supply Chain data lake dataset. Developers can delete the existing datasets for a given instance ID, namespace, and instance name.
 */
export const deleteDataLakeDataset: (
  input: DeleteDataLakeDatasetRequest,
) => effect.Effect<
  DeleteDataLakeDatasetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataLakeDatasetRequest,
  output: DeleteDataLakeDatasetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically view the list of Amazon Web Services Supply Chain data lake datasets. Developers can view the datasets and the corresponding information such as namespace, schema, and so on for a given instance ID and namespace.
 */
export const listDataLakeDatasets: {
  (
    input: ListDataLakeDatasetsRequest,
  ): effect.Effect<
    ListDataLakeDatasetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataLakeDatasetsRequest,
  ) => stream.Stream<
    ListDataLakeDatasetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataLakeDatasetsRequest,
  ) => stream.Stream<
    DataLakeDataset,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getDataLakeNamespace: (
  input: GetDataLakeNamespaceRequest,
) => effect.Effect<
  GetDataLakeNamespaceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataLakeNamespaceRequest,
  output: GetDataLakeNamespaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically update an Amazon Web Services Supply Chain data lake namespace. Developers can update the description of a data lake namespace for a given instance ID and namespace name.
 */
export const updateDataLakeNamespace: (
  input: UpdateDataLakeNamespaceRequest,
) => effect.Effect<
  UpdateDataLakeNamespaceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataLakeNamespaceRequest,
  output: UpdateDataLakeNamespaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically delete an Amazon Web Services Supply Chain data lake namespace and its underling datasets. Developers can delete the existing namespaces for a given instance ID and namespace name.
 */
export const deleteDataLakeNamespace: (
  input: DeleteDataLakeNamespaceRequest,
) => effect.Effect<
  DeleteDataLakeNamespaceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataLakeNamespaceRequest,
  output: DeleteDataLakeNamespaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically retrieve the information related to an Amazon Web Services Supply Chain instance ID.
 */
export const getInstance: (
  input: GetInstanceRequest,
) => effect.Effect<
  GetInstanceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateInstance: (
  input: UpdateInstanceRequest,
) => effect.Effect<
  UpdateInstanceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteInstance: (
  input: DeleteInstanceRequest,
) => effect.Effect<
  DeleteInstanceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDataIntegrationFlowExecutions: {
  (
    input: ListDataIntegrationFlowExecutionsRequest,
  ): effect.Effect<
    ListDataIntegrationFlowExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataIntegrationFlowExecutionsRequest,
  ) => stream.Stream<
    ListDataIntegrationFlowExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataIntegrationFlowExecutionsRequest,
  ) => stream.Stream<
    DataIntegrationFlowExecution,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendDataIntegrationEvent: (
  input: SendDataIntegrationEventRequest,
) => effect.Effect<
  SendDataIntegrationEventResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Enables you to programmatically create an Amazon Web Services Supply Chain data lake namespace. Developers can create the namespaces for a given instance ID.
 */
export const createDataLakeNamespace: (
  input: CreateDataLakeNamespaceRequest,
) => effect.Effect<
  CreateDataLakeNamespaceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Enables you to programmatically create an Amazon Web Services Supply Chain instance by applying KMS keys and relevant information associated with the API without using the Amazon Web Services console.
 *
 * This is an asynchronous operation. Upon receiving a CreateInstance request, Amazon Web Services Supply Chain immediately returns the instance resource, instance ID, and the initializing state while simultaneously creating all required Amazon Web Services resources for an instance creation. You can use GetInstance to check the status of the instance. If the instance results in an unhealthy state, you need to check the error message, delete the current instance, and recreate a new one based on the mitigation from the error message.
 */
export const createInstance: (
  input: CreateInstanceRequest,
) => effect.Effect<
  CreateInstanceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDataLakeNamespaces: {
  (
    input: ListDataLakeNamespacesRequest,
  ): effect.Effect<
    ListDataLakeNamespacesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataLakeNamespacesRequest,
  ) => stream.Stream<
    ListDataLakeNamespacesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataLakeNamespacesRequest,
  ) => stream.Stream<
    DataLakeNamespace,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listInstances: {
  (
    input: ListInstancesRequest,
  ): effect.Effect<
    ListInstancesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstancesRequest,
  ) => stream.Stream<
    ListInstancesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstancesRequest,
  ) => stream.Stream<
    Instance,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Enables you to programmatically list all data integration events for the provided Amazon Web Services Supply Chain instance.
 */
export const listDataIntegrationEvents: {
  (
    input: ListDataIntegrationEventsRequest,
  ): effect.Effect<
    ListDataIntegrationEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataIntegrationEventsRequest,
  ) => stream.Stream<
    ListDataIntegrationEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataIntegrationEventsRequest,
  ) => stream.Stream<
    DataIntegrationEvent,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBillOfMaterialsImportJob: (
  input: CreateBillOfMaterialsImportJobRequest,
) => effect.Effect<
  CreateBillOfMaterialsImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataIntegrationEvent: (
  input: GetDataIntegrationEventRequest,
) => effect.Effect<
  GetDataIntegrationEventResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataIntegrationEventRequest,
  output: GetDataIntegrationEventResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the flow execution.
 */
export const getDataIntegrationFlowExecution: (
  input: GetDataIntegrationFlowExecutionRequest,
) => effect.Effect<
  GetDataIntegrationFlowExecutionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataLakeDataset: (
  input: CreateDataLakeDatasetRequest,
) => effect.Effect<
  CreateDataLakeDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Enables you to programmatically create a data pipeline to ingest data from source systems such as Amazon S3 buckets, to a predefined Amazon Web Services Supply Chain dataset (product, inbound_order) or a temporary dataset along with the data transformation query provided with the API.
 */
export const createDataIntegrationFlow: (
  input: CreateDataIntegrationFlowRequest,
) => effect.Effect<
  CreateDataIntegrationFlowResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
