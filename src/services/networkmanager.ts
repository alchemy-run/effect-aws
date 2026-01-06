import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
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

//# Newtypes
export type AttachmentId = string;
export type GlobalNetworkId = string;
export type ConnectPeerId = string;
export type DeviceId = string;
export type LinkId = string;
export type CustomerGatewayArn = string;
export type TransitGatewayConnectPeerArn = string;
export type CoreNetworkId = string;
export type ExternalRegionCode = string;
export type ConstrainedString = string;
export type ClientToken = string;
export type IPAddress = string;
export type SubnetArn = string;
export type CoreNetworkPolicyDocument = string;
export type PrefixListArn = string;
export type SiteId = string;
export type DirectConnectGatewayArn = string;
export type VpnConnectionArn = string;
export type TransitGatewayArn = string;
export type PeeringId = string;
export type TransitGatewayRouteTableArn = string;
export type VpcArn = string;
export type ConnectionId = string;
export type Integer = number;
export type ResourceArn = string;
export type MaxResults = number;
export type NextToken = string;
export type AWSAccountId = string;
export type SynthesizedJsonCoreNetworkPolicyDocument = string;
export type SynthesizedJsonResourcePolicyDocument = string;
export type Action = string;
export type TagKey = string;
export type TagValue = string;
export type Long = number;
export type FilterName = string;
export type FilterValue = string;
export type TransitGatewayAttachmentArn = string;
export type ServerSideString = string;
export type CoreNetworkArn = string;
export type NetworkFunctionGroupName = string;
export type ConnectionArn = string;
export type GlobalNetworkArn = string;
export type SiteArn = string;
export type TransitGatewayPeeringAttachmentId = string;
export type DeviceArn = string;
export type LinkArn = string;
export type OrganizationId = string;
export type OrganizationAwsServiceAccessStatus = string;
export type SLRDeploymentStatus = string;
export type RetryAfterSeconds = number;
export type AccountId = string;
export type ReasonContextKey = string;
export type ReasonContextValue = string;
export type ExceptionContextKey = string;
export type ExceptionContextValue = string;
export type TransitGatewayAttachmentId = string;

