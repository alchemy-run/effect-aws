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
const ns = T.XmlNamespace("http://devicefarm.amazonaws.com/doc/2015-06-23/");
const svc = T.AwsApiService({
  sdkId: "Device Farm",
  serviceShapeName: "DeviceFarm_20150623",
});
const auth = T.AwsAuthSigv4({ name: "devicefarm" });
const ver = T.ServiceVersion("2015-06-23");
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
                        url: "https://devicefarm-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://devicefarm-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://devicefarm.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://devicefarm.{Region}.{PartitionResult#dnsSuffix}",
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
export type AmazonResourceName = string;
export type Name = string;
export type Message = string;
export type Integer = number;
export type Long = number;
export type PercentInteger = number;
export type JobTimeoutMinutes = number;
export type AmazonRoleResourceName = string;
export type ResourceName = string;
export type ResourceDescription = string;
export type DeviceFarmArn = string;
export type TestGridUrlExpiresInSecondsInput = number;
export type ContentType = string;
export type VPCEConfigurationName = string;
export type VPCEServiceName = string;
export type ServiceDnsName = string;
export type VPCEConfigurationDescription = string;
export type PaginationToken = string;
export type ResourceId = string;
export type MaxPageSize = number;
export type OfferingIdentifier = string;
export type OfferingPromotionIdentifier = string;
export type TagKey = string;
export type SecurityGroupId = string;
export type SubnetId = string;
export type NonEmptyString = string;
export type EnvironmentVariableName = string;
export type EnvironmentVariableValue = string;
export type AWSAccountNumber = string;
export type Filter = string;
export type TagValue = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type DeviceProxyHost = string;
export type DeviceProxyPort = number;
export type Double = number;
export type SensitiveURL = string | Redacted.Redacted<string>;
export type Metadata = string;
export type URL = string;
export type TransactionIdentifier = string;
export type ExceptionMessage = string;

