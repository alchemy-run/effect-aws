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
  sdkId: "evs",
  serviceShapeName: "AmazonElasticVMwareService",
});
const auth = T.AwsAuthSigv4({ name: "evs" });
const ver = T.ServiceVersion("2023-07-27");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://evs-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://evs-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://evs.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://evs.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type TagKey = string;
export type ClientToken = string;
export type EnvironmentName = string;
export type VpcId = string;
export type SubnetId = string;
export type EnvironmentId = string;
export type PaginationToken = string;
export type MaxResults = number;
export type AllocationId = string;
export type HostName = string;
export type AssociationId = string;
export type TagValue = string;
export type SecurityGroupId = string;
export type SolutionKey = string;
export type VSanLicenseKey = string;
export type NetworkAclId = string;
export type KeyName = string;
export type PlacementGroupId = string;
export type DedicatedHostId = string;
export type RouteServerPeering = string;
export type Cidr = string;
export type StateDetails = string;
export type VlanId = number;
export type IpAddress = string;
export type NetworkInterfaceId = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type VcfVersion = "VCF-5.2.1";
export const VcfVersion = S.Literal("VCF-5.2.1");
export type EnvironmentState =
  | "CREATING"
  | "CREATED"
  | "DELETING"
  | "DELETED"
  | "CREATE_FAILED";
