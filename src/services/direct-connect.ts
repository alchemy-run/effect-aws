import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://directconnect.amazonaws.com/doc/2012-10-25/");
const svc = T.AwsApiService({
  sdkId: "Direct Connect",
  serviceShapeName: "OvertureService",
});
const auth = T.AwsAuthSigv4({ name: "directconnect" });
const ver = T.ServiceVersion("2012-10-25");
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
                        url: "https://directconnect-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://directconnect-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://directconnect.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://directconnect.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeCustomerMetadataRequest extends S.Class<DescribeCustomerMetadataRequest>(
  "DescribeCustomerMetadataRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationsRequest extends S.Class<DescribeLocationsRequest>(
  "DescribeLocationsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeVirtualGatewaysRequest extends S.Class<DescribeVirtualGatewaysRequest>(
  "DescribeVirtualGatewaysRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ResourceArnList = S.Array(S.String);
export const BGPPeerIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AllocateConnectionOnInterconnectRequest extends S.Class<AllocateConnectionOnInterconnectRequest>(
  "AllocateConnectionOnInterconnectRequest",
)(
  {
    bandwidth: S.String,
    connectionName: S.String,
    ownerAccount: S.String,
    interconnectId: S.String,
    vlan: S.Number,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateConnectionWithLagRequest extends S.Class<AssociateConnectionWithLagRequest>(
  "AssociateConnectionWithLagRequest",
)(
  { connectionId: S.String, lagId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateHostedConnectionRequest extends S.Class<AssociateHostedConnectionRequest>(
  "AssociateHostedConnectionRequest",
)(
  { connectionId: S.String, parentConnectionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateMacSecKeyRequest extends S.Class<AssociateMacSecKeyRequest>(
  "AssociateMacSecKeyRequest",
)(
  {
    connectionId: S.String,
    secretARN: S.optional(S.String),
    ckn: S.optional(S.String),
    cak: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateVirtualInterfaceRequest extends S.Class<AssociateVirtualInterfaceRequest>(
  "AssociateVirtualInterfaceRequest",
)(
  { virtualInterfaceId: S.String, connectionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConfirmConnectionRequest extends S.Class<ConfirmConnectionRequest>(
  "ConfirmConnectionRequest",
)(
  { connectionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConfirmCustomerAgreementRequest extends S.Class<ConfirmCustomerAgreementRequest>(
  "ConfirmCustomerAgreementRequest",
)(
  { agreementName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConfirmPrivateVirtualInterfaceRequest extends S.Class<ConfirmPrivateVirtualInterfaceRequest>(
  "ConfirmPrivateVirtualInterfaceRequest",
)(
  {
    virtualInterfaceId: S.String,
    virtualGatewayId: S.optional(S.String),
    directConnectGatewayId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConfirmPublicVirtualInterfaceRequest extends S.Class<ConfirmPublicVirtualInterfaceRequest>(
  "ConfirmPublicVirtualInterfaceRequest",
)(
  { virtualInterfaceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConfirmTransitVirtualInterfaceRequest extends S.Class<ConfirmTransitVirtualInterfaceRequest>(
  "ConfirmTransitVirtualInterfaceRequest",
)(
  { virtualInterfaceId: S.String, directConnectGatewayId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateConnectionRequest extends S.Class<CreateConnectionRequest>(
  "CreateConnectionRequest",
)(
  {
    location: S.String,
    bandwidth: S.String,
    connectionName: S.String,
    lagId: S.optional(S.String),
    tags: S.optional(TagList),
    providerName: S.optional(S.String),
    requestMACSec: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDirectConnectGatewayRequest extends S.Class<CreateDirectConnectGatewayRequest>(
  "CreateDirectConnectGatewayRequest",
)(
  {
    directConnectGatewayName: S.String,
    tags: S.optional(TagList),
    amazonSideAsn: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RouteFilterPrefix extends S.Class<RouteFilterPrefix>(
  "RouteFilterPrefix",
)({ cidr: S.optional(S.String) }) {}
export const RouteFilterPrefixList = S.Array(RouteFilterPrefix);
export class CreateDirectConnectGatewayAssociationRequest extends S.Class<CreateDirectConnectGatewayAssociationRequest>(
  "CreateDirectConnectGatewayAssociationRequest",
)(
  {
    directConnectGatewayId: S.String,
    gatewayId: S.optional(S.String),
    addAllowedPrefixesToDirectConnectGateway: S.optional(RouteFilterPrefixList),
    virtualGatewayId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDirectConnectGatewayAssociationProposalRequest extends S.Class<CreateDirectConnectGatewayAssociationProposalRequest>(
  "CreateDirectConnectGatewayAssociationProposalRequest",
)(
  {
    directConnectGatewayId: S.String,
    directConnectGatewayOwnerAccount: S.String,
    gatewayId: S.String,
    addAllowedPrefixesToDirectConnectGateway: S.optional(RouteFilterPrefixList),
    removeAllowedPrefixesToDirectConnectGateway: S.optional(
      RouteFilterPrefixList,
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateInterconnectRequest extends S.Class<CreateInterconnectRequest>(
  "CreateInterconnectRequest",
)(
  {
    interconnectName: S.String,
    bandwidth: S.String,
    location: S.String,
    lagId: S.optional(S.String),
    tags: S.optional(TagList),
    providerName: S.optional(S.String),
    requestMACSec: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLagRequest extends S.Class<CreateLagRequest>(
  "CreateLagRequest",
)(
  {
    numberOfConnections: S.Number,
    location: S.String,
    connectionsBandwidth: S.String,
    lagName: S.String,
    connectionId: S.optional(S.String),
    tags: S.optional(TagList),
    childConnectionTags: S.optional(TagList),
    providerName: S.optional(S.String),
    requestMACSec: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBGPPeerRequest extends S.Class<DeleteBGPPeerRequest>(
  "DeleteBGPPeerRequest",
)(
  {
    virtualInterfaceId: S.optional(S.String),
    asn: S.optional(S.Number),
    asnLong: S.optional(S.Number),
    customerAddress: S.optional(S.String),
    bgpPeerId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConnectionRequest extends S.Class<DeleteConnectionRequest>(
  "DeleteConnectionRequest",
)(
  { connectionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDirectConnectGatewayRequest extends S.Class<DeleteDirectConnectGatewayRequest>(
  "DeleteDirectConnectGatewayRequest",
)(
  { directConnectGatewayId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDirectConnectGatewayAssociationRequest extends S.Class<DeleteDirectConnectGatewayAssociationRequest>(
  "DeleteDirectConnectGatewayAssociationRequest",
)(
  {
    associationId: S.optional(S.String),
    directConnectGatewayId: S.optional(S.String),
    virtualGatewayId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDirectConnectGatewayAssociationProposalRequest extends S.Class<DeleteDirectConnectGatewayAssociationProposalRequest>(
  "DeleteDirectConnectGatewayAssociationProposalRequest",
)(
  { proposalId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInterconnectRequest extends S.Class<DeleteInterconnectRequest>(
  "DeleteInterconnectRequest",
)(
  { interconnectId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLagRequest extends S.Class<DeleteLagRequest>(
  "DeleteLagRequest",
)(
  { lagId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVirtualInterfaceRequest extends S.Class<DeleteVirtualInterfaceRequest>(
  "DeleteVirtualInterfaceRequest",
)(
  { virtualInterfaceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConnectionLoaRequest extends S.Class<DescribeConnectionLoaRequest>(
  "DescribeConnectionLoaRequest",
)(
  {
    connectionId: S.String,
    providerName: S.optional(S.String),
    loaContentType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConnectionsRequest extends S.Class<DescribeConnectionsRequest>(
  "DescribeConnectionsRequest",
)(
  {
    connectionId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConnectionsOnInterconnectRequest extends S.Class<DescribeConnectionsOnInterconnectRequest>(
  "DescribeConnectionsOnInterconnectRequest",
)(
  { interconnectId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDirectConnectGatewayAssociationProposalsRequest extends S.Class<DescribeDirectConnectGatewayAssociationProposalsRequest>(
  "DescribeDirectConnectGatewayAssociationProposalsRequest",
)(
  {
    directConnectGatewayId: S.optional(S.String),
    proposalId: S.optional(S.String),
    associatedGatewayId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDirectConnectGatewayAssociationsRequest extends S.Class<DescribeDirectConnectGatewayAssociationsRequest>(
  "DescribeDirectConnectGatewayAssociationsRequest",
)(
  {
    associationId: S.optional(S.String),
    associatedGatewayId: S.optional(S.String),
    directConnectGatewayId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    virtualGatewayId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDirectConnectGatewayAttachmentsRequest extends S.Class<DescribeDirectConnectGatewayAttachmentsRequest>(
  "DescribeDirectConnectGatewayAttachmentsRequest",
)(
  {
    directConnectGatewayId: S.optional(S.String),
    virtualInterfaceId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDirectConnectGatewaysRequest extends S.Class<DescribeDirectConnectGatewaysRequest>(
  "DescribeDirectConnectGatewaysRequest",
)(
  {
    directConnectGatewayId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHostedConnectionsRequest extends S.Class<DescribeHostedConnectionsRequest>(
  "DescribeHostedConnectionsRequest",
)(
  {
    connectionId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInterconnectLoaRequest extends S.Class<DescribeInterconnectLoaRequest>(
  "DescribeInterconnectLoaRequest",
)(
  {
    interconnectId: S.String,
    providerName: S.optional(S.String),
    loaContentType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInterconnectsRequest extends S.Class<DescribeInterconnectsRequest>(
  "DescribeInterconnectsRequest",
)(
  {
    interconnectId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLagsRequest extends S.Class<DescribeLagsRequest>(
  "DescribeLagsRequest",
)(
  {
    lagId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLoaRequest extends S.Class<DescribeLoaRequest>(
  "DescribeLoaRequest",
)(
  {
    connectionId: S.String,
    providerName: S.optional(S.String),
    loaContentType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRouterConfigurationRequest extends S.Class<DescribeRouterConfigurationRequest>(
  "DescribeRouterConfigurationRequest",
)(
  { virtualInterfaceId: S.String, routerTypeIdentifier: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTagsRequest extends S.Class<DescribeTagsRequest>(
  "DescribeTagsRequest",
)(
  { resourceArns: ResourceArnList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeVirtualInterfacesRequest extends S.Class<DescribeVirtualInterfacesRequest>(
  "DescribeVirtualInterfacesRequest",
)(
  {
    connectionId: S.optional(S.String),
    virtualInterfaceId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateConnectionFromLagRequest extends S.Class<DisassociateConnectionFromLagRequest>(
  "DisassociateConnectionFromLagRequest",
)(
  { connectionId: S.String, lagId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateMacSecKeyRequest extends S.Class<DisassociateMacSecKeyRequest>(
  "DisassociateMacSecKeyRequest",
)(
  { connectionId: S.String, secretARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVirtualInterfaceTestHistoryRequest extends S.Class<ListVirtualInterfaceTestHistoryRequest>(
  "ListVirtualInterfaceTestHistoryRequest",
)(
  {
    testId: S.optional(S.String),
    virtualInterfaceId: S.optional(S.String),
    bgpPeers: S.optional(BGPPeerIdList),
    status: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartBgpFailoverTestRequest extends S.Class<StartBgpFailoverTestRequest>(
  "StartBgpFailoverTestRequest",
)(
  {
    virtualInterfaceId: S.String,
    bgpPeers: S.optional(BGPPeerIdList),
    testDurationInMinutes: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopBgpFailoverTestRequest extends S.Class<StopBgpFailoverTestRequest>(
  "StopBgpFailoverTestRequest",
)(
  { virtualInterfaceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class UpdateConnectionRequest extends S.Class<UpdateConnectionRequest>(
  "UpdateConnectionRequest",
)(
  {
    connectionId: S.String,
    connectionName: S.optional(S.String),
    encryptionMode: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDirectConnectGatewayRequest extends S.Class<UpdateDirectConnectGatewayRequest>(
  "UpdateDirectConnectGatewayRequest",
)(
  { directConnectGatewayId: S.String, newDirectConnectGatewayName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDirectConnectGatewayAssociationRequest extends S.Class<UpdateDirectConnectGatewayAssociationRequest>(
  "UpdateDirectConnectGatewayAssociationRequest",
)(
  {
    associationId: S.optional(S.String),
    addAllowedPrefixesToDirectConnectGateway: S.optional(RouteFilterPrefixList),
    removeAllowedPrefixesToDirectConnectGateway: S.optional(
      RouteFilterPrefixList,
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLagRequest extends S.Class<UpdateLagRequest>(
  "UpdateLagRequest",
)(
  {
    lagId: S.String,
    lagName: S.optional(S.String),
    minimumLinks: S.optional(S.Number),
    encryptionMode: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateVirtualInterfaceAttributesRequest extends S.Class<UpdateVirtualInterfaceAttributesRequest>(
  "UpdateVirtualInterfaceAttributesRequest",
)(
  {
    virtualInterfaceId: S.String,
    mtu: S.optional(S.Number),
    enableSiteLink: S.optional(S.Boolean),
    virtualInterfaceName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const AvailablePortSpeeds = S.Array(S.String);
export const ProviderList = S.Array(S.String);
export const AvailableMacSecPortSpeeds = S.Array(S.String);
export class NewPrivateVirtualInterfaceAllocation extends S.Class<NewPrivateVirtualInterfaceAllocation>(
  "NewPrivateVirtualInterfaceAllocation",
)({
  virtualInterfaceName: S.String,
  vlan: S.Number,
  asn: S.optional(S.Number),
  asnLong: S.optional(S.Number),
  mtu: S.optional(S.Number),
  authKey: S.optional(S.String),
  amazonAddress: S.optional(S.String),
  addressFamily: S.optional(S.String),
  customerAddress: S.optional(S.String),
  tags: S.optional(TagList),
}) {}
export class NewPublicVirtualInterfaceAllocation extends S.Class<NewPublicVirtualInterfaceAllocation>(
  "NewPublicVirtualInterfaceAllocation",
)({
  virtualInterfaceName: S.String,
  vlan: S.Number,
  asn: S.optional(S.Number),
  asnLong: S.optional(S.Number),
  authKey: S.optional(S.String),
  amazonAddress: S.optional(S.String),
  customerAddress: S.optional(S.String),
  addressFamily: S.optional(S.String),
  routeFilterPrefixes: S.optional(RouteFilterPrefixList),
  tags: S.optional(TagList),
}) {}
export class NewTransitVirtualInterfaceAllocation extends S.Class<NewTransitVirtualInterfaceAllocation>(
  "NewTransitVirtualInterfaceAllocation",
)({
  virtualInterfaceName: S.optional(S.String),
  vlan: S.optional(S.Number),
  asn: S.optional(S.Number),
  asnLong: S.optional(S.Number),
  mtu: S.optional(S.Number),
  authKey: S.optional(S.String),
  amazonAddress: S.optional(S.String),
  customerAddress: S.optional(S.String),
  addressFamily: S.optional(S.String),
  tags: S.optional(TagList),
}) {}
export class NewBGPPeer extends S.Class<NewBGPPeer>("NewBGPPeer")({
  asn: S.optional(S.Number),
  asnLong: S.optional(S.Number),
  authKey: S.optional(S.String),
  addressFamily: S.optional(S.String),
  amazonAddress: S.optional(S.String),
  customerAddress: S.optional(S.String),
}) {}
export class MacSecKey extends S.Class<MacSecKey>("MacSecKey")({
  secretARN: S.optional(S.String),
  ckn: S.optional(S.String),
  state: S.optional(S.String),
  startOn: S.optional(S.String),
}) {}
export const MacSecKeyList = S.Array(MacSecKey);
export class Connection extends S.Class<Connection>("Connection")(
  {
    ownerAccount: S.optional(S.String),
    connectionId: S.optional(S.String),
    connectionName: S.optional(S.String),
    connectionState: S.optional(S.String),
    region: S.optional(S.String),
    location: S.optional(S.String),
    bandwidth: S.optional(S.String),
    vlan: S.optional(S.Number),
    partnerName: S.optional(S.String),
    loaIssueTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lagId: S.optional(S.String),
    awsDevice: S.optional(S.String),
    jumboFrameCapable: S.optional(S.Boolean),
    awsDeviceV2: S.optional(S.String),
    awsLogicalDeviceId: S.optional(S.String),
    hasLogicalRedundancy: S.optional(S.String),
    tags: S.optional(TagList),
    providerName: S.optional(S.String),
    macSecCapable: S.optional(S.Boolean),
    portEncryptionStatus: S.optional(S.String),
    encryptionMode: S.optional(S.String),
    macSecKeys: S.optional(MacSecKeyList),
    partnerInterconnectMacSecCapable: S.optional(S.Boolean),
  },
  ns,
) {}
export const ConnectionList = S.Array(Connection);
export class NewPrivateVirtualInterface extends S.Class<NewPrivateVirtualInterface>(
  "NewPrivateVirtualInterface",
)({
  virtualInterfaceName: S.String,
  vlan: S.Number,
  asn: S.optional(S.Number),
  asnLong: S.optional(S.Number),
  mtu: S.optional(S.Number),
  authKey: S.optional(S.String),
  amazonAddress: S.optional(S.String),
  customerAddress: S.optional(S.String),
  addressFamily: S.optional(S.String),
  virtualGatewayId: S.optional(S.String),
  directConnectGatewayId: S.optional(S.String),
  tags: S.optional(TagList),
  enableSiteLink: S.optional(S.Boolean),
}) {}
export class NewPublicVirtualInterface extends S.Class<NewPublicVirtualInterface>(
  "NewPublicVirtualInterface",
)({
  virtualInterfaceName: S.String,
  vlan: S.Number,
  asn: S.optional(S.Number),
  asnLong: S.optional(S.Number),
  authKey: S.optional(S.String),
  amazonAddress: S.optional(S.String),
  customerAddress: S.optional(S.String),
  addressFamily: S.optional(S.String),
  routeFilterPrefixes: S.optional(RouteFilterPrefixList),
  tags: S.optional(TagList),
}) {}
export class NewTransitVirtualInterface extends S.Class<NewTransitVirtualInterface>(
  "NewTransitVirtualInterface",
)({
  virtualInterfaceName: S.optional(S.String),
  vlan: S.optional(S.Number),
  asn: S.optional(S.Number),
  asnLong: S.optional(S.Number),
  mtu: S.optional(S.Number),
  authKey: S.optional(S.String),
  amazonAddress: S.optional(S.String),
  customerAddress: S.optional(S.String),
  addressFamily: S.optional(S.String),
  directConnectGatewayId: S.optional(S.String),
  tags: S.optional(TagList),
  enableSiteLink: S.optional(S.Boolean),
}) {}
export class CustomerAgreement extends S.Class<CustomerAgreement>(
  "CustomerAgreement",
)({ agreementName: S.optional(S.String), status: S.optional(S.String) }) {}
export const AgreementList = S.Array(CustomerAgreement);
export class AssociatedGateway extends S.Class<AssociatedGateway>(
  "AssociatedGateway",
)({
  id: S.optional(S.String),
  type: S.optional(S.String),
  ownerAccount: S.optional(S.String),
  region: S.optional(S.String),
}) {}
export class DirectConnectGatewayAssociationProposal extends S.Class<DirectConnectGatewayAssociationProposal>(
  "DirectConnectGatewayAssociationProposal",
)({
  proposalId: S.optional(S.String),
  directConnectGatewayId: S.optional(S.String),
  directConnectGatewayOwnerAccount: S.optional(S.String),
  proposalState: S.optional(S.String),
  associatedGateway: S.optional(AssociatedGateway),
  existingAllowedPrefixesToDirectConnectGateway: S.optional(
    RouteFilterPrefixList,
  ),
  requestedAllowedPrefixesToDirectConnectGateway: S.optional(
    RouteFilterPrefixList,
  ),
}) {}
export const DirectConnectGatewayAssociationProposalList = S.Array(
  DirectConnectGatewayAssociationProposal,
);
export class AssociatedCoreNetwork extends S.Class<AssociatedCoreNetwork>(
  "AssociatedCoreNetwork",
)({
  id: S.optional(S.String),
  ownerAccount: S.optional(S.String),
  attachmentId: S.optional(S.String),
}) {}
export class DirectConnectGatewayAssociation extends S.Class<DirectConnectGatewayAssociation>(
  "DirectConnectGatewayAssociation",
)({
  directConnectGatewayId: S.optional(S.String),
  directConnectGatewayOwnerAccount: S.optional(S.String),
  associationState: S.optional(S.String),
  stateChangeError: S.optional(S.String),
  associatedGateway: S.optional(AssociatedGateway),
  associationId: S.optional(S.String),
  allowedPrefixesToDirectConnectGateway: S.optional(RouteFilterPrefixList),
  associatedCoreNetwork: S.optional(AssociatedCoreNetwork),
  virtualGatewayId: S.optional(S.String),
  virtualGatewayRegion: S.optional(S.String),
  virtualGatewayOwnerAccount: S.optional(S.String),
}) {}
export const DirectConnectGatewayAssociationList = S.Array(
  DirectConnectGatewayAssociation,
);
export class DirectConnectGateway extends S.Class<DirectConnectGateway>(
  "DirectConnectGateway",
)({
  directConnectGatewayId: S.optional(S.String),
  directConnectGatewayName: S.optional(S.String),
  amazonSideAsn: S.optional(S.Number),
  ownerAccount: S.optional(S.String),
  directConnectGatewayState: S.optional(S.String),
  stateChangeError: S.optional(S.String),
  tags: S.optional(TagList),
}) {}
export const DirectConnectGatewayList = S.Array(DirectConnectGateway);
export class Interconnect extends S.Class<Interconnect>("Interconnect")(
  {
    interconnectId: S.optional(S.String),
    interconnectName: S.optional(S.String),
    interconnectState: S.optional(S.String),
    region: S.optional(S.String),
    location: S.optional(S.String),
    bandwidth: S.optional(S.String),
    loaIssueTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lagId: S.optional(S.String),
    awsDevice: S.optional(S.String),
    jumboFrameCapable: S.optional(S.Boolean),
    awsDeviceV2: S.optional(S.String),
    awsLogicalDeviceId: S.optional(S.String),
    hasLogicalRedundancy: S.optional(S.String),
    tags: S.optional(TagList),
    providerName: S.optional(S.String),
    macSecCapable: S.optional(S.Boolean),
    portEncryptionStatus: S.optional(S.String),
    encryptionMode: S.optional(S.String),
    macSecKeys: S.optional(MacSecKeyList),
  },
  ns,
) {}
export const InterconnectList = S.Array(Interconnect);
export class Lag extends S.Class<Lag>("Lag")(
  {
    connectionsBandwidth: S.optional(S.String),
    numberOfConnections: S.optional(S.Number),
    lagId: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    lagName: S.optional(S.String),
    lagState: S.optional(S.String),
    location: S.optional(S.String),
    region: S.optional(S.String),
    minimumLinks: S.optional(S.Number),
    awsDevice: S.optional(S.String),
    awsDeviceV2: S.optional(S.String),
    awsLogicalDeviceId: S.optional(S.String),
    connections: S.optional(ConnectionList),
    allowsHostedConnections: S.optional(S.Boolean),
    jumboFrameCapable: S.optional(S.Boolean),
    hasLogicalRedundancy: S.optional(S.String),
    tags: S.optional(TagList),
    providerName: S.optional(S.String),
    macSecCapable: S.optional(S.Boolean),
    encryptionMode: S.optional(S.String),
    macSecKeys: S.optional(MacSecKeyList),
  },
  ns,
) {}
export const LagList = S.Array(Lag);
export class Location extends S.Class<Location>("Location")({
  locationCode: S.optional(S.String),
  locationName: S.optional(S.String),
  region: S.optional(S.String),
  availablePortSpeeds: S.optional(AvailablePortSpeeds),
  availableProviders: S.optional(ProviderList),
  availableMacSecPortSpeeds: S.optional(AvailableMacSecPortSpeeds),
}) {}
export const LocationList = S.Array(Location);
export class VirtualGateway extends S.Class<VirtualGateway>("VirtualGateway")({
  virtualGatewayId: S.optional(S.String),
  virtualGatewayState: S.optional(S.String),
}) {}
export const VirtualGatewayList = S.Array(VirtualGateway);
export class BGPPeer extends S.Class<BGPPeer>("BGPPeer")({
  bgpPeerId: S.optional(S.String),
  asn: S.optional(S.Number),
  asnLong: S.optional(S.Number),
  authKey: S.optional(S.String),
  addressFamily: S.optional(S.String),
  amazonAddress: S.optional(S.String),
  customerAddress: S.optional(S.String),
  bgpPeerState: S.optional(S.String),
  bgpStatus: S.optional(S.String),
  awsDeviceV2: S.optional(S.String),
  awsLogicalDeviceId: S.optional(S.String),
}) {}
export const BGPPeerList = S.Array(BGPPeer);
export class VirtualInterface extends S.Class<VirtualInterface>(
  "VirtualInterface",
)(
  {
    ownerAccount: S.optional(S.String),
    virtualInterfaceId: S.optional(S.String),
    location: S.optional(S.String),
    connectionId: S.optional(S.String),
    virtualInterfaceType: S.optional(S.String),
    virtualInterfaceName: S.optional(S.String),
    vlan: S.optional(S.Number),
    asn: S.optional(S.Number),
    asnLong: S.optional(S.Number),
    amazonSideAsn: S.optional(S.Number),
    authKey: S.optional(S.String),
    amazonAddress: S.optional(S.String),
    customerAddress: S.optional(S.String),
    addressFamily: S.optional(S.String),
    virtualInterfaceState: S.optional(S.String),
    customerRouterConfig: S.optional(S.String),
    mtu: S.optional(S.Number),
    jumboFrameCapable: S.optional(S.Boolean),
    virtualGatewayId: S.optional(S.String),
    directConnectGatewayId: S.optional(S.String),
    routeFilterPrefixes: S.optional(RouteFilterPrefixList),
    bgpPeers: S.optional(BGPPeerList),
    region: S.optional(S.String),
    awsDeviceV2: S.optional(S.String),
    awsLogicalDeviceId: S.optional(S.String),
    tags: S.optional(TagList),
    siteLinkEnabled: S.optional(S.Boolean),
  },
  ns,
) {}
export const VirtualInterfaceList = S.Array(VirtualInterface);
export class AcceptDirectConnectGatewayAssociationProposalRequest extends S.Class<AcceptDirectConnectGatewayAssociationProposalRequest>(
  "AcceptDirectConnectGatewayAssociationProposalRequest",
)(
  {
    directConnectGatewayId: S.String,
    proposalId: S.String,
    associatedGatewayOwnerAccount: S.String,
    overrideAllowedPrefixesToDirectConnectGateway: S.optional(
      RouteFilterPrefixList,
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AllocateHostedConnectionRequest extends S.Class<AllocateHostedConnectionRequest>(
  "AllocateHostedConnectionRequest",
)(
  {
    connectionId: S.String,
    ownerAccount: S.String,
    bandwidth: S.String,
    connectionName: S.String,
    vlan: S.Number,
    tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AllocatePrivateVirtualInterfaceRequest extends S.Class<AllocatePrivateVirtualInterfaceRequest>(
  "AllocatePrivateVirtualInterfaceRequest",
)(
  {
    connectionId: S.String,
    ownerAccount: S.String,
    newPrivateVirtualInterfaceAllocation: NewPrivateVirtualInterfaceAllocation,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AllocatePublicVirtualInterfaceRequest extends S.Class<AllocatePublicVirtualInterfaceRequest>(
  "AllocatePublicVirtualInterfaceRequest",
)(
  {
    connectionId: S.String,
    ownerAccount: S.String,
    newPublicVirtualInterfaceAllocation: NewPublicVirtualInterfaceAllocation,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AllocateTransitVirtualInterfaceRequest extends S.Class<AllocateTransitVirtualInterfaceRequest>(
  "AllocateTransitVirtualInterfaceRequest",
)(
  {
    connectionId: S.String,
    ownerAccount: S.String,
    newTransitVirtualInterfaceAllocation: NewTransitVirtualInterfaceAllocation,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateMacSecKeyResponse extends S.Class<AssociateMacSecKeyResponse>(
  "AssociateMacSecKeyResponse",
)(
  { connectionId: S.optional(S.String), macSecKeys: S.optional(MacSecKeyList) },
  ns,
) {}
export class ConfirmConnectionResponse extends S.Class<ConfirmConnectionResponse>(
  "ConfirmConnectionResponse",
)({ connectionState: S.optional(S.String) }, ns) {}
export class ConfirmCustomerAgreementResponse extends S.Class<ConfirmCustomerAgreementResponse>(
  "ConfirmCustomerAgreementResponse",
)({ status: S.optional(S.String) }, ns) {}
export class ConfirmPrivateVirtualInterfaceResponse extends S.Class<ConfirmPrivateVirtualInterfaceResponse>(
  "ConfirmPrivateVirtualInterfaceResponse",
)({ virtualInterfaceState: S.optional(S.String) }, ns) {}
export class ConfirmPublicVirtualInterfaceResponse extends S.Class<ConfirmPublicVirtualInterfaceResponse>(
  "ConfirmPublicVirtualInterfaceResponse",
)({ virtualInterfaceState: S.optional(S.String) }, ns) {}
export class ConfirmTransitVirtualInterfaceResponse extends S.Class<ConfirmTransitVirtualInterfaceResponse>(
  "ConfirmTransitVirtualInterfaceResponse",
)({ virtualInterfaceState: S.optional(S.String) }, ns) {}
export class CreateBGPPeerRequest extends S.Class<CreateBGPPeerRequest>(
  "CreateBGPPeerRequest",
)(
  {
    virtualInterfaceId: S.optional(S.String),
    newBGPPeer: S.optional(NewBGPPeer),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePrivateVirtualInterfaceRequest extends S.Class<CreatePrivateVirtualInterfaceRequest>(
  "CreatePrivateVirtualInterfaceRequest",
)(
  {
    connectionId: S.String,
    newPrivateVirtualInterface: NewPrivateVirtualInterface,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePublicVirtualInterfaceRequest extends S.Class<CreatePublicVirtualInterfaceRequest>(
  "CreatePublicVirtualInterfaceRequest",
)(
  {
    connectionId: S.String,
    newPublicVirtualInterface: NewPublicVirtualInterface,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTransitVirtualInterfaceRequest extends S.Class<CreateTransitVirtualInterfaceRequest>(
  "CreateTransitVirtualInterfaceRequest",
)(
  {
    connectionId: S.String,
    newTransitVirtualInterface: NewTransitVirtualInterface,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBGPPeerResponse extends S.Class<DeleteBGPPeerResponse>(
  "DeleteBGPPeerResponse",
)({ virtualInterface: S.optional(VirtualInterface) }, ns) {}
export class DeleteDirectConnectGatewayResult extends S.Class<DeleteDirectConnectGatewayResult>(
  "DeleteDirectConnectGatewayResult",
)({ directConnectGateway: S.optional(DirectConnectGateway) }, ns) {}
export class DeleteDirectConnectGatewayAssociationResult extends S.Class<DeleteDirectConnectGatewayAssociationResult>(
  "DeleteDirectConnectGatewayAssociationResult",
)(
  {
    directConnectGatewayAssociation: S.optional(
      DirectConnectGatewayAssociation,
    ),
  },
  ns,
) {}
export class DeleteDirectConnectGatewayAssociationProposalResult extends S.Class<DeleteDirectConnectGatewayAssociationProposalResult>(
  "DeleteDirectConnectGatewayAssociationProposalResult",
)(
  {
    directConnectGatewayAssociationProposal: S.optional(
      DirectConnectGatewayAssociationProposal,
    ),
  },
  ns,
) {}
export class DeleteInterconnectResponse extends S.Class<DeleteInterconnectResponse>(
  "DeleteInterconnectResponse",
)({ interconnectState: S.optional(S.String) }, ns) {}
export class DeleteVirtualInterfaceResponse extends S.Class<DeleteVirtualInterfaceResponse>(
  "DeleteVirtualInterfaceResponse",
)({ virtualInterfaceState: S.optional(S.String) }, ns) {}
export class Loa extends S.Class<Loa>("Loa")(
  { loaContent: S.optional(T.Blob), loaContentType: S.optional(S.String) },
  ns,
) {}
export class DescribeConnectionLoaResponse extends S.Class<DescribeConnectionLoaResponse>(
  "DescribeConnectionLoaResponse",
)({ loa: S.optional(Loa) }, ns) {}
export class Connections extends S.Class<Connections>("Connections")(
  { connections: S.optional(ConnectionList), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeCustomerMetadataResponse extends S.Class<DescribeCustomerMetadataResponse>(
  "DescribeCustomerMetadataResponse",
)(
  {
    agreements: S.optional(AgreementList),
    nniPartnerType: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDirectConnectGatewayAssociationProposalsResult extends S.Class<DescribeDirectConnectGatewayAssociationProposalsResult>(
  "DescribeDirectConnectGatewayAssociationProposalsResult",
)(
  {
    directConnectGatewayAssociationProposals: S.optional(
      DirectConnectGatewayAssociationProposalList,
    ),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDirectConnectGatewayAssociationsResult extends S.Class<DescribeDirectConnectGatewayAssociationsResult>(
  "DescribeDirectConnectGatewayAssociationsResult",
)(
  {
    directConnectGatewayAssociations: S.optional(
      DirectConnectGatewayAssociationList,
    ),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDirectConnectGatewaysResult extends S.Class<DescribeDirectConnectGatewaysResult>(
  "DescribeDirectConnectGatewaysResult",
)(
  {
    directConnectGateways: S.optional(DirectConnectGatewayList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeInterconnectLoaResponse extends S.Class<DescribeInterconnectLoaResponse>(
  "DescribeInterconnectLoaResponse",
)({ loa: S.optional(Loa) }, ns) {}
export class Interconnects extends S.Class<Interconnects>("Interconnects")(
  {
    interconnects: S.optional(InterconnectList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class Lags extends S.Class<Lags>("Lags")(
  { lags: S.optional(LagList), nextToken: S.optional(S.String) },
  ns,
) {}
export class Locations extends S.Class<Locations>("Locations")(
  { locations: S.optional(LocationList) },
  ns,
) {}
export class VirtualGateways extends S.Class<VirtualGateways>(
  "VirtualGateways",
)({ virtualGateways: S.optional(VirtualGatewayList) }, ns) {}
export class VirtualInterfaces extends S.Class<VirtualInterfaces>(
  "VirtualInterfaces",
)(
  {
    virtualInterfaces: S.optional(VirtualInterfaceList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DisassociateMacSecKeyResponse extends S.Class<DisassociateMacSecKeyResponse>(
  "DisassociateMacSecKeyResponse",
)(
  { connectionId: S.optional(S.String), macSecKeys: S.optional(MacSecKeyList) },
  ns,
) {}
export class VirtualInterfaceTestHistory extends S.Class<VirtualInterfaceTestHistory>(
  "VirtualInterfaceTestHistory",
)({
  testId: S.optional(S.String),
  virtualInterfaceId: S.optional(S.String),
  bgpPeers: S.optional(BGPPeerIdList),
  status: S.optional(S.String),
  ownerAccount: S.optional(S.String),
  testDurationInMinutes: S.optional(S.Number),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class StartBgpFailoverTestResponse extends S.Class<StartBgpFailoverTestResponse>(
  "StartBgpFailoverTestResponse",
)({ virtualInterfaceTest: S.optional(VirtualInterfaceTestHistory) }, ns) {}
export class StopBgpFailoverTestResponse extends S.Class<StopBgpFailoverTestResponse>(
  "StopBgpFailoverTestResponse",
)({ virtualInterfaceTest: S.optional(VirtualInterfaceTestHistory) }, ns) {}
export class UpdateDirectConnectGatewayResponse extends S.Class<UpdateDirectConnectGatewayResponse>(
  "UpdateDirectConnectGatewayResponse",
)({ directConnectGateway: S.optional(DirectConnectGateway) }, ns) {}
export class UpdateDirectConnectGatewayAssociationResult extends S.Class<UpdateDirectConnectGatewayAssociationResult>(
  "UpdateDirectConnectGatewayAssociationResult",
)(
  {
    directConnectGatewayAssociation: S.optional(
      DirectConnectGatewayAssociation,
    ),
  },
  ns,
) {}
export class DirectConnectGatewayAttachment extends S.Class<DirectConnectGatewayAttachment>(
  "DirectConnectGatewayAttachment",
)({
  directConnectGatewayId: S.optional(S.String),
  virtualInterfaceId: S.optional(S.String),
  virtualInterfaceRegion: S.optional(S.String),
  virtualInterfaceOwnerAccount: S.optional(S.String),
  attachmentState: S.optional(S.String),
  attachmentType: S.optional(S.String),
  stateChangeError: S.optional(S.String),
}) {}
export const DirectConnectGatewayAttachmentList = S.Array(
  DirectConnectGatewayAttachment,
);
export class RouterType extends S.Class<RouterType>("RouterType")({
  vendor: S.optional(S.String),
  platform: S.optional(S.String),
  software: S.optional(S.String),
  xsltTemplateName: S.optional(S.String),
  xsltTemplateNameForMacSec: S.optional(S.String),
  routerTypeIdentifier: S.optional(S.String),
}) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  resourceArn: S.optional(S.String),
  tags: S.optional(TagList),
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export const VirtualInterfaceTestHistoryList = S.Array(
  VirtualInterfaceTestHistory,
);
export class AcceptDirectConnectGatewayAssociationProposalResult extends S.Class<AcceptDirectConnectGatewayAssociationProposalResult>(
  "AcceptDirectConnectGatewayAssociationProposalResult",
)(
  {
    directConnectGatewayAssociation: S.optional(
      DirectConnectGatewayAssociation,
    ),
  },
  ns,
) {}
export class AllocateTransitVirtualInterfaceResult extends S.Class<AllocateTransitVirtualInterfaceResult>(
  "AllocateTransitVirtualInterfaceResult",
)({ virtualInterface: S.optional(VirtualInterface) }, ns) {}
export class CreateBGPPeerResponse extends S.Class<CreateBGPPeerResponse>(
  "CreateBGPPeerResponse",
)({ virtualInterface: S.optional(VirtualInterface) }, ns) {}
export class CreateDirectConnectGatewayResult extends S.Class<CreateDirectConnectGatewayResult>(
  "CreateDirectConnectGatewayResult",
)({ directConnectGateway: S.optional(DirectConnectGateway) }, ns) {}
export class CreateDirectConnectGatewayAssociationProposalResult extends S.Class<CreateDirectConnectGatewayAssociationProposalResult>(
  "CreateDirectConnectGatewayAssociationProposalResult",
)(
  {
    directConnectGatewayAssociationProposal: S.optional(
      DirectConnectGatewayAssociationProposal,
    ),
  },
  ns,
) {}
export class CreateTransitVirtualInterfaceResult extends S.Class<CreateTransitVirtualInterfaceResult>(
  "CreateTransitVirtualInterfaceResult",
)({ virtualInterface: S.optional(VirtualInterface) }, ns) {}
export class DescribeDirectConnectGatewayAttachmentsResult extends S.Class<DescribeDirectConnectGatewayAttachmentsResult>(
  "DescribeDirectConnectGatewayAttachmentsResult",
)(
  {
    directConnectGatewayAttachments: S.optional(
      DirectConnectGatewayAttachmentList,
    ),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeRouterConfigurationResponse extends S.Class<DescribeRouterConfigurationResponse>(
  "DescribeRouterConfigurationResponse",
)(
  {
    customerRouterConfig: S.optional(S.String),
    router: S.optional(RouterType),
    virtualInterfaceId: S.optional(S.String),
    virtualInterfaceName: S.optional(S.String),
  },
  ns,
) {}
export class DescribeTagsResponse extends S.Class<DescribeTagsResponse>(
  "DescribeTagsResponse",
)({ resourceTags: S.optional(ResourceTagList) }, ns) {}
export class ListVirtualInterfaceTestHistoryResponse extends S.Class<ListVirtualInterfaceTestHistoryResponse>(
  "ListVirtualInterfaceTestHistoryResponse",
)(
  {
    virtualInterfaceTestHistory: S.optional(VirtualInterfaceTestHistoryList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class CreateDirectConnectGatewayAssociationResult extends S.Class<CreateDirectConnectGatewayAssociationResult>(
  "CreateDirectConnectGatewayAssociationResult",
)(
  {
    directConnectGatewayAssociation: S.optional(
      DirectConnectGatewayAssociation,
    ),
  },
  ns,
) {}

//# Errors
export class DirectConnectClientException extends S.TaggedError<DirectConnectClientException>()(
  "DirectConnectClientException",
  {},
) {}
export class DirectConnectServerException extends S.TaggedError<DirectConnectServerException>()(
  "DirectConnectServerException",
  {},
) {}
export class DuplicateTagKeysException extends S.TaggedError<DuplicateTagKeysException>()(
  "DuplicateTagKeysException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  {},
) {}

//# Operations
/**
 * Deletes the specified connection.
 *
 * Deleting a connection only stops the Direct Connect port hour and data transfer charges.
 * If you are partnering with any third parties to connect with the Direct Connect location,
 * you must cancel your service with them separately.
 */
export const deleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: Connection,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes the specified link aggregation group (LAG). You cannot delete a LAG if it has active
 * virtual interfaces or hosted connections.
 */
export const deleteLag = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLagRequest,
  output: Lag,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deprecated. Use DescribeHostedConnections instead.
 *
 * Lists the connections that have been provisioned on the specified interconnect.
 *
 * Intended for use by Direct Connect Partners only.
 */
export const describeConnectionsOnInterconnect =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConnectionsOnInterconnectRequest,
    output: Connections,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Lists the hosted connections that have been provisioned on the specified
 * interconnect or link aggregation group (LAG).
 *
 * Intended for use by Direct Connect Partners only.
 */
export const describeHostedConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeHostedConnectionsRequest,
    output: Connections,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Disassociates a connection from a link aggregation group (LAG). The connection is
 * interrupted and re-established as a standalone connection (the connection is not
 * deleted; to delete the connection, use the DeleteConnection request).
 * If the LAG has associated virtual interfaces or hosted connections, they remain
 * associated with the LAG. A disassociated connection owned by an Direct Connect Partner is
 * automatically converted to an interconnect.
 *
 * If disassociating the connection would cause the LAG to fall below its setting for
 * minimum number of operational connections, the request fails, except when it's the last
 * member of the LAG. If all connections are disassociated, the LAG continues to exist as
 * an empty LAG with no physical connections.
 */
export const disassociateConnectionFromLag =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateConnectionFromLagRequest,
    output: Connection,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Removes one or more tags from the specified Direct Connect resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Updates the Direct Connect connection configuration.
 *
 * You can update the following parameters for a connection:
 *
 * - The connection name
 *
 * - The connection's MAC Security (MACsec) encryption mode.
 */
export const updateConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectionRequest,
  output: Connection,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Updates the attributes of the specified link aggregation group (LAG).
 *
 * You can update the following LAG attributes:
 *
 * - The name of the LAG.
 *
 * - The value for the minimum number of connections that must be operational
 * for the LAG itself to be operational.
 *
 * - The LAG's MACsec encryption mode.
 *
 * Amazon Web Services assigns this value to each connection which is part of the LAG.
 *
 * - The tags
 *
 * If you adjust the threshold value for the minimum number of operational connections, ensure
 * that the new value does not cause the LAG to fall below the threshold and become
 * non-operational.
 */
export const updateLag = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLagRequest,
  output: Lag,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Updates the specified attributes of the specified virtual private interface.
 *
 * Setting the MTU of a virtual interface to 8500 (jumbo frames) can cause an update to
 * the underlying physical connection if it wasn't updated to support jumbo frames. Updating
 * the connection disrupts network connectivity for all virtual interfaces associated with
 * the connection for up to 30 seconds. To check whether your connection supports jumbo
 * frames, call DescribeConnections. To check whether your virtual
 * interface supports jumbo frames, call DescribeVirtualInterfaces.
 */
export const updateVirtualInterfaceAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateVirtualInterfaceAttributesRequest,
    output: VirtualInterface,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Creates a hosted connection on the specified interconnect or a link aggregation group (LAG) of interconnects.
 *
 * Allocates a VLAN number and a specified amount of capacity (bandwidth) for use by a hosted connection on the specified interconnect or LAG of interconnects.
 * Amazon Web Services polices the hosted connection for the specified capacity and the Direct Connect Partner must also police the hosted connection for the specified capacity.
 *
 * Intended for use by Direct Connect Partners only.
 */
export const allocateHostedConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AllocateHostedConnectionRequest,
    output: Connection,
    errors: [
      DirectConnectClientException,
      DirectConnectServerException,
      DuplicateTagKeysException,
      TooManyTagsException,
    ],
  }),
);
/**
 * Provisions a private virtual interface to be owned by the specified Amazon Web Services account.
 *
 * Virtual interfaces created using this action must be confirmed by the owner using ConfirmPrivateVirtualInterface.
 * Until then, the virtual interface is in the `Confirming` state and is not available to handle traffic.
 */
export const allocatePrivateVirtualInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AllocatePrivateVirtualInterfaceRequest,
    output: VirtualInterface,
    errors: [
      DirectConnectClientException,
      DirectConnectServerException,
      DuplicateTagKeysException,
      TooManyTagsException,
    ],
  }));
/**
 * Provisions a public virtual interface to be owned by the specified Amazon Web Services account.
 *
 * The owner of a connection calls this function to provision a public virtual interface to be owned by the specified Amazon Web Services account.
 *
 * Virtual interfaces created using this function must be confirmed by the owner using ConfirmPublicVirtualInterface.
 * Until this step has been completed, the virtual interface is in the `confirming` state and is not available to handle traffic.
 *
 * When creating an IPv6 public virtual interface, omit the Amazon address and customer address. IPv6 addresses are automatically assigned from
 * the Amazon pool of IPv6 addresses; you cannot specify custom IPv6 addresses.
 */
export const allocatePublicVirtualInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AllocatePublicVirtualInterfaceRequest,
    output: VirtualInterface,
    errors: [
      DirectConnectClientException,
      DirectConnectServerException,
      DuplicateTagKeysException,
      TooManyTagsException,
    ],
  }));
/**
 * Associates an existing connection with a link aggregation group (LAG). The connection
 * is interrupted and re-established as a member of the LAG (connectivity to Amazon Web Services is
 * interrupted). The connection must be hosted on the same Direct Connect endpoint as the LAG, and its
 * bandwidth must match the bandwidth for the LAG. You can re-associate a connection that's
 * currently associated with a different LAG; however, if removing the connection would cause
 * the original LAG to fall below its setting for minimum number of operational connections,
 * the request fails.
 *
 * Any virtual interfaces that are directly associated with the connection are
 * automatically re-associated with the LAG. If the connection was originally associated
 * with a different LAG, the virtual interfaces remain associated with the original
 * LAG.
 *
 * For interconnects, any hosted connections are automatically re-associated with the
 * LAG. If the interconnect was originally associated with a different LAG, the hosted
 * connections remain associated with the original LAG.
 */
export const associateConnectionWithLag = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateConnectionWithLagRequest,
    output: Connection,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Associates a hosted connection and its virtual interfaces with a link aggregation
 * group (LAG) or interconnect. If the target interconnect or LAG has an existing hosted
 * connection with a conflicting VLAN number or IP address, the operation fails. This
 * action temporarily interrupts the hosted connection's connectivity to Amazon Web Services
 * as it is being migrated.
 *
 * Intended for use by Direct Connect Partners only.
 */
export const associateHostedConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateHostedConnectionRequest,
    output: Connection,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Associates a MAC Security (MACsec) Connection Key Name (CKN)/ Connectivity Association Key (CAK) pair with a Direct Connect connection.
 *
 * You must supply either the `secretARN,` or the CKN/CAK (`ckn` and `cak`) pair in the request.
 *
 * For information about MAC Security (MACsec) key considerations, see MACsec pre-shared CKN/CAK key considerations in the *Direct Connect User Guide*.
 */
export const associateMacSecKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateMacSecKeyRequest,
  output: AssociateMacSecKeyResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Confirms the creation of the specified hosted connection on an interconnect.
 *
 * Upon creation, the hosted connection is initially in the `Ordering` state, and
 * remains in this state until the owner confirms creation of the hosted connection.
 */
export const confirmConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmConnectionRequest,
  output: ConfirmConnectionResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * The confirmation of the terms of agreement when creating the connection/link aggregation group (LAG).
 */
export const confirmCustomerAgreement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ConfirmCustomerAgreementRequest,
    output: ConfirmCustomerAgreementResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Accepts ownership of a private virtual interface created by another Amazon Web Services account.
 *
 * After the virtual interface owner makes this call, the virtual interface is
 * created and attached to the specified virtual private gateway or Direct Connect gateway, and is
 * made available to handle traffic.
 */
export const confirmPrivateVirtualInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ConfirmPrivateVirtualInterfaceRequest,
    output: ConfirmPrivateVirtualInterfaceResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Accepts ownership of a public virtual interface created by another Amazon Web Services account.
 *
 * After the virtual interface owner makes this call, the specified virtual interface is
 * created and made available to handle traffic.
 */
export const confirmPublicVirtualInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ConfirmPublicVirtualInterfaceRequest,
    output: ConfirmPublicVirtualInterfaceResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Accepts ownership of a transit virtual interface created by another Amazon Web Services account.
 *
 * After the owner of the transit virtual interface makes this call, the specified transit virtual interface is created and made available to handle traffic.
 */
export const confirmTransitVirtualInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ConfirmTransitVirtualInterfaceRequest,
    output: ConfirmTransitVirtualInterfaceResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Creates a connection between a customer network and a specific Direct Connect location.
 *
 * A connection links your internal network to an Direct Connect location over a standard Ethernet fiber-optic
 * cable. One end of the cable is connected to your router, the other to an Direct Connect router.
 *
 * To find the locations for your Region, use DescribeLocations.
 *
 * You can automatically add the new connection to a link aggregation group (LAG) by
 * specifying a LAG ID in the request. This ensures that the new connection is allocated on the
 * same Direct Connect endpoint that hosts the specified LAG. If there are no available ports on the endpoint,
 * the request fails and no connection is created.
 */
export const createConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionRequest,
  output: Connection,
  errors: [
    DirectConnectClientException,
    DirectConnectServerException,
    DuplicateTagKeysException,
    TooManyTagsException,
  ],
}));
/**
 * Creates an interconnect between an Direct Connect Partner's network and a specific Direct Connect location.
 *
 * An interconnect is a connection that is capable of hosting other connections. The
 * Direct Connect Partner can use an interconnect to provide Direct Connect hosted
 * connections to customers through their own network services. Like a standard connection, an
 * interconnect links the partner's network to an Direct Connect location over a standard Ethernet
 * fiber-optic cable. One end is connected to the partner's router, the other to an Direct Connect
 * router.
 *
 * You can automatically add the new interconnect to a link aggregation group (LAG) by
 * specifying a LAG ID in the request. This ensures that the new interconnect is allocated on
 * the same Direct Connect endpoint that hosts the specified LAG. If there are no available ports on the
 * endpoint, the request fails and no interconnect is created.
 *
 * For each end customer, the Direct Connect Partner provisions a connection on their interconnect by calling AllocateHostedConnection.
 * The end customer can then connect to Amazon Web Services resources by creating a virtual interface on their connection, using the VLAN assigned to them by the Direct Connect Partner.
 *
 * Intended for use by Direct Connect Partners only.
 */
export const createInterconnect = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInterconnectRequest,
  output: Interconnect,
  errors: [
    DirectConnectClientException,
    DirectConnectServerException,
    DuplicateTagKeysException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a link aggregation group (LAG) with the specified number of bundled
 * physical dedicated connections between the customer network and a specific Direct Connect location.
 * A LAG is a logical interface that uses the Link Aggregation Control Protocol
 * (LACP) to aggregate multiple interfaces, enabling you to treat them as a single
 * interface.
 *
 * All connections in a LAG must use the same bandwidth (either 1Gbps, 10Gbps, 100Gbps,
 * or 400Gbps) and must terminate at the same Direct Connect endpoint.
 *
 * You can have up to 10 dedicated connections per location. Regardless of this limit, if you
 * request more connections for the LAG than Direct Connect can allocate on a single endpoint, no LAG is
 * created..
 *
 * You can specify an existing physical dedicated connection or interconnect to include in
 * the LAG (which counts towards the total number of connections). Doing so interrupts the
 * current physical dedicated connection, and re-establishes them as a member of the LAG. The LAG
 * will be created on the same Direct Connect endpoint to which the dedicated connection terminates. Any
 * virtual interfaces associated with the dedicated connection are automatically disassociated
 * and re-associated with the LAG. The connection ID does not change.
 *
 * If the Amazon Web Services account used to create a LAG is a registered Direct Connect Partner, the LAG is
 * automatically enabled to host sub-connections. For a LAG owned by a partner, any associated virtual
 * interfaces cannot be directly configured.
 */
export const createLag = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLagRequest,
  output: Lag,
  errors: [
    DirectConnectClientException,
    DirectConnectServerException,
    DuplicateTagKeysException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a private virtual interface. A virtual interface is the VLAN that transports Direct Connect traffic.
 * A private virtual interface can be connected to either a Direct Connect gateway or a Virtual Private Gateway (VGW).
 * Connecting the private virtual interface to a Direct Connect gateway enables the possibility for connecting to multiple
 * VPCs, including VPCs in different Amazon Web Services Regions. Connecting the private virtual interface
 * to a VGW only provides access to a single VPC within the same Region.
 *
 * Setting the MTU of a virtual interface to 8500 (jumbo frames) can cause an update to
 * the underlying physical connection if it wasn't updated to support jumbo frames. Updating
 * the connection disrupts network connectivity for all virtual interfaces associated with
 * the connection for up to 30 seconds. To check whether your connection supports jumbo
 * frames, call DescribeConnections. To check whether your virtual
 * interface supports jumbo frames, call DescribeVirtualInterfaces.
 */
export const createPrivateVirtualInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePrivateVirtualInterfaceRequest,
    output: VirtualInterface,
    errors: [
      DirectConnectClientException,
      DirectConnectServerException,
      DuplicateTagKeysException,
      TooManyTagsException,
    ],
  }));
/**
 * Creates a public virtual interface. A virtual interface is the VLAN that transports Direct Connect traffic.
 * A public virtual interface supports sending traffic to public services of Amazon Web Services such as Amazon S3.
 *
 * When creating an IPv6 public virtual interface (`addressFamily` is `ipv6`), leave the `customer`
 * and `amazon` address fields blank to use auto-assigned IPv6 space. Custom IPv6 addresses are not supported.
 */
export const createPublicVirtualInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePublicVirtualInterfaceRequest,
    output: VirtualInterface,
    errors: [
      DirectConnectClientException,
      DirectConnectServerException,
      DuplicateTagKeysException,
      TooManyTagsException,
    ],
  }));
/**
 * Deletes the specified BGP peer on the specified virtual interface with the specified customer address and ASN.
 *
 * You cannot delete the last BGP peer from a virtual interface.
 */
export const deleteBGPPeer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBGPPeerRequest,
  output: DeleteBGPPeerResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes the specified Direct Connect gateway. You must first delete all virtual interfaces that are
 * attached to the Direct Connect gateway and disassociate all virtual private gateways associated
 * with the Direct Connect gateway.
 */
export const deleteDirectConnectGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDirectConnectGatewayRequest,
    output: DeleteDirectConnectGatewayResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Deletes the association between the specified Direct Connect gateway and virtual private gateway.
 *
 * We recommend that you specify the `associationID` to delete the association. Alternatively, if you own virtual gateway and a Direct Connect gateway association, you can specify the `virtualGatewayId` and `directConnectGatewayId` to delete an association.
 */
export const deleteDirectConnectGatewayAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDirectConnectGatewayAssociationRequest,
    output: DeleteDirectConnectGatewayAssociationResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Deletes the association proposal request between the specified Direct Connect gateway and virtual private gateway or transit gateway.
 */
export const deleteDirectConnectGatewayAssociationProposal =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDirectConnectGatewayAssociationProposalRequest,
    output: DeleteDirectConnectGatewayAssociationProposalResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Deletes the specified interconnect.
 *
 * Intended for use
 * by Direct Connect Partners only.
 */
export const deleteInterconnect = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInterconnectRequest,
  output: DeleteInterconnectResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes a virtual interface.
 */
export const deleteVirtualInterface = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVirtualInterfaceRequest,
    output: DeleteVirtualInterfaceResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Deprecated. Use DescribeLoa instead.
 *
 * Gets the LOA-CFA for a connection.
 *
 * The Letter of Authorization - Connecting Facility Assignment (LOA-CFA) is a document that your APN partner or
 * service provider uses when establishing your cross connect to Amazon Web Services at the colocation facility. For more information,
 * see Requesting Cross Connects
 * at Direct Connect Locations in the *Direct Connect User Guide*.
 */
export const describeConnectionLoa = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConnectionLoaRequest,
    output: DescribeConnectionLoaResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Displays the specified connection or all connections in this Region.
 */
export const describeConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectionsRequest,
  output: Connections,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Get and view a list of customer agreements, along with their signed status and whether the customer is an NNIPartner, NNIPartnerV2, or a nonPartner.
 */
export const describeCustomerMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCustomerMetadataRequest,
    output: DescribeCustomerMetadataResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Describes one or more association proposals for connection between a virtual private gateway or transit gateway and a Direct Connect gateway.
 */
export const describeDirectConnectGatewayAssociationProposals =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDirectConnectGatewayAssociationProposalsRequest,
    output: DescribeDirectConnectGatewayAssociationProposalsResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Lists the associations between your Direct Connect gateways and virtual private gateways and transit gateways. You must specify one of the following:
 *
 * - A Direct Connect gateway
 *
 * The response contains all virtual private gateways and transit gateways associated with the Direct Connect gateway.
 *
 * - A virtual private gateway
 *
 * The response contains the Direct Connect gateway.
 *
 * - A transit gateway
 *
 * The response contains the Direct Connect gateway.
 *
 * - A Direct Connect gateway and a virtual private gateway
 *
 * The response contains the association between the Direct Connect gateway and virtual private gateway.
 *
 * - A Direct Connect gateway and a transit gateway
 *
 * The response contains the association between the Direct Connect gateway and transit gateway.
 *
 * - A Direct Connect gateway and a virtual private gateway
 *
 * The response contains the association between the Direct Connect gateway and virtual private gateway.
 *
 * - A Direct Connect gateway association to a Cloud WAN core network
 *
 * The response contains the Cloud WAN core network ID that the Direct Connect gateway is associated to.
 */
export const describeDirectConnectGatewayAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDirectConnectGatewayAssociationsRequest,
    output: DescribeDirectConnectGatewayAssociationsResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Lists all your Direct Connect gateways or only the specified Direct Connect gateway. Deleted Direct Connect gateways are not returned.
 */
export const describeDirectConnectGateways =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDirectConnectGatewaysRequest,
    output: DescribeDirectConnectGatewaysResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Deprecated. Use DescribeLoa instead.
 *
 * Gets the LOA-CFA for the specified interconnect.
 *
 * The Letter of Authorization - Connecting Facility Assignment (LOA-CFA) is a document that is used when establishing your cross connect to Amazon Web Services at the colocation facility.
 * For more information, see Requesting Cross Connects at Direct Connect Locations
 * in the *Direct Connect User Guide*.
 */
export const describeInterconnectLoa = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInterconnectLoaRequest,
    output: DescribeInterconnectLoaResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Lists the interconnects owned by the Amazon Web Services account or only the specified interconnect.
 */
export const describeInterconnects = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInterconnectsRequest,
    output: Interconnects,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Describes all your link aggregation groups (LAG) or the specified LAG.
 */
export const describeLags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLagsRequest,
  output: Lags,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Gets the LOA-CFA for a connection, interconnect, or link aggregation group (LAG).
 *
 * The Letter of Authorization - Connecting Facility Assignment (LOA-CFA) is a document that is used when establishing
 * your cross connect to Amazon Web Services at the colocation facility. For more information, see Requesting Cross Connects at Direct Connect Locations
 * in the *Direct Connect User Guide*.
 */
export const describeLoa = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoaRequest,
  output: Loa,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Lists the Direct Connect locations in the current Amazon Web Services Region. These are the locations that can be selected when calling
 * CreateConnection or CreateInterconnect.
 */
export const describeLocations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationsRequest,
  output: Locations,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deprecated. Use `DescribeVpnGateways` instead. See DescribeVPNGateways in the *Amazon Elastic Compute Cloud API Reference*.
 *
 * Lists the virtual private gateways owned by the Amazon Web Services account.
 *
 * You can create one or more Direct Connect private virtual interfaces linked to a virtual private gateway.
 */
export const describeVirtualGateways = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVirtualGatewaysRequest,
    output: VirtualGateways,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Displays all virtual interfaces for an Amazon Web Services account. Virtual interfaces deleted fewer
 * than 15 minutes before you make the request are also returned. If you specify a
 * connection ID, only the virtual interfaces associated with the connection are returned.
 * If you specify a virtual interface ID, then only a single virtual interface is returned.
 *
 * A virtual interface (VLAN) transmits the traffic between the Direct Connect location and the customer network.
 *
 * - If you're using an `asn`, the response includes ASN value in both the `asn` and `asnLong` fields.
 *
 * - If you're using `asnLong`, the response returns a value of `0` (zero) for the `asn` attribute because it exceeds the highest ASN value of 2,147,483,647 that it can support
 */
export const describeVirtualInterfaces = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVirtualInterfacesRequest,
    output: VirtualInterfaces,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Removes the association between a MAC Security (MACsec) security key and a Direct Connect connection.
 */
export const disassociateMacSecKey = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateMacSecKeyRequest,
    output: DisassociateMacSecKeyResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Starts the virtual interface failover test that verifies your configuration meets your resiliency requirements by placing the BGP peering session in the DOWN state. You can then send traffic to verify that there are no outages.
 *
 * You can run the test on public, private, transit, and hosted virtual interfaces.
 *
 * You can use ListVirtualInterfaceTestHistory to view the virtual interface test history.
 *
 * If you need to stop the test before the test interval completes, use StopBgpFailoverTest.
 */
export const startBgpFailoverTest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartBgpFailoverTestRequest,
    output: StartBgpFailoverTestResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Stops the virtual interface failover test.
 */
export const stopBgpFailoverTest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBgpFailoverTestRequest,
  output: StopBgpFailoverTestResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Adds the specified tags to the specified Direct Connect resource. Each resource can have a maximum of 50 tags.
 *
 * Each tag consists of a key and an optional value. If a tag with the same key is already associated with the resource, this action updates its value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    DirectConnectClientException,
    DirectConnectServerException,
    DuplicateTagKeysException,
    TooManyTagsException,
  ],
}));
/**
 * Updates the name of a current Direct Connect gateway.
 */
export const updateDirectConnectGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDirectConnectGatewayRequest,
    output: UpdateDirectConnectGatewayResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Updates the specified attributes of the Direct Connect gateway association.
 *
 * Add or remove prefixes from the association.
 */
export const updateDirectConnectGatewayAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDirectConnectGatewayAssociationRequest,
    output: UpdateDirectConnectGatewayAssociationResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Accepts a proposal request to attach a virtual private gateway or transit gateway to a Direct Connect gateway.
 */
export const acceptDirectConnectGatewayAssociationProposal =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptDirectConnectGatewayAssociationProposalRequest,
    output: AcceptDirectConnectGatewayAssociationProposalResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Deprecated. Use AllocateHostedConnection instead.
 *
 * Creates a hosted connection on an interconnect.
 *
 * Allocates a VLAN number and a specified amount of bandwidth for use by a hosted connection on the specified interconnect.
 *
 * Intended for use by Direct Connect Partners only.
 */
export const allocateConnectionOnInterconnect =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AllocateConnectionOnInterconnectRequest,
    output: Connection,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Provisions a transit virtual interface to be owned by the specified Amazon Web Services account. Use this type of interface to connect a transit gateway to your Direct Connect gateway.
 *
 * The owner of a connection provisions a transit virtual interface to be owned by the specified Amazon Web Services account.
 *
 * After you create a transit virtual interface, it must be confirmed by the owner using ConfirmTransitVirtualInterface. Until this step has been completed, the transit virtual interface is in the `requested` state and is not available to handle traffic.
 */
export const allocateTransitVirtualInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AllocateTransitVirtualInterfaceRequest,
    output: AllocateTransitVirtualInterfaceResult,
    errors: [
      DirectConnectClientException,
      DirectConnectServerException,
      DuplicateTagKeysException,
      TooManyTagsException,
    ],
  }));
/**
 * Associates a virtual interface with a specified link aggregation group (LAG) or
 * connection. Connectivity to Amazon Web Services is temporarily interrupted as the virtual interface is
 * being migrated. If the target connection or LAG has an associated virtual interface with
 * a conflicting VLAN number or a conflicting IP address, the operation fails.
 *
 * Virtual interfaces associated with a hosted connection cannot be associated with a
 * LAG; hosted connections must be migrated along with their virtual interfaces using AssociateHostedConnection.
 *
 * To reassociate a virtual interface to a new connection or LAG, the requester
 * must own either the virtual interface itself or the connection to which the virtual
 * interface is currently associated. Additionally, the requester must own the connection
 * or LAG for the association.
 */
export const associateVirtualInterface = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateVirtualInterfaceRequest,
    output: VirtualInterface,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Creates a BGP peer on the specified virtual interface.
 *
 * You must create a BGP peer for the corresponding address family (IPv4/IPv6) in order to
 * access Amazon Web Services resources that also use that address family.
 *
 * If logical redundancy is not supported by the connection, interconnect, or LAG, the BGP peer cannot
 * be in the same address family as an existing BGP peer on the virtual interface.
 *
 * When creating a IPv6 BGP peer, omit the Amazon address and customer address. IPv6 addresses are automatically assigned from
 * the Amazon pool of IPv6 addresses; you cannot specify custom IPv6 addresses.
 *
 * If you let Amazon Web Services auto-assign IPv4 addresses, a /30 CIDR will be allocated
 * from 169.254.0.0/16. Amazon Web Services does not recommend this option if you intend to use
 * the customer router peer IP address as the source and destination for traffic. Instead you
 * should use RFC 1918 or other addressing, and specify the address yourself. For more
 * information about RFC 1918 see
 * Address Allocation for Private Internets.
 *
 * For a public virtual interface, the Autonomous System Number (ASN) must be private or already on the allow list for the virtual interface.
 */
export const createBGPPeer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBGPPeerRequest,
  output: CreateBGPPeerResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Creates a Direct Connect gateway, which is an intermediate object that enables you to connect a set
 * of virtual interfaces and virtual private gateways. A Direct Connect gateway is global and visible in any
 * Amazon Web Services Region after it is created. The virtual interfaces and virtual private gateways that
 * are connected through a Direct Connect gateway can be in different Amazon Web Services Regions. This enables you to
 * connect to a VPC in any Region, regardless of the Region in which the virtual interfaces
 * are located, and pass traffic between them.
 */
export const createDirectConnectGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDirectConnectGatewayRequest,
    output: CreateDirectConnectGatewayResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Creates a proposal to associate the specified virtual private gateway or transit gateway with the specified Direct Connect gateway.
 *
 * You can associate a Direct Connect gateway and virtual private gateway or transit gateway that is owned by any Amazon Web Services account.
 */
export const createDirectConnectGatewayAssociationProposal =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDirectConnectGatewayAssociationProposalRequest,
    output: CreateDirectConnectGatewayAssociationProposalResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Creates a transit virtual interface. A transit virtual interface should be used to access one or more transit gateways associated with Direct Connect gateways. A transit virtual interface enables the connection of multiple VPCs attached to a transit gateway to a Direct Connect gateway.
 *
 * If you associate your transit gateway with one or more Direct Connect gateways, the Autonomous System Number (ASN) used by the transit gateway and the Direct Connect gateway must be different. For example, if you use the default ASN 64512 for both your the transit gateway and Direct Connect gateway, the association request fails.
 *
 * A jumbo MTU value must be either 1500 or 8500. No other values will be accepted. Setting
 * the MTU of a virtual interface to 8500 (jumbo frames) can cause an update to the underlying
 * physical connection if it wasn't updated to support jumbo frames. Updating the connection
 * disrupts network connectivity for all virtual interfaces associated with the connection for up
 * to 30 seconds. To check whether your connection supports jumbo frames, call DescribeConnections. To check whether your virtual interface supports jumbo
 * frames, call DescribeVirtualInterfaces.
 */
export const createTransitVirtualInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateTransitVirtualInterfaceRequest,
    output: CreateTransitVirtualInterfaceResult,
    errors: [
      DirectConnectClientException,
      DirectConnectServerException,
      DuplicateTagKeysException,
      TooManyTagsException,
    ],
  }));
/**
 * Lists the attachments between your Direct Connect gateways and virtual interfaces. You must specify
 * a Direct Connect gateway, a virtual interface, or both. If you specify a Direct Connect gateway, the response contains
 * all virtual interfaces attached to the Direct Connect gateway. If you specify a virtual interface, the
 * response contains all Direct Connect gateways attached to the virtual interface. If you specify both,
 * the response contains the attachment between the Direct Connect gateway and the virtual interface.
 */
export const describeDirectConnectGatewayAttachments =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDirectConnectGatewayAttachmentsRequest,
    output: DescribeDirectConnectGatewayAttachmentsResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Details about the router.
 */
export const describeRouterConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRouterConfigurationRequest,
    output: DescribeRouterConfigurationResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }),
);
/**
 * Describes the tags associated with the specified Direct Connect resources.
 */
export const describeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagsRequest,
  output: DescribeTagsResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Lists the virtual interface failover test history.
 */
export const listVirtualInterfaceTestHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListVirtualInterfaceTestHistoryRequest,
    output: ListVirtualInterfaceTestHistoryResponse,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
/**
 * Creates an association between a Direct Connect gateway and a virtual private gateway. The virtual
 * private gateway must be attached to a VPC and must not be associated with another Direct Connect gateway.
 */
export const createDirectConnectGatewayAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDirectConnectGatewayAssociationRequest,
    output: CreateDirectConnectGatewayAssociationResult,
    errors: [DirectConnectClientException, DirectConnectServerException],
  }));
