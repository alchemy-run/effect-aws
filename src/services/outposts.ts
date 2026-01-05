import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Outposts",
  serviceShapeName: "OutpostsOlafService",
});
const auth = T.AwsAuthSigv4({ name: "outposts" });
const ver = T.ServiceVersion("2019-12-03");
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
                        url: "https://outposts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://outposts.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://outposts-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://outposts.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://outposts.{Region}.{PartitionResult#dnsSuffix}",
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
export const AssetIdList = S.Array(S.String);
export const OutpostInstanceTypeList = S.Array(S.String);
export const AccountIdList = S.Array(S.String);
export const AWSServiceNameList = S.Array(S.String);
export const HostIdList = S.Array(S.String);
export const StatusList = S.Array(S.String);
export const CapacityTaskStatusList = S.Array(S.String);
export const CatalogItemClassList = S.Array(S.String);
export const SupportedStorageList = S.Array(S.String);
export const EC2FamilyList = S.Array(S.String);
export const LifeCycleStatusList = S.Array(S.String);
export const AvailabilityZoneList = S.Array(S.String);
export const AvailabilityZoneIdList = S.Array(S.String);
export const CountryCodeList = S.Array(S.String);
export const StateOrRegionList = S.Array(S.String);
export const CityList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CancelCapacityTaskInput extends S.Class<CancelCapacityTaskInput>(
  "CancelCapacityTaskInput",
)(
  {
    CapacityTaskId: S.String.pipe(T.HttpLabel("CapacityTaskId")),
    OutpostIdentifier: S.String.pipe(T.HttpLabel("OutpostIdentifier")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/outposts/{OutpostIdentifier}/capacity/{CapacityTaskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelCapacityTaskOutput extends S.Class<CancelCapacityTaskOutput>(
  "CancelCapacityTaskOutput",
)({}) {}
export class CancelOrderInput extends S.Class<CancelOrderInput>(
  "CancelOrderInput",
)(
  { OrderId: S.String.pipe(T.HttpLabel("OrderId")) },
  T.all(
    T.Http({ method: "POST", uri: "/orders/{OrderId}/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelOrderOutput extends S.Class<CancelOrderOutput>(
  "CancelOrderOutput",
)({}) {}
export class DeleteOutpostInput extends S.Class<DeleteOutpostInput>(
  "DeleteOutpostInput",
)(
  { OutpostId: S.String.pipe(T.HttpLabel("OutpostId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/outposts/{OutpostId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOutpostOutput extends S.Class<DeleteOutpostOutput>(
  "DeleteOutpostOutput",
)({}) {}
export class DeleteSiteInput extends S.Class<DeleteSiteInput>(
  "DeleteSiteInput",
)(
  { SiteId: S.String.pipe(T.HttpLabel("SiteId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/sites/{SiteId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSiteOutput extends S.Class<DeleteSiteOutput>(
  "DeleteSiteOutput",
)({}) {}
export class GetCapacityTaskInput extends S.Class<GetCapacityTaskInput>(
  "GetCapacityTaskInput",
)(
  {
    CapacityTaskId: S.String.pipe(T.HttpLabel("CapacityTaskId")),
    OutpostIdentifier: S.String.pipe(T.HttpLabel("OutpostIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/outposts/{OutpostIdentifier}/capacity/{CapacityTaskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCatalogItemInput extends S.Class<GetCatalogItemInput>(
  "GetCatalogItemInput",
)(
  { CatalogItemId: S.String.pipe(T.HttpLabel("CatalogItemId")) },
  T.all(
    T.Http({ method: "GET", uri: "/catalog/item/{CatalogItemId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectionRequest extends S.Class<GetConnectionRequest>(
  "GetConnectionRequest",
)(
  { ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) },
  T.all(
    T.Http({ method: "GET", uri: "/connections/{ConnectionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOrderInput extends S.Class<GetOrderInput>("GetOrderInput")(
  { OrderId: S.String.pipe(T.HttpLabel("OrderId")) },
  T.all(
    T.Http({ method: "GET", uri: "/orders/{OrderId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOutpostInput extends S.Class<GetOutpostInput>(
  "GetOutpostInput",
)(
  { OutpostId: S.String.pipe(T.HttpLabel("OutpostId")) },
  T.all(
    T.Http({ method: "GET", uri: "/outposts/{OutpostId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOutpostBillingInformationInput extends S.Class<GetOutpostBillingInformationInput>(
  "GetOutpostBillingInformationInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    OutpostIdentifier: S.String.pipe(T.HttpLabel("OutpostIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/outpost/{OutpostIdentifier}/billing-information",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOutpostInstanceTypesInput extends S.Class<GetOutpostInstanceTypesInput>(
  "GetOutpostInstanceTypesInput",
)(
  {
    OutpostId: S.String.pipe(T.HttpLabel("OutpostId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/outposts/{OutpostId}/instanceTypes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOutpostSupportedInstanceTypesInput extends S.Class<GetOutpostSupportedInstanceTypesInput>(
  "GetOutpostSupportedInstanceTypesInput",
)(
  {
    OutpostIdentifier: S.String.pipe(T.HttpLabel("OutpostIdentifier")),
    OrderId: S.optional(S.String).pipe(T.HttpQuery("OrderId")),
    AssetId: S.optional(S.String).pipe(T.HttpQuery("AssetId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/outposts/{OutpostIdentifier}/supportedInstanceTypes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSiteInput extends S.Class<GetSiteInput>("GetSiteInput")(
  { SiteId: S.String.pipe(T.HttpLabel("SiteId")) },
  T.all(
    T.Http({ method: "GET", uri: "/sites/{SiteId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSiteAddressInput extends S.Class<GetSiteAddressInput>(
  "GetSiteAddressInput",
)(
  {
    SiteId: S.String.pipe(T.HttpLabel("SiteId")),
    AddressType: S.String.pipe(T.HttpQuery("AddressType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sites/{SiteId}/address" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetInstancesInput extends S.Class<ListAssetInstancesInput>(
  "ListAssetInstancesInput",
)(
  {
    OutpostIdentifier: S.String.pipe(T.HttpLabel("OutpostIdentifier")),
    AssetIdFilter: S.optional(AssetIdList).pipe(T.HttpQuery("AssetIdFilter")),
    InstanceTypeFilter: S.optional(OutpostInstanceTypeList).pipe(
      T.HttpQuery("InstanceTypeFilter"),
    ),
    AccountIdFilter: S.optional(AccountIdList).pipe(
      T.HttpQuery("AccountIdFilter"),
    ),
    AwsServiceFilter: S.optional(AWSServiceNameList).pipe(
      T.HttpQuery("AwsServiceFilter"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/outposts/{OutpostIdentifier}/assetInstances",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetsInput extends S.Class<ListAssetsInput>(
  "ListAssetsInput",
)(
  {
    OutpostIdentifier: S.String.pipe(T.HttpLabel("OutpostIdentifier")),
    HostIdFilter: S.optional(HostIdList).pipe(T.HttpQuery("HostIdFilter")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    StatusFilter: S.optional(StatusList).pipe(T.HttpQuery("StatusFilter")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/outposts/{OutpostIdentifier}/assets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBlockingInstancesForCapacityTaskInput extends S.Class<ListBlockingInstancesForCapacityTaskInput>(
  "ListBlockingInstancesForCapacityTaskInput",
)(
  {
    OutpostIdentifier: S.String.pipe(T.HttpLabel("OutpostIdentifier")),
    CapacityTaskId: S.String.pipe(T.HttpLabel("CapacityTaskId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/outposts/{OutpostIdentifier}/capacity/{CapacityTaskId}/blockingInstances",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCapacityTasksInput extends S.Class<ListCapacityTasksInput>(
  "ListCapacityTasksInput",
)(
  {
    OutpostIdentifierFilter: S.optional(S.String).pipe(
      T.HttpQuery("OutpostIdentifierFilter"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    CapacityTaskStatusFilter: S.optional(CapacityTaskStatusList).pipe(
      T.HttpQuery("CapacityTaskStatusFilter"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/capacity/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCatalogItemsInput extends S.Class<ListCatalogItemsInput>(
  "ListCatalogItemsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    ItemClassFilter: S.optional(CatalogItemClassList).pipe(
      T.HttpQuery("ItemClassFilter"),
    ),
    SupportedStorageFilter: S.optional(SupportedStorageList).pipe(
      T.HttpQuery("SupportedStorageFilter"),
    ),
    EC2FamilyFilter: S.optional(EC2FamilyList).pipe(
      T.HttpQuery("EC2FamilyFilter"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/catalog/items" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOrdersInput extends S.Class<ListOrdersInput>(
  "ListOrdersInput",
)(
  {
    OutpostIdentifierFilter: S.optional(S.String).pipe(
      T.HttpQuery("OutpostIdentifierFilter"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-orders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOutpostsInput extends S.Class<ListOutpostsInput>(
  "ListOutpostsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    LifeCycleStatusFilter: S.optional(LifeCycleStatusList).pipe(
      T.HttpQuery("LifeCycleStatusFilter"),
    ),
    AvailabilityZoneFilter: S.optional(AvailabilityZoneList).pipe(
      T.HttpQuery("AvailabilityZoneFilter"),
    ),
    AvailabilityZoneIdFilter: S.optional(AvailabilityZoneIdList).pipe(
      T.HttpQuery("AvailabilityZoneIdFilter"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/outposts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSitesInput extends S.Class<ListSitesInput>("ListSitesInput")(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    OperatingAddressCountryCodeFilter: S.optional(CountryCodeList).pipe(
      T.HttpQuery("OperatingAddressCountryCodeFilter"),
    ),
    OperatingAddressStateOrRegionFilter: S.optional(StateOrRegionList).pipe(
      T.HttpQuery("OperatingAddressStateOrRegionFilter"),
    ),
    OperatingAddressCityFilter: S.optional(CityList).pipe(
      T.HttpQuery("OperatingAddressCityFilter"),
    ),
  },
  T.all(T.Http({ method: "GET", uri: "/sites" }), svc, auth, proto, ver, rules),
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
export class StartConnectionRequest extends S.Class<StartConnectionRequest>(
  "StartConnectionRequest",
)(
  {
    DeviceSerialNumber: S.optional(S.String),
    AssetId: S.String,
    ClientPublicKey: S.String,
    NetworkInterfaceDeviceIndex: S.Number,
  },
  T.all(
    T.Http({ method: "POST", uri: "/connections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartOutpostDecommissionInput extends S.Class<StartOutpostDecommissionInput>(
  "StartOutpostDecommissionInput",
)(
  {
    OutpostIdentifier: S.String.pipe(T.HttpLabel("OutpostIdentifier")),
    ValidateOnly: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/outposts/{OutpostIdentifier}/decommission",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export class UpdateOutpostInput extends S.Class<UpdateOutpostInput>(
  "UpdateOutpostInput",
)(
  {
    OutpostId: S.String.pipe(T.HttpLabel("OutpostId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    SupportedHardwareType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/outposts/{OutpostId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSiteInput extends S.Class<UpdateSiteInput>(
  "UpdateSiteInput",
)(
  {
    SiteId: S.String.pipe(T.HttpLabel("SiteId")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Notes: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/sites/{SiteId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Address extends S.Class<Address>("Address")({
  ContactName: S.String,
  ContactPhoneNumber: S.String,
  AddressLine1: S.String,
  AddressLine2: S.optional(S.String),
  AddressLine3: S.optional(S.String),
  City: S.String,
  StateOrRegion: S.String,
  DistrictOrCounty: S.optional(S.String),
  PostalCode: S.String,
  CountryCode: S.String,
  Municipality: S.optional(S.String),
}) {}
export class UpdateSiteAddressInput extends S.Class<UpdateSiteAddressInput>(
  "UpdateSiteAddressInput",
)(
  {
    SiteId: S.String.pipe(T.HttpLabel("SiteId")),
    AddressType: S.String,
    Address: Address,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/sites/{SiteId}/address" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSiteRackPhysicalPropertiesInput extends S.Class<UpdateSiteRackPhysicalPropertiesInput>(
  "UpdateSiteRackPhysicalPropertiesInput",
)(
  {
    SiteId: S.String.pipe(T.HttpLabel("SiteId")),
    PowerDrawKva: S.optional(S.String),
    PowerPhase: S.optional(S.String),
    PowerConnector: S.optional(S.String),
    PowerFeedDrop: S.optional(S.String),
    UplinkGbps: S.optional(S.String),
    UplinkCount: S.optional(S.String),
    FiberOpticCableType: S.optional(S.String),
    OpticalStandard: S.optional(S.String),
    MaximumSupportedWeightLbs: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/sites/{SiteId}/rackPhysicalProperties" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const InstanceIdList = S.Array(S.String);
export class LineItemRequest extends S.Class<LineItemRequest>(
  "LineItemRequest",
)({ CatalogItemId: S.optional(S.String), Quantity: S.optional(S.Number) }) {}
export const LineItemRequestListDefinition = S.Array(LineItemRequest);
export class RackPhysicalProperties extends S.Class<RackPhysicalProperties>(
  "RackPhysicalProperties",
)({
  PowerDrawKva: S.optional(S.String),
  PowerPhase: S.optional(S.String),
  PowerConnector: S.optional(S.String),
  PowerFeedDrop: S.optional(S.String),
  UplinkGbps: S.optional(S.String),
  UplinkCount: S.optional(S.String),
  FiberOpticCableType: S.optional(S.String),
  OpticalStandard: S.optional(S.String),
  MaximumSupportedWeightLbs: S.optional(S.String),
}) {}
export class EC2Capacity extends S.Class<EC2Capacity>("EC2Capacity")({
  Family: S.optional(S.String),
  MaxSize: S.optional(S.String),
  Quantity: S.optional(S.String),
}) {}
export const EC2CapacityListDefinition = S.Array(EC2Capacity);
export const SupportedUplinkGbpsListDefinition = S.Array(S.Number);
export class CatalogItem extends S.Class<CatalogItem>("CatalogItem")({
  CatalogItemId: S.optional(S.String),
  ItemStatus: S.optional(S.String),
  EC2Capacities: S.optional(EC2CapacityListDefinition),
  PowerKva: S.optional(S.Number),
  WeightLbs: S.optional(S.Number),
  SupportedUplinkGbps: S.optional(SupportedUplinkGbpsListDefinition),
  SupportedStorage: S.optional(SupportedStorageList),
}) {}
export const CatalogItemListDefinition = S.Array(CatalogItem);
export class Outpost extends S.Class<Outpost>("Outpost")({
  OutpostId: S.optional(S.String),
  OwnerId: S.optional(S.String),
  OutpostArn: S.optional(S.String),
  SiteId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  LifeCycleStatus: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  AvailabilityZoneId: S.optional(S.String),
  Tags: S.optional(TagMap),
  SiteArn: S.optional(S.String),
  SupportedHardwareType: S.optional(S.String),
}) {}
export const outpostListDefinition = S.Array(Outpost);
export class Site extends S.Class<Site>("Site")({
  SiteId: S.optional(S.String),
  AccountId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagMap),
  SiteArn: S.optional(S.String),
  Notes: S.optional(S.String),
  OperatingAddressCountryCode: S.optional(S.String),
  OperatingAddressStateOrRegion: S.optional(S.String),
  OperatingAddressCity: S.optional(S.String),
  RackPhysicalProperties: S.optional(RackPhysicalProperties),
}) {}
export const siteListDefinition = S.Array(Site);
export class InstanceTypeCapacity extends S.Class<InstanceTypeCapacity>(
  "InstanceTypeCapacity",
)({ InstanceType: S.String, Count: S.Number }) {}
export const RequestedInstancePools = S.Array(InstanceTypeCapacity);
export class InstancesToExclude extends S.Class<InstancesToExclude>(
  "InstancesToExclude",
)({
  Instances: S.optional(InstanceIdList),
  AccountIds: S.optional(AccountIdList),
  Services: S.optional(AWSServiceNameList),
}) {}
export const BlockingResourceTypeList = S.Array(S.String);
export class CreateOrderInput extends S.Class<CreateOrderInput>(
  "CreateOrderInput",
)(
  {
    OutpostIdentifier: S.String,
    LineItems: S.optional(LineItemRequestListDefinition),
    PaymentOption: S.String,
    PaymentTerm: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/orders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOutpostInput extends S.Class<CreateOutpostInput>(
  "CreateOutpostInput",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    SiteId: S.String,
    AvailabilityZone: S.optional(S.String),
    AvailabilityZoneId: S.optional(S.String),
    Tags: S.optional(TagMap),
    SupportedHardwareType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/outposts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSiteInput extends S.Class<CreateSiteInput>(
  "CreateSiteInput",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Notes: S.optional(S.String),
    Tags: S.optional(TagMap),
    OperatingAddress: S.optional(Address),
    ShippingAddress: S.optional(Address),
    RackPhysicalProperties: S.optional(RackPhysicalProperties),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sites" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InstanceTypeItem extends S.Class<InstanceTypeItem>(
  "InstanceTypeItem",
)({ InstanceType: S.optional(S.String), VCPUs: S.optional(S.Number) }) {}
export const InstanceTypeListDefinition = S.Array(InstanceTypeItem);
export class GetOutpostSupportedInstanceTypesOutput extends S.Class<GetOutpostSupportedInstanceTypesOutput>(
  "GetOutpostSupportedInstanceTypesOutput",
)({
  InstanceTypes: S.optional(InstanceTypeListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class GetSiteAddressOutput extends S.Class<GetSiteAddressOutput>(
  "GetSiteAddressOutput",
)({
  SiteId: S.optional(S.String),
  AddressType: S.optional(S.String),
  Address: S.optional(Address),
}) {}
export class ListCatalogItemsOutput extends S.Class<ListCatalogItemsOutput>(
  "ListCatalogItemsOutput",
)({
  CatalogItems: S.optional(CatalogItemListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListOutpostsOutput extends S.Class<ListOutpostsOutput>(
  "ListOutpostsOutput",
)({
  Outposts: S.optional(outpostListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListSitesOutput extends S.Class<ListSitesOutput>(
  "ListSitesOutput",
)({ Sites: S.optional(siteListDefinition), NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class StartCapacityTaskInput extends S.Class<StartCapacityTaskInput>(
  "StartCapacityTaskInput",
)(
  {
    OutpostIdentifier: S.String.pipe(T.HttpLabel("OutpostIdentifier")),
    OrderId: S.optional(S.String),
    AssetId: S.optional(S.String),
    InstancePools: RequestedInstancePools,
    InstancesToExclude: S.optional(InstancesToExclude),
    DryRun: S.optional(S.Boolean),
    TaskActionOnBlockingInstances: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/outposts/{OutpostIdentifier}/capacity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartConnectionResponse extends S.Class<StartConnectionResponse>(
  "StartConnectionResponse",
)({
  ConnectionId: S.optional(S.String),
  UnderlayIpAddress: S.optional(S.String),
}) {}
export class StartOutpostDecommissionOutput extends S.Class<StartOutpostDecommissionOutput>(
  "StartOutpostDecommissionOutput",
)({
  Status: S.optional(S.String),
  BlockingResourceTypes: S.optional(BlockingResourceTypeList),
}) {}
export class UpdateOutpostOutput extends S.Class<UpdateOutpostOutput>(
  "UpdateOutpostOutput",
)({ Outpost: S.optional(Outpost) }) {}
export class UpdateSiteOutput extends S.Class<UpdateSiteOutput>(
  "UpdateSiteOutput",
)({ Site: S.optional(Site) }) {}
export class UpdateSiteAddressOutput extends S.Class<UpdateSiteAddressOutput>(
  "UpdateSiteAddressOutput",
)({ AddressType: S.optional(S.String), Address: S.optional(Address) }) {}
export class UpdateSiteRackPhysicalPropertiesOutput extends S.Class<UpdateSiteRackPhysicalPropertiesOutput>(
  "UpdateSiteRackPhysicalPropertiesOutput",
)({ Site: S.optional(Site) }) {}
export const CIDRList = S.Array(S.String);
export const OrderIdList = S.Array(S.String);
export class CapacityTaskFailure extends S.Class<CapacityTaskFailure>(
  "CapacityTaskFailure",
)({ Reason: S.String, Type: S.optional(S.String) }) {}
export class ConnectionDetails extends S.Class<ConnectionDetails>(
  "ConnectionDetails",
)({
  ClientPublicKey: S.optional(S.String),
  ServerPublicKey: S.optional(S.String),
  ServerEndpoint: S.optional(S.String),
  ClientTunnelAddress: S.optional(S.String),
  ServerTunnelAddress: S.optional(S.String),
  AllowedIps: S.optional(CIDRList),
}) {}
export class Subscription extends S.Class<Subscription>("Subscription")({
  SubscriptionId: S.optional(S.String),
  SubscriptionType: S.optional(S.String),
  SubscriptionStatus: S.optional(S.String),
  OrderIds: S.optional(OrderIdList),
  BeginDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MonthlyRecurringPrice: S.optional(S.Number),
  UpfrontPrice: S.optional(S.Number),
}) {}
export const SubscriptionList = S.Array(Subscription);
export class AssetInstance extends S.Class<AssetInstance>("AssetInstance")({
  InstanceId: S.optional(S.String),
  InstanceType: S.optional(S.String),
  AssetId: S.optional(S.String),
  AccountId: S.optional(S.String),
  AwsServiceName: S.optional(S.String),
}) {}
export const AssetInstanceList = S.Array(AssetInstance);
export class BlockingInstance extends S.Class<BlockingInstance>(
  "BlockingInstance",
)({
  InstanceId: S.optional(S.String),
  AccountId: S.optional(S.String),
  AwsServiceName: S.optional(S.String),
}) {}
export const BlockingInstancesList = S.Array(BlockingInstance);
export class CapacityTaskSummary extends S.Class<CapacityTaskSummary>(
  "CapacityTaskSummary",
)({
  CapacityTaskId: S.optional(S.String),
  OutpostId: S.optional(S.String),
  OrderId: S.optional(S.String),
  AssetId: S.optional(S.String),
  CapacityTaskStatus: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CapacityTaskList = S.Array(CapacityTaskSummary);
export const InstanceFamilies = S.Array(S.String);
export class ShipmentInformation extends S.Class<ShipmentInformation>(
  "ShipmentInformation",
)({
  ShipmentTrackingNumber: S.optional(S.String),
  ShipmentCarrier: S.optional(S.String),
}) {}
export const MacAddressList = S.Array(S.String);
export class LineItemAssetInformation extends S.Class<LineItemAssetInformation>(
  "LineItemAssetInformation",
)({
  AssetId: S.optional(S.String),
  MacAddressList: S.optional(MacAddressList),
}) {}
export const LineItemAssetInformationList = S.Array(LineItemAssetInformation);
export class LineItem extends S.Class<LineItem>("LineItem")({
  CatalogItemId: S.optional(S.String),
  LineItemId: S.optional(S.String),
  Quantity: S.optional(S.Number),
  Status: S.optional(S.String),
  ShipmentInformation: S.optional(ShipmentInformation),
  AssetInformationList: S.optional(LineItemAssetInformationList),
  PreviousLineItemId: S.optional(S.String),
  PreviousOrderId: S.optional(S.String),
}) {}
export const LineItemListDefinition = S.Array(LineItem);
export class Order extends S.Class<Order>("Order")({
  OutpostId: S.optional(S.String),
  OrderId: S.optional(S.String),
  Status: S.optional(S.String),
  LineItems: S.optional(LineItemListDefinition),
  PaymentOption: S.optional(S.String),
  OrderSubmissionDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  OrderFulfilledDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  PaymentTerm: S.optional(S.String),
  OrderType: S.optional(S.String),
}) {}
export class CreateOrderOutput extends S.Class<CreateOrderOutput>(
  "CreateOrderOutput",
)({ Order: S.optional(Order) }) {}
export class CreateOutpostOutput extends S.Class<CreateOutpostOutput>(
  "CreateOutpostOutput",
)({ Outpost: S.optional(Outpost) }) {}
export class CreateSiteOutput extends S.Class<CreateSiteOutput>(
  "CreateSiteOutput",
)({ Site: S.optional(Site) }) {}
export class GetCapacityTaskOutput extends S.Class<GetCapacityTaskOutput>(
  "GetCapacityTaskOutput",
)({
  CapacityTaskId: S.optional(S.String),
  OutpostId: S.optional(S.String),
  OrderId: S.optional(S.String),
  AssetId: S.optional(S.String),
  RequestedInstancePools: S.optional(RequestedInstancePools),
  InstancesToExclude: S.optional(InstancesToExclude),
  DryRun: S.optional(S.Boolean),
  CapacityTaskStatus: S.optional(S.String),
  Failed: S.optional(CapacityTaskFailure),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TaskActionOnBlockingInstances: S.optional(S.String),
}) {}
export class GetConnectionResponse extends S.Class<GetConnectionResponse>(
  "GetConnectionResponse",
)({
  ConnectionId: S.optional(S.String),
  ConnectionDetails: S.optional(ConnectionDetails),
}) {}
export class GetOutpostOutput extends S.Class<GetOutpostOutput>(
  "GetOutpostOutput",
)({ Outpost: S.optional(Outpost) }) {}
export class GetOutpostBillingInformationOutput extends S.Class<GetOutpostBillingInformationOutput>(
  "GetOutpostBillingInformationOutput",
)({
  NextToken: S.optional(S.String),
  Subscriptions: S.optional(SubscriptionList),
  ContractEndDate: S.optional(S.String),
}) {}
export class GetOutpostInstanceTypesOutput extends S.Class<GetOutpostInstanceTypesOutput>(
  "GetOutpostInstanceTypesOutput",
)({
  InstanceTypes: S.optional(InstanceTypeListDefinition),
  NextToken: S.optional(S.String),
  OutpostId: S.optional(S.String),
  OutpostArn: S.optional(S.String),
}) {}
export class GetSiteOutput extends S.Class<GetSiteOutput>("GetSiteOutput")({
  Site: S.optional(Site),
}) {}
export class ListAssetInstancesOutput extends S.Class<ListAssetInstancesOutput>(
  "ListAssetInstancesOutput",
)({
  AssetInstances: S.optional(AssetInstanceList),
  NextToken: S.optional(S.String),
}) {}
export class ListBlockingInstancesForCapacityTaskOutput extends S.Class<ListBlockingInstancesForCapacityTaskOutput>(
  "ListBlockingInstancesForCapacityTaskOutput",
)({
  BlockingInstances: S.optional(BlockingInstancesList),
  NextToken: S.optional(S.String),
}) {}
export class ListCapacityTasksOutput extends S.Class<ListCapacityTasksOutput>(
  "ListCapacityTasksOutput",
)({
  CapacityTasks: S.optional(CapacityTaskList),
  NextToken: S.optional(S.String),
}) {}
export class StartCapacityTaskOutput extends S.Class<StartCapacityTaskOutput>(
  "StartCapacityTaskOutput",
)({
  CapacityTaskId: S.optional(S.String),
  OutpostId: S.optional(S.String),
  OrderId: S.optional(S.String),
  AssetId: S.optional(S.String),
  RequestedInstancePools: S.optional(RequestedInstancePools),
  InstancesToExclude: S.optional(InstancesToExclude),
  DryRun: S.optional(S.Boolean),
  CapacityTaskStatus: S.optional(S.String),
  Failed: S.optional(CapacityTaskFailure),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TaskActionOnBlockingInstances: S.optional(S.String),
}) {}
export class AssetLocation extends S.Class<AssetLocation>("AssetLocation")({
  RackElevation: S.optional(S.Number),
}) {}
export const LineItemStatusCounts = S.Record({
  key: S.String,
  value: S.Number,
});
export class OrderSummary extends S.Class<OrderSummary>("OrderSummary")({
  OutpostId: S.optional(S.String),
  OrderId: S.optional(S.String),
  OrderType: S.optional(S.String),
  Status: S.optional(S.String),
  LineItemCountsByStatus: S.optional(LineItemStatusCounts),
  OrderSubmissionDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  OrderFulfilledDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const OrderSummaryListDefinition = S.Array(OrderSummary);
export class AssetInstanceTypeCapacity extends S.Class<AssetInstanceTypeCapacity>(
  "AssetInstanceTypeCapacity",
)({ InstanceType: S.String, Count: S.Number }) {}
export const AssetInstanceCapacityList = S.Array(AssetInstanceTypeCapacity);
export class GetCatalogItemOutput extends S.Class<GetCatalogItemOutput>(
  "GetCatalogItemOutput",
)({ CatalogItem: S.optional(CatalogItem) }) {}
export class ListOrdersOutput extends S.Class<ListOrdersOutput>(
  "ListOrdersOutput",
)({
  Orders: S.optional(OrderSummaryListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ComputeAttributes extends S.Class<ComputeAttributes>(
  "ComputeAttributes",
)({
  HostId: S.optional(S.String),
  State: S.optional(S.String),
  InstanceFamilies: S.optional(InstanceFamilies),
  InstanceTypeCapacities: S.optional(AssetInstanceCapacityList),
  MaxVcpus: S.optional(S.Number),
}) {}
export class AssetInfo extends S.Class<AssetInfo>("AssetInfo")({
  AssetId: S.optional(S.String),
  RackId: S.optional(S.String),
  AssetType: S.optional(S.String),
  ComputeAttributes: S.optional(ComputeAttributes),
  AssetLocation: S.optional(AssetLocation),
}) {}
export const AssetListDefinition = S.Array(AssetInfo);
export class GetOrderOutput extends S.Class<GetOrderOutput>("GetOrderOutput")({
  Order: S.optional(Order),
}) {}
export class ListAssetsOutput extends S.Class<ListAssetsOutput>(
  "ListAssetsOutput",
)({
  Assets: S.optional(AssetListDefinition),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the Outposts for your Amazon Web Services account.
 *
 * Use filters to return specific results. If you specify multiple filters, the results include only the resources that match
 * all of the specified filters. For a filter where you can specify multiple values, the results include
 * items that match any of the values that you specify for the filter.
 */
export const listOutposts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListOutpostsInput,
    output: ListOutpostsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Outposts",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Removes tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalServerException, NotFoundException, ValidationException],
}));
/**
 * Gets the instance types that an Outpost can support in `InstanceTypeCapacity`.
 * This will generally include instance types that are not currently configured and therefore
 * cannot be launched with the current Outpost capacity configuration.
 */
export const getOutpostSupportedInstanceTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetOutpostSupportedInstanceTypesInput,
    output: GetOutpostSupportedInstanceTypesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "InstanceTypes",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets the site address of the specified site.
 */
export const getSiteAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSiteAddressInput,
  output: GetSiteAddressOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the items in the catalog.
 *
 * Use filters to return specific results. If you specify multiple filters, the results include only the resources that match
 * all of the specified filters. For a filter where you can specify multiple values, the results include
 * items that match any of the values that you specify for the filter.
 */
export const listCatalogItems = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCatalogItemsInput,
    output: ListCatalogItemsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CatalogItems",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InternalServerException, NotFoundException, ValidationException],
}));
/**
 * Amazon Web Services uses this action to install Outpost servers.
 *
 * Starts the connection required for Outpost server installation.
 *
 * Use CloudTrail to monitor this action or Amazon Web Services managed policy for Amazon Web Services Outposts to secure it. For
 * more information, see
 * Amazon Web Services managed policies for Amazon Web Services Outposts and
 * Logging Amazon Web Services Outposts API calls with Amazon Web Services CloudTrail in the *Amazon Web Services Outposts User Guide*.
 */
export const startConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartConnectionRequest,
  output: StartConnectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Cancels the capacity task.
 */
export const cancelCapacityTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelCapacityTaskInput,
  output: CancelCapacityTaskOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets details of the specified capacity task.
 */
export const getCapacityTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCapacityTaskInput,
  output: GetCapacityTaskOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Amazon Web Services uses this action to install Outpost servers.
 *
 * Gets information about the specified connection.
 *
 * Use CloudTrail to monitor this action or Amazon Web Services managed policy for Amazon Web Services Outposts to secure it. For
 * more information, see
 * Amazon Web Services managed policies for Amazon Web Services Outposts and
 * Logging Amazon Web Services Outposts API calls with Amazon Web Services CloudTrail in the *Amazon Web Services Outposts User Guide*.
 */
export const getConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionRequest,
  output: GetConnectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified Outpost.
 */
export const getOutpost = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOutpostInput,
  output: GetOutpostOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets current and historical billing information about the specified Outpost.
 */
export const getOutpostBillingInformation =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetOutpostBillingInformationInput,
    output: GetOutpostBillingInformationOutput,
    errors: [AccessDeniedException, InternalServerException, NotFoundException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Subscriptions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets the instance types for the specified Outpost.
 */
export const getOutpostInstanceTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetOutpostInstanceTypesInput,
    output: GetOutpostInstanceTypesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "InstanceTypes",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets information about the specified Outpost site.
 */
export const getSite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSiteInput,
  output: GetSiteOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * A list of Amazon EC2 instances, belonging to all accounts, running on the specified Outpost.
 * Does not include Amazon EBS or Amazon S3 instances.
 */
export const listAssetInstances = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAssetInstancesInput,
    output: ListAssetInstancesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AssetInstances",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * A list of Amazon EC2 instances running on the Outpost and belonging to the account that
 * initiated the capacity task. Use this list to specify the instances you cannot stop to free up
 * capacity to run the capacity task.
 */
export const listBlockingInstancesForCapacityTask =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBlockingInstancesForCapacityTaskInput,
    output: ListBlockingInstancesForCapacityTaskOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "BlockingInstances",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the capacity tasks for your Amazon Web Services account.
 *
 * Use filters to return specific results. If you specify multiple filters, the results include only the resources that match
 * all of the specified filters. For a filter where you can specify multiple values, the results include
 * items that match any of the values that you specify for the filter.
 */
export const listCapacityTasks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCapacityTasksInput,
    output: ListCapacityTasksOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CapacityTasks",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Starts the specified capacity task. You can have one active capacity task for each order
 * and each Outpost.
 */
export const startCapacityTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCapacityTaskInput,
  output: StartCapacityTaskOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the Outpost sites for your Amazon Web Services account. Use filters to return specific
 * results.
 *
 * Use filters to return specific results. If you specify multiple filters, the results include only the resources that match
 * all of the specified filters. For a filter where you can specify multiple values, the results include
 * items that match any of the values that you specify for the filter.
 */
export const listSites = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSitesInput,
  output: ListSitesOutput,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Sites",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InternalServerException, NotFoundException, ValidationException],
}));
/**
 * Starts the decommission process to return the Outposts racks or servers.
 */
export const startOutpostDecommission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartOutpostDecommissionInput,
    output: StartOutpostDecommissionOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      NotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an Outpost.
 */
export const updateOutpost = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOutpostInput,
  output: UpdateOutpostOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the specified site.
 */
export const updateSite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSiteInput,
  output: UpdateSiteOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the address of the specified site.
 *
 * You can't update a site address if there is an order in progress. You must wait for the
 * order to complete or cancel the order.
 *
 * You can update the operating address before you place an order at the site, or after all
 * Outposts that belong to the site have been deactivated.
 */
export const updateSiteAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSiteAddressInput,
  output: UpdateSiteAddressOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Update the physical and logistical details for a rack at a site. For more information
 * about hardware requirements for racks, see Network
 * readiness checklist in the Amazon Web Services Outposts User Guide.
 *
 * To update a rack at a site with an order of `IN_PROGRESS`, you must wait for
 * the order to complete or cancel the order.
 */
export const updateSiteRackPhysicalProperties =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSiteRackPhysicalPropertiesInput,
    output: UpdateSiteRackPhysicalPropertiesOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      NotFoundException,
      ValidationException,
    ],
  }));
/**
 * Cancels the specified order for an Outpost.
 */
export const cancelOrder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelOrderInput,
  output: CancelOrderOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified Outpost.
 */
export const deleteOutpost = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOutpostInput,
  output: DeleteOutpostOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified site.
 */
export const deleteSite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSiteInput,
  output: DeleteSiteOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a site for an Outpost.
 */
export const createSite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSiteInput,
  output: CreateSiteOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified catalog item.
 */
export const getCatalogItem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCatalogItemInput,
  output: GetCatalogItemOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the Outpost orders for your Amazon Web Services account.
 */
export const listOrders = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOrdersInput,
  output: ListOrdersOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Orders",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates an order for an Outpost.
 */
export const createOrder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOrderInput,
  output: CreateOrderOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an Outpost.
 *
 * You can specify either an Availability one or an AZ ID.
 */
export const createOutpost = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOutpostInput,
  output: CreateOutpostOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    NotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified order.
 */
export const getOrder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOrderInput,
  output: GetOrderOutput,
  errors: [InternalServerException, NotFoundException, ValidationException],
}));
/**
 * Lists the hardware assets for the specified Outpost.
 *
 * Use filters to return specific results. If you specify multiple filters, the results include only the resources that match
 * all of the specified filters. For a filter where you can specify multiple values, the results include
 * items that match any of the values that you specify for the filter.
 */
export const listAssets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetsInput,
  output: ListAssetsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    NotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Assets",
    pageSize: "MaxResults",
  } as const,
}));