export const EnvironmentState = S.Literal(
  "CREATING",
  "CREATED",
  "DELETING",
  "DELETED",
  "CREATE_FAILED",
);
export type EnvironmentStateList = EnvironmentState[];
export const EnvironmentStateList = S.Array(EnvironmentState);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface GetEnvironmentRequest {
  environmentId: string;
}
export const GetEnvironmentRequest = S.suspend(() =>
  S.Struct({ environmentId: S.String.pipe(T.HttpLabel("environmentId")) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEnvironmentRequest",
}) as any as S.Schema<GetEnvironmentRequest>;
export interface DeleteEnvironmentRequest {
  clientToken?: string;
  environmentId: string;
}
export const DeleteEnvironmentRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEnvironmentRequest",
}) as any as S.Schema<DeleteEnvironmentRequest>;
export interface ListEnvironmentsRequest {
  nextToken?: string;
  maxResults?: number;
  state?: EnvironmentState[];
}
export const ListEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    state: S.optional(EnvironmentStateList).pipe(T.HttpQuery("state")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentsRequest",
}) as any as S.Schema<ListEnvironmentsRequest>;
export interface AssociateEipToVlanRequest {
  clientToken?: string;
  environmentId: string;
  vlanName: string;
  allocationId: string;
}
export const AssociateEipToVlanRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    environmentId: S.String,
    vlanName: S.String,
    allocationId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateEipToVlanRequest",
}) as any as S.Schema<AssociateEipToVlanRequest>;
export type InstanceType = "i4i.metal";
export const InstanceType = S.Literal("i4i.metal");
export interface HostInfoForCreate {
  hostName: string;
  keyName: string;
  instanceType: InstanceType;
  placementGroupId?: string;
  dedicatedHostId?: string;
}
export const HostInfoForCreate = S.suspend(() =>
  S.Struct({
    hostName: S.String,
    keyName: S.String,
    instanceType: InstanceType,
    placementGroupId: S.optional(S.String),
    dedicatedHostId: S.optional(S.String),
  }),
).annotations({
  identifier: "HostInfoForCreate",
}) as any as S.Schema<HostInfoForCreate>;
export interface CreateEnvironmentHostRequest {
  clientToken?: string;
  environmentId: string;
  host: HostInfoForCreate;
}
export const CreateEnvironmentHostRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    environmentId: S.String,
    host: HostInfoForCreate,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEnvironmentHostRequest",
}) as any as S.Schema<CreateEnvironmentHostRequest>;
export interface DeleteEnvironmentHostRequest {
  clientToken?: string;
  environmentId: string;
  hostName: string;
}
export const DeleteEnvironmentHostRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    environmentId: S.String,
    hostName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEnvironmentHostRequest",
}) as any as S.Schema<DeleteEnvironmentHostRequest>;
export interface DisassociateEipFromVlanRequest {
  clientToken?: string;
  environmentId: string;
  vlanName: string;
  associationId: string;
}
export const DisassociateEipFromVlanRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    environmentId: S.String,
    vlanName: S.String,
    associationId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateEipFromVlanRequest",
}) as any as S.Schema<DisassociateEipFromVlanRequest>;
export interface ListEnvironmentHostsRequest {
  nextToken?: string;
  maxResults?: number;
  environmentId: string;
}
export const ListEnvironmentHostsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentHostsRequest",
}) as any as S.Schema<ListEnvironmentHostsRequest>;
export interface ListEnvironmentVlansRequest {
  nextToken?: string;
  maxResults?: number;
  environmentId: string;
}
export const ListEnvironmentVlansRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentVlansRequest",
}) as any as S.Schema<ListEnvironmentVlansRequest>;
export type SecurityGroups = string[];
export const SecurityGroups = S.Array(S.String);
export type RouteServerPeeringList = string[];
export const RouteServerPeeringList = S.Array(S.String);
export type RequestTagMap = { [key: string]: string };
export const RequestTagMap = S.Record({ key: S.String, value: S.String });
export interface ServiceAccessSecurityGroups {
  securityGroups?: string[];
}
export const ServiceAccessSecurityGroups = S.suspend(() =>
  S.Struct({ securityGroups: S.optional(SecurityGroups) }),
).annotations({
  identifier: "ServiceAccessSecurityGroups",
}) as any as S.Schema<ServiceAccessSecurityGroups>;
export interface LicenseInfo {
  solutionKey: string;
  vsanKey: string;
}
export const LicenseInfo = S.suspend(() =>
  S.Struct({ solutionKey: S.String, vsanKey: S.String }),
).annotations({ identifier: "LicenseInfo" }) as any as S.Schema<LicenseInfo>;
export type LicenseInfoList = LicenseInfo[];
export const LicenseInfoList = S.Array(LicenseInfo);
export type HostInfoForCreateList = HostInfoForCreate[];
export const HostInfoForCreateList = S.Array(HostInfoForCreate);
export interface ConnectivityInfo {
  privateRouteServerPeerings: string[];
}
export const ConnectivityInfo = S.suspend(() =>
  S.Struct({ privateRouteServerPeerings: RouteServerPeeringList }),
).annotations({
  identifier: "ConnectivityInfo",
}) as any as S.Schema<ConnectivityInfo>;
export interface VcfHostnames {
  vCenter: string;
  nsx: string;
  nsxManager1: string;
  nsxManager2: string;
  nsxManager3: string;
  nsxEdge1: string;
  nsxEdge2: string;
  sddcManager: string;
  cloudBuilder: string;
}
export const VcfHostnames = S.suspend(() =>
  S.Struct({
    vCenter: S.String,
    nsx: S.String,
    nsxManager1: S.String,
    nsxManager2: S.String,
    nsxManager3: S.String,
    nsxEdge1: S.String,
    nsxEdge2: S.String,
    sddcManager: S.String,
    cloudBuilder: S.String,
  }),
).annotations({ identifier: "VcfHostnames" }) as any as S.Schema<VcfHostnames>;
export type HostState =
  | "CREATING"
  | "CREATED"
  | "UPDATING"
  | "DELETING"
  | "DELETED"
  | "CREATE_FAILED"
  | "UPDATE_FAILED";