//# Schemas
export interface GetAccountSettingsRequest {}
export const GetAccountSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountSettingsRequest",
}) as any as S.Schema<GetAccountSettingsRequest>;
export type PackageIds = string[];
export const PackageIds = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type InstanceLabels = string[];
export const InstanceLabels = S.Array(S.String);
export interface CreateInstanceProfileRequest {
  name: string;
  description?: string;
  packageCleanup?: boolean;
  excludeAppPackagesFromCleanup?: PackageIds;
  rebootAfterUse?: boolean;
}
export const CreateInstanceProfileRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    packageCleanup: S.optional(S.Boolean),
    excludeAppPackagesFromCleanup: S.optional(PackageIds),
    rebootAfterUse: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInstanceProfileRequest",
}) as any as S.Schema<CreateInstanceProfileRequest>;
export interface CreateNetworkProfileRequest {
  projectArn: string;
  name: string;
  description?: string;
  type?: string;
  uplinkBandwidthBits?: number;
  downlinkBandwidthBits?: number;
  uplinkDelayMs?: number;
  downlinkDelayMs?: number;
  uplinkJitterMs?: number;
  downlinkJitterMs?: number;
  uplinkLossPercent?: number;
  downlinkLossPercent?: number;
}
export const CreateNetworkProfileRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    type: S.optional(S.String),
    uplinkBandwidthBits: S.optional(S.Number),
    downlinkBandwidthBits: S.optional(S.Number),
    uplinkDelayMs: S.optional(S.Number),
    downlinkDelayMs: S.optional(S.Number),
    uplinkJitterMs: S.optional(S.Number),
    downlinkJitterMs: S.optional(S.Number),
    uplinkLossPercent: S.optional(S.Number),
    downlinkLossPercent: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNetworkProfileRequest",
}) as any as S.Schema<CreateNetworkProfileRequest>;
export interface CreateTestGridUrlRequest {
  projectArn: string;
  expiresInSeconds: number;
}
export const CreateTestGridUrlRequest = S.suspend(() =>
  S.Struct({ projectArn: S.String, expiresInSeconds: S.Number }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTestGridUrlRequest",
}) as any as S.Schema<CreateTestGridUrlRequest>;
export interface CreateUploadRequest {
  projectArn: string;
  name: string;
  type: string;
  contentType?: string;
}
export const CreateUploadRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    name: S.String,
    type: S.String,
    contentType: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUploadRequest",
}) as any as S.Schema<CreateUploadRequest>;
export interface CreateVPCEConfigurationRequest {
  vpceConfigurationName: string;
  vpceServiceName: string;
  serviceDnsName: string;
  vpceConfigurationDescription?: string;
}
export const CreateVPCEConfigurationRequest = S.suspend(() =>
  S.Struct({
    vpceConfigurationName: S.String,
    vpceServiceName: S.String,
    serviceDnsName: S.String,
    vpceConfigurationDescription: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVPCEConfigurationRequest",
}) as any as S.Schema<CreateVPCEConfigurationRequest>;
export interface DeleteDevicePoolRequest {
  arn: string;
}
export const DeleteDevicePoolRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDevicePoolRequest",
}) as any as S.Schema<DeleteDevicePoolRequest>;
export interface DeleteDevicePoolResult {}
export const DeleteDevicePoolResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDevicePoolResult",
}) as any as S.Schema<DeleteDevicePoolResult>;
export interface DeleteInstanceProfileRequest {
  arn: string;
}
export const DeleteInstanceProfileRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInstanceProfileRequest",
}) as any as S.Schema<DeleteInstanceProfileRequest>;
export interface DeleteInstanceProfileResult {}
export const DeleteInstanceProfileResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteInstanceProfileResult",
}) as any as S.Schema<DeleteInstanceProfileResult>;
export interface DeleteNetworkProfileRequest {
  arn: string;
}
export const DeleteNetworkProfileRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNetworkProfileRequest",
}) as any as S.Schema<DeleteNetworkProfileRequest>;
export interface DeleteNetworkProfileResult {}
export const DeleteNetworkProfileResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteNetworkProfileResult",
}) as any as S.Schema<DeleteNetworkProfileResult>;
export interface DeleteProjectRequest {
  arn: string;
}
export const DeleteProjectRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProjectRequest",
}) as any as S.Schema<DeleteProjectRequest>;
export interface DeleteProjectResult {}
export const DeleteProjectResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteProjectResult",
}) as any as S.Schema<DeleteProjectResult>;
export interface DeleteRemoteAccessSessionRequest {
  arn: string;
}
export const DeleteRemoteAccessSessionRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRemoteAccessSessionRequest",
}) as any as S.Schema<DeleteRemoteAccessSessionRequest>;
export interface DeleteRemoteAccessSessionResult {}
export const DeleteRemoteAccessSessionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRemoteAccessSessionResult",
}) as any as S.Schema<DeleteRemoteAccessSessionResult>;
export interface DeleteRunRequest {
  arn: string;
}
export const DeleteRunRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRunRequest",
}) as any as S.Schema<DeleteRunRequest>;
export interface DeleteRunResult {}
export const DeleteRunResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRunResult",
}) as any as S.Schema<DeleteRunResult>;
export interface DeleteTestGridProjectRequest {
  projectArn: string;
}
export const DeleteTestGridProjectRequest = S.suspend(() =>
  S.Struct({ projectArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTestGridProjectRequest",
}) as any as S.Schema<DeleteTestGridProjectRequest>;
export interface DeleteTestGridProjectResult {}
export const DeleteTestGridProjectResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTestGridProjectResult",
}) as any as S.Schema<DeleteTestGridProjectResult>;
export interface DeleteUploadRequest {
  arn: string;
}
export const DeleteUploadRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUploadRequest",
}) as any as S.Schema<DeleteUploadRequest>;
export interface DeleteUploadResult {}
export const DeleteUploadResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUploadResult",
}) as any as S.Schema<DeleteUploadResult>;
export interface DeleteVPCEConfigurationRequest {
  arn: string;
}
export const DeleteVPCEConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVPCEConfigurationRequest",
}) as any as S.Schema<DeleteVPCEConfigurationRequest>;
export interface DeleteVPCEConfigurationResult {}
export const DeleteVPCEConfigurationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteVPCEConfigurationResult",
}) as any as S.Schema<DeleteVPCEConfigurationResult>;
export interface GetDeviceRequest {
  arn: string;
}
export const GetDeviceRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeviceRequest",
}) as any as S.Schema<GetDeviceRequest>;
export interface GetDeviceInstanceRequest {
  arn: string;
}
export const GetDeviceInstanceRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeviceInstanceRequest",
}) as any as S.Schema<GetDeviceInstanceRequest>;
export interface GetDevicePoolRequest {
  arn: string;
}
export const GetDevicePoolRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDevicePoolRequest",
}) as any as S.Schema<GetDevicePoolRequest>;
export interface GetInstanceProfileRequest {
  arn: string;
}
export const GetInstanceProfileRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceProfileRequest",
}) as any as S.Schema<GetInstanceProfileRequest>;
export interface GetJobRequest {
  arn: string;
}
export const GetJobRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobRequest",
}) as any as S.Schema<GetJobRequest>;
export interface GetNetworkProfileRequest {
  arn: string;
}
export const GetNetworkProfileRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetNetworkProfileRequest",
}) as any as S.Schema<GetNetworkProfileRequest>;
export interface GetOfferingStatusRequest {
  nextToken?: string;
}
export const GetOfferingStatusRequest = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOfferingStatusRequest",
}) as any as S.Schema<GetOfferingStatusRequest>;
export interface GetProjectRequest {
  arn: string;
}
export const GetProjectRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProjectRequest",
}) as any as S.Schema<GetProjectRequest>;
export interface GetRemoteAccessSessionRequest {
  arn: string;
}
export const GetRemoteAccessSessionRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRemoteAccessSessionRequest",
}) as any as S.Schema<GetRemoteAccessSessionRequest>;
export interface GetRunRequest {
  arn: string;
}
export const GetRunRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRunRequest",
}) as any as S.Schema<GetRunRequest>;
export interface GetSuiteRequest {
  arn: string;
}
export const GetSuiteRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSuiteRequest",
}) as any as S.Schema<GetSuiteRequest>;
export interface GetTestRequest {
  arn: string;
}
export const GetTestRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTestRequest",
}) as any as S.Schema<GetTestRequest>;
export interface GetTestGridProjectRequest {
  projectArn: string;
}
export const GetTestGridProjectRequest = S.suspend(() =>
  S.Struct({ projectArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTestGridProjectRequest",
}) as any as S.Schema<GetTestGridProjectRequest>;
export interface GetTestGridSessionRequest {
  projectArn?: string;
  sessionId?: string;
  sessionArn?: string;
}
export const GetTestGridSessionRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.optional(S.String),
    sessionId: S.optional(S.String),
    sessionArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTestGridSessionRequest",
}) as any as S.Schema<GetTestGridSessionRequest>;
export interface GetUploadRequest {
  arn: string;
}
export const GetUploadRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUploadRequest",
}) as any as S.Schema<GetUploadRequest>;
export interface GetVPCEConfigurationRequest {
  arn: string;
}
export const GetVPCEConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVPCEConfigurationRequest",
}) as any as S.Schema<GetVPCEConfigurationRequest>;
export interface InstallToRemoteAccessSessionRequest {
  remoteAccessSessionArn: string;
  appArn: string;
}
export const InstallToRemoteAccessSessionRequest = S.suspend(() =>
  S.Struct({ remoteAccessSessionArn: S.String, appArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InstallToRemoteAccessSessionRequest",
}) as any as S.Schema<InstallToRemoteAccessSessionRequest>;
export interface ListArtifactsRequest {
  arn: string;
  type: string;
  nextToken?: string;
}
export const ListArtifactsRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    type: S.String,
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListArtifactsRequest",
}) as any as S.Schema<ListArtifactsRequest>;
export interface ListDeviceInstancesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListDeviceInstancesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeviceInstancesRequest",
}) as any as S.Schema<ListDeviceInstancesRequest>;
export interface ListDevicePoolsRequest {
  arn: string;
  type?: string;
  nextToken?: string;
}
export const ListDevicePoolsRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    type: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDevicePoolsRequest",
}) as any as S.Schema<ListDevicePoolsRequest>;
export interface ListInstanceProfilesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListInstanceProfilesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInstanceProfilesRequest",
}) as any as S.Schema<ListInstanceProfilesRequest>;
export interface ListJobsRequest {
  arn: string;
  nextToken?: string;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({ arn: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobsRequest",
}) as any as S.Schema<ListJobsRequest>;
export interface ListNetworkProfilesRequest {
  arn: string;
  type?: string;
  nextToken?: string;
}
export const ListNetworkProfilesRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    type: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNetworkProfilesRequest",
}) as any as S.Schema<ListNetworkProfilesRequest>;
export interface ListOfferingPromotionsRequest {
  nextToken?: string;
}
export const ListOfferingPromotionsRequest = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOfferingPromotionsRequest",
}) as any as S.Schema<ListOfferingPromotionsRequest>;
export interface ListOfferingsRequest {
  nextToken?: string;
}
export const ListOfferingsRequest = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface ListOfferingTransactionsRequest {
  nextToken?: string;
}
export const ListOfferingTransactionsRequest = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOfferingTransactionsRequest",
}) as any as S.Schema<ListOfferingTransactionsRequest>;
export interface ListProjectsRequest {
  arn?: string;
  nextToken?: string;
}
export const ListProjectsRequest = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String), nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProjectsRequest",
}) as any as S.Schema<ListProjectsRequest>;
export interface ListRemoteAccessSessionsRequest {
  arn: string;
  nextToken?: string;
}
export const ListRemoteAccessSessionsRequest = S.suspend(() =>
  S.Struct({ arn: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRemoteAccessSessionsRequest",
}) as any as S.Schema<ListRemoteAccessSessionsRequest>;
export interface ListRunsRequest {
  arn: string;
  nextToken?: string;
}
export const ListRunsRequest = S.suspend(() =>
  S.Struct({ arn: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRunsRequest",
}) as any as S.Schema<ListRunsRequest>;
export interface ListSamplesRequest {
  arn: string;
  nextToken?: string;
}
export const ListSamplesRequest = S.suspend(() =>
  S.Struct({ arn: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSamplesRequest",
}) as any as S.Schema<ListSamplesRequest>;
export interface ListSuitesRequest {
  arn: string;
  nextToken?: string;
}
export const ListSuitesRequest = S.suspend(() =>
  S.Struct({ arn: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSuitesRequest",
}) as any as S.Schema<ListSuitesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface ListTestGridProjectsRequest {
  maxResult?: number;
  nextToken?: string;
}
export const ListTestGridProjectsRequest = S.suspend(() =>
  S.Struct({
    maxResult: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestGridProjectsRequest",
}) as any as S.Schema<ListTestGridProjectsRequest>;
export interface ListTestGridSessionActionsRequest {
  sessionArn: string;
  maxResult?: number;
  nextToken?: string;
}
export const ListTestGridSessionActionsRequest = S.suspend(() =>
  S.Struct({
    sessionArn: S.String,
    maxResult: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestGridSessionActionsRequest",
}) as any as S.Schema<ListTestGridSessionActionsRequest>;
export interface ListTestGridSessionArtifactsRequest {
  sessionArn: string;
  type?: string;
  maxResult?: number;
  nextToken?: string;
}
export const ListTestGridSessionArtifactsRequest = S.suspend(() =>
  S.Struct({
    sessionArn: S.String,
    type: S.optional(S.String),
    maxResult: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestGridSessionArtifactsRequest",
}) as any as S.Schema<ListTestGridSessionArtifactsRequest>;
export interface ListTestGridSessionsRequest {
  projectArn: string;
  status?: string;
  creationTimeAfter?: Date;
  creationTimeBefore?: Date;
  endTimeAfter?: Date;
  endTimeBefore?: Date;
  maxResult?: number;
  nextToken?: string;
}
export const ListTestGridSessionsRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    status: S.optional(S.String),
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    endTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    maxResult: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestGridSessionsRequest",
}) as any as S.Schema<ListTestGridSessionsRequest>;
export interface ListTestsRequest {
  arn: string;
  nextToken?: string;
}
export const ListTestsRequest = S.suspend(() =>
  S.Struct({ arn: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestsRequest",
}) as any as S.Schema<ListTestsRequest>;
export interface ListUniqueProblemsRequest {
  arn: string;
  nextToken?: string;
}
export const ListUniqueProblemsRequest = S.suspend(() =>
  S.Struct({ arn: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUniqueProblemsRequest",
}) as any as S.Schema<ListUniqueProblemsRequest>;
export interface ListUploadsRequest {
  arn: string;
  type?: string;
  nextToken?: string;
}
export const ListUploadsRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    type: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUploadsRequest",
}) as any as S.Schema<ListUploadsRequest>;
export interface ListVPCEConfigurationsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListVPCEConfigurationsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVPCEConfigurationsRequest",
}) as any as S.Schema<ListVPCEConfigurationsRequest>;
export interface PurchaseOfferingRequest {
  offeringId: string;
  quantity: number;
  offeringPromotionId?: string;
}
export const PurchaseOfferingRequest = S.suspend(() =>
  S.Struct({
    offeringId: S.String,
    quantity: S.Number,
    offeringPromotionId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface RenewOfferingRequest {
  offeringId: string;
  quantity: number;
}
export const RenewOfferingRequest = S.suspend(() =>
  S.Struct({ offeringId: S.String, quantity: S.Number }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RenewOfferingRequest",
}) as any as S.Schema<RenewOfferingRequest>;
export interface StopJobRequest {
  arn: string;
}
export const StopJobRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopJobRequest",
}) as any as S.Schema<StopJobRequest>;
export interface StopRemoteAccessSessionRequest {
  arn: string;
}
export const StopRemoteAccessSessionRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopRemoteAccessSessionRequest",
}) as any as S.Schema<StopRemoteAccessSessionRequest>;
export interface StopRunRequest {
  arn: string;
}
export const StopRunRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopRunRequest",
}) as any as S.Schema<StopRunRequest>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateDeviceInstanceRequest {
  arn: string;
  profileArn?: string;
  labels?: InstanceLabels;
}
export const UpdateDeviceInstanceRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    profileArn: S.optional(S.String),
    labels: S.optional(InstanceLabels),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDeviceInstanceRequest",
}) as any as S.Schema<UpdateDeviceInstanceRequest>;
export interface Rule {
  attribute?: string;
  operator?: string;
  value?: string;
}
export const Rule = S.suspend(() =>
  S.Struct({
    attribute: S.optional(S.String),
    operator: S.optional(S.String),
    value: S.optional(S.String),
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type Rules = Rule[];
export const Rules = S.Array(Rule);
export interface UpdateDevicePoolRequest {
  arn: string;
  name?: string;
  description?: string;
  rules?: Rules;
  maxDevices?: number;
  clearMaxDevices?: boolean;
}
export const UpdateDevicePoolRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    rules: S.optional(Rules),
    maxDevices: S.optional(S.Number),
    clearMaxDevices: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDevicePoolRequest",
}) as any as S.Schema<UpdateDevicePoolRequest>;
export interface UpdateInstanceProfileRequest {
  arn: string;
  name?: string;
  description?: string;
  packageCleanup?: boolean;
  excludeAppPackagesFromCleanup?: PackageIds;
  rebootAfterUse?: boolean;
}
export const UpdateInstanceProfileRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    packageCleanup: S.optional(S.Boolean),
    excludeAppPackagesFromCleanup: S.optional(PackageIds),
    rebootAfterUse: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInstanceProfileRequest",
}) as any as S.Schema<UpdateInstanceProfileRequest>;
export interface UpdateNetworkProfileRequest {
  arn: string;
  name?: string;
  description?: string;
  type?: string;
  uplinkBandwidthBits?: number;
  downlinkBandwidthBits?: number;
  uplinkDelayMs?: number;
  downlinkDelayMs?: number;
  uplinkJitterMs?: number;
  downlinkJitterMs?: number;
  uplinkLossPercent?: number;
  downlinkLossPercent?: number;
}
export const UpdateNetworkProfileRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    type: S.optional(S.String),
    uplinkBandwidthBits: S.optional(S.Number),
    downlinkBandwidthBits: S.optional(S.Number),
    uplinkDelayMs: S.optional(S.Number),
    downlinkDelayMs: S.optional(S.Number),
    uplinkJitterMs: S.optional(S.Number),
    downlinkJitterMs: S.optional(S.Number),
    uplinkLossPercent: S.optional(S.Number),
    downlinkLossPercent: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNetworkProfileRequest",
}) as any as S.Schema<UpdateNetworkProfileRequest>;
export type VpcSecurityGroupIds = string[];
export const VpcSecurityGroupIds = S.Array(S.String);
export type VpcSubnetIds = string[];
export const VpcSubnetIds = S.Array(S.String);
export interface VpcConfig {
  securityGroupIds: VpcSecurityGroupIds;
  subnetIds: VpcSubnetIds;
  vpcId: string;
}
export const VpcConfig = S.suspend(() =>
  S.Struct({
    securityGroupIds: VpcSecurityGroupIds,
    subnetIds: VpcSubnetIds,
    vpcId: S.String,
  }),
).annotations({ identifier: "VpcConfig" }) as any as S.Schema<VpcConfig>;
export interface EnvironmentVariable {
  name: string;
  value: string;
}
export const EnvironmentVariable = S.suspend(() =>
  S.Struct({ name: S.String, value: S.String }),
).annotations({
  identifier: "EnvironmentVariable",
}) as any as S.Schema<EnvironmentVariable>;
export type EnvironmentVariables = EnvironmentVariable[];
export const EnvironmentVariables = S.Array(EnvironmentVariable);
export interface UpdateProjectRequest {
  arn: string;
  name?: string;
  defaultJobTimeoutMinutes?: number;
  vpcConfig?: VpcConfig;
  environmentVariables?: EnvironmentVariables;
  executionRoleArn?: string;
}
export const UpdateProjectRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    defaultJobTimeoutMinutes: S.optional(S.Number),
    vpcConfig: S.optional(VpcConfig),
    environmentVariables: S.optional(EnvironmentVariables),
    executionRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProjectRequest",
}) as any as S.Schema<UpdateProjectRequest>;
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export interface TestGridVpcConfig {
  securityGroupIds: SecurityGroupIds;
  subnetIds: SubnetIds;
  vpcId: string;
}
export const TestGridVpcConfig = S.suspend(() =>
  S.Struct({
    securityGroupIds: SecurityGroupIds,
    subnetIds: SubnetIds,
    vpcId: S.String,
  }),
).annotations({
  identifier: "TestGridVpcConfig",
}) as any as S.Schema<TestGridVpcConfig>;
export interface UpdateTestGridProjectRequest {
  projectArn: string;
  name?: string;
  description?: string;
  vpcConfig?: TestGridVpcConfig;
}
export const UpdateTestGridProjectRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    vpcConfig: S.optional(TestGridVpcConfig),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTestGridProjectRequest",
}) as any as S.Schema<UpdateTestGridProjectRequest>;
export interface UpdateUploadRequest {
  arn: string;
  name?: string;
  contentType?: string;
  editContent?: boolean;
}
export const UpdateUploadRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    contentType: S.optional(S.String),
    editContent: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUploadRequest",
}) as any as S.Schema<UpdateUploadRequest>;
export interface UpdateVPCEConfigurationRequest {
  arn: string;
  vpceConfigurationName?: string;
  vpceServiceName?: string;
  serviceDnsName?: string;
  vpceConfigurationDescription?: string;
}
export const UpdateVPCEConfigurationRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    vpceConfigurationName: S.optional(S.String),
    vpceServiceName: S.optional(S.String),
    serviceDnsName: S.optional(S.String),
    vpceConfigurationDescription: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVPCEConfigurationRequest",
}) as any as S.Schema<UpdateVPCEConfigurationRequest>;
export type AuxiliaryAppArnList = string[];
export const AuxiliaryAppArnList = S.Array(S.String);
export type AmazonResourceNames = string[];
export const AmazonResourceNames = S.Array(S.String);
export type DeviceFilterValues = string[];
export const DeviceFilterValues = S.Array(S.String);
export interface InstanceProfile {
  arn?: string;
  packageCleanup?: boolean;
  excludeAppPackagesFromCleanup?: PackageIds;
  rebootAfterUse?: boolean;
  name?: string;
  description?: string;
}
export const InstanceProfile = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    packageCleanup: S.optional(S.Boolean),
    excludeAppPackagesFromCleanup: S.optional(PackageIds),
    rebootAfterUse: S.optional(S.Boolean),
    name: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceProfile",
}) as any as S.Schema<InstanceProfile>;
export interface DeviceInstance {
  arn?: string;
  deviceArn?: string;
  labels?: InstanceLabels;
  status?: string;
  udid?: string;
  instanceProfile?: InstanceProfile;
}
export const DeviceInstance = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    deviceArn: S.optional(S.String),
    labels: S.optional(InstanceLabels),
    status: S.optional(S.String),
    udid: S.optional(S.String),
    instanceProfile: S.optional(InstanceProfile),
  }),
).annotations({
  identifier: "DeviceInstance",
}) as any as S.Schema<DeviceInstance>;
export type DeviceInstances = DeviceInstance[];
export const DeviceInstances = S.Array(DeviceInstance);
export interface DevicePool {
  arn?: string;
  name?: string;
  description?: string;
  type?: string;
  rules?: Rules;
  maxDevices?: number;
}
export const DevicePool = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    type: S.optional(S.String),
    rules: S.optional(Rules),
    maxDevices: S.optional(S.Number),
  }),
).annotations({ identifier: "DevicePool" }) as any as S.Schema<DevicePool>;
export type DevicePools = DevicePool[];
export const DevicePools = S.Array(DevicePool);
export interface DeviceFilter {
  attribute: string;
  operator: string;
  values: DeviceFilterValues;
}
export const DeviceFilter = S.suspend(() =>
  S.Struct({
    attribute: S.String,
    operator: S.String,
    values: DeviceFilterValues,
  }),
).annotations({ identifier: "DeviceFilter" }) as any as S.Schema<DeviceFilter>;
export type DeviceFilters = DeviceFilter[];
export const DeviceFilters = S.Array(DeviceFilter);
export type InstanceProfiles = InstanceProfile[];
export const InstanceProfiles = S.Array(InstanceProfile);
export interface Counters {
  total?: number;
  passed?: number;
  failed?: number;
  warned?: number;
  errored?: number;
  stopped?: number;
  skipped?: number;
}
export const Counters = S.suspend(() =>
  S.Struct({
    total: S.optional(S.Number),
    passed: S.optional(S.Number),
    failed: S.optional(S.Number),
    warned: S.optional(S.Number),
    errored: S.optional(S.Number),
    stopped: S.optional(S.Number),
    skipped: S.optional(S.Number),
  }),
).annotations({ identifier: "Counters" }) as any as S.Schema<Counters>;
export interface CPU {
  frequency?: string;
  architecture?: string;
  clock?: number;
}
export const CPU = S.suspend(() =>
  S.Struct({
    frequency: S.optional(S.String),
    architecture: S.optional(S.String),
    clock: S.optional(S.Number),
  }),
).annotations({ identifier: "CPU" }) as any as S.Schema<CPU>;
export interface Resolution {
  width?: number;
  height?: number;
}
export const Resolution = S.suspend(() =>
  S.Struct({ width: S.optional(S.Number), height: S.optional(S.Number) }),
).annotations({ identifier: "Resolution" }) as any as S.Schema<Resolution>;
export interface Device {
  arn?: string;
  name?: string;
  manufacturer?: string;
  model?: string;
  modelId?: string;
  formFactor?: string;
  platform?: string;
  os?: string;
  cpu?: CPU;
  resolution?: Resolution;
  heapSize?: number;
  memory?: number;
  image?: string;
  carrier?: string;
  radio?: string;
  remoteAccessEnabled?: boolean;
  remoteDebugEnabled?: boolean;
  fleetType?: string;
  fleetName?: string;
  instances?: DeviceInstances;
  availability?: string;
}
export const Device = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    manufacturer: S.optional(S.String),
    model: S.optional(S.String),
    modelId: S.optional(S.String),
    formFactor: S.optional(S.String),
    platform: S.optional(S.String),
    os: S.optional(S.String),
    cpu: S.optional(CPU),
    resolution: S.optional(Resolution),
    heapSize: S.optional(S.Number),
    memory: S.optional(S.Number),
    image: S.optional(S.String),
    carrier: S.optional(S.String),
    radio: S.optional(S.String),
    remoteAccessEnabled: S.optional(S.Boolean),
    remoteDebugEnabled: S.optional(S.Boolean),
    fleetType: S.optional(S.String),
    fleetName: S.optional(S.String),
    instances: S.optional(DeviceInstances),
    availability: S.optional(S.String),
  }),
).annotations({ identifier: "Device" }) as any as S.Schema<Device>;
export interface DeviceMinutes {
  total?: number;
  metered?: number;
  unmetered?: number;
}
export const DeviceMinutes = S.suspend(() =>
  S.Struct({
    total: S.optional(S.Number),
    metered: S.optional(S.Number),
    unmetered: S.optional(S.Number),
  }),
).annotations({
  identifier: "DeviceMinutes",
}) as any as S.Schema<DeviceMinutes>;
export interface Job {
  arn?: string;
  name?: string;
  type?: string;
  created?: Date;
  status?: string;
  result?: string;
  started?: Date;
  stopped?: Date;
  counters?: Counters;
  message?: string;
  device?: Device;
  instanceArn?: string;
  deviceMinutes?: DeviceMinutes;
  videoEndpoint?: string;
  videoCapture?: boolean;
}
export const Job = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    type: S.optional(S.String),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    result: S.optional(S.String),
    started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    counters: S.optional(Counters),
    message: S.optional(S.String),
    device: S.optional(Device),
    instanceArn: S.optional(S.String),
    deviceMinutes: S.optional(DeviceMinutes),
    videoEndpoint: S.optional(S.String),
    videoCapture: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Job" }) as any as S.Schema<Job>;
