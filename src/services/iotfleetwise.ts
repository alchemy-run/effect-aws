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
  sdkId: "IoTFleetWise",
  serviceShapeName: "IoTAutobahnControlPlane",
});
const auth = T.AwsAuthSigv4({ name: "iotfleetwise" });
const ver = T.ServiceVersion("2021-06-17");
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
              `https://iotfleetwise-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://iotfleetwise-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://iotfleetwise.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://iotfleetwise.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type errorMessage = string;
export type customerAccountId = string;
export type nextToken = string;
export type maxResults = number;
export type vehicleName = string;
export type AmazonResourceName = string;
export type TagKey = string;
export type campaignName = string;
export type description = string;
export type arn = string;
export type uint32 = number;
export type priority = number;
export type NodePath = string;
export type statusStr = string;
export type resourceName = string;
export type FullyQualifiedName = string;
export type InterfaceId = string;
export type fleetId = string;
export type ResourceIdentifier = string;
export type attributeName = string;
export type attributeValue = string;
export type listVehiclesMaxResults = number;
export type CloudWatchLogGroupName = string;
export type TimestreamDatabaseName = string;
export type TimestreamTableName = string;
export type IAMRoleArn = string;
export type TagValue = string;
export type wildcardSignalName = string;
export type maxSampleCount = number;
export type DataPartitionId = string;
export type languageVersion = number;
export type actionEventExpression = string | redacted.Redacted<string>;
export type campaignArn = string;
export type message = string;
export type ResourceUniqueId = string;
export type collectionPeriodMs = number;
export type eventExpression = string | redacted.Redacted<string>;
export type S3BucketArn = string;
export type Prefix = string;
export type TimestreamTableArn = string;
export type MqttTopicArn = string;
export type StorageLocation = string | redacted.Redacted<string>;
export type nonNegativeInteger = number;
export type double = number;
export type CanSignalName = string;
export type positiveInteger = number;
export type ObdByteLength = number;
export type ObdBitmaskLength = number;
export type TopicName = string;
export type CustomDecodingId = string;
export type CanInterfaceName = string;
export type ProtocolName = string;
export type ProtocolVersion = string;
export type ObdInterfaceName = string;
export type ObdStandard = string;
export type VehicleMiddlewareName = string;
export type CustomDecodingSignalInterfaceName = string;
export type NetworkFileBlob = Uint8Array;
export type StorageMaximumSizeValue = number;
export type StorageMinimumTimeToLiveValue = number;
export type positiveLong = number;
export type fetchConfigEventExpression = string | redacted.Redacted<string>;
export type RetryAfterSeconds = number;
export type StructureMessageName = string;
export type maxStringSize = number;

//# Schemas
export interface GetEncryptionConfigurationRequest {}
export const GetEncryptionConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/encryptionConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEncryptionConfigurationRequest",
}) as any as S.Schema<GetEncryptionConfigurationRequest>;
export interface GetLoggingOptionsRequest {}
export const GetLoggingOptionsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/loggingOptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLoggingOptionsRequest",
}) as any as S.Schema<GetLoggingOptionsRequest>;
export interface GetRegisterAccountStatusRequest {}
export const GetRegisterAccountStatusRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/account/registration_status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRegisterAccountStatusRequest",
}) as any as S.Schema<GetRegisterAccountStatusRequest>;
export type EncryptionStatus = "PENDING" | "SUCCESS" | "FAILURE";
export const EncryptionStatus = S.Literal("PENDING", "SUCCESS", "FAILURE");
export type EncryptionType =
  | "KMS_BASED_ENCRYPTION"
  | "FLEETWISE_DEFAULT_ENCRYPTION";
export const EncryptionType = S.Literal(
  "KMS_BASED_ENCRYPTION",
  "FLEETWISE_DEFAULT_ENCRYPTION",
);
export type RegistrationStatus =
  | "REGISTRATION_PENDING"
  | "REGISTRATION_SUCCESS"
  | "REGISTRATION_FAILURE";
export const RegistrationStatus = S.Literal(
  "REGISTRATION_PENDING",
  "REGISTRATION_SUCCESS",
  "REGISTRATION_FAILURE",
);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type DiagnosticsMode = "OFF" | "SEND_ACTIVE_DTCS";
export const DiagnosticsMode = S.Literal("OFF", "SEND_ACTIVE_DTCS");
export type SpoolingMode = "OFF" | "TO_DISK";
export const SpoolingMode = S.Literal("OFF", "TO_DISK");
export type Compression = "OFF" | "SNAPPY";
export const Compression = S.Literal("OFF", "SNAPPY");
export type DataExtraDimensionNodePathList = string[];
export const DataExtraDimensionNodePathList = S.Array(S.String);
export type UpdateCampaignAction = "APPROVE" | "SUSPEND" | "RESUME" | "UPDATE";
export const UpdateCampaignAction = S.Literal(
  "APPROVE",
  "SUSPEND",
  "RESUME",
  "UPDATE",
);
export type ListResponseScope = "METADATA_ONLY";
export const ListResponseScope = S.Literal("METADATA_ONLY");
export type DefaultForUnmappedSignalsType = "CUSTOM_DECODING";
export const DefaultForUnmappedSignalsType = S.Literal("CUSTOM_DECODING");
export type Fqns = string[];
export const Fqns = S.Array(S.String);
export type InterfaceIds = string[];
export const InterfaceIds = S.Array(S.String);
export type ManifestStatus = "ACTIVE" | "DRAFT" | "INVALID" | "VALIDATING";
export const ManifestStatus = S.Literal(
  "ACTIVE",
  "DRAFT",
  "INVALID",
  "VALIDATING",
);
export type listOfStrings = string[];
export const listOfStrings = S.Array(S.String);
export type NodePaths = string[];
export const NodePaths = S.Array(S.String);
export type SignalNodeType =
  | "SENSOR"
  | "ACTUATOR"
  | "ATTRIBUTE"
  | "BRANCH"
  | "CUSTOM_STRUCT"
  | "CUSTOM_PROPERTY";
export const SignalNodeType = S.Literal(
  "SENSOR",
  "ACTUATOR",
  "ATTRIBUTE",
  "BRANCH",
  "CUSTOM_STRUCT",
  "CUSTOM_PROPERTY",
);
export type StateTemplateProperties = string[];
export const StateTemplateProperties = S.Array(S.String);
export type StateTemplateDataExtraDimensionNodePathList = string[];
export const StateTemplateDataExtraDimensionNodePathList = S.Array(S.String);
export type StateTemplateMetadataExtraDimensionNodePathList = string[];
export const StateTemplateMetadataExtraDimensionNodePathList = S.Array(
  S.String,
);
export type VehicleAssociationBehavior =
  | "CreateIotThing"
  | "ValidateIotThingExists";
export const VehicleAssociationBehavior = S.Literal(
  "CreateIotThing",
  "ValidateIotThingExists",
);
export type UpdateMode = "Overwrite" | "Merge";
export const UpdateMode = S.Literal("Overwrite", "Merge");
export type StateTemplateAssociationIdentifiers = string[];
export const StateTemplateAssociationIdentifiers = S.Array(S.String);
export type attributeNamesList = string[];
export const attributeNamesList = S.Array(S.String);
export type attributeValuesList = string[];
export const attributeValuesList = S.Array(S.String);
export interface GetEncryptionConfigurationResponse {
  kmsKeyId?: string;
  encryptionStatus: EncryptionStatus;
  encryptionType: EncryptionType;
  errorMessage?: string;
  creationTime?: Date;
  lastModificationTime?: Date;
}
export const GetEncryptionConfigurationResponse = S.suspend(() =>
  S.Struct({
    kmsKeyId: S.optional(S.String),
    encryptionStatus: EncryptionStatus,
    encryptionType: EncryptionType,
    errorMessage: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetEncryptionConfigurationResponse",
}) as any as S.Schema<GetEncryptionConfigurationResponse>;
export interface GetVehicleStatusRequest {
  nextToken?: string;
  maxResults?: number;
  vehicleName: string;
}
export const GetVehicleStatusRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vehicles/{vehicleName}/status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVehicleStatusRequest",
}) as any as S.Schema<GetVehicleStatusRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
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
export interface PutEncryptionConfigurationRequest {
  kmsKeyId?: string;
  encryptionType: EncryptionType;
}
export const PutEncryptionConfigurationRequest = S.suspend(() =>
  S.Struct({
    kmsKeyId: S.optional(S.String),
    encryptionType: EncryptionType,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/encryptionConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEncryptionConfigurationRequest",
}) as any as S.Schema<PutEncryptionConfigurationRequest>;
export type LogType = "OFF" | "ERROR";
export const LogType = S.Literal("OFF", "ERROR");
export interface CloudWatchLogDeliveryOptions {
  logType: LogType;
  logGroupName?: string;
}
export const CloudWatchLogDeliveryOptions = S.suspend(() =>
  S.Struct({ logType: LogType, logGroupName: S.optional(S.String) }),
).annotations({
  identifier: "CloudWatchLogDeliveryOptions",
}) as any as S.Schema<CloudWatchLogDeliveryOptions>;
export interface PutLoggingOptionsRequest {
  cloudWatchLogDelivery: CloudWatchLogDeliveryOptions;
}
export const PutLoggingOptionsRequest = S.suspend(() =>
  S.Struct({ cloudWatchLogDelivery: CloudWatchLogDeliveryOptions }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/loggingOptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLoggingOptionsRequest",
}) as any as S.Schema<PutLoggingOptionsRequest>;
export interface PutLoggingOptionsResponse {}
export const PutLoggingOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutLoggingOptionsResponse",
}) as any as S.Schema<PutLoggingOptionsResponse>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceARN: S.String.pipe(T.HttpQuery("resourceArn")),
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
export interface GetCampaignRequest {
  name: string;
}
export const GetCampaignRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/campaigns/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCampaignRequest",
}) as any as S.Schema<GetCampaignRequest>;
export interface UpdateCampaignRequest {
  name: string;
  description?: string;
  dataExtraDimensions?: string[];
  action: UpdateCampaignAction;
}
export const UpdateCampaignRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    dataExtraDimensions: S.optional(DataExtraDimensionNodePathList),
    action: UpdateCampaignAction,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/campaigns/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignRequest",
}) as any as S.Schema<UpdateCampaignRequest>;
export interface DeleteCampaignRequest {
  name: string;
}
export const DeleteCampaignRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/campaigns/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCampaignRequest",
}) as any as S.Schema<DeleteCampaignRequest>;
export interface ListCampaignsRequest {
  nextToken?: string;
  maxResults?: number;
  status?: string;
  listResponseScope?: ListResponseScope;
}
export const ListCampaignsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    listResponseScope: S.optional(ListResponseScope).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/campaigns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCampaignsRequest",
}) as any as S.Schema<ListCampaignsRequest>;
export interface GetDecoderManifestRequest {
  name: string;
}
export const GetDecoderManifestRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/decoder-manifests/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDecoderManifestRequest",
}) as any as S.Schema<GetDecoderManifestRequest>;
export type SignalDecoderType =
  | "CAN_SIGNAL"
  | "OBD_SIGNAL"
  | "MESSAGE_SIGNAL"
  | "CUSTOM_DECODING_SIGNAL";
export const SignalDecoderType = S.Literal(
  "CAN_SIGNAL",
  "OBD_SIGNAL",
  "MESSAGE_SIGNAL",
  "CUSTOM_DECODING_SIGNAL",
);
export type SignalValueType = "INTEGER" | "FLOATING_POINT";
export const SignalValueType = S.Literal("INTEGER", "FLOATING_POINT");
export interface CanSignal {
  messageId: number;
  isBigEndian: boolean;
  isSigned: boolean;
  startBit: number;
  offset: number;
  factor: number;
  length: number;
  name?: string;
  signalValueType?: SignalValueType;
}
export const CanSignal = S.suspend(() =>
  S.Struct({
    messageId: S.Number,
    isBigEndian: S.Boolean,
    isSigned: S.Boolean,
    startBit: S.Number,
    offset: S.Number,
    factor: S.Number,
    length: S.Number,
    name: S.optional(S.String),
    signalValueType: S.optional(SignalValueType),
  }),
).annotations({ identifier: "CanSignal" }) as any as S.Schema<CanSignal>;
export interface ObdSignal {
  pidResponseLength: number;
  serviceMode: number;
  pid: number;
  scaling: number;
  offset: number;
  startByte: number;
  byteLength: number;
  bitRightShift?: number;
  bitMaskLength?: number;
  isSigned?: boolean;
  signalValueType?: SignalValueType;
}
export const ObdSignal = S.suspend(() =>
  S.Struct({
    pidResponseLength: S.Number,
    serviceMode: S.Number,
    pid: S.Number,
    scaling: S.Number,
    offset: S.Number,
    startByte: S.Number,
    byteLength: S.Number,
    bitRightShift: S.optional(S.Number),
    bitMaskLength: S.optional(S.Number),
    isSigned: S.optional(S.Boolean),
    signalValueType: S.optional(SignalValueType),
  }),
).annotations({ identifier: "ObdSignal" }) as any as S.Schema<ObdSignal>;
export type ROS2PrimitiveType =
  | "BOOL"
  | "BYTE"
  | "CHAR"
  | "FLOAT32"
  | "FLOAT64"
  | "INT8"
  | "UINT8"
  | "INT16"
  | "UINT16"
  | "INT32"
  | "UINT32"
  | "INT64"
  | "UINT64"
  | "STRING"
  | "WSTRING";
export const ROS2PrimitiveType = S.Literal(
  "BOOL",
  "BYTE",
  "CHAR",
  "FLOAT32",
  "FLOAT64",
  "INT8",
  "UINT8",
  "INT16",
  "UINT16",
  "INT32",
  "UINT32",
  "INT64",
  "UINT64",
  "STRING",
  "WSTRING",
);
export interface ROS2PrimitiveMessageDefinition {
  primitiveType: ROS2PrimitiveType;
  offset?: number;
  scaling?: number;
  upperBound?: number;
}
export const ROS2PrimitiveMessageDefinition = S.suspend(() =>
  S.Struct({
    primitiveType: ROS2PrimitiveType,
    offset: S.optional(S.Number),
    scaling: S.optional(S.Number),
    upperBound: S.optional(S.Number),
  }),
).annotations({
  identifier: "ROS2PrimitiveMessageDefinition",
}) as any as S.Schema<ROS2PrimitiveMessageDefinition>;
export type PrimitiveMessageDefinition = {
  ros2PrimitiveMessageDefinition: ROS2PrimitiveMessageDefinition;
};
export const PrimitiveMessageDefinition = S.Union(
  S.Struct({ ros2PrimitiveMessageDefinition: ROS2PrimitiveMessageDefinition }),
);
export type StructuredMessage =
  | { primitiveMessageDefinition: PrimitiveMessageDefinition }
  | { structuredMessageListDefinition: StructuredMessageListDefinition }
  | {
      structuredMessageDefinition: StructuredMessageFieldNameAndDataTypePair[];
    };
export const StructuredMessage = S.Union(
  S.Struct({ primitiveMessageDefinition: PrimitiveMessageDefinition }),
  S.Struct({
    structuredMessageListDefinition: S.suspend(
      (): S.Schema<StructuredMessageListDefinition, any> =>
        StructuredMessageListDefinition,
    ).annotations({ identifier: "StructuredMessageListDefinition" }),
  }),
  S.Struct({
    structuredMessageDefinition: S.suspend(
      () => StructuredMessageDefinition,
    ).annotations({ identifier: "StructuredMessageDefinition" }),
  }),
) as any as S.Schema<StructuredMessage>;
export interface MessageSignal {
  topicName: string;
  structuredMessage: StructuredMessage;
}
export const MessageSignal = S.suspend(() =>
  S.Struct({ topicName: S.String, structuredMessage: StructuredMessage }),
).annotations({
  identifier: "MessageSignal",
}) as any as S.Schema<MessageSignal>;
export interface CustomDecodingSignal {
  id: string;
}
export const CustomDecodingSignal = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "CustomDecodingSignal",
}) as any as S.Schema<CustomDecodingSignal>;
export interface SignalDecoder {
  fullyQualifiedName: string;
  type: SignalDecoderType;
  interfaceId: string;
  canSignal?: CanSignal;
  obdSignal?: ObdSignal;
  messageSignal?: MessageSignal;
  customDecodingSignal?: CustomDecodingSignal;
}
export const SignalDecoder = S.suspend(() =>
  S.Struct({
    fullyQualifiedName: S.String,
    type: SignalDecoderType,
    interfaceId: S.String,
    canSignal: S.optional(CanSignal),
    obdSignal: S.optional(ObdSignal),
    messageSignal: S.optional(MessageSignal),
    customDecodingSignal: S.optional(CustomDecodingSignal),
  }),
).annotations({
  identifier: "SignalDecoder",
}) as any as S.Schema<SignalDecoder>;
export type SignalDecoders = SignalDecoder[];
export const SignalDecoders = S.Array(SignalDecoder);
export type NetworkInterfaceType =
  | "CAN_INTERFACE"
  | "OBD_INTERFACE"
  | "VEHICLE_MIDDLEWARE"
  | "CUSTOM_DECODING_INTERFACE";
export const NetworkInterfaceType = S.Literal(
  "CAN_INTERFACE",
  "OBD_INTERFACE",
  "VEHICLE_MIDDLEWARE",
  "CUSTOM_DECODING_INTERFACE",
);
export interface CanInterface {
  name: string;
  protocolName?: string;
  protocolVersion?: string;
}
export const CanInterface = S.suspend(() =>
  S.Struct({
    name: S.String,
    protocolName: S.optional(S.String),
    protocolVersion: S.optional(S.String),
  }),
).annotations({ identifier: "CanInterface" }) as any as S.Schema<CanInterface>;
export interface ObdInterface {
  name: string;
  requestMessageId: number;
  obdStandard?: string;
  pidRequestIntervalSeconds?: number;
  dtcRequestIntervalSeconds?: number;
  useExtendedIds?: boolean;
  hasTransmissionEcu?: boolean;
}
export const ObdInterface = S.suspend(() =>
  S.Struct({
    name: S.String,
    requestMessageId: S.Number,
    obdStandard: S.optional(S.String),
    pidRequestIntervalSeconds: S.optional(S.Number),
    dtcRequestIntervalSeconds: S.optional(S.Number),
    useExtendedIds: S.optional(S.Boolean),
    hasTransmissionEcu: S.optional(S.Boolean),
  }),
).annotations({ identifier: "ObdInterface" }) as any as S.Schema<ObdInterface>;
export type VehicleMiddlewareProtocol = "ROS_2";
export const VehicleMiddlewareProtocol = S.Literal("ROS_2");
export interface VehicleMiddleware {
  name: string;
  protocolName: VehicleMiddlewareProtocol;
}
export const VehicleMiddleware = S.suspend(() =>
  S.Struct({ name: S.String, protocolName: VehicleMiddlewareProtocol }),
).annotations({
  identifier: "VehicleMiddleware",
}) as any as S.Schema<VehicleMiddleware>;
export interface CustomDecodingInterface {
  name: string;
}
export const CustomDecodingInterface = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({
  identifier: "CustomDecodingInterface",
}) as any as S.Schema<CustomDecodingInterface>;
export interface NetworkInterface {
  interfaceId: string;
  type: NetworkInterfaceType;
  canInterface?: CanInterface;
  obdInterface?: ObdInterface;
  vehicleMiddleware?: VehicleMiddleware;
  customDecodingInterface?: CustomDecodingInterface;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    interfaceId: S.String,
    type: NetworkInterfaceType,
    canInterface: S.optional(CanInterface),
    obdInterface: S.optional(ObdInterface),
    vehicleMiddleware: S.optional(VehicleMiddleware),
    customDecodingInterface: S.optional(CustomDecodingInterface),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaces = NetworkInterface[];
export const NetworkInterfaces = S.Array(NetworkInterface);
export interface UpdateDecoderManifestRequest {
  name: string;
  description?: string;
  signalDecodersToAdd?: SignalDecoder[];
  signalDecodersToUpdate?: SignalDecoder[];
  signalDecodersToRemove?: string[];
  networkInterfacesToAdd?: NetworkInterface[];
  networkInterfacesToUpdate?: NetworkInterface[];
  networkInterfacesToRemove?: string[];
  status?: ManifestStatus;
  defaultForUnmappedSignals?: DefaultForUnmappedSignalsType;
}
export const UpdateDecoderManifestRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    signalDecodersToAdd: S.optional(SignalDecoders),
    signalDecodersToUpdate: S.optional(SignalDecoders),
    signalDecodersToRemove: S.optional(Fqns),
    networkInterfacesToAdd: S.optional(NetworkInterfaces),
    networkInterfacesToUpdate: S.optional(NetworkInterfaces),
    networkInterfacesToRemove: S.optional(InterfaceIds),
    status: S.optional(ManifestStatus),
    defaultForUnmappedSignals: S.optional(DefaultForUnmappedSignalsType),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/decoder-manifests/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDecoderManifestRequest",
}) as any as S.Schema<UpdateDecoderManifestRequest>;
export interface DeleteDecoderManifestRequest {
  name: string;
}
export const DeleteDecoderManifestRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/decoder-manifests/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDecoderManifestRequest",
}) as any as S.Schema<DeleteDecoderManifestRequest>;
export interface ListDecoderManifestsRequest {
  modelManifestArn?: string;
  nextToken?: string;
  maxResults?: number;
  listResponseScope?: ListResponseScope;
}
export const ListDecoderManifestsRequest = S.suspend(() =>
  S.Struct({
    modelManifestArn: S.optional(S.String).pipe(
      T.HttpQuery("modelManifestArn"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    listResponseScope: S.optional(ListResponseScope).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/decoder-manifests" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDecoderManifestsRequest",
}) as any as S.Schema<ListDecoderManifestsRequest>;
export interface ListDecoderManifestNetworkInterfacesRequest {
  name: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDecoderManifestNetworkInterfacesRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/decoder-manifests/{name}/network-interfaces",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDecoderManifestNetworkInterfacesRequest",
}) as any as S.Schema<ListDecoderManifestNetworkInterfacesRequest>;
export interface ListDecoderManifestSignalsRequest {
  name: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDecoderManifestSignalsRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/decoder-manifests/{name}/signals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDecoderManifestSignalsRequest",
}) as any as S.Schema<ListDecoderManifestSignalsRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateFleetRequest {
  fleetId: string;
  description?: string;
  signalCatalogArn: string;
  tags?: Tag[];
}
export const CreateFleetRequest = S.suspend(() =>
  S.Struct({
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    description: S.optional(S.String),
    signalCatalogArn: S.String,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/fleets/{fleetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFleetRequest",
}) as any as S.Schema<CreateFleetRequest>;
export interface GetFleetRequest {
  fleetId: string;
}
export const GetFleetRequest = S.suspend(() =>
  S.Struct({ fleetId: S.String.pipe(T.HttpLabel("fleetId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/fleets/{fleetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFleetRequest",
}) as any as S.Schema<GetFleetRequest>;
export interface UpdateFleetRequest {
  fleetId: string;
  description?: string;
}
export const UpdateFleetRequest = S.suspend(() =>
  S.Struct({
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/fleets/{fleetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFleetRequest",
}) as any as S.Schema<UpdateFleetRequest>;
export interface DeleteFleetRequest {
  fleetId: string;
}
export const DeleteFleetRequest = S.suspend(() =>
  S.Struct({ fleetId: S.String.pipe(T.HttpLabel("fleetId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/fleets/{fleetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFleetRequest",
}) as any as S.Schema<DeleteFleetRequest>;
export interface ListFleetsRequest {
  nextToken?: string;
  maxResults?: number;
  listResponseScope?: ListResponseScope;
}
export const ListFleetsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    listResponseScope: S.optional(ListResponseScope).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/fleets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFleetsRequest",
}) as any as S.Schema<ListFleetsRequest>;
export interface ListVehiclesInFleetRequest {
  fleetId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListVehiclesInFleetRequest = S.suspend(() =>
  S.Struct({
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/fleets/{fleetId}/vehicles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVehiclesInFleetRequest",
}) as any as S.Schema<ListVehiclesInFleetRequest>;
export interface CreateModelManifestRequest {
  name: string;
  description?: string;
  nodes: string[];
  signalCatalogArn: string;
  tags?: Tag[];
}
export const CreateModelManifestRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    nodes: listOfStrings,
    signalCatalogArn: S.String,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/model-manifests/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateModelManifestRequest",
}) as any as S.Schema<CreateModelManifestRequest>;
export interface GetModelManifestRequest {
  name: string;
}
export const GetModelManifestRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-manifests/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetModelManifestRequest",
}) as any as S.Schema<GetModelManifestRequest>;
export interface UpdateModelManifestRequest {
  name: string;
  description?: string;
  nodesToAdd?: string[];
  nodesToRemove?: string[];
  status?: ManifestStatus;
}
export const UpdateModelManifestRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    nodesToAdd: S.optional(NodePaths),
    nodesToRemove: S.optional(NodePaths),
    status: S.optional(ManifestStatus),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/model-manifests/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateModelManifestRequest",
}) as any as S.Schema<UpdateModelManifestRequest>;
export interface DeleteModelManifestRequest {
  name: string;
}
export const DeleteModelManifestRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/model-manifests/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteModelManifestRequest",
}) as any as S.Schema<DeleteModelManifestRequest>;
export interface ListModelManifestsRequest {
  signalCatalogArn?: string;
  nextToken?: string;
  maxResults?: number;
  listResponseScope?: ListResponseScope;
}
export const ListModelManifestsRequest = S.suspend(() =>
  S.Struct({
    signalCatalogArn: S.optional(S.String).pipe(
      T.HttpQuery("signalCatalogArn"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    listResponseScope: S.optional(ListResponseScope).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-manifests" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListModelManifestsRequest",
}) as any as S.Schema<ListModelManifestsRequest>;
export interface ListModelManifestNodesRequest {
  name: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListModelManifestNodesRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-manifests/{name}/nodes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListModelManifestNodesRequest",
}) as any as S.Schema<ListModelManifestNodesRequest>;
export interface GetSignalCatalogRequest {
  name: string;
}
export const GetSignalCatalogRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/signal-catalogs/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSignalCatalogRequest",
}) as any as S.Schema<GetSignalCatalogRequest>;
export interface Branch {
  fullyQualifiedName: string;
  description?: string;
  deprecationMessage?: string;
  comment?: string;
}
export const Branch = S.suspend(() =>
  S.Struct({
    fullyQualifiedName: S.String,
    description: S.optional(S.String),
    deprecationMessage: S.optional(S.String),
    comment: S.optional(S.String),
  }),
).annotations({ identifier: "Branch" }) as any as S.Schema<Branch>;
export type NodeDataType =
  | "INT8"
  | "UINT8"
  | "INT16"
  | "UINT16"
  | "INT32"
  | "UINT32"
  | "INT64"
  | "UINT64"
  | "BOOLEAN"
  | "FLOAT"
  | "DOUBLE"
  | "STRING"
  | "UNIX_TIMESTAMP"
  | "INT8_ARRAY"
  | "UINT8_ARRAY"
  | "INT16_ARRAY"
  | "UINT16_ARRAY"
  | "INT32_ARRAY"
  | "UINT32_ARRAY"
  | "INT64_ARRAY"
  | "UINT64_ARRAY"
  | "BOOLEAN_ARRAY"
  | "FLOAT_ARRAY"
  | "DOUBLE_ARRAY"
  | "STRING_ARRAY"
  | "UNIX_TIMESTAMP_ARRAY"
  | "UNKNOWN"
  | "STRUCT"
  | "STRUCT_ARRAY";
export const NodeDataType = S.Literal(
  "INT8",
  "UINT8",
  "INT16",
  "UINT16",
  "INT32",
  "UINT32",
  "INT64",
  "UINT64",
  "BOOLEAN",
  "FLOAT",
  "DOUBLE",
  "STRING",
  "UNIX_TIMESTAMP",
  "INT8_ARRAY",
  "UINT8_ARRAY",
  "INT16_ARRAY",
  "UINT16_ARRAY",
  "INT32_ARRAY",
  "UINT32_ARRAY",
  "INT64_ARRAY",
  "UINT64_ARRAY",
  "BOOLEAN_ARRAY",
  "FLOAT_ARRAY",
  "DOUBLE_ARRAY",
  "STRING_ARRAY",
  "UNIX_TIMESTAMP_ARRAY",
  "UNKNOWN",
  "STRUCT",
  "STRUCT_ARRAY",
);
export interface Sensor {
  fullyQualifiedName: string;
  dataType: NodeDataType;
  description?: string;
  unit?: string;
  allowedValues?: string[];
  min?: number;
  max?: number;
  deprecationMessage?: string;
  comment?: string;
  structFullyQualifiedName?: string;
}
export const Sensor = S.suspend(() =>
  S.Struct({
    fullyQualifiedName: S.String,
    dataType: NodeDataType,
    description: S.optional(S.String),
    unit: S.optional(S.String),
    allowedValues: S.optional(listOfStrings),
    min: S.optional(S.Number),
    max: S.optional(S.Number),
    deprecationMessage: S.optional(S.String),
    comment: S.optional(S.String),
    structFullyQualifiedName: S.optional(S.String),
  }),
).annotations({ identifier: "Sensor" }) as any as S.Schema<Sensor>;
export interface Actuator {
  fullyQualifiedName: string;
  dataType: NodeDataType;
  description?: string;
  unit?: string;
  allowedValues?: string[];
  min?: number;
  max?: number;
  assignedValue?: string;
  deprecationMessage?: string;
  comment?: string;
  structFullyQualifiedName?: string;
}
export const Actuator = S.suspend(() =>
  S.Struct({
    fullyQualifiedName: S.String,
    dataType: NodeDataType,
    description: S.optional(S.String),
    unit: S.optional(S.String),
    allowedValues: S.optional(listOfStrings),
    min: S.optional(S.Number),
    max: S.optional(S.Number),
    assignedValue: S.optional(S.String),
    deprecationMessage: S.optional(S.String),
    comment: S.optional(S.String),
    structFullyQualifiedName: S.optional(S.String),
  }),
).annotations({ identifier: "Actuator" }) as any as S.Schema<Actuator>;
export interface Attribute {
  fullyQualifiedName: string;
  dataType: NodeDataType;
  description?: string;
  unit?: string;
  allowedValues?: string[];
  min?: number;
  max?: number;
  assignedValue?: string;
  defaultValue?: string;
  deprecationMessage?: string;
  comment?: string;
}
export const Attribute = S.suspend(() =>
  S.Struct({
    fullyQualifiedName: S.String,
    dataType: NodeDataType,
    description: S.optional(S.String),
    unit: S.optional(S.String),
    allowedValues: S.optional(listOfStrings),
    min: S.optional(S.Number),
    max: S.optional(S.Number),
    assignedValue: S.optional(S.String),
    defaultValue: S.optional(S.String),
    deprecationMessage: S.optional(S.String),
    comment: S.optional(S.String),
  }),
).annotations({ identifier: "Attribute" }) as any as S.Schema<Attribute>;
export interface CustomStruct {
  fullyQualifiedName: string;
  description?: string;
  deprecationMessage?: string;
  comment?: string;
}
export const CustomStruct = S.suspend(() =>
  S.Struct({
    fullyQualifiedName: S.String,
    description: S.optional(S.String),
    deprecationMessage: S.optional(S.String),
    comment: S.optional(S.String),
  }),
).annotations({ identifier: "CustomStruct" }) as any as S.Schema<CustomStruct>;
export type NodeDataEncoding = "BINARY" | "TYPED";
export const NodeDataEncoding = S.Literal("BINARY", "TYPED");
export interface CustomProperty {
  fullyQualifiedName: string;
  dataType: NodeDataType;
  dataEncoding?: NodeDataEncoding;
  description?: string;
  deprecationMessage?: string;
  comment?: string;
  structFullyQualifiedName?: string;
}
export const CustomProperty = S.suspend(() =>
  S.Struct({
    fullyQualifiedName: S.String,
    dataType: NodeDataType,
    dataEncoding: S.optional(NodeDataEncoding),
    description: S.optional(S.String),
    deprecationMessage: S.optional(S.String),
    comment: S.optional(S.String),
    structFullyQualifiedName: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomProperty",
}) as any as S.Schema<CustomProperty>;
export type Node =
  | { branch: Branch }
  | { sensor: Sensor }
  | { actuator: Actuator }
  | { attribute: Attribute }
  | { struct: CustomStruct }
  | { property: CustomProperty };
export const Node = S.Union(
  S.Struct({ branch: Branch }),
  S.Struct({ sensor: Sensor }),
  S.Struct({ actuator: Actuator }),
  S.Struct({ attribute: Attribute }),
  S.Struct({ struct: CustomStruct }),
  S.Struct({ property: CustomProperty }),
);
export type Nodes = Node[];
export const Nodes = S.Array(Node);
export interface UpdateSignalCatalogRequest {
  name: string;
  description?: string;
  nodesToAdd?: Node[];
  nodesToUpdate?: Node[];
  nodesToRemove?: string[];
}
export const UpdateSignalCatalogRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    nodesToAdd: S.optional(Nodes),
    nodesToUpdate: S.optional(Nodes),
    nodesToRemove: S.optional(NodePaths),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/signal-catalogs/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSignalCatalogRequest",
}) as any as S.Schema<UpdateSignalCatalogRequest>;
export interface DeleteSignalCatalogRequest {
  name: string;
}
export const DeleteSignalCatalogRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/signal-catalogs/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSignalCatalogRequest",
}) as any as S.Schema<DeleteSignalCatalogRequest>;
export interface ListSignalCatalogsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListSignalCatalogsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/signal-catalogs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSignalCatalogsRequest",
}) as any as S.Schema<ListSignalCatalogsRequest>;
export interface ListSignalCatalogNodesRequest {
  name: string;
  nextToken?: string;
  maxResults?: number;
  signalNodeType?: SignalNodeType;
}
export const ListSignalCatalogNodesRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    signalNodeType: S.optional(SignalNodeType).pipe(
      T.HttpQuery("signalNodeType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/signal-catalogs/{name}/nodes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSignalCatalogNodesRequest",
}) as any as S.Schema<ListSignalCatalogNodesRequest>;
export interface CreateStateTemplateRequest {
  name: string;
  description?: string;
  signalCatalogArn: string;
  stateTemplateProperties: string[];
  dataExtraDimensions?: string[];
  metadataExtraDimensions?: string[];
  tags?: Tag[];
}
export const CreateStateTemplateRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    signalCatalogArn: S.String,
    stateTemplateProperties: StateTemplateProperties,
    dataExtraDimensions: S.optional(
      StateTemplateDataExtraDimensionNodePathList,
    ),
    metadataExtraDimensions: S.optional(
      StateTemplateMetadataExtraDimensionNodePathList,
    ),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/state-templates/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStateTemplateRequest",
}) as any as S.Schema<CreateStateTemplateRequest>;
export interface GetStateTemplateRequest {
  identifier: string;
}
export const GetStateTemplateRequest = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/state-templates/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStateTemplateRequest",
}) as any as S.Schema<GetStateTemplateRequest>;
export interface UpdateStateTemplateRequest {
  identifier: string;
  description?: string;
  stateTemplatePropertiesToAdd?: string[];
  stateTemplatePropertiesToRemove?: string[];
  dataExtraDimensions?: string[];
  metadataExtraDimensions?: string[];
}
export const UpdateStateTemplateRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    description: S.optional(S.String),
    stateTemplatePropertiesToAdd: S.optional(StateTemplateProperties),
    stateTemplatePropertiesToRemove: S.optional(StateTemplateProperties),
    dataExtraDimensions: S.optional(
      StateTemplateDataExtraDimensionNodePathList,
    ),
    metadataExtraDimensions: S.optional(
      StateTemplateMetadataExtraDimensionNodePathList,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/state-templates/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateStateTemplateRequest",
}) as any as S.Schema<UpdateStateTemplateRequest>;
export interface DeleteStateTemplateRequest {
  identifier: string;
}
export const DeleteStateTemplateRequest = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/state-templates/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteStateTemplateRequest",
}) as any as S.Schema<DeleteStateTemplateRequest>;
export interface ListStateTemplatesRequest {
  nextToken?: string;
  maxResults?: number;
  listResponseScope?: ListResponseScope;
}
export const ListStateTemplatesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    listResponseScope: S.optional(ListResponseScope).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/state-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStateTemplatesRequest",
}) as any as S.Schema<ListStateTemplatesRequest>;
export interface GetVehicleRequest {
  vehicleName: string;
}
export const GetVehicleRequest = S.suspend(() =>
  S.Struct({ vehicleName: S.String.pipe(T.HttpLabel("vehicleName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vehicles/{vehicleName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVehicleRequest",
}) as any as S.Schema<GetVehicleRequest>;
export type attributesMap = { [key: string]: string };
export const attributesMap = S.Record({ key: S.String, value: S.String });
export type TimeUnit = "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR";
export const TimeUnit = S.Literal("MILLISECOND", "SECOND", "MINUTE", "HOUR");
export interface TimePeriod {
  unit: TimeUnit;
  value: number;
}
export const TimePeriod = S.suspend(() =>
  S.Struct({ unit: TimeUnit, value: S.Number }),
).annotations({ identifier: "TimePeriod" }) as any as S.Schema<TimePeriod>;
export interface PeriodicStateTemplateUpdateStrategy {
  stateTemplateUpdateRate: TimePeriod;
}
export const PeriodicStateTemplateUpdateStrategy = S.suspend(() =>
  S.Struct({ stateTemplateUpdateRate: TimePeriod }),
).annotations({
  identifier: "PeriodicStateTemplateUpdateStrategy",
}) as any as S.Schema<PeriodicStateTemplateUpdateStrategy>;
export interface OnChangeStateTemplateUpdateStrategy {}
export const OnChangeStateTemplateUpdateStrategy = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "OnChangeStateTemplateUpdateStrategy",
}) as any as S.Schema<OnChangeStateTemplateUpdateStrategy>;
export type StateTemplateUpdateStrategy =
  | { periodic: PeriodicStateTemplateUpdateStrategy }
  | { onChange: OnChangeStateTemplateUpdateStrategy };
export const StateTemplateUpdateStrategy = S.Union(
  S.Struct({ periodic: PeriodicStateTemplateUpdateStrategy }),
  S.Struct({ onChange: OnChangeStateTemplateUpdateStrategy }),
);
export interface StateTemplateAssociation {
  identifier: string;
  stateTemplateUpdateStrategy: StateTemplateUpdateStrategy;
}
export const StateTemplateAssociation = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    stateTemplateUpdateStrategy: StateTemplateUpdateStrategy,
  }),
).annotations({
  identifier: "StateTemplateAssociation",
}) as any as S.Schema<StateTemplateAssociation>;
export type StateTemplateAssociations = StateTemplateAssociation[];
export const StateTemplateAssociations = S.Array(StateTemplateAssociation);
export interface UpdateVehicleRequest {
  vehicleName: string;
  modelManifestArn?: string;
  decoderManifestArn?: string;
  attributes?: { [key: string]: string };
  attributeUpdateMode?: UpdateMode;
  stateTemplatesToAdd?: StateTemplateAssociation[];
  stateTemplatesToRemove?: string[];
  stateTemplatesToUpdate?: StateTemplateAssociation[];
}
export const UpdateVehicleRequest = S.suspend(() =>
  S.Struct({
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
    modelManifestArn: S.optional(S.String),
    decoderManifestArn: S.optional(S.String),
    attributes: S.optional(attributesMap),
    attributeUpdateMode: S.optional(UpdateMode),
    stateTemplatesToAdd: S.optional(StateTemplateAssociations),
    stateTemplatesToRemove: S.optional(StateTemplateAssociationIdentifiers),
    stateTemplatesToUpdate: S.optional(StateTemplateAssociations),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/vehicles/{vehicleName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVehicleRequest",
}) as any as S.Schema<UpdateVehicleRequest>;
export interface DeleteVehicleRequest {
  vehicleName: string;
}
export const DeleteVehicleRequest = S.suspend(() =>
  S.Struct({ vehicleName: S.String.pipe(T.HttpLabel("vehicleName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/vehicles/{vehicleName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVehicleRequest",
}) as any as S.Schema<DeleteVehicleRequest>;
export interface ListVehiclesRequest {
  modelManifestArn?: string;
  attributeNames?: string[];
  attributeValues?: string[];
  nextToken?: string;
  maxResults?: number;
  listResponseScope?: ListResponseScope;
}
export const ListVehiclesRequest = S.suspend(() =>
  S.Struct({
    modelManifestArn: S.optional(S.String).pipe(
      T.HttpQuery("modelManifestArn"),
    ),
    attributeNames: S.optional(attributeNamesList).pipe(
      T.HttpQuery("attributeNames"),
    ),
    attributeValues: S.optional(attributeValuesList).pipe(
      T.HttpQuery("attributeValues"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    listResponseScope: S.optional(ListResponseScope).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vehicles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVehiclesRequest",
}) as any as S.Schema<ListVehiclesRequest>;
export interface AssociateVehicleFleetRequest {
  vehicleName: string;
  fleetId: string;
}
export const AssociateVehicleFleetRequest = S.suspend(() =>
  S.Struct({
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
    fleetId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/vehicles/{vehicleName}/associate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateVehicleFleetRequest",
}) as any as S.Schema<AssociateVehicleFleetRequest>;
export interface AssociateVehicleFleetResponse {}
export const AssociateVehicleFleetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateVehicleFleetResponse",
}) as any as S.Schema<AssociateVehicleFleetResponse>;
export interface DisassociateVehicleFleetRequest {
  vehicleName: string;
  fleetId: string;
}
export const DisassociateVehicleFleetRequest = S.suspend(() =>
  S.Struct({
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
    fleetId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/vehicles/{vehicleName}/disassociate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateVehicleFleetRequest",
}) as any as S.Schema<DisassociateVehicleFleetRequest>;
export interface DisassociateVehicleFleetResponse {}
export const DisassociateVehicleFleetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateVehicleFleetResponse",
}) as any as S.Schema<DisassociateVehicleFleetResponse>;
export interface ListFleetsForVehicleRequest {
  vehicleName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListFleetsForVehicleRequest = S.suspend(() =>
  S.Struct({
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vehicles/{vehicleName}/fleets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFleetsForVehicleRequest",
}) as any as S.Schema<ListFleetsForVehicleRequest>;
export type EventExpressionList = string | redacted.Redacted<string>[];
export const EventExpressionList = S.Array(SensitiveString);
export interface CreateVehicleRequestItem {
  vehicleName: string;
  modelManifestArn: string;
  decoderManifestArn: string;
  attributes?: { [key: string]: string };
  associationBehavior?: VehicleAssociationBehavior;
  tags?: Tag[];
  stateTemplates?: StateTemplateAssociation[];
}
export const CreateVehicleRequestItem = S.suspend(() =>
  S.Struct({
    vehicleName: S.String,
    modelManifestArn: S.String,
    decoderManifestArn: S.String,
    attributes: S.optional(attributesMap),
    associationBehavior: S.optional(VehicleAssociationBehavior),
    tags: S.optional(TagList),
    stateTemplates: S.optional(StateTemplateAssociations),
  }),
).annotations({
  identifier: "CreateVehicleRequestItem",
}) as any as S.Schema<CreateVehicleRequestItem>;
export type createVehicleRequestItems = CreateVehicleRequestItem[];
export const createVehicleRequestItems = S.Array(CreateVehicleRequestItem);
export interface UpdateVehicleRequestItem {
  vehicleName: string;
  modelManifestArn?: string;
  decoderManifestArn?: string;
  attributes?: { [key: string]: string };
  attributeUpdateMode?: UpdateMode;
  stateTemplatesToAdd?: StateTemplateAssociation[];
  stateTemplatesToRemove?: string[];
  stateTemplatesToUpdate?: StateTemplateAssociation[];
}
export const UpdateVehicleRequestItem = S.suspend(() =>
  S.Struct({
    vehicleName: S.String,
    modelManifestArn: S.optional(S.String),
    decoderManifestArn: S.optional(S.String),
    attributes: S.optional(attributesMap),
    attributeUpdateMode: S.optional(UpdateMode),
    stateTemplatesToAdd: S.optional(StateTemplateAssociations),
    stateTemplatesToRemove: S.optional(StateTemplateAssociationIdentifiers),
    stateTemplatesToUpdate: S.optional(StateTemplateAssociations),
  }),
).annotations({
  identifier: "UpdateVehicleRequestItem",
}) as any as S.Schema<UpdateVehicleRequestItem>;
export type updateVehicleRequestItems = UpdateVehicleRequestItem[];
export const updateVehicleRequestItems = S.Array(UpdateVehicleRequestItem);
export interface TimestreamRegistrationResponse {
  timestreamDatabaseName: string;
  timestreamTableName: string;
  timestreamDatabaseArn?: string;
  timestreamTableArn?: string;
  registrationStatus: RegistrationStatus;
  errorMessage?: string;
}
export const TimestreamRegistrationResponse = S.suspend(() =>
  S.Struct({
    timestreamDatabaseName: S.String,
    timestreamTableName: S.String,
    timestreamDatabaseArn: S.optional(S.String),
    timestreamTableArn: S.optional(S.String),
    registrationStatus: RegistrationStatus,
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "TimestreamRegistrationResponse",
}) as any as S.Schema<TimestreamRegistrationResponse>;
export interface IamRegistrationResponse {
  roleArn: string;
  registrationStatus: RegistrationStatus;
  errorMessage?: string;
}
export const IamRegistrationResponse = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    registrationStatus: RegistrationStatus,
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "IamRegistrationResponse",
}) as any as S.Schema<IamRegistrationResponse>;
export interface TimestreamResources {
  timestreamDatabaseName: string;
  timestreamTableName: string;
}
export const TimestreamResources = S.suspend(() =>
  S.Struct({ timestreamDatabaseName: S.String, timestreamTableName: S.String }),
).annotations({
  identifier: "TimestreamResources",
}) as any as S.Schema<TimestreamResources>;
export interface IamResources {
  roleArn: string;
}
export const IamResources = S.suspend(() =>
  S.Struct({ roleArn: S.String }),
).annotations({ identifier: "IamResources" }) as any as S.Schema<IamResources>;
export interface SignalInformation {
  name: string;
  maxSampleCount?: number;
  minimumSamplingIntervalMs?: number;
  dataPartitionId?: string;
}
export const SignalInformation = S.suspend(() =>
  S.Struct({
    name: S.String,
    maxSampleCount: S.optional(S.Number),
    minimumSamplingIntervalMs: S.optional(S.Number),
    dataPartitionId: S.optional(S.String),
  }),
).annotations({
  identifier: "SignalInformation",
}) as any as S.Schema<SignalInformation>;
export type SignalInformationList = SignalInformation[];
export const SignalInformationList = S.Array(SignalInformation);
export type CampaignStatus =
  | "CREATING"
  | "WAITING_FOR_APPROVAL"
  | "RUNNING"
  | "SUSPENDED";
export const CampaignStatus = S.Literal(
  "CREATING",
  "WAITING_FOR_APPROVAL",
  "RUNNING",
  "SUSPENDED",
);
export type vehicles = string[];
export const vehicles = S.Array(S.String);
export type FormattedVss = { vssJson: string };
export const FormattedVss = S.Union(S.Struct({ vssJson: S.String }));
export type fleets = string[];
export const fleets = S.Array(S.String);
export type TriggerMode = "ALWAYS" | "RISING_EDGE";
export const TriggerMode = S.Literal("ALWAYS", "RISING_EDGE");
export type DataFormat = "JSON" | "PARQUET";
export const DataFormat = S.Literal("JSON", "PARQUET");
export type StorageCompressionFormat = "NONE" | "GZIP";
export const StorageCompressionFormat = S.Literal("NONE", "GZIP");
export type NetworkFilesList = Uint8Array[];
export const NetworkFilesList = S.Array(T.Blob);
export interface BatchCreateVehicleRequest {
  vehicles: CreateVehicleRequestItem[];
}
export const BatchCreateVehicleRequest = S.suspend(() =>
  S.Struct({ vehicles: createVehicleRequestItems }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/vehicles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateVehicleRequest",
}) as any as S.Schema<BatchCreateVehicleRequest>;
export interface BatchUpdateVehicleRequest {
  vehicles: UpdateVehicleRequestItem[];
}
export const BatchUpdateVehicleRequest = S.suspend(() =>
  S.Struct({ vehicles: updateVehicleRequestItems }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/vehicles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateVehicleRequest",
}) as any as S.Schema<BatchUpdateVehicleRequest>;
export interface GetLoggingOptionsResponse {
  cloudWatchLogDelivery: CloudWatchLogDeliveryOptions;
}
export const GetLoggingOptionsResponse = S.suspend(() =>
  S.Struct({ cloudWatchLogDelivery: CloudWatchLogDeliveryOptions }),
).annotations({
  identifier: "GetLoggingOptionsResponse",
}) as any as S.Schema<GetLoggingOptionsResponse>;
export interface GetRegisterAccountStatusResponse {
  customerAccountId: string;
  accountStatus: RegistrationStatus;
  timestreamRegistrationResponse?: TimestreamRegistrationResponse;
  iamRegistrationResponse: IamRegistrationResponse;
  creationTime: Date;
  lastModificationTime: Date;
}
export const GetRegisterAccountStatusResponse = S.suspend(() =>
  S.Struct({
    customerAccountId: S.String,
    accountStatus: RegistrationStatus,
    timestreamRegistrationResponse: S.optional(TimestreamRegistrationResponse),
    iamRegistrationResponse: IamRegistrationResponse,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetRegisterAccountStatusResponse",
}) as any as S.Schema<GetRegisterAccountStatusResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutEncryptionConfigurationResponse {
  kmsKeyId?: string;
  encryptionStatus: EncryptionStatus;
  encryptionType: EncryptionType;
}
export const PutEncryptionConfigurationResponse = S.suspend(() =>
  S.Struct({
    kmsKeyId: S.optional(S.String),
    encryptionStatus: EncryptionStatus,
    encryptionType: EncryptionType,
  }),
).annotations({
  identifier: "PutEncryptionConfigurationResponse",
}) as any as S.Schema<PutEncryptionConfigurationResponse>;
export interface RegisterAccountRequest {
  timestreamResources?: TimestreamResources;
  iamResources?: IamResources;
}
export const RegisterAccountRequest = S.suspend(() =>
  S.Struct({
    timestreamResources: S.optional(TimestreamResources),
    iamResources: S.optional(IamResources),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/account/registration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterAccountRequest",
}) as any as S.Schema<RegisterAccountRequest>;
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceARN: S.String.pipe(T.HttpQuery("resourceArn")),
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
export interface TimeBasedCollectionScheme {
  periodMs: number;
}
export const TimeBasedCollectionScheme = S.suspend(() =>
  S.Struct({ periodMs: S.Number }),
).annotations({
  identifier: "TimeBasedCollectionScheme",
}) as any as S.Schema<TimeBasedCollectionScheme>;
export interface ConditionBasedCollectionScheme {
  expression: string | redacted.Redacted<string>;
  minimumTriggerIntervalMs?: number;
  triggerMode?: TriggerMode;
  conditionLanguageVersion?: number;
}
export const ConditionBasedCollectionScheme = S.suspend(() =>
  S.Struct({
    expression: SensitiveString,
    minimumTriggerIntervalMs: S.optional(S.Number),
    triggerMode: S.optional(TriggerMode),
    conditionLanguageVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "ConditionBasedCollectionScheme",
}) as any as S.Schema<ConditionBasedCollectionScheme>;
export type CollectionScheme =
  | { timeBasedCollectionScheme: TimeBasedCollectionScheme }
  | { conditionBasedCollectionScheme: ConditionBasedCollectionScheme };
export const CollectionScheme = S.Union(
  S.Struct({ timeBasedCollectionScheme: TimeBasedCollectionScheme }),
  S.Struct({ conditionBasedCollectionScheme: ConditionBasedCollectionScheme }),
);
export interface S3Config {
  bucketArn: string;
  dataFormat?: DataFormat;
  storageCompressionFormat?: StorageCompressionFormat;
  prefix?: string;
}
export const S3Config = S.suspend(() =>
  S.Struct({
    bucketArn: S.String,
    dataFormat: S.optional(DataFormat),
    storageCompressionFormat: S.optional(StorageCompressionFormat),
    prefix: S.optional(S.String),
  }),
).annotations({ identifier: "S3Config" }) as any as S.Schema<S3Config>;
export interface TimestreamConfig {
  timestreamTableArn: string;
  executionRoleArn: string;
}
export const TimestreamConfig = S.suspend(() =>
  S.Struct({ timestreamTableArn: S.String, executionRoleArn: S.String }),
).annotations({
  identifier: "TimestreamConfig",
}) as any as S.Schema<TimestreamConfig>;
export interface MqttTopicConfig {
  mqttTopicArn: string;
  executionRoleArn: string;
}
export const MqttTopicConfig = S.suspend(() =>
  S.Struct({ mqttTopicArn: S.String, executionRoleArn: S.String }),
).annotations({
  identifier: "MqttTopicConfig",
}) as any as S.Schema<MqttTopicConfig>;
export type DataDestinationConfig =
  | { s3Config: S3Config }
  | { timestreamConfig: TimestreamConfig }
  | { mqttTopicConfig: MqttTopicConfig };
export const DataDestinationConfig = S.Union(
  S.Struct({ s3Config: S3Config }),
  S.Struct({ timestreamConfig: TimestreamConfig }),
  S.Struct({ mqttTopicConfig: MqttTopicConfig }),
);
export type DataDestinationConfigs = DataDestinationConfig[];
export const DataDestinationConfigs = S.Array(DataDestinationConfig);
export type StorageMaximumSizeUnit = "MB" | "GB" | "TB";
export const StorageMaximumSizeUnit = S.Literal("MB", "GB", "TB");
export interface StorageMaximumSize {
  unit: StorageMaximumSizeUnit;
  value: number;
}
export const StorageMaximumSize = S.suspend(() =>
  S.Struct({ unit: StorageMaximumSizeUnit, value: S.Number }),
).annotations({
  identifier: "StorageMaximumSize",
}) as any as S.Schema<StorageMaximumSize>;
export type StorageMinimumTimeToLiveUnit = "HOURS" | "DAYS" | "WEEKS";
export const StorageMinimumTimeToLiveUnit = S.Literal("HOURS", "DAYS", "WEEKS");
export interface StorageMinimumTimeToLive {
  unit: StorageMinimumTimeToLiveUnit;
  value: number;
}
export const StorageMinimumTimeToLive = S.suspend(() =>
  S.Struct({ unit: StorageMinimumTimeToLiveUnit, value: S.Number }),
).annotations({
  identifier: "StorageMinimumTimeToLive",
}) as any as S.Schema<StorageMinimumTimeToLive>;
export interface DataPartitionStorageOptions {
  maximumSize: StorageMaximumSize;
  storageLocation: string | redacted.Redacted<string>;
  minimumTimeToLive: StorageMinimumTimeToLive;
}
export const DataPartitionStorageOptions = S.suspend(() =>
  S.Struct({
    maximumSize: StorageMaximumSize,
    storageLocation: SensitiveString,
    minimumTimeToLive: StorageMinimumTimeToLive,
  }),
).annotations({
  identifier: "DataPartitionStorageOptions",
}) as any as S.Schema<DataPartitionStorageOptions>;
export interface DataPartitionUploadOptions {
  expression: string | redacted.Redacted<string>;
  conditionLanguageVersion?: number;
}
export const DataPartitionUploadOptions = S.suspend(() =>
  S.Struct({
    expression: SensitiveString,
    conditionLanguageVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataPartitionUploadOptions",
}) as any as S.Schema<DataPartitionUploadOptions>;
export interface DataPartition {
  id: string;
  storageOptions: DataPartitionStorageOptions;
  uploadOptions?: DataPartitionUploadOptions;
}
export const DataPartition = S.suspend(() =>
  S.Struct({
    id: S.String,
    storageOptions: DataPartitionStorageOptions,
    uploadOptions: S.optional(DataPartitionUploadOptions),
  }),
).annotations({
  identifier: "DataPartition",
}) as any as S.Schema<DataPartition>;
export type DataPartitions = DataPartition[];
export const DataPartitions = S.Array(DataPartition);
export interface TimeBasedSignalFetchConfig {
  executionFrequencyMs: number;
}
export const TimeBasedSignalFetchConfig = S.suspend(() =>
  S.Struct({ executionFrequencyMs: S.Number }),
).annotations({
  identifier: "TimeBasedSignalFetchConfig",
}) as any as S.Schema<TimeBasedSignalFetchConfig>;
export interface ConditionBasedSignalFetchConfig {
  conditionExpression: string | redacted.Redacted<string>;
  triggerMode: TriggerMode;
}
export const ConditionBasedSignalFetchConfig = S.suspend(() =>
  S.Struct({ conditionExpression: SensitiveString, triggerMode: TriggerMode }),
).annotations({
  identifier: "ConditionBasedSignalFetchConfig",
}) as any as S.Schema<ConditionBasedSignalFetchConfig>;
export type SignalFetchConfig =
  | { timeBased: TimeBasedSignalFetchConfig }
  | { conditionBased: ConditionBasedSignalFetchConfig };
export const SignalFetchConfig = S.Union(
  S.Struct({ timeBased: TimeBasedSignalFetchConfig }),
  S.Struct({ conditionBased: ConditionBasedSignalFetchConfig }),
);
export interface SignalFetchInformation {
  fullyQualifiedName: string;
  signalFetchConfig: SignalFetchConfig;
  conditionLanguageVersion?: number;
  actions: string | redacted.Redacted<string>[];
}
export const SignalFetchInformation = S.suspend(() =>
  S.Struct({
    fullyQualifiedName: S.String,
    signalFetchConfig: SignalFetchConfig,
    conditionLanguageVersion: S.optional(S.Number),
    actions: EventExpressionList,
  }),
).annotations({
  identifier: "SignalFetchInformation",
}) as any as S.Schema<SignalFetchInformation>;
export type SignalFetchInformationList = SignalFetchInformation[];
export const SignalFetchInformationList = S.Array(SignalFetchInformation);
export interface GetCampaignResponse {
  name?: string;
  arn?: string;
  description?: string;
  signalCatalogArn?: string;
  targetArn?: string;
  status?: CampaignStatus;
  startTime?: Date;
  expiryTime?: Date;
  postTriggerCollectionDuration?: number;
  diagnosticsMode?: DiagnosticsMode;
  spoolingMode?: SpoolingMode;
  compression?: Compression;
  priority?: number;
  signalsToCollect?: SignalInformation[];
  collectionScheme?: CollectionScheme;
  dataExtraDimensions?: string[];
  creationTime?: Date;
  lastModificationTime?: Date;
  dataDestinationConfigs?: DataDestinationConfig[];
  dataPartitions?: DataPartition[];
  signalsToFetch?: SignalFetchInformation[];
}
export const GetCampaignResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    description: S.optional(S.String),
    signalCatalogArn: S.optional(S.String),
    targetArn: S.optional(S.String),
    status: S.optional(CampaignStatus),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expiryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    postTriggerCollectionDuration: S.optional(S.Number),
    diagnosticsMode: S.optional(DiagnosticsMode),
    spoolingMode: S.optional(SpoolingMode),
    compression: S.optional(Compression),
    priority: S.optional(S.Number),
    signalsToCollect: S.optional(SignalInformationList),
    collectionScheme: S.optional(CollectionScheme),
    dataExtraDimensions: S.optional(DataExtraDimensionNodePathList),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    dataDestinationConfigs: S.optional(DataDestinationConfigs),
    dataPartitions: S.optional(DataPartitions),
    signalsToFetch: S.optional(SignalFetchInformationList),
  }),
).annotations({
  identifier: "GetCampaignResponse",
}) as any as S.Schema<GetCampaignResponse>;
export interface UpdateCampaignResponse {
  arn?: string;
  name?: string;
  status?: CampaignStatus;
}
export const UpdateCampaignResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(CampaignStatus),
  }),
).annotations({
  identifier: "UpdateCampaignResponse",
}) as any as S.Schema<UpdateCampaignResponse>;
export interface DeleteCampaignResponse {
  name?: string;
  arn?: string;
}
export const DeleteCampaignResponse = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteCampaignResponse",
}) as any as S.Schema<DeleteCampaignResponse>;
export interface GetDecoderManifestResponse {
  name: string;
  arn: string;
  description?: string;
  modelManifestArn?: string;
  status?: ManifestStatus;
  creationTime: Date;
  lastModificationTime: Date;
  message?: string;
}
export const GetDecoderManifestResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    description: S.optional(S.String),
    modelManifestArn: S.optional(S.String),
    status: S.optional(ManifestStatus),
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDecoderManifestResponse",
}) as any as S.Schema<GetDecoderManifestResponse>;
export interface UpdateDecoderManifestResponse {
  name: string;
  arn: string;
}
export const UpdateDecoderManifestResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "UpdateDecoderManifestResponse",
}) as any as S.Schema<UpdateDecoderManifestResponse>;
export interface DeleteDecoderManifestResponse {
  name: string;
  arn: string;
}
export const DeleteDecoderManifestResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "DeleteDecoderManifestResponse",
}) as any as S.Schema<DeleteDecoderManifestResponse>;
export interface ListDecoderManifestNetworkInterfacesResponse {
  networkInterfaces?: NetworkInterface[];
  nextToken?: string;
}
export const ListDecoderManifestNetworkInterfacesResponse = S.suspend(() =>
  S.Struct({
    networkInterfaces: S.optional(NetworkInterfaces),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDecoderManifestNetworkInterfacesResponse",
}) as any as S.Schema<ListDecoderManifestNetworkInterfacesResponse>;
export interface ListDecoderManifestSignalsResponse {
  signalDecoders?: SignalDecoder[];
  nextToken?: string;
}
export const ListDecoderManifestSignalsResponse = S.suspend(() =>
  S.Struct({
    signalDecoders: S.optional(SignalDecoders),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDecoderManifestSignalsResponse",
}) as any as S.Schema<ListDecoderManifestSignalsResponse>;
export interface CreateFleetResponse {
  id: string;
  arn: string;
}
export const CreateFleetResponse = S.suspend(() =>
  S.Struct({ id: S.String, arn: S.String }),
).annotations({
  identifier: "CreateFleetResponse",
}) as any as S.Schema<CreateFleetResponse>;
export interface GetFleetResponse {
  id: string;
  arn: string;
  description?: string;
  signalCatalogArn: string;
  creationTime: Date;
  lastModificationTime: Date;
}
export const GetFleetResponse = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    description: S.optional(S.String),
    signalCatalogArn: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetFleetResponse",
}) as any as S.Schema<GetFleetResponse>;
export interface UpdateFleetResponse {
  id?: string;
  arn?: string;
}
export const UpdateFleetResponse = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateFleetResponse",
}) as any as S.Schema<UpdateFleetResponse>;
export interface DeleteFleetResponse {
  id?: string;
  arn?: string;
}
export const DeleteFleetResponse = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteFleetResponse",
}) as any as S.Schema<DeleteFleetResponse>;
export interface ListVehiclesInFleetResponse {
  vehicles?: string[];
  nextToken?: string;
}
export const ListVehiclesInFleetResponse = S.suspend(() =>
  S.Struct({ vehicles: S.optional(vehicles), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListVehiclesInFleetResponse",
}) as any as S.Schema<ListVehiclesInFleetResponse>;
export interface CreateModelManifestResponse {
  name: string;
  arn: string;
}
export const CreateModelManifestResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "CreateModelManifestResponse",
}) as any as S.Schema<CreateModelManifestResponse>;
export interface GetModelManifestResponse {
  name: string;
  arn: string;
  description?: string;
  signalCatalogArn?: string;
  status?: ManifestStatus;
  creationTime: Date;
  lastModificationTime: Date;
}
export const GetModelManifestResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    description: S.optional(S.String),
    signalCatalogArn: S.optional(S.String),
    status: S.optional(ManifestStatus),
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetModelManifestResponse",
}) as any as S.Schema<GetModelManifestResponse>;
export interface UpdateModelManifestResponse {
  name: string;
  arn: string;
}
export const UpdateModelManifestResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "UpdateModelManifestResponse",
}) as any as S.Schema<UpdateModelManifestResponse>;
export interface DeleteModelManifestResponse {
  name: string;
  arn: string;
}
export const DeleteModelManifestResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "DeleteModelManifestResponse",
}) as any as S.Schema<DeleteModelManifestResponse>;
export interface ListModelManifestNodesResponse {
  nodes?: Node[];
  nextToken?: string;
}
export const ListModelManifestNodesResponse = S.suspend(() =>
  S.Struct({ nodes: S.optional(Nodes), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListModelManifestNodesResponse",
}) as any as S.Schema<ListModelManifestNodesResponse>;
export interface UpdateSignalCatalogResponse {
  name: string;
  arn: string;
}
export const UpdateSignalCatalogResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "UpdateSignalCatalogResponse",
}) as any as S.Schema<UpdateSignalCatalogResponse>;
export interface DeleteSignalCatalogResponse {
  name: string;
  arn: string;
}
export const DeleteSignalCatalogResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "DeleteSignalCatalogResponse",
}) as any as S.Schema<DeleteSignalCatalogResponse>;
export interface ImportSignalCatalogRequest {
  name: string;
  description?: string;
  vss?: FormattedVss;
  tags?: Tag[];
}
export const ImportSignalCatalogRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    vss: S.optional(FormattedVss),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/signal-catalogs/{name}/nodes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportSignalCatalogRequest",
}) as any as S.Schema<ImportSignalCatalogRequest>;
export interface ListSignalCatalogNodesResponse {
  nodes?: Node[];
  nextToken?: string;
}
export const ListSignalCatalogNodesResponse = S.suspend(() =>
  S.Struct({ nodes: S.optional(Nodes), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSignalCatalogNodesResponse",
}) as any as S.Schema<ListSignalCatalogNodesResponse>;
export interface CreateStateTemplateResponse {
  name?: string;
  arn?: string;
  id?: string;
}
export const CreateStateTemplateResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateStateTemplateResponse",
}) as any as S.Schema<CreateStateTemplateResponse>;
export interface GetStateTemplateResponse {
  name?: string;
  arn?: string;
  description?: string;
  signalCatalogArn?: string;
  stateTemplateProperties?: string[];
  dataExtraDimensions?: string[];
  metadataExtraDimensions?: string[];
  creationTime?: Date;
  lastModificationTime?: Date;
  id?: string;
}
export const GetStateTemplateResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    description: S.optional(S.String),
    signalCatalogArn: S.optional(S.String),
    stateTemplateProperties: S.optional(StateTemplateProperties),
    dataExtraDimensions: S.optional(
      StateTemplateDataExtraDimensionNodePathList,
    ),
    metadataExtraDimensions: S.optional(
      StateTemplateMetadataExtraDimensionNodePathList,
    ),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "GetStateTemplateResponse",
}) as any as S.Schema<GetStateTemplateResponse>;
export interface UpdateStateTemplateResponse {
  name?: string;
  arn?: string;
  id?: string;
}
export const UpdateStateTemplateResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateStateTemplateResponse",
}) as any as S.Schema<UpdateStateTemplateResponse>;
export interface DeleteStateTemplateResponse {
  name?: string;
  arn?: string;
  id?: string;
}
export const DeleteStateTemplateResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteStateTemplateResponse",
}) as any as S.Schema<DeleteStateTemplateResponse>;
export interface GetVehicleResponse {
  vehicleName?: string;
  arn?: string;
  modelManifestArn?: string;
  decoderManifestArn?: string;
  attributes?: { [key: string]: string };
  stateTemplates?: StateTemplateAssociation[];
  creationTime?: Date;
  lastModificationTime?: Date;
}
export const GetVehicleResponse = S.suspend(() =>
  S.Struct({
    vehicleName: S.optional(S.String),
    arn: S.optional(S.String),
    modelManifestArn: S.optional(S.String),
    decoderManifestArn: S.optional(S.String),
    attributes: S.optional(attributesMap),
    stateTemplates: S.optional(StateTemplateAssociations),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetVehicleResponse",
}) as any as S.Schema<GetVehicleResponse>;
export interface UpdateVehicleResponse {
  vehicleName?: string;
  arn?: string;
}
export const UpdateVehicleResponse = S.suspend(() =>
  S.Struct({ vehicleName: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateVehicleResponse",
}) as any as S.Schema<UpdateVehicleResponse>;
export interface DeleteVehicleResponse {
  vehicleName: string;
  arn: string;
}
export const DeleteVehicleResponse = S.suspend(() =>
  S.Struct({ vehicleName: S.String, arn: S.String }),
).annotations({
  identifier: "DeleteVehicleResponse",
}) as any as S.Schema<DeleteVehicleResponse>;
export interface ListFleetsForVehicleResponse {
  fleets?: string[];
  nextToken?: string;
}
export const ListFleetsForVehicleResponse = S.suspend(() =>
  S.Struct({ fleets: S.optional(fleets), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFleetsForVehicleResponse",
}) as any as S.Schema<ListFleetsForVehicleResponse>;
export type VehicleState =
  | "CREATED"
  | "READY"
  | "HEALTHY"
  | "SUSPENDED"
  | "DELETING"
  | "READY_FOR_CHECKIN";
export const VehicleState = S.Literal(
  "CREATED",
  "READY",
  "HEALTHY",
  "SUSPENDED",
  "DELETING",
  "READY_FOR_CHECKIN",
);
export interface VehicleStatus {
  campaignName?: string;
  vehicleName?: string;
  status?: VehicleState;
}
export const VehicleStatus = S.suspend(() =>
  S.Struct({
    campaignName: S.optional(S.String),
    vehicleName: S.optional(S.String),
    status: S.optional(VehicleState),
  }),
).annotations({
  identifier: "VehicleStatus",
}) as any as S.Schema<VehicleStatus>;
export type VehicleStatusList = VehicleStatus[];
export const VehicleStatusList = S.Array(VehicleStatus);
export interface CampaignSummary {
  arn?: string;
  name?: string;
  description?: string;
  signalCatalogArn?: string;
  targetArn?: string;
  status?: CampaignStatus;
  creationTime: Date;
  lastModificationTime: Date;
}
export const CampaignSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    signalCatalogArn: S.optional(S.String),
    targetArn: S.optional(S.String),
    status: S.optional(CampaignStatus),
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CampaignSummary",
}) as any as S.Schema<CampaignSummary>;
export type campaignSummaries = CampaignSummary[];
export const campaignSummaries = S.Array(CampaignSummary);
export interface DecoderManifestSummary {
  name?: string;
  arn?: string;
  modelManifestArn?: string;
  description?: string;
  status?: ManifestStatus;
  creationTime: Date;
  lastModificationTime: Date;
  message?: string;
}
export const DecoderManifestSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    modelManifestArn: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(ManifestStatus),
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "DecoderManifestSummary",
}) as any as S.Schema<DecoderManifestSummary>;
export type decoderManifestSummaries = DecoderManifestSummary[];
export const decoderManifestSummaries = S.Array(DecoderManifestSummary);
export interface FleetSummary {
  id: string;
  arn: string;
  description?: string;
  signalCatalogArn: string;
  creationTime: Date;
  lastModificationTime?: Date;
}
export const FleetSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    description: S.optional(S.String),
    signalCatalogArn: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "FleetSummary" }) as any as S.Schema<FleetSummary>;
export type fleetSummaries = FleetSummary[];
export const fleetSummaries = S.Array(FleetSummary);
export interface ModelManifestSummary {
  name?: string;
  arn?: string;
  signalCatalogArn?: string;
  description?: string;
  status?: ManifestStatus;
  creationTime: Date;
  lastModificationTime: Date;
}
export const ModelManifestSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    signalCatalogArn: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(ManifestStatus),
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ModelManifestSummary",
}) as any as S.Schema<ModelManifestSummary>;
export type modelManifestSummaries = ModelManifestSummary[];
export const modelManifestSummaries = S.Array(ModelManifestSummary);
export interface NodeCounts {
  totalNodes?: number;
  totalBranches?: number;
  totalSensors?: number;
  totalAttributes?: number;
  totalActuators?: number;
  totalStructs?: number;
  totalProperties?: number;
}
export const NodeCounts = S.suspend(() =>
  S.Struct({
    totalNodes: S.optional(S.Number),
    totalBranches: S.optional(S.Number),
    totalSensors: S.optional(S.Number),
    totalAttributes: S.optional(S.Number),
    totalActuators: S.optional(S.Number),
    totalStructs: S.optional(S.Number),
    totalProperties: S.optional(S.Number),
  }),
).annotations({ identifier: "NodeCounts" }) as any as S.Schema<NodeCounts>;
export interface SignalCatalogSummary {
  name?: string;
  arn?: string;
  creationTime?: Date;
  lastModificationTime?: Date;
}
export const SignalCatalogSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "SignalCatalogSummary",
}) as any as S.Schema<SignalCatalogSummary>;
export type signalCatalogSummaries = SignalCatalogSummary[];
export const signalCatalogSummaries = S.Array(SignalCatalogSummary);
export interface StateTemplateSummary {
  name?: string;
  arn?: string;
  signalCatalogArn?: string;
  description?: string;
  creationTime?: Date;
  lastModificationTime?: Date;
  id?: string;
}
export const StateTemplateSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    signalCatalogArn: S.optional(S.String),
    description: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "StateTemplateSummary",
}) as any as S.Schema<StateTemplateSummary>;
export type StateTemplateSummaries = StateTemplateSummary[];
export const StateTemplateSummaries = S.Array(StateTemplateSummary);
export interface VehicleSummary {
  vehicleName: string;
  arn: string;
  modelManifestArn: string;
  decoderManifestArn: string;
  creationTime: Date;
  lastModificationTime: Date;
  attributes?: { [key: string]: string };
}
export const VehicleSummary = S.suspend(() =>
  S.Struct({
    vehicleName: S.String,
    arn: S.String,
    modelManifestArn: S.String,
    decoderManifestArn: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    attributes: S.optional(attributesMap),
  }),
).annotations({
  identifier: "VehicleSummary",
}) as any as S.Schema<VehicleSummary>;
export type vehicleSummaries = VehicleSummary[];
export const vehicleSummaries = S.Array(VehicleSummary);
export type ModelSignalsMap = { [key: string]: string };
export const ModelSignalsMap = S.Record({ key: S.String, value: S.String });
export interface GetVehicleStatusResponse {
  campaigns?: VehicleStatus[];
  nextToken?: string;
}
export const GetVehicleStatusResponse = S.suspend(() =>
  S.Struct({
    campaigns: S.optional(VehicleStatusList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetVehicleStatusResponse",
}) as any as S.Schema<GetVehicleStatusResponse>;
export interface RegisterAccountResponse {
  registerAccountStatus: RegistrationStatus;
  timestreamResources?: TimestreamResources;
  iamResources: IamResources;
  creationTime: Date;
  lastModificationTime: Date;
}
export const RegisterAccountResponse = S.suspend(() =>
  S.Struct({
    registerAccountStatus: RegistrationStatus,
    timestreamResources: S.optional(TimestreamResources),
    iamResources: IamResources,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "RegisterAccountResponse",
}) as any as S.Schema<RegisterAccountResponse>;
export interface ListCampaignsResponse {
  campaignSummaries?: CampaignSummary[];
  nextToken?: string;
}
export const ListCampaignsResponse = S.suspend(() =>
  S.Struct({
    campaignSummaries: S.optional(campaignSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCampaignsResponse",
}) as any as S.Schema<ListCampaignsResponse>;
export type StructuredMessageListType =
  | "FIXED_CAPACITY"
  | "DYNAMIC_UNBOUNDED_CAPACITY"
  | "DYNAMIC_BOUNDED_CAPACITY";
export const StructuredMessageListType = S.Literal(
  "FIXED_CAPACITY",
  "DYNAMIC_UNBOUNDED_CAPACITY",
  "DYNAMIC_BOUNDED_CAPACITY",
);
export interface ListDecoderManifestsResponse {
  summaries?: DecoderManifestSummary[];
  nextToken?: string;
}
export const ListDecoderManifestsResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(decoderManifestSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDecoderManifestsResponse",
}) as any as S.Schema<ListDecoderManifestsResponse>;
export interface ListFleetsResponse {
  fleetSummaries?: FleetSummary[];
  nextToken?: string;
}
export const ListFleetsResponse = S.suspend(() =>
  S.Struct({
    fleetSummaries: S.optional(fleetSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFleetsResponse",
}) as any as S.Schema<ListFleetsResponse>;
export interface ListModelManifestsResponse {
  summaries?: ModelManifestSummary[];
  nextToken?: string;
}
export const ListModelManifestsResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(modelManifestSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListModelManifestsResponse",
}) as any as S.Schema<ListModelManifestsResponse>;
export interface CreateSignalCatalogRequest {
  name: string;
  description?: string;
  nodes?: Node[];
  tags?: Tag[];
}
export const CreateSignalCatalogRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    nodes: S.optional(Nodes),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/signal-catalogs/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSignalCatalogRequest",
}) as any as S.Schema<CreateSignalCatalogRequest>;
export interface GetSignalCatalogResponse {
  name: string;
  arn: string;
  description?: string;
  nodeCounts?: NodeCounts;
  creationTime: Date;
  lastModificationTime: Date;
}
export const GetSignalCatalogResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    description: S.optional(S.String),
    nodeCounts: S.optional(NodeCounts),
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetSignalCatalogResponse",
}) as any as S.Schema<GetSignalCatalogResponse>;
export interface ListSignalCatalogsResponse {
  summaries?: SignalCatalogSummary[];
  nextToken?: string;
}
export const ListSignalCatalogsResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(signalCatalogSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSignalCatalogsResponse",
}) as any as S.Schema<ListSignalCatalogsResponse>;
export interface ImportSignalCatalogResponse {
  name: string;
  arn: string;
}
export const ImportSignalCatalogResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "ImportSignalCatalogResponse",
}) as any as S.Schema<ImportSignalCatalogResponse>;
export interface ListStateTemplatesResponse {
  summaries?: StateTemplateSummary[];
  nextToken?: string;
}
export const ListStateTemplatesResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(StateTemplateSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStateTemplatesResponse",
}) as any as S.Schema<ListStateTemplatesResponse>;
export interface ListVehiclesResponse {
  vehicleSummaries?: VehicleSummary[];
  nextToken?: string;
}
export const ListVehiclesResponse = S.suspend(() =>
  S.Struct({
    vehicleSummaries: S.optional(vehicleSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVehiclesResponse",
}) as any as S.Schema<ListVehiclesResponse>;
export interface CanDbcDefinition {
  networkInterface: string;
  canDbcFiles: Uint8Array[];
  signalsMap?: { [key: string]: string };
}
export const CanDbcDefinition = S.suspend(() =>
  S.Struct({
    networkInterface: S.String,
    canDbcFiles: NetworkFilesList,
    signalsMap: S.optional(ModelSignalsMap),
  }),
).annotations({
  identifier: "CanDbcDefinition",
}) as any as S.Schema<CanDbcDefinition>;
export interface StructuredMessageListDefinition {
  name: string;
  memberType: StructuredMessage;
  listType: StructuredMessageListType;
  capacity?: number;
}
export const StructuredMessageListDefinition = S.suspend(() =>
  S.Struct({
    name: S.String,
    memberType: S.suspend(() => StructuredMessage).annotations({
      identifier: "StructuredMessage",
    }),
    listType: StructuredMessageListType,
    capacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "StructuredMessageListDefinition",
}) as any as S.Schema<StructuredMessageListDefinition>;
export interface StructuredMessageFieldNameAndDataTypePair {
  fieldName: string;
  dataType: StructuredMessage;
}
export const StructuredMessageFieldNameAndDataTypePair = S.suspend(() =>
  S.Struct({
    fieldName: S.String,
    dataType: S.suspend(() => StructuredMessage).annotations({
      identifier: "StructuredMessage",
    }),
  }),
).annotations({
  identifier: "StructuredMessageFieldNameAndDataTypePair",
}) as any as S.Schema<StructuredMessageFieldNameAndDataTypePair>;
export type StructuredMessageDefinition =
  StructuredMessageFieldNameAndDataTypePair[];
export const StructuredMessageDefinition = S.Array(
  S.suspend(
    (): S.Schema<StructuredMessageFieldNameAndDataTypePair, any> =>
      StructuredMessageFieldNameAndDataTypePair,
  ).annotations({ identifier: "StructuredMessageFieldNameAndDataTypePair" }),
) as any as S.Schema<StructuredMessageDefinition>;
export interface CreateVehicleResponseItem {
  vehicleName?: string;
  arn?: string;
  thingArn?: string;
}
export const CreateVehicleResponseItem = S.suspend(() =>
  S.Struct({
    vehicleName: S.optional(S.String),
    arn: S.optional(S.String),
    thingArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateVehicleResponseItem",
}) as any as S.Schema<CreateVehicleResponseItem>;
export type createVehicleResponses = CreateVehicleResponseItem[];
export const createVehicleResponses = S.Array(CreateVehicleResponseItem);
export interface CreateVehicleError {
  vehicleName?: string;
  code?: string;
  message?: string;
}
export const CreateVehicleError = S.suspend(() =>
  S.Struct({
    vehicleName: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateVehicleError",
}) as any as S.Schema<CreateVehicleError>;
export type createVehicleErrors = CreateVehicleError[];
export const createVehicleErrors = S.Array(CreateVehicleError);
export interface UpdateVehicleResponseItem {
  vehicleName?: string;
  arn?: string;
}
export const UpdateVehicleResponseItem = S.suspend(() =>
  S.Struct({ vehicleName: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateVehicleResponseItem",
}) as any as S.Schema<UpdateVehicleResponseItem>;
export type updateVehicleResponseItems = UpdateVehicleResponseItem[];
export const updateVehicleResponseItems = S.Array(UpdateVehicleResponseItem);
export interface UpdateVehicleError {
  vehicleName?: string;
  code?: number;
  message?: string;
}
export const UpdateVehicleError = S.suspend(() =>
  S.Struct({
    vehicleName: S.optional(S.String),
    code: S.optional(S.Number),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateVehicleError",
}) as any as S.Schema<UpdateVehicleError>;
export type updateVehicleErrors = UpdateVehicleError[];
export const updateVehicleErrors = S.Array(UpdateVehicleError);
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
export type NetworkFileDefinition = { canDbc: CanDbcDefinition };
export const NetworkFileDefinition = S.Union(
  S.Struct({ canDbc: CanDbcDefinition }),
);
export type NetworkFileDefinitions = NetworkFileDefinition[];
export const NetworkFileDefinitions = S.Array(NetworkFileDefinition);
export interface BatchCreateVehicleResponse {
  vehicles?: CreateVehicleResponseItem[];
  errors?: CreateVehicleError[];
}
export const BatchCreateVehicleResponse = S.suspend(() =>
  S.Struct({
    vehicles: S.optional(createVehicleResponses),
    errors: S.optional(createVehicleErrors),
  }),
).annotations({
  identifier: "BatchCreateVehicleResponse",
}) as any as S.Schema<BatchCreateVehicleResponse>;
export interface BatchUpdateVehicleResponse {
  vehicles?: UpdateVehicleResponseItem[];
  errors?: UpdateVehicleError[];
}
export const BatchUpdateVehicleResponse = S.suspend(() =>
  S.Struct({
    vehicles: S.optional(updateVehicleResponseItems),
    errors: S.optional(updateVehicleErrors),
  }),
).annotations({
  identifier: "BatchUpdateVehicleResponse",
}) as any as S.Schema<BatchUpdateVehicleResponse>;
export interface CreateCampaignRequest {
  name: string;
  description?: string;
  signalCatalogArn: string;
  targetArn: string;
  startTime?: Date;
  expiryTime?: Date;
  postTriggerCollectionDuration?: number;
  diagnosticsMode?: DiagnosticsMode;
  spoolingMode?: SpoolingMode;
  compression?: Compression;
  priority?: number;
  signalsToCollect?: SignalInformation[];
  collectionScheme: CollectionScheme;
  dataExtraDimensions?: string[];
  tags?: Tag[];
  dataDestinationConfigs?: DataDestinationConfig[];
  dataPartitions?: DataPartition[];
  signalsToFetch?: SignalFetchInformation[];
}
export const CreateCampaignRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    signalCatalogArn: S.String,
    targetArn: S.String,
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expiryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    postTriggerCollectionDuration: S.optional(S.Number),
    diagnosticsMode: S.optional(DiagnosticsMode),
    spoolingMode: S.optional(SpoolingMode),
    compression: S.optional(Compression),
    priority: S.optional(S.Number),
    signalsToCollect: S.optional(SignalInformationList),
    collectionScheme: CollectionScheme,
    dataExtraDimensions: S.optional(DataExtraDimensionNodePathList),
    tags: S.optional(TagList),
    dataDestinationConfigs: S.optional(DataDestinationConfigs),
    dataPartitions: S.optional(DataPartitions),
    signalsToFetch: S.optional(SignalFetchInformationList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/campaigns/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCampaignRequest",
}) as any as S.Schema<CreateCampaignRequest>;
export interface ImportDecoderManifestRequest {
  name: string;
  networkFileDefinitions: NetworkFileDefinition[];
}
export const ImportDecoderManifestRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    networkFileDefinitions: NetworkFileDefinitions,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/decoder-manifests/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportDecoderManifestRequest",
}) as any as S.Schema<ImportDecoderManifestRequest>;
export interface CreateSignalCatalogResponse {
  name: string;
  arn: string;
}
export const CreateSignalCatalogResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "CreateSignalCatalogResponse",
}) as any as S.Schema<CreateSignalCatalogResponse>;
export type SignalDecoderFailureReason =
  | "DUPLICATE_SIGNAL"
  | "CONFLICTING_SIGNAL"
  | "SIGNAL_TO_ADD_ALREADY_EXISTS"
  | "SIGNAL_NOT_ASSOCIATED_WITH_NETWORK_INTERFACE"
  | "NETWORK_INTERFACE_TYPE_INCOMPATIBLE_WITH_SIGNAL_DECODER_TYPE"
  | "SIGNAL_NOT_IN_MODEL"
  | "CAN_SIGNAL_INFO_IS_NULL"
  | "OBD_SIGNAL_INFO_IS_NULL"
  | "NO_DECODER_INFO_FOR_SIGNAL_IN_MODEL"
  | "MESSAGE_SIGNAL_INFO_IS_NULL"
  | "SIGNAL_DECODER_TYPE_INCOMPATIBLE_WITH_MESSAGE_SIGNAL_TYPE"
  | "STRUCT_SIZE_MISMATCH"
  | "NO_SIGNAL_IN_CATALOG_FOR_DECODER_SIGNAL"
  | "SIGNAL_DECODER_INCOMPATIBLE_WITH_SIGNAL_CATALOG"
  | "EMPTY_MESSAGE_SIGNAL"
  | "CUSTOM_DECODING_SIGNAL_INFO_IS_NULL";
export const SignalDecoderFailureReason = S.Literal(
  "DUPLICATE_SIGNAL",
  "CONFLICTING_SIGNAL",
  "SIGNAL_TO_ADD_ALREADY_EXISTS",
  "SIGNAL_NOT_ASSOCIATED_WITH_NETWORK_INTERFACE",
  "NETWORK_INTERFACE_TYPE_INCOMPATIBLE_WITH_SIGNAL_DECODER_TYPE",
  "SIGNAL_NOT_IN_MODEL",
  "CAN_SIGNAL_INFO_IS_NULL",
  "OBD_SIGNAL_INFO_IS_NULL",
  "NO_DECODER_INFO_FOR_SIGNAL_IN_MODEL",
  "MESSAGE_SIGNAL_INFO_IS_NULL",
  "SIGNAL_DECODER_TYPE_INCOMPATIBLE_WITH_MESSAGE_SIGNAL_TYPE",
  "STRUCT_SIZE_MISMATCH",
  "NO_SIGNAL_IN_CATALOG_FOR_DECODER_SIGNAL",
  "SIGNAL_DECODER_INCOMPATIBLE_WITH_SIGNAL_CATALOG",
  "EMPTY_MESSAGE_SIGNAL",
  "CUSTOM_DECODING_SIGNAL_INFO_IS_NULL",
);
export type NetworkInterfaceFailureReason =
  | "DUPLICATE_NETWORK_INTERFACE"
  | "CONFLICTING_NETWORK_INTERFACE"
  | "NETWORK_INTERFACE_TO_ADD_ALREADY_EXISTS"
  | "CAN_NETWORK_INTERFACE_INFO_IS_NULL"
  | "OBD_NETWORK_INTERFACE_INFO_IS_NULL"
  | "NETWORK_INTERFACE_TO_REMOVE_ASSOCIATED_WITH_SIGNALS"
  | "VEHICLE_MIDDLEWARE_NETWORK_INTERFACE_INFO_IS_NULL"
  | "CUSTOM_DECODING_SIGNAL_NETWORK_INTERFACE_INFO_IS_NULL";
export const NetworkInterfaceFailureReason = S.Literal(
  "DUPLICATE_NETWORK_INTERFACE",
  "CONFLICTING_NETWORK_INTERFACE",
  "NETWORK_INTERFACE_TO_ADD_ALREADY_EXISTS",
  "CAN_NETWORK_INTERFACE_INFO_IS_NULL",
  "OBD_NETWORK_INTERFACE_INFO_IS_NULL",
  "NETWORK_INTERFACE_TO_REMOVE_ASSOCIATED_WITH_SIGNALS",
  "VEHICLE_MIDDLEWARE_NETWORK_INTERFACE_INFO_IS_NULL",
  "CUSTOM_DECODING_SIGNAL_NETWORK_INTERFACE_INFO_IS_NULL",
);
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
export interface InvalidSignal {
  name?: string;
  reason?: string;
}
export const InvalidSignal = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), reason: S.optional(S.String) }),
).annotations({
  identifier: "InvalidSignal",
}) as any as S.Schema<InvalidSignal>;
export type InvalidSignals = InvalidSignal[];
export const InvalidSignals = S.Array(InvalidSignal);
export interface InvalidSignalDecoder {
  name?: string;
  reason?: SignalDecoderFailureReason;
  hint?: string;
}
export const InvalidSignalDecoder = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    reason: S.optional(SignalDecoderFailureReason),
    hint: S.optional(S.String),
  }),
).annotations({
  identifier: "InvalidSignalDecoder",
}) as any as S.Schema<InvalidSignalDecoder>;
export type InvalidSignalDecoders = InvalidSignalDecoder[];
export const InvalidSignalDecoders = S.Array(InvalidSignalDecoder);
export interface InvalidNetworkInterface {
  interfaceId?: string;
  reason?: NetworkInterfaceFailureReason;
}
export const InvalidNetworkInterface = S.suspend(() =>
  S.Struct({
    interfaceId: S.optional(S.String),
    reason: S.optional(NetworkInterfaceFailureReason),
  }),
).annotations({
  identifier: "InvalidNetworkInterface",
}) as any as S.Schema<InvalidNetworkInterface>;
export type InvalidNetworkInterfaces = InvalidNetworkInterface[];
export const InvalidNetworkInterfaces = S.Array(InvalidNetworkInterface);
export interface CreateCampaignResponse {
  name?: string;
  arn?: string;
}
export const CreateCampaignResponse = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateCampaignResponse",
}) as any as S.Schema<CreateCampaignResponse>;
export interface ImportDecoderManifestResponse {
  name: string;
  arn: string;
}
export const ImportDecoderManifestResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "ImportDecoderManifestResponse",
}) as any as S.Schema<ImportDecoderManifestResponse>;
export interface CreateVehicleRequest {
  vehicleName: string;
  modelManifestArn: string;
  decoderManifestArn: string;
  attributes?: { [key: string]: string };
  associationBehavior?: VehicleAssociationBehavior;
  tags?: Tag[];
  stateTemplates?: StateTemplateAssociation[];
}
export const CreateVehicleRequest = S.suspend(() =>
  S.Struct({
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
    modelManifestArn: S.String,
    decoderManifestArn: S.String,
    attributes: S.optional(attributesMap),
    associationBehavior: S.optional(VehicleAssociationBehavior),
    tags: S.optional(TagList),
    stateTemplates: S.optional(StateTemplateAssociations),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/vehicles/{vehicleName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVehicleRequest",
}) as any as S.Schema<CreateVehicleRequest>;
export interface CreateDecoderManifestRequest {
  name: string;
  description?: string;
  modelManifestArn: string;
  signalDecoders?: SignalDecoder[];
  networkInterfaces?: NetworkInterface[];
  defaultForUnmappedSignals?: DefaultForUnmappedSignalsType;
  tags?: Tag[];
}
export const CreateDecoderManifestRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    modelManifestArn: S.String,
    signalDecoders: S.optional(SignalDecoders),
    networkInterfaces: S.optional(NetworkInterfaces),
    defaultForUnmappedSignals: S.optional(DefaultForUnmappedSignalsType),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/decoder-manifests/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDecoderManifestRequest",
}) as any as S.Schema<CreateDecoderManifestRequest>;
export interface CreateVehicleResponse {
  vehicleName?: string;
  arn?: string;
  thingArn?: string;
}
export const CreateVehicleResponse = S.suspend(() =>
  S.Struct({
    vehicleName: S.optional(S.String),
    arn: S.optional(S.String),
    thingArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateVehicleResponse",
}) as any as S.Schema<CreateVehicleResponse>;
export interface CreateDecoderManifestResponse {
  name: string;
  arn: string;
}
export const CreateDecoderManifestResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "CreateDecoderManifestResponse",
}) as any as S.Schema<CreateDecoderManifestResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    quotaCode: S.optional(S.String),
    serviceCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resource: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class InvalidNodeException extends S.TaggedError<InvalidNodeException>()(
  "InvalidNodeException",
  {
    invalidNodes: S.optional(Nodes),
    reason: S.optional(S.String),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(ValidationExceptionReason),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class InvalidSignalsException extends S.TaggedError<InvalidSignalsException>()(
  "InvalidSignalsException",
  { message: S.optional(S.String), invalidSignals: S.optional(InvalidSignals) },
).pipe(C.withBadRequestError) {}
export class DecoderManifestValidationException extends S.TaggedError<DecoderManifestValidationException>()(
  "DecoderManifestValidationException",
  {
    invalidSignals: S.optional(InvalidSignalDecoders),
    invalidNetworkInterfaces: S.optional(InvalidNetworkInterfaces),
    message: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves the logging options.
 */
export const getLoggingOptions: (
  input: GetLoggingOptionsRequest,
) => effect.Effect<
  GetLoggingOptionsResponse,
  AccessDeniedException | ThrottlingException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoggingOptionsRequest,
  output: GetLoggingOptionsResponse,
  errors: [AccessDeniedException, ThrottlingException],
}));
/**
 * Retrieves information about a campaign.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const getCampaign: (
  input: GetCampaignRequest,
) => effect.Effect<
  GetCampaignResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCampaignRequest,
  output: GetCampaignResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a signal catalog using your existing VSS formatted content from your local
 * device.
 */
export const importSignalCatalog: (
  input: ImportSignalCatalogRequest,
) => effect.Effect<
  ImportSignalCatalogResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidSignalsException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportSignalCatalogRequest,
  output: ImportSignalCatalogResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidSignalsException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a decoder manifest.
 *
 * A decoder manifest can only be updated when the status is `DRAFT`. Only
 * `ACTIVE` decoder manifests can be associated with vehicles.
 */
export const updateDecoderManifest: (
  input: UpdateDecoderManifestRequest,
) => effect.Effect<
  UpdateDecoderManifestResponse,
  | AccessDeniedException
  | ConflictException
  | DecoderManifestValidationException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDecoderManifestRequest,
  output: UpdateDecoderManifestResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DecoderManifestValidationException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists information about created campaigns.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listCampaigns: {
  (
    input: ListCampaignsRequest,
  ): effect.Effect<
    ListCampaignsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCampaignsRequest,
  ) => stream.Stream<
    ListCampaignsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCampaignsRequest,
  ) => stream.Stream<
    CampaignSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCampaignsRequest,
  output: ListCampaignsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "campaignSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists decoder manifests.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listDecoderManifests: {
  (
    input: ListDecoderManifestsRequest,
  ): effect.Effect<
    ListDecoderManifestsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDecoderManifestsRequest,
  ) => stream.Stream<
    ListDecoderManifestsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDecoderManifestsRequest,
  ) => stream.Stream<
    DecoderManifestSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDecoderManifestsRequest,
  output: ListDecoderManifestsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information for each created fleet in an Amazon Web Services account.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listFleets: {
  (
    input: ListFleetsRequest,
  ): effect.Effect<
    ListFleetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFleetsRequest,
  ) => stream.Stream<
    ListFleetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFleetsRequest,
  ) => stream.Stream<
    FleetSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFleetsRequest,
  output: ListFleetsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "fleetSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of vehicle models (model manifests).
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listModelManifests: {
  (
    input: ListModelManifestsRequest,
  ): effect.Effect<
    ListModelManifestsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListModelManifestsRequest,
  ) => stream.Stream<
    ListModelManifestsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListModelManifestsRequest,
  ) => stream.Stream<
    ModelManifestSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListModelManifestsRequest,
  output: ListModelManifestsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about a signal catalog.
 */
export const getSignalCatalog: (
  input: GetSignalCatalogRequest,
) => effect.Effect<
  GetSignalCatalogResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSignalCatalogRequest,
  output: GetSignalCatalogResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the created signal catalogs in an Amazon Web Services account.
 *
 * You can use to list information about
 * each signal (node) specified in a signal catalog.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listSignalCatalogs: {
  (
    input: ListSignalCatalogsRequest,
  ): effect.Effect<
    ListSignalCatalogsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSignalCatalogsRequest,
  ) => stream.Stream<
    ListSignalCatalogsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSignalCatalogsRequest,
  ) => stream.Stream<
    SignalCatalogSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSignalCatalogsRequest,
  output: ListSignalCatalogsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists information about created state templates.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const listStateTemplates: {
  (
    input: ListStateTemplatesRequest,
  ): effect.Effect<
    ListStateTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStateTemplatesRequest,
  ) => stream.Stream<
    ListStateTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStateTemplatesRequest,
  ) => stream.Stream<
    StateTemplateSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStateTemplatesRequest,
  output: ListStateTemplatesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of summaries of created vehicles.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listVehicles: {
  (
    input: ListVehiclesRequest,
  ): effect.Effect<
    ListVehiclesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVehiclesRequest,
  ) => stream.Stream<
    ListVehiclesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVehiclesRequest,
  ) => stream.Stream<
    VehicleSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVehiclesRequest,
  output: ListVehiclesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "vehicleSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about the status of registering your Amazon Web Services account, IAM, and
 * Amazon Timestream resources so that Amazon Web Services IoT FleetWise can transfer your vehicle data to the Amazon Web Services
 * Cloud.
 *
 * For more information, including step-by-step procedures, see Setting up Amazon Web Services IoT FleetWise.
 *
 * This API operation doesn't require input parameters.
 */
export const getRegisterAccountStatus: (
  input: GetRegisterAccountStatusRequest,
) => effect.Effect<
  GetRegisterAccountStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegisterAccountStatusRequest,
  output: GetRegisterAccountStatusResponse,
  errors: [
    AccessDeniedException,
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
 * Adds to or modifies the tags of the given resource. Tags are metadata which can be
 * used to manage a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the network interfaces specified in a decoder manifest.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listDecoderManifestNetworkInterfaces: {
  (
    input: ListDecoderManifestNetworkInterfacesRequest,
  ): effect.Effect<
    ListDecoderManifestNetworkInterfacesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDecoderManifestNetworkInterfacesRequest,
  ) => stream.Stream<
    ListDecoderManifestNetworkInterfacesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDecoderManifestNetworkInterfacesRequest,
  ) => stream.Stream<
    NetworkInterface,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDecoderManifestNetworkInterfacesRequest,
  output: ListDecoderManifestNetworkInterfacesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "networkInterfaces",
    pageSize: "maxResults",
  } as const,
}));
/**
 * A list of information about signal decoders specified in a decoder manifest.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listDecoderManifestSignals: {
  (
    input: ListDecoderManifestSignalsRequest,
  ): effect.Effect<
    ListDecoderManifestSignalsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDecoderManifestSignalsRequest,
  ) => stream.Stream<
    ListDecoderManifestSignalsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDecoderManifestSignalsRequest,
  ) => stream.Stream<
    SignalDecoder,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDecoderManifestSignalsRequest,
  output: ListDecoderManifestSignalsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "signalDecoders",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about a fleet.
 */
export const getFleet: (
  input: GetFleetRequest,
) => effect.Effect<
  GetFleetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFleetRequest,
  output: GetFleetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a fleet. Before you delete a fleet, all vehicles must be
 * dissociated from the fleet. For more information, see Delete a fleet (AWS
 * CLI) in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const deleteFleet: (
  input: DeleteFleetRequest,
) => effect.Effect<
  DeleteFleetResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFleetRequest,
  output: DeleteFleetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of summaries of all vehicles associated with a fleet.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listVehiclesInFleet: {
  (
    input: ListVehiclesInFleetRequest,
  ): effect.Effect<
    ListVehiclesInFleetResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVehiclesInFleetRequest,
  ) => stream.Stream<
    ListVehiclesInFleetResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVehiclesInFleetRequest,
  ) => stream.Stream<
    vehicleName,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVehiclesInFleetRequest,
  output: ListVehiclesInFleetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "vehicles",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about a state template.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const getStateTemplate: (
  input: GetStateTemplateRequest,
) => effect.Effect<
  GetStateTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStateTemplateRequest,
  output: GetStateTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a state template.
 */
export const deleteStateTemplate: (
  input: DeleteStateTemplateRequest,
) => effect.Effect<
  DeleteStateTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStateTemplateRequest,
  output: DeleteStateTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a vehicle.
 */
export const getVehicle: (
  input: GetVehicleRequest,
) => effect.Effect<
  GetVehicleResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVehicleRequest,
  output: GetVehicleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a vehicle and removes it from any campaigns.
 */
export const deleteVehicle: (
  input: DeleteVehicleRequest,
) => effect.Effect<
  DeleteVehicleResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVehicleRequest,
  output: DeleteVehicleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of IDs for all fleets that the vehicle is associated with.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listFleetsForVehicle: {
  (
    input: ListFleetsForVehicleRequest,
  ): effect.Effect<
    ListFleetsForVehicleResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFleetsForVehicleRequest,
  ) => stream.Stream<
    ListFleetsForVehicleResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFleetsForVehicleRequest,
  ) => stream.Stream<
    fleetId,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFleetsForVehicleRequest,
  output: ListFleetsForVehicleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "fleets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes the given tags (metadata) from the resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes, or disassociates, a vehicle from a fleet. Disassociating a vehicle from a
 * fleet doesn't delete the vehicle.
 */
export const disassociateVehicleFleet: (
  input: DisassociateVehicleFleetRequest,
) => effect.Effect<
  DisassociateVehicleFleetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateVehicleFleetRequest,
  output: DisassociateVehicleFleetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a campaign.
 */
export const updateCampaign: (
  input: UpdateCampaignRequest,
) => effect.Effect<
  UpdateCampaignResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignRequest,
  output: UpdateCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a decoder manifest. You can't delete a decoder manifest if it has vehicles
 * associated with it.
 */
export const deleteDecoderManifest: (
  input: DeleteDecoderManifestRequest,
) => effect.Effect<
  DeleteDecoderManifestResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDecoderManifestRequest,
  output: DeleteDecoderManifestResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the description of an existing fleet.
 */
export const updateFleet: (
  input: UpdateFleetRequest,
) => effect.Effect<
  UpdateFleetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFleetRequest,
  output: UpdateFleetResponse,
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
 * Deletes a vehicle model (model manifest).
 */
export const deleteModelManifest: (
  input: DeleteModelManifestRequest,
) => effect.Effect<
  DeleteModelManifestResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelManifestRequest,
  output: DeleteModelManifestResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a signal catalog.
 */
export const deleteSignalCatalog: (
  input: DeleteSignalCatalogRequest,
) => effect.Effect<
  DeleteSignalCatalogResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSignalCatalogRequest,
  output: DeleteSignalCatalogResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates the logging option.
 */
export const putLoggingOptions: (
  input: PutLoggingOptionsRequest,
) => effect.Effect<
  PutLoggingOptionsResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLoggingOptionsRequest,
  output: PutLoggingOptionsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a data collection campaign. Deleting a campaign suspends all data collection
 * and removes it from any vehicles.
 */
export const deleteCampaign: (
  input: DeleteCampaignRequest,
) => effect.Effect<
  DeleteCampaignResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCampaignRequest,
  output: DeleteCampaignResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a created decoder manifest.
 */
export const getDecoderManifest: (
  input: GetDecoderManifestRequest,
) => effect.Effect<
  GetDecoderManifestResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDecoderManifestRequest,
  output: GetDecoderManifestResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a vehicle model (model manifest).
 */
export const getModelManifest: (
  input: GetModelManifestRequest,
) => effect.Effect<
  GetModelManifestResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelManifestRequest,
  output: GetModelManifestResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the encryption configuration for resources and data in Amazon Web Services IoT FleetWise.
 */
export const getEncryptionConfiguration: (
  input: GetEncryptionConfigurationRequest,
) => effect.Effect<
  GetEncryptionConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEncryptionConfigurationRequest,
  output: GetEncryptionConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the status of campaigns, decoder manifests, or state templates
 * associated with a vehicle.
 */
export const getVehicleStatus: {
  (
    input: GetVehicleStatusRequest,
  ): effect.Effect<
    GetVehicleStatusResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetVehicleStatusRequest,
  ) => stream.Stream<
    GetVehicleStatusResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetVehicleStatusRequest,
  ) => stream.Stream<
    VehicleStatus,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetVehicleStatusRequest,
  output: GetVehicleStatusResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "campaigns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates or updates the encryption configuration. Amazon Web Services IoT FleetWise can encrypt your data and
 * resources using an Amazon Web Services managed key. Or, you can use a KMS key that you own and
 * manage. For more information, see Data
 * encryption in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const putEncryptionConfiguration: (
  input: PutEncryptionConfigurationRequest,
) => effect.Effect<
  PutEncryptionConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEncryptionConfigurationRequest,
  output: PutEncryptionConfigurationResponse,
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
 * This API operation contains deprecated parameters. Register your account again
 * without the Timestream resources parameter so that Amazon Web Services IoT FleetWise can remove the Timestream
 * metadata stored. You should then pass the data destination into the CreateCampaign API operation.
 *
 * You must delete any existing campaigns that include an empty data destination
 * before you register your account again. For more information, see the DeleteCampaign API operation.
 *
 * If you want to delete the Timestream inline policy from the service-linked role, such
 * as to mitigate an overly permissive policy, you must first delete any existing
 * campaigns. Then delete the service-linked role and register your account again to
 * enable CloudWatch metrics. For more information, see DeleteServiceLinkedRole in the Identity and Access Management API
 * Reference.
 *
 * Registers your Amazon Web Services account, IAM, and Amazon Timestream resources so Amazon Web Services IoT FleetWise can
 * transfer your vehicle data to the Amazon Web Services Cloud. For more information, including
 * step-by-step procedures, see Setting up
 * Amazon Web Services IoT FleetWise.
 *
 * An Amazon Web Services account is **not** the same thing as a
 * "user." An Amazon Web Services user is an identity that you create using Identity and Access Management (IAM) and
 * takes the form of either an IAM user or an IAM role, both
 * with credentials. A single Amazon Web Services account can, and typically does,
 * contain many users and roles.
 */
export const registerAccount: (
  input: RegisterAccountRequest,
) => effect.Effect<
  RegisterAccountResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterAccountRequest,
  output: RegisterAccountResponse,
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
 * Lists information about nodes specified in a vehicle model (model manifest).
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listModelManifestNodes: {
  (
    input: ListModelManifestNodesRequest,
  ): effect.Effect<
    ListModelManifestNodesResponse,
    | AccessDeniedException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListModelManifestNodesRequest,
  ) => stream.Stream<
    ListModelManifestNodesResponse,
    | AccessDeniedException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListModelManifestNodesRequest,
  ) => stream.Stream<
    Node,
    | AccessDeniedException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListModelManifestNodesRequest,
  output: ListModelManifestNodesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "nodes",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists of information about the signals (nodes) specified in a signal catalog.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listSignalCatalogNodes: {
  (
    input: ListSignalCatalogNodesRequest,
  ): effect.Effect<
    ListSignalCatalogNodesResponse,
    | AccessDeniedException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSignalCatalogNodesRequest,
  ) => stream.Stream<
    ListSignalCatalogNodesResponse,
    | AccessDeniedException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSignalCatalogNodesRequest,
  ) => stream.Stream<
    Node,
    | AccessDeniedException
    | InternalServerException
    | LimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSignalCatalogNodesRequest,
  output: ListSignalCatalogNodesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "nodes",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds, or associates, a vehicle with a fleet.
 */
export const associateVehicleFleet: (
  input: AssociateVehicleFleetRequest,
) => effect.Effect<
  AssociateVehicleFleetResponse,
  | AccessDeniedException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateVehicleFleetRequest,
  output: AssociateVehicleFleetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a fleet that represents a group of vehicles.
 *
 * You must create both a signal catalog and vehicles before you can create a fleet.
 *
 * For more information, see Fleets in the
 * *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const createFleet: (
  input: CreateFleetRequest,
) => effect.Effect<
  CreateFleetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFleetRequest,
  output: CreateFleetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a vehicle.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const updateVehicle: (
  input: UpdateVehicleRequest,
) => effect.Effect<
  UpdateVehicleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVehicleRequest,
  output: UpdateVehicleResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a group, or batch, of vehicles.
 *
 * You must specify a decoder manifest and a vehicle model (model manifest) for each
 * vehicle.
 *
 * For more information, see Create multiple
 * vehicles (AWS CLI) in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const batchCreateVehicle: (
  input: BatchCreateVehicleRequest,
) => effect.Effect<
  BatchCreateVehicleResponse,
  | AccessDeniedException
  | InternalServerException
  | LimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateVehicleRequest,
  output: BatchCreateVehicleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a group, or batch, of vehicles.
 *
 * You must specify a decoder manifest and a vehicle model (model manifest) for each
 * vehicle.
 *
 * For more information, see Update multiple
 * vehicles (AWS CLI) in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const batchUpdateVehicle: (
  input: BatchUpdateVehicleRequest,
) => effect.Effect<
  BatchUpdateVehicleResponse,
  | AccessDeniedException
  | InternalServerException
  | LimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateVehicleRequest,
  output: BatchUpdateVehicleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an orchestration of data collection rules. The Amazon Web Services IoT FleetWise Edge Agent software
 * running in vehicles uses campaigns to decide how to collect and transfer data to the
 * cloud. You create campaigns in the cloud. After you or your team approve campaigns,
 * Amazon Web Services IoT FleetWise automatically deploys them to vehicles.
 *
 * For more information, see Collect and transfer data
 * with campaigns in the *Amazon Web Services IoT FleetWise Developer Guide*.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const createCampaign: (
  input: CreateCampaignRequest,
) => effect.Effect<
  CreateCampaignResponse,
  | AccessDeniedException
  | ConflictException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCampaignRequest,
  output: CreateCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a state template.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const updateStateTemplate: (
  input: UpdateStateTemplateRequest,
) => effect.Effect<
  UpdateStateTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidSignalsException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStateTemplateRequest,
  output: UpdateStateTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidSignalsException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a vehicle model (model manifest) that specifies signals (attributes,
 * branches, sensors, and actuators).
 *
 * For more information, see Vehicle models
 * in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const createModelManifest: (
  input: CreateModelManifestRequest,
) => effect.Effect<
  CreateModelManifestResponse,
  | AccessDeniedException
  | ConflictException
  | InvalidSignalsException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelManifestRequest,
  output: CreateModelManifestResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InvalidSignalsException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a vehicle model (model manifest). If created vehicles are associated with a
 * vehicle model, it can't be updated.
 */
export const updateModelManifest: (
  input: UpdateModelManifestRequest,
) => effect.Effect<
  UpdateModelManifestResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidSignalsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelManifestRequest,
  output: UpdateModelManifestResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidSignalsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a state template. State templates contain state properties, which are signals that belong to a signal catalog that is synchronized between the Amazon Web Services IoT FleetWise Edge and the Amazon Web Services Cloud.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const createStateTemplate: (
  input: CreateStateTemplateRequest,
) => effect.Effect<
  CreateStateTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidSignalsException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStateTemplateRequest,
  output: CreateStateTemplateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidSignalsException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a signal catalog.
 */
export const updateSignalCatalog: (
  input: UpdateSignalCatalogRequest,
) => effect.Effect<
  UpdateSignalCatalogResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidNodeException
  | InvalidSignalsException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSignalCatalogRequest,
  output: UpdateSignalCatalogResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidNodeException,
    InvalidSignalsException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a collection of standardized signals that can be reused to create vehicle
 * models.
 */
export const createSignalCatalog: (
  input: CreateSignalCatalogRequest,
) => effect.Effect<
  CreateSignalCatalogResponse,
  | AccessDeniedException
  | ConflictException
  | InvalidNodeException
  | InvalidSignalsException
  | LimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSignalCatalogRequest,
  output: CreateSignalCatalogResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InvalidNodeException,
    InvalidSignalsException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a decoder manifest using your existing CAN DBC file from your local device.
 *
 * The CAN signal name must be unique and not repeated across CAN message definitions in a .dbc file.
 */
export const importDecoderManifest: (
  input: ImportDecoderManifestRequest,
) => effect.Effect<
  ImportDecoderManifestResponse,
  | AccessDeniedException
  | ConflictException
  | DecoderManifestValidationException
  | InvalidSignalsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportDecoderManifestRequest,
  output: ImportDecoderManifestResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DecoderManifestValidationException,
    InvalidSignalsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a vehicle, which is an instance of a vehicle model (model manifest). Vehicles
 * created from the same vehicle model consist of the same signals inherited from the
 * vehicle model.
 *
 * If you have an existing Amazon Web Services IoT thing, you can use Amazon Web Services IoT FleetWise to create a
 * vehicle and collect data from your thing.
 *
 * For more information, see Create a vehicle
 * (AWS CLI) in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const createVehicle: (
  input: CreateVehicleRequest,
) => effect.Effect<
  CreateVehicleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVehicleRequest,
  output: CreateVehicleResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates the decoder manifest associated with a model manifest. To create a decoder
 * manifest, the following must be true:
 *
 * - Every signal decoder has a unique name.
 *
 * - Each signal decoder is associated with a network interface.
 *
 * - Each network interface has a unique ID.
 *
 * - The signal decoders are specified in the model manifest.
 */
export const createDecoderManifest: (
  input: CreateDecoderManifestRequest,
) => effect.Effect<
  CreateDecoderManifestResponse,
  | AccessDeniedException
  | ConflictException
  | DecoderManifestValidationException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDecoderManifestRequest,
  output: CreateDecoderManifestResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DecoderManifestValidationException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