//# Schemas
export type ConstrainedStringList = string[];
export const ConstrainedStringList = S.Array(S.String);
export type ExternalRegionCodeList = string[];
export const ExternalRegionCodeList = S.Array(S.String);
export type SubnetArnList = string[];
export const SubnetArnList = S.Array(S.String);
export type GlobalNetworkIdList = string[];
export const GlobalNetworkIdList = S.Array(S.String);
export type ConnectionIdList = string[];
export const ConnectionIdList = S.Array(S.String);
export type ConnectPeerIdList = string[];
export const ConnectPeerIdList = S.Array(S.String);
export type CustomerGatewayArnList = string[];
export const CustomerGatewayArnList = S.Array(S.String);
export type DeviceIdList = string[];
export const DeviceIdList = S.Array(S.String);
export type LinkIdList = string[];
export const LinkIdList = S.Array(S.String);
export type RouteStateList = string[];
export const RouteStateList = S.Array(S.String);
export type RouteTypeList = string[];
export const RouteTypeList = S.Array(S.String);
export type SiteIdList = string[];
export const SiteIdList = S.Array(S.String);
export type TransitGatewayConnectPeerArnList = string[];
export const TransitGatewayConnectPeerArnList = S.Array(S.String);
export type TransitGatewayArnList = string[];
export const TransitGatewayArnList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AcceptAttachmentRequest {
  AttachmentId: string;
}
export const AcceptAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/attachments/{AttachmentId}/accept" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptAttachmentRequest",
}) as any as S.Schema<AcceptAttachmentRequest>;
export interface AssociateConnectPeerRequest {
  GlobalNetworkId: string;
  ConnectPeerId: string;
  DeviceId: string;
  LinkId?: string;
}
export const AssociateConnectPeerRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectPeerId: S.String,
    DeviceId: S.String,
    LinkId: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateConnectPeerRequest",
}) as any as S.Schema<AssociateConnectPeerRequest>;
export interface AssociateCustomerGatewayRequest {
  CustomerGatewayArn: string;
  GlobalNetworkId: string;
  DeviceId: string;
  LinkId?: string;
}
export const AssociateCustomerGatewayRequest = S.suspend(() =>
  S.Struct({
    CustomerGatewayArn: S.String,
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String,
    LinkId: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateCustomerGatewayRequest",
}) as any as S.Schema<AssociateCustomerGatewayRequest>;
export interface AssociateLinkRequest {
  GlobalNetworkId: string;
  DeviceId: string;
  LinkId: string;
}
export const AssociateLinkRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String,
    LinkId: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateLinkRequest",
}) as any as S.Schema<AssociateLinkRequest>;
export interface AssociateTransitGatewayConnectPeerRequest {
  GlobalNetworkId: string;
  TransitGatewayConnectPeerArn: string;
  DeviceId: string;
  LinkId?: string;
}
export const AssociateTransitGatewayConnectPeerRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayConnectPeerArn: S.String,
    DeviceId: S.String,
    LinkId: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateTransitGatewayConnectPeerRequest",
}) as any as S.Schema<AssociateTransitGatewayConnectPeerRequest>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateConnectionRequest {
  GlobalNetworkId: string;
  DeviceId: string;
  ConnectedDeviceId: string;
  LinkId?: string;
  ConnectedLinkId?: string;
  Description?: string;
  Tags?: TagList;
}
export const CreateConnectionRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String,
    ConnectedDeviceId: S.String,
    LinkId: S.optional(S.String),
    ConnectedLinkId: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateConnectionRequest",
}) as any as S.Schema<CreateConnectionRequest>;
export interface CreateCoreNetworkRequest {
  GlobalNetworkId: string;
  Description?: string;
  Tags?: TagList;
  PolicyDocument?: string;
  ClientToken?: string;
}
export const CreateCoreNetworkRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    PolicyDocument: S.optional(S.String),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/core-networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCoreNetworkRequest",
}) as any as S.Schema<CreateCoreNetworkRequest>;
export interface CreateCoreNetworkPrefixListAssociationRequest {
  CoreNetworkId: string;
  PrefixListArn: string;
  PrefixListAlias: string;
  ClientToken?: string;
}
export const CreateCoreNetworkPrefixListAssociationRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String,
    PrefixListArn: S.String,
    PrefixListAlias: S.String,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prefix-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCoreNetworkPrefixListAssociationRequest",
}) as any as S.Schema<CreateCoreNetworkPrefixListAssociationRequest>;
export interface CreateDirectConnectGatewayAttachmentRequest {
  CoreNetworkId: string;
  DirectConnectGatewayArn: string;
  RoutingPolicyLabel?: string;
  EdgeLocations: ExternalRegionCodeList;
  Tags?: TagList;
  ClientToken?: string;
}
export const CreateDirectConnectGatewayAttachmentRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String,
    DirectConnectGatewayArn: S.String,
    RoutingPolicyLabel: S.optional(S.String),
    EdgeLocations: ExternalRegionCodeList,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/direct-connect-gateway-attachments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDirectConnectGatewayAttachmentRequest",
}) as any as S.Schema<CreateDirectConnectGatewayAttachmentRequest>;
export interface CreateGlobalNetworkRequest {
  Description?: string;
  Tags?: TagList;
}
export const CreateGlobalNetworkRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/global-networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGlobalNetworkRequest",
}) as any as S.Schema<CreateGlobalNetworkRequest>;
export interface Location {
  Address?: string;
  Latitude?: string;
  Longitude?: string;
}
export const Location = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    Latitude: S.optional(S.String),
    Longitude: S.optional(S.String),
  }),
).annotations({ identifier: "Location" }) as any as S.Schema<Location>;
export interface CreateSiteRequest {
  GlobalNetworkId: string;
  Description?: string;
  Location?: Location;
  Tags?: TagList;
}
export const CreateSiteRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    Description: S.optional(S.String),
    Location: S.optional(Location),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/global-networks/{GlobalNetworkId}/sites",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSiteRequest",
}) as any as S.Schema<CreateSiteRequest>;
export interface CreateSiteToSiteVpnAttachmentRequest {
  CoreNetworkId: string;
  VpnConnectionArn: string;
  RoutingPolicyLabel?: string;
  Tags?: TagList;
  ClientToken?: string;
}
export const CreateSiteToSiteVpnAttachmentRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String,
    VpnConnectionArn: S.String,
    RoutingPolicyLabel: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/site-to-site-vpn-attachments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSiteToSiteVpnAttachmentRequest",
}) as any as S.Schema<CreateSiteToSiteVpnAttachmentRequest>;
export interface CreateTransitGatewayPeeringRequest {
  CoreNetworkId: string;
  TransitGatewayArn: string;
  Tags?: TagList;
  ClientToken?: string;
}
export const CreateTransitGatewayPeeringRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String,
    TransitGatewayArn: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/transit-gateway-peerings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTransitGatewayPeeringRequest",
}) as any as S.Schema<CreateTransitGatewayPeeringRequest>;
export interface CreateTransitGatewayRouteTableAttachmentRequest {
  PeeringId: string;
  TransitGatewayRouteTableArn: string;
  RoutingPolicyLabel?: string;
  Tags?: TagList;
  ClientToken?: string;
}
export const CreateTransitGatewayRouteTableAttachmentRequest = S.suspend(() =>
  S.Struct({
    PeeringId: S.String,
    TransitGatewayRouteTableArn: S.String,
    RoutingPolicyLabel: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/transit-gateway-route-table-attachments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTransitGatewayRouteTableAttachmentRequest",
}) as any as S.Schema<CreateTransitGatewayRouteTableAttachmentRequest>;
export interface DeleteAttachmentRequest {
  AttachmentId: string;
}
export const DeleteAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/attachments/{AttachmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAttachmentRequest",
}) as any as S.Schema<DeleteAttachmentRequest>;
export interface DeleteConnectionRequest {
  GlobalNetworkId: string;
  ConnectionId: string;
}
export const DeleteConnectionRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteConnectionRequest",
}) as any as S.Schema<DeleteConnectionRequest>;
export interface DeleteConnectPeerRequest {
  ConnectPeerId: string;
}
export const DeleteConnectPeerRequest = S.suspend(() =>
  S.Struct({ ConnectPeerId: S.String.pipe(T.HttpLabel("ConnectPeerId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/connect-peers/{ConnectPeerId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectPeerRequest",
}) as any as S.Schema<DeleteConnectPeerRequest>;
export interface DeleteCoreNetworkRequest {
  CoreNetworkId: string;
}
export const DeleteCoreNetworkRequest = S.suspend(() =>
  S.Struct({ CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/core-networks/{CoreNetworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCoreNetworkRequest",
}) as any as S.Schema<DeleteCoreNetworkRequest>;
export interface DeleteCoreNetworkPolicyVersionRequest {
  CoreNetworkId: string;
  PolicyVersionId: number;
}
export const DeleteCoreNetworkPolicyVersionRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCoreNetworkPolicyVersionRequest",
}) as any as S.Schema<DeleteCoreNetworkPolicyVersionRequest>;
export interface DeleteCoreNetworkPrefixListAssociationRequest {
  CoreNetworkId: string;
  PrefixListArn: string;
}
export const DeleteCoreNetworkPrefixListAssociationRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PrefixListArn: S.String.pipe(T.HttpLabel("PrefixListArn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCoreNetworkPrefixListAssociationRequest",
}) as any as S.Schema<DeleteCoreNetworkPrefixListAssociationRequest>;
export interface DeleteDeviceRequest {
  GlobalNetworkId: string;
  DeviceId: string;
}
export const DeleteDeviceRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDeviceRequest",
}) as any as S.Schema<DeleteDeviceRequest>;
export interface DeleteGlobalNetworkRequest {
  GlobalNetworkId: string;
}
export const DeleteGlobalNetworkRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/global-networks/{GlobalNetworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGlobalNetworkRequest",
}) as any as S.Schema<DeleteGlobalNetworkRequest>;
export interface DeleteLinkRequest {
  GlobalNetworkId: string;
  LinkId: string;
}
export const DeleteLinkRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    LinkId: S.String.pipe(T.HttpLabel("LinkId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteLinkRequest",
}) as any as S.Schema<DeleteLinkRequest>;
export interface DeletePeeringRequest {
  PeeringId: string;
}
export const DeletePeeringRequest = S.suspend(() =>
  S.Struct({ PeeringId: S.String.pipe(T.HttpLabel("PeeringId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/peerings/{PeeringId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePeeringRequest",
}) as any as S.Schema<DeletePeeringRequest>;
export interface DeleteResourcePolicyRequest {
  ResourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/resource-policy/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteSiteRequest {
  GlobalNetworkId: string;
  SiteId: string;
}
export const DeleteSiteRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    SiteId: S.String.pipe(T.HttpLabel("SiteId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteSiteRequest",
}) as any as S.Schema<DeleteSiteRequest>;
export interface DeregisterTransitGatewayRequest {
  GlobalNetworkId: string;
  TransitGatewayArn: string;
}
export const DeregisterTransitGatewayRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayArn: S.String.pipe(T.HttpLabel("TransitGatewayArn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeregisterTransitGatewayRequest",
}) as any as S.Schema<DeregisterTransitGatewayRequest>;
export interface DescribeGlobalNetworksRequest {
  GlobalNetworkIds?: GlobalNetworkIdList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeGlobalNetworksRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkIds: S.optional(GlobalNetworkIdList).pipe(
      T.HttpQuery("globalNetworkIds"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/global-networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeGlobalNetworksRequest",
}) as any as S.Schema<DescribeGlobalNetworksRequest>;
export interface DisassociateConnectPeerRequest {
  GlobalNetworkId: string;
  ConnectPeerId: string;
}
export const DisassociateConnectPeerRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectPeerId: S.String.pipe(T.HttpLabel("ConnectPeerId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateConnectPeerRequest",
}) as any as S.Schema<DisassociateConnectPeerRequest>;
export interface DisassociateCustomerGatewayRequest {
  GlobalNetworkId: string;
  CustomerGatewayArn: string;
}
export const DisassociateCustomerGatewayRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    CustomerGatewayArn: S.String.pipe(T.HttpLabel("CustomerGatewayArn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateCustomerGatewayRequest",
}) as any as S.Schema<DisassociateCustomerGatewayRequest>;
export interface DisassociateLinkRequest {
  GlobalNetworkId: string;
  DeviceId: string;
  LinkId: string;
}
export const DisassociateLinkRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.String.pipe(T.HttpQuery("deviceId")),
    LinkId: S.String.pipe(T.HttpQuery("linkId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateLinkRequest",
}) as any as S.Schema<DisassociateLinkRequest>;
export interface DisassociateTransitGatewayConnectPeerRequest {
  GlobalNetworkId: string;
  TransitGatewayConnectPeerArn: string;
}
export const DisassociateTransitGatewayConnectPeerRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayConnectPeerArn: S.String.pipe(
      T.HttpLabel("TransitGatewayConnectPeerArn"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateTransitGatewayConnectPeerRequest",
}) as any as S.Schema<DisassociateTransitGatewayConnectPeerRequest>;
export interface ExecuteCoreNetworkChangeSetRequest {
  CoreNetworkId: string;
  PolicyVersionId: number;
}
export const ExecuteCoreNetworkChangeSetRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ExecuteCoreNetworkChangeSetRequest",
}) as any as S.Schema<ExecuteCoreNetworkChangeSetRequest>;
export interface ExecuteCoreNetworkChangeSetResponse {}
export const ExecuteCoreNetworkChangeSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ExecuteCoreNetworkChangeSetResponse",
}) as any as S.Schema<ExecuteCoreNetworkChangeSetResponse>;
export interface GetConnectAttachmentRequest {
  AttachmentId: string;
}
export const GetConnectAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connect-attachments/{AttachmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectAttachmentRequest",
}) as any as S.Schema<GetConnectAttachmentRequest>;
export interface GetConnectionsRequest {
  GlobalNetworkId: string;
  ConnectionIds?: ConnectionIdList;
  DeviceId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetConnectionsRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectionIds: S.optional(ConnectionIdList).pipe(
      T.HttpQuery("connectionIds"),
    ),
    DeviceId: S.optional(S.String).pipe(T.HttpQuery("deviceId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetConnectionsRequest",
}) as any as S.Schema<GetConnectionsRequest>;
export interface GetConnectPeerRequest {
  ConnectPeerId: string;
}
export const GetConnectPeerRequest = S.suspend(() =>
  S.Struct({ ConnectPeerId: S.String.pipe(T.HttpLabel("ConnectPeerId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connect-peers/{ConnectPeerId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectPeerRequest",
}) as any as S.Schema<GetConnectPeerRequest>;
export interface GetConnectPeerAssociationsRequest {
  GlobalNetworkId: string;
  ConnectPeerIds?: ConnectPeerIdList;
  MaxResults?: number;
  NextToken?: string;
}
export const GetConnectPeerAssociationsRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectPeerIds: S.optional(ConnectPeerIdList).pipe(
      T.HttpQuery("connectPeerIds"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetConnectPeerAssociationsRequest",
}) as any as S.Schema<GetConnectPeerAssociationsRequest>;
export interface GetCoreNetworkRequest {
  CoreNetworkId: string;
}
export const GetCoreNetworkRequest = S.suspend(() =>
  S.Struct({ CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/core-networks/{CoreNetworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCoreNetworkRequest",
}) as any as S.Schema<GetCoreNetworkRequest>;
export interface GetCoreNetworkChangeEventsRequest {
  CoreNetworkId: string;
  PolicyVersionId: number;
  MaxResults?: number;
  NextToken?: string;
}
export const GetCoreNetworkChangeEventsRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCoreNetworkChangeEventsRequest",
}) as any as S.Schema<GetCoreNetworkChangeEventsRequest>;
export interface GetCoreNetworkChangeSetRequest {
  CoreNetworkId: string;
  PolicyVersionId: number;
  MaxResults?: number;
  NextToken?: string;
}
export const GetCoreNetworkChangeSetRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCoreNetworkChangeSetRequest",
}) as any as S.Schema<GetCoreNetworkChangeSetRequest>;
export interface GetCoreNetworkPolicyRequest {
  CoreNetworkId: string;
  PolicyVersionId?: number;
  Alias?: string;
}
export const GetCoreNetworkPolicyRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.optional(S.Number).pipe(T.HttpQuery("policyVersionId")),
    Alias: S.optional(S.String).pipe(T.HttpQuery("alias")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCoreNetworkPolicyRequest",
}) as any as S.Schema<GetCoreNetworkPolicyRequest>;
export interface GetCustomerGatewayAssociationsRequest {
  GlobalNetworkId: string;
  CustomerGatewayArns?: CustomerGatewayArnList;
  MaxResults?: number;
  NextToken?: string;
}
export const GetCustomerGatewayAssociationsRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    CustomerGatewayArns: S.optional(CustomerGatewayArnList).pipe(
      T.HttpQuery("customerGatewayArns"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCustomerGatewayAssociationsRequest",
}) as any as S.Schema<GetCustomerGatewayAssociationsRequest>;
export interface GetDevicesRequest {
  GlobalNetworkId: string;
  DeviceIds?: DeviceIdList;
  SiteId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetDevicesRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceIds: S.optional(DeviceIdList).pipe(T.HttpQuery("deviceIds")),
    SiteId: S.optional(S.String).pipe(T.HttpQuery("siteId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDevicesRequest",
}) as any as S.Schema<GetDevicesRequest>;
export interface GetDirectConnectGatewayAttachmentRequest {
  AttachmentId: string;
}
export const GetDirectConnectGatewayAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) }).pipe(
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
  ),
).annotations({
  identifier: "GetDirectConnectGatewayAttachmentRequest",
}) as any as S.Schema<GetDirectConnectGatewayAttachmentRequest>;
export interface GetLinkAssociationsRequest {
  GlobalNetworkId: string;
  DeviceId?: string;
  LinkId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetLinkAssociationsRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    DeviceId: S.optional(S.String).pipe(T.HttpQuery("deviceId")),
    LinkId: S.optional(S.String).pipe(T.HttpQuery("linkId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetLinkAssociationsRequest",
}) as any as S.Schema<GetLinkAssociationsRequest>;
export interface GetLinksRequest {
  GlobalNetworkId: string;
  LinkIds?: LinkIdList;
  SiteId?: string;
  Type?: string;
  Provider?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetLinksRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    LinkIds: S.optional(LinkIdList).pipe(T.HttpQuery("linkIds")),
    SiteId: S.optional(S.String).pipe(T.HttpQuery("siteId")),
    Type: S.optional(S.String).pipe(T.HttpQuery("type")),
    Provider: S.optional(S.String).pipe(T.HttpQuery("provider")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/global-networks/{GlobalNetworkId}/links",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLinksRequest",
}) as any as S.Schema<GetLinksRequest>;
export interface GetNetworkResourceCountsRequest {
  GlobalNetworkId: string;
  ResourceType?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetNetworkResourceCountsRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetNetworkResourceCountsRequest",
}) as any as S.Schema<GetNetworkResourceCountsRequest>;
export interface GetNetworkResourceRelationshipsRequest {
  GlobalNetworkId: string;
  CoreNetworkId?: string;
  RegisteredGatewayArn?: string;
  AwsRegion?: string;
  AccountId?: string;
  ResourceType?: string;
  ResourceArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetNetworkResourceRelationshipsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "GetNetworkResourceRelationshipsRequest",
}) as any as S.Schema<GetNetworkResourceRelationshipsRequest>;
export interface GetNetworkResourcesRequest {
  GlobalNetworkId: string;
  CoreNetworkId?: string;
  RegisteredGatewayArn?: string;
  AwsRegion?: string;
  AccountId?: string;
  ResourceType?: string;
  ResourceArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetNetworkResourcesRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "GetNetworkResourcesRequest",
}) as any as S.Schema<GetNetworkResourcesRequest>;
export interface GetNetworkTelemetryRequest {
  GlobalNetworkId: string;
  CoreNetworkId?: string;
  RegisteredGatewayArn?: string;
  AwsRegion?: string;
  AccountId?: string;
  ResourceType?: string;
  ResourceArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetNetworkTelemetryRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "GetNetworkTelemetryRequest",
}) as any as S.Schema<GetNetworkTelemetryRequest>;
export interface GetResourcePolicyRequest {
  ResourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resource-policy/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface GetRouteAnalysisRequest {
  GlobalNetworkId: string;
  RouteAnalysisId: string;
}
export const GetRouteAnalysisRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    RouteAnalysisId: S.String.pipe(T.HttpLabel("RouteAnalysisId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetRouteAnalysisRequest",
}) as any as S.Schema<GetRouteAnalysisRequest>;
export interface GetSitesRequest {
  GlobalNetworkId: string;
  SiteIds?: SiteIdList;
  MaxResults?: number;
  NextToken?: string;
}
export const GetSitesRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    SiteIds: S.optional(SiteIdList).pipe(T.HttpQuery("siteIds")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/global-networks/{GlobalNetworkId}/sites",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSitesRequest",
}) as any as S.Schema<GetSitesRequest>;
export interface GetSiteToSiteVpnAttachmentRequest {
  AttachmentId: string;
}
export const GetSiteToSiteVpnAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) }).pipe(
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
  ),
).annotations({
  identifier: "GetSiteToSiteVpnAttachmentRequest",
}) as any as S.Schema<GetSiteToSiteVpnAttachmentRequest>;
export interface GetTransitGatewayConnectPeerAssociationsRequest {
  GlobalNetworkId: string;
  TransitGatewayConnectPeerArns?: TransitGatewayConnectPeerArnList;
  MaxResults?: number;
  NextToken?: string;
}
export const GetTransitGatewayConnectPeerAssociationsRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayConnectPeerArns: S.optional(
      TransitGatewayConnectPeerArnList,
    ).pipe(T.HttpQuery("transitGatewayConnectPeerArns")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTransitGatewayConnectPeerAssociationsRequest",
}) as any as S.Schema<GetTransitGatewayConnectPeerAssociationsRequest>;
export interface GetTransitGatewayPeeringRequest {
  PeeringId: string;
}
export const GetTransitGatewayPeeringRequest = S.suspend(() =>
  S.Struct({ PeeringId: S.String.pipe(T.HttpLabel("PeeringId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/transit-gateway-peerings/{PeeringId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTransitGatewayPeeringRequest",
}) as any as S.Schema<GetTransitGatewayPeeringRequest>;
export interface GetTransitGatewayRegistrationsRequest {
  GlobalNetworkId: string;
  TransitGatewayArns?: TransitGatewayArnList;
  MaxResults?: number;
  NextToken?: string;
}
export const GetTransitGatewayRegistrationsRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayArns: S.optional(TransitGatewayArnList).pipe(
      T.HttpQuery("transitGatewayArns"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTransitGatewayRegistrationsRequest",
}) as any as S.Schema<GetTransitGatewayRegistrationsRequest>;
export interface GetTransitGatewayRouteTableAttachmentRequest {
  AttachmentId: string;
}
export const GetTransitGatewayRouteTableAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) }).pipe(
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
  ),
).annotations({
  identifier: "GetTransitGatewayRouteTableAttachmentRequest",
}) as any as S.Schema<GetTransitGatewayRouteTableAttachmentRequest>;
export interface GetVpcAttachmentRequest {
  AttachmentId: string;
}
export const GetVpcAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vpc-attachments/{AttachmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVpcAttachmentRequest",
}) as any as S.Schema<GetVpcAttachmentRequest>;
export interface ListAttachmentRoutingPolicyAssociationsRequest {
  CoreNetworkId: string;
  AttachmentId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAttachmentRoutingPolicyAssociationsRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    AttachmentId: S.optional(S.String).pipe(T.HttpQuery("attachmentId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListAttachmentRoutingPolicyAssociationsRequest",
}) as any as S.Schema<ListAttachmentRoutingPolicyAssociationsRequest>;
export interface ListAttachmentsRequest {
  CoreNetworkId?: string;
  AttachmentType?: string;
  EdgeLocation?: string;
  State?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAttachmentsRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String).pipe(T.HttpQuery("coreNetworkId")),
    AttachmentType: S.optional(S.String).pipe(T.HttpQuery("attachmentType")),
    EdgeLocation: S.optional(S.String).pipe(T.HttpQuery("edgeLocation")),
    State: S.optional(S.String).pipe(T.HttpQuery("state")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/attachments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAttachmentsRequest",
}) as any as S.Schema<ListAttachmentsRequest>;
export interface ListConnectPeersRequest {
  CoreNetworkId?: string;
  ConnectAttachmentId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListConnectPeersRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String).pipe(T.HttpQuery("coreNetworkId")),
    ConnectAttachmentId: S.optional(S.String).pipe(
      T.HttpQuery("connectAttachmentId"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connect-peers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectPeersRequest",
}) as any as S.Schema<ListConnectPeersRequest>;
export interface ListCoreNetworkPolicyVersionsRequest {
  CoreNetworkId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCoreNetworkPolicyVersionsRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListCoreNetworkPolicyVersionsRequest",
}) as any as S.Schema<ListCoreNetworkPolicyVersionsRequest>;
export interface ListCoreNetworkPrefixListAssociationsRequest {
  CoreNetworkId: string;
  PrefixListArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCoreNetworkPrefixListAssociationsRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PrefixListArn: S.optional(S.String).pipe(T.HttpQuery("prefixListArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prefix-list/core-network/{CoreNetworkId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCoreNetworkPrefixListAssociationsRequest",
}) as any as S.Schema<ListCoreNetworkPrefixListAssociationsRequest>;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export type FilterMap = { [key: string]: FilterValues };
export const FilterMap = S.Record({ key: S.String, value: FilterValues });
export interface ListCoreNetworkRoutingInformationRequest {
  CoreNetworkId: string;
  SegmentName: string;
  EdgeLocation: string;
  NextHopFilters?: FilterMap;
  LocalPreferenceMatches?: ConstrainedStringList;
  ExactAsPathMatches?: ConstrainedStringList;
  MedMatches?: ConstrainedStringList;
  CommunityMatches?: ConstrainedStringList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCoreNetworkRoutingInformationRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "ListCoreNetworkRoutingInformationRequest",
}) as any as S.Schema<ListCoreNetworkRoutingInformationRequest>;
export interface ListCoreNetworksRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListCoreNetworksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/core-networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCoreNetworksRequest",
}) as any as S.Schema<ListCoreNetworksRequest>;
export interface ListOrganizationServiceAccessStatusRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListOrganizationServiceAccessStatusRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/organizations/service-access" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOrganizationServiceAccessStatusRequest",
}) as any as S.Schema<ListOrganizationServiceAccessStatusRequest>;
export interface ListPeeringsRequest {
  CoreNetworkId?: string;
  PeeringType?: string;
  EdgeLocation?: string;
  State?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPeeringsRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String).pipe(T.HttpQuery("coreNetworkId")),
    PeeringType: S.optional(S.String).pipe(T.HttpQuery("peeringType")),
    EdgeLocation: S.optional(S.String).pipe(T.HttpQuery("edgeLocation")),
    State: S.optional(S.String).pipe(T.HttpQuery("state")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/peerings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPeeringsRequest",
}) as any as S.Schema<ListPeeringsRequest>;
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
export interface PutAttachmentRoutingPolicyLabelRequest {
  CoreNetworkId: string;
  AttachmentId: string;
  RoutingPolicyLabel: string;
  ClientToken?: string;
}
export const PutAttachmentRoutingPolicyLabelRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String,
    AttachmentId: S.String,
    RoutingPolicyLabel: S.String,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/routing-policy-label" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAttachmentRoutingPolicyLabelRequest",
}) as any as S.Schema<PutAttachmentRoutingPolicyLabelRequest>;
export interface PutCoreNetworkPolicyRequest {
  CoreNetworkId: string;
  PolicyDocument: string;
  Description?: string;
  LatestVersionId?: number;
  ClientToken?: string;
}
export const PutCoreNetworkPolicyRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyDocument: S.String,
    Description: S.optional(S.String),
    LatestVersionId: S.optional(S.Number),
    ClientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutCoreNetworkPolicyRequest",
}) as any as S.Schema<PutCoreNetworkPolicyRequest>;
export interface PutResourcePolicyRequest {
  PolicyDocument: string;
  ResourceArn: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyDocument: S.String,
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resource-policy/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface PutResourcePolicyResponse {}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface RegisterTransitGatewayRequest {
  GlobalNetworkId: string;
  TransitGatewayArn: string;
}
export const RegisterTransitGatewayRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    TransitGatewayArn: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "RegisterTransitGatewayRequest",
}) as any as S.Schema<RegisterTransitGatewayRequest>;
export interface RejectAttachmentRequest {
  AttachmentId: string;
}
export const RejectAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/attachments/{AttachmentId}/reject" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectAttachmentRequest",
}) as any as S.Schema<RejectAttachmentRequest>;
export interface RemoveAttachmentRoutingPolicyLabelRequest {
  CoreNetworkId: string;
  AttachmentId: string;
}
export const RemoveAttachmentRoutingPolicyLabelRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "RemoveAttachmentRoutingPolicyLabelRequest",
}) as any as S.Schema<RemoveAttachmentRoutingPolicyLabelRequest>;
export interface RestoreCoreNetworkPolicyVersionRequest {
  CoreNetworkId: string;
  PolicyVersionId: number;
}
export const RestoreCoreNetworkPolicyVersionRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    PolicyVersionId: S.Number.pipe(T.HttpLabel("PolicyVersionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "RestoreCoreNetworkPolicyVersionRequest",
}) as any as S.Schema<RestoreCoreNetworkPolicyVersionRequest>;
export interface StartOrganizationServiceAccessUpdateRequest {
  Action: string;
}
export const StartOrganizationServiceAccessUpdateRequest = S.suspend(() =>
  S.Struct({ Action: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/organizations/service-access" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartOrganizationServiceAccessUpdateRequest",
}) as any as S.Schema<StartOrganizationServiceAccessUpdateRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
  TagKeys: TagKeyList;
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
export interface UpdateConnectionRequest {
  GlobalNetworkId: string;
  ConnectionId: string;
  LinkId?: string;
  ConnectedLinkId?: string;
  Description?: string;
}
export const UpdateConnectionRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")),
    LinkId: S.optional(S.String),
    ConnectedLinkId: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateConnectionRequest",
}) as any as S.Schema<UpdateConnectionRequest>;
export interface UpdateCoreNetworkRequest {
  CoreNetworkId: string;
  Description?: string;
}
export const UpdateCoreNetworkRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String.pipe(T.HttpLabel("CoreNetworkId")),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/core-networks/{CoreNetworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCoreNetworkRequest",
}) as any as S.Schema<UpdateCoreNetworkRequest>;
export interface AWSLocation {
  Zone?: string;
  SubnetArn?: string;
}
export const AWSLocation = S.suspend(() =>
  S.Struct({ Zone: S.optional(S.String), SubnetArn: S.optional(S.String) }),
).annotations({ identifier: "AWSLocation" }) as any as S.Schema<AWSLocation>;
export interface UpdateDeviceRequest {
  GlobalNetworkId: string;
  DeviceId: string;
  AWSLocation?: AWSLocation;
  Description?: string;
  Type?: string;
  Vendor?: string;
  Model?: string;
  SerialNumber?: string;
  Location?: Location;
  SiteId?: string;
}
export const UpdateDeviceRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDeviceRequest",
}) as any as S.Schema<UpdateDeviceRequest>;
export interface UpdateDirectConnectGatewayAttachmentRequest {
  AttachmentId: string;
  EdgeLocations?: ExternalRegionCodeList;
}
export const UpdateDirectConnectGatewayAttachmentRequest = S.suspend(() =>
  S.Struct({
    AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")),
    EdgeLocations: S.optional(ExternalRegionCodeList),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDirectConnectGatewayAttachmentRequest",
}) as any as S.Schema<UpdateDirectConnectGatewayAttachmentRequest>;
export interface UpdateGlobalNetworkRequest {
  GlobalNetworkId: string;
  Description?: string;
}
export const UpdateGlobalNetworkRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/global-networks/{GlobalNetworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGlobalNetworkRequest",
}) as any as S.Schema<UpdateGlobalNetworkRequest>;
export interface Bandwidth {
  UploadSpeed?: number;
  DownloadSpeed?: number;
}
export const Bandwidth = S.suspend(() =>
  S.Struct({
    UploadSpeed: S.optional(S.Number),
    DownloadSpeed: S.optional(S.Number),
  }),
).annotations({ identifier: "Bandwidth" }) as any as S.Schema<Bandwidth>;
export interface UpdateLinkRequest {
  GlobalNetworkId: string;
  LinkId: string;
  Description?: string;
  Type?: string;
  Bandwidth?: Bandwidth;
  Provider?: string;
}
export const UpdateLinkRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    LinkId: S.String.pipe(T.HttpLabel("LinkId")),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    Bandwidth: S.optional(Bandwidth),
    Provider: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateLinkRequest",
}) as any as S.Schema<UpdateLinkRequest>;
export interface UpdateSiteRequest {
  GlobalNetworkId: string;
  SiteId: string;
  Description?: string;
  Location?: Location;
}
export const UpdateSiteRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    SiteId: S.String.pipe(T.HttpLabel("SiteId")),
    Description: S.optional(S.String),
    Location: S.optional(Location),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateSiteRequest",
}) as any as S.Schema<UpdateSiteRequest>;
export interface VpcOptions {
  Ipv6Support?: boolean;
  ApplianceModeSupport?: boolean;
  DnsSupport?: boolean;
  SecurityGroupReferencingSupport?: boolean;
}
export const VpcOptions = S.suspend(() =>
  S.Struct({
    Ipv6Support: S.optional(S.Boolean),
    ApplianceModeSupport: S.optional(S.Boolean),
    DnsSupport: S.optional(S.Boolean),
    SecurityGroupReferencingSupport: S.optional(S.Boolean),
  }),
).annotations({ identifier: "VpcOptions" }) as any as S.Schema<VpcOptions>;
export interface UpdateVpcAttachmentRequest {
  AttachmentId: string;
  AddSubnetArns?: SubnetArnList;
  RemoveSubnetArns?: SubnetArnList;
  Options?: VpcOptions;
}
export const UpdateVpcAttachmentRequest = S.suspend(() =>
  S.Struct({
    AttachmentId: S.String.pipe(T.HttpLabel("AttachmentId")),
    AddSubnetArns: S.optional(SubnetArnList),
    RemoveSubnetArns: S.optional(SubnetArnList),
    Options: S.optional(VpcOptions),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/vpc-attachments/{AttachmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVpcAttachmentRequest",
}) as any as S.Schema<UpdateVpcAttachmentRequest>;
export interface ConnectAttachmentOptions {
  Protocol?: string;
}
export const ConnectAttachmentOptions = S.suspend(() =>
  S.Struct({ Protocol: S.optional(S.String) }),
).annotations({
  identifier: "ConnectAttachmentOptions",
}) as any as S.Schema<ConnectAttachmentOptions>;
export interface BgpOptions {
  PeerAsn?: number;
}
export const BgpOptions = S.suspend(() =>
  S.Struct({ PeerAsn: S.optional(S.Number) }),
).annotations({ identifier: "BgpOptions" }) as any as S.Schema<BgpOptions>;
export interface GlobalNetwork {
  GlobalNetworkId?: string;
  GlobalNetworkArn?: string;
  Description?: string;
  CreatedAt?: Date;
  State?: string;
  Tags?: TagList;
}
export const GlobalNetwork = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.optional(S.String),
    GlobalNetworkArn: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    State: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "GlobalNetwork",
}) as any as S.Schema<GlobalNetwork>;
export type GlobalNetworkList = GlobalNetwork[];
export const GlobalNetworkList = S.Array(GlobalNetwork);
export interface Connection {
  ConnectionId?: string;
  ConnectionArn?: string;
  GlobalNetworkId?: string;
  DeviceId?: string;
  ConnectedDeviceId?: string;
  LinkId?: string;
  ConnectedLinkId?: string;
  Description?: string;
  CreatedAt?: Date;
  State?: string;
  Tags?: TagList;
}
export const Connection = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Connection" }) as any as S.Schema<Connection>;
export type ConnectionList = Connection[];
export const ConnectionList = S.Array(Connection);
export interface ConnectPeerAssociation {
  ConnectPeerId?: string;
  GlobalNetworkId?: string;
  DeviceId?: string;
  LinkId?: string;
  State?: string;
}
export const ConnectPeerAssociation = S.suspend(() =>
  S.Struct({
    ConnectPeerId: S.optional(S.String),
    GlobalNetworkId: S.optional(S.String),
    DeviceId: S.optional(S.String),
    LinkId: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectPeerAssociation",
}) as any as S.Schema<ConnectPeerAssociation>;
export type ConnectPeerAssociationList = ConnectPeerAssociation[];
export const ConnectPeerAssociationList = S.Array(ConnectPeerAssociation);
export interface CustomerGatewayAssociation {
  CustomerGatewayArn?: string;
  GlobalNetworkId?: string;
  DeviceId?: string;
  LinkId?: string;
  State?: string;
}
export const CustomerGatewayAssociation = S.suspend(() =>
  S.Struct({
    CustomerGatewayArn: S.optional(S.String),
    GlobalNetworkId: S.optional(S.String),
    DeviceId: S.optional(S.String),
    LinkId: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomerGatewayAssociation",
}) as any as S.Schema<CustomerGatewayAssociation>;
export type CustomerGatewayAssociationList = CustomerGatewayAssociation[];
export const CustomerGatewayAssociationList = S.Array(
  CustomerGatewayAssociation,
);
export interface Device {
  DeviceId?: string;
  DeviceArn?: string;
  GlobalNetworkId?: string;
  AWSLocation?: AWSLocation;
  Description?: string;
  Type?: string;
  Vendor?: string;
  Model?: string;
  SerialNumber?: string;
  Location?: Location;
  SiteId?: string;
  CreatedAt?: Date;
  State?: string;
  Tags?: TagList;
}
export const Device = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Device" }) as any as S.Schema<Device>;
export type DeviceList = Device[];
export const DeviceList = S.Array(Device);
export interface LinkAssociation {
  GlobalNetworkId?: string;
  DeviceId?: string;
  LinkId?: string;
  LinkAssociationState?: string;
}
export const LinkAssociation = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.optional(S.String),
    DeviceId: S.optional(S.String),
    LinkId: S.optional(S.String),
    LinkAssociationState: S.optional(S.String),
  }),
).annotations({
  identifier: "LinkAssociation",
}) as any as S.Schema<LinkAssociation>;
export type LinkAssociationList = LinkAssociation[];
export const LinkAssociationList = S.Array(LinkAssociation);
export interface Link {
  LinkId?: string;
  LinkArn?: string;
  GlobalNetworkId?: string;
  SiteId?: string;
  Description?: string;
  Type?: string;
  Bandwidth?: Bandwidth;
  Provider?: string;
  CreatedAt?: Date;
  State?: string;
  Tags?: TagList;
}
export const Link = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Link" }) as any as S.Schema<Link>;
export type LinkList = Link[];
export const LinkList = S.Array(Link);
export interface Site {
  SiteId?: string;
  SiteArn?: string;
  GlobalNetworkId?: string;
  Description?: string;
  Location?: Location;
  CreatedAt?: Date;
  State?: string;
  Tags?: TagList;
}
export const Site = S.suspend(() =>
  S.Struct({
    SiteId: S.optional(S.String),
    SiteArn: S.optional(S.String),
    GlobalNetworkId: S.optional(S.String),
    Description: S.optional(S.String),
    Location: S.optional(Location),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    State: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({ identifier: "Site" }) as any as S.Schema<Site>;
export type SiteList = Site[];
export const SiteList = S.Array(Site);
export interface TransitGatewayConnectPeerAssociation {
  TransitGatewayConnectPeerArn?: string;
  GlobalNetworkId?: string;
  DeviceId?: string;
  LinkId?: string;
  State?: string;
}
export const TransitGatewayConnectPeerAssociation = S.suspend(() =>
  S.Struct({
    TransitGatewayConnectPeerArn: S.optional(S.String),
    GlobalNetworkId: S.optional(S.String),
    DeviceId: S.optional(S.String),
    LinkId: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "TransitGatewayConnectPeerAssociation",
}) as any as S.Schema<TransitGatewayConnectPeerAssociation>;
export type TransitGatewayConnectPeerAssociationList =
  TransitGatewayConnectPeerAssociation[];
export const TransitGatewayConnectPeerAssociationList = S.Array(
  TransitGatewayConnectPeerAssociation,
);
export interface TransitGatewayRegistrationStateReason {
  Code?: string;
  Message?: string;
}
export const TransitGatewayRegistrationStateReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "TransitGatewayRegistrationStateReason",
}) as any as S.Schema<TransitGatewayRegistrationStateReason>;
export interface TransitGatewayRegistration {
  GlobalNetworkId?: string;
  TransitGatewayArn?: string;
  State?: TransitGatewayRegistrationStateReason;
}
export const TransitGatewayRegistration = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.optional(S.String),
    TransitGatewayArn: S.optional(S.String),
    State: S.optional(TransitGatewayRegistrationStateReason),
  }),
).annotations({
  identifier: "TransitGatewayRegistration",
}) as any as S.Schema<TransitGatewayRegistration>;
export type TransitGatewayRegistrationList = TransitGatewayRegistration[];
export const TransitGatewayRegistrationList = S.Array(
  TransitGatewayRegistration,
);
export interface ProposedSegmentChange {
  Tags?: TagList;
  AttachmentPolicyRuleNumber?: number;
  SegmentName?: string;
}
export const ProposedSegmentChange = S.suspend(() =>
  S.Struct({
    Tags: S.optional(TagList),
    AttachmentPolicyRuleNumber: S.optional(S.Number),
    SegmentName: S.optional(S.String),
  }),
).annotations({
  identifier: "ProposedSegmentChange",
}) as any as S.Schema<ProposedSegmentChange>;
export interface ProposedNetworkFunctionGroupChange {
  Tags?: TagList;
  AttachmentPolicyRuleNumber?: number;
  NetworkFunctionGroupName?: string;
}
export const ProposedNetworkFunctionGroupChange = S.suspend(() =>
  S.Struct({
    Tags: S.optional(TagList),
    AttachmentPolicyRuleNumber: S.optional(S.Number),
    NetworkFunctionGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "ProposedNetworkFunctionGroupChange",
}) as any as S.Schema<ProposedNetworkFunctionGroupChange>;
export interface AttachmentError {
  Code?: string;
  Message?: string;
  ResourceArn?: string;
  RequestId?: string;
}
export const AttachmentError = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    RequestId: S.optional(S.String),
  }),
).annotations({
  identifier: "AttachmentError",
}) as any as S.Schema<AttachmentError>;
export type AttachmentErrorList = AttachmentError[];
export const AttachmentErrorList = S.Array(AttachmentError);
export interface Attachment {
  CoreNetworkId?: string;
  CoreNetworkArn?: string;
  AttachmentId?: string;
  OwnerAccountId?: string;
  AttachmentType?: string;
  State?: string;
  EdgeLocation?: string;
  EdgeLocations?: ExternalRegionCodeList;
  ResourceArn?: string;
  AttachmentPolicyRuleNumber?: number;
  SegmentName?: string;
  NetworkFunctionGroupName?: string;
  Tags?: TagList;
  ProposedSegmentChange?: ProposedSegmentChange;
  ProposedNetworkFunctionGroupChange?: ProposedNetworkFunctionGroupChange;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  LastModificationErrors?: AttachmentErrorList;
}
export const Attachment = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Attachment" }) as any as S.Schema<Attachment>;
export type AttachmentList = Attachment[];
export const AttachmentList = S.Array(Attachment);
export interface PermissionsErrorContext {
  MissingPermission?: string;
}
export const PermissionsErrorContext = S.suspend(() =>
  S.Struct({ MissingPermission: S.optional(S.String) }),
).annotations({
  identifier: "PermissionsErrorContext",
}) as any as S.Schema<PermissionsErrorContext>;
export interface PeeringError {
  Code?: string;
  Message?: string;
  ResourceArn?: string;
  RequestId?: string;
  MissingPermissionsContext?: PermissionsErrorContext;
}
export const PeeringError = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    RequestId: S.optional(S.String),
    MissingPermissionsContext: S.optional(PermissionsErrorContext),
  }),
).annotations({ identifier: "PeeringError" }) as any as S.Schema<PeeringError>;
export type PeeringErrorList = PeeringError[];
export const PeeringErrorList = S.Array(PeeringError);
export interface Peering {
  CoreNetworkId?: string;
  CoreNetworkArn?: string;
  PeeringId?: string;
  OwnerAccountId?: string;
  PeeringType?: string;
  State?: string;
  EdgeLocation?: string;
  ResourceArn?: string;
  Tags?: TagList;
  CreatedAt?: Date;
  LastModificationErrors?: PeeringErrorList;
}
export const Peering = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Peering" }) as any as S.Schema<Peering>;
export type PeeringList = Peering[];
export const PeeringList = S.Array(Peering);
export interface RouteAnalysisEndpointOptionsSpecification {
  TransitGatewayAttachmentArn?: string;
  IpAddress?: string;
}
export const RouteAnalysisEndpointOptionsSpecification = S.suspend(() =>
  S.Struct({
    TransitGatewayAttachmentArn: S.optional(S.String),
    IpAddress: S.optional(S.String),
  }),
).annotations({
  identifier: "RouteAnalysisEndpointOptionsSpecification",
}) as any as S.Schema<RouteAnalysisEndpointOptionsSpecification>;
export type NetworkResourceMetadataMap = { [key: string]: string };
export const NetworkResourceMetadataMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface CreateConnectAttachmentRequest {
  CoreNetworkId: string;
  EdgeLocation: string;
  TransportAttachmentId: string;
  RoutingPolicyLabel?: string;
  Options: ConnectAttachmentOptions;
  Tags?: TagList;
  ClientToken?: string;
}
export const CreateConnectAttachmentRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String,
    EdgeLocation: S.String,
    TransportAttachmentId: S.String,
    RoutingPolicyLabel: S.optional(S.String),
    Options: ConnectAttachmentOptions,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/connect-attachments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectAttachmentRequest",
}) as any as S.Schema<CreateConnectAttachmentRequest>;
export interface CreateConnectPeerRequest {
  ConnectAttachmentId: string;
  CoreNetworkAddress?: string;
  PeerAddress: string;
  BgpOptions?: BgpOptions;
  InsideCidrBlocks?: ConstrainedStringList;
  Tags?: TagList;
  ClientToken?: string;
  SubnetArn?: string;
}
export const CreateConnectPeerRequest = S.suspend(() =>
  S.Struct({
    ConnectAttachmentId: S.String,
    CoreNetworkAddress: S.optional(S.String),
    PeerAddress: S.String,
    BgpOptions: S.optional(BgpOptions),
    InsideCidrBlocks: S.optional(ConstrainedStringList),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
    SubnetArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/connect-peers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectPeerRequest",
}) as any as S.Schema<CreateConnectPeerRequest>;
export interface CreateCoreNetworkPrefixListAssociationResponse {
  CoreNetworkId?: string;
  PrefixListArn?: string;
  PrefixListAlias?: string;
}
export const CreateCoreNetworkPrefixListAssociationResponse = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    PrefixListArn: S.optional(S.String),
    PrefixListAlias: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateCoreNetworkPrefixListAssociationResponse",
}) as any as S.Schema<CreateCoreNetworkPrefixListAssociationResponse>;
export interface CreateDeviceRequest {
  GlobalNetworkId: string;
  AWSLocation?: AWSLocation;
  Description?: string;
  Type?: string;
  Vendor?: string;
  Model?: string;
  SerialNumber?: string;
  Location?: Location;
  SiteId?: string;
  Tags?: TagList;
}
export const CreateDeviceRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDeviceRequest",
}) as any as S.Schema<CreateDeviceRequest>;
export interface CreateLinkRequest {
  GlobalNetworkId: string;
  Description?: string;
  Type?: string;
  Bandwidth: Bandwidth;
  Provider?: string;
  SiteId: string;
  Tags?: TagList;
}
export const CreateLinkRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    Bandwidth: Bandwidth,
    Provider: S.optional(S.String),
    SiteId: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/global-networks/{GlobalNetworkId}/links",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLinkRequest",
}) as any as S.Schema<CreateLinkRequest>;
export interface CreateVpcAttachmentRequest {
  CoreNetworkId: string;
  VpcArn: string;
  SubnetArns: SubnetArnList;
  Options?: VpcOptions;
  RoutingPolicyLabel?: string;
  Tags?: TagList;
  ClientToken?: string;
}
export const CreateVpcAttachmentRequest = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.String,
    VpcArn: S.String,
    SubnetArns: SubnetArnList,
    Options: S.optional(VpcOptions),
    RoutingPolicyLabel: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/vpc-attachments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVpcAttachmentRequest",
}) as any as S.Schema<CreateVpcAttachmentRequest>;
export interface DeleteAttachmentResponse {
  Attachment?: Attachment;
}
export const DeleteAttachmentResponse = S.suspend(() =>
  S.Struct({ Attachment: S.optional(Attachment) }),
).annotations({
  identifier: "DeleteAttachmentResponse",
}) as any as S.Schema<DeleteAttachmentResponse>;
export interface DeleteConnectionResponse {
  Connection?: Connection;
}
export const DeleteConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: S.optional(Connection) }),
).annotations({
  identifier: "DeleteConnectionResponse",
}) as any as S.Schema<DeleteConnectionResponse>;
export interface CoreNetworkSegment {
  Name?: string;
  EdgeLocations?: ExternalRegionCodeList;
  SharedSegments?: ConstrainedStringList;
}
export const CoreNetworkSegment = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    EdgeLocations: S.optional(ExternalRegionCodeList),
    SharedSegments: S.optional(ConstrainedStringList),
  }),
).annotations({
  identifier: "CoreNetworkSegment",
}) as any as S.Schema<CoreNetworkSegment>;
export type CoreNetworkSegmentList = CoreNetworkSegment[];
export const CoreNetworkSegmentList = S.Array(CoreNetworkSegment);
export interface ServiceInsertionSegments {
  SendVia?: ConstrainedStringList;
  SendTo?: ConstrainedStringList;
}
export const ServiceInsertionSegments = S.suspend(() =>
  S.Struct({
    SendVia: S.optional(ConstrainedStringList),
    SendTo: S.optional(ConstrainedStringList),
  }),
).annotations({
  identifier: "ServiceInsertionSegments",
}) as any as S.Schema<ServiceInsertionSegments>;
export interface CoreNetworkNetworkFunctionGroup {
  Name?: string;
  EdgeLocations?: ExternalRegionCodeList;
  Segments?: ServiceInsertionSegments;
}
export const CoreNetworkNetworkFunctionGroup = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    EdgeLocations: S.optional(ExternalRegionCodeList),
    Segments: S.optional(ServiceInsertionSegments),
  }),
).annotations({
  identifier: "CoreNetworkNetworkFunctionGroup",
}) as any as S.Schema<CoreNetworkNetworkFunctionGroup>;
export type CoreNetworkNetworkFunctionGroupList =
  CoreNetworkNetworkFunctionGroup[];