export type Jobs = Job[];
export const Jobs = S.Array(Job);
export interface NetworkProfile {
  arn?: string;
  name?: string;
  description?: string;
  type?: string;
  uplinkBandwidthBits?: number;
  downlinkBandwidthBits?: number;
  uplinkDelayMs?: number;
  downlinkDelayMs?: number;
  uplinkJitterMs?: number;
  downlinkJitterMs?: number;
  uplinkLossPercent?: number;
  downlinkLossPercent?: number;
}
export const NetworkProfile = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    type: S.optional(S.String),
    uplinkBandwidthBits: S.optional(S.Number),
    downlinkBandwidthBits: S.optional(S.Number),
    uplinkDelayMs: S.optional(S.Number),
    downlinkDelayMs: S.optional(S.Number),
    uplinkJitterMs: S.optional(S.Number),
    downlinkJitterMs: S.optional(S.Number),
    uplinkLossPercent: S.optional(S.Number),
    downlinkLossPercent: S.optional(S.Number),
  }),
).annotations({
  identifier: "NetworkProfile",
}) as any as S.Schema<NetworkProfile>;
export type NetworkProfiles = NetworkProfile[];
export const NetworkProfiles = S.Array(NetworkProfile);
export interface Project {
  arn?: string;
  name?: string;
  defaultJobTimeoutMinutes?: number;
  created?: Date;
  vpcConfig?: VpcConfig;
  environmentVariables?: EnvironmentVariables;
  executionRoleArn?: string;
}
export const Project = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    defaultJobTimeoutMinutes: S.optional(S.Number),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    vpcConfig: S.optional(VpcConfig),
    environmentVariables: S.optional(EnvironmentVariables),
    executionRoleArn: S.optional(S.String),
  }),
).annotations({ identifier: "Project" }) as any as S.Schema<Project>;
export type Projects = Project[];
export const Projects = S.Array(Project);
export interface DeviceProxy {
  host: string;
  port: number;
}
export const DeviceProxy = S.suspend(() =>
  S.Struct({ host: S.String, port: S.Number }),
).annotations({ identifier: "DeviceProxy" }) as any as S.Schema<DeviceProxy>;
export interface RemoteAccessEndpoints {
  remoteDriverEndpoint?: string | Redacted.Redacted<string>;
  interactiveEndpoint?: string | Redacted.Redacted<string>;
}
export const RemoteAccessEndpoints = S.suspend(() =>
  S.Struct({
    remoteDriverEndpoint: S.optional(SensitiveString),
    interactiveEndpoint: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RemoteAccessEndpoints",
}) as any as S.Schema<RemoteAccessEndpoints>;
export interface RemoteAccessSession {
  arn?: string;
  name?: string;
  created?: Date;
  status?: string;
  result?: string;
  message?: string;
  started?: Date;
  stopped?: Date;
  device?: Device;
  instanceArn?: string;
  billingMethod?: string;
  deviceMinutes?: DeviceMinutes;
  endpoint?: string;
  deviceUdid?: string;
  interactionMode?: string;
  skipAppResign?: boolean;
  vpcConfig?: VpcConfig;
  deviceProxy?: DeviceProxy;
  appUpload?: string;
  endpoints?: RemoteAccessEndpoints;
}
export const RemoteAccessSession = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    result: S.optional(S.String),
    message: S.optional(S.String),
    started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    device: S.optional(Device),
    instanceArn: S.optional(S.String),
    billingMethod: S.optional(S.String),
    deviceMinutes: S.optional(DeviceMinutes),
    endpoint: S.optional(S.String),
    deviceUdid: S.optional(S.String),
    interactionMode: S.optional(S.String),
    skipAppResign: S.optional(S.Boolean),
    vpcConfig: S.optional(VpcConfig),
    deviceProxy: S.optional(DeviceProxy),
    appUpload: S.optional(S.String),
    endpoints: S.optional(RemoteAccessEndpoints),
  }),
).annotations({
  identifier: "RemoteAccessSession",
}) as any as S.Schema<RemoteAccessSession>;
export type RemoteAccessSessions = RemoteAccessSession[];
export const RemoteAccessSessions = S.Array(RemoteAccessSession);
export interface Radios {
  wifi?: boolean;
  bluetooth?: boolean;
  nfc?: boolean;
  gps?: boolean;
}
export const Radios = S.suspend(() =>
  S.Struct({
    wifi: S.optional(S.Boolean),
    bluetooth: S.optional(S.Boolean),
    nfc: S.optional(S.Boolean),
    gps: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Radios" }) as any as S.Schema<Radios>;
export interface Location {
  latitude: number;
  longitude: number;
}
export const Location = S.suspend(() =>
  S.Struct({ latitude: S.Number, longitude: S.Number }),
).annotations({ identifier: "Location" }) as any as S.Schema<Location>;
export type IosPaths = string[];
export const IosPaths = S.Array(S.String);
export type AndroidPaths = string[];
export const AndroidPaths = S.Array(S.String);
export type DeviceHostPaths = string[];
export const DeviceHostPaths = S.Array(S.String);
export interface CustomerArtifactPaths {
  iosPaths?: IosPaths;
  androidPaths?: AndroidPaths;
  deviceHostPaths?: DeviceHostPaths;
}
export const CustomerArtifactPaths = S.suspend(() =>
  S.Struct({
    iosPaths: S.optional(IosPaths),
    androidPaths: S.optional(AndroidPaths),
    deviceHostPaths: S.optional(DeviceHostPaths),
  }),
).annotations({
  identifier: "CustomerArtifactPaths",
}) as any as S.Schema<CustomerArtifactPaths>;
export interface DeviceSelectionResult {
  filters?: DeviceFilters;
  matchedDevicesCount?: number;
  maxDevices?: number;
}
export const DeviceSelectionResult = S.suspend(() =>
  S.Struct({
    filters: S.optional(DeviceFilters),
    matchedDevicesCount: S.optional(S.Number),
    maxDevices: S.optional(S.Number),
  }),
).annotations({
  identifier: "DeviceSelectionResult",
}) as any as S.Schema<DeviceSelectionResult>;
export interface Run {
  arn?: string;
  name?: string;
  type?: string;
  platform?: string;
  created?: Date;
  status?: string;
  result?: string;
  started?: Date;
  stopped?: Date;
  counters?: Counters;
  message?: string;
  totalJobs?: number;
  completedJobs?: number;
  billingMethod?: string;
  deviceMinutes?: DeviceMinutes;
  networkProfile?: NetworkProfile;
  deviceProxy?: DeviceProxy;
  parsingResultUrl?: string;
  resultCode?: string;
  seed?: number;
  appUpload?: string;
  eventCount?: number;
  jobTimeoutMinutes?: number;
  devicePoolArn?: string;
  locale?: string;
  radios?: Radios;
  location?: Location;
  customerArtifactPaths?: CustomerArtifactPaths;
  webUrl?: string;
  skipAppResign?: boolean;
  testSpecArn?: string;
  deviceSelectionResult?: DeviceSelectionResult;
  vpcConfig?: VpcConfig;
  executionRoleArn?: string;
  environmentVariables?: EnvironmentVariables;
}
export const Run = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    type: S.optional(S.String),
    platform: S.optional(S.String),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    result: S.optional(S.String),
    started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    counters: S.optional(Counters),
    message: S.optional(S.String),
    totalJobs: S.optional(S.Number),
    completedJobs: S.optional(S.Number),
    billingMethod: S.optional(S.String),
    deviceMinutes: S.optional(DeviceMinutes),
    networkProfile: S.optional(NetworkProfile),
    deviceProxy: S.optional(DeviceProxy),
    parsingResultUrl: S.optional(S.String),
    resultCode: S.optional(S.String),
    seed: S.optional(S.Number),
    appUpload: S.optional(S.String),
    eventCount: S.optional(S.Number),
    jobTimeoutMinutes: S.optional(S.Number),
    devicePoolArn: S.optional(S.String),
    locale: S.optional(S.String),
    radios: S.optional(Radios),
    location: S.optional(Location),
    customerArtifactPaths: S.optional(CustomerArtifactPaths),
    webUrl: S.optional(S.String),
    skipAppResign: S.optional(S.Boolean),
    testSpecArn: S.optional(S.String),
    deviceSelectionResult: S.optional(DeviceSelectionResult),
    vpcConfig: S.optional(VpcConfig),
    executionRoleArn: S.optional(S.String),
    environmentVariables: S.optional(EnvironmentVariables),
  }),
).annotations({ identifier: "Run" }) as any as S.Schema<Run>;
export type Runs = Run[];
export const Runs = S.Array(Run);
export interface Suite {
  arn?: string;
  name?: string;
  type?: string;
  created?: Date;
  status?: string;
  result?: string;
  started?: Date;
  stopped?: Date;
  counters?: Counters;
  message?: string;
  deviceMinutes?: DeviceMinutes;
}
export const Suite = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    type: S.optional(S.String),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    result: S.optional(S.String),
    started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    counters: S.optional(Counters),
    message: S.optional(S.String),
    deviceMinutes: S.optional(DeviceMinutes),
  }),
).annotations({ identifier: "Suite" }) as any as S.Schema<Suite>;
export type Suites = Suite[];
export const Suites = S.Array(Suite);
export interface TestGridProject {
  arn?: string;
  name?: string;
  description?: string;
  vpcConfig?: TestGridVpcConfig;
  created?: Date;
}
export const TestGridProject = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    vpcConfig: S.optional(TestGridVpcConfig),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "TestGridProject",
}) as any as S.Schema<TestGridProject>;
export type TestGridProjects = TestGridProject[];
export const TestGridProjects = S.Array(TestGridProject);
export interface TestGridSession {
  arn?: string;
  status?: string;
  created?: Date;
  ended?: Date;
  billingMinutes?: number;
  seleniumProperties?: string;
}
export const TestGridSession = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: S.optional(S.String),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ended: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    billingMinutes: S.optional(S.Number),
    seleniumProperties: S.optional(S.String),
  }),
).annotations({
  identifier: "TestGridSession",
}) as any as S.Schema<TestGridSession>;
export type TestGridSessions = TestGridSession[];
export const TestGridSessions = S.Array(TestGridSession);
export interface Test {
  arn?: string;
  name?: string;
  type?: string;
  created?: Date;
  status?: string;
  result?: string;
  started?: Date;
  stopped?: Date;
  counters?: Counters;
  message?: string;
  deviceMinutes?: DeviceMinutes;
}
export const Test = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    type: S.optional(S.String),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    result: S.optional(S.String),
    started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    counters: S.optional(Counters),
    message: S.optional(S.String),
    deviceMinutes: S.optional(DeviceMinutes),
  }),
).annotations({ identifier: "Test" }) as any as S.Schema<Test>;
export type Tests = Test[];
export const Tests = S.Array(Test);
export interface Upload {
  arn?: string;
  name?: string;
  created?: Date;
  type?: string;
  status?: string;
  url?: string | Redacted.Redacted<string>;
  metadata?: string;
  contentType?: string;
  message?: string;
  category?: string;
}
export const Upload = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    type: S.optional(S.String),
    status: S.optional(S.String),
    url: S.optional(SensitiveString),
    metadata: S.optional(S.String),
    contentType: S.optional(S.String),
    message: S.optional(S.String),
    category: S.optional(S.String),
  }),
).annotations({ identifier: "Upload" }) as any as S.Schema<Upload>;
export type Uploads = Upload[];
export const Uploads = S.Array(Upload);
export interface VPCEConfiguration {
  arn?: string;
  vpceConfigurationName?: string;
  vpceServiceName?: string;
  serviceDnsName?: string;
  vpceConfigurationDescription?: string;
}
export const VPCEConfiguration = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    vpceConfigurationName: S.optional(S.String),
    vpceServiceName: S.optional(S.String),
    serviceDnsName: S.optional(S.String),
    vpceConfigurationDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "VPCEConfiguration",
}) as any as S.Schema<VPCEConfiguration>;
export type VPCEConfigurations = VPCEConfiguration[];
export const VPCEConfigurations = S.Array(VPCEConfiguration);
export interface DeviceSelectionConfiguration {
  filters: DeviceFilters;
  maxDevices: number;
}
export const DeviceSelectionConfiguration = S.suspend(() =>
  S.Struct({ filters: DeviceFilters, maxDevices: S.Number }),
).annotations({
  identifier: "DeviceSelectionConfiguration",
}) as any as S.Schema<DeviceSelectionConfiguration>;
export interface ExecutionConfiguration {
  jobTimeoutMinutes?: number;
  accountsCleanup?: boolean;
  appPackagesCleanup?: boolean;
  videoCapture?: boolean;
  skipAppResign?: boolean;
}
export const ExecutionConfiguration = S.suspend(() =>
  S.Struct({
    jobTimeoutMinutes: S.optional(S.Number),
    accountsCleanup: S.optional(S.Boolean),
    appPackagesCleanup: S.optional(S.Boolean),
    videoCapture: S.optional(S.Boolean),
    skipAppResign: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ExecutionConfiguration",
}) as any as S.Schema<ExecutionConfiguration>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateDevicePoolRequest {
  projectArn: string;
  name: string;
  description?: string;
  rules: Rules;
  maxDevices?: number;
}
export const CreateDevicePoolRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    rules: Rules,
    maxDevices: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDevicePoolRequest",
}) as any as S.Schema<CreateDevicePoolRequest>;
export interface CreateProjectRequest {
  name: string;
  defaultJobTimeoutMinutes?: number;
  vpcConfig?: VpcConfig;
  environmentVariables?: EnvironmentVariables;
  executionRoleArn?: string;
}
export const CreateProjectRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    defaultJobTimeoutMinutes: S.optional(S.Number),
    vpcConfig: S.optional(VpcConfig),
    environmentVariables: S.optional(EnvironmentVariables),
    executionRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProjectRequest",
}) as any as S.Schema<CreateProjectRequest>;
export interface CreateTestGridProjectRequest {
  name: string;
  description?: string;
  vpcConfig?: TestGridVpcConfig;
}
export const CreateTestGridProjectRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    vpcConfig: S.optional(TestGridVpcConfig),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTestGridProjectRequest",
}) as any as S.Schema<CreateTestGridProjectRequest>;
export interface CreateTestGridUrlResult {
  url?: string | Redacted.Redacted<string>;
  expires?: Date;
}
export const CreateTestGridUrlResult = S.suspend(() =>
  S.Struct({
    url: S.optional(SensitiveString),
    expires: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "CreateTestGridUrlResult",
}) as any as S.Schema<CreateTestGridUrlResult>;
export interface GetInstanceProfileResult {
  instanceProfile?: InstanceProfile;
}
export const GetInstanceProfileResult = S.suspend(() =>
  S.Struct({ instanceProfile: S.optional(InstanceProfile) }).pipe(ns),
).annotations({
  identifier: "GetInstanceProfileResult",
}) as any as S.Schema<GetInstanceProfileResult>;
export interface GetNetworkProfileResult {
  networkProfile?: NetworkProfile;
}
export const GetNetworkProfileResult = S.suspend(() =>
  S.Struct({ networkProfile: S.optional(NetworkProfile) }).pipe(ns),
).annotations({
  identifier: "GetNetworkProfileResult",
}) as any as S.Schema<GetNetworkProfileResult>;
export interface GetUploadResult {
  upload?: Upload;
}
export const GetUploadResult = S.suspend(() =>
  S.Struct({ upload: S.optional(Upload) }).pipe(ns),
).annotations({
  identifier: "GetUploadResult",
}) as any as S.Schema<GetUploadResult>;
export interface GetVPCEConfigurationResult {
  vpceConfiguration?: VPCEConfiguration;
}
export const GetVPCEConfigurationResult = S.suspend(() =>
  S.Struct({ vpceConfiguration: S.optional(VPCEConfiguration) }).pipe(ns),
).annotations({
  identifier: "GetVPCEConfigurationResult",
}) as any as S.Schema<GetVPCEConfigurationResult>;
export interface InstallToRemoteAccessSessionResult {
  appUpload?: Upload;
}
export const InstallToRemoteAccessSessionResult = S.suspend(() =>
  S.Struct({ appUpload: S.optional(Upload) }).pipe(ns),
).annotations({
  identifier: "InstallToRemoteAccessSessionResult",
}) as any as S.Schema<InstallToRemoteAccessSessionResult>;
export interface ListDeviceInstancesResult {
  deviceInstances?: DeviceInstances;
  nextToken?: string;
}
export const ListDeviceInstancesResult = S.suspend(() =>
  S.Struct({
    deviceInstances: S.optional(DeviceInstances),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDeviceInstancesResult",
}) as any as S.Schema<ListDeviceInstancesResult>;
export interface ListDevicePoolsResult {
  devicePools?: DevicePools;
  nextToken?: string;
}
export const ListDevicePoolsResult = S.suspend(() =>
  S.Struct({
    devicePools: S.optional(DevicePools),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDevicePoolsResult",
}) as any as S.Schema<ListDevicePoolsResult>;
export interface ListDevicesRequest {
  arn?: string;
  nextToken?: string;
  filters?: DeviceFilters;
}
export const ListDevicesRequest = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    nextToken: S.optional(S.String),
    filters: S.optional(DeviceFilters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDevicesRequest",
}) as any as S.Schema<ListDevicesRequest>;
export interface ListInstanceProfilesResult {
  instanceProfiles?: InstanceProfiles;
  nextToken?: string;
}
export const ListInstanceProfilesResult = S.suspend(() =>
  S.Struct({
    instanceProfiles: S.optional(InstanceProfiles),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInstanceProfilesResult",
}) as any as S.Schema<ListInstanceProfilesResult>;
export interface ListJobsResult {
  jobs?: Jobs;
  nextToken?: string;
}
export const ListJobsResult = S.suspend(() =>
  S.Struct({ jobs: S.optional(Jobs), nextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListJobsResult",
}) as any as S.Schema<ListJobsResult>;
export interface ListNetworkProfilesResult {
  networkProfiles?: NetworkProfiles;
  nextToken?: string;
}
export const ListNetworkProfilesResult = S.suspend(() =>
  S.Struct({
    networkProfiles: S.optional(NetworkProfiles),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListNetworkProfilesResult",
}) as any as S.Schema<ListNetworkProfilesResult>;
export interface ListProjectsResult {
  projects?: Projects;
  nextToken?: string;
}
export const ListProjectsResult = S.suspend(() =>
  S.Struct({
    projects: S.optional(Projects),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListProjectsResult",
}) as any as S.Schema<ListProjectsResult>;
export interface ListRemoteAccessSessionsResult {
  remoteAccessSessions?: RemoteAccessSessions;
  nextToken?: string;
}
export const ListRemoteAccessSessionsResult = S.suspend(() =>
  S.Struct({
    remoteAccessSessions: S.optional(RemoteAccessSessions),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRemoteAccessSessionsResult",
}) as any as S.Schema<ListRemoteAccessSessionsResult>;
export interface ListRunsResult {
  runs?: Runs;
  nextToken?: string;
}
export const ListRunsResult = S.suspend(() =>
  S.Struct({ runs: S.optional(Runs), nextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListRunsResult",
}) as any as S.Schema<ListRunsResult>;
export interface ListSuitesResult {
  suites?: Suites;
  nextToken?: string;
}
export const ListSuitesResult = S.suspend(() =>
  S.Struct({
    suites: S.optional(Suites),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSuitesResult",
}) as any as S.Schema<ListSuitesResult>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTestGridProjectsResult {
  testGridProjects?: TestGridProjects;
  nextToken?: string;
}
export const ListTestGridProjectsResult = S.suspend(() =>
  S.Struct({
    testGridProjects: S.optional(TestGridProjects),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTestGridProjectsResult",
}) as any as S.Schema<ListTestGridProjectsResult>;
export interface ListTestGridSessionsResult {
  testGridSessions?: TestGridSessions;
  nextToken?: string;
}
export const ListTestGridSessionsResult = S.suspend(() =>
  S.Struct({
    testGridSessions: S.optional(TestGridSessions),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTestGridSessionsResult",
}) as any as S.Schema<ListTestGridSessionsResult>;
export interface ListTestsResult {
  tests?: Tests;
  nextToken?: string;
}
export const ListTestsResult = S.suspend(() =>
  S.Struct({ tests: S.optional(Tests), nextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTestsResult",
}) as any as S.Schema<ListTestsResult>;
export interface ListUploadsResult {
  uploads?: Uploads;
  nextToken?: string;
}
export const ListUploadsResult = S.suspend(() =>
  S.Struct({
    uploads: S.optional(Uploads),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUploadsResult",
}) as any as S.Schema<ListUploadsResult>;
export interface ListVPCEConfigurationsResult {
  vpceConfigurations?: VPCEConfigurations;
  nextToken?: string;
}
export const ListVPCEConfigurationsResult = S.suspend(() =>
  S.Struct({
    vpceConfigurations: S.optional(VPCEConfigurations),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListVPCEConfigurationsResult",
}) as any as S.Schema<ListVPCEConfigurationsResult>;
export interface MonetaryAmount {
  amount?: number;
  currencyCode?: string;
}
export const MonetaryAmount = S.suspend(() =>
  S.Struct({
    amount: S.optional(S.Number),
    currencyCode: S.optional(S.String),
  }),
).annotations({
  identifier: "MonetaryAmount",
}) as any as S.Schema<MonetaryAmount>;
export interface RecurringCharge {
  cost?: MonetaryAmount;
  frequency?: string;
}
export const RecurringCharge = S.suspend(() =>
  S.Struct({
    cost: S.optional(MonetaryAmount),
    frequency: S.optional(S.String),
  }),
).annotations({
  identifier: "RecurringCharge",
}) as any as S.Schema<RecurringCharge>;
export type RecurringCharges = RecurringCharge[];
export const RecurringCharges = S.Array(RecurringCharge);
export interface Offering {
  id?: string;
  description?: string;
  type?: string;
  platform?: string;
  recurringCharges?: RecurringCharges;
}
export const Offering = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    description: S.optional(S.String),
    type: S.optional(S.String),
    platform: S.optional(S.String),
    recurringCharges: S.optional(RecurringCharges),
  }),
).annotations({ identifier: "Offering" }) as any as S.Schema<Offering>;
export interface OfferingStatus {
  type?: string;
  offering?: Offering;
  quantity?: number;
  effectiveOn?: Date;
}
export const OfferingStatus = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    offering: S.optional(Offering),
    quantity: S.optional(S.Number),
    effectiveOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OfferingStatus",
}) as any as S.Schema<OfferingStatus>;
export interface OfferingTransaction {
  offeringStatus?: OfferingStatus;
  transactionId?: string;
  offeringPromotionId?: string;
  createdOn?: Date;
  cost?: MonetaryAmount;
}
export const OfferingTransaction = S.suspend(() =>
  S.Struct({
    offeringStatus: S.optional(OfferingStatus),
    transactionId: S.optional(S.String),
    offeringPromotionId: S.optional(S.String),
    createdOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    cost: S.optional(MonetaryAmount),
  }),
).annotations({
  identifier: "OfferingTransaction",
}) as any as S.Schema<OfferingTransaction>;
export interface PurchaseOfferingResult {
  offeringTransaction?: OfferingTransaction;
}
export const PurchaseOfferingResult = S.suspend(() =>
  S.Struct({ offeringTransaction: S.optional(OfferingTransaction) }).pipe(ns),
).annotations({
  identifier: "PurchaseOfferingResult",
}) as any as S.Schema<PurchaseOfferingResult>;
export interface RenewOfferingResult {
  offeringTransaction?: OfferingTransaction;
}
export const RenewOfferingResult = S.suspend(() =>
  S.Struct({ offeringTransaction: S.optional(OfferingTransaction) }).pipe(ns),
).annotations({
  identifier: "RenewOfferingResult",
}) as any as S.Schema<RenewOfferingResult>;
export type TestParameters = { [key: string]: string };
export const TestParameters = S.Record({ key: S.String, value: S.String });
export interface ScheduleRunTest {
  type: string;
  testPackageArn?: string;
  testSpecArn?: string;
  filter?: string;
  parameters?: TestParameters;
}
export const ScheduleRunTest = S.suspend(() =>
  S.Struct({
    type: S.String,
    testPackageArn: S.optional(S.String),
    testSpecArn: S.optional(S.String),
    filter: S.optional(S.String),
    parameters: S.optional(TestParameters),
  }),
).annotations({
  identifier: "ScheduleRunTest",
}) as any as S.Schema<ScheduleRunTest>;
export interface ScheduleRunConfiguration {
  extraDataPackageArn?: string;
  networkProfileArn?: string;
  locale?: string;
  location?: Location;
  vpceConfigurationArns?: AmazonResourceNames;
  deviceProxy?: DeviceProxy;
  customerArtifactPaths?: CustomerArtifactPaths;
  radios?: Radios;
  auxiliaryApps?: AmazonResourceNames;
  billingMethod?: string;
  environmentVariables?: EnvironmentVariables;
  executionRoleArn?: string;
}
export const ScheduleRunConfiguration = S.suspend(() =>
  S.Struct({
    extraDataPackageArn: S.optional(S.String),
    networkProfileArn: S.optional(S.String),
    locale: S.optional(S.String),
    location: S.optional(Location),
    vpceConfigurationArns: S.optional(AmazonResourceNames),
    deviceProxy: S.optional(DeviceProxy),
    customerArtifactPaths: S.optional(CustomerArtifactPaths),
    radios: S.optional(Radios),
    auxiliaryApps: S.optional(AmazonResourceNames),
    billingMethod: S.optional(S.String),
    environmentVariables: S.optional(EnvironmentVariables),
    executionRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduleRunConfiguration",
}) as any as S.Schema<ScheduleRunConfiguration>;
export interface ScheduleRunRequest {
  projectArn: string;
  appArn?: string;
  devicePoolArn?: string;
  deviceSelectionConfiguration?: DeviceSelectionConfiguration;
  name?: string;
  test: ScheduleRunTest;
  configuration?: ScheduleRunConfiguration;
  executionConfiguration?: ExecutionConfiguration;
}
export const ScheduleRunRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    appArn: S.optional(S.String),
    devicePoolArn: S.optional(S.String),
    deviceSelectionConfiguration: S.optional(DeviceSelectionConfiguration),
    name: S.optional(S.String),
    test: ScheduleRunTest,
    configuration: S.optional(ScheduleRunConfiguration),
    executionConfiguration: S.optional(ExecutionConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ScheduleRunRequest",
}) as any as S.Schema<ScheduleRunRequest>;
export interface StopJobResult {
  job?: Job;
}
export const StopJobResult = S.suspend(() =>
  S.Struct({ job: S.optional(Job) }).pipe(ns),
).annotations({
  identifier: "StopJobResult",
}) as any as S.Schema<StopJobResult>;
export interface StopRemoteAccessSessionResult {
  remoteAccessSession?: RemoteAccessSession;
}
export const StopRemoteAccessSessionResult = S.suspend(() =>
  S.Struct({ remoteAccessSession: S.optional(RemoteAccessSession) }).pipe(ns),
).annotations({
  identifier: "StopRemoteAccessSessionResult",
}) as any as S.Schema<StopRemoteAccessSessionResult>;
export interface StopRunResult {
  run?: Run;
}
export const StopRunResult = S.suspend(() =>
  S.Struct({ run: S.optional(Run) }).pipe(ns),
).annotations({
  identifier: "StopRunResult",
}) as any as S.Schema<StopRunResult>;
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UpdateDeviceInstanceResult {
  deviceInstance?: DeviceInstance;
}
export const UpdateDeviceInstanceResult = S.suspend(() =>
  S.Struct({ deviceInstance: S.optional(DeviceInstance) }).pipe(ns),
).annotations({
  identifier: "UpdateDeviceInstanceResult",
}) as any as S.Schema<UpdateDeviceInstanceResult>;
export interface UpdateDevicePoolResult {
  devicePool?: DevicePool;
}
export const UpdateDevicePoolResult = S.suspend(() =>
  S.Struct({ devicePool: S.optional(DevicePool) }).pipe(ns),
).annotations({
  identifier: "UpdateDevicePoolResult",
}) as any as S.Schema<UpdateDevicePoolResult>;
export interface UpdateInstanceProfileResult {
  instanceProfile?: InstanceProfile;
}
export const UpdateInstanceProfileResult = S.suspend(() =>
  S.Struct({ instanceProfile: S.optional(InstanceProfile) }).pipe(ns),
).annotations({
  identifier: "UpdateInstanceProfileResult",
}) as any as S.Schema<UpdateInstanceProfileResult>;
export interface UpdateNetworkProfileResult {
  networkProfile?: NetworkProfile;
}
export const UpdateNetworkProfileResult = S.suspend(() =>
  S.Struct({ networkProfile: S.optional(NetworkProfile) }).pipe(ns),
).annotations({
  identifier: "UpdateNetworkProfileResult",
}) as any as S.Schema<UpdateNetworkProfileResult>;
export interface UpdateProjectResult {
  project?: Project;
}
export const UpdateProjectResult = S.suspend(() =>
  S.Struct({ project: S.optional(Project) }).pipe(ns),
).annotations({
  identifier: "UpdateProjectResult",
}) as any as S.Schema<UpdateProjectResult>;
export interface UpdateTestGridProjectResult {
  testGridProject?: TestGridProject;
}
export const UpdateTestGridProjectResult = S.suspend(() =>
  S.Struct({ testGridProject: S.optional(TestGridProject) }).pipe(ns),
).annotations({
  identifier: "UpdateTestGridProjectResult",
}) as any as S.Schema<UpdateTestGridProjectResult>;
export interface UpdateUploadResult {
  upload?: Upload;
}
export const UpdateUploadResult = S.suspend(() =>
  S.Struct({ upload: S.optional(Upload) }).pipe(ns),
).annotations({
  identifier: "UpdateUploadResult",
}) as any as S.Schema<UpdateUploadResult>;
export interface UpdateVPCEConfigurationResult {
  vpceConfiguration?: VPCEConfiguration;
}
export const UpdateVPCEConfigurationResult = S.suspend(() =>
  S.Struct({ vpceConfiguration: S.optional(VPCEConfiguration) }).pipe(ns),
).annotations({
  identifier: "UpdateVPCEConfigurationResult",
}) as any as S.Schema<UpdateVPCEConfigurationResult>;
export type PurchasedDevicesMap = { [key: string]: number };
export const PurchasedDevicesMap = S.Record({ key: S.String, value: S.Number });
export interface TrialMinutes {
  total?: number;
  remaining?: number;
}
export const TrialMinutes = S.suspend(() =>
  S.Struct({ total: S.optional(S.Number), remaining: S.optional(S.Number) }),
).annotations({ identifier: "TrialMinutes" }) as any as S.Schema<TrialMinutes>;
export type MaxSlotMap = { [key: string]: number };
export const MaxSlotMap = S.Record({ key: S.String, value: S.Number });
export interface CreateRemoteAccessSessionConfiguration {
  auxiliaryApps?: AuxiliaryAppArnList;
  billingMethod?: string;
  vpceConfigurationArns?: AmazonResourceNames;
  deviceProxy?: DeviceProxy;
}
export const CreateRemoteAccessSessionConfiguration = S.suspend(() =>
  S.Struct({
    auxiliaryApps: S.optional(AuxiliaryAppArnList),
    billingMethod: S.optional(S.String),
    vpceConfigurationArns: S.optional(AmazonResourceNames),
    deviceProxy: S.optional(DeviceProxy),
  }),
).annotations({
  identifier: "CreateRemoteAccessSessionConfiguration",
}) as any as S.Schema<CreateRemoteAccessSessionConfiguration>;
export interface AccountSettings {
  awsAccountNumber?: string;
  unmeteredDevices?: PurchasedDevicesMap;
  unmeteredRemoteAccessDevices?: PurchasedDevicesMap;
  maxJobTimeoutMinutes?: number;
  trialMinutes?: TrialMinutes;
  maxSlots?: MaxSlotMap;
  defaultJobTimeoutMinutes?: number;
  skipAppResign?: boolean;
}
export const AccountSettings = S.suspend(() =>
  S.Struct({
    awsAccountNumber: S.optional(S.String),
    unmeteredDevices: S.optional(PurchasedDevicesMap),
    unmeteredRemoteAccessDevices: S.optional(PurchasedDevicesMap),
    maxJobTimeoutMinutes: S.optional(S.Number),
    trialMinutes: S.optional(TrialMinutes),
    maxSlots: S.optional(MaxSlotMap),
    defaultJobTimeoutMinutes: S.optional(S.Number),
    skipAppResign: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AccountSettings",
}) as any as S.Schema<AccountSettings>;
export interface Artifact {
  arn?: string;
  name?: string;
  type?: string;
  extension?: string;
  url?: string;
}
export const Artifact = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    type: S.optional(S.String),
    extension: S.optional(S.String),
    url: S.optional(S.String),
  }),
).annotations({ identifier: "Artifact" }) as any as S.Schema<Artifact>;
export type Artifacts = Artifact[];
export const Artifacts = S.Array(Artifact);
export type Devices = Device[];
export const Devices = S.Array(Device);
export interface OfferingPromotion {
  id?: string;
  description?: string;
}
export const OfferingPromotion = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), description: S.optional(S.String) }),
).annotations({
  identifier: "OfferingPromotion",
}) as any as S.Schema<OfferingPromotion>;
export type OfferingPromotions = OfferingPromotion[];
export const OfferingPromotions = S.Array(OfferingPromotion);
export interface Sample {
  arn?: string;
  type?: string;
  url?: string;
}
export const Sample = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    type: S.optional(S.String),
    url: S.optional(S.String),
  }),
).annotations({ identifier: "Sample" }) as any as S.Schema<Sample>;
export type Samples = Sample[];
export const Samples = S.Array(Sample);
export interface TestGridSessionAction {
  action?: string;
  started?: Date;
  duration?: number;
  statusCode?: string;
  requestMethod?: string;
}
export const TestGridSessionAction = S.suspend(() =>
  S.Struct({
    action: S.optional(S.String),
    started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    duration: S.optional(S.Number),
    statusCode: S.optional(S.String),
    requestMethod: S.optional(S.String),
  }),
).annotations({
  identifier: "TestGridSessionAction",
}) as any as S.Schema<TestGridSessionAction>;
export type TestGridSessionActions = TestGridSessionAction[];
export const TestGridSessionActions = S.Array(TestGridSessionAction);
export interface TestGridSessionArtifact {
  filename?: string;
  type?: string;
  url?: string | Redacted.Redacted<string>;
}
export const TestGridSessionArtifact = S.suspend(() =>
  S.Struct({
    filename: S.optional(S.String),
    type: S.optional(S.String),
    url: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "TestGridSessionArtifact",
}) as any as S.Schema<TestGridSessionArtifact>;
export type TestGridSessionArtifacts = TestGridSessionArtifact[];
export const TestGridSessionArtifacts = S.Array(TestGridSessionArtifact);
export interface CreateDevicePoolResult {
  devicePool?: DevicePool;
}
export const CreateDevicePoolResult = S.suspend(() =>
  S.Struct({ devicePool: S.optional(DevicePool) }).pipe(ns),
).annotations({
  identifier: "CreateDevicePoolResult",
}) as any as S.Schema<CreateDevicePoolResult>;
export interface CreateInstanceProfileResult {
  instanceProfile?: InstanceProfile;
}
export const CreateInstanceProfileResult = S.suspend(() =>
  S.Struct({ instanceProfile: S.optional(InstanceProfile) }).pipe(ns),
).annotations({
  identifier: "CreateInstanceProfileResult",
}) as any as S.Schema<CreateInstanceProfileResult>;
export interface CreateNetworkProfileResult {
  networkProfile?: NetworkProfile;
}
export const CreateNetworkProfileResult = S.suspend(() =>
  S.Struct({ networkProfile: S.optional(NetworkProfile) }).pipe(ns),
).annotations({
  identifier: "CreateNetworkProfileResult",
}) as any as S.Schema<CreateNetworkProfileResult>;
export interface CreateProjectResult {
  project?: Project;
}
export const CreateProjectResult = S.suspend(() =>
  S.Struct({ project: S.optional(Project) }).pipe(ns),
).annotations({
  identifier: "CreateProjectResult",
}) as any as S.Schema<CreateProjectResult>;
export interface CreateRemoteAccessSessionRequest {
  projectArn: string;
  deviceArn: string;
  appArn?: string;
  instanceArn?: string;
  name?: string;
  configuration?: CreateRemoteAccessSessionConfiguration;
  interactionMode?: string;
  skipAppResign?: boolean;
}
export const CreateRemoteAccessSessionRequest = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    deviceArn: S.String,
    appArn: S.optional(S.String),
    instanceArn: S.optional(S.String),
    name: S.optional(S.String),
    configuration: S.optional(CreateRemoteAccessSessionConfiguration),
    interactionMode: S.optional(S.String),
    skipAppResign: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRemoteAccessSessionRequest",
}) as any as S.Schema<CreateRemoteAccessSessionRequest>;
export interface CreateTestGridProjectResult {
  testGridProject?: TestGridProject;
}
export const CreateTestGridProjectResult = S.suspend(() =>
  S.Struct({ testGridProject: S.optional(TestGridProject) }).pipe(ns),
).annotations({
  identifier: "CreateTestGridProjectResult",
}) as any as S.Schema<CreateTestGridProjectResult>;
export interface CreateUploadResult {
  upload?: Upload;
}
export const CreateUploadResult = S.suspend(() =>
  S.Struct({ upload: S.optional(Upload) }).pipe(ns),
).annotations({
  identifier: "CreateUploadResult",
}) as any as S.Schema<CreateUploadResult>;
export interface CreateVPCEConfigurationResult {
  vpceConfiguration?: VPCEConfiguration;
}
export const CreateVPCEConfigurationResult = S.suspend(() =>
  S.Struct({ vpceConfiguration: S.optional(VPCEConfiguration) }).pipe(ns),
).annotations({
  identifier: "CreateVPCEConfigurationResult",
}) as any as S.Schema<CreateVPCEConfigurationResult>;
export interface GetAccountSettingsResult {
  accountSettings?: AccountSettings;
}
export const GetAccountSettingsResult = S.suspend(() =>
  S.Struct({ accountSettings: S.optional(AccountSettings) }).pipe(ns),
).annotations({
  identifier: "GetAccountSettingsResult",
}) as any as S.Schema<GetAccountSettingsResult>;
export interface GetDeviceInstanceResult {
  deviceInstance?: DeviceInstance;
}
export const GetDeviceInstanceResult = S.suspend(() =>
  S.Struct({ deviceInstance: S.optional(DeviceInstance) }).pipe(ns),
).annotations({
  identifier: "GetDeviceInstanceResult",
}) as any as S.Schema<GetDeviceInstanceResult>;
export interface GetDevicePoolResult {
  devicePool?: DevicePool;
}
export const GetDevicePoolResult = S.suspend(() =>
  S.Struct({ devicePool: S.optional(DevicePool) }).pipe(ns),
).annotations({
  identifier: "GetDevicePoolResult",
}) as any as S.Schema<GetDevicePoolResult>;
export interface GetDevicePoolCompatibilityRequest {
  devicePoolArn: string;
  appArn?: string;
  testType?: string;
  test?: ScheduleRunTest;
  configuration?: ScheduleRunConfiguration;
  projectArn?: string;
}
export const GetDevicePoolCompatibilityRequest = S.suspend(() =>
  S.Struct({
    devicePoolArn: S.String,
    appArn: S.optional(S.String),
    testType: S.optional(S.String),
    test: S.optional(ScheduleRunTest),
    configuration: S.optional(ScheduleRunConfiguration),
    projectArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDevicePoolCompatibilityRequest",
}) as any as S.Schema<GetDevicePoolCompatibilityRequest>;
export interface GetProjectResult {
  project?: Project;
}
export const GetProjectResult = S.suspend(() =>
  S.Struct({ project: S.optional(Project) }).pipe(ns),
).annotations({
  identifier: "GetProjectResult",
}) as any as S.Schema<GetProjectResult>;
export interface GetSuiteResult {
  suite?: Suite;
}
export const GetSuiteResult = S.suspend(() =>
  S.Struct({ suite: S.optional(Suite) }).pipe(ns),
).annotations({
  identifier: "GetSuiteResult",
}) as any as S.Schema<GetSuiteResult>;
export interface GetTestResult {
  test?: Test;
}
export const GetTestResult = S.suspend(() =>
  S.Struct({ test: S.optional(Test) }).pipe(ns),
).annotations({
  identifier: "GetTestResult",
}) as any as S.Schema<GetTestResult>;
export interface GetTestGridProjectResult {
  testGridProject?: TestGridProject;
}
export const GetTestGridProjectResult = S.suspend(() =>
  S.Struct({ testGridProject: S.optional(TestGridProject) }).pipe(ns),
).annotations({
  identifier: "GetTestGridProjectResult",
}) as any as S.Schema<GetTestGridProjectResult>;
export interface GetTestGridSessionResult {
  testGridSession?: TestGridSession;
}
export const GetTestGridSessionResult = S.suspend(() =>
  S.Struct({ testGridSession: S.optional(TestGridSession) }).pipe(ns),
).annotations({
  identifier: "GetTestGridSessionResult",
}) as any as S.Schema<GetTestGridSessionResult>;
export interface ListArtifactsResult {
  artifacts?: Artifacts;
  nextToken?: string;
}
export const ListArtifactsResult = S.suspend(() =>
  S.Struct({
    artifacts: S.optional(Artifacts),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListArtifactsResult",
}) as any as S.Schema<ListArtifactsResult>;
export interface ListDevicesResult {
  devices?: Devices;
  nextToken?: string;
}
export const ListDevicesResult = S.suspend(() =>
  S.Struct({
    devices: S.optional(Devices),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDevicesResult",
}) as any as S.Schema<ListDevicesResult>;
export interface ListOfferingPromotionsResult {
  offeringPromotions?: OfferingPromotions;
  nextToken?: string;
}
export const ListOfferingPromotionsResult = S.suspend(() =>
  S.Struct({
    offeringPromotions: S.optional(OfferingPromotions),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListOfferingPromotionsResult",
}) as any as S.Schema<ListOfferingPromotionsResult>;
export interface ListSamplesResult {
  samples?: Samples;
  nextToken?: string;
}
export const ListSamplesResult = S.suspend(() =>
  S.Struct({
    samples: S.optional(Samples),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSamplesResult",
}) as any as S.Schema<ListSamplesResult>;
export interface ListTestGridSessionActionsResult {
  actions?: TestGridSessionActions;
  nextToken?: string;
}
export const ListTestGridSessionActionsResult = S.suspend(() =>
  S.Struct({
    actions: S.optional(TestGridSessionActions),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTestGridSessionActionsResult",
}) as any as S.Schema<ListTestGridSessionActionsResult>;
export interface ListTestGridSessionArtifactsResult {
  artifacts?: TestGridSessionArtifacts;
  nextToken?: string;
}
export const ListTestGridSessionArtifactsResult = S.suspend(() =>
  S.Struct({
    artifacts: S.optional(TestGridSessionArtifacts),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTestGridSessionArtifactsResult",
}) as any as S.Schema<ListTestGridSessionArtifactsResult>;
export interface ScheduleRunResult {
  run?: Run;
}
export const ScheduleRunResult = S.suspend(() =>
  S.Struct({ run: S.optional(Run) }).pipe(ns),
).annotations({
  identifier: "ScheduleRunResult",
}) as any as S.Schema<ScheduleRunResult>;
export type OfferingStatusMap = { [key: string]: OfferingStatus };
export const OfferingStatusMap = S.Record({
  key: S.String,
  value: OfferingStatus,
});
export type Offerings = Offering[];
export const Offerings = S.Array(Offering);
export type OfferingTransactions = OfferingTransaction[];
export const OfferingTransactions = S.Array(OfferingTransaction);
export interface CreateRemoteAccessSessionResult {
  remoteAccessSession?: RemoteAccessSession;
}
export const CreateRemoteAccessSessionResult = S.suspend(() =>
  S.Struct({ remoteAccessSession: S.optional(RemoteAccessSession) }).pipe(ns),
).annotations({
  identifier: "CreateRemoteAccessSessionResult",
}) as any as S.Schema<CreateRemoteAccessSessionResult>;
export interface GetDeviceResult {
  device?: Device;
}
export const GetDeviceResult = S.suspend(() =>
  S.Struct({ device: S.optional(Device) }).pipe(ns),
).annotations({
  identifier: "GetDeviceResult",
}) as any as S.Schema<GetDeviceResult>;
export interface GetJobResult {
  job?: Job;
}
export const GetJobResult = S.suspend(() =>
  S.Struct({ job: S.optional(Job) }).pipe(ns),
).annotations({ identifier: "GetJobResult" }) as any as S.Schema<GetJobResult>;
export interface GetOfferingStatusResult {
  current?: OfferingStatusMap;
  nextPeriod?: OfferingStatusMap;
  nextToken?: string;
}
export const GetOfferingStatusResult = S.suspend(() =>
  S.Struct({
    current: S.optional(OfferingStatusMap),
    nextPeriod: S.optional(OfferingStatusMap),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetOfferingStatusResult",
}) as any as S.Schema<GetOfferingStatusResult>;
export interface GetRemoteAccessSessionResult {
  remoteAccessSession?: RemoteAccessSession;
}
export const GetRemoteAccessSessionResult = S.suspend(() =>
  S.Struct({ remoteAccessSession: S.optional(RemoteAccessSession) }).pipe(ns),
).annotations({
  identifier: "GetRemoteAccessSessionResult",
}) as any as S.Schema<GetRemoteAccessSessionResult>;
export interface GetRunResult {
  run?: Run;
}
export const GetRunResult = S.suspend(() =>
  S.Struct({ run: S.optional(Run) }).pipe(ns),
).annotations({ identifier: "GetRunResult" }) as any as S.Schema<GetRunResult>;
export interface ListOfferingsResult {
  offerings?: Offerings;
  nextToken?: string;
}
export const ListOfferingsResult = S.suspend(() =>
  S.Struct({
    offerings: S.optional(Offerings),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListOfferingsResult",
}) as any as S.Schema<ListOfferingsResult>;
export interface ListOfferingTransactionsResult {
  offeringTransactions?: OfferingTransactions;
  nextToken?: string;
}
export const ListOfferingTransactionsResult = S.suspend(() =>
  S.Struct({
    offeringTransactions: S.optional(OfferingTransactions),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListOfferingTransactionsResult",
}) as any as S.Schema<ListOfferingTransactionsResult>;
export interface ProblemDetail {
  arn?: string;
  name?: string;
}
export const ProblemDetail = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String), name: S.optional(S.String) }),
).annotations({
  identifier: "ProblemDetail",
}) as any as S.Schema<ProblemDetail>;
export interface Problem {
  run?: ProblemDetail;
  job?: ProblemDetail;
  suite?: ProblemDetail;
  test?: ProblemDetail;
  device?: Device;
  result?: string;
  message?: string;
}
export const Problem = S.suspend(() =>
  S.Struct({
    run: S.optional(ProblemDetail),
    job: S.optional(ProblemDetail),
    suite: S.optional(ProblemDetail),
    test: S.optional(ProblemDetail),
    device: S.optional(Device),
    result: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({ identifier: "Problem" }) as any as S.Schema<Problem>;
export type Problems = Problem[];
export const Problems = S.Array(Problem);
export interface IncompatibilityMessage {
  message?: string;
  type?: string;
}
export const IncompatibilityMessage = S.suspend(() =>
  S.Struct({ message: S.optional(S.String), type: S.optional(S.String) }),
).annotations({
  identifier: "IncompatibilityMessage",
}) as any as S.Schema<IncompatibilityMessage>;
export type IncompatibilityMessages = IncompatibilityMessage[];
export const IncompatibilityMessages = S.Array(IncompatibilityMessage);
export interface UniqueProblem {
  message?: string;
  problems?: Problems;
}
export const UniqueProblem = S.suspend(() =>
  S.Struct({ message: S.optional(S.String), problems: S.optional(Problems) }),
).annotations({
  identifier: "UniqueProblem",
}) as any as S.Schema<UniqueProblem>;
export type UniqueProblems = UniqueProblem[];
export const UniqueProblems = S.Array(UniqueProblem);
export interface DevicePoolCompatibilityResult {
  device?: Device;
  compatible?: boolean;
  incompatibilityMessages?: IncompatibilityMessages;
}
export const DevicePoolCompatibilityResult = S.suspend(() =>
  S.Struct({
    device: S.optional(Device),
    compatible: S.optional(S.Boolean),
    incompatibilityMessages: S.optional(IncompatibilityMessages),
  }),
).annotations({
  identifier: "DevicePoolCompatibilityResult",
}) as any as S.Schema<DevicePoolCompatibilityResult>;
export type DevicePoolCompatibilityResults = DevicePoolCompatibilityResult[];
export const DevicePoolCompatibilityResults = S.Array(
  DevicePoolCompatibilityResult,
);
export type UniqueProblemsByExecutionResultMap = {
  [key: string]: UniqueProblems;
};
export const UniqueProblemsByExecutionResultMap = S.Record({
  key: S.String,
  value: UniqueProblems,
});
export interface GetDevicePoolCompatibilityResult {
  compatibleDevices?: DevicePoolCompatibilityResults;
  incompatibleDevices?: DevicePoolCompatibilityResults;
}
export const GetDevicePoolCompatibilityResult = S.suspend(() =>
  S.Struct({
    compatibleDevices: S.optional(DevicePoolCompatibilityResults),
    incompatibleDevices: S.optional(DevicePoolCompatibilityResults),
  }).pipe(ns),
).annotations({
  identifier: "GetDevicePoolCompatibilityResult",
}) as any as S.Schema<GetDevicePoolCompatibilityResult>;
export interface ListUniqueProblemsResult {
  uniqueProblems?: UniqueProblemsByExecutionResultMap;
  nextToken?: string;
}
export const ListUniqueProblemsResult = S.suspend(() =>
  S.Struct({
    uniqueProblems: S.optional(UniqueProblemsByExecutionResultMap),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUniqueProblemsResult",
}) as any as S.Schema<ListUniqueProblemsResult>;

//# Errors
export class ArgumentException extends S.TaggedError<ArgumentException>()(
  "ArgumentException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ServiceAccountException extends S.TaggedError<ServiceAccountException>()(
  "ServiceAccountException",
  { message: S.optional(S.String) },
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { message: S.optional(S.String) },
) {}
export class CannotDeleteException extends S.TaggedError<CannotDeleteException>()(
  "CannotDeleteException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class NotEligibleException extends S.TaggedError<NotEligibleException>()(
  "NotEligibleException",
  { message: S.optional(S.String) },
) {}
export class IdempotencyException extends S.TaggedError<IdempotencyException>()(
  "IdempotencyException",
  { message: S.optional(S.String) },
) {}
export class TagOperationException extends S.TaggedError<TagOperationException>()(
  "TagOperationException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TagPolicyException extends S.TaggedError<TagPolicyException>()(
  "TagPolicyException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Gets a list of all Selenium testing projects in your account.
 */
export const listTestGridProjects: {
  (
    input: ListTestGridProjectsRequest,
  ): Effect.Effect<
    ListTestGridProjectsResult,
    ArgumentException | InternalServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTestGridProjectsRequest,
  ) => Stream.Stream<
    ListTestGridProjectsResult,
    ArgumentException | InternalServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTestGridProjectsRequest,
  ) => Stream.Stream<
    unknown,
    ArgumentException | InternalServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTestGridProjectsRequest,
  output: ListTestGridProjectsResult,
  errors: [ArgumentException, InternalServiceException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResult",
  } as const,
}));
/**
 * Returns a list of the actions taken in a TestGridSession.
 */
export const listTestGridSessionActions: {
  (
    input: ListTestGridSessionActionsRequest,
  ): Effect.Effect<
    ListTestGridSessionActionsResult,
    | ArgumentException
    | InternalServiceException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTestGridSessionActionsRequest,
  ) => Stream.Stream<
    ListTestGridSessionActionsResult,
    | ArgumentException
    | InternalServiceException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTestGridSessionActionsRequest,
  ) => Stream.Stream<
    unknown,
    | ArgumentException
    | InternalServiceException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTestGridSessionActionsRequest,
  output: ListTestGridSessionActionsResult,
  errors: [ArgumentException, InternalServiceException, NotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResult",
  } as const,
}));
/**
 * Retrieves a list of artifacts created during the session.
 */
export const listTestGridSessionArtifacts: {
  (
    input: ListTestGridSessionArtifactsRequest,
  ): Effect.Effect<
    ListTestGridSessionArtifactsResult,
    | ArgumentException
    | InternalServiceException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTestGridSessionArtifactsRequest,
  ) => Stream.Stream<
    ListTestGridSessionArtifactsResult,
    | ArgumentException
    | InternalServiceException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTestGridSessionArtifactsRequest,
  ) => Stream.Stream<
    unknown,
    | ArgumentException
    | InternalServiceException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTestGridSessionArtifactsRequest,
  output: ListTestGridSessionArtifactsResult,
  errors: [ArgumentException, InternalServiceException, NotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResult",
  } as const,
}));
/**
 * Returns information about all Amazon Virtual Private Cloud (VPC) endpoint
 * configurations in the AWS account.
 */
