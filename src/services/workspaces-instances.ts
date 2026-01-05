import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Workspaces Instances",
  serviceShapeName: "EUCMIFrontendAPIService",
});
const auth = T.AwsAuthSigv4({ name: "workspaces-instances" });
const ver = T.ServiceVersion("2022-07-26");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                  ],
                  endpoint: {
                    url: "https://workspaces-instances-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://workspaces-instances.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const ProvisionStates = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateVolumeRequest extends S.Class<AssociateVolumeRequest>(
  "AssociateVolumeRequest",
)(
  { WorkspaceInstanceId: S.String, VolumeId: S.String, Device: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateVolumeResponse extends S.Class<AssociateVolumeResponse>(
  "AssociateVolumeResponse",
)({}) {}
export class DeleteVolumeRequest extends S.Class<DeleteVolumeRequest>(
  "DeleteVolumeRequest",
)(
  { VolumeId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVolumeResponse extends S.Class<DeleteVolumeResponse>(
  "DeleteVolumeResponse",
)({}) {}
export class DeleteWorkspaceInstanceRequest extends S.Class<DeleteWorkspaceInstanceRequest>(
  "DeleteWorkspaceInstanceRequest",
)(
  { WorkspaceInstanceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWorkspaceInstanceResponse extends S.Class<DeleteWorkspaceInstanceResponse>(
  "DeleteWorkspaceInstanceResponse",
)({}) {}
export class DisassociateVolumeRequest extends S.Class<DisassociateVolumeRequest>(
  "DisassociateVolumeRequest",
)(
  {
    WorkspaceInstanceId: S.String,
    VolumeId: S.String,
    Device: S.optional(S.String),
    DisassociateMode: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateVolumeResponse extends S.Class<DisassociateVolumeResponse>(
  "DisassociateVolumeResponse",
)({}) {}
export class GetWorkspaceInstanceRequest extends S.Class<GetWorkspaceInstanceRequest>(
  "GetWorkspaceInstanceRequest",
)(
  { WorkspaceInstanceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstanceTypesRequest extends S.Class<ListInstanceTypesRequest>(
  "ListInstanceTypesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRegionsRequest extends S.Class<ListRegionsRequest>(
  "ListRegionsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { WorkspaceInstanceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWorkspaceInstancesRequest extends S.Class<ListWorkspaceInstancesRequest>(
  "ListWorkspaceInstancesRequest",
)(
  {
    ProvisionStates: S.optional(ProvisionStates),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { WorkspaceInstanceId: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { WorkspaceInstanceId: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const SecurityGroupIds = S.Array(S.String);
export const SecurityGroupNames = S.Array(S.String);
export class TagSpecification extends S.Class<TagSpecification>(
  "TagSpecification",
)({ ResourceType: S.optional(S.String), Tags: S.optional(TagList) }) {}
export const TagSpecifications = S.Array(TagSpecification);
export class CreateVolumeRequest extends S.Class<CreateVolumeRequest>(
  "CreateVolumeRequest",
)(
  {
    AvailabilityZone: S.String,
    ClientToken: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    Iops: S.optional(S.Number),
    KmsKeyId: S.optional(S.String),
    SizeInGB: S.optional(S.Number),
    SnapshotId: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecifications),
    Throughput: S.optional(S.Number),
    VolumeType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class CpuOptionsRequest extends S.Class<CpuOptionsRequest>(
  "CpuOptionsRequest",
)({
  AmdSevSnp: S.optional(S.String),
  CoreCount: S.optional(S.Number),
  ThreadsPerCore: S.optional(S.Number),
}) {}
export class CreditSpecificationRequest extends S.Class<CreditSpecificationRequest>(
  "CreditSpecificationRequest",
)({ CpuCredits: S.optional(S.String) }) {}
export class EnclaveOptionsRequest extends S.Class<EnclaveOptionsRequest>(
  "EnclaveOptionsRequest",
)({ Enabled: S.optional(S.Boolean) }) {}
export class HibernationOptionsRequest extends S.Class<HibernationOptionsRequest>(
  "HibernationOptionsRequest",
)({ Configured: S.optional(S.Boolean) }) {}
export class IamInstanceProfileSpecification extends S.Class<IamInstanceProfileSpecification>(
  "IamInstanceProfileSpecification",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }) {}
export class InstanceIpv6Address extends S.Class<InstanceIpv6Address>(
  "InstanceIpv6Address",
)({
  Ipv6Address: S.optional(S.String),
  IsPrimaryIpv6: S.optional(S.Boolean),
}) {}
export const Ipv6Addresses = S.Array(InstanceIpv6Address);
export class LicenseConfigurationRequest extends S.Class<LicenseConfigurationRequest>(
  "LicenseConfigurationRequest",
)({ LicenseConfigurationArn: S.optional(S.String) }) {}
export const LicenseSpecifications = S.Array(LicenseConfigurationRequest);
export class InstanceMaintenanceOptionsRequest extends S.Class<InstanceMaintenanceOptionsRequest>(
  "InstanceMaintenanceOptionsRequest",
)({ AutoRecovery: S.optional(S.String) }) {}
export class InstanceMetadataOptionsRequest extends S.Class<InstanceMetadataOptionsRequest>(
  "InstanceMetadataOptionsRequest",
)({
  HttpEndpoint: S.optional(S.String),
  HttpProtocolIpv6: S.optional(S.String),
  HttpPutResponseHopLimit: S.optional(S.Number),
  HttpTokens: S.optional(S.String),
  InstanceMetadataTags: S.optional(S.String),
}) {}
export class RunInstancesMonitoringEnabled extends S.Class<RunInstancesMonitoringEnabled>(
  "RunInstancesMonitoringEnabled",
)({ Enabled: S.optional(S.Boolean) }) {}
export class InstanceNetworkPerformanceOptionsRequest extends S.Class<InstanceNetworkPerformanceOptionsRequest>(
  "InstanceNetworkPerformanceOptionsRequest",
)({ BandwidthWeighting: S.optional(S.String) }) {}
export class Placement extends S.Class<Placement>("Placement")({
  Affinity: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  GroupId: S.optional(S.String),
  GroupName: S.optional(S.String),
  HostId: S.optional(S.String),
  HostResourceGroupArn: S.optional(S.String),
  PartitionNumber: S.optional(S.Number),
  Tenancy: S.optional(S.String),
}) {}
export class PrivateDnsNameOptionsRequest extends S.Class<PrivateDnsNameOptionsRequest>(
  "PrivateDnsNameOptionsRequest",
)({
  HostnameType: S.optional(S.String),
  EnableResourceNameDnsARecord: S.optional(S.Boolean),
  EnableResourceNameDnsAAAARecord: S.optional(S.Boolean),
}) {}
export class WorkspaceInstanceError extends S.Class<WorkspaceInstanceError>(
  "WorkspaceInstanceError",
)({ ErrorCode: S.optional(S.String), ErrorMessage: S.optional(S.String) }) {}
export const WorkspaceInstanceErrors = S.Array(WorkspaceInstanceError);
export class EC2InstanceError extends S.Class<EC2InstanceError>(
  "EC2InstanceError",
)({
  EC2ErrorCode: S.optional(S.String),
  EC2ExceptionType: S.optional(S.String),
  EC2ErrorMessage: S.optional(S.String),
}) {}
export const EC2InstanceErrors = S.Array(EC2InstanceError);
export class EC2ManagedInstance extends S.Class<EC2ManagedInstance>(
  "EC2ManagedInstance",
)({ InstanceId: S.optional(S.String) }) {}
export class InstanceTypeInfo extends S.Class<InstanceTypeInfo>(
  "InstanceTypeInfo",
)({ InstanceType: S.optional(S.String) }) {}
export const InstanceTypes = S.Array(InstanceTypeInfo);
export class Region extends S.Class<Region>("Region")({
  RegionName: S.optional(S.String),
}) {}
export const RegionList = S.Array(Region);
export class WorkspaceInstance extends S.Class<WorkspaceInstance>(
  "WorkspaceInstance",
)({
  ProvisionState: S.optional(S.String),
  WorkspaceInstanceId: S.optional(S.String),
  EC2ManagedInstance: S.optional(EC2ManagedInstance),
}) {}
export const WorkspaceInstances = S.Array(WorkspaceInstance);
export class EbsBlockDevice extends S.Class<EbsBlockDevice>("EbsBlockDevice")({
  VolumeType: S.optional(S.String),
  Encrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  Iops: S.optional(S.Number),
  Throughput: S.optional(S.Number),
  VolumeSize: S.optional(S.Number),
}) {}
export class CapacityReservationTarget extends S.Class<CapacityReservationTarget>(
  "CapacityReservationTarget",
)({
  CapacityReservationId: S.optional(S.String),
  CapacityReservationResourceGroupArn: S.optional(S.String),
}) {}
export class SpotMarketOptions extends S.Class<SpotMarketOptions>(
  "SpotMarketOptions",
)({
  BlockDurationMinutes: S.optional(S.Number),
  InstanceInterruptionBehavior: S.optional(S.String),
  MaxPrice: S.optional(S.String),
  SpotInstanceType: S.optional(S.String),
  ValidUntilUtc: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ConnectionTrackingSpecificationRequest extends S.Class<ConnectionTrackingSpecificationRequest>(
  "ConnectionTrackingSpecificationRequest",
)({
  TcpEstablishedTimeout: S.optional(S.Number),
  UdpStreamTimeout: S.optional(S.Number),
  UdpTimeout: S.optional(S.Number),
}) {}
export class Ipv4PrefixSpecificationRequest extends S.Class<Ipv4PrefixSpecificationRequest>(
  "Ipv4PrefixSpecificationRequest",
)({ Ipv4Prefix: S.optional(S.String) }) {}
export const Ipv4Prefixes = S.Array(Ipv4PrefixSpecificationRequest);
export class Ipv6PrefixSpecificationRequest extends S.Class<Ipv6PrefixSpecificationRequest>(
  "Ipv6PrefixSpecificationRequest",
)({ Ipv6Prefix: S.optional(S.String) }) {}
export const Ipv6Prefixes = S.Array(Ipv6PrefixSpecificationRequest);
export class PrivateIpAddressSpecification extends S.Class<PrivateIpAddressSpecification>(
  "PrivateIpAddressSpecification",
)({ Primary: S.optional(S.Boolean), PrivateIpAddress: S.optional(S.String) }) {}
export const PrivateIpAddresses = S.Array(PrivateIpAddressSpecification);
export class CreateVolumeResponse extends S.Class<CreateVolumeResponse>(
  "CreateVolumeResponse",
)({ VolumeId: S.optional(S.String) }) {}
export class GetWorkspaceInstanceResponse extends S.Class<GetWorkspaceInstanceResponse>(
  "GetWorkspaceInstanceResponse",
)({
  WorkspaceInstanceErrors: S.optional(WorkspaceInstanceErrors),
  EC2InstanceErrors: S.optional(EC2InstanceErrors),
  ProvisionState: S.optional(S.String),
  WorkspaceInstanceId: S.optional(S.String),
  EC2ManagedInstance: S.optional(EC2ManagedInstance),
}) {}
export class ListInstanceTypesResponse extends S.Class<ListInstanceTypesResponse>(
  "ListInstanceTypesResponse",
)({ InstanceTypes: InstanceTypes, NextToken: S.optional(S.String) }) {}
export class ListRegionsResponse extends S.Class<ListRegionsResponse>(
  "ListRegionsResponse",
)({ Regions: RegionList, NextToken: S.optional(S.String) }) {}
export class ListWorkspaceInstancesResponse extends S.Class<ListWorkspaceInstancesResponse>(
  "ListWorkspaceInstancesResponse",
)({
  WorkspaceInstances: WorkspaceInstances,
  NextToken: S.optional(S.String),
}) {}
export class BlockDeviceMappingRequest extends S.Class<BlockDeviceMappingRequest>(
  "BlockDeviceMappingRequest",
)({
  DeviceName: S.optional(S.String),
  Ebs: S.optional(EbsBlockDevice),
  NoDevice: S.optional(S.String),
  VirtualName: S.optional(S.String),
}) {}
export const BlockDeviceMappings = S.Array(BlockDeviceMappingRequest);
export class CapacityReservationSpecification extends S.Class<CapacityReservationSpecification>(
  "CapacityReservationSpecification",
)({
  CapacityReservationPreference: S.optional(S.String),
  CapacityReservationTarget: S.optional(CapacityReservationTarget),
}) {}
export class InstanceMarketOptionsRequest extends S.Class<InstanceMarketOptionsRequest>(
  "InstanceMarketOptionsRequest",
)({
  MarketType: S.optional(S.String),
  SpotOptions: S.optional(SpotMarketOptions),
}) {}
export class EnaSrdUdpSpecificationRequest extends S.Class<EnaSrdUdpSpecificationRequest>(
  "EnaSrdUdpSpecificationRequest",
)({ EnaSrdUdpEnabled: S.optional(S.Boolean) }) {}
export class EnaSrdSpecificationRequest extends S.Class<EnaSrdSpecificationRequest>(
  "EnaSrdSpecificationRequest",
)({
  EnaSrdEnabled: S.optional(S.Boolean),
  EnaSrdUdpSpecification: S.optional(EnaSrdUdpSpecificationRequest),
}) {}
export class InstanceNetworkInterfaceSpecification extends S.Class<InstanceNetworkInterfaceSpecification>(
  "InstanceNetworkInterfaceSpecification",
)({
  AssociateCarrierIpAddress: S.optional(S.Boolean),
  AssociatePublicIpAddress: S.optional(S.Boolean),
  ConnectionTrackingSpecification: S.optional(
    ConnectionTrackingSpecificationRequest,
  ),
  Description: S.optional(S.String),
  DeviceIndex: S.optional(S.Number),
  EnaSrdSpecification: S.optional(EnaSrdSpecificationRequest),
  InterfaceType: S.optional(S.String),
  Ipv4Prefixes: S.optional(Ipv4Prefixes),
  Ipv4PrefixCount: S.optional(S.Number),
  Ipv6AddressCount: S.optional(S.Number),
  Ipv6Addresses: S.optional(Ipv6Addresses),
  Ipv6Prefixes: S.optional(Ipv6Prefixes),
  Ipv6PrefixCount: S.optional(S.Number),
  NetworkCardIndex: S.optional(S.Number),
  NetworkInterfaceId: S.optional(S.String),
  PrimaryIpv6: S.optional(S.Boolean),
  PrivateIpAddress: S.optional(S.String),
  PrivateIpAddresses: S.optional(PrivateIpAddresses),
  SecondaryPrivateIpAddressCount: S.optional(S.Number),
  Groups: S.optional(SecurityGroupIds),
  SubnetId: S.optional(S.String),
}) {}
export const NetworkInterfaces = S.Array(InstanceNetworkInterfaceSpecification);
export class ManagedInstanceRequest extends S.Class<ManagedInstanceRequest>(
  "ManagedInstanceRequest",
)({
  BlockDeviceMappings: S.optional(BlockDeviceMappings),
  CapacityReservationSpecification: S.optional(
    CapacityReservationSpecification,
  ),
  CpuOptions: S.optional(CpuOptionsRequest),
  CreditSpecification: S.optional(CreditSpecificationRequest),
  DisableApiStop: S.optional(S.Boolean),
  EbsOptimized: S.optional(S.Boolean),
  EnablePrimaryIpv6: S.optional(S.Boolean),
  EnclaveOptions: S.optional(EnclaveOptionsRequest),
  HibernationOptions: S.optional(HibernationOptionsRequest),
  IamInstanceProfile: S.optional(IamInstanceProfileSpecification),
  ImageId: S.optional(S.String),
  InstanceMarketOptions: S.optional(InstanceMarketOptionsRequest),
  InstanceType: S.optional(S.String),
  Ipv6Addresses: S.optional(Ipv6Addresses),
  Ipv6AddressCount: S.optional(S.Number),
  KernelId: S.optional(S.String),
  KeyName: S.optional(S.String),
  LicenseSpecifications: S.optional(LicenseSpecifications),
  MaintenanceOptions: S.optional(InstanceMaintenanceOptionsRequest),
  MetadataOptions: S.optional(InstanceMetadataOptionsRequest),
  Monitoring: S.optional(RunInstancesMonitoringEnabled),
  NetworkInterfaces: S.optional(NetworkInterfaces),
  NetworkPerformanceOptions: S.optional(
    InstanceNetworkPerformanceOptionsRequest,
  ),
  Placement: S.optional(Placement),
  PrivateDnsNameOptions: S.optional(PrivateDnsNameOptionsRequest),
  PrivateIpAddress: S.optional(S.String),
  RamdiskId: S.optional(S.String),
  SecurityGroupIds: S.optional(SecurityGroupIds),
  SecurityGroups: S.optional(SecurityGroupNames),
  SubnetId: S.optional(S.String),
  TagSpecifications: S.optional(TagSpecifications),
  UserData: S.optional(S.String),
}) {}
export class CreateWorkspaceInstanceRequest extends S.Class<CreateWorkspaceInstanceRequest>(
  "CreateWorkspaceInstanceRequest",
)(
  {
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
    ManagedInstance: ManagedInstanceRequest,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, Reason: S.String, Message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class CreateWorkspaceInstanceResponse extends S.Class<CreateWorkspaceInstanceResponse>(
  "CreateWorkspaceInstanceResponse",
)({ WorkspaceInstanceId: S.optional(S.String) }) {}

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
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    ServiceCode: S.optional(S.String),
    QuotaCode: S.optional(S.String),
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    ServiceCode: S.String,
    QuotaCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.String,
    FieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Retrieves a collection of WorkSpaces Instances based on specified filters.
 */
export const listWorkspaceInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkspaceInstancesRequest,
    output: ListWorkspaceInstancesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "WorkspaceInstances",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Creates a new volume for WorkSpace Instances.
 */
export const createVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVolumeRequest,
  output: CreateVolumeResponse,
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
 * Deletes a specified volume.
 */
export const deleteVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVolumeRequest,
  output: DeleteVolumeResponse,
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
 * Deletes the specified WorkSpace
 */
export const deleteWorkspaceInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWorkspaceInstanceRequest,
    output: DeleteWorkspaceInstanceResponse,
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
 * Detaches a volume from a WorkSpace Instance.
 */
export const disassociateVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateVolumeRequest,
  output: DisassociateVolumeResponse,
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
 * Adds tags to a WorkSpace Instance.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a WorkSpace Instance.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attaches a volume to a WorkSpace Instance.
 */
export const associateVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateVolumeRequest,
  output: AssociateVolumeResponse,
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
 * Retrieves detailed information about a specific WorkSpace Instance.
 */
export const getWorkspaceInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWorkspaceInstanceRequest,
    output: GetWorkspaceInstanceResponse,
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
 * Retrieves a list of instance types supported by Amazon WorkSpaces Instances, enabling precise workspace infrastructure configuration.
 */
export const listInstanceTypes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInstanceTypesRequest,
    output: ListInstanceTypesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "InstanceTypes",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves a list of AWS regions supported by Amazon WorkSpaces Instances, enabling region discovery for workspace deployments.
 */
export const listRegions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRegionsRequest,
    output: ListRegionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Regions",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves tags for a WorkSpace Instance.
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
 * Launches a new WorkSpace Instance with specified configuration parameters, enabling programmatic workspace deployment.
 */
export const createWorkspaceInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWorkspaceInstanceRequest,
    output: CreateWorkspaceInstanceResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