export const HostState = S.Literal(
  "CREATING",
  "CREATED",
  "UPDATING",
  "DELETING",
  "DELETED",
  "CREATE_FAILED",
  "UPDATE_FAILED",
);
export interface NetworkInterface {
  networkInterfaceId?: string;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({ networkInterfaceId: S.optional(S.String) }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaceList = NetworkInterface[];
export const NetworkInterfaceList = S.Array(NetworkInterface);
export interface Host {
  hostName?: string;
  ipAddress?: string;
  keyName?: string;
  instanceType?: InstanceType;
  placementGroupId?: string;
  dedicatedHostId?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  hostState?: HostState;
  stateDetails?: string;
  ec2InstanceId?: string;
  networkInterfaces?: NetworkInterface[];
}
export const Host = S.suspend(() =>
  S.Struct({
    hostName: S.optional(S.String),
    ipAddress: S.optional(S.String),
    keyName: S.optional(S.String),
    instanceType: S.optional(InstanceType),
    placementGroupId: S.optional(S.String),
    dedicatedHostId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    hostState: S.optional(HostState),
    stateDetails: S.optional(S.String),
    ec2InstanceId: S.optional(S.String),
    networkInterfaces: S.optional(NetworkInterfaceList),
  }),
).annotations({ identifier: "Host" }) as any as S.Schema<Host>;
export type HostList = Host[];
export const HostList = S.Array(Host);
export type VlanState =
  | "CREATING"
  | "CREATED"
  | "DELETING"
  | "DELETED"
  | "CREATE_FAILED";
export const VlanState = S.Literal(
  "CREATING",
  "CREATED",
  "DELETING",
  "DELETED",
  "CREATE_FAILED",
);
export interface EipAssociation {
  associationId?: string;
  allocationId?: string;
  ipAddress?: string;
}
export const EipAssociation = S.suspend(() =>
  S.Struct({
    associationId: S.optional(S.String),
    allocationId: S.optional(S.String),
    ipAddress: S.optional(S.String),
  }),
).annotations({
  identifier: "EipAssociation",
}) as any as S.Schema<EipAssociation>;
export type EipAssociationList = EipAssociation[];
export const EipAssociationList = S.Array(EipAssociation);
export interface Vlan {
  vlanId?: number;
  cidr?: string;
  availabilityZone?: string;
  functionName?: string;
  subnetId?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  vlanState?: VlanState;
  stateDetails?: string;
  eipAssociations?: EipAssociation[];
  isPublic?: boolean;
  networkAclId?: string;
}
export const Vlan = S.suspend(() =>
  S.Struct({
    vlanId: S.optional(S.Number),
    cidr: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    functionName: S.optional(S.String),
    subnetId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    vlanState: S.optional(VlanState),
    stateDetails: S.optional(S.String),
    eipAssociations: S.optional(EipAssociationList),
    isPublic: S.optional(S.Boolean),
    networkAclId: S.optional(S.String),
  }),
).annotations({ identifier: "Vlan" }) as any as S.Schema<Vlan>;
export type VlanList = Vlan[];
export const VlanList = S.Array(Vlan);
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: RequestTagMap }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export type CheckResult = "PASSED" | "FAILED" | "UNKNOWN";
export const CheckResult = S.Literal("PASSED", "FAILED", "UNKNOWN");
export type CheckType =
  | "KEY_REUSE"
  | "KEY_COVERAGE"
  | "REACHABILITY"
  | "HOST_COUNT";
export const CheckType = S.Literal(
  "KEY_REUSE",
  "KEY_COVERAGE",
  "REACHABILITY",
  "HOST_COUNT",
);
export interface Check {
  type?: CheckType;
  result?: CheckResult;
  impairedSince?: Date;
}
export const Check = S.suspend(() =>
  S.Struct({
    type: S.optional(CheckType),
    result: S.optional(CheckResult),
    impairedSince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Check" }) as any as S.Schema<Check>;
export type ChecksList = Check[];
export const ChecksList = S.Array(Check);
export interface Secret {
  secretArn?: string;
}
export const Secret = S.suspend(() =>
  S.Struct({ secretArn: S.optional(S.String) }),
).annotations({ identifier: "Secret" }) as any as S.Schema<Secret>;
export type SecretList = Secret[];
export const SecretList = S.Array(Secret);
export interface Environment {
  environmentId?: string;
  environmentState?: EnvironmentState;
  stateDetails?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  environmentArn?: string;
  environmentName?: string;
  vpcId?: string;
  serviceAccessSubnetId?: string;
  vcfVersion?: VcfVersion;
  termsAccepted?: boolean;
  licenseInfo?: LicenseInfo[];
  siteId?: string;
  environmentStatus?: CheckResult;
  checks?: Check[];
  connectivityInfo?: ConnectivityInfo;
  vcfHostnames?: VcfHostnames;
  kmsKeyId?: string;
  serviceAccessSecurityGroups?: ServiceAccessSecurityGroups;
  credentials?: Secret[];
}
export const Environment = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    environmentState: S.optional(EnvironmentState),
    stateDetails: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    environmentArn: S.optional(S.String),
    environmentName: S.optional(S.String),
    vpcId: S.optional(S.String),
    serviceAccessSubnetId: S.optional(S.String),
    vcfVersion: S.optional(VcfVersion),
    termsAccepted: S.optional(S.Boolean),
    licenseInfo: S.optional(LicenseInfoList),
    siteId: S.optional(S.String),
    environmentStatus: S.optional(CheckResult),
    checks: S.optional(ChecksList),
    connectivityInfo: S.optional(ConnectivityInfo),
    vcfHostnames: S.optional(VcfHostnames),
    kmsKeyId: S.optional(S.String),
    serviceAccessSecurityGroups: S.optional(ServiceAccessSecurityGroups),
    credentials: S.optional(SecretList),
  }),
).annotations({ identifier: "Environment" }) as any as S.Schema<Environment>;
export interface DeleteEnvironmentResponse {
  environment?: Environment;
}
export const DeleteEnvironmentResponse = S.suspend(() =>
  S.Struct({ environment: S.optional(Environment) }),
).annotations({
  identifier: "DeleteEnvironmentResponse",
}) as any as S.Schema<DeleteEnvironmentResponse>;
export interface EnvironmentSummary {
  environmentId?: string;
  environmentName?: string;
  vcfVersion?: VcfVersion;
  environmentStatus?: CheckResult;
  environmentState?: EnvironmentState;
  createdAt?: Date;
  modifiedAt?: Date;
  environmentArn?: string;
}
export const EnvironmentSummary = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    environmentName: S.optional(S.String),
    vcfVersion: S.optional(VcfVersion),
    environmentStatus: S.optional(CheckResult),
    environmentState: S.optional(EnvironmentState),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    modifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    environmentArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentSummary",
}) as any as S.Schema<EnvironmentSummary>;
export interface DeleteEnvironmentHostResponse {
  environmentSummary?: EnvironmentSummary;
  host?: Host;
}
export const DeleteEnvironmentHostResponse = S.suspend(() =>
  S.Struct({
    environmentSummary: S.optional(EnvironmentSummary),
    host: S.optional(Host),
  }),
).annotations({
  identifier: "DeleteEnvironmentHostResponse",
}) as any as S.Schema<DeleteEnvironmentHostResponse>;
export interface DisassociateEipFromVlanResponse {
  vlan?: Vlan;
}
export const DisassociateEipFromVlanResponse = S.suspend(() =>
  S.Struct({ vlan: S.optional(Vlan) }),
).annotations({
  identifier: "DisassociateEipFromVlanResponse",
}) as any as S.Schema<DisassociateEipFromVlanResponse>;
export interface ListEnvironmentHostsResponse {
  nextToken?: string;
  environmentHosts?: Host[];
}
export const ListEnvironmentHostsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    environmentHosts: S.optional(HostList),
  }),
).annotations({
  identifier: "ListEnvironmentHostsResponse",
}) as any as S.Schema<ListEnvironmentHostsResponse>;
export interface ListEnvironmentVlansResponse {
  nextToken?: string;
  environmentVlans?: Vlan[];
}
export const ListEnvironmentVlansResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    environmentVlans: S.optional(VlanList),
  }),
).annotations({
  identifier: "ListEnvironmentVlansResponse",
}) as any as S.Schema<ListEnvironmentVlansResponse>;
export interface InitialVlanInfo {
  cidr: string;
}
export const InitialVlanInfo = S.suspend(() =>
  S.Struct({ cidr: S.String }),
).annotations({
  identifier: "InitialVlanInfo",
}) as any as S.Schema<InitialVlanInfo>;
export type ResponseTagMap = { [key: string]: string };
export const ResponseTagMap = S.Record({ key: S.String, value: S.String });
export interface InitialVlans {
  vmkManagement: InitialVlanInfo;
  vmManagement: InitialVlanInfo;
  vMotion: InitialVlanInfo;
  vSan: InitialVlanInfo;
  vTep: InitialVlanInfo;
  edgeVTep: InitialVlanInfo;
  nsxUplink: InitialVlanInfo;
  hcx: InitialVlanInfo;
  expansionVlan1: InitialVlanInfo;
  expansionVlan2: InitialVlanInfo;
  isHcxPublic?: boolean;
  hcxNetworkAclId?: string;
}
export const InitialVlans = S.suspend(() =>
  S.Struct({
    vmkManagement: InitialVlanInfo,
    vmManagement: InitialVlanInfo,
    vMotion: InitialVlanInfo,
    vSan: InitialVlanInfo,
    vTep: InitialVlanInfo,
    edgeVTep: InitialVlanInfo,
    nsxUplink: InitialVlanInfo,
    hcx: InitialVlanInfo,
    expansionVlan1: InitialVlanInfo,
    expansionVlan2: InitialVlanInfo,
    isHcxPublic: S.optional(S.Boolean),
    hcxNetworkAclId: S.optional(S.String),
  }),
).annotations({ identifier: "InitialVlans" }) as any as S.Schema<InitialVlans>;
export type ValidationExceptionReason =
  | "unknownOperation"
  | "cannotParse"
  | "fieldValidationFailed"
  | "other";
