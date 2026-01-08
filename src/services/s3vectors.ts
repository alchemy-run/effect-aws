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
  sdkId: "S3Vectors",
  serviceShapeName: "S3Vectors",
});
const auth = T.AwsAuthSigv4({ name: "s3vectors" });
const ver = T.ServiceVersion("2025-07-15");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://s3vectors-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://s3vectors.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceARN = string;
export type TagKey = string;
export type VectorBucketName = string;
export type VectorBucketArn = string;
export type ListVectorBucketsMaxResults = number;
export type ListVectorBucketsNextToken = string;
export type ListVectorBucketsPrefix = string;
export type VectorBucketPolicy = string;
export type IndexName = string;
export type Dimension = number;
export type IndexArn = string;
export type ListIndexesMaxResults = number;
export type ListIndexesNextToken = string;
export type ListIndexesPrefix = string;
export type VectorKey = string;
export type ListVectorsMaxResults = number;
export type ListVectorsNextToken = string;
export type ListVectorsSegmentCount = number;
export type ListVectorsSegmentIndex = number;
export type TopK = number;
export type TagValue = string;
export type KmsKeyArn = string;
export type MetadataKey = string;
export type VectorMetadata = unknown;
export type ExceptionMessage = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type DataType = "float32";
export const DataType = S.Literal("float32");
export type DistanceMetric = "euclidean" | "cosine";
export const DistanceMetric = S.Literal("euclidean", "cosine");
export type DeleteVectorsInputList = string[];
export const DeleteVectorsInputList = S.Array(S.String);
export type GetVectorsInputList = string[];
export const GetVectorsInputList = S.Array(S.String);
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
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface DeleteVectorBucketInput {
  vectorBucketName?: string;
  vectorBucketArn?: string;
}
export const DeleteVectorBucketInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteVectorBucket" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVectorBucketInput",
}) as any as S.Schema<DeleteVectorBucketInput>;
export interface DeleteVectorBucketOutput {}
export const DeleteVectorBucketOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVectorBucketOutput",
}) as any as S.Schema<DeleteVectorBucketOutput>;
export interface DeleteVectorBucketPolicyInput {
  vectorBucketName?: string;
  vectorBucketArn?: string;
}
export const DeleteVectorBucketPolicyInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteVectorBucketPolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVectorBucketPolicyInput",
}) as any as S.Schema<DeleteVectorBucketPolicyInput>;
export interface DeleteVectorBucketPolicyOutput {}
export const DeleteVectorBucketPolicyOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVectorBucketPolicyOutput",
}) as any as S.Schema<DeleteVectorBucketPolicyOutput>;
export interface GetVectorBucketInput {
  vectorBucketName?: string;
  vectorBucketArn?: string;
}
export const GetVectorBucketInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetVectorBucket" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVectorBucketInput",
}) as any as S.Schema<GetVectorBucketInput>;
export interface GetVectorBucketPolicyInput {
  vectorBucketName?: string;
  vectorBucketArn?: string;
}
export const GetVectorBucketPolicyInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetVectorBucketPolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVectorBucketPolicyInput",
}) as any as S.Schema<GetVectorBucketPolicyInput>;
export interface ListVectorBucketsInput {
  maxResults?: number;
  nextToken?: string;
  prefix?: string;
}
export const ListVectorBucketsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    prefix: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListVectorBuckets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVectorBucketsInput",
}) as any as S.Schema<ListVectorBucketsInput>;
export interface PutVectorBucketPolicyInput {
  vectorBucketName?: string;
  vectorBucketArn?: string;
  policy: string;
}
export const PutVectorBucketPolicyInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
    policy: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutVectorBucketPolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutVectorBucketPolicyInput",
}) as any as S.Schema<PutVectorBucketPolicyInput>;
export interface PutVectorBucketPolicyOutput {}
export const PutVectorBucketPolicyOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutVectorBucketPolicyOutput",
}) as any as S.Schema<PutVectorBucketPolicyOutput>;
export interface DeleteIndexInput {
  vectorBucketName?: string;
  indexName?: string;
  indexArn?: string;
}
export const DeleteIndexInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteIndex" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIndexInput",
}) as any as S.Schema<DeleteIndexInput>;
export interface DeleteIndexOutput {}
export const DeleteIndexOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteIndexOutput",
}) as any as S.Schema<DeleteIndexOutput>;
export interface GetIndexInput {
  vectorBucketName?: string;
  indexName?: string;
  indexArn?: string;
}
export const GetIndexInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetIndex" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIndexInput",
}) as any as S.Schema<GetIndexInput>;
export interface ListIndexesInput {
  vectorBucketName?: string;
  vectorBucketArn?: string;
  maxResults?: number;
  nextToken?: string;
  prefix?: string;
}
export const ListIndexesInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    prefix: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListIndexes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIndexesInput",
}) as any as S.Schema<ListIndexesInput>;
export interface DeleteVectorsInput {
  vectorBucketName?: string;
  indexName?: string;
  indexArn?: string;
  keys: string[];
}
export const DeleteVectorsInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    keys: DeleteVectorsInputList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteVectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVectorsInput",
}) as any as S.Schema<DeleteVectorsInput>;
export interface DeleteVectorsOutput {}
export const DeleteVectorsOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteVectorsOutput",
}) as any as S.Schema<DeleteVectorsOutput>;
export interface GetVectorsInput {
  vectorBucketName?: string;
  indexName?: string;
  indexArn?: string;
  keys: string[];
  returnData?: boolean;
  returnMetadata?: boolean;
}
export const GetVectorsInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    keys: GetVectorsInputList,
    returnData: S.optional(S.Boolean),
    returnMetadata: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetVectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVectorsInput",
}) as any as S.Schema<GetVectorsInput>;
export interface ListVectorsInput {
  vectorBucketName?: string;
  indexName?: string;
  indexArn?: string;
  maxResults?: number;
  nextToken?: string;
  segmentCount?: number;
  segmentIndex?: number;
  returnData?: boolean;
  returnMetadata?: boolean;
}
export const ListVectorsInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    segmentCount: S.optional(S.Number),
    segmentIndex: S.optional(S.Number),
    returnData: S.optional(S.Boolean),
    returnMetadata: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListVectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVectorsInput",
}) as any as S.Schema<ListVectorsInput>;
export type SseType = "AES256" | "aws:kms";
export const SseType = S.Literal("AES256", "aws:kms");
export type NonFilterableMetadataKeys = string[];
export const NonFilterableMetadataKeys = S.Array(S.String);
export type Float32VectorData = number[];
export const Float32VectorData = S.Array(S.Number);
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface EncryptionConfiguration {
  sseType?: SseType;
  kmsKeyArn?: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ sseType: S.optional(SseType), kmsKeyArn: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface MetadataConfiguration {
  nonFilterableMetadataKeys: string[];
}
export const MetadataConfiguration = S.suspend(() =>
  S.Struct({ nonFilterableMetadataKeys: NonFilterableMetadataKeys }),
).annotations({
  identifier: "MetadataConfiguration",
}) as any as S.Schema<MetadataConfiguration>;
export type VectorData = { float32: number[] };
export const VectorData = S.Union(S.Struct({ float32: Float32VectorData }));
export interface PutInputVector {
  key: string;
  data: VectorData;
  metadata?: any;
}
export const PutInputVector = S.suspend(() =>
  S.Struct({ key: S.String, data: VectorData, metadata: S.optional(S.Any) }),
).annotations({
  identifier: "PutInputVector",
}) as any as S.Schema<PutInputVector>;
export type PutVectorsInputList = PutInputVector[];
export const PutVectorsInputList = S.Array(PutInputVector);
export interface ListTagsForResourceOutput {
  tags: { [key: string]: string };
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: TagsMap }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagsMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface CreateVectorBucketInput {
  vectorBucketName: string;
  encryptionConfiguration?: EncryptionConfiguration;
  tags?: { [key: string]: string };
}
export const CreateVectorBucketInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.String,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateVectorBucket" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVectorBucketInput",
}) as any as S.Schema<CreateVectorBucketInput>;
export interface GetVectorBucketPolicyOutput {
  policy?: string;
}
export const GetVectorBucketPolicyOutput = S.suspend(() =>
  S.Struct({ policy: S.optional(S.String) }),
).annotations({
  identifier: "GetVectorBucketPolicyOutput",
}) as any as S.Schema<GetVectorBucketPolicyOutput>;
export interface CreateIndexInput {
  vectorBucketName?: string;
  vectorBucketArn?: string;
  indexName: string;
  dataType: DataType;
  dimension: number;
  distanceMetric: DistanceMetric;
  metadataConfiguration?: MetadataConfiguration;
  encryptionConfiguration?: EncryptionConfiguration;
  tags?: { [key: string]: string };
}
export const CreateIndexInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
    indexName: S.String,
    dataType: DataType,
    dimension: S.Number,
    distanceMetric: DistanceMetric,
    metadataConfiguration: S.optional(MetadataConfiguration),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateIndex" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIndexInput",
}) as any as S.Schema<CreateIndexInput>;
export interface PutVectorsInput {
  vectorBucketName?: string;
  indexName?: string;
  indexArn?: string;
  vectors: PutInputVector[];
}
export const PutVectorsInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    vectors: PutVectorsInputList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutVectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutVectorsInput",
}) as any as S.Schema<PutVectorsInput>;
export interface PutVectorsOutput {}
export const PutVectorsOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutVectorsOutput",
}) as any as S.Schema<PutVectorsOutput>;
export interface QueryVectorsInput {
  vectorBucketName?: string;
  indexName?: string;
  indexArn?: string;
  topK: number;
  queryVector: VectorData;
  filter?: any;
  returnMetadata?: boolean;
  returnDistance?: boolean;
}
export const QueryVectorsInput = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    topK: S.Number,
    queryVector: VectorData,
    filter: S.optional(S.Any),
    returnMetadata: S.optional(S.Boolean),
    returnDistance: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/QueryVectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "QueryVectorsInput",
}) as any as S.Schema<QueryVectorsInput>;
export interface VectorBucket {
  vectorBucketName: string;
  vectorBucketArn: string;
  creationTime: Date;
  encryptionConfiguration?: EncryptionConfiguration;
}
export const VectorBucket = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.String,
    vectorBucketArn: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  }),
).annotations({ identifier: "VectorBucket" }) as any as S.Schema<VectorBucket>;
export interface VectorBucketSummary {
  vectorBucketName: string;
  vectorBucketArn: string;
  creationTime: Date;
}
export const VectorBucketSummary = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.String,
    vectorBucketArn: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "VectorBucketSummary",
}) as any as S.Schema<VectorBucketSummary>;
export type ListVectorBucketsOutputList = VectorBucketSummary[];
export const ListVectorBucketsOutputList = S.Array(VectorBucketSummary);
export interface Index {
  vectorBucketName: string;
  indexName: string;
  indexArn: string;
  creationTime: Date;
  dataType: DataType;
  dimension: number;
  distanceMetric: DistanceMetric;
  metadataConfiguration?: MetadataConfiguration;
  encryptionConfiguration?: EncryptionConfiguration;
}
export const Index = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.String,
    indexName: S.String,
    indexArn: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    dataType: DataType,
    dimension: S.Number,
    distanceMetric: DistanceMetric,
    metadataConfiguration: S.optional(MetadataConfiguration),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  }),
).annotations({ identifier: "Index" }) as any as S.Schema<Index>;
export interface IndexSummary {
  vectorBucketName: string;
  indexName: string;
  indexArn: string;
  creationTime: Date;
}
export const IndexSummary = S.suspend(() =>
  S.Struct({
    vectorBucketName: S.String,
    indexName: S.String,
    indexArn: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "IndexSummary" }) as any as S.Schema<IndexSummary>;
export type ListIndexesOutputList = IndexSummary[];
export const ListIndexesOutputList = S.Array(IndexSummary);
export interface GetOutputVector {
  key: string;
  data?: VectorData;
  metadata?: any;
}
export const GetOutputVector = S.suspend(() =>
  S.Struct({
    key: S.String,
    data: S.optional(VectorData),
    metadata: S.optional(S.Any),
  }),
).annotations({
  identifier: "GetOutputVector",
}) as any as S.Schema<GetOutputVector>;
export type GetVectorsOutputList = GetOutputVector[];
export const GetVectorsOutputList = S.Array(GetOutputVector);
export interface ListOutputVector {
  key: string;
  data?: VectorData;
  metadata?: any;
}
export const ListOutputVector = S.suspend(() =>
  S.Struct({
    key: S.String,
    data: S.optional(VectorData),
    metadata: S.optional(S.Any),
  }),
).annotations({
  identifier: "ListOutputVector",
}) as any as S.Schema<ListOutputVector>;
export type ListVectorsOutputList = ListOutputVector[];
export const ListVectorsOutputList = S.Array(ListOutputVector);
export interface CreateVectorBucketOutput {
  vectorBucketArn: string;
}
export const CreateVectorBucketOutput = S.suspend(() =>
  S.Struct({ vectorBucketArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateVectorBucketOutput",
}) as any as S.Schema<CreateVectorBucketOutput>;
export interface GetVectorBucketOutput {
  vectorBucket: VectorBucket;
}
export const GetVectorBucketOutput = S.suspend(() =>
  S.Struct({ vectorBucket: VectorBucket }),
).annotations({
  identifier: "GetVectorBucketOutput",
}) as any as S.Schema<GetVectorBucketOutput>;
export interface ListVectorBucketsOutput {
  nextToken?: string;
  vectorBuckets: VectorBucketSummary[];
}
export const ListVectorBucketsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    vectorBuckets: ListVectorBucketsOutputList,
  }),
).annotations({
  identifier: "ListVectorBucketsOutput",
}) as any as S.Schema<ListVectorBucketsOutput>;
export interface CreateIndexOutput {
  indexArn: string;
}
export const CreateIndexOutput = S.suspend(() =>
  S.Struct({ indexArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateIndexOutput",
}) as any as S.Schema<CreateIndexOutput>;
export interface GetIndexOutput {
  index: Index;
}
export const GetIndexOutput = S.suspend(() =>
  S.Struct({ index: Index }),
).annotations({
  identifier: "GetIndexOutput",
}) as any as S.Schema<GetIndexOutput>;
export interface ListIndexesOutput {
  nextToken?: string;
  indexes: IndexSummary[];
}
export const ListIndexesOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), indexes: ListIndexesOutputList }),
).annotations({
  identifier: "ListIndexesOutput",
}) as any as S.Schema<ListIndexesOutput>;
export interface GetVectorsOutput {
  vectors: GetOutputVector[];
}
export const GetVectorsOutput = S.suspend(() =>
  S.Struct({ vectors: GetVectorsOutputList }),
).annotations({
  identifier: "GetVectorsOutput",
}) as any as S.Schema<GetVectorsOutput>;
export interface ListVectorsOutput {
  nextToken?: string;
  vectors: ListOutputVector[];
}
export const ListVectorsOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), vectors: ListVectorsOutputList }),
).annotations({
  identifier: "ListVectorsOutput",
}) as any as S.Schema<ListVectorsOutput>;
export interface QueryOutputVector {
  distance?: number;
  key: string;
  metadata?: any;
}
export const QueryOutputVector = S.suspend(() =>
  S.Struct({
    distance: S.optional(S.Number),
    key: S.String,
    metadata: S.optional(S.Any),
  }),
).annotations({
  identifier: "QueryOutputVector",
}) as any as S.Schema<QueryOutputVector>;
export type QueryVectorsOutputList = QueryOutputVector[];
export const QueryVectorsOutputList = S.Array(QueryOutputVector);
export interface QueryVectorsOutput {
  vectors: QueryOutputVector[];
  distanceMetric: DistanceMetric;
}
export const QueryVectorsOutput = S.suspend(() =>
  S.Struct({
    vectors: QueryVectorsOutputList,
    distanceMetric: S.optional(DistanceMetric),
  }),
).annotations({
  identifier: "QueryVectorsOutput",
}) as any as S.Schema<QueryVectorsOutput>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class KmsDisabledException extends S.TaggedError<KmsDisabledException>()(
  "KmsDisabledException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class KmsInvalidKeyUsageException extends S.TaggedError<KmsInvalidKeyUsageException>()(
  "KmsInvalidKeyUsageException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class KmsInvalidStateException extends S.TaggedError<KmsInvalidStateException>()(
  "KmsInvalidStateException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class KmsNotFoundException extends S.TaggedError<KmsNotFoundException>()(
  "KmsNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes a vector bucket policy. To specify the bucket, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:DeleteVectorBucketPolicy` permission to use this operation.
 */
export const deleteVectorBucketPolicy: (
  input: DeleteVectorBucketPolicyInput,
) => effect.Effect<
  DeleteVectorBucketPolicyOutput,
  NotFoundException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVectorBucketPolicyInput,
  output: DeleteVectorBucketPolicyOutput,
  errors: [NotFoundException, ServiceUnavailableException],
}));
/**
 * Returns vector bucket attributes. To specify the bucket, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:GetVectorBucket` permission to use this operation.
 */
