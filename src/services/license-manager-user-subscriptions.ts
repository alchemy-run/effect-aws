import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "License Manager User Subscriptions",
  serviceShapeName: "LicenseManagerUserSubscriptions",
});
const auth = T.AwsAuthSigv4({ name: "license-manager-user-subscriptions" });
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
                        url: "https://license-manager-user-subscriptions-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [],
                      endpoint: {
                        url: "https://license-manager-user-subscriptions-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://license-manager-user-subscriptions.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://license-manager-user-subscriptions.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class DeleteLicenseServerEndpointRequest extends S.Class<DeleteLicenseServerEndpointRequest>(
  "DeleteLicenseServerEndpointRequest",
)(
  { LicenseServerEndpointArn: S.String, ServerType: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/license-server/DeleteLicenseServerEndpoint",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IpV4List = S.Array(S.String);
export const IpV6List = S.Array(S.String);
export class SecretsManagerCredentialsProvider extends S.Class<SecretsManagerCredentialsProvider>(
  "SecretsManagerCredentialsProvider",
)({ SecretId: S.optional(S.String) }) {}
export const CredentialsProvider = S.Union(
  S.Struct({
    SecretsManagerCredentialsProvider: SecretsManagerCredentialsProvider,
  }),
);
export const Subnets = S.Array(S.String);
export class DomainNetworkSettings extends S.Class<DomainNetworkSettings>(
  "DomainNetworkSettings",
)({ Subnets: Subnets }) {}
export class ActiveDirectorySettings extends S.Class<ActiveDirectorySettings>(
  "ActiveDirectorySettings",
)({
  DomainName: S.optional(S.String),
  DomainIpv4List: S.optional(IpV4List),
  DomainIpv6List: S.optional(IpV6List),
  DomainCredentialsProvider: S.optional(CredentialsProvider),
  DomainNetworkSettings: S.optional(DomainNetworkSettings),
}) {}
export class ActiveDirectoryIdentityProvider extends S.Class<ActiveDirectoryIdentityProvider>(
  "ActiveDirectoryIdentityProvider",
)({
  DirectoryId: S.optional(S.String),
  ActiveDirectorySettings: S.optional(ActiveDirectorySettings),
  ActiveDirectoryType: S.optional(S.String),
  IsSharedActiveDirectory: S.optional(S.Boolean),
}) {}
export const IdentityProvider = S.Union(
  S.Struct({
    ActiveDirectoryIdentityProvider: ActiveDirectoryIdentityProvider,
  }),
);
export class DeregisterIdentityProviderRequest extends S.Class<DeregisterIdentityProviderRequest>(
  "DeregisterIdentityProviderRequest",
)(
  {
    IdentityProvider: S.optional(IdentityProvider),
    Product: S.optional(S.String),
    IdentityProviderArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identity-provider/DeregisterIdentityProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateUserRequest extends S.Class<DisassociateUserRequest>(
  "DisassociateUserRequest",
)(
  {
    Username: S.optional(S.String),
    InstanceId: S.optional(S.String),
    IdentityProvider: S.optional(IdentityProvider),
    InstanceUserArn: S.optional(S.String),
    Domain: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/user/DisassociateUser" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Filter extends S.Class<Filter>("Filter")({
  Attribute: S.optional(S.String),
  Operation: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const FilterList = S.Array(Filter);
export class ListInstancesRequest extends S.Class<ListInstancesRequest>(
  "ListInstancesRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(FilterList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/instance/ListInstances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLicenseServerEndpointsRequest extends S.Class<ListLicenseServerEndpointsRequest>(
  "ListLicenseServerEndpointsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/license-server/ListLicenseServerEndpoints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProductSubscriptionsRequest extends S.Class<ListProductSubscriptionsRequest>(
  "ListProductSubscriptionsRequest",
)(
  {
    Product: S.optional(S.String),
    IdentityProvider: IdentityProvider,
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/user/ListProductSubscriptions" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUserAssociationsRequest extends S.Class<ListUserAssociationsRequest>(
  "ListUserAssociationsRequest",
)(
  {
    InstanceId: S.String,
    IdentityProvider: IdentityProvider,
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/user/ListUserAssociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class StartProductSubscriptionRequest extends S.Class<StartProductSubscriptionRequest>(
  "StartProductSubscriptionRequest",
)(
  {
    Username: S.String,
    IdentityProvider: IdentityProvider,
    Product: S.String,
    Domain: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/user/StartProductSubscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopProductSubscriptionRequest extends S.Class<StopProductSubscriptionRequest>(
  "StopProductSubscriptionRequest",
)(
  {
    Username: S.optional(S.String),
    IdentityProvider: S.optional(IdentityProvider),
    Product: S.optional(S.String),
    ProductUserArn: S.optional(S.String),
    Domain: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/user/StopProductSubscription" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: Tags },
  T.all(
    T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export class ServerEndpoint extends S.Class<ServerEndpoint>("ServerEndpoint")({
  Endpoint: S.optional(S.String),
}) {}
export class LicenseServer extends S.Class<LicenseServer>("LicenseServer")({
  ProvisioningStatus: S.optional(S.String),
  HealthStatus: S.optional(S.String),
  Ipv4Address: S.optional(S.String),
  Ipv6Address: S.optional(S.String),
}) {}
export const LicenseServerList = S.Array(LicenseServer);
export class LicenseServerEndpoint extends S.Class<LicenseServerEndpoint>(
  "LicenseServerEndpoint",
)({
  IdentityProviderArn: S.optional(S.String),
  ServerType: S.optional(S.String),
  ServerEndpoint: S.optional(ServerEndpoint),
  StatusMessage: S.optional(S.String),
  LicenseServerEndpointId: S.optional(S.String),
  LicenseServerEndpointArn: S.optional(S.String),
  LicenseServerEndpointProvisioningStatus: S.optional(S.String),
  LicenseServers: S.optional(LicenseServerList),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LicenseServerEndpointList = S.Array(LicenseServerEndpoint);
export class InstanceUserSummary extends S.Class<InstanceUserSummary>(
  "InstanceUserSummary",
)({
  Username: S.String,
  InstanceId: S.String,
  IdentityProvider: IdentityProvider,
  Status: S.String,
  InstanceUserArn: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  Domain: S.optional(S.String),
  AssociationDate: S.optional(S.String),
  DisassociationDate: S.optional(S.String),
}) {}
export const InstanceUserSummaryList = S.Array(InstanceUserSummary);
export class Settings extends S.Class<Settings>("Settings")({
  Subnets: Subnets,
  SecurityGroupId: S.String,
}) {}
export class UpdateSettings extends S.Class<UpdateSettings>("UpdateSettings")({
  AddSubnets: Subnets,
  RemoveSubnets: Subnets,
  SecurityGroupId: S.optional(S.String),
}) {}
export class ListIdentityProvidersRequest extends S.Class<ListIdentityProvidersRequest>(
  "ListIdentityProvidersRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/identity-provider/ListIdentityProviders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLicenseServerEndpointsResponse extends S.Class<ListLicenseServerEndpointsResponse>(
  "ListLicenseServerEndpointsResponse",
)({
  LicenseServerEndpoints: S.optional(LicenseServerEndpointList),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }) {}
export class ListUserAssociationsResponse extends S.Class<ListUserAssociationsResponse>(
  "ListUserAssociationsResponse",
)({
  InstanceUserSummaries: S.optional(InstanceUserSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class RegisterIdentityProviderRequest extends S.Class<RegisterIdentityProviderRequest>(
  "RegisterIdentityProviderRequest",
)(
  {
    IdentityProvider: IdentityProvider,
    Product: S.String,
    Settings: S.optional(Settings),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identity-provider/RegisterIdentityProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ProductUserSummary extends S.Class<ProductUserSummary>(
  "ProductUserSummary",
)({
  Username: S.String,
  Product: S.String,
  IdentityProvider: IdentityProvider,
  Status: S.String,
  ProductUserArn: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  Domain: S.optional(S.String),
  SubscriptionStartDate: S.optional(S.String),
  SubscriptionEndDate: S.optional(S.String),
}) {}
export class StartProductSubscriptionResponse extends S.Class<StartProductSubscriptionResponse>(
  "StartProductSubscriptionResponse",
)({ ProductUserSummary: ProductUserSummary }) {}
export class StopProductSubscriptionResponse extends S.Class<StopProductSubscriptionResponse>(
  "StopProductSubscriptionResponse",
)({ ProductUserSummary: ProductUserSummary }) {}
export class UpdateIdentityProviderSettingsRequest extends S.Class<UpdateIdentityProviderSettingsRequest>(
  "UpdateIdentityProviderSettingsRequest",
)(
  {
    IdentityProvider: S.optional(IdentityProvider),
    Product: S.optional(S.String),
    IdentityProviderArn: S.optional(S.String),
    UpdateSettings: UpdateSettings,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identity-provider/UpdateIdentityProviderSettings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringList = S.Array(S.String);
export class IdentityProviderSummary extends S.Class<IdentityProviderSummary>(
  "IdentityProviderSummary",
)({
  IdentityProvider: IdentityProvider,
  Settings: Settings,
  Product: S.String,
  Status: S.String,
  IdentityProviderArn: S.optional(S.String),
  FailureMessage: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
}) {}
export const IdentityProviderSummaryList = S.Array(IdentityProviderSummary);
export class InstanceSummary extends S.Class<InstanceSummary>(
  "InstanceSummary",
)({
  InstanceId: S.String,
  Status: S.String,
  Products: StringList,
  LastStatusCheckDate: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  IdentityProvider: S.optional(IdentityProvider),
}) {}
export const InstanceSummaryList = S.Array(InstanceSummary);
export const ProductUserSummaryList = S.Array(ProductUserSummary);
export class RdsSalSettings extends S.Class<RdsSalSettings>("RdsSalSettings")({
  RdsSalCredentialsProvider: CredentialsProvider,
}) {}
export class DeregisterIdentityProviderResponse extends S.Class<DeregisterIdentityProviderResponse>(
  "DeregisterIdentityProviderResponse",
)({ IdentityProviderSummary: IdentityProviderSummary }) {}
export class DisassociateUserResponse extends S.Class<DisassociateUserResponse>(
  "DisassociateUserResponse",
)({ InstanceUserSummary: InstanceUserSummary }) {}
export class ListIdentityProvidersResponse extends S.Class<ListIdentityProvidersResponse>(
  "ListIdentityProvidersResponse",
)({
  IdentityProviderSummaries: IdentityProviderSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ListInstancesResponse extends S.Class<ListInstancesResponse>(
  "ListInstancesResponse",
)({
  InstanceSummaries: S.optional(InstanceSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListProductSubscriptionsResponse extends S.Class<ListProductSubscriptionsResponse>(
  "ListProductSubscriptionsResponse",
)({
  ProductUserSummaries: S.optional(ProductUserSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class RegisterIdentityProviderResponse extends S.Class<RegisterIdentityProviderResponse>(
  "RegisterIdentityProviderResponse",
)({ IdentityProviderSummary: IdentityProviderSummary }) {}
export class UpdateIdentityProviderSettingsResponse extends S.Class<UpdateIdentityProviderSettingsResponse>(
  "UpdateIdentityProviderSettingsResponse",
)({ IdentityProviderSummary: IdentityProviderSummary }) {}
export const ServerSettings = S.Union(
  S.Struct({ RdsSalSettings: RdsSalSettings }),
);
export class LicenseServerSettings extends S.Class<LicenseServerSettings>(
  "LicenseServerSettings",
)({ ServerType: S.String, ServerSettings: ServerSettings }) {}
export class CreateLicenseServerEndpointRequest extends S.Class<CreateLicenseServerEndpointRequest>(
  "CreateLicenseServerEndpointRequest",
)(
  {
    IdentityProviderArn: S.String,
    LicenseServerSettings: LicenseServerSettings,
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/license-server/CreateLicenseServerEndpoint",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLicenseServerEndpointResponse extends S.Class<DeleteLicenseServerEndpointResponse>(
  "DeleteLicenseServerEndpointResponse",
)({ LicenseServerEndpoint: S.optional(LicenseServerEndpoint) }) {}
export class CreateLicenseServerEndpointResponse extends S.Class<CreateLicenseServerEndpointResponse>(
  "CreateLicenseServerEndpointResponse",
)({
  IdentityProviderArn: S.optional(S.String),
  LicenseServerEndpointArn: S.optional(S.String),
}) {}
export class AssociateUserRequest extends S.Class<AssociateUserRequest>(
  "AssociateUserRequest",
)(
  {
    Username: S.String,
    InstanceId: S.String,
    IdentityProvider: IdentityProvider,
    Domain: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/user/AssociateUser" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateUserResponse extends S.Class<AssociateUserResponse>(
  "AssociateUserResponse",
)({ InstanceUserSummary: InstanceUserSummary }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Adds tags to a resource.
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
 * Updates additional product configuration settings for the registered identity provider.
 */
export const updateIdentityProviderSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateIdentityProviderSettingsRequest,
    output: UpdateIdentityProviderSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns the list of tags for the specified resource.
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
 * List the Remote Desktop Services (RDS) License Server endpoints
 */
export const listLicenseServerEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLicenseServerEndpointsRequest,
    output: ListLicenseServerEndpointsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "LicenseServerEndpoints",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the user-based subscription products available from an identity provider.
 */
export const listProductSubscriptions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProductSubscriptionsRequest,
    output: ListProductSubscriptionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ProductUserSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Registers an identity provider for user-based subscriptions.
 */
export const registerIdentityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterIdentityProviderRequest,
    output: RegisterIdentityProviderResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists user associations for an identity provider.
 */
export const listUserAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListUserAssociationsRequest,
    output: ListUserAssociationsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "InstanceUserSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Starts a product subscription for a user with the specified identity provider.
 *
 * Your estimated bill for charges on the number of users and related costs will take 48 hours to appear for billing periods that haven't closed (marked as **Pending** billing status) in Amazon Web Services Billing. For more information, see Viewing your monthly charges in the *Amazon Web Services Billing User Guide*.
 */
export const startProductSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartProductSubscriptionRequest,
    output: StartProductSubscriptionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Stops a product subscription for a user with the specified identity provider.
 */
export const stopProductSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopProductSubscriptionRequest,
    output: StopProductSubscriptionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deregisters the Active Directory identity provider from License Manager user-based subscriptions.
 */
export const deregisterIdentityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterIdentityProviderRequest,
    output: DeregisterIdentityProviderResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates the user from an EC2 instance providing user-based subscriptions.
 */
export const disassociateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateUserRequest,
  output: DisassociateUserResponse,
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
 * Lists the Active Directory identity providers for user-based subscriptions.
 */
export const listIdentityProviders =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIdentityProvidersRequest,
    output: ListIdentityProvidersResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "IdentityProviderSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the EC2 instances providing user-based subscriptions.
 */
export const listInstances = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInstancesRequest,
    output: ListInstancesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "InstanceSummaries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Deletes a `LicenseServerEndpoint` resource.
 */
export const deleteLicenseServerEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLicenseServerEndpointRequest,
    output: DeleteLicenseServerEndpointResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a network endpoint for the Remote Desktop Services (RDS) license server.
 */
export const createLicenseServerEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLicenseServerEndpointRequest,
    output: CreateLicenseServerEndpointResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Associates the user to an EC2 instance to utilize user-based subscriptions.
 *
 * Your estimated bill for charges on the number of users and related costs will take 48 hours to appear for billing periods that haven't closed (marked as **Pending** billing status) in Amazon Web Services Billing. For more information, see Viewing your monthly charges in the *Amazon Web Services Billing User Guide*.
 */
export const associateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateUserRequest,
  output: AssociateUserResponse,
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