export const listVPCEConfigurations: (
  input: ListVPCEConfigurationsRequest,
) => Effect.Effect<
  ListVPCEConfigurationsResult,
  ArgumentException | ServiceAccountException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVPCEConfigurationsRequest,
  output: ListVPCEConfigurationsResult,
  errors: [ArgumentException, ServiceAccountException],
}));
/**
 * Updates information about an Amazon Virtual Private Cloud (VPC) endpoint configuration.
 */
export const updateVPCEConfiguration: (
  input: UpdateVPCEConfigurationRequest,
) => Effect.Effect<
  UpdateVPCEConfigurationResult,
  | ArgumentException
  | InvalidOperationException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVPCEConfigurationRequest,
  output: UpdateVPCEConfigurationResult,
  errors: [
    ArgumentException,
    InvalidOperationException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes a Selenium testing project and all content generated under it. You cannot delete a project if it has active sessions.
 *
 * You cannot undo this operation.
 */
export const deleteTestGridProject: (
  input: DeleteTestGridProjectRequest,
) => Effect.Effect<
  DeleteTestGridProjectResult,
  | ArgumentException
  | CannotDeleteException
  | InternalServiceException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTestGridProjectRequest,
  output: DeleteTestGridProjectResult,
  errors: [
    ArgumentException,
    CannotDeleteException,
    InternalServiceException,
    NotFoundException,
  ],
}));
/**
 * Returns information about the specified instance profile.
 */
