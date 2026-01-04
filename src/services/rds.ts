import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://rds.amazonaws.com/doc/2014-10-31/");
const svc = T.AwsApiService({ sdkId: "RDS", serviceShapeName: "AmazonRDSv19" });
const auth = T.AwsAuthSigv4({ name: "rds" });
const ver = T.ServiceVersion("2014-10-31");
const proto = T.AwsProtocolsAwsQuery();
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
                        url: "https://rds-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      ],
                      endpoint: {
                        url: "https://rds.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://rds-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://rds.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://rds.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeAccountAttributesMessage extends S.Class<DescribeAccountAttributesMessage>(
  "DescribeAccountAttributesMessage",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const StringList = S.Array(S.String);
export const AvailabilityZones = S.Array(
  S.String.pipe(T.XmlName("AvailabilityZone")),
);
export const VpcSecurityGroupIdList = S.Array(
  S.String.pipe(T.XmlName("VpcSecurityGroupId")),
);
export const LogTypeList = S.Array(S.String);
export const DBSecurityGroupNameList = S.Array(
  S.String.pipe(T.XmlName("DBSecurityGroupName")),
);
export const SubnetIdentifierList = S.Array(
  S.String.pipe(T.XmlName("SubnetIdentifier")),
);
export const EventCategoriesList = S.Array(
  S.String.pipe(T.XmlName("EventCategory")),
);
export const SourceIdsList = S.Array(S.String.pipe(T.XmlName("SourceId")));
export const AttributeValueList = S.Array(
  S.String.pipe(T.XmlName("AttributeValue")),
);
export const OptionNamesList = S.Array(S.String);
export const KeyList = S.Array(S.String);
export class AddRoleToDBClusterMessage extends S.Class<AddRoleToDBClusterMessage>(
  "AddRoleToDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    RoleArn: S.String,
    FeatureName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddRoleToDBClusterResponse extends S.Class<AddRoleToDBClusterResponse>(
  "AddRoleToDBClusterResponse",
)({}, ns) {}
export class AddRoleToDBInstanceMessage extends S.Class<AddRoleToDBInstanceMessage>(
  "AddRoleToDBInstanceMessage",
)(
  { DBInstanceIdentifier: S.String, RoleArn: S.String, FeatureName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddRoleToDBInstanceResponse extends S.Class<AddRoleToDBInstanceResponse>(
  "AddRoleToDBInstanceResponse",
)({}, ns) {}
export class AddSourceIdentifierToSubscriptionMessage extends S.Class<AddSourceIdentifierToSubscriptionMessage>(
  "AddSourceIdentifierToSubscriptionMessage",
)(
  { SubscriptionName: S.String, SourceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ApplyPendingMaintenanceActionMessage extends S.Class<ApplyPendingMaintenanceActionMessage>(
  "ApplyPendingMaintenanceActionMessage",
)(
  { ResourceIdentifier: S.String, ApplyAction: S.String, OptInType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AuthorizeDBSecurityGroupIngressMessage extends S.Class<AuthorizeDBSecurityGroupIngressMessage>(
  "AuthorizeDBSecurityGroupIngressMessage",
)(
  {
    DBSecurityGroupName: S.String,
    CIDRIP: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
    EC2SecurityGroupId: S.optional(S.String),
    EC2SecurityGroupOwnerId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BacktrackDBClusterMessage extends S.Class<BacktrackDBClusterMessage>(
  "BacktrackDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    BacktrackTo: S.Date.pipe(T.TimestampFormat("date-time")),
    Force: S.optional(S.Boolean),
    UseEarliestTimeOnPointInTimeUnavailable: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelExportTaskMessage extends S.Class<CancelExportTaskMessage>(
  "CancelExportTaskMessage",
)(
  { ExportTaskIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag.pipe(T.XmlName("Tag")));
export class CopyDBClusterParameterGroupMessage extends S.Class<CopyDBClusterParameterGroupMessage>(
  "CopyDBClusterParameterGroupMessage",
)(
  {
    SourceDBClusterParameterGroupIdentifier: S.String,
    TargetDBClusterParameterGroupIdentifier: S.String,
    TargetDBClusterParameterGroupDescription: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopyDBClusterSnapshotMessage extends S.Class<CopyDBClusterSnapshotMessage>(
  "CopyDBClusterSnapshotMessage",
)(
  {
    SourceDBClusterSnapshotIdentifier: S.String,
    TargetDBClusterSnapshotIdentifier: S.String,
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
    CopyTags: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopyDBParameterGroupMessage extends S.Class<CopyDBParameterGroupMessage>(
  "CopyDBParameterGroupMessage",
)(
  {
    SourceDBParameterGroupIdentifier: S.String,
    TargetDBParameterGroupIdentifier: S.String,
    TargetDBParameterGroupDescription: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopyDBSnapshotMessage extends S.Class<CopyDBSnapshotMessage>(
  "CopyDBSnapshotMessage",
)(
  {
    SourceDBSnapshotIdentifier: S.String,
    TargetDBSnapshotIdentifier: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
    CopyTags: S.optional(S.Boolean),
    PreSignedUrl: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    TargetCustomAvailabilityZone: S.optional(S.String),
    SnapshotTarget: S.optional(S.String),
    CopyOptionGroup: S.optional(S.Boolean),
    SnapshotAvailabilityZone: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopyOptionGroupMessage extends S.Class<CopyOptionGroupMessage>(
  "CopyOptionGroupMessage",
)(
  {
    SourceOptionGroupIdentifier: S.String,
    TargetOptionGroupIdentifier: S.String,
    TargetOptionGroupDescription: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBlueGreenDeploymentRequest extends S.Class<CreateBlueGreenDeploymentRequest>(
  "CreateBlueGreenDeploymentRequest",
)(
  {
    BlueGreenDeploymentName: S.String,
    Source: S.String,
    TargetEngineVersion: S.optional(S.String),
    TargetDBParameterGroupName: S.optional(S.String),
    TargetDBClusterParameterGroupName: S.optional(S.String),
    Tags: S.optional(TagList),
    TargetDBInstanceClass: S.optional(S.String),
    UpgradeTargetStorageConfig: S.optional(S.Boolean),
    TargetIops: S.optional(S.Number),
    TargetStorageType: S.optional(S.String),
    TargetAllocatedStorage: S.optional(S.Number),
    TargetStorageThroughput: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCustomDBEngineVersionMessage extends S.Class<CreateCustomDBEngineVersionMessage>(
  "CreateCustomDBEngineVersionMessage",
)(
  {
    Engine: S.String,
    EngineVersion: S.String,
    DatabaseInstallationFilesS3BucketName: S.optional(S.String),
    DatabaseInstallationFilesS3Prefix: S.optional(S.String),
    ImageId: S.optional(S.String),
    KMSKeyId: S.optional(S.String),
    SourceCustomDbEngineVersionIdentifier: S.optional(S.String),
    UseAwsProvidedLatestImage: S.optional(S.Boolean),
    Description: S.optional(S.String),
    Manifest: S.optional(S.String),
    Tags: S.optional(TagList),
    DatabaseInstallationFiles: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBClusterEndpointMessage extends S.Class<CreateDBClusterEndpointMessage>(
  "CreateDBClusterEndpointMessage",
)(
  {
    DBClusterIdentifier: S.String,
    DBClusterEndpointIdentifier: S.String,
    EndpointType: S.String,
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBClusterParameterGroupMessage extends S.Class<CreateDBClusterParameterGroupMessage>(
  "CreateDBClusterParameterGroupMessage",
)(
  {
    DBClusterParameterGroupName: S.String,
    DBParameterGroupFamily: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBClusterSnapshotMessage extends S.Class<CreateDBClusterSnapshotMessage>(
  "CreateDBClusterSnapshotMessage",
)(
  {
    DBClusterSnapshotIdentifier: S.String,
    DBClusterIdentifier: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ProcessorFeature extends S.Class<ProcessorFeature>(
  "ProcessorFeature",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const ProcessorFeatureList = S.Array(
  ProcessorFeature.pipe(T.XmlName("ProcessorFeature")),
);
export class TagSpecification extends S.Class<TagSpecification>(
  "TagSpecification",
)({ ResourceType: S.optional(S.String), Tags: S.optional(TagList) }) {}
export const TagSpecificationList = S.Array(
  TagSpecification.pipe(T.XmlName("item")),
);
export class AdditionalStorageVolume extends S.Class<AdditionalStorageVolume>(
  "AdditionalStorageVolume",
)({
  VolumeName: S.String,
  AllocatedStorage: S.optional(S.Number),
  IOPS: S.optional(S.Number),
  MaxAllocatedStorage: S.optional(S.Number),
  StorageThroughput: S.optional(S.Number),
  StorageType: S.optional(S.String),
}) {}
export const AdditionalStorageVolumesList = S.Array(AdditionalStorageVolume);
export class CreateDBInstanceReadReplicaMessage extends S.Class<CreateDBInstanceReadReplicaMessage>(
  "CreateDBInstanceReadReplicaMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    SourceDBInstanceIdentifier: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    Port: S.optional(S.Number),
    MultiAZ: S.optional(S.Boolean),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    Iops: S.optional(S.Number),
    StorageThroughput: S.optional(S.Number),
    OptionGroupName: S.optional(S.String),
    DBParameterGroupName: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    DBSubnetGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    StorageType: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    DatabaseInsightsMode: S.optional(S.String),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    ProcessorFeatures: S.optional(ProcessorFeatureList),
    UseDefaultProcessorFeatures: S.optional(S.Boolean),
    DeletionProtection: S.optional(S.Boolean),
    Domain: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    DomainFqdn: S.optional(S.String),
    DomainOu: S.optional(S.String),
    DomainAuthSecretArn: S.optional(S.String),
    DomainDnsIps: S.optional(StringList),
    ReplicaMode: S.optional(S.String),
    EnableCustomerOwnedIp: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    MaxAllocatedStorage: S.optional(S.Number),
    BackupTarget: S.optional(S.String),
    CustomIamInstanceProfile: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    SourceDBClusterIdentifier: S.optional(S.String),
    DedicatedLogVolume: S.optional(S.Boolean),
    UpgradeStorageConfig: S.optional(S.Boolean),
    CACertificateIdentifier: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
    AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBParameterGroupMessage extends S.Class<CreateDBParameterGroupMessage>(
  "CreateDBParameterGroupMessage",
)(
  {
    DBParameterGroupName: S.String,
    DBParameterGroupFamily: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBProxyEndpointRequest extends S.Class<CreateDBProxyEndpointRequest>(
  "CreateDBProxyEndpointRequest",
)(
  {
    DBProxyName: S.String,
    DBProxyEndpointName: S.String,
    VpcSubnetIds: StringList,
    VpcSecurityGroupIds: S.optional(StringList),
    TargetRole: S.optional(S.String),
    Tags: S.optional(TagList),
    EndpointNetworkType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBSecurityGroupMessage extends S.Class<CreateDBSecurityGroupMessage>(
  "CreateDBSecurityGroupMessage",
)(
  {
    DBSecurityGroupName: S.String,
    DBSecurityGroupDescription: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBShardGroupMessage extends S.Class<CreateDBShardGroupMessage>(
  "CreateDBShardGroupMessage",
)(
  {
    DBShardGroupIdentifier: S.String,
    DBClusterIdentifier: S.String,
    ComputeRedundancy: S.optional(S.Number),
    MaxACU: S.Number,
    MinACU: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBSnapshotMessage extends S.Class<CreateDBSnapshotMessage>(
  "CreateDBSnapshotMessage",
)(
  {
    DBSnapshotIdentifier: S.String,
    DBInstanceIdentifier: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBSubnetGroupMessage extends S.Class<CreateDBSubnetGroupMessage>(
  "CreateDBSubnetGroupMessage",
)(
  {
    DBSubnetGroupName: S.String,
    DBSubnetGroupDescription: S.String,
    SubnetIds: SubnetIdentifierList,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEventSubscriptionMessage extends S.Class<CreateEventSubscriptionMessage>(
  "CreateEventSubscriptionMessage",
)(
  {
    SubscriptionName: S.String,
    SnsTopicArn: S.String,
    SourceType: S.optional(S.String),
    EventCategories: S.optional(EventCategoriesList),
    SourceIds: S.optional(SourceIdsList),
    Enabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGlobalClusterMessage extends S.Class<CreateGlobalClusterMessage>(
  "CreateGlobalClusterMessage",
)(
  {
    GlobalClusterIdentifier: S.String,
    SourceDBClusterIdentifier: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    EngineLifecycleSupport: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    DatabaseName: S.optional(S.String),
    StorageEncrypted: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateOptionGroupMessage extends S.Class<CreateOptionGroupMessage>(
  "CreateOptionGroupMessage",
)(
  {
    OptionGroupName: S.String,
    EngineName: S.String,
    MajorEngineVersion: S.String,
    OptionGroupDescription: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTenantDatabaseMessage extends S.Class<CreateTenantDatabaseMessage>(
  "CreateTenantDatabaseMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    TenantDBName: S.String,
    MasterUsername: S.String,
    MasterUserPassword: S.optional(S.String),
    CharacterSetName: S.optional(S.String),
    NcharCharacterSetName: S.optional(S.String),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBlueGreenDeploymentRequest extends S.Class<DeleteBlueGreenDeploymentRequest>(
  "DeleteBlueGreenDeploymentRequest",
)(
  {
    BlueGreenDeploymentIdentifier: S.String,
    DeleteTarget: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCustomDBEngineVersionMessage extends S.Class<DeleteCustomDBEngineVersionMessage>(
  "DeleteCustomDBEngineVersionMessage",
)(
  { Engine: S.String, EngineVersion: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBClusterMessage extends S.Class<DeleteDBClusterMessage>(
  "DeleteDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    SkipFinalSnapshot: S.optional(S.Boolean),
    FinalDBSnapshotIdentifier: S.optional(S.String),
    DeleteAutomatedBackups: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBClusterAutomatedBackupMessage extends S.Class<DeleteDBClusterAutomatedBackupMessage>(
  "DeleteDBClusterAutomatedBackupMessage",
)(
  { DbClusterResourceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBClusterEndpointMessage extends S.Class<DeleteDBClusterEndpointMessage>(
  "DeleteDBClusterEndpointMessage",
)(
  { DBClusterEndpointIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBClusterParameterGroupMessage extends S.Class<DeleteDBClusterParameterGroupMessage>(
  "DeleteDBClusterParameterGroupMessage",
)(
  { DBClusterParameterGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBClusterParameterGroupResponse extends S.Class<DeleteDBClusterParameterGroupResponse>(
  "DeleteDBClusterParameterGroupResponse",
)({}, ns) {}
export class DeleteDBClusterSnapshotMessage extends S.Class<DeleteDBClusterSnapshotMessage>(
  "DeleteDBClusterSnapshotMessage",
)(
  { DBClusterSnapshotIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBInstanceMessage extends S.Class<DeleteDBInstanceMessage>(
  "DeleteDBInstanceMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    SkipFinalSnapshot: S.optional(S.Boolean),
    FinalDBSnapshotIdentifier: S.optional(S.String),
    DeleteAutomatedBackups: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBInstanceAutomatedBackupMessage extends S.Class<DeleteDBInstanceAutomatedBackupMessage>(
  "DeleteDBInstanceAutomatedBackupMessage",
)(
  {
    DbiResourceId: S.optional(S.String),
    DBInstanceAutomatedBackupsArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBParameterGroupMessage extends S.Class<DeleteDBParameterGroupMessage>(
  "DeleteDBParameterGroupMessage",
)(
  { DBParameterGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBParameterGroupResponse extends S.Class<DeleteDBParameterGroupResponse>(
  "DeleteDBParameterGroupResponse",
)({}, ns) {}
export class DeleteDBProxyRequest extends S.Class<DeleteDBProxyRequest>(
  "DeleteDBProxyRequest",
)(
  { DBProxyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBProxyEndpointRequest extends S.Class<DeleteDBProxyEndpointRequest>(
  "DeleteDBProxyEndpointRequest",
)(
  { DBProxyEndpointName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBSecurityGroupMessage extends S.Class<DeleteDBSecurityGroupMessage>(
  "DeleteDBSecurityGroupMessage",
)(
  { DBSecurityGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBSecurityGroupResponse extends S.Class<DeleteDBSecurityGroupResponse>(
  "DeleteDBSecurityGroupResponse",
)({}, ns) {}
export class DeleteDBShardGroupMessage extends S.Class<DeleteDBShardGroupMessage>(
  "DeleteDBShardGroupMessage",
)(
  { DBShardGroupIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBSnapshotMessage extends S.Class<DeleteDBSnapshotMessage>(
  "DeleteDBSnapshotMessage",
)(
  { DBSnapshotIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBSubnetGroupMessage extends S.Class<DeleteDBSubnetGroupMessage>(
  "DeleteDBSubnetGroupMessage",
)(
  { DBSubnetGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBSubnetGroupResponse extends S.Class<DeleteDBSubnetGroupResponse>(
  "DeleteDBSubnetGroupResponse",
)({}, ns) {}
export class DeleteEventSubscriptionMessage extends S.Class<DeleteEventSubscriptionMessage>(
  "DeleteEventSubscriptionMessage",
)(
  { SubscriptionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGlobalClusterMessage extends S.Class<DeleteGlobalClusterMessage>(
  "DeleteGlobalClusterMessage",
)(
  { GlobalClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIntegrationMessage extends S.Class<DeleteIntegrationMessage>(
  "DeleteIntegrationMessage",
)(
  { IntegrationIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOptionGroupMessage extends S.Class<DeleteOptionGroupMessage>(
  "DeleteOptionGroupMessage",
)(
  { OptionGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOptionGroupResponse extends S.Class<DeleteOptionGroupResponse>(
  "DeleteOptionGroupResponse",
)({}, ns) {}
export class DeleteTenantDatabaseMessage extends S.Class<DeleteTenantDatabaseMessage>(
  "DeleteTenantDatabaseMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    TenantDBName: S.String,
    SkipFinalSnapshot: S.optional(S.Boolean),
    FinalDBSnapshotIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterDBProxyTargetsRequest extends S.Class<DeregisterDBProxyTargetsRequest>(
  "DeregisterDBProxyTargetsRequest",
)(
  {
    DBProxyName: S.String,
    TargetGroupName: S.optional(S.String),
    DBInstanceIdentifiers: S.optional(StringList),
    DBClusterIdentifiers: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterDBProxyTargetsResponse extends S.Class<DeregisterDBProxyTargetsResponse>(
  "DeregisterDBProxyTargetsResponse",
)({}, ns) {}
export const FilterValueList = S.Array(S.String.pipe(T.XmlName("Value")));
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.String,
  Values: FilterValueList,
}) {}
export const FilterList = S.Array(Filter.pipe(T.XmlName("Filter")));
export class DescribeCertificatesMessage extends S.Class<DescribeCertificatesMessage>(
  "DescribeCertificatesMessage",
)(
  {
    CertificateIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterAutomatedBackupsMessage extends S.Class<DescribeDBClusterAutomatedBackupsMessage>(
  "DescribeDBClusterAutomatedBackupsMessage",
)(
  {
    DbClusterResourceId: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterBacktracksMessage extends S.Class<DescribeDBClusterBacktracksMessage>(
  "DescribeDBClusterBacktracksMessage",
)(
  {
    DBClusterIdentifier: S.String,
    BacktrackIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterEndpointsMessage extends S.Class<DescribeDBClusterEndpointsMessage>(
  "DescribeDBClusterEndpointsMessage",
)(
  {
    DBClusterIdentifier: S.optional(S.String),
    DBClusterEndpointIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterParameterGroupsMessage extends S.Class<DescribeDBClusterParameterGroupsMessage>(
  "DescribeDBClusterParameterGroupsMessage",
)(
  {
    DBClusterParameterGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterParametersMessage extends S.Class<DescribeDBClusterParametersMessage>(
  "DescribeDBClusterParametersMessage",
)(
  {
    DBClusterParameterGroupName: S.String,
    Source: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClustersMessage extends S.Class<DescribeDBClustersMessage>(
  "DescribeDBClustersMessage",
)(
  {
    DBClusterIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    IncludeShared: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterSnapshotAttributesMessage extends S.Class<DescribeDBClusterSnapshotAttributesMessage>(
  "DescribeDBClusterSnapshotAttributesMessage",
)(
  { DBClusterSnapshotIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterSnapshotsMessage extends S.Class<DescribeDBClusterSnapshotsMessage>(
  "DescribeDBClusterSnapshotsMessage",
)(
  {
    DBClusterIdentifier: S.optional(S.String),
    DBClusterSnapshotIdentifier: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    IncludeShared: S.optional(S.Boolean),
    IncludePublic: S.optional(S.Boolean),
    DbClusterResourceId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBEngineVersionsMessage extends S.Class<DescribeDBEngineVersionsMessage>(
  "DescribeDBEngineVersionsMessage",
)(
  {
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DBParameterGroupFamily: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    DefaultOnly: S.optional(S.Boolean),
    ListSupportedCharacterSets: S.optional(S.Boolean),
    ListSupportedTimezones: S.optional(S.Boolean),
    IncludeAll: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBInstanceAutomatedBackupsMessage extends S.Class<DescribeDBInstanceAutomatedBackupsMessage>(
  "DescribeDBInstanceAutomatedBackupsMessage",
)(
  {
    DbiResourceId: S.optional(S.String),
    DBInstanceIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    DBInstanceAutomatedBackupsArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBInstancesMessage extends S.Class<DescribeDBInstancesMessage>(
  "DescribeDBInstancesMessage",
)(
  {
    DBInstanceIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBLogFilesMessage extends S.Class<DescribeDBLogFilesMessage>(
  "DescribeDBLogFilesMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    FilenameContains: S.optional(S.String),
    FileLastWritten: S.optional(S.Number),
    FileSize: S.optional(S.Number),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBMajorEngineVersionsRequest extends S.Class<DescribeDBMajorEngineVersionsRequest>(
  "DescribeDBMajorEngineVersionsRequest",
)(
  {
    Engine: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBParameterGroupsMessage extends S.Class<DescribeDBParameterGroupsMessage>(
  "DescribeDBParameterGroupsMessage",
)(
  {
    DBParameterGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBParametersMessage extends S.Class<DescribeDBParametersMessage>(
  "DescribeDBParametersMessage",
)(
  {
    DBParameterGroupName: S.String,
    Source: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBProxiesRequest extends S.Class<DescribeDBProxiesRequest>(
  "DescribeDBProxiesRequest",
)(
  {
    DBProxyName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBProxyEndpointsRequest extends S.Class<DescribeDBProxyEndpointsRequest>(
  "DescribeDBProxyEndpointsRequest",
)(
  {
    DBProxyName: S.optional(S.String),
    DBProxyEndpointName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBProxyTargetGroupsRequest extends S.Class<DescribeDBProxyTargetGroupsRequest>(
  "DescribeDBProxyTargetGroupsRequest",
)(
  {
    DBProxyName: S.String,
    TargetGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBProxyTargetsRequest extends S.Class<DescribeDBProxyTargetsRequest>(
  "DescribeDBProxyTargetsRequest",
)(
  {
    DBProxyName: S.String,
    TargetGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBRecommendationsMessage extends S.Class<DescribeDBRecommendationsMessage>(
  "DescribeDBRecommendationsMessage",
)(
  {
    LastUpdatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Locale: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBSecurityGroupsMessage extends S.Class<DescribeDBSecurityGroupsMessage>(
  "DescribeDBSecurityGroupsMessage",
)(
  {
    DBSecurityGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBShardGroupsMessage extends S.Class<DescribeDBShardGroupsMessage>(
  "DescribeDBShardGroupsMessage",
)(
  {
    DBShardGroupIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBSnapshotAttributesMessage extends S.Class<DescribeDBSnapshotAttributesMessage>(
  "DescribeDBSnapshotAttributesMessage",
)(
  { DBSnapshotIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBSnapshotsMessage extends S.Class<DescribeDBSnapshotsMessage>(
  "DescribeDBSnapshotsMessage",
)(
  {
    DBInstanceIdentifier: S.optional(S.String),
    DBSnapshotIdentifier: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    IncludeShared: S.optional(S.Boolean),
    IncludePublic: S.optional(S.Boolean),
    DbiResourceId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBSnapshotTenantDatabasesMessage extends S.Class<DescribeDBSnapshotTenantDatabasesMessage>(
  "DescribeDBSnapshotTenantDatabasesMessage",
)(
  {
    DBInstanceIdentifier: S.optional(S.String),
    DBSnapshotIdentifier: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    DbiResourceId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBSubnetGroupsMessage extends S.Class<DescribeDBSubnetGroupsMessage>(
  "DescribeDBSubnetGroupsMessage",
)(
  {
    DBSubnetGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEngineDefaultClusterParametersMessage extends S.Class<DescribeEngineDefaultClusterParametersMessage>(
  "DescribeEngineDefaultClusterParametersMessage",
)(
  {
    DBParameterGroupFamily: S.String,
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEngineDefaultParametersMessage extends S.Class<DescribeEngineDefaultParametersMessage>(
  "DescribeEngineDefaultParametersMessage",
)(
  {
    DBParameterGroupFamily: S.String,
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventCategoriesMessage extends S.Class<DescribeEventCategoriesMessage>(
  "DescribeEventCategoriesMessage",
)(
  { SourceType: S.optional(S.String), Filters: S.optional(FilterList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventsMessage extends S.Class<DescribeEventsMessage>(
  "DescribeEventsMessage",
)(
  {
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Duration: S.optional(S.Number),
    EventCategories: S.optional(EventCategoriesList),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventSubscriptionsMessage extends S.Class<DescribeEventSubscriptionsMessage>(
  "DescribeEventSubscriptionsMessage",
)(
  {
    SubscriptionName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExportTasksMessage extends S.Class<DescribeExportTasksMessage>(
  "DescribeExportTasksMessage",
)(
  {
    ExportTaskIdentifier: S.optional(S.String),
    SourceArn: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    SourceType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGlobalClustersMessage extends S.Class<DescribeGlobalClustersMessage>(
  "DescribeGlobalClustersMessage",
)(
  {
    GlobalClusterIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeIntegrationsMessage extends S.Class<DescribeIntegrationsMessage>(
  "DescribeIntegrationsMessage",
)(
  {
    IntegrationIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOptionGroupOptionsMessage extends S.Class<DescribeOptionGroupOptionsMessage>(
  "DescribeOptionGroupOptionsMessage",
)(
  {
    EngineName: S.String,
    MajorEngineVersion: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOptionGroupsMessage extends S.Class<DescribeOptionGroupsMessage>(
  "DescribeOptionGroupsMessage",
)(
  {
    OptionGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    EngineName: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrderableDBInstanceOptionsMessage extends S.Class<DescribeOrderableDBInstanceOptionsMessage>(
  "DescribeOrderableDBInstanceOptionsMessage",
)(
  {
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    AvailabilityZoneGroup: S.optional(S.String),
    Vpc: S.optional(S.Boolean),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePendingMaintenanceActionsMessage extends S.Class<DescribePendingMaintenanceActionsMessage>(
  "DescribePendingMaintenanceActionsMessage",
)(
  {
    ResourceIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReservedDBInstancesMessage extends S.Class<DescribeReservedDBInstancesMessage>(
  "DescribeReservedDBInstancesMessage",
)(
  {
    ReservedDBInstanceId: S.optional(S.String),
    ReservedDBInstancesOfferingId: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    Duration: S.optional(S.String),
    ProductDescription: S.optional(S.String),
    OfferingType: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    LeaseId: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReservedDBInstancesOfferingsMessage extends S.Class<DescribeReservedDBInstancesOfferingsMessage>(
  "DescribeReservedDBInstancesOfferingsMessage",
)(
  {
    ReservedDBInstancesOfferingId: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    Duration: S.optional(S.String),
    ProductDescription: S.optional(S.String),
    OfferingType: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSourceRegionsMessage extends S.Class<DescribeSourceRegionsMessage>(
  "DescribeSourceRegionsMessage",
)(
  {
    RegionName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    Filters: S.optional(FilterList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTenantDatabasesMessage extends S.Class<DescribeTenantDatabasesMessage>(
  "DescribeTenantDatabasesMessage",
)(
  {
    DBInstanceIdentifier: S.optional(S.String),
    TenantDBName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeValidDBInstanceModificationsMessage extends S.Class<DescribeValidDBInstanceModificationsMessage>(
  "DescribeValidDBInstanceModificationsMessage",
)(
  { DBInstanceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableHttpEndpointRequest extends S.Class<DisableHttpEndpointRequest>(
  "DisableHttpEndpointRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DownloadDBLogFilePortionMessage extends S.Class<DownloadDBLogFilePortionMessage>(
  "DownloadDBLogFilePortionMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    LogFileName: S.String,
    Marker: S.optional(S.String),
    NumberOfLines: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableHttpEndpointRequest extends S.Class<EnableHttpEndpointRequest>(
  "EnableHttpEndpointRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FailoverDBClusterMessage extends S.Class<FailoverDBClusterMessage>(
  "FailoverDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    TargetDBInstanceIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FailoverGlobalClusterMessage extends S.Class<FailoverGlobalClusterMessage>(
  "FailoverGlobalClusterMessage",
)(
  {
    GlobalClusterIdentifier: S.String,
    TargetDbClusterIdentifier: S.String,
    AllowDataLoss: S.optional(S.Boolean),
    Switchover: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceMessage extends S.Class<ListTagsForResourceMessage>(
  "ListTagsForResourceMessage",
)(
  { ResourceName: S.String, Filters: S.optional(FilterList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyActivityStreamRequest extends S.Class<ModifyActivityStreamRequest>(
  "ModifyActivityStreamRequest",
)(
  { ResourceArn: S.optional(S.String), AuditPolicyState: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyCertificatesMessage extends S.Class<ModifyCertificatesMessage>(
  "ModifyCertificatesMessage",
)(
  {
    CertificateIdentifier: S.optional(S.String),
    RemoveCustomerOverride: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyCurrentDBClusterCapacityMessage extends S.Class<ModifyCurrentDBClusterCapacityMessage>(
  "ModifyCurrentDBClusterCapacityMessage",
)(
  {
    DBClusterIdentifier: S.String,
    Capacity: S.optional(S.Number),
    SecondsBeforeTimeout: S.optional(S.Number),
    TimeoutAction: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyCustomDBEngineVersionMessage extends S.Class<ModifyCustomDBEngineVersionMessage>(
  "ModifyCustomDBEngineVersionMessage",
)(
  {
    Engine: S.String,
    EngineVersion: S.String,
    Description: S.optional(S.String),
    Status: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBClusterEndpointMessage extends S.Class<ModifyDBClusterEndpointMessage>(
  "ModifyDBClusterEndpointMessage",
)(
  {
    DBClusterEndpointIdentifier: S.String,
    EndpointType: S.optional(S.String),
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBClusterSnapshotAttributeMessage extends S.Class<ModifyDBClusterSnapshotAttributeMessage>(
  "ModifyDBClusterSnapshotAttributeMessage",
)(
  {
    DBClusterSnapshotIdentifier: S.String,
    AttributeName: S.String,
    ValuesToAdd: S.optional(AttributeValueList),
    ValuesToRemove: S.optional(AttributeValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const EngineModeList = S.Array(S.String);
export class Parameter extends S.Class<Parameter>("Parameter")({
  ParameterName: S.optional(S.String),
  ParameterValue: S.optional(S.String),
  Description: S.optional(S.String),
  Source: S.optional(S.String),
  ApplyType: S.optional(S.String),
  DataType: S.optional(S.String),
  AllowedValues: S.optional(S.String),
  IsModifiable: S.optional(S.Boolean),
  MinimumEngineVersion: S.optional(S.String),
  ApplyMethod: S.optional(S.String),
  SupportedEngineModes: S.optional(EngineModeList),
}) {}
export const ParametersList = S.Array(Parameter.pipe(T.XmlName("Parameter")));
export class ModifyDBParameterGroupMessage extends S.Class<ModifyDBParameterGroupMessage>(
  "ModifyDBParameterGroupMessage",
)(
  { DBParameterGroupName: S.String, Parameters: ParametersList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UserAuthConfig extends S.Class<UserAuthConfig>("UserAuthConfig")({
  Description: S.optional(S.String),
  UserName: S.optional(S.String),
  AuthScheme: S.optional(S.String),
  SecretArn: S.optional(S.String),
  IAMAuth: S.optional(S.String),
  ClientPasswordAuthType: S.optional(S.String),
}) {}
export const UserAuthConfigList = S.Array(UserAuthConfig);
export class ModifyDBProxyRequest extends S.Class<ModifyDBProxyRequest>(
  "ModifyDBProxyRequest",
)(
  {
    DBProxyName: S.String,
    NewDBProxyName: S.optional(S.String),
    DefaultAuthScheme: S.optional(S.String),
    Auth: S.optional(UserAuthConfigList),
    RequireTLS: S.optional(S.Boolean),
    IdleClientTimeout: S.optional(S.Number),
    DebugLogging: S.optional(S.Boolean),
    RoleArn: S.optional(S.String),
    SecurityGroups: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBProxyEndpointRequest extends S.Class<ModifyDBProxyEndpointRequest>(
  "ModifyDBProxyEndpointRequest",
)(
  {
    DBProxyEndpointName: S.String,
    NewDBProxyEndpointName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBShardGroupMessage extends S.Class<ModifyDBShardGroupMessage>(
  "ModifyDBShardGroupMessage",
)(
  {
    DBShardGroupIdentifier: S.String,
    MaxACU: S.optional(S.Number),
    MinACU: S.optional(S.Number),
    ComputeRedundancy: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBSnapshotMessage extends S.Class<ModifyDBSnapshotMessage>(
  "ModifyDBSnapshotMessage",
)(
  {
    DBSnapshotIdentifier: S.String,
    EngineVersion: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBSnapshotAttributeMessage extends S.Class<ModifyDBSnapshotAttributeMessage>(
  "ModifyDBSnapshotAttributeMessage",
)(
  {
    DBSnapshotIdentifier: S.String,
    AttributeName: S.String,
    ValuesToAdd: S.optional(AttributeValueList),
    ValuesToRemove: S.optional(AttributeValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBSubnetGroupMessage extends S.Class<ModifyDBSubnetGroupMessage>(
  "ModifyDBSubnetGroupMessage",
)(
  {
    DBSubnetGroupName: S.String,
    DBSubnetGroupDescription: S.optional(S.String),
    SubnetIds: SubnetIdentifierList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyEventSubscriptionMessage extends S.Class<ModifyEventSubscriptionMessage>(
  "ModifyEventSubscriptionMessage",
)(
  {
    SubscriptionName: S.String,
    SnsTopicArn: S.optional(S.String),
    SourceType: S.optional(S.String),
    EventCategories: S.optional(EventCategoriesList),
    Enabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyGlobalClusterMessage extends S.Class<ModifyGlobalClusterMessage>(
  "ModifyGlobalClusterMessage",
)(
  {
    GlobalClusterIdentifier: S.String,
    NewGlobalClusterIdentifier: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyIntegrationMessage extends S.Class<ModifyIntegrationMessage>(
  "ModifyIntegrationMessage",
)(
  {
    IntegrationIdentifier: S.String,
    IntegrationName: S.optional(S.String),
    DataFilter: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyTenantDatabaseMessage extends S.Class<ModifyTenantDatabaseMessage>(
  "ModifyTenantDatabaseMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    TenantDBName: S.String,
    MasterUserPassword: S.optional(S.String),
    NewTenantDBName: S.optional(S.String),
    ManageMasterUserPassword: S.optional(S.Boolean),
    RotateMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PromoteReadReplicaMessage extends S.Class<PromoteReadReplicaMessage>(
  "PromoteReadReplicaMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    BackupRetentionPeriod: S.optional(S.Number),
    PreferredBackupWindow: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PromoteReadReplicaDBClusterMessage extends S.Class<PromoteReadReplicaDBClusterMessage>(
  "PromoteReadReplicaDBClusterMessage",
)(
  { DBClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PurchaseReservedDBInstancesOfferingMessage extends S.Class<PurchaseReservedDBInstancesOfferingMessage>(
  "PurchaseReservedDBInstancesOfferingMessage",
)(
  {
    ReservedDBInstancesOfferingId: S.String,
    ReservedDBInstanceId: S.optional(S.String),
    DBInstanceCount: S.optional(S.Number),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootDBClusterMessage extends S.Class<RebootDBClusterMessage>(
  "RebootDBClusterMessage",
)(
  { DBClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootDBInstanceMessage extends S.Class<RebootDBInstanceMessage>(
  "RebootDBInstanceMessage",
)(
  { DBInstanceIdentifier: S.String, ForceFailover: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootDBShardGroupMessage extends S.Class<RebootDBShardGroupMessage>(
  "RebootDBShardGroupMessage",
)(
  { DBShardGroupIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterDBProxyTargetsRequest extends S.Class<RegisterDBProxyTargetsRequest>(
  "RegisterDBProxyTargetsRequest",
)(
  {
    DBProxyName: S.String,
    TargetGroupName: S.optional(S.String),
    DBInstanceIdentifiers: S.optional(StringList),
    DBClusterIdentifiers: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveFromGlobalClusterMessage extends S.Class<RemoveFromGlobalClusterMessage>(
  "RemoveFromGlobalClusterMessage",
)(
  { GlobalClusterIdentifier: S.String, DbClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveRoleFromDBClusterMessage extends S.Class<RemoveRoleFromDBClusterMessage>(
  "RemoveRoleFromDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    RoleArn: S.String,
    FeatureName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveRoleFromDBClusterResponse extends S.Class<RemoveRoleFromDBClusterResponse>(
  "RemoveRoleFromDBClusterResponse",
)({}, ns) {}
export class RemoveRoleFromDBInstanceMessage extends S.Class<RemoveRoleFromDBInstanceMessage>(
  "RemoveRoleFromDBInstanceMessage",
)(
  { DBInstanceIdentifier: S.String, RoleArn: S.String, FeatureName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveRoleFromDBInstanceResponse extends S.Class<RemoveRoleFromDBInstanceResponse>(
  "RemoveRoleFromDBInstanceResponse",
)({}, ns) {}
export class RemoveSourceIdentifierFromSubscriptionMessage extends S.Class<RemoveSourceIdentifierFromSubscriptionMessage>(
  "RemoveSourceIdentifierFromSubscriptionMessage",
)(
  { SubscriptionName: S.String, SourceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromResourceMessage extends S.Class<RemoveTagsFromResourceMessage>(
  "RemoveTagsFromResourceMessage",
)(
  { ResourceName: S.String, TagKeys: KeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromResourceResponse extends S.Class<RemoveTagsFromResourceResponse>(
  "RemoveTagsFromResourceResponse",
)({}, ns) {}
export class ResetDBClusterParameterGroupMessage extends S.Class<ResetDBClusterParameterGroupMessage>(
  "ResetDBClusterParameterGroupMessage",
)(
  {
    DBClusterParameterGroupName: S.String,
    ResetAllParameters: S.optional(S.Boolean),
    Parameters: S.optional(ParametersList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResetDBParameterGroupMessage extends S.Class<ResetDBParameterGroupMessage>(
  "ResetDBParameterGroupMessage",
)(
  {
    DBParameterGroupName: S.String,
    ResetAllParameters: S.optional(S.Boolean),
    Parameters: S.optional(ParametersList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ServerlessV2ScalingConfiguration extends S.Class<ServerlessV2ScalingConfiguration>(
  "ServerlessV2ScalingConfiguration",
)({
  MinCapacity: S.optional(S.Number),
  MaxCapacity: S.optional(S.Number),
  SecondsUntilAutoPause: S.optional(S.Number),
}) {}
export class RestoreDBClusterFromS3Message extends S.Class<RestoreDBClusterFromS3Message>(
  "RestoreDBClusterFromS3Message",
)(
  {
    AvailabilityZones: S.optional(AvailabilityZones),
    BackupRetentionPeriod: S.optional(S.Number),
    CharacterSetName: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    DBClusterIdentifier: S.String,
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    DBSubnetGroupName: S.optional(S.String),
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    MasterUsername: S.String,
    MasterUserPassword: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    Tags: S.optional(TagList),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    SourceEngine: S.String,
    SourceEngineVersion: S.String,
    S3BucketName: S.String,
    S3Prefix: S.optional(S.String),
    S3IngestionRoleArn: S.String,
    BacktrackWindow: S.optional(S.Number),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    Domain: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    StorageType: S.optional(S.String),
    NetworkType: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    EngineLifecycleSupport: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ScalingConfiguration extends S.Class<ScalingConfiguration>(
  "ScalingConfiguration",
)({
  MinCapacity: S.optional(S.Number),
  MaxCapacity: S.optional(S.Number),
  AutoPause: S.optional(S.Boolean),
  SecondsUntilAutoPause: S.optional(S.Number),
  TimeoutAction: S.optional(S.String),
  SecondsBeforeTimeout: S.optional(S.Number),
}) {}
export class RdsCustomClusterConfiguration extends S.Class<RdsCustomClusterConfiguration>(
  "RdsCustomClusterConfiguration",
)({
  InterconnectSubnetId: S.optional(S.String),
  TransitGatewayMulticastDomainId: S.optional(S.String),
  ReplicaMode: S.optional(S.String),
}) {}
export class RestoreDBClusterFromSnapshotMessage extends S.Class<RestoreDBClusterFromSnapshotMessage>(
  "RestoreDBClusterFromSnapshotMessage",
)(
  {
    AvailabilityZones: S.optional(AvailabilityZones),
    DBClusterIdentifier: S.String,
    SnapshotIdentifier: S.String,
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    DBSubnetGroupName: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    BacktrackWindow: S.optional(S.Number),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    EngineMode: S.optional(S.String),
    ScalingConfiguration: S.optional(ScalingConfiguration),
    DBClusterParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    Domain: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    DBClusterInstanceClass: S.optional(S.String),
    StorageType: S.optional(S.String),
    Iops: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    RdsCustomClusterConfiguration: S.optional(RdsCustomClusterConfiguration),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    EngineLifecycleSupport: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreDBClusterToPointInTimeMessage extends S.Class<RestoreDBClusterToPointInTimeMessage>(
  "RestoreDBClusterToPointInTimeMessage",
)(
  {
    DBClusterIdentifier: S.String,
    RestoreType: S.optional(S.String),
    SourceDBClusterIdentifier: S.optional(S.String),
    RestoreToTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UseLatestRestorableTime: S.optional(S.Boolean),
    Port: S.optional(S.Number),
    DBSubnetGroupName: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    BacktrackWindow: S.optional(S.Number),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DBClusterParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    Domain: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    DBClusterInstanceClass: S.optional(S.String),
    StorageType: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    Iops: S.optional(S.Number),
    NetworkType: S.optional(S.String),
    SourceDbClusterResourceId: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    ScalingConfiguration: S.optional(ScalingConfiguration),
    EngineMode: S.optional(S.String),
    RdsCustomClusterConfiguration: S.optional(RdsCustomClusterConfiguration),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    EngineLifecycleSupport: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreDBInstanceFromDBSnapshotMessage extends S.Class<RestoreDBInstanceFromDBSnapshotMessage>(
  "RestoreDBInstanceFromDBSnapshotMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    DBSnapshotIdentifier: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    Port: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    DBSubnetGroupName: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    PubliclyAccessible: S.optional(S.Boolean),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    LicenseModel: S.optional(S.String),
    DBName: S.optional(S.String),
    Engine: S.optional(S.String),
    Iops: S.optional(S.Number),
    StorageThroughput: S.optional(S.Number),
    OptionGroupName: S.optional(S.String),
    Tags: S.optional(TagList),
    StorageType: S.optional(S.String),
    TdeCredentialArn: S.optional(S.String),
    TdeCredentialPassword: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Domain: S.optional(S.String),
    DomainFqdn: S.optional(S.String),
    DomainOu: S.optional(S.String),
    DomainAuthSecretArn: S.optional(S.String),
    DomainDnsIps: S.optional(StringList),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    DomainIAMRoleName: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    ProcessorFeatures: S.optional(ProcessorFeatureList),
    UseDefaultProcessorFeatures: S.optional(S.Boolean),
    DBParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    EnableCustomerOwnedIp: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    BackupTarget: S.optional(S.String),
    CustomIamInstanceProfile: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    DBClusterSnapshotIdentifier: S.optional(S.String),
    DedicatedLogVolume: S.optional(S.Boolean),
    CACertificateIdentifier: S.optional(S.String),
    EngineLifecycleSupport: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreDBInstanceFromS3Message extends S.Class<RestoreDBInstanceFromS3Message>(
  "RestoreDBInstanceFromS3Message",
)(
  {
    DBName: S.optional(S.String),
    DBInstanceIdentifier: S.String,
    AllocatedStorage: S.optional(S.Number),
    DBInstanceClass: S.String,
    Engine: S.String,
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(S.String),
    DBSecurityGroups: S.optional(DBSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    AvailabilityZone: S.optional(S.String),
    DBSubnetGroupName: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    DBParameterGroupName: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    PreferredBackupWindow: S.optional(S.String),
    Port: S.optional(S.Number),
    MultiAZ: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    LicenseModel: S.optional(S.String),
    Iops: S.optional(S.Number),
    StorageThroughput: S.optional(S.Number),
    OptionGroupName: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    StorageType: S.optional(S.String),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    SourceEngine: S.String,
    SourceEngineVersion: S.String,
    S3BucketName: S.String,
    S3Prefix: S.optional(S.String),
    S3IngestionRoleArn: S.String,
    DatabaseInsightsMode: S.optional(S.String),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    ProcessorFeatures: S.optional(ProcessorFeatureList),
    UseDefaultProcessorFeatures: S.optional(S.Boolean),
    DeletionProtection: S.optional(S.Boolean),
    MaxAllocatedStorage: S.optional(S.Number),
    NetworkType: S.optional(S.String),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    DedicatedLogVolume: S.optional(S.Boolean),
    CACertificateIdentifier: S.optional(S.String),
    EngineLifecycleSupport: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
    AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreDBInstanceToPointInTimeMessage extends S.Class<RestoreDBInstanceToPointInTimeMessage>(
  "RestoreDBInstanceToPointInTimeMessage",
)(
  {
    SourceDBInstanceIdentifier: S.optional(S.String),
    TargetDBInstanceIdentifier: S.String,
    RestoreTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UseLatestRestorableTime: S.optional(S.Boolean),
    DBInstanceClass: S.optional(S.String),
    Port: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    DBSubnetGroupName: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    PubliclyAccessible: S.optional(S.Boolean),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    LicenseModel: S.optional(S.String),
    DBName: S.optional(S.String),
    Engine: S.optional(S.String),
    Iops: S.optional(S.Number),
    StorageThroughput: S.optional(S.Number),
    OptionGroupName: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    StorageType: S.optional(S.String),
    TdeCredentialArn: S.optional(S.String),
    TdeCredentialPassword: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Domain: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    DomainFqdn: S.optional(S.String),
    DomainOu: S.optional(S.String),
    DomainAuthSecretArn: S.optional(S.String),
    DomainDnsIps: S.optional(StringList),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    ProcessorFeatures: S.optional(ProcessorFeatureList),
    UseDefaultProcessorFeatures: S.optional(S.Boolean),
    DBParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    SourceDbiResourceId: S.optional(S.String),
    MaxAllocatedStorage: S.optional(S.Number),
    EnableCustomerOwnedIp: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    SourceDBInstanceAutomatedBackupsArn: S.optional(S.String),
    BackupTarget: S.optional(S.String),
    CustomIamInstanceProfile: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    DedicatedLogVolume: S.optional(S.Boolean),
    CACertificateIdentifier: S.optional(S.String),
    EngineLifecycleSupport: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RevokeDBSecurityGroupIngressMessage extends S.Class<RevokeDBSecurityGroupIngressMessage>(
  "RevokeDBSecurityGroupIngressMessage",
)(
  {
    DBSecurityGroupName: S.String,
    CIDRIP: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
    EC2SecurityGroupId: S.optional(S.String),
    EC2SecurityGroupOwnerId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartActivityStreamRequest extends S.Class<StartActivityStreamRequest>(
  "StartActivityStreamRequest",
)(
  {
    ResourceArn: S.String,
    Mode: S.String,
    KmsKeyId: S.String,
    ApplyImmediately: S.optional(S.Boolean),
    EngineNativeAuditFieldsIncluded: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDBClusterMessage extends S.Class<StartDBClusterMessage>(
  "StartDBClusterMessage",
)(
  { DBClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDBInstanceMessage extends S.Class<StartDBInstanceMessage>(
  "StartDBInstanceMessage",
)(
  { DBInstanceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDBInstanceAutomatedBackupsReplicationMessage extends S.Class<StartDBInstanceAutomatedBackupsReplicationMessage>(
  "StartDBInstanceAutomatedBackupsReplicationMessage",
)(
  {
    SourceDBInstanceArn: S.String,
    BackupRetentionPeriod: S.optional(S.Number),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartExportTaskMessage extends S.Class<StartExportTaskMessage>(
  "StartExportTaskMessage",
)(
  {
    ExportTaskIdentifier: S.String,
    SourceArn: S.String,
    S3BucketName: S.String,
    IamRoleArn: S.String,
    KmsKeyId: S.String,
    S3Prefix: S.optional(S.String),
    ExportOnly: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopActivityStreamRequest extends S.Class<StopActivityStreamRequest>(
  "StopActivityStreamRequest",
)(
  { ResourceArn: S.String, ApplyImmediately: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDBClusterMessage extends S.Class<StopDBClusterMessage>(
  "StopDBClusterMessage",
)(
  { DBClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDBInstanceMessage extends S.Class<StopDBInstanceMessage>(
  "StopDBInstanceMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    DBSnapshotIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDBInstanceAutomatedBackupsReplicationMessage extends S.Class<StopDBInstanceAutomatedBackupsReplicationMessage>(
  "StopDBInstanceAutomatedBackupsReplicationMessage",
)(
  { SourceDBInstanceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SwitchoverBlueGreenDeploymentRequest extends S.Class<SwitchoverBlueGreenDeploymentRequest>(
  "SwitchoverBlueGreenDeploymentRequest",
)(
  {
    BlueGreenDeploymentIdentifier: S.String,
    SwitchoverTimeout: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SwitchoverGlobalClusterMessage extends S.Class<SwitchoverGlobalClusterMessage>(
  "SwitchoverGlobalClusterMessage",
)(
  { GlobalClusterIdentifier: S.String, TargetDbClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SwitchoverReadReplicaMessage extends S.Class<SwitchoverReadReplicaMessage>(
  "SwitchoverReadReplicaMessage",
)(
  { DBInstanceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CharacterSet extends S.Class<CharacterSet>("CharacterSet")({
  CharacterSetName: S.optional(S.String),
  CharacterSetDescription: S.optional(S.String),
}) {}
export const SupportedCharacterSetsList = S.Array(
  CharacterSet.pipe(T.XmlName("CharacterSet")),
);
export const FeatureNameList = S.Array(S.String);
export const CACertificateIdentifiersList = S.Array(S.String);
export const EncryptionContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export class AccountQuota extends S.Class<AccountQuota>("AccountQuota")({
  AccountQuotaName: S.optional(S.String),
  Used: S.optional(S.Number),
  Max: S.optional(S.Number),
}) {}
export const AccountQuotaList = S.Array(
  AccountQuota.pipe(T.XmlName("AccountQuota")),
);
export class RestoreWindow extends S.Class<RestoreWindow>("RestoreWindow")({
  EarliestTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LatestTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class DBClusterAutomatedBackup extends S.Class<DBClusterAutomatedBackup>(
  "DBClusterAutomatedBackup",
)({
  Engine: S.optional(S.String),
  VpcId: S.optional(S.String),
  DBClusterAutomatedBackupsArn: S.optional(S.String),
  DBClusterIdentifier: S.optional(S.String),
  RestoreWindow: S.optional(RestoreWindow),
  MasterUsername: S.optional(S.String),
  DbClusterResourceId: S.optional(S.String),
  Region: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  Status: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StorageEncrypted: S.optional(S.Boolean),
  AllocatedStorage: S.optional(S.Number),
  EngineVersion: S.optional(S.String),
  DBClusterArn: S.optional(S.String),
  BackupRetentionPeriod: S.optional(S.Number),
  EngineMode: S.optional(S.String),
  AvailabilityZones: S.optional(AvailabilityZones),
  Port: S.optional(S.Number),
  KmsKeyId: S.optional(S.String),
  StorageType: S.optional(S.String),
  Iops: S.optional(S.Number),
  StorageThroughput: S.optional(S.Number),
  AwsBackupRecoveryPointArn: S.optional(S.String),
  TagList: S.optional(TagList),
}) {}
export const DBClusterAutomatedBackupList = S.Array(
  DBClusterAutomatedBackup.pipe(T.XmlName("DBClusterAutomatedBackup")),
);
export class DBClusterBacktrack extends S.Class<DBClusterBacktrack>(
  "DBClusterBacktrack",
)(
  {
    DBClusterIdentifier: S.optional(S.String),
    BacktrackIdentifier: S.optional(S.String),
    BacktrackTo: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    BacktrackedFrom: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    BacktrackRequestCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    Status: S.optional(S.String),
  },
  ns,
) {}
export const DBClusterBacktrackList = S.Array(
  DBClusterBacktrack.pipe(T.XmlName("DBClusterBacktrack")),
);
export class DBClusterEndpoint extends S.Class<DBClusterEndpoint>(
  "DBClusterEndpoint",
)(
  {
    DBClusterEndpointIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    DBClusterEndpointResourceIdentifier: S.optional(S.String),
    Endpoint: S.optional(S.String),
    Status: S.optional(S.String),
    EndpointType: S.optional(S.String),
    CustomEndpointType: S.optional(S.String),
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
    DBClusterEndpointArn: S.optional(S.String),
  },
  ns,
) {}
export const DBClusterEndpointList = S.Array(
  DBClusterEndpoint.pipe(T.XmlName("DBClusterEndpointList")),
);
export class DBClusterParameterGroup extends S.Class<DBClusterParameterGroup>(
  "DBClusterParameterGroup",
)({
  DBClusterParameterGroupName: S.optional(S.String),
  DBParameterGroupFamily: S.optional(S.String),
  Description: S.optional(S.String),
  DBClusterParameterGroupArn: S.optional(S.String),
}) {}
export const DBClusterParameterGroupList = S.Array(
  DBClusterParameterGroup.pipe(T.XmlName("DBClusterParameterGroup")),
);
export class DBClusterOptionGroupStatus extends S.Class<DBClusterOptionGroupStatus>(
  "DBClusterOptionGroupStatus",
)({
  DBClusterOptionGroupName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const DBClusterOptionGroupMemberships = S.Array(
  DBClusterOptionGroupStatus.pipe(T.XmlName("DBClusterOptionGroup")),
);
export const ReadReplicaIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaIdentifier")),
);
export class DBClusterStatusInfo extends S.Class<DBClusterStatusInfo>(
  "DBClusterStatusInfo",
)({
  StatusType: S.optional(S.String),
  Normal: S.optional(S.Boolean),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const DBClusterStatusInfoList = S.Array(
  DBClusterStatusInfo.pipe(T.XmlName("DBClusterStatusInfo")),
);
export class DBClusterMember extends S.Class<DBClusterMember>(
  "DBClusterMember",
)({
  DBInstanceIdentifier: S.optional(S.String),
  IsClusterWriter: S.optional(S.Boolean),
  DBClusterParameterGroupStatus: S.optional(S.String),
  PromotionTier: S.optional(S.Number),
}) {}
export const DBClusterMemberList = S.Array(
  DBClusterMember.pipe(T.XmlName("DBClusterMember")),
);
export class VpcSecurityGroupMembership extends S.Class<VpcSecurityGroupMembership>(
  "VpcSecurityGroupMembership",
)({ VpcSecurityGroupId: S.optional(S.String), Status: S.optional(S.String) }) {}
export const VpcSecurityGroupMembershipList = S.Array(
  VpcSecurityGroupMembership.pipe(T.XmlName("VpcSecurityGroupMembership")),
);
export class DBClusterRole extends S.Class<DBClusterRole>("DBClusterRole")({
  RoleArn: S.optional(S.String),
  Status: S.optional(S.String),
  FeatureName: S.optional(S.String),
}) {}
export const DBClusterRoles = S.Array(
  DBClusterRole.pipe(T.XmlName("DBClusterRole")),
);
export class PendingCloudwatchLogsExports extends S.Class<PendingCloudwatchLogsExports>(
  "PendingCloudwatchLogsExports",
)({
  LogTypesToEnable: S.optional(LogTypeList),
  LogTypesToDisable: S.optional(LogTypeList),
}) {}
export class CertificateDetails extends S.Class<CertificateDetails>(
  "CertificateDetails",
)({
  CAIdentifier: S.optional(S.String),
  ValidTill: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ClusterPendingModifiedValues extends S.Class<ClusterPendingModifiedValues>(
  "ClusterPendingModifiedValues",
)({
  PendingCloudwatchLogsExports: S.optional(PendingCloudwatchLogsExports),
  DBClusterIdentifier: S.optional(S.String),
  MasterUserPassword: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  BackupRetentionPeriod: S.optional(S.Number),
  StorageType: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  RdsCustomClusterConfiguration: S.optional(RdsCustomClusterConfiguration),
  Iops: S.optional(S.Number),
  CertificateDetails: S.optional(CertificateDetails),
}) {}
export class ScalingConfigurationInfo extends S.Class<ScalingConfigurationInfo>(
  "ScalingConfigurationInfo",
)({
  MinCapacity: S.optional(S.Number),
  MaxCapacity: S.optional(S.Number),
  AutoPause: S.optional(S.Boolean),
  SecondsUntilAutoPause: S.optional(S.Number),
  TimeoutAction: S.optional(S.String),
  SecondsBeforeTimeout: S.optional(S.Number),
}) {}
export class DomainMembership extends S.Class<DomainMembership>(
  "DomainMembership",
)({
  Domain: S.optional(S.String),
  Status: S.optional(S.String),
  FQDN: S.optional(S.String),
  IAMRoleName: S.optional(S.String),
  OU: S.optional(S.String),
  AuthSecretArn: S.optional(S.String),
  DnsIps: S.optional(StringList),
}) {}
export const DomainMembershipList = S.Array(
  DomainMembership.pipe(T.XmlName("DomainMembership")),
);
export class ServerlessV2ScalingConfigurationInfo extends S.Class<ServerlessV2ScalingConfigurationInfo>(
  "ServerlessV2ScalingConfigurationInfo",
)({
  MinCapacity: S.optional(S.Number),
  MaxCapacity: S.optional(S.Number),
  SecondsUntilAutoPause: S.optional(S.Number),
}) {}
export class MasterUserSecret extends S.Class<MasterUserSecret>(
  "MasterUserSecret",
)({
  SecretArn: S.optional(S.String),
  SecretStatus: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
}) {}
export class LimitlessDatabase extends S.Class<LimitlessDatabase>(
  "LimitlessDatabase",
)({ Status: S.optional(S.String), MinRequiredACU: S.optional(S.Number) }) {}
export class DBCluster extends S.Class<DBCluster>("DBCluster")({
  AllocatedStorage: S.optional(S.Number),
  AvailabilityZones: S.optional(AvailabilityZones),
  BackupRetentionPeriod: S.optional(S.Number),
  CharacterSetName: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  DBClusterIdentifier: S.optional(S.String),
  DBClusterParameterGroup: S.optional(S.String),
  DBSubnetGroup: S.optional(S.String),
  Status: S.optional(S.String),
  PercentProgress: S.optional(S.String),
  EarliestRestorableTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  Endpoint: S.optional(S.String),
  ReaderEndpoint: S.optional(S.String),
  CustomEndpoints: S.optional(StringList),
  MultiAZ: S.optional(S.Boolean),
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  LatestRestorableTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Port: S.optional(S.Number),
  MasterUsername: S.optional(S.String),
  DBClusterOptionGroupMemberships: S.optional(DBClusterOptionGroupMemberships),
  PreferredBackupWindow: S.optional(S.String),
  PreferredMaintenanceWindow: S.optional(S.String),
  UpgradeRolloutOrder: S.optional(S.String),
  ReplicationSourceIdentifier: S.optional(S.String),
  ReadReplicaIdentifiers: S.optional(ReadReplicaIdentifierList),
  StatusInfos: S.optional(DBClusterStatusInfoList),
  DBClusterMembers: S.optional(DBClusterMemberList),
  VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
  HostedZoneId: S.optional(S.String),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DbClusterResourceId: S.optional(S.String),
  DBClusterArn: S.optional(S.String),
  AssociatedRoles: S.optional(DBClusterRoles),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  CloneGroupId: S.optional(S.String),
  ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EarliestBacktrackTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  BacktrackWindow: S.optional(S.Number),
  BacktrackConsumedChangeRecords: S.optional(S.Number),
  EnabledCloudwatchLogsExports: S.optional(LogTypeList),
  Capacity: S.optional(S.Number),
  PendingModifiedValues: S.optional(ClusterPendingModifiedValues),
  EngineMode: S.optional(S.String),
  ScalingConfigurationInfo: S.optional(ScalingConfigurationInfo),
  RdsCustomClusterConfiguration: S.optional(RdsCustomClusterConfiguration),
  DBClusterInstanceClass: S.optional(S.String),
  StorageType: S.optional(S.String),
  Iops: S.optional(S.Number),
  StorageThroughput: S.optional(S.Number),
  IOOptimizedNextAllowedModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  PubliclyAccessible: S.optional(S.Boolean),
  AutoMinorVersionUpgrade: S.optional(S.Boolean),
  DeletionProtection: S.optional(S.Boolean),
  HttpEndpointEnabled: S.optional(S.Boolean),
  ActivityStreamMode: S.optional(S.String),
  ActivityStreamStatus: S.optional(S.String),
  ActivityStreamKmsKeyId: S.optional(S.String),
  ActivityStreamKinesisStreamName: S.optional(S.String),
  CopyTagsToSnapshot: S.optional(S.Boolean),
  CrossAccountClone: S.optional(S.Boolean),
  DomainMemberships: S.optional(DomainMembershipList),
  TagList: S.optional(TagList),
  GlobalClusterIdentifier: S.optional(S.String),
  GlobalWriteForwardingStatus: S.optional(S.String),
  GlobalWriteForwardingRequested: S.optional(S.Boolean),
  NetworkType: S.optional(S.String),
  AutomaticRestartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ServerlessV2ScalingConfiguration: S.optional(
    ServerlessV2ScalingConfigurationInfo,
  ),
  ServerlessV2PlatformVersion: S.optional(S.String),
  MonitoringInterval: S.optional(S.Number),
  MonitoringRoleArn: S.optional(S.String),
  DatabaseInsightsMode: S.optional(S.String),
  PerformanceInsightsEnabled: S.optional(S.Boolean),
  PerformanceInsightsKMSKeyId: S.optional(S.String),
  PerformanceInsightsRetentionPeriod: S.optional(S.Number),
  DBSystemId: S.optional(S.String),
  MasterUserSecret: S.optional(MasterUserSecret),
  LocalWriteForwardingStatus: S.optional(S.String),
  AwsBackupRecoveryPointArn: S.optional(S.String),
  LimitlessDatabase: S.optional(LimitlessDatabase),
  ClusterScalabilityType: S.optional(S.String),
  CertificateDetails: S.optional(CertificateDetails),
  EngineLifecycleSupport: S.optional(S.String),
}) {}
export const DBClusterList = S.Array(DBCluster.pipe(T.XmlName("DBCluster")));
export class DBClusterSnapshot extends S.Class<DBClusterSnapshot>(
  "DBClusterSnapshot",
)({
  AvailabilityZones: S.optional(AvailabilityZones),
  DBClusterSnapshotIdentifier: S.optional(S.String),
  DBClusterIdentifier: S.optional(S.String),
  SnapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Engine: S.optional(S.String),
  EngineMode: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  Status: S.optional(S.String),
  Port: S.optional(S.Number),
  VpcId: S.optional(S.String),
  ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  MasterUsername: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  SnapshotType: S.optional(S.String),
  PercentProgress: S.optional(S.Number),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DBClusterSnapshotArn: S.optional(S.String),
  SourceDBClusterSnapshotArn: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  TagList: S.optional(TagList),
  StorageType: S.optional(S.String),
  StorageThroughput: S.optional(S.Number),
  DbClusterResourceId: S.optional(S.String),
  DBSystemId: S.optional(S.String),
}) {}
export const DBClusterSnapshotList = S.Array(
  DBClusterSnapshot.pipe(T.XmlName("DBClusterSnapshot")),
);
export class CustomDBEngineVersionAMI extends S.Class<CustomDBEngineVersionAMI>(
  "CustomDBEngineVersionAMI",
)({ ImageId: S.optional(S.String), Status: S.optional(S.String) }) {}
export class UpgradeTarget extends S.Class<UpgradeTarget>("UpgradeTarget")({
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  Description: S.optional(S.String),
  AutoUpgrade: S.optional(S.Boolean),
  IsMajorVersionUpgrade: S.optional(S.Boolean),
  SupportedEngineModes: S.optional(EngineModeList),
  SupportsParallelQuery: S.optional(S.Boolean),
  SupportsGlobalDatabases: S.optional(S.Boolean),
  SupportsBabelfish: S.optional(S.Boolean),
  SupportsLimitlessDatabase: S.optional(S.Boolean),
  SupportsLocalWriteForwarding: S.optional(S.Boolean),
  SupportsIntegrations: S.optional(S.Boolean),
}) {}
export const ValidUpgradeTargetList = S.Array(
  UpgradeTarget.pipe(T.XmlName("UpgradeTarget")),
);
export class Timezone extends S.Class<Timezone>("Timezone")({
  TimezoneName: S.optional(S.String),
}) {}
export const SupportedTimezonesList = S.Array(
  Timezone.pipe(T.XmlName("Timezone")),
);
export class ServerlessV2FeaturesSupport extends S.Class<ServerlessV2FeaturesSupport>(
  "ServerlessV2FeaturesSupport",
)({ MinCapacity: S.optional(S.Number), MaxCapacity: S.optional(S.Number) }) {}
export class DBEngineVersion extends S.Class<DBEngineVersion>(
  "DBEngineVersion",
)(
  {
    Engine: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DatabaseInstallationFilesS3BucketName: S.optional(S.String),
    DatabaseInstallationFilesS3Prefix: S.optional(S.String),
    CustomDBEngineVersionManifest: S.optional(S.String),
    DBParameterGroupFamily: S.optional(S.String),
    DBEngineDescription: S.optional(S.String),
    DBEngineVersionArn: S.optional(S.String),
    DBEngineVersionDescription: S.optional(S.String),
    DefaultCharacterSet: S.optional(CharacterSet),
    Image: S.optional(CustomDBEngineVersionAMI),
    DBEngineMediaType: S.optional(S.String),
    KMSKeyId: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SupportedCharacterSets: S.optional(SupportedCharacterSetsList),
    SupportedNcharCharacterSets: S.optional(SupportedCharacterSetsList),
    ValidUpgradeTarget: S.optional(ValidUpgradeTargetList),
    SupportedTimezones: S.optional(SupportedTimezonesList),
    ExportableLogTypes: S.optional(LogTypeList),
    SupportsLogExportsToCloudwatchLogs: S.optional(S.Boolean),
    SupportsReadReplica: S.optional(S.Boolean),
    SupportedEngineModes: S.optional(EngineModeList),
    SupportedFeatureNames: S.optional(FeatureNameList),
    Status: S.optional(S.String),
    SupportsParallelQuery: S.optional(S.Boolean),
    SupportsGlobalDatabases: S.optional(S.Boolean),
    TagList: S.optional(TagList),
    SupportsBabelfish: S.optional(S.Boolean),
    SupportsLimitlessDatabase: S.optional(S.Boolean),
    SupportsCertificateRotationWithoutRestart: S.optional(S.Boolean),
    SupportedCACertificateIdentifiers: S.optional(CACertificateIdentifiersList),
    SupportsLocalWriteForwarding: S.optional(S.Boolean),
    SupportsIntegrations: S.optional(S.Boolean),
    ServerlessV2FeaturesSupport: S.optional(ServerlessV2FeaturesSupport),
    DatabaseInstallationFiles: S.optional(StringList),
    FailureReason: S.optional(S.String),
  },
  ns,
) {}
export const DBEngineVersionList = S.Array(
  DBEngineVersion.pipe(T.XmlName("DBEngineVersion")),
);
export class DBInstanceAutomatedBackupsReplication extends S.Class<DBInstanceAutomatedBackupsReplication>(
  "DBInstanceAutomatedBackupsReplication",
)({ DBInstanceAutomatedBackupsArn: S.optional(S.String) }) {}
export const DBInstanceAutomatedBackupsReplicationList = S.Array(
  DBInstanceAutomatedBackupsReplication.pipe(
    T.XmlName("DBInstanceAutomatedBackupsReplication"),
  ),
);
export class DBInstanceAutomatedBackup extends S.Class<DBInstanceAutomatedBackup>(
  "DBInstanceAutomatedBackup",
)({
  DBInstanceArn: S.optional(S.String),
  DbiResourceId: S.optional(S.String),
  Region: S.optional(S.String),
  DBInstanceIdentifier: S.optional(S.String),
  RestoreWindow: S.optional(RestoreWindow),
  AllocatedStorage: S.optional(S.Number),
  Status: S.optional(S.String),
  Port: S.optional(S.Number),
  AvailabilityZone: S.optional(S.String),
  VpcId: S.optional(S.String),
  InstanceCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  MasterUsername: S.optional(S.String),
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  Iops: S.optional(S.Number),
  StorageThroughput: S.optional(S.Number),
  OptionGroupName: S.optional(S.String),
  TdeCredentialArn: S.optional(S.String),
  Encrypted: S.optional(S.Boolean),
  StorageType: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  Timezone: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  BackupRetentionPeriod: S.optional(S.Number),
  DBInstanceAutomatedBackupsArn: S.optional(S.String),
  DBInstanceAutomatedBackupsReplications: S.optional(
    DBInstanceAutomatedBackupsReplicationList,
  ),
  BackupTarget: S.optional(S.String),
  MultiTenant: S.optional(S.Boolean),
  AwsBackupRecoveryPointArn: S.optional(S.String),
  TagList: S.optional(TagList),
  DedicatedLogVolume: S.optional(S.Boolean),
  AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
}) {}
export const DBInstanceAutomatedBackupList = S.Array(
  DBInstanceAutomatedBackup.pipe(T.XmlName("DBInstanceAutomatedBackup")),
);
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Address: S.optional(S.String),
  Port: S.optional(S.Number),
  HostedZoneId: S.optional(S.String),
}) {}
export class DBSecurityGroupMembership extends S.Class<DBSecurityGroupMembership>(
  "DBSecurityGroupMembership",
)({
  DBSecurityGroupName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const DBSecurityGroupMembershipList = S.Array(
  DBSecurityGroupMembership.pipe(T.XmlName("DBSecurityGroup")),
);
export class DBParameterGroupStatus extends S.Class<DBParameterGroupStatus>(
  "DBParameterGroupStatus",
)({
  DBParameterGroupName: S.optional(S.String),
  ParameterApplyStatus: S.optional(S.String),
}) {}
export const DBParameterGroupStatusList = S.Array(
  DBParameterGroupStatus.pipe(T.XmlName("DBParameterGroup")),
);
export class AvailabilityZone extends S.Class<AvailabilityZone>(
  "AvailabilityZone",
)({ Name: S.optional(S.String) }) {}
export class Outpost extends S.Class<Outpost>("Outpost")({
  Arn: S.optional(S.String),
}) {}
export class Subnet extends S.Class<Subnet>("Subnet")({
  SubnetIdentifier: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(AvailabilityZone),
  SubnetOutpost: S.optional(Outpost),
  SubnetStatus: S.optional(S.String),
}) {}
export const SubnetList = S.Array(Subnet.pipe(T.XmlName("Subnet")));
export class DBSubnetGroup extends S.Class<DBSubnetGroup>("DBSubnetGroup")({
  DBSubnetGroupName: S.optional(S.String),
  DBSubnetGroupDescription: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetGroupStatus: S.optional(S.String),
  Subnets: S.optional(SubnetList),
  DBSubnetGroupArn: S.optional(S.String),
  SupportedNetworkTypes: S.optional(StringList),
}) {}
export class PendingModifiedValues extends S.Class<PendingModifiedValues>(
  "PendingModifiedValues",
)({
  DBInstanceClass: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  MasterUserPassword: S.optional(S.String),
  Port: S.optional(S.Number),
  BackupRetentionPeriod: S.optional(S.Number),
  MultiAZ: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  Iops: S.optional(S.Number),
  StorageThroughput: S.optional(S.Number),
  DBInstanceIdentifier: S.optional(S.String),
  StorageType: S.optional(S.String),
  CACertificateIdentifier: S.optional(S.String),
  DBSubnetGroupName: S.optional(S.String),
  PendingCloudwatchLogsExports: S.optional(PendingCloudwatchLogsExports),
  ProcessorFeatures: S.optional(ProcessorFeatureList),
  AutomationMode: S.optional(S.String),
  ResumeFullAutomationModeTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  MultiTenant: S.optional(S.Boolean),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  DedicatedLogVolume: S.optional(S.Boolean),
  Engine: S.optional(S.String),
  AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
}) {}
export const ReadReplicaDBInstanceIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaDBInstanceIdentifier")),
);
export const ReadReplicaDBClusterIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaDBClusterIdentifier")),
);
export class OptionGroupMembership extends S.Class<OptionGroupMembership>(
  "OptionGroupMembership",
)({ OptionGroupName: S.optional(S.String), Status: S.optional(S.String) }) {}
export const OptionGroupMembershipList = S.Array(
  OptionGroupMembership.pipe(T.XmlName("OptionGroupMembership")),
);
export class DBInstanceStatusInfo extends S.Class<DBInstanceStatusInfo>(
  "DBInstanceStatusInfo",
)({
  StatusType: S.optional(S.String),
  Normal: S.optional(S.Boolean),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const DBInstanceStatusInfoList = S.Array(
  DBInstanceStatusInfo.pipe(T.XmlName("DBInstanceStatusInfo")),
);
export class DBInstanceRole extends S.Class<DBInstanceRole>("DBInstanceRole")({
  RoleArn: S.optional(S.String),
  FeatureName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const DBInstanceRoles = S.Array(
  DBInstanceRole.pipe(T.XmlName("DBInstanceRole")),
);
export class AdditionalStorageVolumeOutput extends S.Class<AdditionalStorageVolumeOutput>(
  "AdditionalStorageVolumeOutput",
)({
  VolumeName: S.optional(S.String),
  StorageVolumeStatus: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  IOPS: S.optional(S.Number),
  MaxAllocatedStorage: S.optional(S.Number),
  StorageThroughput: S.optional(S.Number),
  StorageType: S.optional(S.String),
}) {}
export const AdditionalStorageVolumesOutputList = S.Array(
  AdditionalStorageVolumeOutput,
);
export class DBInstance extends S.Class<DBInstance>("DBInstance")({
  DBInstanceIdentifier: S.optional(S.String),
  DBInstanceClass: S.optional(S.String),
  Engine: S.optional(S.String),
  DBInstanceStatus: S.optional(S.String),
  MasterUsername: S.optional(S.String),
  DBName: S.optional(S.String),
  Endpoint: S.optional(Endpoint),
  AllocatedStorage: S.optional(S.Number),
  InstanceCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PreferredBackupWindow: S.optional(S.String),
  BackupRetentionPeriod: S.optional(S.Number),
  DBSecurityGroups: S.optional(DBSecurityGroupMembershipList),
  VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
  DBParameterGroups: S.optional(DBParameterGroupStatusList),
  AvailabilityZone: S.optional(S.String),
  DBSubnetGroup: S.optional(DBSubnetGroup),
  PreferredMaintenanceWindow: S.optional(S.String),
  UpgradeRolloutOrder: S.optional(S.String),
  PendingModifiedValues: S.optional(PendingModifiedValues),
  LatestRestorableTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  MultiAZ: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  AutoMinorVersionUpgrade: S.optional(S.Boolean),
  ReadReplicaSourceDBInstanceIdentifier: S.optional(S.String),
  ReadReplicaDBInstanceIdentifiers: S.optional(
    ReadReplicaDBInstanceIdentifierList,
  ),
  ReadReplicaDBClusterIdentifiers: S.optional(
    ReadReplicaDBClusterIdentifierList,
  ),
  ReplicaMode: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  Iops: S.optional(S.Number),
  StorageThroughput: S.optional(S.Number),
  OptionGroupMemberships: S.optional(OptionGroupMembershipList),
  CharacterSetName: S.optional(S.String),
  NcharCharacterSetName: S.optional(S.String),
  SecondaryAvailabilityZone: S.optional(S.String),
  PubliclyAccessible: S.optional(S.Boolean),
  StatusInfos: S.optional(DBInstanceStatusInfoList),
  StorageType: S.optional(S.String),
  TdeCredentialArn: S.optional(S.String),
  DbInstancePort: S.optional(S.Number),
  DBClusterIdentifier: S.optional(S.String),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DbiResourceId: S.optional(S.String),
  CACertificateIdentifier: S.optional(S.String),
  DomainMemberships: S.optional(DomainMembershipList),
  CopyTagsToSnapshot: S.optional(S.Boolean),
  MonitoringInterval: S.optional(S.Number),
  EnhancedMonitoringResourceArn: S.optional(S.String),
  MonitoringRoleArn: S.optional(S.String),
  PromotionTier: S.optional(S.Number),
  DBInstanceArn: S.optional(S.String),
  Timezone: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  DatabaseInsightsMode: S.optional(S.String),
  PerformanceInsightsEnabled: S.optional(S.Boolean),
  PerformanceInsightsKMSKeyId: S.optional(S.String),
  PerformanceInsightsRetentionPeriod: S.optional(S.Number),
  EnabledCloudwatchLogsExports: S.optional(LogTypeList),
  ProcessorFeatures: S.optional(ProcessorFeatureList),
  DeletionProtection: S.optional(S.Boolean),
  AssociatedRoles: S.optional(DBInstanceRoles),
  ListenerEndpoint: S.optional(Endpoint),
  MaxAllocatedStorage: S.optional(S.Number),
  TagList: S.optional(TagList),
  AutomationMode: S.optional(S.String),
  ResumeFullAutomationModeTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  CustomerOwnedIpEnabled: S.optional(S.Boolean),
  NetworkType: S.optional(S.String),
  ActivityStreamStatus: S.optional(S.String),
  ActivityStreamKmsKeyId: S.optional(S.String),
  ActivityStreamKinesisStreamName: S.optional(S.String),
  ActivityStreamMode: S.optional(S.String),
  ActivityStreamEngineNativeAuditFieldsIncluded: S.optional(S.Boolean),
  AwsBackupRecoveryPointArn: S.optional(S.String),
  DBInstanceAutomatedBackupsReplications: S.optional(
    DBInstanceAutomatedBackupsReplicationList,
  ),
  BackupTarget: S.optional(S.String),
  AutomaticRestartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CustomIamInstanceProfile: S.optional(S.String),
  ActivityStreamPolicyStatus: S.optional(S.String),
  CertificateDetails: S.optional(CertificateDetails),
  DBSystemId: S.optional(S.String),
  MasterUserSecret: S.optional(MasterUserSecret),
  ReadReplicaSourceDBClusterIdentifier: S.optional(S.String),
  PercentProgress: S.optional(S.String),
  MultiTenant: S.optional(S.Boolean),
  DedicatedLogVolume: S.optional(S.Boolean),
  IsStorageConfigUpgradeAvailable: S.optional(S.Boolean),
  EngineLifecycleSupport: S.optional(S.String),
  AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesOutputList),
  StorageVolumeStatus: S.optional(S.String),
}) {}
export const DBInstanceList = S.Array(DBInstance.pipe(T.XmlName("DBInstance")));
export class DBParameterGroup extends S.Class<DBParameterGroup>(
  "DBParameterGroup",
)({
  DBParameterGroupName: S.optional(S.String),
  DBParameterGroupFamily: S.optional(S.String),
  Description: S.optional(S.String),
  DBParameterGroupArn: S.optional(S.String),
}) {}
export const DBParameterGroupList = S.Array(
  DBParameterGroup.pipe(T.XmlName("DBParameterGroup")),
);
export class UserAuthConfigInfo extends S.Class<UserAuthConfigInfo>(
  "UserAuthConfigInfo",
)({
  Description: S.optional(S.String),
  UserName: S.optional(S.String),
  AuthScheme: S.optional(S.String),
  SecretArn: S.optional(S.String),
  IAMAuth: S.optional(S.String),
  ClientPasswordAuthType: S.optional(S.String),
}) {}
export const UserAuthConfigInfoList = S.Array(UserAuthConfigInfo);
export class DBProxy extends S.Class<DBProxy>("DBProxy")({
  DBProxyName: S.optional(S.String),
  DBProxyArn: S.optional(S.String),
  Status: S.optional(S.String),
  EngineFamily: S.optional(S.String),
  VpcId: S.optional(S.String),
  VpcSecurityGroupIds: S.optional(StringList),
  VpcSubnetIds: S.optional(StringList),
  DefaultAuthScheme: S.optional(S.String),
  Auth: S.optional(UserAuthConfigInfoList),
  RoleArn: S.optional(S.String),
  Endpoint: S.optional(S.String),
  RequireTLS: S.optional(S.Boolean),
  IdleClientTimeout: S.optional(S.Number),
  DebugLogging: S.optional(S.Boolean),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndpointNetworkType: S.optional(S.String),
  TargetConnectionNetworkType: S.optional(S.String),
}) {}
export const DBProxyList = S.Array(DBProxy);
export class DBProxyEndpoint extends S.Class<DBProxyEndpoint>(
  "DBProxyEndpoint",
)({
  DBProxyEndpointName: S.optional(S.String),
  DBProxyEndpointArn: S.optional(S.String),
  DBProxyName: S.optional(S.String),
  Status: S.optional(S.String),
  VpcId: S.optional(S.String),
  VpcSecurityGroupIds: S.optional(StringList),
  VpcSubnetIds: S.optional(StringList),
  Endpoint: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  TargetRole: S.optional(S.String),
  IsDefault: S.optional(S.Boolean),
  EndpointNetworkType: S.optional(S.String),
}) {}
export const DBProxyEndpointList = S.Array(DBProxyEndpoint);
export class EC2SecurityGroup extends S.Class<EC2SecurityGroup>(
  "EC2SecurityGroup",
)({
  Status: S.optional(S.String),
  EC2SecurityGroupName: S.optional(S.String),
  EC2SecurityGroupId: S.optional(S.String),
  EC2SecurityGroupOwnerId: S.optional(S.String),
}) {}
export const EC2SecurityGroupList = S.Array(
  EC2SecurityGroup.pipe(T.XmlName("EC2SecurityGroup")),
);
export class IPRange extends S.Class<IPRange>("IPRange")({
  Status: S.optional(S.String),
  CIDRIP: S.optional(S.String),
}) {}
export const IPRangeList = S.Array(IPRange.pipe(T.XmlName("IPRange")));
export class DBSecurityGroup extends S.Class<DBSecurityGroup>(
  "DBSecurityGroup",
)({
  OwnerId: S.optional(S.String),
  DBSecurityGroupName: S.optional(S.String),
  DBSecurityGroupDescription: S.optional(S.String),
  VpcId: S.optional(S.String),
  EC2SecurityGroups: S.optional(EC2SecurityGroupList),
  IPRanges: S.optional(IPRangeList),
  DBSecurityGroupArn: S.optional(S.String),
}) {}
export const DBSecurityGroups = S.Array(
  DBSecurityGroup.pipe(T.XmlName("DBSecurityGroup")),
);
export class DBShardGroup extends S.Class<DBShardGroup>("DBShardGroup")(
  {
    DBShardGroupResourceId: S.optional(S.String),
    DBShardGroupIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    MaxACU: S.optional(S.Number),
    MinACU: S.optional(S.Number),
    ComputeRedundancy: S.optional(S.Number),
    Status: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    Endpoint: S.optional(S.String),
    DBShardGroupArn: S.optional(S.String),
    TagList: S.optional(TagList),
  },
  ns,
) {}
export const DBShardGroupsList = S.Array(
  DBShardGroup.pipe(T.XmlName("DBShardGroup")),
);
export class DBSnapshot extends S.Class<DBSnapshot>("DBSnapshot")({
  DBSnapshotIdentifier: S.optional(S.String),
  DBInstanceIdentifier: S.optional(S.String),
  SnapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Engine: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  Status: S.optional(S.String),
  Port: S.optional(S.Number),
  AvailabilityZone: S.optional(S.String),
  VpcId: S.optional(S.String),
  InstanceCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  MasterUsername: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  SnapshotType: S.optional(S.String),
  Iops: S.optional(S.Number),
  StorageThroughput: S.optional(S.Number),
  OptionGroupName: S.optional(S.String),
  PercentProgress: S.optional(S.Number),
  SourceRegion: S.optional(S.String),
  SourceDBSnapshotIdentifier: S.optional(S.String),
  StorageType: S.optional(S.String),
  TdeCredentialArn: S.optional(S.String),
  Encrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DBSnapshotArn: S.optional(S.String),
  Timezone: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  ProcessorFeatures: S.optional(ProcessorFeatureList),
  DbiResourceId: S.optional(S.String),
  TagList: S.optional(TagList),
  SnapshotTarget: S.optional(S.String),
  OriginalSnapshotCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  SnapshotDatabaseTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DBSystemId: S.optional(S.String),
  MultiTenant: S.optional(S.Boolean),
  DedicatedLogVolume: S.optional(S.Boolean),
  SnapshotAvailabilityZone: S.optional(S.String),
  AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
}) {}
export const DBSnapshotList = S.Array(DBSnapshot.pipe(T.XmlName("DBSnapshot")));
export const DBSubnetGroups = S.Array(
  DBSubnetGroup.pipe(T.XmlName("DBSubnetGroup")),
);
export class EventSubscription extends S.Class<EventSubscription>(
  "EventSubscription",
)({
  CustomerAwsId: S.optional(S.String),
  CustSubscriptionId: S.optional(S.String),
  SnsTopicArn: S.optional(S.String),
  Status: S.optional(S.String),
  SubscriptionCreationTime: S.optional(S.String),
  SourceType: S.optional(S.String),
  SourceIdsList: S.optional(SourceIdsList),
  EventCategoriesList: S.optional(EventCategoriesList),
  Enabled: S.optional(S.Boolean),
  EventSubscriptionArn: S.optional(S.String),
}) {}
export const EventSubscriptionsList = S.Array(
  EventSubscription.pipe(T.XmlName("EventSubscription")),
);
export class ExportTask extends S.Class<ExportTask>("ExportTask")(
  {
    ExportTaskIdentifier: S.optional(S.String),
    SourceArn: S.optional(S.String),
    ExportOnly: S.optional(StringList),
    SnapshotTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskEndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    S3Bucket: S.optional(S.String),
    S3Prefix: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Status: S.optional(S.String),
    PercentProgress: S.optional(S.Number),
    TotalExtractedDataInGB: S.optional(S.Number),
    FailureCause: S.optional(S.String),
    WarningMessage: S.optional(S.String),
    SourceType: S.optional(S.String),
  },
  ns,
) {}
export const ExportTasksList = S.Array(
  ExportTask.pipe(T.XmlName("ExportTask")),
);
export const ReadersArnList = S.Array(S.String);
export class GlobalClusterMember extends S.Class<GlobalClusterMember>(
  "GlobalClusterMember",
)({
  DBClusterArn: S.optional(S.String),
  Readers: S.optional(ReadersArnList),
  IsWriter: S.optional(S.Boolean),
  GlobalWriteForwardingStatus: S.optional(S.String),
  SynchronizationStatus: S.optional(S.String),
}) {}
export const GlobalClusterMemberList = S.Array(
  GlobalClusterMember.pipe(T.XmlName("GlobalClusterMember")),
);
export class FailoverState extends S.Class<FailoverState>("FailoverState")({
  Status: S.optional(S.String),
  FromDbClusterArn: S.optional(S.String),
  ToDbClusterArn: S.optional(S.String),
  IsDataLossAllowed: S.optional(S.Boolean),
}) {}
export class GlobalCluster extends S.Class<GlobalCluster>("GlobalCluster")({
  GlobalClusterIdentifier: S.optional(S.String),
  GlobalClusterResourceId: S.optional(S.String),
  GlobalClusterArn: S.optional(S.String),
  Status: S.optional(S.String),
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  EngineLifecycleSupport: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  StorageEncrypted: S.optional(S.Boolean),
  DeletionProtection: S.optional(S.Boolean),
  GlobalClusterMembers: S.optional(GlobalClusterMemberList),
  Endpoint: S.optional(S.String),
  FailoverState: S.optional(FailoverState),
  TagList: S.optional(TagList),
}) {}
export const GlobalClusterList = S.Array(
  GlobalCluster.pipe(T.XmlName("GlobalClusterMember")),
);
export class IntegrationError extends S.Class<IntegrationError>(
  "IntegrationError",
)({ ErrorCode: S.String, ErrorMessage: S.optional(S.String) }) {}
export const IntegrationErrorList = S.Array(
  IntegrationError.pipe(T.XmlName("IntegrationError")),
);
export class Integration extends S.Class<Integration>("Integration")(
  {
    SourceArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    IntegrationName: S.optional(S.String),
    IntegrationArn: S.optional(S.String),
    KMSKeyId: S.optional(S.String),
    AdditionalEncryptionContext: S.optional(EncryptionContextMap),
    Status: S.optional(S.String),
    Tags: S.optional(TagList),
    DataFilter: S.optional(S.String),
    Description: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Errors: S.optional(IntegrationErrorList),
  },
  ns,
) {}
export const IntegrationList = S.Array(
  Integration.pipe(T.XmlName("Integration")),
);
export class OptionSetting extends S.Class<OptionSetting>("OptionSetting")({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
  DefaultValue: S.optional(S.String),
  Description: S.optional(S.String),
  ApplyType: S.optional(S.String),
  DataType: S.optional(S.String),
  AllowedValues: S.optional(S.String),
  IsModifiable: S.optional(S.Boolean),
  IsCollection: S.optional(S.Boolean),
}) {}
export const OptionSettingConfigurationList = S.Array(
  OptionSetting.pipe(T.XmlName("OptionSetting")),
);
export class Option extends S.Class<Option>("Option")({
  OptionName: S.optional(S.String),
  OptionDescription: S.optional(S.String),
  Persistent: S.optional(S.Boolean),
  Permanent: S.optional(S.Boolean),
  Port: S.optional(S.Number),
  OptionVersion: S.optional(S.String),
  OptionSettings: S.optional(OptionSettingConfigurationList),
  DBSecurityGroupMemberships: S.optional(DBSecurityGroupMembershipList),
  VpcSecurityGroupMemberships: S.optional(VpcSecurityGroupMembershipList),
}) {}
export const OptionsList = S.Array(Option.pipe(T.XmlName("Option")));
export class OptionGroup extends S.Class<OptionGroup>("OptionGroup")({
  OptionGroupName: S.optional(S.String),
  OptionGroupDescription: S.optional(S.String),
  EngineName: S.optional(S.String),
  MajorEngineVersion: S.optional(S.String),
  Options: S.optional(OptionsList),
  AllowsVpcAndNonVpcInstanceMemberships: S.optional(S.Boolean),
  VpcId: S.optional(S.String),
  OptionGroupArn: S.optional(S.String),
  SourceOptionGroup: S.optional(S.String),
  SourceAccountId: S.optional(S.String),
  CopyTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const OptionGroupsList = S.Array(
  OptionGroup.pipe(T.XmlName("OptionGroup")),
);
export class PendingMaintenanceAction extends S.Class<PendingMaintenanceAction>(
  "PendingMaintenanceAction",
)({
  Action: S.optional(S.String),
  AutoAppliedAfterDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ForcedApplyDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  OptInStatus: S.optional(S.String),
  CurrentApplyDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Description: S.optional(S.String),
}) {}
export const PendingMaintenanceActionDetails = S.Array(
  PendingMaintenanceAction.pipe(T.XmlName("PendingMaintenanceAction")),
);
export class ResourcePendingMaintenanceActions extends S.Class<ResourcePendingMaintenanceActions>(
  "ResourcePendingMaintenanceActions",
)({
  ResourceIdentifier: S.optional(S.String),
  PendingMaintenanceActionDetails: S.optional(PendingMaintenanceActionDetails),
}) {}
export const PendingMaintenanceActions = S.Array(
  ResourcePendingMaintenanceActions.pipe(
    T.XmlName("ResourcePendingMaintenanceActions"),
  ),
);
export class TenantDatabasePendingModifiedValues extends S.Class<TenantDatabasePendingModifiedValues>(
  "TenantDatabasePendingModifiedValues",
)({
  MasterUserPassword: S.optional(S.String),
  TenantDBName: S.optional(S.String),
}) {}
export class TenantDatabase extends S.Class<TenantDatabase>("TenantDatabase")({
  TenantDatabaseCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  DBInstanceIdentifier: S.optional(S.String),
  TenantDBName: S.optional(S.String),
  Status: S.optional(S.String),
  MasterUsername: S.optional(S.String),
  DbiResourceId: S.optional(S.String),
  TenantDatabaseResourceId: S.optional(S.String),
  TenantDatabaseARN: S.optional(S.String),
  CharacterSetName: S.optional(S.String),
  NcharCharacterSetName: S.optional(S.String),
  DeletionProtection: S.optional(S.Boolean),
  PendingModifiedValues: S.optional(TenantDatabasePendingModifiedValues),
  MasterUserSecret: S.optional(MasterUserSecret),
  TagList: S.optional(TagList),
}) {}
export const TenantDatabasesList = S.Array(
  TenantDatabase.pipe(T.XmlName("TenantDatabase")),
);
export class CloudwatchLogsExportConfiguration extends S.Class<CloudwatchLogsExportConfiguration>(
  "CloudwatchLogsExportConfiguration",
)({
  EnableLogTypes: S.optional(LogTypeList),
  DisableLogTypes: S.optional(LogTypeList),
}) {}
export class ModifyAdditionalStorageVolume extends S.Class<ModifyAdditionalStorageVolume>(
  "ModifyAdditionalStorageVolume",
)({
  VolumeName: S.String,
  AllocatedStorage: S.optional(S.Number),
  IOPS: S.optional(S.Number),
  MaxAllocatedStorage: S.optional(S.Number),
  StorageThroughput: S.optional(S.Number),
  StorageType: S.optional(S.String),
  SetForDelete: S.optional(S.Boolean),
}) {}
export const ModifyAdditionalStorageVolumesList = S.Array(
  ModifyAdditionalStorageVolume,
);
export class ConnectionPoolConfiguration extends S.Class<ConnectionPoolConfiguration>(
  "ConnectionPoolConfiguration",
)({
  MaxConnectionsPercent: S.optional(S.Number),
  MaxIdleConnectionsPercent: S.optional(S.Number),
  ConnectionBorrowTimeout: S.optional(S.Number),
  SessionPinningFilters: S.optional(StringList),
  InitQuery: S.optional(S.String),
}) {}
export class RecommendedActionUpdate extends S.Class<RecommendedActionUpdate>(
  "RecommendedActionUpdate",
)({ ActionId: S.String, Status: S.String }) {}
export const RecommendedActionUpdateList = S.Array(RecommendedActionUpdate);
export class AddTagsToResourceMessage extends S.Class<AddTagsToResourceMessage>(
  "AddTagsToResourceMessage",
)(
  { ResourceName: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsToResourceResponse extends S.Class<AddTagsToResourceResponse>(
  "AddTagsToResourceResponse",
)({}, ns) {}
export class CreateDBClusterMessage extends S.Class<CreateDBClusterMessage>(
  "CreateDBClusterMessage",
)(
  {
    AvailabilityZones: S.optional(AvailabilityZones),
    BackupRetentionPeriod: S.optional(S.Number),
    CharacterSetName: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    DBClusterIdentifier: S.String,
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    DBSubnetGroupName: S.optional(S.String),
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    ReplicationSourceIdentifier: S.optional(S.String),
    Tags: S.optional(TagList),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    BacktrackWindow: S.optional(S.Number),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    EngineMode: S.optional(S.String),
    ScalingConfiguration: S.optional(ScalingConfiguration),
    RdsCustomClusterConfiguration: S.optional(RdsCustomClusterConfiguration),
    DBClusterInstanceClass: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    StorageType: S.optional(S.String),
    Iops: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    DeletionProtection: S.optional(S.Boolean),
    GlobalClusterIdentifier: S.optional(S.String),
    EnableHttpEndpoint: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    Domain: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    EnableGlobalWriteForwarding: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    DatabaseInsightsMode: S.optional(S.String),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    EnableLimitlessDatabase: S.optional(S.Boolean),
    ClusterScalabilityType: S.optional(S.String),
    DBSystemId: S.optional(S.String),
    ManageMasterUserPassword: S.optional(S.Boolean),
    EnableLocalWriteForwarding: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
    EngineLifecycleSupport: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
    MasterUserAuthenticationType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBClusterParameterGroupResult extends S.Class<CreateDBClusterParameterGroupResult>(
  "CreateDBClusterParameterGroupResult",
)({ DBClusterParameterGroup: S.optional(DBClusterParameterGroup) }, ns) {}
export class CreateDBClusterSnapshotResult extends S.Class<CreateDBClusterSnapshotResult>(
  "CreateDBClusterSnapshotResult",
)({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }, ns) {}
export class CreateDBInstanceMessage extends S.Class<CreateDBInstanceMessage>(
  "CreateDBInstanceMessage",
)(
  {
    DBName: S.optional(S.String),
    DBInstanceIdentifier: S.String,
    AllocatedStorage: S.optional(S.Number),
    DBInstanceClass: S.String,
    Engine: S.String,
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(S.String),
    DBSecurityGroups: S.optional(DBSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    AvailabilityZone: S.optional(S.String),
    DBSubnetGroupName: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    DBParameterGroupName: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    PreferredBackupWindow: S.optional(S.String),
    Port: S.optional(S.Number),
    MultiAZ: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    LicenseModel: S.optional(S.String),
    Iops: S.optional(S.Number),
    StorageThroughput: S.optional(S.Number),
    OptionGroupName: S.optional(S.String),
    CharacterSetName: S.optional(S.String),
    NcharCharacterSetName: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    DBClusterIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    TdeCredentialArn: S.optional(S.String),
    TdeCredentialPassword: S.optional(S.String),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    Domain: S.optional(S.String),
    DomainFqdn: S.optional(S.String),
    DomainOu: S.optional(S.String),
    DomainAuthSecretArn: S.optional(S.String),
    DomainDnsIps: S.optional(StringList),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    PromotionTier: S.optional(S.Number),
    Timezone: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    DatabaseInsightsMode: S.optional(S.String),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    ProcessorFeatures: S.optional(ProcessorFeatureList),
    DeletionProtection: S.optional(S.Boolean),
    MaxAllocatedStorage: S.optional(S.Number),
    EnableCustomerOwnedIp: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    BackupTarget: S.optional(S.String),
    CustomIamInstanceProfile: S.optional(S.String),
    DBSystemId: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    MultiTenant: S.optional(S.Boolean),
    DedicatedLogVolume: S.optional(S.Boolean),
    EngineLifecycleSupport: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
    MasterUserAuthenticationType: S.optional(S.String),
    AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBParameterGroupResult extends S.Class<CreateDBParameterGroupResult>(
  "CreateDBParameterGroupResult",
)({ DBParameterGroup: S.optional(DBParameterGroup) }, ns) {}
export class CreateDBProxyRequest extends S.Class<CreateDBProxyRequest>(
  "CreateDBProxyRequest",
)(
  {
    DBProxyName: S.String,
    EngineFamily: S.String,
    DefaultAuthScheme: S.optional(S.String),
    Auth: S.optional(UserAuthConfigList),
    RoleArn: S.String,
    VpcSubnetIds: StringList,
    VpcSecurityGroupIds: S.optional(StringList),
    RequireTLS: S.optional(S.Boolean),
    IdleClientTimeout: S.optional(S.Number),
    DebugLogging: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    EndpointNetworkType: S.optional(S.String),
    TargetConnectionNetworkType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBSecurityGroupResult extends S.Class<CreateDBSecurityGroupResult>(
  "CreateDBSecurityGroupResult",
)({ DBSecurityGroup: S.optional(DBSecurityGroup) }, ns) {}
export class CreateDBSnapshotResult extends S.Class<CreateDBSnapshotResult>(
  "CreateDBSnapshotResult",
)({ DBSnapshot: S.optional(DBSnapshot) }, ns) {}
export class CreateEventSubscriptionResult extends S.Class<CreateEventSubscriptionResult>(
  "CreateEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class CreateIntegrationMessage extends S.Class<CreateIntegrationMessage>(
  "CreateIntegrationMessage",
)(
  {
    SourceArn: S.String,
    TargetArn: S.String,
    IntegrationName: S.String,
    KMSKeyId: S.optional(S.String),
    AdditionalEncryptionContext: S.optional(EncryptionContextMap),
    Tags: S.optional(TagList),
    DataFilter: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateOptionGroupResult extends S.Class<CreateOptionGroupResult>(
  "CreateOptionGroupResult",
)({ OptionGroup: S.optional(OptionGroup) }, ns) {}
export class SwitchoverDetail extends S.Class<SwitchoverDetail>(
  "SwitchoverDetail",
)({
  SourceMember: S.optional(S.String),
  TargetMember: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const SwitchoverDetailList = S.Array(SwitchoverDetail);
export class BlueGreenDeploymentTask extends S.Class<BlueGreenDeploymentTask>(
  "BlueGreenDeploymentTask",
)({ Name: S.optional(S.String), Status: S.optional(S.String) }) {}
export const BlueGreenDeploymentTaskList = S.Array(BlueGreenDeploymentTask);
export class BlueGreenDeployment extends S.Class<BlueGreenDeployment>(
  "BlueGreenDeployment",
)({
  BlueGreenDeploymentIdentifier: S.optional(S.String),
  BlueGreenDeploymentName: S.optional(S.String),
  Source: S.optional(S.String),
  Target: S.optional(S.String),
  SwitchoverDetails: S.optional(SwitchoverDetailList),
  Tasks: S.optional(BlueGreenDeploymentTaskList),
  Status: S.optional(S.String),
  StatusDetails: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DeleteTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  TagList: S.optional(TagList),
}) {}
export class DeleteBlueGreenDeploymentResponse extends S.Class<DeleteBlueGreenDeploymentResponse>(
  "DeleteBlueGreenDeploymentResponse",
)({ BlueGreenDeployment: S.optional(BlueGreenDeployment) }, ns) {}
export class DeleteDBClusterSnapshotResult extends S.Class<DeleteDBClusterSnapshotResult>(
  "DeleteDBClusterSnapshotResult",
)({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }, ns) {}
export class DeleteDBInstanceResult extends S.Class<DeleteDBInstanceResult>(
  "DeleteDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class DeleteDBProxyEndpointResponse extends S.Class<DeleteDBProxyEndpointResponse>(
  "DeleteDBProxyEndpointResponse",
)({ DBProxyEndpoint: S.optional(DBProxyEndpoint) }, ns) {}
export class DeleteDBSnapshotResult extends S.Class<DeleteDBSnapshotResult>(
  "DeleteDBSnapshotResult",
)({ DBSnapshot: S.optional(DBSnapshot) }, ns) {}
export class DeleteEventSubscriptionResult extends S.Class<DeleteEventSubscriptionResult>(
  "DeleteEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class DeleteGlobalClusterResult extends S.Class<DeleteGlobalClusterResult>(
  "DeleteGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class DeleteTenantDatabaseResult extends S.Class<DeleteTenantDatabaseResult>(
  "DeleteTenantDatabaseResult",
)({ TenantDatabase: S.optional(TenantDatabase) }, ns) {}
export class AccountAttributesMessage extends S.Class<AccountAttributesMessage>(
  "AccountAttributesMessage",
)({ AccountQuotas: S.optional(AccountQuotaList) }, ns) {}
export class DescribeBlueGreenDeploymentsRequest extends S.Class<DescribeBlueGreenDeploymentsRequest>(
  "DescribeBlueGreenDeploymentsRequest",
)(
  {
    BlueGreenDeploymentIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DBClusterAutomatedBackupMessage extends S.Class<DBClusterAutomatedBackupMessage>(
  "DBClusterAutomatedBackupMessage",
)(
  {
    Marker: S.optional(S.String),
    DBClusterAutomatedBackups: S.optional(DBClusterAutomatedBackupList),
  },
  ns,
) {}
export class DBClusterBacktrackMessage extends S.Class<DBClusterBacktrackMessage>(
  "DBClusterBacktrackMessage",
)(
  {
    Marker: S.optional(S.String),
    DBClusterBacktracks: S.optional(DBClusterBacktrackList),
  },
  ns,
) {}
export class DBClusterEndpointMessage extends S.Class<DBClusterEndpointMessage>(
  "DBClusterEndpointMessage",
)(
  {
    Marker: S.optional(S.String),
    DBClusterEndpoints: S.optional(DBClusterEndpointList),
  },
  ns,
) {}
export class DBClusterParameterGroupsMessage extends S.Class<DBClusterParameterGroupsMessage>(
  "DBClusterParameterGroupsMessage",
)(
  {
    Marker: S.optional(S.String),
    DBClusterParameterGroups: S.optional(DBClusterParameterGroupList),
  },
  ns,
) {}
export class DBClusterParameterGroupDetails extends S.Class<DBClusterParameterGroupDetails>(
  "DBClusterParameterGroupDetails",
)(
  { Parameters: S.optional(ParametersList), Marker: S.optional(S.String) },
  ns,
) {}
export class DBClusterMessage extends S.Class<DBClusterMessage>(
  "DBClusterMessage",
)(
  { Marker: S.optional(S.String), DBClusters: S.optional(DBClusterList) },
  ns,
) {}
export class DBClusterSnapshotMessage extends S.Class<DBClusterSnapshotMessage>(
  "DBClusterSnapshotMessage",
)(
  {
    Marker: S.optional(S.String),
    DBClusterSnapshots: S.optional(DBClusterSnapshotList),
  },
  ns,
) {}
export class DBEngineVersionMessage extends S.Class<DBEngineVersionMessage>(
  "DBEngineVersionMessage",
)(
  {
    Marker: S.optional(S.String),
    DBEngineVersions: S.optional(DBEngineVersionList),
  },
  ns,
) {}
export class DBInstanceAutomatedBackupMessage extends S.Class<DBInstanceAutomatedBackupMessage>(
  "DBInstanceAutomatedBackupMessage",
)(
  {
    Marker: S.optional(S.String),
    DBInstanceAutomatedBackups: S.optional(DBInstanceAutomatedBackupList),
  },
  ns,
) {}
export class DBInstanceMessage extends S.Class<DBInstanceMessage>(
  "DBInstanceMessage",
)(
  { Marker: S.optional(S.String), DBInstances: S.optional(DBInstanceList) },
  ns,
) {}
export class DBParameterGroupsMessage extends S.Class<DBParameterGroupsMessage>(
  "DBParameterGroupsMessage",
)(
  {
    Marker: S.optional(S.String),
    DBParameterGroups: S.optional(DBParameterGroupList),
  },
  ns,
) {}
export class DBParameterGroupDetails extends S.Class<DBParameterGroupDetails>(
  "DBParameterGroupDetails",
)(
  { Parameters: S.optional(ParametersList), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeDBProxiesResponse extends S.Class<DescribeDBProxiesResponse>(
  "DescribeDBProxiesResponse",
)({ DBProxies: S.optional(DBProxyList), Marker: S.optional(S.String) }, ns) {}
export class DescribeDBProxyEndpointsResponse extends S.Class<DescribeDBProxyEndpointsResponse>(
  "DescribeDBProxyEndpointsResponse",
)(
  {
    DBProxyEndpoints: S.optional(DBProxyEndpointList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DBSecurityGroupMessage extends S.Class<DBSecurityGroupMessage>(
  "DBSecurityGroupMessage",
)(
  {
    Marker: S.optional(S.String),
    DBSecurityGroups: S.optional(DBSecurityGroups),
  },
  ns,
) {}
export class DescribeDBShardGroupsResponse extends S.Class<DescribeDBShardGroupsResponse>(
  "DescribeDBShardGroupsResponse",
)(
  {
    DBShardGroups: S.optional(DBShardGroupsList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DBSnapshotMessage extends S.Class<DBSnapshotMessage>(
  "DBSnapshotMessage",
)(
  { Marker: S.optional(S.String), DBSnapshots: S.optional(DBSnapshotList) },
  ns,
) {}
export class DBSubnetGroupMessage extends S.Class<DBSubnetGroupMessage>(
  "DBSubnetGroupMessage",
)(
  { Marker: S.optional(S.String), DBSubnetGroups: S.optional(DBSubnetGroups) },
  ns,
) {}
export class EngineDefaults extends S.Class<EngineDefaults>("EngineDefaults")({
  DBParameterGroupFamily: S.optional(S.String),
  Marker: S.optional(S.String),
  Parameters: S.optional(ParametersList),
}) {}
export class DescribeEngineDefaultParametersResult extends S.Class<DescribeEngineDefaultParametersResult>(
  "DescribeEngineDefaultParametersResult",
)({ EngineDefaults: S.optional(EngineDefaults) }, ns) {}
export class EventSubscriptionsMessage extends S.Class<EventSubscriptionsMessage>(
  "EventSubscriptionsMessage",
)(
  {
    Marker: S.optional(S.String),
    EventSubscriptionsList: S.optional(EventSubscriptionsList),
  },
  ns,
) {}
export class ExportTasksMessage extends S.Class<ExportTasksMessage>(
  "ExportTasksMessage",
)(
  { Marker: S.optional(S.String), ExportTasks: S.optional(ExportTasksList) },
  ns,
) {}
export class GlobalClustersMessage extends S.Class<GlobalClustersMessage>(
  "GlobalClustersMessage",
)(
  {
    Marker: S.optional(S.String),
    GlobalClusters: S.optional(GlobalClusterList),
  },
  ns,
) {}
export class DescribeIntegrationsResponse extends S.Class<DescribeIntegrationsResponse>(
  "DescribeIntegrationsResponse",
)(
  { Marker: S.optional(S.String), Integrations: S.optional(IntegrationList) },
  ns,
) {}
export class OptionGroups extends S.Class<OptionGroups>("OptionGroups")(
  {
    OptionGroupsList: S.optional(OptionGroupsList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class PendingMaintenanceActionsMessage extends S.Class<PendingMaintenanceActionsMessage>(
  "PendingMaintenanceActionsMessage",
)(
  {
    PendingMaintenanceActions: S.optional(PendingMaintenanceActions),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class TenantDatabasesMessage extends S.Class<TenantDatabasesMessage>(
  "TenantDatabasesMessage",
)(
  {
    Marker: S.optional(S.String),
    TenantDatabases: S.optional(TenantDatabasesList),
  },
  ns,
) {}
export class DisableHttpEndpointResponse extends S.Class<DisableHttpEndpointResponse>(
  "DisableHttpEndpointResponse",
)(
  {
    ResourceArn: S.optional(S.String),
    HttpEndpointEnabled: S.optional(S.Boolean),
  },
  ns,
) {}
export class DownloadDBLogFilePortionDetails extends S.Class<DownloadDBLogFilePortionDetails>(
  "DownloadDBLogFilePortionDetails",
)(
  {
    LogFileData: S.optional(S.String),
    Marker: S.optional(S.String),
    AdditionalDataPending: S.optional(S.Boolean),
  },
  ns,
) {}
export class EnableHttpEndpointResponse extends S.Class<EnableHttpEndpointResponse>(
  "EnableHttpEndpointResponse",
)(
  {
    ResourceArn: S.optional(S.String),
    HttpEndpointEnabled: S.optional(S.Boolean),
  },
  ns,
) {}
export class FailoverDBClusterResult extends S.Class<FailoverDBClusterResult>(
  "FailoverDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class FailoverGlobalClusterResult extends S.Class<FailoverGlobalClusterResult>(
  "FailoverGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class TagListMessage extends S.Class<TagListMessage>("TagListMessage")(
  { TagList: S.optional(TagList) },
  ns,
) {}
export class ModifyActivityStreamResponse extends S.Class<ModifyActivityStreamResponse>(
  "ModifyActivityStreamResponse",
)(
  {
    KmsKeyId: S.optional(S.String),
    KinesisStreamName: S.optional(S.String),
    Status: S.optional(S.String),
    Mode: S.optional(S.String),
    EngineNativeAuditFieldsIncluded: S.optional(S.Boolean),
    PolicyStatus: S.optional(S.String),
  },
  ns,
) {}
export class Certificate extends S.Class<Certificate>("Certificate")({
  CertificateIdentifier: S.optional(S.String),
  CertificateType: S.optional(S.String),
  Thumbprint: S.optional(S.String),
  ValidFrom: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ValidTill: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CertificateArn: S.optional(S.String),
  CustomerOverride: S.optional(S.Boolean),
  CustomerOverrideValidTill: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class ModifyCertificatesResult extends S.Class<ModifyCertificatesResult>(
  "ModifyCertificatesResult",
)({ Certificate: S.optional(Certificate) }, ns) {}
export class DBClusterCapacityInfo extends S.Class<DBClusterCapacityInfo>(
  "DBClusterCapacityInfo",
)(
  {
    DBClusterIdentifier: S.optional(S.String),
    PendingCapacity: S.optional(S.Number),
    CurrentCapacity: S.optional(S.Number),
    SecondsBeforeTimeout: S.optional(S.Number),
    TimeoutAction: S.optional(S.String),
  },
  ns,
) {}
export class ModifyDBClusterMessage extends S.Class<ModifyDBClusterMessage>(
  "ModifyDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    NewDBClusterIdentifier: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
    BackupRetentionPeriod: S.optional(S.Number),
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Port: S.optional(S.Number),
    MasterUserPassword: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    BacktrackWindow: S.optional(S.Number),
    CloudwatchLogsExportConfiguration: S.optional(
      CloudwatchLogsExportConfiguration,
    ),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
    DBInstanceParameterGroupName: S.optional(S.String),
    Domain: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    ScalingConfiguration: S.optional(ScalingConfiguration),
    DeletionProtection: S.optional(S.Boolean),
    EnableHttpEndpoint: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    EnableGlobalWriteForwarding: S.optional(S.Boolean),
    DBClusterInstanceClass: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    StorageType: S.optional(S.String),
    Iops: S.optional(S.Number),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    DatabaseInsightsMode: S.optional(S.String),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    ManageMasterUserPassword: S.optional(S.Boolean),
    RotateMasterUserPassword: S.optional(S.Boolean),
    EnableLocalWriteForwarding: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    EngineMode: S.optional(S.String),
    AllowEngineModeChange: S.optional(S.Boolean),
    AwsBackupRecoveryPointArn: S.optional(S.String),
    EnableLimitlessDatabase: S.optional(S.Boolean),
    CACertificateIdentifier: S.optional(S.String),
    MasterUserAuthenticationType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBClusterParameterGroupMessage extends S.Class<ModifyDBClusterParameterGroupMessage>(
  "ModifyDBClusterParameterGroupMessage",
)(
  { DBClusterParameterGroupName: S.String, Parameters: ParametersList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DBClusterSnapshotAttribute extends S.Class<DBClusterSnapshotAttribute>(
  "DBClusterSnapshotAttribute",
)({
  AttributeName: S.optional(S.String),
  AttributeValues: S.optional(AttributeValueList),
}) {}
export const DBClusterSnapshotAttributeList = S.Array(
  DBClusterSnapshotAttribute.pipe(T.XmlName("DBClusterSnapshotAttribute")),
);
export class DBClusterSnapshotAttributesResult extends S.Class<DBClusterSnapshotAttributesResult>(
  "DBClusterSnapshotAttributesResult",
)({
  DBClusterSnapshotIdentifier: S.optional(S.String),
  DBClusterSnapshotAttributes: S.optional(DBClusterSnapshotAttributeList),
}) {}
export class ModifyDBClusterSnapshotAttributeResult extends S.Class<ModifyDBClusterSnapshotAttributeResult>(
  "ModifyDBClusterSnapshotAttributeResult",
)(
  {
    DBClusterSnapshotAttributesResult: S.optional(
      DBClusterSnapshotAttributesResult,
    ),
  },
  ns,
) {}
export class ModifyDBInstanceMessage extends S.Class<ModifyDBInstanceMessage>(
  "ModifyDBInstanceMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    AllocatedStorage: S.optional(S.Number),
    DBInstanceClass: S.optional(S.String),
    DBSubnetGroupName: S.optional(S.String),
    DBSecurityGroups: S.optional(DBSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    ApplyImmediately: S.optional(S.Boolean),
    MasterUserPassword: S.optional(S.String),
    DBParameterGroupName: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    LicenseModel: S.optional(S.String),
    Iops: S.optional(S.Number),
    StorageThroughput: S.optional(S.Number),
    OptionGroupName: S.optional(S.String),
    NewDBInstanceIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    TdeCredentialArn: S.optional(S.String),
    TdeCredentialPassword: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
    Domain: S.optional(S.String),
    DomainFqdn: S.optional(S.String),
    DomainOu: S.optional(S.String),
    DomainAuthSecretArn: S.optional(S.String),
    DomainDnsIps: S.optional(StringList),
    DisableDomain: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    MonitoringInterval: S.optional(S.Number),
    DBPortNumber: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    MonitoringRoleArn: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    PromotionTier: S.optional(S.Number),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    DatabaseInsightsMode: S.optional(S.String),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    CloudwatchLogsExportConfiguration: S.optional(
      CloudwatchLogsExportConfiguration,
    ),
    ProcessorFeatures: S.optional(ProcessorFeatureList),
    UseDefaultProcessorFeatures: S.optional(S.Boolean),
    DeletionProtection: S.optional(S.Boolean),
    MaxAllocatedStorage: S.optional(S.Number),
    CertificateRotationRestart: S.optional(S.Boolean),
    ReplicaMode: S.optional(S.String),
    AutomationMode: S.optional(S.String),
    ResumeFullAutomationModeMinutes: S.optional(S.Number),
    EnableCustomerOwnedIp: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    AwsBackupRecoveryPointArn: S.optional(S.String),
    ManageMasterUserPassword: S.optional(S.Boolean),
    RotateMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    MultiTenant: S.optional(S.Boolean),
    DedicatedLogVolume: S.optional(S.Boolean),
    Engine: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
    MasterUserAuthenticationType: S.optional(S.String),
    AdditionalStorageVolumes: S.optional(ModifyAdditionalStorageVolumesList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DBParameterGroupNameMessage extends S.Class<DBParameterGroupNameMessage>(
  "DBParameterGroupNameMessage",
)({ DBParameterGroupName: S.optional(S.String) }, ns) {}
export class ModifyDBProxyResponse extends S.Class<ModifyDBProxyResponse>(
  "ModifyDBProxyResponse",
)({ DBProxy: S.optional(DBProxy) }, ns) {}
export class ModifyDBProxyEndpointResponse extends S.Class<ModifyDBProxyEndpointResponse>(
  "ModifyDBProxyEndpointResponse",
)({ DBProxyEndpoint: S.optional(DBProxyEndpoint) }, ns) {}
export class ModifyDBProxyTargetGroupRequest extends S.Class<ModifyDBProxyTargetGroupRequest>(
  "ModifyDBProxyTargetGroupRequest",
)(
  {
    TargetGroupName: S.String,
    DBProxyName: S.String,
    ConnectionPoolConfig: S.optional(ConnectionPoolConfiguration),
    NewName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBRecommendationMessage extends S.Class<ModifyDBRecommendationMessage>(
  "ModifyDBRecommendationMessage",
)(
  {
    RecommendationId: S.String,
    Locale: S.optional(S.String),
    Status: S.optional(S.String),
    RecommendedActionUpdates: S.optional(RecommendedActionUpdateList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBSnapshotResult extends S.Class<ModifyDBSnapshotResult>(
  "ModifyDBSnapshotResult",
)({ DBSnapshot: S.optional(DBSnapshot) }, ns) {}
export class DBSnapshotAttribute extends S.Class<DBSnapshotAttribute>(
  "DBSnapshotAttribute",
)({
  AttributeName: S.optional(S.String),
  AttributeValues: S.optional(AttributeValueList),
}) {}
export const DBSnapshotAttributeList = S.Array(
  DBSnapshotAttribute.pipe(T.XmlName("DBSnapshotAttribute")),
);
export class DBSnapshotAttributesResult extends S.Class<DBSnapshotAttributesResult>(
  "DBSnapshotAttributesResult",
)({
  DBSnapshotIdentifier: S.optional(S.String),
  DBSnapshotAttributes: S.optional(DBSnapshotAttributeList),
}) {}
export class ModifyDBSnapshotAttributeResult extends S.Class<ModifyDBSnapshotAttributeResult>(
  "ModifyDBSnapshotAttributeResult",
)({ DBSnapshotAttributesResult: S.optional(DBSnapshotAttributesResult) }, ns) {}
export class ModifyDBSubnetGroupResult extends S.Class<ModifyDBSubnetGroupResult>(
  "ModifyDBSubnetGroupResult",
)({ DBSubnetGroup: S.optional(DBSubnetGroup) }, ns) {}
export class ModifyEventSubscriptionResult extends S.Class<ModifyEventSubscriptionResult>(
  "ModifyEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class ModifyGlobalClusterResult extends S.Class<ModifyGlobalClusterResult>(
  "ModifyGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class ModifyTenantDatabaseResult extends S.Class<ModifyTenantDatabaseResult>(
  "ModifyTenantDatabaseResult",
)({ TenantDatabase: S.optional(TenantDatabase) }, ns) {}
export class PromoteReadReplicaResult extends S.Class<PromoteReadReplicaResult>(
  "PromoteReadReplicaResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class PromoteReadReplicaDBClusterResult extends S.Class<PromoteReadReplicaDBClusterResult>(
  "PromoteReadReplicaDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class RecurringCharge extends S.Class<RecurringCharge>(
  "RecurringCharge",
)({
  RecurringChargeAmount: S.optional(S.Number),
  RecurringChargeFrequency: S.optional(S.String),
}) {}
export const RecurringChargeList = S.Array(
  RecurringCharge.pipe(T.XmlName("RecurringCharge")),
);
export class ReservedDBInstance extends S.Class<ReservedDBInstance>(
  "ReservedDBInstance",
)({
  ReservedDBInstanceId: S.optional(S.String),
  ReservedDBInstancesOfferingId: S.optional(S.String),
  DBInstanceClass: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Duration: S.optional(S.Number),
  FixedPrice: S.optional(S.Number),
  UsagePrice: S.optional(S.Number),
  CurrencyCode: S.optional(S.String),
  DBInstanceCount: S.optional(S.Number),
  ProductDescription: S.optional(S.String),
  OfferingType: S.optional(S.String),
  MultiAZ: S.optional(S.Boolean),
  State: S.optional(S.String),
  RecurringCharges: S.optional(RecurringChargeList),
  ReservedDBInstanceArn: S.optional(S.String),
  LeaseId: S.optional(S.String),
}) {}
export class PurchaseReservedDBInstancesOfferingResult extends S.Class<PurchaseReservedDBInstancesOfferingResult>(
  "PurchaseReservedDBInstancesOfferingResult",
)({ ReservedDBInstance: S.optional(ReservedDBInstance) }, ns) {}
export class RebootDBClusterResult extends S.Class<RebootDBClusterResult>(
  "RebootDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class RebootDBInstanceResult extends S.Class<RebootDBInstanceResult>(
  "RebootDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class TargetHealth extends S.Class<TargetHealth>("TargetHealth")({
  State: S.optional(S.String),
  Reason: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class DBProxyTarget extends S.Class<DBProxyTarget>("DBProxyTarget")({
  TargetArn: S.optional(S.String),
  Endpoint: S.optional(S.String),
  TrackedClusterId: S.optional(S.String),
  RdsResourceId: S.optional(S.String),
  Port: S.optional(S.Number),
  Type: S.optional(S.String),
  Role: S.optional(S.String),
  TargetHealth: S.optional(TargetHealth),
}) {}
export const TargetList = S.Array(DBProxyTarget);
export class RegisterDBProxyTargetsResponse extends S.Class<RegisterDBProxyTargetsResponse>(
  "RegisterDBProxyTargetsResponse",
)({ DBProxyTargets: S.optional(TargetList) }, ns) {}
export class RemoveFromGlobalClusterResult extends S.Class<RemoveFromGlobalClusterResult>(
  "RemoveFromGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class RemoveSourceIdentifierFromSubscriptionResult extends S.Class<RemoveSourceIdentifierFromSubscriptionResult>(
  "RemoveSourceIdentifierFromSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class DBClusterParameterGroupNameMessage extends S.Class<DBClusterParameterGroupNameMessage>(
  "DBClusterParameterGroupNameMessage",
)({ DBClusterParameterGroupName: S.optional(S.String) }, ns) {}
export class RestoreDBClusterFromS3Result extends S.Class<RestoreDBClusterFromS3Result>(
  "RestoreDBClusterFromS3Result",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class RestoreDBClusterFromSnapshotResult extends S.Class<RestoreDBClusterFromSnapshotResult>(
  "RestoreDBClusterFromSnapshotResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class RestoreDBClusterToPointInTimeResult extends S.Class<RestoreDBClusterToPointInTimeResult>(
  "RestoreDBClusterToPointInTimeResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class RestoreDBInstanceFromDBSnapshotResult extends S.Class<RestoreDBInstanceFromDBSnapshotResult>(
  "RestoreDBInstanceFromDBSnapshotResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class RestoreDBInstanceFromS3Result extends S.Class<RestoreDBInstanceFromS3Result>(
  "RestoreDBInstanceFromS3Result",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class RestoreDBInstanceToPointInTimeResult extends S.Class<RestoreDBInstanceToPointInTimeResult>(
  "RestoreDBInstanceToPointInTimeResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class RevokeDBSecurityGroupIngressResult extends S.Class<RevokeDBSecurityGroupIngressResult>(
  "RevokeDBSecurityGroupIngressResult",
)({ DBSecurityGroup: S.optional(DBSecurityGroup) }, ns) {}
export class StartActivityStreamResponse extends S.Class<StartActivityStreamResponse>(
  "StartActivityStreamResponse",
)(
  {
    KmsKeyId: S.optional(S.String),
    KinesisStreamName: S.optional(S.String),
    Status: S.optional(S.String),
    Mode: S.optional(S.String),
    EngineNativeAuditFieldsIncluded: S.optional(S.Boolean),
    ApplyImmediately: S.optional(S.Boolean),
  },
  ns,
) {}
export class StartDBClusterResult extends S.Class<StartDBClusterResult>(
  "StartDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class StartDBInstanceResult extends S.Class<StartDBInstanceResult>(
  "StartDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class StartDBInstanceAutomatedBackupsReplicationResult extends S.Class<StartDBInstanceAutomatedBackupsReplicationResult>(
  "StartDBInstanceAutomatedBackupsReplicationResult",
)({ DBInstanceAutomatedBackup: S.optional(DBInstanceAutomatedBackup) }, ns) {}
export class StopActivityStreamResponse extends S.Class<StopActivityStreamResponse>(
  "StopActivityStreamResponse",
)(
  {
    KmsKeyId: S.optional(S.String),
    KinesisStreamName: S.optional(S.String),
    Status: S.optional(S.String),
  },
  ns,
) {}
export class StopDBClusterResult extends S.Class<StopDBClusterResult>(
  "StopDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class StopDBInstanceResult extends S.Class<StopDBInstanceResult>(
  "StopDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class StopDBInstanceAutomatedBackupsReplicationResult extends S.Class<StopDBInstanceAutomatedBackupsReplicationResult>(
  "StopDBInstanceAutomatedBackupsReplicationResult",
)({ DBInstanceAutomatedBackup: S.optional(DBInstanceAutomatedBackup) }, ns) {}
export class SwitchoverBlueGreenDeploymentResponse extends S.Class<SwitchoverBlueGreenDeploymentResponse>(
  "SwitchoverBlueGreenDeploymentResponse",
)({ BlueGreenDeployment: S.optional(BlueGreenDeployment) }, ns) {}
export class SwitchoverGlobalClusterResult extends S.Class<SwitchoverGlobalClusterResult>(
  "SwitchoverGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class SwitchoverReadReplicaResult extends S.Class<SwitchoverReadReplicaResult>(
  "SwitchoverReadReplicaResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export const OptionsDependedOn = S.Array(
  S.String.pipe(T.XmlName("OptionName")),
);
export const OptionsConflictsWith = S.Array(
  S.String.pipe(T.XmlName("OptionConflictName")),
);
export const ActivityStreamModeList = S.Array(S.String);
export const OptionSettingsList = S.Array(
  OptionSetting.pipe(T.XmlName("OptionSetting")),
);
export const BlueGreenDeploymentList = S.Array(BlueGreenDeployment);
export const CertificateList = S.Array(
  Certificate.pipe(T.XmlName("Certificate")),
);
export class DescribeDBLogFilesDetails extends S.Class<DescribeDBLogFilesDetails>(
  "DescribeDBLogFilesDetails",
)({
  LogFileName: S.optional(S.String),
  LastWritten: S.optional(S.Number),
  Size: S.optional(S.Number),
}) {}
export const DescribeDBLogFilesList = S.Array(
  DescribeDBLogFilesDetails.pipe(T.XmlName("DescribeDBLogFilesDetails")),
);
export class DBSnapshotTenantDatabase extends S.Class<DBSnapshotTenantDatabase>(
  "DBSnapshotTenantDatabase",
)({
  DBSnapshotIdentifier: S.optional(S.String),
  DBInstanceIdentifier: S.optional(S.String),
  DbiResourceId: S.optional(S.String),
  EngineName: S.optional(S.String),
  SnapshotType: S.optional(S.String),
  TenantDatabaseCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  TenantDBName: S.optional(S.String),
  MasterUsername: S.optional(S.String),
  TenantDatabaseResourceId: S.optional(S.String),
  CharacterSetName: S.optional(S.String),
  DBSnapshotTenantDatabaseARN: S.optional(S.String),
  NcharCharacterSetName: S.optional(S.String),
  TagList: S.optional(TagList),
}) {}
export const DBSnapshotTenantDatabasesList = S.Array(
  DBSnapshotTenantDatabase.pipe(T.XmlName("DBSnapshotTenantDatabase")),
);
export class EventCategoriesMap extends S.Class<EventCategoriesMap>(
  "EventCategoriesMap",
)({
  SourceType: S.optional(S.String),
  EventCategories: S.optional(EventCategoriesList),
}) {}
export const EventCategoriesMapList = S.Array(
  EventCategoriesMap.pipe(T.XmlName("EventCategoriesMap")),
);
export class Event extends S.Class<Event>("Event")({
  SourceIdentifier: S.optional(S.String),
  SourceType: S.optional(S.String),
  Message: S.optional(S.String),
  EventCategories: S.optional(EventCategoriesList),
  Date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SourceArn: S.optional(S.String),
}) {}
export const EventList = S.Array(Event.pipe(T.XmlName("Event")));
export class ReservedDBInstancesOffering extends S.Class<ReservedDBInstancesOffering>(
  "ReservedDBInstancesOffering",
)({
  ReservedDBInstancesOfferingId: S.optional(S.String),
  DBInstanceClass: S.optional(S.String),
  Duration: S.optional(S.Number),
  FixedPrice: S.optional(S.Number),
  UsagePrice: S.optional(S.Number),
  CurrencyCode: S.optional(S.String),
  ProductDescription: S.optional(S.String),
  OfferingType: S.optional(S.String),
  MultiAZ: S.optional(S.Boolean),
  RecurringCharges: S.optional(RecurringChargeList),
}) {}
export const ReservedDBInstancesOfferingList = S.Array(
  ReservedDBInstancesOffering.pipe(T.XmlName("ReservedDBInstancesOffering")),
);
export class SourceRegion extends S.Class<SourceRegion>("SourceRegion")({
  RegionName: S.optional(S.String),
  Endpoint: S.optional(S.String),
  Status: S.optional(S.String),
  SupportsDBInstanceAutomatedBackupsReplication: S.optional(S.Boolean),
}) {}
export const SourceRegionList = S.Array(
  SourceRegion.pipe(T.XmlName("SourceRegion")),
);
export class OptionConfiguration extends S.Class<OptionConfiguration>(
  "OptionConfiguration",
)({
  OptionName: S.String,
  Port: S.optional(S.Number),
  OptionVersion: S.optional(S.String),
  DBSecurityGroupMemberships: S.optional(DBSecurityGroupNameList),
  VpcSecurityGroupMemberships: S.optional(VpcSecurityGroupIdList),
  OptionSettings: S.optional(OptionSettingsList),
}) {}
export const OptionConfigurationList = S.Array(
  OptionConfiguration.pipe(T.XmlName("OptionConfiguration")),
);
export class AddSourceIdentifierToSubscriptionResult extends S.Class<AddSourceIdentifierToSubscriptionResult>(
  "AddSourceIdentifierToSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class CopyDBClusterParameterGroupResult extends S.Class<CopyDBClusterParameterGroupResult>(
  "CopyDBClusterParameterGroupResult",
)({ DBClusterParameterGroup: S.optional(DBClusterParameterGroup) }, ns) {}
export class CopyDBClusterSnapshotResult extends S.Class<CopyDBClusterSnapshotResult>(
  "CopyDBClusterSnapshotResult",
)({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }, ns) {}
export class CopyDBParameterGroupResult extends S.Class<CopyDBParameterGroupResult>(
  "CopyDBParameterGroupResult",
)({ DBParameterGroup: S.optional(DBParameterGroup) }, ns) {}
export class CopyDBSnapshotResult extends S.Class<CopyDBSnapshotResult>(
  "CopyDBSnapshotResult",
)({ DBSnapshot: S.optional(DBSnapshot) }, ns) {}
export class CreateDBClusterResult extends S.Class<CreateDBClusterResult>(
  "CreateDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class CreateDBInstanceResult extends S.Class<CreateDBInstanceResult>(
  "CreateDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class CreateDBProxyResponse extends S.Class<CreateDBProxyResponse>(
  "CreateDBProxyResponse",
)({ DBProxy: S.optional(DBProxy) }, ns) {}
export class CreateDBProxyEndpointResponse extends S.Class<CreateDBProxyEndpointResponse>(
  "CreateDBProxyEndpointResponse",
)({ DBProxyEndpoint: S.optional(DBProxyEndpoint) }, ns) {}
export class DeleteDBInstanceAutomatedBackupResult extends S.Class<DeleteDBInstanceAutomatedBackupResult>(
  "DeleteDBInstanceAutomatedBackupResult",
)({ DBInstanceAutomatedBackup: S.optional(DBInstanceAutomatedBackup) }, ns) {}
export class DescribeBlueGreenDeploymentsResponse extends S.Class<DescribeBlueGreenDeploymentsResponse>(
  "DescribeBlueGreenDeploymentsResponse",
)(
  {
    BlueGreenDeployments: S.optional(BlueGreenDeploymentList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class CertificateMessage extends S.Class<CertificateMessage>(
  "CertificateMessage",
)(
  {
    DefaultCertificateForNewLaunches: S.optional(S.String),
    Certificates: S.optional(CertificateList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDBLogFilesResponse extends S.Class<DescribeDBLogFilesResponse>(
  "DescribeDBLogFilesResponse",
)(
  {
    DescribeDBLogFiles: S.optional(DescribeDBLogFilesList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DBSnapshotTenantDatabasesMessage extends S.Class<DBSnapshotTenantDatabasesMessage>(
  "DBSnapshotTenantDatabasesMessage",
)(
  {
    Marker: S.optional(S.String),
    DBSnapshotTenantDatabases: S.optional(DBSnapshotTenantDatabasesList),
  },
  ns,
) {}
export class DescribeEngineDefaultClusterParametersResult extends S.Class<DescribeEngineDefaultClusterParametersResult>(
  "DescribeEngineDefaultClusterParametersResult",
)({ EngineDefaults: S.optional(EngineDefaults) }, ns) {}
export class EventCategoriesMessage extends S.Class<EventCategoriesMessage>(
  "EventCategoriesMessage",
)({ EventCategoriesMapList: S.optional(EventCategoriesMapList) }, ns) {}
export class EventsMessage extends S.Class<EventsMessage>("EventsMessage")(
  { Marker: S.optional(S.String), Events: S.optional(EventList) },
  ns,
) {}
export class ReservedDBInstancesOfferingMessage extends S.Class<ReservedDBInstancesOfferingMessage>(
  "ReservedDBInstancesOfferingMessage",
)(
  {
    Marker: S.optional(S.String),
    ReservedDBInstancesOfferings: S.optional(ReservedDBInstancesOfferingList),
  },
  ns,
) {}
export class SourceRegionMessage extends S.Class<SourceRegionMessage>(
  "SourceRegionMessage",
)(
  { Marker: S.optional(S.String), SourceRegions: S.optional(SourceRegionList) },
  ns,
) {}
export class ModifyDBClusterResult extends S.Class<ModifyDBClusterResult>(
  "ModifyDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class ModifyDBInstanceResult extends S.Class<ModifyDBInstanceResult>(
  "ModifyDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class ConnectionPoolConfigurationInfo extends S.Class<ConnectionPoolConfigurationInfo>(
  "ConnectionPoolConfigurationInfo",
)({
  MaxConnectionsPercent: S.optional(S.Number),
  MaxIdleConnectionsPercent: S.optional(S.Number),
  ConnectionBorrowTimeout: S.optional(S.Number),
  SessionPinningFilters: S.optional(StringList),
  InitQuery: S.optional(S.String),
}) {}
export class DBProxyTargetGroup extends S.Class<DBProxyTargetGroup>(
  "DBProxyTargetGroup",
)({
  DBProxyName: S.optional(S.String),
  TargetGroupName: S.optional(S.String),
  TargetGroupArn: S.optional(S.String),
  IsDefault: S.optional(S.Boolean),
  Status: S.optional(S.String),
  ConnectionPoolConfig: S.optional(ConnectionPoolConfigurationInfo),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ModifyDBProxyTargetGroupResponse extends S.Class<ModifyDBProxyTargetGroupResponse>(
  "ModifyDBProxyTargetGroupResponse",
)({ DBProxyTargetGroup: S.optional(DBProxyTargetGroup) }, ns) {}
export class RecommendedActionParameter extends S.Class<RecommendedActionParameter>(
  "RecommendedActionParameter",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const RecommendedActionParameterList = S.Array(
  RecommendedActionParameter,
);
export class ScalarReferenceDetails extends S.Class<ScalarReferenceDetails>(
  "ScalarReferenceDetails",
)({ Value: S.optional(S.Number) }) {}
export class ReferenceDetails extends S.Class<ReferenceDetails>(
  "ReferenceDetails",
)({ ScalarReferenceDetails: S.optional(ScalarReferenceDetails) }) {}
export class MetricReference extends S.Class<MetricReference>(
  "MetricReference",
)({
  Name: S.optional(S.String),
  ReferenceDetails: S.optional(ReferenceDetails),
}) {}
export const MetricReferenceList = S.Array(MetricReference);
export class PerformanceInsightsMetricDimensionGroup extends S.Class<PerformanceInsightsMetricDimensionGroup>(
  "PerformanceInsightsMetricDimensionGroup",
)({
  Dimensions: S.optional(StringList),
  Group: S.optional(S.String),
  Limit: S.optional(S.Number),
}) {}
export class PerformanceInsightsMetricQuery extends S.Class<PerformanceInsightsMetricQuery>(
  "PerformanceInsightsMetricQuery",
)({
  GroupBy: S.optional(PerformanceInsightsMetricDimensionGroup),
  Metric: S.optional(S.String),
}) {}
export class MetricQuery extends S.Class<MetricQuery>("MetricQuery")({
  PerformanceInsightsMetricQuery: S.optional(PerformanceInsightsMetricQuery),
}) {}
export class Metric extends S.Class<Metric>("Metric")({
  Name: S.optional(S.String),
  References: S.optional(MetricReferenceList),
  StatisticsDetails: S.optional(S.String),
  MetricQuery: S.optional(MetricQuery),
}) {}
export const MetricList = S.Array(Metric);
export class PerformanceIssueDetails extends S.Class<PerformanceIssueDetails>(
  "PerformanceIssueDetails",
)({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Metrics: S.optional(MetricList),
  Analysis: S.optional(S.String),
}) {}
export class IssueDetails extends S.Class<IssueDetails>("IssueDetails")({
  PerformanceIssueDetails: S.optional(PerformanceIssueDetails),
}) {}
export class ContextAttribute extends S.Class<ContextAttribute>(
  "ContextAttribute",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const ContextAttributeList = S.Array(ContextAttribute);
export class RecommendedAction extends S.Class<RecommendedAction>(
  "RecommendedAction",
)({
  ActionId: S.optional(S.String),
  Title: S.optional(S.String),
  Description: S.optional(S.String),
  Operation: S.optional(S.String),
  Parameters: S.optional(RecommendedActionParameterList),
  ApplyModes: S.optional(StringList),
  Status: S.optional(S.String),
  IssueDetails: S.optional(IssueDetails),
  ContextAttributes: S.optional(ContextAttributeList),
}) {}
export const RecommendedActionList = S.Array(RecommendedAction);
export class DocLink extends S.Class<DocLink>("DocLink")({
  Text: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export const DocLinkList = S.Array(DocLink);
export class DBRecommendation extends S.Class<DBRecommendation>(
  "DBRecommendation",
)({
  RecommendationId: S.optional(S.String),
  TypeId: S.optional(S.String),
  Severity: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Detection: S.optional(S.String),
  Recommendation: S.optional(S.String),
  Description: S.optional(S.String),
  Reason: S.optional(S.String),
  RecommendedActions: S.optional(RecommendedActionList),
  Category: S.optional(S.String),
  Source: S.optional(S.String),
  TypeDetection: S.optional(S.String),
  TypeRecommendation: S.optional(S.String),
  Impact: S.optional(S.String),
  AdditionalInfo: S.optional(S.String),
  Links: S.optional(DocLinkList),
  IssueDetails: S.optional(IssueDetails),
}) {}
export class DBRecommendationMessage extends S.Class<DBRecommendationMessage>(
  "DBRecommendationMessage",
)({ DBRecommendation: S.optional(DBRecommendation) }, ns) {}
export class ModifyOptionGroupMessage extends S.Class<ModifyOptionGroupMessage>(
  "ModifyOptionGroupMessage",
)(
  {
    OptionGroupName: S.String,
    OptionsToInclude: S.optional(OptionConfigurationList),
    OptionsToRemove: S.optional(OptionNamesList),
    ApplyImmediately: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SupportedEngineLifecycle extends S.Class<SupportedEngineLifecycle>(
  "SupportedEngineLifecycle",
)({
  LifecycleSupportName: S.String,
  LifecycleSupportStartDate: S.Date.pipe(T.TimestampFormat("date-time")),
  LifecycleSupportEndDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const SupportedEngineLifecycleList = S.Array(
  SupportedEngineLifecycle.pipe(T.XmlName("SupportedEngineLifecycle")),
);
export class OptionVersion extends S.Class<OptionVersion>("OptionVersion")({
  Version: S.optional(S.String),
  IsDefault: S.optional(S.Boolean),
}) {}
export const OptionGroupOptionVersionsList = S.Array(
  OptionVersion.pipe(T.XmlName("OptionVersion")),
);
export const AvailabilityZoneList = S.Array(
  AvailabilityZone.pipe(T.XmlName("AvailabilityZone")),
);
export class AvailableProcessorFeature extends S.Class<AvailableProcessorFeature>(
  "AvailableProcessorFeature",
)({
  Name: S.optional(S.String),
  DefaultValue: S.optional(S.String),
  AllowedValues: S.optional(S.String),
}) {}
export const AvailableProcessorFeatureList = S.Array(
  AvailableProcessorFeature.pipe(T.XmlName("AvailableProcessorFeature")),
);
export class AvailableAdditionalStorageVolumesOption extends S.Class<AvailableAdditionalStorageVolumesOption>(
  "AvailableAdditionalStorageVolumesOption",
)({
  SupportsStorageAutoscaling: S.optional(S.Boolean),
  SupportsStorageThroughput: S.optional(S.Boolean),
  SupportsIops: S.optional(S.Boolean),
  StorageType: S.optional(S.String),
  MinStorageSize: S.optional(S.Number),
  MaxStorageSize: S.optional(S.Number),
  MinIops: S.optional(S.Number),
  MaxIops: S.optional(S.Number),
  MinIopsPerGib: S.optional(S.Number),
  MaxIopsPerGib: S.optional(S.Number),
  MinStorageThroughput: S.optional(S.Number),
  MaxStorageThroughput: S.optional(S.Number),
}) {}
export const AvailableAdditionalStorageVolumesOptionList = S.Array(
  AvailableAdditionalStorageVolumesOption.pipe(
    T.XmlName("AvailableAdditionalStorageVolumesOption"),
  ),
);
export class DBMajorEngineVersion extends S.Class<DBMajorEngineVersion>(
  "DBMajorEngineVersion",
)({
  Engine: S.optional(S.String),
  MajorEngineVersion: S.optional(S.String),
  SupportedEngineLifecycles: S.optional(SupportedEngineLifecycleList),
}) {}
export const DBMajorEngineVersionsList = S.Array(
  DBMajorEngineVersion.pipe(T.XmlName("DBMajorEngineVersion")),
);
export const TargetGroupList = S.Array(DBProxyTargetGroup);
export class OrderableDBInstanceOption extends S.Class<OrderableDBInstanceOption>(
  "OrderableDBInstanceOption",
)({
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  DBInstanceClass: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  AvailabilityZoneGroup: S.optional(S.String),
  AvailabilityZones: S.optional(AvailabilityZoneList),
  MultiAZCapable: S.optional(S.Boolean),
  ReadReplicaCapable: S.optional(S.Boolean),
  Vpc: S.optional(S.Boolean),
  SupportsStorageEncryption: S.optional(S.Boolean),
  StorageType: S.optional(S.String),
  SupportsIops: S.optional(S.Boolean),
  SupportsStorageThroughput: S.optional(S.Boolean),
  SupportsEnhancedMonitoring: S.optional(S.Boolean),
  SupportsIAMDatabaseAuthentication: S.optional(S.Boolean),
  SupportsPerformanceInsights: S.optional(S.Boolean),
  MinStorageSize: S.optional(S.Number),
  MaxStorageSize: S.optional(S.Number),
  MinIopsPerDbInstance: S.optional(S.Number),
  MaxIopsPerDbInstance: S.optional(S.Number),
  MinIopsPerGib: S.optional(S.Number),
  MaxIopsPerGib: S.optional(S.Number),
  MinStorageThroughputPerDbInstance: S.optional(S.Number),
  MaxStorageThroughputPerDbInstance: S.optional(S.Number),
  MinStorageThroughputPerIops: S.optional(S.Number),
  MaxStorageThroughputPerIops: S.optional(S.Number),
  AvailableProcessorFeatures: S.optional(AvailableProcessorFeatureList),
  SupportedEngineModes: S.optional(EngineModeList),
  SupportsStorageAutoscaling: S.optional(S.Boolean),
  SupportsKerberosAuthentication: S.optional(S.Boolean),
  OutpostCapable: S.optional(S.Boolean),
  SupportedActivityStreamModes: S.optional(ActivityStreamModeList),
  SupportsGlobalDatabases: S.optional(S.Boolean),
  SupportedNetworkTypes: S.optional(StringList),
  SupportsClusters: S.optional(S.Boolean),
  SupportsDedicatedLogVolume: S.optional(S.Boolean),
  SupportsHttpEndpoint: S.optional(S.Boolean),
  SupportsAdditionalStorageVolumes: S.optional(S.Boolean),
  AvailableAdditionalStorageVolumesOptions: S.optional(
    AvailableAdditionalStorageVolumesOptionList,
  ),
}) {}
export const OrderableDBInstanceOptionsList = S.Array(
  OrderableDBInstanceOption.pipe(T.XmlName("OrderableDBInstanceOption")),
);
export const ReservedDBInstanceList = S.Array(
  ReservedDBInstance.pipe(T.XmlName("ReservedDBInstance")),
);
export class MinimumEngineVersionPerAllowedValue extends S.Class<MinimumEngineVersionPerAllowedValue>(
  "MinimumEngineVersionPerAllowedValue",
)({
  AllowedValue: S.optional(S.String),
  MinimumEngineVersion: S.optional(S.String),
}) {}
export const MinimumEngineVersionPerAllowedValueList = S.Array(
  MinimumEngineVersionPerAllowedValue.pipe(
    T.XmlName("MinimumEngineVersionPerAllowedValue"),
  ),
);
export class Range extends S.Class<Range>("Range")({
  From: S.optional(S.Number),
  To: S.optional(S.Number),
  Step: S.optional(S.Number),
}) {}
export const RangeList = S.Array(Range.pipe(T.XmlName("Range")));
export class DoubleRange extends S.Class<DoubleRange>("DoubleRange")({
  From: S.optional(S.Number),
  To: S.optional(S.Number),
}) {}
export const DoubleRangeList = S.Array(
  DoubleRange.pipe(T.XmlName("DoubleRange")),
);
export class ValidStorageOptions extends S.Class<ValidStorageOptions>(
  "ValidStorageOptions",
)({
  StorageType: S.optional(S.String),
  StorageSize: S.optional(RangeList),
  ProvisionedIops: S.optional(RangeList),
  IopsToStorageRatio: S.optional(DoubleRangeList),
  ProvisionedStorageThroughput: S.optional(RangeList),
  StorageThroughputToIopsRatio: S.optional(DoubleRangeList),
  SupportsStorageAutoscaling: S.optional(S.Boolean),
}) {}
export const ValidStorageOptionsList = S.Array(
  ValidStorageOptions.pipe(T.XmlName("ValidStorageOptions")),
);
export class ValidVolumeOptions extends S.Class<ValidVolumeOptions>(
  "ValidVolumeOptions",
)({
  VolumeName: S.optional(S.String),
  Storage: S.optional(ValidStorageOptionsList),
}) {}
export const ValidVolumeOptionsList = S.Array(ValidVolumeOptions);
export class ApplyPendingMaintenanceActionResult extends S.Class<ApplyPendingMaintenanceActionResult>(
  "ApplyPendingMaintenanceActionResult",
)(
  {
    ResourcePendingMaintenanceActions: S.optional(
      ResourcePendingMaintenanceActions,
    ),
  },
  ns,
) {}
export class AuthorizeDBSecurityGroupIngressResult extends S.Class<AuthorizeDBSecurityGroupIngressResult>(
  "AuthorizeDBSecurityGroupIngressResult",
)({ DBSecurityGroup: S.optional(DBSecurityGroup) }, ns) {}
export class CopyOptionGroupResult extends S.Class<CopyOptionGroupResult>(
  "CopyOptionGroupResult",
)({ OptionGroup: S.optional(OptionGroup) }, ns) {}
export class CreateBlueGreenDeploymentResponse extends S.Class<CreateBlueGreenDeploymentResponse>(
  "CreateBlueGreenDeploymentResponse",
)({ BlueGreenDeployment: S.optional(BlueGreenDeployment) }, ns) {}
export class CreateGlobalClusterResult extends S.Class<CreateGlobalClusterResult>(
  "CreateGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class CreateTenantDatabaseResult extends S.Class<CreateTenantDatabaseResult>(
  "CreateTenantDatabaseResult",
)({ TenantDatabase: S.optional(TenantDatabase) }, ns) {}
export class DeleteDBClusterResult extends S.Class<DeleteDBClusterResult>(
  "DeleteDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class DeleteDBClusterAutomatedBackupResult extends S.Class<DeleteDBClusterAutomatedBackupResult>(
  "DeleteDBClusterAutomatedBackupResult",
)({ DBClusterAutomatedBackup: S.optional(DBClusterAutomatedBackup) }, ns) {}
export class DeleteDBProxyResponse extends S.Class<DeleteDBProxyResponse>(
  "DeleteDBProxyResponse",
)({ DBProxy: S.optional(DBProxy) }, ns) {}
export class DescribeDBClusterSnapshotAttributesResult extends S.Class<DescribeDBClusterSnapshotAttributesResult>(
  "DescribeDBClusterSnapshotAttributesResult",
)(
  {
    DBClusterSnapshotAttributesResult: S.optional(
      DBClusterSnapshotAttributesResult,
    ),
  },
  ns,
) {}
export class DescribeDBMajorEngineVersionsResponse extends S.Class<DescribeDBMajorEngineVersionsResponse>(
  "DescribeDBMajorEngineVersionsResponse",
)(
  {
    DBMajorEngineVersions: S.optional(DBMajorEngineVersionsList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDBProxyTargetGroupsResponse extends S.Class<DescribeDBProxyTargetGroupsResponse>(
  "DescribeDBProxyTargetGroupsResponse",
)(
  { TargetGroups: S.optional(TargetGroupList), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeDBProxyTargetsResponse extends S.Class<DescribeDBProxyTargetsResponse>(
  "DescribeDBProxyTargetsResponse",
)({ Targets: S.optional(TargetList), Marker: S.optional(S.String) }, ns) {}
export class DescribeDBSnapshotAttributesResult extends S.Class<DescribeDBSnapshotAttributesResult>(
  "DescribeDBSnapshotAttributesResult",
)({ DBSnapshotAttributesResult: S.optional(DBSnapshotAttributesResult) }, ns) {}
export class OrderableDBInstanceOptionsMessage extends S.Class<OrderableDBInstanceOptionsMessage>(
  "OrderableDBInstanceOptionsMessage",
)(
  {
    OrderableDBInstanceOptions: S.optional(OrderableDBInstanceOptionsList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ReservedDBInstanceMessage extends S.Class<ReservedDBInstanceMessage>(
  "ReservedDBInstanceMessage",
)(
  {
    Marker: S.optional(S.String),
    ReservedDBInstances: S.optional(ReservedDBInstanceList),
  },
  ns,
) {}
export class ModifyOptionGroupResult extends S.Class<ModifyOptionGroupResult>(
  "ModifyOptionGroupResult",
)({ OptionGroup: S.optional(OptionGroup) }, ns) {}
export class OptionGroupOptionSetting extends S.Class<OptionGroupOptionSetting>(
  "OptionGroupOptionSetting",
)({
  SettingName: S.optional(S.String),
  SettingDescription: S.optional(S.String),
  DefaultValue: S.optional(S.String),
  ApplyType: S.optional(S.String),
  AllowedValues: S.optional(S.String),
  IsModifiable: S.optional(S.Boolean),
  IsRequired: S.optional(S.Boolean),
  MinimumEngineVersionPerAllowedValue: S.optional(
    MinimumEngineVersionPerAllowedValueList,
  ),
}) {}
export const OptionGroupOptionSettingsList = S.Array(
  OptionGroupOptionSetting.pipe(T.XmlName("OptionGroupOptionSetting")),
);
export class ValidAdditionalStorageOptions extends S.Class<ValidAdditionalStorageOptions>(
  "ValidAdditionalStorageOptions",
)({
  SupportsAdditionalStorageVolumes: S.optional(S.Boolean),
  Volumes: S.optional(ValidVolumeOptionsList),
}) {}
export class OptionGroupOption extends S.Class<OptionGroupOption>(
  "OptionGroupOption",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  EngineName: S.optional(S.String),
  MajorEngineVersion: S.optional(S.String),
  MinimumRequiredMinorEngineVersion: S.optional(S.String),
  PortRequired: S.optional(S.Boolean),
  DefaultPort: S.optional(S.Number),
  OptionsDependedOn: S.optional(OptionsDependedOn),
  OptionsConflictsWith: S.optional(OptionsConflictsWith),
  Persistent: S.optional(S.Boolean),
  Permanent: S.optional(S.Boolean),
  RequiresAutoMinorEngineVersionUpgrade: S.optional(S.Boolean),
  VpcOnly: S.optional(S.Boolean),
  SupportsOptionVersionDowngrade: S.optional(S.Boolean),
  OptionGroupOptionSettings: S.optional(OptionGroupOptionSettingsList),
  OptionGroupOptionVersions: S.optional(OptionGroupOptionVersionsList),
  CopyableCrossAccount: S.optional(S.Boolean),
}) {}
export const OptionGroupOptionsList = S.Array(
  OptionGroupOption.pipe(T.XmlName("OptionGroupOption")),
);
export class ValidDBInstanceModificationsMessage extends S.Class<ValidDBInstanceModificationsMessage>(
  "ValidDBInstanceModificationsMessage",
)({
  Storage: S.optional(ValidStorageOptionsList),
  ValidProcessorFeatures: S.optional(AvailableProcessorFeatureList),
  SupportsDedicatedLogVolume: S.optional(S.Boolean),
  AdditionalStorage: S.optional(ValidAdditionalStorageOptions),
}) {}
export class CreateDBInstanceReadReplicaResult extends S.Class<CreateDBInstanceReadReplicaResult>(
  "CreateDBInstanceReadReplicaResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class CreateDBSubnetGroupResult extends S.Class<CreateDBSubnetGroupResult>(
  "CreateDBSubnetGroupResult",
)({ DBSubnetGroup: S.optional(DBSubnetGroup) }, ns) {}
export class OptionGroupOptionsMessage extends S.Class<OptionGroupOptionsMessage>(
  "OptionGroupOptionsMessage",
)(
  {
    OptionGroupOptions: S.optional(OptionGroupOptionsList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeValidDBInstanceModificationsResult extends S.Class<DescribeValidDBInstanceModificationsResult>(
  "DescribeValidDBInstanceModificationsResult",
)(
  {
    ValidDBInstanceModificationsMessage: S.optional(
      ValidDBInstanceModificationsMessage,
    ),
  },
  ns,
) {}
export const DBRecommendationList = S.Array(DBRecommendation);
export class DBRecommendationsMessage extends S.Class<DBRecommendationsMessage>(
  "DBRecommendationsMessage",
)(
  {
    DBRecommendations: S.optional(DBRecommendationList),
    Marker: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class DBParameterGroupNotFoundFault extends S.TaggedError<DBParameterGroupNotFoundFault>()(
  "DBParameterGroupNotFoundFault",
  {},
  T.AwsQueryError({ code: "DBParameterGroupNotFound", httpResponseCode: 404 }),
) {}
export class CustomDBEngineVersionNotFoundFault extends S.TaggedError<CustomDBEngineVersionNotFoundFault>()(
  "CustomDBEngineVersionNotFoundFault",
  {},
  T.AwsQueryError({
    code: "CustomDBEngineVersionNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class DBClusterEndpointNotFoundFault extends S.TaggedError<DBClusterEndpointNotFoundFault>()(
  "DBClusterEndpointNotFoundFault",
  {},
  T.AwsQueryError({
    code: "DBClusterEndpointNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class DBInstanceNotFoundFault extends S.TaggedError<DBInstanceNotFoundFault>()(
  "DBInstanceNotFoundFault",
  {},
  T.AwsQueryError({ code: "DBInstanceNotFound", httpResponseCode: 404 }),
) {}
export class DBShardGroupNotFoundFault extends S.TaggedError<DBShardGroupNotFoundFault>()(
  "DBShardGroupNotFoundFault",
  {},
  T.AwsQueryError({ code: "DBShardGroupNotFound", httpResponseCode: 404 }),
) {}
export class DBClusterNotFoundFault extends S.TaggedError<DBClusterNotFoundFault>()(
  "DBClusterNotFoundFault",
  {},
  T.AwsQueryError({ code: "DBClusterNotFoundFault", httpResponseCode: 404 }),
) {}
export class InvalidDBParameterGroupStateFault extends S.TaggedError<InvalidDBParameterGroupStateFault>()(
  "InvalidDBParameterGroupStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidDBParameterGroupState",
    httpResponseCode: 400,
  }),
) {}
export class BlueGreenDeploymentNotFoundFault extends S.TaggedError<BlueGreenDeploymentNotFoundFault>()(
  "BlueGreenDeploymentNotFoundFault",
  {},
  T.AwsQueryError({
    code: "BlueGreenDeploymentNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class DBParameterGroupAlreadyExistsFault extends S.TaggedError<DBParameterGroupAlreadyExistsFault>()(
  "DBParameterGroupAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "DBParameterGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class DBShardGroupAlreadyExistsFault extends S.TaggedError<DBShardGroupAlreadyExistsFault>()(
  "DBShardGroupAlreadyExistsFault",
  {},
  T.AwsQueryError({ code: "DBShardGroupAlreadyExists", httpResponseCode: 400 }),
) {}
export class InvalidDBClusterStateFault extends S.TaggedError<InvalidDBClusterStateFault>()(
  "InvalidDBClusterStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidDBClusterStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidCustomDBEngineVersionStateFault extends S.TaggedError<InvalidCustomDBEngineVersionStateFault>()(
  "InvalidCustomDBEngineVersionStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidCustomDBEngineVersionStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBClusterEndpointStateFault extends S.TaggedError<InvalidDBClusterEndpointStateFault>()(
  "InvalidDBClusterEndpointStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidDBClusterEndpointStateFault",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterSnapshotNotFoundFault extends S.TaggedError<DBClusterSnapshotNotFoundFault>()(
  "DBClusterSnapshotNotFoundFault",
  {},
  T.AwsQueryError({
    code: "DBClusterSnapshotNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class DBProxyEndpointNotFoundFault extends S.TaggedError<DBProxyEndpointNotFoundFault>()(
  "DBProxyEndpointNotFoundFault",
  {},
  T.AwsQueryError({
    code: "DBProxyEndpointNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class DBSecurityGroupNotFoundFault extends S.TaggedError<DBSecurityGroupNotFoundFault>()(
  "DBSecurityGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSecurityGroupNotFound", httpResponseCode: 404 }),
) {}
export class InvalidDBShardGroupStateFault extends S.TaggedError<InvalidDBShardGroupStateFault>()(
  "InvalidDBShardGroupStateFault",
  {},
  T.AwsQueryError({ code: "InvalidDBShardGroupState", httpResponseCode: 400 }),
) {}
export class DBSubnetGroupNotFoundFault extends S.TaggedError<DBSubnetGroupNotFoundFault>()(
  "DBSubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class InvalidOptionGroupStateFault extends S.TaggedError<InvalidOptionGroupStateFault>()(
  "InvalidOptionGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidOptionGroupStateFault",
    httpResponseCode: 400,
  }),
) {}
export class DBSnapshotAlreadyExistsFault extends S.TaggedError<DBSnapshotAlreadyExistsFault>()(
  "DBSnapshotAlreadyExistsFault",
  {},
  T.AwsQueryError({ code: "DBSnapshotAlreadyExists", httpResponseCode: 400 }),
) {}
export class DBProxyNotFoundFault extends S.TaggedError<DBProxyNotFoundFault>()(
  "DBProxyNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBProxyNotFoundFault", httpResponseCode: 404 }),
) {}
export class DBSnapshotNotFoundFault extends S.TaggedError<DBSnapshotNotFoundFault>()(
  "DBSnapshotNotFoundFault",
  {},
  T.AwsQueryError({ code: "DBSnapshotNotFound", httpResponseCode: 404 }),
) {}
export class ExportTaskNotFoundFault extends S.TaggedError<ExportTaskNotFoundFault>()(
  "ExportTaskNotFoundFault",
  {},
  T.AwsQueryError({ code: "ExportTaskNotFound", httpResponseCode: 404 }),
) {}
export class GlobalClusterNotFoundFault extends S.TaggedError<GlobalClusterNotFoundFault>()(
  "GlobalClusterNotFoundFault",
  {},
  T.AwsQueryError({
    code: "GlobalClusterNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class OptionGroupNotFoundFault extends S.TaggedError<OptionGroupNotFoundFault>()(
  "OptionGroupNotFoundFault",
  {},
  T.AwsQueryError({ code: "OptionGroupNotFoundFault", httpResponseCode: 404 }),
) {}
export class InvalidResourceStateFault extends S.TaggedError<InvalidResourceStateFault>()(
  "InvalidResourceStateFault",
  {},
  T.AwsQueryError({ code: "InvalidResourceStateFault", httpResponseCode: 400 }),
) {}
export class ResourceNotFoundFault extends S.TaggedError<ResourceNotFoundFault>()(
  "ResourceNotFoundFault",
  {},
  T.AwsQueryError({ code: "ResourceNotFoundFault", httpResponseCode: 404 }),
) {}
export class InvalidDBInstanceStateFault extends S.TaggedError<InvalidDBInstanceStateFault>()(
  "InvalidDBInstanceStateFault",
  {},
  T.AwsQueryError({ code: "InvalidDBInstanceState", httpResponseCode: 400 }),
) {}
export class DBProxyTargetGroupNotFoundFault extends S.TaggedError<DBProxyTargetGroupNotFoundFault>()(
  "DBProxyTargetGroupNotFoundFault",
  {},
  T.AwsQueryError({
    code: "DBProxyTargetGroupNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class InvalidDBClusterSnapshotStateFault extends S.TaggedError<InvalidDBClusterSnapshotStateFault>()(
  "InvalidDBClusterSnapshotStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidDBClusterSnapshotStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBSnapshotStateFault extends S.TaggedError<InvalidDBSnapshotStateFault>()(
  "InvalidDBSnapshotStateFault",
  {},
  T.AwsQueryError({ code: "InvalidDBSnapshotState", httpResponseCode: 400 }),
) {}
export class SharedSnapshotQuotaExceededFault extends S.TaggedError<SharedSnapshotQuotaExceededFault>()(
  "SharedSnapshotQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "SharedSnapshotQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class EventSubscriptionQuotaExceededFault extends S.TaggedError<EventSubscriptionQuotaExceededFault>()(
  "EventSubscriptionQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "EventSubscriptionQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class IntegrationConflictOperationFault extends S.TaggedError<IntegrationConflictOperationFault>()(
  "IntegrationConflictOperationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationConflictOperationFault",
    httpResponseCode: 400,
  }),
) {}
export class IntegrationNotFoundFault extends S.TaggedError<IntegrationNotFoundFault>()(
  "IntegrationNotFoundFault",
  {},
  T.AwsQueryError({ code: "IntegrationNotFoundFault", httpResponseCode: 404 }),
) {}
export class KMSKeyNotAccessibleFault extends S.TaggedError<KMSKeyNotAccessibleFault>()(
  "KMSKeyNotAccessibleFault",
  {},
  T.AwsQueryError({ code: "KMSKeyNotAccessibleFault", httpResponseCode: 400 }),
) {}
export class InvalidGlobalClusterStateFault extends S.TaggedError<InvalidGlobalClusterStateFault>()(
  "InvalidGlobalClusterStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidGlobalClusterStateFault",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterRoleNotFoundFault extends S.TaggedError<DBClusterRoleNotFoundFault>()(
  "DBClusterRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBClusterRoleNotFound", httpResponseCode: 404 }),
) {}
export class DBInstanceRoleNotFoundFault extends S.TaggedError<DBInstanceRoleNotFoundFault>()(
  "DBInstanceRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceRoleNotFound", httpResponseCode: 404 }),
) {}
export class DBSnapshotTenantDatabaseNotFoundFault extends S.TaggedError<DBSnapshotTenantDatabaseNotFoundFault>()(
  "DBSnapshotTenantDatabaseNotFoundFault",
  {},
  T.AwsQueryError({
    code: "DBSnapshotTenantDatabaseNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class DBClusterAlreadyExistsFault extends S.TaggedError<DBClusterAlreadyExistsFault>()(
  "DBClusterAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "DBClusterAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterAutomatedBackupNotFoundFault extends S.TaggedError<DBClusterAutomatedBackupNotFoundFault>()(
  "DBClusterAutomatedBackupNotFoundFault",
  {},
  T.AwsQueryError({
    code: "DBClusterAutomatedBackupNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class DBClusterParameterGroupNotFoundFault extends S.TaggedError<DBClusterParameterGroupNotFoundFault>()(
  "DBClusterParameterGroupNotFoundFault",
  {},
  T.AwsQueryError({
    code: "DBClusterParameterGroupNotFound",
    httpResponseCode: 404,
  }),
) {}
export class AuthorizationNotFoundFault extends S.TaggedError<AuthorizationNotFoundFault>()(
  "AuthorizationNotFoundFault",
  {},
  T.AwsQueryError({ code: "AuthorizationNotFound", httpResponseCode: 404 }),
) {}
export class BackupPolicyNotFoundFault extends S.TaggedError<BackupPolicyNotFoundFault>()(
  "BackupPolicyNotFoundFault",
  {},
  T.AwsQueryError({ code: "BackupPolicyNotFoundFault", httpResponseCode: 404 }),
) {}
export class CertificateNotFoundFault extends S.TaggedError<CertificateNotFoundFault>()(
  "CertificateNotFoundFault",
  {},
  T.AwsQueryError({ code: "CertificateNotFound", httpResponseCode: 404 }),
) {}
export class InvalidDBSecurityGroupStateFault extends S.TaggedError<InvalidDBSecurityGroupStateFault>()(
  "InvalidDBSecurityGroupStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidDBSecurityGroupState",
    httpResponseCode: 400,
  }),
) {}
export class DBSubnetGroupDoesNotCoverEnoughAZs extends S.TaggedError<DBSubnetGroupDoesNotCoverEnoughAZs>()(
  "DBSubnetGroupDoesNotCoverEnoughAZs",
  {},
  T.AwsQueryError({
    code: "DBSubnetGroupDoesNotCoverEnoughAZs",
    httpResponseCode: 400,
  }),
) {}
export class DBInstanceAutomatedBackupQuotaExceededFault extends S.TaggedError<DBInstanceAutomatedBackupQuotaExceededFault>()(
  "DBInstanceAutomatedBackupQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "DBInstanceAutomatedBackupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidBlueGreenDeploymentStateFault extends S.TaggedError<InvalidBlueGreenDeploymentStateFault>()(
  "InvalidBlueGreenDeploymentStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidBlueGreenDeploymentStateFault",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterRoleAlreadyExistsFault extends S.TaggedError<DBClusterRoleAlreadyExistsFault>()(
  "DBClusterRoleAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterRoleAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class DBInstanceRoleAlreadyExistsFault extends S.TaggedError<DBInstanceRoleAlreadyExistsFault>()(
  "DBInstanceRoleAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBInstanceRoleAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class SourceNotFoundFault extends S.TaggedError<SourceNotFoundFault>()(
  "SourceNotFoundFault",
  {},
  T.AwsQueryError({ code: "SourceNotFound", httpResponseCode: 404 }),
) {}
export class SubscriptionNotFoundFault extends S.TaggedError<SubscriptionNotFoundFault>()(
  "SubscriptionNotFoundFault",
  {},
  T.AwsQueryError({ code: "SubscriptionNotFound", httpResponseCode: 404 }),
) {}
export class TenantDatabaseNotFoundFault extends S.TaggedError<TenantDatabaseNotFoundFault>()(
  "TenantDatabaseNotFoundFault",
  {},
  T.AwsQueryError({ code: "TenantDatabaseNotFound", httpResponseCode: 404 }),
) {}
export class DBParameterGroupQuotaExceededFault extends S.TaggedError<DBParameterGroupQuotaExceededFault>()(
  "DBParameterGroupQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "DBParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterSnapshotAlreadyExistsFault extends S.TaggedError<DBClusterSnapshotAlreadyExistsFault>()(
  "DBClusterSnapshotAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "DBClusterSnapshotAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotQuotaExceededFault extends S.TaggedError<SnapshotQuotaExceededFault>()(
  "SnapshotQuotaExceededFault",
  {},
  T.AwsQueryError({ code: "SnapshotQuotaExceeded", httpResponseCode: 400 }),
) {}
export class DBClusterQuotaExceededFault extends S.TaggedError<DBClusterQuotaExceededFault>()(
  "DBClusterQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "DBClusterQuotaExceededFault",
    httpResponseCode: 403,
  }),
) {}
export class DBClusterEndpointAlreadyExistsFault extends S.TaggedError<DBClusterEndpointAlreadyExistsFault>()(
  "DBClusterEndpointAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterEndpointAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class DBInstanceAlreadyExistsFault extends S.TaggedError<DBInstanceAlreadyExistsFault>()(
  "DBInstanceAlreadyExistsFault",
  {},
  T.AwsQueryError({ code: "DBInstanceAlreadyExists", httpResponseCode: 400 }),
) {}
export class DomainNotFoundFault extends S.TaggedError<DomainNotFoundFault>()(
  "DomainNotFoundFault",
  {},
  T.AwsQueryError({ code: "DomainNotFoundFault", httpResponseCode: 404 }),
) {}
export class DBProxyAlreadyExistsFault extends S.TaggedError<DBProxyAlreadyExistsFault>()(
  "DBProxyAlreadyExistsFault",
  {},
  T.AwsQueryError({ code: "DBProxyAlreadyExistsFault", httpResponseCode: 400 }),
) {}
export class DBProxyEndpointAlreadyExistsFault extends S.TaggedError<DBProxyEndpointAlreadyExistsFault>()(
  "DBProxyEndpointAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "DBProxyEndpointAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class DBSecurityGroupAlreadyExistsFault extends S.TaggedError<DBSecurityGroupAlreadyExistsFault>()(
  "DBSecurityGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSecurityGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
) {}
export class SNSInvalidTopicFault extends S.TaggedError<SNSInvalidTopicFault>()(
  "SNSInvalidTopicFault",
  {},
  T.AwsQueryError({ code: "SNSInvalidTopic", httpResponseCode: 400 }),
) {}
export class IntegrationAlreadyExistsFault extends S.TaggedError<IntegrationAlreadyExistsFault>()(
  "IntegrationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class OptionGroupAlreadyExistsFault extends S.TaggedError<OptionGroupAlreadyExistsFault>()(
  "OptionGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OptionGroupAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class DBInstanceAutomatedBackupNotFoundFault extends S.TaggedError<DBInstanceAutomatedBackupNotFoundFault>()(
  "DBInstanceAutomatedBackupNotFoundFault",
  {},
  T.AwsQueryError({
    code: "DBInstanceAutomatedBackupNotFound",
    httpResponseCode: 404,
  }),
) {}
export class InvalidDBInstanceAutomatedBackupStateFault extends S.TaggedError<InvalidDBInstanceAutomatedBackupStateFault>()(
  "InvalidDBInstanceAutomatedBackupStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidDBInstanceAutomatedBackupState",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBProxyEndpointStateFault extends S.TaggedError<InvalidDBProxyEndpointStateFault>()(
  "InvalidDBProxyEndpointStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBProxyEndpointStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBSubnetGroupStateFault extends S.TaggedError<InvalidDBSubnetGroupStateFault>()(
  "InvalidDBSubnetGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBSubnetGroupStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidEventSubscriptionStateFault extends S.TaggedError<InvalidEventSubscriptionStateFault>()(
  "InvalidEventSubscriptionStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidEventSubscriptionState",
    httpResponseCode: 400,
  }),
) {}
export class InvalidIntegrationStateFault extends S.TaggedError<InvalidIntegrationStateFault>()(
  "InvalidIntegrationStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidIntegrationStateFault",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterBacktrackNotFoundFault extends S.TaggedError<DBClusterBacktrackNotFoundFault>()(
  "DBClusterBacktrackNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterBacktrackNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class DBInstanceNotReadyFault extends S.TaggedError<DBInstanceNotReadyFault>()(
  "DBInstanceNotReadyFault",
  {},
  T.AwsQueryError({ code: "DBInstanceNotReady", httpResponseCode: 400 }),
) {}
export class InvalidDBClusterCapacityFault extends S.TaggedError<InvalidDBClusterCapacityFault>()(
  "InvalidDBClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterCapacityFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBProxyStateFault extends S.TaggedError<InvalidDBProxyStateFault>()(
  "InvalidDBProxyStateFault",
  {},
  T.AwsQueryError({ code: "InvalidDBProxyStateFault", httpResponseCode: 400 }),
) {}
export class SNSNoAuthorizationFault extends S.TaggedError<SNSNoAuthorizationFault>()(
  "SNSNoAuthorizationFault",
  {},
  T.AwsQueryError({ code: "SNSNoAuthorization", httpResponseCode: 400 }),
) {}
export class GlobalClusterAlreadyExistsFault extends S.TaggedError<GlobalClusterAlreadyExistsFault>()(
  "GlobalClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class ReservedDBInstanceAlreadyExistsFault extends S.TaggedError<ReservedDBInstanceAlreadyExistsFault>()(
  "ReservedDBInstanceAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedDBInstanceAlreadyExists",
    httpResponseCode: 404,
  }),
) {}
export class DBProxyTargetAlreadyRegisteredFault extends S.TaggedError<DBProxyTargetAlreadyRegisteredFault>()(
  "DBProxyTargetAlreadyRegisteredFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBProxyTargetAlreadyRegisteredFault",
    httpResponseCode: 400,
  }),
) {}
export class InsufficientDBClusterCapacityFault extends S.TaggedError<InsufficientDBClusterCapacityFault>()(
  "InsufficientDBClusterCapacityFault",
  {},
  T.AwsQueryError({
    code: "InsufficientDBClusterCapacityFault",
    httpResponseCode: 403,
  }),
) {}
export class InsufficientDBInstanceCapacityFault extends S.TaggedError<InsufficientDBInstanceCapacityFault>()(
  "InsufficientDBInstanceCapacityFault",
  {},
  T.AwsQueryError({
    code: "InsufficientDBInstanceCapacity",
    httpResponseCode: 400,
  }),
) {}
export class InsufficientStorageClusterCapacityFault extends S.TaggedError<InsufficientStorageClusterCapacityFault>()(
  "InsufficientStorageClusterCapacityFault",
  {},
  T.AwsQueryError({
    code: "InsufficientStorageClusterCapacity",
    httpResponseCode: 400,
  }),
) {}
export class InstanceQuotaExceededFault extends S.TaggedError<InstanceQuotaExceededFault>()(
  "InstanceQuotaExceededFault",
  {},
  T.AwsQueryError({ code: "InstanceQuotaExceeded", httpResponseCode: 400 }),
) {}
export class InvalidRestoreFault extends S.TaggedError<InvalidRestoreFault>()(
  "InvalidRestoreFault",
  {},
  T.AwsQueryError({ code: "InvalidRestoreFault", httpResponseCode: 400 }),
) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  {},
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
) {}
export class NetworkTypeNotSupported extends S.TaggedError<NetworkTypeNotSupported>()(
  "NetworkTypeNotSupported",
  {},
  T.AwsQueryError({ code: "NetworkTypeNotSupported", httpResponseCode: 400 }),
) {}
export class VpcEncryptionControlViolationException extends S.TaggedError<VpcEncryptionControlViolationException>()(
  "VpcEncryptionControlViolationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "VpcEncryptionControlViolationException",
    httpResponseCode: 400,
  }),
) {}
export class ExportTaskAlreadyExistsFault extends S.TaggedError<ExportTaskAlreadyExistsFault>()(
  "ExportTaskAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ExportTaskAlreadyExists", httpResponseCode: 400 }),
) {}
export class DBClusterRoleQuotaExceededFault extends S.TaggedError<DBClusterRoleQuotaExceededFault>()(
  "DBClusterRoleQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterRoleQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class DBInstanceRoleQuotaExceededFault extends S.TaggedError<DBInstanceRoleQuotaExceededFault>()(
  "DBInstanceRoleQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBInstanceRoleQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidExportTaskStateFault extends S.TaggedError<InvalidExportTaskStateFault>()(
  "InvalidExportTaskStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidExportTaskStateFault",
    httpResponseCode: 400,
  }),
) {}
export class CustomAvailabilityZoneNotFoundFault extends S.TaggedError<CustomAvailabilityZoneNotFoundFault>()(
  "CustomAvailabilityZoneNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomAvailabilityZoneNotFound",
    httpResponseCode: 404,
  }),
) {}
export class OptionGroupQuotaExceededFault extends S.TaggedError<OptionGroupQuotaExceededFault>()(
  "OptionGroupQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "OptionGroupQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class CreateCustomDBEngineVersionFault extends S.TaggedError<CreateCustomDBEngineVersionFault>()(
  "CreateCustomDBEngineVersionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CreateCustomDBEngineVersionFault",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterEndpointQuotaExceededFault extends S.TaggedError<DBClusterEndpointQuotaExceededFault>()(
  "DBClusterEndpointQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterEndpointQuotaExceededFault",
    httpResponseCode: 403,
  }),
) {}
export class DBProxyQuotaExceededFault extends S.TaggedError<DBProxyQuotaExceededFault>()(
  "DBProxyQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBProxyQuotaExceededFault", httpResponseCode: 400 }),
) {}
export class DBProxyEndpointQuotaExceededFault extends S.TaggedError<DBProxyEndpointQuotaExceededFault>()(
  "DBProxyEndpointQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBProxyEndpointQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class DBSecurityGroupNotSupportedFault extends S.TaggedError<DBSecurityGroupNotSupportedFault>()(
  "DBSecurityGroupNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSecurityGroupNotSupported",
    httpResponseCode: 400,
  }),
) {}
export class MaxDBShardGroupLimitReached extends S.TaggedError<MaxDBShardGroupLimitReached>()(
  "MaxDBShardGroupLimitReached",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "MaxDBShardGroupLimitReached",
    httpResponseCode: 400,
  }),
) {}
export class SNSTopicArnNotFoundFault extends S.TaggedError<SNSTopicArnNotFoundFault>()(
  "SNSTopicArnNotFoundFault",
  {},
  T.AwsQueryError({ code: "SNSTopicArnNotFound", httpResponseCode: 404 }),
) {}
export class IntegrationQuotaExceededFault extends S.TaggedError<IntegrationQuotaExceededFault>()(
  "IntegrationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class TenantDatabaseAlreadyExistsFault extends S.TaggedError<TenantDatabaseAlreadyExistsFault>()(
  "TenantDatabaseAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "TenantDatabaseAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBSubnetStateFault extends S.TaggedError<InvalidDBSubnetStateFault>()(
  "InvalidDBSubnetStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSubnetStateFault", httpResponseCode: 400 }),
) {}
export class DBProxyTargetNotFoundFault extends S.TaggedError<DBProxyTargetNotFoundFault>()(
  "DBProxyTargetNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBProxyTargetNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class ReservedDBInstancesOfferingNotFoundFault extends S.TaggedError<ReservedDBInstancesOfferingNotFoundFault>()(
  "ReservedDBInstancesOfferingNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedDBInstancesOfferingNotFound",
    httpResponseCode: 404,
  }),
) {}
export class DBLogFileNotFoundFault extends S.TaggedError<DBLogFileNotFoundFault>()(
  "DBLogFileNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBLogFileNotFoundFault", httpResponseCode: 404 }),
) {}
export class DBUpgradeDependencyFailureFault extends S.TaggedError<DBUpgradeDependencyFailureFault>()(
  "DBUpgradeDependencyFailureFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBUpgradeDependencyFailure",
    httpResponseCode: 400,
  }),
) {}
export class ProvisionedIopsNotAvailableInAZFault extends S.TaggedError<ProvisionedIopsNotAvailableInAZFault>()(
  "ProvisionedIopsNotAvailableInAZFault",
  {},
  T.AwsQueryError({
    code: "ProvisionedIopsNotAvailableInAZFault",
    httpResponseCode: 400,
  }),
) {}
export class StorageQuotaExceededFault extends S.TaggedError<StorageQuotaExceededFault>()(
  "StorageQuotaExceededFault",
  {},
  T.AwsQueryError({ code: "StorageQuotaExceeded", httpResponseCode: 400 }),
) {}
export class StorageTypeNotSupportedFault extends S.TaggedError<StorageTypeNotSupportedFault>()(
  "StorageTypeNotSupportedFault",
  {},
  T.AwsQueryError({ code: "StorageTypeNotSupported", httpResponseCode: 400 }),
) {}
export class TenantDatabaseQuotaExceededFault extends S.TaggedError<TenantDatabaseQuotaExceededFault>()(
  "TenantDatabaseQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "TenantDatabaseQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class DBSubnetQuotaExceededFault extends S.TaggedError<DBSubnetQuotaExceededFault>()(
  "DBSubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class ReservedDBInstanceQuotaExceededFault extends S.TaggedError<ReservedDBInstanceQuotaExceededFault>()(
  "ReservedDBInstanceQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedDBInstanceQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InsufficientAvailableIPsInSubnetFault extends S.TaggedError<InsufficientAvailableIPsInSubnetFault>()(
  "InsufficientAvailableIPsInSubnetFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientAvailableIPsInSubnetFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidS3BucketFault extends S.TaggedError<InvalidS3BucketFault>()(
  "InvalidS3BucketFault",
  {},
  T.AwsQueryError({ code: "InvalidS3BucketFault", httpResponseCode: 400 }),
) {}
export class PointInTimeRestoreNotEnabledFault extends S.TaggedError<PointInTimeRestoreNotEnabledFault>()(
  "PointInTimeRestoreNotEnabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "PointInTimeRestoreNotEnabled",
    httpResponseCode: 400,
  }),
) {}
export class IamRoleMissingPermissionsFault extends S.TaggedError<IamRoleMissingPermissionsFault>()(
  "IamRoleMissingPermissionsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "IamRoleMissingPermissions", httpResponseCode: 400 }),
) {}
export class AuthorizationAlreadyExistsFault extends S.TaggedError<AuthorizationAlreadyExistsFault>()(
  "AuthorizationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthorizationAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class BlueGreenDeploymentAlreadyExistsFault extends S.TaggedError<BlueGreenDeploymentAlreadyExistsFault>()(
  "BlueGreenDeploymentAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "BlueGreenDeploymentAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class CustomDBEngineVersionAlreadyExistsFault extends S.TaggedError<CustomDBEngineVersionAlreadyExistsFault>()(
  "CustomDBEngineVersionAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomDBEngineVersionAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBSubnetGroupFault extends S.TaggedError<InvalidDBSubnetGroupFault>()(
  "InvalidDBSubnetGroupFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSubnetGroupFault", httpResponseCode: 400 }),
) {}
export class DBSecurityGroupQuotaExceededFault extends S.TaggedError<DBSecurityGroupQuotaExceededFault>()(
  "DBSecurityGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "QuotaExceeded.DBSecurityGroup",
    httpResponseCode: 400,
  }),
) {}
export class UnsupportedDBEngineVersionFault extends S.TaggedError<UnsupportedDBEngineVersionFault>()(
  "UnsupportedDBEngineVersionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnsupportedDBEngineVersion",
    httpResponseCode: 400,
  }),
) {}
export class SubscriptionAlreadyExistFault extends S.TaggedError<SubscriptionAlreadyExistFault>()(
  "SubscriptionAlreadyExistFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionAlreadyExist", httpResponseCode: 400 }),
) {}
export class SubscriptionCategoryNotFoundFault extends S.TaggedError<SubscriptionCategoryNotFoundFault>()(
  "SubscriptionCategoryNotFoundFault",
  {},
  T.AwsQueryError({
    code: "SubscriptionCategoryNotFound",
    httpResponseCode: 404,
  }),
) {}
export class GlobalClusterQuotaExceededFault extends S.TaggedError<GlobalClusterQuotaExceededFault>()(
  "GlobalClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterAutomatedBackupQuotaExceededFault extends S.TaggedError<DBClusterAutomatedBackupQuotaExceededFault>()(
  "DBClusterAutomatedBackupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterAutomatedBackupQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBClusterAutomatedBackupStateFault extends S.TaggedError<InvalidDBClusterAutomatedBackupStateFault>()(
  "InvalidDBClusterAutomatedBackupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterAutomatedBackupStateFault",
    httpResponseCode: 400,
  }),
) {}
export class ReservedDBInstanceNotFoundFault extends S.TaggedError<ReservedDBInstanceNotFoundFault>()(
  "ReservedDBInstanceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedDBInstanceNotFound",
    httpResponseCode: 404,
  }),
) {}
export class SubnetAlreadyInUse extends S.TaggedError<SubnetAlreadyInUse>()(
  "SubnetAlreadyInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetAlreadyInUse", httpResponseCode: 400 }),
) {}
export class IamRoleNotFoundFault extends S.TaggedError<IamRoleNotFoundFault>()(
  "IamRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "IamRoleNotFound", httpResponseCode: 404 }),
) {}
export class AuthorizationQuotaExceededFault extends S.TaggedError<AuthorizationQuotaExceededFault>()(
  "AuthorizationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthorizationQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class SourceClusterNotSupportedFault extends S.TaggedError<SourceClusterNotSupportedFault>()(
  "SourceClusterNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SourceClusterNotSupportedFault",
    httpResponseCode: 400,
  }),
) {}
export class CustomDBEngineVersionQuotaExceededFault extends S.TaggedError<CustomDBEngineVersionQuotaExceededFault>()(
  "CustomDBEngineVersionQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomDBEngineVersionQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class DBSubnetGroupNotAllowedFault extends S.TaggedError<DBSubnetGroupNotAllowedFault>()(
  "DBSubnetGroupNotAllowedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupNotAllowedFault",
    httpResponseCode: 400,
  }),
) {}
export class DBSubnetGroupAlreadyExistsFault extends S.TaggedError<DBSubnetGroupAlreadyExistsFault>()(
  "DBSubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class StorageTypeNotAvailableFault extends S.TaggedError<StorageTypeNotAvailableFault>()(
  "StorageTypeNotAvailableFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "StorageTypeNotAvailableFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidExportOnlyFault extends S.TaggedError<InvalidExportOnlyFault>()(
  "InvalidExportOnlyFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidExportOnly", httpResponseCode: 400 }),
) {}
export class SourceDatabaseNotSupportedFault extends S.TaggedError<SourceDatabaseNotSupportedFault>()(
  "SourceDatabaseNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SourceDatabaseNotSupportedFault",
    httpResponseCode: 400,
  }),
) {}
export class Ec2ImagePropertiesNotSupportedFault extends S.TaggedError<Ec2ImagePropertiesNotSupportedFault>()(
  "Ec2ImagePropertiesNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "Ec2ImagePropertiesNotSupportedFault",
    httpResponseCode: 400,
  }),
) {}
export class DBSubnetGroupQuotaExceededFault extends S.TaggedError<DBSubnetGroupQuotaExceededFault>()(
  "DBSubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidExportSourceStateFault extends S.TaggedError<InvalidExportSourceStateFault>()(
  "InvalidExportSourceStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidExportSourceState", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Modifies the parameters of a DB parameter group to the engine/system default value.
 * To reset specific parameters, provide a list of the following:
 * `ParameterName` and `ApplyMethod`. To reset the entire DB
 * parameter group, specify the `DBParameterGroup` name and
 * `ResetAllParameters` parameters. When resetting the entire group, dynamic
 * parameters are updated immediately and static parameters are set to
 * `pending-reboot` to take effect on the next DB instance restart or
 * `RebootDBInstance` request.
 */
export const resetDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetDBParameterGroupMessage,
    output: DBParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }),
);
/**
 * Deletes a custom engine version. To run this command, make sure you meet the following prerequisites:
 *
 * - The CEV must not be the default for RDS Custom. If it is, change the default
 * before running this command.
 *
 * - The CEV must not be associated with an RDS Custom DB instance, RDS Custom instance snapshot,
 * or automated backup of your RDS Custom instance.
 *
 * Typically, deletion takes a few minutes.
 *
 * The MediaImport service that imports files from Amazon S3 to create CEVs isn't integrated with
 * Amazon Web Services CloudTrail. If you turn on data logging for Amazon RDS in CloudTrail, calls to the
 * `DeleteCustomDbEngineVersion` event aren't logged. However, you might see calls from the
 * API gateway that accesses your Amazon S3 bucket. These calls originate from the MediaImport service for
 * the `DeleteCustomDbEngineVersion` event.
 *
 * For more information, see Deleting a
 * CEV in the *Amazon RDS User Guide*.
 */
export const deleteCustomDBEngineVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCustomDBEngineVersionMessage,
    output: DBEngineVersion,
    errors: [
      CustomDBEngineVersionNotFoundFault,
      InvalidCustomDBEngineVersionStateFault,
    ],
  }),
);
/**
 * Deletes a custom endpoint and removes it from an Amazon Aurora DB cluster.
 *
 * This action only applies to Aurora DB clusters.
 */
export const deleteDBClusterEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDBClusterEndpointMessage,
    output: DBClusterEndpoint,
    errors: [
      DBClusterEndpointNotFoundFault,
      InvalidDBClusterEndpointStateFault,
      InvalidDBClusterStateFault,
    ],
  }),
);
/**
 * Deletes a specified DB cluster parameter group. The DB cluster parameter group to be deleted can't be associated with any DB clusters.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const deleteDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDBClusterParameterGroupMessage,
    output: DeleteDBClusterParameterGroupResponse,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }));
/**
 * Deletes a specified DB parameter group. The DB parameter group to be deleted can't be associated with any DB instances.
 */
export const deleteDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDBParameterGroupMessage,
    output: DeleteDBParameterGroupResponse,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }),
);
/**
 * Deletes an Aurora Limitless Database DB shard group.
 */
export const deleteDBShardGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBShardGroupMessage,
  output: DBShardGroup,
  errors: [
    DBShardGroupNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBShardGroupStateFault,
  ],
}));
/**
 * Lists all of the attributes for a customer account. The attributes include Amazon RDS quotas for the account, such as the number of DB instances allowed. The description for a quota includes the quota name, current usage toward that quota, and the quota's maximum value.
 *
 * This command doesn't take any parameters.
 */
export const describeAccountAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountAttributesMessage,
    output: AccountAttributesMessage,
    errors: [],
  }),
);
/**
 * Returns information about endpoints for an Amazon Aurora DB cluster.
 *
 * This action only applies to Aurora DB clusters.
 */
export const describeDBClusterEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBClusterEndpointsMessage,
    output: DBClusterEndpointMessage,
    errors: [DBClusterNotFoundFault],
  }),
);
/**
 * Returns a list of `DBClusterParameterGroup` descriptions. If a
 * `DBClusterParameterGroupName` parameter is specified,
 * the list will contain only the description of the specified DB cluster parameter group.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const describeDBClusterParameterGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDBClusterParameterGroupsMessage,
    output: DBClusterParameterGroupsMessage,
    errors: [DBParameterGroupNotFoundFault],
  }));
/**
 * Returns the detailed parameter list for a particular DB cluster parameter group.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const describeDBClusterParameters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBClusterParametersMessage,
    output: DBClusterParameterGroupDetails,
    errors: [DBParameterGroupNotFoundFault],
  }),
);
/**
 * Describes existing Amazon Aurora DB clusters and Multi-AZ DB clusters. This API supports pagination.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 *
 * This operation can also return information for Amazon Neptune DB instances and Amazon DocumentDB instances.
 */
export const describeDBClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDBClustersMessage,
  output: DBClusterMessage,
  errors: [DBClusterNotFoundFault],
}));
/**
 * Returns information about DB cluster snapshots. This API action supports pagination.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const describeDBClusterSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBClusterSnapshotsMessage,
    output: DBClusterSnapshotMessage,
    errors: [DBClusterSnapshotNotFoundFault],
  }),
);
/**
 * Describes the properties of specific versions of DB engines.
 */
export const describeDBEngineVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBEngineVersionsMessage,
    output: DBEngineVersionMessage,
    errors: [],
  }),
);
/**
 * Describes provisioned RDS instances. This API supports pagination.
 *
 * This operation can also return information for Amazon Neptune DB instances and Amazon DocumentDB instances.
 */
export const describeDBInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDBInstancesMessage,
  output: DBInstanceMessage,
  errors: [DBInstanceNotFoundFault],
}));
/**
 * Returns a list of `DBParameterGroup` descriptions. If a `DBParameterGroupName` is specified,
 * the list will contain only the description of the specified DB parameter group.
 */
export const describeDBParameterGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBParameterGroupsMessage,
    output: DBParameterGroupsMessage,
    errors: [DBParameterGroupNotFoundFault],
  }),
);
/**
 * Returns the detailed parameter list for a particular DB parameter group.
 */
export const describeDBParameters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBParametersMessage,
    output: DBParameterGroupDetails,
    errors: [DBParameterGroupNotFoundFault],
  }),
);
/**
 * Returns information about DB proxies.
 */
export const describeDBProxies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDBProxiesRequest,
  output: DescribeDBProxiesResponse,
  errors: [DBProxyNotFoundFault],
}));
/**
 * Returns information about DB proxy endpoints.
 */
export const describeDBProxyEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBProxyEndpointsRequest,
    output: DescribeDBProxyEndpointsResponse,
    errors: [DBProxyEndpointNotFoundFault, DBProxyNotFoundFault],
  }),
);
/**
 * Returns a list of `DBSecurityGroup` descriptions. If a `DBSecurityGroupName` is specified,
 * the list will contain only the descriptions of the specified DB security group.
 *
 * EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that
 * you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the
 * *Amazon EC2 User Guide*, the blog EC2-Classic Networking is Retiring –
 * Here’s How to Prepare, and Moving a DB instance not in a VPC
 * into a VPC in the *Amazon RDS User Guide*.
 */
export const describeDBSecurityGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBSecurityGroupsMessage,
    output: DBSecurityGroupMessage,
    errors: [DBSecurityGroupNotFoundFault],
  }),
);
/**
 * Describes existing Aurora Limitless Database DB shard groups.
 */
export const describeDBShardGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBShardGroupsMessage,
    output: DescribeDBShardGroupsResponse,
    errors: [DBClusterNotFoundFault, DBShardGroupNotFoundFault],
  }),
);
/**
 * Returns information about DB snapshots. This API action supports pagination.
 */
export const describeDBSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDBSnapshotsMessage,
  output: DBSnapshotMessage,
  errors: [DBSnapshotNotFoundFault],
}));
/**
 * Returns a list of DBSubnetGroup descriptions. If a DBSubnetGroupName is specified, the list will contain only the descriptions of the specified DBSubnetGroup.
 *
 * For an overview of CIDR ranges, go to the
 * Wikipedia Tutorial.
 */
export const describeDBSubnetGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBSubnetGroupsMessage,
    output: DBSubnetGroupMessage,
    errors: [DBSubnetGroupNotFoundFault],
  }),
);
/**
 * Returns the default engine and system parameter information for the specified database engine.
 */
export const describeEngineDefaultParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEngineDefaultParametersMessage,
    output: DescribeEngineDefaultParametersResult,
    errors: [],
  }));
/**
 * Returns information about a snapshot or cluster export to Amazon S3. This API operation supports
 * pagination.
 */
export const describeExportTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExportTasksMessage,
  output: ExportTasksMessage,
  errors: [ExportTaskNotFoundFault],
}));
/**
 * Returns information about Aurora global database clusters. This API supports pagination.
 *
 * For more information on Amazon Aurora, see What is Amazon Aurora? in the
 * *Amazon Aurora User Guide*.
 *
 * This action only applies to Aurora DB clusters.
 */
export const describeGlobalClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGlobalClustersMessage,
    output: GlobalClustersMessage,
    errors: [GlobalClusterNotFoundFault],
  }),
);
/**
 * Describes the available option groups.
 */
export const describeOptionGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeOptionGroupsMessage,
    output: OptionGroups,
    errors: [OptionGroupNotFoundFault],
  }),
);
/**
 * Describes the tenant databases in a DB instance that uses the multi-tenant
 * configuration. Only RDS for Oracle CDB instances are supported.
 */
export const describeTenantDatabases = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTenantDatabasesMessage,
    output: TenantDatabasesMessage,
    errors: [DBInstanceNotFoundFault],
  }),
);
/**
 * Enables the HTTP endpoint for the DB cluster. By default, the HTTP endpoint
 * isn't enabled.
 *
 * When enabled, this endpoint provides a connectionless web service API (RDS Data API)
 * for running SQL queries on the Aurora DB cluster. You can also query your database from inside the RDS console
 * with the RDS query editor.
 *
 * For more information, see Using RDS Data API in the
 * *Amazon Aurora User Guide*.
 *
 * This operation applies only to Aurora Serverless v2 and provisioned DB clusters. To enable the HTTP endpoint for Aurora Serverless v1 DB clusters,
 * use the `EnableHttpEndpoint` parameter of the `ModifyDBCluster` operation.
 */
export const enableHttpEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableHttpEndpointRequest,
  output: EnableHttpEndpointResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Forces a failover for a DB cluster.
 *
 * For an Aurora DB cluster, failover for a DB cluster promotes one of the Aurora Replicas (read-only instances)
 * in the DB cluster to be the primary DB instance (the cluster writer).
 *
 * For a Multi-AZ DB cluster, after RDS terminates the primary DB instance, the
 * internal monitoring system detects that the primary DB instance is unhealthy and promotes a readable standby (read-only instances)
 * in the DB cluster to be the primary DB instance (the cluster writer).
 * Failover times are typically less than 35 seconds.
 *
 * An Amazon Aurora DB cluster automatically fails over to an Aurora Replica, if one exists,
 * when the primary DB instance fails. A Multi-AZ DB cluster automatically fails over to a readable standby
 * DB instance when the primary DB instance fails.
 *
 * To simulate a failure of a primary instance for testing, you can force a failover.
 * Because each instance in a DB cluster has its own endpoint address, make sure to clean up and re-establish any existing
 * connections that use those endpoint addresses when the failover is complete.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const failoverDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FailoverDBClusterMessage,
  output: FailoverDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * Changes the audit policy state of a database activity stream to either locked (default) or unlocked. A locked policy is read-only,
 * whereas an unlocked policy is read/write. If your activity stream is started and locked, you can unlock it, customize your audit policy,
 * and then lock your activity stream. Restarting the activity stream isn't required. For more information, see Modifying a database activity stream in the
 * *Amazon RDS User Guide*.
 *
 * This operation is supported for RDS for Oracle and Microsoft SQL Server.
 */
export const modifyActivityStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyActivityStreamRequest,
    output: ModifyActivityStreamResponse,
    errors: [
      DBInstanceNotFoundFault,
      InvalidDBInstanceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Modifies the status of a custom engine version (CEV). You can find CEVs to modify by calling
 * `DescribeDBEngineVersions`.
 *
 * The MediaImport service that imports files from Amazon S3 to create CEVs isn't integrated with
 * Amazon Web Services CloudTrail. If you turn on data logging for Amazon RDS in CloudTrail, calls to the
 * `ModifyCustomDbEngineVersion` event aren't logged. However, you might see calls from the
 * API gateway that accesses your Amazon S3 bucket. These calls originate from the MediaImport service for
 * the `ModifyCustomDbEngineVersion` event.
 *
 * For more information, see Modifying CEV status
 * in the *Amazon RDS User Guide*.
 */
export const modifyCustomDBEngineVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyCustomDBEngineVersionMessage,
    output: DBEngineVersion,
    errors: [
      CustomDBEngineVersionNotFoundFault,
      InvalidCustomDBEngineVersionStateFault,
    ],
  }),
);
/**
 * Modifies the properties of an endpoint in an Amazon Aurora DB cluster.
 *
 * This operation only applies to Aurora DB clusters.
 */
export const modifyDBClusterEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyDBClusterEndpointMessage,
    output: DBClusterEndpoint,
    errors: [
      DBClusterEndpointNotFoundFault,
      DBInstanceNotFoundFault,
      InvalidDBClusterEndpointStateFault,
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
    ],
  }),
);
/**
 * Modifies the parameters of a DB cluster parameter group. To modify more than one parameter,
 * submit a list of the following: `ParameterName`, `ParameterValue`,
 * and `ApplyMethod`. A maximum of 20
 * parameters can be modified in a single request.
 *
 * There are two types of parameters - dynamic parameters and static parameters. Changes to dynamic parameters are applied to the DB cluster immediately without a reboot.
 * Changes to static parameters are applied only after the DB cluster is rebooted, which can be done using `RebootDBCluster` operation. You can use the
 * *Parameter Groups* option of the Amazon RDS console or the
 * `DescribeDBClusterParameters` operation to verify
 * that your DB cluster parameter group has been created or modified.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const modifyDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyDBClusterParameterGroupMessage,
    output: DBClusterParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }));
/**
 * Modifies the parameters of a DB parameter group. To modify more than one parameter,
 * submit a list of the following: `ParameterName`, `ParameterValue`, and
 * `ApplyMethod`. A maximum of 20 parameters can be modified in a single request.
 *
 * After you modify a DB parameter group, you should wait at least 5 minutes
 * before creating your first DB instance that uses that DB parameter group as the default parameter
 * group. This allows Amazon RDS to fully complete the modify operation before the parameter
 * group is used as the default for a new DB instance. This is especially important for parameters
 * that are critical when creating the default database for a DB instance, such as the character set
 * for the default database defined by the `character_set_database` parameter. You can use the
 * *Parameter Groups* option of the Amazon RDS console or the
 * *DescribeDBParameters* command to verify
 * that your DB parameter group has been created or modified.
 */
export const modifyDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyDBParameterGroupMessage,
    output: DBParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }),
);
/**
 * Modifies the settings of an Aurora Limitless Database DB shard group. You can change one or more settings by
 * specifying these parameters and the new values in the request.
 */
export const modifyDBShardGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBShardGroupMessage,
  output: DBShardGroup,
  errors: [
    DBShardGroupAlreadyExistsFault,
    DBShardGroupNotFoundFault,
    InvalidDBClusterStateFault,
  ],
}));
/**
 * Adds an attribute and values to, or removes an attribute and values from, a manual DB snapshot.
 *
 * To share a manual DB snapshot with other Amazon Web Services accounts, specify `restore`
 * as the `AttributeName` and use the `ValuesToAdd` parameter to add
 * a list of IDs of the Amazon Web Services accounts that are authorized to restore the manual DB snapshot.
 * Uses the value `all` to make the manual DB snapshot public, which means it
 * can be copied or restored by all Amazon Web Services accounts.
 *
 * Don't add the `all` value for any manual DB snapshots that
 * contain private information that you don't want available to all Amazon Web Services
 * accounts.
 *
 * If the manual DB snapshot is encrypted, it can be shared, but only by specifying a
 * list of authorized Amazon Web Services account IDs for the `ValuesToAdd` parameter. You
 * can't use `all` as a value for that parameter in this case.
 *
 * To view which Amazon Web Services accounts have access to copy or restore a manual DB snapshot, or
 * whether a manual DB snapshot public or private, use the DescribeDBSnapshotAttributes API operation. The accounts are returned as
 * values for the `restore` attribute.
 */
export const modifyDBSnapshotAttribute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyDBSnapshotAttributeMessage,
    output: ModifyDBSnapshotAttributeResult,
    errors: [
      DBSnapshotNotFoundFault,
      InvalidDBSnapshotStateFault,
      SharedSnapshotQuotaExceededFault,
    ],
  }),
);
/**
 * Promotes a read replica DB instance to a standalone DB instance.
 *
 * - Backup duration is a function of the amount of changes to the database since the previous
 * backup. If you plan to promote a read replica to a standalone instance, we
 * recommend that you enable backups and complete at least one backup prior to
 * promotion. In addition, a read replica cannot be promoted to a standalone
 * instance when it is in the `backing-up` status. If you have
 * enabled backups on your read replica, configure the automated backup window
 * so that daily backups do not interfere with read replica
 * promotion.
 *
 * - This command doesn't apply to Aurora MySQL, Aurora PostgreSQL, or RDS Custom.
 */
export const promoteReadReplica = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PromoteReadReplicaMessage,
  output: PromoteReadReplicaResult,
  errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
}));
/**
 * Promotes a read replica DB cluster to a standalone DB cluster.
 */
export const promoteReadReplicaDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PromoteReadReplicaDBClusterMessage,
    output: PromoteReadReplicaDBClusterResult,
    errors: [DBClusterNotFoundFault, InvalidDBClusterStateFault],
  }),
);
/**
 * You might need to reboot your DB cluster, usually for maintenance reasons.
 * For example, if you make certain modifications,
 * or if you change the DB cluster parameter group associated with the DB cluster,
 * reboot the DB cluster for the changes to take effect.
 *
 * Rebooting a DB cluster restarts the database engine service. Rebooting a DB
 * cluster results in a momentary outage, during which the DB cluster status is set to rebooting.
 *
 * Use this operation only for a non-Aurora Multi-AZ DB cluster.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const rebootDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBClusterMessage,
  output: RebootDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * You might need to reboot your DB instance, usually for maintenance reasons.
 * For example, if you make certain modifications,
 * or if you change the DB parameter group associated with the DB instance,
 * you must reboot the instance for the changes to take effect.
 *
 * Rebooting a DB instance restarts the database engine service.
 * Rebooting a DB instance results in a momentary outage, during which the DB instance status is set to rebooting.
 *
 * For more information about rebooting, see Rebooting a DB Instance in the *Amazon RDS User Guide.*
 *
 * This command doesn't apply to RDS Custom.
 *
 * If your DB instance is part of a Multi-AZ DB cluster, you can reboot the DB cluster with the `RebootDBCluster` operation.
 */
export const rebootDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBInstanceMessage,
  output: RebootDBInstanceResult,
  errors: [
    DBInstanceNotFoundFault,
    InvalidDBInstanceStateFault,
    KMSKeyNotAccessibleFault,
  ],
}));
/**
 * You might need to reboot your DB shard group, usually for maintenance reasons. For example, if you make certain modifications, reboot
 * the DB shard group for the changes to take effect.
 *
 * This operation applies only to Aurora Limitless Database DBb shard groups.
 */
export const rebootDBShardGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBShardGroupMessage,
  output: DBShardGroup,
  errors: [DBShardGroupNotFoundFault, InvalidDBShardGroupStateFault],
}));
/**
 * Detaches an Aurora secondary cluster from an Aurora global database cluster. The cluster becomes a
 * standalone cluster with read-write capability instead of being read-only and receiving data from a
 * primary cluster in a different Region.
 *
 * This operation only applies to Aurora DB clusters.
 */
export const removeFromGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveFromGlobalClusterMessage,
    output: RemoveFromGlobalClusterResult,
    errors: [
      DBClusterNotFoundFault,
      GlobalClusterNotFoundFault,
      InvalidDBClusterStateFault,
      InvalidGlobalClusterStateFault,
    ],
  }),
);
/**
 * Removes the asssociation of an Amazon Web Services Identity and Access Management (IAM) role from a
 * DB cluster.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const removeRoleFromDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveRoleFromDBClusterMessage,
    output: RemoveRoleFromDBClusterResponse,
    errors: [
      DBClusterNotFoundFault,
      DBClusterRoleNotFoundFault,
      InvalidDBClusterStateFault,
    ],
  }),
);
/**
 * Disassociates an Amazon Web Services Identity and Access Management (IAM) role from a DB instance.
 */
export const removeRoleFromDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveRoleFromDBInstanceMessage,
    output: RemoveRoleFromDBInstanceResponse,
    errors: [
      DBInstanceNotFoundFault,
      DBInstanceRoleNotFoundFault,
      InvalidDBInstanceStateFault,
    ],
  }),
);
/**
 * Modifies the parameters of a DB cluster parameter group to the default value. To
 * reset specific parameters submit a list of the following: `ParameterName`
 * and `ApplyMethod`. To reset the
 * entire DB cluster parameter group, specify the `DBClusterParameterGroupName`
 * and `ResetAllParameters` parameters.
 *
 * When resetting the entire group, dynamic parameters are updated immediately and static parameters
 * are set to `pending-reboot` to take effect on the next DB instance restart
 * or `RebootDBInstance` request. You must call `RebootDBInstance` for every
 * DB instance in your DB cluster that you want the updated static parameter to apply to.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const resetDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ResetDBClusterParameterGroupMessage,
    output: DBClusterParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }));
/**
 * Revokes ingress from a DBSecurityGroup for previously authorized IP ranges or EC2 or VPC security groups. Required
 * parameters for this API are one of CIDRIP, EC2SecurityGroupId for VPC, or (EC2SecurityGroupOwnerId and either
 * EC2SecurityGroupName or EC2SecurityGroupId).
 *
 * EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that
 * you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the
 * *Amazon EC2 User Guide*, the blog EC2-Classic Networking is Retiring –
 * Here’s How to Prepare, and Moving a DB instance not in a VPC
 * into a VPC in the *Amazon RDS User Guide*.
 */
export const revokeDBSecurityGroupIngress =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RevokeDBSecurityGroupIngressMessage,
    output: RevokeDBSecurityGroupIngressResult,
    errors: [
      AuthorizationNotFoundFault,
      DBSecurityGroupNotFoundFault,
      InvalidDBSecurityGroupStateFault,
    ],
  }));
/**
 * Starts a database activity stream to monitor activity on the database.
 * For more information, see
 *
 * Monitoring Amazon Aurora with Database Activity Streams
 * in the *Amazon Aurora User Guide* or
 *
 * Monitoring Amazon RDS with Database Activity Streams
 * in the *Amazon RDS User Guide*.
 */
export const startActivityStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartActivityStreamRequest,
  output: StartActivityStreamResponse,
  errors: [
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    KMSKeyNotAccessibleFault,
    ResourceNotFoundFault,
  ],
}));
/**
 * Stops a database activity stream that was started using the Amazon Web Services console,
 * the `start-activity-stream` CLI command, or the `StartActivityStream` operation.
 *
 * For more information, see
 *
 * Monitoring Amazon Aurora with Database Activity Streams
 * in the *Amazon Aurora User Guide*
 * or
 * Monitoring Amazon RDS with Database Activity Streams
 * in the *Amazon RDS User Guide*.
 */
export const stopActivityStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopActivityStreamRequest,
  output: StopActivityStreamResponse,
  errors: [
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    ResourceNotFoundFault,
  ],
}));
/**
 * Stops an Amazon Aurora DB cluster. When you stop a DB cluster, Aurora retains the DB cluster's
 * metadata, including its endpoints and DB parameter groups. Aurora also
 * retains the transaction logs so you can do a point-in-time restore if necessary.
 *
 * For more information, see
 *
 * Stopping and Starting an Aurora Cluster in the *Amazon Aurora User Guide*.
 *
 * This operation only applies to Aurora DB clusters.
 */
export const stopDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDBClusterMessage,
  output: StopDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidDBShardGroupStateFault,
  ],
}));
/**
 * Stops automated backup replication for a DB instance.
 *
 * This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL.
 *
 * For more information, see
 * Replicating Automated Backups to Another Amazon Web Services Region in the *Amazon RDS User Guide.*
 */
export const stopDBInstanceAutomatedBackupsReplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopDBInstanceAutomatedBackupsReplicationMessage,
    output: StopDBInstanceAutomatedBackupsReplicationResult,
    errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
  }));
/**
 * Switches over a blue/green deployment.
 *
 * Before you switch over, production traffic is routed to the databases in the blue environment.
 * After you switch over, production traffic is routed to the databases in the green environment.
 *
 * For more information, see Using Amazon RDS
 * Blue/Green Deployments for database updates in the Amazon RDS User
 * Guide and Using Amazon RDS
 * Blue/Green Deployments for database updates in the Amazon Aurora
 * User Guide.
 */
export const switchoverBlueGreenDeployment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SwitchoverBlueGreenDeploymentRequest,
    output: SwitchoverBlueGreenDeploymentResponse,
    errors: [
      BlueGreenDeploymentNotFoundFault,
      InvalidBlueGreenDeploymentStateFault,
    ],
  }));
/**
 * Switches over the specified secondary DB cluster to be the new primary DB cluster in the global database cluster.
 * Switchover operations were previously called "managed planned failovers."
 *
 * Aurora promotes the specified secondary cluster to assume full read/write capabilities and demotes the current primary cluster
 * to a secondary (read-only) cluster, maintaining the orginal replication topology. All secondary clusters are synchronized with the primary
 * at the beginning of the process so the new primary continues operations for the Aurora global database without losing any data. Your database
 * is unavailable for a short time while the primary and selected secondary clusters are assuming their new roles. For more information about
 * switching over an Aurora global database, see Performing switchovers for Amazon Aurora global databases in the *Amazon Aurora User Guide*.
 *
 * This operation is intended for controlled environments, for operations such as "regional rotation" or to fall back to the original
 * primary after a global database failover.
 */
export const switchoverGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SwitchoverGlobalClusterMessage,
    output: SwitchoverGlobalClusterResult,
    errors: [
      DBClusterNotFoundFault,
      GlobalClusterNotFoundFault,
      InvalidDBClusterStateFault,
      InvalidGlobalClusterStateFault,
    ],
  }),
);
/**
 * Switches over an Oracle standby database in an Oracle Data Guard environment, making it the new
 * primary database. Issue this command in the Region that hosts the current standby database.
 */
export const switchoverReadReplica = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SwitchoverReadReplicaMessage,
    output: SwitchoverReadReplicaResult,
    errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
  }),
);
/**
 * Adds a source identifier to an existing RDS event notification subscription.
 */
export const addSourceIdentifierToSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AddSourceIdentifierToSubscriptionMessage,
    output: AddSourceIdentifierToSubscriptionResult,
    errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
  }));
/**
 * Adds metadata tags to an Amazon RDS resource. These tags can also be used with cost allocation reporting to track cost associated with Amazon RDS resources, or used in a Condition statement in an IAM policy for Amazon RDS.
 *
 * For an overview on tagging your relational database resources,
 * see Tagging Amazon RDS Resources
 * or Tagging Amazon Aurora and Amazon RDS Resources.
 */
export const addTagsToResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceMessage,
  output: AddTagsToResourceResponse,
  errors: [
    BlueGreenDeploymentNotFoundFault,
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    DBProxyEndpointNotFoundFault,
    DBProxyNotFoundFault,
    DBProxyTargetGroupNotFoundFault,
    DBShardGroupNotFoundFault,
    DBSnapshotNotFoundFault,
    DBSnapshotTenantDatabaseNotFoundFault,
    IntegrationNotFoundFault,
    InvalidDBClusterEndpointStateFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    TenantDatabaseNotFoundFault,
  ],
}));
/**
 * Backtracks a DB cluster to a specific time, without creating a new DB cluster.
 *
 * For more information on backtracking, see
 *
 * Backtracking an Aurora DB Cluster in the
 * *Amazon Aurora User Guide*.
 *
 * This action applies only to Aurora MySQL DB clusters.
 */
export const backtrackDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BacktrackDBClusterMessage,
  output: DBClusterBacktrack,
  errors: [DBClusterNotFoundFault, InvalidDBClusterStateFault],
}));
/**
 * Copies the specified DB cluster parameter group.
 *
 * You can't copy a default DB cluster parameter group. Instead, create a new custom DB cluster parameter group, which copies
 * the default parameters and values for the specified DB cluster parameter group family.
 */
export const copyDBClusterParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CopyDBClusterParameterGroupMessage,
    output: CopyDBClusterParameterGroupResult,
    errors: [
      DBParameterGroupAlreadyExistsFault,
      DBParameterGroupNotFoundFault,
      DBParameterGroupQuotaExceededFault,
    ],
  }),
);
/**
 * Copies a snapshot of a DB cluster.
 *
 * To copy a DB cluster snapshot from a shared manual DB cluster snapshot, `SourceDBClusterSnapshotIdentifier`
 * must be the Amazon Resource Name (ARN) of the shared DB cluster snapshot.
 *
 * You can copy an encrypted DB cluster snapshot from another Amazon Web Services Region. In that case,
 * the Amazon Web Services Region where you call the `CopyDBClusterSnapshot` operation is the
 * destination Amazon Web Services Region for the encrypted DB cluster snapshot to be copied to. To copy
 * an encrypted DB cluster snapshot from another Amazon Web Services Region, you must provide the
 * following values:
 *
 * - `KmsKeyId` - The Amazon Web Services Key Management System (Amazon Web Services KMS) key identifier for the key to use to
 * encrypt the copy of the DB cluster snapshot in the destination Amazon Web Services Region.
 *
 * - `TargetDBClusterSnapshotIdentifier` - The identifier for the new copy of the DB cluster snapshot in the destination Amazon Web Services Region.
 *
 * - `SourceDBClusterSnapshotIdentifier` - The DB cluster snapshot
 * identifier for the encrypted DB cluster snapshot to be copied. This identifier
 * must be in the ARN format for the source Amazon Web Services Region and is the same value as
 * the `SourceDBClusterSnapshotIdentifier` in the presigned URL.
 *
 * To cancel the copy operation once it is in progress, delete the target DB cluster snapshot identified
 * by `TargetDBClusterSnapshotIdentifier` while that DB cluster snapshot is in "copying" status.
 *
 * For more information on copying encrypted Amazon Aurora DB cluster snapshots from one Amazon Web Services Region to another, see
 *
 * Copying a Snapshot in the *Amazon Aurora User Guide*.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const copyDBClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CopyDBClusterSnapshotMessage,
    output: CopyDBClusterSnapshotResult,
    errors: [
      DBClusterSnapshotAlreadyExistsFault,
      DBClusterSnapshotNotFoundFault,
      InvalidDBClusterSnapshotStateFault,
      InvalidDBClusterStateFault,
      KMSKeyNotAccessibleFault,
      SnapshotQuotaExceededFault,
    ],
  }),
);
/**
 * Copies the specified DB parameter group.
 *
 * You can't copy a default DB parameter group. Instead, create a new custom DB parameter group, which copies the default
 * parameters and values for the specified DB parameter group family.
 */
export const copyDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CopyDBParameterGroupMessage,
    output: CopyDBParameterGroupResult,
    errors: [
      DBParameterGroupAlreadyExistsFault,
      DBParameterGroupNotFoundFault,
      DBParameterGroupQuotaExceededFault,
    ],
  }),
);
/**
 * Creates a new DB cluster parameter group.
 *
 * Parameters in a DB cluster parameter group apply to all of the instances in a DB cluster.
 *
 * A DB cluster parameter group is initially created with the default parameters for the
 * database engine used by instances in the DB cluster. To provide custom values for any of the
 * parameters, you must modify the group after creating it using
 * `ModifyDBClusterParameterGroup`. Once you've created a DB cluster parameter group, you need to
 * associate it with your DB cluster using `ModifyDBCluster`.
 *
 * When you associate a new DB cluster parameter group with a running Aurora DB cluster, reboot the DB
 * instances in the DB cluster without failover for the new DB cluster parameter group and
 * associated settings to take effect.
 *
 * When you associate a new DB cluster parameter group with a running Multi-AZ DB cluster, reboot the DB
 * cluster without failover for the new DB cluster parameter group and associated settings to take effect.
 *
 * After you create a DB cluster parameter group, you should wait at least 5 minutes
 * before creating your first DB cluster that uses that DB cluster parameter group as
 * the default parameter group. This allows Amazon RDS to fully complete the create
 * action before the DB cluster parameter group is used as the default for a new DB
 * cluster. This is especially important for parameters that are critical when creating
 * the default database for a DB cluster, such as the character set for the default
 * database defined by the `character_set_database` parameter. You can use
 * the *Parameter Groups* option of the Amazon RDS console or the
 * `DescribeDBClusterParameters` operation to verify that your DB
 * cluster parameter group has been created or modified.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const createDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDBClusterParameterGroupMessage,
    output: CreateDBClusterParameterGroupResult,
    errors: [
      DBParameterGroupAlreadyExistsFault,
      DBParameterGroupQuotaExceededFault,
    ],
  }));
/**
 * Creates a snapshot of a DB cluster.
 *
 * For more information on Amazon Aurora, see What is Amazon
 * Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const createDBClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDBClusterSnapshotMessage,
    output: CreateDBClusterSnapshotResult,
    errors: [
      DBClusterNotFoundFault,
      DBClusterSnapshotAlreadyExistsFault,
      InvalidDBClusterSnapshotStateFault,
      InvalidDBClusterStateFault,
      SnapshotQuotaExceededFault,
    ],
  }),
);
/**
 * Creates a new DB parameter group.
 *
 * A DB parameter group is initially created with the default parameters for the
 * database engine used by the DB instance. To provide custom values for any of the
 * parameters, you must modify the group after creating it using
 * `ModifyDBParameterGroup`. Once you've created a DB parameter group, you need to
 * associate it with your DB instance using `ModifyDBInstance`. When you associate
 * a new DB parameter group with a running DB instance, you need to reboot the DB
 * instance without failover for the new DB parameter group and associated settings to take effect.
 *
 * This command doesn't apply to RDS Custom.
 */
export const createDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDBParameterGroupMessage,
    output: CreateDBParameterGroupResult,
    errors: [
      DBParameterGroupAlreadyExistsFault,
      DBParameterGroupQuotaExceededFault,
    ],
  }),
);
/**
 * Creates a snapshot of a DB instance. The source DB instance must be in the `available` or
 * `storage-optimization` state.
 */
export const createDBSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBSnapshotMessage,
  output: CreateDBSnapshotResult,
  errors: [
    DBInstanceNotFoundFault,
    DBSnapshotAlreadyExistsFault,
    InvalidDBInstanceStateFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * Deletes a blue/green deployment.
 *
 * For more information, see Using Amazon RDS
 * Blue/Green Deployments for database updates in the Amazon RDS User
 * Guide and Using Amazon RDS
 * Blue/Green Deployments for database updates in the Amazon Aurora
 * User Guide.
 */
export const deleteBlueGreenDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBlueGreenDeploymentRequest,
    output: DeleteBlueGreenDeploymentResponse,
    errors: [
      BlueGreenDeploymentNotFoundFault,
      InvalidBlueGreenDeploymentStateFault,
    ],
  }),
);
/**
 * Deletes a DB cluster snapshot. If the snapshot is being copied, the copy operation is terminated.
 *
 * The DB cluster snapshot must be in the `available` state to be
 * deleted.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const deleteDBClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDBClusterSnapshotMessage,
    output: DeleteDBClusterSnapshotResult,
    errors: [
      DBClusterSnapshotNotFoundFault,
      InvalidDBClusterSnapshotStateFault,
    ],
  }),
);
/**
 * Deletes a previously provisioned DB instance.
 * When you delete a DB instance, all automated backups for that instance are deleted and can't be recovered.
 * However, manual DB snapshots of the DB instance aren't deleted.
 *
 * If you request a final DB snapshot, the status of the Amazon RDS DB instance is `deleting` until the DB snapshot is created.
 * This operation can't be canceled or reverted after it begins. To monitor the status of this operation, use `DescribeDBInstance`.
 *
 * When a DB instance is in a failure state and has a status of `failed`, `incompatible-restore`,
 * or `incompatible-network`, you can only delete it when you skip creation of the final snapshot with the `SkipFinalSnapshot` parameter.
 *
 * If the specified DB instance is part of an Amazon Aurora DB cluster, you can't delete the DB instance if both of the following
 * conditions are true:
 *
 * - The DB cluster is a read replica of another Amazon Aurora DB cluster.
 *
 * - The DB instance is the only instance in the DB cluster.
 *
 * To delete a DB instance in this case, first use the `PromoteReadReplicaDBCluster` operation to promote the DB cluster so that it's no longer a read replica.
 * After the promotion completes, use the `DeleteDBInstance` operation to delete the final instance in the DB cluster.
 *
 * For RDS Custom DB instances, deleting the DB instance permanently deletes the EC2 instance and the associated EBS volumes. Make sure that you don't terminate or delete
 * these resources before you delete the DB instance. Otherwise, deleting the DB instance and creation of the final snapshot might fail.
 */
export const deleteDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBInstanceMessage,
  output: DeleteDBInstanceResult,
  errors: [
    DBInstanceAutomatedBackupQuotaExceededFault,
    DBInstanceNotFoundFault,
    DBSnapshotAlreadyExistsFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    KMSKeyNotAccessibleFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * Deletes automated backups using the `DbiResourceId` value of the source DB instance or the Amazon Resource Name (ARN) of the automated backups.
 */
export const deleteDBInstanceAutomatedBackup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDBInstanceAutomatedBackupMessage,
    output: DeleteDBInstanceAutomatedBackupResult,
    errors: [
      DBInstanceAutomatedBackupNotFoundFault,
      InvalidDBInstanceAutomatedBackupStateFault,
    ],
  }));
/**
 * Deletes a `DBProxyEndpoint`. Doing so removes the ability to access the DB proxy using the
 * endpoint that you defined. The endpoint that you delete might have provided capabilities such as read/write
 * or read-only operations, or using a different VPC than the DB proxy's default VPC.
 */
export const deleteDBProxyEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDBProxyEndpointRequest,
    output: DeleteDBProxyEndpointResponse,
    errors: [DBProxyEndpointNotFoundFault, InvalidDBProxyEndpointStateFault],
  }),
);
/**
 * Deletes a DB security group.
 *
 * The specified DB security group must not be associated with any DB instances.
 *
 * EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that
 * you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the
 * *Amazon EC2 User Guide*, the blog EC2-Classic Networking is Retiring –
 * Here’s How to Prepare, and Moving a DB instance not in a VPC
 * into a VPC in the *Amazon RDS User Guide*.
 */
export const deleteDBSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDBSecurityGroupMessage,
    output: DeleteDBSecurityGroupResponse,
    errors: [DBSecurityGroupNotFoundFault, InvalidDBSecurityGroupStateFault],
  }),
);
/**
 * Deletes a DB snapshot. If the snapshot is being copied, the copy operation is
 * terminated.
 *
 * The DB snapshot must be in the `available` state to be deleted.
 */
export const deleteDBSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBSnapshotMessage,
  output: DeleteDBSnapshotResult,
  errors: [DBSnapshotNotFoundFault, InvalidDBSnapshotStateFault],
}));
/**
 * Deletes an RDS event notification subscription.
 */
export const deleteEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventSubscriptionMessage,
    output: DeleteEventSubscriptionResult,
    errors: [InvalidEventSubscriptionStateFault, SubscriptionNotFoundFault],
  }),
);
/**
 * Deletes a global database cluster. The primary and secondary clusters must already be detached or
 * destroyed first.
 *
 * This action only applies to Aurora DB clusters.
 */
export const deleteGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlobalClusterMessage,
  output: DeleteGlobalClusterResult,
  errors: [GlobalClusterNotFoundFault, InvalidGlobalClusterStateFault],
}));
/**
 * Deletes a zero-ETL integration with Amazon Redshift.
 */
export const deleteIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationConflictOperationFault,
    IntegrationNotFoundFault,
    InvalidIntegrationStateFault,
  ],
}));
/**
 * Deletes an existing option group.
 */
export const deleteOptionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOptionGroupMessage,
  output: DeleteOptionGroupResponse,
  errors: [InvalidOptionGroupStateFault, OptionGroupNotFoundFault],
}));
/**
 * Deletes a tenant database from your DB instance. This command only applies to RDS for
 * Oracle container database (CDB) instances.
 *
 * You can't delete a tenant database when it is the only tenant in the DB
 * instance.
 */
export const deleteTenantDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTenantDatabaseMessage,
    output: DeleteTenantDatabaseResult,
    errors: [
      DBInstanceNotFoundFault,
      DBSnapshotAlreadyExistsFault,
      InvalidDBInstanceStateFault,
      TenantDatabaseNotFoundFault,
    ],
  }),
);
/**
 * Describes one or more blue/green deployments.
 *
 * For more information, see Using Amazon RDS Blue/Green Deployments
 * for database updates in the *Amazon RDS User Guide* and
 *
 * Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora
 * User Guide.
 */
export const describeBlueGreenDeployments =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeBlueGreenDeploymentsRequest,
    output: DescribeBlueGreenDeploymentsResponse,
    errors: [BlueGreenDeploymentNotFoundFault],
  }));
/**
 * Lists the set of certificate authority (CA) certificates provided by Amazon RDS for this Amazon Web Services account.
 *
 * For more information, see Using SSL/TLS to encrypt a connection to a DB
 * instance in the *Amazon RDS User Guide* and
 *
 * Using SSL/TLS to encrypt a connection to a DB cluster in the Amazon Aurora
 * User Guide.
 */
export const describeCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCertificatesMessage,
    output: CertificateMessage,
    errors: [CertificateNotFoundFault],
  }),
);
/**
 * Displays backups for both current and deleted DB clusters. For example, use this operation to find details
 * about automated backups for previously deleted clusters. Current clusters are returned for both the
 * `DescribeDBClusterAutomatedBackups` and `DescribeDBClusters` operations.
 *
 * All parameters are optional.
 */
export const describeDBClusterAutomatedBackups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDBClusterAutomatedBackupsMessage,
    output: DBClusterAutomatedBackupMessage,
    errors: [DBClusterAutomatedBackupNotFoundFault],
  }));
/**
 * Returns information about backtracks for a DB cluster.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * This action only applies to Aurora MySQL DB clusters.
 */
export const describeDBClusterBacktracks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBClusterBacktracksMessage,
    output: DBClusterBacktrackMessage,
    errors: [DBClusterBacktrackNotFoundFault, DBClusterNotFoundFault],
  }),
);
/**
 * Displays backups for both current and deleted
 * instances. For example, use this operation to
 * find details about automated backups for previously deleted instances. Current instances
 * with retention periods greater than zero (0) are returned for both the
 * `DescribeDBInstanceAutomatedBackups` and
 * `DescribeDBInstances` operations.
 *
 * All parameters are optional.
 */
export const describeDBInstanceAutomatedBackups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDBInstanceAutomatedBackupsMessage,
    output: DBInstanceAutomatedBackupMessage,
    errors: [DBInstanceAutomatedBackupNotFoundFault],
  }));
/**
 * Returns a list of DB log files for the DB instance.
 *
 * This command doesn't apply to RDS Custom.
 */
export const describeDBLogFiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDBLogFilesMessage,
  output: DescribeDBLogFilesResponse,
  errors: [DBInstanceNotFoundFault, DBInstanceNotReadyFault],
}));
/**
 * Describes the tenant databases that exist in a DB snapshot. This command only applies
 * to RDS for Oracle DB instances in the multi-tenant configuration.
 *
 * You can use this command to inspect the tenant databases within a snapshot before
 * restoring it. You can't directly interact with the tenant databases in a DB snapshot. If
 * you restore a snapshot that was taken from DB instance using the multi-tenant
 * configuration, you restore all its tenant databases.
 */
export const describeDBSnapshotTenantDatabases =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDBSnapshotTenantDatabasesMessage,
    output: DBSnapshotTenantDatabasesMessage,
    errors: [DBSnapshotNotFoundFault],
  }));
/**
 * Returns the default engine and system parameter information for the cluster database engine.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 */
export const describeEngineDefaultClusterParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEngineDefaultClusterParametersMessage,
    output: DescribeEngineDefaultClusterParametersResult,
    errors: [],
  }));
/**
 * Displays a list of categories for all event source types, or, if specified, for a specified source type.
 * You can also see this list in the "Amazon RDS event categories and event messages" section of the
 * *Amazon RDS User Guide*
 * or the
 *
 * *Amazon Aurora User Guide*
 * .
 */
export const describeEventCategories = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventCategoriesMessage,
    output: EventCategoriesMessage,
    errors: [],
  }),
);
/**
 * Returns events related to DB instances, DB clusters, DB parameter groups, DB security groups, DB snapshots, DB cluster snapshots, and RDS Proxies for the past 14 days.
 * Events specific to a particular DB instance, DB cluster, DB parameter group, DB security group, DB snapshot, DB cluster snapshot group, or RDS Proxy can be
 * obtained by providing the name as a parameter.
 *
 * For more information on working with events, see Monitoring Amazon RDS events in the *Amazon RDS User Guide* and Monitoring Amazon Aurora
 * events in the *Amazon Aurora User Guide*.
 *
 * By default, RDS returns events that were generated in the past hour.
 */
export const describeEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventsMessage,
  output: EventsMessage,
  errors: [],
}));
/**
 * Lists all the subscription descriptions for a customer account. The description for a subscription includes
 * `SubscriptionName`, `SNSTopicARN`, `CustomerID`, `SourceType`, `SourceID`, `CreationTime`, and `Status`.
 *
 * If you specify a `SubscriptionName`, lists the description for that subscription.
 */
export const describeEventSubscriptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventSubscriptionsMessage,
    output: EventSubscriptionsMessage,
    errors: [SubscriptionNotFoundFault],
  }),
);
/**
 * Describe one or more zero-ETL integrations with Amazon Redshift.
 */
export const describeIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeIntegrationsMessage,
    output: DescribeIntegrationsResponse,
    errors: [IntegrationNotFoundFault],
  }),
);
/**
 * Returns a list of resources (for example, DB instances) that have at least one pending maintenance action.
 *
 * This API follows an eventual consistency model. This means that the result of the
 * `DescribePendingMaintenanceActions` command might not be immediately
 * visible to all subsequent RDS commands. Keep this in mind when you use
 * `DescribePendingMaintenanceActions` immediately after using a previous
 * API command such as `ApplyPendingMaintenanceActions`.
 */
export const describePendingMaintenanceActions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribePendingMaintenanceActionsMessage,
    output: PendingMaintenanceActionsMessage,
    errors: [ResourceNotFoundFault],
  }));
/**
 * Returns a list of the source Amazon Web Services Regions where the current Amazon Web Services Region can create a read replica,
 * copy a DB snapshot from, or replicate automated backups from.
 *
 * Use this operation to determine whether cross-Region features are supported between other Regions
 * and your current Region. This operation supports pagination.
 *
 * To return information about the Regions that are enabled for your account, or all Regions,
 * use the EC2 operation `DescribeRegions`. For more information, see
 *
 * DescribeRegions in the *Amazon EC2 API Reference*.
 */
export const describeSourceRegions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSourceRegionsMessage,
    output: SourceRegionMessage,
    errors: [],
  }),
);
/**
 * Disables the HTTP endpoint for the specified DB cluster. Disabling this endpoint disables RDS Data API.
 *
 * For more information, see Using RDS Data API in the
 * *Amazon Aurora User Guide*.
 *
 * This operation applies only to Aurora Serverless v2 and provisioned DB clusters. To disable the HTTP endpoint for Aurora Serverless v1 DB clusters,
 * use the `EnableHttpEndpoint` parameter of the `ModifyDBCluster` operation.
 */
export const disableHttpEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableHttpEndpointRequest,
  output: DisableHttpEndpointResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Promotes the specified secondary DB cluster to be the primary DB cluster in the global database cluster to fail over or switch over a global database. Switchover operations were previously called "managed planned failovers."
 *
 * Although this operation can be used either to fail over or to switch over a global database cluster, its intended use is for global database failover.
 * To switch over a global database cluster, we recommend that you use the SwitchoverGlobalCluster operation instead.
 *
 * How you use this operation depends on whether you are failing over or switching over your global database cluster:
 *
 * - Failing over - Specify the `AllowDataLoss` parameter and don't specify the `Switchover` parameter.
 *
 * - Switching over - Specify the `Switchover` parameter or omit it, but don't specify the `AllowDataLoss` parameter.
 *
 * **About failing over and switching over**
 *
 * While failing over and switching over a global database cluster both change the primary DB cluster, you use these operations for different reasons:
 *
 * - *Failing over* - Use this operation to respond to an unplanned event, such as a Regional disaster in the primary Region.
 * Failing over can result in a loss of write transaction data that wasn't replicated to the chosen secondary before the failover event occurred.
 * However, the recovery process that promotes a DB instance on the chosen seconday DB cluster to be the primary writer DB instance guarantees
 * that the data is in a transactionally consistent state.
 *
 * For more information about failing over an Amazon Aurora global database, see
 * Performing managed failovers for Aurora global databases in the *Amazon Aurora User Guide*.
 *
 * - *Switching over* - Use this operation on a healthy global database cluster for planned events, such as Regional rotation or to
 * fail back to the original primary DB cluster after a failover operation. With this operation, there is no data loss.
 *
 * For more information about switching over an Amazon Aurora global database, see
 * Performing switchovers for Aurora global databases in the *Amazon Aurora User Guide*.
 */
export const failoverGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: FailoverGlobalClusterMessage,
    output: FailoverGlobalClusterResult,
    errors: [
      DBClusterNotFoundFault,
      GlobalClusterNotFoundFault,
      InvalidDBClusterStateFault,
      InvalidGlobalClusterStateFault,
    ],
  }),
);
/**
 * Lists all tags on an Amazon RDS resource.
 *
 * For an overview on tagging an Amazon RDS resource,
 * see Tagging Amazon RDS Resources in the *Amazon RDS User Guide*
 * or Tagging Amazon Aurora and Amazon RDS Resources in the *Amazon Aurora User Guide*.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceMessage,
  output: TagListMessage,
  errors: [
    BlueGreenDeploymentNotFoundFault,
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    DBProxyEndpointNotFoundFault,
    DBProxyNotFoundFault,
    DBProxyTargetGroupNotFoundFault,
    DBShardGroupNotFoundFault,
    DBSnapshotNotFoundFault,
    DBSnapshotTenantDatabaseNotFoundFault,
    IntegrationNotFoundFault,
    TenantDatabaseNotFoundFault,
  ],
}));
/**
 * Override the system-default Secure Sockets Layer/Transport Layer Security (SSL/TLS)
 * certificate for Amazon RDS for new DB instances, or remove the override.
 *
 * By using this operation, you can specify an RDS-approved SSL/TLS certificate for new DB
 * instances that is different from the default certificate provided by RDS. You can also
 * use this operation to remove the override, so that new DB instances use the default
 * certificate provided by RDS.
 *
 * You might need to override the default certificate in the following situations:
 *
 * - You already migrated your applications to support the latest certificate authority (CA) certificate, but the new CA certificate is not yet
 * the RDS default CA certificate for the specified Amazon Web Services Region.
 *
 * - RDS has already moved to a new default CA certificate for the specified Amazon Web Services
 * Region, but you are still in the process of supporting the new CA certificate.
 * In this case, you temporarily need additional time to finish your application
 * changes.
 *
 * For more information about rotating your SSL/TLS certificate for RDS DB engines, see
 *
 * Rotating Your SSL/TLS Certificate in the *Amazon RDS User Guide*.
 *
 * For more information about rotating your SSL/TLS certificate for Aurora DB engines, see
 *
 * Rotating Your SSL/TLS Certificate in the *Amazon Aurora User Guide*.
 */
export const modifyCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyCertificatesMessage,
  output: ModifyCertificatesResult,
  errors: [CertificateNotFoundFault],
}));
/**
 * Set the capacity of an Aurora Serverless v1 DB cluster to a specific value.
 *
 * Aurora Serverless v1 scales seamlessly based on the workload on the DB cluster. In some cases, the capacity might not scale
 * fast enough to meet a sudden change in workload, such as a large number of new transactions. Call `ModifyCurrentDBClusterCapacity`
 * to set the capacity explicitly.
 *
 * After this call sets the DB cluster capacity, Aurora Serverless v1 can automatically scale
 * the DB cluster based on the cooldown period for scaling up and the cooldown period
 * for scaling down.
 *
 * For more information about Aurora Serverless v1, see Using Amazon Aurora Serverless v1 in the
 * *Amazon Aurora User Guide*.
 *
 * If you call `ModifyCurrentDBClusterCapacity` with the default `TimeoutAction`, connections that
 * prevent Aurora Serverless v1 from finding a scaling point might be dropped. For more information about scaling points,
 * see
 * Autoscaling for Aurora Serverless v1 in the *Amazon Aurora User Guide*.
 *
 * This operation only applies to Aurora Serverless v1 DB clusters.
 */
export const modifyCurrentDBClusterCapacity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyCurrentDBClusterCapacityMessage,
    output: DBClusterCapacityInfo,
    errors: [
      DBClusterNotFoundFault,
      InvalidDBClusterCapacityFault,
      InvalidDBClusterStateFault,
    ],
  }));
/**
 * Adds an attribute and values to, or removes an attribute and values from, a manual DB cluster snapshot.
 *
 * To share a manual DB cluster snapshot with other Amazon Web Services accounts, specify
 * `restore` as the `AttributeName` and use the
 * `ValuesToAdd` parameter to add a list of IDs of the Amazon Web Services accounts that are
 * authorized to restore the manual DB cluster snapshot. Use the value `all` to
 * make the manual DB cluster snapshot public, which means that it can be copied or
 * restored by all Amazon Web Services accounts.
 *
 * Don't add the `all` value for any manual DB cluster snapshots
 * that contain private information that you don't want available to all Amazon Web Services
 * accounts.
 *
 * If a manual DB cluster snapshot is encrypted, it can be shared, but only by
 * specifying a list of authorized Amazon Web Services account IDs for the `ValuesToAdd`
 * parameter. You can't use `all` as a value for that parameter in this
 * case.
 *
 * To view which Amazon Web Services accounts have access to copy or restore a manual DB cluster
 * snapshot, or whether a manual DB cluster snapshot is public or private, use the DescribeDBClusterSnapshotAttributes API operation. The accounts are
 * returned as values for the `restore` attribute.
 */
export const modifyDBClusterSnapshotAttribute =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyDBClusterSnapshotAttributeMessage,
    output: ModifyDBClusterSnapshotAttributeResult,
    errors: [
      DBClusterSnapshotNotFoundFault,
      InvalidDBClusterSnapshotStateFault,
      SharedSnapshotQuotaExceededFault,
    ],
  }));
/**
 * Changes the settings for an existing DB proxy endpoint.
 */
export const modifyDBProxyEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyDBProxyEndpointRequest,
    output: ModifyDBProxyEndpointResponse,
    errors: [
      DBProxyEndpointAlreadyExistsFault,
      DBProxyEndpointNotFoundFault,
      InvalidDBProxyEndpointStateFault,
      InvalidDBProxyStateFault,
    ],
  }),
);
/**
 * Modifies the properties of a `DBProxyTargetGroup`.
 */
export const modifyDBProxyTargetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyDBProxyTargetGroupRequest,
    output: ModifyDBProxyTargetGroupResponse,
    errors: [
      DBProxyNotFoundFault,
      DBProxyTargetGroupNotFoundFault,
      InvalidDBProxyStateFault,
    ],
  }),
);
/**
 * Updates the recommendation status and recommended action status for the specified recommendation.
 */
export const modifyDBRecommendation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyDBRecommendationMessage,
    output: DBRecommendationMessage,
    errors: [],
  }),
);
/**
 * Updates a manual DB snapshot with a new engine version. The snapshot can be encrypted
 * or unencrypted, but not shared or public.
 *
 * Amazon RDS supports upgrading DB snapshots for MariaDB, MySQL, PostgreSQL, and Oracle. This operation
 * doesn't apply to RDS Custom or RDS for Db2.
 */
export const modifyDBSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBSnapshotMessage,
  output: ModifyDBSnapshotResult,
  errors: [
    DBSnapshotNotFoundFault,
    InvalidDBSnapshotStateFault,
    KMSKeyNotAccessibleFault,
  ],
}));
/**
 * Modifies a setting for an Amazon Aurora global database cluster. You can change one or more database configuration
 * parameters by specifying these parameters and the new values in the request. For more information on
 * Amazon Aurora, see What is Amazon Aurora? in the
 * *Amazon Aurora User Guide*.
 *
 * This operation only applies to Aurora global database clusters.
 */
export const modifyGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyGlobalClusterMessage,
  output: ModifyGlobalClusterResult,
  errors: [
    GlobalClusterAlreadyExistsFault,
    GlobalClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidGlobalClusterStateFault,
  ],
}));
/**
 * Modifies a zero-ETL integration with Amazon Redshift.
 */
export const modifyIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationConflictOperationFault,
    IntegrationNotFoundFault,
    InvalidIntegrationStateFault,
  ],
}));
/**
 * Removes a source identifier from an existing RDS event notification subscription.
 */
export const removeSourceIdentifierFromSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveSourceIdentifierFromSubscriptionMessage,
    output: RemoveSourceIdentifierFromSubscriptionResult,
    errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
  }));
/**
 * Removes metadata tags from an Amazon RDS resource.
 *
 * For an overview on tagging an Amazon RDS resource,
 * see Tagging Amazon RDS Resources in the *Amazon RDS User Guide*
 * or Tagging Amazon Aurora and Amazon RDS Resources in the *Amazon Aurora User Guide*.
 */
export const removeTagsFromResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveTagsFromResourceMessage,
    output: RemoveTagsFromResourceResponse,
    errors: [
      BlueGreenDeploymentNotFoundFault,
      DBClusterNotFoundFault,
      DBInstanceNotFoundFault,
      DBProxyEndpointNotFoundFault,
      DBProxyNotFoundFault,
      DBProxyTargetGroupNotFoundFault,
      DBShardGroupNotFoundFault,
      DBSnapshotNotFoundFault,
      DBSnapshotTenantDatabaseNotFoundFault,
      IntegrationNotFoundFault,
      InvalidDBClusterEndpointStateFault,
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
      TenantDatabaseNotFoundFault,
    ],
  }),
);
/**
 * Starts an Amazon Aurora DB cluster that was stopped using the Amazon Web Services console, the stop-db-cluster
 * CLI command, or the `StopDBCluster` operation.
 *
 * For more information, see
 *
 * Stopping and Starting an Aurora Cluster in the *Amazon Aurora User Guide*.
 *
 * This operation only applies to Aurora DB clusters.
 */
export const startDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDBClusterMessage,
  output: StartDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidDBShardGroupStateFault,
    KMSKeyNotAccessibleFault,
    VpcEncryptionControlViolationException,
  ],
}));
/**
 * Starts an Amazon RDS DB instance that was stopped using the Amazon Web Services console, the stop-db-instance CLI command, or the `StopDBInstance` operation.
 *
 * For more information, see
 *
 * Starting an Amazon RDS DB instance That Was Previously Stopped in the
 * *Amazon RDS User Guide.*
 *
 * This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL.
 * For Aurora DB clusters, use `StartDBCluster` instead.
 */
export const startDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDBInstanceMessage,
  output: StartDBInstanceResult,
  errors: [
    AuthorizationNotFoundFault,
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    DBSubnetGroupDoesNotCoverEnoughAZs,
    DBSubnetGroupNotFoundFault,
    InsufficientDBInstanceCapacityFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    VpcEncryptionControlViolationException,
  ],
}));
/**
 * Stops an Amazon RDS DB instance temporarily. When you stop a DB instance, Amazon RDS retains the DB instance's metadata,
 * including its endpoint, DB parameter group, and option group membership. Amazon RDS also retains
 * the transaction logs so you can do a point-in-time restore if necessary. The instance restarts automatically
 * after 7 days.
 *
 * For more information, see
 *
 * Stopping an Amazon RDS DB Instance Temporarily in the
 * *Amazon RDS User Guide.*
 *
 * This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL.
 * For Aurora clusters, use `StopDBCluster` instead.
 */
export const stopDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDBInstanceMessage,
  output: StopDBInstanceResult,
  errors: [
    DBInstanceNotFoundFault,
    DBSnapshotAlreadyExistsFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * Associates an Identity and Access Management (IAM) role with a DB cluster.
 */
export const addRoleToDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddRoleToDBClusterMessage,
  output: AddRoleToDBClusterResponse,
  errors: [
    DBClusterNotFoundFault,
    DBClusterRoleAlreadyExistsFault,
    DBClusterRoleQuotaExceededFault,
    InvalidDBClusterStateFault,
  ],
}));
/**
 * Associates an Amazon Web Services Identity and Access Management (IAM) role with a DB instance.
 *
 * To add a role to a DB instance, the status of the DB instance must be `available`.
 *
 * This command doesn't apply to RDS Custom.
 */
export const addRoleToDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddRoleToDBInstanceMessage,
  output: AddRoleToDBInstanceResponse,
  errors: [
    DBInstanceNotFoundFault,
    DBInstanceRoleAlreadyExistsFault,
    DBInstanceRoleQuotaExceededFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * Applies a pending maintenance action to a resource (for example, to a DB instance).
 */
export const applyPendingMaintenanceAction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ApplyPendingMaintenanceActionMessage,
    output: ApplyPendingMaintenanceActionResult,
    errors: [
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
      ResourceNotFoundFault,
    ],
  }));
/**
 * Cancels an export task in progress that is exporting a snapshot or cluster to Amazon S3.
 * Any data that has already been written to the S3 bucket isn't removed.
 */
export const cancelExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelExportTaskMessage,
  output: ExportTask,
  errors: [ExportTaskNotFoundFault, InvalidExportTaskStateFault],
}));
/**
 * Copies the specified DB snapshot. The source DB snapshot must be in the `available` state.
 *
 * You can copy a snapshot from one Amazon Web Services Region to another. In that case, the
 * Amazon Web Services Region where you call the `CopyDBSnapshot` operation is the destination
 * Amazon Web Services Region for the DB snapshot copy.
 *
 * This command doesn't apply to RDS Custom.
 *
 * For more information about copying snapshots, see
 * Copying a DB Snapshot in the *Amazon RDS User Guide*.
 */
export const copyDBSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyDBSnapshotMessage,
  output: CopyDBSnapshotResult,
  errors: [
    CustomAvailabilityZoneNotFoundFault,
    DBSnapshotAlreadyExistsFault,
    DBSnapshotNotFoundFault,
    InvalidDBSnapshotStateFault,
    KMSKeyNotAccessibleFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * Copies the specified option group.
 */
export const copyOptionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyOptionGroupMessage,
  output: CopyOptionGroupResult,
  errors: [
    OptionGroupAlreadyExistsFault,
    OptionGroupNotFoundFault,
    OptionGroupQuotaExceededFault,
  ],
}));
/**
 * Creates a new custom endpoint and associates it with an Amazon Aurora DB cluster.
 *
 * This action applies only to Aurora DB clusters.
 */
export const createDBClusterEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDBClusterEndpointMessage,
    output: DBClusterEndpoint,
    errors: [
      DBClusterEndpointAlreadyExistsFault,
      DBClusterEndpointQuotaExceededFault,
      DBClusterNotFoundFault,
      DBInstanceNotFoundFault,
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
    ],
  }),
);
/**
 * Creates a new DB proxy.
 */
export const createDBProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBProxyRequest,
  output: CreateDBProxyResponse,
  errors: [DBProxyAlreadyExistsFault, DBProxyQuotaExceededFault, InvalidSubnet],
}));
/**
 * Creates a `DBProxyEndpoint`. Only applies to proxies that are associated with Aurora DB clusters.
 * You can use DB proxy endpoints to specify read/write or read-only access to the DB cluster. You can also use
 * DB proxy endpoints to access a DB proxy through a different VPC than the proxy's default VPC.
 */
export const createDBProxyEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDBProxyEndpointRequest,
    output: CreateDBProxyEndpointResponse,
    errors: [
      DBProxyEndpointAlreadyExistsFault,
      DBProxyEndpointQuotaExceededFault,
      DBProxyNotFoundFault,
      InvalidDBProxyStateFault,
      InvalidSubnet,
    ],
  }),
);
/**
 * Creates a zero-ETL integration with Amazon Redshift.
 */
export const createIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntegrationMessage,
  output: Integration,
  errors: [
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    IntegrationAlreadyExistsFault,
    IntegrationConflictOperationFault,
    IntegrationQuotaExceededFault,
    KMSKeyNotAccessibleFault,
  ],
}));
/**
 * Creates a new option group. You can create up to 20 option groups.
 *
 * This command doesn't apply to RDS Custom.
 */
export const createOptionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOptionGroupMessage,
  output: CreateOptionGroupResult,
  errors: [OptionGroupAlreadyExistsFault, OptionGroupQuotaExceededFault],
}));
/**
 * Deletes an existing DB proxy.
 */
export const deleteDBProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBProxyRequest,
  output: DeleteDBProxyResponse,
  errors: [DBProxyNotFoundFault, InvalidDBProxyStateFault],
}));
/**
 * Deletes a DB subnet group.
 *
 * The specified database subnet group must not be associated with any DB instances.
 */
export const deleteDBSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBSubnetGroupMessage,
  output: DeleteDBSubnetGroupResponse,
  errors: [
    DBSubnetGroupNotFoundFault,
    InvalidDBSubnetGroupStateFault,
    InvalidDBSubnetStateFault,
  ],
}));
/**
 * Remove the association between one or more `DBProxyTarget` data structures and a `DBProxyTargetGroup`.
 */
export const deregisterDBProxyTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterDBProxyTargetsRequest,
    output: DeregisterDBProxyTargetsResponse,
    errors: [
      DBProxyNotFoundFault,
      DBProxyTargetGroupNotFoundFault,
      DBProxyTargetNotFoundFault,
      InvalidDBProxyStateFault,
    ],
  }),
);
/**
 * Returns a list of DB cluster snapshot attribute names and values for a manual DB cluster snapshot.
 *
 * When sharing snapshots with other Amazon Web Services accounts, `DescribeDBClusterSnapshotAttributes`
 * returns the `restore` attribute and a list of IDs for the Amazon Web Services accounts that are
 * authorized to copy or restore the manual DB cluster snapshot. If `all` is included in the list of
 * values for the `restore` attribute, then the manual DB cluster snapshot is public and
 * can be copied or restored by all Amazon Web Services accounts.
 *
 * To add or remove access for an Amazon Web Services account to copy or restore a manual DB cluster snapshot, or to make the
 * manual DB cluster snapshot public or private, use the `ModifyDBClusterSnapshotAttribute` API action.
 */
export const describeDBClusterSnapshotAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDBClusterSnapshotAttributesMessage,
    output: DescribeDBClusterSnapshotAttributesResult,
    errors: [DBClusterSnapshotNotFoundFault],
  }));
/**
 * Describes the properties of specific major versions of DB engines.
 */
export const describeDBMajorEngineVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDBMajorEngineVersionsRequest,
    output: DescribeDBMajorEngineVersionsResponse,
    errors: [],
  }));
/**
 * Returns information about DB proxy target groups, represented by `DBProxyTargetGroup` data structures.
 */
export const describeDBProxyTargetGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBProxyTargetGroupsRequest,
    output: DescribeDBProxyTargetGroupsResponse,
    errors: [
      DBProxyNotFoundFault,
      DBProxyTargetGroupNotFoundFault,
      InvalidDBProxyStateFault,
    ],
  }),
);
/**
 * Returns information about `DBProxyTarget` objects. This API supports pagination.
 */
export const describeDBProxyTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBProxyTargetsRequest,
    output: DescribeDBProxyTargetsResponse,
    errors: [
      DBProxyNotFoundFault,
      DBProxyTargetGroupNotFoundFault,
      DBProxyTargetNotFoundFault,
      InvalidDBProxyStateFault,
    ],
  }),
);
/**
 * Returns a list of DB snapshot attribute names and values for a manual DB snapshot.
 *
 * When sharing snapshots with other Amazon Web Services accounts, `DescribeDBSnapshotAttributes`
 * returns the `restore` attribute and a list of IDs for the Amazon Web Services accounts that are
 * authorized to copy or restore the manual DB snapshot. If `all` is included in the list of
 * values for the `restore` attribute, then the manual DB snapshot is public and
 * can be copied or restored by all Amazon Web Services accounts.
 *
 * To add or remove access for an Amazon Web Services account to copy or restore a manual DB snapshot, or to make the
 * manual DB snapshot public or private, use the `ModifyDBSnapshotAttribute` API action.
 */
export const describeDBSnapshotAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDBSnapshotAttributesMessage,
    output: DescribeDBSnapshotAttributesResult,
    errors: [DBSnapshotNotFoundFault],
  }));
/**
 * Describes the orderable DB instance options for a specified DB engine.
 */
export const describeOrderableDBInstanceOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeOrderableDBInstanceOptionsMessage,
    output: OrderableDBInstanceOptionsMessage,
    errors: [],
  }));
/**
 * Lists available reserved DB instance offerings.
 */
export const describeReservedDBInstancesOfferings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeReservedDBInstancesOfferingsMessage,
    output: ReservedDBInstancesOfferingMessage,
    errors: [ReservedDBInstancesOfferingNotFoundFault],
  }));
/**
 * Downloads all or a portion of the specified log file, up to 1 MB in size.
 *
 * This command doesn't apply to RDS Custom.
 *
 * This operation uses resources on database instances. Because of this, we recommend publishing database logs to CloudWatch and then
 * using the GetLogEvents operation. For more information,
 * see GetLogEvents in the *Amazon CloudWatch Logs API Reference*.
 */
export const downloadDBLogFilePortion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DownloadDBLogFilePortionMessage,
    output: DownloadDBLogFilePortionDetails,
    errors: [
      DBInstanceNotFoundFault,
      DBInstanceNotReadyFault,
      DBLogFileNotFoundFault,
    ],
  }),
);
/**
 * Modifies settings for a DB instance.
 * You can change one or more database configuration parameters by specifying these parameters and the new values in the request.
 * To learn what modifications you can make to your DB instance,
 * call `DescribeValidDBInstanceModifications`
 * before you call `ModifyDBInstance`.
 */
export const modifyDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBInstanceMessage,
  output: ModifyDBInstanceResult,
  errors: [
    AuthorizationNotFoundFault,
    BackupPolicyNotFoundFault,
    CertificateNotFoundFault,
    DBInstanceAlreadyExistsFault,
    DBInstanceNotFoundFault,
    DBParameterGroupNotFoundFault,
    DBSecurityGroupNotFoundFault,
    DBUpgradeDependencyFailureFault,
    DomainNotFoundFault,
    InsufficientDBInstanceCapacityFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidDBSecurityGroupStateFault,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    NetworkTypeNotSupported,
    OptionGroupNotFoundFault,
    ProvisionedIopsNotAvailableInAZFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
    TenantDatabaseQuotaExceededFault,
    VpcEncryptionControlViolationException,
  ],
}));
/**
 * Changes the settings for an existing DB proxy.
 */
export const modifyDBProxy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBProxyRequest,
  output: ModifyDBProxyResponse,
  errors: [
    DBProxyAlreadyExistsFault,
    DBProxyNotFoundFault,
    InvalidDBProxyStateFault,
  ],
}));
/**
 * Modifies an existing option group.
 */
export const modifyOptionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyOptionGroupMessage,
  output: ModifyOptionGroupResult,
  errors: [InvalidOptionGroupStateFault, OptionGroupNotFoundFault],
}));
/**
 * Modifies an existing tenant database in a DB instance. You can change the tenant
 * database name or the master user password. This operation is supported only for RDS for
 * Oracle CDB instances using the multi-tenant configuration.
 */
export const modifyTenantDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyTenantDatabaseMessage,
    output: ModifyTenantDatabaseResult,
    errors: [
      DBInstanceNotFoundFault,
      InvalidDBInstanceStateFault,
      KMSKeyNotAccessibleFault,
      TenantDatabaseAlreadyExistsFault,
      TenantDatabaseNotFoundFault,
    ],
  }),
);
/**
 * Purchases a reserved DB instance offering.
 */
export const purchaseReservedDBInstancesOffering =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PurchaseReservedDBInstancesOfferingMessage,
    output: PurchaseReservedDBInstancesOfferingResult,
    errors: [
      ReservedDBInstanceAlreadyExistsFault,
      ReservedDBInstanceQuotaExceededFault,
      ReservedDBInstancesOfferingNotFoundFault,
    ],
  }));
/**
 * Associate one or more `DBProxyTarget` data structures with a `DBProxyTargetGroup`.
 */
export const registerDBProxyTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterDBProxyTargetsRequest,
    output: RegisterDBProxyTargetsResponse,
    errors: [
      DBClusterNotFoundFault,
      DBInstanceNotFoundFault,
      DBProxyNotFoundFault,
      DBProxyTargetAlreadyRegisteredFault,
      DBProxyTargetGroupNotFoundFault,
      InsufficientAvailableIPsInSubnetFault,
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
      InvalidDBProxyStateFault,
    ],
  }),
);
/**
 * Creates an Amazon Aurora DB cluster from MySQL data stored in an Amazon S3 bucket.
 * Amazon RDS must be authorized to access the Amazon S3 bucket and the data must be
 * created using the Percona XtraBackup utility as described in Migrating Data from MySQL by Using an Amazon S3 Bucket in the
 * *Amazon Aurora User Guide*.
 *
 * This operation only restores the DB cluster, not the DB instances for that DB
 * cluster. You must invoke the `CreateDBInstance` operation to create DB
 * instances for the restored DB cluster, specifying the identifier of the restored DB
 * cluster in `DBClusterIdentifier`. You can create DB instances only after
 * the `RestoreDBClusterFromS3` operation has completed and the DB
 * cluster is available.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * This operation only applies to Aurora DB clusters. The source DB engine must be MySQL.
 */
