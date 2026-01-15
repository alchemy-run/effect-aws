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
  sdkId: "MediaConnect",
  serviceShapeName: "MediaConnect",
});
const auth = T.AwsAuthSigv4({ name: "mediaconnect" });
const ver = T.ServiceVersion("2018-11-14");
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
              `https://mediaconnect-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://mediaconnect-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://mediaconnect.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://mediaconnect.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type MaxResults = number;
export type BridgeArn = string;
export type FlowArn = string;
export type GatewayInstanceArn = string;
export type GatewayArn = string;
export type OfferingArn = string;
export type ReservationArn = string;
export type RouterInputArn = string;
export type RouterNetworkInterfaceArn = string;
export type RouterOutputArn = string;
export type FlowOutputArn = string;
export type FlowSourceArn = string;
export type MediaLiveInputArn = string;
export type SecretArn = string;
export type RoleArn = string;

//# Schemas
export type __listOfString = string[];
export const __listOfString = S.Array(S.String);
export type DesiredState = "ACTIVE" | "STANDBY" | "DELETED" | (string & {});
export const DesiredState = S.String;
export type Algorithm = "aes128" | "aes192" | "aes256" | (string & {});
export const Algorithm = S.String;
export type KeyType = "speke" | "static-key" | "srt-password" | (string & {});
export const KeyType = S.String;
export interface Encryption {
  Algorithm?: Algorithm;
  ConstantInitializationVector?: string;
  DeviceId?: string;
  KeyType?: KeyType;
  Region?: string;
  ResourceId?: string;
  RoleArn?: string;
  SecretArn?: string;
  Url?: string;
}
export const Encryption = S.suspend(() =>
  S.Struct({
    Algorithm: S.optional(Algorithm).pipe(T.JsonName("algorithm")),
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    DeviceId: S.optional(S.String).pipe(T.JsonName("deviceId")),
    KeyType: S.optional(KeyType).pipe(T.JsonName("keyType")),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({ identifier: "Encryption" }) as any as S.Schema<Encryption>;
export type EncodingName = "jxsv" | "raw" | "smpte291" | "pcm" | (string & {});
export const EncodingName = S.String;
export interface InterfaceRequest {
  Name?: string;
}
export const InterfaceRequest = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String).pipe(T.JsonName("name")) }),
).annotations({
  identifier: "InterfaceRequest",
}) as any as S.Schema<InterfaceRequest>;
export interface InputConfigurationRequest {
  InputPort?: number;
  Interface?: InterfaceRequest;
}
export const InputConfigurationRequest = S.suspend(() =>
  S.Struct({
    InputPort: S.optional(S.Number).pipe(T.JsonName("inputPort")),
    Interface: S.optional(InterfaceRequest)
      .pipe(T.JsonName("interface"))
      .annotations({ identifier: "InterfaceRequest" }),
  }),
).annotations({
  identifier: "InputConfigurationRequest",
}) as any as S.Schema<InputConfigurationRequest>;
export type __listOfInputConfigurationRequest = InputConfigurationRequest[];
export const __listOfInputConfigurationRequest = S.Array(
  InputConfigurationRequest,
);
export interface MediaStreamSourceConfigurationRequest {
  EncodingName?: EncodingName;
  InputConfigurations?: InputConfigurationRequest[];
  MediaStreamName?: string;
}
export const MediaStreamSourceConfigurationRequest = S.suspend(() =>
  S.Struct({
    EncodingName: S.optional(EncodingName).pipe(T.JsonName("encodingName")),
    InputConfigurations: S.optional(__listOfInputConfigurationRequest).pipe(
      T.JsonName("inputConfigurations"),
    ),
    MediaStreamName: S.optional(S.String).pipe(T.JsonName("mediaStreamName")),
  }),
).annotations({
  identifier: "MediaStreamSourceConfigurationRequest",
}) as any as S.Schema<MediaStreamSourceConfigurationRequest>;
export type __listOfMediaStreamSourceConfigurationRequest =
  MediaStreamSourceConfigurationRequest[];
export const __listOfMediaStreamSourceConfigurationRequest = S.Array(
  MediaStreamSourceConfigurationRequest,
);
export type Protocol =
  | "zixi-push"
  | "rtp-fec"
  | "rtp"
  | "zixi-pull"
  | "rist"
  | "st2110-jpegxs"
  | "cdi"
  | "srt-listener"
  | "srt-caller"
  | "fujitsu-qos"
  | "udp"
  | "ndi-speed-hq"
  | (string & {});
export const Protocol = S.String;
export interface VpcInterfaceAttachment {
  VpcInterfaceName?: string;
}
export const VpcInterfaceAttachment = S.suspend(() =>
  S.Struct({
    VpcInterfaceName: S.optional(S.String).pipe(T.JsonName("vpcInterfaceName")),
  }),
).annotations({
  identifier: "VpcInterfaceAttachment",
}) as any as S.Schema<VpcInterfaceAttachment>;
export interface SetGatewayBridgeSourceRequest {
  BridgeArn?: string;
  VpcInterfaceAttachment?: VpcInterfaceAttachment;
}
export const SetGatewayBridgeSourceRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment)
      .pipe(T.JsonName("vpcInterfaceAttachment"))
      .annotations({ identifier: "VpcInterfaceAttachment" }),
  }),
).annotations({
  identifier: "SetGatewayBridgeSourceRequest",
}) as any as S.Schema<SetGatewayBridgeSourceRequest>;
export type __mapOfString = { [key: string]: string | undefined };
export const __mapOfString = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type State = "ENABLED" | "DISABLED" | (string & {});
export const State = S.String;
export type FlowTransitEncryptionKeyType =
  | "SECRETS_MANAGER"
  | "AUTOMATIC"
  | (string & {});
export const FlowTransitEncryptionKeyType = S.String;
export interface SecretsManagerEncryptionKeyConfiguration {
  SecretArn: string;
  RoleArn: string;
}
export const SecretsManagerEncryptionKeyConfiguration = S.suspend(() =>
  S.Struct({
    SecretArn: S.String.pipe(T.JsonName("secretArn")),
    RoleArn: S.String.pipe(T.JsonName("roleArn")),
  }),
).annotations({
  identifier: "SecretsManagerEncryptionKeyConfiguration",
}) as any as S.Schema<SecretsManagerEncryptionKeyConfiguration>;
export interface AutomaticEncryptionKeyConfiguration {}
export const AutomaticEncryptionKeyConfiguration = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AutomaticEncryptionKeyConfiguration",
}) as any as S.Schema<AutomaticEncryptionKeyConfiguration>;
export type FlowTransitEncryptionKeyConfiguration =
  | {
      SecretsManager: SecretsManagerEncryptionKeyConfiguration;
      Automatic?: never;
    }
  | { SecretsManager?: never; Automatic: AutomaticEncryptionKeyConfiguration };
export const FlowTransitEncryptionKeyConfiguration = S.Union(
  S.Struct({
    SecretsManager: SecretsManagerEncryptionKeyConfiguration.pipe(
      T.JsonName("secretsManager"),
    ).annotations({ identifier: "SecretsManagerEncryptionKeyConfiguration" }),
  }),
  S.Struct({
    Automatic: AutomaticEncryptionKeyConfiguration.pipe(
      T.JsonName("automatic"),
    ).annotations({ identifier: "AutomaticEncryptionKeyConfiguration" }),
  }),
);
export interface FlowTransitEncryption {
  EncryptionKeyType?: FlowTransitEncryptionKeyType;
  EncryptionKeyConfiguration: FlowTransitEncryptionKeyConfiguration;
}
export const FlowTransitEncryption = S.suspend(() =>
  S.Struct({
    EncryptionKeyType: S.optional(FlowTransitEncryptionKeyType).pipe(
      T.JsonName("encryptionKeyType"),
    ),
    EncryptionKeyConfiguration: FlowTransitEncryptionKeyConfiguration.pipe(
      T.JsonName("encryptionKeyConfiguration"),
    ),
  }),
).annotations({
  identifier: "FlowTransitEncryption",
}) as any as S.Schema<FlowTransitEncryption>;
export interface SetSourceRequest {
  Decryption?: Encryption;
  Description?: string;
  EntitlementArn?: string;
  IngestPort?: number;
  MaxBitrate?: number;
  MaxLatency?: number;
  MaxSyncBuffer?: number;
  MediaStreamSourceConfigurations?: MediaStreamSourceConfigurationRequest[];
  MinLatency?: number;
  Name?: string;
  Protocol?: Protocol;
  SenderControlPort?: number;
  SenderIpAddress?: string;
  SourceListenerAddress?: string;
  SourceListenerPort?: number;
  StreamId?: string;
  VpcInterfaceName?: string;
  WhitelistCidr?: string;
  GatewayBridgeSource?: SetGatewayBridgeSourceRequest;
  SourceTags?: { [key: string]: string | undefined };
  RouterIntegrationState?: State;
  RouterIntegrationTransitDecryption?: FlowTransitEncryption;
}
export const SetSourceRequest = S.suspend(() =>
  S.Struct({
    Decryption: S.optional(Encryption)
      .pipe(T.JsonName("decryption"))
      .annotations({ identifier: "Encryption" }),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
    IngestPort: S.optional(S.Number).pipe(T.JsonName("ingestPort")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MaxLatency: S.optional(S.Number).pipe(T.JsonName("maxLatency")),
    MaxSyncBuffer: S.optional(S.Number).pipe(T.JsonName("maxSyncBuffer")),
    MediaStreamSourceConfigurations: S.optional(
      __listOfMediaStreamSourceConfigurationRequest,
    ).pipe(T.JsonName("mediaStreamSourceConfigurations")),
    MinLatency: S.optional(S.Number).pipe(T.JsonName("minLatency")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
    SenderControlPort: S.optional(S.Number).pipe(
      T.JsonName("senderControlPort"),
    ),
    SenderIpAddress: S.optional(S.String).pipe(T.JsonName("senderIpAddress")),
    SourceListenerAddress: S.optional(S.String).pipe(
      T.JsonName("sourceListenerAddress"),
    ),
    SourceListenerPort: S.optional(S.Number).pipe(
      T.JsonName("sourceListenerPort"),
    ),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
    VpcInterfaceName: S.optional(S.String).pipe(T.JsonName("vpcInterfaceName")),
    WhitelistCidr: S.optional(S.String).pipe(T.JsonName("whitelistCidr")),
    GatewayBridgeSource: S.optional(SetGatewayBridgeSourceRequest)
      .pipe(T.JsonName("gatewayBridgeSource"))
      .annotations({ identifier: "SetGatewayBridgeSourceRequest" }),
    SourceTags: S.optional(__mapOfString).pipe(T.JsonName("sourceTags")),
    RouterIntegrationState: S.optional(State).pipe(
      T.JsonName("routerIntegrationState"),
    ),
    RouterIntegrationTransitDecryption: S.optional(FlowTransitEncryption)
      .pipe(T.JsonName("routerIntegrationTransitDecryption"))
      .annotations({ identifier: "FlowTransitEncryption" }),
  }),
).annotations({
  identifier: "SetSourceRequest",
}) as any as S.Schema<SetSourceRequest>;
export type __listOfSetSourceRequest = SetSourceRequest[];
export const __listOfSetSourceRequest = S.Array(SetSourceRequest);
export type FlowSize = "MEDIUM" | "LARGE" | (string & {});
export const FlowSize = S.String;
export type EntitlementStatus = "ENABLED" | "DISABLED" | (string & {});
export const EntitlementStatus = S.String;
export type MediaStreamType =
  | "video"
  | "audio"
  | "ancillary-data"
  | (string & {});
export const MediaStreamType = S.String;
export type OutputStatus = "ENABLED" | "DISABLED" | (string & {});
export const OutputStatus = S.String;
export type BridgePlacement = "AVAILABLE" | "LOCKED" | (string & {});
export const BridgePlacement = S.String;
export type RoutingScope = "REGIONAL" | "GLOBAL" | (string & {});
export const RoutingScope = S.String;
export type RouterInputTier =
  | "INPUT_100"
  | "INPUT_50"
  | "INPUT_20"
  | (string & {});
export const RouterInputTier = S.String;
export type RouterInputArnList = string[];
export const RouterInputArnList = S.Array(S.String);
export type RouterNetworkInterfaceArnList = string[];
export const RouterNetworkInterfaceArnList = S.Array(S.String);
export type RouterOutputTier =
  | "OUTPUT_100"
  | "OUTPUT_50"
  | "OUTPUT_20"
  | (string & {});
export const RouterOutputTier = S.String;
export type RouterOutputArnList = string[];
export const RouterOutputArnList = S.Array(S.String);
export interface ListEntitlementsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListEntitlementsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/entitlements" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEntitlementsRequest",
}) as any as S.Schema<ListEntitlementsRequest>;
export interface ListTagsForGlobalResourceRequest {
  ResourceArn: string;
}
export const ListTagsForGlobalResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/global/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForGlobalResourceRequest",
}) as any as S.Schema<ListTagsForGlobalResourceRequest>;
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
export interface TagResourceRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")),
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
export interface UntagGlobalResourceRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const UntagGlobalResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(__listOfString).pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/global/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagGlobalResourceRequest",
}) as any as S.Schema<UntagGlobalResourceRequest>;
export interface UntagGlobalResourceResponse {}
export const UntagGlobalResourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UntagGlobalResourceResponse",
}) as any as S.Schema<UntagGlobalResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(__listOfString).pipe(T.HttpQuery("tagKeys")),
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
export interface DescribeBridgeRequest {
  BridgeArn: string;
}
export const DescribeBridgeRequest = S.suspend(() =>
  S.Struct({ BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/bridges/{BridgeArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBridgeRequest",
}) as any as S.Schema<DescribeBridgeRequest>;
export interface DeleteBridgeRequest {
  BridgeArn: string;
}
export const DeleteBridgeRequest = S.suspend(() =>
  S.Struct({ BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/bridges/{BridgeArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBridgeRequest",
}) as any as S.Schema<DeleteBridgeRequest>;
export interface ListBridgesRequest {
  FilterArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListBridgesRequest = S.suspend(() =>
  S.Struct({
    FilterArn: S.optional(S.String).pipe(T.HttpQuery("filterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/bridges" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBridgesRequest",
}) as any as S.Schema<ListBridgesRequest>;
export interface AddBridgeNetworkOutputRequest {
  IpAddress?: string;
  Name?: string;
  NetworkName?: string;
  Port?: number;
  Protocol?: Protocol;
  Ttl?: number;
}
export const AddBridgeNetworkOutputRequest = S.suspend(() =>
  S.Struct({
    IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
    Ttl: S.optional(S.Number).pipe(T.JsonName("ttl")),
  }),
).annotations({
  identifier: "AddBridgeNetworkOutputRequest",
}) as any as S.Schema<AddBridgeNetworkOutputRequest>;
export interface AddBridgeOutputRequest {
  NetworkOutput?: AddBridgeNetworkOutputRequest;
}
export const AddBridgeOutputRequest = S.suspend(() =>
  S.Struct({
    NetworkOutput: S.optional(AddBridgeNetworkOutputRequest)
      .pipe(T.JsonName("networkOutput"))
      .annotations({ identifier: "AddBridgeNetworkOutputRequest" }),
  }),
).annotations({
  identifier: "AddBridgeOutputRequest",
}) as any as S.Schema<AddBridgeOutputRequest>;
export type __listOfAddBridgeOutputRequest = AddBridgeOutputRequest[];
export const __listOfAddBridgeOutputRequest = S.Array(AddBridgeOutputRequest);
export interface AddBridgeOutputsRequest {
  BridgeArn: string;
  Outputs?: AddBridgeOutputRequest[];
}
export const AddBridgeOutputsRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    Outputs: S.optional(__listOfAddBridgeOutputRequest).pipe(
      T.JsonName("outputs"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/bridges/{BridgeArn}/outputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddBridgeOutputsRequest",
}) as any as S.Schema<AddBridgeOutputsRequest>;
export interface AddBridgeFlowSourceRequest {
  FlowArn?: string;
  FlowVpcInterfaceAttachment?: VpcInterfaceAttachment;
  Name?: string;
}
export const AddBridgeFlowSourceRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    FlowVpcInterfaceAttachment: S.optional(VpcInterfaceAttachment)
      .pipe(T.JsonName("flowVpcInterfaceAttachment"))
      .annotations({ identifier: "VpcInterfaceAttachment" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "AddBridgeFlowSourceRequest",
}) as any as S.Schema<AddBridgeFlowSourceRequest>;
export interface MulticastSourceSettings {
  MulticastSourceIp?: string;
}
export const MulticastSourceSettings = S.suspend(() =>
  S.Struct({
    MulticastSourceIp: S.optional(S.String).pipe(
      T.JsonName("multicastSourceIp"),
    ),
  }),
).annotations({
  identifier: "MulticastSourceSettings",
}) as any as S.Schema<MulticastSourceSettings>;
export interface AddBridgeNetworkSourceRequest {
  MulticastIp?: string;
  MulticastSourceSettings?: MulticastSourceSettings;
  Name?: string;
  NetworkName?: string;
  Port?: number;
  Protocol?: Protocol;
}
export const AddBridgeNetworkSourceRequest = S.suspend(() =>
  S.Struct({
    MulticastIp: S.optional(S.String).pipe(T.JsonName("multicastIp")),
    MulticastSourceSettings: S.optional(MulticastSourceSettings)
      .pipe(T.JsonName("multicastSourceSettings"))
      .annotations({ identifier: "MulticastSourceSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
  }),
).annotations({
  identifier: "AddBridgeNetworkSourceRequest",
}) as any as S.Schema<AddBridgeNetworkSourceRequest>;
export interface AddBridgeSourceRequest {
  FlowSource?: AddBridgeFlowSourceRequest;
  NetworkSource?: AddBridgeNetworkSourceRequest;
}
export const AddBridgeSourceRequest = S.suspend(() =>
  S.Struct({
    FlowSource: S.optional(AddBridgeFlowSourceRequest)
      .pipe(T.JsonName("flowSource"))
      .annotations({ identifier: "AddBridgeFlowSourceRequest" }),
    NetworkSource: S.optional(AddBridgeNetworkSourceRequest)
      .pipe(T.JsonName("networkSource"))
      .annotations({ identifier: "AddBridgeNetworkSourceRequest" }),
  }),
).annotations({
  identifier: "AddBridgeSourceRequest",
}) as any as S.Schema<AddBridgeSourceRequest>;
export type __listOfAddBridgeSourceRequest = AddBridgeSourceRequest[];
export const __listOfAddBridgeSourceRequest = S.Array(AddBridgeSourceRequest);
export interface AddBridgeSourcesRequest {
  BridgeArn: string;
  Sources?: AddBridgeSourceRequest[];
}
export const AddBridgeSourcesRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    Sources: S.optional(__listOfAddBridgeSourceRequest).pipe(
      T.JsonName("sources"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/bridges/{BridgeArn}/sources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddBridgeSourcesRequest",
}) as any as S.Schema<AddBridgeSourcesRequest>;
export interface RemoveBridgeOutputRequest {
  BridgeArn: string;
  OutputName: string;
}
export const RemoveBridgeOutputRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    OutputName: S.String.pipe(T.HttpLabel("OutputName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/bridges/{BridgeArn}/outputs/{OutputName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveBridgeOutputRequest",
}) as any as S.Schema<RemoveBridgeOutputRequest>;
export interface RemoveBridgeSourceRequest {
  BridgeArn: string;
  SourceName: string;
}
export const RemoveBridgeSourceRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    SourceName: S.String.pipe(T.HttpLabel("SourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/bridges/{BridgeArn}/sources/{SourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveBridgeSourceRequest",
}) as any as S.Schema<RemoveBridgeSourceRequest>;
export interface UpdateBridgeStateRequest {
  BridgeArn: string;
  DesiredState?: DesiredState;
}
export const UpdateBridgeStateRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    DesiredState: S.optional(DesiredState).pipe(T.JsonName("desiredState")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/bridges/{BridgeArn}/state" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBridgeStateRequest",
}) as any as S.Schema<UpdateBridgeStateRequest>;
export interface DescribeFlowRequest {
  FlowArn: string;
}
export const DescribeFlowRequest = S.suspend(() =>
  S.Struct({ FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/flows/{FlowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFlowRequest",
}) as any as S.Schema<DescribeFlowRequest>;
export interface DeleteFlowRequest {
  FlowArn: string;
}
export const DeleteFlowRequest = S.suspend(() =>
  S.Struct({ FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/flows/{FlowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFlowRequest",
}) as any as S.Schema<DeleteFlowRequest>;
export interface ListFlowsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListFlowsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/flows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFlowsRequest",
}) as any as S.Schema<ListFlowsRequest>;
export type Colorimetry =
  | "BT601"
  | "BT709"
  | "BT2020"
  | "BT2100"
  | "ST2065-1"
  | "ST2065-3"
  | "XYZ"
  | (string & {});
export const Colorimetry = S.String;
export type Range = "NARROW" | "FULL" | "FULLPROTECT" | (string & {});
export const Range = S.String;
export type ScanMode =
  | "progressive"
  | "interlace"
  | "progressive-segmented-frame"
  | (string & {});
export const ScanMode = S.String;
export type Tcs =
  | "SDR"
  | "PQ"
  | "HLG"
  | "LINEAR"
  | "BT2100LINPQ"
  | "BT2100LINHLG"
  | "ST2065-1"
  | "ST428-1"
  | "DENSITY"
  | (string & {});
export const Tcs = S.String;
export interface FmtpRequest {
  ChannelOrder?: string;
  Colorimetry?: Colorimetry;
  ExactFramerate?: string;
  Par?: string;
  Range?: Range;
  ScanMode?: ScanMode;
  Tcs?: Tcs;
}
export const FmtpRequest = S.suspend(() =>
  S.Struct({
    ChannelOrder: S.optional(S.String).pipe(T.JsonName("channelOrder")),
    Colorimetry: S.optional(Colorimetry).pipe(T.JsonName("colorimetry")),
    ExactFramerate: S.optional(S.String).pipe(T.JsonName("exactFramerate")),
    Par: S.optional(S.String).pipe(T.JsonName("par")),
    Range: S.optional(Range).pipe(T.JsonName("range")),
    ScanMode: S.optional(ScanMode).pipe(T.JsonName("scanMode")),
    Tcs: S.optional(Tcs).pipe(T.JsonName("tcs")),
  }),
).annotations({ identifier: "FmtpRequest" }) as any as S.Schema<FmtpRequest>;
export interface MediaStreamAttributesRequest {
  Fmtp?: FmtpRequest;
  Lang?: string;
}
export const MediaStreamAttributesRequest = S.suspend(() =>
  S.Struct({
    Fmtp: S.optional(FmtpRequest)
      .pipe(T.JsonName("fmtp"))
      .annotations({ identifier: "FmtpRequest" }),
    Lang: S.optional(S.String).pipe(T.JsonName("lang")),
  }),
).annotations({
  identifier: "MediaStreamAttributesRequest",
}) as any as S.Schema<MediaStreamAttributesRequest>;
export interface AddMediaStreamRequest {
  Attributes?: MediaStreamAttributesRequest;
  ClockRate?: number;
  Description?: string;
  MediaStreamId?: number;
  MediaStreamName?: string;
  MediaStreamType?: MediaStreamType;
  VideoFormat?: string;
  MediaStreamTags?: { [key: string]: string | undefined };
}
export const AddMediaStreamRequest = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(MediaStreamAttributesRequest)
      .pipe(T.JsonName("attributes"))
      .annotations({ identifier: "MediaStreamAttributesRequest" }),
    ClockRate: S.optional(S.Number).pipe(T.JsonName("clockRate")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    MediaStreamId: S.optional(S.Number).pipe(T.JsonName("mediaStreamId")),
    MediaStreamName: S.optional(S.String).pipe(T.JsonName("mediaStreamName")),
    MediaStreamType: S.optional(MediaStreamType).pipe(
      T.JsonName("mediaStreamType"),
    ),
    VideoFormat: S.optional(S.String).pipe(T.JsonName("videoFormat")),
    MediaStreamTags: S.optional(__mapOfString).pipe(
      T.JsonName("mediaStreamTags"),
    ),
  }),
).annotations({
  identifier: "AddMediaStreamRequest",
}) as any as S.Schema<AddMediaStreamRequest>;
export type __listOfAddMediaStreamRequest = AddMediaStreamRequest[];
export const __listOfAddMediaStreamRequest = S.Array(AddMediaStreamRequest);
export interface AddFlowMediaStreamsRequest {
  FlowArn: string;
  MediaStreams?: AddMediaStreamRequest[];
}
export const AddFlowMediaStreamsRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    MediaStreams: S.optional(__listOfAddMediaStreamRequest).pipe(
      T.JsonName("mediaStreams"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/mediaStreams" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddFlowMediaStreamsRequest",
}) as any as S.Schema<AddFlowMediaStreamsRequest>;
export interface DestinationConfigurationRequest {
  DestinationIp?: string;
  DestinationPort?: number;
  Interface?: InterfaceRequest;
}
export const DestinationConfigurationRequest = S.suspend(() =>
  S.Struct({
    DestinationIp: S.optional(S.String).pipe(T.JsonName("destinationIp")),
    DestinationPort: S.optional(S.Number).pipe(T.JsonName("destinationPort")),
    Interface: S.optional(InterfaceRequest)
      .pipe(T.JsonName("interface"))
      .annotations({ identifier: "InterfaceRequest" }),
  }),
).annotations({
  identifier: "DestinationConfigurationRequest",
}) as any as S.Schema<DestinationConfigurationRequest>;
export type __listOfDestinationConfigurationRequest =
  DestinationConfigurationRequest[];
export const __listOfDestinationConfigurationRequest = S.Array(
  DestinationConfigurationRequest,
);
export type EncoderProfile = "main" | "high" | (string & {});
export const EncoderProfile = S.String;
export interface EncodingParametersRequest {
  CompressionFactor?: number;
  EncoderProfile?: EncoderProfile;
}
export const EncodingParametersRequest = S.suspend(() =>
  S.Struct({
    CompressionFactor: S.optional(S.Number).pipe(
      T.JsonName("compressionFactor"),
    ),
    EncoderProfile: S.optional(EncoderProfile).pipe(
      T.JsonName("encoderProfile"),
    ),
  }),
).annotations({
  identifier: "EncodingParametersRequest",
}) as any as S.Schema<EncodingParametersRequest>;
export interface MediaStreamOutputConfigurationRequest {
  DestinationConfigurations?: DestinationConfigurationRequest[];
  EncodingName?: EncodingName;
  EncodingParameters?: EncodingParametersRequest;
  MediaStreamName?: string;
}
export const MediaStreamOutputConfigurationRequest = S.suspend(() =>
  S.Struct({
    DestinationConfigurations: S.optional(
      __listOfDestinationConfigurationRequest,
    ).pipe(T.JsonName("destinationConfigurations")),
    EncodingName: S.optional(EncodingName).pipe(T.JsonName("encodingName")),
    EncodingParameters: S.optional(EncodingParametersRequest)
      .pipe(T.JsonName("encodingParameters"))
      .annotations({ identifier: "EncodingParametersRequest" }),
    MediaStreamName: S.optional(S.String).pipe(T.JsonName("mediaStreamName")),
  }),
).annotations({
  identifier: "MediaStreamOutputConfigurationRequest",
}) as any as S.Schema<MediaStreamOutputConfigurationRequest>;
export type __listOfMediaStreamOutputConfigurationRequest =
  MediaStreamOutputConfigurationRequest[];
export const __listOfMediaStreamOutputConfigurationRequest = S.Array(
  MediaStreamOutputConfigurationRequest,
);
export interface AddOutputRequest {
  CidrAllowList?: string[];
  Description?: string;
  Destination?: string;
  Encryption?: Encryption;
  MaxLatency?: number;
  MediaStreamOutputConfigurations?: MediaStreamOutputConfigurationRequest[];
  MinLatency?: number;
  Name?: string;
  Port?: number;
  Protocol?: Protocol;
  RemoteId?: string;
  SenderControlPort?: number;
  SmoothingLatency?: number;
  StreamId?: string;
  VpcInterfaceAttachment?: VpcInterfaceAttachment;
  OutputStatus?: OutputStatus;
  NdiSpeedHqQuality?: number;
  NdiProgramName?: string;
  OutputTags?: { [key: string]: string | undefined };
  RouterIntegrationState?: State;
  RouterIntegrationTransitEncryption?: FlowTransitEncryption;
}
export const AddOutputRequest = S.suspend(() =>
  S.Struct({
    CidrAllowList: S.optional(__listOfString).pipe(T.JsonName("cidrAllowList")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    Encryption: S.optional(Encryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "Encryption" }),
    MaxLatency: S.optional(S.Number).pipe(T.JsonName("maxLatency")),
    MediaStreamOutputConfigurations: S.optional(
      __listOfMediaStreamOutputConfigurationRequest,
    ).pipe(T.JsonName("mediaStreamOutputConfigurations")),
    MinLatency: S.optional(S.Number).pipe(T.JsonName("minLatency")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
    RemoteId: S.optional(S.String).pipe(T.JsonName("remoteId")),
    SenderControlPort: S.optional(S.Number).pipe(
      T.JsonName("senderControlPort"),
    ),
    SmoothingLatency: S.optional(S.Number).pipe(T.JsonName("smoothingLatency")),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
    VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment)
      .pipe(T.JsonName("vpcInterfaceAttachment"))
      .annotations({ identifier: "VpcInterfaceAttachment" }),
    OutputStatus: S.optional(OutputStatus).pipe(T.JsonName("outputStatus")),
    NdiSpeedHqQuality: S.optional(S.Number).pipe(
      T.JsonName("ndiSpeedHqQuality"),
    ),
    NdiProgramName: S.optional(S.String).pipe(T.JsonName("ndiProgramName")),
    OutputTags: S.optional(__mapOfString).pipe(T.JsonName("outputTags")),
    RouterIntegrationState: S.optional(State).pipe(
      T.JsonName("routerIntegrationState"),
    ),
    RouterIntegrationTransitEncryption: S.optional(FlowTransitEncryption)
      .pipe(T.JsonName("routerIntegrationTransitEncryption"))
      .annotations({ identifier: "FlowTransitEncryption" }),
  }),
).annotations({
  identifier: "AddOutputRequest",
}) as any as S.Schema<AddOutputRequest>;
export type __listOfAddOutputRequest = AddOutputRequest[];
export const __listOfAddOutputRequest = S.Array(AddOutputRequest);
export interface AddFlowOutputsRequest {
  FlowArn: string;
  Outputs?: AddOutputRequest[];
}
export const AddFlowOutputsRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    Outputs: S.optional(__listOfAddOutputRequest).pipe(T.JsonName("outputs")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/outputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddFlowOutputsRequest",
}) as any as S.Schema<AddFlowOutputsRequest>;
export interface AddFlowSourcesRequest {
  FlowArn: string;
  Sources?: SetSourceRequest[];
}
export const AddFlowSourcesRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    Sources: S.optional(__listOfSetSourceRequest).pipe(T.JsonName("sources")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/source" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddFlowSourcesRequest",
}) as any as S.Schema<AddFlowSourcesRequest>;
export type NetworkInterfaceType = "ena" | "efa" | (string & {});
export const NetworkInterfaceType = S.String;
export interface VpcInterfaceRequest {
  Name?: string;
  NetworkInterfaceType?: NetworkInterfaceType;
  RoleArn?: string;
  SecurityGroupIds?: string[];
  SubnetId?: string;
  VpcInterfaceTags?: { [key: string]: string | undefined };
}
export const VpcInterfaceRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkInterfaceType: S.optional(NetworkInterfaceType).pipe(
      T.JsonName("networkInterfaceType"),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    SecurityGroupIds: S.optional(__listOfString).pipe(
      T.JsonName("securityGroupIds"),
    ),
    SubnetId: S.optional(S.String).pipe(T.JsonName("subnetId")),
    VpcInterfaceTags: S.optional(__mapOfString).pipe(
      T.JsonName("vpcInterfaceTags"),
    ),
  }),
).annotations({
  identifier: "VpcInterfaceRequest",
}) as any as S.Schema<VpcInterfaceRequest>;
export type __listOfVpcInterfaceRequest = VpcInterfaceRequest[];
export const __listOfVpcInterfaceRequest = S.Array(VpcInterfaceRequest);
export interface AddFlowVpcInterfacesRequest {
  FlowArn: string;
  VpcInterfaces?: VpcInterfaceRequest[];
}
export const AddFlowVpcInterfacesRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    VpcInterfaces: S.optional(__listOfVpcInterfaceRequest).pipe(
      T.JsonName("vpcInterfaces"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/vpcInterfaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddFlowVpcInterfacesRequest",
}) as any as S.Schema<AddFlowVpcInterfacesRequest>;
export interface DescribeFlowSourceMetadataRequest {
  FlowArn: string;
}
export const DescribeFlowSourceMetadataRequest = S.suspend(() =>
  S.Struct({ FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/flows/{FlowArn}/source-metadata" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFlowSourceMetadataRequest",
}) as any as S.Schema<DescribeFlowSourceMetadataRequest>;
export interface DescribeFlowSourceThumbnailRequest {
  FlowArn: string;
}
export const DescribeFlowSourceThumbnailRequest = S.suspend(() =>
  S.Struct({ FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/flows/{FlowArn}/source-thumbnail" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFlowSourceThumbnailRequest",
}) as any as S.Schema<DescribeFlowSourceThumbnailRequest>;
export interface GrantEntitlementRequest {
  DataTransferSubscriberFeePercent?: number;
  Description?: string;
  Encryption?: Encryption;
  EntitlementStatus?: EntitlementStatus;
  Name?: string;
  Subscribers?: string[];
  EntitlementTags?: { [key: string]: string | undefined };
}
export const GrantEntitlementRequest = S.suspend(() =>
  S.Struct({
    DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
      T.JsonName("dataTransferSubscriberFeePercent"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Encryption: S.optional(Encryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "Encryption" }),
    EntitlementStatus: S.optional(EntitlementStatus).pipe(
      T.JsonName("entitlementStatus"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Subscribers: S.optional(__listOfString).pipe(T.JsonName("subscribers")),
    EntitlementTags: S.optional(__mapOfString).pipe(
      T.JsonName("entitlementTags"),
    ),
  }),
).annotations({
  identifier: "GrantEntitlementRequest",
}) as any as S.Schema<GrantEntitlementRequest>;
export type __listOfGrantEntitlementRequest = GrantEntitlementRequest[];
export const __listOfGrantEntitlementRequest = S.Array(GrantEntitlementRequest);
export interface GrantFlowEntitlementsRequest {
  Entitlements?: GrantEntitlementRequest[];
  FlowArn: string;
}
export const GrantFlowEntitlementsRequest = S.suspend(() =>
  S.Struct({
    Entitlements: S.optional(__listOfGrantEntitlementRequest).pipe(
      T.JsonName("entitlements"),
    ),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/entitlements" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GrantFlowEntitlementsRequest",
}) as any as S.Schema<GrantFlowEntitlementsRequest>;
export interface RemoveFlowMediaStreamRequest {
  FlowArn: string;
  MediaStreamName: string;
}
export const RemoveFlowMediaStreamRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    MediaStreamName: S.String.pipe(T.HttpLabel("MediaStreamName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/flows/{FlowArn}/mediaStreams/{MediaStreamName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveFlowMediaStreamRequest",
}) as any as S.Schema<RemoveFlowMediaStreamRequest>;
export interface RemoveFlowOutputRequest {
  FlowArn: string;
  OutputArn: string;
}
export const RemoveFlowOutputRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    OutputArn: S.String.pipe(T.HttpLabel("OutputArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/flows/{FlowArn}/outputs/{OutputArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveFlowOutputRequest",
}) as any as S.Schema<RemoveFlowOutputRequest>;
export interface RemoveFlowSourceRequest {
  FlowArn: string;
  SourceArn: string;
}
export const RemoveFlowSourceRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    SourceArn: S.String.pipe(T.HttpLabel("SourceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/flows/{FlowArn}/source/{SourceArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveFlowSourceRequest",
}) as any as S.Schema<RemoveFlowSourceRequest>;
export interface RemoveFlowVpcInterfaceRequest {
  FlowArn: string;
  VpcInterfaceName: string;
}
export const RemoveFlowVpcInterfaceRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    VpcInterfaceName: S.String.pipe(T.HttpLabel("VpcInterfaceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/flows/{FlowArn}/vpcInterfaces/{VpcInterfaceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveFlowVpcInterfaceRequest",
}) as any as S.Schema<RemoveFlowVpcInterfaceRequest>;
export interface RevokeFlowEntitlementRequest {
  EntitlementArn: string;
  FlowArn: string;
}
export const RevokeFlowEntitlementRequest = S.suspend(() =>
  S.Struct({
    EntitlementArn: S.String.pipe(T.HttpLabel("EntitlementArn")),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/flows/{FlowArn}/entitlements/{EntitlementArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeFlowEntitlementRequest",
}) as any as S.Schema<RevokeFlowEntitlementRequest>;
export interface StartFlowRequest {
  FlowArn: string;
}
export const StartFlowRequest = S.suspend(() =>
  S.Struct({ FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/flows/start/{FlowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartFlowRequest",
}) as any as S.Schema<StartFlowRequest>;
export interface StopFlowRequest {
  FlowArn: string;
}
export const StopFlowRequest = S.suspend(() =>
  S.Struct({ FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/flows/stop/{FlowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopFlowRequest",
}) as any as S.Schema<StopFlowRequest>;
export interface DescribeGatewayInstanceRequest {
  GatewayInstanceArn: string;
}
export const DescribeGatewayInstanceRequest = S.suspend(() =>
  S.Struct({
    GatewayInstanceArn: S.String.pipe(T.HttpLabel("GatewayInstanceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/gateway-instances/{GatewayInstanceArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeGatewayInstanceRequest",
}) as any as S.Schema<DescribeGatewayInstanceRequest>;
export interface UpdateGatewayInstanceRequest {
  BridgePlacement?: BridgePlacement;
  GatewayInstanceArn: string;
}
export const UpdateGatewayInstanceRequest = S.suspend(() =>
  S.Struct({
    BridgePlacement: S.optional(BridgePlacement).pipe(
      T.JsonName("bridgePlacement"),
    ),
    GatewayInstanceArn: S.String.pipe(T.HttpLabel("GatewayInstanceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/gateway-instances/{GatewayInstanceArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGatewayInstanceRequest",
}) as any as S.Schema<UpdateGatewayInstanceRequest>;
export interface DeregisterGatewayInstanceRequest {
  Force?: boolean;
  GatewayInstanceArn: string;
}
export const DeregisterGatewayInstanceRequest = S.suspend(() =>
  S.Struct({
    Force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    GatewayInstanceArn: S.String.pipe(T.HttpLabel("GatewayInstanceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/gateway-instances/{GatewayInstanceArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterGatewayInstanceRequest",
}) as any as S.Schema<DeregisterGatewayInstanceRequest>;
export interface ListGatewayInstancesRequest {
  FilterArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListGatewayInstancesRequest = S.suspend(() =>
  S.Struct({
    FilterArn: S.optional(S.String).pipe(T.HttpQuery("filterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/gateway-instances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGatewayInstancesRequest",
}) as any as S.Schema<ListGatewayInstancesRequest>;
export interface DescribeGatewayRequest {
  GatewayArn: string;
}
export const DescribeGatewayRequest = S.suspend(() =>
  S.Struct({ GatewayArn: S.String.pipe(T.HttpLabel("GatewayArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/gateways/{GatewayArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeGatewayRequest",
}) as any as S.Schema<DescribeGatewayRequest>;
export interface DeleteGatewayRequest {
  GatewayArn: string;
}
export const DeleteGatewayRequest = S.suspend(() =>
  S.Struct({ GatewayArn: S.String.pipe(T.HttpLabel("GatewayArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/gateways/{GatewayArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGatewayRequest",
}) as any as S.Schema<DeleteGatewayRequest>;
export interface ListGatewaysRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListGatewaysRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/gateways" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGatewaysRequest",
}) as any as S.Schema<ListGatewaysRequest>;
export interface DescribeOfferingRequest {
  OfferingArn: string;
}
export const DescribeOfferingRequest = S.suspend(() =>
  S.Struct({ OfferingArn: S.String.pipe(T.HttpLabel("OfferingArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/offerings/{OfferingArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOfferingRequest",
}) as any as S.Schema<DescribeOfferingRequest>;
export interface ListOfferingsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListOfferingsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/offerings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOfferingsRequest",
}) as any as S.Schema<ListOfferingsRequest>;
export interface PurchaseOfferingRequest {
  OfferingArn: string;
  ReservationName?: string;
  Start?: string;
}
export const PurchaseOfferingRequest = S.suspend(() =>
  S.Struct({
    OfferingArn: S.String.pipe(T.HttpLabel("OfferingArn")),
    ReservationName: S.optional(S.String).pipe(T.JsonName("reservationName")),
    Start: S.optional(S.String).pipe(T.JsonName("start")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/offerings/{OfferingArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PurchaseOfferingRequest",
}) as any as S.Schema<PurchaseOfferingRequest>;
export interface DescribeReservationRequest {
  ReservationArn: string;
}
export const DescribeReservationRequest = S.suspend(() =>
  S.Struct({
    ReservationArn: S.String.pipe(T.HttpLabel("ReservationArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/reservations/{ReservationArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReservationRequest",
}) as any as S.Schema<DescribeReservationRequest>;
export interface ListReservationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListReservationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/reservations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReservationsRequest",
}) as any as S.Schema<ListReservationsRequest>;
export interface GetRouterInputRequest {
  Arn: string;
}
export const GetRouterInputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/routerInput/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRouterInputRequest",
}) as any as S.Schema<GetRouterInputRequest>;
export type ForwardErrorCorrectionState =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const ForwardErrorCorrectionState = S.String;
export interface RtpRouterInputConfiguration {
  Port: number;
  ForwardErrorCorrection?: ForwardErrorCorrectionState;
}
export const RtpRouterInputConfiguration = S.suspend(() =>
  S.Struct({
    Port: S.Number.pipe(T.JsonName("port")),
    ForwardErrorCorrection: S.optional(ForwardErrorCorrectionState).pipe(
      T.JsonName("forwardErrorCorrection"),
    ),
  }),
).annotations({
  identifier: "RtpRouterInputConfiguration",
}) as any as S.Schema<RtpRouterInputConfiguration>;
export interface RistRouterInputConfiguration {
  Port: number;
  RecoveryLatencyMilliseconds: number;
}
export const RistRouterInputConfiguration = S.suspend(() =>
  S.Struct({
    Port: S.Number.pipe(T.JsonName("port")),
    RecoveryLatencyMilliseconds: S.Number.pipe(
      T.JsonName("recoveryLatencyMilliseconds"),
    ),
  }),
).annotations({
  identifier: "RistRouterInputConfiguration",
}) as any as S.Schema<RistRouterInputConfiguration>;
export interface SrtDecryptionConfiguration {
  EncryptionKey: SecretsManagerEncryptionKeyConfiguration;
}
export const SrtDecryptionConfiguration = S.suspend(() =>
  S.Struct({
    EncryptionKey: SecretsManagerEncryptionKeyConfiguration.pipe(
      T.JsonName("encryptionKey"),
    ).annotations({ identifier: "SecretsManagerEncryptionKeyConfiguration" }),
  }),
).annotations({
  identifier: "SrtDecryptionConfiguration",
}) as any as S.Schema<SrtDecryptionConfiguration>;
export interface SrtListenerRouterInputConfiguration {
  Port: number;
  MinimumLatencyMilliseconds: number;
  DecryptionConfiguration?: SrtDecryptionConfiguration;
}
export const SrtListenerRouterInputConfiguration = S.suspend(() =>
  S.Struct({
    Port: S.Number.pipe(T.JsonName("port")),
    MinimumLatencyMilliseconds: S.Number.pipe(
      T.JsonName("minimumLatencyMilliseconds"),
    ),
    DecryptionConfiguration: S.optional(SrtDecryptionConfiguration)
      .pipe(T.JsonName("decryptionConfiguration"))
      .annotations({ identifier: "SrtDecryptionConfiguration" }),
  }),
).annotations({
  identifier: "SrtListenerRouterInputConfiguration",
}) as any as S.Schema<SrtListenerRouterInputConfiguration>;
export interface SrtCallerRouterInputConfiguration {
  SourceAddress: string;
  SourcePort: number;
  MinimumLatencyMilliseconds: number;
  StreamId?: string;
  DecryptionConfiguration?: SrtDecryptionConfiguration;
}
export const SrtCallerRouterInputConfiguration = S.suspend(() =>
  S.Struct({
    SourceAddress: S.String.pipe(T.JsonName("sourceAddress")),
    SourcePort: S.Number.pipe(T.JsonName("sourcePort")),
    MinimumLatencyMilliseconds: S.Number.pipe(
      T.JsonName("minimumLatencyMilliseconds"),
    ),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
    DecryptionConfiguration: S.optional(SrtDecryptionConfiguration)
      .pipe(T.JsonName("decryptionConfiguration"))
      .annotations({ identifier: "SrtDecryptionConfiguration" }),
  }),
).annotations({
  identifier: "SrtCallerRouterInputConfiguration",
}) as any as S.Schema<SrtCallerRouterInputConfiguration>;
export type RouterInputProtocolConfiguration =
  | {
      Rtp: RtpRouterInputConfiguration;
      Rist?: never;
      SrtListener?: never;
      SrtCaller?: never;
    }
  | {
      Rtp?: never;
      Rist: RistRouterInputConfiguration;
      SrtListener?: never;
      SrtCaller?: never;
    }
  | {
      Rtp?: never;
      Rist?: never;
      SrtListener: SrtListenerRouterInputConfiguration;
      SrtCaller?: never;
    }
  | {
      Rtp?: never;
      Rist?: never;
      SrtListener?: never;
      SrtCaller: SrtCallerRouterInputConfiguration;
    };
export const RouterInputProtocolConfiguration = S.Union(
  S.Struct({
    Rtp: RtpRouterInputConfiguration.pipe(T.JsonName("rtp")).annotations({
      identifier: "RtpRouterInputConfiguration",
    }),
  }),
  S.Struct({
    Rist: RistRouterInputConfiguration.pipe(T.JsonName("rist")).annotations({
      identifier: "RistRouterInputConfiguration",
    }),
  }),
  S.Struct({
    SrtListener: SrtListenerRouterInputConfiguration.pipe(
      T.JsonName("srtListener"),
    ).annotations({ identifier: "SrtListenerRouterInputConfiguration" }),
  }),
  S.Struct({
    SrtCaller: SrtCallerRouterInputConfiguration.pipe(
      T.JsonName("srtCaller"),
    ).annotations({ identifier: "SrtCallerRouterInputConfiguration" }),
  }),
);
export type RouterInputProtocol =
  | "RTP"
  | "RIST"
  | "SRT_CALLER"
  | "SRT_LISTENER"
  | (string & {});
export const RouterInputProtocol = S.String;
export interface StandardRouterInputConfiguration {
  NetworkInterfaceArn: string;
  ProtocolConfiguration: RouterInputProtocolConfiguration;
  Protocol?: RouterInputProtocol;
}
export const StandardRouterInputConfiguration = S.suspend(() =>
  S.Struct({
    NetworkInterfaceArn: S.String.pipe(T.JsonName("networkInterfaceArn")),
    ProtocolConfiguration: RouterInputProtocolConfiguration.pipe(
      T.JsonName("protocolConfiguration"),
    ),
    Protocol: S.optional(RouterInputProtocol).pipe(T.JsonName("protocol")),
  }),
).annotations({
  identifier: "StandardRouterInputConfiguration",
}) as any as S.Schema<StandardRouterInputConfiguration>;
export type FailoverRouterInputProtocolConfiguration =
  | {
      Rtp: RtpRouterInputConfiguration;
      Rist?: never;
      SrtListener?: never;
      SrtCaller?: never;
    }
  | {
      Rtp?: never;
      Rist: RistRouterInputConfiguration;
      SrtListener?: never;
      SrtCaller?: never;
    }
  | {
      Rtp?: never;
      Rist?: never;
      SrtListener: SrtListenerRouterInputConfiguration;
      SrtCaller?: never;
    }
  | {
      Rtp?: never;
      Rist?: never;
      SrtListener?: never;
      SrtCaller: SrtCallerRouterInputConfiguration;
    };
export const FailoverRouterInputProtocolConfiguration = S.Union(
  S.Struct({
    Rtp: RtpRouterInputConfiguration.pipe(T.JsonName("rtp")).annotations({
      identifier: "RtpRouterInputConfiguration",
    }),
  }),
  S.Struct({
    Rist: RistRouterInputConfiguration.pipe(T.JsonName("rist")).annotations({
      identifier: "RistRouterInputConfiguration",
    }),
  }),
  S.Struct({
    SrtListener: SrtListenerRouterInputConfiguration.pipe(
      T.JsonName("srtListener"),
    ).annotations({ identifier: "SrtListenerRouterInputConfiguration" }),
  }),
  S.Struct({
    SrtCaller: SrtCallerRouterInputConfiguration.pipe(
      T.JsonName("srtCaller"),
    ).annotations({ identifier: "SrtCallerRouterInputConfiguration" }),
  }),
);
export type FailoverRouterInputProtocolConfigurationList =
  FailoverRouterInputProtocolConfiguration[];
export const FailoverRouterInputProtocolConfigurationList = S.Array(
  FailoverRouterInputProtocolConfiguration,
);
export type FailoverInputSourcePriorityMode =
  | "NO_PRIORITY"
  | "PRIMARY_SECONDARY"
  | (string & {});
export const FailoverInputSourcePriorityMode = S.String;
export interface FailoverRouterInputConfiguration {
  NetworkInterfaceArn: string;
  ProtocolConfigurations: FailoverRouterInputProtocolConfiguration[];
  SourcePriorityMode: FailoverInputSourcePriorityMode;
  PrimarySourceIndex?: number;
}
export const FailoverRouterInputConfiguration = S.suspend(() =>
  S.Struct({
    NetworkInterfaceArn: S.String.pipe(T.JsonName("networkInterfaceArn")),
    ProtocolConfigurations: FailoverRouterInputProtocolConfigurationList.pipe(
      T.JsonName("protocolConfigurations"),
    ),
    SourcePriorityMode: FailoverInputSourcePriorityMode.pipe(
      T.JsonName("sourcePriorityMode"),
    ),
    PrimarySourceIndex: S.optional(S.Number).pipe(
      T.JsonName("primarySourceIndex"),
    ),
  }),
).annotations({
  identifier: "FailoverRouterInputConfiguration",
}) as any as S.Schema<FailoverRouterInputConfiguration>;
export type MergeRouterInputProtocolConfiguration =
  | { Rtp: RtpRouterInputConfiguration; Rist?: never }
  | { Rtp?: never; Rist: RistRouterInputConfiguration };
export const MergeRouterInputProtocolConfiguration = S.Union(
  S.Struct({
    Rtp: RtpRouterInputConfiguration.pipe(T.JsonName("rtp")).annotations({
      identifier: "RtpRouterInputConfiguration",
    }),
  }),
  S.Struct({
    Rist: RistRouterInputConfiguration.pipe(T.JsonName("rist")).annotations({
      identifier: "RistRouterInputConfiguration",
    }),
  }),
);
export type MergeRouterInputProtocolConfigurationList =
  MergeRouterInputProtocolConfiguration[];
export const MergeRouterInputProtocolConfigurationList = S.Array(
  MergeRouterInputProtocolConfiguration,
);
export interface MergeRouterInputConfiguration {
  NetworkInterfaceArn: string;
  ProtocolConfigurations: MergeRouterInputProtocolConfiguration[];
  MergeRecoveryWindowMilliseconds: number;
}
export const MergeRouterInputConfiguration = S.suspend(() =>
  S.Struct({
    NetworkInterfaceArn: S.String.pipe(T.JsonName("networkInterfaceArn")),
    ProtocolConfigurations: MergeRouterInputProtocolConfigurationList.pipe(
      T.JsonName("protocolConfigurations"),
    ),
    MergeRecoveryWindowMilliseconds: S.Number.pipe(
      T.JsonName("mergeRecoveryWindowMilliseconds"),
    ),
  }),
).annotations({
  identifier: "MergeRouterInputConfiguration",
}) as any as S.Schema<MergeRouterInputConfiguration>;
export interface MediaConnectFlowRouterInputConfiguration {
  FlowArn?: string;
  FlowOutputArn?: string;
  SourceTransitDecryption: FlowTransitEncryption;
}
export const MediaConnectFlowRouterInputConfiguration = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    FlowOutputArn: S.optional(S.String).pipe(T.JsonName("flowOutputArn")),
    SourceTransitDecryption: FlowTransitEncryption.pipe(
      T.JsonName("sourceTransitDecryption"),
    ).annotations({ identifier: "FlowTransitEncryption" }),
  }),
).annotations({
  identifier: "MediaConnectFlowRouterInputConfiguration",
}) as any as S.Schema<MediaConnectFlowRouterInputConfiguration>;
export type RouterInputConfiguration =
  | {
      Standard: StandardRouterInputConfiguration;
      Failover?: never;
      Merge?: never;
      MediaConnectFlow?: never;
    }
  | {
      Standard?: never;
      Failover: FailoverRouterInputConfiguration;
      Merge?: never;
      MediaConnectFlow?: never;
    }
  | {
      Standard?: never;
      Failover?: never;
      Merge: MergeRouterInputConfiguration;
      MediaConnectFlow?: never;
    }
  | {
      Standard?: never;
      Failover?: never;
      Merge?: never;
      MediaConnectFlow: MediaConnectFlowRouterInputConfiguration;
    };
export const RouterInputConfiguration = S.Union(
  S.Struct({
    Standard: StandardRouterInputConfiguration.pipe(
      T.JsonName("standard"),
    ).annotations({ identifier: "StandardRouterInputConfiguration" }),
  }),
  S.Struct({
    Failover: FailoverRouterInputConfiguration.pipe(
      T.JsonName("failover"),
    ).annotations({ identifier: "FailoverRouterInputConfiguration" }),
  }),
  S.Struct({
    Merge: MergeRouterInputConfiguration.pipe(T.JsonName("merge")).annotations({
      identifier: "MergeRouterInputConfiguration",
    }),
  }),
  S.Struct({
    MediaConnectFlow: MediaConnectFlowRouterInputConfiguration.pipe(
      T.JsonName("mediaConnectFlow"),
    ).annotations({ identifier: "MediaConnectFlowRouterInputConfiguration" }),
  }),
);
export type RouterInputTransitEncryptionKeyType =
  | "SECRETS_MANAGER"
  | "AUTOMATIC"
  | (string & {});
export const RouterInputTransitEncryptionKeyType = S.String;
export type RouterInputTransitEncryptionKeyConfiguration =
  | {
      SecretsManager: SecretsManagerEncryptionKeyConfiguration;
      Automatic?: never;
    }
  | { SecretsManager?: never; Automatic: AutomaticEncryptionKeyConfiguration };
export const RouterInputTransitEncryptionKeyConfiguration = S.Union(
  S.Struct({
    SecretsManager: SecretsManagerEncryptionKeyConfiguration.pipe(
      T.JsonName("secretsManager"),
    ).annotations({ identifier: "SecretsManagerEncryptionKeyConfiguration" }),
  }),
  S.Struct({
    Automatic: AutomaticEncryptionKeyConfiguration.pipe(
      T.JsonName("automatic"),
    ).annotations({ identifier: "AutomaticEncryptionKeyConfiguration" }),
  }),
);
export interface RouterInputTransitEncryption {
  EncryptionKeyType?: RouterInputTransitEncryptionKeyType;
  EncryptionKeyConfiguration: RouterInputTransitEncryptionKeyConfiguration;
}
export const RouterInputTransitEncryption = S.suspend(() =>
  S.Struct({
    EncryptionKeyType: S.optional(RouterInputTransitEncryptionKeyType).pipe(
      T.JsonName("encryptionKeyType"),
    ),
    EncryptionKeyConfiguration:
      RouterInputTransitEncryptionKeyConfiguration.pipe(
        T.JsonName("encryptionKeyConfiguration"),
      ),
  }),
).annotations({
  identifier: "RouterInputTransitEncryption",
}) as any as S.Schema<RouterInputTransitEncryption>;
export type Day =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"
  | (string & {});
export const Day = S.String;
export interface PreferredDayTimeMaintenanceConfiguration {
  Day: Day;
  Time: string;
}
export const PreferredDayTimeMaintenanceConfiguration = S.suspend(() =>
  S.Struct({
    Day: Day.pipe(T.JsonName("day")),
    Time: S.String.pipe(T.JsonName("time")),
  }),
).annotations({
  identifier: "PreferredDayTimeMaintenanceConfiguration",
}) as any as S.Schema<PreferredDayTimeMaintenanceConfiguration>;
export interface DefaultMaintenanceConfiguration {}
export const DefaultMaintenanceConfiguration = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DefaultMaintenanceConfiguration",
}) as any as S.Schema<DefaultMaintenanceConfiguration>;
export type MaintenanceConfiguration =
  | {
      PreferredDayTime: PreferredDayTimeMaintenanceConfiguration;
      Default?: never;
    }
  | { PreferredDayTime?: never; Default: DefaultMaintenanceConfiguration };
export const MaintenanceConfiguration = S.Union(
  S.Struct({
    PreferredDayTime: PreferredDayTimeMaintenanceConfiguration.pipe(
      T.JsonName("preferredDayTime"),
    ).annotations({ identifier: "PreferredDayTimeMaintenanceConfiguration" }),
  }),
  S.Struct({
    Default: DefaultMaintenanceConfiguration.pipe(
      T.JsonName("default"),
    ).annotations({ identifier: "DefaultMaintenanceConfiguration" }),
  }),
);
export interface UpdateRouterInputRequest {
  Arn: string;
  Name?: string;
  Configuration?: RouterInputConfiguration;
  MaximumBitrate?: number;
  RoutingScope?: RoutingScope;
  Tier?: RouterInputTier;
  TransitEncryption?: RouterInputTransitEncryption;
  MaintenanceConfiguration?: MaintenanceConfiguration;
}
export const UpdateRouterInputRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Configuration: S.optional(RouterInputConfiguration).pipe(
      T.JsonName("configuration"),
    ),
    MaximumBitrate: S.optional(S.Number).pipe(T.JsonName("maximumBitrate")),
    RoutingScope: S.optional(RoutingScope).pipe(T.JsonName("routingScope")),
    Tier: S.optional(RouterInputTier).pipe(T.JsonName("tier")),
    TransitEncryption: S.optional(RouterInputTransitEncryption)
      .pipe(T.JsonName("transitEncryption"))
      .annotations({ identifier: "RouterInputTransitEncryption" }),
    MaintenanceConfiguration: S.optional(MaintenanceConfiguration).pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/routerInput/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRouterInputRequest",
}) as any as S.Schema<UpdateRouterInputRequest>;
export interface DeleteRouterInputRequest {
  Arn: string;
}
export const DeleteRouterInputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/routerInput/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRouterInputRequest",
}) as any as S.Schema<DeleteRouterInputRequest>;
export interface GetRouterInputSourceMetadataRequest {
  Arn: string;
}
export const GetRouterInputSourceMetadataRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/routerInput/{Arn}/source-metadata" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRouterInputSourceMetadataRequest",
}) as any as S.Schema<GetRouterInputSourceMetadataRequest>;
export interface GetRouterInputThumbnailRequest {
  Arn: string;
}
export const GetRouterInputThumbnailRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/routerInput/{Arn}/thumbnail" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRouterInputThumbnailRequest",
}) as any as S.Schema<GetRouterInputThumbnailRequest>;
export interface RestartRouterInputRequest {
  Arn: string;
}
export const RestartRouterInputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerInput/restart/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RestartRouterInputRequest",
}) as any as S.Schema<RestartRouterInputRequest>;
export interface StartRouterInputRequest {
  Arn: string;
}
export const StartRouterInputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerInput/start/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartRouterInputRequest",
}) as any as S.Schema<StartRouterInputRequest>;
export interface StopRouterInputRequest {
  Arn: string;
}
export const StopRouterInputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerInput/stop/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopRouterInputRequest",
}) as any as S.Schema<StopRouterInputRequest>;
export interface BatchGetRouterInputRequest {
  Arns: string[];
}
export const BatchGetRouterInputRequest = S.suspend(() =>
  S.Struct({ Arns: RouterInputArnList.pipe(T.HttpQuery("arns")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/routerInputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetRouterInputRequest",
}) as any as S.Schema<BatchGetRouterInputRequest>;
export interface GetRouterNetworkInterfaceRequest {
  Arn: string;
}
export const GetRouterNetworkInterfaceRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/routerNetworkInterface/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRouterNetworkInterfaceRequest",
}) as any as S.Schema<GetRouterNetworkInterfaceRequest>;
export interface PublicRouterNetworkInterfaceRule {
  Cidr: string;
}
export const PublicRouterNetworkInterfaceRule = S.suspend(() =>
  S.Struct({ Cidr: S.String.pipe(T.JsonName("cidr")) }),
).annotations({
  identifier: "PublicRouterNetworkInterfaceRule",
}) as any as S.Schema<PublicRouterNetworkInterfaceRule>;
export type NetworkInterfaceRuleList = PublicRouterNetworkInterfaceRule[];
export const NetworkInterfaceRuleList = S.Array(
  PublicRouterNetworkInterfaceRule,
);
export interface PublicRouterNetworkInterfaceConfiguration {
  AllowRules: PublicRouterNetworkInterfaceRule[];
}
export const PublicRouterNetworkInterfaceConfiguration = S.suspend(() =>
  S.Struct({
    AllowRules: NetworkInterfaceRuleList.pipe(T.JsonName("allowRules")),
  }),
).annotations({
  identifier: "PublicRouterNetworkInterfaceConfiguration",
}) as any as S.Schema<PublicRouterNetworkInterfaceConfiguration>;
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface VpcRouterNetworkInterfaceConfiguration {
  SecurityGroupIds: string[];
  SubnetId: string;
}
export const VpcRouterNetworkInterfaceConfiguration = S.suspend(() =>
  S.Struct({
    SecurityGroupIds: SecurityGroupIdList.pipe(T.JsonName("securityGroupIds")),
    SubnetId: S.String.pipe(T.JsonName("subnetId")),
  }),
).annotations({
  identifier: "VpcRouterNetworkInterfaceConfiguration",
}) as any as S.Schema<VpcRouterNetworkInterfaceConfiguration>;
export type RouterNetworkInterfaceConfiguration =
  | { Public: PublicRouterNetworkInterfaceConfiguration; Vpc?: never }
  | { Public?: never; Vpc: VpcRouterNetworkInterfaceConfiguration };
export const RouterNetworkInterfaceConfiguration = S.Union(
  S.Struct({
    Public: PublicRouterNetworkInterfaceConfiguration.pipe(
      T.JsonName("public"),
    ).annotations({ identifier: "PublicRouterNetworkInterfaceConfiguration" }),
  }),
  S.Struct({
    Vpc: VpcRouterNetworkInterfaceConfiguration.pipe(
      T.JsonName("vpc"),
    ).annotations({ identifier: "VpcRouterNetworkInterfaceConfiguration" }),
  }),
);
export interface UpdateRouterNetworkInterfaceRequest {
  Arn: string;
  Name?: string;
  Configuration?: RouterNetworkInterfaceConfiguration;
}
export const UpdateRouterNetworkInterfaceRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Configuration: S.optional(RouterNetworkInterfaceConfiguration).pipe(
      T.JsonName("configuration"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/routerNetworkInterface/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRouterNetworkInterfaceRequest",
}) as any as S.Schema<UpdateRouterNetworkInterfaceRequest>;
export interface DeleteRouterNetworkInterfaceRequest {
  Arn: string;
}
export const DeleteRouterNetworkInterfaceRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/routerNetworkInterface/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRouterNetworkInterfaceRequest",
}) as any as S.Schema<DeleteRouterNetworkInterfaceRequest>;
export interface BatchGetRouterNetworkInterfaceRequest {
  Arns: string[];
}
export const BatchGetRouterNetworkInterfaceRequest = S.suspend(() =>
  S.Struct({
    Arns: RouterNetworkInterfaceArnList.pipe(T.HttpQuery("arns")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/routerNetworkInterfaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetRouterNetworkInterfaceRequest",
}) as any as S.Schema<BatchGetRouterNetworkInterfaceRequest>;
export interface GetRouterOutputRequest {
  Arn: string;
}
export const GetRouterOutputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/routerOutput/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRouterOutputRequest",
}) as any as S.Schema<GetRouterOutputRequest>;
export interface RtpRouterOutputConfiguration {
  DestinationAddress: string;
  DestinationPort: number;
  ForwardErrorCorrection?: ForwardErrorCorrectionState;
}
export const RtpRouterOutputConfiguration = S.suspend(() =>
  S.Struct({
    DestinationAddress: S.String.pipe(T.JsonName("destinationAddress")),
    DestinationPort: S.Number.pipe(T.JsonName("destinationPort")),
    ForwardErrorCorrection: S.optional(ForwardErrorCorrectionState).pipe(
      T.JsonName("forwardErrorCorrection"),
    ),
  }),
).annotations({
  identifier: "RtpRouterOutputConfiguration",
}) as any as S.Schema<RtpRouterOutputConfiguration>;
export interface RistRouterOutputConfiguration {
  DestinationAddress: string;
  DestinationPort: number;
}
export const RistRouterOutputConfiguration = S.suspend(() =>
  S.Struct({
    DestinationAddress: S.String.pipe(T.JsonName("destinationAddress")),
    DestinationPort: S.Number.pipe(T.JsonName("destinationPort")),
  }),
).annotations({
  identifier: "RistRouterOutputConfiguration",
}) as any as S.Schema<RistRouterOutputConfiguration>;
export interface SrtEncryptionConfiguration {
  EncryptionKey: SecretsManagerEncryptionKeyConfiguration;
}
export const SrtEncryptionConfiguration = S.suspend(() =>
  S.Struct({
    EncryptionKey: SecretsManagerEncryptionKeyConfiguration.pipe(
      T.JsonName("encryptionKey"),
    ).annotations({ identifier: "SecretsManagerEncryptionKeyConfiguration" }),
  }),
).annotations({
  identifier: "SrtEncryptionConfiguration",
}) as any as S.Schema<SrtEncryptionConfiguration>;
export interface SrtListenerRouterOutputConfiguration {
  Port: number;
  MinimumLatencyMilliseconds: number;
  EncryptionConfiguration?: SrtEncryptionConfiguration;
}
export const SrtListenerRouterOutputConfiguration = S.suspend(() =>
  S.Struct({
    Port: S.Number.pipe(T.JsonName("port")),
    MinimumLatencyMilliseconds: S.Number.pipe(
      T.JsonName("minimumLatencyMilliseconds"),
    ),
    EncryptionConfiguration: S.optional(SrtEncryptionConfiguration)
      .pipe(T.JsonName("encryptionConfiguration"))
      .annotations({ identifier: "SrtEncryptionConfiguration" }),
  }),
).annotations({
  identifier: "SrtListenerRouterOutputConfiguration",
}) as any as S.Schema<SrtListenerRouterOutputConfiguration>;
export interface SrtCallerRouterOutputConfiguration {
  DestinationAddress: string;
  DestinationPort: number;
  MinimumLatencyMilliseconds: number;
  StreamId?: string;
  EncryptionConfiguration?: SrtEncryptionConfiguration;
}
export const SrtCallerRouterOutputConfiguration = S.suspend(() =>
  S.Struct({
    DestinationAddress: S.String.pipe(T.JsonName("destinationAddress")),
    DestinationPort: S.Number.pipe(T.JsonName("destinationPort")),
    MinimumLatencyMilliseconds: S.Number.pipe(
      T.JsonName("minimumLatencyMilliseconds"),
    ),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
    EncryptionConfiguration: S.optional(SrtEncryptionConfiguration)
      .pipe(T.JsonName("encryptionConfiguration"))
      .annotations({ identifier: "SrtEncryptionConfiguration" }),
  }),
).annotations({
  identifier: "SrtCallerRouterOutputConfiguration",
}) as any as S.Schema<SrtCallerRouterOutputConfiguration>;
export type RouterOutputProtocolConfiguration =
  | {
      Rtp: RtpRouterOutputConfiguration;
      Rist?: never;
      SrtListener?: never;
      SrtCaller?: never;
    }
  | {
      Rtp?: never;
      Rist: RistRouterOutputConfiguration;
      SrtListener?: never;
      SrtCaller?: never;
    }
  | {
      Rtp?: never;
      Rist?: never;
      SrtListener: SrtListenerRouterOutputConfiguration;
      SrtCaller?: never;
    }
  | {
      Rtp?: never;
      Rist?: never;
      SrtListener?: never;
      SrtCaller: SrtCallerRouterOutputConfiguration;
    };
export const RouterOutputProtocolConfiguration = S.Union(
  S.Struct({
    Rtp: RtpRouterOutputConfiguration.pipe(T.JsonName("rtp")).annotations({
      identifier: "RtpRouterOutputConfiguration",
    }),
  }),
  S.Struct({
    Rist: RistRouterOutputConfiguration.pipe(T.JsonName("rist")).annotations({
      identifier: "RistRouterOutputConfiguration",
    }),
  }),
  S.Struct({
    SrtListener: SrtListenerRouterOutputConfiguration.pipe(
      T.JsonName("srtListener"),
    ).annotations({ identifier: "SrtListenerRouterOutputConfiguration" }),
  }),
  S.Struct({
    SrtCaller: SrtCallerRouterOutputConfiguration.pipe(
      T.JsonName("srtCaller"),
    ).annotations({ identifier: "SrtCallerRouterOutputConfiguration" }),
  }),
);
export type RouterOutputProtocol =
  | "RTP"
  | "RIST"
  | "SRT_CALLER"
  | "SRT_LISTENER"
  | (string & {});
export const RouterOutputProtocol = S.String;
export interface StandardRouterOutputConfiguration {
  NetworkInterfaceArn: string;
  ProtocolConfiguration: RouterOutputProtocolConfiguration;
  Protocol?: RouterOutputProtocol;
}
export const StandardRouterOutputConfiguration = S.suspend(() =>
  S.Struct({
    NetworkInterfaceArn: S.String.pipe(T.JsonName("networkInterfaceArn")),
    ProtocolConfiguration: RouterOutputProtocolConfiguration.pipe(
      T.JsonName("protocolConfiguration"),
    ),
    Protocol: S.optional(RouterOutputProtocol).pipe(T.JsonName("protocol")),
  }),
).annotations({
  identifier: "StandardRouterOutputConfiguration",
}) as any as S.Schema<StandardRouterOutputConfiguration>;
export interface MediaConnectFlowRouterOutputConfiguration {
  FlowArn?: string;
  FlowSourceArn?: string;
  DestinationTransitEncryption: FlowTransitEncryption;
}
export const MediaConnectFlowRouterOutputConfiguration = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    FlowSourceArn: S.optional(S.String).pipe(T.JsonName("flowSourceArn")),
    DestinationTransitEncryption: FlowTransitEncryption.pipe(
      T.JsonName("destinationTransitEncryption"),
    ).annotations({ identifier: "FlowTransitEncryption" }),
  }),
).annotations({
  identifier: "MediaConnectFlowRouterOutputConfiguration",
}) as any as S.Schema<MediaConnectFlowRouterOutputConfiguration>;
export type MediaLiveInputPipelineId =
  | "PIPELINE_0"
  | "PIPELINE_1"
  | (string & {});
export const MediaLiveInputPipelineId = S.String;
export type MediaLiveTransitEncryptionKeyType =
  | "SECRETS_MANAGER"
  | "AUTOMATIC"
  | (string & {});
export const MediaLiveTransitEncryptionKeyType = S.String;
export type MediaLiveTransitEncryptionKeyConfiguration =
  | {
      SecretsManager: SecretsManagerEncryptionKeyConfiguration;
      Automatic?: never;
    }
  | { SecretsManager?: never; Automatic: AutomaticEncryptionKeyConfiguration };
export const MediaLiveTransitEncryptionKeyConfiguration = S.Union(
  S.Struct({
    SecretsManager: SecretsManagerEncryptionKeyConfiguration.pipe(
      T.JsonName("secretsManager"),
    ).annotations({ identifier: "SecretsManagerEncryptionKeyConfiguration" }),
  }),
  S.Struct({
    Automatic: AutomaticEncryptionKeyConfiguration.pipe(
      T.JsonName("automatic"),
    ).annotations({ identifier: "AutomaticEncryptionKeyConfiguration" }),
  }),
);
export interface MediaLiveTransitEncryption {
  EncryptionKeyType?: MediaLiveTransitEncryptionKeyType;
  EncryptionKeyConfiguration: MediaLiveTransitEncryptionKeyConfiguration;
}
export const MediaLiveTransitEncryption = S.suspend(() =>
  S.Struct({
    EncryptionKeyType: S.optional(MediaLiveTransitEncryptionKeyType).pipe(
      T.JsonName("encryptionKeyType"),
    ),
    EncryptionKeyConfiguration: MediaLiveTransitEncryptionKeyConfiguration.pipe(
      T.JsonName("encryptionKeyConfiguration"),
    ),
  }),
).annotations({
  identifier: "MediaLiveTransitEncryption",
}) as any as S.Schema<MediaLiveTransitEncryption>;
export interface MediaLiveInputRouterOutputConfiguration {
  MediaLiveInputArn?: string;
  MediaLivePipelineId?: MediaLiveInputPipelineId;
  DestinationTransitEncryption: MediaLiveTransitEncryption;
}
export const MediaLiveInputRouterOutputConfiguration = S.suspend(() =>
  S.Struct({
    MediaLiveInputArn: S.optional(S.String).pipe(
      T.JsonName("mediaLiveInputArn"),
    ),
    MediaLivePipelineId: S.optional(MediaLiveInputPipelineId).pipe(
      T.JsonName("mediaLivePipelineId"),
    ),
    DestinationTransitEncryption: MediaLiveTransitEncryption.pipe(
      T.JsonName("destinationTransitEncryption"),
    ).annotations({ identifier: "MediaLiveTransitEncryption" }),
  }),
).annotations({
  identifier: "MediaLiveInputRouterOutputConfiguration",
}) as any as S.Schema<MediaLiveInputRouterOutputConfiguration>;
export type RouterOutputConfiguration =
  | {
      Standard: StandardRouterOutputConfiguration;
      MediaConnectFlow?: never;
      MediaLiveInput?: never;
    }
  | {
      Standard?: never;
      MediaConnectFlow: MediaConnectFlowRouterOutputConfiguration;
      MediaLiveInput?: never;
    }
  | {
      Standard?: never;
      MediaConnectFlow?: never;
      MediaLiveInput: MediaLiveInputRouterOutputConfiguration;
    };
export const RouterOutputConfiguration = S.Union(
  S.Struct({
    Standard: StandardRouterOutputConfiguration.pipe(
      T.JsonName("standard"),
    ).annotations({ identifier: "StandardRouterOutputConfiguration" }),
  }),
  S.Struct({
    MediaConnectFlow: MediaConnectFlowRouterOutputConfiguration.pipe(
      T.JsonName("mediaConnectFlow"),
    ).annotations({ identifier: "MediaConnectFlowRouterOutputConfiguration" }),
  }),
  S.Struct({
    MediaLiveInput: MediaLiveInputRouterOutputConfiguration.pipe(
      T.JsonName("mediaLiveInput"),
    ).annotations({ identifier: "MediaLiveInputRouterOutputConfiguration" }),
  }),
);
export interface UpdateRouterOutputRequest {
  Arn: string;
  Name?: string;
  Configuration?: RouterOutputConfiguration;
  MaximumBitrate?: number;
  RoutingScope?: RoutingScope;
  Tier?: RouterOutputTier;
  MaintenanceConfiguration?: MaintenanceConfiguration;
}
export const UpdateRouterOutputRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Configuration: S.optional(RouterOutputConfiguration).pipe(
      T.JsonName("configuration"),
    ),
    MaximumBitrate: S.optional(S.Number).pipe(T.JsonName("maximumBitrate")),
    RoutingScope: S.optional(RoutingScope).pipe(T.JsonName("routingScope")),
    Tier: S.optional(RouterOutputTier).pipe(T.JsonName("tier")),
    MaintenanceConfiguration: S.optional(MaintenanceConfiguration).pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/routerOutput/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRouterOutputRequest",
}) as any as S.Schema<UpdateRouterOutputRequest>;
export interface DeleteRouterOutputRequest {
  Arn: string;
}
export const DeleteRouterOutputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/routerOutput/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRouterOutputRequest",
}) as any as S.Schema<DeleteRouterOutputRequest>;
export interface RestartRouterOutputRequest {
  Arn: string;
}
export const RestartRouterOutputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerOutput/restart/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RestartRouterOutputRequest",
}) as any as S.Schema<RestartRouterOutputRequest>;
export interface StartRouterOutputRequest {
  Arn: string;
}
export const StartRouterOutputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerOutput/start/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartRouterOutputRequest",
}) as any as S.Schema<StartRouterOutputRequest>;
export interface StopRouterOutputRequest {
  Arn: string;
}
export const StopRouterOutputRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerOutput/stop/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopRouterOutputRequest",
}) as any as S.Schema<StopRouterOutputRequest>;
export interface TakeRouterInputRequest {
  RouterOutputArn: string;
  RouterInputArn?: string;
}
export const TakeRouterInputRequest = S.suspend(() =>
  S.Struct({
    RouterOutputArn: S.String.pipe(T.HttpLabel("RouterOutputArn")),
    RouterInputArn: S.optional(S.String).pipe(T.JsonName("routerInputArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/routerOutput/takeRouterInput/{RouterOutputArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TakeRouterInputRequest",
}) as any as S.Schema<TakeRouterInputRequest>;
export interface BatchGetRouterOutputRequest {
  Arns: string[];
}
export const BatchGetRouterOutputRequest = S.suspend(() =>
  S.Struct({ Arns: RouterOutputArnList.pipe(T.HttpQuery("arns")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/routerOutputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetRouterOutputRequest",
}) as any as S.Schema<BatchGetRouterOutputRequest>;
export type FailoverMode = "MERGE" | "FAILOVER" | (string & {});
export const FailoverMode = S.String;
export type MaintenanceDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"
  | (string & {});
export const MaintenanceDay = S.String;
export type ThumbnailState = "ENABLED" | "DISABLED" | (string & {});
export const ThumbnailState = S.String;
export type ContentQualityAnalysisState =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const ContentQualityAnalysisState = S.String;
export type NdiState = "ENABLED" | "DISABLED" | (string & {});
export const NdiState = S.String;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type RouterInputType =
  | "STANDARD"
  | "FAILOVER"
  | "MERGE"
  | "MEDIACONNECT_FLOW"
  | (string & {});
export const RouterInputType = S.String;
export type RouterInputTypeList = RouterInputType[];
export const RouterInputTypeList = S.Array(RouterInputType);
export type RoutingScopeList = RoutingScope[];
export const RoutingScopeList = S.Array(RoutingScope);
export type RouterNetworkInterfaceType = "PUBLIC" | "VPC" | (string & {});
export const RouterNetworkInterfaceType = S.String;
export type RouterNetworkInterfaceTypeList = RouterNetworkInterfaceType[];
export const RouterNetworkInterfaceTypeList = S.Array(
  RouterNetworkInterfaceType,
);
export type RouterOutputType =
  | "STANDARD"
  | "MEDIACONNECT_FLOW"
  | "MEDIALIVE_INPUT"
  | (string & {});
export const RouterOutputType = S.String;
export type RouterOutputTypeList = RouterOutputType[];
export const RouterOutputTypeList = S.Array(RouterOutputType);
export interface AddEgressGatewayBridgeRequest {
  MaxBitrate?: number;
}
export const AddEgressGatewayBridgeRequest = S.suspend(() =>
  S.Struct({ MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")) }),
).annotations({
  identifier: "AddEgressGatewayBridgeRequest",
}) as any as S.Schema<AddEgressGatewayBridgeRequest>;
export interface AddIngressGatewayBridgeRequest {
  MaxBitrate?: number;
  MaxOutputs?: number;
}
export const AddIngressGatewayBridgeRequest = S.suspend(() =>
  S.Struct({
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MaxOutputs: S.optional(S.Number).pipe(T.JsonName("maxOutputs")),
  }),
).annotations({
  identifier: "AddIngressGatewayBridgeRequest",
}) as any as S.Schema<AddIngressGatewayBridgeRequest>;
export interface UpdateEgressGatewayBridgeRequest {
  MaxBitrate?: number;
}
export const UpdateEgressGatewayBridgeRequest = S.suspend(() =>
  S.Struct({ MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")) }),
).annotations({
  identifier: "UpdateEgressGatewayBridgeRequest",
}) as any as S.Schema<UpdateEgressGatewayBridgeRequest>;
export interface UpdateIngressGatewayBridgeRequest {
  MaxBitrate?: number;
  MaxOutputs?: number;
}
export const UpdateIngressGatewayBridgeRequest = S.suspend(() =>
  S.Struct({
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MaxOutputs: S.optional(S.Number).pipe(T.JsonName("maxOutputs")),
  }),
).annotations({
  identifier: "UpdateIngressGatewayBridgeRequest",
}) as any as S.Schema<UpdateIngressGatewayBridgeRequest>;
export interface SourcePriority {
  PrimarySource?: string;
}
export const SourcePriority = S.suspend(() =>
  S.Struct({
    PrimarySource: S.optional(S.String).pipe(T.JsonName("primarySource")),
  }),
).annotations({
  identifier: "SourcePriority",
}) as any as S.Schema<SourcePriority>;
export interface UpdateFailoverConfig {
  FailoverMode?: FailoverMode;
  RecoveryWindow?: number;
  SourcePriority?: SourcePriority;
  State?: State;
}
export const UpdateFailoverConfig = S.suspend(() =>
  S.Struct({
    FailoverMode: S.optional(FailoverMode).pipe(T.JsonName("failoverMode")),
    RecoveryWindow: S.optional(S.Number).pipe(T.JsonName("recoveryWindow")),
    SourcePriority: S.optional(SourcePriority)
      .pipe(T.JsonName("sourcePriority"))
      .annotations({ identifier: "SourcePriority" }),
    State: S.optional(State).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "UpdateFailoverConfig",
}) as any as S.Schema<UpdateFailoverConfig>;
export interface UpdateBridgeNetworkOutputRequest {
  IpAddress?: string;
  NetworkName?: string;
  Port?: number;
  Protocol?: Protocol;
  Ttl?: number;
}
export const UpdateBridgeNetworkOutputRequest = S.suspend(() =>
  S.Struct({
    IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
    NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
    Ttl: S.optional(S.Number).pipe(T.JsonName("ttl")),
  }),
).annotations({
  identifier: "UpdateBridgeNetworkOutputRequest",
}) as any as S.Schema<UpdateBridgeNetworkOutputRequest>;
export interface UpdateBridgeFlowSourceRequest {
  FlowArn?: string;
  FlowVpcInterfaceAttachment?: VpcInterfaceAttachment;
}
export const UpdateBridgeFlowSourceRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    FlowVpcInterfaceAttachment: S.optional(VpcInterfaceAttachment)
      .pipe(T.JsonName("flowVpcInterfaceAttachment"))
      .annotations({ identifier: "VpcInterfaceAttachment" }),
  }),
).annotations({
  identifier: "UpdateBridgeFlowSourceRequest",
}) as any as S.Schema<UpdateBridgeFlowSourceRequest>;
export interface AddMaintenance {
  MaintenanceDay?: MaintenanceDay;
  MaintenanceStartHour?: string;
}
export const AddMaintenance = S.suspend(() =>
  S.Struct({
    MaintenanceDay: S.optional(MaintenanceDay).pipe(
      T.JsonName("maintenanceDay"),
    ),
    MaintenanceStartHour: S.optional(S.String).pipe(
      T.JsonName("maintenanceStartHour"),
    ),
  }),
).annotations({
  identifier: "AddMaintenance",
}) as any as S.Schema<AddMaintenance>;
export interface UpdateMaintenance {
  MaintenanceDay?: MaintenanceDay;
  MaintenanceScheduledDate?: string;
  MaintenanceStartHour?: string;
}
export const UpdateMaintenance = S.suspend(() =>
  S.Struct({
    MaintenanceDay: S.optional(MaintenanceDay).pipe(
      T.JsonName("maintenanceDay"),
    ),
    MaintenanceScheduledDate: S.optional(S.String).pipe(
      T.JsonName("maintenanceScheduledDate"),
    ),
    MaintenanceStartHour: S.optional(S.String).pipe(
      T.JsonName("maintenanceStartHour"),
    ),
  }),
).annotations({
  identifier: "UpdateMaintenance",
}) as any as S.Schema<UpdateMaintenance>;
export type Status =
  | "STANDBY"
  | "ACTIVE"
  | "UPDATING"
  | "DELETING"
  | "STARTING"
  | "STOPPING"
  | "ERROR"
  | (string & {});
export const Status = S.String;
export interface UpdateEncryption {
  Algorithm?: Algorithm;
  ConstantInitializationVector?: string;
  DeviceId?: string;
  KeyType?: KeyType;
  Region?: string;
  ResourceId?: string;
  RoleArn?: string;
  SecretArn?: string;
  Url?: string;
}
export const UpdateEncryption = S.suspend(() =>
  S.Struct({
    Algorithm: S.optional(Algorithm).pipe(T.JsonName("algorithm")),
    ConstantInitializationVector: S.optional(S.String).pipe(
      T.JsonName("constantInitializationVector"),
    ),
    DeviceId: S.optional(S.String).pipe(T.JsonName("deviceId")),
    KeyType: S.optional(KeyType).pipe(T.JsonName("keyType")),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
    ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "UpdateEncryption",
}) as any as S.Schema<UpdateEncryption>;
export interface UpdateGatewayBridgeSourceRequest {
  BridgeArn?: string;
  VpcInterfaceAttachment?: VpcInterfaceAttachment;
}
export const UpdateGatewayBridgeSourceRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment)
      .pipe(T.JsonName("vpcInterfaceAttachment"))
      .annotations({ identifier: "VpcInterfaceAttachment" }),
  }),
).annotations({
  identifier: "UpdateGatewayBridgeSourceRequest",
}) as any as S.Schema<UpdateGatewayBridgeSourceRequest>;
export type InstanceState =
  | "REGISTERING"
  | "ACTIVE"
  | "DEREGISTERING"
  | "DEREGISTERED"
  | "REGISTRATION_ERROR"
  | "DEREGISTRATION_ERROR"
  | (string & {});
export const InstanceState = S.String;
export interface GatewayNetwork {
  CidrBlock?: string;
  Name?: string;
}
export const GatewayNetwork = S.suspend(() =>
  S.Struct({
    CidrBlock: S.optional(S.String).pipe(T.JsonName("cidrBlock")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "GatewayNetwork",
}) as any as S.Schema<GatewayNetwork>;
export type __listOfGatewayNetwork = GatewayNetwork[];
export const __listOfGatewayNetwork = S.Array(GatewayNetwork);
export type DurationUnits = "MONTHS" | (string & {});
export const DurationUnits = S.String;
export type PriceUnits = "HOURLY" | (string & {});
export const PriceUnits = S.String;
export type ResourceType = "Mbps_Outbound_Bandwidth" | (string & {});
export const ResourceType = S.String;
export interface ResourceSpecification {
  ReservedBitrate?: number;
  ResourceType?: ResourceType;
}
export const ResourceSpecification = S.suspend(() =>
  S.Struct({
    ReservedBitrate: S.optional(S.Number).pipe(T.JsonName("reservedBitrate")),
    ResourceType: S.optional(ResourceType).pipe(T.JsonName("resourceType")),
  }),
).annotations({
  identifier: "ResourceSpecification",
}) as any as S.Schema<ResourceSpecification>;
export interface Offering {
  CurrencyCode?: string;
  Duration?: number;
  DurationUnits?: DurationUnits;
  OfferingArn?: string;
  OfferingDescription?: string;
  PricePerUnit?: string;
  PriceUnits?: PriceUnits;
  ResourceSpecification?: ResourceSpecification;
}
export const Offering = S.suspend(() =>
  S.Struct({
    CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    DurationUnits: S.optional(DurationUnits).pipe(T.JsonName("durationUnits")),
    OfferingArn: S.optional(S.String).pipe(T.JsonName("offeringArn")),
    OfferingDescription: S.optional(S.String).pipe(
      T.JsonName("offeringDescription"),
    ),
    PricePerUnit: S.optional(S.String).pipe(T.JsonName("pricePerUnit")),
    PriceUnits: S.optional(PriceUnits).pipe(T.JsonName("priceUnits")),
    ResourceSpecification: S.optional(ResourceSpecification)
      .pipe(T.JsonName("resourceSpecification"))
      .annotations({ identifier: "ResourceSpecification" }),
  }),
).annotations({ identifier: "Offering" }) as any as S.Schema<Offering>;
export type __listOfOffering = Offering[];
export const __listOfOffering = S.Array(Offering);
export type ReservationState =
  | "ACTIVE"
  | "EXPIRED"
  | "PROCESSING"
  | "CANCELED"
  | (string & {});
export const ReservationState = S.String;
export interface Reservation {
  CurrencyCode?: string;
  Duration?: number;
  DurationUnits?: DurationUnits;
  End?: string;
  OfferingArn?: string;
  OfferingDescription?: string;
  PricePerUnit?: string;
  PriceUnits?: PriceUnits;
  ReservationArn?: string;
  ReservationName?: string;
  ReservationState?: ReservationState;
  ResourceSpecification?: ResourceSpecification;
  Start?: string;
}
export const Reservation = S.suspend(() =>
  S.Struct({
    CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    DurationUnits: S.optional(DurationUnits).pipe(T.JsonName("durationUnits")),
    End: S.optional(S.String).pipe(T.JsonName("end")),
    OfferingArn: S.optional(S.String).pipe(T.JsonName("offeringArn")),
    OfferingDescription: S.optional(S.String).pipe(
      T.JsonName("offeringDescription"),
    ),
    PricePerUnit: S.optional(S.String).pipe(T.JsonName("pricePerUnit")),
    PriceUnits: S.optional(PriceUnits).pipe(T.JsonName("priceUnits")),
    ReservationArn: S.optional(S.String).pipe(T.JsonName("reservationArn")),
    ReservationName: S.optional(S.String).pipe(T.JsonName("reservationName")),
    ReservationState: S.optional(ReservationState).pipe(
      T.JsonName("reservationState"),
    ),
    ResourceSpecification: S.optional(ResourceSpecification)
      .pipe(T.JsonName("resourceSpecification"))
      .annotations({ identifier: "ResourceSpecification" }),
    Start: S.optional(S.String).pipe(T.JsonName("start")),
  }),
).annotations({ identifier: "Reservation" }) as any as S.Schema<Reservation>;
export type __listOfReservation = Reservation[];
export const __listOfReservation = S.Array(Reservation);
export type RouterInputState =
  | "CREATING"
  | "STANDBY"
  | "STARTING"
  | "ACTIVE"
  | "STOPPING"
  | "DELETING"
  | "UPDATING"
  | "ERROR"
  | "RECOVERING"
  | "MIGRATING"
  | (string & {});
export const RouterInputState = S.String;
export type RouterInputFilter =
  | {
      RegionNames: string[];
      InputTypes?: never;
      NameContains?: never;
      NetworkInterfaceArns?: never;
      RoutingScopes?: never;
    }
  | {
      RegionNames?: never;
      InputTypes: RouterInputType[];
      NameContains?: never;
      NetworkInterfaceArns?: never;
      RoutingScopes?: never;
    }
  | {
      RegionNames?: never;
      InputTypes?: never;
      NameContains: string[];
      NetworkInterfaceArns?: never;
      RoutingScopes?: never;
    }
  | {
      RegionNames?: never;
      InputTypes?: never;
      NameContains?: never;
      NetworkInterfaceArns: string[];
      RoutingScopes?: never;
    }
  | {
      RegionNames?: never;
      InputTypes?: never;
      NameContains?: never;
      NetworkInterfaceArns?: never;
      RoutingScopes: RoutingScope[];
    };
export const RouterInputFilter = S.Union(
  S.Struct({ RegionNames: StringList.pipe(T.JsonName("regionNames")) }),
  S.Struct({ InputTypes: RouterInputTypeList.pipe(T.JsonName("inputTypes")) }),
  S.Struct({ NameContains: StringList.pipe(T.JsonName("nameContains")) }),
  S.Struct({
    NetworkInterfaceArns: RouterNetworkInterfaceArnList.pipe(
      T.JsonName("networkInterfaceArns"),
    ),
  }),
  S.Struct({
    RoutingScopes: RoutingScopeList.pipe(T.JsonName("routingScopes")),
  }),
);
export type RouterInputFilterList = RouterInputFilter[];
export const RouterInputFilterList = S.Array(RouterInputFilter);
export type MaintenanceScheduleType = "WINDOW" | (string & {});
export const MaintenanceScheduleType = S.String;
export interface RouterInputMessage {
  Code: string;
  Message: string;
}
export const RouterInputMessage = S.suspend(() =>
  S.Struct({
    Code: S.String.pipe(T.JsonName("code")),
    Message: S.String.pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "RouterInputMessage",
}) as any as S.Schema<RouterInputMessage>;
export type RouterInputMessages = RouterInputMessage[];
export const RouterInputMessages = S.Array(RouterInputMessage);
export interface StandardRouterInputStreamDetails {
  SourceIpAddress?: string;
}
export const StandardRouterInputStreamDetails = S.suspend(() =>
  S.Struct({
    SourceIpAddress: S.optional(S.String).pipe(T.JsonName("sourceIpAddress")),
  }),
).annotations({
  identifier: "StandardRouterInputStreamDetails",
}) as any as S.Schema<StandardRouterInputStreamDetails>;
export interface FailoverRouterInputIndexedStreamDetails {
  SourceIndex: number;
  SourceIpAddress?: string;
}
export const FailoverRouterInputIndexedStreamDetails = S.suspend(() =>
  S.Struct({
    SourceIndex: S.Number.pipe(T.JsonName("sourceIndex")),
    SourceIpAddress: S.optional(S.String).pipe(T.JsonName("sourceIpAddress")),
  }),
).annotations({
  identifier: "FailoverRouterInputIndexedStreamDetails",
}) as any as S.Schema<FailoverRouterInputIndexedStreamDetails>;
export interface FailoverRouterInputStreamDetails {
  SourceIndexZeroStreamDetails: FailoverRouterInputIndexedStreamDetails;
  SourceIndexOneStreamDetails: FailoverRouterInputIndexedStreamDetails;
}
export const FailoverRouterInputStreamDetails = S.suspend(() =>
  S.Struct({
    SourceIndexZeroStreamDetails: FailoverRouterInputIndexedStreamDetails.pipe(
      T.JsonName("sourceIndexZeroStreamDetails"),
    ).annotations({ identifier: "FailoverRouterInputIndexedStreamDetails" }),
    SourceIndexOneStreamDetails: FailoverRouterInputIndexedStreamDetails.pipe(
      T.JsonName("sourceIndexOneStreamDetails"),
    ).annotations({ identifier: "FailoverRouterInputIndexedStreamDetails" }),
  }),
).annotations({
  identifier: "FailoverRouterInputStreamDetails",
}) as any as S.Schema<FailoverRouterInputStreamDetails>;
export interface MergeRouterInputIndexedStreamDetails {
  SourceIndex: number;
  SourceIpAddress?: string;
}
export const MergeRouterInputIndexedStreamDetails = S.suspend(() =>
  S.Struct({
    SourceIndex: S.Number.pipe(T.JsonName("sourceIndex")),
    SourceIpAddress: S.optional(S.String).pipe(T.JsonName("sourceIpAddress")),
  }),
).annotations({
  identifier: "MergeRouterInputIndexedStreamDetails",
}) as any as S.Schema<MergeRouterInputIndexedStreamDetails>;
export interface MergeRouterInputStreamDetails {
  SourceIndexZeroStreamDetails: MergeRouterInputIndexedStreamDetails;
  SourceIndexOneStreamDetails: MergeRouterInputIndexedStreamDetails;
}
export const MergeRouterInputStreamDetails = S.suspend(() =>
  S.Struct({
    SourceIndexZeroStreamDetails: MergeRouterInputIndexedStreamDetails.pipe(
      T.JsonName("sourceIndexZeroStreamDetails"),
    ).annotations({ identifier: "MergeRouterInputIndexedStreamDetails" }),
    SourceIndexOneStreamDetails: MergeRouterInputIndexedStreamDetails.pipe(
      T.JsonName("sourceIndexOneStreamDetails"),
    ).annotations({ identifier: "MergeRouterInputIndexedStreamDetails" }),
  }),
).annotations({
  identifier: "MergeRouterInputStreamDetails",
}) as any as S.Schema<MergeRouterInputStreamDetails>;
export interface MediaConnectFlowRouterInputStreamDetails {}
export const MediaConnectFlowRouterInputStreamDetails = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "MediaConnectFlowRouterInputStreamDetails",
}) as any as S.Schema<MediaConnectFlowRouterInputStreamDetails>;
export type RouterInputStreamDetails =
  | {
      Standard: StandardRouterInputStreamDetails;
      Failover?: never;
      Merge?: never;
      MediaConnectFlow?: never;
    }
  | {
      Standard?: never;
      Failover: FailoverRouterInputStreamDetails;
      Merge?: never;
      MediaConnectFlow?: never;
    }
  | {
      Standard?: never;
      Failover?: never;
      Merge: MergeRouterInputStreamDetails;
      MediaConnectFlow?: never;
    }
  | {
      Standard?: never;
      Failover?: never;
      Merge?: never;
      MediaConnectFlow: MediaConnectFlowRouterInputStreamDetails;
    };
export const RouterInputStreamDetails = S.Union(
  S.Struct({
    Standard: StandardRouterInputStreamDetails.pipe(
      T.JsonName("standard"),
    ).annotations({ identifier: "StandardRouterInputStreamDetails" }),
  }),
  S.Struct({
    Failover: FailoverRouterInputStreamDetails.pipe(
      T.JsonName("failover"),
    ).annotations({ identifier: "FailoverRouterInputStreamDetails" }),
  }),
  S.Struct({
    Merge: MergeRouterInputStreamDetails.pipe(T.JsonName("merge")).annotations({
      identifier: "MergeRouterInputStreamDetails",
    }),
  }),
  S.Struct({
    MediaConnectFlow: MediaConnectFlowRouterInputStreamDetails.pipe(
      T.JsonName("mediaConnectFlow"),
    ).annotations({ identifier: "MediaConnectFlowRouterInputStreamDetails" }),
  }),
);
export type MaintenanceType = "PREFERRED_DAY_TIME" | "DEFAULT" | (string & {});
export const MaintenanceType = S.String;
export interface WindowMaintenanceSchedule {
  Start: Date;
  End: Date;
  ScheduledTime: Date;
}
export const WindowMaintenanceSchedule = S.suspend(() =>
  S.Struct({
    Start: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("start"),
    ),
    End: S.Date.pipe(T.TimestampFormat("date-time")).pipe(T.JsonName("end")),
    ScheduledTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("scheduledTime"),
    ),
  }),
).annotations({
  identifier: "WindowMaintenanceSchedule",
}) as any as S.Schema<WindowMaintenanceSchedule>;
export type MaintenanceSchedule = { Window: WindowMaintenanceSchedule };
export const MaintenanceSchedule = S.Union(
  S.Struct({
    Window: WindowMaintenanceSchedule.pipe(T.JsonName("window")).annotations({
      identifier: "WindowMaintenanceSchedule",
    }),
  }),
);
export interface RouterInput {
  Name: string;
  Arn: string;
  Id: string;
  State: RouterInputState;
  InputType: RouterInputType;
  Configuration: RouterInputConfiguration;
  RoutedOutputs: number;
  MaximumRoutedOutputs?: number;
  RegionName: string;
  AvailabilityZone: string;
  MaximumBitrate: number;
  Tier: RouterInputTier;
  RoutingScope: RoutingScope;
  CreatedAt: Date;
  UpdatedAt: Date;
  Messages: RouterInputMessage[];
  TransitEncryption: RouterInputTransitEncryption;
  Tags: { [key: string]: string | undefined };
  StreamDetails: RouterInputStreamDetails;
  IpAddress?: string;
  MaintenanceType: MaintenanceType;
  MaintenanceConfiguration: MaintenanceConfiguration;
  MaintenanceScheduleType?: MaintenanceScheduleType;
  MaintenanceSchedule?: MaintenanceSchedule;
}
export const RouterInput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Arn: S.String.pipe(T.JsonName("arn")),
    Id: S.String.pipe(T.JsonName("id")),
    State: RouterInputState.pipe(T.JsonName("state")),
    InputType: RouterInputType.pipe(T.JsonName("inputType")),
    Configuration: RouterInputConfiguration.pipe(T.JsonName("configuration")),
    RoutedOutputs: S.Number.pipe(T.JsonName("routedOutputs")),
    MaximumRoutedOutputs: S.optional(S.Number).pipe(
      T.JsonName("maximumRoutedOutputs"),
    ),
    RegionName: S.String.pipe(T.JsonName("regionName")),
    AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
    MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
    Tier: RouterInputTier.pipe(T.JsonName("tier")),
    RoutingScope: RoutingScope.pipe(T.JsonName("routingScope")),
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("createdAt"),
    ),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("updatedAt"),
    ),
    Messages: RouterInputMessages.pipe(T.JsonName("messages")),
    TransitEncryption: RouterInputTransitEncryption.pipe(
      T.JsonName("transitEncryption"),
    ).annotations({ identifier: "RouterInputTransitEncryption" }),
    Tags: __mapOfString.pipe(T.JsonName("tags")),
    StreamDetails: RouterInputStreamDetails.pipe(T.JsonName("streamDetails")),
    IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
    MaintenanceType: MaintenanceType.pipe(T.JsonName("maintenanceType")),
    MaintenanceConfiguration: MaintenanceConfiguration.pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
    MaintenanceScheduleType: S.optional(MaintenanceScheduleType).pipe(
      T.JsonName("maintenanceScheduleType"),
    ),
    MaintenanceSchedule: S.optional(MaintenanceSchedule).pipe(
      T.JsonName("maintenanceSchedule"),
    ),
  }),
).annotations({ identifier: "RouterInput" }) as any as S.Schema<RouterInput>;
export type RouterInputList = RouterInput[];
export const RouterInputList = S.Array(RouterInput);
export type RouterNetworkInterfaceState =
  | "CREATING"
  | "ACTIVE"
  | "UPDATING"
  | "DELETING"
  | "ERROR"
  | "RECOVERING"
  | (string & {});
export const RouterNetworkInterfaceState = S.String;
export type RouterNetworkInterfaceFilter =
  | {
      RegionNames: string[];
      NetworkInterfaceTypes?: never;
      NameContains?: never;
    }
  | {
      RegionNames?: never;
      NetworkInterfaceTypes: RouterNetworkInterfaceType[];
      NameContains?: never;
    }
  | {
      RegionNames?: never;
      NetworkInterfaceTypes?: never;
      NameContains: string[];
    };
export const RouterNetworkInterfaceFilter = S.Union(
  S.Struct({ RegionNames: StringList.pipe(T.JsonName("regionNames")) }),
  S.Struct({
    NetworkInterfaceTypes: RouterNetworkInterfaceTypeList.pipe(
      T.JsonName("networkInterfaceTypes"),
    ),
  }),
  S.Struct({ NameContains: StringList.pipe(T.JsonName("nameContains")) }),
);
export type RouterNetworkInterfaceFilterList = RouterNetworkInterfaceFilter[];
export const RouterNetworkInterfaceFilterList = S.Array(
  RouterNetworkInterfaceFilter,
);
export interface RouterNetworkInterface {
  Name: string;
  Arn: string;
  Id: string;
  State: RouterNetworkInterfaceState;
  NetworkInterfaceType: RouterNetworkInterfaceType;
  Configuration: RouterNetworkInterfaceConfiguration;
  AssociatedOutputCount: number;
  AssociatedInputCount: number;
  RegionName: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  Tags: { [key: string]: string | undefined };
}
export const RouterNetworkInterface = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Arn: S.String.pipe(T.JsonName("arn")),
    Id: S.String.pipe(T.JsonName("id")),
    State: RouterNetworkInterfaceState.pipe(T.JsonName("state")),
    NetworkInterfaceType: RouterNetworkInterfaceType.pipe(
      T.JsonName("networkInterfaceType"),
    ),
    Configuration: RouterNetworkInterfaceConfiguration.pipe(
      T.JsonName("configuration"),
    ),
    AssociatedOutputCount: S.Number.pipe(T.JsonName("associatedOutputCount")),
    AssociatedInputCount: S.Number.pipe(T.JsonName("associatedInputCount")),
    RegionName: S.String.pipe(T.JsonName("regionName")),
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("createdAt"),
    ),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("updatedAt"),
    ),
    Tags: __mapOfString.pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "RouterNetworkInterface",
}) as any as S.Schema<RouterNetworkInterface>;
export type RouterNetworkInterfaceList = RouterNetworkInterface[];
export const RouterNetworkInterfaceList = S.Array(RouterNetworkInterface);
export type RouterOutputState =
  | "CREATING"
  | "STANDBY"
  | "STARTING"
  | "ACTIVE"
  | "STOPPING"
  | "DELETING"
  | "UPDATING"
  | "ERROR"
  | "RECOVERING"
  | "MIGRATING"
  | (string & {});
export const RouterOutputState = S.String;
export type RouterOutputFilter =
  | {
      RegionNames: string[];
      OutputTypes?: never;
      NameContains?: never;
      NetworkInterfaceArns?: never;
      RoutedInputArns?: never;
      RoutingScopes?: never;
    }
  | {
      RegionNames?: never;
      OutputTypes: RouterOutputType[];
      NameContains?: never;
      NetworkInterfaceArns?: never;
      RoutedInputArns?: never;
      RoutingScopes?: never;
    }
  | {
      RegionNames?: never;
      OutputTypes?: never;
      NameContains: string[];
      NetworkInterfaceArns?: never;
      RoutedInputArns?: never;
      RoutingScopes?: never;
    }
  | {
      RegionNames?: never;
      OutputTypes?: never;
      NameContains?: never;
      NetworkInterfaceArns: string[];
      RoutedInputArns?: never;
      RoutingScopes?: never;
    }
  | {
      RegionNames?: never;
      OutputTypes?: never;
      NameContains?: never;
      NetworkInterfaceArns?: never;
      RoutedInputArns: string[];
      RoutingScopes?: never;
    }
  | {
      RegionNames?: never;
      OutputTypes?: never;
      NameContains?: never;
      NetworkInterfaceArns?: never;
      RoutedInputArns?: never;
      RoutingScopes: RoutingScope[];
    };
export const RouterOutputFilter = S.Union(
  S.Struct({ RegionNames: StringList.pipe(T.JsonName("regionNames")) }),
  S.Struct({
    OutputTypes: RouterOutputTypeList.pipe(T.JsonName("outputTypes")),
  }),
  S.Struct({ NameContains: StringList.pipe(T.JsonName("nameContains")) }),
  S.Struct({
    NetworkInterfaceArns: RouterNetworkInterfaceArnList.pipe(
      T.JsonName("networkInterfaceArns"),
    ),
  }),
  S.Struct({
    RoutedInputArns: RouterInputArnList.pipe(T.JsonName("routedInputArns")),
  }),
  S.Struct({
    RoutingScopes: RoutingScopeList.pipe(T.JsonName("routingScopes")),
  }),
);
export type RouterOutputFilterList = RouterOutputFilter[];
export const RouterOutputFilterList = S.Array(RouterOutputFilter);
export type RouterOutputRoutedState =
  | "ROUTED"
  | "ROUTING"
  | "UNROUTED"
  | (string & {});
export const RouterOutputRoutedState = S.String;
export interface RouterOutputMessage {
  Code: string;
  Message: string;
}
export const RouterOutputMessage = S.suspend(() =>
  S.Struct({
    Code: S.String.pipe(T.JsonName("code")),
    Message: S.String.pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "RouterOutputMessage",
}) as any as S.Schema<RouterOutputMessage>;
export type RouterOutputMessages = RouterOutputMessage[];
export const RouterOutputMessages = S.Array(RouterOutputMessage);
export interface StandardRouterOutputStreamDetails {
  DestinationIpAddress?: string;
}
export const StandardRouterOutputStreamDetails = S.suspend(() =>
  S.Struct({
    DestinationIpAddress: S.optional(S.String).pipe(
      T.JsonName("destinationIpAddress"),
    ),
  }),
).annotations({
  identifier: "StandardRouterOutputStreamDetails",
}) as any as S.Schema<StandardRouterOutputStreamDetails>;
export interface MediaConnectFlowRouterOutputStreamDetails {}
export const MediaConnectFlowRouterOutputStreamDetails = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "MediaConnectFlowRouterOutputStreamDetails",
}) as any as S.Schema<MediaConnectFlowRouterOutputStreamDetails>;
export interface MediaLiveInputRouterOutputStreamDetails {}
export const MediaLiveInputRouterOutputStreamDetails = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "MediaLiveInputRouterOutputStreamDetails",
}) as any as S.Schema<MediaLiveInputRouterOutputStreamDetails>;
export type RouterOutputStreamDetails =
  | {
      Standard: StandardRouterOutputStreamDetails;
      MediaConnectFlow?: never;
      MediaLiveInput?: never;
    }
  | {
      Standard?: never;
      MediaConnectFlow: MediaConnectFlowRouterOutputStreamDetails;
      MediaLiveInput?: never;
    }
  | {
      Standard?: never;
      MediaConnectFlow?: never;
      MediaLiveInput: MediaLiveInputRouterOutputStreamDetails;
    };
export const RouterOutputStreamDetails = S.Union(
  S.Struct({
    Standard: StandardRouterOutputStreamDetails.pipe(
      T.JsonName("standard"),
    ).annotations({ identifier: "StandardRouterOutputStreamDetails" }),
  }),
  S.Struct({
    MediaConnectFlow: MediaConnectFlowRouterOutputStreamDetails.pipe(
      T.JsonName("mediaConnectFlow"),
    ).annotations({ identifier: "MediaConnectFlowRouterOutputStreamDetails" }),
  }),
  S.Struct({
    MediaLiveInput: MediaLiveInputRouterOutputStreamDetails.pipe(
      T.JsonName("mediaLiveInput"),
    ).annotations({ identifier: "MediaLiveInputRouterOutputStreamDetails" }),
  }),
);
export interface RouterOutput {
  Name: string;
  Arn: string;
  Id: string;
  State: RouterOutputState;
  OutputType: RouterOutputType;
  Configuration: RouterOutputConfiguration;
  RoutedState: RouterOutputRoutedState;
  RegionName: string;
  AvailabilityZone: string;
  MaximumBitrate: number;
  RoutingScope: RoutingScope;
  Tier: RouterOutputTier;
  CreatedAt: Date;
  UpdatedAt: Date;
  Messages: RouterOutputMessage[];
  Tags: { [key: string]: string | undefined };
  StreamDetails: RouterOutputStreamDetails;
  IpAddress?: string;
  RoutedInputArn?: string;
  MaintenanceType: MaintenanceType;
  MaintenanceConfiguration: MaintenanceConfiguration;
  MaintenanceScheduleType?: MaintenanceScheduleType;
  MaintenanceSchedule?: MaintenanceSchedule;
}
export const RouterOutput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Arn: S.String.pipe(T.JsonName("arn")),
    Id: S.String.pipe(T.JsonName("id")),
    State: RouterOutputState.pipe(T.JsonName("state")),
    OutputType: RouterOutputType.pipe(T.JsonName("outputType")),
    Configuration: RouterOutputConfiguration.pipe(T.JsonName("configuration")),
    RoutedState: RouterOutputRoutedState.pipe(T.JsonName("routedState")),
    RegionName: S.String.pipe(T.JsonName("regionName")),
    AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
    MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
    RoutingScope: RoutingScope.pipe(T.JsonName("routingScope")),
    Tier: RouterOutputTier.pipe(T.JsonName("tier")),
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("createdAt"),
    ),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("updatedAt"),
    ),
    Messages: RouterOutputMessages.pipe(T.JsonName("messages")),
    Tags: __mapOfString.pipe(T.JsonName("tags")),
    StreamDetails: RouterOutputStreamDetails.pipe(T.JsonName("streamDetails")),
    IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
    RoutedInputArn: S.optional(S.String).pipe(T.JsonName("routedInputArn")),
    MaintenanceType: MaintenanceType.pipe(T.JsonName("maintenanceType")),
    MaintenanceConfiguration: MaintenanceConfiguration.pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
    MaintenanceScheduleType: S.optional(MaintenanceScheduleType).pipe(
      T.JsonName("maintenanceScheduleType"),
    ),
    MaintenanceSchedule: S.optional(MaintenanceSchedule).pipe(
      T.JsonName("maintenanceSchedule"),
    ),
  }),
).annotations({ identifier: "RouterOutput" }) as any as S.Schema<RouterOutput>;
export type RouterOutputList = RouterOutput[];
export const RouterOutputList = S.Array(RouterOutput);
export interface ListTagsForGlobalResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForGlobalResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForGlobalResourceResponse",
}) as any as S.Schema<ListTagsForGlobalResourceResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagGlobalResourceRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const TagGlobalResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/global/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagGlobalResourceRequest",
}) as any as S.Schema<TagGlobalResourceRequest>;
export interface TagGlobalResourceResponse {}
export const TagGlobalResourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "TagGlobalResourceResponse",
}) as any as S.Schema<TagGlobalResourceResponse>;
export interface UpdateBridgeRequest {
  BridgeArn: string;
  EgressGatewayBridge?: UpdateEgressGatewayBridgeRequest;
  IngressGatewayBridge?: UpdateIngressGatewayBridgeRequest;
  SourceFailoverConfig?: UpdateFailoverConfig;
}
export const UpdateBridgeRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    EgressGatewayBridge: S.optional(UpdateEgressGatewayBridgeRequest)
      .pipe(T.JsonName("egressGatewayBridge"))
      .annotations({ identifier: "UpdateEgressGatewayBridgeRequest" }),
    IngressGatewayBridge: S.optional(UpdateIngressGatewayBridgeRequest)
      .pipe(T.JsonName("ingressGatewayBridge"))
      .annotations({ identifier: "UpdateIngressGatewayBridgeRequest" }),
    SourceFailoverConfig: S.optional(UpdateFailoverConfig)
      .pipe(T.JsonName("sourceFailoverConfig"))
      .annotations({ identifier: "UpdateFailoverConfig" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/bridges/{BridgeArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBridgeRequest",
}) as any as S.Schema<UpdateBridgeRequest>;
export interface DeleteBridgeResponse {
  BridgeArn?: string;
}
export const DeleteBridgeResponse = S.suspend(() =>
  S.Struct({ BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")) }),
).annotations({
  identifier: "DeleteBridgeResponse",
}) as any as S.Schema<DeleteBridgeResponse>;
export interface RemoveBridgeOutputResponse {
  BridgeArn?: string;
  OutputName?: string;
}
export const RemoveBridgeOutputResponse = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    OutputName: S.optional(S.String).pipe(T.JsonName("outputName")),
  }),
).annotations({
  identifier: "RemoveBridgeOutputResponse",
}) as any as S.Schema<RemoveBridgeOutputResponse>;
export interface RemoveBridgeSourceResponse {
  BridgeArn?: string;
  SourceName?: string;
}
export const RemoveBridgeSourceResponse = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    SourceName: S.optional(S.String).pipe(T.JsonName("sourceName")),
  }),
).annotations({
  identifier: "RemoveBridgeSourceResponse",
}) as any as S.Schema<RemoveBridgeSourceResponse>;
export interface UpdateBridgeOutputRequest {
  BridgeArn: string;
  NetworkOutput?: UpdateBridgeNetworkOutputRequest;
  OutputName: string;
}
export const UpdateBridgeOutputRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    NetworkOutput: S.optional(UpdateBridgeNetworkOutputRequest)
      .pipe(T.JsonName("networkOutput"))
      .annotations({ identifier: "UpdateBridgeNetworkOutputRequest" }),
    OutputName: S.String.pipe(T.HttpLabel("OutputName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/bridges/{BridgeArn}/outputs/{OutputName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBridgeOutputRequest",
}) as any as S.Schema<UpdateBridgeOutputRequest>;
export interface UpdateBridgeStateResponse {
  BridgeArn?: string;
  DesiredState?: DesiredState;
}
export const UpdateBridgeStateResponse = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    DesiredState: S.optional(DesiredState).pipe(T.JsonName("desiredState")),
  }),
).annotations({
  identifier: "UpdateBridgeStateResponse",
}) as any as S.Schema<UpdateBridgeStateResponse>;
export interface SilentAudio {
  State?: State;
  ThresholdSeconds?: number;
}
export const SilentAudio = S.suspend(() =>
  S.Struct({
    State: S.optional(State).pipe(T.JsonName("state")),
    ThresholdSeconds: S.optional(S.Number).pipe(T.JsonName("thresholdSeconds")),
  }),
).annotations({ identifier: "SilentAudio" }) as any as S.Schema<SilentAudio>;
export interface AudioMonitoringSetting {
  SilentAudio?: SilentAudio;
}
export const AudioMonitoringSetting = S.suspend(() =>
  S.Struct({
    SilentAudio: S.optional(SilentAudio)
      .pipe(T.JsonName("silentAudio"))
      .annotations({ identifier: "SilentAudio" }),
  }),
).annotations({
  identifier: "AudioMonitoringSetting",
}) as any as S.Schema<AudioMonitoringSetting>;
export type __listOfAudioMonitoringSetting = AudioMonitoringSetting[];
export const __listOfAudioMonitoringSetting = S.Array(AudioMonitoringSetting);
export interface BlackFrames {
  State?: State;
  ThresholdSeconds?: number;
}
export const BlackFrames = S.suspend(() =>
  S.Struct({
    State: S.optional(State).pipe(T.JsonName("state")),
    ThresholdSeconds: S.optional(S.Number).pipe(T.JsonName("thresholdSeconds")),
  }),
).annotations({ identifier: "BlackFrames" }) as any as S.Schema<BlackFrames>;
export interface FrozenFrames {
  State?: State;
  ThresholdSeconds?: number;
}
export const FrozenFrames = S.suspend(() =>
  S.Struct({
    State: S.optional(State).pipe(T.JsonName("state")),
    ThresholdSeconds: S.optional(S.Number).pipe(T.JsonName("thresholdSeconds")),
  }),
).annotations({ identifier: "FrozenFrames" }) as any as S.Schema<FrozenFrames>;
export interface VideoMonitoringSetting {
  BlackFrames?: BlackFrames;
  FrozenFrames?: FrozenFrames;
}
export const VideoMonitoringSetting = S.suspend(() =>
  S.Struct({
    BlackFrames: S.optional(BlackFrames)
      .pipe(T.JsonName("blackFrames"))
      .annotations({ identifier: "BlackFrames" }),
    FrozenFrames: S.optional(FrozenFrames)
      .pipe(T.JsonName("frozenFrames"))
      .annotations({ identifier: "FrozenFrames" }),
  }),
).annotations({
  identifier: "VideoMonitoringSetting",
}) as any as S.Schema<VideoMonitoringSetting>;
export type __listOfVideoMonitoringSetting = VideoMonitoringSetting[];
export const __listOfVideoMonitoringSetting = S.Array(VideoMonitoringSetting);
export interface MonitoringConfig {
  ThumbnailState?: ThumbnailState;
  AudioMonitoringSettings?: AudioMonitoringSetting[];
  ContentQualityAnalysisState?: ContentQualityAnalysisState;
  VideoMonitoringSettings?: VideoMonitoringSetting[];
}
export const MonitoringConfig = S.suspend(() =>
  S.Struct({
    ThumbnailState: S.optional(ThumbnailState).pipe(
      T.JsonName("thumbnailState"),
    ),
    AudioMonitoringSettings: S.optional(__listOfAudioMonitoringSetting).pipe(
      T.JsonName("audioMonitoringSettings"),
    ),
    ContentQualityAnalysisState: S.optional(ContentQualityAnalysisState).pipe(
      T.JsonName("contentQualityAnalysisState"),
    ),
    VideoMonitoringSettings: S.optional(__listOfVideoMonitoringSetting).pipe(
      T.JsonName("videoMonitoringSettings"),
    ),
  }),
).annotations({
  identifier: "MonitoringConfig",
}) as any as S.Schema<MonitoringConfig>;
export interface NdiDiscoveryServerConfig {
  DiscoveryServerAddress?: string;
  DiscoveryServerPort?: number;
  VpcInterfaceAdapter?: string;
}
export const NdiDiscoveryServerConfig = S.suspend(() =>
  S.Struct({
    DiscoveryServerAddress: S.optional(S.String).pipe(
      T.JsonName("discoveryServerAddress"),
    ),
    DiscoveryServerPort: S.optional(S.Number).pipe(
      T.JsonName("discoveryServerPort"),
    ),
    VpcInterfaceAdapter: S.optional(S.String).pipe(
      T.JsonName("vpcInterfaceAdapter"),
    ),
  }),
).annotations({
  identifier: "NdiDiscoveryServerConfig",
}) as any as S.Schema<NdiDiscoveryServerConfig>;
export type __listOfNdiDiscoveryServerConfig = NdiDiscoveryServerConfig[];
export const __listOfNdiDiscoveryServerConfig = S.Array(
  NdiDiscoveryServerConfig,
);
export interface NdiConfig {
  NdiState?: NdiState;
  MachineName?: string;
  NdiDiscoveryServers?: NdiDiscoveryServerConfig[];
}
export const NdiConfig = S.suspend(() =>
  S.Struct({
    NdiState: S.optional(NdiState).pipe(T.JsonName("ndiState")),
    MachineName: S.optional(S.String).pipe(T.JsonName("machineName")),
    NdiDiscoveryServers: S.optional(__listOfNdiDiscoveryServerConfig).pipe(
      T.JsonName("ndiDiscoveryServers"),
    ),
  }),
).annotations({ identifier: "NdiConfig" }) as any as S.Schema<NdiConfig>;
export interface UpdateFlowRequest {
  FlowArn: string;
  SourceFailoverConfig?: UpdateFailoverConfig;
  Maintenance?: UpdateMaintenance;
  SourceMonitoringConfig?: MonitoringConfig;
  NdiConfig?: NdiConfig;
  FlowSize?: FlowSize;
}
export const UpdateFlowRequest = S.suspend(() =>
  S.Struct({
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    SourceFailoverConfig: S.optional(UpdateFailoverConfig)
      .pipe(T.JsonName("sourceFailoverConfig"))
      .annotations({ identifier: "UpdateFailoverConfig" }),
    Maintenance: S.optional(UpdateMaintenance)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "UpdateMaintenance" }),
    SourceMonitoringConfig: S.optional(MonitoringConfig)
      .pipe(T.JsonName("sourceMonitoringConfig"))
      .annotations({ identifier: "MonitoringConfig" }),
    NdiConfig: S.optional(NdiConfig)
      .pipe(T.JsonName("ndiConfig"))
      .annotations({ identifier: "NdiConfig" }),
    FlowSize: S.optional(FlowSize).pipe(T.JsonName("flowSize")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/flows/{FlowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFlowRequest",
}) as any as S.Schema<UpdateFlowRequest>;
export interface DeleteFlowResponse {
  FlowArn?: string;
  Status?: Status;
}
export const DeleteFlowResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Status: S.optional(Status).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "DeleteFlowResponse",
}) as any as S.Schema<DeleteFlowResponse>;
export interface RemoveFlowMediaStreamResponse {
  FlowArn?: string;
  MediaStreamName?: string;
}
export const RemoveFlowMediaStreamResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    MediaStreamName: S.optional(S.String).pipe(T.JsonName("mediaStreamName")),
  }),
).annotations({
  identifier: "RemoveFlowMediaStreamResponse",
}) as any as S.Schema<RemoveFlowMediaStreamResponse>;
export interface RemoveFlowOutputResponse {
  FlowArn?: string;
  OutputArn?: string;
}
export const RemoveFlowOutputResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    OutputArn: S.optional(S.String).pipe(T.JsonName("outputArn")),
  }),
).annotations({
  identifier: "RemoveFlowOutputResponse",
}) as any as S.Schema<RemoveFlowOutputResponse>;
export interface RemoveFlowSourceResponse {
  FlowArn?: string;
  SourceArn?: string;
}
export const RemoveFlowSourceResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    SourceArn: S.optional(S.String).pipe(T.JsonName("sourceArn")),
  }),
).annotations({
  identifier: "RemoveFlowSourceResponse",
}) as any as S.Schema<RemoveFlowSourceResponse>;
export interface RemoveFlowVpcInterfaceResponse {
  FlowArn?: string;
  NonDeletedNetworkInterfaceIds?: string[];
  VpcInterfaceName?: string;
}
export const RemoveFlowVpcInterfaceResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    NonDeletedNetworkInterfaceIds: S.optional(__listOfString).pipe(
      T.JsonName("nonDeletedNetworkInterfaceIds"),
    ),
    VpcInterfaceName: S.optional(S.String).pipe(T.JsonName("vpcInterfaceName")),
  }),
).annotations({
  identifier: "RemoveFlowVpcInterfaceResponse",
}) as any as S.Schema<RemoveFlowVpcInterfaceResponse>;
export interface RevokeFlowEntitlementResponse {
  EntitlementArn?: string;
  FlowArn?: string;
}
export const RevokeFlowEntitlementResponse = S.suspend(() =>
  S.Struct({
    EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  }),
).annotations({
  identifier: "RevokeFlowEntitlementResponse",
}) as any as S.Schema<RevokeFlowEntitlementResponse>;
export interface StartFlowResponse {
  FlowArn?: string;
  Status?: Status;
}
export const StartFlowResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Status: S.optional(Status).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "StartFlowResponse",
}) as any as S.Schema<StartFlowResponse>;
export interface StopFlowResponse {
  FlowArn?: string;
  Status?: Status;
}
export const StopFlowResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Status: S.optional(Status).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "StopFlowResponse",
}) as any as S.Schema<StopFlowResponse>;
export interface UpdateFlowEntitlementRequest {
  Description?: string;
  Encryption?: UpdateEncryption;
  EntitlementArn: string;
  EntitlementStatus?: EntitlementStatus;
  FlowArn: string;
  Subscribers?: string[];
}
export const UpdateFlowEntitlementRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Encryption: S.optional(UpdateEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "UpdateEncryption" }),
    EntitlementArn: S.String.pipe(T.HttpLabel("EntitlementArn")),
    EntitlementStatus: S.optional(EntitlementStatus).pipe(
      T.JsonName("entitlementStatus"),
    ),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    Subscribers: S.optional(__listOfString).pipe(T.JsonName("subscribers")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/flows/{FlowArn}/entitlements/{EntitlementArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFlowEntitlementRequest",
}) as any as S.Schema<UpdateFlowEntitlementRequest>;
export interface UpdateGatewayInstanceResponse {
  BridgePlacement?: BridgePlacement;
  GatewayInstanceArn?: string;
}
export const UpdateGatewayInstanceResponse = S.suspend(() =>
  S.Struct({
    BridgePlacement: S.optional(BridgePlacement).pipe(
      T.JsonName("bridgePlacement"),
    ),
    GatewayInstanceArn: S.optional(S.String).pipe(
      T.JsonName("gatewayInstanceArn"),
    ),
  }),
).annotations({
  identifier: "UpdateGatewayInstanceResponse",
}) as any as S.Schema<UpdateGatewayInstanceResponse>;
export interface DeregisterGatewayInstanceResponse {
  GatewayInstanceArn?: string;
  InstanceState?: InstanceState;
}
export const DeregisterGatewayInstanceResponse = S.suspend(() =>
  S.Struct({
    GatewayInstanceArn: S.optional(S.String).pipe(
      T.JsonName("gatewayInstanceArn"),
    ),
    InstanceState: S.optional(InstanceState).pipe(T.JsonName("instanceState")),
  }),
).annotations({
  identifier: "DeregisterGatewayInstanceResponse",
}) as any as S.Schema<DeregisterGatewayInstanceResponse>;
export interface CreateGatewayRequest {
  EgressCidrBlocks?: string[];
  Name?: string;
  Networks?: GatewayNetwork[];
}
export const CreateGatewayRequest = S.suspend(() =>
  S.Struct({
    EgressCidrBlocks: S.optional(__listOfString).pipe(
      T.JsonName("egressCidrBlocks"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Networks: S.optional(__listOfGatewayNetwork).pipe(T.JsonName("networks")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/gateways" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGatewayRequest",
}) as any as S.Schema<CreateGatewayRequest>;
export interface DeleteGatewayResponse {
  GatewayArn?: string;
}
export const DeleteGatewayResponse = S.suspend(() =>
  S.Struct({ GatewayArn: S.optional(S.String).pipe(T.JsonName("gatewayArn")) }),
).annotations({
  identifier: "DeleteGatewayResponse",
}) as any as S.Schema<DeleteGatewayResponse>;
export interface ListOfferingsResponse {
  NextToken?: string;
  Offerings?: (Offering & {
    CurrencyCode: string;
    Duration: number;
    DurationUnits: DurationUnits;
    OfferingArn: string;
    OfferingDescription: string;
    PricePerUnit: string;
    PriceUnits: PriceUnits;
    ResourceSpecification: ResourceSpecification & {
      ResourceType: ResourceType;
    };
  })[];
}
export const ListOfferingsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Offerings: S.optional(__listOfOffering).pipe(T.JsonName("offerings")),
  }),
).annotations({
  identifier: "ListOfferingsResponse",
}) as any as S.Schema<ListOfferingsResponse>;
export interface DescribeReservationResponse {
  Reservation?: Reservation & {
    CurrencyCode: string;
    Duration: number;
    DurationUnits: DurationUnits;
    End: string;
    OfferingArn: string;
    OfferingDescription: string;
    PricePerUnit: string;
    PriceUnits: PriceUnits;
    ReservationArn: string;
    ReservationName: string;
    ReservationState: ReservationState;
    ResourceSpecification: ResourceSpecification & {
      ResourceType: ResourceType;
    };
    Start: string;
  };
}
export const DescribeReservationResponse = S.suspend(() =>
  S.Struct({
    Reservation: S.optional(Reservation)
      .pipe(T.JsonName("reservation"))
      .annotations({ identifier: "Reservation" }),
  }),
).annotations({
  identifier: "DescribeReservationResponse",
}) as any as S.Schema<DescribeReservationResponse>;
export interface ListReservationsResponse {
  NextToken?: string;
  Reservations?: (Reservation & {
    CurrencyCode: string;
    Duration: number;
    DurationUnits: DurationUnits;
    End: string;
    OfferingArn: string;
    OfferingDescription: string;
    PricePerUnit: string;
    PriceUnits: PriceUnits;
    ReservationArn: string;
    ReservationName: string;
    ReservationState: ReservationState;
    ResourceSpecification: ResourceSpecification & {
      ResourceType: ResourceType;
    };
    Start: string;
  })[];
}
export const ListReservationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Reservations: S.optional(__listOfReservation).pipe(
      T.JsonName("reservations"),
    ),
  }),
).annotations({
  identifier: "ListReservationsResponse",
}) as any as S.Schema<ListReservationsResponse>;
export interface UpdateRouterInputResponse {
  RouterInput: RouterInput;
}
export const UpdateRouterInputResponse = S.suspend(() =>
  S.Struct({
    RouterInput: RouterInput.pipe(T.JsonName("routerInput")).annotations({
      identifier: "RouterInput",
    }),
  }),
).annotations({
  identifier: "UpdateRouterInputResponse",
}) as any as S.Schema<UpdateRouterInputResponse>;
export interface DeleteRouterInputResponse {
  Arn: string;
  Name: string;
  State: RouterInputState;
}
export const DeleteRouterInputResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    State: RouterInputState.pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DeleteRouterInputResponse",
}) as any as S.Schema<DeleteRouterInputResponse>;
export interface ListRouterInputsRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: RouterInputFilter[];
}
export const ListRouterInputsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Filters: S.optional(RouterInputFilterList).pipe(T.JsonName("filters")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerInputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRouterInputsRequest",
}) as any as S.Schema<ListRouterInputsRequest>;
export interface RestartRouterInputResponse {
  Arn: string;
  Name: string;
  State: RouterInputState;
}
export const RestartRouterInputResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    State: RouterInputState.pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "RestartRouterInputResponse",
}) as any as S.Schema<RestartRouterInputResponse>;
export interface StopRouterInputResponse {
  Arn: string;
  Name: string;
  State: RouterInputState;
}
export const StopRouterInputResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    State: RouterInputState.pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "StopRouterInputResponse",
}) as any as S.Schema<StopRouterInputResponse>;
export interface UpdateRouterNetworkInterfaceResponse {
  RouterNetworkInterface: RouterNetworkInterface;
}
export const UpdateRouterNetworkInterfaceResponse = S.suspend(() =>
  S.Struct({
    RouterNetworkInterface: RouterNetworkInterface.pipe(
      T.JsonName("routerNetworkInterface"),
    ).annotations({ identifier: "RouterNetworkInterface" }),
  }),
).annotations({
  identifier: "UpdateRouterNetworkInterfaceResponse",
}) as any as S.Schema<UpdateRouterNetworkInterfaceResponse>;
export interface DeleteRouterNetworkInterfaceResponse {
  Arn: string;
  Name: string;
  State: RouterNetworkInterfaceState;
}
export const DeleteRouterNetworkInterfaceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    State: RouterNetworkInterfaceState.pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DeleteRouterNetworkInterfaceResponse",
}) as any as S.Schema<DeleteRouterNetworkInterfaceResponse>;
export interface ListRouterNetworkInterfacesRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: RouterNetworkInterfaceFilter[];
}
export const ListRouterNetworkInterfacesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Filters: S.optional(RouterNetworkInterfaceFilterList).pipe(
      T.JsonName("filters"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerNetworkInterfaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRouterNetworkInterfacesRequest",
}) as any as S.Schema<ListRouterNetworkInterfacesRequest>;
export interface UpdateRouterOutputResponse {
  RouterOutput: RouterOutput;
}
export const UpdateRouterOutputResponse = S.suspend(() =>
  S.Struct({
    RouterOutput: RouterOutput.pipe(T.JsonName("routerOutput")).annotations({
      identifier: "RouterOutput",
    }),
  }),
).annotations({
  identifier: "UpdateRouterOutputResponse",
}) as any as S.Schema<UpdateRouterOutputResponse>;
export interface DeleteRouterOutputResponse {
  Arn: string;
  Name: string;
  State: RouterOutputState;
}
export const DeleteRouterOutputResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    State: RouterOutputState.pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DeleteRouterOutputResponse",
}) as any as S.Schema<DeleteRouterOutputResponse>;
export interface ListRouterOutputsRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: RouterOutputFilter[];
}
export const ListRouterOutputsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Filters: S.optional(RouterOutputFilterList).pipe(T.JsonName("filters")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerOutputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRouterOutputsRequest",
}) as any as S.Schema<ListRouterOutputsRequest>;
export interface RestartRouterOutputResponse {
  Arn: string;
  Name: string;
  State: RouterOutputState;
}
export const RestartRouterOutputResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    State: RouterOutputState.pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "RestartRouterOutputResponse",
}) as any as S.Schema<RestartRouterOutputResponse>;
export interface StartRouterOutputResponse {
  Arn: string;
  Name: string;
  State: RouterOutputState;
  MaintenanceScheduleType: MaintenanceScheduleType;
  MaintenanceSchedule: MaintenanceSchedule;
}
export const StartRouterOutputResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    State: RouterOutputState.pipe(T.JsonName("state")),
    MaintenanceScheduleType: MaintenanceScheduleType.pipe(
      T.JsonName("maintenanceScheduleType"),
    ),
    MaintenanceSchedule: MaintenanceSchedule.pipe(
      T.JsonName("maintenanceSchedule"),
    ),
  }),
).annotations({
  identifier: "StartRouterOutputResponse",
}) as any as S.Schema<StartRouterOutputResponse>;
export interface StopRouterOutputResponse {
  Arn: string;
  Name: string;
  State: RouterOutputState;
}
export const StopRouterOutputResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    State: RouterOutputState.pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "StopRouterOutputResponse",
}) as any as S.Schema<StopRouterOutputResponse>;
export interface TakeRouterInputResponse {
  RoutedState: RouterOutputRoutedState;
  RouterOutputArn: string;
  RouterOutputName: string;
  RouterInputArn?: string;
  RouterInputName?: string;
}
export const TakeRouterInputResponse = S.suspend(() =>
  S.Struct({
    RoutedState: RouterOutputRoutedState.pipe(T.JsonName("routedState")),
    RouterOutputArn: S.String.pipe(T.JsonName("routerOutputArn")),
    RouterOutputName: S.String.pipe(T.JsonName("routerOutputName")),
    RouterInputArn: S.optional(S.String).pipe(T.JsonName("routerInputArn")),
    RouterInputName: S.optional(S.String).pipe(T.JsonName("routerInputName")),
  }),
).annotations({
  identifier: "TakeRouterInputResponse",
}) as any as S.Schema<TakeRouterInputResponse>;
export type BridgeState =
  | "CREATING"
  | "STANDBY"
  | "STARTING"
  | "DEPLOYING"
  | "ACTIVE"
  | "STOPPING"
  | "DELETING"
  | "DELETED"
  | "START_FAILED"
  | "START_PENDING"
  | "STOP_FAILED"
  | "UPDATING"
  | (string & {});
export const BridgeState = S.String;
export type SourceType = "OWNED" | "ENTITLED" | (string & {});
export const SourceType = S.String;
export type __listOfInteger = number[];
export const __listOfInteger = S.Array(S.Number);
export type ConnectionStatus = "CONNECTED" | "DISCONNECTED" | (string & {});
export const ConnectionStatus = S.String;
export type GatewayState =
  | "CREATING"
  | "ACTIVE"
  | "UPDATING"
  | "ERROR"
  | "DELETING"
  | "DELETED"
  | (string & {});
export const GatewayState = S.String;
export interface ListedEntitlement {
  DataTransferSubscriberFeePercent?: number;
  EntitlementArn?: string;
  EntitlementName?: string;
}
export const ListedEntitlement = S.suspend(() =>
  S.Struct({
    DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
      T.JsonName("dataTransferSubscriberFeePercent"),
    ),
    EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
    EntitlementName: S.optional(S.String).pipe(T.JsonName("entitlementName")),
  }),
).annotations({
  identifier: "ListedEntitlement",
}) as any as S.Schema<ListedEntitlement>;
export type __listOfListedEntitlement = ListedEntitlement[];
export const __listOfListedEntitlement = S.Array(ListedEntitlement);
export interface FailoverConfig {
  FailoverMode?: FailoverMode;
  RecoveryWindow?: number;
  SourcePriority?: SourcePriority;
  State?: State;
}
export const FailoverConfig = S.suspend(() =>
  S.Struct({
    FailoverMode: S.optional(FailoverMode).pipe(T.JsonName("failoverMode")),
    RecoveryWindow: S.optional(S.Number).pipe(T.JsonName("recoveryWindow")),
    SourcePriority: S.optional(SourcePriority)
      .pipe(T.JsonName("sourcePriority"))
      .annotations({ identifier: "SourcePriority" }),
    State: S.optional(State).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "FailoverConfig",
}) as any as S.Schema<FailoverConfig>;
export interface ListedBridge {
  BridgeArn?: string;
  BridgeState?: BridgeState;
  BridgeType?: string;
  Name?: string;
  PlacementArn?: string;
}
export const ListedBridge = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    BridgeState: S.optional(BridgeState).pipe(T.JsonName("bridgeState")),
    BridgeType: S.optional(S.String).pipe(T.JsonName("bridgeType")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PlacementArn: S.optional(S.String).pipe(T.JsonName("placementArn")),
  }),
).annotations({ identifier: "ListedBridge" }) as any as S.Schema<ListedBridge>;
export type __listOfListedBridge = ListedBridge[];
export const __listOfListedBridge = S.Array(ListedBridge);
export interface UpdateBridgeNetworkSourceRequest {
  MulticastIp?: string;
  MulticastSourceSettings?: MulticastSourceSettings;
  NetworkName?: string;
  Port?: number;
  Protocol?: Protocol;
}
export const UpdateBridgeNetworkSourceRequest = S.suspend(() =>
  S.Struct({
    MulticastIp: S.optional(S.String).pipe(T.JsonName("multicastIp")),
    MulticastSourceSettings: S.optional(MulticastSourceSettings)
      .pipe(T.JsonName("multicastSourceSettings"))
      .annotations({ identifier: "MulticastSourceSettings" }),
    NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
  }),
).annotations({
  identifier: "UpdateBridgeNetworkSourceRequest",
}) as any as S.Schema<UpdateBridgeNetworkSourceRequest>;
export interface Messages {
  Errors?: string[];
}
export const Messages = S.suspend(() =>
  S.Struct({ Errors: S.optional(__listOfString).pipe(T.JsonName("errors")) }),
).annotations({ identifier: "Messages" }) as any as S.Schema<Messages>;
export interface Maintenance {
  MaintenanceDay?: MaintenanceDay;
  MaintenanceDeadline?: string;
  MaintenanceScheduledDate?: string;
  MaintenanceStartHour?: string;
}
export const Maintenance = S.suspend(() =>
  S.Struct({
    MaintenanceDay: S.optional(MaintenanceDay).pipe(
      T.JsonName("maintenanceDay"),
    ),
    MaintenanceDeadline: S.optional(S.String).pipe(
      T.JsonName("maintenanceDeadline"),
    ),
    MaintenanceScheduledDate: S.optional(S.String).pipe(
      T.JsonName("maintenanceScheduledDate"),
    ),
    MaintenanceStartHour: S.optional(S.String).pipe(
      T.JsonName("maintenanceStartHour"),
    ),
  }),
).annotations({ identifier: "Maintenance" }) as any as S.Schema<Maintenance>;
export interface ListedFlow {
  AvailabilityZone?: string;
  Description?: string;
  FlowArn?: string;
  Name?: string;
  SourceType?: SourceType;
  Status?: Status;
  Maintenance?: Maintenance;
}
export const ListedFlow = S.suspend(() =>
  S.Struct({
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    SourceType: S.optional(SourceType).pipe(T.JsonName("sourceType")),
    Status: S.optional(Status).pipe(T.JsonName("status")),
    Maintenance: S.optional(Maintenance)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "Maintenance" }),
  }),
).annotations({ identifier: "ListedFlow" }) as any as S.Schema<ListedFlow>;
export type __listOfListedFlow = ListedFlow[];
export const __listOfListedFlow = S.Array(ListedFlow);
export interface VpcInterface {
  Name?: string;
  NetworkInterfaceIds?: string[];
  NetworkInterfaceType?: NetworkInterfaceType;
  RoleArn?: string;
  SecurityGroupIds?: string[];
  SubnetId?: string;
}
export const VpcInterface = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkInterfaceIds: S.optional(__listOfString).pipe(
      T.JsonName("networkInterfaceIds"),
    ),
    NetworkInterfaceType: S.optional(NetworkInterfaceType).pipe(
      T.JsonName("networkInterfaceType"),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    SecurityGroupIds: S.optional(__listOfString).pipe(
      T.JsonName("securityGroupIds"),
    ),
    SubnetId: S.optional(S.String).pipe(T.JsonName("subnetId")),
  }),
).annotations({ identifier: "VpcInterface" }) as any as S.Schema<VpcInterface>;
export type __listOfVpcInterface = VpcInterface[];
export const __listOfVpcInterface = S.Array(VpcInterface);
export interface MessageDetail {
  Code?: string;
  Message?: string;
  ResourceName?: string;
}
export const MessageDetail = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String).pipe(T.JsonName("code")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
  }),
).annotations({
  identifier: "MessageDetail",
}) as any as S.Schema<MessageDetail>;
export type __listOfMessageDetail = MessageDetail[];
export const __listOfMessageDetail = S.Array(MessageDetail);
export interface ThumbnailDetails {
  FlowArn?: string;
  Thumbnail?: string;
  ThumbnailMessages?: MessageDetail[];
  Timecode?: string;
  Timestamp?: Date;
}
export const ThumbnailDetails = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Thumbnail: S.optional(S.String).pipe(T.JsonName("thumbnail")),
    ThumbnailMessages: S.optional(__listOfMessageDetail).pipe(
      T.JsonName("thumbnailMessages"),
    ),
    Timecode: S.optional(S.String).pipe(T.JsonName("timecode")),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("timestamp"),
    ),
  }),
).annotations({
  identifier: "ThumbnailDetails",
}) as any as S.Schema<ThumbnailDetails>;
export interface Entitlement {
  DataTransferSubscriberFeePercent?: number;
  Description?: string;
  Encryption?: Encryption;
  EntitlementArn?: string;
  EntitlementStatus?: EntitlementStatus;
  Name?: string;
  Subscribers?: string[];
}
export const Entitlement = S.suspend(() =>
  S.Struct({
    DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
      T.JsonName("dataTransferSubscriberFeePercent"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Encryption: S.optional(Encryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "Encryption" }),
    EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
    EntitlementStatus: S.optional(EntitlementStatus).pipe(
      T.JsonName("entitlementStatus"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Subscribers: S.optional(__listOfString).pipe(T.JsonName("subscribers")),
  }),
).annotations({ identifier: "Entitlement" }) as any as S.Schema<Entitlement>;
export type __listOfEntitlement = Entitlement[];
export const __listOfEntitlement = S.Array(Entitlement);
export interface GatewayInstance {
  BridgePlacement?: BridgePlacement;
  ConnectionStatus?: ConnectionStatus;
  GatewayArn?: string;
  GatewayInstanceArn?: string;
  InstanceId?: string;
  InstanceMessages?: MessageDetail[];
  InstanceState?: InstanceState;
  RunningBridgeCount?: number;
}
export const GatewayInstance = S.suspend(() =>
  S.Struct({
    BridgePlacement: S.optional(BridgePlacement).pipe(
      T.JsonName("bridgePlacement"),
    ),
    ConnectionStatus: S.optional(ConnectionStatus).pipe(
      T.JsonName("connectionStatus"),
    ),
    GatewayArn: S.optional(S.String).pipe(T.JsonName("gatewayArn")),
    GatewayInstanceArn: S.optional(S.String).pipe(
      T.JsonName("gatewayInstanceArn"),
    ),
    InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
    InstanceMessages: S.optional(__listOfMessageDetail).pipe(
      T.JsonName("instanceMessages"),
    ),
    InstanceState: S.optional(InstanceState).pipe(T.JsonName("instanceState")),
    RunningBridgeCount: S.optional(S.Number).pipe(
      T.JsonName("runningBridgeCount"),
    ),
  }),
).annotations({
  identifier: "GatewayInstance",
}) as any as S.Schema<GatewayInstance>;
export interface ListedGatewayInstance {
  GatewayArn?: string;
  GatewayInstanceArn?: string;
  InstanceId?: string;
  InstanceState?: InstanceState;
}
export const ListedGatewayInstance = S.suspend(() =>
  S.Struct({
    GatewayArn: S.optional(S.String).pipe(T.JsonName("gatewayArn")),
    GatewayInstanceArn: S.optional(S.String).pipe(
      T.JsonName("gatewayInstanceArn"),
    ),
    InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
    InstanceState: S.optional(InstanceState).pipe(T.JsonName("instanceState")),
  }),
).annotations({
  identifier: "ListedGatewayInstance",
}) as any as S.Schema<ListedGatewayInstance>;
export type __listOfListedGatewayInstance = ListedGatewayInstance[];
export const __listOfListedGatewayInstance = S.Array(ListedGatewayInstance);
export interface Gateway {
  EgressCidrBlocks?: string[];
  GatewayArn?: string;
  GatewayMessages?: MessageDetail[];
  GatewayState?: GatewayState;
  Name?: string;
  Networks?: GatewayNetwork[];
}
export const Gateway = S.suspend(() =>
  S.Struct({
    EgressCidrBlocks: S.optional(__listOfString).pipe(
      T.JsonName("egressCidrBlocks"),
    ),
    GatewayArn: S.optional(S.String).pipe(T.JsonName("gatewayArn")),
    GatewayMessages: S.optional(__listOfMessageDetail).pipe(
      T.JsonName("gatewayMessages"),
    ),
    GatewayState: S.optional(GatewayState).pipe(T.JsonName("gatewayState")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Networks: S.optional(__listOfGatewayNetwork).pipe(T.JsonName("networks")),
  }),
).annotations({ identifier: "Gateway" }) as any as S.Schema<Gateway>;
export interface ListedGateway {
  GatewayArn?: string;
  GatewayState?: GatewayState;
  Name?: string;
}
export const ListedGateway = S.suspend(() =>
  S.Struct({
    GatewayArn: S.optional(S.String).pipe(T.JsonName("gatewayArn")),
    GatewayState: S.optional(GatewayState).pipe(T.JsonName("gatewayState")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "ListedGateway",
}) as any as S.Schema<ListedGateway>;
export type __listOfListedGateway = ListedGateway[];
export const __listOfListedGateway = S.Array(ListedGateway);
export interface RouterInputThumbnailDetails {
  ThumbnailMessages: RouterInputMessage[];
  Thumbnail?: Uint8Array;
  Timecode?: string;
  Timestamp?: Date;
}
export const RouterInputThumbnailDetails = S.suspend(() =>
  S.Struct({
    ThumbnailMessages: RouterInputMessages.pipe(
      T.JsonName("thumbnailMessages"),
    ),
    Thumbnail: S.optional(T.Blob).pipe(T.JsonName("thumbnail")),
    Timecode: S.optional(S.String).pipe(T.JsonName("timecode")),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("timestamp"),
    ),
  }),
).annotations({
  identifier: "RouterInputThumbnailDetails",
}) as any as S.Schema<RouterInputThumbnailDetails>;
export interface BatchGetRouterInputError {
  Arn: string;
  Code: string;
  Message: string;
}
export const BatchGetRouterInputError = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Code: S.String.pipe(T.JsonName("code")),
    Message: S.String.pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "BatchGetRouterInputError",
}) as any as S.Schema<BatchGetRouterInputError>;
export type BatchGetRouterInputErrorList = BatchGetRouterInputError[];
export const BatchGetRouterInputErrorList = S.Array(BatchGetRouterInputError);
export interface BatchGetRouterNetworkInterfaceError {
  Arn: string;
  Code: string;
  Message: string;
}
export const BatchGetRouterNetworkInterfaceError = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Code: S.String.pipe(T.JsonName("code")),
    Message: S.String.pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "BatchGetRouterNetworkInterfaceError",
}) as any as S.Schema<BatchGetRouterNetworkInterfaceError>;
export type BatchGetRouterNetworkInterfaceErrorList =
  BatchGetRouterNetworkInterfaceError[];
export const BatchGetRouterNetworkInterfaceErrorList = S.Array(
  BatchGetRouterNetworkInterfaceError,
);
export interface BatchGetRouterOutputError {
  Arn: string;
  Code: string;
  Message: string;
}
export const BatchGetRouterOutputError = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Code: S.String.pipe(T.JsonName("code")),
    Message: S.String.pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "BatchGetRouterOutputError",
}) as any as S.Schema<BatchGetRouterOutputError>;
export type BatchGetRouterOutputErrorList = BatchGetRouterOutputError[];
export const BatchGetRouterOutputErrorList = S.Array(BatchGetRouterOutputError);
export interface ListEntitlementsResponse {
  Entitlements?: (ListedEntitlement & {
    EntitlementArn: string;
    EntitlementName: string;
  })[];
  NextToken?: string;
}
export const ListEntitlementsResponse = S.suspend(() =>
  S.Struct({
    Entitlements: S.optional(__listOfListedEntitlement).pipe(
      T.JsonName("entitlements"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListEntitlementsResponse",
}) as any as S.Schema<ListEntitlementsResponse>;
export interface CreateBridgeRequest {
  EgressGatewayBridge?: AddEgressGatewayBridgeRequest;
  IngressGatewayBridge?: AddIngressGatewayBridgeRequest;
  Name?: string;
  Outputs?: AddBridgeOutputRequest[];
  PlacementArn?: string;
  SourceFailoverConfig?: FailoverConfig;
  Sources?: AddBridgeSourceRequest[];
}
export const CreateBridgeRequest = S.suspend(() =>
  S.Struct({
    EgressGatewayBridge: S.optional(AddEgressGatewayBridgeRequest)
      .pipe(T.JsonName("egressGatewayBridge"))
      .annotations({ identifier: "AddEgressGatewayBridgeRequest" }),
    IngressGatewayBridge: S.optional(AddIngressGatewayBridgeRequest)
      .pipe(T.JsonName("ingressGatewayBridge"))
      .annotations({ identifier: "AddIngressGatewayBridgeRequest" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Outputs: S.optional(__listOfAddBridgeOutputRequest).pipe(
      T.JsonName("outputs"),
    ),
    PlacementArn: S.optional(S.String).pipe(T.JsonName("placementArn")),
    SourceFailoverConfig: S.optional(FailoverConfig)
      .pipe(T.JsonName("sourceFailoverConfig"))
      .annotations({ identifier: "FailoverConfig" }),
    Sources: S.optional(__listOfAddBridgeSourceRequest).pipe(
      T.JsonName("sources"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/bridges" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBridgeRequest",
}) as any as S.Schema<CreateBridgeRequest>;
export interface EgressGatewayBridge {
  InstanceId?: string;
  MaxBitrate?: number;
}
export const EgressGatewayBridge = S.suspend(() =>
  S.Struct({
    InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
  }),
).annotations({
  identifier: "EgressGatewayBridge",
}) as any as S.Schema<EgressGatewayBridge>;
export interface IngressGatewayBridge {
  InstanceId?: string;
  MaxBitrate?: number;
  MaxOutputs?: number;
}
export const IngressGatewayBridge = S.suspend(() =>
  S.Struct({
    InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MaxOutputs: S.optional(S.Number).pipe(T.JsonName("maxOutputs")),
  }),
).annotations({
  identifier: "IngressGatewayBridge",
}) as any as S.Schema<IngressGatewayBridge>;
export interface BridgeFlowOutput {
  FlowArn?: string;
  FlowSourceArn?: string;
  Name?: string;
}
export const BridgeFlowOutput = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    FlowSourceArn: S.optional(S.String).pipe(T.JsonName("flowSourceArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "BridgeFlowOutput",
}) as any as S.Schema<BridgeFlowOutput>;
export interface BridgeNetworkOutput {
  IpAddress?: string;
  Name?: string;
  NetworkName?: string;
  Port?: number;
  Protocol?: Protocol;
  Ttl?: number;
}
export const BridgeNetworkOutput = S.suspend(() =>
  S.Struct({
    IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
    Ttl: S.optional(S.Number).pipe(T.JsonName("ttl")),
  }),
).annotations({
  identifier: "BridgeNetworkOutput",
}) as any as S.Schema<BridgeNetworkOutput>;
export interface BridgeOutput {
  FlowOutput?: BridgeFlowOutput;
  NetworkOutput?: BridgeNetworkOutput;
}
export const BridgeOutput = S.suspend(() =>
  S.Struct({
    FlowOutput: S.optional(BridgeFlowOutput)
      .pipe(T.JsonName("flowOutput"))
      .annotations({ identifier: "BridgeFlowOutput" }),
    NetworkOutput: S.optional(BridgeNetworkOutput)
      .pipe(T.JsonName("networkOutput"))
      .annotations({ identifier: "BridgeNetworkOutput" }),
  }),
).annotations({ identifier: "BridgeOutput" }) as any as S.Schema<BridgeOutput>;
export type __listOfBridgeOutput = BridgeOutput[];
export const __listOfBridgeOutput = S.Array(BridgeOutput);
export interface BridgeFlowSource {
  FlowArn?: string;
  FlowVpcInterfaceAttachment?: VpcInterfaceAttachment;
  Name?: string;
  OutputArn?: string;
}
export const BridgeFlowSource = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    FlowVpcInterfaceAttachment: S.optional(VpcInterfaceAttachment)
      .pipe(T.JsonName("flowVpcInterfaceAttachment"))
      .annotations({ identifier: "VpcInterfaceAttachment" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OutputArn: S.optional(S.String).pipe(T.JsonName("outputArn")),
  }),
).annotations({
  identifier: "BridgeFlowSource",
}) as any as S.Schema<BridgeFlowSource>;
export interface BridgeNetworkSource {
  MulticastIp?: string;
  MulticastSourceSettings?: MulticastSourceSettings;
  Name?: string;
  NetworkName?: string;
  Port?: number;
  Protocol?: Protocol;
}
export const BridgeNetworkSource = S.suspend(() =>
  S.Struct({
    MulticastIp: S.optional(S.String).pipe(T.JsonName("multicastIp")),
    MulticastSourceSettings: S.optional(MulticastSourceSettings)
      .pipe(T.JsonName("multicastSourceSettings"))
      .annotations({ identifier: "MulticastSourceSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
  }),
).annotations({
  identifier: "BridgeNetworkSource",
}) as any as S.Schema<BridgeNetworkSource>;
export interface BridgeSource {
  FlowSource?: BridgeFlowSource;
  NetworkSource?: BridgeNetworkSource;
}
export const BridgeSource = S.suspend(() =>
  S.Struct({
    FlowSource: S.optional(BridgeFlowSource)
      .pipe(T.JsonName("flowSource"))
      .annotations({ identifier: "BridgeFlowSource" }),
    NetworkSource: S.optional(BridgeNetworkSource)
      .pipe(T.JsonName("networkSource"))
      .annotations({ identifier: "BridgeNetworkSource" }),
  }),
).annotations({ identifier: "BridgeSource" }) as any as S.Schema<BridgeSource>;
export type __listOfBridgeSource = BridgeSource[];
export const __listOfBridgeSource = S.Array(BridgeSource);
export interface Bridge {
  BridgeArn?: string;
  BridgeMessages?: MessageDetail[];
  BridgeState?: BridgeState;
  EgressGatewayBridge?: EgressGatewayBridge;
  IngressGatewayBridge?: IngressGatewayBridge;
  Name?: string;
  Outputs?: BridgeOutput[];
  PlacementArn?: string;
  SourceFailoverConfig?: FailoverConfig;
  Sources?: BridgeSource[];
}
export const Bridge = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    BridgeMessages: S.optional(__listOfMessageDetail).pipe(
      T.JsonName("bridgeMessages"),
    ),
    BridgeState: S.optional(BridgeState).pipe(T.JsonName("bridgeState")),
    EgressGatewayBridge: S.optional(EgressGatewayBridge)
      .pipe(T.JsonName("egressGatewayBridge"))
      .annotations({ identifier: "EgressGatewayBridge" }),
    IngressGatewayBridge: S.optional(IngressGatewayBridge)
      .pipe(T.JsonName("ingressGatewayBridge"))
      .annotations({ identifier: "IngressGatewayBridge" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Outputs: S.optional(__listOfBridgeOutput).pipe(T.JsonName("outputs")),
    PlacementArn: S.optional(S.String).pipe(T.JsonName("placementArn")),
    SourceFailoverConfig: S.optional(FailoverConfig)
      .pipe(T.JsonName("sourceFailoverConfig"))
      .annotations({ identifier: "FailoverConfig" }),
    Sources: S.optional(__listOfBridgeSource).pipe(T.JsonName("sources")),
  }),
).annotations({ identifier: "Bridge" }) as any as S.Schema<Bridge>;
export interface UpdateBridgeResponse {
  Bridge?: Bridge & {
    BridgeArn: string;
    BridgeState: BridgeState;
    Name: string;
    PlacementArn: string;
    BridgeMessages: (MessageDetail & { Code: string; Message: string })[];
    EgressGatewayBridge: EgressGatewayBridge & { MaxBitrate: number };
    IngressGatewayBridge: IngressGatewayBridge & {
      MaxBitrate: number;
      MaxOutputs: number;
    };
    Outputs: (BridgeOutput & {
      FlowOutput: BridgeFlowOutput & {
        FlowArn: string;
        FlowSourceArn: string;
        Name: string;
      };
      NetworkOutput: BridgeNetworkOutput & {
        IpAddress: string;
        Name: string;
        NetworkName: string;
        Port: number;
        Protocol: Protocol;
        Ttl: number;
      };
    })[];
    Sources: (BridgeSource & {
      FlowSource: BridgeFlowSource & { FlowArn: string; Name: string };
      NetworkSource: BridgeNetworkSource & {
        MulticastIp: string;
        Name: string;
        NetworkName: string;
        Port: number;
        Protocol: Protocol;
      };
    })[];
  };
}
export const UpdateBridgeResponse = S.suspend(() =>
  S.Struct({
    Bridge: S.optional(Bridge)
      .pipe(T.JsonName("bridge"))
      .annotations({ identifier: "Bridge" }),
  }),
).annotations({
  identifier: "UpdateBridgeResponse",
}) as any as S.Schema<UpdateBridgeResponse>;
export interface ListBridgesResponse {
  Bridges?: (ListedBridge & {
    BridgeArn: string;
    BridgeState: BridgeState;
    BridgeType: string;
    Name: string;
    PlacementArn: string;
  })[];
  NextToken?: string;
}
export const ListBridgesResponse = S.suspend(() =>
  S.Struct({
    Bridges: S.optional(__listOfListedBridge).pipe(T.JsonName("bridges")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListBridgesResponse",
}) as any as S.Schema<ListBridgesResponse>;
export interface UpdateBridgeOutputResponse {
  BridgeArn?: string;
  Output?: BridgeOutput & {
    FlowOutput: BridgeFlowOutput & {
      FlowArn: string;
      FlowSourceArn: string;
      Name: string;
    };
    NetworkOutput: BridgeNetworkOutput & {
      IpAddress: string;
      Name: string;
      NetworkName: string;
      Port: number;
      Protocol: Protocol;
      Ttl: number;
    };
  };
}
export const UpdateBridgeOutputResponse = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    Output: S.optional(BridgeOutput)
      .pipe(T.JsonName("output"))
      .annotations({ identifier: "BridgeOutput" }),
  }),
).annotations({
  identifier: "UpdateBridgeOutputResponse",
}) as any as S.Schema<UpdateBridgeOutputResponse>;
export interface UpdateBridgeSourceRequest {
  BridgeArn: string;
  FlowSource?: UpdateBridgeFlowSourceRequest;
  NetworkSource?: UpdateBridgeNetworkSourceRequest;
  SourceName: string;
}
export const UpdateBridgeSourceRequest = S.suspend(() =>
  S.Struct({
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    FlowSource: S.optional(UpdateBridgeFlowSourceRequest)
      .pipe(T.JsonName("flowSource"))
      .annotations({ identifier: "UpdateBridgeFlowSourceRequest" }),
    NetworkSource: S.optional(UpdateBridgeNetworkSourceRequest)
      .pipe(T.JsonName("networkSource"))
      .annotations({ identifier: "UpdateBridgeNetworkSourceRequest" }),
    SourceName: S.String.pipe(T.HttpLabel("SourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/bridges/{BridgeArn}/sources/{SourceName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBridgeSourceRequest",
}) as any as S.Schema<UpdateBridgeSourceRequest>;
export interface Fmtp {
  ChannelOrder?: string;
  Colorimetry?: Colorimetry;
  ExactFramerate?: string;
  Par?: string;
  Range?: Range;
  ScanMode?: ScanMode;
  Tcs?: Tcs;
}
export const Fmtp = S.suspend(() =>
  S.Struct({
    ChannelOrder: S.optional(S.String).pipe(T.JsonName("channelOrder")),
    Colorimetry: S.optional(Colorimetry).pipe(T.JsonName("colorimetry")),
    ExactFramerate: S.optional(S.String).pipe(T.JsonName("exactFramerate")),
    Par: S.optional(S.String).pipe(T.JsonName("par")),
    Range: S.optional(Range).pipe(T.JsonName("range")),
    ScanMode: S.optional(ScanMode).pipe(T.JsonName("scanMode")),
    Tcs: S.optional(Tcs).pipe(T.JsonName("tcs")),
  }),
).annotations({ identifier: "Fmtp" }) as any as S.Schema<Fmtp>;
export interface MediaStreamAttributes {
  Fmtp?: Fmtp;
  Lang?: string;
}
export const MediaStreamAttributes = S.suspend(() =>
  S.Struct({
    Fmtp: S.optional(Fmtp)
      .pipe(T.JsonName("fmtp"))
      .annotations({ identifier: "Fmtp" }),
    Lang: S.optional(S.String).pipe(T.JsonName("lang")),
  }),
).annotations({
  identifier: "MediaStreamAttributes",
}) as any as S.Schema<MediaStreamAttributes>;
export interface MediaStream {
  Attributes?: MediaStreamAttributes;
  ClockRate?: number;
  Description?: string;
  Fmt?: number;
  MediaStreamId?: number;
  MediaStreamName?: string;
  MediaStreamType?: MediaStreamType;
  VideoFormat?: string;
}
export const MediaStream = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(MediaStreamAttributes)
      .pipe(T.JsonName("attributes"))
      .annotations({ identifier: "MediaStreamAttributes" }),
    ClockRate: S.optional(S.Number).pipe(T.JsonName("clockRate")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Fmt: S.optional(S.Number).pipe(T.JsonName("fmt")),
    MediaStreamId: S.optional(S.Number).pipe(T.JsonName("mediaStreamId")),
    MediaStreamName: S.optional(S.String).pipe(T.JsonName("mediaStreamName")),
    MediaStreamType: S.optional(MediaStreamType).pipe(
      T.JsonName("mediaStreamType"),
    ),
    VideoFormat: S.optional(S.String).pipe(T.JsonName("videoFormat")),
  }),
).annotations({ identifier: "MediaStream" }) as any as S.Schema<MediaStream>;
export type __listOfMediaStream = MediaStream[];
export const __listOfMediaStream = S.Array(MediaStream);
export interface Interface {
  Name?: string;
}
export const Interface = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String).pipe(T.JsonName("name")) }),
).annotations({ identifier: "Interface" }) as any as S.Schema<Interface>;
export interface DestinationConfiguration {
  DestinationIp?: string;
  DestinationPort?: number;
  Interface?: Interface;
  OutboundIp?: string;
}
export const DestinationConfiguration = S.suspend(() =>
  S.Struct({
    DestinationIp: S.optional(S.String).pipe(T.JsonName("destinationIp")),
    DestinationPort: S.optional(S.Number).pipe(T.JsonName("destinationPort")),
    Interface: S.optional(Interface)
      .pipe(T.JsonName("interface"))
      .annotations({ identifier: "Interface" }),
    OutboundIp: S.optional(S.String).pipe(T.JsonName("outboundIp")),
  }),
).annotations({
  identifier: "DestinationConfiguration",
}) as any as S.Schema<DestinationConfiguration>;
export type __listOfDestinationConfiguration = DestinationConfiguration[];
export const __listOfDestinationConfiguration = S.Array(
  DestinationConfiguration,
);
export interface EncodingParameters {
  CompressionFactor?: number;
  EncoderProfile?: EncoderProfile;
}
export const EncodingParameters = S.suspend(() =>
  S.Struct({
    CompressionFactor: S.optional(S.Number).pipe(
      T.JsonName("compressionFactor"),
    ),
    EncoderProfile: S.optional(EncoderProfile).pipe(
      T.JsonName("encoderProfile"),
    ),
  }),
).annotations({
  identifier: "EncodingParameters",
}) as any as S.Schema<EncodingParameters>;
export interface MediaStreamOutputConfiguration {
  DestinationConfigurations?: DestinationConfiguration[];
  EncodingName?: EncodingName;
  EncodingParameters?: EncodingParameters;
  MediaStreamName?: string;
}
export const MediaStreamOutputConfiguration = S.suspend(() =>
  S.Struct({
    DestinationConfigurations: S.optional(
      __listOfDestinationConfiguration,
    ).pipe(T.JsonName("destinationConfigurations")),
    EncodingName: S.optional(EncodingName).pipe(T.JsonName("encodingName")),
    EncodingParameters: S.optional(EncodingParameters)
      .pipe(T.JsonName("encodingParameters"))
      .annotations({ identifier: "EncodingParameters" }),
    MediaStreamName: S.optional(S.String).pipe(T.JsonName("mediaStreamName")),
  }),
).annotations({
  identifier: "MediaStreamOutputConfiguration",
}) as any as S.Schema<MediaStreamOutputConfiguration>;
export type __listOfMediaStreamOutputConfiguration =
  MediaStreamOutputConfiguration[];
export const __listOfMediaStreamOutputConfiguration = S.Array(
  MediaStreamOutputConfiguration,
);
export interface Transport {
  CidrAllowList?: string[];
  MaxBitrate?: number;
  MaxLatency?: number;
  MaxSyncBuffer?: number;
  MinLatency?: number;
  Protocol?: Protocol;
  RemoteId?: string;
  SenderControlPort?: number;
  SenderIpAddress?: string;
  SmoothingLatency?: number;
  SourceListenerAddress?: string;
  SourceListenerPort?: number;
  StreamId?: string;
  NdiSpeedHqQuality?: number;
  NdiProgramName?: string;
}
export const Transport = S.suspend(() =>
  S.Struct({
    CidrAllowList: S.optional(__listOfString).pipe(T.JsonName("cidrAllowList")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MaxLatency: S.optional(S.Number).pipe(T.JsonName("maxLatency")),
    MaxSyncBuffer: S.optional(S.Number).pipe(T.JsonName("maxSyncBuffer")),
    MinLatency: S.optional(S.Number).pipe(T.JsonName("minLatency")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
    RemoteId: S.optional(S.String).pipe(T.JsonName("remoteId")),
    SenderControlPort: S.optional(S.Number).pipe(
      T.JsonName("senderControlPort"),
    ),
    SenderIpAddress: S.optional(S.String).pipe(T.JsonName("senderIpAddress")),
    SmoothingLatency: S.optional(S.Number).pipe(T.JsonName("smoothingLatency")),
    SourceListenerAddress: S.optional(S.String).pipe(
      T.JsonName("sourceListenerAddress"),
    ),
    SourceListenerPort: S.optional(S.Number).pipe(
      T.JsonName("sourceListenerPort"),
    ),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
    NdiSpeedHqQuality: S.optional(S.Number).pipe(
      T.JsonName("ndiSpeedHqQuality"),
    ),
    NdiProgramName: S.optional(S.String).pipe(T.JsonName("ndiProgramName")),
  }),
).annotations({ identifier: "Transport" }) as any as S.Schema<Transport>;
export interface Output {
  DataTransferSubscriberFeePercent?: number;
  Description?: string;
  Destination?: string;
  Encryption?: Encryption;
  EntitlementArn?: string;
  ListenerAddress?: string;
  MediaLiveInputArn?: string;
  MediaStreamOutputConfigurations?: MediaStreamOutputConfiguration[];
  Name?: string;
  OutputArn?: string;
  Port?: number;
  Transport?: Transport;
  VpcInterfaceAttachment?: VpcInterfaceAttachment;
  BridgeArn?: string;
  BridgePorts?: number[];
  OutputStatus?: OutputStatus;
  PeerIpAddress?: string;
  RouterIntegrationState?: State;
  RouterIntegrationTransitEncryption?: FlowTransitEncryption;
  ConnectedRouterInputArn?: string;
}
export const Output = S.suspend(() =>
  S.Struct({
    DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
      T.JsonName("dataTransferSubscriberFeePercent"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    Encryption: S.optional(Encryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "Encryption" }),
    EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
    ListenerAddress: S.optional(S.String).pipe(T.JsonName("listenerAddress")),
    MediaLiveInputArn: S.optional(S.String).pipe(
      T.JsonName("mediaLiveInputArn"),
    ),
    MediaStreamOutputConfigurations: S.optional(
      __listOfMediaStreamOutputConfiguration,
    ).pipe(T.JsonName("mediaStreamOutputConfigurations")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OutputArn: S.optional(S.String).pipe(T.JsonName("outputArn")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Transport: S.optional(Transport)
      .pipe(T.JsonName("transport"))
      .annotations({ identifier: "Transport" }),
    VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment)
      .pipe(T.JsonName("vpcInterfaceAttachment"))
      .annotations({ identifier: "VpcInterfaceAttachment" }),
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    BridgePorts: S.optional(__listOfInteger).pipe(T.JsonName("bridgePorts")),
    OutputStatus: S.optional(OutputStatus).pipe(T.JsonName("outputStatus")),
    PeerIpAddress: S.optional(S.String).pipe(T.JsonName("peerIpAddress")),
    RouterIntegrationState: S.optional(State).pipe(
      T.JsonName("routerIntegrationState"),
    ),
    RouterIntegrationTransitEncryption: S.optional(FlowTransitEncryption)
      .pipe(T.JsonName("routerIntegrationTransitEncryption"))
      .annotations({ identifier: "FlowTransitEncryption" }),
    ConnectedRouterInputArn: S.optional(S.String).pipe(
      T.JsonName("connectedRouterInputArn"),
    ),
  }),
).annotations({ identifier: "Output" }) as any as S.Schema<Output>;
export type __listOfOutput = Output[];
export const __listOfOutput = S.Array(Output);
export interface InputConfiguration {
  InputIp?: string;
  InputPort?: number;
  Interface?: Interface;
}
export const InputConfiguration = S.suspend(() =>
  S.Struct({
    InputIp: S.optional(S.String).pipe(T.JsonName("inputIp")),
    InputPort: S.optional(S.Number).pipe(T.JsonName("inputPort")),
    Interface: S.optional(Interface)
      .pipe(T.JsonName("interface"))
      .annotations({ identifier: "Interface" }),
  }),
).annotations({
  identifier: "InputConfiguration",
}) as any as S.Schema<InputConfiguration>;
export type __listOfInputConfiguration = InputConfiguration[];
export const __listOfInputConfiguration = S.Array(InputConfiguration);
export interface MediaStreamSourceConfiguration {
  EncodingName?: EncodingName;
  InputConfigurations?: InputConfiguration[];
  MediaStreamName?: string;
}
export const MediaStreamSourceConfiguration = S.suspend(() =>
  S.Struct({
    EncodingName: S.optional(EncodingName).pipe(T.JsonName("encodingName")),
    InputConfigurations: S.optional(__listOfInputConfiguration).pipe(
      T.JsonName("inputConfigurations"),
    ),
    MediaStreamName: S.optional(S.String).pipe(T.JsonName("mediaStreamName")),
  }),
).annotations({
  identifier: "MediaStreamSourceConfiguration",
}) as any as S.Schema<MediaStreamSourceConfiguration>;
export type __listOfMediaStreamSourceConfiguration =
  MediaStreamSourceConfiguration[];
export const __listOfMediaStreamSourceConfiguration = S.Array(
  MediaStreamSourceConfiguration,
);
export interface GatewayBridgeSource {
  BridgeArn?: string;
  VpcInterfaceAttachment?: VpcInterfaceAttachment;
}
export const GatewayBridgeSource = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment)
      .pipe(T.JsonName("vpcInterfaceAttachment"))
      .annotations({ identifier: "VpcInterfaceAttachment" }),
  }),
).annotations({
  identifier: "GatewayBridgeSource",
}) as any as S.Schema<GatewayBridgeSource>;
export interface Source {
  DataTransferSubscriberFeePercent?: number;
  Decryption?: Encryption;
  Description?: string;
  EntitlementArn?: string;
  IngestIp?: string;
  IngestPort?: number;
  MediaStreamSourceConfigurations?: MediaStreamSourceConfiguration[];
  Name?: string;
  SenderControlPort?: number;
  SenderIpAddress?: string;
  SourceArn?: string;
  Transport?: Transport;
  VpcInterfaceName?: string;
  WhitelistCidr?: string;
  GatewayBridgeSource?: GatewayBridgeSource;
  PeerIpAddress?: string;
  RouterIntegrationState?: State;
  RouterIntegrationTransitDecryption?: FlowTransitEncryption;
  ConnectedRouterOutputArn?: string;
}
export const Source = S.suspend(() =>
  S.Struct({
    DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
      T.JsonName("dataTransferSubscriberFeePercent"),
    ),
    Decryption: S.optional(Encryption)
      .pipe(T.JsonName("decryption"))
      .annotations({ identifier: "Encryption" }),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
    IngestIp: S.optional(S.String).pipe(T.JsonName("ingestIp")),
    IngestPort: S.optional(S.Number).pipe(T.JsonName("ingestPort")),
    MediaStreamSourceConfigurations: S.optional(
      __listOfMediaStreamSourceConfiguration,
    ).pipe(T.JsonName("mediaStreamSourceConfigurations")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    SenderControlPort: S.optional(S.Number).pipe(
      T.JsonName("senderControlPort"),
    ),
    SenderIpAddress: S.optional(S.String).pipe(T.JsonName("senderIpAddress")),
    SourceArn: S.optional(S.String).pipe(T.JsonName("sourceArn")),
    Transport: S.optional(Transport)
      .pipe(T.JsonName("transport"))
      .annotations({ identifier: "Transport" }),
    VpcInterfaceName: S.optional(S.String).pipe(T.JsonName("vpcInterfaceName")),
    WhitelistCidr: S.optional(S.String).pipe(T.JsonName("whitelistCidr")),
    GatewayBridgeSource: S.optional(GatewayBridgeSource)
      .pipe(T.JsonName("gatewayBridgeSource"))
      .annotations({ identifier: "GatewayBridgeSource" }),
    PeerIpAddress: S.optional(S.String).pipe(T.JsonName("peerIpAddress")),
    RouterIntegrationState: S.optional(State).pipe(
      T.JsonName("routerIntegrationState"),
    ),
    RouterIntegrationTransitDecryption: S.optional(FlowTransitEncryption)
      .pipe(T.JsonName("routerIntegrationTransitDecryption"))
      .annotations({ identifier: "FlowTransitEncryption" }),
    ConnectedRouterOutputArn: S.optional(S.String).pipe(
      T.JsonName("connectedRouterOutputArn"),
    ),
  }),
).annotations({ identifier: "Source" }) as any as S.Schema<Source>;
export type __listOfSource = Source[];
export const __listOfSource = S.Array(Source);
export interface Flow {
  AvailabilityZone?: string;
  Description?: string;
  EgressIp?: string;
  Entitlements?: Entitlement[];
  FlowArn?: string;
  MediaStreams?: MediaStream[];
  Name?: string;
  Outputs?: Output[];
  Source?: Source;
  SourceFailoverConfig?: FailoverConfig;
  Sources?: Source[];
  Status?: Status;
  VpcInterfaces?: VpcInterface[];
  Maintenance?: Maintenance;
  SourceMonitoringConfig?: MonitoringConfig;
  FlowSize?: FlowSize;
  NdiConfig?: NdiConfig;
}
export const Flow = S.suspend(() =>
  S.Struct({
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EgressIp: S.optional(S.String).pipe(T.JsonName("egressIp")),
    Entitlements: S.optional(__listOfEntitlement).pipe(
      T.JsonName("entitlements"),
    ),
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    MediaStreams: S.optional(__listOfMediaStream).pipe(
      T.JsonName("mediaStreams"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Outputs: S.optional(__listOfOutput).pipe(T.JsonName("outputs")),
    Source: S.optional(Source)
      .pipe(T.JsonName("source"))
      .annotations({ identifier: "Source" }),
    SourceFailoverConfig: S.optional(FailoverConfig)
      .pipe(T.JsonName("sourceFailoverConfig"))
      .annotations({ identifier: "FailoverConfig" }),
    Sources: S.optional(__listOfSource).pipe(T.JsonName("sources")),
    Status: S.optional(Status).pipe(T.JsonName("status")),
    VpcInterfaces: S.optional(__listOfVpcInterface).pipe(
      T.JsonName("vpcInterfaces"),
    ),
    Maintenance: S.optional(Maintenance)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "Maintenance" }),
    SourceMonitoringConfig: S.optional(MonitoringConfig)
      .pipe(T.JsonName("sourceMonitoringConfig"))
      .annotations({ identifier: "MonitoringConfig" }),
    FlowSize: S.optional(FlowSize).pipe(T.JsonName("flowSize")),
    NdiConfig: S.optional(NdiConfig)
      .pipe(T.JsonName("ndiConfig"))
      .annotations({ identifier: "NdiConfig" }),
  }),
).annotations({ identifier: "Flow" }) as any as S.Schema<Flow>;
export interface UpdateFlowResponse {
  Flow?: Flow & {
    AvailabilityZone: string;
    Entitlements: (Entitlement & {
      EntitlementArn: string;
      Name: string;
      Subscribers: __listOfString;
      Encryption: Encryption & { RoleArn: string };
    })[];
    FlowArn: string;
    Name: string;
    Outputs: (Output & {
      Name: string;
      OutputArn: string;
      Encryption: Encryption & { RoleArn: string };
      MediaStreamOutputConfigurations: (MediaStreamOutputConfiguration & {
        EncodingName: EncodingName;
        MediaStreamName: string;
        DestinationConfigurations: (DestinationConfiguration & {
          DestinationIp: string;
          DestinationPort: number;
          Interface: Interface & { Name: string };
          OutboundIp: string;
        })[];
        EncodingParameters: EncodingParameters & {
          CompressionFactor: number;
          EncoderProfile: EncoderProfile;
        };
      })[];
      Transport: Transport & { Protocol: Protocol };
    })[];
    Source: Source & {
      Name: string;
      SourceArn: string;
      Decryption: Encryption & { RoleArn: string };
      MediaStreamSourceConfigurations: (MediaStreamSourceConfiguration & {
        EncodingName: EncodingName;
        MediaStreamName: string;
        InputConfigurations: (InputConfiguration & {
          InputIp: string;
          InputPort: number;
          Interface: Interface & { Name: string };
        })[];
      })[];
      Transport: Transport & { Protocol: Protocol };
      GatewayBridgeSource: GatewayBridgeSource & { BridgeArn: string };
    };
    Status: Status;
    MediaStreams: (MediaStream & {
      Fmt: number;
      MediaStreamId: number;
      MediaStreamName: string;
      MediaStreamType: MediaStreamType;
      Attributes: MediaStreamAttributes & { Fmtp: Fmtp };
    })[];
    Sources: (Source & {
      Name: string;
      SourceArn: string;
      Decryption: Encryption & { RoleArn: string };
      MediaStreamSourceConfigurations: (MediaStreamSourceConfiguration & {
        EncodingName: EncodingName;
        MediaStreamName: string;
        InputConfigurations: (InputConfiguration & {
          InputIp: string;
          InputPort: number;
          Interface: Interface & { Name: string };
        })[];
      })[];
      Transport: Transport & { Protocol: Protocol };
      GatewayBridgeSource: GatewayBridgeSource & { BridgeArn: string };
    })[];
    VpcInterfaces: (VpcInterface & {
      Name: string;
      NetworkInterfaceIds: __listOfString;
      NetworkInterfaceType: NetworkInterfaceType;
      RoleArn: string;
      SecurityGroupIds: __listOfString;
      SubnetId: string;
    })[];
    NdiConfig: NdiConfig & {
      NdiDiscoveryServers: (NdiDiscoveryServerConfig & {
        DiscoveryServerAddress: string;
        VpcInterfaceAdapter: string;
      })[];
    };
  };
}
export const UpdateFlowResponse = S.suspend(() =>
  S.Struct({
    Flow: S.optional(Flow)
      .pipe(T.JsonName("flow"))
      .annotations({ identifier: "Flow" }),
  }),
).annotations({
  identifier: "UpdateFlowResponse",
}) as any as S.Schema<UpdateFlowResponse>;
export interface ListFlowsResponse {
  Flows?: (ListedFlow & {
    AvailabilityZone: string;
    Description: string;
    FlowArn: string;
    Name: string;
    SourceType: SourceType;
    Status: Status;
  })[];
  NextToken?: string;
}
export const ListFlowsResponse = S.suspend(() =>
  S.Struct({
    Flows: S.optional(__listOfListedFlow).pipe(T.JsonName("flows")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListFlowsResponse",
}) as any as S.Schema<ListFlowsResponse>;
export interface AddFlowVpcInterfacesResponse {
  FlowArn?: string;
  VpcInterfaces?: (VpcInterface & {
    Name: string;
    NetworkInterfaceIds: __listOfString;
    NetworkInterfaceType: NetworkInterfaceType;
    RoleArn: string;
    SecurityGroupIds: __listOfString;
    SubnetId: string;
  })[];
}
export const AddFlowVpcInterfacesResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    VpcInterfaces: S.optional(__listOfVpcInterface).pipe(
      T.JsonName("vpcInterfaces"),
    ),
  }),
).annotations({
  identifier: "AddFlowVpcInterfacesResponse",
}) as any as S.Schema<AddFlowVpcInterfacesResponse>;
export interface DescribeFlowSourceThumbnailResponse {
  ThumbnailDetails?: ThumbnailDetails & {
    FlowArn: string;
    ThumbnailMessages: (MessageDetail & { Code: string; Message: string })[];
  };
}
export const DescribeFlowSourceThumbnailResponse = S.suspend(() =>
  S.Struct({
    ThumbnailDetails: S.optional(ThumbnailDetails)
      .pipe(T.JsonName("thumbnailDetails"))
      .annotations({ identifier: "ThumbnailDetails" }),
  }),
).annotations({
  identifier: "DescribeFlowSourceThumbnailResponse",
}) as any as S.Schema<DescribeFlowSourceThumbnailResponse>;
export interface GrantFlowEntitlementsResponse {
  Entitlements?: (Entitlement & {
    EntitlementArn: string;
    Name: string;
    Subscribers: __listOfString;
    Encryption: Encryption & { RoleArn: string };
  })[];
  FlowArn?: string;
}
export const GrantFlowEntitlementsResponse = S.suspend(() =>
  S.Struct({
    Entitlements: S.optional(__listOfEntitlement).pipe(
      T.JsonName("entitlements"),
    ),
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  }),
).annotations({
  identifier: "GrantFlowEntitlementsResponse",
}) as any as S.Schema<GrantFlowEntitlementsResponse>;
export interface UpdateFlowEntitlementResponse {
  Entitlement?: Entitlement & {
    EntitlementArn: string;
    Name: string;
    Subscribers: __listOfString;
    Encryption: Encryption & { RoleArn: string };
  };
  FlowArn?: string;
}
export const UpdateFlowEntitlementResponse = S.suspend(() =>
  S.Struct({
    Entitlement: S.optional(Entitlement)
      .pipe(T.JsonName("entitlement"))
      .annotations({ identifier: "Entitlement" }),
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  }),
).annotations({
  identifier: "UpdateFlowEntitlementResponse",
}) as any as S.Schema<UpdateFlowEntitlementResponse>;
export interface UpdateFlowMediaStreamRequest {
  Attributes?: MediaStreamAttributesRequest;
  ClockRate?: number;
  Description?: string;
  FlowArn: string;
  MediaStreamName: string;
  MediaStreamType?: MediaStreamType;
  VideoFormat?: string;
}
export const UpdateFlowMediaStreamRequest = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(MediaStreamAttributesRequest)
      .pipe(T.JsonName("attributes"))
      .annotations({ identifier: "MediaStreamAttributesRequest" }),
    ClockRate: S.optional(S.Number).pipe(T.JsonName("clockRate")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    MediaStreamName: S.String.pipe(T.HttpLabel("MediaStreamName")),
    MediaStreamType: S.optional(MediaStreamType).pipe(
      T.JsonName("mediaStreamType"),
    ),
    VideoFormat: S.optional(S.String).pipe(T.JsonName("videoFormat")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/flows/{FlowArn}/mediaStreams/{MediaStreamName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFlowMediaStreamRequest",
}) as any as S.Schema<UpdateFlowMediaStreamRequest>;
export interface UpdateFlowSourceRequest {
  Decryption?: UpdateEncryption;
  Description?: string;
  EntitlementArn?: string;
  FlowArn: string;
  IngestPort?: number;
  MaxBitrate?: number;
  MaxLatency?: number;
  MaxSyncBuffer?: number;
  MediaStreamSourceConfigurations?: MediaStreamSourceConfigurationRequest[];
  MinLatency?: number;
  Protocol?: Protocol;
  SenderControlPort?: number;
  SenderIpAddress?: string;
  SourceArn: string;
  SourceListenerAddress?: string;
  SourceListenerPort?: number;
  StreamId?: string;
  VpcInterfaceName?: string;
  WhitelistCidr?: string;
  GatewayBridgeSource?: UpdateGatewayBridgeSourceRequest;
  RouterIntegrationState?: State;
  RouterIntegrationTransitDecryption?: FlowTransitEncryption;
}
export const UpdateFlowSourceRequest = S.suspend(() =>
  S.Struct({
    Decryption: S.optional(UpdateEncryption)
      .pipe(T.JsonName("decryption"))
      .annotations({ identifier: "UpdateEncryption" }),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    IngestPort: S.optional(S.Number).pipe(T.JsonName("ingestPort")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MaxLatency: S.optional(S.Number).pipe(T.JsonName("maxLatency")),
    MaxSyncBuffer: S.optional(S.Number).pipe(T.JsonName("maxSyncBuffer")),
    MediaStreamSourceConfigurations: S.optional(
      __listOfMediaStreamSourceConfigurationRequest,
    ).pipe(T.JsonName("mediaStreamSourceConfigurations")),
    MinLatency: S.optional(S.Number).pipe(T.JsonName("minLatency")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
    SenderControlPort: S.optional(S.Number).pipe(
      T.JsonName("senderControlPort"),
    ),
    SenderIpAddress: S.optional(S.String).pipe(T.JsonName("senderIpAddress")),
    SourceArn: S.String.pipe(T.HttpLabel("SourceArn")),
    SourceListenerAddress: S.optional(S.String).pipe(
      T.JsonName("sourceListenerAddress"),
    ),
    SourceListenerPort: S.optional(S.Number).pipe(
      T.JsonName("sourceListenerPort"),
    ),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
    VpcInterfaceName: S.optional(S.String).pipe(T.JsonName("vpcInterfaceName")),
    WhitelistCidr: S.optional(S.String).pipe(T.JsonName("whitelistCidr")),
    GatewayBridgeSource: S.optional(UpdateGatewayBridgeSourceRequest)
      .pipe(T.JsonName("gatewayBridgeSource"))
      .annotations({ identifier: "UpdateGatewayBridgeSourceRequest" }),
    RouterIntegrationState: S.optional(State).pipe(
      T.JsonName("routerIntegrationState"),
    ),
    RouterIntegrationTransitDecryption: S.optional(FlowTransitEncryption)
      .pipe(T.JsonName("routerIntegrationTransitDecryption"))
      .annotations({ identifier: "FlowTransitEncryption" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/flows/{FlowArn}/source/{SourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFlowSourceRequest",
}) as any as S.Schema<UpdateFlowSourceRequest>;
export interface DescribeGatewayInstanceResponse {
  GatewayInstance?: GatewayInstance & {
    BridgePlacement: BridgePlacement;
    ConnectionStatus: ConnectionStatus;
    GatewayArn: string;
    GatewayInstanceArn: string;
    InstanceId: string;
    InstanceState: InstanceState;
    RunningBridgeCount: number;
    InstanceMessages: (MessageDetail & { Code: string; Message: string })[];
  };
}
export const DescribeGatewayInstanceResponse = S.suspend(() =>
  S.Struct({
    GatewayInstance: S.optional(GatewayInstance)
      .pipe(T.JsonName("gatewayInstance"))
      .annotations({ identifier: "GatewayInstance" }),
  }),
).annotations({
  identifier: "DescribeGatewayInstanceResponse",
}) as any as S.Schema<DescribeGatewayInstanceResponse>;
export interface ListGatewayInstancesResponse {
  Instances?: (ListedGatewayInstance & {
    GatewayArn: string;
    GatewayInstanceArn: string;
    InstanceId: string;
  })[];
  NextToken?: string;
}
export const ListGatewayInstancesResponse = S.suspend(() =>
  S.Struct({
    Instances: S.optional(__listOfListedGatewayInstance).pipe(
      T.JsonName("instances"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListGatewayInstancesResponse",
}) as any as S.Schema<ListGatewayInstancesResponse>;
export interface CreateGatewayResponse {
  Gateway?: Gateway & {
    EgressCidrBlocks: __listOfString;
    GatewayArn: string;
    Name: string;
    Networks: (GatewayNetwork & { CidrBlock: string; Name: string })[];
    GatewayMessages: (MessageDetail & { Code: string; Message: string })[];
  };
}
export const CreateGatewayResponse = S.suspend(() =>
  S.Struct({
    Gateway: S.optional(Gateway)
      .pipe(T.JsonName("gateway"))
      .annotations({ identifier: "Gateway" }),
  }),
).annotations({
  identifier: "CreateGatewayResponse",
}) as any as S.Schema<CreateGatewayResponse>;
export interface DescribeGatewayResponse {
  Gateway?: Gateway & {
    EgressCidrBlocks: __listOfString;
    GatewayArn: string;
    Name: string;
    Networks: (GatewayNetwork & { CidrBlock: string; Name: string })[];
    GatewayMessages: (MessageDetail & { Code: string; Message: string })[];
  };
}
export const DescribeGatewayResponse = S.suspend(() =>
  S.Struct({
    Gateway: S.optional(Gateway)
      .pipe(T.JsonName("gateway"))
      .annotations({ identifier: "Gateway" }),
  }),
).annotations({
  identifier: "DescribeGatewayResponse",
}) as any as S.Schema<DescribeGatewayResponse>;
export interface ListGatewaysResponse {
  Gateways?: (ListedGateway & {
    GatewayArn: string;
    GatewayState: GatewayState;
    Name: string;
  })[];
  NextToken?: string;
}
export const ListGatewaysResponse = S.suspend(() =>
  S.Struct({
    Gateways: S.optional(__listOfListedGateway).pipe(T.JsonName("gateways")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListGatewaysResponse",
}) as any as S.Schema<ListGatewaysResponse>;
export interface PurchaseOfferingResponse {
  Reservation?: Reservation & {
    CurrencyCode: string;
    Duration: number;
    DurationUnits: DurationUnits;
    End: string;
    OfferingArn: string;
    OfferingDescription: string;
    PricePerUnit: string;
    PriceUnits: PriceUnits;
    ReservationArn: string;
    ReservationName: string;
    ReservationState: ReservationState;
    ResourceSpecification: ResourceSpecification & {
      ResourceType: ResourceType;
    };
    Start: string;
  };
}
export const PurchaseOfferingResponse = S.suspend(() =>
  S.Struct({
    Reservation: S.optional(Reservation)
      .pipe(T.JsonName("reservation"))
      .annotations({ identifier: "Reservation" }),
  }),
).annotations({
  identifier: "PurchaseOfferingResponse",
}) as any as S.Schema<PurchaseOfferingResponse>;
export interface GetRouterInputThumbnailResponse {
  Arn: string;
  Name: string;
  ThumbnailDetails: RouterInputThumbnailDetails;
}
export const GetRouterInputThumbnailResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    ThumbnailDetails: RouterInputThumbnailDetails.pipe(
      T.JsonName("thumbnailDetails"),
    ).annotations({ identifier: "RouterInputThumbnailDetails" }),
  }),
).annotations({
  identifier: "GetRouterInputThumbnailResponse",
}) as any as S.Schema<GetRouterInputThumbnailResponse>;
export interface BatchGetRouterInputResponse {
  RouterInputs: RouterInput[];
  Errors: BatchGetRouterInputError[];
}
export const BatchGetRouterInputResponse = S.suspend(() =>
  S.Struct({
    RouterInputs: RouterInputList.pipe(T.JsonName("routerInputs")),
    Errors: BatchGetRouterInputErrorList.pipe(T.JsonName("errors")),
  }),
).annotations({
  identifier: "BatchGetRouterInputResponse",
}) as any as S.Schema<BatchGetRouterInputResponse>;
export interface GetRouterNetworkInterfaceResponse {
  RouterNetworkInterface: RouterNetworkInterface;
}
export const GetRouterNetworkInterfaceResponse = S.suspend(() =>
  S.Struct({
    RouterNetworkInterface: RouterNetworkInterface.pipe(
      T.JsonName("routerNetworkInterface"),
    ).annotations({ identifier: "RouterNetworkInterface" }),
  }),
).annotations({
  identifier: "GetRouterNetworkInterfaceResponse",
}) as any as S.Schema<GetRouterNetworkInterfaceResponse>;
export interface BatchGetRouterNetworkInterfaceResponse {
  RouterNetworkInterfaces: RouterNetworkInterface[];
  Errors: BatchGetRouterNetworkInterfaceError[];
}
export const BatchGetRouterNetworkInterfaceResponse = S.suspend(() =>
  S.Struct({
    RouterNetworkInterfaces: RouterNetworkInterfaceList.pipe(
      T.JsonName("routerNetworkInterfaces"),
    ),
    Errors: BatchGetRouterNetworkInterfaceErrorList.pipe(T.JsonName("errors")),
  }),
).annotations({
  identifier: "BatchGetRouterNetworkInterfaceResponse",
}) as any as S.Schema<BatchGetRouterNetworkInterfaceResponse>;
export interface BatchGetRouterOutputResponse {
  RouterOutputs: RouterOutput[];
  Errors: BatchGetRouterOutputError[];
}
export const BatchGetRouterOutputResponse = S.suspend(() =>
  S.Struct({
    RouterOutputs: RouterOutputList.pipe(T.JsonName("routerOutputs")),
    Errors: BatchGetRouterOutputErrorList.pipe(T.JsonName("errors")),
  }),
).annotations({
  identifier: "BatchGetRouterOutputResponse",
}) as any as S.Schema<BatchGetRouterOutputResponse>;
export interface FrameResolution {
  FrameHeight?: number;
  FrameWidth?: number;
}
export const FrameResolution = S.suspend(() =>
  S.Struct({
    FrameHeight: S.optional(S.Number).pipe(T.JsonName("frameHeight")),
    FrameWidth: S.optional(S.Number).pipe(T.JsonName("frameWidth")),
  }),
).annotations({
  identifier: "FrameResolution",
}) as any as S.Schema<FrameResolution>;
export interface TransportStream {
  Channels?: number;
  Codec?: string;
  FrameRate?: string;
  FrameResolution?: FrameResolution;
  Pid?: number;
  SampleRate?: number;
  SampleSize?: number;
  StreamType?: string;
}
export const TransportStream = S.suspend(() =>
  S.Struct({
    Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
    Codec: S.optional(S.String).pipe(T.JsonName("codec")),
    FrameRate: S.optional(S.String).pipe(T.JsonName("frameRate")),
    FrameResolution: S.optional(FrameResolution)
      .pipe(T.JsonName("frameResolution"))
      .annotations({ identifier: "FrameResolution" }),
    Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    SampleSize: S.optional(S.Number).pipe(T.JsonName("sampleSize")),
    StreamType: S.optional(S.String).pipe(T.JsonName("streamType")),
  }),
).annotations({
  identifier: "TransportStream",
}) as any as S.Schema<TransportStream>;
export type __listOfTransportStream = TransportStream[];
export const __listOfTransportStream = S.Array(TransportStream);
export interface TransportStreamProgram {
  PcrPid?: number;
  ProgramName?: string;
  ProgramNumber?: number;
  ProgramPid?: number;
  Streams?: TransportStream[];
}
export const TransportStreamProgram = S.suspend(() =>
  S.Struct({
    PcrPid: S.optional(S.Number).pipe(T.JsonName("pcrPid")),
    ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    ProgramPid: S.optional(S.Number).pipe(T.JsonName("programPid")),
    Streams: S.optional(__listOfTransportStream).pipe(T.JsonName("streams")),
  }),
).annotations({
  identifier: "TransportStreamProgram",
}) as any as S.Schema<TransportStreamProgram>;
export type __listOfTransportStreamProgram = TransportStreamProgram[];
export const __listOfTransportStreamProgram = S.Array(TransportStreamProgram);
export interface TransportMediaInfo {
  Programs?: TransportStreamProgram[];
}
export const TransportMediaInfo = S.suspend(() =>
  S.Struct({
    Programs: S.optional(__listOfTransportStreamProgram).pipe(
      T.JsonName("programs"),
    ),
  }),
).annotations({
  identifier: "TransportMediaInfo",
}) as any as S.Schema<TransportMediaInfo>;
export type RouterInputMetadata = {
  TransportStreamMediaInfo: TransportMediaInfo;
};
export const RouterInputMetadata = S.Union(
  S.Struct({
    TransportStreamMediaInfo: TransportMediaInfo.pipe(
      T.JsonName("transportStreamMediaInfo"),
    ).annotations({ identifier: "TransportMediaInfo" }),
  }),
);
export interface ListedRouterInput {
  Name: string;
  Arn: string;
  Id: string;
  InputType: RouterInputType;
  State: RouterInputState;
  RoutedOutputs: number;
  RegionName: string;
  AvailabilityZone: string;
  MaximumBitrate: number;
  RoutingScope: RoutingScope;
  CreatedAt: Date;
  UpdatedAt: Date;
  MessageCount: number;
  NetworkInterfaceArn?: string;
  MaintenanceScheduleType?: MaintenanceScheduleType;
  MaintenanceSchedule?: MaintenanceSchedule;
}
export const ListedRouterInput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Arn: S.String.pipe(T.JsonName("arn")),
    Id: S.String.pipe(T.JsonName("id")),
    InputType: RouterInputType.pipe(T.JsonName("inputType")),
    State: RouterInputState.pipe(T.JsonName("state")),
    RoutedOutputs: S.Number.pipe(T.JsonName("routedOutputs")),
    RegionName: S.String.pipe(T.JsonName("regionName")),
    AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
    MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
    RoutingScope: RoutingScope.pipe(T.JsonName("routingScope")),
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("createdAt"),
    ),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("updatedAt"),
    ),
    MessageCount: S.Number.pipe(T.JsonName("messageCount")),
    NetworkInterfaceArn: S.optional(S.String).pipe(
      T.JsonName("networkInterfaceArn"),
    ),
    MaintenanceScheduleType: S.optional(MaintenanceScheduleType).pipe(
      T.JsonName("maintenanceScheduleType"),
    ),
    MaintenanceSchedule: S.optional(MaintenanceSchedule).pipe(
      T.JsonName("maintenanceSchedule"),
    ),
  }),
).annotations({
  identifier: "ListedRouterInput",
}) as any as S.Schema<ListedRouterInput>;
export type ListedRouterInputList = ListedRouterInput[];
export const ListedRouterInputList = S.Array(ListedRouterInput);
export interface RouterInputSourceMetadataDetails {
  SourceMetadataMessages: RouterInputMessage[];
  Timestamp: Date;
  RouterInputMetadata?: RouterInputMetadata;
}
export const RouterInputSourceMetadataDetails = S.suspend(() =>
  S.Struct({
    SourceMetadataMessages: RouterInputMessages.pipe(
      T.JsonName("sourceMetadataMessages"),
    ),
    Timestamp: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("timestamp"),
    ),
    RouterInputMetadata: S.optional(RouterInputMetadata).pipe(
      T.JsonName("routerInputMetadata"),
    ),
  }),
).annotations({
  identifier: "RouterInputSourceMetadataDetails",
}) as any as S.Schema<RouterInputSourceMetadataDetails>;
export interface ListedRouterNetworkInterface {
  Name: string;
  Arn: string;
  Id: string;
  NetworkInterfaceType: RouterNetworkInterfaceType;
  AssociatedOutputCount: number;
  AssociatedInputCount: number;
  State: RouterNetworkInterfaceState;
  RegionName: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}
export const ListedRouterNetworkInterface = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Arn: S.String.pipe(T.JsonName("arn")),
    Id: S.String.pipe(T.JsonName("id")),
    NetworkInterfaceType: RouterNetworkInterfaceType.pipe(
      T.JsonName("networkInterfaceType"),
    ),
    AssociatedOutputCount: S.Number.pipe(T.JsonName("associatedOutputCount")),
    AssociatedInputCount: S.Number.pipe(T.JsonName("associatedInputCount")),
    State: RouterNetworkInterfaceState.pipe(T.JsonName("state")),
    RegionName: S.String.pipe(T.JsonName("regionName")),
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("createdAt"),
    ),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({
  identifier: "ListedRouterNetworkInterface",
}) as any as S.Schema<ListedRouterNetworkInterface>;
export type ListedRouterNetworkInterfaceList = ListedRouterNetworkInterface[];
export const ListedRouterNetworkInterfaceList = S.Array(
  ListedRouterNetworkInterface,
);
export interface ListedRouterOutput {
  Name: string;
  Arn: string;
  Id: string;
  OutputType: RouterOutputType;
  State: RouterOutputState;
  RoutedState: RouterOutputRoutedState;
  RegionName: string;
  AvailabilityZone: string;
  MaximumBitrate: number;
  RoutingScope: RoutingScope;
  CreatedAt: Date;
  UpdatedAt: Date;
  MessageCount: number;
  RoutedInputArn?: string;
  NetworkInterfaceArn?: string;
  MaintenanceScheduleType?: MaintenanceScheduleType;
  MaintenanceSchedule?: MaintenanceSchedule;
}
export const ListedRouterOutput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Arn: S.String.pipe(T.JsonName("arn")),
    Id: S.String.pipe(T.JsonName("id")),
    OutputType: RouterOutputType.pipe(T.JsonName("outputType")),
    State: RouterOutputState.pipe(T.JsonName("state")),
    RoutedState: RouterOutputRoutedState.pipe(T.JsonName("routedState")),
    RegionName: S.String.pipe(T.JsonName("regionName")),
    AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
    MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
    RoutingScope: RoutingScope.pipe(T.JsonName("routingScope")),
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("createdAt"),
    ),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("updatedAt"),
    ),
    MessageCount: S.Number.pipe(T.JsonName("messageCount")),
    RoutedInputArn: S.optional(S.String).pipe(T.JsonName("routedInputArn")),
    NetworkInterfaceArn: S.optional(S.String).pipe(
      T.JsonName("networkInterfaceArn"),
    ),
    MaintenanceScheduleType: S.optional(MaintenanceScheduleType).pipe(
      T.JsonName("maintenanceScheduleType"),
    ),
    MaintenanceSchedule: S.optional(MaintenanceSchedule).pipe(
      T.JsonName("maintenanceSchedule"),
    ),
  }),
).annotations({
  identifier: "ListedRouterOutput",
}) as any as S.Schema<ListedRouterOutput>;
export type ListedRouterOutputList = ListedRouterOutput[];
export const ListedRouterOutputList = S.Array(ListedRouterOutput);
export interface CreateBridgeResponse {
  Bridge?: Bridge & {
    BridgeArn: string;
    BridgeState: BridgeState;
    Name: string;
    PlacementArn: string;
    BridgeMessages: (MessageDetail & { Code: string; Message: string })[];
    EgressGatewayBridge: EgressGatewayBridge & { MaxBitrate: number };
    IngressGatewayBridge: IngressGatewayBridge & {
      MaxBitrate: number;
      MaxOutputs: number;
    };
    Outputs: (BridgeOutput & {
      FlowOutput: BridgeFlowOutput & {
        FlowArn: string;
        FlowSourceArn: string;
        Name: string;
      };
      NetworkOutput: BridgeNetworkOutput & {
        IpAddress: string;
        Name: string;
        NetworkName: string;
        Port: number;
        Protocol: Protocol;
        Ttl: number;
      };
    })[];
    Sources: (BridgeSource & {
      FlowSource: BridgeFlowSource & { FlowArn: string; Name: string };
      NetworkSource: BridgeNetworkSource & {
        MulticastIp: string;
        Name: string;
        NetworkName: string;
        Port: number;
        Protocol: Protocol;
      };
    })[];
  };
}
export const CreateBridgeResponse = S.suspend(() =>
  S.Struct({
    Bridge: S.optional(Bridge)
      .pipe(T.JsonName("bridge"))
      .annotations({ identifier: "Bridge" }),
  }),
).annotations({
  identifier: "CreateBridgeResponse",
}) as any as S.Schema<CreateBridgeResponse>;
export interface DescribeBridgeResponse {
  Bridge?: Bridge & {
    BridgeArn: string;
    BridgeState: BridgeState;
    Name: string;
    PlacementArn: string;
    BridgeMessages: (MessageDetail & { Code: string; Message: string })[];
    EgressGatewayBridge: EgressGatewayBridge & { MaxBitrate: number };
    IngressGatewayBridge: IngressGatewayBridge & {
      MaxBitrate: number;
      MaxOutputs: number;
    };
    Outputs: (BridgeOutput & {
      FlowOutput: BridgeFlowOutput & {
        FlowArn: string;
        FlowSourceArn: string;
        Name: string;
      };
      NetworkOutput: BridgeNetworkOutput & {
        IpAddress: string;
        Name: string;
        NetworkName: string;
        Port: number;
        Protocol: Protocol;
        Ttl: number;
      };
    })[];
    Sources: (BridgeSource & {
      FlowSource: BridgeFlowSource & { FlowArn: string; Name: string };
      NetworkSource: BridgeNetworkSource & {
        MulticastIp: string;
        Name: string;
        NetworkName: string;
        Port: number;
        Protocol: Protocol;
      };
    })[];
  };
}
export const DescribeBridgeResponse = S.suspend(() =>
  S.Struct({
    Bridge: S.optional(Bridge)
      .pipe(T.JsonName("bridge"))
      .annotations({ identifier: "Bridge" }),
  }),
).annotations({
  identifier: "DescribeBridgeResponse",
}) as any as S.Schema<DescribeBridgeResponse>;
export interface AddBridgeOutputsResponse {
  BridgeArn?: string;
  Outputs?: (BridgeOutput & {
    FlowOutput: BridgeFlowOutput & {
      FlowArn: string;
      FlowSourceArn: string;
      Name: string;
    };
    NetworkOutput: BridgeNetworkOutput & {
      IpAddress: string;
      Name: string;
      NetworkName: string;
      Port: number;
      Protocol: Protocol;
      Ttl: number;
    };
  })[];
}
export const AddBridgeOutputsResponse = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    Outputs: S.optional(__listOfBridgeOutput).pipe(T.JsonName("outputs")),
  }),
).annotations({
  identifier: "AddBridgeOutputsResponse",
}) as any as S.Schema<AddBridgeOutputsResponse>;
export interface AddBridgeSourcesResponse {
  BridgeArn?: string;
  Sources?: (BridgeSource & {
    FlowSource: BridgeFlowSource & { FlowArn: string; Name: string };
    NetworkSource: BridgeNetworkSource & {
      MulticastIp: string;
      Name: string;
      NetworkName: string;
      Port: number;
      Protocol: Protocol;
    };
  })[];
}
export const AddBridgeSourcesResponse = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    Sources: S.optional(__listOfBridgeSource).pipe(T.JsonName("sources")),
  }),
).annotations({
  identifier: "AddBridgeSourcesResponse",
}) as any as S.Schema<AddBridgeSourcesResponse>;
export interface UpdateBridgeSourceResponse {
  BridgeArn?: string;
  Source?: BridgeSource & {
    FlowSource: BridgeFlowSource & { FlowArn: string; Name: string };
    NetworkSource: BridgeNetworkSource & {
      MulticastIp: string;
      Name: string;
      NetworkName: string;
      Port: number;
      Protocol: Protocol;
    };
  };
}
export const UpdateBridgeSourceResponse = S.suspend(() =>
  S.Struct({
    BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
    Source: S.optional(BridgeSource)
      .pipe(T.JsonName("source"))
      .annotations({ identifier: "BridgeSource" }),
  }),
).annotations({
  identifier: "UpdateBridgeSourceResponse",
}) as any as S.Schema<UpdateBridgeSourceResponse>;
export interface CreateFlowRequest {
  AvailabilityZone?: string;
  Entitlements?: GrantEntitlementRequest[];
  MediaStreams?: AddMediaStreamRequest[];
  Name?: string;
  Outputs?: AddOutputRequest[];
  Source?: SetSourceRequest;
  SourceFailoverConfig?: FailoverConfig;
  Sources?: SetSourceRequest[];
  VpcInterfaces?: VpcInterfaceRequest[];
  Maintenance?: AddMaintenance;
  SourceMonitoringConfig?: MonitoringConfig;
  FlowSize?: FlowSize;
  NdiConfig?: NdiConfig;
  FlowTags?: { [key: string]: string | undefined };
}
export const CreateFlowRequest = S.suspend(() =>
  S.Struct({
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    Entitlements: S.optional(__listOfGrantEntitlementRequest).pipe(
      T.JsonName("entitlements"),
    ),
    MediaStreams: S.optional(__listOfAddMediaStreamRequest).pipe(
      T.JsonName("mediaStreams"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Outputs: S.optional(__listOfAddOutputRequest).pipe(T.JsonName("outputs")),
    Source: S.optional(SetSourceRequest)
      .pipe(T.JsonName("source"))
      .annotations({ identifier: "SetSourceRequest" }),
    SourceFailoverConfig: S.optional(FailoverConfig)
      .pipe(T.JsonName("sourceFailoverConfig"))
      .annotations({ identifier: "FailoverConfig" }),
    Sources: S.optional(__listOfSetSourceRequest).pipe(T.JsonName("sources")),
    VpcInterfaces: S.optional(__listOfVpcInterfaceRequest).pipe(
      T.JsonName("vpcInterfaces"),
    ),
    Maintenance: S.optional(AddMaintenance)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "AddMaintenance" }),
    SourceMonitoringConfig: S.optional(MonitoringConfig)
      .pipe(T.JsonName("sourceMonitoringConfig"))
      .annotations({ identifier: "MonitoringConfig" }),
    FlowSize: S.optional(FlowSize).pipe(T.JsonName("flowSize")),
    NdiConfig: S.optional(NdiConfig)
      .pipe(T.JsonName("ndiConfig"))
      .annotations({ identifier: "NdiConfig" }),
    FlowTags: S.optional(__mapOfString).pipe(T.JsonName("flowTags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/flows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFlowRequest",
}) as any as S.Schema<CreateFlowRequest>;
export interface DescribeFlowResponse {
  Flow?: Flow & {
    AvailabilityZone: string;
    Entitlements: (Entitlement & {
      EntitlementArn: string;
      Name: string;
      Subscribers: __listOfString;
      Encryption: Encryption & { RoleArn: string };
    })[];
    FlowArn: string;
    Name: string;
    Outputs: (Output & {
      Name: string;
      OutputArn: string;
      Encryption: Encryption & { RoleArn: string };
      MediaStreamOutputConfigurations: (MediaStreamOutputConfiguration & {
        EncodingName: EncodingName;
        MediaStreamName: string;
        DestinationConfigurations: (DestinationConfiguration & {
          DestinationIp: string;
          DestinationPort: number;
          Interface: Interface & { Name: string };
          OutboundIp: string;
        })[];
        EncodingParameters: EncodingParameters & {
          CompressionFactor: number;
          EncoderProfile: EncoderProfile;
        };
      })[];
      Transport: Transport & { Protocol: Protocol };
    })[];
    Source: Source & {
      Name: string;
      SourceArn: string;
      Decryption: Encryption & { RoleArn: string };
      MediaStreamSourceConfigurations: (MediaStreamSourceConfiguration & {
        EncodingName: EncodingName;
        MediaStreamName: string;
        InputConfigurations: (InputConfiguration & {
          InputIp: string;
          InputPort: number;
          Interface: Interface & { Name: string };
        })[];
      })[];
      Transport: Transport & { Protocol: Protocol };
      GatewayBridgeSource: GatewayBridgeSource & { BridgeArn: string };
    };
    Status: Status;
    MediaStreams: (MediaStream & {
      Fmt: number;
      MediaStreamId: number;
      MediaStreamName: string;
      MediaStreamType: MediaStreamType;
      Attributes: MediaStreamAttributes & { Fmtp: Fmtp };
    })[];
    Sources: (Source & {
      Name: string;
      SourceArn: string;
      Decryption: Encryption & { RoleArn: string };
      MediaStreamSourceConfigurations: (MediaStreamSourceConfiguration & {
        EncodingName: EncodingName;
        MediaStreamName: string;
        InputConfigurations: (InputConfiguration & {
          InputIp: string;
          InputPort: number;
          Interface: Interface & { Name: string };
        })[];
      })[];
      Transport: Transport & { Protocol: Protocol };
      GatewayBridgeSource: GatewayBridgeSource & { BridgeArn: string };
    })[];
    VpcInterfaces: (VpcInterface & {
      Name: string;
      NetworkInterfaceIds: __listOfString;
      NetworkInterfaceType: NetworkInterfaceType;
      RoleArn: string;
      SecurityGroupIds: __listOfString;
      SubnetId: string;
    })[];
    NdiConfig: NdiConfig & {
      NdiDiscoveryServers: (NdiDiscoveryServerConfig & {
        DiscoveryServerAddress: string;
        VpcInterfaceAdapter: string;
      })[];
    };
  };
  Messages?: Messages & { Errors: __listOfString };
}
export const DescribeFlowResponse = S.suspend(() =>
  S.Struct({
    Flow: S.optional(Flow)
      .pipe(T.JsonName("flow"))
      .annotations({ identifier: "Flow" }),
    Messages: S.optional(Messages)
      .pipe(T.JsonName("messages"))
      .annotations({ identifier: "Messages" }),
  }),
).annotations({
  identifier: "DescribeFlowResponse",
}) as any as S.Schema<DescribeFlowResponse>;
export interface UpdateFlowMediaStreamResponse {
  FlowArn?: string;
  MediaStream?: MediaStream & {
    Fmt: number;
    MediaStreamId: number;
    MediaStreamName: string;
    MediaStreamType: MediaStreamType;
    Attributes: MediaStreamAttributes & { Fmtp: Fmtp };
  };
}
export const UpdateFlowMediaStreamResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    MediaStream: S.optional(MediaStream)
      .pipe(T.JsonName("mediaStream"))
      .annotations({ identifier: "MediaStream" }),
  }),
).annotations({
  identifier: "UpdateFlowMediaStreamResponse",
}) as any as S.Schema<UpdateFlowMediaStreamResponse>;
export interface UpdateFlowOutputRequest {
  CidrAllowList?: string[];
  Description?: string;
  Destination?: string;
  Encryption?: UpdateEncryption;
  FlowArn: string;
  MaxLatency?: number;
  MediaStreamOutputConfigurations?: MediaStreamOutputConfigurationRequest[];
  MinLatency?: number;
  OutputArn: string;
  Port?: number;
  Protocol?: Protocol;
  RemoteId?: string;
  SenderControlPort?: number;
  SenderIpAddress?: string;
  SmoothingLatency?: number;
  StreamId?: string;
  VpcInterfaceAttachment?: VpcInterfaceAttachment;
  OutputStatus?: OutputStatus;
  NdiProgramName?: string;
  NdiSpeedHqQuality?: number;
  RouterIntegrationState?: State;
  RouterIntegrationTransitEncryption?: FlowTransitEncryption;
}
export const UpdateFlowOutputRequest = S.suspend(() =>
  S.Struct({
    CidrAllowList: S.optional(__listOfString).pipe(T.JsonName("cidrAllowList")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    Encryption: S.optional(UpdateEncryption)
      .pipe(T.JsonName("encryption"))
      .annotations({ identifier: "UpdateEncryption" }),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    MaxLatency: S.optional(S.Number).pipe(T.JsonName("maxLatency")),
    MediaStreamOutputConfigurations: S.optional(
      __listOfMediaStreamOutputConfigurationRequest,
    ).pipe(T.JsonName("mediaStreamOutputConfigurations")),
    MinLatency: S.optional(S.Number).pipe(T.JsonName("minLatency")),
    OutputArn: S.String.pipe(T.HttpLabel("OutputArn")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Protocol: S.optional(Protocol).pipe(T.JsonName("protocol")),
    RemoteId: S.optional(S.String).pipe(T.JsonName("remoteId")),
    SenderControlPort: S.optional(S.Number).pipe(
      T.JsonName("senderControlPort"),
    ),
    SenderIpAddress: S.optional(S.String).pipe(T.JsonName("senderIpAddress")),
    SmoothingLatency: S.optional(S.Number).pipe(T.JsonName("smoothingLatency")),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
    VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment)
      .pipe(T.JsonName("vpcInterfaceAttachment"))
      .annotations({ identifier: "VpcInterfaceAttachment" }),
    OutputStatus: S.optional(OutputStatus).pipe(T.JsonName("outputStatus")),
    NdiProgramName: S.optional(S.String).pipe(T.JsonName("ndiProgramName")),
    NdiSpeedHqQuality: S.optional(S.Number).pipe(
      T.JsonName("ndiSpeedHqQuality"),
    ),
    RouterIntegrationState: S.optional(State).pipe(
      T.JsonName("routerIntegrationState"),
    ),
    RouterIntegrationTransitEncryption: S.optional(FlowTransitEncryption)
      .pipe(T.JsonName("routerIntegrationTransitEncryption"))
      .annotations({ identifier: "FlowTransitEncryption" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/flows/{FlowArn}/outputs/{OutputArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFlowOutputRequest",
}) as any as S.Schema<UpdateFlowOutputRequest>;
export interface UpdateFlowSourceResponse {
  FlowArn?: string;
  Source?: Source & {
    Name: string;
    SourceArn: string;
    Decryption: Encryption & { RoleArn: string };
    MediaStreamSourceConfigurations: (MediaStreamSourceConfiguration & {
      EncodingName: EncodingName;
      MediaStreamName: string;
      InputConfigurations: (InputConfiguration & {
        InputIp: string;
        InputPort: number;
        Interface: Interface & { Name: string };
      })[];
    })[];
    Transport: Transport & { Protocol: Protocol };
    GatewayBridgeSource: GatewayBridgeSource & { BridgeArn: string };
  };
}
export const UpdateFlowSourceResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Source: S.optional(Source)
      .pipe(T.JsonName("source"))
      .annotations({ identifier: "Source" }),
  }),
).annotations({
  identifier: "UpdateFlowSourceResponse",
}) as any as S.Schema<UpdateFlowSourceResponse>;
export interface DescribeOfferingResponse {
  Offering?: Offering & {
    CurrencyCode: string;
    Duration: number;
    DurationUnits: DurationUnits;
    OfferingArn: string;
    OfferingDescription: string;
    PricePerUnit: string;
    PriceUnits: PriceUnits;
    ResourceSpecification: ResourceSpecification & {
      ResourceType: ResourceType;
    };
  };
}
export const DescribeOfferingResponse = S.suspend(() =>
  S.Struct({
    Offering: S.optional(Offering)
      .pipe(T.JsonName("offering"))
      .annotations({ identifier: "Offering" }),
  }),
).annotations({
  identifier: "DescribeOfferingResponse",
}) as any as S.Schema<DescribeOfferingResponse>;
export interface ListRouterInputsResponse {
  RouterInputs: ListedRouterInput[];
  NextToken?: string;
}
export const ListRouterInputsResponse = S.suspend(() =>
  S.Struct({
    RouterInputs: ListedRouterInputList.pipe(T.JsonName("routerInputs")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListRouterInputsResponse",
}) as any as S.Schema<ListRouterInputsResponse>;
export interface GetRouterInputSourceMetadataResponse {
  Arn: string;
  Name: string;
  SourceMetadataDetails: RouterInputSourceMetadataDetails;
}
export const GetRouterInputSourceMetadataResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    SourceMetadataDetails: RouterInputSourceMetadataDetails.pipe(
      T.JsonName("sourceMetadataDetails"),
    ).annotations({ identifier: "RouterInputSourceMetadataDetails" }),
  }),
).annotations({
  identifier: "GetRouterInputSourceMetadataResponse",
}) as any as S.Schema<GetRouterInputSourceMetadataResponse>;
export interface StartRouterInputResponse {
  Arn: string;
  Name: string;
  State: RouterInputState;
  MaintenanceScheduleType: MaintenanceScheduleType;
  MaintenanceSchedule: MaintenanceSchedule;
}
export const StartRouterInputResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.JsonName("arn")),
    Name: S.String.pipe(T.JsonName("name")),
    State: RouterInputState.pipe(T.JsonName("state")),
    MaintenanceScheduleType: MaintenanceScheduleType.pipe(
      T.JsonName("maintenanceScheduleType"),
    ),
    MaintenanceSchedule: MaintenanceSchedule.pipe(
      T.JsonName("maintenanceSchedule"),
    ),
  }),
).annotations({
  identifier: "StartRouterInputResponse",
}) as any as S.Schema<StartRouterInputResponse>;
export interface CreateRouterNetworkInterfaceRequest {
  Name: string;
  Configuration: RouterNetworkInterfaceConfiguration;
  RegionName?: string;
  Tags?: { [key: string]: string | undefined };
  ClientToken?: string;
}
export const CreateRouterNetworkInterfaceRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Configuration: RouterNetworkInterfaceConfiguration.pipe(
      T.JsonName("configuration"),
    ),
    RegionName: S.optional(S.String).pipe(T.JsonName("regionName")),
    Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerNetworkInterface" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRouterNetworkInterfaceRequest",
}) as any as S.Schema<CreateRouterNetworkInterfaceRequest>;
export interface ListRouterNetworkInterfacesResponse {
  RouterNetworkInterfaces: ListedRouterNetworkInterface[];
  NextToken?: string;
}
export const ListRouterNetworkInterfacesResponse = S.suspend(() =>
  S.Struct({
    RouterNetworkInterfaces: ListedRouterNetworkInterfaceList.pipe(
      T.JsonName("routerNetworkInterfaces"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListRouterNetworkInterfacesResponse",
}) as any as S.Schema<ListRouterNetworkInterfacesResponse>;
export interface ListRouterOutputsResponse {
  RouterOutputs: ListedRouterOutput[];
  NextToken?: string;
}
export const ListRouterOutputsResponse = S.suspend(() =>
  S.Struct({
    RouterOutputs: ListedRouterOutputList.pipe(T.JsonName("routerOutputs")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListRouterOutputsResponse",
}) as any as S.Schema<ListRouterOutputsResponse>;
export interface CreateFlowResponse {
  Flow?: Flow & {
    AvailabilityZone: string;
    Entitlements: (Entitlement & {
      EntitlementArn: string;
      Name: string;
      Subscribers: __listOfString;
      Encryption: Encryption & { RoleArn: string };
    })[];
    FlowArn: string;
    Name: string;
    Outputs: (Output & {
      Name: string;
      OutputArn: string;
      Encryption: Encryption & { RoleArn: string };
      MediaStreamOutputConfigurations: (MediaStreamOutputConfiguration & {
        EncodingName: EncodingName;
        MediaStreamName: string;
        DestinationConfigurations: (DestinationConfiguration & {
          DestinationIp: string;
          DestinationPort: number;
          Interface: Interface & { Name: string };
          OutboundIp: string;
        })[];
        EncodingParameters: EncodingParameters & {
          CompressionFactor: number;
          EncoderProfile: EncoderProfile;
        };
      })[];
      Transport: Transport & { Protocol: Protocol };
    })[];
    Source: Source & {
      Name: string;
      SourceArn: string;
      Decryption: Encryption & { RoleArn: string };
      MediaStreamSourceConfigurations: (MediaStreamSourceConfiguration & {
        EncodingName: EncodingName;
        MediaStreamName: string;
        InputConfigurations: (InputConfiguration & {
          InputIp: string;
          InputPort: number;
          Interface: Interface & { Name: string };
        })[];
      })[];
      Transport: Transport & { Protocol: Protocol };
      GatewayBridgeSource: GatewayBridgeSource & { BridgeArn: string };
    };
    Status: Status;
    MediaStreams: (MediaStream & {
      Fmt: number;
      MediaStreamId: number;
      MediaStreamName: string;
      MediaStreamType: MediaStreamType;
      Attributes: MediaStreamAttributes & { Fmtp: Fmtp };
    })[];
    Sources: (Source & {
      Name: string;
      SourceArn: string;
      Decryption: Encryption & { RoleArn: string };
      MediaStreamSourceConfigurations: (MediaStreamSourceConfiguration & {
        EncodingName: EncodingName;
        MediaStreamName: string;
        InputConfigurations: (InputConfiguration & {
          InputIp: string;
          InputPort: number;
          Interface: Interface & { Name: string };
        })[];
      })[];
      Transport: Transport & { Protocol: Protocol };
      GatewayBridgeSource: GatewayBridgeSource & { BridgeArn: string };
    })[];
    VpcInterfaces: (VpcInterface & {
      Name: string;
      NetworkInterfaceIds: __listOfString;
      NetworkInterfaceType: NetworkInterfaceType;
      RoleArn: string;
      SecurityGroupIds: __listOfString;
      SubnetId: string;
    })[];
    NdiConfig: NdiConfig & {
      NdiDiscoveryServers: (NdiDiscoveryServerConfig & {
        DiscoveryServerAddress: string;
        VpcInterfaceAdapter: string;
      })[];
    };
  };
}
export const CreateFlowResponse = S.suspend(() =>
  S.Struct({
    Flow: S.optional(Flow)
      .pipe(T.JsonName("flow"))
      .annotations({ identifier: "Flow" }),
  }),
).annotations({
  identifier: "CreateFlowResponse",
}) as any as S.Schema<CreateFlowResponse>;
export interface AddFlowMediaStreamsResponse {
  FlowArn?: string;
  MediaStreams?: (MediaStream & {
    Fmt: number;
    MediaStreamId: number;
    MediaStreamName: string;
    MediaStreamType: MediaStreamType;
    Attributes: MediaStreamAttributes & { Fmtp: Fmtp };
  })[];
}
export const AddFlowMediaStreamsResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    MediaStreams: S.optional(__listOfMediaStream).pipe(
      T.JsonName("mediaStreams"),
    ),
  }),
).annotations({
  identifier: "AddFlowMediaStreamsResponse",
}) as any as S.Schema<AddFlowMediaStreamsResponse>;
export interface AddFlowSourcesResponse {
  FlowArn?: string;
  Sources?: (Source & {
    Name: string;
    SourceArn: string;
    Decryption: Encryption & { RoleArn: string };
    MediaStreamSourceConfigurations: (MediaStreamSourceConfiguration & {
      EncodingName: EncodingName;
      MediaStreamName: string;
      InputConfigurations: (InputConfiguration & {
        InputIp: string;
        InputPort: number;
        Interface: Interface & { Name: string };
      })[];
    })[];
    Transport: Transport & { Protocol: Protocol };
    GatewayBridgeSource: GatewayBridgeSource & { BridgeArn: string };
  })[];
}
export const AddFlowSourcesResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Sources: S.optional(__listOfSource).pipe(T.JsonName("sources")),
  }),
).annotations({
  identifier: "AddFlowSourcesResponse",
}) as any as S.Schema<AddFlowSourcesResponse>;
export interface UpdateFlowOutputResponse {
  FlowArn?: string;
  Output?: Output & {
    Name: string;
    OutputArn: string;
    Encryption: Encryption & { RoleArn: string };
    MediaStreamOutputConfigurations: (MediaStreamOutputConfiguration & {
      EncodingName: EncodingName;
      MediaStreamName: string;
      DestinationConfigurations: (DestinationConfiguration & {
        DestinationIp: string;
        DestinationPort: number;
        Interface: Interface & { Name: string };
        OutboundIp: string;
      })[];
      EncodingParameters: EncodingParameters & {
        CompressionFactor: number;
        EncoderProfile: EncoderProfile;
      };
    })[];
    Transport: Transport & { Protocol: Protocol };
  };
}
export const UpdateFlowOutputResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Output: S.optional(Output)
      .pipe(T.JsonName("output"))
      .annotations({ identifier: "Output" }),
  }),
).annotations({
  identifier: "UpdateFlowOutputResponse",
}) as any as S.Schema<UpdateFlowOutputResponse>;
export interface CreateRouterNetworkInterfaceResponse {
  RouterNetworkInterface: RouterNetworkInterface;
}
export const CreateRouterNetworkInterfaceResponse = S.suspend(() =>
  S.Struct({
    RouterNetworkInterface: RouterNetworkInterface.pipe(
      T.JsonName("routerNetworkInterface"),
    ).annotations({ identifier: "RouterNetworkInterface" }),
  }),
).annotations({
  identifier: "CreateRouterNetworkInterfaceResponse",
}) as any as S.Schema<CreateRouterNetworkInterfaceResponse>;
export interface GetRouterOutputResponse {
  RouterOutput: RouterOutput;
}
export const GetRouterOutputResponse = S.suspend(() =>
  S.Struct({
    RouterOutput: RouterOutput.pipe(T.JsonName("routerOutput")).annotations({
      identifier: "RouterOutput",
    }),
  }),
).annotations({
  identifier: "GetRouterOutputResponse",
}) as any as S.Schema<GetRouterOutputResponse>;
export interface AddFlowOutputsResponse {
  FlowArn?: string;
  Outputs?: (Output & {
    Name: string;
    OutputArn: string;
    Encryption: Encryption & { RoleArn: string };
    MediaStreamOutputConfigurations: (MediaStreamOutputConfiguration & {
      EncodingName: EncodingName;
      MediaStreamName: string;
      DestinationConfigurations: (DestinationConfiguration & {
        DestinationIp: string;
        DestinationPort: number;
        Interface: Interface & { Name: string };
        OutboundIp: string;
      })[];
      EncodingParameters: EncodingParameters & {
        CompressionFactor: number;
        EncoderProfile: EncoderProfile;
      };
    })[];
    Transport: Transport & { Protocol: Protocol };
  })[];
}
export const AddFlowOutputsResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Outputs: S.optional(__listOfOutput).pipe(T.JsonName("outputs")),
  }),
).annotations({
  identifier: "AddFlowOutputsResponse",
}) as any as S.Schema<AddFlowOutputsResponse>;
export interface DescribeFlowSourceMetadataResponse {
  FlowArn?: string;
  Messages?: (MessageDetail & { Code: string; Message: string })[];
  Timestamp?: Date;
  TransportMediaInfo?: TransportMediaInfo & {
    Programs: (TransportStreamProgram & {
      PcrPid: number;
      ProgramNumber: number;
      ProgramPid: number;
      Streams: (TransportStream & {
        Pid: number;
        StreamType: string;
        FrameResolution: FrameResolution & {
          FrameHeight: number;
          FrameWidth: number;
        };
      })[];
    })[];
  };
}
export const DescribeFlowSourceMetadataResponse = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    Messages: S.optional(__listOfMessageDetail).pipe(T.JsonName("messages")),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("timestamp"),
    ),
    TransportMediaInfo: S.optional(TransportMediaInfo)
      .pipe(T.JsonName("transportMediaInfo"))
      .annotations({ identifier: "TransportMediaInfo" }),
  }),
).annotations({
  identifier: "DescribeFlowSourceMetadataResponse",
}) as any as S.Schema<DescribeFlowSourceMetadataResponse>;
export interface CreateRouterInputRequest {
  Name: string;
  Configuration: RouterInputConfiguration;
  MaximumBitrate: number;
  RoutingScope: RoutingScope;
  Tier: RouterInputTier;
  RegionName?: string;
  AvailabilityZone?: string;
  TransitEncryption?: RouterInputTransitEncryption;
  MaintenanceConfiguration?: MaintenanceConfiguration;
  Tags?: { [key: string]: string | undefined };
  ClientToken?: string;
}
export const CreateRouterInputRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Configuration: RouterInputConfiguration.pipe(T.JsonName("configuration")),
    MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
    RoutingScope: RoutingScope.pipe(T.JsonName("routingScope")),
    Tier: RouterInputTier.pipe(T.JsonName("tier")),
    RegionName: S.optional(S.String).pipe(T.JsonName("regionName")),
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    TransitEncryption: S.optional(RouterInputTransitEncryption)
      .pipe(T.JsonName("transitEncryption"))
      .annotations({ identifier: "RouterInputTransitEncryption" }),
    MaintenanceConfiguration: S.optional(MaintenanceConfiguration).pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
    Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerInput" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRouterInputRequest",
}) as any as S.Schema<CreateRouterInputRequest>;
export interface GetRouterInputResponse {
  RouterInput: RouterInput;
}
export const GetRouterInputResponse = S.suspend(() =>
  S.Struct({
    RouterInput: RouterInput.pipe(T.JsonName("routerInput")).annotations({
      identifier: "RouterInput",
    }),
  }),
).annotations({
  identifier: "GetRouterInputResponse",
}) as any as S.Schema<GetRouterInputResponse>;
export interface CreateRouterOutputRequest {
  Name: string;
  Configuration: RouterOutputConfiguration;
  MaximumBitrate: number;
  RoutingScope: RoutingScope;
  Tier: RouterOutputTier;
  RegionName?: string;
  AvailabilityZone?: string;
  MaintenanceConfiguration?: MaintenanceConfiguration;
  Tags?: { [key: string]: string | undefined };
  ClientToken?: string;
}
export const CreateRouterOutputRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Configuration: RouterOutputConfiguration.pipe(T.JsonName("configuration")),
    MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
    RoutingScope: RoutingScope.pipe(T.JsonName("routingScope")),
    Tier: RouterOutputTier.pipe(T.JsonName("tier")),
    RegionName: S.optional(S.String).pipe(T.JsonName("regionName")),
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    MaintenanceConfiguration: S.optional(MaintenanceConfiguration).pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
    Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")),
    ClientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/routerOutput" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRouterOutputRequest",
}) as any as S.Schema<CreateRouterOutputRequest>;
export interface CreateRouterInputResponse {
  RouterInput: RouterInput;
}
export const CreateRouterInputResponse = S.suspend(() =>
  S.Struct({
    RouterInput: RouterInput.pipe(T.JsonName("routerInput")).annotations({
      identifier: "RouterInput",
    }),
  }),
).annotations({
  identifier: "CreateRouterInputResponse",
}) as any as S.Schema<CreateRouterInputResponse>;
export interface CreateRouterOutputResponse {
  RouterOutput: RouterOutput;
}
export const CreateRouterOutputResponse = S.suspend(() =>
  S.Struct({
    RouterOutput: RouterOutput.pipe(T.JsonName("routerOutput")).annotations({
      identifier: "RouterOutput",
    }),
  }),
).annotations({
  identifier: "CreateRouterOutputResponse",
}) as any as S.Schema<CreateRouterOutputResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(C.withConflictError, C.withRetryableError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class GrantFlowEntitlements420Exception extends S.TaggedError<GrantFlowEntitlements420Exception>()(
  "GrantFlowEntitlements420Exception",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class CreateGateway420Exception extends S.TaggedError<CreateGateway420Exception>()(
  "CreateGateway420Exception",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class CreateBridge420Exception extends S.TaggedError<CreateBridge420Exception>()(
  "CreateBridge420Exception",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class CreateFlow420Exception extends S.TaggedError<CreateFlow420Exception>()(
  "CreateFlow420Exception",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class RouterNetworkInterfaceServiceQuotaExceededException extends S.TaggedError<RouterNetworkInterfaceServiceQuotaExceededException>()(
  "RouterNetworkInterfaceServiceQuotaExceededException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class AddFlowOutputs420Exception extends S.TaggedError<AddFlowOutputs420Exception>()(
  "AddFlowOutputs420Exception",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class RouterInputServiceQuotaExceededException extends S.TaggedError<RouterInputServiceQuotaExceededException>()(
  "RouterInputServiceQuotaExceededException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class RouterOutputServiceQuotaExceededException extends S.TaggedError<RouterOutputServiceQuotaExceededException>()(
  "RouterOutputServiceQuotaExceededException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}

//# Operations
/**
 * Associates the specified tags to a resource with the specified `resourceArn` in the current region. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are deleted as well.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Removes tags from a global resource in AWS Elemental MediaConnect. The API supports the following global resources: router inputs, router outputs and router network interfaces.
 */
export const untagGlobalResource: (
  input: UntagGlobalResourceRequest,
) => effect.Effect<
  UntagGlobalResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagGlobalResourceRequest,
  output: UntagGlobalResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Deletes specified tags from a resource in the current region.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Lists the tags associated with a global resource in AWS Elemental MediaConnect. The API supports the following global resources: router inputs, router outputs and router network interfaces.
 */
export const listTagsForGlobalResource: (
  input: ListTagsForGlobalResourceRequest,
) => effect.Effect<
  ListTagsForGlobalResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForGlobalResourceRequest,
  output: ListTagsForGlobalResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * List all tags on a MediaConnect resource in the current region.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Adds tags to a global resource in AWS Elemental MediaConnect. The API supports the following global resources: router inputs, router outputs and router network interfaces.
 */
export const tagGlobalResource: (
  input: TagGlobalResourceRequest,
) => effect.Effect<
  TagGlobalResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagGlobalResourceRequest,
  output: TagGlobalResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Displays a list of bridges that are associated with this account and an optionally specified Amazon Resource Name (ARN). This request returns a paginated result.
 */
export const listBridges: {
  (
    input: ListBridgesRequest,
  ): effect.Effect<
    ListBridgesResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBridgesRequest,
  ) => stream.Stream<
    ListBridgesResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBridgesRequest,
  ) => stream.Stream<
    ListedBridge,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBridgesRequest,
  output: ListBridgesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Bridges",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds media streams to an existing flow. After you add a media stream to a flow, you can associate it with a source and/or an output that uses the ST 2110 JPEG XS or CDI protocol.
 */
export const addFlowMediaStreams: (
  input: AddFlowMediaStreamsRequest,
) => effect.Effect<
  AddFlowMediaStreamsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddFlowMediaStreamsRequest,
  output: AddFlowMediaStreamsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds sources to a flow.
 */
export const addFlowSources: (
  input: AddFlowSourcesRequest,
) => effect.Effect<
  AddFlowSourcesResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddFlowSourcesRequest,
  output: AddFlowSourcesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing flow output.
 */
export const updateFlowOutput: (
  input: UpdateFlowOutputRequest,
) => effect.Effect<
  UpdateFlowOutputResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlowOutputRequest,
  output: UpdateFlowOutputResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about a specific router output in AWS Elemental MediaConnect.
 */
export const getRouterOutput: (
  input: GetRouterOutputRequest,
) => effect.Effect<
  GetRouterOutputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouterOutputRequest,
  output: GetRouterOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds outputs to an existing bridge.
 */
export const addBridgeOutputs: (
  input: AddBridgeOutputsRequest,
) => effect.Effect<
  AddBridgeOutputsResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddBridgeOutputsRequest,
  output: AddBridgeOutputsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds sources to an existing bridge.
 */
export const addBridgeSources: (
  input: AddBridgeSourcesRequest,
) => effect.Effect<
  AddBridgeSourcesResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddBridgeSourcesRequest,
  output: AddBridgeSourcesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing bridge source.
 */
export const updateBridgeSource: (
  input: UpdateBridgeSourceRequest,
) => effect.Effect<
  UpdateBridgeSourceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBridgeSourceRequest,
  output: UpdateBridgeSourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays the details of a flow. The response includes the flow Amazon Resource Name (ARN), name, and Availability Zone, as well as details about the source, outputs, and entitlements.
 */
export const describeFlow: (
  input: DescribeFlowRequest,
) => effect.Effect<
  DescribeFlowResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFlowRequest,
  output: DescribeFlowResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Grants entitlements to an existing flow.
 */
export const grantFlowEntitlements: (
  input: GrantFlowEntitlementsRequest,
) => effect.Effect<
  GrantFlowEntitlementsResponse,
  | BadRequestException
  | ForbiddenException
  | GrantFlowEntitlements420Exception
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GrantFlowEntitlementsRequest,
  output: GrantFlowEntitlementsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    GrantFlowEntitlements420Exception,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing media stream.
 */
export const updateFlowMediaStream: (
  input: UpdateFlowMediaStreamRequest,
) => effect.Effect<
  UpdateFlowMediaStreamResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlowMediaStreamRequest,
  output: UpdateFlowMediaStreamResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the source of a flow.
 */
export const updateFlowSource: (
  input: UpdateFlowSourceRequest,
) => effect.Effect<
  UpdateFlowSourceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlowSourceRequest,
  output: UpdateFlowSourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new gateway. The request must include at least one network (up to four).
 */
export const createGateway: (
  input: CreateGatewayRequest,
) => effect.Effect<
  CreateGatewayResponse,
  | BadRequestException
  | ConflictException
  | CreateGateway420Exception
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGatewayRequest,
  output: CreateGatewayResponse,
  errors: [
    BadRequestException,
    ConflictException,
    CreateGateway420Exception,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays the details of an offering. The response includes the offering description, duration, outbound bandwidth, price, and Amazon Resource Name (ARN).
 */
export const describeOffering: (
  input: DescribeOfferingRequest,
) => effect.Effect<
  DescribeOfferingResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOfferingRequest,
  output: DescribeOfferingResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves a list of router inputs in AWS Elemental MediaConnect.
 */
export const listRouterInputs: {
  (
    input: ListRouterInputsRequest,
  ): effect.Effect<
    ListRouterInputsResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRouterInputsRequest,
  ) => stream.Stream<
    ListRouterInputsResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRouterInputsRequest,
  ) => stream.Stream<
    ListedRouterInput,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRouterInputsRequest,
  output: ListRouterInputsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RouterInputs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves detailed metadata information about a specific router input source, including stream details and connection state.
 */
export const getRouterInputSourceMetadata: (
  input: GetRouterInputSourceMetadataRequest,
) => effect.Effect<
  GetRouterInputSourceMetadataResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouterInputSourceMetadataRequest,
  output: GetRouterInputSourceMetadataResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts a router input in AWS Elemental MediaConnect.
 */
export const startRouterInput: (
  input: StartRouterInputRequest,
) => effect.Effect<
  StartRouterInputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRouterInputRequest,
  output: StartRouterInputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves a list of router network interfaces in AWS Elemental MediaConnect.
 */
export const listRouterNetworkInterfaces: {
  (
    input: ListRouterNetworkInterfacesRequest,
  ): effect.Effect<
    ListRouterNetworkInterfacesResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRouterNetworkInterfacesRequest,
  ) => stream.Stream<
    ListRouterNetworkInterfacesResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRouterNetworkInterfacesRequest,
  ) => stream.Stream<
    ListedRouterNetworkInterface,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRouterNetworkInterfacesRequest,
  output: ListRouterNetworkInterfacesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RouterNetworkInterfaces",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of router outputs in AWS Elemental MediaConnect.
 */
export const listRouterOutputs: {
  (
    input: ListRouterOutputsRequest,
  ): effect.Effect<
    ListRouterOutputsResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRouterOutputsRequest,
  ) => stream.Stream<
    ListRouterOutputsResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRouterOutputsRequest,
  ) => stream.Stream<
    ListedRouterOutput,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRouterOutputsRequest,
  output: ListRouterOutputsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RouterOutputs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes a flow. Before you can delete a flow, you must stop the flow.
 */
export const deleteFlow: (
  input: DeleteFlowRequest,
) => effect.Effect<
  DeleteFlowResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFlowRequest,
  output: DeleteFlowResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds VPC interfaces to a flow.
 */
export const addFlowVpcInterfaces: (
  input: AddFlowVpcInterfacesRequest,
) => effect.Effect<
  AddFlowVpcInterfacesResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddFlowVpcInterfacesRequest,
  output: AddFlowVpcInterfacesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Describes the thumbnail for the flow source.
 */
export const describeFlowSourceThumbnail: (
  input: DescribeFlowSourceThumbnailRequest,
) => effect.Effect<
  DescribeFlowSourceThumbnailResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFlowSourceThumbnailRequest,
  output: DescribeFlowSourceThumbnailResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an entitlement. You can change an entitlement's description, subscribers, and encryption. If you change the subscribers, the service will remove the outputs that are are used by the subscribers that are removed.
 */
export const updateFlowEntitlement: (
  input: UpdateFlowEntitlementRequest,
) => effect.Effect<
  UpdateFlowEntitlementResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlowEntitlementRequest,
  output: UpdateFlowEntitlementResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays the details of an instance.
 */
export const describeGatewayInstance: (
  input: DescribeGatewayInstanceRequest,
) => effect.Effect<
  DescribeGatewayInstanceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGatewayInstanceRequest,
  output: DescribeGatewayInstanceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays the details of a gateway. The response includes the gateway Amazon Resource Name (ARN), name, and CIDR blocks, as well as details about the networks.
 */
export const describeGateway: (
  input: DescribeGatewayRequest,
) => effect.Effect<
  DescribeGatewayResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGatewayRequest,
  output: DescribeGatewayResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Submits a request to purchase an offering. If you already have an active reservation, you can't purchase another offering.
 */
export const purchaseOffering: (
  input: PurchaseOfferingRequest,
) => effect.Effect<
  PurchaseOfferingResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseOfferingRequest,
  output: PurchaseOfferingResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the thumbnail for a router input in AWS Elemental MediaConnect.
 */
export const getRouterInputThumbnail: (
  input: GetRouterInputThumbnailRequest,
) => effect.Effect<
  GetRouterInputThumbnailResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouterInputThumbnailRequest,
  output: GetRouterInputThumbnailResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about a specific router network interface in AWS Elemental MediaConnect.
 */
export const getRouterNetworkInterface: (
  input: GetRouterNetworkInterfaceRequest,
) => effect.Effect<
  GetRouterNetworkInterfaceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouterNetworkInterfaceRequest,
  output: GetRouterNetworkInterfaceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays the details of a reservation. The response includes the reservation name, state, start date and time, and the details of the offering that make up the rest of the reservation (such as price, duration, and outbound bandwidth).
 */
export const describeReservation: (
  input: DescribeReservationRequest,
) => effect.Effect<
  DescribeReservationResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReservationRequest,
  output: DescribeReservationResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes an output from a bridge.
 */
export const removeBridgeOutput: (
  input: RemoveBridgeOutputRequest,
) => effect.Effect<
  RemoveBridgeOutputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveBridgeOutputRequest,
  output: RemoveBridgeOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes a source from a bridge.
 */
export const removeBridgeSource: (
  input: RemoveBridgeSourceRequest,
) => effect.Effect<
  RemoveBridgeSourceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveBridgeSourceRequest,
  output: RemoveBridgeSourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the bridge state.
 */
export const updateBridgeState: (
  input: UpdateBridgeStateRequest,
) => effect.Effect<
  UpdateBridgeStateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBridgeStateRequest,
  output: UpdateBridgeStateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing gateway instance.
 */
export const updateGatewayInstance: (
  input: UpdateGatewayInstanceRequest,
) => effect.Effect<
  UpdateGatewayInstanceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayInstanceRequest,
  output: UpdateGatewayInstanceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deregisters an instance. Before you deregister an instance, all bridges running on the instance must be stopped. If you want to deregister an instance without stopping the bridges, you must use the --force option.
 */
export const deregisterGatewayInstance: (
  input: DeregisterGatewayInstanceRequest,
) => effect.Effect<
  DeregisterGatewayInstanceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterGatewayInstanceRequest,
  output: DeregisterGatewayInstanceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a gateway. Before you can delete a gateway, you must deregister its instances and delete its bridges.
 */
export const deleteGateway: (
  input: DeleteGatewayRequest,
) => effect.Effect<
  DeleteGatewayResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayRequest,
  output: DeleteGatewayResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the configuration of an existing router input in AWS Elemental MediaConnect.
 */
export const updateRouterInput: (
  input: UpdateRouterInputRequest,
) => effect.Effect<
  UpdateRouterInputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRouterInputRequest,
  output: UpdateRouterInputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a router input from AWS Elemental MediaConnect.
 */
export const deleteRouterInput: (
  input: DeleteRouterInputRequest,
) => effect.Effect<
  DeleteRouterInputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouterInputRequest,
  output: DeleteRouterInputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Restarts a router input. This operation can be used to recover from errors or refresh the input state.
 */
export const restartRouterInput: (
  input: RestartRouterInputRequest,
) => effect.Effect<
  RestartRouterInputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestartRouterInputRequest,
  output: RestartRouterInputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops a router input in AWS Elemental MediaConnect.
 */
export const stopRouterInput: (
  input: StopRouterInputRequest,
) => effect.Effect<
  StopRouterInputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRouterInputRequest,
  output: StopRouterInputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a router network interface from AWS Elemental MediaConnect.
 */
export const deleteRouterNetworkInterface: (
  input: DeleteRouterNetworkInterfaceRequest,
) => effect.Effect<
  DeleteRouterNetworkInterfaceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouterNetworkInterfaceRequest,
  output: DeleteRouterNetworkInterfaceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the configuration of an existing router output in AWS Elemental MediaConnect.
 */
export const updateRouterOutput: (
  input: UpdateRouterOutputRequest,
) => effect.Effect<
  UpdateRouterOutputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRouterOutputRequest,
  output: UpdateRouterOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a router output from AWS Elemental MediaConnect.
 */
export const deleteRouterOutput: (
  input: DeleteRouterOutputRequest,
) => effect.Effect<
  DeleteRouterOutputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouterOutputRequest,
  output: DeleteRouterOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Restarts a router output. This operation can be used to recover from errors or refresh the output state.
 */
export const restartRouterOutput: (
  input: RestartRouterOutputRequest,
) => effect.Effect<
  RestartRouterOutputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestartRouterOutputRequest,
  output: RestartRouterOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts a router output in AWS Elemental MediaConnect.
 */
export const startRouterOutput: (
  input: StartRouterOutputRequest,
) => effect.Effect<
  StartRouterOutputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRouterOutputRequest,
  output: StartRouterOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops a router output in AWS Elemental MediaConnect.
 */
export const stopRouterOutput: (
  input: StopRouterOutputRequest,
) => effect.Effect<
  StopRouterOutputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRouterOutputRequest,
  output: StopRouterOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Associates a router input with a router output in AWS Elemental MediaConnect.
 */
export const takeRouterInput: (
  input: TakeRouterInputRequest,
) => effect.Effect<
  TakeRouterInputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TakeRouterInputRequest,
  output: TakeRouterInputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the bridge.
 */
export const updateBridge: (
  input: UpdateBridgeRequest,
) => effect.Effect<
  UpdateBridgeResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBridgeRequest,
  output: UpdateBridgeResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes a media stream from a flow. This action is only available if the media stream is not associated with a source or output.
 */
export const removeFlowMediaStream: (
  input: RemoveFlowMediaStreamRequest,
) => effect.Effect<
  RemoveFlowMediaStreamResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveFlowMediaStreamRequest,
  output: RemoveFlowMediaStreamResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes an output from an existing flow. This request can be made only on an output that does not have an entitlement associated with it. If the output has an entitlement, you must revoke the entitlement instead. When an entitlement is revoked from a flow, the service automatically removes the associated output.
 */
export const removeFlowOutput: (
  input: RemoveFlowOutputRequest,
) => effect.Effect<
  RemoveFlowOutputResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveFlowOutputRequest,
  output: RemoveFlowOutputResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes a source from an existing flow. This request can be made only if there is more than one source on the flow.
 */
export const removeFlowSource: (
  input: RemoveFlowSourceRequest,
) => effect.Effect<
  RemoveFlowSourceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveFlowSourceRequest,
  output: RemoveFlowSourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes a VPC Interface from an existing flow. This request can be made only on a VPC interface that does not have a Source or Output associated with it. If the VPC interface is referenced by a Source or Output, you must first delete or update the Source or Output to no longer reference the VPC interface.
 */
export const removeFlowVpcInterface: (
  input: RemoveFlowVpcInterfaceRequest,
) => effect.Effect<
  RemoveFlowVpcInterfaceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveFlowVpcInterfaceRequest,
  output: RemoveFlowVpcInterfaceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Revokes an entitlement from a flow. Once an entitlement is revoked, the content becomes unavailable to the subscriber and the associated output is removed.
 */
export const revokeFlowEntitlement: (
  input: RevokeFlowEntitlementRequest,
) => effect.Effect<
  RevokeFlowEntitlementResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeFlowEntitlementRequest,
  output: RevokeFlowEntitlementResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts a flow.
 */
export const startFlow: (
  input: StartFlowRequest,
) => effect.Effect<
  StartFlowResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFlowRequest,
  output: StartFlowResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops a flow.
 */
export const stopFlow: (
  input: StopFlowRequest,
) => effect.Effect<
  StopFlowResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopFlowRequest,
  output: StopFlowResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a bridge. Before you can delete a bridge, you must stop the bridge.
 */
export const deleteBridge: (
  input: DeleteBridgeRequest,
) => effect.Effect<
  DeleteBridgeResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBridgeRequest,
  output: DeleteBridgeResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing bridge output.
 */
export const updateBridgeOutput: (
  input: UpdateBridgeOutputRequest,
) => effect.Effect<
  UpdateBridgeOutputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBridgeOutputRequest,
  output: UpdateBridgeOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing flow.
 */
export const updateFlow: (
  input: UpdateFlowRequest,
) => effect.Effect<
  UpdateFlowResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlowRequest,
  output: UpdateFlowResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays a list of flows that are associated with this account. This request returns a paginated result.
 */
export const listFlows: {
  (
    input: ListFlowsRequest,
  ): effect.Effect<
    ListFlowsResponse,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowsRequest,
  ) => stream.Stream<
    ListFlowsResponse,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowsRequest,
  ) => stream.Stream<
    ListedFlow,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFlowsRequest,
  output: ListFlowsResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Flows",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Displays a list of instances associated with the Amazon Web Services account. This request returns a paginated result. You can use the filterArn property to display only the instances associated with the selected Gateway Amazon Resource Name (ARN).
 */
export const listGatewayInstances: {
  (
    input: ListGatewayInstancesRequest,
  ): effect.Effect<
    ListGatewayInstancesResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGatewayInstancesRequest,
  ) => stream.Stream<
    ListGatewayInstancesResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGatewayInstancesRequest,
  ) => stream.Stream<
    ListedGatewayInstance,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGatewayInstancesRequest,
  output: ListGatewayInstancesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Instances",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Displays a list of gateways that are associated with this account. This request returns a paginated result.
 */
export const listGateways: {
  (
    input: ListGatewaysRequest,
  ): effect.Effect<
    ListGatewaysResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGatewaysRequest,
  ) => stream.Stream<
    ListGatewaysResponse,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGatewaysRequest,
  ) => stream.Stream<
    ListedGateway,
    | BadRequestException
    | ConflictException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGatewaysRequest,
  output: ListGatewaysResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Gateways",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves information about multiple router inputs in AWS Elemental MediaConnect.
 */
export const batchGetRouterInput: (
  input: BatchGetRouterInputRequest,
) => effect.Effect<
  BatchGetRouterInputResponse,
  | BadRequestException
  | ConflictException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetRouterInputRequest,
  output: BatchGetRouterInputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about multiple router network interfaces in AWS Elemental MediaConnect.
 */
export const batchGetRouterNetworkInterface: (
  input: BatchGetRouterNetworkInterfaceRequest,
) => effect.Effect<
  BatchGetRouterNetworkInterfaceResponse,
  | BadRequestException
  | ConflictException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetRouterNetworkInterfaceRequest,
  output: BatchGetRouterNetworkInterfaceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about multiple router outputs in AWS Elemental MediaConnect.
 */
export const batchGetRouterOutput: (
  input: BatchGetRouterOutputRequest,
) => effect.Effect<
  BatchGetRouterOutputResponse,
  | BadRequestException
  | ConflictException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetRouterOutputRequest,
  output: BatchGetRouterOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays a list of all offerings that are available to this account in the current Amazon Web Services Region. If you have an active reservation (which means you've purchased an offering that has already started and hasn't expired yet), your account isn't eligible for other offerings.
 */
export const listOfferings: {
  (
    input: ListOfferingsRequest,
  ): effect.Effect<
    ListOfferingsResponse,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOfferingsRequest,
  ) => stream.Stream<
    ListOfferingsResponse,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOfferingsRequest,
  ) => stream.Stream<
    Offering,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOfferingsRequest,
  output: ListOfferingsResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Offerings",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Displays a list of all reservations that have been purchased by this account in the current Amazon Web Services Region. This list includes all reservations in all states (such as active and expired).
 */
export const listReservations: {
  (
    input: ListReservationsRequest,
  ): effect.Effect<
    ListReservationsResponse,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReservationsRequest,
  ) => stream.Stream<
    ListReservationsResponse,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReservationsRequest,
  ) => stream.Stream<
    Reservation,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReservationsRequest,
  output: ListReservationsResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Reservations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Displays a list of all entitlements that have been granted to this account. This request returns 20 results per page.
 */
export const listEntitlements: {
  (
    input: ListEntitlementsRequest,
  ): effect.Effect<
    ListEntitlementsResponse,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEntitlementsRequest,
  ) => stream.Stream<
    ListEntitlementsResponse,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEntitlementsRequest,
  ) => stream.Stream<
    ListedEntitlement,
    | BadRequestException
    | InternalServerErrorException
    | ServiceUnavailableException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEntitlementsRequest,
  output: ListEntitlementsResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Entitlements",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the configuration of an existing router network interface in AWS Elemental MediaConnect.
 */
export const updateRouterNetworkInterface: (
  input: UpdateRouterNetworkInterfaceRequest,
) => effect.Effect<
  UpdateRouterNetworkInterfaceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRouterNetworkInterfaceRequest,
  output: UpdateRouterNetworkInterfaceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays the details of a bridge.
 */
export const describeBridge: (
  input: DescribeBridgeRequest,
) => effect.Effect<
  DescribeBridgeResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBridgeRequest,
  output: DescribeBridgeResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new bridge. The request must include one source.
 */
export const createBridge: (
  input: CreateBridgeRequest,
) => effect.Effect<
  CreateBridgeResponse,
  | BadRequestException
  | ConflictException
  | CreateBridge420Exception
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBridgeRequest,
  output: CreateBridgeResponse,
  errors: [
    BadRequestException,
    ConflictException,
    CreateBridge420Exception,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new flow. The request must include one source. The request optionally can include outputs (up to 50) and entitlements (up to 50).
 */
export const createFlow: (
  input: CreateFlowRequest,
) => effect.Effect<
  CreateFlowResponse,
  | BadRequestException
  | CreateFlow420Exception
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFlowRequest,
  output: CreateFlowResponse,
  errors: [
    BadRequestException,
    CreateFlow420Exception,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * The `DescribeFlowSourceMetadata` API is used to view information about the flow's source transport stream and programs. This API displays status messages about the flow's source as well as details about the program's video, audio, and other data.
 */
export const describeFlowSourceMetadata: (
  input: DescribeFlowSourceMetadataRequest,
) => effect.Effect<
  DescribeFlowSourceMetadataResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFlowSourceMetadataRequest,
  output: DescribeFlowSourceMetadataResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about a specific router input in AWS Elemental MediaConnect.
 */
export const getRouterInput: (
  input: GetRouterInputRequest,
) => effect.Effect<
  GetRouterInputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouterInputRequest,
  output: GetRouterInputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new router network interface in AWS Elemental MediaConnect.
 */
export const createRouterNetworkInterface: (
  input: CreateRouterNetworkInterfaceRequest,
) => effect.Effect<
  CreateRouterNetworkInterfaceResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | RouterNetworkInterfaceServiceQuotaExceededException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRouterNetworkInterfaceRequest,
  output: CreateRouterNetworkInterfaceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    RouterNetworkInterfaceServiceQuotaExceededException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds outputs to an existing flow. You can create up to 50 outputs per flow.
 */
export const addFlowOutputs: (
  input: AddFlowOutputsRequest,
) => effect.Effect<
  AddFlowOutputsResponse,
  | AddFlowOutputs420Exception
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddFlowOutputsRequest,
  output: AddFlowOutputsResponse,
  errors: [
    AddFlowOutputs420Exception,
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new router input in AWS Elemental MediaConnect.
 */
export const createRouterInput: (
  input: CreateRouterInputRequest,
) => effect.Effect<
  CreateRouterInputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | RouterInputServiceQuotaExceededException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRouterInputRequest,
  output: CreateRouterInputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    RouterInputServiceQuotaExceededException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new router output in AWS Elemental MediaConnect.
 */
export const createRouterOutput: (
  input: CreateRouterOutputRequest,
) => effect.Effect<
  CreateRouterOutputResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | RouterOutputServiceQuotaExceededException
  | ServiceUnavailableException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRouterOutputRequest,
  output: CreateRouterOutputResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    RouterOutputServiceQuotaExceededException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
