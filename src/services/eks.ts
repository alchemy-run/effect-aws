import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "EKS",
  serviceShapeName: "AWSWesleyFrontend",
});
const auth = T.AwsAuthSigv4({ name: "eks" });
const ver = T.ServiceVersion("2017-11-01");
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
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
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
                      endpoint: {
                        url: "https://eks-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
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
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://fips.eks.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://eks.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://eks-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                      endpoint: {
                        url: "https://eks.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
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
              endpoint: {
                url: "https://eks.{Region}.{PartitionResult#dnsSuffix}",
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
});

//# Schemas
export const StringList = S.Array(S.String);
export const IncludeClustersList = S.Array(S.String);
export const EksAnywhereSubscriptionStatusValues = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateAccessEntryRequest extends S.Class<CreateAccessEntryRequest>(
  "CreateAccessEntryRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    principalArn: S.String,
    kubernetesGroups: S.optional(StringList),
    tags: S.optional(TagMap),
    clientRequestToken: S.optional(S.String),
    username: S.optional(S.String),
    type: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/clusters/{clusterName}/access-entries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePodIdentityAssociationRequest extends S.Class<CreatePodIdentityAssociationRequest>(
  "CreatePodIdentityAssociationRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    namespace: S.String,
    serviceAccount: S.String,
    roleArn: S.String,
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
    disableSessionTags: S.optional(S.Boolean),
    targetRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/pod-identity-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessEntryRequest extends S.Class<DeleteAccessEntryRequest>(
  "DeleteAccessEntryRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    principalArn: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/clusters/{clusterName}/access-entries/{principalArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessEntryResponse extends S.Class<DeleteAccessEntryResponse>(
  "DeleteAccessEntryResponse",
)({}) {}
export class DeleteAddonRequest extends S.Class<DeleteAddonRequest>(
  "DeleteAddonRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    addonName: S.String.pipe(T.HttpLabel()),
    preserve: S.optional(S.Boolean).pipe(T.HttpQuery("preserve")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/clusters/{clusterName}/addons/{addonName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCapabilityRequest extends S.Class<DeleteCapabilityRequest>(
  "DeleteCapabilityRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    capabilityName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/clusters/{clusterName}/capabilities/{capabilityName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteClusterRequest extends S.Class<DeleteClusterRequest>(
  "DeleteClusterRequest",
)(
  { name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/clusters/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEksAnywhereSubscriptionRequest extends S.Class<DeleteEksAnywhereSubscriptionRequest>(
  "DeleteEksAnywhereSubscriptionRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/eks-anywhere-subscriptions/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFargateProfileRequest extends S.Class<DeleteFargateProfileRequest>(
  "DeleteFargateProfileRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    fargateProfileName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/clusters/{clusterName}/fargate-profiles/{fargateProfileName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNodegroupRequest extends S.Class<DeleteNodegroupRequest>(
  "DeleteNodegroupRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    nodegroupName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/clusters/{clusterName}/node-groups/{nodegroupName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePodIdentityAssociationRequest extends S.Class<DeletePodIdentityAssociationRequest>(
  "DeletePodIdentityAssociationRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    associationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/clusters/{clusterName}/pod-identity-associations/{associationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterClusterRequest extends S.Class<DeregisterClusterRequest>(
  "DeregisterClusterRequest",
)(
  { name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/cluster-registrations/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAccessEntryRequest extends S.Class<DescribeAccessEntryRequest>(
  "DescribeAccessEntryRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    principalArn: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{clusterName}/access-entries/{principalArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAddonRequest extends S.Class<DescribeAddonRequest>(
  "DescribeAddonRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    addonName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{clusterName}/addons/{addonName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAddonConfigurationRequest extends S.Class<DescribeAddonConfigurationRequest>(
  "DescribeAddonConfigurationRequest",
)(
  {
    addonName: S.String.pipe(T.HttpQuery("addonName")),
    addonVersion: S.String.pipe(T.HttpQuery("addonVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/addons/configuration-schemas" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAddonVersionsRequest extends S.Class<DescribeAddonVersionsRequest>(
  "DescribeAddonVersionsRequest",
)(
  {
    kubernetesVersion: S.optional(S.String).pipe(
      T.HttpQuery("kubernetesVersion"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    addonName: S.optional(S.String).pipe(T.HttpQuery("addonName")),
    types: S.optional(StringList).pipe(T.HttpQuery("types")),
    publishers: S.optional(StringList).pipe(T.HttpQuery("publishers")),
    owners: S.optional(StringList).pipe(T.HttpQuery("owners")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/addons/supported-versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCapabilityRequest extends S.Class<DescribeCapabilityRequest>(
  "DescribeCapabilityRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    capabilityName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{clusterName}/capabilities/{capabilityName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeClusterRequest extends S.Class<DescribeClusterRequest>(
  "DescribeClusterRequest",
)(
  { name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeClusterVersionsRequest extends S.Class<DescribeClusterVersionsRequest>(
  "DescribeClusterVersionsRequest",
)(
  {
    clusterType: S.optional(S.String).pipe(T.HttpQuery("clusterType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    defaultOnly: S.optional(S.Boolean).pipe(T.HttpQuery("defaultOnly")),
    includeAll: S.optional(S.Boolean).pipe(T.HttpQuery("includeAll")),
    clusterVersions: S.optional(StringList).pipe(
      T.HttpQuery("clusterVersions"),
    ),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    versionStatus: S.optional(S.String).pipe(T.HttpQuery("versionStatus")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/cluster-versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeEksAnywhereSubscriptionRequest extends S.Class<DescribeEksAnywhereSubscriptionRequest>(
  "DescribeEksAnywhereSubscriptionRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/eks-anywhere-subscriptions/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFargateProfileRequest extends S.Class<DescribeFargateProfileRequest>(
  "DescribeFargateProfileRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    fargateProfileName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{clusterName}/fargate-profiles/{fargateProfileName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInsightRequest extends S.Class<DescribeInsightRequest>(
  "DescribeInsightRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    id: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{clusterName}/insights/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInsightsRefreshRequest extends S.Class<DescribeInsightsRefreshRequest>(
  "DescribeInsightsRefreshRequest",
)(
  { clusterName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{clusterName}/insights-refresh" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeNodegroupRequest extends S.Class<DescribeNodegroupRequest>(
  "DescribeNodegroupRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    nodegroupName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{clusterName}/node-groups/{nodegroupName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePodIdentityAssociationRequest extends S.Class<DescribePodIdentityAssociationRequest>(
  "DescribePodIdentityAssociationRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    associationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{clusterName}/pod-identity-associations/{associationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeUpdateRequest extends S.Class<DescribeUpdateRequest>(
  "DescribeUpdateRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel()),
    updateId: S.String.pipe(T.HttpLabel()),
    nodegroupName: S.optional(S.String).pipe(T.HttpQuery("nodegroupName")),
    addonName: S.optional(S.String).pipe(T.HttpQuery("addonName")),
    capabilityName: S.optional(S.String).pipe(T.HttpQuery("capabilityName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{name}/updates/{updateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAccessPolicyRequest extends S.Class<DisassociateAccessPolicyRequest>(
  "DisassociateAccessPolicyRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    principalArn: S.String.pipe(T.HttpLabel()),
    policyArn: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/clusters/{clusterName}/access-entries/{principalArn}/access-policies/{policyArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAccessPolicyResponse extends S.Class<DisassociateAccessPolicyResponse>(
  "DisassociateAccessPolicyResponse",
)({}) {}
export class IdentityProviderConfig extends S.Class<IdentityProviderConfig>(
  "IdentityProviderConfig",
)({ type: S.String, name: S.String }) {}
export class DisassociateIdentityProviderConfigRequest extends S.Class<DisassociateIdentityProviderConfigRequest>(
  "DisassociateIdentityProviderConfigRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    identityProviderConfig: IdentityProviderConfig,
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/identity-provider-configs/disassociate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccessEntriesRequest extends S.Class<ListAccessEntriesRequest>(
  "ListAccessEntriesRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    associatedPolicyArn: S.optional(S.String).pipe(
      T.HttpQuery("associatedPolicyArn"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{clusterName}/access-entries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccessPoliciesRequest extends S.Class<ListAccessPoliciesRequest>(
  "ListAccessPoliciesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/access-policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAddonsRequest extends S.Class<ListAddonsRequest>(
  "ListAddonsRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{clusterName}/addons" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssociatedAccessPoliciesRequest extends S.Class<ListAssociatedAccessPoliciesRequest>(
  "ListAssociatedAccessPoliciesRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    principalArn: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{clusterName}/access-entries/{principalArn}/access-policies",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCapabilitiesRequest extends S.Class<ListCapabilitiesRequest>(
  "ListCapabilitiesRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{clusterName}/capabilities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClustersRequest extends S.Class<ListClustersRequest>(
  "ListClustersRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    include: S.optional(IncludeClustersList).pipe(T.HttpQuery("include")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEksAnywhereSubscriptionsRequest extends S.Class<ListEksAnywhereSubscriptionsRequest>(
  "ListEksAnywhereSubscriptionsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    includeStatus: S.optional(EksAnywhereSubscriptionStatusValues).pipe(
      T.HttpQuery("includeStatus"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/eks-anywhere-subscriptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFargateProfilesRequest extends S.Class<ListFargateProfilesRequest>(
  "ListFargateProfilesRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{clusterName}/fargate-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIdentityProviderConfigsRequest extends S.Class<ListIdentityProviderConfigsRequest>(
  "ListIdentityProviderConfigsRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{clusterName}/identity-provider-configs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNodegroupsRequest extends S.Class<ListNodegroupsRequest>(
  "ListNodegroupsRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{clusterName}/node-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPodIdentityAssociationsRequest extends S.Class<ListPodIdentityAssociationsRequest>(
  "ListPodIdentityAssociationsRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    serviceAccount: S.optional(S.String).pipe(T.HttpQuery("serviceAccount")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/clusters/{clusterName}/pod-identity-associations",
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
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUpdatesRequest extends S.Class<ListUpdatesRequest>(
  "ListUpdatesRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel()),
    nodegroupName: S.optional(S.String).pipe(T.HttpQuery("nodegroupName")),
    addonName: S.optional(S.String).pipe(T.HttpQuery("addonName")),
    capabilityName: S.optional(S.String).pipe(T.HttpQuery("capabilityName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters/{name}/updates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartInsightsRefreshRequest extends S.Class<StartInsightsRefreshRequest>(
  "StartInsightsRefreshRequest",
)(
  { clusterName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/clusters/{clusterName}/insights-refresh" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
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
export class UpdateAccessEntryRequest extends S.Class<UpdateAccessEntryRequest>(
  "UpdateAccessEntryRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    principalArn: S.String.pipe(T.HttpLabel()),
    kubernetesGroups: S.optional(StringList),
    clientRequestToken: S.optional(S.String),
    username: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/access-entries/{principalArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddonPodIdentityAssociations extends S.Class<AddonPodIdentityAssociations>(
  "AddonPodIdentityAssociations",
)({ serviceAccount: S.String, roleArn: S.String }) {}
export const AddonPodIdentityAssociationsList = S.Array(
  AddonPodIdentityAssociations,
);
export class UpdateAddonRequest extends S.Class<UpdateAddonRequest>(
  "UpdateAddonRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    addonName: S.String.pipe(T.HttpLabel()),
    addonVersion: S.optional(S.String),
    serviceAccountRoleArn: S.optional(S.String),
    resolveConflicts: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    configurationValues: S.optional(S.String),
    podIdentityAssociations: S.optional(AddonPodIdentityAssociationsList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/addons/{addonName}/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateClusterVersionRequest extends S.Class<UpdateClusterVersionRequest>(
  "UpdateClusterVersionRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel()),
    version: S.String,
    clientRequestToken: S.optional(S.String),
    force: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/clusters/{name}/updates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEksAnywhereSubscriptionRequest extends S.Class<UpdateEksAnywhereSubscriptionRequest>(
  "UpdateEksAnywhereSubscriptionRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    autoRenew: S.Boolean,
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/eks-anywhere-subscriptions/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LaunchTemplateSpecification extends S.Class<LaunchTemplateSpecification>(
  "LaunchTemplateSpecification",
)({
  name: S.optional(S.String),
  version: S.optional(S.String),
  id: S.optional(S.String),
}) {}
export class UpdateNodegroupVersionRequest extends S.Class<UpdateNodegroupVersionRequest>(
  "UpdateNodegroupVersionRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    nodegroupName: S.String.pipe(T.HttpLabel()),
    version: S.optional(S.String),
    releaseVersion: S.optional(S.String),
    launchTemplate: S.optional(LaunchTemplateSpecification),
    force: S.optional(S.Boolean),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/node-groups/{nodegroupName}/update-version",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePodIdentityAssociationRequest extends S.Class<UpdatePodIdentityAssociationRequest>(
  "UpdatePodIdentityAssociationRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    associationId: S.String.pipe(T.HttpLabel()),
    roleArn: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    disableSessionTags: S.optional(S.Boolean),
    targetRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/pod-identity-associations/{associationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const CategoryList = S.Array(S.String);
export const InsightStatusValueList = S.Array(S.String);
export const labelsKeyList = S.Array(S.String);
export class AccessScope extends S.Class<AccessScope>("AccessScope")({
  type: S.optional(S.String),
  namespaces: S.optional(StringList),
}) {}
export class AddonNamespaceConfigRequest extends S.Class<AddonNamespaceConfigRequest>(
  "AddonNamespaceConfigRequest",
)({ namespace: S.optional(S.String) }) {}
export class VpcConfigRequest extends S.Class<VpcConfigRequest>(
  "VpcConfigRequest",
)({
  subnetIds: S.optional(StringList),
  securityGroupIds: S.optional(StringList),
  endpointPublicAccess: S.optional(S.Boolean),
  endpointPrivateAccess: S.optional(S.Boolean),
  publicAccessCidrs: S.optional(StringList),
}) {}
export class CreateAccessConfigRequest extends S.Class<CreateAccessConfigRequest>(
  "CreateAccessConfigRequest",
)({
  bootstrapClusterCreatorAdminPermissions: S.optional(S.Boolean),
  authenticationMode: S.optional(S.String),
}) {}
export class UpgradePolicyRequest extends S.Class<UpgradePolicyRequest>(
  "UpgradePolicyRequest",
)({ supportType: S.optional(S.String) }) {}
export class ZonalShiftConfigRequest extends S.Class<ZonalShiftConfigRequest>(
  "ZonalShiftConfigRequest",
)({ enabled: S.optional(S.Boolean) }) {}
export class ComputeConfigRequest extends S.Class<ComputeConfigRequest>(
  "ComputeConfigRequest",
)({
  enabled: S.optional(S.Boolean),
  nodePools: S.optional(StringList),
  nodeRoleArn: S.optional(S.String),
}) {}
export class ControlPlaneScalingConfig extends S.Class<ControlPlaneScalingConfig>(
  "ControlPlaneScalingConfig",
)({ tier: S.optional(S.String) }) {}
export class EksAnywhereSubscriptionTerm extends S.Class<EksAnywhereSubscriptionTerm>(
  "EksAnywhereSubscriptionTerm",
)({ duration: S.optional(S.Number), unit: S.optional(S.String) }) {}
export class NodegroupScalingConfig extends S.Class<NodegroupScalingConfig>(
  "NodegroupScalingConfig",
)({
  minSize: S.optional(S.Number),
  maxSize: S.optional(S.Number),
  desiredSize: S.optional(S.Number),
}) {}
export class RemoteAccessConfig extends S.Class<RemoteAccessConfig>(
  "RemoteAccessConfig",
)({
  ec2SshKey: S.optional(S.String),
  sourceSecurityGroups: S.optional(StringList),
}) {}
export const labelsMap = S.Record({ key: S.String, value: S.String });
export class Taint extends S.Class<Taint>("Taint")({
  key: S.optional(S.String),
  value: S.optional(S.String),
  effect: S.optional(S.String),
}) {}
export const taintsList = S.Array(Taint);
export class NodegroupUpdateConfig extends S.Class<NodegroupUpdateConfig>(
  "NodegroupUpdateConfig",
)({
  maxUnavailable: S.optional(S.Number),
  maxUnavailablePercentage: S.optional(S.Number),
  updateStrategy: S.optional(S.String),
}) {}
export class License extends S.Class<License>("License")({
  id: S.optional(S.String),
  token: S.optional(S.String),
}) {}
export const LicenseList = S.Array(License);
export class EksAnywhereSubscription extends S.Class<EksAnywhereSubscription>(
  "EksAnywhereSubscription",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  effectiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  licenseQuantity: S.optional(S.Number),
  licenseType: S.optional(S.String),
  term: S.optional(EksAnywhereSubscriptionTerm),
  status: S.optional(S.String),
  autoRenew: S.optional(S.Boolean),
  licenseArns: S.optional(StringList),
  licenses: S.optional(LicenseList),
  tags: S.optional(TagMap),
}) {}
export const EksAnywhereSubscriptionList = S.Array(EksAnywhereSubscription);
export const IdentityProviderConfigs = S.Array(IdentityProviderConfig);
export class InsightsFilter extends S.Class<InsightsFilter>("InsightsFilter")({
  categories: S.optional(CategoryList),
  kubernetesVersions: S.optional(StringList),
  statuses: S.optional(InsightStatusValueList),
}) {}
export class ConnectorConfigRequest extends S.Class<ConnectorConfigRequest>(
  "ConnectorConfigRequest",
)({ roleArn: S.String, provider: S.String }) {}
export class UpdateAccessConfigRequest extends S.Class<UpdateAccessConfigRequest>(
  "UpdateAccessConfigRequest",
)({ authenticationMode: S.optional(S.String) }) {}
export class UpdateLabelsPayload extends S.Class<UpdateLabelsPayload>(
  "UpdateLabelsPayload",
)({
  addOrUpdateLabels: S.optional(labelsMap),
  removeLabels: S.optional(labelsKeyList),
}) {}
export class UpdateTaintsPayload extends S.Class<UpdateTaintsPayload>(
  "UpdateTaintsPayload",
)({
  addOrUpdateTaints: S.optional(taintsList),
  removeTaints: S.optional(taintsList),
}) {}
export const LogTypes = S.Array(S.String);
export class AssociateAccessPolicyRequest extends S.Class<AssociateAccessPolicyRequest>(
  "AssociateAccessPolicyRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    principalArn: S.String.pipe(T.HttpLabel()),
    policyArn: S.String,
    accessScope: AccessScope,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/access-entries/{principalArn}/access-policies",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAddonRequest extends S.Class<CreateAddonRequest>(
  "CreateAddonRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    addonName: S.String,
    addonVersion: S.optional(S.String),
    serviceAccountRoleArn: S.optional(S.String),
    resolveConflicts: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
    configurationValues: S.optional(S.String),
    podIdentityAssociations: S.optional(AddonPodIdentityAssociationsList),
    namespaceConfig: S.optional(AddonNamespaceConfigRequest),
  },
  T.all(
    T.Http({ method: "POST", uri: "/clusters/{clusterName}/addons" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEksAnywhereSubscriptionRequest extends S.Class<CreateEksAnywhereSubscriptionRequest>(
  "CreateEksAnywhereSubscriptionRequest",
)(
  {
    name: S.String,
    term: EksAnywhereSubscriptionTerm,
    licenseQuantity: S.optional(S.Number),
    licenseType: S.optional(S.String),
    autoRenew: S.optional(S.Boolean),
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/eks-anywhere-subscriptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PodIdentityAssociation extends S.Class<PodIdentityAssociation>(
  "PodIdentityAssociation",
)({
  clusterName: S.optional(S.String),
  namespace: S.optional(S.String),
  serviceAccount: S.optional(S.String),
  roleArn: S.optional(S.String),
  associationArn: S.optional(S.String),
  associationId: S.optional(S.String),
  tags: S.optional(TagMap),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ownerArn: S.optional(S.String),
  disableSessionTags: S.optional(S.Boolean),
  targetRoleArn: S.optional(S.String),
  externalId: S.optional(S.String),
}) {}
export class DeletePodIdentityAssociationResponse extends S.Class<DeletePodIdentityAssociationResponse>(
  "DeletePodIdentityAssociationResponse",
)({ association: S.optional(PodIdentityAssociation) }) {}
export class VpcConfigResponse extends S.Class<VpcConfigResponse>(
  "VpcConfigResponse",
)({
  subnetIds: S.optional(StringList),
  securityGroupIds: S.optional(StringList),
  clusterSecurityGroupId: S.optional(S.String),
  vpcId: S.optional(S.String),
  endpointPublicAccess: S.optional(S.Boolean),
  endpointPrivateAccess: S.optional(S.Boolean),
  publicAccessCidrs: S.optional(StringList),
}) {}
export class ElasticLoadBalancing extends S.Class<ElasticLoadBalancing>(
  "ElasticLoadBalancing",
)({ enabled: S.optional(S.Boolean) }) {}
export class KubernetesNetworkConfigResponse extends S.Class<KubernetesNetworkConfigResponse>(
  "KubernetesNetworkConfigResponse",
)({
  serviceIpv4Cidr: S.optional(S.String),
  serviceIpv6Cidr: S.optional(S.String),
  ipFamily: S.optional(S.String),
  elasticLoadBalancing: S.optional(ElasticLoadBalancing),
}) {}
export class LogSetup extends S.Class<LogSetup>("LogSetup")({
  types: S.optional(LogTypes),
  enabled: S.optional(S.Boolean),
}) {}
export const LogSetups = S.Array(LogSetup);
export class Logging extends S.Class<Logging>("Logging")({
  clusterLogging: S.optional(LogSetups),
}) {}
export class OIDC extends S.Class<OIDC>("OIDC")({
  issuer: S.optional(S.String),
}) {}
export class Identity extends S.Class<Identity>("Identity")({
  oidc: S.optional(OIDC),
}) {}
export class Certificate extends S.Class<Certificate>("Certificate")({
  data: S.optional(S.String),
}) {}
export class Provider extends S.Class<Provider>("Provider")({
  keyArn: S.optional(S.String),
}) {}
export class EncryptionConfig extends S.Class<EncryptionConfig>(
  "EncryptionConfig",
)({ resources: S.optional(StringList), provider: S.optional(Provider) }) {}
export const EncryptionConfigList = S.Array(EncryptionConfig);
export class ConnectorConfigResponse extends S.Class<ConnectorConfigResponse>(
  "ConnectorConfigResponse",
)({
  activationId: S.optional(S.String),
  activationCode: S.optional(S.String),
  activationExpiry: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  provider: S.optional(S.String),
  roleArn: S.optional(S.String),
}) {}
export class ClusterIssue extends S.Class<ClusterIssue>("ClusterIssue")({
  code: S.optional(S.String),
  message: S.optional(S.String),
  resourceIds: S.optional(StringList),
}) {}
export const ClusterIssueList = S.Array(ClusterIssue);
export class ClusterHealth extends S.Class<ClusterHealth>("ClusterHealth")({
  issues: S.optional(ClusterIssueList),
}) {}
export class ControlPlanePlacementResponse extends S.Class<ControlPlanePlacementResponse>(
  "ControlPlanePlacementResponse",
)({ groupName: S.optional(S.String) }) {}
export class OutpostConfigResponse extends S.Class<OutpostConfigResponse>(
  "OutpostConfigResponse",
)({
  outpostArns: StringList,
  controlPlaneInstanceType: S.String,
  controlPlanePlacement: S.optional(ControlPlanePlacementResponse),
}) {}
export class AccessConfigResponse extends S.Class<AccessConfigResponse>(
  "AccessConfigResponse",
)({
  bootstrapClusterCreatorAdminPermissions: S.optional(S.Boolean),
  authenticationMode: S.optional(S.String),
}) {}
export class UpgradePolicyResponse extends S.Class<UpgradePolicyResponse>(
  "UpgradePolicyResponse",
)({ supportType: S.optional(S.String) }) {}
export class ZonalShiftConfigResponse extends S.Class<ZonalShiftConfigResponse>(
  "ZonalShiftConfigResponse",
)({ enabled: S.optional(S.Boolean) }) {}
export class RemoteNodeNetwork extends S.Class<RemoteNodeNetwork>(
  "RemoteNodeNetwork",
)({ cidrs: S.optional(StringList) }) {}
export const RemoteNodeNetworkList = S.Array(RemoteNodeNetwork);
export class RemotePodNetwork extends S.Class<RemotePodNetwork>(
  "RemotePodNetwork",
)({ cidrs: S.optional(StringList) }) {}
export const RemotePodNetworkList = S.Array(RemotePodNetwork);
export class RemoteNetworkConfigResponse extends S.Class<RemoteNetworkConfigResponse>(
  "RemoteNetworkConfigResponse",
)({
  remoteNodeNetworks: S.optional(RemoteNodeNetworkList),
  remotePodNetworks: S.optional(RemotePodNetworkList),
}) {}
export class ComputeConfigResponse extends S.Class<ComputeConfigResponse>(
  "ComputeConfigResponse",
)({
  enabled: S.optional(S.Boolean),
  nodePools: S.optional(StringList),
  nodeRoleArn: S.optional(S.String),
}) {}
export class BlockStorage extends S.Class<BlockStorage>("BlockStorage")({
  enabled: S.optional(S.Boolean),
}) {}
export class StorageConfigResponse extends S.Class<StorageConfigResponse>(
  "StorageConfigResponse",
)({ blockStorage: S.optional(BlockStorage) }) {}
export class Cluster extends S.Class<Cluster>("Cluster")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
  endpoint: S.optional(S.String),
  roleArn: S.optional(S.String),
  resourcesVpcConfig: S.optional(VpcConfigResponse),
  kubernetesNetworkConfig: S.optional(KubernetesNetworkConfigResponse),
  logging: S.optional(Logging),
  identity: S.optional(Identity),
  status: S.optional(S.String),
  certificateAuthority: S.optional(Certificate),
  clientRequestToken: S.optional(S.String),
  platformVersion: S.optional(S.String),
  tags: S.optional(TagMap),
  encryptionConfig: S.optional(EncryptionConfigList),
  connectorConfig: S.optional(ConnectorConfigResponse),
  id: S.optional(S.String),
  health: S.optional(ClusterHealth),
  outpostConfig: S.optional(OutpostConfigResponse),
  accessConfig: S.optional(AccessConfigResponse),
  upgradePolicy: S.optional(UpgradePolicyResponse),
  zonalShiftConfig: S.optional(ZonalShiftConfigResponse),
  remoteNetworkConfig: S.optional(RemoteNetworkConfigResponse),
  computeConfig: S.optional(ComputeConfigResponse),
  storageConfig: S.optional(StorageConfigResponse),
  deletionProtection: S.optional(S.Boolean),
  controlPlaneScalingConfig: S.optional(ControlPlaneScalingConfig),
}) {}
export class DeregisterClusterResponse extends S.Class<DeregisterClusterResponse>(
  "DeregisterClusterResponse",
)({ cluster: S.optional(Cluster) }) {}
export class AccessEntry extends S.Class<AccessEntry>("AccessEntry")({
  clusterName: S.optional(S.String),
  principalArn: S.optional(S.String),
  kubernetesGroups: S.optional(StringList),
  accessEntryArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
  username: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export class DescribeAccessEntryResponse extends S.Class<DescribeAccessEntryResponse>(
  "DescribeAccessEntryResponse",
)({ accessEntry: S.optional(AccessEntry) }) {}
export class AddonIssue extends S.Class<AddonIssue>("AddonIssue")({
  code: S.optional(S.String),
  message: S.optional(S.String),
  resourceIds: S.optional(StringList),
}) {}
export const AddonIssueList = S.Array(AddonIssue);
export class AddonHealth extends S.Class<AddonHealth>("AddonHealth")({
  issues: S.optional(AddonIssueList),
}) {}
export class MarketplaceInformation extends S.Class<MarketplaceInformation>(
  "MarketplaceInformation",
)({ productId: S.optional(S.String), productUrl: S.optional(S.String) }) {}
export class AddonNamespaceConfigResponse extends S.Class<AddonNamespaceConfigResponse>(
  "AddonNamespaceConfigResponse",
)({ namespace: S.optional(S.String) }) {}
export class Addon extends S.Class<Addon>("Addon")({
  addonName: S.optional(S.String),
  clusterName: S.optional(S.String),
  status: S.optional(S.String),
  addonVersion: S.optional(S.String),
  health: S.optional(AddonHealth),
  addonArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  serviceAccountRoleArn: S.optional(S.String),
  tags: S.optional(TagMap),
  publisher: S.optional(S.String),
  owner: S.optional(S.String),
  marketplaceInformation: S.optional(MarketplaceInformation),
  configurationValues: S.optional(S.String),
  podIdentityAssociations: S.optional(StringList),
  namespaceConfig: S.optional(AddonNamespaceConfigResponse),
}) {}
export class DescribeAddonResponse extends S.Class<DescribeAddonResponse>(
  "DescribeAddonResponse",
)({ addon: S.optional(Addon) }) {}
export class ArgoCdAwsIdcConfigResponse extends S.Class<ArgoCdAwsIdcConfigResponse>(
  "ArgoCdAwsIdcConfigResponse",
)({
  idcInstanceArn: S.optional(S.String),
  idcRegion: S.optional(S.String),
  idcManagedApplicationArn: S.optional(S.String),
}) {}
export class SsoIdentity extends S.Class<SsoIdentity>("SsoIdentity")({
  id: S.String,
  type: S.String,
}) {}
export const SsoIdentityList = S.Array(SsoIdentity);
export class ArgoCdRoleMapping extends S.Class<ArgoCdRoleMapping>(
  "ArgoCdRoleMapping",
)({ role: S.String, identities: SsoIdentityList }) {}
export const ArgoCdRoleMappingList = S.Array(ArgoCdRoleMapping);
export class ArgoCdNetworkAccessConfigResponse extends S.Class<ArgoCdNetworkAccessConfigResponse>(
  "ArgoCdNetworkAccessConfigResponse",
)({ vpceIds: S.optional(StringList) }) {}
export class ArgoCdConfigResponse extends S.Class<ArgoCdConfigResponse>(
  "ArgoCdConfigResponse",
)({
  namespace: S.optional(S.String),
  awsIdc: S.optional(ArgoCdAwsIdcConfigResponse),
  rbacRoleMappings: S.optional(ArgoCdRoleMappingList),
  networkAccess: S.optional(ArgoCdNetworkAccessConfigResponse),
  serverUrl: S.optional(S.String),
}) {}
export class CapabilityConfigurationResponse extends S.Class<CapabilityConfigurationResponse>(
  "CapabilityConfigurationResponse",
)({ argoCd: S.optional(ArgoCdConfigResponse) }) {}
export class CapabilityIssue extends S.Class<CapabilityIssue>(
  "CapabilityIssue",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export const CapabilityIssueList = S.Array(CapabilityIssue);
export class CapabilityHealth extends S.Class<CapabilityHealth>(
  "CapabilityHealth",
)({ issues: S.optional(CapabilityIssueList) }) {}
export class Capability extends S.Class<Capability>("Capability")({
  capabilityName: S.optional(S.String),
  arn: S.optional(S.String),
  clusterName: S.optional(S.String),
  type: S.optional(S.String),
  roleArn: S.optional(S.String),
  status: S.optional(S.String),
  version: S.optional(S.String),
  configuration: S.optional(CapabilityConfigurationResponse),
  tags: S.optional(TagMap),
  health: S.optional(CapabilityHealth),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  deletePropagationPolicy: S.optional(S.String),
}) {}
export class DescribeCapabilityResponse extends S.Class<DescribeCapabilityResponse>(
  "DescribeCapabilityResponse",
)({ capability: S.optional(Capability) }) {}
export class DescribeClusterResponse extends S.Class<DescribeClusterResponse>(
  "DescribeClusterResponse",
)({ cluster: S.optional(Cluster) }) {}
export class DescribeEksAnywhereSubscriptionResponse extends S.Class<DescribeEksAnywhereSubscriptionResponse>(
  "DescribeEksAnywhereSubscriptionResponse",
)({ subscription: S.optional(EksAnywhereSubscription) }) {}
export const FargateProfileLabel = S.Record({ key: S.String, value: S.String });
export class FargateProfileSelector extends S.Class<FargateProfileSelector>(
  "FargateProfileSelector",
)({
  namespace: S.optional(S.String),
  labels: S.optional(FargateProfileLabel),
}) {}
export const FargateProfileSelectors = S.Array(FargateProfileSelector);
export class FargateProfileIssue extends S.Class<FargateProfileIssue>(
  "FargateProfileIssue",
)({
  code: S.optional(S.String),
  message: S.optional(S.String),
  resourceIds: S.optional(StringList),
}) {}
export const FargateProfileIssueList = S.Array(FargateProfileIssue);
export class FargateProfileHealth extends S.Class<FargateProfileHealth>(
  "FargateProfileHealth",
)({ issues: S.optional(FargateProfileIssueList) }) {}
export class FargateProfile extends S.Class<FargateProfile>("FargateProfile")({
  fargateProfileName: S.optional(S.String),
  fargateProfileArn: S.optional(S.String),
  clusterName: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  podExecutionRoleArn: S.optional(S.String),
  subnets: S.optional(StringList),
  selectors: S.optional(FargateProfileSelectors),
  status: S.optional(S.String),
  tags: S.optional(TagMap),
  health: S.optional(FargateProfileHealth),
}) {}
export class DescribeFargateProfileResponse extends S.Class<DescribeFargateProfileResponse>(
  "DescribeFargateProfileResponse",
)({ fargateProfile: S.optional(FargateProfile) }) {}
export class DescribeIdentityProviderConfigRequest extends S.Class<DescribeIdentityProviderConfigRequest>(
  "DescribeIdentityProviderConfigRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    identityProviderConfig: IdentityProviderConfig,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/identity-provider-configs/describe",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInsightsRefreshResponse extends S.Class<DescribeInsightsRefreshResponse>(
  "DescribeInsightsRefreshResponse",
)({
  message: S.optional(S.String),
  status: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class AutoScalingGroup extends S.Class<AutoScalingGroup>(
  "AutoScalingGroup",
)({ name: S.optional(S.String) }) {}
export const AutoScalingGroupList = S.Array(AutoScalingGroup);
export class NodegroupResources extends S.Class<NodegroupResources>(
  "NodegroupResources",
)({
  autoScalingGroups: S.optional(AutoScalingGroupList),
  remoteAccessSecurityGroup: S.optional(S.String),
}) {}
export class Issue extends S.Class<Issue>("Issue")({
  code: S.optional(S.String),
  message: S.optional(S.String),
  resourceIds: S.optional(StringList),
}) {}
export const IssueList = S.Array(Issue);
export class NodegroupHealth extends S.Class<NodegroupHealth>(
  "NodegroupHealth",
)({ issues: S.optional(IssueList) }) {}
export class NodeRepairConfigOverrides extends S.Class<NodeRepairConfigOverrides>(
  "NodeRepairConfigOverrides",
)({
  nodeMonitoringCondition: S.optional(S.String),
  nodeUnhealthyReason: S.optional(S.String),
  minRepairWaitTimeMins: S.optional(S.Number),
  repairAction: S.optional(S.String),
}) {}
export const NodeRepairConfigOverridesList = S.Array(NodeRepairConfigOverrides);
export class NodeRepairConfig extends S.Class<NodeRepairConfig>(
  "NodeRepairConfig",
)({
  enabled: S.optional(S.Boolean),
  maxUnhealthyNodeThresholdCount: S.optional(S.Number),
  maxUnhealthyNodeThresholdPercentage: S.optional(S.Number),
  maxParallelNodesRepairedCount: S.optional(S.Number),
  maxParallelNodesRepairedPercentage: S.optional(S.Number),
  nodeRepairConfigOverrides: S.optional(NodeRepairConfigOverridesList),
}) {}
export class Nodegroup extends S.Class<Nodegroup>("Nodegroup")({
  nodegroupName: S.optional(S.String),
  nodegroupArn: S.optional(S.String),
  clusterName: S.optional(S.String),
  version: S.optional(S.String),
  releaseVersion: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  capacityType: S.optional(S.String),
  scalingConfig: S.optional(NodegroupScalingConfig),
  instanceTypes: S.optional(StringList),
  subnets: S.optional(StringList),
  remoteAccess: S.optional(RemoteAccessConfig),
  amiType: S.optional(S.String),
  nodeRole: S.optional(S.String),
  labels: S.optional(labelsMap),
  taints: S.optional(taintsList),
  resources: S.optional(NodegroupResources),
  diskSize: S.optional(S.Number),
  health: S.optional(NodegroupHealth),
  updateConfig: S.optional(NodegroupUpdateConfig),
  nodeRepairConfig: S.optional(NodeRepairConfig),
  launchTemplate: S.optional(LaunchTemplateSpecification),
  tags: S.optional(TagMap),
}) {}
export class DescribeNodegroupResponse extends S.Class<DescribeNodegroupResponse>(
  "DescribeNodegroupResponse",
)({ nodegroup: S.optional(Nodegroup) }) {}
export class DescribePodIdentityAssociationResponse extends S.Class<DescribePodIdentityAssociationResponse>(
  "DescribePodIdentityAssociationResponse",
)({ association: S.optional(PodIdentityAssociation) }) {}
export class UpdateParam extends S.Class<UpdateParam>("UpdateParam")({
  type: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const UpdateParams = S.Array(UpdateParam);
export class ErrorDetail extends S.Class<ErrorDetail>("ErrorDetail")({
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
  resourceIds: S.optional(StringList),
}) {}
export const ErrorDetails = S.Array(ErrorDetail);
export class Update extends S.Class<Update>("Update")({
  id: S.optional(S.String),
  status: S.optional(S.String),
  type: S.optional(S.String),
  params: S.optional(UpdateParams),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  errors: S.optional(ErrorDetails),
}) {}
export class DisassociateIdentityProviderConfigResponse extends S.Class<DisassociateIdentityProviderConfigResponse>(
  "DisassociateIdentityProviderConfigResponse",
)({ update: S.optional(Update) }) {}
export class ListAccessEntriesResponse extends S.Class<ListAccessEntriesResponse>(
  "ListAccessEntriesResponse",
)({ accessEntries: S.optional(StringList), nextToken: S.optional(S.String) }) {}
export class ListAddonsResponse extends S.Class<ListAddonsResponse>(
  "ListAddonsResponse",
)({ addons: S.optional(StringList), nextToken: S.optional(S.String) }) {}
export class ListClustersResponse extends S.Class<ListClustersResponse>(
  "ListClustersResponse",
)({ clusters: S.optional(StringList), nextToken: S.optional(S.String) }) {}
export class ListEksAnywhereSubscriptionsResponse extends S.Class<ListEksAnywhereSubscriptionsResponse>(
  "ListEksAnywhereSubscriptionsResponse",
)({
  subscriptions: S.optional(EksAnywhereSubscriptionList),
  nextToken: S.optional(S.String),
}) {}
export class ListFargateProfilesResponse extends S.Class<ListFargateProfilesResponse>(
  "ListFargateProfilesResponse",
)({
  fargateProfileNames: S.optional(StringList),
  nextToken: S.optional(S.String),
}) {}
export class ListIdentityProviderConfigsResponse extends S.Class<ListIdentityProviderConfigsResponse>(
  "ListIdentityProviderConfigsResponse",
)({
  identityProviderConfigs: S.optional(IdentityProviderConfigs),
  nextToken: S.optional(S.String),
}) {}
export class ListInsightsRequest extends S.Class<ListInsightsRequest>(
  "ListInsightsRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    filter: S.optional(InsightsFilter),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/clusters/{clusterName}/insights" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNodegroupsResponse extends S.Class<ListNodegroupsResponse>(
  "ListNodegroupsResponse",
)({ nodegroups: S.optional(StringList), nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class ListUpdatesResponse extends S.Class<ListUpdatesResponse>(
  "ListUpdatesResponse",
)({ updateIds: S.optional(StringList), nextToken: S.optional(S.String) }) {}
export class RegisterClusterRequest extends S.Class<RegisterClusterRequest>(
  "RegisterClusterRequest",
)(
  {
    name: S.String,
    connectorConfig: ConnectorConfigRequest,
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cluster-registrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartInsightsRefreshResponse extends S.Class<StartInsightsRefreshResponse>(
  "StartInsightsRefreshResponse",
)({ message: S.optional(S.String), status: S.optional(S.String) }) {}
export class UpdateAccessEntryResponse extends S.Class<UpdateAccessEntryResponse>(
  "UpdateAccessEntryResponse",
)({ accessEntry: S.optional(AccessEntry) }) {}
export class UpdateAddonResponse extends S.Class<UpdateAddonResponse>(
  "UpdateAddonResponse",
)({ update: S.optional(Update) }) {}
export class KubernetesNetworkConfigRequest extends S.Class<KubernetesNetworkConfigRequest>(
  "KubernetesNetworkConfigRequest",
)({
  serviceIpv4Cidr: S.optional(S.String),
  ipFamily: S.optional(S.String),
  elasticLoadBalancing: S.optional(ElasticLoadBalancing),
}) {}
export class StorageConfigRequest extends S.Class<StorageConfigRequest>(
  "StorageConfigRequest",
)({ blockStorage: S.optional(BlockStorage) }) {}
export class RemoteNetworkConfigRequest extends S.Class<RemoteNetworkConfigRequest>(
  "RemoteNetworkConfigRequest",
)({
  remoteNodeNetworks: S.optional(RemoteNodeNetworkList),
  remotePodNetworks: S.optional(RemotePodNetworkList),
}) {}
export class UpdateClusterConfigRequest extends S.Class<UpdateClusterConfigRequest>(
  "UpdateClusterConfigRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel()),
    resourcesVpcConfig: S.optional(VpcConfigRequest),
    logging: S.optional(Logging),
    clientRequestToken: S.optional(S.String),
    accessConfig: S.optional(UpdateAccessConfigRequest),
    upgradePolicy: S.optional(UpgradePolicyRequest),
    zonalShiftConfig: S.optional(ZonalShiftConfigRequest),
    computeConfig: S.optional(ComputeConfigRequest),
    kubernetesNetworkConfig: S.optional(KubernetesNetworkConfigRequest),
    storageConfig: S.optional(StorageConfigRequest),
    remoteNetworkConfig: S.optional(RemoteNetworkConfigRequest),
    deletionProtection: S.optional(S.Boolean),
    controlPlaneScalingConfig: S.optional(ControlPlaneScalingConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/clusters/{name}/update-config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateClusterVersionResponse extends S.Class<UpdateClusterVersionResponse>(
  "UpdateClusterVersionResponse",
)({ update: S.optional(Update) }) {}
export class UpdateEksAnywhereSubscriptionResponse extends S.Class<UpdateEksAnywhereSubscriptionResponse>(
  "UpdateEksAnywhereSubscriptionResponse",
)({ subscription: S.optional(EksAnywhereSubscription) }) {}
export class UpdateNodegroupConfigRequest extends S.Class<UpdateNodegroupConfigRequest>(
  "UpdateNodegroupConfigRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    nodegroupName: S.String.pipe(T.HttpLabel()),
    labels: S.optional(UpdateLabelsPayload),
    taints: S.optional(UpdateTaintsPayload),
    scalingConfig: S.optional(NodegroupScalingConfig),
    updateConfig: S.optional(NodegroupUpdateConfig),
    nodeRepairConfig: S.optional(NodeRepairConfig),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/node-groups/{nodegroupName}/update-config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNodegroupVersionResponse extends S.Class<UpdateNodegroupVersionResponse>(
  "UpdateNodegroupVersionResponse",
)({ update: S.optional(Update) }) {}
export class UpdatePodIdentityAssociationResponse extends S.Class<UpdatePodIdentityAssociationResponse>(
  "UpdatePodIdentityAssociationResponse",
)({ association: S.optional(PodIdentityAssociation) }) {}
export const requiredClaimsMap = S.Record({ key: S.String, value: S.String });
export class ControlPlanePlacementRequest extends S.Class<ControlPlanePlacementRequest>(
  "ControlPlanePlacementRequest",
)({ groupName: S.optional(S.String) }) {}
export class OidcIdentityProviderConfigRequest extends S.Class<OidcIdentityProviderConfigRequest>(
  "OidcIdentityProviderConfigRequest",
)({
  identityProviderConfigName: S.String,
  issuerUrl: S.String,
  clientId: S.String,
  usernameClaim: S.optional(S.String),
  usernamePrefix: S.optional(S.String),
  groupsClaim: S.optional(S.String),
  groupsPrefix: S.optional(S.String),
  requiredClaims: S.optional(requiredClaimsMap),
}) {}
export class OutpostConfigRequest extends S.Class<OutpostConfigRequest>(
  "OutpostConfigRequest",
)({
  outpostArns: StringList,
  controlPlaneInstanceType: S.String,
  controlPlanePlacement: S.optional(ControlPlanePlacementRequest),
}) {}
export class AddonPodIdentityConfiguration extends S.Class<AddonPodIdentityConfiguration>(
  "AddonPodIdentityConfiguration",
)({
  serviceAccount: S.optional(S.String),
  recommendedManagedPolicies: S.optional(StringList),
}) {}
export const AddonPodIdentityConfigurationList = S.Array(
  AddonPodIdentityConfiguration,
);
export class ClusterVersionInformation extends S.Class<ClusterVersionInformation>(
  "ClusterVersionInformation",
)({
  clusterVersion: S.optional(S.String),
  clusterType: S.optional(S.String),
  defaultPlatformVersion: S.optional(S.String),
  defaultVersion: S.optional(S.Boolean),
  releaseDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endOfStandardSupportDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  endOfExtendedSupportDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  versionStatus: S.optional(S.String),
  kubernetesPatchVersion: S.optional(S.String),
}) {}
export const ClusterVersionList = S.Array(ClusterVersionInformation);
export class AccessPolicy extends S.Class<AccessPolicy>("AccessPolicy")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const AccessPoliciesList = S.Array(AccessPolicy);
export class AssociatedAccessPolicy extends S.Class<AssociatedAccessPolicy>(
  "AssociatedAccessPolicy",
)({
  policyArn: S.optional(S.String),
  accessScope: S.optional(AccessScope),
  associatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AssociatedAccessPoliciesList = S.Array(AssociatedAccessPolicy);
export class CapabilitySummary extends S.Class<CapabilitySummary>(
  "CapabilitySummary",
)({
  capabilityName: S.optional(S.String),
  arn: S.optional(S.String),
  type: S.optional(S.String),
  status: S.optional(S.String),
  version: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CapabilitySummaryList = S.Array(CapabilitySummary);
export class PodIdentityAssociationSummary extends S.Class<PodIdentityAssociationSummary>(
  "PodIdentityAssociationSummary",
)({
  clusterName: S.optional(S.String),
  namespace: S.optional(S.String),
  serviceAccount: S.optional(S.String),
  associationArn: S.optional(S.String),
  associationId: S.optional(S.String),
  ownerArn: S.optional(S.String),
}) {}
export const PodIdentityAssociationSummaries = S.Array(
  PodIdentityAssociationSummary,
);
export class ArgoCdAwsIdcConfigRequest extends S.Class<ArgoCdAwsIdcConfigRequest>(
  "ArgoCdAwsIdcConfigRequest",
)({ idcInstanceArn: S.String, idcRegion: S.optional(S.String) }) {}
export class ArgoCdNetworkAccessConfigRequest extends S.Class<ArgoCdNetworkAccessConfigRequest>(
  "ArgoCdNetworkAccessConfigRequest",
)({ vpceIds: S.optional(StringList) }) {}
export class UpdateRoleMappings extends S.Class<UpdateRoleMappings>(
  "UpdateRoleMappings",
)({
  addOrUpdateRoleMappings: S.optional(ArgoCdRoleMappingList),
  removeRoleMappings: S.optional(ArgoCdRoleMappingList),
}) {}
export class AssociateAccessPolicyResponse extends S.Class<AssociateAccessPolicyResponse>(
  "AssociateAccessPolicyResponse",
)({
  clusterName: S.optional(S.String),
  principalArn: S.optional(S.String),
  associatedAccessPolicy: S.optional(AssociatedAccessPolicy),
}) {}
export class AssociateEncryptionConfigRequest extends S.Class<AssociateEncryptionConfigRequest>(
  "AssociateEncryptionConfigRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    encryptionConfig: EncryptionConfigList,
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/encryption-config/associate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateIdentityProviderConfigRequest extends S.Class<AssociateIdentityProviderConfigRequest>(
  "AssociateIdentityProviderConfigRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    oidc: OidcIdentityProviderConfigRequest,
    tags: S.optional(TagMap),
    clientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/identity-provider-configs/associate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAccessEntryResponse extends S.Class<CreateAccessEntryResponse>(
  "CreateAccessEntryResponse",
)({ accessEntry: S.optional(AccessEntry) }) {}
export class CreateAddonResponse extends S.Class<CreateAddonResponse>(
  "CreateAddonResponse",
)({ addon: S.optional(Addon) }) {}
export class CreateClusterRequest extends S.Class<CreateClusterRequest>(
  "CreateClusterRequest",
)(
  {
    name: S.String,
    version: S.optional(S.String),
    roleArn: S.String,
    resourcesVpcConfig: VpcConfigRequest,
    kubernetesNetworkConfig: S.optional(KubernetesNetworkConfigRequest),
    logging: S.optional(Logging),
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
    encryptionConfig: S.optional(EncryptionConfigList),
    outpostConfig: S.optional(OutpostConfigRequest),
    accessConfig: S.optional(CreateAccessConfigRequest),
    bootstrapSelfManagedAddons: S.optional(S.Boolean),
    upgradePolicy: S.optional(UpgradePolicyRequest),
    zonalShiftConfig: S.optional(ZonalShiftConfigRequest),
    remoteNetworkConfig: S.optional(RemoteNetworkConfigRequest),
    computeConfig: S.optional(ComputeConfigRequest),
    storageConfig: S.optional(StorageConfigRequest),
    deletionProtection: S.optional(S.Boolean),
    controlPlaneScalingConfig: S.optional(ControlPlaneScalingConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEksAnywhereSubscriptionResponse extends S.Class<CreateEksAnywhereSubscriptionResponse>(
  "CreateEksAnywhereSubscriptionResponse",
)({ subscription: S.optional(EksAnywhereSubscription) }) {}
export class CreateFargateProfileRequest extends S.Class<CreateFargateProfileRequest>(
  "CreateFargateProfileRequest",
)(
  {
    fargateProfileName: S.String,
    clusterName: S.String.pipe(T.HttpLabel()),
    podExecutionRoleArn: S.String,
    subnets: S.optional(StringList),
    selectors: S.optional(FargateProfileSelectors),
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/clusters/{clusterName}/fargate-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNodegroupRequest extends S.Class<CreateNodegroupRequest>(
  "CreateNodegroupRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    nodegroupName: S.String,
    scalingConfig: S.optional(NodegroupScalingConfig),
    diskSize: S.optional(S.Number),
    subnets: StringList,
    instanceTypes: S.optional(StringList),
    amiType: S.optional(S.String),
    remoteAccess: S.optional(RemoteAccessConfig),
    nodeRole: S.String,
    labels: S.optional(labelsMap),
    taints: S.optional(taintsList),
    tags: S.optional(TagMap),
    clientRequestToken: S.optional(S.String),
    launchTemplate: S.optional(LaunchTemplateSpecification),
    updateConfig: S.optional(NodegroupUpdateConfig),
    nodeRepairConfig: S.optional(NodeRepairConfig),
    capacityType: S.optional(S.String),
    version: S.optional(S.String),
    releaseVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/clusters/{clusterName}/node-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePodIdentityAssociationResponse extends S.Class<CreatePodIdentityAssociationResponse>(
  "CreatePodIdentityAssociationResponse",
)({ association: S.optional(PodIdentityAssociation) }) {}
export class DescribeAddonConfigurationResponse extends S.Class<DescribeAddonConfigurationResponse>(
  "DescribeAddonConfigurationResponse",
)({
  addonName: S.optional(S.String),
  addonVersion: S.optional(S.String),
  configurationSchema: S.optional(S.String),
  podIdentityConfiguration: S.optional(AddonPodIdentityConfigurationList),
}) {}
export class DescribeClusterVersionsResponse extends S.Class<DescribeClusterVersionsResponse>(
  "DescribeClusterVersionsResponse",
)({
  nextToken: S.optional(S.String),
  clusterVersions: S.optional(ClusterVersionList),
}) {}
export class ListAccessPoliciesResponse extends S.Class<ListAccessPoliciesResponse>(
  "ListAccessPoliciesResponse",
)({
  accessPolicies: S.optional(AccessPoliciesList),
  nextToken: S.optional(S.String),
}) {}
export class ListAssociatedAccessPoliciesResponse extends S.Class<ListAssociatedAccessPoliciesResponse>(
  "ListAssociatedAccessPoliciesResponse",
)({
  clusterName: S.optional(S.String),
  principalArn: S.optional(S.String),
  nextToken: S.optional(S.String),
  associatedAccessPolicies: S.optional(AssociatedAccessPoliciesList),
}) {}
export class ListCapabilitiesResponse extends S.Class<ListCapabilitiesResponse>(
  "ListCapabilitiesResponse",
)({
  capabilities: S.optional(CapabilitySummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListPodIdentityAssociationsResponse extends S.Class<ListPodIdentityAssociationsResponse>(
  "ListPodIdentityAssociationsResponse",
)({
  associations: S.optional(PodIdentityAssociationSummaries),
  nextToken: S.optional(S.String),
}) {}
export class RegisterClusterResponse extends S.Class<RegisterClusterResponse>(
  "RegisterClusterResponse",
)({ cluster: S.optional(Cluster) }) {}
export class UpdateClusterConfigResponse extends S.Class<UpdateClusterConfigResponse>(
  "UpdateClusterConfigResponse",
)({ update: S.optional(Update) }) {}
export class UpdateNodegroupConfigResponse extends S.Class<UpdateNodegroupConfigResponse>(
  "UpdateNodegroupConfigResponse",
)({ update: S.optional(Update) }) {}
export class InsightStatus extends S.Class<InsightStatus>("InsightStatus")({
  status: S.optional(S.String),
  reason: S.optional(S.String),
}) {}
export const AdditionalInfoMap = S.Record({ key: S.String, value: S.String });
export class InsightResourceDetail extends S.Class<InsightResourceDetail>(
  "InsightResourceDetail",
)({
  insightStatus: S.optional(InsightStatus),
  kubernetesResourceUri: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const InsightResourceDetails = S.Array(InsightResourceDetail);
export class UpdateArgoCdConfig extends S.Class<UpdateArgoCdConfig>(
  "UpdateArgoCdConfig",
)({
  rbacRoleMappings: S.optional(UpdateRoleMappings),
  networkAccess: S.optional(ArgoCdNetworkAccessConfigRequest),
}) {}
export class InsightSummary extends S.Class<InsightSummary>("InsightSummary")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  category: S.optional(S.String),
  kubernetesVersion: S.optional(S.String),
  lastRefreshTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastTransitionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  description: S.optional(S.String),
  insightStatus: S.optional(InsightStatus),
}) {}
export const InsightSummaries = S.Array(InsightSummary);
export class UpdateCapabilityConfiguration extends S.Class<UpdateCapabilityConfiguration>(
  "UpdateCapabilityConfiguration",
)({ argoCd: S.optional(UpdateArgoCdConfig) }) {}
export class Compatibility extends S.Class<Compatibility>("Compatibility")({
  clusterVersion: S.optional(S.String),
  platformVersions: S.optional(StringList),
  defaultVersion: S.optional(S.Boolean),
}) {}
export const Compatibilities = S.Array(Compatibility);
export class AddonCompatibilityDetail extends S.Class<AddonCompatibilityDetail>(
  "AddonCompatibilityDetail",
)({ name: S.optional(S.String), compatibleVersions: S.optional(StringList) }) {}
export const AddonCompatibilityDetails = S.Array(AddonCompatibilityDetail);
export class AssociateEncryptionConfigResponse extends S.Class<AssociateEncryptionConfigResponse>(
  "AssociateEncryptionConfigResponse",
)({ update: S.optional(Update) }) {}
export class AssociateIdentityProviderConfigResponse extends S.Class<AssociateIdentityProviderConfigResponse>(
  "AssociateIdentityProviderConfigResponse",
)({ update: S.optional(Update), tags: S.optional(TagMap) }) {}
export class CreateClusterResponse extends S.Class<CreateClusterResponse>(
  "CreateClusterResponse",
)({ cluster: S.optional(Cluster) }) {}
export class CreateFargateProfileResponse extends S.Class<CreateFargateProfileResponse>(
  "CreateFargateProfileResponse",
)({ fargateProfile: S.optional(FargateProfile) }) {}
export class CreateNodegroupResponse extends S.Class<CreateNodegroupResponse>(
  "CreateNodegroupResponse",
)({ nodegroup: S.optional(Nodegroup) }) {}
export class DeleteEksAnywhereSubscriptionResponse extends S.Class<DeleteEksAnywhereSubscriptionResponse>(
  "DeleteEksAnywhereSubscriptionResponse",
)({ subscription: S.optional(EksAnywhereSubscription) }) {}
export class DescribeUpdateResponse extends S.Class<DescribeUpdateResponse>(
  "DescribeUpdateResponse",
)({ update: S.optional(Update) }) {}
export class ListInsightsResponse extends S.Class<ListInsightsResponse>(
  "ListInsightsResponse",
)({
  insights: S.optional(InsightSummaries),
  nextToken: S.optional(S.String),
}) {}
export class UpdateCapabilityRequest extends S.Class<UpdateCapabilityRequest>(
  "UpdateCapabilityRequest",
)(
  {
    clusterName: S.String.pipe(T.HttpLabel()),
    capabilityName: S.String.pipe(T.HttpLabel()),
    roleArn: S.optional(S.String),
    configuration: S.optional(UpdateCapabilityConfiguration),
    clientRequestToken: S.optional(S.String),
    deletePropagationPolicy: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/clusters/{clusterName}/capabilities/{capabilityName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ArgoCdConfigRequest extends S.Class<ArgoCdConfigRequest>(
  "ArgoCdConfigRequest",
)({
  namespace: S.optional(S.String),
  awsIdc: ArgoCdAwsIdcConfigRequest,
  rbacRoleMappings: S.optional(ArgoCdRoleMappingList),
  networkAccess: S.optional(ArgoCdNetworkAccessConfigRequest),
}) {}
export class AddonVersionInfo extends S.Class<AddonVersionInfo>(
  "AddonVersionInfo",
)({
  addonVersion: S.optional(S.String),
  architecture: S.optional(StringList),
  computeTypes: S.optional(StringList),
  compatibilities: S.optional(Compatibilities),
  requiresConfiguration: S.optional(S.Boolean),
  requiresIamPermissions: S.optional(S.Boolean),
}) {}
export const AddonVersionInfoList = S.Array(AddonVersionInfo);
export class OidcIdentityProviderConfig extends S.Class<OidcIdentityProviderConfig>(
  "OidcIdentityProviderConfig",
)({
  identityProviderConfigName: S.optional(S.String),
  identityProviderConfigArn: S.optional(S.String),
  clusterName: S.optional(S.String),
  issuerUrl: S.optional(S.String),
  clientId: S.optional(S.String),
  usernameClaim: S.optional(S.String),
  usernamePrefix: S.optional(S.String),
  groupsClaim: S.optional(S.String),
  groupsPrefix: S.optional(S.String),
  requiredClaims: S.optional(requiredClaimsMap),
  tags: S.optional(TagMap),
  status: S.optional(S.String),
}) {}
export class ClientStat extends S.Class<ClientStat>("ClientStat")({
  userAgent: S.optional(S.String),
  numberOfRequestsLast30Days: S.optional(S.Number),
  lastRequestTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ClientStats = S.Array(ClientStat);
export class CapabilityConfigurationRequest extends S.Class<CapabilityConfigurationRequest>(
  "CapabilityConfigurationRequest",
)({ argoCd: S.optional(ArgoCdConfigRequest) }) {}
export class AddonInfo extends S.Class<AddonInfo>("AddonInfo")({
  addonName: S.optional(S.String),
  type: S.optional(S.String),
  addonVersions: S.optional(AddonVersionInfoList),
  publisher: S.optional(S.String),
  owner: S.optional(S.String),
  marketplaceInformation: S.optional(MarketplaceInformation),
  defaultNamespace: S.optional(S.String),
}) {}
export const Addons = S.Array(AddonInfo);
export class IdentityProviderConfigResponse extends S.Class<IdentityProviderConfigResponse>(
  "IdentityProviderConfigResponse",
)({ oidc: S.optional(OidcIdentityProviderConfig) }) {}
export class DeprecationDetail extends S.Class<DeprecationDetail>(
  "DeprecationDetail",
)({
  usage: S.optional(S.String),
  replacedWith: S.optional(S.String),
  stopServingVersion: S.optional(S.String),
  startServingReplacementVersion: S.optional(S.String),
  clientStats: S.optional(ClientStats),
}) {}
export const DeprecationDetails = S.Array(DeprecationDetail);
export class CreateCapabilityRequest extends S.Class<CreateCapabilityRequest>(
  "CreateCapabilityRequest",
)(
  {
    capabilityName: S.String,
    clusterName: S.String.pipe(T.HttpLabel()),
    clientRequestToken: S.optional(S.String),
    type: S.String,
    roleArn: S.String,
    configuration: S.optional(CapabilityConfigurationRequest),
    tags: S.optional(TagMap),
    deletePropagationPolicy: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/clusters/{clusterName}/capabilities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAddonResponse extends S.Class<DeleteAddonResponse>(
  "DeleteAddonResponse",
)({ addon: S.optional(Addon) }) {}
export class DeleteClusterResponse extends S.Class<DeleteClusterResponse>(
  "DeleteClusterResponse",
)({ cluster: S.optional(Cluster) }) {}
export class DeleteFargateProfileResponse extends S.Class<DeleteFargateProfileResponse>(
  "DeleteFargateProfileResponse",
)({ fargateProfile: S.optional(FargateProfile) }) {}
export class DeleteNodegroupResponse extends S.Class<DeleteNodegroupResponse>(
  "DeleteNodegroupResponse",
)({ nodegroup: S.optional(Nodegroup) }) {}
export class DescribeAddonVersionsResponse extends S.Class<DescribeAddonVersionsResponse>(
  "DescribeAddonVersionsResponse",
)({ addons: S.optional(Addons), nextToken: S.optional(S.String) }) {}
export class DescribeIdentityProviderConfigResponse extends S.Class<DescribeIdentityProviderConfigResponse>(
  "DescribeIdentityProviderConfigResponse",
)({ identityProviderConfig: S.optional(IdentityProviderConfigResponse) }) {}
export class UpdateCapabilityResponse extends S.Class<UpdateCapabilityResponse>(
  "UpdateCapabilityResponse",
)({ update: S.optional(Update) }) {}
export class InsightCategorySpecificSummary extends S.Class<InsightCategorySpecificSummary>(
  "InsightCategorySpecificSummary",
)({
  deprecationDetails: S.optional(DeprecationDetails),
  addonCompatibilityDetails: S.optional(AddonCompatibilityDetails),
}) {}
export class Insight extends S.Class<Insight>("Insight")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  category: S.optional(S.String),
  kubernetesVersion: S.optional(S.String),
  lastRefreshTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastTransitionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  description: S.optional(S.String),
  insightStatus: S.optional(InsightStatus),
  recommendation: S.optional(S.String),
  additionalInfo: S.optional(AdditionalInfoMap),
  resources: S.optional(InsightResourceDetails),
  categorySpecificSummary: S.optional(InsightCategorySpecificSummary),
}) {}
export class CreateCapabilityResponse extends S.Class<CreateCapabilityResponse>(
  "CreateCapabilityResponse",
)({ capability: S.optional(Capability) }) {}
export class DeleteCapabilityResponse extends S.Class<DeleteCapabilityResponse>(
  "DeleteCapabilityResponse",
)({ capability: S.optional(Capability) }) {}
export class DescribeInsightResponse extends S.Class<DescribeInsightResponse>(
  "DescribeInsightResponse",
)({ insight: S.optional(Insight) }) {}

//# Errors
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServerException extends S.TaggedError<ServerException>()(
  "ServerException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class ClientException extends S.TaggedError<ClientException>()(
  "ClientException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {},
) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { clusterName: S.optional(S.String), message: S.optional(S.String) },
) {}
export class UnsupportedAvailabilityZoneException extends S.TaggedError<UnsupportedAvailabilityZoneException>()(
  "UnsupportedAvailabilityZoneException",
  {},
) {}
export class ResourcePropagationDelayException extends S.TaggedError<ResourcePropagationDelayException>()(
  "ResourcePropagationDelayException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes an access entry.
 */
export const describeAccessEntry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccessEntryRequest,
  output: DescribeAccessEntryResponse,
  errors: [InvalidRequestException, ResourceNotFoundException, ServerException],
}));
/**
 * Returns detailed information about a specific managed capability in your Amazon EKS cluster, including its current status, configuration, health information, and any issues that may be affecting its operation.
 */
export const describeCapability = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCapabilityRequest,
  output: DescribeCapabilityResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Returns descriptive information about a subscription.
 */
export const describeEksAnywhereSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEksAnywhereSubscriptionRequest,
    output: DescribeEksAnywhereSubscriptionResponse,
    errors: [
      ClientException,
      ResourceNotFoundException,
      ServerException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Describes an Fargate profile.
 */
export const describeFargateProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFargateProfileRequest,
    output: DescribeFargateProfileResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Returns the status of the latest on-demand cluster insights refresh operation.
 */
export const describeInsightsRefresh = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInsightsRefreshRequest,
    output: DescribeInsightsRefreshResponse,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Describes a managed node group.
 */
export const describeNodegroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNodegroupRequest,
  output: DescribeNodegroupResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns descriptive information about an EKS Pod Identity association.
 *
 * This action requires the ID of the association. You can get the ID from the response to
 * the `CreatePodIdentityAssocation` for newly created associations. Or, you can
 * list the IDs for associations with `ListPodIdentityAssociations` and filter the
 * list by namespace or service account.
 */
export const describePodIdentityAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribePodIdentityAssociationRequest,
    output: DescribePodIdentityAssociationResponse,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }));
/**
 * Disassociates an access policy from an access entry.
 */
export const disassociateAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateAccessPolicyRequest,
    output: DisassociateAccessPolicyResponse,
    errors: [
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Lists the access entries for your cluster.
 */
export const listAccessEntries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccessEntriesRequest,
  output: ListAccessEntriesResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Lists the installed add-ons.
 */
export const listAddons = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAddonsRequest,
  output: ListAddonsResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Lists the Amazon EKS clusters in your Amazon Web Services account in the specified Amazon Web Services Region.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Displays the full description of the subscription.
 */
export const listEksAnywhereSubscriptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListEksAnywhereSubscriptionsRequest,
    output: ListEksAnywhereSubscriptionsResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      ServerException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Lists the Fargate profiles associated with the specified cluster in your Amazon Web Services
 * account in the specified Amazon Web Services Region.
 */
export const listFargateProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFargateProfilesRequest,
  output: ListFargateProfilesResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Lists the identity provider configurations for your cluster.
 */
export const listIdentityProviderConfigs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListIdentityProviderConfigsRequest,
    output: ListIdentityProviderConfigsResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      ResourceNotFoundException,
      ServerException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Lists the managed node groups associated with the specified cluster in your Amazon Web Services
 * account in the specified Amazon Web Services Region. Self-managed node groups aren't listed.
 */
export const listNodegroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNodegroupsRequest,
  output: ListNodegroupsResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * List the tags for an Amazon EKS resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [BadRequestException, NotFoundException],
}));
/**
 * Lists the updates associated with an Amazon EKS resource in your Amazon Web Services account, in the
 * specified Amazon Web Services Region.
 */
export const listUpdates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUpdatesRequest,
  output: ListUpdatesResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Initiates an on-demand refresh operation for cluster insights, getting the latest analysis outside of the standard refresh schedule.
 */
export const startInsightsRefresh = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartInsightsRefreshRequest,
    output: StartInsightsRefreshResponse,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Associates the specified tags to an Amazon EKS resource with the specified
 * `resourceArn`. If existing tags on a resource are not specified in the
 * request parameters, they aren't changed. When a resource is deleted, the tags associated
 * with that resource are also deleted. Tags that you create for Amazon EKS resources don't
 * propagate to any other resources associated with the cluster. For example, if you tag a
 * cluster with this operation, that tag doesn't automatically propagate to the subnets and
 * nodes associated with the cluster.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [BadRequestException, NotFoundException],
}));
/**
 * Deletes specified tags from an Amazon EKS resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [BadRequestException, NotFoundException],
}));
/**
 * Updates an access entry.
 */
export const updateAccessEntry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessEntryRequest,
  output: UpdateAccessEntryResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates an Amazon EKS add-on.
 */
export const updateAddon = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAddonRequest,
  output: UpdateAddonResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Update an EKS Anywhere Subscription. Only auto renewal and tags can be updated after
 * subscription creation.
 */
export const updateEksAnywhereSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEksAnywhereSubscriptionRequest,
    output: UpdateEksAnywhereSubscriptionResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }));
/**
 * Updates the Kubernetes version or AMI version of an Amazon EKS managed node group.
 *
 * You can update a node group using a launch template only if the node group was
 * originally deployed with a launch template. Additionally, the launch template ID or name
 * must match what was used when the node group was created. You can update the launch
 * template version with necessary changes.
 *
 * If you need to update a custom AMI in a node group that was deployed with a launch
 * template, then update your custom AMI, specify the new ID in a new version of the launch
 * template, and then update the node group to the new version of the launch
 * template.
 *
 * If you update without a launch template, then you can update to the latest available
 * AMI version of a node group's current Kubernetes version by not specifying a Kubernetes version in
 * the request. You can update to the latest AMI version of your cluster's current Kubernetes
 * version by specifying your cluster's Kubernetes version in the request. For information about
 * Linux versions, see Amazon EKS optimized Amazon Linux AMI versions in the
 * *Amazon EKS User Guide*. For information about Windows versions, see Amazon EKS
 * optimized Windows AMI versions in the *Amazon EKS User Guide*.
 *
 * You cannot roll back a node group to an earlier Kubernetes version or AMI version.
 *
 * When a node in a managed node group is terminated due to a scaling action or update,
 * every `Pod` on that node is drained first. Amazon EKS attempts to drain the nodes
 * gracefully and will fail if it is unable to do so. You can `force` the update
 * if Amazon EKS is unable to drain the nodes as a result of a `Pod` disruption
 * budget issue.
 */
export const updateNodegroupVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateNodegroupVersionRequest,
    output: UpdateNodegroupVersionResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Updates a EKS Pod Identity association. In an update, you can change the IAM role, the target IAM role, or `disableSessionTags`.
 * You must change at least one of these in an update. An association can't be moved
 * between clusters, namespaces, or service accounts. If you need to edit the namespace
 * or service account, you need to delete the association and then create a new
 * association with your desired settings.
 *
 * Similar to Amazon Web Services IAM behavior, EKS Pod Identity associations are eventually consistent,
 * and may take several seconds to be effective after the initial API call returns
 * successfully. You must design your applications to account for these potential delays.
 * We recommend that you don’t include association create/updates in the
 * critical, high-availability code paths of your application. Instead, make changes in a
 * separate initialization or setup routine that you run less frequently.
 *
 * You can set a *target IAM role* in the same or a different
 * account for advanced scenarios. With a target role, EKS Pod Identity automatically performs two
 * role assumptions in sequence: first assuming the role in the association that is in this
 * account, then using those credentials to assume the target IAM role. This process
 * provides your Pod with temporary credentials that have the permissions defined in the
 * target role, allowing secure access to resources in another Amazon Web Services account.
 */
export const updatePodIdentityAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdatePodIdentityAssociationRequest,
    output: UpdatePodIdentityAssociationResponse,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }));
/**
 * Associates an access policy and its scope to an access entry. For more information
 * about associating access policies, see Associating and disassociating
 * access policies to and from access entries in the *Amazon EKS User Guide*.
 */
export const associateAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateAccessPolicyRequest,
    output: AssociateAccessPolicyResponse,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Creates an Amazon EKS add-on.
 *
 * Amazon EKS add-ons help to automate the provisioning and lifecycle management of common
 * operational software for Amazon EKS clusters. For more information, see Amazon EKS
 * add-ons in the *Amazon EKS User Guide*.
 */
export const createAddon = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddonRequest,
  output: CreateAddonResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Creates an EKS Anywhere subscription. When a subscription is created, it is a contract
 * agreement for the length of the term specified in the request. Licenses that are used to
 * validate support are provisioned in Amazon Web Services License Manager and the caller account is
 * granted access to EKS Anywhere Curated Packages.
 */
export const createEksAnywhereSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateEksAnywhereSubscriptionRequest,
    output: CreateEksAnywhereSubscriptionResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      ResourceLimitExceededException,
      ServerException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Creates an EKS Pod Identity association between a service account in an Amazon EKS cluster and an IAM role
 * with *EKS Pod Identity*. Use EKS Pod Identity to give temporary IAM credentials to
 * Pods and the credentials are rotated automatically.
 *
 * Amazon EKS Pod Identity associations provide the ability to manage credentials for your applications, similar to the way that Amazon EC2 instance profiles provide credentials to Amazon EC2 instances.
 *
 * If a Pod uses a service account that has an association, Amazon EKS sets environment variables
 * in the containers of the Pod. The environment variables configure the Amazon Web Services SDKs,
 * including the Command Line Interface, to use the EKS Pod Identity credentials.
 *
 * EKS Pod Identity is a simpler method than IAM roles for service
 * accounts, as this method doesn't use OIDC identity providers.
 * Additionally, you can configure a role for EKS Pod Identity once, and reuse it across
 * clusters.
 *
 * Similar to Amazon Web Services IAM behavior, EKS Pod Identity associations are eventually consistent,
 * and may take several seconds to be effective after the initial API call returns
 * successfully. You must design your applications to account for these potential delays.
 * We recommend that you don’t include association create/updates in the
 * critical, high-availability code paths of your application. Instead, make changes in a
 * separate initialization or setup routine that you run less frequently.
 *
 * You can set a *target IAM role* in the same or a different
 * account for advanced scenarios. With a target role, EKS Pod Identity automatically performs two
 * role assumptions in sequence: first assuming the role in the association that is in this
 * account, then using those credentials to assume the target IAM role. This process
 * provides your Pod with temporary credentials that have the permissions defined in the
 * target role, allowing secure access to resources in another Amazon Web Services account.
 */
export const createPodIdentityAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePodIdentityAssociationRequest,
    output: CreatePodIdentityAssociationResponse,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceLimitExceededException,
      ResourceNotFoundException,
      ServerException,
    ],
  }));
/**
 * Deletes an access entry.
 *
 * Deleting an access entry of a type other than `Standard` can cause your
 * cluster to function improperly. If you delete an access entry in error, you can recreate
 * it.
 */
export const deleteAccessEntry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessEntryRequest,
  output: DeleteAccessEntryResponse,
  errors: [InvalidRequestException, ResourceNotFoundException, ServerException],
}));
/**
 * Deletes a EKS Pod Identity association.
 *
 * The temporary Amazon Web Services credentials from the previous IAM role session might still be valid until the session expiry. If you need to immediately revoke the temporary session credentials, then go to the role in the IAM console.
 */
export const deletePodIdentityAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeletePodIdentityAssociationRequest,
    output: DeletePodIdentityAssociationResponse,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }));
/**
 * Deregisters a connected cluster to remove it from the Amazon EKS control plane.
 *
 * A connected cluster is a Kubernetes cluster that you've connected to your control plane
 * using the Amazon EKS Connector.
 */
export const deregisterCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterClusterRequest,
  output: DeregisterClusterResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Describes an Amazon EKS add-on.
 */
export const describeAddon = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAddonRequest,
  output: DescribeAddonResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Returns configuration options.
 */
export const describeAddonConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAddonConfigurationRequest,
    output: DescribeAddonConfigurationResponse,
    errors: [
      InvalidParameterException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Describes an Amazon EKS cluster.
 *
 * The API server endpoint and certificate authority data returned by this operation are
 * required for `kubelet` and `kubectl` to communicate with your
 * Kubernetes API server. For more information, see Creating or
 * updating a `kubeconfig` file for an Amazon EKS cluster.
 *
 * The API server endpoint and certificate authority data aren't available until the
 * cluster reaches the `ACTIVE` state.
 */
export const describeCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterRequest,
  output: DescribeClusterResponse,
  errors: [
    ClientException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists available Kubernetes versions for Amazon EKS clusters.
 */
export const describeClusterVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterVersionsRequest,
    output: DescribeClusterVersionsResponse,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ServerException,
    ],
  }),
);
/**
 * Lists the available access policies.
 */
export const listAccessPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccessPoliciesRequest,
  output: ListAccessPoliciesResponse,
  errors: [ServerException],
}));
/**
 * Lists the access policies associated with an access entry.
 */
export const listAssociatedAccessPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAssociatedAccessPoliciesRequest,
    output: ListAssociatedAccessPoliciesResponse,
    errors: [
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }));
/**
 * Lists all managed capabilities in your Amazon EKS cluster. You can use this operation to get an overview of all capabilities and their current status.
 */
export const listCapabilities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCapabilitiesRequest,
  output: ListCapabilitiesResponse,
  errors: [InvalidParameterException, ServerException],
}));
/**
 * List the EKS Pod Identity associations in a cluster. You can filter the list by the namespace that the
 * association is in or the service account that the association uses.
 */
export const listPodIdentityAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPodIdentityAssociationsRequest,
    output: ListPodIdentityAssociationsResponse,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Updates an Amazon EKS cluster configuration. Your cluster continues to function during the
 * update. The response output includes an update ID that you can use to track the status
 * of your cluster update with `DescribeUpdate`.
 *
 * You can use this operation to do the following actions:
 *
 * - You can use this API operation to enable or disable exporting the Kubernetes
 * control plane logs for your cluster to CloudWatch Logs. By default, cluster control plane
 * logs aren't exported to CloudWatch Logs. For more information, see Amazon EKS Cluster control plane logs in the
 *
 * *Amazon EKS User Guide*
 * .
 *
 * CloudWatch Logs ingestion, archive storage, and data scanning rates apply to
 * exported control plane logs. For more information, see CloudWatch Pricing.
 *
 * - You can also use this API operation to enable or disable public and private
 * access to your cluster's Kubernetes API server endpoint. By default, public access is
 * enabled, and private access is disabled. For more information, see
 * Cluster API server endpoint in the
 *
 * *Amazon EKS User Guide*
 * .
 *
 * - You can also use this API operation to choose different subnets and security
 * groups for the cluster. You must specify at least two subnets that are in
 * different Availability Zones. You can't change which VPC the subnets are from, the subnets
 * must be in the same VPC as the subnets that the cluster was created with. For
 * more information about the VPC requirements, see https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html in the
 *
 * *Amazon EKS User Guide*
 * .
 *
 * - You can also use this API operation to enable or disable ARC zonal shift. If
 * zonal shift is enabled, Amazon Web Services configures zonal autoshift for the cluster.
 *
 * - You can also use this API operation to add, change, or remove the
 * configuration in the cluster for EKS Hybrid Nodes. To remove the configuration,
 * use the `remoteNetworkConfig` key with an object containing both
 * subkeys with empty arrays for each. Here is an inline example:
 * "remoteNetworkConfig": { "remoteNodeNetworks": [],
 * "remotePodNetworks": [] }.
 *
 * Cluster updates are asynchronous, and they should finish within a few minutes. During
 * an update, the cluster status moves to `UPDATING` (this status transition is
 * eventually consistent). When the update is complete (either `Failed` or
 * `Successful`), the cluster status moves to `Active`.
 */
export const updateClusterConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterConfigRequest,
  output: UpdateClusterConfigResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ThrottlingException,
  ],
}));
/**
 * Updates an Amazon EKS cluster to the specified Kubernetes version. Your cluster continues to
 * function during the update. The response output includes an update ID that you can use
 * to track the status of your cluster update with the
 * `DescribeUpdate`
 * API operation.
 *
 * Cluster updates are asynchronous, and they should finish within a few minutes. During
 * an update, the cluster status moves to `UPDATING` (this status transition is
 * eventually consistent). When the update is complete (either `Failed` or
 * `Successful`), the cluster status moves to `Active`.
 *
 * If your cluster has managed node groups attached to it, all of your node groups' Kubernetes
 * versions must match the cluster's Kubernetes version in order to update the cluster to a new
 * Kubernetes version.
 */
export const updateClusterVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateClusterVersionRequest,
    output: UpdateClusterVersionResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      InvalidRequestException,
      InvalidStateException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServerException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates an Amazon EKS managed node group configuration. Your node group continues to
 * function during the update. The response output includes an update ID that you can use
 * to track the status of your node group update with the
 * `DescribeUpdate`
 * API operation. You can update the Kubernetes labels
 * and taints for a node group and the scaling and version update configuration.
 */
export const updateNodegroupConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateNodegroupConfigRequest,
    output: UpdateNodegroupConfigResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Associates an encryption configuration to an existing cluster.
 *
 * Use this API to enable encryption on existing clusters that don't already have
 * encryption enabled. This allows you to implement a defense-in-depth security strategy
 * without migrating applications to new Amazon EKS clusters.
 */
export const associateEncryptionConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateEncryptionConfigRequest,
    output: AssociateEncryptionConfigResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServerException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates an identity provider configuration to a cluster.
 *
 * If you want to authenticate identities using an identity provider, you can create an
 * identity provider configuration and associate it to your cluster. After configuring
 * authentication to your cluster you can create Kubernetes `Role` and
 * `ClusterRole` objects, assign permissions to them, and then bind them to
 * the identities using Kubernetes `RoleBinding` and `ClusterRoleBinding`
 * objects. For more information see Using RBAC
 * Authorization in the Kubernetes documentation.
 */
export const associateIdentityProviderConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateIdentityProviderConfigRequest,
    output: AssociateIdentityProviderConfigResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServerException,
      ThrottlingException,
    ],
  }));
/**
 * Creates an access entry.
 *
 * An access entry allows an IAM principal to access your cluster. Access
 * entries can replace the need to maintain entries in the `aws-auth`
 * `ConfigMap` for authentication. You have the following options for
 * authorizing an IAM principal to access Kubernetes objects on your cluster: Kubernetes
 * role-based access control (RBAC), Amazon EKS, or both. Kubernetes RBAC authorization requires you
 * to create and manage Kubernetes `Role`, `ClusterRole`,
 * `RoleBinding`, and `ClusterRoleBinding` objects, in addition
 * to managing access entries. If you use Amazon EKS authorization exclusively, you don't need
 * to create and manage Kubernetes `Role`, `ClusterRole`,
 * `RoleBinding`, and `ClusterRoleBinding` objects.
 *
 * For more information about access entries, see Access entries in the
 * *Amazon EKS User Guide*.
 */
export const createAccessEntry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessEntryRequest,
  output: CreateAccessEntryResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Creates an Fargate profile for your Amazon EKS cluster. You must have at least one
 * Fargate profile in a cluster to be able to run pods on Fargate.
 *
 * The Fargate profile allows an administrator to declare which pods run on Fargate
 * and specify which pods run on which Fargate profile. This declaration is done through
 * the profile's selectors. Each profile can have up to five selectors that contain a
 * namespace and labels. A namespace is required for every selector. The label field
 * consists of multiple optional key-value pairs. Pods that match the selectors are
 * scheduled on Fargate. If a to-be-scheduled pod matches any of the selectors in the
 * Fargate profile, then that pod is run on Fargate.
 *
 * When you create a Fargate profile, you must specify a pod execution role to use with
 * the pods that are scheduled with the profile. This role is added to the cluster's Kubernetes
 * Role
 * Based Access Control (RBAC) for authorization so that the
 * `kubelet` that is running on the Fargate infrastructure can register
 * with your Amazon EKS cluster so that it can appear in your cluster as a node. The pod
 * execution role also provides IAM permissions to the Fargate infrastructure to allow
 * read access to Amazon ECR image repositories. For more information, see Pod
 * Execution Role in the *Amazon EKS User Guide*.
 *
 * Fargate profiles are immutable. However, you can create a new updated profile to
 * replace an existing profile and then delete the original after the updated profile has
 * finished creating.
 *
 * If any Fargate profiles in a cluster are in the `DELETING` status, you
 * must wait for that Fargate profile to finish deleting before you can create any other
 * profiles in that cluster.
 *
 * For more information, see Fargate profile in the *Amazon EKS User Guide*.
 */
export const createFargateProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFargateProfileRequest,
    output: CreateFargateProfileResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceLimitExceededException,
      ServerException,
      UnsupportedAvailabilityZoneException,
    ],
  }),
);
/**
 * Creates a managed node group for an Amazon EKS cluster.
 *
 * You can only create a node group for your cluster that is equal to the current Kubernetes
 * version for the cluster. All node groups are created with the latest AMI release version
 * for the respective minor Kubernetes version of the cluster, unless you deploy a custom AMI
 * using a launch template.
 *
 * For later updates, you will only be able to update a node group using a launch
 * template only if it was originally deployed with a launch template. Additionally, the
 * launch template ID or name must match what was used when the node group was created. You
 * can update the launch template version with necessary changes. For more information
 * about using launch templates, see Customizing managed nodes with
 * launch templates.
 *
 * An Amazon EKS managed node group is an Amazon EC2 Amazon EC2 Auto Scaling group and associated Amazon EC2 instances that
 * are managed by Amazon Web Services for an Amazon EKS cluster. For more information, see Managed
 * node groups in the *Amazon EKS User Guide*.
 *
 * Windows AMI types are only supported for commercial Amazon Web Services Regions that support
 * Windows on Amazon EKS.
 */
export const createNodegroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNodegroupRequest,
  output: CreateNodegroupResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes an expired or inactive subscription. Deleting inactive subscriptions removes
 * them from the Amazon Web Services Management Console view and from list/describe API responses. Subscriptions can
 * only be cancelled within 7 days of creation and are cancelled by creating a ticket in
 * the Amazon Web Services Support Center.
 */
export const deleteEksAnywhereSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteEksAnywhereSubscriptionRequest,
    output: DeleteEksAnywhereSubscriptionResponse,
    errors: [
      ClientException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServerException,
    ],
  }));
/**
 * Describes an update to an Amazon EKS resource.
 *
 * When the status of the update is `Successful`, the update is complete. If
 * an update fails, the status is `Failed`, and an error detail explains the
 * reason for the failure.
 */
export const describeUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUpdateRequest,
  output: DescribeUpdateResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Disassociates an identity provider configuration from a cluster.
 *
 * If you disassociate an identity provider from your cluster, users included in the
 * provider can no longer access the cluster. However, you can still access the cluster
 * with IAM principals.
 */
export const disassociateIdentityProviderConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateIdentityProviderConfigRequest,
    output: DisassociateIdentityProviderConfigResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServerException,
      ThrottlingException,
    ],
  }));
/**
 * Returns a list of all insights checked for against the specified cluster. You can
 * filter which insights are returned by category, associated Kubernetes version, and
 * status. The default filter lists all categories and every status.
 *
 * The following lists the available categories:
 *
 * - `UPGRADE_READINESS`: Amazon EKS identifies issues that could impact your
 * ability to upgrade to new versions of Kubernetes. These are called upgrade insights.
 *
 * - `MISCONFIGURATION`: Amazon EKS identifies misconfiguration in your EKS
 * Hybrid Nodes setup that could impair functionality of your cluster or
 * workloads. These are called configuration insights.
 */
export const listInsights = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInsightsRequest,
  output: ListInsightsResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Connects a Kubernetes cluster to the Amazon EKS control plane.
 *
 * Any Kubernetes cluster can be connected to the Amazon EKS control plane to view current
 * information about the cluster and its nodes.
 *
 * Cluster connection requires two steps. First, send a
 * `RegisterClusterRequest`
 * to add it to the Amazon EKS control
 * plane.
 *
 * Second, a Manifest containing the `activationID` and
 * `activationCode` must be applied to the Kubernetes cluster through it's native
 * provider to provide visibility.
 *
 * After the manifest is updated and applied, the connected cluster is visible to the
 * Amazon EKS control plane. If the manifest isn't applied within three days, the connected
 * cluster will no longer be visible and must be deregistered using
 * `DeregisterCluster`.
 */
export const registerCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterClusterRequest,
  output: RegisterClusterResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourcePropagationDelayException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates an Amazon EKS control plane.
 *
 * The Amazon EKS control plane consists of control plane instances that run the Kubernetes
 * software, such as `etcd` and the API server. The control plane runs in an
 * account managed by Amazon Web Services, and the Kubernetes API is exposed by the Amazon EKS API server endpoint.
 * Each Amazon EKS cluster control plane is single tenant and unique. It runs on its own set of
 * Amazon EC2 instances.
 *
 * The cluster control plane is provisioned across multiple Availability Zones and fronted by an ELB
 * Network Load Balancer. Amazon EKS also provisions elastic network interfaces in your VPC subnets to provide
 * connectivity from the control plane instances to the nodes (for example, to support
 * `kubectl exec`, `logs`, and `proxy` data
 * flows).
 *
 * Amazon EKS nodes run in your Amazon Web Services account and connect to your cluster's control plane over
 * the Kubernetes API server endpoint and a certificate file that is created for your
 * cluster.
 *
 * You can use the `endpointPublicAccess` and
 * `endpointPrivateAccess` parameters to enable or disable public and
 * private access to your cluster's Kubernetes API server endpoint. By default, public access is
 * enabled, and private access is disabled. The
 * endpoint domain name and IP address family depends on the value of the
 * `ipFamily` for the cluster. For more information, see Amazon EKS Cluster
 * Endpoint Access Control in the
 * *Amazon EKS User Guide*
 * .
 *
 * You can use the `logging` parameter to enable or disable exporting the
 * Kubernetes control plane logs for your cluster to CloudWatch Logs. By default, cluster control plane
 * logs aren't exported to CloudWatch Logs. For more information, see Amazon EKS
 * Cluster Control Plane Logs in the
 *
 * *Amazon EKS User Guide*
 * .
 *
 * CloudWatch Logs ingestion, archive storage, and data scanning rates apply to exported
 * control plane logs. For more information, see CloudWatch Pricing.
 *
 * In most cases, it takes several minutes to create a cluster. After you create an Amazon EKS
 * cluster, you must configure your Kubernetes tooling to communicate with the API server and
 * launch nodes into your cluster. For more information, see Allowing users to
 * access your cluster and Launching Amazon EKS
 * nodes in the *Amazon EKS User Guide*.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ServerException,
    ServiceUnavailableException,
    UnsupportedAvailabilityZoneException,
  ],
}));
/**
 * Deletes an Amazon EKS add-on.
 *
 * When you remove an add-on, it's deleted from the cluster. You can always manually
 * start an add-on on the cluster using the Kubernetes API.
 */
export const deleteAddon = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAddonRequest,
  output: DeleteAddonResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Deletes an Amazon EKS cluster control plane.
 *
 * If you have active services in your cluster that are associated with a load balancer,
 * you must delete those services before deleting the cluster so that the load balancers
 * are deleted properly. Otherwise, you can have orphaned resources in your VPC that
 * prevent you from being able to delete the VPC. For more information, see Deleting a
 * cluster in the *Amazon EKS User Guide*.
 *
 * If you have managed node groups or Fargate profiles attached to the cluster, you
 * must delete them first. For more information, see `DeleteNodgroup` and
 * `DeleteFargateProfile`.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    ClientException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes an Fargate profile.
 *
 * When you delete a Fargate profile, any `Pod` running on Fargate that
 * was created with the profile is deleted. If the `Pod` matches another
 * Fargate profile, then it is scheduled on Fargate with that profile. If it no longer
 * matches any Fargate profiles, then it's not scheduled on Fargate and may remain in a
 * pending state.
 *
 * Only one Fargate profile in a cluster can be in the `DELETING` status at
 * a time. You must wait for a Fargate profile to finish deleting before you can delete
 * any other profiles in that cluster.
 */
export const deleteFargateProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFargateProfileRequest,
    output: DeleteFargateProfileResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Deletes a managed node group.
 */
export const deleteNodegroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNodegroupRequest,
  output: DeleteNodegroupResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
    ServiceUnavailableException,
  ],
}));
/**
 * Describes the versions for an add-on.
 *
 * Information such as the Kubernetes versions that you can use the add-on with, the
 * `owner`, `publisher`, and the `type` of the add-on
 * are returned.
 */
export const describeAddonVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAddonVersionsRequest,
    output: DescribeAddonVersionsResponse,
    errors: [
      InvalidParameterException,
      ResourceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Describes an identity provider configuration.
 */
export const describeIdentityProviderConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeIdentityProviderConfigRequest,
    output: DescribeIdentityProviderConfigResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      ResourceNotFoundException,
      ServerException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Updates the configuration of a managed capability in your Amazon EKS cluster. You can update the IAM role, configuration settings, and delete propagation policy for a capability.
 *
 * When you update a capability, Amazon EKS applies the changes and may restart capability components as needed. The capability remains available during the update process, but some operations may be temporarily unavailable.
 */
export const updateCapability = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCapabilityRequest,
  output: UpdateCapabilityResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Creates a managed capability resource for an Amazon EKS cluster.
 *
 * Capabilities provide fully managed capabilities to build and scale with Kubernetes. When you create a capability, Amazon EKSprovisions and manages the infrastructure required to run the capability outside of your cluster. This approach reduces operational overhead and preserves cluster resources.
 *
 * You can only create one Capability of each type on a given Amazon EKS cluster. Valid types are Argo CD for declarative GitOps deployment, Amazon Web Services Controllers for Kubernetes (ACK) for resource management, and Kube Resource Orchestrator (KRO) for Kubernetes custom resource orchestration.
 *
 * For more information, see EKS Capabilities in the *Amazon EKS User Guide*.
 */
export const createCapability = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCapabilityRequest,
  output: CreateCapabilityResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ServerException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a managed capability from your Amazon EKS cluster. When you delete a capability, Amazon EKS removes the capability infrastructure but retains all resources that were managed by the capability.
 *
 * Before deleting a capability, you should delete all Kubernetes resources that were created by the capability. After the capability is deleted, these resources become difficult to manage because the controller that managed them is no longer available. To delete resources before removing the capability, use `kubectl delete` or remove them through your GitOps workflow.
 */
export const deleteCapability = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCapabilityRequest,
  output: DeleteCapabilityResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Returns details about an insight that you specify using its ID.
 */
export const describeInsight = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInsightRequest,
  output: DescribeInsightResponse,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