export const restoreDBClusterFromS3 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreDBClusterFromS3Message,
    output: RestoreDBClusterFromS3Result,
    errors: [
      DBClusterAlreadyExistsFault,
      DBClusterNotFoundFault,
      DBClusterParameterGroupNotFoundFault,
      DBClusterQuotaExceededFault,
      DBSubnetGroupNotFoundFault,
      DomainNotFoundFault,
      InsufficientStorageClusterCapacityFault,
      InvalidDBClusterStateFault,
      InvalidDBSubnetGroupStateFault,
      InvalidS3BucketFault,
      InvalidSubnet,
      InvalidVPCNetworkStateFault,
      KMSKeyNotAccessibleFault,
      NetworkTypeNotSupported,
      StorageQuotaExceededFault,
      StorageTypeNotSupportedFault,
    ],
  }),
);
/**
 * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
 *
 * The target DB cluster is created from the source snapshot with a default
 * configuration. If you don't specify a security group, the new DB cluster is
 * associated with the default security group.
 *
 * This operation only restores the DB cluster, not the DB instances for that DB
 * cluster. You must invoke the `CreateDBInstance` operation to create DB
 * instances for the restored DB cluster, specifying the identifier of the restored DB
 * cluster in `DBClusterIdentifier`. You can create DB instances only after
 * the `RestoreDBClusterFromSnapshot` operation has completed and the DB
 * cluster is available.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const restoreDBClusterFromSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreDBClusterFromSnapshotMessage,
    output: RestoreDBClusterFromSnapshotResult,
    errors: [
      DBClusterAlreadyExistsFault,
      DBClusterParameterGroupNotFoundFault,
      DBClusterQuotaExceededFault,
      DBClusterSnapshotNotFoundFault,
      DBSnapshotNotFoundFault,
      DBSubnetGroupDoesNotCoverEnoughAZs,
      DBSubnetGroupNotFoundFault,
      DomainNotFoundFault,
      InsufficientDBClusterCapacityFault,
      InsufficientDBInstanceCapacityFault,
      InsufficientStorageClusterCapacityFault,
      InvalidDBClusterSnapshotStateFault,
      InvalidDBInstanceStateFault,
      InvalidDBSnapshotStateFault,
      InvalidRestoreFault,
      InvalidSubnet,
      InvalidVPCNetworkStateFault,
      KMSKeyNotAccessibleFault,
      NetworkTypeNotSupported,
      OptionGroupNotFoundFault,
      StorageQuotaExceededFault,
      StorageTypeNotSupportedFault,
      VpcEncryptionControlViolationException,
    ],
  }));
/**
 * Restores a DB cluster to an arbitrary point in time. Users can restore to any point
 * in time before `LatestRestorableTime` for up to
 * `BackupRetentionPeriod` days. The target DB cluster is created from the
 * source DB cluster with the same configuration as the original DB cluster, except that
 * the new DB cluster is created with the default DB security group. Unless the
 * `RestoreType` is set to `copy-on-write`, the restore may occur in a
 * different Availability Zone (AZ) from the original DB cluster. The AZ where RDS restores
 * the DB cluster depends on the AZs in the specified subnet group.
 *
 * For Aurora, this operation only restores the DB cluster, not the DB instances for that DB
 * cluster. You must invoke the `CreateDBInstance` operation to create DB
 * instances for the restored DB cluster, specifying the identifier of the restored DB
 * cluster in `DBClusterIdentifier`. You can create DB instances only after
 * the `RestoreDBClusterToPointInTime` operation has completed and the DB
 * cluster is available.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const restoreDBClusterToPointInTime =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreDBClusterToPointInTimeMessage,
    output: RestoreDBClusterToPointInTimeResult,
    errors: [
      DBClusterAlreadyExistsFault,
      DBClusterAutomatedBackupNotFoundFault,
      DBClusterNotFoundFault,
      DBClusterParameterGroupNotFoundFault,
      DBClusterQuotaExceededFault,
      DBClusterSnapshotNotFoundFault,
      DBSubnetGroupNotFoundFault,
      DomainNotFoundFault,
      InsufficientDBClusterCapacityFault,
      InsufficientDBInstanceCapacityFault,
      InsufficientStorageClusterCapacityFault,
      InvalidDBClusterSnapshotStateFault,
      InvalidDBClusterStateFault,
      InvalidDBSnapshotStateFault,
      InvalidRestoreFault,
      InvalidSubnet,
      InvalidVPCNetworkStateFault,
      KMSKeyNotAccessibleFault,
      NetworkTypeNotSupported,
      OptionGroupNotFoundFault,
      StorageQuotaExceededFault,
      StorageTypeNotSupportedFault,
      VpcEncryptionControlViolationException,
    ],
  }));
/**
 * Creates a new DB instance from a DB snapshot. The target database is created from the source database restore point with most
 * of the source's original configuration, including the default security group and DB parameter group. By default, the new DB
 * instance is created as a Single-AZ deployment, except when the instance is a SQL Server instance that has an option group
 * associated with mirroring. In this case, the instance becomes a Multi-AZ deployment, not a Single-AZ deployment.
 *
 * If you want to replace your original DB instance with the new, restored DB instance, then rename your original DB instance
 * before you call the `RestoreDBInstanceFromDBSnapshot` operation. RDS doesn't allow two DB instances with the same name. After you
 * have renamed your original DB instance with a different identifier, then you can pass the original name of the DB instance as
 * the `DBInstanceIdentifier` in the call to the `RestoreDBInstanceFromDBSnapshot` operation. The result is that you replace the original
 * DB instance with the DB instance created from the snapshot.
 *
 * If you are restoring from a shared manual DB snapshot, the `DBSnapshotIdentifier`
 * must be the ARN of the shared DB snapshot.
 *
 * To restore from a DB snapshot with an unsupported engine version, you must first upgrade the
 * engine version of the snapshot. For more information about upgrading a RDS for MySQL DB snapshot engine version, see Upgrading a MySQL DB snapshot engine version.
 * For more information about upgrading a RDS for PostgreSQL DB snapshot engine version, Upgrading a PostgreSQL DB snapshot engine version.
 *
 * This command doesn't apply to Aurora MySQL and Aurora PostgreSQL. For Aurora, use `RestoreDBClusterFromSnapshot`.
 */
export const restoreDBInstanceFromDBSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreDBInstanceFromDBSnapshotMessage,
    output: RestoreDBInstanceFromDBSnapshotResult,
    errors: [
      AuthorizationNotFoundFault,
      BackupPolicyNotFoundFault,
      CertificateNotFoundFault,
      DBClusterSnapshotNotFoundFault,
      DBInstanceAlreadyExistsFault,
      DBParameterGroupNotFoundFault,
      DBSecurityGroupNotFoundFault,
      DBSnapshotNotFoundFault,
      DBSubnetGroupDoesNotCoverEnoughAZs,
      DBSubnetGroupNotFoundFault,
      DomainNotFoundFault,
      InstanceQuotaExceededFault,
      InsufficientDBInstanceCapacityFault,
      InvalidDBSnapshotStateFault,
      InvalidRestoreFault,
      InvalidSubnet,
      InvalidVPCNetworkStateFault,
      KMSKeyNotAccessibleFault,
      NetworkTypeNotSupported,
      OptionGroupNotFoundFault,
      ProvisionedIopsNotAvailableInAZFault,
      StorageQuotaExceededFault,
      StorageTypeNotSupportedFault,
      TenantDatabaseQuotaExceededFault,
      VpcEncryptionControlViolationException,
    ],
  }));