export const CoreNetworkNetworkFunctionGroupList = S.Array(
  CoreNetworkNetworkFunctionGroup,
);
export interface CoreNetworkEdge {
  EdgeLocation?: string;
  Asn?: number;
  InsideCidrBlocks?: ConstrainedStringList;
}
export const CoreNetworkEdge = S.suspend(() =>
  S.Struct({
    EdgeLocation: S.optional(S.String),
    Asn: S.optional(S.Number),
    InsideCidrBlocks: S.optional(ConstrainedStringList),
  }),
).annotations({
  identifier: "CoreNetworkEdge",
}) as any as S.Schema<CoreNetworkEdge>;
export type CoreNetworkEdgeList = CoreNetworkEdge[];
export const CoreNetworkEdgeList = S.Array(CoreNetworkEdge);
export interface CoreNetwork {
  GlobalNetworkId?: string;
  CoreNetworkId?: string;
  CoreNetworkArn?: string;
  Description?: string;
  CreatedAt?: Date;
  State?: string;
  Segments?: CoreNetworkSegmentList;
  NetworkFunctionGroups?: CoreNetworkNetworkFunctionGroupList;
  Edges?: CoreNetworkEdgeList;
  Tags?: TagList;
}
export const CoreNetwork = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "CoreNetwork" }) as any as S.Schema<CoreNetwork>;
export interface DeleteCoreNetworkResponse {
  CoreNetwork?: CoreNetwork;
}
export const DeleteCoreNetworkResponse = S.suspend(() =>
  S.Struct({ CoreNetwork: S.optional(CoreNetwork) }),
).annotations({
  identifier: "DeleteCoreNetworkResponse",
}) as any as S.Schema<DeleteCoreNetworkResponse>;
export interface DeleteCoreNetworkPrefixListAssociationResponse {
  CoreNetworkId?: string;
  PrefixListArn?: string;
}
export const DeleteCoreNetworkPrefixListAssociationResponse = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    PrefixListArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteCoreNetworkPrefixListAssociationResponse",
}) as any as S.Schema<DeleteCoreNetworkPrefixListAssociationResponse>;
export interface DeleteGlobalNetworkResponse {
  GlobalNetwork?: GlobalNetwork;
}
export const DeleteGlobalNetworkResponse = S.suspend(() =>
  S.Struct({ GlobalNetwork: S.optional(GlobalNetwork) }),
).annotations({
  identifier: "DeleteGlobalNetworkResponse",
}) as any as S.Schema<DeleteGlobalNetworkResponse>;
export interface DeleteSiteResponse {
  Site?: Site;
}
export const DeleteSiteResponse = S.suspend(() =>
  S.Struct({ Site: S.optional(Site) }),
).annotations({
  identifier: "DeleteSiteResponse",
}) as any as S.Schema<DeleteSiteResponse>;
export interface DescribeGlobalNetworksResponse {
  GlobalNetworks?: GlobalNetworkList;
  NextToken?: string;
}
export const DescribeGlobalNetworksResponse = S.suspend(() =>
  S.Struct({
    GlobalNetworks: S.optional(GlobalNetworkList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeGlobalNetworksResponse",
}) as any as S.Schema<DescribeGlobalNetworksResponse>;
export interface DisassociateConnectPeerResponse {
  ConnectPeerAssociation?: ConnectPeerAssociation;
}
export const DisassociateConnectPeerResponse = S.suspend(() =>
  S.Struct({ ConnectPeerAssociation: S.optional(ConnectPeerAssociation) }),
).annotations({
  identifier: "DisassociateConnectPeerResponse",
}) as any as S.Schema<DisassociateConnectPeerResponse>;
export interface DisassociateCustomerGatewayResponse {
  CustomerGatewayAssociation?: CustomerGatewayAssociation;
}
export const DisassociateCustomerGatewayResponse = S.suspend(() =>
  S.Struct({
    CustomerGatewayAssociation: S.optional(CustomerGatewayAssociation),
  }),
).annotations({
  identifier: "DisassociateCustomerGatewayResponse",
}) as any as S.Schema<DisassociateCustomerGatewayResponse>;
export interface DisassociateLinkResponse {
  LinkAssociation?: LinkAssociation;
}
export const DisassociateLinkResponse = S.suspend(() =>
  S.Struct({ LinkAssociation: S.optional(LinkAssociation) }),
).annotations({
  identifier: "DisassociateLinkResponse",
}) as any as S.Schema<DisassociateLinkResponse>;
export interface DisassociateTransitGatewayConnectPeerResponse {
  TransitGatewayConnectPeerAssociation?: TransitGatewayConnectPeerAssociation;
}
export const DisassociateTransitGatewayConnectPeerResponse = S.suspend(() =>
  S.Struct({
    TransitGatewayConnectPeerAssociation: S.optional(
      TransitGatewayConnectPeerAssociation,
    ),
  }),
).annotations({
  identifier: "DisassociateTransitGatewayConnectPeerResponse",
}) as any as S.Schema<DisassociateTransitGatewayConnectPeerResponse>;
export interface GetConnectionsResponse {
  Connections?: ConnectionList;
  NextToken?: string;
}
export const GetConnectionsResponse = S.suspend(() =>
  S.Struct({
    Connections: S.optional(ConnectionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetConnectionsResponse",
}) as any as S.Schema<GetConnectionsResponse>;
export interface ConnectPeerBgpConfiguration {
  CoreNetworkAsn?: number;
  PeerAsn?: number;
  CoreNetworkAddress?: string;
  PeerAddress?: string;
}
export const ConnectPeerBgpConfiguration = S.suspend(() =>
  S.Struct({
    CoreNetworkAsn: S.optional(S.Number),
    PeerAsn: S.optional(S.Number),
    CoreNetworkAddress: S.optional(S.String),
    PeerAddress: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectPeerBgpConfiguration",
}) as any as S.Schema<ConnectPeerBgpConfiguration>;
export type ConnectPeerBgpConfigurationList = ConnectPeerBgpConfiguration[];
export const ConnectPeerBgpConfigurationList = S.Array(
  ConnectPeerBgpConfiguration,
);
export interface ConnectPeerConfiguration {
  CoreNetworkAddress?: string;
  PeerAddress?: string;
  InsideCidrBlocks?: ConstrainedStringList;
  Protocol?: string;
  BgpConfigurations?: ConnectPeerBgpConfigurationList;
}
export const ConnectPeerConfiguration = S.suspend(() =>
  S.Struct({
    CoreNetworkAddress: S.optional(S.String),
    PeerAddress: S.optional(S.String),
    InsideCidrBlocks: S.optional(ConstrainedStringList),
    Protocol: S.optional(S.String),
    BgpConfigurations: S.optional(ConnectPeerBgpConfigurationList),
  }),
).annotations({
  identifier: "ConnectPeerConfiguration",
}) as any as S.Schema<ConnectPeerConfiguration>;
export interface ConnectPeerError {
  Code?: string;
  Message?: string;
  ResourceArn?: string;
  RequestId?: string;
}
export const ConnectPeerError = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    RequestId: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectPeerError",
}) as any as S.Schema<ConnectPeerError>;
export type ConnectPeerErrorList = ConnectPeerError[];
export const ConnectPeerErrorList = S.Array(ConnectPeerError);
export interface ConnectPeer {
  CoreNetworkId?: string;
  ConnectAttachmentId?: string;
  ConnectPeerId?: string;
  EdgeLocation?: string;
  State?: string;
  CreatedAt?: Date;
  Configuration?: ConnectPeerConfiguration;
  Tags?: TagList;
  SubnetArn?: string;
  LastModificationErrors?: ConnectPeerErrorList;
}
export const ConnectPeer = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "ConnectPeer" }) as any as S.Schema<ConnectPeer>;
export interface GetConnectPeerResponse {
  ConnectPeer?: ConnectPeer;
}
export const GetConnectPeerResponse = S.suspend(() =>
  S.Struct({ ConnectPeer: S.optional(ConnectPeer) }),
).annotations({
  identifier: "GetConnectPeerResponse",
}) as any as S.Schema<GetConnectPeerResponse>;
export interface GetConnectPeerAssociationsResponse {
  ConnectPeerAssociations?: ConnectPeerAssociationList;
  NextToken?: string;
}
export const GetConnectPeerAssociationsResponse = S.suspend(() =>
  S.Struct({
    ConnectPeerAssociations: S.optional(ConnectPeerAssociationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetConnectPeerAssociationsResponse",
}) as any as S.Schema<GetConnectPeerAssociationsResponse>;
export interface GetCoreNetworkResponse {
  CoreNetwork?: CoreNetwork;
}
export const GetCoreNetworkResponse = S.suspend(() =>
  S.Struct({ CoreNetwork: S.optional(CoreNetwork) }),
).annotations({
  identifier: "GetCoreNetworkResponse",
}) as any as S.Schema<GetCoreNetworkResponse>;
export interface CoreNetworkPolicyError {
  ErrorCode: string;
  Message: string;
  Path?: string;
}
export const CoreNetworkPolicyError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.String,
    Message: S.String,
    Path: S.optional(S.String),
  }),
).annotations({
  identifier: "CoreNetworkPolicyError",
}) as any as S.Schema<CoreNetworkPolicyError>;
export type CoreNetworkPolicyErrorList = CoreNetworkPolicyError[];
export const CoreNetworkPolicyErrorList = S.Array(CoreNetworkPolicyError);
export interface CoreNetworkPolicy {
  CoreNetworkId?: string;
  PolicyVersionId?: number;
  Alias?: string;
  Description?: string;
  CreatedAt?: Date;
  ChangeSetState?: string;
  PolicyErrors?: CoreNetworkPolicyErrorList;
  PolicyDocument?: string;
}
export const CoreNetworkPolicy = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    PolicyVersionId: S.optional(S.Number),
    Alias: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ChangeSetState: S.optional(S.String),
    PolicyErrors: S.optional(CoreNetworkPolicyErrorList),
    PolicyDocument: S.optional(S.String),
  }),
).annotations({
  identifier: "CoreNetworkPolicy",
}) as any as S.Schema<CoreNetworkPolicy>;
export interface GetCoreNetworkPolicyResponse {
  CoreNetworkPolicy?: CoreNetworkPolicy;
}
export const GetCoreNetworkPolicyResponse = S.suspend(() =>
  S.Struct({ CoreNetworkPolicy: S.optional(CoreNetworkPolicy) }),
).annotations({
  identifier: "GetCoreNetworkPolicyResponse",
}) as any as S.Schema<GetCoreNetworkPolicyResponse>;
export interface GetCustomerGatewayAssociationsResponse {
  CustomerGatewayAssociations?: CustomerGatewayAssociationList;
  NextToken?: string;
}
export const GetCustomerGatewayAssociationsResponse = S.suspend(() =>
  S.Struct({
    CustomerGatewayAssociations: S.optional(CustomerGatewayAssociationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCustomerGatewayAssociationsResponse",
}) as any as S.Schema<GetCustomerGatewayAssociationsResponse>;
export interface GetDevicesResponse {
  Devices?: DeviceList;
  NextToken?: string;
}
export const GetDevicesResponse = S.suspend(() =>
  S.Struct({
    Devices: S.optional(DeviceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDevicesResponse",
}) as any as S.Schema<GetDevicesResponse>;
export interface DirectConnectGatewayAttachment {
  Attachment?: Attachment;
  DirectConnectGatewayArn?: string;
}
export const DirectConnectGatewayAttachment = S.suspend(() =>
  S.Struct({
    Attachment: S.optional(Attachment),
    DirectConnectGatewayArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DirectConnectGatewayAttachment",
}) as any as S.Schema<DirectConnectGatewayAttachment>;
export interface GetDirectConnectGatewayAttachmentResponse {
  DirectConnectGatewayAttachment?: DirectConnectGatewayAttachment;
}
export const GetDirectConnectGatewayAttachmentResponse = S.suspend(() =>
  S.Struct({
    DirectConnectGatewayAttachment: S.optional(DirectConnectGatewayAttachment),
  }),
).annotations({
  identifier: "GetDirectConnectGatewayAttachmentResponse",
}) as any as S.Schema<GetDirectConnectGatewayAttachmentResponse>;
export interface GetLinkAssociationsResponse {
  LinkAssociations?: LinkAssociationList;
  NextToken?: string;
}
export const GetLinkAssociationsResponse = S.suspend(() =>
  S.Struct({
    LinkAssociations: S.optional(LinkAssociationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetLinkAssociationsResponse",
}) as any as S.Schema<GetLinkAssociationsResponse>;
export interface GetLinksResponse {
  Links?: LinkList;
  NextToken?: string;
}
export const GetLinksResponse = S.suspend(() =>
  S.Struct({ Links: S.optional(LinkList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetLinksResponse",
}) as any as S.Schema<GetLinksResponse>;
export interface GetResourcePolicyResponse {
  PolicyDocument?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({ PolicyDocument: S.optional(S.String) }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface GetSitesResponse {
  Sites?: SiteList;
  NextToken?: string;
}
export const GetSitesResponse = S.suspend(() =>
  S.Struct({ Sites: S.optional(SiteList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetSitesResponse",
}) as any as S.Schema<GetSitesResponse>;
export interface SiteToSiteVpnAttachment {
  Attachment?: Attachment;
  VpnConnectionArn?: string;
}
export const SiteToSiteVpnAttachment = S.suspend(() =>
  S.Struct({
    Attachment: S.optional(Attachment),
    VpnConnectionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SiteToSiteVpnAttachment",
}) as any as S.Schema<SiteToSiteVpnAttachment>;
export interface GetSiteToSiteVpnAttachmentResponse {
  SiteToSiteVpnAttachment?: SiteToSiteVpnAttachment;
}
export const GetSiteToSiteVpnAttachmentResponse = S.suspend(() =>
  S.Struct({ SiteToSiteVpnAttachment: S.optional(SiteToSiteVpnAttachment) }),
).annotations({
  identifier: "GetSiteToSiteVpnAttachmentResponse",
}) as any as S.Schema<GetSiteToSiteVpnAttachmentResponse>;
export interface GetTransitGatewayConnectPeerAssociationsResponse {
  TransitGatewayConnectPeerAssociations?: TransitGatewayConnectPeerAssociationList;
  NextToken?: string;
}
export const GetTransitGatewayConnectPeerAssociationsResponse = S.suspend(() =>
  S.Struct({
    TransitGatewayConnectPeerAssociations: S.optional(
      TransitGatewayConnectPeerAssociationList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTransitGatewayConnectPeerAssociationsResponse",
}) as any as S.Schema<GetTransitGatewayConnectPeerAssociationsResponse>;
export interface TransitGatewayPeering {
  Peering?: Peering;
  TransitGatewayArn?: string;
  TransitGatewayPeeringAttachmentId?: string;
}
export const TransitGatewayPeering = S.suspend(() =>
  S.Struct({
    Peering: S.optional(Peering),
    TransitGatewayArn: S.optional(S.String),
    TransitGatewayPeeringAttachmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "TransitGatewayPeering",
}) as any as S.Schema<TransitGatewayPeering>;
export interface GetTransitGatewayPeeringResponse {
  TransitGatewayPeering?: TransitGatewayPeering;
}
export const GetTransitGatewayPeeringResponse = S.suspend(() =>
  S.Struct({ TransitGatewayPeering: S.optional(TransitGatewayPeering) }),
).annotations({
  identifier: "GetTransitGatewayPeeringResponse",
}) as any as S.Schema<GetTransitGatewayPeeringResponse>;
export interface GetTransitGatewayRegistrationsResponse {
  TransitGatewayRegistrations?: TransitGatewayRegistrationList;
  NextToken?: string;
}
export const GetTransitGatewayRegistrationsResponse = S.suspend(() =>
  S.Struct({
    TransitGatewayRegistrations: S.optional(TransitGatewayRegistrationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTransitGatewayRegistrationsResponse",
}) as any as S.Schema<GetTransitGatewayRegistrationsResponse>;
export interface TransitGatewayRouteTableAttachment {
  Attachment?: Attachment;
  PeeringId?: string;
  TransitGatewayRouteTableArn?: string;
}
export const TransitGatewayRouteTableAttachment = S.suspend(() =>
  S.Struct({
    Attachment: S.optional(Attachment),
    PeeringId: S.optional(S.String),
    TransitGatewayRouteTableArn: S.optional(S.String),
  }),
).annotations({
  identifier: "TransitGatewayRouteTableAttachment",
}) as any as S.Schema<TransitGatewayRouteTableAttachment>;
export interface GetTransitGatewayRouteTableAttachmentResponse {
  TransitGatewayRouteTableAttachment?: TransitGatewayRouteTableAttachment;
}
export const GetTransitGatewayRouteTableAttachmentResponse = S.suspend(() =>
  S.Struct({
    TransitGatewayRouteTableAttachment: S.optional(
      TransitGatewayRouteTableAttachment,
    ),
  }),
).annotations({
  identifier: "GetTransitGatewayRouteTableAttachmentResponse",
}) as any as S.Schema<GetTransitGatewayRouteTableAttachmentResponse>;
export interface ListAttachmentsResponse {
  Attachments?: AttachmentList;
  NextToken?: string;
}
export const ListAttachmentsResponse = S.suspend(() =>
  S.Struct({
    Attachments: S.optional(AttachmentList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAttachmentsResponse",
}) as any as S.Schema<ListAttachmentsResponse>;
export interface ListPeeringsResponse {
  Peerings?: PeeringList;
  NextToken?: string;
}
export const ListPeeringsResponse = S.suspend(() =>
  S.Struct({
    Peerings: S.optional(PeeringList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPeeringsResponse",
}) as any as S.Schema<ListPeeringsResponse>;
export interface ListTagsForResourceResponse {
  TagList?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutAttachmentRoutingPolicyLabelResponse {
  CoreNetworkId?: string;
  AttachmentId?: string;
  RoutingPolicyLabel?: string;
}
export const PutAttachmentRoutingPolicyLabelResponse = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    AttachmentId: S.optional(S.String),
    RoutingPolicyLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "PutAttachmentRoutingPolicyLabelResponse",
}) as any as S.Schema<PutAttachmentRoutingPolicyLabelResponse>;
export interface PutCoreNetworkPolicyResponse {
  CoreNetworkPolicy?: CoreNetworkPolicy;
}
export const PutCoreNetworkPolicyResponse = S.suspend(() =>
  S.Struct({ CoreNetworkPolicy: S.optional(CoreNetworkPolicy) }),
).annotations({
  identifier: "PutCoreNetworkPolicyResponse",
}) as any as S.Schema<PutCoreNetworkPolicyResponse>;
export interface RegisterTransitGatewayResponse {
  TransitGatewayRegistration?: TransitGatewayRegistration;
}
export const RegisterTransitGatewayResponse = S.suspend(() =>
  S.Struct({
    TransitGatewayRegistration: S.optional(TransitGatewayRegistration),
  }),
).annotations({
  identifier: "RegisterTransitGatewayResponse",
}) as any as S.Schema<RegisterTransitGatewayResponse>;
export interface RejectAttachmentResponse {
  Attachment?: Attachment;
}
export const RejectAttachmentResponse = S.suspend(() =>
  S.Struct({ Attachment: S.optional(Attachment) }),
).annotations({
  identifier: "RejectAttachmentResponse",
}) as any as S.Schema<RejectAttachmentResponse>;
export interface RemoveAttachmentRoutingPolicyLabelResponse {
  CoreNetworkId?: string;
  AttachmentId?: string;
  RoutingPolicyLabel?: string;
}
export const RemoveAttachmentRoutingPolicyLabelResponse = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    AttachmentId: S.optional(S.String),
    RoutingPolicyLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "RemoveAttachmentRoutingPolicyLabelResponse",
}) as any as S.Schema<RemoveAttachmentRoutingPolicyLabelResponse>;
export interface RestoreCoreNetworkPolicyVersionResponse {
  CoreNetworkPolicy?: CoreNetworkPolicy;
}
export const RestoreCoreNetworkPolicyVersionResponse = S.suspend(() =>
  S.Struct({ CoreNetworkPolicy: S.optional(CoreNetworkPolicy) }),
).annotations({
  identifier: "RestoreCoreNetworkPolicyVersionResponse",
}) as any as S.Schema<RestoreCoreNetworkPolicyVersionResponse>;
export interface AccountStatus {
  AccountId?: string;
  SLRDeploymentStatus?: string;
}
export const AccountStatus = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    SLRDeploymentStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountStatus",
}) as any as S.Schema<AccountStatus>;
export type AccountStatusList = AccountStatus[];
export const AccountStatusList = S.Array(AccountStatus);
export interface OrganizationStatus {
  OrganizationId?: string;
  OrganizationAwsServiceAccessStatus?: string;
  SLRDeploymentStatus?: string;
  AccountStatusList?: AccountStatusList;
}
export const OrganizationStatus = S.suspend(() =>
  S.Struct({
    OrganizationId: S.optional(S.String),
    OrganizationAwsServiceAccessStatus: S.optional(S.String),
    SLRDeploymentStatus: S.optional(S.String),
    AccountStatusList: S.optional(AccountStatusList).pipe(
      T.XmlName("OrganizationStatus"),
    ),
  }),
).annotations({
  identifier: "OrganizationStatus",
}) as any as S.Schema<OrganizationStatus>;
export interface StartOrganizationServiceAccessUpdateResponse {
  OrganizationStatus?: OrganizationStatus;
}
export const StartOrganizationServiceAccessUpdateResponse = S.suspend(() =>
  S.Struct({ OrganizationStatus: S.optional(OrganizationStatus) }),
).annotations({
  identifier: "StartOrganizationServiceAccessUpdateResponse",
}) as any as S.Schema<StartOrganizationServiceAccessUpdateResponse>;
export interface StartRouteAnalysisRequest {
  GlobalNetworkId: string;
  Source: RouteAnalysisEndpointOptionsSpecification;
  Destination: RouteAnalysisEndpointOptionsSpecification;
  IncludeReturnPath?: boolean;
  UseMiddleboxes?: boolean;
}
export const StartRouteAnalysisRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    Source: RouteAnalysisEndpointOptionsSpecification,
    Destination: RouteAnalysisEndpointOptionsSpecification,
    IncludeReturnPath: S.optional(S.Boolean),
    UseMiddleboxes: S.optional(S.Boolean),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartRouteAnalysisRequest",
}) as any as S.Schema<StartRouteAnalysisRequest>;
export interface UpdateConnectionResponse {
  Connection?: Connection;
}
export const UpdateConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: S.optional(Connection) }),
).annotations({
  identifier: "UpdateConnectionResponse",
}) as any as S.Schema<UpdateConnectionResponse>;
export interface UpdateCoreNetworkResponse {
  CoreNetwork?: CoreNetwork;
}
export const UpdateCoreNetworkResponse = S.suspend(() =>
  S.Struct({ CoreNetwork: S.optional(CoreNetwork) }),
).annotations({
  identifier: "UpdateCoreNetworkResponse",
}) as any as S.Schema<UpdateCoreNetworkResponse>;
export interface UpdateDeviceResponse {
  Device?: Device;
}
export const UpdateDeviceResponse = S.suspend(() =>
  S.Struct({ Device: S.optional(Device) }),
).annotations({
  identifier: "UpdateDeviceResponse",
}) as any as S.Schema<UpdateDeviceResponse>;
export interface UpdateDirectConnectGatewayAttachmentResponse {
  DirectConnectGatewayAttachment?: DirectConnectGatewayAttachment;
}
export const UpdateDirectConnectGatewayAttachmentResponse = S.suspend(() =>
  S.Struct({
    DirectConnectGatewayAttachment: S.optional(DirectConnectGatewayAttachment),
  }),
).annotations({
  identifier: "UpdateDirectConnectGatewayAttachmentResponse",
}) as any as S.Schema<UpdateDirectConnectGatewayAttachmentResponse>;
export interface UpdateGlobalNetworkResponse {
  GlobalNetwork?: GlobalNetwork;
}
export const UpdateGlobalNetworkResponse = S.suspend(() =>
  S.Struct({ GlobalNetwork: S.optional(GlobalNetwork) }),
).annotations({
  identifier: "UpdateGlobalNetworkResponse",
}) as any as S.Schema<UpdateGlobalNetworkResponse>;
export interface UpdateLinkResponse {
  Link?: Link;
}
export const UpdateLinkResponse = S.suspend(() =>
  S.Struct({ Link: S.optional(Link) }),
).annotations({
  identifier: "UpdateLinkResponse",
}) as any as S.Schema<UpdateLinkResponse>;
export interface UpdateNetworkResourceMetadataRequest {
  GlobalNetworkId: string;
  ResourceArn: string;
  Metadata: NetworkResourceMetadataMap;
}
export const UpdateNetworkResourceMetadataRequest = S.suspend(() =>
  S.Struct({
    GlobalNetworkId: S.String.pipe(T.HttpLabel("GlobalNetworkId")),
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Metadata: NetworkResourceMetadataMap,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateNetworkResourceMetadataRequest",
}) as any as S.Schema<UpdateNetworkResourceMetadataRequest>;
export interface UpdateSiteResponse {
  Site?: Site;
}
export const UpdateSiteResponse = S.suspend(() =>
  S.Struct({ Site: S.optional(Site) }),
).annotations({
  identifier: "UpdateSiteResponse",
}) as any as S.Schema<UpdateSiteResponse>;
export interface VpcAttachment {
  Attachment?: Attachment;
  SubnetArns?: SubnetArnList;
  Options?: VpcOptions;
}
export const VpcAttachment = S.suspend(() =>
  S.Struct({
    Attachment: S.optional(Attachment),
    SubnetArns: S.optional(SubnetArnList),
    Options: S.optional(VpcOptions),
  }),
).annotations({
  identifier: "VpcAttachment",
}) as any as S.Schema<VpcAttachment>;
export interface UpdateVpcAttachmentResponse {
  VpcAttachment?: VpcAttachment;
}
export const UpdateVpcAttachmentResponse = S.suspend(() =>
  S.Struct({ VpcAttachment: S.optional(VpcAttachment) }),
).annotations({
  identifier: "UpdateVpcAttachmentResponse",
}) as any as S.Schema<UpdateVpcAttachmentResponse>;
export interface CoreNetworkSegmentEdgeIdentifier {
  CoreNetworkId?: string;
  SegmentName?: string;
  EdgeLocation?: string;
}
export const CoreNetworkSegmentEdgeIdentifier = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    SegmentName: S.optional(S.String),
    EdgeLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "CoreNetworkSegmentEdgeIdentifier",
}) as any as S.Schema<CoreNetworkSegmentEdgeIdentifier>;
export interface CoreNetworkNetworkFunctionGroupIdentifier {
  CoreNetworkId?: string;
  NetworkFunctionGroupName?: string;
  EdgeLocation?: string;
}
export const CoreNetworkNetworkFunctionGroupIdentifier = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    NetworkFunctionGroupName: S.optional(S.String),
    EdgeLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "CoreNetworkNetworkFunctionGroupIdentifier",
}) as any as S.Schema<CoreNetworkNetworkFunctionGroupIdentifier>;
export interface ConnectAttachment {
  Attachment?: Attachment;
  TransportAttachmentId?: string;
  Options?: ConnectAttachmentOptions;
}
export const ConnectAttachment = S.suspend(() =>
  S.Struct({
    Attachment: S.optional(Attachment),
    TransportAttachmentId: S.optional(S.String),
    Options: S.optional(ConnectAttachmentOptions),
  }),
).annotations({
  identifier: "ConnectAttachment",
}) as any as S.Schema<ConnectAttachment>;
export interface NetworkResourceCount {
  ResourceType?: string;
  Count?: number;
}
export const NetworkResourceCount = S.suspend(() =>
  S.Struct({ ResourceType: S.optional(S.String), Count: S.optional(S.Number) }),
).annotations({
  identifier: "NetworkResourceCount",
}) as any as S.Schema<NetworkResourceCount>;
export type NetworkResourceCountList = NetworkResourceCount[];
export const NetworkResourceCountList = S.Array(NetworkResourceCount);
export interface Relationship {
  From?: string;
  To?: string;
}
export const Relationship = S.suspend(() =>
  S.Struct({ From: S.optional(S.String), To: S.optional(S.String) }),
).annotations({ identifier: "Relationship" }) as any as S.Schema<Relationship>;
export type RelationshipList = Relationship[];
export const RelationshipList = S.Array(Relationship);
export interface NetworkResource {
  RegisteredGatewayArn?: string;
  CoreNetworkId?: string;
  AwsRegion?: string;
  AccountId?: string;
  ResourceType?: string;
  ResourceId?: string;
  ResourceArn?: string;
  Definition?: string;
  DefinitionTimestamp?: Date;
  Tags?: TagList;
  Metadata?: NetworkResourceMetadataMap;
}
export const NetworkResource = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "NetworkResource",
}) as any as S.Schema<NetworkResource>;
export type NetworkResourceList = NetworkResource[];
export const NetworkResourceList = S.Array(NetworkResource);
export interface RouteTableIdentifier {
  TransitGatewayRouteTableArn?: string;
  CoreNetworkSegmentEdge?: CoreNetworkSegmentEdgeIdentifier;
  CoreNetworkNetworkFunctionGroup?: CoreNetworkNetworkFunctionGroupIdentifier;
}
export const RouteTableIdentifier = S.suspend(() =>
  S.Struct({
    TransitGatewayRouteTableArn: S.optional(S.String),
    CoreNetworkSegmentEdge: S.optional(CoreNetworkSegmentEdgeIdentifier),
    CoreNetworkNetworkFunctionGroup: S.optional(
      CoreNetworkNetworkFunctionGroupIdentifier,
    ),
  }),
).annotations({
  identifier: "RouteTableIdentifier",
}) as any as S.Schema<RouteTableIdentifier>;
export interface AttachmentRoutingPolicyAssociationSummary {
  AttachmentId?: string;
  PendingRoutingPolicies?: ConstrainedStringList;
  AssociatedRoutingPolicies?: ConstrainedStringList;
  RoutingPolicyLabel?: string;
}
export const AttachmentRoutingPolicyAssociationSummary = S.suspend(() =>
  S.Struct({
    AttachmentId: S.optional(S.String),
    PendingRoutingPolicies: S.optional(ConstrainedStringList),
    AssociatedRoutingPolicies: S.optional(ConstrainedStringList),
    RoutingPolicyLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "AttachmentRoutingPolicyAssociationSummary",
}) as any as S.Schema<AttachmentRoutingPolicyAssociationSummary>;
export type AttachmentRoutingPolicyAssociationsList =
  AttachmentRoutingPolicyAssociationSummary[];
export const AttachmentRoutingPolicyAssociationsList = S.Array(
  AttachmentRoutingPolicyAssociationSummary,
);
export interface ConnectPeerSummary {
  CoreNetworkId?: string;
  ConnectAttachmentId?: string;
  ConnectPeerId?: string;
  EdgeLocation?: string;
  ConnectPeerState?: string;
  CreatedAt?: Date;
  Tags?: TagList;
  SubnetArn?: string;
}
export const ConnectPeerSummary = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    ConnectAttachmentId: S.optional(S.String),
    ConnectPeerId: S.optional(S.String),
    EdgeLocation: S.optional(S.String),
    ConnectPeerState: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagList),
    SubnetArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectPeerSummary",
}) as any as S.Schema<ConnectPeerSummary>;
export type ConnectPeerSummaryList = ConnectPeerSummary[];
export const ConnectPeerSummaryList = S.Array(ConnectPeerSummary);
export interface CoreNetworkPolicyVersion {
  CoreNetworkId?: string;
  PolicyVersionId?: number;
  Alias?: string;
  Description?: string;
  CreatedAt?: Date;
  ChangeSetState?: string;
}
export const CoreNetworkPolicyVersion = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    PolicyVersionId: S.optional(S.Number),
    Alias: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ChangeSetState: S.optional(S.String),
  }),
).annotations({
  identifier: "CoreNetworkPolicyVersion",
}) as any as S.Schema<CoreNetworkPolicyVersion>;
export type CoreNetworkPolicyVersionList = CoreNetworkPolicyVersion[];
export const CoreNetworkPolicyVersionList = S.Array(CoreNetworkPolicyVersion);
export interface PrefixListAssociation {
  CoreNetworkId?: string;
  PrefixListArn?: string;
  PrefixListAlias?: string;
}
export const PrefixListAssociation = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    PrefixListArn: S.optional(S.String),
    PrefixListAlias: S.optional(S.String),
  }),
).annotations({
  identifier: "PrefixListAssociation",
}) as any as S.Schema<PrefixListAssociation>;
export type PrefixListAssociationList = PrefixListAssociation[];
export const PrefixListAssociationList = S.Array(PrefixListAssociation);
export interface CoreNetworkSummary {
  CoreNetworkId?: string;
  CoreNetworkArn?: string;
  GlobalNetworkId?: string;
  OwnerAccountId?: string;
  State?: string;
  Description?: string;
  Tags?: TagList;
}
export const CoreNetworkSummary = S.suspend(() =>
  S.Struct({
    CoreNetworkId: S.optional(S.String),
    CoreNetworkArn: S.optional(S.String),
    GlobalNetworkId: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    State: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "CoreNetworkSummary",
}) as any as S.Schema<CoreNetworkSummary>;
export type CoreNetworkSummaryList = CoreNetworkSummary[];
export const CoreNetworkSummaryList = S.Array(CoreNetworkSummary);
export interface AssociateConnectPeerResponse {
  ConnectPeerAssociation?: ConnectPeerAssociation;
}
export const AssociateConnectPeerResponse = S.suspend(() =>
  S.Struct({ ConnectPeerAssociation: S.optional(ConnectPeerAssociation) }),
).annotations({
  identifier: "AssociateConnectPeerResponse",
}) as any as S.Schema<AssociateConnectPeerResponse>;
export interface AssociateCustomerGatewayResponse {
  CustomerGatewayAssociation?: CustomerGatewayAssociation;
}
export const AssociateCustomerGatewayResponse = S.suspend(() =>
  S.Struct({
    CustomerGatewayAssociation: S.optional(CustomerGatewayAssociation),
  }),
).annotations({
  identifier: "AssociateCustomerGatewayResponse",
}) as any as S.Schema<AssociateCustomerGatewayResponse>;
export interface AssociateLinkResponse {
  LinkAssociation?: LinkAssociation;
}
export const AssociateLinkResponse = S.suspend(() =>
  S.Struct({ LinkAssociation: S.optional(LinkAssociation) }),
).annotations({
  identifier: "AssociateLinkResponse",
}) as any as S.Schema<AssociateLinkResponse>;
export interface AssociateTransitGatewayConnectPeerResponse {
  TransitGatewayConnectPeerAssociation?: TransitGatewayConnectPeerAssociation;
}
export const AssociateTransitGatewayConnectPeerResponse = S.suspend(() =>
  S.Struct({
    TransitGatewayConnectPeerAssociation: S.optional(
      TransitGatewayConnectPeerAssociation,
    ),
  }),
).annotations({
  identifier: "AssociateTransitGatewayConnectPeerResponse",
}) as any as S.Schema<AssociateTransitGatewayConnectPeerResponse>;
export interface CreateConnectAttachmentResponse {
  ConnectAttachment?: ConnectAttachment;
}
export const CreateConnectAttachmentResponse = S.suspend(() =>
  S.Struct({ ConnectAttachment: S.optional(ConnectAttachment) }),
).annotations({
  identifier: "CreateConnectAttachmentResponse",
}) as any as S.Schema<CreateConnectAttachmentResponse>;
export interface CreateConnectionResponse {
  Connection?: Connection;
}
export const CreateConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: S.optional(Connection) }),
).annotations({
  identifier: "CreateConnectionResponse",
}) as any as S.Schema<CreateConnectionResponse>;
export interface CreateConnectPeerResponse {
  ConnectPeer?: ConnectPeer;
}
export const CreateConnectPeerResponse = S.suspend(() =>
  S.Struct({ ConnectPeer: S.optional(ConnectPeer) }),
).annotations({
  identifier: "CreateConnectPeerResponse",
}) as any as S.Schema<CreateConnectPeerResponse>;
export interface CreateDeviceResponse {
  Device?: Device;
}
export const CreateDeviceResponse = S.suspend(() =>
  S.Struct({ Device: S.optional(Device) }),
).annotations({
  identifier: "CreateDeviceResponse",
}) as any as S.Schema<CreateDeviceResponse>;
export interface CreateDirectConnectGatewayAttachmentResponse {
  DirectConnectGatewayAttachment?: DirectConnectGatewayAttachment;
}
export const CreateDirectConnectGatewayAttachmentResponse = S.suspend(() =>
  S.Struct({
    DirectConnectGatewayAttachment: S.optional(DirectConnectGatewayAttachment),
  }),
).annotations({
  identifier: "CreateDirectConnectGatewayAttachmentResponse",
}) as any as S.Schema<CreateDirectConnectGatewayAttachmentResponse>;
export interface CreateGlobalNetworkResponse {
  GlobalNetwork?: GlobalNetwork;
}
export const CreateGlobalNetworkResponse = S.suspend(() =>
  S.Struct({ GlobalNetwork: S.optional(GlobalNetwork) }),
).annotations({
  identifier: "CreateGlobalNetworkResponse",
}) as any as S.Schema<CreateGlobalNetworkResponse>;
export interface CreateLinkResponse {
  Link?: Link;
}
export const CreateLinkResponse = S.suspend(() =>
  S.Struct({ Link: S.optional(Link) }),
).annotations({
  identifier: "CreateLinkResponse",
}) as any as S.Schema<CreateLinkResponse>;
export interface CreateSiteResponse {
  Site?: Site;
}
export const CreateSiteResponse = S.suspend(() =>
  S.Struct({ Site: S.optional(Site) }),
).annotations({
  identifier: "CreateSiteResponse",
}) as any as S.Schema<CreateSiteResponse>;
export interface CreateSiteToSiteVpnAttachmentResponse {
  SiteToSiteVpnAttachment?: SiteToSiteVpnAttachment;
}
export const CreateSiteToSiteVpnAttachmentResponse = S.suspend(() =>
  S.Struct({ SiteToSiteVpnAttachment: S.optional(SiteToSiteVpnAttachment) }),
).annotations({
  identifier: "CreateSiteToSiteVpnAttachmentResponse",
}) as any as S.Schema<CreateSiteToSiteVpnAttachmentResponse>;
export interface CreateTransitGatewayPeeringResponse {
  TransitGatewayPeering?: TransitGatewayPeering;
}
export const CreateTransitGatewayPeeringResponse = S.suspend(() =>
  S.Struct({ TransitGatewayPeering: S.optional(TransitGatewayPeering) }),
).annotations({
  identifier: "CreateTransitGatewayPeeringResponse",
}) as any as S.Schema<CreateTransitGatewayPeeringResponse>;
export interface CreateTransitGatewayRouteTableAttachmentResponse {
  TransitGatewayRouteTableAttachment?: TransitGatewayRouteTableAttachment;
}
export const CreateTransitGatewayRouteTableAttachmentResponse = S.suspend(() =>
  S.Struct({
    TransitGatewayRouteTableAttachment: S.optional(
      TransitGatewayRouteTableAttachment,
    ),
  }),
).annotations({
  identifier: "CreateTransitGatewayRouteTableAttachmentResponse",
}) as any as S.Schema<CreateTransitGatewayRouteTableAttachmentResponse>;
export interface CreateVpcAttachmentResponse {
  VpcAttachment?: VpcAttachment;
}
export const CreateVpcAttachmentResponse = S.suspend(() =>
  S.Struct({ VpcAttachment: S.optional(VpcAttachment) }),
).annotations({
  identifier: "CreateVpcAttachmentResponse",
}) as any as S.Schema<CreateVpcAttachmentResponse>;
export interface DeleteDeviceResponse {
  Device?: Device;
}
export const DeleteDeviceResponse = S.suspend(() =>
  S.Struct({ Device: S.optional(Device) }),
).annotations({
  identifier: "DeleteDeviceResponse",
}) as any as S.Schema<DeleteDeviceResponse>;
export interface DeleteLinkResponse {
  Link?: Link;
}
export const DeleteLinkResponse = S.suspend(() =>
  S.Struct({ Link: S.optional(Link) }),
).annotations({
  identifier: "DeleteLinkResponse",
}) as any as S.Schema<DeleteLinkResponse>;
export interface GetConnectAttachmentResponse {
  ConnectAttachment?: ConnectAttachment;
}
export const GetConnectAttachmentResponse = S.suspend(() =>
  S.Struct({ ConnectAttachment: S.optional(ConnectAttachment) }),
).annotations({
  identifier: "GetConnectAttachmentResponse",
}) as any as S.Schema<GetConnectAttachmentResponse>;
export interface GetNetworkResourceCountsResponse {
  NetworkResourceCounts?: NetworkResourceCountList;
  NextToken?: string;
}
export const GetNetworkResourceCountsResponse = S.suspend(() =>
  S.Struct({
    NetworkResourceCounts: S.optional(NetworkResourceCountList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetNetworkResourceCountsResponse",
}) as any as S.Schema<GetNetworkResourceCountsResponse>;
export interface GetNetworkResourceRelationshipsResponse {
  Relationships?: RelationshipList;
  NextToken?: string;
}
export const GetNetworkResourceRelationshipsResponse = S.suspend(() =>
  S.Struct({
    Relationships: S.optional(RelationshipList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetNetworkResourceRelationshipsResponse",
}) as any as S.Schema<GetNetworkResourceRelationshipsResponse>;
export interface GetNetworkResourcesResponse {
  NetworkResources?: NetworkResourceList;
  NextToken?: string;
}
export const GetNetworkResourcesResponse = S.suspend(() =>
  S.Struct({
    NetworkResources: S.optional(NetworkResourceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetNetworkResourcesResponse",
}) as any as S.Schema<GetNetworkResourcesResponse>;
export interface GetNetworkRoutesRequest {
  GlobalNetworkId: string;
  RouteTableIdentifier: RouteTableIdentifier;
  ExactCidrMatches?: ConstrainedStringList;
  LongestPrefixMatches?: ConstrainedStringList;
  SubnetOfMatches?: ConstrainedStringList;
  SupernetOfMatches?: ConstrainedStringList;
  PrefixListIds?: ConstrainedStringList;
  States?: RouteStateList;
  Types?: RouteTypeList;
  DestinationFilters?: FilterMap;
}
export const GetNetworkRoutesRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "GetNetworkRoutesRequest",
}) as any as S.Schema<GetNetworkRoutesRequest>;
export interface GetVpcAttachmentResponse {
  VpcAttachment?: VpcAttachment;
}
export const GetVpcAttachmentResponse = S.suspend(() =>
  S.Struct({ VpcAttachment: S.optional(VpcAttachment) }),
).annotations({
  identifier: "GetVpcAttachmentResponse",
}) as any as S.Schema<GetVpcAttachmentResponse>;
export interface ListAttachmentRoutingPolicyAssociationsResponse {
  AttachmentRoutingPolicyAssociations?: AttachmentRoutingPolicyAssociationsList;
  NextToken?: string;
}
export const ListAttachmentRoutingPolicyAssociationsResponse = S.suspend(() =>
  S.Struct({
    AttachmentRoutingPolicyAssociations: S.optional(
      AttachmentRoutingPolicyAssociationsList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAttachmentRoutingPolicyAssociationsResponse",
}) as any as S.Schema<ListAttachmentRoutingPolicyAssociationsResponse>;
export interface ListConnectPeersResponse {
  ConnectPeers?: ConnectPeerSummaryList;
  NextToken?: string;
}
export const ListConnectPeersResponse = S.suspend(() =>
  S.Struct({
    ConnectPeers: S.optional(ConnectPeerSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectPeersResponse",
}) as any as S.Schema<ListConnectPeersResponse>;
export interface ListCoreNetworkPolicyVersionsResponse {
  CoreNetworkPolicyVersions?: CoreNetworkPolicyVersionList;
  NextToken?: string;
}
export const ListCoreNetworkPolicyVersionsResponse = S.suspend(() =>
  S.Struct({
    CoreNetworkPolicyVersions: S.optional(CoreNetworkPolicyVersionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCoreNetworkPolicyVersionsResponse",
}) as any as S.Schema<ListCoreNetworkPolicyVersionsResponse>;
export interface ListCoreNetworkPrefixListAssociationsResponse {
  PrefixListAssociations?: PrefixListAssociationList;
  NextToken?: string;
}
export const ListCoreNetworkPrefixListAssociationsResponse = S.suspend(() =>
  S.Struct({
    PrefixListAssociations: S.optional(PrefixListAssociationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCoreNetworkPrefixListAssociationsResponse",
}) as any as S.Schema<ListCoreNetworkPrefixListAssociationsResponse>;
export interface ListCoreNetworksResponse {
  CoreNetworks?: CoreNetworkSummaryList;
  NextToken?: string;
}
export const ListCoreNetworksResponse = S.suspend(() =>
  S.Struct({
    CoreNetworks: S.optional(CoreNetworkSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCoreNetworksResponse",
}) as any as S.Schema<ListCoreNetworksResponse>;
export interface RouteAnalysisEndpointOptions {
  TransitGatewayAttachmentArn?: string;
  TransitGatewayArn?: string;
  IpAddress?: string;
}
export const RouteAnalysisEndpointOptions = S.suspend(() =>
  S.Struct({
    TransitGatewayAttachmentArn: S.optional(S.String),
    TransitGatewayArn: S.optional(S.String),
    IpAddress: S.optional(S.String),
  }),
).annotations({
  identifier: "RouteAnalysisEndpointOptions",
}) as any as S.Schema<RouteAnalysisEndpointOptions>;
export type ReasonContextMap = { [key: string]: string };
export const ReasonContextMap = S.Record({ key: S.String, value: S.String });
export interface RouteAnalysisCompletion {
  ResultCode?: string;
  ReasonCode?: string;
  ReasonContext?: ReasonContextMap;
}
export const RouteAnalysisCompletion = S.suspend(() =>
  S.Struct({
    ResultCode: S.optional(S.String),
    ReasonCode: S.optional(S.String),
    ReasonContext: S.optional(ReasonContextMap),
  }),
).annotations({
  identifier: "RouteAnalysisCompletion",
}) as any as S.Schema<RouteAnalysisCompletion>;
export interface NetworkResourceSummary {
  RegisteredGatewayArn?: string;
  ResourceArn?: string;
  ResourceType?: string;
  Definition?: string;
  NameTag?: string;
  IsMiddlebox?: boolean;
}
export const NetworkResourceSummary = S.suspend(() =>
  S.Struct({
    RegisteredGatewayArn: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Definition: S.optional(S.String),
    NameTag: S.optional(S.String),
    IsMiddlebox: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "NetworkResourceSummary",
}) as any as S.Schema<NetworkResourceSummary>;
export interface PathComponent {
  Sequence?: number;
  Resource?: NetworkResourceSummary;
  DestinationCidrBlock?: string;
}
export const PathComponent = S.suspend(() =>
  S.Struct({
    Sequence: S.optional(S.Number),
    Resource: S.optional(NetworkResourceSummary),
    DestinationCidrBlock: S.optional(S.String),
  }),
).annotations({
  identifier: "PathComponent",
}) as any as S.Schema<PathComponent>;
export type PathComponentList = PathComponent[];
export const PathComponentList = S.Array(PathComponent);
export interface RouteAnalysisPath {
  CompletionStatus?: RouteAnalysisCompletion;
  Path?: PathComponentList;
}
export const RouteAnalysisPath = S.suspend(() =>
  S.Struct({
    CompletionStatus: S.optional(RouteAnalysisCompletion),
    Path: S.optional(PathComponentList),
  }),
).annotations({
  identifier: "RouteAnalysisPath",
}) as any as S.Schema<RouteAnalysisPath>;
export interface RouteAnalysis {
  GlobalNetworkId?: string;
  OwnerAccountId?: string;
  RouteAnalysisId?: string;
  StartTimestamp?: Date;
  Status?: string;
  Source?: RouteAnalysisEndpointOptions;
  Destination?: RouteAnalysisEndpointOptions;
  IncludeReturnPath?: boolean;
  UseMiddleboxes?: boolean;
  ForwardPath?: RouteAnalysisPath;
  ReturnPath?: RouteAnalysisPath;
}
export const RouteAnalysis = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "RouteAnalysis",
}) as any as S.Schema<RouteAnalysis>;
export interface StartRouteAnalysisResponse {
  RouteAnalysis?: RouteAnalysis;
}
export const StartRouteAnalysisResponse = S.suspend(() =>
  S.Struct({ RouteAnalysis: S.optional(RouteAnalysis) }),
).annotations({
  identifier: "StartRouteAnalysisResponse",
}) as any as S.Schema<StartRouteAnalysisResponse>;
export interface UpdateNetworkResourceMetadataResponse {
  ResourceArn?: string;
  Metadata?: NetworkResourceMetadataMap;
}
export const UpdateNetworkResourceMetadataResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Metadata: S.optional(NetworkResourceMetadataMap),
  }),
).annotations({
  identifier: "UpdateNetworkResourceMetadataResponse",
}) as any as S.Schema<UpdateNetworkResourceMetadataResponse>;
export interface ConnectionHealth {
  Type?: string;
  Status?: string;
  Timestamp?: Date;
}
export const ConnectionHealth = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Status: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ConnectionHealth",
}) as any as S.Schema<ConnectionHealth>;
export interface RoutingInformationNextHop {
  IpAddress?: string;
  CoreNetworkAttachmentId?: string;
  ResourceId?: string;
  ResourceType?: string;
  SegmentName?: string;
  EdgeLocation?: string;
}
export const RoutingInformationNextHop = S.suspend(() =>
  S.Struct({
    IpAddress: S.optional(S.String),
    CoreNetworkAttachmentId: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    SegmentName: S.optional(S.String),
    EdgeLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "RoutingInformationNextHop",
}) as any as S.Schema<RoutingInformationNextHop>;
export interface NetworkTelemetry {
  RegisteredGatewayArn?: string;
  CoreNetworkId?: string;
  AwsRegion?: string;
  AccountId?: string;
  ResourceType?: string;
  ResourceId?: string;
  ResourceArn?: string;
  Address?: string;
  Health?: ConnectionHealth;
}
export const NetworkTelemetry = S.suspend(() =>
  S.Struct({
    RegisteredGatewayArn: S.optional(S.String),
    CoreNetworkId: S.optional(S.String),
    AwsRegion: S.optional(S.String),
    AccountId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    Address: S.optional(S.String),
    Health: S.optional(ConnectionHealth),
  }),
).annotations({
  identifier: "NetworkTelemetry",
}) as any as S.Schema<NetworkTelemetry>;
export type NetworkTelemetryList = NetworkTelemetry[];
export const NetworkTelemetryList = S.Array(NetworkTelemetry);
export interface CoreNetworkRoutingInformation {
  Prefix?: string;
  NextHop?: RoutingInformationNextHop;
  LocalPreference?: string;
  Med?: string;
  AsPath?: ConstrainedStringList;
  Communities?: ConstrainedStringList;
}
export const CoreNetworkRoutingInformation = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    NextHop: S.optional(RoutingInformationNextHop),
    LocalPreference: S.optional(S.String),
    Med: S.optional(S.String),
    AsPath: S.optional(ConstrainedStringList),
    Communities: S.optional(ConstrainedStringList),
  }),
).annotations({
  identifier: "CoreNetworkRoutingInformation",
}) as any as S.Schema<CoreNetworkRoutingInformation>;
export type CoreNetworkRoutingInformationList = CoreNetworkRoutingInformation[];
export const CoreNetworkRoutingInformationList = S.Array(
  CoreNetworkRoutingInformation,
);
export interface RoutingPolicyAssociationDetail {
  RoutingPolicyNames?: ConstrainedStringList;
  SharedSegments?: ConstrainedStringList;
}
export const RoutingPolicyAssociationDetail = S.suspend(() =>
  S.Struct({
    RoutingPolicyNames: S.optional(ConstrainedStringList),
    SharedSegments: S.optional(ConstrainedStringList),
  }),
).annotations({
  identifier: "RoutingPolicyAssociationDetail",
}) as any as S.Schema<RoutingPolicyAssociationDetail>;
export type RoutingPolicyAssociationDetailsList =
  RoutingPolicyAssociationDetail[];
export const RoutingPolicyAssociationDetailsList = S.Array(
  RoutingPolicyAssociationDetail,
);
export interface AcceptAttachmentResponse {
  Attachment?: Attachment;
}
export const AcceptAttachmentResponse = S.suspend(() =>
  S.Struct({ Attachment: S.optional(Attachment) }),
).annotations({
  identifier: "AcceptAttachmentResponse",
}) as any as S.Schema<AcceptAttachmentResponse>;
export interface DeleteCoreNetworkPolicyVersionResponse {
  CoreNetworkPolicy?: CoreNetworkPolicy;
}
export const DeleteCoreNetworkPolicyVersionResponse = S.suspend(() =>
  S.Struct({ CoreNetworkPolicy: S.optional(CoreNetworkPolicy) }),
).annotations({
  identifier: "DeleteCoreNetworkPolicyVersionResponse",
}) as any as S.Schema<DeleteCoreNetworkPolicyVersionResponse>;
export interface DeregisterTransitGatewayResponse {
  TransitGatewayRegistration?: TransitGatewayRegistration;
}
export const DeregisterTransitGatewayResponse = S.suspend(() =>
  S.Struct({
    TransitGatewayRegistration: S.optional(TransitGatewayRegistration),
  }),
).annotations({
  identifier: "DeregisterTransitGatewayResponse",
}) as any as S.Schema<DeregisterTransitGatewayResponse>;
export type WhenSentToSegmentsList = string[];
export const WhenSentToSegmentsList = S.Array(S.String);
export interface GetNetworkTelemetryResponse {
  NetworkTelemetry?: NetworkTelemetryList;
  NextToken?: string;
}
export const GetNetworkTelemetryResponse = S.suspend(() =>
  S.Struct({
    NetworkTelemetry: S.optional(NetworkTelemetryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetNetworkTelemetryResponse",
}) as any as S.Schema<GetNetworkTelemetryResponse>;
export interface ListCoreNetworkRoutingInformationResponse {
  CoreNetworkRoutingInformation?: CoreNetworkRoutingInformationList;
  NextToken?: string;
}
export const ListCoreNetworkRoutingInformationResponse = S.suspend(() =>
  S.Struct({
    CoreNetworkRoutingInformation: S.optional(
      CoreNetworkRoutingInformationList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCoreNetworkRoutingInformationResponse",
}) as any as S.Schema<ListCoreNetworkRoutingInformationResponse>;
export interface ListOrganizationServiceAccessStatusResponse {
  OrganizationStatus?: OrganizationStatus;
  NextToken?: string;
}
export const ListOrganizationServiceAccessStatusResponse = S.suspend(() =>
  S.Struct({
    OrganizationStatus: S.optional(OrganizationStatus),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOrganizationServiceAccessStatusResponse",
}) as any as S.Schema<ListOrganizationServiceAccessStatusResponse>;
export interface CoreNetworkChangeEventValues {
  EdgeLocation?: string;
  PeerEdgeLocation?: string;
  RoutingPolicyDirection?: string;
  SegmentName?: string;
  NetworkFunctionGroupName?: string;
  AttachmentId?: string;
  Cidr?: string;
  RoutingPolicyAssociationDetails?: RoutingPolicyAssociationDetailsList;
}
export const CoreNetworkChangeEventValues = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CoreNetworkChangeEventValues",
}) as any as S.Schema<CoreNetworkChangeEventValues>;
export interface WhenSentTo {
  WhenSentToSegmentsList?: WhenSentToSegmentsList;
}
export const WhenSentTo = S.suspend(() =>
  S.Struct({ WhenSentToSegmentsList: S.optional(WhenSentToSegmentsList) }),
).annotations({ identifier: "WhenSentTo" }) as any as S.Schema<WhenSentTo>;
export type ExceptionContextMap = { [key: string]: string };
export const ExceptionContextMap = S.Record({ key: S.String, value: S.String });
export interface CoreNetworkChangeEvent {
  Type?: string;
  Action?: string;
  IdentifierPath?: string;
  EventTime?: Date;
  Status?: string;
  Values?: CoreNetworkChangeEventValues;
}
export const CoreNetworkChangeEvent = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Action: S.optional(S.String),
    IdentifierPath: S.optional(S.String),
    EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    Values: S.optional(CoreNetworkChangeEventValues),
  }),
).annotations({
  identifier: "CoreNetworkChangeEvent",
}) as any as S.Schema<CoreNetworkChangeEvent>;
export type CoreNetworkChangeEventList = CoreNetworkChangeEvent[];
export const CoreNetworkChangeEventList = S.Array(CoreNetworkChangeEvent);
export type EdgeSet = string[];
export const EdgeSet = S.Array(S.String);
export type EdgeSetList = EdgeSet[];
export const EdgeSetList = S.Array(EdgeSet);
export interface CreateCoreNetworkResponse {
  CoreNetwork?: CoreNetwork;
}
export const CreateCoreNetworkResponse = S.suspend(() =>
  S.Struct({ CoreNetwork: S.optional(CoreNetwork) }),
).annotations({
  identifier: "CreateCoreNetworkResponse",
}) as any as S.Schema<CreateCoreNetworkResponse>;
export interface DeleteConnectPeerResponse {
  ConnectPeer?: ConnectPeer;
}
export const DeleteConnectPeerResponse = S.suspend(() =>
  S.Struct({ ConnectPeer: S.optional(ConnectPeer) }),
).annotations({
  identifier: "DeleteConnectPeerResponse",
}) as any as S.Schema<DeleteConnectPeerResponse>;
export interface DeletePeeringResponse {
  Peering?: Peering;
}
export const DeletePeeringResponse = S.suspend(() =>
  S.Struct({ Peering: S.optional(Peering) }),
).annotations({
  identifier: "DeletePeeringResponse",
}) as any as S.Schema<DeletePeeringResponse>;
export interface GetCoreNetworkChangeEventsResponse {
  CoreNetworkChangeEvents?: CoreNetworkChangeEventList;
  NextToken?: string;
}
export const GetCoreNetworkChangeEventsResponse = S.suspend(() =>
  S.Struct({
    CoreNetworkChangeEvents: S.optional(CoreNetworkChangeEventList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCoreNetworkChangeEventsResponse",
}) as any as S.Schema<GetCoreNetworkChangeEventsResponse>;
export interface NetworkFunctionGroup {
  Name?: string;
}
export const NetworkFunctionGroup = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "NetworkFunctionGroup",
}) as any as S.Schema<NetworkFunctionGroup>;
export type NetworkFunctionGroupList = NetworkFunctionGroup[];
export const NetworkFunctionGroupList = S.Array(NetworkFunctionGroup);
export interface EdgeOverride {
  EdgeSets?: EdgeSetList;
  UseEdge?: string;
}
export const EdgeOverride = S.suspend(() =>
  S.Struct({
    EdgeSets: S.optional(EdgeSetList),
    UseEdge: S.optional(S.String),
  }),
).annotations({ identifier: "EdgeOverride" }) as any as S.Schema<EdgeOverride>;
export type WithEdgeOverridesList = EdgeOverride[];
export const WithEdgeOverridesList = S.Array(EdgeOverride);
export interface NetworkRouteDestination {
  CoreNetworkAttachmentId?: string;
  TransitGatewayAttachmentId?: string;
  SegmentName?: string;
  NetworkFunctionGroupName?: string;
  EdgeLocation?: string;
  ResourceType?: string;
  ResourceId?: string;
}
export const NetworkRouteDestination = S.suspend(() =>
  S.Struct({
    CoreNetworkAttachmentId: S.optional(S.String),
    TransitGatewayAttachmentId: S.optional(S.String),
    SegmentName: S.optional(S.String),
    NetworkFunctionGroupName: S.optional(S.String),
    EdgeLocation: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkRouteDestination",
}) as any as S.Schema<NetworkRouteDestination>;
export type NetworkRouteDestinationList = NetworkRouteDestination[];
export const NetworkRouteDestinationList = S.Array(NetworkRouteDestination);
export interface Via {
  NetworkFunctionGroups?: NetworkFunctionGroupList;
  WithEdgeOverrides?: WithEdgeOverridesList;
}
export const Via = S.suspend(() =>
  S.Struct({
    NetworkFunctionGroups: S.optional(NetworkFunctionGroupList),
    WithEdgeOverrides: S.optional(WithEdgeOverridesList),
  }),
).annotations({ identifier: "Via" }) as any as S.Schema<Via>;
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface NetworkRoute {
  DestinationCidrBlock?: string;
  Destinations?: NetworkRouteDestinationList;
  PrefixListId?: string;
  State?: string;
  Type?: string;
}
export const NetworkRoute = S.suspend(() =>
  S.Struct({
    DestinationCidrBlock: S.optional(S.String),
    Destinations: S.optional(NetworkRouteDestinationList),
    PrefixListId: S.optional(S.String),
    State: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "NetworkRoute" }) as any as S.Schema<NetworkRoute>;
export type NetworkRouteList = NetworkRoute[];
export const NetworkRouteList = S.Array(NetworkRoute);
export interface ServiceInsertionAction {
  Action?: string;
  Mode?: string;
  WhenSentTo?: WhenSentTo;
  Via?: Via;
}
export const ServiceInsertionAction = S.suspend(() =>
  S.Struct({
    Action: S.optional(S.String),
    Mode: S.optional(S.String),
    WhenSentTo: S.optional(WhenSentTo),
    Via: S.optional(Via),
  }),
).annotations({
  identifier: "ServiceInsertionAction",
}) as any as S.Schema<ServiceInsertionAction>;
export type ServiceInsertionActionList = ServiceInsertionAction[];
export const ServiceInsertionActionList = S.Array(ServiceInsertionAction);
export interface GetNetworkRoutesResponse {
  RouteTableArn?: string;
  CoreNetworkSegmentEdge?: CoreNetworkSegmentEdgeIdentifier;
  RouteTableType?: string;
  RouteTableTimestamp?: Date;
  NetworkRoutes?: NetworkRouteList;
}
export const GetNetworkRoutesResponse = S.suspend(() =>
  S.Struct({
    RouteTableArn: S.optional(S.String),
    CoreNetworkSegmentEdge: S.optional(CoreNetworkSegmentEdgeIdentifier),
    RouteTableType: S.optional(S.String),
    RouteTableTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NetworkRoutes: S.optional(NetworkRouteList),
  }),
).annotations({
  identifier: "GetNetworkRoutesResponse",
}) as any as S.Schema<GetNetworkRoutesResponse>;
export interface GetRouteAnalysisResponse {
  RouteAnalysis?: RouteAnalysis;
}
export const GetRouteAnalysisResponse = S.suspend(() =>
  S.Struct({ RouteAnalysis: S.optional(RouteAnalysis) }),
).annotations({
  identifier: "GetRouteAnalysisResponse",
}) as any as S.Schema<GetRouteAnalysisResponse>;
export interface CoreNetworkChangeValues {
  SegmentName?: string;
  NetworkFunctionGroupName?: string;
  EdgeLocations?: ExternalRegionCodeList;
  Asn?: number;
  Cidr?: string;
  DestinationIdentifier?: string;
  InsideCidrBlocks?: ConstrainedStringList;
  SharedSegments?: ConstrainedStringList;
  ServiceInsertionActions?: ServiceInsertionActionList;
  VpnEcmpSupport?: boolean;
  DnsSupport?: boolean;
  SecurityGroupReferencingSupport?: boolean;
  RoutingPolicyDirection?: string;
  RoutingPolicy?: string;
  PeerEdgeLocations?: ExternalRegionCodeList;
  AttachmentId?: string;
  RoutingPolicyAssociationDetails?: RoutingPolicyAssociationDetailsList;
}
export const CoreNetworkChangeValues = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CoreNetworkChangeValues",
}) as any as S.Schema<CoreNetworkChangeValues>;
export interface CoreNetworkChange {
  Type?: string;
  Action?: string;
  Identifier?: string;
  PreviousValues?: CoreNetworkChangeValues;
  NewValues?: CoreNetworkChangeValues;
  IdentifierPath?: string;
}
export const CoreNetworkChange = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Action: S.optional(S.String),
    Identifier: S.optional(S.String),
    PreviousValues: S.optional(CoreNetworkChangeValues),
    NewValues: S.optional(CoreNetworkChangeValues),
    IdentifierPath: S.optional(S.String),
  }),
).annotations({
  identifier: "CoreNetworkChange",
}) as any as S.Schema<CoreNetworkChange>;
export type CoreNetworkChangeList = CoreNetworkChange[];
export const CoreNetworkChangeList = S.Array(CoreNetworkChange);
export interface GetCoreNetworkChangeSetResponse {
  CoreNetworkChanges?: CoreNetworkChangeList;
  NextToken?: string;
}
export const GetCoreNetworkChangeSetResponse = S.suspend(() =>
  S.Struct({
    CoreNetworkChanges: S.optional(CoreNetworkChangeList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCoreNetworkChangeSetResponse",
}) as any as S.Schema<GetCoreNetworkChangeSetResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class CoreNetworkPolicyException extends S.TaggedError<CoreNetworkPolicyException>()(
  "CoreNetworkPolicyException",
  { Message: S.String, Errors: S.optional(CoreNetworkPolicyErrorList) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    LimitCode: S.String,
    ServiceCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    Context: S.optional(ExceptionContextMap),
  },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Gets the status of the Service Linked Role (SLR) deployment for the accounts in a given Amazon Web Services Organization.
 */
export const listOrganizationServiceAccessStatus: (
  input: ListOrganizationServiceAccessStatusRequest,
) => Effect.Effect<
  ListOrganizationServiceAccessStatusResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOrganizationServiceAccessStatusRequest,
  output: ListOrganizationServiceAccessStatusResponse,
  errors: [],
}));
/**
 * Gets the count of network resources, by resource type, for the specified global network.
 */
export const getNetworkResourceCounts: {
  (
    input: GetNetworkResourceCountsRequest,
  ): Effect.Effect<
    GetNetworkResourceCountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetNetworkResourceCountsRequest,
  ) => Stream.Stream<
    GetNetworkResourceCountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetNetworkResourceCountsRequest,
  ) => Stream.Stream<
    NetworkResourceCount,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getNetworkRoutes: (
  input: GetNetworkRoutesRequest,
) => Effect.Effect<
  GetNetworkRoutesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRouteAnalysis: (
  input: GetRouteAnalysisRequest,
) => Effect.Effect<
  GetRouteAnalysisResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startOrganizationServiceAccessUpdate: (
  input: StartOrganizationServiceAccessUpdateRequest,
) => Effect.Effect<
  StartOrganizationServiceAccessUpdateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listConnectPeers: {
  (
    input: ListConnectPeersRequest,
  ): Effect.Effect<
    ListConnectPeersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectPeersRequest,
  ) => Stream.Stream<
    ListConnectPeersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectPeersRequest,
  ) => Stream.Stream<
    ConnectPeerSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of owned and shared core networks.
 */
export const listCoreNetworks: {
  (
    input: ListCoreNetworksRequest,
  ): Effect.Effect<
    ListCoreNetworksResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCoreNetworksRequest,
  ) => Stream.Stream<
    ListCoreNetworksResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCoreNetworksRequest,
  ) => Stream.Stream<
    CoreNetworkSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns information about a resource policy.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => Effect.Effect<
  GetResourcePolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAttachments: {
  (
    input: ListAttachmentsRequest,
  ): Effect.Effect<
    ListAttachmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttachmentsRequest,
  ) => Stream.Stream<
    ListAttachmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttachmentsRequest,
  ) => Stream.Stream<
    Attachment,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the peerings for a core network.
 */
