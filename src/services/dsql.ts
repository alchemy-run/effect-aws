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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
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

//# Newtypes
export type Arn = string;
export type TagKey = string;
export type KmsEncryptionKey = string;
export type ClientToken = string;
export type PolicyDocument = string;
export type ClusterId = string;
export type MaxResults = number;
export type NextToken = string;
export type PolicyVersion = string;
export type TagValue = string;
export type Region = string;
export type ClusterArn = string;
export type Endpoint = string;
export type ServiceName = string;
export type ClusterVpcEndpoint = string;
export type KmsKeyArn = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
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
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface GetClusterInput {
  identifier: string;
}
export const GetClusterInput = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cluster/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClusterInput",
}) as any as S.Schema<GetClusterInput>;
export type ClusterArnList = string[];
export const ClusterArnList = S.Array(S.String);
export interface MultiRegionProperties {
  witnessRegion?: string;
  clusters?: ClusterArnList;
}
export const MultiRegionProperties = S.suspend(() =>
  S.Struct({
    witnessRegion: S.optional(S.String),
    clusters: S.optional(ClusterArnList),
  }),
).annotations({
  identifier: "MultiRegionProperties",
}) as any as S.Schema<MultiRegionProperties>;
export interface UpdateClusterInput {
  identifier: string;
  deletionProtectionEnabled?: boolean;
  kmsEncryptionKey?: string;
  clientToken?: string;
  multiRegionProperties?: MultiRegionProperties;
}
export const UpdateClusterInput = S.suspend(() =>
  S.Struct({
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    deletionProtectionEnabled: S.optional(S.Boolean),
    kmsEncryptionKey: S.optional(S.String),
    clientToken: S.optional(S.String),
    multiRegionProperties: S.optional(MultiRegionProperties),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClusterInput",
}) as any as S.Schema<UpdateClusterInput>;
export interface DeleteClusterInput {
  identifier: string;
  clientToken?: string;
}
export const DeleteClusterInput = S.suspend(() =>
  S.Struct({
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("client-token")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/cluster/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterInput",
}) as any as S.Schema<DeleteClusterInput>;
export interface ListClustersInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListClustersInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cluster" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClustersInput",
}) as any as S.Schema<ListClustersInput>;
export interface DeleteClusterPolicyInput {
  identifier: string;
  expectedPolicyVersion?: string;
  clientToken?: string;
}
export const DeleteClusterPolicyInput = S.suspend(() =>
  S.Struct({
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    expectedPolicyVersion: S.optional(S.String).pipe(
      T.HttpQuery("expected-policy-version"),
    ),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("client-token")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/cluster/{identifier}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterPolicyInput",
}) as any as S.Schema<DeleteClusterPolicyInput>;
export interface GetClusterPolicyInput {
  identifier: string;
}
export const GetClusterPolicyInput = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cluster/{identifier}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClusterPolicyInput",
}) as any as S.Schema<GetClusterPolicyInput>;
export interface GetVpcEndpointServiceNameInput {
  identifier: string;
}
export const GetVpcEndpointServiceNameInput = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
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
  ),
).annotations({
  identifier: "GetVpcEndpointServiceNameInput",
}) as any as S.Schema<GetVpcEndpointServiceNameInput>;
export interface PutClusterPolicyInput {
  identifier: string;
  policy: string;
  bypassPolicyLockoutSafetyCheck?: boolean;
  expectedPolicyVersion?: string;
  clientToken?: string;
}
export const PutClusterPolicyInput = S.suspend(() =>
  S.Struct({
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    policy: S.String,
    bypassPolicyLockoutSafetyCheck: S.optional(S.Boolean),
    expectedPolicyVersion: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster/{identifier}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutClusterPolicyInput",
}) as any as S.Schema<PutClusterPolicyInput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
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
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateClusterInput {
  deletionProtectionEnabled?: boolean;
  kmsEncryptionKey?: string;
  tags?: TagMap;
  clientToken?: string;
  multiRegionProperties?: MultiRegionProperties;
  policy?: string;
  bypassPolicyLockoutSafetyCheck?: boolean;
}
export const CreateClusterInput = S.suspend(() =>
  S.Struct({
    deletionProtectionEnabled: S.optional(S.Boolean),
    kmsEncryptionKey: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
    multiRegionProperties: S.optional(MultiRegionProperties),
    policy: S.optional(S.String),
    bypassPolicyLockoutSafetyCheck: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateClusterInput",
}) as any as S.Schema<CreateClusterInput>;
export interface UpdateClusterOutput {
  identifier: string;
  arn: string;
  status: string;
  creationTime: Date;
}
export const UpdateClusterOutput = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    arn: S.String,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "UpdateClusterOutput",
}) as any as S.Schema<UpdateClusterOutput>;
export interface DeleteClusterOutput {
  identifier: string;
  arn: string;
  status: string;
  creationTime: Date;
}
export const DeleteClusterOutput = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    arn: S.String,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DeleteClusterOutput",
}) as any as S.Schema<DeleteClusterOutput>;
export interface DeleteClusterPolicyOutput {
  policyVersion: string;
}
export const DeleteClusterPolicyOutput = S.suspend(() =>
  S.Struct({ policyVersion: S.String }),
).annotations({
  identifier: "DeleteClusterPolicyOutput",
}) as any as S.Schema<DeleteClusterPolicyOutput>;
export interface GetClusterPolicyOutput {
  policy: string;
  policyVersion: string;
}
export const GetClusterPolicyOutput = S.suspend(() =>
  S.Struct({ policy: S.String, policyVersion: S.String }),
).annotations({
  identifier: "GetClusterPolicyOutput",
}) as any as S.Schema<GetClusterPolicyOutput>;
export interface GetVpcEndpointServiceNameOutput {
  serviceName: string;
  clusterVpcEndpoint?: string;
}
export const GetVpcEndpointServiceNameOutput = S.suspend(() =>
  S.Struct({ serviceName: S.String, clusterVpcEndpoint: S.optional(S.String) }),
).annotations({
  identifier: "GetVpcEndpointServiceNameOutput",
}) as any as S.Schema<GetVpcEndpointServiceNameOutput>;
export interface PutClusterPolicyOutput {
  policyVersion: string;
}
export const PutClusterPolicyOutput = S.suspend(() =>
  S.Struct({ policyVersion: S.String }),
).annotations({
  identifier: "PutClusterPolicyOutput",
}) as any as S.Schema<PutClusterPolicyOutput>;
export interface EncryptionDetails {
  encryptionType: string;
  kmsKeyArn?: string;
  encryptionStatus: string;
}
export const EncryptionDetails = S.suspend(() =>
  S.Struct({
    encryptionType: S.String,
    kmsKeyArn: S.optional(S.String),
    encryptionStatus: S.String,
  }),
).annotations({
  identifier: "EncryptionDetails",
}) as any as S.Schema<EncryptionDetails>;
export interface ClusterSummary {
  identifier: string;
  arn: string;
}
export const ClusterSummary = S.suspend(() =>
  S.Struct({ identifier: S.String, arn: S.String }),
).annotations({
  identifier: "ClusterSummary",
}) as any as S.Schema<ClusterSummary>;
export type ClusterList = ClusterSummary[];
export const ClusterList = S.Array(ClusterSummary);
export interface CreateClusterOutput {
  identifier: string;
  arn: string;
  status: string;
  creationTime: Date;
  multiRegionProperties?: MultiRegionProperties;
  encryptionDetails?: EncryptionDetails;
  deletionProtectionEnabled: boolean;
  endpoint?: string;
}
export const CreateClusterOutput = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    arn: S.String,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    multiRegionProperties: S.optional(MultiRegionProperties),
    encryptionDetails: S.optional(EncryptionDetails),
    deletionProtectionEnabled: S.Boolean,
    endpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateClusterOutput",
}) as any as S.Schema<CreateClusterOutput>;
export interface GetClusterOutput {
  identifier: string;
  arn: string;
  status: string;
  creationTime: Date;
  deletionProtectionEnabled: boolean;
  multiRegionProperties?: MultiRegionProperties;
  tags?: TagMap;
  encryptionDetails?: EncryptionDetails;
  endpoint?: string;
}
export const GetClusterOutput = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    arn: S.String,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    deletionProtectionEnabled: S.Boolean,
    multiRegionProperties: S.optional(MultiRegionProperties),
    tags: S.optional(TagMap),
    encryptionDetails: S.optional(EncryptionDetails),
    endpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "GetClusterOutput",
}) as any as S.Schema<GetClusterOutput>;
export interface ListClustersOutput {
  nextToken?: string;
  clusters: ClusterList;
}
export const ListClustersOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), clusters: ClusterList }),
).annotations({
  identifier: "ListClustersOutput",
}) as any as S.Schema<ListClustersOutput>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}

