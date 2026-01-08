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
  sdkId: "WorkSpaces Thin Client",
  serviceShapeName: "ThinClient",
});
const auth = T.AwsAuthSigv4({ name: "thinclient" });
const ver = T.ServiceVersion("2023-08-22");
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
              `https://thinclient-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://thinclient-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://thinclient.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://thinclient.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EnvironmentName = string | Redacted.Redacted<string>;
export type Arn = string;
export type DesktopEndpoint = string | Redacted.Redacted<string>;
export type SoftwareSetId = string;
export type KmsKeyArn = string;
export type ClientToken = string;
export type DeviceId = string;
export type EnvironmentId = string;
export type PaginationToken = string;
export type MaxResults = number;
export type DeviceName = string | Redacted.Redacted<string>;
export type SoftwareSetIdOrEmptyString = string;
export type Hour = number;
export type Minute = number;
export type DeviceCreationTagKey = string;
export type DeviceCreationTagValue = string;
export type ExceptionMessage = string;
export type UserId = string | Redacted.Redacted<string>;
export type ActivationCode = string | Redacted.Redacted<string>;
export type ResourceId = string;
export type ResourceType = string;
export type RetryAfterSeconds = number;
export type ServiceCode = string;
export type QuotaCode = string;
export type FieldName = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface DeleteDeviceRequest {
  id: string;
  clientToken?: string;
}
export const DeleteDeviceRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/devices/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDeviceRequest",
}) as any as S.Schema<DeleteDeviceRequest>;
export interface DeleteDeviceResponse {}
export const DeleteDeviceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteDeviceResponse",
}) as any as S.Schema<DeleteDeviceResponse>;
export interface DeleteEnvironmentRequest {
  id: string;
  clientToken?: string;
}
export const DeleteEnvironmentRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/environments/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentRequest",
}) as any as S.Schema<DeleteEnvironmentRequest>;
export interface DeleteEnvironmentResponse {}
export const DeleteEnvironmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentResponse",
}) as any as S.Schema<DeleteEnvironmentResponse>;
export interface DeregisterDeviceRequest {
  id: string;
  targetDeviceStatus?: string;
  clientToken?: string;
}
export const DeregisterDeviceRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    targetDeviceStatus: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deregister-device/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterDeviceRequest",
}) as any as S.Schema<DeregisterDeviceRequest>;
export interface DeregisterDeviceResponse {}
export const DeregisterDeviceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterDeviceResponse",
}) as any as S.Schema<DeregisterDeviceResponse>;
export interface GetDeviceRequest {
  id: string;
}
export const GetDeviceRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/devices/{id}" }),
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
export interface GetEnvironmentRequest {
  id: string;
}
export const GetEnvironmentRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environments/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentRequest",
}) as any as S.Schema<GetEnvironmentRequest>;
export interface GetSoftwareSetRequest {
  id: string;
}
export const GetSoftwareSetRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/softwaresets/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSoftwareSetRequest",
}) as any as S.Schema<GetSoftwareSetRequest>;
export interface ListDevicesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListDevicesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/devices" }),
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
export interface ListEnvironmentsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentsRequest",
}) as any as S.Schema<ListEnvironmentsRequest>;
export interface ListSoftwareSetsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListSoftwareSetsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/softwaresets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSoftwareSetsRequest",
}) as any as S.Schema<ListSoftwareSetsRequest>;
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
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
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
export interface UpdateDeviceRequest {
  id: string;
  name?: string | Redacted.Redacted<string>;
  desiredSoftwareSetId?: string;
  softwareSetUpdateSchedule?: string;
}
export const UpdateDeviceRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(SensitiveString),
    desiredSoftwareSetId: S.optional(S.String),
    softwareSetUpdateSchedule: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/devices/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDeviceRequest",
}) as any as S.Schema<UpdateDeviceRequest>;
export type DayOfWeekList = string[];
export const DayOfWeekList = S.Array(S.String);
export interface MaintenanceWindow {
  type: string;
  startTimeHour?: number;
  startTimeMinute?: number;
  endTimeHour?: number;
  endTimeMinute?: number;
  daysOfTheWeek?: DayOfWeekList;
  applyTimeOf?: string;
}
export const MaintenanceWindow = S.suspend(() =>
  S.Struct({
    type: S.String,
    startTimeHour: S.optional(S.Number),
    startTimeMinute: S.optional(S.Number),
    endTimeHour: S.optional(S.Number),
    endTimeMinute: S.optional(S.Number),
    daysOfTheWeek: S.optional(DayOfWeekList),
    applyTimeOf: S.optional(S.String),
  }),
).annotations({
  identifier: "MaintenanceWindow",
}) as any as S.Schema<MaintenanceWindow>;
export type DeviceCreationTagsMap = { [key: string]: string };
export const DeviceCreationTagsMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface UpdateEnvironmentRequest {
  id: string;
  name?: string | Redacted.Redacted<string>;
  desktopArn?: string;
  desktopEndpoint?: string | Redacted.Redacted<string>;
  softwareSetUpdateSchedule?: string;
  maintenanceWindow?: MaintenanceWindow;
  softwareSetUpdateMode?: string;
  desiredSoftwareSetId?: string;
  deviceCreationTags?: DeviceCreationTagsMap;
}
export const UpdateEnvironmentRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(SensitiveString),
    desktopArn: S.optional(S.String),
    desktopEndpoint: S.optional(SensitiveString),
    softwareSetUpdateSchedule: S.optional(S.String),
    maintenanceWindow: S.optional(MaintenanceWindow),
    softwareSetUpdateMode: S.optional(S.String),
    desiredSoftwareSetId: S.optional(S.String),
    deviceCreationTags: S.optional(DeviceCreationTagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/environments/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnvironmentRequest",
}) as any as S.Schema<UpdateEnvironmentRequest>;
export interface UpdateSoftwareSetRequest {
  id: string;
  validationStatus: string;
}
export const UpdateSoftwareSetRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    validationStatus: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/softwaresets/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSoftwareSetRequest",
}) as any as S.Schema<UpdateSoftwareSetRequest>;
export interface UpdateSoftwareSetResponse {}
export const UpdateSoftwareSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateSoftwareSetResponse",
}) as any as S.Schema<UpdateSoftwareSetResponse>;
export interface CreateEnvironmentRequest {
  name?: string | Redacted.Redacted<string>;
  desktopArn: string;
  desktopEndpoint?: string | Redacted.Redacted<string>;
  softwareSetUpdateSchedule?: string;
  maintenanceWindow?: MaintenanceWindow;
  softwareSetUpdateMode?: string;
  desiredSoftwareSetId?: string;
  kmsKeyArn?: string;
  clientToken?: string;
  tags?: TagsMap;
  deviceCreationTags?: DeviceCreationTagsMap;
}
export const CreateEnvironmentRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(SensitiveString),
    desktopArn: S.String,
    desktopEndpoint: S.optional(SensitiveString),
    softwareSetUpdateSchedule: S.optional(S.String),
    maintenanceWindow: S.optional(MaintenanceWindow),
    softwareSetUpdateMode: S.optional(S.String),
    desiredSoftwareSetId: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
    deviceCreationTags: S.optional(DeviceCreationTagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/environments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentRequest",
}) as any as S.Schema<CreateEnvironmentRequest>;
export interface ListTagsForResourceResponse {
  tags?: TagsMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface DeviceSummary {
  id?: string;
  serialNumber?: string;
  name?: string | Redacted.Redacted<string>;
  model?: string;
  environmentId?: string;
  status?: string;
  currentSoftwareSetId?: string;
  desiredSoftwareSetId?: string;
  pendingSoftwareSetId?: string;
  softwareSetUpdateSchedule?: string;
  lastConnectedAt?: Date;
  lastPostureAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  arn?: string;
  lastUserId?: string | Redacted.Redacted<string>;
}
export const DeviceSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    serialNumber: S.optional(S.String),
    name: S.optional(SensitiveString),
    model: S.optional(S.String),
    environmentId: S.optional(S.String),
    status: S.optional(S.String),
    currentSoftwareSetId: S.optional(S.String),
    desiredSoftwareSetId: S.optional(S.String),
    pendingSoftwareSetId: S.optional(S.String),
    softwareSetUpdateSchedule: S.optional(S.String),
    lastConnectedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastPostureAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    arn: S.optional(S.String),
    lastUserId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "DeviceSummary",
}) as any as S.Schema<DeviceSummary>;
export interface UpdateDeviceResponse {
  device?: DeviceSummary;
}
export const UpdateDeviceResponse = S.suspend(() =>
  S.Struct({ device: S.optional(DeviceSummary) }),
).annotations({
  identifier: "UpdateDeviceResponse",
}) as any as S.Schema<UpdateDeviceResponse>;
export interface EnvironmentSummary {
  id?: string;
  name?: string | Redacted.Redacted<string>;
  desktopArn?: string;
  desktopEndpoint?: string | Redacted.Redacted<string>;
  desktopType?: string;
  activationCode?: string | Redacted.Redacted<string>;
  softwareSetUpdateSchedule?: string;
  maintenanceWindow?: MaintenanceWindow;
  softwareSetUpdateMode?: string;
  desiredSoftwareSetId?: string;
  pendingSoftwareSetId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  arn?: string;
}
export const EnvironmentSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(SensitiveString),
    desktopArn: S.optional(S.String),
    desktopEndpoint: S.optional(SensitiveString),
    desktopType: S.optional(S.String),
    activationCode: S.optional(SensitiveString),
    softwareSetUpdateSchedule: S.optional(S.String),
    maintenanceWindow: S.optional(MaintenanceWindow),
    softwareSetUpdateMode: S.optional(S.String),
    desiredSoftwareSetId: S.optional(S.String),
    pendingSoftwareSetId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentSummary",
}) as any as S.Schema<EnvironmentSummary>;
export interface UpdateEnvironmentResponse {
  environment?: EnvironmentSummary;
}
export const UpdateEnvironmentResponse = S.suspend(() =>
  S.Struct({ environment: S.optional(EnvironmentSummary) }),
).annotations({
  identifier: "UpdateEnvironmentResponse",
}) as any as S.Schema<UpdateEnvironmentResponse>;
export interface Device {
  id?: string;
  serialNumber?: string;
  name?: string | Redacted.Redacted<string>;
  model?: string;
  environmentId?: string;
  status?: string;
  currentSoftwareSetId?: string;
  currentSoftwareSetVersion?: string;
  desiredSoftwareSetId?: string;
  pendingSoftwareSetId?: string;
  pendingSoftwareSetVersion?: string;
  softwareSetUpdateSchedule?: string;
  softwareSetComplianceStatus?: string;
  softwareSetUpdateStatus?: string;
  lastConnectedAt?: Date;
  lastPostureAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  arn?: string;
  kmsKeyArn?: string;
  lastUserId?: string | Redacted.Redacted<string>;
}
export const Device = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    serialNumber: S.optional(S.String),
    name: S.optional(SensitiveString),
    model: S.optional(S.String),
    environmentId: S.optional(S.String),
    status: S.optional(S.String),
    currentSoftwareSetId: S.optional(S.String),
    currentSoftwareSetVersion: S.optional(S.String),
    desiredSoftwareSetId: S.optional(S.String),
    pendingSoftwareSetId: S.optional(S.String),
    pendingSoftwareSetVersion: S.optional(S.String),
    softwareSetUpdateSchedule: S.optional(S.String),
    softwareSetComplianceStatus: S.optional(S.String),
    softwareSetUpdateStatus: S.optional(S.String),
    lastConnectedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastPostureAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    arn: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    lastUserId: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Device" }) as any as S.Schema<Device>;
export interface Environment {
  id?: string;
  name?: string | Redacted.Redacted<string>;
  desktopArn?: string;
  desktopEndpoint?: string | Redacted.Redacted<string>;
  desktopType?: string;
  activationCode?: string | Redacted.Redacted<string>;
  registeredDevicesCount?: number;
  softwareSetUpdateSchedule?: string;
  maintenanceWindow?: MaintenanceWindow;
  softwareSetUpdateMode?: string;
  desiredSoftwareSetId?: string;
  pendingSoftwareSetId?: string;
  pendingSoftwareSetVersion?: string;
  softwareSetComplianceStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
  arn?: string;
  kmsKeyArn?: string;
  deviceCreationTags?: DeviceCreationTagsMap;
}
export const Environment = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(SensitiveString),
    desktopArn: S.optional(S.String),
    desktopEndpoint: S.optional(SensitiveString),
    desktopType: S.optional(S.String),
    activationCode: S.optional(SensitiveString),
    registeredDevicesCount: S.optional(S.Number),
    softwareSetUpdateSchedule: S.optional(S.String),
    maintenanceWindow: S.optional(MaintenanceWindow),
    softwareSetUpdateMode: S.optional(S.String),
    desiredSoftwareSetId: S.optional(S.String),
    pendingSoftwareSetId: S.optional(S.String),
    pendingSoftwareSetVersion: S.optional(S.String),
    softwareSetComplianceStatus: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    arn: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    deviceCreationTags: S.optional(DeviceCreationTagsMap),
  }),
).annotations({ identifier: "Environment" }) as any as S.Schema<Environment>;
export type DeviceList = DeviceSummary[];
export const DeviceList = S.Array(DeviceSummary);
export type EnvironmentList = EnvironmentSummary[];
export const EnvironmentList = S.Array(EnvironmentSummary);
export interface SoftwareSetSummary {
  id?: string;
  version?: string;
  releasedAt?: Date;
  supportedUntil?: Date;
  validationStatus?: string;
  arn?: string;
}
export const SoftwareSetSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    version: S.optional(S.String),
    releasedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    supportedUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    validationStatus: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "SoftwareSetSummary",
}) as any as S.Schema<SoftwareSetSummary>;
export type SoftwareSetList = SoftwareSetSummary[];
export const SoftwareSetList = S.Array(SoftwareSetSummary);
export interface CreateEnvironmentResponse {
  environment?: EnvironmentSummary;
}
export const CreateEnvironmentResponse = S.suspend(() =>
  S.Struct({ environment: S.optional(EnvironmentSummary) }),
).annotations({
  identifier: "CreateEnvironmentResponse",
}) as any as S.Schema<CreateEnvironmentResponse>;
export interface GetDeviceResponse {
  device?: Device;
}
export const GetDeviceResponse = S.suspend(() =>
  S.Struct({ device: S.optional(Device) }),
).annotations({
  identifier: "GetDeviceResponse",
}) as any as S.Schema<GetDeviceResponse>;
export interface GetEnvironmentResponse {
  environment?: Environment;
}
export const GetEnvironmentResponse = S.suspend(() =>
  S.Struct({ environment: S.optional(Environment) }),
).annotations({
  identifier: "GetEnvironmentResponse",
}) as any as S.Schema<GetEnvironmentResponse>;
export interface ListDevicesResponse {
  devices?: DeviceList;
  nextToken?: string;
}
export const ListDevicesResponse = S.suspend(() =>
  S.Struct({
    devices: S.optional(DeviceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDevicesResponse",
}) as any as S.Schema<ListDevicesResponse>;
export interface ListEnvironmentsResponse {
  environments?: EnvironmentList;
  nextToken?: string;
}
export const ListEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    environments: S.optional(EnvironmentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentsResponse",
}) as any as S.Schema<ListEnvironmentsResponse>;
export interface ListSoftwareSetsResponse {
  softwareSets?: SoftwareSetList;
  nextToken?: string;
}
export const ListSoftwareSetsResponse = S.suspend(() =>
  S.Struct({
    softwareSets: S.optional(SoftwareSetList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSoftwareSetsResponse",
}) as any as S.Schema<ListSoftwareSetsResponse>;
export interface Software {
  name?: string;
  version?: string;
}
export const Software = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), version: S.optional(S.String) }),
).annotations({ identifier: "Software" }) as any as S.Schema<Software>;
export type SoftwareList = Software[];
export const SoftwareList = S.Array(Software);
export interface SoftwareSet {
  id?: string;
  version?: string;
  releasedAt?: Date;
  supportedUntil?: Date;
  validationStatus?: string;
  software?: SoftwareList;
  arn?: string;
}
export const SoftwareSet = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    version: S.optional(S.String),
    releasedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    supportedUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    validationStatus: S.optional(S.String),
    software: S.optional(SoftwareList),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "SoftwareSet" }) as any as S.Schema<SoftwareSet>;
export interface GetSoftwareSetResponse {
  softwareSet?: SoftwareSet;
}
export const GetSoftwareSetResponse = S.suspend(() =>
  S.Struct({ softwareSet: S.optional(SoftwareSet) }),
).annotations({
  identifier: "GetSoftwareSetResponse",
}) as any as S.Schema<GetSoftwareSetResponse>;
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

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of thin client devices.
 */
export const listDevices: {
  (
    input: ListDevicesRequest,
  ): Effect.Effect<
    ListDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevicesRequest,
  ) => Stream.Stream<
    ListDevicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevicesRequest,
  ) => Stream.Stream<
    DeviceSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDevicesRequest,
  output: ListDevicesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "devices",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an environment.
 */
export const updateEnvironment: (
  input: UpdateEnvironmentRequest,
) => Effect.Effect<
  UpdateEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentRequest,
  output: UpdateEnvironmentResponse,
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
 * Deletes an environment.
 */
export const deleteEnvironment: (
  input: DeleteEnvironmentRequest,
) => Effect.Effect<
  DeleteEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResponse,
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
 * Deregisters a thin client device.
 */
export const deregisterDevice: (
  input: DeregisterDeviceRequest,
) => Effect.Effect<
  DeregisterDeviceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterDeviceRequest,
  output: DeregisterDeviceResponse,
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
 * Assigns one or more tags (key-value pairs) to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ConflictException
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag or tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
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
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a thin client device.
 */
export const updateDevice: (
  input: UpdateDeviceRequest,
) => Effect.Effect<
  UpdateDeviceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeviceRequest,
  output: UpdateDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a software set.
 */
export const updateSoftwareSet: (
  input: UpdateSoftwareSetRequest,
) => Effect.Effect<
  UpdateSoftwareSetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSoftwareSetRequest,
  output: UpdateSoftwareSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a thin client device.
 */
export const deleteDevice: (
  input: DeleteDeviceRequest,
) => Effect.Effect<
  DeleteDeviceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeviceRequest,
  output: DeleteDeviceResponse,
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
 * Returns information for a thin client device.
 */
export const getDevice: (
  input: GetDeviceRequest,
) => Effect.Effect<
  GetDeviceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceRequest,
  output: GetDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information for an environment.
 */
export const getEnvironment: (
  input: GetEnvironmentRequest,
) => Effect.Effect<
  GetEnvironmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentRequest,
  output: GetEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information for a software set.
 */
export const getSoftwareSet: (
  input: GetSoftwareSetRequest,
) => Effect.Effect<
  GetSoftwareSetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSoftwareSetRequest,
  output: GetSoftwareSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of environments.
 */
export const listEnvironments: {
  (
    input: ListEnvironmentsRequest,
  ): Effect.Effect<
    ListEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentsRequest,
  ) => Stream.Stream<
    ListEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentsRequest,
  ) => Stream.Stream<
    EnvironmentSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentsRequest,
  output: ListEnvironmentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "environments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of software sets.
 */
export const listSoftwareSets: {
  (
    input: ListSoftwareSetsRequest,
  ): Effect.Effect<
    ListSoftwareSetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSoftwareSetsRequest,
  ) => Stream.Stream<
    ListSoftwareSetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSoftwareSetsRequest,
  ) => Stream.Stream<
    SoftwareSetSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSoftwareSetsRequest,
  output: ListSoftwareSetsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "softwareSets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
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
 * Creates an environment for your thin client devices.
 */
export const createEnvironment: (
  input: CreateEnvironmentRequest,
) => Effect.Effect<
  CreateEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentRequest,
  output: CreateEnvironmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