export const listPeerings: {
  (
    input: ListPeeringsRequest,
  ): Effect.Effect<
    ListPeeringsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPeeringsRequest,
  ) => Stream.Stream<
    ListPeeringsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPeeringsRequest,
  ) => Stream.Stream<
    Peering,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Deletes a resource policy for the specified resource. This revokes the access of the principals specified in the resource policy.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => Effect.Effect<
  DeleteResourcePolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a resource policy.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => Effect.Effect<
  PutResourcePolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createConnection: (
  input: CreateConnectionRequest,
) => Effect.Effect<
  CreateConnectionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createGlobalNetwork: (
  input: CreateGlobalNetworkRequest,
) => Effect.Effect<
  CreateGlobalNetworkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCoreNetwork: (
  input: CreateCoreNetworkRequest,
) => Effect.Effect<
  CreateCoreNetworkResponse,
  | AccessDeniedException
  | ConflictException
  | CoreNetworkPolicyException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeGlobalNetworks: {
  (
    input: DescribeGlobalNetworksRequest,
  ): Effect.Effect<
    DescribeGlobalNetworksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeGlobalNetworksRequest,
  ) => Stream.Stream<
    DescribeGlobalNetworksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeGlobalNetworksRequest,
  ) => Stream.Stream<
    GlobalNetwork,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getCoreNetworkChangeEvents: {
  (
    input: GetCoreNetworkChangeEventsRequest,
  ): Effect.Effect<
    GetCoreNetworkChangeEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCoreNetworkChangeEventsRequest,
  ) => Stream.Stream<
    GetCoreNetworkChangeEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCoreNetworkChangeEventsRequest,
  ) => Stream.Stream<
    CoreNetworkChangeEvent,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getConnectAttachment: (
  input: GetConnectAttachmentRequest,
) => Effect.Effect<
  GetConnectAttachmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectAttachmentRequest,
  output: GetConnectAttachmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the network resource relationships for the specified global network.
 */
