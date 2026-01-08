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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Panorama",
  serviceShapeName: "OmniCloudServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "panorama" });
const ver = T.ServiceVersion("2019-07-24");
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
              `https://panorama-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://panorama-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://panorama.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://panorama.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ApplicationInstanceName = string;
export type Description = string;
export type ApplicationInstanceId = string;
export type RuntimeRoleArn = string;
export type DefaultRuntimeContextDevice = string;
export type DeviceId = string;
export type JobType = string;
export type TemplateType = string;
export type NodePackageName = string;
export type NodePackageVersion = string;
export type NodeName = string;
export type PackageImportJobType = string;
export type ClientToken = string;
export type NodePackageId = string;
export type PackageOwnerAccount = string;
export type NodePackagePatchVersion = string;
export type JobId = string;
export type NodeId = string;
export type MaxSize25 = number;
export type NextToken = string;
export type StatusFilter = string;
export type ListDevicesSortBy = string;
export type SortOrder = string;
export type NameFilter = string;
export type DeviceAggregatedStatus = string;
export type NodeCategory = string;
export type Token = string;
export type ResourceArn = string;
export type DeviceName = string;
export type MarkLatestPatch = boolean;
export type TagKey = string;
export type ManifestPayloadData = string;
export type ManifestOverridesPayloadData = string;
export type TagValue = string;
export type TemplateKey = string;
export type TemplateValue = string | redacted.Redacted<string>;
export type JobResourceType = string;
export type NodeInstanceId = string;
export type NodeSignalValue = string;
export type NodePackageArn = string;
export type ApplicationInstanceStatus = string;
export type ApplicationInstanceHealthStatus = string;
export type ApplicationInstanceStatusDescription = string;
export type ApplicationInstanceArn = string;
export type DeviceArn = string;
export type DeviceType = string;
export type DeviceConnectionStatus = string;
export type CreatedTime = Date;
export type DeviceStatus = string;
export type LatestSoftware = string;
export type CurrentSoftware = string;
export type DeviceSerialNumber = string;
export type LeaseExpirationTime = Date;
export type LatestAlternateSoftware = string;
export type DeviceBrand = string;
export type ImageVersion = string;
export type UpdateProgress = string;
export type UpdateCreatedTime = Date;
export type NodeAssetName = string;
export type NodeFromTemplateJobStatus = string;
export type NodeFromTemplateJobStatusMessage = string;
export type LastUpdatedTime = Date;
export type PrincipalArn = string;
export type PackageImportJobStatus = string;
export type PackageImportJobStatusMessage = string;
export type PackageVersionStatus = string;
export type PackageVersionStatusDescription = string;
export type RetryAfterSeconds = number;
export type ConnectionType = string;
export type IpAddressOrServerName = string;
export type Bucket = string;
export type DesiredState = string;
export type RuntimeContextName = string;
export type DeviceReportedStatus = string;
export type Version = string;
export type NodeInstanceStatus = string;
export type Region = string;
export type BucketName = string;
export type ObjectKey = string;
export type IpAddress = string;
export type Mask = string;
export type Dns = string;
export type DefaultGateway = string;
export type NetworkConnectionStatus = string;
export type HwAddress = string;
export type NtpServerName = string;
export type PortName = string;
export type PortType = string;
export type PortDefaultValue = string;
export type MaxConnections = number;
export type ValidationExceptionReason = string;
export type Certificates = Uint8Array;
export type IotThingName = string;

//# Schemas
export type DeviceIdList = string[];
export const DeviceIdList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreatePackageRequest {
  PackageName: string;
  Tags?: { [key: string]: string };
}
export const CreatePackageRequest = S.suspend(() =>
  S.Struct({ PackageName: S.String, Tags: S.optional(TagMap) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/packages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePackageRequest",
}) as any as S.Schema<CreatePackageRequest>;
export interface DeleteDeviceRequest {
  DeviceId: string;
}
export const DeleteDeviceRequest = S.suspend(() =>
  S.Struct({ DeviceId: S.String.pipe(T.HttpLabel("DeviceId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/devices/{DeviceId}" }),
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
export interface DeletePackageRequest {
  PackageId: string;
  ForceDelete?: boolean;
}
export const DeletePackageRequest = S.suspend(() =>
  S.Struct({
    PackageId: S.String.pipe(T.HttpLabel("PackageId")),
    ForceDelete: S.optional(S.Boolean).pipe(T.HttpQuery("ForceDelete")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/packages/{PackageId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePackageRequest",
}) as any as S.Schema<DeletePackageRequest>;
export interface DeletePackageResponse {}
export const DeletePackageResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePackageResponse",
}) as any as S.Schema<DeletePackageResponse>;
export interface DeregisterPackageVersionRequest {
  OwnerAccount?: string;
  PackageId: string;
  PackageVersion: string;
  PatchVersion: string;
  UpdatedLatestPatchVersion?: string;
}
export const DeregisterPackageVersionRequest = S.suspend(() =>
  S.Struct({
    OwnerAccount: S.optional(S.String).pipe(T.HttpQuery("OwnerAccount")),
    PackageId: S.String.pipe(T.HttpLabel("PackageId")),
    PackageVersion: S.String.pipe(T.HttpLabel("PackageVersion")),
    PatchVersion: S.String.pipe(T.HttpLabel("PatchVersion")),
    UpdatedLatestPatchVersion: S.optional(S.String).pipe(
      T.HttpQuery("UpdatedLatestPatchVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/packages/{PackageId}/versions/{PackageVersion}/patch/{PatchVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterPackageVersionRequest",
}) as any as S.Schema<DeregisterPackageVersionRequest>;
export interface DeregisterPackageVersionResponse {}
export const DeregisterPackageVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterPackageVersionResponse",
}) as any as S.Schema<DeregisterPackageVersionResponse>;
export interface DescribeApplicationInstanceRequest {
  ApplicationInstanceId: string;
}
export const DescribeApplicationInstanceRequest = S.suspend(() =>
  S.Struct({
    ApplicationInstanceId: S.String.pipe(T.HttpLabel("ApplicationInstanceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/application-instances/{ApplicationInstanceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeApplicationInstanceRequest",
}) as any as S.Schema<DescribeApplicationInstanceRequest>;
export interface DescribeApplicationInstanceDetailsRequest {
  ApplicationInstanceId: string;
}
export const DescribeApplicationInstanceDetailsRequest = S.suspend(() =>
  S.Struct({
    ApplicationInstanceId: S.String.pipe(T.HttpLabel("ApplicationInstanceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/application-instances/{ApplicationInstanceId}/details",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeApplicationInstanceDetailsRequest",
}) as any as S.Schema<DescribeApplicationInstanceDetailsRequest>;
export interface DescribeDeviceRequest {
  DeviceId: string;
}
export const DescribeDeviceRequest = S.suspend(() =>
  S.Struct({ DeviceId: S.String.pipe(T.HttpLabel("DeviceId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/devices/{DeviceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDeviceRequest",
}) as any as S.Schema<DescribeDeviceRequest>;
export interface DescribeDeviceJobRequest {
  JobId: string;
}
export const DescribeDeviceJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.HttpLabel("JobId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs/{JobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDeviceJobRequest",
}) as any as S.Schema<DescribeDeviceJobRequest>;
export interface DescribeNodeRequest {
  NodeId: string;
  OwnerAccount?: string;
}
export const DescribeNodeRequest = S.suspend(() =>
  S.Struct({
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
    OwnerAccount: S.optional(S.String).pipe(T.HttpQuery("OwnerAccount")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/nodes/{NodeId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeNodeRequest",
}) as any as S.Schema<DescribeNodeRequest>;
export interface DescribeNodeFromTemplateJobRequest {
  JobId: string;
}
export const DescribeNodeFromTemplateJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.HttpLabel("JobId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packages/template-job/{JobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeNodeFromTemplateJobRequest",
}) as any as S.Schema<DescribeNodeFromTemplateJobRequest>;
export interface DescribePackageRequest {
  PackageId: string;
}
export const DescribePackageRequest = S.suspend(() =>
  S.Struct({ PackageId: S.String.pipe(T.HttpLabel("PackageId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packages/metadata/{PackageId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePackageRequest",
}) as any as S.Schema<DescribePackageRequest>;
export interface DescribePackageImportJobRequest {
  JobId: string;
}
export const DescribePackageImportJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.HttpLabel("JobId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packages/import-jobs/{JobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePackageImportJobRequest",
}) as any as S.Schema<DescribePackageImportJobRequest>;
export interface DescribePackageVersionRequest {
  OwnerAccount?: string;
  PackageId: string;
  PackageVersion: string;
  PatchVersion?: string;
}
export const DescribePackageVersionRequest = S.suspend(() =>
  S.Struct({
    OwnerAccount: S.optional(S.String).pipe(T.HttpQuery("OwnerAccount")),
    PackageId: S.String.pipe(T.HttpLabel("PackageId")),
    PackageVersion: S.String.pipe(T.HttpLabel("PackageVersion")),
    PatchVersion: S.optional(S.String).pipe(T.HttpQuery("PatchVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/packages/metadata/{PackageId}/versions/{PackageVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePackageVersionRequest",
}) as any as S.Schema<DescribePackageVersionRequest>;
export interface ListApplicationInstanceDependenciesRequest {
  ApplicationInstanceId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListApplicationInstanceDependenciesRequest = S.suspend(() =>
  S.Struct({
    ApplicationInstanceId: S.String.pipe(T.HttpLabel("ApplicationInstanceId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/application-instances/{ApplicationInstanceId}/package-dependencies",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationInstanceDependenciesRequest",
}) as any as S.Schema<ListApplicationInstanceDependenciesRequest>;
export interface ListApplicationInstanceNodeInstancesRequest {
  ApplicationInstanceId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListApplicationInstanceNodeInstancesRequest = S.suspend(() =>
  S.Struct({
    ApplicationInstanceId: S.String.pipe(T.HttpLabel("ApplicationInstanceId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/application-instances/{ApplicationInstanceId}/node-instances",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationInstanceNodeInstancesRequest",
}) as any as S.Schema<ListApplicationInstanceNodeInstancesRequest>;
export interface ListApplicationInstancesRequest {
  DeviceId?: string;
  StatusFilter?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListApplicationInstancesRequest = S.suspend(() =>
  S.Struct({
    DeviceId: S.optional(S.String).pipe(T.HttpQuery("deviceId")),
    StatusFilter: S.optional(S.String).pipe(T.HttpQuery("statusFilter")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/application-instances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationInstancesRequest",
}) as any as S.Schema<ListApplicationInstancesRequest>;
export interface ListDevicesRequest {
  NextToken?: string;
  MaxResults?: number;
  SortBy?: string;
  SortOrder?: string;
  NameFilter?: string;
  DeviceAggregatedStatusFilter?: string;
}
export const ListDevicesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    SortBy: S.optional(S.String).pipe(T.HttpQuery("SortBy")),
    SortOrder: S.optional(S.String).pipe(T.HttpQuery("SortOrder")),
    NameFilter: S.optional(S.String).pipe(T.HttpQuery("NameFilter")),
    DeviceAggregatedStatusFilter: S.optional(S.String).pipe(
      T.HttpQuery("DeviceAggregatedStatusFilter"),
    ),
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
export interface ListDevicesJobsRequest {
  DeviceId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDevicesJobsRequest = S.suspend(() =>
  S.Struct({
    DeviceId: S.optional(S.String).pipe(T.HttpQuery("DeviceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDevicesJobsRequest",
}) as any as S.Schema<ListDevicesJobsRequest>;
export interface ListNodeFromTemplateJobsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListNodeFromTemplateJobsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packages/template-job" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNodeFromTemplateJobsRequest",
}) as any as S.Schema<ListNodeFromTemplateJobsRequest>;
export interface ListNodesRequest {
  Category?: string;
  OwnerAccount?: string;
  PackageName?: string;
  PackageVersion?: string;
  PatchVersion?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListNodesRequest = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String).pipe(T.HttpQuery("category")),
    OwnerAccount: S.optional(S.String).pipe(T.HttpQuery("ownerAccount")),
    PackageName: S.optional(S.String).pipe(T.HttpQuery("packageName")),
    PackageVersion: S.optional(S.String).pipe(T.HttpQuery("packageVersion")),
    PatchVersion: S.optional(S.String).pipe(T.HttpQuery("patchVersion")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/nodes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNodesRequest",
}) as any as S.Schema<ListNodesRequest>;
export interface ListPackageImportJobsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListPackageImportJobsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packages/import-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackageImportJobsRequest",
}) as any as S.Schema<ListPackageImportJobsRequest>;
export interface ListPackagesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListPackagesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackagesRequest",
}) as any as S.Schema<ListPackagesRequest>;
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
export interface RegisterPackageVersionRequest {
  OwnerAccount?: string;
  PackageId: string;
  PackageVersion: string;
  PatchVersion: string;
  MarkLatest?: boolean;
}
export const RegisterPackageVersionRequest = S.suspend(() =>
  S.Struct({
    OwnerAccount: S.optional(S.String),
    PackageId: S.String.pipe(T.HttpLabel("PackageId")),
    PackageVersion: S.String.pipe(T.HttpLabel("PackageVersion")),
    PatchVersion: S.String.pipe(T.HttpLabel("PatchVersion")),
    MarkLatest: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/packages/{PackageId}/versions/{PackageVersion}/patch/{PatchVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterPackageVersionRequest",
}) as any as S.Schema<RegisterPackageVersionRequest>;
export interface RegisterPackageVersionResponse {}
export const RegisterPackageVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RegisterPackageVersionResponse",
}) as any as S.Schema<RegisterPackageVersionResponse>;
export interface RemoveApplicationInstanceRequest {
  ApplicationInstanceId: string;
}
export const RemoveApplicationInstanceRequest = S.suspend(() =>
  S.Struct({
    ApplicationInstanceId: S.String.pipe(T.HttpLabel("ApplicationInstanceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/application-instances/{ApplicationInstanceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveApplicationInstanceRequest",
}) as any as S.Schema<RemoveApplicationInstanceRequest>;
export interface RemoveApplicationInstanceResponse {}
export const RemoveApplicationInstanceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveApplicationInstanceResponse",
}) as any as S.Schema<RemoveApplicationInstanceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export interface UpdateDeviceMetadataRequest {
  DeviceId: string;
  Description?: string;
}
export const UpdateDeviceMetadataRequest = S.suspend(() =>
  S.Struct({
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/devices/{DeviceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDeviceMetadataRequest",
}) as any as S.Schema<UpdateDeviceMetadataRequest>;
export type ManifestPayload = { PayloadData: string };
export const ManifestPayload = S.Union(S.Struct({ PayloadData: S.String }));
export type ManifestOverridesPayload = { PayloadData: string };
export const ManifestOverridesPayload = S.Union(
  S.Struct({ PayloadData: S.String }),
);
export type TemplateParametersMap = {
  [key: string]: string | redacted.Redacted<string>;
};
export const TemplateParametersMap = S.Record({
  key: S.String,
  value: SensitiveString,
});
export interface JobResourceTags {
  ResourceType: string;
  Tags: { [key: string]: string };
}
export const JobResourceTags = S.suspend(() =>
  S.Struct({ ResourceType: S.String, Tags: TagMap }),
).annotations({
  identifier: "JobResourceTags",
}) as any as S.Schema<JobResourceTags>;
export type JobTagsList = JobResourceTags[];
export const JobTagsList = S.Array(JobResourceTags);
export type PrincipalArnsList = string[];
export const PrincipalArnsList = S.Array(S.String);
export interface NodeSignal {
  NodeInstanceId: string;
  Signal: string;
}
export const NodeSignal = S.suspend(() =>
  S.Struct({ NodeInstanceId: S.String, Signal: S.String }),
).annotations({ identifier: "NodeSignal" }) as any as S.Schema<NodeSignal>;
export type NodeSignalList = NodeSignal[];
export const NodeSignalList = S.Array(NodeSignal);
export type NtpServerList = string[];
export const NtpServerList = S.Array(S.String);
export interface CreateApplicationInstanceRequest {
  Name?: string;
  Description?: string;
  ManifestPayload: ManifestPayload;
  ManifestOverridesPayload?: ManifestOverridesPayload;
  ApplicationInstanceIdToReplace?: string;
  RuntimeRoleArn?: string;
  DefaultRuntimeContextDevice: string;
  Tags?: { [key: string]: string };
}
export const CreateApplicationInstanceRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ManifestPayload: ManifestPayload,
    ManifestOverridesPayload: S.optional(ManifestOverridesPayload),
    ApplicationInstanceIdToReplace: S.optional(S.String),
    RuntimeRoleArn: S.optional(S.String),
    DefaultRuntimeContextDevice: S.String,
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/application-instances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationInstanceRequest",
}) as any as S.Schema<CreateApplicationInstanceRequest>;
export interface CreateNodeFromTemplateJobRequest {
  TemplateType: string;
  OutputPackageName: string;
  OutputPackageVersion: string;
  NodeName: string;
  NodeDescription?: string;
  TemplateParameters: { [key: string]: string | redacted.Redacted<string> };
  JobTags?: JobResourceTags[];
}
export const CreateNodeFromTemplateJobRequest = S.suspend(() =>
  S.Struct({
    TemplateType: S.String,
    OutputPackageName: S.String,
    OutputPackageVersion: S.String,
    NodeName: S.String,
    NodeDescription: S.optional(S.String),
    TemplateParameters: TemplateParametersMap,
    JobTags: S.optional(JobTagsList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/packages/template-job" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNodeFromTemplateJobRequest",
}) as any as S.Schema<CreateNodeFromTemplateJobRequest>;
export interface DeleteDeviceResponse {
  DeviceId?: string;
}
export const DeleteDeviceResponse = S.suspend(() =>
  S.Struct({ DeviceId: S.optional(S.String) }),
).annotations({
  identifier: "DeleteDeviceResponse",
}) as any as S.Schema<DeleteDeviceResponse>;
export interface DescribeApplicationInstanceDetailsResponse {
  Name?: string;
  Description?: string;
  DefaultRuntimeContextDevice?: string;
  ManifestPayload?: ManifestPayload;
  ManifestOverridesPayload?: ManifestOverridesPayload;
  ApplicationInstanceIdToReplace?: string;
  CreatedTime?: Date;
  ApplicationInstanceId?: string;
}
export const DescribeApplicationInstanceDetailsResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    DefaultRuntimeContextDevice: S.optional(S.String),
    ManifestPayload: S.optional(ManifestPayload),
    ManifestOverridesPayload: S.optional(ManifestOverridesPayload),
    ApplicationInstanceIdToReplace: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ApplicationInstanceId: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeApplicationInstanceDetailsResponse",
}) as any as S.Schema<DescribeApplicationInstanceDetailsResponse>;
export interface DescribeDeviceJobResponse {
  JobId?: string;
  DeviceId?: string;
  DeviceArn?: string;
  DeviceName?: string;
  DeviceType?: string;
  ImageVersion?: string;
  Status?: string;
  CreatedTime?: Date;
  JobType?: string;
}
export const DescribeDeviceJobResponse = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    DeviceId: S.optional(S.String),
    DeviceArn: S.optional(S.String),
    DeviceName: S.optional(S.String),
    DeviceType: S.optional(S.String),
    ImageVersion: S.optional(S.String),
    Status: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobType: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeDeviceJobResponse",
}) as any as S.Schema<DescribeDeviceJobResponse>;
export interface DescribeNodeFromTemplateJobResponse {
  JobId: string;
  Status: string;
  StatusMessage: string;
  CreatedTime: Date;
  LastUpdatedTime: Date;
  OutputPackageName: string;
  OutputPackageVersion: string;
  NodeName: string;
  NodeDescription?: string;
  TemplateType: string;
  TemplateParameters: { [key: string]: string | redacted.Redacted<string> };
  JobTags?: JobResourceTags[];
}
export const DescribeNodeFromTemplateJobResponse = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    Status: S.String,
    StatusMessage: S.String,
    CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    OutputPackageName: S.String,
    OutputPackageVersion: S.String,
    NodeName: S.String,
    NodeDescription: S.optional(S.String),
    TemplateType: S.String,
    TemplateParameters: TemplateParametersMap,
    JobTags: S.optional(JobTagsList),
  }),
).annotations({
  identifier: "DescribeNodeFromTemplateJobResponse",
}) as any as S.Schema<DescribeNodeFromTemplateJobResponse>;
export interface StorageLocation {
  Bucket: string;
  RepoPrefixLocation: string;
  GeneratedPrefixLocation: string;
  BinaryPrefixLocation: string;
  ManifestPrefixLocation: string;
}
export const StorageLocation = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    RepoPrefixLocation: S.String,
    GeneratedPrefixLocation: S.String,
    BinaryPrefixLocation: S.String,
    ManifestPrefixLocation: S.String,
  }),
).annotations({
  identifier: "StorageLocation",
}) as any as S.Schema<StorageLocation>;
export interface DescribePackageResponse {
  PackageId: string;
  PackageName: string;
  Arn: string;
  StorageLocation: StorageLocation;
  ReadAccessPrincipalArns?: string[];
  WriteAccessPrincipalArns?: string[];
  CreatedTime: Date;
  Tags: { [key: string]: string };
}
export const DescribePackageResponse = S.suspend(() =>
  S.Struct({
    PackageId: S.String,
    PackageName: S.String,
    Arn: S.String,
    StorageLocation: StorageLocation,
    ReadAccessPrincipalArns: S.optional(PrincipalArnsList),
    WriteAccessPrincipalArns: S.optional(PrincipalArnsList),
    CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: TagMap,
  }),
).annotations({
  identifier: "DescribePackageResponse",
}) as any as S.Schema<DescribePackageResponse>;
export interface DescribePackageVersionResponse {
  OwnerAccount?: string;
  PackageId: string;
  PackageArn?: string;
  PackageName: string;
  PackageVersion: string;
  PatchVersion: string;
  IsLatestPatch: boolean;
  Status: string;
  StatusDescription?: string;
  RegisteredTime?: Date;
}
export const DescribePackageVersionResponse = S.suspend(() =>
  S.Struct({
    OwnerAccount: S.optional(S.String),
    PackageId: S.String,
    PackageArn: S.optional(S.String),
    PackageName: S.String,
    PackageVersion: S.String,
    PatchVersion: S.String,
    IsLatestPatch: S.Boolean,
    Status: S.String,
    StatusDescription: S.optional(S.String),
    RegisteredTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribePackageVersionResponse",
}) as any as S.Schema<DescribePackageVersionResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface SignalApplicationInstanceNodeInstancesRequest {
  ApplicationInstanceId: string;
  NodeSignals: NodeSignal[];
}
export const SignalApplicationInstanceNodeInstancesRequest = S.suspend(() =>
  S.Struct({
    ApplicationInstanceId: S.String.pipe(T.HttpLabel("ApplicationInstanceId")),
    NodeSignals: NodeSignalList,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/application-instances/{ApplicationInstanceId}/node-signals",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SignalApplicationInstanceNodeInstancesRequest",
}) as any as S.Schema<SignalApplicationInstanceNodeInstancesRequest>;
export interface UpdateDeviceMetadataResponse {
  DeviceId?: string;
}
export const UpdateDeviceMetadataResponse = S.suspend(() =>
  S.Struct({ DeviceId: S.optional(S.String) }),
).annotations({
  identifier: "UpdateDeviceMetadataResponse",
}) as any as S.Schema<UpdateDeviceMetadataResponse>;
export interface OTAJobConfig {
  ImageVersion: string;
  AllowMajorVersionUpdate?: boolean;
}
export const OTAJobConfig = S.suspend(() =>
  S.Struct({
    ImageVersion: S.String,
    AllowMajorVersionUpdate: S.optional(S.Boolean),
  }),
).annotations({ identifier: "OTAJobConfig" }) as any as S.Schema<OTAJobConfig>;
export interface PackageVersionOutputConfig {
  PackageName: string;
  PackageVersion: string;
  MarkLatest?: boolean;
}
export const PackageVersionOutputConfig = S.suspend(() =>
  S.Struct({
    PackageName: S.String,
    PackageVersion: S.String,
    MarkLatest: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PackageVersionOutputConfig",
}) as any as S.Schema<PackageVersionOutputConfig>;
export interface NtpPayload {
  NtpServers: string[];
}
export const NtpPayload = S.suspend(() =>
  S.Struct({ NtpServers: NtpServerList }),
).annotations({ identifier: "NtpPayload" }) as any as S.Schema<NtpPayload>;
export type DnsList = string[];
export const DnsList = S.Array(S.String);
export interface DeviceJobConfig {
  OTAJobConfig?: OTAJobConfig;
}
export const DeviceJobConfig = S.suspend(() =>
  S.Struct({ OTAJobConfig: S.optional(OTAJobConfig) }),
).annotations({
  identifier: "DeviceJobConfig",
}) as any as S.Schema<DeviceJobConfig>;
export interface PackageImportJobOutputConfig {
  PackageVersionOutputConfig?: PackageVersionOutputConfig;
}
export const PackageImportJobOutputConfig = S.suspend(() =>
  S.Struct({
    PackageVersionOutputConfig: S.optional(PackageVersionOutputConfig),
  }),
).annotations({
  identifier: "PackageImportJobOutputConfig",
}) as any as S.Schema<PackageImportJobOutputConfig>;
export interface ReportedRuntimeContextState {
  DesiredState: string;
  RuntimeContextName: string;
  DeviceReportedStatus: string;
  DeviceReportedTime: Date;
}
export const ReportedRuntimeContextState = S.suspend(() =>
  S.Struct({
    DesiredState: S.String,
    RuntimeContextName: S.String,
    DeviceReportedStatus: S.String,
    DeviceReportedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ReportedRuntimeContextState",
}) as any as S.Schema<ReportedRuntimeContextState>;
export type ReportedRuntimeContextStates = ReportedRuntimeContextState[];
export const ReportedRuntimeContextStates = S.Array(
  ReportedRuntimeContextState,
);
export interface AlternateSoftwareMetadata {
  Version?: string;
}
export const AlternateSoftwareMetadata = S.suspend(() =>
  S.Struct({ Version: S.optional(S.String) }),
).annotations({
  identifier: "AlternateSoftwareMetadata",
}) as any as S.Schema<AlternateSoftwareMetadata>;
export type AlternateSoftwares = AlternateSoftwareMetadata[];
export const AlternateSoftwares = S.Array(AlternateSoftwareMetadata);
export interface LatestDeviceJob {
  ImageVersion?: string;
  Status?: string;
  JobType?: string;
}
export const LatestDeviceJob = S.suspend(() =>
  S.Struct({
    ImageVersion: S.optional(S.String),
    Status: S.optional(S.String),
    JobType: S.optional(S.String),
  }),
).annotations({
  identifier: "LatestDeviceJob",
}) as any as S.Schema<LatestDeviceJob>;
export interface PackageObject {
  Name: string;
  PackageVersion: string;
  PatchVersion: string;
}
export const PackageObject = S.suspend(() =>
  S.Struct({
    Name: S.String,
    PackageVersion: S.String,
    PatchVersion: S.String,
  }),
).annotations({
  identifier: "PackageObject",
}) as any as S.Schema<PackageObject>;
export type PackageObjects = PackageObject[];
export const PackageObjects = S.Array(PackageObject);
export interface NodeInstance {
  NodeInstanceId: string;
  NodeId?: string;
  PackageName?: string;
  PackageVersion?: string;
  PackagePatchVersion?: string;
  NodeName?: string;
  CurrentStatus: string;
}
export const NodeInstance = S.suspend(() =>
  S.Struct({
    NodeInstanceId: S.String,
    NodeId: S.optional(S.String),
    PackageName: S.optional(S.String),
    PackageVersion: S.optional(S.String),
    PackagePatchVersion: S.optional(S.String),
    NodeName: S.optional(S.String),
    CurrentStatus: S.String,
  }),
).annotations({ identifier: "NodeInstance" }) as any as S.Schema<NodeInstance>;
export type NodeInstances = NodeInstance[];
export const NodeInstances = S.Array(NodeInstance);
export interface ApplicationInstance {
  Name?: string;
  ApplicationInstanceId?: string;
  DefaultRuntimeContextDevice?: string;
  DefaultRuntimeContextDeviceName?: string;
  Description?: string;
  Status?: string;
  HealthStatus?: string;
  StatusDescription?: string;
  CreatedTime?: Date;
  Arn?: string;
  Tags?: { [key: string]: string };
  RuntimeContextStates?: ReportedRuntimeContextState[];
}
export const ApplicationInstance = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ApplicationInstanceId: S.optional(S.String),
    DefaultRuntimeContextDevice: S.optional(S.String),
    DefaultRuntimeContextDeviceName: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    HealthStatus: S.optional(S.String),
    StatusDescription: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Arn: S.optional(S.String),
    Tags: S.optional(TagMap),
    RuntimeContextStates: S.optional(ReportedRuntimeContextStates),
  }),
).annotations({
  identifier: "ApplicationInstance",
}) as any as S.Schema<ApplicationInstance>;
export type ApplicationInstances = ApplicationInstance[];
export const ApplicationInstances = S.Array(ApplicationInstance);
export interface Device {
  DeviceId?: string;
  Name?: string;
  CreatedTime?: Date;
  ProvisioningStatus?: string;
  LastUpdatedTime?: Date;
  LeaseExpirationTime?: Date;
  Brand?: string;
  CurrentSoftware?: string;
  Description?: string;
  Tags?: { [key: string]: string };
  Type?: string;
  LatestDeviceJob?: LatestDeviceJob;
  DeviceAggregatedStatus?: string;
}
export const Device = S.suspend(() =>
  S.Struct({
    DeviceId: S.optional(S.String),
    Name: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ProvisioningStatus: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LeaseExpirationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Brand: S.optional(S.String),
    CurrentSoftware: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
    Type: S.optional(S.String),
    LatestDeviceJob: S.optional(LatestDeviceJob),
    DeviceAggregatedStatus: S.optional(S.String),
  }),
).annotations({ identifier: "Device" }) as any as S.Schema<Device>;
export type DeviceList = Device[];
export const DeviceList = S.Array(Device);
export interface DeviceJob {
  DeviceName?: string;
  DeviceId?: string;
  JobId?: string;
  CreatedTime?: Date;
  JobType?: string;
}
export const DeviceJob = S.suspend(() =>
  S.Struct({
    DeviceName: S.optional(S.String),
    DeviceId: S.optional(S.String),
    JobId: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobType: S.optional(S.String),
  }),
).annotations({ identifier: "DeviceJob" }) as any as S.Schema<DeviceJob>;
export type DeviceJobList = DeviceJob[];
export const DeviceJobList = S.Array(DeviceJob);
export interface NodeFromTemplateJob {
  JobId?: string;
  TemplateType?: string;
  Status?: string;
  StatusMessage?: string;
  CreatedTime?: Date;
  NodeName?: string;
}
export const NodeFromTemplateJob = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    TemplateType: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NodeName: S.optional(S.String),
  }),
).annotations({
  identifier: "NodeFromTemplateJob",
}) as any as S.Schema<NodeFromTemplateJob>;
export type NodeFromTemplateJobList = NodeFromTemplateJob[];
export const NodeFromTemplateJobList = S.Array(NodeFromTemplateJob);
export interface Node {
  NodeId: string;
  Name: string;
  Category: string;
  OwnerAccount?: string;
  PackageName: string;
  PackageId: string;
  PackageArn?: string;
  PackageVersion: string;
  PatchVersion: string;
  Description?: string;
  CreatedTime: Date;
}
export const Node = S.suspend(() =>
  S.Struct({
    NodeId: S.String,
    Name: S.String,
    Category: S.String,
    OwnerAccount: S.optional(S.String),
    PackageName: S.String,
    PackageId: S.String,
    PackageArn: S.optional(S.String),
    PackageVersion: S.String,
    PatchVersion: S.String,
    Description: S.optional(S.String),
    CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "Node" }) as any as S.Schema<Node>;
export type NodesList = Node[];
export const NodesList = S.Array(Node);
export interface PackageImportJob {
  JobId?: string;
  JobType?: string;
  Status?: string;
  StatusMessage?: string;
  CreatedTime?: Date;
  LastUpdatedTime?: Date;
}
export const PackageImportJob = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    JobType: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PackageImportJob",
}) as any as S.Schema<PackageImportJob>;
export type PackageImportJobList = PackageImportJob[];
export const PackageImportJobList = S.Array(PackageImportJob);
export interface PackageListItem {
  PackageId?: string;
  PackageName?: string;
  Arn?: string;
  CreatedTime?: Date;
  Tags?: { [key: string]: string };
}
export const PackageListItem = S.suspend(() =>
  S.Struct({
    PackageId: S.optional(S.String),
    PackageName: S.optional(S.String),
    Arn: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "PackageListItem",
}) as any as S.Schema<PackageListItem>;
export type PackageList = PackageListItem[];
export const PackageList = S.Array(PackageListItem);
export interface S3Location {
  Region?: string;
  BucketName: string;
  ObjectKey: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({
    Region: S.optional(S.String),
    BucketName: S.String,
    ObjectKey: S.String,
  }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface StaticIpConnectionInfo {
  IpAddress: string;
  Mask: string;
  Dns: string[];
  DefaultGateway: string;
}
export const StaticIpConnectionInfo = S.suspend(() =>
  S.Struct({
    IpAddress: S.String,
    Mask: S.String,
    Dns: DnsList,
    DefaultGateway: S.String,
  }),
).annotations({
  identifier: "StaticIpConnectionInfo",
}) as any as S.Schema<StaticIpConnectionInfo>;
export interface CreateApplicationInstanceResponse {
  ApplicationInstanceId: string;
}
export const CreateApplicationInstanceResponse = S.suspend(() =>
  S.Struct({ ApplicationInstanceId: S.String }),
).annotations({
  identifier: "CreateApplicationInstanceResponse",
}) as any as S.Schema<CreateApplicationInstanceResponse>;
export interface CreateJobForDevicesRequest {
  DeviceIds: string[];
  DeviceJobConfig?: DeviceJobConfig;
  JobType: string;
}
export const CreateJobForDevicesRequest = S.suspend(() =>
  S.Struct({
    DeviceIds: DeviceIdList,
    DeviceJobConfig: S.optional(DeviceJobConfig),
    JobType: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJobForDevicesRequest",
}) as any as S.Schema<CreateJobForDevicesRequest>;
export interface CreateNodeFromTemplateJobResponse {
  JobId: string;
}
export const CreateNodeFromTemplateJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.String }),
).annotations({
  identifier: "CreateNodeFromTemplateJobResponse",
}) as any as S.Schema<CreateNodeFromTemplateJobResponse>;
export interface CreatePackageResponse {
  PackageId?: string;
  Arn?: string;
  StorageLocation: StorageLocation;
}
export const CreatePackageResponse = S.suspend(() =>
  S.Struct({
    PackageId: S.optional(S.String),
    Arn: S.optional(S.String),
    StorageLocation: StorageLocation,
  }),
).annotations({
  identifier: "CreatePackageResponse",
}) as any as S.Schema<CreatePackageResponse>;
export interface DescribeApplicationInstanceResponse {
  Name?: string;
  Description?: string;
  DefaultRuntimeContextDevice?: string;
  DefaultRuntimeContextDeviceName?: string;
  ApplicationInstanceIdToReplace?: string;
  RuntimeRoleArn?: string;
  Status?: string;
  HealthStatus?: string;
  StatusDescription?: string;
  CreatedTime?: Date;
  LastUpdatedTime?: Date;
  ApplicationInstanceId?: string;
  Arn?: string;
  Tags?: { [key: string]: string };
  RuntimeContextStates?: ReportedRuntimeContextState[];
}
export const DescribeApplicationInstanceResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    DefaultRuntimeContextDevice: S.optional(S.String),
    DefaultRuntimeContextDeviceName: S.optional(S.String),
    ApplicationInstanceIdToReplace: S.optional(S.String),
    RuntimeRoleArn: S.optional(S.String),
    Status: S.optional(S.String),
    HealthStatus: S.optional(S.String),
    StatusDescription: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ApplicationInstanceId: S.optional(S.String),
    Arn: S.optional(S.String),
    Tags: S.optional(TagMap),
    RuntimeContextStates: S.optional(ReportedRuntimeContextStates),
  }),
).annotations({
  identifier: "DescribeApplicationInstanceResponse",
}) as any as S.Schema<DescribeApplicationInstanceResponse>;
export interface ListApplicationInstanceDependenciesResponse {
  PackageObjects?: PackageObject[];
  NextToken?: string;
}
export const ListApplicationInstanceDependenciesResponse = S.suspend(() =>
  S.Struct({
    PackageObjects: S.optional(PackageObjects),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationInstanceDependenciesResponse",
}) as any as S.Schema<ListApplicationInstanceDependenciesResponse>;
export interface ListApplicationInstanceNodeInstancesResponse {
  NodeInstances?: NodeInstance[];
  NextToken?: string;
}
export const ListApplicationInstanceNodeInstancesResponse = S.suspend(() =>
  S.Struct({
    NodeInstances: S.optional(NodeInstances),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationInstanceNodeInstancesResponse",
}) as any as S.Schema<ListApplicationInstanceNodeInstancesResponse>;
export interface ListApplicationInstancesResponse {
  ApplicationInstances?: ApplicationInstance[];
  NextToken?: string;
}
export const ListApplicationInstancesResponse = S.suspend(() =>
  S.Struct({
    ApplicationInstances: S.optional(ApplicationInstances),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationInstancesResponse",
}) as any as S.Schema<ListApplicationInstancesResponse>;
export interface ListDevicesResponse {
  Devices: Device[];
  NextToken?: string;
}
export const ListDevicesResponse = S.suspend(() =>
  S.Struct({ Devices: DeviceList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDevicesResponse",
}) as any as S.Schema<ListDevicesResponse>;
export interface ListDevicesJobsResponse {
  DeviceJobs?: DeviceJob[];
  NextToken?: string;
}
export const ListDevicesJobsResponse = S.suspend(() =>
  S.Struct({
    DeviceJobs: S.optional(DeviceJobList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDevicesJobsResponse",
}) as any as S.Schema<ListDevicesJobsResponse>;
export interface ListNodeFromTemplateJobsResponse {
  NodeFromTemplateJobs: NodeFromTemplateJob[];
  NextToken?: string;
}
export const ListNodeFromTemplateJobsResponse = S.suspend(() =>
  S.Struct({
    NodeFromTemplateJobs: NodeFromTemplateJobList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNodeFromTemplateJobsResponse",
}) as any as S.Schema<ListNodeFromTemplateJobsResponse>;
export interface ListNodesResponse {
  Nodes?: Node[];
  NextToken?: string;
}
export const ListNodesResponse = S.suspend(() =>
  S.Struct({ Nodes: S.optional(NodesList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListNodesResponse",
}) as any as S.Schema<ListNodesResponse>;
export interface ListPackageImportJobsResponse {
  PackageImportJobs: PackageImportJob[];
  NextToken?: string;
}
export const ListPackageImportJobsResponse = S.suspend(() =>
  S.Struct({
    PackageImportJobs: PackageImportJobList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPackageImportJobsResponse",
}) as any as S.Schema<ListPackageImportJobsResponse>;
export interface ListPackagesResponse {
  Packages?: PackageListItem[];
  NextToken?: string;
}
export const ListPackagesResponse = S.suspend(() =>
  S.Struct({
    Packages: S.optional(PackageList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPackagesResponse",
}) as any as S.Schema<ListPackagesResponse>;
export interface SignalApplicationInstanceNodeInstancesResponse {
  ApplicationInstanceId: string;
}
export const SignalApplicationInstanceNodeInstancesResponse = S.suspend(() =>
  S.Struct({ ApplicationInstanceId: S.String }),
).annotations({
  identifier: "SignalApplicationInstanceNodeInstancesResponse",
}) as any as S.Schema<SignalApplicationInstanceNodeInstancesResponse>;
export interface PackageVersionInputConfig {
  S3Location: S3Location;
}
export const PackageVersionInputConfig = S.suspend(() =>
  S.Struct({ S3Location: S3Location }),
).annotations({
  identifier: "PackageVersionInputConfig",
}) as any as S.Schema<PackageVersionInputConfig>;
export interface EthernetStatus {
  IpAddress?: string;
  ConnectionStatus?: string;
  HwAddress?: string;
}
export const EthernetStatus = S.suspend(() =>
  S.Struct({
    IpAddress: S.optional(S.String),
    ConnectionStatus: S.optional(S.String),
    HwAddress: S.optional(S.String),
  }),
).annotations({
  identifier: "EthernetStatus",
}) as any as S.Schema<EthernetStatus>;
export interface NtpStatus {
  ConnectionStatus?: string;
  IpAddress?: string;
  NtpServerName?: string;
}
export const NtpStatus = S.suspend(() =>
  S.Struct({
    ConnectionStatus: S.optional(S.String),
    IpAddress: S.optional(S.String),
    NtpServerName: S.optional(S.String),
  }),
).annotations({ identifier: "NtpStatus" }) as any as S.Schema<NtpStatus>;
export interface NodeInputPort {
  Name?: string;
  Description?: string;
  Type?: string;
  DefaultValue?: string;
  MaxConnections?: number;
}
export const NodeInputPort = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    DefaultValue: S.optional(S.String),
    MaxConnections: S.optional(S.Number),
  }),
).annotations({
  identifier: "NodeInputPort",
}) as any as S.Schema<NodeInputPort>;
export type InputPortList = NodeInputPort[];
export const InputPortList = S.Array(NodeInputPort);
export interface NodeOutputPort {
  Name?: string;
  Description?: string;
  Type?: string;
}
export const NodeOutputPort = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "NodeOutputPort",
}) as any as S.Schema<NodeOutputPort>;
export type OutputPortList = NodeOutputPort[];
export const OutputPortList = S.Array(NodeOutputPort);
export interface OutPutS3Location {
  BucketName: string;
  ObjectKey: string;
}
export const OutPutS3Location = S.suspend(() =>
  S.Struct({ BucketName: S.String, ObjectKey: S.String }),
).annotations({
  identifier: "OutPutS3Location",
}) as any as S.Schema<OutPutS3Location>;
export interface EthernetPayload {
  ConnectionType: string;
  StaticIpConnectionInfo?: StaticIpConnectionInfo;
}
export const EthernetPayload = S.suspend(() =>
  S.Struct({
    ConnectionType: S.String,
    StaticIpConnectionInfo: S.optional(StaticIpConnectionInfo),
  }),
).annotations({
  identifier: "EthernetPayload",
}) as any as S.Schema<EthernetPayload>;
export interface PackageImportJobInputConfig {
  PackageVersionInputConfig?: PackageVersionInputConfig;
}
export const PackageImportJobInputConfig = S.suspend(() =>
  S.Struct({
    PackageVersionInputConfig: S.optional(PackageVersionInputConfig),
  }),
).annotations({
  identifier: "PackageImportJobInputConfig",
}) as any as S.Schema<PackageImportJobInputConfig>;
export interface ConflictExceptionErrorArgument {
  Name: string;
  Value: string;
}
export const ConflictExceptionErrorArgument = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "ConflictExceptionErrorArgument",
}) as any as S.Schema<ConflictExceptionErrorArgument>;
export type ConflictExceptionErrorArgumentList =
  ConflictExceptionErrorArgument[];
export const ConflictExceptionErrorArgumentList = S.Array(
  ConflictExceptionErrorArgument,
);
export interface NetworkStatus {
  Ethernet0Status?: EthernetStatus;
  Ethernet1Status?: EthernetStatus;
  NtpStatus?: NtpStatus;
  LastUpdatedTime?: Date;
}
export const NetworkStatus = S.suspend(() =>
  S.Struct({
    Ethernet0Status: S.optional(EthernetStatus),
    Ethernet1Status: S.optional(EthernetStatus),
    NtpStatus: S.optional(NtpStatus),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "NetworkStatus",
}) as any as S.Schema<NetworkStatus>;
export interface NodeInterface {
  Inputs: NodeInputPort[];
  Outputs: NodeOutputPort[];
}
export const NodeInterface = S.suspend(() =>
  S.Struct({ Inputs: InputPortList, Outputs: OutputPortList }),
).annotations({
  identifier: "NodeInterface",
}) as any as S.Schema<NodeInterface>;
export interface PackageImportJobOutput {
  PackageId: string;
  PackageVersion: string;
  PatchVersion: string;
  OutputS3Location: OutPutS3Location;
}
export const PackageImportJobOutput = S.suspend(() =>
  S.Struct({
    PackageId: S.String,
    PackageVersion: S.String,
    PatchVersion: S.String,
    OutputS3Location: OutPutS3Location,
  }),
).annotations({
  identifier: "PackageImportJobOutput",
}) as any as S.Schema<PackageImportJobOutput>;
export interface NetworkPayload {
  Ethernet0?: EthernetPayload;
  Ethernet1?: EthernetPayload;
  Ntp?: NtpPayload;
}
export const NetworkPayload = S.suspend(() =>
  S.Struct({
    Ethernet0: S.optional(EthernetPayload),
    Ethernet1: S.optional(EthernetPayload),
    Ntp: S.optional(NtpPayload),
  }),
).annotations({
  identifier: "NetworkPayload",
}) as any as S.Schema<NetworkPayload>;
export interface CreatePackageImportJobRequest {
  JobType: string;
  InputConfig: PackageImportJobInputConfig;
  OutputConfig: PackageImportJobOutputConfig;
  ClientToken: string;
  JobTags?: JobResourceTags[];
}
export const CreatePackageImportJobRequest = S.suspend(() =>
  S.Struct({
    JobType: S.String,
    InputConfig: PackageImportJobInputConfig,
    OutputConfig: PackageImportJobOutputConfig,
    ClientToken: S.String,
    JobTags: S.optional(JobTagsList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/packages/import-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePackageImportJobRequest",
}) as any as S.Schema<CreatePackageImportJobRequest>;
export interface DescribeDeviceResponse {
  DeviceId?: string;
  Name?: string;
  Arn?: string;
  Description?: string;
  Type?: string;
  DeviceConnectionStatus?: string;
  CreatedTime?: Date;
  ProvisioningStatus?: string;
  LatestSoftware?: string;
  CurrentSoftware?: string;
  SerialNumber?: string;
  Tags?: { [key: string]: string };
  NetworkingConfiguration?: NetworkPayload;
  CurrentNetworkingStatus?: NetworkStatus;
  LeaseExpirationTime?: Date;
  AlternateSoftwares?: AlternateSoftwareMetadata[];
  LatestAlternateSoftware?: string;
  Brand?: string;
  LatestDeviceJob?: LatestDeviceJob;
  DeviceAggregatedStatus?: string;
}
export const DescribeDeviceResponse = S.suspend(() =>
  S.Struct({
    DeviceId: S.optional(S.String),
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    DeviceConnectionStatus: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ProvisioningStatus: S.optional(S.String),
    LatestSoftware: S.optional(S.String),
    CurrentSoftware: S.optional(S.String),
    SerialNumber: S.optional(S.String),
    Tags: S.optional(TagMap),
    NetworkingConfiguration: S.optional(NetworkPayload),
    CurrentNetworkingStatus: S.optional(NetworkStatus),
    LeaseExpirationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AlternateSoftwares: S.optional(AlternateSoftwares),
    LatestAlternateSoftware: S.optional(S.String),
    Brand: S.optional(S.String),
    LatestDeviceJob: S.optional(LatestDeviceJob),
    DeviceAggregatedStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeDeviceResponse",
}) as any as S.Schema<DescribeDeviceResponse>;
export interface DescribeNodeResponse {
  NodeId: string;
  Name: string;
  Category: string;
  OwnerAccount: string;
  PackageName: string;
  PackageId: string;
  PackageArn?: string;
  PackageVersion: string;
  PatchVersion: string;
  NodeInterface: NodeInterface;
  AssetName?: string;
  Description: string;
  CreatedTime: Date;
  LastUpdatedTime: Date;
}
export const DescribeNodeResponse = S.suspend(() =>
  S.Struct({
    NodeId: S.String,
    Name: S.String,
    Category: S.String,
    OwnerAccount: S.String,
    PackageName: S.String,
    PackageId: S.String,
    PackageArn: S.optional(S.String),
    PackageVersion: S.String,
    PatchVersion: S.String,
    NodeInterface: NodeInterface,
    AssetName: S.optional(S.String),
    Description: S.String,
    CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DescribeNodeResponse",
}) as any as S.Schema<DescribeNodeResponse>;
export interface DescribePackageImportJobResponse {
  JobId: string;
  ClientToken?: string;
  JobType: string;
  InputConfig: PackageImportJobInputConfig;
  OutputConfig: PackageImportJobOutputConfig;
  Output: PackageImportJobOutput;
  CreatedTime: Date;
  LastUpdatedTime: Date;
  Status: string;
  StatusMessage: string;
  JobTags?: JobResourceTags[];
}
export const DescribePackageImportJobResponse = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    ClientToken: S.optional(S.String),
    JobType: S.String,
    InputConfig: PackageImportJobInputConfig,
    OutputConfig: PackageImportJobOutputConfig,
    Output: PackageImportJobOutput,
    CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: S.String,
    StatusMessage: S.String,
    JobTags: S.optional(JobTagsList),
  }),
).annotations({
  identifier: "DescribePackageImportJobResponse",
}) as any as S.Schema<DescribePackageImportJobResponse>;
export interface ProvisionDeviceRequest {
  Name: string;
  Description?: string;
  Tags?: { [key: string]: string };
  NetworkingConfiguration?: NetworkPayload;
}
export const ProvisionDeviceRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
    NetworkingConfiguration: S.optional(NetworkPayload),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/devices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ProvisionDeviceRequest",
}) as any as S.Schema<ProvisionDeviceRequest>;
export interface Job {
  JobId?: string;
  DeviceId?: string;
}
export const Job = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String), DeviceId: S.optional(S.String) }),
).annotations({ identifier: "Job" }) as any as S.Schema<Job>;
export type JobList = Job[];
export const JobList = S.Array(Job);
export interface ValidationExceptionErrorArgument {
  Name: string;
  Value: string;
}
export const ValidationExceptionErrorArgument = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "ValidationExceptionErrorArgument",
}) as any as S.Schema<ValidationExceptionErrorArgument>;
export type ValidationExceptionErrorArgumentList =
  ValidationExceptionErrorArgument[];
export const ValidationExceptionErrorArgumentList = S.Array(
  ValidationExceptionErrorArgument,
);
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface CreateJobForDevicesResponse {
  Jobs: Job[];
}
export const CreateJobForDevicesResponse = S.suspend(() =>
  S.Struct({ Jobs: JobList }),
).annotations({
  identifier: "CreateJobForDevicesResponse",
}) as any as S.Schema<CreateJobForDevicesResponse>;
export interface CreatePackageImportJobResponse {
  JobId: string;
}
export const CreatePackageImportJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.String }),
).annotations({
  identifier: "CreatePackageImportJobResponse",
}) as any as S.Schema<CreatePackageImportJobResponse>;
export interface ProvisionDeviceResponse {
  DeviceId?: string;
  Arn: string;
  Status: string;
  Certificates?: Uint8Array;
  IotThingName?: string;
}
export const ProvisionDeviceResponse = S.suspend(() =>
  S.Struct({
    DeviceId: S.optional(S.String),
    Arn: S.String,
    Status: S.String,
    Certificates: S.optional(T.Blob),
    IotThingName: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisionDeviceResponse",
}) as any as S.Schema<ProvisionDeviceResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    QuotaCode: S.String,
    ServiceCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    ErrorId: S.optional(S.String),
    ErrorArguments: S.optional(ConflictExceptionErrorArgumentList),
  },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    ErrorId: S.optional(S.String),
    ErrorArguments: S.optional(ValidationExceptionErrorArgumentList),
    Fields: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of application instance dependencies.
 */
export const listApplicationInstanceDependencies: {
  (
    input: ListApplicationInstanceDependenciesRequest,
  ): effect.Effect<
    ListApplicationInstanceDependenciesResponse,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationInstanceDependenciesRequest,
  ) => stream.Stream<
    ListApplicationInstanceDependenciesResponse,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationInstanceDependenciesRequest,
  ) => stream.Stream<
    unknown,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationInstanceDependenciesRequest,
  output: ListApplicationInstanceDependenciesResponse,
  errors: [AccessDeniedException, InternalServerException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of application node instances.
 */
export const listApplicationInstanceNodeInstances: {
  (
    input: ListApplicationInstanceNodeInstancesRequest,
  ): effect.Effect<
    ListApplicationInstanceNodeInstancesResponse,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationInstanceNodeInstancesRequest,
  ) => stream.Stream<
    ListApplicationInstanceNodeInstancesResponse,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationInstanceNodeInstancesRequest,
  ) => stream.Stream<
    unknown,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationInstanceNodeInstancesRequest,
  output: ListApplicationInstanceNodeInstancesResponse,
  errors: [AccessDeniedException, InternalServerException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of application instances.
 */
export const listApplicationInstances: {
  (
    input: ListApplicationInstancesRequest,
  ): effect.Effect<
    ListApplicationInstancesResponse,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationInstancesRequest,
  ) => stream.Stream<
    ListApplicationInstancesResponse,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationInstancesRequest,
  ) => stream.Stream<
    unknown,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationInstancesRequest,
  output: ListApplicationInstancesResponse,
  errors: [AccessDeniedException, InternalServerException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Tags a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an application instance and deploys it to a device.
 */
export const createApplicationInstance: (
  input: CreateApplicationInstanceRequest,
) => effect.Effect<
  CreateApplicationInstanceResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationInstanceRequest,
  output: CreateApplicationInstanceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Deletes a package.
 *
 * To delete a package, you need permission to call `s3:DeleteObject` in addition to permissions for
 * the AWS Panorama API.
 */
export const deletePackage: (
  input: DeletePackageRequest,
) => effect.Effect<
  DeletePackageResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackageRequest,
  output: DeletePackageResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a device.
 */
export const describeDevice: (
  input: DescribeDeviceRequest,
) => effect.Effect<
  DescribeDeviceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDeviceRequest,
  output: DescribeDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a node.
 */
export const describeNode: (
  input: DescribeNodeRequest,
) => effect.Effect<
  DescribeNodeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNodeRequest,
  output: DescribeNodeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a package import job.
 */
export const describePackageImportJob: (
  input: DescribePackageImportJobRequest,
) => effect.Effect<
  DescribePackageImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePackageImportJobRequest,
  output: DescribePackageImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
}));
/**
 * Signal camera nodes to stop or resume.
 */
export const signalApplicationInstanceNodeInstances: (
  input: SignalApplicationInstanceNodeInstancesRequest,
) => effect.Effect<
  SignalApplicationInstanceNodeInstancesResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SignalApplicationInstanceNodeInstancesRequest,
  output: SignalApplicationInstanceNodeInstancesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns information about an application instance's configuration manifest.
 */
export const describeApplicationInstanceDetails: (
  input: DescribeApplicationInstanceDetailsRequest,
) => effect.Effect<
  DescribeApplicationInstanceDetailsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationInstanceDetailsRequest,
  output: DescribeApplicationInstanceDetailsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a device job.
 */
export const describeDeviceJob: (
  input: DescribeDeviceJobRequest,
) => effect.Effect<
  DescribeDeviceJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDeviceJobRequest,
  output: DescribeDeviceJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a job to create a camera stream node.
 */
export const describeNodeFromTemplateJob: (
  input: DescribeNodeFromTemplateJobRequest,
) => effect.Effect<
  DescribeNodeFromTemplateJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNodeFromTemplateJobRequest,
  output: DescribeNodeFromTemplateJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
}));
/**
 * Returns information about a package.
 */
export const describePackage: (
  input: DescribePackageRequest,
) => effect.Effect<
  DescribePackageResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePackageRequest,
  output: DescribePackageResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a package version.
 */
export const describePackageVersion: (
  input: DescribePackageVersionRequest,
) => effect.Effect<
  DescribePackageVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePackageVersionRequest,
  output: DescribePackageVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a device's metadata.
 */
export const updateDeviceMetadata: (
  input: UpdateDeviceMetadataRequest,
) => effect.Effect<
  UpdateDeviceMetadataResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeviceMetadataRequest,
  output: UpdateDeviceMetadataResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deregisters a package version.
 */
export const deregisterPackageVersion: (
  input: DeregisterPackageVersionRequest,
) => effect.Effect<
  DeregisterPackageVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterPackageVersionRequest,
  output: DeregisterPackageVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Registers a package version.
 */
export const registerPackageVersion: (
  input: RegisterPackageVersionRequest,
) => effect.Effect<
  RegisterPackageVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterPackageVersionRequest,
  output: RegisterPackageVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
}));
/**
 * Removes an application instance.
 */
export const removeApplicationInstance: (
  input: RemoveApplicationInstanceRequest,
) => effect.Effect<
  RemoveApplicationInstanceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveApplicationInstanceRequest,
  output: RemoveApplicationInstanceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a device.
 */
export const deleteDevice: (
  input: DeleteDeviceRequest,
) => effect.Effect<
  DeleteDeviceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeviceRequest,
  output: DeleteDeviceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a camera stream node.
 */
export const createNodeFromTemplateJob: (
  input: CreateNodeFromTemplateJobRequest,
) => effect.Effect<
  CreateNodeFromTemplateJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNodeFromTemplateJobRequest,
  output: CreateNodeFromTemplateJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
}));
/**
 * Creates a package and storage location in an Amazon S3 access point.
 */
export const createPackage: (
  input: CreatePackageRequest,
) => effect.Effect<
  CreatePackageResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackageRequest,
  output: CreatePackageResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
}));
/**
 * Returns information about an application instance on a device.
 */
export const describeApplicationInstance: (
  input: DescribeApplicationInstanceRequest,
) => effect.Effect<
  DescribeApplicationInstanceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationInstanceRequest,
  output: DescribeApplicationInstanceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of devices.
 */
export const listDevices: {
  (
    input: ListDevicesRequest,
  ): effect.Effect<
    ListDevicesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevicesRequest,
  ) => stream.Stream<
    ListDevicesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDevicesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDevicesRequest,
  output: ListDevicesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of jobs.
 */
export const listDevicesJobs: {
  (
    input: ListDevicesJobsRequest,
  ): effect.Effect<
    ListDevicesJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevicesJobsRequest,
  ) => stream.Stream<
    ListDevicesJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDevicesJobsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDevicesJobsRequest,
  output: ListDevicesJobsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of camera stream node jobs.
 */
export const listNodeFromTemplateJobs: {
  (
    input: ListNodeFromTemplateJobsRequest,
  ): effect.Effect<
    ListNodeFromTemplateJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListNodeFromTemplateJobsRequest,
  ) => stream.Stream<
    ListNodeFromTemplateJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListNodeFromTemplateJobsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNodeFromTemplateJobsRequest,
  output: ListNodeFromTemplateJobsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of nodes.
 */
export const listNodes: {
  (
    input: ListNodesRequest,
  ): effect.Effect<
    ListNodesResponse,
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListNodesRequest,
  ) => stream.Stream<
    ListNodesResponse,
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListNodesRequest,
  ) => stream.Stream<
    unknown,
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNodesRequest,
  output: ListNodesResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of package import jobs.
 */
export const listPackageImportJobs: {
  (
    input: ListPackageImportJobsRequest,
  ): effect.Effect<
    ListPackageImportJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPackageImportJobsRequest,
  ) => stream.Stream<
    ListPackageImportJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPackageImportJobsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPackageImportJobsRequest,
  output: ListPackageImportJobsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of packages.
 */
export const listPackages: {
  (
    input: ListPackagesRequest,
  ): effect.Effect<
    ListPackagesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPackagesRequest,
  ) => stream.Stream<
    ListPackagesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPackagesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPackagesRequest,
  output: ListPackagesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a job to run on a device. A job can update a device's software or reboot it.
 */
export const createJobForDevices: (
  input: CreateJobForDevicesRequest,
) => effect.Effect<
  CreateJobForDevicesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobForDevicesRequest,
  output: CreateJobForDevicesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Imports a node package.
 */
export const createPackageImportJob: (
  input: CreatePackageImportJobRequest,
) => effect.Effect<
  CreatePackageImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackageImportJobRequest,
  output: CreatePackageImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
}));
/**
 * Creates a device and returns a configuration archive. The configuration archive is a ZIP file that contains a
 * provisioning certificate that is valid for 5 minutes. Name the configuration archive
 * `certificates-omni_*device-name*.zip` and transfer it to the device within 5
 * minutes. Use the included USB storage device and connect it to the USB 3.0 port next to the HDMI output.
 */
export const provisionDevice: (
  input: ProvisionDeviceRequest,
) => effect.Effect<
  ProvisionDeviceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ProvisionDeviceRequest,
  output: ProvisionDeviceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
