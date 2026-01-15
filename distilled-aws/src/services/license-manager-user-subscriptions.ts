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
  sdkId: "License Manager User Subscriptions",
  serviceShapeName: "LicenseManagerUserSubscriptions",
});
const auth = T.AwsAuthSigv4({ name: "license-manager-user-subscriptions" });
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
              `https://license-manager-user-subscriptions-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://license-manager-user-subscriptions-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://license-manager-user-subscriptions.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://license-manager-user-subscriptions.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type ServerType = string;
export type BoxInteger = number;
export type ResourceArn = string;
export type Subnet = string;
export type SecurityGroup = string;
export type Directory = string;
export type ActiveDirectoryType = string;
export type LicenseServerEndpointId = string;
export type LicenseServerEndpointProvisioningStatus = string;
export type IpV4 = string;
export type IpV6 = string;
export type LicenseServerHealthStatus = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteLicenseServerEndpointRequest {
  LicenseServerEndpointArn: string;
  ServerType: string;
}
export const DeleteLicenseServerEndpointRequest = S.suspend(() =>
  S.Struct({ LicenseServerEndpointArn: S.String, ServerType: S.String }).pipe(
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
  ),
).annotations({
  identifier: "DeleteLicenseServerEndpointRequest",
}) as any as S.Schema<DeleteLicenseServerEndpointRequest>;
export type IpV4List = string[];
export const IpV4List = S.Array(S.String);
export type IpV6List = string[];
export const IpV6List = S.Array(S.String);
export interface SecretsManagerCredentialsProvider {
  SecretId?: string;
}
export const SecretsManagerCredentialsProvider = S.suspend(() =>
  S.Struct({ SecretId: S.optional(S.String) }),
).annotations({
  identifier: "SecretsManagerCredentialsProvider",
}) as any as S.Schema<SecretsManagerCredentialsProvider>;
export type CredentialsProvider = {
  SecretsManagerCredentialsProvider: SecretsManagerCredentialsProvider;
};
export const CredentialsProvider = S.Union(
  S.Struct({
    SecretsManagerCredentialsProvider: SecretsManagerCredentialsProvider,
  }),
);
export type Subnets = string[];
export const Subnets = S.Array(S.String);
export interface DomainNetworkSettings {
  Subnets: string[];
}
export const DomainNetworkSettings = S.suspend(() =>
  S.Struct({ Subnets: Subnets }),
).annotations({
  identifier: "DomainNetworkSettings",
}) as any as S.Schema<DomainNetworkSettings>;
export interface ActiveDirectorySettings {
  DomainName?: string;
  DomainIpv4List?: string[];
  DomainIpv6List?: string[];
  DomainCredentialsProvider?: CredentialsProvider;
  DomainNetworkSettings?: DomainNetworkSettings;
}
export const ActiveDirectorySettings = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    DomainIpv4List: S.optional(IpV4List),
    DomainIpv6List: S.optional(IpV6List),
    DomainCredentialsProvider: S.optional(CredentialsProvider),
    DomainNetworkSettings: S.optional(DomainNetworkSettings),
  }),
).annotations({
  identifier: "ActiveDirectorySettings",
}) as any as S.Schema<ActiveDirectorySettings>;
export interface ActiveDirectoryIdentityProvider {
  DirectoryId?: string;
  ActiveDirectorySettings?: ActiveDirectorySettings;
  ActiveDirectoryType?: string;
  IsSharedActiveDirectory?: boolean;
}
export const ActiveDirectoryIdentityProvider = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    ActiveDirectorySettings: S.optional(ActiveDirectorySettings),
    ActiveDirectoryType: S.optional(S.String),
    IsSharedActiveDirectory: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ActiveDirectoryIdentityProvider",
}) as any as S.Schema<ActiveDirectoryIdentityProvider>;
export type IdentityProvider = {
  ActiveDirectoryIdentityProvider: ActiveDirectoryIdentityProvider;
};
export const IdentityProvider = S.Union(
  S.Struct({
    ActiveDirectoryIdentityProvider: ActiveDirectoryIdentityProvider,
  }),
);
export interface DeregisterIdentityProviderRequest {
  IdentityProvider?: IdentityProvider;
  Product?: string;
  IdentityProviderArn?: string;
}
export const DeregisterIdentityProviderRequest = S.suspend(() =>
  S.Struct({
    IdentityProvider: S.optional(IdentityProvider),
    Product: S.optional(S.String),
    IdentityProviderArn: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeregisterIdentityProviderRequest",
}) as any as S.Schema<DeregisterIdentityProviderRequest>;
export interface DisassociateUserRequest {
  Username?: string;
  InstanceId?: string;
  IdentityProvider?: IdentityProvider;
  InstanceUserArn?: string;
  Domain?: string;
}
export const DisassociateUserRequest = S.suspend(() =>
  S.Struct({
    Username: S.optional(S.String),
    InstanceId: S.optional(S.String),
    IdentityProvider: S.optional(IdentityProvider),
    InstanceUserArn: S.optional(S.String),
    Domain: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user/DisassociateUser" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateUserRequest",
}) as any as S.Schema<DisassociateUserRequest>;
export interface Filter {
  Attribute?: string;
  Operation?: string;
  Value?: string;
}
export const Filter = S.suspend(() =>
  S.Struct({
    Attribute: S.optional(S.String),
    Operation: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface ListInstancesRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filter[];
}
export const ListInstancesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(FilterList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/instance/ListInstances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInstancesRequest",
}) as any as S.Schema<ListInstancesRequest>;
export interface ListLicenseServerEndpointsRequest {
  MaxResults?: number;
  Filters?: Filter[];
  NextToken?: string;
}
export const ListLicenseServerEndpointsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListLicenseServerEndpointsRequest",
}) as any as S.Schema<ListLicenseServerEndpointsRequest>;
export interface ListProductSubscriptionsRequest {
  Product?: string;
  IdentityProvider: IdentityProvider;
  MaxResults?: number;
  Filters?: Filter[];
  NextToken?: string;
}
export const ListProductSubscriptionsRequest = S.suspend(() =>
  S.Struct({
    Product: S.optional(S.String),
    IdentityProvider: IdentityProvider,
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user/ListProductSubscriptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProductSubscriptionsRequest",
}) as any as S.Schema<ListProductSubscriptionsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export interface ListUserAssociationsRequest {
  InstanceId: string;
  IdentityProvider: IdentityProvider;
  MaxResults?: number;
  Filters?: Filter[];
  NextToken?: string;
}
export const ListUserAssociationsRequest = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    IdentityProvider: IdentityProvider,
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user/ListUserAssociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUserAssociationsRequest",
}) as any as S.Schema<ListUserAssociationsRequest>;
export type Tags = { [key: string]: string | undefined };
export const Tags = S.Record({ key: S.String, value: S.UndefinedOr(S.String) });
export interface StartProductSubscriptionRequest {
  Username: string;
  IdentityProvider: IdentityProvider;
  Product: string;
  Domain?: string;
  Tags?: { [key: string]: string | undefined };
}
export const StartProductSubscriptionRequest = S.suspend(() =>
  S.Struct({
    Username: S.String,
    IdentityProvider: IdentityProvider,
    Product: S.String,
    Domain: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user/StartProductSubscription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartProductSubscriptionRequest",
}) as any as S.Schema<StartProductSubscriptionRequest>;
export interface StopProductSubscriptionRequest {
  Username?: string;
  IdentityProvider?: IdentityProvider;
  Product?: string;
  ProductUserArn?: string;
  Domain?: string;
}
export const StopProductSubscriptionRequest = S.suspend(() =>
  S.Struct({
    Username: S.optional(S.String),
    IdentityProvider: S.optional(IdentityProvider),
    Product: S.optional(S.String),
    ProductUserArn: S.optional(S.String),
    Domain: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user/StopProductSubscription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopProductSubscriptionRequest",
}) as any as S.Schema<StopProductSubscriptionRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export interface ServerEndpoint {
  Endpoint?: string;
}
export const ServerEndpoint = S.suspend(() =>
  S.Struct({ Endpoint: S.optional(S.String) }),
).annotations({
  identifier: "ServerEndpoint",
}) as any as S.Schema<ServerEndpoint>;
export interface LicenseServer {
  ProvisioningStatus?: string;
  HealthStatus?: string;
  Ipv4Address?: string;
  Ipv6Address?: string;
}
export const LicenseServer = S.suspend(() =>
  S.Struct({
    ProvisioningStatus: S.optional(S.String),
    HealthStatus: S.optional(S.String),
    Ipv4Address: S.optional(S.String),
    Ipv6Address: S.optional(S.String),
  }),
).annotations({
  identifier: "LicenseServer",
}) as any as S.Schema<LicenseServer>;
export type LicenseServerList = LicenseServer[];
export const LicenseServerList = S.Array(LicenseServer);
export interface LicenseServerEndpoint {
  IdentityProviderArn?: string;
  ServerType?: string;
  ServerEndpoint?: ServerEndpoint;
  StatusMessage?: string;
  LicenseServerEndpointId?: string;
  LicenseServerEndpointArn?: string;
  LicenseServerEndpointProvisioningStatus?: string;
  LicenseServers?: LicenseServer[];
  CreationTime?: Date;
}
export const LicenseServerEndpoint = S.suspend(() =>
  S.Struct({
    IdentityProviderArn: S.optional(S.String),
    ServerType: S.optional(S.String),
    ServerEndpoint: S.optional(ServerEndpoint),
    StatusMessage: S.optional(S.String),
    LicenseServerEndpointId: S.optional(S.String),
    LicenseServerEndpointArn: S.optional(S.String),
    LicenseServerEndpointProvisioningStatus: S.optional(S.String),
    LicenseServers: S.optional(LicenseServerList),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "LicenseServerEndpoint",
}) as any as S.Schema<LicenseServerEndpoint>;
export type LicenseServerEndpointList = LicenseServerEndpoint[];
export const LicenseServerEndpointList = S.Array(LicenseServerEndpoint);
export interface InstanceUserSummary {
  Username: string;
  InstanceId: string;
  IdentityProvider: IdentityProvider;
  Status: string;
  InstanceUserArn?: string;
  StatusMessage?: string;
  Domain?: string;
  AssociationDate?: string;
  DisassociationDate?: string;
}
export const InstanceUserSummary = S.suspend(() =>
  S.Struct({
    Username: S.String,
    InstanceId: S.String,
    IdentityProvider: IdentityProvider,
    Status: S.String,
    InstanceUserArn: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    Domain: S.optional(S.String),
    AssociationDate: S.optional(S.String),
    DisassociationDate: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceUserSummary",
}) as any as S.Schema<InstanceUserSummary>;
export type InstanceUserSummaryList = InstanceUserSummary[];
export const InstanceUserSummaryList = S.Array(InstanceUserSummary);
export interface Settings {
  Subnets: string[];
  SecurityGroupId: string;
}
export const Settings = S.suspend(() =>
  S.Struct({ Subnets: Subnets, SecurityGroupId: S.String }),
).annotations({ identifier: "Settings" }) as any as S.Schema<Settings>;
export interface UpdateSettings {
  AddSubnets: string[];
  RemoveSubnets: string[];
  SecurityGroupId?: string;
}
export const UpdateSettings = S.suspend(() =>
  S.Struct({
    AddSubnets: Subnets,
    RemoveSubnets: Subnets,
    SecurityGroupId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateSettings",
}) as any as S.Schema<UpdateSettings>;
export interface ListIdentityProvidersRequest {
  MaxResults?: number;
  Filters?: Filter[];
  NextToken?: string;
}
export const ListIdentityProvidersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/identity-provider/ListIdentityProviders",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdentityProvidersRequest",
}) as any as S.Schema<ListIdentityProvidersRequest>;
export interface ListLicenseServerEndpointsResponse {
  LicenseServerEndpoints?: LicenseServerEndpoint[];
  NextToken?: string;
}
export const ListLicenseServerEndpointsResponse = S.suspend(() =>
  S.Struct({
    LicenseServerEndpoints: S.optional(LicenseServerEndpointList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLicenseServerEndpointsResponse",
}) as any as S.Schema<ListLicenseServerEndpointsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListUserAssociationsResponse {
  InstanceUserSummaries?: InstanceUserSummary[];
  NextToken?: string;
}
export const ListUserAssociationsResponse = S.suspend(() =>
  S.Struct({
    InstanceUserSummaries: S.optional(InstanceUserSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUserAssociationsResponse",
}) as any as S.Schema<ListUserAssociationsResponse>;
export interface RegisterIdentityProviderRequest {
  IdentityProvider: IdentityProvider;
  Product: string;
  Settings?: Settings;
  Tags?: { [key: string]: string | undefined };
}
export const RegisterIdentityProviderRequest = S.suspend(() =>
  S.Struct({
    IdentityProvider: IdentityProvider,
    Product: S.String,
    Settings: S.optional(Settings),
    Tags: S.optional(Tags),
  }).pipe(
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
  ),
).annotations({
  identifier: "RegisterIdentityProviderRequest",
}) as any as S.Schema<RegisterIdentityProviderRequest>;
export interface ProductUserSummary {
  Username: string;
  Product: string;
  IdentityProvider: IdentityProvider;
  Status: string;
  ProductUserArn?: string;
  StatusMessage?: string;
  Domain?: string;
  SubscriptionStartDate?: string;
  SubscriptionEndDate?: string;
}
export const ProductUserSummary = S.suspend(() =>
  S.Struct({
    Username: S.String,
    Product: S.String,
    IdentityProvider: IdentityProvider,
    Status: S.String,
    ProductUserArn: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    Domain: S.optional(S.String),
    SubscriptionStartDate: S.optional(S.String),
    SubscriptionEndDate: S.optional(S.String),
  }),
).annotations({
  identifier: "ProductUserSummary",
}) as any as S.Schema<ProductUserSummary>;
export interface StartProductSubscriptionResponse {
  ProductUserSummary: ProductUserSummary;
}
export const StartProductSubscriptionResponse = S.suspend(() =>
  S.Struct({ ProductUserSummary: ProductUserSummary }),
).annotations({
  identifier: "StartProductSubscriptionResponse",
}) as any as S.Schema<StartProductSubscriptionResponse>;
export interface StopProductSubscriptionResponse {
  ProductUserSummary: ProductUserSummary;
}
export const StopProductSubscriptionResponse = S.suspend(() =>
  S.Struct({ ProductUserSummary: ProductUserSummary }),
).annotations({
  identifier: "StopProductSubscriptionResponse",
}) as any as S.Schema<StopProductSubscriptionResponse>;
export interface UpdateIdentityProviderSettingsRequest {
  IdentityProvider?: IdentityProvider;
  Product?: string;
  IdentityProviderArn?: string;
  UpdateSettings: UpdateSettings;
}
export const UpdateIdentityProviderSettingsRequest = S.suspend(() =>
  S.Struct({
    IdentityProvider: S.optional(IdentityProvider),
    Product: S.optional(S.String),
    IdentityProviderArn: S.optional(S.String),
    UpdateSettings: UpdateSettings,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateIdentityProviderSettingsRequest",
}) as any as S.Schema<UpdateIdentityProviderSettingsRequest>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface IdentityProviderSummary {
  IdentityProvider: IdentityProvider;
  Settings: Settings;
  Product: string;
  Status: string;
  IdentityProviderArn?: string;
  FailureMessage?: string;
  OwnerAccountId?: string;
}
export const IdentityProviderSummary = S.suspend(() =>
  S.Struct({
    IdentityProvider: IdentityProvider,
    Settings: Settings,
    Product: S.String,
    Status: S.String,
    IdentityProviderArn: S.optional(S.String),
    FailureMessage: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentityProviderSummary",
}) as any as S.Schema<IdentityProviderSummary>;
export type IdentityProviderSummaryList = IdentityProviderSummary[];
export const IdentityProviderSummaryList = S.Array(IdentityProviderSummary);
export interface InstanceSummary {
  InstanceId: string;
  Status: string;
  Products: string[];
  LastStatusCheckDate?: string;
  StatusMessage?: string;
  OwnerAccountId?: string;
  IdentityProvider?: IdentityProvider;
}
export const InstanceSummary = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    Status: S.String,
    Products: StringList,
    LastStatusCheckDate: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    IdentityProvider: S.optional(IdentityProvider),
  }),
).annotations({
  identifier: "InstanceSummary",
}) as any as S.Schema<InstanceSummary>;
export type InstanceSummaryList = InstanceSummary[];
export const InstanceSummaryList = S.Array(InstanceSummary);
export type ProductUserSummaryList = ProductUserSummary[];
export const ProductUserSummaryList = S.Array(ProductUserSummary);
export interface RdsSalSettings {
  RdsSalCredentialsProvider: CredentialsProvider;
}
export const RdsSalSettings = S.suspend(() =>
  S.Struct({ RdsSalCredentialsProvider: CredentialsProvider }),
).annotations({
  identifier: "RdsSalSettings",
}) as any as S.Schema<RdsSalSettings>;
export interface DeregisterIdentityProviderResponse {
  IdentityProviderSummary: IdentityProviderSummary;
}
export const DeregisterIdentityProviderResponse = S.suspend(() =>
  S.Struct({ IdentityProviderSummary: IdentityProviderSummary }),
).annotations({
  identifier: "DeregisterIdentityProviderResponse",
}) as any as S.Schema<DeregisterIdentityProviderResponse>;
export interface DisassociateUserResponse {
  InstanceUserSummary: InstanceUserSummary;
}
export const DisassociateUserResponse = S.suspend(() =>
  S.Struct({ InstanceUserSummary: InstanceUserSummary }),
).annotations({
  identifier: "DisassociateUserResponse",
}) as any as S.Schema<DisassociateUserResponse>;
export interface ListIdentityProvidersResponse {
  IdentityProviderSummaries: IdentityProviderSummary[];
  NextToken?: string;
}
export const ListIdentityProvidersResponse = S.suspend(() =>
  S.Struct({
    IdentityProviderSummaries: IdentityProviderSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIdentityProvidersResponse",
}) as any as S.Schema<ListIdentityProvidersResponse>;
export interface ListInstancesResponse {
  InstanceSummaries?: InstanceSummary[];
  NextToken?: string;
}
export const ListInstancesResponse = S.suspend(() =>
  S.Struct({
    InstanceSummaries: S.optional(InstanceSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInstancesResponse",
}) as any as S.Schema<ListInstancesResponse>;
export interface ListProductSubscriptionsResponse {
  ProductUserSummaries?: ProductUserSummary[];
  NextToken?: string;
}
export const ListProductSubscriptionsResponse = S.suspend(() =>
  S.Struct({
    ProductUserSummaries: S.optional(ProductUserSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProductSubscriptionsResponse",
}) as any as S.Schema<ListProductSubscriptionsResponse>;
export interface RegisterIdentityProviderResponse {
  IdentityProviderSummary: IdentityProviderSummary;
}
export const RegisterIdentityProviderResponse = S.suspend(() =>
  S.Struct({ IdentityProviderSummary: IdentityProviderSummary }),
).annotations({
  identifier: "RegisterIdentityProviderResponse",
}) as any as S.Schema<RegisterIdentityProviderResponse>;
export interface UpdateIdentityProviderSettingsResponse {
  IdentityProviderSummary: IdentityProviderSummary;
}
export const UpdateIdentityProviderSettingsResponse = S.suspend(() =>
  S.Struct({ IdentityProviderSummary: IdentityProviderSummary }),
).annotations({
  identifier: "UpdateIdentityProviderSettingsResponse",
}) as any as S.Schema<UpdateIdentityProviderSettingsResponse>;
export type ServerSettings = { RdsSalSettings: RdsSalSettings };
export const ServerSettings = S.Union(
  S.Struct({ RdsSalSettings: RdsSalSettings }),
);
export interface LicenseServerSettings {
  ServerType: string;
  ServerSettings: ServerSettings;
}
export const LicenseServerSettings = S.suspend(() =>
  S.Struct({ ServerType: S.String, ServerSettings: ServerSettings }),
).annotations({
  identifier: "LicenseServerSettings",
}) as any as S.Schema<LicenseServerSettings>;
export interface CreateLicenseServerEndpointRequest {
  IdentityProviderArn: string;
  LicenseServerSettings: LicenseServerSettings;
  Tags?: { [key: string]: string | undefined };
}
export const CreateLicenseServerEndpointRequest = S.suspend(() =>
  S.Struct({
    IdentityProviderArn: S.String,
    LicenseServerSettings: LicenseServerSettings,
    Tags: S.optional(Tags),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateLicenseServerEndpointRequest",
}) as any as S.Schema<CreateLicenseServerEndpointRequest>;
export interface DeleteLicenseServerEndpointResponse {
  LicenseServerEndpoint?: LicenseServerEndpoint;
}
export const DeleteLicenseServerEndpointResponse = S.suspend(() =>
  S.Struct({ LicenseServerEndpoint: S.optional(LicenseServerEndpoint) }),
).annotations({
  identifier: "DeleteLicenseServerEndpointResponse",
}) as any as S.Schema<DeleteLicenseServerEndpointResponse>;
export interface CreateLicenseServerEndpointResponse {
  IdentityProviderArn?: string;
  LicenseServerEndpointArn?: string;
}
export const CreateLicenseServerEndpointResponse = S.suspend(() =>
  S.Struct({
    IdentityProviderArn: S.optional(S.String),
    LicenseServerEndpointArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateLicenseServerEndpointResponse",
}) as any as S.Schema<CreateLicenseServerEndpointResponse>;
export interface AssociateUserRequest {
  Username: string;
  InstanceId: string;
  IdentityProvider: IdentityProvider;
  Domain?: string;
  Tags?: { [key: string]: string | undefined };
}
export const AssociateUserRequest = S.suspend(() =>
  S.Struct({
    Username: S.String,
    InstanceId: S.String,
    IdentityProvider: IdentityProvider,
    Domain: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user/AssociateUser" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateUserRequest",
}) as any as S.Schema<AssociateUserRequest>;
export interface AssociateUserResponse {
  InstanceUserSummary: InstanceUserSummary;
}
export const AssociateUserResponse = S.suspend(() =>
  S.Struct({ InstanceUserSummary: InstanceUserSummary }),
).annotations({
  identifier: "AssociateUserResponse",
}) as any as S.Schema<AssociateUserResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
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
 * Adds tags to a resource.
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
 * Updates additional product configuration settings for the registered identity provider.
 */
export const updateIdentityProviderSettings: (
  input: UpdateIdentityProviderSettingsRequest,
) => effect.Effect<
  UpdateIdentityProviderSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * List the Remote Desktop Services (RDS) License Server endpoints
 */
export const listLicenseServerEndpoints: {
  (
    input: ListLicenseServerEndpointsRequest,
  ): effect.Effect<
    ListLicenseServerEndpointsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLicenseServerEndpointsRequest,
  ) => stream.Stream<
    ListLicenseServerEndpointsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLicenseServerEndpointsRequest,
  ) => stream.Stream<
    LicenseServerEndpoint,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listProductSubscriptions: {
  (
    input: ListProductSubscriptionsRequest,
  ): effect.Effect<
    ListProductSubscriptionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProductSubscriptionsRequest,
  ) => stream.Stream<
    ListProductSubscriptionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProductSubscriptionsRequest,
  ) => stream.Stream<
    ProductUserSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const registerIdentityProvider: (
  input: RegisterIdentityProviderRequest,
) => effect.Effect<
  RegisterIdentityProviderResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists user associations for an identity provider.
 */
export const listUserAssociations: {
  (
    input: ListUserAssociationsRequest,
  ): effect.Effect<
    ListUserAssociationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUserAssociationsRequest,
  ) => stream.Stream<
    ListUserAssociationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUserAssociationsRequest,
  ) => stream.Stream<
    InstanceUserSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startProductSubscription: (
  input: StartProductSubscriptionRequest,
) => effect.Effect<
  StartProductSubscriptionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Stops a product subscription for a user with the specified identity provider.
 */
export const stopProductSubscription: (
  input: StopProductSubscriptionRequest,
) => effect.Effect<
  StopProductSubscriptionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deregisters the Active Directory identity provider from License Manager user-based subscriptions.
 */
export const deregisterIdentityProvider: (
  input: DeregisterIdentityProviderRequest,
) => effect.Effect<
  DeregisterIdentityProviderResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates the user from an EC2 instance providing user-based subscriptions.
 */
export const disassociateUser: (
  input: DisassociateUserRequest,
) => effect.Effect<
  DisassociateUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listIdentityProviders: {
  (
    input: ListIdentityProvidersRequest,
  ): effect.Effect<
    ListIdentityProvidersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdentityProvidersRequest,
  ) => stream.Stream<
    ListIdentityProvidersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdentityProvidersRequest,
  ) => stream.Stream<
    IdentityProviderSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listInstances: {
  (
    input: ListInstancesRequest,
  ): effect.Effect<
    ListInstancesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstancesRequest,
  ) => stream.Stream<
    ListInstancesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstancesRequest,
  ) => stream.Stream<
    InstanceSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Deletes a `LicenseServerEndpoint` resource.
 */
export const deleteLicenseServerEndpoint: (
  input: DeleteLicenseServerEndpointRequest,
) => effect.Effect<
  DeleteLicenseServerEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a network endpoint for the Remote Desktop Services (RDS) license server.
 */
export const createLicenseServerEndpoint: (
  input: CreateLicenseServerEndpointRequest,
) => effect.Effect<
  CreateLicenseServerEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates the user to an EC2 instance to utilize user-based subscriptions.
 *
 * Your estimated bill for charges on the number of users and related costs will take 48 hours to appear for billing periods that haven't closed (marked as **Pending** billing status) in Amazon Web Services Billing. For more information, see Viewing your monthly charges in the *Amazon Web Services Billing User Guide*.
 */
export const associateUser: (
  input: AssociateUserRequest,
) => effect.Effect<
  AssociateUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