export const getNetworkResourceRelationships: {
  (
    input: GetNetworkResourceRelationshipsRequest,
  ): Effect.Effect<
    GetNetworkResourceRelationshipsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetNetworkResourceRelationshipsRequest,
  ) => Stream.Stream<
    GetNetworkResourceRelationshipsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetNetworkResourceRelationshipsRequest,
  ) => Stream.Stream<
    Relationship,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getNetworkResources: {
  (
    input: GetNetworkResourcesRequest,
  ): Effect.Effect<
    GetNetworkResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetNetworkResourcesRequest,
  ) => Stream.Stream<
    GetNetworkResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetNetworkResourcesRequest,
  ) => Stream.Stream<
    NetworkResource,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getVpcAttachment: (
  input: GetVpcAttachmentRequest,
) => Effect.Effect<
  GetVpcAttachmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAttachmentRoutingPolicyAssociations: {
  (
    input: ListAttachmentRoutingPolicyAssociationsRequest,
  ): Effect.Effect<
    ListAttachmentRoutingPolicyAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttachmentRoutingPolicyAssociationsRequest,
  ) => Stream.Stream<
    ListAttachmentRoutingPolicyAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttachmentRoutingPolicyAssociationsRequest,
  ) => Stream.Stream<
    AttachmentRoutingPolicyAssociationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCoreNetworkPolicyVersions: {
  (
    input: ListCoreNetworkPolicyVersionsRequest,
  ): Effect.Effect<
    ListCoreNetworkPolicyVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCoreNetworkPolicyVersionsRequest,
  ) => Stream.Stream<
    ListCoreNetworkPolicyVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCoreNetworkPolicyVersionsRequest,
  ) => Stream.Stream<
    CoreNetworkPolicyVersion,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCoreNetworkPrefixListAssociations: {
  (
    input: ListCoreNetworkPrefixListAssociationsRequest,
  ): Effect.Effect<
    ListCoreNetworkPrefixListAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCoreNetworkPrefixListAssociationsRequest,
  ) => Stream.Stream<
    ListCoreNetworkPrefixListAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCoreNetworkPrefixListAssociationsRequest,
  ) => Stream.Stream<
    PrefixListAssociation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startRouteAnalysis: (
  input: StartRouteAnalysisRequest,
) => Effect.Effect<
  StartRouteAnalysisResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateNetworkResourceMetadata: (
  input: UpdateNetworkResourceMetadataRequest,
) => Effect.Effect<
  UpdateNetworkResourceMetadataResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSite: (
  input: DeleteSiteRequest,
) => Effect.Effect<
  DeleteSiteResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateConnectPeer: (
  input: DisassociateConnectPeerRequest,
) => Effect.Effect<
  DisassociateConnectPeerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates a customer gateway from a device and a link.
 */