/**
 * Amazon Relational Database Service (Amazon RDS)
 * supports importing MySQL databases by using backup files.
 * You can create a backup of your on-premises database,
 * store it on Amazon Simple Storage Service (Amazon S3),
 * and then restore the backup file onto a new Amazon RDS DB instance running MySQL.
 * For more information, see Restoring a backup into an Amazon RDS for MySQL DB instance
 * in the *Amazon RDS User Guide.*
 *
 * This operation doesn't apply to RDS Custom.
 */
export const restoreDBInstanceFromS3 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreDBInstanceFromS3Message,
    output: RestoreDBInstanceFromS3Result,
    errors: [
      AuthorizationNotFoundFault,
      BackupPolicyNotFoundFault,
      CertificateNotFoundFault,
      DBInstanceAlreadyExistsFault,
      DBParameterGroupNotFoundFault,
      DBSecurityGroupNotFoundFault,
      DBSubnetGroupDoesNotCoverEnoughAZs,
      DBSubnetGroupNotFoundFault,
      InstanceQuotaExceededFault,
      InsufficientDBInstanceCapacityFault,
      InvalidS3BucketFault,
      InvalidSubnet,
      InvalidVPCNetworkStateFault,
      KMSKeyNotAccessibleFault,
      NetworkTypeNotSupported,
      OptionGroupNotFoundFault,
      ProvisionedIopsNotAvailableInAZFault,
      StorageQuotaExceededFault,
      StorageTypeNotSupportedFault,
      VpcEncryptionControlViolationException,
    ],
  }),
);
/**
 * Restores a DB instance to an arbitrary point in time. You can restore to any point in time before the time identified by the `LatestRestorableTime` property. You can restore to a point up to the number of days specified by the `BackupRetentionPeriod` property.
 *
 * The target database is created with most of the original configuration, but in a
 * system-selected Availability Zone, with the default security group, the default subnet
 * group, and the default DB parameter group. By default, the new DB instance is created as
 * a single-AZ deployment except when the instance is a SQL Server instance that has an
 * option group that is associated with mirroring; in this case, the instance becomes a
 * mirrored deployment and not a single-AZ deployment.
 *
 * This operation doesn't apply to Aurora MySQL and Aurora PostgreSQL. For Aurora, use `RestoreDBClusterToPointInTime`.
 */
