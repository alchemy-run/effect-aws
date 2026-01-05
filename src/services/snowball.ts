import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Snowball",
  serviceShapeName: "AWSIESnowballJobManagementService",
});
const auth = T.AwsAuthSigv4({ name: "snowball" });
const ver = T.ServiceVersion("2016-06-30");
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
                        url: "https://snowball-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://snowball-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://snowball.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://snowball.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetSnowballUsageRequest extends S.Class<GetSnowballUsageRequest>(
  "GetSnowballUsageRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const LongTermPricingIdList = S.Array(S.String);
export class CancelClusterRequest extends S.Class<CancelClusterRequest>(
  "CancelClusterRequest",
)(
  { ClusterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelClusterResult extends S.Class<CancelClusterResult>(
  "CancelClusterResult",
)({}) {}
export class CancelJobRequest extends S.Class<CancelJobRequest>(
  "CancelJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelJobResult extends S.Class<CancelJobResult>(
  "CancelJobResult",
)({}) {}
export class CreateLongTermPricingRequest extends S.Class<CreateLongTermPricingRequest>(
  "CreateLongTermPricingRequest",
)(
  {
    LongTermPricingType: S.String,
    IsLongTermPricingAutoRenew: S.optional(S.Boolean),
    SnowballType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReturnShippingLabelRequest extends S.Class<CreateReturnShippingLabelRequest>(
  "CreateReturnShippingLabelRequest",
)(
  { JobId: S.String, ShippingOption: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAddressRequest extends S.Class<DescribeAddressRequest>(
  "DescribeAddressRequest",
)(
  { AddressId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAddressesRequest extends S.Class<DescribeAddressesRequest>(
  "DescribeAddressesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterRequest extends S.Class<DescribeClusterRequest>(
  "DescribeClusterRequest",
)(
  { ClusterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeJobRequest extends S.Class<DescribeJobRequest>(
  "DescribeJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReturnShippingLabelRequest extends S.Class<DescribeReturnShippingLabelRequest>(
  "DescribeReturnShippingLabelRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetJobManifestRequest extends S.Class<GetJobManifestRequest>(
  "GetJobManifestRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetJobUnlockCodeRequest extends S.Class<GetJobUnlockCodeRequest>(
  "GetJobUnlockCodeRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSnowballUsageResult extends S.Class<GetSnowballUsageResult>(
  "GetSnowballUsageResult",
)({
  SnowballLimit: S.optional(S.Number),
  SnowballsInUse: S.optional(S.Number),
}) {}
export class GetSoftwareUpdatesRequest extends S.Class<GetSoftwareUpdatesRequest>(
  "GetSoftwareUpdatesRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListClusterJobsRequest extends S.Class<ListClusterJobsRequest>(
  "ListClusterJobsRequest",
)(
  {
    ClusterId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListClustersRequest extends S.Class<ListClustersRequest>(
  "ListClustersRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCompatibleImagesRequest extends S.Class<ListCompatibleImagesRequest>(
  "ListCompatibleImagesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListJobsRequest extends S.Class<ListJobsRequest>(
  "ListJobsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLongTermPricingRequest extends S.Class<ListLongTermPricingRequest>(
  "ListLongTermPricingRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPickupLocationsRequest extends S.Class<ListPickupLocationsRequest>(
  "ListPickupLocationsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class KeyRange extends S.Class<KeyRange>("KeyRange")({
  BeginMarker: S.optional(S.String),
  EndMarker: S.optional(S.String),
}) {}
export class TargetOnDeviceService extends S.Class<TargetOnDeviceService>(
  "TargetOnDeviceService",
)({
  ServiceName: S.optional(S.String),
  TransferOption: S.optional(S.String),
}) {}
export const TargetOnDeviceServiceList = S.Array(TargetOnDeviceService);
export class S3Resource extends S.Class<S3Resource>("S3Resource")({
  BucketArn: S.optional(S.String),
  KeyRange: S.optional(KeyRange),
  TargetOnDeviceServices: S.optional(TargetOnDeviceServiceList),
}) {}
export const S3ResourceList = S.Array(S3Resource);
export class EventTriggerDefinition extends S.Class<EventTriggerDefinition>(
  "EventTriggerDefinition",
)({ EventResourceARN: S.optional(S.String) }) {}
export const EventTriggerDefinitionList = S.Array(EventTriggerDefinition);
export class LambdaResource extends S.Class<LambdaResource>("LambdaResource")({
  LambdaArn: S.optional(S.String),
  EventTriggers: S.optional(EventTriggerDefinitionList),
}) {}
export const LambdaResourceList = S.Array(LambdaResource);
export class Ec2AmiResource extends S.Class<Ec2AmiResource>("Ec2AmiResource")({
  AmiId: S.String,
  SnowballAmiId: S.optional(S.String),
}) {}
export const Ec2AmiResourceList = S.Array(Ec2AmiResource);
export class JobResource extends S.Class<JobResource>("JobResource")({
  S3Resources: S.optional(S3ResourceList),
  LambdaResources: S.optional(LambdaResourceList),
  Ec2AmiResources: S.optional(Ec2AmiResourceList),
}) {}
export class NFSOnDeviceServiceConfiguration extends S.Class<NFSOnDeviceServiceConfiguration>(
  "NFSOnDeviceServiceConfiguration",
)({ StorageLimit: S.optional(S.Number), StorageUnit: S.optional(S.String) }) {}
export class TGWOnDeviceServiceConfiguration extends S.Class<TGWOnDeviceServiceConfiguration>(
  "TGWOnDeviceServiceConfiguration",
)({ StorageLimit: S.optional(S.Number), StorageUnit: S.optional(S.String) }) {}
export class EKSOnDeviceServiceConfiguration extends S.Class<EKSOnDeviceServiceConfiguration>(
  "EKSOnDeviceServiceConfiguration",
)({
  KubernetesVersion: S.optional(S.String),
  EKSAnywhereVersion: S.optional(S.String),
}) {}
export class S3OnDeviceServiceConfiguration extends S.Class<S3OnDeviceServiceConfiguration>(
  "S3OnDeviceServiceConfiguration",
)({
  StorageLimit: S.optional(S.Number),
  StorageUnit: S.optional(S.String),
  ServiceSize: S.optional(S.Number),
  FaultTolerance: S.optional(S.Number),
}) {}
export class OnDeviceServiceConfiguration extends S.Class<OnDeviceServiceConfiguration>(
  "OnDeviceServiceConfiguration",
)({
  NFSOnDeviceService: S.optional(NFSOnDeviceServiceConfiguration),
  TGWOnDeviceService: S.optional(TGWOnDeviceServiceConfiguration),
  EKSOnDeviceService: S.optional(EKSOnDeviceServiceConfiguration),
  S3OnDeviceService: S.optional(S3OnDeviceServiceConfiguration),
}) {}
export const JobStateList = S.Array(S.String);
export class Notification extends S.Class<Notification>("Notification")({
  SnsTopicARN: S.optional(S.String),
  JobStatesToNotify: S.optional(JobStateList),
  NotifyAll: S.optional(S.Boolean),
  DevicePickupSnsTopicARN: S.optional(S.String),
}) {}
export class UpdateClusterRequest extends S.Class<UpdateClusterRequest>(
  "UpdateClusterRequest",
)(
  {
    ClusterId: S.String,
    RoleARN: S.optional(S.String),
    Description: S.optional(S.String),
    Resources: S.optional(JobResource),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
    AddressId: S.optional(S.String),
    ShippingOption: S.optional(S.String),
    Notification: S.optional(Notification),
    ForwardingAddressId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateClusterResult extends S.Class<UpdateClusterResult>(
  "UpdateClusterResult",
)({}) {}
export class PickupDetails extends S.Class<PickupDetails>("PickupDetails")({
  Name: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  Email: S.optional(S.String),
  IdentificationNumber: S.optional(S.String),
  IdentificationExpirationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  IdentificationIssuingOrg: S.optional(S.String),
  DevicePickupId: S.optional(S.String),
}) {}
export class UpdateJobRequest extends S.Class<UpdateJobRequest>(
  "UpdateJobRequest",
)(
  {
    JobId: S.String,
    RoleARN: S.optional(S.String),
    Notification: S.optional(Notification),
    Resources: S.optional(JobResource),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
    AddressId: S.optional(S.String),
    ShippingOption: S.optional(S.String),
    Description: S.optional(S.String),
    SnowballCapacityPreference: S.optional(S.String),
    ForwardingAddressId: S.optional(S.String),
    PickupDetails: S.optional(PickupDetails),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateJobResult extends S.Class<UpdateJobResult>(
  "UpdateJobResult",
)({}) {}
export class UpdateJobShipmentStateRequest extends S.Class<UpdateJobShipmentStateRequest>(
  "UpdateJobShipmentStateRequest",
)(
  { JobId: S.String, ShipmentState: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateJobShipmentStateResult extends S.Class<UpdateJobShipmentStateResult>(
  "UpdateJobShipmentStateResult",
)({}) {}
export class UpdateLongTermPricingRequest extends S.Class<UpdateLongTermPricingRequest>(
  "UpdateLongTermPricingRequest",
)(
  {
    LongTermPricingId: S.String,
    ReplacementJob: S.optional(S.String),
    IsLongTermPricingAutoRenew: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLongTermPricingResult extends S.Class<UpdateLongTermPricingResult>(
  "UpdateLongTermPricingResult",
)({}) {}
export class Address extends S.Class<Address>("Address")({
  AddressId: S.optional(S.String),
  Name: S.optional(S.String),
  Company: S.optional(S.String),
  Street1: S.optional(S.String),
  Street2: S.optional(S.String),
  Street3: S.optional(S.String),
  City: S.optional(S.String),
  StateOrProvince: S.optional(S.String),
  PrefectureOrDistrict: S.optional(S.String),
  Landmark: S.optional(S.String),
  Country: S.optional(S.String),
  PostalCode: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  IsRestricted: S.optional(S.Boolean),
  Type: S.optional(S.String),
}) {}
export const AddressList = S.Array(Address);
export class Shipment extends S.Class<Shipment>("Shipment")({
  Status: S.optional(S.String),
  TrackingNumber: S.optional(S.String),
}) {}
export class ShippingDetails extends S.Class<ShippingDetails>(
  "ShippingDetails",
)({
  ShippingOption: S.optional(S.String),
  InboundShipment: S.optional(Shipment),
  OutboundShipment: S.optional(Shipment),
}) {}
export class DataTransfer extends S.Class<DataTransfer>("DataTransfer")({
  BytesTransferred: S.optional(S.Number),
  ObjectsTransferred: S.optional(S.Number),
  TotalBytes: S.optional(S.Number),
  TotalObjects: S.optional(S.Number),
}) {}
export class JobLogs extends S.Class<JobLogs>("JobLogs")({
  JobCompletionReportURI: S.optional(S.String),
  JobSuccessLogURI: S.optional(S.String),
  JobFailureLogURI: S.optional(S.String),
}) {}
export class INDTaxDocuments extends S.Class<INDTaxDocuments>(
  "INDTaxDocuments",
)({ GSTIN: S.optional(S.String) }) {}
export class TaxDocuments extends S.Class<TaxDocuments>("TaxDocuments")({
  IND: S.optional(INDTaxDocuments),
}) {}
export class WirelessConnection extends S.Class<WirelessConnection>(
  "WirelessConnection",
)({ IsWifiEnabled: S.optional(S.Boolean) }) {}
export class SnowconeDeviceConfiguration extends S.Class<SnowconeDeviceConfiguration>(
  "SnowconeDeviceConfiguration",
)({ WirelessConnection: S.optional(WirelessConnection) }) {}
export class DeviceConfiguration extends S.Class<DeviceConfiguration>(
  "DeviceConfiguration",
)({ SnowconeDeviceConfiguration: S.optional(SnowconeDeviceConfiguration) }) {}
export class JobMetadata extends S.Class<JobMetadata>("JobMetadata")({
  JobId: S.optional(S.String),
  JobState: S.optional(S.String),
  JobType: S.optional(S.String),
  SnowballType: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Resources: S.optional(JobResource),
  Description: S.optional(S.String),
  KmsKeyARN: S.optional(S.String),
  RoleARN: S.optional(S.String),
  AddressId: S.optional(S.String),
  ShippingDetails: S.optional(ShippingDetails),
  SnowballCapacityPreference: S.optional(S.String),
  Notification: S.optional(Notification),
  DataTransferProgress: S.optional(DataTransfer),
  JobLogInfo: S.optional(JobLogs),
  ClusterId: S.optional(S.String),
  ForwardingAddressId: S.optional(S.String),
  TaxDocuments: S.optional(TaxDocuments),
  DeviceConfiguration: S.optional(DeviceConfiguration),
  RemoteManagement: S.optional(S.String),
  LongTermPricingId: S.optional(S.String),
  OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
  ImpactLevel: S.optional(S.String),
  PickupDetails: S.optional(PickupDetails),
  SnowballId: S.optional(S.String),
}) {}
export const JobMetadataList = S.Array(JobMetadata);
export class CreateAddressRequest extends S.Class<CreateAddressRequest>(
  "CreateAddressRequest",
)(
  { Address: Address },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLongTermPricingResult extends S.Class<CreateLongTermPricingResult>(
  "CreateLongTermPricingResult",
)({ LongTermPricingId: S.optional(S.String) }) {}
export class CreateReturnShippingLabelResult extends S.Class<CreateReturnShippingLabelResult>(
  "CreateReturnShippingLabelResult",
)({ Status: S.optional(S.String) }) {}
export class DescribeAddressResult extends S.Class<DescribeAddressResult>(
  "DescribeAddressResult",
)({ Address: S.optional(Address) }) {}
export class DescribeAddressesResult extends S.Class<DescribeAddressesResult>(
  "DescribeAddressesResult",
)({ Addresses: S.optional(AddressList), NextToken: S.optional(S.String) }) {}
export class DescribeReturnShippingLabelResult extends S.Class<DescribeReturnShippingLabelResult>(
  "DescribeReturnShippingLabelResult",
)({
  Status: S.optional(S.String),
  ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReturnShippingLabelURI: S.optional(S.String),
}) {}
export class GetJobManifestResult extends S.Class<GetJobManifestResult>(
  "GetJobManifestResult",
)({ ManifestURI: S.optional(S.String) }) {}
export class GetJobUnlockCodeResult extends S.Class<GetJobUnlockCodeResult>(
  "GetJobUnlockCodeResult",
)({ UnlockCode: S.optional(S.String) }) {}
export class GetSoftwareUpdatesResult extends S.Class<GetSoftwareUpdatesResult>(
  "GetSoftwareUpdatesResult",
)({ UpdatesURI: S.optional(S.String) }) {}
export class JobListEntry extends S.Class<JobListEntry>("JobListEntry")({
  JobId: S.optional(S.String),
  JobState: S.optional(S.String),
  IsMaster: S.optional(S.Boolean),
  JobType: S.optional(S.String),
  SnowballType: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
}) {}
export const JobListEntryList = S.Array(JobListEntry);
export class ListJobsResult extends S.Class<ListJobsResult>("ListJobsResult")({
  JobListEntries: S.optional(JobListEntryList),
  NextToken: S.optional(S.String),
}) {}
export class ListPickupLocationsResult extends S.Class<ListPickupLocationsResult>(
  "ListPickupLocationsResult",
)({ Addresses: S.optional(AddressList), NextToken: S.optional(S.String) }) {}
export const LongTermPricingAssociatedJobIdList = S.Array(S.String);
export class ServiceVersion extends S.Class<ServiceVersion>("ServiceVersion")({
  Version: S.optional(S.String),
}) {}
export class ClusterMetadata extends S.Class<ClusterMetadata>(
  "ClusterMetadata",
)({
  ClusterId: S.optional(S.String),
  Description: S.optional(S.String),
  KmsKeyARN: S.optional(S.String),
  RoleARN: S.optional(S.String),
  ClusterState: S.optional(S.String),
  JobType: S.optional(S.String),
  SnowballType: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Resources: S.optional(JobResource),
  AddressId: S.optional(S.String),
  ShippingOption: S.optional(S.String),
  Notification: S.optional(Notification),
  ForwardingAddressId: S.optional(S.String),
  TaxDocuments: S.optional(TaxDocuments),
  OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
}) {}
export class ClusterListEntry extends S.Class<ClusterListEntry>(
  "ClusterListEntry",
)({
  ClusterId: S.optional(S.String),
  ClusterState: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
}) {}
export const ClusterListEntryList = S.Array(ClusterListEntry);
export class CompatibleImage extends S.Class<CompatibleImage>(
  "CompatibleImage",
)({ AmiId: S.optional(S.String), Name: S.optional(S.String) }) {}
export const CompatibleImageList = S.Array(CompatibleImage);
export class LongTermPricingListEntry extends S.Class<LongTermPricingListEntry>(
  "LongTermPricingListEntry",
)({
  LongTermPricingId: S.optional(S.String),
  LongTermPricingEndDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LongTermPricingStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LongTermPricingType: S.optional(S.String),
  CurrentActiveJob: S.optional(S.String),
  ReplacementJob: S.optional(S.String),
  IsLongTermPricingAutoRenew: S.optional(S.Boolean),
  LongTermPricingStatus: S.optional(S.String),
  SnowballType: S.optional(S.String),
  JobIds: S.optional(LongTermPricingAssociatedJobIdList),
}) {}
export const LongTermPricingEntryList = S.Array(LongTermPricingListEntry);
export class DependentService extends S.Class<DependentService>(
  "DependentService",
)({
  ServiceName: S.optional(S.String),
  ServiceVersion: S.optional(ServiceVersion),
}) {}
export const DependentServiceList = S.Array(DependentService);
export class CreateAddressResult extends S.Class<CreateAddressResult>(
  "CreateAddressResult",
)({ AddressId: S.optional(S.String) }) {}
export class DescribeClusterResult extends S.Class<DescribeClusterResult>(
  "DescribeClusterResult",
)({ ClusterMetadata: S.optional(ClusterMetadata) }) {}
export class ListClusterJobsResult extends S.Class<ListClusterJobsResult>(
  "ListClusterJobsResult",
)({
  JobListEntries: S.optional(JobListEntryList),
  NextToken: S.optional(S.String),
}) {}
export class ListClustersResult extends S.Class<ListClustersResult>(
  "ListClustersResult",
)({
  ClusterListEntries: S.optional(ClusterListEntryList),
  NextToken: S.optional(S.String),
}) {}
export class ListCompatibleImagesResult extends S.Class<ListCompatibleImagesResult>(
  "ListCompatibleImagesResult",
)({
  CompatibleImages: S.optional(CompatibleImageList),
  NextToken: S.optional(S.String),
}) {}
export class ListLongTermPricingResult extends S.Class<ListLongTermPricingResult>(
  "ListLongTermPricingResult",
)({
  LongTermPricingEntries: S.optional(LongTermPricingEntryList),
  NextToken: S.optional(S.String),
}) {}
export class ListServiceVersionsRequest extends S.Class<ListServiceVersionsRequest>(
  "ListServiceVersionsRequest",
)(
  {
    ServiceName: S.String,
    DependentServices: S.optional(DependentServiceList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ServiceVersionList = S.Array(ServiceVersion);
export class CreateClusterRequest extends S.Class<CreateClusterRequest>(
  "CreateClusterRequest",
)(
  {
    JobType: S.String,
    Resources: S.optional(JobResource),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
    Description: S.optional(S.String),
    AddressId: S.String,
    KmsKeyARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
    SnowballType: S.String,
    ShippingOption: S.String,
    Notification: S.optional(Notification),
    ForwardingAddressId: S.optional(S.String),
    TaxDocuments: S.optional(TaxDocuments),
    RemoteManagement: S.optional(S.String),
    InitialClusterSize: S.optional(S.Number),
    ForceCreateJobs: S.optional(S.Boolean),
    LongTermPricingIds: S.optional(LongTermPricingIdList),
    SnowballCapacityPreference: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateJobRequest extends S.Class<CreateJobRequest>(
  "CreateJobRequest",
)(
  {
    JobType: S.optional(S.String),
    Resources: S.optional(JobResource),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
    Description: S.optional(S.String),
    AddressId: S.optional(S.String),
    KmsKeyARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
    SnowballCapacityPreference: S.optional(S.String),
    ShippingOption: S.optional(S.String),
    Notification: S.optional(Notification),
    ClusterId: S.optional(S.String),
    SnowballType: S.optional(S.String),
    ForwardingAddressId: S.optional(S.String),
    TaxDocuments: S.optional(TaxDocuments),
    DeviceConfiguration: S.optional(DeviceConfiguration),
    RemoteManagement: S.optional(S.String),
    LongTermPricingId: S.optional(S.String),
    ImpactLevel: S.optional(S.String),
    PickupDetails: S.optional(PickupDetails),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceVersionsResult extends S.Class<ListServiceVersionsResult>(
  "ListServiceVersionsResult",
)({
  ServiceVersions: ServiceVersionList,
  ServiceName: S.String,
  DependentServices: S.optional(DependentServiceList),
  NextToken: S.optional(S.String),
}) {}
export class CreateClusterResult extends S.Class<CreateClusterResult>(
  "CreateClusterResult",
)({
  ClusterId: S.optional(S.String),
  JobListEntries: S.optional(JobListEntryList),
}) {}
export class CreateJobResult extends S.Class<CreateJobResult>(
  "CreateJobResult",
)({ JobId: S.optional(S.String) }) {}
export class DescribeJobResult extends S.Class<DescribeJobResult>(
  "DescribeJobResult",
)({
  JobMetadata: S.optional(JobMetadata),
  SubJobMetadata: S.optional(JobMetadataList),
}) {}

//# Errors
export class InvalidJobStateException extends S.TaggedError<InvalidJobStateException>()(
  "InvalidJobStateException",
  { Message: S.optional(S.String) },
) {}
export class Ec2RequestFailedException extends S.TaggedError<Ec2RequestFailedException>()(
  "Ec2RequestFailedException",
  { Message: S.optional(S.String) },
) {}
export class ClusterLimitExceededException extends S.TaggedError<ClusterLimitExceededException>()(
  "ClusterLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidResourceException extends S.TaggedError<InvalidResourceException>()(
  "InvalidResourceException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { ConflictResource: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class InvalidInputCombinationException extends S.TaggedError<InvalidInputCombinationException>()(
  "InvalidInputCombinationException",
  { Message: S.optional(S.String) },
) {}
export class KMSRequestFailedException extends S.TaggedError<KMSRequestFailedException>()(
  "KMSRequestFailedException",
  { Message: S.optional(S.String) },
) {}
export class InvalidAddressException extends S.TaggedError<InvalidAddressException>()(
  "InvalidAddressException",
  { Message: S.optional(S.String) },
) {}
export class ReturnShippingLabelAlreadyExistsException extends S.TaggedError<ReturnShippingLabelAlreadyExistsException>()(
  "ReturnShippingLabelAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedAddressException extends S.TaggedError<UnsupportedAddressException>()(
  "UnsupportedAddressException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns information about the Snow Family service limit for your account, and also the
 * number of Snow devices your account has in use.
 *
 * The default service limit for the number of Snow devices that you can have at one time
 * is 1. If you want to increase your service limit, contact Amazon Web Services Support.
 */
export const getSnowballUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSnowballUsageRequest,
  output: GetSnowballUsageResult,
  errors: [],
}));
/**
 * Updates the long-term pricing type.
 */
export const updateLongTermPricing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLongTermPricingRequest,
    output: UpdateLongTermPricingResult,
    errors: [InvalidResourceException],
  }),
);
/**
 * Updates the state when a shipment state changes to a different state.
 */
export const updateJobShipmentState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateJobShipmentStateRequest,
    output: UpdateJobShipmentStateResult,
    errors: [InvalidJobStateException, InvalidResourceException],
  }),
);
/**
 * Creates a job with the long-term usage option for a device. The long-term usage is a
 * 1-year or 3-year long-term pricing type for the device. You are billed upfront, and Amazon Web Services provides discounts for long-term pricing.
 */
export const createLongTermPricing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLongTermPricingRequest,
    output: CreateLongTermPricingResult,
    errors: [InvalidResourceException],
  }),
);
/**
 * Takes an `AddressId` and returns specific details about that address in the
 * form of an `Address` object.
 */
export const describeAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAddressRequest,
  output: DescribeAddressResult,
  errors: [InvalidResourceException],
}));
/**
 * Returns a link to an Amazon S3 presigned URL for the manifest file associated with the
 * specified `JobId` value. You can access the manifest file for up to 60 minutes
 * after this request has been made. To access the manifest file after 60 minutes have passed,
 * you'll have to make another call to the `GetJobManifest` action.
 *
 * The manifest is an encrypted file that you can download after your job enters the
 * `WithCustomer` status. This is the only valid status for calling this API as the
 * manifest and `UnlockCode` code value are used for securing your device and should
 * only be used when you have the device. The manifest is decrypted by using the
 * `UnlockCode` code value, when you pass both values to the Snow device through the
 * Snowball client when the client is started for the first time.
 *
 * As a best practice, we recommend that you don't save a copy of an
 * `UnlockCode` value in the same location as the manifest file for that job. Saving
 * these separately helps prevent unauthorized parties from gaining access to the Snow device
 * associated with that job.
 *
 * The credentials of a given job, including its manifest file and unlock code, expire 360
 * days after the job is created.
 */
export const getJobManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobManifestRequest,
  output: GetJobManifestResult,
  errors: [InvalidJobStateException, InvalidResourceException],
}));
/**
 * Returns the `UnlockCode` code value for the specified job. A particular
 * `UnlockCode` value can be accessed for up to 360 days after the associated job
 * has been created.
 *
 * The `UnlockCode` value is a 29-character code with 25 alphanumeric
 * characters and 4 hyphens. This code is used to decrypt the manifest file when it is passed
 * along with the manifest to the Snow device through the Snowball client when the client is
 * started for the first time. The only valid status for calling this API is
 * `WithCustomer` as the manifest and `Unlock` code values are used for
 * securing your device and should only be used when you have the device.
 *
 * As a best practice, we recommend that you don't save a copy of the
 * `UnlockCode` in the same location as the manifest file for that job. Saving these
 * separately helps prevent unauthorized parties from gaining access to the Snow device
 * associated with that job.
 */
export const getJobUnlockCode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobUnlockCodeRequest,
  output: GetJobUnlockCodeResult,
  errors: [InvalidJobStateException, InvalidResourceException],
}));
/**
 * Returns an Amazon S3 presigned URL for an update file associated with a specified
 * `JobId`.
 */
export const getSoftwareUpdates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSoftwareUpdatesRequest,
  output: GetSoftwareUpdatesResult,
  errors: [InvalidJobStateException, InvalidResourceException],
}));
/**
 * A list of locations from which the customer can choose to pickup a device.
 */
export const listPickupLocations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPickupLocationsRequest,
    output: ListPickupLocationsResult,
    errors: [InvalidResourceException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a specified number of `ADDRESS` objects. Calling this API in one of
 * the US regions will return addresses from the list of all addresses associated with this
 * account in all US regions.
 */
export const describeAddresses = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeAddressesRequest,
    output: DescribeAddressesResult,
    errors: [InvalidNextTokenException, InvalidResourceException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Addresses",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns information about a specific cluster including shipping information, cluster
 * status, and other important metadata.
 */
export const describeCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterRequest,
  output: DescribeClusterResult,
  errors: [InvalidResourceException],
}));
/**
 * Returns an array of `JobListEntry` objects of the specified length. Each
 * `JobListEntry` object is for a job in the specified cluster and contains a job's
 * state, a job's ID, and other information.
 */
export const listClusterJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListClusterJobsRequest,
    output: ListClusterJobsResult,
    errors: [InvalidNextTokenException, InvalidResourceException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "JobListEntries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns an array of `ClusterListEntry` objects of the specified length. Each
 * `ClusterListEntry` object contains a cluster's state, a cluster's ID, and other
 * important status information.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListClustersRequest,
    output: ListClustersResult,
    errors: [InvalidNextTokenException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ClusterListEntries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This action returns a list of the different Amazon EC2-compatible Amazon Machine Images (AMIs)
 * that are owned by your Amazon Web Services accountthat would be supported for use on a Snow
 * device. Currently, supported AMIs are based on the Amazon Linux-2, Ubuntu 20.04 LTS - Focal, or Ubuntu 22.04 LTS - Jammy images, available on the
 * Amazon Web Services Marketplace. Ubuntu 16.04 LTS - Xenial (HVM) images are no longer supported in the Market, but still supported for use on devices through Amazon EC2 VM Import/Export and running locally in AMIs.
 */
export const listCompatibleImages =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCompatibleImagesRequest,
    output: ListCompatibleImagesResult,
    errors: [Ec2RequestFailedException, InvalidNextTokenException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CompatibleImages",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all long-term pricing types.
 */
export const listLongTermPricing =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLongTermPricingRequest,
    output: ListLongTermPricingResult,
    errors: [InvalidNextTokenException, InvalidResourceException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "LongTermPricingEntries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Cancels the specified job. You can only cancel a job before its `JobState`
 * value changes to `PreparingAppliance`. Requesting the `ListJobs` or
 * `DescribeJob` action returns a job's `JobState` as part of the
 * response element data returned.
 */
export const cancelJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRequest,
  output: CancelJobResult,
  errors: [
    InvalidJobStateException,
    InvalidResourceException,
    KMSRequestFailedException,
  ],
}));
/**
 * Information on the shipping label of a Snow device that is being returned to Amazon Web Services.
 */
export const describeReturnShippingLabel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReturnShippingLabelRequest,
    output: DescribeReturnShippingLabelResult,
    errors: [
      ConflictException,
      InvalidJobStateException,
      InvalidResourceException,
    ],
  }),
);
/**
 * Returns an array of `JobListEntry` objects of the specified length. Each
 * `JobListEntry` object contains a job's state, a job's ID, and a value that
 * indicates whether the job is a job part, in the case of export jobs. Calling this API action
 * in one of the US regions will return jobs from the list of all jobs associated with this
 * account in all US regions.
 */
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResult,
  errors: [InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "JobListEntries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * While a job's `JobState` value is `New`, you can update some of
 * the information associated with a job. Once the job changes to a different job state, usually
 * within 60 minutes of the job being created, this action is no longer available.
 */
export const updateJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobRequest,
  output: UpdateJobResult,
  errors: [
    ClusterLimitExceededException,
    Ec2RequestFailedException,
    InvalidInputCombinationException,
    InvalidJobStateException,
    InvalidResourceException,
    KMSRequestFailedException,
  ],
}));
/**
 * Cancels a cluster job. You can only cancel a cluster job while it's in the
 * `AwaitingQuorum` status. You'll have at least an hour after creating a cluster
 * job to cancel it.
 */
