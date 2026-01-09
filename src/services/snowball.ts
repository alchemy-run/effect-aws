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
  sdkId: "Snowball",
  serviceShapeName: "AWSIESnowballJobManagementService",
});
const auth = T.AwsAuthSigv4({ name: "snowball" });
const ver = T.ServiceVersion("2016-06-30");
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
              `https://snowball-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://snowball-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://snowball.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://snowball.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClusterId = string;
export type JobId = string;
export type AddressId = string;
export type KmsKeyARN = string;
export type RoleARN = string;
export type InitialClusterSize = number;
export type LongTermPricingId = string;
export type JavaBoolean = boolean;
export type ListLimit = number;
export type SnsTopicARN = string;
export type PhoneNumber = string | redacted.Redacted<string>;
export type Email = string | redacted.Redacted<string>;
export type DevicePickupId = string;
export type ResourceARN = string;
export type AmiId = string;
export type StorageLimit = number;
export type S3StorageLimit = number;
export type ServiceSize = number;
export type NodeFaultTolerance = number;
export type GSTIN = string;

//# Schemas
export interface GetSnowballUsageRequest {}
export const GetSnowballUsageRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSnowballUsageRequest",
}) as any as S.Schema<GetSnowballUsageRequest>;
export type JobType = "IMPORT" | "EXPORT" | "LOCAL_USE" | (string & {});
export const JobType = S.String;
export type SnowballType =
  | "STANDARD"
  | "EDGE"
  | "EDGE_C"
  | "EDGE_CG"
  | "EDGE_S"
  | "SNC1_HDD"
  | "SNC1_SSD"
  | "V3_5C"
  | "V3_5S"
  | "RACK_5U_C"
  | (string & {});
export const SnowballType = S.String;
export type ShippingOption =
  | "SECOND_DAY"
  | "NEXT_DAY"
  | "EXPRESS"
  | "STANDARD"
  | (string & {});
export const ShippingOption = S.String;
export type RemoteManagement =
  | "INSTALLED_ONLY"
  | "INSTALLED_AUTOSTART"
  | "NOT_INSTALLED"
  | (string & {});
export const RemoteManagement = S.String;
export type LongTermPricingIdList = string[];
export const LongTermPricingIdList = S.Array(S.String);
export type SnowballCapacity =
  | "T50"
  | "T80"
  | "T100"
  | "T42"
  | "T98"
  | "T8"
  | "T14"
  | "T32"
  | "NoPreference"
  | "T240"
  | "T13"
  | (string & {});
export const SnowballCapacity = S.String;
export type ImpactLevel =
  | "IL2"
  | "IL4"
  | "IL5"
  | "IL6"
  | "IL99"
  | (string & {});
export const ImpactLevel = S.String;
export type LongTermPricingType =
  | "OneYear"
  | "ThreeYear"
  | "OneMonth"
  | (string & {});
export const LongTermPricingType = S.String;
export type ServiceName = "KUBERNETES" | "EKS_ANYWHERE" | (string & {});
export const ServiceName = S.String;
export type ShipmentState = "RECEIVED" | "RETURNED" | (string & {});
export const ShipmentState = S.String;
export interface CancelClusterRequest {
  ClusterId: string;
}
export const CancelClusterRequest = S.suspend(() =>
  S.Struct({ ClusterId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelClusterRequest",
}) as any as S.Schema<CancelClusterRequest>;
export interface CancelClusterResult {}
export const CancelClusterResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "CancelClusterResult",
}) as any as S.Schema<CancelClusterResult>;
export interface CancelJobRequest {
  JobId: string;
}
export const CancelJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelJobRequest",
}) as any as S.Schema<CancelJobRequest>;
export interface CancelJobResult {}
export const CancelJobResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "CancelJobResult",
}) as any as S.Schema<CancelJobResult>;
export interface CreateLongTermPricingRequest {
  LongTermPricingType: LongTermPricingType;
  IsLongTermPricingAutoRenew?: boolean;
  SnowballType: SnowballType;
}
export const CreateLongTermPricingRequest = S.suspend(() =>
  S.Struct({
    LongTermPricingType: LongTermPricingType,
    IsLongTermPricingAutoRenew: S.optional(S.Boolean),
    SnowballType: SnowballType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLongTermPricingRequest",
}) as any as S.Schema<CreateLongTermPricingRequest>;
export interface CreateReturnShippingLabelRequest {
  JobId: string;
  ShippingOption?: ShippingOption;
}
export const CreateReturnShippingLabelRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    ShippingOption: S.optional(ShippingOption),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateReturnShippingLabelRequest",
}) as any as S.Schema<CreateReturnShippingLabelRequest>;
export interface DescribeAddressRequest {
  AddressId: string;
}
export const DescribeAddressRequest = S.suspend(() =>
  S.Struct({ AddressId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAddressRequest",
}) as any as S.Schema<DescribeAddressRequest>;
export interface DescribeAddressesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeAddressesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAddressesRequest",
}) as any as S.Schema<DescribeAddressesRequest>;
export interface DescribeClusterRequest {
  ClusterId: string;
}
export const DescribeClusterRequest = S.suspend(() =>
  S.Struct({ ClusterId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeClusterRequest",
}) as any as S.Schema<DescribeClusterRequest>;
export interface DescribeJobRequest {
  JobId: string;
}
export const DescribeJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeJobRequest",
}) as any as S.Schema<DescribeJobRequest>;
export interface DescribeReturnShippingLabelRequest {
  JobId: string;
}
export const DescribeReturnShippingLabelRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeReturnShippingLabelRequest",
}) as any as S.Schema<DescribeReturnShippingLabelRequest>;
export interface GetJobManifestRequest {
  JobId: string;
}
export const GetJobManifestRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetJobManifestRequest",
}) as any as S.Schema<GetJobManifestRequest>;
export interface GetJobUnlockCodeRequest {
  JobId: string;
}
export const GetJobUnlockCodeRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetJobUnlockCodeRequest",
}) as any as S.Schema<GetJobUnlockCodeRequest>;
export interface GetSnowballUsageResult {
  SnowballLimit?: number;
  SnowballsInUse?: number;
}
export const GetSnowballUsageResult = S.suspend(() =>
  S.Struct({
    SnowballLimit: S.optional(S.Number),
    SnowballsInUse: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetSnowballUsageResult",
}) as any as S.Schema<GetSnowballUsageResult>;
export interface GetSoftwareUpdatesRequest {
  JobId: string;
}
export const GetSoftwareUpdatesRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSoftwareUpdatesRequest",
}) as any as S.Schema<GetSoftwareUpdatesRequest>;
export interface ListClusterJobsRequest {
  ClusterId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListClusterJobsRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListClusterJobsRequest",
}) as any as S.Schema<ListClusterJobsRequest>;
export interface ListClustersRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListClustersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListClustersRequest",
}) as any as S.Schema<ListClustersRequest>;
export interface ListCompatibleImagesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListCompatibleImagesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCompatibleImagesRequest",
}) as any as S.Schema<ListCompatibleImagesRequest>;
export interface ListJobsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListJobsRequest",
}) as any as S.Schema<ListJobsRequest>;
export interface ListLongTermPricingRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListLongTermPricingRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLongTermPricingRequest",
}) as any as S.Schema<ListLongTermPricingRequest>;
export interface ListPickupLocationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListPickupLocationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPickupLocationsRequest",
}) as any as S.Schema<ListPickupLocationsRequest>;
export interface KeyRange {
  BeginMarker?: string;
  EndMarker?: string;
}
export const KeyRange = S.suspend(() =>
  S.Struct({
    BeginMarker: S.optional(S.String),
    EndMarker: S.optional(S.String),
  }),
).annotations({ identifier: "KeyRange" }) as any as S.Schema<KeyRange>;
export type DeviceServiceName =
  | "NFS_ON_DEVICE_SERVICE"
  | "S3_ON_DEVICE_SERVICE"
  | (string & {});
export const DeviceServiceName = S.String;
export type TransferOption = "IMPORT" | "EXPORT" | "LOCAL_USE" | (string & {});
export const TransferOption = S.String;
export interface TargetOnDeviceService {
  ServiceName?: DeviceServiceName;
  TransferOption?: TransferOption;
}
export const TargetOnDeviceService = S.suspend(() =>
  S.Struct({
    ServiceName: S.optional(DeviceServiceName),
    TransferOption: S.optional(TransferOption),
  }),
).annotations({
  identifier: "TargetOnDeviceService",
}) as any as S.Schema<TargetOnDeviceService>;
export type TargetOnDeviceServiceList = TargetOnDeviceService[];
export const TargetOnDeviceServiceList = S.Array(TargetOnDeviceService);
export interface S3Resource {
  BucketArn?: string;
  KeyRange?: KeyRange;
  TargetOnDeviceServices?: TargetOnDeviceService[];
}
export const S3Resource = S.suspend(() =>
  S.Struct({
    BucketArn: S.optional(S.String),
    KeyRange: S.optional(KeyRange),
    TargetOnDeviceServices: S.optional(TargetOnDeviceServiceList),
  }),
).annotations({ identifier: "S3Resource" }) as any as S.Schema<S3Resource>;
export type S3ResourceList = S3Resource[];
export const S3ResourceList = S.Array(S3Resource);
export interface EventTriggerDefinition {
  EventResourceARN?: string;
}
export const EventTriggerDefinition = S.suspend(() =>
  S.Struct({ EventResourceARN: S.optional(S.String) }),
).annotations({
  identifier: "EventTriggerDefinition",
}) as any as S.Schema<EventTriggerDefinition>;
export type EventTriggerDefinitionList = EventTriggerDefinition[];
export const EventTriggerDefinitionList = S.Array(EventTriggerDefinition);
export interface LambdaResource {
  LambdaArn?: string;
  EventTriggers?: EventTriggerDefinition[];
}
export const LambdaResource = S.suspend(() =>
  S.Struct({
    LambdaArn: S.optional(S.String),
    EventTriggers: S.optional(EventTriggerDefinitionList),
  }),
).annotations({
  identifier: "LambdaResource",
}) as any as S.Schema<LambdaResource>;
export type LambdaResourceList = LambdaResource[];
export const LambdaResourceList = S.Array(LambdaResource);
export interface Ec2AmiResource {
  AmiId: string;
  SnowballAmiId?: string;
}
export const Ec2AmiResource = S.suspend(() =>
  S.Struct({ AmiId: S.String, SnowballAmiId: S.optional(S.String) }),
).annotations({
  identifier: "Ec2AmiResource",
}) as any as S.Schema<Ec2AmiResource>;
export type Ec2AmiResourceList = Ec2AmiResource[];
export const Ec2AmiResourceList = S.Array(Ec2AmiResource);
export interface JobResource {
  S3Resources?: S3Resource[];
  LambdaResources?: LambdaResource[];
  Ec2AmiResources?: Ec2AmiResource[];
}
export const JobResource = S.suspend(() =>
  S.Struct({
    S3Resources: S.optional(S3ResourceList),
    LambdaResources: S.optional(LambdaResourceList),
    Ec2AmiResources: S.optional(Ec2AmiResourceList),
  }),
).annotations({ identifier: "JobResource" }) as any as S.Schema<JobResource>;
export type StorageUnit = "TB" | (string & {});
export const StorageUnit = S.String;
export interface NFSOnDeviceServiceConfiguration {
  StorageLimit?: number;
  StorageUnit?: StorageUnit;
}
export const NFSOnDeviceServiceConfiguration = S.suspend(() =>
  S.Struct({
    StorageLimit: S.optional(S.Number),
    StorageUnit: S.optional(StorageUnit),
  }),
).annotations({
  identifier: "NFSOnDeviceServiceConfiguration",
}) as any as S.Schema<NFSOnDeviceServiceConfiguration>;
export interface TGWOnDeviceServiceConfiguration {
  StorageLimit?: number;
  StorageUnit?: StorageUnit;
}
export const TGWOnDeviceServiceConfiguration = S.suspend(() =>
  S.Struct({
    StorageLimit: S.optional(S.Number),
    StorageUnit: S.optional(StorageUnit),
  }),
).annotations({
  identifier: "TGWOnDeviceServiceConfiguration",
}) as any as S.Schema<TGWOnDeviceServiceConfiguration>;
export interface EKSOnDeviceServiceConfiguration {
  KubernetesVersion?: string;
  EKSAnywhereVersion?: string;
}
export const EKSOnDeviceServiceConfiguration = S.suspend(() =>
  S.Struct({
    KubernetesVersion: S.optional(S.String),
    EKSAnywhereVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "EKSOnDeviceServiceConfiguration",
}) as any as S.Schema<EKSOnDeviceServiceConfiguration>;
export interface S3OnDeviceServiceConfiguration {
  StorageLimit?: number;
  StorageUnit?: StorageUnit;
  ServiceSize?: number;
  FaultTolerance?: number;
}
export const S3OnDeviceServiceConfiguration = S.suspend(() =>
  S.Struct({
    StorageLimit: S.optional(S.Number),
    StorageUnit: S.optional(StorageUnit),
    ServiceSize: S.optional(S.Number),
    FaultTolerance: S.optional(S.Number),
  }),
).annotations({
  identifier: "S3OnDeviceServiceConfiguration",
}) as any as S.Schema<S3OnDeviceServiceConfiguration>;
export interface OnDeviceServiceConfiguration {
  NFSOnDeviceService?: NFSOnDeviceServiceConfiguration;
  TGWOnDeviceService?: TGWOnDeviceServiceConfiguration;
  EKSOnDeviceService?: EKSOnDeviceServiceConfiguration;
  S3OnDeviceService?: S3OnDeviceServiceConfiguration;
}
export const OnDeviceServiceConfiguration = S.suspend(() =>
  S.Struct({
    NFSOnDeviceService: S.optional(NFSOnDeviceServiceConfiguration),
    TGWOnDeviceService: S.optional(TGWOnDeviceServiceConfiguration),
    EKSOnDeviceService: S.optional(EKSOnDeviceServiceConfiguration),
    S3OnDeviceService: S.optional(S3OnDeviceServiceConfiguration),
  }),
).annotations({
  identifier: "OnDeviceServiceConfiguration",
}) as any as S.Schema<OnDeviceServiceConfiguration>;
export type JobState =
  | "New"
  | "PreparingAppliance"
  | "PreparingShipment"
  | "InTransitToCustomer"
  | "WithCustomer"
  | "InTransitToAWS"
  | "WithAWSSortingFacility"
  | "WithAWS"
  | "InProgress"
  | "Complete"
  | "Cancelled"
  | "Listing"
  | "Pending"
  | (string & {});
export const JobState = S.String;
export type JobStateList = JobState[];
export const JobStateList = S.Array(JobState);
export interface Notification {
  SnsTopicARN?: string;
  JobStatesToNotify?: JobState[];
  NotifyAll?: boolean;
  DevicePickupSnsTopicARN?: string;
}
export const Notification = S.suspend(() =>
  S.Struct({
    SnsTopicARN: S.optional(S.String),
    JobStatesToNotify: S.optional(JobStateList),
    NotifyAll: S.optional(S.Boolean),
    DevicePickupSnsTopicARN: S.optional(S.String),
  }),
).annotations({ identifier: "Notification" }) as any as S.Schema<Notification>;
export interface UpdateClusterRequest {
  ClusterId: string;
  RoleARN?: string;
  Description?: string;
  Resources?: JobResource;
  OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
  AddressId?: string;
  ShippingOption?: ShippingOption;
  Notification?: Notification;
  ForwardingAddressId?: string;
}
export const UpdateClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    RoleARN: S.optional(S.String),
    Description: S.optional(S.String),
    Resources: S.optional(JobResource),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
    AddressId: S.optional(S.String),
    ShippingOption: S.optional(ShippingOption),
    Notification: S.optional(Notification),
    ForwardingAddressId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateClusterRequest",
}) as any as S.Schema<UpdateClusterRequest>;
export interface UpdateClusterResult {}
export const UpdateClusterResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateClusterResult",
}) as any as S.Schema<UpdateClusterResult>;
export interface PickupDetails {
  Name?: string;
  PhoneNumber?: string | redacted.Redacted<string>;
  Email?: string | redacted.Redacted<string>;
  IdentificationNumber?: string;
  IdentificationExpirationDate?: Date;
  IdentificationIssuingOrg?: string;
  DevicePickupId?: string;
}
export const PickupDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    PhoneNumber: S.optional(SensitiveString),
    Email: S.optional(SensitiveString),
    IdentificationNumber: S.optional(S.String),
    IdentificationExpirationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    IdentificationIssuingOrg: S.optional(S.String),
    DevicePickupId: S.optional(S.String),
  }),
).annotations({
  identifier: "PickupDetails",
}) as any as S.Schema<PickupDetails>;
export interface UpdateJobRequest {
  JobId: string;
  RoleARN?: string;
  Notification?: Notification;
  Resources?: JobResource;
  OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
  AddressId?: string;
  ShippingOption?: ShippingOption;
  Description?: string;
  SnowballCapacityPreference?: SnowballCapacity;
  ForwardingAddressId?: string;
  PickupDetails?: PickupDetails;
}
export const UpdateJobRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    RoleARN: S.optional(S.String),
    Notification: S.optional(Notification),
    Resources: S.optional(JobResource),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
    AddressId: S.optional(S.String),
    ShippingOption: S.optional(ShippingOption),
    Description: S.optional(S.String),
    SnowballCapacityPreference: S.optional(SnowballCapacity),
    ForwardingAddressId: S.optional(S.String),
    PickupDetails: S.optional(PickupDetails),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateJobRequest",
}) as any as S.Schema<UpdateJobRequest>;
export interface UpdateJobResult {}
export const UpdateJobResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateJobResult",
}) as any as S.Schema<UpdateJobResult>;
export interface UpdateJobShipmentStateRequest {
  JobId: string;
  ShipmentState: ShipmentState;
}
export const UpdateJobShipmentStateRequest = S.suspend(() =>
  S.Struct({ JobId: S.String, ShipmentState: ShipmentState }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateJobShipmentStateRequest",
}) as any as S.Schema<UpdateJobShipmentStateRequest>;
export interface UpdateJobShipmentStateResult {}
export const UpdateJobShipmentStateResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateJobShipmentStateResult",
}) as any as S.Schema<UpdateJobShipmentStateResult>;
export interface UpdateLongTermPricingRequest {
  LongTermPricingId: string;
  ReplacementJob?: string;
  IsLongTermPricingAutoRenew?: boolean;
}
export const UpdateLongTermPricingRequest = S.suspend(() =>
  S.Struct({
    LongTermPricingId: S.String,
    ReplacementJob: S.optional(S.String),
    IsLongTermPricingAutoRenew: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLongTermPricingRequest",
}) as any as S.Schema<UpdateLongTermPricingRequest>;
export interface UpdateLongTermPricingResult {}
export const UpdateLongTermPricingResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLongTermPricingResult",
}) as any as S.Schema<UpdateLongTermPricingResult>;
export type AddressType = "CUST_PICKUP" | "AWS_SHIP" | (string & {});
export const AddressType = S.String;
export interface Address {
  AddressId?: string;
  Name?: string;
  Company?: string;
  Street1?: string;
  Street2?: string;
  Street3?: string;
  City?: string;
  StateOrProvince?: string;
  PrefectureOrDistrict?: string;
  Landmark?: string;
  Country?: string;
  PostalCode?: string;
  PhoneNumber?: string;
  IsRestricted?: boolean;
  Type?: AddressType;
}
export const Address = S.suspend(() =>
  S.Struct({
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
    Type: S.optional(AddressType),
  }),
).annotations({ identifier: "Address" }) as any as S.Schema<Address>;
export type ShippingLabelStatus =
  | "InProgress"
  | "TimedOut"
  | "Succeeded"
  | "Failed"
  | (string & {});
export const ShippingLabelStatus = S.String;
export type AddressList = Address[];
export const AddressList = S.Array(Address);
export interface Shipment {
  Status?: string;
  TrackingNumber?: string;
}
export const Shipment = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    TrackingNumber: S.optional(S.String),
  }),
).annotations({ identifier: "Shipment" }) as any as S.Schema<Shipment>;
export interface ShippingDetails {
  ShippingOption?: ShippingOption;
  InboundShipment?: Shipment;
  OutboundShipment?: Shipment;
}
export const ShippingDetails = S.suspend(() =>
  S.Struct({
    ShippingOption: S.optional(ShippingOption),
    InboundShipment: S.optional(Shipment),
    OutboundShipment: S.optional(Shipment),
  }),
).annotations({
  identifier: "ShippingDetails",
}) as any as S.Schema<ShippingDetails>;
export interface DataTransfer {
  BytesTransferred?: number;
  ObjectsTransferred?: number;
  TotalBytes?: number;
  TotalObjects?: number;
}
export const DataTransfer = S.suspend(() =>
  S.Struct({
    BytesTransferred: S.optional(S.Number),
    ObjectsTransferred: S.optional(S.Number),
    TotalBytes: S.optional(S.Number),
    TotalObjects: S.optional(S.Number),
  }),
).annotations({ identifier: "DataTransfer" }) as any as S.Schema<DataTransfer>;
export interface JobLogs {
  JobCompletionReportURI?: string;
  JobSuccessLogURI?: string;
  JobFailureLogURI?: string;
}
export const JobLogs = S.suspend(() =>
  S.Struct({
    JobCompletionReportURI: S.optional(S.String),
    JobSuccessLogURI: S.optional(S.String),
    JobFailureLogURI: S.optional(S.String),
  }),
).annotations({ identifier: "JobLogs" }) as any as S.Schema<JobLogs>;
export interface INDTaxDocuments {
  GSTIN?: string;
}
export const INDTaxDocuments = S.suspend(() =>
  S.Struct({ GSTIN: S.optional(S.String) }),
).annotations({
  identifier: "INDTaxDocuments",
}) as any as S.Schema<INDTaxDocuments>;
export interface TaxDocuments {
  IND?: INDTaxDocuments;
}
export const TaxDocuments = S.suspend(() =>
  S.Struct({ IND: S.optional(INDTaxDocuments) }),
).annotations({ identifier: "TaxDocuments" }) as any as S.Schema<TaxDocuments>;
export interface WirelessConnection {
  IsWifiEnabled?: boolean;
}
export const WirelessConnection = S.suspend(() =>
  S.Struct({ IsWifiEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "WirelessConnection",
}) as any as S.Schema<WirelessConnection>;
export interface SnowconeDeviceConfiguration {
  WirelessConnection?: WirelessConnection;
}
export const SnowconeDeviceConfiguration = S.suspend(() =>
  S.Struct({ WirelessConnection: S.optional(WirelessConnection) }),
).annotations({
  identifier: "SnowconeDeviceConfiguration",
}) as any as S.Schema<SnowconeDeviceConfiguration>;
export interface DeviceConfiguration {
  SnowconeDeviceConfiguration?: SnowconeDeviceConfiguration;
}
export const DeviceConfiguration = S.suspend(() =>
  S.Struct({
    SnowconeDeviceConfiguration: S.optional(SnowconeDeviceConfiguration),
  }),
).annotations({
  identifier: "DeviceConfiguration",
}) as any as S.Schema<DeviceConfiguration>;
export interface JobMetadata {
  JobId?: string;
  JobState?: JobState;
  JobType?: JobType;
  SnowballType?: SnowballType;
  CreationDate?: Date;
  Resources?: JobResource;
  Description?: string;
  KmsKeyARN?: string;
  RoleARN?: string;
  AddressId?: string;
  ShippingDetails?: ShippingDetails;
  SnowballCapacityPreference?: SnowballCapacity;
  Notification?: Notification;
  DataTransferProgress?: DataTransfer;
  JobLogInfo?: JobLogs;
  ClusterId?: string;
  ForwardingAddressId?: string;
  TaxDocuments?: TaxDocuments;
  DeviceConfiguration?: DeviceConfiguration;
  RemoteManagement?: RemoteManagement;
  LongTermPricingId?: string;
  OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
  ImpactLevel?: ImpactLevel;
  PickupDetails?: PickupDetails;
  SnowballId?: string;
}
export const JobMetadata = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    JobState: S.optional(JobState),
    JobType: S.optional(JobType),
    SnowballType: S.optional(SnowballType),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Resources: S.optional(JobResource),
    Description: S.optional(S.String),
    KmsKeyARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
    AddressId: S.optional(S.String),
    ShippingDetails: S.optional(ShippingDetails),
    SnowballCapacityPreference: S.optional(SnowballCapacity),
    Notification: S.optional(Notification),
    DataTransferProgress: S.optional(DataTransfer),
    JobLogInfo: S.optional(JobLogs),
    ClusterId: S.optional(S.String),
    ForwardingAddressId: S.optional(S.String),
    TaxDocuments: S.optional(TaxDocuments),
    DeviceConfiguration: S.optional(DeviceConfiguration),
    RemoteManagement: S.optional(RemoteManagement),
    LongTermPricingId: S.optional(S.String),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
    ImpactLevel: S.optional(ImpactLevel),
    PickupDetails: S.optional(PickupDetails),
    SnowballId: S.optional(S.String),
  }),
).annotations({ identifier: "JobMetadata" }) as any as S.Schema<JobMetadata>;
export type JobMetadataList = JobMetadata[];
export const JobMetadataList = S.Array(JobMetadata);
export interface CreateAddressRequest {
  Address: Address;
}
export const CreateAddressRequest = S.suspend(() =>
  S.Struct({ Address: Address }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAddressRequest",
}) as any as S.Schema<CreateAddressRequest>;
export interface CreateLongTermPricingResult {
  LongTermPricingId?: string;
}
export const CreateLongTermPricingResult = S.suspend(() =>
  S.Struct({ LongTermPricingId: S.optional(S.String) }),
).annotations({
  identifier: "CreateLongTermPricingResult",
}) as any as S.Schema<CreateLongTermPricingResult>;
export interface CreateReturnShippingLabelResult {
  Status?: ShippingLabelStatus;
}
export const CreateReturnShippingLabelResult = S.suspend(() =>
  S.Struct({ Status: S.optional(ShippingLabelStatus) }),
).annotations({
  identifier: "CreateReturnShippingLabelResult",
}) as any as S.Schema<CreateReturnShippingLabelResult>;
export interface DescribeAddressResult {
  Address?: Address;
}
export const DescribeAddressResult = S.suspend(() =>
  S.Struct({ Address: S.optional(Address) }),
).annotations({
  identifier: "DescribeAddressResult",
}) as any as S.Schema<DescribeAddressResult>;
export interface DescribeAddressesResult {
  Addresses?: Address[];
  NextToken?: string;
}
export const DescribeAddressesResult = S.suspend(() =>
  S.Struct({
    Addresses: S.optional(AddressList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAddressesResult",
}) as any as S.Schema<DescribeAddressesResult>;
export interface DescribeReturnShippingLabelResult {
  Status?: ShippingLabelStatus;
  ExpirationDate?: Date;
  ReturnShippingLabelURI?: string;
}
export const DescribeReturnShippingLabelResult = S.suspend(() =>
  S.Struct({
    Status: S.optional(ShippingLabelStatus),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ReturnShippingLabelURI: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeReturnShippingLabelResult",
}) as any as S.Schema<DescribeReturnShippingLabelResult>;
export interface GetJobManifestResult {
  ManifestURI?: string;
}
export const GetJobManifestResult = S.suspend(() =>
  S.Struct({ ManifestURI: S.optional(S.String) }),
).annotations({
  identifier: "GetJobManifestResult",
}) as any as S.Schema<GetJobManifestResult>;
export interface GetJobUnlockCodeResult {
  UnlockCode?: string;
}
export const GetJobUnlockCodeResult = S.suspend(() =>
  S.Struct({ UnlockCode: S.optional(S.String) }),
).annotations({
  identifier: "GetJobUnlockCodeResult",
}) as any as S.Schema<GetJobUnlockCodeResult>;
export interface GetSoftwareUpdatesResult {
  UpdatesURI?: string;
}
export const GetSoftwareUpdatesResult = S.suspend(() =>
  S.Struct({ UpdatesURI: S.optional(S.String) }),
).annotations({
  identifier: "GetSoftwareUpdatesResult",
}) as any as S.Schema<GetSoftwareUpdatesResult>;
export interface JobListEntry {
  JobId?: string;
  JobState?: JobState;
  IsMaster?: boolean;
  JobType?: JobType;
  SnowballType?: SnowballType;
  CreationDate?: Date;
  Description?: string;
}
export const JobListEntry = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    JobState: S.optional(JobState),
    IsMaster: S.optional(S.Boolean),
    JobType: S.optional(JobType),
    SnowballType: S.optional(SnowballType),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "JobListEntry" }) as any as S.Schema<JobListEntry>;
export type JobListEntryList = JobListEntry[];
export const JobListEntryList = S.Array(JobListEntry);
export interface ListJobsResult {
  JobListEntries?: JobListEntry[];
  NextToken?: string;
}
export const ListJobsResult = S.suspend(() =>
  S.Struct({
    JobListEntries: S.optional(JobListEntryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobsResult",
}) as any as S.Schema<ListJobsResult>;
export interface ListPickupLocationsResult {
  Addresses?: Address[];
  NextToken?: string;
}
export const ListPickupLocationsResult = S.suspend(() =>
  S.Struct({
    Addresses: S.optional(AddressList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPickupLocationsResult",
}) as any as S.Schema<ListPickupLocationsResult>;
export type ClusterState =
  | "AwaitingQuorum"
  | "Pending"
  | "InUse"
  | "Complete"
  | "Cancelled"
  | (string & {});
export const ClusterState = S.String;
export type LongTermPricingAssociatedJobIdList = string[];
export const LongTermPricingAssociatedJobIdList = S.Array(S.String);
export interface ServiceVersion {
  Version?: string;
}
export const ServiceVersion = S.suspend(() =>
  S.Struct({ Version: S.optional(S.String) }),
).annotations({
  identifier: "ServiceVersion",
}) as any as S.Schema<ServiceVersion>;
export interface ClusterMetadata {
  ClusterId?: string;
  Description?: string;
  KmsKeyARN?: string;
  RoleARN?: string;
  ClusterState?: ClusterState;
  JobType?: JobType;
  SnowballType?: SnowballType;
  CreationDate?: Date;
  Resources?: JobResource;
  AddressId?: string;
  ShippingOption?: ShippingOption;
  Notification?: Notification;
  ForwardingAddressId?: string;
  TaxDocuments?: TaxDocuments;
  OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
}
export const ClusterMetadata = S.suspend(() =>
  S.Struct({
    ClusterId: S.optional(S.String),
    Description: S.optional(S.String),
    KmsKeyARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
    ClusterState: S.optional(ClusterState),
    JobType: S.optional(JobType),
    SnowballType: S.optional(SnowballType),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Resources: S.optional(JobResource),
    AddressId: S.optional(S.String),
    ShippingOption: S.optional(ShippingOption),
    Notification: S.optional(Notification),
    ForwardingAddressId: S.optional(S.String),
    TaxDocuments: S.optional(TaxDocuments),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
  }),
).annotations({
  identifier: "ClusterMetadata",
}) as any as S.Schema<ClusterMetadata>;
export interface ClusterListEntry {
  ClusterId?: string;
  ClusterState?: ClusterState;
  CreationDate?: Date;
  Description?: string;
}
export const ClusterListEntry = S.suspend(() =>
  S.Struct({
    ClusterId: S.optional(S.String),
    ClusterState: S.optional(ClusterState),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterListEntry",
}) as any as S.Schema<ClusterListEntry>;
export type ClusterListEntryList = ClusterListEntry[];
export const ClusterListEntryList = S.Array(ClusterListEntry);
export interface CompatibleImage {
  AmiId?: string;
  Name?: string;
}
export const CompatibleImage = S.suspend(() =>
  S.Struct({ AmiId: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "CompatibleImage",
}) as any as S.Schema<CompatibleImage>;
export type CompatibleImageList = CompatibleImage[];
export const CompatibleImageList = S.Array(CompatibleImage);
export interface LongTermPricingListEntry {
  LongTermPricingId?: string;
  LongTermPricingEndDate?: Date;
  LongTermPricingStartDate?: Date;
  LongTermPricingType?: LongTermPricingType;
  CurrentActiveJob?: string;
  ReplacementJob?: string;
  IsLongTermPricingAutoRenew?: boolean;
  LongTermPricingStatus?: string;
  SnowballType?: SnowballType;
  JobIds?: string[];
}
export const LongTermPricingListEntry = S.suspend(() =>
  S.Struct({
    LongTermPricingId: S.optional(S.String),
    LongTermPricingEndDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LongTermPricingStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LongTermPricingType: S.optional(LongTermPricingType),
    CurrentActiveJob: S.optional(S.String),
    ReplacementJob: S.optional(S.String),
    IsLongTermPricingAutoRenew: S.optional(S.Boolean),
    LongTermPricingStatus: S.optional(S.String),
    SnowballType: S.optional(SnowballType),
    JobIds: S.optional(LongTermPricingAssociatedJobIdList),
  }),
).annotations({
  identifier: "LongTermPricingListEntry",
}) as any as S.Schema<LongTermPricingListEntry>;
export type LongTermPricingEntryList = LongTermPricingListEntry[];
export const LongTermPricingEntryList = S.Array(LongTermPricingListEntry);
export interface DependentService {
  ServiceName?: ServiceName;
  ServiceVersion?: ServiceVersion;
}
export const DependentService = S.suspend(() =>
  S.Struct({
    ServiceName: S.optional(ServiceName),
    ServiceVersion: S.optional(ServiceVersion),
  }),
).annotations({
  identifier: "DependentService",
}) as any as S.Schema<DependentService>;
export type DependentServiceList = DependentService[];
export const DependentServiceList = S.Array(DependentService);
export interface CreateAddressResult {
  AddressId?: string;
}
export const CreateAddressResult = S.suspend(() =>
  S.Struct({ AddressId: S.optional(S.String) }),
).annotations({
  identifier: "CreateAddressResult",
}) as any as S.Schema<CreateAddressResult>;
export interface DescribeClusterResult {
  ClusterMetadata?: ClusterMetadata;
}
export const DescribeClusterResult = S.suspend(() =>
  S.Struct({ ClusterMetadata: S.optional(ClusterMetadata) }),
).annotations({
  identifier: "DescribeClusterResult",
}) as any as S.Schema<DescribeClusterResult>;
export interface ListClusterJobsResult {
  JobListEntries?: JobListEntry[];
  NextToken?: string;
}
export const ListClusterJobsResult = S.suspend(() =>
  S.Struct({
    JobListEntries: S.optional(JobListEntryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListClusterJobsResult",
}) as any as S.Schema<ListClusterJobsResult>;
export interface ListClustersResult {
  ClusterListEntries?: ClusterListEntry[];
  NextToken?: string;
}
export const ListClustersResult = S.suspend(() =>
  S.Struct({
    ClusterListEntries: S.optional(ClusterListEntryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListClustersResult",
}) as any as S.Schema<ListClustersResult>;
export interface ListCompatibleImagesResult {
  CompatibleImages?: CompatibleImage[];
  NextToken?: string;
}
export const ListCompatibleImagesResult = S.suspend(() =>
  S.Struct({
    CompatibleImages: S.optional(CompatibleImageList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCompatibleImagesResult",
}) as any as S.Schema<ListCompatibleImagesResult>;
export interface ListLongTermPricingResult {
  LongTermPricingEntries?: LongTermPricingListEntry[];
  NextToken?: string;
}
export const ListLongTermPricingResult = S.suspend(() =>
  S.Struct({
    LongTermPricingEntries: S.optional(LongTermPricingEntryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLongTermPricingResult",
}) as any as S.Schema<ListLongTermPricingResult>;
export interface ListServiceVersionsRequest {
  ServiceName: ServiceName;
  DependentServices?: DependentService[];
  MaxResults?: number;
  NextToken?: string;
}
export const ListServiceVersionsRequest = S.suspend(() =>
  S.Struct({
    ServiceName: ServiceName,
    DependentServices: S.optional(DependentServiceList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceVersionsRequest",
}) as any as S.Schema<ListServiceVersionsRequest>;
export type ServiceVersionList = ServiceVersion[];
export const ServiceVersionList = S.Array(ServiceVersion);
export interface CreateClusterRequest {
  JobType: JobType;
  Resources?: JobResource;
  OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
  Description?: string;
  AddressId: string;
  KmsKeyARN?: string;
  RoleARN?: string;
  SnowballType: SnowballType;
  ShippingOption: ShippingOption;
  Notification?: Notification;
  ForwardingAddressId?: string;
  TaxDocuments?: TaxDocuments;
  RemoteManagement?: RemoteManagement;
  InitialClusterSize?: number;
  ForceCreateJobs?: boolean;
  LongTermPricingIds?: string[];
  SnowballCapacityPreference?: SnowballCapacity;
}
export const CreateClusterRequest = S.suspend(() =>
  S.Struct({
    JobType: JobType,
    Resources: S.optional(JobResource),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
    Description: S.optional(S.String),
    AddressId: S.String,
    KmsKeyARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
    SnowballType: SnowballType,
    ShippingOption: ShippingOption,
    Notification: S.optional(Notification),
    ForwardingAddressId: S.optional(S.String),
    TaxDocuments: S.optional(TaxDocuments),
    RemoteManagement: S.optional(RemoteManagement),
    InitialClusterSize: S.optional(S.Number),
    ForceCreateJobs: S.optional(S.Boolean),
    LongTermPricingIds: S.optional(LongTermPricingIdList),
    SnowballCapacityPreference: S.optional(SnowballCapacity),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateClusterRequest",
}) as any as S.Schema<CreateClusterRequest>;
export interface CreateJobRequest {
  JobType?: JobType;
  Resources?: JobResource;
  OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
  Description?: string;
  AddressId?: string;
  KmsKeyARN?: string;
  RoleARN?: string;
  SnowballCapacityPreference?: SnowballCapacity;
  ShippingOption?: ShippingOption;
  Notification?: Notification;
  ClusterId?: string;
  SnowballType?: SnowballType;
  ForwardingAddressId?: string;
  TaxDocuments?: TaxDocuments;
  DeviceConfiguration?: DeviceConfiguration;
  RemoteManagement?: RemoteManagement;
  LongTermPricingId?: string;
  ImpactLevel?: ImpactLevel;
  PickupDetails?: PickupDetails;
}
export const CreateJobRequest = S.suspend(() =>
  S.Struct({
    JobType: S.optional(JobType),
    Resources: S.optional(JobResource),
    OnDeviceServiceConfiguration: S.optional(OnDeviceServiceConfiguration),
    Description: S.optional(S.String),
    AddressId: S.optional(S.String),
    KmsKeyARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
    SnowballCapacityPreference: S.optional(SnowballCapacity),
    ShippingOption: S.optional(ShippingOption),
    Notification: S.optional(Notification),
    ClusterId: S.optional(S.String),
    SnowballType: S.optional(SnowballType),
    ForwardingAddressId: S.optional(S.String),
    TaxDocuments: S.optional(TaxDocuments),
    DeviceConfiguration: S.optional(DeviceConfiguration),
    RemoteManagement: S.optional(RemoteManagement),
    LongTermPricingId: S.optional(S.String),
    ImpactLevel: S.optional(ImpactLevel),
    PickupDetails: S.optional(PickupDetails),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateJobRequest",
}) as any as S.Schema<CreateJobRequest>;
export interface ListServiceVersionsResult {
  ServiceVersions: ServiceVersion[];
  ServiceName: ServiceName;
  DependentServices?: DependentService[];
  NextToken?: string;
}
export const ListServiceVersionsResult = S.suspend(() =>
  S.Struct({
    ServiceVersions: ServiceVersionList,
    ServiceName: ServiceName,
    DependentServices: S.optional(DependentServiceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListServiceVersionsResult",
}) as any as S.Schema<ListServiceVersionsResult>;
export interface CreateClusterResult {
  ClusterId?: string;
  JobListEntries?: JobListEntry[];
}
export const CreateClusterResult = S.suspend(() =>
  S.Struct({
    ClusterId: S.optional(S.String),
    JobListEntries: S.optional(JobListEntryList),
  }),
).annotations({
  identifier: "CreateClusterResult",
}) as any as S.Schema<CreateClusterResult>;
export interface CreateJobResult {
  JobId?: string;
}
export const CreateJobResult = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "CreateJobResult",
}) as any as S.Schema<CreateJobResult>;
export interface DescribeJobResult {
  JobMetadata?: JobMetadata;
  SubJobMetadata?: JobMetadata[];
}
export const DescribeJobResult = S.suspend(() =>
  S.Struct({
    JobMetadata: S.optional(JobMetadata),
    SubJobMetadata: S.optional(JobMetadataList),
  }),
).annotations({
  identifier: "DescribeJobResult",
}) as any as S.Schema<DescribeJobResult>;

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
export const getSnowballUsage: (
  input: GetSnowballUsageRequest,
) => effect.Effect<
  GetSnowballUsageResult,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSnowballUsageRequest,
  output: GetSnowballUsageResult,
  errors: [],
}));
/**
 * Updates the long-term pricing type.
 */
export const updateLongTermPricing: (
  input: UpdateLongTermPricingRequest,
) => effect.Effect<
  UpdateLongTermPricingResult,
  InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLongTermPricingRequest,
  output: UpdateLongTermPricingResult,
  errors: [InvalidResourceException],
}));
/**
 * Updates the state when a shipment state changes to a different state.
 */
export const updateJobShipmentState: (
  input: UpdateJobShipmentStateRequest,
) => effect.Effect<
  UpdateJobShipmentStateResult,
  InvalidJobStateException | InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobShipmentStateRequest,
  output: UpdateJobShipmentStateResult,
  errors: [InvalidJobStateException, InvalidResourceException],
}));
/**
 * Creates a job with the long-term usage option for a device. The long-term usage is a
 * 1-year or 3-year long-term pricing type for the device. You are billed upfront, and Amazon Web Services provides discounts for long-term pricing.
 */
export const createLongTermPricing: (
  input: CreateLongTermPricingRequest,
) => effect.Effect<
  CreateLongTermPricingResult,
  InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLongTermPricingRequest,
  output: CreateLongTermPricingResult,
  errors: [InvalidResourceException],
}));
/**
 * Takes an `AddressId` and returns specific details about that address in the
 * form of an `Address` object.
 */
export const describeAddress: (
  input: DescribeAddressRequest,
) => effect.Effect<
  DescribeAddressResult,
  InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJobManifest: (
  input: GetJobManifestRequest,
) => effect.Effect<
  GetJobManifestResult,
  InvalidJobStateException | InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJobUnlockCode: (
  input: GetJobUnlockCodeRequest,
) => effect.Effect<
  GetJobUnlockCodeResult,
  InvalidJobStateException | InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobUnlockCodeRequest,
  output: GetJobUnlockCodeResult,
  errors: [InvalidJobStateException, InvalidResourceException],
}));
/**
 * Returns an Amazon S3 presigned URL for an update file associated with a specified
 * `JobId`.
 */
export const getSoftwareUpdates: (
  input: GetSoftwareUpdatesRequest,
) => effect.Effect<
  GetSoftwareUpdatesResult,
  InvalidJobStateException | InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSoftwareUpdatesRequest,
  output: GetSoftwareUpdatesResult,
  errors: [InvalidJobStateException, InvalidResourceException],
}));
/**
 * A list of locations from which the customer can choose to pickup a device.
 */
export const listPickupLocations: {
  (
    input: ListPickupLocationsRequest,
  ): effect.Effect<
    ListPickupLocationsResult,
    InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPickupLocationsRequest,
  ) => stream.Stream<
    ListPickupLocationsResult,
    InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPickupLocationsRequest,
  ) => stream.Stream<
    unknown,
    InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeAddresses: {
  (
    input: DescribeAddressesRequest,
  ): effect.Effect<
    DescribeAddressesResult,
    InvalidNextTokenException | InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAddressesRequest,
  ) => stream.Stream<
    DescribeAddressesResult,
    InvalidNextTokenException | InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAddressesRequest,
  ) => stream.Stream<
    Address,
    InvalidNextTokenException | InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAddressesRequest,
  output: DescribeAddressesResult,
  errors: [InvalidNextTokenException, InvalidResourceException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Addresses",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about a specific cluster including shipping information, cluster
 * status, and other important metadata.
 */
export const describeCluster: (
  input: DescribeClusterRequest,
) => effect.Effect<
  DescribeClusterResult,
  InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterRequest,
  output: DescribeClusterResult,
  errors: [InvalidResourceException],
}));
/**
 * Returns an array of `JobListEntry` objects of the specified length. Each
 * `JobListEntry` object is for a job in the specified cluster and contains a job's
 * state, a job's ID, and other information.
 */
export const listClusterJobs: {
  (
    input: ListClusterJobsRequest,
  ): effect.Effect<
    ListClusterJobsResult,
    InvalidNextTokenException | InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClusterJobsRequest,
  ) => stream.Stream<
    ListClusterJobsResult,
    InvalidNextTokenException | InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClusterJobsRequest,
  ) => stream.Stream<
    JobListEntry,
    InvalidNextTokenException | InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClusterJobsRequest,
  output: ListClusterJobsResult,
  errors: [InvalidNextTokenException, InvalidResourceException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "JobListEntries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns an array of `ClusterListEntry` objects of the specified length. Each
 * `ClusterListEntry` object contains a cluster's state, a cluster's ID, and other
 * important status information.
 */
export const listClusters: {
  (
    input: ListClustersRequest,
  ): effect.Effect<
    ListClustersResult,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersRequest,
  ) => stream.Stream<
    ListClustersResult,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersRequest,
  ) => stream.Stream<
    ClusterListEntry,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersRequest,
  output: ListClustersResult,
  errors: [InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ClusterListEntries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This action returns a list of the different Amazon EC2-compatible Amazon Machine Images (AMIs)
 * that are owned by your Amazon Web Services accountthat would be supported for use on a Snow
 * device. Currently, supported AMIs are based on the Amazon Linux-2, Ubuntu 20.04 LTS - Focal, or Ubuntu 22.04 LTS - Jammy images, available on the
 * Amazon Web Services Marketplace. Ubuntu 16.04 LTS - Xenial (HVM) images are no longer supported in the Market, but still supported for use on devices through Amazon EC2 VM Import/Export and running locally in AMIs.
 */
export const listCompatibleImages: {
  (
    input: ListCompatibleImagesRequest,
  ): effect.Effect<
    ListCompatibleImagesResult,
    Ec2RequestFailedException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCompatibleImagesRequest,
  ) => stream.Stream<
    ListCompatibleImagesResult,
    Ec2RequestFailedException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCompatibleImagesRequest,
  ) => stream.Stream<
    CompatibleImage,
    Ec2RequestFailedException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listLongTermPricing: {
  (
    input: ListLongTermPricingRequest,
  ): effect.Effect<
    ListLongTermPricingResult,
    InvalidNextTokenException | InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLongTermPricingRequest,
  ) => stream.Stream<
    ListLongTermPricingResult,
    InvalidNextTokenException | InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLongTermPricingRequest,
  ) => stream.Stream<
    LongTermPricingListEntry,
    InvalidNextTokenException | InvalidResourceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const cancelJob: (
  input: CancelJobRequest,
) => effect.Effect<
  CancelJobResult,
  | InvalidJobStateException
  | InvalidResourceException
  | KMSRequestFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeReturnShippingLabel: (
  input: DescribeReturnShippingLabelRequest,
) => effect.Effect<
  DescribeReturnShippingLabelResult,
  | ConflictException
  | InvalidJobStateException
  | InvalidResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReturnShippingLabelRequest,
  output: DescribeReturnShippingLabelResult,
  errors: [
    ConflictException,
    InvalidJobStateException,
    InvalidResourceException,
  ],
}));
/**
 * Returns an array of `JobListEntry` objects of the specified length. Each
 * `JobListEntry` object contains a job's state, a job's ID, and a value that
 * indicates whether the job is a job part, in the case of export jobs. Calling this API action
 * in one of the US regions will return jobs from the list of all jobs associated with this
 * account in all US regions.
 */
export const listJobs: {
  (
    input: ListJobsRequest,
  ): effect.Effect<
    ListJobsResult,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => stream.Stream<
    ListJobsResult,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => stream.Stream<
    JobListEntry,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateJob: (
  input: UpdateJobRequest,
) => effect.Effect<
  UpdateJobResult,
  | ClusterLimitExceededException
  | Ec2RequestFailedException
  | InvalidInputCombinationException
  | InvalidJobStateException
  | InvalidResourceException
  | KMSRequestFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelCluster: (
  input: CancelClusterRequest,
) => effect.Effect<
  CancelClusterResult,
  | InvalidJobStateException
  | InvalidResourceException
  | KMSRequestFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCluster: (
  input: UpdateClusterRequest,
) => effect.Effect<
  UpdateClusterResult,
  | Ec2RequestFailedException
  | InvalidInputCombinationException
  | InvalidJobStateException
  | InvalidResourceException
  | KMSRequestFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listServiceVersions: (
  input: ListServiceVersionsRequest,
) => effect.Effect<
  ListServiceVersionsResult,
  InvalidNextTokenException | InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServiceVersionsRequest,
  output: ListServiceVersionsResult,
  errors: [InvalidNextTokenException, InvalidResourceException],
}));
/**
 * Creates a shipping label that will be used to return the Snow device to Amazon Web Services.
 */
export const createReturnShippingLabel: (
  input: CreateReturnShippingLabelRequest,
) => effect.Effect<
  CreateReturnShippingLabelResult,
  | ConflictException
  | InvalidInputCombinationException
  | InvalidJobStateException
  | InvalidResourceException
  | ReturnShippingLabelAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReturnShippingLabelRequest,
  output: CreateReturnShippingLabelResult,
  errors: [
    ConflictException,
    InvalidInputCombinationException,
    InvalidJobStateException,
    InvalidResourceException,
    ReturnShippingLabelAlreadyExistsException,
  ],
}));
/**
 * Creates an address for a Snow device to be shipped to. In most regions,
 * addresses are validated at the time of creation. The address you provide must be located
 * within the serviceable area of your region. If the address is invalid or unsupported, then an
 * exception is thrown. If providing an address as a JSON file through the `cli-input-json` option, include the full file path. For example, `--cli-input-json file://create-address.json`.
 */
export const createAddress: (
  input: CreateAddressRequest,
) => effect.Effect<
  CreateAddressResult,
  InvalidAddressException | UnsupportedAddressException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddressRequest,
  output: CreateAddressResult,
  errors: [InvalidAddressException, UnsupportedAddressException],
}));
/**
 * Creates an empty cluster. Each cluster supports five nodes. You use the CreateJob action separately to create the jobs for each of these nodes. The
 * cluster does not ship until these five node jobs have been created.
 */
export const createCluster: (
  input: CreateClusterRequest,
) => effect.Effect<
  CreateClusterResult,
  | Ec2RequestFailedException
  | InvalidInputCombinationException
  | InvalidResourceException
  | KMSRequestFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createJob: (
  input: CreateJobRequest,
) => effect.Effect<
  CreateJobResult,
  | ClusterLimitExceededException
  | Ec2RequestFailedException
  | InvalidInputCombinationException
  | InvalidResourceException
  | KMSRequestFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeJob: (
  input: DescribeJobRequest,
) => effect.Effect<
  DescribeJobResult,
  InvalidResourceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRequest,
  output: DescribeJobResult,
  errors: [InvalidResourceException],
}));
