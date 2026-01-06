import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
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

//# Newtypes
export type Uuid = string;
export type Month = number;
export type Year = number;
export type AnyArn = string;
export type UnboundedString = string;
export type SafeName = string;
export type PaginationMaxResults = number;
export type PaginationToken = string;
export type MissionProfileArn = string;
export type satelliteArn = string;
export type GroundStationName = string;
export type DataflowEndpointGroupDurationInSeconds = number;
export type CustomerEphemerisPriority = number;
export type KeyArn = string;
export type EphemerisPriority = number;
export type DurationInSeconds = number;
export type PositiveDurationInSeconds = number;
export type ConfigArn = string;
export type RoleArn = string;
export type IpV4Address = string;
export type CapabilityArn = string;
export type VersionString = string;
export type InstanceId = string;
export type InstanceType = string;
export type ComponentTypeString = string;
export type KeyAliasArn = string;
export type KeyAliasName = string;
export type DataflowEndpointGroupArn = string;
export type AWSRegion = string;
export type noradSatelliteID = number;
export type BucketArn = string;
export type S3KeyPrefix = string;
export type ErrorString = string;
export type JsonString = string;
export type S3BucketName = string;
export type S3ObjectKey = string;
export type S3VersionId = string;
export type TleLineOne = string;
export type TleLineTwo = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type StatusList = string[];
export const StatusList = S.Array(S.String);
export type EphemerisStatusList = string[];
export const EphemerisStatusList = S.Array(S.String);
export type DataflowEdge = string[];
export const DataflowEdge = S.Array(S.String);
export type DataflowEdgeList = DataflowEdge[];
export const DataflowEdgeList = S.Array(DataflowEdge);
export interface GetAgentTaskResponseUrlRequest {
  agentId: string;
  taskId: string;
}
export const GetAgentTaskResponseUrlRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/agentResponseUrl/{agentId}/{taskId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAgentTaskResponseUrlRequest",
}) as any as S.Schema<GetAgentTaskResponseUrlRequest>;
export interface GetMinuteUsageRequest {
  month: number;
  year: number;
}
export const GetMinuteUsageRequest = S.suspend(() =>
  S.Struct({ month: S.Number, year: S.Number }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/minute-usage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMinuteUsageRequest",
}) as any as S.Schema<GetMinuteUsageRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface GetAgentConfigurationRequest {
  agentId: string;
}
export const GetAgentConfigurationRequest = S.suspend(() =>
  S.Struct({ agentId: S.String.pipe(T.HttpLabel("agentId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/agent/{agentId}/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAgentConfigurationRequest",
}) as any as S.Schema<GetAgentConfigurationRequest>;
export interface GetConfigRequest {
  configId: string;
  configType: string;
}
export const GetConfigRequest = S.suspend(() =>
  S.Struct({
    configId: S.String.pipe(T.HttpLabel("configId")),
    configType: S.String.pipe(T.HttpLabel("configType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/config/{configType}/{configId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfigRequest",
}) as any as S.Schema<GetConfigRequest>;
export interface Frequency {
  value: number;
  units: string;
}
export const Frequency = S.suspend(() =>
  S.Struct({ value: S.Number, units: S.String }),
).annotations({ identifier: "Frequency" }) as any as S.Schema<Frequency>;
export interface FrequencyBandwidth {
  value: number;
  units: string;
}
export const FrequencyBandwidth = S.suspend(() =>
  S.Struct({ value: S.Number, units: S.String }),
).annotations({
  identifier: "FrequencyBandwidth",
}) as any as S.Schema<FrequencyBandwidth>;
export interface SpectrumConfig {
  centerFrequency: Frequency;
  bandwidth: FrequencyBandwidth;
  polarization?: string;
}
export const SpectrumConfig = S.suspend(() =>
  S.Struct({
    centerFrequency: Frequency,
    bandwidth: FrequencyBandwidth,
    polarization: S.optional(S.String),
  }),
).annotations({
  identifier: "SpectrumConfig",
}) as any as S.Schema<SpectrumConfig>;
export interface AntennaDownlinkConfig {
  spectrumConfig: SpectrumConfig;
}
export const AntennaDownlinkConfig = S.suspend(() =>
  S.Struct({ spectrumConfig: SpectrumConfig }),
).annotations({
  identifier: "AntennaDownlinkConfig",
}) as any as S.Schema<AntennaDownlinkConfig>;
export interface TrackingConfig {
  autotrack: string;
}
export const TrackingConfig = S.suspend(() =>
  S.Struct({ autotrack: S.String }),
).annotations({
  identifier: "TrackingConfig",
}) as any as S.Schema<TrackingConfig>;
export interface DataflowEndpointConfig {
  dataflowEndpointName: string;
  dataflowEndpointRegion?: string;
}
export const DataflowEndpointConfig = S.suspend(() =>
  S.Struct({
    dataflowEndpointName: S.String,
    dataflowEndpointRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "DataflowEndpointConfig",
}) as any as S.Schema<DataflowEndpointConfig>;
export interface DemodulationConfig {
  unvalidatedJSON: string;
}
export const DemodulationConfig = S.suspend(() =>
  S.Struct({ unvalidatedJSON: S.String }),
).annotations({
  identifier: "DemodulationConfig",
}) as any as S.Schema<DemodulationConfig>;
export interface DecodeConfig {
  unvalidatedJSON: string;
}
export const DecodeConfig = S.suspend(() =>
  S.Struct({ unvalidatedJSON: S.String }),
).annotations({ identifier: "DecodeConfig" }) as any as S.Schema<DecodeConfig>;
export interface AntennaDownlinkDemodDecodeConfig {
  spectrumConfig: SpectrumConfig;
  demodulationConfig: DemodulationConfig;
  decodeConfig: DecodeConfig;
}
export const AntennaDownlinkDemodDecodeConfig = S.suspend(() =>
  S.Struct({
    spectrumConfig: SpectrumConfig,
    demodulationConfig: DemodulationConfig,
    decodeConfig: DecodeConfig,
  }),
).annotations({
  identifier: "AntennaDownlinkDemodDecodeConfig",
}) as any as S.Schema<AntennaDownlinkDemodDecodeConfig>;
export interface UplinkSpectrumConfig {
  centerFrequency: Frequency;
  polarization?: string;
}
export const UplinkSpectrumConfig = S.suspend(() =>
  S.Struct({ centerFrequency: Frequency, polarization: S.optional(S.String) }),
).annotations({
  identifier: "UplinkSpectrumConfig",
}) as any as S.Schema<UplinkSpectrumConfig>;
export interface Eirp {
  value: number;
  units: string;
}
export const Eirp = S.suspend(() =>
  S.Struct({ value: S.Number, units: S.String }),
).annotations({ identifier: "Eirp" }) as any as S.Schema<Eirp>;
export interface AntennaUplinkConfig {
  transmitDisabled?: boolean;
  spectrumConfig: UplinkSpectrumConfig;
  targetEirp: Eirp;
}
export const AntennaUplinkConfig = S.suspend(() =>
  S.Struct({
    transmitDisabled: S.optional(S.Boolean),
    spectrumConfig: UplinkSpectrumConfig,
    targetEirp: Eirp,
  }),
).annotations({
  identifier: "AntennaUplinkConfig",
}) as any as S.Schema<AntennaUplinkConfig>;
export interface UplinkEchoConfig {
  enabled: boolean;
  antennaUplinkConfigArn: string;
}
export const UplinkEchoConfig = S.suspend(() =>
  S.Struct({ enabled: S.Boolean, antennaUplinkConfigArn: S.String }),
).annotations({
  identifier: "UplinkEchoConfig",
}) as any as S.Schema<UplinkEchoConfig>;
export interface S3RecordingConfig {
  bucketArn: string;
  roleArn: string;
  prefix?: string;
}
export const S3RecordingConfig = S.suspend(() =>
  S.Struct({
    bucketArn: S.String,
    roleArn: S.String,
    prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "S3RecordingConfig",
}) as any as S.Schema<S3RecordingConfig>;
export type ConfigTypeData =
  | { antennaDownlinkConfig: AntennaDownlinkConfig }
  | { trackingConfig: TrackingConfig }
  | { dataflowEndpointConfig: DataflowEndpointConfig }
  | { antennaDownlinkDemodDecodeConfig: AntennaDownlinkDemodDecodeConfig }
  | { antennaUplinkConfig: AntennaUplinkConfig }
  | { uplinkEchoConfig: UplinkEchoConfig }
  | { s3RecordingConfig: S3RecordingConfig };
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
export interface UpdateConfigRequest {
  configId: string;
  name: string;
  configType: string;
  configData: (typeof ConfigTypeData)["Type"];
}
export const UpdateConfigRequest = S.suspend(() =>
  S.Struct({
    configId: S.String.pipe(T.HttpLabel("configId")),
    name: S.String,
    configType: S.String.pipe(T.HttpLabel("configType")),
    configData: ConfigTypeData,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/config/{configType}/{configId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigRequest",
}) as any as S.Schema<UpdateConfigRequest>;
export interface DeleteConfigRequest {
  configId: string;
  configType: string;
}
export const DeleteConfigRequest = S.suspend(() =>
  S.Struct({
    configId: S.String.pipe(T.HttpLabel("configId")),
    configType: S.String.pipe(T.HttpLabel("configType")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/config/{configType}/{configId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigRequest",
}) as any as S.Schema<DeleteConfigRequest>;
export interface ListConfigsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListConfigsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigsRequest",
}) as any as S.Schema<ListConfigsRequest>;
export interface DescribeContactRequest {
  contactId: string;
}
export const DescribeContactRequest = S.suspend(() =>
  S.Struct({ contactId: S.String.pipe(T.HttpLabel("contactId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/contact/{contactId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeContactRequest",
}) as any as S.Schema<DescribeContactRequest>;
export interface CancelContactRequest {
  contactId: string;
}
export const CancelContactRequest = S.suspend(() =>
  S.Struct({ contactId: S.String.pipe(T.HttpLabel("contactId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/contact/{contactId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelContactRequest",
}) as any as S.Schema<CancelContactRequest>;
export interface GetDataflowEndpointGroupRequest {
  dataflowEndpointGroupId: string;
}
export const GetDataflowEndpointGroupRequest = S.suspend(() =>
  S.Struct({
    dataflowEndpointGroupId: S.String.pipe(
      T.HttpLabel("dataflowEndpointGroupId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataflowEndpointGroupRequest",
}) as any as S.Schema<GetDataflowEndpointGroupRequest>;
export interface DeleteDataflowEndpointGroupRequest {
  dataflowEndpointGroupId: string;
}
export const DeleteDataflowEndpointGroupRequest = S.suspend(() =>
  S.Struct({
    dataflowEndpointGroupId: S.String.pipe(
      T.HttpLabel("dataflowEndpointGroupId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDataflowEndpointGroupRequest",
}) as any as S.Schema<DeleteDataflowEndpointGroupRequest>;
export interface ListDataflowEndpointGroupsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListDataflowEndpointGroupsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dataflowEndpointGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataflowEndpointGroupsRequest",
}) as any as S.Schema<ListDataflowEndpointGroupsRequest>;
export interface DescribeEphemerisRequest {
  ephemerisId: string;
}
export const DescribeEphemerisRequest = S.suspend(() =>
  S.Struct({ ephemerisId: S.String.pipe(T.HttpLabel("ephemerisId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ephemeris/{ephemerisId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEphemerisRequest",
}) as any as S.Schema<DescribeEphemerisRequest>;
export interface UpdateEphemerisRequest {
  ephemerisId: string;
  enabled: boolean;
  name?: string;
  priority?: number;
}
export const UpdateEphemerisRequest = S.suspend(() =>
  S.Struct({
    ephemerisId: S.String.pipe(T.HttpLabel("ephemerisId")),
    enabled: S.Boolean,
    name: S.optional(S.String),
    priority: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/ephemeris/{ephemerisId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEphemerisRequest",
}) as any as S.Schema<UpdateEphemerisRequest>;
export interface DeleteEphemerisRequest {
  ephemerisId: string;
}
export const DeleteEphemerisRequest = S.suspend(() =>
  S.Struct({ ephemerisId: S.String.pipe(T.HttpLabel("ephemerisId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/ephemeris/{ephemerisId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEphemerisRequest",
}) as any as S.Schema<DeleteEphemerisRequest>;
export interface ListEphemeridesRequest {
  satelliteId?: string;
  ephemerisType?: string;
  startTime: Date;
  endTime: Date;
  statusList?: EphemerisStatusList;
  maxResults?: number;
  nextToken?: string;
}
export const ListEphemeridesRequest = S.suspend(() =>
  S.Struct({
    satelliteId: S.optional(S.String),
    ephemerisType: S.optional(S.String),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    statusList: S.optional(EphemerisStatusList),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ephemerides" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEphemeridesRequest",
}) as any as S.Schema<ListEphemeridesRequest>;
export interface ListGroundStationsRequest {
  satelliteId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListGroundStationsRequest = S.suspend(() =>
  S.Struct({
    satelliteId: S.optional(S.String).pipe(T.HttpQuery("satelliteId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/groundstation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGroundStationsRequest",
}) as any as S.Schema<ListGroundStationsRequest>;
export interface GetMissionProfileRequest {
  missionProfileId: string;
}
export const GetMissionProfileRequest = S.suspend(() =>
  S.Struct({
    missionProfileId: S.String.pipe(T.HttpLabel("missionProfileId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/missionprofile/{missionProfileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMissionProfileRequest",
}) as any as S.Schema<GetMissionProfileRequest>;
export type KmsKey =
  | { kmsKeyArn: string }
  | { kmsAliasArn: string }
  | { kmsAliasName: string };
export const KmsKey = S.Union(
  S.Struct({ kmsKeyArn: S.String }),
  S.Struct({ kmsAliasArn: S.String }),
  S.Struct({ kmsAliasName: S.String }),
);
export interface UpdateMissionProfileRequest {
  missionProfileId: string;
  name?: string;
  contactPrePassDurationSeconds?: number;
  contactPostPassDurationSeconds?: number;
  minimumViableContactDurationSeconds?: number;
  dataflowEdges?: DataflowEdgeList;
  trackingConfigArn?: string;
  streamsKmsKey?: (typeof KmsKey)["Type"];
  streamsKmsRole?: string;
}
export const UpdateMissionProfileRequest = S.suspend(() =>
  S.Struct({
    missionProfileId: S.String.pipe(T.HttpLabel("missionProfileId")),
    name: S.optional(S.String),
    contactPrePassDurationSeconds: S.optional(S.Number),
    contactPostPassDurationSeconds: S.optional(S.Number),
    minimumViableContactDurationSeconds: S.optional(S.Number),
    dataflowEdges: S.optional(DataflowEdgeList),
    trackingConfigArn: S.optional(S.String),
    streamsKmsKey: S.optional(KmsKey),
    streamsKmsRole: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/missionprofile/{missionProfileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMissionProfileRequest",
}) as any as S.Schema<UpdateMissionProfileRequest>;
export interface DeleteMissionProfileRequest {
  missionProfileId: string;
}
export const DeleteMissionProfileRequest = S.suspend(() =>
  S.Struct({
    missionProfileId: S.String.pipe(T.HttpLabel("missionProfileId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/missionprofile/{missionProfileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMissionProfileRequest",
}) as any as S.Schema<DeleteMissionProfileRequest>;
export interface ListMissionProfilesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListMissionProfilesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/missionprofile" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMissionProfilesRequest",
}) as any as S.Schema<ListMissionProfilesRequest>;
export interface GetSatelliteRequest {
  satelliteId: string;
}
export const GetSatelliteRequest = S.suspend(() =>
  S.Struct({ satelliteId: S.String.pipe(T.HttpLabel("satelliteId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/satellite/{satelliteId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSatelliteRequest",
}) as any as S.Schema<GetSatelliteRequest>;
export interface ListSatellitesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListSatellitesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/satellite" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSatellitesRequest",
}) as any as S.Schema<ListSatellitesRequest>;
export type IpAddressList = string[];
export const IpAddressList = S.Array(S.String);
export type CapabilityArnList = string[];
export const CapabilityArnList = S.Array(S.String);
export type AgentCpuCoresList = number[];
export const AgentCpuCoresList = S.Array(S.Number);
export type CapabilityHealthReasonList = string[];
export const CapabilityHealthReasonList = S.Array(S.String);
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface DiscoveryData {
  publicIpAddresses: IpAddressList;
  privateIpAddresses: IpAddressList;
  capabilityArns: CapabilityArnList;
}
export const DiscoveryData = S.suspend(() =>
  S.Struct({
    publicIpAddresses: IpAddressList,
    privateIpAddresses: IpAddressList,
    capabilityArns: CapabilityArnList,
  }),
).annotations({
  identifier: "DiscoveryData",
}) as any as S.Schema<DiscoveryData>;
export interface ComponentStatusData {
  componentType: string;
  capabilityArn: string;
  status: string;
  bytesSent?: number;
  bytesReceived?: number;
  packetsDropped?: number;
  dataflowId: string;
}
export const ComponentStatusData = S.suspend(() =>
  S.Struct({
    componentType: S.String,
    capabilityArn: S.String,
    status: S.String,
    bytesSent: S.optional(S.Number),
    bytesReceived: S.optional(S.Number),
    packetsDropped: S.optional(S.Number),
    dataflowId: S.String,
  }),
).annotations({
  identifier: "ComponentStatusData",
}) as any as S.Schema<ComponentStatusData>;
export type ComponentStatusList = ComponentStatusData[];
export const ComponentStatusList = S.Array(ComponentStatusData);
export type GroundStationIdList = string[];
export const GroundStationIdList = S.Array(S.String);
export type VersionStringList = string[];
export const VersionStringList = S.Array(S.String);
export type SubnetList = string[];
export const SubnetList = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface GetAgentTaskResponseUrlResponse {
  agentId: string;
  taskId: string;
  presignedLogUrl: string;
}
export const GetAgentTaskResponseUrlResponse = S.suspend(() =>
  S.Struct({ agentId: S.String, taskId: S.String, presignedLogUrl: S.String }),
).annotations({
  identifier: "GetAgentTaskResponseUrlResponse",
}) as any as S.Schema<GetAgentTaskResponseUrlResponse>;
export interface GetMinuteUsageResponse {
  isReservedMinutesCustomer?: boolean;
  totalReservedMinuteAllocation?: number;
  upcomingMinutesScheduled?: number;
  totalScheduledMinutes?: number;
  estimatedMinutesRemaining?: number;
}
export const GetMinuteUsageResponse = S.suspend(() =>
  S.Struct({
    isReservedMinutesCustomer: S.optional(S.Boolean),
    totalReservedMinuteAllocation: S.optional(S.Number),
    upcomingMinutesScheduled: S.optional(S.Number),
    totalScheduledMinutes: S.optional(S.Number),
    estimatedMinutesRemaining: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetMinuteUsageResponse",
}) as any as S.Schema<GetMinuteUsageResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagsMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagsMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagsMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface GetAgentConfigurationResponse {
  agentId?: string;
  taskingDocument?: string;
}
export const GetAgentConfigurationResponse = S.suspend(() =>
  S.Struct({
    agentId: S.optional(S.String),
    taskingDocument: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAgentConfigurationResponse",
}) as any as S.Schema<GetAgentConfigurationResponse>;
export interface GetConfigResponse {
  configId: string;
  configArn: string;
  name: string;
  configType?: string;
  configData: (typeof ConfigTypeData)["Type"];
  tags?: TagsMap;
}
export const GetConfigResponse = S.suspend(() =>
  S.Struct({
    configId: S.String,
    configArn: S.String,
    name: S.String,
    configType: S.optional(S.String),
    configData: ConfigTypeData,
    tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "GetConfigResponse",
}) as any as S.Schema<GetConfigResponse>;
export interface ConfigIdResponse {
  configId?: string;
  configType?: string;
  configArn?: string;
}
export const ConfigIdResponse = S.suspend(() =>
  S.Struct({
    configId: S.optional(S.String),
    configType: S.optional(S.String),
    configArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigIdResponse",
}) as any as S.Schema<ConfigIdResponse>;
export interface ContactIdResponse {
  contactId?: string;
}
export const ContactIdResponse = S.suspend(() =>
  S.Struct({ contactId: S.optional(S.String) }),
).annotations({
  identifier: "ContactIdResponse",
}) as any as S.Schema<ContactIdResponse>;
export interface SecurityDetails {
  subnetIds: SubnetList;
  securityGroupIds: SecurityGroupIdList;
  roleArn: string;
}
export const SecurityDetails = S.suspend(() =>
  S.Struct({
    subnetIds: SubnetList,
    securityGroupIds: SecurityGroupIdList,
    roleArn: S.String,
  }),
).annotations({
  identifier: "SecurityDetails",
}) as any as S.Schema<SecurityDetails>;
export interface SocketAddress {
  name: string;
  port: number;
}
export const SocketAddress = S.suspend(() =>
  S.Struct({ name: S.String, port: S.Number }),
).annotations({
  identifier: "SocketAddress",
}) as any as S.Schema<SocketAddress>;
export interface DataflowEndpoint {
  name?: string;
  address?: SocketAddress;
  status?: string;
  mtu?: number;
}
export const DataflowEndpoint = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    address: S.optional(SocketAddress),
    status: S.optional(S.String),
    mtu: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataflowEndpoint",
}) as any as S.Schema<DataflowEndpoint>;
export interface ConnectionDetails {
  socketAddress: SocketAddress;
  mtu?: number;
}
export const ConnectionDetails = S.suspend(() =>
  S.Struct({ socketAddress: SocketAddress, mtu: S.optional(S.Number) }),
).annotations({
  identifier: "ConnectionDetails",
}) as any as S.Schema<ConnectionDetails>;
export interface IntegerRange {
  minimum: number;
  maximum: number;
}
export const IntegerRange = S.suspend(() =>
  S.Struct({ minimum: S.Number, maximum: S.Number }),
).annotations({ identifier: "IntegerRange" }) as any as S.Schema<IntegerRange>;
export interface RangedSocketAddress {
  name: string;
  portRange: IntegerRange;
}
export const RangedSocketAddress = S.suspend(() =>
  S.Struct({ name: S.String, portRange: IntegerRange }),
).annotations({
  identifier: "RangedSocketAddress",
}) as any as S.Schema<RangedSocketAddress>;
export interface RangedConnectionDetails {
  socketAddress: RangedSocketAddress;
  mtu?: number;
}
export const RangedConnectionDetails = S.suspend(() =>
  S.Struct({ socketAddress: RangedSocketAddress, mtu: S.optional(S.Number) }),
).annotations({
  identifier: "RangedConnectionDetails",
}) as any as S.Schema<RangedConnectionDetails>;
export interface AwsGroundStationAgentEndpoint {
  name: string;
  egressAddress: ConnectionDetails;
  ingressAddress: RangedConnectionDetails;
  agentStatus?: string;
  auditResults?: string;
}
export const AwsGroundStationAgentEndpoint = S.suspend(() =>
  S.Struct({
    name: S.String,
    egressAddress: ConnectionDetails,
    ingressAddress: RangedConnectionDetails,
    agentStatus: S.optional(S.String),
    auditResults: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsGroundStationAgentEndpoint",
}) as any as S.Schema<AwsGroundStationAgentEndpoint>;
export interface UplinkConnectionDetails {
  ingressAddressAndPort: ConnectionDetails;
  agentIpAndPortAddress: RangedConnectionDetails;
}
export const UplinkConnectionDetails = S.suspend(() =>
  S.Struct({
    ingressAddressAndPort: ConnectionDetails,
    agentIpAndPortAddress: RangedConnectionDetails,
  }),
).annotations({
  identifier: "UplinkConnectionDetails",
}) as any as S.Schema<UplinkConnectionDetails>;
export type UplinkDataflowDetails = {
  agentConnectionDetails: UplinkConnectionDetails;
};
export const UplinkDataflowDetails = S.Union(
  S.Struct({ agentConnectionDetails: UplinkConnectionDetails }),
);
export interface UplinkAwsGroundStationAgentEndpointDetails {
  name: string;
  dataflowDetails: (typeof UplinkDataflowDetails)["Type"];
  agentStatus?: string;
  auditResults?: string;
}
export const UplinkAwsGroundStationAgentEndpointDetails = S.suspend(() =>
  S.Struct({
    name: S.String,
    dataflowDetails: UplinkDataflowDetails,
    agentStatus: S.optional(S.String),
    auditResults: S.optional(S.String),
  }),
).annotations({
  identifier: "UplinkAwsGroundStationAgentEndpointDetails",
}) as any as S.Schema<UplinkAwsGroundStationAgentEndpointDetails>;
export interface DownlinkConnectionDetails {
  agentIpAndPortAddress: RangedConnectionDetails;
  egressAddressAndPort: ConnectionDetails;
}
export const DownlinkConnectionDetails = S.suspend(() =>
  S.Struct({
    agentIpAndPortAddress: RangedConnectionDetails,
    egressAddressAndPort: ConnectionDetails,
  }),
).annotations({
  identifier: "DownlinkConnectionDetails",
}) as any as S.Schema<DownlinkConnectionDetails>;
export type DownlinkDataflowDetails = {
  agentConnectionDetails: DownlinkConnectionDetails;
};
export const DownlinkDataflowDetails = S.Union(
  S.Struct({ agentConnectionDetails: DownlinkConnectionDetails }),
);
export interface DownlinkAwsGroundStationAgentEndpointDetails {
  name: string;
  dataflowDetails: (typeof DownlinkDataflowDetails)["Type"];
  agentStatus?: string;
  auditResults?: string;
}
export const DownlinkAwsGroundStationAgentEndpointDetails = S.suspend(() =>
  S.Struct({
    name: S.String,
    dataflowDetails: DownlinkDataflowDetails,
    agentStatus: S.optional(S.String),
    auditResults: S.optional(S.String),
  }),
).annotations({
  identifier: "DownlinkAwsGroundStationAgentEndpointDetails",
}) as any as S.Schema<DownlinkAwsGroundStationAgentEndpointDetails>;
export interface EndpointDetails {
  securityDetails?: SecurityDetails;
  endpoint?: DataflowEndpoint;
  awsGroundStationAgentEndpoint?: AwsGroundStationAgentEndpoint;
  uplinkAwsGroundStationAgentEndpoint?: UplinkAwsGroundStationAgentEndpointDetails;
  downlinkAwsGroundStationAgentEndpoint?: DownlinkAwsGroundStationAgentEndpointDetails;
  healthStatus?: string;
  healthReasons?: CapabilityHealthReasonList;
}
export const EndpointDetails = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "EndpointDetails",
}) as any as S.Schema<EndpointDetails>;
export type EndpointDetailsList = EndpointDetails[];
export const EndpointDetailsList = S.Array(EndpointDetails);
export interface GetDataflowEndpointGroupResponse {
  dataflowEndpointGroupId?: string;
  dataflowEndpointGroupArn?: string;
  endpointsDetails?: EndpointDetailsList;
  tags?: TagsMap;
  contactPrePassDurationSeconds?: number;
  contactPostPassDurationSeconds?: number;
}
export const GetDataflowEndpointGroupResponse = S.suspend(() =>
  S.Struct({
    dataflowEndpointGroupId: S.optional(S.String),
    dataflowEndpointGroupArn: S.optional(S.String),
    endpointsDetails: S.optional(EndpointDetailsList),
    tags: S.optional(TagsMap),
    contactPrePassDurationSeconds: S.optional(S.Number),
    contactPostPassDurationSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetDataflowEndpointGroupResponse",
}) as any as S.Schema<GetDataflowEndpointGroupResponse>;
export interface DataflowEndpointGroupIdResponse {
  dataflowEndpointGroupId?: string;
}
export const DataflowEndpointGroupIdResponse = S.suspend(() =>
  S.Struct({ dataflowEndpointGroupId: S.optional(S.String) }),
).annotations({
  identifier: "DataflowEndpointGroupIdResponse",
}) as any as S.Schema<DataflowEndpointGroupIdResponse>;
export interface EphemerisIdResponse {
  ephemerisId?: string;
}
export const EphemerisIdResponse = S.suspend(() =>
  S.Struct({ ephemerisId: S.optional(S.String) }),
).annotations({
  identifier: "EphemerisIdResponse",
}) as any as S.Schema<EphemerisIdResponse>;
export interface CreateMissionProfileRequest {
  name: string;
  contactPrePassDurationSeconds?: number;
  contactPostPassDurationSeconds?: number;
  minimumViableContactDurationSeconds: number;
  dataflowEdges: DataflowEdgeList;
  trackingConfigArn: string;
  tags?: TagsMap;
  streamsKmsKey?: (typeof KmsKey)["Type"];
  streamsKmsRole?: string;
}
export const CreateMissionProfileRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    contactPrePassDurationSeconds: S.optional(S.Number),
    contactPostPassDurationSeconds: S.optional(S.Number),
    minimumViableContactDurationSeconds: S.Number,
    dataflowEdges: DataflowEdgeList,
    trackingConfigArn: S.String,
    tags: S.optional(TagsMap),
    streamsKmsKey: S.optional(KmsKey),
    streamsKmsRole: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/missionprofile" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMissionProfileRequest",
}) as any as S.Schema<CreateMissionProfileRequest>;
export interface GetMissionProfileResponse {
  missionProfileId?: string;
  missionProfileArn?: string;
  name?: string;
  region?: string;
  contactPrePassDurationSeconds?: number;
  contactPostPassDurationSeconds?: number;
  minimumViableContactDurationSeconds?: number;
  dataflowEdges?: DataflowEdgeList;
  trackingConfigArn?: string;
  tags?: TagsMap;
  streamsKmsKey?: (typeof KmsKey)["Type"];
  streamsKmsRole?: string;
}
export const GetMissionProfileResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetMissionProfileResponse",
}) as any as S.Schema<GetMissionProfileResponse>;
export interface MissionProfileIdResponse {
  missionProfileId?: string;
}
export const MissionProfileIdResponse = S.suspend(() =>
  S.Struct({ missionProfileId: S.optional(S.String) }),
).annotations({
  identifier: "MissionProfileIdResponse",
}) as any as S.Schema<MissionProfileIdResponse>;
export interface ComponentVersion {
  componentType: string;
  versions: VersionStringList;
}
export const ComponentVersion = S.suspend(() =>
  S.Struct({ componentType: S.String, versions: VersionStringList }),
).annotations({
  identifier: "ComponentVersion",
}) as any as S.Schema<ComponentVersion>;
export type ComponentVersionList = ComponentVersion[];
export const ComponentVersionList = S.Array(ComponentVersion);
export type SignatureMap = { [key: string]: boolean };
export const SignatureMap = S.Record({ key: S.String, value: S.Boolean });
export interface AzElEphemerisFilter {
  id: string;
}
export const AzElEphemerisFilter = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "AzElEphemerisFilter",
}) as any as S.Schema<AzElEphemerisFilter>;
export interface UplinkAwsGroundStationAgentEndpoint {
  name: string;
  dataflowDetails: (typeof UplinkDataflowDetails)["Type"];
}
export const UplinkAwsGroundStationAgentEndpoint = S.suspend(() =>
  S.Struct({ name: S.String, dataflowDetails: UplinkDataflowDetails }),
).annotations({
  identifier: "UplinkAwsGroundStationAgentEndpoint",
}) as any as S.Schema<UplinkAwsGroundStationAgentEndpoint>;
export interface DownlinkAwsGroundStationAgentEndpoint {
  name: string;
  dataflowDetails: (typeof DownlinkDataflowDetails)["Type"];
}
export const DownlinkAwsGroundStationAgentEndpoint = S.suspend(() =>
  S.Struct({ name: S.String, dataflowDetails: DownlinkDataflowDetails }),
).annotations({
  identifier: "DownlinkAwsGroundStationAgentEndpoint",
}) as any as S.Schema<DownlinkAwsGroundStationAgentEndpoint>;
export interface S3Object {
  bucket?: string;
  key?: string;
  version?: string;
}
export const S3Object = S.suspend(() =>
  S.Struct({
    bucket: S.optional(S.String),
    key: S.optional(S.String),
    version: S.optional(S.String),
  }),
).annotations({ identifier: "S3Object" }) as any as S.Schema<S3Object>;
export interface OEMEphemeris {
  s3Object?: S3Object;
  oemData?: string;
}
export const OEMEphemeris = S.suspend(() =>
  S.Struct({ s3Object: S.optional(S3Object), oemData: S.optional(S.String) }),
).annotations({ identifier: "OEMEphemeris" }) as any as S.Schema<OEMEphemeris>;
export interface AgentDetails {
  agentVersion: string;
  instanceId: string;
  instanceType: string;
  reservedCpuCores?: AgentCpuCoresList;
  agentCpuCores?: AgentCpuCoresList;
  componentVersions: ComponentVersionList;
}
export const AgentDetails = S.suspend(() =>
  S.Struct({
    agentVersion: S.String,
    instanceId: S.String,
    instanceType: S.String,
    reservedCpuCores: S.optional(AgentCpuCoresList),
    agentCpuCores: S.optional(AgentCpuCoresList),
    componentVersions: ComponentVersionList,
  }),
).annotations({ identifier: "AgentDetails" }) as any as S.Schema<AgentDetails>;
export interface AggregateStatus {
  status: string;
  signatureMap?: SignatureMap;
}
export const AggregateStatus = S.suspend(() =>
  S.Struct({ status: S.String, signatureMap: S.optional(SignatureMap) }),
).annotations({
  identifier: "AggregateStatus",
}) as any as S.Schema<AggregateStatus>;
export interface ConfigListItem {
  configId?: string;
  configType?: string;
  configArn?: string;
  name?: string;
}
export const ConfigListItem = S.suspend(() =>
  S.Struct({
    configId: S.optional(S.String),
    configType: S.optional(S.String),
    configArn: S.optional(S.String),
    name: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigListItem",
}) as any as S.Schema<ConfigListItem>;
export type ConfigList = ConfigListItem[];
export const ConfigList = S.Array(ConfigListItem);
export interface Elevation {
  value: number;
  unit: string;
}
export const Elevation = S.suspend(() =>
  S.Struct({ value: S.Number, unit: S.String }),
).annotations({ identifier: "Elevation" }) as any as S.Schema<Elevation>;
export interface EphemerisResponseData {
  ephemerisId?: string;
  ephemerisType: string;
}
export const EphemerisResponseData = S.suspend(() =>
  S.Struct({ ephemerisId: S.optional(S.String), ephemerisType: S.String }),
).annotations({
  identifier: "EphemerisResponseData",
}) as any as S.Schema<EphemerisResponseData>;
export type EphemerisFilter = { azEl: AzElEphemerisFilter };
export const EphemerisFilter = S.Union(S.Struct({ azEl: AzElEphemerisFilter }));
export interface DataflowEndpointListItem {
  dataflowEndpointGroupId?: string;
  dataflowEndpointGroupArn?: string;
}
export const DataflowEndpointListItem = S.suspend(() =>
  S.Struct({
    dataflowEndpointGroupId: S.optional(S.String),
    dataflowEndpointGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DataflowEndpointListItem",
}) as any as S.Schema<DataflowEndpointListItem>;
export type DataflowEndpointGroupList = DataflowEndpointListItem[];
export const DataflowEndpointGroupList = S.Array(DataflowEndpointListItem);
export type CreateEndpointDetails =
  | { uplinkAwsGroundStationAgentEndpoint: UplinkAwsGroundStationAgentEndpoint }
  | {
      downlinkAwsGroundStationAgentEndpoint: DownlinkAwsGroundStationAgentEndpoint;
    };
export const CreateEndpointDetails = S.Union(
  S.Struct({
    uplinkAwsGroundStationAgentEndpoint: UplinkAwsGroundStationAgentEndpoint,
  }),
  S.Struct({
    downlinkAwsGroundStationAgentEndpoint:
      DownlinkAwsGroundStationAgentEndpoint,
  }),
);
export type CreateEndpointDetailsList =
  (typeof CreateEndpointDetails)["Type"][];
export const CreateEndpointDetailsList = S.Array(CreateEndpointDetails);
export interface EphemerisErrorReason {
  errorCode: string;
  errorMessage: string;
}
export const EphemerisErrorReason = S.suspend(() =>
  S.Struct({ errorCode: S.String, errorMessage: S.String }),
).annotations({
  identifier: "EphemerisErrorReason",
}) as any as S.Schema<EphemerisErrorReason>;
export type EphemerisErrorReasonList = EphemerisErrorReason[];
export const EphemerisErrorReasonList = S.Array(EphemerisErrorReason);
export interface EphemerisItem {
  ephemerisId?: string;
  ephemerisType?: string;
  status?: string;
  priority?: number;
  enabled?: boolean;
  creationTime?: Date;
  name?: string;
  sourceS3Object?: S3Object;
}
export const EphemerisItem = S.suspend(() =>
  S.Struct({
    ephemerisId: S.optional(S.String),
    ephemerisType: S.optional(S.String),
    status: S.optional(S.String),
    priority: S.optional(S.Number),
    enabled: S.optional(S.Boolean),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    name: S.optional(S.String),
    sourceS3Object: S.optional(S3Object),
  }),
).annotations({
  identifier: "EphemerisItem",
}) as any as S.Schema<EphemerisItem>;
export type EphemeridesList = EphemerisItem[];
export const EphemeridesList = S.Array(EphemerisItem);
export interface GroundStationData {
  groundStationId?: string;
  groundStationName?: string;
  region?: string;
}
export const GroundStationData = S.suspend(() =>
  S.Struct({
    groundStationId: S.optional(S.String),
    groundStationName: S.optional(S.String),
    region: S.optional(S.String),
  }),
).annotations({
  identifier: "GroundStationData",
}) as any as S.Schema<GroundStationData>;
export type GroundStationList = GroundStationData[];
export const GroundStationList = S.Array(GroundStationData);
export interface MissionProfileListItem {
  missionProfileId?: string;
  missionProfileArn?: string;
  region?: string;
  name?: string;
}
export const MissionProfileListItem = S.suspend(() =>
  S.Struct({
    missionProfileId: S.optional(S.String),
    missionProfileArn: S.optional(S.String),
    region: S.optional(S.String),
    name: S.optional(S.String),
  }),
).annotations({
  identifier: "MissionProfileListItem",
}) as any as S.Schema<MissionProfileListItem>;
export type MissionProfileList = MissionProfileListItem[];
export const MissionProfileList = S.Array(MissionProfileListItem);
export interface EphemerisMetaData {
  source: string;
  ephemerisId?: string;
  epoch?: Date;
  name?: string;
}
export const EphemerisMetaData = S.suspend(() =>
  S.Struct({
    source: S.String,
    ephemerisId: S.optional(S.String),
    epoch: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    name: S.optional(S.String),
  }),
).annotations({
  identifier: "EphemerisMetaData",
}) as any as S.Schema<EphemerisMetaData>;
export interface SatelliteListItem {
  satelliteId?: string;
  satelliteArn?: string;
  noradSatelliteID?: number;
  groundStations?: GroundStationIdList;
  currentEphemeris?: EphemerisMetaData;
}
export const SatelliteListItem = S.suspend(() =>
  S.Struct({
    satelliteId: S.optional(S.String),
    satelliteArn: S.optional(S.String),
    noradSatelliteID: S.optional(S.Number),
    groundStations: S.optional(GroundStationIdList),
    currentEphemeris: S.optional(EphemerisMetaData),
  }),
).annotations({
  identifier: "SatelliteListItem",
}) as any as S.Schema<SatelliteListItem>;
export type SatelliteList = SatelliteListItem[];
export const SatelliteList = S.Array(SatelliteListItem);
export interface AzElProgramTrackSettings {
  ephemerisId: string;
}
export const AzElProgramTrackSettings = S.suspend(() =>
  S.Struct({ ephemerisId: S.String }),
).annotations({
  identifier: "AzElProgramTrackSettings",
}) as any as S.Schema<AzElProgramTrackSettings>;
export interface RegisterAgentRequest {
  discoveryData: DiscoveryData;
  agentDetails: AgentDetails;
  tags?: TagsMap;
}
export const RegisterAgentRequest = S.suspend(() =>
  S.Struct({
    discoveryData: DiscoveryData,
    agentDetails: AgentDetails,
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/agent" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterAgentRequest",
}) as any as S.Schema<RegisterAgentRequest>;
export interface UpdateAgentStatusRequest {
  agentId: string;
  taskId: string;
  aggregateStatus: AggregateStatus;
  componentStatuses: ComponentStatusList;
}
export const UpdateAgentStatusRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    taskId: S.String,
    aggregateStatus: AggregateStatus,
    componentStatuses: ComponentStatusList,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/agent/{agentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAgentStatusRequest",
}) as any as S.Schema<UpdateAgentStatusRequest>;
export interface ListConfigsResponse {
  nextToken?: string;
  configList?: ConfigList;
}
export const ListConfigsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    configList: S.optional(ConfigList),
  }),
).annotations({
  identifier: "ListConfigsResponse",
}) as any as S.Schema<ListConfigsResponse>;
export interface ListContactsRequest {
  maxResults?: number;
  nextToken?: string;
  statusList: StatusList;
  startTime: Date;
  endTime: Date;
  groundStation?: string;
  satelliteArn?: string;
  missionProfileArn?: string;
  ephemeris?: (typeof EphemerisFilter)["Type"];
}
export const ListContactsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    statusList: StatusList,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    groundStation: S.optional(S.String),
    satelliteArn: S.optional(S.String),
    missionProfileArn: S.optional(S.String),
    ephemeris: S.optional(EphemerisFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/contacts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListContactsRequest",
}) as any as S.Schema<ListContactsRequest>;
export interface ListDataflowEndpointGroupsResponse {
  nextToken?: string;
  dataflowEndpointGroupList?: DataflowEndpointGroupList;
}
export const ListDataflowEndpointGroupsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    dataflowEndpointGroupList: S.optional(DataflowEndpointGroupList),
  }),
).annotations({
  identifier: "ListDataflowEndpointGroupsResponse",
}) as any as S.Schema<ListDataflowEndpointGroupsResponse>;
export interface CreateDataflowEndpointGroupV2Request {
  endpoints: CreateEndpointDetailsList;
  contactPrePassDurationSeconds?: number;
  contactPostPassDurationSeconds?: number;
  tags?: TagsMap;
}
export const CreateDataflowEndpointGroupV2Request = S.suspend(() =>
  S.Struct({
    endpoints: CreateEndpointDetailsList,
    contactPrePassDurationSeconds: S.optional(S.Number),
    contactPostPassDurationSeconds: S.optional(S.Number),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/dataflowEndpointGroupV2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataflowEndpointGroupV2Request",
}) as any as S.Schema<CreateDataflowEndpointGroupV2Request>;
export interface ListEphemeridesResponse {
  nextToken?: string;
  ephemerides?: EphemeridesList;
}
export const ListEphemeridesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    ephemerides: S.optional(EphemeridesList),
  }),
).annotations({
  identifier: "ListEphemeridesResponse",
}) as any as S.Schema<ListEphemeridesResponse>;
export interface ListGroundStationsResponse {
  nextToken?: string;
  groundStationList?: GroundStationList;
}
export const ListGroundStationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    groundStationList: S.optional(GroundStationList),
  }),
).annotations({
  identifier: "ListGroundStationsResponse",
}) as any as S.Schema<ListGroundStationsResponse>;
export interface ListMissionProfilesResponse {
  nextToken?: string;
  missionProfileList?: MissionProfileList;
}
export const ListMissionProfilesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    missionProfileList: S.optional(MissionProfileList),
  }),
).annotations({
  identifier: "ListMissionProfilesResponse",
}) as any as S.Schema<ListMissionProfilesResponse>;
export interface GetSatelliteResponse {
  satelliteId?: string;
  satelliteArn?: string;
  noradSatelliteID?: number;
  groundStations?: GroundStationIdList;
  currentEphemeris?: EphemerisMetaData;
}
export const GetSatelliteResponse = S.suspend(() =>
  S.Struct({
    satelliteId: S.optional(S.String),
    satelliteArn: S.optional(S.String),
    noradSatelliteID: S.optional(S.Number),
    groundStations: S.optional(GroundStationIdList),
    currentEphemeris: S.optional(EphemerisMetaData),
  }),
).annotations({
  identifier: "GetSatelliteResponse",
}) as any as S.Schema<GetSatelliteResponse>;
export interface ListSatellitesResponse {
  nextToken?: string;
  satellites?: SatelliteList;
}
export const ListSatellitesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    satellites: S.optional(SatelliteList),
  }),
).annotations({
  identifier: "ListSatellitesResponse",
}) as any as S.Schema<ListSatellitesResponse>;
export type ProgramTrackSettings = { azEl: AzElProgramTrackSettings };
export const ProgramTrackSettings = S.Union(
  S.Struct({ azEl: AzElProgramTrackSettings }),
);
export interface AntennaDemodDecodeDetails {
  outputNode?: string;
}
export const AntennaDemodDecodeDetails = S.suspend(() =>
  S.Struct({ outputNode: S.optional(S.String) }),
).annotations({
  identifier: "AntennaDemodDecodeDetails",
}) as any as S.Schema<AntennaDemodDecodeDetails>;
export interface S3RecordingDetails {
  bucketArn?: string;
  keyTemplate?: string;
}
export const S3RecordingDetails = S.suspend(() =>
  S.Struct({
    bucketArn: S.optional(S.String),
    keyTemplate: S.optional(S.String),
  }),
).annotations({
  identifier: "S3RecordingDetails",
}) as any as S.Schema<S3RecordingDetails>;
export type ConfigDetails =
  | { endpointDetails: EndpointDetails }
  | { antennaDemodDecodeDetails: AntennaDemodDecodeDetails }
  | { s3RecordingDetails: S3RecordingDetails };
export const ConfigDetails = S.Union(
  S.Struct({ endpointDetails: EndpointDetails }),
  S.Struct({ antennaDemodDecodeDetails: AntennaDemodDecodeDetails }),
  S.Struct({ s3RecordingDetails: S3RecordingDetails }),
);
export interface Destination {
  configType?: string;
  configId?: string;
  configDetails?: (typeof ConfigDetails)["Type"];
  dataflowDestinationRegion?: string;
}
export const Destination = S.suspend(() =>
  S.Struct({
    configType: S.optional(S.String),
    configId: S.optional(S.String),
    configDetails: S.optional(ConfigDetails),
    dataflowDestinationRegion: S.optional(S.String),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export interface EphemerisDescription {
  sourceS3Object?: S3Object;
  ephemerisData?: string;
}
export const EphemerisDescription = S.suspend(() =>
  S.Struct({
    sourceS3Object: S.optional(S3Object),
    ephemerisData: S.optional(S.String),
  }),
).annotations({
  identifier: "EphemerisDescription",
}) as any as S.Schema<EphemerisDescription>;
export interface TimeRange {
  startTime: Date;
  endTime: Date;
}
export const TimeRange = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "TimeRange" }) as any as S.Schema<TimeRange>;
export interface TrackingOverrides {
  programTrackSettings: (typeof ProgramTrackSettings)["Type"];
}
export const TrackingOverrides = S.suspend(() =>
  S.Struct({ programTrackSettings: ProgramTrackSettings }),
).annotations({
  identifier: "TrackingOverrides",
}) as any as S.Schema<TrackingOverrides>;
export type EphemerisTypeDescription =
  | { tle: EphemerisDescription }
  | { oem: EphemerisDescription }
  | { azEl: EphemerisDescription };
export const EphemerisTypeDescription = S.Union(
  S.Struct({ tle: EphemerisDescription }),
  S.Struct({ oem: EphemerisDescription }),
  S.Struct({ azEl: EphemerisDescription }),
);
export interface TLEData {
  tleLine1: string;
  tleLine2: string;
  validTimeRange: TimeRange;
}
export const TLEData = S.suspend(() =>
  S.Struct({
    tleLine1: S.String,
    tleLine2: S.String,
    validTimeRange: TimeRange,
  }),
).annotations({ identifier: "TLEData" }) as any as S.Schema<TLEData>;
export type TLEDataList = TLEData[];
export const TLEDataList = S.Array(TLEData);
export interface RegisterAgentResponse {
  agentId?: string;
}
export const RegisterAgentResponse = S.suspend(() =>
  S.Struct({ agentId: S.optional(S.String) }),
).annotations({
  identifier: "RegisterAgentResponse",
}) as any as S.Schema<RegisterAgentResponse>;
export interface UpdateAgentStatusResponse {
  agentId: string;
}
export const UpdateAgentStatusResponse = S.suspend(() =>
  S.Struct({ agentId: S.String }),
).annotations({
  identifier: "UpdateAgentStatusResponse",
}) as any as S.Schema<UpdateAgentStatusResponse>;
export interface ReserveContactRequest {
  missionProfileArn: string;
  satelliteArn?: string;
  startTime: Date;
  endTime: Date;
  groundStation: string;
  tags?: TagsMap;
  trackingOverrides?: TrackingOverrides;
}
export const ReserveContactRequest = S.suspend(() =>
  S.Struct({
    missionProfileArn: S.String,
    satelliteArn: S.optional(S.String),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    groundStation: S.String,
    tags: S.optional(TagsMap),
    trackingOverrides: S.optional(TrackingOverrides),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/contact" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReserveContactRequest",
}) as any as S.Schema<ReserveContactRequest>;
export interface CreateDataflowEndpointGroupV2Response {
  dataflowEndpointGroupId?: string;
}
export const CreateDataflowEndpointGroupV2Response = S.suspend(() =>
  S.Struct({ dataflowEndpointGroupId: S.optional(S.String) }),
).annotations({
  identifier: "CreateDataflowEndpointGroupV2Response",
}) as any as S.Schema<CreateDataflowEndpointGroupV2Response>;
export interface DescribeEphemerisResponse {
  ephemerisId?: string;
  satelliteId?: string;
  status?: string;
  priority?: number;
  creationTime?: Date;
  enabled?: boolean;
  name?: string;
  tags?: TagsMap;
  suppliedData?: (typeof EphemerisTypeDescription)["Type"];
  invalidReason?: string;
  errorReasons?: EphemerisErrorReasonList;
}
export const DescribeEphemerisResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribeEphemerisResponse",
}) as any as S.Schema<DescribeEphemerisResponse>;
export interface TLEEphemeris {
  s3Object?: S3Object;
  tleData?: TLEDataList;
}
export const TLEEphemeris = S.suspend(() =>
  S.Struct({
    s3Object: S.optional(S3Object),
    tleData: S.optional(TLEDataList),
  }),
).annotations({ identifier: "TLEEphemeris" }) as any as S.Schema<TLEEphemeris>;
export interface ContactData {
  contactId?: string;
  missionProfileArn?: string;
  satelliteArn?: string;
  startTime?: Date;
  endTime?: Date;
  prePassStartTime?: Date;
  postPassEndTime?: Date;
  groundStation?: string;
  contactStatus?: string;
  errorMessage?: string;
  maximumElevation?: Elevation;
  region?: string;
  tags?: TagsMap;
  visibilityStartTime?: Date;
  visibilityEndTime?: Date;
  ephemeris?: EphemerisResponseData;
}
export const ContactData = S.suspend(() =>
  S.Struct({
    contactId: S.optional(S.String),
    missionProfileArn: S.optional(S.String),
    satelliteArn: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    prePassStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    postPassEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
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
  }),
).annotations({ identifier: "ContactData" }) as any as S.Schema<ContactData>;
export type ContactList = ContactData[];
export const ContactList = S.Array(ContactData);
export interface ISO8601TimeRange {
  startTime: Date;
  endTime: Date;
}
export const ISO8601TimeRange = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ISO8601TimeRange",
}) as any as S.Schema<ISO8601TimeRange>;
export interface TimeAzEl {
  dt: number;
  az: number;
  el: number;
}
export const TimeAzEl = S.suspend(() =>
  S.Struct({ dt: S.Number, az: S.Number, el: S.Number }),
).annotations({ identifier: "TimeAzEl" }) as any as S.Schema<TimeAzEl>;
export type TimeAzElList = TimeAzEl[];
export const TimeAzElList = S.Array(TimeAzEl);
export interface CreateConfigRequest {
  name: string;
  configData: (typeof ConfigTypeData)["Type"];
  tags?: TagsMap;
}
export const CreateConfigRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    configData: ConfigTypeData,
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigRequest",
}) as any as S.Schema<CreateConfigRequest>;
export interface ListContactsResponse {
  nextToken?: string;
  contactList?: ContactList;
}
export const ListContactsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    contactList: S.optional(ContactList),
  }),
).annotations({
  identifier: "ListContactsResponse",
}) as any as S.Schema<ListContactsResponse>;
export interface AzElSegment {
  referenceEpoch: Date;
  validTimeRange: ISO8601TimeRange;
  azElList: TimeAzElList;
}
export const AzElSegment = S.suspend(() =>
  S.Struct({
    referenceEpoch: S.Date.pipe(T.TimestampFormat("date-time")),
    validTimeRange: ISO8601TimeRange,
    azElList: TimeAzElList,
  }),
).annotations({ identifier: "AzElSegment" }) as any as S.Schema<AzElSegment>;
export type AzElSegmentList = AzElSegment[];
export const AzElSegmentList = S.Array(AzElSegment);
export interface Source {
  configType?: string;
  configId?: string;
  configDetails?: (typeof ConfigDetails)["Type"];
  dataflowSourceRegion?: string;
}
export const Source = S.suspend(() =>
  S.Struct({
    configType: S.optional(S.String),
    configId: S.optional(S.String),
    configDetails: S.optional(ConfigDetails),
    dataflowSourceRegion: S.optional(S.String),
  }),
).annotations({ identifier: "Source" }) as any as S.Schema<Source>;
export interface AzElSegments {
  angleUnit: string;
  azElSegmentList: AzElSegmentList;
}
export const AzElSegments = S.suspend(() =>
  S.Struct({ angleUnit: S.String, azElSegmentList: AzElSegmentList }),
).annotations({ identifier: "AzElSegments" }) as any as S.Schema<AzElSegments>;
export interface DataflowDetail {
  source?: Source;
  destination?: Destination;
  errorMessage?: string;
}
export const DataflowDetail = S.suspend(() =>
  S.Struct({
    source: S.optional(Source),
    destination: S.optional(Destination),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "DataflowDetail",
}) as any as S.Schema<DataflowDetail>;
export type DataflowList = DataflowDetail[];
export const DataflowList = S.Array(DataflowDetail);
export type AzElSegmentsData =
  | { s3Object: S3Object }
  | { azElData: AzElSegments };
export const AzElSegmentsData = S.Union(
  S.Struct({ s3Object: S3Object }),
  S.Struct({ azElData: AzElSegments }),
);
export interface DescribeContactResponse {
  contactId?: string;
  missionProfileArn?: string;
  satelliteArn?: string;
  startTime?: Date;
  endTime?: Date;
  prePassStartTime?: Date;
  postPassEndTime?: Date;
  groundStation?: string;
  contactStatus?: string;
  errorMessage?: string;
  maximumElevation?: Elevation;
  tags?: TagsMap;
  region?: string;
  dataflowList?: DataflowList;
  visibilityStartTime?: Date;
  visibilityEndTime?: Date;
  trackingOverrides?: TrackingOverrides;
  ephemeris?: EphemerisResponseData;
}
export const DescribeContactResponse = S.suspend(() =>
  S.Struct({
    contactId: S.optional(S.String),
    missionProfileArn: S.optional(S.String),
    satelliteArn: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    prePassStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    postPassEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
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
  }),
).annotations({
  identifier: "DescribeContactResponse",
}) as any as S.Schema<DescribeContactResponse>;
export interface CreateDataflowEndpointGroupRequest {
  endpointDetails: EndpointDetailsList;
  tags?: TagsMap;
  contactPrePassDurationSeconds?: number;
  contactPostPassDurationSeconds?: number;
}
export const CreateDataflowEndpointGroupRequest = S.suspend(() =>
  S.Struct({
    endpointDetails: EndpointDetailsList,
    tags: S.optional(TagsMap),
    contactPrePassDurationSeconds: S.optional(S.Number),
    contactPostPassDurationSeconds: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/dataflowEndpointGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataflowEndpointGroupRequest",
}) as any as S.Schema<CreateDataflowEndpointGroupRequest>;
export interface AzElEphemeris {
  groundStation: string;
  data: (typeof AzElSegmentsData)["Type"];
}
export const AzElEphemeris = S.suspend(() =>
  S.Struct({ groundStation: S.String, data: AzElSegmentsData }),
).annotations({
  identifier: "AzElEphemeris",
}) as any as S.Schema<AzElEphemeris>;
export type EphemerisData =
  | { tle: TLEEphemeris }
  | { oem: OEMEphemeris }
  | { azEl: AzElEphemeris };
export const EphemerisData = S.Union(
  S.Struct({ tle: TLEEphemeris }),
  S.Struct({ oem: OEMEphemeris }),
  S.Struct({ azEl: AzElEphemeris }),
);
export interface CreateEphemerisRequest {
  satelliteId?: string;
  enabled?: boolean;
  priority?: number;
  expirationTime?: Date;
  name: string;
  kmsKeyArn?: string;
  ephemeris?: (typeof EphemerisData)["Type"];
  tags?: TagsMap;
}
export const CreateEphemerisRequest = S.suspend(() =>
  S.Struct({
    satelliteId: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    priority: S.optional(S.Number),
    expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    name: S.String,
    kmsKeyArn: S.optional(S.String),
    ephemeris: S.optional(EphemerisData),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ephemeris" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEphemerisRequest",
}) as any as S.Schema<CreateEphemerisRequest>;

//# Errors
export class DependencyException extends S.TaggedError<DependencyException>()(
  "DependencyException",
  { message: S.optional(S.String), parameterName: S.optional(S.String) },
).pipe(C.withServerError) {}
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
).pipe(C.withConflictError) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { message: S.optional(S.String), parameterName: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String), parameterName: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Deassigns a resource tag.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const registerAgent: (
  input: RegisterAgentRequest,
) => Effect.Effect<
  RegisterAgentResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAgentStatus: (
  input: UpdateAgentStatusRequest,
) => Effect.Effect<
  UpdateAgentStatusResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeEphemeris: (
  input: DescribeEphemerisRequest,
) => Effect.Effect<
  DescribeEphemerisResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteEphemeris: (
  input: DeleteEphemerisRequest,
) => Effect.Effect<
  EphemerisIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listConfigs: {
  (
    input: ListConfigsRequest,
  ): Effect.Effect<
    ListConfigsResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigsRequest,
  ) => Stream.Stream<
    ListConfigsResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigsRequest,
  ) => Stream.Stream<
    ConfigListItem,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of `DataflowEndpoint` groups.
 */
export const listDataflowEndpointGroups: {
  (
    input: ListDataflowEndpointGroupsRequest,
  ): Effect.Effect<
    ListDataflowEndpointGroupsResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataflowEndpointGroupsRequest,
  ) => Stream.Stream<
    ListDataflowEndpointGroupsResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataflowEndpointGroupsRequest,
  ) => Stream.Stream<
    DataflowEndpointListItem,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listEphemerides: {
  (
    input: ListEphemeridesRequest,
  ): Effect.Effect<
    ListEphemeridesResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEphemeridesRequest,
  ) => Stream.Stream<
    ListEphemeridesResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEphemeridesRequest,
  ) => Stream.Stream<
    EphemerisItem,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of ground stations.
 */
export const listGroundStations: {
  (
    input: ListGroundStationsRequest,
  ): Effect.Effect<
    ListGroundStationsResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroundStationsRequest,
  ) => Stream.Stream<
    ListGroundStationsResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroundStationsRequest,
  ) => Stream.Stream<
    GroundStationData,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of mission profiles.
 */
export const listMissionProfiles: {
  (
    input: ListMissionProfilesRequest,
  ): Effect.Effect<
    ListMissionProfilesResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMissionProfilesRequest,
  ) => Stream.Stream<
    ListMissionProfilesResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMissionProfilesRequest,
  ) => Stream.Stream<
    MissionProfileListItem,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getSatellite: (
  input: GetSatelliteRequest,
) => Effect.Effect<
  GetSatelliteResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSatellites: {
  (
    input: ListSatellitesRequest,
  ): Effect.Effect<
    ListSatellitesResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSatellitesRequest,
  ) => Stream.Stream<
    ListSatellitesResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSatellitesRequest,
  ) => Stream.Stream<
    SatelliteListItem,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * For use by AWS Ground Station Agent and shouldn't be called directly.
 *
 * Gets the latest configuration information for a registered agent.
 */
export const getAgentConfiguration: (
  input: GetAgentConfigurationRequest,
) => Effect.Effect<
  GetAgentConfigurationResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentConfigurationRequest,
  output: GetAgentConfigurationResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns `Config` information.
 *
 * Only one `Config` response can be returned.
 */
export const getConfig: (
  input: GetConfigRequest,
) => Effect.Effect<
  GetConfigResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateConfig: (
  input: UpdateConfigRequest,
) => Effect.Effect<
  ConfigIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelContact: (
  input: CancelContactRequest,
) => Effect.Effect<
  ContactIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataflowEndpointGroup: (
  input: GetDataflowEndpointGroupRequest,
) => Effect.Effect<
  GetDataflowEndpointGroupResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataflowEndpointGroupRequest,
  output: GetDataflowEndpointGroupResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a dataflow endpoint group.
 */
export const deleteDataflowEndpointGroup: (
  input: DeleteDataflowEndpointGroupRequest,
) => Effect.Effect<
  DataflowEndpointGroupIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataflowEndpointGroupRequest,
  output: DataflowEndpointGroupIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Update an existing ephemeris.
 */
export const updateEphemeris: (
  input: UpdateEphemerisRequest,
) => Effect.Effect<
  EphemerisIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createMissionProfile: (
  input: CreateMissionProfileRequest,
) => Effect.Effect<
  MissionProfileIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMissionProfileRequest,
  output: MissionProfileIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a mission profile.
 */
export const getMissionProfile: (
  input: GetMissionProfileRequest,
) => Effect.Effect<
  GetMissionProfileResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateMissionProfile: (
  input: UpdateMissionProfileRequest,
) => Effect.Effect<
  MissionProfileIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMissionProfileRequest,
  output: MissionProfileIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a `Config`.
 */
export const deleteConfig: (
  input: DeleteConfigRequest,
) => Effect.Effect<
  ConfigIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMissionProfile: (
  input: DeleteMissionProfileRequest,
) => Effect.Effect<
  MissionProfileIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMissionProfileRequest,
  output: MissionProfileIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * For use by AWS Ground Station Agent and shouldn't be called directly.
 *
 * Gets a presigned URL for uploading agent task response logs.
 */
export const getAgentTaskResponseUrl: (
  input: GetAgentTaskResponseUrlRequest,
) => Effect.Effect<
  GetAgentTaskResponseUrlResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentTaskResponseUrlRequest,
  output: GetAgentTaskResponseUrlResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the number of reserved minutes used by account.
 */
export const getMinuteUsage: (
  input: GetMinuteUsageRequest,
) => Effect.Effect<
  GetMinuteUsageResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const reserveContact: (
  input: ReserveContactRequest,
) => Effect.Effect<
  ContactIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listContacts: {
  (
    input: ListContactsRequest,
  ): Effect.Effect<
    ListContactsResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListContactsRequest,
  ) => Stream.Stream<
    ListContactsResponse,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListContactsRequest,
  ) => Stream.Stream<
    ContactData,
    | DependencyException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates a `DataflowEndpointGroupV2` containing the specified list of `DataflowEndpoint` objects.
 *
 * The `name` field in each endpoint is used in your mission profile `DataflowEndpointConfig` to specify which endpoints to use during a contact.
 *
 * When a contact uses multiple `DataflowEndpointConfig` objects, each `Config` must match a `DataflowEndpoint` in the same group.
 */
export const createDataflowEndpointGroupV2: (
  input: CreateDataflowEndpointGroupV2Request,
) => Effect.Effect<
  CreateDataflowEndpointGroupV2Response,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createConfig: (
  input: CreateConfigRequest,
) => Effect.Effect<
  ConfigIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeContact: (
  input: DescribeContactRequest,
) => Effect.Effect<
  DescribeContactResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataflowEndpointGroup: (
  input: CreateDataflowEndpointGroupRequest,
) => Effect.Effect<
  DataflowEndpointGroupIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataflowEndpointGroupRequest,
  output: DataflowEndpointGroupIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Create an ephemeris with your specified EphemerisData.
 */
export const createEphemeris: (
  input: CreateEphemerisRequest,
) => Effect.Effect<
  EphemerisIdResponse,
  | DependencyException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEphemerisRequest,
  output: EphemerisIdResponse,
  errors: [
    DependencyException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