export const cancelCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelClusterRequest,
  output: CancelClusterResult,
  errors: [
    InvalidJobStateException,
    InvalidResourceException,
    KMSRequestFailedException,
  ],
}));
/**
 * While a cluster's `ClusterState` value is in the `AwaitingQuorum`
 * state, you can update some of the information associated with a cluster. Once the cluster
 * changes to a different job state, usually 60 minutes after the cluster being created, this
 * action is no longer available.
 */
export const updateCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResult,
  errors: [
    Ec2RequestFailedException,
    InvalidInputCombinationException,
    InvalidJobStateException,
    InvalidResourceException,
    KMSRequestFailedException,
  ],
}));
/**
 * Lists all supported versions for Snow on-device services. Returns an
 * array of `ServiceVersion` object containing the supported versions for a particular service.
 */
export const listServiceVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServiceVersionsRequest,
  output: ListServiceVersionsResult,
  errors: [InvalidNextTokenException, InvalidResourceException],
}));
/**
 * Creates a shipping label that will be used to return the Snow device to Amazon Web Services.
 */
export const createReturnShippingLabel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateReturnShippingLabelRequest,
    output: CreateReturnShippingLabelResult,
    errors: [
      ConflictException,
      InvalidInputCombinationException,
      InvalidJobStateException,
      InvalidResourceException,
      ReturnShippingLabelAlreadyExistsException,
    ],
  }),
);
/**
 * Creates an address for a Snow device to be shipped to. In most regions,
 * addresses are validated at the time of creation. The address you provide must be located
 * within the serviceable area of your region. If the address is invalid or unsupported, then an
 * exception is thrown. If providing an address as a JSON file through the `cli-input-json` option, include the full file path. For example, `--cli-input-json file://create-address.json`.
 */
