import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "OpenSearchServerless",
  serviceShapeName: "OpenSearchServerless",
});
const auth = T.AwsAuthSigv4({ name: "aoss" });
const ver = T.ServiceVersion("2021-11-01");
const proto = T.AwsProtocolsAwsJson1_0();
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
                                url: "https://aoss-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://aoss-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://aoss.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://aoss.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetAccountSettingsRequest extends S.Class<GetAccountSettingsRequest>(
  "GetAccountSettingsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPoliciesStatsRequest extends S.Class<GetPoliciesStatsRequest>(
  "GetPoliciesStatsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const CollectionIds = S.Array(S.String);
export const CollectionNames = S.Array(S.String);
export const VpcEndpointIds = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class BatchGetCollectionRequest extends S.Class<BatchGetCollectionRequest>(
  "BatchGetCollectionRequest",
)(
  { ids: S.optional(CollectionIds), names: S.optional(CollectionNames) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetVpcEndpointRequest extends S.Class<BatchGetVpcEndpointRequest>(
  "BatchGetVpcEndpointRequest",
)(
  { ids: VpcEndpointIds },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLifecyclePolicyRequest extends S.Class<CreateLifecyclePolicyRequest>(
  "CreateLifecyclePolicyRequest",
)(
  {
    type: S.String,
    name: S.String,
    description: S.optional(S.String),
    policy: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSecurityPolicyRequest extends S.Class<CreateSecurityPolicyRequest>(
  "CreateSecurityPolicyRequest",
)(
  {
    type: S.String,
    name: S.String,
    description: S.optional(S.String),
    policy: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateVpcEndpointRequest extends S.Class<UpdateVpcEndpointRequest>(
  "UpdateVpcEndpointRequest",
)(
  {
    id: S.String,
    addSubnetIds: S.optional(SubnetIds),
    removeSubnetIds: S.optional(SubnetIds),
    addSecurityGroupIds: S.optional(SecurityGroupIds),
    removeSecurityGroupIds: S.optional(SecurityGroupIds),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class LifecyclePolicyResourceIdentifier extends S.Class<LifecyclePolicyResourceIdentifier>(
  "LifecyclePolicyResourceIdentifier",
)({ type: S.String, resource: S.String }) {}
export const LifecyclePolicyResourceIdentifiers = S.Array(
  LifecyclePolicyResourceIdentifier,
);
export class LifecyclePolicyIdentifier extends S.Class<LifecyclePolicyIdentifier>(
  "LifecyclePolicyIdentifier",
)({ type: S.String, name: S.String }) {}
export const LifecyclePolicyIdentifiers = S.Array(LifecyclePolicyIdentifier);
export class CapacityLimits extends S.Class<CapacityLimits>("CapacityLimits")({
  maxIndexingCapacityInOCU: S.optional(S.Number),
  maxSearchCapacityInOCU: S.optional(S.Number),
}) {}
export class AccountSettingsDetail extends S.Class<AccountSettingsDetail>(
  "AccountSettingsDetail",
)({ capacityLimits: S.optional(CapacityLimits) }) {}
export class AccessPolicyStats extends S.Class<AccessPolicyStats>(
  "AccessPolicyStats",
)({ DataPolicyCount: S.optional(S.Number) }) {}
export class SecurityPolicyStats extends S.Class<SecurityPolicyStats>(
  "SecurityPolicyStats",
)({
  EncryptionPolicyCount: S.optional(S.Number),
  NetworkPolicyCount: S.optional(S.Number),
}) {}
export class SecurityConfigStats extends S.Class<SecurityConfigStats>(
  "SecurityConfigStats",
)({ SamlConfigCount: S.optional(S.Number) }) {}
export class LifecyclePolicyStats extends S.Class<LifecyclePolicyStats>(
  "LifecyclePolicyStats",
)({ RetentionPolicyCount: S.optional(S.Number) }) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class BatchGetEffectiveLifecyclePolicyRequest extends S.Class<BatchGetEffectiveLifecyclePolicyRequest>(
  "BatchGetEffectiveLifecyclePolicyRequest",
)(
  { resourceIdentifiers: LifecyclePolicyResourceIdentifiers },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetLifecyclePolicyRequest extends S.Class<BatchGetLifecyclePolicyRequest>(
  "BatchGetLifecyclePolicyRequest",
)(
  { identifiers: LifecyclePolicyIdentifiers },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccountSettingsResponse extends S.Class<GetAccountSettingsResponse>(
  "GetAccountSettingsResponse",
)({ accountSettingsDetail: S.optional(AccountSettingsDetail) }) {}
export class GetPoliciesStatsResponse extends S.Class<GetPoliciesStatsResponse>(
  "GetPoliciesStatsResponse",
)({
  AccessPolicyStats: S.optional(AccessPolicyStats),
  SecurityPolicyStats: S.optional(SecurityPolicyStats),
  SecurityConfigStats: S.optional(SecurityConfigStats),
  LifecyclePolicyStats: S.optional(LifecyclePolicyStats),
  TotalPolicyCount: S.optional(S.Number),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: Tags },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UpdateAccountSettingsRequest extends S.Class<UpdateAccountSettingsRequest>(
  "UpdateAccountSettingsRequest",
)(
  { capacityLimits: S.optional(CapacityLimits) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CollectionErrorDetail extends S.Class<CollectionErrorDetail>(
  "CollectionErrorDetail",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const CollectionErrorDetails = S.Array(CollectionErrorDetail);
export class LifecyclePolicyDetail extends S.Class<LifecyclePolicyDetail>(
  "LifecyclePolicyDetail",
)({
  type: S.optional(S.String),
  name: S.optional(S.String),
  policyVersion: S.optional(S.String),
  description: S.optional(S.String),
  policy: S.optional(S.Any),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
}) {}
export const LifecyclePolicyDetails = S.Array(LifecyclePolicyDetail);
export class VpcEndpointDetail extends S.Class<VpcEndpointDetail>(
  "VpcEndpointDetail",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  vpcId: S.optional(S.String),
  subnetIds: S.optional(SubnetIds),
  securityGroupIds: S.optional(SecurityGroupIds),
  status: S.optional(S.String),
  createdDate: S.optional(S.Number),
  failureCode: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export const VpcEndpointDetails = S.Array(VpcEndpointDetail);
export class VpcEndpointErrorDetail extends S.Class<VpcEndpointErrorDetail>(
  "VpcEndpointErrorDetail",
)({
  id: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const VpcEndpointErrorDetails = S.Array(VpcEndpointErrorDetail);
export class SecurityPolicyDetail extends S.Class<SecurityPolicyDetail>(
  "SecurityPolicyDetail",
)({
  type: S.optional(S.String),
  name: S.optional(S.String),
  policyVersion: S.optional(S.String),
  description: S.optional(S.String),
  policy: S.optional(S.Any),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
}) {}
export class UpdateVpcEndpointDetail extends S.Class<UpdateVpcEndpointDetail>(
  "UpdateVpcEndpointDetail",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
  subnetIds: S.optional(SubnetIds),
  securityGroupIds: S.optional(SecurityGroupIds),
  lastModifiedDate: S.optional(S.Number),
}) {}
export class BatchGetVpcEndpointResponse extends S.Class<BatchGetVpcEndpointResponse>(
  "BatchGetVpcEndpointResponse",
)({
  vpcEndpointDetails: S.optional(VpcEndpointDetails),
  vpcEndpointErrorDetails: S.optional(VpcEndpointErrorDetails),
}) {}
export class CreateLifecyclePolicyResponse extends S.Class<CreateLifecyclePolicyResponse>(
  "CreateLifecyclePolicyResponse",
)({ lifecyclePolicyDetail: S.optional(LifecyclePolicyDetail) }) {}
export class CreateSecurityPolicyResponse extends S.Class<CreateSecurityPolicyResponse>(
  "CreateSecurityPolicyResponse",
)({ securityPolicyDetail: S.optional(SecurityPolicyDetail) }) {}
export class UpdateAccountSettingsResponse extends S.Class<UpdateAccountSettingsResponse>(
  "UpdateAccountSettingsResponse",
)({ accountSettingsDetail: S.optional(AccountSettingsDetail) }) {}
export class UpdateVpcEndpointResponse extends S.Class<UpdateVpcEndpointResponse>(
  "UpdateVpcEndpointResponse",
)({ UpdateVpcEndpointDetail: S.optional(UpdateVpcEndpointDetail) }) {}
export class VectorOptions extends S.Class<VectorOptions>("VectorOptions")({
  ServerlessVectorAcceleration: S.String,
}) {}
export class FipsEndpoints extends S.Class<FipsEndpoints>("FipsEndpoints")({
  collectionEndpoint: S.optional(S.String),
  dashboardEndpoint: S.optional(S.String),
}) {}
export class CollectionDetail extends S.Class<CollectionDetail>(
  "CollectionDetail",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
  type: S.optional(S.String),
  description: S.optional(S.String),
  arn: S.optional(S.String),
  kmsKeyArn: S.optional(S.String),
  standbyReplicas: S.optional(S.String),
  vectorOptions: S.optional(VectorOptions),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
  collectionEndpoint: S.optional(S.String),
  dashboardEndpoint: S.optional(S.String),
  fipsEndpoints: S.optional(FipsEndpoints),
  failureCode: S.optional(S.String),
  failureMessage: S.optional(S.String),
}) {}
export const CollectionDetails = S.Array(CollectionDetail);
export class EffectiveLifecyclePolicyDetail extends S.Class<EffectiveLifecyclePolicyDetail>(
  "EffectiveLifecyclePolicyDetail",
)({
  type: S.optional(S.String),
  resource: S.optional(S.String),
  policyName: S.optional(S.String),
  resourceType: S.optional(S.String),
  retentionPeriod: S.optional(S.String),
  noMinRetentionPeriod: S.optional(S.Boolean),
}) {}
export const EffectiveLifecyclePolicyDetails = S.Array(
  EffectiveLifecyclePolicyDetail,
);
export class EffectiveLifecyclePolicyErrorDetail extends S.Class<EffectiveLifecyclePolicyErrorDetail>(
  "EffectiveLifecyclePolicyErrorDetail",
)({
  type: S.optional(S.String),
  resource: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const EffectiveLifecyclePolicyErrorDetails = S.Array(
  EffectiveLifecyclePolicyErrorDetail,
);
export class LifecyclePolicyErrorDetail extends S.Class<LifecyclePolicyErrorDetail>(
  "LifecyclePolicyErrorDetail",
)({
  type: S.optional(S.String),
  name: S.optional(S.String),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const LifecyclePolicyErrorDetails = S.Array(LifecyclePolicyErrorDetail);
export class BatchGetCollectionResponse extends S.Class<BatchGetCollectionResponse>(
  "BatchGetCollectionResponse",
)({
  collectionDetails: S.optional(CollectionDetails),
  collectionErrorDetails: S.optional(CollectionErrorDetails),
}) {}
export class BatchGetEffectiveLifecyclePolicyResponse extends S.Class<BatchGetEffectiveLifecyclePolicyResponse>(
  "BatchGetEffectiveLifecyclePolicyResponse",
)({
  effectiveLifecyclePolicyDetails: S.optional(EffectiveLifecyclePolicyDetails),
  effectiveLifecyclePolicyErrorDetails: S.optional(
    EffectiveLifecyclePolicyErrorDetails,
  ),
}) {}
export class BatchGetLifecyclePolicyResponse extends S.Class<BatchGetLifecyclePolicyResponse>(
  "BatchGetLifecyclePolicyResponse",
)({
  lifecyclePolicyDetails: S.optional(LifecyclePolicyDetails),
  lifecyclePolicyErrorDetails: S.optional(LifecyclePolicyErrorDetails),
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}

//# Operations
/**
 * Returns statistical information about your OpenSearch Serverless access policies, security configurations, and security policies.
 */
export const getPoliciesStats = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPoliciesStatsRequest,
  output: GetPoliciesStatsResponse,
  errors: [InternalServerException],
}));
/**
 * Returns attributes for one or more VPC endpoints associated with the current account. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const batchGetVpcEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetVpcEndpointRequest,
  output: BatchGetVpcEndpointResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Creates a lifecyle policy to be applied to OpenSearch Serverless indexes. Lifecycle policies define the number of days or hours to retain the data on an OpenSearch Serverless index. For more information, see Creating data lifecycle policies.
 */
export const createLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLifecyclePolicyRequest,
    output: CreateLifecyclePolicyResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a security policy to be used by one or more OpenSearch Serverless collections. Security policies provide access to a collection and its OpenSearch Dashboards endpoint from public networks or specific VPC endpoints. They also allow you to secure a collection with a KMS encryption key. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
 */
export const createSecurityPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSecurityPolicyRequest,
    output: CreateSecurityPolicyResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Returns account-level settings related to OpenSearch Serverless.
 */
export const getAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Returns the tags for an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates tags with an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Removes a tag or set of tags from an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Update the OpenSearch Serverless settings for the current Amazon Web Services account. For more information, see Managing capacity limits for Amazon OpenSearch Serverless.
 */
export const updateAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountSettingsRequest,
    output: UpdateAccountSettingsResponse,
    errors: [
      InternalServerException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an OpenSearch Serverless-managed interface endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const updateVpcEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcEndpointRequest,
  output: UpdateVpcEndpointResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Returns attributes for one or more collections, including the collection endpoint, the OpenSearch Dashboards endpoint, and FIPS-compliant endpoints. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
 */
export const batchGetCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCollectionRequest,
  output: BatchGetCollectionResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Returns a list of successful and failed retrievals for the OpenSearch Serverless indexes. For more information, see Viewing data lifecycle policies.
 */
export const batchGetEffectiveLifecyclePolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetEffectiveLifecyclePolicyRequest,
    output: BatchGetEffectiveLifecyclePolicyResponse,
    errors: [InternalServerException, ValidationException],
  }));
/**
 * Returns one or more configured OpenSearch Serverless lifecycle policies. For more information, see Viewing data lifecycle policies.
 */
export const batchGetLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetLifecyclePolicyRequest,
    output: BatchGetLifecyclePolicyResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