export const getInstanceProfile: (
  input: GetInstanceProfileRequest,
) => Effect.Effect<
  GetInstanceProfileResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceProfileRequest,
  output: GetInstanceProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns information about a network profile.
 */
export const getNetworkProfile: (
  input: GetNetworkProfileRequest,
) => Effect.Effect<
  GetNetworkProfileResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNetworkProfileRequest,
  output: GetNetworkProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about an upload.
 */
export const getUpload: (
  input: GetUploadRequest,
) => Effect.Effect<
  GetUploadResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUploadRequest,
  output: GetUploadResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Installs an application to the device in a remote access session. For Android
 * applications, the file must be in .apk format. For iOS applications, the file must be in
 * .ipa format.
 */
export const installToRemoteAccessSession: (
  input: InstallToRemoteAccessSessionRequest,
) => Effect.Effect<
  InstallToRemoteAccessSessionResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InstallToRemoteAccessSessionRequest,
  output: InstallToRemoteAccessSessionResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns information about the private device instances associated with one or more AWS
 * accounts.
 */
export const listDeviceInstances: (
  input: ListDeviceInstancesRequest,
) => Effect.Effect<
  ListDeviceInstancesResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDeviceInstancesRequest,
  output: ListDeviceInstancesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about device pools.
 */