export const ValidationExceptionReason = S.Literal(
  "unknownOperation",
  "cannotParse",
  "fieldValidationFailed",
  "other",
);
export type EnvironmentSummaryList = EnvironmentSummary[];
export const EnvironmentSummaryList = S.Array(EnvironmentSummary);
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(ResponseTagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface CreateEnvironmentRequest {
  clientToken?: string;
  environmentName?: string;
  kmsKeyId?: string;
  tags?: { [key: string]: string };
  serviceAccessSecurityGroups?: ServiceAccessSecurityGroups;
  vpcId: string;
  serviceAccessSubnetId: string;
  vcfVersion: VcfVersion;
  termsAccepted: boolean;
  licenseInfo: LicenseInfo[];
  initialVlans: InitialVlans;
  hosts: HostInfoForCreate[];
  connectivityInfo: ConnectivityInfo;
  vcfHostnames: VcfHostnames;
  siteId: string;
}
export const CreateEnvironmentRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    environmentName: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(RequestTagMap),
    serviceAccessSecurityGroups: S.optional(ServiceAccessSecurityGroups),
    vpcId: S.String,
    serviceAccessSubnetId: S.String,
    vcfVersion: VcfVersion,
    termsAccepted: S.Boolean,
    licenseInfo: LicenseInfoList,
    initialVlans: InitialVlans,
    hosts: HostInfoForCreateList,
    connectivityInfo: ConnectivityInfo,
    vcfHostnames: VcfHostnames,
    siteId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEnvironmentRequest",
}) as any as S.Schema<CreateEnvironmentRequest>;
export interface ListEnvironmentsResponse {
  nextToken?: string;
  environmentSummaries?: EnvironmentSummary[];
}
export const ListEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    environmentSummaries: S.optional(EnvironmentSummaryList),
  }),
).annotations({
  identifier: "ListEnvironmentsResponse",
}) as any as S.Schema<ListEnvironmentsResponse>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface CreateEnvironmentResponse {
  environment?: Environment;
}
export const CreateEnvironmentResponse = S.suspend(() =>
  S.Struct({ environment: S.optional(Environment) }),
).annotations({
  identifier: "CreateEnvironmentResponse",
}) as any as S.Schema<CreateEnvironmentResponse>;
export interface GetEnvironmentResponse {
  environment?: Environment;
}
export const GetEnvironmentResponse = S.suspend(() =>
  S.Struct({ environment: S.optional(Environment) }),
).annotations({
  identifier: "GetEnvironmentResponse",
}) as any as S.Schema<GetEnvironmentResponse>;
export interface AssociateEipToVlanResponse {
  vlan?: Vlan;
}
export const AssociateEipToVlanResponse = S.suspend(() =>
  S.Struct({ vlan: S.optional(Vlan) }),
).annotations({
  identifier: "AssociateEipToVlanResponse",
}) as any as S.Schema<AssociateEipToVlanResponse>;
export interface CreateEnvironmentHostResponse {
  environmentSummary?: EnvironmentSummary;
  host?: Host;
}
export const CreateEnvironmentHostResponse = S.suspend(() =>
  S.Struct({
    environmentSummary: S.optional(EnvironmentSummary),
    host: S.optional(Host),
  }),
).annotations({
  identifier: "CreateEnvironmentHostResponse",
}) as any as S.Schema<CreateEnvironmentHostResponse>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class TagPolicyException extends S.TaggedError<TagPolicyException>()(
  "TagPolicyException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: ValidationExceptionReason,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the tags for an Amazon EVS resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes specified tags from an Amazon EVS resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | TagPolicyException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, TagPolicyException],
}));
/**
 * Deletes an Amazon EVS environment.
 *
 * Amazon EVS environments will only be enabled for deletion once the hosts are deleted. You can delete hosts using the `DeleteEnvironmentHost` action.
 *
 * Environment deletion also deletes the associated Amazon EVS VLAN subnets and Amazon Web Services Secrets Manager secrets that Amazon EVS created. Amazon Web Services resources that you create are not deleted. These resources may continue to incur costs.
 */
