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
  sdkId: "License Manager Linux Subscriptions",
  serviceShapeName: "LicenseManagerLinuxSubscriptions",
});
const auth = T.AwsAuthSigv4({ name: "license-manager-linux-subscriptions" });
const ver = T.ServiceVersion("2018-05-10");
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
              `https://license-manager-linux-subscriptions-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://license-manager-linux-subscriptions-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://license-manager-linux-subscriptions.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://license-manager-linux-subscriptions.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type SubscriptionProviderArn = string;
export type LinuxSubscriptionsDiscovery = string;
export type Status = string;
export type BoxInteger = number;
export type SubscriptionProviderSource = string;
export type SecretArn = string;
export type OrganizationIntegration = string;
export type Operator = string;
export type SubscriptionProviderStatus = string;
export type BoxLong = number;

//# Schemas
export interface GetServiceSettingsRequest {}
export const GetServiceSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/subscription/GetServiceSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServiceSettingsRequest",
}) as any as S.Schema<GetServiceSettingsRequest>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type SubscriptionProviderSourceList = string[];
export const SubscriptionProviderSourceList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeregisterSubscriptionProviderRequest {
  SubscriptionProviderArn: string;
}
export const DeregisterSubscriptionProviderRequest = S.suspend(() =>
  S.Struct({ SubscriptionProviderArn: S.String }).pipe(
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
  ),
).annotations({
  identifier: "DeregisterSubscriptionProviderRequest",
}) as any as S.Schema<DeregisterSubscriptionProviderRequest>;
export interface DeregisterSubscriptionProviderResponse {}
export const DeregisterSubscriptionProviderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterSubscriptionProviderResponse",
}) as any as S.Schema<DeregisterSubscriptionProviderResponse>;
export interface GetRegisteredSubscriptionProviderRequest {
  SubscriptionProviderArn: string;
}
export const GetRegisteredSubscriptionProviderRequest = S.suspend(() =>
  S.Struct({ SubscriptionProviderArn: S.String }).pipe(
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
  ),
).annotations({
  identifier: "GetRegisteredSubscriptionProviderRequest",
}) as any as S.Schema<GetRegisteredSubscriptionProviderRequest>;
export interface Filter {
  Name?: string;
  Values?: string[];
  Operator?: string;
}
export const Filter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(StringList),
    Operator: S.optional(S.String),
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface ListLinuxSubscriptionsRequest {
  Filters?: Filter[];
  MaxResults?: number;
  NextToken?: string;
}
export const ListLinuxSubscriptionsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(FilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/subscription/ListLinuxSubscriptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLinuxSubscriptionsRequest",
}) as any as S.Schema<ListLinuxSubscriptionsRequest>;
export interface ListRegisteredSubscriptionProvidersRequest {
  SubscriptionProviderSources?: string[];
  MaxResults?: number;
  NextToken?: string;
}
export const ListRegisteredSubscriptionProvidersRequest = S.suspend(() =>
  S.Struct({
    SubscriptionProviderSources: S.optional(SubscriptionProviderSourceList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListRegisteredSubscriptionProvidersRequest",
}) as any as S.Schema<ListRegisteredSubscriptionProvidersRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export type Tags = { [key: string]: string | undefined };
export const Tags = S.Record({ key: S.String, value: S.UndefinedOr(S.String) });
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/tags/{resourceArn}" }),
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
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface LinuxSubscriptionsDiscoverySettings {
  SourceRegions: string[];
  OrganizationIntegration: string;
}
export const LinuxSubscriptionsDiscoverySettings = S.suspend(() =>
  S.Struct({ SourceRegions: StringList, OrganizationIntegration: S.String }),
).annotations({
  identifier: "LinuxSubscriptionsDiscoverySettings",
}) as any as S.Schema<LinuxSubscriptionsDiscoverySettings>;
export interface UpdateServiceSettingsRequest {
  LinuxSubscriptionsDiscovery: string;
  LinuxSubscriptionsDiscoverySettings: LinuxSubscriptionsDiscoverySettings;
  AllowUpdate?: boolean;
}
export const UpdateServiceSettingsRequest = S.suspend(() =>
  S.Struct({
    LinuxSubscriptionsDiscovery: S.String,
    LinuxSubscriptionsDiscoverySettings: LinuxSubscriptionsDiscoverySettings,
    AllowUpdate: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/subscription/UpdateServiceSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateServiceSettingsRequest",
}) as any as S.Schema<UpdateServiceSettingsRequest>;
export type StringMap = { [key: string]: string | undefined };
export const StringMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface GetRegisteredSubscriptionProviderResponse {
  SubscriptionProviderArn?: string;
  SubscriptionProviderSource?: string;
  SecretArn?: string;
  SubscriptionProviderStatus?: string;
  SubscriptionProviderStatusMessage?: string;
  LastSuccessfulDataRetrievalTime?: string;
}
export const GetRegisteredSubscriptionProviderResponse = S.suspend(() =>
  S.Struct({
    SubscriptionProviderArn: S.optional(S.String),
    SubscriptionProviderSource: S.optional(S.String),
    SecretArn: S.optional(S.String),
    SubscriptionProviderStatus: S.optional(S.String),
    SubscriptionProviderStatusMessage: S.optional(S.String),
    LastSuccessfulDataRetrievalTime: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRegisteredSubscriptionProviderResponse",
}) as any as S.Schema<GetRegisteredSubscriptionProviderResponse>;
export interface GetServiceSettingsResponse {
  LinuxSubscriptionsDiscovery?: string;
  LinuxSubscriptionsDiscoverySettings?: LinuxSubscriptionsDiscoverySettings;
  Status?: string;
  StatusMessage?: { [key: string]: string | undefined };
  HomeRegions?: string[];
}
export const GetServiceSettingsResponse = S.suspend(() =>
  S.Struct({
    LinuxSubscriptionsDiscovery: S.optional(S.String),
    LinuxSubscriptionsDiscoverySettings: S.optional(
      LinuxSubscriptionsDiscoverySettings,
    ),
    Status: S.optional(S.String),
    StatusMessage: S.optional(StringMap),
    HomeRegions: S.optional(StringList),
  }),
).annotations({
  identifier: "GetServiceSettingsResponse",
}) as any as S.Schema<GetServiceSettingsResponse>;
export interface ListLinuxSubscriptionInstancesRequest {
  Filters?: Filter[];
  MaxResults?: number;
  NextToken?: string;
}
export const ListLinuxSubscriptionInstancesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(FilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListLinuxSubscriptionInstancesRequest",
}) as any as S.Schema<ListLinuxSubscriptionInstancesRequest>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RegisterSubscriptionProviderRequest {
  SubscriptionProviderSource: string;
  SecretArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const RegisterSubscriptionProviderRequest = S.suspend(() =>
  S.Struct({
    SubscriptionProviderSource: S.String,
    SecretArn: S.String,
    Tags: S.optional(Tags),
  }).pipe(
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
  ),
).annotations({
  identifier: "RegisterSubscriptionProviderRequest",
}) as any as S.Schema<RegisterSubscriptionProviderRequest>;
export interface UpdateServiceSettingsResponse {
  LinuxSubscriptionsDiscovery?: string;
  LinuxSubscriptionsDiscoverySettings?: LinuxSubscriptionsDiscoverySettings;
  Status?: string;
  StatusMessage?: { [key: string]: string | undefined };
  HomeRegions?: string[];
}
export const UpdateServiceSettingsResponse = S.suspend(() =>
  S.Struct({
    LinuxSubscriptionsDiscovery: S.optional(S.String),
    LinuxSubscriptionsDiscoverySettings: S.optional(
      LinuxSubscriptionsDiscoverySettings,
    ),
    Status: S.optional(S.String),
    StatusMessage: S.optional(StringMap),
    HomeRegions: S.optional(StringList),
  }),
).annotations({
  identifier: "UpdateServiceSettingsResponse",
}) as any as S.Schema<UpdateServiceSettingsResponse>;
export interface Subscription {
  Name?: string;
  Type?: string;
  InstanceCount?: number;
}
export const Subscription = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    InstanceCount: S.optional(S.Number),
  }),
).annotations({ identifier: "Subscription" }) as any as S.Schema<Subscription>;
export type SubscriptionList = Subscription[];
export const SubscriptionList = S.Array(Subscription);
export interface RegisteredSubscriptionProvider {
  SubscriptionProviderArn?: string;
  SubscriptionProviderSource?: string;
  SecretArn?: string;
  SubscriptionProviderStatus?: string;
  SubscriptionProviderStatusMessage?: string;
  LastSuccessfulDataRetrievalTime?: string;
}
export const RegisteredSubscriptionProvider = S.suspend(() =>
  S.Struct({
    SubscriptionProviderArn: S.optional(S.String),
    SubscriptionProviderSource: S.optional(S.String),
    SecretArn: S.optional(S.String),
    SubscriptionProviderStatus: S.optional(S.String),
    SubscriptionProviderStatusMessage: S.optional(S.String),
    LastSuccessfulDataRetrievalTime: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisteredSubscriptionProvider",
}) as any as S.Schema<RegisteredSubscriptionProvider>;
export type RegisteredSubscriptionProviderList =
  RegisteredSubscriptionProvider[];
export const RegisteredSubscriptionProviderList = S.Array(
  RegisteredSubscriptionProvider,
);
export interface ListLinuxSubscriptionsResponse {
  Subscriptions?: Subscription[];
  NextToken?: string;
}
export const ListLinuxSubscriptionsResponse = S.suspend(() =>
  S.Struct({
    Subscriptions: S.optional(SubscriptionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLinuxSubscriptionsResponse",
}) as any as S.Schema<ListLinuxSubscriptionsResponse>;
export interface ListRegisteredSubscriptionProvidersResponse {
  RegisteredSubscriptionProviders?: RegisteredSubscriptionProvider[];
  NextToken?: string;
}
export const ListRegisteredSubscriptionProvidersResponse = S.suspend(() =>
  S.Struct({
    RegisteredSubscriptionProviders: S.optional(
      RegisteredSubscriptionProviderList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRegisteredSubscriptionProvidersResponse",
}) as any as S.Schema<ListRegisteredSubscriptionProvidersResponse>;
export interface RegisterSubscriptionProviderResponse {
  SubscriptionProviderSource?: string;
  SubscriptionProviderArn?: string;
  SubscriptionProviderStatus?: string;
}
export const RegisterSubscriptionProviderResponse = S.suspend(() =>
  S.Struct({
    SubscriptionProviderSource: S.optional(S.String),
    SubscriptionProviderArn: S.optional(S.String),
    SubscriptionProviderStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterSubscriptionProviderResponse",
}) as any as S.Schema<RegisterSubscriptionProviderResponse>;
export type ProductCodeList = string[];
export const ProductCodeList = S.Array(S.String);
export interface Instance {
  AmiId?: string;
  InstanceID?: string;
  InstanceType?: string;
  AccountID?: string;
  Status?: string;
  Region?: string;
  UsageOperation?: string;
  ProductCode?: string[];
  LastUpdatedTime?: string;
  SubscriptionName?: string;
  OsVersion?: string;
  SubscriptionProviderCreateTime?: string;
  SubscriptionProviderUpdateTime?: string;
  DualSubscription?: string;
  RegisteredWithSubscriptionProvider?: string;
}
export const Instance = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Instance" }) as any as S.Schema<Instance>;
export type InstanceList = Instance[];
export const InstanceList = S.Array(Instance);
export interface ListLinuxSubscriptionInstancesResponse {
  Instances?: Instance[];
  NextToken?: string;
}
export const ListLinuxSubscriptionInstancesResponse = S.suspend(() =>
  S.Struct({
    Instances: S.optional(InstanceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLinuxSubscriptionInstancesResponse",
}) as any as S.Schema<ListLinuxSubscriptionInstancesResponse>;

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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Lists the Linux subscriptions service settings for your account.
 */
export const getServiceSettings: (
  input: GetServiceSettingsRequest,
) => effect.Effect<
  GetServiceSettingsResponse,
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceSettingsRequest,
  output: GetServiceSettingsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Lists the running Amazon EC2 instances that were discovered with commercial Linux
 * subscriptions.
 */
export const listLinuxSubscriptionInstances: {
  (
    input: ListLinuxSubscriptionInstancesRequest,
  ): effect.Effect<
    ListLinuxSubscriptionInstancesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLinuxSubscriptionInstancesRequest,
  ) => stream.Stream<
    ListLinuxSubscriptionInstancesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLinuxSubscriptionInstancesRequest,
  ) => stream.Stream<
    Instance,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listLinuxSubscriptions: {
  (
    input: ListLinuxSubscriptionsRequest,
  ): effect.Effect<
    ListLinuxSubscriptionsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLinuxSubscriptionsRequest,
  ) => stream.Stream<
    ListLinuxSubscriptionsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLinuxSubscriptionsRequest,
  ) => stream.Stream<
    Subscription,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listRegisteredSubscriptionProviders: {
  (
    input: ListRegisteredSubscriptionProvidersRequest,
  ): effect.Effect<
    ListRegisteredSubscriptionProvidersResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRegisteredSubscriptionProvidersRequest,
  ) => stream.Stream<
    ListRegisteredSubscriptionProvidersResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRegisteredSubscriptionProvidersRequest,
  ) => stream.Stream<
    RegisteredSubscriptionProvider,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const registerSubscriptionProvider: (
  input: RegisterSubscriptionProviderRequest,
) => effect.Effect<
  RegisterSubscriptionProviderResponse,
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterSubscriptionProviderRequest,
  output: RegisterSubscriptionProviderResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Get details for a Bring Your Own License (BYOL) subscription that's registered to your account.
 */
export const getRegisteredSubscriptionProvider: (
  input: GetRegisteredSubscriptionProviderRequest,
) => effect.Effect<
  GetRegisteredSubscriptionProviderResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateServiceSettings: (
  input: UpdateServiceSettingsRequest,
) => effect.Effect<
  UpdateServiceSettingsResponse,
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceSettingsRequest,
  output: UpdateServiceSettingsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Remove a third-party subscription provider from the Bring Your Own License (BYOL) subscriptions
 * registered to your account.
 */
export const deregisterSubscriptionProvider: (
  input: DeregisterSubscriptionProviderRequest,
) => effect.Effect<
  DeregisterSubscriptionProviderResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterSubscriptionProviderRequest,
  output: DeregisterSubscriptionProviderResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