export const disassociateCustomerGateway: (
  input: DisassociateCustomerGatewayRequest,
) => Effect.Effect<
  DisassociateCustomerGatewayResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates an existing device from a link. You must first disassociate any customer
 * gateways that are associated with the link.
 */
export const disassociateLink: (
  input: DisassociateLinkRequest,
) => Effect.Effect<
  DisassociateLinkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateTransitGatewayConnectPeer: (
  input: DisassociateTransitGatewayConnectPeerRequest,
) => Effect.Effect<
  DisassociateTransitGatewayConnectPeerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getConnectPeerAssociations: {
  (
    input: GetConnectPeerAssociationsRequest,
  ): Effect.Effect<
    GetConnectPeerAssociationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetConnectPeerAssociationsRequest,
  ) => Stream.Stream<
    GetConnectPeerAssociationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetConnectPeerAssociationsRequest,
  ) => Stream.Stream<
    ConnectPeerAssociation,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getCustomerGatewayAssociations: {
  (
    input: GetCustomerGatewayAssociationsRequest,
  ): Effect.Effect<
    GetCustomerGatewayAssociationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCustomerGatewayAssociationsRequest,
  ) => Stream.Stream<
    GetCustomerGatewayAssociationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCustomerGatewayAssociationsRequest,
  ) => Stream.Stream<
    CustomerGatewayAssociation,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getTransitGatewayConnectPeerAssociations: {
  (
    input: GetTransitGatewayConnectPeerAssociationsRequest,
  ): Effect.Effect<
    GetTransitGatewayConnectPeerAssociationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTransitGatewayConnectPeerAssociationsRequest,
  ) => Stream.Stream<
    GetTransitGatewayConnectPeerAssociationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTransitGatewayConnectPeerAssociationsRequest,
  ) => Stream.Stream<
    TransitGatewayConnectPeerAssociation,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putAttachmentRoutingPolicyLabel: (
  input: PutAttachmentRoutingPolicyLabelRequest,
) => Effect.Effect<
  PutAttachmentRoutingPolicyLabelResponse,
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
export const registerTransitGateway: (
  input: RegisterTransitGatewayRequest,
) => Effect.Effect<
  RegisterTransitGatewayResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Rejects a core network attachment request.
 */
