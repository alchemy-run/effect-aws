import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ServiceDiscovery",
  serviceShapeName: "Route53AutoNaming_v20170314",
});
const auth = T.AwsAuthSigv4({ name: "servicediscovery" });
const ver = T.ServiceVersion("2017-03-14");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://servicediscovery-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://servicediscovery-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://servicediscovery.{Region}.amazonaws.com",
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
                            "aws-cn",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://servicediscovery.{Region}.amazonaws.com.cn",
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
                            "aws-us-gov",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://servicediscovery.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://servicediscovery.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://servicediscovery.{Region}.{PartitionResult#dnsSuffix}",
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
export const ServiceAttributeKeyList = S.Array(S.String);
export const InstanceIdList = S.Array(S.String.pipe(T.XmlName("InstanceId")));
export const TagKeyList = S.Array(S.String);
export class DeleteNamespaceRequest extends S.Class<DeleteNamespaceRequest>(
  "DeleteNamespaceRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceRequest extends S.Class<DeleteServiceRequest>(
  "DeleteServiceRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceResponse extends S.Class<DeleteServiceResponse>(
  "DeleteServiceResponse",
)({}) {}
export class DeleteServiceAttributesRequest extends S.Class<DeleteServiceAttributesRequest>(
  "DeleteServiceAttributesRequest",
)(
  { ServiceId: S.String, Attributes: ServiceAttributeKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceAttributesResponse extends S.Class<DeleteServiceAttributesResponse>(
  "DeleteServiceAttributesResponse",
)({}) {}
export class DeregisterInstanceRequest extends S.Class<DeregisterInstanceRequest>(
  "DeregisterInstanceRequest",
)(
  { ServiceId: S.String, InstanceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DiscoverInstancesRevisionRequest extends S.Class<DiscoverInstancesRevisionRequest>(
  "DiscoverInstancesRevisionRequest",
)(
  {
    NamespaceName: S.String,
    ServiceName: S.String,
    OwnerAccount: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInstanceRequest extends S.Class<GetInstanceRequest>(
  "GetInstanceRequest",
)(
  { ServiceId: S.String, InstanceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInstancesHealthStatusRequest extends S.Class<GetInstancesHealthStatusRequest>(
  "GetInstancesHealthStatusRequest",
)(
  {
    ServiceId: S.String,
    Instances: S.optional(InstanceIdList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetNamespaceRequest extends S.Class<GetNamespaceRequest>(
  "GetNamespaceRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOperationRequest extends S.Class<GetOperationRequest>(
  "GetOperationRequest",
)(
  { OperationId: S.String, OwnerAccount: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceRequest extends S.Class<GetServiceRequest>(
  "GetServiceRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceAttributesRequest extends S.Class<GetServiceAttributesRequest>(
  "GetServiceAttributesRequest",
)(
  { ServiceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstancesRequest extends S.Class<ListInstancesRequest>(
  "ListInstancesRequest",
)(
  {
    ServiceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Attributes = S.Record({ key: S.String, value: S.String });
export class RegisterInstanceRequest extends S.Class<RegisterInstanceRequest>(
  "RegisterInstanceRequest",
)(
  {
    ServiceId: S.String,
    InstanceId: S.String,
    CreatorRequestId: S.optional(S.String),
    Attributes: Attributes,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateInstanceCustomHealthStatusRequest extends S.Class<UpdateInstanceCustomHealthStatusRequest>(
  "UpdateInstanceCustomHealthStatusRequest",
)(
  { ServiceId: S.String, InstanceId: S.String, Status: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateInstanceCustomHealthStatusResponse extends S.Class<UpdateInstanceCustomHealthStatusResponse>(
  "UpdateInstanceCustomHealthStatusResponse",
)({}) {}
export const FilterValues = S.Array(S.String.pipe(T.XmlName("item")));
export class HealthCheckConfig extends S.Class<HealthCheckConfig>(
  "HealthCheckConfig",
)({
  Type: S.String,
  ResourcePath: S.optional(S.String),
  FailureThreshold: S.optional(S.Number),
}) {}
export class HealthCheckCustomConfig extends S.Class<HealthCheckCustomConfig>(
  "HealthCheckCustomConfig",
)({ FailureThreshold: S.optional(S.Number) }) {}
export class NamespaceFilter extends S.Class<NamespaceFilter>(
  "NamespaceFilter",
)({ Name: S.String, Values: FilterValues, Condition: S.optional(S.String) }) {}
export const NamespaceFilters = S.Array(
  NamespaceFilter.pipe(T.XmlName("item")),
);
export class OperationFilter extends S.Class<OperationFilter>(
  "OperationFilter",
)({ Name: S.String, Values: FilterValues, Condition: S.optional(S.String) }) {}
export const OperationFilters = S.Array(
  OperationFilter.pipe(T.XmlName("item")),
);
export class ServiceFilter extends S.Class<ServiceFilter>("ServiceFilter")({
  Name: S.String,
  Values: FilterValues,
  Condition: S.optional(S.String),
}) {}
export const ServiceFilters = S.Array(ServiceFilter.pipe(T.XmlName("item")));
export class HttpNamespaceChange extends S.Class<HttpNamespaceChange>(
  "HttpNamespaceChange",
)({ Description: S.String }) {}
export const ServiceAttributesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class CreateHttpNamespaceRequest extends S.Class<CreateHttpNamespaceRequest>(
  "CreateHttpNamespaceRequest",
)(
  {
    Name: S.String,
    CreatorRequestId: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNamespaceResponse extends S.Class<DeleteNamespaceResponse>(
  "DeleteNamespaceResponse",
)({ OperationId: S.optional(S.String) }) {}
export class DeregisterInstanceResponse extends S.Class<DeregisterInstanceResponse>(
  "DeregisterInstanceResponse",
)({ OperationId: S.optional(S.String) }) {}
export class DiscoverInstancesRequest extends S.Class<DiscoverInstancesRequest>(
  "DiscoverInstancesRequest",
)(
  {
    NamespaceName: S.String,
    ServiceName: S.String,
    MaxResults: S.optional(S.Number),
    QueryParameters: S.optional(Attributes),
    OptionalParameters: S.optional(Attributes),
    HealthStatus: S.optional(S.String),
    OwnerAccount: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DiscoverInstancesRevisionResponse extends S.Class<DiscoverInstancesRevisionResponse>(
  "DiscoverInstancesRevisionResponse",
)({ InstancesRevision: S.optional(S.Number) }) {}
export class ListNamespacesRequest extends S.Class<ListNamespacesRequest>(
  "ListNamespacesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(NamespaceFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOperationsRequest extends S.Class<ListOperationsRequest>(
  "ListOperationsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(OperationFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicesRequest extends S.Class<ListServicesRequest>(
  "ListServicesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(ServiceFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class RegisterInstanceResponse extends S.Class<RegisterInstanceResponse>(
  "RegisterInstanceResponse",
)({ OperationId: S.optional(S.String) }) {}
export class UpdateHttpNamespaceRequest extends S.Class<UpdateHttpNamespaceRequest>(
  "UpdateHttpNamespaceRequest",
)(
  {
    Id: S.String,
    UpdaterRequestId: S.optional(S.String),
    Namespace: HttpNamespaceChange,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceAttributesRequest extends S.Class<UpdateServiceAttributesRequest>(
  "UpdateServiceAttributesRequest",
)(
  { ServiceId: S.String, Attributes: ServiceAttributesMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceAttributesResponse extends S.Class<UpdateServiceAttributesResponse>(
  "UpdateServiceAttributesResponse",
)({}) {}
export class SOA extends S.Class<SOA>("SOA")({ TTL: S.Number }) {}
export class PublicDnsPropertiesMutable extends S.Class<PublicDnsPropertiesMutable>(
  "PublicDnsPropertiesMutable",
)({ SOA: SOA }) {}
export class DnsRecord extends S.Class<DnsRecord>("DnsRecord")({
  Type: S.String,
  TTL: S.Number,
}) {}
export const DnsRecordList = S.Array(DnsRecord);
export class DnsConfigChange extends S.Class<DnsConfigChange>(
  "DnsConfigChange",
)({ DnsRecords: DnsRecordList }) {}
export class PublicDnsNamespaceProperties extends S.Class<PublicDnsNamespaceProperties>(
  "PublicDnsNamespaceProperties",
)({ DnsProperties: PublicDnsPropertiesMutable }) {}
export class DnsConfig extends S.Class<DnsConfig>("DnsConfig")({
  NamespaceId: S.optional(S.String),
  RoutingPolicy: S.optional(S.String),
  DnsRecords: DnsRecordList,
}) {}
export class Instance extends S.Class<Instance>("Instance")({
  Id: S.String,
  CreatorRequestId: S.optional(S.String),
  Attributes: S.optional(Attributes),
  CreatedByAccount: S.optional(S.String),
}) {}
export const InstanceHealthStatusMap = S.Record({
  key: S.String,
  value: S.String,
});
export class Service extends S.Class<Service>("Service")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  ResourceOwner: S.optional(S.String),
  Name: S.optional(S.String),
  NamespaceId: S.optional(S.String),
  Description: S.optional(S.String),
  InstanceCount: S.optional(S.Number),
  DnsConfig: S.optional(DnsConfig),
  Type: S.optional(S.String),
  HealthCheckConfig: S.optional(HealthCheckConfig),
  HealthCheckCustomConfig: S.optional(HealthCheckCustomConfig),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatorRequestId: S.optional(S.String),
  CreatedByAccount: S.optional(S.String),
}) {}
export class ServiceAttributes extends S.Class<ServiceAttributes>(
  "ServiceAttributes",
)({
  ServiceArn: S.optional(S.String),
  ResourceOwner: S.optional(S.String),
  Attributes: S.optional(ServiceAttributesMap),
}) {}
export class InstanceSummary extends S.Class<InstanceSummary>(
  "InstanceSummary",
)({
  Id: S.optional(S.String),
  Attributes: S.optional(Attributes),
  CreatedByAccount: S.optional(S.String),
}) {}
export const InstanceSummaryList = S.Array(
  InstanceSummary.pipe(T.XmlName("InstanceSummary")),
);
export class ServiceChange extends S.Class<ServiceChange>("ServiceChange")({
  Description: S.optional(S.String),
  DnsConfig: S.optional(DnsConfigChange),
  HealthCheckConfig: S.optional(HealthCheckConfig),
}) {}
export class SOAChange extends S.Class<SOAChange>("SOAChange")({
  TTL: S.Number,
}) {}
export class PublicDnsPropertiesMutableChange extends S.Class<PublicDnsPropertiesMutableChange>(
  "PublicDnsPropertiesMutableChange",
)({ SOA: SOAChange }) {}
export class CreateHttpNamespaceResponse extends S.Class<CreateHttpNamespaceResponse>(
  "CreateHttpNamespaceResponse",
)({ OperationId: S.optional(S.String) }) {}
export class CreatePublicDnsNamespaceRequest extends S.Class<CreatePublicDnsNamespaceRequest>(
  "CreatePublicDnsNamespaceRequest",
)(
  {
    Name: S.String,
    CreatorRequestId: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    Properties: S.optional(PublicDnsNamespaceProperties),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceRequest extends S.Class<CreateServiceRequest>(
  "CreateServiceRequest",
)(
  {
    Name: S.String,
    NamespaceId: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    Description: S.optional(S.String),
    DnsConfig: S.optional(DnsConfig),
    HealthCheckConfig: S.optional(HealthCheckConfig),
    HealthCheckCustomConfig: S.optional(HealthCheckCustomConfig),
    Tags: S.optional(TagList),
    Type: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInstanceResponse extends S.Class<GetInstanceResponse>(
  "GetInstanceResponse",
)({ ResourceOwner: S.optional(S.String), Instance: S.optional(Instance) }) {}
export class GetInstancesHealthStatusResponse extends S.Class<GetInstancesHealthStatusResponse>(
  "GetInstancesHealthStatusResponse",
)({
  Status: S.optional(InstanceHealthStatusMap),
  NextToken: S.optional(S.String),
}) {}
export class GetServiceResponse extends S.Class<GetServiceResponse>(
  "GetServiceResponse",
)({ Service: S.optional(Service) }) {}
export class GetServiceAttributesResponse extends S.Class<GetServiceAttributesResponse>(
  "GetServiceAttributesResponse",
)({ ServiceAttributes: S.optional(ServiceAttributes) }) {}
export class ListInstancesResponse extends S.Class<ListInstancesResponse>(
  "ListInstancesResponse",
)({
  ResourceOwner: S.optional(S.String),
  Instances: S.optional(InstanceSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class UpdateHttpNamespaceResponse extends S.Class<UpdateHttpNamespaceResponse>(
  "UpdateHttpNamespaceResponse",
)({ OperationId: S.optional(S.String) }) {}
export class UpdateServiceRequest extends S.Class<UpdateServiceRequest>(
  "UpdateServiceRequest",
)(
  { Id: S.String, Service: ServiceChange },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PrivateDnsPropertiesMutable extends S.Class<PrivateDnsPropertiesMutable>(
  "PrivateDnsPropertiesMutable",
)({ SOA: SOA }) {}
export const OperationTargetsMap = S.Record({ key: S.String, value: S.String });
export class PublicDnsNamespacePropertiesChange extends S.Class<PublicDnsNamespacePropertiesChange>(
  "PublicDnsNamespacePropertiesChange",
)({ DnsProperties: PublicDnsPropertiesMutableChange }) {}
export class PrivateDnsNamespaceProperties extends S.Class<PrivateDnsNamespaceProperties>(
  "PrivateDnsNamespaceProperties",
)({ DnsProperties: PrivateDnsPropertiesMutable }) {}
export class HttpInstanceSummary extends S.Class<HttpInstanceSummary>(
  "HttpInstanceSummary",
)({
  InstanceId: S.optional(S.String),
  NamespaceName: S.optional(S.String),
  ServiceName: S.optional(S.String),
  HealthStatus: S.optional(S.String),
  Attributes: S.optional(Attributes),
}) {}
export const HttpInstanceSummaryList = S.Array(HttpInstanceSummary);
export class Operation extends S.Class<Operation>("Operation")({
  Id: S.optional(S.String),
  OwnerAccount: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Targets: S.optional(OperationTargetsMap),
}) {}
export class DnsProperties extends S.Class<DnsProperties>("DnsProperties")({
  HostedZoneId: S.optional(S.String),
  SOA: S.optional(SOA),
}) {}
export class HttpProperties extends S.Class<HttpProperties>("HttpProperties")({
  HttpName: S.optional(S.String),
}) {}
export class NamespaceProperties extends S.Class<NamespaceProperties>(
  "NamespaceProperties",
)({
  DnsProperties: S.optional(DnsProperties),
  HttpProperties: S.optional(HttpProperties),
}) {}
export class NamespaceSummary extends S.Class<NamespaceSummary>(
  "NamespaceSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  ResourceOwner: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
  ServiceCount: S.optional(S.Number),
  Properties: S.optional(NamespaceProperties),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const NamespaceSummariesList = S.Array(NamespaceSummary);
export class OperationSummary extends S.Class<OperationSummary>(
  "OperationSummary",
)({ Id: S.optional(S.String), Status: S.optional(S.String) }) {}
export const OperationSummaryList = S.Array(
  OperationSummary.pipe(T.XmlName("OperationSummary")),
);
export class ServiceSummary extends S.Class<ServiceSummary>("ServiceSummary")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  ResourceOwner: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
  InstanceCount: S.optional(S.Number),
  DnsConfig: S.optional(DnsConfig),
  HealthCheckConfig: S.optional(HealthCheckConfig),
  HealthCheckCustomConfig: S.optional(HealthCheckCustomConfig),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedByAccount: S.optional(S.String),
}) {}
export const ServiceSummariesList = S.Array(ServiceSummary);
export class PublicDnsNamespaceChange extends S.Class<PublicDnsNamespaceChange>(
  "PublicDnsNamespaceChange",
)({
  Description: S.optional(S.String),
  Properties: S.optional(PublicDnsNamespacePropertiesChange),
}) {}
export class PrivateDnsPropertiesMutableChange extends S.Class<PrivateDnsPropertiesMutableChange>(
  "PrivateDnsPropertiesMutableChange",
)({ SOA: SOAChange }) {}
export class CreatePrivateDnsNamespaceRequest extends S.Class<CreatePrivateDnsNamespaceRequest>(
  "CreatePrivateDnsNamespaceRequest",
)(
  {
    Name: S.String,
    CreatorRequestId: S.optional(S.String),
    Description: S.optional(S.String),
    Vpc: S.String,
    Tags: S.optional(TagList),
    Properties: S.optional(PrivateDnsNamespaceProperties),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePublicDnsNamespaceResponse extends S.Class<CreatePublicDnsNamespaceResponse>(
  "CreatePublicDnsNamespaceResponse",
)({ OperationId: S.optional(S.String) }) {}
export class CreateServiceResponse extends S.Class<CreateServiceResponse>(
  "CreateServiceResponse",
)({ Service: S.optional(Service) }) {}
export class DiscoverInstancesResponse extends S.Class<DiscoverInstancesResponse>(
  "DiscoverInstancesResponse",
)({
  Instances: S.optional(HttpInstanceSummaryList),
  InstancesRevision: S.optional(S.Number),
}) {}
export class GetOperationResponse extends S.Class<GetOperationResponse>(
  "GetOperationResponse",
)({ Operation: S.optional(Operation) }) {}
export class ListNamespacesResponse extends S.Class<ListNamespacesResponse>(
  "ListNamespacesResponse",
)({
  Namespaces: S.optional(NamespaceSummariesList),
  NextToken: S.optional(S.String),
}) {}
export class ListOperationsResponse extends S.Class<ListOperationsResponse>(
  "ListOperationsResponse",
)({
  Operations: S.optional(OperationSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListServicesResponse extends S.Class<ListServicesResponse>(
  "ListServicesResponse",
)({
  Services: S.optional(ServiceSummariesList),
  NextToken: S.optional(S.String),
}) {}
export class UpdatePublicDnsNamespaceRequest extends S.Class<UpdatePublicDnsNamespaceRequest>(
  "UpdatePublicDnsNamespaceRequest",
)(
  {
    Id: S.String,
    UpdaterRequestId: S.optional(S.String),
    Namespace: PublicDnsNamespaceChange,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceResponse extends S.Class<UpdateServiceResponse>(
  "UpdateServiceResponse",
)({ OperationId: S.optional(S.String) }) {}
export class PrivateDnsNamespacePropertiesChange extends S.Class<PrivateDnsNamespacePropertiesChange>(
  "PrivateDnsNamespacePropertiesChange",
)({ DnsProperties: PrivateDnsPropertiesMutableChange }) {}
export class Namespace extends S.Class<Namespace>("Namespace")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  ResourceOwner: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
  ServiceCount: S.optional(S.Number),
  Properties: S.optional(NamespaceProperties),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatorRequestId: S.optional(S.String),
}) {}
export class PrivateDnsNamespaceChange extends S.Class<PrivateDnsNamespaceChange>(
  "PrivateDnsNamespaceChange",
)({
  Description: S.optional(S.String),
  Properties: S.optional(PrivateDnsNamespacePropertiesChange),
}) {}
export class CreatePrivateDnsNamespaceResponse extends S.Class<CreatePrivateDnsNamespaceResponse>(
  "CreatePrivateDnsNamespaceResponse",
)({ OperationId: S.optional(S.String) }) {}
export class GetNamespaceResponse extends S.Class<GetNamespaceResponse>(
  "GetNamespaceResponse",
)({ Namespace: S.optional(Namespace) }) {}
export class UpdatePrivateDnsNamespaceRequest extends S.Class<UpdatePrivateDnsNamespaceRequest>(
  "UpdatePrivateDnsNamespaceRequest",
)(
  {
    Id: S.String,
    UpdaterRequestId: S.optional(S.String),
    Namespace: PrivateDnsNamespaceChange,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePublicDnsNamespaceResponse extends S.Class<UpdatePublicDnsNamespaceResponse>(
  "UpdatePublicDnsNamespaceResponse",
)({ OperationId: S.optional(S.String) }) {}
export class UpdatePrivateDnsNamespaceResponse extends S.Class<UpdatePrivateDnsNamespaceResponse>(
  "UpdatePrivateDnsNamespaceResponse",
)({ OperationId: S.optional(S.String) }) {}

//# Errors
export class InvalidInput extends S.TaggedError<InvalidInput>()(
  "InvalidInput",
  { Message: S.optional(S.String) },
) {}
export class CustomHealthNotFound extends S.TaggedError<CustomHealthNotFound>()(
  "CustomHealthNotFound",
  { Message: S.optional(S.String) },
) {}
export class DuplicateRequest extends S.TaggedError<DuplicateRequest>()(
  "DuplicateRequest",
  { Message: S.optional(S.String), DuplicateOperationId: S.optional(S.String) },
) {}
export class ResourceInUse extends S.TaggedError<ResourceInUse>()(
  "ResourceInUse",
  { Message: S.optional(S.String) },
) {}
export class NamespaceNotFound extends S.TaggedError<NamespaceNotFound>()(
  "NamespaceNotFound",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class InstanceNotFound extends S.TaggedError<InstanceNotFound>()(
  "InstanceNotFound",
  { Message: S.optional(S.String) },
) {}
export class ServiceAttributesLimitExceededException extends S.TaggedError<ServiceAttributesLimitExceededException>()(
  "ServiceAttributesLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class ServiceNotFound extends S.TaggedError<ServiceNotFound>()(
  "ServiceNotFound",
  { Message: S.optional(S.String) },
) {}
export class RequestLimitExceeded extends S.TaggedError<RequestLimitExceeded>()(
  "RequestLimitExceeded",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceLimitExceeded extends S.TaggedError<ResourceLimitExceeded>()(
  "ResourceLimitExceeded",
  { Message: S.optional(S.String) },
) {}
export class NamespaceAlreadyExists extends S.TaggedError<NamespaceAlreadyExists>()(
  "NamespaceAlreadyExists",
  {
    Message: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    NamespaceId: S.optional(S.String),
  },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}
export class OperationNotFound extends S.TaggedError<OperationNotFound>()(
  "OperationNotFound",
  { Message: S.optional(S.String) },
) {}
export class ServiceAlreadyExists extends S.TaggedError<ServiceAlreadyExists>()(
  "ServiceAlreadyExists",
  {
    Message: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    ServiceId: S.optional(S.String),
    ServiceArn: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Lists tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InvalidInput, ResourceNotFoundException],
}));
/**
 * Updates an HTTP
 * namespace.
 */
export const updateHttpNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHttpNamespaceRequest,
  output: UpdateHttpNamespaceResponse,
  errors: [DuplicateRequest, InvalidInput, NamespaceNotFound, ResourceInUse],
}));
/**
 * Deletes specific attributes associated with a service.
 */
export const deleteServiceAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteServiceAttributesRequest,
    output: DeleteServiceAttributesResponse,
    errors: [InvalidInput, ServiceNotFound],
  }),
);
/**
 * Deletes a namespace from the current account. If the namespace still contains one or more
 * services, the request fails.
 */
export const deleteNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamespaceRequest,
  output: DeleteNamespaceResponse,
  errors: [DuplicateRequest, InvalidInput, NamespaceNotFound, ResourceInUse],
}));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InvalidInput, ResourceNotFoundException],
}));
/**
 * Gets information about a specified instance.
 */
export const getInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getInstancesHealthStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceRequest,
  output: DeleteServiceResponse,
  errors: [InvalidInput, ResourceInUse, ServiceNotFound],
}));
/**
 * Gets the settings for a specified service.
 */
export const getService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceRequest,
  output: GetServiceResponse,
  errors: [InvalidInput, ServiceNotFound],
}));
/**
 * Returns the attributes associated with a specified service.
 */
export const getServiceAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetServiceAttributesRequest,
    output: GetServiceAttributesResponse,
    errors: [InvalidInput, ServiceNotFound],
  }),
);
/**
 * Lists summary information about the instances that you registered by using a specified
 * service.
 */
export const listInstances = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInstancesRequest,
    output: ListInstancesResponse,
    errors: [InvalidInput, ServiceNotFound],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
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
export const updateInstanceCustomHealthStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateServiceAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceAttributesRequest,
    output: UpdateServiceAttributesResponse,
    errors: [
      InvalidInput,
      ServiceAttributesLimitExceededException,
      ServiceNotFound,
    ],
  }),
);
/**
 * Deletes the Amazon Route 53 DNS records and health check, if any, that Cloud Map created for the
 * specified instance.
 */
export const deregisterInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const discoverInstancesRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DiscoverInstancesRevisionRequest,
    output: DiscoverInstancesRevisionResponse,
    errors: [
      InvalidInput,
      NamespaceNotFound,
      RequestLimitExceeded,
      ServiceNotFound,
    ],
  }),
);
/**
 * Lists summary information about the namespaces that were created by the current Amazon Web Services account and shared with the current Amazon Web Services account.
 */
export const listNamespaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListNamespacesRequest,
    output: ListNamespacesResponse,
    errors: [InvalidInput],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists operations that match the criteria that you specify.
 */
export const listOperations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListOperationsRequest,
    output: ListOperationsResponse,
    errors: [InvalidInput],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists summary information for all the services that are associated with one or more
 * namespaces.
 */
export const listServices = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListServicesRequest,
    output: ListServicesResponse,
    errors: [InvalidInput],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
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
export const updateService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const registerInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const discoverInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPublicDnsNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePublicDnsNamespaceRequest,
    output: CreatePublicDnsNamespaceResponse,
    errors: [
      DuplicateRequest,
      InvalidInput,
      NamespaceAlreadyExists,
      ResourceLimitExceeded,
      TooManyTagsException,
    ],
  }),
);
/**
 * Creates an HTTP namespace. Service instances registered using an HTTP namespace can be
 * discovered using a `DiscoverInstances` request but can't be discovered using
 * DNS.
 *
 * For the current quota on the number of namespaces that you can create using the same Amazon Web Services account, see Cloud Map quotas in the
 * *Cloud Map Developer Guide*.
 */
export const createHttpNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPrivateDnsNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePrivateDnsNamespaceRequest,
    output: CreatePrivateDnsNamespaceResponse,
    errors: [
      DuplicateRequest,
      InvalidInput,
      NamespaceAlreadyExists,
      ResourceLimitExceeded,
      TooManyTagsException,
    ],
  }),
);
/**
 * Gets information about a namespace.
 */
export const getNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationRequest,
  output: GetOperationResponse,
  errors: [InvalidInput, OperationNotFound],
}));
/**
 * Updates a public DNS namespace.
 */
export const updatePublicDnsNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePublicDnsNamespaceRequest,
    output: UpdatePublicDnsNamespaceResponse,
    errors: [DuplicateRequest, InvalidInput, NamespaceNotFound, ResourceInUse],
  }),
);
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
export const createService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePrivateDnsNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePrivateDnsNamespaceRequest,
    output: UpdatePrivateDnsNamespaceResponse,
    errors: [DuplicateRequest, InvalidInput, NamespaceNotFound, ResourceInUse],
  }),
);