export const listDevicePools: {
  (
    input: ListDevicePoolsRequest,
  ): Effect.Effect<
    ListDevicePoolsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevicePoolsRequest,
  ) => Stream.Stream<
    ListDevicePoolsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevicePoolsRequest,
  ) => Stream.Stream<
    DevicePool,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDevicePoolsRequest,
  output: ListDevicePoolsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "devicePools",
  } as const,
}));
/**
 * Returns information about all the instance profiles in an AWS account.
 */
export const listInstanceProfiles: (
  input: ListInstanceProfilesRequest,
) => Effect.Effect<
  ListInstanceProfilesResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInstanceProfilesRequest,
  output: ListInstanceProfilesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about jobs for a given test run.
 */
export const listJobs: {
  (
    input: ListJobsRequest,
  ): Effect.Effect<
    ListJobsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => Stream.Stream<
    ListJobsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => Stream.Stream<
    Job,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobs",
  } as const,
}));
/**
 * Returns the list of available network profiles.
 */
export const listNetworkProfiles: (
  input: ListNetworkProfilesRequest,
) => Effect.Effect<
  ListNetworkProfilesResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNetworkProfilesRequest,
  output: ListNetworkProfilesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about projects.
 */
export const listProjects: {
  (
    input: ListProjectsRequest,
  ): Effect.Effect<
    ListProjectsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectsRequest,
  ) => Stream.Stream<
    ListProjectsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectsRequest,
  ) => Stream.Stream<
    Project,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectsRequest,
  output: ListProjectsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "projects",
  } as const,
}));
/**
 * Returns a list of all currently running remote access sessions.
 */
