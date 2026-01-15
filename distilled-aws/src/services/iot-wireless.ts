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
  sdkId: "IoT Wireless",
  serviceShapeName: "iotwireless",
});
const auth = T.AwsAuthSigv4({ name: "iotwireless" });
const ver = T.ServiceVersion("2020-11-22");
const proto = T.AwsProtocolsRestJson1();
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
              `https://api.iotwireless-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://api.iotwireless-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://api.iotwireless.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://api.iotwireless.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClientRequestToken = string;
export type FuotaTaskId = string;
export type MulticastGroupId = string;
export type WirelessDeviceId = string;
export type ThingArn = string;
export type WirelessGatewayId = string;
export type IotCertificateId = string;
export type DestinationName = string;
export type Expression = string;
export type Description = string;
export type RoleArn = string;
export type DeviceProfileName = string;
export type FuotaTaskName = string;
export type FirmwareUpdateImage = string;
export type FirmwareUpdateRole = string;
export type RedundancyPercent = number;
export type FragmentSizeBytes = number;
export type FragmentIntervalMS = number;
export type FileDescriptor = string;
export type MulticastGroupName = string;
export type NetworkAnalyzerConfigurationName = string;
export type ServiceProfileName = string;
export type WirelessDeviceName = string;
export type WirelessGatewayName = string;
export type WirelessGatewayTaskDefinitionId = string;
export type AutoCreateTasks = boolean;
export type WirelessGatewayTaskName = string;
export type DeviceProfileId = string;
export type MessageId = string;
export type ServiceProfileId = string;
export type ImportTaskId = string;
export type Identifier = string;
export type PartnerAccountId = string;
export type PositionResourceIdentifier = string;
export type CreationDate = Date;
export type ResourceIdentifier = string;
export type ResourceType = string;
export type MaxResults = number;
export type NextToken = string;
export type AmazonResourceName = string;
export type Message = string;
export type PayloadData = string;
export type TransmitMode = number;
export type QueryString = string;
export type DeviceName = string;
export type TagKey = string;
export type PositionCoordinateValue = number;
export type JoinEui = string;
export type NetId = string;
export type GatewayMaxEirp = number;
export type AmazonId = string;
export type AppServerPrivateKey = string | redacted.Redacted<string>;
export type TagValue = string;
export type SupportsClassB = boolean;
export type ClassBTimeout = number;
export type PingSlotPeriod = number;
export type PingSlotDr = number;
export type PingSlotFreq = number;
export type SupportsClassC = boolean;
export type ClassCTimeout = number;
export type MacVersion = string;
export type RegParamsRevision = string;
export type RxDelay1 = number;
export type RxDrOffset1 = number;
export type RxDataRate2 = number;
export type RxFreq2 = number;
export type PresetFreq = number;
export type MaxEirp = number;
export type MaxDutyCycle = number;
export type RfRegion = string;
export type SupportsJoin = boolean;
export type Supports32BitFCnt = boolean;
export type AddGwMetadata = boolean;
export type DrMinBox = number;
export type DrMaxBox = number;
export type PrAllowed = boolean;
export type RaAllowed = boolean;
export type TxPowerIndexMin = number;
export type TxPowerIndexMax = number;
export type NbTransMin = number;
export type NbTransMax = number;
export type DevEui = string;
export type SidewalkManufacturingSn = string;
export type GatewayEui = string;
export type SubBand = number;
export type UpdateDataSource = string;
export type MetricQueryId = string;
export type MetricQueryStartTimestamp = Date;
export type MetricQueryEndTimestamp = Date;
export type MacAddress = string;
export type RSS = number;
export type IPAddress = string;
export type GnssNav = string;
export type GPST = number;
export type CaptureTimeAccuracy = number;
export type Coordinate = number;
export type Use2DSolver = boolean;
export type StartTime = Date;
export type DlDr = number;
export type DlFreq = number;
export type SessionStartTimeTimestamp = Date;
export type SessionTimeout = number;
export type DeviceCreationFile = string;
export type Role = string;
export type DestinationArn = string;
export type DeviceProfileArn = string;
export type FuotaTaskArn = string;
export type CreatedAt = Date;
export type MulticastGroupArn = string;
export type MulticastGroupStatus = string;
export type NetworkAnalyzerConfigurationArn = string;
export type AccountLinked = boolean;
export type PositionSolverVersion = string;
export type ISODateTimeString = string;
export type EndPoint = string;
export type CertificatePEM = string;
export type ServiceProfileArn = string;
export type WirelessDeviceArn = string;
export type ThingName = string;
export type ImportTaskArn = string;
export type CreationTime = Date;
export type StatusReason = string;
export type ImportedWirelessDeviceCount = number;
export type WirelessGatewayArn = string;
export type WirelessGatewayTaskDefinitionArn = string;
export type ResourceId = string;
export type Result = string;
export type TransmissionIntervalMulticast = number;
export type AppKey = string;
export type NwkKey = string;
export type AppEui = string;
export type GenAppKey = string;
export type DevAddr = string;
export type FCntStart = number;
export type FPort = number;
export type BeaconingDataRate = number;
export type BeaconingFrequency = number;
export type UpdateSignature = string;
export type Crc = number;
export type DimensionValue = string;
export type MCC = number;
export type MNC = number;
export type LAC = number;
export type GeranCid = number;
export type GsmTimingAdvance = number;
export type RxLevel = number;
export type UtranCid = number;
export type RSCP = number;
export type PathLoss = number;
export type TdscdmaTimingAdvance = number;
export type EutranCid = number;
export type TAC = number;
export type LteTimingAdvance = number;
export type RSRP = number;
export type RSRQ = number;
export type NRCapable = boolean;
export type SystemId = number;
export type NetworkId = number;
export type BaseStationId = number;
export type RegistrationZone = number;
export type PilotPower = number;
export type BaseLat = number;
export type BaseLng = number;
export type Seq = number;
export type AckModeRetryDurationSecs = number;
export type ApplicationServerPublicKey = string | redacted.Redacted<string>;
export type QualificationStatus = boolean;
export type NumberOfDevicesRequested = number;
export type NumberOfDevicesInGroup = number;
export type Fingerprint = string | redacted.Redacted<string>;
export type PartnerAccountArn = string;
export type HorizontalAccuracy = number;
export type VerticalAccuracy = number;
export type UlRate = number;
export type UlBucketSize = number;
export type UlRatePolicy = string;
export type DlRate = number;
export type DlBucketSize = number;
export type DlRatePolicy = string;
export type DevStatusReqFreq = number;
export type ReportDevStatusBattery = boolean;
export type ReportDevStatusMargin = boolean;
export type DrMin = number;
export type DrMax = number;
export type ChannelMask = string;
export type HrAllowed = boolean;
export type NwkGeoLoc = boolean;
export type TargetPer = number;
export type MinGwDiversity = number;
export type SidewalkId = string;
export type DakCertificateId = string;
export type MulticastDeviceStatus = string;
export type McGroupId = number;
export type FNwkSIntKey = string;
export type SNwkSIntKey = string;
export type NwkSEncKey = string;
export type AppSKey = string;
export type NwkSKey = string;
export type PackageVersion = string;
export type Model = string;
export type Station = string;
export type BSIC = number;
export type BCCH = number;
export type UARFCNDL = number;
export type PSC = number;
export type UARFCN = number;
export type CellParams = number;
export type PCI = number;
export type EARFCN = number;
export type PnOffset = number;
export type CdmaChannel = number;
export type TransmissionInterval = number;
export type MaxAllowedSignature = number;
export type FactorySupport = boolean;
export type ApId = string;
export type DeviceTypeId = string;
export type CertificateValue = string;
export type ProviderNetId = string;
export type Id = string;
export type DlAllowed = boolean;
export type OnboardStatusReason = string;
export type LastUpdateTime = Date;
export type DownlinkFrequency = number;
export type MulticastGroupMessageId = string;
export type MetricQueryError = string;
export type MetricQueryTimestamp = Date;
export type MetricUnit = string;
export type Min = number;
export type Max = number;
export type Sum = number;
export type Avg = number;
export type Std = number;
export type P90 = number;

//# Schemas
export interface GetEventConfigurationByResourceTypesRequest {}
export const GetEventConfigurationByResourceTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/event-configurations-resource-types" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventConfigurationByResourceTypesRequest",
}) as any as S.Schema<GetEventConfigurationByResourceTypesRequest>;
export interface GetLogLevelsByResourceTypesRequest {}
export const GetLogLevelsByResourceTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/log-levels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLogLevelsByResourceTypesRequest",
}) as any as S.Schema<GetLogLevelsByResourceTypesRequest>;
export interface GetMetricConfigurationRequest {}
export const GetMetricConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/metric-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMetricConfigurationRequest",
}) as any as S.Schema<GetMetricConfigurationRequest>;
export interface ResetAllResourceLogLevelsRequest {}
export const ResetAllResourceLogLevelsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/log-levels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetAllResourceLogLevelsRequest",
}) as any as S.Schema<ResetAllResourceLogLevelsRequest>;
export interface ResetAllResourceLogLevelsResponse {}
export const ResetAllResourceLogLevelsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ResetAllResourceLogLevelsResponse",
}) as any as S.Schema<ResetAllResourceLogLevelsResponse>;
export type ExpressionType = "RuleName" | "MqttTopic" | (string & {});
export const ExpressionType = S.String;
export interface SidewalkCreateDeviceProfile {}
export const SidewalkCreateDeviceProfile = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SidewalkCreateDeviceProfile",
}) as any as S.Schema<SidewalkCreateDeviceProfile>;
export type WirelessDeviceList = string[];
export const WirelessDeviceList = S.Array(S.String);
export type WirelessGatewayList = string[];
export const WirelessGatewayList = S.Array(S.String);
export type NetworkAnalyzerMulticastGroupList = string[];
export const NetworkAnalyzerMulticastGroupList = S.Array(S.String);
export type WirelessDeviceType = "Sidewalk" | "LoRaWAN" | (string & {});
export const WirelessDeviceType = S.String;
export type PositioningConfigStatus = "Enabled" | "Disabled" | (string & {});
export const PositioningConfigStatus = S.String;
export type PartnerType = "Sidewalk" | (string & {});
export const PartnerType = S.String;
export type LogLevel = "INFO" | "ERROR" | "DISABLED" | (string & {});
export const LogLevel = S.String;
export type PositionResourceType =
  | "WirelessDevice"
  | "WirelessGateway"
  | (string & {});
export const PositionResourceType = S.String;
export type IdentifierType =
  | "PartnerAccountId"
  | "DevEui"
  | "GatewayEui"
  | "WirelessDeviceId"
  | "WirelessGatewayId"
  | (string & {});
export const IdentifierType = S.String;
export type EventNotificationPartnerType = "Sidewalk" | (string & {});
export const EventNotificationPartnerType = S.String;
export type WirelessGatewayServiceType = "CUPS" | "LNS" | (string & {});
export const WirelessGatewayServiceType = S.String;
export type WirelessDeviceIdType =
  | "WirelessDeviceId"
  | "DevEui"
  | "ThingName"
  | "SidewalkManufacturingSn"
  | (string & {});
export const WirelessDeviceIdType = S.String;
export type WirelessGatewayIdType =
  | "GatewayEui"
  | "WirelessGatewayId"
  | "ThingName"
  | (string & {});
export const WirelessGatewayIdType = S.String;
export type DeviceProfileType = "Sidewalk" | "LoRaWAN" | (string & {});
export const DeviceProfileType = S.String;
export type OnboardStatus =
  | "INITIALIZED"
  | "PENDING"
  | "ONBOARDED"
  | "FAILED"
  | (string & {});
export const OnboardStatus = S.String;
export type EventNotificationResourceType =
  | "SidewalkAccount"
  | "WirelessDevice"
  | "WirelessGateway"
  | (string & {});
export const EventNotificationResourceType = S.String;
export type WirelessGatewayTaskDefinitionType = "UPDATE" | (string & {});
export const WirelessGatewayTaskDefinitionType = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type PositionCoordinate = number[];
export const PositionCoordinate = S.Array(S.Number);
export type JoinEuiRange = string[];
export const JoinEuiRange = S.Array(S.String);
export type JoinEuiFilters = string[][];
export const JoinEuiFilters = S.Array(JoinEuiRange);
export type NetIdFilters = string[];
export const NetIdFilters = S.Array(S.String);
export interface AssociateMulticastGroupWithFuotaTaskRequest {
  Id: string;
  MulticastGroupId: string;
}
export const AssociateMulticastGroupWithFuotaTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    MulticastGroupId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/fuota-tasks/{Id}/multicast-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateMulticastGroupWithFuotaTaskRequest",
}) as any as S.Schema<AssociateMulticastGroupWithFuotaTaskRequest>;
export interface AssociateMulticastGroupWithFuotaTaskResponse {}
export const AssociateMulticastGroupWithFuotaTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateMulticastGroupWithFuotaTaskResponse",
}) as any as S.Schema<AssociateMulticastGroupWithFuotaTaskResponse>;
export interface AssociateWirelessDeviceWithFuotaTaskRequest {
  Id: string;
  WirelessDeviceId: string;
}
export const AssociateWirelessDeviceWithFuotaTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    WirelessDeviceId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/fuota-tasks/{Id}/wireless-device" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateWirelessDeviceWithFuotaTaskRequest",
}) as any as S.Schema<AssociateWirelessDeviceWithFuotaTaskRequest>;
export interface AssociateWirelessDeviceWithFuotaTaskResponse {}
export const AssociateWirelessDeviceWithFuotaTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateWirelessDeviceWithFuotaTaskResponse",
}) as any as S.Schema<AssociateWirelessDeviceWithFuotaTaskResponse>;
export interface AssociateWirelessDeviceWithMulticastGroupRequest {
  Id: string;
  WirelessDeviceId: string;
}
export const AssociateWirelessDeviceWithMulticastGroupRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    WirelessDeviceId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/multicast-groups/{Id}/wireless-device" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateWirelessDeviceWithMulticastGroupRequest",
}) as any as S.Schema<AssociateWirelessDeviceWithMulticastGroupRequest>;
export interface AssociateWirelessDeviceWithMulticastGroupResponse {}
export const AssociateWirelessDeviceWithMulticastGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateWirelessDeviceWithMulticastGroupResponse",
}) as any as S.Schema<AssociateWirelessDeviceWithMulticastGroupResponse>;
export interface AssociateWirelessDeviceWithThingRequest {
  Id: string;
  ThingArn: string;
}
export const AssociateWirelessDeviceWithThingRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")), ThingArn: S.String }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/wireless-devices/{Id}/thing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateWirelessDeviceWithThingRequest",
}) as any as S.Schema<AssociateWirelessDeviceWithThingRequest>;
export interface AssociateWirelessDeviceWithThingResponse {}
export const AssociateWirelessDeviceWithThingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateWirelessDeviceWithThingResponse",
}) as any as S.Schema<AssociateWirelessDeviceWithThingResponse>;
export interface AssociateWirelessGatewayWithCertificateRequest {
  Id: string;
  IotCertificateId: string;
}
export const AssociateWirelessGatewayWithCertificateRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    IotCertificateId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/wireless-gateways/{Id}/certificate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateWirelessGatewayWithCertificateRequest",
}) as any as S.Schema<AssociateWirelessGatewayWithCertificateRequest>;
export interface AssociateWirelessGatewayWithThingRequest {
  Id: string;
  ThingArn: string;
}
export const AssociateWirelessGatewayWithThingRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")), ThingArn: S.String }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/wireless-gateways/{Id}/thing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateWirelessGatewayWithThingRequest",
}) as any as S.Schema<AssociateWirelessGatewayWithThingRequest>;
export interface AssociateWirelessGatewayWithThingResponse {}
export const AssociateWirelessGatewayWithThingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateWirelessGatewayWithThingResponse",
}) as any as S.Schema<AssociateWirelessGatewayWithThingResponse>;
export interface CancelMulticastGroupSessionRequest {
  Id: string;
}
export const CancelMulticastGroupSessionRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/multicast-groups/{Id}/session" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelMulticastGroupSessionRequest",
}) as any as S.Schema<CancelMulticastGroupSessionRequest>;
export interface CancelMulticastGroupSessionResponse {}
export const CancelMulticastGroupSessionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelMulticastGroupSessionResponse",
}) as any as S.Schema<CancelMulticastGroupSessionResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateDestinationRequest {
  Name: string;
  ExpressionType: ExpressionType;
  Expression: string;
  Description?: string;
  RoleArn: string;
  Tags?: Tag[];
  ClientRequestToken?: string;
}
export const CreateDestinationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ExpressionType: ExpressionType,
    Expression: S.String,
    Description: S.optional(S.String),
    RoleArn: S.String,
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/destinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDestinationRequest",
}) as any as S.Schema<CreateDestinationRequest>;
export interface CreateWirelessGatewayTaskRequest {
  Id: string;
  WirelessGatewayTaskDefinitionId: string;
}
export const CreateWirelessGatewayTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    WirelessGatewayTaskDefinitionId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/wireless-gateways/{Id}/tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWirelessGatewayTaskRequest",
}) as any as S.Schema<CreateWirelessGatewayTaskRequest>;
export interface DeleteDestinationRequest {
  Name: string;
}
export const DeleteDestinationRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/destinations/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDestinationRequest",
}) as any as S.Schema<DeleteDestinationRequest>;
export interface DeleteDestinationResponse {}
export const DeleteDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDestinationResponse",
}) as any as S.Schema<DeleteDestinationResponse>;
export interface DeleteDeviceProfileRequest {
  Id: string;
}
export const DeleteDeviceProfileRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/device-profiles/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDeviceProfileRequest",
}) as any as S.Schema<DeleteDeviceProfileRequest>;
export interface DeleteDeviceProfileResponse {}
export const DeleteDeviceProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDeviceProfileResponse",
}) as any as S.Schema<DeleteDeviceProfileResponse>;
export interface DeleteFuotaTaskRequest {
  Id: string;
}
export const DeleteFuotaTaskRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/fuota-tasks/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFuotaTaskRequest",
}) as any as S.Schema<DeleteFuotaTaskRequest>;
export interface DeleteFuotaTaskResponse {}
export const DeleteFuotaTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFuotaTaskResponse",
}) as any as S.Schema<DeleteFuotaTaskResponse>;
export interface DeleteMulticastGroupRequest {
  Id: string;
}
export const DeleteMulticastGroupRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/multicast-groups/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMulticastGroupRequest",
}) as any as S.Schema<DeleteMulticastGroupRequest>;
export interface DeleteMulticastGroupResponse {}
export const DeleteMulticastGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMulticastGroupResponse",
}) as any as S.Schema<DeleteMulticastGroupResponse>;
export interface DeleteNetworkAnalyzerConfigurationRequest {
  ConfigurationName: string;
}
export const DeleteNetworkAnalyzerConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationName: S.String.pipe(T.HttpLabel("ConfigurationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/network-analyzer-configurations/{ConfigurationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNetworkAnalyzerConfigurationRequest",
}) as any as S.Schema<DeleteNetworkAnalyzerConfigurationRequest>;
export interface DeleteNetworkAnalyzerConfigurationResponse {}
export const DeleteNetworkAnalyzerConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteNetworkAnalyzerConfigurationResponse",
}) as any as S.Schema<DeleteNetworkAnalyzerConfigurationResponse>;
export interface DeleteQueuedMessagesRequest {
  Id: string;
  MessageId: string;
  WirelessDeviceType?: WirelessDeviceType;
}
export const DeleteQueuedMessagesRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    MessageId: S.String.pipe(T.HttpQuery("messageId")),
    WirelessDeviceType: S.optional(WirelessDeviceType).pipe(
      T.HttpQuery("WirelessDeviceType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/wireless-devices/{Id}/data" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteQueuedMessagesRequest",
}) as any as S.Schema<DeleteQueuedMessagesRequest>;
export interface DeleteQueuedMessagesResponse {}
export const DeleteQueuedMessagesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteQueuedMessagesResponse",
}) as any as S.Schema<DeleteQueuedMessagesResponse>;
export interface DeleteServiceProfileRequest {
  Id: string;
}
export const DeleteServiceProfileRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/service-profiles/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteServiceProfileRequest",
}) as any as S.Schema<DeleteServiceProfileRequest>;
export interface DeleteServiceProfileResponse {}
export const DeleteServiceProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteServiceProfileResponse",
}) as any as S.Schema<DeleteServiceProfileResponse>;
export interface DeleteWirelessDeviceRequest {
  Id: string;
}
export const DeleteWirelessDeviceRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/wireless-devices/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWirelessDeviceRequest",
}) as any as S.Schema<DeleteWirelessDeviceRequest>;
export interface DeleteWirelessDeviceResponse {}
export const DeleteWirelessDeviceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWirelessDeviceResponse",
}) as any as S.Schema<DeleteWirelessDeviceResponse>;
export interface DeleteWirelessDeviceImportTaskRequest {
  Id: string;
}
export const DeleteWirelessDeviceImportTaskRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/wireless_device_import_task/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWirelessDeviceImportTaskRequest",
}) as any as S.Schema<DeleteWirelessDeviceImportTaskRequest>;
export interface DeleteWirelessDeviceImportTaskResponse {}
export const DeleteWirelessDeviceImportTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWirelessDeviceImportTaskResponse",
}) as any as S.Schema<DeleteWirelessDeviceImportTaskResponse>;
export interface DeleteWirelessGatewayRequest {
  Id: string;
}
export const DeleteWirelessGatewayRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/wireless-gateways/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWirelessGatewayRequest",
}) as any as S.Schema<DeleteWirelessGatewayRequest>;
export interface DeleteWirelessGatewayResponse {}
export const DeleteWirelessGatewayResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWirelessGatewayResponse",
}) as any as S.Schema<DeleteWirelessGatewayResponse>;
export interface DeleteWirelessGatewayTaskRequest {
  Id: string;
}
export const DeleteWirelessGatewayTaskRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/wireless-gateways/{Id}/tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWirelessGatewayTaskRequest",
}) as any as S.Schema<DeleteWirelessGatewayTaskRequest>;
export interface DeleteWirelessGatewayTaskResponse {}
export const DeleteWirelessGatewayTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWirelessGatewayTaskResponse",
}) as any as S.Schema<DeleteWirelessGatewayTaskResponse>;
export interface DeleteWirelessGatewayTaskDefinitionRequest {
  Id: string;
}
export const DeleteWirelessGatewayTaskDefinitionRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/wireless-gateway-task-definitions/{Id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWirelessGatewayTaskDefinitionRequest",
}) as any as S.Schema<DeleteWirelessGatewayTaskDefinitionRequest>;
export interface DeleteWirelessGatewayTaskDefinitionResponse {}
export const DeleteWirelessGatewayTaskDefinitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWirelessGatewayTaskDefinitionResponse",
}) as any as S.Schema<DeleteWirelessGatewayTaskDefinitionResponse>;
export interface DeregisterWirelessDeviceRequest {
  Identifier: string;
  WirelessDeviceType?: WirelessDeviceType;
}
export const DeregisterWirelessDeviceRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    WirelessDeviceType: S.optional(WirelessDeviceType).pipe(
      T.HttpQuery("WirelessDeviceType"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/wireless-devices/{Identifier}/deregister",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterWirelessDeviceRequest",
}) as any as S.Schema<DeregisterWirelessDeviceRequest>;
export interface DeregisterWirelessDeviceResponse {}
export const DeregisterWirelessDeviceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterWirelessDeviceResponse",
}) as any as S.Schema<DeregisterWirelessDeviceResponse>;
export interface DisassociateAwsAccountFromPartnerAccountRequest {
  PartnerAccountId: string;
  PartnerType: PartnerType;
}
export const DisassociateAwsAccountFromPartnerAccountRequest = S.suspend(() =>
  S.Struct({
    PartnerAccountId: S.String.pipe(T.HttpLabel("PartnerAccountId")),
    PartnerType: PartnerType.pipe(T.HttpQuery("partnerType")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/partner-accounts/{PartnerAccountId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateAwsAccountFromPartnerAccountRequest",
}) as any as S.Schema<DisassociateAwsAccountFromPartnerAccountRequest>;
export interface DisassociateAwsAccountFromPartnerAccountResponse {}
export const DisassociateAwsAccountFromPartnerAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateAwsAccountFromPartnerAccountResponse",
}) as any as S.Schema<DisassociateAwsAccountFromPartnerAccountResponse>;
export interface DisassociateMulticastGroupFromFuotaTaskRequest {
  Id: string;
  MulticastGroupId: string;
}
export const DisassociateMulticastGroupFromFuotaTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    MulticastGroupId: S.String.pipe(T.HttpLabel("MulticastGroupId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/fuota-tasks/{Id}/multicast-groups/{MulticastGroupId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateMulticastGroupFromFuotaTaskRequest",
}) as any as S.Schema<DisassociateMulticastGroupFromFuotaTaskRequest>;
export interface DisassociateMulticastGroupFromFuotaTaskResponse {}
export const DisassociateMulticastGroupFromFuotaTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateMulticastGroupFromFuotaTaskResponse",
}) as any as S.Schema<DisassociateMulticastGroupFromFuotaTaskResponse>;
export interface DisassociateWirelessDeviceFromFuotaTaskRequest {
  Id: string;
  WirelessDeviceId: string;
}
export const DisassociateWirelessDeviceFromFuotaTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    WirelessDeviceId: S.String.pipe(T.HttpLabel("WirelessDeviceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/fuota-tasks/{Id}/wireless-devices/{WirelessDeviceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateWirelessDeviceFromFuotaTaskRequest",
}) as any as S.Schema<DisassociateWirelessDeviceFromFuotaTaskRequest>;
export interface DisassociateWirelessDeviceFromFuotaTaskResponse {}
export const DisassociateWirelessDeviceFromFuotaTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateWirelessDeviceFromFuotaTaskResponse",
}) as any as S.Schema<DisassociateWirelessDeviceFromFuotaTaskResponse>;
export interface DisassociateWirelessDeviceFromMulticastGroupRequest {
  Id: string;
  WirelessDeviceId: string;
}
export const DisassociateWirelessDeviceFromMulticastGroupRequest = S.suspend(
  () =>
    S.Struct({
      Id: S.String.pipe(T.HttpLabel("Id")),
      WirelessDeviceId: S.String.pipe(T.HttpLabel("WirelessDeviceId")),
    }).pipe(
      T.all(
        T.Http({
          method: "DELETE",
          uri: "/multicast-groups/{Id}/wireless-devices/{WirelessDeviceId}",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DisassociateWirelessDeviceFromMulticastGroupRequest",
}) as any as S.Schema<DisassociateWirelessDeviceFromMulticastGroupRequest>;
export interface DisassociateWirelessDeviceFromMulticastGroupResponse {}
export const DisassociateWirelessDeviceFromMulticastGroupResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DisassociateWirelessDeviceFromMulticastGroupResponse",
}) as any as S.Schema<DisassociateWirelessDeviceFromMulticastGroupResponse>;
export interface DisassociateWirelessDeviceFromThingRequest {
  Id: string;
}
export const DisassociateWirelessDeviceFromThingRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/wireless-devices/{Id}/thing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateWirelessDeviceFromThingRequest",
}) as any as S.Schema<DisassociateWirelessDeviceFromThingRequest>;
export interface DisassociateWirelessDeviceFromThingResponse {}
export const DisassociateWirelessDeviceFromThingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateWirelessDeviceFromThingResponse",
}) as any as S.Schema<DisassociateWirelessDeviceFromThingResponse>;
export interface DisassociateWirelessGatewayFromCertificateRequest {
  Id: string;
}
export const DisassociateWirelessGatewayFromCertificateRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/wireless-gateways/{Id}/certificate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateWirelessGatewayFromCertificateRequest",
}) as any as S.Schema<DisassociateWirelessGatewayFromCertificateRequest>;
export interface DisassociateWirelessGatewayFromCertificateResponse {}
export const DisassociateWirelessGatewayFromCertificateResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DisassociateWirelessGatewayFromCertificateResponse",
}) as any as S.Schema<DisassociateWirelessGatewayFromCertificateResponse>;
export interface DisassociateWirelessGatewayFromThingRequest {
  Id: string;
}
export const DisassociateWirelessGatewayFromThingRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/wireless-gateways/{Id}/thing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateWirelessGatewayFromThingRequest",
}) as any as S.Schema<DisassociateWirelessGatewayFromThingRequest>;
export interface DisassociateWirelessGatewayFromThingResponse {}
export const DisassociateWirelessGatewayFromThingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateWirelessGatewayFromThingResponse",
}) as any as S.Schema<DisassociateWirelessGatewayFromThingResponse>;
export interface GetDestinationRequest {
  Name: string;
}
export const GetDestinationRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/destinations/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDestinationRequest",
}) as any as S.Schema<GetDestinationRequest>;
export interface GetDeviceProfileRequest {
  Id: string;
}
export const GetDeviceProfileRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/device-profiles/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeviceProfileRequest",
}) as any as S.Schema<GetDeviceProfileRequest>;
export interface GetFuotaTaskRequest {
  Id: string;
}
export const GetFuotaTaskRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/fuota-tasks/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFuotaTaskRequest",
}) as any as S.Schema<GetFuotaTaskRequest>;
export interface GetMulticastGroupRequest {
  Id: string;
}
export const GetMulticastGroupRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/multicast-groups/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMulticastGroupRequest",
}) as any as S.Schema<GetMulticastGroupRequest>;
export interface GetMulticastGroupSessionRequest {
  Id: string;
}
export const GetMulticastGroupSessionRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/multicast-groups/{Id}/session" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMulticastGroupSessionRequest",
}) as any as S.Schema<GetMulticastGroupSessionRequest>;
export interface GetNetworkAnalyzerConfigurationRequest {
  ConfigurationName: string;
}
export const GetNetworkAnalyzerConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationName: S.String.pipe(T.HttpLabel("ConfigurationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/network-analyzer-configurations/{ConfigurationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetNetworkAnalyzerConfigurationRequest",
}) as any as S.Schema<GetNetworkAnalyzerConfigurationRequest>;
export interface GetPartnerAccountRequest {
  PartnerAccountId: string;
  PartnerType: PartnerType;
}
export const GetPartnerAccountRequest = S.suspend(() =>
  S.Struct({
    PartnerAccountId: S.String.pipe(T.HttpLabel("PartnerAccountId")),
    PartnerType: PartnerType.pipe(T.HttpQuery("partnerType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/partner-accounts/{PartnerAccountId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPartnerAccountRequest",
}) as any as S.Schema<GetPartnerAccountRequest>;
export interface GetPositionRequest {
  ResourceIdentifier: string;
  ResourceType: PositionResourceType;
}
export const GetPositionRequest = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
    ResourceType: PositionResourceType.pipe(T.HttpQuery("resourceType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/positions/{ResourceIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPositionRequest",
}) as any as S.Schema<GetPositionRequest>;
export interface GetPositionConfigurationRequest {
  ResourceIdentifier: string;
  ResourceType: PositionResourceType;
}
export const GetPositionConfigurationRequest = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
    ResourceType: PositionResourceType.pipe(T.HttpQuery("resourceType")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/position-configurations/{ResourceIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPositionConfigurationRequest",
}) as any as S.Schema<GetPositionConfigurationRequest>;
export interface GetResourceEventConfigurationRequest {
  Identifier: string;
  IdentifierType: IdentifierType;
  PartnerType?: EventNotificationPartnerType;
}
export const GetResourceEventConfigurationRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    IdentifierType: IdentifierType.pipe(T.HttpQuery("identifierType")),
    PartnerType: S.optional(EventNotificationPartnerType).pipe(
      T.HttpQuery("partnerType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/event-configurations/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceEventConfigurationRequest",
}) as any as S.Schema<GetResourceEventConfigurationRequest>;
export interface GetResourceLogLevelRequest {
  ResourceIdentifier: string;
  ResourceType: string;
}
export const GetResourceLogLevelRequest = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/log-levels/{ResourceIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceLogLevelRequest",
}) as any as S.Schema<GetResourceLogLevelRequest>;
export interface GetResourcePositionRequest {
  ResourceIdentifier: string;
  ResourceType: PositionResourceType;
}
export const GetResourcePositionRequest = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
    ResourceType: PositionResourceType.pipe(T.HttpQuery("resourceType")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/resource-positions/{ResourceIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePositionRequest",
}) as any as S.Schema<GetResourcePositionRequest>;
export interface GetServiceEndpointRequest {
  ServiceType?: WirelessGatewayServiceType;
}
export const GetServiceEndpointRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.optional(WirelessGatewayServiceType).pipe(
      T.HttpQuery("serviceType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/service-endpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServiceEndpointRequest",
}) as any as S.Schema<GetServiceEndpointRequest>;
export interface GetServiceProfileRequest {
  Id: string;
}
export const GetServiceProfileRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/service-profiles/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServiceProfileRequest",
}) as any as S.Schema<GetServiceProfileRequest>;
export interface GetWirelessDeviceRequest {
  Identifier: string;
  IdentifierType: WirelessDeviceIdType;
}
export const GetWirelessDeviceRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    IdentifierType: WirelessDeviceIdType.pipe(T.HttpQuery("identifierType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless-devices/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWirelessDeviceRequest",
}) as any as S.Schema<GetWirelessDeviceRequest>;
export interface GetWirelessDeviceImportTaskRequest {
  Id: string;
}
export const GetWirelessDeviceImportTaskRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless_device_import_task/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWirelessDeviceImportTaskRequest",
}) as any as S.Schema<GetWirelessDeviceImportTaskRequest>;
export interface GetWirelessDeviceStatisticsRequest {
  WirelessDeviceId: string;
}
export const GetWirelessDeviceStatisticsRequest = S.suspend(() =>
  S.Struct({
    WirelessDeviceId: S.String.pipe(T.HttpLabel("WirelessDeviceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/wireless-devices/{WirelessDeviceId}/statistics",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWirelessDeviceStatisticsRequest",
}) as any as S.Schema<GetWirelessDeviceStatisticsRequest>;
export interface GetWirelessGatewayRequest {
  Identifier: string;
  IdentifierType: WirelessGatewayIdType;
}
export const GetWirelessGatewayRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    IdentifierType: WirelessGatewayIdType.pipe(T.HttpQuery("identifierType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless-gateways/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWirelessGatewayRequest",
}) as any as S.Schema<GetWirelessGatewayRequest>;
export interface GetWirelessGatewayCertificateRequest {
  Id: string;
}
export const GetWirelessGatewayCertificateRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless-gateways/{Id}/certificate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWirelessGatewayCertificateRequest",
}) as any as S.Schema<GetWirelessGatewayCertificateRequest>;
export interface GetWirelessGatewayFirmwareInformationRequest {
  Id: string;
}
export const GetWirelessGatewayFirmwareInformationRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/wireless-gateways/{Id}/firmware-information",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWirelessGatewayFirmwareInformationRequest",
}) as any as S.Schema<GetWirelessGatewayFirmwareInformationRequest>;
export interface GetWirelessGatewayStatisticsRequest {
  WirelessGatewayId: string;
}
export const GetWirelessGatewayStatisticsRequest = S.suspend(() =>
  S.Struct({
    WirelessGatewayId: S.String.pipe(T.HttpLabel("WirelessGatewayId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/wireless-gateways/{WirelessGatewayId}/statistics",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWirelessGatewayStatisticsRequest",
}) as any as S.Schema<GetWirelessGatewayStatisticsRequest>;
export interface GetWirelessGatewayTaskRequest {
  Id: string;
}
export const GetWirelessGatewayTaskRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless-gateways/{Id}/tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWirelessGatewayTaskRequest",
}) as any as S.Schema<GetWirelessGatewayTaskRequest>;
export interface GetWirelessGatewayTaskDefinitionRequest {
  Id: string;
}
export const GetWirelessGatewayTaskDefinitionRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless-gateway-task-definitions/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWirelessGatewayTaskDefinitionRequest",
}) as any as S.Schema<GetWirelessGatewayTaskDefinitionRequest>;
export interface ListDestinationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListDestinationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/destinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDestinationsRequest",
}) as any as S.Schema<ListDestinationsRequest>;
export interface ListDeviceProfilesRequest {
  NextToken?: string;
  MaxResults?: number;
  DeviceProfileType?: DeviceProfileType;
}
export const ListDeviceProfilesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    DeviceProfileType: S.optional(DeviceProfileType).pipe(
      T.HttpQuery("deviceProfileType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/device-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeviceProfilesRequest",
}) as any as S.Schema<ListDeviceProfilesRequest>;
export interface ListDevicesForWirelessDeviceImportTaskRequest {
  Id: string;
  MaxResults?: number;
  NextToken?: string;
  Status?: OnboardStatus;
}
export const ListDevicesForWirelessDeviceImportTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpQuery("id")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Status: S.optional(OnboardStatus).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless_device_import_task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDevicesForWirelessDeviceImportTaskRequest",
}) as any as S.Schema<ListDevicesForWirelessDeviceImportTaskRequest>;
export interface ListEventConfigurationsRequest {
  ResourceType: EventNotificationResourceType;
  MaxResults?: number;
  NextToken?: string;
}
export const ListEventConfigurationsRequest = S.suspend(() =>
  S.Struct({
    ResourceType: EventNotificationResourceType.pipe(
      T.HttpQuery("resourceType"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/event-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventConfigurationsRequest",
}) as any as S.Schema<ListEventConfigurationsRequest>;
export interface ListFuotaTasksRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListFuotaTasksRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/fuota-tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFuotaTasksRequest",
}) as any as S.Schema<ListFuotaTasksRequest>;
export interface ListMulticastGroupsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListMulticastGroupsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/multicast-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMulticastGroupsRequest",
}) as any as S.Schema<ListMulticastGroupsRequest>;
export interface ListMulticastGroupsByFuotaTaskRequest {
  Id: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMulticastGroupsByFuotaTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/fuota-tasks/{Id}/multicast-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMulticastGroupsByFuotaTaskRequest",
}) as any as S.Schema<ListMulticastGroupsByFuotaTaskRequest>;
export interface ListNetworkAnalyzerConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListNetworkAnalyzerConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/network-analyzer-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNetworkAnalyzerConfigurationsRequest",
}) as any as S.Schema<ListNetworkAnalyzerConfigurationsRequest>;
export interface ListPartnerAccountsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListPartnerAccountsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/partner-accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPartnerAccountsRequest",
}) as any as S.Schema<ListPartnerAccountsRequest>;
export interface ListPositionConfigurationsRequest {
  ResourceType?: PositionResourceType;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPositionConfigurationsRequest = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(PositionResourceType).pipe(
      T.HttpQuery("resourceType"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/position-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPositionConfigurationsRequest",
}) as any as S.Schema<ListPositionConfigurationsRequest>;
export interface ListQueuedMessagesRequest {
  Id: string;
  NextToken?: string;
  MaxResults?: number;
  WirelessDeviceType?: WirelessDeviceType;
}
export const ListQueuedMessagesRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    WirelessDeviceType: S.optional(WirelessDeviceType).pipe(
      T.HttpQuery("WirelessDeviceType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless-devices/{Id}/data" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQueuedMessagesRequest",
}) as any as S.Schema<ListQueuedMessagesRequest>;
export interface ListServiceProfilesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListServiceProfilesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/service-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListServiceProfilesRequest",
}) as any as S.Schema<ListServiceProfilesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
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
export interface ListWirelessDeviceImportTasksRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListWirelessDeviceImportTasksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless_device_import_tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWirelessDeviceImportTasksRequest",
}) as any as S.Schema<ListWirelessDeviceImportTasksRequest>;
export interface ListWirelessDevicesRequest {
  MaxResults?: number;
  NextToken?: string;
  DestinationName?: string;
  DeviceProfileId?: string;
  ServiceProfileId?: string;
  WirelessDeviceType?: WirelessDeviceType;
  FuotaTaskId?: string;
  MulticastGroupId?: string;
}
export const ListWirelessDevicesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    DestinationName: S.optional(S.String).pipe(T.HttpQuery("destinationName")),
    DeviceProfileId: S.optional(S.String).pipe(T.HttpQuery("deviceProfileId")),
    ServiceProfileId: S.optional(S.String).pipe(
      T.HttpQuery("serviceProfileId"),
    ),
    WirelessDeviceType: S.optional(WirelessDeviceType).pipe(
      T.HttpQuery("wirelessDeviceType"),
    ),
    FuotaTaskId: S.optional(S.String).pipe(T.HttpQuery("fuotaTaskId")),
    MulticastGroupId: S.optional(S.String).pipe(
      T.HttpQuery("multicastGroupId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless-devices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWirelessDevicesRequest",
}) as any as S.Schema<ListWirelessDevicesRequest>;
export interface ListWirelessGatewaysRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListWirelessGatewaysRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless-gateways" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWirelessGatewaysRequest",
}) as any as S.Schema<ListWirelessGatewaysRequest>;
export interface ListWirelessGatewayTaskDefinitionsRequest {
  MaxResults?: number;
  NextToken?: string;
  TaskDefinitionType?: WirelessGatewayTaskDefinitionType;
}
export const ListWirelessGatewayTaskDefinitionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    TaskDefinitionType: S.optional(WirelessGatewayTaskDefinitionType).pipe(
      T.HttpQuery("taskDefinitionType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/wireless-gateway-task-definitions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWirelessGatewayTaskDefinitionsRequest",
}) as any as S.Schema<ListWirelessGatewayTaskDefinitionsRequest>;
export interface PutResourceLogLevelRequest {
  ResourceIdentifier: string;
  ResourceType: string;
  LogLevel: LogLevel;
}
export const PutResourceLogLevelRequest = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
    LogLevel: LogLevel,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/log-levels/{ResourceIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourceLogLevelRequest",
}) as any as S.Schema<PutResourceLogLevelRequest>;
export interface PutResourceLogLevelResponse {}
export const PutResourceLogLevelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutResourceLogLevelResponse",
}) as any as S.Schema<PutResourceLogLevelResponse>;
export interface ResetResourceLogLevelRequest {
  ResourceIdentifier: string;
  ResourceType: string;
}
export const ResetResourceLogLevelRequest = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
    ResourceType: S.String.pipe(T.HttpQuery("resourceType")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/log-levels/{ResourceIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetResourceLogLevelRequest",
}) as any as S.Schema<ResetResourceLogLevelRequest>;
export interface ResetResourceLogLevelResponse {}
export const ResetResourceLogLevelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ResetResourceLogLevelResponse",
}) as any as S.Schema<ResetResourceLogLevelResponse>;
export interface StartBulkAssociateWirelessDeviceWithMulticastGroupRequest {
  Id: string;
  QueryString?: string;
  Tags?: Tag[];
}
export const StartBulkAssociateWirelessDeviceWithMulticastGroupRequest =
  S.suspend(() =>
    S.Struct({
      Id: S.String.pipe(T.HttpLabel("Id")),
      QueryString: S.optional(S.String),
      Tags: S.optional(TagList),
    }).pipe(
      T.all(
        T.Http({ method: "PATCH", uri: "/multicast-groups/{Id}/bulk" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "StartBulkAssociateWirelessDeviceWithMulticastGroupRequest",
  }) as any as S.Schema<StartBulkAssociateWirelessDeviceWithMulticastGroupRequest>;
export interface StartBulkAssociateWirelessDeviceWithMulticastGroupResponse {}
export const StartBulkAssociateWirelessDeviceWithMulticastGroupResponse =
  S.suspend(() => S.Struct({})).annotations({
    identifier: "StartBulkAssociateWirelessDeviceWithMulticastGroupResponse",
  }) as any as S.Schema<StartBulkAssociateWirelessDeviceWithMulticastGroupResponse>;
export interface StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest {
  Id: string;
  QueryString?: string;
  Tags?: Tag[];
}
export const StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest =
  S.suspend(() =>
    S.Struct({
      Id: S.String.pipe(T.HttpLabel("Id")),
      QueryString: S.optional(S.String),
      Tags: S.optional(TagList),
    }).pipe(
      T.all(
        T.Http({ method: "POST", uri: "/multicast-groups/{Id}/bulk" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest",
  }) as any as S.Schema<StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest>;
export interface StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse {}
export const StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse =
  S.suspend(() => S.Struct({})).annotations({
    identifier: "StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse",
  }) as any as S.Schema<StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    Tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags" }),
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
export interface TestWirelessDeviceRequest {
  Id: string;
}
export const TestWirelessDeviceRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/wireless-devices/{Id}/test" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestWirelessDeviceRequest",
}) as any as S.Schema<TestWirelessDeviceRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags" }),
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
export interface UpdateDestinationRequest {
  Name: string;
  ExpressionType?: ExpressionType;
  Expression?: string;
  Description?: string;
  RoleArn?: string;
}
export const UpdateDestinationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    ExpressionType: S.optional(ExpressionType),
    Expression: S.optional(S.String),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/destinations/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDestinationRequest",
}) as any as S.Schema<UpdateDestinationRequest>;
export interface UpdateDestinationResponse {}
export const UpdateDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDestinationResponse",
}) as any as S.Schema<UpdateDestinationResponse>;
export type EventNotificationTopicStatus =
  | "Enabled"
  | "Disabled"
  | (string & {});
export const EventNotificationTopicStatus = S.String;
export interface SidewalkResourceTypeEventConfiguration {
  WirelessDeviceEventTopic?: EventNotificationTopicStatus;
}
export const SidewalkResourceTypeEventConfiguration = S.suspend(() =>
  S.Struct({
    WirelessDeviceEventTopic: S.optional(EventNotificationTopicStatus),
  }),
).annotations({
  identifier: "SidewalkResourceTypeEventConfiguration",
}) as any as S.Schema<SidewalkResourceTypeEventConfiguration>;
export interface DeviceRegistrationStateResourceTypeEventConfiguration {
  Sidewalk?: SidewalkResourceTypeEventConfiguration;
}
export const DeviceRegistrationStateResourceTypeEventConfiguration = S.suspend(
  () =>
    S.Struct({ Sidewalk: S.optional(SidewalkResourceTypeEventConfiguration) }),
).annotations({
  identifier: "DeviceRegistrationStateResourceTypeEventConfiguration",
}) as any as S.Schema<DeviceRegistrationStateResourceTypeEventConfiguration>;
export interface ProximityResourceTypeEventConfiguration {
  Sidewalk?: SidewalkResourceTypeEventConfiguration;
}
export const ProximityResourceTypeEventConfiguration = S.suspend(() =>
  S.Struct({ Sidewalk: S.optional(SidewalkResourceTypeEventConfiguration) }),
).annotations({
  identifier: "ProximityResourceTypeEventConfiguration",
}) as any as S.Schema<ProximityResourceTypeEventConfiguration>;
export interface LoRaWANJoinResourceTypeEventConfiguration {
  WirelessDeviceEventTopic?: EventNotificationTopicStatus;
}
export const LoRaWANJoinResourceTypeEventConfiguration = S.suspend(() =>
  S.Struct({
    WirelessDeviceEventTopic: S.optional(EventNotificationTopicStatus),
  }),
).annotations({
  identifier: "LoRaWANJoinResourceTypeEventConfiguration",
}) as any as S.Schema<LoRaWANJoinResourceTypeEventConfiguration>;
export interface JoinResourceTypeEventConfiguration {
  LoRaWAN?: LoRaWANJoinResourceTypeEventConfiguration;
}
export const JoinResourceTypeEventConfiguration = S.suspend(() =>
  S.Struct({ LoRaWAN: S.optional(LoRaWANJoinResourceTypeEventConfiguration) }),
).annotations({
  identifier: "JoinResourceTypeEventConfiguration",
}) as any as S.Schema<JoinResourceTypeEventConfiguration>;
export interface LoRaWANConnectionStatusResourceTypeEventConfiguration {
  WirelessGatewayEventTopic?: EventNotificationTopicStatus;
}
export const LoRaWANConnectionStatusResourceTypeEventConfiguration = S.suspend(
  () =>
    S.Struct({
      WirelessGatewayEventTopic: S.optional(EventNotificationTopicStatus),
    }),
).annotations({
  identifier: "LoRaWANConnectionStatusResourceTypeEventConfiguration",
}) as any as S.Schema<LoRaWANConnectionStatusResourceTypeEventConfiguration>;
export interface ConnectionStatusResourceTypeEventConfiguration {
  LoRaWAN?: LoRaWANConnectionStatusResourceTypeEventConfiguration;
}
export const ConnectionStatusResourceTypeEventConfiguration = S.suspend(() =>
  S.Struct({
    LoRaWAN: S.optional(LoRaWANConnectionStatusResourceTypeEventConfiguration),
  }),
).annotations({
  identifier: "ConnectionStatusResourceTypeEventConfiguration",
}) as any as S.Schema<ConnectionStatusResourceTypeEventConfiguration>;
export interface MessageDeliveryStatusResourceTypeEventConfiguration {
  Sidewalk?: SidewalkResourceTypeEventConfiguration;
}
export const MessageDeliveryStatusResourceTypeEventConfiguration = S.suspend(
  () =>
    S.Struct({ Sidewalk: S.optional(SidewalkResourceTypeEventConfiguration) }),
).annotations({
  identifier: "MessageDeliveryStatusResourceTypeEventConfiguration",
}) as any as S.Schema<MessageDeliveryStatusResourceTypeEventConfiguration>;
export interface UpdateEventConfigurationByResourceTypesRequest {
  DeviceRegistrationState?: DeviceRegistrationStateResourceTypeEventConfiguration;
  Proximity?: ProximityResourceTypeEventConfiguration;
  Join?: JoinResourceTypeEventConfiguration;
  ConnectionStatus?: ConnectionStatusResourceTypeEventConfiguration;
  MessageDeliveryStatus?: MessageDeliveryStatusResourceTypeEventConfiguration;
}
export const UpdateEventConfigurationByResourceTypesRequest = S.suspend(() =>
  S.Struct({
    DeviceRegistrationState: S.optional(
      DeviceRegistrationStateResourceTypeEventConfiguration,
    ),
    Proximity: S.optional(ProximityResourceTypeEventConfiguration),
    Join: S.optional(JoinResourceTypeEventConfiguration),
    ConnectionStatus: S.optional(
      ConnectionStatusResourceTypeEventConfiguration,
    ),
    MessageDeliveryStatus: S.optional(
      MessageDeliveryStatusResourceTypeEventConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/event-configurations-resource-types" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventConfigurationByResourceTypesRequest",
}) as any as S.Schema<UpdateEventConfigurationByResourceTypesRequest>;
export interface UpdateEventConfigurationByResourceTypesResponse {}
export const UpdateEventConfigurationByResourceTypesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateEventConfigurationByResourceTypesResponse",
}) as any as S.Schema<UpdateEventConfigurationByResourceTypesResponse>;
export type SupportedRfRegion =
  | "EU868"
  | "US915"
  | "AU915"
  | "AS923-1"
  | "AS923-2"
  | "AS923-3"
  | "AS923-4"
  | "EU433"
  | "CN470"
  | "CN779"
  | "RU864"
  | "KR920"
  | "IN865"
  | (string & {});
export const SupportedRfRegion = S.String;
export interface LoRaWANFuotaTask {
  RfRegion?: SupportedRfRegion;
}
export const LoRaWANFuotaTask = S.suspend(() =>
  S.Struct({ RfRegion: S.optional(SupportedRfRegion) }),
).annotations({
  identifier: "LoRaWANFuotaTask",
}) as any as S.Schema<LoRaWANFuotaTask>;
export interface UpdateFuotaTaskRequest {
  Id: string;
  Name?: string;
  Description?: string;
  LoRaWAN?: LoRaWANFuotaTask;
  FirmwareUpdateImage?: string;
  FirmwareUpdateRole?: string;
  RedundancyPercent?: number;
  FragmentSizeBytes?: number;
  FragmentIntervalMS?: number;
  Descriptor?: string;
}
export const UpdateFuotaTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANFuotaTask),
    FirmwareUpdateImage: S.optional(S.String),
    FirmwareUpdateRole: S.optional(S.String),
    RedundancyPercent: S.optional(S.Number),
    FragmentSizeBytes: S.optional(S.Number),
    FragmentIntervalMS: S.optional(S.Number),
    Descriptor: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/fuota-tasks/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFuotaTaskRequest",
}) as any as S.Schema<UpdateFuotaTaskRequest>;
export interface UpdateFuotaTaskResponse {}
export const UpdateFuotaTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateFuotaTaskResponse",
}) as any as S.Schema<UpdateFuotaTaskResponse>;
export type FuotaTaskType = "LoRaWAN" | (string & {});
export const FuotaTaskType = S.String;
export type FuotaTaskEvent = "Fuota" | (string & {});
export const FuotaTaskEvent = S.String;
export interface FuotaTaskEventLogOption {
  Event: FuotaTaskEvent;
  LogLevel: LogLevel;
}
export const FuotaTaskEventLogOption = S.suspend(() =>
  S.Struct({ Event: FuotaTaskEvent, LogLevel: LogLevel }),
).annotations({
  identifier: "FuotaTaskEventLogOption",
}) as any as S.Schema<FuotaTaskEventLogOption>;
export type FuotaTaskEventLogOptionList = FuotaTaskEventLogOption[];
export const FuotaTaskEventLogOptionList = S.Array(FuotaTaskEventLogOption);
export interface FuotaTaskLogOption {
  Type: FuotaTaskType;
  LogLevel: LogLevel;
  Events?: FuotaTaskEventLogOption[];
}
export const FuotaTaskLogOption = S.suspend(() =>
  S.Struct({
    Type: FuotaTaskType,
    LogLevel: LogLevel,
    Events: S.optional(FuotaTaskEventLogOptionList),
  }),
).annotations({
  identifier: "FuotaTaskLogOption",
}) as any as S.Schema<FuotaTaskLogOption>;
export type FuotaTaskLogOptionList = FuotaTaskLogOption[];
export const FuotaTaskLogOptionList = S.Array(FuotaTaskLogOption);
export type WirelessDeviceEvent =
  | "Join"
  | "Rejoin"
  | "Uplink_Data"
  | "Downlink_Data"
  | "Registration"
  | (string & {});
export const WirelessDeviceEvent = S.String;
export interface WirelessDeviceEventLogOption {
  Event: WirelessDeviceEvent;
  LogLevel: LogLevel;
}
export const WirelessDeviceEventLogOption = S.suspend(() =>
  S.Struct({ Event: WirelessDeviceEvent, LogLevel: LogLevel }),
).annotations({
  identifier: "WirelessDeviceEventLogOption",
}) as any as S.Schema<WirelessDeviceEventLogOption>;
export type WirelessDeviceEventLogOptionList = WirelessDeviceEventLogOption[];
export const WirelessDeviceEventLogOptionList = S.Array(
  WirelessDeviceEventLogOption,
);
export interface WirelessDeviceLogOption {
  Type: WirelessDeviceType;
  LogLevel: LogLevel;
  Events?: WirelessDeviceEventLogOption[];
}
export const WirelessDeviceLogOption = S.suspend(() =>
  S.Struct({
    Type: WirelessDeviceType,
    LogLevel: LogLevel,
    Events: S.optional(WirelessDeviceEventLogOptionList),
  }),
).annotations({
  identifier: "WirelessDeviceLogOption",
}) as any as S.Schema<WirelessDeviceLogOption>;
export type WirelessDeviceLogOptionList = WirelessDeviceLogOption[];
export const WirelessDeviceLogOptionList = S.Array(WirelessDeviceLogOption);
export type WirelessGatewayType = "LoRaWAN" | (string & {});
export const WirelessGatewayType = S.String;
export type WirelessGatewayEvent =
  | "CUPS_Request"
  | "Certificate"
  | (string & {});
export const WirelessGatewayEvent = S.String;
export interface WirelessGatewayEventLogOption {
  Event: WirelessGatewayEvent;
  LogLevel: LogLevel;
}
export const WirelessGatewayEventLogOption = S.suspend(() =>
  S.Struct({ Event: WirelessGatewayEvent, LogLevel: LogLevel }),
).annotations({
  identifier: "WirelessGatewayEventLogOption",
}) as any as S.Schema<WirelessGatewayEventLogOption>;
export type WirelessGatewayEventLogOptionList = WirelessGatewayEventLogOption[];
export const WirelessGatewayEventLogOptionList = S.Array(
  WirelessGatewayEventLogOption,
);
export interface WirelessGatewayLogOption {
  Type: WirelessGatewayType;
  LogLevel: LogLevel;
  Events?: WirelessGatewayEventLogOption[];
}
export const WirelessGatewayLogOption = S.suspend(() =>
  S.Struct({
    Type: WirelessGatewayType,
    LogLevel: LogLevel,
    Events: S.optional(WirelessGatewayEventLogOptionList),
  }),
).annotations({
  identifier: "WirelessGatewayLogOption",
}) as any as S.Schema<WirelessGatewayLogOption>;
export type WirelessGatewayLogOptionList = WirelessGatewayLogOption[];
export const WirelessGatewayLogOptionList = S.Array(WirelessGatewayLogOption);
export interface UpdateLogLevelsByResourceTypesRequest {
  DefaultLogLevel?: LogLevel;
  FuotaTaskLogOptions?: FuotaTaskLogOption[];
  WirelessDeviceLogOptions?: WirelessDeviceLogOption[];
  WirelessGatewayLogOptions?: WirelessGatewayLogOption[];
}
export const UpdateLogLevelsByResourceTypesRequest = S.suspend(() =>
  S.Struct({
    DefaultLogLevel: S.optional(LogLevel),
    FuotaTaskLogOptions: S.optional(FuotaTaskLogOptionList),
    WirelessDeviceLogOptions: S.optional(WirelessDeviceLogOptionList),
    WirelessGatewayLogOptions: S.optional(WirelessGatewayLogOptionList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/log-levels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLogLevelsByResourceTypesRequest",
}) as any as S.Schema<UpdateLogLevelsByResourceTypesRequest>;
export interface UpdateLogLevelsByResourceTypesResponse {}
export const UpdateLogLevelsByResourceTypesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLogLevelsByResourceTypesResponse",
}) as any as S.Schema<UpdateLogLevelsByResourceTypesResponse>;
export type SummaryMetricConfigurationStatus =
  | "Enabled"
  | "Disabled"
  | (string & {});
export const SummaryMetricConfigurationStatus = S.String;
export interface SummaryMetricConfiguration {
  Status?: SummaryMetricConfigurationStatus;
}
export const SummaryMetricConfiguration = S.suspend(() =>
  S.Struct({ Status: S.optional(SummaryMetricConfigurationStatus) }),
).annotations({
  identifier: "SummaryMetricConfiguration",
}) as any as S.Schema<SummaryMetricConfiguration>;
export interface UpdateMetricConfigurationRequest {
  SummaryMetric?: SummaryMetricConfiguration;
}
export const UpdateMetricConfigurationRequest = S.suspend(() =>
  S.Struct({ SummaryMetric: S.optional(SummaryMetricConfiguration) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/metric-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMetricConfigurationRequest",
}) as any as S.Schema<UpdateMetricConfigurationRequest>;
export interface UpdateMetricConfigurationResponse {}
export const UpdateMetricConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateMetricConfigurationResponse",
}) as any as S.Schema<UpdateMetricConfigurationResponse>;
export type DlClass = "ClassB" | "ClassC" | (string & {});
export const DlClass = S.String;
export type GatewayListMulticast = string[];
export const GatewayListMulticast = S.Array(S.String);
export interface ParticipatingGatewaysMulticast {
  GatewayList?: string[];
  TransmissionInterval?: number;
}
export const ParticipatingGatewaysMulticast = S.suspend(() =>
  S.Struct({
    GatewayList: S.optional(GatewayListMulticast),
    TransmissionInterval: S.optional(S.Number),
  }),
).annotations({
  identifier: "ParticipatingGatewaysMulticast",
}) as any as S.Schema<ParticipatingGatewaysMulticast>;
export interface LoRaWANMulticast {
  RfRegion?: SupportedRfRegion;
  DlClass?: DlClass;
  ParticipatingGateways?: ParticipatingGatewaysMulticast;
}
export const LoRaWANMulticast = S.suspend(() =>
  S.Struct({
    RfRegion: S.optional(SupportedRfRegion),
    DlClass: S.optional(DlClass),
    ParticipatingGateways: S.optional(ParticipatingGatewaysMulticast),
  }),
).annotations({
  identifier: "LoRaWANMulticast",
}) as any as S.Schema<LoRaWANMulticast>;
export interface UpdateMulticastGroupRequest {
  Id: string;
  Name?: string;
  Description?: string;
  LoRaWAN?: LoRaWANMulticast;
}
export const UpdateMulticastGroupRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANMulticast),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/multicast-groups/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMulticastGroupRequest",
}) as any as S.Schema<UpdateMulticastGroupRequest>;
export interface UpdateMulticastGroupResponse {}
export const UpdateMulticastGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateMulticastGroupResponse",
}) as any as S.Schema<UpdateMulticastGroupResponse>;
export type WirelessDeviceFrameInfo = "ENABLED" | "DISABLED" | (string & {});
export const WirelessDeviceFrameInfo = S.String;
export type MulticastFrameInfo = "ENABLED" | "DISABLED" | (string & {});
export const MulticastFrameInfo = S.String;
export interface TraceContent {
  WirelessDeviceFrameInfo?: WirelessDeviceFrameInfo;
  LogLevel?: LogLevel;
  MulticastFrameInfo?: MulticastFrameInfo;
}
export const TraceContent = S.suspend(() =>
  S.Struct({
    WirelessDeviceFrameInfo: S.optional(WirelessDeviceFrameInfo),
    LogLevel: S.optional(LogLevel),
    MulticastFrameInfo: S.optional(MulticastFrameInfo),
  }),
).annotations({ identifier: "TraceContent" }) as any as S.Schema<TraceContent>;
export interface UpdateNetworkAnalyzerConfigurationRequest {
  ConfigurationName: string;
  TraceContent?: TraceContent;
  WirelessDevicesToAdd?: string[];
  WirelessDevicesToRemove?: string[];
  WirelessGatewaysToAdd?: string[];
  WirelessGatewaysToRemove?: string[];
  Description?: string;
  MulticastGroupsToAdd?: string[];
  MulticastGroupsToRemove?: string[];
}
export const UpdateNetworkAnalyzerConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationName: S.String.pipe(T.HttpLabel("ConfigurationName")),
    TraceContent: S.optional(TraceContent),
    WirelessDevicesToAdd: S.optional(WirelessDeviceList),
    WirelessDevicesToRemove: S.optional(WirelessDeviceList),
    WirelessGatewaysToAdd: S.optional(WirelessGatewayList),
    WirelessGatewaysToRemove: S.optional(WirelessGatewayList),
    Description: S.optional(S.String),
    MulticastGroupsToAdd: S.optional(NetworkAnalyzerMulticastGroupList),
    MulticastGroupsToRemove: S.optional(NetworkAnalyzerMulticastGroupList),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/network-analyzer-configurations/{ConfigurationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNetworkAnalyzerConfigurationRequest",
}) as any as S.Schema<UpdateNetworkAnalyzerConfigurationRequest>;
export interface UpdateNetworkAnalyzerConfigurationResponse {}
export const UpdateNetworkAnalyzerConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateNetworkAnalyzerConfigurationResponse",
}) as any as S.Schema<UpdateNetworkAnalyzerConfigurationResponse>;
export interface UpdatePositionRequest {
  ResourceIdentifier: string;
  ResourceType: PositionResourceType;
  Position: number[];
}
export const UpdatePositionRequest = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
    ResourceType: PositionResourceType.pipe(T.HttpQuery("resourceType")),
    Position: PositionCoordinate,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/positions/{ResourceIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePositionRequest",
}) as any as S.Schema<UpdatePositionRequest>;
export interface UpdatePositionResponse {}
export const UpdatePositionResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdatePositionResponse" },
) as any as S.Schema<UpdatePositionResponse>;
export interface UpdateResourcePositionRequest {
  ResourceIdentifier: string;
  ResourceType: PositionResourceType;
  GeoJsonPayload?: T.StreamingInputBody;
}
export const UpdateResourcePositionRequest = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
    ResourceType: PositionResourceType.pipe(T.HttpQuery("resourceType")),
    GeoJsonPayload: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/resource-positions/{ResourceIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourcePositionRequest",
}) as any as S.Schema<UpdateResourcePositionRequest>;
export interface UpdateResourcePositionResponse {}
export const UpdateResourcePositionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateResourcePositionResponse",
}) as any as S.Schema<UpdateResourcePositionResponse>;
export interface UpdateWirelessGatewayRequest {
  Id: string;
  Name?: string;
  Description?: string;
  JoinEuiFilters?: string[][];
  NetIdFilters?: string[];
  MaxEirp?: number;
}
export const UpdateWirelessGatewayRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    JoinEuiFilters: S.optional(JoinEuiFilters),
    NetIdFilters: S.optional(NetIdFilters),
    MaxEirp: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/wireless-gateways/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWirelessGatewayRequest",
}) as any as S.Schema<UpdateWirelessGatewayRequest>;
export interface UpdateWirelessGatewayResponse {}
export const UpdateWirelessGatewayResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateWirelessGatewayResponse",
}) as any as S.Schema<UpdateWirelessGatewayResponse>;
export type FactoryPresetFreqsList = number[];
export const FactoryPresetFreqsList = S.Array(S.Number);
export type SubBands = number[];
export const SubBands = S.Array(S.Number);
export type MetricName =
  | "DeviceRSSI"
  | "DeviceSNR"
  | "DeviceRoamingRSSI"
  | "DeviceRoamingSNR"
  | "DeviceUplinkCount"
  | "DeviceDownlinkCount"
  | "DeviceUplinkLostCount"
  | "DeviceUplinkLostRate"
  | "DeviceJoinRequestCount"
  | "DeviceJoinAcceptCount"
  | "DeviceRoamingUplinkCount"
  | "DeviceRoamingDownlinkCount"
  | "GatewayUpTime"
  | "GatewayDownTime"
  | "GatewayRSSI"
  | "GatewaySNR"
  | "GatewayUplinkCount"
  | "GatewayDownlinkCount"
  | "GatewayJoinRequestCount"
  | "GatewayJoinAcceptCount"
  | "AwsAccountUplinkCount"
  | "AwsAccountDownlinkCount"
  | "AwsAccountUplinkLostCount"
  | "AwsAccountUplinkLostRate"
  | "AwsAccountJoinRequestCount"
  | "AwsAccountJoinAcceptCount"
  | "AwsAccountRoamingUplinkCount"
  | "AwsAccountRoamingDownlinkCount"
  | "AwsAccountDeviceCount"
  | "AwsAccountGatewayCount"
  | "AwsAccountActiveDeviceCount"
  | "AwsAccountActiveGatewayCount"
  | (string & {});
export const MetricName = S.String;
export type AggregationPeriod =
  | "OneHour"
  | "OneDay"
  | "OneWeek"
  | (string & {});
export const AggregationPeriod = S.String;
export type AssistPosition = number[];
export const AssistPosition = S.Array(S.Number);
export interface SidewalkAccountInfo {
  AmazonId?: string;
  AppServerPrivateKey?: string | redacted.Redacted<string>;
}
export const SidewalkAccountInfo = S.suspend(() =>
  S.Struct({
    AmazonId: S.optional(S.String),
    AppServerPrivateKey: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SidewalkAccountInfo",
}) as any as S.Schema<SidewalkAccountInfo>;
export interface LoRaWANDeviceProfile {
  SupportsClassB?: boolean;
  ClassBTimeout?: number;
  PingSlotPeriod?: number;
  PingSlotDr?: number;
  PingSlotFreq?: number;
  SupportsClassC?: boolean;
  ClassCTimeout?: number;
  MacVersion?: string;
  RegParamsRevision?: string;
  RxDelay1?: number;
  RxDrOffset1?: number;
  RxDataRate2?: number;
  RxFreq2?: number;
  FactoryPresetFreqsList?: number[];
  MaxEirp?: number;
  MaxDutyCycle?: number;
  RfRegion?: string;
  SupportsJoin?: boolean;
  Supports32BitFCnt?: boolean;
}
export const LoRaWANDeviceProfile = S.suspend(() =>
  S.Struct({
    SupportsClassB: S.optional(S.Boolean),
    ClassBTimeout: S.optional(S.Number),
    PingSlotPeriod: S.optional(S.Number),
    PingSlotDr: S.optional(S.Number),
    PingSlotFreq: S.optional(S.Number),
    SupportsClassC: S.optional(S.Boolean),
    ClassCTimeout: S.optional(S.Number),
    MacVersion: S.optional(S.String),
    RegParamsRevision: S.optional(S.String),
    RxDelay1: S.optional(S.Number),
    RxDrOffset1: S.optional(S.Number),
    RxDataRate2: S.optional(S.Number),
    RxFreq2: S.optional(S.Number),
    FactoryPresetFreqsList: S.optional(FactoryPresetFreqsList),
    MaxEirp: S.optional(S.Number),
    MaxDutyCycle: S.optional(S.Number),
    RfRegion: S.optional(S.String),
    SupportsJoin: S.optional(S.Boolean),
    Supports32BitFCnt: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LoRaWANDeviceProfile",
}) as any as S.Schema<LoRaWANDeviceProfile>;
export interface LoRaWANServiceProfile {
  AddGwMetadata?: boolean;
  DrMin?: number;
  DrMax?: number;
  PrAllowed?: boolean;
  RaAllowed?: boolean;
  TxPowerIndexMin?: number;
  TxPowerIndexMax?: number;
  NbTransMin?: number;
  NbTransMax?: number;
}
export const LoRaWANServiceProfile = S.suspend(() =>
  S.Struct({
    AddGwMetadata: S.optional(S.Boolean),
    DrMin: S.optional(S.Number),
    DrMax: S.optional(S.Number),
    PrAllowed: S.optional(S.Boolean),
    RaAllowed: S.optional(S.Boolean),
    TxPowerIndexMin: S.optional(S.Number),
    TxPowerIndexMax: S.optional(S.Number),
    NbTransMin: S.optional(S.Number),
    NbTransMax: S.optional(S.Number),
  }),
).annotations({
  identifier: "LoRaWANServiceProfile",
}) as any as S.Schema<LoRaWANServiceProfile>;
export type WirelessGatewayTaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "FIRST_RETRY"
  | "SECOND_RETRY"
  | "COMPLETED"
  | "FAILED"
  | (string & {});
export const WirelessGatewayTaskStatus = S.String;
export type FuotaTaskStatus =
  | "Pending"
  | "FuotaSession_Waiting"
  | "In_FuotaSession"
  | "FuotaDone"
  | "Delete_Waiting"
  | (string & {});
export const FuotaTaskStatus = S.String;
export type PositionSolverType = "GNSS" | (string & {});
export const PositionSolverType = S.String;
export type PositionSolverProvider = "Semtech" | (string & {});
export const PositionSolverProvider = S.String;
export interface WiFiAccessPoint {
  MacAddress: string;
  Rss: number;
}
export const WiFiAccessPoint = S.suspend(() =>
  S.Struct({ MacAddress: S.String, Rss: S.Number }),
).annotations({
  identifier: "WiFiAccessPoint",
}) as any as S.Schema<WiFiAccessPoint>;
export type WiFiAccessPoints = WiFiAccessPoint[];
export const WiFiAccessPoints = S.Array(WiFiAccessPoint);
export interface Ip {
  IpAddress: string;
}
export const Ip = S.suspend(() =>
  S.Struct({ IpAddress: S.String }),
).annotations({ identifier: "Ip" }) as any as S.Schema<Ip>;
export interface Gnss {
  Payload: string;
  CaptureTime?: number;
  CaptureTimeAccuracy?: number;
  AssistPosition?: number[];
  AssistAltitude?: number;
  Use2DSolver?: boolean;
}
export const Gnss = S.suspend(() =>
  S.Struct({
    Payload: S.String,
    CaptureTime: S.optional(S.Number),
    CaptureTimeAccuracy: S.optional(S.Number),
    AssistPosition: S.optional(AssistPosition),
    AssistAltitude: S.optional(S.Number),
    Use2DSolver: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Gnss" }) as any as S.Schema<Gnss>;
export type ImportTaskStatus =
  | "INITIALIZING"
  | "INITIALIZED"
  | "PENDING"
  | "COMPLETE"
  | "FAILED"
  | "DELETING"
  | (string & {});
export const ImportTaskStatus = S.String;
export type ConnectionStatus = "Connected" | "Disconnected" | (string & {});
export const ConnectionStatus = S.String;
export interface SidewalkAccountInfoWithFingerprint {
  AmazonId?: string;
  Fingerprint?: string | redacted.Redacted<string>;
  Arn?: string;
}
export const SidewalkAccountInfoWithFingerprint = S.suspend(() =>
  S.Struct({
    AmazonId: S.optional(S.String),
    Fingerprint: S.optional(SensitiveString),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "SidewalkAccountInfoWithFingerprint",
}) as any as S.Schema<SidewalkAccountInfoWithFingerprint>;
export type SidewalkAccountList = SidewalkAccountInfoWithFingerprint[];
export const SidewalkAccountList = S.Array(SidewalkAccountInfoWithFingerprint);
export interface LoRaWANStartFuotaTask {
  StartTime?: Date;
}
export const LoRaWANStartFuotaTask = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "LoRaWANStartFuotaTask",
}) as any as S.Schema<LoRaWANStartFuotaTask>;
export interface LoRaWANMulticastSession {
  DlDr?: number;
  DlFreq?: number;
  SessionStartTime?: Date;
  SessionTimeout?: number;
  PingSlotPeriod?: number;
}
export const LoRaWANMulticastSession = S.suspend(() =>
  S.Struct({
    DlDr: S.optional(S.Number),
    DlFreq: S.optional(S.Number),
    SessionStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SessionTimeout: S.optional(S.Number),
    PingSlotPeriod: S.optional(S.Number),
  }),
).annotations({
  identifier: "LoRaWANMulticastSession",
}) as any as S.Schema<LoRaWANMulticastSession>;
export interface SidewalkPositioning {
  DestinationName?: string;
}
export const SidewalkPositioning = S.suspend(() =>
  S.Struct({ DestinationName: S.optional(S.String) }),
).annotations({
  identifier: "SidewalkPositioning",
}) as any as S.Schema<SidewalkPositioning>;
export interface SidewalkSingleStartImportInfo {
  SidewalkManufacturingSn?: string;
  Positioning?: SidewalkPositioning;
}
export const SidewalkSingleStartImportInfo = S.suspend(() =>
  S.Struct({
    SidewalkManufacturingSn: S.optional(S.String),
    Positioning: S.optional(SidewalkPositioning),
  }),
).annotations({
  identifier: "SidewalkSingleStartImportInfo",
}) as any as S.Schema<SidewalkSingleStartImportInfo>;
export interface SidewalkStartImportInfo {
  DeviceCreationFile?: string;
  Role?: string;
  Positioning?: SidewalkPositioning;
}
export const SidewalkStartImportInfo = S.suspend(() =>
  S.Struct({
    DeviceCreationFile: S.optional(S.String),
    Role: S.optional(S.String),
    Positioning: S.optional(SidewalkPositioning),
  }),
).annotations({
  identifier: "SidewalkStartImportInfo",
}) as any as S.Schema<SidewalkStartImportInfo>;
export interface SidewalkUpdateAccount {
  AppServerPrivateKey?: string | redacted.Redacted<string>;
}
export const SidewalkUpdateAccount = S.suspend(() =>
  S.Struct({ AppServerPrivateKey: S.optional(SensitiveString) }),
).annotations({
  identifier: "SidewalkUpdateAccount",
}) as any as S.Schema<SidewalkUpdateAccount>;
export interface SidewalkEventNotificationConfigurations {
  AmazonIdEventTopic?: EventNotificationTopicStatus;
}
export const SidewalkEventNotificationConfigurations = S.suspend(() =>
  S.Struct({ AmazonIdEventTopic: S.optional(EventNotificationTopicStatus) }),
).annotations({
  identifier: "SidewalkEventNotificationConfigurations",
}) as any as S.Schema<SidewalkEventNotificationConfigurations>;
export interface ProximityEventConfiguration {
  Sidewalk?: SidewalkEventNotificationConfigurations;
  WirelessDeviceIdEventTopic?: EventNotificationTopicStatus;
}
export const ProximityEventConfiguration = S.suspend(() =>
  S.Struct({
    Sidewalk: S.optional(SidewalkEventNotificationConfigurations),
    WirelessDeviceIdEventTopic: S.optional(EventNotificationTopicStatus),
  }),
).annotations({
  identifier: "ProximityEventConfiguration",
}) as any as S.Schema<ProximityEventConfiguration>;
export interface MessageDeliveryStatusEventConfiguration {
  Sidewalk?: SidewalkEventNotificationConfigurations;
  WirelessDeviceIdEventTopic?: EventNotificationTopicStatus;
}
export const MessageDeliveryStatusEventConfiguration = S.suspend(() =>
  S.Struct({
    Sidewalk: S.optional(SidewalkEventNotificationConfigurations),
    WirelessDeviceIdEventTopic: S.optional(EventNotificationTopicStatus),
  }),
).annotations({
  identifier: "MessageDeliveryStatusEventConfiguration",
}) as any as S.Schema<MessageDeliveryStatusEventConfiguration>;
export interface SidewalkUpdateWirelessDevice {
  Positioning?: SidewalkPositioning;
}
export const SidewalkUpdateWirelessDevice = S.suspend(() =>
  S.Struct({ Positioning: S.optional(SidewalkPositioning) }),
).annotations({
  identifier: "SidewalkUpdateWirelessDevice",
}) as any as S.Schema<SidewalkUpdateWirelessDevice>;
export interface SidewalkUpdateImportInfo {
  DeviceCreationFile?: string;
}
export const SidewalkUpdateImportInfo = S.suspend(() =>
  S.Struct({ DeviceCreationFile: S.optional(S.String) }),
).annotations({
  identifier: "SidewalkUpdateImportInfo",
}) as any as S.Schema<SidewalkUpdateImportInfo>;
export type BeaconingFrequencies = number[];
export const BeaconingFrequencies = S.Array(S.Number);
export type DimensionName = "DeviceId" | "GatewayId" | (string & {});
export const DimensionName = S.String;
export type PositionConfigurationStatus =
  | "Enabled"
  | "Disabled"
  | (string & {});
export const PositionConfigurationStatus = S.String;
export type PositionConfigurationFec = "ROSE" | "NONE" | (string & {});
export const PositionConfigurationFec = S.String;
export type MessageType =
  | "CUSTOM_COMMAND_ID_NOTIFY"
  | "CUSTOM_COMMAND_ID_GET"
  | "CUSTOM_COMMAND_ID_SET"
  | "CUSTOM_COMMAND_ID_RESP"
  | (string & {});
export const MessageType = S.String;
export interface AssociateAwsAccountWithPartnerAccountRequest {
  Sidewalk: SidewalkAccountInfo;
  ClientRequestToken?: string;
  Tags?: Tag[];
}
export const AssociateAwsAccountWithPartnerAccountRequest = S.suspend(() =>
  S.Struct({
    Sidewalk: SidewalkAccountInfo,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/partner-accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateAwsAccountWithPartnerAccountRequest",
}) as any as S.Schema<AssociateAwsAccountWithPartnerAccountRequest>;
export interface AssociateWirelessGatewayWithCertificateResponse {
  IotCertificateId?: string;
}
export const AssociateWirelessGatewayWithCertificateResponse = S.suspend(() =>
  S.Struct({ IotCertificateId: S.optional(S.String) }),
).annotations({
  identifier: "AssociateWirelessGatewayWithCertificateResponse",
}) as any as S.Schema<AssociateWirelessGatewayWithCertificateResponse>;
export interface CreateDestinationResponse {
  Arn?: string;
  Name?: string;
}
export const CreateDestinationResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateDestinationResponse",
}) as any as S.Schema<CreateDestinationResponse>;
export interface CreateDeviceProfileRequest {
  Name?: string;
  LoRaWAN?: LoRaWANDeviceProfile;
  Tags?: Tag[];
  ClientRequestToken?: string;
  Sidewalk?: SidewalkCreateDeviceProfile;
}
export const CreateDeviceProfileRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANDeviceProfile),
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Sidewalk: S.optional(SidewalkCreateDeviceProfile),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/device-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDeviceProfileRequest",
}) as any as S.Schema<CreateDeviceProfileRequest>;
export interface CreateFuotaTaskRequest {
  Name?: string;
  Description?: string;
  ClientRequestToken?: string;
  LoRaWAN?: LoRaWANFuotaTask;
  FirmwareUpdateImage: string;
  FirmwareUpdateRole: string;
  Tags?: Tag[];
  RedundancyPercent?: number;
  FragmentSizeBytes?: number;
  FragmentIntervalMS?: number;
  Descriptor?: string;
}
export const CreateFuotaTaskRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    LoRaWAN: S.optional(LoRaWANFuotaTask),
    FirmwareUpdateImage: S.String,
    FirmwareUpdateRole: S.String,
    Tags: S.optional(TagList),
    RedundancyPercent: S.optional(S.Number),
    FragmentSizeBytes: S.optional(S.Number),
    FragmentIntervalMS: S.optional(S.Number),
    Descriptor: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/fuota-tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFuotaTaskRequest",
}) as any as S.Schema<CreateFuotaTaskRequest>;
export interface CreateNetworkAnalyzerConfigurationRequest {
  Name: string;
  TraceContent?: TraceContent;
  WirelessDevices?: string[];
  WirelessGateways?: string[];
  Description?: string;
  Tags?: Tag[];
  ClientRequestToken?: string;
  MulticastGroups?: string[];
}
export const CreateNetworkAnalyzerConfigurationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    TraceContent: S.optional(TraceContent),
    WirelessDevices: S.optional(WirelessDeviceList),
    WirelessGateways: S.optional(WirelessGatewayList),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    MulticastGroups: S.optional(NetworkAnalyzerMulticastGroupList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/network-analyzer-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNetworkAnalyzerConfigurationRequest",
}) as any as S.Schema<CreateNetworkAnalyzerConfigurationRequest>;
export interface CreateServiceProfileRequest {
  Name?: string;
  LoRaWAN?: LoRaWANServiceProfile;
  Tags?: Tag[];
  ClientRequestToken?: string;
}
export const CreateServiceProfileRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANServiceProfile),
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/service-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateServiceProfileRequest",
}) as any as S.Schema<CreateServiceProfileRequest>;
export interface CreateWirelessGatewayTaskResponse {
  WirelessGatewayTaskDefinitionId?: string;
  Status?: WirelessGatewayTaskStatus;
}
export const CreateWirelessGatewayTaskResponse = S.suspend(() =>
  S.Struct({
    WirelessGatewayTaskDefinitionId: S.optional(S.String),
    Status: S.optional(WirelessGatewayTaskStatus),
  }),
).annotations({
  identifier: "CreateWirelessGatewayTaskResponse",
}) as any as S.Schema<CreateWirelessGatewayTaskResponse>;
export interface GetDestinationResponse {
  Arn?: string;
  Name?: string;
  Expression?: string;
  ExpressionType?: ExpressionType;
  Description?: string;
  RoleArn?: string;
}
export const GetDestinationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Expression: S.optional(S.String),
    ExpressionType: S.optional(ExpressionType),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDestinationResponse",
}) as any as S.Schema<GetDestinationResponse>;
export interface GetMetricConfigurationResponse {
  SummaryMetric?: SummaryMetricConfiguration;
}
export const GetMetricConfigurationResponse = S.suspend(() =>
  S.Struct({ SummaryMetric: S.optional(SummaryMetricConfiguration) }),
).annotations({
  identifier: "GetMetricConfigurationResponse",
}) as any as S.Schema<GetMetricConfigurationResponse>;
export interface GetMulticastGroupSessionResponse {
  LoRaWAN?: LoRaWANMulticastSession;
}
export const GetMulticastGroupSessionResponse = S.suspend(() =>
  S.Struct({ LoRaWAN: S.optional(LoRaWANMulticastSession) }),
).annotations({
  identifier: "GetMulticastGroupSessionResponse",
}) as any as S.Schema<GetMulticastGroupSessionResponse>;
export interface GetNetworkAnalyzerConfigurationResponse {
  TraceContent?: TraceContent;
  WirelessDevices?: string[];
  WirelessGateways?: string[];
  Description?: string;
  Arn?: string;
  Name?: string;
  MulticastGroups?: string[];
}
export const GetNetworkAnalyzerConfigurationResponse = S.suspend(() =>
  S.Struct({
    TraceContent: S.optional(TraceContent),
    WirelessDevices: S.optional(WirelessDeviceList),
    WirelessGateways: S.optional(WirelessGatewayList),
    Description: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    MulticastGroups: S.optional(NetworkAnalyzerMulticastGroupList),
  }),
).annotations({
  identifier: "GetNetworkAnalyzerConfigurationResponse",
}) as any as S.Schema<GetNetworkAnalyzerConfigurationResponse>;
export interface DeviceRegistrationStateEventConfiguration {
  Sidewalk?: SidewalkEventNotificationConfigurations;
  WirelessDeviceIdEventTopic?: EventNotificationTopicStatus;
}
export const DeviceRegistrationStateEventConfiguration = S.suspend(() =>
  S.Struct({
    Sidewalk: S.optional(SidewalkEventNotificationConfigurations),
    WirelessDeviceIdEventTopic: S.optional(EventNotificationTopicStatus),
  }),
).annotations({
  identifier: "DeviceRegistrationStateEventConfiguration",
}) as any as S.Schema<DeviceRegistrationStateEventConfiguration>;
export interface LoRaWANJoinEventNotificationConfigurations {
  DevEuiEventTopic?: EventNotificationTopicStatus;
}
export const LoRaWANJoinEventNotificationConfigurations = S.suspend(() =>
  S.Struct({ DevEuiEventTopic: S.optional(EventNotificationTopicStatus) }),
).annotations({
  identifier: "LoRaWANJoinEventNotificationConfigurations",
}) as any as S.Schema<LoRaWANJoinEventNotificationConfigurations>;
export interface JoinEventConfiguration {
  LoRaWAN?: LoRaWANJoinEventNotificationConfigurations;
  WirelessDeviceIdEventTopic?: EventNotificationTopicStatus;
}
export const JoinEventConfiguration = S.suspend(() =>
  S.Struct({
    LoRaWAN: S.optional(LoRaWANJoinEventNotificationConfigurations),
    WirelessDeviceIdEventTopic: S.optional(EventNotificationTopicStatus),
  }),
).annotations({
  identifier: "JoinEventConfiguration",
}) as any as S.Schema<JoinEventConfiguration>;
export interface LoRaWANConnectionStatusEventNotificationConfigurations {
  GatewayEuiEventTopic?: EventNotificationTopicStatus;
}
export const LoRaWANConnectionStatusEventNotificationConfigurations = S.suspend(
  () =>
    S.Struct({
      GatewayEuiEventTopic: S.optional(EventNotificationTopicStatus),
    }),
).annotations({
  identifier: "LoRaWANConnectionStatusEventNotificationConfigurations",
}) as any as S.Schema<LoRaWANConnectionStatusEventNotificationConfigurations>;
export interface ConnectionStatusEventConfiguration {
  LoRaWAN?: LoRaWANConnectionStatusEventNotificationConfigurations;
  WirelessGatewayIdEventTopic?: EventNotificationTopicStatus;
}
export const ConnectionStatusEventConfiguration = S.suspend(() =>
  S.Struct({
    LoRaWAN: S.optional(LoRaWANConnectionStatusEventNotificationConfigurations),
    WirelessGatewayIdEventTopic: S.optional(EventNotificationTopicStatus),
  }),
).annotations({
  identifier: "ConnectionStatusEventConfiguration",
}) as any as S.Schema<ConnectionStatusEventConfiguration>;
export interface GetResourceEventConfigurationResponse {
  DeviceRegistrationState?: DeviceRegistrationStateEventConfiguration;
  Proximity?: ProximityEventConfiguration;
  Join?: JoinEventConfiguration;
  ConnectionStatus?: ConnectionStatusEventConfiguration;
  MessageDeliveryStatus?: MessageDeliveryStatusEventConfiguration;
}
export const GetResourceEventConfigurationResponse = S.suspend(() =>
  S.Struct({
    DeviceRegistrationState: S.optional(
      DeviceRegistrationStateEventConfiguration,
    ),
    Proximity: S.optional(ProximityEventConfiguration),
    Join: S.optional(JoinEventConfiguration),
    ConnectionStatus: S.optional(ConnectionStatusEventConfiguration),
    MessageDeliveryStatus: S.optional(MessageDeliveryStatusEventConfiguration),
  }),
).annotations({
  identifier: "GetResourceEventConfigurationResponse",
}) as any as S.Schema<GetResourceEventConfigurationResponse>;
export interface GetResourceLogLevelResponse {
  LogLevel?: LogLevel;
}
export const GetResourceLogLevelResponse = S.suspend(() =>
  S.Struct({ LogLevel: S.optional(LogLevel) }),
).annotations({
  identifier: "GetResourceLogLevelResponse",
}) as any as S.Schema<GetResourceLogLevelResponse>;
export interface GetResourcePositionResponse {
  GeoJsonPayload?: T.StreamingOutputBody;
}
export const GetResourcePositionResponse = S.suspend(() =>
  S.Struct({
    GeoJsonPayload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetResourcePositionResponse",
}) as any as S.Schema<GetResourcePositionResponse>;
export interface GetServiceEndpointResponse {
  ServiceType?: WirelessGatewayServiceType;
  ServiceEndpoint?: string;
  ServerTrust?: string;
}
export const GetServiceEndpointResponse = S.suspend(() =>
  S.Struct({
    ServiceType: S.optional(WirelessGatewayServiceType),
    ServiceEndpoint: S.optional(S.String),
    ServerTrust: S.optional(S.String),
  }),
).annotations({
  identifier: "GetServiceEndpointResponse",
}) as any as S.Schema<GetServiceEndpointResponse>;
export interface Beaconing {
  DataRate?: number;
  Frequencies?: number[];
}
export const Beaconing = S.suspend(() =>
  S.Struct({
    DataRate: S.optional(S.Number),
    Frequencies: S.optional(BeaconingFrequencies),
  }),
).annotations({ identifier: "Beaconing" }) as any as S.Schema<Beaconing>;
export interface LoRaWANGateway {
  GatewayEui?: string;
  RfRegion?: string;
  JoinEuiFilters?: string[][];
  NetIdFilters?: string[];
  SubBands?: number[];
  Beaconing?: Beaconing;
  MaxEirp?: number;
}
export const LoRaWANGateway = S.suspend(() =>
  S.Struct({
    GatewayEui: S.optional(S.String),
    RfRegion: S.optional(S.String),
    JoinEuiFilters: S.optional(JoinEuiFilters),
    NetIdFilters: S.optional(NetIdFilters),
    SubBands: S.optional(SubBands),
    Beaconing: S.optional(Beaconing),
    MaxEirp: S.optional(S.Number),
  }),
).annotations({
  identifier: "LoRaWANGateway",
}) as any as S.Schema<LoRaWANGateway>;
export interface GetWirelessGatewayResponse {
  Name?: string;
  Id?: string;
  Description?: string;
  LoRaWAN?: LoRaWANGateway;
  Arn?: string;
  ThingName?: string;
  ThingArn?: string;
}
export const GetWirelessGatewayResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANGateway),
    Arn: S.optional(S.String),
    ThingName: S.optional(S.String),
    ThingArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetWirelessGatewayResponse",
}) as any as S.Schema<GetWirelessGatewayResponse>;
export interface GetWirelessGatewayCertificateResponse {
  IotCertificateId?: string;
  LoRaWANNetworkServerCertificateId?: string;
}
export const GetWirelessGatewayCertificateResponse = S.suspend(() =>
  S.Struct({
    IotCertificateId: S.optional(S.String),
    LoRaWANNetworkServerCertificateId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetWirelessGatewayCertificateResponse",
}) as any as S.Schema<GetWirelessGatewayCertificateResponse>;
export interface GetWirelessGatewayStatisticsResponse {
  WirelessGatewayId?: string;
  LastUplinkReceivedAt?: string;
  ConnectionStatus?: ConnectionStatus;
}
export const GetWirelessGatewayStatisticsResponse = S.suspend(() =>
  S.Struct({
    WirelessGatewayId: S.optional(S.String),
    LastUplinkReceivedAt: S.optional(S.String),
    ConnectionStatus: S.optional(ConnectionStatus),
  }),
).annotations({
  identifier: "GetWirelessGatewayStatisticsResponse",
}) as any as S.Schema<GetWirelessGatewayStatisticsResponse>;
export interface GetWirelessGatewayTaskResponse {
  WirelessGatewayId?: string;
  WirelessGatewayTaskDefinitionId?: string;
  LastUplinkReceivedAt?: string;
  TaskCreatedAt?: string;
  Status?: WirelessGatewayTaskStatus;
}
export const GetWirelessGatewayTaskResponse = S.suspend(() =>
  S.Struct({
    WirelessGatewayId: S.optional(S.String),
    WirelessGatewayTaskDefinitionId: S.optional(S.String),
    LastUplinkReceivedAt: S.optional(S.String),
    TaskCreatedAt: S.optional(S.String),
    Status: S.optional(WirelessGatewayTaskStatus),
  }),
).annotations({
  identifier: "GetWirelessGatewayTaskResponse",
}) as any as S.Schema<GetWirelessGatewayTaskResponse>;
export interface LoRaWANGatewayVersion {
  PackageVersion?: string;
  Model?: string;
  Station?: string;
}
export const LoRaWANGatewayVersion = S.suspend(() =>
  S.Struct({
    PackageVersion: S.optional(S.String),
    Model: S.optional(S.String),
    Station: S.optional(S.String),
  }),
).annotations({
  identifier: "LoRaWANGatewayVersion",
}) as any as S.Schema<LoRaWANGatewayVersion>;
export interface LoRaWANUpdateGatewayTaskCreate {
  UpdateSignature?: string;
  SigKeyCrc?: number;
  CurrentVersion?: LoRaWANGatewayVersion;
  UpdateVersion?: LoRaWANGatewayVersion;
}
export const LoRaWANUpdateGatewayTaskCreate = S.suspend(() =>
  S.Struct({
    UpdateSignature: S.optional(S.String),
    SigKeyCrc: S.optional(S.Number),
    CurrentVersion: S.optional(LoRaWANGatewayVersion),
    UpdateVersion: S.optional(LoRaWANGatewayVersion),
  }),
).annotations({
  identifier: "LoRaWANUpdateGatewayTaskCreate",
}) as any as S.Schema<LoRaWANUpdateGatewayTaskCreate>;
export interface UpdateWirelessGatewayTaskCreate {
  UpdateDataSource?: string;
  UpdateDataRole?: string;
  LoRaWAN?: LoRaWANUpdateGatewayTaskCreate;
}
export const UpdateWirelessGatewayTaskCreate = S.suspend(() =>
  S.Struct({
    UpdateDataSource: S.optional(S.String),
    UpdateDataRole: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANUpdateGatewayTaskCreate),
  }),
).annotations({
  identifier: "UpdateWirelessGatewayTaskCreate",
}) as any as S.Schema<UpdateWirelessGatewayTaskCreate>;
export interface GetWirelessGatewayTaskDefinitionResponse {
  AutoCreateTasks?: boolean;
  Name?: string;
  Update?: UpdateWirelessGatewayTaskCreate;
  Arn?: string;
}
export const GetWirelessGatewayTaskDefinitionResponse = S.suspend(() =>
  S.Struct({
    AutoCreateTasks: S.optional(S.Boolean),
    Name: S.optional(S.String),
    Update: S.optional(UpdateWirelessGatewayTaskCreate),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetWirelessGatewayTaskDefinitionResponse",
}) as any as S.Schema<GetWirelessGatewayTaskDefinitionResponse>;
export interface ListPartnerAccountsResponse {
  NextToken?: string;
  Sidewalk?: SidewalkAccountInfoWithFingerprint[];
}
export const ListPartnerAccountsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Sidewalk: S.optional(SidewalkAccountList),
  }),
).annotations({
  identifier: "ListPartnerAccountsResponse",
}) as any as S.Schema<ListPartnerAccountsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartFuotaTaskRequest {
  Id: string;
  LoRaWAN?: LoRaWANStartFuotaTask;
}
export const StartFuotaTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    LoRaWAN: S.optional(LoRaWANStartFuotaTask),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/fuota-tasks/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartFuotaTaskRequest",
}) as any as S.Schema<StartFuotaTaskRequest>;
export interface StartFuotaTaskResponse {}
export const StartFuotaTaskResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "StartFuotaTaskResponse" },
) as any as S.Schema<StartFuotaTaskResponse>;
export interface StartMulticastGroupSessionRequest {
  Id: string;
  LoRaWAN: LoRaWANMulticastSession;
}
export const StartMulticastGroupSessionRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    LoRaWAN: LoRaWANMulticastSession,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/multicast-groups/{Id}/session" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMulticastGroupSessionRequest",
}) as any as S.Schema<StartMulticastGroupSessionRequest>;
export interface StartMulticastGroupSessionResponse {}
export const StartMulticastGroupSessionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartMulticastGroupSessionResponse",
}) as any as S.Schema<StartMulticastGroupSessionResponse>;
export interface StartSingleWirelessDeviceImportTaskRequest {
  DestinationName: string;
  ClientRequestToken?: string;
  DeviceName?: string;
  Tags?: Tag[];
  Positioning?: PositioningConfigStatus;
  Sidewalk: SidewalkSingleStartImportInfo;
}
export const StartSingleWirelessDeviceImportTaskRequest = S.suspend(() =>
  S.Struct({
    DestinationName: S.String,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    DeviceName: S.optional(S.String),
    Tags: S.optional(TagList),
    Positioning: S.optional(PositioningConfigStatus),
    Sidewalk: SidewalkSingleStartImportInfo,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/wireless_single_device_import_task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSingleWirelessDeviceImportTaskRequest",
}) as any as S.Schema<StartSingleWirelessDeviceImportTaskRequest>;
export interface StartWirelessDeviceImportTaskRequest {
  DestinationName: string;
  ClientRequestToken?: string;
  Tags?: Tag[];
  Positioning?: PositioningConfigStatus;
  Sidewalk: SidewalkStartImportInfo;
}
export const StartWirelessDeviceImportTaskRequest = S.suspend(() =>
  S.Struct({
    DestinationName: S.String,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
    Positioning: S.optional(PositioningConfigStatus),
    Sidewalk: SidewalkStartImportInfo,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/wireless_device_import_task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartWirelessDeviceImportTaskRequest",
}) as any as S.Schema<StartWirelessDeviceImportTaskRequest>;
export interface TestWirelessDeviceResponse {
  Result?: string;
}
export const TestWirelessDeviceResponse = S.suspend(() =>
  S.Struct({ Result: S.optional(S.String) }),
).annotations({
  identifier: "TestWirelessDeviceResponse",
}) as any as S.Schema<TestWirelessDeviceResponse>;
export interface UpdatePartnerAccountRequest {
  Sidewalk: SidewalkUpdateAccount;
  PartnerAccountId: string;
  PartnerType: PartnerType;
}
export const UpdatePartnerAccountRequest = S.suspend(() =>
  S.Struct({
    Sidewalk: SidewalkUpdateAccount,
    PartnerAccountId: S.String.pipe(T.HttpLabel("PartnerAccountId")),
    PartnerType: PartnerType.pipe(T.HttpQuery("partnerType")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/partner-accounts/{PartnerAccountId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePartnerAccountRequest",
}) as any as S.Schema<UpdatePartnerAccountRequest>;
export interface UpdatePartnerAccountResponse {}
export const UpdatePartnerAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePartnerAccountResponse",
}) as any as S.Schema<UpdatePartnerAccountResponse>;
export interface UpdateWirelessDeviceImportTaskRequest {
  Id: string;
  Sidewalk: SidewalkUpdateImportInfo;
}
export const UpdateWirelessDeviceImportTaskRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Sidewalk: SidewalkUpdateImportInfo,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/wireless_device_import_task/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWirelessDeviceImportTaskRequest",
}) as any as S.Schema<UpdateWirelessDeviceImportTaskRequest>;
export interface UpdateWirelessDeviceImportTaskResponse {}
export const UpdateWirelessDeviceImportTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateWirelessDeviceImportTaskResponse",
}) as any as S.Schema<UpdateWirelessDeviceImportTaskResponse>;
export interface OtaaV1_1 {
  AppKey?: string;
  NwkKey?: string;
  JoinEui?: string;
}
export const OtaaV1_1 = S.suspend(() =>
  S.Struct({
    AppKey: S.optional(S.String),
    NwkKey: S.optional(S.String),
    JoinEui: S.optional(S.String),
  }),
).annotations({ identifier: "OtaaV1_1" }) as any as S.Schema<OtaaV1_1>;
export interface OtaaV1_0_x {
  AppKey?: string;
  AppEui?: string;
  JoinEui?: string;
  GenAppKey?: string;
}
export const OtaaV1_0_x = S.suspend(() =>
  S.Struct({
    AppKey: S.optional(S.String),
    AppEui: S.optional(S.String),
    JoinEui: S.optional(S.String),
    GenAppKey: S.optional(S.String),
  }),
).annotations({ identifier: "OtaaV1_0_x" }) as any as S.Schema<OtaaV1_0_x>;
export interface Dimension {
  name?: DimensionName;
  value?: string;
}
export const Dimension = S.suspend(() =>
  S.Struct({ name: S.optional(DimensionName), value: S.optional(S.String) }),
).annotations({ identifier: "Dimension" }) as any as S.Schema<Dimension>;
export type Dimensions = Dimension[];
export const Dimensions = S.Array(Dimension);
export type SigningAlg = "Ed25519" | "P256r1" | (string & {});
export const SigningAlg = S.String;
export interface CertificateList {
  SigningAlg: SigningAlg;
  Value: string;
}
export const CertificateList = S.suspend(() =>
  S.Struct({ SigningAlg: SigningAlg, Value: S.String }),
).annotations({
  identifier: "CertificateList",
}) as any as S.Schema<CertificateList>;
export type PrivateKeysList = CertificateList[];
export const PrivateKeysList = S.Array(CertificateList);
export type WirelessDeviceSidewalkStatus =
  | "PROVISIONED"
  | "REGISTERED"
  | "ACTIVATED"
  | "UNKNOWN"
  | (string & {});
export const WirelessDeviceSidewalkStatus = S.String;
export type DeviceCreationFileList = string[];
export const DeviceCreationFileList = S.Array(S.String);
export type BatteryLevel = "normal" | "low" | "critical" | (string & {});
export const BatteryLevel = S.String;
export type Event =
  | "discovered"
  | "lost"
  | "ack"
  | "nack"
  | "passthrough"
  | (string & {});
export const Event = S.String;
export type DeviceState =
  | "Provisioned"
  | "RegisteredNotSeen"
  | "RegisteredReachable"
  | "RegisteredUnreachable"
  | (string & {});
export const DeviceState = S.String;
export type FuotaDeviceStatus =
  | "Initial"
  | "Package_Not_Supported"
  | "FragAlgo_unsupported"
  | "Not_enough_memory"
  | "FragIndex_unsupported"
  | "Wrong_descriptor"
  | "SessionCnt_replay"
  | "MissingFrag"
  | "MemoryError"
  | "MICError"
  | "Successful"
  | "Device_exist_in_conflict_fuota_task"
  | (string & {});
export const FuotaDeviceStatus = S.String;
export interface SemtechGnssConfiguration {
  Status: PositionConfigurationStatus;
  Fec: PositionConfigurationFec;
}
export const SemtechGnssConfiguration = S.suspend(() =>
  S.Struct({
    Status: PositionConfigurationStatus,
    Fec: PositionConfigurationFec,
  }),
).annotations({
  identifier: "SemtechGnssConfiguration",
}) as any as S.Schema<SemtechGnssConfiguration>;
export interface LoRaWANMulticastMetadata {
  FPort?: number;
}
export const LoRaWANMulticastMetadata = S.suspend(() =>
  S.Struct({ FPort: S.optional(S.Number) }),
).annotations({
  identifier: "LoRaWANMulticastMetadata",
}) as any as S.Schema<LoRaWANMulticastMetadata>;
export interface SidewalkSendDataToDevice {
  Seq?: number;
  MessageType?: MessageType;
  AckModeRetryDurationSecs?: number;
}
export const SidewalkSendDataToDevice = S.suspend(() =>
  S.Struct({
    Seq: S.optional(S.Number),
    MessageType: S.optional(MessageType),
    AckModeRetryDurationSecs: S.optional(S.Number),
  }),
).annotations({
  identifier: "SidewalkSendDataToDevice",
}) as any as S.Schema<SidewalkSendDataToDevice>;
export interface UpdateAbpV1_1 {
  FCntStart?: number;
}
export const UpdateAbpV1_1 = S.suspend(() =>
  S.Struct({ FCntStart: S.optional(S.Number) }),
).annotations({
  identifier: "UpdateAbpV1_1",
}) as any as S.Schema<UpdateAbpV1_1>;
export interface UpdateAbpV1_0_x {
  FCntStart?: number;
}
export const UpdateAbpV1_0_x = S.suspend(() =>
  S.Struct({ FCntStart: S.optional(S.Number) }),
).annotations({
  identifier: "UpdateAbpV1_0_x",
}) as any as S.Schema<UpdateAbpV1_0_x>;
export interface Positioning {
  ClockSync?: number;
  Stream?: number;
  Gnss?: number;
}
export const Positioning = S.suspend(() =>
  S.Struct({
    ClockSync: S.optional(S.Number),
    Stream: S.optional(S.Number),
    Gnss: S.optional(S.Number),
  }),
).annotations({ identifier: "Positioning" }) as any as S.Schema<Positioning>;
export type ApplicationConfigType = "SemtechGeolocation" | (string & {});
export const ApplicationConfigType = S.String;
export interface ApplicationConfig {
  FPort?: number;
  Type?: ApplicationConfigType;
  DestinationName?: string;
}
export const ApplicationConfig = S.suspend(() =>
  S.Struct({
    FPort: S.optional(S.Number),
    Type: S.optional(ApplicationConfigType),
    DestinationName: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplicationConfig",
}) as any as S.Schema<ApplicationConfig>;
export type Applications = ApplicationConfig[];
export const Applications = S.Array(ApplicationConfig);
export interface UpdateFPorts {
  Positioning?: Positioning;
  Applications?: ApplicationConfig[];
}
export const UpdateFPorts = S.suspend(() =>
  S.Struct({
    Positioning: S.optional(Positioning),
    Applications: S.optional(Applications),
  }),
).annotations({ identifier: "UpdateFPorts" }) as any as S.Schema<UpdateFPorts>;
export type DownlinkMode =
  | "SEQUENTIAL"
  | "CONCURRENT"
  | "USING_UPLINK_GATEWAY"
  | (string & {});
export const DownlinkMode = S.String;
export interface SidewalkCreateWirelessDevice {
  DeviceProfileId?: string;
  Positioning?: SidewalkPositioning;
  SidewalkManufacturingSn?: string;
}
export const SidewalkCreateWirelessDevice = S.suspend(() =>
  S.Struct({
    DeviceProfileId: S.optional(S.String),
    Positioning: S.optional(SidewalkPositioning),
    SidewalkManufacturingSn: S.optional(S.String),
  }),
).annotations({
  identifier: "SidewalkCreateWirelessDevice",
}) as any as S.Schema<SidewalkCreateWirelessDevice>;
export interface LoRaWANFuotaTaskGetInfo {
  RfRegion?: string;
  StartTime?: Date;
}
export const LoRaWANFuotaTaskGetInfo = S.suspend(() =>
  S.Struct({
    RfRegion: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "LoRaWANFuotaTaskGetInfo",
}) as any as S.Schema<LoRaWANFuotaTaskGetInfo>;
export interface SummaryMetricQuery {
  QueryId?: string;
  MetricName?: MetricName;
  Dimensions?: Dimension[];
  AggregationPeriod?: AggregationPeriod;
  StartTimestamp?: Date;
  EndTimestamp?: Date;
}
export const SummaryMetricQuery = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    MetricName: S.optional(MetricName),
    Dimensions: S.optional(Dimensions),
    AggregationPeriod: S.optional(AggregationPeriod),
    StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SummaryMetricQuery",
}) as any as S.Schema<SummaryMetricQuery>;
export type SummaryMetricQueries = SummaryMetricQuery[];
export const SummaryMetricQueries = S.Array(SummaryMetricQuery);
export interface LoRaWANMulticastGet {
  RfRegion?: SupportedRfRegion;
  DlClass?: DlClass;
  NumberOfDevicesRequested?: number;
  NumberOfDevicesInGroup?: number;
  ParticipatingGateways?: ParticipatingGatewaysMulticast;
}
export const LoRaWANMulticastGet = S.suspend(() =>
  S.Struct({
    RfRegion: S.optional(SupportedRfRegion),
    DlClass: S.optional(DlClass),
    NumberOfDevicesRequested: S.optional(S.Number),
    NumberOfDevicesInGroup: S.optional(S.Number),
    ParticipatingGateways: S.optional(ParticipatingGatewaysMulticast),
  }),
).annotations({
  identifier: "LoRaWANMulticastGet",
}) as any as S.Schema<LoRaWANMulticastGet>;
export interface Accuracy {
  HorizontalAccuracy?: number;
  VerticalAccuracy?: number;
}
export const Accuracy = S.suspend(() =>
  S.Struct({
    HorizontalAccuracy: S.optional(S.Number),
    VerticalAccuracy: S.optional(S.Number),
  }),
).annotations({ identifier: "Accuracy" }) as any as S.Schema<Accuracy>;
export interface LoRaWANGetServiceProfileInfo {
  UlRate?: number;
  UlBucketSize?: number;
  UlRatePolicy?: string;
  DlRate?: number;
  DlBucketSize?: number;
  DlRatePolicy?: string;
  AddGwMetadata?: boolean;
  DevStatusReqFreq?: number;
  ReportDevStatusBattery?: boolean;
  ReportDevStatusMargin?: boolean;
  DrMin?: number;
  DrMax?: number;
  ChannelMask?: string;
  PrAllowed?: boolean;
  HrAllowed?: boolean;
  RaAllowed?: boolean;
  NwkGeoLoc?: boolean;
  TargetPer?: number;
  MinGwDiversity?: number;
  TxPowerIndexMin?: number;
  TxPowerIndexMax?: number;
  NbTransMin?: number;
  NbTransMax?: number;
}
export const LoRaWANGetServiceProfileInfo = S.suspend(() =>
  S.Struct({
    UlRate: S.optional(S.Number),
    UlBucketSize: S.optional(S.Number),
    UlRatePolicy: S.optional(S.String),
    DlRate: S.optional(S.Number),
    DlBucketSize: S.optional(S.Number),
    DlRatePolicy: S.optional(S.String),
    AddGwMetadata: S.optional(S.Boolean),
    DevStatusReqFreq: S.optional(S.Number),
    ReportDevStatusBattery: S.optional(S.Boolean),
    ReportDevStatusMargin: S.optional(S.Boolean),
    DrMin: S.optional(S.Number),
    DrMax: S.optional(S.Number),
    ChannelMask: S.optional(S.String),
    PrAllowed: S.optional(S.Boolean),
    HrAllowed: S.optional(S.Boolean),
    RaAllowed: S.optional(S.Boolean),
    NwkGeoLoc: S.optional(S.Boolean),
    TargetPer: S.optional(S.Number),
    MinGwDiversity: S.optional(S.Number),
    TxPowerIndexMin: S.optional(S.Number),
    TxPowerIndexMax: S.optional(S.Number),
    NbTransMin: S.optional(S.Number),
    NbTransMax: S.optional(S.Number),
  }),
).annotations({
  identifier: "LoRaWANGetServiceProfileInfo",
}) as any as S.Schema<LoRaWANGetServiceProfileInfo>;
export interface SidewalkGetStartImportInfo {
  DeviceCreationFileList?: string[];
  Role?: string;
  Positioning?: SidewalkPositioning;
}
export const SidewalkGetStartImportInfo = S.suspend(() =>
  S.Struct({
    DeviceCreationFileList: S.optional(DeviceCreationFileList),
    Role: S.optional(S.String),
    Positioning: S.optional(SidewalkPositioning),
  }),
).annotations({
  identifier: "SidewalkGetStartImportInfo",
}) as any as S.Schema<SidewalkGetStartImportInfo>;
export interface SidewalkDeviceMetadata {
  Rssi?: number;
  BatteryLevel?: BatteryLevel;
  Event?: Event;
  DeviceState?: DeviceState;
}
export const SidewalkDeviceMetadata = S.suspend(() =>
  S.Struct({
    Rssi: S.optional(S.Number),
    BatteryLevel: S.optional(BatteryLevel),
    Event: S.optional(Event),
    DeviceState: S.optional(DeviceState),
  }),
).annotations({
  identifier: "SidewalkDeviceMetadata",
}) as any as S.Schema<SidewalkDeviceMetadata>;
export interface LoRaWANGatewayCurrentVersion {
  CurrentVersion?: LoRaWANGatewayVersion;
}
export const LoRaWANGatewayCurrentVersion = S.suspend(() =>
  S.Struct({ CurrentVersion: S.optional(LoRaWANGatewayVersion) }),
).annotations({
  identifier: "LoRaWANGatewayCurrentVersion",
}) as any as S.Schema<LoRaWANGatewayCurrentVersion>;
export interface Destinations {
  Arn?: string;
  Name?: string;
  ExpressionType?: ExpressionType;
  Expression?: string;
  Description?: string;
  RoleArn?: string;
}
export const Destinations = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    ExpressionType: S.optional(ExpressionType),
    Expression: S.optional(S.String),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }),
).annotations({ identifier: "Destinations" }) as any as S.Schema<Destinations>;
export type DestinationList = Destinations[];
export const DestinationList = S.Array(Destinations);
export interface DeviceProfile {
  Arn?: string;
  Name?: string;
  Id?: string;
}
export const DeviceProfile = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Id: S.optional(S.String),
  }),
).annotations({
  identifier: "DeviceProfile",
}) as any as S.Schema<DeviceProfile>;
export type DeviceProfileList = DeviceProfile[];
export const DeviceProfileList = S.Array(DeviceProfile);
export interface SidewalkListDevicesForImportInfo {
  Positioning?: SidewalkPositioning;
}
export const SidewalkListDevicesForImportInfo = S.suspend(() =>
  S.Struct({ Positioning: S.optional(SidewalkPositioning) }),
).annotations({
  identifier: "SidewalkListDevicesForImportInfo",
}) as any as S.Schema<SidewalkListDevicesForImportInfo>;
export interface FuotaTask {
  Id?: string;
  Arn?: string;
  Name?: string;
}
export const FuotaTask = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
  }),
).annotations({ identifier: "FuotaTask" }) as any as S.Schema<FuotaTask>;
export type FuotaTaskList = FuotaTask[];
export const FuotaTaskList = S.Array(FuotaTask);
export interface MulticastGroup {
  Id?: string;
  Arn?: string;
  Name?: string;
}
export const MulticastGroup = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "MulticastGroup",
}) as any as S.Schema<MulticastGroup>;
export type MulticastGroupList = MulticastGroup[];
export const MulticastGroupList = S.Array(MulticastGroup);
export interface MulticastGroupByFuotaTask {
  Id?: string;
}
export const MulticastGroupByFuotaTask = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "MulticastGroupByFuotaTask",
}) as any as S.Schema<MulticastGroupByFuotaTask>;
export type MulticastGroupListByFuotaTask = MulticastGroupByFuotaTask[];
export const MulticastGroupListByFuotaTask = S.Array(MulticastGroupByFuotaTask);
export interface NetworkAnalyzerConfigurations {
  Arn?: string;
  Name?: string;
}
export const NetworkAnalyzerConfigurations = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "NetworkAnalyzerConfigurations",
}) as any as S.Schema<NetworkAnalyzerConfigurations>;
export type NetworkAnalyzerConfigurationList = NetworkAnalyzerConfigurations[];
export const NetworkAnalyzerConfigurationList = S.Array(
  NetworkAnalyzerConfigurations,
);
export interface SemtechGnssDetail {
  Provider?: PositionSolverProvider;
  Type?: PositionSolverType;
  Status?: PositionConfigurationStatus;
  Fec?: PositionConfigurationFec;
}
export const SemtechGnssDetail = S.suspend(() =>
  S.Struct({
    Provider: S.optional(PositionSolverProvider),
    Type: S.optional(PositionSolverType),
    Status: S.optional(PositionConfigurationStatus),
    Fec: S.optional(PositionConfigurationFec),
  }),
).annotations({
  identifier: "SemtechGnssDetail",
}) as any as S.Schema<SemtechGnssDetail>;
export interface PositionSolverDetails {
  SemtechGnss?: SemtechGnssDetail;
}
export const PositionSolverDetails = S.suspend(() =>
  S.Struct({ SemtechGnss: S.optional(SemtechGnssDetail) }),
).annotations({
  identifier: "PositionSolverDetails",
}) as any as S.Schema<PositionSolverDetails>;
export interface PositionConfigurationItem {
  ResourceIdentifier?: string;
  ResourceType?: PositionResourceType;
  Solvers?: PositionSolverDetails;
  Destination?: string;
}
export const PositionConfigurationItem = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.optional(S.String),
    ResourceType: S.optional(PositionResourceType),
    Solvers: S.optional(PositionSolverDetails),
    Destination: S.optional(S.String),
  }),
).annotations({
  identifier: "PositionConfigurationItem",
}) as any as S.Schema<PositionConfigurationItem>;
export type PositionConfigurationList = PositionConfigurationItem[];
export const PositionConfigurationList = S.Array(PositionConfigurationItem);
export interface GatewayListItem {
  GatewayId: string;
  DownlinkFrequency: number;
}
export const GatewayListItem = S.suspend(() =>
  S.Struct({ GatewayId: S.String, DownlinkFrequency: S.Number }),
).annotations({
  identifier: "GatewayListItem",
}) as any as S.Schema<GatewayListItem>;
export type GatewayList = GatewayListItem[];
export const GatewayList = S.Array(GatewayListItem);
export interface ParticipatingGateways {
  DownlinkMode: DownlinkMode;
  GatewayList: GatewayListItem[];
  TransmissionInterval: number;
}
export const ParticipatingGateways = S.suspend(() =>
  S.Struct({
    DownlinkMode: DownlinkMode,
    GatewayList: GatewayList,
    TransmissionInterval: S.Number,
  }),
).annotations({
  identifier: "ParticipatingGateways",
}) as any as S.Schema<ParticipatingGateways>;
export interface LoRaWANSendDataToDevice {
  FPort?: number;
  ParticipatingGateways?: ParticipatingGateways;
}
export const LoRaWANSendDataToDevice = S.suspend(() =>
  S.Struct({
    FPort: S.optional(S.Number),
    ParticipatingGateways: S.optional(ParticipatingGateways),
  }),
).annotations({
  identifier: "LoRaWANSendDataToDevice",
}) as any as S.Schema<LoRaWANSendDataToDevice>;
export interface DownlinkQueueMessage {
  MessageId?: string;
  TransmitMode?: number;
  ReceivedAt?: string;
  LoRaWAN?: LoRaWANSendDataToDevice;
}
export const DownlinkQueueMessage = S.suspend(() =>
  S.Struct({
    MessageId: S.optional(S.String),
    TransmitMode: S.optional(S.Number),
    ReceivedAt: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANSendDataToDevice),
  }),
).annotations({
  identifier: "DownlinkQueueMessage",
}) as any as S.Schema<DownlinkQueueMessage>;
export type DownlinkQueueMessagesList = DownlinkQueueMessage[];
export const DownlinkQueueMessagesList = S.Array(DownlinkQueueMessage);
export interface ServiceProfile {
  Arn?: string;
  Name?: string;
  Id?: string;
}
export const ServiceProfile = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Id: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceProfile",
}) as any as S.Schema<ServiceProfile>;
export type ServiceProfileList = ServiceProfile[];
export const ServiceProfileList = S.Array(ServiceProfile);
export interface WirelessDeviceImportTask {
  Id?: string;
  Arn?: string;
  DestinationName?: string;
  Positioning?: PositioningConfigStatus;
  Sidewalk?: SidewalkGetStartImportInfo;
  CreationTime?: Date;
  Status?: ImportTaskStatus;
  StatusReason?: string;
  InitializedImportedDeviceCount?: number;
  PendingImportedDeviceCount?: number;
  OnboardedImportedDeviceCount?: number;
  FailedImportedDeviceCount?: number;
}
export const WirelessDeviceImportTask = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    DestinationName: S.optional(S.String),
    Positioning: S.optional(PositioningConfigStatus),
    Sidewalk: S.optional(SidewalkGetStartImportInfo),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(ImportTaskStatus),
    StatusReason: S.optional(S.String),
    InitializedImportedDeviceCount: S.optional(S.Number),
    PendingImportedDeviceCount: S.optional(S.Number),
    OnboardedImportedDeviceCount: S.optional(S.Number),
    FailedImportedDeviceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "WirelessDeviceImportTask",
}) as any as S.Schema<WirelessDeviceImportTask>;
export type WirelessDeviceImportTaskList = WirelessDeviceImportTask[];
export const WirelessDeviceImportTaskList = S.Array(WirelessDeviceImportTask);
export interface WirelessGatewayStatistics {
  Arn?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  LoRaWAN?: LoRaWANGateway;
  LastUplinkReceivedAt?: string;
}
export const WirelessGatewayStatistics = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANGateway),
    LastUplinkReceivedAt: S.optional(S.String),
  }),
).annotations({
  identifier: "WirelessGatewayStatistics",
}) as any as S.Schema<WirelessGatewayStatistics>;
export type WirelessGatewayStatisticsList = WirelessGatewayStatistics[];
export const WirelessGatewayStatisticsList = S.Array(WirelessGatewayStatistics);
export interface PositionSolverConfigurations {
  SemtechGnss?: SemtechGnssConfiguration;
}
export const PositionSolverConfigurations = S.suspend(() =>
  S.Struct({ SemtechGnss: S.optional(SemtechGnssConfiguration) }),
).annotations({
  identifier: "PositionSolverConfigurations",
}) as any as S.Schema<PositionSolverConfigurations>;
export interface MulticastWirelessMetadata {
  LoRaWAN?: LoRaWANMulticastMetadata;
}
export const MulticastWirelessMetadata = S.suspend(() =>
  S.Struct({ LoRaWAN: S.optional(LoRaWANMulticastMetadata) }),
).annotations({
  identifier: "MulticastWirelessMetadata",
}) as any as S.Schema<MulticastWirelessMetadata>;
export interface LoRaWANUpdateDevice {
  DeviceProfileId?: string;
  ServiceProfileId?: string;
  AbpV1_1?: UpdateAbpV1_1;
  AbpV1_0_x?: UpdateAbpV1_0_x;
  FPorts?: UpdateFPorts;
}
export const LoRaWANUpdateDevice = S.suspend(() =>
  S.Struct({
    DeviceProfileId: S.optional(S.String),
    ServiceProfileId: S.optional(S.String),
    AbpV1_1: S.optional(UpdateAbpV1_1),
    AbpV1_0_x: S.optional(UpdateAbpV1_0_x),
    FPorts: S.optional(UpdateFPorts),
  }),
).annotations({
  identifier: "LoRaWANUpdateDevice",
}) as any as S.Schema<LoRaWANUpdateDevice>;
export interface SessionKeysAbpV1_1 {
  FNwkSIntKey?: string;
  SNwkSIntKey?: string;
  NwkSEncKey?: string;
  AppSKey?: string;
}
export const SessionKeysAbpV1_1 = S.suspend(() =>
  S.Struct({
    FNwkSIntKey: S.optional(S.String),
    SNwkSIntKey: S.optional(S.String),
    NwkSEncKey: S.optional(S.String),
    AppSKey: S.optional(S.String),
  }),
).annotations({
  identifier: "SessionKeysAbpV1_1",
}) as any as S.Schema<SessionKeysAbpV1_1>;
export interface SessionKeysAbpV1_0_x {
  NwkSKey?: string;
  AppSKey?: string;
}
export const SessionKeysAbpV1_0_x = S.suspend(() =>
  S.Struct({ NwkSKey: S.optional(S.String), AppSKey: S.optional(S.String) }),
).annotations({
  identifier: "SessionKeysAbpV1_0_x",
}) as any as S.Schema<SessionKeysAbpV1_0_x>;
export interface GsmLocalId {
  Bsic: number;
  Bcch: number;
}
export const GsmLocalId = S.suspend(() =>
  S.Struct({ Bsic: S.Number, Bcch: S.Number }),
).annotations({ identifier: "GsmLocalId" }) as any as S.Schema<GsmLocalId>;
export interface WcdmaLocalId {
  Uarfcndl: number;
  Psc: number;
}
export const WcdmaLocalId = S.suspend(() =>
  S.Struct({ Uarfcndl: S.Number, Psc: S.Number }),
).annotations({ identifier: "WcdmaLocalId" }) as any as S.Schema<WcdmaLocalId>;
export interface WcdmaNmrObj {
  Uarfcndl: number;
  Psc: number;
  UtranCid: number;
  Rscp?: number;
  PathLoss?: number;
}
export const WcdmaNmrObj = S.suspend(() =>
  S.Struct({
    Uarfcndl: S.Number,
    Psc: S.Number,
    UtranCid: S.Number,
    Rscp: S.optional(S.Number),
    PathLoss: S.optional(S.Number),
  }),
).annotations({ identifier: "WcdmaNmrObj" }) as any as S.Schema<WcdmaNmrObj>;
export type WcdmaNmrList = WcdmaNmrObj[];
export const WcdmaNmrList = S.Array(WcdmaNmrObj);
export interface TdscdmaLocalId {
  Uarfcn: number;
  CellParams: number;
}
export const TdscdmaLocalId = S.suspend(() =>
  S.Struct({ Uarfcn: S.Number, CellParams: S.Number }),
).annotations({
  identifier: "TdscdmaLocalId",
}) as any as S.Schema<TdscdmaLocalId>;
export interface TdscdmaNmrObj {
  Uarfcn: number;
  CellParams: number;
  UtranCid?: number;
  Rscp?: number;
  PathLoss?: number;
}
export const TdscdmaNmrObj = S.suspend(() =>
  S.Struct({
    Uarfcn: S.Number,
    CellParams: S.Number,
    UtranCid: S.optional(S.Number),
    Rscp: S.optional(S.Number),
    PathLoss: S.optional(S.Number),
  }),
).annotations({
  identifier: "TdscdmaNmrObj",
}) as any as S.Schema<TdscdmaNmrObj>;
export type TdscdmaNmrList = TdscdmaNmrObj[];
export const TdscdmaNmrList = S.Array(TdscdmaNmrObj);
export interface LteLocalId {
  Pci: number;
  Earfcn: number;
}
export const LteLocalId = S.suspend(() =>
  S.Struct({ Pci: S.Number, Earfcn: S.Number }),
).annotations({ identifier: "LteLocalId" }) as any as S.Schema<LteLocalId>;
export interface LteNmrObj {
  Pci: number;
  Earfcn: number;
  EutranCid?: number;
  Rsrp?: number;
  Rsrq?: number;
}
export const LteNmrObj = S.suspend(() =>
  S.Struct({
    Pci: S.Number,
    Earfcn: S.Number,
    EutranCid: S.optional(S.Number),
    Rsrp: S.optional(S.Number),
    Rsrq: S.optional(S.Number),
  }),
).annotations({ identifier: "LteNmrObj" }) as any as S.Schema<LteNmrObj>;
export type LteNmrList = LteNmrObj[];
export const LteNmrList = S.Array(LteNmrObj);
export interface CdmaLocalId {
  PnOffset: number;
  CdmaChannel: number;
}
export const CdmaLocalId = S.suspend(() =>
  S.Struct({ PnOffset: S.Number, CdmaChannel: S.Number }),
).annotations({ identifier: "CdmaLocalId" }) as any as S.Schema<CdmaLocalId>;
export interface CdmaNmrObj {
  PnOffset: number;
  CdmaChannel: number;
  PilotPower?: number;
  BaseStationId?: number;
}
export const CdmaNmrObj = S.suspend(() =>
  S.Struct({
    PnOffset: S.Number,
    CdmaChannel: S.Number,
    PilotPower: S.optional(S.Number),
    BaseStationId: S.optional(S.Number),
  }),
).annotations({ identifier: "CdmaNmrObj" }) as any as S.Schema<CdmaNmrObj>;
export type CdmaNmrList = CdmaNmrObj[];
export const CdmaNmrList = S.Array(CdmaNmrObj);
export interface AssociateAwsAccountWithPartnerAccountResponse {
  Sidewalk?: SidewalkAccountInfo;
  Arn?: string;
}
export const AssociateAwsAccountWithPartnerAccountResponse = S.suspend(() =>
  S.Struct({
    Sidewalk: S.optional(SidewalkAccountInfo),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateAwsAccountWithPartnerAccountResponse",
}) as any as S.Schema<AssociateAwsAccountWithPartnerAccountResponse>;
export interface CreateDeviceProfileResponse {
  Arn?: string;
  Id?: string;
}
export const CreateDeviceProfileResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateDeviceProfileResponse",
}) as any as S.Schema<CreateDeviceProfileResponse>;
export interface CreateFuotaTaskResponse {
  Arn?: string;
  Id?: string;
}
export const CreateFuotaTaskResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateFuotaTaskResponse",
}) as any as S.Schema<CreateFuotaTaskResponse>;
export interface CreateMulticastGroupRequest {
  Name?: string;
  Description?: string;
  ClientRequestToken?: string;
  LoRaWAN: LoRaWANMulticast;
  Tags?: Tag[];
}
export const CreateMulticastGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    LoRaWAN: LoRaWANMulticast,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/multicast-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMulticastGroupRequest",
}) as any as S.Schema<CreateMulticastGroupRequest>;
export interface CreateNetworkAnalyzerConfigurationResponse {
  Arn?: string;
  Name?: string;
}
export const CreateNetworkAnalyzerConfigurationResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateNetworkAnalyzerConfigurationResponse",
}) as any as S.Schema<CreateNetworkAnalyzerConfigurationResponse>;
export interface CreateServiceProfileResponse {
  Arn?: string;
  Id?: string;
}
export const CreateServiceProfileResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateServiceProfileResponse",
}) as any as S.Schema<CreateServiceProfileResponse>;
export interface CreateWirelessGatewayRequest {
  Name?: string;
  Description?: string;
  LoRaWAN: LoRaWANGateway;
  Tags?: Tag[];
  ClientRequestToken?: string;
}
export const CreateWirelessGatewayRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: LoRaWANGateway,
    Tags: S.optional(TagList),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/wireless-gateways" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWirelessGatewayRequest",
}) as any as S.Schema<CreateWirelessGatewayRequest>;
export interface GetEventConfigurationByResourceTypesResponse {
  DeviceRegistrationState?: DeviceRegistrationStateResourceTypeEventConfiguration;
  Proximity?: ProximityResourceTypeEventConfiguration;
  Join?: JoinResourceTypeEventConfiguration;
  ConnectionStatus?: ConnectionStatusResourceTypeEventConfiguration;
  MessageDeliveryStatus?: MessageDeliveryStatusResourceTypeEventConfiguration;
}
export const GetEventConfigurationByResourceTypesResponse = S.suspend(() =>
  S.Struct({
    DeviceRegistrationState: S.optional(
      DeviceRegistrationStateResourceTypeEventConfiguration,
    ),
    Proximity: S.optional(ProximityResourceTypeEventConfiguration),
    Join: S.optional(JoinResourceTypeEventConfiguration),
    ConnectionStatus: S.optional(
      ConnectionStatusResourceTypeEventConfiguration,
    ),
    MessageDeliveryStatus: S.optional(
      MessageDeliveryStatusResourceTypeEventConfiguration,
    ),
  }),
).annotations({
  identifier: "GetEventConfigurationByResourceTypesResponse",
}) as any as S.Schema<GetEventConfigurationByResourceTypesResponse>;
export interface GetFuotaTaskResponse {
  Arn?: string;
  Id?: string;
  Status?: FuotaTaskStatus;
  Name?: string;
  Description?: string;
  LoRaWAN?: LoRaWANFuotaTaskGetInfo;
  FirmwareUpdateImage?: string;
  FirmwareUpdateRole?: string;
  CreatedAt?: Date;
  RedundancyPercent?: number;
  FragmentSizeBytes?: number;
  FragmentIntervalMS?: number;
  Descriptor?: string;
}
export const GetFuotaTaskResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Status: S.optional(FuotaTaskStatus),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANFuotaTaskGetInfo),
    FirmwareUpdateImage: S.optional(S.String),
    FirmwareUpdateRole: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RedundancyPercent: S.optional(S.Number),
    FragmentSizeBytes: S.optional(S.Number),
    FragmentIntervalMS: S.optional(S.Number),
    Descriptor: S.optional(S.String),
  }),
).annotations({
  identifier: "GetFuotaTaskResponse",
}) as any as S.Schema<GetFuotaTaskResponse>;
export interface GetLogLevelsByResourceTypesResponse {
  DefaultLogLevel?: LogLevel;
  WirelessGatewayLogOptions?: WirelessGatewayLogOption[];
  WirelessDeviceLogOptions?: WirelessDeviceLogOption[];
  FuotaTaskLogOptions?: FuotaTaskLogOption[];
}
export const GetLogLevelsByResourceTypesResponse = S.suspend(() =>
  S.Struct({
    DefaultLogLevel: S.optional(LogLevel),
    WirelessGatewayLogOptions: S.optional(WirelessGatewayLogOptionList),
    WirelessDeviceLogOptions: S.optional(WirelessDeviceLogOptionList),
    FuotaTaskLogOptions: S.optional(FuotaTaskLogOptionList),
  }),
).annotations({
  identifier: "GetLogLevelsByResourceTypesResponse",
}) as any as S.Schema<GetLogLevelsByResourceTypesResponse>;
export interface GetMetricsRequest {
  SummaryMetricQueries?: SummaryMetricQuery[];
}
export const GetMetricsRequest = S.suspend(() =>
  S.Struct({ SummaryMetricQueries: S.optional(SummaryMetricQueries) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMetricsRequest",
}) as any as S.Schema<GetMetricsRequest>;
export interface GetMulticastGroupResponse {
  Arn?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  Status?: string;
  LoRaWAN?: LoRaWANMulticastGet;
  CreatedAt?: Date;
}
export const GetMulticastGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANMulticastGet),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetMulticastGroupResponse",
}) as any as S.Schema<GetMulticastGroupResponse>;
export interface GetPartnerAccountResponse {
  Sidewalk?: SidewalkAccountInfoWithFingerprint;
  AccountLinked?: boolean;
}
export const GetPartnerAccountResponse = S.suspend(() =>
  S.Struct({
    Sidewalk: S.optional(SidewalkAccountInfoWithFingerprint),
    AccountLinked: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetPartnerAccountResponse",
}) as any as S.Schema<GetPartnerAccountResponse>;
export interface GetPositionResponse {
  Position?: number[];
  Accuracy?: Accuracy;
  SolverType?: PositionSolverType;
  SolverProvider?: PositionSolverProvider;
  SolverVersion?: string;
  Timestamp?: string;
}
export const GetPositionResponse = S.suspend(() =>
  S.Struct({
    Position: S.optional(PositionCoordinate),
    Accuracy: S.optional(Accuracy),
    SolverType: S.optional(PositionSolverType),
    SolverProvider: S.optional(PositionSolverProvider),
    SolverVersion: S.optional(S.String),
    Timestamp: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPositionResponse",
}) as any as S.Schema<GetPositionResponse>;
export interface GetServiceProfileResponse {
  Arn?: string;
  Name?: string;
  Id?: string;
  LoRaWAN?: LoRaWANGetServiceProfileInfo;
}
export const GetServiceProfileResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANGetServiceProfileInfo),
  }),
).annotations({
  identifier: "GetServiceProfileResponse",
}) as any as S.Schema<GetServiceProfileResponse>;
export interface GetWirelessDeviceImportTaskResponse {
  Id?: string;
  Arn?: string;
  DestinationName?: string;
  Positioning?: PositioningConfigStatus;
  Sidewalk?: SidewalkGetStartImportInfo;
  CreationTime?: Date;
  Status?: ImportTaskStatus;
  StatusReason?: string;
  InitializedImportedDeviceCount?: number;
  PendingImportedDeviceCount?: number;
  OnboardedImportedDeviceCount?: number;
  FailedImportedDeviceCount?: number;
}
export const GetWirelessDeviceImportTaskResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    DestinationName: S.optional(S.String),
    Positioning: S.optional(PositioningConfigStatus),
    Sidewalk: S.optional(SidewalkGetStartImportInfo),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(ImportTaskStatus),
    StatusReason: S.optional(S.String),
    InitializedImportedDeviceCount: S.optional(S.Number),
    PendingImportedDeviceCount: S.optional(S.Number),
    OnboardedImportedDeviceCount: S.optional(S.Number),
    FailedImportedDeviceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetWirelessDeviceImportTaskResponse",
}) as any as S.Schema<GetWirelessDeviceImportTaskResponse>;
export interface GetWirelessGatewayFirmwareInformationResponse {
  LoRaWAN?: LoRaWANGatewayCurrentVersion;
}
export const GetWirelessGatewayFirmwareInformationResponse = S.suspend(() =>
  S.Struct({ LoRaWAN: S.optional(LoRaWANGatewayCurrentVersion) }),
).annotations({
  identifier: "GetWirelessGatewayFirmwareInformationResponse",
}) as any as S.Schema<GetWirelessGatewayFirmwareInformationResponse>;
export interface ListDestinationsResponse {
  NextToken?: string;
  DestinationList?: Destinations[];
}
export const ListDestinationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DestinationList: S.optional(DestinationList),
  }),
).annotations({
  identifier: "ListDestinationsResponse",
}) as any as S.Schema<ListDestinationsResponse>;
export interface ListDeviceProfilesResponse {
  NextToken?: string;
  DeviceProfileList?: DeviceProfile[];
}
export const ListDeviceProfilesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DeviceProfileList: S.optional(DeviceProfileList),
  }),
).annotations({
  identifier: "ListDeviceProfilesResponse",
}) as any as S.Schema<ListDeviceProfilesResponse>;
export interface ListFuotaTasksResponse {
  NextToken?: string;
  FuotaTaskList?: FuotaTask[];
}
export const ListFuotaTasksResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    FuotaTaskList: S.optional(FuotaTaskList),
  }),
).annotations({
  identifier: "ListFuotaTasksResponse",
}) as any as S.Schema<ListFuotaTasksResponse>;
export interface ListMulticastGroupsResponse {
  NextToken?: string;
  MulticastGroupList?: MulticastGroup[];
}
export const ListMulticastGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MulticastGroupList: S.optional(MulticastGroupList),
  }),
).annotations({
  identifier: "ListMulticastGroupsResponse",
}) as any as S.Schema<ListMulticastGroupsResponse>;
export interface ListMulticastGroupsByFuotaTaskResponse {
  NextToken?: string;
  MulticastGroupList?: MulticastGroupByFuotaTask[];
}
export const ListMulticastGroupsByFuotaTaskResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MulticastGroupList: S.optional(MulticastGroupListByFuotaTask),
  }),
).annotations({
  identifier: "ListMulticastGroupsByFuotaTaskResponse",
}) as any as S.Schema<ListMulticastGroupsByFuotaTaskResponse>;
export interface ListNetworkAnalyzerConfigurationsResponse {
  NextToken?: string;
  NetworkAnalyzerConfigurationList?: NetworkAnalyzerConfigurations[];
}
export const ListNetworkAnalyzerConfigurationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    NetworkAnalyzerConfigurationList: S.optional(
      NetworkAnalyzerConfigurationList,
    ),
  }),
).annotations({
  identifier: "ListNetworkAnalyzerConfigurationsResponse",
}) as any as S.Schema<ListNetworkAnalyzerConfigurationsResponse>;
export interface ListPositionConfigurationsResponse {
  PositionConfigurationList?: PositionConfigurationItem[];
  NextToken?: string;
}
export const ListPositionConfigurationsResponse = S.suspend(() =>
  S.Struct({
    PositionConfigurationList: S.optional(PositionConfigurationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPositionConfigurationsResponse",
}) as any as S.Schema<ListPositionConfigurationsResponse>;
export interface ListQueuedMessagesResponse {
  NextToken?: string;
  DownlinkQueueMessagesList?: DownlinkQueueMessage[];
}
export const ListQueuedMessagesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DownlinkQueueMessagesList: S.optional(DownlinkQueueMessagesList),
  }),
).annotations({
  identifier: "ListQueuedMessagesResponse",
}) as any as S.Schema<ListQueuedMessagesResponse>;
export interface ListServiceProfilesResponse {
  NextToken?: string;
  ServiceProfileList?: ServiceProfile[];
}
export const ListServiceProfilesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ServiceProfileList: S.optional(ServiceProfileList),
  }),
).annotations({
  identifier: "ListServiceProfilesResponse",
}) as any as S.Schema<ListServiceProfilesResponse>;
export interface ListWirelessDeviceImportTasksResponse {
  NextToken?: string;
  WirelessDeviceImportTaskList?: WirelessDeviceImportTask[];
}
export const ListWirelessDeviceImportTasksResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    WirelessDeviceImportTaskList: S.optional(WirelessDeviceImportTaskList),
  }),
).annotations({
  identifier: "ListWirelessDeviceImportTasksResponse",
}) as any as S.Schema<ListWirelessDeviceImportTasksResponse>;
export interface ListWirelessGatewaysResponse {
  NextToken?: string;
  WirelessGatewayList?: WirelessGatewayStatistics[];
}
export const ListWirelessGatewaysResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    WirelessGatewayList: S.optional(WirelessGatewayStatisticsList),
  }),
).annotations({
  identifier: "ListWirelessGatewaysResponse",
}) as any as S.Schema<ListWirelessGatewaysResponse>;
export interface PutPositionConfigurationRequest {
  ResourceIdentifier: string;
  ResourceType: PositionResourceType;
  Solvers?: PositionSolverConfigurations;
  Destination?: string;
}
export const PutPositionConfigurationRequest = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String.pipe(T.HttpLabel("ResourceIdentifier")),
    ResourceType: PositionResourceType.pipe(T.HttpQuery("resourceType")),
    Solvers: S.optional(PositionSolverConfigurations),
    Destination: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/position-configurations/{ResourceIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutPositionConfigurationRequest",
}) as any as S.Schema<PutPositionConfigurationRequest>;
export interface PutPositionConfigurationResponse {}
export const PutPositionConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutPositionConfigurationResponse",
}) as any as S.Schema<PutPositionConfigurationResponse>;
export interface SendDataToMulticastGroupRequest {
  Id: string;
  PayloadData: string;
  WirelessMetadata: MulticastWirelessMetadata;
}
export const SendDataToMulticastGroupRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    PayloadData: S.String,
    WirelessMetadata: MulticastWirelessMetadata,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/multicast-groups/{Id}/data" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendDataToMulticastGroupRequest",
}) as any as S.Schema<SendDataToMulticastGroupRequest>;
export interface StartSingleWirelessDeviceImportTaskResponse {
  Id?: string;
  Arn?: string;
}
export const StartSingleWirelessDeviceImportTaskResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "StartSingleWirelessDeviceImportTaskResponse",
}) as any as S.Schema<StartSingleWirelessDeviceImportTaskResponse>;
export interface StartWirelessDeviceImportTaskResponse {
  Id?: string;
  Arn?: string;
}
export const StartWirelessDeviceImportTaskResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "StartWirelessDeviceImportTaskResponse",
}) as any as S.Schema<StartWirelessDeviceImportTaskResponse>;
export interface UpdateResourceEventConfigurationRequest {
  Identifier: string;
  IdentifierType: IdentifierType;
  PartnerType?: EventNotificationPartnerType;
  DeviceRegistrationState?: DeviceRegistrationStateEventConfiguration;
  Proximity?: ProximityEventConfiguration;
  Join?: JoinEventConfiguration;
  ConnectionStatus?: ConnectionStatusEventConfiguration;
  MessageDeliveryStatus?: MessageDeliveryStatusEventConfiguration;
}
export const UpdateResourceEventConfigurationRequest = S.suspend(() =>
  S.Struct({
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    IdentifierType: IdentifierType.pipe(T.HttpQuery("identifierType")),
    PartnerType: S.optional(EventNotificationPartnerType).pipe(
      T.HttpQuery("partnerType"),
    ),
    DeviceRegistrationState: S.optional(
      DeviceRegistrationStateEventConfiguration,
    ),
    Proximity: S.optional(ProximityEventConfiguration),
    Join: S.optional(JoinEventConfiguration),
    ConnectionStatus: S.optional(ConnectionStatusEventConfiguration),
    MessageDeliveryStatus: S.optional(MessageDeliveryStatusEventConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/event-configurations/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourceEventConfigurationRequest",
}) as any as S.Schema<UpdateResourceEventConfigurationRequest>;
export interface UpdateResourceEventConfigurationResponse {}
export const UpdateResourceEventConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateResourceEventConfigurationResponse",
}) as any as S.Schema<UpdateResourceEventConfigurationResponse>;
export interface UpdateWirelessDeviceRequest {
  Id: string;
  DestinationName?: string;
  Name?: string;
  Description?: string;
  LoRaWAN?: LoRaWANUpdateDevice;
  Positioning?: PositioningConfigStatus;
  Sidewalk?: SidewalkUpdateWirelessDevice;
}
export const UpdateWirelessDeviceRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    DestinationName: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANUpdateDevice),
    Positioning: S.optional(PositioningConfigStatus),
    Sidewalk: S.optional(SidewalkUpdateWirelessDevice),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/wireless-devices/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWirelessDeviceRequest",
}) as any as S.Schema<UpdateWirelessDeviceRequest>;
export interface UpdateWirelessDeviceResponse {}
export const UpdateWirelessDeviceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateWirelessDeviceResponse",
}) as any as S.Schema<UpdateWirelessDeviceResponse>;
export interface AbpV1_1 {
  DevAddr?: string;
  SessionKeys?: SessionKeysAbpV1_1;
  FCntStart?: number;
}
export const AbpV1_1 = S.suspend(() =>
  S.Struct({
    DevAddr: S.optional(S.String),
    SessionKeys: S.optional(SessionKeysAbpV1_1),
    FCntStart: S.optional(S.Number),
  }),
).annotations({ identifier: "AbpV1_1" }) as any as S.Schema<AbpV1_1>;
export interface AbpV1_0_x {
  DevAddr?: string;
  SessionKeys?: SessionKeysAbpV1_0_x;
  FCntStart?: number;
}
export const AbpV1_0_x = S.suspend(() =>
  S.Struct({
    DevAddr: S.optional(S.String),
    SessionKeys: S.optional(SessionKeysAbpV1_0_x),
    FCntStart: S.optional(S.Number),
  }),
).annotations({ identifier: "AbpV1_0_x" }) as any as S.Schema<AbpV1_0_x>;
export interface FPorts {
  Fuota?: number;
  Multicast?: number;
  ClockSync?: number;
  Positioning?: Positioning;
  Applications?: ApplicationConfig[];
}
export const FPorts = S.suspend(() =>
  S.Struct({
    Fuota: S.optional(S.Number),
    Multicast: S.optional(S.Number),
    ClockSync: S.optional(S.Number),
    Positioning: S.optional(Positioning),
    Applications: S.optional(Applications),
  }),
).annotations({ identifier: "FPorts" }) as any as S.Schema<FPorts>;
export interface DakCertificateMetadata {
  CertificateId: string;
  MaxAllowedSignature?: number;
  FactorySupport?: boolean;
  ApId?: string;
  DeviceTypeId?: string;
}
export const DakCertificateMetadata = S.suspend(() =>
  S.Struct({
    CertificateId: S.String,
    MaxAllowedSignature: S.optional(S.Number),
    FactorySupport: S.optional(S.Boolean),
    ApId: S.optional(S.String),
    DeviceTypeId: S.optional(S.String),
  }),
).annotations({
  identifier: "DakCertificateMetadata",
}) as any as S.Schema<DakCertificateMetadata>;
export type DakCertificateMetadataList = DakCertificateMetadata[];
export const DakCertificateMetadataList = S.Array(DakCertificateMetadata);
export interface WcdmaObj {
  Mcc: number;
  Mnc: number;
  Lac?: number;
  UtranCid: number;
  WcdmaLocalId?: WcdmaLocalId;
  Rscp?: number;
  PathLoss?: number;
  WcdmaNmr?: WcdmaNmrObj[];
}
export const WcdmaObj = S.suspend(() =>
  S.Struct({
    Mcc: S.Number,
    Mnc: S.Number,
    Lac: S.optional(S.Number),
    UtranCid: S.Number,
    WcdmaLocalId: S.optional(WcdmaLocalId),
    Rscp: S.optional(S.Number),
    PathLoss: S.optional(S.Number),
    WcdmaNmr: S.optional(WcdmaNmrList),
  }),
).annotations({ identifier: "WcdmaObj" }) as any as S.Schema<WcdmaObj>;
export type WcdmaList = WcdmaObj[];
export const WcdmaList = S.Array(WcdmaObj);
export interface TdscdmaObj {
  Mcc: number;
  Mnc: number;
  Lac?: number;
  UtranCid: number;
  TdscdmaLocalId?: TdscdmaLocalId;
  TdscdmaTimingAdvance?: number;
  Rscp?: number;
  PathLoss?: number;
  TdscdmaNmr?: TdscdmaNmrObj[];
}
export const TdscdmaObj = S.suspend(() =>
  S.Struct({
    Mcc: S.Number,
    Mnc: S.Number,
    Lac: S.optional(S.Number),
    UtranCid: S.Number,
    TdscdmaLocalId: S.optional(TdscdmaLocalId),
    TdscdmaTimingAdvance: S.optional(S.Number),
    Rscp: S.optional(S.Number),
    PathLoss: S.optional(S.Number),
    TdscdmaNmr: S.optional(TdscdmaNmrList),
  }),
).annotations({ identifier: "TdscdmaObj" }) as any as S.Schema<TdscdmaObj>;
export type TdscdmaList = TdscdmaObj[];
export const TdscdmaList = S.Array(TdscdmaObj);
export interface LteObj {
  Mcc: number;
  Mnc: number;
  EutranCid: number;
  Tac?: number;
  LteLocalId?: LteLocalId;
  LteTimingAdvance?: number;
  Rsrp?: number;
  Rsrq?: number;
  NrCapable?: boolean;
  LteNmr?: LteNmrObj[];
}
export const LteObj = S.suspend(() =>
  S.Struct({
    Mcc: S.Number,
    Mnc: S.Number,
    EutranCid: S.Number,
    Tac: S.optional(S.Number),
    LteLocalId: S.optional(LteLocalId),
    LteTimingAdvance: S.optional(S.Number),
    Rsrp: S.optional(S.Number),
    Rsrq: S.optional(S.Number),
    NrCapable: S.optional(S.Boolean),
    LteNmr: S.optional(LteNmrList),
  }),
).annotations({ identifier: "LteObj" }) as any as S.Schema<LteObj>;
export type LteList = LteObj[];
export const LteList = S.Array(LteObj);
export interface CdmaObj {
  SystemId: number;
  NetworkId: number;
  BaseStationId: number;
  RegistrationZone?: number;
  CdmaLocalId?: CdmaLocalId;
  PilotPower?: number;
  BaseLat?: number;
  BaseLng?: number;
  CdmaNmr?: CdmaNmrObj[];
}
export const CdmaObj = S.suspend(() =>
  S.Struct({
    SystemId: S.Number,
    NetworkId: S.Number,
    BaseStationId: S.Number,
    RegistrationZone: S.optional(S.Number),
    CdmaLocalId: S.optional(CdmaLocalId),
    PilotPower: S.optional(S.Number),
    BaseLat: S.optional(S.Number),
    BaseLng: S.optional(S.Number),
    CdmaNmr: S.optional(CdmaNmrList),
  }),
).annotations({ identifier: "CdmaObj" }) as any as S.Schema<CdmaObj>;
export type CdmaList = CdmaObj[];
export const CdmaList = S.Array(CdmaObj);
export type DeviceCertificateList = CertificateList[];
export const DeviceCertificateList = S.Array(CertificateList);
export interface LoRaWANGatewayMetadata {
  GatewayEui?: string;
  Snr?: number;
  Rssi?: number;
}
export const LoRaWANGatewayMetadata = S.suspend(() =>
  S.Struct({
    GatewayEui: S.optional(S.String),
    Snr: S.optional(S.Number),
    Rssi: S.optional(S.Number),
  }),
).annotations({
  identifier: "LoRaWANGatewayMetadata",
}) as any as S.Schema<LoRaWANGatewayMetadata>;
export type LoRaWANGatewayMetadataList = LoRaWANGatewayMetadata[];
export const LoRaWANGatewayMetadataList = S.Array(LoRaWANGatewayMetadata);
export interface LoRaWANPublicGatewayMetadata {
  ProviderNetId?: string;
  Id?: string;
  Rssi?: number;
  Snr?: number;
  RfRegion?: string;
  DlAllowed?: boolean;
}
export const LoRaWANPublicGatewayMetadata = S.suspend(() =>
  S.Struct({
    ProviderNetId: S.optional(S.String),
    Id: S.optional(S.String),
    Rssi: S.optional(S.Number),
    Snr: S.optional(S.Number),
    RfRegion: S.optional(S.String),
    DlAllowed: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LoRaWANPublicGatewayMetadata",
}) as any as S.Schema<LoRaWANPublicGatewayMetadata>;
export type LoRaWANPublicGatewayMetadataList = LoRaWANPublicGatewayMetadata[];
export const LoRaWANPublicGatewayMetadataList = S.Array(
  LoRaWANPublicGatewayMetadata,
);
export interface ImportedSidewalkDevice {
  SidewalkManufacturingSn?: string;
  OnboardingStatus?: OnboardStatus;
  OnboardingStatusReason?: string;
  LastUpdateTime?: Date;
}
export const ImportedSidewalkDevice = S.suspend(() =>
  S.Struct({
    SidewalkManufacturingSn: S.optional(S.String),
    OnboardingStatus: S.optional(OnboardStatus),
    OnboardingStatusReason: S.optional(S.String),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ImportedSidewalkDevice",
}) as any as S.Schema<ImportedSidewalkDevice>;
export interface EventNotificationItemConfigurations {
  DeviceRegistrationState?: DeviceRegistrationStateEventConfiguration;
  Proximity?: ProximityEventConfiguration;
  Join?: JoinEventConfiguration;
  ConnectionStatus?: ConnectionStatusEventConfiguration;
  MessageDeliveryStatus?: MessageDeliveryStatusEventConfiguration;
}
export const EventNotificationItemConfigurations = S.suspend(() =>
  S.Struct({
    DeviceRegistrationState: S.optional(
      DeviceRegistrationStateEventConfiguration,
    ),
    Proximity: S.optional(ProximityEventConfiguration),
    Join: S.optional(JoinEventConfiguration),
    ConnectionStatus: S.optional(ConnectionStatusEventConfiguration),
    MessageDeliveryStatus: S.optional(MessageDeliveryStatusEventConfiguration),
  }),
).annotations({
  identifier: "EventNotificationItemConfigurations",
}) as any as S.Schema<EventNotificationItemConfigurations>;
export interface LoRaWANListDevice {
  DevEui?: string;
}
export const LoRaWANListDevice = S.suspend(() =>
  S.Struct({ DevEui: S.optional(S.String) }),
).annotations({
  identifier: "LoRaWANListDevice",
}) as any as S.Schema<LoRaWANListDevice>;
export interface SidewalkListDevice {
  AmazonId?: string;
  SidewalkId?: string;
  SidewalkManufacturingSn?: string;
  DeviceCertificates?: CertificateList[];
  DeviceProfileId?: string;
  Status?: WirelessDeviceSidewalkStatus;
  Positioning?: SidewalkPositioning;
}
export const SidewalkListDevice = S.suspend(() =>
  S.Struct({
    AmazonId: S.optional(S.String),
    SidewalkId: S.optional(S.String),
    SidewalkManufacturingSn: S.optional(S.String),
    DeviceCertificates: S.optional(DeviceCertificateList),
    DeviceProfileId: S.optional(S.String),
    Status: S.optional(WirelessDeviceSidewalkStatus),
    Positioning: S.optional(SidewalkPositioning),
  }),
).annotations({
  identifier: "SidewalkListDevice",
}) as any as S.Schema<SidewalkListDevice>;
export interface LoRaWANUpdateGatewayTaskEntry {
  CurrentVersion?: LoRaWANGatewayVersion;
  UpdateVersion?: LoRaWANGatewayVersion;
}
export const LoRaWANUpdateGatewayTaskEntry = S.suspend(() =>
  S.Struct({
    CurrentVersion: S.optional(LoRaWANGatewayVersion),
    UpdateVersion: S.optional(LoRaWANGatewayVersion),
  }),
).annotations({
  identifier: "LoRaWANUpdateGatewayTaskEntry",
}) as any as S.Schema<LoRaWANUpdateGatewayTaskEntry>;
export interface GlobalIdentity {
  Lac: number;
  GeranCid: number;
}
export const GlobalIdentity = S.suspend(() =>
  S.Struct({ Lac: S.Number, GeranCid: S.Number }),
).annotations({
  identifier: "GlobalIdentity",
}) as any as S.Schema<GlobalIdentity>;
export interface LoRaWANDevice {
  DevEui?: string;
  DeviceProfileId?: string;
  ServiceProfileId?: string;
  OtaaV1_1?: OtaaV1_1;
  OtaaV1_0_x?: OtaaV1_0_x;
  AbpV1_1?: AbpV1_1;
  AbpV1_0_x?: AbpV1_0_x;
  FPorts?: FPorts;
}
export const LoRaWANDevice = S.suspend(() =>
  S.Struct({
    DevEui: S.optional(S.String),
    DeviceProfileId: S.optional(S.String),
    ServiceProfileId: S.optional(S.String),
    OtaaV1_1: S.optional(OtaaV1_1),
    OtaaV1_0_x: S.optional(OtaaV1_0_x),
    AbpV1_1: S.optional(AbpV1_1),
    AbpV1_0_x: S.optional(AbpV1_0_x),
    FPorts: S.optional(FPorts),
  }),
).annotations({
  identifier: "LoRaWANDevice",
}) as any as S.Schema<LoRaWANDevice>;
export interface SidewalkGetDeviceProfile {
  ApplicationServerPublicKey?: string | redacted.Redacted<string>;
  QualificationStatus?: boolean;
  DakCertificateMetadata?: DakCertificateMetadata[];
}
export const SidewalkGetDeviceProfile = S.suspend(() =>
  S.Struct({
    ApplicationServerPublicKey: S.optional(SensitiveString),
    QualificationStatus: S.optional(S.Boolean),
    DakCertificateMetadata: S.optional(DakCertificateMetadataList),
  }),
).annotations({
  identifier: "SidewalkGetDeviceProfile",
}) as any as S.Schema<SidewalkGetDeviceProfile>;
export interface SidewalkDevice {
  AmazonId?: string;
  SidewalkId?: string;
  SidewalkManufacturingSn?: string;
  DeviceCertificates?: CertificateList[];
  PrivateKeys?: CertificateList[];
  DeviceProfileId?: string;
  CertificateId?: string;
  Status?: WirelessDeviceSidewalkStatus;
  Positioning?: SidewalkPositioning;
}
export const SidewalkDevice = S.suspend(() =>
  S.Struct({
    AmazonId: S.optional(S.String),
    SidewalkId: S.optional(S.String),
    SidewalkManufacturingSn: S.optional(S.String),
    DeviceCertificates: S.optional(DeviceCertificateList),
    PrivateKeys: S.optional(PrivateKeysList),
    DeviceProfileId: S.optional(S.String),
    CertificateId: S.optional(S.String),
    Status: S.optional(WirelessDeviceSidewalkStatus),
    Positioning: S.optional(SidewalkPositioning),
  }),
).annotations({
  identifier: "SidewalkDevice",
}) as any as S.Schema<SidewalkDevice>;
export interface LoRaWANDeviceMetadata {
  DevEui?: string;
  FPort?: number;
  DataRate?: number;
  Frequency?: number;
  Timestamp?: string;
  Gateways?: LoRaWANGatewayMetadata[];
  PublicGateways?: LoRaWANPublicGatewayMetadata[];
}
export const LoRaWANDeviceMetadata = S.suspend(() =>
  S.Struct({
    DevEui: S.optional(S.String),
    FPort: S.optional(S.Number),
    DataRate: S.optional(S.Number),
    Frequency: S.optional(S.Number),
    Timestamp: S.optional(S.String),
    Gateways: S.optional(LoRaWANGatewayMetadataList),
    PublicGateways: S.optional(LoRaWANPublicGatewayMetadataList),
  }),
).annotations({
  identifier: "LoRaWANDeviceMetadata",
}) as any as S.Schema<LoRaWANDeviceMetadata>;
export interface ImportedWirelessDevice {
  Sidewalk?: ImportedSidewalkDevice;
}
export const ImportedWirelessDevice = S.suspend(() =>
  S.Struct({ Sidewalk: S.optional(ImportedSidewalkDevice) }),
).annotations({
  identifier: "ImportedWirelessDevice",
}) as any as S.Schema<ImportedWirelessDevice>;
export type ImportedWirelessDeviceList = ImportedWirelessDevice[];
export const ImportedWirelessDeviceList = S.Array(ImportedWirelessDevice);
export interface EventConfigurationItem {
  Identifier?: string;
  IdentifierType?: IdentifierType;
  PartnerType?: EventNotificationPartnerType;
  Events?: EventNotificationItemConfigurations;
}
export const EventConfigurationItem = S.suspend(() =>
  S.Struct({
    Identifier: S.optional(S.String),
    IdentifierType: S.optional(IdentifierType),
    PartnerType: S.optional(EventNotificationPartnerType),
    Events: S.optional(EventNotificationItemConfigurations),
  }),
).annotations({
  identifier: "EventConfigurationItem",
}) as any as S.Schema<EventConfigurationItem>;
export type EventConfigurationsList = EventConfigurationItem[];
export const EventConfigurationsList = S.Array(EventConfigurationItem);
export interface WirelessDeviceStatistics {
  Arn?: string;
  Id?: string;
  Type?: WirelessDeviceType;
  Name?: string;
  DestinationName?: string;
  LastUplinkReceivedAt?: string;
  LoRaWAN?: LoRaWANListDevice;
  Sidewalk?: SidewalkListDevice;
  FuotaDeviceStatus?: FuotaDeviceStatus;
  MulticastDeviceStatus?: string;
  McGroupId?: number;
  Positioning?: PositioningConfigStatus;
}
export const WirelessDeviceStatistics = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Type: S.optional(WirelessDeviceType),
    Name: S.optional(S.String),
    DestinationName: S.optional(S.String),
    LastUplinkReceivedAt: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANListDevice),
    Sidewalk: S.optional(SidewalkListDevice),
    FuotaDeviceStatus: S.optional(FuotaDeviceStatus),
    MulticastDeviceStatus: S.optional(S.String),
    McGroupId: S.optional(S.Number),
    Positioning: S.optional(PositioningConfigStatus),
  }),
).annotations({
  identifier: "WirelessDeviceStatistics",
}) as any as S.Schema<WirelessDeviceStatistics>;
export type WirelessDeviceStatisticsList = WirelessDeviceStatistics[];
export const WirelessDeviceStatisticsList = S.Array(WirelessDeviceStatistics);
export interface UpdateWirelessGatewayTaskEntry {
  Id?: string;
  LoRaWAN?: LoRaWANUpdateGatewayTaskEntry;
  Arn?: string;
}
export const UpdateWirelessGatewayTaskEntry = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANUpdateGatewayTaskEntry),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateWirelessGatewayTaskEntry",
}) as any as S.Schema<UpdateWirelessGatewayTaskEntry>;
export type WirelessGatewayTaskDefinitionList =
  UpdateWirelessGatewayTaskEntry[];
export const WirelessGatewayTaskDefinitionList = S.Array(
  UpdateWirelessGatewayTaskEntry,
);
export interface GsmNmrObj {
  Bsic: number;
  Bcch: number;
  RxLevel?: number;
  GlobalIdentity?: GlobalIdentity;
}
export const GsmNmrObj = S.suspend(() =>
  S.Struct({
    Bsic: S.Number,
    Bcch: S.Number,
    RxLevel: S.optional(S.Number),
    GlobalIdentity: S.optional(GlobalIdentity),
  }),
).annotations({ identifier: "GsmNmrObj" }) as any as S.Schema<GsmNmrObj>;
export type GsmNmrList = GsmNmrObj[];
export const GsmNmrList = S.Array(GsmNmrObj);
export interface CreateMulticastGroupResponse {
  Arn?: string;
  Id?: string;
}
export const CreateMulticastGroupResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateMulticastGroupResponse",
}) as any as S.Schema<CreateMulticastGroupResponse>;
export interface CreateWirelessDeviceRequest {
  Type: WirelessDeviceType;
  Name?: string;
  Description?: string;
  DestinationName: string;
  ClientRequestToken?: string;
  LoRaWAN?: LoRaWANDevice;
  Tags?: Tag[];
  Positioning?: PositioningConfigStatus;
  Sidewalk?: SidewalkCreateWirelessDevice;
}
export const CreateWirelessDeviceRequest = S.suspend(() =>
  S.Struct({
    Type: WirelessDeviceType,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    DestinationName: S.String,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    LoRaWAN: S.optional(LoRaWANDevice),
    Tags: S.optional(TagList),
    Positioning: S.optional(PositioningConfigStatus),
    Sidewalk: S.optional(SidewalkCreateWirelessDevice),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/wireless-devices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWirelessDeviceRequest",
}) as any as S.Schema<CreateWirelessDeviceRequest>;
export interface CreateWirelessGatewayResponse {
  Arn?: string;
  Id?: string;
}
export const CreateWirelessGatewayResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateWirelessGatewayResponse",
}) as any as S.Schema<CreateWirelessGatewayResponse>;
export interface CreateWirelessGatewayTaskDefinitionRequest {
  AutoCreateTasks: boolean;
  Name?: string;
  Update?: UpdateWirelessGatewayTaskCreate;
  ClientRequestToken?: string;
  Tags?: Tag[];
}
export const CreateWirelessGatewayTaskDefinitionRequest = S.suspend(() =>
  S.Struct({
    AutoCreateTasks: S.Boolean,
    Name: S.optional(S.String),
    Update: S.optional(UpdateWirelessGatewayTaskCreate),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/wireless-gateway-task-definitions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWirelessGatewayTaskDefinitionRequest",
}) as any as S.Schema<CreateWirelessGatewayTaskDefinitionRequest>;
export interface GetDeviceProfileResponse {
  Arn?: string;
  Name?: string;
  Id?: string;
  LoRaWAN?: LoRaWANDeviceProfile;
  Sidewalk?: SidewalkGetDeviceProfile;
}
export const GetDeviceProfileResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANDeviceProfile),
    Sidewalk: S.optional(SidewalkGetDeviceProfile),
  }),
).annotations({
  identifier: "GetDeviceProfileResponse",
}) as any as S.Schema<GetDeviceProfileResponse>;
export interface GetPositionConfigurationResponse {
  Solvers?: PositionSolverDetails;
  Destination?: string;
}
export const GetPositionConfigurationResponse = S.suspend(() =>
  S.Struct({
    Solvers: S.optional(PositionSolverDetails),
    Destination: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPositionConfigurationResponse",
}) as any as S.Schema<GetPositionConfigurationResponse>;
export interface GetWirelessDeviceResponse {
  Type?: WirelessDeviceType;
  Name?: string;
  Description?: string;
  DestinationName?: string;
  Id?: string;
  Arn?: string;
  ThingName?: string;
  ThingArn?: string;
  LoRaWAN?: LoRaWANDevice;
  Sidewalk?: SidewalkDevice;
  Positioning?: PositioningConfigStatus;
}
export const GetWirelessDeviceResponse = S.suspend(() =>
  S.Struct({
    Type: S.optional(WirelessDeviceType),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    DestinationName: S.optional(S.String),
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    ThingName: S.optional(S.String),
    ThingArn: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANDevice),
    Sidewalk: S.optional(SidewalkDevice),
    Positioning: S.optional(PositioningConfigStatus),
  }),
).annotations({
  identifier: "GetWirelessDeviceResponse",
}) as any as S.Schema<GetWirelessDeviceResponse>;
export interface GetWirelessDeviceStatisticsResponse {
  WirelessDeviceId?: string;
  LastUplinkReceivedAt?: string;
  LoRaWAN?: LoRaWANDeviceMetadata;
  Sidewalk?: SidewalkDeviceMetadata;
}
export const GetWirelessDeviceStatisticsResponse = S.suspend(() =>
  S.Struct({
    WirelessDeviceId: S.optional(S.String),
    LastUplinkReceivedAt: S.optional(S.String),
    LoRaWAN: S.optional(LoRaWANDeviceMetadata),
    Sidewalk: S.optional(SidewalkDeviceMetadata),
  }),
).annotations({
  identifier: "GetWirelessDeviceStatisticsResponse",
}) as any as S.Schema<GetWirelessDeviceStatisticsResponse>;
export interface ListDevicesForWirelessDeviceImportTaskResponse {
  NextToken?: string;
  DestinationName?: string;
  Positioning?: PositioningConfigStatus;
  Sidewalk?: SidewalkListDevicesForImportInfo;
  ImportedWirelessDeviceList?: ImportedWirelessDevice[];
}
export const ListDevicesForWirelessDeviceImportTaskResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DestinationName: S.optional(S.String),
    Positioning: S.optional(PositioningConfigStatus),
    Sidewalk: S.optional(SidewalkListDevicesForImportInfo),
    ImportedWirelessDeviceList: S.optional(ImportedWirelessDeviceList),
  }),
).annotations({
  identifier: "ListDevicesForWirelessDeviceImportTaskResponse",
}) as any as S.Schema<ListDevicesForWirelessDeviceImportTaskResponse>;
export interface ListEventConfigurationsResponse {
  NextToken?: string;
  EventConfigurationsList?: EventConfigurationItem[];
}
export const ListEventConfigurationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    EventConfigurationsList: S.optional(EventConfigurationsList),
  }),
).annotations({
  identifier: "ListEventConfigurationsResponse",
}) as any as S.Schema<ListEventConfigurationsResponse>;
export interface ListWirelessDevicesResponse {
  NextToken?: string;
  WirelessDeviceList?: WirelessDeviceStatistics[];
}
export const ListWirelessDevicesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    WirelessDeviceList: S.optional(WirelessDeviceStatisticsList),
  }),
).annotations({
  identifier: "ListWirelessDevicesResponse",
}) as any as S.Schema<ListWirelessDevicesResponse>;
export interface ListWirelessGatewayTaskDefinitionsResponse {
  NextToken?: string;
  TaskDefinitions?: UpdateWirelessGatewayTaskEntry[];
}
export const ListWirelessGatewayTaskDefinitionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    TaskDefinitions: S.optional(WirelessGatewayTaskDefinitionList),
  }),
).annotations({
  identifier: "ListWirelessGatewayTaskDefinitionsResponse",
}) as any as S.Schema<ListWirelessGatewayTaskDefinitionsResponse>;
export interface SendDataToMulticastGroupResponse {
  MessageId?: string;
}
export const SendDataToMulticastGroupResponse = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }),
).annotations({
  identifier: "SendDataToMulticastGroupResponse",
}) as any as S.Schema<SendDataToMulticastGroupResponse>;
export type MetricQueryStatus = "Succeeded" | "Failed" | (string & {});
export const MetricQueryStatus = S.String;
export type MetricQueryTimestamps = Date[];
export const MetricQueryTimestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export interface GsmObj {
  Mcc: number;
  Mnc: number;
  Lac: number;
  GeranCid: number;
  GsmLocalId?: GsmLocalId;
  GsmTimingAdvance?: number;
  RxLevel?: number;
  GsmNmr?: GsmNmrObj[];
}
export const GsmObj = S.suspend(() =>
  S.Struct({
    Mcc: S.Number,
    Mnc: S.Number,
    Lac: S.Number,
    GeranCid: S.Number,
    GsmLocalId: S.optional(GsmLocalId),
    GsmTimingAdvance: S.optional(S.Number),
    RxLevel: S.optional(S.Number),
    GsmNmr: S.optional(GsmNmrList),
  }),
).annotations({ identifier: "GsmObj" }) as any as S.Schema<GsmObj>;
export type GsmList = GsmObj[];
export const GsmList = S.Array(GsmObj);
export interface CellTowers {
  Gsm?: GsmObj[];
  Wcdma?: WcdmaObj[];
  Tdscdma?: TdscdmaObj[];
  Lte?: LteObj[];
  Cdma?: CdmaObj[];
}
export const CellTowers = S.suspend(() =>
  S.Struct({
    Gsm: S.optional(GsmList),
    Wcdma: S.optional(WcdmaList),
    Tdscdma: S.optional(TdscdmaList),
    Lte: S.optional(LteList),
    Cdma: S.optional(CdmaList),
  }),
).annotations({ identifier: "CellTowers" }) as any as S.Schema<CellTowers>;
export interface WirelessMetadata {
  LoRaWAN?: LoRaWANSendDataToDevice;
  Sidewalk?: SidewalkSendDataToDevice;
}
export const WirelessMetadata = S.suspend(() =>
  S.Struct({
    LoRaWAN: S.optional(LoRaWANSendDataToDevice),
    Sidewalk: S.optional(SidewalkSendDataToDevice),
  }),
).annotations({
  identifier: "WirelessMetadata",
}) as any as S.Schema<WirelessMetadata>;
export interface CreateWirelessDeviceResponse {
  Arn?: string;
  Id?: string;
}
export const CreateWirelessDeviceResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateWirelessDeviceResponse",
}) as any as S.Schema<CreateWirelessDeviceResponse>;
export interface CreateWirelessGatewayTaskDefinitionResponse {
  Id?: string;
  Arn?: string;
}
export const CreateWirelessGatewayTaskDefinitionResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateWirelessGatewayTaskDefinitionResponse",
}) as any as S.Schema<CreateWirelessGatewayTaskDefinitionResponse>;
export interface GetPositionEstimateRequest {
  WiFiAccessPoints?: WiFiAccessPoint[];
  CellTowers?: CellTowers;
  Ip?: Ip;
  Gnss?: Gnss;
  Timestamp?: Date;
}
export const GetPositionEstimateRequest = S.suspend(() =>
  S.Struct({
    WiFiAccessPoints: S.optional(WiFiAccessPoints),
    CellTowers: S.optional(CellTowers),
    Ip: S.optional(Ip),
    Gnss: S.optional(Gnss),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/position-estimate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPositionEstimateRequest",
}) as any as S.Schema<GetPositionEstimateRequest>;
export interface SendDataToWirelessDeviceRequest {
  Id: string;
  TransmitMode: number;
  PayloadData: string;
  WirelessMetadata?: WirelessMetadata;
}
export const SendDataToWirelessDeviceRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    TransmitMode: S.Number,
    PayloadData: S.String,
    WirelessMetadata: S.optional(WirelessMetadata),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/wireless-devices/{Id}/data" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendDataToWirelessDeviceRequest",
}) as any as S.Schema<SendDataToWirelessDeviceRequest>;
export interface MetricQueryValue {
  Min?: number;
  Max?: number;
  Sum?: number;
  Avg?: number;
  Std?: number;
  P90?: number;
}
export const MetricQueryValue = S.suspend(() =>
  S.Struct({
    Min: S.optional(S.Number),
    Max: S.optional(S.Number),
    Sum: S.optional(S.Number),
    Avg: S.optional(S.Number),
    Std: S.optional(S.Number),
    P90: S.optional(S.Number),
  }),
).annotations({
  identifier: "MetricQueryValue",
}) as any as S.Schema<MetricQueryValue>;
export type MetricQueryValues = MetricQueryValue[];
export const MetricQueryValues = S.Array(MetricQueryValue);
export interface SummaryMetricQueryResult {
  QueryId?: string;
  QueryStatus?: MetricQueryStatus;
  Error?: string;
  MetricName?: MetricName;
  Dimensions?: Dimension[];
  AggregationPeriod?: AggregationPeriod;
  StartTimestamp?: Date;
  EndTimestamp?: Date;
  Timestamps?: Date[];
  Values?: MetricQueryValue[];
  Unit?: string;
}
export const SummaryMetricQueryResult = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    QueryStatus: S.optional(MetricQueryStatus),
    Error: S.optional(S.String),
    MetricName: S.optional(MetricName),
    Dimensions: S.optional(Dimensions),
    AggregationPeriod: S.optional(AggregationPeriod),
    StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Timestamps: S.optional(MetricQueryTimestamps),
    Values: S.optional(MetricQueryValues),
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "SummaryMetricQueryResult",
}) as any as S.Schema<SummaryMetricQueryResult>;
export type SummaryMetricQueryResults = SummaryMetricQueryResult[];
export const SummaryMetricQueryResults = S.Array(SummaryMetricQueryResult);
export interface GetMetricsResponse {
  SummaryMetricQueryResults?: SummaryMetricQueryResult[];
}
export const GetMetricsResponse = S.suspend(() =>
  S.Struct({
    SummaryMetricQueryResults: S.optional(SummaryMetricQueryResults),
  }),
).annotations({
  identifier: "GetMetricsResponse",
}) as any as S.Schema<GetMetricsResponse>;
export interface GetPositionEstimateResponse {
  GeoJsonPayload?: T.StreamingOutputBody;
}
export const GetPositionEstimateResponse = S.suspend(() =>
  S.Struct({
    GeoJsonPayload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetPositionEstimateResponse",
}) as any as S.Schema<GetPositionEstimateResponse>;
export interface SendDataToWirelessDeviceResponse {
  MessageId?: string;
}
export const SendDataToWirelessDeviceResponse = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }),
).annotations({
  identifier: "SendDataToWirelessDeviceResponse",
}) as any as S.Schema<SendDataToWirelessDeviceResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Get the event configuration based on resource types.
 */
export const getEventConfigurationByResourceTypes: (
  input: GetEventConfigurationByResourceTypesRequest,
) => effect.Effect<
  GetEventConfigurationByResourceTypesResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventConfigurationByResourceTypesRequest,
  output: GetEventConfigurationByResourceTypesResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
}));
/**
 * Gets the account-specific endpoint for Configuration and Update Server (CUPS) protocol
 * or LoRaWAN Network Server (LNS) connections.
 */
export const getServiceEndpoint: (
  input: GetServiceEndpointRequest,
) => effect.Effect<
  GetServiceEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceEndpointRequest,
  output: GetServiceEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a wireless device.
 */
export const getWirelessDevice: (
  input: GetWirelessDeviceRequest,
) => effect.Effect<
  GetWirelessDeviceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessDeviceRequest,
  output: GetWirelessDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets operating information about a wireless device.
 */
export const getWirelessDeviceStatistics: (
  input: GetWirelessDeviceStatisticsRequest,
) => effect.Effect<
  GetWirelessDeviceStatisticsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessDeviceStatisticsRequest,
  output: GetWirelessDeviceStatisticsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List the Sidewalk devices in an import task and their onboarding status.
 */
export const listDevicesForWirelessDeviceImportTask: (
  input: ListDevicesForWirelessDeviceImportTaskRequest,
) => effect.Effect<
  ListDevicesForWirelessDeviceImportTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevicesForWirelessDeviceImportTaskRequest,
  output: ListDevicesForWirelessDeviceImportTaskResponse,
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
 * List event configurations where at least one event topic has been enabled.
 */
export const listEventConfigurations: (
  input: ListEventConfigurationsRequest,
) => effect.Effect<
  ListEventConfigurationsResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventConfigurationsRequest,
  output: ListEventConfigurationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the wireless devices registered to your AWS account.
 */
export const listWirelessDevices: {
  (
    input: ListWirelessDevicesRequest,
  ): effect.Effect<
    ListWirelessDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWirelessDevicesRequest,
  ) => stream.Stream<
    ListWirelessDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWirelessDevicesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWirelessDevicesRequest,
  output: ListWirelessDevicesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the wireless gateway tasks definitions registered to your AWS account.
 */
export const listWirelessGatewayTaskDefinitions: (
  input: ListWirelessGatewayTaskDefinitionsRequest,
) => effect.Effect<
  ListWirelessGatewayTaskDefinitionsResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWirelessGatewayTaskDefinitionsRequest,
  output: ListWirelessGatewayTaskDefinitionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends the specified data to a multicast group.
 */
export const sendDataToMulticastGroup: (
  input: SendDataToMulticastGroupRequest,
) => effect.Effect<
  SendDataToMulticastGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendDataToMulticastGroupRequest,
  output: SendDataToMulticastGroupResponse,
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
 * Adds a tag to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Gets information about a service profile.
 */
export const getServiceProfile: (
  input: GetServiceProfileRequest,
) => effect.Effect<
  GetServiceProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceProfileRequest,
  output: GetServiceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get information about an import task and count of device onboarding summary
 * information for the import task.
 */
export const getWirelessDeviceImportTask: (
  input: GetWirelessDeviceImportTaskRequest,
) => effect.Effect<
  GetWirelessDeviceImportTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessDeviceImportTaskRequest,
  output: GetWirelessDeviceImportTaskResponse,
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
 * Gets the firmware version and other information about a wireless gateway.
 */
export const getWirelessGatewayFirmwareInformation: (
  input: GetWirelessGatewayFirmwareInformationRequest,
) => effect.Effect<
  GetWirelessGatewayFirmwareInformationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessGatewayFirmwareInformationRequest,
  output: GetWirelessGatewayFirmwareInformationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the destinations registered to your AWS account.
 */
export const listDestinations: {
  (
    input: ListDestinationsRequest,
  ): effect.Effect<
    ListDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDestinationsRequest,
  ) => stream.Stream<
    ListDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDestinationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDestinationsRequest,
  output: ListDestinationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the device profiles registered to your AWS account.
 */
export const listDeviceProfiles: {
  (
    input: ListDeviceProfilesRequest,
  ): effect.Effect<
    ListDeviceProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeviceProfilesRequest,
  ) => stream.Stream<
    ListDeviceProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeviceProfilesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDeviceProfilesRequest,
  output: ListDeviceProfilesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the FUOTA tasks registered to your AWS account.
 */
export const listFuotaTasks: {
  (
    input: ListFuotaTasksRequest,
  ): effect.Effect<
    ListFuotaTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFuotaTasksRequest,
  ) => stream.Stream<
    ListFuotaTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFuotaTasksRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFuotaTasksRequest,
  output: ListFuotaTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the multicast groups registered to your AWS account.
 */
export const listMulticastGroups: {
  (
    input: ListMulticastGroupsRequest,
  ): effect.Effect<
    ListMulticastGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMulticastGroupsRequest,
  ) => stream.Stream<
    ListMulticastGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMulticastGroupsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMulticastGroupsRequest,
  output: ListMulticastGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all multicast groups associated with a FUOTA task.
 */
export const listMulticastGroupsByFuotaTask: {
  (
    input: ListMulticastGroupsByFuotaTaskRequest,
  ): effect.Effect<
    ListMulticastGroupsByFuotaTaskResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMulticastGroupsByFuotaTaskRequest,
  ) => stream.Stream<
    ListMulticastGroupsByFuotaTaskResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMulticastGroupsByFuotaTaskRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMulticastGroupsByFuotaTaskRequest,
  output: ListMulticastGroupsByFuotaTaskResponse,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the network analyzer configurations.
 */
export const listNetworkAnalyzerConfigurations: {
  (
    input: ListNetworkAnalyzerConfigurationsRequest,
  ): effect.Effect<
    ListNetworkAnalyzerConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNetworkAnalyzerConfigurationsRequest,
  ) => stream.Stream<
    ListNetworkAnalyzerConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNetworkAnalyzerConfigurationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNetworkAnalyzerConfigurationsRequest,
  output: ListNetworkAnalyzerConfigurationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List position configurations for a given resource, such as positioning solvers.
 *
 * This action is no longer supported. Calls to retrieve position information should
 * use the GetResourcePosition API operation instead.
 */
export const listPositionConfigurations: {
  (
    input: ListPositionConfigurationsRequest,
  ): effect.Effect<
    ListPositionConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPositionConfigurationsRequest,
  ) => stream.Stream<
    ListPositionConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPositionConfigurationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPositionConfigurationsRequest,
  output: ListPositionConfigurationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List queued messages in the downlink queue.
 */
export const listQueuedMessages: {
  (
    input: ListQueuedMessagesRequest,
  ): effect.Effect<
    ListQueuedMessagesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueuedMessagesRequest,
  ) => stream.Stream<
    ListQueuedMessagesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueuedMessagesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQueuedMessagesRequest,
  output: ListQueuedMessagesResponse,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the service profiles registered to your AWS account.
 */
export const listServiceProfiles: {
  (
    input: ListServiceProfilesRequest,
  ): effect.Effect<
    ListServiceProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceProfilesRequest,
  ) => stream.Stream<
    ListServiceProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceProfilesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceProfilesRequest,
  output: ListServiceProfilesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List of import tasks and summary information of onboarding status of devices in each
 * import task.
 */
export const listWirelessDeviceImportTasks: (
  input: ListWirelessDeviceImportTasksRequest,
) => effect.Effect<
  ListWirelessDeviceImportTasksResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWirelessDeviceImportTasksRequest,
  output: ListWirelessDeviceImportTasksResponse,
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
 * Lists the wireless gateways registered to your AWS account.
 */
export const listWirelessGateways: {
  (
    input: ListWirelessGatewaysRequest,
  ): effect.Effect<
    ListWirelessGatewaysResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWirelessGatewaysRequest,
  ) => stream.Stream<
    ListWirelessGatewaysResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWirelessGatewaysRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWirelessGatewaysRequest,
  output: ListWirelessGatewaysResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Put position configuration for a given resource.
 *
 * This action is no longer supported. Calls to update the position configuration
 * should use the UpdateResourcePosition API operation instead.
 */
export const putPositionConfiguration: (
  input: PutPositionConfigurationRequest,
) => effect.Effect<
  PutPositionConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPositionConfigurationRequest,
  output: PutPositionConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Start import task for a single wireless device.
 */
export const startSingleWirelessDeviceImportTask: (
  input: StartSingleWirelessDeviceImportTaskRequest,
) => effect.Effect<
  StartSingleWirelessDeviceImportTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSingleWirelessDeviceImportTaskRequest,
  output: StartSingleWirelessDeviceImportTaskResponse,
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
 * Start import task for provisioning Sidewalk devices in bulk using an S3 CSV
 * file.
 */
export const startWirelessDeviceImportTask: (
  input: StartWirelessDeviceImportTaskRequest,
) => effect.Effect<
  StartWirelessDeviceImportTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartWirelessDeviceImportTaskRequest,
  output: StartWirelessDeviceImportTaskResponse,
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
 * Update the event configuration for a particular resource identifier.
 */
export const updateResourceEventConfiguration: (
  input: UpdateResourceEventConfigurationRequest,
) => effect.Effect<
  UpdateResourceEventConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceEventConfigurationRequest,
  output: UpdateResourceEventConfigurationResponse,
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
 * Updates properties of a wireless device.
 */
export const updateWirelessDevice: (
  input: UpdateWirelessDeviceRequest,
) => effect.Effect<
  UpdateWirelessDeviceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWirelessDeviceRequest,
  output: UpdateWirelessDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a destination.
 */
export const getDestination: (
  input: GetDestinationRequest,
) => effect.Effect<
  GetDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDestinationRequest,
  output: GetDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a multicast group session.
 */
export const getMulticastGroupSession: (
  input: GetMulticastGroupSessionRequest,
) => effect.Effect<
  GetMulticastGroupSessionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMulticastGroupSessionRequest,
  output: GetMulticastGroupSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get network analyzer configuration.
 */
export const getNetworkAnalyzerConfiguration: (
  input: GetNetworkAnalyzerConfigurationRequest,
) => effect.Effect<
  GetNetworkAnalyzerConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNetworkAnalyzerConfigurationRequest,
  output: GetNetworkAnalyzerConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the event configuration for a particular resource identifier.
 */
export const getResourceEventConfiguration: (
  input: GetResourceEventConfigurationRequest,
) => effect.Effect<
  GetResourceEventConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceEventConfigurationRequest,
  output: GetResourceEventConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Fetches the log-level override, if any, for a given resource ID and resource
 * type..
 */
export const getResourceLogLevel: (
  input: GetResourceLogLevelRequest,
) => effect.Effect<
  GetResourceLogLevelResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceLogLevelRequest,
  output: GetResourceLogLevelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the position information for a given wireless device or a wireless gateway
 * resource. The position information uses the World Geodetic System
 * (WGS84).
 */
export const getResourcePosition: (
  input: GetResourcePositionRequest,
) => effect.Effect<
  GetResourcePositionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePositionRequest,
  output: GetResourcePositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a wireless gateway.
 */
export const getWirelessGateway: (
  input: GetWirelessGatewayRequest,
) => effect.Effect<
  GetWirelessGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessGatewayRequest,
  output: GetWirelessGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the ID of the certificate that is currently associated with a wireless
 * gateway.
 */
export const getWirelessGatewayCertificate: (
  input: GetWirelessGatewayCertificateRequest,
) => effect.Effect<
  GetWirelessGatewayCertificateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessGatewayCertificateRequest,
  output: GetWirelessGatewayCertificateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets operating information about a wireless gateway.
 */
export const getWirelessGatewayStatistics: (
  input: GetWirelessGatewayStatisticsRequest,
) => effect.Effect<
  GetWirelessGatewayStatisticsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessGatewayStatisticsRequest,
  output: GetWirelessGatewayStatisticsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a wireless gateway task.
 */
export const getWirelessGatewayTask: (
  input: GetWirelessGatewayTaskRequest,
) => effect.Effect<
  GetWirelessGatewayTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessGatewayTaskRequest,
  output: GetWirelessGatewayTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a wireless gateway task definition.
 */
export const getWirelessGatewayTaskDefinition: (
  input: GetWirelessGatewayTaskDefinitionRequest,
) => effect.Effect<
  GetWirelessGatewayTaskDefinitionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWirelessGatewayTaskDefinitionRequest,
  output: GetWirelessGatewayTaskDefinitionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the partner accounts associated with your AWS account.
 */
export const listPartnerAccounts: (
  input: ListPartnerAccountsRequest,
) => effect.Effect<
  ListPartnerAccountsResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPartnerAccountsRequest,
  output: ListPartnerAccountsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Simulates a provisioned device by sending an uplink data payload of
 * `Hello`.
 */
export const testWirelessDevice: (
  input: TestWirelessDeviceRequest,
) => effect.Effect<
  TestWirelessDeviceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestWirelessDeviceRequest,
  output: TestWirelessDeviceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates properties of a partner account.
 */
export const updatePartnerAccount: (
  input: UpdatePartnerAccountRequest,
) => effect.Effect<
  UpdatePartnerAccountResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePartnerAccountRequest,
  output: UpdatePartnerAccountResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update an import task to add more devices to the task.
 */
export const updateWirelessDeviceImportTask: (
  input: UpdateWirelessDeviceImportTaskRequest,
) => effect.Effect<
  UpdateWirelessDeviceImportTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWirelessDeviceImportTaskRequest,
  output: UpdateWirelessDeviceImportTaskResponse,
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
 * Disassociates your AWS account from a partner account. If
 * `PartnerAccountId` and `PartnerType` are `null`,
 * disassociates your AWS account from all partner accounts.
 */
export const disassociateAwsAccountFromPartnerAccount: (
  input: DisassociateAwsAccountFromPartnerAccountRequest,
) => effect.Effect<
  DisassociateAwsAccountFromPartnerAccountResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAwsAccountFromPartnerAccountRequest,
  output: DisassociateAwsAccountFromPartnerAccountResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the log-level overrides for all resources; wireless devices, wireless
 * gateways, and FUOTA tasks.
 */
export const resetAllResourceLogLevels: (
  input: ResetAllResourceLogLevelsRequest,
) => effect.Effect<
  ResetAllResourceLogLevelsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetAllResourceLogLevelsRequest,
  output: ResetAllResourceLogLevelsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the log-level override, if any, for a specific resource ID and resource type.
 * It can be used for a wireless device, a wireless gateway, or a FUOTA task.
 */
export const resetResourceLogLevel: (
  input: ResetResourceLogLevelRequest,
) => effect.Effect<
  ResetResourceLogLevelResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetResourceLogLevelRequest,
  output: ResetResourceLogLevelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a bulk association of all qualifying wireless devices with a multicast
 * group.
 */
export const startBulkAssociateWirelessDeviceWithMulticastGroup: (
  input: StartBulkAssociateWirelessDeviceWithMulticastGroupRequest,
) => effect.Effect<
  StartBulkAssociateWirelessDeviceWithMulticastGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBulkAssociateWirelessDeviceWithMulticastGroupRequest,
  output: StartBulkAssociateWirelessDeviceWithMulticastGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a bulk disassociatin of all qualifying wireless devices from a multicast
 * group.
 */
export const startBulkDisassociateWirelessDeviceFromMulticastGroup: (
  input: StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest,
) => effect.Effect<
  StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBulkDisassociateWirelessDeviceFromMulticastGroupRequest,
  output: StartBulkDisassociateWirelessDeviceFromMulticastGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates properties of a destination.
 */
export const updateDestination: (
  input: UpdateDestinationRequest,
) => effect.Effect<
  UpdateDestinationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDestinationRequest,
  output: UpdateDestinationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update network analyzer configuration.
 */
export const updateNetworkAnalyzerConfiguration: (
  input: UpdateNetworkAnalyzerConfigurationRequest,
) => effect.Effect<
  UpdateNetworkAnalyzerConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNetworkAnalyzerConfigurationRequest,
  output: UpdateNetworkAnalyzerConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the position information of a resource.
 *
 * This action is no longer supported. Calls to update the position information
 * should use the UpdateResourcePosition API operation instead.
 */
export const updatePosition: (
  input: UpdatePositionRequest,
) => effect.Effect<
  UpdatePositionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePositionRequest,
  output: UpdatePositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the position information of a given wireless device or a wireless gateway
 * resource. The position coordinates are based on the World Geodetic System
 * (WGS84).
 */
export const updateResourcePosition: (
  input: UpdateResourcePositionRequest,
) => effect.Effect<
  UpdateResourcePositionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourcePositionRequest,
  output: UpdateResourcePositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates properties of a wireless gateway.
 */
export const updateWirelessGateway: (
  input: UpdateWirelessGatewayRequest,
) => effect.Effect<
  UpdateWirelessGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWirelessGatewayRequest,
  output: UpdateWirelessGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a FUOTA task.
 */
export const deleteFuotaTask: (
  input: DeleteFuotaTaskRequest,
) => effect.Effect<
  DeleteFuotaTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFuotaTaskRequest,
  output: DeleteFuotaTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Remove queued messages from the downlink queue.
 */
export const deleteQueuedMessages: (
  input: DeleteQueuedMessagesRequest,
) => effect.Effect<
  DeleteQueuedMessagesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueuedMessagesRequest,
  output: DeleteQueuedMessagesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a wireless device.
 */
export const deleteWirelessDevice: (
  input: DeleteWirelessDeviceRequest,
) => effect.Effect<
  DeleteWirelessDeviceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWirelessDeviceRequest,
  output: DeleteWirelessDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a wireless gateway.
 *
 * When deleting a wireless gateway, you might run into duplication errors for the
 * following reasons.
 *
 * - If you specify a `GatewayEui` value that already exists.
 *
 * - If you used a `ClientRequestToken` with the same parameters
 * within the last 10 minutes.
 *
 * To avoid this error, make sure that you use unique identifiers and parameters for
 * each request within the specified time period.
 */
export const deleteWirelessGateway: (
  input: DeleteWirelessGatewayRequest,
) => effect.Effect<
  DeleteWirelessGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWirelessGatewayRequest,
  output: DeleteWirelessGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a wireless gateway task.
 */
export const deleteWirelessGatewayTask: (
  input: DeleteWirelessGatewayTaskRequest,
) => effect.Effect<
  DeleteWirelessGatewayTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWirelessGatewayTaskRequest,
  output: DeleteWirelessGatewayTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a wireless gateway task definition. Deleting this task definition does not
 * affect tasks that are currently in progress.
 */
export const deleteWirelessGatewayTaskDefinition: (
  input: DeleteWirelessGatewayTaskDefinitionRequest,
) => effect.Effect<
  DeleteWirelessGatewayTaskDefinitionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWirelessGatewayTaskDefinitionRequest,
  output: DeleteWirelessGatewayTaskDefinitionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a wireless device from a multicast group.
 */
export const disassociateWirelessDeviceFromMulticastGroup: (
  input: DisassociateWirelessDeviceFromMulticastGroupRequest,
) => effect.Effect<
  DisassociateWirelessDeviceFromMulticastGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateWirelessDeviceFromMulticastGroupRequest,
  output: DisassociateWirelessDeviceFromMulticastGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a wireless gateway from its currently associated certificate.
 */
export const disassociateWirelessGatewayFromCertificate: (
  input: DisassociateWirelessGatewayFromCertificateRequest,
) => effect.Effect<
  DisassociateWirelessGatewayFromCertificateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateWirelessGatewayFromCertificateRequest,
  output: DisassociateWirelessGatewayFromCertificateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sets the log-level override for a resource ID and resource type. A limit of 200 log
 * level override can be set per account.
 */
export const putResourceLogLevel: (
  input: PutResourceLogLevelRequest,
) => effect.Effect<
  PutResourceLogLevelResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourceLogLevelRequest,
  output: PutResourceLogLevelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates properties of a FUOTA task.
 */
export const updateFuotaTask: (
  input: UpdateFuotaTaskRequest,
) => effect.Effect<
  UpdateFuotaTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFuotaTaskRequest,
  output: UpdateFuotaTaskResponse,
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
 * Set default log level, or log levels by resource types. This can be for wireless
 * device, wireless gateway, or FUOTA task log options, and is used to control the log
 * messages that'll be displayed in CloudWatch.
 */
export const updateLogLevelsByResourceTypes: (
  input: UpdateLogLevelsByResourceTypesRequest,
) => effect.Effect<
  UpdateLogLevelsByResourceTypesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLogLevelsByResourceTypesRequest,
  output: UpdateLogLevelsByResourceTypesResponse,
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
 * Update the summary metric configuration.
 */
export const updateMetricConfiguration: (
  input: UpdateMetricConfigurationRequest,
) => effect.Effect<
  UpdateMetricConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMetricConfigurationRequest,
  output: UpdateMetricConfigurationResponse,
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
 * Updates properties of a multicast group session.
 */
export const updateMulticastGroup: (
  input: UpdateMulticastGroupRequest,
) => effect.Effect<
  UpdateMulticastGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMulticastGroupRequest,
  output: UpdateMulticastGroupResponse,
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
 * Associate a multicast group with a FUOTA task.
 */
export const associateMulticastGroupWithFuotaTask: (
  input: AssociateMulticastGroupWithFuotaTaskRequest,
) => effect.Effect<
  AssociateMulticastGroupWithFuotaTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateMulticastGroupWithFuotaTaskRequest,
  output: AssociateMulticastGroupWithFuotaTaskResponse,
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
 * Associate a wireless device with a FUOTA task.
 */
export const associateWirelessDeviceWithFuotaTask: (
  input: AssociateWirelessDeviceWithFuotaTaskRequest,
) => effect.Effect<
  AssociateWirelessDeviceWithFuotaTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateWirelessDeviceWithFuotaTaskRequest,
  output: AssociateWirelessDeviceWithFuotaTaskResponse,
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
 * Associates a wireless device with a multicast group.
 */
export const associateWirelessDeviceWithMulticastGroup: (
  input: AssociateWirelessDeviceWithMulticastGroupRequest,
) => effect.Effect<
  AssociateWirelessDeviceWithMulticastGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateWirelessDeviceWithMulticastGroupRequest,
  output: AssociateWirelessDeviceWithMulticastGroupResponse,
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
 * Associates a wireless device with a thing.
 */
export const associateWirelessDeviceWithThing: (
  input: AssociateWirelessDeviceWithThingRequest,
) => effect.Effect<
  AssociateWirelessDeviceWithThingResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateWirelessDeviceWithThingRequest,
  output: AssociateWirelessDeviceWithThingResponse,
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
 * Associates a wireless gateway with a thing.
 */
export const associateWirelessGatewayWithThing: (
  input: AssociateWirelessGatewayWithThingRequest,
) => effect.Effect<
  AssociateWirelessGatewayWithThingResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateWirelessGatewayWithThingRequest,
  output: AssociateWirelessGatewayWithThingResponse,
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
 * Cancels an existing multicast group session.
 */
export const cancelMulticastGroupSession: (
  input: CancelMulticastGroupSessionRequest,
) => effect.Effect<
  CancelMulticastGroupSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelMulticastGroupSessionRequest,
  output: CancelMulticastGroupSessionResponse,
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
 * Deletes a destination.
 */
export const deleteDestination: (
  input: DeleteDestinationRequest,
) => effect.Effect<
  DeleteDestinationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDestinationRequest,
  output: DeleteDestinationResponse,
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
 * Deletes a device profile.
 */
export const deleteDeviceProfile: (
  input: DeleteDeviceProfileRequest,
) => effect.Effect<
  DeleteDeviceProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeviceProfileRequest,
  output: DeleteDeviceProfileResponse,
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
 * Deletes a multicast group if it is not in use by a FUOTA task.
 */
export const deleteMulticastGroup: (
  input: DeleteMulticastGroupRequest,
) => effect.Effect<
  DeleteMulticastGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMulticastGroupRequest,
  output: DeleteMulticastGroupResponse,
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
 * Deletes a network analyzer configuration.
 */
export const deleteNetworkAnalyzerConfiguration: (
  input: DeleteNetworkAnalyzerConfigurationRequest,
) => effect.Effect<
  DeleteNetworkAnalyzerConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNetworkAnalyzerConfigurationRequest,
  output: DeleteNetworkAnalyzerConfigurationResponse,
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
 * Deletes a service profile.
 */
export const deleteServiceProfile: (
  input: DeleteServiceProfileRequest,
) => effect.Effect<
  DeleteServiceProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceProfileRequest,
  output: DeleteServiceProfileResponse,
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
 * Delete an import task.
 */
export const deleteWirelessDeviceImportTask: (
  input: DeleteWirelessDeviceImportTaskRequest,
) => effect.Effect<
  DeleteWirelessDeviceImportTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWirelessDeviceImportTaskRequest,
  output: DeleteWirelessDeviceImportTaskResponse,
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
 * Disassociates a multicast group from a FUOTA task.
 */
export const disassociateMulticastGroupFromFuotaTask: (
  input: DisassociateMulticastGroupFromFuotaTaskRequest,
) => effect.Effect<
  DisassociateMulticastGroupFromFuotaTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMulticastGroupFromFuotaTaskRequest,
  output: DisassociateMulticastGroupFromFuotaTaskResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Disassociates a wireless device from a FUOTA task.
 */
export const disassociateWirelessDeviceFromFuotaTask: (
  input: DisassociateWirelessDeviceFromFuotaTaskRequest,
) => effect.Effect<
  DisassociateWirelessDeviceFromFuotaTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateWirelessDeviceFromFuotaTaskRequest,
  output: DisassociateWirelessDeviceFromFuotaTaskResponse,
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
 * Disassociates a wireless device from its currently associated thing.
 */
export const disassociateWirelessDeviceFromThing: (
  input: DisassociateWirelessDeviceFromThingRequest,
) => effect.Effect<
  DisassociateWirelessDeviceFromThingResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateWirelessDeviceFromThingRequest,
  output: DisassociateWirelessDeviceFromThingResponse,
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
 * Disassociates a wireless gateway from its currently associated thing.
 */
export const disassociateWirelessGatewayFromThing: (
  input: DisassociateWirelessGatewayFromThingRequest,
) => effect.Effect<
  DisassociateWirelessGatewayFromThingResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateWirelessGatewayFromThingRequest,
  output: DisassociateWirelessGatewayFromThingResponse,
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
 * Associates a wireless gateway with a certificate.
 */
export const associateWirelessGatewayWithCertificate: (
  input: AssociateWirelessGatewayWithCertificateRequest,
) => effect.Effect<
  AssociateWirelessGatewayWithCertificateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateWirelessGatewayWithCertificateRequest,
  output: AssociateWirelessGatewayWithCertificateResponse,
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
 * Creates a new destination that maps a device message to an AWS IoT rule.
 */
export const createDestination: (
  input: CreateDestinationRequest,
) => effect.Effect<
  CreateDestinationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDestinationRequest,
  output: CreateDestinationResponse,
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
 * Creates a task for a wireless gateway.
 */
export const createWirelessGatewayTask: (
  input: CreateWirelessGatewayTaskRequest,
) => effect.Effect<
  CreateWirelessGatewayTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWirelessGatewayTaskRequest,
  output: CreateWirelessGatewayTaskResponse,
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
 * Get the metric configuration status for this AWS account.
 */
export const getMetricConfiguration: (
  input: GetMetricConfigurationRequest,
) => effect.Effect<
  GetMetricConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetricConfigurationRequest,
  output: GetMetricConfigurationResponse,
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
 * Lists the tags (metadata) you have assigned to the resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | ConflictException
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a FUOTA task.
 */
export const startFuotaTask: (
  input: StartFuotaTaskRequest,
) => effect.Effect<
  StartFuotaTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFuotaTaskRequest,
  output: StartFuotaTaskResponse,
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
 * Starts a multicast group session.
 */
export const startMulticastGroupSession: (
  input: StartMulticastGroupSessionRequest,
) => effect.Effect<
  StartMulticastGroupSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMulticastGroupSessionRequest,
  output: StartMulticastGroupSessionResponse,
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
 * Associates a partner account with your AWS account.
 */
export const associateAwsAccountWithPartnerAccount: (
  input: AssociateAwsAccountWithPartnerAccountRequest,
) => effect.Effect<
  AssociateAwsAccountWithPartnerAccountResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAwsAccountWithPartnerAccountRequest,
  output: AssociateAwsAccountWithPartnerAccountResponse,
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
 * Creates a FUOTA task.
 */
export const createFuotaTask: (
  input: CreateFuotaTaskRequest,
) => effect.Effect<
  CreateFuotaTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFuotaTaskRequest,
  output: CreateFuotaTaskResponse,
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
 * Creates a new network analyzer configuration.
 */
export const createNetworkAnalyzerConfiguration: (
  input: CreateNetworkAnalyzerConfigurationRequest,
) => effect.Effect<
  CreateNetworkAnalyzerConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNetworkAnalyzerConfigurationRequest,
  output: CreateNetworkAnalyzerConfigurationResponse,
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
 * Update the event configuration based on resource types.
 */
export const updateEventConfigurationByResourceTypes: (
  input: UpdateEventConfigurationByResourceTypesRequest,
) => effect.Effect<
  UpdateEventConfigurationByResourceTypesResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventConfigurationByResourceTypesRequest,
  output: UpdateEventConfigurationByResourceTypesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new device profile.
 */
export const createDeviceProfile: (
  input: CreateDeviceProfileRequest,
) => effect.Effect<
  CreateDeviceProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeviceProfileRequest,
  output: CreateDeviceProfileResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new service profile.
 */
export const createServiceProfile: (
  input: CreateServiceProfileRequest,
) => effect.Effect<
  CreateServiceProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceProfileRequest,
  output: CreateServiceProfileResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deregister a wireless device from AWS IoT Wireless.
 */
export const deregisterWirelessDevice: (
  input: DeregisterWirelessDeviceRequest,
) => effect.Effect<
  DeregisterWirelessDeviceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterWirelessDeviceRequest,
  output: DeregisterWirelessDeviceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a FUOTA task.
 */
export const getFuotaTask: (
  input: GetFuotaTaskRequest,
) => effect.Effect<
  GetFuotaTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFuotaTaskRequest,
  output: GetFuotaTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns current default log levels or log levels by resource types. Based on the
 * resource type, log levels can be returned for wireless device, wireless gateway, or
 * FUOTA task log options.
 */
export const getLogLevelsByResourceTypes: (
  input: GetLogLevelsByResourceTypesRequest,
) => effect.Effect<
  GetLogLevelsByResourceTypesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogLevelsByResourceTypesRequest,
  output: GetLogLevelsByResourceTypesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a multicast group.
 */
export const getMulticastGroup: (
  input: GetMulticastGroupRequest,
) => effect.Effect<
  GetMulticastGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMulticastGroupRequest,
  output: GetMulticastGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a partner account. If `PartnerAccountId` and
 * `PartnerType` are `null`, returns all partner accounts.
 */
export const getPartnerAccount: (
  input: GetPartnerAccountRequest,
) => effect.Effect<
  GetPartnerAccountResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPartnerAccountRequest,
  output: GetPartnerAccountResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the position information for a given resource.
 *
 * This action is no longer supported. Calls to retrieve the position information
 * should use the GetResourcePosition API operation instead.
 */
export const getPosition: (
  input: GetPositionRequest,
) => effect.Effect<
  GetPositionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPositionRequest,
  output: GetPositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a multicast group.
 */
export const createMulticastGroup: (
  input: CreateMulticastGroupRequest,
) => effect.Effect<
  CreateMulticastGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMulticastGroupRequest,
  output: CreateMulticastGroupResponse,
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
 * Provisions a wireless gateway.
 *
 * When provisioning a wireless gateway, you might run into duplication errors for
 * the following reasons.
 *
 * - If you specify a `GatewayEui` value that already exists.
 *
 * - If you used a `ClientRequestToken` with the same parameters
 * within the last 10 minutes.
 *
 * To avoid this error, make sure that you use unique identifiers and parameters for
 * each request within the specified time period.
 */
export const createWirelessGateway: (
  input: CreateWirelessGatewayRequest,
) => effect.Effect<
  CreateWirelessGatewayResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWirelessGatewayRequest,
  output: CreateWirelessGatewayResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a device profile.
 */
export const getDeviceProfile: (
  input: GetDeviceProfileRequest,
) => effect.Effect<
  GetDeviceProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceProfileRequest,
  output: GetDeviceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get position configuration for a given resource.
 *
 * This action is no longer supported. Calls to retrieve the position configuration
 * should use the GetResourcePosition API operation instead.
 */
export const getPositionConfiguration: (
  input: GetPositionConfigurationRequest,
) => effect.Effect<
  GetPositionConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPositionConfigurationRequest,
  output: GetPositionConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provisions a wireless device.
 */
export const createWirelessDevice: (
  input: CreateWirelessDeviceRequest,
) => effect.Effect<
  CreateWirelessDeviceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWirelessDeviceRequest,
  output: CreateWirelessDeviceResponse,
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
 * Creates a gateway task definition.
 */
export const createWirelessGatewayTaskDefinition: (
  input: CreateWirelessGatewayTaskDefinitionRequest,
) => effect.Effect<
  CreateWirelessGatewayTaskDefinitionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWirelessGatewayTaskDefinitionRequest,
  output: CreateWirelessGatewayTaskDefinitionResponse,
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
 * Get the summary metrics for this AWS account.
 */
export const getMetrics: (
  input: GetMetricsRequest,
) => effect.Effect<
  GetMetricsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetricsRequest,
  output: GetMetricsResponse,
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
 * Get estimated position information as a payload in GeoJSON format. The payload
 * measurement data is resolved using solvers that are provided by third-party
 * vendors.
 */
export const getPositionEstimate: (
  input: GetPositionEstimateRequest,
) => effect.Effect<
  GetPositionEstimateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPositionEstimateRequest,
  output: GetPositionEstimateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends a decrypted application data frame to a device.
 */
export const sendDataToWirelessDevice: (
  input: SendDataToWirelessDeviceRequest,
) => effect.Effect<
  SendDataToWirelessDeviceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendDataToWirelessDeviceRequest,
  output: SendDataToWirelessDeviceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