export const rejectAttachment: (
  input: RejectAttachmentRequest,
) => Effect.Effect<
  RejectAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeAttachmentRoutingPolicyLabel: (
  input: RemoveAttachmentRoutingPolicyLabelRequest,
) => Effect.Effect<
  RemoveAttachmentRoutingPolicyLabelResponse,
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
export const restoreCoreNetworkPolicyVersion: (
  input: RestoreCoreNetworkPolicyVersionRequest,
) => Effect.Effect<
  RestoreCoreNetworkPolicyVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateConnection: (
  input: UpdateConnectionRequest,
) => Effect.Effect<
  UpdateConnectionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCoreNetwork: (
  input: UpdateCoreNetworkRequest,
) => Effect.Effect<
  UpdateCoreNetworkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDevice: (
  input: UpdateDeviceRequest,
) => Effect.Effect<
  UpdateDeviceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDirectConnectGatewayAttachment: (
  input: UpdateDirectConnectGatewayAttachmentRequest,
) => Effect.Effect<
  UpdateDirectConnectGatewayAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGlobalNetwork: (
  input: UpdateGlobalNetworkRequest,
) => Effect.Effect<
  UpdateGlobalNetworkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLink: (
  input: UpdateLinkRequest,
) => Effect.Effect<
  UpdateLinkResponse,
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
export const updateSite: (
  input: UpdateSiteRequest,
) => Effect.Effect<
  UpdateSiteResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVpcAttachment: (
  input: UpdateVpcAttachmentRequest,
) => Effect.Effect<
  UpdateVpcAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const executeCoreNetworkChangeSet: (
  input: ExecuteCoreNetworkChangeSetRequest,
) => Effect.Effect<
  ExecuteCoreNetworkChangeSetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Tags a specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCoreNetworkPrefixListAssociation: (
  input: CreateCoreNetworkPrefixListAssociationRequest,
) => Effect.Effect<
  CreateCoreNetworkPrefixListAssociationResponse,
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
export const deleteAttachment: (
  input: DeleteAttachmentRequest,
) => Effect.Effect<
  DeleteAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteConnection: (
  input: DeleteConnectionRequest,
) => Effect.Effect<
  DeleteConnectionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCoreNetwork: (
  input: DeleteCoreNetworkRequest,
) => Effect.Effect<
  DeleteCoreNetworkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCoreNetworkPrefixListAssociation: (
  input: DeleteCoreNetworkPrefixListAssociationRequest,
) => Effect.Effect<
  DeleteCoreNetworkPrefixListAssociationResponse,
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
export const deleteGlobalNetwork: (
  input: DeleteGlobalNetworkRequest,
) => Effect.Effect<
  DeleteGlobalNetworkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateConnectPeer: (
  input: AssociateConnectPeerRequest,
) => Effect.Effect<
  AssociateConnectPeerResponse,
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
}));
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
export const associateCustomerGateway: (
  input: AssociateCustomerGatewayRequest,
) => Effect.Effect<
  AssociateCustomerGatewayResponse,
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
}));
/**
 * Associates a link to a device. A device can be associated to multiple links and a link can be associated to multiple devices. The device and link must be in the same global network and the same site.
 */