//# Operations
/**
 * Removes a tag from a resource.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists all of the tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves information about a cluster.
 */
export const getCluster: (
  input: GetClusterInput,
) => Effect.Effect<
  GetClusterOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterInput,
  output: GetClusterOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves information about a list of clusters.
 */
export const listClusters: {
  (
    input: ListClustersInput,
  ): Effect.Effect<
    ListClustersOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersInput,
  ) => Stream.Stream<
    ListClustersOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersInput,
  ) => Stream.Stream<
    ClusterSummary,
    ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersInput,
  output: ListClustersOutput,
  errors: [ResourceNotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "clusters",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Tags a resource with a map of key and value pairs.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | ServiceQuotaExceededException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * Deletes a cluster in Amazon Aurora DSQL.
 */
export const deleteCluster: (
  input: DeleteClusterInput,
) => Effect.Effect<
  DeleteClusterOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterInput,
  output: DeleteClusterOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * Retrieves the resource-based policy document attached to a cluster. This policy defines the access permissions and conditions for the cluster.
 */
export const getClusterPolicy: (
  input: GetClusterPolicyInput,
) => Effect.Effect<
  GetClusterPolicyOutput,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterPolicyInput,
  output: GetClusterPolicyOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Retrieves the VPC endpoint service name.
 */
export const getVpcEndpointServiceName: (
  input: GetVpcEndpointServiceNameInput,
) => Effect.Effect<
  GetVpcEndpointServiceNameOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVpcEndpointServiceNameInput,
  output: GetVpcEndpointServiceNameOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
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
export const updateCluster: (
  input: UpdateClusterInput,
) => Effect.Effect<
  UpdateClusterOutput,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterInput,
  output: UpdateClusterOutput,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes the resource-based policy attached to a cluster. This removes all access permissions defined by the policy, reverting to default access controls.
 */
export const deleteClusterPolicy: (
  input: DeleteClusterPolicyInput,
) => Effect.Effect<
  DeleteClusterPolicyOutput,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterPolicyInput,
  output: DeleteClusterPolicyOutput,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Attaches a resource-based policy to a cluster. This policy defines access permissions and conditions for the cluster, allowing you to control which principals can perform actions on the cluster.
 */
export const putClusterPolicy: (
  input: PutClusterPolicyInput,
) => Effect.Effect<
  PutClusterPolicyOutput,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCluster: (
  input: CreateClusterInput,
) => Effect.Effect<
  CreateClusterOutput,
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterInput,
  output: CreateClusterOutput,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