export const restoreDBInstanceToPointInTime =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreDBInstanceToPointInTimeMessage,
    output: RestoreDBInstanceToPointInTimeResult,
    errors: [
      AuthorizationNotFoundFault,
      BackupPolicyNotFoundFault,
      CertificateNotFoundFault,
      DBInstanceAlreadyExistsFault,
      DBInstanceAutomatedBackupNotFoundFault,
      DBInstanceNotFoundFault,
      DBParameterGroupNotFoundFault,
      DBSecurityGroupNotFoundFault,
      DBSubnetGroupDoesNotCoverEnoughAZs,
      DBSubnetGroupNotFoundFault,
      DomainNotFoundFault,
      InstanceQuotaExceededFault,
      InsufficientDBInstanceCapacityFault,
      InvalidDBInstanceStateFault,
      InvalidRestoreFault,
      InvalidSubnet,
      InvalidVPCNetworkStateFault,
      KMSKeyNotAccessibleFault,
      NetworkTypeNotSupported,
      OptionGroupNotFoundFault,
      PointInTimeRestoreNotEnabledFault,
      ProvisionedIopsNotAvailableInAZFault,
      StorageQuotaExceededFault,
      StorageTypeNotSupportedFault,
      TenantDatabaseQuotaExceededFault,
      VpcEncryptionControlViolationException,
    ],
  }));