export const getVectorBucket: (
  input: GetVectorBucketInput,
) => effect.Effect<
  GetVectorBucketOutput,
  NotFoundException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVectorBucketInput,
  output: GetVectorBucketOutput,
  errors: [NotFoundException, ServiceUnavailableException],
}));
/**
 * Returns a list of all the vector buckets that are owned by the authenticated sender of the request.
 *
 * ### Permissions
 *
 * You must have the `s3vectors:ListVectorBuckets` permission to use this operation.
 */
export const listVectorBuckets: {
  (
    input: ListVectorBucketsInput,
  ): effect.Effect<
    ListVectorBucketsOutput,
    ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVectorBucketsInput,
  ) => stream.Stream<
    ListVectorBucketsOutput,
    ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVectorBucketsInput,
  ) => stream.Stream<
    VectorBucketSummary,
    ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVectorBucketsInput,
  output: ListVectorBucketsOutput,
  errors: [ServiceUnavailableException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "vectorBuckets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns vector index attributes. To specify the vector index, you can either use both the vector bucket name and the vector index name, or use the vector index Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:GetIndex` permission to use this operation.
 */
export const getIndex: (
  input: GetIndexInput,
) => effect.Effect<
  GetIndexOutput,
  NotFoundException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexInput,
  output: GetIndexOutput,
  errors: [NotFoundException, ServiceUnavailableException],
}));
/**
 * Returns a list of all the vector indexes within the specified vector bucket. To specify the bucket, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:ListIndexes` permission to use this operation.
 */
