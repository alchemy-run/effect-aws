import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "NetworkManager",
  serviceShapeName: "NetworkManager",
});
const auth = T.AwsAuthSigv4({ name: "networkmanager" });
const ver = T.ServiceVersion("2019-07-05");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://networkmanager.us-west-2.amazonaws.com",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-west-2" },
                      ],
                    },
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
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://networkmanager.us-west-2.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-west-2" },
                      ],
                    },
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
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://networkmanager-fips.us-west-2.amazonaws.com",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-west-2" },
                      ],
                    },
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
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://networkmanager-fips.us-west-2.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-west-2" },
                      ],
                    },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://networkmanager.us-gov-west-1.amazonaws.com",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-gov-west-1" },
                      ],
                    },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://networkmanager.us-gov-west-1.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-gov-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                          endpoint: {
                            url: "https://networkmanager-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
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
                          endpoint: {
                            url: "https://networkmanager-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
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
                          endpoint: {
                            url: "https://networkmanager.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    url: "https://networkmanager.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
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
      type: "tree",
    },
  ],
});

//# Schemas
export const ConstrainedStringList = S.Array(S.String);
export const ExternalRegionCodeList = S.Array(S.String);
export const SubnetArnList = S.Array(S.String);
export const GlobalNetworkIdList = S.Array(S.String);
export const ConnectionIdList = S.Array(S.String);
export const ConnectPeerIdList = S.Array(S.String);
export const CustomerGatewayArnList = S.Array(S.String);
export const DeviceIdList = S.Array(S.String);
export const LinkIdList = S.Array(S.String);
export const RouteStateList = S.Array(S.String);
export const RouteTypeList = S.Array(S.String);
export const SiteIdList = S.Array(S.String);
export const TransitGatewayConnectPeerArnList = S.Array(S.String);
export const TransitGatewayArnList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AcceptAttachmentRequest extends S.Class<AcceptAttachmentRequest>(
  "AcceptAttachmentRequest",
)(
  { AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) },
  T.all(
    T.Http({ method: "POST", uri: "/attachments/{AttachmentId}/accept" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateConnectPeerRequest extends S.Class<AssociateConnectPeerRequest>(
  "AssociateConnectPeerRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectPeerId: S.String,
    DeviceId: S.String,
    LinkId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/global-networks/{GlobalNetworkId}/connect-peer-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateCustomerGatewayRequest extends S.Class<AssociateCustomerGatewayRequest>(
  "AssociateCustomerGatewayRequest",
)(
  {
    CustomerGatewayArn: S.String,
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String,
    LinkId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/global-networks/{GlobalNetworkId}/customer-gateway-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateLinkRequest extends S.Class<AssociateLinkRequest>(
  "AssociateLinkRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String,
    LinkId: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/global-networks/{GlobalNetworkId}/link-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateTransitGatewayConnectPeerRequest extends S.Class<AssociateTransitGatewayConnectPeerRequest>(
  "AssociateTransitGatewayConnectPeerRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayConnectPeerArn: S.String,
    DeviceId: S.String,
    LinkId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/global-networks/{GlobalNetworkId}/transit-gateway-connect-peer-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateConnectionRequest extends S.Class<CreateConnectionRequest>(
  "CreateConnectionRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String,
    ConnectedDeviceId: S.String,
    LinkId: S.optional(S.String),
    ConnectedLinkId: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/global-networks/{GlobalNetworkId}/connections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCoreNetworkRequest extends S.Class<CreateCoreNetworkRequest>(
  "CreateCoreNetworkRequest",
)(
  {
    GlobalNetworkId: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    PolicyDocument: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/core-networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCoreNetworkPrefixListAssociationRequest extends S.Class<CreateCoreNetworkPrefixListAssociationRequest>(
  "CreateCoreNetworkPrefixListAssociationRequest",
)(
  {
    CoreNetworkId: S.String,
    PrefixListArn: S.String,
    PrefixListAlias: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prefix-list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDirectConnectGatewayAttachmentRequest extends S.Class<CreateDirectConnectGatewayAttachmentRequest>(
  "CreateDirectConnectGatewayAttachmentRequest",
)(
  {
    CoreNetworkId: S.String,
    DirectConnectGatewayArn: S.String,
    RoutingPolicyLabel: S.optional(S.String),
    EdgeLocations: ExternalRegionCodeList,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/direct-connect-gateway-attachments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGlobalNetworkRequest extends S.Class<CreateGlobalNetworkRequest>(
  "CreateGlobalNetworkRequest",
)(
  { Description: S.optional(S.String), Tags: S.optional(TagList) },
  T.all(
    T.Http({ method: "POST", uri: "/global-networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Location extends S.Class<Location>("Location")({
  Address: S.optional(S.String),
  Latitude: S.optional(S.String),
  Longitude: S.optional(S.String),
}) {}
export class CreateSiteRequest extends S.Class<CreateSiteRequest>(
  "CreateSiteRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    Description: S.optional(S.String),
    Location: S.optional(Location),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/global-networks/{GlobalNetworkId}/sites" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSiteToSiteVpnAttachmentRequest extends S.Class<CreateSiteToSiteVpnAttachmentRequest>(
  "CreateSiteToSiteVpnAttachmentRequest",
)(
  {
    CoreNetworkId: S.String,
    VpnConnectionArn: S.String,
    RoutingPolicyLabel: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/site-to-site-vpn-attachments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTransitGatewayPeeringRequest extends S.Class<CreateTransitGatewayPeeringRequest>(
  "CreateTransitGatewayPeeringRequest",
)(
  {
    CoreNetworkId: S.String,
    TransitGatewayArn: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/transit-gateway-peerings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTransitGatewayRouteTableAttachmentRequest extends S.Class<CreateTransitGatewayRouteTableAttachmentRequest>(
  "CreateTransitGatewayRouteTableAttachmentRequest",
)(
  {
    PeeringId: S.String,
    TransitGatewayRouteTableArn: S.String,
    RoutingPolicyLabel: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/transit-gateway-route-table-attachments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAttachmentRequest extends S.Class<DeleteAttachmentRequest>(
  "DeleteAttachmentRequest",
)(
  { AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/attachments/{AttachmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectionRequest extends S.Class<DeleteConnectionRequest>(
  "DeleteConnectionRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/global-networks/{GlobalNetworkId}/connections/{ConnectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectPeerRequest extends S.Class<DeleteConnectPeerRequest>(
  "DeleteConnectPeerRequest",
)(
  { ConnectPeerId: S.String.pipe(T.HttpLabel("ConnectPeerId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/connect-peers/{ConnectPeerId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCoreNetworkRequest extends S.Class<DeleteCoreNetworkRequest>(
  "DeleteCoreNetworkRequest",
)(
  { CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/core-networks/{CoreNetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCoreNetworkPolicyVersionRequest extends S.Class<DeleteCoreNetworkPolicyVersionRequest>(
  "DeleteCoreNetworkPolicyVersionRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/core-networks/{CoreNetworkId}/core-network-policy-versions/{PolicyVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCoreNetworkPrefixListAssociationRequest extends S.Class<DeleteCoreNetworkPrefixListAssociationRequest>(
  "DeleteCoreNetworkPrefixListAssociationRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PrefixListArn: S.String.pipe(T.HttpLabel("PrefixListArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prefix-list/{PrefixListArn}/core-network/{CoreNetworkId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeviceRequest extends S.Class<DeleteDeviceRequest>(
  "DeleteDeviceRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/global-networks/{GlobalNetworkId}/devices/{DeviceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGlobalNetworkRequest extends S.Class<DeleteGlobalNetworkRequest>(
  "DeleteGlobalNetworkRequest",
)(
  { GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/global-networks/{GlobalNetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLinkRequest extends S.Class<DeleteLinkRequest>(
  "DeleteLinkRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    LinkId: S.String.pipe(T.HttpLabel("LinkId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/global-networks/{GlobalNetworkId}/links/{LinkId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePeeringRequest extends S.Class<DeletePeeringRequest>(
  "DeletePeeringRequest",
)(
  { PeeringId: S.String.pipe(T.HttpLabel("PeeringId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/peerings/{PeeringId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/resource-policy/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export class DeleteSiteRequest extends S.Class<DeleteSiteRequest>(
  "DeleteSiteRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    SiteId: S.String.pipe(T.HttpLabel("SiteId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/global-networks/{GlobalNetworkId}/sites/{SiteId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterTransitGatewayRequest extends S.Class<DeregisterTransitGatewayRequest>(
  "DeregisterTransitGatewayRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayArn: S.String.pipe(T.HttpLabel("TransitGatewayArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/global-networks/{GlobalNetworkId}/transit-gateway-registrations/{TransitGatewayArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGlobalNetworksRequest extends S.Class<DescribeGlobalNetworksRequest>(
  "DescribeGlobalNetworksRequest",
)(
  {
    GlobalNetworkIds: S.optional(GlobalNetworkIdList).pipe(
      T.HttpQuery("globalNetworkIds"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/global-networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateConnectPeerRequest extends S.Class<DisassociateConnectPeerRequest>(
  "DisassociateConnectPeerRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectPeerId: S.String.pipe(T.HttpLabel("ConnectPeerId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/global-networks/{GlobalNetworkId}/connect-peer-associations/{ConnectPeerId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateCustomerGatewayRequest extends S.Class<DisassociateCustomerGatewayRequest>(
  "DisassociateCustomerGatewayRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    CustomerGatewayArn: S.String.pipe(T.HttpLabel("CustomerGatewayArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/global-networks/{GlobalNetworkId}/customer-gateway-associations/{CustomerGatewayArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateLinkRequest extends S.Class<DisassociateLinkRequest>(
  "DisassociateLinkRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String.pipe(T.HttpQuery("deviceId")),
    LinkId: S.String.pipe(T.HttpQuery("linkId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/global-networks/{GlobalNetworkId}/link-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateTransitGatewayConnectPeerRequest extends S.Class<DisassociateTransitGatewayConnectPeerRequest>(
  "DisassociateTransitGatewayConnectPeerRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayConnectPeerArn: S.String.pipe(
      T.HttpLabel("TransitGatewayConnectPeerArn"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/global-networks/{GlobalNetworkId}/transit-gateway-connect-peer-associations/{TransitGatewayConnectPeerArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExecuteCoreNetworkChangeSetRequest extends S.Class<ExecuteCoreNetworkChangeSetRequest>(
  "ExecuteCoreNetworkChangeSetRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/core-networks/{CoreNetworkId}/core-network-change-sets/{PolicyVersionId}/execute",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExecuteCoreNetworkChangeSetResponse extends S.Class<ExecuteCoreNetworkChangeSetResponse>(
  "ExecuteCoreNetworkChangeSetResponse",
)({}) {}
export class GetConnectAttachmentRequest extends S.Class<GetConnectAttachmentRequest>(
  "GetConnectAttachmentRequest",
)(
  { AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) },
  T.all(
    T.Http({ method: "GET", uri: "/connect-attachments/{AttachmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectionsRequest extends S.Class<GetConnectionsRequest>(
  "GetConnectionsRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectionIds: S.optional(ConnectionIdList).pipe(
      T.HttpQuery("connectionIds"),
    ),
    DeviceId: S.optional(S.String).pipe(T.HttpQuery("deviceId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/connections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectPeerRequest extends S.Class<GetConnectPeerRequest>(
  "GetConnectPeerRequest",
)(
  { ConnectPeerId: S.String.pipe(T.HttpLabel("ConnectPeerId")) },
  T.all(
    T.Http({ method: "GET", uri: "/connect-peers/{ConnectPeerId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectPeerAssociationsRequest extends S.Class<GetConnectPeerAssociationsRequest>(
  "GetConnectPeerAssociationsRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectPeerIds: S.optional(ConnectPeerIdList).pipe(
      T.HttpQuery("connectPeerIds"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/connect-peer-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCoreNetworkRequest extends S.Class<GetCoreNetworkRequest>(
  "GetCoreNetworkRequest",
)(
  { CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")) },
  T.all(
    T.Http({ method: "GET", uri: "/core-networks/{CoreNetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCoreNetworkChangeEventsRequest extends S.Class<GetCoreNetworkChangeEventsRequest>(
  "GetCoreNetworkChangeEventsRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/core-networks/{CoreNetworkId}/core-network-change-events/{PolicyVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCoreNetworkChangeSetRequest extends S.Class<GetCoreNetworkChangeSetRequest>(
  "GetCoreNetworkChangeSetRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/core-networks/{CoreNetworkId}/core-network-change-sets/{PolicyVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCoreNetworkPolicyRequest extends S.Class<GetCoreNetworkPolicyRequest>(
  "GetCoreNetworkPolicyRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.optional(S.Number).pipe(T.HttpQuery("policyVersionId")),
    Alias: S.optional(S.String).pipe(T.HttpQuery("alias")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/core-networks/{CoreNetworkId}/core-network-policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCustomerGatewayAssociationsRequest extends S.Class<GetCustomerGatewayAssociationsRequest>(
  "GetCustomerGatewayAssociationsRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    CustomerGatewayArns: S.optional(CustomerGatewayArnList).pipe(
      T.HttpQuery("customerGatewayArns"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/customer-gateway-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDevicesRequest extends S.Class<GetDevicesRequest>(
  "GetDevicesRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceIds: S.optional(DeviceIdList).pipe(T.HttpQuery("deviceIds")),
    SiteId: S.optional(S.String).pipe(T.HttpQuery("siteId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/devices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDirectConnectGatewayAttachmentRequest extends S.Class<GetDirectConnectGatewayAttachmentRequest>(
  "GetDirectConnectGatewayAttachmentRequest",
)(
  { AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/direct-connect-gateway-attachments/{AttachmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLinkAssociationsRequest extends S.Class<GetLinkAssociationsRequest>(
  "GetLinkAssociationsRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.optional(S.String).pipe(T.HttpQuery("deviceId")),
    LinkId: S.optional(S.String).pipe(T.HttpQuery("linkId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/link-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLinksRequest extends S.Class<GetLinksRequest>(
  "GetLinksRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    LinkIds: S.optional(LinkIdList).pipe(T.HttpQuery("linkIds")),
    SiteId: S.optional(S.String).pipe(T.HttpQuery("siteId")),
    Type: S.optional(S.String).pipe(T.HttpQuery("type")),
    Provider: S.optional(S.String).pipe(T.HttpQuery("provider")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/global-networks/{GlobalNetworkId}/links" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNetworkResourceCountsRequest extends S.Class<GetNetworkResourceCountsRequest>(
  "GetNetworkResourceCountsRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/network-resource-count",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNetworkResourceRelationshipsRequest extends S.Class<GetNetworkResourceRelationshipsRequest>(
  "GetNetworkResourceRelationshipsRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    CoreNetworkId: S.optional(S.String).pipe(T.HttpQuery("coreNetworkId")),
    RegisteredGatewayArn: S.optional(S.String).pipe(
      T.HttpQuery("registeredGatewayArn"),
    ),
    AwsRegion: S.optional(S.String).pipe(T.HttpQuery("awsRegion")),
    AccountId: S.optional(S.String).pipe(T.HttpQuery("accountId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    ResourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/network-resource-relationships",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNetworkResourcesRequest extends S.Class<GetNetworkResourcesRequest>(
  "GetNetworkResourcesRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    CoreNetworkId: S.optional(S.String).pipe(T.HttpQuery("coreNetworkId")),
    RegisteredGatewayArn: S.optional(S.String).pipe(
      T.HttpQuery("registeredGatewayArn"),
    ),
    AwsRegion: S.optional(S.String).pipe(T.HttpQuery("awsRegion")),
    AccountId: S.optional(S.String).pipe(T.HttpQuery("accountId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    ResourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/network-resources",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNetworkTelemetryRequest extends S.Class<GetNetworkTelemetryRequest>(
  "GetNetworkTelemetryRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    CoreNetworkId: S.optional(S.String).pipe(T.HttpQuery("coreNetworkId")),
    RegisteredGatewayArn: S.optional(S.String).pipe(
      T.HttpQuery("registeredGatewayArn"),
    ),
    AwsRegion: S.optional(S.String).pipe(T.HttpQuery("awsRegion")),
    AccountId: S.optional(S.String).pipe(T.HttpQuery("accountId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    ResourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/network-telemetry",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/resource-policy/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouteAnalysisRequest extends S.Class<GetRouteAnalysisRequest>(
  "GetRouteAnalysisRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    RouteAnalysisId: S.String.pipe(T.HttpLabel("RouteAnalysisId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/route-analyses/{RouteAnalysisId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSitesRequest extends S.Class<GetSitesRequest>(
  "GetSitesRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    SiteIds: S.optional(SiteIdList).pipe(T.HttpQuery("siteIds")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/global-networks/{GlobalNetworkId}/sites" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSiteToSiteVpnAttachmentRequest extends S.Class<GetSiteToSiteVpnAttachmentRequest>(
  "GetSiteToSiteVpnAttachmentRequest",
)(
  { AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/site-to-site-vpn-attachments/{AttachmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTransitGatewayConnectPeerAssociationsRequest extends S.Class<GetTransitGatewayConnectPeerAssociationsRequest>(
  "GetTransitGatewayConnectPeerAssociationsRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayConnectPeerArns: S.optional(
      TransitGatewayConnectPeerArnList,
    ).pipe(T.HttpQuery("transitGatewayConnectPeerArns")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/transit-gateway-connect-peer-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTransitGatewayPeeringRequest extends S.Class<GetTransitGatewayPeeringRequest>(
  "GetTransitGatewayPeeringRequest",
)(
  { PeeringId: S.String.pipe(T.HttpLabel("PeeringId")) },
  T.all(
    T.Http({ method: "GET", uri: "/transit-gateway-peerings/{PeeringId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTransitGatewayRegistrationsRequest extends S.Class<GetTransitGatewayRegistrationsRequest>(
  "GetTransitGatewayRegistrationsRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayArns: S.optional(TransitGatewayArnList).pipe(
      T.HttpQuery("transitGatewayArns"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/global-networks/{GlobalNetworkId}/transit-gateway-registrations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTransitGatewayRouteTableAttachmentRequest extends S.Class<GetTransitGatewayRouteTableAttachmentRequest>(
  "GetTransitGatewayRouteTableAttachmentRequest",
)(
  { AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/transit-gateway-route-table-attachments/{AttachmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVpcAttachmentRequest extends S.Class<GetVpcAttachmentRequest>(
  "GetVpcAttachmentRequest",
)(
  { AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) },
  T.all(
    T.Http({ method: "GET", uri: "/vpc-attachments/{AttachmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAttachmentRoutingPolicyAssociationsRequest extends S.Class<ListAttachmentRoutingPolicyAssociationsRequest>(
  "ListAttachmentRoutingPolicyAssociationsRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    AttachmentId: S.optional(S.String).pipe(T.HttpQuery("attachmentId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/routing-policy-label/core-network/{CoreNetworkId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAttachmentsRequest extends S.Class<ListAttachmentsRequest>(
  "ListAttachmentsRequest",
)(
  {
    CoreNetworkId: S.optional(S.String).pipe(T.HttpQuery("coreNetworkId")),
    AttachmentType: S.optional(S.String).pipe(T.HttpQuery("attachmentType")),
    EdgeLocation: S.optional(S.String).pipe(T.HttpQuery("edgeLocation")),
    State: S.optional(S.String).pipe(T.HttpQuery("state")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/attachments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectPeersRequest extends S.Class<ListConnectPeersRequest>(
  "ListConnectPeersRequest",
)(
  {
    CoreNetworkId: S.optional(S.String).pipe(T.HttpQuery("coreNetworkId")),
    ConnectAttachmentId: S.optional(S.String).pipe(
      T.HttpQuery("connectAttachmentId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/connect-peers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCoreNetworkPolicyVersionsRequest extends S.Class<ListCoreNetworkPolicyVersionsRequest>(
  "ListCoreNetworkPolicyVersionsRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/core-networks/{CoreNetworkId}/core-network-policy-versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCoreNetworkPrefixListAssociationsRequest extends S.Class<ListCoreNetworkPrefixListAssociationsRequest>(
  "ListCoreNetworkPrefixListAssociationsRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PrefixListArn: S.optional(S.String).pipe(T.HttpQuery("prefixListArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prefix-list/core-network/{CoreNetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FilterValues = S.Array(S.String);
export const FilterMap = S.Record({ key: S.String, value: FilterValues });
export class ListCoreNetworkRoutingInformationRequest extends S.Class<ListCoreNetworkRoutingInformationRequest>(
  "ListCoreNetworkRoutingInformationRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    SegmentName: S.String,
    EdgeLocation: S.String,
    NextHopFilters: S.optional(FilterMap),
    LocalPreferenceMatches: S.optional(ConstrainedStringList),
    ExactAsPathMatches: S.optional(ConstrainedStringList),
    MedMatches: S.optional(ConstrainedStringList),
    CommunityMatches: S.optional(ConstrainedStringList),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/core-networks/{CoreNetworkId}/core-network-routing-information",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCoreNetworksRequest extends S.Class<ListCoreNetworksRequest>(
  "ListCoreNetworksRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/core-networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOrganizationServiceAccessStatusRequest extends S.Class<ListOrganizationServiceAccessStatusRequest>(
  "ListOrganizationServiceAccessStatusRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/organizations/service-access" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPeeringsRequest extends S.Class<ListPeeringsRequest>(
  "ListPeeringsRequest",
)(
  {
    CoreNetworkId: S.optional(S.String).pipe(T.HttpQuery("coreNetworkId")),
    PeeringType: S.optional(S.String).pipe(T.HttpQuery("peeringType")),
    EdgeLocation: S.optional(S.String).pipe(T.HttpQuery("edgeLocation")),
    State: S.optional(S.String).pipe(T.HttpQuery("state")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/peerings" }),
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
export class PutAttachmentRoutingPolicyLabelRequest extends S.Class<PutAttachmentRoutingPolicyLabelRequest>(
  "PutAttachmentRoutingPolicyLabelRequest",
)(
  {
    CoreNetworkId: S.String,
    AttachmentId: S.String,
    RoutingPolicyLabel: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/routing-policy-label" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutCoreNetworkPolicyRequest extends S.Class<PutCoreNetworkPolicyRequest>(
  "PutCoreNetworkPolicyRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyDocument: S.String,
    Description: S.optional(S.String),
    LatestVersionId: S.optional(S.Number),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/core-networks/{CoreNetworkId}/core-network-policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  {
    PolicyDocument: S.String,
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resource-policy/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({}) {}
export class RegisterTransitGatewayRequest extends S.Class<RegisterTransitGatewayRequest>(
  "RegisterTransitGatewayRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayArn: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/global-networks/{GlobalNetworkId}/transit-gateway-registrations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectAttachmentRequest extends S.Class<RejectAttachmentRequest>(
  "RejectAttachmentRequest",
)(
  { AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) },
  T.all(
    T.Http({ method: "POST", uri: "/attachments/{AttachmentId}/reject" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveAttachmentRoutingPolicyLabelRequest extends S.Class<RemoveAttachmentRoutingPolicyLabelRequest>(
  "RemoveAttachmentRoutingPolicyLabelRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/routing-policy-label/core-network/{CoreNetworkId}/attachment/{AttachmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestoreCoreNetworkPolicyVersionRequest extends S.Class<RestoreCoreNetworkPolicyVersionRequest>(
  "RestoreCoreNetworkPolicyVersionRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/core-networks/{CoreNetworkId}/core-network-policy-versions/{PolicyVersionId}/restore",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartOrganizationServiceAccessUpdateRequest extends S.Class<StartOrganizationServiceAccessUpdateRequest>(
  "StartOrganizationServiceAccessUpdateRequest",
)(
  { Action: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/organizations/service-access" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagList },
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
export class UpdateConnectionRequest extends S.Class<UpdateConnectionRequest>(
  "UpdateConnectionRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")),
    LinkId: S.optional(S.String),
    ConnectedLinkId: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/global-networks/{GlobalNetworkId}/connections/{ConnectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCoreNetworkRequest extends S.Class<UpdateCoreNetworkRequest>(
  "UpdateCoreNetworkRequest",
)(
  {
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/core-networks/{CoreNetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AWSLocation extends S.Class<AWSLocation>("AWSLocation")({
  Zone: S.optional(S.String),
  SubnetArn: S.optional(S.String),
}) {}
export class UpdateDeviceRequest extends S.Class<UpdateDeviceRequest>(
  "UpdateDeviceRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
    AWSLocation: S.optional(AWSLocation),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    Vendor: S.optional(S.String),
    Model: S.optional(S.String),
    SerialNumber: S.optional(S.String),
    Location: S.optional(Location),
    SiteId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/global-networks/{GlobalNetworkId}/devices/{DeviceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDirectConnectGatewayAttachmentRequest extends S.Class<UpdateDirectConnectGatewayAttachmentRequest>(
  "UpdateDirectConnectGatewayAttachmentRequest",
)(
  {
    AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")),
    EdgeLocations: S.optional(ExternalRegionCodeList),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/direct-connect-gateway-attachments/{AttachmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGlobalNetworkRequest extends S.Class<UpdateGlobalNetworkRequest>(
  "UpdateGlobalNetworkRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/global-networks/{GlobalNetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Bandwidth extends S.Class<Bandwidth>("Bandwidth")({
  UploadSpeed: S.optional(S.Number),
  DownloadSpeed: S.optional(S.Number),
}) {}
export class UpdateLinkRequest extends S.Class<UpdateLinkRequest>(
  "UpdateLinkRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    LinkId: S.String.pipe(T.HttpLabel("LinkId")),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    Bandwidth: S.optional(Bandwidth),
    Provider: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/global-networks/{GlobalNetworkId}/links/{LinkId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSiteRequest extends S.Class<UpdateSiteRequest>(
  "UpdateSiteRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    SiteId: S.String.pipe(T.HttpLabel("SiteId")),
    Description: S.optional(S.String),
    Location: S.optional(Location),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/global-networks/{GlobalNetworkId}/sites/{SiteId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VpcOptions extends S.Class<VpcOptions>("VpcOptions")({
  Ipv6Support: S.optional(S.Boolean),
  ApplianceModeSupport: S.optional(S.Boolean),
  DnsSupport: S.optional(S.Boolean),
  SecurityGroupReferencingSupport: S.optional(S.Boolean),
}) {}
export class UpdateVpcAttachmentRequest extends S.Class<UpdateVpcAttachmentRequest>(
  "UpdateVpcAttachmentRequest",
)(
  {
    AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")),
    AddSubnetArns: S.optional(SubnetArnList),
    RemoveSubnetArns: S.optional(SubnetArnList),
    Options: S.optional(VpcOptions),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/vpc-attachments/{AttachmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ConnectAttachmentOptions extends S.Class<ConnectAttachmentOptions>(
  "ConnectAttachmentOptions",
)({ Protocol: S.optional(S.String) }) {}
export class BgpOptions extends S.Class<BgpOptions>("BgpOptions")({
  PeerAsn: S.optional(S.Number),
}) {}
export class GlobalNetwork extends S.Class<GlobalNetwork>("GlobalNetwork")({
  GlobalNetworkId: S.optional(S.String),
  GlobalNetworkArn: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const GlobalNetworkList = S.Array(GlobalNetwork);
export class Connection extends S.Class<Connection>("Connection")({
  ConnectionId: S.optional(S.String),
  ConnectionArn: S.optional(S.String),
  GlobalNetworkId: S.optional(S.String),
  DeviceId: S.optional(S.String),
  ConnectedDeviceId: S.optional(S.String),
  LinkId: S.optional(S.String),
  ConnectedLinkId: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const ConnectionList = S.Array(Connection);
export class ConnectPeerAssociation extends S.Class<ConnectPeerAssociation>(
  "ConnectPeerAssociation",
)({
  ConnectPeerId: S.optional(S.String),
  GlobalNetworkId: S.optional(S.String),
  DeviceId: S.optional(S.String),
  LinkId: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const ConnectPeerAssociationList = S.Array(ConnectPeerAssociation);
export class CustomerGatewayAssociation extends S.Class<CustomerGatewayAssociation>(
  "CustomerGatewayAssociation",
)({
  CustomerGatewayArn: S.optional(S.String),
  GlobalNetworkId: S.optional(S.String),
  DeviceId: S.optional(S.String),
  LinkId: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const CustomerGatewayAssociationList = S.Array(
  CustomerGatewayAssociation,
);
export class Device extends S.Class<Device>("Device")({
  DeviceId: S.optional(S.String),
  DeviceArn: S.optional(S.String),
  GlobalNetworkId: S.optional(S.String),
  AWSLocation: S.optional(AWSLocation),
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  Vendor: S.optional(S.String),
  Model: S.optional(S.String),
  SerialNumber: S.optional(S.String),
  Location: S.optional(Location),
  SiteId: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const DeviceList = S.Array(Device);
export class LinkAssociation extends S.Class<LinkAssociation>(
  "LinkAssociation",
)({
  GlobalNetworkId: S.optional(S.String),
  DeviceId: S.optional(S.String),
  LinkId: S.optional(S.String),
  LinkAssociationState: S.optional(S.String),
}) {}
export const LinkAssociationList = S.Array(LinkAssociation);
export class Link extends S.Class<Link>("Link")({
  LinkId: S.optional(S.String),
  LinkArn: S.optional(S.String),
  GlobalNetworkId: S.optional(S.String),
  SiteId: S.optional(S.String),
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  Bandwidth: S.optional(Bandwidth),
  Provider: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const LinkList = S.Array(Link);
export class Site extends S.Class<Site>("Site")({
  SiteId: S.optional(S.String),
  SiteArn: S.optional(S.String),
  GlobalNetworkId: S.optional(S.String),
  Description: S.optional(S.String),
  Location: S.optional(Location),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const SiteList = S.Array(Site);
export class TransitGatewayConnectPeerAssociation extends S.Class<TransitGatewayConnectPeerAssociation>(
  "TransitGatewayConnectPeerAssociation",
)({
  TransitGatewayConnectPeerArn: S.optional(S.String),
  GlobalNetworkId: S.optional(S.String),
  DeviceId: S.optional(S.String),
  LinkId: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const TransitGatewayConnectPeerAssociationList = S.Array(
  TransitGatewayConnectPeerAssociation,
);
export class TransitGatewayRegistrationStateReason extends S.Class<TransitGatewayRegistrationStateReason>(
  "TransitGatewayRegistrationStateReason",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class TransitGatewayRegistration extends S.Class<TransitGatewayRegistration>(
  "TransitGatewayRegistration",
)({
  GlobalNetworkId: S.optional(S.String),
  TransitGatewayArn: S.optional(S.String),
  State: S.optional(TransitGatewayRegistrationStateReason),
}) {}
export const TransitGatewayRegistrationList = S.Array(
  TransitGatewayRegistration,
);
export class ProposedSegmentChange extends S.Class<ProposedSegmentChange>(
  "ProposedSegmentChange",
)({
  Tags: S.optional(TagList),
  AttachmentPolicyRuleNumber: S.optional(S.Number),
  SegmentName: S.optional(S.String),
}) {}
export class ProposedNetworkFunctionGroupChange extends S.Class<ProposedNetworkFunctionGroupChange>(
  "ProposedNetworkFunctionGroupChange",
)({
  Tags: S.optional(TagList),
  AttachmentPolicyRuleNumber: S.optional(S.Number),
  NetworkFunctionGroupName: S.optional(S.String),
}) {}
export class AttachmentError extends S.Class<AttachmentError>(
  "AttachmentError",
)({
  Code: S.optional(S.String),
  Message: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export const AttachmentErrorList = S.Array(AttachmentError);
export class Attachment extends S.Class<Attachment>("Attachment")({
  CoreNetworkId: S.optional(S.String),
  CoreNetworkArn: S.optional(S.String),
  AttachmentId: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  AttachmentType: S.optional(S.String),
  State: S.optional(S.String),
  EdgeLocation: S.optional(S.String),
  EdgeLocations: S.optional(ExternalRegionCodeList),
  ResourceArn: S.optional(S.String),
  AttachmentPolicyRuleNumber: S.optional(S.Number),
  SegmentName: S.optional(S.String),
  NetworkFunctionGroupName: S.optional(S.String),
  Tags: S.optional(TagList),
  ProposedSegmentChange: S.optional(ProposedSegmentChange),
  ProposedNetworkFunctionGroupChange: S.optional(
    ProposedNetworkFunctionGroupChange,
  ),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationErrors: S.optional(AttachmentErrorList),
}) {}
export const AttachmentList = S.Array(Attachment);
export class PermissionsErrorContext extends S.Class<PermissionsErrorContext>(
  "PermissionsErrorContext",
)({ MissingPermission: S.optional(S.String) }) {}
export class PeeringError extends S.Class<PeeringError>("PeeringError")({
  Code: S.optional(S.String),
  Message: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  RequestId: S.optional(S.String),
  MissingPermissionsContext: S.optional(PermissionsErrorContext),
}) {}
export const PeeringErrorList = S.Array(PeeringError);
export class Peering extends S.Class<Peering>("Peering")({
  CoreNetworkId: S.optional(S.String),
  CoreNetworkArn: S.optional(S.String),
  PeeringId: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  PeeringType: S.optional(S.String),
  State: S.optional(S.String),
  EdgeLocation: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  Tags: S.optional(TagList),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationErrors: S.optional(PeeringErrorList),
}) {}
export const PeeringList = S.Array(Peering);
export class RouteAnalysisEndpointOptionsSpecification extends S.Class<RouteAnalysisEndpointOptionsSpecification>(
  "RouteAnalysisEndpointOptionsSpecification",
)({
  TransitGatewayAttachmentArn: S.optional(S.String),
  IpAddress: S.optional(S.String),
}) {}
export const NetworkResourceMetadataMap = S.Record({
  key: S.String,
  value: S.String,
});
export class CreateConnectAttachmentRequest extends S.Class<CreateConnectAttachmentRequest>(
  "CreateConnectAttachmentRequest",
)(
  {
    CoreNetworkId: S.String,
    EdgeLocation: S.String,
    TransportAttachmentId: S.String,
    RoutingPolicyLabel: S.optional(S.String),
    Options: ConnectAttachmentOptions,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/connect-attachments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConnectPeerRequest extends S.Class<CreateConnectPeerRequest>(
  "CreateConnectPeerRequest",
)(
  {
    ConnectAttachmentId: S.String,
    CoreNetworkAddress: S.optional(S.String),
    PeerAddress: S.String,
    BgpOptions: S.optional(BgpOptions),
    InsideCidrBlocks: S.optional(ConstrainedStringList),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
    SubnetArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/connect-peers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCoreNetworkPrefixListAssociationResponse extends S.Class<CreateCoreNetworkPrefixListAssociationResponse>(
  "CreateCoreNetworkPrefixListAssociationResponse",
)({
  CoreNetworkId: S.optional(S.String),
  PrefixListArn: S.optional(S.String),
  PrefixListAlias: S.optional(S.String),
}) {}
export class CreateDeviceRequest extends S.Class<CreateDeviceRequest>(
  "CreateDeviceRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    AWSLocation: S.optional(AWSLocation),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    Vendor: S.optional(S.String),
    Model: S.optional(S.String),
    SerialNumber: S.optional(S.String),
    Location: S.optional(Location),
    SiteId: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/global-networks/{GlobalNetworkId}/devices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLinkRequest extends S.Class<CreateLinkRequest>(
  "CreateLinkRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    Bandwidth: Bandwidth,
    Provider: S.optional(S.String),
    SiteId: S.String,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/global-networks/{GlobalNetworkId}/links" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVpcAttachmentRequest extends S.Class<CreateVpcAttachmentRequest>(
  "CreateVpcAttachmentRequest",
)(
  {
    CoreNetworkId: S.String,
    VpcArn: S.String,
    SubnetArns: SubnetArnList,
    Options: S.optional(VpcOptions),
    RoutingPolicyLabel: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/vpc-attachments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAttachmentResponse extends S.Class<DeleteAttachmentResponse>(
  "DeleteAttachmentResponse",
)({ Attachment: S.optional(Attachment) }) {}
export class DeleteConnectionResponse extends S.Class<DeleteConnectionResponse>(
  "DeleteConnectionResponse",
)({ Connection: S.optional(Connection) }) {}
export class CoreNetworkSegment extends S.Class<CoreNetworkSegment>(
  "CoreNetworkSegment",
)({
  Name: S.optional(S.String),
  EdgeLocations: S.optional(ExternalRegionCodeList),
  SharedSegments: S.optional(ConstrainedStringList),
}) {}
export const CoreNetworkSegmentList = S.Array(CoreNetworkSegment);
export class ServiceInsertionSegments extends S.Class<ServiceInsertionSegments>(
  "ServiceInsertionSegments",
)({
  SendVia: S.optional(ConstrainedStringList),
  SendTo: S.optional(ConstrainedStringList),
}) {}
export class CoreNetworkNetworkFunctionGroup extends S.Class<CoreNetworkNetworkFunctionGroup>(
  "CoreNetworkNetworkFunctionGroup",
)({
  Name: S.optional(S.String),
  EdgeLocations: S.optional(ExternalRegionCodeList),
  Segments: S.optional(ServiceInsertionSegments),
}) {}
export const CoreNetworkNetworkFunctionGroupList = S.Array(
  CoreNetworkNetworkFunctionGroup,
);
export class CoreNetworkEdge extends S.Class<CoreNetworkEdge>(
  "CoreNetworkEdge",
)({
  EdgeLocation: S.optional(S.String),
  Asn: S.optional(S.Number),
  InsideCidrBlocks: S.optional(ConstrainedStringList),
}) {}
export const CoreNetworkEdgeList = S.Array(CoreNetworkEdge);
export class CoreNetwork extends S.Class<CoreNetwork>("CoreNetwork")({
  GlobalNetworkId: S.optional(S.String),
  CoreNetworkId: S.optional(S.String),
  CoreNetworkArn: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  Segments: S.optional(CoreNetworkSegmentList),
  NetworkFunctionGroups: S.optional(CoreNetworkNetworkFunctionGroupList),
  Edges: S.optional(CoreNetworkEdgeList),
  Tags: S.optional(TagList),
}) {}
export class DeleteCoreNetworkResponse extends S.Class<DeleteCoreNetworkResponse>(
  "DeleteCoreNetworkResponse",
)({ CoreNetwork: S.optional(CoreNetwork) }) {}
export class DeleteCoreNetworkPrefixListAssociationResponse extends S.Class<DeleteCoreNetworkPrefixListAssociationResponse>(
  "DeleteCoreNetworkPrefixListAssociationResponse",
)({
  CoreNetworkId: S.optional(S.String),
  PrefixListArn: S.optional(S.String),
}) {}
export class DeleteGlobalNetworkResponse extends S.Class<DeleteGlobalNetworkResponse>(
  "DeleteGlobalNetworkResponse",
)({ GlobalNetwork: S.optional(GlobalNetwork) }) {}
export class DeleteSiteResponse extends S.Class<DeleteSiteResponse>(
  "DeleteSiteResponse",
)({ Site: S.optional(Site) }) {}
export class DescribeGlobalNetworksResponse extends S.Class<DescribeGlobalNetworksResponse>(
  "DescribeGlobalNetworksResponse",
)({
  GlobalNetworks: S.optional(GlobalNetworkList),
  NextToken: S.optional(S.String),
}) {}
export class DisassociateConnectPeerResponse extends S.Class<DisassociateConnectPeerResponse>(
  "DisassociateConnectPeerResponse",
)({ ConnectPeerAssociation: S.optional(ConnectPeerAssociation) }) {}
export class DisassociateCustomerGatewayResponse extends S.Class<DisassociateCustomerGatewayResponse>(
  "DisassociateCustomerGatewayResponse",
)({ CustomerGatewayAssociation: S.optional(CustomerGatewayAssociation) }) {}
export class DisassociateLinkResponse extends S.Class<DisassociateLinkResponse>(
  "DisassociateLinkResponse",
)({ LinkAssociation: S.optional(LinkAssociation) }) {}
export class DisassociateTransitGatewayConnectPeerResponse extends S.Class<DisassociateTransitGatewayConnectPeerResponse>(
  "DisassociateTransitGatewayConnectPeerResponse",
)({
  TransitGatewayConnectPeerAssociation: S.optional(
    TransitGatewayConnectPeerAssociation,
  ),
}) {}
export class GetConnectionsResponse extends S.Class<GetConnectionsResponse>(
  "GetConnectionsResponse",
)({
  Connections: S.optional(ConnectionList),
  NextToken: S.optional(S.String),
}) {}
export class ConnectPeerBgpConfiguration extends S.Class<ConnectPeerBgpConfiguration>(
  "ConnectPeerBgpConfiguration",
)({
  CoreNetworkAsn: S.optional(S.Number),
  PeerAsn: S.optional(S.Number),
  CoreNetworkAddress: S.optional(S.String),
  PeerAddress: S.optional(S.String),
}) {}
export const ConnectPeerBgpConfigurationList = S.Array(
  ConnectPeerBgpConfiguration,
);
export class ConnectPeerConfiguration extends S.Class<ConnectPeerConfiguration>(
  "ConnectPeerConfiguration",
)({
  CoreNetworkAddress: S.optional(S.String),
  PeerAddress: S.optional(S.String),
  InsideCidrBlocks: S.optional(ConstrainedStringList),
  Protocol: S.optional(S.String),
  BgpConfigurations: S.optional(ConnectPeerBgpConfigurationList),
}) {}
export class ConnectPeerError extends S.Class<ConnectPeerError>(
  "ConnectPeerError",
)({
  Code: S.optional(S.String),
  Message: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export const ConnectPeerErrorList = S.Array(ConnectPeerError);
export class ConnectPeer extends S.Class<ConnectPeer>("ConnectPeer")({
  CoreNetworkId: S.optional(S.String),
  ConnectAttachmentId: S.optional(S.String),
  ConnectPeerId: S.optional(S.String),
  EdgeLocation: S.optional(S.String),
  State: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Configuration: S.optional(ConnectPeerConfiguration),
  Tags: S.optional(TagList),
  SubnetArn: S.optional(S.String),
  LastModificationErrors: S.optional(ConnectPeerErrorList),
}) {}
export class GetConnectPeerResponse extends S.Class<GetConnectPeerResponse>(
  "GetConnectPeerResponse",
)({ ConnectPeer: S.optional(ConnectPeer) }) {}
export class GetConnectPeerAssociationsResponse extends S.Class<GetConnectPeerAssociationsResponse>(
  "GetConnectPeerAssociationsResponse",
)({
  ConnectPeerAssociations: S.optional(ConnectPeerAssociationList),
  NextToken: S.optional(S.String),
}) {}
export class GetCoreNetworkResponse extends S.Class<GetCoreNetworkResponse>(
  "GetCoreNetworkResponse",
)({ CoreNetwork: S.optional(CoreNetwork) }) {}
export class CoreNetworkPolicyError extends S.Class<CoreNetworkPolicyError>(
  "CoreNetworkPolicyError",
)({ ErrorCode: S.String, Message: S.String, Path: S.optional(S.String) }) {}
export const CoreNetworkPolicyErrorList = S.Array(CoreNetworkPolicyError);
export class CoreNetworkPolicy extends S.Class<CoreNetworkPolicy>(
  "CoreNetworkPolicy",
)({
  CoreNetworkId: S.optional(S.String),
  PolicyVersionId: S.optional(S.Number),
  Alias: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ChangeSetState: S.optional(S.String),
  PolicyErrors: S.optional(CoreNetworkPolicyErrorList),
  PolicyDocument: S.optional(S.String),
}) {}
export class GetCoreNetworkPolicyResponse extends S.Class<GetCoreNetworkPolicyResponse>(
  "GetCoreNetworkPolicyResponse",
)({ CoreNetworkPolicy: S.optional(CoreNetworkPolicy) }) {}
export class GetCustomerGatewayAssociationsResponse extends S.Class<GetCustomerGatewayAssociationsResponse>(
  "GetCustomerGatewayAssociationsResponse",
)({
  CustomerGatewayAssociations: S.optional(CustomerGatewayAssociationList),
  NextToken: S.optional(S.String),
}) {}
export class GetDevicesResponse extends S.Class<GetDevicesResponse>(
  "GetDevicesResponse",
)({ Devices: S.optional(DeviceList), NextToken: S.optional(S.String) }) {}
export class DirectConnectGatewayAttachment extends S.Class<DirectConnectGatewayAttachment>(
  "DirectConnectGatewayAttachment",
)({
  Attachment: S.optional(Attachment),
  DirectConnectGatewayArn: S.optional(S.String),
}) {}
export class GetDirectConnectGatewayAttachmentResponse extends S.Class<GetDirectConnectGatewayAttachmentResponse>(
  "GetDirectConnectGatewayAttachmentResponse",
)({
  DirectConnectGatewayAttachment: S.optional(DirectConnectGatewayAttachment),
}) {}
export class GetLinkAssociationsResponse extends S.Class<GetLinkAssociationsResponse>(
  "GetLinkAssociationsResponse",
)({
  LinkAssociations: S.optional(LinkAssociationList),
  NextToken: S.optional(S.String),
}) {}
export class GetLinksResponse extends S.Class<GetLinksResponse>(
  "GetLinksResponse",
)({ Links: S.optional(LinkList), NextToken: S.optional(S.String) }) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ PolicyDocument: S.optional(S.String) }) {}
export class GetSitesResponse extends S.Class<GetSitesResponse>(
  "GetSitesResponse",
)({ Sites: S.optional(SiteList), NextToken: S.optional(S.String) }) {}
export class SiteToSiteVpnAttachment extends S.Class<SiteToSiteVpnAttachment>(
  "SiteToSiteVpnAttachment",
)({
  Attachment: S.optional(Attachment),
  VpnConnectionArn: S.optional(S.String),
}) {}
export class GetSiteToSiteVpnAttachmentResponse extends S.Class<GetSiteToSiteVpnAttachmentResponse>(
  "GetSiteToSiteVpnAttachmentResponse",
)({ SiteToSiteVpnAttachment: S.optional(SiteToSiteVpnAttachment) }) {}
export class GetTransitGatewayConnectPeerAssociationsResponse extends S.Class<GetTransitGatewayConnectPeerAssociationsResponse>(
  "GetTransitGatewayConnectPeerAssociationsResponse",
)({
  TransitGatewayConnectPeerAssociations: S.optional(
    TransitGatewayConnectPeerAssociationList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class TransitGatewayPeering extends S.Class<TransitGatewayPeering>(
  "TransitGatewayPeering",
)({
  Peering: S.optional(Peering),
  TransitGatewayArn: S.optional(S.String),
  TransitGatewayPeeringAttachmentId: S.optional(S.String),
}) {}
export class GetTransitGatewayPeeringResponse extends S.Class<GetTransitGatewayPeeringResponse>(
  "GetTransitGatewayPeeringResponse",
)({ TransitGatewayPeering: S.optional(TransitGatewayPeering) }) {}
export class GetTransitGatewayRegistrationsResponse extends S.Class<GetTransitGatewayRegistrationsResponse>(
  "GetTransitGatewayRegistrationsResponse",
)({
  TransitGatewayRegistrations: S.optional(TransitGatewayRegistrationList),
  NextToken: S.optional(S.String),
}) {}
export class TransitGatewayRouteTableAttachment extends S.Class<TransitGatewayRouteTableAttachment>(
  "TransitGatewayRouteTableAttachment",
)({
  Attachment: S.optional(Attachment),
  PeeringId: S.optional(S.String),
  TransitGatewayRouteTableArn: S.optional(S.String),
}) {}
export class GetTransitGatewayRouteTableAttachmentResponse extends S.Class<GetTransitGatewayRouteTableAttachmentResponse>(
  "GetTransitGatewayRouteTableAttachmentResponse",
)({
  TransitGatewayRouteTableAttachment: S.optional(
    TransitGatewayRouteTableAttachment,
  ),
}) {}
export class ListAttachmentsResponse extends S.Class<ListAttachmentsResponse>(
  "ListAttachmentsResponse",
)({
  Attachments: S.optional(AttachmentList),
  NextToken: S.optional(S.String),
}) {}
export class ListPeeringsResponse extends S.Class<ListPeeringsResponse>(
  "ListPeeringsResponse",
)({ Peerings: S.optional(PeeringList), NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ TagList: S.optional(TagList) }) {}
export class PutAttachmentRoutingPolicyLabelResponse extends S.Class<PutAttachmentRoutingPolicyLabelResponse>(
  "PutAttachmentRoutingPolicyLabelResponse",
)({
  CoreNetworkId: S.optional(S.String),
  AttachmentId: S.optional(S.String),
  RoutingPolicyLabel: S.optional(S.String),
}) {}
export class PutCoreNetworkPolicyResponse extends S.Class<PutCoreNetworkPolicyResponse>(
  "PutCoreNetworkPolicyResponse",
)({ CoreNetworkPolicy: S.optional(CoreNetworkPolicy) }) {}
export class RegisterTransitGatewayResponse extends S.Class<RegisterTransitGatewayResponse>(
  "RegisterTransitGatewayResponse",
)({ TransitGatewayRegistration: S.optional(TransitGatewayRegistration) }) {}
export class RejectAttachmentResponse extends S.Class<RejectAttachmentResponse>(
  "RejectAttachmentResponse",
)({ Attachment: S.optional(Attachment) }) {}
export class RemoveAttachmentRoutingPolicyLabelResponse extends S.Class<RemoveAttachmentRoutingPolicyLabelResponse>(
  "RemoveAttachmentRoutingPolicyLabelResponse",
)({
  CoreNetworkId: S.optional(S.String),
  AttachmentId: S.optional(S.String),
  RoutingPolicyLabel: S.optional(S.String),
}) {}
export class RestoreCoreNetworkPolicyVersionResponse extends S.Class<RestoreCoreNetworkPolicyVersionResponse>(
  "RestoreCoreNetworkPolicyVersionResponse",
)({ CoreNetworkPolicy: S.optional(CoreNetworkPolicy) }) {}
export class AccountStatus extends S.Class<AccountStatus>("AccountStatus")({
  AccountId: S.optional(S.String),
  SLRDeploymentStatus: S.optional(S.String),
}) {}
export const AccountStatusList = S.Array(AccountStatus);
export class OrganizationStatus extends S.Class<OrganizationStatus>(
  "OrganizationStatus",
)({
  OrganizationId: S.optional(S.String),
  OrganizationAwsServiceAccessStatus: S.optional(S.String),
  SLRDeploymentStatus: S.optional(S.String),
  AccountStatusList: S.optional(AccountStatusList).pipe(
    T.XmlName("OrganizationStatus"),
  ),
}) {}
export class StartOrganizationServiceAccessUpdateResponse extends S.Class<StartOrganizationServiceAccessUpdateResponse>(
  "StartOrganizationServiceAccessUpdateResponse",
)({ OrganizationStatus: S.optional(OrganizationStatus) }) {}
export class StartRouteAnalysisRequest extends S.Class<StartRouteAnalysisRequest>(
  "StartRouteAnalysisRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    Source: RouteAnalysisEndpointOptionsSpecification,
    Destination: RouteAnalysisEndpointOptionsSpecification,
    IncludeReturnPath: S.optional(S.Boolean),
    UseMiddleboxes: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/global-networks/{GlobalNetworkId}/route-analyses",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConnectionResponse extends S.Class<UpdateConnectionResponse>(
  "UpdateConnectionResponse",
)({ Connection: S.optional(Connection) }) {}
export class UpdateCoreNetworkResponse extends S.Class<UpdateCoreNetworkResponse>(
  "UpdateCoreNetworkResponse",
)({ CoreNetwork: S.optional(CoreNetwork) }) {}
export class UpdateDeviceResponse extends S.Class<UpdateDeviceResponse>(
  "UpdateDeviceResponse",
)({ Device: S.optional(Device) }) {}
export class UpdateDirectConnectGatewayAttachmentResponse extends S.Class<UpdateDirectConnectGatewayAttachmentResponse>(
  "UpdateDirectConnectGatewayAttachmentResponse",
)({
  DirectConnectGatewayAttachment: S.optional(DirectConnectGatewayAttachment),
}) {}
export class UpdateGlobalNetworkResponse extends S.Class<UpdateGlobalNetworkResponse>(
  "UpdateGlobalNetworkResponse",
)({ GlobalNetwork: S.optional(GlobalNetwork) }) {}
export class UpdateLinkResponse extends S.Class<UpdateLinkResponse>(
  "UpdateLinkResponse",
)({ Link: S.optional(Link) }) {}
export class UpdateNetworkResourceMetadataRequest extends S.Class<UpdateNetworkResourceMetadataRequest>(
  "UpdateNetworkResourceMetadataRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Metadata: NetworkResourceMetadataMap,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/global-networks/{GlobalNetworkId}/network-resources/{ResourceArn}/metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSiteResponse extends S.Class<UpdateSiteResponse>(
  "UpdateSiteResponse",
)({ Site: S.optional(Site) }) {}
export class VpcAttachment extends S.Class<VpcAttachment>("VpcAttachment")({
  Attachment: S.optional(Attachment),
  SubnetArns: S.optional(SubnetArnList),
  Options: S.optional(VpcOptions),
}) {}
export class UpdateVpcAttachmentResponse extends S.Class<UpdateVpcAttachmentResponse>(
  "UpdateVpcAttachmentResponse",
)({ VpcAttachment: S.optional(VpcAttachment) }) {}
export class CoreNetworkSegmentEdgeIdentifier extends S.Class<CoreNetworkSegmentEdgeIdentifier>(
  "CoreNetworkSegmentEdgeIdentifier",
)({
  CoreNetworkId: S.optional(S.String),
  SegmentName: S.optional(S.String),
  EdgeLocation: S.optional(S.String),
}) {}
export class CoreNetworkNetworkFunctionGroupIdentifier extends S.Class<CoreNetworkNetworkFunctionGroupIdentifier>(
  "CoreNetworkNetworkFunctionGroupIdentifier",
)({
  CoreNetworkId: S.optional(S.String),
  NetworkFunctionGroupName: S.optional(S.String),
  EdgeLocation: S.optional(S.String),
}) {}
export class ConnectAttachment extends S.Class<ConnectAttachment>(
  "ConnectAttachment",
)({
  Attachment: S.optional(Attachment),
  TransportAttachmentId: S.optional(S.String),
  Options: S.optional(ConnectAttachmentOptions),
}) {}
export class NetworkResourceCount extends S.Class<NetworkResourceCount>(
  "NetworkResourceCount",
)({ ResourceType: S.optional(S.String), Count: S.optional(S.Number) }) {}
export const NetworkResourceCountList = S.Array(NetworkResourceCount);
export class Relationship extends S.Class<Relationship>("Relationship")({
  From: S.optional(S.String),
  To: S.optional(S.String),
}) {}
export const RelationshipList = S.Array(Relationship);
export class NetworkResource extends S.Class<NetworkResource>(
  "NetworkResource",
)({
  RegisteredGatewayArn: S.optional(S.String),
  CoreNetworkId: S.optional(S.String),
  AwsRegion: S.optional(S.String),
  AccountId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  Definition: S.optional(S.String),
  DefinitionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Tags: S.optional(TagList),
  Metadata: S.optional(NetworkResourceMetadataMap),
}) {}
export const NetworkResourceList = S.Array(NetworkResource);
export class RouteTableIdentifier extends S.Class<RouteTableIdentifier>(
  "RouteTableIdentifier",
)({
  TransitGatewayRouteTableArn: S.optional(S.String),
  CoreNetworkSegmentEdge: S.optional(CoreNetworkSegmentEdgeIdentifier),
  CoreNetworkNetworkFunctionGroup: S.optional(
    CoreNetworkNetworkFunctionGroupIdentifier,
  ),
}) {}
export class AttachmentRoutingPolicyAssociationSummary extends S.Class<AttachmentRoutingPolicyAssociationSummary>(
  "AttachmentRoutingPolicyAssociationSummary",
)({
  AttachmentId: S.optional(S.String),
  PendingRoutingPolicies: S.optional(ConstrainedStringList),
  AssociatedRoutingPolicies: S.optional(ConstrainedStringList),
  RoutingPolicyLabel: S.optional(S.String),
}) {}
export const AttachmentRoutingPolicyAssociationsList = S.Array(
  AttachmentRoutingPolicyAssociationSummary,
);
export class ConnectPeerSummary extends S.Class<ConnectPeerSummary>(
  "ConnectPeerSummary",
)({
  CoreNetworkId: S.optional(S.String),
  ConnectAttachmentId: S.optional(S.String),
  ConnectPeerId: S.optional(S.String),
  EdgeLocation: S.optional(S.String),
  ConnectPeerState: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagList),
  SubnetArn: S.optional(S.String),
}) {}
export const ConnectPeerSummaryList = S.Array(ConnectPeerSummary);
export class CoreNetworkPolicyVersion extends S.Class<CoreNetworkPolicyVersion>(
  "CoreNetworkPolicyVersion",
)({
  CoreNetworkId: S.optional(S.String),
  PolicyVersionId: S.optional(S.Number),
  Alias: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ChangeSetState: S.optional(S.String),
}) {}
export const CoreNetworkPolicyVersionList = S.Array(CoreNetworkPolicyVersion);
export class PrefixListAssociation extends S.Class<PrefixListAssociation>(
  "PrefixListAssociation",
)({
  CoreNetworkId: S.optional(S.String),
  PrefixListArn: S.optional(S.String),
  PrefixListAlias: S.optional(S.String),
}) {}
export const PrefixListAssociationList = S.Array(PrefixListAssociation);
export class CoreNetworkSummary extends S.Class<CoreNetworkSummary>(
  "CoreNetworkSummary",
)({
  CoreNetworkId: S.optional(S.String),
  CoreNetworkArn: S.optional(S.String),
  GlobalNetworkId: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  State: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const CoreNetworkSummaryList = S.Array(CoreNetworkSummary);
export class AssociateConnectPeerResponse extends S.Class<AssociateConnectPeerResponse>(
  "AssociateConnectPeerResponse",
)({ ConnectPeerAssociation: S.optional(ConnectPeerAssociation) }) {}
export class AssociateCustomerGatewayResponse extends S.Class<AssociateCustomerGatewayResponse>(
  "AssociateCustomerGatewayResponse",
)({ CustomerGatewayAssociation: S.optional(CustomerGatewayAssociation) }) {}
export class AssociateLinkResponse extends S.Class<AssociateLinkResponse>(
  "AssociateLinkResponse",
)({ LinkAssociation: S.optional(LinkAssociation) }) {}
export class AssociateTransitGatewayConnectPeerResponse extends S.Class<AssociateTransitGatewayConnectPeerResponse>(
  "AssociateTransitGatewayConnectPeerResponse",
)({
  TransitGatewayConnectPeerAssociation: S.optional(
    TransitGatewayConnectPeerAssociation,
  ),
}) {}
export class CreateConnectAttachmentResponse extends S.Class<CreateConnectAttachmentResponse>(
  "CreateConnectAttachmentResponse",
)({ ConnectAttachment: S.optional(ConnectAttachment) }) {}
export class CreateConnectionResponse extends S.Class<CreateConnectionResponse>(
  "CreateConnectionResponse",
)({ Connection: S.optional(Connection) }) {}
export class CreateConnectPeerResponse extends S.Class<CreateConnectPeerResponse>(
  "CreateConnectPeerResponse",
)({ ConnectPeer: S.optional(ConnectPeer) }) {}
export class CreateDeviceResponse extends S.Class<CreateDeviceResponse>(
  "CreateDeviceResponse",
)({ Device: S.optional(Device) }) {}
export class CreateDirectConnectGatewayAttachmentResponse extends S.Class<CreateDirectConnectGatewayAttachmentResponse>(
  "CreateDirectConnectGatewayAttachmentResponse",
)({
  DirectConnectGatewayAttachment: S.optional(DirectConnectGatewayAttachment),
}) {}
export class CreateGlobalNetworkResponse extends S.Class<CreateGlobalNetworkResponse>(
  "CreateGlobalNetworkResponse",
)({ GlobalNetwork: S.optional(GlobalNetwork) }) {}
export class CreateLinkResponse extends S.Class<CreateLinkResponse>(
  "CreateLinkResponse",
)({ Link: S.optional(Link) }) {}
export class CreateSiteResponse extends S.Class<CreateSiteResponse>(
  "CreateSiteResponse",
)({ Site: S.optional(Site) }) {}
export class CreateSiteToSiteVpnAttachmentResponse extends S.Class<CreateSiteToSiteVpnAttachmentResponse>(
  "CreateSiteToSiteVpnAttachmentResponse",
)({ SiteToSiteVpnAttachment: S.optional(SiteToSiteVpnAttachment) }) {}
export class CreateTransitGatewayPeeringResponse extends S.Class<CreateTransitGatewayPeeringResponse>(
  "CreateTransitGatewayPeeringResponse",
)({ TransitGatewayPeering: S.optional(TransitGatewayPeering) }) {}
export class CreateTransitGatewayRouteTableAttachmentResponse extends S.Class<CreateTransitGatewayRouteTableAttachmentResponse>(
  "CreateTransitGatewayRouteTableAttachmentResponse",
)({
  TransitGatewayRouteTableAttachment: S.optional(
    TransitGatewayRouteTableAttachment,
  ),
}) {}
export class CreateVpcAttachmentResponse extends S.Class<CreateVpcAttachmentResponse>(
  "CreateVpcAttachmentResponse",
)({ VpcAttachment: S.optional(VpcAttachment) }) {}
export class DeleteDeviceResponse extends S.Class<DeleteDeviceResponse>(
  "DeleteDeviceResponse",
)({ Device: S.optional(Device) }) {}
export class DeleteLinkResponse extends S.Class<DeleteLinkResponse>(
  "DeleteLinkResponse",
)({ Link: S.optional(Link) }) {}
export class GetConnectAttachmentResponse extends S.Class<GetConnectAttachmentResponse>(
  "GetConnectAttachmentResponse",
)({ ConnectAttachment: S.optional(ConnectAttachment) }) {}
export class GetNetworkResourceCountsResponse extends S.Class<GetNetworkResourceCountsResponse>(
  "GetNetworkResourceCountsResponse",
)({
  NetworkResourceCounts: S.optional(NetworkResourceCountList),
  NextToken: S.optional(S.String),
}) {}
export class GetNetworkResourceRelationshipsResponse extends S.Class<GetNetworkResourceRelationshipsResponse>(
  "GetNetworkResourceRelationshipsResponse",
)({
  Relationships: S.optional(RelationshipList),
  NextToken: S.optional(S.String),
}) {}
export class GetNetworkResourcesResponse extends S.Class<GetNetworkResourcesResponse>(
  "GetNetworkResourcesResponse",
)({
  NetworkResources: S.optional(NetworkResourceList),
  NextToken: S.optional(S.String),
}) {}
export class GetNetworkRoutesRequest extends S.Class<GetNetworkRoutesRequest>(
  "GetNetworkRoutesRequest",
)(
  {
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    RouteTableIdentifier: RouteTableIdentifier,
    ExactCidrMatches: S.optional(ConstrainedStringList),
    LongestPrefixMatches: S.optional(ConstrainedStringList),
    SubnetOfMatches: S.optional(ConstrainedStringList),
    SupernetOfMatches: S.optional(ConstrainedStringList),
    PrefixListIds: S.optional(ConstrainedStringList),
    States: S.optional(RouteStateList),
    Types: S.optional(RouteTypeList),
    DestinationFilters: S.optional(FilterMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/global-networks/{GlobalNetworkId}/network-routes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVpcAttachmentResponse extends S.Class<GetVpcAttachmentResponse>(
  "GetVpcAttachmentResponse",
)({ VpcAttachment: S.optional(VpcAttachment) }) {}
export class ListAttachmentRoutingPolicyAssociationsResponse extends S.Class<ListAttachmentRoutingPolicyAssociationsResponse>(
  "ListAttachmentRoutingPolicyAssociationsResponse",
)({
  AttachmentRoutingPolicyAssociations: S.optional(
    AttachmentRoutingPolicyAssociationsList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListConnectPeersResponse extends S.Class<ListConnectPeersResponse>(
  "ListConnectPeersResponse",
)({
  ConnectPeers: S.optional(ConnectPeerSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListCoreNetworkPolicyVersionsResponse extends S.Class<ListCoreNetworkPolicyVersionsResponse>(
  "ListCoreNetworkPolicyVersionsResponse",
)({
  CoreNetworkPolicyVersions: S.optional(CoreNetworkPolicyVersionList),
  NextToken: S.optional(S.String),
}) {}
export class ListCoreNetworkPrefixListAssociationsResponse extends S.Class<ListCoreNetworkPrefixListAssociationsResponse>(
  "ListCoreNetworkPrefixListAssociationsResponse",
)({
  PrefixListAssociations: S.optional(PrefixListAssociationList),
  NextToken: S.optional(S.String),
}) {}
export class ListCoreNetworksResponse extends S.Class<ListCoreNetworksResponse>(
  "ListCoreNetworksResponse",
)({
  CoreNetworks: S.optional(CoreNetworkSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class RouteAnalysisEndpointOptions extends S.Class<RouteAnalysisEndpointOptions>(
  "RouteAnalysisEndpointOptions",
)({
  TransitGatewayAttachmentArn: S.optional(S.String),
  TransitGatewayArn: S.optional(S.String),
  IpAddress: S.optional(S.String),
}) {}
export const ReasonContextMap = S.Record({ key: S.String, value: S.String });
export class RouteAnalysisCompletion extends S.Class<RouteAnalysisCompletion>(
  "RouteAnalysisCompletion",
)({
  ResultCode: S.optional(S.String),
  ReasonCode: S.optional(S.String),
  ReasonContext: S.optional(ReasonContextMap),
}) {}
export class NetworkResourceSummary extends S.Class<NetworkResourceSummary>(
  "NetworkResourceSummary",
)({
  RegisteredGatewayArn: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  Definition: S.optional(S.String),
  NameTag: S.optional(S.String),
  IsMiddlebox: S.optional(S.Boolean),
}) {}
export class PathComponent extends S.Class<PathComponent>("PathComponent")({
  Sequence: S.optional(S.Number),
  Resource: S.optional(NetworkResourceSummary),
  DestinationCidrBlock: S.optional(S.String),
}) {}
export const PathComponentList = S.Array(PathComponent);
export class RouteAnalysisPath extends S.Class<RouteAnalysisPath>(
  "RouteAnalysisPath",
)({
  CompletionStatus: S.optional(RouteAnalysisCompletion),
  Path: S.optional(PathComponentList),
}) {}
export class RouteAnalysis extends S.Class<RouteAnalysis>("RouteAnalysis")({
  GlobalNetworkId: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  RouteAnalysisId: S.optional(S.String),
  StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  Source: S.optional(RouteAnalysisEndpointOptions),
  Destination: S.optional(RouteAnalysisEndpointOptions),
  IncludeReturnPath: S.optional(S.Boolean),
  UseMiddleboxes: S.optional(S.Boolean),
  ForwardPath: S.optional(RouteAnalysisPath),
  ReturnPath: S.optional(RouteAnalysisPath),
}) {}
export class StartRouteAnalysisResponse extends S.Class<StartRouteAnalysisResponse>(
  "StartRouteAnalysisResponse",
)({ RouteAnalysis: S.optional(RouteAnalysis) }) {}
export class UpdateNetworkResourceMetadataResponse extends S.Class<UpdateNetworkResourceMetadataResponse>(
  "UpdateNetworkResourceMetadataResponse",
)({
  ResourceArn: S.optional(S.String),
  Metadata: S.optional(NetworkResourceMetadataMap),
}) {}
export class ConnectionHealth extends S.Class<ConnectionHealth>(
  "ConnectionHealth",
)({
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RoutingInformationNextHop extends S.Class<RoutingInformationNextHop>(
  "RoutingInformationNextHop",
)({
  IpAddress: S.optional(S.String),
  CoreNetworkAttachmentId: S.optional(S.String),
  ResourceId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  SegmentName: S.optional(S.String),
  EdgeLocation: S.optional(S.String),
}) {}
export class NetworkTelemetry extends S.Class<NetworkTelemetry>(
  "NetworkTelemetry",
)({
  RegisteredGatewayArn: S.optional(S.String),
  CoreNetworkId: S.optional(S.String),
  AwsRegion: S.optional(S.String),
  AccountId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  Address: S.optional(S.String),
  Health: S.optional(ConnectionHealth),
}) {}
export const NetworkTelemetryList = S.Array(NetworkTelemetry);
export class CoreNetworkRoutingInformation extends S.Class<CoreNetworkRoutingInformation>(
  "CoreNetworkRoutingInformation",
)({
  Prefix: S.optional(S.String),
  NextHop: S.optional(RoutingInformationNextHop),
  LocalPreference: S.optional(S.String),
  Med: S.optional(S.String),
  AsPath: S.optional(ConstrainedStringList),
  Communities: S.optional(ConstrainedStringList),
}) {}
export const CoreNetworkRoutingInformationList = S.Array(
  CoreNetworkRoutingInformation,
);
export class RoutingPolicyAssociationDetail extends S.Class<RoutingPolicyAssociationDetail>(
  "RoutingPolicyAssociationDetail",
)({
  RoutingPolicyNames: S.optional(ConstrainedStringList),
  SharedSegments: S.optional(ConstrainedStringList),
}) {}
export const RoutingPolicyAssociationDetailsList = S.Array(
  RoutingPolicyAssociationDetail,
);
export class AcceptAttachmentResponse extends S.Class<AcceptAttachmentResponse>(
  "AcceptAttachmentResponse",
)({ Attachment: S.optional(Attachment) }) {}
export class DeleteCoreNetworkPolicyVersionResponse extends S.Class<DeleteCoreNetworkPolicyVersionResponse>(
  "DeleteCoreNetworkPolicyVersionResponse",
)({ CoreNetworkPolicy: S.optional(CoreNetworkPolicy) }) {}
export class DeregisterTransitGatewayResponse extends S.Class<DeregisterTransitGatewayResponse>(
  "DeregisterTransitGatewayResponse",
)({ TransitGatewayRegistration: S.optional(TransitGatewayRegistration) }) {}
export const WhenSentToSegmentsList = S.Array(S.String);
export class GetNetworkTelemetryResponse extends S.Class<GetNetworkTelemetryResponse>(
  "GetNetworkTelemetryResponse",
)({
  NetworkTelemetry: S.optional(NetworkTelemetryList),
  NextToken: S.optional(S.String),
}) {}
export class ListCoreNetworkRoutingInformationResponse extends S.Class<ListCoreNetworkRoutingInformationResponse>(
  "ListCoreNetworkRoutingInformationResponse",
)({
  CoreNetworkRoutingInformation: S.optional(CoreNetworkRoutingInformationList),
  NextToken: S.optional(S.String),
}) {}
export class ListOrganizationServiceAccessStatusResponse extends S.Class<ListOrganizationServiceAccessStatusResponse>(
  "ListOrganizationServiceAccessStatusResponse",
)({
  OrganizationStatus: S.optional(OrganizationStatus),
  NextToken: S.optional(S.String),
}) {}
export class CoreNetworkChangeEventValues extends S.Class<CoreNetworkChangeEventValues>(
  "CoreNetworkChangeEventValues",
)({
  EdgeLocation: S.optional(S.String),
  PeerEdgeLocation: S.optional(S.String),
  RoutingPolicyDirection: S.optional(S.String),
  SegmentName: S.optional(S.String),
  NetworkFunctionGroupName: S.optional(S.String),
  AttachmentId: S.optional(S.String),
  Cidr: S.optional(S.String),
  RoutingPolicyAssociationDetails: S.optional(
    RoutingPolicyAssociationDetailsList,
  ),
}) {}
export class WhenSentTo extends S.Class<WhenSentTo>("WhenSentTo")({
  WhenSentToSegmentsList: S.optional(WhenSentToSegmentsList),
}) {}
export const ExceptionContextMap = S.Record({ key: S.String, value: S.String });
export class CoreNetworkChangeEvent extends S.Class<CoreNetworkChangeEvent>(
  "CoreNetworkChangeEvent",
)({
  Type: S.optional(S.String),
  Action: S.optional(S.String),
  IdentifierPath: S.optional(S.String),
  EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  Values: S.optional(CoreNetworkChangeEventValues),
}) {}
export const CoreNetworkChangeEventList = S.Array(CoreNetworkChangeEvent);
export const EdgeSet = S.Array(S.String);
export const EdgeSetList = S.Array(EdgeSet);
export class CreateCoreNetworkResponse extends S.Class<CreateCoreNetworkResponse>(
  "CreateCoreNetworkResponse",
)({ CoreNetwork: S.optional(CoreNetwork) }) {}
export class DeleteConnectPeerResponse extends S.Class<DeleteConnectPeerResponse>(
  "DeleteConnectPeerResponse",
)({ ConnectPeer: S.optional(ConnectPeer) }) {}
export class DeletePeeringResponse extends S.Class<DeletePeeringResponse>(
  "DeletePeeringResponse",
)({ Peering: S.optional(Peering) }) {}
export class GetCoreNetworkChangeEventsResponse extends S.Class<GetCoreNetworkChangeEventsResponse>(
  "GetCoreNetworkChangeEventsResponse",
)({
  CoreNetworkChangeEvents: S.optional(CoreNetworkChangeEventList),
  NextToken: S.optional(S.String),
}) {}
export class NetworkFunctionGroup extends S.Class<NetworkFunctionGroup>(
  "NetworkFunctionGroup",
)({ Name: S.optional(S.String) }) {}
export const NetworkFunctionGroupList = S.Array(NetworkFunctionGroup);
export class EdgeOverride extends S.Class<EdgeOverride>("EdgeOverride")({
  EdgeSets: S.optional(EdgeSetList),
  UseEdge: S.optional(S.String),
}) {}
export const WithEdgeOverridesList = S.Array(EdgeOverride);
export class NetworkRouteDestination extends S.Class<NetworkRouteDestination>(
  "NetworkRouteDestination",
)({
  CoreNetworkAttachmentId: S.optional(S.String),
  TransitGatewayAttachmentId: S.optional(S.String),
  SegmentName: S.optional(S.String),
  NetworkFunctionGroupName: S.optional(S.String),
  EdgeLocation: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
}) {}
export const NetworkRouteDestinationList = S.Array(NetworkRouteDestination);
export class Via extends S.Class<Via>("Via")({
  NetworkFunctionGroups: S.optional(NetworkFunctionGroupList),
  WithEdgeOverrides: S.optional(WithEdgeOverridesList),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, Message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class NetworkRoute extends S.Class<NetworkRoute>("NetworkRoute")({
  DestinationCidrBlock: S.optional(S.String),
  Destinations: S.optional(NetworkRouteDestinationList),
  PrefixListId: S.optional(S.String),
  State: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const NetworkRouteList = S.Array(NetworkRoute);
export class ServiceInsertionAction extends S.Class<ServiceInsertionAction>(
  "ServiceInsertionAction",
)({
  Action: S.optional(S.String),
  Mode: S.optional(S.String),
  WhenSentTo: S.optional(WhenSentTo),
  Via: S.optional(Via),
}) {}
export const ServiceInsertionActionList = S.Array(ServiceInsertionAction);
export class GetNetworkRoutesResponse extends S.Class<GetNetworkRoutesResponse>(
  "GetNetworkRoutesResponse",
)({
  RouteTableArn: S.optional(S.String),
  CoreNetworkSegmentEdge: S.optional(CoreNetworkSegmentEdgeIdentifier),
  RouteTableType: S.optional(S.String),
  RouteTableTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  NetworkRoutes: S.optional(NetworkRouteList),
}) {}
export class GetRouteAnalysisResponse extends S.Class<GetRouteAnalysisResponse>(
  "GetRouteAnalysisResponse",
)({ RouteAnalysis: S.optional(RouteAnalysis) }) {}
export class CoreNetworkChangeValues extends S.Class<CoreNetworkChangeValues>(
  "CoreNetworkChangeValues",
)({
  SegmentName: S.optional(S.String),
  NetworkFunctionGroupName: S.optional(S.String),
  EdgeLocations: S.optional(ExternalRegionCodeList),
  Asn: S.optional(S.Number),
  Cidr: S.optional(S.String),
  DestinationIdentifier: S.optional(S.String),
  InsideCidrBlocks: S.optional(ConstrainedStringList),
  SharedSegments: S.optional(ConstrainedStringList),
  ServiceInsertionActions: S.optional(ServiceInsertionActionList),
  VpnEcmpSupport: S.optional(S.Boolean),
  DnsSupport: S.optional(S.Boolean),
  SecurityGroupReferencingSupport: S.optional(S.Boolean),
  RoutingPolicyDirection: S.optional(S.String),
  RoutingPolicy: S.optional(S.String),
  PeerEdgeLocations: S.optional(ExternalRegionCodeList),
  AttachmentId: S.optional(S.String),
  RoutingPolicyAssociationDetails: S.optional(
    RoutingPolicyAssociationDetailsList,
  ),
}) {}
export class CoreNetworkChange extends S.Class<CoreNetworkChange>(
  "CoreNetworkChange",
)({
  Type: S.optional(S.String),
  Action: S.optional(S.String),
  Identifier: S.optional(S.String),
  PreviousValues: S.optional(CoreNetworkChangeValues),
  NewValues: S.optional(CoreNetworkChangeValues),
  IdentifierPath: S.optional(S.String),
}) {}
export const CoreNetworkChangeList = S.Array(CoreNetworkChange);
export class GetCoreNetworkChangeSetResponse extends S.Class<GetCoreNetworkChangeSetResponse>(
  "GetCoreNetworkChangeSetResponse",
)({
  CoreNetworkChanges: S.optional(CoreNetworkChangeList),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class CoreNetworkPolicyException extends S.TaggedError<CoreNetworkPolicyException>()(
  "CoreNetworkPolicyException",
  { Message: S.String, Errors: S.optional(CoreNetworkPolicyErrorList) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    LimitCode: S.String,
    ServiceCode: S.String,
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    Context: S.optional(ExceptionContextMap),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Gets the status of the Service Linked Role (SLR) deployment for the accounts in a given Amazon Web Services Organization.
 */
export const listOrganizationServiceAccessStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListOrganizationServiceAccessStatusRequest,
    output: ListOrganizationServiceAccessStatusResponse,
    errors: [],
  }));
/**
 * Gets the count of network resources, by resource type, for the specified global network.
 */
export const getNetworkResourceCounts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetNetworkResourceCountsRequest,
    output: GetNetworkResourceCountsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "NetworkResourceCounts",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets the network routes of the specified global network.
 */
export const getNetworkRoutes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNetworkRoutesRequest,
  output: GetNetworkRoutesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified route analysis.
 */
export const getRouteAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouteAnalysisRequest,
  output: GetRouteAnalysisResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables the Network Manager service for an Amazon Web Services Organization. This can only be called by a management account within the organization.
 */
export const startOrganizationServiceAccessUpdate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartOrganizationServiceAccessUpdateRequest,
    output: StartOrganizationServiceAccessUpdateResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of core network Connect peers.
 */
export const listConnectPeers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListConnectPeersRequest,
    output: ListConnectPeersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ConnectPeers",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a list of owned and shared core networks.
 */
export const listCoreNetworks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCoreNetworksRequest,
    output: ListCoreNetworksResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CoreNetworks",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns information about a resource policy.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of core network attachments.
 */
export const listAttachments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAttachmentsRequest,
    output: ListAttachmentsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Attachments",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the peerings for a core network.
 */
export const listPeerings = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPeeringsRequest,
    output: ListPeeringsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Peerings",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Deletes a resource policy for the specified resource. This revokes the access of the principals specified in the resource policy.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates or updates a resource policy.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a connection between two devices. The devices can be a physical or virtual appliance that connects to a third-party appliance in a VPC, or a physical appliance that connects to another physical appliance in an on-premises network.
 */
export const createConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionRequest,
  output: CreateConnectionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new, empty global network.
 */
export const createGlobalNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlobalNetworkRequest,
  output: CreateGlobalNetworkResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a core network as part of your global network, and optionally, with a core network policy.
 */
export const createCoreNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCoreNetworkRequest,
  output: CreateCoreNetworkResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    CoreNetworkPolicyException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes one or more global networks. By default, all global networks are
 * described. To describe the objects in your global network, you must use the appropriate
 * `Get*` action. For example, to list the transit gateways in your global
 * network, use GetTransitGatewayRegistrations.
 */
export const describeGlobalNetworks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeGlobalNetworksRequest,
    output: DescribeGlobalNetworksResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "GlobalNetworks",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns information about a core network change event.
 */
export const getCoreNetworkChangeEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetCoreNetworkChangeEventsRequest,
    output: GetCoreNetworkChangeEventsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CoreNetworkChangeEvents",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns information about a core network Connect attachment.
 */
export const getConnectAttachment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConnectAttachmentRequest,
    output: GetConnectAttachmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the network resource relationships for the specified global network.
 */
export const getNetworkResourceRelationships =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetNetworkResourceRelationshipsRequest,
    output: GetNetworkResourceRelationshipsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Relationships",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Describes the network resources for the specified global network.
 *
 * The results include information from the corresponding Describe call for the resource, minus any sensitive information such as pre-shared keys.
 */
export const getNetworkResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetNetworkResourcesRequest,
    output: GetNetworkResourcesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "NetworkResources",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns information about a VPC attachment.
 */
export const getVpcAttachment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVpcAttachmentRequest,
  output: GetVpcAttachmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the routing policy associations for attachments in a core network.
 */
export const listAttachmentRoutingPolicyAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAttachmentRoutingPolicyAssociationsRequest,
    output: ListAttachmentRoutingPolicyAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AttachmentRoutingPolicyAssociations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of core network policy versions.
 */
export const listCoreNetworkPolicyVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCoreNetworkPolicyVersionsRequest,
    output: ListCoreNetworkPolicyVersionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CoreNetworkPolicyVersions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the prefix list associations for a core network.
 */
export const listCoreNetworkPrefixListAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCoreNetworkPrefixListAssociationsRequest,
    output: ListCoreNetworkPrefixListAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PrefixListAssociations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Starts analyzing the routing path between the specified source and destination. For more information,
 * see Route Analyzer.
 */
export const startRouteAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRouteAnalysisRequest,
  output: StartRouteAnalysisResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the resource metadata for the specified global network.
 */
export const updateNetworkResourceMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateNetworkResourceMetadataRequest,
    output: UpdateNetworkResourceMetadataResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes an existing site. The site cannot be associated with any device or link.
 */
export const deleteSite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSiteRequest,
  output: DeleteSiteResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a core network Connect peer from a device and a link.
 */
export const disassociateConnectPeer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateConnectPeerRequest,
    output: DisassociateConnectPeerResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates a customer gateway from a device and a link.
 */
export const disassociateCustomerGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateCustomerGatewayRequest,
    output: DisassociateCustomerGatewayResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates an existing device from a link. You must first disassociate any customer
 * gateways that are associated with the link.
 */
export const disassociateLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateLinkRequest,
  output: DisassociateLinkResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a transit gateway Connect peer from a device and link.
 */
export const disassociateTransitGatewayConnectPeer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateTransitGatewayConnectPeerRequest,
    output: DisassociateTransitGatewayConnectPeerResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns information about a core network Connect peer associations.
 */
export const getConnectPeerAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetConnectPeerAssociationsRequest,
    output: GetConnectPeerAssociationsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ConnectPeerAssociations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets the association information for customer gateways that are associated with
 * devices and links in your global network.
 */
export const getCustomerGatewayAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetCustomerGatewayAssociationsRequest,
    output: GetCustomerGatewayAssociationsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CustomerGatewayAssociations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets information about one or more of your transit gateway Connect peer associations in a global network.
 */
export const getTransitGatewayConnectPeerAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetTransitGatewayConnectPeerAssociationsRequest,
    output: GetTransitGatewayConnectPeerAssociationsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TransitGatewayConnectPeerAssociations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Applies a routing policy label to an attachment for traffic routing decisions.
 */
export const putAttachmentRoutingPolicyLabel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutAttachmentRoutingPolicyLabelRequest,
    output: PutAttachmentRoutingPolicyLabelResponse,
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
 * Registers a transit gateway in your global network. Not all Regions support transit
 * gateways for global networks. For a list of the supported Regions, see Region Availability in the Amazon Web Services Transit Gateways for Global
 * Networks User Guide. The transit gateway can be in any of the supported
 * Amazon Web Services Regions, but it must be owned by the same Amazon Web Services account that owns the global
 * network. You cannot register a transit gateway in more than one global network.
 */
export const registerTransitGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterTransitGatewayRequest,
    output: RegisterTransitGatewayResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Rejects a core network attachment request.
 */
export const rejectAttachment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectAttachmentRequest,
  output: RejectAttachmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a routing policy label from an attachment.
 */
export const removeAttachmentRoutingPolicyLabel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveAttachmentRoutingPolicyLabelRequest,
    output: RemoveAttachmentRoutingPolicyLabelResponse,
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
 * Restores a previous policy version as a new, immutable version of a core network policy. A subsequent change set is created showing the differences between the LIVE policy and restored policy.
 */
export const restoreCoreNetworkPolicyVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreCoreNetworkPolicyVersionRequest,
    output: RestoreCoreNetworkPolicyVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the information for an existing connection. To remove information for any of the parameters,
 * specify an empty string.
 */
export const updateConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectionRequest,
  output: UpdateConnectionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the description of a core network.
 */
export const updateCoreNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCoreNetworkRequest,
  output: UpdateCoreNetworkResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the details for an existing device. To remove information for any of the
 * parameters, specify an empty string.
 */
export const updateDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeviceRequest,
  output: UpdateDeviceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the edge locations associated with an Amazon Web Services Direct Connect gateway attachment.
 */
export const updateDirectConnectGatewayAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDirectConnectGatewayAttachmentRequest,
    output: UpdateDirectConnectGatewayAttachmentResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates an existing global network. To remove information for any of the parameters,
 * specify an empty string.
 */
export const updateGlobalNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlobalNetworkRequest,
  output: UpdateGlobalNetworkResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the details for an existing link. To remove information for any of the
 * parameters, specify an empty string.
 */
export const updateLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLinkRequest,
  output: UpdateLinkResponse,
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
 * Updates the information for an existing site. To remove information for any of the
 * parameters, specify an empty string.
 */
export const updateSite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSiteRequest,
  output: UpdateSiteResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a VPC attachment.
 */
export const updateVpcAttachment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcAttachmentRequest,
  output: UpdateVpcAttachmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Executes a change set on your core network. Deploys changes globally based on the policy submitted..
 */
export const executeCoreNetworkChangeSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExecuteCoreNetworkChangeSetRequest,
    output: ExecuteCoreNetworkChangeSetResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Tags a specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
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
 * Removes tags from a specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an association between a core network and a prefix list for routing control.
 */
export const createCoreNetworkPrefixListAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCoreNetworkPrefixListAssociationRequest,
    output: CreateCoreNetworkPrefixListAssociationResponse,
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
 * Deletes an attachment. Supports all attachment types.
 */
export const deleteAttachment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAttachmentRequest,
  output: DeleteAttachmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified connection in your global network.
 */
export const deleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a core network along with all core network policies. This can only be done if there are no attachments on a core network.
 */
export const deleteCoreNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCoreNetworkRequest,
  output: DeleteCoreNetworkResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an association between a core network and a prefix list.
 */
export const deleteCoreNetworkPrefixListAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCoreNetworkPrefixListAssociationRequest,
    output: DeleteCoreNetworkPrefixListAssociationResponse,
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
 * Deletes an existing global network. You must first delete all global network objects
 * (devices, links, and sites), deregister all transit gateways, and delete any core networks.
 */
export const deleteGlobalNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlobalNetworkRequest,
  output: DeleteGlobalNetworkResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates a core network Connect peer with a device and optionally, with a link.
 *
 * If you specify a link, it must be associated with the specified device. You can only
 * associate core network Connect peers that have been created on a core network Connect
 * attachment on a core network.
 */
export const associateConnectPeer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateConnectPeerRequest,
    output: AssociateConnectPeerResponse,
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
 * Associates a customer gateway with a device and optionally, with a link. If you
 * specify a link, it must be associated with the specified device.
 *
 * You can only associate customer gateways that are connected to a VPN attachment on a
 * transit gateway or core network registered in your global network. When you register a
 * transit gateway or core network, customer gateways that are connected to the transit
 * gateway are automatically included in the global network. To list customer gateways
 * that are connected to a transit gateway, use the DescribeVpnConnections EC2 API and filter by
 * `transit-gateway-id`.
 *
 * You cannot associate a customer gateway with more than one device and link.
 */
export const associateCustomerGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateCustomerGatewayRequest,
    output: AssociateCustomerGatewayResponse,
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
 * Associates a link to a device. A device can be associated to multiple links and a link can be associated to multiple devices. The device and link must be in the same global network and the same site.
 */
export const associateLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateLinkRequest,
  output: AssociateLinkResponse,
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
 * Associates a transit gateway Connect peer with a device, and optionally, with a link. If you
 * specify a link, it must be associated with the specified device.
 *
 * You can only associate transit gateway Connect peers that have been created on a
 * transit gateway that's registered in your global network.
 *
 * You cannot associate a transit gateway Connect peer with more than one device and link.
 */
export const associateTransitGatewayConnectPeer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateTransitGatewayConnectPeerRequest,
    output: AssociateTransitGatewayConnectPeerResponse,
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
 * Creates a core network Connect attachment from a specified core network attachment.
 *
 * A core network Connect attachment is a GRE-based tunnel attachment that you can use to
 * establish a connection between a core network and an appliance. A core network Connect
 * attachment uses an existing VPC attachment as the underlying transport mechanism.
 */
export const createConnectAttachment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConnectAttachmentRequest,
    output: CreateConnectAttachmentResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a core network Connect peer for a specified core network connect attachment between a core network and an appliance.
 * The peer address and transit gateway address must be the same IP address family (IPv4 or IPv6).
 */
export const createConnectPeer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectPeerRequest,
  output: CreateConnectPeerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new device in a global network. If you specify both a site ID and a
 * location, the location of the site is used for visualization in the Network Manager console.
 */
export const createDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeviceRequest,
  output: CreateDeviceResponse,
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
 * Creates an Amazon Web Services Direct Connect gateway attachment
 */
export const createDirectConnectGatewayAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDirectConnectGatewayAttachmentRequest,
    output: CreateDirectConnectGatewayAttachmentResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a new link for a specified site.
 */
export const createLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLinkRequest,
  output: CreateLinkResponse,
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
 * Creates a new site in a global network.
 */
export const createSite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSiteRequest,
  output: CreateSiteResponse,
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
 * Creates an Amazon Web Services site-to-site VPN attachment on an edge location of a core network.
 */
export const createSiteToSiteVpnAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateSiteToSiteVpnAttachmentRequest,
    output: CreateSiteToSiteVpnAttachmentResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a transit gateway peering connection.
 */
export const createTransitGatewayPeering = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTransitGatewayPeeringRequest,
    output: CreateTransitGatewayPeeringResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a transit gateway route table attachment.
 */
export const createTransitGatewayRouteTableAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateTransitGatewayRouteTableAttachmentRequest,
    output: CreateTransitGatewayRouteTableAttachmentResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a VPC attachment on an edge location of a core network.
 */
export const createVpcAttachment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcAttachmentRequest,
  output: CreateVpcAttachmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing device. You must first disassociate the device from any links and
 * customer gateways.
 */
export const deleteDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeviceRequest,
  output: DeleteDeviceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing link. You must first disassociate the link from any devices and
 * customer gateways.
 */
export const deleteLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLinkRequest,
  output: DeleteLinkResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about one or more of your connections in a global network.
 */
export const getConnections = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetConnectionsRequest,
    output: GetConnectionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Connections",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns information about a core network Connect peer.
 */
export const getConnectPeer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectPeerRequest,
  output: GetConnectPeerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the LIVE policy for a core network.
 */
export const getCoreNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCoreNetworkRequest,
  output: GetCoreNetworkResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns details about a core network policy. You can get details about your current live policy or any previous policy version.
 */
export const getCoreNetworkPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCoreNetworkPolicyRequest,
    output: GetCoreNetworkPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about one or more of your devices in a global network.
 */
export const getDevices = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDevicesRequest,
  output: GetDevicesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Devices",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about a specific Amazon Web Services Direct Connect gateway attachment.
 */
export const getDirectConnectGatewayAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDirectConnectGatewayAttachmentRequest,
    output: GetDirectConnectGatewayAttachmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets the link associations for a device or a link. Either the device ID or the link ID
 * must be specified.
 */
export const getLinkAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetLinkAssociationsRequest,
    output: GetLinkAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "LinkAssociations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets information about one or more links in a specified global network.
 *
 * If you specify the site ID, you cannot specify the type or provider in the same request. You can specify the type and provider in the same request.
 */
export const getLinks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetLinksRequest,
  output: GetLinksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Links",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets information about one or more of your sites in a global network.
 */
export const getSites = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSitesRequest,
  output: GetSitesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Sites",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about a site-to-site VPN attachment.
 */
export const getSiteToSiteVpnAttachment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSiteToSiteVpnAttachmentRequest,
    output: GetSiteToSiteVpnAttachmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about a transit gateway peer.
 */
export const getTransitGatewayPeering = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTransitGatewayPeeringRequest,
    output: GetTransitGatewayPeeringResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about the transit gateway registrations in a specified
 * global network.
 */
export const getTransitGatewayRegistrations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetTransitGatewayRegistrationsRequest,
    output: GetTransitGatewayRegistrationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TransitGatewayRegistrations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns information about a transit gateway route table attachment.
 */
export const getTransitGatewayRouteTableAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTransitGatewayRouteTableAttachmentRequest,
    output: GetTransitGatewayRouteTableAttachmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the tags for a specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Accepts a core network attachment request.
 *
 * Once the attachment request is accepted by a core network owner, the attachment is
 * created and connected to a core network.
 */
export const acceptAttachment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptAttachmentRequest,
  output: AcceptAttachmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a policy version from a core network. You can't delete the current LIVE policy.
 */
export const deleteCoreNetworkPolicyVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCoreNetworkPolicyVersionRequest,
    output: DeleteCoreNetworkPolicyVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deregisters a transit gateway from your global network. This action does not delete
 * your transit gateway, or modify any of its attachments. This action removes any customer gateway associations.
 */
export const deregisterTransitGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterTransitGatewayRequest,
    output: DeregisterTransitGatewayResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the network telemetry of the specified global network.
 */
export const getNetworkTelemetry =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetNetworkTelemetryRequest,
    output: GetNetworkTelemetryResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "NetworkTelemetry",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists routing information for a core network, including routes and their attributes.
 */
export const listCoreNetworkRoutingInformation =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCoreNetworkRoutingInformationRequest,
    output: ListCoreNetworkRoutingInformationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CoreNetworkRoutingInformation",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Creates a new, immutable version of a core network policy. A subsequent change set is created showing the differences between the LIVE policy and the submitted policy.
 */
export const putCoreNetworkPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutCoreNetworkPolicyRequest,
    output: PutCoreNetworkPolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      CoreNetworkPolicyException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a Connect peer.
 */
export const deleteConnectPeer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectPeerRequest,
  output: DeleteConnectPeerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing peering connection.
 */
export const deletePeering = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePeeringRequest,
  output: DeletePeeringResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a change set between the LIVE core network policy and a submitted policy.
 */
export const getCoreNetworkChangeSet =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetCoreNetworkChangeSetRequest,
    output: GetCoreNetworkChangeSetResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CoreNetworkChanges",
      pageSize: "MaxResults",
    } as const,
  }));
