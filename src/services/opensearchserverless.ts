import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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
export const ResourceFilter = S.Array(S.String);
export const LifecycleResourceFilter = S.Array(S.String);
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
export class CreateAccessPolicyRequest extends S.Class<CreateAccessPolicyRequest>(
  "CreateAccessPolicyRequest",
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
export class GetAccessPolicyRequest extends S.Class<GetAccessPolicyRequest>(
  "GetAccessPolicyRequest",
)(
  { type: S.String, name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAccessPolicyRequest extends S.Class<UpdateAccessPolicyRequest>(
  "UpdateAccessPolicyRequest",
)(
  {
    type: S.String,
    name: S.String,
    policyVersion: S.String,
    description: S.optional(S.String),
    policy: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccessPolicyRequest extends S.Class<DeleteAccessPolicyRequest>(
  "DeleteAccessPolicyRequest",
)(
  { type: S.String, name: S.String, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccessPolicyResponse extends S.Class<DeleteAccessPolicyResponse>(
  "DeleteAccessPolicyResponse",
)({}) {}
export class ListAccessPoliciesRequest extends S.Class<ListAccessPoliciesRequest>(
  "ListAccessPoliciesRequest",
)(
  {
    type: S.String,
    resource: S.optional(ResourceFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCollectionRequest extends S.Class<UpdateCollectionRequest>(
  "UpdateCollectionRequest",
)(
  {
    id: S.String,
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCollectionRequest extends S.Class<DeleteCollectionRequest>(
  "DeleteCollectionRequest",
)(
  { id: S.String, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateIndexRequest extends S.Class<CreateIndexRequest>(
  "CreateIndexRequest",
)(
  { id: S.String, indexName: S.String, indexSchema: S.optional(S.Any) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateIndexResponse extends S.Class<CreateIndexResponse>(
  "CreateIndexResponse",
)({}) {}
export class GetIndexRequest extends S.Class<GetIndexRequest>(
  "GetIndexRequest",
)(
  { id: S.String, indexName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateIndexRequest extends S.Class<UpdateIndexRequest>(
  "UpdateIndexRequest",
)(
  { id: S.String, indexName: S.String, indexSchema: S.optional(S.Any) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateIndexResponse extends S.Class<UpdateIndexResponse>(
  "UpdateIndexResponse",
)({}) {}
export class DeleteIndexRequest extends S.Class<DeleteIndexRequest>(
  "DeleteIndexRequest",
)(
  { id: S.String, indexName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIndexResponse extends S.Class<DeleteIndexResponse>(
  "DeleteIndexResponse",
)({}) {}
export class UpdateLifecyclePolicyRequest extends S.Class<UpdateLifecyclePolicyRequest>(
  "UpdateLifecyclePolicyRequest",
)(
  {
    type: S.String,
    name: S.String,
    policyVersion: S.String,
    description: S.optional(S.String),
    policy: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLifecyclePolicyRequest extends S.Class<DeleteLifecyclePolicyRequest>(
  "DeleteLifecyclePolicyRequest",
)(
  { type: S.String, name: S.String, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLifecyclePolicyResponse extends S.Class<DeleteLifecyclePolicyResponse>(
  "DeleteLifecyclePolicyResponse",
)({}) {}
export class ListLifecyclePoliciesRequest extends S.Class<ListLifecyclePoliciesRequest>(
  "ListLifecyclePoliciesRequest",
)(
  {
    type: S.String,
    resources: S.optional(LifecycleResourceFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSecurityConfigRequest extends S.Class<GetSecurityConfigRequest>(
  "GetSecurityConfigRequest",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSecurityConfigRequest extends S.Class<DeleteSecurityConfigRequest>(
  "DeleteSecurityConfigRequest",
)(
  { id: S.String, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSecurityConfigResponse extends S.Class<DeleteSecurityConfigResponse>(
  "DeleteSecurityConfigResponse",
)({}) {}
export class ListSecurityConfigsRequest extends S.Class<ListSecurityConfigsRequest>(
  "ListSecurityConfigsRequest",
)(
  {
    type: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSecurityPolicyRequest extends S.Class<GetSecurityPolicyRequest>(
  "GetSecurityPolicyRequest",
)(
  { type: S.String, name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSecurityPolicyRequest extends S.Class<UpdateSecurityPolicyRequest>(
  "UpdateSecurityPolicyRequest",
)(
  {
    type: S.String,
    name: S.String,
    policyVersion: S.String,
    description: S.optional(S.String),
    policy: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSecurityPolicyRequest extends S.Class<DeleteSecurityPolicyRequest>(
  "DeleteSecurityPolicyRequest",
)(
  { type: S.String, name: S.String, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSecurityPolicyResponse extends S.Class<DeleteSecurityPolicyResponse>(
  "DeleteSecurityPolicyResponse",
)({}) {}
export class ListSecurityPoliciesRequest extends S.Class<ListSecurityPoliciesRequest>(
  "ListSecurityPoliciesRequest",
)(
  {
    type: S.String,
    resource: S.optional(ResourceFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVpcEndpointRequest extends S.Class<CreateVpcEndpointRequest>(
  "CreateVpcEndpointRequest",
)(
  {
    name: S.String,
    vpcId: S.String,
    subnetIds: SubnetIds,
    securityGroupIds: S.optional(SecurityGroupIds),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVpcEndpointRequest extends S.Class<DeleteVpcEndpointRequest>(
  "DeleteVpcEndpointRequest",
)(
  { id: S.String, clientToken: S.optional(S.String) },
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
export class VectorOptions extends S.Class<VectorOptions>("VectorOptions")({
  ServerlessVectorAcceleration: S.String,
}) {}
export class CollectionFilters extends S.Class<CollectionFilters>(
  "CollectionFilters",
)({ name: S.optional(S.String), status: S.optional(S.String) }) {}
export class SamlConfigOptions extends S.Class<SamlConfigOptions>(
  "SamlConfigOptions",
)({
  metadata: S.String,
  userAttribute: S.optional(S.String),
  groupAttribute: S.optional(S.String),
  openSearchServerlessEntityId: S.optional(S.String),
  sessionTimeout: S.optional(S.Number),
}) {}
export class CreateIamIdentityCenterConfigOptions extends S.Class<CreateIamIdentityCenterConfigOptions>(
  "CreateIamIdentityCenterConfigOptions",
)({
  instanceArn: S.String,
  userAttribute: S.optional(S.String),
  groupAttribute: S.optional(S.String),
}) {}
export class IamFederationConfigOptions extends S.Class<IamFederationConfigOptions>(
  "IamFederationConfigOptions",
)({
  groupAttribute: S.optional(S.String),
  userAttribute: S.optional(S.String),
}) {}
export class UpdateIamIdentityCenterConfigOptions extends S.Class<UpdateIamIdentityCenterConfigOptions>(
  "UpdateIamIdentityCenterConfigOptions",
)({
  userAttribute: S.optional(S.String),
  groupAttribute: S.optional(S.String),
}) {}
export class VpcEndpointFilters extends S.Class<VpcEndpointFilters>(
  "VpcEndpointFilters",
)({ status: S.optional(S.String) }) {}
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
export class AccessPolicyDetail extends S.Class<AccessPolicyDetail>(
  "AccessPolicyDetail",
)({
  type: S.optional(S.String),
  name: S.optional(S.String),
  policyVersion: S.optional(S.String),
  description: S.optional(S.String),
  policy: S.optional(S.Any),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
}) {}
export class GetAccessPolicyResponse extends S.Class<GetAccessPolicyResponse>(
  "GetAccessPolicyResponse",
)({ accessPolicyDetail: S.optional(AccessPolicyDetail) }) {}
export class UpdateAccessPolicyResponse extends S.Class<UpdateAccessPolicyResponse>(
  "UpdateAccessPolicyResponse",
)({ accessPolicyDetail: S.optional(AccessPolicyDetail) }) {}
export class CreateCollectionRequest extends S.Class<CreateCollectionRequest>(
  "CreateCollectionRequest",
)(
  {
    name: S.String,
    type: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(Tags),
    standbyReplicas: S.optional(S.String),
    vectorOptions: S.optional(VectorOptions),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCollectionsRequest extends S.Class<ListCollectionsRequest>(
  "ListCollectionsRequest",
)(
  {
    collectionFilters: S.optional(CollectionFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIndexResponse extends S.Class<GetIndexResponse>(
  "GetIndexResponse",
)({ indexSchema: S.optional(S.Any) }) {}
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
export class UpdateLifecyclePolicyResponse extends S.Class<UpdateLifecyclePolicyResponse>(
  "UpdateLifecyclePolicyResponse",
)({ lifecyclePolicyDetail: S.optional(LifecyclePolicyDetail) }) {}
export class CreateSecurityConfigRequest extends S.Class<CreateSecurityConfigRequest>(
  "CreateSecurityConfigRequest",
)(
  {
    type: S.String,
    name: S.String,
    description: S.optional(S.String),
    samlOptions: S.optional(SamlConfigOptions),
    iamIdentityCenterOptions: S.optional(CreateIamIdentityCenterConfigOptions),
    iamFederationOptions: S.optional(IamFederationConfigOptions),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSecurityConfigRequest extends S.Class<UpdateSecurityConfigRequest>(
  "UpdateSecurityConfigRequest",
)(
  {
    id: S.String,
    configVersion: S.String,
    description: S.optional(S.String),
    samlOptions: S.optional(SamlConfigOptions),
    iamIdentityCenterOptionsUpdates: S.optional(
      UpdateIamIdentityCenterConfigOptions,
    ),
    iamFederationOptions: S.optional(IamFederationConfigOptions),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
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
export class GetSecurityPolicyResponse extends S.Class<GetSecurityPolicyResponse>(
  "GetSecurityPolicyResponse",
)({ securityPolicyDetail: S.optional(SecurityPolicyDetail) }) {}
export class UpdateSecurityPolicyResponse extends S.Class<UpdateSecurityPolicyResponse>(
  "UpdateSecurityPolicyResponse",
)({ securityPolicyDetail: S.optional(SecurityPolicyDetail) }) {}
export class ListVpcEndpointsRequest extends S.Class<ListVpcEndpointsRequest>(
  "ListVpcEndpointsRequest",
)(
  {
    vpcEndpointFilters: S.optional(VpcEndpointFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
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
export class AccessPolicySummary extends S.Class<AccessPolicySummary>(
  "AccessPolicySummary",
)({
  type: S.optional(S.String),
  name: S.optional(S.String),
  policyVersion: S.optional(S.String),
  description: S.optional(S.String),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
}) {}
export const AccessPolicySummaries = S.Array(AccessPolicySummary);
export class UpdateCollectionDetail extends S.Class<UpdateCollectionDetail>(
  "UpdateCollectionDetail",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
  type: S.optional(S.String),
  description: S.optional(S.String),
  arn: S.optional(S.String),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
}) {}
export class DeleteCollectionDetail extends S.Class<DeleteCollectionDetail>(
  "DeleteCollectionDetail",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class LifecyclePolicySummary extends S.Class<LifecyclePolicySummary>(
  "LifecyclePolicySummary",
)({
  type: S.optional(S.String),
  name: S.optional(S.String),
  policyVersion: S.optional(S.String),
  description: S.optional(S.String),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
}) {}
export const LifecyclePolicySummaries = S.Array(LifecyclePolicySummary);
export class SecurityConfigSummary extends S.Class<SecurityConfigSummary>(
  "SecurityConfigSummary",
)({
  id: S.optional(S.String),
  type: S.optional(S.String),
  configVersion: S.optional(S.String),
  description: S.optional(S.String),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
}) {}
export const SecurityConfigSummaries = S.Array(SecurityConfigSummary);
export class SecurityPolicySummary extends S.Class<SecurityPolicySummary>(
  "SecurityPolicySummary",
)({
  type: S.optional(S.String),
  name: S.optional(S.String),
  policyVersion: S.optional(S.String),
  description: S.optional(S.String),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
}) {}
export const SecurityPolicySummaries = S.Array(SecurityPolicySummary);
export class CreateVpcEndpointDetail extends S.Class<CreateVpcEndpointDetail>(
  "CreateVpcEndpointDetail",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class DeleteVpcEndpointDetail extends S.Class<DeleteVpcEndpointDetail>(
  "DeleteVpcEndpointDetail",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
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
export class CreateAccessPolicyResponse extends S.Class<CreateAccessPolicyResponse>(
  "CreateAccessPolicyResponse",
)({ accessPolicyDetail: S.optional(AccessPolicyDetail) }) {}
export class ListAccessPoliciesResponse extends S.Class<ListAccessPoliciesResponse>(
  "ListAccessPoliciesResponse",
)({
  accessPolicySummaries: S.optional(AccessPolicySummaries),
  nextToken: S.optional(S.String),
}) {}
export class UpdateCollectionResponse extends S.Class<UpdateCollectionResponse>(
  "UpdateCollectionResponse",
)({ updateCollectionDetail: S.optional(UpdateCollectionDetail) }) {}
export class DeleteCollectionResponse extends S.Class<DeleteCollectionResponse>(
  "DeleteCollectionResponse",
)({ deleteCollectionDetail: S.optional(DeleteCollectionDetail) }) {}
export class ListLifecyclePoliciesResponse extends S.Class<ListLifecyclePoliciesResponse>(
  "ListLifecyclePoliciesResponse",
)({
  lifecyclePolicySummaries: S.optional(LifecyclePolicySummaries),
  nextToken: S.optional(S.String),
}) {}
export class IamIdentityCenterConfigOptions extends S.Class<IamIdentityCenterConfigOptions>(
  "IamIdentityCenterConfigOptions",
)({
  instanceArn: S.optional(S.String),
  applicationArn: S.optional(S.String),
  applicationName: S.optional(S.String),
  applicationDescription: S.optional(S.String),
  userAttribute: S.optional(S.String),
  groupAttribute: S.optional(S.String),
}) {}
export class SecurityConfigDetail extends S.Class<SecurityConfigDetail>(
  "SecurityConfigDetail",
)({
  id: S.optional(S.String),
  type: S.optional(S.String),
  configVersion: S.optional(S.String),
  description: S.optional(S.String),
  samlOptions: S.optional(SamlConfigOptions),
  iamIdentityCenterOptions: S.optional(IamIdentityCenterConfigOptions),
  iamFederationOptions: S.optional(IamFederationConfigOptions),
  createdDate: S.optional(S.Number),
  lastModifiedDate: S.optional(S.Number),
}) {}
export class CreateSecurityConfigResponse extends S.Class<CreateSecurityConfigResponse>(
  "CreateSecurityConfigResponse",
)({ securityConfigDetail: S.optional(SecurityConfigDetail) }) {}
export class UpdateSecurityConfigResponse extends S.Class<UpdateSecurityConfigResponse>(
  "UpdateSecurityConfigResponse",
)({ securityConfigDetail: S.optional(SecurityConfigDetail) }) {}
export class ListSecurityConfigsResponse extends S.Class<ListSecurityConfigsResponse>(
  "ListSecurityConfigsResponse",
)({
  securityConfigSummaries: S.optional(SecurityConfigSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListSecurityPoliciesResponse extends S.Class<ListSecurityPoliciesResponse>(
  "ListSecurityPoliciesResponse",
)({
  securityPolicySummaries: S.optional(SecurityPolicySummaries),
  nextToken: S.optional(S.String),
}) {}
export class CreateVpcEndpointResponse extends S.Class<CreateVpcEndpointResponse>(
  "CreateVpcEndpointResponse",
)({ createVpcEndpointDetail: S.optional(CreateVpcEndpointDetail) }) {}
export class DeleteVpcEndpointResponse extends S.Class<DeleteVpcEndpointResponse>(
  "DeleteVpcEndpointResponse",
)({ deleteVpcEndpointDetail: S.optional(DeleteVpcEndpointDetail) }) {}
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
export class CreateCollectionDetail extends S.Class<CreateCollectionDetail>(
  "CreateCollectionDetail",
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
}) {}
export class CollectionSummary extends S.Class<CollectionSummary>(
  "CollectionSummary",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const CollectionSummaries = S.Array(CollectionSummary);
export class VpcEndpointSummary extends S.Class<VpcEndpointSummary>(
  "VpcEndpointSummary",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export const VpcEndpointSummaries = S.Array(VpcEndpointSummary);
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
export class CreateCollectionResponse extends S.Class<CreateCollectionResponse>(
  "CreateCollectionResponse",
)({ createCollectionDetail: S.optional(CreateCollectionDetail) }) {}
export class ListCollectionsResponse extends S.Class<ListCollectionsResponse>(
  "ListCollectionsResponse",
)({
  collectionSummaries: S.optional(CollectionSummaries),
  nextToken: S.optional(S.String),
}) {}
export class GetSecurityConfigResponse extends S.Class<GetSecurityConfigResponse>(
  "GetSecurityConfigResponse",
)({ securityConfigDetail: S.optional(SecurityConfigDetail) }) {}
export class ListVpcEndpointsResponse extends S.Class<ListVpcEndpointsResponse>(
  "ListVpcEndpointsResponse",
)({
  vpcEndpointSummaries: S.optional(VpcEndpointSummaries),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.String,
    quotaCode: S.optional(S.String),
  },
) {}
export class OcuLimitExceededException extends S.TaggedError<OcuLimitExceededException>()(
  "OcuLimitExceededException",
  { message: S.String },
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
 * Returns account-level settings related to OpenSearch Serverless.
 */
export const getAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Returns information about a configured OpenSearch Serverless security policy. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
 */
export const getSecurityPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSecurityPolicyRequest,
  output: GetSecurityPolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
 */
export const deleteAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPolicyRequest,
  output: DeleteAccessPolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an index within an OpenSearch Serverless collection. Unlike other OpenSearch indexes, indexes created by this API are automatically configured to conduct automatic semantic enrichment ingestion and search. For more information, see About automatic semantic enrichment in the *OpenSearch User Guide*.
 */
export const createIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexRequest,
  output: CreateIndexResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an OpenSearch Serverless lifecycle policy. For more information, see Deleting data lifecycle policies.
 */
export const deleteLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLifecyclePolicyRequest,
    output: DeleteLifecyclePolicyResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const deleteSecurityConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSecurityConfigRequest,
    output: DeleteSecurityConfigResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an OpenSearch Serverless security policy.
 */
export const deleteSecurityPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSecurityPolicyRequest,
    output: DeleteSecurityPolicyResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an index from an OpenSearch Serverless collection. Be aware that the index might be configured to conduct automatic semantic enrichment ingestion and search. For more information, see About automatic semantic enrichment.
 */
export const deleteIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexRequest,
  output: DeleteIndexResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
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
 * Returns an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
 */
export const getAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPolicyRequest,
  output: GetAccessPolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
 */
export const updateAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessPolicyRequest,
  output: UpdateAccessPolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an index in an OpenSearch Serverless collection, including its schema definition. The index might be configured to conduct automatic semantic enrichment ingestion and search. For more information, see About automatic semantic enrichment.
 */
export const getIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexRequest,
  output: GetIndexResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an OpenSearch Serverless collection. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
 */
export const deleteCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCollectionRequest,
  output: DeleteCollectionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
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
 * Updates an OpenSearch Serverless-managed interface endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const updateVpcEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcEndpointRequest,
  output: UpdateVpcEndpointResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Returns information about a list of OpenSearch Serverless access policies.
 */
export const listAccessPolicies = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAccessPoliciesRequest,
    output: ListAccessPoliciesResponse,
    errors: [InternalServerException, ValidationException],
    pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
  }),
);
/**
 * Updates an OpenSearch Serverless collection.
 */
export const updateCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCollectionRequest,
  output: UpdateCollectionResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Updates an existing index in an OpenSearch Serverless collection. This operation allows you to modify the index schema, including adding new fields or changing field mappings. You can also enable automatic semantic enrichment ingestion and search. For more information, see About automatic semantic enrichment.
 */
export const updateIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexRequest,
  output: UpdateIndexResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of OpenSearch Serverless lifecycle policies. For more information, see Viewing data lifecycle policies.
 */
export const listLifecyclePolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLifecyclePoliciesRequest,
    output: ListLifecyclePoliciesResponse,
    errors: [InternalServerException, ValidationException],
    pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
  }));
/**
 * Updates a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const updateSecurityConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSecurityConfigRequest,
    output: UpdateSecurityConfigResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about configured OpenSearch Serverless security configurations. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const listSecurityConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSecurityConfigsRequest,
    output: ListSecurityConfigsResponse,
    errors: [InternalServerException, ValidationException],
    pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
  }));
/**
 * Returns information about configured OpenSearch Serverless security policies.
 */
export const listSecurityPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSecurityPoliciesRequest,
    output: ListSecurityPoliciesResponse,
    errors: [InternalServerException, ValidationException],
    pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
  }));
/**
 * Deletes an OpenSearch Serverless-managed interface endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const deleteVpcEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcEndpointRequest,
  output: DeleteVpcEndpointResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
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
 * Lists all OpenSearch Serverless collections. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
 *
 * Make sure to include an empty request body {} if you don't include any collection filters in the request.
 */
export const listCollections = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCollectionsRequest,
    output: ListCollectionsResponse,
    errors: [InternalServerException, ValidationException],
    pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
  }),
);
/**
 * Returns information about an OpenSearch Serverless security configuration. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const getSecurityConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSecurityConfigRequest,
  output: GetSecurityConfigResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the OpenSearch Serverless-managed interface VPC endpoints associated with the current account. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const listVpcEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListVpcEndpointsRequest,
    output: ListVpcEndpointsResponse,
    errors: [InternalServerException, ValidationException],
    pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
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
 * Creates a data access policy for OpenSearch Serverless. Access policies limit access to collections and the resources within them, and allow a user to access that data irrespective of the access mechanism or network source. For more information, see Data access control for Amazon OpenSearch Serverless.
 */
export const createAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPolicyRequest,
  output: CreateAccessPolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Specifies a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
 */
export const createSecurityConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSecurityConfigRequest,
    output: CreateSecurityConfigResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an OpenSearch Serverless-managed interface VPC endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
 */
export const createVpcEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcEndpointRequest,
  output: CreateVpcEndpointResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates an OpenSearch Serverless access policy. For more information, see Updating data lifecycle policies.
 */
export const updateLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLifecyclePolicyRequest,
    output: UpdateLifecyclePolicyResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an OpenSearch Serverless security policy. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
 */
export const updateSecurityPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSecurityPolicyRequest,
    output: UpdateSecurityPolicyResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
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
 * Creates a new OpenSearch Serverless collection. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
 */
export const createCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCollectionRequest,
  output: CreateCollectionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    OcuLimitExceededException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
