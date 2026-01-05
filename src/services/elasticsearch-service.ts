import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://es.amazonaws.com/doc/2015-01-01/");
const svc = T.AwsApiService({
  sdkId: "Elasticsearch Service",
  serviceShapeName: "AmazonElasticsearchService2015",
});
const auth = T.AwsAuthSigv4({ name: "es" });
const ver = T.ServiceVersion("2015-01-01");
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
                        url: "https://es-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://es-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://aos.{Region}.api.aws",
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
                        url: "https://aos.{Region}.api.amazonwebservices.com.cn",
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
                        url: "https://aos.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://es.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://es.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteElasticsearchServiceRoleRequest extends S.Class<DeleteElasticsearchServiceRoleRequest>(
  "DeleteElasticsearchServiceRoleRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteElasticsearchServiceRoleResponse extends S.Class<DeleteElasticsearchServiceRoleResponse>(
  "DeleteElasticsearchServiceRoleResponse",
)({}, ns) {}
export const DomainNameList = S.Array(S.String);
export const VpcEndpointIdList = S.Array(S.String);
export const StringList = S.Array(S.String);
export class AcceptInboundCrossClusterSearchConnectionRequest extends S.Class<AcceptInboundCrossClusterSearchConnectionRequest>(
  "AcceptInboundCrossClusterSearchConnectionRequest",
)(
  {
    CrossClusterSearchConnectionId: S.String.pipe(
      T.HttpLabel("CrossClusterSearchConnectionId"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2015-01-01/es/ccs/inboundConnection/{CrossClusterSearchConnectionId}/accept",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociatePackageRequest extends S.Class<AssociatePackageRequest>(
  "AssociatePackageRequest",
)(
  {
    PackageID: S.String.pipe(T.HttpLabel("PackageID")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/packages/associate/{PackageID}/{DomainName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AuthorizeVpcEndpointAccessRequest extends S.Class<AuthorizeVpcEndpointAccessRequest>(
  "AuthorizeVpcEndpointAccessRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")), Account: S.String },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/es/domain/{DomainName}/authorizeVpcEndpointAccess",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelDomainConfigChangeRequest extends S.Class<CancelDomainConfigChangeRequest>(
  "CancelDomainConfigChangeRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DryRun: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/es/domain/{DomainName}/config/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelElasticsearchServiceSoftwareUpdateRequest extends S.Class<CancelElasticsearchServiceSoftwareUpdateRequest>(
  "CancelElasticsearchServiceSoftwareUpdateRequest",
)(
  { DomainName: S.String },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/es/serviceSoftwareUpdate/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VPCOptions extends S.Class<VPCOptions>("VPCOptions")({
  SubnetIds: S.optional(StringList),
  SecurityGroupIds: S.optional(StringList),
}) {}
export class CreateVpcEndpointRequest extends S.Class<CreateVpcEndpointRequest>(
  "CreateVpcEndpointRequest",
)(
  {
    DomainArn: S.String,
    VpcOptions: VPCOptions,
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/es/vpcEndpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteElasticsearchDomainRequest extends S.Class<DeleteElasticsearchDomainRequest>(
  "DeleteElasticsearchDomainRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2015-01-01/es/domain/{DomainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInboundCrossClusterSearchConnectionRequest extends S.Class<DeleteInboundCrossClusterSearchConnectionRequest>(
  "DeleteInboundCrossClusterSearchConnectionRequest",
)(
  {
    CrossClusterSearchConnectionId: S.String.pipe(
      T.HttpLabel("CrossClusterSearchConnectionId"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2015-01-01/es/ccs/inboundConnection/{CrossClusterSearchConnectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOutboundCrossClusterSearchConnectionRequest extends S.Class<DeleteOutboundCrossClusterSearchConnectionRequest>(
  "DeleteOutboundCrossClusterSearchConnectionRequest",
)(
  {
    CrossClusterSearchConnectionId: S.String.pipe(
      T.HttpLabel("CrossClusterSearchConnectionId"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2015-01-01/es/ccs/outboundConnection/{CrossClusterSearchConnectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackageRequest extends S.Class<DeletePackageRequest>(
  "DeletePackageRequest",
)(
  { PackageID: S.String.pipe(T.HttpLabel("PackageID")) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/2015-01-01/packages/{PackageID}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVpcEndpointRequest extends S.Class<DeleteVpcEndpointRequest>(
  "DeleteVpcEndpointRequest",
)(
  { VpcEndpointId: S.String.pipe(T.HttpLabel("VpcEndpointId")) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2015-01-01/es/vpcEndpoints/{VpcEndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDomainAutoTunesRequest extends S.Class<DescribeDomainAutoTunesRequest>(
  "DescribeDomainAutoTunesRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2015-01-01/es/domain/{DomainName}/autoTunes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDomainChangeProgressRequest extends S.Class<DescribeDomainChangeProgressRequest>(
  "DescribeDomainChangeProgressRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ChangeId: S.optional(S.String).pipe(T.HttpQuery("changeid")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2015-01-01/es/domain/{DomainName}/progress",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeElasticsearchDomainRequest extends S.Class<DescribeElasticsearchDomainRequest>(
  "DescribeElasticsearchDomainRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/es/domain/{DomainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeElasticsearchDomainConfigRequest extends S.Class<DescribeElasticsearchDomainConfigRequest>(
  "DescribeElasticsearchDomainConfigRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/es/domain/{DomainName}/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeElasticsearchDomainsRequest extends S.Class<DescribeElasticsearchDomainsRequest>(
  "DescribeElasticsearchDomainsRequest",
)(
  { DomainNames: DomainNameList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/es/domain-info" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeElasticsearchInstanceTypeLimitsRequest extends S.Class<DescribeElasticsearchInstanceTypeLimitsRequest>(
  "DescribeElasticsearchInstanceTypeLimitsRequest",
)(
  {
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
    InstanceType: S.String.pipe(T.HttpLabel("InstanceType")),
    ElasticsearchVersion: S.String.pipe(T.HttpLabel("ElasticsearchVersion")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2015-01-01/es/instanceTypeLimits/{ElasticsearchVersion}/{InstanceType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ValueStringList = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.optional(S.String),
  Values: S.optional(ValueStringList),
}) {}
export const FilterList = S.Array(Filter);
export class DescribeOutboundCrossClusterSearchConnectionsRequest extends S.Class<DescribeOutboundCrossClusterSearchConnectionsRequest>(
  "DescribeOutboundCrossClusterSearchConnectionsRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/es/ccs/outboundConnection/search",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReservedElasticsearchInstanceOfferingsRequest extends S.Class<DescribeReservedElasticsearchInstanceOfferingsRequest>(
  "DescribeReservedElasticsearchInstanceOfferingsRequest",
)(
  {
    ReservedElasticsearchInstanceOfferingId: S.optional(S.String).pipe(
      T.HttpQuery("offeringId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/es/reservedInstanceOfferings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReservedElasticsearchInstancesRequest extends S.Class<DescribeReservedElasticsearchInstancesRequest>(
  "DescribeReservedElasticsearchInstancesRequest",
)(
  {
    ReservedElasticsearchInstanceId: S.optional(S.String).pipe(
      T.HttpQuery("reservationId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/es/reservedInstances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVpcEndpointsRequest extends S.Class<DescribeVpcEndpointsRequest>(
  "DescribeVpcEndpointsRequest",
)(
  { VpcEndpointIds: VpcEndpointIdList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/es/vpcEndpoints/describe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DissociatePackageRequest extends S.Class<DissociatePackageRequest>(
  "DissociatePackageRequest",
)(
  {
    PackageID: S.String.pipe(T.HttpLabel("PackageID")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/packages/dissociate/{PackageID}/{DomainName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCompatibleElasticsearchVersionsRequest extends S.Class<GetCompatibleElasticsearchVersionsRequest>(
  "GetCompatibleElasticsearchVersionsRequest",
)(
  { DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/es/compatibleVersions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPackageVersionHistoryRequest extends S.Class<GetPackageVersionHistoryRequest>(
  "GetPackageVersionHistoryRequest",
)(
  {
    PackageID: S.String.pipe(T.HttpLabel("PackageID")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/packages/{PackageID}/history" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUpgradeHistoryRequest extends S.Class<GetUpgradeHistoryRequest>(
  "GetUpgradeHistoryRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2015-01-01/es/upgradeDomain/{DomainName}/history",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUpgradeStatusRequest extends S.Class<GetUpgradeStatusRequest>(
  "GetUpgradeStatusRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2015-01-01/es/upgradeDomain/{DomainName}/status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainNamesRequest extends S.Class<ListDomainNamesRequest>(
  "ListDomainNamesRequest",
)(
  { EngineType: S.optional(S.String).pipe(T.HttpQuery("engineType")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/domain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainsForPackageRequest extends S.Class<ListDomainsForPackageRequest>(
  "ListDomainsForPackageRequest",
)(
  {
    PackageID: S.String.pipe(T.HttpLabel("PackageID")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/packages/{PackageID}/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListElasticsearchInstanceTypesRequest extends S.Class<ListElasticsearchInstanceTypesRequest>(
  "ListElasticsearchInstanceTypesRequest",
)(
  {
    ElasticsearchVersion: S.String.pipe(T.HttpLabel("ElasticsearchVersion")),
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2015-01-01/es/instanceTypes/{ElasticsearchVersion}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListElasticsearchVersionsRequest extends S.Class<ListElasticsearchVersionsRequest>(
  "ListElasticsearchVersionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/es/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackagesForDomainRequest extends S.Class<ListPackagesForDomainRequest>(
  "ListPackagesForDomainRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/domain/{DomainName}/packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsRequest extends S.Class<ListTagsRequest>(
  "ListTagsRequest",
)(
  { ARN: S.String.pipe(T.HttpQuery("arn")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVpcEndpointAccessRequest extends S.Class<ListVpcEndpointAccessRequest>(
  "ListVpcEndpointAccessRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2015-01-01/es/domain/{DomainName}/listVpcEndpointAccess",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVpcEndpointsRequest extends S.Class<ListVpcEndpointsRequest>(
  "ListVpcEndpointsRequest",
)(
  { NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2015-01-01/es/vpcEndpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVpcEndpointsForDomainRequest extends S.Class<ListVpcEndpointsForDomainRequest>(
  "ListVpcEndpointsForDomainRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2015-01-01/es/domain/{DomainName}/vpcEndpoints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PurchaseReservedElasticsearchInstanceOfferingRequest extends S.Class<PurchaseReservedElasticsearchInstanceOfferingRequest>(
  "PurchaseReservedElasticsearchInstanceOfferingRequest",
)(
  {
    ReservedElasticsearchInstanceOfferingId: S.String,
    ReservationName: S.String,
    InstanceCount: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/es/purchaseReservedInstanceOffering",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectInboundCrossClusterSearchConnectionRequest extends S.Class<RejectInboundCrossClusterSearchConnectionRequest>(
  "RejectInboundCrossClusterSearchConnectionRequest",
)(
  {
    CrossClusterSearchConnectionId: S.String.pipe(
      T.HttpLabel("CrossClusterSearchConnectionId"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2015-01-01/es/ccs/inboundConnection/{CrossClusterSearchConnectionId}/reject",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveTagsRequest extends S.Class<RemoveTagsRequest>(
  "RemoveTagsRequest",
)(
  { ARN: S.String, TagKeys: StringList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/tags-removal" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveTagsResponse extends S.Class<RemoveTagsResponse>(
  "RemoveTagsResponse",
)({}, ns) {}
export class RevokeVpcEndpointAccessRequest extends S.Class<RevokeVpcEndpointAccessRequest>(
  "RevokeVpcEndpointAccessRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")), Account: S.String },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/es/domain/{DomainName}/revokeVpcEndpointAccess",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RevokeVpcEndpointAccessResponse extends S.Class<RevokeVpcEndpointAccessResponse>(
  "RevokeVpcEndpointAccessResponse",
)({}, ns) {}
export class StartElasticsearchServiceSoftwareUpdateRequest extends S.Class<StartElasticsearchServiceSoftwareUpdateRequest>(
  "StartElasticsearchServiceSoftwareUpdateRequest",
)(
  { DomainName: S.String },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/es/serviceSoftwareUpdate/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PackageSource extends S.Class<PackageSource>("PackageSource")({
  S3BucketName: S.optional(S.String),
  S3Key: S.optional(S.String),
}) {}
export class UpdatePackageRequest extends S.Class<UpdatePackageRequest>(
  "UpdatePackageRequest",
)(
  {
    PackageID: S.String,
    PackageSource: PackageSource,
    PackageDescription: S.optional(S.String),
    CommitMessage: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/packages/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVpcEndpointRequest extends S.Class<UpdateVpcEndpointRequest>(
  "UpdateVpcEndpointRequest",
)(
  { VpcEndpointId: S.String, VpcOptions: VPCOptions },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/es/vpcEndpoints/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpgradeElasticsearchDomainRequest extends S.Class<UpgradeElasticsearchDomainRequest>(
  "UpgradeElasticsearchDomainRequest",
)(
  {
    DomainName: S.String,
    TargetVersion: S.String,
    PerformCheckOnly: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/es/upgradeDomain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DescribePackagesFilterValues = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export const GUIDList = S.Array(S.String);
export class EBSOptions extends S.Class<EBSOptions>("EBSOptions")({
  EBSEnabled: S.optional(S.Boolean),
  VolumeType: S.optional(S.String),
  VolumeSize: S.optional(S.Number),
  Iops: S.optional(S.Number),
  Throughput: S.optional(S.Number),
}) {}
export class SnapshotOptions extends S.Class<SnapshotOptions>(
  "SnapshotOptions",
)({ AutomatedSnapshotStartHour: S.optional(S.Number) }) {}
export class CognitoOptions extends S.Class<CognitoOptions>("CognitoOptions")({
  Enabled: S.optional(S.Boolean),
  UserPoolId: S.optional(S.String),
  IdentityPoolId: S.optional(S.String),
  RoleArn: S.optional(S.String),
}) {}
export class EncryptionAtRestOptions extends S.Class<EncryptionAtRestOptions>(
  "EncryptionAtRestOptions",
)({ Enabled: S.optional(S.Boolean), KmsKeyId: S.optional(S.String) }) {}
export class NodeToNodeEncryptionOptions extends S.Class<NodeToNodeEncryptionOptions>(
  "NodeToNodeEncryptionOptions",
)({ Enabled: S.optional(S.Boolean) }) {}
export const AdvancedOptions = S.Record({ key: S.String, value: S.String });
export class DomainEndpointOptions extends S.Class<DomainEndpointOptions>(
  "DomainEndpointOptions",
)({
  EnforceHTTPS: S.optional(S.Boolean),
  TLSSecurityPolicy: S.optional(S.String),
  CustomEndpointEnabled: S.optional(S.Boolean),
  CustomEndpoint: S.optional(S.String),
  CustomEndpointCertificateArn: S.optional(S.String),
}) {}
export class DomainInformation extends S.Class<DomainInformation>(
  "DomainInformation",
)({
  OwnerId: S.optional(S.String),
  DomainName: S.String,
  Region: S.optional(S.String),
}) {}
export const EndpointsMap = S.Record({ key: S.String, value: S.String });
export class ZoneAwarenessConfig extends S.Class<ZoneAwarenessConfig>(
  "ZoneAwarenessConfig",
)({ AvailabilityZoneCount: S.optional(S.Number) }) {}
export class ColdStorageOptions extends S.Class<ColdStorageOptions>(
  "ColdStorageOptions",
)({ Enabled: S.Boolean }) {}
export class ElasticsearchClusterConfig extends S.Class<ElasticsearchClusterConfig>(
  "ElasticsearchClusterConfig",
)({
  InstanceType: S.optional(S.String),
  InstanceCount: S.optional(S.Number),
  DedicatedMasterEnabled: S.optional(S.Boolean),
  ZoneAwarenessEnabled: S.optional(S.Boolean),
  ZoneAwarenessConfig: S.optional(ZoneAwarenessConfig),
  DedicatedMasterType: S.optional(S.String),
  DedicatedMasterCount: S.optional(S.Number),
  WarmEnabled: S.optional(S.Boolean),
  WarmType: S.optional(S.String),
  WarmCount: S.optional(S.Number),
  ColdStorageOptions: S.optional(ColdStorageOptions),
}) {}
export class VPCDerivedInfo extends S.Class<VPCDerivedInfo>("VPCDerivedInfo")({
  VPCId: S.optional(S.String),
  SubnetIds: S.optional(StringList),
  AvailabilityZones: S.optional(StringList),
  SecurityGroupIds: S.optional(StringList),
}) {}
export class LogPublishingOption extends S.Class<LogPublishingOption>(
  "LogPublishingOption",
)({
  CloudWatchLogsLogGroupArn: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
}) {}
export const LogPublishingOptions = S.Record({
  key: S.String,
  value: LogPublishingOption,
});
export class ServiceSoftwareOptions extends S.Class<ServiceSoftwareOptions>(
  "ServiceSoftwareOptions",
)({
  CurrentVersion: S.optional(S.String),
  NewVersion: S.optional(S.String),
  UpdateAvailable: S.optional(S.Boolean),
  Cancellable: S.optional(S.Boolean),
  UpdateStatus: S.optional(S.String),
  Description: S.optional(S.String),
  AutomatedUpdateDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  OptionalDeployment: S.optional(S.Boolean),
}) {}
export class SAMLIdp extends S.Class<SAMLIdp>("SAMLIdp")({
  MetadataContent: S.String,
  EntityId: S.String,
}) {}
export class SAMLOptionsOutput extends S.Class<SAMLOptionsOutput>(
  "SAMLOptionsOutput",
)({
  Enabled: S.optional(S.Boolean),
  Idp: S.optional(SAMLIdp),
  SubjectKey: S.optional(S.String),
  RolesKey: S.optional(S.String),
  SessionTimeoutMinutes: S.optional(S.Number),
}) {}
export class AdvancedSecurityOptions extends S.Class<AdvancedSecurityOptions>(
  "AdvancedSecurityOptions",
)({
  Enabled: S.optional(S.Boolean),
  InternalUserDatabaseEnabled: S.optional(S.Boolean),
  SAMLOptions: S.optional(SAMLOptionsOutput),
  AnonymousAuthDisableDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AnonymousAuthEnabled: S.optional(S.Boolean),
}) {}
export class AutoTuneOptionsOutput extends S.Class<AutoTuneOptionsOutput>(
  "AutoTuneOptionsOutput",
)({ State: S.optional(S.String), ErrorMessage: S.optional(S.String) }) {}
export class ChangeProgressDetails extends S.Class<ChangeProgressDetails>(
  "ChangeProgressDetails",
)({
  ChangeId: S.optional(S.String),
  Message: S.optional(S.String),
  ConfigChangeStatus: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InitiatedBy: S.optional(S.String),
}) {}
export class ModifyingProperties extends S.Class<ModifyingProperties>(
  "ModifyingProperties",
)({
  Name: S.optional(S.String),
  ActiveValue: S.optional(S.String),
  PendingValue: S.optional(S.String),
  ValueType: S.optional(S.String),
}) {}
export const ModifyingPropertiesList = S.Array(ModifyingProperties);
export class ElasticsearchDomainStatus extends S.Class<ElasticsearchDomainStatus>(
  "ElasticsearchDomainStatus",
)({
  DomainId: S.String,
  DomainName: S.String,
  ARN: S.String,
  Created: S.optional(S.Boolean),
  Deleted: S.optional(S.Boolean),
  Endpoint: S.optional(S.String),
  Endpoints: S.optional(EndpointsMap),
  Processing: S.optional(S.Boolean),
  UpgradeProcessing: S.optional(S.Boolean),
  ElasticsearchVersion: S.optional(S.String),
  ElasticsearchClusterConfig: ElasticsearchClusterConfig,
  EBSOptions: S.optional(EBSOptions),
  AccessPolicies: S.optional(S.String),
  SnapshotOptions: S.optional(SnapshotOptions),
  VPCOptions: S.optional(VPCDerivedInfo),
  CognitoOptions: S.optional(CognitoOptions),
  EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
  NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
  AdvancedOptions: S.optional(AdvancedOptions),
  LogPublishingOptions: S.optional(LogPublishingOptions),
  ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions),
  DomainEndpointOptions: S.optional(DomainEndpointOptions),
  AdvancedSecurityOptions: S.optional(AdvancedSecurityOptions),
  AutoTuneOptions: S.optional(AutoTuneOptionsOutput),
  ChangeProgressDetails: S.optional(ChangeProgressDetails),
  DomainProcessingStatus: S.optional(S.String),
  ModifyingProperties: S.optional(ModifyingPropertiesList),
}) {}
export const ElasticsearchDomainStatusList = S.Array(ElasticsearchDomainStatus);
export class OutboundCrossClusterSearchConnectionStatus extends S.Class<OutboundCrossClusterSearchConnectionStatus>(
  "OutboundCrossClusterSearchConnectionStatus",
)({ StatusCode: S.optional(S.String), Message: S.optional(S.String) }) {}
export class OutboundCrossClusterSearchConnection extends S.Class<OutboundCrossClusterSearchConnection>(
  "OutboundCrossClusterSearchConnection",
)({
  SourceDomainInfo: S.optional(DomainInformation),
  DestinationDomainInfo: S.optional(DomainInformation),
  CrossClusterSearchConnectionId: S.optional(S.String),
  ConnectionAlias: S.optional(S.String),
  ConnectionStatus: S.optional(OutboundCrossClusterSearchConnectionStatus),
}) {}
export const OutboundCrossClusterSearchConnections = S.Array(
  OutboundCrossClusterSearchConnection,
);
export class DescribePackagesFilter extends S.Class<DescribePackagesFilter>(
  "DescribePackagesFilter",
)({
  Name: S.optional(S.String),
  Value: S.optional(DescribePackagesFilterValues),
}) {}
export const DescribePackagesFilterList = S.Array(DescribePackagesFilter);
export class VpcEndpoint extends S.Class<VpcEndpoint>("VpcEndpoint")({
  VpcEndpointId: S.optional(S.String),
  VpcEndpointOwner: S.optional(S.String),
  DomainArn: S.optional(S.String),
  VpcOptions: S.optional(VPCDerivedInfo),
  Status: S.optional(S.String),
  Endpoint: S.optional(S.String),
}) {}
export const VpcEndpoints = S.Array(VpcEndpoint);
export class ErrorDetails extends S.Class<ErrorDetails>("ErrorDetails")({
  ErrorType: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class DomainPackageDetails extends S.Class<DomainPackageDetails>(
  "DomainPackageDetails",
)({
  PackageID: S.optional(S.String),
  PackageName: S.optional(S.String),
  PackageType: S.optional(S.String),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DomainName: S.optional(S.String),
  DomainPackageStatus: S.optional(S.String),
  PackageVersion: S.optional(S.String),
  ReferencePath: S.optional(S.String),
  ErrorDetails: S.optional(ErrorDetails),
}) {}
export const DomainPackageDetailsList = S.Array(DomainPackageDetails);
export const ElasticsearchInstanceTypeList = S.Array(S.String);
export const ElasticsearchVersionList = S.Array(S.String);
export class AuthorizedPrincipal extends S.Class<AuthorizedPrincipal>(
  "AuthorizedPrincipal",
)({ PrincipalType: S.optional(S.String), Principal: S.optional(S.String) }) {}
export const AuthorizedPrincipalList = S.Array(AuthorizedPrincipal);
export class VpcEndpointSummary extends S.Class<VpcEndpointSummary>(
  "VpcEndpointSummary",
)({
  VpcEndpointId: S.optional(S.String),
  VpcEndpointOwner: S.optional(S.String),
  DomainArn: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const VpcEndpointSummaryList = S.Array(VpcEndpointSummary);
export class Duration extends S.Class<Duration>("Duration")({
  Value: S.optional(S.Number),
  Unit: S.optional(S.String),
}) {}
export class AutoTuneMaintenanceSchedule extends S.Class<AutoTuneMaintenanceSchedule>(
  "AutoTuneMaintenanceSchedule",
)({
  StartAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Duration: S.optional(Duration),
  CronExpressionForRecurrence: S.optional(S.String),
}) {}
export const AutoTuneMaintenanceScheduleList = S.Array(
  AutoTuneMaintenanceSchedule,
);
export class AutoTuneOptions extends S.Class<AutoTuneOptions>(
  "AutoTuneOptions",
)({
  DesiredState: S.optional(S.String),
  RollbackOnDisable: S.optional(S.String),
  MaintenanceSchedules: S.optional(AutoTuneMaintenanceScheduleList),
}) {}
export class AddTagsRequest extends S.Class<AddTagsRequest>("AddTagsRequest")(
  { ARN: S.String, TagList: TagList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddTagsResponse extends S.Class<AddTagsResponse>(
  "AddTagsResponse",
)({}, ns) {}
export class CreateOutboundCrossClusterSearchConnectionRequest extends S.Class<CreateOutboundCrossClusterSearchConnectionRequest>(
  "CreateOutboundCrossClusterSearchConnectionRequest",
)(
  {
    SourceDomainInfo: DomainInformation,
    DestinationDomainInfo: DomainInformation,
    ConnectionAlias: S.String,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/es/ccs/outboundConnection" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePackageRequest extends S.Class<CreatePackageRequest>(
  "CreatePackageRequest",
)(
  {
    PackageName: S.String,
    PackageType: S.String,
    PackageDescription: S.optional(S.String),
    PackageSource: PackageSource,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InboundCrossClusterSearchConnectionStatus extends S.Class<InboundCrossClusterSearchConnectionStatus>(
  "InboundCrossClusterSearchConnectionStatus",
)({ StatusCode: S.optional(S.String), Message: S.optional(S.String) }) {}
export class InboundCrossClusterSearchConnection extends S.Class<InboundCrossClusterSearchConnection>(
  "InboundCrossClusterSearchConnection",
)({
  SourceDomainInfo: S.optional(DomainInformation),
  DestinationDomainInfo: S.optional(DomainInformation),
  CrossClusterSearchConnectionId: S.optional(S.String),
  ConnectionStatus: S.optional(InboundCrossClusterSearchConnectionStatus),
}) {}
export class DeleteInboundCrossClusterSearchConnectionResponse extends S.Class<DeleteInboundCrossClusterSearchConnectionResponse>(
  "DeleteInboundCrossClusterSearchConnectionResponse",
)(
  {
    CrossClusterSearchConnection: S.optional(
      InboundCrossClusterSearchConnection,
    ),
  },
  ns,
) {}
export class DescribeElasticsearchDomainResponse extends S.Class<DescribeElasticsearchDomainResponse>(
  "DescribeElasticsearchDomainResponse",
)({ DomainStatus: ElasticsearchDomainStatus }, ns) {}
export class DescribeElasticsearchDomainsResponse extends S.Class<DescribeElasticsearchDomainsResponse>(
  "DescribeElasticsearchDomainsResponse",
)({ DomainStatusList: ElasticsearchDomainStatusList }, ns) {}
export class DescribeInboundCrossClusterSearchConnectionsRequest extends S.Class<DescribeInboundCrossClusterSearchConnectionsRequest>(
  "DescribeInboundCrossClusterSearchConnectionsRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/es/ccs/inboundConnection/search",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeOutboundCrossClusterSearchConnectionsResponse extends S.Class<DescribeOutboundCrossClusterSearchConnectionsResponse>(
  "DescribeOutboundCrossClusterSearchConnectionsResponse",
)(
  {
    CrossClusterSearchConnections: S.optional(
      OutboundCrossClusterSearchConnections,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribePackagesRequest extends S.Class<DescribePackagesRequest>(
  "DescribePackagesRequest",
)(
  {
    Filters: S.optional(DescribePackagesFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/packages/describe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DissociatePackageResponse extends S.Class<DissociatePackageResponse>(
  "DissociatePackageResponse",
)({ DomainPackageDetails: S.optional(DomainPackageDetails) }, ns) {}
export class GetUpgradeStatusResponse extends S.Class<GetUpgradeStatusResponse>(
  "GetUpgradeStatusResponse",
)(
  {
    UpgradeStep: S.optional(S.String),
    StepStatus: S.optional(S.String),
    UpgradeName: S.optional(S.String),
  },
  ns,
) {}
export class ListDomainsForPackageResponse extends S.Class<ListDomainsForPackageResponse>(
  "ListDomainsForPackageResponse",
)(
  {
    DomainPackageDetailsList: S.optional(DomainPackageDetailsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListElasticsearchInstanceTypesResponse extends S.Class<ListElasticsearchInstanceTypesResponse>(
  "ListElasticsearchInstanceTypesResponse",
)(
  {
    ElasticsearchInstanceTypes: S.optional(ElasticsearchInstanceTypeList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListElasticsearchVersionsResponse extends S.Class<ListElasticsearchVersionsResponse>(
  "ListElasticsearchVersionsResponse",
)(
  {
    ElasticsearchVersions: S.optional(ElasticsearchVersionList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListPackagesForDomainResponse extends S.Class<ListPackagesForDomainResponse>(
  "ListPackagesForDomainResponse",
)(
  {
    DomainPackageDetailsList: S.optional(DomainPackageDetailsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTagsResponse extends S.Class<ListTagsResponse>(
  "ListTagsResponse",
)({ TagList: S.optional(TagList) }, ns) {}
export class ListVpcEndpointAccessResponse extends S.Class<ListVpcEndpointAccessResponse>(
  "ListVpcEndpointAccessResponse",
)(
  { AuthorizedPrincipalList: AuthorizedPrincipalList, NextToken: S.String },
  ns,
) {}
export class ListVpcEndpointsResponse extends S.Class<ListVpcEndpointsResponse>(
  "ListVpcEndpointsResponse",
)(
  { VpcEndpointSummaryList: VpcEndpointSummaryList, NextToken: S.String },
  ns,
) {}
export class ListVpcEndpointsForDomainResponse extends S.Class<ListVpcEndpointsForDomainResponse>(
  "ListVpcEndpointsForDomainResponse",
)(
  { VpcEndpointSummaryList: VpcEndpointSummaryList, NextToken: S.String },
  ns,
) {}
export class PurchaseReservedElasticsearchInstanceOfferingResponse extends S.Class<PurchaseReservedElasticsearchInstanceOfferingResponse>(
  "PurchaseReservedElasticsearchInstanceOfferingResponse",
)(
  {
    ReservedElasticsearchInstanceId: S.optional(S.String),
    ReservationName: S.optional(S.String),
  },
  ns,
) {}
export class RejectInboundCrossClusterSearchConnectionResponse extends S.Class<RejectInboundCrossClusterSearchConnectionResponse>(
  "RejectInboundCrossClusterSearchConnectionResponse",
)(
  {
    CrossClusterSearchConnection: S.optional(
      InboundCrossClusterSearchConnection,
    ),
  },
  ns,
) {}
export class StartElasticsearchServiceSoftwareUpdateResponse extends S.Class<StartElasticsearchServiceSoftwareUpdateResponse>(
  "StartElasticsearchServiceSoftwareUpdateResponse",
)({ ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions) }, ns) {}
export class MasterUserOptions extends S.Class<MasterUserOptions>(
  "MasterUserOptions",
)({
  MasterUserARN: S.optional(S.String),
  MasterUserName: S.optional(S.String),
  MasterUserPassword: S.optional(S.String),
}) {}
export class SAMLOptionsInput extends S.Class<SAMLOptionsInput>(
  "SAMLOptionsInput",
)({
  Enabled: S.optional(S.Boolean),
  Idp: S.optional(SAMLIdp),
  MasterUserName: S.optional(S.String),
  MasterBackendRole: S.optional(S.String),
  SubjectKey: S.optional(S.String),
  RolesKey: S.optional(S.String),
  SessionTimeoutMinutes: S.optional(S.Number),
}) {}
export class AdvancedSecurityOptionsInput extends S.Class<AdvancedSecurityOptionsInput>(
  "AdvancedSecurityOptionsInput",
)({
  Enabled: S.optional(S.Boolean),
  InternalUserDatabaseEnabled: S.optional(S.Boolean),
  MasterUserOptions: S.optional(MasterUserOptions),
  SAMLOptions: S.optional(SAMLOptionsInput),
  AnonymousAuthEnabled: S.optional(S.Boolean),
}) {}
export class UpdateElasticsearchDomainConfigRequest extends S.Class<UpdateElasticsearchDomainConfigRequest>(
  "UpdateElasticsearchDomainConfigRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ElasticsearchClusterConfig: S.optional(ElasticsearchClusterConfig),
    EBSOptions: S.optional(EBSOptions),
    SnapshotOptions: S.optional(SnapshotOptions),
    VPCOptions: S.optional(VPCOptions),
    CognitoOptions: S.optional(CognitoOptions),
    AdvancedOptions: S.optional(AdvancedOptions),
    AccessPolicies: S.optional(S.String),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    DomainEndpointOptions: S.optional(DomainEndpointOptions),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsInput),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    AutoTuneOptions: S.optional(AutoTuneOptions),
    DryRun: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2015-01-01/es/domain/{DomainName}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PackageDetails extends S.Class<PackageDetails>("PackageDetails")({
  PackageID: S.optional(S.String),
  PackageName: S.optional(S.String),
  PackageType: S.optional(S.String),
  PackageDescription: S.optional(S.String),
  PackageStatus: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AvailablePackageVersion: S.optional(S.String),
  ErrorDetails: S.optional(ErrorDetails),
}) {}
export class UpdatePackageResponse extends S.Class<UpdatePackageResponse>(
  "UpdatePackageResponse",
)({ PackageDetails: S.optional(PackageDetails) }, ns) {}
export class UpdateVpcEndpointResponse extends S.Class<UpdateVpcEndpointResponse>(
  "UpdateVpcEndpointResponse",
)({ VpcEndpoint: VpcEndpoint }, ns) {}
export class CancelledChangeProperty extends S.Class<CancelledChangeProperty>(
  "CancelledChangeProperty",
)({
  PropertyName: S.optional(S.String),
  CancelledValue: S.optional(S.String),
  ActiveValue: S.optional(S.String),
}) {}
export const CancelledChangePropertyList = S.Array(CancelledChangeProperty);
export const InboundCrossClusterSearchConnections = S.Array(
  InboundCrossClusterSearchConnection,
);
export const PackageDetailsList = S.Array(PackageDetails);
export class RecurringCharge extends S.Class<RecurringCharge>(
  "RecurringCharge",
)({
  RecurringChargeAmount: S.optional(S.Number),
  RecurringChargeFrequency: S.optional(S.String),
}) {}
export const RecurringChargeList = S.Array(
  RecurringCharge.pipe(T.XmlName("RecurringCharge")),
);
export class ReservedElasticsearchInstance extends S.Class<ReservedElasticsearchInstance>(
  "ReservedElasticsearchInstance",
)({
  ReservationName: S.optional(S.String),
  ReservedElasticsearchInstanceId: S.optional(S.String),
  ReservedElasticsearchInstanceOfferingId: S.optional(S.String),
  ElasticsearchInstanceType: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Duration: S.optional(S.Number),
  FixedPrice: S.optional(S.Number),
  UsagePrice: S.optional(S.Number),
  CurrencyCode: S.optional(S.String),
  ElasticsearchInstanceCount: S.optional(S.Number),
  State: S.optional(S.String),
  PaymentOption: S.optional(S.String),
  RecurringCharges: S.optional(RecurringChargeList),
}) {}
export const ReservedElasticsearchInstanceList = S.Array(
  ReservedElasticsearchInstance,
);
export class VpcEndpointError extends S.Class<VpcEndpointError>(
  "VpcEndpointError",
)({
  VpcEndpointId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const VpcEndpointErrorList = S.Array(VpcEndpointError);
export class CompatibleVersionsMap extends S.Class<CompatibleVersionsMap>(
  "CompatibleVersionsMap",
)({
  SourceVersion: S.optional(S.String),
  TargetVersions: S.optional(ElasticsearchVersionList),
}) {}
export const CompatibleElasticsearchVersionsList = S.Array(
  CompatibleVersionsMap,
);
export class PackageVersionHistory extends S.Class<PackageVersionHistory>(
  "PackageVersionHistory",
)({
  PackageVersion: S.optional(S.String),
  CommitMessage: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PackageVersionHistoryList = S.Array(PackageVersionHistory);
export class DomainInfo extends S.Class<DomainInfo>("DomainInfo")({
  DomainName: S.optional(S.String),
  EngineType: S.optional(S.String),
}) {}
export const DomainInfoList = S.Array(DomainInfo);
export const Issues = S.Array(S.String);
export class AuthorizeVpcEndpointAccessResponse extends S.Class<AuthorizeVpcEndpointAccessResponse>(
  "AuthorizeVpcEndpointAccessResponse",
)({ AuthorizedPrincipal: AuthorizedPrincipal }, ns) {}
export class CancelDomainConfigChangeResponse extends S.Class<CancelDomainConfigChangeResponse>(
  "CancelDomainConfigChangeResponse",
)(
  {
    DryRun: S.optional(S.Boolean),
    CancelledChangeIds: S.optional(GUIDList),
    CancelledChangeProperties: S.optional(CancelledChangePropertyList),
  },
  ns,
) {}
export class CancelElasticsearchServiceSoftwareUpdateResponse extends S.Class<CancelElasticsearchServiceSoftwareUpdateResponse>(
  "CancelElasticsearchServiceSoftwareUpdateResponse",
)({ ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions) }, ns) {}
export class CreateOutboundCrossClusterSearchConnectionResponse extends S.Class<CreateOutboundCrossClusterSearchConnectionResponse>(
  "CreateOutboundCrossClusterSearchConnectionResponse",
)(
  {
    SourceDomainInfo: S.optional(DomainInformation),
    DestinationDomainInfo: S.optional(DomainInformation),
    ConnectionAlias: S.optional(S.String),
    ConnectionStatus: S.optional(OutboundCrossClusterSearchConnectionStatus),
    CrossClusterSearchConnectionId: S.optional(S.String),
  },
  ns,
) {}
export class CreatePackageResponse extends S.Class<CreatePackageResponse>(
  "CreatePackageResponse",
)({ PackageDetails: S.optional(PackageDetails) }, ns) {}
export class DeletePackageResponse extends S.Class<DeletePackageResponse>(
  "DeletePackageResponse",
)({ PackageDetails: S.optional(PackageDetails) }, ns) {}
export class DeleteVpcEndpointResponse extends S.Class<DeleteVpcEndpointResponse>(
  "DeleteVpcEndpointResponse",
)({ VpcEndpointSummary: VpcEndpointSummary }, ns) {}
export class DescribeInboundCrossClusterSearchConnectionsResponse extends S.Class<DescribeInboundCrossClusterSearchConnectionsResponse>(
  "DescribeInboundCrossClusterSearchConnectionsResponse",
)(
  {
    CrossClusterSearchConnections: S.optional(
      InboundCrossClusterSearchConnections,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribePackagesResponse extends S.Class<DescribePackagesResponse>(
  "DescribePackagesResponse",
)(
  {
    PackageDetailsList: S.optional(PackageDetailsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeReservedElasticsearchInstancesResponse extends S.Class<DescribeReservedElasticsearchInstancesResponse>(
  "DescribeReservedElasticsearchInstancesResponse",
)(
  {
    NextToken: S.optional(S.String),
    ReservedElasticsearchInstances: S.optional(
      ReservedElasticsearchInstanceList,
    ),
  },
  ns,
) {}
export class DescribeVpcEndpointsResponse extends S.Class<DescribeVpcEndpointsResponse>(
  "DescribeVpcEndpointsResponse",
)(
  { VpcEndpoints: VpcEndpoints, VpcEndpointErrors: VpcEndpointErrorList },
  ns,
) {}
export class GetCompatibleElasticsearchVersionsResponse extends S.Class<GetCompatibleElasticsearchVersionsResponse>(
  "GetCompatibleElasticsearchVersionsResponse",
)(
  {
    CompatibleElasticsearchVersions: S.optional(
      CompatibleElasticsearchVersionsList,
    ),
  },
  ns,
) {}
export class GetPackageVersionHistoryResponse extends S.Class<GetPackageVersionHistoryResponse>(
  "GetPackageVersionHistoryResponse",
)(
  {
    PackageID: S.optional(S.String),
    PackageVersionHistoryList: S.optional(PackageVersionHistoryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDomainNamesResponse extends S.Class<ListDomainNamesResponse>(
  "ListDomainNamesResponse",
)({ DomainNames: S.optional(DomainInfoList) }, ns) {}
export class UpgradeElasticsearchDomainResponse extends S.Class<UpgradeElasticsearchDomainResponse>(
  "UpgradeElasticsearchDomainResponse",
)(
  {
    DomainName: S.optional(S.String),
    TargetVersion: S.optional(S.String),
    PerformCheckOnly: S.optional(S.Boolean),
    ChangeProgressDetails: S.optional(ChangeProgressDetails),
  },
  ns,
) {}
export class ChangeProgressStage extends S.Class<ChangeProgressStage>(
  "ChangeProgressStage",
)({
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  Description: S.optional(S.String),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ChangeProgressStageList = S.Array(ChangeProgressStage);
export class OptionStatus extends S.Class<OptionStatus>("OptionStatus")({
  CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdateVersion: S.optional(S.Number),
  State: S.String,
  PendingDeletion: S.optional(S.Boolean),
}) {}
export class ElasticsearchClusterConfigStatus extends S.Class<ElasticsearchClusterConfigStatus>(
  "ElasticsearchClusterConfigStatus",
)({ Options: ElasticsearchClusterConfig, Status: OptionStatus }) {}
export class EBSOptionsStatus extends S.Class<EBSOptionsStatus>(
  "EBSOptionsStatus",
)({ Options: EBSOptions, Status: OptionStatus }) {}
export class AccessPoliciesStatus extends S.Class<AccessPoliciesStatus>(
  "AccessPoliciesStatus",
)({ Options: S.String, Status: OptionStatus }) {}
export class SnapshotOptionsStatus extends S.Class<SnapshotOptionsStatus>(
  "SnapshotOptionsStatus",
)({ Options: SnapshotOptions, Status: OptionStatus }) {}
export class VPCDerivedInfoStatus extends S.Class<VPCDerivedInfoStatus>(
  "VPCDerivedInfoStatus",
)({ Options: VPCDerivedInfo, Status: OptionStatus }) {}
export class CognitoOptionsStatus extends S.Class<CognitoOptionsStatus>(
  "CognitoOptionsStatus",
)({ Options: CognitoOptions, Status: OptionStatus }) {}
export class EncryptionAtRestOptionsStatus extends S.Class<EncryptionAtRestOptionsStatus>(
  "EncryptionAtRestOptionsStatus",
)({ Options: EncryptionAtRestOptions, Status: OptionStatus }) {}
export class NodeToNodeEncryptionOptionsStatus extends S.Class<NodeToNodeEncryptionOptionsStatus>(
  "NodeToNodeEncryptionOptionsStatus",
)({ Options: NodeToNodeEncryptionOptions, Status: OptionStatus }) {}
export class AdvancedOptionsStatus extends S.Class<AdvancedOptionsStatus>(
  "AdvancedOptionsStatus",
)({ Options: AdvancedOptions, Status: OptionStatus }) {}
export class LogPublishingOptionsStatus extends S.Class<LogPublishingOptionsStatus>(
  "LogPublishingOptionsStatus",
)({
  Options: S.optional(LogPublishingOptions),
  Status: S.optional(OptionStatus),
}) {}
export class DomainEndpointOptionsStatus extends S.Class<DomainEndpointOptionsStatus>(
  "DomainEndpointOptionsStatus",
)({ Options: DomainEndpointOptions, Status: OptionStatus }) {}
export class AdvancedSecurityOptionsStatus extends S.Class<AdvancedSecurityOptionsStatus>(
  "AdvancedSecurityOptionsStatus",
)({ Options: AdvancedSecurityOptions, Status: OptionStatus }) {}
export class UpgradeStepItem extends S.Class<UpgradeStepItem>(
  "UpgradeStepItem",
)({
  UpgradeStep: S.optional(S.String),
  UpgradeStepStatus: S.optional(S.String),
  Issues: S.optional(Issues),
  ProgressPercent: S.optional(S.Number),
}) {}
export const UpgradeStepsList = S.Array(UpgradeStepItem);
export const LimitValueList = S.Array(S.String);
export class AutoTuneOptionsInput extends S.Class<AutoTuneOptionsInput>(
  "AutoTuneOptionsInput",
)({
  DesiredState: S.optional(S.String),
  MaintenanceSchedules: S.optional(AutoTuneMaintenanceScheduleList),
}) {}
export class ChangeProgressStatusDetails extends S.Class<ChangeProgressStatusDetails>(
  "ChangeProgressStatusDetails",
)({
  ChangeId: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  PendingProperties: S.optional(StringList),
  CompletedProperties: S.optional(StringList),
  TotalNumberOfStages: S.optional(S.Number),
  ChangeProgressStages: S.optional(ChangeProgressStageList),
  ConfigChangeStatus: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InitiatedBy: S.optional(S.String),
}) {}
export class ReservedElasticsearchInstanceOffering extends S.Class<ReservedElasticsearchInstanceOffering>(
  "ReservedElasticsearchInstanceOffering",
)({
  ReservedElasticsearchInstanceOfferingId: S.optional(S.String),
  ElasticsearchInstanceType: S.optional(S.String),
  Duration: S.optional(S.Number),
  FixedPrice: S.optional(S.Number),
  UsagePrice: S.optional(S.Number),
  CurrencyCode: S.optional(S.String),
  PaymentOption: S.optional(S.String),
  RecurringCharges: S.optional(RecurringChargeList),
}) {}
export const ReservedElasticsearchInstanceOfferingList = S.Array(
  ReservedElasticsearchInstanceOffering.pipe(
    T.XmlName("ReservedElasticsearchInstanceOffering"),
  ),
);
export class UpgradeHistory extends S.Class<UpgradeHistory>("UpgradeHistory")({
  UpgradeName: S.optional(S.String),
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpgradeStatus: S.optional(S.String),
  StepsList: S.optional(UpgradeStepsList),
}) {}
export const UpgradeHistoryList = S.Array(UpgradeHistory);
export class DryRunResults extends S.Class<DryRunResults>("DryRunResults")({
  DeploymentType: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export class ScheduledAutoTuneDetails extends S.Class<ScheduledAutoTuneDetails>(
  "ScheduledAutoTuneDetails",
)({
  Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ActionType: S.optional(S.String),
  Action: S.optional(S.String),
  Severity: S.optional(S.String),
}) {}
export class AutoTuneStatus extends S.Class<AutoTuneStatus>("AutoTuneStatus")({
  CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdateVersion: S.optional(S.Number),
  State: S.String,
  ErrorMessage: S.optional(S.String),
  PendingDeletion: S.optional(S.Boolean),
}) {}
export class AdditionalLimit extends S.Class<AdditionalLimit>(
  "AdditionalLimit",
)({
  LimitName: S.optional(S.String),
  LimitValues: S.optional(LimitValueList),
}) {}
export const AdditionalLimitList = S.Array(AdditionalLimit);
export class AcceptInboundCrossClusterSearchConnectionResponse extends S.Class<AcceptInboundCrossClusterSearchConnectionResponse>(
  "AcceptInboundCrossClusterSearchConnectionResponse",
)(
  {
    CrossClusterSearchConnection: S.optional(
      InboundCrossClusterSearchConnection,
    ),
  },
  ns,
) {}
export class AssociatePackageResponse extends S.Class<AssociatePackageResponse>(
  "AssociatePackageResponse",
)({ DomainPackageDetails: S.optional(DomainPackageDetails) }, ns) {}
export class CreateElasticsearchDomainRequest extends S.Class<CreateElasticsearchDomainRequest>(
  "CreateElasticsearchDomainRequest",
)(
  {
    DomainName: S.String,
    ElasticsearchVersion: S.optional(S.String),
    ElasticsearchClusterConfig: S.optional(ElasticsearchClusterConfig),
    EBSOptions: S.optional(EBSOptions),
    AccessPolicies: S.optional(S.String),
    SnapshotOptions: S.optional(SnapshotOptions),
    VPCOptions: S.optional(VPCOptions),
    CognitoOptions: S.optional(CognitoOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
    AdvancedOptions: S.optional(AdvancedOptions),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    DomainEndpointOptions: S.optional(DomainEndpointOptions),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsInput),
    AutoTuneOptions: S.optional(AutoTuneOptionsInput),
    TagList: S.optional(TagList),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2015-01-01/es/domain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVpcEndpointResponse extends S.Class<CreateVpcEndpointResponse>(
  "CreateVpcEndpointResponse",
)({ VpcEndpoint: VpcEndpoint }, ns) {}
export class DeleteOutboundCrossClusterSearchConnectionResponse extends S.Class<DeleteOutboundCrossClusterSearchConnectionResponse>(
  "DeleteOutboundCrossClusterSearchConnectionResponse",
)(
  {
    CrossClusterSearchConnection: S.optional(
      OutboundCrossClusterSearchConnection,
    ),
  },
  ns,
) {}
export class DescribeDomainChangeProgressResponse extends S.Class<DescribeDomainChangeProgressResponse>(
  "DescribeDomainChangeProgressResponse",
)({ ChangeProgressStatus: S.optional(ChangeProgressStatusDetails) }, ns) {}
export class DescribeReservedElasticsearchInstanceOfferingsResponse extends S.Class<DescribeReservedElasticsearchInstanceOfferingsResponse>(
  "DescribeReservedElasticsearchInstanceOfferingsResponse",
)(
  {
    NextToken: S.optional(S.String),
    ReservedElasticsearchInstanceOfferings: S.optional(
      ReservedElasticsearchInstanceOfferingList,
    ),
  },
  ns,
) {}
export class GetUpgradeHistoryResponse extends S.Class<GetUpgradeHistoryResponse>(
  "GetUpgradeHistoryResponse",
)(
  {
    UpgradeHistories: S.optional(UpgradeHistoryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ElasticsearchVersionStatus extends S.Class<ElasticsearchVersionStatus>(
  "ElasticsearchVersionStatus",
)({ Options: S.String, Status: OptionStatus }) {}
export class AutoTuneOptionsStatus extends S.Class<AutoTuneOptionsStatus>(
  "AutoTuneOptionsStatus",
)({
  Options: S.optional(AutoTuneOptions),
  Status: S.optional(AutoTuneStatus),
}) {}
export class ElasticsearchDomainConfig extends S.Class<ElasticsearchDomainConfig>(
  "ElasticsearchDomainConfig",
)({
  ElasticsearchVersion: S.optional(ElasticsearchVersionStatus),
  ElasticsearchClusterConfig: S.optional(ElasticsearchClusterConfigStatus),
  EBSOptions: S.optional(EBSOptionsStatus),
  AccessPolicies: S.optional(AccessPoliciesStatus),
  SnapshotOptions: S.optional(SnapshotOptionsStatus),
  VPCOptions: S.optional(VPCDerivedInfoStatus),
  CognitoOptions: S.optional(CognitoOptionsStatus),
  EncryptionAtRestOptions: S.optional(EncryptionAtRestOptionsStatus),
  NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptionsStatus),
  AdvancedOptions: S.optional(AdvancedOptionsStatus),
  LogPublishingOptions: S.optional(LogPublishingOptionsStatus),
  DomainEndpointOptions: S.optional(DomainEndpointOptionsStatus),
  AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsStatus),
  AutoTuneOptions: S.optional(AutoTuneOptionsStatus),
  ChangeProgressDetails: S.optional(ChangeProgressDetails),
  ModifyingProperties: S.optional(ModifyingPropertiesList),
}) {}
export class UpdateElasticsearchDomainConfigResponse extends S.Class<UpdateElasticsearchDomainConfigResponse>(
  "UpdateElasticsearchDomainConfigResponse",
)(
  {
    DomainConfig: ElasticsearchDomainConfig,
    DryRunResults: S.optional(DryRunResults),
  },
  ns,
) {}
export class AutoTuneDetails extends S.Class<AutoTuneDetails>(
  "AutoTuneDetails",
)({ ScheduledAutoTuneDetails: S.optional(ScheduledAutoTuneDetails) }) {}
export class StorageTypeLimit extends S.Class<StorageTypeLimit>(
  "StorageTypeLimit",
)({
  LimitName: S.optional(S.String),
  LimitValues: S.optional(LimitValueList),
}) {}
export const StorageTypeLimitList = S.Array(StorageTypeLimit);
export class InstanceCountLimits extends S.Class<InstanceCountLimits>(
  "InstanceCountLimits",
)({
  MinimumInstanceCount: S.optional(S.Number),
  MaximumInstanceCount: S.optional(S.Number),
}) {}
export class AutoTune extends S.Class<AutoTune>("AutoTune")({
  AutoTuneType: S.optional(S.String),
  AutoTuneDetails: S.optional(AutoTuneDetails),
}) {}
export const AutoTuneList = S.Array(AutoTune);
export class StorageType extends S.Class<StorageType>("StorageType")({
  StorageTypeName: S.optional(S.String),
  StorageSubTypeName: S.optional(S.String),
  StorageTypeLimits: S.optional(StorageTypeLimitList),
}) {}
export const StorageTypeList = S.Array(StorageType);
export class InstanceLimits extends S.Class<InstanceLimits>("InstanceLimits")({
  InstanceCountLimits: S.optional(InstanceCountLimits),
}) {}
export class CreateElasticsearchDomainResponse extends S.Class<CreateElasticsearchDomainResponse>(
  "CreateElasticsearchDomainResponse",
)({ DomainStatus: S.optional(ElasticsearchDomainStatus) }, ns) {}
export class DeleteElasticsearchDomainResponse extends S.Class<DeleteElasticsearchDomainResponse>(
  "DeleteElasticsearchDomainResponse",
)({ DomainStatus: S.optional(ElasticsearchDomainStatus) }, ns) {}
export class DescribeDomainAutoTunesResponse extends S.Class<DescribeDomainAutoTunesResponse>(
  "DescribeDomainAutoTunesResponse",
)(
  { AutoTunes: S.optional(AutoTuneList), NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeElasticsearchDomainConfigResponse extends S.Class<DescribeElasticsearchDomainConfigResponse>(
  "DescribeElasticsearchDomainConfigResponse",
)({ DomainConfig: ElasticsearchDomainConfig }, ns) {}
export class Limits extends S.Class<Limits>("Limits")({
  StorageTypes: S.optional(StorageTypeList),
  InstanceLimits: S.optional(InstanceLimits),
  AdditionalLimits: S.optional(AdditionalLimitList),
}) {}
export const LimitsByRole = S.Record({ key: S.String, value: Limits });
export class DescribeElasticsearchInstanceTypeLimitsResponse extends S.Class<DescribeElasticsearchInstanceTypeLimitsResponse>(
  "DescribeElasticsearchInstanceTypeLimitsResponse",
)({ LimitsByRole: S.optional(LimitsByRole) }, ns) {}

//# Errors
export class BaseException extends S.TaggedError<BaseException>()(
  "BaseException",
  { message: S.optional(S.String) },
) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class DisabledOperationException extends S.TaggedError<DisabledOperationException>()(
  "DisabledOperationException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class InvalidTypeException extends S.TaggedError<InvalidTypeException>()(
  "InvalidTypeException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves all Amazon OpenSearch Service-managed VPC endpoints in the current account and Region.
 */
export const listVpcEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVpcEndpointsRequest,
  output: ListVpcEndpointsResponse,
  errors: [BaseException, DisabledOperationException, InternalException],
}));
/**
 * Deletes the service-linked role that Elasticsearch Service uses to manage and maintain VPC domains. Role deletion will fail if any existing VPC domains use the role. You must delete any such Elasticsearch domains before deleting the role. See Deleting Elasticsearch Service Role in *VPC Endpoints for Amazon Elasticsearch Service Domains*.
 */
export const deleteElasticsearchServiceRole =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteElasticsearchServiceRoleRequest,
    output: DeleteElasticsearchServiceRoleResponse,
    errors: [BaseException, InternalException, ValidationException],
  }));
/**
 * Returns domain configuration information about the specified Elasticsearch domain, including the domain ID, domain endpoint, and domain ARN.
 */
export const describeElasticsearchDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeElasticsearchDomainRequest,
    output: DescribeElasticsearchDomainResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about reserved Elasticsearch instances for this account.
 */
export const describeReservedElasticsearchInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReservedElasticsearchInstancesRequest,
    output: DescribeReservedElasticsearchInstancesResponse,
    errors: [
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Describes one or more Amazon OpenSearch Service-managed VPC endpoints.
 */
export const describeVpcEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVpcEndpointsRequest,
    output: DescribeVpcEndpointsResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of upgrade compatible Elastisearch versions.
 * You can optionally pass a
 *
 * DomainName
 *
 * to get all upgrade compatible Elasticsearch versions for that specific domain.
 */
export const getCompatibleElasticsearchVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCompatibleElasticsearchVersionsRequest,
    output: GetCompatibleElasticsearchVersionsResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of versions of the package, along with their creation time and commit message.
 */
export const getPackageVersionHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetPackageVersionHistoryRequest,
    output: GetPackageVersionHistoryResponse,
    errors: [
      AccessDeniedException,
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns the name of all Elasticsearch domains owned by the current user's account.
 */
export const listDomainNames = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainNamesRequest,
  output: ListDomainNamesResponse,
  errors: [BaseException, ValidationException],
}));
/**
 * Modifies an Amazon OpenSearch Service-managed interface VPC endpoint.
 */
export const updateVpcEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcEndpointRequest,
  output: UpdateVpcEndpointResponse,
  errors: [
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Attaches tags to an existing Elasticsearch domain. Tags are a set of case-sensitive key value pairs. An Elasticsearch domain may have up to 10 tags. See
 * Tagging Amazon Elasticsearch Service Domains for more information.
 */
export const addTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsRequest,
  output: AddTagsResponse,
  errors: [
    BaseException,
    InternalException,
    LimitExceededException,
    ValidationException,
  ],
}));
/**
 * Returns domain configuration information about the specified Elasticsearch domains, including the domain ID, domain endpoint, and domain ARN.
 */
export const describeElasticsearchDomains =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeElasticsearchDomainsRequest,
    output: DescribeElasticsearchDomainsResponse,
    errors: [BaseException, InternalException, ValidationException],
  }));
/**
 * Removes the specified set of tags from the specified Elasticsearch domain.
 */
export const removeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsRequest,
  output: RemoveTagsResponse,
  errors: [BaseException, InternalException, ValidationException],
}));
/**
 * List all Elasticsearch instance types that are supported for given ElasticsearchVersion
 */
export const listElasticsearchInstanceTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListElasticsearchInstanceTypesRequest,
    output: ListElasticsearchInstanceTypesResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * List all supported Elasticsearch versions
 */
export const listElasticsearchVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListElasticsearchVersionsRequest,
    output: ListElasticsearchVersionsResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns all tags for the given Elasticsearch domain.
 */
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Revokes access to an Amazon OpenSearch Service domain that was provided through an interface
 * VPC endpoint.
 */
export const revokeVpcEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RevokeVpcEndpointAccessRequest,
    output: RevokeVpcEndpointAccessResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Schedules a service software update for an Amazon ES domain.
 */
export const startElasticsearchServiceSoftwareUpdate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartElasticsearchServiceSoftwareUpdateRequest,
    output: StartElasticsearchServiceSoftwareUpdateResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Allows the destination domain owner to delete an existing inbound cross-cluster search connection.
 */
export const deleteInboundCrossClusterSearchConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteInboundCrossClusterSearchConnectionRequest,
    output: DeleteInboundCrossClusterSearchConnectionResponse,
    errors: [DisabledOperationException, ResourceNotFoundException],
  }));
/**
 * Retrieves the latest status of the last upgrade or upgrade eligibility check that was performed on the domain.
 */
export const getUpgradeStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUpgradeStatusRequest,
  output: GetUpgradeStatusResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about each principal that is allowed to access a
 * given Amazon OpenSearch Service domain through the use of an interface VPC endpoint.
 */
export const listVpcEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListVpcEndpointAccessRequest,
    output: ListVpcEndpointAccessResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves all Amazon OpenSearch Service-managed VPC endpoints associated with a particular domain.
 */
export const listVpcEndpointsForDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListVpcEndpointsForDomainRequest,
    output: ListVpcEndpointsForDomainResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Allows the destination domain owner to reject an inbound cross-cluster search connection request.
 */
export const rejectInboundCrossClusterSearchConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RejectInboundCrossClusterSearchConnectionRequest,
    output: RejectInboundCrossClusterSearchConnectionResponse,
    errors: [DisabledOperationException, ResourceNotFoundException],
  }));
/**
 * Cancels a pending configuration change on an Amazon OpenSearch Service domain.
 */
export const cancelDomainConfigChange = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelDomainConfigChangeRequest,
    output: CancelDomainConfigChangeResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Cancels a scheduled service software update for an Amazon ES domain. You can only perform this operation before the `AutomatedUpdateDate` and when the `UpdateStatus` is in the `PENDING_UPDATE` state.
 */
export const cancelElasticsearchServiceSoftwareUpdate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelElasticsearchServiceSoftwareUpdateRequest,
    output: CancelElasticsearchServiceSoftwareUpdateResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes an Amazon OpenSearch Service-managed interface VPC endpoint.
 */
export const deleteVpcEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcEndpointRequest,
  output: DeleteVpcEndpointResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists all Amazon ES domains associated with the package.
 */
export const listDomainsForPackage =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDomainsForPackageRequest,
    output: ListDomainsForPackageResponse,
    errors: [
      AccessDeniedException,
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all packages associated with the Amazon ES domain.
 */
export const listPackagesForDomain =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPackagesForDomainRequest,
    output: ListPackagesForDomainResponse,
    errors: [
      AccessDeniedException,
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Updates a package for use with Amazon ES domains.
 */
export const updatePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackageRequest,
  output: UpdatePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Delete the package.
 */
export const deletePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackageRequest,
  output: DeletePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes all packages available to Amazon ES. Includes options for filtering, limiting the number of results, and pagination.
 */
export const describePackages = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribePackagesRequest,
    output: DescribePackagesResponse,
    errors: [
      AccessDeniedException,
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all the outbound cross-cluster search connections for a source domain.
 */
export const describeOutboundCrossClusterSearchConnections =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeOutboundCrossClusterSearchConnectionsRequest,
    output: DescribeOutboundCrossClusterSearchConnectionsResponse,
    errors: [DisabledOperationException, InvalidPaginationTokenException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Dissociates a package from the Amazon ES domain.
 */
export const dissociatePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DissociatePackageRequest,
  output: DissociatePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Provides access to an Amazon OpenSearch Service domain through the use of an interface VPC endpoint.
 */
export const authorizeVpcEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AuthorizeVpcEndpointAccessRequest,
    output: AuthorizeVpcEndpointAccessResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all the inbound cross-cluster search connections for a destination domain.
 */
export const describeInboundCrossClusterSearchConnections =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeInboundCrossClusterSearchConnectionsRequest,
    output: DescribeInboundCrossClusterSearchConnectionsResponse,
    errors: [DisabledOperationException, InvalidPaginationTokenException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Allows the destination domain owner to accept an inbound cross-cluster search connection request.
 */
export const acceptInboundCrossClusterSearchConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptInboundCrossClusterSearchConnectionRequest,
    output: AcceptInboundCrossClusterSearchConnectionResponse,
    errors: [
      DisabledOperationException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Associates a package with an Amazon ES domain.
 */
export const associatePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociatePackageRequest,
  output: AssociatePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon OpenSearch Service-managed VPC endpoint.
 */
export const createVpcEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcEndpointRequest,
  output: CreateVpcEndpointResponse,
  errors: [
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ValidationException,
  ],
}));
/**
 * Allows the source domain owner to delete an existing outbound cross-cluster search connection.
 */
export const deleteOutboundCrossClusterSearchConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteOutboundCrossClusterSearchConnectionRequest,
    output: DeleteOutboundCrossClusterSearchConnectionResponse,
    errors: [DisabledOperationException, ResourceNotFoundException],
  }));
/**
 * Returns information about the current blue/green deployment happening on a domain, including
 * a change ID, status, and progress stages.
 */
export const describeDomainChangeProgress =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDomainChangeProgressRequest,
    output: DescribeDomainChangeProgressResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Lists available reserved Elasticsearch instance offerings.
 */
export const describeReservedElasticsearchInstanceOfferings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReservedElasticsearchInstanceOfferingsRequest,
    output: DescribeReservedElasticsearchInstanceOfferingsResponse,
    errors: [
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the complete history of the last 10 upgrades that were performed on the domain.
 */
export const getUpgradeHistory = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetUpgradeHistoryRequest,
    output: GetUpgradeHistoryResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Allows you to either upgrade your domain or perform an Upgrade eligibility check to a compatible Elasticsearch version.
 */
export const upgradeElasticsearchDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpgradeElasticsearchDomainRequest,
    output: UpgradeElasticsearchDomainResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Create a package for use with Amazon ES domains.
 */
export const createPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackageRequest,
  output: CreatePackageResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ValidationException,
  ],
}));
/**
 * Allows you to purchase reserved Elasticsearch instances.
 */
export const purchaseReservedElasticsearchInstanceOffering =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PurchaseReservedElasticsearchInstanceOfferingRequest,
    output: PurchaseReservedElasticsearchInstanceOfferingResponse,
    errors: [
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Creates a new cross-cluster search connection from a source domain to a destination domain.
 */
export const createOutboundCrossClusterSearchConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateOutboundCrossClusterSearchConnectionRequest,
    output: CreateOutboundCrossClusterSearchConnectionResponse,
    errors: [
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ResourceAlreadyExistsException,
    ],
  }));
/**
 * Modifies the cluster configuration of the specified Elasticsearch domain, setting as setting the instance type and the number of instances.
 */
export const updateElasticsearchDomainConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateElasticsearchDomainConfigRequest,
    output: UpdateElasticsearchDomainConfigResponse,
    errors: [
      BaseException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Creates a new Elasticsearch domain. For more information,
 * see Creating Elasticsearch Domains in the *Amazon Elasticsearch Service Developer Guide*.
 */
export const createElasticsearchDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateElasticsearchDomainRequest,
    output: CreateElasticsearchDomainResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ValidationException,
    ],
  }),
);
/**
 * Permanently deletes the specified Elasticsearch domain and all of its data. Once a domain is deleted, it cannot be recovered.
 */
export const deleteElasticsearchDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteElasticsearchDomainRequest,
    output: DeleteElasticsearchDomainResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Provides scheduled Auto-Tune action details for the Elasticsearch domain, such as Auto-Tune action type, description, severity, and scheduled date.
 */
export const describeDomainAutoTunes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDomainAutoTunesRequest,
    output: DescribeDomainAutoTunesResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides cluster configuration information about the specified Elasticsearch domain, such as the state, creation date, update version, and update date for cluster options.
 */
export const describeElasticsearchDomainConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeElasticsearchDomainConfigRequest,
    output: DescribeElasticsearchDomainConfigResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Describe Elasticsearch Limits for a given InstanceType and ElasticsearchVersion.
 * When modifying existing Domain, specify the
 *
 * DomainName
 *
 * to know what Limits are supported for modifying.
 */
export const describeElasticsearchInstanceTypeLimits =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeElasticsearchInstanceTypeLimitsRequest,
    output: DescribeElasticsearchInstanceTypeLimitsResponse,
    errors: [
      BaseException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
