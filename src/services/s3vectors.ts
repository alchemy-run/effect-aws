import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "S3Vectors",
  serviceShapeName: "S3Vectors",
});
const auth = T.AwsAuthSigv4({ name: "s3vectors" });
const ver = T.ServiceVersion("2025-07-15");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
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
                  ],
                  endpoint: {
                    url: "https://s3vectors-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://s3vectors.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
export const DeleteVectorsInputList = S.Array(S.String);
export const GetVectorsInputList = S.Array(S.String);
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
  ),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class DeleteVectorBucketInput extends S.Class<DeleteVectorBucketInput>(
  "DeleteVectorBucketInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteVectorBucket" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVectorBucketOutput extends S.Class<DeleteVectorBucketOutput>(
  "DeleteVectorBucketOutput",
)({}) {}
export class DeleteVectorBucketPolicyInput extends S.Class<DeleteVectorBucketPolicyInput>(
  "DeleteVectorBucketPolicyInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteVectorBucketPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVectorBucketPolicyOutput extends S.Class<DeleteVectorBucketPolicyOutput>(
  "DeleteVectorBucketPolicyOutput",
)({}) {}
export class GetVectorBucketInput extends S.Class<GetVectorBucketInput>(
  "GetVectorBucketInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetVectorBucket" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVectorBucketPolicyInput extends S.Class<GetVectorBucketPolicyInput>(
  "GetVectorBucketPolicyInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetVectorBucketPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVectorBucketsInput extends S.Class<ListVectorBucketsInput>(
  "ListVectorBucketsInput",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    prefix: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListVectorBuckets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVectorBucketPolicyInput extends S.Class<PutVectorBucketPolicyInput>(
  "PutVectorBucketPolicyInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
    policy: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutVectorBucketPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVectorBucketPolicyOutput extends S.Class<PutVectorBucketPolicyOutput>(
  "PutVectorBucketPolicyOutput",
)({}) {}
export class DeleteIndexInput extends S.Class<DeleteIndexInput>(
  "DeleteIndexInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteIndex" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIndexOutput extends S.Class<DeleteIndexOutput>(
  "DeleteIndexOutput",
)({}) {}
export class GetIndexInput extends S.Class<GetIndexInput>("GetIndexInput")(
  {
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetIndex" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIndexesInput extends S.Class<ListIndexesInput>(
  "ListIndexesInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    prefix: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListIndexes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVectorsInput extends S.Class<DeleteVectorsInput>(
  "DeleteVectorsInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    keys: DeleteVectorsInputList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteVectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVectorsOutput extends S.Class<DeleteVectorsOutput>(
  "DeleteVectorsOutput",
)({}) {}
export class GetVectorsInput extends S.Class<GetVectorsInput>(
  "GetVectorsInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    keys: GetVectorsInputList,
    returnData: S.optional(S.Boolean),
    returnMetadata: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetVectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVectorsInput extends S.Class<ListVectorsInput>(
  "ListVectorsInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    segmentCount: S.optional(S.Number),
    segmentIndex: S.optional(S.Number),
    returnData: S.optional(S.Boolean),
    returnMetadata: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListVectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const NonFilterableMetadataKeys = S.Array(S.String);
export const Float32VectorData = S.Array(S.Number);
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ sseType: S.optional(S.String), kmsKeyArn: S.optional(S.String) }) {}
export class MetadataConfiguration extends S.Class<MetadataConfiguration>(
  "MetadataConfiguration",
)({ nonFilterableMetadataKeys: NonFilterableMetadataKeys }) {}
export const VectorData = S.Union(S.Struct({ float32: Float32VectorData }));
export class PutInputVector extends S.Class<PutInputVector>("PutInputVector")({
  key: S.String,
  data: VectorData,
  metadata: S.optional(S.Any),
}) {}
export const PutVectorsInputList = S.Array(PutInputVector);
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: TagsMap }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagsMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class CreateVectorBucketInput extends S.Class<CreateVectorBucketInput>(
  "CreateVectorBucketInput",
)(
  {
    vectorBucketName: S.String,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateVectorBucket" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVectorBucketPolicyOutput extends S.Class<GetVectorBucketPolicyOutput>(
  "GetVectorBucketPolicyOutput",
)({ policy: S.optional(S.String) }) {}
export class CreateIndexInput extends S.Class<CreateIndexInput>(
  "CreateIndexInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    vectorBucketArn: S.optional(S.String),
    indexName: S.String,
    dataType: S.String,
    dimension: S.Number,
    distanceMetric: S.String,
    metadataConfiguration: S.optional(MetadataConfiguration),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateIndex" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVectorsInput extends S.Class<PutVectorsInput>(
  "PutVectorsInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    vectors: PutVectorsInputList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutVectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVectorsOutput extends S.Class<PutVectorsOutput>(
  "PutVectorsOutput",
)({}) {}
export class QueryVectorsInput extends S.Class<QueryVectorsInput>(
  "QueryVectorsInput",
)(
  {
    vectorBucketName: S.optional(S.String),
    indexName: S.optional(S.String),
    indexArn: S.optional(S.String),
    topK: S.Number,
    queryVector: VectorData,
    filter: S.optional(S.Any),
    returnMetadata: S.optional(S.Boolean),
    returnDistance: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/QueryVectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VectorBucket extends S.Class<VectorBucket>("VectorBucket")({
  vectorBucketName: S.String,
  vectorBucketArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  encryptionConfiguration: S.optional(EncryptionConfiguration),
}) {}
export class VectorBucketSummary extends S.Class<VectorBucketSummary>(
  "VectorBucketSummary",
)({
  vectorBucketName: S.String,
  vectorBucketArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ListVectorBucketsOutputList = S.Array(VectorBucketSummary);
export class Index extends S.Class<Index>("Index")({
  vectorBucketName: S.String,
  indexName: S.String,
  indexArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  dataType: S.String,
  dimension: S.Number,
  distanceMetric: S.String,
  metadataConfiguration: S.optional(MetadataConfiguration),
  encryptionConfiguration: S.optional(EncryptionConfiguration),
}) {}
export class IndexSummary extends S.Class<IndexSummary>("IndexSummary")({
  vectorBucketName: S.String,
  indexName: S.String,
  indexArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ListIndexesOutputList = S.Array(IndexSummary);
export class GetOutputVector extends S.Class<GetOutputVector>(
  "GetOutputVector",
)({
  key: S.String,
  data: S.optional(VectorData),
  metadata: S.optional(S.Any),
}) {}
export const GetVectorsOutputList = S.Array(GetOutputVector);
export class ListOutputVector extends S.Class<ListOutputVector>(
  "ListOutputVector",
)({
  key: S.String,
  data: S.optional(VectorData),
  metadata: S.optional(S.Any),
}) {}
export const ListVectorsOutputList = S.Array(ListOutputVector);
export class CreateVectorBucketOutput extends S.Class<CreateVectorBucketOutput>(
  "CreateVectorBucketOutput",
)({ vectorBucketArn: S.String }) {}
export class GetVectorBucketOutput extends S.Class<GetVectorBucketOutput>(
  "GetVectorBucketOutput",
)({ vectorBucket: VectorBucket }) {}
export class ListVectorBucketsOutput extends S.Class<ListVectorBucketsOutput>(
  "ListVectorBucketsOutput",
)({
  nextToken: S.optional(S.String),
  vectorBuckets: ListVectorBucketsOutputList,
}) {}
export class CreateIndexOutput extends S.Class<CreateIndexOutput>(
  "CreateIndexOutput",
)({ indexArn: S.String }) {}
export class GetIndexOutput extends S.Class<GetIndexOutput>("GetIndexOutput")({
  index: Index,
}) {}
export class ListIndexesOutput extends S.Class<ListIndexesOutput>(
  "ListIndexesOutput",
)({ nextToken: S.optional(S.String), indexes: ListIndexesOutputList }) {}
export class GetVectorsOutput extends S.Class<GetVectorsOutput>(
  "GetVectorsOutput",
)({ vectors: GetVectorsOutputList }) {}
export class ListVectorsOutput extends S.Class<ListVectorsOutput>(
  "ListVectorsOutput",
)({ nextToken: S.optional(S.String), vectors: ListVectorsOutputList }) {}
export class QueryOutputVector extends S.Class<QueryOutputVector>(
  "QueryOutputVector",
)({
  distance: S.optional(S.Number),
  key: S.String,
  metadata: S.optional(S.Any),
}) {}
export const QueryVectorsOutputList = S.Array(QueryOutputVector);
export class QueryVectorsOutput extends S.Class<QueryVectorsOutput>(
  "QueryVectorsOutput",
)({ vectors: QueryVectorsOutputList, distanceMetric: S.String }) {}

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.String },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class KmsDisabledException extends S.TaggedError<KmsDisabledException>()(
  "KmsDisabledException",
  { message: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class KmsInvalidKeyUsageException extends S.TaggedError<KmsInvalidKeyUsageException>()(
  "KmsInvalidKeyUsageException",
  { message: S.String },
) {}
export class KmsInvalidStateException extends S.TaggedError<KmsInvalidStateException>()(
  "KmsInvalidStateException",
  { message: S.String },
) {}
export class KmsNotFoundException extends S.TaggedError<KmsNotFoundException>()(
  "KmsNotFoundException",
  { message: S.String },
) {}

//# Operations
/**
 * Deletes a vector bucket policy. To specify the bucket, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:DeleteVectorBucketPolicy` permission to use this operation.
 */
export const deleteVectorBucketPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVectorBucketPolicyInput,
    output: DeleteVectorBucketPolicyOutput,
    errors: [NotFoundException, ServiceUnavailableException],
  }),
);
/**
 * Returns vector bucket attributes. To specify the bucket, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:GetVectorBucket` permission to use this operation.
 */
export const getVectorBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listVectorBuckets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListVectorBucketsInput,
    output: ListVectorBucketsOutput,
    errors: [ServiceUnavailableException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "vectorBuckets",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns vector index attributes. To specify the vector index, you can either use both the vector bucket name and the vector index name, or use the vector index Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:GetIndex` permission to use this operation.
 */
export const getIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listIndexes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListIndexesInput,
    output: ListIndexesOutput,
    errors: [NotFoundException, ServiceUnavailableException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "indexes",
      pageSize: "maxResults",
    } as const,
  }),
);
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
export const listVectors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Gets details about a vector bucket policy. To specify the bucket, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:GetVectorBucketPolicy` permission to use this operation.
 */
export const getVectorBucketPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetVectorBucketPolicyInput,
    output: GetVectorBucketPolicyOutput,
    errors: [NotFoundException, ServiceUnavailableException],
  }),
);
/**
 * Deletes a vector bucket. All vector indexes in the vector bucket must be deleted before the vector bucket can be deleted. To perform this operation, you must use either the vector bucket name or the vector bucket Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:DeleteVectorBucket` permission to use this operation.
 */
export const deleteVectorBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putVectorBucketPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutVectorBucketPolicyInput,
    output: PutVectorBucketPolicyOutput,
    errors: [NotFoundException, ServiceUnavailableException],
  }),
);
/**
 * Deletes a vector index. To specify the vector index, you can either use both the vector bucket name and vector index name, or use the vector index Amazon Resource Name (ARN).
 *
 * ### Permissions
 *
 * You must have the `s3vectors:DeleteIndex` permission to use this operation.
 */
export const deleteIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVectorBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const queryVectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putVectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
