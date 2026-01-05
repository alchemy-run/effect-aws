import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "GroundStation",
  serviceShapeName: "GroundStation",
});
const auth = T.AwsAuthSigv4({ name: "groundstation" });
const ver = T.ServiceVersion("2019-05-23");
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
                        url: "https://groundstation-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://groundstation-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://groundstation.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://groundstation.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const StatusList = S.Array(S.String);
export const EphemerisStatusList = S.Array(S.String);
export const DataflowEdge = S.Array(S.String);
export const DataflowEdgeList = S.Array(DataflowEdge);
export class GetAgentTaskResponseUrlRequest extends S.Class<GetAgentTaskResponseUrlRequest>(
  "GetAgentTaskResponseUrlRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/agentResponseUrl/{agentId}/{taskId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMinuteUsageRequest extends S.Class<GetMinuteUsageRequest>(
  "GetMinuteUsageRequest",
)(
  { month: S.Number, year: S.Number },
  T.all(
    T.Http({ method: "POST", uri: "/minute-usage" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export class GetAgentConfigurationRequest extends S.Class<GetAgentConfigurationRequest>(
  "GetAgentConfigurationRequest",
)(
  { agentId: S.String.pipe(T.HttpLabel("agentId")) },
  T.all(
    T.Http({ method: "GET", uri: "/agent/{agentId}/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfigRequest extends S.Class<GetConfigRequest>(
  "GetConfigRequest",
)(
  {
    configId: S.String.pipe(T.HttpLabel("configId")),
    configType: S.String.pipe(T.HttpLabel("configType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/config/{configType}/{configId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Frequency extends S.Class<Frequency>("Frequency")({
  value: S.Number,
  units: S.String,
}) {}
export class FrequencyBandwidth extends S.Class<FrequencyBandwidth>(
  "FrequencyBandwidth",
)({ value: S.Number, units: S.String }) {}
export class SpectrumConfig extends S.Class<SpectrumConfig>("SpectrumConfig")({
  centerFrequency: Frequency,
  bandwidth: FrequencyBandwidth,
  polarization: S.optional(S.String),
}) {}
export class AntennaDownlinkConfig extends S.Class<AntennaDownlinkConfig>(
  "AntennaDownlinkConfig",
)({ spectrumConfig: SpectrumConfig }) {}
export class TrackingConfig extends S.Class<TrackingConfig>("TrackingConfig")({
  autotrack: S.String,
}) {}
export class DataflowEndpointConfig extends S.Class<DataflowEndpointConfig>(
  "DataflowEndpointConfig",
)({
  dataflowEndpointName: S.String,
  dataflowEndpointRegion: S.optional(S.String),
}) {}
export class DemodulationConfig extends S.Class<DemodulationConfig>(
  "DemodulationConfig",
)({ unvalidatedJSON: S.String }) {}
export class DecodeConfig extends S.Class<DecodeConfig>("DecodeConfig")({
  unvalidatedJSON: S.String,
}) {}
export class AntennaDownlinkDemodDecodeConfig extends S.Class<AntennaDownlinkDemodDecodeConfig>(
  "AntennaDownlinkDemodDecodeConfig",
)({
  spectrumConfig: SpectrumConfig,
  demodulationConfig: DemodulationConfig,
  decodeConfig: DecodeConfig,
}) {}
export class UplinkSpectrumConfig extends S.Class<UplinkSpectrumConfig>(
  "UplinkSpectrumConfig",
)({ centerFrequency: Frequency, polarization: S.optional(S.String) }) {}
export class Eirp extends S.Class<Eirp>("Eirp")({
  value: S.Number,
  units: S.String,
}) {}
export class AntennaUplinkConfig extends S.Class<AntennaUplinkConfig>(
  "AntennaUplinkConfig",
)({
  transmitDisabled: S.optional(S.Boolean),
  spectrumConfig: UplinkSpectrumConfig,
  targetEirp: Eirp,
}) {}
export class UplinkEchoConfig extends S.Class<UplinkEchoConfig>(
  "UplinkEchoConfig",
)({ enabled: S.Boolean, antennaUplinkConfigArn: S.String }) {}
export class S3RecordingConfig extends S.Class<S3RecordingConfig>(
  "S3RecordingConfig",
)({ bucketArn: S.String, roleArn: S.String, prefix: S.optional(S.String) }) {}
export const ConfigTypeData = S.Union(
  S.Struct({ antennaDownlinkConfig: AntennaDownlinkConfig }),
  S.Struct({ trackingConfig: TrackingConfig }),
  S.Struct({ dataflowEndpointConfig: DataflowEndpointConfig }),
  S.Struct({
    antennaDownlinkDemodDecodeConfig: AntennaDownlinkDemodDecodeConfig,
  }),
  S.Struct({ antennaUplinkConfig: AntennaUplinkConfig }),
  S.Struct({ uplinkEchoConfig: UplinkEchoConfig }),
  S.Struct({ s3RecordingConfig: S3RecordingConfig }),
);
export class UpdateConfigRequest extends S.Class<UpdateConfigRequest>(
  "UpdateConfigRequest",
)(
  {
    configId: S.String.pipe(T.HttpLabel("configId")),
    name: S.String,
    configType: S.String.pipe(T.HttpLabel("configType")),
    configData: ConfigTypeData,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/config/{configType}/{configId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigRequest extends S.Class<DeleteConfigRequest>(
  "DeleteConfigRequest",
)(
  {
    configId: S.String.pipe(T.HttpLabel("configId")),
    configType: S.String.pipe(T.HttpLabel("configType")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/config/{configType}/{configId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigsRequest extends S.Class<ListConfigsRequest>(
  "ListConfigsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeContactRequest extends S.Class<DescribeContactRequest>(
  "DescribeContactRequest",
)(
  { contactId: S.String.pipe(T.HttpLabel("contactId")) },
  T.all(
    T.Http({ method: "GET", uri: "/contact/{contactId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelContactRequest extends S.Class<CancelContactRequest>(
  "CancelContactRequest",
)(
  { contactId: S.String.pipe(T.HttpLabel("contactId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/contact/{contactId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataflowEndpointGroupRequest extends S.Class<GetDataflowEndpointGroupRequest>(
  "GetDataflowEndpointGroupRequest",
)(
  {
    dataflowEndpointGroupId: S.String.pipe(
      T.HttpLabel("dataflowEndpointGroupId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/dataflowEndpointGroup/{dataflowEndpointGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataflowEndpointGroupRequest extends S.Class<DeleteDataflowEndpointGroupRequest>(
  "DeleteDataflowEndpointGroupRequest",
)(
  {
    dataflowEndpointGroupId: S.String.pipe(
      T.HttpLabel("dataflowEndpointGroupId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/dataflowEndpointGroup/{dataflowEndpointGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataflowEndpointGroupsRequest extends S.Class<ListDataflowEndpointGroupsRequest>(
  "ListDataflowEndpointGroupsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/dataflowEndpointGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeEphemerisRequest extends S.Class<DescribeEphemerisRequest>(
  "DescribeEphemerisRequest",
)(
  { ephemerisId: S.String.pipe(T.HttpLabel("ephemerisId")) },
  T.all(
    T.Http({ method: "GET", uri: "/ephemeris/{ephemerisId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEphemerisRequest extends S.Class<UpdateEphemerisRequest>(
  "UpdateEphemerisRequest",
)(
  {
    ephemerisId: S.String.pipe(T.HttpLabel("ephemerisId")),
    enabled: S.Boolean,
    name: S.optional(S.String),
    priority: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/ephemeris/{ephemerisId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEphemerisRequest extends S.Class<DeleteEphemerisRequest>(
  "DeleteEphemerisRequest",
)(
  { ephemerisId: S.String.pipe(T.HttpLabel("ephemerisId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/ephemeris/{ephemerisId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEphemeridesRequest extends S.Class<ListEphemeridesRequest>(
  "ListEphemeridesRequest",
)(
  {
    satelliteId: S.optional(S.String),
    ephemerisType: S.optional(S.String),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    statusList: S.optional(EphemerisStatusList),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ephemerides" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroundStationsRequest extends S.Class<ListGroundStationsRequest>(
  "ListGroundStationsRequest",
)(
  {
    satelliteId: S.optional(S.String).pipe(T.HttpQuery("satelliteId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/groundstation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMissionProfileRequest extends S.Class<GetMissionProfileRequest>(
  "GetMissionProfileRequest",
)(
  { missionProfileId: S.String.pipe(T.HttpLabel("missionProfileId")) },
  T.all(
    T.Http({ method: "GET", uri: "/missionprofile/{missionProfileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const KmsKey = S.Union(
  S.Struct({ kmsKeyArn: S.String }),
  S.Struct({ kmsAliasArn: S.String }),
  S.Struct({ kmsAliasName: S.String }),
);
export class UpdateMissionProfileRequest extends S.Class<UpdateMissionProfileRequest>(
  "UpdateMissionProfileRequest",
)(
  {
    missionProfileId: S.String.pipe(T.HttpLabel("missionProfileId")),
    name: S.optional(S.String),
    contactPrePassDurationSeconds: S.optional(S.Number),
    contactPostPassDurationSeconds: S.optional(S.Number),
    minimumViableContactDurationSeconds: S.optional(S.Number),
    dataflowEdges: S.optional(DataflowEdgeList),
    trackingConfigArn: S.optional(S.String),
    streamsKmsKey: S.optional(KmsKey),
    streamsKmsRole: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/missionprofile/{missionProfileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMissionProfileRequest extends S.Class<DeleteMissionProfileRequest>(
  "DeleteMissionProfileRequest",
)(
  { missionProfileId: S.String.pipe(T.HttpLabel("missionProfileId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/missionprofile/{missionProfileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMissionProfilesRequest extends S.Class<ListMissionProfilesRequest>(
  "ListMissionProfilesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/missionprofile" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSatelliteRequest extends S.Class<GetSatelliteRequest>(
  "GetSatelliteRequest",
)(
  { satelliteId: S.String.pipe(T.HttpLabel("satelliteId")) },
  T.all(
    T.Http({ method: "GET", uri: "/satellite/{satelliteId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSatellitesRequest extends S.Class<ListSatellitesRequest>(
  "ListSatellitesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/satellite" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IpAddressList = S.Array(S.String);
export const CapabilityArnList = S.Array(S.String);
export const AgentCpuCoresList = S.Array(S.Number);
export const CapabilityHealthReasonList = S.Array(S.String);
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class DiscoveryData extends S.Class<DiscoveryData>("DiscoveryData")({
  publicIpAddresses: IpAddressList,
  privateIpAddresses: IpAddressList,
  capabilityArns: CapabilityArnList,
}) {}
export class ComponentStatusData extends S.Class<ComponentStatusData>(
  "ComponentStatusData",
)({
  componentType: S.String,
  capabilityArn: S.String,
  status: S.String,
  bytesSent: S.optional(S.Number),
  bytesReceived: S.optional(S.Number),
  packetsDropped: S.optional(S.Number),
  dataflowId: S.String,
}) {}
export const ComponentStatusList = S.Array(ComponentStatusData);
export const GroundStationIdList = S.Array(S.String);
export const VersionStringList = S.Array(S.String);
export const SubnetList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export class GetAgentTaskResponseUrlResponse extends S.Class<GetAgentTaskResponseUrlResponse>(
  "GetAgentTaskResponseUrlResponse",
)({ agentId: S.String, taskId: S.String, presignedLogUrl: S.String }) {}
export class GetMinuteUsageResponse extends S.Class<GetMinuteUsageResponse>(
  "GetMinuteUsageResponse",
)({
  isReservedMinutesCustomer: S.optional(S.Boolean),
  totalReservedMinuteAllocation: S.optional(S.Number),
  upcomingMinutesScheduled: S.optional(S.Number),
  totalScheduledMinutes: S.optional(S.Number),
  estimatedMinutesRemaining: S.optional(S.Number),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagsMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export class GetAgentConfigurationResponse extends S.Class<GetAgentConfigurationResponse>(
  "GetAgentConfigurationResponse",
)({ agentId: S.optional(S.String), taskingDocument: S.optional(S.String) }) {}
export class GetConfigResponse extends S.Class<GetConfigResponse>(
  "GetConfigResponse",
)({
  configId: S.String,
  configArn: S.String,
  name: S.String,
  configType: S.optional(S.String),
  configData: ConfigTypeData,
  tags: S.optional(TagsMap),
}) {}
export class ConfigIdResponse extends S.Class<ConfigIdResponse>(
  "ConfigIdResponse",
)({
  configId: S.optional(S.String),
  configType: S.optional(S.String),
  configArn: S.optional(S.String),
}) {}
export class ContactIdResponse extends S.Class<ContactIdResponse>(
  "ContactIdResponse",
)({ contactId: S.optional(S.String) }) {}
export class SecurityDetails extends S.Class<SecurityDetails>(
  "SecurityDetails",
)({
  subnetIds: SubnetList,
  securityGroupIds: SecurityGroupIdList,
  roleArn: S.String,
}) {}
export class SocketAddress extends S.Class<SocketAddress>("SocketAddress")({
  name: S.String,
  port: S.Number,
}) {}
export class DataflowEndpoint extends S.Class<DataflowEndpoint>(
  "DataflowEndpoint",
)({
  name: S.optional(S.String),
  address: S.optional(SocketAddress),
  status: S.optional(S.String),
  mtu: S.optional(S.Number),
}) {}
export class ConnectionDetails extends S.Class<ConnectionDetails>(
  "ConnectionDetails",
)({ socketAddress: SocketAddress, mtu: S.optional(S.Number) }) {}
export class IntegerRange extends S.Class<IntegerRange>("IntegerRange")({
  minimum: S.Number,
  maximum: S.Number,
}) {}
export class RangedSocketAddress extends S.Class<RangedSocketAddress>(
  "RangedSocketAddress",
)({ name: S.String, portRange: IntegerRange }) {}
export class RangedConnectionDetails extends S.Class<RangedConnectionDetails>(
  "RangedConnectionDetails",
)({ socketAddress: RangedSocketAddress, mtu: S.optional(S.Number) }) {}
export class AwsGroundStationAgentEndpoint extends S.Class<AwsGroundStationAgentEndpoint>(
  "AwsGroundStationAgentEndpoint",
)({
  name: S.String,
  egressAddress: ConnectionDetails,
  ingressAddress: RangedConnectionDetails,
  agentStatus: S.optional(S.String),
  auditResults: S.optional(S.String),
}) {}
export class UplinkConnectionDetails extends S.Class<UplinkConnectionDetails>(
  "UplinkConnectionDetails",
)({
  ingressAddressAndPort: ConnectionDetails,
  agentIpAndPortAddress: RangedConnectionDetails,
}) {}
export const UplinkDataflowDetails = S.Union(
  S.Struct({ agentConnectionDetails: UplinkConnectionDetails }),
);
export class UplinkAwsGroundStationAgentEndpointDetails extends S.Class<UplinkAwsGroundStationAgentEndpointDetails>(
  "UplinkAwsGroundStationAgentEndpointDetails",
)({
  name: S.String,
  dataflowDetails: UplinkDataflowDetails,
  agentStatus: S.optional(S.String),
  auditResults: S.optional(S.String),
}) {}
export class DownlinkConnectionDetails extends S.Class<DownlinkConnectionDetails>(
  "DownlinkConnectionDetails",
)({
  agentIpAndPortAddress: RangedConnectionDetails,
  egressAddressAndPort: ConnectionDetails,
}) {}
export const DownlinkDataflowDetails = S.Union(
  S.Struct({ agentConnectionDetails: DownlinkConnectionDetails }),
);
export class DownlinkAwsGroundStationAgentEndpointDetails extends S.Class<DownlinkAwsGroundStationAgentEndpointDetails>(
  "DownlinkAwsGroundStationAgentEndpointDetails",
)({
  name: S.String,
  dataflowDetails: DownlinkDataflowDetails,
  agentStatus: S.optional(S.String),
  auditResults: S.optional(S.String),
}) {}
export class EndpointDetails extends S.Class<EndpointDetails>(
  "EndpointDetails",
)({
  securityDetails: S.optional(SecurityDetails),
  endpoint: S.optional(DataflowEndpoint),
  awsGroundStationAgentEndpoint: S.optional(AwsGroundStationAgentEndpoint),
  uplinkAwsGroundStationAgentEndpoint: S.optional(
    UplinkAwsGroundStationAgentEndpointDetails,
  ),
  downlinkAwsGroundStationAgentEndpoint: S.optional(
    DownlinkAwsGroundStationAgentEndpointDetails,
  ),
  healthStatus: S.optional(S.String),
  healthReasons: S.optional(CapabilityHealthReasonList),
}) {}
export const EndpointDetailsList = S.Array(EndpointDetails);
export class GetDataflowEndpointGroupResponse extends S.Class<GetDataflowEndpointGroupResponse>(
  "GetDataflowEndpointGroupResponse",
)({
  dataflowEndpointGroupId: S.optional(S.String),
  dataflowEndpointGroupArn: S.optional(S.String),
  endpointsDetails: S.optional(EndpointDetailsList),
  tags: S.optional(TagsMap),
  contactPrePassDurationSeconds: S.optional(S.Number),
  contactPostPassDurationSeconds: S.optional(S.Number),
}) {}
export class DataflowEndpointGroupIdResponse extends S.Class<DataflowEndpointGroupIdResponse>(
  "DataflowEndpointGroupIdResponse",
)({ dataflowEndpointGroupId: S.optional(S.String) }) {}
export class EphemerisIdResponse extends S.Class<EphemerisIdResponse>(
  "EphemerisIdResponse",
)({ ephemerisId: S.optional(S.String) }) {}
export class CreateMissionProfileRequest extends S.Class<CreateMissionProfileRequest>(
  "CreateMissionProfileRequest",
)(
  {
    name: S.String,
    contactPrePassDurationSeconds: S.optional(S.Number),
    contactPostPassDurationSeconds: S.optional(S.Number),
    minimumViableContactDurationSeconds: S.Number,
    dataflowEdges: DataflowEdgeList,
    trackingConfigArn: S.String,
    tags: S.optional(TagsMap),
    streamsKmsKey: S.optional(KmsKey),
    streamsKmsRole: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/missionprofile" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMissionProfileResponse extends S.Class<GetMissionProfileResponse>(
  "GetMissionProfileResponse",
)({
  missionProfileId: S.optional(S.String),
  missionProfileArn: S.optional(S.String),
  name: S.optional(S.String),
  region: S.optional(S.String),
  contactPrePassDurationSeconds: S.optional(S.Number),
  contactPostPassDurationSeconds: S.optional(S.Number),
  minimumViableContactDurationSeconds: S.optional(S.Number),
  dataflowEdges: S.optional(DataflowEdgeList),
  trackingConfigArn: S.optional(S.String),
  tags: S.optional(TagsMap),
  streamsKmsKey: S.optional(KmsKey),
  streamsKmsRole: S.optional(S.String),
}) {}
export class MissionProfileIdResponse extends S.Class<MissionProfileIdResponse>(
  "MissionProfileIdResponse",
)({ missionProfileId: S.optional(S.String) }) {}
export class ComponentVersion extends S.Class<ComponentVersion>(
  "ComponentVersion",
)({ componentType: S.String, versions: VersionStringList }) {}
export const ComponentVersionList = S.Array(ComponentVersion);
export const SignatureMap = S.Record({ key: S.String, value: S.Boolean });
export class AzElEphemerisFilter extends S.Class<AzElEphemerisFilter>(
  "AzElEphemerisFilter",
)({ id: S.String }) {}
export class UplinkAwsGroundStationAgentEndpoint extends S.Class<UplinkAwsGroundStationAgentEndpoint>(
  "UplinkAwsGroundStationAgentEndpoint",
)({ name: S.String, dataflowDetails: UplinkDataflowDetails }) {}
export class DownlinkAwsGroundStationAgentEndpoint extends S.Class<DownlinkAwsGroundStationAgentEndpoint>(
  "DownlinkAwsGroundStationAgentEndpoint",
)({ name: S.String, dataflowDetails: DownlinkDataflowDetails }) {}
export class S3Object extends S.Class<S3Object>("S3Object")({
  bucket: S.optional(S.String),
  key: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export class OEMEphemeris extends S.Class<OEMEphemeris>("OEMEphemeris")({
  s3Object: S.optional(S3Object),
  oemData: S.optional(S.String),
}) {}
export class AgentDetails extends S.Class<AgentDetails>("AgentDetails")({
  agentVersion: S.String,
  instanceId: S.String,
  instanceType: S.String,
  reservedCpuCores: S.optional(AgentCpuCoresList),
  agentCpuCores: S.optional(AgentCpuCoresList),
  componentVersions: ComponentVersionList,
}) {}
export class AggregateStatus extends S.Class<AggregateStatus>(
  "AggregateStatus",
)({ status: S.String, signatureMap: S.optional(SignatureMap) }) {}
export class ConfigListItem extends S.Class<ConfigListItem>("ConfigListItem")({
  configId: S.optional(S.String),
  configType: S.optional(S.String),
  configArn: S.optional(S.String),
  name: S.optional(S.String),
}) {}
export const ConfigList = S.Array(ConfigListItem);
export class Elevation extends S.Class<Elevation>("Elevation")({
  value: S.Number,
  unit: S.String,
}) {}
export class EphemerisResponseData extends S.Class<EphemerisResponseData>(
  "EphemerisResponseData",
)({ ephemerisId: S.optional(S.String), ephemerisType: S.String }) {}
export const EphemerisFilter = S.Union(S.Struct({ azEl: AzElEphemerisFilter }));
export class DataflowEndpointListItem extends S.Class<DataflowEndpointListItem>(
  "DataflowEndpointListItem",
)({
  dataflowEndpointGroupId: S.optional(S.String),
  dataflowEndpointGroupArn: S.optional(S.String),
}) {}
export const DataflowEndpointGroupList = S.Array(DataflowEndpointListItem);
export const CreateEndpointDetails = S.Union(
  S.Struct({
    uplinkAwsGroundStationAgentEndpoint: UplinkAwsGroundStationAgentEndpoint,
  }),
  S.Struct({
    downlinkAwsGroundStationAgentEndpoint:
      DownlinkAwsGroundStationAgentEndpoint,
  }),
);
export const CreateEndpointDetailsList = S.Array(CreateEndpointDetails);
export class EphemerisErrorReason extends S.Class<EphemerisErrorReason>(
  "EphemerisErrorReason",
)({ errorCode: S.String, errorMessage: S.String }) {}
export const EphemerisErrorReasonList = S.Array(EphemerisErrorReason);
export class EphemerisItem extends S.Class<EphemerisItem>("EphemerisItem")({
  ephemerisId: S.optional(S.String),
  ephemerisType: S.optional(S.String),
  status: S.optional(S.String),
  priority: S.optional(S.Number),
  enabled: S.optional(S.Boolean),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  name: S.optional(S.String),
  sourceS3Object: S.optional(S3Object),
}) {}
export const EphemeridesList = S.Array(EphemerisItem);
export class GroundStationData extends S.Class<GroundStationData>(
  "GroundStationData",
)({
  groundStationId: S.optional(S.String),
  groundStationName: S.optional(S.String),
  region: S.optional(S.String),
}) {}
export const GroundStationList = S.Array(GroundStationData);
export class MissionProfileListItem extends S.Class<MissionProfileListItem>(
  "MissionProfileListItem",
)({
  missionProfileId: S.optional(S.String),
  missionProfileArn: S.optional(S.String),
  region: S.optional(S.String),
  name: S.optional(S.String),
}) {}
export const MissionProfileList = S.Array(MissionProfileListItem);
export class EphemerisMetaData extends S.Class<EphemerisMetaData>(
  "EphemerisMetaData",
)({
  source: S.String,
  ephemerisId: S.optional(S.String),
  epoch: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  name: S.optional(S.String),
}) {}
export class SatelliteListItem extends S.Class<SatelliteListItem>(
  "SatelliteListItem",
)({
  satelliteId: S.optional(S.String),
  satelliteArn: S.optional(S.String),
  noradSatelliteID: S.optional(S.Number),
  groundStations: S.optional(GroundStationIdList),
  currentEphemeris: S.optional(EphemerisMetaData),
}) {}
export const SatelliteList = S.Array(SatelliteListItem);
export class AzElProgramTrackSettings extends S.Class<AzElProgramTrackSettings>(
  "AzElProgramTrackSettings",
)({ ephemerisId: S.String }) {}
export class RegisterAgentRequest extends S.Class<RegisterAgentRequest>(
  "RegisterAgentRequest",
)(
  {
    discoveryData: DiscoveryData,
    agentDetails: AgentDetails,
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/agent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAgentStatusRequest extends S.Class<UpdateAgentStatusRequest>(
  "UpdateAgentStatusRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    taskId: S.String,
    aggregateStatus: AggregateStatus,
    componentStatuses: ComponentStatusList,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/agent/{agentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigsResponse extends S.Class<ListConfigsResponse>(
  "ListConfigsResponse",
)({ nextToken: S.optional(S.String), configList: S.optional(ConfigList) }) {}
export class ListContactsRequest extends S.Class<ListContactsRequest>(
  "ListContactsRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    statusList: StatusList,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    groundStation: S.optional(S.String),
    satelliteArn: S.optional(S.String),
    missionProfileArn: S.optional(S.String),
    ephemeris: S.optional(EphemerisFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contacts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataflowEndpointGroupsResponse extends S.Class<ListDataflowEndpointGroupsResponse>(
  "ListDataflowEndpointGroupsResponse",
)({
  nextToken: S.optional(S.String),
  dataflowEndpointGroupList: S.optional(DataflowEndpointGroupList),
}) {}
export class CreateDataflowEndpointGroupV2Request extends S.Class<CreateDataflowEndpointGroupV2Request>(
  "CreateDataflowEndpointGroupV2Request",
)(
  {
    endpoints: CreateEndpointDetailsList,
    contactPrePassDurationSeconds: S.optional(S.Number),
    contactPostPassDurationSeconds: S.optional(S.Number),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/dataflowEndpointGroupV2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEphemeridesResponse extends S.Class<ListEphemeridesResponse>(
  "ListEphemeridesResponse",
)({
  nextToken: S.optional(S.String),
  ephemerides: S.optional(EphemeridesList),
}) {}
export class ListGroundStationsResponse extends S.Class<ListGroundStationsResponse>(
  "ListGroundStationsResponse",
)({
  nextToken: S.optional(S.String),
  groundStationList: S.optional(GroundStationList),
}) {}
export class ListMissionProfilesResponse extends S.Class<ListMissionProfilesResponse>(
  "ListMissionProfilesResponse",
)({
  nextToken: S.optional(S.String),
  missionProfileList: S.optional(MissionProfileList),
}) {}
export class GetSatelliteResponse extends S.Class<GetSatelliteResponse>(
  "GetSatelliteResponse",
)({
  satelliteId: S.optional(S.String),
  satelliteArn: S.optional(S.String),
  noradSatelliteID: S.optional(S.Number),
  groundStations: S.optional(GroundStationIdList),
  currentEphemeris: S.optional(EphemerisMetaData),
}) {}
export class ListSatellitesResponse extends S.Class<ListSatellitesResponse>(
  "ListSatellitesResponse",
)({ nextToken: S.optional(S.String), satellites: S.optional(SatelliteList) }) {}
export const ProgramTrackSettings = S.Union(
  S.Struct({ azEl: AzElProgramTrackSettings }),
);
export class AntennaDemodDecodeDetails extends S.Class<AntennaDemodDecodeDetails>(
  "AntennaDemodDecodeDetails",
)({ outputNode: S.optional(S.String) }) {}
export class S3RecordingDetails extends S.Class<S3RecordingDetails>(
  "S3RecordingDetails",
)({ bucketArn: S.optional(S.String), keyTemplate: S.optional(S.String) }) {}
export const ConfigDetails = S.Union(
  S.Struct({ endpointDetails: EndpointDetails }),
  S.Struct({ antennaDemodDecodeDetails: AntennaDemodDecodeDetails }),
  S.Struct({ s3RecordingDetails: S3RecordingDetails }),
);
export class Destination extends S.Class<Destination>("Destination")({
  configType: S.optional(S.String),
  configId: S.optional(S.String),
  configDetails: S.optional(ConfigDetails),
  dataflowDestinationRegion: S.optional(S.String),
}) {}
export class EphemerisDescription extends S.Class<EphemerisDescription>(
  "EphemerisDescription",
)({
  sourceS3Object: S.optional(S3Object),
  ephemerisData: S.optional(S.String),
}) {}
export class TimeRange extends S.Class<TimeRange>("TimeRange")({
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class TrackingOverrides extends S.Class<TrackingOverrides>(
  "TrackingOverrides",
)({ programTrackSettings: ProgramTrackSettings }) {}
export const EphemerisTypeDescription = S.Union(
  S.Struct({ tle: EphemerisDescription }),
  S.Struct({ oem: EphemerisDescription }),
  S.Struct({ azEl: EphemerisDescription }),
);
export class TLEData extends S.Class<TLEData>("TLEData")({
  tleLine1: S.String,
  tleLine2: S.String,
  validTimeRange: TimeRange,
}) {}
export const TLEDataList = S.Array(TLEData);
export class RegisterAgentResponse extends S.Class<RegisterAgentResponse>(
  "RegisterAgentResponse",
)({ agentId: S.optional(S.String) }) {}
export class UpdateAgentStatusResponse extends S.Class<UpdateAgentStatusResponse>(
  "UpdateAgentStatusResponse",
)({ agentId: S.String }) {}
export class ReserveContactRequest extends S.Class<ReserveContactRequest>(
  "ReserveContactRequest",
)(
  {
    missionProfileArn: S.String,
    satelliteArn: S.optional(S.String),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    groundStation: S.String,
    tags: S.optional(TagsMap),
    trackingOverrides: S.optional(TrackingOverrides),
  },
  T.all(
    T.Http({ method: "POST", uri: "/contact" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataflowEndpointGroupV2Response extends S.Class<CreateDataflowEndpointGroupV2Response>(
  "CreateDataflowEndpointGroupV2Response",
)({ dataflowEndpointGroupId: S.optional(S.String) }) {}
export class DescribeEphemerisResponse extends S.Class<DescribeEphemerisResponse>(
  "DescribeEphemerisResponse",
)({
  ephemerisId: S.optional(S.String),
  satelliteId: S.optional(S.String),
  status: S.optional(S.String),
  priority: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  enabled: S.optional(S.Boolean),
  name: S.optional(S.String),
  tags: S.optional(TagsMap),
  suppliedData: S.optional(EphemerisTypeDescription),
  invalidReason: S.optional(S.String),
  errorReasons: S.optional(EphemerisErrorReasonList),
}) {}
export class TLEEphemeris extends S.Class<TLEEphemeris>("TLEEphemeris")({
  s3Object: S.optional(S3Object),
  tleData: S.optional(TLEDataList),
}) {}
export class ContactData extends S.Class<ContactData>("ContactData")({
  contactId: S.optional(S.String),
  missionProfileArn: S.optional(S.String),
  satelliteArn: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  prePassStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  postPassEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  groundStation: S.optional(S.String),
  contactStatus: S.optional(S.String),
  errorMessage: S.optional(S.String),
  maximumElevation: S.optional(Elevation),
  region: S.optional(S.String),
  tags: S.optional(TagsMap),
  visibilityStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  visibilityEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ephemeris: S.optional(EphemerisResponseData),
}) {}
export const ContactList = S.Array(ContactData);
export class ISO8601TimeRange extends S.Class<ISO8601TimeRange>(
  "ISO8601TimeRange",
)({
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class TimeAzEl extends S.Class<TimeAzEl>("TimeAzEl")({
  dt: S.Number,
  az: S.Number,
  el: S.Number,
}) {}
export const TimeAzElList = S.Array(TimeAzEl);
export class CreateConfigRequest extends S.Class<CreateConfigRequest>(
  "CreateConfigRequest",
)(
  { name: S.String, configData: ConfigTypeData, tags: S.optional(TagsMap) },
  T.all(
    T.Http({ method: "POST", uri: "/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListContactsResponse extends S.Class<ListContactsResponse>(
  "ListContactsResponse",
)({ nextToken: S.optional(S.String), contactList: S.optional(ContactList) }) {}
export class AzElSegment extends S.Class<AzElSegment>("AzElSegment")({
  referenceEpoch: S.Date.pipe(T.TimestampFormat("date-time")),
  validTimeRange: ISO8601TimeRange,
  azElList: TimeAzElList,
}) {}
export const AzElSegmentList = S.Array(AzElSegment);
export class Source extends S.Class<Source>("Source")({
  configType: S.optional(S.String),
  configId: S.optional(S.String),
  configDetails: S.optional(ConfigDetails),
  dataflowSourceRegion: S.optional(S.String),
}) {}
export class AzElSegments extends S.Class<AzElSegments>("AzElSegments")({
  angleUnit: S.String,
  azElSegmentList: AzElSegmentList,
}) {}
export class DataflowDetail extends S.Class<DataflowDetail>("DataflowDetail")({
  source: S.optional(Source),
  destination: S.optional(Destination),
  errorMessage: S.optional(S.String),
}) {}
export const DataflowList = S.Array(DataflowDetail);
export const AzElSegmentsData = S.Union(
  S.Struct({ s3Object: S3Object }),
  S.Struct({ azElData: AzElSegments }),
);
export class DescribeContactResponse extends S.Class<DescribeContactResponse>(
  "DescribeContactResponse",
)({
  contactId: S.optional(S.String),
  missionProfileArn: S.optional(S.String),
  satelliteArn: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  prePassStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  postPassEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  groundStation: S.optional(S.String),
  contactStatus: S.optional(S.String),
  errorMessage: S.optional(S.String),
  maximumElevation: S.optional(Elevation),
  tags: S.optional(TagsMap),
  region: S.optional(S.String),
  dataflowList: S.optional(DataflowList),
  visibilityStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  visibilityEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  trackingOverrides: S.optional(TrackingOverrides),
  ephemeris: S.optional(EphemerisResponseData),
}) {}
export class CreateDataflowEndpointGroupRequest extends S.Class<CreateDataflowEndpointGroupRequest>(
  "CreateDataflowEndpointGroupRequest",
)(
  {
    endpointDetails: EndpointDetailsList,
    tags: S.optional(TagsMap),
    contactPrePassDurationSeconds: S.optional(S.Number),
    contactPostPassDurationSeconds: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/dataflowEndpointGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AzElEphemeris extends S.Class<AzElEphemeris>("AzElEphemeris")({
  groundStation: S.String,
  data: AzElSegmentsData,
}) {}
export const EphemerisData = S.Union(
  S.Struct({ tle: TLEEphemeris }),
  S.Struct({ oem: OEMEphemeris }),
  S.Struct({ azEl: AzElEphemeris }),
);
export class CreateEphemerisRequest extends S.Class<CreateEphemerisRequest>(
  "CreateEphemerisRequest",
)(
  {
    satelliteId: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    priority: S.optional(S.Number),
    expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    name: S.String,
    kmsKeyArn: S.optional(S.String),
    ephemeris: S.optional(EphemerisData),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ephemeris" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}

//# Errors
export class DependencyException extends S.TaggedError<DependencyException>()(
  "DependencyException",
  { message: S.optional(S.String), parameterName: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String), parameterName: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { message: S.optional(S.String), parameterName: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String), parameterName: S.optional(S.String) },
) {}

//# Operations
/**
 * Deassigns a resource tag.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * For use by AWS Ground Station Agent and shouldn't be called directly.
 *
 * Registers a new agent with AWS Ground Station.
 */
export const registerAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterAgentRequest,
  output: RegisterAgentResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * For use by AWS Ground Station Agent and shouldn't be called directly.
 *
 * Update the status of the agent.
 */
export const updateAgentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAgentStatusRequest,
  output: UpdateAgentStatusResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieve information about an existing ephemeris.
 */
export const describeEphemeris = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEphemerisRequest,
  output: DescribeEphemerisResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Delete an ephemeris.
 */
export const deleteEphemeris = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEphemerisRequest,
  output: EphemerisIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of `Config` objects.
 */
export const listConfigs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListConfigsRequest,
    output: ListConfigsResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "configList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of `DataflowEndpoint` groups.
 */
export const listDataflowEndpointGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataflowEndpointGroupsRequest,
    output: ListDataflowEndpointGroupsResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "dataflowEndpointGroupList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List your existing ephemerides.
 */
export const listEphemerides = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEphemeridesRequest,
    output: ListEphemeridesResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "ephemerides",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of ground stations.
 */
export const listGroundStations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGroundStationsRequest,
    output: ListGroundStationsResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "groundStationList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of mission profiles.
 */
export const listMissionProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMissionProfilesRequest,
    output: ListMissionProfilesResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "missionProfileList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a satellite.
 */
export const getSatellite = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSatelliteRequest,
  output: GetSatelliteResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of satellites.
 */
export const listSatellites = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSatellitesRequest,
    output: ListSatellitesResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "satellites",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * For use by AWS Ground Station Agent and shouldn't be called directly.
 *
 * Gets the latest configuration information for a registered agent.
 */
export const getAgentConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAgentConfigurationRequest,
    output: GetAgentConfigurationResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns `Config` information.
 *
 * Only one `Config` response can be returned.
 */
export const getConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigRequest,
  output: GetConfigResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the `Config` used when scheduling contacts.
 *
 * Updating a `Config` will not update the execution parameters for existing future contacts scheduled with this `Config`.
 */
export const updateConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigRequest,
  output: ConfigIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Cancels a contact with a specified contact ID.
 */
export const cancelContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelContactRequest,
  output: ContactIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the dataflow endpoint group.
 */
export const getDataflowEndpointGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataflowEndpointGroupRequest,
    output: GetDataflowEndpointGroupResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a dataflow endpoint group.
 */
export const deleteDataflowEndpointGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataflowEndpointGroupRequest,
    output: DataflowEndpointGroupIdResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Update an existing ephemeris.
 */
export const updateEphemeris = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEphemerisRequest,
  output: EphemerisIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a mission profile.
 *
 * `dataflowEdges` is a list of lists of strings. Each lower level list of strings has two elements: a *from* ARN and a *to* ARN.
 */
export const createMissionProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMissionProfileRequest,
    output: MissionProfileIdResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns a mission profile.
 */
export const getMissionProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMissionProfileRequest,
  output: GetMissionProfileResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates a mission profile.
 *
 * Updating a mission profile will not update the execution parameters for existing future contacts.
 */
export const updateMissionProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMissionProfileRequest,
    output: MissionProfileIdResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a `Config`.
 */
export const deleteConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigRequest,
  output: ConfigIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a mission profile.
 */
export const deleteMissionProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMissionProfileRequest,
    output: MissionProfileIdResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * For use by AWS Ground Station Agent and shouldn't be called directly.
 *
 * Gets a presigned URL for uploading agent task response logs.
 */
export const getAgentTaskResponseUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAgentTaskResponseUrlRequest,
    output: GetAgentTaskResponseUrlResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns the number of reserved minutes used by account.
 */
export const getMinuteUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMinuteUsageRequest,
  output: GetMinuteUsageResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of tags for a specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Assigns a tag to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Reserves a contact using specified parameters.
 */
export const reserveContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReserveContactRequest,
  output: ContactIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of contacts.
 *
 * If `statusList` contains AVAILABLE, the request must include `groundStation`, `missionprofileArn`, and `satelliteArn`.
 */
export const listContacts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListContactsRequest,
    output: ListContactsResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "contactList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a `DataflowEndpointGroupV2` containing the specified list of `DataflowEndpoint` objects.
 *
 * The `name` field in each endpoint is used in your mission profile `DataflowEndpointConfig` to specify which endpoints to use during a contact.
 *
 * When a contact uses multiple `DataflowEndpointConfig` objects, each `Config` must match a `DataflowEndpoint` in the same group.
 */
export const createDataflowEndpointGroupV2 =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDataflowEndpointGroupV2Request,
    output: CreateDataflowEndpointGroupV2Response,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Creates a `Config` with the specified `configData` parameters.
 *
 * Only one type of `configData` can be specified.
 */
export const createConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigRequest,
  output: ConfigIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes an existing contact.
 */
export const describeContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeContactRequest,
  output: DescribeContactResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a `DataflowEndpoint` group containing the specified list of `DataflowEndpoint` objects.
 *
 * The `name` field in each endpoint is used in your mission profile `DataflowEndpointConfig` to specify which endpoints to use during a contact.
 *
 * When a contact uses multiple `DataflowEndpointConfig` objects, each `Config` must match a `DataflowEndpoint` in the same group.
 */
export const createDataflowEndpointGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataflowEndpointGroupRequest,
    output: DataflowEndpointGroupIdResponse,
    errors: [
      DependencyException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Create an ephemeris with your specified EphemerisData.
 */
export const createEphemeris = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEphemerisRequest,
  output: EphemerisIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
