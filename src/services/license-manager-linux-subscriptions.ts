import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "License Manager Linux Subscriptions",
  serviceShapeName: "LicenseManagerLinuxSubscriptions",
});
const auth = T.AwsAuthSigv4({ name: "license-manager-linux-subscriptions" });
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
                                url: "https://license-manager-linux-subscriptions-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://license-manager-linux-subscriptions-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://license-manager-linux-subscriptions.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://license-manager-linux-subscriptions.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetServiceSettingsRequest extends S.Class<GetServiceSettingsRequest>(
  "GetServiceSettingsRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/subscription/GetServiceSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringList = S.Array(S.String);
export const SubscriptionProviderSourceList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeregisterSubscriptionProviderRequest extends S.Class<DeregisterSubscriptionProviderRequest>(
  "DeregisterSubscriptionProviderRequest",
)(
  { SubscriptionProviderArn: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/subscription/DeregisterSubscriptionProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterSubscriptionProviderResponse extends S.Class<DeregisterSubscriptionProviderResponse>(
  "DeregisterSubscriptionProviderResponse",
)({}) {}
export class GetRegisteredSubscriptionProviderRequest extends S.Class<GetRegisteredSubscriptionProviderRequest>(
  "GetRegisteredSubscriptionProviderRequest",
)(
  { SubscriptionProviderArn: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/subscription/GetRegisteredSubscriptionProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.optional(S.String),
  Values: S.optional(StringList),
  Operator: S.optional(S.String),
}) {}
export const FilterList = S.Array(Filter);
export class ListLinuxSubscriptionsRequest extends S.Class<ListLinuxSubscriptionsRequest>(
  "ListLinuxSubscriptionsRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/subscription/ListLinuxSubscriptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRegisteredSubscriptionProvidersRequest extends S.Class<ListRegisteredSubscriptionProvidersRequest>(
  "ListRegisteredSubscriptionProvidersRequest",
)(
  {
    SubscriptionProviderSources: S.optional(SubscriptionProviderSourceList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/subscription/ListRegisteredSubscriptionProviders",
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
export const Tags = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
  T.all(
    T.Http({ method: "PUT", uri: "/tags/{resourceArn}" }),
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
export class LinuxSubscriptionsDiscoverySettings extends S.Class<LinuxSubscriptionsDiscoverySettings>(
  "LinuxSubscriptionsDiscoverySettings",
)({ SourceRegions: StringList, OrganizationIntegration: S.String }) {}
export class UpdateServiceSettingsRequest extends S.Class<UpdateServiceSettingsRequest>(
  "UpdateServiceSettingsRequest",
)(
  {
    LinuxSubscriptionsDiscovery: S.String,
    LinuxSubscriptionsDiscoverySettings: LinuxSubscriptionsDiscoverySettings,
    AllowUpdate: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/subscription/UpdateServiceSettings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringMap = S.Record({ key: S.String, value: S.String });
export class GetRegisteredSubscriptionProviderResponse extends S.Class<GetRegisteredSubscriptionProviderResponse>(
  "GetRegisteredSubscriptionProviderResponse",
)({
  SubscriptionProviderArn: S.optional(S.String),
  SubscriptionProviderSource: S.optional(S.String),
  SecretArn: S.optional(S.String),
  SubscriptionProviderStatus: S.optional(S.String),
  SubscriptionProviderStatusMessage: S.optional(S.String),
  LastSuccessfulDataRetrievalTime: S.optional(S.String),
}) {}
export class GetServiceSettingsResponse extends S.Class<GetServiceSettingsResponse>(
  "GetServiceSettingsResponse",
)({
  LinuxSubscriptionsDiscovery: S.optional(S.String),
  LinuxSubscriptionsDiscoverySettings: S.optional(
    LinuxSubscriptionsDiscoverySettings,
  ),
  Status: S.optional(S.String),
  StatusMessage: S.optional(StringMap),
  HomeRegions: S.optional(StringList),
}) {}
export class ListLinuxSubscriptionInstancesRequest extends S.Class<ListLinuxSubscriptionInstancesRequest>(
  "ListLinuxSubscriptionInstancesRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/subscription/ListLinuxSubscriptionInstances",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class RegisterSubscriptionProviderRequest extends S.Class<RegisterSubscriptionProviderRequest>(
  "RegisterSubscriptionProviderRequest",
)(
  {
    SubscriptionProviderSource: S.String,
    SecretArn: S.String,
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/subscription/RegisterSubscriptionProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateServiceSettingsResponse extends S.Class<UpdateServiceSettingsResponse>(
  "UpdateServiceSettingsResponse",
)({
  LinuxSubscriptionsDiscovery: S.optional(S.String),
  LinuxSubscriptionsDiscoverySettings: S.optional(
    LinuxSubscriptionsDiscoverySettings,
  ),
  Status: S.optional(S.String),
  StatusMessage: S.optional(StringMap),
  HomeRegions: S.optional(StringList),
}) {}
export class Subscription extends S.Class<Subscription>("Subscription")({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  InstanceCount: S.optional(S.Number),
}) {}
export const SubscriptionList = S.Array(Subscription);
export class RegisteredSubscriptionProvider extends S.Class<RegisteredSubscriptionProvider>(
  "RegisteredSubscriptionProvider",
)({
  SubscriptionProviderArn: S.optional(S.String),
  SubscriptionProviderSource: S.optional(S.String),
  SecretArn: S.optional(S.String),
  SubscriptionProviderStatus: S.optional(S.String),
  SubscriptionProviderStatusMessage: S.optional(S.String),
  LastSuccessfulDataRetrievalTime: S.optional(S.String),
}) {}
export const RegisteredSubscriptionProviderList = S.Array(
  RegisteredSubscriptionProvider,
);
export class ListLinuxSubscriptionsResponse extends S.Class<ListLinuxSubscriptionsResponse>(
  "ListLinuxSubscriptionsResponse",
)({
  Subscriptions: S.optional(SubscriptionList),
  NextToken: S.optional(S.String),
}) {}
export class ListRegisteredSubscriptionProvidersResponse extends S.Class<ListRegisteredSubscriptionProvidersResponse>(
  "ListRegisteredSubscriptionProvidersResponse",
)({
  RegisteredSubscriptionProviders: S.optional(
    RegisteredSubscriptionProviderList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class RegisterSubscriptionProviderResponse extends S.Class<RegisterSubscriptionProviderResponse>(
  "RegisterSubscriptionProviderResponse",
)({
  SubscriptionProviderSource: S.optional(S.String),
  SubscriptionProviderArn: S.optional(S.String),
  SubscriptionProviderStatus: S.optional(S.String),
}) {}
export const ProductCodeList = S.Array(S.String);
export class Instance extends S.Class<Instance>("Instance")({
  AmiId: S.optional(S.String),
  InstanceID: S.optional(S.String),
  InstanceType: S.optional(S.String),
  AccountID: S.optional(S.String),
  Status: S.optional(S.String),
  Region: S.optional(S.String),
  UsageOperation: S.optional(S.String),
  ProductCode: S.optional(ProductCodeList),
  LastUpdatedTime: S.optional(S.String),
  SubscriptionName: S.optional(S.String),
  OsVersion: S.optional(S.String),
  SubscriptionProviderCreateTime: S.optional(S.String),
  SubscriptionProviderUpdateTime: S.optional(S.String),
  DualSubscription: S.optional(S.String),
  RegisteredWithSubscriptionProvider: S.optional(S.String),
}) {}
export const InstanceList = S.Array(Instance);
export class ListLinuxSubscriptionInstancesResponse extends S.Class<ListLinuxSubscriptionInstancesResponse>(
  "ListLinuxSubscriptionInstancesResponse",
)({ Instances: S.optional(InstanceList), NextToken: S.optional(S.String) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Remove one or more metadata tag from the specified Amazon Web Services resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Lists the Linux subscriptions service settings for your account.
 */
export const getServiceSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceSettingsRequest,
  output: GetServiceSettingsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Lists the running Amazon EC2 instances that were discovered with commercial Linux
 * subscriptions.
 */
export const listLinuxSubscriptionInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLinuxSubscriptionInstancesRequest,
    output: ListLinuxSubscriptionInstancesResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Instances",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the Linux subscriptions that have been discovered. If you have linked your
 * organization, the returned results will include data aggregated across your accounts in
 * Organizations.
 */
export const listLinuxSubscriptions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLinuxSubscriptionsRequest,
    output: ListLinuxSubscriptionsResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Subscriptions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * List Bring Your Own License (BYOL) subscription registration resources for your account.
 */
export const listRegisteredSubscriptionProviders =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRegisteredSubscriptionProvidersRequest,
    output: ListRegisteredSubscriptionProvidersResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RegisteredSubscriptionProviders",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Register the supported third-party subscription provider for your Bring Your Own License (BYOL) subscription.
 */
export const registerSubscriptionProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterSubscriptionProviderRequest,
    output: RegisterSubscriptionProviderResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
  }));
/**
 * Get details for a Bring Your Own License (BYOL) subscription that's registered to your account.
 */
export const getRegisteredSubscriptionProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRegisteredSubscriptionProviderRequest,
    output: GetRegisteredSubscriptionProviderResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * List the metadata tags that are assigned to the
 * specified Amazon Web Services resource.
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
 * Add metadata tags to the specified Amazon Web Services resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the service settings for Linux subscriptions.
 */
export const updateServiceSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceSettingsRequest,
    output: UpdateServiceSettingsResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
  }),
);
/**
 * Remove a third-party subscription provider from the Bring Your Own License (BYOL) subscriptions
 * registered to your account.
 */
export const deregisterSubscriptionProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterSubscriptionProviderRequest,
    output: DeregisterSubscriptionProviderResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
