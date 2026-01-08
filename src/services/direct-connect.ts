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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://directconnect.amazonaws.com/doc/2012-10-25/");
const svc = T.AwsApiService({
  sdkId: "Direct Connect",
  serviceShapeName: "OvertureService",
});
const auth = T.AwsAuthSigv4({ name: "directconnect" });
const ver = T.ServiceVersion("2012-10-25");
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
              `https://directconnect-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://directconnect-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://directconnect.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://directconnect.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DirectConnectGatewayId = string;
export type DirectConnectGatewayAssociationProposalId = string;
export type OwnerAccount = string;
export type Bandwidth = string;
export type ConnectionName = string;
export type InterconnectId = string;
export type VLAN = number;
export type ConnectionId = string;
export type LagId = string;
export type SecretARN = string;
export type Ckn = string;
export type Cak = string;
export type VirtualInterfaceId = string;
export type AgreementName = string;
export type VirtualGatewayId = string;
export type LocationCode = string;
export type ProviderName = string;
export type DirectConnectGatewayName = string;
export type LongAsn = number;
export type GatewayIdToAssociate = string;
export type InterconnectName = string;
export type Count = number;
export type LagName = string;
export type ASN = number;
export type CustomerAddress = string;
export type BGPPeerId = string;
export type DirectConnectGatewayAssociationId = string;
export type MaxResultSetSize = number;
export type PaginationToken = string;
export type AssociatedGatewayId = string;
export type RouterTypeIdentifier = string;
export type ResourceArn = string;
export type TestId = string;
export type FailureTestHistoryStatus = string;
export type TestDuration = number;
export type TagKey = string;
export type EncryptionMode = string;
export type MTU = number;
export type VirtualInterfaceName = string;
export type CIDR = string;
export type TagValue = string;
export type BGPAuthKey = string;
export type AmazonAddress = string;
export type Status = string;
export type LocationName = string;
export type Region = string;
export type PortSpeed = string;
export type VirtualGatewayState = string;
export type PartnerName = string;
export type AwsDevice = string;
export type AwsDeviceV2 = string;
export type AwsLogicalDeviceId = string;
export type PortEncryptionStatus = string;
export type ErrorMessage = string;
export type VirtualInterfaceType = string;
export type RouterConfig = string;
export type State = string;
export type StartOnDate = string;
export type StateChangeError = string;
export type VirtualGatewayRegion = string;
export type VirtualInterfaceRegion = string;
export type Vendor = string;
export type Platform = string;
export type Software = string;
export type XsltTemplateName = string;
export type XsltTemplateNameForMacSec = string;
export type GatewayIdentifier = string;
export type CoreNetworkIdentifier = string;
export type CoreNetworkAttachmentId = string;

//# Schemas
export interface DescribeCustomerMetadataRequest {}
export const DescribeCustomerMetadataRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCustomerMetadataRequest",
}) as any as S.Schema<DescribeCustomerMetadataRequest>;
export interface DescribeLocationsRequest {}
export const DescribeLocationsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLocationsRequest",
}) as any as S.Schema<DescribeLocationsRequest>;
export interface DescribeVirtualGatewaysRequest {}
export const DescribeVirtualGatewaysRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeVirtualGatewaysRequest",
}) as any as S.Schema<DescribeVirtualGatewaysRequest>;
export type ResourceArnList = string[];
export const ResourceArnList = S.Array(S.String);
export type BGPPeerIdList = string[];
export const BGPPeerIdList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AllocateConnectionOnInterconnectRequest {
  bandwidth: string;
  connectionName: string;
  ownerAccount: string;
  interconnectId: string;
  vlan: number;
}
export const AllocateConnectionOnInterconnectRequest = S.suspend(() =>
  S.Struct({
    bandwidth: S.String,
    connectionName: S.String,
    ownerAccount: S.String,
    interconnectId: S.String,
    vlan: S.Number,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AllocateConnectionOnInterconnectRequest",
}) as any as S.Schema<AllocateConnectionOnInterconnectRequest>;
export interface AssociateConnectionWithLagRequest {
  connectionId: string;
  lagId: string;
}
export const AssociateConnectionWithLagRequest = S.suspend(() =>
  S.Struct({ connectionId: S.String, lagId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateConnectionWithLagRequest",
}) as any as S.Schema<AssociateConnectionWithLagRequest>;
export interface AssociateHostedConnectionRequest {
  connectionId: string;
  parentConnectionId: string;
}
export const AssociateHostedConnectionRequest = S.suspend(() =>
  S.Struct({ connectionId: S.String, parentConnectionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateHostedConnectionRequest",
}) as any as S.Schema<AssociateHostedConnectionRequest>;
export interface AssociateMacSecKeyRequest {
  connectionId: string;
  secretARN?: string;
  ckn?: string;
  cak?: string;
}
export const AssociateMacSecKeyRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    secretARN: S.optional(S.String),
    ckn: S.optional(S.String),
    cak: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateMacSecKeyRequest",
}) as any as S.Schema<AssociateMacSecKeyRequest>;
export interface AssociateVirtualInterfaceRequest {
  virtualInterfaceId: string;
  connectionId: string;
}
export const AssociateVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({ virtualInterfaceId: S.String, connectionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateVirtualInterfaceRequest",
}) as any as S.Schema<AssociateVirtualInterfaceRequest>;
export interface ConfirmConnectionRequest {
  connectionId: string;
}
export const ConfirmConnectionRequest = S.suspend(() =>
  S.Struct({ connectionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConfirmConnectionRequest",
}) as any as S.Schema<ConfirmConnectionRequest>;
export interface ConfirmCustomerAgreementRequest {
  agreementName?: string;
}
export const ConfirmCustomerAgreementRequest = S.suspend(() =>
  S.Struct({ agreementName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConfirmCustomerAgreementRequest",
}) as any as S.Schema<ConfirmCustomerAgreementRequest>;
export interface ConfirmPrivateVirtualInterfaceRequest {
  virtualInterfaceId: string;
  virtualGatewayId?: string;
  directConnectGatewayId?: string;
}
export const ConfirmPrivateVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({
    virtualInterfaceId: S.String,
    virtualGatewayId: S.optional(S.String),
    directConnectGatewayId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConfirmPrivateVirtualInterfaceRequest",
}) as any as S.Schema<ConfirmPrivateVirtualInterfaceRequest>;
export interface ConfirmPublicVirtualInterfaceRequest {
  virtualInterfaceId: string;
}
export const ConfirmPublicVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({ virtualInterfaceId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConfirmPublicVirtualInterfaceRequest",
}) as any as S.Schema<ConfirmPublicVirtualInterfaceRequest>;
export interface ConfirmTransitVirtualInterfaceRequest {
  virtualInterfaceId: string;
  directConnectGatewayId: string;
}
export const ConfirmTransitVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({
    virtualInterfaceId: S.String,
    directConnectGatewayId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConfirmTransitVirtualInterfaceRequest",
}) as any as S.Schema<ConfirmTransitVirtualInterfaceRequest>;
export interface Tag {
  key: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateConnectionRequest {
  location: string;
  bandwidth: string;
  connectionName: string;
  lagId?: string;
  tags?: TagList;
  providerName?: string;
  requestMACSec?: boolean;
}
export const CreateConnectionRequest = S.suspend(() =>
  S.Struct({
    location: S.String,
    bandwidth: S.String,
    connectionName: S.String,
    lagId: S.optional(S.String),
    tags: S.optional(TagList),
    providerName: S.optional(S.String),
    requestMACSec: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface CreateDirectConnectGatewayRequest {
  directConnectGatewayName: string;
  tags?: TagList;
  amazonSideAsn?: number;
}
export const CreateDirectConnectGatewayRequest = S.suspend(() =>
  S.Struct({
    directConnectGatewayName: S.String,
    tags: S.optional(TagList),
    amazonSideAsn: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDirectConnectGatewayRequest",
}) as any as S.Schema<CreateDirectConnectGatewayRequest>;
export interface RouteFilterPrefix {
  cidr?: string;
}
export const RouteFilterPrefix = S.suspend(() =>
  S.Struct({ cidr: S.optional(S.String) }),
).annotations({
  identifier: "RouteFilterPrefix",
}) as any as S.Schema<RouteFilterPrefix>;
export type RouteFilterPrefixList = RouteFilterPrefix[];
export const RouteFilterPrefixList = S.Array(RouteFilterPrefix);
export interface CreateDirectConnectGatewayAssociationRequest {
  directConnectGatewayId: string;
  gatewayId?: string;
  addAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
  virtualGatewayId?: string;
}
export const CreateDirectConnectGatewayAssociationRequest = S.suspend(() =>
  S.Struct({
    directConnectGatewayId: S.String,
    gatewayId: S.optional(S.String),
    addAllowedPrefixesToDirectConnectGateway: S.optional(RouteFilterPrefixList),
    virtualGatewayId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDirectConnectGatewayAssociationRequest",
}) as any as S.Schema<CreateDirectConnectGatewayAssociationRequest>;
export interface CreateDirectConnectGatewayAssociationProposalRequest {
  directConnectGatewayId: string;
  directConnectGatewayOwnerAccount: string;
  gatewayId: string;
  addAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
  removeAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
}
export const CreateDirectConnectGatewayAssociationProposalRequest = S.suspend(
  () =>
    S.Struct({
      directConnectGatewayId: S.String,
      directConnectGatewayOwnerAccount: S.String,
      gatewayId: S.String,
      addAllowedPrefixesToDirectConnectGateway: S.optional(
        RouteFilterPrefixList,
      ),
      removeAllowedPrefixesToDirectConnectGateway: S.optional(
        RouteFilterPrefixList,
      ),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "CreateDirectConnectGatewayAssociationProposalRequest",
}) as any as S.Schema<CreateDirectConnectGatewayAssociationProposalRequest>;
export interface CreateInterconnectRequest {
  interconnectName: string;
  bandwidth: string;
  location: string;
  lagId?: string;
  tags?: TagList;
  providerName?: string;
  requestMACSec?: boolean;
}
export const CreateInterconnectRequest = S.suspend(() =>
  S.Struct({
    interconnectName: S.String,
    bandwidth: S.String,
    location: S.String,
    lagId: S.optional(S.String),
    tags: S.optional(TagList),
    providerName: S.optional(S.String),
    requestMACSec: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInterconnectRequest",
}) as any as S.Schema<CreateInterconnectRequest>;
export interface CreateLagRequest {
  numberOfConnections: number;
  location: string;
  connectionsBandwidth: string;
  lagName: string;
  connectionId?: string;
  tags?: TagList;
  childConnectionTags?: TagList;
  providerName?: string;
  requestMACSec?: boolean;
}
export const CreateLagRequest = S.suspend(() =>
  S.Struct({
    numberOfConnections: S.Number,
    location: S.String,
    connectionsBandwidth: S.String,
    lagName: S.String,
    connectionId: S.optional(S.String),
    tags: S.optional(TagList),
    childConnectionTags: S.optional(TagList),
    providerName: S.optional(S.String),
    requestMACSec: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLagRequest",
}) as any as S.Schema<CreateLagRequest>;
export interface DeleteBGPPeerRequest {
  virtualInterfaceId?: string;
  asn?: number;
  asnLong?: number;
  customerAddress?: string;
  bgpPeerId?: string;
}
export const DeleteBGPPeerRequest = S.suspend(() =>
  S.Struct({
    virtualInterfaceId: S.optional(S.String),
    asn: S.optional(S.Number),
    asnLong: S.optional(S.Number),
    customerAddress: S.optional(S.String),
    bgpPeerId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBGPPeerRequest",
}) as any as S.Schema<DeleteBGPPeerRequest>;
export interface DeleteConnectionRequest {
  connectionId: string;
}
export const DeleteConnectionRequest = S.suspend(() =>
  S.Struct({ connectionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface DeleteDirectConnectGatewayRequest {
  directConnectGatewayId: string;
}
export const DeleteDirectConnectGatewayRequest = S.suspend(() =>
  S.Struct({ directConnectGatewayId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDirectConnectGatewayRequest",
}) as any as S.Schema<DeleteDirectConnectGatewayRequest>;
export interface DeleteDirectConnectGatewayAssociationRequest {
  associationId?: string;
  directConnectGatewayId?: string;
  virtualGatewayId?: string;
}
export const DeleteDirectConnectGatewayAssociationRequest = S.suspend(() =>
  S.Struct({
    associationId: S.optional(S.String),
    directConnectGatewayId: S.optional(S.String),
    virtualGatewayId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDirectConnectGatewayAssociationRequest",
}) as any as S.Schema<DeleteDirectConnectGatewayAssociationRequest>;
export interface DeleteDirectConnectGatewayAssociationProposalRequest {
  proposalId: string;
}
export const DeleteDirectConnectGatewayAssociationProposalRequest = S.suspend(
  () =>
    S.Struct({ proposalId: S.String }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DeleteDirectConnectGatewayAssociationProposalRequest",
}) as any as S.Schema<DeleteDirectConnectGatewayAssociationProposalRequest>;
export interface DeleteInterconnectRequest {
  interconnectId: string;
}
export const DeleteInterconnectRequest = S.suspend(() =>
  S.Struct({ interconnectId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInterconnectRequest",
}) as any as S.Schema<DeleteInterconnectRequest>;
export interface DeleteLagRequest {
  lagId: string;
}
export const DeleteLagRequest = S.suspend(() =>
  S.Struct({ lagId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLagRequest",
}) as any as S.Schema<DeleteLagRequest>;
export interface DeleteVirtualInterfaceRequest {
  virtualInterfaceId: string;
}
export const DeleteVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({ virtualInterfaceId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVirtualInterfaceRequest",
}) as any as S.Schema<DeleteVirtualInterfaceRequest>;
export interface DescribeConnectionLoaRequest {
  connectionId: string;
  providerName?: string;
  loaContentType?: string;
}
export const DescribeConnectionLoaRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    providerName: S.optional(S.String),
    loaContentType: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectionLoaRequest",
}) as any as S.Schema<DescribeConnectionLoaRequest>;
export interface DescribeConnectionsRequest {
  connectionId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeConnectionsRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectionsRequest",
}) as any as S.Schema<DescribeConnectionsRequest>;
export interface DescribeConnectionsOnInterconnectRequest {
  interconnectId: string;
}
export const DescribeConnectionsOnInterconnectRequest = S.suspend(() =>
  S.Struct({ interconnectId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectionsOnInterconnectRequest",
}) as any as S.Schema<DescribeConnectionsOnInterconnectRequest>;
export interface DescribeDirectConnectGatewayAssociationProposalsRequest {
  directConnectGatewayId?: string;
  proposalId?: string;
  associatedGatewayId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeDirectConnectGatewayAssociationProposalsRequest =
  S.suspend(() =>
    S.Struct({
      directConnectGatewayId: S.optional(S.String),
      proposalId: S.optional(S.String),
      associatedGatewayId: S.optional(S.String),
      maxResults: S.optional(S.Number),
      nextToken: S.optional(S.String),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "DescribeDirectConnectGatewayAssociationProposalsRequest",
  }) as any as S.Schema<DescribeDirectConnectGatewayAssociationProposalsRequest>;
export interface DescribeDirectConnectGatewayAssociationsRequest {
  associationId?: string;
  associatedGatewayId?: string;
  directConnectGatewayId?: string;
  maxResults?: number;
  nextToken?: string;
  virtualGatewayId?: string;
}
export const DescribeDirectConnectGatewayAssociationsRequest = S.suspend(() =>
  S.Struct({
    associationId: S.optional(S.String),
    associatedGatewayId: S.optional(S.String),
    directConnectGatewayId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    virtualGatewayId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDirectConnectGatewayAssociationsRequest",
}) as any as S.Schema<DescribeDirectConnectGatewayAssociationsRequest>;
export interface DescribeDirectConnectGatewayAttachmentsRequest {
  directConnectGatewayId?: string;
  virtualInterfaceId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeDirectConnectGatewayAttachmentsRequest = S.suspend(() =>
  S.Struct({
    directConnectGatewayId: S.optional(S.String),
    virtualInterfaceId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDirectConnectGatewayAttachmentsRequest",
}) as any as S.Schema<DescribeDirectConnectGatewayAttachmentsRequest>;
export interface DescribeDirectConnectGatewaysRequest {
  directConnectGatewayId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeDirectConnectGatewaysRequest = S.suspend(() =>
  S.Struct({
    directConnectGatewayId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDirectConnectGatewaysRequest",
}) as any as S.Schema<DescribeDirectConnectGatewaysRequest>;
export interface DescribeHostedConnectionsRequest {
  connectionId: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeHostedConnectionsRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeHostedConnectionsRequest",
}) as any as S.Schema<DescribeHostedConnectionsRequest>;
export interface DescribeInterconnectLoaRequest {
  interconnectId: string;
  providerName?: string;
  loaContentType?: string;
}
export const DescribeInterconnectLoaRequest = S.suspend(() =>
  S.Struct({
    interconnectId: S.String,
    providerName: S.optional(S.String),
    loaContentType: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInterconnectLoaRequest",
}) as any as S.Schema<DescribeInterconnectLoaRequest>;
export interface DescribeInterconnectsRequest {
  interconnectId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeInterconnectsRequest = S.suspend(() =>
  S.Struct({
    interconnectId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInterconnectsRequest",
}) as any as S.Schema<DescribeInterconnectsRequest>;
export interface DescribeLagsRequest {
  lagId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeLagsRequest = S.suspend(() =>
  S.Struct({
    lagId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLagsRequest",
}) as any as S.Schema<DescribeLagsRequest>;
export interface DescribeLoaRequest {
  connectionId: string;
  providerName?: string;
  loaContentType?: string;
}
export const DescribeLoaRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    providerName: S.optional(S.String),
    loaContentType: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLoaRequest",
}) as any as S.Schema<DescribeLoaRequest>;
export interface DescribeRouterConfigurationRequest {
  virtualInterfaceId: string;
  routerTypeIdentifier?: string;
}
export const DescribeRouterConfigurationRequest = S.suspend(() =>
  S.Struct({
    virtualInterfaceId: S.String,
    routerTypeIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRouterConfigurationRequest",
}) as any as S.Schema<DescribeRouterConfigurationRequest>;
export interface DescribeTagsRequest {
  resourceArns: ResourceArnList;
}
export const DescribeTagsRequest = S.suspend(() =>
  S.Struct({ resourceArns: ResourceArnList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTagsRequest",
}) as any as S.Schema<DescribeTagsRequest>;
export interface DescribeVirtualInterfacesRequest {
  connectionId?: string;
  virtualInterfaceId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeVirtualInterfacesRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.optional(S.String),
    virtualInterfaceId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeVirtualInterfacesRequest",
}) as any as S.Schema<DescribeVirtualInterfacesRequest>;
export interface DisassociateConnectionFromLagRequest {
  connectionId: string;
  lagId: string;
}
export const DisassociateConnectionFromLagRequest = S.suspend(() =>
  S.Struct({ connectionId: S.String, lagId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateConnectionFromLagRequest",
}) as any as S.Schema<DisassociateConnectionFromLagRequest>;
export interface DisassociateMacSecKeyRequest {
  connectionId: string;
  secretARN: string;
}
export const DisassociateMacSecKeyRequest = S.suspend(() =>
  S.Struct({ connectionId: S.String, secretARN: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateMacSecKeyRequest",
}) as any as S.Schema<DisassociateMacSecKeyRequest>;
export interface ListVirtualInterfaceTestHistoryRequest {
  testId?: string;
  virtualInterfaceId?: string;
  bgpPeers?: BGPPeerIdList;
  status?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListVirtualInterfaceTestHistoryRequest = S.suspend(() =>
  S.Struct({
    testId: S.optional(S.String),
    virtualInterfaceId: S.optional(S.String),
    bgpPeers: S.optional(BGPPeerIdList),
    status: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVirtualInterfaceTestHistoryRequest",
}) as any as S.Schema<ListVirtualInterfaceTestHistoryRequest>;
export interface StartBgpFailoverTestRequest {
  virtualInterfaceId: string;
  bgpPeers?: BGPPeerIdList;
  testDurationInMinutes?: number;
}
export const StartBgpFailoverTestRequest = S.suspend(() =>
  S.Struct({
    virtualInterfaceId: S.String,
    bgpPeers: S.optional(BGPPeerIdList),
    testDurationInMinutes: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartBgpFailoverTestRequest",
}) as any as S.Schema<StartBgpFailoverTestRequest>;
export interface StopBgpFailoverTestRequest {
  virtualInterfaceId: string;
}
export const StopBgpFailoverTestRequest = S.suspend(() =>
  S.Struct({ virtualInterfaceId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopBgpFailoverTestRequest",
}) as any as S.Schema<StopBgpFailoverTestRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateConnectionRequest {
  connectionId: string;
  connectionName?: string;
  encryptionMode?: string;
}
export const UpdateConnectionRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    connectionName: S.optional(S.String),
    encryptionMode: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface UpdateDirectConnectGatewayRequest {
  directConnectGatewayId: string;
  newDirectConnectGatewayName: string;
}
export const UpdateDirectConnectGatewayRequest = S.suspend(() =>
  S.Struct({
    directConnectGatewayId: S.String,
    newDirectConnectGatewayName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDirectConnectGatewayRequest",
}) as any as S.Schema<UpdateDirectConnectGatewayRequest>;
export interface UpdateDirectConnectGatewayAssociationRequest {
  associationId?: string;
  addAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
  removeAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
}
export const UpdateDirectConnectGatewayAssociationRequest = S.suspend(() =>
  S.Struct({
    associationId: S.optional(S.String),
    addAllowedPrefixesToDirectConnectGateway: S.optional(RouteFilterPrefixList),
    removeAllowedPrefixesToDirectConnectGateway: S.optional(
      RouteFilterPrefixList,
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDirectConnectGatewayAssociationRequest",
}) as any as S.Schema<UpdateDirectConnectGatewayAssociationRequest>;
export interface UpdateLagRequest {
  lagId: string;
  lagName?: string;
  minimumLinks?: number;
  encryptionMode?: string;
}
export const UpdateLagRequest = S.suspend(() =>
  S.Struct({
    lagId: S.String,
    lagName: S.optional(S.String),
    minimumLinks: S.optional(S.Number),
    encryptionMode: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLagRequest",
}) as any as S.Schema<UpdateLagRequest>;
export interface UpdateVirtualInterfaceAttributesRequest {
  virtualInterfaceId: string;
  mtu?: number;
  enableSiteLink?: boolean;
  virtualInterfaceName?: string;
}
export const UpdateVirtualInterfaceAttributesRequest = S.suspend(() =>
  S.Struct({
    virtualInterfaceId: S.String,
    mtu: S.optional(S.Number),
    enableSiteLink: S.optional(S.Boolean),
    virtualInterfaceName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVirtualInterfaceAttributesRequest",
}) as any as S.Schema<UpdateVirtualInterfaceAttributesRequest>;
export type AvailablePortSpeeds = string[];
export const AvailablePortSpeeds = S.Array(S.String);
export type ProviderList = string[];
export const ProviderList = S.Array(S.String);
export type AvailableMacSecPortSpeeds = string[];
export const AvailableMacSecPortSpeeds = S.Array(S.String);
export interface NewPrivateVirtualInterfaceAllocation {
  virtualInterfaceName: string;
  vlan: number;
  asn?: number;
  asnLong?: number;
  mtu?: number;
  authKey?: string;
  amazonAddress?: string;
  addressFamily?: string;
  customerAddress?: string;
  tags?: TagList;
}
export const NewPrivateVirtualInterfaceAllocation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "NewPrivateVirtualInterfaceAllocation",
}) as any as S.Schema<NewPrivateVirtualInterfaceAllocation>;
export interface NewPublicVirtualInterfaceAllocation {
  virtualInterfaceName: string;
  vlan: number;
  asn?: number;
  asnLong?: number;
  authKey?: string;
  amazonAddress?: string;
  customerAddress?: string;
  addressFamily?: string;
  routeFilterPrefixes?: RouteFilterPrefixList;
  tags?: TagList;
}
export const NewPublicVirtualInterfaceAllocation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "NewPublicVirtualInterfaceAllocation",
}) as any as S.Schema<NewPublicVirtualInterfaceAllocation>;
export interface NewTransitVirtualInterfaceAllocation {
  virtualInterfaceName?: string;
  vlan?: number;
  asn?: number;
  asnLong?: number;
  mtu?: number;
  authKey?: string;
  amazonAddress?: string;
  customerAddress?: string;
  addressFamily?: string;
  tags?: TagList;
}
export const NewTransitVirtualInterfaceAllocation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "NewTransitVirtualInterfaceAllocation",
}) as any as S.Schema<NewTransitVirtualInterfaceAllocation>;
export interface NewBGPPeer {
  asn?: number;
  asnLong?: number;
  authKey?: string;
  addressFamily?: string;
  amazonAddress?: string;
  customerAddress?: string;
}
export const NewBGPPeer = S.suspend(() =>
  S.Struct({
    asn: S.optional(S.Number),
    asnLong: S.optional(S.Number),
    authKey: S.optional(S.String),
    addressFamily: S.optional(S.String),
    amazonAddress: S.optional(S.String),
    customerAddress: S.optional(S.String),
  }),
).annotations({ identifier: "NewBGPPeer" }) as any as S.Schema<NewBGPPeer>;
export interface MacSecKey {
  secretARN?: string;
  ckn?: string;
  state?: string;
  startOn?: string;
}
export const MacSecKey = S.suspend(() =>
  S.Struct({
    secretARN: S.optional(S.String),
    ckn: S.optional(S.String),
    state: S.optional(S.String),
    startOn: S.optional(S.String),
  }),
).annotations({ identifier: "MacSecKey" }) as any as S.Schema<MacSecKey>;
export type MacSecKeyList = MacSecKey[];
export const MacSecKeyList = S.Array(MacSecKey);
export interface Connection {
  ownerAccount?: string;
  connectionId?: string;
  connectionName?: string;
  connectionState?: string;
  region?: string;
  location?: string;
  bandwidth?: string;
  vlan?: number;
  partnerName?: string;
  loaIssueTime?: Date;
  lagId?: string;
  awsDevice?: string;
  jumboFrameCapable?: boolean;
  awsDeviceV2?: string;
  awsLogicalDeviceId?: string;
  hasLogicalRedundancy?: string;
  tags?: TagList;
  providerName?: string;
  macSecCapable?: boolean;
  portEncryptionStatus?: string;
  encryptionMode?: string;
  macSecKeys?: MacSecKeyList;
  partnerInterconnectMacSecCapable?: boolean;
}
export const Connection = S.suspend(() =>
  S.Struct({
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
  }).pipe(ns),
).annotations({ identifier: "Connection" }) as any as S.Schema<Connection>;
export type ConnectionList = Connection[];
export const ConnectionList = S.Array(Connection);
export interface NewPrivateVirtualInterface {
  virtualInterfaceName: string;
  vlan: number;
  asn?: number;
  asnLong?: number;
  mtu?: number;
  authKey?: string;
  amazonAddress?: string;
  customerAddress?: string;
  addressFamily?: string;
  virtualGatewayId?: string;
  directConnectGatewayId?: string;
  tags?: TagList;
  enableSiteLink?: boolean;
}
export const NewPrivateVirtualInterface = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "NewPrivateVirtualInterface",
}) as any as S.Schema<NewPrivateVirtualInterface>;
export interface NewPublicVirtualInterface {
  virtualInterfaceName: string;
  vlan: number;
  asn?: number;
  asnLong?: number;
  authKey?: string;
  amazonAddress?: string;
  customerAddress?: string;
  addressFamily?: string;
  routeFilterPrefixes?: RouteFilterPrefixList;
  tags?: TagList;
}
export const NewPublicVirtualInterface = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "NewPublicVirtualInterface",
}) as any as S.Schema<NewPublicVirtualInterface>;
export interface NewTransitVirtualInterface {
  virtualInterfaceName?: string;
  vlan?: number;
  asn?: number;
  asnLong?: number;
  mtu?: number;
  authKey?: string;
  amazonAddress?: string;
  customerAddress?: string;
  addressFamily?: string;
  directConnectGatewayId?: string;
  tags?: TagList;
  enableSiteLink?: boolean;
}
export const NewTransitVirtualInterface = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "NewTransitVirtualInterface",
}) as any as S.Schema<NewTransitVirtualInterface>;
export interface CustomerAgreement {
  agreementName?: string;
  status?: string;
}
export const CustomerAgreement = S.suspend(() =>
  S.Struct({
    agreementName: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomerAgreement",
}) as any as S.Schema<CustomerAgreement>;
export type AgreementList = CustomerAgreement[];
export const AgreementList = S.Array(CustomerAgreement);
export interface AssociatedGateway {
  id?: string;
  type?: string;
  ownerAccount?: string;
  region?: string;
}
export const AssociatedGateway = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    type: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    region: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociatedGateway",
}) as any as S.Schema<AssociatedGateway>;
export interface DirectConnectGatewayAssociationProposal {
  proposalId?: string;
  directConnectGatewayId?: string;
  directConnectGatewayOwnerAccount?: string;
  proposalState?: string;
  associatedGateway?: AssociatedGateway;
  existingAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
  requestedAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
}
export const DirectConnectGatewayAssociationProposal = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DirectConnectGatewayAssociationProposal",
}) as any as S.Schema<DirectConnectGatewayAssociationProposal>;
export type DirectConnectGatewayAssociationProposalList =
  DirectConnectGatewayAssociationProposal[];
export const DirectConnectGatewayAssociationProposalList = S.Array(
  DirectConnectGatewayAssociationProposal,
);
export interface AssociatedCoreNetwork {
  id?: string;
  ownerAccount?: string;
  attachmentId?: string;
}
export const AssociatedCoreNetwork = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    attachmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociatedCoreNetwork",
}) as any as S.Schema<AssociatedCoreNetwork>;
export interface DirectConnectGatewayAssociation {
  directConnectGatewayId?: string;
  directConnectGatewayOwnerAccount?: string;
  associationState?: string;
  stateChangeError?: string;
  associatedGateway?: AssociatedGateway;
  associationId?: string;
  allowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
  associatedCoreNetwork?: AssociatedCoreNetwork;
  virtualGatewayId?: string;
  virtualGatewayRegion?: string;
  virtualGatewayOwnerAccount?: string;
}
export const DirectConnectGatewayAssociation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DirectConnectGatewayAssociation",
}) as any as S.Schema<DirectConnectGatewayAssociation>;
export type DirectConnectGatewayAssociationList =
  DirectConnectGatewayAssociation[];
export const DirectConnectGatewayAssociationList = S.Array(
  DirectConnectGatewayAssociation,
);
export interface DirectConnectGateway {
  directConnectGatewayId?: string;
  directConnectGatewayName?: string;
  amazonSideAsn?: number;
  ownerAccount?: string;
  directConnectGatewayState?: string;
  stateChangeError?: string;
  tags?: TagList;
}
export const DirectConnectGateway = S.suspend(() =>
  S.Struct({
    directConnectGatewayId: S.optional(S.String),
    directConnectGatewayName: S.optional(S.String),
    amazonSideAsn: S.optional(S.Number),
    ownerAccount: S.optional(S.String),
    directConnectGatewayState: S.optional(S.String),
    stateChangeError: S.optional(S.String),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "DirectConnectGateway",
}) as any as S.Schema<DirectConnectGateway>;
export type DirectConnectGatewayList = DirectConnectGateway[];
export const DirectConnectGatewayList = S.Array(DirectConnectGateway);
export interface Interconnect {
  interconnectId?: string;
  interconnectName?: string;
  interconnectState?: string;
  region?: string;
  location?: string;
  bandwidth?: string;
  loaIssueTime?: Date;
  lagId?: string;
  awsDevice?: string;
  jumboFrameCapable?: boolean;
  awsDeviceV2?: string;
  awsLogicalDeviceId?: string;
  hasLogicalRedundancy?: string;
  tags?: TagList;
  providerName?: string;
  macSecCapable?: boolean;
  portEncryptionStatus?: string;
  encryptionMode?: string;
  macSecKeys?: MacSecKeyList;
}
export const Interconnect = S.suspend(() =>
  S.Struct({
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
  }).pipe(ns),
).annotations({ identifier: "Interconnect" }) as any as S.Schema<Interconnect>;
export type InterconnectList = Interconnect[];
export const InterconnectList = S.Array(Interconnect);
export interface Lag {
  connectionsBandwidth?: string;
  numberOfConnections?: number;
  lagId?: string;
  ownerAccount?: string;
  lagName?: string;
  lagState?: string;
  location?: string;
  region?: string;
  minimumLinks?: number;
  awsDevice?: string;
  awsDeviceV2?: string;
  awsLogicalDeviceId?: string;
  connections?: ConnectionList;
  allowsHostedConnections?: boolean;
  jumboFrameCapable?: boolean;
  hasLogicalRedundancy?: string;
  tags?: TagList;
  providerName?: string;
  macSecCapable?: boolean;
  encryptionMode?: string;
  macSecKeys?: MacSecKeyList;
}
export const Lag = S.suspend(() =>
  S.Struct({
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
  }).pipe(ns),
).annotations({ identifier: "Lag" }) as any as S.Schema<Lag>;
export type LagList = Lag[];
export const LagList = S.Array(Lag);
export interface Location {
  locationCode?: string;
  locationName?: string;
  region?: string;
  availablePortSpeeds?: AvailablePortSpeeds;
  availableProviders?: ProviderList;
  availableMacSecPortSpeeds?: AvailableMacSecPortSpeeds;
}
export const Location = S.suspend(() =>
  S.Struct({
    locationCode: S.optional(S.String),
    locationName: S.optional(S.String),
    region: S.optional(S.String),
    availablePortSpeeds: S.optional(AvailablePortSpeeds),
    availableProviders: S.optional(ProviderList),
    availableMacSecPortSpeeds: S.optional(AvailableMacSecPortSpeeds),
  }),
).annotations({ identifier: "Location" }) as any as S.Schema<Location>;
export type LocationList = Location[];
export const LocationList = S.Array(Location);
export interface VirtualGateway {
  virtualGatewayId?: string;
  virtualGatewayState?: string;
}
export const VirtualGateway = S.suspend(() =>
  S.Struct({
    virtualGatewayId: S.optional(S.String),
    virtualGatewayState: S.optional(S.String),
  }),
).annotations({
  identifier: "VirtualGateway",
}) as any as S.Schema<VirtualGateway>;
export type VirtualGatewayList = VirtualGateway[];
export const VirtualGatewayList = S.Array(VirtualGateway);
export interface BGPPeer {
  bgpPeerId?: string;
  asn?: number;
  asnLong?: number;
  authKey?: string;
  addressFamily?: string;
  amazonAddress?: string;
  customerAddress?: string;
  bgpPeerState?: string;
  bgpStatus?: string;
  awsDeviceV2?: string;
  awsLogicalDeviceId?: string;
}
export const BGPPeer = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "BGPPeer" }) as any as S.Schema<BGPPeer>;
export type BGPPeerList = BGPPeer[];
export const BGPPeerList = S.Array(BGPPeer);
export interface VirtualInterface {
  ownerAccount?: string;
  virtualInterfaceId?: string;
  location?: string;
  connectionId?: string;
  virtualInterfaceType?: string;
  virtualInterfaceName?: string;
  vlan?: number;
  asn?: number;
  asnLong?: number;
  amazonSideAsn?: number;
  authKey?: string;
  amazonAddress?: string;
  customerAddress?: string;
  addressFamily?: string;
  virtualInterfaceState?: string;
  customerRouterConfig?: string;
  mtu?: number;
  jumboFrameCapable?: boolean;
  virtualGatewayId?: string;
  directConnectGatewayId?: string;
  routeFilterPrefixes?: RouteFilterPrefixList;
  bgpPeers?: BGPPeerList;
  region?: string;
  awsDeviceV2?: string;
  awsLogicalDeviceId?: string;
  tags?: TagList;
  siteLinkEnabled?: boolean;
}
export const VirtualInterface = S.suspend(() =>
  S.Struct({
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
  }).pipe(ns),
).annotations({
  identifier: "VirtualInterface",
}) as any as S.Schema<VirtualInterface>;
export type VirtualInterfaceList = VirtualInterface[];
export const VirtualInterfaceList = S.Array(VirtualInterface);
export interface AcceptDirectConnectGatewayAssociationProposalRequest {
  directConnectGatewayId: string;
  proposalId: string;
  associatedGatewayOwnerAccount: string;
  overrideAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
}
export const AcceptDirectConnectGatewayAssociationProposalRequest = S.suspend(
  () =>
    S.Struct({
      directConnectGatewayId: S.String,
      proposalId: S.String,
      associatedGatewayOwnerAccount: S.String,
      overrideAllowedPrefixesToDirectConnectGateway: S.optional(
        RouteFilterPrefixList,
      ),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "AcceptDirectConnectGatewayAssociationProposalRequest",
}) as any as S.Schema<AcceptDirectConnectGatewayAssociationProposalRequest>;
export interface AllocateHostedConnectionRequest {
  connectionId: string;
  ownerAccount: string;
  bandwidth: string;
  connectionName: string;
  vlan: number;
  tags?: TagList;
}
export const AllocateHostedConnectionRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    ownerAccount: S.String,
    bandwidth: S.String,
    connectionName: S.String,
    vlan: S.Number,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AllocateHostedConnectionRequest",
}) as any as S.Schema<AllocateHostedConnectionRequest>;
export interface AllocatePrivateVirtualInterfaceRequest {
  connectionId: string;
  ownerAccount: string;
  newPrivateVirtualInterfaceAllocation: NewPrivateVirtualInterfaceAllocation;
}
export const AllocatePrivateVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    ownerAccount: S.String,
    newPrivateVirtualInterfaceAllocation: NewPrivateVirtualInterfaceAllocation,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AllocatePrivateVirtualInterfaceRequest",
}) as any as S.Schema<AllocatePrivateVirtualInterfaceRequest>;
export interface AllocatePublicVirtualInterfaceRequest {
  connectionId: string;
  ownerAccount: string;
  newPublicVirtualInterfaceAllocation: NewPublicVirtualInterfaceAllocation;
}
export const AllocatePublicVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    ownerAccount: S.String,
    newPublicVirtualInterfaceAllocation: NewPublicVirtualInterfaceAllocation,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AllocatePublicVirtualInterfaceRequest",
}) as any as S.Schema<AllocatePublicVirtualInterfaceRequest>;
export interface AllocateTransitVirtualInterfaceRequest {
  connectionId: string;
  ownerAccount: string;
  newTransitVirtualInterfaceAllocation: NewTransitVirtualInterfaceAllocation;
}
export const AllocateTransitVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    ownerAccount: S.String,
    newTransitVirtualInterfaceAllocation: NewTransitVirtualInterfaceAllocation,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AllocateTransitVirtualInterfaceRequest",
}) as any as S.Schema<AllocateTransitVirtualInterfaceRequest>;
export interface AssociateMacSecKeyResponse {
  connectionId?: string;
  macSecKeys?: MacSecKeyList;
}
export const AssociateMacSecKeyResponse = S.suspend(() =>
  S.Struct({
    connectionId: S.optional(S.String),
    macSecKeys: S.optional(MacSecKeyList),
  }).pipe(ns),
).annotations({
  identifier: "AssociateMacSecKeyResponse",
}) as any as S.Schema<AssociateMacSecKeyResponse>;
export interface ConfirmConnectionResponse {
  connectionState?: string;
}
export const ConfirmConnectionResponse = S.suspend(() =>
  S.Struct({ connectionState: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ConfirmConnectionResponse",
}) as any as S.Schema<ConfirmConnectionResponse>;
export interface ConfirmCustomerAgreementResponse {
  status?: string;
}
export const ConfirmCustomerAgreementResponse = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ConfirmCustomerAgreementResponse",
}) as any as S.Schema<ConfirmCustomerAgreementResponse>;
export interface ConfirmPrivateVirtualInterfaceResponse {
  virtualInterfaceState?: string;
}
export const ConfirmPrivateVirtualInterfaceResponse = S.suspend(() =>
  S.Struct({ virtualInterfaceState: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ConfirmPrivateVirtualInterfaceResponse",
}) as any as S.Schema<ConfirmPrivateVirtualInterfaceResponse>;
export interface ConfirmPublicVirtualInterfaceResponse {
  virtualInterfaceState?: string;
}
export const ConfirmPublicVirtualInterfaceResponse = S.suspend(() =>
  S.Struct({ virtualInterfaceState: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ConfirmPublicVirtualInterfaceResponse",
}) as any as S.Schema<ConfirmPublicVirtualInterfaceResponse>;
export interface ConfirmTransitVirtualInterfaceResponse {
  virtualInterfaceState?: string;
}
export const ConfirmTransitVirtualInterfaceResponse = S.suspend(() =>
  S.Struct({ virtualInterfaceState: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ConfirmTransitVirtualInterfaceResponse",
}) as any as S.Schema<ConfirmTransitVirtualInterfaceResponse>;
export interface CreateBGPPeerRequest {
  virtualInterfaceId?: string;
  newBGPPeer?: NewBGPPeer;
}
export const CreateBGPPeerRequest = S.suspend(() =>
  S.Struct({
    virtualInterfaceId: S.optional(S.String),
    newBGPPeer: S.optional(NewBGPPeer),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBGPPeerRequest",
}) as any as S.Schema<CreateBGPPeerRequest>;
export interface CreatePrivateVirtualInterfaceRequest {
  connectionId: string;
  newPrivateVirtualInterface: NewPrivateVirtualInterface;
}
export const CreatePrivateVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    newPrivateVirtualInterface: NewPrivateVirtualInterface,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePrivateVirtualInterfaceRequest",
}) as any as S.Schema<CreatePrivateVirtualInterfaceRequest>;
export interface CreatePublicVirtualInterfaceRequest {
  connectionId: string;
  newPublicVirtualInterface: NewPublicVirtualInterface;
}
export const CreatePublicVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    newPublicVirtualInterface: NewPublicVirtualInterface,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePublicVirtualInterfaceRequest",
}) as any as S.Schema<CreatePublicVirtualInterfaceRequest>;
export interface CreateTransitVirtualInterfaceRequest {
  connectionId: string;
  newTransitVirtualInterface: NewTransitVirtualInterface;
}
export const CreateTransitVirtualInterfaceRequest = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    newTransitVirtualInterface: NewTransitVirtualInterface,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTransitVirtualInterfaceRequest",
}) as any as S.Schema<CreateTransitVirtualInterfaceRequest>;
export interface DeleteBGPPeerResponse {
  virtualInterface?: VirtualInterface;
}
export const DeleteBGPPeerResponse = S.suspend(() =>
  S.Struct({ virtualInterface: S.optional(VirtualInterface) }).pipe(ns),
).annotations({
  identifier: "DeleteBGPPeerResponse",
}) as any as S.Schema<DeleteBGPPeerResponse>;
export interface DeleteDirectConnectGatewayResult {
  directConnectGateway?: DirectConnectGateway;
}
export const DeleteDirectConnectGatewayResult = S.suspend(() =>
  S.Struct({ directConnectGateway: S.optional(DirectConnectGateway) }).pipe(ns),
).annotations({
  identifier: "DeleteDirectConnectGatewayResult",
}) as any as S.Schema<DeleteDirectConnectGatewayResult>;
export interface DeleteDirectConnectGatewayAssociationResult {
  directConnectGatewayAssociation?: DirectConnectGatewayAssociation;
}
export const DeleteDirectConnectGatewayAssociationResult = S.suspend(() =>
  S.Struct({
    directConnectGatewayAssociation: S.optional(
      DirectConnectGatewayAssociation,
    ),
  }).pipe(ns),
).annotations({
  identifier: "DeleteDirectConnectGatewayAssociationResult",
}) as any as S.Schema<DeleteDirectConnectGatewayAssociationResult>;
export interface DeleteDirectConnectGatewayAssociationProposalResult {
  directConnectGatewayAssociationProposal?: DirectConnectGatewayAssociationProposal;
}
export const DeleteDirectConnectGatewayAssociationProposalResult = S.suspend(
  () =>
    S.Struct({
      directConnectGatewayAssociationProposal: S.optional(
        DirectConnectGatewayAssociationProposal,
      ),
    }).pipe(ns),
).annotations({
  identifier: "DeleteDirectConnectGatewayAssociationProposalResult",
}) as any as S.Schema<DeleteDirectConnectGatewayAssociationProposalResult>;
export interface DeleteInterconnectResponse {
  interconnectState?: string;
}
export const DeleteInterconnectResponse = S.suspend(() =>
  S.Struct({ interconnectState: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteInterconnectResponse",
}) as any as S.Schema<DeleteInterconnectResponse>;
export interface DeleteVirtualInterfaceResponse {
  virtualInterfaceState?: string;
}
export const DeleteVirtualInterfaceResponse = S.suspend(() =>
  S.Struct({ virtualInterfaceState: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteVirtualInterfaceResponse",
}) as any as S.Schema<DeleteVirtualInterfaceResponse>;
export interface Loa {
  loaContent?: Uint8Array;
  loaContentType?: string;
}
export const Loa = S.suspend(() =>
  S.Struct({
    loaContent: S.optional(T.Blob),
    loaContentType: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "Loa" }) as any as S.Schema<Loa>;
export interface DescribeConnectionLoaResponse {
  loa?: Loa;
}
export const DescribeConnectionLoaResponse = S.suspend(() =>
  S.Struct({ loa: S.optional(Loa) }).pipe(ns),
).annotations({
  identifier: "DescribeConnectionLoaResponse",
}) as any as S.Schema<DescribeConnectionLoaResponse>;
export interface Connections {
  connections?: ConnectionList;
  nextToken?: string;
}
export const Connections = S.suspend(() =>
  S.Struct({
    connections: S.optional(ConnectionList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "Connections" }) as any as S.Schema<Connections>;
export interface DescribeCustomerMetadataResponse {
  agreements?: AgreementList;
  nniPartnerType?: string;
}
export const DescribeCustomerMetadataResponse = S.suspend(() =>
  S.Struct({
    agreements: S.optional(AgreementList),
    nniPartnerType: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeCustomerMetadataResponse",
}) as any as S.Schema<DescribeCustomerMetadataResponse>;
export interface DescribeDirectConnectGatewayAssociationProposalsResult {
  directConnectGatewayAssociationProposals?: DirectConnectGatewayAssociationProposalList;
  nextToken?: string;
}
export const DescribeDirectConnectGatewayAssociationProposalsResult = S.suspend(
  () =>
    S.Struct({
      directConnectGatewayAssociationProposals: S.optional(
        DirectConnectGatewayAssociationProposalList,
      ),
      nextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "DescribeDirectConnectGatewayAssociationProposalsResult",
}) as any as S.Schema<DescribeDirectConnectGatewayAssociationProposalsResult>;
export interface DescribeDirectConnectGatewayAssociationsResult {
  directConnectGatewayAssociations?: DirectConnectGatewayAssociationList;
  nextToken?: string;
}
export const DescribeDirectConnectGatewayAssociationsResult = S.suspend(() =>
  S.Struct({
    directConnectGatewayAssociations: S.optional(
      DirectConnectGatewayAssociationList,
    ),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDirectConnectGatewayAssociationsResult",
}) as any as S.Schema<DescribeDirectConnectGatewayAssociationsResult>;
export interface DescribeDirectConnectGatewaysResult {
  directConnectGateways?: DirectConnectGatewayList;
  nextToken?: string;
}
export const DescribeDirectConnectGatewaysResult = S.suspend(() =>
  S.Struct({
    directConnectGateways: S.optional(DirectConnectGatewayList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDirectConnectGatewaysResult",
}) as any as S.Schema<DescribeDirectConnectGatewaysResult>;
export interface DescribeInterconnectLoaResponse {
  loa?: Loa;
}
export const DescribeInterconnectLoaResponse = S.suspend(() =>
  S.Struct({ loa: S.optional(Loa) }).pipe(ns),
).annotations({
  identifier: "DescribeInterconnectLoaResponse",
}) as any as S.Schema<DescribeInterconnectLoaResponse>;
export interface Interconnects {
  interconnects?: InterconnectList;
  nextToken?: string;
}
export const Interconnects = S.suspend(() =>
  S.Struct({
    interconnects: S.optional(InterconnectList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "Interconnects",
}) as any as S.Schema<Interconnects>;
export interface Lags {
  lags?: LagList;
  nextToken?: string;
}
export const Lags = S.suspend(() =>
  S.Struct({ lags: S.optional(LagList), nextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({ identifier: "Lags" }) as any as S.Schema<Lags>;
export interface Locations {
  locations?: LocationList;
}
export const Locations = S.suspend(() =>
  S.Struct({ locations: S.optional(LocationList) }).pipe(ns),
).annotations({ identifier: "Locations" }) as any as S.Schema<Locations>;
export interface VirtualGateways {
  virtualGateways?: VirtualGatewayList;
}
export const VirtualGateways = S.suspend(() =>
  S.Struct({ virtualGateways: S.optional(VirtualGatewayList) }).pipe(ns),
).annotations({
  identifier: "VirtualGateways",
}) as any as S.Schema<VirtualGateways>;
export interface VirtualInterfaces {
  virtualInterfaces?: VirtualInterfaceList;
  nextToken?: string;
}
export const VirtualInterfaces = S.suspend(() =>
  S.Struct({
    virtualInterfaces: S.optional(VirtualInterfaceList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "VirtualInterfaces",
}) as any as S.Schema<VirtualInterfaces>;
export interface DisassociateMacSecKeyResponse {
  connectionId?: string;
  macSecKeys?: MacSecKeyList;
}
export const DisassociateMacSecKeyResponse = S.suspend(() =>
  S.Struct({
    connectionId: S.optional(S.String),
    macSecKeys: S.optional(MacSecKeyList),
  }).pipe(ns),
).annotations({
  identifier: "DisassociateMacSecKeyResponse",
}) as any as S.Schema<DisassociateMacSecKeyResponse>;
export interface VirtualInterfaceTestHistory {
  testId?: string;
  virtualInterfaceId?: string;
  bgpPeers?: BGPPeerIdList;
  status?: string;
  ownerAccount?: string;
  testDurationInMinutes?: number;
  startTime?: Date;
  endTime?: Date;
}
export const VirtualInterfaceTestHistory = S.suspend(() =>
  S.Struct({
    testId: S.optional(S.String),
    virtualInterfaceId: S.optional(S.String),
    bgpPeers: S.optional(BGPPeerIdList),
    status: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    testDurationInMinutes: S.optional(S.Number),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "VirtualInterfaceTestHistory",
}) as any as S.Schema<VirtualInterfaceTestHistory>;
export interface StartBgpFailoverTestResponse {
  virtualInterfaceTest?: VirtualInterfaceTestHistory;
}
export const StartBgpFailoverTestResponse = S.suspend(() =>
  S.Struct({
    virtualInterfaceTest: S.optional(VirtualInterfaceTestHistory),
  }).pipe(ns),
).annotations({
  identifier: "StartBgpFailoverTestResponse",
}) as any as S.Schema<StartBgpFailoverTestResponse>;
export interface StopBgpFailoverTestResponse {
  virtualInterfaceTest?: VirtualInterfaceTestHistory;
}
export const StopBgpFailoverTestResponse = S.suspend(() =>
  S.Struct({
    virtualInterfaceTest: S.optional(VirtualInterfaceTestHistory),
  }).pipe(ns),
).annotations({
  identifier: "StopBgpFailoverTestResponse",
}) as any as S.Schema<StopBgpFailoverTestResponse>;
export interface UpdateDirectConnectGatewayResponse {
  directConnectGateway?: DirectConnectGateway;
}
export const UpdateDirectConnectGatewayResponse = S.suspend(() =>
  S.Struct({ directConnectGateway: S.optional(DirectConnectGateway) }).pipe(ns),
).annotations({
  identifier: "UpdateDirectConnectGatewayResponse",
}) as any as S.Schema<UpdateDirectConnectGatewayResponse>;
export interface UpdateDirectConnectGatewayAssociationResult {
  directConnectGatewayAssociation?: DirectConnectGatewayAssociation;
}
export const UpdateDirectConnectGatewayAssociationResult = S.suspend(() =>
  S.Struct({
    directConnectGatewayAssociation: S.optional(
      DirectConnectGatewayAssociation,
    ),
  }).pipe(ns),
).annotations({
  identifier: "UpdateDirectConnectGatewayAssociationResult",
}) as any as S.Schema<UpdateDirectConnectGatewayAssociationResult>;
export interface DirectConnectGatewayAttachment {
  directConnectGatewayId?: string;
  virtualInterfaceId?: string;
  virtualInterfaceRegion?: string;
  virtualInterfaceOwnerAccount?: string;
  attachmentState?: string;
  attachmentType?: string;
  stateChangeError?: string;
}
export const DirectConnectGatewayAttachment = S.suspend(() =>
  S.Struct({
    directConnectGatewayId: S.optional(S.String),
    virtualInterfaceId: S.optional(S.String),
    virtualInterfaceRegion: S.optional(S.String),
    virtualInterfaceOwnerAccount: S.optional(S.String),
    attachmentState: S.optional(S.String),
    attachmentType: S.optional(S.String),
    stateChangeError: S.optional(S.String),
  }),
).annotations({
  identifier: "DirectConnectGatewayAttachment",
}) as any as S.Schema<DirectConnectGatewayAttachment>;
export type DirectConnectGatewayAttachmentList =
  DirectConnectGatewayAttachment[];
export const DirectConnectGatewayAttachmentList = S.Array(
  DirectConnectGatewayAttachment,
);
export interface RouterType {
  vendor?: string;
  platform?: string;
  software?: string;
  xsltTemplateName?: string;
  xsltTemplateNameForMacSec?: string;
  routerTypeIdentifier?: string;
}
export const RouterType = S.suspend(() =>
  S.Struct({
    vendor: S.optional(S.String),
    platform: S.optional(S.String),
    software: S.optional(S.String),
    xsltTemplateName: S.optional(S.String),
    xsltTemplateNameForMacSec: S.optional(S.String),
    routerTypeIdentifier: S.optional(S.String),
  }),
).annotations({ identifier: "RouterType" }) as any as S.Schema<RouterType>;
export interface ResourceTag {
  resourceArn?: string;
  tags?: TagList;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ resourceArn: S.optional(S.String), tags: S.optional(TagList) }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTagList = ResourceTag[];
export const ResourceTagList = S.Array(ResourceTag);
export type VirtualInterfaceTestHistoryList = VirtualInterfaceTestHistory[];
export const VirtualInterfaceTestHistoryList = S.Array(
  VirtualInterfaceTestHistory,
);
export interface AcceptDirectConnectGatewayAssociationProposalResult {
  directConnectGatewayAssociation?: DirectConnectGatewayAssociation;
}
export const AcceptDirectConnectGatewayAssociationProposalResult = S.suspend(
  () =>
    S.Struct({
      directConnectGatewayAssociation: S.optional(
        DirectConnectGatewayAssociation,
      ),
    }).pipe(ns),
).annotations({
  identifier: "AcceptDirectConnectGatewayAssociationProposalResult",
}) as any as S.Schema<AcceptDirectConnectGatewayAssociationProposalResult>;
export interface AllocateTransitVirtualInterfaceResult {
  virtualInterface?: VirtualInterface;
}
export const AllocateTransitVirtualInterfaceResult = S.suspend(() =>
  S.Struct({ virtualInterface: S.optional(VirtualInterface) }).pipe(ns),
).annotations({
  identifier: "AllocateTransitVirtualInterfaceResult",
}) as any as S.Schema<AllocateTransitVirtualInterfaceResult>;
export interface CreateBGPPeerResponse {
  virtualInterface?: VirtualInterface;
}
export const CreateBGPPeerResponse = S.suspend(() =>
  S.Struct({ virtualInterface: S.optional(VirtualInterface) }).pipe(ns),
).annotations({
  identifier: "CreateBGPPeerResponse",
}) as any as S.Schema<CreateBGPPeerResponse>;
export interface CreateDirectConnectGatewayResult {
  directConnectGateway?: DirectConnectGateway;
}
export const CreateDirectConnectGatewayResult = S.suspend(() =>
  S.Struct({ directConnectGateway: S.optional(DirectConnectGateway) }).pipe(ns),
).annotations({
  identifier: "CreateDirectConnectGatewayResult",
}) as any as S.Schema<CreateDirectConnectGatewayResult>;
export interface CreateDirectConnectGatewayAssociationProposalResult {
  directConnectGatewayAssociationProposal?: DirectConnectGatewayAssociationProposal;
}
export const CreateDirectConnectGatewayAssociationProposalResult = S.suspend(
  () =>
    S.Struct({
      directConnectGatewayAssociationProposal: S.optional(
        DirectConnectGatewayAssociationProposal,
      ),
    }).pipe(ns),
).annotations({
  identifier: "CreateDirectConnectGatewayAssociationProposalResult",
}) as any as S.Schema<CreateDirectConnectGatewayAssociationProposalResult>;
export interface CreateTransitVirtualInterfaceResult {
  virtualInterface?: VirtualInterface;
}
export const CreateTransitVirtualInterfaceResult = S.suspend(() =>
  S.Struct({ virtualInterface: S.optional(VirtualInterface) }).pipe(ns),
).annotations({
  identifier: "CreateTransitVirtualInterfaceResult",
}) as any as S.Schema<CreateTransitVirtualInterfaceResult>;
export interface DescribeDirectConnectGatewayAttachmentsResult {
  directConnectGatewayAttachments?: DirectConnectGatewayAttachmentList;
  nextToken?: string;
}
export const DescribeDirectConnectGatewayAttachmentsResult = S.suspend(() =>
  S.Struct({
    directConnectGatewayAttachments: S.optional(
      DirectConnectGatewayAttachmentList,
    ),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDirectConnectGatewayAttachmentsResult",
}) as any as S.Schema<DescribeDirectConnectGatewayAttachmentsResult>;
export interface DescribeRouterConfigurationResponse {
  customerRouterConfig?: string;
  router?: RouterType;
  virtualInterfaceId?: string;
  virtualInterfaceName?: string;
}
export const DescribeRouterConfigurationResponse = S.suspend(() =>
  S.Struct({
    customerRouterConfig: S.optional(S.String),
    router: S.optional(RouterType),
    virtualInterfaceId: S.optional(S.String),
    virtualInterfaceName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRouterConfigurationResponse",
}) as any as S.Schema<DescribeRouterConfigurationResponse>;
export interface DescribeTagsResponse {
  resourceTags?: ResourceTagList;
}
export const DescribeTagsResponse = S.suspend(() =>
  S.Struct({ resourceTags: S.optional(ResourceTagList) }).pipe(ns),
).annotations({
  identifier: "DescribeTagsResponse",
}) as any as S.Schema<DescribeTagsResponse>;
export interface ListVirtualInterfaceTestHistoryResponse {
  virtualInterfaceTestHistory?: VirtualInterfaceTestHistoryList;
  nextToken?: string;
}
export const ListVirtualInterfaceTestHistoryResponse = S.suspend(() =>
  S.Struct({
    virtualInterfaceTestHistory: S.optional(VirtualInterfaceTestHistoryList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListVirtualInterfaceTestHistoryResponse",
}) as any as S.Schema<ListVirtualInterfaceTestHistoryResponse>;
export interface CreateDirectConnectGatewayAssociationResult {
  directConnectGatewayAssociation?: DirectConnectGatewayAssociation;
}
export const CreateDirectConnectGatewayAssociationResult = S.suspend(() =>
  S.Struct({
    directConnectGatewayAssociation: S.optional(
      DirectConnectGatewayAssociation,
    ),
  }).pipe(ns),
).annotations({
  identifier: "CreateDirectConnectGatewayAssociationResult",
}) as any as S.Schema<CreateDirectConnectGatewayAssociationResult>;

//# Errors
export class DirectConnectClientException extends S.TaggedError<DirectConnectClientException>()(
  "DirectConnectClientException",
  { message: S.optional(S.String) },
) {}
export class DirectConnectServerException extends S.TaggedError<DirectConnectServerException>()(
  "DirectConnectServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DuplicateTagKeysException extends S.TaggedError<DuplicateTagKeysException>()(
  "DuplicateTagKeysException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}

//# Operations
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
export const associateConnectionWithLag: (
  input: AssociateConnectionWithLagRequest,
) => Effect.Effect<
  Connection,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateConnectionWithLagRequest,
  output: Connection,
  errors: [DirectConnectClientException, DirectConnectServerException],
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
export const associateVirtualInterface: (
  input: AssociateVirtualInterfaceRequest,
) => Effect.Effect<
  VirtualInterface,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateVirtualInterfaceRequest,
  output: VirtualInterface,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
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
export const createBGPPeer: (
  input: CreateBGPPeerRequest,
) => Effect.Effect<
  CreateBGPPeerResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDirectConnectGateway: (
  input: CreateDirectConnectGatewayRequest,
) => Effect.Effect<
  CreateDirectConnectGatewayResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDirectConnectGatewayRequest,
  output: CreateDirectConnectGatewayResult,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Creates a proposal to associate the specified virtual private gateway or transit gateway with the specified Direct Connect gateway.
 *
 * You can associate a Direct Connect gateway and virtual private gateway or transit gateway that is owned by any Amazon Web Services account.
 */
export const createDirectConnectGatewayAssociationProposal: (
  input: CreateDirectConnectGatewayAssociationProposalRequest,
) => Effect.Effect<
  CreateDirectConnectGatewayAssociationProposalResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDirectConnectGatewayAssociationProposalRequest,
  output: CreateDirectConnectGatewayAssociationProposalResult,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Lists the attachments between your Direct Connect gateways and virtual interfaces. You must specify
 * a Direct Connect gateway, a virtual interface, or both. If you specify a Direct Connect gateway, the response contains
 * all virtual interfaces attached to the Direct Connect gateway. If you specify a virtual interface, the
 * response contains all Direct Connect gateways attached to the virtual interface. If you specify both,
 * the response contains the attachment between the Direct Connect gateway and the virtual interface.
 */
export const describeDirectConnectGatewayAttachments: (
  input: DescribeDirectConnectGatewayAttachmentsRequest,
) => Effect.Effect<
  DescribeDirectConnectGatewayAttachmentsResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDirectConnectGatewayAttachmentsRequest,
  output: DescribeDirectConnectGatewayAttachmentsResult,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Details about the router.
 */
export const describeRouterConfiguration: (
  input: DescribeRouterConfigurationRequest,
) => Effect.Effect<
  DescribeRouterConfigurationResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRouterConfigurationRequest,
  output: DescribeRouterConfigurationResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Describes the tags associated with the specified Direct Connect resources.
 */
export const describeTags: (
  input: DescribeTagsRequest,
) => Effect.Effect<
  DescribeTagsResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagsRequest,
  output: DescribeTagsResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Lists the virtual interface failover test history.
 */
export const listVirtualInterfaceTestHistory: (
  input: ListVirtualInterfaceTestHistoryRequest,
) => Effect.Effect<
  ListVirtualInterfaceTestHistoryResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVirtualInterfaceTestHistoryRequest,
  output: ListVirtualInterfaceTestHistoryResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Associates a MAC Security (MACsec) Connection Key Name (CKN)/ Connectivity Association Key (CAK) pair with a Direct Connect connection.
 *
 * You must supply either the `secretARN,` or the CKN/CAK (`ckn` and `cak`) pair in the request.
 *
 * For information about MAC Security (MACsec) key considerations, see MACsec pre-shared CKN/CAK key considerations in the *Direct Connect User Guide*.
 */
export const associateMacSecKey: (
  input: AssociateMacSecKeyRequest,
) => Effect.Effect<
  AssociateMacSecKeyResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const confirmConnection: (
  input: ConfirmConnectionRequest,
) => Effect.Effect<
  ConfirmConnectionResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmConnectionRequest,
  output: ConfirmConnectionResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * The confirmation of the terms of agreement when creating the connection/link aggregation group (LAG).
 */
export const confirmCustomerAgreement: (
  input: ConfirmCustomerAgreementRequest,
) => Effect.Effect<
  ConfirmCustomerAgreementResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmCustomerAgreementRequest,
  output: ConfirmCustomerAgreementResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Accepts ownership of a private virtual interface created by another Amazon Web Services account.
 *
 * After the virtual interface owner makes this call, the virtual interface is
 * created and attached to the specified virtual private gateway or Direct Connect gateway, and is
 * made available to handle traffic.
 */
export const confirmPrivateVirtualInterface: (
  input: ConfirmPrivateVirtualInterfaceRequest,
) => Effect.Effect<
  ConfirmPrivateVirtualInterfaceResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const confirmPublicVirtualInterface: (
  input: ConfirmPublicVirtualInterfaceRequest,
) => Effect.Effect<
  ConfirmPublicVirtualInterfaceResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmPublicVirtualInterfaceRequest,
  output: ConfirmPublicVirtualInterfaceResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Accepts ownership of a transit virtual interface created by another Amazon Web Services account.
 *
 * After the owner of the transit virtual interface makes this call, the specified transit virtual interface is created and made available to handle traffic.
 */
export const confirmTransitVirtualInterface: (
  input: ConfirmTransitVirtualInterfaceRequest,
) => Effect.Effect<
  ConfirmTransitVirtualInterfaceResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmTransitVirtualInterfaceRequest,
  output: ConfirmTransitVirtualInterfaceResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes the specified BGP peer on the specified virtual interface with the specified customer address and ASN.
 *
 * You cannot delete the last BGP peer from a virtual interface.
 */
export const deleteBGPPeer: (
  input: DeleteBGPPeerRequest,
) => Effect.Effect<
  DeleteBGPPeerResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBGPPeerRequest,
  output: DeleteBGPPeerResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes the specified Direct Connect gateway. You must first delete all virtual interfaces that are
 * attached to the Direct Connect gateway and disassociate all virtual private gateways associated
 * with the Direct Connect gateway.
 */
export const deleteDirectConnectGateway: (
  input: DeleteDirectConnectGatewayRequest,
) => Effect.Effect<
  DeleteDirectConnectGatewayResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDirectConnectGatewayRequest,
  output: DeleteDirectConnectGatewayResult,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes the association between the specified Direct Connect gateway and virtual private gateway.
 *
 * We recommend that you specify the `associationID` to delete the association. Alternatively, if you own virtual gateway and a Direct Connect gateway association, you can specify the `virtualGatewayId` and `directConnectGatewayId` to delete an association.
 */
export const deleteDirectConnectGatewayAssociation: (
  input: DeleteDirectConnectGatewayAssociationRequest,
) => Effect.Effect<
  DeleteDirectConnectGatewayAssociationResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDirectConnectGatewayAssociationRequest,
  output: DeleteDirectConnectGatewayAssociationResult,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes the association proposal request between the specified Direct Connect gateway and virtual private gateway or transit gateway.
 */
export const deleteDirectConnectGatewayAssociationProposal: (
  input: DeleteDirectConnectGatewayAssociationProposalRequest,
) => Effect.Effect<
  DeleteDirectConnectGatewayAssociationProposalResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteInterconnect: (
  input: DeleteInterconnectRequest,
) => Effect.Effect<
  DeleteInterconnectResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInterconnectRequest,
  output: DeleteInterconnectResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes a virtual interface.
 */
export const deleteVirtualInterface: (
  input: DeleteVirtualInterfaceRequest,
) => Effect.Effect<
  DeleteVirtualInterfaceResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVirtualInterfaceRequest,
  output: DeleteVirtualInterfaceResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
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
export const describeConnectionLoa: (
  input: DescribeConnectionLoaRequest,
) => Effect.Effect<
  DescribeConnectionLoaResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectionLoaRequest,
  output: DescribeConnectionLoaResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Displays the specified connection or all connections in this Region.
 */
export const describeConnections: (
  input: DescribeConnectionsRequest,
) => Effect.Effect<
  Connections,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectionsRequest,
  output: Connections,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Get and view a list of customer agreements, along with their signed status and whether the customer is an NNIPartner, NNIPartnerV2, or a nonPartner.
 */
export const describeCustomerMetadata: (
  input: DescribeCustomerMetadataRequest,
) => Effect.Effect<
  DescribeCustomerMetadataResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCustomerMetadataRequest,
  output: DescribeCustomerMetadataResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Describes one or more association proposals for connection between a virtual private gateway or transit gateway and a Direct Connect gateway.
 */
export const describeDirectConnectGatewayAssociationProposals: (
  input: DescribeDirectConnectGatewayAssociationProposalsRequest,
) => Effect.Effect<
  DescribeDirectConnectGatewayAssociationProposalsResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeDirectConnectGatewayAssociations: (
  input: DescribeDirectConnectGatewayAssociationsRequest,
) => Effect.Effect<
  DescribeDirectConnectGatewayAssociationsResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDirectConnectGatewayAssociationsRequest,
  output: DescribeDirectConnectGatewayAssociationsResult,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Lists all your Direct Connect gateways or only the specified Direct Connect gateway. Deleted Direct Connect gateways are not returned.
 */
export const describeDirectConnectGateways: (
  input: DescribeDirectConnectGatewaysRequest,
) => Effect.Effect<
  DescribeDirectConnectGatewaysResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeInterconnectLoa: (
  input: DescribeInterconnectLoaRequest,
) => Effect.Effect<
  DescribeInterconnectLoaResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInterconnectLoaRequest,
  output: DescribeInterconnectLoaResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Lists the interconnects owned by the Amazon Web Services account or only the specified interconnect.
 */
export const describeInterconnects: (
  input: DescribeInterconnectsRequest,
) => Effect.Effect<
  Interconnects,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInterconnectsRequest,
  output: Interconnects,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Describes all your link aggregation groups (LAG) or the specified LAG.
 */
export const describeLags: (
  input: DescribeLagsRequest,
) => Effect.Effect<
  Lags,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeLoa: (
  input: DescribeLoaRequest,
) => Effect.Effect<
  Loa,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoaRequest,
  output: Loa,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Lists the Direct Connect locations in the current Amazon Web Services Region. These are the locations that can be selected when calling
 * CreateConnection or CreateInterconnect.
 */
export const describeLocations: (
  input: DescribeLocationsRequest,
) => Effect.Effect<
  Locations,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeVirtualGateways: (
  input: DescribeVirtualGatewaysRequest,
) => Effect.Effect<
  VirtualGateways,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVirtualGatewaysRequest,
  output: VirtualGateways,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
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
export const describeVirtualInterfaces: (
  input: DescribeVirtualInterfacesRequest,
) => Effect.Effect<
  VirtualInterfaces,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVirtualInterfacesRequest,
  output: VirtualInterfaces,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Removes the association between a MAC Security (MACsec) security key and a Direct Connect connection.
 */
export const disassociateMacSecKey: (
  input: DisassociateMacSecKeyRequest,
) => Effect.Effect<
  DisassociateMacSecKeyResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMacSecKeyRequest,
  output: DisassociateMacSecKeyResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Starts the virtual interface failover test that verifies your configuration meets your resiliency requirements by placing the BGP peering session in the DOWN state. You can then send traffic to verify that there are no outages.
 *
 * You can run the test on public, private, transit, and hosted virtual interfaces.
 *
 * You can use ListVirtualInterfaceTestHistory to view the virtual interface test history.
 *
 * If you need to stop the test before the test interval completes, use StopBgpFailoverTest.
 */
export const startBgpFailoverTest: (
  input: StartBgpFailoverTestRequest,
) => Effect.Effect<
  StartBgpFailoverTestResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBgpFailoverTestRequest,
  output: StartBgpFailoverTestResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Stops the virtual interface failover test.
 */
export const stopBgpFailoverTest: (
  input: StopBgpFailoverTestRequest,
) => Effect.Effect<
  StopBgpFailoverTestResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBgpFailoverTestRequest,
  output: StopBgpFailoverTestResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Updates the name of a current Direct Connect gateway.
 */
export const updateDirectConnectGateway: (
  input: UpdateDirectConnectGatewayRequest,
) => Effect.Effect<
  UpdateDirectConnectGatewayResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDirectConnectGatewayRequest,
  output: UpdateDirectConnectGatewayResponse,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Updates the specified attributes of the Direct Connect gateway association.
 *
 * Add or remove prefixes from the association.
 */
export const updateDirectConnectGatewayAssociation: (
  input: UpdateDirectConnectGatewayAssociationRequest,
) => Effect.Effect<
  UpdateDirectConnectGatewayAssociationResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDirectConnectGatewayAssociationRequest,
  output: UpdateDirectConnectGatewayAssociationResult,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Associates a hosted connection and its virtual interfaces with a link aggregation
 * group (LAG) or interconnect. If the target interconnect or LAG has an existing hosted
 * connection with a conflicting VLAN number or IP address, the operation fails. This
 * action temporarily interrupts the hosted connection's connectivity to Amazon Web Services
 * as it is being migrated.
 *
 * Intended for use by Direct Connect Partners only.
 */
export const associateHostedConnection: (
  input: AssociateHostedConnectionRequest,
) => Effect.Effect<
  Connection,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateHostedConnectionRequest,
  output: Connection,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes the specified connection.
 *
 * Deleting a connection only stops the Direct Connect port hour and data transfer charges.
 * If you are partnering with any third parties to connect with the Direct Connect location,
 * you must cancel your service with them separately.
 */
export const deleteConnection: (
  input: DeleteConnectionRequest,
) => Effect.Effect<
  Connection,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: Connection,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Deletes the specified link aggregation group (LAG). You cannot delete a LAG if it has active
 * virtual interfaces or hosted connections.
 */
export const deleteLag: (
  input: DeleteLagRequest,
) => Effect.Effect<
  Lag,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeConnectionsOnInterconnect: (
  input: DescribeConnectionsOnInterconnectRequest,
) => Effect.Effect<
  Connections,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeHostedConnections: (
  input: DescribeHostedConnectionsRequest,
) => Effect.Effect<
  Connections,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHostedConnectionsRequest,
  output: Connections,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
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
export const disassociateConnectionFromLag: (
  input: DisassociateConnectionFromLagRequest,
) => Effect.Effect<
  Connection,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateConnectionFromLagRequest,
  output: Connection,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Removes one or more tags from the specified Direct Connect resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateConnection: (
  input: UpdateConnectionRequest,
) => Effect.Effect<
  Connection,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLag: (
  input: UpdateLagRequest,
) => Effect.Effect<
  Lag,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVirtualInterfaceAttributes: (
  input: UpdateVirtualInterfaceAttributesRequest,
) => Effect.Effect<
  VirtualInterface,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVirtualInterfaceAttributesRequest,
  output: VirtualInterface,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Accepts a proposal request to attach a virtual private gateway or transit gateway to a Direct Connect gateway.
 */
export const acceptDirectConnectGatewayAssociationProposal: (
  input: AcceptDirectConnectGatewayAssociationProposalRequest,
) => Effect.Effect<
  AcceptDirectConnectGatewayAssociationProposalResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const allocateConnectionOnInterconnect: (
  input: AllocateConnectionOnInterconnectRequest,
) => Effect.Effect<
  Connection,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AllocateConnectionOnInterconnectRequest,
  output: Connection,
  errors: [DirectConnectClientException, DirectConnectServerException],
}));
/**
 * Creates an association between a Direct Connect gateway and a virtual private gateway. The virtual
 * private gateway must be attached to a VPC and must not be associated with another Direct Connect gateway.
 */
export const createDirectConnectGatewayAssociation: (
  input: CreateDirectConnectGatewayAssociationRequest,
) => Effect.Effect<
  CreateDirectConnectGatewayAssociationResult,
  DirectConnectClientException | DirectConnectServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDirectConnectGatewayAssociationRequest,
  output: CreateDirectConnectGatewayAssociationResult,
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
export const createTransitVirtualInterface: (
  input: CreateTransitVirtualInterfaceRequest,
) => Effect.Effect<
  CreateTransitVirtualInterfaceResult,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createInterconnect: (
  input: CreateInterconnectRequest,
) => Effect.Effect<
  Interconnect,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLag: (
  input: CreateLagRequest,
) => Effect.Effect<
  Lag,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPrivateVirtualInterface: (
  input: CreatePrivateVirtualInterfaceRequest,
) => Effect.Effect<
  VirtualInterface,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPublicVirtualInterface: (
  input: CreatePublicVirtualInterfaceRequest,
) => Effect.Effect<
  VirtualInterface,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createConnection: (
  input: CreateConnectionRequest,
) => Effect.Effect<
  Connection,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds the specified tags to the specified Direct Connect resource. Each resource can have a maximum of 50 tags.
 *
 * Each tag consists of a key and an optional value. If a tag with the same key is already associated with the resource, this action updates its value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a hosted connection on the specified interconnect or a link aggregation group (LAG) of interconnects.
 *
 * Allocates a VLAN number and a specified amount of capacity (bandwidth) for use by a hosted connection on the specified interconnect or LAG of interconnects.
 * Amazon Web Services polices the hosted connection for the specified capacity and the Direct Connect Partner must also police the hosted connection for the specified capacity.
 *
 * Intended for use by Direct Connect Partners only.
 */
export const allocateHostedConnection: (
  input: AllocateHostedConnectionRequest,
) => Effect.Effect<
  Connection,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AllocateHostedConnectionRequest,
  output: Connection,
  errors: [
    DirectConnectClientException,
    DirectConnectServerException,
    DuplicateTagKeysException,
    TooManyTagsException,
  ],
}));
/**
 * Provisions a private virtual interface to be owned by the specified Amazon Web Services account.
 *
 * Virtual interfaces created using this action must be confirmed by the owner using ConfirmPrivateVirtualInterface.
 * Until then, the virtual interface is in the `Confirming` state and is not available to handle traffic.
 */
export const allocatePrivateVirtualInterface: (
  input: AllocatePrivateVirtualInterfaceRequest,
) => Effect.Effect<
  VirtualInterface,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const allocatePublicVirtualInterface: (
  input: AllocatePublicVirtualInterfaceRequest,
) => Effect.Effect<
  VirtualInterface,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Provisions a transit virtual interface to be owned by the specified Amazon Web Services account. Use this type of interface to connect a transit gateway to your Direct Connect gateway.
 *
 * The owner of a connection provisions a transit virtual interface to be owned by the specified Amazon Web Services account.
 *
 * After you create a transit virtual interface, it must be confirmed by the owner using ConfirmTransitVirtualInterface. Until this step has been completed, the transit virtual interface is in the `requested` state and is not available to handle traffic.
 */
export const allocateTransitVirtualInterface: (
  input: AllocateTransitVirtualInterfaceRequest,
) => Effect.Effect<
  AllocateTransitVirtualInterfaceResult,
  | DirectConnectClientException
  | DirectConnectServerException
  | DuplicateTagKeysException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AllocateTransitVirtualInterfaceRequest,
  output: AllocateTransitVirtualInterfaceResult,
  errors: [
    DirectConnectClientException,
    DirectConnectServerException,
    DuplicateTagKeysException,
    TooManyTagsException,
  ],
}));