/**
 * Enables replication of automated backups to a different Amazon Web Services Region.
 *
 * This command doesn't apply to RDS Custom.
 *
 * For more information, see
 * Replicating Automated Backups to Another Amazon Web Services Region in the *Amazon RDS User Guide.*
 */
export const startDBInstanceAutomatedBackupsReplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDBInstanceAutomatedBackupsReplicationMessage,
    output: StartDBInstanceAutomatedBackupsReplicationResult,
    errors: [
      DBInstanceAutomatedBackupQuotaExceededFault,
      DBInstanceNotFoundFault,
      InvalidDBInstanceAutomatedBackupStateFault,
      InvalidDBInstanceStateFault,
      KMSKeyNotAccessibleFault,
      StorageTypeNotSupportedFault,
    ],
  }));
/**
 * Creates a new Amazon Aurora DB cluster or Multi-AZ DB cluster.
 *
 * If you create an Aurora DB cluster, the request creates an empty cluster. You must
 * explicitly create the writer instance for your DB cluster using the CreateDBInstance operation. If you create a Multi-AZ DB cluster, the
 * request creates a writer and two reader DB instances for you, each in a different
 * Availability Zone.
 *
 * You can use the `ReplicationSourceIdentifier` parameter to create an Amazon
 * Aurora DB cluster as a read replica of another DB cluster or Amazon RDS for MySQL or
 * PostgreSQL DB instance. For more information about Amazon Aurora, see What is Amazon Aurora? in the Amazon Aurora User
 * Guide.
 *
 * You can also use the `ReplicationSourceIdentifier` parameter to create a
 * Multi-AZ DB cluster read replica with an RDS for MySQL or PostgreSQL DB instance as the
 * source. For more information about Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const createDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBClusterMessage,
  output: CreateDBClusterResult,
  errors: [
    DBClusterAlreadyExistsFault,
    DBClusterNotFoundFault,
    DBClusterParameterGroupNotFoundFault,
    DBClusterQuotaExceededFault,
    DBInstanceNotFoundFault,
    DBSubnetGroupDoesNotCoverEnoughAZs,
    DBSubnetGroupNotFoundFault,
    DomainNotFoundFault,
    GlobalClusterNotFoundFault,
    InsufficientDBInstanceCapacityFault,
    InsufficientStorageClusterCapacityFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidDBSubnetGroupFault,
    InvalidDBSubnetGroupStateFault,
    InvalidGlobalClusterStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    NetworkTypeNotSupported,
    OptionGroupNotFoundFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
    VpcEncryptionControlViolationException,
  ],
}));
/**
 * Creates a new DB instance.
 *
 * The new DB instance can be an RDS DB instance, or it can be a DB instance in an Aurora DB cluster.
 * For an Aurora DB cluster, you can call this operation multiple times to add more than one DB instance
 * to the cluster.
 *
 * For more information about creating an RDS DB instance, see
 * Creating an Amazon RDS DB instance in the *Amazon RDS User Guide*.
 *
 * For more information about creating a DB instance in an Aurora DB cluster, see
 *
 * Creating an Amazon Aurora DB cluster in the *Amazon Aurora User Guide*.
 */
