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
  sdkId: "Global Accelerator",
  serviceShapeName: "GlobalAccelerator_V20180706",
});
const auth = T.AwsAuthSigv4({ name: "globalaccelerator" });
const ver = T.ServiceVersion("2018-08-08");
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
              `https://globalaccelerator-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://globalaccelerator-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://globalaccelerator.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://globalaccelerator.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type IpAddress = string;
export type PortNumber = number;
export type IdempotencyToken = string;
export type AttachmentName = string;
export type Principal = string;
export type TrafficDialPercentage = number;
export type HealthCheckPort = number;
export type HealthCheckPath = string;
export type HealthCheckIntervalSeconds = number;
export type ThresholdCount = number;
export type MaxResults = number;
export type AwsAccountId = string;
export type PortMappingsMaxResults = number;
export type ResourceArn = string;
export type TagKey = string;
export type EndpointWeight = number;
export type TagValue = string;
export type ErrorMessage = string;

//# Schemas
export interface ListCrossAccountResourceAccountsRequest {}
export const ListCrossAccountResourceAccountsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCrossAccountResourceAccountsRequest",
}) as any as S.Schema<ListCrossAccountResourceAccountsRequest>;
export type DestinationAddresses = string[];
export const DestinationAddresses = S.Array(S.String);
export type DestinationPorts = number[];
export const DestinationPorts = S.Array(S.Number);
export type IpAddressType = "IPV4" | "DUAL_STACK";
export const IpAddressType = S.Literal("IPV4", "DUAL_STACK");
export type IpAddresses = string[];
export const IpAddresses = S.Array(S.String);
export type Principals = string[];
export const Principals = S.Array(S.String);
export type HealthCheckProtocol = "TCP" | "HTTP" | "HTTPS";
export const HealthCheckProtocol = S.Literal("TCP", "HTTP", "HTTPS");
export type Protocol = "TCP" | "UDP";
export const Protocol = S.Literal("TCP", "UDP");
export type ClientAffinity = "NONE" | "SOURCE_IP";
export const ClientAffinity = S.Literal("NONE", "SOURCE_IP");
export type AwsAccountIds = string[];
export const AwsAccountIds = S.Array(S.String);
export type EndpointIds = string[];
export const EndpointIds = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface AdvertiseByoipCidrRequest {
  Cidr: string;
}
export const AdvertiseByoipCidrRequest = S.suspend(() =>
  S.Struct({ Cidr: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AdvertiseByoipCidrRequest",
}) as any as S.Schema<AdvertiseByoipCidrRequest>;
export interface AllowCustomRoutingTrafficRequest {
  EndpointGroupArn: string;
  EndpointId: string;
  DestinationAddresses?: string[];
  DestinationPorts?: number[];
  AllowAllTrafficToEndpoint?: boolean;
}
export const AllowCustomRoutingTrafficRequest = S.suspend(() =>
  S.Struct({
    EndpointGroupArn: S.String,
    EndpointId: S.String,
    DestinationAddresses: S.optional(DestinationAddresses),
    DestinationPorts: S.optional(DestinationPorts),
    AllowAllTrafficToEndpoint: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AllowCustomRoutingTrafficRequest",
}) as any as S.Schema<AllowCustomRoutingTrafficRequest>;
export interface AllowCustomRoutingTrafficResponse {}
export const AllowCustomRoutingTrafficResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AllowCustomRoutingTrafficResponse",
}) as any as S.Schema<AllowCustomRoutingTrafficResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateCustomRoutingAcceleratorRequest {
  Name: string;
  IpAddressType?: IpAddressType;
  IpAddresses?: string[];
  Enabled?: boolean;
  IdempotencyToken: string;
  Tags?: Tag[];
}
export const CreateCustomRoutingAcceleratorRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    IpAddressType: S.optional(IpAddressType),
    IpAddresses: S.optional(IpAddresses),
    Enabled: S.optional(S.Boolean),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCustomRoutingAcceleratorRequest",
}) as any as S.Schema<CreateCustomRoutingAcceleratorRequest>;
export interface PortRange {
  FromPort?: number;
  ToPort?: number;
}
export const PortRange = S.suspend(() =>
  S.Struct({ FromPort: S.optional(S.Number), ToPort: S.optional(S.Number) }),
).annotations({ identifier: "PortRange" }) as any as S.Schema<PortRange>;
export type PortRanges = PortRange[];
export const PortRanges = S.Array(PortRange);
export interface CreateListenerRequest {
  AcceleratorArn: string;
  PortRanges: PortRange[];
  Protocol: Protocol;
  ClientAffinity?: ClientAffinity;
  IdempotencyToken: string;
}
export const CreateListenerRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.String,
    PortRanges: PortRanges,
    Protocol: Protocol,
    ClientAffinity: S.optional(ClientAffinity),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateListenerRequest",
}) as any as S.Schema<CreateListenerRequest>;
export interface DeleteAcceleratorRequest {
  AcceleratorArn: string;
}
export const DeleteAcceleratorRequest = S.suspend(() =>
  S.Struct({ AcceleratorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAcceleratorRequest",
}) as any as S.Schema<DeleteAcceleratorRequest>;
export interface DeleteAcceleratorResponse {}
export const DeleteAcceleratorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAcceleratorResponse",
}) as any as S.Schema<DeleteAcceleratorResponse>;
export interface DeleteCrossAccountAttachmentRequest {
  AttachmentArn: string;
}
export const DeleteCrossAccountAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCrossAccountAttachmentRequest",
}) as any as S.Schema<DeleteCrossAccountAttachmentRequest>;
export interface DeleteCrossAccountAttachmentResponse {}
export const DeleteCrossAccountAttachmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCrossAccountAttachmentResponse",
}) as any as S.Schema<DeleteCrossAccountAttachmentResponse>;
export interface DeleteCustomRoutingAcceleratorRequest {
  AcceleratorArn: string;
}
export const DeleteCustomRoutingAcceleratorRequest = S.suspend(() =>
  S.Struct({ AcceleratorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCustomRoutingAcceleratorRequest",
}) as any as S.Schema<DeleteCustomRoutingAcceleratorRequest>;
export interface DeleteCustomRoutingAcceleratorResponse {}
export const DeleteCustomRoutingAcceleratorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomRoutingAcceleratorResponse",
}) as any as S.Schema<DeleteCustomRoutingAcceleratorResponse>;
export interface DeleteCustomRoutingEndpointGroupRequest {
  EndpointGroupArn: string;
}
export const DeleteCustomRoutingEndpointGroupRequest = S.suspend(() =>
  S.Struct({ EndpointGroupArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCustomRoutingEndpointGroupRequest",
}) as any as S.Schema<DeleteCustomRoutingEndpointGroupRequest>;
export interface DeleteCustomRoutingEndpointGroupResponse {}
export const DeleteCustomRoutingEndpointGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomRoutingEndpointGroupResponse",
}) as any as S.Schema<DeleteCustomRoutingEndpointGroupResponse>;
export interface DeleteCustomRoutingListenerRequest {
  ListenerArn: string;
}
export const DeleteCustomRoutingListenerRequest = S.suspend(() =>
  S.Struct({ ListenerArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCustomRoutingListenerRequest",
}) as any as S.Schema<DeleteCustomRoutingListenerRequest>;
export interface DeleteCustomRoutingListenerResponse {}
export const DeleteCustomRoutingListenerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomRoutingListenerResponse",
}) as any as S.Schema<DeleteCustomRoutingListenerResponse>;
export interface DeleteEndpointGroupRequest {
  EndpointGroupArn: string;
}
export const DeleteEndpointGroupRequest = S.suspend(() =>
  S.Struct({ EndpointGroupArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEndpointGroupRequest",
}) as any as S.Schema<DeleteEndpointGroupRequest>;
export interface DeleteEndpointGroupResponse {}
export const DeleteEndpointGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEndpointGroupResponse",
}) as any as S.Schema<DeleteEndpointGroupResponse>;
export interface DeleteListenerRequest {
  ListenerArn: string;
}
export const DeleteListenerRequest = S.suspend(() =>
  S.Struct({ ListenerArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteListenerRequest",
}) as any as S.Schema<DeleteListenerRequest>;
export interface DeleteListenerResponse {}
export const DeleteListenerResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteListenerResponse" },
) as any as S.Schema<DeleteListenerResponse>;
export interface DenyCustomRoutingTrafficRequest {
  EndpointGroupArn: string;
  EndpointId: string;
  DestinationAddresses?: string[];
  DestinationPorts?: number[];
  DenyAllTrafficToEndpoint?: boolean;
}
export const DenyCustomRoutingTrafficRequest = S.suspend(() =>
  S.Struct({
    EndpointGroupArn: S.String,
    EndpointId: S.String,
    DestinationAddresses: S.optional(DestinationAddresses),
    DestinationPorts: S.optional(DestinationPorts),
    DenyAllTrafficToEndpoint: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DenyCustomRoutingTrafficRequest",
}) as any as S.Schema<DenyCustomRoutingTrafficRequest>;
export interface DenyCustomRoutingTrafficResponse {}
export const DenyCustomRoutingTrafficResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DenyCustomRoutingTrafficResponse",
}) as any as S.Schema<DenyCustomRoutingTrafficResponse>;
export interface DeprovisionByoipCidrRequest {
  Cidr: string;
}
export const DeprovisionByoipCidrRequest = S.suspend(() =>
  S.Struct({ Cidr: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeprovisionByoipCidrRequest",
}) as any as S.Schema<DeprovisionByoipCidrRequest>;
export interface DescribeAcceleratorRequest {
  AcceleratorArn: string;
}
export const DescribeAcceleratorRequest = S.suspend(() =>
  S.Struct({ AcceleratorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAcceleratorRequest",
}) as any as S.Schema<DescribeAcceleratorRequest>;
export interface DescribeAcceleratorAttributesRequest {
  AcceleratorArn: string;
}
export const DescribeAcceleratorAttributesRequest = S.suspend(() =>
  S.Struct({ AcceleratorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAcceleratorAttributesRequest",
}) as any as S.Schema<DescribeAcceleratorAttributesRequest>;
export interface DescribeCrossAccountAttachmentRequest {
  AttachmentArn: string;
}
export const DescribeCrossAccountAttachmentRequest = S.suspend(() =>
  S.Struct({ AttachmentArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCrossAccountAttachmentRequest",
}) as any as S.Schema<DescribeCrossAccountAttachmentRequest>;
export interface DescribeCustomRoutingAcceleratorRequest {
  AcceleratorArn: string;
}
export const DescribeCustomRoutingAcceleratorRequest = S.suspend(() =>
  S.Struct({ AcceleratorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCustomRoutingAcceleratorRequest",
}) as any as S.Schema<DescribeCustomRoutingAcceleratorRequest>;
export interface DescribeCustomRoutingAcceleratorAttributesRequest {
  AcceleratorArn: string;
}
export const DescribeCustomRoutingAcceleratorAttributesRequest = S.suspend(() =>
  S.Struct({ AcceleratorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCustomRoutingAcceleratorAttributesRequest",
}) as any as S.Schema<DescribeCustomRoutingAcceleratorAttributesRequest>;
export interface DescribeCustomRoutingEndpointGroupRequest {
  EndpointGroupArn: string;
}
export const DescribeCustomRoutingEndpointGroupRequest = S.suspend(() =>
  S.Struct({ EndpointGroupArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCustomRoutingEndpointGroupRequest",
}) as any as S.Schema<DescribeCustomRoutingEndpointGroupRequest>;
export interface DescribeCustomRoutingListenerRequest {
  ListenerArn: string;
}
export const DescribeCustomRoutingListenerRequest = S.suspend(() =>
  S.Struct({ ListenerArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCustomRoutingListenerRequest",
}) as any as S.Schema<DescribeCustomRoutingListenerRequest>;
export interface DescribeEndpointGroupRequest {
  EndpointGroupArn: string;
}
export const DescribeEndpointGroupRequest = S.suspend(() =>
  S.Struct({ EndpointGroupArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEndpointGroupRequest",
}) as any as S.Schema<DescribeEndpointGroupRequest>;
export interface DescribeListenerRequest {
  ListenerArn: string;
}
export const DescribeListenerRequest = S.suspend(() =>
  S.Struct({ ListenerArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeListenerRequest",
}) as any as S.Schema<DescribeListenerRequest>;
export interface ListAcceleratorsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListAcceleratorsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAcceleratorsRequest",
}) as any as S.Schema<ListAcceleratorsRequest>;
export interface ListByoipCidrsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListByoipCidrsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListByoipCidrsRequest",
}) as any as S.Schema<ListByoipCidrsRequest>;
export interface ListCrossAccountAttachmentsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListCrossAccountAttachmentsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCrossAccountAttachmentsRequest",
}) as any as S.Schema<ListCrossAccountAttachmentsRequest>;
export interface ListCrossAccountResourceAccountsResponse {
  ResourceOwnerAwsAccountIds?: string[];
}
export const ListCrossAccountResourceAccountsResponse = S.suspend(() =>
  S.Struct({ ResourceOwnerAwsAccountIds: S.optional(AwsAccountIds) }),
).annotations({
  identifier: "ListCrossAccountResourceAccountsResponse",
}) as any as S.Schema<ListCrossAccountResourceAccountsResponse>;
export interface ListCrossAccountResourcesRequest {
  AcceleratorArn?: string;
  ResourceOwnerAwsAccountId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCrossAccountResourcesRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.optional(S.String),
    ResourceOwnerAwsAccountId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCrossAccountResourcesRequest",
}) as any as S.Schema<ListCrossAccountResourcesRequest>;
export interface ListCustomRoutingAcceleratorsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListCustomRoutingAcceleratorsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCustomRoutingAcceleratorsRequest",
}) as any as S.Schema<ListCustomRoutingAcceleratorsRequest>;
export interface ListCustomRoutingEndpointGroupsRequest {
  ListenerArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCustomRoutingEndpointGroupsRequest = S.suspend(() =>
  S.Struct({
    ListenerArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCustomRoutingEndpointGroupsRequest",
}) as any as S.Schema<ListCustomRoutingEndpointGroupsRequest>;
export interface ListCustomRoutingListenersRequest {
  AcceleratorArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCustomRoutingListenersRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCustomRoutingListenersRequest",
}) as any as S.Schema<ListCustomRoutingListenersRequest>;
export interface ListCustomRoutingPortMappingsRequest {
  AcceleratorArn: string;
  EndpointGroupArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCustomRoutingPortMappingsRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.String,
    EndpointGroupArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCustomRoutingPortMappingsRequest",
}) as any as S.Schema<ListCustomRoutingPortMappingsRequest>;
export interface ListCustomRoutingPortMappingsByDestinationRequest {
  EndpointId: string;
  DestinationAddress: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCustomRoutingPortMappingsByDestinationRequest = S.suspend(() =>
  S.Struct({
    EndpointId: S.String,
    DestinationAddress: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCustomRoutingPortMappingsByDestinationRequest",
}) as any as S.Schema<ListCustomRoutingPortMappingsByDestinationRequest>;
export interface ListEndpointGroupsRequest {
  ListenerArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListEndpointGroupsRequest = S.suspend(() =>
  S.Struct({
    ListenerArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEndpointGroupsRequest",
}) as any as S.Schema<ListEndpointGroupsRequest>;
export interface ListListenersRequest {
  AcceleratorArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListListenersRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListListenersRequest",
}) as any as S.Schema<ListListenersRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface RemoveCustomRoutingEndpointsRequest {
  EndpointIds: string[];
  EndpointGroupArn: string;
}
export const RemoveCustomRoutingEndpointsRequest = S.suspend(() =>
  S.Struct({ EndpointIds: EndpointIds, EndpointGroupArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RemoveCustomRoutingEndpointsRequest",
}) as any as S.Schema<RemoveCustomRoutingEndpointsRequest>;
export interface RemoveCustomRoutingEndpointsResponse {}
export const RemoveCustomRoutingEndpointsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveCustomRoutingEndpointsResponse",
}) as any as S.Schema<RemoveCustomRoutingEndpointsResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: Tags }).pipe(
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
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateAcceleratorRequest {
  AcceleratorArn: string;
  Name?: string;
  IpAddressType?: IpAddressType;
  IpAddresses?: string[];
  Enabled?: boolean;
}
export const UpdateAcceleratorRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.String,
    Name: S.optional(S.String),
    IpAddressType: S.optional(IpAddressType),
    IpAddresses: S.optional(IpAddresses),
    Enabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAcceleratorRequest",
}) as any as S.Schema<UpdateAcceleratorRequest>;
export interface UpdateAcceleratorAttributesRequest {
  AcceleratorArn: string;
  FlowLogsEnabled?: boolean;
  FlowLogsS3Bucket?: string;
  FlowLogsS3Prefix?: string;
}
export const UpdateAcceleratorAttributesRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.String,
    FlowLogsEnabled: S.optional(S.Boolean),
    FlowLogsS3Bucket: S.optional(S.String),
    FlowLogsS3Prefix: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAcceleratorAttributesRequest",
}) as any as S.Schema<UpdateAcceleratorAttributesRequest>;
export interface Resource {
  EndpointId?: string;
  Cidr?: string;
  Region?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({
    EndpointId: S.optional(S.String),
    Cidr: S.optional(S.String),
    Region: S.optional(S.String),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type Resources = Resource[];
export const Resources = S.Array(Resource);
export interface UpdateCrossAccountAttachmentRequest {
  AttachmentArn: string;
  Name?: string;
  AddPrincipals?: string[];
  RemovePrincipals?: string[];
  AddResources?: Resource[];
  RemoveResources?: Resource[];
}
export const UpdateCrossAccountAttachmentRequest = S.suspend(() =>
  S.Struct({
    AttachmentArn: S.String,
    Name: S.optional(S.String),
    AddPrincipals: S.optional(Principals),
    RemovePrincipals: S.optional(Principals),
    AddResources: S.optional(Resources),
    RemoveResources: S.optional(Resources),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCrossAccountAttachmentRequest",
}) as any as S.Schema<UpdateCrossAccountAttachmentRequest>;
export interface UpdateCustomRoutingAcceleratorRequest {
  AcceleratorArn: string;
  Name?: string;
  IpAddressType?: IpAddressType;
  IpAddresses?: string[];
  Enabled?: boolean;
}
export const UpdateCustomRoutingAcceleratorRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.String,
    Name: S.optional(S.String),
    IpAddressType: S.optional(IpAddressType),
    IpAddresses: S.optional(IpAddresses),
    Enabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCustomRoutingAcceleratorRequest",
}) as any as S.Schema<UpdateCustomRoutingAcceleratorRequest>;
export interface UpdateCustomRoutingAcceleratorAttributesRequest {
  AcceleratorArn: string;
  FlowLogsEnabled?: boolean;
  FlowLogsS3Bucket?: string;
  FlowLogsS3Prefix?: string;
}
export const UpdateCustomRoutingAcceleratorAttributesRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.String,
    FlowLogsEnabled: S.optional(S.Boolean),
    FlowLogsS3Bucket: S.optional(S.String),
    FlowLogsS3Prefix: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCustomRoutingAcceleratorAttributesRequest",
}) as any as S.Schema<UpdateCustomRoutingAcceleratorAttributesRequest>;
export interface UpdateCustomRoutingListenerRequest {
  ListenerArn: string;
  PortRanges: PortRange[];
}
export const UpdateCustomRoutingListenerRequest = S.suspend(() =>
  S.Struct({ ListenerArn: S.String, PortRanges: PortRanges }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCustomRoutingListenerRequest",
}) as any as S.Schema<UpdateCustomRoutingListenerRequest>;
export interface EndpointConfiguration {
  EndpointId?: string;
  Weight?: number;
  ClientIPPreservationEnabled?: boolean;
  AttachmentArn?: string;
}
export const EndpointConfiguration = S.suspend(() =>
  S.Struct({
    EndpointId: S.optional(S.String),
    Weight: S.optional(S.Number),
    ClientIPPreservationEnabled: S.optional(S.Boolean),
    AttachmentArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EndpointConfiguration",
}) as any as S.Schema<EndpointConfiguration>;
export type EndpointConfigurations = EndpointConfiguration[];
export const EndpointConfigurations = S.Array(EndpointConfiguration);
export interface PortOverride {
  ListenerPort?: number;
  EndpointPort?: number;
}
export const PortOverride = S.suspend(() =>
  S.Struct({
    ListenerPort: S.optional(S.Number),
    EndpointPort: S.optional(S.Number),
  }),
).annotations({ identifier: "PortOverride" }) as any as S.Schema<PortOverride>;
export type PortOverrides = PortOverride[];
export const PortOverrides = S.Array(PortOverride);
export interface UpdateEndpointGroupRequest {
  EndpointGroupArn: string;
  EndpointConfigurations?: EndpointConfiguration[];
  TrafficDialPercentage?: number;
  HealthCheckPort?: number;
  HealthCheckProtocol?: HealthCheckProtocol;
  HealthCheckPath?: string;
  HealthCheckIntervalSeconds?: number;
  ThresholdCount?: number;
  PortOverrides?: PortOverride[];
}
export const UpdateEndpointGroupRequest = S.suspend(() =>
  S.Struct({
    EndpointGroupArn: S.String,
    EndpointConfigurations: S.optional(EndpointConfigurations),
    TrafficDialPercentage: S.optional(S.Number),
    HealthCheckPort: S.optional(S.Number),
    HealthCheckProtocol: S.optional(HealthCheckProtocol),
    HealthCheckPath: S.optional(S.String),
    HealthCheckIntervalSeconds: S.optional(S.Number),
    ThresholdCount: S.optional(S.Number),
    PortOverrides: S.optional(PortOverrides),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEndpointGroupRequest",
}) as any as S.Schema<UpdateEndpointGroupRequest>;
export interface UpdateListenerRequest {
  ListenerArn: string;
  PortRanges?: PortRange[];
  Protocol?: Protocol;
  ClientAffinity?: ClientAffinity;
}
export const UpdateListenerRequest = S.suspend(() =>
  S.Struct({
    ListenerArn: S.String,
    PortRanges: S.optional(PortRanges),
    Protocol: S.optional(Protocol),
    ClientAffinity: S.optional(ClientAffinity),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateListenerRequest",
}) as any as S.Schema<UpdateListenerRequest>;
export interface WithdrawByoipCidrRequest {
  Cidr: string;
}
export const WithdrawByoipCidrRequest = S.suspend(() =>
  S.Struct({ Cidr: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "WithdrawByoipCidrRequest",
}) as any as S.Schema<WithdrawByoipCidrRequest>;
export type CustomRoutingProtocol = "TCP" | "UDP";
export const CustomRoutingProtocol = S.Literal("TCP", "UDP");
export type CustomRoutingProtocols = CustomRoutingProtocol[];
export const CustomRoutingProtocols = S.Array(CustomRoutingProtocol);
export interface CustomRoutingEndpointConfiguration {
  EndpointId?: string;
  AttachmentArn?: string;
}
export const CustomRoutingEndpointConfiguration = S.suspend(() =>
  S.Struct({
    EndpointId: S.optional(S.String),
    AttachmentArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomRoutingEndpointConfiguration",
}) as any as S.Schema<CustomRoutingEndpointConfiguration>;
export type CustomRoutingEndpointConfigurations =
  CustomRoutingEndpointConfiguration[];
export const CustomRoutingEndpointConfigurations = S.Array(
  CustomRoutingEndpointConfiguration,
);
export interface CustomRoutingDestinationConfiguration {
  FromPort: number;
  ToPort: number;
  Protocols: CustomRoutingProtocol[];
}
export const CustomRoutingDestinationConfiguration = S.suspend(() =>
  S.Struct({
    FromPort: S.Number,
    ToPort: S.Number,
    Protocols: CustomRoutingProtocols,
  }),
).annotations({
  identifier: "CustomRoutingDestinationConfiguration",
}) as any as S.Schema<CustomRoutingDestinationConfiguration>;
export type CustomRoutingDestinationConfigurations =
  CustomRoutingDestinationConfiguration[];
export const CustomRoutingDestinationConfigurations = S.Array(
  CustomRoutingDestinationConfiguration,
);
export type IpAddressFamily = "IPv4" | "IPv6";
export const IpAddressFamily = S.Literal("IPv4", "IPv6");
export interface IpSet {
  IpFamily?: string;
  IpAddresses?: string[];
  IpAddressFamily?: IpAddressFamily;
}
export const IpSet = S.suspend(() =>
  S.Struct({
    IpFamily: S.optional(S.String),
    IpAddresses: S.optional(IpAddresses),
    IpAddressFamily: S.optional(IpAddressFamily),
  }),
).annotations({ identifier: "IpSet" }) as any as S.Schema<IpSet>;
export type IpSets = IpSet[];
export const IpSets = S.Array(IpSet);
export type AcceleratorStatus = "DEPLOYED" | "IN_PROGRESS";
export const AcceleratorStatus = S.Literal("DEPLOYED", "IN_PROGRESS");
export interface AcceleratorEvent {
  Message?: string;
  Timestamp?: Date;
}
export const AcceleratorEvent = S.suspend(() =>
  S.Struct({
    Message: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AcceleratorEvent",
}) as any as S.Schema<AcceleratorEvent>;
export type AcceleratorEvents = AcceleratorEvent[];
export const AcceleratorEvents = S.Array(AcceleratorEvent);
export interface Accelerator {
  AcceleratorArn?: string;
  Name?: string;
  IpAddressType?: IpAddressType;
  Enabled?: boolean;
  IpSets?: IpSet[];
  DnsName?: string;
  Status?: AcceleratorStatus;
  CreatedTime?: Date;
  LastModifiedTime?: Date;
  DualStackDnsName?: string;
  Events?: AcceleratorEvent[];
}
export const Accelerator = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.optional(S.String),
    Name: S.optional(S.String),
    IpAddressType: S.optional(IpAddressType),
    Enabled: S.optional(S.Boolean),
    IpSets: S.optional(IpSets),
    DnsName: S.optional(S.String),
    Status: S.optional(AcceleratorStatus),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DualStackDnsName: S.optional(S.String),
    Events: S.optional(AcceleratorEvents),
  }),
).annotations({ identifier: "Accelerator" }) as any as S.Schema<Accelerator>;
export type Accelerators = Accelerator[];
export const Accelerators = S.Array(Accelerator);
export type ByoipCidrState =
  | "PENDING_PROVISIONING"
  | "READY"
  | "PENDING_ADVERTISING"
  | "ADVERTISING"
  | "PENDING_WITHDRAWING"
  | "PENDING_DEPROVISIONING"
  | "DEPROVISIONED"
  | "FAILED_PROVISION"
  | "FAILED_ADVERTISING"
  | "FAILED_WITHDRAW"
  | "FAILED_DEPROVISION";
export const ByoipCidrState = S.Literal(
  "PENDING_PROVISIONING",
  "READY",
  "PENDING_ADVERTISING",
  "ADVERTISING",
  "PENDING_WITHDRAWING",
  "PENDING_DEPROVISIONING",
  "DEPROVISIONED",
  "FAILED_PROVISION",
  "FAILED_ADVERTISING",
  "FAILED_WITHDRAW",
  "FAILED_DEPROVISION",
);
export interface ByoipCidrEvent {
  Message?: string;
  Timestamp?: Date;
}
export const ByoipCidrEvent = S.suspend(() =>
  S.Struct({
    Message: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ByoipCidrEvent",
}) as any as S.Schema<ByoipCidrEvent>;
export type ByoipCidrEvents = ByoipCidrEvent[];
export const ByoipCidrEvents = S.Array(ByoipCidrEvent);
export interface ByoipCidr {
  Cidr?: string;
  State?: ByoipCidrState;
  Events?: ByoipCidrEvent[];
}
export const ByoipCidr = S.suspend(() =>
  S.Struct({
    Cidr: S.optional(S.String),
    State: S.optional(ByoipCidrState),
    Events: S.optional(ByoipCidrEvents),
  }),
).annotations({ identifier: "ByoipCidr" }) as any as S.Schema<ByoipCidr>;
export type ByoipCidrs = ByoipCidr[];
export const ByoipCidrs = S.Array(ByoipCidr);
export interface Attachment {
  AttachmentArn?: string;
  Name?: string;
  Principals?: string[];
  Resources?: Resource[];
  LastModifiedTime?: Date;
  CreatedTime?: Date;
}
export const Attachment = S.suspend(() =>
  S.Struct({
    AttachmentArn: S.optional(S.String),
    Name: S.optional(S.String),
    Principals: S.optional(Principals),
    Resources: S.optional(Resources),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Attachment" }) as any as S.Schema<Attachment>;
export type Attachments = Attachment[];
export const Attachments = S.Array(Attachment);
export type CustomRoutingAcceleratorStatus = "DEPLOYED" | "IN_PROGRESS";
export const CustomRoutingAcceleratorStatus = S.Literal(
  "DEPLOYED",
  "IN_PROGRESS",
);
export interface CustomRoutingAccelerator {
  AcceleratorArn?: string;
  Name?: string;
  IpAddressType?: IpAddressType;
  Enabled?: boolean;
  IpSets?: IpSet[];
  DnsName?: string;
  Status?: CustomRoutingAcceleratorStatus;
  CreatedTime?: Date;
  LastModifiedTime?: Date;
}
export const CustomRoutingAccelerator = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.optional(S.String),
    Name: S.optional(S.String),
    IpAddressType: S.optional(IpAddressType),
    Enabled: S.optional(S.Boolean),
    IpSets: S.optional(IpSets),
    DnsName: S.optional(S.String),
    Status: S.optional(CustomRoutingAcceleratorStatus),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CustomRoutingAccelerator",
}) as any as S.Schema<CustomRoutingAccelerator>;
export type CustomRoutingAccelerators = CustomRoutingAccelerator[];
export const CustomRoutingAccelerators = S.Array(CustomRoutingAccelerator);
export type Protocols = Protocol[];
export const Protocols = S.Array(Protocol);
export interface CustomRoutingDestinationDescription {
  FromPort?: number;
  ToPort?: number;
  Protocols?: Protocol[];
}
export const CustomRoutingDestinationDescription = S.suspend(() =>
  S.Struct({
    FromPort: S.optional(S.Number),
    ToPort: S.optional(S.Number),
    Protocols: S.optional(Protocols),
  }),
).annotations({
  identifier: "CustomRoutingDestinationDescription",
}) as any as S.Schema<CustomRoutingDestinationDescription>;
export type CustomRoutingDestinationDescriptions =
  CustomRoutingDestinationDescription[];
export const CustomRoutingDestinationDescriptions = S.Array(
  CustomRoutingDestinationDescription,
);
export interface CustomRoutingEndpointDescription {
  EndpointId?: string;
}
export const CustomRoutingEndpointDescription = S.suspend(() =>
  S.Struct({ EndpointId: S.optional(S.String) }),
).annotations({
  identifier: "CustomRoutingEndpointDescription",
}) as any as S.Schema<CustomRoutingEndpointDescription>;
export type CustomRoutingEndpointDescriptions =
  CustomRoutingEndpointDescription[];
export const CustomRoutingEndpointDescriptions = S.Array(
  CustomRoutingEndpointDescription,
);
export interface CustomRoutingEndpointGroup {
  EndpointGroupArn?: string;
  EndpointGroupRegion?: string;
  DestinationDescriptions?: CustomRoutingDestinationDescription[];
  EndpointDescriptions?: CustomRoutingEndpointDescription[];
}
export const CustomRoutingEndpointGroup = S.suspend(() =>
  S.Struct({
    EndpointGroupArn: S.optional(S.String),
    EndpointGroupRegion: S.optional(S.String),
    DestinationDescriptions: S.optional(CustomRoutingDestinationDescriptions),
    EndpointDescriptions: S.optional(CustomRoutingEndpointDescriptions),
  }),
).annotations({
  identifier: "CustomRoutingEndpointGroup",
}) as any as S.Schema<CustomRoutingEndpointGroup>;
export type CustomRoutingEndpointGroups = CustomRoutingEndpointGroup[];
export const CustomRoutingEndpointGroups = S.Array(CustomRoutingEndpointGroup);
export interface CustomRoutingListener {
  ListenerArn?: string;
  PortRanges?: PortRange[];
}
export const CustomRoutingListener = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    PortRanges: S.optional(PortRanges),
  }),
).annotations({
  identifier: "CustomRoutingListener",
}) as any as S.Schema<CustomRoutingListener>;
export type CustomRoutingListeners = CustomRoutingListener[];
export const CustomRoutingListeners = S.Array(CustomRoutingListener);
export type HealthState = "INITIAL" | "HEALTHY" | "UNHEALTHY";
export const HealthState = S.Literal("INITIAL", "HEALTHY", "UNHEALTHY");
export interface EndpointDescription {
  EndpointId?: string;
  Weight?: number;
  HealthState?: HealthState;
  HealthReason?: string;
  ClientIPPreservationEnabled?: boolean;
}
export const EndpointDescription = S.suspend(() =>
  S.Struct({
    EndpointId: S.optional(S.String),
    Weight: S.optional(S.Number),
    HealthState: S.optional(HealthState),
    HealthReason: S.optional(S.String),
    ClientIPPreservationEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EndpointDescription",
}) as any as S.Schema<EndpointDescription>;
export type EndpointDescriptions = EndpointDescription[];
export const EndpointDescriptions = S.Array(EndpointDescription);
export interface EndpointGroup {
  EndpointGroupArn?: string;
  EndpointGroupRegion?: string;
  EndpointDescriptions?: EndpointDescription[];
  TrafficDialPercentage?: number;
  HealthCheckPort?: number;
  HealthCheckProtocol?: HealthCheckProtocol;
  HealthCheckPath?: string;
  HealthCheckIntervalSeconds?: number;
  ThresholdCount?: number;
  PortOverrides?: PortOverride[];
}
export const EndpointGroup = S.suspend(() =>
  S.Struct({
    EndpointGroupArn: S.optional(S.String),
    EndpointGroupRegion: S.optional(S.String),
    EndpointDescriptions: S.optional(EndpointDescriptions),
    TrafficDialPercentage: S.optional(S.Number),
    HealthCheckPort: S.optional(S.Number),
    HealthCheckProtocol: S.optional(HealthCheckProtocol),
    HealthCheckPath: S.optional(S.String),
    HealthCheckIntervalSeconds: S.optional(S.Number),
    ThresholdCount: S.optional(S.Number),
    PortOverrides: S.optional(PortOverrides),
  }),
).annotations({
  identifier: "EndpointGroup",
}) as any as S.Schema<EndpointGroup>;
export type EndpointGroups = EndpointGroup[];
export const EndpointGroups = S.Array(EndpointGroup);
export interface Listener {
  ListenerArn?: string;
  PortRanges?: PortRange[];
  Protocol?: Protocol;
  ClientAffinity?: ClientAffinity;
}
export const Listener = S.suspend(() =>
  S.Struct({
    ListenerArn: S.optional(S.String),
    PortRanges: S.optional(PortRanges),
    Protocol: S.optional(Protocol),
    ClientAffinity: S.optional(ClientAffinity),
  }),
).annotations({ identifier: "Listener" }) as any as S.Schema<Listener>;
export type Listeners = Listener[];
export const Listeners = S.Array(Listener);
export interface CidrAuthorizationContext {
  Message: string;
  Signature: string;
}
export const CidrAuthorizationContext = S.suspend(() =>
  S.Struct({ Message: S.String, Signature: S.String }),
).annotations({
  identifier: "CidrAuthorizationContext",
}) as any as S.Schema<CidrAuthorizationContext>;
export interface EndpointIdentifier {
  EndpointId: string;
  ClientIPPreservationEnabled?: boolean;
}
export const EndpointIdentifier = S.suspend(() =>
  S.Struct({
    EndpointId: S.String,
    ClientIPPreservationEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EndpointIdentifier",
}) as any as S.Schema<EndpointIdentifier>;
export type EndpointIdentifiers = EndpointIdentifier[];
export const EndpointIdentifiers = S.Array(EndpointIdentifier);
export interface AddCustomRoutingEndpointsRequest {
  EndpointConfigurations: CustomRoutingEndpointConfiguration[];
  EndpointGroupArn: string;
}
export const AddCustomRoutingEndpointsRequest = S.suspend(() =>
  S.Struct({
    EndpointConfigurations: CustomRoutingEndpointConfigurations,
    EndpointGroupArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AddCustomRoutingEndpointsRequest",
}) as any as S.Schema<AddCustomRoutingEndpointsRequest>;
export interface AddEndpointsRequest {
  EndpointConfigurations: EndpointConfiguration[];
  EndpointGroupArn: string;
}
export const AddEndpointsRequest = S.suspend(() =>
  S.Struct({
    EndpointConfigurations: EndpointConfigurations,
    EndpointGroupArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AddEndpointsRequest",
}) as any as S.Schema<AddEndpointsRequest>;
export interface CreateAcceleratorRequest {
  Name: string;
  IpAddressType?: IpAddressType;
  IpAddresses?: string[];
  Enabled?: boolean;
  IdempotencyToken: string;
  Tags?: Tag[];
}
export const CreateAcceleratorRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    IpAddressType: S.optional(IpAddressType),
    IpAddresses: S.optional(IpAddresses),
    Enabled: S.optional(S.Boolean),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAcceleratorRequest",
}) as any as S.Schema<CreateAcceleratorRequest>;
export interface CreateCrossAccountAttachmentRequest {
  Name: string;
  Principals?: string[];
  Resources?: Resource[];
  IdempotencyToken: string;
  Tags?: Tag[];
}
export const CreateCrossAccountAttachmentRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Principals: S.optional(Principals),
    Resources: S.optional(Resources),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCrossAccountAttachmentRequest",
}) as any as S.Schema<CreateCrossAccountAttachmentRequest>;
export interface CreateCustomRoutingEndpointGroupRequest {
  ListenerArn: string;
  EndpointGroupRegion: string;
  DestinationConfigurations: CustomRoutingDestinationConfiguration[];
  IdempotencyToken: string;
}
export const CreateCustomRoutingEndpointGroupRequest = S.suspend(() =>
  S.Struct({
    ListenerArn: S.String,
    EndpointGroupRegion: S.String,
    DestinationConfigurations: CustomRoutingDestinationConfigurations,
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCustomRoutingEndpointGroupRequest",
}) as any as S.Schema<CreateCustomRoutingEndpointGroupRequest>;
export interface CreateCustomRoutingListenerRequest {
  AcceleratorArn: string;
  PortRanges: PortRange[];
  IdempotencyToken: string;
}
export const CreateCustomRoutingListenerRequest = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.String,
    PortRanges: PortRanges,
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCustomRoutingListenerRequest",
}) as any as S.Schema<CreateCustomRoutingListenerRequest>;
export interface CreateEndpointGroupRequest {
  ListenerArn: string;
  EndpointGroupRegion: string;
  EndpointConfigurations?: EndpointConfiguration[];
  TrafficDialPercentage?: number;
  HealthCheckPort?: number;
  HealthCheckProtocol?: HealthCheckProtocol;
  HealthCheckPath?: string;
  HealthCheckIntervalSeconds?: number;
  ThresholdCount?: number;
  IdempotencyToken: string;
  PortOverrides?: PortOverride[];
}
export const CreateEndpointGroupRequest = S.suspend(() =>
  S.Struct({
    ListenerArn: S.String,
    EndpointGroupRegion: S.String,
    EndpointConfigurations: S.optional(EndpointConfigurations),
    TrafficDialPercentage: S.optional(S.Number),
    HealthCheckPort: S.optional(S.Number),
    HealthCheckProtocol: S.optional(HealthCheckProtocol),
    HealthCheckPath: S.optional(S.String),
    HealthCheckIntervalSeconds: S.optional(S.Number),
    ThresholdCount: S.optional(S.Number),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
    PortOverrides: S.optional(PortOverrides),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEndpointGroupRequest",
}) as any as S.Schema<CreateEndpointGroupRequest>;
export interface DeprovisionByoipCidrResponse {
  ByoipCidr?: ByoipCidr;
}
export const DeprovisionByoipCidrResponse = S.suspend(() =>
  S.Struct({ ByoipCidr: S.optional(ByoipCidr) }),
).annotations({
  identifier: "DeprovisionByoipCidrResponse",
}) as any as S.Schema<DeprovisionByoipCidrResponse>;
export interface DescribeCustomRoutingAcceleratorResponse {
  Accelerator?: CustomRoutingAccelerator;
}
export const DescribeCustomRoutingAcceleratorResponse = S.suspend(() =>
  S.Struct({ Accelerator: S.optional(CustomRoutingAccelerator) }),
).annotations({
  identifier: "DescribeCustomRoutingAcceleratorResponse",
}) as any as S.Schema<DescribeCustomRoutingAcceleratorResponse>;
export interface DescribeListenerResponse {
  Listener?: Listener;
}
export const DescribeListenerResponse = S.suspend(() =>
  S.Struct({ Listener: S.optional(Listener) }),
).annotations({
  identifier: "DescribeListenerResponse",
}) as any as S.Schema<DescribeListenerResponse>;
export interface ListAcceleratorsResponse {
  Accelerators?: Accelerator[];
  NextToken?: string;
}
export const ListAcceleratorsResponse = S.suspend(() =>
  S.Struct({
    Accelerators: S.optional(Accelerators),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAcceleratorsResponse",
}) as any as S.Schema<ListAcceleratorsResponse>;
export interface ListByoipCidrsResponse {
  ByoipCidrs?: ByoipCidr[];
  NextToken?: string;
}
export const ListByoipCidrsResponse = S.suspend(() =>
  S.Struct({
    ByoipCidrs: S.optional(ByoipCidrs),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListByoipCidrsResponse",
}) as any as S.Schema<ListByoipCidrsResponse>;
export interface ListCrossAccountAttachmentsResponse {
  CrossAccountAttachments?: Attachment[];
  NextToken?: string;
}
export const ListCrossAccountAttachmentsResponse = S.suspend(() =>
  S.Struct({
    CrossAccountAttachments: S.optional(Attachments),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCrossAccountAttachmentsResponse",
}) as any as S.Schema<ListCrossAccountAttachmentsResponse>;
export interface ListCustomRoutingAcceleratorsResponse {
  Accelerators?: CustomRoutingAccelerator[];
  NextToken?: string;
}
export const ListCustomRoutingAcceleratorsResponse = S.suspend(() =>
  S.Struct({
    Accelerators: S.optional(CustomRoutingAccelerators),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomRoutingAcceleratorsResponse",
}) as any as S.Schema<ListCustomRoutingAcceleratorsResponse>;
export interface ListCustomRoutingEndpointGroupsResponse {
  EndpointGroups?: CustomRoutingEndpointGroup[];
  NextToken?: string;
}
export const ListCustomRoutingEndpointGroupsResponse = S.suspend(() =>
  S.Struct({
    EndpointGroups: S.optional(CustomRoutingEndpointGroups),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomRoutingEndpointGroupsResponse",
}) as any as S.Schema<ListCustomRoutingEndpointGroupsResponse>;
export interface ListCustomRoutingListenersResponse {
  Listeners?: CustomRoutingListener[];
  NextToken?: string;
}
export const ListCustomRoutingListenersResponse = S.suspend(() =>
  S.Struct({
    Listeners: S.optional(CustomRoutingListeners),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomRoutingListenersResponse",
}) as any as S.Schema<ListCustomRoutingListenersResponse>;
export interface ListEndpointGroupsResponse {
  EndpointGroups?: EndpointGroup[];
  NextToken?: string;
}
export const ListEndpointGroupsResponse = S.suspend(() =>
  S.Struct({
    EndpointGroups: S.optional(EndpointGroups),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEndpointGroupsResponse",
}) as any as S.Schema<ListEndpointGroupsResponse>;
export interface ListListenersResponse {
  Listeners?: Listener[];
  NextToken?: string;
}
export const ListListenersResponse = S.suspend(() =>
  S.Struct({
    Listeners: S.optional(Listeners),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListListenersResponse",
}) as any as S.Schema<ListListenersResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ProvisionByoipCidrRequest {
  Cidr: string;
  CidrAuthorizationContext: CidrAuthorizationContext;
}
export const ProvisionByoipCidrRequest = S.suspend(() =>
  S.Struct({
    Cidr: S.String,
    CidrAuthorizationContext: CidrAuthorizationContext,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ProvisionByoipCidrRequest",
}) as any as S.Schema<ProvisionByoipCidrRequest>;
export interface RemoveEndpointsRequest {
  EndpointIdentifiers: EndpointIdentifier[];
  EndpointGroupArn: string;
}
export const RemoveEndpointsRequest = S.suspend(() =>
  S.Struct({
    EndpointIdentifiers: EndpointIdentifiers,
    EndpointGroupArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RemoveEndpointsRequest",
}) as any as S.Schema<RemoveEndpointsRequest>;
export interface RemoveEndpointsResponse {}
export const RemoveEndpointsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveEndpointsResponse",
}) as any as S.Schema<RemoveEndpointsResponse>;
export interface UpdateAcceleratorResponse {
  Accelerator?: Accelerator;
}
export const UpdateAcceleratorResponse = S.suspend(() =>
  S.Struct({ Accelerator: S.optional(Accelerator) }),
).annotations({
  identifier: "UpdateAcceleratorResponse",
}) as any as S.Schema<UpdateAcceleratorResponse>;
export interface AcceleratorAttributes {
  FlowLogsEnabled?: boolean;
  FlowLogsS3Bucket?: string;
  FlowLogsS3Prefix?: string;
}
export const AcceleratorAttributes = S.suspend(() =>
  S.Struct({
    FlowLogsEnabled: S.optional(S.Boolean),
    FlowLogsS3Bucket: S.optional(S.String),
    FlowLogsS3Prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "AcceleratorAttributes",
}) as any as S.Schema<AcceleratorAttributes>;
export interface UpdateAcceleratorAttributesResponse {
  AcceleratorAttributes?: AcceleratorAttributes;
}
export const UpdateAcceleratorAttributesResponse = S.suspend(() =>
  S.Struct({ AcceleratorAttributes: S.optional(AcceleratorAttributes) }),
).annotations({
  identifier: "UpdateAcceleratorAttributesResponse",
}) as any as S.Schema<UpdateAcceleratorAttributesResponse>;
export interface UpdateCrossAccountAttachmentResponse {
  CrossAccountAttachment?: Attachment;
}
export const UpdateCrossAccountAttachmentResponse = S.suspend(() =>
  S.Struct({ CrossAccountAttachment: S.optional(Attachment) }),
).annotations({
  identifier: "UpdateCrossAccountAttachmentResponse",
}) as any as S.Schema<UpdateCrossAccountAttachmentResponse>;
export interface UpdateCustomRoutingAcceleratorResponse {
  Accelerator?: CustomRoutingAccelerator;
}
export const UpdateCustomRoutingAcceleratorResponse = S.suspend(() =>
  S.Struct({ Accelerator: S.optional(CustomRoutingAccelerator) }),
).annotations({
  identifier: "UpdateCustomRoutingAcceleratorResponse",
}) as any as S.Schema<UpdateCustomRoutingAcceleratorResponse>;
export interface CustomRoutingAcceleratorAttributes {
  FlowLogsEnabled?: boolean;
  FlowLogsS3Bucket?: string;
  FlowLogsS3Prefix?: string;
}
export const CustomRoutingAcceleratorAttributes = S.suspend(() =>
  S.Struct({
    FlowLogsEnabled: S.optional(S.Boolean),
    FlowLogsS3Bucket: S.optional(S.String),
    FlowLogsS3Prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomRoutingAcceleratorAttributes",
}) as any as S.Schema<CustomRoutingAcceleratorAttributes>;
export interface UpdateCustomRoutingAcceleratorAttributesResponse {
  AcceleratorAttributes?: CustomRoutingAcceleratorAttributes;
}
export const UpdateCustomRoutingAcceleratorAttributesResponse = S.suspend(() =>
  S.Struct({
    AcceleratorAttributes: S.optional(CustomRoutingAcceleratorAttributes),
  }),
).annotations({
  identifier: "UpdateCustomRoutingAcceleratorAttributesResponse",
}) as any as S.Schema<UpdateCustomRoutingAcceleratorAttributesResponse>;
export interface UpdateCustomRoutingListenerResponse {
  Listener?: CustomRoutingListener;
}
export const UpdateCustomRoutingListenerResponse = S.suspend(() =>
  S.Struct({ Listener: S.optional(CustomRoutingListener) }),
).annotations({
  identifier: "UpdateCustomRoutingListenerResponse",
}) as any as S.Schema<UpdateCustomRoutingListenerResponse>;
export interface UpdateEndpointGroupResponse {
  EndpointGroup?: EndpointGroup;
}
export const UpdateEndpointGroupResponse = S.suspend(() =>
  S.Struct({ EndpointGroup: S.optional(EndpointGroup) }),
).annotations({
  identifier: "UpdateEndpointGroupResponse",
}) as any as S.Schema<UpdateEndpointGroupResponse>;
export interface UpdateListenerResponse {
  Listener?: Listener;
}
export const UpdateListenerResponse = S.suspend(() =>
  S.Struct({ Listener: S.optional(Listener) }),
).annotations({
  identifier: "UpdateListenerResponse",
}) as any as S.Schema<UpdateListenerResponse>;
export interface WithdrawByoipCidrResponse {
  ByoipCidr?: ByoipCidr;
}
export const WithdrawByoipCidrResponse = S.suspend(() =>
  S.Struct({ ByoipCidr: S.optional(ByoipCidr) }),
).annotations({
  identifier: "WithdrawByoipCidrResponse",
}) as any as S.Schema<WithdrawByoipCidrResponse>;
export type CustomRoutingDestinationTrafficState = "ALLOW" | "DENY";
export const CustomRoutingDestinationTrafficState = S.Literal("ALLOW", "DENY");
export interface SocketAddress {
  IpAddress?: string;
  Port?: number;
}
export const SocketAddress = S.suspend(() =>
  S.Struct({ IpAddress: S.optional(S.String), Port: S.optional(S.Number) }),
).annotations({
  identifier: "SocketAddress",
}) as any as S.Schema<SocketAddress>;
export type SocketAddresses = SocketAddress[];
export const SocketAddresses = S.Array(SocketAddress);
export interface CrossAccountResource {
  EndpointId?: string;
  Cidr?: string;
  AttachmentArn?: string;
}
export const CrossAccountResource = S.suspend(() =>
  S.Struct({
    EndpointId: S.optional(S.String),
    Cidr: S.optional(S.String),
    AttachmentArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CrossAccountResource",
}) as any as S.Schema<CrossAccountResource>;
export type CrossAccountResources = CrossAccountResource[];
export const CrossAccountResources = S.Array(CrossAccountResource);
export interface DestinationPortMapping {
  AcceleratorArn?: string;
  AcceleratorSocketAddresses?: SocketAddress[];
  EndpointGroupArn?: string;
  EndpointId?: string;
  EndpointGroupRegion?: string;
  DestinationSocketAddress?: SocketAddress;
  IpAddressType?: IpAddressType;
  DestinationTrafficState?: CustomRoutingDestinationTrafficState;
}
export const DestinationPortMapping = S.suspend(() =>
  S.Struct({
    AcceleratorArn: S.optional(S.String),
    AcceleratorSocketAddresses: S.optional(SocketAddresses),
    EndpointGroupArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    EndpointGroupRegion: S.optional(S.String),
    DestinationSocketAddress: S.optional(SocketAddress),
    IpAddressType: S.optional(IpAddressType),
    DestinationTrafficState: S.optional(CustomRoutingDestinationTrafficState),
  }),
).annotations({
  identifier: "DestinationPortMapping",
}) as any as S.Schema<DestinationPortMapping>;
export type DestinationPortMappings = DestinationPortMapping[];
export const DestinationPortMappings = S.Array(DestinationPortMapping);
export interface AddCustomRoutingEndpointsResponse {
  EndpointDescriptions?: CustomRoutingEndpointDescription[];
  EndpointGroupArn?: string;
}
export const AddCustomRoutingEndpointsResponse = S.suspend(() =>
  S.Struct({
    EndpointDescriptions: S.optional(CustomRoutingEndpointDescriptions),
    EndpointGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AddCustomRoutingEndpointsResponse",
}) as any as S.Schema<AddCustomRoutingEndpointsResponse>;
export interface AddEndpointsResponse {
  EndpointDescriptions?: EndpointDescription[];
  EndpointGroupArn?: string;
}
export const AddEndpointsResponse = S.suspend(() =>
  S.Struct({
    EndpointDescriptions: S.optional(EndpointDescriptions),
    EndpointGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AddEndpointsResponse",
}) as any as S.Schema<AddEndpointsResponse>;
export interface CreateAcceleratorResponse {
  Accelerator?: Accelerator;
}
export const CreateAcceleratorResponse = S.suspend(() =>
  S.Struct({ Accelerator: S.optional(Accelerator) }),
).annotations({
  identifier: "CreateAcceleratorResponse",
}) as any as S.Schema<CreateAcceleratorResponse>;
export interface CreateCrossAccountAttachmentResponse {
  CrossAccountAttachment?: Attachment;
}
export const CreateCrossAccountAttachmentResponse = S.suspend(() =>
  S.Struct({ CrossAccountAttachment: S.optional(Attachment) }),
).annotations({
  identifier: "CreateCrossAccountAttachmentResponse",
}) as any as S.Schema<CreateCrossAccountAttachmentResponse>;
export interface CreateCustomRoutingEndpointGroupResponse {
  EndpointGroup?: CustomRoutingEndpointGroup;
}
export const CreateCustomRoutingEndpointGroupResponse = S.suspend(() =>
  S.Struct({ EndpointGroup: S.optional(CustomRoutingEndpointGroup) }),
).annotations({
  identifier: "CreateCustomRoutingEndpointGroupResponse",
}) as any as S.Schema<CreateCustomRoutingEndpointGroupResponse>;
export interface CreateCustomRoutingListenerResponse {
  Listener?: CustomRoutingListener;
}
export const CreateCustomRoutingListenerResponse = S.suspend(() =>
  S.Struct({ Listener: S.optional(CustomRoutingListener) }),
).annotations({
  identifier: "CreateCustomRoutingListenerResponse",
}) as any as S.Schema<CreateCustomRoutingListenerResponse>;
export interface CreateEndpointGroupResponse {
  EndpointGroup?: EndpointGroup;
}
export const CreateEndpointGroupResponse = S.suspend(() =>
  S.Struct({ EndpointGroup: S.optional(EndpointGroup) }),
).annotations({
  identifier: "CreateEndpointGroupResponse",
}) as any as S.Schema<CreateEndpointGroupResponse>;
export interface CreateListenerResponse {
  Listener?: Listener;
}
export const CreateListenerResponse = S.suspend(() =>
  S.Struct({ Listener: S.optional(Listener) }),
).annotations({
  identifier: "CreateListenerResponse",
}) as any as S.Schema<CreateListenerResponse>;
export interface DescribeAcceleratorAttributesResponse {
  AcceleratorAttributes?: AcceleratorAttributes;
}
export const DescribeAcceleratorAttributesResponse = S.suspend(() =>
  S.Struct({ AcceleratorAttributes: S.optional(AcceleratorAttributes) }),
).annotations({
  identifier: "DescribeAcceleratorAttributesResponse",
}) as any as S.Schema<DescribeAcceleratorAttributesResponse>;
export interface DescribeCrossAccountAttachmentResponse {
  CrossAccountAttachment?: Attachment;
}
export const DescribeCrossAccountAttachmentResponse = S.suspend(() =>
  S.Struct({ CrossAccountAttachment: S.optional(Attachment) }),
).annotations({
  identifier: "DescribeCrossAccountAttachmentResponse",
}) as any as S.Schema<DescribeCrossAccountAttachmentResponse>;
export interface DescribeCustomRoutingAcceleratorAttributesResponse {
  AcceleratorAttributes?: CustomRoutingAcceleratorAttributes;
}
export const DescribeCustomRoutingAcceleratorAttributesResponse = S.suspend(
  () =>
    S.Struct({
      AcceleratorAttributes: S.optional(CustomRoutingAcceleratorAttributes),
    }),
).annotations({
  identifier: "DescribeCustomRoutingAcceleratorAttributesResponse",
}) as any as S.Schema<DescribeCustomRoutingAcceleratorAttributesResponse>;
export interface DescribeCustomRoutingListenerResponse {
  Listener?: CustomRoutingListener;
}
export const DescribeCustomRoutingListenerResponse = S.suspend(() =>
  S.Struct({ Listener: S.optional(CustomRoutingListener) }),
).annotations({
  identifier: "DescribeCustomRoutingListenerResponse",
}) as any as S.Schema<DescribeCustomRoutingListenerResponse>;
export interface ListCrossAccountResourcesResponse {
  CrossAccountResources?: CrossAccountResource[];
  NextToken?: string;
}
export const ListCrossAccountResourcesResponse = S.suspend(() =>
  S.Struct({
    CrossAccountResources: S.optional(CrossAccountResources),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCrossAccountResourcesResponse",
}) as any as S.Schema<ListCrossAccountResourcesResponse>;
export interface ListCustomRoutingPortMappingsByDestinationResponse {
  DestinationPortMappings?: DestinationPortMapping[];
  NextToken?: string;
}
export const ListCustomRoutingPortMappingsByDestinationResponse = S.suspend(
  () =>
    S.Struct({
      DestinationPortMappings: S.optional(DestinationPortMappings),
      NextToken: S.optional(S.String),
    }),
).annotations({
  identifier: "ListCustomRoutingPortMappingsByDestinationResponse",
}) as any as S.Schema<ListCustomRoutingPortMappingsByDestinationResponse>;
export interface ProvisionByoipCidrResponse {
  ByoipCidr?: ByoipCidr;
}
export const ProvisionByoipCidrResponse = S.suspend(() =>
  S.Struct({ ByoipCidr: S.optional(ByoipCidr) }),
).annotations({
  identifier: "ProvisionByoipCidrResponse",
}) as any as S.Schema<ProvisionByoipCidrResponse>;
export interface PortMapping {
  AcceleratorPort?: number;
  EndpointGroupArn?: string;
  EndpointId?: string;
  DestinationSocketAddress?: SocketAddress;
  Protocols?: CustomRoutingProtocol[];
  DestinationTrafficState?: CustomRoutingDestinationTrafficState;
}
export const PortMapping = S.suspend(() =>
  S.Struct({
    AcceleratorPort: S.optional(S.Number),
    EndpointGroupArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    DestinationSocketAddress: S.optional(SocketAddress),
    Protocols: S.optional(CustomRoutingProtocols),
    DestinationTrafficState: S.optional(CustomRoutingDestinationTrafficState),
  }),
).annotations({ identifier: "PortMapping" }) as any as S.Schema<PortMapping>;
export type PortMappings = PortMapping[];
export const PortMappings = S.Array(PortMapping);
export interface AdvertiseByoipCidrResponse {
  ByoipCidr?: ByoipCidr;
}
export const AdvertiseByoipCidrResponse = S.suspend(() =>
  S.Struct({ ByoipCidr: S.optional(ByoipCidr) }),
).annotations({
  identifier: "AdvertiseByoipCidrResponse",
}) as any as S.Schema<AdvertiseByoipCidrResponse>;
export interface CreateCustomRoutingAcceleratorResponse {
  Accelerator?: CustomRoutingAccelerator;
}
export const CreateCustomRoutingAcceleratorResponse = S.suspend(() =>
  S.Struct({ Accelerator: S.optional(CustomRoutingAccelerator) }),
).annotations({
  identifier: "CreateCustomRoutingAcceleratorResponse",
}) as any as S.Schema<CreateCustomRoutingAcceleratorResponse>;
export interface DescribeAcceleratorResponse {
  Accelerator?: Accelerator;
}
export const DescribeAcceleratorResponse = S.suspend(() =>
  S.Struct({ Accelerator: S.optional(Accelerator) }),
).annotations({
  identifier: "DescribeAcceleratorResponse",
}) as any as S.Schema<DescribeAcceleratorResponse>;
export interface DescribeCustomRoutingEndpointGroupResponse {
  EndpointGroup?: CustomRoutingEndpointGroup;
}
export const DescribeCustomRoutingEndpointGroupResponse = S.suspend(() =>
  S.Struct({ EndpointGroup: S.optional(CustomRoutingEndpointGroup) }),
).annotations({
  identifier: "DescribeCustomRoutingEndpointGroupResponse",
}) as any as S.Schema<DescribeCustomRoutingEndpointGroupResponse>;
export interface DescribeEndpointGroupResponse {
  EndpointGroup?: EndpointGroup;
}
export const DescribeEndpointGroupResponse = S.suspend(() =>
  S.Struct({ EndpointGroup: S.optional(EndpointGroup) }),
).annotations({
  identifier: "DescribeEndpointGroupResponse",
}) as any as S.Schema<DescribeEndpointGroupResponse>;
export interface ListCustomRoutingPortMappingsResponse {
  PortMappings?: PortMapping[];
  NextToken?: string;
}
export const ListCustomRoutingPortMappingsResponse = S.suspend(() =>
  S.Struct({
    PortMappings: S.optional(PortMappings),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomRoutingPortMappingsResponse",
}) as any as S.Schema<ListCustomRoutingPortMappingsResponse>;

//# Errors
export class EndpointGroupNotFoundException extends S.TaggedError<EndpointGroupNotFoundException>()(
  "EndpointGroupNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AcceleratorNotDisabledException extends S.TaggedError<AcceleratorNotDisabledException>()(
  "AcceleratorNotDisabledException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class AssociatedEndpointGroupFoundException extends S.TaggedError<AssociatedEndpointGroupFoundException>()(
  "AssociatedEndpointGroupFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AcceleratorNotFoundException extends S.TaggedError<AcceleratorNotFoundException>()(
  "AcceleratorNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class AttachmentNotFoundException extends S.TaggedError<AttachmentNotFoundException>()(
  "AttachmentNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ByoipCidrNotFoundException extends S.TaggedError<ByoipCidrNotFoundException>()(
  "ByoipCidrNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class AssociatedListenerFoundException extends S.TaggedError<AssociatedListenerFoundException>()(
  "AssociatedListenerFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EndpointGroupAlreadyExistsException extends S.TaggedError<EndpointGroupAlreadyExistsException>()(
  "EndpointGroupAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IncorrectCidrStateException extends S.TaggedError<IncorrectCidrStateException>()(
  "IncorrectCidrStateException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EndpointNotFoundException extends S.TaggedError<EndpointNotFoundException>()(
  "EndpointNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EndpointAlreadyExistsException extends S.TaggedError<EndpointAlreadyExistsException>()(
  "EndpointAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InvalidPortRangeException extends S.TaggedError<InvalidPortRangeException>()(
  "InvalidPortRangeException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TransactionInProgressException extends S.TaggedError<TransactionInProgressException>()(
  "TransactionInProgressException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ListenerNotFoundException extends S.TaggedError<ListenerNotFoundException>()(
  "ListenerNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * List the accounts that have cross-account resources.
 *
 * For more information, see
 * Working with cross-account attachments and resources in Global Accelerator in the
 * Global Accelerator Developer Guide.
 */
export const listCrossAccountResourceAccounts: (
  input: ListCrossAccountResourceAccountsRequest,
) => effect.Effect<
  ListCrossAccountResourceAccountsResponse,
  AccessDeniedException | InternalServiceErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCrossAccountResourceAccountsRequest,
  output: ListCrossAccountResourceAccountsResponse,
  errors: [AccessDeniedException, InternalServiceErrorException],
}));
/**
 * Specify the Amazon EC2 instance (destination) IP addresses and ports for a VPC subnet endpoint that can receive traffic
 * for a custom routing accelerator. You can allow traffic to all destinations in the subnet endpoint, or allow traffic to a
 * specified list of destination IP addresses and ports in the subnet. Note that you cannot specify IP addresses or ports
 * outside of the range that you configured for the endpoint group.
 *
 * After you make changes, you can verify that the updates are complete by checking the status of your
 * accelerator: the status changes from IN_PROGRESS to DEPLOYED.
 */
export const allowCustomRoutingTraffic: (
  input: AllowCustomRoutingTrafficRequest,
) => effect.Effect<
  AllowCustomRoutingTrafficResponse,
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AllowCustomRoutingTrafficRequest,
  output: AllowCustomRoutingTrafficResponse,
  errors: [
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Releases the specified address range that you provisioned to use with your Amazon Web Services resources
 * through bring your own IP addresses (BYOIP) and deletes the corresponding address pool.
 *
 * Before you can release an address range, you must stop advertising it by using WithdrawByoipCidr and you must not have
 * any accelerators that are using static IP addresses allocated from its address range.
 *
 * For more information, see Bring
 * your own IP addresses (BYOIP) in the *Global Accelerator Developer Guide*.
 */
export const deprovisionByoipCidr: (
  input: DeprovisionByoipCidrRequest,
) => effect.Effect<
  DeprovisionByoipCidrResponse,
  | AccessDeniedException
  | ByoipCidrNotFoundException
  | IncorrectCidrStateException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeprovisionByoipCidrRequest,
  output: DeprovisionByoipCidrResponse,
  errors: [
    AccessDeniedException,
    ByoipCidrNotFoundException,
    IncorrectCidrStateException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Describe an accelerator.
 */
export const describeAccelerator: (
  input: DescribeAcceleratorRequest,
) => effect.Effect<
  DescribeAcceleratorResponse,
  | AcceleratorNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAcceleratorRequest,
  output: DescribeAcceleratorResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Describe an endpoint group for a custom routing accelerator.
 */
export const describeCustomRoutingEndpointGroup: (
  input: DescribeCustomRoutingEndpointGroupRequest,
) => effect.Effect<
  DescribeCustomRoutingEndpointGroupResponse,
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCustomRoutingEndpointGroupRequest,
  output: DescribeCustomRoutingEndpointGroupResponse,
  errors: [
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Describe an endpoint group.
 */
export const describeEndpointGroup: (
  input: DescribeEndpointGroupRequest,
) => effect.Effect<
  DescribeEndpointGroupResponse,
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointGroupRequest,
  output: DescribeEndpointGroupResponse,
  errors: [
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Describe the attributes of an accelerator.
 */
export const describeAcceleratorAttributes: (
  input: DescribeAcceleratorAttributesRequest,
) => effect.Effect<
  DescribeAcceleratorAttributesResponse,
  | AcceleratorNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAcceleratorAttributesRequest,
  output: DescribeAcceleratorAttributesResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Gets configuration information about a cross-account attachment.
 */
export const describeCrossAccountAttachment: (
  input: DescribeCrossAccountAttachmentRequest,
) => effect.Effect<
  DescribeCrossAccountAttachmentResponse,
  | AccessDeniedException
  | AttachmentNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCrossAccountAttachmentRequest,
  output: DescribeCrossAccountAttachmentResponse,
  errors: [
    AccessDeniedException,
    AttachmentNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Describe the attributes of a custom routing accelerator.
 */
export const describeCustomRoutingAcceleratorAttributes: (
  input: DescribeCustomRoutingAcceleratorAttributesRequest,
) => effect.Effect<
  DescribeCustomRoutingAcceleratorAttributesResponse,
  | AcceleratorNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCustomRoutingAcceleratorAttributesRequest,
  output: DescribeCustomRoutingAcceleratorAttributesResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Add tags to an accelerator resource.
 *
 * For more information, see Tagging
 * in Global Accelerator in the *Global Accelerator Developer Guide*.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AcceleratorNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Delete an endpoint group from a listener for a custom routing accelerator.
 */
export const deleteCustomRoutingEndpointGroup: (
  input: DeleteCustomRoutingEndpointGroupRequest,
) => effect.Effect<
  DeleteCustomRoutingEndpointGroupResponse,
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomRoutingEndpointGroupRequest,
  output: DeleteCustomRoutingEndpointGroupResponse,
  errors: [
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Delete an endpoint group from a listener.
 */
export const deleteEndpointGroup: (
  input: DeleteEndpointGroupRequest,
) => effect.Effect<
  DeleteEndpointGroupResponse,
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointGroupRequest,
  output: DeleteEndpointGroupResponse,
  errors: [
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Specify the Amazon EC2 instance (destination) IP addresses and ports for a VPC subnet endpoint that cannot receive traffic
 * for a custom routing accelerator. You can deny traffic to all destinations in the VPC endpoint, or deny traffic to a
 * specified list of destination IP addresses and ports. Note that you cannot specify IP addresses
 * or ports outside of the range that you configured for the endpoint group.
 *
 * After you make changes, you can verify that the updates are complete by checking the status of your
 * accelerator: the status changes from IN_PROGRESS to DEPLOYED.
 */
export const denyCustomRoutingTraffic: (
  input: DenyCustomRoutingTrafficRequest,
) => effect.Effect<
  DenyCustomRoutingTrafficResponse,
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DenyCustomRoutingTrafficRequest,
  output: DenyCustomRoutingTrafficResponse,
  errors: [
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Remove tags from a Global Accelerator resource. When you specify a tag key, the action removes both that key and its associated value.
 * The operation succeeds even if you attempt to remove tags from an accelerator that was already removed.
 *
 * For more information, see Tagging
 * in Global Accelerator in the *Global Accelerator Developer Guide*.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AcceleratorNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Describe a custom routing accelerator.
 */
export const describeCustomRoutingAccelerator: (
  input: DescribeCustomRoutingAcceleratorRequest,
) => effect.Effect<
  DescribeCustomRoutingAcceleratorResponse,
  | AcceleratorNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCustomRoutingAcceleratorRequest,
  output: DescribeCustomRoutingAcceleratorResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Stops advertising an address range that is provisioned as an address pool.
 * You can perform this operation at most once every 10 seconds, even if you specify different address
 * ranges each time.
 *
 * It can take a few minutes before traffic to the specified addresses stops routing to Amazon Web Services because of
 * propagation delays.
 *
 * For more information, see Bring your own
 * IP addresses (BYOIP) in the *Global Accelerator Developer Guide*.
 */
export const withdrawByoipCidr: (
  input: WithdrawByoipCidrRequest,
) => effect.Effect<
  WithdrawByoipCidrResponse,
  | AccessDeniedException
  | ByoipCidrNotFoundException
  | IncorrectCidrStateException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: WithdrawByoipCidrRequest,
  output: WithdrawByoipCidrResponse,
  errors: [
    AccessDeniedException,
    ByoipCidrNotFoundException,
    IncorrectCidrStateException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Advertises an IPv4 address range that is provisioned for use with your Amazon Web Services resources
 * through bring your own IP addresses (BYOIP). It can take a few minutes before traffic to
 * the specified addresses starts routing to Amazon Web Services because of propagation delays.
 *
 * To stop advertising the BYOIP address range, use
 * WithdrawByoipCidr.
 *
 * For more information, see Bring your own
 * IP addresses (BYOIP) in the *Global Accelerator Developer Guide*.
 */
export const advertiseByoipCidr: (
  input: AdvertiseByoipCidrRequest,
) => effect.Effect<
  AdvertiseByoipCidrResponse,
  | AccessDeniedException
  | ByoipCidrNotFoundException
  | IncorrectCidrStateException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdvertiseByoipCidrRequest,
  output: AdvertiseByoipCidrResponse,
  errors: [
    AccessDeniedException,
    ByoipCidrNotFoundException,
    IncorrectCidrStateException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Remove endpoints from a custom routing accelerator.
 */
export const removeCustomRoutingEndpoints: (
  input: RemoveCustomRoutingEndpointsRequest,
) => effect.Effect<
  RemoveCustomRoutingEndpointsResponse,
  | AccessDeniedException
  | ConflictException
  | EndpointGroupNotFoundException
  | EndpointNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveCustomRoutingEndpointsRequest,
  output: RemoveCustomRoutingEndpointsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    EndpointGroupNotFoundException,
    EndpointNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
  ],
}));
/**
 * Provides a complete mapping from the public accelerator IP address and port to destination EC2 instance
 * IP addresses and ports in the virtual public cloud (VPC) subnet endpoint for a custom routing accelerator.
 * For each subnet endpoint that you add, Global Accelerator creates a new static port mapping for the accelerator. The port
 * mappings don't change after Global Accelerator generates them, so you can retrieve and cache the full mapping on your servers.
 *
 * If you remove a subnet from your accelerator, Global Accelerator removes (reclaims) the port mappings. If you add a subnet to
 * your accelerator, Global Accelerator creates new port mappings (the existing ones don't change). If you add or remove EC2 instances
 * in your subnet, the port mappings don't change, because the mappings are created when you add the subnet to Global Accelerator.
 *
 * The mappings also include a flag for each destination denoting which destination IP addresses and
 * ports are allowed or denied traffic.
 */
export const listCustomRoutingPortMappings: {
  (
    input: ListCustomRoutingPortMappingsRequest,
  ): effect.Effect<
    ListCustomRoutingPortMappingsResponse,
    | AcceleratorNotFoundException
    | EndpointGroupNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomRoutingPortMappingsRequest,
  ) => stream.Stream<
    ListCustomRoutingPortMappingsResponse,
    | AcceleratorNotFoundException
    | EndpointGroupNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomRoutingPortMappingsRequest,
  ) => stream.Stream<
    PortMapping,
    | AcceleratorNotFoundException
    | EndpointGroupNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomRoutingPortMappingsRequest,
  output: ListCustomRoutingPortMappingsResponse,
  errors: [
    AcceleratorNotFoundException,
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PortMappings",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Delete a cross-account attachment. When you delete an attachment, Global Accelerator revokes the permission
 * to use the resources in the attachment from all principals in the list of principals. Global Accelerator
 * revokes the permission for specific resources.
 *
 * For more information, see
 * Working with cross-account attachments and resources in Global Accelerator in the
 * Global Accelerator Developer Guide.
 */
export const deleteCrossAccountAttachment: (
  input: DeleteCrossAccountAttachmentRequest,
) => effect.Effect<
  DeleteCrossAccountAttachmentResponse,
  | AccessDeniedException
  | AttachmentNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCrossAccountAttachmentRequest,
  output: DeleteCrossAccountAttachmentResponse,
  errors: [
    AccessDeniedException,
    AttachmentNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    TransactionInProgressException,
  ],
}));
/**
 * The description of a listener for a custom routing accelerator.
 */
export const describeCustomRoutingListener: (
  input: DescribeCustomRoutingListenerRequest,
) => effect.Effect<
  DescribeCustomRoutingListenerResponse,
  | InternalServiceErrorException
  | InvalidArgumentException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCustomRoutingListenerRequest,
  output: DescribeCustomRoutingListenerResponse,
  errors: [
    InternalServiceErrorException,
    InvalidArgumentException,
    ListenerNotFoundException,
  ],
}));
/**
 * Create an accelerator. An accelerator includes one or more listeners that process inbound connections and direct traffic
 * to one or more endpoint groups, each of which includes endpoints, such as Network Load Balancers.
 *
 * Global Accelerator is a global service that supports endpoints in multiple Amazon Web Services Regions but you must specify the
 * US West (Oregon) Region to create, update, or otherwise work with accelerators. That is, for example, specify `--region us-west-2`
 * on Amazon Web Services CLI commands.
 */
export const createAccelerator: (
  input: CreateAcceleratorRequest,
) => effect.Effect<
  CreateAcceleratorResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidArgumentException
  | LimitExceededException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAcceleratorRequest,
  output: CreateAcceleratorResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidArgumentException,
    LimitExceededException,
    TransactionInProgressException,
  ],
}));
/**
 * Create a cross-account attachment in Global Accelerator. You create a cross-account attachment to
 * specify the *principals* who have permission to work with *resources*
 * in accelerators in their own account. You specify, in the same attachment, the resources that are shared.
 *
 * A principal can be an Amazon Web Services account number or the Amazon Resource Name (ARN) for an
 * accelerator. For account numbers that are listed as principals, to work with a resource listed in the attachment,
 * you must sign in to an account specified as a principal. Then, you can work with resources that are listed,
 * with any of your accelerators. If an accelerator ARN is listed in the cross-account attachment as a principal,
 * anyone with permission to make updates to the accelerator can work with resources that are listed in the
 * attachment.
 *
 * Specify each principal and resource separately. To specify two CIDR address pools, list
 * them individually under `Resources`, and so on. For a command line operation, for example,
 * you might use a statement like the following:
 *
 * ` "Resources": [{"Cidr": "169.254.60.0/24"},{"Cidr": "169.254.59.0/24"}]`
 *
 * For more information, see
 * Working with cross-account attachments and resources in Global Accelerator in the
 * Global Accelerator Developer Guide.
 */
export const createCrossAccountAttachment: (
  input: CreateCrossAccountAttachmentRequest,
) => effect.Effect<
  CreateCrossAccountAttachmentResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidArgumentException
  | LimitExceededException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCrossAccountAttachmentRequest,
  output: CreateCrossAccountAttachmentResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidArgumentException,
    LimitExceededException,
    TransactionInProgressException,
  ],
}));
/**
 * Update an endpoint group. A resource must be valid and active when you add it as an endpoint.
 */
export const updateEndpointGroup: (
  input: UpdateEndpointGroupRequest,
) => effect.Effect<
  UpdateEndpointGroupResponse,
  | AccessDeniedException
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEndpointGroupRequest,
  output: UpdateEndpointGroupResponse,
  errors: [
    AccessDeniedException,
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    LimitExceededException,
  ],
}));
/**
 * Add endpoints to an endpoint group. The `AddEndpoints` API operation is the recommended option for adding endpoints. The
 * alternative options are to add endpoints when you create an endpoint group (with the
 * CreateEndpointGroup API)
 * or when you update an endpoint group (with the
 * UpdateEndpointGroup API).
 *
 * There are two advantages to using `AddEndpoints` to add endpoints in Global Accelerator:
 *
 * - It's faster, because Global Accelerator only has to resolve the new endpoints that
 * you're adding, rather than resolving new and existing endpoints.
 *
 * - It's more convenient, because you don't need to specify the current
 * endpoints that are already in the endpoint group, in addition to the new endpoints that
 * you want to add.
 *
 * For information about endpoint types and requirements for endpoints that you can add
 * to Global Accelerator, see
 * Endpoints for standard accelerators in the *Global Accelerator Developer Guide*.
 */
export const addEndpoints: (
  input: AddEndpointsRequest,
) => effect.Effect<
  AddEndpointsResponse,
  | AccessDeniedException
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | LimitExceededException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddEndpointsRequest,
  output: AddEndpointsResponse,
  errors: [
    AccessDeniedException,
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    LimitExceededException,
    TransactionInProgressException,
  ],
}));
/**
 * Update a cross-account attachment to add or remove principals or resources. When you update
 * an attachment to remove a principal (account ID or accelerator) or a resource, Global Accelerator
 * revokes the permission for specific resources.
 *
 * For more information, see
 * Working with cross-account attachments and resources in Global Accelerator in the
 * Global Accelerator Developer Guide.
 */
export const updateCrossAccountAttachment: (
  input: UpdateCrossAccountAttachmentRequest,
) => effect.Effect<
  UpdateCrossAccountAttachmentResponse,
  | AccessDeniedException
  | AttachmentNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | LimitExceededException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCrossAccountAttachmentRequest,
  output: UpdateCrossAccountAttachmentResponse,
  errors: [
    AccessDeniedException,
    AttachmentNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    LimitExceededException,
    TransactionInProgressException,
  ],
}));
/**
 * Create an endpoint group for the specified listener. An endpoint group is a collection of endpoints in one Amazon Web Services
 * Region. A resource must be valid and active when you add it as an endpoint.
 *
 * For more information about endpoint types and requirements for endpoints that you can add
 * to Global Accelerator, see
 * Endpoints for standard accelerators in the *Global Accelerator Developer Guide*.
 */
export const createEndpointGroup: (
  input: CreateEndpointGroupRequest,
) => effect.Effect<
  CreateEndpointGroupResponse,
  | AcceleratorNotFoundException
  | AccessDeniedException
  | EndpointGroupAlreadyExistsException
  | InternalServiceErrorException
  | InvalidArgumentException
  | LimitExceededException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEndpointGroupRequest,
  output: CreateEndpointGroupResponse,
  errors: [
    AcceleratorNotFoundException,
    AccessDeniedException,
    EndpointGroupAlreadyExistsException,
    InternalServiceErrorException,
    InvalidArgumentException,
    LimitExceededException,
    ListenerNotFoundException,
  ],
}));
/**
 * Provisions an IP address range to use with your Amazon Web Services resources through bring your own IP
 * addresses (BYOIP) and creates a corresponding address pool. After the address range is provisioned,
 * it is ready to be advertised using
 * AdvertiseByoipCidr.
 *
 * For more information, see Bring your own
 * IP addresses (BYOIP) in the *Global Accelerator Developer Guide*.
 */
export const provisionByoipCidr: (
  input: ProvisionByoipCidrRequest,
) => effect.Effect<
  ProvisionByoipCidrResponse,
  | AccessDeniedException
  | IncorrectCidrStateException
  | InternalServiceErrorException
  | InvalidArgumentException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ProvisionByoipCidrRequest,
  output: ProvisionByoipCidrResponse,
  errors: [
    AccessDeniedException,
    IncorrectCidrStateException,
    InternalServiceErrorException,
    InvalidArgumentException,
    LimitExceededException,
  ],
}));
/**
 * Associate a virtual private cloud (VPC) subnet endpoint with your custom routing accelerator.
 *
 * The listener port range must be large enough to support the number of IP addresses that can be
 * specified in your subnet. The number of ports required is: subnet size times the number
 * of ports per destination EC2 instances. For example, a subnet defined as /24 requires a listener
 * port range of at least 255 ports.
 *
 * Note: You must have enough remaining listener ports available to
 * map to the subnet ports, or the call will fail with a LimitExceededException.
 *
 * By default, all destinations in a subnet in a custom routing accelerator cannot receive traffic. To enable all
 * destinations to receive traffic, or to specify individual port mappings that can receive
 * traffic, see the
 * AllowCustomRoutingTraffic operation.
 */
export const addCustomRoutingEndpoints: (
  input: AddCustomRoutingEndpointsRequest,
) => effect.Effect<
  AddCustomRoutingEndpointsResponse,
  | AccessDeniedException
  | ConflictException
  | EndpointAlreadyExistsException
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddCustomRoutingEndpointsRequest,
  output: AddCustomRoutingEndpointsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    EndpointAlreadyExistsException,
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    LimitExceededException,
  ],
}));
/**
 * Create a listener to process inbound connections from clients to a custom routing accelerator.
 * Connections arrive to assigned static IP addresses on the port range that you specify.
 */
export const createCustomRoutingListener: (
  input: CreateCustomRoutingListenerRequest,
) => effect.Effect<
  CreateCustomRoutingListenerResponse,
  | AcceleratorNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | InvalidPortRangeException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomRoutingListenerRequest,
  output: CreateCustomRoutingListenerResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidPortRangeException,
    LimitExceededException,
  ],
}));
/**
 * Create a listener to process inbound connections from clients to an accelerator. Connections arrive to assigned static
 * IP addresses on a port, port range, or list of port ranges that you specify.
 */
export const createListener: (
  input: CreateListenerRequest,
) => effect.Effect<
  CreateListenerResponse,
  | AcceleratorNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | InvalidPortRangeException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateListenerRequest,
  output: CreateListenerResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidPortRangeException,
    LimitExceededException,
  ],
}));
/**
 * Update a listener for a custom routing accelerator.
 */
export const updateCustomRoutingListener: (
  input: UpdateCustomRoutingListenerRequest,
) => effect.Effect<
  UpdateCustomRoutingListenerResponse,
  | InternalServiceErrorException
  | InvalidArgumentException
  | InvalidPortRangeException
  | LimitExceededException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomRoutingListenerRequest,
  output: UpdateCustomRoutingListenerResponse,
  errors: [
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidPortRangeException,
    LimitExceededException,
    ListenerNotFoundException,
  ],
}));
/**
 * Update a listener.
 */
export const updateListener: (
  input: UpdateListenerRequest,
) => effect.Effect<
  UpdateListenerResponse,
  | InternalServiceErrorException
  | InvalidArgumentException
  | InvalidPortRangeException
  | LimitExceededException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateListenerRequest,
  output: UpdateListenerResponse,
  errors: [
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidPortRangeException,
    LimitExceededException,
    ListenerNotFoundException,
  ],
}));
/**
 * List the port mappings for a specific EC2 instance (destination) in a VPC subnet endpoint. The
 * response is the mappings for one destination IP address. This is useful when your subnet endpoint has mappings that
 * span multiple custom routing accelerators in your account, or for scenarios where you only want to
 * list the port mappings for a specific destination instance.
 */
export const listCustomRoutingPortMappingsByDestination: {
  (
    input: ListCustomRoutingPortMappingsByDestinationRequest,
  ): effect.Effect<
    ListCustomRoutingPortMappingsByDestinationResponse,
    | EndpointNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomRoutingPortMappingsByDestinationRequest,
  ) => stream.Stream<
    ListCustomRoutingPortMappingsByDestinationResponse,
    | EndpointNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomRoutingPortMappingsByDestinationRequest,
  ) => stream.Stream<
    DestinationPortMapping,
    | EndpointNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomRoutingPortMappingsByDestinationRequest,
  output: ListCustomRoutingPortMappingsByDestinationResponse,
  errors: [
    EndpointNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DestinationPortMappings",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the cross-account resources available to work with.
 */
export const listCrossAccountResources: {
  (
    input: ListCrossAccountResourcesRequest,
  ): effect.Effect<
    ListCrossAccountResourcesResponse,
    | AcceleratorNotFoundException
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCrossAccountResourcesRequest,
  ) => stream.Stream<
    ListCrossAccountResourcesResponse,
    | AcceleratorNotFoundException
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCrossAccountResourcesRequest,
  ) => stream.Stream<
    CrossAccountResource,
    | AcceleratorNotFoundException
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCrossAccountResourcesRequest,
  output: ListCrossAccountResourcesResponse,
  errors: [
    AcceleratorNotFoundException,
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CrossAccountResources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the accelerators for an Amazon Web Services account.
 */
export const listAccelerators: {
  (
    input: ListAcceleratorsRequest,
  ): effect.Effect<
    ListAcceleratorsResponse,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAcceleratorsRequest,
  ) => stream.Stream<
    ListAcceleratorsResponse,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAcceleratorsRequest,
  ) => stream.Stream<
    Accelerator,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAcceleratorsRequest,
  output: ListAcceleratorsResponse,
  errors: [
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Accelerators",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the IP address ranges that were specified in calls to ProvisionByoipCidr, including
 * the current state and a history of state changes.
 */
export const listByoipCidrs: {
  (
    input: ListByoipCidrsRequest,
  ): effect.Effect<
    ListByoipCidrsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListByoipCidrsRequest,
  ) => stream.Stream<
    ListByoipCidrsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListByoipCidrsRequest,
  ) => stream.Stream<
    ByoipCidr,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListByoipCidrsRequest,
  output: ListByoipCidrsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ByoipCidrs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the cross-account attachments that have been created in Global Accelerator.
 */
export const listCrossAccountAttachments: {
  (
    input: ListCrossAccountAttachmentsRequest,
  ): effect.Effect<
    ListCrossAccountAttachmentsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCrossAccountAttachmentsRequest,
  ) => stream.Stream<
    ListCrossAccountAttachmentsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCrossAccountAttachmentsRequest,
  ) => stream.Stream<
    Attachment,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCrossAccountAttachmentsRequest,
  output: ListCrossAccountAttachmentsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CrossAccountAttachments",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the custom routing accelerators for an Amazon Web Services account.
 */
export const listCustomRoutingAccelerators: {
  (
    input: ListCustomRoutingAcceleratorsRequest,
  ): effect.Effect<
    ListCustomRoutingAcceleratorsResponse,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomRoutingAcceleratorsRequest,
  ) => stream.Stream<
    ListCustomRoutingAcceleratorsResponse,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomRoutingAcceleratorsRequest,
  ) => stream.Stream<
    CustomRoutingAccelerator,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomRoutingAcceleratorsRequest,
  output: ListCustomRoutingAcceleratorsResponse,
  errors: [
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Accelerators",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the endpoint groups that are associated with a listener for a custom routing accelerator.
 */
export const listCustomRoutingEndpointGroups: {
  (
    input: ListCustomRoutingEndpointGroupsRequest,
  ): effect.Effect<
    ListCustomRoutingEndpointGroupsResponse,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | ListenerNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomRoutingEndpointGroupsRequest,
  ) => stream.Stream<
    ListCustomRoutingEndpointGroupsResponse,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | ListenerNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomRoutingEndpointGroupsRequest,
  ) => stream.Stream<
    CustomRoutingEndpointGroup,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | ListenerNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomRoutingEndpointGroupsRequest,
  output: ListCustomRoutingEndpointGroupsResponse,
  errors: [
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
    ListenerNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EndpointGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the endpoint groups that are associated with a listener.
 */
export const listEndpointGroups: {
  (
    input: ListEndpointGroupsRequest,
  ): effect.Effect<
    ListEndpointGroupsResponse,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | ListenerNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEndpointGroupsRequest,
  ) => stream.Stream<
    ListEndpointGroupsResponse,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | ListenerNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEndpointGroupsRequest,
  ) => stream.Stream<
    EndpointGroup,
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | ListenerNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEndpointGroupsRequest,
  output: ListEndpointGroupsResponse,
  errors: [
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
    ListenerNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EndpointGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the listeners for a custom routing accelerator.
 */
export const listCustomRoutingListeners: {
  (
    input: ListCustomRoutingListenersRequest,
  ): effect.Effect<
    ListCustomRoutingListenersResponse,
    | AcceleratorNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomRoutingListenersRequest,
  ) => stream.Stream<
    ListCustomRoutingListenersResponse,
    | AcceleratorNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomRoutingListenersRequest,
  ) => stream.Stream<
    CustomRoutingListener,
    | AcceleratorNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomRoutingListenersRequest,
  output: ListCustomRoutingListenersResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Listeners",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the listeners for an accelerator.
 */
export const listListeners: {
  (
    input: ListListenersRequest,
  ): effect.Effect<
    ListListenersResponse,
    | AcceleratorNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListListenersRequest,
  ) => stream.Stream<
    ListListenersResponse,
    | AcceleratorNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListListenersRequest,
  ) => stream.Stream<
    Listener,
    | AcceleratorNotFoundException
    | InternalServiceErrorException
    | InvalidArgumentException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListListenersRequest,
  output: ListListenersResponse,
  errors: [
    AcceleratorNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Listeners",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Update an accelerator to make changes, such as the following:
 *
 * - Change the name of the accelerator.
 *
 * - Disable the accelerator so that it no longer accepts or routes traffic, or so that you can delete it.
 *
 * - Enable the accelerator, if it is disabled.
 *
 * - Change the IP address type to dual-stack if it is IPv4, or change the IP address type to IPv4 if it's dual-stack.
 *
 * Be aware that static IP addresses remain assigned to your accelerator for as long as it exists, even if you disable the accelerator and it no
 * longer accepts or routes traffic. However, when you delete the accelerator, you lose the static IP addresses that are assigned to it, so you
 * can no longer route traffic by using them.
 *
 * Global Accelerator is a global service that supports endpoints in multiple Amazon Web Services Regions but you must specify the
 * US West (Oregon) Region to create, update, or otherwise work with accelerators. That is, for example, specify `--region us-west-2`
 * on Amazon Web Services CLI commands.
 */
export const updateAccelerator: (
  input: UpdateAcceleratorRequest,
) => effect.Effect<
  UpdateAcceleratorResponse,
  | AcceleratorNotFoundException
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | InvalidArgumentException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAcceleratorRequest,
  output: UpdateAcceleratorResponse,
  errors: [
    AcceleratorNotFoundException,
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    InvalidArgumentException,
    TransactionInProgressException,
  ],
}));
/**
 * Remove endpoints from an endpoint group.
 *
 * The `RemoveEndpoints` API operation is the recommended option for removing endpoints. The alternative is to remove
 * endpoints by updating an endpoint group by using the
 * UpdateEndpointGroup
 * API operation. There are two advantages to using `AddEndpoints` to remove endpoints instead:
 *
 * - It's more convenient, because you only need to specify the endpoints that you want to remove. With the
 * `UpdateEndpointGroup` API operation, you must specify all of the endpoints in the
 * endpoint group except the ones that you want to remove from the group.
 *
 * - It's faster, because Global Accelerator doesn't need to resolve any endpoints. With the
 * `UpdateEndpointGroup` API operation, Global Accelerator must resolve all of the endpoints that
 * remain in the group.
 */
export const removeEndpoints: (
  input: RemoveEndpointsRequest,
) => effect.Effect<
  RemoveEndpointsResponse,
  | AccessDeniedException
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveEndpointsRequest,
  output: RemoveEndpointsResponse,
  errors: [
    AccessDeniedException,
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    TransactionInProgressException,
  ],
}));
/**
 * Update the attributes for an accelerator.
 */
export const updateAcceleratorAttributes: (
  input: UpdateAcceleratorAttributesRequest,
) => effect.Effect<
  UpdateAcceleratorAttributesResponse,
  | AcceleratorNotFoundException
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidArgumentException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAcceleratorAttributesRequest,
  output: UpdateAcceleratorAttributesResponse,
  errors: [
    AcceleratorNotFoundException,
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidArgumentException,
    TransactionInProgressException,
  ],
}));
/**
 * Update the attributes for a custom routing accelerator.
 */
export const updateCustomRoutingAcceleratorAttributes: (
  input: UpdateCustomRoutingAcceleratorAttributesRequest,
) => effect.Effect<
  UpdateCustomRoutingAcceleratorAttributesResponse,
  | AcceleratorNotFoundException
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidArgumentException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomRoutingAcceleratorAttributesRequest,
  output: UpdateCustomRoutingAcceleratorAttributesResponse,
  errors: [
    AcceleratorNotFoundException,
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidArgumentException,
    TransactionInProgressException,
  ],
}));
/**
 * Delete a custom routing accelerator. Before you can delete an accelerator, you must disable it and remove all dependent resources
 * (listeners and endpoint groups). To disable the accelerator, update the accelerator to set `Enabled` to false.
 *
 * When you create a custom routing accelerator, by default, Global Accelerator provides you with a set of two static IP addresses.
 *
 * The IP
 * addresses are assigned to your accelerator for as long as it exists, even if you disable the accelerator and
 * it no longer accepts or routes traffic. However, when you *delete* an accelerator, you lose the
 * static IP addresses that are assigned to the accelerator, so you can no longer route traffic by using them.
 * As a best practice, ensure that you have permissions in place to avoid inadvertently deleting accelerators. You
 * can use IAM policies with Global Accelerator to limit the users who have permissions to delete an accelerator. For more information,
 * see Identity and access management in
 * the *Global Accelerator Developer Guide*.
 */
export const deleteCustomRoutingAccelerator: (
  input: DeleteCustomRoutingAcceleratorRequest,
) => effect.Effect<
  DeleteCustomRoutingAcceleratorResponse,
  | AcceleratorNotDisabledException
  | AcceleratorNotFoundException
  | AssociatedListenerFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomRoutingAcceleratorRequest,
  output: DeleteCustomRoutingAcceleratorResponse,
  errors: [
    AcceleratorNotDisabledException,
    AcceleratorNotFoundException,
    AssociatedListenerFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    TransactionInProgressException,
  ],
}));
/**
 * Update a custom routing accelerator.
 */
export const updateCustomRoutingAccelerator: (
  input: UpdateCustomRoutingAcceleratorRequest,
) => effect.Effect<
  UpdateCustomRoutingAcceleratorResponse,
  | AcceleratorNotFoundException
  | ConflictException
  | InternalServiceErrorException
  | InvalidArgumentException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomRoutingAcceleratorRequest,
  output: UpdateCustomRoutingAcceleratorResponse,
  errors: [
    AcceleratorNotFoundException,
    ConflictException,
    InternalServiceErrorException,
    InvalidArgumentException,
    TransactionInProgressException,
  ],
}));
/**
 * Delete an accelerator. Before you can delete an accelerator, you must disable it and remove all dependent resources
 * (listeners and endpoint groups). To disable the accelerator, update the accelerator to set `Enabled` to false.
 *
 * When you create an accelerator, by default, Global Accelerator provides you with a set of two static IP addresses.
 * Alternatively, you can bring your own IP address ranges to Global Accelerator and assign IP addresses from those ranges.
 *
 * The IP addresses are assigned to your accelerator for as long as it exists, even if you disable the accelerator and
 * it no longer accepts or routes traffic. However, when you *delete* an accelerator, you lose the
 * static IP addresses that are assigned to the accelerator, so you can no longer route traffic by using them.
 * As a best practice, ensure that you have permissions in place to avoid inadvertently deleting accelerators. You
 * can use IAM policies with Global Accelerator to limit the users who have permissions to delete an accelerator. For more information,
 * see Identity and access management in
 * the *Global Accelerator Developer Guide*.
 */
export const deleteAccelerator: (
  input: DeleteAcceleratorRequest,
) => effect.Effect<
  DeleteAcceleratorResponse,
  | AcceleratorNotDisabledException
  | AcceleratorNotFoundException
  | AssociatedListenerFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAcceleratorRequest,
  output: DeleteAcceleratorResponse,
  errors: [
    AcceleratorNotDisabledException,
    AcceleratorNotFoundException,
    AssociatedListenerFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    TransactionInProgressException,
  ],
}));
/**
 * Create a custom routing accelerator. A custom routing accelerator directs traffic to one of possibly thousands
 * of Amazon EC2 instance destinations running in a single or multiple virtual private clouds (VPC) subnet endpoints.
 *
 * Be aware that, by default, all destination EC2 instances in a VPC subnet endpoint cannot receive
 * traffic. To enable all destinations to receive traffic, or to specify individual port
 * mappings that can receive traffic, see the
 * AllowCustomRoutingTraffic operation.
 *
 * Global Accelerator is a global service that supports endpoints in multiple Amazon Web Services Regions but you must specify the
 * US West (Oregon) Region to create, update, or otherwise work with accelerators. That is, for example, specify `--region us-west-2`
 * on Amazon Web Services CLI commands.
 */
export const createCustomRoutingAccelerator: (
  input: CreateCustomRoutingAcceleratorRequest,
) => effect.Effect<
  CreateCustomRoutingAcceleratorResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidArgumentException
  | LimitExceededException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomRoutingAcceleratorRequest,
  output: CreateCustomRoutingAcceleratorResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidArgumentException,
    LimitExceededException,
    TransactionInProgressException,
  ],
}));
/**
 * Delete a listener for a custom routing accelerator.
 */
export const deleteCustomRoutingListener: (
  input: DeleteCustomRoutingListenerRequest,
) => effect.Effect<
  DeleteCustomRoutingListenerResponse,
  | AssociatedEndpointGroupFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomRoutingListenerRequest,
  output: DeleteCustomRoutingListenerResponse,
  errors: [
    AssociatedEndpointGroupFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    ListenerNotFoundException,
  ],
}));
/**
 * Describe a listener.
 */
export const describeListener: (
  input: DescribeListenerRequest,
) => effect.Effect<
  DescribeListenerResponse,
  | InternalServiceErrorException
  | InvalidArgumentException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeListenerRequest,
  output: DescribeListenerResponse,
  errors: [
    InternalServiceErrorException,
    InvalidArgumentException,
    ListenerNotFoundException,
  ],
}));
/**
 * Delete a listener from an accelerator.
 */
export const deleteListener: (
  input: DeleteListenerRequest,
) => effect.Effect<
  DeleteListenerResponse,
  | AssociatedEndpointGroupFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteListenerRequest,
  output: DeleteListenerResponse,
  errors: [
    AssociatedEndpointGroupFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    ListenerNotFoundException,
  ],
}));
/**
 * List all tags for an accelerator.
 *
 * For more information, see Tagging
 * in Global Accelerator in the *Global Accelerator Developer Guide*.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AcceleratorNotFoundException
  | AttachmentNotFoundException
  | EndpointGroupNotFoundException
  | InternalServiceErrorException
  | InvalidArgumentException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AcceleratorNotFoundException,
    AttachmentNotFoundException,
    EndpointGroupNotFoundException,
    InternalServiceErrorException,
    InvalidArgumentException,
    ListenerNotFoundException,
  ],
}));
/**
 * Create an endpoint group for the specified listener for a custom routing accelerator.
 * An endpoint group is a collection of endpoints in one Amazon Web Services
 * Region.
 */
export const createCustomRoutingEndpointGroup: (
  input: CreateCustomRoutingEndpointGroupRequest,
) => effect.Effect<
  CreateCustomRoutingEndpointGroupResponse,
  | AcceleratorNotFoundException
  | AccessDeniedException
  | EndpointGroupAlreadyExistsException
  | InternalServiceErrorException
  | InvalidArgumentException
  | InvalidPortRangeException
  | LimitExceededException
  | ListenerNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomRoutingEndpointGroupRequest,
  output: CreateCustomRoutingEndpointGroupResponse,
  errors: [
    AcceleratorNotFoundException,
    AccessDeniedException,
    EndpointGroupAlreadyExistsException,
    InternalServiceErrorException,
    InvalidArgumentException,
    InvalidPortRangeException,
    LimitExceededException,
    ListenerNotFoundException,
  ],
}));