export const listRemoteAccessSessions: (
  input: ListRemoteAccessSessionsRequest,
) => Effect.Effect<
  ListRemoteAccessSessionsResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRemoteAccessSessionsRequest,
  output: ListRemoteAccessSessionsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about runs, given an AWS Device Farm project ARN.
 */
export const listRuns: {
  (
    input: ListRunsRequest,
  ): Effect.Effect<
    ListRunsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRunsRequest,
  ) => Stream.Stream<
    ListRunsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRunsRequest,
  ) => Stream.Stream<
    Run,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRunsRequest,
  output: ListRunsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "runs",
  } as const,
}));
/**
 * Gets information about test suites for a given job.
 */
export const listSuites: {
  (
    input: ListSuitesRequest,
  ): Effect.Effect<
    ListSuitesResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSuitesRequest,
  ) => Stream.Stream<
    ListSuitesResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSuitesRequest,
  ) => Stream.Stream<
    Suite,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSuitesRequest,
  output: ListSuitesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "suites",
  } as const,
}));
/**
 * Gets information about tests in a given test suite.
 */
export const listTests: {
  (
    input: ListTestsRequest,
  ): Effect.Effect<
    ListTestsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTestsRequest,
  ) => Stream.Stream<
    ListTestsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTestsRequest,
  ) => Stream.Stream<
    Test,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTestsRequest,
  output: ListTestsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tests",
  } as const,
}));
/**
 * Gets information about uploads, given an AWS Device Farm project ARN.
 */
export const listUploads: {
  (
    input: ListUploadsRequest,
  ): Effect.Effect<
    ListUploadsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUploadsRequest,
  ) => Stream.Stream<
    ListUploadsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUploadsRequest,
  ) => Stream.Stream<
    Upload,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUploadsRequest,
  output: ListUploadsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "uploads",
  } as const,
}));
/**
 * Initiates a stop request for the current job. AWS Device Farm immediately stops the job on the device
 * where tests have not started. You are not billed for this device. On the device where tests have started,
 * setup suite and teardown suite tests run to completion on the device. You are billed for setup, teardown,
 * and any tests that were in progress or already completed.
 */
export const stopJob: (
  input: StopJobRequest,
) => Effect.Effect<
  StopJobResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopJobRequest,
  output: StopJobResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Ends a specified remote access session.
 */
export const stopRemoteAccessSession: (
  input: StopRemoteAccessSessionRequest,
) => Effect.Effect<
  StopRemoteAccessSessionResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRemoteAccessSessionRequest,
  output: StopRemoteAccessSessionResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Initiates a stop request for the current test run. AWS Device Farm immediately stops the run on devices
 * where tests have not started. You are not billed for these devices. On devices where tests have started
 * executing, setup suite and teardown suite tests run to completion on those devices. You are billed for
 * setup, teardown, and any tests that were in progress or already completed.
 */
export const stopRun: (
  input: StopRunRequest,
) => Effect.Effect<
  StopRunResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRunRequest,
  output: StopRunResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Updates information about a private device instance.
 */
export const updateDeviceInstance: (
  input: UpdateDeviceInstanceRequest,
) => Effect.Effect<
  UpdateDeviceInstanceResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeviceInstanceRequest,
  output: UpdateDeviceInstanceResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Modifies the name, description, and rules in a device pool given the attributes and
 * the pool ARN. Rule updates are all-or-nothing, meaning they can only be updated as a
 * whole (or not at all).
 */
export const updateDevicePool: (
  input: UpdateDevicePoolRequest,
) => Effect.Effect<
  UpdateDevicePoolResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDevicePoolRequest,
  output: UpdateDevicePoolResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Updates information about an existing private device instance profile.
 */
export const updateInstanceProfile: (
  input: UpdateInstanceProfileRequest,
) => Effect.Effect<
  UpdateInstanceProfileResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInstanceProfileRequest,
  output: UpdateInstanceProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Updates the network profile.
 */
export const updateNetworkProfile: (
  input: UpdateNetworkProfileRequest,
) => Effect.Effect<
  UpdateNetworkProfileResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNetworkProfileRequest,
  output: UpdateNetworkProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Modifies the specified project name, given the project ARN and a new
 * name.
 */
export const updateProject: (
  input: UpdateProjectRequest,
) => Effect.Effect<
  UpdateProjectResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Updates an uploaded test spec.
 */
export const updateUpload: (
  input: UpdateUploadRequest,
) => Effect.Effect<
  UpdateUploadResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUploadRequest,
  output: UpdateUploadResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes a profile that can be applied to one or more private device instances.
 */
export const deleteInstanceProfile: (
  input: DeleteInstanceProfileRequest,
) => Effect.Effect<
  DeleteInstanceProfileResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInstanceProfileRequest,
  output: DeleteInstanceProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes a network profile.
 */
export const deleteNetworkProfile: (
  input: DeleteNetworkProfileRequest,
) => Effect.Effect<
  DeleteNetworkProfileResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNetworkProfileRequest,
  output: DeleteNetworkProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes an AWS Device Farm project, given the project ARN. You cannot delete a project if it has an active run or session.
 *
 * You cannot undo this operation.
 */
export const deleteProject: (
  input: DeleteProjectRequest,
) => Effect.Effect<
  DeleteProjectResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes a completed remote access session and its results. You cannot delete a remote access session if it is still active.
 *
 * You cannot undo this operation.
 */
export const deleteRemoteAccessSession: (
  input: DeleteRemoteAccessSessionRequest,
) => Effect.Effect<
  DeleteRemoteAccessSessionResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRemoteAccessSessionRequest,
  output: DeleteRemoteAccessSessionResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes the run, given the run ARN. You cannot delete a run if it is still active.
 *
 * You cannot undo this operation.
 */
export const deleteRun: (
  input: DeleteRunRequest,
) => Effect.Effect<
  DeleteRunResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRunRequest,
  output: DeleteRunResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Deletes an upload given the upload ARN.
 */
export const deleteUpload: (
  input: DeleteUploadRequest,
) => Effect.Effect<
  DeleteUploadResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUploadRequest,
  output: DeleteUploadResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Creates a device pool.
 */
export const createDevicePool: (
  input: CreateDevicePoolRequest,
) => Effect.Effect<
  CreateDevicePoolResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDevicePoolRequest,
  output: CreateDevicePoolResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Creates a profile that can be applied to one or more private fleet device
 * instances.
 */
export const createInstanceProfile: (
  input: CreateInstanceProfileRequest,
) => Effect.Effect<
  CreateInstanceProfileResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInstanceProfileRequest,
  output: CreateInstanceProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Creates a network profile.
 */
export const createNetworkProfile: (
  input: CreateNetworkProfileRequest,
) => Effect.Effect<
  CreateNetworkProfileResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNetworkProfileRequest,
  output: CreateNetworkProfileResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Uploads an app or test scripts.
 */
export const createUpload: (
  input: CreateUploadRequest,
) => Effect.Effect<
  CreateUploadResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUploadRequest,
  output: CreateUploadResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Creates a configuration record in Device Farm for your Amazon Virtual Private Cloud
 * (VPC) endpoint.
 */
export const createVPCEConfiguration: (
  input: CreateVPCEConfigurationRequest,
) => Effect.Effect<
  CreateVPCEConfigurationResult,
  | ArgumentException
  | LimitExceededException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVPCEConfigurationRequest,
  output: CreateVPCEConfigurationResult,
  errors: [ArgumentException, LimitExceededException, ServiceAccountException],
}));
/**
 * Deletes a device pool given the pool ARN. Does not allow deletion of curated pools
 * owned by the system.
 */
export const deleteDevicePool: (
  input: DeleteDevicePoolRequest,
) => Effect.Effect<
  DeleteDevicePoolResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDevicePoolRequest,
  output: DeleteDevicePoolResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns the number of unmetered iOS or unmetered Android devices that have been purchased by the
 * account.
 */
export const getAccountSettings: (
  input: GetAccountSettingsRequest,
) => Effect.Effect<
  GetAccountSettingsResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns information about a device instance that belongs to a private device fleet.
 */
export const getDeviceInstance: (
  input: GetDeviceInstanceRequest,
) => Effect.Effect<
  GetDeviceInstanceResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceInstanceRequest,
  output: GetDeviceInstanceResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a device pool.
 */
export const getDevicePool: (
  input: GetDevicePoolRequest,
) => Effect.Effect<
  GetDevicePoolResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDevicePoolRequest,
  output: GetDevicePoolResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a project.
 */