export const listIndexes: {
  (
    input: ListIndexesInput,
  ): effect.Effect<
    ListIndexesOutput,
    NotFoundException | ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIndexesInput,
  ) => stream.Stream<
    ListIndexesOutput,
    NotFoundException | ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIndexesInput,
  ) => stream.Stream<
    IndexSummary,
    NotFoundException | ServiceUnavailableException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIndexesInput,
  output: ListIndexesOutput,
  errors: [NotFoundException, ServiceUnavailableException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "indexes",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List vectors in the specified vector index. To specify the vector index, you can either use both the vector bucket name and the vector index name, or use the vector index Amazon Resource Name (ARN).
 *
 * `ListVectors` operations proceed sequentially; however, for faster performance on a large number of vectors in a vector index, applications can request a parallel `ListVectors` operation by providing the `segmentCount` and `segmentIndex` parameters.
 *
 * ### Permissions
 *
 * You must have the `s3vectors:ListVectors` permission to use this operation. Additional permissions are required based on the request parameters you specify:
 *
 * - With only `s3vectors:ListVectors` permission, you can list vector keys when `returnData` and `returnMetadata` are both set to false or not specified..
 *
 * - If you set `returnData` or `returnMetadata` to true, you must have both `s3vectors:ListVectors` and `s3vectors:GetVectors` permissions. The request fails with a `403 Forbidden` error if you request vector data or metadata without the `s3vectors:GetVectors` permission.
 */
export const listVectors: {
  (
    input: ListVectorsInput,
  ): effect.Effect<
    ListVectorsOutput,
    | AccessDeniedException
    | NotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVectorsInput,
  ) => stream.Stream<
    ListVectorsOutput,
    | AccessDeniedException
    | NotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVectorsInput,
  ) => stream.Stream<
    ListOutputVector,
    | AccessDeniedException
    | NotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVectorsInput,
  output: ListVectorsOutput,
  errors: [
    AccessDeniedException,
    NotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "vectors",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets details about a vector bucket policy. To specify the bucket, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:GetVectorBucketPolicy` permission to use this operation.
 */
export const getVectorBucketPolicy: (
  input: GetVectorBucketPolicyInput,
) => effect.Effect<
  GetVectorBucketPolicyOutput,
  NotFoundException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVectorBucketPolicyInput,
  output: GetVectorBucketPolicyOutput,
  errors: [NotFoundException, ServiceUnavailableException],
}));
/**
 * Deletes a vector bucket. All vector indexes in the vector bucket must be deleted before the vector bucket can be deleted. To perform this operation, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:DeleteVectorBucket` permission to use this operation.
 */
export const deleteVectorBucket: (
  input: DeleteVectorBucketInput,
) => effect.Effect<
  DeleteVectorBucketOutput,
  | ConflictException
  | NotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVectorBucketInput,
  output: DeleteVectorBucketOutput,
  errors: [ConflictException, NotFoundException, ServiceUnavailableException],
}));
/**
 * Applies one or more user-defined tags to an Amazon S3 Vectors resource or updates existing tags. Each tag is a label consisting of a key and value pair. Tags can help you organize, track costs for, and control access to your resources. You can add up to 50 tags for each resource.
 *
 * For a list of S3 resources that support tagging, see Managing tags for Amazon S3 resources.
 *
 * ### Permissions
 *
 * For vector buckets and vector indexes, you must have the `s3vectors:TagResource` permission to use this operation.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  | ConflictException
  | NotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [ConflictException, NotFoundException, ServiceUnavailableException],
}));
/**
 * Creates a bucket policy for a vector bucket. To specify the bucket, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:PutVectorBucketPolicy` permission to use this operation.
 */