export const createDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBInstanceMessage,
  output: CreateDBInstanceResult,
  errors: [
    AuthorizationNotFoundFault,
    BackupPolicyNotFoundFault,
    CertificateNotFoundFault,
    DBClusterNotFoundFault,
    DBInstanceAlreadyExistsFault,
    DBParameterGroupNotFoundFault,
    DBSecurityGroupNotFoundFault,
    DBSubnetGroupDoesNotCoverEnoughAZs,
    DBSubnetGroupNotFoundFault,
    DomainNotFoundFault,
    InstanceQuotaExceededFault,
    InsufficientDBInstanceCapacityFault,
    InvalidDBClusterStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    NetworkTypeNotSupported,
    OptionGroupNotFoundFault,
    ProvisionedIopsNotAvailableInAZFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
    TenantDatabaseQuotaExceededFault,
    VpcEncryptionControlViolationException,
  ],
}));
/**
 * Creates a new DB security group. DB security groups control access to a DB instance.
 *
 * A DB security group controls access to EC2-Classic DB instances that are not in a VPC.
 *
 * EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that
 * you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the
 * *Amazon EC2 User Guide*, the blog EC2-Classic Networking is Retiring –
 * Here’s How to Prepare, and Moving a DB instance not in a VPC
 * into a VPC in the *Amazon RDS User Guide*.
 */
