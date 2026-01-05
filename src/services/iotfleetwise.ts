import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "IoTFleetWise",
  serviceShapeName: "IoTAutobahnControlPlane",
});
const auth = T.AwsAuthSigv4({ name: "iotfleetwise" });
const ver = T.ServiceVersion("2021-06-17");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://iotfleetwise-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://iotfleetwise-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://iotfleetwise.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://iotfleetwise.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetEncryptionConfigurationRequest extends S.Class<GetEncryptionConfigurationRequest>(
  "GetEncryptionConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/encryptionConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoggingOptionsRequest extends S.Class<GetLoggingOptionsRequest>(
  "GetLoggingOptionsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/loggingOptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRegisterAccountStatusRequest extends S.Class<GetRegisterAccountStatusRequest>(
  "GetRegisterAccountStatusRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/account/registration_status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagKeyList = S.Array(S.String);
export const DataExtraDimensionNodePathList = S.Array(S.String);
export const Fqns = S.Array(S.String);
export const InterfaceIds = S.Array(S.String);
export const listOfStrings = S.Array(S.String);
export const NodePaths = S.Array(S.String);
export const StateTemplateProperties = S.Array(S.String);
export const StateTemplateDataExtraDimensionNodePathList = S.Array(S.String);
export const StateTemplateMetadataExtraDimensionNodePathList = S.Array(
  S.String,
);
export const StateTemplateAssociationIdentifiers = S.Array(S.String);
export const attributeNamesList = S.Array(S.String);
export const attributeValuesList = S.Array(S.String);
export class GetEncryptionConfigurationResponse extends S.Class<GetEncryptionConfigurationResponse>(
  "GetEncryptionConfigurationResponse",
)({
  kmsKeyId: S.optional(S.String),
  encryptionStatus: S.String,
  encryptionType: S.String,
  errorMessage: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class GetVehicleStatusRequest extends S.Class<GetVehicleStatusRequest>(
  "GetVehicleStatusRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/vehicles/{vehicleName}/status" }),
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
  { ResourceARN: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class PutEncryptionConfigurationRequest extends S.Class<PutEncryptionConfigurationRequest>(
  "PutEncryptionConfigurationRequest",
)(
  { kmsKeyId: S.optional(S.String), encryptionType: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/encryptionConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CloudWatchLogDeliveryOptions extends S.Class<CloudWatchLogDeliveryOptions>(
  "CloudWatchLogDeliveryOptions",
)({ logType: S.String, logGroupName: S.optional(S.String) }) {}
export class PutLoggingOptionsRequest extends S.Class<PutLoggingOptionsRequest>(
  "PutLoggingOptionsRequest",
)(
  { cloudWatchLogDelivery: CloudWatchLogDeliveryOptions },
  T.all(
    T.Http({ method: "PUT", uri: "/loggingOptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutLoggingOptionsResponse extends S.Class<PutLoggingOptionsResponse>(
  "PutLoggingOptionsResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceARN: S.String.pipe(T.HttpQuery("resourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags" }),
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
export class GetCampaignRequest extends S.Class<GetCampaignRequest>(
  "GetCampaignRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "GET", uri: "/campaigns/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignRequest extends S.Class<UpdateCampaignRequest>(
  "UpdateCampaignRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    dataExtraDimensions: S.optional(DataExtraDimensionNodePathList),
    action: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/campaigns/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCampaignRequest extends S.Class<DeleteCampaignRequest>(
  "DeleteCampaignRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/campaigns/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCampaignsRequest extends S.Class<ListCampaignsRequest>(
  "ListCampaignsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    listResponseScope: S.optional(S.String).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/campaigns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDecoderManifestRequest extends S.Class<GetDecoderManifestRequest>(
  "GetDecoderManifestRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "GET", uri: "/decoder-manifests/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CanSignal extends S.Class<CanSignal>("CanSignal")({
  messageId: S.Number,
  isBigEndian: S.Boolean,
  isSigned: S.Boolean,
  startBit: S.Number,
  offset: S.Number,
  factor: S.Number,
  length: S.Number,
  name: S.optional(S.String),
  signalValueType: S.optional(S.String),
}) {}
export class ObdSignal extends S.Class<ObdSignal>("ObdSignal")({
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
  signalValueType: S.optional(S.String),
}) {}
export class ROS2PrimitiveMessageDefinition extends S.Class<ROS2PrimitiveMessageDefinition>(
  "ROS2PrimitiveMessageDefinition",
)({
  primitiveType: S.String,
  offset: S.optional(S.Number),
  scaling: S.optional(S.Number),
  upperBound: S.optional(S.Number),
}) {}
export const PrimitiveMessageDefinition = S.Union(
  S.Struct({ ros2PrimitiveMessageDefinition: ROS2PrimitiveMessageDefinition }),
);
export type StructuredMessage =
  | { primitiveMessageDefinition: (typeof PrimitiveMessageDefinition)["Type"] }
  | { structuredMessageListDefinition: StructuredMessageListDefinition }
  | { structuredMessageDefinition: StructuredMessageDefinition };
export const StructuredMessage = S.Union(
  S.Struct({ primitiveMessageDefinition: PrimitiveMessageDefinition }),
  S.Struct({
    structuredMessageListDefinition: S.suspend(
      (): S.Schema<StructuredMessageListDefinition, any> =>
        StructuredMessageListDefinition,
    ),
  }),
  S.Struct({
    structuredMessageDefinition: S.suspend(() => StructuredMessageDefinition),
  }),
) as any as S.Schema<StructuredMessage>;
export class MessageSignal extends S.Class<MessageSignal>("MessageSignal")({
  topicName: S.String,
  structuredMessage: StructuredMessage,
}) {}
export class CustomDecodingSignal extends S.Class<CustomDecodingSignal>(
  "CustomDecodingSignal",
)({ id: S.String }) {}
export class SignalDecoder extends S.Class<SignalDecoder>("SignalDecoder")({
  fullyQualifiedName: S.String,
  type: S.String,
  interfaceId: S.String,
  canSignal: S.optional(CanSignal),
  obdSignal: S.optional(ObdSignal),
  messageSignal: S.optional(MessageSignal),
  customDecodingSignal: S.optional(CustomDecodingSignal),
}) {}
export const SignalDecoders = S.Array(SignalDecoder);
export class CanInterface extends S.Class<CanInterface>("CanInterface")({
  name: S.String,
  protocolName: S.optional(S.String),
  protocolVersion: S.optional(S.String),
}) {}
export class ObdInterface extends S.Class<ObdInterface>("ObdInterface")({
  name: S.String,
  requestMessageId: S.Number,
  obdStandard: S.optional(S.String),
  pidRequestIntervalSeconds: S.optional(S.Number),
  dtcRequestIntervalSeconds: S.optional(S.Number),
  useExtendedIds: S.optional(S.Boolean),
  hasTransmissionEcu: S.optional(S.Boolean),
}) {}
export class VehicleMiddleware extends S.Class<VehicleMiddleware>(
  "VehicleMiddleware",
)({ name: S.String, protocolName: S.String }) {}
export class CustomDecodingInterface extends S.Class<CustomDecodingInterface>(
  "CustomDecodingInterface",
)({ name: S.String }) {}
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  interfaceId: S.String,
  type: S.String,
  canInterface: S.optional(CanInterface),
  obdInterface: S.optional(ObdInterface),
  vehicleMiddleware: S.optional(VehicleMiddleware),
  customDecodingInterface: S.optional(CustomDecodingInterface),
}) {}
export const NetworkInterfaces = S.Array(NetworkInterface);
export class UpdateDecoderManifestRequest extends S.Class<UpdateDecoderManifestRequest>(
  "UpdateDecoderManifestRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    signalDecodersToAdd: S.optional(SignalDecoders),
    signalDecodersToUpdate: S.optional(SignalDecoders),
    signalDecodersToRemove: S.optional(Fqns),
    networkInterfacesToAdd: S.optional(NetworkInterfaces),
    networkInterfacesToUpdate: S.optional(NetworkInterfaces),
    networkInterfacesToRemove: S.optional(InterfaceIds),
    status: S.optional(S.String),
    defaultForUnmappedSignals: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/decoder-manifests/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDecoderManifestRequest extends S.Class<DeleteDecoderManifestRequest>(
  "DeleteDecoderManifestRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/decoder-manifests/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDecoderManifestsRequest extends S.Class<ListDecoderManifestsRequest>(
  "ListDecoderManifestsRequest",
)(
  {
    modelManifestArn: S.optional(S.String).pipe(
      T.HttpQuery("modelManifestArn"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    listResponseScope: S.optional(S.String).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/decoder-manifests" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDecoderManifestNetworkInterfacesRequest extends S.Class<ListDecoderManifestNetworkInterfacesRequest>(
  "ListDecoderManifestNetworkInterfacesRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListDecoderManifestSignalsRequest extends S.Class<ListDecoderManifestSignalsRequest>(
  "ListDecoderManifestSignalsRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/decoder-manifests/{name}/signals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateFleetRequest extends S.Class<CreateFleetRequest>(
  "CreateFleetRequest",
)(
  {
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    description: S.optional(S.String),
    signalCatalogArn: S.String,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/fleets/{fleetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFleetRequest extends S.Class<GetFleetRequest>(
  "GetFleetRequest",
)(
  { fleetId: S.String.pipe(T.HttpLabel("fleetId")) },
  T.all(
    T.Http({ method: "GET", uri: "/fleets/{fleetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFleetRequest extends S.Class<UpdateFleetRequest>(
  "UpdateFleetRequest",
)(
  {
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/fleets/{fleetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFleetRequest extends S.Class<DeleteFleetRequest>(
  "DeleteFleetRequest",
)(
  { fleetId: S.String.pipe(T.HttpLabel("fleetId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/fleets/{fleetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFleetsRequest extends S.Class<ListFleetsRequest>(
  "ListFleetsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    listResponseScope: S.optional(S.String).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/fleets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVehiclesInFleetRequest extends S.Class<ListVehiclesInFleetRequest>(
  "ListVehiclesInFleetRequest",
)(
  {
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/fleets/{fleetId}/vehicles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateModelManifestRequest extends S.Class<CreateModelManifestRequest>(
  "CreateModelManifestRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    nodes: listOfStrings,
    signalCatalogArn: S.String,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/model-manifests/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetModelManifestRequest extends S.Class<GetModelManifestRequest>(
  "GetModelManifestRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "GET", uri: "/model-manifests/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateModelManifestRequest extends S.Class<UpdateModelManifestRequest>(
  "UpdateModelManifestRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    nodesToAdd: S.optional(NodePaths),
    nodesToRemove: S.optional(NodePaths),
    status: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/model-manifests/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteModelManifestRequest extends S.Class<DeleteModelManifestRequest>(
  "DeleteModelManifestRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/model-manifests/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListModelManifestsRequest extends S.Class<ListModelManifestsRequest>(
  "ListModelManifestsRequest",
)(
  {
    signalCatalogArn: S.optional(S.String).pipe(
      T.HttpQuery("signalCatalogArn"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    listResponseScope: S.optional(S.String).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/model-manifests" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListModelManifestNodesRequest extends S.Class<ListModelManifestNodesRequest>(
  "ListModelManifestNodesRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/model-manifests/{name}/nodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSignalCatalogRequest extends S.Class<GetSignalCatalogRequest>(
  "GetSignalCatalogRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "GET", uri: "/signal-catalogs/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Branch extends S.Class<Branch>("Branch")({
  fullyQualifiedName: S.String,
  description: S.optional(S.String),
  deprecationMessage: S.optional(S.String),
  comment: S.optional(S.String),
}) {}
export class Sensor extends S.Class<Sensor>("Sensor")({
  fullyQualifiedName: S.String,
  dataType: S.String,
  description: S.optional(S.String),
  unit: S.optional(S.String),
  allowedValues: S.optional(listOfStrings),
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  deprecationMessage: S.optional(S.String),
  comment: S.optional(S.String),
  structFullyQualifiedName: S.optional(S.String),
}) {}
export class Actuator extends S.Class<Actuator>("Actuator")({
  fullyQualifiedName: S.String,
  dataType: S.String,
  description: S.optional(S.String),
  unit: S.optional(S.String),
  allowedValues: S.optional(listOfStrings),
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  assignedValue: S.optional(S.String),
  deprecationMessage: S.optional(S.String),
  comment: S.optional(S.String),
  structFullyQualifiedName: S.optional(S.String),
}) {}
export class Attribute extends S.Class<Attribute>("Attribute")({
  fullyQualifiedName: S.String,
  dataType: S.String,
  description: S.optional(S.String),
  unit: S.optional(S.String),
  allowedValues: S.optional(listOfStrings),
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  assignedValue: S.optional(S.String),
  defaultValue: S.optional(S.String),
  deprecationMessage: S.optional(S.String),
  comment: S.optional(S.String),
}) {}
export class CustomStruct extends S.Class<CustomStruct>("CustomStruct")({
  fullyQualifiedName: S.String,
  description: S.optional(S.String),
  deprecationMessage: S.optional(S.String),
  comment: S.optional(S.String),
}) {}
export class CustomProperty extends S.Class<CustomProperty>("CustomProperty")({
  fullyQualifiedName: S.String,
  dataType: S.String,
  dataEncoding: S.optional(S.String),
  description: S.optional(S.String),
  deprecationMessage: S.optional(S.String),
  comment: S.optional(S.String),
  structFullyQualifiedName: S.optional(S.String),
}) {}
export const Node = S.Union(
  S.Struct({ branch: Branch }),
  S.Struct({ sensor: Sensor }),
  S.Struct({ actuator: Actuator }),
  S.Struct({ attribute: Attribute }),
  S.Struct({ struct: CustomStruct }),
  S.Struct({ property: CustomProperty }),
);
export const Nodes = S.Array(Node);
export class UpdateSignalCatalogRequest extends S.Class<UpdateSignalCatalogRequest>(
  "UpdateSignalCatalogRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    nodesToAdd: S.optional(Nodes),
    nodesToUpdate: S.optional(Nodes),
    nodesToRemove: S.optional(NodePaths),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/signal-catalogs/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSignalCatalogRequest extends S.Class<DeleteSignalCatalogRequest>(
  "DeleteSignalCatalogRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/signal-catalogs/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSignalCatalogsRequest extends S.Class<ListSignalCatalogsRequest>(
  "ListSignalCatalogsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/signal-catalogs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSignalCatalogNodesRequest extends S.Class<ListSignalCatalogNodesRequest>(
  "ListSignalCatalogNodesRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    signalNodeType: S.optional(S.String).pipe(T.HttpQuery("signalNodeType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/signal-catalogs/{name}/nodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStateTemplateRequest extends S.Class<CreateStateTemplateRequest>(
  "CreateStateTemplateRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/state-templates/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStateTemplateRequest extends S.Class<GetStateTemplateRequest>(
  "GetStateTemplateRequest",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/state-templates/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateStateTemplateRequest extends S.Class<UpdateStateTemplateRequest>(
  "UpdateStateTemplateRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/state-templates/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteStateTemplateRequest extends S.Class<DeleteStateTemplateRequest>(
  "DeleteStateTemplateRequest",
)(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/state-templates/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStateTemplatesRequest extends S.Class<ListStateTemplatesRequest>(
  "ListStateTemplatesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    listResponseScope: S.optional(S.String).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/state-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVehicleRequest extends S.Class<GetVehicleRequest>(
  "GetVehicleRequest",
)(
  { vehicleName: S.String.pipe(T.HttpLabel("vehicleName")) },
  T.all(
    T.Http({ method: "GET", uri: "/vehicles/{vehicleName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const attributesMap = S.Record({ key: S.String, value: S.String });
export class TimePeriod extends S.Class<TimePeriod>("TimePeriod")({
  unit: S.String,
  value: S.Number,
}) {}
export class PeriodicStateTemplateUpdateStrategy extends S.Class<PeriodicStateTemplateUpdateStrategy>(
  "PeriodicStateTemplateUpdateStrategy",
)({ stateTemplateUpdateRate: TimePeriod }) {}
export class OnChangeStateTemplateUpdateStrategy extends S.Class<OnChangeStateTemplateUpdateStrategy>(
  "OnChangeStateTemplateUpdateStrategy",
)({}) {}
export const StateTemplateUpdateStrategy = S.Union(
  S.Struct({ periodic: PeriodicStateTemplateUpdateStrategy }),
  S.Struct({ onChange: OnChangeStateTemplateUpdateStrategy }),
);
export class StateTemplateAssociation extends S.Class<StateTemplateAssociation>(
  "StateTemplateAssociation",
)({
  identifier: S.String,
  stateTemplateUpdateStrategy: StateTemplateUpdateStrategy,
}) {}
export const StateTemplateAssociations = S.Array(StateTemplateAssociation);
export class UpdateVehicleRequest extends S.Class<UpdateVehicleRequest>(
  "UpdateVehicleRequest",
)(
  {
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
    modelManifestArn: S.optional(S.String),
    decoderManifestArn: S.optional(S.String),
    attributes: S.optional(attributesMap),
    attributeUpdateMode: S.optional(S.String),
    stateTemplatesToAdd: S.optional(StateTemplateAssociations),
    stateTemplatesToRemove: S.optional(StateTemplateAssociationIdentifiers),
    stateTemplatesToUpdate: S.optional(StateTemplateAssociations),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/vehicles/{vehicleName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVehicleRequest extends S.Class<DeleteVehicleRequest>(
  "DeleteVehicleRequest",
)(
  { vehicleName: S.String.pipe(T.HttpLabel("vehicleName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/vehicles/{vehicleName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVehiclesRequest extends S.Class<ListVehiclesRequest>(
  "ListVehiclesRequest",
)(
  {
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
    listResponseScope: S.optional(S.String).pipe(
      T.HttpQuery("listResponseScope"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/vehicles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateVehicleFleetRequest extends S.Class<AssociateVehicleFleetRequest>(
  "AssociateVehicleFleetRequest",
)(
  { vehicleName: S.String.pipe(T.HttpLabel("vehicleName")), fleetId: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/vehicles/{vehicleName}/associate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateVehicleFleetResponse extends S.Class<AssociateVehicleFleetResponse>(
  "AssociateVehicleFleetResponse",
)({}) {}
export class DisassociateVehicleFleetRequest extends S.Class<DisassociateVehicleFleetRequest>(
  "DisassociateVehicleFleetRequest",
)(
  { vehicleName: S.String.pipe(T.HttpLabel("vehicleName")), fleetId: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/vehicles/{vehicleName}/disassociate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateVehicleFleetResponse extends S.Class<DisassociateVehicleFleetResponse>(
  "DisassociateVehicleFleetResponse",
)({}) {}
export class ListFleetsForVehicleRequest extends S.Class<ListFleetsForVehicleRequest>(
  "ListFleetsForVehicleRequest",
)(
  {
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/vehicles/{vehicleName}/fleets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const EventExpressionList = S.Array(S.String);
export class CreateVehicleRequestItem extends S.Class<CreateVehicleRequestItem>(
  "CreateVehicleRequestItem",
)({
  vehicleName: S.String,
  modelManifestArn: S.String,
  decoderManifestArn: S.String,
  attributes: S.optional(attributesMap),
  associationBehavior: S.optional(S.String),
  tags: S.optional(TagList),
  stateTemplates: S.optional(StateTemplateAssociations),
}) {}
export const createVehicleRequestItems = S.Array(CreateVehicleRequestItem);
export class UpdateVehicleRequestItem extends S.Class<UpdateVehicleRequestItem>(
  "UpdateVehicleRequestItem",
)({
  vehicleName: S.String,
  modelManifestArn: S.optional(S.String),
  decoderManifestArn: S.optional(S.String),
  attributes: S.optional(attributesMap),
  attributeUpdateMode: S.optional(S.String),
  stateTemplatesToAdd: S.optional(StateTemplateAssociations),
  stateTemplatesToRemove: S.optional(StateTemplateAssociationIdentifiers),
  stateTemplatesToUpdate: S.optional(StateTemplateAssociations),
}) {}
export const updateVehicleRequestItems = S.Array(UpdateVehicleRequestItem);
export class TimestreamRegistrationResponse extends S.Class<TimestreamRegistrationResponse>(
  "TimestreamRegistrationResponse",
)({
  timestreamDatabaseName: S.String,
  timestreamTableName: S.String,
  timestreamDatabaseArn: S.optional(S.String),
  timestreamTableArn: S.optional(S.String),
  registrationStatus: S.String,
  errorMessage: S.optional(S.String),
}) {}
export class IamRegistrationResponse extends S.Class<IamRegistrationResponse>(
  "IamRegistrationResponse",
)({
  roleArn: S.String,
  registrationStatus: S.String,
  errorMessage: S.optional(S.String),
}) {}
export class TimestreamResources extends S.Class<TimestreamResources>(
  "TimestreamResources",
)({ timestreamDatabaseName: S.String, timestreamTableName: S.String }) {}
export class IamResources extends S.Class<IamResources>("IamResources")({
  roleArn: S.String,
}) {}
export class SignalInformation extends S.Class<SignalInformation>(
  "SignalInformation",
)({
  name: S.String,
  maxSampleCount: S.optional(S.Number),
  minimumSamplingIntervalMs: S.optional(S.Number),
  dataPartitionId: S.optional(S.String),
}) {}
export const SignalInformationList = S.Array(SignalInformation);
export const vehicles = S.Array(S.String);
export const FormattedVss = S.Union(S.Struct({ vssJson: S.String }));
export const fleets = S.Array(S.String);
export const NetworkFilesList = S.Array(T.Blob);
export class BatchCreateVehicleRequest extends S.Class<BatchCreateVehicleRequest>(
  "BatchCreateVehicleRequest",
)(
  { vehicles: createVehicleRequestItems },
  T.all(
    T.Http({ method: "POST", uri: "/vehicles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateVehicleRequest extends S.Class<BatchUpdateVehicleRequest>(
  "BatchUpdateVehicleRequest",
)(
  { vehicles: updateVehicleRequestItems },
  T.all(
    T.Http({ method: "PUT", uri: "/vehicles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoggingOptionsResponse extends S.Class<GetLoggingOptionsResponse>(
  "GetLoggingOptionsResponse",
)({ cloudWatchLogDelivery: CloudWatchLogDeliveryOptions }) {}
export class GetRegisterAccountStatusResponse extends S.Class<GetRegisterAccountStatusResponse>(
  "GetRegisterAccountStatusResponse",
)({
  customerAccountId: S.String,
  accountStatus: S.String,
  timestreamRegistrationResponse: S.optional(TimestreamRegistrationResponse),
  iamRegistrationResponse: IamRegistrationResponse,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class PutEncryptionConfigurationResponse extends S.Class<PutEncryptionConfigurationResponse>(
  "PutEncryptionConfigurationResponse",
)({
  kmsKeyId: S.optional(S.String),
  encryptionStatus: S.String,
  encryptionType: S.String,
}) {}
export class RegisterAccountRequest extends S.Class<RegisterAccountRequest>(
  "RegisterAccountRequest",
)(
  {
    timestreamResources: S.optional(TimestreamResources),
    iamResources: S.optional(IamResources),
  },
  T.all(
    T.Http({ method: "POST", uri: "/account/registration" }),
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
  { ResourceARN: S.String.pipe(T.HttpQuery("resourceArn")), Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class TimeBasedCollectionScheme extends S.Class<TimeBasedCollectionScheme>(
  "TimeBasedCollectionScheme",
)({ periodMs: S.Number }) {}
export class ConditionBasedCollectionScheme extends S.Class<ConditionBasedCollectionScheme>(
  "ConditionBasedCollectionScheme",
)({
  expression: S.String,
  minimumTriggerIntervalMs: S.optional(S.Number),
  triggerMode: S.optional(S.String),
  conditionLanguageVersion: S.optional(S.Number),
}) {}
export const CollectionScheme = S.Union(
  S.Struct({ timeBasedCollectionScheme: TimeBasedCollectionScheme }),
  S.Struct({ conditionBasedCollectionScheme: ConditionBasedCollectionScheme }),
);
export class S3Config extends S.Class<S3Config>("S3Config")({
  bucketArn: S.String,
  dataFormat: S.optional(S.String),
  storageCompressionFormat: S.optional(S.String),
  prefix: S.optional(S.String),
}) {}
export class TimestreamConfig extends S.Class<TimestreamConfig>(
  "TimestreamConfig",
)({ timestreamTableArn: S.String, executionRoleArn: S.String }) {}
export class MqttTopicConfig extends S.Class<MqttTopicConfig>(
  "MqttTopicConfig",
)({ mqttTopicArn: S.String, executionRoleArn: S.String }) {}
export const DataDestinationConfig = S.Union(
  S.Struct({ s3Config: S3Config }),
  S.Struct({ timestreamConfig: TimestreamConfig }),
  S.Struct({ mqttTopicConfig: MqttTopicConfig }),
);
export const DataDestinationConfigs = S.Array(DataDestinationConfig);
export class StorageMaximumSize extends S.Class<StorageMaximumSize>(
  "StorageMaximumSize",
)({ unit: S.String, value: S.Number }) {}
export class StorageMinimumTimeToLive extends S.Class<StorageMinimumTimeToLive>(
  "StorageMinimumTimeToLive",
)({ unit: S.String, value: S.Number }) {}
export class DataPartitionStorageOptions extends S.Class<DataPartitionStorageOptions>(
  "DataPartitionStorageOptions",
)({
  maximumSize: StorageMaximumSize,
  storageLocation: S.String,
  minimumTimeToLive: StorageMinimumTimeToLive,
}) {}
export class DataPartitionUploadOptions extends S.Class<DataPartitionUploadOptions>(
  "DataPartitionUploadOptions",
)({ expression: S.String, conditionLanguageVersion: S.optional(S.Number) }) {}
export class DataPartition extends S.Class<DataPartition>("DataPartition")({
  id: S.String,
  storageOptions: DataPartitionStorageOptions,
  uploadOptions: S.optional(DataPartitionUploadOptions),
}) {}
export const DataPartitions = S.Array(DataPartition);
export class TimeBasedSignalFetchConfig extends S.Class<TimeBasedSignalFetchConfig>(
  "TimeBasedSignalFetchConfig",
)({ executionFrequencyMs: S.Number }) {}
export class ConditionBasedSignalFetchConfig extends S.Class<ConditionBasedSignalFetchConfig>(
  "ConditionBasedSignalFetchConfig",
)({ conditionExpression: S.String, triggerMode: S.String }) {}
export const SignalFetchConfig = S.Union(
  S.Struct({ timeBased: TimeBasedSignalFetchConfig }),
  S.Struct({ conditionBased: ConditionBasedSignalFetchConfig }),
);
export class SignalFetchInformation extends S.Class<SignalFetchInformation>(
  "SignalFetchInformation",
)({
  fullyQualifiedName: S.String,
  signalFetchConfig: SignalFetchConfig,
  conditionLanguageVersion: S.optional(S.Number),
  actions: EventExpressionList,
}) {}
export const SignalFetchInformationList = S.Array(SignalFetchInformation);
export class GetCampaignResponse extends S.Class<GetCampaignResponse>(
  "GetCampaignResponse",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
  signalCatalogArn: S.optional(S.String),
  targetArn: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expiryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  postTriggerCollectionDuration: S.optional(S.Number),
  diagnosticsMode: S.optional(S.String),
  spoolingMode: S.optional(S.String),
  compression: S.optional(S.String),
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
}) {}
export class UpdateCampaignResponse extends S.Class<UpdateCampaignResponse>(
  "UpdateCampaignResponse",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class DeleteCampaignResponse extends S.Class<DeleteCampaignResponse>(
  "DeleteCampaignResponse",
)({ name: S.optional(S.String), arn: S.optional(S.String) }) {}
export class GetDecoderManifestResponse extends S.Class<GetDecoderManifestResponse>(
  "GetDecoderManifestResponse",
)({
  name: S.String,
  arn: S.String,
  description: S.optional(S.String),
  modelManifestArn: S.optional(S.String),
  status: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  message: S.optional(S.String),
}) {}
export class UpdateDecoderManifestResponse extends S.Class<UpdateDecoderManifestResponse>(
  "UpdateDecoderManifestResponse",
)({ name: S.String, arn: S.String }) {}
export class DeleteDecoderManifestResponse extends S.Class<DeleteDecoderManifestResponse>(
  "DeleteDecoderManifestResponse",
)({ name: S.String, arn: S.String }) {}
export class ListDecoderManifestNetworkInterfacesResponse extends S.Class<ListDecoderManifestNetworkInterfacesResponse>(
  "ListDecoderManifestNetworkInterfacesResponse",
)({
  networkInterfaces: S.optional(NetworkInterfaces),
  nextToken: S.optional(S.String),
}) {}
export class ListDecoderManifestSignalsResponse extends S.Class<ListDecoderManifestSignalsResponse>(
  "ListDecoderManifestSignalsResponse",
)({
  signalDecoders: S.optional(SignalDecoders),
  nextToken: S.optional(S.String),
}) {}
export class CreateFleetResponse extends S.Class<CreateFleetResponse>(
  "CreateFleetResponse",
)({ id: S.String, arn: S.String }) {}
export class GetFleetResponse extends S.Class<GetFleetResponse>(
  "GetFleetResponse",
)({
  id: S.String,
  arn: S.String,
  description: S.optional(S.String),
  signalCatalogArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateFleetResponse extends S.Class<UpdateFleetResponse>(
  "UpdateFleetResponse",
)({ id: S.optional(S.String), arn: S.optional(S.String) }) {}
export class DeleteFleetResponse extends S.Class<DeleteFleetResponse>(
  "DeleteFleetResponse",
)({ id: S.optional(S.String), arn: S.optional(S.String) }) {}
export class ListVehiclesInFleetResponse extends S.Class<ListVehiclesInFleetResponse>(
  "ListVehiclesInFleetResponse",
)({ vehicles: S.optional(vehicles), nextToken: S.optional(S.String) }) {}
export class CreateModelManifestResponse extends S.Class<CreateModelManifestResponse>(
  "CreateModelManifestResponse",
)({ name: S.String, arn: S.String }) {}
export class GetModelManifestResponse extends S.Class<GetModelManifestResponse>(
  "GetModelManifestResponse",
)({
  name: S.String,
  arn: S.String,
  description: S.optional(S.String),
  signalCatalogArn: S.optional(S.String),
  status: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateModelManifestResponse extends S.Class<UpdateModelManifestResponse>(
  "UpdateModelManifestResponse",
)({ name: S.String, arn: S.String }) {}
export class DeleteModelManifestResponse extends S.Class<DeleteModelManifestResponse>(
  "DeleteModelManifestResponse",
)({ name: S.String, arn: S.String }) {}
export class ListModelManifestNodesResponse extends S.Class<ListModelManifestNodesResponse>(
  "ListModelManifestNodesResponse",
)({ nodes: S.optional(Nodes), nextToken: S.optional(S.String) }) {}
export class UpdateSignalCatalogResponse extends S.Class<UpdateSignalCatalogResponse>(
  "UpdateSignalCatalogResponse",
)({ name: S.String, arn: S.String }) {}
export class DeleteSignalCatalogResponse extends S.Class<DeleteSignalCatalogResponse>(
  "DeleteSignalCatalogResponse",
)({ name: S.String, arn: S.String }) {}
export class ImportSignalCatalogRequest extends S.Class<ImportSignalCatalogRequest>(
  "ImportSignalCatalogRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    vss: S.optional(FormattedVss),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/signal-catalogs/{name}/nodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSignalCatalogNodesResponse extends S.Class<ListSignalCatalogNodesResponse>(
  "ListSignalCatalogNodesResponse",
)({ nodes: S.optional(Nodes), nextToken: S.optional(S.String) }) {}
export class CreateStateTemplateResponse extends S.Class<CreateStateTemplateResponse>(
  "CreateStateTemplateResponse",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  id: S.optional(S.String),
}) {}
export class GetStateTemplateResponse extends S.Class<GetStateTemplateResponse>(
  "GetStateTemplateResponse",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
  signalCatalogArn: S.optional(S.String),
  stateTemplateProperties: S.optional(StateTemplateProperties),
  dataExtraDimensions: S.optional(StateTemplateDataExtraDimensionNodePathList),
  metadataExtraDimensions: S.optional(
    StateTemplateMetadataExtraDimensionNodePathList,
  ),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  id: S.optional(S.String),
}) {}
export class UpdateStateTemplateResponse extends S.Class<UpdateStateTemplateResponse>(
  "UpdateStateTemplateResponse",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  id: S.optional(S.String),
}) {}
export class DeleteStateTemplateResponse extends S.Class<DeleteStateTemplateResponse>(
  "DeleteStateTemplateResponse",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  id: S.optional(S.String),
}) {}
export class GetVehicleResponse extends S.Class<GetVehicleResponse>(
  "GetVehicleResponse",
)({
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
}) {}
export class UpdateVehicleResponse extends S.Class<UpdateVehicleResponse>(
  "UpdateVehicleResponse",
)({ vehicleName: S.optional(S.String), arn: S.optional(S.String) }) {}
export class DeleteVehicleResponse extends S.Class<DeleteVehicleResponse>(
  "DeleteVehicleResponse",
)({ vehicleName: S.String, arn: S.String }) {}
export class ListFleetsForVehicleResponse extends S.Class<ListFleetsForVehicleResponse>(
  "ListFleetsForVehicleResponse",
)({ fleets: S.optional(fleets), nextToken: S.optional(S.String) }) {}
export class VehicleStatus extends S.Class<VehicleStatus>("VehicleStatus")({
  campaignName: S.optional(S.String),
  vehicleName: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export const VehicleStatusList = S.Array(VehicleStatus);
export class CampaignSummary extends S.Class<CampaignSummary>(
  "CampaignSummary",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  signalCatalogArn: S.optional(S.String),
  targetArn: S.optional(S.String),
  status: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const campaignSummaries = S.Array(CampaignSummary);
export class DecoderManifestSummary extends S.Class<DecoderManifestSummary>(
  "DecoderManifestSummary",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  modelManifestArn: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  message: S.optional(S.String),
}) {}
export const decoderManifestSummaries = S.Array(DecoderManifestSummary);
export class FleetSummary extends S.Class<FleetSummary>("FleetSummary")({
  id: S.String,
  arn: S.String,
  description: S.optional(S.String),
  signalCatalogArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const fleetSummaries = S.Array(FleetSummary);
export class ModelManifestSummary extends S.Class<ModelManifestSummary>(
  "ModelManifestSummary",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  signalCatalogArn: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const modelManifestSummaries = S.Array(ModelManifestSummary);
export class NodeCounts extends S.Class<NodeCounts>("NodeCounts")({
  totalNodes: S.optional(S.Number),
  totalBranches: S.optional(S.Number),
  totalSensors: S.optional(S.Number),
  totalAttributes: S.optional(S.Number),
  totalActuators: S.optional(S.Number),
  totalStructs: S.optional(S.Number),
  totalProperties: S.optional(S.Number),
}) {}
export class SignalCatalogSummary extends S.Class<SignalCatalogSummary>(
  "SignalCatalogSummary",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const signalCatalogSummaries = S.Array(SignalCatalogSummary);
export class StateTemplateSummary extends S.Class<StateTemplateSummary>(
  "StateTemplateSummary",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  signalCatalogArn: S.optional(S.String),
  description: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  id: S.optional(S.String),
}) {}
export const StateTemplateSummaries = S.Array(StateTemplateSummary);
export class VehicleSummary extends S.Class<VehicleSummary>("VehicleSummary")({
  vehicleName: S.String,
  arn: S.String,
  modelManifestArn: S.String,
  decoderManifestArn: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  attributes: S.optional(attributesMap),
}) {}
export const vehicleSummaries = S.Array(VehicleSummary);
export const ModelSignalsMap = S.Record({ key: S.String, value: S.String });
export class GetVehicleStatusResponse extends S.Class<GetVehicleStatusResponse>(
  "GetVehicleStatusResponse",
)({
  campaigns: S.optional(VehicleStatusList),
  nextToken: S.optional(S.String),
}) {}
export class RegisterAccountResponse extends S.Class<RegisterAccountResponse>(
  "RegisterAccountResponse",
)({
  registerAccountStatus: S.String,
  timestreamResources: S.optional(TimestreamResources),
  iamResources: IamResources,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListCampaignsResponse extends S.Class<ListCampaignsResponse>(
  "ListCampaignsResponse",
)({
  campaignSummaries: S.optional(campaignSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListDecoderManifestsResponse extends S.Class<ListDecoderManifestsResponse>(
  "ListDecoderManifestsResponse",
)({
  summaries: S.optional(decoderManifestSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListFleetsResponse extends S.Class<ListFleetsResponse>(
  "ListFleetsResponse",
)({
  fleetSummaries: S.optional(fleetSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListModelManifestsResponse extends S.Class<ListModelManifestsResponse>(
  "ListModelManifestsResponse",
)({
  summaries: S.optional(modelManifestSummaries),
  nextToken: S.optional(S.String),
}) {}
export class CreateSignalCatalogRequest extends S.Class<CreateSignalCatalogRequest>(
  "CreateSignalCatalogRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    nodes: S.optional(Nodes),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/signal-catalogs/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSignalCatalogResponse extends S.Class<GetSignalCatalogResponse>(
  "GetSignalCatalogResponse",
)({
  name: S.String,
  arn: S.String,
  description: S.optional(S.String),
  nodeCounts: S.optional(NodeCounts),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModificationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListSignalCatalogsResponse extends S.Class<ListSignalCatalogsResponse>(
  "ListSignalCatalogsResponse",
)({
  summaries: S.optional(signalCatalogSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ImportSignalCatalogResponse extends S.Class<ImportSignalCatalogResponse>(
  "ImportSignalCatalogResponse",
)({ name: S.String, arn: S.String }) {}
export class ListStateTemplatesResponse extends S.Class<ListStateTemplatesResponse>(
  "ListStateTemplatesResponse",
)({
  summaries: S.optional(StateTemplateSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListVehiclesResponse extends S.Class<ListVehiclesResponse>(
  "ListVehiclesResponse",
)({
  vehicleSummaries: S.optional(vehicleSummaries),
  nextToken: S.optional(S.String),
}) {}
export class CanDbcDefinition extends S.Class<CanDbcDefinition>(
  "CanDbcDefinition",
)({
  networkInterface: S.String,
  canDbcFiles: NetworkFilesList,
  signalsMap: S.optional(ModelSignalsMap),
}) {}
export class StructuredMessageListDefinition extends S.Class<StructuredMessageListDefinition>(
  "StructuredMessageListDefinition",
)({
  name: S.String,
  memberType: S.suspend(() => StructuredMessage),
  listType: S.String,
  capacity: S.optional(S.Number),
}) {}
export class StructuredMessageFieldNameAndDataTypePair extends S.Class<StructuredMessageFieldNameAndDataTypePair>(
  "StructuredMessageFieldNameAndDataTypePair",
)({ fieldName: S.String, dataType: S.suspend(() => StructuredMessage) }) {}
export type StructuredMessageDefinition =
  StructuredMessageFieldNameAndDataTypePair[];
export const StructuredMessageDefinition = S.Array(
  S.suspend(
    (): S.Schema<StructuredMessageFieldNameAndDataTypePair, any> =>
      StructuredMessageFieldNameAndDataTypePair,
  ),
) as any as S.Schema<StructuredMessageDefinition>;
export class CreateVehicleResponseItem extends S.Class<CreateVehicleResponseItem>(
  "CreateVehicleResponseItem",
)({
  vehicleName: S.optional(S.String),
  arn: S.optional(S.String),
  thingArn: S.optional(S.String),
}) {}
export const createVehicleResponses = S.Array(CreateVehicleResponseItem);
export class CreateVehicleError extends S.Class<CreateVehicleError>(
  "CreateVehicleError",
)({
  vehicleName: S.optional(S.String),
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const createVehicleErrors = S.Array(CreateVehicleError);
export class UpdateVehicleResponseItem extends S.Class<UpdateVehicleResponseItem>(
  "UpdateVehicleResponseItem",
)({ vehicleName: S.optional(S.String), arn: S.optional(S.String) }) {}
export const updateVehicleResponseItems = S.Array(UpdateVehicleResponseItem);
export class UpdateVehicleError extends S.Class<UpdateVehicleError>(
  "UpdateVehicleError",
)({
  vehicleName: S.optional(S.String),
  code: S.optional(S.Number),
  message: S.optional(S.String),
}) {}
export const updateVehicleErrors = S.Array(UpdateVehicleError);
export const NetworkFileDefinition = S.Union(
  S.Struct({ canDbc: CanDbcDefinition }),
);
export const NetworkFileDefinitions = S.Array(NetworkFileDefinition);
export class BatchCreateVehicleResponse extends S.Class<BatchCreateVehicleResponse>(
  "BatchCreateVehicleResponse",
)({
  vehicles: S.optional(createVehicleResponses),
  errors: S.optional(createVehicleErrors),
}) {}
export class BatchUpdateVehicleResponse extends S.Class<BatchUpdateVehicleResponse>(
  "BatchUpdateVehicleResponse",
)({
  vehicles: S.optional(updateVehicleResponseItems),
  errors: S.optional(updateVehicleErrors),
}) {}
export class CreateCampaignRequest extends S.Class<CreateCampaignRequest>(
  "CreateCampaignRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    signalCatalogArn: S.String,
    targetArn: S.String,
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expiryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    postTriggerCollectionDuration: S.optional(S.Number),
    diagnosticsMode: S.optional(S.String),
    spoolingMode: S.optional(S.String),
    compression: S.optional(S.String),
    priority: S.optional(S.Number),
    signalsToCollect: S.optional(SignalInformationList),
    collectionScheme: CollectionScheme,
    dataExtraDimensions: S.optional(DataExtraDimensionNodePathList),
    tags: S.optional(TagList),
    dataDestinationConfigs: S.optional(DataDestinationConfigs),
    dataPartitions: S.optional(DataPartitions),
    signalsToFetch: S.optional(SignalFetchInformationList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/campaigns/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportDecoderManifestRequest extends S.Class<ImportDecoderManifestRequest>(
  "ImportDecoderManifestRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    networkFileDefinitions: NetworkFileDefinitions,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/decoder-manifests/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSignalCatalogResponse extends S.Class<CreateSignalCatalogResponse>(
  "CreateSignalCatalogResponse",
)({ name: S.String, arn: S.String }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class InvalidSignal extends S.Class<InvalidSignal>("InvalidSignal")({
  name: S.optional(S.String),
  reason: S.optional(S.String),
}) {}
export const InvalidSignals = S.Array(InvalidSignal);
export class InvalidSignalDecoder extends S.Class<InvalidSignalDecoder>(
  "InvalidSignalDecoder",
)({
  name: S.optional(S.String),
  reason: S.optional(S.String),
  hint: S.optional(S.String),
}) {}
export const InvalidSignalDecoders = S.Array(InvalidSignalDecoder);
export class InvalidNetworkInterface extends S.Class<InvalidNetworkInterface>(
  "InvalidNetworkInterface",
)({ interfaceId: S.optional(S.String), reason: S.optional(S.String) }) {}
export const InvalidNetworkInterfaces = S.Array(InvalidNetworkInterface);
export class CreateCampaignResponse extends S.Class<CreateCampaignResponse>(
  "CreateCampaignResponse",
)({ name: S.optional(S.String), arn: S.optional(S.String) }) {}
export class ImportDecoderManifestResponse extends S.Class<ImportDecoderManifestResponse>(
  "ImportDecoderManifestResponse",
)({ name: S.String, arn: S.String }) {}
export class CreateVehicleRequest extends S.Class<CreateVehicleRequest>(
  "CreateVehicleRequest",
)(
  {
    vehicleName: S.String.pipe(T.HttpLabel("vehicleName")),
    modelManifestArn: S.String,
    decoderManifestArn: S.String,
    attributes: S.optional(attributesMap),
    associationBehavior: S.optional(S.String),
    tags: S.optional(TagList),
    stateTemplates: S.optional(StateTemplateAssociations),
  },
  T.all(
    T.Http({ method: "POST", uri: "/vehicles/{vehicleName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDecoderManifestRequest extends S.Class<CreateDecoderManifestRequest>(
  "CreateDecoderManifestRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    modelManifestArn: S.String,
    signalDecoders: S.optional(SignalDecoders),
    networkInterfaces: S.optional(NetworkInterfaces),
    defaultForUnmappedSignals: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/decoder-manifests/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVehicleResponse extends S.Class<CreateVehicleResponse>(
  "CreateVehicleResponse",
)({
  vehicleName: S.optional(S.String),
  arn: S.optional(S.String),
  thingArn: S.optional(S.String),
}) {}
export class CreateDecoderManifestResponse extends S.Class<CreateDecoderManifestResponse>(
  "CreateDecoderManifestResponse",
)({ name: S.String, arn: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    quotaCode: S.optional(S.String),
    serviceCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resource: S.String, resourceType: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class InvalidNodeException extends S.TaggedError<InvalidNodeException>()(
  "InvalidNodeException",
  {
    invalidNodes: S.optional(Nodes),
    reason: S.optional(S.String),
    message: S.optional(S.String),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}
export class InvalidSignalsException extends S.TaggedError<InvalidSignalsException>()(
  "InvalidSignalsException",
  { message: S.optional(S.String), invalidSignals: S.optional(InvalidSignals) },
) {}
export class DecoderManifestValidationException extends S.TaggedError<DecoderManifestValidationException>()(
  "DecoderManifestValidationException",
  {
    invalidSignals: S.optional(InvalidSignalDecoders),
    invalidNetworkInterfaces: S.optional(InvalidNetworkInterfaces),
    message: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Retrieves the logging options.
 */
export const getLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoggingOptionsRequest,
  output: GetLoggingOptionsResponse,
  errors: [AccessDeniedException, ThrottlingException],
}));
/**
 * Retrieves information about a campaign.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const getCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importSignalCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDecoderManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists information about created campaigns.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listCampaigns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCampaignsRequest,
  output: ListCampaignsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Lists decoder manifests.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listDecoderManifests = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDecoderManifestsRequest,
    output: ListDecoderManifestsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves information for each created fleet in an Amazon Web Services account.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listFleets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFleetsRequest,
  output: ListFleetsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of vehicle models (model manifests).
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listModelManifests = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListModelManifestsRequest,
  output: ListModelManifestsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a signal catalog.
 */
export const getSignalCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSignalCatalogs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSignalCatalogsRequest,
  output: ListSignalCatalogsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists information about created state templates.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const listStateTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStateTemplatesRequest,
  output: ListStateTemplatesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of summaries of created vehicles.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listVehicles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVehiclesRequest,
  output: ListVehiclesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
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
export const getRegisterAccountStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRegisterAccountStatusRequest,
    output: GetRegisterAccountStatusResponse,
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
 * Lists the tags (metadata) you have assigned to the resource.
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
 * Adds to or modifies the tags of the given resource. Tags are metadata which can be
 * used to manage a resource.
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
 * Lists the network interfaces specified in a decoder manifest.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listDecoderManifestNetworkInterfaces =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDecoderManifestNetworkInterfacesRequest,
    output: ListDecoderManifestNetworkInterfacesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * A list of information about signal decoders specified in a decoder manifest.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listDecoderManifestSignals = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDecoderManifestSignalsRequest,
    output: ListDecoderManifestSignalsResponse,
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
 * Retrieves information about a fleet.
 */
export const getFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listVehiclesInFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVehiclesInFleetRequest,
  output: ListVehiclesInFleetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a state template.
 *
 * Access to certain Amazon Web Services IoT FleetWise features is currently gated. For more information, see Amazon Web Services Region and feature availability in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const getStateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteStateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVehicle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVehicle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFleetsForVehicle = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFleetsForVehicleRequest,
    output: ListFleetsForVehicleResponse,
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
 * Removes the given tags (metadata) from the resource.
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
 * Removes, or disassociates, a vehicle from a fleet. Disassociating a vehicle from a
 * fleet doesn't delete the vehicle.
 */
export const disassociateVehicleFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateVehicleFleetRequest,
    output: DisassociateVehicleFleetResponse,
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
 * Updates a campaign.
 */
export const updateCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDecoderManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDecoderManifestRequest,
    output: DeleteDecoderManifestResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the description of an existing fleet.
 */
export const updateFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteModelManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSignalCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDecoderManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getModelManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getEncryptionConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEncryptionConfigurationRequest,
    output: GetEncryptionConfigurationResponse,
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
 * Retrieves information about the status of campaigns, decoder manifests, or state templates
 * associated with a vehicle.
 */
export const getVehicleStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVehicleStatusRequest,
  output: GetVehicleStatusResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates the encryption configuration. Amazon Web Services IoT FleetWise can encrypt your data and
 * resources using an Amazon Web Services managed key. Or, you can use a KMS key that you own and
 * manage. For more information, see Data
 * encryption in the *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const putEncryptionConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const registerAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listModelManifestNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists of information about the signals (nodes) specified in a signal catalog.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the request to return more results.
 */
export const listSignalCatalogNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Adds, or associates, a vehicle with a fleet.
 */
export const associateVehicleFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a fleet that represents a group of vehicles.
 *
 * You must create both a signal catalog and vehicles before you can create a fleet.
 *
 * For more information, see Fleets in the
 * *Amazon Web Services IoT FleetWise Developer Guide*.
 */
export const createFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVehicle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchCreateVehicle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchUpdateVehicle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateStateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createModelManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateModelManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createStateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSignalCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSignalCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importDecoderManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const createVehicle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDecoderManifest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
