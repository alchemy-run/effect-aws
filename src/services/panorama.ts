import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Panorama",
  serviceShapeName: "OmniCloudServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "panorama" });
const ver = T.ServiceVersion("2019-07-24");
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
                        url: "https://panorama-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://panorama-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://panorama.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://panorama.{Region}.{PartitionResult#dnsSuffix}",
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
export const DeviceIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreatePackageRequest extends S.Class<CreatePackageRequest>(
  "CreatePackageRequest",
)(
  { PackageName: S.String, Tags: S.optional(TagMap) },
  T.all(
    T.Http({ method: "POST", uri: "/packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeviceRequest extends S.Class<DeleteDeviceRequest>(
  "DeleteDeviceRequest",
)(
  { DeviceId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/devices/{DeviceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackageRequest extends S.Class<DeletePackageRequest>(
  "DeletePackageRequest",
)(
  {
    PackageId: S.String.pipe(T.HttpLabel()),
    ForceDelete: S.optional(S.Boolean).pipe(T.HttpQuery("ForceDelete")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/packages/{PackageId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackageResponse extends S.Class<DeletePackageResponse>(
  "DeletePackageResponse",
)({}) {}
export class DeregisterPackageVersionRequest extends S.Class<DeregisterPackageVersionRequest>(
  "DeregisterPackageVersionRequest",
)(
  {
    OwnerAccount: S.optional(S.String).pipe(T.HttpQuery("OwnerAccount")),
    PackageId: S.String.pipe(T.HttpLabel()),
    PackageVersion: S.String.pipe(T.HttpLabel()),
    PatchVersion: S.String.pipe(T.HttpLabel()),
    UpdatedLatestPatchVersion: S.optional(S.String).pipe(
      T.HttpQuery("UpdatedLatestPatchVersion"),
    ),
  },
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
) {}
export class DeregisterPackageVersionResponse extends S.Class<DeregisterPackageVersionResponse>(
  "DeregisterPackageVersionResponse",
)({}) {}
export class DescribeApplicationInstanceRequest extends S.Class<DescribeApplicationInstanceRequest>(
  "DescribeApplicationInstanceRequest",
)(
  { ApplicationInstanceId: S.String.pipe(T.HttpLabel()) },
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
) {}
export class DescribeApplicationInstanceDetailsRequest extends S.Class<DescribeApplicationInstanceDetailsRequest>(
  "DescribeApplicationInstanceDetailsRequest",
)(
  { ApplicationInstanceId: S.String.pipe(T.HttpLabel()) },
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
) {}
export class DescribeDeviceRequest extends S.Class<DescribeDeviceRequest>(
  "DescribeDeviceRequest",
)(
  { DeviceId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/devices/{DeviceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDeviceJobRequest extends S.Class<DescribeDeviceJobRequest>(
  "DescribeDeviceJobRequest",
)(
  { JobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/jobs/{JobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeNodeRequest extends S.Class<DescribeNodeRequest>(
  "DescribeNodeRequest",
)(
  {
    NodeId: S.String.pipe(T.HttpLabel()),
    OwnerAccount: S.optional(S.String).pipe(T.HttpQuery("OwnerAccount")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/nodes/{NodeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeNodeFromTemplateJobRequest extends S.Class<DescribeNodeFromTemplateJobRequest>(
  "DescribeNodeFromTemplateJobRequest",
)(
  { JobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/packages/template-job/{JobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePackageRequest extends S.Class<DescribePackageRequest>(
  "DescribePackageRequest",
)(
  { PackageId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/packages/metadata/{PackageId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePackageImportJobRequest extends S.Class<DescribePackageImportJobRequest>(
  "DescribePackageImportJobRequest",
)(
  { JobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/packages/import-jobs/{JobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePackageVersionRequest extends S.Class<DescribePackageVersionRequest>(
  "DescribePackageVersionRequest",
)(
  {
    OwnerAccount: S.optional(S.String).pipe(T.HttpQuery("OwnerAccount")),
    PackageId: S.String.pipe(T.HttpLabel()),
    PackageVersion: S.String.pipe(T.HttpLabel()),
    PatchVersion: S.optional(S.String).pipe(T.HttpQuery("PatchVersion")),
  },
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
) {}
export class ListApplicationInstanceDependenciesRequest extends S.Class<ListApplicationInstanceDependenciesRequest>(
  "ListApplicationInstanceDependenciesRequest",
)(
  {
    ApplicationInstanceId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
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
) {}
export class ListApplicationInstanceNodeInstancesRequest extends S.Class<ListApplicationInstanceNodeInstancesRequest>(
  "ListApplicationInstanceNodeInstancesRequest",
)(
  {
    ApplicationInstanceId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
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
) {}
export class ListApplicationInstancesRequest extends S.Class<ListApplicationInstancesRequest>(
  "ListApplicationInstancesRequest",
)(
  {
    DeviceId: S.optional(S.String).pipe(T.HttpQuery("deviceId")),
    StatusFilter: S.optional(S.String).pipe(T.HttpQuery("statusFilter")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/application-instances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDevicesRequest extends S.Class<ListDevicesRequest>(
  "ListDevicesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    SortBy: S.optional(S.String).pipe(T.HttpQuery("SortBy")),
    SortOrder: S.optional(S.String).pipe(T.HttpQuery("SortOrder")),
    NameFilter: S.optional(S.String).pipe(T.HttpQuery("NameFilter")),
    DeviceAggregatedStatusFilter: S.optional(S.String).pipe(
      T.HttpQuery("DeviceAggregatedStatusFilter"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDevicesJobsRequest extends S.Class<ListDevicesJobsRequest>(
  "ListDevicesJobsRequest",
)(
  {
    DeviceId: S.optional(S.String).pipe(T.HttpQuery("DeviceId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(T.Http({ method: "GET", uri: "/jobs" }), svc, auth, proto, ver, rules),
) {}
export class ListNodeFromTemplateJobsRequest extends S.Class<ListNodeFromTemplateJobsRequest>(
  "ListNodeFromTemplateJobsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/packages/template-job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNodesRequest extends S.Class<ListNodesRequest>(
  "ListNodesRequest",
)(
  {
    Category: S.optional(S.String).pipe(T.HttpQuery("category")),
    OwnerAccount: S.optional(S.String).pipe(T.HttpQuery("ownerAccount")),
    PackageName: S.optional(S.String).pipe(T.HttpQuery("packageName")),
    PackageVersion: S.optional(S.String).pipe(T.HttpQuery("packageVersion")),
    PatchVersion: S.optional(S.String).pipe(T.HttpQuery("patchVersion")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "GET", uri: "/nodes" }), svc, auth, proto, ver, rules),
) {}
export class ListPackageImportJobsRequest extends S.Class<ListPackageImportJobsRequest>(
  "ListPackageImportJobsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/packages/import-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackagesRequest extends S.Class<ListPackagesRequest>(
  "ListPackagesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/packages" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterPackageVersionRequest extends S.Class<RegisterPackageVersionRequest>(
  "RegisterPackageVersionRequest",
)(
  {
    OwnerAccount: S.optional(S.String),
    PackageId: S.String.pipe(T.HttpLabel()),
    PackageVersion: S.String.pipe(T.HttpLabel()),
    PatchVersion: S.String.pipe(T.HttpLabel()),
    MarkLatest: S.optional(S.Boolean),
  },
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
) {}
export class RegisterPackageVersionResponse extends S.Class<RegisterPackageVersionResponse>(
  "RegisterPackageVersionResponse",
)({}) {}
export class RemoveApplicationInstanceRequest extends S.Class<RemoveApplicationInstanceRequest>(
  "RemoveApplicationInstanceRequest",
)(
  { ApplicationInstanceId: S.String.pipe(T.HttpLabel()) },
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
) {}
export class RemoveApplicationInstanceResponse extends S.Class<RemoveApplicationInstanceResponse>(
  "RemoveApplicationInstanceResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: TagMap },
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export class UpdateDeviceMetadataRequest extends S.Class<UpdateDeviceMetadataRequest>(
  "UpdateDeviceMetadataRequest",
)(
  { DeviceId: S.String.pipe(T.HttpLabel()), Description: S.optional(S.String) },
  T.all(
    T.Http({ method: "PUT", uri: "/devices/{DeviceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ManifestPayload = S.Union(S.Struct({ PayloadData: S.String }));
export const ManifestOverridesPayload = S.Union(
  S.Struct({ PayloadData: S.String }),
);
export const TemplateParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export class JobResourceTags extends S.Class<JobResourceTags>(
  "JobResourceTags",
)({ ResourceType: S.String, Tags: TagMap }) {}
export const JobTagsList = S.Array(JobResourceTags);
export const PrincipalArnsList = S.Array(S.String);
export class NodeSignal extends S.Class<NodeSignal>("NodeSignal")({
  NodeInstanceId: S.String,
  Signal: S.String,
}) {}
export const NodeSignalList = S.Array(NodeSignal);
export const NtpServerList = S.Array(S.String);
export class CreateApplicationInstanceRequest extends S.Class<CreateApplicationInstanceRequest>(
  "CreateApplicationInstanceRequest",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ManifestPayload: ManifestPayload,
    ManifestOverridesPayload: S.optional(ManifestOverridesPayload),
    ApplicationInstanceIdToReplace: S.optional(S.String),
    RuntimeRoleArn: S.optional(S.String),
    DefaultRuntimeContextDevice: S.String,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/application-instances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNodeFromTemplateJobRequest extends S.Class<CreateNodeFromTemplateJobRequest>(
  "CreateNodeFromTemplateJobRequest",
)(
  {
    TemplateType: S.String,
    OutputPackageName: S.String,
    OutputPackageVersion: S.String,
    NodeName: S.String,
    NodeDescription: S.optional(S.String),
    TemplateParameters: TemplateParametersMap,
    JobTags: S.optional(JobTagsList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/packages/template-job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDeviceResponse extends S.Class<DeleteDeviceResponse>(
  "DeleteDeviceResponse",
)({ DeviceId: S.optional(S.String) }) {}
export class DescribeApplicationInstanceDetailsResponse extends S.Class<DescribeApplicationInstanceDetailsResponse>(
  "DescribeApplicationInstanceDetailsResponse",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  DefaultRuntimeContextDevice: S.optional(S.String),
  ManifestPayload: S.optional(ManifestPayload),
  ManifestOverridesPayload: S.optional(ManifestOverridesPayload),
  ApplicationInstanceIdToReplace: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ApplicationInstanceId: S.optional(S.String),
}) {}
export class DescribeDeviceJobResponse extends S.Class<DescribeDeviceJobResponse>(
  "DescribeDeviceJobResponse",
)({
  JobId: S.optional(S.String),
  DeviceId: S.optional(S.String),
  DeviceArn: S.optional(S.String),
  DeviceName: S.optional(S.String),
  DeviceType: S.optional(S.String),
  ImageVersion: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobType: S.optional(S.String),
}) {}
export class DescribeNodeFromTemplateJobResponse extends S.Class<DescribeNodeFromTemplateJobResponse>(
  "DescribeNodeFromTemplateJobResponse",
)({
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
}) {}
export class StorageLocation extends S.Class<StorageLocation>(
  "StorageLocation",
)({
  Bucket: S.String,
  RepoPrefixLocation: S.String,
  GeneratedPrefixLocation: S.String,
  BinaryPrefixLocation: S.String,
  ManifestPrefixLocation: S.String,
}) {}
export class DescribePackageResponse extends S.Class<DescribePackageResponse>(
  "DescribePackageResponse",
)({
  PackageId: S.String,
  PackageName: S.String,
  Arn: S.String,
  StorageLocation: StorageLocation,
  ReadAccessPrincipalArns: S.optional(PrincipalArnsList),
  WriteAccessPrincipalArns: S.optional(PrincipalArnsList),
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Tags: TagMap,
}) {}
export class DescribePackageVersionResponse extends S.Class<DescribePackageVersionResponse>(
  "DescribePackageVersionResponse",
)({
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
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class SignalApplicationInstanceNodeInstancesRequest extends S.Class<SignalApplicationInstanceNodeInstancesRequest>(
  "SignalApplicationInstanceNodeInstancesRequest",
)(
  {
    ApplicationInstanceId: S.String.pipe(T.HttpLabel()),
    NodeSignals: NodeSignalList,
  },
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
) {}
export class UpdateDeviceMetadataResponse extends S.Class<UpdateDeviceMetadataResponse>(
  "UpdateDeviceMetadataResponse",
)({ DeviceId: S.optional(S.String) }) {}
export class OTAJobConfig extends S.Class<OTAJobConfig>("OTAJobConfig")({
  ImageVersion: S.String,
  AllowMajorVersionUpdate: S.optional(S.Boolean),
}) {}
export class PackageVersionOutputConfig extends S.Class<PackageVersionOutputConfig>(
  "PackageVersionOutputConfig",
)({
  PackageName: S.String,
  PackageVersion: S.String,
  MarkLatest: S.optional(S.Boolean),
}) {}
export class NtpPayload extends S.Class<NtpPayload>("NtpPayload")({
  NtpServers: NtpServerList,
}) {}
export const DnsList = S.Array(S.String);
export class DeviceJobConfig extends S.Class<DeviceJobConfig>(
  "DeviceJobConfig",
)({ OTAJobConfig: S.optional(OTAJobConfig) }) {}
export class PackageImportJobOutputConfig extends S.Class<PackageImportJobOutputConfig>(
  "PackageImportJobOutputConfig",
)({ PackageVersionOutputConfig: S.optional(PackageVersionOutputConfig) }) {}
export class ConflictExceptionErrorArgument extends S.Class<ConflictExceptionErrorArgument>(
  "ConflictExceptionErrorArgument",
)({ Name: S.String, Value: S.String }) {}
export const ConflictExceptionErrorArgumentList = S.Array(
  ConflictExceptionErrorArgument,
);
export class ReportedRuntimeContextState extends S.Class<ReportedRuntimeContextState>(
  "ReportedRuntimeContextState",
)({
  DesiredState: S.String,
  RuntimeContextName: S.String,
  DeviceReportedStatus: S.String,
  DeviceReportedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ReportedRuntimeContextStates = S.Array(
  ReportedRuntimeContextState,
);
export class AlternateSoftwareMetadata extends S.Class<AlternateSoftwareMetadata>(
  "AlternateSoftwareMetadata",
)({ Version: S.optional(S.String) }) {}
export const AlternateSoftwares = S.Array(AlternateSoftwareMetadata);
export class LatestDeviceJob extends S.Class<LatestDeviceJob>(
  "LatestDeviceJob",
)({
  ImageVersion: S.optional(S.String),
  Status: S.optional(S.String),
  JobType: S.optional(S.String),
}) {}
export class PackageObject extends S.Class<PackageObject>("PackageObject")({
  Name: S.String,
  PackageVersion: S.String,
  PatchVersion: S.String,
}) {}
export const PackageObjects = S.Array(PackageObject);
export class NodeInstance extends S.Class<NodeInstance>("NodeInstance")({
  NodeInstanceId: S.String,
  NodeId: S.optional(S.String),
  PackageName: S.optional(S.String),
  PackageVersion: S.optional(S.String),
  PackagePatchVersion: S.optional(S.String),
  NodeName: S.optional(S.String),
  CurrentStatus: S.String,
}) {}
export const NodeInstances = S.Array(NodeInstance);
export class ApplicationInstance extends S.Class<ApplicationInstance>(
  "ApplicationInstance",
)({
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
}) {}
export const ApplicationInstances = S.Array(ApplicationInstance);
export class Device extends S.Class<Device>("Device")({
  DeviceId: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ProvisioningStatus: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
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
}) {}
export const DeviceList = S.Array(Device);
export class DeviceJob extends S.Class<DeviceJob>("DeviceJob")({
  DeviceName: S.optional(S.String),
  DeviceId: S.optional(S.String),
  JobId: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobType: S.optional(S.String),
}) {}
export const DeviceJobList = S.Array(DeviceJob);
export class NodeFromTemplateJob extends S.Class<NodeFromTemplateJob>(
  "NodeFromTemplateJob",
)({
  JobId: S.optional(S.String),
  TemplateType: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NodeName: S.optional(S.String),
}) {}
export const NodeFromTemplateJobList = S.Array(NodeFromTemplateJob);
export class Node extends S.Class<Node>("Node")({
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
}) {}
export const NodesList = S.Array(Node);
export class PackageImportJob extends S.Class<PackageImportJob>(
  "PackageImportJob",
)({
  JobId: S.optional(S.String),
  JobType: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PackageImportJobList = S.Array(PackageImportJob);
export class PackageListItem extends S.Class<PackageListItem>(
  "PackageListItem",
)({
  PackageId: S.optional(S.String),
  PackageName: S.optional(S.String),
  Arn: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(TagMap),
}) {}
export const PackageList = S.Array(PackageListItem);
export class ValidationExceptionErrorArgument extends S.Class<ValidationExceptionErrorArgument>(
  "ValidationExceptionErrorArgument",
)({ Name: S.String, Value: S.String }) {}
export const ValidationExceptionErrorArgumentList = S.Array(
  ValidationExceptionErrorArgument,
);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, Message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class S3Location extends S.Class<S3Location>("S3Location")({
  Region: S.optional(S.String),
  BucketName: S.String,
  ObjectKey: S.String,
}) {}
export class StaticIpConnectionInfo extends S.Class<StaticIpConnectionInfo>(
  "StaticIpConnectionInfo",
)({
  IpAddress: S.String,
  Mask: S.String,
  Dns: DnsList,
  DefaultGateway: S.String,
}) {}
export class CreateApplicationInstanceResponse extends S.Class<CreateApplicationInstanceResponse>(
  "CreateApplicationInstanceResponse",
)({ ApplicationInstanceId: S.String }) {}
export class CreateJobForDevicesRequest extends S.Class<CreateJobForDevicesRequest>(
  "CreateJobForDevicesRequest",
)(
  {
    DeviceIds: DeviceIdList,
    DeviceJobConfig: S.optional(DeviceJobConfig),
    JobType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/jobs" }), svc, auth, proto, ver, rules),
) {}
export class CreateNodeFromTemplateJobResponse extends S.Class<CreateNodeFromTemplateJobResponse>(
  "CreateNodeFromTemplateJobResponse",
)({ JobId: S.String }) {}
export class CreatePackageResponse extends S.Class<CreatePackageResponse>(
  "CreatePackageResponse",
)({
  PackageId: S.optional(S.String),
  Arn: S.optional(S.String),
  StorageLocation: StorageLocation,
}) {}
export class DescribeApplicationInstanceResponse extends S.Class<DescribeApplicationInstanceResponse>(
  "DescribeApplicationInstanceResponse",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ApplicationInstanceId: S.optional(S.String),
  Arn: S.optional(S.String),
  Tags: S.optional(TagMap),
  RuntimeContextStates: S.optional(ReportedRuntimeContextStates),
}) {}
export class ListApplicationInstanceDependenciesResponse extends S.Class<ListApplicationInstanceDependenciesResponse>(
  "ListApplicationInstanceDependenciesResponse",
)({
  PackageObjects: S.optional(PackageObjects),
  NextToken: S.optional(S.String),
}) {}
export class ListApplicationInstanceNodeInstancesResponse extends S.Class<ListApplicationInstanceNodeInstancesResponse>(
  "ListApplicationInstanceNodeInstancesResponse",
)({
  NodeInstances: S.optional(NodeInstances),
  NextToken: S.optional(S.String),
}) {}
export class ListApplicationInstancesResponse extends S.Class<ListApplicationInstancesResponse>(
  "ListApplicationInstancesResponse",
)({
  ApplicationInstances: S.optional(ApplicationInstances),
  NextToken: S.optional(S.String),
}) {}
export class ListDevicesResponse extends S.Class<ListDevicesResponse>(
  "ListDevicesResponse",
)({ Devices: DeviceList, NextToken: S.optional(S.String) }) {}
export class ListDevicesJobsResponse extends S.Class<ListDevicesJobsResponse>(
  "ListDevicesJobsResponse",
)({ DeviceJobs: S.optional(DeviceJobList), NextToken: S.optional(S.String) }) {}
export class ListNodeFromTemplateJobsResponse extends S.Class<ListNodeFromTemplateJobsResponse>(
  "ListNodeFromTemplateJobsResponse",
)({
  NodeFromTemplateJobs: NodeFromTemplateJobList,
  NextToken: S.optional(S.String),
}) {}
export class ListNodesResponse extends S.Class<ListNodesResponse>(
  "ListNodesResponse",
)({ Nodes: S.optional(NodesList), NextToken: S.optional(S.String) }) {}
export class ListPackageImportJobsResponse extends S.Class<ListPackageImportJobsResponse>(
  "ListPackageImportJobsResponse",
)({
  PackageImportJobs: PackageImportJobList,
  NextToken: S.optional(S.String),
}) {}
export class ListPackagesResponse extends S.Class<ListPackagesResponse>(
  "ListPackagesResponse",
)({ Packages: S.optional(PackageList), NextToken: S.optional(S.String) }) {}
export class SignalApplicationInstanceNodeInstancesResponse extends S.Class<SignalApplicationInstanceNodeInstancesResponse>(
  "SignalApplicationInstanceNodeInstancesResponse",
)({ ApplicationInstanceId: S.String }) {}
export class PackageVersionInputConfig extends S.Class<PackageVersionInputConfig>(
  "PackageVersionInputConfig",
)({ S3Location: S3Location }) {}
export class EthernetStatus extends S.Class<EthernetStatus>("EthernetStatus")({
  IpAddress: S.optional(S.String),
  ConnectionStatus: S.optional(S.String),
  HwAddress: S.optional(S.String),
}) {}
export class NtpStatus extends S.Class<NtpStatus>("NtpStatus")({
  ConnectionStatus: S.optional(S.String),
  IpAddress: S.optional(S.String),
  NtpServerName: S.optional(S.String),
}) {}
export class NodeInputPort extends S.Class<NodeInputPort>("NodeInputPort")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  DefaultValue: S.optional(S.String),
  MaxConnections: S.optional(S.Number),
}) {}
export const InputPortList = S.Array(NodeInputPort);
export class NodeOutputPort extends S.Class<NodeOutputPort>("NodeOutputPort")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const OutputPortList = S.Array(NodeOutputPort);
export class OutPutS3Location extends S.Class<OutPutS3Location>(
  "OutPutS3Location",
)({ BucketName: S.String, ObjectKey: S.String }) {}
export class EthernetPayload extends S.Class<EthernetPayload>(
  "EthernetPayload",
)({
  ConnectionType: S.String,
  StaticIpConnectionInfo: S.optional(StaticIpConnectionInfo),
}) {}
export class PackageImportJobInputConfig extends S.Class<PackageImportJobInputConfig>(
  "PackageImportJobInputConfig",
)({ PackageVersionInputConfig: S.optional(PackageVersionInputConfig) }) {}
export class NetworkStatus extends S.Class<NetworkStatus>("NetworkStatus")({
  Ethernet0Status: S.optional(EthernetStatus),
  Ethernet1Status: S.optional(EthernetStatus),
  NtpStatus: S.optional(NtpStatus),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class NodeInterface extends S.Class<NodeInterface>("NodeInterface")({
  Inputs: InputPortList,
  Outputs: OutputPortList,
}) {}
export class PackageImportJobOutput extends S.Class<PackageImportJobOutput>(
  "PackageImportJobOutput",
)({
  PackageId: S.String,
  PackageVersion: S.String,
  PatchVersion: S.String,
  OutputS3Location: OutPutS3Location,
}) {}
export class NetworkPayload extends S.Class<NetworkPayload>("NetworkPayload")({
  Ethernet0: S.optional(EthernetPayload),
  Ethernet1: S.optional(EthernetPayload),
  Ntp: S.optional(NtpPayload),
}) {}
export class CreatePackageImportJobRequest extends S.Class<CreatePackageImportJobRequest>(
  "CreatePackageImportJobRequest",
)(
  {
    JobType: S.String,
    InputConfig: PackageImportJobInputConfig,
    OutputConfig: PackageImportJobOutputConfig,
    ClientToken: S.String,
    JobTags: S.optional(JobTagsList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/packages/import-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDeviceResponse extends S.Class<DescribeDeviceResponse>(
  "DescribeDeviceResponse",
)({
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
}) {}
export class DescribeNodeResponse extends S.Class<DescribeNodeResponse>(
  "DescribeNodeResponse",
)({
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
}) {}
export class DescribePackageImportJobResponse extends S.Class<DescribePackageImportJobResponse>(
  "DescribePackageImportJobResponse",
)({
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
}) {}
export class ProvisionDeviceRequest extends S.Class<ProvisionDeviceRequest>(
  "ProvisionDeviceRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
    NetworkingConfiguration: S.optional(NetworkPayload),
  },
  T.all(
    T.Http({ method: "POST", uri: "/devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Job extends S.Class<Job>("Job")({
  JobId: S.optional(S.String),
  DeviceId: S.optional(S.String),
}) {}
export const JobList = S.Array(Job);
export class CreateJobForDevicesResponse extends S.Class<CreateJobForDevicesResponse>(
  "CreateJobForDevicesResponse",
)({ Jobs: JobList }) {}
export class CreatePackageImportJobResponse extends S.Class<CreatePackageImportJobResponse>(
  "CreatePackageImportJobResponse",
)({ JobId: S.String }) {}
export class ProvisionDeviceResponse extends S.Class<ProvisionDeviceResponse>(
  "ProvisionDeviceResponse",
)({
  DeviceId: S.optional(S.String),
  Arn: S.String,
  Status: S.String,
  Certificates: S.optional(T.Blob),
  IotThingName: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}

//# Operations
/**
 * Removes tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a device.
 */
export const deleteDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a package.
 *
 * To delete a package, you need permission to call `s3:DeleteObject` in addition to permissions for
 * the AWS Panorama API.
 */
export const deletePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns information about an application instance's configuration manifest.
 */
export const describeApplicationInstanceDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeDeviceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeNodeFromTemplateJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeNodeFromTemplateJobRequest,
    output: DescribeNodeFromTemplateJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about a package.
 */
export const describePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describePackageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePackageVersionRequest,
    output: DescribePackageVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Registers a package version.
 */
export const registerPackageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterPackageVersionRequest,
    output: RegisterPackageVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Removes an application instance.
 */
export const removeApplicationInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveApplicationInstanceRequest,
    output: RemoveApplicationInstanceResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a device's metadata.
 */
export const updateDeviceMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDeviceMetadataRequest,
    output: UpdateDeviceMetadataResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a camera stream node.
 */
export const createNodeFromTemplateJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateNodeFromTemplateJobRequest,
    output: CreateNodeFromTemplateJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a package and storage location in an Amazon S3 access point.
 */
export const createPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deregisters a package version.
 */
export const deregisterPackageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterPackageVersionRequest,
    output: DeregisterPackageVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about an application instance on a device.
 */
export const describeApplicationInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeApplicationInstanceRequest,
    output: DescribeApplicationInstanceResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of application instance dependencies.
 */
export const listApplicationInstanceDependencies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListApplicationInstanceDependenciesRequest,
    output: ListApplicationInstanceDependenciesResponse,
    errors: [AccessDeniedException, InternalServerException],
  }));
/**
 * Returns a list of application node instances.
 */
export const listApplicationInstanceNodeInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListApplicationInstanceNodeInstancesRequest,
    output: ListApplicationInstanceNodeInstancesResponse,
    errors: [AccessDeniedException, InternalServerException],
  }));
/**
 * Returns a list of application instances.
 */
export const listApplicationInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListApplicationInstancesRequest,
    output: ListApplicationInstancesResponse,
    errors: [AccessDeniedException, InternalServerException],
  }),
);
/**
 * Returns a list of devices.
 */
export const listDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevicesRequest,
  output: ListDevicesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ValidationException,
  ],
}));
/**
 * Returns a list of jobs.
 */
export const listDevicesJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevicesJobsRequest,
  output: ListDevicesJobsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of camera stream node jobs.
 */
export const listNodeFromTemplateJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListNodeFromTemplateJobsRequest,
    output: ListNodeFromTemplateJobsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of nodes.
 */
export const listNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNodesRequest,
  output: ListNodesResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Returns a list of package import jobs.
 */
export const listPackageImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPackageImportJobsRequest,
    output: ListPackageImportJobsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of packages.
 */
export const listPackages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPackagesRequest,
  output: ListPackagesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Signal camera nodes to stop or resume.
 */
export const signalApplicationInstanceNodeInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Tags a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an application instance and deploys it to a device.
 */
export const createApplicationInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateApplicationInstanceRequest,
    output: CreateApplicationInstanceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about a device.
 */
export const describeDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describePackageImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePackageImportJobRequest,
    output: DescribePackageImportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a job to run on a device. A job can update a device's software or reboot it.
 */
export const createJobForDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPackageImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePackageImportJobRequest,
    output: CreatePackageImportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a device and returns a configuration archive. The configuration archive is a ZIP file that contains a
 * provisioning certificate that is valid for 5 minutes. Name the configuration archive
 * `certificates-omni_*device-name*.zip` and transfer it to the device within 5
 * minutes. Use the included USB storage device and connect it to the USB 3.0 port next to the HDMI output.
 */
export const provisionDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