export const associateLink: (
  input: AssociateLinkRequest,
) => Effect.Effect<
  AssociateLinkResponse,
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
export const associateTransitGatewayConnectPeer: (
  input: AssociateTransitGatewayConnectPeerRequest,
) => Effect.Effect<
  AssociateTransitGatewayConnectPeerResponse,
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
export const createConnectAttachment: (
  input: CreateConnectAttachmentRequest,
) => Effect.Effect<
  CreateConnectAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a core network Connect peer for a specified core network connect attachment between a core network and an appliance.
 * The peer address and transit gateway address must be the same IP address family (IPv4 or IPv6).
 */
export const createConnectPeer: (
  input: CreateConnectPeerRequest,
) => Effect.Effect<
  CreateConnectPeerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDevice: (
  input: CreateDeviceRequest,
) => Effect.Effect<
  CreateDeviceResponse,
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
export const createDirectConnectGatewayAttachment: (
  input: CreateDirectConnectGatewayAttachmentRequest,
) => Effect.Effect<
  CreateDirectConnectGatewayAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLink: (
  input: CreateLinkRequest,
) => Effect.Effect<
  CreateLinkResponse,
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
export const createSite: (
  input: CreateSiteRequest,
) => Effect.Effect<
  CreateSiteResponse,
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
export const createSiteToSiteVpnAttachment: (
  input: CreateSiteToSiteVpnAttachmentRequest,
) => Effect.Effect<
  CreateSiteToSiteVpnAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTransitGatewayPeering: (
  input: CreateTransitGatewayPeeringRequest,
) => Effect.Effect<
  CreateTransitGatewayPeeringResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a transit gateway route table attachment.
 */
export const createTransitGatewayRouteTableAttachment: (
  input: CreateTransitGatewayRouteTableAttachmentRequest,
) => Effect.Effect<
  CreateTransitGatewayRouteTableAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVpcAttachment: (
  input: CreateVpcAttachmentRequest,
) => Effect.Effect<
  CreateVpcAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDevice: (
  input: DeleteDeviceRequest,
) => Effect.Effect<
  DeleteDeviceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteLink: (
  input: DeleteLinkRequest,
) => Effect.Effect<
  DeleteLinkResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getConnections: {
  (
    input: GetConnectionsRequest,
  ): Effect.Effect<
    GetConnectionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetConnectionsRequest,
  ) => Stream.Stream<
    GetConnectionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetConnectionsRequest,
  ) => Stream.Stream<
    Connection,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns information about a core network Connect peer.
 */
export const getConnectPeer: (
  input: GetConnectPeerRequest,
) => Effect.Effect<
  GetConnectPeerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCoreNetwork: (
  input: GetCoreNetworkRequest,
) => Effect.Effect<
  GetCoreNetworkResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCoreNetworkPolicy: (
  input: GetCoreNetworkPolicyRequest,
) => Effect.Effect<
  GetCoreNetworkPolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCoreNetworkPolicyRequest,
  output: GetCoreNetworkPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about one or more of your devices in a global network.
 */
export const getDevices: {
  (
    input: GetDevicesRequest,
  ): Effect.Effect<
    GetDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDevicesRequest,
  ) => Stream.Stream<
    GetDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDevicesRequest,
  ) => Stream.Stream<
    Device,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getDirectConnectGatewayAttachment: (
  input: GetDirectConnectGatewayAttachmentRequest,
) => Effect.Effect<
  GetDirectConnectGatewayAttachmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getLinkAssociations: {
  (
    input: GetLinkAssociationsRequest,
  ): Effect.Effect<
    GetLinkAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetLinkAssociationsRequest,
  ) => Stream.Stream<
    GetLinkAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetLinkAssociationsRequest,
  ) => Stream.Stream<
    LinkAssociation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getLinks: {
  (
    input: GetLinksRequest,
  ): Effect.Effect<
    GetLinksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetLinksRequest,
  ) => Stream.Stream<
    GetLinksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetLinksRequest,
  ) => Stream.Stream<
    Link,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getSites: {
  (
    input: GetSitesRequest,
  ): Effect.Effect<
    GetSitesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSitesRequest,
  ) => Stream.Stream<
    GetSitesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSitesRequest,
  ) => Stream.Stream<
    Site,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getSiteToSiteVpnAttachment: (
  input: GetSiteToSiteVpnAttachmentRequest,
) => Effect.Effect<
  GetSiteToSiteVpnAttachmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSiteToSiteVpnAttachmentRequest,
  output: GetSiteToSiteVpnAttachmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a transit gateway peer.
 */
export const getTransitGatewayPeering: (
  input: GetTransitGatewayPeeringRequest,
) => Effect.Effect<
  GetTransitGatewayPeeringResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTransitGatewayPeeringRequest,
  output: GetTransitGatewayPeeringResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about the transit gateway registrations in a specified
 * global network.
 */
export const getTransitGatewayRegistrations: {
  (
    input: GetTransitGatewayRegistrationsRequest,
  ): Effect.Effect<
    GetTransitGatewayRegistrationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTransitGatewayRegistrationsRequest,
  ) => Stream.Stream<
    GetTransitGatewayRegistrationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTransitGatewayRegistrationsRequest,
  ) => Stream.Stream<
    TransitGatewayRegistration,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getTransitGatewayRouteTableAttachment: (
  input: GetTransitGatewayRouteTableAttachmentRequest,
) => Effect.Effect<
  GetTransitGatewayRouteTableAttachmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const acceptAttachment: (
  input: AcceptAttachmentRequest,
) => Effect.Effect<
  AcceptAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCoreNetworkPolicyVersion: (
  input: DeleteCoreNetworkPolicyVersionRequest,
) => Effect.Effect<
  DeleteCoreNetworkPolicyVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deregisterTransitGateway: (
  input: DeregisterTransitGatewayRequest,
) => Effect.Effect<
  DeregisterTransitGatewayResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets the network telemetry of the specified global network.
 */
export const getNetworkTelemetry: {
  (
    input: GetNetworkTelemetryRequest,
  ): Effect.Effect<
    GetNetworkTelemetryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetNetworkTelemetryRequest,
  ) => Stream.Stream<
    GetNetworkTelemetryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetNetworkTelemetryRequest,
  ) => Stream.Stream<
    NetworkTelemetry,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCoreNetworkRoutingInformation: {
  (
    input: ListCoreNetworkRoutingInformationRequest,
  ): Effect.Effect<
    ListCoreNetworkRoutingInformationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCoreNetworkRoutingInformationRequest,
  ) => Stream.Stream<
    ListCoreNetworkRoutingInformationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCoreNetworkRoutingInformationRequest,
  ) => Stream.Stream<
    CoreNetworkRoutingInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putCoreNetworkPolicy: (
  input: PutCoreNetworkPolicyRequest,
) => Effect.Effect<
  PutCoreNetworkPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | CoreNetworkPolicyException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a Connect peer.
 */
export const deleteConnectPeer: (
  input: DeleteConnectPeerRequest,
) => Effect.Effect<
  DeleteConnectPeerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePeering: (
  input: DeletePeeringRequest,
) => Effect.Effect<
  DeletePeeringResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCoreNetworkChangeSet: {
  (
    input: GetCoreNetworkChangeSetRequest,
  ): Effect.Effect<
    GetCoreNetworkChangeSetResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCoreNetworkChangeSetRequest,
  ) => Stream.Stream<
    GetCoreNetworkChangeSetResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCoreNetworkChangeSetRequest,
  ) => Stream.Stream<
    CoreNetworkChange,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
