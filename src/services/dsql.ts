import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "DSQL", serviceShapeName: "DSQL" });
const auth = T.AwsAuthSigv4({ name: "dsql" });
const ver = T.ServiceVersion("2018-05-10");
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
                    url: "https://dsql-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://dsql.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class GetClusterInput extends S.Class<GetClusterInput>(
  "GetClusterInput",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/cluster/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ClusterArnList = S.Array(S.String);
export class MultiRegionProperties extends S.Class<MultiRegionProperties>(
  "MultiRegionProperties",
)({
  witnessRegion: S.optional(S.String),
  clusters: S.optional(ClusterArnList),
}) {}
export class UpdateClusterInput extends S.Class<UpdateClusterInput>(
  "UpdateClusterInput",
)(
  {
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    deletionProtectionEnabled: S.optional(S.Boolean),
    kmsEncryptionKey: S.optional(S.String),
    clientToken: S.optional(S.String),
    multiRegionProperties: S.optional(MultiRegionProperties),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cluster/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteClusterInput extends S.Class<DeleteClusterInput>(
  "DeleteClusterInput",
)(
  {
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("client-token")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/cluster/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClustersInput extends S.Class<ListClustersInput>(
  "ListClustersInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/cluster" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteClusterPolicyInput extends S.Class<DeleteClusterPolicyInput>(
  "DeleteClusterPolicyInput",
)(
  {
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    expectedPolicyVersion: S.optional(S.String).pipe(
      T.HttpQuery("expected-policy-version"),
    ),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("client-token")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/cluster/{identifier}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetClusterPolicyInput extends S.Class<GetClusterPolicyInput>(
  "GetClusterPolicyInput",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/cluster/{identifier}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVpcEndpointServiceNameInput extends S.Class<GetVpcEndpointServiceNameInput>(
  "GetVpcEndpointServiceNameInput",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{identifier}/vpc-endpoint-service-name",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutClusterPolicyInput extends S.Class<PutClusterPolicyInput>(
  "PutClusterPolicyInput",
)(
  {
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    policy: S.String,
    bypassPolicyLockoutSafetyCheck: S.optional(S.Boolean),
    expectedPolicyVersion: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cluster/{identifier}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(TagMap) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export class CreateClusterInput extends S.Class<CreateClusterInput>(
  "CreateClusterInput",
)(
  {
    deletionProtectionEnabled: S.optional(S.Boolean),
    kmsEncryptionKey: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
    multiRegionProperties: S.optional(MultiRegionProperties),
    policy: S.optional(S.String),
    bypassPolicyLockoutSafetyCheck: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cluster" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateClusterOutput extends S.Class<UpdateClusterOutput>(
  "UpdateClusterOutput",
)({
  identifier: S.String,
  arn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DeleteClusterOutput extends S.Class<DeleteClusterOutput>(
  "DeleteClusterOutput",
)({
  identifier: S.String,
  arn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DeleteClusterPolicyOutput extends S.Class<DeleteClusterPolicyOutput>(
  "DeleteClusterPolicyOutput",
)({ policyVersion: S.String }) {}
export class GetClusterPolicyOutput extends S.Class<GetClusterPolicyOutput>(
  "GetClusterPolicyOutput",
)({ policy: S.String, policyVersion: S.String }) {}
export class GetVpcEndpointServiceNameOutput extends S.Class<GetVpcEndpointServiceNameOutput>(
  "GetVpcEndpointServiceNameOutput",
)({ serviceName: S.String, clusterVpcEndpoint: S.optional(S.String) }) {}
export class PutClusterPolicyOutput extends S.Class<PutClusterPolicyOutput>(
  "PutClusterPolicyOutput",
)({ policyVersion: S.String }) {}
export class EncryptionDetails extends S.Class<EncryptionDetails>(
  "EncryptionDetails",
)({
  encryptionType: S.String,
  kmsKeyArn: S.optional(S.String),
  encryptionStatus: S.String,
}) {}
export class ClusterSummary extends S.Class<ClusterSummary>("ClusterSummary")({
  identifier: S.String,
  arn: S.String,
}) {}
export const ClusterList = S.Array(ClusterSummary);
export class CreateClusterOutput extends S.Class<CreateClusterOutput>(
  "CreateClusterOutput",
)({
  identifier: S.String,
  arn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  multiRegionProperties: S.optional(MultiRegionProperties),
  encryptionDetails: S.optional(EncryptionDetails),
  deletionProtectionEnabled: S.Boolean,
  endpoint: S.optional(S.String),
}) {}
export class GetClusterOutput extends S.Class<GetClusterOutput>(
  "GetClusterOutput",
)({
  identifier: S.String,
  arn: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  deletionProtectionEnabled: S.Boolean,
  multiRegionProperties: S.optional(MultiRegionProperties),
  tags: S.optional(TagMap),
  encryptionDetails: S.optional(EncryptionDetails),
  endpoint: S.optional(S.String),
}) {}
export class ListClustersOutput extends S.Class<ListClustersOutput>(
  "ListClustersOutput",
)({ nextToken: S.optional(S.String), clusters: ClusterList }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Removes a tag from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists all of the tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves information about a cluster.
 */
export const getCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterInput,
  output: GetClusterOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves information about a list of clusters.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListClustersInput,
    output: ListClustersOutput,
    errors: [ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "clusters",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Tags a resource with a map of key and value pairs.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * Deletes a cluster in Amazon Aurora DSQL.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterInput,
  output: DeleteClusterOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Retrieves the resource-based policy document attached to a cluster. This policy defines the access permissions and conditions for the cluster.
 */
export const getClusterPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterPolicyInput,
  output: GetClusterPolicyOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Retrieves the VPC endpoint service name.
 */
export const getVpcEndpointServiceName = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetVpcEndpointServiceNameInput,
    output: GetVpcEndpointServiceNameOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * The *UpdateCluster* API allows you to modify both single-Region and multi-Region cluster configurations. With the *multiRegionProperties* parameter, you can add or modify witness Region support and manage peer relationships with clusters in other Regions.
 *
 * Note that updating multi-Region clusters requires additional IAM permissions beyond those needed for standard cluster updates, as detailed in the Permissions section.
 *
 * **Required permissions**
 *
 * ### dsql:UpdateCluster
 *
 * Permission to update a DSQL cluster.
 *
 * Resources: `arn:aws:dsql:*region*:*account-id*:cluster/*cluster-id* `
 *
 * ### dsql:PutMultiRegionProperties
 *
 * Permission to configure multi-Region properties for a cluster.
 *
 * Resources: `arn:aws:dsql:*region*:*account-id*:cluster/*cluster-id* `
 *
 * ### dsql:GetCluster
 *
 * Permission to retrieve cluster information.
 *
 * Resources: `arn:aws:dsql:*region*:*account-id*:cluster/*cluster-id* `
 *
 * ### dsql:AddPeerCluster
 *
 * Permission to add peer clusters.
 *
 * Resources:
 *
 * - Local cluster: `arn:aws:dsql:*region*:*account-id*:cluster/*cluster-id* `
 *
 * - Each peer cluster: exact ARN of each specified peer cluster
 *
 * ### dsql:RemovePeerCluster
 *
 * Permission to remove peer clusters. The *dsql:RemovePeerCluster* permission uses a wildcard ARN pattern to simplify permission management during updates.
 *
 * Resources: `arn:aws:dsql:*:*account-id*:cluster/*`
 *
 * ### dsql:PutWitnessRegion
 *
 * Permission to set a witness Region.
 *
 * Resources: `arn:aws:dsql:*region*:*account-id*:cluster/*cluster-id* `
 *
 * Condition Keys: dsql:WitnessRegion (matching the specified witness Region)
 *
 * **This permission is checked both in the cluster Region and in the witness Region.**
 *
 * - The witness region specified in `multiRegionProperties.witnessRegion` cannot be the same as the cluster's Region.
 *
 * - When updating clusters with peer relationships, permissions are checked for both adding and removing peers.
 *
 * - The `dsql:RemovePeerCluster` permission uses a wildcard ARN pattern to simplify permission management during updates.
 */
export const updateCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterInput,
  output: UpdateClusterOutput,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes the resource-based policy attached to a cluster. This removes all access permissions defined by the policy, reverting to default access controls.
 */
export const deleteClusterPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterPolicyInput,
  output: DeleteClusterPolicyOutput,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Attaches a resource-based policy to a cluster. This policy defines access permissions and conditions for the cluster, allowing you to control which principals can perform actions on the cluster.
 */
export const putClusterPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutClusterPolicyInput,
  output: PutClusterPolicyOutput,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * The CreateCluster API allows you to create both single-Region clusters and multi-Region clusters. With the addition of the *multiRegionProperties* parameter, you can create a cluster with witness Region support and establish peer relationships with clusters in other Regions during creation.
 *
 * Creating multi-Region clusters requires additional IAM permissions beyond those needed for single-Region clusters, as detailed in the **Required permissions** section below.
 *
 * **Required permissions**
 *
 * ### dsql:CreateCluster
 *
 * Required to create a cluster.
 *
 * Resources: `arn:aws:dsql:region:account-id:cluster/*`
 *
 * ### dsql:TagResource
 *
 * Permission to add tags to a resource.
 *
 * Resources: `arn:aws:dsql:region:account-id:cluster/*`
 *
 * ### dsql:PutMultiRegionProperties
 *
 * Permission to configure multi-Region properties for a cluster.
 *
 * Resources: `arn:aws:dsql:region:account-id:cluster/*`
 *
 * ### dsql:AddPeerCluster
 *
 * When specifying `multiRegionProperties.clusters`, permission to add peer clusters.
 *
 * Resources:
 *
 * - Local cluster: `arn:aws:dsql:region:account-id:cluster/*`
 *
 * - Each peer cluster: exact ARN of each specified peer cluster
 *
 * ### dsql:PutWitnessRegion
 *
 * When specifying `multiRegionProperties.witnessRegion`, permission to set a witness Region. This permission is checked both in the cluster Region and in the witness Region.
 *
 * Resources: `arn:aws:dsql:region:account-id:cluster/*`
 *
 * Condition Keys: `dsql:WitnessRegion` (matching the specified witness region)
 *
 * - The witness Region specified in `multiRegionProperties.witnessRegion` cannot be the same as the cluster's Region.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterInput,
  output: CreateClusterOutput,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