export const deleteEnvironment: (
  input: DeleteEnvironmentRequest,
) => effect.Effect<
  DeleteEnvironmentResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Associates an Elastic IP address with a public HCX VLAN. This operation is only allowed for public HCX VLANs at this time.
 */
export const associateEipToVlan: (
  input: AssociateEipToVlanRequest,
) => effect.Effect<
  AssociateEipToVlanResponse,
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateEipToVlanRequest,
  output: AssociateEipToVlanResponse,
  errors: [ResourceNotFoundException, ThrottlingException, ValidationException],
}));
/**
 * Creates an ESXi host and adds it to an Amazon EVS environment. Amazon EVS supports 4-16 hosts per environment.
 *
 * This action can only be used after the Amazon EVS environment is deployed.
 *
 * You can use the `dedicatedHostId` parameter to specify an Amazon EC2 Dedicated Host for ESXi host creation.
 *
 * You can use the `placementGroupId` parameter to specify a cluster or partition placement group to launch EC2 instances into.
 *
 * You cannot use the `dedicatedHostId` and `placementGroupId` parameters together in the same `CreateEnvironmentHost` action. This results in a `ValidationException` response.
 */
export const createEnvironmentHost: (
  input: CreateEnvironmentHostRequest,
) => effect.Effect<
  CreateEnvironmentHostResponse,
  ThrottlingException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentHostRequest,
  output: CreateEnvironmentHostResponse,
  errors: [ThrottlingException, ValidationException],
}));
/**
 * Associates the specified tags to an Amazon EVS resource with the specified `resourceArn`. If existing tags on a resource are not specified in the request parameters, they aren't changed. When a resource is deleted, the tags associated with that resource are also deleted. Tags that you create for Amazon EVS resources don't propagate to any other resources associated with the environment. For example, if you tag an environment with this operation, that tag doesn't automatically propagate to the VLAN subnets and hosts associated with the environment.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | TagPolicyException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    TagPolicyException,
    TooManyTagsException,
  ],
}));
/**
 * Deletes a host from an Amazon EVS environment.
 *
 * Before deleting a host, you must unassign and decommission the host from within the SDDC Manager user interface. Not doing so could impact the availability of your virtual machines or result in data loss.
 */