export const putVectorBucketPolicy: (
  input: PutVectorBucketPolicyInput,
) => effect.Effect<
  PutVectorBucketPolicyOutput,
  NotFoundException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutVectorBucketPolicyInput,
  output: PutVectorBucketPolicyOutput,
  errors: [NotFoundException, ServiceUnavailableException],
}));
/**
 * Deletes a vector index. To specify the vector index, you can either use both the vector bucket name and vector index name, or use the vector index Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:DeleteIndex` permission to use this operation.
 */
export const deleteIndex: (
  input: DeleteIndexInput,
) => effect.Effect<
  DeleteIndexOutput,
  NotFoundException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexInput,
  output: DeleteIndexOutput,
  errors: [NotFoundException, ServiceUnavailableException],
}));
/**
 * Lists all of the tags applied to a specified Amazon S3 Vectors resource. Each tag is a label consisting of a key and value pair. Tags can help you organize, track costs for, and control access to resources.
 *
 * For a list of S3 resources that support tagging, see Managing tags for Amazon S3 resources.
 *
 * ### Permissions
 *
 * For vector buckets and vector indexes, you must have the `s3vectors:ListTagsForResource` permission to use this operation.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  NotFoundException | ServiceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [NotFoundException, ServiceUnavailableException],
}));
/**
 * Removes the specified user-defined tags from an Amazon S3 Vectors resource. You can pass one or more tag keys.
 *
 * For a list of S3 resources that support tagging, see Managing tags for Amazon S3 resources.
 *
 * ### Permissions
 *
 * For vector buckets and vector indexes, you must have the `s3vectors:UntagResource` permission to use this operation.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  | ConflictException
  | NotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [ConflictException, NotFoundException, ServiceUnavailableException],
}));
/**
 * Creates a vector bucket in the Amazon Web Services Region that you want your bucket to be in.
 *
 * ### Permissions
 *
 * You must have the `s3vectors:CreateVectorBucket` permission to use this operation.
 *
 * You must have the `s3vectors:TagResource` permission in addition to `s3vectors:CreateVectorBucket` permission to create a vector bucket with tags.
 */
