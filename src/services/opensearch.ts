import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://es.amazonaws.com/doc/2021-01-01/");
const svc = T.AwsApiService({
  sdkId: "OpenSearch",
  serviceShapeName: "AmazonOpenSearchService",
});
const auth = T.AwsAuthSigv4({ name: "es" });
const ver = T.ServiceVersion("2021-01-01");
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
export class GetDefaultApplicationSettingRequest extends S.Class<GetDefaultApplicationSettingRequest>(
  "GetDefaultApplicationSettingRequest",
)(
  {},
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/defaultApplicationSetting",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DirectQueryOpenSearchARNList = S.Array(S.String);
export const PackageIDList = S.Array(S.String);
export const DomainNameList = S.Array(S.String);
export const VpcEndpointIdList = S.Array(S.String);
export const ApplicationStatuses = S.Array(S.String);
export const StringList = S.Array(S.String);
export const PackageUserList = S.Array(S.String);
export class AcceptInboundConnectionRequest extends S.Class<AcceptInboundConnectionRequest>(
  "AcceptInboundConnectionRequest",
)(
  { ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2021-01-01/opensearch/cc/inboundConnection/{ConnectionId}/accept",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class AddTagsRequest extends S.Class<AddTagsRequest>("AddTagsRequest")(
  { ARN: S.String, TagList: TagList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/tags" }),
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
export class AuthorizeVpcEndpointAccessRequest extends S.Class<AuthorizeVpcEndpointAccessRequest>(
  "AuthorizeVpcEndpointAccessRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Account: S.optional(S.String),
    Service: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/authorizeVpcEndpointAccess",
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
      uri: "/2021-01-01/opensearch/domain/{DomainName}/config/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelServiceSoftwareUpdateRequest extends S.Class<CancelServiceSoftwareUpdateRequest>(
  "CancelServiceSoftwareUpdateRequest",
)(
  { DomainName: S.String },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/serviceSoftwareUpdate/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIndexRequest extends S.Class<CreateIndexRequest>(
  "CreateIndexRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    IndexName: S.String,
    IndexSchema: S.Any,
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/index",
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
    T.Http({ method: "POST", uri: "/2021-01-01/opensearch/vpcEndpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2021-01-01/opensearch/application/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}, ns) {}
export class DeleteDataSourceRequest extends S.Class<DeleteDataSourceRequest>(
  "DeleteDataSourceRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource/{Name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDirectQueryDataSourceRequest extends S.Class<DeleteDirectQueryDataSourceRequest>(
  "DeleteDirectQueryDataSourceRequest",
)(
  { DataSourceName: S.String.pipe(T.HttpLabel("DataSourceName")) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2021-01-01/opensearch/directQueryDataSource/{DataSourceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDirectQueryDataSourceResponse extends S.Class<DeleteDirectQueryDataSourceResponse>(
  "DeleteDirectQueryDataSourceResponse",
)({}, ns) {}
export class DeleteDomainRequest extends S.Class<DeleteDomainRequest>(
  "DeleteDomainRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2021-01-01/opensearch/domain/{DomainName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInboundConnectionRequest extends S.Class<DeleteInboundConnectionRequest>(
  "DeleteInboundConnectionRequest",
)(
  { ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2021-01-01/opensearch/cc/inboundConnection/{ConnectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIndexRequest extends S.Class<DeleteIndexRequest>(
  "DeleteIndexRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/index/{IndexName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOutboundConnectionRequest extends S.Class<DeleteOutboundConnectionRequest>(
  "DeleteOutboundConnectionRequest",
)(
  { ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2021-01-01/opensearch/cc/outboundConnection/{ConnectionId}",
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
    T.Http({ method: "DELETE", uri: "/2021-01-01/packages/{PackageID}" }),
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
      uri: "/2021-01-01/opensearch/vpcEndpoints/{VpcEndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDomainRequest extends S.Class<DescribeDomainRequest>(
  "DescribeDomainRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}",
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
      uri: "/2021-01-01/opensearch/domain/{DomainName}/autoTunes",
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
      uri: "/2021-01-01/opensearch/domain/{DomainName}/progress",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDomainConfigRequest extends S.Class<DescribeDomainConfigRequest>(
  "DescribeDomainConfigRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDomainHealthRequest extends S.Class<DescribeDomainHealthRequest>(
  "DescribeDomainHealthRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/health",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDomainNodesRequest extends S.Class<DescribeDomainNodesRequest>(
  "DescribeDomainNodesRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/nodes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDomainsRequest extends S.Class<DescribeDomainsRequest>(
  "DescribeDomainsRequest",
)(
  { DomainNames: DomainNameList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/opensearch/domain-info" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDryRunProgressRequest extends S.Class<DescribeDryRunProgressRequest>(
  "DescribeDryRunProgressRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DryRunId: S.optional(S.String).pipe(T.HttpQuery("dryRunId")),
    LoadDryRunConfig: S.optional(S.Boolean).pipe(
      T.HttpQuery("loadDryRunConfig"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/dryRun",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInstanceTypeLimitsRequest extends S.Class<DescribeInstanceTypeLimitsRequest>(
  "DescribeInstanceTypeLimitsRequest",
)(
  {
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
    InstanceType: S.String.pipe(T.HttpLabel("InstanceType")),
    EngineVersion: S.String.pipe(T.HttpLabel("EngineVersion")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/instanceTypeLimits/{EngineVersion}/{InstanceType}",
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
export class DescribeOutboundConnectionsRequest extends S.Class<DescribeOutboundConnectionsRequest>(
  "DescribeOutboundConnectionsRequest",
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
      uri: "/2021-01-01/opensearch/cc/outboundConnection/search",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReservedInstanceOfferingsRequest extends S.Class<DescribeReservedInstanceOfferingsRequest>(
  "DescribeReservedInstanceOfferingsRequest",
)(
  {
    ReservedInstanceOfferingId: S.optional(S.String).pipe(
      T.HttpQuery("offeringId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/reservedInstanceOfferings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReservedInstancesRequest extends S.Class<DescribeReservedInstancesRequest>(
  "DescribeReservedInstancesRequest",
)(
  {
    ReservedInstanceId: S.optional(S.String).pipe(T.HttpQuery("reservationId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2021-01-01/opensearch/reservedInstances" }),
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
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/vpcEndpoints/describe",
    }),
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
      uri: "/2021-01-01/packages/dissociate/{PackageID}/{DomainName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DissociatePackagesRequest extends S.Class<DissociatePackagesRequest>(
  "DissociatePackagesRequest",
)(
  { PackageList: PackageIDList, DomainName: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/packages/dissociateMultiple" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApplicationRequest extends S.Class<GetApplicationRequest>(
  "GetApplicationRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2021-01-01/opensearch/application/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCompatibleVersionsRequest extends S.Class<GetCompatibleVersionsRequest>(
  "GetCompatibleVersionsRequest",
)(
  { DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2021-01-01/opensearch/compatibleVersions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataSourceRequest extends S.Class<GetDataSourceRequest>(
  "GetDataSourceRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource/{Name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDefaultApplicationSettingResponse extends S.Class<GetDefaultApplicationSettingResponse>(
  "GetDefaultApplicationSettingResponse",
)({ applicationArn: S.optional(S.String) }, ns) {}
export class GetDirectQueryDataSourceRequest extends S.Class<GetDirectQueryDataSourceRequest>(
  "GetDirectQueryDataSourceRequest",
)(
  { DataSourceName: S.String.pipe(T.HttpLabel("DataSourceName")) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/directQueryDataSource/{DataSourceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainMaintenanceStatusRequest extends S.Class<GetDomainMaintenanceStatusRequest>(
  "GetDomainMaintenanceStatusRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaintenanceId: S.String.pipe(T.HttpQuery("maintenanceId")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/domainMaintenance",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIndexRequest extends S.Class<GetIndexRequest>(
  "GetIndexRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/index/{IndexName}",
    }),
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
    T.Http({ method: "GET", uri: "/2021-01-01/packages/{PackageID}/history" }),
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
      uri: "/2021-01-01/opensearch/upgradeDomain/{DomainName}/history",
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
      uri: "/2021-01-01/opensearch/upgradeDomain/{DomainName}/status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    statuses: S.optional(ApplicationStatuses).pipe(T.HttpQuery("statuses")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2021-01-01/opensearch/list-applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSourcesRequest extends S.Class<ListDataSourcesRequest>(
  "ListDataSourcesRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDirectQueryDataSourcesRequest extends S.Class<ListDirectQueryDataSourcesRequest>(
  "ListDirectQueryDataSourcesRequest",
)(
  { NextToken: S.optional(S.String).pipe(T.HttpQuery("nexttoken")) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/directQueryDataSource",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainMaintenancesRequest extends S.Class<ListDomainMaintenancesRequest>(
  "ListDomainMaintenancesRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Action: S.optional(S.String).pipe(T.HttpQuery("action")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/domainMaintenances",
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
    T.Http({ method: "GET", uri: "/2021-01-01/domain" }),
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
    T.Http({ method: "GET", uri: "/2021-01-01/packages/{PackageID}/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInstanceTypeDetailsRequest extends S.Class<ListInstanceTypeDetailsRequest>(
  "ListInstanceTypeDetailsRequest",
)(
  {
    EngineVersion: S.String.pipe(T.HttpLabel("EngineVersion")),
    DomainName: S.optional(S.String).pipe(T.HttpQuery("domainName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RetrieveAZs: S.optional(S.Boolean).pipe(T.HttpQuery("retrieveAZs")),
    InstanceType: S.optional(S.String).pipe(T.HttpQuery("instanceType")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2021-01-01/opensearch/instanceTypeDetails/{EngineVersion}",
    }),
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
    T.Http({ method: "GET", uri: "/2021-01-01/domain/{DomainName}/packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListScheduledActionsRequest extends S.Class<ListScheduledActionsRequest>(
  "ListScheduledActionsRequest",
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
      uri: "/2021-01-01/opensearch/domain/{DomainName}/scheduledActions",
    }),
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
    T.Http({ method: "GET", uri: "/2021-01-01/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVersionsRequest extends S.Class<ListVersionsRequest>(
  "ListVersionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2021-01-01/opensearch/versions" }),
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
      uri: "/2021-01-01/opensearch/domain/{DomainName}/listVpcEndpointAccess",
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
    T.Http({ method: "GET", uri: "/2021-01-01/opensearch/vpcEndpoints" }),
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
      uri: "/2021-01-01/opensearch/domain/{DomainName}/vpcEndpoints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PurchaseReservedInstanceOfferingRequest extends S.Class<PurchaseReservedInstanceOfferingRequest>(
  "PurchaseReservedInstanceOfferingRequest",
)(
  {
    ReservedInstanceOfferingId: S.String,
    ReservationName: S.String,
    InstanceCount: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/purchaseReservedInstanceOffering",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDefaultApplicationSettingRequest extends S.Class<PutDefaultApplicationSettingRequest>(
  "PutDefaultApplicationSettingRequest",
)(
  { applicationArn: S.String, setAsDefault: S.Boolean },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2021-01-01/opensearch/defaultApplicationSetting",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectInboundConnectionRequest extends S.Class<RejectInboundConnectionRequest>(
  "RejectInboundConnectionRequest",
)(
  { ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2021-01-01/opensearch/cc/inboundConnection/{ConnectionId}/reject",
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
    T.Http({ method: "POST", uri: "/2021-01-01/tags-removal" }),
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
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Account: S.optional(S.String),
    Service: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/revokeVpcEndpointAccess",
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
export class StartDomainMaintenanceRequest extends S.Class<StartDomainMaintenanceRequest>(
  "StartDomainMaintenanceRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Action: S.String,
    NodeId: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/domainMaintenance",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartServiceSoftwareUpdateRequest extends S.Class<StartServiceSoftwareUpdateRequest>(
  "StartServiceSoftwareUpdateRequest",
)(
  {
    DomainName: S.String,
    ScheduleAt: S.optional(S.String),
    DesiredStartTime: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/serviceSoftwareUpdate/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  dataSourceArn: S.optional(S.String),
  dataSourceDescription: S.optional(S.String),
}) {}
export const DataSources = S.Array(DataSource);
export class AppConfig extends S.Class<AppConfig>("AppConfig")({
  key: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const AppConfigs = S.Array(AppConfig);
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    dataSources: S.optional(DataSources),
    appConfigs: S.optional(AppConfigs),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/2021-01-01/opensearch/application/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3GlueDataCatalog extends S.Class<S3GlueDataCatalog>(
  "S3GlueDataCatalog",
)({ RoleArn: S.optional(S.String) }) {}
export const DataSourceType = S.Union(
  S.Struct({ S3GlueDataCatalog: S3GlueDataCatalog }),
);
export class UpdateDataSourceRequest extends S.Class<UpdateDataSourceRequest>(
  "UpdateDataSourceRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Name: S.String.pipe(T.HttpLabel("Name")),
    DataSourceType: DataSourceType,
    Description: S.optional(S.String),
    Status: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource/{Name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CloudWatchDirectQueryDataSource extends S.Class<CloudWatchDirectQueryDataSource>(
  "CloudWatchDirectQueryDataSource",
)({ RoleArn: S.String }) {}
export class SecurityLakeDirectQueryDataSource extends S.Class<SecurityLakeDirectQueryDataSource>(
  "SecurityLakeDirectQueryDataSource",
)({ RoleArn: S.String }) {}
export const DirectQueryDataSourceType = S.Union(
  S.Struct({ CloudWatchLog: CloudWatchDirectQueryDataSource }),
  S.Struct({ SecurityLake: SecurityLakeDirectQueryDataSource }),
);
export class UpdateDirectQueryDataSourceRequest extends S.Class<UpdateDirectQueryDataSourceRequest>(
  "UpdateDirectQueryDataSourceRequest",
)(
  {
    DataSourceName: S.String.pipe(T.HttpLabel("DataSourceName")),
    DataSourceType: DirectQueryDataSourceType,
    Description: S.optional(S.String),
    OpenSearchArns: DirectQueryOpenSearchARNList,
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2021-01-01/opensearch/directQueryDataSource/{DataSourceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateIndexRequest extends S.Class<UpdateIndexRequest>(
  "UpdateIndexRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    IndexSchema: S.Any,
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/index/{IndexName}",
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
export class PackageConfiguration extends S.Class<PackageConfiguration>(
  "PackageConfiguration",
)({
  LicenseRequirement: S.String,
  LicenseFilepath: S.optional(S.String),
  ConfigurationRequirement: S.String,
  RequiresRestartForConfigurationUpdate: S.optional(S.Boolean),
}) {}
export class PackageEncryptionOptions extends S.Class<PackageEncryptionOptions>(
  "PackageEncryptionOptions",
)({ KmsKeyIdentifier: S.optional(S.String), EncryptionEnabled: S.Boolean }) {}
export class UpdatePackageRequest extends S.Class<UpdatePackageRequest>(
  "UpdatePackageRequest",
)(
  {
    PackageID: S.String,
    PackageSource: PackageSource,
    PackageDescription: S.optional(S.String),
    CommitMessage: S.optional(S.String),
    PackageConfiguration: S.optional(PackageConfiguration),
    PackageEncryptionOptions: S.optional(PackageEncryptionOptions),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/packages/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePackageScopeRequest extends S.Class<UpdatePackageScopeRequest>(
  "UpdatePackageScopeRequest",
)(
  {
    PackageID: S.String,
    Operation: S.String,
    PackageUserList: PackageUserList,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/packages/updateScope" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateScheduledActionRequest extends S.Class<UpdateScheduledActionRequest>(
  "UpdateScheduledActionRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ActionID: S.String,
    ActionType: S.String,
    ScheduleAt: S.String,
    DesiredStartTime: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/scheduledAction/update",
    }),
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
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/vpcEndpoints/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AdvancedOptions = S.Record({ key: S.String, value: S.String });
export class UpgradeDomainRequest extends S.Class<UpgradeDomainRequest>(
  "UpgradeDomainRequest",
)(
  {
    DomainName: S.String,
    TargetVersion: S.String,
    PerformCheckOnly: S.optional(S.Boolean),
    AdvancedOptions: S.optional(AdvancedOptions),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/opensearch/upgradeDomain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DescribePackagesFilterValues = S.Array(S.String);
export class KeyStoreAccessOption extends S.Class<KeyStoreAccessOption>(
  "KeyStoreAccessOption",
)({
  KeyAccessRoleArn: S.optional(S.String),
  KeyStoreAccessEnabled: S.Boolean,
}) {}
export class PackageAssociationConfiguration extends S.Class<PackageAssociationConfiguration>(
  "PackageAssociationConfiguration",
)({ KeyStoreAccessOption: S.optional(KeyStoreAccessOption) }) {}
export class PackageDetailsForAssociation extends S.Class<PackageDetailsForAssociation>(
  "PackageDetailsForAssociation",
)({
  PackageID: S.String,
  PrerequisitePackageIDList: S.optional(PackageIDList),
  AssociationConfiguration: S.optional(PackageAssociationConfiguration),
}) {}
export const PackageDetailsForAssociationList = S.Array(
  PackageDetailsForAssociation,
);
export const GUIDList = S.Array(S.String);
export class IamIdentityCenterOptionsInput extends S.Class<IamIdentityCenterOptionsInput>(
  "IamIdentityCenterOptionsInput",
)({
  enabled: S.optional(S.Boolean),
  iamIdentityCenterInstanceArn: S.optional(S.String),
  iamRoleForIdentityCenterApplicationArn: S.optional(S.String),
}) {}
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
export class DomainEndpointOptions extends S.Class<DomainEndpointOptions>(
  "DomainEndpointOptions",
)({
  EnforceHTTPS: S.optional(S.Boolean),
  TLSSecurityPolicy: S.optional(S.String),
  CustomEndpointEnabled: S.optional(S.Boolean),
  CustomEndpoint: S.optional(S.String),
  CustomEndpointCertificateArn: S.optional(S.String),
}) {}
export class IdentityCenterOptionsInput extends S.Class<IdentityCenterOptionsInput>(
  "IdentityCenterOptionsInput",
)({
  EnabledAPIAccess: S.optional(S.Boolean),
  IdentityCenterInstanceARN: S.optional(S.String),
  SubjectKey: S.optional(S.String),
  RolesKey: S.optional(S.String),
}) {}
export class SoftwareUpdateOptions extends S.Class<SoftwareUpdateOptions>(
  "SoftwareUpdateOptions",
)({ AutoSoftwareUpdateEnabled: S.optional(S.Boolean) }) {}
export class PackageVendingOptions extends S.Class<PackageVendingOptions>(
  "PackageVendingOptions",
)({ VendingEnabled: S.Boolean }) {}
export const EndpointsMap = S.Record({ key: S.String, value: S.String });
export class ZoneAwarenessConfig extends S.Class<ZoneAwarenessConfig>(
  "ZoneAwarenessConfig",
)({ AvailabilityZoneCount: S.optional(S.Number) }) {}
export class ColdStorageOptions extends S.Class<ColdStorageOptions>(
  "ColdStorageOptions",
)({ Enabled: S.Boolean }) {}
export class NodeConfig extends S.Class<NodeConfig>("NodeConfig")({
  Enabled: S.optional(S.Boolean),
  Type: S.optional(S.String),
  Count: S.optional(S.Number),
}) {}
export class NodeOption extends S.Class<NodeOption>("NodeOption")({
  NodeType: S.optional(S.String),
  NodeConfig: S.optional(NodeConfig),
}) {}
export const NodeOptionsList = S.Array(NodeOption);
export class ClusterConfig extends S.Class<ClusterConfig>("ClusterConfig")({
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
  MultiAZWithStandbyEnabled: S.optional(S.Boolean),
  NodeOptions: S.optional(NodeOptionsList),
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
export class JWTOptionsOutput extends S.Class<JWTOptionsOutput>(
  "JWTOptionsOutput",
)({
  Enabled: S.optional(S.Boolean),
  SubjectKey: S.optional(S.String),
  RolesKey: S.optional(S.String),
  PublicKey: S.optional(S.String),
}) {}
export class IAMFederationOptionsOutput extends S.Class<IAMFederationOptionsOutput>(
  "IAMFederationOptionsOutput",
)({
  Enabled: S.optional(S.Boolean),
  SubjectKey: S.optional(S.String),
  RolesKey: S.optional(S.String),
}) {}
export class AdvancedSecurityOptions extends S.Class<AdvancedSecurityOptions>(
  "AdvancedSecurityOptions",
)({
  Enabled: S.optional(S.Boolean),
  InternalUserDatabaseEnabled: S.optional(S.Boolean),
  SAMLOptions: S.optional(SAMLOptionsOutput),
  JWTOptions: S.optional(JWTOptionsOutput),
  IAMFederationOptions: S.optional(IAMFederationOptionsOutput),
  AnonymousAuthDisableDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AnonymousAuthEnabled: S.optional(S.Boolean),
}) {}
export class IdentityCenterOptions extends S.Class<IdentityCenterOptions>(
  "IdentityCenterOptions",
)({
  EnabledAPIAccess: S.optional(S.Boolean),
  IdentityCenterInstanceARN: S.optional(S.String),
  SubjectKey: S.optional(S.String),
  RolesKey: S.optional(S.String),
  IdentityCenterApplicationARN: S.optional(S.String),
  IdentityStoreId: S.optional(S.String),
}) {}
export class AutoTuneOptionsOutput extends S.Class<AutoTuneOptionsOutput>(
  "AutoTuneOptionsOutput",
)({
  State: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  UseOffPeakWindow: S.optional(S.Boolean),
}) {}
export class ChangeProgressDetails extends S.Class<ChangeProgressDetails>(
  "ChangeProgressDetails",
)({
  ChangeId: S.optional(S.String),
  Message: S.optional(S.String),
  ConfigChangeStatus: S.optional(S.String),
  InitiatedBy: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class WindowStartTime extends S.Class<WindowStartTime>(
  "WindowStartTime",
)({ Hours: S.Number, Minutes: S.Number }) {}
export class OffPeakWindow extends S.Class<OffPeakWindow>("OffPeakWindow")({
  WindowStartTime: S.optional(WindowStartTime),
}) {}
export class OffPeakWindowOptions extends S.Class<OffPeakWindowOptions>(
  "OffPeakWindowOptions",
)({
  Enabled: S.optional(S.Boolean),
  OffPeakWindow: S.optional(OffPeakWindow),
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
export class NaturalLanguageQueryGenerationOptionsOutput extends S.Class<NaturalLanguageQueryGenerationOptionsOutput>(
  "NaturalLanguageQueryGenerationOptionsOutput",
)({ DesiredState: S.optional(S.String), CurrentState: S.optional(S.String) }) {}
export class S3VectorsEngine extends S.Class<S3VectorsEngine>(
  "S3VectorsEngine",
)({ Enabled: S.optional(S.Boolean) }) {}
export class ServerlessVectorAcceleration extends S.Class<ServerlessVectorAcceleration>(
  "ServerlessVectorAcceleration",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AIMLOptionsOutput extends S.Class<AIMLOptionsOutput>(
  "AIMLOptionsOutput",
)({
  NaturalLanguageQueryGenerationOptions: S.optional(
    NaturalLanguageQueryGenerationOptionsOutput,
  ),
  S3VectorsEngine: S.optional(S3VectorsEngine),
  ServerlessVectorAcceleration: S.optional(ServerlessVectorAcceleration),
}) {}
export class DomainStatus extends S.Class<DomainStatus>("DomainStatus")({
  DomainId: S.String,
  DomainName: S.String,
  ARN: S.String,
  Created: S.optional(S.Boolean),
  Deleted: S.optional(S.Boolean),
  Endpoint: S.optional(S.String),
  EndpointV2: S.optional(S.String),
  Endpoints: S.optional(EndpointsMap),
  DomainEndpointV2HostedZoneId: S.optional(S.String),
  Processing: S.optional(S.Boolean),
  UpgradeProcessing: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  ClusterConfig: ClusterConfig,
  EBSOptions: S.optional(EBSOptions),
  AccessPolicies: S.optional(S.String),
  IPAddressType: S.optional(S.String),
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
  IdentityCenterOptions: S.optional(IdentityCenterOptions),
  AutoTuneOptions: S.optional(AutoTuneOptionsOutput),
  ChangeProgressDetails: S.optional(ChangeProgressDetails),
  OffPeakWindowOptions: S.optional(OffPeakWindowOptions),
  SoftwareUpdateOptions: S.optional(SoftwareUpdateOptions),
  DomainProcessingStatus: S.optional(S.String),
  ModifyingProperties: S.optional(ModifyingPropertiesList),
  AIMLOptions: S.optional(AIMLOptionsOutput),
}) {}
export const DomainStatusList = S.Array(DomainStatus);
export class AWSDomainInformation extends S.Class<AWSDomainInformation>(
  "AWSDomainInformation",
)({
  OwnerId: S.optional(S.String),
  DomainName: S.String,
  Region: S.optional(S.String),
}) {}
export class DomainInformationContainer extends S.Class<DomainInformationContainer>(
  "DomainInformationContainer",
)({ AWSDomainInformation: S.optional(AWSDomainInformation) }) {}
export class OutboundConnectionStatus extends S.Class<OutboundConnectionStatus>(
  "OutboundConnectionStatus",
)({ StatusCode: S.optional(S.String), Message: S.optional(S.String) }) {}
export class CrossClusterSearchConnectionProperties extends S.Class<CrossClusterSearchConnectionProperties>(
  "CrossClusterSearchConnectionProperties",
)({ SkipUnavailable: S.optional(S.String) }) {}
export class ConnectionProperties extends S.Class<ConnectionProperties>(
  "ConnectionProperties",
)({
  Endpoint: S.optional(S.String),
  CrossClusterSearch: S.optional(CrossClusterSearchConnectionProperties),
}) {}
export class OutboundConnection extends S.Class<OutboundConnection>(
  "OutboundConnection",
)({
  LocalDomainInfo: S.optional(DomainInformationContainer),
  RemoteDomainInfo: S.optional(DomainInformationContainer),
  ConnectionId: S.optional(S.String),
  ConnectionAlias: S.optional(S.String),
  ConnectionStatus: S.optional(OutboundConnectionStatus),
  ConnectionMode: S.optional(S.String),
  ConnectionProperties: S.optional(ConnectionProperties),
}) {}
export const OutboundConnections = S.Array(OutboundConnection);
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
  PrerequisitePackageIDList: S.optional(PackageIDList),
  ReferencePath: S.optional(S.String),
  ErrorDetails: S.optional(ErrorDetails),
  AssociationConfiguration: S.optional(PackageAssociationConfiguration),
}) {}
export const DomainPackageDetailsList = S.Array(DomainPackageDetails);
export const VersionList = S.Array(S.String);
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
  UseOffPeakWindow: S.optional(S.Boolean),
}) {}
export class AssociatePackagesRequest extends S.Class<AssociatePackagesRequest>(
  "AssociatePackagesRequest",
)(
  { PackageList: PackageDetailsForAssociationList, DomainName: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/packages/associateMultiple" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    dataSources: S.optional(DataSources),
    iamIdentityCenterOptions: S.optional(IamIdentityCenterOptionsInput),
    appConfigs: S.optional(AppConfigs),
    tagList: S.optional(TagList),
    kmsKeyArn: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/opensearch/application" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIndexResponse extends S.Class<CreateIndexResponse>(
  "CreateIndexResponse",
)({ Status: S.String }, ns) {}
export class CreatePackageRequest extends S.Class<CreatePackageRequest>(
  "CreatePackageRequest",
)(
  {
    PackageName: S.String,
    PackageType: S.String,
    PackageDescription: S.optional(S.String),
    PackageSource: PackageSource,
    PackageConfiguration: S.optional(PackageConfiguration),
    EngineVersion: S.optional(S.String),
    PackageVendingOptions: S.optional(PackageVendingOptions),
    PackageEncryptionOptions: S.optional(PackageEncryptionOptions),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataSourceResponse extends S.Class<DeleteDataSourceResponse>(
  "DeleteDataSourceResponse",
)({ Message: S.optional(S.String) }, ns) {}
export class InboundConnectionStatus extends S.Class<InboundConnectionStatus>(
  "InboundConnectionStatus",
)({ StatusCode: S.optional(S.String), Message: S.optional(S.String) }) {}
export class InboundConnection extends S.Class<InboundConnection>(
  "InboundConnection",
)({
  LocalDomainInfo: S.optional(DomainInformationContainer),
  RemoteDomainInfo: S.optional(DomainInformationContainer),
  ConnectionId: S.optional(S.String),
  ConnectionStatus: S.optional(InboundConnectionStatus),
  ConnectionMode: S.optional(S.String),
}) {}
export class DeleteInboundConnectionResponse extends S.Class<DeleteInboundConnectionResponse>(
  "DeleteInboundConnectionResponse",
)({ Connection: S.optional(InboundConnection) }, ns) {}
export class DeleteIndexResponse extends S.Class<DeleteIndexResponse>(
  "DeleteIndexResponse",
)({ Status: S.String }, ns) {}
export class DescribeDomainResponse extends S.Class<DescribeDomainResponse>(
  "DescribeDomainResponse",
)({ DomainStatus: DomainStatus }, ns) {}
export class DescribeDomainsResponse extends S.Class<DescribeDomainsResponse>(
  "DescribeDomainsResponse",
)({ DomainStatusList: DomainStatusList }, ns) {}
export class DescribeInboundConnectionsRequest extends S.Class<DescribeInboundConnectionsRequest>(
  "DescribeInboundConnectionsRequest",
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
      uri: "/2021-01-01/opensearch/cc/inboundConnection/search",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeOutboundConnectionsResponse extends S.Class<DescribeOutboundConnectionsResponse>(
  "DescribeOutboundConnectionsResponse",
)(
  {
    Connections: S.optional(OutboundConnections),
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
    T.Http({ method: "POST", uri: "/2021-01-01/packages/describe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DissociatePackagesResponse extends S.Class<DissociatePackagesResponse>(
  "DissociatePackagesResponse",
)({ DomainPackageDetailsList: S.optional(DomainPackageDetailsList) }, ns) {}
export class GetDataSourceResponse extends S.Class<GetDataSourceResponse>(
  "GetDataSourceResponse",
)(
  {
    DataSourceType: S.optional(DataSourceType),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
  },
  ns,
) {}
export class GetDirectQueryDataSourceResponse extends S.Class<GetDirectQueryDataSourceResponse>(
  "GetDirectQueryDataSourceResponse",
)(
  {
    DataSourceName: S.optional(S.String),
    DataSourceType: S.optional(DirectQueryDataSourceType),
    Description: S.optional(S.String),
    OpenSearchArns: S.optional(DirectQueryOpenSearchARNList),
    DataSourceArn: S.optional(S.String),
  },
  ns,
) {}
export class GetDomainMaintenanceStatusResponse extends S.Class<GetDomainMaintenanceStatusResponse>(
  "GetDomainMaintenanceStatusResponse",
)(
  {
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    NodeId: S.optional(S.String),
    Action: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class GetIndexResponse extends S.Class<GetIndexResponse>(
  "GetIndexResponse",
)({ IndexSchema: S.Any }, ns) {}
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
export class ListVersionsResponse extends S.Class<ListVersionsResponse>(
  "ListVersionsResponse",
)({ Versions: S.optional(VersionList), NextToken: S.optional(S.String) }, ns) {}
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
export class PurchaseReservedInstanceOfferingResponse extends S.Class<PurchaseReservedInstanceOfferingResponse>(
  "PurchaseReservedInstanceOfferingResponse",
)(
  {
    ReservedInstanceId: S.optional(S.String),
    ReservationName: S.optional(S.String),
  },
  ns,
) {}
export class PutDefaultApplicationSettingResponse extends S.Class<PutDefaultApplicationSettingResponse>(
  "PutDefaultApplicationSettingResponse",
)({ applicationArn: S.optional(S.String) }, ns) {}
export class RejectInboundConnectionResponse extends S.Class<RejectInboundConnectionResponse>(
  "RejectInboundConnectionResponse",
)({ Connection: S.optional(InboundConnection) }, ns) {}
export class StartDomainMaintenanceResponse extends S.Class<StartDomainMaintenanceResponse>(
  "StartDomainMaintenanceResponse",
)({ MaintenanceId: S.optional(S.String) }, ns) {}
export class StartServiceSoftwareUpdateResponse extends S.Class<StartServiceSoftwareUpdateResponse>(
  "StartServiceSoftwareUpdateResponse",
)({ ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions) }, ns) {}
export class IamIdentityCenterOptions extends S.Class<IamIdentityCenterOptions>(
  "IamIdentityCenterOptions",
)({
  enabled: S.optional(S.Boolean),
  iamIdentityCenterInstanceArn: S.optional(S.String),
  iamRoleForIdentityCenterApplicationArn: S.optional(S.String),
  iamIdentityCenterApplicationArn: S.optional(S.String),
}) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)(
  {
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    dataSources: S.optional(DataSources),
    iamIdentityCenterOptions: S.optional(IamIdentityCenterOptions),
    appConfigs: S.optional(AppConfigs),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class UpdateDataSourceResponse extends S.Class<UpdateDataSourceResponse>(
  "UpdateDataSourceResponse",
)({ Message: S.optional(S.String) }, ns) {}
export class UpdateDirectQueryDataSourceResponse extends S.Class<UpdateDirectQueryDataSourceResponse>(
  "UpdateDirectQueryDataSourceResponse",
)({ DataSourceArn: S.optional(S.String) }, ns) {}
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
export class JWTOptionsInput extends S.Class<JWTOptionsInput>(
  "JWTOptionsInput",
)({
  Enabled: S.optional(S.Boolean),
  SubjectKey: S.optional(S.String),
  RolesKey: S.optional(S.String),
  PublicKey: S.optional(S.String),
}) {}
export class IAMFederationOptionsInput extends S.Class<IAMFederationOptionsInput>(
  "IAMFederationOptionsInput",
)({
  Enabled: S.optional(S.Boolean),
  SubjectKey: S.optional(S.String),
  RolesKey: S.optional(S.String),
}) {}
export class AdvancedSecurityOptionsInput extends S.Class<AdvancedSecurityOptionsInput>(
  "AdvancedSecurityOptionsInput",
)({
  Enabled: S.optional(S.Boolean),
  InternalUserDatabaseEnabled: S.optional(S.Boolean),
  MasterUserOptions: S.optional(MasterUserOptions),
  SAMLOptions: S.optional(SAMLOptionsInput),
  JWTOptions: S.optional(JWTOptionsInput),
  IAMFederationOptions: S.optional(IAMFederationOptionsInput),
  AnonymousAuthEnabled: S.optional(S.Boolean),
}) {}
export class NaturalLanguageQueryGenerationOptionsInput extends S.Class<NaturalLanguageQueryGenerationOptionsInput>(
  "NaturalLanguageQueryGenerationOptionsInput",
)({ DesiredState: S.optional(S.String) }) {}
export class AIMLOptionsInput extends S.Class<AIMLOptionsInput>(
  "AIMLOptionsInput",
)({
  NaturalLanguageQueryGenerationOptions: S.optional(
    NaturalLanguageQueryGenerationOptionsInput,
  ),
  S3VectorsEngine: S.optional(S3VectorsEngine),
  ServerlessVectorAcceleration: S.optional(ServerlessVectorAcceleration),
}) {}
export class UpdateDomainConfigRequest extends S.Class<UpdateDomainConfigRequest>(
  "UpdateDomainConfigRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    ClusterConfig: S.optional(ClusterConfig),
    EBSOptions: S.optional(EBSOptions),
    SnapshotOptions: S.optional(SnapshotOptions),
    VPCOptions: S.optional(VPCOptions),
    CognitoOptions: S.optional(CognitoOptions),
    AdvancedOptions: S.optional(AdvancedOptions),
    AccessPolicies: S.optional(S.String),
    IPAddressType: S.optional(S.String),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    DomainEndpointOptions: S.optional(DomainEndpointOptions),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsInput),
    IdentityCenterOptions: S.optional(IdentityCenterOptionsInput),
    AutoTuneOptions: S.optional(AutoTuneOptions),
    DryRun: S.optional(S.Boolean),
    DryRunMode: S.optional(S.String),
    OffPeakWindowOptions: S.optional(OffPeakWindowOptions),
    SoftwareUpdateOptions: S.optional(SoftwareUpdateOptions),
    AIMLOptions: S.optional(AIMLOptionsInput),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateIndexResponse extends S.Class<UpdateIndexResponse>(
  "UpdateIndexResponse",
)({ Status: S.String }, ns) {}
export class PluginProperties extends S.Class<PluginProperties>(
  "PluginProperties",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Version: S.optional(S.String),
  ClassName: S.optional(S.String),
  UncompressedSizeInBytes: S.optional(S.Number),
}) {}
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
  EngineVersion: S.optional(S.String),
  AvailablePluginProperties: S.optional(PluginProperties),
  AvailablePackageConfiguration: S.optional(PackageConfiguration),
  AllowListedUserList: S.optional(PackageUserList),
  PackageOwner: S.optional(S.String),
  PackageVendingOptions: S.optional(PackageVendingOptions),
  PackageEncryptionOptions: S.optional(PackageEncryptionOptions),
}) {}
export class UpdatePackageResponse extends S.Class<UpdatePackageResponse>(
  "UpdatePackageResponse",
)({ PackageDetails: S.optional(PackageDetails) }, ns) {}
export class UpdatePackageScopeResponse extends S.Class<UpdatePackageScopeResponse>(
  "UpdatePackageScopeResponse",
)(
  {
    PackageID: S.optional(S.String),
    Operation: S.optional(S.String),
    PackageUserList: S.optional(PackageUserList),
  },
  ns,
) {}
export class ScheduledAction extends S.Class<ScheduledAction>(
  "ScheduledAction",
)({
  Id: S.String,
  Type: S.String,
  Severity: S.String,
  ScheduledTime: S.Number,
  Description: S.optional(S.String),
  ScheduledBy: S.optional(S.String),
  Status: S.optional(S.String),
  Mandatory: S.optional(S.Boolean),
  Cancellable: S.optional(S.Boolean),
}) {}
export class UpdateScheduledActionResponse extends S.Class<UpdateScheduledActionResponse>(
  "UpdateScheduledActionResponse",
)({ ScheduledAction: S.optional(ScheduledAction) }, ns) {}
export class UpdateVpcEndpointResponse extends S.Class<UpdateVpcEndpointResponse>(
  "UpdateVpcEndpointResponse",
)({ VpcEndpoint: VpcEndpoint }, ns) {}
export const InstanceRoleList = S.Array(S.String);
export const AvailabilityZoneList = S.Array(S.String);
export class CancelledChangeProperty extends S.Class<CancelledChangeProperty>(
  "CancelledChangeProperty",
)({
  PropertyName: S.optional(S.String),
  CancelledValue: S.optional(S.String),
  ActiveValue: S.optional(S.String),
}) {}
export const CancelledChangePropertyList = S.Array(CancelledChangeProperty);
export class DomainNodesStatus extends S.Class<DomainNodesStatus>(
  "DomainNodesStatus",
)({
  NodeId: S.optional(S.String),
  NodeType: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  InstanceType: S.optional(S.String),
  NodeStatus: S.optional(S.String),
  StorageType: S.optional(S.String),
  StorageVolumeType: S.optional(S.String),
  StorageSize: S.optional(S.String),
}) {}
export const DomainNodesStatusList = S.Array(DomainNodesStatus);
export class DryRunResults extends S.Class<DryRunResults>("DryRunResults")({
  DeploymentType: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const InboundConnections = S.Array(InboundConnection);
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
export class ReservedInstance extends S.Class<ReservedInstance>(
  "ReservedInstance",
)({
  ReservationName: S.optional(S.String),
  ReservedInstanceId: S.optional(S.String),
  BillingSubscriptionId: S.optional(S.Number),
  ReservedInstanceOfferingId: S.optional(S.String),
  InstanceType: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Duration: S.optional(S.Number),
  FixedPrice: S.optional(S.Number),
  UsagePrice: S.optional(S.Number),
  CurrencyCode: S.optional(S.String),
  InstanceCount: S.optional(S.Number),
  State: S.optional(S.String),
  PaymentOption: S.optional(S.String),
  RecurringCharges: S.optional(RecurringChargeList),
}) {}
export const ReservedInstanceList = S.Array(ReservedInstance);
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
  TargetVersions: S.optional(VersionList),
}) {}
export const CompatibleVersionsList = S.Array(CompatibleVersionsMap);
export class PackageVersionHistory extends S.Class<PackageVersionHistory>(
  "PackageVersionHistory",
)({
  PackageVersion: S.optional(S.String),
  CommitMessage: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  PluginProperties: S.optional(PluginProperties),
  PackageConfiguration: S.optional(PackageConfiguration),
}) {}
export const PackageVersionHistoryList = S.Array(PackageVersionHistory);
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  endpoint: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ApplicationSummaries = S.Array(ApplicationSummary);
export class DataSourceDetails extends S.Class<DataSourceDetails>(
  "DataSourceDetails",
)({
  DataSourceType: S.optional(DataSourceType),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const DataSourceList = S.Array(DataSourceDetails);
export class DirectQueryDataSource extends S.Class<DirectQueryDataSource>(
  "DirectQueryDataSource",
)({
  DataSourceName: S.optional(S.String),
  DataSourceType: S.optional(DirectQueryDataSourceType),
  Description: S.optional(S.String),
  OpenSearchArns: S.optional(DirectQueryOpenSearchARNList),
  DataSourceArn: S.optional(S.String),
  TagList: S.optional(TagList),
}) {}
export const DirectQueryDataSourceList = S.Array(DirectQueryDataSource);
export class DomainMaintenanceDetails extends S.Class<DomainMaintenanceDetails>(
  "DomainMaintenanceDetails",
)({
  MaintenanceId: S.optional(S.String),
  DomainName: S.optional(S.String),
  Action: S.optional(S.String),
  NodeId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DomainMaintenanceList = S.Array(DomainMaintenanceDetails);
export class DomainInfo extends S.Class<DomainInfo>("DomainInfo")({
  DomainName: S.optional(S.String),
  EngineType: S.optional(S.String),
}) {}
export const DomainInfoList = S.Array(DomainInfo);
export class InstanceTypeDetails extends S.Class<InstanceTypeDetails>(
  "InstanceTypeDetails",
)({
  InstanceType: S.optional(S.String),
  EncryptionEnabled: S.optional(S.Boolean),
  CognitoEnabled: S.optional(S.Boolean),
  AppLogsEnabled: S.optional(S.Boolean),
  AdvancedSecurityEnabled: S.optional(S.Boolean),
  WarmEnabled: S.optional(S.Boolean),
  InstanceRole: S.optional(InstanceRoleList),
  AvailabilityZones: S.optional(AvailabilityZoneList),
}) {}
export const InstanceTypeDetailsList = S.Array(InstanceTypeDetails);
export const ScheduledActionsList = S.Array(ScheduledAction);
export const Issues = S.Array(S.String);
export class AddDataSourceRequest extends S.Class<AddDataSourceRequest>(
  "AddDataSourceRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Name: S.String,
    DataSourceType: DataSourceType,
    Description: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/domain/{DomainName}/dataSource",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddDirectQueryDataSourceRequest extends S.Class<AddDirectQueryDataSourceRequest>(
  "AddDirectQueryDataSourceRequest",
)(
  {
    DataSourceName: S.String,
    DataSourceType: DirectQueryDataSourceType,
    Description: S.optional(S.String),
    OpenSearchArns: DirectQueryOpenSearchARNList,
    TagList: S.optional(TagList),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/directQueryDataSource",
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
    PrerequisitePackageIDList: S.optional(PackageIDList),
    AssociationConfiguration: S.optional(PackageAssociationConfiguration),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/packages/associate/{PackageID}/{DomainName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociatePackagesResponse extends S.Class<AssociatePackagesResponse>(
  "AssociatePackagesResponse",
)({ DomainPackageDetailsList: S.optional(DomainPackageDetailsList) }, ns) {}
export class AuthorizeVpcEndpointAccessResponse extends S.Class<AuthorizeVpcEndpointAccessResponse>(
  "AuthorizeVpcEndpointAccessResponse",
)({ AuthorizedPrincipal: AuthorizedPrincipal }, ns) {}
export class CancelDomainConfigChangeResponse extends S.Class<CancelDomainConfigChangeResponse>(
  "CancelDomainConfigChangeResponse",
)(
  {
    CancelledChangeIds: S.optional(GUIDList),
    CancelledChangeProperties: S.optional(CancelledChangePropertyList),
    DryRun: S.optional(S.Boolean),
  },
  ns,
) {}
export class CancelServiceSoftwareUpdateResponse extends S.Class<CancelServiceSoftwareUpdateResponse>(
  "CancelServiceSoftwareUpdateResponse",
)({ ServiceSoftwareOptions: S.optional(ServiceSoftwareOptions) }, ns) {}
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)(
  {
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    dataSources: S.optional(DataSources),
    iamIdentityCenterOptions: S.optional(IamIdentityCenterOptions),
    appConfigs: S.optional(AppConfigs),
    tagList: S.optional(TagList),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    kmsKeyArn: S.optional(S.String),
  },
  ns,
) {}
export class CreateOutboundConnectionRequest extends S.Class<CreateOutboundConnectionRequest>(
  "CreateOutboundConnectionRequest",
)(
  {
    LocalDomainInfo: DomainInformationContainer,
    RemoteDomainInfo: DomainInformationContainer,
    ConnectionAlias: S.String,
    ConnectionMode: S.optional(S.String),
    ConnectionProperties: S.optional(ConnectionProperties),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2021-01-01/opensearch/cc/outboundConnection",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePackageResponse extends S.Class<CreatePackageResponse>(
  "CreatePackageResponse",
)({ PackageDetails: S.optional(PackageDetails) }, ns) {}
export class DeleteVpcEndpointResponse extends S.Class<DeleteVpcEndpointResponse>(
  "DeleteVpcEndpointResponse",
)({ VpcEndpointSummary: VpcEndpointSummary }, ns) {}
export class DescribeDomainNodesResponse extends S.Class<DescribeDomainNodesResponse>(
  "DescribeDomainNodesResponse",
)({ DomainNodesStatusList: S.optional(DomainNodesStatusList) }, ns) {}
export class DescribeInboundConnectionsResponse extends S.Class<DescribeInboundConnectionsResponse>(
  "DescribeInboundConnectionsResponse",
)(
  {
    Connections: S.optional(InboundConnections),
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
export class DescribeReservedInstancesResponse extends S.Class<DescribeReservedInstancesResponse>(
  "DescribeReservedInstancesResponse",
)(
  {
    NextToken: S.optional(S.String),
    ReservedInstances: S.optional(ReservedInstanceList),
  },
  ns,
) {}
export class DescribeVpcEndpointsResponse extends S.Class<DescribeVpcEndpointsResponse>(
  "DescribeVpcEndpointsResponse",
)(
  { VpcEndpoints: VpcEndpoints, VpcEndpointErrors: VpcEndpointErrorList },
  ns,
) {}
export class DissociatePackageResponse extends S.Class<DissociatePackageResponse>(
  "DissociatePackageResponse",
)({ DomainPackageDetails: S.optional(DomainPackageDetails) }, ns) {}
export class GetApplicationResponse extends S.Class<GetApplicationResponse>(
  "GetApplicationResponse",
)(
  {
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    endpoint: S.optional(S.String),
    status: S.optional(S.String),
    iamIdentityCenterOptions: S.optional(IamIdentityCenterOptions),
    dataSources: S.optional(DataSources),
    appConfigs: S.optional(AppConfigs),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    kmsKeyArn: S.optional(S.String),
  },
  ns,
) {}
export class GetCompatibleVersionsResponse extends S.Class<GetCompatibleVersionsResponse>(
  "GetCompatibleVersionsResponse",
)({ CompatibleVersions: S.optional(CompatibleVersionsList) }, ns) {}
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
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)(
  {
    ApplicationSummaries: S.optional(ApplicationSummaries),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDataSourcesResponse extends S.Class<ListDataSourcesResponse>(
  "ListDataSourcesResponse",
)({ DataSources: S.optional(DataSourceList) }, ns) {}
export class ListDirectQueryDataSourcesResponse extends S.Class<ListDirectQueryDataSourcesResponse>(
  "ListDirectQueryDataSourcesResponse",
)(
  {
    NextToken: S.optional(S.String),
    DirectQueryDataSources: S.optional(DirectQueryDataSourceList),
  },
  ns,
) {}
export class ListDomainMaintenancesResponse extends S.Class<ListDomainMaintenancesResponse>(
  "ListDomainMaintenancesResponse",
)(
  {
    DomainMaintenances: S.optional(DomainMaintenanceList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDomainNamesResponse extends S.Class<ListDomainNamesResponse>(
  "ListDomainNamesResponse",
)({ DomainNames: S.optional(DomainInfoList) }, ns) {}
export class ListInstanceTypeDetailsResponse extends S.Class<ListInstanceTypeDetailsResponse>(
  "ListInstanceTypeDetailsResponse",
)(
  {
    InstanceTypeDetails: S.optional(InstanceTypeDetailsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListScheduledActionsResponse extends S.Class<ListScheduledActionsResponse>(
  "ListScheduledActionsResponse",
)(
  {
    ScheduledActions: S.optional(ScheduledActionsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class OptionStatus extends S.Class<OptionStatus>("OptionStatus")({
  CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdateVersion: S.optional(S.Number),
  State: S.String,
  PendingDeletion: S.optional(S.Boolean),
}) {}
export class VersionStatus extends S.Class<VersionStatus>("VersionStatus")({
  Options: S.String,
  Status: OptionStatus,
}) {}
export class ClusterConfigStatus extends S.Class<ClusterConfigStatus>(
  "ClusterConfigStatus",
)({ Options: ClusterConfig, Status: OptionStatus }) {}
export class EBSOptionsStatus extends S.Class<EBSOptionsStatus>(
  "EBSOptionsStatus",
)({ Options: EBSOptions, Status: OptionStatus }) {}
export class AccessPoliciesStatus extends S.Class<AccessPoliciesStatus>(
  "AccessPoliciesStatus",
)({ Options: S.String, Status: OptionStatus }) {}
export class IPAddressTypeStatus extends S.Class<IPAddressTypeStatus>(
  "IPAddressTypeStatus",
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
export class IdentityCenterOptionsStatus extends S.Class<IdentityCenterOptionsStatus>(
  "IdentityCenterOptionsStatus",
)({ Options: IdentityCenterOptions, Status: OptionStatus }) {}
export class AutoTuneStatus extends S.Class<AutoTuneStatus>("AutoTuneStatus")({
  CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdateVersion: S.optional(S.Number),
  State: S.String,
  ErrorMessage: S.optional(S.String),
  PendingDeletion: S.optional(S.Boolean),
}) {}
export class AutoTuneOptionsStatus extends S.Class<AutoTuneOptionsStatus>(
  "AutoTuneOptionsStatus",
)({
  Options: S.optional(AutoTuneOptions),
  Status: S.optional(AutoTuneStatus),
}) {}
export class OffPeakWindowOptionsStatus extends S.Class<OffPeakWindowOptionsStatus>(
  "OffPeakWindowOptionsStatus",
)({
  Options: S.optional(OffPeakWindowOptions),
  Status: S.optional(OptionStatus),
}) {}
export class SoftwareUpdateOptionsStatus extends S.Class<SoftwareUpdateOptionsStatus>(
  "SoftwareUpdateOptionsStatus",
)({
  Options: S.optional(SoftwareUpdateOptions),
  Status: S.optional(OptionStatus),
}) {}
export class AIMLOptionsStatus extends S.Class<AIMLOptionsStatus>(
  "AIMLOptionsStatus",
)({
  Options: S.optional(AIMLOptionsOutput),
  Status: S.optional(OptionStatus),
}) {}
export class DomainConfig extends S.Class<DomainConfig>("DomainConfig")({
  EngineVersion: S.optional(VersionStatus),
  ClusterConfig: S.optional(ClusterConfigStatus),
  EBSOptions: S.optional(EBSOptionsStatus),
  AccessPolicies: S.optional(AccessPoliciesStatus),
  IPAddressType: S.optional(IPAddressTypeStatus),
  SnapshotOptions: S.optional(SnapshotOptionsStatus),
  VPCOptions: S.optional(VPCDerivedInfoStatus),
  CognitoOptions: S.optional(CognitoOptionsStatus),
  EncryptionAtRestOptions: S.optional(EncryptionAtRestOptionsStatus),
  NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptionsStatus),
  AdvancedOptions: S.optional(AdvancedOptionsStatus),
  LogPublishingOptions: S.optional(LogPublishingOptionsStatus),
  DomainEndpointOptions: S.optional(DomainEndpointOptionsStatus),
  AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsStatus),
  IdentityCenterOptions: S.optional(IdentityCenterOptionsStatus),
  AutoTuneOptions: S.optional(AutoTuneOptionsStatus),
  ChangeProgressDetails: S.optional(ChangeProgressDetails),
  OffPeakWindowOptions: S.optional(OffPeakWindowOptionsStatus),
  SoftwareUpdateOptions: S.optional(SoftwareUpdateOptionsStatus),
  ModifyingProperties: S.optional(ModifyingPropertiesList),
  AIMLOptions: S.optional(AIMLOptionsStatus),
}) {}
export class ValidationFailure extends S.Class<ValidationFailure>(
  "ValidationFailure",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export const ValidationFailures = S.Array(ValidationFailure);
export class DryRunProgressStatus extends S.Class<DryRunProgressStatus>(
  "DryRunProgressStatus",
)({
  DryRunId: S.String,
  DryRunStatus: S.String,
  CreationDate: S.String,
  UpdateDate: S.String,
  ValidationFailures: S.optional(ValidationFailures),
}) {}
export class UpdateDomainConfigResponse extends S.Class<UpdateDomainConfigResponse>(
  "UpdateDomainConfigResponse",
)(
  {
    DomainConfig: DomainConfig,
    DryRunResults: S.optional(DryRunResults),
    DryRunProgressStatus: S.optional(DryRunProgressStatus),
  },
  ns,
) {}
export class UpgradeDomainResponse extends S.Class<UpgradeDomainResponse>(
  "UpgradeDomainResponse",
)(
  {
    UpgradeId: S.optional(S.String),
    DomainName: S.optional(S.String),
    TargetVersion: S.optional(S.String),
    PerformCheckOnly: S.optional(S.Boolean),
    AdvancedOptions: S.optional(AdvancedOptions),
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
export class AvailabilityZoneInfo extends S.Class<AvailabilityZoneInfo>(
  "AvailabilityZoneInfo",
)({
  AvailabilityZoneName: S.optional(S.String),
  ZoneStatus: S.optional(S.String),
  ConfiguredDataNodeCount: S.optional(S.String),
  AvailableDataNodeCount: S.optional(S.String),
  TotalShards: S.optional(S.String),
  TotalUnAssignedShards: S.optional(S.String),
}) {}
export const AvailabilityZoneInfoList = S.Array(AvailabilityZoneInfo);
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
  UseOffPeakWindow: S.optional(S.Boolean),
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ConfigChangeStatus: S.optional(S.String),
  InitiatedBy: S.optional(S.String),
}) {}
export class EnvironmentInfo extends S.Class<EnvironmentInfo>(
  "EnvironmentInfo",
)({ AvailabilityZoneInformation: S.optional(AvailabilityZoneInfoList) }) {}
export const EnvironmentInfoList = S.Array(EnvironmentInfo);
export class ReservedInstanceOffering extends S.Class<ReservedInstanceOffering>(
  "ReservedInstanceOffering",
)({
  ReservedInstanceOfferingId: S.optional(S.String),
  InstanceType: S.optional(S.String),
  Duration: S.optional(S.Number),
  FixedPrice: S.optional(S.Number),
  UsagePrice: S.optional(S.Number),
  CurrencyCode: S.optional(S.String),
  PaymentOption: S.optional(S.String),
  RecurringCharges: S.optional(RecurringChargeList),
}) {}
export const ReservedInstanceOfferingList = S.Array(
  ReservedInstanceOffering.pipe(T.XmlName("ReservedInstanceOffering")),
);
export class UpgradeHistory extends S.Class<UpgradeHistory>("UpgradeHistory")({
  UpgradeName: S.optional(S.String),
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpgradeStatus: S.optional(S.String),
  StepsList: S.optional(UpgradeStepsList),
}) {}
export const UpgradeHistoryList = S.Array(UpgradeHistory);
export class ScheduledAutoTuneDetails extends S.Class<ScheduledAutoTuneDetails>(
  "ScheduledAutoTuneDetails",
)({
  Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ActionType: S.optional(S.String),
  Action: S.optional(S.String),
  Severity: S.optional(S.String),
}) {}
export class AdditionalLimit extends S.Class<AdditionalLimit>(
  "AdditionalLimit",
)({
  LimitName: S.optional(S.String),
  LimitValues: S.optional(LimitValueList),
}) {}
export const AdditionalLimitList = S.Array(AdditionalLimit);
export class AcceptInboundConnectionResponse extends S.Class<AcceptInboundConnectionResponse>(
  "AcceptInboundConnectionResponse",
)({ Connection: S.optional(InboundConnection) }, ns) {}
export class AddDataSourceResponse extends S.Class<AddDataSourceResponse>(
  "AddDataSourceResponse",
)({ Message: S.optional(S.String) }, ns) {}
export class AddDirectQueryDataSourceResponse extends S.Class<AddDirectQueryDataSourceResponse>(
  "AddDirectQueryDataSourceResponse",
)({ DataSourceArn: S.optional(S.String) }, ns) {}
export class AssociatePackageResponse extends S.Class<AssociatePackageResponse>(
  "AssociatePackageResponse",
)({ DomainPackageDetails: S.optional(DomainPackageDetails) }, ns) {}
export class CreateDomainRequest extends S.Class<CreateDomainRequest>(
  "CreateDomainRequest",
)(
  {
    DomainName: S.String,
    EngineVersion: S.optional(S.String),
    ClusterConfig: S.optional(ClusterConfig),
    EBSOptions: S.optional(EBSOptions),
    AccessPolicies: S.optional(S.String),
    IPAddressType: S.optional(S.String),
    SnapshotOptions: S.optional(SnapshotOptions),
    VPCOptions: S.optional(VPCOptions),
    CognitoOptions: S.optional(CognitoOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    NodeToNodeEncryptionOptions: S.optional(NodeToNodeEncryptionOptions),
    AdvancedOptions: S.optional(AdvancedOptions),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    DomainEndpointOptions: S.optional(DomainEndpointOptions),
    AdvancedSecurityOptions: S.optional(AdvancedSecurityOptionsInput),
    IdentityCenterOptions: S.optional(IdentityCenterOptionsInput),
    TagList: S.optional(TagList),
    AutoTuneOptions: S.optional(AutoTuneOptionsInput),
    OffPeakWindowOptions: S.optional(OffPeakWindowOptions),
    SoftwareUpdateOptions: S.optional(SoftwareUpdateOptions),
    AIMLOptions: S.optional(AIMLOptionsInput),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2021-01-01/opensearch/domain" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOutboundConnectionResponse extends S.Class<CreateOutboundConnectionResponse>(
  "CreateOutboundConnectionResponse",
)(
  {
    LocalDomainInfo: S.optional(DomainInformationContainer),
    RemoteDomainInfo: S.optional(DomainInformationContainer),
    ConnectionAlias: S.optional(S.String),
    ConnectionStatus: S.optional(OutboundConnectionStatus),
    ConnectionId: S.optional(S.String),
    ConnectionMode: S.optional(S.String),
    ConnectionProperties: S.optional(ConnectionProperties),
  },
  ns,
) {}
export class CreateVpcEndpointResponse extends S.Class<CreateVpcEndpointResponse>(
  "CreateVpcEndpointResponse",
)({ VpcEndpoint: VpcEndpoint }, ns) {}
export class DeleteOutboundConnectionResponse extends S.Class<DeleteOutboundConnectionResponse>(
  "DeleteOutboundConnectionResponse",
)({ Connection: S.optional(OutboundConnection) }, ns) {}
export class DeletePackageResponse extends S.Class<DeletePackageResponse>(
  "DeletePackageResponse",
)({ PackageDetails: S.optional(PackageDetails) }, ns) {}
export class DescribeDomainChangeProgressResponse extends S.Class<DescribeDomainChangeProgressResponse>(
  "DescribeDomainChangeProgressResponse",
)({ ChangeProgressStatus: S.optional(ChangeProgressStatusDetails) }, ns) {}
export class DescribeDomainHealthResponse extends S.Class<DescribeDomainHealthResponse>(
  "DescribeDomainHealthResponse",
)(
  {
    DomainState: S.optional(S.String),
    AvailabilityZoneCount: S.optional(S.String),
    ActiveAvailabilityZoneCount: S.optional(S.String),
    StandByAvailabilityZoneCount: S.optional(S.String),
    DataNodeCount: S.optional(S.String),
    DedicatedMaster: S.optional(S.Boolean),
    MasterEligibleNodeCount: S.optional(S.String),
    WarmNodeCount: S.optional(S.String),
    MasterNode: S.optional(S.String),
    ClusterHealth: S.optional(S.String),
    TotalShards: S.optional(S.String),
    TotalUnAssignedShards: S.optional(S.String),
    EnvironmentInformation: S.optional(EnvironmentInfoList),
  },
  ns,
) {}
export class DescribeDryRunProgressResponse extends S.Class<DescribeDryRunProgressResponse>(
  "DescribeDryRunProgressResponse",
)(
  {
    DryRunProgressStatus: S.optional(DryRunProgressStatus),
    DryRunConfig: S.optional(DomainStatus),
    DryRunResults: S.optional(DryRunResults),
  },
  ns,
) {}
export class DescribeReservedInstanceOfferingsResponse extends S.Class<DescribeReservedInstanceOfferingsResponse>(
  "DescribeReservedInstanceOfferingsResponse",
)(
  {
    NextToken: S.optional(S.String),
    ReservedInstanceOfferings: S.optional(ReservedInstanceOfferingList),
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
export const SlotList = S.Array(S.Number);
export class StorageType extends S.Class<StorageType>("StorageType")({
  StorageTypeName: S.optional(S.String),
  StorageSubTypeName: S.optional(S.String),
  StorageTypeLimits: S.optional(StorageTypeLimitList),
}) {}
export const StorageTypeList = S.Array(StorageType);
export class InstanceLimits extends S.Class<InstanceLimits>("InstanceLimits")({
  InstanceCountLimits: S.optional(InstanceCountLimits),
}) {}
export class CreateDomainResponse extends S.Class<CreateDomainResponse>(
  "CreateDomainResponse",
)({ DomainStatus: S.optional(DomainStatus) }, ns) {}
export class DeleteDomainResponse extends S.Class<DeleteDomainResponse>(
  "DeleteDomainResponse",
)({ DomainStatus: S.optional(DomainStatus) }, ns) {}
export class DescribeDomainAutoTunesResponse extends S.Class<DescribeDomainAutoTunesResponse>(
  "DescribeDomainAutoTunesResponse",
)(
  { AutoTunes: S.optional(AutoTuneList), NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeDomainConfigResponse extends S.Class<DescribeDomainConfigResponse>(
  "DescribeDomainConfigResponse",
)({ DomainConfig: DomainConfig }, ns) {}
export class Limits extends S.Class<Limits>("Limits")({
  StorageTypes: S.optional(StorageTypeList),
  InstanceLimits: S.optional(InstanceLimits),
  AdditionalLimits: S.optional(AdditionalLimitList),
}) {}
export const LimitsByRole = S.Record({ key: S.String, value: Limits });
export class DescribeInstanceTypeLimitsResponse extends S.Class<DescribeInstanceTypeLimitsResponse>(
  "DescribeInstanceTypeLimitsResponse",
)({ LimitsByRole: S.optional(LimitsByRole) }, ns) {}

//# Errors
export class BaseException extends S.TaggedError<BaseException>()(
  "BaseException",
  { message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class DependencyFailureException extends S.TaggedError<DependencyFailureException>()(
  "DependencyFailureException",
  { message: S.optional(S.String) },
) {}
export class DisabledOperationException extends S.TaggedError<DisabledOperationException>()(
  "DisabledOperationException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class InvalidTypeException extends S.TaggedError<InvalidTypeException>()(
  "InvalidTypeException",
  { message: S.optional(S.String) },
) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class SlotNotAvailableException extends S.TaggedError<SlotNotAvailableException>()(
  "SlotNotAvailableException",
  { SlotSuggestions: S.optional(SlotList), message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Retrieves all Amazon OpenSearch Service-managed VPC endpoints in the current Amazon Web Services account and Region.
 */
export const listVpcEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVpcEndpointsRequest,
  output: ListVpcEndpointsResponse,
  errors: [BaseException, DisabledOperationException, InternalException],
}));
/**
 * Allows the source Amazon OpenSearch Service domain owner to delete an existing
 * outbound cross-cluster search connection. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const deleteOutboundConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOutboundConnectionRequest,
    output: DeleteOutboundConnectionResponse,
    errors: [DisabledOperationException, ResourceNotFoundException],
  }),
);
/**
 * Lists all the inbound cross-cluster search connections for a destination (remote)
 * Amazon OpenSearch Service domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const describeInboundConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInboundConnectionsRequest,
    output: DescribeInboundConnectionsResponse,
    errors: [DisabledOperationException, InvalidPaginationTokenException],
  }),
);
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
 * Retrieves the complete history of the last 10 upgrades performed on an Amazon OpenSearch
 * Service domain.
 */
export const getUpgradeHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUpgradeHistoryRequest,
  output: GetUpgradeHistoryResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Allows you to either upgrade your Amazon OpenSearch Service domain or perform an
 * upgrade eligibility check to a compatible version of OpenSearch or Elasticsearch.
 */
export const upgradeDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpgradeDomainRequest,
  output: UpgradeDomainResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a package for use with Amazon OpenSearch Service domains. For more
 * information, see Custom packages
 * for Amazon OpenSearch Service.
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
 * Allows you to purchase Amazon OpenSearch Service Reserved Instances.
 */
export const purchaseReservedInstanceOffering =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PurchaseReservedInstanceOfferingRequest,
    output: PurchaseReservedInstanceOfferingResponse,
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
 * Provides access to an Amazon OpenSearch Service domain through the use of an interface
 * VPC endpoint.
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
 * Allows the destination Amazon OpenSearch Service domain owner to accept an inbound
 * cross-cluster search connection request. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const acceptInboundConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AcceptInboundConnectionRequest,
    output: AcceptInboundConnectionResponse,
    errors: [
      DisabledOperationException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a new direct-query data source to the specified domain. For more information,
 * see Creating Amazon OpenSearch Service data source integrations with Amazon
 * S3.
 */
export const addDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddDataSourceRequest,
  output: AddDataSourceResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds a new data source in Amazon OpenSearch Service so that you can perform direct
 * queries on external data.
 */
export const addDirectQueryDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddDirectQueryDataSourceRequest,
    output: AddDirectQueryDataSourceResponse,
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
 * Allows the destination Amazon OpenSearch Service domain owner to delete an existing
 * inbound cross-cluster search connection. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const deleteInboundConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInboundConnectionRequest,
    output: DeleteInboundConnectionResponse,
    errors: [DisabledOperationException, ResourceNotFoundException],
  }),
);
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
 * Returns information about domain and nodes, including data nodes, master nodes,
 * ultrawarm nodes, Availability Zone(s), standby nodes, node configurations, and node
 * states.
 */
export const describeDomainNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainNodesRequest,
  output: DescribeDomainNodesResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes all packages available to OpenSearch Service. For more information, see
 * Custom packages
 * for Amazon OpenSearch Service.
 */
export const describePackages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePackagesRequest,
  output: DescribePackagesResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the Amazon OpenSearch Service instances that you have reserved in a given
 * Region. For more information, see Reserved Instances in Amazon
 * OpenSearch Service.
 */
export const describeReservedInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReservedInstancesRequest,
    output: DescribeReservedInstancesResponse,
    errors: [
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Removes a package from the specified Amazon OpenSearch Service domain. The package
 * can't be in use with any OpenSearch index for the dissociation to succeed. The package
 * is still available in OpenSearch Service for association later. For more information,
 * see Custom packages
 * for Amazon OpenSearch Service.
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
 * Retrieves the configuration and status of an existing OpenSearch application.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a map of OpenSearch or Elasticsearch versions and the versions you can upgrade
 * them to.
 */
export const getCompatibleVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCompatibleVersionsRequest,
    output: GetCompatibleVersionsResponse,
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
 * Returns a list of Amazon OpenSearch Service package versions, along with their creation
 * time, commit message, and plugin properties (if the package is a zip plugin package). For more
 * information, see Custom packages for Amazon
 * OpenSearch Service.
 */
export const getPackageVersionHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPackageVersionHistoryRequest,
    output: GetPackageVersionHistoryResponse,
    errors: [
      AccessDeniedException,
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all OpenSearch applications under your account.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists direct-query data sources for a specific domain. For more information, see For
 * more information, see Working with
 * Amazon OpenSearch Service direct queries with Amazon S3.
 */
export const listDataSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataSourcesRequest,
  output: ListDataSourcesResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists an inventory of all the direct query data sources that you have configured
 * within Amazon OpenSearch Service.
 */
export const listDirectQueryDataSources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDirectQueryDataSourcesRequest,
    output: ListDirectQueryDataSourcesResponse,
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
 * A list of maintenance actions for the domain.
 */
export const listDomainMaintenances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDomainMaintenancesRequest,
    output: ListDomainMaintenancesResponse,
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
 * Lists all instance types and available features for a given OpenSearch or
 * Elasticsearch version.
 */
export const listInstanceTypeDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInstanceTypeDetailsRequest,
    output: ListInstanceTypeDetailsResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Describes the domain configuration for the specified Amazon OpenSearch Service domain,
 * including the domain ID, domain service endpoint, and domain ARN.
 */
export const describeDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainRequest,
  output: DescribeDomainResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all Amazon OpenSearch Service domains associated with a given package. For more
 * information, see Custom packages
 * for Amazon OpenSearch Service.
 */
export const listDomainsForPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDomainsForPackageRequest,
    output: ListDomainsForPackageResponse,
    errors: [
      AccessDeniedException,
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all packages associated with an Amazon OpenSearch Service domain. For more
 * information, see Custom packages
 * for Amazon OpenSearch Service.
 */
export const listPackagesForDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPackagesForDomainRequest,
    output: ListPackagesForDomainResponse,
    errors: [
      AccessDeniedException,
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns all resource tags for an Amazon OpenSearch Service domain, data source, or
 * application. For more information, see Tagging Amazon OpenSearch Service resources.
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
 * Lists all versions of OpenSearch and Elasticsearch that Amazon OpenSearch Service
 * supports.
 */
export const listVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVersionsRequest,
  output: ListVersionsResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Sets the default application to the application with the specified ARN.
 *
 * To remove the default application, use the `GetDefaultApplicationSetting`
 * operation to get the current default and then call the
 * `PutDefaultApplicationSetting` with the current applications ARN and the
 * `setAsDefault` parameter set to `false`.
 */
export const putDefaultApplicationSetting =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutDefaultApplicationSettingRequest,
    output: PutDefaultApplicationSettingResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Schedules a service software update for an Amazon OpenSearch Service domain. For more
 * information, see Service
 * software updates in Amazon OpenSearch Service.
 */
export const startServiceSoftwareUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartServiceSoftwareUpdateRequest,
    output: StartServiceSoftwareUpdateResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the ARN of the current default application.
 *
 * If the default application isn't set, the operation returns a resource not found
 * error.
 */
export const getDefaultApplicationSetting =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDefaultApplicationSettingRequest,
    output: GetDefaultApplicationSettingResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Dissociates multiple packages from a domain simultaneously.
 */
export const dissociatePackages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DissociatePackagesRequest,
  output: DissociatePackagesResponse,
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
 * Updates the configuration and settings of an existing OpenSearch application.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
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
 * Operation in the Amazon OpenSearch Service API for associating multiple packages with
 * a domain simultaneously.
 */
export const associatePackages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociatePackagesRequest,
  output: AssociatePackagesResponse,
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
 * Retrieves information about a direct query data source.
 */
export const getDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceRequest,
  output: GetDataSourceResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a direct-query data source. For more information, see Working
 * with Amazon OpenSearch Service data source integrations with Amazon
 * S3.
 */
export const updateDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSourceRequest,
  output: UpdateDataSourceResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns detailed configuration information for a specific direct query data source in
 * Amazon OpenSearch Service.
 */
export const getDirectQueryDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDirectQueryDataSourceRequest,
    output: GetDirectQueryDataSourceResponse,
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
 * The status of the maintenance action.
 */
export const getDomainMaintenanceStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDomainMaintenanceStatusRequest,
    output: GetDomainMaintenanceStatusResponse,
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
 * Returns the most recent status of the last upgrade or upgrade eligibility check performed on
 * an Amazon OpenSearch Service domain.
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
 * Retrieves information about each Amazon Web Services principal that is allowed to
 * access a given Amazon OpenSearch Service domain through the use of an interface VPC
 * endpoint.
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
 * Retrieves all Amazon OpenSearch Service-managed VPC endpoints associated with a
 * particular domain.
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
 * Allows the remote Amazon OpenSearch Service domain owner to reject an inbound
 * cross-cluster connection request.
 */
export const rejectInboundConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RejectInboundConnectionRequest,
    output: RejectInboundConnectionResponse,
    errors: [DisabledOperationException, ResourceNotFoundException],
  }),
);
/**
 * Starts the node maintenance process on the data node. These processes can include a
 * node reboot, an Opensearch or Elasticsearch process restart, or a Dashboard or Kibana
 * restart.
 */
export const startDomainMaintenance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartDomainMaintenanceRequest,
    output: StartDomainMaintenanceResponse,
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
 * Updates the configuration or properties of an existing direct query data source in
 * Amazon OpenSearch Service.
 */
export const updateDirectQueryDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDirectQueryDataSourceRequest,
    output: UpdateDirectQueryDataSourceResponse,
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
 * Updates the scope of a package. Scope of the package defines users who can view and
 * associate a package.
 */
export const updatePackageScope = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackageScopeRequest,
  output: UpdatePackageScopeResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a previously configured direct query data source from Amazon OpenSearch
 * Service.
 */
export const deleteDirectQueryDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDirectQueryDataSourceRequest,
    output: DeleteDirectQueryDataSourceResponse,
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
 * Revokes access to an Amazon OpenSearch Service domain that was provided through an
 * interface VPC endpoint.
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
 * Deletes a specified OpenSearch application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a direct-query data source. For more information, see Deleting
 * an Amazon OpenSearch Service data source with Amazon S3.
 */
export const deleteDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSourceRequest,
  output: DeleteDataSourceResponse,
  errors: [
    BaseException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates a package with an Amazon OpenSearch Service domain. For more information,
 * see Custom packages
 * for Amazon OpenSearch Service.
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
 * Modifies the cluster configuration of the specified Amazon OpenSearch Service
 * domain.
 */
export const updateDomainConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainConfigRequest,
  output: UpdateDomainConfigResponse,
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
 * Retrieves a list of configuration changes that are scheduled for a domain. These
 * changes can be service
 * software updates or blue/green Auto-Tune enhancements.
 */
export const listScheduledActions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListScheduledActionsRequest,
    output: ListScheduledActionsResponse,
    errors: [
      BaseException,
      InternalException,
      InvalidPaginationTokenException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all the outbound cross-cluster connections for a local (source) Amazon
 * OpenSearch Service domain. For more information, see Cross-cluster search for Amazon OpenSearch Service.
 */
export const describeOutboundConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeOutboundConnectionsRequest,
    output: DescribeOutboundConnectionsResponse,
    errors: [DisabledOperationException, InvalidPaginationTokenException],
  }),
);
/**
 * Returns the names of all Amazon OpenSearch Service domains owned by the current user
 * in the active Region.
 */
export const listDomainNames = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainNamesRequest,
  output: ListDomainNamesResponse,
  errors: [BaseException, ValidationException],
}));
/**
 * Returns domain configuration information about the specified Amazon OpenSearch Service
 * domains.
 */
export const describeDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainsRequest,
  output: DescribeDomainsResponse,
  errors: [BaseException, InternalException, ValidationException],
}));
/**
 * Removes the specified set of tags from an Amazon OpenSearch Service domain, data
 * source, or application. For more information, see Tagging Amazon OpenSearch Service resources.
 */
export const removeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsRequest,
  output: RemoveTagsResponse,
  errors: [BaseException, InternalException, ValidationException],
}));
/**
 * Creates an OpenSearch UI application. For more information, see Using the OpenSearch user interface in Amazon OpenSearch Service.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    AccessDeniedException,
    BaseException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ValidationException,
  ],
}));
/**
 * Attaches tags to an existing Amazon OpenSearch Service domain, data source, or
 * application.
 *
 * Tags are a set of case-sensitive key-value pairs. A domain, data source, or
 * application can have up to 10 tags. For more information, see Tagging Amazon OpenSearch Service resources.
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
 * Cancels a scheduled service software update for an Amazon OpenSearch Service domain.
 * You can only perform this operation before the `AutomatedUpdateDate` and when
 * the domain's `UpdateStatus` is `PENDING_UPDATE`. For more
 * information, see Service
 * software updates in Amazon OpenSearch Service.
 */
export const cancelServiceSoftwareUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelServiceSoftwareUpdateRequest,
    output: CancelServiceSoftwareUpdateResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
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
 * Deletes an Amazon OpenSearch Service package. For more information, see Custom packages
 * for Amazon OpenSearch Service.
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
 * Returns information about the current blue/green deployment happening on an Amazon
 * OpenSearch Service domain. For more information, see Making configuration changes in Amazon OpenSearch Service.
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
 * Returns information about domain and node health, the standby Availability Zone,
 * number of nodes per Availability Zone, and shard count per node.
 */
export const describeDomainHealth = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDomainHealthRequest,
    output: DescribeDomainHealthResponse,
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
 * Describes the progress of a pre-update dry run analysis on an Amazon OpenSearch
 * Service domain. For more information, see Determining whether a change will cause a blue/green deployment.
 */
export const describeDryRunProgress = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDryRunProgressRequest,
    output: DescribeDryRunProgressResponse,
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
 * Describes the available Amazon OpenSearch Service Reserved Instance offerings for a
 * given Region. For more information, see Reserved Instances in Amazon
 * OpenSearch Service.
 */
export const describeReservedInstanceOfferings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeReservedInstanceOfferingsRequest,
    output: DescribeReservedInstanceOfferingsResponse,
    errors: [
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Creates a new cross-cluster search connection from a source Amazon OpenSearch Service domain
 * to a destination domain. For more information, see Cross-cluster search
 * for Amazon OpenSearch Service.
 */
export const createOutboundConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateOutboundConnectionRequest,
    output: CreateOutboundConnectionResponse,
    errors: [
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ResourceAlreadyExistsException,
    ],
  }),
);
/**
 * Creates a package for use with Amazon OpenSearch Service domains. For more
 * information, see Custom packages
 * for Amazon OpenSearch Service.
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
 * Creates an Amazon OpenSearch Service domain. For more information, see Creating and
 * managing Amazon OpenSearch Service domains.
 */
export const createDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainRequest,
  output: CreateDomainResponse,
  errors: [
    BaseException,
    DisabledOperationException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon OpenSearch Service domain and all of its data. You can't recover a
 * domain after you delete it.
 */
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the list of optimizations that Auto-Tune has made to an Amazon OpenSearch
 * Service domain. For more information, see Auto-Tune for Amazon
 * OpenSearch Service.
 */
export const describeDomainAutoTunes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDomainAutoTunesRequest,
    output: DescribeDomainAutoTunesResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns the configuration of an Amazon OpenSearch Service domain.
 */
export const describeDomainConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDomainConfigRequest,
    output: DescribeDomainConfigResponse,
    errors: [
      BaseException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Reschedules a planned domain configuration change for a later time. This change can be
 * a scheduled service
 * software update or a blue/green Auto-Tune enhancement.
 */
export const updateScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateScheduledActionRequest,
    output: UpdateScheduledActionResponse,
    errors: [
      BaseException,
      ConflictException,
      InternalException,
      LimitExceededException,
      ResourceNotFoundException,
      SlotNotAvailableException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an OpenSearch index. This operation permanently removes the index and cannot be undone.
 */
export const deleteIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexRequest,
  output: DeleteIndexResponse,
  errors: [
    AccessDeniedException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an OpenSearch index including its schema and semantic enrichment configuration. Use this operation to view the current index structure and semantic search settings.
 */
export const getIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexRequest,
  output: GetIndexResponse,
  errors: [
    AccessDeniedException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing OpenSearch index schema and semantic enrichment configuration. This operation allows modification of field mappings and semantic search settings for text fields. Changes to semantic enrichment configuration will apply to newly ingested documents.
 */
export const updateIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexRequest,
  output: UpdateIndexResponse,
  errors: [
    AccessDeniedException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an OpenSearch index with optional automatic semantic enrichment for specified text fields. Automatic semantic enrichment enables semantic search capabilities without requiring machine learning expertise, improving search relevance by up to 20% by understanding search intent and contextual meaning beyond keyword matching. The semantic enrichment process has zero impact on search latency as sparse encodings are stored directly within the index during indexing. For more information, see Automatic semantic enrichment.
 */
export const createIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexRequest,
  output: CreateIndexResponse,
  errors: [
    AccessDeniedException,
    DependencyFailureException,
    DisabledOperationException,
    InternalException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the instance count, storage, and master node limits for a given OpenSearch
 * or Elasticsearch version and instance type.
 */
export const describeInstanceTypeLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInstanceTypeLimitsRequest,
    output: DescribeInstanceTypeLimitsResponse,
    errors: [
      BaseException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