export const deleteEnvironmentHost: (
  input: DeleteEnvironmentHostRequest,
) => effect.Effect<
  DeleteEnvironmentHostResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentHostRequest,
  output: DeleteEnvironmentHostResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * List the hosts within an environment.
 */
export const listEnvironmentHosts: {
  (
    input: ListEnvironmentHostsRequest,
  ): effect.Effect<
    ListEnvironmentHostsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentHostsRequest,
  ) => stream.Stream<
    ListEnvironmentHostsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentHostsRequest,
  ) => stream.Stream<
    Host,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentHostsRequest,
  output: ListEnvironmentHostsResponse,
  errors: [ResourceNotFoundException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "environmentHosts",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists environment VLANs that are associated with the specified environment.
 */
export const listEnvironmentVlans: {
  (
    input: ListEnvironmentVlansRequest,
  ): effect.Effect<
    ListEnvironmentVlansResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentVlansRequest,
  ) => stream.Stream<
    ListEnvironmentVlansResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentVlansRequest,
  ) => stream.Stream<
    Vlan,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentVlansRequest,
  output: ListEnvironmentVlansResponse,
  errors: [ResourceNotFoundException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "environmentVlans",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the Amazon EVS environments in your Amazon Web Services account in the specified Amazon Web Services Region.
 */
export const listEnvironments: {
  (
    input: ListEnvironmentsRequest,
  ): effect.Effect<
    ListEnvironmentsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentsRequest,
  ) => stream.Stream<
    ListEnvironmentsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentsRequest,
  ) => stream.Stream<
    EnvironmentSummary,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentsRequest,
  output: ListEnvironmentsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "environmentSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Disassociates an Elastic IP address from a public HCX VLAN. This operation is only allowed for public HCX VLANs at this time.
 */