export const createVectorBucket: (
  input: CreateVectorBucketInput,
) => effect.Effect<
  CreateVectorBucketOutput,
  | ConflictException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVectorBucketInput,
  output: CreateVectorBucketOutput,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a vector index within a vector bucket. To specify the vector bucket, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:CreateIndex` permission to use this operation.
 *
 * You must have the `s3vectors:TagResource` permission in addition to `s3vectors:CreateIndex` permission to create a vector index with tags.
 */
export const createIndex: (
  input: CreateIndexInput,
) => effect.Effect<
  CreateIndexOutput,
  | ConflictException
  | NotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexInput,
  output: CreateIndexOutput,
  errors: [
    ConflictException,
    NotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes one or more vectors in a vector index. To specify the vector index, you can either use both the vector bucket name and vector index name, or use the vector index Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:DeleteVectors` permission to use this operation.
 */
export const deleteVectors: (
  input: DeleteVectorsInput,
) => effect.Effect<
  DeleteVectorsOutput,
  | AccessDeniedException
  | KmsDisabledException
  | KmsInvalidKeyUsageException
  | KmsInvalidStateException
  | KmsNotFoundException
  | NotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVectorsInput,
  output: DeleteVectorsOutput,
  errors: [
    AccessDeniedException,
    KmsDisabledException,
    KmsInvalidKeyUsageException,
    KmsInvalidStateException,
    KmsNotFoundException,
    NotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Performs an approximate nearest neighbor search query in a vector index using a query vector. By default, it returns the keys of approximate nearest neighbors. You can optionally include the computed distance (between the query vector and each vector in the response), the vector data, and metadata of each vector in the response.
 *
 * To specify the vector index, you can either use both the vector bucket name and the vector index name, or use the vector index Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:QueryVectors` permission to use this operation. Additional permissions are required based on the request parameters you specify:
 *
 * - With only `s3vectors:QueryVectors` permission, you can retrieve vector keys of approximate nearest neighbors and computed distances between these vectors. This permission is sufficient only when you don't set any metadata filters and don't request vector data or metadata (by keeping the `returnMetadata` parameter set to `false` or not specified).
 *
 * - If you specify a metadata filter or set `returnMetadata` to true, you must have both `s3vectors:QueryVectors` and `s3vectors:GetVectors` permissions. The request fails with a `403 Forbidden error` if you request metadata filtering, vector data, or metadata without the `s3vectors:GetVectors` permission.
 */
export const queryVectors: (
  input: QueryVectorsInput,
) => effect.Effect<
  QueryVectorsOutput,
  | KmsDisabledException
  | KmsInvalidKeyUsageException
  | KmsInvalidStateException
  | KmsNotFoundException
  | NotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: QueryVectorsInput,
  output: QueryVectorsOutput,
  errors: [
    KmsDisabledException,
    KmsInvalidKeyUsageException,
    KmsInvalidStateException,
    KmsNotFoundException,
    NotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns vector attributes. To specify the vector index, you can either use both the vector bucket name and the vector index name, or use the vector index Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:GetVectors` permission to use this operation.
 */
export const getVectors: (
  input: GetVectorsInput,
) => effect.Effect<
  GetVectorsOutput,
  | KmsDisabledException
  | KmsInvalidKeyUsageException
  | KmsInvalidStateException
  | KmsNotFoundException
  | NotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVectorsInput,
  output: GetVectorsOutput,
  errors: [
    KmsDisabledException,
    KmsInvalidKeyUsageException,
    KmsInvalidStateException,
    KmsNotFoundException,
    NotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Adds one or more vectors to a vector index. To specify the vector index, you can either use both the vector bucket name and the vector index name, or use the vector index Amazon Resource Name (ARN).
 *
 * For more information about limits, see Limitations and restrictions in the *Amazon S3 User Guide*.
 *
 * When inserting vector data into your vector index, you must provide the vector data as `float32` (32-bit floating point) values. If you pass higher-precision values to an Amazon Web Services SDK, S3 Vectors converts the values to 32-bit floating point before storing them, and `GetVectors`, `ListVectors`, and `QueryVectors` operations return the float32 values. Different Amazon Web Services SDKs may have different default numeric types, so ensure your vectors are properly formatted as `float32` values regardless of which SDK you're using. For example, in Python, use `numpy.float32` or explicitly cast your values.
 *
 * ### Permissions
 *
 * You must have the `s3vectors:PutVectors` permission to use this operation.
 */
export const putVectors: (
  input: PutVectorsInput,
) => effect.Effect<
  PutVectorsOutput,
  | AccessDeniedException
  | KmsDisabledException
  | KmsInvalidKeyUsageException
  | KmsInvalidStateException
  | KmsNotFoundException
  | NotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutVectorsInput,
  output: PutVectorsOutput,
  errors: [
    AccessDeniedException,
    KmsDisabledException,
    KmsInvalidKeyUsageException,
    KmsInvalidStateException,
    KmsNotFoundException,
    NotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
  ],
}));