export const createDBSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDBSecurityGroupMessage,
    output: CreateDBSecurityGroupResult,
    errors: [
      DBSecurityGroupAlreadyExistsFault,
      DBSecurityGroupNotSupportedFault,
      DBSecurityGroupQuotaExceededFault,
    ],
  }),
);
/**
 * Creates a new DB shard group for Aurora Limitless Database. You must enable Aurora Limitless Database to create a DB shard group.
 *
 * Valid for: Aurora DB clusters only
 */
export const createDBShardGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBShardGroupMessage,
  output: DBShardGroup,
  errors: [
    DBClusterNotFoundFault,
    DBShardGroupAlreadyExistsFault,
    InvalidDBClusterStateFault,
    InvalidVPCNetworkStateFault,
    MaxDBShardGroupLimitReached,
    NetworkTypeNotSupported,
    UnsupportedDBEngineVersionFault,
  ],
}));
/**
 * Creates an RDS event notification subscription. This operation requires a topic Amazon
 * Resource Name (ARN) created by either the RDS console, the SNS console, or the SNS API.
 * To obtain an ARN with SNS, you must create a topic in Amazon SNS and subscribe to the
 * topic. The ARN is displayed in the SNS console.
 *
 * You can specify the type of source (`SourceType`) that you want to be
 * notified of and provide a list of RDS sources (`SourceIds`) that triggers the
 * events. You can also provide a list of event categories (`EventCategories`)
 * for events that you want to be notified of. For example, you can specify
 * `SourceType` = `db-instance`, `SourceIds` =
 * `mydbinstance1`, `mydbinstance2` and
 * `EventCategories` = `Availability`,
 * `Backup`.
 *
 * If you specify both the `SourceType` and `SourceIds`, such as `SourceType` = `db-instance`
 * and `SourceIds` = `myDBInstance1`, you are notified of all the `db-instance` events for
 * the specified source. If you specify a `SourceType` but do not specify `SourceIds`,
 * you receive notice of the events for that source type for all your RDS sources. If you
 * don't specify either the SourceType or the `SourceIds`, you are notified of events
 * generated from all RDS sources belonging to your customer account.
 *
 * For more information about subscribing to an event for RDS DB engines, see
 *
 * Subscribing to Amazon RDS event notification in the *Amazon RDS User Guide*.
 *
 * For more information about subscribing to an event for Aurora DB engines, see
 *
 * Subscribing to Amazon RDS event notification in the *Amazon Aurora User Guide*.
 */
export const createEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEventSubscriptionMessage,
    output: CreateEventSubscriptionResult,
    errors: [
      EventSubscriptionQuotaExceededFault,
      SNSInvalidTopicFault,
      SNSNoAuthorizationFault,
      SNSTopicArnNotFoundFault,
      SourceNotFoundFault,
      SubscriptionAlreadyExistFault,
      SubscriptionCategoryNotFoundFault,
    ],
  }),
);
/**
 * Creates an Aurora global database
 * spread across multiple Amazon Web Services Regions. The global database
 * contains a single primary cluster with read-write capability,
 * and a read-only secondary cluster that receives
 * data from the primary cluster through high-speed replication
 * performed by the Aurora storage subsystem.
 *
 * You can create a global database that is initially empty, and then
 * create the primary and secondary DB clusters in the global database.
 * Or you can specify an existing Aurora cluster during the create operation,
 * and this cluster becomes the primary cluster of the global database.
 *
 * This operation applies only to Aurora DB clusters.
 */
export const createGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlobalClusterMessage,
  output: CreateGlobalClusterResult,
  errors: [
    DBClusterNotFoundFault,
    GlobalClusterAlreadyExistsFault,
    GlobalClusterQuotaExceededFault,
    InvalidDBClusterStateFault,
    InvalidDBShardGroupStateFault,
    ResourceNotFoundFault,
  ],
}));
/**
 * Creates a tenant database in a DB instance that uses the multi-tenant configuration.
 * Only RDS for Oracle container database (CDB) instances are supported.
 */
export const createTenantDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTenantDatabaseMessage,
    output: CreateTenantDatabaseResult,
    errors: [
      DBInstanceNotFoundFault,
      InvalidDBInstanceStateFault,
      KMSKeyNotAccessibleFault,
      TenantDatabaseAlreadyExistsFault,
      TenantDatabaseQuotaExceededFault,
    ],
  }),
);
/**
 * The DeleteDBCluster action deletes a previously provisioned DB cluster.
 * When you delete a DB cluster, all automated backups for that DB cluster are deleted and can't be recovered.
 * Manual DB cluster snapshots of the specified DB cluster are not deleted.
 *
 * If you're deleting a Multi-AZ DB cluster with read replicas, all cluster members are
 * terminated and read replicas are promoted to standalone instances.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const deleteDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBClusterMessage,
  output: DeleteDBClusterResult,
  errors: [
    DBClusterAutomatedBackupQuotaExceededFault,
    DBClusterNotFoundFault,
    DBClusterSnapshotAlreadyExistsFault,
    InvalidDBClusterSnapshotStateFault,
    InvalidDBClusterStateFault,
    InvalidGlobalClusterStateFault,
    KMSKeyNotAccessibleFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * Deletes automated backups using the `DbClusterResourceId` value of the source DB cluster or the Amazon
 * Resource Name (ARN) of the automated backups.
 */
export const deleteDBClusterAutomatedBackup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDBClusterAutomatedBackupMessage,
    output: DeleteDBClusterAutomatedBackupResult,
    errors: [
      DBClusterAutomatedBackupNotFoundFault,
      InvalidDBClusterAutomatedBackupStateFault,
    ],
  }));
/**
 * Describes all available options for the specified engine.
 */
export const describeOptionGroupOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeOptionGroupOptionsMessage,
    output: OptionGroupOptionsMessage,
    errors: [],
  }),
);
/**
 * Returns information about reserved DB instances for this account, or about a specified reserved DB instance.
 */
export const describeReservedDBInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReservedDBInstancesMessage,
    output: ReservedDBInstanceMessage,
    errors: [ReservedDBInstanceNotFoundFault],
  }),
);
/**
 * You can call `DescribeValidDBInstanceModifications` to learn what modifications you can make to
 * your DB instance. You can use this information when you call `ModifyDBInstance`.
 *
 * This command doesn't apply to RDS Custom.
 */
export const describeValidDBInstanceModifications =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeValidDBInstanceModificationsMessage,
    output: DescribeValidDBInstanceModificationsResult,
    errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
  }));
/**
 * Modifies an existing DB subnet group. DB subnet groups must contain at least one subnet in at least two AZs in the Amazon Web Services Region.
 */
export const modifyDBSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBSubnetGroupMessage,
  output: ModifyDBSubnetGroupResult,
  errors: [
    DBSubnetGroupDoesNotCoverEnoughAZs,
    DBSubnetGroupNotFoundFault,
    DBSubnetQuotaExceededFault,
    InvalidDBSubnetGroupStateFault,
    InvalidSubnet,
    SubnetAlreadyInUse,
  ],
}));
/**
 * Modifies an existing RDS event notification subscription. You can't modify the source identifiers using this call. To change
 * source identifiers for a subscription, use the `AddSourceIdentifierToSubscription` and `RemoveSourceIdentifierFromSubscription` calls.
 *
 * You can see a list of the event categories for a given source type (`SourceType`)
 * in Events in the *Amazon RDS User Guide*
 * or by using the `DescribeEventCategories` operation.
 */
export const modifyEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyEventSubscriptionMessage,
    output: ModifyEventSubscriptionResult,
    errors: [
      EventSubscriptionQuotaExceededFault,
      SNSInvalidTopicFault,
      SNSNoAuthorizationFault,
      SNSTopicArnNotFoundFault,
      SubscriptionCategoryNotFoundFault,
      SubscriptionNotFoundFault,
    ],
  }),
);
/**
 * Enables ingress to a DBSecurityGroup using one of two forms of authorization. First, EC2 or VPC security
 * groups can be added to the DBSecurityGroup if the application using the database is running on EC2 or VPC
 * instances. Second, IP ranges are available if the application accessing your database is running on the internet.
 * Required parameters for this API are one of CIDR range, EC2SecurityGroupId for VPC, or (EC2SecurityGroupOwnerId
 * and either EC2SecurityGroupName or EC2SecurityGroupId for non-VPC).
 *
 * You can't authorize ingress from an EC2 security group in one Amazon Web Services Region to an Amazon RDS DB instance in
 * another. You can't authorize ingress from a VPC security group in one VPC to an Amazon RDS DB instance in another.
 *
 * For an overview of CIDR ranges, go to the
 * Wikipedia Tutorial.
 *
 * EC2-Classic was retired on August 15, 2022. If you haven't migrated from EC2-Classic to a VPC, we recommend that
 * you migrate as soon as possible. For more information, see Migrate from EC2-Classic to a VPC in the
 * *Amazon EC2 User Guide*, the blog EC2-Classic Networking is Retiring –
 * Here’s How to Prepare, and Moving a DB instance not in a VPC
 * into a VPC in the *Amazon RDS User Guide*.
 */
export const authorizeDBSecurityGroupIngress =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AuthorizeDBSecurityGroupIngressMessage,
    output: AuthorizeDBSecurityGroupIngressResult,
    errors: [
      AuthorizationAlreadyExistsFault,
      AuthorizationQuotaExceededFault,
      DBSecurityGroupNotFoundFault,
      InvalidDBSecurityGroupStateFault,
    ],
  }));
/**
 * Creates a new DB instance that acts as a read replica for an existing source DB
 * instance or Multi-AZ DB cluster. You can create a read replica for a DB instance running
 * Db2, MariaDB, MySQL, Oracle, PostgreSQL, or SQL Server. You can create a read replica
 * for a Multi-AZ DB cluster running MySQL or PostgreSQL. For more information, see Working
 * with read replicas and Migrating from a Multi-AZ DB cluster to a DB instance using a read replica
 * in the *Amazon RDS User Guide*.
 *
 * Amazon Aurora doesn't support this operation. To create a DB instance for an Aurora DB cluster, use the `CreateDBInstance`
 * operation.
 *
 * RDS creates read replicas with backups disabled. All other attributes
 * (including DB security groups and DB parameter groups) are inherited from the source DB
 * instance or cluster, except as specified.
 *
 * Your source DB instance or cluster must have backup retention enabled.
 */
export const createDBInstanceReadReplica = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDBInstanceReadReplicaMessage,
    output: CreateDBInstanceReadReplicaResult,
    errors: [
      CertificateNotFoundFault,
      DBClusterNotFoundFault,
      DBInstanceAlreadyExistsFault,
      DBInstanceNotFoundFault,
      DBParameterGroupNotFoundFault,
      DBSecurityGroupNotFoundFault,
      DBSubnetGroupDoesNotCoverEnoughAZs,
      DBSubnetGroupNotAllowedFault,
      DBSubnetGroupNotFoundFault,
      DomainNotFoundFault,
      InstanceQuotaExceededFault,
      InsufficientDBInstanceCapacityFault,
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
      InvalidDBSubnetGroupFault,
      InvalidSubnet,
      InvalidVPCNetworkStateFault,
      KMSKeyNotAccessibleFault,
      NetworkTypeNotSupported,
      OptionGroupNotFoundFault,
      ProvisionedIopsNotAvailableInAZFault,
      StorageQuotaExceededFault,
      StorageTypeNotSupportedFault,
      TenantDatabaseQuotaExceededFault,
      VpcEncryptionControlViolationException,
    ],
  }),
);
/**
 * Modifies the settings of an Amazon Aurora DB cluster or a Multi-AZ DB cluster.
 * You can change one or more settings by specifying these parameters and the new values in the
 * request.
 *
 * For more information on Amazon Aurora DB clusters, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const modifyDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBClusterMessage,
  output: ModifyDBClusterResult,
  errors: [
    DBClusterAlreadyExistsFault,
    DBClusterNotFoundFault,
    DBClusterParameterGroupNotFoundFault,
    DBInstanceAlreadyExistsFault,
    DBParameterGroupNotFoundFault,
    DBSubnetGroupNotFoundFault,
    DomainNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidDBSecurityGroupStateFault,
    InvalidDBSubnetGroupStateFault,
    InvalidGlobalClusterStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    NetworkTypeNotSupported,
    OptionGroupNotFoundFault,
    StorageQuotaExceededFault,
    StorageTypeNotAvailableFault,
    StorageTypeNotSupportedFault,
    VpcEncryptionControlViolationException,
  ],
}));
/**
 * Creates a blue/green deployment.
 *
 * A blue/green deployment creates a staging environment that copies the production environment.
 * In a blue/green deployment, the blue environment is the current production environment.
 * The green environment is the staging environment, and it stays in sync
 * with the current production environment.
 *
 * You can make changes to the databases in the green environment without affecting
 * production workloads. For example, you can upgrade the major or minor DB engine version, change
 * database parameters, or make schema changes in the staging environment. You can thoroughly test
 * changes in the green environment. When ready, you can switch over the environments to promote the
 * green environment to be the new production environment. The switchover typically takes under a minute.
 *
 * For more information, see Using Amazon RDS Blue/Green Deployments
 * for database updates in the *Amazon RDS User Guide* and
 *
 * Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora
 * User Guide.
 */
export const createBlueGreenDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateBlueGreenDeploymentRequest,
    output: CreateBlueGreenDeploymentResponse,
    errors: [
      BlueGreenDeploymentAlreadyExistsFault,
      DBClusterNotFoundFault,
      DBClusterParameterGroupNotFoundFault,
      DBClusterQuotaExceededFault,
      DBInstanceNotFoundFault,
      DBParameterGroupNotFoundFault,
      InstanceQuotaExceededFault,
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
      SourceClusterNotSupportedFault,
      SourceDatabaseNotSupportedFault,
      StorageQuotaExceededFault,
    ],
  }),
);
/**
 * Creates a custom DB engine version (CEV).
 */
export const createCustomDBEngineVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCustomDBEngineVersionMessage,
    output: DBEngineVersion,
    errors: [
      CreateCustomDBEngineVersionFault,
      CustomDBEngineVersionAlreadyExistsFault,
      CustomDBEngineVersionNotFoundFault,
      CustomDBEngineVersionQuotaExceededFault,
      Ec2ImagePropertiesNotSupportedFault,
      InvalidCustomDBEngineVersionStateFault,
      KMSKeyNotAccessibleFault,
    ],
  }),
);
/**
 * Creates a new DB subnet group. DB subnet groups must contain at least one subnet in at least two AZs in the Amazon Web Services Region.
 */
export const createDBSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBSubnetGroupMessage,
  output: CreateDBSubnetGroupResult,
  errors: [
    DBSubnetGroupAlreadyExistsFault,
    DBSubnetGroupDoesNotCoverEnoughAZs,
    DBSubnetGroupQuotaExceededFault,
    DBSubnetQuotaExceededFault,
    InvalidSubnet,
  ],
}));
/**
 * Starts an export of DB snapshot or DB cluster data to Amazon S3.
 * The provided IAM role must have access to the S3 bucket.
 *
 * You can't export snapshot data from RDS Custom DB instances. For more information,
 * see
 * Supported Regions and DB engines for exporting snapshots to S3 in Amazon RDS.
 *
 * For more information on exporting DB snapshot data, see
 * Exporting DB snapshot
 * data to Amazon S3 in the *Amazon RDS User Guide*
 * or Exporting DB
 * cluster snapshot data to Amazon S3 in the *Amazon Aurora User Guide*.
 *
 * For more information on exporting DB cluster data, see
 * Exporting DB
 * cluster data to Amazon S3 in the *Amazon Aurora User Guide*.
 */
export const startExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExportTaskMessage,
  output: ExportTask,
  errors: [
    DBClusterNotFoundFault,
    DBClusterSnapshotNotFoundFault,
    DBSnapshotNotFoundFault,
    ExportTaskAlreadyExistsFault,
    IamRoleMissingPermissionsFault,
    IamRoleNotFoundFault,
    InvalidExportOnlyFault,
    InvalidExportSourceStateFault,
    InvalidS3BucketFault,
    KMSKeyNotAccessibleFault,
  ],
}));
/**
 * Describes the recommendations to resolve the issues for your DB instances, DB clusters, and DB parameter groups.
 */
export const describeDBRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDBRecommendationsMessage,
    output: DBRecommendationsMessage,
    errors: [],
  }),
);
