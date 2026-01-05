import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "MediaConnect",
  serviceShapeName: "MediaConnect",
});
const auth = T.AwsAuthSigv4({ name: "mediaconnect" });
const ver = T.ServiceVersion("2018-11-14");
const proto = T.AwsProtocolsRestJson1();
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
                        url: "https://mediaconnect-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mediaconnect-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mediaconnect.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://mediaconnect.{Region}.{PartitionResult#dnsSuffix}",
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
export const __listOfString = S.Array(S.String);
export class Encryption extends S.Class<Encryption>("Encryption")({
  Algorithm: S.optional(S.String).pipe(T.JsonName("algorithm")),
  ConstantInitializationVector: S.optional(S.String).pipe(
    T.JsonName("constantInitializationVector"),
  ),
  DeviceId: S.optional(S.String).pipe(T.JsonName("deviceId")),
  KeyType: S.optional(S.String).pipe(T.JsonName("keyType")),
  Region: S.optional(S.String).pipe(T.JsonName("region")),
  ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
  RoleArn: S.String.pipe(T.JsonName("roleArn")),
  SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
}) {}
export class InterfaceRequest extends S.Class<InterfaceRequest>(
  "InterfaceRequest",
)({ Name: S.String.pipe(T.JsonName("name")) }) {}
export class InputConfigurationRequest extends S.Class<InputConfigurationRequest>(
  "InputConfigurationRequest",
)({
  InputPort: S.Number.pipe(T.JsonName("inputPort")),
  Interface: InterfaceRequest.pipe(T.JsonName("interface")),
}) {}
export const __listOfInputConfigurationRequest = S.Array(
  InputConfigurationRequest,
);
export class MediaStreamSourceConfigurationRequest extends S.Class<MediaStreamSourceConfigurationRequest>(
  "MediaStreamSourceConfigurationRequest",
)({
  EncodingName: S.String.pipe(T.JsonName("encodingName")),
  InputConfigurations: S.optional(__listOfInputConfigurationRequest).pipe(
    T.JsonName("inputConfigurations"),
  ),
  MediaStreamName: S.String.pipe(T.JsonName("mediaStreamName")),
}) {}
export const __listOfMediaStreamSourceConfigurationRequest = S.Array(
  MediaStreamSourceConfigurationRequest,
);
export class VpcInterfaceAttachment extends S.Class<VpcInterfaceAttachment>(
  "VpcInterfaceAttachment",
)({
  VpcInterfaceName: S.optional(S.String).pipe(T.JsonName("vpcInterfaceName")),
}) {}
export class SetGatewayBridgeSourceRequest extends S.Class<SetGatewayBridgeSourceRequest>(
  "SetGatewayBridgeSourceRequest",
)({
  BridgeArn: S.String.pipe(T.JsonName("bridgeArn")),
  VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment).pipe(
    T.JsonName("vpcInterfaceAttachment"),
  ),
}) {}
export const __mapOfString = S.Record({ key: S.String, value: S.String });
export class SecretsManagerEncryptionKeyConfiguration extends S.Class<SecretsManagerEncryptionKeyConfiguration>(
  "SecretsManagerEncryptionKeyConfiguration",
)({
  SecretArn: S.String.pipe(T.JsonName("secretArn")),
  RoleArn: S.String.pipe(T.JsonName("roleArn")),
}) {}
export class AutomaticEncryptionKeyConfiguration extends S.Class<AutomaticEncryptionKeyConfiguration>(
  "AutomaticEncryptionKeyConfiguration",
)({}) {}
export const FlowTransitEncryptionKeyConfiguration = S.Union(
  S.Struct({
    SecretsManager: SecretsManagerEncryptionKeyConfiguration.pipe(
      T.JsonName("secretsManager"),
    ),
  }),
  S.Struct({
    Automatic: AutomaticEncryptionKeyConfiguration.pipe(
      T.JsonName("automatic"),
    ),
  }),
);
export class FlowTransitEncryption extends S.Class<FlowTransitEncryption>(
  "FlowTransitEncryption",
)({
  EncryptionKeyType: S.optional(S.String).pipe(T.JsonName("encryptionKeyType")),
  EncryptionKeyConfiguration: FlowTransitEncryptionKeyConfiguration.pipe(
    T.JsonName("encryptionKeyConfiguration"),
  ),
}) {}
export class SetSourceRequest extends S.Class<SetSourceRequest>(
  "SetSourceRequest",
)({
  Decryption: S.optional(Encryption).pipe(T.JsonName("decryption")),
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
  Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
  SenderControlPort: S.optional(S.Number).pipe(T.JsonName("senderControlPort")),
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
  GatewayBridgeSource: S.optional(SetGatewayBridgeSourceRequest).pipe(
    T.JsonName("gatewayBridgeSource"),
  ),
  SourceTags: S.optional(__mapOfString).pipe(T.JsonName("sourceTags")),
  RouterIntegrationState: S.optional(S.String).pipe(
    T.JsonName("routerIntegrationState"),
  ),
  RouterIntegrationTransitDecryption: S.optional(FlowTransitEncryption).pipe(
    T.JsonName("routerIntegrationTransitDecryption"),
  ),
}) {}
export const __listOfSetSourceRequest = S.Array(SetSourceRequest);
export const RouterInputArnList = S.Array(S.String);
export const RouterNetworkInterfaceArnList = S.Array(S.String);
export const RouterOutputArnList = S.Array(S.String);
export class ListEntitlementsRequest extends S.Class<ListEntitlementsRequest>(
  "ListEntitlementsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/entitlements" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForGlobalResourceRequest extends S.Class<ListTagsForGlobalResourceRequest>(
  "ListTagsForGlobalResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/global/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: __mapOfString.pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagGlobalResourceRequest extends S.Class<UntagGlobalResourceRequest>(
  "UntagGlobalResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOfString.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/global/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagGlobalResourceResponse extends S.Class<UntagGlobalResourceResponse>(
  "UntagGlobalResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOfString.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class DescribeBridgeRequest extends S.Class<DescribeBridgeRequest>(
  "DescribeBridgeRequest",
)(
  { BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/bridges/{BridgeArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBridgeRequest extends S.Class<DeleteBridgeRequest>(
  "DeleteBridgeRequest",
)(
  { BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/bridges/{BridgeArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBridgesRequest extends S.Class<ListBridgesRequest>(
  "ListBridgesRequest",
)(
  {
    FilterArn: S.optional(S.String).pipe(T.HttpQuery("filterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/bridges" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddBridgeNetworkOutputRequest extends S.Class<AddBridgeNetworkOutputRequest>(
  "AddBridgeNetworkOutputRequest",
)({
  IpAddress: S.String.pipe(T.JsonName("ipAddress")),
  Name: S.String.pipe(T.JsonName("name")),
  NetworkName: S.String.pipe(T.JsonName("networkName")),
  Port: S.Number.pipe(T.JsonName("port")),
  Protocol: S.String.pipe(T.JsonName("protocol")),
  Ttl: S.Number.pipe(T.JsonName("ttl")),
}) {}
export class AddBridgeOutputRequest extends S.Class<AddBridgeOutputRequest>(
  "AddBridgeOutputRequest",
)({
  NetworkOutput: S.optional(AddBridgeNetworkOutputRequest).pipe(
    T.JsonName("networkOutput"),
  ),
}) {}
export const __listOfAddBridgeOutputRequest = S.Array(AddBridgeOutputRequest);
export class AddBridgeOutputsRequest extends S.Class<AddBridgeOutputsRequest>(
  "AddBridgeOutputsRequest",
)(
  {
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    Outputs: __listOfAddBridgeOutputRequest.pipe(T.JsonName("outputs")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/bridges/{BridgeArn}/outputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddBridgeFlowSourceRequest extends S.Class<AddBridgeFlowSourceRequest>(
  "AddBridgeFlowSourceRequest",
)({
  FlowArn: S.String.pipe(T.JsonName("flowArn")),
  FlowVpcInterfaceAttachment: S.optional(VpcInterfaceAttachment).pipe(
    T.JsonName("flowVpcInterfaceAttachment"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
}) {}
export class MulticastSourceSettings extends S.Class<MulticastSourceSettings>(
  "MulticastSourceSettings",
)({
  MulticastSourceIp: S.optional(S.String).pipe(T.JsonName("multicastSourceIp")),
}) {}
export class AddBridgeNetworkSourceRequest extends S.Class<AddBridgeNetworkSourceRequest>(
  "AddBridgeNetworkSourceRequest",
)({
  MulticastIp: S.String.pipe(T.JsonName("multicastIp")),
  MulticastSourceSettings: S.optional(MulticastSourceSettings).pipe(
    T.JsonName("multicastSourceSettings"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  NetworkName: S.String.pipe(T.JsonName("networkName")),
  Port: S.Number.pipe(T.JsonName("port")),
  Protocol: S.String.pipe(T.JsonName("protocol")),
}) {}
export class AddBridgeSourceRequest extends S.Class<AddBridgeSourceRequest>(
  "AddBridgeSourceRequest",
)({
  FlowSource: S.optional(AddBridgeFlowSourceRequest).pipe(
    T.JsonName("flowSource"),
  ),
  NetworkSource: S.optional(AddBridgeNetworkSourceRequest).pipe(
    T.JsonName("networkSource"),
  ),
}) {}
export const __listOfAddBridgeSourceRequest = S.Array(AddBridgeSourceRequest);
export class AddBridgeSourcesRequest extends S.Class<AddBridgeSourcesRequest>(
  "AddBridgeSourcesRequest",
)(
  {
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    Sources: __listOfAddBridgeSourceRequest.pipe(T.JsonName("sources")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/bridges/{BridgeArn}/sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveBridgeOutputRequest extends S.Class<RemoveBridgeOutputRequest>(
  "RemoveBridgeOutputRequest",
)(
  {
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    OutputName: S.String.pipe(T.HttpLabel("OutputName")),
  },
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
) {}
export class RemoveBridgeSourceRequest extends S.Class<RemoveBridgeSourceRequest>(
  "RemoveBridgeSourceRequest",
)(
  {
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    SourceName: S.String.pipe(T.HttpLabel("SourceName")),
  },
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
) {}
export class UpdateBridgeStateRequest extends S.Class<UpdateBridgeStateRequest>(
  "UpdateBridgeStateRequest",
)(
  {
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    DesiredState: S.String.pipe(T.JsonName("desiredState")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/bridges/{BridgeArn}/state" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFlowRequest extends S.Class<DescribeFlowRequest>(
  "DescribeFlowRequest",
)(
  { FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/flows/{FlowArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFlowRequest extends S.Class<DeleteFlowRequest>(
  "DeleteFlowRequest",
)(
  { FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/flows/{FlowArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFlowsRequest extends S.Class<ListFlowsRequest>(
  "ListFlowsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/flows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FmtpRequest extends S.Class<FmtpRequest>("FmtpRequest")({
  ChannelOrder: S.optional(S.String).pipe(T.JsonName("channelOrder")),
  Colorimetry: S.optional(S.String).pipe(T.JsonName("colorimetry")),
  ExactFramerate: S.optional(S.String).pipe(T.JsonName("exactFramerate")),
  Par: S.optional(S.String).pipe(T.JsonName("par")),
  Range: S.optional(S.String).pipe(T.JsonName("range")),
  ScanMode: S.optional(S.String).pipe(T.JsonName("scanMode")),
  Tcs: S.optional(S.String).pipe(T.JsonName("tcs")),
}) {}
export class MediaStreamAttributesRequest extends S.Class<MediaStreamAttributesRequest>(
  "MediaStreamAttributesRequest",
)({
  Fmtp: S.optional(FmtpRequest).pipe(T.JsonName("fmtp")),
  Lang: S.optional(S.String).pipe(T.JsonName("lang")),
}) {}
export class AddMediaStreamRequest extends S.Class<AddMediaStreamRequest>(
  "AddMediaStreamRequest",
)({
  Attributes: S.optional(MediaStreamAttributesRequest).pipe(
    T.JsonName("attributes"),
  ),
  ClockRate: S.optional(S.Number).pipe(T.JsonName("clockRate")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  MediaStreamId: S.Number.pipe(T.JsonName("mediaStreamId")),
  MediaStreamName: S.String.pipe(T.JsonName("mediaStreamName")),
  MediaStreamType: S.String.pipe(T.JsonName("mediaStreamType")),
  VideoFormat: S.optional(S.String).pipe(T.JsonName("videoFormat")),
  MediaStreamTags: S.optional(__mapOfString).pipe(
    T.JsonName("mediaStreamTags"),
  ),
}) {}
export const __listOfAddMediaStreamRequest = S.Array(AddMediaStreamRequest);
export class AddFlowMediaStreamsRequest extends S.Class<AddFlowMediaStreamsRequest>(
  "AddFlowMediaStreamsRequest",
)(
  {
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    MediaStreams: __listOfAddMediaStreamRequest.pipe(
      T.JsonName("mediaStreams"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/mediaStreams" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DestinationConfigurationRequest extends S.Class<DestinationConfigurationRequest>(
  "DestinationConfigurationRequest",
)({
  DestinationIp: S.String.pipe(T.JsonName("destinationIp")),
  DestinationPort: S.Number.pipe(T.JsonName("destinationPort")),
  Interface: InterfaceRequest.pipe(T.JsonName("interface")),
}) {}
export const __listOfDestinationConfigurationRequest = S.Array(
  DestinationConfigurationRequest,
);
export class EncodingParametersRequest extends S.Class<EncodingParametersRequest>(
  "EncodingParametersRequest",
)({
  CompressionFactor: S.Number.pipe(T.JsonName("compressionFactor")),
  EncoderProfile: S.String.pipe(T.JsonName("encoderProfile")),
}) {}
export class MediaStreamOutputConfigurationRequest extends S.Class<MediaStreamOutputConfigurationRequest>(
  "MediaStreamOutputConfigurationRequest",
)({
  DestinationConfigurations: S.optional(
    __listOfDestinationConfigurationRequest,
  ).pipe(T.JsonName("destinationConfigurations")),
  EncodingName: S.String.pipe(T.JsonName("encodingName")),
  EncodingParameters: S.optional(EncodingParametersRequest).pipe(
    T.JsonName("encodingParameters"),
  ),
  MediaStreamName: S.String.pipe(T.JsonName("mediaStreamName")),
}) {}
export const __listOfMediaStreamOutputConfigurationRequest = S.Array(
  MediaStreamOutputConfigurationRequest,
);
export class AddOutputRequest extends S.Class<AddOutputRequest>(
  "AddOutputRequest",
)({
  CidrAllowList: S.optional(__listOfString).pipe(T.JsonName("cidrAllowList")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Destination: S.optional(S.String).pipe(T.JsonName("destination")),
  Encryption: S.optional(Encryption).pipe(T.JsonName("encryption")),
  MaxLatency: S.optional(S.Number).pipe(T.JsonName("maxLatency")),
  MediaStreamOutputConfigurations: S.optional(
    __listOfMediaStreamOutputConfigurationRequest,
  ).pipe(T.JsonName("mediaStreamOutputConfigurations")),
  MinLatency: S.optional(S.Number).pipe(T.JsonName("minLatency")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Port: S.optional(S.Number).pipe(T.JsonName("port")),
  Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
  RemoteId: S.optional(S.String).pipe(T.JsonName("remoteId")),
  SenderControlPort: S.optional(S.Number).pipe(T.JsonName("senderControlPort")),
  SmoothingLatency: S.optional(S.Number).pipe(T.JsonName("smoothingLatency")),
  StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
  VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment).pipe(
    T.JsonName("vpcInterfaceAttachment"),
  ),
  OutputStatus: S.optional(S.String).pipe(T.JsonName("outputStatus")),
  NdiSpeedHqQuality: S.optional(S.Number).pipe(T.JsonName("ndiSpeedHqQuality")),
  NdiProgramName: S.optional(S.String).pipe(T.JsonName("ndiProgramName")),
  OutputTags: S.optional(__mapOfString).pipe(T.JsonName("outputTags")),
  RouterIntegrationState: S.optional(S.String).pipe(
    T.JsonName("routerIntegrationState"),
  ),
  RouterIntegrationTransitEncryption: S.optional(FlowTransitEncryption).pipe(
    T.JsonName("routerIntegrationTransitEncryption"),
  ),
}) {}
export const __listOfAddOutputRequest = S.Array(AddOutputRequest);
export class AddFlowOutputsRequest extends S.Class<AddFlowOutputsRequest>(
  "AddFlowOutputsRequest",
)(
  {
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    Outputs: __listOfAddOutputRequest.pipe(T.JsonName("outputs")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/outputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddFlowSourcesRequest extends S.Class<AddFlowSourcesRequest>(
  "AddFlowSourcesRequest",
)(
  {
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    Sources: __listOfSetSourceRequest.pipe(T.JsonName("sources")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/source" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VpcInterfaceRequest extends S.Class<VpcInterfaceRequest>(
  "VpcInterfaceRequest",
)({
  Name: S.String.pipe(T.JsonName("name")),
  NetworkInterfaceType: S.optional(S.String).pipe(
    T.JsonName("networkInterfaceType"),
  ),
  RoleArn: S.String.pipe(T.JsonName("roleArn")),
  SecurityGroupIds: __listOfString.pipe(T.JsonName("securityGroupIds")),
  SubnetId: S.String.pipe(T.JsonName("subnetId")),
  VpcInterfaceTags: S.optional(__mapOfString).pipe(
    T.JsonName("vpcInterfaceTags"),
  ),
}) {}
export const __listOfVpcInterfaceRequest = S.Array(VpcInterfaceRequest);
export class AddFlowVpcInterfacesRequest extends S.Class<AddFlowVpcInterfacesRequest>(
  "AddFlowVpcInterfacesRequest",
)(
  {
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    VpcInterfaces: __listOfVpcInterfaceRequest.pipe(
      T.JsonName("vpcInterfaces"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/vpcInterfaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFlowSourceMetadataRequest extends S.Class<DescribeFlowSourceMetadataRequest>(
  "DescribeFlowSourceMetadataRequest",
)(
  { FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/flows/{FlowArn}/source-metadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFlowSourceThumbnailRequest extends S.Class<DescribeFlowSourceThumbnailRequest>(
  "DescribeFlowSourceThumbnailRequest",
)(
  { FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/flows/{FlowArn}/source-thumbnail" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GrantEntitlementRequest extends S.Class<GrantEntitlementRequest>(
  "GrantEntitlementRequest",
)({
  DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
    T.JsonName("dataTransferSubscriberFeePercent"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Encryption: S.optional(Encryption).pipe(T.JsonName("encryption")),
  EntitlementStatus: S.optional(S.String).pipe(T.JsonName("entitlementStatus")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Subscribers: __listOfString.pipe(T.JsonName("subscribers")),
  EntitlementTags: S.optional(__mapOfString).pipe(
    T.JsonName("entitlementTags"),
  ),
}) {}
export const __listOfGrantEntitlementRequest = S.Array(GrantEntitlementRequest);
export class GrantFlowEntitlementsRequest extends S.Class<GrantFlowEntitlementsRequest>(
  "GrantFlowEntitlementsRequest",
)(
  {
    Entitlements: __listOfGrantEntitlementRequest.pipe(
      T.JsonName("entitlements"),
    ),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/flows/{FlowArn}/entitlements" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveFlowMediaStreamRequest extends S.Class<RemoveFlowMediaStreamRequest>(
  "RemoveFlowMediaStreamRequest",
)(
  {
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    MediaStreamName: S.String.pipe(T.HttpLabel("MediaStreamName")),
  },
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
) {}
export class RemoveFlowOutputRequest extends S.Class<RemoveFlowOutputRequest>(
  "RemoveFlowOutputRequest",
)(
  {
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    OutputArn: S.String.pipe(T.HttpLabel("OutputArn")),
  },
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
) {}
export class RemoveFlowSourceRequest extends S.Class<RemoveFlowSourceRequest>(
  "RemoveFlowSourceRequest",
)(
  {
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    SourceArn: S.String.pipe(T.HttpLabel("SourceArn")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/flows/{FlowArn}/source/{SourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveFlowVpcInterfaceRequest extends S.Class<RemoveFlowVpcInterfaceRequest>(
  "RemoveFlowVpcInterfaceRequest",
)(
  {
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    VpcInterfaceName: S.String.pipe(T.HttpLabel("VpcInterfaceName")),
  },
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
) {}
export class RevokeFlowEntitlementRequest extends S.Class<RevokeFlowEntitlementRequest>(
  "RevokeFlowEntitlementRequest",
)(
  {
    EntitlementArn: S.String.pipe(T.HttpLabel("EntitlementArn")),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
  },
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
) {}
export class StartFlowRequest extends S.Class<StartFlowRequest>(
  "StartFlowRequest",
)(
  { FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/flows/start/{FlowArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopFlowRequest extends S.Class<StopFlowRequest>(
  "StopFlowRequest",
)(
  { FlowArn: S.String.pipe(T.HttpLabel("FlowArn")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/flows/stop/{FlowArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGatewayInstanceRequest extends S.Class<DescribeGatewayInstanceRequest>(
  "DescribeGatewayInstanceRequest",
)(
  { GatewayInstanceArn: S.String.pipe(T.HttpLabel("GatewayInstanceArn")) },
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
) {}
export class UpdateGatewayInstanceRequest extends S.Class<UpdateGatewayInstanceRequest>(
  "UpdateGatewayInstanceRequest",
)(
  {
    BridgePlacement: S.optional(S.String).pipe(T.JsonName("bridgePlacement")),
    GatewayInstanceArn: S.String.pipe(T.HttpLabel("GatewayInstanceArn")),
  },
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
) {}
export class DeregisterGatewayInstanceRequest extends S.Class<DeregisterGatewayInstanceRequest>(
  "DeregisterGatewayInstanceRequest",
)(
  {
    Force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    GatewayInstanceArn: S.String.pipe(T.HttpLabel("GatewayInstanceArn")),
  },
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
) {}
export class ListGatewayInstancesRequest extends S.Class<ListGatewayInstancesRequest>(
  "ListGatewayInstancesRequest",
)(
  {
    FilterArn: S.optional(S.String).pipe(T.HttpQuery("filterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/gateway-instances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGatewayRequest extends S.Class<DescribeGatewayRequest>(
  "DescribeGatewayRequest",
)(
  { GatewayArn: S.String.pipe(T.HttpLabel("GatewayArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/gateways/{GatewayArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGatewayRequest extends S.Class<DeleteGatewayRequest>(
  "DeleteGatewayRequest",
)(
  { GatewayArn: S.String.pipe(T.HttpLabel("GatewayArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/gateways/{GatewayArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGatewaysRequest extends S.Class<ListGatewaysRequest>(
  "ListGatewaysRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/gateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeOfferingRequest extends S.Class<DescribeOfferingRequest>(
  "DescribeOfferingRequest",
)(
  { OfferingArn: S.String.pipe(T.HttpLabel("OfferingArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/offerings/{OfferingArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOfferingsRequest extends S.Class<ListOfferingsRequest>(
  "ListOfferingsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/offerings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PurchaseOfferingRequest extends S.Class<PurchaseOfferingRequest>(
  "PurchaseOfferingRequest",
)(
  {
    OfferingArn: S.String.pipe(T.HttpLabel("OfferingArn")),
    ReservationName: S.String.pipe(T.JsonName("reservationName")),
    Start: S.String.pipe(T.JsonName("start")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/offerings/{OfferingArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReservationRequest extends S.Class<DescribeReservationRequest>(
  "DescribeReservationRequest",
)(
  { ReservationArn: S.String.pipe(T.HttpLabel("ReservationArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/reservations/{ReservationArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReservationsRequest extends S.Class<ListReservationsRequest>(
  "ListReservationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/reservations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouterInputRequest extends S.Class<GetRouterInputRequest>(
  "GetRouterInputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/routerInput/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RtpRouterInputConfiguration extends S.Class<RtpRouterInputConfiguration>(
  "RtpRouterInputConfiguration",
)({
  Port: S.Number.pipe(T.JsonName("port")),
  ForwardErrorCorrection: S.optional(S.String).pipe(
    T.JsonName("forwardErrorCorrection"),
  ),
}) {}
export class RistRouterInputConfiguration extends S.Class<RistRouterInputConfiguration>(
  "RistRouterInputConfiguration",
)({
  Port: S.Number.pipe(T.JsonName("port")),
  RecoveryLatencyMilliseconds: S.Number.pipe(
    T.JsonName("recoveryLatencyMilliseconds"),
  ),
}) {}
export class SrtDecryptionConfiguration extends S.Class<SrtDecryptionConfiguration>(
  "SrtDecryptionConfiguration",
)({
  EncryptionKey: SecretsManagerEncryptionKeyConfiguration.pipe(
    T.JsonName("encryptionKey"),
  ),
}) {}
export class SrtListenerRouterInputConfiguration extends S.Class<SrtListenerRouterInputConfiguration>(
  "SrtListenerRouterInputConfiguration",
)({
  Port: S.Number.pipe(T.JsonName("port")),
  MinimumLatencyMilliseconds: S.Number.pipe(
    T.JsonName("minimumLatencyMilliseconds"),
  ),
  DecryptionConfiguration: S.optional(SrtDecryptionConfiguration).pipe(
    T.JsonName("decryptionConfiguration"),
  ),
}) {}
export class SrtCallerRouterInputConfiguration extends S.Class<SrtCallerRouterInputConfiguration>(
  "SrtCallerRouterInputConfiguration",
)({
  SourceAddress: S.String.pipe(T.JsonName("sourceAddress")),
  SourcePort: S.Number.pipe(T.JsonName("sourcePort")),
  MinimumLatencyMilliseconds: S.Number.pipe(
    T.JsonName("minimumLatencyMilliseconds"),
  ),
  StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
  DecryptionConfiguration: S.optional(SrtDecryptionConfiguration).pipe(
    T.JsonName("decryptionConfiguration"),
  ),
}) {}
export const RouterInputProtocolConfiguration = S.Union(
  S.Struct({ Rtp: RtpRouterInputConfiguration.pipe(T.JsonName("rtp")) }),
  S.Struct({ Rist: RistRouterInputConfiguration.pipe(T.JsonName("rist")) }),
  S.Struct({
    SrtListener: SrtListenerRouterInputConfiguration.pipe(
      T.JsonName("srtListener"),
    ),
  }),
  S.Struct({
    SrtCaller: SrtCallerRouterInputConfiguration.pipe(T.JsonName("srtCaller")),
  }),
);
export class StandardRouterInputConfiguration extends S.Class<StandardRouterInputConfiguration>(
  "StandardRouterInputConfiguration",
)({
  NetworkInterfaceArn: S.String.pipe(T.JsonName("networkInterfaceArn")),
  ProtocolConfiguration: RouterInputProtocolConfiguration.pipe(
    T.JsonName("protocolConfiguration"),
  ),
  Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
}) {}
export const FailoverRouterInputProtocolConfiguration = S.Union(
  S.Struct({ Rtp: RtpRouterInputConfiguration.pipe(T.JsonName("rtp")) }),
  S.Struct({ Rist: RistRouterInputConfiguration.pipe(T.JsonName("rist")) }),
  S.Struct({
    SrtListener: SrtListenerRouterInputConfiguration.pipe(
      T.JsonName("srtListener"),
    ),
  }),
  S.Struct({
    SrtCaller: SrtCallerRouterInputConfiguration.pipe(T.JsonName("srtCaller")),
  }),
);
export const FailoverRouterInputProtocolConfigurationList = S.Array(
  FailoverRouterInputProtocolConfiguration,
);
export class FailoverRouterInputConfiguration extends S.Class<FailoverRouterInputConfiguration>(
  "FailoverRouterInputConfiguration",
)({
  NetworkInterfaceArn: S.String.pipe(T.JsonName("networkInterfaceArn")),
  ProtocolConfigurations: FailoverRouterInputProtocolConfigurationList.pipe(
    T.JsonName("protocolConfigurations"),
  ),
  SourcePriorityMode: S.String.pipe(T.JsonName("sourcePriorityMode")),
  PrimarySourceIndex: S.optional(S.Number).pipe(
    T.JsonName("primarySourceIndex"),
  ),
}) {}
export const MergeRouterInputProtocolConfiguration = S.Union(
  S.Struct({ Rtp: RtpRouterInputConfiguration.pipe(T.JsonName("rtp")) }),
  S.Struct({ Rist: RistRouterInputConfiguration.pipe(T.JsonName("rist")) }),
);
export const MergeRouterInputProtocolConfigurationList = S.Array(
  MergeRouterInputProtocolConfiguration,
);
export class MergeRouterInputConfiguration extends S.Class<MergeRouterInputConfiguration>(
  "MergeRouterInputConfiguration",
)({
  NetworkInterfaceArn: S.String.pipe(T.JsonName("networkInterfaceArn")),
  ProtocolConfigurations: MergeRouterInputProtocolConfigurationList.pipe(
    T.JsonName("protocolConfigurations"),
  ),
  MergeRecoveryWindowMilliseconds: S.Number.pipe(
    T.JsonName("mergeRecoveryWindowMilliseconds"),
  ),
}) {}
export class MediaConnectFlowRouterInputConfiguration extends S.Class<MediaConnectFlowRouterInputConfiguration>(
  "MediaConnectFlowRouterInputConfiguration",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  FlowOutputArn: S.optional(S.String).pipe(T.JsonName("flowOutputArn")),
  SourceTransitDecryption: FlowTransitEncryption.pipe(
    T.JsonName("sourceTransitDecryption"),
  ),
}) {}
export const RouterInputConfiguration = S.Union(
  S.Struct({
    Standard: StandardRouterInputConfiguration.pipe(T.JsonName("standard")),
  }),
  S.Struct({
    Failover: FailoverRouterInputConfiguration.pipe(T.JsonName("failover")),
  }),
  S.Struct({ Merge: MergeRouterInputConfiguration.pipe(T.JsonName("merge")) }),
  S.Struct({
    MediaConnectFlow: MediaConnectFlowRouterInputConfiguration.pipe(
      T.JsonName("mediaConnectFlow"),
    ),
  }),
);
export const RouterInputTransitEncryptionKeyConfiguration = S.Union(
  S.Struct({
    SecretsManager: SecretsManagerEncryptionKeyConfiguration.pipe(
      T.JsonName("secretsManager"),
    ),
  }),
  S.Struct({
    Automatic: AutomaticEncryptionKeyConfiguration.pipe(
      T.JsonName("automatic"),
    ),
  }),
);
export class RouterInputTransitEncryption extends S.Class<RouterInputTransitEncryption>(
  "RouterInputTransitEncryption",
)({
  EncryptionKeyType: S.optional(S.String).pipe(T.JsonName("encryptionKeyType")),
  EncryptionKeyConfiguration: RouterInputTransitEncryptionKeyConfiguration.pipe(
    T.JsonName("encryptionKeyConfiguration"),
  ),
}) {}
export class PreferredDayTimeMaintenanceConfiguration extends S.Class<PreferredDayTimeMaintenanceConfiguration>(
  "PreferredDayTimeMaintenanceConfiguration",
)({
  Day: S.String.pipe(T.JsonName("day")),
  Time: S.String.pipe(T.JsonName("time")),
}) {}
export class DefaultMaintenanceConfiguration extends S.Class<DefaultMaintenanceConfiguration>(
  "DefaultMaintenanceConfiguration",
)({}) {}
export const MaintenanceConfiguration = S.Union(
  S.Struct({
    PreferredDayTime: PreferredDayTimeMaintenanceConfiguration.pipe(
      T.JsonName("preferredDayTime"),
    ),
  }),
  S.Struct({
    Default: DefaultMaintenanceConfiguration.pipe(T.JsonName("default")),
  }),
);
export class UpdateRouterInputRequest extends S.Class<UpdateRouterInputRequest>(
  "UpdateRouterInputRequest",
)(
  {
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Configuration: S.optional(RouterInputConfiguration).pipe(
      T.JsonName("configuration"),
    ),
    MaximumBitrate: S.optional(S.Number).pipe(T.JsonName("maximumBitrate")),
    RoutingScope: S.optional(S.String).pipe(T.JsonName("routingScope")),
    Tier: S.optional(S.String).pipe(T.JsonName("tier")),
    TransitEncryption: S.optional(RouterInputTransitEncryption).pipe(
      T.JsonName("transitEncryption"),
    ),
    MaintenanceConfiguration: S.optional(MaintenanceConfiguration).pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/routerInput/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouterInputRequest extends S.Class<DeleteRouterInputRequest>(
  "DeleteRouterInputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/routerInput/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouterInputSourceMetadataRequest extends S.Class<GetRouterInputSourceMetadataRequest>(
  "GetRouterInputSourceMetadataRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/routerInput/{Arn}/source-metadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouterInputThumbnailRequest extends S.Class<GetRouterInputThumbnailRequest>(
  "GetRouterInputThumbnailRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/routerInput/{Arn}/thumbnail" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestartRouterInputRequest extends S.Class<RestartRouterInputRequest>(
  "RestartRouterInputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerInput/restart/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartRouterInputRequest extends S.Class<StartRouterInputRequest>(
  "StartRouterInputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerInput/start/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopRouterInputRequest extends S.Class<StopRouterInputRequest>(
  "StopRouterInputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerInput/stop/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetRouterInputRequest extends S.Class<BatchGetRouterInputRequest>(
  "BatchGetRouterInputRequest",
)(
  { Arns: RouterInputArnList.pipe(T.HttpQuery("arns")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/routerInputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouterNetworkInterfaceRequest extends S.Class<GetRouterNetworkInterfaceRequest>(
  "GetRouterNetworkInterfaceRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/routerNetworkInterface/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublicRouterNetworkInterfaceRule extends S.Class<PublicRouterNetworkInterfaceRule>(
  "PublicRouterNetworkInterfaceRule",
)({ Cidr: S.String.pipe(T.JsonName("cidr")) }) {}
export const NetworkInterfaceRuleList = S.Array(
  PublicRouterNetworkInterfaceRule,
);
export class PublicRouterNetworkInterfaceConfiguration extends S.Class<PublicRouterNetworkInterfaceConfiguration>(
  "PublicRouterNetworkInterfaceConfiguration",
)({ AllowRules: NetworkInterfaceRuleList.pipe(T.JsonName("allowRules")) }) {}
export const SecurityGroupIdList = S.Array(S.String);
export class VpcRouterNetworkInterfaceConfiguration extends S.Class<VpcRouterNetworkInterfaceConfiguration>(
  "VpcRouterNetworkInterfaceConfiguration",
)({
  SecurityGroupIds: SecurityGroupIdList.pipe(T.JsonName("securityGroupIds")),
  SubnetId: S.String.pipe(T.JsonName("subnetId")),
}) {}
export const RouterNetworkInterfaceConfiguration = S.Union(
  S.Struct({
    Public: PublicRouterNetworkInterfaceConfiguration.pipe(
      T.JsonName("public"),
    ),
  }),
  S.Struct({
    Vpc: VpcRouterNetworkInterfaceConfiguration.pipe(T.JsonName("vpc")),
  }),
);
export class UpdateRouterNetworkInterfaceRequest extends S.Class<UpdateRouterNetworkInterfaceRequest>(
  "UpdateRouterNetworkInterfaceRequest",
)(
  {
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Configuration: S.optional(RouterNetworkInterfaceConfiguration).pipe(
      T.JsonName("configuration"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/routerNetworkInterface/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouterNetworkInterfaceRequest extends S.Class<DeleteRouterNetworkInterfaceRequest>(
  "DeleteRouterNetworkInterfaceRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/routerNetworkInterface/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetRouterNetworkInterfaceRequest extends S.Class<BatchGetRouterNetworkInterfaceRequest>(
  "BatchGetRouterNetworkInterfaceRequest",
)(
  { Arns: RouterNetworkInterfaceArnList.pipe(T.HttpQuery("arns")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/routerNetworkInterfaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouterOutputRequest extends S.Class<GetRouterOutputRequest>(
  "GetRouterOutputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/routerOutput/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RtpRouterOutputConfiguration extends S.Class<RtpRouterOutputConfiguration>(
  "RtpRouterOutputConfiguration",
)({
  DestinationAddress: S.String.pipe(T.JsonName("destinationAddress")),
  DestinationPort: S.Number.pipe(T.JsonName("destinationPort")),
  ForwardErrorCorrection: S.optional(S.String).pipe(
    T.JsonName("forwardErrorCorrection"),
  ),
}) {}
export class RistRouterOutputConfiguration extends S.Class<RistRouterOutputConfiguration>(
  "RistRouterOutputConfiguration",
)({
  DestinationAddress: S.String.pipe(T.JsonName("destinationAddress")),
  DestinationPort: S.Number.pipe(T.JsonName("destinationPort")),
}) {}
export class SrtEncryptionConfiguration extends S.Class<SrtEncryptionConfiguration>(
  "SrtEncryptionConfiguration",
)({
  EncryptionKey: SecretsManagerEncryptionKeyConfiguration.pipe(
    T.JsonName("encryptionKey"),
  ),
}) {}
export class SrtListenerRouterOutputConfiguration extends S.Class<SrtListenerRouterOutputConfiguration>(
  "SrtListenerRouterOutputConfiguration",
)({
  Port: S.Number.pipe(T.JsonName("port")),
  MinimumLatencyMilliseconds: S.Number.pipe(
    T.JsonName("minimumLatencyMilliseconds"),
  ),
  EncryptionConfiguration: S.optional(SrtEncryptionConfiguration).pipe(
    T.JsonName("encryptionConfiguration"),
  ),
}) {}
export class SrtCallerRouterOutputConfiguration extends S.Class<SrtCallerRouterOutputConfiguration>(
  "SrtCallerRouterOutputConfiguration",
)({
  DestinationAddress: S.String.pipe(T.JsonName("destinationAddress")),
  DestinationPort: S.Number.pipe(T.JsonName("destinationPort")),
  MinimumLatencyMilliseconds: S.Number.pipe(
    T.JsonName("minimumLatencyMilliseconds"),
  ),
  StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
  EncryptionConfiguration: S.optional(SrtEncryptionConfiguration).pipe(
    T.JsonName("encryptionConfiguration"),
  ),
}) {}
export const RouterOutputProtocolConfiguration = S.Union(
  S.Struct({ Rtp: RtpRouterOutputConfiguration.pipe(T.JsonName("rtp")) }),
  S.Struct({ Rist: RistRouterOutputConfiguration.pipe(T.JsonName("rist")) }),
  S.Struct({
    SrtListener: SrtListenerRouterOutputConfiguration.pipe(
      T.JsonName("srtListener"),
    ),
  }),
  S.Struct({
    SrtCaller: SrtCallerRouterOutputConfiguration.pipe(T.JsonName("srtCaller")),
  }),
);
export class StandardRouterOutputConfiguration extends S.Class<StandardRouterOutputConfiguration>(
  "StandardRouterOutputConfiguration",
)({
  NetworkInterfaceArn: S.String.pipe(T.JsonName("networkInterfaceArn")),
  ProtocolConfiguration: RouterOutputProtocolConfiguration.pipe(
    T.JsonName("protocolConfiguration"),
  ),
  Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
}) {}
export class MediaConnectFlowRouterOutputConfiguration extends S.Class<MediaConnectFlowRouterOutputConfiguration>(
  "MediaConnectFlowRouterOutputConfiguration",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  FlowSourceArn: S.optional(S.String).pipe(T.JsonName("flowSourceArn")),
  DestinationTransitEncryption: FlowTransitEncryption.pipe(
    T.JsonName("destinationTransitEncryption"),
  ),
}) {}
export const MediaLiveTransitEncryptionKeyConfiguration = S.Union(
  S.Struct({
    SecretsManager: SecretsManagerEncryptionKeyConfiguration.pipe(
      T.JsonName("secretsManager"),
    ),
  }),
  S.Struct({
    Automatic: AutomaticEncryptionKeyConfiguration.pipe(
      T.JsonName("automatic"),
    ),
  }),
);
export class MediaLiveTransitEncryption extends S.Class<MediaLiveTransitEncryption>(
  "MediaLiveTransitEncryption",
)({
  EncryptionKeyType: S.optional(S.String).pipe(T.JsonName("encryptionKeyType")),
  EncryptionKeyConfiguration: MediaLiveTransitEncryptionKeyConfiguration.pipe(
    T.JsonName("encryptionKeyConfiguration"),
  ),
}) {}
export class MediaLiveInputRouterOutputConfiguration extends S.Class<MediaLiveInputRouterOutputConfiguration>(
  "MediaLiveInputRouterOutputConfiguration",
)({
  MediaLiveInputArn: S.optional(S.String).pipe(T.JsonName("mediaLiveInputArn")),
  MediaLivePipelineId: S.optional(S.String).pipe(
    T.JsonName("mediaLivePipelineId"),
  ),
  DestinationTransitEncryption: MediaLiveTransitEncryption.pipe(
    T.JsonName("destinationTransitEncryption"),
  ),
}) {}
export const RouterOutputConfiguration = S.Union(
  S.Struct({
    Standard: StandardRouterOutputConfiguration.pipe(T.JsonName("standard")),
  }),
  S.Struct({
    MediaConnectFlow: MediaConnectFlowRouterOutputConfiguration.pipe(
      T.JsonName("mediaConnectFlow"),
    ),
  }),
  S.Struct({
    MediaLiveInput: MediaLiveInputRouterOutputConfiguration.pipe(
      T.JsonName("mediaLiveInput"),
    ),
  }),
);
export class UpdateRouterOutputRequest extends S.Class<UpdateRouterOutputRequest>(
  "UpdateRouterOutputRequest",
)(
  {
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Configuration: S.optional(RouterOutputConfiguration).pipe(
      T.JsonName("configuration"),
    ),
    MaximumBitrate: S.optional(S.Number).pipe(T.JsonName("maximumBitrate")),
    RoutingScope: S.optional(S.String).pipe(T.JsonName("routingScope")),
    Tier: S.optional(S.String).pipe(T.JsonName("tier")),
    MaintenanceConfiguration: S.optional(MaintenanceConfiguration).pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/routerOutput/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouterOutputRequest extends S.Class<DeleteRouterOutputRequest>(
  "DeleteRouterOutputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/routerOutput/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestartRouterOutputRequest extends S.Class<RestartRouterOutputRequest>(
  "RestartRouterOutputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerOutput/restart/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartRouterOutputRequest extends S.Class<StartRouterOutputRequest>(
  "StartRouterOutputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerOutput/start/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopRouterOutputRequest extends S.Class<StopRouterOutputRequest>(
  "StopRouterOutputRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerOutput/stop/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TakeRouterInputRequest extends S.Class<TakeRouterInputRequest>(
  "TakeRouterInputRequest",
)(
  {
    RouterOutputArn: S.String.pipe(T.HttpLabel("RouterOutputArn")),
    RouterInputArn: S.optional(S.String).pipe(T.JsonName("routerInputArn")),
  },
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
) {}
export class BatchGetRouterOutputRequest extends S.Class<BatchGetRouterOutputRequest>(
  "BatchGetRouterOutputRequest",
)(
  { Arns: RouterOutputArnList.pipe(T.HttpQuery("arns")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/routerOutputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringList = S.Array(S.String);
export const RouterInputTypeList = S.Array(S.String);
export const RoutingScopeList = S.Array(S.String);
export const RouterNetworkInterfaceTypeList = S.Array(S.String);
export const RouterOutputTypeList = S.Array(S.String);
export class AddEgressGatewayBridgeRequest extends S.Class<AddEgressGatewayBridgeRequest>(
  "AddEgressGatewayBridgeRequest",
)({ MaxBitrate: S.Number.pipe(T.JsonName("maxBitrate")) }) {}
export class AddIngressGatewayBridgeRequest extends S.Class<AddIngressGatewayBridgeRequest>(
  "AddIngressGatewayBridgeRequest",
)({
  MaxBitrate: S.Number.pipe(T.JsonName("maxBitrate")),
  MaxOutputs: S.Number.pipe(T.JsonName("maxOutputs")),
}) {}
export class UpdateEgressGatewayBridgeRequest extends S.Class<UpdateEgressGatewayBridgeRequest>(
  "UpdateEgressGatewayBridgeRequest",
)({ MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")) }) {}
export class UpdateIngressGatewayBridgeRequest extends S.Class<UpdateIngressGatewayBridgeRequest>(
  "UpdateIngressGatewayBridgeRequest",
)({
  MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
  MaxOutputs: S.optional(S.Number).pipe(T.JsonName("maxOutputs")),
}) {}
export class SourcePriority extends S.Class<SourcePriority>("SourcePriority")({
  PrimarySource: S.optional(S.String).pipe(T.JsonName("primarySource")),
}) {}
export class UpdateFailoverConfig extends S.Class<UpdateFailoverConfig>(
  "UpdateFailoverConfig",
)({
  FailoverMode: S.optional(S.String).pipe(T.JsonName("failoverMode")),
  RecoveryWindow: S.optional(S.Number).pipe(T.JsonName("recoveryWindow")),
  SourcePriority: S.optional(SourcePriority).pipe(T.JsonName("sourcePriority")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class UpdateBridgeNetworkOutputRequest extends S.Class<UpdateBridgeNetworkOutputRequest>(
  "UpdateBridgeNetworkOutputRequest",
)({
  IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
  NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
  Port: S.optional(S.Number).pipe(T.JsonName("port")),
  Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
  Ttl: S.optional(S.Number).pipe(T.JsonName("ttl")),
}) {}
export class UpdateBridgeFlowSourceRequest extends S.Class<UpdateBridgeFlowSourceRequest>(
  "UpdateBridgeFlowSourceRequest",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  FlowVpcInterfaceAttachment: S.optional(VpcInterfaceAttachment).pipe(
    T.JsonName("flowVpcInterfaceAttachment"),
  ),
}) {}
export class AddMaintenance extends S.Class<AddMaintenance>("AddMaintenance")({
  MaintenanceDay: S.String.pipe(T.JsonName("maintenanceDay")),
  MaintenanceStartHour: S.String.pipe(T.JsonName("maintenanceStartHour")),
}) {}
export class UpdateMaintenance extends S.Class<UpdateMaintenance>(
  "UpdateMaintenance",
)({
  MaintenanceDay: S.optional(S.String).pipe(T.JsonName("maintenanceDay")),
  MaintenanceScheduledDate: S.optional(S.String).pipe(
    T.JsonName("maintenanceScheduledDate"),
  ),
  MaintenanceStartHour: S.optional(S.String).pipe(
    T.JsonName("maintenanceStartHour"),
  ),
}) {}
export class UpdateEncryption extends S.Class<UpdateEncryption>(
  "UpdateEncryption",
)({
  Algorithm: S.optional(S.String).pipe(T.JsonName("algorithm")),
  ConstantInitializationVector: S.optional(S.String).pipe(
    T.JsonName("constantInitializationVector"),
  ),
  DeviceId: S.optional(S.String).pipe(T.JsonName("deviceId")),
  KeyType: S.optional(S.String).pipe(T.JsonName("keyType")),
  Region: S.optional(S.String).pipe(T.JsonName("region")),
  ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
}) {}
export class UpdateGatewayBridgeSourceRequest extends S.Class<UpdateGatewayBridgeSourceRequest>(
  "UpdateGatewayBridgeSourceRequest",
)({
  BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
  VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment).pipe(
    T.JsonName("vpcInterfaceAttachment"),
  ),
}) {}
export class GatewayNetwork extends S.Class<GatewayNetwork>("GatewayNetwork")({
  CidrBlock: S.String.pipe(T.JsonName("cidrBlock")),
  Name: S.String.pipe(T.JsonName("name")),
}) {}
export const __listOfGatewayNetwork = S.Array(GatewayNetwork);
export class ResourceSpecification extends S.Class<ResourceSpecification>(
  "ResourceSpecification",
)({
  ReservedBitrate: S.optional(S.Number).pipe(T.JsonName("reservedBitrate")),
  ResourceType: S.String.pipe(T.JsonName("resourceType")),
}) {}
export class Offering extends S.Class<Offering>("Offering")({
  CurrencyCode: S.String.pipe(T.JsonName("currencyCode")),
  Duration: S.Number.pipe(T.JsonName("duration")),
  DurationUnits: S.String.pipe(T.JsonName("durationUnits")),
  OfferingArn: S.String.pipe(T.JsonName("offeringArn")),
  OfferingDescription: S.String.pipe(T.JsonName("offeringDescription")),
  PricePerUnit: S.String.pipe(T.JsonName("pricePerUnit")),
  PriceUnits: S.String.pipe(T.JsonName("priceUnits")),
  ResourceSpecification: ResourceSpecification.pipe(
    T.JsonName("resourceSpecification"),
  ),
}) {}
export const __listOfOffering = S.Array(Offering);
export class Reservation extends S.Class<Reservation>("Reservation")({
  CurrencyCode: S.String.pipe(T.JsonName("currencyCode")),
  Duration: S.Number.pipe(T.JsonName("duration")),
  DurationUnits: S.String.pipe(T.JsonName("durationUnits")),
  End: S.String.pipe(T.JsonName("end")),
  OfferingArn: S.String.pipe(T.JsonName("offeringArn")),
  OfferingDescription: S.String.pipe(T.JsonName("offeringDescription")),
  PricePerUnit: S.String.pipe(T.JsonName("pricePerUnit")),
  PriceUnits: S.String.pipe(T.JsonName("priceUnits")),
  ReservationArn: S.String.pipe(T.JsonName("reservationArn")),
  ReservationName: S.String.pipe(T.JsonName("reservationName")),
  ReservationState: S.String.pipe(T.JsonName("reservationState")),
  ResourceSpecification: ResourceSpecification.pipe(
    T.JsonName("resourceSpecification"),
  ),
  Start: S.String.pipe(T.JsonName("start")),
}) {}
export const __listOfReservation = S.Array(Reservation);
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
export const RouterInputFilterList = S.Array(RouterInputFilter);
export class RouterInputMessage extends S.Class<RouterInputMessage>(
  "RouterInputMessage",
)({
  Code: S.String.pipe(T.JsonName("code")),
  Message: S.String.pipe(T.JsonName("message")),
}) {}
export const RouterInputMessages = S.Array(RouterInputMessage);
export class StandardRouterInputStreamDetails extends S.Class<StandardRouterInputStreamDetails>(
  "StandardRouterInputStreamDetails",
)({
  SourceIpAddress: S.optional(S.String).pipe(T.JsonName("sourceIpAddress")),
}) {}
export class FailoverRouterInputIndexedStreamDetails extends S.Class<FailoverRouterInputIndexedStreamDetails>(
  "FailoverRouterInputIndexedStreamDetails",
)({
  SourceIndex: S.Number.pipe(T.JsonName("sourceIndex")),
  SourceIpAddress: S.optional(S.String).pipe(T.JsonName("sourceIpAddress")),
}) {}
export class FailoverRouterInputStreamDetails extends S.Class<FailoverRouterInputStreamDetails>(
  "FailoverRouterInputStreamDetails",
)({
  SourceIndexZeroStreamDetails: FailoverRouterInputIndexedStreamDetails.pipe(
    T.JsonName("sourceIndexZeroStreamDetails"),
  ),
  SourceIndexOneStreamDetails: FailoverRouterInputIndexedStreamDetails.pipe(
    T.JsonName("sourceIndexOneStreamDetails"),
  ),
}) {}
export class MergeRouterInputIndexedStreamDetails extends S.Class<MergeRouterInputIndexedStreamDetails>(
  "MergeRouterInputIndexedStreamDetails",
)({
  SourceIndex: S.Number.pipe(T.JsonName("sourceIndex")),
  SourceIpAddress: S.optional(S.String).pipe(T.JsonName("sourceIpAddress")),
}) {}
export class MergeRouterInputStreamDetails extends S.Class<MergeRouterInputStreamDetails>(
  "MergeRouterInputStreamDetails",
)({
  SourceIndexZeroStreamDetails: MergeRouterInputIndexedStreamDetails.pipe(
    T.JsonName("sourceIndexZeroStreamDetails"),
  ),
  SourceIndexOneStreamDetails: MergeRouterInputIndexedStreamDetails.pipe(
    T.JsonName("sourceIndexOneStreamDetails"),
  ),
}) {}
export class MediaConnectFlowRouterInputStreamDetails extends S.Class<MediaConnectFlowRouterInputStreamDetails>(
  "MediaConnectFlowRouterInputStreamDetails",
)({}) {}
export const RouterInputStreamDetails = S.Union(
  S.Struct({
    Standard: StandardRouterInputStreamDetails.pipe(T.JsonName("standard")),
  }),
  S.Struct({
    Failover: FailoverRouterInputStreamDetails.pipe(T.JsonName("failover")),
  }),
  S.Struct({ Merge: MergeRouterInputStreamDetails.pipe(T.JsonName("merge")) }),
  S.Struct({
    MediaConnectFlow: MediaConnectFlowRouterInputStreamDetails.pipe(
      T.JsonName("mediaConnectFlow"),
    ),
  }),
);
export class WindowMaintenanceSchedule extends S.Class<WindowMaintenanceSchedule>(
  "WindowMaintenanceSchedule",
)({
  Start: S.Date.pipe(T.TimestampFormat("date-time")).pipe(T.JsonName("start")),
  End: S.Date.pipe(T.TimestampFormat("date-time")).pipe(T.JsonName("end")),
  ScheduledTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("scheduledTime"),
  ),
}) {}
export const MaintenanceSchedule = S.Union(
  S.Struct({ Window: WindowMaintenanceSchedule.pipe(T.JsonName("window")) }),
);
export class RouterInput extends S.Class<RouterInput>("RouterInput")({
  Name: S.String.pipe(T.JsonName("name")),
  Arn: S.String.pipe(T.JsonName("arn")),
  Id: S.String.pipe(T.JsonName("id")),
  State: S.String.pipe(T.JsonName("state")),
  InputType: S.String.pipe(T.JsonName("inputType")),
  Configuration: RouterInputConfiguration.pipe(T.JsonName("configuration")),
  RoutedOutputs: S.Number.pipe(T.JsonName("routedOutputs")),
  MaximumRoutedOutputs: S.optional(S.Number).pipe(
    T.JsonName("maximumRoutedOutputs"),
  ),
  RegionName: S.String.pipe(T.JsonName("regionName")),
  AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
  MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
  Tier: S.String.pipe(T.JsonName("tier")),
  RoutingScope: S.String.pipe(T.JsonName("routingScope")),
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("createdAt"),
  ),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("updatedAt"),
  ),
  Messages: RouterInputMessages.pipe(T.JsonName("messages")),
  TransitEncryption: RouterInputTransitEncryption.pipe(
    T.JsonName("transitEncryption"),
  ),
  Tags: __mapOfString.pipe(T.JsonName("tags")),
  StreamDetails: RouterInputStreamDetails.pipe(T.JsonName("streamDetails")),
  IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
  MaintenanceType: S.String.pipe(T.JsonName("maintenanceType")),
  MaintenanceConfiguration: MaintenanceConfiguration.pipe(
    T.JsonName("maintenanceConfiguration"),
  ),
  MaintenanceScheduleType: S.optional(S.String).pipe(
    T.JsonName("maintenanceScheduleType"),
  ),
  MaintenanceSchedule: S.optional(MaintenanceSchedule).pipe(
    T.JsonName("maintenanceSchedule"),
  ),
}) {}
export const RouterInputList = S.Array(RouterInput);
export const RouterNetworkInterfaceFilter = S.Union(
  S.Struct({ RegionNames: StringList.pipe(T.JsonName("regionNames")) }),
  S.Struct({
    NetworkInterfaceTypes: RouterNetworkInterfaceTypeList.pipe(
      T.JsonName("networkInterfaceTypes"),
    ),
  }),
  S.Struct({ NameContains: StringList.pipe(T.JsonName("nameContains")) }),
);
export const RouterNetworkInterfaceFilterList = S.Array(
  RouterNetworkInterfaceFilter,
);
export class RouterNetworkInterface extends S.Class<RouterNetworkInterface>(
  "RouterNetworkInterface",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Arn: S.String.pipe(T.JsonName("arn")),
  Id: S.String.pipe(T.JsonName("id")),
  State: S.String.pipe(T.JsonName("state")),
  NetworkInterfaceType: S.String.pipe(T.JsonName("networkInterfaceType")),
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
}) {}
export const RouterNetworkInterfaceList = S.Array(RouterNetworkInterface);
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
export const RouterOutputFilterList = S.Array(RouterOutputFilter);
export class RouterOutputMessage extends S.Class<RouterOutputMessage>(
  "RouterOutputMessage",
)({
  Code: S.String.pipe(T.JsonName("code")),
  Message: S.String.pipe(T.JsonName("message")),
}) {}
export const RouterOutputMessages = S.Array(RouterOutputMessage);
export class StandardRouterOutputStreamDetails extends S.Class<StandardRouterOutputStreamDetails>(
  "StandardRouterOutputStreamDetails",
)({
  DestinationIpAddress: S.optional(S.String).pipe(
    T.JsonName("destinationIpAddress"),
  ),
}) {}
export class MediaConnectFlowRouterOutputStreamDetails extends S.Class<MediaConnectFlowRouterOutputStreamDetails>(
  "MediaConnectFlowRouterOutputStreamDetails",
)({}) {}
export class MediaLiveInputRouterOutputStreamDetails extends S.Class<MediaLiveInputRouterOutputStreamDetails>(
  "MediaLiveInputRouterOutputStreamDetails",
)({}) {}
export const RouterOutputStreamDetails = S.Union(
  S.Struct({
    Standard: StandardRouterOutputStreamDetails.pipe(T.JsonName("standard")),
  }),
  S.Struct({
    MediaConnectFlow: MediaConnectFlowRouterOutputStreamDetails.pipe(
      T.JsonName("mediaConnectFlow"),
    ),
  }),
  S.Struct({
    MediaLiveInput: MediaLiveInputRouterOutputStreamDetails.pipe(
      T.JsonName("mediaLiveInput"),
    ),
  }),
);
export class RouterOutput extends S.Class<RouterOutput>("RouterOutput")({
  Name: S.String.pipe(T.JsonName("name")),
  Arn: S.String.pipe(T.JsonName("arn")),
  Id: S.String.pipe(T.JsonName("id")),
  State: S.String.pipe(T.JsonName("state")),
  OutputType: S.String.pipe(T.JsonName("outputType")),
  Configuration: RouterOutputConfiguration.pipe(T.JsonName("configuration")),
  RoutedState: S.String.pipe(T.JsonName("routedState")),
  RegionName: S.String.pipe(T.JsonName("regionName")),
  AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
  MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
  RoutingScope: S.String.pipe(T.JsonName("routingScope")),
  Tier: S.String.pipe(T.JsonName("tier")),
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
  MaintenanceType: S.String.pipe(T.JsonName("maintenanceType")),
  MaintenanceConfiguration: MaintenanceConfiguration.pipe(
    T.JsonName("maintenanceConfiguration"),
  ),
  MaintenanceScheduleType: S.optional(S.String).pipe(
    T.JsonName("maintenanceScheduleType"),
  ),
  MaintenanceSchedule: S.optional(MaintenanceSchedule).pipe(
    T.JsonName("maintenanceSchedule"),
  ),
}) {}
export const RouterOutputList = S.Array(RouterOutput);
export class ListTagsForGlobalResourceResponse extends S.Class<ListTagsForGlobalResourceResponse>(
  "ListTagsForGlobalResourceResponse",
)({ Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")) }) {}
export class TagGlobalResourceRequest extends S.Class<TagGlobalResourceRequest>(
  "TagGlobalResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: __mapOfString.pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tags/global/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagGlobalResourceResponse extends S.Class<TagGlobalResourceResponse>(
  "TagGlobalResourceResponse",
)({}) {}
export class UpdateBridgeRequest extends S.Class<UpdateBridgeRequest>(
  "UpdateBridgeRequest",
)(
  {
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    EgressGatewayBridge: S.optional(UpdateEgressGatewayBridgeRequest).pipe(
      T.JsonName("egressGatewayBridge"),
    ),
    IngressGatewayBridge: S.optional(UpdateIngressGatewayBridgeRequest).pipe(
      T.JsonName("ingressGatewayBridge"),
    ),
    SourceFailoverConfig: S.optional(UpdateFailoverConfig).pipe(
      T.JsonName("sourceFailoverConfig"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/bridges/{BridgeArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBridgeResponse extends S.Class<DeleteBridgeResponse>(
  "DeleteBridgeResponse",
)({ BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")) }) {}
export class RemoveBridgeOutputResponse extends S.Class<RemoveBridgeOutputResponse>(
  "RemoveBridgeOutputResponse",
)({
  BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
  OutputName: S.optional(S.String).pipe(T.JsonName("outputName")),
}) {}
export class RemoveBridgeSourceResponse extends S.Class<RemoveBridgeSourceResponse>(
  "RemoveBridgeSourceResponse",
)({
  BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
  SourceName: S.optional(S.String).pipe(T.JsonName("sourceName")),
}) {}
export class UpdateBridgeOutputRequest extends S.Class<UpdateBridgeOutputRequest>(
  "UpdateBridgeOutputRequest",
)(
  {
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    NetworkOutput: S.optional(UpdateBridgeNetworkOutputRequest).pipe(
      T.JsonName("networkOutput"),
    ),
    OutputName: S.String.pipe(T.HttpLabel("OutputName")),
  },
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
) {}
export class UpdateBridgeStateResponse extends S.Class<UpdateBridgeStateResponse>(
  "UpdateBridgeStateResponse",
)({
  BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
  DesiredState: S.optional(S.String).pipe(T.JsonName("desiredState")),
}) {}
export class SilentAudio extends S.Class<SilentAudio>("SilentAudio")({
  State: S.optional(S.String).pipe(T.JsonName("state")),
  ThresholdSeconds: S.optional(S.Number).pipe(T.JsonName("thresholdSeconds")),
}) {}
export class AudioMonitoringSetting extends S.Class<AudioMonitoringSetting>(
  "AudioMonitoringSetting",
)({ SilentAudio: S.optional(SilentAudio).pipe(T.JsonName("silentAudio")) }) {}
export const __listOfAudioMonitoringSetting = S.Array(AudioMonitoringSetting);
export class BlackFrames extends S.Class<BlackFrames>("BlackFrames")({
  State: S.optional(S.String).pipe(T.JsonName("state")),
  ThresholdSeconds: S.optional(S.Number).pipe(T.JsonName("thresholdSeconds")),
}) {}
export class FrozenFrames extends S.Class<FrozenFrames>("FrozenFrames")({
  State: S.optional(S.String).pipe(T.JsonName("state")),
  ThresholdSeconds: S.optional(S.Number).pipe(T.JsonName("thresholdSeconds")),
}) {}
export class VideoMonitoringSetting extends S.Class<VideoMonitoringSetting>(
  "VideoMonitoringSetting",
)({
  BlackFrames: S.optional(BlackFrames).pipe(T.JsonName("blackFrames")),
  FrozenFrames: S.optional(FrozenFrames).pipe(T.JsonName("frozenFrames")),
}) {}
export const __listOfVideoMonitoringSetting = S.Array(VideoMonitoringSetting);
export class MonitoringConfig extends S.Class<MonitoringConfig>(
  "MonitoringConfig",
)({
  ThumbnailState: S.optional(S.String).pipe(T.JsonName("thumbnailState")),
  AudioMonitoringSettings: S.optional(__listOfAudioMonitoringSetting).pipe(
    T.JsonName("audioMonitoringSettings"),
  ),
  ContentQualityAnalysisState: S.optional(S.String).pipe(
    T.JsonName("contentQualityAnalysisState"),
  ),
  VideoMonitoringSettings: S.optional(__listOfVideoMonitoringSetting).pipe(
    T.JsonName("videoMonitoringSettings"),
  ),
}) {}
export class NdiDiscoveryServerConfig extends S.Class<NdiDiscoveryServerConfig>(
  "NdiDiscoveryServerConfig",
)({
  DiscoveryServerAddress: S.String.pipe(T.JsonName("discoveryServerAddress")),
  DiscoveryServerPort: S.optional(S.Number).pipe(
    T.JsonName("discoveryServerPort"),
  ),
  VpcInterfaceAdapter: S.String.pipe(T.JsonName("vpcInterfaceAdapter")),
}) {}
export const __listOfNdiDiscoveryServerConfig = S.Array(
  NdiDiscoveryServerConfig,
);
export class NdiConfig extends S.Class<NdiConfig>("NdiConfig")({
  NdiState: S.optional(S.String).pipe(T.JsonName("ndiState")),
  MachineName: S.optional(S.String).pipe(T.JsonName("machineName")),
  NdiDiscoveryServers: S.optional(__listOfNdiDiscoveryServerConfig).pipe(
    T.JsonName("ndiDiscoveryServers"),
  ),
}) {}
export class UpdateFlowRequest extends S.Class<UpdateFlowRequest>(
  "UpdateFlowRequest",
)(
  {
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    SourceFailoverConfig: S.optional(UpdateFailoverConfig).pipe(
      T.JsonName("sourceFailoverConfig"),
    ),
    Maintenance: S.optional(UpdateMaintenance).pipe(T.JsonName("maintenance")),
    SourceMonitoringConfig: S.optional(MonitoringConfig).pipe(
      T.JsonName("sourceMonitoringConfig"),
    ),
    NdiConfig: S.optional(NdiConfig).pipe(T.JsonName("ndiConfig")),
    FlowSize: S.optional(S.String).pipe(T.JsonName("flowSize")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/flows/{FlowArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFlowResponse extends S.Class<DeleteFlowResponse>(
  "DeleteFlowResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class RemoveFlowMediaStreamResponse extends S.Class<RemoveFlowMediaStreamResponse>(
  "RemoveFlowMediaStreamResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  MediaStreamName: S.optional(S.String).pipe(T.JsonName("mediaStreamName")),
}) {}
export class RemoveFlowOutputResponse extends S.Class<RemoveFlowOutputResponse>(
  "RemoveFlowOutputResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  OutputArn: S.optional(S.String).pipe(T.JsonName("outputArn")),
}) {}
export class RemoveFlowSourceResponse extends S.Class<RemoveFlowSourceResponse>(
  "RemoveFlowSourceResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  SourceArn: S.optional(S.String).pipe(T.JsonName("sourceArn")),
}) {}
export class RemoveFlowVpcInterfaceResponse extends S.Class<RemoveFlowVpcInterfaceResponse>(
  "RemoveFlowVpcInterfaceResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  NonDeletedNetworkInterfaceIds: S.optional(__listOfString).pipe(
    T.JsonName("nonDeletedNetworkInterfaceIds"),
  ),
  VpcInterfaceName: S.optional(S.String).pipe(T.JsonName("vpcInterfaceName")),
}) {}
export class RevokeFlowEntitlementResponse extends S.Class<RevokeFlowEntitlementResponse>(
  "RevokeFlowEntitlementResponse",
)({
  EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
}) {}
export class StartFlowResponse extends S.Class<StartFlowResponse>(
  "StartFlowResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class StopFlowResponse extends S.Class<StopFlowResponse>(
  "StopFlowResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class UpdateFlowEntitlementRequest extends S.Class<UpdateFlowEntitlementRequest>(
  "UpdateFlowEntitlementRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Encryption: S.optional(UpdateEncryption).pipe(T.JsonName("encryption")),
    EntitlementArn: S.String.pipe(T.HttpLabel("EntitlementArn")),
    EntitlementStatus: S.optional(S.String).pipe(
      T.JsonName("entitlementStatus"),
    ),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    Subscribers: S.optional(__listOfString).pipe(T.JsonName("subscribers")),
  },
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
) {}
export class UpdateGatewayInstanceResponse extends S.Class<UpdateGatewayInstanceResponse>(
  "UpdateGatewayInstanceResponse",
)({
  BridgePlacement: S.optional(S.String).pipe(T.JsonName("bridgePlacement")),
  GatewayInstanceArn: S.optional(S.String).pipe(
    T.JsonName("gatewayInstanceArn"),
  ),
}) {}
export class DeregisterGatewayInstanceResponse extends S.Class<DeregisterGatewayInstanceResponse>(
  "DeregisterGatewayInstanceResponse",
)({
  GatewayInstanceArn: S.optional(S.String).pipe(
    T.JsonName("gatewayInstanceArn"),
  ),
  InstanceState: S.optional(S.String).pipe(T.JsonName("instanceState")),
}) {}
export class CreateGatewayRequest extends S.Class<CreateGatewayRequest>(
  "CreateGatewayRequest",
)(
  {
    EgressCidrBlocks: __listOfString.pipe(T.JsonName("egressCidrBlocks")),
    Name: S.String.pipe(T.JsonName("name")),
    Networks: __listOfGatewayNetwork.pipe(T.JsonName("networks")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/gateways" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGatewayResponse extends S.Class<DeleteGatewayResponse>(
  "DeleteGatewayResponse",
)({ GatewayArn: S.optional(S.String).pipe(T.JsonName("gatewayArn")) }) {}
export class ListOfferingsResponse extends S.Class<ListOfferingsResponse>(
  "ListOfferingsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Offerings: S.optional(__listOfOffering).pipe(T.JsonName("offerings")),
}) {}
export class DescribeReservationResponse extends S.Class<DescribeReservationResponse>(
  "DescribeReservationResponse",
)({ Reservation: S.optional(Reservation).pipe(T.JsonName("reservation")) }) {}
export class ListReservationsResponse extends S.Class<ListReservationsResponse>(
  "ListReservationsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Reservations: S.optional(__listOfReservation).pipe(
    T.JsonName("reservations"),
  ),
}) {}
export class UpdateRouterInputResponse extends S.Class<UpdateRouterInputResponse>(
  "UpdateRouterInputResponse",
)({ RouterInput: RouterInput.pipe(T.JsonName("routerInput")) }) {}
export class DeleteRouterInputResponse extends S.Class<DeleteRouterInputResponse>(
  "DeleteRouterInputResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
}) {}
export class ListRouterInputsRequest extends S.Class<ListRouterInputsRequest>(
  "ListRouterInputsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Filters: S.optional(RouterInputFilterList).pipe(T.JsonName("filters")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerInputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestartRouterInputResponse extends S.Class<RestartRouterInputResponse>(
  "RestartRouterInputResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
}) {}
export class StopRouterInputResponse extends S.Class<StopRouterInputResponse>(
  "StopRouterInputResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
}) {}
export class UpdateRouterNetworkInterfaceResponse extends S.Class<UpdateRouterNetworkInterfaceResponse>(
  "UpdateRouterNetworkInterfaceResponse",
)({
  RouterNetworkInterface: RouterNetworkInterface.pipe(
    T.JsonName("routerNetworkInterface"),
  ),
}) {}
export class DeleteRouterNetworkInterfaceResponse extends S.Class<DeleteRouterNetworkInterfaceResponse>(
  "DeleteRouterNetworkInterfaceResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
}) {}
export class ListRouterNetworkInterfacesRequest extends S.Class<ListRouterNetworkInterfacesRequest>(
  "ListRouterNetworkInterfacesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Filters: S.optional(RouterNetworkInterfaceFilterList).pipe(
      T.JsonName("filters"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerNetworkInterfaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRouterOutputResponse extends S.Class<UpdateRouterOutputResponse>(
  "UpdateRouterOutputResponse",
)({ RouterOutput: RouterOutput.pipe(T.JsonName("routerOutput")) }) {}
export class DeleteRouterOutputResponse extends S.Class<DeleteRouterOutputResponse>(
  "DeleteRouterOutputResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
}) {}
export class ListRouterOutputsRequest extends S.Class<ListRouterOutputsRequest>(
  "ListRouterOutputsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Filters: S.optional(RouterOutputFilterList).pipe(T.JsonName("filters")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerOutputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestartRouterOutputResponse extends S.Class<RestartRouterOutputResponse>(
  "RestartRouterOutputResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
}) {}
export class StartRouterOutputResponse extends S.Class<StartRouterOutputResponse>(
  "StartRouterOutputResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
  MaintenanceScheduleType: S.String.pipe(T.JsonName("maintenanceScheduleType")),
  MaintenanceSchedule: MaintenanceSchedule.pipe(
    T.JsonName("maintenanceSchedule"),
  ),
}) {}
export class StopRouterOutputResponse extends S.Class<StopRouterOutputResponse>(
  "StopRouterOutputResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
}) {}
export class TakeRouterInputResponse extends S.Class<TakeRouterInputResponse>(
  "TakeRouterInputResponse",
)({
  RoutedState: S.String.pipe(T.JsonName("routedState")),
  RouterOutputArn: S.String.pipe(T.JsonName("routerOutputArn")),
  RouterOutputName: S.String.pipe(T.JsonName("routerOutputName")),
  RouterInputArn: S.optional(S.String).pipe(T.JsonName("routerInputArn")),
  RouterInputName: S.optional(S.String).pipe(T.JsonName("routerInputName")),
}) {}
export const __listOfInteger = S.Array(S.Number);
export class ListedEntitlement extends S.Class<ListedEntitlement>(
  "ListedEntitlement",
)({
  DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
    T.JsonName("dataTransferSubscriberFeePercent"),
  ),
  EntitlementArn: S.String.pipe(T.JsonName("entitlementArn")),
  EntitlementName: S.String.pipe(T.JsonName("entitlementName")),
}) {}
export const __listOfListedEntitlement = S.Array(ListedEntitlement);
export class FailoverConfig extends S.Class<FailoverConfig>("FailoverConfig")({
  FailoverMode: S.optional(S.String).pipe(T.JsonName("failoverMode")),
  RecoveryWindow: S.optional(S.Number).pipe(T.JsonName("recoveryWindow")),
  SourcePriority: S.optional(SourcePriority).pipe(T.JsonName("sourcePriority")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class ListedBridge extends S.Class<ListedBridge>("ListedBridge")({
  BridgeArn: S.String.pipe(T.JsonName("bridgeArn")),
  BridgeState: S.String.pipe(T.JsonName("bridgeState")),
  BridgeType: S.String.pipe(T.JsonName("bridgeType")),
  Name: S.String.pipe(T.JsonName("name")),
  PlacementArn: S.String.pipe(T.JsonName("placementArn")),
}) {}
export const __listOfListedBridge = S.Array(ListedBridge);
export class UpdateBridgeNetworkSourceRequest extends S.Class<UpdateBridgeNetworkSourceRequest>(
  "UpdateBridgeNetworkSourceRequest",
)({
  MulticastIp: S.optional(S.String).pipe(T.JsonName("multicastIp")),
  MulticastSourceSettings: S.optional(MulticastSourceSettings).pipe(
    T.JsonName("multicastSourceSettings"),
  ),
  NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
  Port: S.optional(S.Number).pipe(T.JsonName("port")),
  Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
}) {}
export class Messages extends S.Class<Messages>("Messages")({
  Errors: __listOfString.pipe(T.JsonName("errors")),
}) {}
export class Maintenance extends S.Class<Maintenance>("Maintenance")({
  MaintenanceDay: S.optional(S.String).pipe(T.JsonName("maintenanceDay")),
  MaintenanceDeadline: S.optional(S.String).pipe(
    T.JsonName("maintenanceDeadline"),
  ),
  MaintenanceScheduledDate: S.optional(S.String).pipe(
    T.JsonName("maintenanceScheduledDate"),
  ),
  MaintenanceStartHour: S.optional(S.String).pipe(
    T.JsonName("maintenanceStartHour"),
  ),
}) {}
export class ListedFlow extends S.Class<ListedFlow>("ListedFlow")({
  AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
  Description: S.String.pipe(T.JsonName("description")),
  FlowArn: S.String.pipe(T.JsonName("flowArn")),
  Name: S.String.pipe(T.JsonName("name")),
  SourceType: S.String.pipe(T.JsonName("sourceType")),
  Status: S.String.pipe(T.JsonName("status")),
  Maintenance: S.optional(Maintenance).pipe(T.JsonName("maintenance")),
}) {}
export const __listOfListedFlow = S.Array(ListedFlow);
export class VpcInterface extends S.Class<VpcInterface>("VpcInterface")({
  Name: S.String.pipe(T.JsonName("name")),
  NetworkInterfaceIds: __listOfString.pipe(T.JsonName("networkInterfaceIds")),
  NetworkInterfaceType: S.String.pipe(T.JsonName("networkInterfaceType")),
  RoleArn: S.String.pipe(T.JsonName("roleArn")),
  SecurityGroupIds: __listOfString.pipe(T.JsonName("securityGroupIds")),
  SubnetId: S.String.pipe(T.JsonName("subnetId")),
}) {}
export const __listOfVpcInterface = S.Array(VpcInterface);
export class MessageDetail extends S.Class<MessageDetail>("MessageDetail")({
  Code: S.String.pipe(T.JsonName("code")),
  Message: S.String.pipe(T.JsonName("message")),
  ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
}) {}
export const __listOfMessageDetail = S.Array(MessageDetail);
export class ThumbnailDetails extends S.Class<ThumbnailDetails>(
  "ThumbnailDetails",
)({
  FlowArn: S.String.pipe(T.JsonName("flowArn")),
  Thumbnail: S.optional(S.String).pipe(T.JsonName("thumbnail")),
  ThumbnailMessages: __listOfMessageDetail.pipe(
    T.JsonName("thumbnailMessages"),
  ),
  Timecode: S.optional(S.String).pipe(T.JsonName("timecode")),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("timestamp"),
  ),
}) {}
export class Entitlement extends S.Class<Entitlement>("Entitlement")({
  DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
    T.JsonName("dataTransferSubscriberFeePercent"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Encryption: S.optional(Encryption).pipe(T.JsonName("encryption")),
  EntitlementArn: S.String.pipe(T.JsonName("entitlementArn")),
  EntitlementStatus: S.optional(S.String).pipe(T.JsonName("entitlementStatus")),
  Name: S.String.pipe(T.JsonName("name")),
  Subscribers: __listOfString.pipe(T.JsonName("subscribers")),
}) {}
export const __listOfEntitlement = S.Array(Entitlement);
export class GatewayInstance extends S.Class<GatewayInstance>(
  "GatewayInstance",
)({
  BridgePlacement: S.String.pipe(T.JsonName("bridgePlacement")),
  ConnectionStatus: S.String.pipe(T.JsonName("connectionStatus")),
  GatewayArn: S.String.pipe(T.JsonName("gatewayArn")),
  GatewayInstanceArn: S.String.pipe(T.JsonName("gatewayInstanceArn")),
  InstanceId: S.String.pipe(T.JsonName("instanceId")),
  InstanceMessages: S.optional(__listOfMessageDetail).pipe(
    T.JsonName("instanceMessages"),
  ),
  InstanceState: S.String.pipe(T.JsonName("instanceState")),
  RunningBridgeCount: S.Number.pipe(T.JsonName("runningBridgeCount")),
}) {}
export class ListedGatewayInstance extends S.Class<ListedGatewayInstance>(
  "ListedGatewayInstance",
)({
  GatewayArn: S.String.pipe(T.JsonName("gatewayArn")),
  GatewayInstanceArn: S.String.pipe(T.JsonName("gatewayInstanceArn")),
  InstanceId: S.String.pipe(T.JsonName("instanceId")),
  InstanceState: S.optional(S.String).pipe(T.JsonName("instanceState")),
}) {}
export const __listOfListedGatewayInstance = S.Array(ListedGatewayInstance);
export class Gateway extends S.Class<Gateway>("Gateway")({
  EgressCidrBlocks: __listOfString.pipe(T.JsonName("egressCidrBlocks")),
  GatewayArn: S.String.pipe(T.JsonName("gatewayArn")),
  GatewayMessages: S.optional(__listOfMessageDetail).pipe(
    T.JsonName("gatewayMessages"),
  ),
  GatewayState: S.optional(S.String).pipe(T.JsonName("gatewayState")),
  Name: S.String.pipe(T.JsonName("name")),
  Networks: __listOfGatewayNetwork.pipe(T.JsonName("networks")),
}) {}
export class ListedGateway extends S.Class<ListedGateway>("ListedGateway")({
  GatewayArn: S.String.pipe(T.JsonName("gatewayArn")),
  GatewayState: S.String.pipe(T.JsonName("gatewayState")),
  Name: S.String.pipe(T.JsonName("name")),
}) {}
export const __listOfListedGateway = S.Array(ListedGateway);
export class RouterInputThumbnailDetails extends S.Class<RouterInputThumbnailDetails>(
  "RouterInputThumbnailDetails",
)({
  ThumbnailMessages: RouterInputMessages.pipe(T.JsonName("thumbnailMessages")),
  Thumbnail: S.optional(T.Blob).pipe(T.JsonName("thumbnail")),
  Timecode: S.optional(S.String).pipe(T.JsonName("timecode")),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("timestamp"),
  ),
}) {}
export class BatchGetRouterInputError extends S.Class<BatchGetRouterInputError>(
  "BatchGetRouterInputError",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Code: S.String.pipe(T.JsonName("code")),
  Message: S.String.pipe(T.JsonName("message")),
}) {}
export const BatchGetRouterInputErrorList = S.Array(BatchGetRouterInputError);
export class BatchGetRouterNetworkInterfaceError extends S.Class<BatchGetRouterNetworkInterfaceError>(
  "BatchGetRouterNetworkInterfaceError",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Code: S.String.pipe(T.JsonName("code")),
  Message: S.String.pipe(T.JsonName("message")),
}) {}
export const BatchGetRouterNetworkInterfaceErrorList = S.Array(
  BatchGetRouterNetworkInterfaceError,
);
export class BatchGetRouterOutputError extends S.Class<BatchGetRouterOutputError>(
  "BatchGetRouterOutputError",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Code: S.String.pipe(T.JsonName("code")),
  Message: S.String.pipe(T.JsonName("message")),
}) {}
export const BatchGetRouterOutputErrorList = S.Array(BatchGetRouterOutputError);
export class ListEntitlementsResponse extends S.Class<ListEntitlementsResponse>(
  "ListEntitlementsResponse",
)({
  Entitlements: S.optional(__listOfListedEntitlement).pipe(
    T.JsonName("entitlements"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class CreateBridgeRequest extends S.Class<CreateBridgeRequest>(
  "CreateBridgeRequest",
)(
  {
    EgressGatewayBridge: S.optional(AddEgressGatewayBridgeRequest).pipe(
      T.JsonName("egressGatewayBridge"),
    ),
    IngressGatewayBridge: S.optional(AddIngressGatewayBridgeRequest).pipe(
      T.JsonName("ingressGatewayBridge"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
    Outputs: S.optional(__listOfAddBridgeOutputRequest).pipe(
      T.JsonName("outputs"),
    ),
    PlacementArn: S.String.pipe(T.JsonName("placementArn")),
    SourceFailoverConfig: S.optional(FailoverConfig).pipe(
      T.JsonName("sourceFailoverConfig"),
    ),
    Sources: __listOfAddBridgeSourceRequest.pipe(T.JsonName("sources")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/bridges" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EgressGatewayBridge extends S.Class<EgressGatewayBridge>(
  "EgressGatewayBridge",
)({
  InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
  MaxBitrate: S.Number.pipe(T.JsonName("maxBitrate")),
}) {}
export class IngressGatewayBridge extends S.Class<IngressGatewayBridge>(
  "IngressGatewayBridge",
)({
  InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
  MaxBitrate: S.Number.pipe(T.JsonName("maxBitrate")),
  MaxOutputs: S.Number.pipe(T.JsonName("maxOutputs")),
}) {}
export class BridgeFlowOutput extends S.Class<BridgeFlowOutput>(
  "BridgeFlowOutput",
)({
  FlowArn: S.String.pipe(T.JsonName("flowArn")),
  FlowSourceArn: S.String.pipe(T.JsonName("flowSourceArn")),
  Name: S.String.pipe(T.JsonName("name")),
}) {}
export class BridgeNetworkOutput extends S.Class<BridgeNetworkOutput>(
  "BridgeNetworkOutput",
)({
  IpAddress: S.String.pipe(T.JsonName("ipAddress")),
  Name: S.String.pipe(T.JsonName("name")),
  NetworkName: S.String.pipe(T.JsonName("networkName")),
  Port: S.Number.pipe(T.JsonName("port")),
  Protocol: S.String.pipe(T.JsonName("protocol")),
  Ttl: S.Number.pipe(T.JsonName("ttl")),
}) {}
export class BridgeOutput extends S.Class<BridgeOutput>("BridgeOutput")({
  FlowOutput: S.optional(BridgeFlowOutput).pipe(T.JsonName("flowOutput")),
  NetworkOutput: S.optional(BridgeNetworkOutput).pipe(
    T.JsonName("networkOutput"),
  ),
}) {}
export const __listOfBridgeOutput = S.Array(BridgeOutput);
export class BridgeFlowSource extends S.Class<BridgeFlowSource>(
  "BridgeFlowSource",
)({
  FlowArn: S.String.pipe(T.JsonName("flowArn")),
  FlowVpcInterfaceAttachment: S.optional(VpcInterfaceAttachment).pipe(
    T.JsonName("flowVpcInterfaceAttachment"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  OutputArn: S.optional(S.String).pipe(T.JsonName("outputArn")),
}) {}
export class BridgeNetworkSource extends S.Class<BridgeNetworkSource>(
  "BridgeNetworkSource",
)({
  MulticastIp: S.String.pipe(T.JsonName("multicastIp")),
  MulticastSourceSettings: S.optional(MulticastSourceSettings).pipe(
    T.JsonName("multicastSourceSettings"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  NetworkName: S.String.pipe(T.JsonName("networkName")),
  Port: S.Number.pipe(T.JsonName("port")),
  Protocol: S.String.pipe(T.JsonName("protocol")),
}) {}
export class BridgeSource extends S.Class<BridgeSource>("BridgeSource")({
  FlowSource: S.optional(BridgeFlowSource).pipe(T.JsonName("flowSource")),
  NetworkSource: S.optional(BridgeNetworkSource).pipe(
    T.JsonName("networkSource"),
  ),
}) {}
export const __listOfBridgeSource = S.Array(BridgeSource);
export class Bridge extends S.Class<Bridge>("Bridge")({
  BridgeArn: S.String.pipe(T.JsonName("bridgeArn")),
  BridgeMessages: S.optional(__listOfMessageDetail).pipe(
    T.JsonName("bridgeMessages"),
  ),
  BridgeState: S.String.pipe(T.JsonName("bridgeState")),
  EgressGatewayBridge: S.optional(EgressGatewayBridge).pipe(
    T.JsonName("egressGatewayBridge"),
  ),
  IngressGatewayBridge: S.optional(IngressGatewayBridge).pipe(
    T.JsonName("ingressGatewayBridge"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  Outputs: S.optional(__listOfBridgeOutput).pipe(T.JsonName("outputs")),
  PlacementArn: S.String.pipe(T.JsonName("placementArn")),
  SourceFailoverConfig: S.optional(FailoverConfig).pipe(
    T.JsonName("sourceFailoverConfig"),
  ),
  Sources: S.optional(__listOfBridgeSource).pipe(T.JsonName("sources")),
}) {}
export class UpdateBridgeResponse extends S.Class<UpdateBridgeResponse>(
  "UpdateBridgeResponse",
)({ Bridge: S.optional(Bridge).pipe(T.JsonName("bridge")) }) {}
export class ListBridgesResponse extends S.Class<ListBridgesResponse>(
  "ListBridgesResponse",
)({
  Bridges: S.optional(__listOfListedBridge).pipe(T.JsonName("bridges")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class UpdateBridgeOutputResponse extends S.Class<UpdateBridgeOutputResponse>(
  "UpdateBridgeOutputResponse",
)({
  BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
  Output: S.optional(BridgeOutput).pipe(T.JsonName("output")),
}) {}
export class UpdateBridgeSourceRequest extends S.Class<UpdateBridgeSourceRequest>(
  "UpdateBridgeSourceRequest",
)(
  {
    BridgeArn: S.String.pipe(T.HttpLabel("BridgeArn")),
    FlowSource: S.optional(UpdateBridgeFlowSourceRequest).pipe(
      T.JsonName("flowSource"),
    ),
    NetworkSource: S.optional(UpdateBridgeNetworkSourceRequest).pipe(
      T.JsonName("networkSource"),
    ),
    SourceName: S.String.pipe(T.HttpLabel("SourceName")),
  },
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
) {}
export class Fmtp extends S.Class<Fmtp>("Fmtp")({
  ChannelOrder: S.optional(S.String).pipe(T.JsonName("channelOrder")),
  Colorimetry: S.optional(S.String).pipe(T.JsonName("colorimetry")),
  ExactFramerate: S.optional(S.String).pipe(T.JsonName("exactFramerate")),
  Par: S.optional(S.String).pipe(T.JsonName("par")),
  Range: S.optional(S.String).pipe(T.JsonName("range")),
  ScanMode: S.optional(S.String).pipe(T.JsonName("scanMode")),
  Tcs: S.optional(S.String).pipe(T.JsonName("tcs")),
}) {}
export class MediaStreamAttributes extends S.Class<MediaStreamAttributes>(
  "MediaStreamAttributes",
)({
  Fmtp: Fmtp.pipe(T.JsonName("fmtp")),
  Lang: S.optional(S.String).pipe(T.JsonName("lang")),
}) {}
export class MediaStream extends S.Class<MediaStream>("MediaStream")({
  Attributes: S.optional(MediaStreamAttributes).pipe(T.JsonName("attributes")),
  ClockRate: S.optional(S.Number).pipe(T.JsonName("clockRate")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Fmt: S.Number.pipe(T.JsonName("fmt")),
  MediaStreamId: S.Number.pipe(T.JsonName("mediaStreamId")),
  MediaStreamName: S.String.pipe(T.JsonName("mediaStreamName")),
  MediaStreamType: S.String.pipe(T.JsonName("mediaStreamType")),
  VideoFormat: S.optional(S.String).pipe(T.JsonName("videoFormat")),
}) {}
export const __listOfMediaStream = S.Array(MediaStream);
export class Interface extends S.Class<Interface>("Interface")({
  Name: S.String.pipe(T.JsonName("name")),
}) {}
export class DestinationConfiguration extends S.Class<DestinationConfiguration>(
  "DestinationConfiguration",
)({
  DestinationIp: S.String.pipe(T.JsonName("destinationIp")),
  DestinationPort: S.Number.pipe(T.JsonName("destinationPort")),
  Interface: Interface.pipe(T.JsonName("interface")),
  OutboundIp: S.String.pipe(T.JsonName("outboundIp")),
}) {}
export const __listOfDestinationConfiguration = S.Array(
  DestinationConfiguration,
);
export class EncodingParameters extends S.Class<EncodingParameters>(
  "EncodingParameters",
)({
  CompressionFactor: S.Number.pipe(T.JsonName("compressionFactor")),
  EncoderProfile: S.String.pipe(T.JsonName("encoderProfile")),
}) {}
export class MediaStreamOutputConfiguration extends S.Class<MediaStreamOutputConfiguration>(
  "MediaStreamOutputConfiguration",
)({
  DestinationConfigurations: S.optional(__listOfDestinationConfiguration).pipe(
    T.JsonName("destinationConfigurations"),
  ),
  EncodingName: S.String.pipe(T.JsonName("encodingName")),
  EncodingParameters: S.optional(EncodingParameters).pipe(
    T.JsonName("encodingParameters"),
  ),
  MediaStreamName: S.String.pipe(T.JsonName("mediaStreamName")),
}) {}
export const __listOfMediaStreamOutputConfiguration = S.Array(
  MediaStreamOutputConfiguration,
);
export class Transport extends S.Class<Transport>("Transport")({
  CidrAllowList: S.optional(__listOfString).pipe(T.JsonName("cidrAllowList")),
  MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
  MaxLatency: S.optional(S.Number).pipe(T.JsonName("maxLatency")),
  MaxSyncBuffer: S.optional(S.Number).pipe(T.JsonName("maxSyncBuffer")),
  MinLatency: S.optional(S.Number).pipe(T.JsonName("minLatency")),
  Protocol: S.String.pipe(T.JsonName("protocol")),
  RemoteId: S.optional(S.String).pipe(T.JsonName("remoteId")),
  SenderControlPort: S.optional(S.Number).pipe(T.JsonName("senderControlPort")),
  SenderIpAddress: S.optional(S.String).pipe(T.JsonName("senderIpAddress")),
  SmoothingLatency: S.optional(S.Number).pipe(T.JsonName("smoothingLatency")),
  SourceListenerAddress: S.optional(S.String).pipe(
    T.JsonName("sourceListenerAddress"),
  ),
  SourceListenerPort: S.optional(S.Number).pipe(
    T.JsonName("sourceListenerPort"),
  ),
  StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
  NdiSpeedHqQuality: S.optional(S.Number).pipe(T.JsonName("ndiSpeedHqQuality")),
  NdiProgramName: S.optional(S.String).pipe(T.JsonName("ndiProgramName")),
}) {}
export class Output extends S.Class<Output>("Output")({
  DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
    T.JsonName("dataTransferSubscriberFeePercent"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Destination: S.optional(S.String).pipe(T.JsonName("destination")),
  Encryption: S.optional(Encryption).pipe(T.JsonName("encryption")),
  EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
  ListenerAddress: S.optional(S.String).pipe(T.JsonName("listenerAddress")),
  MediaLiveInputArn: S.optional(S.String).pipe(T.JsonName("mediaLiveInputArn")),
  MediaStreamOutputConfigurations: S.optional(
    __listOfMediaStreamOutputConfiguration,
  ).pipe(T.JsonName("mediaStreamOutputConfigurations")),
  Name: S.String.pipe(T.JsonName("name")),
  OutputArn: S.String.pipe(T.JsonName("outputArn")),
  Port: S.optional(S.Number).pipe(T.JsonName("port")),
  Transport: S.optional(Transport).pipe(T.JsonName("transport")),
  VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment).pipe(
    T.JsonName("vpcInterfaceAttachment"),
  ),
  BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
  BridgePorts: S.optional(__listOfInteger).pipe(T.JsonName("bridgePorts")),
  OutputStatus: S.optional(S.String).pipe(T.JsonName("outputStatus")),
  PeerIpAddress: S.optional(S.String).pipe(T.JsonName("peerIpAddress")),
  RouterIntegrationState: S.optional(S.String).pipe(
    T.JsonName("routerIntegrationState"),
  ),
  RouterIntegrationTransitEncryption: S.optional(FlowTransitEncryption).pipe(
    T.JsonName("routerIntegrationTransitEncryption"),
  ),
  ConnectedRouterInputArn: S.optional(S.String).pipe(
    T.JsonName("connectedRouterInputArn"),
  ),
}) {}
export const __listOfOutput = S.Array(Output);
export class InputConfiguration extends S.Class<InputConfiguration>(
  "InputConfiguration",
)({
  InputIp: S.String.pipe(T.JsonName("inputIp")),
  InputPort: S.Number.pipe(T.JsonName("inputPort")),
  Interface: Interface.pipe(T.JsonName("interface")),
}) {}
export const __listOfInputConfiguration = S.Array(InputConfiguration);
export class MediaStreamSourceConfiguration extends S.Class<MediaStreamSourceConfiguration>(
  "MediaStreamSourceConfiguration",
)({
  EncodingName: S.String.pipe(T.JsonName("encodingName")),
  InputConfigurations: S.optional(__listOfInputConfiguration).pipe(
    T.JsonName("inputConfigurations"),
  ),
  MediaStreamName: S.String.pipe(T.JsonName("mediaStreamName")),
}) {}
export const __listOfMediaStreamSourceConfiguration = S.Array(
  MediaStreamSourceConfiguration,
);
export class GatewayBridgeSource extends S.Class<GatewayBridgeSource>(
  "GatewayBridgeSource",
)({
  BridgeArn: S.String.pipe(T.JsonName("bridgeArn")),
  VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment).pipe(
    T.JsonName("vpcInterfaceAttachment"),
  ),
}) {}
export class Source extends S.Class<Source>("Source")({
  DataTransferSubscriberFeePercent: S.optional(S.Number).pipe(
    T.JsonName("dataTransferSubscriberFeePercent"),
  ),
  Decryption: S.optional(Encryption).pipe(T.JsonName("decryption")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
  IngestIp: S.optional(S.String).pipe(T.JsonName("ingestIp")),
  IngestPort: S.optional(S.Number).pipe(T.JsonName("ingestPort")),
  MediaStreamSourceConfigurations: S.optional(
    __listOfMediaStreamSourceConfiguration,
  ).pipe(T.JsonName("mediaStreamSourceConfigurations")),
  Name: S.String.pipe(T.JsonName("name")),
  SenderControlPort: S.optional(S.Number).pipe(T.JsonName("senderControlPort")),
  SenderIpAddress: S.optional(S.String).pipe(T.JsonName("senderIpAddress")),
  SourceArn: S.String.pipe(T.JsonName("sourceArn")),
  Transport: S.optional(Transport).pipe(T.JsonName("transport")),
  VpcInterfaceName: S.optional(S.String).pipe(T.JsonName("vpcInterfaceName")),
  WhitelistCidr: S.optional(S.String).pipe(T.JsonName("whitelistCidr")),
  GatewayBridgeSource: S.optional(GatewayBridgeSource).pipe(
    T.JsonName("gatewayBridgeSource"),
  ),
  PeerIpAddress: S.optional(S.String).pipe(T.JsonName("peerIpAddress")),
  RouterIntegrationState: S.optional(S.String).pipe(
    T.JsonName("routerIntegrationState"),
  ),
  RouterIntegrationTransitDecryption: S.optional(FlowTransitEncryption).pipe(
    T.JsonName("routerIntegrationTransitDecryption"),
  ),
  ConnectedRouterOutputArn: S.optional(S.String).pipe(
    T.JsonName("connectedRouterOutputArn"),
  ),
}) {}
export const __listOfSource = S.Array(Source);
export class Flow extends S.Class<Flow>("Flow")({
  AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EgressIp: S.optional(S.String).pipe(T.JsonName("egressIp")),
  Entitlements: __listOfEntitlement.pipe(T.JsonName("entitlements")),
  FlowArn: S.String.pipe(T.JsonName("flowArn")),
  MediaStreams: S.optional(__listOfMediaStream).pipe(
    T.JsonName("mediaStreams"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  Outputs: __listOfOutput.pipe(T.JsonName("outputs")),
  Source: Source.pipe(T.JsonName("source")),
  SourceFailoverConfig: S.optional(FailoverConfig).pipe(
    T.JsonName("sourceFailoverConfig"),
  ),
  Sources: S.optional(__listOfSource).pipe(T.JsonName("sources")),
  Status: S.String.pipe(T.JsonName("status")),
  VpcInterfaces: S.optional(__listOfVpcInterface).pipe(
    T.JsonName("vpcInterfaces"),
  ),
  Maintenance: S.optional(Maintenance).pipe(T.JsonName("maintenance")),
  SourceMonitoringConfig: S.optional(MonitoringConfig).pipe(
    T.JsonName("sourceMonitoringConfig"),
  ),
  FlowSize: S.optional(S.String).pipe(T.JsonName("flowSize")),
  NdiConfig: S.optional(NdiConfig).pipe(T.JsonName("ndiConfig")),
}) {}
export class UpdateFlowResponse extends S.Class<UpdateFlowResponse>(
  "UpdateFlowResponse",
)({ Flow: S.optional(Flow).pipe(T.JsonName("flow")) }) {}
export class ListFlowsResponse extends S.Class<ListFlowsResponse>(
  "ListFlowsResponse",
)({
  Flows: S.optional(__listOfListedFlow).pipe(T.JsonName("flows")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class AddFlowVpcInterfacesResponse extends S.Class<AddFlowVpcInterfacesResponse>(
  "AddFlowVpcInterfacesResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  VpcInterfaces: S.optional(__listOfVpcInterface).pipe(
    T.JsonName("vpcInterfaces"),
  ),
}) {}
export class DescribeFlowSourceThumbnailResponse extends S.Class<DescribeFlowSourceThumbnailResponse>(
  "DescribeFlowSourceThumbnailResponse",
)({
  ThumbnailDetails: S.optional(ThumbnailDetails).pipe(
    T.JsonName("thumbnailDetails"),
  ),
}) {}
export class GrantFlowEntitlementsResponse extends S.Class<GrantFlowEntitlementsResponse>(
  "GrantFlowEntitlementsResponse",
)({
  Entitlements: S.optional(__listOfEntitlement).pipe(
    T.JsonName("entitlements"),
  ),
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
}) {}
export class UpdateFlowEntitlementResponse extends S.Class<UpdateFlowEntitlementResponse>(
  "UpdateFlowEntitlementResponse",
)({
  Entitlement: S.optional(Entitlement).pipe(T.JsonName("entitlement")),
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
}) {}
export class UpdateFlowMediaStreamRequest extends S.Class<UpdateFlowMediaStreamRequest>(
  "UpdateFlowMediaStreamRequest",
)(
  {
    Attributes: S.optional(MediaStreamAttributesRequest).pipe(
      T.JsonName("attributes"),
    ),
    ClockRate: S.optional(S.Number).pipe(T.JsonName("clockRate")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    MediaStreamName: S.String.pipe(T.HttpLabel("MediaStreamName")),
    MediaStreamType: S.optional(S.String).pipe(T.JsonName("mediaStreamType")),
    VideoFormat: S.optional(S.String).pipe(T.JsonName("videoFormat")),
  },
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
) {}
export class UpdateFlowSourceRequest extends S.Class<UpdateFlowSourceRequest>(
  "UpdateFlowSourceRequest",
)(
  {
    Decryption: S.optional(UpdateEncryption).pipe(T.JsonName("decryption")),
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
    Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
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
    GatewayBridgeSource: S.optional(UpdateGatewayBridgeSourceRequest).pipe(
      T.JsonName("gatewayBridgeSource"),
    ),
    RouterIntegrationState: S.optional(S.String).pipe(
      T.JsonName("routerIntegrationState"),
    ),
    RouterIntegrationTransitDecryption: S.optional(FlowTransitEncryption).pipe(
      T.JsonName("routerIntegrationTransitDecryption"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/flows/{FlowArn}/source/{SourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGatewayInstanceResponse extends S.Class<DescribeGatewayInstanceResponse>(
  "DescribeGatewayInstanceResponse",
)({
  GatewayInstance: S.optional(GatewayInstance).pipe(
    T.JsonName("gatewayInstance"),
  ),
}) {}
export class ListGatewayInstancesResponse extends S.Class<ListGatewayInstancesResponse>(
  "ListGatewayInstancesResponse",
)({
  Instances: S.optional(__listOfListedGatewayInstance).pipe(
    T.JsonName("instances"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class CreateGatewayResponse extends S.Class<CreateGatewayResponse>(
  "CreateGatewayResponse",
)({ Gateway: S.optional(Gateway).pipe(T.JsonName("gateway")) }) {}
export class DescribeGatewayResponse extends S.Class<DescribeGatewayResponse>(
  "DescribeGatewayResponse",
)({ Gateway: S.optional(Gateway).pipe(T.JsonName("gateway")) }) {}
export class ListGatewaysResponse extends S.Class<ListGatewaysResponse>(
  "ListGatewaysResponse",
)({
  Gateways: S.optional(__listOfListedGateway).pipe(T.JsonName("gateways")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class PurchaseOfferingResponse extends S.Class<PurchaseOfferingResponse>(
  "PurchaseOfferingResponse",
)({ Reservation: S.optional(Reservation).pipe(T.JsonName("reservation")) }) {}
export class GetRouterInputThumbnailResponse extends S.Class<GetRouterInputThumbnailResponse>(
  "GetRouterInputThumbnailResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  ThumbnailDetails: RouterInputThumbnailDetails.pipe(
    T.JsonName("thumbnailDetails"),
  ),
}) {}
export class BatchGetRouterInputResponse extends S.Class<BatchGetRouterInputResponse>(
  "BatchGetRouterInputResponse",
)({
  RouterInputs: RouterInputList.pipe(T.JsonName("routerInputs")),
  Errors: BatchGetRouterInputErrorList.pipe(T.JsonName("errors")),
}) {}
export class GetRouterNetworkInterfaceResponse extends S.Class<GetRouterNetworkInterfaceResponse>(
  "GetRouterNetworkInterfaceResponse",
)({
  RouterNetworkInterface: RouterNetworkInterface.pipe(
    T.JsonName("routerNetworkInterface"),
  ),
}) {}
export class BatchGetRouterNetworkInterfaceResponse extends S.Class<BatchGetRouterNetworkInterfaceResponse>(
  "BatchGetRouterNetworkInterfaceResponse",
)({
  RouterNetworkInterfaces: RouterNetworkInterfaceList.pipe(
    T.JsonName("routerNetworkInterfaces"),
  ),
  Errors: BatchGetRouterNetworkInterfaceErrorList.pipe(T.JsonName("errors")),
}) {}
export class BatchGetRouterOutputResponse extends S.Class<BatchGetRouterOutputResponse>(
  "BatchGetRouterOutputResponse",
)({
  RouterOutputs: RouterOutputList.pipe(T.JsonName("routerOutputs")),
  Errors: BatchGetRouterOutputErrorList.pipe(T.JsonName("errors")),
}) {}
export class FrameResolution extends S.Class<FrameResolution>(
  "FrameResolution",
)({
  FrameHeight: S.Number.pipe(T.JsonName("frameHeight")),
  FrameWidth: S.Number.pipe(T.JsonName("frameWidth")),
}) {}
export class TransportStream extends S.Class<TransportStream>(
  "TransportStream",
)({
  Channels: S.optional(S.Number).pipe(T.JsonName("channels")),
  Codec: S.optional(S.String).pipe(T.JsonName("codec")),
  FrameRate: S.optional(S.String).pipe(T.JsonName("frameRate")),
  FrameResolution: S.optional(FrameResolution).pipe(
    T.JsonName("frameResolution"),
  ),
  Pid: S.Number.pipe(T.JsonName("pid")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  SampleSize: S.optional(S.Number).pipe(T.JsonName("sampleSize")),
  StreamType: S.String.pipe(T.JsonName("streamType")),
}) {}
export const __listOfTransportStream = S.Array(TransportStream);
export class TransportStreamProgram extends S.Class<TransportStreamProgram>(
  "TransportStreamProgram",
)({
  PcrPid: S.Number.pipe(T.JsonName("pcrPid")),
  ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
  ProgramNumber: S.Number.pipe(T.JsonName("programNumber")),
  ProgramPid: S.Number.pipe(T.JsonName("programPid")),
  Streams: __listOfTransportStream.pipe(T.JsonName("streams")),
}) {}
export const __listOfTransportStreamProgram = S.Array(TransportStreamProgram);
export class TransportMediaInfo extends S.Class<TransportMediaInfo>(
  "TransportMediaInfo",
)({ Programs: __listOfTransportStreamProgram.pipe(T.JsonName("programs")) }) {}
export const RouterInputMetadata = S.Union(
  S.Struct({
    TransportStreamMediaInfo: TransportMediaInfo.pipe(
      T.JsonName("transportStreamMediaInfo"),
    ),
  }),
);
export class ListedRouterInput extends S.Class<ListedRouterInput>(
  "ListedRouterInput",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Arn: S.String.pipe(T.JsonName("arn")),
  Id: S.String.pipe(T.JsonName("id")),
  InputType: S.String.pipe(T.JsonName("inputType")),
  State: S.String.pipe(T.JsonName("state")),
  RoutedOutputs: S.Number.pipe(T.JsonName("routedOutputs")),
  RegionName: S.String.pipe(T.JsonName("regionName")),
  AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
  MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
  RoutingScope: S.String.pipe(T.JsonName("routingScope")),
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
  MaintenanceScheduleType: S.optional(S.String).pipe(
    T.JsonName("maintenanceScheduleType"),
  ),
  MaintenanceSchedule: S.optional(MaintenanceSchedule).pipe(
    T.JsonName("maintenanceSchedule"),
  ),
}) {}
export const ListedRouterInputList = S.Array(ListedRouterInput);
export class RouterInputSourceMetadataDetails extends S.Class<RouterInputSourceMetadataDetails>(
  "RouterInputSourceMetadataDetails",
)({
  SourceMetadataMessages: RouterInputMessages.pipe(
    T.JsonName("sourceMetadataMessages"),
  ),
  Timestamp: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("timestamp"),
  ),
  RouterInputMetadata: S.optional(RouterInputMetadata).pipe(
    T.JsonName("routerInputMetadata"),
  ),
}) {}
export class ListedRouterNetworkInterface extends S.Class<ListedRouterNetworkInterface>(
  "ListedRouterNetworkInterface",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Arn: S.String.pipe(T.JsonName("arn")),
  Id: S.String.pipe(T.JsonName("id")),
  NetworkInterfaceType: S.String.pipe(T.JsonName("networkInterfaceType")),
  AssociatedOutputCount: S.Number.pipe(T.JsonName("associatedOutputCount")),
  AssociatedInputCount: S.Number.pipe(T.JsonName("associatedInputCount")),
  State: S.String.pipe(T.JsonName("state")),
  RegionName: S.String.pipe(T.JsonName("regionName")),
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("createdAt"),
  ),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export const ListedRouterNetworkInterfaceList = S.Array(
  ListedRouterNetworkInterface,
);
export class ListedRouterOutput extends S.Class<ListedRouterOutput>(
  "ListedRouterOutput",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Arn: S.String.pipe(T.JsonName("arn")),
  Id: S.String.pipe(T.JsonName("id")),
  OutputType: S.String.pipe(T.JsonName("outputType")),
  State: S.String.pipe(T.JsonName("state")),
  RoutedState: S.String.pipe(T.JsonName("routedState")),
  RegionName: S.String.pipe(T.JsonName("regionName")),
  AvailabilityZone: S.String.pipe(T.JsonName("availabilityZone")),
  MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
  RoutingScope: S.String.pipe(T.JsonName("routingScope")),
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
  MaintenanceScheduleType: S.optional(S.String).pipe(
    T.JsonName("maintenanceScheduleType"),
  ),
  MaintenanceSchedule: S.optional(MaintenanceSchedule).pipe(
    T.JsonName("maintenanceSchedule"),
  ),
}) {}
export const ListedRouterOutputList = S.Array(ListedRouterOutput);
export class CreateBridgeResponse extends S.Class<CreateBridgeResponse>(
  "CreateBridgeResponse",
)({ Bridge: S.optional(Bridge).pipe(T.JsonName("bridge")) }) {}
export class DescribeBridgeResponse extends S.Class<DescribeBridgeResponse>(
  "DescribeBridgeResponse",
)({ Bridge: S.optional(Bridge).pipe(T.JsonName("bridge")) }) {}
export class AddBridgeOutputsResponse extends S.Class<AddBridgeOutputsResponse>(
  "AddBridgeOutputsResponse",
)({
  BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
  Outputs: S.optional(__listOfBridgeOutput).pipe(T.JsonName("outputs")),
}) {}
export class AddBridgeSourcesResponse extends S.Class<AddBridgeSourcesResponse>(
  "AddBridgeSourcesResponse",
)({
  BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
  Sources: S.optional(__listOfBridgeSource).pipe(T.JsonName("sources")),
}) {}
export class UpdateBridgeSourceResponse extends S.Class<UpdateBridgeSourceResponse>(
  "UpdateBridgeSourceResponse",
)({
  BridgeArn: S.optional(S.String).pipe(T.JsonName("bridgeArn")),
  Source: S.optional(BridgeSource).pipe(T.JsonName("source")),
}) {}
export class CreateFlowRequest extends S.Class<CreateFlowRequest>(
  "CreateFlowRequest",
)(
  {
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    Entitlements: S.optional(__listOfGrantEntitlementRequest).pipe(
      T.JsonName("entitlements"),
    ),
    MediaStreams: S.optional(__listOfAddMediaStreamRequest).pipe(
      T.JsonName("mediaStreams"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
    Outputs: S.optional(__listOfAddOutputRequest).pipe(T.JsonName("outputs")),
    Source: S.optional(SetSourceRequest).pipe(T.JsonName("source")),
    SourceFailoverConfig: S.optional(FailoverConfig).pipe(
      T.JsonName("sourceFailoverConfig"),
    ),
    Sources: S.optional(__listOfSetSourceRequest).pipe(T.JsonName("sources")),
    VpcInterfaces: S.optional(__listOfVpcInterfaceRequest).pipe(
      T.JsonName("vpcInterfaces"),
    ),
    Maintenance: S.optional(AddMaintenance).pipe(T.JsonName("maintenance")),
    SourceMonitoringConfig: S.optional(MonitoringConfig).pipe(
      T.JsonName("sourceMonitoringConfig"),
    ),
    FlowSize: S.optional(S.String).pipe(T.JsonName("flowSize")),
    NdiConfig: S.optional(NdiConfig).pipe(T.JsonName("ndiConfig")),
    FlowTags: S.optional(__mapOfString).pipe(T.JsonName("flowTags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/flows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFlowResponse extends S.Class<DescribeFlowResponse>(
  "DescribeFlowResponse",
)({
  Flow: S.optional(Flow).pipe(T.JsonName("flow")),
  Messages: S.optional(Messages).pipe(T.JsonName("messages")),
}) {}
export class UpdateFlowMediaStreamResponse extends S.Class<UpdateFlowMediaStreamResponse>(
  "UpdateFlowMediaStreamResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  MediaStream: S.optional(MediaStream).pipe(T.JsonName("mediaStream")),
}) {}
export class UpdateFlowOutputRequest extends S.Class<UpdateFlowOutputRequest>(
  "UpdateFlowOutputRequest",
)(
  {
    CidrAllowList: S.optional(__listOfString).pipe(T.JsonName("cidrAllowList")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Destination: S.optional(S.String).pipe(T.JsonName("destination")),
    Encryption: S.optional(UpdateEncryption).pipe(T.JsonName("encryption")),
    FlowArn: S.String.pipe(T.HttpLabel("FlowArn")),
    MaxLatency: S.optional(S.Number).pipe(T.JsonName("maxLatency")),
    MediaStreamOutputConfigurations: S.optional(
      __listOfMediaStreamOutputConfigurationRequest,
    ).pipe(T.JsonName("mediaStreamOutputConfigurations")),
    MinLatency: S.optional(S.Number).pipe(T.JsonName("minLatency")),
    OutputArn: S.String.pipe(T.HttpLabel("OutputArn")),
    Port: S.optional(S.Number).pipe(T.JsonName("port")),
    Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
    RemoteId: S.optional(S.String).pipe(T.JsonName("remoteId")),
    SenderControlPort: S.optional(S.Number).pipe(
      T.JsonName("senderControlPort"),
    ),
    SenderIpAddress: S.optional(S.String).pipe(T.JsonName("senderIpAddress")),
    SmoothingLatency: S.optional(S.Number).pipe(T.JsonName("smoothingLatency")),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
    VpcInterfaceAttachment: S.optional(VpcInterfaceAttachment).pipe(
      T.JsonName("vpcInterfaceAttachment"),
    ),
    OutputStatus: S.optional(S.String).pipe(T.JsonName("outputStatus")),
    NdiProgramName: S.optional(S.String).pipe(T.JsonName("ndiProgramName")),
    NdiSpeedHqQuality: S.optional(S.Number).pipe(
      T.JsonName("ndiSpeedHqQuality"),
    ),
    RouterIntegrationState: S.optional(S.String).pipe(
      T.JsonName("routerIntegrationState"),
    ),
    RouterIntegrationTransitEncryption: S.optional(FlowTransitEncryption).pipe(
      T.JsonName("routerIntegrationTransitEncryption"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/flows/{FlowArn}/outputs/{OutputArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFlowSourceResponse extends S.Class<UpdateFlowSourceResponse>(
  "UpdateFlowSourceResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  Source: S.optional(Source).pipe(T.JsonName("source")),
}) {}
export class DescribeOfferingResponse extends S.Class<DescribeOfferingResponse>(
  "DescribeOfferingResponse",
)({ Offering: S.optional(Offering).pipe(T.JsonName("offering")) }) {}
export class ListRouterInputsResponse extends S.Class<ListRouterInputsResponse>(
  "ListRouterInputsResponse",
)({
  RouterInputs: ListedRouterInputList.pipe(T.JsonName("routerInputs")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetRouterInputSourceMetadataResponse extends S.Class<GetRouterInputSourceMetadataResponse>(
  "GetRouterInputSourceMetadataResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  SourceMetadataDetails: RouterInputSourceMetadataDetails.pipe(
    T.JsonName("sourceMetadataDetails"),
  ),
}) {}
export class StartRouterInputResponse extends S.Class<StartRouterInputResponse>(
  "StartRouterInputResponse",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.String.pipe(T.JsonName("name")),
  State: S.String.pipe(T.JsonName("state")),
  MaintenanceScheduleType: S.String.pipe(T.JsonName("maintenanceScheduleType")),
  MaintenanceSchedule: MaintenanceSchedule.pipe(
    T.JsonName("maintenanceSchedule"),
  ),
}) {}
export class CreateRouterNetworkInterfaceRequest extends S.Class<CreateRouterNetworkInterfaceRequest>(
  "CreateRouterNetworkInterfaceRequest",
)(
  {
    Name: S.String.pipe(T.JsonName("name")),
    Configuration: RouterNetworkInterfaceConfiguration.pipe(
      T.JsonName("configuration"),
    ),
    RegionName: S.optional(S.String).pipe(T.JsonName("regionName")),
    Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerNetworkInterface" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRouterNetworkInterfacesResponse extends S.Class<ListRouterNetworkInterfacesResponse>(
  "ListRouterNetworkInterfacesResponse",
)({
  RouterNetworkInterfaces: ListedRouterNetworkInterfaceList.pipe(
    T.JsonName("routerNetworkInterfaces"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListRouterOutputsResponse extends S.Class<ListRouterOutputsResponse>(
  "ListRouterOutputsResponse",
)({
  RouterOutputs: ListedRouterOutputList.pipe(T.JsonName("routerOutputs")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class CreateFlowResponse extends S.Class<CreateFlowResponse>(
  "CreateFlowResponse",
)({ Flow: S.optional(Flow).pipe(T.JsonName("flow")) }) {}
export class AddFlowMediaStreamsResponse extends S.Class<AddFlowMediaStreamsResponse>(
  "AddFlowMediaStreamsResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  MediaStreams: S.optional(__listOfMediaStream).pipe(
    T.JsonName("mediaStreams"),
  ),
}) {}
export class AddFlowSourcesResponse extends S.Class<AddFlowSourcesResponse>(
  "AddFlowSourcesResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  Sources: S.optional(__listOfSource).pipe(T.JsonName("sources")),
}) {}
export class UpdateFlowOutputResponse extends S.Class<UpdateFlowOutputResponse>(
  "UpdateFlowOutputResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  Output: S.optional(Output).pipe(T.JsonName("output")),
}) {}
export class CreateRouterNetworkInterfaceResponse extends S.Class<CreateRouterNetworkInterfaceResponse>(
  "CreateRouterNetworkInterfaceResponse",
)({
  RouterNetworkInterface: RouterNetworkInterface.pipe(
    T.JsonName("routerNetworkInterface"),
  ),
}) {}
export class GetRouterOutputResponse extends S.Class<GetRouterOutputResponse>(
  "GetRouterOutputResponse",
)({ RouterOutput: RouterOutput.pipe(T.JsonName("routerOutput")) }) {}
export class AddFlowOutputsResponse extends S.Class<AddFlowOutputsResponse>(
  "AddFlowOutputsResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  Outputs: S.optional(__listOfOutput).pipe(T.JsonName("outputs")),
}) {}
export class DescribeFlowSourceMetadataResponse extends S.Class<DescribeFlowSourceMetadataResponse>(
  "DescribeFlowSourceMetadataResponse",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  Messages: S.optional(__listOfMessageDetail).pipe(T.JsonName("messages")),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("timestamp"),
  ),
  TransportMediaInfo: S.optional(TransportMediaInfo).pipe(
    T.JsonName("transportMediaInfo"),
  ),
}) {}
export class CreateRouterInputRequest extends S.Class<CreateRouterInputRequest>(
  "CreateRouterInputRequest",
)(
  {
    Name: S.String.pipe(T.JsonName("name")),
    Configuration: RouterInputConfiguration.pipe(T.JsonName("configuration")),
    MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
    RoutingScope: S.String.pipe(T.JsonName("routingScope")),
    Tier: S.String.pipe(T.JsonName("tier")),
    RegionName: S.optional(S.String).pipe(T.JsonName("regionName")),
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    TransitEncryption: S.optional(RouterInputTransitEncryption).pipe(
      T.JsonName("transitEncryption"),
    ),
    MaintenanceConfiguration: S.optional(MaintenanceConfiguration).pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
    Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerInput" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouterInputResponse extends S.Class<GetRouterInputResponse>(
  "GetRouterInputResponse",
)({ RouterInput: RouterInput.pipe(T.JsonName("routerInput")) }) {}
export class CreateRouterOutputRequest extends S.Class<CreateRouterOutputRequest>(
  "CreateRouterOutputRequest",
)(
  {
    Name: S.String.pipe(T.JsonName("name")),
    Configuration: RouterOutputConfiguration.pipe(T.JsonName("configuration")),
    MaximumBitrate: S.Number.pipe(T.JsonName("maximumBitrate")),
    RoutingScope: S.String.pipe(T.JsonName("routingScope")),
    Tier: S.String.pipe(T.JsonName("tier")),
    RegionName: S.optional(S.String).pipe(T.JsonName("regionName")),
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    MaintenanceConfiguration: S.optional(MaintenanceConfiguration).pipe(
      T.JsonName("maintenanceConfiguration"),
    ),
    Tags: S.optional(__mapOfString).pipe(T.JsonName("tags")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/routerOutput" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRouterInputResponse extends S.Class<CreateRouterInputResponse>(
  "CreateRouterInputResponse",
)({ RouterInput: RouterInput.pipe(T.JsonName("routerInput")) }) {}
export class CreateRouterOutputResponse extends S.Class<CreateRouterOutputResponse>(
  "CreateRouterOutputResponse",
)({ RouterOutput: RouterOutput.pipe(T.JsonName("routerOutput")) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class GrantFlowEntitlements420Exception extends S.TaggedError<GrantFlowEntitlements420Exception>()(
  "GrantFlowEntitlements420Exception",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class CreateGateway420Exception extends S.TaggedError<CreateGateway420Exception>()(
  "CreateGateway420Exception",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class CreateBridge420Exception extends S.TaggedError<CreateBridge420Exception>()(
  "CreateBridge420Exception",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class CreateFlow420Exception extends S.TaggedError<CreateFlow420Exception>()(
  "CreateFlow420Exception",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class RouterNetworkInterfaceServiceQuotaExceededException extends S.TaggedError<RouterNetworkInterfaceServiceQuotaExceededException>()(
  "RouterNetworkInterfaceServiceQuotaExceededException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class AddFlowOutputs420Exception extends S.TaggedError<AddFlowOutputs420Exception>()(
  "AddFlowOutputs420Exception",
  { Message: S.String.pipe(T.JsonName("message")) },
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagGlobalResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForGlobalResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTagsForGlobalResourceRequest,
    output: ListTagsForGlobalResourceResponse,
    errors: [
      BadRequestException,
      InternalServerErrorException,
      NotFoundException,
    ],
  }),
);
/**
 * List all tags on a MediaConnect resource in the current region.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagGlobalResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBridges = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBridgesRequest,
  output: ListBridgesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds media streams to an existing flow. After you add a media stream to a flow, you can associate it with a source and/or an output that uses the ST 2110 JPEG XS or CDI protocol.
 */
export const addFlowMediaStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addFlowSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFlowOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRouterOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addBridgeOutputs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addBridgeSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBridgeSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const grantFlowEntitlements = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates an existing media stream.
 */
export const updateFlowMediaStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the source of a flow.
 */
export const updateFlowSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeOffering = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listRouterInputs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRouterInputsRequest,
  output: ListRouterInputsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves detailed metadata information about a specific router input source, including stream details and connection state.
 */
export const getRouterInputSourceMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startRouterInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listRouterNetworkInterfaces = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRouterNetworkInterfacesRequest,
    output: ListRouterNetworkInterfacesResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalServerErrorException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves a list of router outputs in AWS Elemental MediaConnect.
 */
export const listRouterOutputs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRouterOutputsRequest,
  output: ListRouterOutputsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a flow. Before you can delete a flow, you must stop the flow.
 */
export const deleteFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addFlowVpcInterfaces = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Describes the thumbnail for the flow source.
 */
export const describeFlowSourceThumbnail = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates an entitlement. You can change an entitlement's description, subscribers, and encryption. If you change the subscribers, the service will remove the outputs that are are used by the subscribers that are removed.
 */
export const updateFlowEntitlement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Displays the details of an instance.
 */
export const describeGatewayInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Displays the details of a gateway. The response includes the gateway Amazon Resource Name (ARN), name, and CIDR blocks, as well as details about the networks.
 */
export const describeGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const purchaseOffering = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRouterInputThumbnail = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves information about a specific router network interface in AWS Elemental MediaConnect.
 */
export const getRouterNetworkInterface = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Displays the details of a reservation. The response includes the reservation name, state, start date and time, and the details of the offering that make up the rest of the reservation (such as price, duration, and outbound bandwidth).
 */
export const describeReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeBridgeOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeBridgeSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBridgeState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGatewayInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deregisters an instance. Before you deregister an instance, all bridges running on the instance must be stopped. If you want to deregister an instance without stopping the bridges, you must use the --force option.
 */
export const deregisterGatewayInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes a gateway. Before you can delete a gateway, you must deregister its instances and delete its bridges.
 */
export const deleteGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRouterInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRouterInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restartRouterInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopRouterInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRouterNetworkInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRouterOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRouterOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restartRouterOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startRouterOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopRouterOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const takeRouterInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBridge = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeFlowMediaStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Removes an output from an existing flow. This request can be made only on an output that does not have an entitlement associated with it. If the output has an entitlement, you must revoke the entitlement instead. When an entitlement is revoked from a flow, the service automatically removes the associated output.
 */
export const removeFlowOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeFlowSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeFlowVpcInterface = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Revokes an entitlement from a flow. Once an entitlement is revoked, the content becomes unavailable to the subscriber and the associated output is removed.
 */
export const revokeFlowEntitlement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Starts a flow.
 */
export const startFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBridge = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBridgeOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFlows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFlowsRequest,
  output: ListFlowsResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays a list of instances associated with the Amazon Web Services account. This request returns a paginated result. You can use the filterArn property to display only the instances associated with the selected Gateway Amazon Resource Name (ARN).
 */
export const listGatewayInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListGatewayInstancesRequest,
    output: ListGatewayInstancesResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalServerErrorException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Displays a list of gateways that are associated with this account. This request returns a paginated result.
 */
export const listGateways = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGatewaysRequest,
  output: ListGatewaysResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about multiple router inputs in AWS Elemental MediaConnect.
 */
export const batchGetRouterInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetRouterNetworkInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetRouterOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetRouterOutputRequest,
    output: BatchGetRouterOutputResponse,
    errors: [
      BadRequestException,
      ConflictException,
      InternalServerErrorException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Displays a list of all offerings that are available to this account in the current Amazon Web Services Region. If you have an active reservation (which means you've purchased an offering that has already started and hasn't expired yet), your account isn't eligible for other offerings.
 */
export const listOfferings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOfferingsRequest,
  output: ListOfferingsResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays a list of all reservations that have been purchased by this account in the current Amazon Web Services Region. This list includes all reservations in all states (such as active and expired).
 */
export const listReservations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReservationsRequest,
  output: ListReservationsResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays a list of all entitlements that have been granted to this account. This request returns 20 results per page.
 */
export const listEntitlements = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEntitlementsRequest,
  output: ListEntitlementsResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the configuration of an existing router network interface in AWS Elemental MediaConnect.
 */
export const updateRouterNetworkInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeBridge = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBridge = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFlowSourceMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves information about a specific router input in AWS Elemental MediaConnect.
 */
export const getRouterInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRouterNetworkInterface =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addFlowOutputs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRouterInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRouterOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