export const getProject: (
  input: GetProjectRequest,
) => Effect.Effect<
  GetProjectResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectRequest,
  output: GetProjectResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a suite.
 */
export const getSuite: (
  input: GetSuiteRequest,
) => Effect.Effect<
  GetSuiteResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSuiteRequest,
  output: GetSuiteResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a test.
 */
export const getTest: (
  input: GetTestRequest,
) => Effect.Effect<
  GetTestResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTestRequest,
  output: GetTestResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Retrieves a list of sessions for a TestGridProject.
 */
export const listTestGridSessions: {
  (
    input: ListTestGridSessionsRequest,
  ): Effect.Effect<
    ListTestGridSessionsResult,
    | ArgumentException
    | InternalServiceException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTestGridSessionsRequest,
  ) => Stream.Stream<
    ListTestGridSessionsResult,
    | ArgumentException
    | InternalServiceException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTestGridSessionsRequest,
  ) => Stream.Stream<
    unknown,
    | ArgumentException
    | InternalServiceException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTestGridSessionsRequest,
  output: ListTestGridSessionsResult,
  errors: [ArgumentException, InternalServiceException, NotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResult",
  } as const,
}));
/**
 * Change details of a project.
 */
export const updateTestGridProject: (
  input: UpdateTestGridProjectRequest,
) => Effect.Effect<
  UpdateTestGridProjectResult,
  | ArgumentException
  | InternalServiceException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTestGridProjectRequest,
  output: UpdateTestGridProjectResult,
  errors: [
    ArgumentException,
    InternalServiceException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Creates a signed, short-term URL that can be passed to a Selenium `RemoteWebDriver`
 * constructor.
 */
export const createTestGridUrl: (
  input: CreateTestGridUrlRequest,
) => Effect.Effect<
  CreateTestGridUrlResult,
  | ArgumentException
  | InternalServiceException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTestGridUrlRequest,
  output: CreateTestGridUrlResult,
  errors: [ArgumentException, InternalServiceException, NotFoundException],
}));
/**
 * Creates a Selenium testing project. Projects are used to track TestGridSession
 * instances.
 */
export const createTestGridProject: (
  input: CreateTestGridProjectRequest,
) => Effect.Effect<
  CreateTestGridProjectResult,
  | ArgumentException
  | InternalServiceException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTestGridProjectRequest,
  output: CreateTestGridProjectResult,
  errors: [ArgumentException, InternalServiceException, LimitExceededException],
}));
/**
 * Retrieves information about a Selenium testing project.
 */
export const getTestGridProject: (
  input: GetTestGridProjectRequest,
) => Effect.Effect<
  GetTestGridProjectResult,
  | ArgumentException
  | InternalServiceException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTestGridProjectRequest,
  output: GetTestGridProjectResult,
  errors: [ArgumentException, InternalServiceException, NotFoundException],
}));
/**
 * A session is an instance of a browser created through a `RemoteWebDriver` with the URL from CreateTestGridUrlResult$url. You can use the following to look up sessions:
 *
 * - The session ARN (GetTestGridSessionRequest$sessionArn).
 *
 * - The project ARN and a session ID (GetTestGridSessionRequest$projectArn and GetTestGridSessionRequest$sessionId).
 */
export const getTestGridSession: (
  input: GetTestGridSessionRequest,
) => Effect.Effect<
  GetTestGridSessionResult,
  | ArgumentException
  | InternalServiceException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTestGridSessionRequest,
  output: GetTestGridSessionResult,
  errors: [ArgumentException, InternalServiceException, NotFoundException],
}));
/**
 * Returns information about the configuration settings for your Amazon Virtual Private
 * Cloud (VPC) endpoint.
 */
export const getVPCEConfiguration: (
  input: GetVPCEConfigurationRequest,
) => Effect.Effect<
  GetVPCEConfigurationResult,
  | ArgumentException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVPCEConfigurationRequest,
  output: GetVPCEConfigurationResult,
  errors: [ArgumentException, NotFoundException, ServiceAccountException],
}));
/**
 * Gets information about artifacts.
 */
export const listArtifacts: {
  (
    input: ListArtifactsRequest,
  ): Effect.Effect<
    ListArtifactsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListArtifactsRequest,
  ) => Stream.Stream<
    ListArtifactsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListArtifactsRequest,
  ) => Stream.Stream<
    Artifact,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListArtifactsRequest,
  output: ListArtifactsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "artifacts",
  } as const,
}));
/**
 * Gets information about unique device types.
 */
export const listDevices: {
  (
    input: ListDevicesRequest,
  ): Effect.Effect<
    ListDevicesResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevicesRequest,
  ) => Stream.Stream<
    ListDevicesResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevicesRequest,
  ) => Stream.Stream<
    Device,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDevicesRequest,
  output: ListDevicesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "devices",
  } as const,
}));
/**
 * Gets information about samples, given an AWS Device Farm job ARN.
 */
export const listSamples: {
  (
    input: ListSamplesRequest,
  ): Effect.Effect<
    ListSamplesResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSamplesRequest,
  ) => Stream.Stream<
    ListSamplesResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSamplesRequest,
  ) => Stream.Stream<
    Sample,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSamplesRequest,
  output: ListSamplesResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "samples",
  } as const,
}));
/**
 * Deletes a configuration for your Amazon Virtual Private Cloud (VPC) endpoint.
 */
export const deleteVPCEConfiguration: (
  input: DeleteVPCEConfigurationRequest,
) => Effect.Effect<
  DeleteVPCEConfigurationResult,
  | ArgumentException
  | InvalidOperationException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVPCEConfigurationRequest,
  output: DeleteVPCEConfigurationResult,
  errors: [
    ArgumentException,
    InvalidOperationException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Specifies and starts a remote access session.
 */
export const createRemoteAccessSession: (
  input: CreateRemoteAccessSessionRequest,
) => Effect.Effect<
  CreateRemoteAccessSessionResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRemoteAccessSessionRequest,
  output: CreateRemoteAccessSessionResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a unique device type.
 */
export const getDevice: (
  input: GetDeviceRequest,
) => Effect.Effect<
  GetDeviceResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceRequest,
  output: GetDeviceResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a job.
 */
export const getJob: (
  input: GetJobRequest,
) => Effect.Effect<
  GetJobResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRequest,
  output: GetJobResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns a link to a currently running remote access session.
 */
export const getRemoteAccessSession: (
  input: GetRemoteAccessSessionRequest,
) => Effect.Effect<
  GetRemoteAccessSessionResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRemoteAccessSessionRequest,
  output: GetRemoteAccessSessionResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about a run.
 */
export const getRun: (
  input: GetRunRequest,
) => Effect.Effect<
  GetRunResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRunRequest,
  output: GetRunResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns a list of offering promotions. Each offering promotion record contains the ID and description
 * of the promotion. The API returns a `NotEligible` error if the caller is not permitted to invoke
 * the operation. Contact aws-devicefarm-support@amazon.com if you must be able to invoke this operation.
 */
export const listOfferingPromotions: (
  input: ListOfferingPromotionsRequest,
) => Effect.Effect<
  ListOfferingPromotionsResult,
  | ArgumentException
  | LimitExceededException
  | NotEligibleException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOfferingPromotionsRequest,
  output: ListOfferingPromotionsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Returns a list of products or offerings that the user can manage through the API. Each offering record
 * indicates the recurring price per unit and the frequency for that offering. The API returns a
 * `NotEligible` error if the user is not permitted to invoke the operation. If you must be
 * able to invoke this operation, contact aws-devicefarm-support@amazon.com.
 */
export const listOfferings: {
  (
    input: ListOfferingsRequest,
  ): Effect.Effect<
    ListOfferingsResult,
    | ArgumentException
    | LimitExceededException
    | NotEligibleException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOfferingsRequest,
  ) => Stream.Stream<
    ListOfferingsResult,
    | ArgumentException
    | LimitExceededException
    | NotEligibleException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOfferingsRequest,
  ) => Stream.Stream<
    Offering,
    | ArgumentException
    | LimitExceededException
    | NotEligibleException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOfferingsRequest,
  output: ListOfferingsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "offerings",
  } as const,
}));
/**
 * Returns a list of all historical purchases, renewals, and system renewal transactions for an AWS
 * account. The list is paginated and ordered by a descending timestamp (most recent transactions are first).
 * The API returns a `NotEligible` error if the user is not permitted to invoke the operation. If
 * you must be able to invoke this operation, contact aws-devicefarm-support@amazon.com.
 */
export const listOfferingTransactions: {
  (
    input: ListOfferingTransactionsRequest,
  ): Effect.Effect<
    ListOfferingTransactionsResult,
    | ArgumentException
    | LimitExceededException
    | NotEligibleException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOfferingTransactionsRequest,
  ) => Stream.Stream<
    ListOfferingTransactionsResult,
    | ArgumentException
    | LimitExceededException
    | NotEligibleException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOfferingTransactionsRequest,
  ) => Stream.Stream<
    OfferingTransaction,
    | ArgumentException
    | LimitExceededException
    | NotEligibleException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOfferingTransactionsRequest,
  output: ListOfferingTransactionsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "offeringTransactions",
  } as const,
}));
/**
 * Schedules a run.
 */
export const scheduleRun: (
  input: ScheduleRunRequest,
) => Effect.Effect<
  ScheduleRunResult,
  | ArgumentException
  | IdempotencyException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScheduleRunRequest,
  output: ScheduleRunResult,
  errors: [
    ArgumentException,
    IdempotencyException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Creates a project.
 */
export const createProject: (
  input: CreateProjectRequest,
) => Effect.Effect<
  CreateProjectResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | TagOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
    TagOperationException,
  ],
}));
/**
 * Immediately purchases offerings for an AWS account. Offerings renew with the latest total purchased
 * quantity for an offering, unless the renewal was overridden. The API returns a `NotEligible`
 * error if the user is not permitted to invoke the operation. If you must be able to invoke this operation,
 * contact aws-devicefarm-support@amazon.com.
 */
export const purchaseOffering: (
  input: PurchaseOfferingRequest,
) => Effect.Effect<
  PurchaseOfferingResult,
  | ArgumentException
  | LimitExceededException
  | NotEligibleException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseOfferingRequest,
  output: PurchaseOfferingResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Explicitly sets the quantity of devices to renew for an offering, starting from the
 * `effectiveDate` of the next period. The API returns a `NotEligible` error if the
 * user is not permitted to invoke the operation. If you must be able to invoke this operation, contact aws-devicefarm-support@amazon.com.
 */
export const renewOffering: (
  input: RenewOfferingRequest,
) => Effect.Effect<
  RenewOfferingResult,
  | ArgumentException
  | LimitExceededException
  | NotEligibleException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RenewOfferingRequest,
  output: RenewOfferingResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets the current status and future status of all offerings purchased by an AWS account. The response
 * indicates how many offerings are currently available and the offerings that will be available in the next
 * period. The API returns a `NotEligible` error if the user is not permitted to invoke the
 * operation. If you must be able to invoke this operation, contact aws-devicefarm-support@amazon.com.
 */
export const getOfferingStatus: {
  (
    input: GetOfferingStatusRequest,
  ): Effect.Effect<
    GetOfferingStatusResult,
    | ArgumentException
    | LimitExceededException
    | NotEligibleException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetOfferingStatusRequest,
  ) => Stream.Stream<
    GetOfferingStatusResult,
    | ArgumentException
    | LimitExceededException
    | NotEligibleException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetOfferingStatusRequest,
  ) => Stream.Stream<
    unknown,
    | ArgumentException
    | LimitExceededException
    | NotEligibleException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetOfferingStatusRequest,
  output: GetOfferingStatusResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotEligibleException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * List the tags for an AWS Device Farm resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ArgumentException | NotFoundException | TagOperationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ArgumentException, NotFoundException, TagOperationException],
}));
/**
 * Deletes the specified tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ArgumentException | NotFoundException | TagOperationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ArgumentException, NotFoundException, TagOperationException],
}));
/**
 * Gets information about compatibility with a device pool.
 */
export const getDevicePoolCompatibility: (
  input: GetDevicePoolCompatibilityRequest,
) => Effect.Effect<
  GetDevicePoolCompatibilityResult,
  | ArgumentException
  | LimitExceededException
  | NotFoundException
  | ServiceAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDevicePoolCompatibilityRequest,
  output: GetDevicePoolCompatibilityResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
}));
/**
 * Gets information about unique problems, such as exceptions or crashes.
 *
 * Unique problems are defined as a single instance of an error across a run, job, or suite. For example,
 * if a call in your application consistently raises an exception (OutOfBoundsException in
 * MyActivity.java:386), `ListUniqueProblems` returns a single entry instead of many
 * individual entries for that exception.
 */
export const listUniqueProblems: {
  (
    input: ListUniqueProblemsRequest,
  ): Effect.Effect<
    ListUniqueProblemsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUniqueProblemsRequest,
  ) => Stream.Stream<
    ListUniqueProblemsResult,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUniqueProblemsRequest,
  ) => Stream.Stream<
    unknown,
    | ArgumentException
    | LimitExceededException
    | NotFoundException
    | ServiceAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUniqueProblemsRequest,
  output: ListUniqueProblemsResult,
  errors: [
    ArgumentException,
    LimitExceededException,
    NotFoundException,
    ServiceAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "uniqueProblems",
  } as const,
}));
/**
 * Associates the specified tags to a resource with the specified `resourceArn`. If existing tags
 * on a resource are not specified in the request parameters, they are not changed. When a resource is deleted,
 * the tags associated with that resource are also deleted.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | ArgumentException
  | NotFoundException
  | TagOperationException
  | TagPolicyException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ArgumentException,
    NotFoundException,
    TagOperationException,
    TagPolicyException,
    TooManyTagsException,
  ],
}));
