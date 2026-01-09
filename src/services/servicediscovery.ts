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
  sdkId: "ServiceDiscovery",
  serviceShapeName: "Route53AutoNaming_v20170314",
});
const auth = T.AwsAuthSigv4({ name: "servicediscovery" });
const ver = T.ServiceVersion("2017-03-14");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://servicediscovery-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://servicediscovery-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            if ("aws" === _.getAttr(PartitionResult, "name")) {
              return e(`https://servicediscovery.${Region}.amazonaws.com`);
            }
            if ("aws-cn" === _.getAttr(PartitionResult, "name")) {
              return e(`https://servicediscovery.${Region}.amazonaws.com.cn`);
            }
            if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
              return e(`https://servicediscovery.${Region}.amazonaws.com`);
            }
            return e(
              `https://servicediscovery.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://servicediscovery.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type NamespaceNameHttp = string;
export type ResourceId = string;
export type ResourceDescription = string;
export type NamespaceNamePrivate = string;
export type NamespaceNamePublic = string;
export type ServiceName = string;
export type Arn = string;
export type ServiceAttributeKey = string;
export type NamespaceName = string;
export type DiscoverMaxResults = number;
export type AWSAccountId = string;
export type MaxResults = number;
export type NextToken = string;
export type OperationId = string;
export type AmazonResourceName = string;
export type InstanceId = string;
export type TagKey = string;
export type TagValue = string;
export type ResourcePath = string;
export type FailureThreshold = number;
export type AttrKey = string;
export type AttrValue = string;
export type FilterValue = string;
export type ServiceAttributeValue = string;
export type ErrorMessage = string;
export type Revision = number;
export type RecordTTL = number;
export type ResourceCount = number;
export type Message = string;
export type Code = string;

//# Schemas
export type ServiceTypeOption = "HTTP" | (string & {});
export const ServiceTypeOption = S.String;
export type ServiceAttributeKeyList = string[];
export const ServiceAttributeKeyList = S.Array(S.String);
export type HealthStatusFilter =
  | "HEALTHY"
  | "UNHEALTHY"
  | "ALL"
  | "HEALTHY_OR_ELSE_ALL"
  | (string & {});
export const HealthStatusFilter = S.String;
export type InstanceIdList = string[];
export const InstanceIdList = S.Array(S.String.pipe(T.XmlName("InstanceId")));
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type CustomHealthStatus = "HEALTHY" | "UNHEALTHY" | (string & {});
export const CustomHealthStatus = S.String;
export interface DeleteNamespaceRequest {
  Id: string;
}
export const DeleteNamespaceRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteNamespaceRequest",
}) as any as S.Schema<DeleteNamespaceRequest>;
export interface DeleteServiceRequest {
  Id: string;
}
export const DeleteServiceRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteServiceRequest",
}) as any as S.Schema<DeleteServiceRequest>;
export interface DeleteServiceResponse {}
export const DeleteServiceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteServiceResponse",
}) as any as S.Schema<DeleteServiceResponse>;
export interface DeleteServiceAttributesRequest {
  ServiceId: string;
  Attributes: string[];
}
export const DeleteServiceAttributesRequest = S.suspend(() =>
  S.Struct({ ServiceId: S.String, Attributes: ServiceAttributeKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteServiceAttributesRequest",
}) as any as S.Schema<DeleteServiceAttributesRequest>;
export interface DeleteServiceAttributesResponse {}
export const DeleteServiceAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteServiceAttributesResponse",
}) as any as S.Schema<DeleteServiceAttributesResponse>;
export interface DeregisterInstanceRequest {
  ServiceId: string;
  InstanceId: string;
}
export const DeregisterInstanceRequest = S.suspend(() =>
  S.Struct({ ServiceId: S.String, InstanceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeregisterInstanceRequest",
}) as any as S.Schema<DeregisterInstanceRequest>;
export interface DiscoverInstancesRevisionRequest {
  NamespaceName: string;
  ServiceName: string;
  OwnerAccount?: string;
}
export const DiscoverInstancesRevisionRequest = S.suspend(() =>
  S.Struct({
    NamespaceName: S.String,
    ServiceName: S.String,
    OwnerAccount: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DiscoverInstancesRevisionRequest",
}) as any as S.Schema<DiscoverInstancesRevisionRequest>;
export interface GetInstanceRequest {
  ServiceId: string;
  InstanceId: string;
}
export const GetInstanceRequest = S.suspend(() =>
  S.Struct({ ServiceId: S.String, InstanceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetInstanceRequest",
}) as any as S.Schema<GetInstanceRequest>;
export interface GetInstancesHealthStatusRequest {
  ServiceId: string;
  Instances?: string[];
  MaxResults?: number;
  NextToken?: string;
}
export const GetInstancesHealthStatusRequest = S.suspend(() =>
  S.Struct({
    ServiceId: S.String,
    Instances: S.optional(InstanceIdList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetInstancesHealthStatusRequest",
}) as any as S.Schema<GetInstancesHealthStatusRequest>;
export interface GetNamespaceRequest {
  Id: string;
}
export const GetNamespaceRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetNamespaceRequest",
}) as any as S.Schema<GetNamespaceRequest>;
export interface GetOperationRequest {
  OperationId: string;
  OwnerAccount?: string;
}
export const GetOperationRequest = S.suspend(() =>
  S.Struct({ OperationId: S.String, OwnerAccount: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetOperationRequest",
}) as any as S.Schema<GetOperationRequest>;
export interface GetServiceRequest {
  Id: string;
}
export const GetServiceRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceRequest",
}) as any as S.Schema<GetServiceRequest>;
export interface GetServiceAttributesRequest {
  ServiceId: string;
}
export const GetServiceAttributesRequest = S.suspend(() =>
  S.Struct({ ServiceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceAttributesRequest",
}) as any as S.Schema<GetServiceAttributesRequest>;
export interface ListInstancesRequest {
  ServiceId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListInstancesRequest = S.suspend(() =>
  S.Struct({
    ServiceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListInstancesRequest",
}) as any as S.Schema<ListInstancesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export type Attributes = { [key: string]: string | undefined };
export const Attributes = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface RegisterInstanceRequest {
  ServiceId: string;
  InstanceId: string;
  CreatorRequestId?: string;
  Attributes: { [key: string]: string | undefined };
}
export const RegisterInstanceRequest = S.suspend(() =>
  S.Struct({
    ServiceId: S.String,
    InstanceId: S.String,
    CreatorRequestId: S.optional(S.String).pipe(T.IdempotencyToken()),
    Attributes: Attributes,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RegisterInstanceRequest",
}) as any as S.Schema<RegisterInstanceRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateInstanceCustomHealthStatusRequest {
  ServiceId: string;
  InstanceId: string;
  Status: CustomHealthStatus;
}
export const UpdateInstanceCustomHealthStatusRequest = S.suspend(() =>
  S.Struct({
    ServiceId: S.String,
    InstanceId: S.String,
    Status: CustomHealthStatus,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateInstanceCustomHealthStatusRequest",
}) as any as S.Schema<UpdateInstanceCustomHealthStatusRequest>;
export interface UpdateInstanceCustomHealthStatusResponse {}
export const UpdateInstanceCustomHealthStatusResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateInstanceCustomHealthStatusResponse",
}) as any as S.Schema<UpdateInstanceCustomHealthStatusResponse>;
export type RoutingPolicy = "MULTIVALUE" | "WEIGHTED" | (string & {});
export const RoutingPolicy = S.String;
export type HealthCheckType = "HTTP" | "HTTPS" | "TCP" | (string & {});
export const HealthCheckType = S.String;
export type NamespaceFilterName =
  | "TYPE"
  | "NAME"
  | "HTTP_NAME"
  | "RESOURCE_OWNER"
  | (string & {});
export const NamespaceFilterName = S.String;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String.pipe(T.XmlName("item")));
export type FilterCondition =
  | "EQ"
  | "IN"
  | "BETWEEN"
  | "BEGINS_WITH"
  | (string & {});
export const FilterCondition = S.String;
export type OperationFilterName =
  | "NAMESPACE_ID"
  | "SERVICE_ID"
  | "STATUS"
  | "TYPE"
  | "UPDATE_DATE"
  | (string & {});
export const OperationFilterName = S.String;
export type ServiceFilterName =
  | "NAMESPACE_ID"
  | "RESOURCE_OWNER"
  | (string & {});
export const ServiceFilterName = S.String;
export interface HealthCheckConfig {
  Type: HealthCheckType;
  ResourcePath?: string;
  FailureThreshold?: number;
}
export const HealthCheckConfig = S.suspend(() =>
  S.Struct({
    Type: HealthCheckType,
    ResourcePath: S.optional(S.String),
    FailureThreshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "HealthCheckConfig",
}) as any as S.Schema<HealthCheckConfig>;
export interface HealthCheckCustomConfig {
  FailureThreshold?: number;
}
export const HealthCheckCustomConfig = S.suspend(() =>
  S.Struct({ FailureThreshold: S.optional(S.Number) }),
).annotations({
  identifier: "HealthCheckCustomConfig",
}) as any as S.Schema<HealthCheckCustomConfig>;
export interface NamespaceFilter {
  Name: NamespaceFilterName;
  Values: string[];
  Condition?: FilterCondition;
}
export const NamespaceFilter = S.suspend(() =>
  S.Struct({
    Name: NamespaceFilterName,
    Values: FilterValues,
    Condition: S.optional(FilterCondition),
  }),
).annotations({
  identifier: "NamespaceFilter",
}) as any as S.Schema<NamespaceFilter>;
export type NamespaceFilters = NamespaceFilter[];
export const NamespaceFilters = S.Array(
  NamespaceFilter.pipe(T.XmlName("item")).annotations({
    identifier: "NamespaceFilter",
  }),
);
export interface OperationFilter {
  Name: OperationFilterName;
  Values: string[];
  Condition?: FilterCondition;
}
export const OperationFilter = S.suspend(() =>
  S.Struct({
    Name: OperationFilterName,
    Values: FilterValues,
    Condition: S.optional(FilterCondition),
  }),
).annotations({
  identifier: "OperationFilter",
}) as any as S.Schema<OperationFilter>;
export type OperationFilters = OperationFilter[];
export const OperationFilters = S.Array(
  OperationFilter.pipe(T.XmlName("item")).annotations({
    identifier: "OperationFilter",
  }),
);
export interface ServiceFilter {
  Name: ServiceFilterName;
  Values: string[];
  Condition?: FilterCondition;
}
export const ServiceFilter = S.suspend(() =>
  S.Struct({
    Name: ServiceFilterName,
    Values: FilterValues,
    Condition: S.optional(FilterCondition),
  }),
).annotations({
  identifier: "ServiceFilter",
}) as any as S.Schema<ServiceFilter>;
export type ServiceFilters = ServiceFilter[];
export const ServiceFilters = S.Array(
  ServiceFilter.pipe(T.XmlName("item")).annotations({
    identifier: "ServiceFilter",
  }),
);
export interface HttpNamespaceChange {
  Description: string;
}
export const HttpNamespaceChange = S.suspend(() =>
  S.Struct({ Description: S.String }),
).annotations({
  identifier: "HttpNamespaceChange",
}) as any as S.Schema<HttpNamespaceChange>;
export type ServiceAttributesMap = { [key: string]: string | undefined };
export const ServiceAttributesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type RecordType = "SRV" | "A" | "AAAA" | "CNAME" | (string & {});
export const RecordType = S.String;
export interface CreateHttpNamespaceRequest {
  Name: string;
  CreatorRequestId?: string;
  Description?: string;
  Tags?: Tag[];
}
export const CreateHttpNamespaceRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CreatorRequestId: S.optional(S.String).pipe(T.IdempotencyToken()),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateHttpNamespaceRequest",
}) as any as S.Schema<CreateHttpNamespaceRequest>;
export interface DeleteNamespaceResponse {
  OperationId?: string;
}
export const DeleteNamespaceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "DeleteNamespaceResponse",
}) as any as S.Schema<DeleteNamespaceResponse>;
export interface DeregisterInstanceResponse {
  OperationId?: string;
}
export const DeregisterInstanceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "DeregisterInstanceResponse",
}) as any as S.Schema<DeregisterInstanceResponse>;
export interface DiscoverInstancesRequest {
  NamespaceName: string;
  ServiceName: string;
  MaxResults?: number;
  QueryParameters?: { [key: string]: string | undefined };
  OptionalParameters?: { [key: string]: string | undefined };
  HealthStatus?: HealthStatusFilter;
  OwnerAccount?: string;
}
export const DiscoverInstancesRequest = S.suspend(() =>
  S.Struct({
    NamespaceName: S.String,
    ServiceName: S.String,
    MaxResults: S.optional(S.Number),
    QueryParameters: S.optional(Attributes),
    OptionalParameters: S.optional(Attributes),
    HealthStatus: S.optional(HealthStatusFilter),
    OwnerAccount: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DiscoverInstancesRequest",
}) as any as S.Schema<DiscoverInstancesRequest>;
export interface DiscoverInstancesRevisionResponse {
  InstancesRevision?: number;
}
export const DiscoverInstancesRevisionResponse = S.suspend(() =>
  S.Struct({ InstancesRevision: S.optional(S.Number) }),
).annotations({
  identifier: "DiscoverInstancesRevisionResponse",
}) as any as S.Schema<DiscoverInstancesRevisionResponse>;
export interface ListNamespacesRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: NamespaceFilter[];
}
export const ListNamespacesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(NamespaceFilters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListNamespacesRequest",
}) as any as S.Schema<ListNamespacesRequest>;
export interface ListOperationsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: OperationFilter[];
}
export const ListOperationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(OperationFilters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListOperationsRequest",
}) as any as S.Schema<ListOperationsRequest>;
export interface ListServicesRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: ServiceFilter[];
}
export const ListServicesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(ServiceFilters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServicesRequest",
}) as any as S.Schema<ListServicesRequest>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RegisterInstanceResponse {
  OperationId?: string;
}
export const RegisterInstanceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "RegisterInstanceResponse",
}) as any as S.Schema<RegisterInstanceResponse>;
export interface UpdateHttpNamespaceRequest {
  Id: string;
  UpdaterRequestId?: string;
  Namespace: HttpNamespaceChange;
}
export const UpdateHttpNamespaceRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    UpdaterRequestId: S.optional(S.String).pipe(T.IdempotencyToken()),
    Namespace: HttpNamespaceChange,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateHttpNamespaceRequest",
}) as any as S.Schema<UpdateHttpNamespaceRequest>;
export interface UpdateServiceAttributesRequest {
  ServiceId: string;
  Attributes: { [key: string]: string | undefined };
}
export const UpdateServiceAttributesRequest = S.suspend(() =>
  S.Struct({ ServiceId: S.String, Attributes: ServiceAttributesMap }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServiceAttributesRequest",
}) as any as S.Schema<UpdateServiceAttributesRequest>;
export interface UpdateServiceAttributesResponse {}
export const UpdateServiceAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateServiceAttributesResponse",
}) as any as S.Schema<UpdateServiceAttributesResponse>;
export interface SOA {
  TTL: number;
}
export const SOA = S.suspend(() => S.Struct({ TTL: S.Number })).annotations({
  identifier: "SOA",
}) as any as S.Schema<SOA>;
export interface PublicDnsPropertiesMutable {
  SOA: SOA;
}
export const PublicDnsPropertiesMutable = S.suspend(() =>
  S.Struct({ SOA: SOA }),
).annotations({
  identifier: "PublicDnsPropertiesMutable",
}) as any as S.Schema<PublicDnsPropertiesMutable>;
export interface DnsRecord {
  Type: RecordType;
  TTL: number;
}
export const DnsRecord = S.suspend(() =>
  S.Struct({ Type: RecordType, TTL: S.Number }),
).annotations({ identifier: "DnsRecord" }) as any as S.Schema<DnsRecord>;
export type DnsRecordList = DnsRecord[];
export const DnsRecordList = S.Array(DnsRecord);
export type HealthStatus = "HEALTHY" | "UNHEALTHY" | "UNKNOWN" | (string & {});
export const HealthStatus = S.String;
export type NamespaceType =
  | "DNS_PUBLIC"
  | "DNS_PRIVATE"
  | "HTTP"
  | (string & {});
export const NamespaceType = S.String;
export type OperationType =
  | "CREATE_NAMESPACE"
  | "DELETE_NAMESPACE"
  | "UPDATE_NAMESPACE"
  | "UPDATE_SERVICE"
  | "REGISTER_INSTANCE"
  | "DEREGISTER_INSTANCE"
  | (string & {});
export const OperationType = S.String;
export type OperationStatus =
  | "SUBMITTED"
  | "PENDING"
  | "SUCCESS"
  | "FAIL"
  | (string & {});
export const OperationStatus = S.String;
export type ServiceType = "HTTP" | "DNS_HTTP" | "DNS" | (string & {});
export const ServiceType = S.String;
export interface DnsConfigChange {
  DnsRecords: DnsRecord[];
}
export const DnsConfigChange = S.suspend(() =>
  S.Struct({ DnsRecords: DnsRecordList }),
).annotations({
  identifier: "DnsConfigChange",
}) as any as S.Schema<DnsConfigChange>;
export interface PublicDnsNamespaceProperties {
  DnsProperties: PublicDnsPropertiesMutable;
}
export const PublicDnsNamespaceProperties = S.suspend(() =>
  S.Struct({ DnsProperties: PublicDnsPropertiesMutable }),
).annotations({
  identifier: "PublicDnsNamespaceProperties",
}) as any as S.Schema<PublicDnsNamespaceProperties>;
export interface DnsConfig {
  NamespaceId?: string;
  RoutingPolicy?: RoutingPolicy;
  DnsRecords: DnsRecord[];
}
export const DnsConfig = S.suspend(() =>
  S.Struct({
    NamespaceId: S.optional(S.String),
    RoutingPolicy: S.optional(RoutingPolicy),
    DnsRecords: DnsRecordList,
  }),
).annotations({ identifier: "DnsConfig" }) as any as S.Schema<DnsConfig>;
export interface Instance {
  Id: string;
  CreatorRequestId?: string;
  Attributes?: { [key: string]: string | undefined };
  CreatedByAccount?: string;
}
export const Instance = S.suspend(() =>
  S.Struct({
    Id: S.String,
    CreatorRequestId: S.optional(S.String),
    Attributes: S.optional(Attributes),
    CreatedByAccount: S.optional(S.String),
  }),
).annotations({ identifier: "Instance" }) as any as S.Schema<Instance>;
export type InstanceHealthStatusMap = {
  [key: string]: HealthStatus | undefined;
};
export const InstanceHealthStatusMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(HealthStatus),
});
export interface Service {
  Id?: string;
  Arn?: string;
  ResourceOwner?: string;
  Name?: string;
  NamespaceId?: string;
  Description?: string;
  InstanceCount?: number;
  DnsConfig?: DnsConfig;
  Type?: ServiceType;
  HealthCheckConfig?: HealthCheckConfig;
  HealthCheckCustomConfig?: HealthCheckCustomConfig;
  CreateDate?: Date;
  CreatorRequestId?: string;
  CreatedByAccount?: string;
}
export const Service = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    Name: S.optional(S.String),
    NamespaceId: S.optional(S.String),
    Description: S.optional(S.String),
    InstanceCount: S.optional(S.Number),
    DnsConfig: S.optional(DnsConfig),
    Type: S.optional(ServiceType),
    HealthCheckConfig: S.optional(HealthCheckConfig),
    HealthCheckCustomConfig: S.optional(HealthCheckCustomConfig),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatorRequestId: S.optional(S.String),
    CreatedByAccount: S.optional(S.String),
  }),
).annotations({ identifier: "Service" }) as any as S.Schema<Service>;
export interface ServiceAttributes {
  ServiceArn?: string;
  ResourceOwner?: string;
  Attributes?: { [key: string]: string | undefined };
}
export const ServiceAttributes = S.suspend(() =>
  S.Struct({
    ServiceArn: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    Attributes: S.optional(ServiceAttributesMap),
  }),
).annotations({
  identifier: "ServiceAttributes",
}) as any as S.Schema<ServiceAttributes>;
export interface InstanceSummary {
  Id?: string;
  Attributes?: { [key: string]: string | undefined };
  CreatedByAccount?: string;
}
export const InstanceSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Attributes: S.optional(Attributes),
    CreatedByAccount: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceSummary",
}) as any as S.Schema<InstanceSummary>;
export type InstanceSummaryList = InstanceSummary[];
export const InstanceSummaryList = S.Array(
  InstanceSummary.pipe(T.XmlName("InstanceSummary")).annotations({
    identifier: "InstanceSummary",
  }),
);
export interface ServiceChange {
  Description?: string;
  DnsConfig?: DnsConfigChange;
  HealthCheckConfig?: HealthCheckConfig;
}
export const ServiceChange = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DnsConfig: S.optional(DnsConfigChange),
    HealthCheckConfig: S.optional(HealthCheckConfig),
  }),
).annotations({
  identifier: "ServiceChange",
}) as any as S.Schema<ServiceChange>;
export type OperationTargetType =
  | "NAMESPACE"
  | "SERVICE"
  | "INSTANCE"
  | (string & {});
export const OperationTargetType = S.String;
export interface SOAChange {
  TTL: number;
}
export const SOAChange = S.suspend(() =>
  S.Struct({ TTL: S.Number }),
).annotations({ identifier: "SOAChange" }) as any as S.Schema<SOAChange>;
export interface PublicDnsPropertiesMutableChange {
  SOA: SOAChange;
}
export const PublicDnsPropertiesMutableChange = S.suspend(() =>
  S.Struct({ SOA: SOAChange }),
).annotations({
  identifier: "PublicDnsPropertiesMutableChange",
}) as any as S.Schema<PublicDnsPropertiesMutableChange>;
export interface CreateHttpNamespaceResponse {
  OperationId?: string;
}
export const CreateHttpNamespaceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "CreateHttpNamespaceResponse",
}) as any as S.Schema<CreateHttpNamespaceResponse>;
export interface CreatePublicDnsNamespaceRequest {
  Name: string;
  CreatorRequestId?: string;
  Description?: string;
  Tags?: Tag[];
  Properties?: PublicDnsNamespaceProperties;
}
export const CreatePublicDnsNamespaceRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CreatorRequestId: S.optional(S.String).pipe(T.IdempotencyToken()),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    Properties: S.optional(PublicDnsNamespaceProperties),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePublicDnsNamespaceRequest",
}) as any as S.Schema<CreatePublicDnsNamespaceRequest>;
export interface CreateServiceRequest {
  Name: string;
  NamespaceId?: string;
  CreatorRequestId?: string;
  Description?: string;
  DnsConfig?: DnsConfig;
  HealthCheckConfig?: HealthCheckConfig;
  HealthCheckCustomConfig?: HealthCheckCustomConfig;
  Tags?: Tag[];
  Type?: ServiceTypeOption;
}
export const CreateServiceRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    NamespaceId: S.optional(S.String),
    CreatorRequestId: S.optional(S.String).pipe(T.IdempotencyToken()),
    Description: S.optional(S.String),
    DnsConfig: S.optional(DnsConfig),
    HealthCheckConfig: S.optional(HealthCheckConfig),
    HealthCheckCustomConfig: S.optional(HealthCheckCustomConfig),
    Tags: S.optional(TagList),
    Type: S.optional(ServiceTypeOption),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateServiceRequest",
}) as any as S.Schema<CreateServiceRequest>;
export interface GetInstanceResponse {
  ResourceOwner?: string;
  Instance?: Instance;
}
export const GetInstanceResponse = S.suspend(() =>
  S.Struct({
    ResourceOwner: S.optional(S.String),
    Instance: S.optional(Instance),
  }),
).annotations({
  identifier: "GetInstanceResponse",
}) as any as S.Schema<GetInstanceResponse>;
export interface GetInstancesHealthStatusResponse {
  Status?: { [key: string]: HealthStatus | undefined };
  NextToken?: string;
}
export const GetInstancesHealthStatusResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(InstanceHealthStatusMap),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetInstancesHealthStatusResponse",
}) as any as S.Schema<GetInstancesHealthStatusResponse>;
export interface GetServiceResponse {
  Service?: Service;
}
export const GetServiceResponse = S.suspend(() =>
  S.Struct({ Service: S.optional(Service) }),
).annotations({
  identifier: "GetServiceResponse",
}) as any as S.Schema<GetServiceResponse>;
export interface GetServiceAttributesResponse {
  ServiceAttributes?: ServiceAttributes;
}
export const GetServiceAttributesResponse = S.suspend(() =>
  S.Struct({ ServiceAttributes: S.optional(ServiceAttributes) }),
).annotations({
  identifier: "GetServiceAttributesResponse",
}) as any as S.Schema<GetServiceAttributesResponse>;
export interface ListInstancesResponse {
  ResourceOwner?: string;
  Instances?: InstanceSummary[];
  NextToken?: string;
}
export const ListInstancesResponse = S.suspend(() =>
  S.Struct({
    ResourceOwner: S.optional(S.String),
    Instances: S.optional(InstanceSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInstancesResponse",
}) as any as S.Schema<ListInstancesResponse>;
export interface UpdateHttpNamespaceResponse {
  OperationId?: string;
}
export const UpdateHttpNamespaceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "UpdateHttpNamespaceResponse",
}) as any as S.Schema<UpdateHttpNamespaceResponse>;
export interface UpdateServiceRequest {
  Id: string;
  Service: ServiceChange;
}
export const UpdateServiceRequest = S.suspend(() =>
  S.Struct({ Id: S.String, Service: ServiceChange }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServiceRequest",
}) as any as S.Schema<UpdateServiceRequest>;
export interface PrivateDnsPropertiesMutable {
  SOA: SOA;
}
export const PrivateDnsPropertiesMutable = S.suspend(() =>
  S.Struct({ SOA: SOA }),
).annotations({
  identifier: "PrivateDnsPropertiesMutable",
}) as any as S.Schema<PrivateDnsPropertiesMutable>;
export type OperationTargetsMap = { [key in OperationTargetType]?: string };
export const OperationTargetsMap = S.partial(
  S.Record({ key: OperationTargetType, value: S.UndefinedOr(S.String) }),
);
export interface PublicDnsNamespacePropertiesChange {
  DnsProperties: PublicDnsPropertiesMutableChange;
}
export const PublicDnsNamespacePropertiesChange = S.suspend(() =>
  S.Struct({ DnsProperties: PublicDnsPropertiesMutableChange }),
).annotations({
  identifier: "PublicDnsNamespacePropertiesChange",
}) as any as S.Schema<PublicDnsNamespacePropertiesChange>;
export interface PrivateDnsNamespaceProperties {
  DnsProperties: PrivateDnsPropertiesMutable;
}
export const PrivateDnsNamespaceProperties = S.suspend(() =>
  S.Struct({ DnsProperties: PrivateDnsPropertiesMutable }),
).annotations({
  identifier: "PrivateDnsNamespaceProperties",
}) as any as S.Schema<PrivateDnsNamespaceProperties>;
export interface HttpInstanceSummary {
  InstanceId?: string;
  NamespaceName?: string;
  ServiceName?: string;
  HealthStatus?: HealthStatus;
  Attributes?: { [key: string]: string | undefined };
}
export const HttpInstanceSummary = S.suspend(() =>
  S.Struct({
    InstanceId: S.optional(S.String),
    NamespaceName: S.optional(S.String),
    ServiceName: S.optional(S.String),
    HealthStatus: S.optional(HealthStatus),
    Attributes: S.optional(Attributes),
  }),
).annotations({
  identifier: "HttpInstanceSummary",
}) as any as S.Schema<HttpInstanceSummary>;
export type HttpInstanceSummaryList = HttpInstanceSummary[];
export const HttpInstanceSummaryList = S.Array(HttpInstanceSummary);
export interface Operation {
  Id?: string;
  OwnerAccount?: string;
  Type?: OperationType;
  Status?: OperationStatus;
  ErrorMessage?: string;
  ErrorCode?: string;
  CreateDate?: Date;
  UpdateDate?: Date;
  Targets?: { [key: string]: string | undefined };
}
export const Operation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    OwnerAccount: S.optional(S.String),
    Type: S.optional(OperationType),
    Status: S.optional(OperationStatus),
    ErrorMessage: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Targets: S.optional(OperationTargetsMap),
  }),
).annotations({ identifier: "Operation" }) as any as S.Schema<Operation>;
export interface DnsProperties {
  HostedZoneId?: string;
  SOA?: SOA;
}
export const DnsProperties = S.suspend(() =>
  S.Struct({ HostedZoneId: S.optional(S.String), SOA: S.optional(SOA) }),
).annotations({
  identifier: "DnsProperties",
}) as any as S.Schema<DnsProperties>;
export interface HttpProperties {
  HttpName?: string;
}
export const HttpProperties = S.suspend(() =>
  S.Struct({ HttpName: S.optional(S.String) }),
).annotations({
  identifier: "HttpProperties",
}) as any as S.Schema<HttpProperties>;
export interface NamespaceProperties {
  DnsProperties?: DnsProperties;
  HttpProperties?: HttpProperties;
}
export const NamespaceProperties = S.suspend(() =>
  S.Struct({
    DnsProperties: S.optional(DnsProperties),
    HttpProperties: S.optional(HttpProperties),
  }),
).annotations({
  identifier: "NamespaceProperties",
}) as any as S.Schema<NamespaceProperties>;
export interface NamespaceSummary {
  Id?: string;
  Arn?: string;
  ResourceOwner?: string;
  Name?: string;
  Type?: NamespaceType;
  Description?: string;
  ServiceCount?: number;
  Properties?: NamespaceProperties;
  CreateDate?: Date;
}
export const NamespaceSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(NamespaceType),
    Description: S.optional(S.String),
    ServiceCount: S.optional(S.Number),
    Properties: S.optional(NamespaceProperties),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "NamespaceSummary",
}) as any as S.Schema<NamespaceSummary>;
export type NamespaceSummariesList = NamespaceSummary[];
export const NamespaceSummariesList = S.Array(NamespaceSummary);
export interface OperationSummary {
  Id?: string;
  Status?: OperationStatus;
}
export const OperationSummary = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Status: S.optional(OperationStatus) }),
).annotations({
  identifier: "OperationSummary",
}) as any as S.Schema<OperationSummary>;
export type OperationSummaryList = OperationSummary[];
export const OperationSummaryList = S.Array(
  OperationSummary.pipe(T.XmlName("OperationSummary")).annotations({
    identifier: "OperationSummary",
  }),
);
export interface ServiceSummary {
  Id?: string;
  Arn?: string;
  ResourceOwner?: string;
  Name?: string;
  Type?: ServiceType;
  Description?: string;
  InstanceCount?: number;
  DnsConfig?: DnsConfig;
  HealthCheckConfig?: HealthCheckConfig;
  HealthCheckCustomConfig?: HealthCheckCustomConfig;
  CreateDate?: Date;
  CreatedByAccount?: string;
}
export const ServiceSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(ServiceType),
    Description: S.optional(S.String),
    InstanceCount: S.optional(S.Number),
    DnsConfig: S.optional(DnsConfig),
    HealthCheckConfig: S.optional(HealthCheckConfig),
    HealthCheckCustomConfig: S.optional(HealthCheckCustomConfig),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedByAccount: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceSummary",
}) as any as S.Schema<ServiceSummary>;
export type ServiceSummariesList = ServiceSummary[];
export const ServiceSummariesList = S.Array(ServiceSummary);
export interface PublicDnsNamespaceChange {
  Description?: string;
  Properties?: PublicDnsNamespacePropertiesChange;
}
export const PublicDnsNamespaceChange = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Properties: S.optional(PublicDnsNamespacePropertiesChange),
  }),
).annotations({
  identifier: "PublicDnsNamespaceChange",
}) as any as S.Schema<PublicDnsNamespaceChange>;
export interface PrivateDnsPropertiesMutableChange {
  SOA: SOAChange;
}
export const PrivateDnsPropertiesMutableChange = S.suspend(() =>
  S.Struct({ SOA: SOAChange }),
).annotations({
  identifier: "PrivateDnsPropertiesMutableChange",
}) as any as S.Schema<PrivateDnsPropertiesMutableChange>;
export interface CreatePrivateDnsNamespaceRequest {
  Name: string;
  CreatorRequestId?: string;
  Description?: string;
  Vpc: string;
  Tags?: Tag[];
  Properties?: PrivateDnsNamespaceProperties;
}
export const CreatePrivateDnsNamespaceRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CreatorRequestId: S.optional(S.String).pipe(T.IdempotencyToken()),
    Description: S.optional(S.String),
    Vpc: S.String,
    Tags: S.optional(TagList),
    Properties: S.optional(PrivateDnsNamespaceProperties),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePrivateDnsNamespaceRequest",
}) as any as S.Schema<CreatePrivateDnsNamespaceRequest>;
export interface CreatePublicDnsNamespaceResponse {
  OperationId?: string;
}
export const CreatePublicDnsNamespaceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "CreatePublicDnsNamespaceResponse",
}) as any as S.Schema<CreatePublicDnsNamespaceResponse>;
export interface CreateServiceResponse {
  Service?: Service;
}
export const CreateServiceResponse = S.suspend(() =>
  S.Struct({ Service: S.optional(Service) }),
).annotations({
  identifier: "CreateServiceResponse",
}) as any as S.Schema<CreateServiceResponse>;
export interface DiscoverInstancesResponse {
  Instances?: HttpInstanceSummary[];
  InstancesRevision?: number;
}
export const DiscoverInstancesResponse = S.suspend(() =>
  S.Struct({
    Instances: S.optional(HttpInstanceSummaryList),
    InstancesRevision: S.optional(S.Number),
  }),
).annotations({
  identifier: "DiscoverInstancesResponse",
}) as any as S.Schema<DiscoverInstancesResponse>;
export interface GetOperationResponse {
  Operation?: Operation;
}
export const GetOperationResponse = S.suspend(() =>
  S.Struct({ Operation: S.optional(Operation) }),
).annotations({
  identifier: "GetOperationResponse",
}) as any as S.Schema<GetOperationResponse>;
export interface ListNamespacesResponse {
  Namespaces?: NamespaceSummary[];
  NextToken?: string;
}
export const ListNamespacesResponse = S.suspend(() =>
  S.Struct({
    Namespaces: S.optional(NamespaceSummariesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNamespacesResponse",
}) as any as S.Schema<ListNamespacesResponse>;
export interface ListOperationsResponse {
  Operations?: OperationSummary[];
  NextToken?: string;
}
export const ListOperationsResponse = S.suspend(() =>
  S.Struct({
    Operations: S.optional(OperationSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOperationsResponse",
}) as any as S.Schema<ListOperationsResponse>;
export interface ListServicesResponse {
  Services?: ServiceSummary[];
  NextToken?: string;
}
export const ListServicesResponse = S.suspend(() =>
  S.Struct({
    Services: S.optional(ServiceSummariesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListServicesResponse",
}) as any as S.Schema<ListServicesResponse>;
export interface UpdatePublicDnsNamespaceRequest {
  Id: string;
  UpdaterRequestId?: string;
  Namespace: PublicDnsNamespaceChange;
}
export const UpdatePublicDnsNamespaceRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    UpdaterRequestId: S.optional(S.String).pipe(T.IdempotencyToken()),
    Namespace: PublicDnsNamespaceChange,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePublicDnsNamespaceRequest",
}) as any as S.Schema<UpdatePublicDnsNamespaceRequest>;
export interface UpdateServiceResponse {
  OperationId?: string;
}
export const UpdateServiceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "UpdateServiceResponse",
}) as any as S.Schema<UpdateServiceResponse>;
export interface PrivateDnsNamespacePropertiesChange {
  DnsProperties: PrivateDnsPropertiesMutableChange;
}
export const PrivateDnsNamespacePropertiesChange = S.suspend(() =>
  S.Struct({ DnsProperties: PrivateDnsPropertiesMutableChange }),
).annotations({
  identifier: "PrivateDnsNamespacePropertiesChange",
}) as any as S.Schema<PrivateDnsNamespacePropertiesChange>;
export interface Namespace {
  Id?: string;
  Arn?: string;
  ResourceOwner?: string;
  Name?: string;
  Type?: NamespaceType;
  Description?: string;
  ServiceCount?: number;
  Properties?: NamespaceProperties;
  CreateDate?: Date;
  CreatorRequestId?: string;
}
export const Namespace = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(NamespaceType),
    Description: S.optional(S.String),
    ServiceCount: S.optional(S.Number),
    Properties: S.optional(NamespaceProperties),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatorRequestId: S.optional(S.String),
  }),
).annotations({ identifier: "Namespace" }) as any as S.Schema<Namespace>;
export interface PrivateDnsNamespaceChange {
  Description?: string;
  Properties?: PrivateDnsNamespacePropertiesChange;
}
export const PrivateDnsNamespaceChange = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Properties: S.optional(PrivateDnsNamespacePropertiesChange),
  }),
).annotations({
  identifier: "PrivateDnsNamespaceChange",
}) as any as S.Schema<PrivateDnsNamespaceChange>;
export interface CreatePrivateDnsNamespaceResponse {
  OperationId?: string;
}
export const CreatePrivateDnsNamespaceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "CreatePrivateDnsNamespaceResponse",
}) as any as S.Schema<CreatePrivateDnsNamespaceResponse>;
export interface GetNamespaceResponse {
  Namespace?: Namespace;
}
export const GetNamespaceResponse = S.suspend(() =>
  S.Struct({ Namespace: S.optional(Namespace) }),
).annotations({
  identifier: "GetNamespaceResponse",
}) as any as S.Schema<GetNamespaceResponse>;
export interface UpdatePrivateDnsNamespaceRequest {
  Id: string;
  UpdaterRequestId?: string;
  Namespace: PrivateDnsNamespaceChange;
}
export const UpdatePrivateDnsNamespaceRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    UpdaterRequestId: S.optional(S.String).pipe(T.IdempotencyToken()),
    Namespace: PrivateDnsNamespaceChange,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePrivateDnsNamespaceRequest",
}) as any as S.Schema<UpdatePrivateDnsNamespaceRequest>;
export interface UpdatePublicDnsNamespaceResponse {
  OperationId?: string;
}
export const UpdatePublicDnsNamespaceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "UpdatePublicDnsNamespaceResponse",
}) as any as S.Schema<UpdatePublicDnsNamespaceResponse>;
export interface UpdatePrivateDnsNamespaceResponse {
  OperationId?: string;
}
export const UpdatePrivateDnsNamespaceResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "UpdatePrivateDnsNamespaceResponse",
}) as any as S.Schema<UpdatePrivateDnsNamespaceResponse>;

//# Errors
export class InvalidInput extends S.TaggedError<InvalidInput>()(
  "InvalidInput",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CustomHealthNotFound extends S.TaggedError<CustomHealthNotFound>()(
  "CustomHealthNotFound",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DuplicateRequest extends S.TaggedError<DuplicateRequest>()(
  "DuplicateRequest",
  { Message: S.optional(S.String), DuplicateOperationId: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceInUse extends S.TaggedError<ResourceInUse>()(
  "ResourceInUse",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class NamespaceNotFound extends S.TaggedError<NamespaceNotFound>()(
  "NamespaceNotFound",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InstanceNotFound extends S.TaggedError<InstanceNotFound>()(
  "InstanceNotFound",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceAttributesLimitExceededException extends S.TaggedError<ServiceAttributesLimitExceededException>()(
  "ServiceAttributesLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceNotFound extends S.TaggedError<ServiceNotFound>()(
  "ServiceNotFound",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestLimitExceeded extends S.TaggedError<RequestLimitExceeded>()(
  "RequestLimitExceeded",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceLimitExceeded extends S.TaggedError<ResourceLimitExceeded>()(
  "ResourceLimitExceeded",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NamespaceAlreadyExists extends S.TaggedError<NamespaceAlreadyExists>()(
  "NamespaceAlreadyExists",
  {
    Message: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    NamespaceId: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class OperationNotFound extends S.TaggedError<OperationNotFound>()(
  "OperationNotFound",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceAlreadyExists extends S.TaggedError<ServiceAlreadyExists>()(
  "ServiceAlreadyExists",
  {
    Message: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    ServiceId: S.optional(S.String),
    ServiceArn: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists tags for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  InvalidInput | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InvalidInput, ResourceNotFoundException],
}));
/**
 * Updates an HTTP
 * namespace.
 */
export const updateHttpNamespace: (
  input: UpdateHttpNamespaceRequest,
) => effect.Effect<
  UpdateHttpNamespaceResponse,
  | DuplicateRequest
  | InvalidInput
  | NamespaceNotFound
  | ResourceInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHttpNamespaceRequest,
  output: UpdateHttpNamespaceResponse,
  errors: [DuplicateRequest, InvalidInput, NamespaceNotFound, ResourceInUse],
}));
/**
 * Deletes specific attributes associated with a service.
 */
export const deleteServiceAttributes: (
  input: DeleteServiceAttributesRequest,
) => effect.Effect<
  DeleteServiceAttributesResponse,
  InvalidInput | ServiceNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceAttributesRequest,
  output: DeleteServiceAttributesResponse,
  errors: [InvalidInput, ServiceNotFound],
}));
/**
 * Deletes a namespace from the current account. If the namespace still contains one or more
 * services, the request fails.
 */
export const deleteNamespace: (
  input: DeleteNamespaceRequest,
) => effect.Effect<
  DeleteNamespaceResponse,
  | DuplicateRequest
  | InvalidInput
  | NamespaceNotFound
  | ResourceInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamespaceRequest,
  output: DeleteNamespaceResponse,
  errors: [DuplicateRequest, InvalidInput, NamespaceNotFound, ResourceInUse],
}));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  InvalidInput | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InvalidInput, ResourceNotFoundException],
}));
/**
 * Gets information about a specified instance.
 */
export const getInstance: (
  input: GetInstanceRequest,
) => effect.Effect<
  GetInstanceResponse,
  InstanceNotFound | InvalidInput | ServiceNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceRequest,
  output: GetInstanceResponse,
  errors: [InstanceNotFound, InvalidInput, ServiceNotFound],
}));
/**
 * Gets the current health status (`Healthy`, `Unhealthy`, or
 * `Unknown`) of one or more instances that are associated with a specified
 * service.
 *
 * There's a brief delay between when you register an instance and when the health status for
 * the instance is available.
 */
export const getInstancesHealthStatus: {
  (
    input: GetInstancesHealthStatusRequest,
  ): effect.Effect<
    GetInstancesHealthStatusResponse,
    InstanceNotFound | InvalidInput | ServiceNotFound | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetInstancesHealthStatusRequest,
  ) => stream.Stream<
    GetInstancesHealthStatusResponse,
    InstanceNotFound | InvalidInput | ServiceNotFound | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetInstancesHealthStatusRequest,
  ) => stream.Stream<
    unknown,
    InstanceNotFound | InvalidInput | ServiceNotFound | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetInstancesHealthStatusRequest,
  output: GetInstancesHealthStatusResponse,
  errors: [InstanceNotFound, InvalidInput, ServiceNotFound],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes a specified service and all associated service attributes. If the service still
 * contains one or more registered instances, the request fails.
 */
export const deleteService: (
  input: DeleteServiceRequest,
) => effect.Effect<
  DeleteServiceResponse,
  InvalidInput | ResourceInUse | ServiceNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceRequest,
  output: DeleteServiceResponse,
  errors: [InvalidInput, ResourceInUse, ServiceNotFound],
}));
/**
 * Gets the settings for a specified service.
 */
export const getService: (
  input: GetServiceRequest,
) => effect.Effect<
  GetServiceResponse,
  InvalidInput | ServiceNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceRequest,
  output: GetServiceResponse,
  errors: [InvalidInput, ServiceNotFound],
}));
/**
 * Returns the attributes associated with a specified service.
 */
export const getServiceAttributes: (
  input: GetServiceAttributesRequest,
) => effect.Effect<
  GetServiceAttributesResponse,
  InvalidInput | ServiceNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceAttributesRequest,
  output: GetServiceAttributesResponse,
  errors: [InvalidInput, ServiceNotFound],
}));
/**
 * Lists summary information about the instances that you registered by using a specified
 * service.
 */
export const listInstances: {
  (
    input: ListInstancesRequest,
  ): effect.Effect<
    ListInstancesResponse,
    InvalidInput | ServiceNotFound | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstancesRequest,
  ) => stream.Stream<
    ListInstancesResponse,
    InvalidInput | ServiceNotFound | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstancesRequest,
  ) => stream.Stream<
    unknown,
    InvalidInput | ServiceNotFound | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInstancesRequest,
  output: ListInstancesResponse,
  errors: [InvalidInput, ServiceNotFound],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Submits a request to change the health status of a custom health check to healthy or
 * unhealthy.
 *
 * You can use `UpdateInstanceCustomHealthStatus` to change the status only for
 * custom health checks, which you define using `HealthCheckCustomConfig` when you create
 * a service. You can't use it to change the status for Route 53 health checks, which you define using
 * `HealthCheckConfig`.
 *
 * For more information, see HealthCheckCustomConfig.
 */
export const updateInstanceCustomHealthStatus: (
  input: UpdateInstanceCustomHealthStatusRequest,
) => effect.Effect<
  UpdateInstanceCustomHealthStatusResponse,
  | CustomHealthNotFound
  | InstanceNotFound
  | InvalidInput
  | ServiceNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInstanceCustomHealthStatusRequest,
  output: UpdateInstanceCustomHealthStatusResponse,
  errors: [
    CustomHealthNotFound,
    InstanceNotFound,
    InvalidInput,
    ServiceNotFound,
  ],
}));
/**
 * Submits a request to update a specified service to add service-level attributes.
 */
export const updateServiceAttributes: (
  input: UpdateServiceAttributesRequest,
) => effect.Effect<
  UpdateServiceAttributesResponse,
  | InvalidInput
  | ServiceAttributesLimitExceededException
  | ServiceNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceAttributesRequest,
  output: UpdateServiceAttributesResponse,
  errors: [
    InvalidInput,
    ServiceAttributesLimitExceededException,
    ServiceNotFound,
  ],
}));
/**
 * Deletes the Amazon Route 53 DNS records and health check, if any, that Cloud Map created for the
 * specified instance.
 */
export const deregisterInstance: (
  input: DeregisterInstanceRequest,
) => effect.Effect<
  DeregisterInstanceResponse,
  | DuplicateRequest
  | InstanceNotFound
  | InvalidInput
  | ResourceInUse
  | ServiceNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterInstanceRequest,
  output: DeregisterInstanceResponse,
  errors: [
    DuplicateRequest,
    InstanceNotFound,
    InvalidInput,
    ResourceInUse,
    ServiceNotFound,
  ],
}));
/**
 * Discovers the increasing revision associated with an instance.
 */
export const discoverInstancesRevision: (
  input: DiscoverInstancesRevisionRequest,
) => effect.Effect<
  DiscoverInstancesRevisionResponse,
  | InvalidInput
  | NamespaceNotFound
  | RequestLimitExceeded
  | ServiceNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DiscoverInstancesRevisionRequest,
  output: DiscoverInstancesRevisionResponse,
  errors: [
    InvalidInput,
    NamespaceNotFound,
    RequestLimitExceeded,
    ServiceNotFound,
  ],
}));
/**
 * Lists summary information about the namespaces that were created by the current Amazon Web Services account and shared with the current Amazon Web Services account.
 */
export const listNamespaces: {
  (
    input: ListNamespacesRequest,
  ): effect.Effect<
    ListNamespacesResponse,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNamespacesRequest,
  ) => stream.Stream<
    ListNamespacesResponse,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNamespacesRequest,
  ) => stream.Stream<
    unknown,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNamespacesRequest,
  output: ListNamespacesResponse,
  errors: [InvalidInput],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists operations that match the criteria that you specify.
 */
export const listOperations: {
  (
    input: ListOperationsRequest,
  ): effect.Effect<
    ListOperationsResponse,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOperationsRequest,
  ) => stream.Stream<
    ListOperationsResponse,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOperationsRequest,
  ) => stream.Stream<
    unknown,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOperationsRequest,
  output: ListOperationsResponse,
  errors: [InvalidInput],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists summary information for all the services that are associated with one or more
 * namespaces.
 */
export const listServices: {
  (
    input: ListServicesRequest,
  ): effect.Effect<
    ListServicesResponse,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicesRequest,
  ) => stream.Stream<
    ListServicesResponse,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicesRequest,
  ) => stream.Stream<
    unknown,
    InvalidInput | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicesRequest,
  output: ListServicesResponse,
  errors: [InvalidInput],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Submits a request to perform the following operations:
 *
 * - Update the TTL setting for existing `DnsRecords` configurations
 *
 * - Add, update, or delete `HealthCheckConfig` for a specified service
 *
 * You can't add, update, or delete a `HealthCheckCustomConfig`
 * configuration.
 *
 * For public and private DNS namespaces, note the following:
 *
 * - If you omit any existing `DnsRecords` or `HealthCheckConfig`
 * configurations from an `UpdateService` request, the configurations are deleted from
 * the service.
 *
 * - If you omit an existing `HealthCheckCustomConfig` configuration from an
 * `UpdateService` request, the configuration isn't deleted from the service.
 *
 * You can't call `UpdateService` and update settings in the following
 * scenarios:
 *
 * - When the service is associated with an HTTP namespace
 *
 * - When the service is associated with a shared namespace and contains instances that were
 * registered by Amazon Web Services accounts other than the account making the `UpdateService`
 * call
 *
 * When you update settings for a service, Cloud Map also updates the corresponding settings
 * in all the records and health checks that were created by using the specified service.
 */
export const updateService: (
  input: UpdateServiceRequest,
) => effect.Effect<
  UpdateServiceResponse,
  DuplicateRequest | InvalidInput | ServiceNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceRequest,
  output: UpdateServiceResponse,
  errors: [DuplicateRequest, InvalidInput, ServiceNotFound],
}));
/**
 * Creates or updates one or more records and, optionally, creates a health check based on the
 * settings in a specified service. When you submit a `RegisterInstance` request, the
 * following occurs:
 *
 * - For each DNS record that you define in the service that's specified by
 * `ServiceId`, a record is created or updated in the hosted zone that's associated
 * with the corresponding namespace.
 *
 * - If the service includes `HealthCheckConfig`, a health check is created based on
 * the settings in the health check configuration.
 *
 * - The health check, if any, is associated with each of the new or updated records.
 *
 * One `RegisterInstance` request must complete before you can submit another
 * request and specify the same service ID and instance ID.
 *
 * For more information, see CreateService.
 *
 * When Cloud Map receives a DNS query for the specified DNS name, it returns the applicable
 * value:
 *
 * - **If the health check is healthy**: returns all the
 * records
 *
 * - **If the health check is unhealthy**: returns the applicable
 * value for the last healthy instance
 *
 * - **If you didn't specify a health check configuration**:
 * returns all the records
 *
 * For the current quota on the number of instances that you can register using the same
 * namespace and using the same service, see Cloud Map quotas in the
 * *Cloud Map Developer Guide*.
 */
export const registerInstance: (
  input: RegisterInstanceRequest,
) => effect.Effect<
  RegisterInstanceResponse,
  | DuplicateRequest
  | InvalidInput
  | ResourceInUse
  | ResourceLimitExceeded
  | ServiceNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterInstanceRequest,
  output: RegisterInstanceResponse,
  errors: [
    DuplicateRequest,
    InvalidInput,
    ResourceInUse,
    ResourceLimitExceeded,
    ServiceNotFound,
  ],
}));
/**
 * Discovers registered instances for a specified namespace and service. You can use
 * `DiscoverInstances` to discover instances for any type of namespace.
 * `DiscoverInstances` returns a randomized list of instances allowing customers to
 * distribute traffic evenly across instances. For public and private DNS namespaces, you can also
 * use DNS queries to discover instances.
 */
export const discoverInstances: (
  input: DiscoverInstancesRequest,
) => effect.Effect<
  DiscoverInstancesResponse,
  | InvalidInput
  | NamespaceNotFound
  | RequestLimitExceeded
  | ServiceNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DiscoverInstancesRequest,
  output: DiscoverInstancesResponse,
  errors: [
    InvalidInput,
    NamespaceNotFound,
    RequestLimitExceeded,
    ServiceNotFound,
  ],
}));
/**
 * Adds one or more tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InvalidInput
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InvalidInput, ResourceNotFoundException, TooManyTagsException],
}));
/**
 * Creates a public namespace based on DNS, which is visible on the internet. The namespace
 * defines your service naming scheme. For example, if you name your namespace
 * `example.com` and name your service `backend`, the resulting DNS name for
 * the service is `backend.example.com`. You can discover instances that were registered
 * with a public DNS namespace by using either a `DiscoverInstances` request or using
 * DNS. For the current quota on the number of namespaces that you can create using the same Amazon Web Services account, see Cloud Map quotas in the
 * *Cloud Map Developer Guide*.
 *
 * The `CreatePublicDnsNamespace` API operation is not supported in the Amazon Web Services GovCloud (US) Regions.
 */
export const createPublicDnsNamespace: (
  input: CreatePublicDnsNamespaceRequest,
) => effect.Effect<
  CreatePublicDnsNamespaceResponse,
  | DuplicateRequest
  | InvalidInput
  | NamespaceAlreadyExists
  | ResourceLimitExceeded
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePublicDnsNamespaceRequest,
  output: CreatePublicDnsNamespaceResponse,
  errors: [
    DuplicateRequest,
    InvalidInput,
    NamespaceAlreadyExists,
    ResourceLimitExceeded,
    TooManyTagsException,
  ],
}));
/**
 * Creates an HTTP namespace. Service instances registered using an HTTP namespace can be
 * discovered using a `DiscoverInstances` request but can't be discovered using
 * DNS.
 *
 * For the current quota on the number of namespaces that you can create using the same Amazon Web Services account, see Cloud Map quotas in the
 * *Cloud Map Developer Guide*.
 */
export const createHttpNamespace: (
  input: CreateHttpNamespaceRequest,
) => effect.Effect<
  CreateHttpNamespaceResponse,
  | DuplicateRequest
  | InvalidInput
  | NamespaceAlreadyExists
  | ResourceLimitExceeded
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHttpNamespaceRequest,
  output: CreateHttpNamespaceResponse,
  errors: [
    DuplicateRequest,
    InvalidInput,
    NamespaceAlreadyExists,
    ResourceLimitExceeded,
    TooManyTagsException,
  ],
}));
/**
 * Creates a private namespace based on DNS, which is visible only inside a specified Amazon
 * VPC. The namespace defines your service naming scheme. For example, if you name your namespace
 * `example.com` and name your service `backend`, the resulting DNS name for
 * the service is `backend.example.com`. Service instances that are registered using a
 * private DNS namespace can be discovered using either a `DiscoverInstances` request or
 * using DNS. For the current quota on the number of namespaces that you can create using the same
 * Amazon Web Services account, see Cloud Map quotas in the
 * *Cloud Map Developer Guide*.
 */
export const createPrivateDnsNamespace: (
  input: CreatePrivateDnsNamespaceRequest,
) => effect.Effect<
  CreatePrivateDnsNamespaceResponse,
  | DuplicateRequest
  | InvalidInput
  | NamespaceAlreadyExists
  | ResourceLimitExceeded
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePrivateDnsNamespaceRequest,
  output: CreatePrivateDnsNamespaceResponse,
  errors: [
    DuplicateRequest,
    InvalidInput,
    NamespaceAlreadyExists,
    ResourceLimitExceeded,
    TooManyTagsException,
  ],
}));
/**
 * Gets information about a namespace.
 */
export const getNamespace: (
  input: GetNamespaceRequest,
) => effect.Effect<
  GetNamespaceResponse,
  InvalidInput | NamespaceNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNamespaceRequest,
  output: GetNamespaceResponse,
  errors: [InvalidInput, NamespaceNotFound],
}));
/**
 * Gets information about any operation that returns an operation ID in the response, such as a
 * `CreateHttpNamespace` request.
 *
 * To get a list of operations that match specified criteria, see ListOperations.
 */
export const getOperation: (
  input: GetOperationRequest,
) => effect.Effect<
  GetOperationResponse,
  InvalidInput | OperationNotFound | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationRequest,
  output: GetOperationResponse,
  errors: [InvalidInput, OperationNotFound],
}));
/**
 * Updates a public DNS namespace.
 */
export const updatePublicDnsNamespace: (
  input: UpdatePublicDnsNamespaceRequest,
) => effect.Effect<
  UpdatePublicDnsNamespaceResponse,
  | DuplicateRequest
  | InvalidInput
  | NamespaceNotFound
  | ResourceInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePublicDnsNamespaceRequest,
  output: UpdatePublicDnsNamespaceResponse,
  errors: [DuplicateRequest, InvalidInput, NamespaceNotFound, ResourceInUse],
}));
/**
 * Creates a service. This action defines the configuration for the following entities:
 *
 * - For public and private DNS namespaces, one of the following combinations of DNS records in
 * Amazon Route 53:
 *
 * - `A`
 *
 * - `AAAA`
 *
 * - `A` and `AAAA`
 *
 * - `SRV`
 *
 * - `CNAME`
 *
 * - Optionally, a health check
 *
 * After you create the service, you can submit a RegisterInstance request, and
 * Cloud Map uses the values in the configuration to create the specified entities.
 *
 * For the current quota on the number of instances that you can register using the same
 * namespace and using the same service, see Cloud Map quotas in the
 * *Cloud Map Developer Guide*.
 */
export const createService: (
  input: CreateServiceRequest,
) => effect.Effect<
  CreateServiceResponse,
  | InvalidInput
  | NamespaceNotFound
  | ResourceLimitExceeded
  | ServiceAlreadyExists
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceRequest,
  output: CreateServiceResponse,
  errors: [
    InvalidInput,
    NamespaceNotFound,
    ResourceLimitExceeded,
    ServiceAlreadyExists,
    TooManyTagsException,
  ],
}));
/**
 * Updates a private DNS
 * namespace.
 */
export const updatePrivateDnsNamespace: (
  input: UpdatePrivateDnsNamespaceRequest,
) => effect.Effect<
  UpdatePrivateDnsNamespaceResponse,
  | DuplicateRequest
  | InvalidInput
  | NamespaceNotFound
  | ResourceInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePrivateDnsNamespaceRequest,
  output: UpdatePrivateDnsNamespaceResponse,
  errors: [DuplicateRequest, InvalidInput, NamespaceNotFound, ResourceInUse],
}));