export const disassociateEipFromVlan: (
  input: DisassociateEipFromVlanRequest,
) => effect.Effect<
  DisassociateEipFromVlanResponse,
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateEipFromVlanRequest,
  output: DisassociateEipFromVlanResponse,
  errors: [ResourceNotFoundException, ThrottlingException, ValidationException],
}));
/**
 * Creates an Amazon EVS environment that runs VCF software, such as SDDC Manager, NSX Manager, and vCenter Server.
 *
 * During environment creation, Amazon EVS performs validations on DNS settings, provisions VLAN subnets and hosts, and deploys the supplied version of VCF.
 *
 * It can take several hours to create an environment. After the deployment completes, you can configure VCF in the vSphere user interface according to your needs.
 *
 * You cannot use the `dedicatedHostId` and `placementGroupId` parameters together in the same `CreateEnvironment` action. This results in a `ValidationException` response.
 */
export const createEnvironment: (
  input: CreateEnvironmentRequest,
) => effect.Effect<
  CreateEnvironmentResponse,
  ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentRequest,
  output: CreateEnvironmentResponse,
  errors: [ValidationException],
}));
/**
 * Returns a description of the specified environment.
 */
export const getEnvironment: (
  input: GetEnvironmentRequest,
) => effect.Effect<
  GetEnvironmentResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentRequest,
  output: GetEnvironmentResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
