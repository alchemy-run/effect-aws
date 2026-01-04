import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "EFS",
  serviceShapeName: "MagnolioAPIService_v20150201",
});
const auth = T.AwsAuthSigv4({ name: "elasticfilesystem" });
const ver = T.ServiceVersion("2015-02-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://efs.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://efs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://efs.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://efs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://efs.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://efs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                            url: "https://elasticfilesystem-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://elasticfilesystem-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                            url: "https://elasticfilesystem.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://elasticfilesystem.{Region}.{PartitionResult#dnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const SecurityGroups = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class CreateFileSystemRequest extends S.Class<CreateFileSystemRequest>(
  "CreateFileSystemRequest",
)(
  {
    CreationToken: S.String,
    PerformanceMode: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    ThroughputMode: S.optional(S.String),
    ProvisionedThroughputInMibps: S.optional(S.Number),
    AvailabilityZoneName: S.optional(S.String),
    Backup: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2015-02-01/file-systems" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMountTargetRequest extends S.Class<CreateMountTargetRequest>(
  "CreateMountTargetRequest",
)(
  {
    FileSystemId: S.String,
    SubnetId: S.String,
    IpAddress: S.optional(S.String),
    Ipv6Address: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    SecurityGroups: S.optional(SecurityGroups),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2015-02-01/mount-targets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTagsRequest extends S.Class<CreateTagsRequest>(
  "CreateTagsRequest",
)(
  { FileSystemId: S.String.pipe(T.HttpLabel()), Tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/2015-02-01/create-tags/{FileSystemId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTagsResponse extends S.Class<CreateTagsResponse>(
  "CreateTagsResponse",
)({}) {}
export class DeleteAccessPointRequest extends S.Class<DeleteAccessPointRequest>(
  "DeleteAccessPointRequest",
)(
  { AccessPointId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2015-02-01/access-points/{AccessPointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessPointResponse extends S.Class<DeleteAccessPointResponse>(
  "DeleteAccessPointResponse",
)({}) {}
export class DeleteFileSystemRequest extends S.Class<DeleteFileSystemRequest>(
  "DeleteFileSystemRequest",
)(
  { FileSystemId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2015-02-01/file-systems/{FileSystemId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFileSystemResponse extends S.Class<DeleteFileSystemResponse>(
  "DeleteFileSystemResponse",
)({}) {}
export class DeleteFileSystemPolicyRequest extends S.Class<DeleteFileSystemPolicyRequest>(
  "DeleteFileSystemPolicyRequest",
)(
  { FileSystemId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2015-02-01/file-systems/{FileSystemId}/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFileSystemPolicyResponse extends S.Class<DeleteFileSystemPolicyResponse>(
  "DeleteFileSystemPolicyResponse",
)({}) {}
export class DeleteMountTargetRequest extends S.Class<DeleteMountTargetRequest>(
  "DeleteMountTargetRequest",
)(
  { MountTargetId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2015-02-01/mount-targets/{MountTargetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMountTargetResponse extends S.Class<DeleteMountTargetResponse>(
  "DeleteMountTargetResponse",
)({}) {}
export class DeleteReplicationConfigurationRequest extends S.Class<DeleteReplicationConfigurationRequest>(
  "DeleteReplicationConfigurationRequest",
)(
  {
    SourceFileSystemId: S.String.pipe(T.HttpLabel()),
    DeletionMode: S.optional(S.String).pipe(T.HttpQuery("deletionMode")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2015-02-01/file-systems/{SourceFileSystemId}/replication-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReplicationConfigurationResponse extends S.Class<DeleteReplicationConfigurationResponse>(
  "DeleteReplicationConfigurationResponse",
)({}) {}
export class DeleteTagsRequest extends S.Class<DeleteTagsRequest>(
  "DeleteTagsRequest",
)(
  { FileSystemId: S.String.pipe(T.HttpLabel()), TagKeys: TagKeys },
  T.all(
    T.Http({ method: "POST", uri: "/2015-02-01/delete-tags/{FileSystemId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTagsResponse extends S.Class<DeleteTagsResponse>(
  "DeleteTagsResponse",
)({}) {}
export class DescribeAccessPointsRequest extends S.Class<DescribeAccessPointsRequest>(
  "DescribeAccessPointsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    AccessPointId: S.optional(S.String).pipe(T.HttpQuery("AccessPointId")),
    FileSystemId: S.optional(S.String).pipe(T.HttpQuery("FileSystemId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2015-02-01/access-points" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAccountPreferencesRequest extends S.Class<DescribeAccountPreferencesRequest>(
  "DescribeAccountPreferencesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "GET", uri: "/2015-02-01/account-preferences" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBackupPolicyRequest extends S.Class<DescribeBackupPolicyRequest>(
  "DescribeBackupPolicyRequest",
)(
  { FileSystemId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2015-02-01/file-systems/{FileSystemId}/backup-policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFileSystemPolicyRequest extends S.Class<DescribeFileSystemPolicyRequest>(
  "DescribeFileSystemPolicyRequest",
)(
  { FileSystemId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2015-02-01/file-systems/{FileSystemId}/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFileSystemsRequest extends S.Class<DescribeFileSystemsRequest>(
  "DescribeFileSystemsRequest",
)(
  {
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    CreationToken: S.optional(S.String).pipe(T.HttpQuery("CreationToken")),
    FileSystemId: S.optional(S.String).pipe(T.HttpQuery("FileSystemId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2015-02-01/file-systems" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeLifecycleConfigurationRequest extends S.Class<DescribeLifecycleConfigurationRequest>(
  "DescribeLifecycleConfigurationRequest",
)(
  { FileSystemId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2015-02-01/file-systems/{FileSystemId}/lifecycle-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMountTargetsRequest extends S.Class<DescribeMountTargetsRequest>(
  "DescribeMountTargetsRequest",
)(
  {
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    FileSystemId: S.optional(S.String).pipe(T.HttpQuery("FileSystemId")),
    MountTargetId: S.optional(S.String).pipe(T.HttpQuery("MountTargetId")),
    AccessPointId: S.optional(S.String).pipe(T.HttpQuery("AccessPointId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2015-02-01/mount-targets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMountTargetSecurityGroupsRequest extends S.Class<DescribeMountTargetSecurityGroupsRequest>(
  "DescribeMountTargetSecurityGroupsRequest",
)(
  { MountTargetId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2015-02-01/mount-targets/{MountTargetId}/security-groups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReplicationConfigurationsRequest extends S.Class<DescribeReplicationConfigurationsRequest>(
  "DescribeReplicationConfigurationsRequest",
)(
  {
    FileSystemId: S.optional(S.String).pipe(T.HttpQuery("FileSystemId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2015-02-01/file-systems/replication-configurations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTagsRequest extends S.Class<DescribeTagsRequest>(
  "DescribeTagsRequest",
)(
  {
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    FileSystemId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2015-02-01/tags/{FileSystemId}" }),
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
  {
    ResourceId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2015-02-01/resource-tags/{ResourceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ModifyMountTargetSecurityGroupsRequest extends S.Class<ModifyMountTargetSecurityGroupsRequest>(
  "ModifyMountTargetSecurityGroupsRequest",
)(
  {
    MountTargetId: S.String.pipe(T.HttpLabel()),
    SecurityGroups: S.optional(SecurityGroups),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2015-02-01/mount-targets/{MountTargetId}/security-groups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ModifyMountTargetSecurityGroupsResponse extends S.Class<ModifyMountTargetSecurityGroupsResponse>(
  "ModifyMountTargetSecurityGroupsResponse",
)({}) {}
export class PutAccountPreferencesRequest extends S.Class<PutAccountPreferencesRequest>(
  "PutAccountPreferencesRequest",
)(
  { ResourceIdType: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/2015-02-01/account-preferences" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutFileSystemPolicyRequest extends S.Class<PutFileSystemPolicyRequest>(
  "PutFileSystemPolicyRequest",
)(
  {
    FileSystemId: S.String.pipe(T.HttpLabel()),
    Policy: S.String,
    BypassPolicyLockoutSafetyCheck: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2015-02-01/file-systems/{FileSystemId}/policy",
    }),
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
  { ResourceId: S.String.pipe(T.HttpLabel()), Tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/2015-02-01/resource-tags/{ResourceId}" }),
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
    ResourceId: S.String.pipe(T.HttpLabel()),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/2015-02-01/resource-tags/{ResourceId}" }),
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
export class UpdateFileSystemRequest extends S.Class<UpdateFileSystemRequest>(
  "UpdateFileSystemRequest",
)(
  {
    FileSystemId: S.String.pipe(T.HttpLabel()),
    ThroughputMode: S.optional(S.String),
    ProvisionedThroughputInMibps: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/2015-02-01/file-systems/{FileSystemId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFileSystemProtectionRequest extends S.Class<UpdateFileSystemProtectionRequest>(
  "UpdateFileSystemProtectionRequest",
)(
  {
    FileSystemId: S.String.pipe(T.HttpLabel()),
    ReplicationOverwriteProtection: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2015-02-01/file-systems/{FileSystemId}/protection",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SecondaryGids = S.Array(S.Number);
export class PosixUser extends S.Class<PosixUser>("PosixUser")({
  Uid: S.Number,
  Gid: S.Number,
  SecondaryGids: S.optional(SecondaryGids),
}) {}
export class DestinationToCreate extends S.Class<DestinationToCreate>(
  "DestinationToCreate",
)({
  Region: S.optional(S.String),
  AvailabilityZoneName: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  FileSystemId: S.optional(S.String),
  RoleArn: S.optional(S.String),
}) {}
export const DestinationsToCreate = S.Array(DestinationToCreate);
export class FileSystemSize extends S.Class<FileSystemSize>("FileSystemSize")({
  Value: S.Number,
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ValueInIA: S.optional(S.Number),
  ValueInStandard: S.optional(S.Number),
  ValueInArchive: S.optional(S.Number),
}) {}
export class FileSystemProtectionDescription extends S.Class<FileSystemProtectionDescription>(
  "FileSystemProtectionDescription",
)({ ReplicationOverwriteProtection: S.optional(S.String) }) {}
export class FileSystemDescription extends S.Class<FileSystemDescription>(
  "FileSystemDescription",
)({
  OwnerId: S.String,
  CreationToken: S.String,
  FileSystemId: S.String,
  FileSystemArn: S.optional(S.String),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LifeCycleState: S.String,
  Name: S.optional(S.String),
  NumberOfMountTargets: S.Number,
  SizeInBytes: FileSystemSize,
  PerformanceMode: S.String,
  Encrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  ThroughputMode: S.optional(S.String),
  ProvisionedThroughputInMibps: S.optional(S.Number),
  AvailabilityZoneName: S.optional(S.String),
  AvailabilityZoneId: S.optional(S.String),
  Tags: Tags,
  FileSystemProtection: S.optional(FileSystemProtectionDescription),
}) {}
export const FileSystemDescriptions = S.Array(FileSystemDescription);
export class MountTargetDescription extends S.Class<MountTargetDescription>(
  "MountTargetDescription",
)({
  OwnerId: S.optional(S.String),
  MountTargetId: S.String,
  FileSystemId: S.String,
  SubnetId: S.String,
  LifeCycleState: S.String,
  IpAddress: S.optional(S.String),
  Ipv6Address: S.optional(S.String),
  NetworkInterfaceId: S.optional(S.String),
  AvailabilityZoneId: S.optional(S.String),
  AvailabilityZoneName: S.optional(S.String),
  VpcId: S.optional(S.String),
}) {}
export const MountTargetDescriptions = S.Array(MountTargetDescription);
export class BackupPolicy extends S.Class<BackupPolicy>("BackupPolicy")({
  Status: S.String,
}) {}
export class LifecyclePolicy extends S.Class<LifecyclePolicy>(
  "LifecyclePolicy",
)({
  TransitionToIA: S.optional(S.String),
  TransitionToPrimaryStorageClass: S.optional(S.String),
  TransitionToArchive: S.optional(S.String),
}) {}
export const LifecyclePolicies = S.Array(LifecyclePolicy);
export class CreateReplicationConfigurationRequest extends S.Class<CreateReplicationConfigurationRequest>(
  "CreateReplicationConfigurationRequest",
)(
  {
    SourceFileSystemId: S.String.pipe(T.HttpLabel()),
    Destinations: DestinationsToCreate,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2015-02-01/file-systems/{SourceFileSystemId}/replication-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BackupPolicyDescription extends S.Class<BackupPolicyDescription>(
  "BackupPolicyDescription",
)({ BackupPolicy: S.optional(BackupPolicy) }) {}
export class FileSystemPolicyDescription extends S.Class<FileSystemPolicyDescription>(
  "FileSystemPolicyDescription",
)({ FileSystemId: S.optional(S.String), Policy: S.optional(S.String) }) {}
export class DescribeFileSystemsResponse extends S.Class<DescribeFileSystemsResponse>(
  "DescribeFileSystemsResponse",
)({
  Marker: S.optional(S.String),
  FileSystems: S.optional(FileSystemDescriptions),
  NextMarker: S.optional(S.String),
}) {}
export class LifecycleConfigurationDescription extends S.Class<LifecycleConfigurationDescription>(
  "LifecycleConfigurationDescription",
)({ LifecyclePolicies: S.optional(LifecyclePolicies) }) {}
export class DescribeMountTargetsResponse extends S.Class<DescribeMountTargetsResponse>(
  "DescribeMountTargetsResponse",
)({
  Marker: S.optional(S.String),
  MountTargets: S.optional(MountTargetDescriptions),
  NextMarker: S.optional(S.String),
}) {}
export class DescribeMountTargetSecurityGroupsResponse extends S.Class<DescribeMountTargetSecurityGroupsResponse>(
  "DescribeMountTargetSecurityGroupsResponse",
)({ SecurityGroups: SecurityGroups }) {}
export class DescribeTagsResponse extends S.Class<DescribeTagsResponse>(
  "DescribeTagsResponse",
)({
  Marker: S.optional(S.String),
  Tags: Tags,
  NextMarker: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags), NextToken: S.optional(S.String) }) {}
export const Resources = S.Array(S.String);
export class ResourceIdPreference extends S.Class<ResourceIdPreference>(
  "ResourceIdPreference",
)({ ResourceIdType: S.optional(S.String), Resources: S.optional(Resources) }) {}
export class PutAccountPreferencesResponse extends S.Class<PutAccountPreferencesResponse>(
  "PutAccountPreferencesResponse",
)({ ResourceIdPreference: S.optional(ResourceIdPreference) }) {}
export class PutBackupPolicyRequest extends S.Class<PutBackupPolicyRequest>(
  "PutBackupPolicyRequest",
)(
  { FileSystemId: S.String.pipe(T.HttpLabel()), BackupPolicy: BackupPolicy },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2015-02-01/file-systems/{FileSystemId}/backup-policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutLifecycleConfigurationRequest extends S.Class<PutLifecycleConfigurationRequest>(
  "PutLifecycleConfigurationRequest",
)(
  {
    FileSystemId: S.String.pipe(T.HttpLabel()),
    LifecyclePolicies: LifecyclePolicies,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2015-02-01/file-systems/{FileSystemId}/lifecycle-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreationInfo extends S.Class<CreationInfo>("CreationInfo")({
  OwnerUid: S.Number,
  OwnerGid: S.Number,
  Permissions: S.String,
}) {}
export class RootDirectory extends S.Class<RootDirectory>("RootDirectory")({
  Path: S.optional(S.String),
  CreationInfo: S.optional(CreationInfo),
}) {}
export class AccessPointDescription extends S.Class<AccessPointDescription>(
  "AccessPointDescription",
)({
  ClientToken: S.optional(S.String),
  Name: S.optional(S.String),
  Tags: S.optional(Tags),
  AccessPointId: S.optional(S.String),
  AccessPointArn: S.optional(S.String),
  FileSystemId: S.optional(S.String),
  PosixUser: S.optional(PosixUser),
  RootDirectory: S.optional(RootDirectory),
  OwnerId: S.optional(S.String),
  LifeCycleState: S.optional(S.String),
}) {}
export const AccessPointDescriptions = S.Array(AccessPointDescription);
export class CreateAccessPointRequest extends S.Class<CreateAccessPointRequest>(
  "CreateAccessPointRequest",
)(
  {
    ClientToken: S.String,
    Tags: S.optional(Tags),
    FileSystemId: S.String,
    PosixUser: S.optional(PosixUser),
    RootDirectory: S.optional(RootDirectory),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2015-02-01/access-points" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAccessPointsResponse extends S.Class<DescribeAccessPointsResponse>(
  "DescribeAccessPointsResponse",
)({
  AccessPoints: S.optional(AccessPointDescriptions),
  NextToken: S.optional(S.String),
}) {}
export class DescribeAccountPreferencesResponse extends S.Class<DescribeAccountPreferencesResponse>(
  "DescribeAccountPreferencesResponse",
)({
  ResourceIdPreference: S.optional(ResourceIdPreference),
  NextToken: S.optional(S.String),
}) {}
export class Destination extends S.Class<Destination>("Destination")({
  Status: S.String,
  FileSystemId: S.String,
  Region: S.String,
  LastReplicatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  OwnerId: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  RoleArn: S.optional(S.String),
}) {}
export const Destinations = S.Array(Destination);
export class ReplicationConfigurationDescription extends S.Class<ReplicationConfigurationDescription>(
  "ReplicationConfigurationDescription",
)({
  SourceFileSystemId: S.String,
  SourceFileSystemRegion: S.String,
  SourceFileSystemArn: S.String,
  OriginalSourceFileSystemArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Destinations: Destinations,
  SourceFileSystemOwnerId: S.optional(S.String),
}) {}
export const ReplicationConfigurationDescriptions = S.Array(
  ReplicationConfigurationDescription,
);
export class DescribeReplicationConfigurationsResponse extends S.Class<DescribeReplicationConfigurationsResponse>(
  "DescribeReplicationConfigurationsResponse",
)({
  Replications: S.optional(ReplicationConfigurationDescriptions),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class BadRequest extends S.TaggedError<BadRequest>()("BadRequest", {}) {}
export class FileSystemNotFound extends S.TaggedError<FileSystemNotFound>()(
  "FileSystemNotFound",
  {},
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  {},
) {}
export class AccessPointNotFound extends S.TaggedError<AccessPointNotFound>()(
  "AccessPointNotFound",
  {},
) {}
export class IncorrectFileSystemLifeCycleState extends S.TaggedError<IncorrectFileSystemLifeCycleState>()(
  "IncorrectFileSystemLifeCycleState",
  {},
) {}
export class FileSystemInUse extends S.TaggedError<FileSystemInUse>()(
  "FileSystemInUse",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class DependencyTimeout extends S.TaggedError<DependencyTimeout>()(
  "DependencyTimeout",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class PolicyNotFound extends S.TaggedError<PolicyNotFound>()(
  "PolicyNotFound",
  {},
) {}
export class MountTargetNotFound extends S.TaggedError<MountTargetNotFound>()(
  "MountTargetNotFound",
  {},
) {}
export class IncorrectMountTargetState extends S.TaggedError<IncorrectMountTargetState>()(
  "IncorrectMountTargetState",
  {},
) {}
export class InsufficientThroughputCapacity extends S.TaggedError<InsufficientThroughputCapacity>()(
  "InsufficientThroughputCapacity",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class AvailabilityZonesMismatch extends S.TaggedError<AvailabilityZonesMismatch>()(
  "AvailabilityZonesMismatch",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ReplicationNotFound extends S.TaggedError<ReplicationNotFound>()(
  "ReplicationNotFound",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class SecurityGroupLimitExceeded extends S.TaggedError<SecurityGroupLimitExceeded>()(
  "SecurityGroupLimitExceeded",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class InvalidPolicyException extends S.TaggedError<InvalidPolicyException>()(
  "InvalidPolicyException",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ThroughputLimitExceeded extends S.TaggedError<ThroughputLimitExceeded>()(
  "ThroughputLimitExceeded",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class ReplicationAlreadyExists extends S.TaggedError<ReplicationAlreadyExists>()(
  "ReplicationAlreadyExists",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class TooManyRequests extends S.TaggedError<TooManyRequests>()(
  "TooManyRequests",
  {},
) {}
export class AccessPointAlreadyExists extends S.TaggedError<AccessPointAlreadyExists>()(
  "AccessPointAlreadyExists",
  {
    ErrorCode: S.String,
    Message: S.optional(S.String),
    AccessPointId: S.String,
  },
) {}
export class FileSystemAlreadyExists extends S.TaggedError<FileSystemAlreadyExists>()(
  "FileSystemAlreadyExists",
  {
    ErrorCode: S.String,
    Message: S.optional(S.String),
    FileSystemId: S.String,
  },
) {}
export class FileSystemLimitExceeded extends S.TaggedError<FileSystemLimitExceeded>()(
  "FileSystemLimitExceeded",
  {},
) {}
export class IpAddressInUse extends S.TaggedError<IpAddressInUse>()(
  "IpAddressInUse",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class UnsupportedAvailabilityZone extends S.TaggedError<UnsupportedAvailabilityZone>()(
  "UnsupportedAvailabilityZone",
  {},
) {}
export class SecurityGroupNotFound extends S.TaggedError<SecurityGroupNotFound>()(
  "SecurityGroupNotFound",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class AccessPointLimitExceeded extends S.TaggedError<AccessPointLimitExceeded>()(
  "AccessPointLimitExceeded",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class MountTargetConflict extends S.TaggedError<MountTargetConflict>()(
  "MountTargetConflict",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class NetworkInterfaceLimitExceeded extends S.TaggedError<NetworkInterfaceLimitExceeded>()(
  "NetworkInterfaceLimitExceeded",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class NoFreeAddressesInSubnet extends S.TaggedError<NoFreeAddressesInSubnet>()(
  "NoFreeAddressesInSubnet",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}
export class SubnetNotFound extends S.TaggedError<SubnetNotFound>()(
  "SubnetNotFound",
  { ErrorCode: S.String, Message: S.optional(S.String) },
) {}

//# Operations
/**
 * DEPRECATED - `DeleteTags` is deprecated and not maintained. To remove tags from EFS
 * resources, use the API action.
 *
 * Deletes the specified tags from a file system. If the `DeleteTags` request
 * includes a tag key that doesn't exist, Amazon EFS ignores it and doesn't cause an
 * error. For more information about tags and related restrictions, see Tag restrictions in the
 * *Billing and Cost Management User Guide*.
 *
 * This operation requires permissions for the `elasticfilesystem:DeleteTags`
 * action.
 */
export const deleteTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsRequest,
  output: DeleteTagsResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * Creates a tag for an EFS resource. You can create tags for EFS file
 * systems and access points using this API operation.
 *
 * This operation requires permissions for the `elasticfilesystem:TagResource` action.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessPointNotFound,
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
  ],
}));
/**
 * Removes tags from an EFS resource. You can remove tags from EFS file
 * systems and access points using this API operation.
 *
 * This operation requires permissions for the `elasticfilesystem:UntagResource` action.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessPointNotFound,
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
  ],
}));
/**
 * DEPRECATED - `CreateTags` is deprecated and not maintained. To create tags for EFS
 * resources, use the API action.
 *
 * Creates or overwrites tags associated with a file system. Each tag is a key-value pair. If
 * a tag key specified in the request already exists on the file system, this operation
 * overwrites its value with the value provided in the request. If you add the `Name`
 * tag to your file system, Amazon EFS returns it in the response to the DescribeFileSystems operation.
 *
 * This operation requires permission for the `elasticfilesystem:CreateTags`
 * action.
 */
export const createTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTagsRequest,
  output: CreateTagsResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * Deletes the specified access point. After deletion is complete, new clients can no
 * longer connect to the access points. Clients connected to the access point at the time of
 * deletion will continue to function until they terminate their connection.
 *
 * This operation requires permissions for the `elasticfilesystem:DeleteAccessPoint` action.
 */
export const deleteAccessPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPointRequest,
  output: DeleteAccessPointResponse,
  errors: [AccessPointNotFound, BadRequest, InternalServerError],
}));
/**
 * Deletes a file system, permanently severing access to its contents. Upon return, the
 * file system no longer exists and you can't access any contents of the deleted file
 * system.
 *
 * You need to manually delete mount targets attached to a file system before you can delete
 * an EFS file system. This step is performed for you when you use the Amazon Web Services console
 * to delete a file system.
 *
 * You cannot delete a file system that is part of an EFS replication configuration.
 * You need to delete the replication configuration first.
 *
 * You can't delete a file system that is in use. That is, if the file system has
 * any mount targets, you must first delete them. For more information, see DescribeMountTargets and DeleteMountTarget.
 *
 * The `DeleteFileSystem` call returns while the file system state is still
 * `deleting`. You can check the file system deletion status by calling the DescribeFileSystems operation, which returns a list of file systems in your
 * account. If you pass file system ID or creation token for the deleted file system, the DescribeFileSystems returns a `404 FileSystemNotFound`
 * error.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DeleteFileSystem` action.
 */
export const deleteFileSystem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFileSystemRequest,
  output: DeleteFileSystemResponse,
  errors: [
    BadRequest,
    FileSystemInUse,
    FileSystemNotFound,
    InternalServerError,
  ],
}));
/**
 * Deletes the `FileSystemPolicy` for the specified file system.
 * The default `FileSystemPolicy` goes into effect once the existing policy is deleted.
 * For more information about the default file system policy, see Using Resource-based Policies with EFS.
 *
 * This operation requires permissions for the `elasticfilesystem:DeleteFileSystemPolicy` action.
 */
export const deleteFileSystemPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFileSystemPolicyRequest,
    output: DeleteFileSystemPolicyResponse,
    errors: [
      BadRequest,
      FileSystemNotFound,
      IncorrectFileSystemLifeCycleState,
      InternalServerError,
    ],
  }),
);
/**
 * Returns the `FileSystemPolicy` for the specified EFS file
 * system.
 *
 * This operation requires permissions for the `elasticfilesystem:DescribeFileSystemPolicy` action.
 */
export const describeFileSystemPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFileSystemPolicyRequest,
    output: FileSystemPolicyDescription,
    errors: [
      BadRequest,
      FileSystemNotFound,
      InternalServerError,
      PolicyNotFound,
    ],
  }),
);
/**
 * Returns the description of a specific Amazon EFS file system if either the file system
 * `CreationToken` or the `FileSystemId` is provided. Otherwise, it
 * returns descriptions of all file systems owned by the caller's Amazon Web Services account in the
 * Amazon Web Services Region of the endpoint that you're calling.
 *
 * When retrieving all file system descriptions, you can optionally specify the
 * `MaxItems` parameter to limit the number of descriptions in a response.
 * This number is automatically set to 100. If more file system descriptions remain,
 * Amazon EFS returns a `NextMarker`, an opaque token, in the response. In this case,
 * you should send a subsequent request with the `Marker` request parameter set to the
 * value of `NextMarker`.
 *
 * To retrieve a list of your file system descriptions, this operation is used in an
 * iterative process, where `DescribeFileSystems` is called first without the
 * `Marker` and then the operation continues to call it with the `Marker`
 * parameter set to the value of the `NextMarker` from the previous response until the
 * response has no `NextMarker`.
 *
 * The order of file systems returned in the response of one
 * `DescribeFileSystems` call and the order of file systems returned across the
 * responses of a multi-call iteration is unspecified.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DescribeFileSystems` action.
 */
export const describeFileSystems = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFileSystemsRequest,
  output: DescribeFileSystemsResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * Returns the current `LifecycleConfiguration` object for the specified
 * EFS file system. Lifecycle management uses the `LifecycleConfiguration`
 * object to identify when to move files between storage classes. For a file system without a
 * `LifecycleConfiguration` object, the call returns an empty array in the
 * response.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DescribeLifecycleConfiguration` operation.
 */
export const describeLifecycleConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeLifecycleConfigurationRequest,
    output: LifecycleConfigurationDescription,
    errors: [BadRequest, FileSystemNotFound, InternalServerError],
  }));
/**
 * Returns the descriptions of all the current mount targets, or a specific mount target,
 * for a file system. When requesting all of the current mount targets, the order of mount
 * targets returned in the response is unspecified.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DescribeMountTargets` action, on either the file system ID
 * that you specify in `FileSystemId`, or on the file system of the mount target that
 * you specify in `MountTargetId`.
 */
export const describeMountTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMountTargetsRequest,
    output: DescribeMountTargetsResponse,
    errors: [
      AccessPointNotFound,
      BadRequest,
      FileSystemNotFound,
      InternalServerError,
      MountTargetNotFound,
    ],
  }),
);
/**
 * Returns the security groups currently in effect for a mount target. This operation
 * requires that the network interface of the mount target has been created and the lifecycle
 * state of the mount target is not `deleted`.
 *
 * This operation requires permissions for the following actions:
 *
 * - `elasticfilesystem:DescribeMountTargetSecurityGroups` action on the mount
 * target's file system.
 *
 * - `ec2:DescribeNetworkInterfaceAttribute` action on the mount target's
 * network interface.
 */
export const describeMountTargetSecurityGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeMountTargetSecurityGroupsRequest,
    output: DescribeMountTargetSecurityGroupsResponse,
    errors: [
      BadRequest,
      IncorrectMountTargetState,
      InternalServerError,
      MountTargetNotFound,
    ],
  }));
/**
 * DEPRECATED - The `DescribeTags` action is deprecated and not maintained. To view
 * tags associated with EFS resources, use the `ListTagsForResource` API
 * action.
 *
 * Returns the tags associated with a file system. The order of tags returned in the
 * response of one `DescribeTags` call and the order of tags returned across the
 * responses of a multiple-call iteration (when using pagination) is unspecified.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DescribeTags` action.
 */
export const describeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagsRequest,
  output: DescribeTagsResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * Lists all tags for a top-level EFS resource. You must provide the ID of the
 * resource that you want to retrieve the tags for.
 *
 * This operation requires permissions for the `elasticfilesystem:DescribeAccessPoints` action.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessPointNotFound,
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
  ],
}));
/**
 * Use this operation to set the account preference in the current Amazon Web Services Region
 * to use long 17 character (63 bit) or short 8 character (32 bit) resource IDs for new
 * EFS file system and mount target resources. All existing resource IDs are not
 * affected by any changes you make. You can set the ID preference during the opt-in period as
 * EFS transitions to long resource IDs. For more information, see Managing Amazon EFS resource IDs.
 *
 * Starting in October, 2021, you will receive an error if you try to set the account preference
 * to use the short 8 character format resource ID. Contact Amazon Web Services support if you
 * receive an error and must use short IDs for file system and mount target resources.
 */
export const putAccountPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAccountPreferencesRequest,
    output: PutAccountPreferencesResponse,
    errors: [BadRequest, InternalServerError],
  }),
);
/**
 * Use this action to manage storage for your file system. A
 * `LifecycleConfiguration` consists of one or more `LifecyclePolicy`
 * objects that define the following:
 *
 * -
 * `TransitionToIA`
 * –
 * When to move files in the file system from primary storage (Standard storage class) into the Infrequent Access
 * (IA) storage.
 *
 * -
 * `TransitionToArchive`
 * –
 * When to move files in the file system from their current storage class (either IA or Standard storage) into the
 * Archive storage.
 *
 * File systems cannot transition into Archive storage before transitioning into IA storage. Therefore,
 * TransitionToArchive must either not be set or must be later than TransitionToIA.
 *
 * The Archive storage class is available only for file systems that use the Elastic throughput mode
 * and the General Purpose performance mode.
 *
 * -
 * `TransitionToPrimaryStorageClass`
 * –
 * Whether to move files in the file system back to primary storage (Standard storage class) after they are accessed in IA
 * or Archive storage.
 *
 * For more information, see Managing file system
 * storage.
 *
 * Each Amazon EFS file system supports one lifecycle configuration, which applies to
 * all files in the file system. If a `LifecycleConfiguration` object already exists
 * for the specified file system, a `PutLifecycleConfiguration` call modifies the
 * existing configuration. A `PutLifecycleConfiguration` call with an empty
 * `LifecyclePolicies` array in the request body deletes any existing
 * `LifecycleConfiguration`. In the request, specify the following:
 *
 * - The ID for the file system for which you are enabling, disabling, or modifying
 * lifecycle management.
 *
 * - A `LifecyclePolicies` array of `LifecyclePolicy` objects that
 * define when to move files to IA storage, to Archive storage,
 * and back to primary storage.
 *
 * Amazon EFS requires that each `LifecyclePolicy`
 * object have only have a single transition, so the `LifecyclePolicies` array needs to be structured with separate
 * `LifecyclePolicy` objects. See the example requests in the following section for more information.
 *
 * This operation requires permissions for the `elasticfilesystem:PutLifecycleConfiguration` operation.
 *
 * To apply a `LifecycleConfiguration` object to an encrypted file system, you
 * need the same Key Management Service permissions as when you created the encrypted file system.
 */
export const putLifecycleConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutLifecycleConfigurationRequest,
    output: LifecycleConfigurationDescription,
    errors: [
      BadRequest,
      FileSystemNotFound,
      IncorrectFileSystemLifeCycleState,
      InternalServerError,
    ],
  }),
);
/**
 * Deletes the specified mount target.
 *
 * This operation forcibly breaks any mounts of the file system by using the mount target
 * that is being deleted, which might disrupt instances or applications using those mounts. To
 * avoid applications getting cut off abruptly, you might consider unmounting any mounts of the
 * mount target, if feasible. The operation also deletes the associated network interface.
 * Uncommitted writes might be lost, but breaking a mount target using this operation does not
 * corrupt the file system itself. The file system you created remains. You can mount an
 * EC2 instance in your VPC by using another mount target.
 *
 * This operation requires permissions for the following action on the file
 * system:
 *
 * - `elasticfilesystem:DeleteMountTarget`
 *
 * The `DeleteMountTarget` call returns while the mount target state is still
 * `deleting`. You can check the mount target deletion by calling the DescribeMountTargets operation, which returns a list of mount target
 * descriptions for the given file system.
 *
 * The operation also requires permissions for the following Amazon EC2 action on the
 * mount target's network interface:
 *
 * - `ec2:DeleteNetworkInterface`
 */
export const deleteMountTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMountTargetRequest,
  output: DeleteMountTargetResponse,
  errors: [
    BadRequest,
    DependencyTimeout,
    InternalServerError,
    MountTargetNotFound,
  ],
}));
/**
 * Deletes a replication configuration. Deleting a replication configuration ends the
 * replication process. After a replication configuration is deleted, the destination file system
 * becomes `Writeable` and its replication overwrite protection is re-enabled. For
 * more information, see Delete a replication configuration.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DeleteReplicationConfiguration` action.
 */
export const deleteReplicationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteReplicationConfigurationRequest,
    output: DeleteReplicationConfigurationResponse,
    errors: [
      BadRequest,
      FileSystemNotFound,
      InternalServerError,
      ReplicationNotFound,
    ],
  }));
/**
 * Returns the description of a specific Amazon EFS access point if the
 * `AccessPointId` is provided. If you provide an EFS
 * `FileSystemId`, it returns descriptions of all access points for that file
 * system. You can provide either an `AccessPointId` or a `FileSystemId` in
 * the request, but not both.
 *
 * This operation requires permissions for the `elasticfilesystem:DescribeAccessPoints` action.
 */
export const describeAccessPoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccessPointsRequest,
    output: DescribeAccessPointsResponse,
    errors: [
      AccessPointNotFound,
      BadRequest,
      FileSystemNotFound,
      InternalServerError,
    ],
  }),
);
/**
 * Returns the account preferences settings for the Amazon Web Services account associated with the user making the request, in the current Amazon Web Services Region.
 */
export const describeAccountPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountPreferencesRequest,
    output: DescribeAccountPreferencesResponse,
    errors: [InternalServerError],
  }),
);
/**
 * Returns the backup policy for the specified EFS file system.
 */
export const describeBackupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBackupPolicyRequest,
    output: BackupPolicyDescription,
    errors: [
      BadRequest,
      FileSystemNotFound,
      InternalServerError,
      PolicyNotFound,
      ValidationException,
    ],
  }),
);
/**
 * Updates the file system's backup policy. Use this action to start or stop automatic backups of the file system.
 */
export const putBackupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBackupPolicyRequest,
  output: BackupPolicyDescription,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
    ValidationException,
  ],
}));
/**
 * Applies an Amazon EFS
 * `FileSystemPolicy` to an Amazon EFS file system. A file system policy is an
 * IAM resource-based policy and can contain multiple policy statements. A file system always has
 * exactly one file system policy, which can be the default policy or an explicit policy set or
 * updated using this API operation. EFS file system policies have a 20,000 character
 * limit. When an explicit policy is set, it overrides the default policy. For more information
 * about the default file system policy, see
 * Default EFS file system policy.
 *
 * EFS file system policies have a 20,000 character limit.
 *
 * This operation requires permissions for the `elasticfilesystem:PutFileSystemPolicy` action.
 */
export const putFileSystemPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFileSystemPolicyRequest,
  output: FileSystemPolicyDescription,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
    InvalidPolicyException,
  ],
}));
/**
 * Updates protection on the file system.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:UpdateFileSystemProtection` action.
 */
export const updateFileSystemProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFileSystemProtectionRequest,
    output: FileSystemProtectionDescription,
    errors: [
      BadRequest,
      FileSystemNotFound,
      IncorrectFileSystemLifeCycleState,
      InsufficientThroughputCapacity,
      InternalServerError,
      ReplicationAlreadyExists,
      ThroughputLimitExceeded,
      TooManyRequests,
    ],
  }),
);
/**
 * Creates a replication conﬁguration to either a new or existing EFS file system.
 * For more information, see Amazon EFS replication in the Amazon EFS User
 * Guide. The replication configuration specifies the following:
 *
 * - **Source file system** – The EFS file
 * system that you want to replicate.
 *
 * - **Destination file system** – The destination file
 * system to which the source file system is replicated. There can only be one destination
 * file system in a replication configuration.
 *
 * A file system can be part of only one replication configuration.
 *
 * The destination parameters for the replication configuration depend on
 * whether you are replicating to a new file system or to an existing file system, and if you
 * are replicating across Amazon Web Services accounts. See DestinationToCreate for more information.
 *
 * This operation requires permissions for the `elasticfilesystem:CreateReplicationConfiguration`
 * action. Additionally, other permissions are required depending on how you are replicating file systems.
 * For more information, see Required permissions for replication
 * in the Amazon EFS User
 * Guide.
 */
export const createReplicationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateReplicationConfigurationRequest,
    output: ReplicationConfigurationDescription,
    errors: [
      BadRequest,
      ConflictException,
      FileSystemLimitExceeded,
      FileSystemNotFound,
      IncorrectFileSystemLifeCycleState,
      InsufficientThroughputCapacity,
      InternalServerError,
      ReplicationNotFound,
      ThroughputLimitExceeded,
      UnsupportedAvailabilityZone,
      ValidationException,
    ],
  }));
/**
 * Retrieves the replication configuration for a specific file system. If a file system is
 * not specified, all of the replication configurations for the Amazon Web Services account in an
 * Amazon Web Services Region are retrieved.
 */
export const describeReplicationConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeReplicationConfigurationsRequest,
    output: DescribeReplicationConfigurationsResponse,
    errors: [
      BadRequest,
      FileSystemNotFound,
      InternalServerError,
      ReplicationNotFound,
      ValidationException,
    ],
  }));
/**
 * Modifies the set of security groups in effect for a mount target.
 *
 * When you create a mount target, Amazon EFS also creates a new network interface. For
 * more information, see CreateMountTarget. This operation replaces the security groups in effect for the
 * network interface associated with a mount target, with the `SecurityGroups`
 * provided in the request. This operation requires that the network interface of the mount
 * target has been created and the lifecycle state of the mount target is not
 * `deleted`.
 *
 * The operation requires permissions for the following actions:
 *
 * - `elasticfilesystem:ModifyMountTargetSecurityGroups` action on the mount
 * target's file system.
 *
 * - `ec2:ModifyNetworkInterfaceAttribute` action on the mount target's network
 * interface.
 */
export const modifyMountTargetSecurityGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyMountTargetSecurityGroupsRequest,
    output: ModifyMountTargetSecurityGroupsResponse,
    errors: [
      BadRequest,
      IncorrectMountTargetState,
      InternalServerError,
      MountTargetNotFound,
      SecurityGroupLimitExceeded,
      SecurityGroupNotFound,
    ],
  }));
/**
 * Updates the throughput mode or the amount of provisioned throughput of an existing file
 * system.
 */
export const updateFileSystem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFileSystemRequest,
  output: FileSystemDescription,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InsufficientThroughputCapacity,
    InternalServerError,
    ThroughputLimitExceeded,
    TooManyRequests,
  ],
}));
/**
 * Creates a new, empty file system. The operation requires a creation token in the
 * request that Amazon EFS uses to ensure idempotent creation (calling the operation with same
 * creation token has no effect). If a file system does not currently exist that is owned by the
 * caller's Amazon Web Services account with the specified creation token, this operation does the
 * following:
 *
 * - Creates a new, empty file system. The file system will have an Amazon EFS assigned
 * ID, and an initial lifecycle state `creating`.
 *
 * - Returns with the description of the created file system.
 *
 * Otherwise, this operation returns a `FileSystemAlreadyExists` error with the
 * ID of the existing file system.
 *
 * For basic use cases, you can use a randomly generated UUID for the creation
 * token.
 *
 * The idempotent operation allows you to retry a `CreateFileSystem` call without
 * risk of creating an extra file system. This can happen when an initial call fails in a way
 * that leaves it uncertain whether or not a file system was actually created. An example might
 * be that a transport level timeout occurred or your connection was reset. As long as you use
 * the same creation token, if the initial call had succeeded in creating a file system, the
 * client can learn of its existence from the `FileSystemAlreadyExists` error.
 *
 * For more information, see
 * Creating a file system
 * in the *Amazon EFS User Guide*.
 *
 * The `CreateFileSystem` call returns while the file system's lifecycle
 * state is still `creating`. You can check the file system creation status by
 * calling the DescribeFileSystems operation, which among other things returns the file
 * system state.
 *
 * This operation accepts an optional `PerformanceMode` parameter that you choose
 * for your file system. We recommend `generalPurpose`
 * `PerformanceMode` for all file
 * systems. The `maxIO` mode is a previous generation performance type that is designed for highly parallelized workloads that can tolerate higher latencies
 * than the `generalPurpose` mode. `MaxIO` mode is not supported for One Zone file systems or
 * file systems that use Elastic throughput.
 *
 * The `PerformanceMode` can't be changed after the file system has been
 * created. For more information, see Amazon EFS performance
 * modes.
 *
 * You can set the throughput mode for the file system using the `ThroughputMode`
 * parameter.
 *
 * After the file system is fully created, Amazon EFS sets its lifecycle state to
 * `available`, at which point you can create one or more mount targets for the file
 * system in your VPC. For more information, see CreateMountTarget. You mount
 * your Amazon EFS file system on an EC2 instances in your VPC by using the mount
 * target. For more information, see Amazon EFS: How it Works.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:CreateFileSystem` action.
 *
 * File systems can be tagged on creation. If tags are specified in the creation action, IAM
 * performs additional authorization on the `elasticfilesystem:TagResource` action to
 * verify if users have permissions to create tags. Therefore, you must grant explicit
 * permissions to use the `elasticfilesystem:TagResource` action. For more
 * information, see Granting permissions to tag resources during creation.
 */
export const createFileSystem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFileSystemRequest,
  output: FileSystemDescription,
  errors: [
    BadRequest,
    FileSystemAlreadyExists,
    FileSystemLimitExceeded,
    InsufficientThroughputCapacity,
    InternalServerError,
    ThroughputLimitExceeded,
    UnsupportedAvailabilityZone,
  ],
}));
/**
 * Creates an EFS access point. An access point is an application-specific view
 * into an EFS file system that applies an operating system user and group, and a file
 * system path, to any file system request made through the access point. The operating system
 * user and group override any identity information provided by the NFS client. The file system
 * path is exposed as the access point's root directory. Applications using the access point can
 * only access data in the application's own directory and any subdirectories. A file system can
 * have a maximum of 10,000 access points unless you request an increase. To learn more, see
 * Mounting a file
 * system using EFS access points.
 *
 * If multiple requests to create access points on the same file system are sent in quick
 * succession, and the file system is near the limit of access points, you may experience a
 * throttling response for these requests. This is to ensure that the file system does not
 * exceed the stated access point limit.
 *
 * This operation requires permissions for the `elasticfilesystem:CreateAccessPoint` action.
 *
 * Access points can be tagged on creation. If tags are specified in the creation action, IAM
 * performs additional authorization on the `elasticfilesystem:TagResource` action to
 * verify if users have permissions to create tags. Therefore, you must grant explicit
 * permissions to use the `elasticfilesystem:TagResource` action. For more
 * information, see Granting
 * permissions to tag resources during creation.
 */
export const createAccessPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPointRequest,
  output: AccessPointDescription,
  errors: [
    AccessPointAlreadyExists,
    AccessPointLimitExceeded,
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
    ThrottlingException,
  ],
}));
/**
 * Creates a mount target for a file system. You can then mount the file system on EC2
 * instances by using the mount target.
 *
 * You can create one mount target in each Availability Zone in your VPC. All EC2 instances
 * in a VPC within a given Availability Zone share a single mount target for a given file system. If
 * you have multiple subnets in an Availability Zone, you create a mount target in one of the subnets.
 * EC2 instances do not need to be in the same subnet as the mount target in order to
 * access their file system.
 *
 * You can create only one mount target for a One Zone file system. You must
 * create that mount target in the same Availability Zone in which the file system is located. Use the
 * `AvailabilityZoneName` and `AvailabiltyZoneId` properties in the DescribeFileSystems response object to get this information. Use the
 * `subnetId` associated with the file system's Availability Zone when creating the mount
 * target.
 *
 * For more information, see Amazon EFS: How it Works.
 *
 * To create a mount target for a file system, the file system's lifecycle state must be
 * `available`. For more information, see DescribeFileSystems.
 *
 * In the request, provide the following:
 *
 * - The file system ID for which you are creating the mount
 * target.
 *
 * - A subnet ID, which determines the following:
 *
 * - The VPC in which Amazon EFS creates the mount target
 *
 * - The Availability Zone in which Amazon EFS creates the mount target
 *
 * - The IP address range from which Amazon EFS selects the IP address of the mount target
 * (if you don't specify an IP address in the request)
 *
 * After creating the mount target, Amazon EFS returns a response that includes, a
 * `MountTargetId` and an `IpAddress`. You use this IP address when
 * mounting the file system in an EC2 instance. You can also use the mount target's
 * DNS name when mounting the file system. The EC2 instance on which you mount the file
 * system by using the mount target can resolve the mount target's DNS name to its IP
 * address. For more information, see How it Works:
 * Implementation Overview.
 *
 * Note that you can create mount targets for a file system in only one VPC, and there can be
 * only one mount target per Availability Zone. That is, if the file system already has one or more
 * mount targets created for it, the subnet specified in the request to add another mount target
 * must meet the following requirements:
 *
 * - Must belong to the same VPC as the subnets of the existing mount targets
 *
 * - Must not be in the same Availability Zone as any of the subnets of the existing mount
 * targets
 *
 * If the request satisfies the requirements, Amazon EFS does the following:
 *
 * - Creates a new mount target in the specified subnet.
 *
 * - Also creates a new network interface in the subnet as follows:
 *
 * - If the request provides an `IpAddress`, Amazon EFS assigns that
 * IP address to the network interface. Otherwise, Amazon EFS assigns a free
 * address in the subnet (in the same way that the Amazon EC2
 * `CreateNetworkInterface` call does when a request does not specify a
 * primary private IP address).
 *
 * - If the request provides `SecurityGroups`, this network interface is
 * associated with those security groups. Otherwise, it belongs to the default security
 * group for the subnet's VPC.
 *
 * - Assigns the description Mount target *fsmt-id* for
 * file system *fs-id*
 * where
 * *fsmt-id*
 * is the mount target ID, and
 * *fs-id*
 * is the `FileSystemId`.
 *
 * - Sets the `requesterManaged` property of the network interface to
 * `true`, and the `requesterId` value to
 * `EFS`.
 *
 * Each Amazon EFS mount target has one corresponding requester-managed
 * EC2 network interface. After the network interface is created, Amazon EFS
 * sets the `NetworkInterfaceId` field in the mount target's description to
 * the network interface ID, and the `IpAddress` field to its address. If network
 * interface creation fails, the entire `CreateMountTarget` operation
 * fails.
 *
 * The `CreateMountTarget` call returns only after creating the network
 * interface, but while the mount target state is still `creating`, you can check
 * the mount target creation status by calling the DescribeMountTargets operation, which among other things returns the mount
 * target state.
 *
 * We recommend that you create a mount target in each of the Availability Zones. There are cost
 * considerations for using a file system in an Availability Zone through a mount target created in
 * another Availability Zone. For more information, see Amazon EFS pricing. In addition, by always using a mount target local to the
 * instance's Availability Zone, you eliminate a partial failure scenario. If the Availability Zone in
 * which your mount target is created goes down, then you can't access your file system
 * through that mount target.
 *
 * This operation requires permissions for the following action on the file
 * system:
 *
 * - `elasticfilesystem:CreateMountTarget`
 *
 * This operation also requires permissions for the following Amazon EC2
 * actions:
 *
 * - `ec2:DescribeSubnets`
 *
 * - `ec2:DescribeNetworkInterfaces`
 *
 * - `ec2:CreateNetworkInterface`
 */
export const createMountTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMountTargetRequest,
  output: MountTargetDescription,
  errors: [
    AvailabilityZonesMismatch,
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
    IpAddressInUse,
    MountTargetConflict,
    NetworkInterfaceLimitExceeded,
    NoFreeAddressesInSubnet,
    SecurityGroupLimitExceeded,
    SecurityGroupNotFound,
    SubnetNotFound,
    UnsupportedAvailabilityZone,
  ],
}));