export const createAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddressRequest,
  output: CreateAddressResult,
  errors: [InvalidAddressException, UnsupportedAddressException],
}));
/**
 * Creates an empty cluster. Each cluster supports five nodes. You use the CreateJob action separately to create the jobs for each of these nodes. The
 * cluster does not ship until these five node jobs have been created.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResult,
  errors: [
    Ec2RequestFailedException,
    InvalidInputCombinationException,
    InvalidResourceException,
    KMSRequestFailedException,
  ],
}));
/**
 * Creates a job to import or export data between Amazon S3 and your on-premises data
 * center. Your Amazon Web Services account must have the right trust policies and permissions in
 * place to create a job for a Snow device. If you're creating a job for a node in a cluster, you
 * only need to provide the `clusterId` value; the other job attributes are inherited
 * from the cluster.
 *
 * Only the Snowball; Edge device type is supported when ordering clustered jobs.
 *
 * The device capacity is optional.
 *
 * Availability of device types differ by Amazon Web Services Region. For more information
 * about Region availability, see Amazon Web Services Regional Services.
 *
 * **Snow Family devices and their capacities.**
 *
 * - Device type: **SNC1_SSD**
 *
 * - Capacity: T14
 *
 * - Description: Snowcone
 *
 * - Device type: **SNC1_HDD**
 *
 * - Capacity: T8
 *
 * - Description: Snowcone
 *
 * - Device type: **EDGE_S**
 *
 * - Capacity: T98
 *
 * - Description: Snowball Edge Storage Optimized for data transfer only
 *
 * - Device type: **EDGE_CG**
 *
 * - Capacity: T42
 *
 * - Description: Snowball Edge Compute Optimized with GPU
 *
 * - Device type: **EDGE_C**
 *
 * - Capacity: T42
 *
 * - Description: Snowball Edge Compute Optimized without GPU
 *
 * - Device type: **EDGE**
 *
 * - Capacity: T100
 *
 * - Description: Snowball Edge Storage Optimized with EC2 Compute
 *
 * This device is replaced with T98.
 *
 * - Device type: **STANDARD**
 *
 * - Capacity: T50
 *
 * - Description: Original Snowball device
 *
 * This device is only available in the Ningxia, Beijing, and Singapore Amazon Web Services Region
 *
 * - Device type: **STANDARD**
 *
 * - Capacity: T80
 *
 * - Description: Original Snowball device
 *
 * This device is only available in the Ningxia, Beijing, and Singapore Amazon Web Services Region.
 *
 * - Snow Family device type: **RACK_5U_C**
 *
 * - Capacity: T13
 *
 * - Description: Snowblade.
 *
 * - Device type: **V3_5S**
 *
 * - Capacity: T240
 *
 * - Description: Snowball Edge Storage Optimized 210TB
 */
export const createJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResult,
  errors: [
    ClusterLimitExceededException,
    Ec2RequestFailedException,
    InvalidInputCombinationException,
    InvalidResourceException,
    KMSRequestFailedException,
  ],
}));
/**
 * Returns information about a specific job including shipping information, job status,
 * and other important metadata.
 */
export const describeJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRequest,
  output: DescribeJobResult,
  errors: [InvalidResourceException],
}));
