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
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://rds.amazonaws.com/doc/2014-10-31/");
const svc = T.AwsApiService({ sdkId: "RDS", serviceShapeName: "AmazonRDSv19" });
const auth = T.AwsAuthSigv4({ name: "rds" });
const ver = T.ServiceVersion("2014-10-31");
const proto = T.AwsProtocolsAwsQuery();
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
              `https://rds-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://rds.${Region}.amazonaws.com`);
            }
            return e(
              `https://rds-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://rds.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://rds.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type SensitiveString = string | redacted.Redacted<string>;
export type BlueGreenDeploymentName = string;
export type DatabaseArn = string;
export type TargetEngineVersion = string;
export type TargetDBParameterGroupName = string;
export type TargetDBClusterParameterGroupName = string;
export type TargetDBInstanceClass = string;
export type TargetStorageType = string;
export type CustomEngineName = string;
export type CustomEngineVersion = string;
export type BucketName = string;
export type String255 = string;
export type KmsKeyIdOrArn = string;
export type Description = string;
export type CustomDBEngineVersionManifest = string;
export type GlobalClusterIdentifier = string;
export type DBProxyName = string;
export type Arn = string;
export type DBProxyEndpointName = string;
export type SourceArn = string;
export type IntegrationName = string;
export type DataFilter = string;
export type IntegrationDescription = string;
export type BlueGreenDeploymentIdentifier = string;
export type DBShardGroupIdentifier = string;
export type IntegrationIdentifier = string;
export type DBProxyTargetGroupName = string;
export type MaxRecords = number;
export type Engine = string;
export type MajorEngineVersion = string;
export type Marker = string;
export type DBClusterIdentifier = string;
export type AwsBackupRecoveryPointArn = string;
export type SwitchoverTimeout = number;
export type AuthUserName = string;
export type PotentiallySensitiveParameterValue = string;
export type ExceptionMessage = string;
export type IntegrationArn = string;
export type PotentiallySensitiveOptionSettingValue =
  | string
  | redacted.Redacted<string>;
export type BlueGreenDeploymentStatus = string;
export type BlueGreenDeploymentStatusDetails = string;
export type SwitchoverDetailStatus = string;
export type BlueGreenDeploymentTaskName = string;
export type BlueGreenDeploymentTaskStatus = string;

//# Schemas
export interface DescribeAccountAttributesMessage {}
export const DescribeAccountAttributesMessage = S.suspend(() =>
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
  identifier: "DescribeAccountAttributesMessage",
}) as any as S.Schema<DescribeAccountAttributesMessage>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type AvailabilityZones = string[];
export const AvailabilityZones = S.Array(
  S.String.pipe(T.XmlName("AvailabilityZone")),
);
export type VpcSecurityGroupIdList = string[];
export const VpcSecurityGroupIdList = S.Array(
  S.String.pipe(T.XmlName("VpcSecurityGroupId")),
);
export type LogTypeList = string[];
export const LogTypeList = S.Array(S.String);
export type DatabaseInsightsMode = "standard" | "advanced" | (string & {});
export const DatabaseInsightsMode = S.String;
export type ClusterScalabilityType = "standard" | "limitless" | (string & {});
export const ClusterScalabilityType = S.String;
export type MasterUserAuthenticationType =
  | "password"
  | "iam-db-auth"
  | (string & {});
export const MasterUserAuthenticationType = S.String;
export type DBSecurityGroupNameList = string[];
export const DBSecurityGroupNameList = S.Array(
  S.String.pipe(T.XmlName("DBSecurityGroupName")),
);
export type ReplicaMode = "open-read-only" | "mounted" | (string & {});
export const ReplicaMode = S.String;
export type EngineFamily = "MYSQL" | "POSTGRESQL" | "SQLSERVER" | (string & {});
export const EngineFamily = S.String;
export type DefaultAuthScheme = "IAM_AUTH" | "NONE" | (string & {});
export const DefaultAuthScheme = S.String;
export type EndpointNetworkType = "IPV4" | "IPV6" | "DUAL" | (string & {});
export const EndpointNetworkType = S.String;
export type TargetConnectionNetworkType = "IPV4" | "IPV6" | (string & {});
export const TargetConnectionNetworkType = S.String;
export type DBProxyEndpointTargetRole =
  | "READ_WRITE"
  | "READ_ONLY"
  | (string & {});
export const DBProxyEndpointTargetRole = S.String;
export type SubnetIdentifierList = string[];
export const SubnetIdentifierList = S.Array(
  S.String.pipe(T.XmlName("SubnetIdentifier")),
);
export type EventCategoriesList = string[];
export const EventCategoriesList = S.Array(
  S.String.pipe(T.XmlName("EventCategory")),
);
export type SourceIdsList = string[];
export const SourceIdsList = S.Array(S.String.pipe(T.XmlName("SourceId")));
export type SourceType =
  | "db-instance"
  | "db-parameter-group"
  | "db-security-group"
  | "db-snapshot"
  | "db-cluster"
  | "db-cluster-snapshot"
  | "custom-engine-version"
  | "db-proxy"
  | "blue-green-deployment"
  | "db-shard-group"
  | "zero-etl"
  | (string & {});
export const SourceType = S.String;
export type ExportSourceType = "SNAPSHOT" | "CLUSTER" | (string & {});
export const ExportSourceType = S.String;
export type AuditPolicyState = "locked" | "unlocked" | (string & {});
export const AuditPolicyState = S.String;
export type CustomEngineVersionStatus =
  | "available"
  | "inactive"
  | "inactive-except-restore"
  | (string & {});
export const CustomEngineVersionStatus = S.String;
export type AttributeValueList = string[];
export const AttributeValueList = S.Array(
  S.String.pipe(T.XmlName("AttributeValue")),
);
export type AutomationMode = "full" | "all-paused" | (string & {});
export const AutomationMode = S.String;
export type OptionNamesList = string[];
export const OptionNamesList = S.Array(S.String);
export type KeyList = string[];
export const KeyList = S.Array(S.String);
export type ActivityStreamMode = "sync" | "async" | (string & {});
export const ActivityStreamMode = S.String;
export interface AddRoleToDBClusterMessage {
  DBClusterIdentifier?: string;
  RoleArn?: string;
  FeatureName?: string;
}
export const AddRoleToDBClusterMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    RoleArn: S.optional(S.String),
    FeatureName: S.optional(S.String),
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
  identifier: "AddRoleToDBClusterMessage",
}) as any as S.Schema<AddRoleToDBClusterMessage>;
export interface AddRoleToDBClusterResponse {}
export const AddRoleToDBClusterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddRoleToDBClusterResponse",
}) as any as S.Schema<AddRoleToDBClusterResponse>;
export interface AddRoleToDBInstanceMessage {
  DBInstanceIdentifier?: string;
  RoleArn?: string;
  FeatureName?: string;
}
export const AddRoleToDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    RoleArn: S.optional(S.String),
    FeatureName: S.optional(S.String),
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
  identifier: "AddRoleToDBInstanceMessage",
}) as any as S.Schema<AddRoleToDBInstanceMessage>;
export interface AddRoleToDBInstanceResponse {}
export const AddRoleToDBInstanceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddRoleToDBInstanceResponse",
}) as any as S.Schema<AddRoleToDBInstanceResponse>;
export interface AddSourceIdentifierToSubscriptionMessage {
  SubscriptionName?: string;
  SourceIdentifier?: string;
}
export const AddSourceIdentifierToSubscriptionMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.optional(S.String),
    SourceIdentifier: S.optional(S.String),
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
  identifier: "AddSourceIdentifierToSubscriptionMessage",
}) as any as S.Schema<AddSourceIdentifierToSubscriptionMessage>;
export interface ApplyPendingMaintenanceActionMessage {
  ResourceIdentifier?: string;
  ApplyAction?: string;
  OptInType?: string;
}
export const ApplyPendingMaintenanceActionMessage = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.optional(S.String),
    ApplyAction: S.optional(S.String),
    OptInType: S.optional(S.String),
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
  identifier: "ApplyPendingMaintenanceActionMessage",
}) as any as S.Schema<ApplyPendingMaintenanceActionMessage>;
export interface AuthorizeDBSecurityGroupIngressMessage {
  DBSecurityGroupName?: string;
  CIDRIP?: string;
  EC2SecurityGroupName?: string;
  EC2SecurityGroupId?: string;
  EC2SecurityGroupOwnerId?: string;
}
export const AuthorizeDBSecurityGroupIngressMessage = S.suspend(() =>
  S.Struct({
    DBSecurityGroupName: S.optional(S.String),
    CIDRIP: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
    EC2SecurityGroupId: S.optional(S.String),
    EC2SecurityGroupOwnerId: S.optional(S.String),
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
  identifier: "AuthorizeDBSecurityGroupIngressMessage",
}) as any as S.Schema<AuthorizeDBSecurityGroupIngressMessage>;
export interface BacktrackDBClusterMessage {
  DBClusterIdentifier?: string;
  BacktrackTo?: Date;
  Force?: boolean;
  UseEarliestTimeOnPointInTimeUnavailable?: boolean;
}
export const BacktrackDBClusterMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    BacktrackTo: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Force: S.optional(S.Boolean),
    UseEarliestTimeOnPointInTimeUnavailable: S.optional(S.Boolean),
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
  identifier: "BacktrackDBClusterMessage",
}) as any as S.Schema<BacktrackDBClusterMessage>;
export interface CancelExportTaskMessage {
  ExportTaskIdentifier?: string;
}
export const CancelExportTaskMessage = S.suspend(() =>
  S.Struct({ ExportTaskIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "CancelExportTaskMessage",
}) as any as S.Schema<CancelExportTaskMessage>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(
  Tag.pipe(T.XmlName("Tag")).annotations({ identifier: "Tag" }),
);
export interface CopyDBClusterParameterGroupMessage {
  SourceDBClusterParameterGroupIdentifier?: string;
  TargetDBClusterParameterGroupIdentifier?: string;
  TargetDBClusterParameterGroupDescription?: string;
  Tags?: Tag[];
}
export const CopyDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    SourceDBClusterParameterGroupIdentifier: S.optional(S.String),
    TargetDBClusterParameterGroupIdentifier: S.optional(S.String),
    TargetDBClusterParameterGroupDescription: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CopyDBClusterParameterGroupMessage",
}) as any as S.Schema<CopyDBClusterParameterGroupMessage>;
export interface CopyDBClusterSnapshotMessage {
  SourceDBClusterSnapshotIdentifier?: string;
  TargetDBClusterSnapshotIdentifier?: string;
  KmsKeyId?: string;
  PreSignedUrl?: string | redacted.Redacted<string>;
  CopyTags?: boolean;
  Tags?: Tag[];
}
export const CopyDBClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    SourceDBClusterSnapshotIdentifier: S.optional(S.String),
    TargetDBClusterSnapshotIdentifier: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(SensitiveString),
    CopyTags: S.optional(S.Boolean),
    Tags: S.optional(TagList),
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
  identifier: "CopyDBClusterSnapshotMessage",
}) as any as S.Schema<CopyDBClusterSnapshotMessage>;
export interface CopyDBParameterGroupMessage {
  SourceDBParameterGroupIdentifier?: string;
  TargetDBParameterGroupIdentifier?: string;
  TargetDBParameterGroupDescription?: string;
  Tags?: Tag[];
}
export const CopyDBParameterGroupMessage = S.suspend(() =>
  S.Struct({
    SourceDBParameterGroupIdentifier: S.optional(S.String),
    TargetDBParameterGroupIdentifier: S.optional(S.String),
    TargetDBParameterGroupDescription: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CopyDBParameterGroupMessage",
}) as any as S.Schema<CopyDBParameterGroupMessage>;
export interface CopyDBSnapshotMessage {
  SourceDBSnapshotIdentifier?: string;
  TargetDBSnapshotIdentifier?: string;
  KmsKeyId?: string;
  Tags?: Tag[];
  CopyTags?: boolean;
  PreSignedUrl?: string | redacted.Redacted<string>;
  OptionGroupName?: string;
  TargetCustomAvailabilityZone?: string;
  SnapshotTarget?: string;
  CopyOptionGroup?: boolean;
  SnapshotAvailabilityZone?: string;
}
export const CopyDBSnapshotMessage = S.suspend(() =>
  S.Struct({
    SourceDBSnapshotIdentifier: S.optional(S.String),
    TargetDBSnapshotIdentifier: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
    CopyTags: S.optional(S.Boolean),
    PreSignedUrl: S.optional(SensitiveString),
    OptionGroupName: S.optional(S.String),
    TargetCustomAvailabilityZone: S.optional(S.String),
    SnapshotTarget: S.optional(S.String),
    CopyOptionGroup: S.optional(S.Boolean),
    SnapshotAvailabilityZone: S.optional(S.String),
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
  identifier: "CopyDBSnapshotMessage",
}) as any as S.Schema<CopyDBSnapshotMessage>;
export interface CopyOptionGroupMessage {
  SourceOptionGroupIdentifier?: string;
  TargetOptionGroupIdentifier?: string;
  TargetOptionGroupDescription?: string;
  Tags?: Tag[];
}
export const CopyOptionGroupMessage = S.suspend(() =>
  S.Struct({
    SourceOptionGroupIdentifier: S.optional(S.String),
    TargetOptionGroupIdentifier: S.optional(S.String),
    TargetOptionGroupDescription: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CopyOptionGroupMessage",
}) as any as S.Schema<CopyOptionGroupMessage>;
export interface CreateBlueGreenDeploymentRequest {
  BlueGreenDeploymentName?: string;
  Source?: string;
  TargetEngineVersion?: string;
  TargetDBParameterGroupName?: string;
  TargetDBClusterParameterGroupName?: string;
  Tags?: Tag[];
  TargetDBInstanceClass?: string;
  UpgradeTargetStorageConfig?: boolean;
  TargetIops?: number;
  TargetStorageType?: string;
  TargetAllocatedStorage?: number;
  TargetStorageThroughput?: number;
}
export const CreateBlueGreenDeploymentRequest = S.suspend(() =>
  S.Struct({
    BlueGreenDeploymentName: S.optional(S.String),
    Source: S.optional(S.String),
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
  identifier: "CreateBlueGreenDeploymentRequest",
}) as any as S.Schema<CreateBlueGreenDeploymentRequest>;
export interface CreateCustomDBEngineVersionMessage {
  Engine?: string;
  EngineVersion?: string;
  DatabaseInstallationFilesS3BucketName?: string;
  DatabaseInstallationFilesS3Prefix?: string;
  ImageId?: string;
  KMSKeyId?: string;
  SourceCustomDbEngineVersionIdentifier?: string;
  UseAwsProvidedLatestImage?: boolean;
  Description?: string;
  Manifest?: string;
  Tags?: Tag[];
  DatabaseInstallationFiles?: string[];
}
export const CreateCustomDBEngineVersionMessage = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
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
  identifier: "CreateCustomDBEngineVersionMessage",
}) as any as S.Schema<CreateCustomDBEngineVersionMessage>;
export interface CreateDBClusterEndpointMessage {
  DBClusterIdentifier?: string;
  DBClusterEndpointIdentifier?: string;
  EndpointType?: string;
  StaticMembers?: string[];
  ExcludedMembers?: string[];
  Tags?: Tag[];
}
export const CreateDBClusterEndpointMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    DBClusterEndpointIdentifier: S.optional(S.String),
    EndpointType: S.optional(S.String),
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
    Tags: S.optional(TagList),
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
  identifier: "CreateDBClusterEndpointMessage",
}) as any as S.Schema<CreateDBClusterEndpointMessage>;
export interface CreateDBClusterParameterGroupMessage {
  DBClusterParameterGroupName?: string;
  DBParameterGroupFamily?: string;
  Description?: string;
  Tags?: Tag[];
}
export const CreateDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.optional(S.String),
    DBParameterGroupFamily: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CreateDBClusterParameterGroupMessage",
}) as any as S.Schema<CreateDBClusterParameterGroupMessage>;
export interface CreateDBClusterSnapshotMessage {
  DBClusterSnapshotIdentifier?: string;
  DBClusterIdentifier?: string;
  Tags?: Tag[];
}
export const CreateDBClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    DBClusterSnapshotIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CreateDBClusterSnapshotMessage",
}) as any as S.Schema<CreateDBClusterSnapshotMessage>;
export interface ProcessorFeature {
  Name?: string;
  Value?: string;
}
export const ProcessorFeature = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "ProcessorFeature",
}) as any as S.Schema<ProcessorFeature>;
export type ProcessorFeatureList = ProcessorFeature[];
export const ProcessorFeatureList = S.Array(
  ProcessorFeature.pipe(T.XmlName("ProcessorFeature")).annotations({
    identifier: "ProcessorFeature",
  }),
);
export interface TagSpecification {
  ResourceType?: string;
  Tags?: Tag[];
}
export const TagSpecification = S.suspend(() =>
  S.Struct({ ResourceType: S.optional(S.String), Tags: S.optional(TagList) }),
).annotations({
  identifier: "TagSpecification",
}) as any as S.Schema<TagSpecification>;
export type TagSpecificationList = TagSpecification[];
export const TagSpecificationList = S.Array(
  TagSpecification.pipe(T.XmlName("item")).annotations({
    identifier: "TagSpecification",
  }),
);
export interface AdditionalStorageVolume {
  VolumeName?: string;
  AllocatedStorage?: number;
  IOPS?: number;
  MaxAllocatedStorage?: number;
  StorageThroughput?: number;
  StorageType?: string;
}
export const AdditionalStorageVolume = S.suspend(() =>
  S.Struct({
    VolumeName: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    IOPS: S.optional(S.Number),
    MaxAllocatedStorage: S.optional(S.Number),
    StorageThroughput: S.optional(S.Number),
    StorageType: S.optional(S.String),
  }),
).annotations({
  identifier: "AdditionalStorageVolume",
}) as any as S.Schema<AdditionalStorageVolume>;
export type AdditionalStorageVolumesList = AdditionalStorageVolume[];
export const AdditionalStorageVolumesList = S.Array(AdditionalStorageVolume);
export interface CreateDBInstanceReadReplicaMessage {
  DBInstanceIdentifier?: string;
  SourceDBInstanceIdentifier?: string;
  DBInstanceClass?: string;
  AvailabilityZone?: string;
  Port?: number;
  MultiAZ?: boolean;
  AutoMinorVersionUpgrade?: boolean;
  Iops?: number;
  StorageThroughput?: number;
  OptionGroupName?: string;
  DBParameterGroupName?: string;
  PubliclyAccessible?: boolean;
  Tags?: Tag[];
  DBSubnetGroupName?: string;
  VpcSecurityGroupIds?: string[];
  StorageType?: string;
  CopyTagsToSnapshot?: boolean;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  KmsKeyId?: string;
  PreSignedUrl?: string | redacted.Redacted<string>;
  EnableIAMDatabaseAuthentication?: boolean;
  DatabaseInsightsMode?: DatabaseInsightsMode;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  EnableCloudwatchLogsExports?: string[];
  ProcessorFeatures?: ProcessorFeature[];
  UseDefaultProcessorFeatures?: boolean;
  DeletionProtection?: boolean;
  Domain?: string;
  DomainIAMRoleName?: string;
  DomainFqdn?: string;
  DomainOu?: string;
  DomainAuthSecretArn?: string;
  DomainDnsIps?: string[];
  ReplicaMode?: ReplicaMode;
  EnableCustomerOwnedIp?: boolean;
  NetworkType?: string;
  MaxAllocatedStorage?: number;
  BackupTarget?: string;
  CustomIamInstanceProfile?: string;
  AllocatedStorage?: number;
  SourceDBClusterIdentifier?: string;
  DedicatedLogVolume?: boolean;
  UpgradeStorageConfig?: boolean;
  CACertificateIdentifier?: string;
  TagSpecifications?: TagSpecification[];
  AdditionalStorageVolumes?: AdditionalStorageVolume[];
}
export const CreateDBInstanceReadReplicaMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
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
    PreSignedUrl: S.optional(SensitiveString),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    DatabaseInsightsMode: S.optional(DatabaseInsightsMode),
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
    ReplicaMode: S.optional(ReplicaMode),
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
  identifier: "CreateDBInstanceReadReplicaMessage",
}) as any as S.Schema<CreateDBInstanceReadReplicaMessage>;
export interface CreateDBParameterGroupMessage {
  DBParameterGroupName?: string;
  DBParameterGroupFamily?: string;
  Description?: string;
  Tags?: Tag[];
}
export const CreateDBParameterGroupMessage = S.suspend(() =>
  S.Struct({
    DBParameterGroupName: S.optional(S.String),
    DBParameterGroupFamily: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CreateDBParameterGroupMessage",
}) as any as S.Schema<CreateDBParameterGroupMessage>;
export interface CreateDBProxyEndpointRequest {
  DBProxyName?: string;
  DBProxyEndpointName?: string;
  VpcSubnetIds?: string[];
  VpcSecurityGroupIds?: string[];
  TargetRole?: DBProxyEndpointTargetRole;
  Tags?: Tag[];
  EndpointNetworkType?: EndpointNetworkType;
}
export const CreateDBProxyEndpointRequest = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    DBProxyEndpointName: S.optional(S.String),
    VpcSubnetIds: S.optional(StringList),
    VpcSecurityGroupIds: S.optional(StringList),
    TargetRole: S.optional(DBProxyEndpointTargetRole),
    Tags: S.optional(TagList),
    EndpointNetworkType: S.optional(EndpointNetworkType),
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
  identifier: "CreateDBProxyEndpointRequest",
}) as any as S.Schema<CreateDBProxyEndpointRequest>;
export interface CreateDBSecurityGroupMessage {
  DBSecurityGroupName?: string;
  DBSecurityGroupDescription?: string;
  Tags?: Tag[];
}
export const CreateDBSecurityGroupMessage = S.suspend(() =>
  S.Struct({
    DBSecurityGroupName: S.optional(S.String),
    DBSecurityGroupDescription: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CreateDBSecurityGroupMessage",
}) as any as S.Schema<CreateDBSecurityGroupMessage>;
export interface CreateDBShardGroupMessage {
  DBShardGroupIdentifier?: string;
  DBClusterIdentifier?: string;
  ComputeRedundancy?: number;
  MaxACU?: number;
  MinACU?: number;
  PubliclyAccessible?: boolean;
  Tags?: Tag[];
}
export const CreateDBShardGroupMessage = S.suspend(() =>
  S.Struct({
    DBShardGroupIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    ComputeRedundancy: S.optional(S.Number),
    MaxACU: S.optional(S.Number),
    MinACU: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    Tags: S.optional(TagList),
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
  identifier: "CreateDBShardGroupMessage",
}) as any as S.Schema<CreateDBShardGroupMessage>;
export interface CreateDBSnapshotMessage {
  DBSnapshotIdentifier?: string;
  DBInstanceIdentifier?: string;
  Tags?: Tag[];
}
export const CreateDBSnapshotMessage = S.suspend(() =>
  S.Struct({
    DBSnapshotIdentifier: S.optional(S.String),
    DBInstanceIdentifier: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CreateDBSnapshotMessage",
}) as any as S.Schema<CreateDBSnapshotMessage>;
export interface CreateDBSubnetGroupMessage {
  DBSubnetGroupName?: string;
  DBSubnetGroupDescription?: string;
  SubnetIds?: string[];
  Tags?: Tag[];
}
export const CreateDBSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    DBSubnetGroupName: S.optional(S.String),
    DBSubnetGroupDescription: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdentifierList),
    Tags: S.optional(TagList),
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
  identifier: "CreateDBSubnetGroupMessage",
}) as any as S.Schema<CreateDBSubnetGroupMessage>;
export interface CreateEventSubscriptionMessage {
  SubscriptionName?: string;
  SnsTopicArn?: string;
  SourceType?: string;
  EventCategories?: string[];
  SourceIds?: string[];
  Enabled?: boolean;
  Tags?: Tag[];
}
export const CreateEventSubscriptionMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    SourceType: S.optional(S.String),
    EventCategories: S.optional(EventCategoriesList),
    SourceIds: S.optional(SourceIdsList),
    Enabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
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
  identifier: "CreateEventSubscriptionMessage",
}) as any as S.Schema<CreateEventSubscriptionMessage>;
export interface CreateGlobalClusterMessage {
  GlobalClusterIdentifier?: string;
  SourceDBClusterIdentifier?: string;
  Engine?: string;
  EngineVersion?: string;
  EngineLifecycleSupport?: string;
  DeletionProtection?: boolean;
  DatabaseName?: string;
  StorageEncrypted?: boolean;
  Tags?: Tag[];
}
export const CreateGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
    SourceDBClusterIdentifier: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    EngineLifecycleSupport: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    DatabaseName: S.optional(S.String),
    StorageEncrypted: S.optional(S.Boolean),
    Tags: S.optional(TagList),
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
  identifier: "CreateGlobalClusterMessage",
}) as any as S.Schema<CreateGlobalClusterMessage>;
export interface CreateOptionGroupMessage {
  OptionGroupName?: string;
  EngineName?: string;
  MajorEngineVersion?: string;
  OptionGroupDescription?: string;
  Tags?: Tag[];
}
export const CreateOptionGroupMessage = S.suspend(() =>
  S.Struct({
    OptionGroupName: S.optional(S.String),
    EngineName: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
    OptionGroupDescription: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CreateOptionGroupMessage",
}) as any as S.Schema<CreateOptionGroupMessage>;
export interface CreateTenantDatabaseMessage {
  DBInstanceIdentifier?: string;
  TenantDBName?: string;
  MasterUsername?: string;
  MasterUserPassword?: string | redacted.Redacted<string>;
  CharacterSetName?: string;
  NcharCharacterSetName?: string;
  ManageMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
  Tags?: Tag[];
}
export const CreateTenantDatabaseMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    TenantDBName: S.optional(S.String),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(SensitiveString),
    CharacterSetName: S.optional(S.String),
    NcharCharacterSetName: S.optional(S.String),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "CreateTenantDatabaseMessage",
}) as any as S.Schema<CreateTenantDatabaseMessage>;
export interface DeleteBlueGreenDeploymentRequest {
  BlueGreenDeploymentIdentifier?: string;
  DeleteTarget?: boolean;
}
export const DeleteBlueGreenDeploymentRequest = S.suspend(() =>
  S.Struct({
    BlueGreenDeploymentIdentifier: S.optional(S.String),
    DeleteTarget: S.optional(S.Boolean),
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
  identifier: "DeleteBlueGreenDeploymentRequest",
}) as any as S.Schema<DeleteBlueGreenDeploymentRequest>;
export interface DeleteCustomDBEngineVersionMessage {
  Engine?: string;
  EngineVersion?: string;
}
export const DeleteCustomDBEngineVersionMessage = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
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
  identifier: "DeleteCustomDBEngineVersionMessage",
}) as any as S.Schema<DeleteCustomDBEngineVersionMessage>;
export interface DeleteDBClusterMessage {
  DBClusterIdentifier?: string;
  SkipFinalSnapshot?: boolean;
  FinalDBSnapshotIdentifier?: string;
  DeleteAutomatedBackups?: boolean;
}
export const DeleteDBClusterMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    SkipFinalSnapshot: S.optional(S.Boolean),
    FinalDBSnapshotIdentifier: S.optional(S.String),
    DeleteAutomatedBackups: S.optional(S.Boolean),
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
  identifier: "DeleteDBClusterMessage",
}) as any as S.Schema<DeleteDBClusterMessage>;
export interface DeleteDBClusterAutomatedBackupMessage {
  DbClusterResourceId?: string;
}
export const DeleteDBClusterAutomatedBackupMessage = S.suspend(() =>
  S.Struct({ DbClusterResourceId: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBClusterAutomatedBackupMessage",
}) as any as S.Schema<DeleteDBClusterAutomatedBackupMessage>;
export interface DeleteDBClusterEndpointMessage {
  DBClusterEndpointIdentifier?: string;
}
export const DeleteDBClusterEndpointMessage = S.suspend(() =>
  S.Struct({ DBClusterEndpointIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBClusterEndpointMessage",
}) as any as S.Schema<DeleteDBClusterEndpointMessage>;
export interface DeleteDBClusterParameterGroupMessage {
  DBClusterParameterGroupName?: string;
}
export const DeleteDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({ DBClusterParameterGroupName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBClusterParameterGroupMessage",
}) as any as S.Schema<DeleteDBClusterParameterGroupMessage>;
export interface DeleteDBClusterParameterGroupResponse {}
export const DeleteDBClusterParameterGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDBClusterParameterGroupResponse",
}) as any as S.Schema<DeleteDBClusterParameterGroupResponse>;
export interface DeleteDBClusterSnapshotMessage {
  DBClusterSnapshotIdentifier?: string;
}
export const DeleteDBClusterSnapshotMessage = S.suspend(() =>
  S.Struct({ DBClusterSnapshotIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBClusterSnapshotMessage",
}) as any as S.Schema<DeleteDBClusterSnapshotMessage>;
export interface DeleteDBInstanceMessage {
  DBInstanceIdentifier?: string;
  SkipFinalSnapshot?: boolean;
  FinalDBSnapshotIdentifier?: string;
  DeleteAutomatedBackups?: boolean;
}
export const DeleteDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    SkipFinalSnapshot: S.optional(S.Boolean),
    FinalDBSnapshotIdentifier: S.optional(S.String),
    DeleteAutomatedBackups: S.optional(S.Boolean),
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
  identifier: "DeleteDBInstanceMessage",
}) as any as S.Schema<DeleteDBInstanceMessage>;
export interface DeleteDBInstanceAutomatedBackupMessage {
  DbiResourceId?: string;
  DBInstanceAutomatedBackupsArn?: string;
}
export const DeleteDBInstanceAutomatedBackupMessage = S.suspend(() =>
  S.Struct({
    DbiResourceId: S.optional(S.String),
    DBInstanceAutomatedBackupsArn: S.optional(S.String),
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
  identifier: "DeleteDBInstanceAutomatedBackupMessage",
}) as any as S.Schema<DeleteDBInstanceAutomatedBackupMessage>;
export interface DeleteDBParameterGroupMessage {
  DBParameterGroupName?: string;
}
export const DeleteDBParameterGroupMessage = S.suspend(() =>
  S.Struct({ DBParameterGroupName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBParameterGroupMessage",
}) as any as S.Schema<DeleteDBParameterGroupMessage>;
export interface DeleteDBParameterGroupResponse {}
export const DeleteDBParameterGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDBParameterGroupResponse",
}) as any as S.Schema<DeleteDBParameterGroupResponse>;
export interface DeleteDBProxyRequest {
  DBProxyName?: string;
}
export const DeleteDBProxyRequest = S.suspend(() =>
  S.Struct({ DBProxyName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBProxyRequest",
}) as any as S.Schema<DeleteDBProxyRequest>;
export interface DeleteDBProxyEndpointRequest {
  DBProxyEndpointName?: string;
}
export const DeleteDBProxyEndpointRequest = S.suspend(() =>
  S.Struct({ DBProxyEndpointName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBProxyEndpointRequest",
}) as any as S.Schema<DeleteDBProxyEndpointRequest>;
export interface DeleteDBSecurityGroupMessage {
  DBSecurityGroupName?: string;
}
export const DeleteDBSecurityGroupMessage = S.suspend(() =>
  S.Struct({ DBSecurityGroupName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBSecurityGroupMessage",
}) as any as S.Schema<DeleteDBSecurityGroupMessage>;
export interface DeleteDBSecurityGroupResponse {}
export const DeleteDBSecurityGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDBSecurityGroupResponse",
}) as any as S.Schema<DeleteDBSecurityGroupResponse>;
export interface DeleteDBShardGroupMessage {
  DBShardGroupIdentifier?: string;
}
export const DeleteDBShardGroupMessage = S.suspend(() =>
  S.Struct({ DBShardGroupIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBShardGroupMessage",
}) as any as S.Schema<DeleteDBShardGroupMessage>;
export interface DeleteDBSnapshotMessage {
  DBSnapshotIdentifier?: string;
}
export const DeleteDBSnapshotMessage = S.suspend(() =>
  S.Struct({ DBSnapshotIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBSnapshotMessage",
}) as any as S.Schema<DeleteDBSnapshotMessage>;
export interface DeleteDBSubnetGroupMessage {
  DBSubnetGroupName?: string;
}
export const DeleteDBSubnetGroupMessage = S.suspend(() =>
  S.Struct({ DBSubnetGroupName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteDBSubnetGroupMessage",
}) as any as S.Schema<DeleteDBSubnetGroupMessage>;
export interface DeleteDBSubnetGroupResponse {}
export const DeleteDBSubnetGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDBSubnetGroupResponse",
}) as any as S.Schema<DeleteDBSubnetGroupResponse>;
export interface DeleteEventSubscriptionMessage {
  SubscriptionName?: string;
}
export const DeleteEventSubscriptionMessage = S.suspend(() =>
  S.Struct({ SubscriptionName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteEventSubscriptionMessage",
}) as any as S.Schema<DeleteEventSubscriptionMessage>;
export interface DeleteGlobalClusterMessage {
  GlobalClusterIdentifier?: string;
}
export const DeleteGlobalClusterMessage = S.suspend(() =>
  S.Struct({ GlobalClusterIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "DeleteGlobalClusterMessage",
}) as any as S.Schema<DeleteGlobalClusterMessage>;
export interface DeleteIntegrationMessage {
  IntegrationIdentifier?: string;
}
export const DeleteIntegrationMessage = S.suspend(() =>
  S.Struct({ IntegrationIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "DeleteIntegrationMessage",
}) as any as S.Schema<DeleteIntegrationMessage>;
export interface DeleteOptionGroupMessage {
  OptionGroupName?: string;
}
export const DeleteOptionGroupMessage = S.suspend(() =>
  S.Struct({ OptionGroupName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteOptionGroupMessage",
}) as any as S.Schema<DeleteOptionGroupMessage>;
export interface DeleteOptionGroupResponse {}
export const DeleteOptionGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOptionGroupResponse",
}) as any as S.Schema<DeleteOptionGroupResponse>;
export interface DeleteTenantDatabaseMessage {
  DBInstanceIdentifier?: string;
  TenantDBName?: string;
  SkipFinalSnapshot?: boolean;
  FinalDBSnapshotIdentifier?: string;
}
export const DeleteTenantDatabaseMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    TenantDBName: S.optional(S.String),
    SkipFinalSnapshot: S.optional(S.Boolean),
    FinalDBSnapshotIdentifier: S.optional(S.String),
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
  identifier: "DeleteTenantDatabaseMessage",
}) as any as S.Schema<DeleteTenantDatabaseMessage>;
export interface DeregisterDBProxyTargetsRequest {
  DBProxyName?: string;
  TargetGroupName?: string;
  DBInstanceIdentifiers?: string[];
  DBClusterIdentifiers?: string[];
}
export const DeregisterDBProxyTargetsRequest = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    TargetGroupName: S.optional(S.String),
    DBInstanceIdentifiers: S.optional(StringList),
    DBClusterIdentifiers: S.optional(StringList),
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
  identifier: "DeregisterDBProxyTargetsRequest",
}) as any as S.Schema<DeregisterDBProxyTargetsRequest>;
export interface DeregisterDBProxyTargetsResponse {}
export const DeregisterDBProxyTargetsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterDBProxyTargetsResponse",
}) as any as S.Schema<DeregisterDBProxyTargetsResponse>;
export type FilterValueList = string[];
export const FilterValueList = S.Array(S.String.pipe(T.XmlName("Value")));
export interface Filter {
  Name?: string;
  Values?: string[];
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Values: S.optional(FilterValueList) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(
  Filter.pipe(T.XmlName("Filter")).annotations({ identifier: "Filter" }),
);
export interface DescribeCertificatesMessage {
  CertificateIdentifier?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeCertificatesMessage = S.suspend(() =>
  S.Struct({
    CertificateIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeCertificatesMessage",
}) as any as S.Schema<DescribeCertificatesMessage>;
export interface DescribeDBClusterAutomatedBackupsMessage {
  DbClusterResourceId?: string;
  DBClusterIdentifier?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBClusterAutomatedBackupsMessage = S.suspend(() =>
  S.Struct({
    DbClusterResourceId: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBClusterAutomatedBackupsMessage",
}) as any as S.Schema<DescribeDBClusterAutomatedBackupsMessage>;
export interface DescribeDBClusterBacktracksMessage {
  DBClusterIdentifier?: string;
  BacktrackIdentifier?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBClusterBacktracksMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    BacktrackIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBClusterBacktracksMessage",
}) as any as S.Schema<DescribeDBClusterBacktracksMessage>;
export interface DescribeDBClusterEndpointsMessage {
  DBClusterIdentifier?: string;
  DBClusterEndpointIdentifier?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBClusterEndpointsMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    DBClusterEndpointIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBClusterEndpointsMessage",
}) as any as S.Schema<DescribeDBClusterEndpointsMessage>;
export interface DescribeDBClusterParameterGroupsMessage {
  DBClusterParameterGroupName?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBClusterParameterGroupsMessage = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBClusterParameterGroupsMessage",
}) as any as S.Schema<DescribeDBClusterParameterGroupsMessage>;
export interface DescribeDBClusterParametersMessage {
  DBClusterParameterGroupName?: string;
  Source?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBClusterParametersMessage = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.optional(S.String),
    Source: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBClusterParametersMessage",
}) as any as S.Schema<DescribeDBClusterParametersMessage>;
export interface DescribeDBClustersMessage {
  DBClusterIdentifier?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
  IncludeShared?: boolean;
}
export const DescribeDBClustersMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    IncludeShared: S.optional(S.Boolean),
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
  identifier: "DescribeDBClustersMessage",
}) as any as S.Schema<DescribeDBClustersMessage>;
export interface DescribeDBClusterSnapshotAttributesMessage {
  DBClusterSnapshotIdentifier?: string;
}
export const DescribeDBClusterSnapshotAttributesMessage = S.suspend(() =>
  S.Struct({ DBClusterSnapshotIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "DescribeDBClusterSnapshotAttributesMessage",
}) as any as S.Schema<DescribeDBClusterSnapshotAttributesMessage>;
export interface DescribeDBClusterSnapshotsMessage {
  DBClusterIdentifier?: string;
  DBClusterSnapshotIdentifier?: string;
  SnapshotType?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
  IncludeShared?: boolean;
  IncludePublic?: boolean;
  DbClusterResourceId?: string;
}
export const DescribeDBClusterSnapshotsMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    DBClusterSnapshotIdentifier: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    IncludeShared: S.optional(S.Boolean),
    IncludePublic: S.optional(S.Boolean),
    DbClusterResourceId: S.optional(S.String),
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
  identifier: "DescribeDBClusterSnapshotsMessage",
}) as any as S.Schema<DescribeDBClusterSnapshotsMessage>;
export interface DescribeDBEngineVersionsMessage {
  Engine?: string;
  EngineVersion?: string;
  DBParameterGroupFamily?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
  DefaultOnly?: boolean;
  ListSupportedCharacterSets?: boolean;
  ListSupportedTimezones?: boolean;
  IncludeAll?: boolean;
}
export const DescribeDBEngineVersionsMessage = S.suspend(() =>
  S.Struct({
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
  identifier: "DescribeDBEngineVersionsMessage",
}) as any as S.Schema<DescribeDBEngineVersionsMessage>;
export interface DescribeDBInstanceAutomatedBackupsMessage {
  DbiResourceId?: string;
  DBInstanceIdentifier?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
  DBInstanceAutomatedBackupsArn?: string;
}
export const DescribeDBInstanceAutomatedBackupsMessage = S.suspend(() =>
  S.Struct({
    DbiResourceId: S.optional(S.String),
    DBInstanceIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    DBInstanceAutomatedBackupsArn: S.optional(S.String),
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
  identifier: "DescribeDBInstanceAutomatedBackupsMessage",
}) as any as S.Schema<DescribeDBInstanceAutomatedBackupsMessage>;
export interface DescribeDBInstancesMessage {
  DBInstanceIdentifier?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBInstancesMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBInstancesMessage",
}) as any as S.Schema<DescribeDBInstancesMessage>;
export interface DescribeDBLogFilesMessage {
  DBInstanceIdentifier?: string;
  FilenameContains?: string;
  FileLastWritten?: number;
  FileSize?: number;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBLogFilesMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    FilenameContains: S.optional(S.String),
    FileLastWritten: S.optional(S.Number),
    FileSize: S.optional(S.Number),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBLogFilesMessage",
}) as any as S.Schema<DescribeDBLogFilesMessage>;
export interface DescribeDBMajorEngineVersionsRequest {
  Engine?: string;
  MajorEngineVersion?: string;
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeDBMajorEngineVersionsRequest = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
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
  identifier: "DescribeDBMajorEngineVersionsRequest",
}) as any as S.Schema<DescribeDBMajorEngineVersionsRequest>;
export interface DescribeDBParameterGroupsMessage {
  DBParameterGroupName?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBParameterGroupsMessage = S.suspend(() =>
  S.Struct({
    DBParameterGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBParameterGroupsMessage",
}) as any as S.Schema<DescribeDBParameterGroupsMessage>;
export interface DescribeDBParametersMessage {
  DBParameterGroupName?: string;
  Source?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBParametersMessage = S.suspend(() =>
  S.Struct({
    DBParameterGroupName: S.optional(S.String),
    Source: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBParametersMessage",
}) as any as S.Schema<DescribeDBParametersMessage>;
export interface DescribeDBProxiesRequest {
  DBProxyName?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeDBProxiesRequest = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
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
  identifier: "DescribeDBProxiesRequest",
}) as any as S.Schema<DescribeDBProxiesRequest>;
export interface DescribeDBProxyEndpointsRequest {
  DBProxyName?: string;
  DBProxyEndpointName?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeDBProxyEndpointsRequest = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    DBProxyEndpointName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
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
  identifier: "DescribeDBProxyEndpointsRequest",
}) as any as S.Schema<DescribeDBProxyEndpointsRequest>;
export interface DescribeDBProxyTargetGroupsRequest {
  DBProxyName?: string;
  TargetGroupName?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeDBProxyTargetGroupsRequest = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    TargetGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
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
  identifier: "DescribeDBProxyTargetGroupsRequest",
}) as any as S.Schema<DescribeDBProxyTargetGroupsRequest>;
export interface DescribeDBProxyTargetsRequest {
  DBProxyName?: string;
  TargetGroupName?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeDBProxyTargetsRequest = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    TargetGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
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
  identifier: "DescribeDBProxyTargetsRequest",
}) as any as S.Schema<DescribeDBProxyTargetsRequest>;
export interface DescribeDBRecommendationsMessage {
  LastUpdatedAfter?: Date;
  LastUpdatedBefore?: Date;
  Locale?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBRecommendationsMessage = S.suspend(() =>
  S.Struct({
    LastUpdatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Locale: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBRecommendationsMessage",
}) as any as S.Schema<DescribeDBRecommendationsMessage>;
export interface DescribeDBSecurityGroupsMessage {
  DBSecurityGroupName?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBSecurityGroupsMessage = S.suspend(() =>
  S.Struct({
    DBSecurityGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBSecurityGroupsMessage",
}) as any as S.Schema<DescribeDBSecurityGroupsMessage>;
export interface DescribeDBShardGroupsMessage {
  DBShardGroupIdentifier?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeDBShardGroupsMessage = S.suspend(() =>
  S.Struct({
    DBShardGroupIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
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
  identifier: "DescribeDBShardGroupsMessage",
}) as any as S.Schema<DescribeDBShardGroupsMessage>;
export interface DescribeDBSnapshotAttributesMessage {
  DBSnapshotIdentifier?: string;
}
export const DescribeDBSnapshotAttributesMessage = S.suspend(() =>
  S.Struct({ DBSnapshotIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "DescribeDBSnapshotAttributesMessage",
}) as any as S.Schema<DescribeDBSnapshotAttributesMessage>;
export interface DescribeDBSnapshotsMessage {
  DBInstanceIdentifier?: string;
  DBSnapshotIdentifier?: string;
  SnapshotType?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
  IncludeShared?: boolean;
  IncludePublic?: boolean;
  DbiResourceId?: string;
}
export const DescribeDBSnapshotsMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    DBSnapshotIdentifier: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    IncludeShared: S.optional(S.Boolean),
    IncludePublic: S.optional(S.Boolean),
    DbiResourceId: S.optional(S.String),
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
  identifier: "DescribeDBSnapshotsMessage",
}) as any as S.Schema<DescribeDBSnapshotsMessage>;
export interface DescribeDBSnapshotTenantDatabasesMessage {
  DBInstanceIdentifier?: string;
  DBSnapshotIdentifier?: string;
  SnapshotType?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
  DbiResourceId?: string;
}
export const DescribeDBSnapshotTenantDatabasesMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    DBSnapshotIdentifier: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    DbiResourceId: S.optional(S.String),
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
  identifier: "DescribeDBSnapshotTenantDatabasesMessage",
}) as any as S.Schema<DescribeDBSnapshotTenantDatabasesMessage>;
export interface DescribeDBSubnetGroupsMessage {
  DBSubnetGroupName?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBSubnetGroupsMessage = S.suspend(() =>
  S.Struct({
    DBSubnetGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeDBSubnetGroupsMessage",
}) as any as S.Schema<DescribeDBSubnetGroupsMessage>;
export interface DescribeEngineDefaultClusterParametersMessage {
  DBParameterGroupFamily?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEngineDefaultClusterParametersMessage = S.suspend(() =>
  S.Struct({
    DBParameterGroupFamily: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeEngineDefaultClusterParametersMessage",
}) as any as S.Schema<DescribeEngineDefaultClusterParametersMessage>;
export interface DescribeEngineDefaultParametersMessage {
  DBParameterGroupFamily?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEngineDefaultParametersMessage = S.suspend(() =>
  S.Struct({
    DBParameterGroupFamily: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeEngineDefaultParametersMessage",
}) as any as S.Schema<DescribeEngineDefaultParametersMessage>;
export interface DescribeEventCategoriesMessage {
  SourceType?: string;
  Filters?: Filter[];
}
export const DescribeEventCategoriesMessage = S.suspend(() =>
  S.Struct({
    SourceType: S.optional(S.String),
    Filters: S.optional(FilterList),
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
  identifier: "DescribeEventCategoriesMessage",
}) as any as S.Schema<DescribeEventCategoriesMessage>;
export interface DescribeEventsMessage {
  SourceIdentifier?: string;
  SourceType?: SourceType;
  StartTime?: Date;
  EndTime?: Date;
  Duration?: number;
  EventCategories?: string[];
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEventsMessage = S.suspend(() =>
  S.Struct({
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(SourceType),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Duration: S.optional(S.Number),
    EventCategories: S.optional(EventCategoriesList),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeEventsMessage",
}) as any as S.Schema<DescribeEventsMessage>;
export interface DescribeEventSubscriptionsMessage {
  SubscriptionName?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEventSubscriptionsMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeEventSubscriptionsMessage",
}) as any as S.Schema<DescribeEventSubscriptionsMessage>;
export interface DescribeExportTasksMessage {
  ExportTaskIdentifier?: string;
  SourceArn?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
  SourceType?: ExportSourceType;
}
export const DescribeExportTasksMessage = S.suspend(() =>
  S.Struct({
    ExportTaskIdentifier: S.optional(S.String),
    SourceArn: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    SourceType: S.optional(ExportSourceType),
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
  identifier: "DescribeExportTasksMessage",
}) as any as S.Schema<DescribeExportTasksMessage>;
export interface DescribeGlobalClustersMessage {
  GlobalClusterIdentifier?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeGlobalClustersMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeGlobalClustersMessage",
}) as any as S.Schema<DescribeGlobalClustersMessage>;
export interface DescribeIntegrationsMessage {
  IntegrationIdentifier?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeIntegrationsMessage = S.suspend(() =>
  S.Struct({
    IntegrationIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeIntegrationsMessage",
}) as any as S.Schema<DescribeIntegrationsMessage>;
export interface DescribeOptionGroupOptionsMessage {
  EngineName?: string;
  MajorEngineVersion?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeOptionGroupOptionsMessage = S.suspend(() =>
  S.Struct({
    EngineName: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeOptionGroupOptionsMessage",
}) as any as S.Schema<DescribeOptionGroupOptionsMessage>;
export interface DescribeOptionGroupsMessage {
  OptionGroupName?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
  EngineName?: string;
  MajorEngineVersion?: string;
}
export const DescribeOptionGroupsMessage = S.suspend(() =>
  S.Struct({
    OptionGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    EngineName: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
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
  identifier: "DescribeOptionGroupsMessage",
}) as any as S.Schema<DescribeOptionGroupsMessage>;
export interface DescribeOrderableDBInstanceOptionsMessage {
  Engine?: string;
  EngineVersion?: string;
  DBInstanceClass?: string;
  LicenseModel?: string;
  AvailabilityZoneGroup?: string;
  Vpc?: boolean;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeOrderableDBInstanceOptionsMessage = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    AvailabilityZoneGroup: S.optional(S.String),
    Vpc: S.optional(S.Boolean),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeOrderableDBInstanceOptionsMessage",
}) as any as S.Schema<DescribeOrderableDBInstanceOptionsMessage>;
export interface DescribePendingMaintenanceActionsMessage {
  ResourceIdentifier?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribePendingMaintenanceActionsMessage = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
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
  identifier: "DescribePendingMaintenanceActionsMessage",
}) as any as S.Schema<DescribePendingMaintenanceActionsMessage>;
export interface DescribeReservedDBInstancesMessage {
  ReservedDBInstanceId?: string;
  ReservedDBInstancesOfferingId?: string;
  DBInstanceClass?: string;
  Duration?: string;
  ProductDescription?: string;
  OfferingType?: string;
  MultiAZ?: boolean;
  LeaseId?: string;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeReservedDBInstancesMessage = S.suspend(() =>
  S.Struct({
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
  identifier: "DescribeReservedDBInstancesMessage",
}) as any as S.Schema<DescribeReservedDBInstancesMessage>;
export interface DescribeReservedDBInstancesOfferingsMessage {
  ReservedDBInstancesOfferingId?: string;
  DBInstanceClass?: string;
  Duration?: string;
  ProductDescription?: string;
  OfferingType?: string;
  MultiAZ?: boolean;
  Filters?: Filter[];
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeReservedDBInstancesOfferingsMessage = S.suspend(() =>
  S.Struct({
    ReservedDBInstancesOfferingId: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    Duration: S.optional(S.String),
    ProductDescription: S.optional(S.String),
    OfferingType: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "DescribeReservedDBInstancesOfferingsMessage",
}) as any as S.Schema<DescribeReservedDBInstancesOfferingsMessage>;
export interface DescribeSourceRegionsMessage {
  RegionName?: string;
  MaxRecords?: number;
  Marker?: string;
  Filters?: Filter[];
}
export const DescribeSourceRegionsMessage = S.suspend(() =>
  S.Struct({
    RegionName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    Filters: S.optional(FilterList),
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
  identifier: "DescribeSourceRegionsMessage",
}) as any as S.Schema<DescribeSourceRegionsMessage>;
export interface DescribeTenantDatabasesMessage {
  DBInstanceIdentifier?: string;
  TenantDBName?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeTenantDatabasesMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    TenantDBName: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
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
  identifier: "DescribeTenantDatabasesMessage",
}) as any as S.Schema<DescribeTenantDatabasesMessage>;
export interface DescribeValidDBInstanceModificationsMessage {
  DBInstanceIdentifier?: string;
}
export const DescribeValidDBInstanceModificationsMessage = S.suspend(() =>
  S.Struct({ DBInstanceIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "DescribeValidDBInstanceModificationsMessage",
}) as any as S.Schema<DescribeValidDBInstanceModificationsMessage>;
export interface DisableHttpEndpointRequest {
  ResourceArn?: string;
}
export const DisableHttpEndpointRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String) }).pipe(
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
  identifier: "DisableHttpEndpointRequest",
}) as any as S.Schema<DisableHttpEndpointRequest>;
export interface DownloadDBLogFilePortionMessage {
  DBInstanceIdentifier?: string;
  LogFileName?: string;
  Marker?: string;
  NumberOfLines?: number;
}
export const DownloadDBLogFilePortionMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    LogFileName: S.optional(S.String),
    Marker: S.optional(S.String),
    NumberOfLines: S.optional(S.Number),
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
  identifier: "DownloadDBLogFilePortionMessage",
}) as any as S.Schema<DownloadDBLogFilePortionMessage>;
export interface EnableHttpEndpointRequest {
  ResourceArn?: string;
}
export const EnableHttpEndpointRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String) }).pipe(
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
  identifier: "EnableHttpEndpointRequest",
}) as any as S.Schema<EnableHttpEndpointRequest>;
export interface FailoverDBClusterMessage {
  DBClusterIdentifier?: string;
  TargetDBInstanceIdentifier?: string;
}
export const FailoverDBClusterMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    TargetDBInstanceIdentifier: S.optional(S.String),
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
  identifier: "FailoverDBClusterMessage",
}) as any as S.Schema<FailoverDBClusterMessage>;
export interface FailoverGlobalClusterMessage {
  GlobalClusterIdentifier?: string;
  TargetDbClusterIdentifier?: string;
  AllowDataLoss?: boolean;
  Switchover?: boolean;
}
export const FailoverGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
    TargetDbClusterIdentifier: S.optional(S.String),
    AllowDataLoss: S.optional(S.Boolean),
    Switchover: S.optional(S.Boolean),
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
  identifier: "FailoverGlobalClusterMessage",
}) as any as S.Schema<FailoverGlobalClusterMessage>;
export interface ListTagsForResourceMessage {
  ResourceName?: string;
  Filters?: Filter[];
}
export const ListTagsForResourceMessage = S.suspend(() =>
  S.Struct({
    ResourceName: S.optional(S.String),
    Filters: S.optional(FilterList),
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
  identifier: "ListTagsForResourceMessage",
}) as any as S.Schema<ListTagsForResourceMessage>;
export interface ModifyActivityStreamRequest {
  ResourceArn?: string;
  AuditPolicyState?: AuditPolicyState;
}
export const ModifyActivityStreamRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    AuditPolicyState: S.optional(AuditPolicyState),
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
  identifier: "ModifyActivityStreamRequest",
}) as any as S.Schema<ModifyActivityStreamRequest>;
export interface ModifyCertificatesMessage {
  CertificateIdentifier?: string;
  RemoveCustomerOverride?: boolean;
}
export const ModifyCertificatesMessage = S.suspend(() =>
  S.Struct({
    CertificateIdentifier: S.optional(S.String),
    RemoveCustomerOverride: S.optional(S.Boolean),
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
  identifier: "ModifyCertificatesMessage",
}) as any as S.Schema<ModifyCertificatesMessage>;
export interface ModifyCurrentDBClusterCapacityMessage {
  DBClusterIdentifier?: string;
  Capacity?: number;
  SecondsBeforeTimeout?: number;
  TimeoutAction?: string;
}
export const ModifyCurrentDBClusterCapacityMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    Capacity: S.optional(S.Number),
    SecondsBeforeTimeout: S.optional(S.Number),
    TimeoutAction: S.optional(S.String),
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
  identifier: "ModifyCurrentDBClusterCapacityMessage",
}) as any as S.Schema<ModifyCurrentDBClusterCapacityMessage>;
export interface ModifyCustomDBEngineVersionMessage {
  Engine?: string;
  EngineVersion?: string;
  Description?: string;
  Status?: CustomEngineVersionStatus;
}
export const ModifyCustomDBEngineVersionMessage = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(CustomEngineVersionStatus),
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
  identifier: "ModifyCustomDBEngineVersionMessage",
}) as any as S.Schema<ModifyCustomDBEngineVersionMessage>;
export interface ModifyDBClusterEndpointMessage {
  DBClusterEndpointIdentifier?: string;
  EndpointType?: string;
  StaticMembers?: string[];
  ExcludedMembers?: string[];
}
export const ModifyDBClusterEndpointMessage = S.suspend(() =>
  S.Struct({
    DBClusterEndpointIdentifier: S.optional(S.String),
    EndpointType: S.optional(S.String),
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
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
  identifier: "ModifyDBClusterEndpointMessage",
}) as any as S.Schema<ModifyDBClusterEndpointMessage>;
export interface ModifyDBClusterSnapshotAttributeMessage {
  DBClusterSnapshotIdentifier?: string;
  AttributeName?: string;
  ValuesToAdd?: string[];
  ValuesToRemove?: string[];
}
export const ModifyDBClusterSnapshotAttributeMessage = S.suspend(() =>
  S.Struct({
    DBClusterSnapshotIdentifier: S.optional(S.String),
    AttributeName: S.optional(S.String),
    ValuesToAdd: S.optional(AttributeValueList),
    ValuesToRemove: S.optional(AttributeValueList),
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
  identifier: "ModifyDBClusterSnapshotAttributeMessage",
}) as any as S.Schema<ModifyDBClusterSnapshotAttributeMessage>;
export type ApplyMethod = "immediate" | "pending-reboot" | (string & {});
export const ApplyMethod = S.String;
export type EngineModeList = string[];
export const EngineModeList = S.Array(S.String);
export interface Parameter {
  ParameterName?: string;
  ParameterValue?: string;
  Description?: string;
  Source?: string;
  ApplyType?: string;
  DataType?: string;
  AllowedValues?: string;
  IsModifiable?: boolean;
  MinimumEngineVersion?: string;
  ApplyMethod?: ApplyMethod;
  SupportedEngineModes?: string[];
}
export const Parameter = S.suspend(() =>
  S.Struct({
    ParameterName: S.optional(S.String),
    ParameterValue: S.optional(S.String),
    Description: S.optional(S.String),
    Source: S.optional(S.String),
    ApplyType: S.optional(S.String),
    DataType: S.optional(S.String),
    AllowedValues: S.optional(S.String),
    IsModifiable: S.optional(S.Boolean),
    MinimumEngineVersion: S.optional(S.String),
    ApplyMethod: S.optional(ApplyMethod),
    SupportedEngineModes: S.optional(EngineModeList),
  }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type ParametersList = Parameter[];
export const ParametersList = S.Array(
  Parameter.pipe(T.XmlName("Parameter")).annotations({
    identifier: "Parameter",
  }),
);
export interface ModifyDBParameterGroupMessage {
  DBParameterGroupName?: string;
  Parameters?: Parameter[];
}
export const ModifyDBParameterGroupMessage = S.suspend(() =>
  S.Struct({
    DBParameterGroupName: S.optional(S.String),
    Parameters: S.optional(ParametersList),
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
  identifier: "ModifyDBParameterGroupMessage",
}) as any as S.Schema<ModifyDBParameterGroupMessage>;
export type AuthScheme = "SECRETS" | (string & {});
export const AuthScheme = S.String;
export type IAMAuthMode = "DISABLED" | "REQUIRED" | "ENABLED" | (string & {});
export const IAMAuthMode = S.String;
export type ClientPasswordAuthType =
  | "MYSQL_NATIVE_PASSWORD"
  | "MYSQL_CACHING_SHA2_PASSWORD"
  | "POSTGRES_SCRAM_SHA_256"
  | "POSTGRES_MD5"
  | "SQL_SERVER_AUTHENTICATION"
  | (string & {});
export const ClientPasswordAuthType = S.String;
export interface UserAuthConfig {
  Description?: string;
  UserName?: string;
  AuthScheme?: AuthScheme;
  SecretArn?: string;
  IAMAuth?: IAMAuthMode;
  ClientPasswordAuthType?: ClientPasswordAuthType;
}
export const UserAuthConfig = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    UserName: S.optional(S.String),
    AuthScheme: S.optional(AuthScheme),
    SecretArn: S.optional(S.String),
    IAMAuth: S.optional(IAMAuthMode),
    ClientPasswordAuthType: S.optional(ClientPasswordAuthType),
  }),
).annotations({
  identifier: "UserAuthConfig",
}) as any as S.Schema<UserAuthConfig>;
export type UserAuthConfigList = UserAuthConfig[];
export const UserAuthConfigList = S.Array(UserAuthConfig);
export interface ModifyDBProxyRequest {
  DBProxyName?: string;
  NewDBProxyName?: string;
  DefaultAuthScheme?: DefaultAuthScheme;
  Auth?: UserAuthConfig[];
  RequireTLS?: boolean;
  IdleClientTimeout?: number;
  DebugLogging?: boolean;
  RoleArn?: string;
  SecurityGroups?: string[];
}
export const ModifyDBProxyRequest = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    NewDBProxyName: S.optional(S.String),
    DefaultAuthScheme: S.optional(DefaultAuthScheme),
    Auth: S.optional(UserAuthConfigList),
    RequireTLS: S.optional(S.Boolean),
    IdleClientTimeout: S.optional(S.Number),
    DebugLogging: S.optional(S.Boolean),
    RoleArn: S.optional(S.String),
    SecurityGroups: S.optional(StringList),
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
  identifier: "ModifyDBProxyRequest",
}) as any as S.Schema<ModifyDBProxyRequest>;
export interface ModifyDBProxyEndpointRequest {
  DBProxyEndpointName?: string;
  NewDBProxyEndpointName?: string;
  VpcSecurityGroupIds?: string[];
}
export const ModifyDBProxyEndpointRequest = S.suspend(() =>
  S.Struct({
    DBProxyEndpointName: S.optional(S.String),
    NewDBProxyEndpointName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(StringList),
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
  identifier: "ModifyDBProxyEndpointRequest",
}) as any as S.Schema<ModifyDBProxyEndpointRequest>;
export interface ModifyDBShardGroupMessage {
  DBShardGroupIdentifier?: string;
  MaxACU?: number;
  MinACU?: number;
  ComputeRedundancy?: number;
}
export const ModifyDBShardGroupMessage = S.suspend(() =>
  S.Struct({
    DBShardGroupIdentifier: S.optional(S.String),
    MaxACU: S.optional(S.Number),
    MinACU: S.optional(S.Number),
    ComputeRedundancy: S.optional(S.Number),
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
  identifier: "ModifyDBShardGroupMessage",
}) as any as S.Schema<ModifyDBShardGroupMessage>;
export interface ModifyDBSnapshotMessage {
  DBSnapshotIdentifier?: string;
  EngineVersion?: string;
  OptionGroupName?: string;
}
export const ModifyDBSnapshotMessage = S.suspend(() =>
  S.Struct({
    DBSnapshotIdentifier: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
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
  identifier: "ModifyDBSnapshotMessage",
}) as any as S.Schema<ModifyDBSnapshotMessage>;
export interface ModifyDBSnapshotAttributeMessage {
  DBSnapshotIdentifier?: string;
  AttributeName?: string;
  ValuesToAdd?: string[];
  ValuesToRemove?: string[];
}
export const ModifyDBSnapshotAttributeMessage = S.suspend(() =>
  S.Struct({
    DBSnapshotIdentifier: S.optional(S.String),
    AttributeName: S.optional(S.String),
    ValuesToAdd: S.optional(AttributeValueList),
    ValuesToRemove: S.optional(AttributeValueList),
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
  identifier: "ModifyDBSnapshotAttributeMessage",
}) as any as S.Schema<ModifyDBSnapshotAttributeMessage>;
export interface ModifyDBSubnetGroupMessage {
  DBSubnetGroupName?: string;
  DBSubnetGroupDescription?: string;
  SubnetIds?: string[];
}
export const ModifyDBSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    DBSubnetGroupName: S.optional(S.String),
    DBSubnetGroupDescription: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdentifierList),
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
  identifier: "ModifyDBSubnetGroupMessage",
}) as any as S.Schema<ModifyDBSubnetGroupMessage>;
export interface ModifyEventSubscriptionMessage {
  SubscriptionName?: string;
  SnsTopicArn?: string;
  SourceType?: string;
  EventCategories?: string[];
  Enabled?: boolean;
}
export const ModifyEventSubscriptionMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    SourceType: S.optional(S.String),
    EventCategories: S.optional(EventCategoriesList),
    Enabled: S.optional(S.Boolean),
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
  identifier: "ModifyEventSubscriptionMessage",
}) as any as S.Schema<ModifyEventSubscriptionMessage>;
export interface ModifyGlobalClusterMessage {
  GlobalClusterIdentifier?: string;
  NewGlobalClusterIdentifier?: string;
  DeletionProtection?: boolean;
  EngineVersion?: string;
  AllowMajorVersionUpgrade?: boolean;
}
export const ModifyGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
    NewGlobalClusterIdentifier: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
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
  identifier: "ModifyGlobalClusterMessage",
}) as any as S.Schema<ModifyGlobalClusterMessage>;
export interface ModifyIntegrationMessage {
  IntegrationIdentifier?: string;
  IntegrationName?: string;
  DataFilter?: string;
  Description?: string;
}
export const ModifyIntegrationMessage = S.suspend(() =>
  S.Struct({
    IntegrationIdentifier: S.optional(S.String),
    IntegrationName: S.optional(S.String),
    DataFilter: S.optional(S.String),
    Description: S.optional(S.String),
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
  identifier: "ModifyIntegrationMessage",
}) as any as S.Schema<ModifyIntegrationMessage>;
export interface ModifyTenantDatabaseMessage {
  DBInstanceIdentifier?: string;
  TenantDBName?: string;
  MasterUserPassword?: string | redacted.Redacted<string>;
  NewTenantDBName?: string;
  ManageMasterUserPassword?: boolean;
  RotateMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
}
export const ModifyTenantDatabaseMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    TenantDBName: S.optional(S.String),
    MasterUserPassword: S.optional(SensitiveString),
    NewTenantDBName: S.optional(S.String),
    ManageMasterUserPassword: S.optional(S.Boolean),
    RotateMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
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
  identifier: "ModifyTenantDatabaseMessage",
}) as any as S.Schema<ModifyTenantDatabaseMessage>;
export interface PromoteReadReplicaMessage {
  DBInstanceIdentifier?: string;
  BackupRetentionPeriod?: number;
  PreferredBackupWindow?: string;
  TagSpecifications?: TagSpecification[];
}
export const PromoteReadReplicaMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    PreferredBackupWindow: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
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
  identifier: "PromoteReadReplicaMessage",
}) as any as S.Schema<PromoteReadReplicaMessage>;
export interface PromoteReadReplicaDBClusterMessage {
  DBClusterIdentifier?: string;
}
export const PromoteReadReplicaDBClusterMessage = S.suspend(() =>
  S.Struct({ DBClusterIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "PromoteReadReplicaDBClusterMessage",
}) as any as S.Schema<PromoteReadReplicaDBClusterMessage>;
export interface PurchaseReservedDBInstancesOfferingMessage {
  ReservedDBInstancesOfferingId?: string;
  ReservedDBInstanceId?: string;
  DBInstanceCount?: number;
  Tags?: Tag[];
}
export const PurchaseReservedDBInstancesOfferingMessage = S.suspend(() =>
  S.Struct({
    ReservedDBInstancesOfferingId: S.optional(S.String),
    ReservedDBInstanceId: S.optional(S.String),
    DBInstanceCount: S.optional(S.Number),
    Tags: S.optional(TagList),
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
  identifier: "PurchaseReservedDBInstancesOfferingMessage",
}) as any as S.Schema<PurchaseReservedDBInstancesOfferingMessage>;
export interface RebootDBClusterMessage {
  DBClusterIdentifier?: string;
}
export const RebootDBClusterMessage = S.suspend(() =>
  S.Struct({ DBClusterIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "RebootDBClusterMessage",
}) as any as S.Schema<RebootDBClusterMessage>;
export interface RebootDBInstanceMessage {
  DBInstanceIdentifier?: string;
  ForceFailover?: boolean;
}
export const RebootDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    ForceFailover: S.optional(S.Boolean),
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
  identifier: "RebootDBInstanceMessage",
}) as any as S.Schema<RebootDBInstanceMessage>;
export interface RebootDBShardGroupMessage {
  DBShardGroupIdentifier?: string;
}
export const RebootDBShardGroupMessage = S.suspend(() =>
  S.Struct({ DBShardGroupIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "RebootDBShardGroupMessage",
}) as any as S.Schema<RebootDBShardGroupMessage>;
export interface RegisterDBProxyTargetsRequest {
  DBProxyName?: string;
  TargetGroupName?: string;
  DBInstanceIdentifiers?: string[];
  DBClusterIdentifiers?: string[];
}
export const RegisterDBProxyTargetsRequest = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    TargetGroupName: S.optional(S.String),
    DBInstanceIdentifiers: S.optional(StringList),
    DBClusterIdentifiers: S.optional(StringList),
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
  identifier: "RegisterDBProxyTargetsRequest",
}) as any as S.Schema<RegisterDBProxyTargetsRequest>;
export interface RemoveFromGlobalClusterMessage {
  GlobalClusterIdentifier?: string;
  DbClusterIdentifier?: string;
}
export const RemoveFromGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
    DbClusterIdentifier: S.optional(S.String),
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
  identifier: "RemoveFromGlobalClusterMessage",
}) as any as S.Schema<RemoveFromGlobalClusterMessage>;
export interface RemoveRoleFromDBClusterMessage {
  DBClusterIdentifier?: string;
  RoleArn?: string;
  FeatureName?: string;
}
export const RemoveRoleFromDBClusterMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    RoleArn: S.optional(S.String),
    FeatureName: S.optional(S.String),
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
  identifier: "RemoveRoleFromDBClusterMessage",
}) as any as S.Schema<RemoveRoleFromDBClusterMessage>;
export interface RemoveRoleFromDBClusterResponse {}
export const RemoveRoleFromDBClusterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveRoleFromDBClusterResponse",
}) as any as S.Schema<RemoveRoleFromDBClusterResponse>;
export interface RemoveRoleFromDBInstanceMessage {
  DBInstanceIdentifier?: string;
  RoleArn?: string;
  FeatureName?: string;
}
export const RemoveRoleFromDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    RoleArn: S.optional(S.String),
    FeatureName: S.optional(S.String),
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
  identifier: "RemoveRoleFromDBInstanceMessage",
}) as any as S.Schema<RemoveRoleFromDBInstanceMessage>;
export interface RemoveRoleFromDBInstanceResponse {}
export const RemoveRoleFromDBInstanceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveRoleFromDBInstanceResponse",
}) as any as S.Schema<RemoveRoleFromDBInstanceResponse>;
export interface RemoveSourceIdentifierFromSubscriptionMessage {
  SubscriptionName?: string;
  SourceIdentifier?: string;
}
export const RemoveSourceIdentifierFromSubscriptionMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.optional(S.String),
    SourceIdentifier: S.optional(S.String),
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
  identifier: "RemoveSourceIdentifierFromSubscriptionMessage",
}) as any as S.Schema<RemoveSourceIdentifierFromSubscriptionMessage>;
export interface RemoveTagsFromResourceMessage {
  ResourceName?: string;
  TagKeys?: string[];
}
export const RemoveTagsFromResourceMessage = S.suspend(() =>
  S.Struct({
    ResourceName: S.optional(S.String),
    TagKeys: S.optional(KeyList),
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
  identifier: "RemoveTagsFromResourceMessage",
}) as any as S.Schema<RemoveTagsFromResourceMessage>;
export interface RemoveTagsFromResourceResponse {}
export const RemoveTagsFromResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsFromResourceResponse",
}) as any as S.Schema<RemoveTagsFromResourceResponse>;
export interface ResetDBClusterParameterGroupMessage {
  DBClusterParameterGroupName?: string;
  ResetAllParameters?: boolean;
  Parameters?: Parameter[];
}
export const ResetDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.optional(S.String),
    ResetAllParameters: S.optional(S.Boolean),
    Parameters: S.optional(ParametersList),
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
  identifier: "ResetDBClusterParameterGroupMessage",
}) as any as S.Schema<ResetDBClusterParameterGroupMessage>;
export interface ResetDBParameterGroupMessage {
  DBParameterGroupName?: string;
  ResetAllParameters?: boolean;
  Parameters?: Parameter[];
}
export const ResetDBParameterGroupMessage = S.suspend(() =>
  S.Struct({
    DBParameterGroupName: S.optional(S.String),
    ResetAllParameters: S.optional(S.Boolean),
    Parameters: S.optional(ParametersList),
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
  identifier: "ResetDBParameterGroupMessage",
}) as any as S.Schema<ResetDBParameterGroupMessage>;
export interface ServerlessV2ScalingConfiguration {
  MinCapacity?: number;
  MaxCapacity?: number;
  SecondsUntilAutoPause?: number;
}
export const ServerlessV2ScalingConfiguration = S.suspend(() =>
  S.Struct({
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    SecondsUntilAutoPause: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServerlessV2ScalingConfiguration",
}) as any as S.Schema<ServerlessV2ScalingConfiguration>;
export interface RestoreDBClusterFromS3Message {
  AvailabilityZones?: string[];
  BackupRetentionPeriod?: number;
  CharacterSetName?: string;
  DatabaseName?: string;
  DBClusterIdentifier?: string;
  DBClusterParameterGroupName?: string;
  VpcSecurityGroupIds?: string[];
  DBSubnetGroupName?: string;
  Engine?: string;
  EngineVersion?: string;
  Port?: number;
  MasterUsername?: string;
  MasterUserPassword?: string | redacted.Redacted<string>;
  OptionGroupName?: string;
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  Tags?: Tag[];
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  SourceEngine?: string;
  SourceEngineVersion?: string;
  S3BucketName?: string;
  S3Prefix?: string;
  S3IngestionRoleArn?: string;
  BacktrackWindow?: number;
  EnableCloudwatchLogsExports?: string[];
  DeletionProtection?: boolean;
  CopyTagsToSnapshot?: boolean;
  Domain?: string;
  DomainIAMRoleName?: string;
  StorageType?: string;
  NetworkType?: string;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  ManageMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
  EngineLifecycleSupport?: string;
  TagSpecifications?: TagSpecification[];
}
export const RestoreDBClusterFromS3Message = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    BackupRetentionPeriod: S.optional(S.Number),
    CharacterSetName: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    DBSubnetGroupName: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(SensitiveString),
    OptionGroupName: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    Tags: S.optional(TagList),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    SourceEngine: S.optional(S.String),
    SourceEngineVersion: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3Prefix: S.optional(S.String),
    S3IngestionRoleArn: S.optional(S.String),
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
  identifier: "RestoreDBClusterFromS3Message",
}) as any as S.Schema<RestoreDBClusterFromS3Message>;
export interface ScalingConfiguration {
  MinCapacity?: number;
  MaxCapacity?: number;
  AutoPause?: boolean;
  SecondsUntilAutoPause?: number;
  TimeoutAction?: string;
  SecondsBeforeTimeout?: number;
}
export const ScalingConfiguration = S.suspend(() =>
  S.Struct({
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    AutoPause: S.optional(S.Boolean),
    SecondsUntilAutoPause: S.optional(S.Number),
    TimeoutAction: S.optional(S.String),
    SecondsBeforeTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "ScalingConfiguration",
}) as any as S.Schema<ScalingConfiguration>;
export interface RdsCustomClusterConfiguration {
  InterconnectSubnetId?: string;
  TransitGatewayMulticastDomainId?: string;
  ReplicaMode?: ReplicaMode;
}
export const RdsCustomClusterConfiguration = S.suspend(() =>
  S.Struct({
    InterconnectSubnetId: S.optional(S.String),
    TransitGatewayMulticastDomainId: S.optional(S.String),
    ReplicaMode: S.optional(ReplicaMode),
  }),
).annotations({
  identifier: "RdsCustomClusterConfiguration",
}) as any as S.Schema<RdsCustomClusterConfiguration>;
export interface RestoreDBClusterFromSnapshotMessage {
  AvailabilityZones?: string[];
  DBClusterIdentifier?: string;
  SnapshotIdentifier?: string;
  Engine?: string;
  EngineVersion?: string;
  Port?: number;
  DBSubnetGroupName?: string;
  DatabaseName?: string;
  OptionGroupName?: string;
  VpcSecurityGroupIds?: string[];
  Tags?: Tag[];
  KmsKeyId?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  BacktrackWindow?: number;
  EnableCloudwatchLogsExports?: string[];
  EngineMode?: string;
  ScalingConfiguration?: ScalingConfiguration;
  DBClusterParameterGroupName?: string;
  DeletionProtection?: boolean;
  CopyTagsToSnapshot?: boolean;
  Domain?: string;
  DomainIAMRoleName?: string;
  DBClusterInstanceClass?: string;
  StorageType?: string;
  Iops?: number;
  PubliclyAccessible?: boolean;
  NetworkType?: string;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  RdsCustomClusterConfiguration?: RdsCustomClusterConfiguration;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  EngineLifecycleSupport?: string;
  TagSpecifications?: TagSpecification[];
}
export const RestoreDBClusterFromSnapshotMessage = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    DBClusterIdentifier: S.optional(S.String),
    SnapshotIdentifier: S.optional(S.String),
    Engine: S.optional(S.String),
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
  identifier: "RestoreDBClusterFromSnapshotMessage",
}) as any as S.Schema<RestoreDBClusterFromSnapshotMessage>;
export interface RestoreDBClusterToPointInTimeMessage {
  DBClusterIdentifier?: string;
  RestoreType?: string;
  SourceDBClusterIdentifier?: string;
  RestoreToTime?: Date;
  UseLatestRestorableTime?: boolean;
  Port?: number;
  DBSubnetGroupName?: string;
  OptionGroupName?: string;
  VpcSecurityGroupIds?: string[];
  Tags?: Tag[];
  KmsKeyId?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  BacktrackWindow?: number;
  EnableCloudwatchLogsExports?: string[];
  DBClusterParameterGroupName?: string;
  DeletionProtection?: boolean;
  CopyTagsToSnapshot?: boolean;
  Domain?: string;
  DomainIAMRoleName?: string;
  DBClusterInstanceClass?: string;
  StorageType?: string;
  PubliclyAccessible?: boolean;
  Iops?: number;
  NetworkType?: string;
  SourceDbClusterResourceId?: string;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  ScalingConfiguration?: ScalingConfiguration;
  EngineMode?: string;
  RdsCustomClusterConfiguration?: RdsCustomClusterConfiguration;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  EngineLifecycleSupport?: string;
  TagSpecifications?: TagSpecification[];
}
export const RestoreDBClusterToPointInTimeMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
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
  identifier: "RestoreDBClusterToPointInTimeMessage",
}) as any as S.Schema<RestoreDBClusterToPointInTimeMessage>;
export interface RestoreDBInstanceFromDBSnapshotMessage {
  DBInstanceIdentifier?: string;
  DBSnapshotIdentifier?: string;
  DBInstanceClass?: string;
  Port?: number;
  AvailabilityZone?: string;
  DBSubnetGroupName?: string;
  MultiAZ?: boolean;
  PubliclyAccessible?: boolean;
  AutoMinorVersionUpgrade?: boolean;
  LicenseModel?: string;
  DBName?: string;
  Engine?: string;
  Iops?: number;
  StorageThroughput?: number;
  OptionGroupName?: string;
  Tags?: Tag[];
  StorageType?: string;
  TdeCredentialArn?: string;
  TdeCredentialPassword?: string | redacted.Redacted<string>;
  VpcSecurityGroupIds?: string[];
  Domain?: string;
  DomainFqdn?: string;
  DomainOu?: string;
  DomainAuthSecretArn?: string;
  DomainDnsIps?: string[];
  CopyTagsToSnapshot?: boolean;
  DomainIAMRoleName?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  EnableCloudwatchLogsExports?: string[];
  ProcessorFeatures?: ProcessorFeature[];
  UseDefaultProcessorFeatures?: boolean;
  DBParameterGroupName?: string;
  DeletionProtection?: boolean;
  EnableCustomerOwnedIp?: boolean;
  NetworkType?: string;
  BackupTarget?: string;
  CustomIamInstanceProfile?: string;
  AllocatedStorage?: number;
  DBClusterSnapshotIdentifier?: string;
  DedicatedLogVolume?: boolean;
  CACertificateIdentifier?: string;
  EngineLifecycleSupport?: string;
  TagSpecifications?: TagSpecification[];
  ManageMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
  AdditionalStorageVolumes?: AdditionalStorageVolume[];
}
export const RestoreDBInstanceFromDBSnapshotMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
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
    TdeCredentialPassword: S.optional(SensitiveString),
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
  identifier: "RestoreDBInstanceFromDBSnapshotMessage",
}) as any as S.Schema<RestoreDBInstanceFromDBSnapshotMessage>;
export interface RestoreDBInstanceFromS3Message {
  DBName?: string;
  DBInstanceIdentifier?: string;
  AllocatedStorage?: number;
  DBInstanceClass?: string;
  Engine?: string;
  MasterUsername?: string;
  MasterUserPassword?: string | redacted.Redacted<string>;
  DBSecurityGroups?: string[];
  VpcSecurityGroupIds?: string[];
  AvailabilityZone?: string;
  DBSubnetGroupName?: string;
  PreferredMaintenanceWindow?: string;
  DBParameterGroupName?: string;
  BackupRetentionPeriod?: number;
  PreferredBackupWindow?: string;
  Port?: number;
  MultiAZ?: boolean;
  EngineVersion?: string;
  AutoMinorVersionUpgrade?: boolean;
  LicenseModel?: string;
  Iops?: number;
  StorageThroughput?: number;
  OptionGroupName?: string;
  PubliclyAccessible?: boolean;
  Tags?: Tag[];
  StorageType?: string;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  CopyTagsToSnapshot?: boolean;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  SourceEngine?: string;
  SourceEngineVersion?: string;
  S3BucketName?: string;
  S3Prefix?: string;
  S3IngestionRoleArn?: string;
  DatabaseInsightsMode?: DatabaseInsightsMode;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  EnableCloudwatchLogsExports?: string[];
  ProcessorFeatures?: ProcessorFeature[];
  UseDefaultProcessorFeatures?: boolean;
  DeletionProtection?: boolean;
  MaxAllocatedStorage?: number;
  NetworkType?: string;
  ManageMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
  DedicatedLogVolume?: boolean;
  CACertificateIdentifier?: string;
  EngineLifecycleSupport?: string;
  TagSpecifications?: TagSpecification[];
  AdditionalStorageVolumes?: AdditionalStorageVolume[];
}
export const RestoreDBInstanceFromS3Message = S.suspend(() =>
  S.Struct({
    DBName: S.optional(S.String),
    DBInstanceIdentifier: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    DBInstanceClass: S.optional(S.String),
    Engine: S.optional(S.String),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(SensitiveString),
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
    SourceEngine: S.optional(S.String),
    SourceEngineVersion: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3Prefix: S.optional(S.String),
    S3IngestionRoleArn: S.optional(S.String),
    DatabaseInsightsMode: S.optional(DatabaseInsightsMode),
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
  identifier: "RestoreDBInstanceFromS3Message",
}) as any as S.Schema<RestoreDBInstanceFromS3Message>;
export interface RestoreDBInstanceToPointInTimeMessage {
  SourceDBInstanceIdentifier?: string;
  TargetDBInstanceIdentifier?: string;
  RestoreTime?: Date;
  UseLatestRestorableTime?: boolean;
  DBInstanceClass?: string;
  Port?: number;
  AvailabilityZone?: string;
  DBSubnetGroupName?: string;
  MultiAZ?: boolean;
  PubliclyAccessible?: boolean;
  AutoMinorVersionUpgrade?: boolean;
  LicenseModel?: string;
  DBName?: string;
  Engine?: string;
  Iops?: number;
  StorageThroughput?: number;
  OptionGroupName?: string;
  CopyTagsToSnapshot?: boolean;
  Tags?: Tag[];
  StorageType?: string;
  TdeCredentialArn?: string;
  TdeCredentialPassword?: string | redacted.Redacted<string>;
  VpcSecurityGroupIds?: string[];
  Domain?: string;
  DomainIAMRoleName?: string;
  DomainFqdn?: string;
  DomainOu?: string;
  DomainAuthSecretArn?: string;
  DomainDnsIps?: string[];
  EnableIAMDatabaseAuthentication?: boolean;
  EnableCloudwatchLogsExports?: string[];
  ProcessorFeatures?: ProcessorFeature[];
  UseDefaultProcessorFeatures?: boolean;
  DBParameterGroupName?: string;
  DeletionProtection?: boolean;
  SourceDbiResourceId?: string;
  MaxAllocatedStorage?: number;
  EnableCustomerOwnedIp?: boolean;
  NetworkType?: string;
  SourceDBInstanceAutomatedBackupsArn?: string;
  BackupTarget?: string;
  CustomIamInstanceProfile?: string;
  AllocatedStorage?: number;
  DedicatedLogVolume?: boolean;
  CACertificateIdentifier?: string;
  EngineLifecycleSupport?: string;
  TagSpecifications?: TagSpecification[];
  ManageMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
  AdditionalStorageVolumes?: AdditionalStorageVolume[];
}
export const RestoreDBInstanceToPointInTimeMessage = S.suspend(() =>
  S.Struct({
    SourceDBInstanceIdentifier: S.optional(S.String),
    TargetDBInstanceIdentifier: S.optional(S.String),
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
    TdeCredentialPassword: S.optional(SensitiveString),
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
  identifier: "RestoreDBInstanceToPointInTimeMessage",
}) as any as S.Schema<RestoreDBInstanceToPointInTimeMessage>;
export interface RevokeDBSecurityGroupIngressMessage {
  DBSecurityGroupName?: string;
  CIDRIP?: string;
  EC2SecurityGroupName?: string;
  EC2SecurityGroupId?: string;
  EC2SecurityGroupOwnerId?: string;
}
export const RevokeDBSecurityGroupIngressMessage = S.suspend(() =>
  S.Struct({
    DBSecurityGroupName: S.optional(S.String),
    CIDRIP: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
    EC2SecurityGroupId: S.optional(S.String),
    EC2SecurityGroupOwnerId: S.optional(S.String),
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
  identifier: "RevokeDBSecurityGroupIngressMessage",
}) as any as S.Schema<RevokeDBSecurityGroupIngressMessage>;
export interface StartActivityStreamRequest {
  ResourceArn?: string;
  Mode?: ActivityStreamMode;
  KmsKeyId?: string;
  ApplyImmediately?: boolean;
  EngineNativeAuditFieldsIncluded?: boolean;
}
export const StartActivityStreamRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Mode: S.optional(ActivityStreamMode),
    KmsKeyId: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
    EngineNativeAuditFieldsIncluded: S.optional(S.Boolean),
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
  identifier: "StartActivityStreamRequest",
}) as any as S.Schema<StartActivityStreamRequest>;
export interface StartDBClusterMessage {
  DBClusterIdentifier?: string;
}
export const StartDBClusterMessage = S.suspend(() =>
  S.Struct({ DBClusterIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "StartDBClusterMessage",
}) as any as S.Schema<StartDBClusterMessage>;
export interface StartDBInstanceMessage {
  DBInstanceIdentifier?: string;
}
export const StartDBInstanceMessage = S.suspend(() =>
  S.Struct({ DBInstanceIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "StartDBInstanceMessage",
}) as any as S.Schema<StartDBInstanceMessage>;
export interface StartDBInstanceAutomatedBackupsReplicationMessage {
  SourceDBInstanceArn?: string;
  BackupRetentionPeriod?: number;
  KmsKeyId?: string;
  PreSignedUrl?: string | redacted.Redacted<string>;
  Tags?: Tag[];
}
export const StartDBInstanceAutomatedBackupsReplicationMessage = S.suspend(() =>
  S.Struct({
    SourceDBInstanceArn: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(SensitiveString),
    Tags: S.optional(TagList),
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
  identifier: "StartDBInstanceAutomatedBackupsReplicationMessage",
}) as any as S.Schema<StartDBInstanceAutomatedBackupsReplicationMessage>;
export interface StartExportTaskMessage {
  ExportTaskIdentifier?: string;
  SourceArn?: string;
  S3BucketName?: string;
  IamRoleArn?: string;
  KmsKeyId?: string;
  S3Prefix?: string;
  ExportOnly?: string[];
}
export const StartExportTaskMessage = S.suspend(() =>
  S.Struct({
    ExportTaskIdentifier: S.optional(S.String),
    SourceArn: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    S3Prefix: S.optional(S.String),
    ExportOnly: S.optional(StringList),
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
  identifier: "StartExportTaskMessage",
}) as any as S.Schema<StartExportTaskMessage>;
export interface StopActivityStreamRequest {
  ResourceArn?: string;
  ApplyImmediately?: boolean;
}
export const StopActivityStreamRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
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
  identifier: "StopActivityStreamRequest",
}) as any as S.Schema<StopActivityStreamRequest>;
export interface StopDBClusterMessage {
  DBClusterIdentifier?: string;
}
export const StopDBClusterMessage = S.suspend(() =>
  S.Struct({ DBClusterIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "StopDBClusterMessage",
}) as any as S.Schema<StopDBClusterMessage>;
export interface StopDBInstanceMessage {
  DBInstanceIdentifier?: string;
  DBSnapshotIdentifier?: string;
}
export const StopDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    DBSnapshotIdentifier: S.optional(S.String),
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
  identifier: "StopDBInstanceMessage",
}) as any as S.Schema<StopDBInstanceMessage>;
export interface StopDBInstanceAutomatedBackupsReplicationMessage {
  SourceDBInstanceArn?: string;
}
export const StopDBInstanceAutomatedBackupsReplicationMessage = S.suspend(() =>
  S.Struct({ SourceDBInstanceArn: S.optional(S.String) }).pipe(
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
  identifier: "StopDBInstanceAutomatedBackupsReplicationMessage",
}) as any as S.Schema<StopDBInstanceAutomatedBackupsReplicationMessage>;
export interface SwitchoverBlueGreenDeploymentRequest {
  BlueGreenDeploymentIdentifier?: string;
  SwitchoverTimeout?: number;
}
export const SwitchoverBlueGreenDeploymentRequest = S.suspend(() =>
  S.Struct({
    BlueGreenDeploymentIdentifier: S.optional(S.String),
    SwitchoverTimeout: S.optional(S.Number),
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
  identifier: "SwitchoverBlueGreenDeploymentRequest",
}) as any as S.Schema<SwitchoverBlueGreenDeploymentRequest>;
export interface SwitchoverGlobalClusterMessage {
  GlobalClusterIdentifier?: string;
  TargetDbClusterIdentifier?: string;
}
export const SwitchoverGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
    TargetDbClusterIdentifier: S.optional(S.String),
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
  identifier: "SwitchoverGlobalClusterMessage",
}) as any as S.Schema<SwitchoverGlobalClusterMessage>;
export interface SwitchoverReadReplicaMessage {
  DBInstanceIdentifier?: string;
}
export const SwitchoverReadReplicaMessage = S.suspend(() =>
  S.Struct({ DBInstanceIdentifier: S.optional(S.String) }).pipe(
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
  identifier: "SwitchoverReadReplicaMessage",
}) as any as S.Schema<SwitchoverReadReplicaMessage>;
export interface CharacterSet {
  CharacterSetName?: string;
  CharacterSetDescription?: string;
}
export const CharacterSet = S.suspend(() =>
  S.Struct({
    CharacterSetName: S.optional(S.String),
    CharacterSetDescription: S.optional(S.String),
  }),
).annotations({ identifier: "CharacterSet" }) as any as S.Schema<CharacterSet>;
export type SupportedCharacterSetsList = CharacterSet[];
export const SupportedCharacterSetsList = S.Array(
  CharacterSet.pipe(T.XmlName("CharacterSet")).annotations({
    identifier: "CharacterSet",
  }),
);
export type FeatureNameList = string[];
export const FeatureNameList = S.Array(S.String);
export type CACertificateIdentifiersList = string[];
export const CACertificateIdentifiersList = S.Array(S.String);
export type EncryptionContextMap = { [key: string]: string | undefined };
export const EncryptionContextMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type IntegrationStatus =
  | "creating"
  | "active"
  | "modifying"
  | "failed"
  | "deleting"
  | "syncing"
  | "needs_attention"
  | (string & {});
export const IntegrationStatus = S.String;
export interface AccountQuota {
  AccountQuotaName?: string;
  Used?: number;
  Max?: number;
}
export const AccountQuota = S.suspend(() =>
  S.Struct({
    AccountQuotaName: S.optional(S.String),
    Used: S.optional(S.Number),
    Max: S.optional(S.Number),
  }),
).annotations({ identifier: "AccountQuota" }) as any as S.Schema<AccountQuota>;
export type AccountQuotaList = AccountQuota[];
export const AccountQuotaList = S.Array(
  AccountQuota.pipe(T.XmlName("AccountQuota")).annotations({
    identifier: "AccountQuota",
  }),
);
export interface RestoreWindow {
  EarliestTime?: Date;
  LatestTime?: Date;
}
export const RestoreWindow = S.suspend(() =>
  S.Struct({
    EarliestTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LatestTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "RestoreWindow",
}) as any as S.Schema<RestoreWindow>;
export interface DBClusterAutomatedBackup {
  Engine?: string;
  VpcId?: string;
  DBClusterAutomatedBackupsArn?: string;
  DBClusterIdentifier?: string;
  RestoreWindow?: RestoreWindow;
  MasterUsername?: string;
  DbClusterResourceId?: string;
  Region?: string;
  LicenseModel?: string;
  Status?: string;
  IAMDatabaseAuthenticationEnabled?: boolean;
  ClusterCreateTime?: Date;
  StorageEncrypted?: boolean;
  AllocatedStorage?: number;
  EngineVersion?: string;
  DBClusterArn?: string;
  BackupRetentionPeriod?: number;
  EngineMode?: string;
  AvailabilityZones?: string[];
  Port?: number;
  KmsKeyId?: string;
  StorageType?: string;
  Iops?: number;
  StorageThroughput?: number;
  AwsBackupRecoveryPointArn?: string;
  TagList?: Tag[];
}
export const DBClusterAutomatedBackup = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DBClusterAutomatedBackup",
}) as any as S.Schema<DBClusterAutomatedBackup>;
export type DBClusterAutomatedBackupList = DBClusterAutomatedBackup[];
export const DBClusterAutomatedBackupList = S.Array(
  DBClusterAutomatedBackup.pipe(
    T.XmlName("DBClusterAutomatedBackup"),
  ).annotations({ identifier: "DBClusterAutomatedBackup" }),
);
export interface DBClusterBacktrack {
  DBClusterIdentifier?: string;
  BacktrackIdentifier?: string;
  BacktrackTo?: Date;
  BacktrackedFrom?: Date;
  BacktrackRequestCreationTime?: Date;
  Status?: string;
}
export const DBClusterBacktrack = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    BacktrackIdentifier: S.optional(S.String),
    BacktrackTo: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    BacktrackedFrom: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    BacktrackRequestCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    Status: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DBClusterBacktrack",
}) as any as S.Schema<DBClusterBacktrack>;
export type DBClusterBacktrackList = DBClusterBacktrack[];
export const DBClusterBacktrackList = S.Array(
  DBClusterBacktrack.pipe(T.XmlName("DBClusterBacktrack")).annotations({
    identifier: "DBClusterBacktrack",
  }),
);
export interface DBClusterEndpoint {
  DBClusterEndpointIdentifier?: string;
  DBClusterIdentifier?: string;
  DBClusterEndpointResourceIdentifier?: string;
  Endpoint?: string;
  Status?: string;
  EndpointType?: string;
  CustomEndpointType?: string;
  StaticMembers?: string[];
  ExcludedMembers?: string[];
  DBClusterEndpointArn?: string;
}
export const DBClusterEndpoint = S.suspend(() =>
  S.Struct({
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
  }).pipe(ns),
).annotations({
  identifier: "DBClusterEndpoint",
}) as any as S.Schema<DBClusterEndpoint>;
export type DBClusterEndpointList = DBClusterEndpoint[];
export const DBClusterEndpointList = S.Array(
  DBClusterEndpoint.pipe(T.XmlName("DBClusterEndpointList")).annotations({
    identifier: "DBClusterEndpoint",
  }),
);
export interface DBClusterParameterGroup {
  DBClusterParameterGroupName?: string;
  DBParameterGroupFamily?: string;
  Description?: string;
  DBClusterParameterGroupArn?: string;
}
export const DBClusterParameterGroup = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.optional(S.String),
    DBParameterGroupFamily: S.optional(S.String),
    Description: S.optional(S.String),
    DBClusterParameterGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DBClusterParameterGroup",
}) as any as S.Schema<DBClusterParameterGroup>;
export type DBClusterParameterGroupList = DBClusterParameterGroup[];
export const DBClusterParameterGroupList = S.Array(
  DBClusterParameterGroup.pipe(
    T.XmlName("DBClusterParameterGroup"),
  ).annotations({ identifier: "DBClusterParameterGroup" }),
);
export interface DBClusterOptionGroupStatus {
  DBClusterOptionGroupName?: string;
  Status?: string;
}
export const DBClusterOptionGroupStatus = S.suspend(() =>
  S.Struct({
    DBClusterOptionGroupName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "DBClusterOptionGroupStatus",
}) as any as S.Schema<DBClusterOptionGroupStatus>;
export type DBClusterOptionGroupMemberships = DBClusterOptionGroupStatus[];
export const DBClusterOptionGroupMemberships = S.Array(
  DBClusterOptionGroupStatus.pipe(
    T.XmlName("DBClusterOptionGroup"),
  ).annotations({ identifier: "DBClusterOptionGroupStatus" }),
);
export type UpgradeRolloutOrder = "first" | "second" | "last" | (string & {});
export const UpgradeRolloutOrder = S.String;
export type ReadReplicaIdentifierList = string[];
export const ReadReplicaIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaIdentifier")),
);
export interface DBClusterStatusInfo {
  StatusType?: string;
  Normal?: boolean;
  Status?: string;
  Message?: string;
}
export const DBClusterStatusInfo = S.suspend(() =>
  S.Struct({
    StatusType: S.optional(S.String),
    Normal: S.optional(S.Boolean),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "DBClusterStatusInfo",
}) as any as S.Schema<DBClusterStatusInfo>;
export type DBClusterStatusInfoList = DBClusterStatusInfo[];
export const DBClusterStatusInfoList = S.Array(
  DBClusterStatusInfo.pipe(T.XmlName("DBClusterStatusInfo")).annotations({
    identifier: "DBClusterStatusInfo",
  }),
);
export interface DBClusterMember {
  DBInstanceIdentifier?: string;
  IsClusterWriter?: boolean;
  DBClusterParameterGroupStatus?: string;
  PromotionTier?: number;
}
export const DBClusterMember = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    IsClusterWriter: S.optional(S.Boolean),
    DBClusterParameterGroupStatus: S.optional(S.String),
    PromotionTier: S.optional(S.Number),
  }),
).annotations({
  identifier: "DBClusterMember",
}) as any as S.Schema<DBClusterMember>;
export type DBClusterMemberList = DBClusterMember[];
export const DBClusterMemberList = S.Array(
  DBClusterMember.pipe(T.XmlName("DBClusterMember")).annotations({
    identifier: "DBClusterMember",
  }),
);
export interface VpcSecurityGroupMembership {
  VpcSecurityGroupId?: string;
  Status?: string;
}
export const VpcSecurityGroupMembership = S.suspend(() =>
  S.Struct({
    VpcSecurityGroupId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcSecurityGroupMembership",
}) as any as S.Schema<VpcSecurityGroupMembership>;
export type VpcSecurityGroupMembershipList = VpcSecurityGroupMembership[];
export const VpcSecurityGroupMembershipList = S.Array(
  VpcSecurityGroupMembership.pipe(
    T.XmlName("VpcSecurityGroupMembership"),
  ).annotations({ identifier: "VpcSecurityGroupMembership" }),
);
export interface DBClusterRole {
  RoleArn?: string;
  Status?: string;
  FeatureName?: string;
}
export const DBClusterRole = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    Status: S.optional(S.String),
    FeatureName: S.optional(S.String),
  }),
).annotations({
  identifier: "DBClusterRole",
}) as any as S.Schema<DBClusterRole>;
export type DBClusterRoles = DBClusterRole[];
export const DBClusterRoles = S.Array(
  DBClusterRole.pipe(T.XmlName("DBClusterRole")).annotations({
    identifier: "DBClusterRole",
  }),
);
export interface PendingCloudwatchLogsExports {
  LogTypesToEnable?: string[];
  LogTypesToDisable?: string[];
}
export const PendingCloudwatchLogsExports = S.suspend(() =>
  S.Struct({
    LogTypesToEnable: S.optional(LogTypeList),
    LogTypesToDisable: S.optional(LogTypeList),
  }),
).annotations({
  identifier: "PendingCloudwatchLogsExports",
}) as any as S.Schema<PendingCloudwatchLogsExports>;
export interface CertificateDetails {
  CAIdentifier?: string;
  ValidTill?: Date;
}
export const CertificateDetails = S.suspend(() =>
  S.Struct({
    CAIdentifier: S.optional(S.String),
    ValidTill: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CertificateDetails",
}) as any as S.Schema<CertificateDetails>;
export interface ClusterPendingModifiedValues {
  PendingCloudwatchLogsExports?: PendingCloudwatchLogsExports;
  DBClusterIdentifier?: string;
  MasterUserPassword?: string | redacted.Redacted<string>;
  IAMDatabaseAuthenticationEnabled?: boolean;
  EngineVersion?: string;
  BackupRetentionPeriod?: number;
  StorageType?: string;
  AllocatedStorage?: number;
  RdsCustomClusterConfiguration?: RdsCustomClusterConfiguration;
  Iops?: number;
  CertificateDetails?: CertificateDetails;
}
export const ClusterPendingModifiedValues = S.suspend(() =>
  S.Struct({
    PendingCloudwatchLogsExports: S.optional(PendingCloudwatchLogsExports),
    DBClusterIdentifier: S.optional(S.String),
    MasterUserPassword: S.optional(SensitiveString),
    IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    StorageType: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    RdsCustomClusterConfiguration: S.optional(RdsCustomClusterConfiguration),
    Iops: S.optional(S.Number),
    CertificateDetails: S.optional(CertificateDetails),
  }),
).annotations({
  identifier: "ClusterPendingModifiedValues",
}) as any as S.Schema<ClusterPendingModifiedValues>;
export interface ScalingConfigurationInfo {
  MinCapacity?: number;
  MaxCapacity?: number;
  AutoPause?: boolean;
  SecondsUntilAutoPause?: number;
  TimeoutAction?: string;
  SecondsBeforeTimeout?: number;
}
export const ScalingConfigurationInfo = S.suspend(() =>
  S.Struct({
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    AutoPause: S.optional(S.Boolean),
    SecondsUntilAutoPause: S.optional(S.Number),
    TimeoutAction: S.optional(S.String),
    SecondsBeforeTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "ScalingConfigurationInfo",
}) as any as S.Schema<ScalingConfigurationInfo>;
export type ActivityStreamStatus =
  | "stopped"
  | "starting"
  | "started"
  | "stopping"
  | (string & {});
export const ActivityStreamStatus = S.String;
export interface DomainMembership {
  Domain?: string;
  Status?: string;
  FQDN?: string;
  IAMRoleName?: string;
  OU?: string;
  AuthSecretArn?: string;
  DnsIps?: string[];
}
export const DomainMembership = S.suspend(() =>
  S.Struct({
    Domain: S.optional(S.String),
    Status: S.optional(S.String),
    FQDN: S.optional(S.String),
    IAMRoleName: S.optional(S.String),
    OU: S.optional(S.String),
    AuthSecretArn: S.optional(S.String),
    DnsIps: S.optional(StringList),
  }),
).annotations({
  identifier: "DomainMembership",
}) as any as S.Schema<DomainMembership>;
export type DomainMembershipList = DomainMembership[];
export const DomainMembershipList = S.Array(
  DomainMembership.pipe(T.XmlName("DomainMembership")).annotations({
    identifier: "DomainMembership",
  }),
);
export type WriteForwardingStatus =
  | "enabled"
  | "disabled"
  | "enabling"
  | "disabling"
  | "unknown"
  | (string & {});
export const WriteForwardingStatus = S.String;
export interface ServerlessV2ScalingConfigurationInfo {
  MinCapacity?: number;
  MaxCapacity?: number;
  SecondsUntilAutoPause?: number;
}
export const ServerlessV2ScalingConfigurationInfo = S.suspend(() =>
  S.Struct({
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    SecondsUntilAutoPause: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServerlessV2ScalingConfigurationInfo",
}) as any as S.Schema<ServerlessV2ScalingConfigurationInfo>;
export interface MasterUserSecret {
  SecretArn?: string;
  SecretStatus?: string;
  KmsKeyId?: string;
}
export const MasterUserSecret = S.suspend(() =>
  S.Struct({
    SecretArn: S.optional(S.String),
    SecretStatus: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "MasterUserSecret",
}) as any as S.Schema<MasterUserSecret>;
export type LocalWriteForwardingStatus =
  | "enabled"
  | "disabled"
  | "enabling"
  | "disabling"
  | "requested"
  | (string & {});
export const LocalWriteForwardingStatus = S.String;
export type LimitlessDatabaseStatus =
  | "active"
  | "not-in-use"
  | "enabled"
  | "disabled"
  | "enabling"
  | "disabling"
  | "modifying-max-capacity"
  | "error"
  | (string & {});
export const LimitlessDatabaseStatus = S.String;
export interface LimitlessDatabase {
  Status?: LimitlessDatabaseStatus;
  MinRequiredACU?: number;
}
export const LimitlessDatabase = S.suspend(() =>
  S.Struct({
    Status: S.optional(LimitlessDatabaseStatus),
    MinRequiredACU: S.optional(S.Number),
  }),
).annotations({
  identifier: "LimitlessDatabase",
}) as any as S.Schema<LimitlessDatabase>;
export interface DBCluster {
  AllocatedStorage?: number;
  AvailabilityZones?: string[];
  BackupRetentionPeriod?: number;
  CharacterSetName?: string;
  DatabaseName?: string;
  DBClusterIdentifier?: string;
  DBClusterParameterGroup?: string;
  DBSubnetGroup?: string;
  Status?: string;
  PercentProgress?: string;
  EarliestRestorableTime?: Date;
  Endpoint?: string;
  ReaderEndpoint?: string;
  CustomEndpoints?: string[];
  MultiAZ?: boolean;
  Engine?: string;
  EngineVersion?: string;
  LatestRestorableTime?: Date;
  Port?: number;
  MasterUsername?: string;
  DBClusterOptionGroupMemberships?: DBClusterOptionGroupStatus[];
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  UpgradeRolloutOrder?: UpgradeRolloutOrder;
  ReplicationSourceIdentifier?: string;
  ReadReplicaIdentifiers?: string[];
  StatusInfos?: DBClusterStatusInfo[];
  DBClusterMembers?: DBClusterMember[];
  VpcSecurityGroups?: VpcSecurityGroupMembership[];
  HostedZoneId?: string;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  DbClusterResourceId?: string;
  DBClusterArn?: string;
  AssociatedRoles?: DBClusterRole[];
  IAMDatabaseAuthenticationEnabled?: boolean;
  CloneGroupId?: string;
  ClusterCreateTime?: Date;
  EarliestBacktrackTime?: Date;
  BacktrackWindow?: number;
  BacktrackConsumedChangeRecords?: number;
  EnabledCloudwatchLogsExports?: string[];
  Capacity?: number;
  PendingModifiedValues?: ClusterPendingModifiedValues;
  EngineMode?: string;
  ScalingConfigurationInfo?: ScalingConfigurationInfo;
  RdsCustomClusterConfiguration?: RdsCustomClusterConfiguration;
  DBClusterInstanceClass?: string;
  StorageType?: string;
  Iops?: number;
  StorageThroughput?: number;
  IOOptimizedNextAllowedModificationTime?: Date;
  PubliclyAccessible?: boolean;
  AutoMinorVersionUpgrade?: boolean;
  DeletionProtection?: boolean;
  HttpEndpointEnabled?: boolean;
  ActivityStreamMode?: ActivityStreamMode;
  ActivityStreamStatus?: ActivityStreamStatus;
  ActivityStreamKmsKeyId?: string;
  ActivityStreamKinesisStreamName?: string;
  CopyTagsToSnapshot?: boolean;
  CrossAccountClone?: boolean;
  DomainMemberships?: DomainMembership[];
  TagList?: Tag[];
  GlobalClusterIdentifier?: string;
  GlobalWriteForwardingStatus?: WriteForwardingStatus;
  GlobalWriteForwardingRequested?: boolean;
  NetworkType?: string;
  AutomaticRestartTime?: Date;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfigurationInfo;
  ServerlessV2PlatformVersion?: string;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  DatabaseInsightsMode?: DatabaseInsightsMode;
  PerformanceInsightsEnabled?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  DBSystemId?: string;
  MasterUserSecret?: MasterUserSecret;
  LocalWriteForwardingStatus?: LocalWriteForwardingStatus;
  AwsBackupRecoveryPointArn?: string;
  LimitlessDatabase?: LimitlessDatabase;
  ClusterScalabilityType?: ClusterScalabilityType;
  CertificateDetails?: CertificateDetails;
  EngineLifecycleSupport?: string;
}
export const DBCluster = S.suspend(() =>
  S.Struct({
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
    LatestRestorableTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    Port: S.optional(S.Number),
    MasterUsername: S.optional(S.String),
    DBClusterOptionGroupMemberships: S.optional(
      DBClusterOptionGroupMemberships,
    ),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    UpgradeRolloutOrder: S.optional(UpgradeRolloutOrder),
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
    ActivityStreamMode: S.optional(ActivityStreamMode),
    ActivityStreamStatus: S.optional(ActivityStreamStatus),
    ActivityStreamKmsKeyId: S.optional(S.String),
    ActivityStreamKinesisStreamName: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    CrossAccountClone: S.optional(S.Boolean),
    DomainMemberships: S.optional(DomainMembershipList),
    TagList: S.optional(TagList),
    GlobalClusterIdentifier: S.optional(S.String),
    GlobalWriteForwardingStatus: S.optional(WriteForwardingStatus),
    GlobalWriteForwardingRequested: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    AutomaticRestartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfigurationInfo,
    ),
    ServerlessV2PlatformVersion: S.optional(S.String),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    DatabaseInsightsMode: S.optional(DatabaseInsightsMode),
    PerformanceInsightsEnabled: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    DBSystemId: S.optional(S.String),
    MasterUserSecret: S.optional(MasterUserSecret),
    LocalWriteForwardingStatus: S.optional(LocalWriteForwardingStatus),
    AwsBackupRecoveryPointArn: S.optional(S.String),
    LimitlessDatabase: S.optional(LimitlessDatabase),
    ClusterScalabilityType: S.optional(ClusterScalabilityType),
    CertificateDetails: S.optional(CertificateDetails),
    EngineLifecycleSupport: S.optional(S.String),
  }),
).annotations({ identifier: "DBCluster" }) as any as S.Schema<DBCluster>;
export type DBClusterList = DBCluster[];
export const DBClusterList = S.Array(
  DBCluster.pipe(T.XmlName("DBCluster")).annotations({
    identifier: "DBCluster",
  }),
);
export interface DBClusterSnapshot {
  AvailabilityZones?: string[];
  DBClusterSnapshotIdentifier?: string;
  DBClusterIdentifier?: string;
  SnapshotCreateTime?: Date;
  Engine?: string;
  EngineMode?: string;
  AllocatedStorage?: number;
  Status?: string;
  Port?: number;
  VpcId?: string;
  ClusterCreateTime?: Date;
  MasterUsername?: string;
  EngineVersion?: string;
  LicenseModel?: string;
  SnapshotType?: string;
  PercentProgress?: number;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  DBClusterSnapshotArn?: string;
  SourceDBClusterSnapshotArn?: string;
  IAMDatabaseAuthenticationEnabled?: boolean;
  TagList?: Tag[];
  StorageType?: string;
  StorageThroughput?: number;
  DbClusterResourceId?: string;
  DBSystemId?: string;
}
export const DBClusterSnapshot = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DBClusterSnapshot",
}) as any as S.Schema<DBClusterSnapshot>;
export type DBClusterSnapshotList = DBClusterSnapshot[];
export const DBClusterSnapshotList = S.Array(
  DBClusterSnapshot.pipe(T.XmlName("DBClusterSnapshot")).annotations({
    identifier: "DBClusterSnapshot",
  }),
);
export interface CustomDBEngineVersionAMI {
  ImageId?: string;
  Status?: string;
}
export const CustomDBEngineVersionAMI = S.suspend(() =>
  S.Struct({ ImageId: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "CustomDBEngineVersionAMI",
}) as any as S.Schema<CustomDBEngineVersionAMI>;
export interface UpgradeTarget {
  Engine?: string;
  EngineVersion?: string;
  Description?: string;
  AutoUpgrade?: boolean;
  IsMajorVersionUpgrade?: boolean;
  SupportedEngineModes?: string[];
  SupportsParallelQuery?: boolean;
  SupportsGlobalDatabases?: boolean;
  SupportsBabelfish?: boolean;
  SupportsLimitlessDatabase?: boolean;
  SupportsLocalWriteForwarding?: boolean;
  SupportsIntegrations?: boolean;
}
export const UpgradeTarget = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "UpgradeTarget",
}) as any as S.Schema<UpgradeTarget>;
export type ValidUpgradeTargetList = UpgradeTarget[];
export const ValidUpgradeTargetList = S.Array(
  UpgradeTarget.pipe(T.XmlName("UpgradeTarget")).annotations({
    identifier: "UpgradeTarget",
  }),
);
export interface Timezone {
  TimezoneName?: string;
}
export const Timezone = S.suspend(() =>
  S.Struct({ TimezoneName: S.optional(S.String) }),
).annotations({ identifier: "Timezone" }) as any as S.Schema<Timezone>;
export type SupportedTimezonesList = Timezone[];
export const SupportedTimezonesList = S.Array(
  Timezone.pipe(T.XmlName("Timezone")).annotations({ identifier: "Timezone" }),
);
export interface ServerlessV2FeaturesSupport {
  MinCapacity?: number;
  MaxCapacity?: number;
}
export const ServerlessV2FeaturesSupport = S.suspend(() =>
  S.Struct({
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServerlessV2FeaturesSupport",
}) as any as S.Schema<ServerlessV2FeaturesSupport>;
export interface DBEngineVersion {
  Engine?: string;
  MajorEngineVersion?: string;
  EngineVersion?: string;
  DatabaseInstallationFilesS3BucketName?: string;
  DatabaseInstallationFilesS3Prefix?: string;
  CustomDBEngineVersionManifest?: string;
  DBParameterGroupFamily?: string;
  DBEngineDescription?: string;
  DBEngineVersionArn?: string;
  DBEngineVersionDescription?: string;
  DefaultCharacterSet?: CharacterSet;
  Image?: CustomDBEngineVersionAMI;
  DBEngineMediaType?: string;
  KMSKeyId?: string;
  CreateTime?: Date;
  SupportedCharacterSets?: CharacterSet[];
  SupportedNcharCharacterSets?: CharacterSet[];
  ValidUpgradeTarget?: UpgradeTarget[];
  SupportedTimezones?: Timezone[];
  ExportableLogTypes?: string[];
  SupportsLogExportsToCloudwatchLogs?: boolean;
  SupportsReadReplica?: boolean;
  SupportedEngineModes?: string[];
  SupportedFeatureNames?: string[];
  Status?: string;
  SupportsParallelQuery?: boolean;
  SupportsGlobalDatabases?: boolean;
  TagList?: Tag[];
  SupportsBabelfish?: boolean;
  SupportsLimitlessDatabase?: boolean;
  SupportsCertificateRotationWithoutRestart?: boolean;
  SupportedCACertificateIdentifiers?: string[];
  SupportsLocalWriteForwarding?: boolean;
  SupportsIntegrations?: boolean;
  ServerlessV2FeaturesSupport?: ServerlessV2FeaturesSupport;
  DatabaseInstallationFiles?: string[];
  FailureReason?: string;
}
export const DBEngineVersion = S.suspend(() =>
  S.Struct({
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
  }).pipe(ns),
).annotations({
  identifier: "DBEngineVersion",
}) as any as S.Schema<DBEngineVersion>;
export type DBEngineVersionList = DBEngineVersion[];
export const DBEngineVersionList = S.Array(
  DBEngineVersion.pipe(T.XmlName("DBEngineVersion")).annotations({
    identifier: "DBEngineVersion",
  }),
);
export interface DBInstanceAutomatedBackupsReplication {
  DBInstanceAutomatedBackupsArn?: string;
}
export const DBInstanceAutomatedBackupsReplication = S.suspend(() =>
  S.Struct({ DBInstanceAutomatedBackupsArn: S.optional(S.String) }),
).annotations({
  identifier: "DBInstanceAutomatedBackupsReplication",
}) as any as S.Schema<DBInstanceAutomatedBackupsReplication>;
export type DBInstanceAutomatedBackupsReplicationList =
  DBInstanceAutomatedBackupsReplication[];
export const DBInstanceAutomatedBackupsReplicationList = S.Array(
  DBInstanceAutomatedBackupsReplication.pipe(
    T.XmlName("DBInstanceAutomatedBackupsReplication"),
  ).annotations({ identifier: "DBInstanceAutomatedBackupsReplication" }),
);
export interface DBInstanceAutomatedBackup {
  DBInstanceArn?: string;
  DbiResourceId?: string;
  Region?: string;
  DBInstanceIdentifier?: string;
  RestoreWindow?: RestoreWindow;
  AllocatedStorage?: number;
  Status?: string;
  Port?: number;
  AvailabilityZone?: string;
  VpcId?: string;
  InstanceCreateTime?: Date;
  MasterUsername?: string;
  Engine?: string;
  EngineVersion?: string;
  LicenseModel?: string;
  Iops?: number;
  StorageThroughput?: number;
  OptionGroupName?: string;
  TdeCredentialArn?: string;
  Encrypted?: boolean;
  StorageType?: string;
  KmsKeyId?: string;
  Timezone?: string;
  IAMDatabaseAuthenticationEnabled?: boolean;
  BackupRetentionPeriod?: number;
  DBInstanceAutomatedBackupsArn?: string;
  DBInstanceAutomatedBackupsReplications?: DBInstanceAutomatedBackupsReplication[];
  BackupTarget?: string;
  MultiTenant?: boolean;
  AwsBackupRecoveryPointArn?: string;
  TagList?: Tag[];
  DedicatedLogVolume?: boolean;
  AdditionalStorageVolumes?: AdditionalStorageVolume[];
}
export const DBInstanceAutomatedBackup = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DBInstanceAutomatedBackup",
}) as any as S.Schema<DBInstanceAutomatedBackup>;
export type DBInstanceAutomatedBackupList = DBInstanceAutomatedBackup[];
export const DBInstanceAutomatedBackupList = S.Array(
  DBInstanceAutomatedBackup.pipe(
    T.XmlName("DBInstanceAutomatedBackup"),
  ).annotations({ identifier: "DBInstanceAutomatedBackup" }),
);
export interface Endpoint {
  Address?: string;
  Port?: number;
  HostedZoneId?: string;
}
export const Endpoint = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    Port: S.optional(S.Number),
    HostedZoneId: S.optional(S.String),
  }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export interface DBSecurityGroupMembership {
  DBSecurityGroupName?: string;
  Status?: string;
}
export const DBSecurityGroupMembership = S.suspend(() =>
  S.Struct({
    DBSecurityGroupName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "DBSecurityGroupMembership",
}) as any as S.Schema<DBSecurityGroupMembership>;
export type DBSecurityGroupMembershipList = DBSecurityGroupMembership[];
export const DBSecurityGroupMembershipList = S.Array(
  DBSecurityGroupMembership.pipe(T.XmlName("DBSecurityGroup")).annotations({
    identifier: "DBSecurityGroupMembership",
  }),
);
export interface DBParameterGroupStatus {
  DBParameterGroupName?: string;
  ParameterApplyStatus?: string;
}
export const DBParameterGroupStatus = S.suspend(() =>
  S.Struct({
    DBParameterGroupName: S.optional(S.String),
    ParameterApplyStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "DBParameterGroupStatus",
}) as any as S.Schema<DBParameterGroupStatus>;
export type DBParameterGroupStatusList = DBParameterGroupStatus[];
export const DBParameterGroupStatusList = S.Array(
  DBParameterGroupStatus.pipe(T.XmlName("DBParameterGroup")).annotations({
    identifier: "DBParameterGroupStatus",
  }),
);
export interface AvailabilityZone {
  Name?: string;
}
export const AvailabilityZone = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "AvailabilityZone",
}) as any as S.Schema<AvailabilityZone>;
export interface Outpost {
  Arn?: string;
}
export const Outpost = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({ identifier: "Outpost" }) as any as S.Schema<Outpost>;
export interface Subnet {
  SubnetIdentifier?: string;
  SubnetAvailabilityZone?: AvailabilityZone;
  SubnetOutpost?: Outpost;
  SubnetStatus?: string;
}
export const Subnet = S.suspend(() =>
  S.Struct({
    SubnetIdentifier: S.optional(S.String),
    SubnetAvailabilityZone: S.optional(AvailabilityZone),
    SubnetOutpost: S.optional(Outpost),
    SubnetStatus: S.optional(S.String),
  }),
).annotations({ identifier: "Subnet" }) as any as S.Schema<Subnet>;
export type SubnetList = Subnet[];
export const SubnetList = S.Array(
  Subnet.pipe(T.XmlName("Subnet")).annotations({ identifier: "Subnet" }),
);
export interface DBSubnetGroup {
  DBSubnetGroupName?: string;
  DBSubnetGroupDescription?: string;
  VpcId?: string;
  SubnetGroupStatus?: string;
  Subnets?: Subnet[];
  DBSubnetGroupArn?: string;
  SupportedNetworkTypes?: string[];
}
export const DBSubnetGroup = S.suspend(() =>
  S.Struct({
    DBSubnetGroupName: S.optional(S.String),
    DBSubnetGroupDescription: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetGroupStatus: S.optional(S.String),
    Subnets: S.optional(SubnetList),
    DBSubnetGroupArn: S.optional(S.String),
    SupportedNetworkTypes: S.optional(StringList),
  }),
).annotations({
  identifier: "DBSubnetGroup",
}) as any as S.Schema<DBSubnetGroup>;
export interface PendingModifiedValues {
  DBInstanceClass?: string;
  AllocatedStorage?: number;
  MasterUserPassword?: string | redacted.Redacted<string>;
  Port?: number;
  BackupRetentionPeriod?: number;
  MultiAZ?: boolean;
  EngineVersion?: string;
  LicenseModel?: string;
  Iops?: number;
  StorageThroughput?: number;
  DBInstanceIdentifier?: string;
  StorageType?: string;
  CACertificateIdentifier?: string;
  DBSubnetGroupName?: string;
  PendingCloudwatchLogsExports?: PendingCloudwatchLogsExports;
  ProcessorFeatures?: ProcessorFeature[];
  AutomationMode?: AutomationMode;
  ResumeFullAutomationModeTime?: Date;
  MultiTenant?: boolean;
  IAMDatabaseAuthenticationEnabled?: boolean;
  DedicatedLogVolume?: boolean;
  Engine?: string;
  AdditionalStorageVolumes?: AdditionalStorageVolume[];
}
export const PendingModifiedValues = S.suspend(() =>
  S.Struct({
    DBInstanceClass: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    MasterUserPassword: S.optional(SensitiveString),
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
    AutomationMode: S.optional(AutomationMode),
    ResumeFullAutomationModeTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    MultiTenant: S.optional(S.Boolean),
    IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
    DedicatedLogVolume: S.optional(S.Boolean),
    Engine: S.optional(S.String),
    AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
  }),
).annotations({
  identifier: "PendingModifiedValues",
}) as any as S.Schema<PendingModifiedValues>;
export type ReadReplicaDBInstanceIdentifierList = string[];
export const ReadReplicaDBInstanceIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaDBInstanceIdentifier")),
);
export type ReadReplicaDBClusterIdentifierList = string[];
export const ReadReplicaDBClusterIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaDBClusterIdentifier")),
);
export interface OptionGroupMembership {
  OptionGroupName?: string;
  Status?: string;
}
export const OptionGroupMembership = S.suspend(() =>
  S.Struct({
    OptionGroupName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "OptionGroupMembership",
}) as any as S.Schema<OptionGroupMembership>;
export type OptionGroupMembershipList = OptionGroupMembership[];
export const OptionGroupMembershipList = S.Array(
  OptionGroupMembership.pipe(T.XmlName("OptionGroupMembership")).annotations({
    identifier: "OptionGroupMembership",
  }),
);
export interface DBInstanceStatusInfo {
  StatusType?: string;
  Normal?: boolean;
  Status?: string;
  Message?: string;
}
export const DBInstanceStatusInfo = S.suspend(() =>
  S.Struct({
    StatusType: S.optional(S.String),
    Normal: S.optional(S.Boolean),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "DBInstanceStatusInfo",
}) as any as S.Schema<DBInstanceStatusInfo>;
export type DBInstanceStatusInfoList = DBInstanceStatusInfo[];
export const DBInstanceStatusInfoList = S.Array(
  DBInstanceStatusInfo.pipe(T.XmlName("DBInstanceStatusInfo")).annotations({
    identifier: "DBInstanceStatusInfo",
  }),
);
export interface DBInstanceRole {
  RoleArn?: string;
  FeatureName?: string;
  Status?: string;
}
export const DBInstanceRole = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    FeatureName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "DBInstanceRole",
}) as any as S.Schema<DBInstanceRole>;
export type DBInstanceRoles = DBInstanceRole[];
export const DBInstanceRoles = S.Array(
  DBInstanceRole.pipe(T.XmlName("DBInstanceRole")).annotations({
    identifier: "DBInstanceRole",
  }),
);
export type ActivityStreamPolicyStatus =
  | "locked"
  | "unlocked"
  | "locking-policy"
  | "unlocking-policy"
  | (string & {});
export const ActivityStreamPolicyStatus = S.String;
export interface AdditionalStorageVolumeOutput {
  VolumeName?: string;
  StorageVolumeStatus?: string;
  AllocatedStorage?: number;
  IOPS?: number;
  MaxAllocatedStorage?: number;
  StorageThroughput?: number;
  StorageType?: string;
}
export const AdditionalStorageVolumeOutput = S.suspend(() =>
  S.Struct({
    VolumeName: S.optional(S.String),
    StorageVolumeStatus: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    IOPS: S.optional(S.Number),
    MaxAllocatedStorage: S.optional(S.Number),
    StorageThroughput: S.optional(S.Number),
    StorageType: S.optional(S.String),
  }),
).annotations({
  identifier: "AdditionalStorageVolumeOutput",
}) as any as S.Schema<AdditionalStorageVolumeOutput>;
export type AdditionalStorageVolumesOutputList =
  AdditionalStorageVolumeOutput[];
export const AdditionalStorageVolumesOutputList = S.Array(
  AdditionalStorageVolumeOutput,
);
export interface DBInstance {
  DBInstanceIdentifier?: string;
  DBInstanceClass?: string;
  Engine?: string;
  DBInstanceStatus?: string;
  MasterUsername?: string;
  DBName?: string;
  Endpoint?: Endpoint;
  AllocatedStorage?: number;
  InstanceCreateTime?: Date;
  PreferredBackupWindow?: string;
  BackupRetentionPeriod?: number;
  DBSecurityGroups?: DBSecurityGroupMembership[];
  VpcSecurityGroups?: VpcSecurityGroupMembership[];
  DBParameterGroups?: DBParameterGroupStatus[];
  AvailabilityZone?: string;
  DBSubnetGroup?: DBSubnetGroup;
  PreferredMaintenanceWindow?: string;
  UpgradeRolloutOrder?: UpgradeRolloutOrder;
  PendingModifiedValues?: PendingModifiedValues;
  LatestRestorableTime?: Date;
  MultiAZ?: boolean;
  EngineVersion?: string;
  AutoMinorVersionUpgrade?: boolean;
  ReadReplicaSourceDBInstanceIdentifier?: string;
  ReadReplicaDBInstanceIdentifiers?: string[];
  ReadReplicaDBClusterIdentifiers?: string[];
  ReplicaMode?: ReplicaMode;
  LicenseModel?: string;
  Iops?: number;
  StorageThroughput?: number;
  OptionGroupMemberships?: OptionGroupMembership[];
  CharacterSetName?: string;
  NcharCharacterSetName?: string;
  SecondaryAvailabilityZone?: string;
  PubliclyAccessible?: boolean;
  StatusInfos?: DBInstanceStatusInfo[];
  StorageType?: string;
  TdeCredentialArn?: string;
  DbInstancePort?: number;
  DBClusterIdentifier?: string;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  DbiResourceId?: string;
  CACertificateIdentifier?: string;
  DomainMemberships?: DomainMembership[];
  CopyTagsToSnapshot?: boolean;
  MonitoringInterval?: number;
  EnhancedMonitoringResourceArn?: string;
  MonitoringRoleArn?: string;
  PromotionTier?: number;
  DBInstanceArn?: string;
  Timezone?: string;
  IAMDatabaseAuthenticationEnabled?: boolean;
  DatabaseInsightsMode?: DatabaseInsightsMode;
  PerformanceInsightsEnabled?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  EnabledCloudwatchLogsExports?: string[];
  ProcessorFeatures?: ProcessorFeature[];
  DeletionProtection?: boolean;
  AssociatedRoles?: DBInstanceRole[];
  ListenerEndpoint?: Endpoint;
  MaxAllocatedStorage?: number;
  TagList?: Tag[];
  AutomationMode?: AutomationMode;
  ResumeFullAutomationModeTime?: Date;
  CustomerOwnedIpEnabled?: boolean;
  NetworkType?: string;
  ActivityStreamStatus?: ActivityStreamStatus;
  ActivityStreamKmsKeyId?: string;
  ActivityStreamKinesisStreamName?: string;
  ActivityStreamMode?: ActivityStreamMode;
  ActivityStreamEngineNativeAuditFieldsIncluded?: boolean;
  AwsBackupRecoveryPointArn?: string;
  DBInstanceAutomatedBackupsReplications?: DBInstanceAutomatedBackupsReplication[];
  BackupTarget?: string;
  AutomaticRestartTime?: Date;
  CustomIamInstanceProfile?: string;
  ActivityStreamPolicyStatus?: ActivityStreamPolicyStatus;
  CertificateDetails?: CertificateDetails;
  DBSystemId?: string;
  MasterUserSecret?: MasterUserSecret;
  ReadReplicaSourceDBClusterIdentifier?: string;
  PercentProgress?: string;
  MultiTenant?: boolean;
  DedicatedLogVolume?: boolean;
  IsStorageConfigUpgradeAvailable?: boolean;
  EngineLifecycleSupport?: string;
  AdditionalStorageVolumes?: AdditionalStorageVolumeOutput[];
  StorageVolumeStatus?: string;
}
export const DBInstance = S.suspend(() =>
  S.Struct({
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
    UpgradeRolloutOrder: S.optional(UpgradeRolloutOrder),
    PendingModifiedValues: S.optional(PendingModifiedValues),
    LatestRestorableTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
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
    ReplicaMode: S.optional(ReplicaMode),
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
    DatabaseInsightsMode: S.optional(DatabaseInsightsMode),
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
    AutomationMode: S.optional(AutomationMode),
    ResumeFullAutomationModeTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    CustomerOwnedIpEnabled: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    ActivityStreamStatus: S.optional(ActivityStreamStatus),
    ActivityStreamKmsKeyId: S.optional(S.String),
    ActivityStreamKinesisStreamName: S.optional(S.String),
    ActivityStreamMode: S.optional(ActivityStreamMode),
    ActivityStreamEngineNativeAuditFieldsIncluded: S.optional(S.Boolean),
    AwsBackupRecoveryPointArn: S.optional(S.String),
    DBInstanceAutomatedBackupsReplications: S.optional(
      DBInstanceAutomatedBackupsReplicationList,
    ),
    BackupTarget: S.optional(S.String),
    AutomaticRestartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    CustomIamInstanceProfile: S.optional(S.String),
    ActivityStreamPolicyStatus: S.optional(ActivityStreamPolicyStatus),
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
  }),
).annotations({ identifier: "DBInstance" }) as any as S.Schema<DBInstance>;
export type DBInstanceList = DBInstance[];
export const DBInstanceList = S.Array(
  DBInstance.pipe(T.XmlName("DBInstance")).annotations({
    identifier: "DBInstance",
  }),
);
export interface DBParameterGroup {
  DBParameterGroupName?: string;
  DBParameterGroupFamily?: string;
  Description?: string;
  DBParameterGroupArn?: string;
}
export const DBParameterGroup = S.suspend(() =>
  S.Struct({
    DBParameterGroupName: S.optional(S.String),
    DBParameterGroupFamily: S.optional(S.String),
    Description: S.optional(S.String),
    DBParameterGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DBParameterGroup",
}) as any as S.Schema<DBParameterGroup>;
export type DBParameterGroupList = DBParameterGroup[];
export const DBParameterGroupList = S.Array(
  DBParameterGroup.pipe(T.XmlName("DBParameterGroup")).annotations({
    identifier: "DBParameterGroup",
  }),
);
export type DBProxyStatus =
  | "available"
  | "modifying"
  | "incompatible-network"
  | "insufficient-resource-limits"
  | "creating"
  | "deleting"
  | "suspended"
  | "suspending"
  | "reactivating"
  | (string & {});
export const DBProxyStatus = S.String;
export interface UserAuthConfigInfo {
  Description?: string;
  UserName?: string;
  AuthScheme?: AuthScheme;
  SecretArn?: string;
  IAMAuth?: IAMAuthMode;
  ClientPasswordAuthType?: ClientPasswordAuthType;
}
export const UserAuthConfigInfo = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    UserName: S.optional(S.String),
    AuthScheme: S.optional(AuthScheme),
    SecretArn: S.optional(S.String),
    IAMAuth: S.optional(IAMAuthMode),
    ClientPasswordAuthType: S.optional(ClientPasswordAuthType),
  }),
).annotations({
  identifier: "UserAuthConfigInfo",
}) as any as S.Schema<UserAuthConfigInfo>;
export type UserAuthConfigInfoList = UserAuthConfigInfo[];
export const UserAuthConfigInfoList = S.Array(UserAuthConfigInfo);
export interface DBProxy {
  DBProxyName?: string;
  DBProxyArn?: string;
  Status?: DBProxyStatus;
  EngineFamily?: string;
  VpcId?: string;
  VpcSecurityGroupIds?: string[];
  VpcSubnetIds?: string[];
  DefaultAuthScheme?: string;
  Auth?: UserAuthConfigInfo[];
  RoleArn?: string;
  Endpoint?: string;
  RequireTLS?: boolean;
  IdleClientTimeout?: number;
  DebugLogging?: boolean;
  CreatedDate?: Date;
  UpdatedDate?: Date;
  EndpointNetworkType?: EndpointNetworkType;
  TargetConnectionNetworkType?: TargetConnectionNetworkType;
}
export const DBProxy = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    DBProxyArn: S.optional(S.String),
    Status: S.optional(DBProxyStatus),
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
    EndpointNetworkType: S.optional(EndpointNetworkType),
    TargetConnectionNetworkType: S.optional(TargetConnectionNetworkType),
  }),
).annotations({ identifier: "DBProxy" }) as any as S.Schema<DBProxy>;
export type DBProxyList = DBProxy[];
export const DBProxyList = S.Array(DBProxy);
export type DBProxyEndpointStatus =
  | "available"
  | "modifying"
  | "incompatible-network"
  | "insufficient-resource-limits"
  | "creating"
  | "deleting"
  | (string & {});
export const DBProxyEndpointStatus = S.String;
export interface DBProxyEndpoint {
  DBProxyEndpointName?: string;
  DBProxyEndpointArn?: string;
  DBProxyName?: string;
  Status?: DBProxyEndpointStatus;
  VpcId?: string;
  VpcSecurityGroupIds?: string[];
  VpcSubnetIds?: string[];
  Endpoint?: string;
  CreatedDate?: Date;
  TargetRole?: DBProxyEndpointTargetRole;
  IsDefault?: boolean;
  EndpointNetworkType?: EndpointNetworkType;
}
export const DBProxyEndpoint = S.suspend(() =>
  S.Struct({
    DBProxyEndpointName: S.optional(S.String),
    DBProxyEndpointArn: S.optional(S.String),
    DBProxyName: S.optional(S.String),
    Status: S.optional(DBProxyEndpointStatus),
    VpcId: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(StringList),
    VpcSubnetIds: S.optional(StringList),
    Endpoint: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TargetRole: S.optional(DBProxyEndpointTargetRole),
    IsDefault: S.optional(S.Boolean),
    EndpointNetworkType: S.optional(EndpointNetworkType),
  }),
).annotations({
  identifier: "DBProxyEndpoint",
}) as any as S.Schema<DBProxyEndpoint>;
export type DBProxyEndpointList = DBProxyEndpoint[];
export const DBProxyEndpointList = S.Array(DBProxyEndpoint);
export interface EC2SecurityGroup {
  Status?: string;
  EC2SecurityGroupName?: string;
  EC2SecurityGroupId?: string;
  EC2SecurityGroupOwnerId?: string;
}
export const EC2SecurityGroup = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
    EC2SecurityGroupId: S.optional(S.String),
    EC2SecurityGroupOwnerId: S.optional(S.String),
  }),
).annotations({
  identifier: "EC2SecurityGroup",
}) as any as S.Schema<EC2SecurityGroup>;
export type EC2SecurityGroupList = EC2SecurityGroup[];
export const EC2SecurityGroupList = S.Array(
  EC2SecurityGroup.pipe(T.XmlName("EC2SecurityGroup")).annotations({
    identifier: "EC2SecurityGroup",
  }),
);
export interface IPRange {
  Status?: string;
  CIDRIP?: string;
}
export const IPRange = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String), CIDRIP: S.optional(S.String) }),
).annotations({ identifier: "IPRange" }) as any as S.Schema<IPRange>;
export type IPRangeList = IPRange[];
export const IPRangeList = S.Array(
  IPRange.pipe(T.XmlName("IPRange")).annotations({ identifier: "IPRange" }),
);
export interface DBSecurityGroup {
  OwnerId?: string;
  DBSecurityGroupName?: string;
  DBSecurityGroupDescription?: string;
  VpcId?: string;
  EC2SecurityGroups?: EC2SecurityGroup[];
  IPRanges?: IPRange[];
  DBSecurityGroupArn?: string;
}
export const DBSecurityGroup = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    DBSecurityGroupName: S.optional(S.String),
    DBSecurityGroupDescription: S.optional(S.String),
    VpcId: S.optional(S.String),
    EC2SecurityGroups: S.optional(EC2SecurityGroupList),
    IPRanges: S.optional(IPRangeList),
    DBSecurityGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DBSecurityGroup",
}) as any as S.Schema<DBSecurityGroup>;
export type DBSecurityGroups = DBSecurityGroup[];
export const DBSecurityGroups = S.Array(
  DBSecurityGroup.pipe(T.XmlName("DBSecurityGroup")).annotations({
    identifier: "DBSecurityGroup",
  }),
);
export interface DBShardGroup {
  DBShardGroupResourceId?: string;
  DBShardGroupIdentifier?: string;
  DBClusterIdentifier?: string;
  MaxACU?: number;
  MinACU?: number;
  ComputeRedundancy?: number;
  Status?: string;
  PubliclyAccessible?: boolean;
  Endpoint?: string;
  DBShardGroupArn?: string;
  TagList?: Tag[];
}
export const DBShardGroup = S.suspend(() =>
  S.Struct({
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
  }).pipe(ns),
).annotations({ identifier: "DBShardGroup" }) as any as S.Schema<DBShardGroup>;
export type DBShardGroupsList = DBShardGroup[];
export const DBShardGroupsList = S.Array(
  DBShardGroup.pipe(T.XmlName("DBShardGroup")).annotations({
    identifier: "DBShardGroup",
  }),
);
export interface DBSnapshot {
  DBSnapshotIdentifier?: string;
  DBInstanceIdentifier?: string;
  SnapshotCreateTime?: Date;
  Engine?: string;
  AllocatedStorage?: number;
  Status?: string;
  Port?: number;
  AvailabilityZone?: string;
  VpcId?: string;
  InstanceCreateTime?: Date;
  MasterUsername?: string;
  EngineVersion?: string;
  LicenseModel?: string;
  SnapshotType?: string;
  Iops?: number;
  StorageThroughput?: number;
  OptionGroupName?: string;
  PercentProgress?: number;
  SourceRegion?: string;
  SourceDBSnapshotIdentifier?: string;
  StorageType?: string;
  TdeCredentialArn?: string;
  Encrypted?: boolean;
  KmsKeyId?: string;
  DBSnapshotArn?: string;
  Timezone?: string;
  IAMDatabaseAuthenticationEnabled?: boolean;
  ProcessorFeatures?: ProcessorFeature[];
  DbiResourceId?: string;
  TagList?: Tag[];
  SnapshotTarget?: string;
  OriginalSnapshotCreateTime?: Date;
  SnapshotDatabaseTime?: Date;
  DBSystemId?: string;
  MultiTenant?: boolean;
  DedicatedLogVolume?: boolean;
  SnapshotAvailabilityZone?: string;
  AdditionalStorageVolumes?: AdditionalStorageVolume[];
}
export const DBSnapshot = S.suspend(() =>
  S.Struct({
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
    SnapshotDatabaseTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    DBSystemId: S.optional(S.String),
    MultiTenant: S.optional(S.Boolean),
    DedicatedLogVolume: S.optional(S.Boolean),
    SnapshotAvailabilityZone: S.optional(S.String),
    AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
  }),
).annotations({ identifier: "DBSnapshot" }) as any as S.Schema<DBSnapshot>;
export type DBSnapshotList = DBSnapshot[];
export const DBSnapshotList = S.Array(
  DBSnapshot.pipe(T.XmlName("DBSnapshot")).annotations({
    identifier: "DBSnapshot",
  }),
);
export type DBSubnetGroups = DBSubnetGroup[];
export const DBSubnetGroups = S.Array(
  DBSubnetGroup.pipe(T.XmlName("DBSubnetGroup")).annotations({
    identifier: "DBSubnetGroup",
  }),
);
export interface EventSubscription {
  CustomerAwsId?: string;
  CustSubscriptionId?: string;
  SnsTopicArn?: string;
  Status?: string;
  SubscriptionCreationTime?: string;
  SourceType?: string;
  SourceIdsList?: string[];
  EventCategoriesList?: string[];
  Enabled?: boolean;
  EventSubscriptionArn?: string;
}
export const EventSubscription = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "EventSubscription",
}) as any as S.Schema<EventSubscription>;
export type EventSubscriptionsList = EventSubscription[];
export const EventSubscriptionsList = S.Array(
  EventSubscription.pipe(T.XmlName("EventSubscription")).annotations({
    identifier: "EventSubscription",
  }),
);
export interface ExportTask {
  ExportTaskIdentifier?: string;
  SourceArn?: string;
  ExportOnly?: string[];
  SnapshotTime?: Date;
  TaskStartTime?: Date;
  TaskEndTime?: Date;
  S3Bucket?: string;
  S3Prefix?: string;
  IamRoleArn?: string;
  KmsKeyId?: string;
  Status?: string;
  PercentProgress?: number;
  TotalExtractedDataInGB?: number;
  FailureCause?: string;
  WarningMessage?: string;
  SourceType?: ExportSourceType;
}
export const ExportTask = S.suspend(() =>
  S.Struct({
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
    SourceType: S.optional(ExportSourceType),
  }).pipe(ns),
).annotations({ identifier: "ExportTask" }) as any as S.Schema<ExportTask>;
export type ExportTasksList = ExportTask[];
export const ExportTasksList = S.Array(
  ExportTask.pipe(T.XmlName("ExportTask")).annotations({
    identifier: "ExportTask",
  }),
);
export type ReadersArnList = string[];
export const ReadersArnList = S.Array(S.String);
export type GlobalClusterMemberSynchronizationStatus =
  | "connected"
  | "pending-resync"
  | (string & {});
export const GlobalClusterMemberSynchronizationStatus = S.String;
export interface GlobalClusterMember {
  DBClusterArn?: string;
  Readers?: string[];
  IsWriter?: boolean;
  GlobalWriteForwardingStatus?: WriteForwardingStatus;
  SynchronizationStatus?: GlobalClusterMemberSynchronizationStatus;
}
export const GlobalClusterMember = S.suspend(() =>
  S.Struct({
    DBClusterArn: S.optional(S.String),
    Readers: S.optional(ReadersArnList),
    IsWriter: S.optional(S.Boolean),
    GlobalWriteForwardingStatus: S.optional(WriteForwardingStatus),
    SynchronizationStatus: S.optional(GlobalClusterMemberSynchronizationStatus),
  }),
).annotations({
  identifier: "GlobalClusterMember",
}) as any as S.Schema<GlobalClusterMember>;
export type GlobalClusterMemberList = GlobalClusterMember[];
export const GlobalClusterMemberList = S.Array(
  GlobalClusterMember.pipe(T.XmlName("GlobalClusterMember")).annotations({
    identifier: "GlobalClusterMember",
  }),
);
export type FailoverStatus =
  | "pending"
  | "failing-over"
  | "cancelling"
  | (string & {});
export const FailoverStatus = S.String;
export interface FailoverState {
  Status?: FailoverStatus;
  FromDbClusterArn?: string;
  ToDbClusterArn?: string;
  IsDataLossAllowed?: boolean;
}
export const FailoverState = S.suspend(() =>
  S.Struct({
    Status: S.optional(FailoverStatus),
    FromDbClusterArn: S.optional(S.String),
    ToDbClusterArn: S.optional(S.String),
    IsDataLossAllowed: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FailoverState",
}) as any as S.Schema<FailoverState>;
export interface GlobalCluster {
  GlobalClusterIdentifier?: string;
  GlobalClusterResourceId?: string;
  GlobalClusterArn?: string;
  Status?: string;
  Engine?: string;
  EngineVersion?: string;
  EngineLifecycleSupport?: string;
  DatabaseName?: string;
  StorageEncrypted?: boolean;
  DeletionProtection?: boolean;
  GlobalClusterMembers?: GlobalClusterMember[];
  Endpoint?: string;
  FailoverState?: FailoverState;
  TagList?: Tag[];
}
export const GlobalCluster = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GlobalCluster",
}) as any as S.Schema<GlobalCluster>;
export type GlobalClusterList = GlobalCluster[];
export const GlobalClusterList = S.Array(
  GlobalCluster.pipe(T.XmlName("GlobalClusterMember")).annotations({
    identifier: "GlobalCluster",
  }),
);
export interface IntegrationError {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const IntegrationError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "IntegrationError",
}) as any as S.Schema<IntegrationError>;
export type IntegrationErrorList = IntegrationError[];
export const IntegrationErrorList = S.Array(
  IntegrationError.pipe(T.XmlName("IntegrationError")).annotations({
    identifier: "IntegrationError",
  }),
);
export interface Integration {
  SourceArn?: string;
  TargetArn?: string;
  IntegrationName?: string;
  IntegrationArn?: string;
  KMSKeyId?: string;
  AdditionalEncryptionContext?: { [key: string]: string | undefined };
  Status?: IntegrationStatus;
  Tags?: Tag[];
  DataFilter?: string;
  Description?: string;
  CreateTime?: Date;
  Errors?: (IntegrationError & { ErrorCode: string })[];
}
export const Integration = S.suspend(() =>
  S.Struct({
    SourceArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    IntegrationName: S.optional(S.String),
    IntegrationArn: S.optional(S.String),
    KMSKeyId: S.optional(S.String),
    AdditionalEncryptionContext: S.optional(EncryptionContextMap),
    Status: S.optional(IntegrationStatus),
    Tags: S.optional(TagList),
    DataFilter: S.optional(S.String),
    Description: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Errors: S.optional(IntegrationErrorList),
  }).pipe(ns),
).annotations({ identifier: "Integration" }) as any as S.Schema<Integration>;
export type IntegrationList = Integration[];
export const IntegrationList = S.Array(
  Integration.pipe(T.XmlName("Integration")).annotations({
    identifier: "Integration",
  }),
);
export interface OptionSetting {
  Name?: string;
  Value?: string | redacted.Redacted<string>;
  DefaultValue?: string;
  Description?: string;
  ApplyType?: string;
  DataType?: string;
  AllowedValues?: string;
  IsModifiable?: boolean;
  IsCollection?: boolean;
}
export const OptionSetting = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Value: S.optional(SensitiveString),
    DefaultValue: S.optional(S.String),
    Description: S.optional(S.String),
    ApplyType: S.optional(S.String),
    DataType: S.optional(S.String),
    AllowedValues: S.optional(S.String),
    IsModifiable: S.optional(S.Boolean),
    IsCollection: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "OptionSetting",
}) as any as S.Schema<OptionSetting>;
export type OptionSettingConfigurationList = OptionSetting[];
export const OptionSettingConfigurationList = S.Array(
  OptionSetting.pipe(T.XmlName("OptionSetting")).annotations({
    identifier: "OptionSetting",
  }),
);
export interface Option {
  OptionName?: string;
  OptionDescription?: string;
  Persistent?: boolean;
  Permanent?: boolean;
  Port?: number;
  OptionVersion?: string;
  OptionSettings?: OptionSetting[];
  DBSecurityGroupMemberships?: DBSecurityGroupMembership[];
  VpcSecurityGroupMemberships?: VpcSecurityGroupMembership[];
}
export const Option = S.suspend(() =>
  S.Struct({
    OptionName: S.optional(S.String),
    OptionDescription: S.optional(S.String),
    Persistent: S.optional(S.Boolean),
    Permanent: S.optional(S.Boolean),
    Port: S.optional(S.Number),
    OptionVersion: S.optional(S.String),
    OptionSettings: S.optional(OptionSettingConfigurationList),
    DBSecurityGroupMemberships: S.optional(DBSecurityGroupMembershipList),
    VpcSecurityGroupMemberships: S.optional(VpcSecurityGroupMembershipList),
  }),
).annotations({ identifier: "Option" }) as any as S.Schema<Option>;
export type OptionsList = Option[];
export const OptionsList = S.Array(
  Option.pipe(T.XmlName("Option")).annotations({ identifier: "Option" }),
);
export interface OptionGroup {
  OptionGroupName?: string;
  OptionGroupDescription?: string;
  EngineName?: string;
  MajorEngineVersion?: string;
  Options?: Option[];
  AllowsVpcAndNonVpcInstanceMemberships?: boolean;
  VpcId?: string;
  OptionGroupArn?: string;
  SourceOptionGroup?: string;
  SourceAccountId?: string;
  CopyTimestamp?: Date;
}
export const OptionGroup = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "OptionGroup" }) as any as S.Schema<OptionGroup>;
export type OptionGroupsList = OptionGroup[];
export const OptionGroupsList = S.Array(
  OptionGroup.pipe(T.XmlName("OptionGroup")).annotations({
    identifier: "OptionGroup",
  }),
);
export interface PendingMaintenanceAction {
  Action?: string;
  AutoAppliedAfterDate?: Date;
  ForcedApplyDate?: Date;
  OptInStatus?: string;
  CurrentApplyDate?: Date;
  Description?: string;
}
export const PendingMaintenanceAction = S.suspend(() =>
  S.Struct({
    Action: S.optional(S.String),
    AutoAppliedAfterDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ForcedApplyDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OptInStatus: S.optional(S.String),
    CurrentApplyDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "PendingMaintenanceAction",
}) as any as S.Schema<PendingMaintenanceAction>;
export type PendingMaintenanceActionDetails = PendingMaintenanceAction[];
export const PendingMaintenanceActionDetails = S.Array(
  PendingMaintenanceAction.pipe(
    T.XmlName("PendingMaintenanceAction"),
  ).annotations({ identifier: "PendingMaintenanceAction" }),
);
export interface ResourcePendingMaintenanceActions {
  ResourceIdentifier?: string;
  PendingMaintenanceActionDetails?: PendingMaintenanceAction[];
}
export const ResourcePendingMaintenanceActions = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.optional(S.String),
    PendingMaintenanceActionDetails: S.optional(
      PendingMaintenanceActionDetails,
    ),
  }),
).annotations({
  identifier: "ResourcePendingMaintenanceActions",
}) as any as S.Schema<ResourcePendingMaintenanceActions>;
export type PendingMaintenanceActions = ResourcePendingMaintenanceActions[];
export const PendingMaintenanceActions = S.Array(
  ResourcePendingMaintenanceActions.pipe(
    T.XmlName("ResourcePendingMaintenanceActions"),
  ).annotations({ identifier: "ResourcePendingMaintenanceActions" }),
);
export interface TenantDatabasePendingModifiedValues {
  MasterUserPassword?: string | redacted.Redacted<string>;
  TenantDBName?: string;
}
export const TenantDatabasePendingModifiedValues = S.suspend(() =>
  S.Struct({
    MasterUserPassword: S.optional(SensitiveString),
    TenantDBName: S.optional(S.String),
  }),
).annotations({
  identifier: "TenantDatabasePendingModifiedValues",
}) as any as S.Schema<TenantDatabasePendingModifiedValues>;
export interface TenantDatabase {
  TenantDatabaseCreateTime?: Date;
  DBInstanceIdentifier?: string;
  TenantDBName?: string;
  Status?: string;
  MasterUsername?: string;
  DbiResourceId?: string;
  TenantDatabaseResourceId?: string;
  TenantDatabaseARN?: string;
  CharacterSetName?: string;
  NcharCharacterSetName?: string;
  DeletionProtection?: boolean;
  PendingModifiedValues?: TenantDatabasePendingModifiedValues;
  MasterUserSecret?: MasterUserSecret;
  TagList?: Tag[];
}
export const TenantDatabase = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "TenantDatabase",
}) as any as S.Schema<TenantDatabase>;
export type TenantDatabasesList = TenantDatabase[];
export const TenantDatabasesList = S.Array(
  TenantDatabase.pipe(T.XmlName("TenantDatabase")).annotations({
    identifier: "TenantDatabase",
  }),
);
export interface CloudwatchLogsExportConfiguration {
  EnableLogTypes?: string[];
  DisableLogTypes?: string[];
}
export const CloudwatchLogsExportConfiguration = S.suspend(() =>
  S.Struct({
    EnableLogTypes: S.optional(LogTypeList),
    DisableLogTypes: S.optional(LogTypeList),
  }),
).annotations({
  identifier: "CloudwatchLogsExportConfiguration",
}) as any as S.Schema<CloudwatchLogsExportConfiguration>;
export interface ModifyAdditionalStorageVolume {
  VolumeName?: string;
  AllocatedStorage?: number;
  IOPS?: number;
  MaxAllocatedStorage?: number;
  StorageThroughput?: number;
  StorageType?: string;
  SetForDelete?: boolean;
}
export const ModifyAdditionalStorageVolume = S.suspend(() =>
  S.Struct({
    VolumeName: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    IOPS: S.optional(S.Number),
    MaxAllocatedStorage: S.optional(S.Number),
    StorageThroughput: S.optional(S.Number),
    StorageType: S.optional(S.String),
    SetForDelete: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ModifyAdditionalStorageVolume",
}) as any as S.Schema<ModifyAdditionalStorageVolume>;
export type ModifyAdditionalStorageVolumesList =
  ModifyAdditionalStorageVolume[];
export const ModifyAdditionalStorageVolumesList = S.Array(
  ModifyAdditionalStorageVolume,
);
export interface ConnectionPoolConfiguration {
  MaxConnectionsPercent?: number;
  MaxIdleConnectionsPercent?: number;
  ConnectionBorrowTimeout?: number;
  SessionPinningFilters?: string[];
  InitQuery?: string;
}
export const ConnectionPoolConfiguration = S.suspend(() =>
  S.Struct({
    MaxConnectionsPercent: S.optional(S.Number),
    MaxIdleConnectionsPercent: S.optional(S.Number),
    ConnectionBorrowTimeout: S.optional(S.Number),
    SessionPinningFilters: S.optional(StringList),
    InitQuery: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectionPoolConfiguration",
}) as any as S.Schema<ConnectionPoolConfiguration>;
export interface RecommendedActionUpdate {
  ActionId?: string;
  Status?: string;
}
export const RecommendedActionUpdate = S.suspend(() =>
  S.Struct({ ActionId: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "RecommendedActionUpdate",
}) as any as S.Schema<RecommendedActionUpdate>;
export type RecommendedActionUpdateList = RecommendedActionUpdate[];
export const RecommendedActionUpdateList = S.Array(RecommendedActionUpdate);
export interface AddTagsToResourceMessage {
  ResourceName?: string;
  Tags?: Tag[];
}
export const AddTagsToResourceMessage = S.suspend(() =>
  S.Struct({
    ResourceName: S.optional(S.String),
    Tags: S.optional(TagList),
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
  identifier: "AddTagsToResourceMessage",
}) as any as S.Schema<AddTagsToResourceMessage>;
export interface AddTagsToResourceResponse {}
export const AddTagsToResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddTagsToResourceResponse",
}) as any as S.Schema<AddTagsToResourceResponse>;
export interface CreateDBClusterMessage {
  AvailabilityZones?: string[];
  BackupRetentionPeriod?: number;
  CharacterSetName?: string;
  DatabaseName?: string;
  DBClusterIdentifier?: string;
  DBClusterParameterGroupName?: string;
  VpcSecurityGroupIds?: string[];
  DBSubnetGroupName?: string;
  Engine?: string;
  EngineVersion?: string;
  Port?: number;
  MasterUsername?: string;
  MasterUserPassword?: string | redacted.Redacted<string>;
  OptionGroupName?: string;
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  ReplicationSourceIdentifier?: string;
  Tags?: Tag[];
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  PreSignedUrl?: string | redacted.Redacted<string>;
  EnableIAMDatabaseAuthentication?: boolean;
  BacktrackWindow?: number;
  EnableCloudwatchLogsExports?: string[];
  EngineMode?: string;
  ScalingConfiguration?: ScalingConfiguration;
  RdsCustomClusterConfiguration?: RdsCustomClusterConfiguration;
  DBClusterInstanceClass?: string;
  AllocatedStorage?: number;
  StorageType?: string;
  Iops?: number;
  PubliclyAccessible?: boolean;
  AutoMinorVersionUpgrade?: boolean;
  DeletionProtection?: boolean;
  GlobalClusterIdentifier?: string;
  EnableHttpEndpoint?: boolean;
  CopyTagsToSnapshot?: boolean;
  Domain?: string;
  DomainIAMRoleName?: string;
  EnableGlobalWriteForwarding?: boolean;
  NetworkType?: string;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  DatabaseInsightsMode?: DatabaseInsightsMode;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  EnableLimitlessDatabase?: boolean;
  ClusterScalabilityType?: ClusterScalabilityType;
  DBSystemId?: string;
  ManageMasterUserPassword?: boolean;
  EnableLocalWriteForwarding?: boolean;
  MasterUserSecretKmsKeyId?: string;
  CACertificateIdentifier?: string;
  EngineLifecycleSupport?: string;
  TagSpecifications?: TagSpecification[];
  MasterUserAuthenticationType?: MasterUserAuthenticationType;
}
export const CreateDBClusterMessage = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    BackupRetentionPeriod: S.optional(S.Number),
    CharacterSetName: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    DBSubnetGroupName: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(SensitiveString),
    OptionGroupName: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    ReplicationSourceIdentifier: S.optional(S.String),
    Tags: S.optional(TagList),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(SensitiveString),
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
    DatabaseInsightsMode: S.optional(DatabaseInsightsMode),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    PerformanceInsightsRetentionPeriod: S.optional(S.Number),
    EnableLimitlessDatabase: S.optional(S.Boolean),
    ClusterScalabilityType: S.optional(ClusterScalabilityType),
    DBSystemId: S.optional(S.String),
    ManageMasterUserPassword: S.optional(S.Boolean),
    EnableLocalWriteForwarding: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
    EngineLifecycleSupport: S.optional(S.String),
    TagSpecifications: S.optional(TagSpecificationList),
    MasterUserAuthenticationType: S.optional(MasterUserAuthenticationType),
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
  identifier: "CreateDBClusterMessage",
}) as any as S.Schema<CreateDBClusterMessage>;
export interface CreateDBClusterParameterGroupResult {
  DBClusterParameterGroup?: DBClusterParameterGroup;
}
export const CreateDBClusterParameterGroupResult = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroup: S.optional(DBClusterParameterGroup),
  }).pipe(ns),
).annotations({
  identifier: "CreateDBClusterParameterGroupResult",
}) as any as S.Schema<CreateDBClusterParameterGroupResult>;
export interface CreateDBClusterSnapshotResult {
  DBClusterSnapshot?: DBClusterSnapshot;
}
export const CreateDBClusterSnapshotResult = S.suspend(() =>
  S.Struct({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }).pipe(ns),
).annotations({
  identifier: "CreateDBClusterSnapshotResult",
}) as any as S.Schema<CreateDBClusterSnapshotResult>;
export interface CreateDBInstanceMessage {
  DBName?: string;
  DBInstanceIdentifier?: string;
  AllocatedStorage?: number;
  DBInstanceClass?: string;
  Engine?: string;
  MasterUsername?: string;
  MasterUserPassword?: string | redacted.Redacted<string>;
  DBSecurityGroups?: string[];
  VpcSecurityGroupIds?: string[];
  AvailabilityZone?: string;
  DBSubnetGroupName?: string;
  PreferredMaintenanceWindow?: string;
  DBParameterGroupName?: string;
  BackupRetentionPeriod?: number;
  PreferredBackupWindow?: string;
  Port?: number;
  MultiAZ?: boolean;
  EngineVersion?: string;
  AutoMinorVersionUpgrade?: boolean;
  LicenseModel?: string;
  Iops?: number;
  StorageThroughput?: number;
  OptionGroupName?: string;
  CharacterSetName?: string;
  NcharCharacterSetName?: string;
  PubliclyAccessible?: boolean;
  Tags?: Tag[];
  DBClusterIdentifier?: string;
  StorageType?: string;
  TdeCredentialArn?: string;
  TdeCredentialPassword?: string | redacted.Redacted<string>;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  Domain?: string;
  DomainFqdn?: string;
  DomainOu?: string;
  DomainAuthSecretArn?: string;
  DomainDnsIps?: string[];
  CopyTagsToSnapshot?: boolean;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  DomainIAMRoleName?: string;
  PromotionTier?: number;
  Timezone?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  DatabaseInsightsMode?: DatabaseInsightsMode;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  EnableCloudwatchLogsExports?: string[];
  ProcessorFeatures?: ProcessorFeature[];
  DeletionProtection?: boolean;
  MaxAllocatedStorage?: number;
  EnableCustomerOwnedIp?: boolean;
  NetworkType?: string;
  BackupTarget?: string;
  CustomIamInstanceProfile?: string;
  DBSystemId?: string;
  CACertificateIdentifier?: string;
  ManageMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
  MultiTenant?: boolean;
  DedicatedLogVolume?: boolean;
  EngineLifecycleSupport?: string;
  TagSpecifications?: TagSpecification[];
  MasterUserAuthenticationType?: MasterUserAuthenticationType;
  AdditionalStorageVolumes?: AdditionalStorageVolume[];
}
export const CreateDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBName: S.optional(S.String),
    DBInstanceIdentifier: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    DBInstanceClass: S.optional(S.String),
    Engine: S.optional(S.String),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(SensitiveString),
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
    TdeCredentialPassword: S.optional(SensitiveString),
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
    DatabaseInsightsMode: S.optional(DatabaseInsightsMode),
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
    MasterUserAuthenticationType: S.optional(MasterUserAuthenticationType),
    AdditionalStorageVolumes: S.optional(AdditionalStorageVolumesList),
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
  identifier: "CreateDBInstanceMessage",
}) as any as S.Schema<CreateDBInstanceMessage>;
export interface CreateDBParameterGroupResult {
  DBParameterGroup?: DBParameterGroup;
}
export const CreateDBParameterGroupResult = S.suspend(() =>
  S.Struct({ DBParameterGroup: S.optional(DBParameterGroup) }).pipe(ns),
).annotations({
  identifier: "CreateDBParameterGroupResult",
}) as any as S.Schema<CreateDBParameterGroupResult>;
export interface CreateDBProxyRequest {
  DBProxyName?: string;
  EngineFamily?: EngineFamily;
  DefaultAuthScheme?: DefaultAuthScheme;
  Auth?: UserAuthConfig[];
  RoleArn?: string;
  VpcSubnetIds?: string[];
  VpcSecurityGroupIds?: string[];
  RequireTLS?: boolean;
  IdleClientTimeout?: number;
  DebugLogging?: boolean;
  Tags?: Tag[];
  EndpointNetworkType?: EndpointNetworkType;
  TargetConnectionNetworkType?: TargetConnectionNetworkType;
}
export const CreateDBProxyRequest = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    EngineFamily: S.optional(EngineFamily),
    DefaultAuthScheme: S.optional(DefaultAuthScheme),
    Auth: S.optional(UserAuthConfigList),
    RoleArn: S.optional(S.String),
    VpcSubnetIds: S.optional(StringList),
    VpcSecurityGroupIds: S.optional(StringList),
    RequireTLS: S.optional(S.Boolean),
    IdleClientTimeout: S.optional(S.Number),
    DebugLogging: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    EndpointNetworkType: S.optional(EndpointNetworkType),
    TargetConnectionNetworkType: S.optional(TargetConnectionNetworkType),
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
  identifier: "CreateDBProxyRequest",
}) as any as S.Schema<CreateDBProxyRequest>;
export interface CreateDBSecurityGroupResult {
  DBSecurityGroup?: DBSecurityGroup;
}
export const CreateDBSecurityGroupResult = S.suspend(() =>
  S.Struct({ DBSecurityGroup: S.optional(DBSecurityGroup) }).pipe(ns),
).annotations({
  identifier: "CreateDBSecurityGroupResult",
}) as any as S.Schema<CreateDBSecurityGroupResult>;
export interface CreateDBSnapshotResult {
  DBSnapshot?: DBSnapshot & {
    AdditionalStorageVolumes: (AdditionalStorageVolume & {
      VolumeName: string;
    })[];
  };
}
export const CreateDBSnapshotResult = S.suspend(() =>
  S.Struct({ DBSnapshot: S.optional(DBSnapshot) }).pipe(ns),
).annotations({
  identifier: "CreateDBSnapshotResult",
}) as any as S.Schema<CreateDBSnapshotResult>;
export interface CreateEventSubscriptionResult {
  EventSubscription?: EventSubscription;
}
export const CreateEventSubscriptionResult = S.suspend(() =>
  S.Struct({ EventSubscription: S.optional(EventSubscription) }).pipe(ns),
).annotations({
  identifier: "CreateEventSubscriptionResult",
}) as any as S.Schema<CreateEventSubscriptionResult>;
export interface CreateIntegrationMessage {
  SourceArn?: string;
  TargetArn?: string;
  IntegrationName?: string;
  KMSKeyId?: string;
  AdditionalEncryptionContext?: { [key: string]: string | undefined };
  Tags?: Tag[];
  DataFilter?: string;
  Description?: string;
}
export const CreateIntegrationMessage = S.suspend(() =>
  S.Struct({
    SourceArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    IntegrationName: S.optional(S.String),
    KMSKeyId: S.optional(S.String),
    AdditionalEncryptionContext: S.optional(EncryptionContextMap),
    Tags: S.optional(TagList),
    DataFilter: S.optional(S.String),
    Description: S.optional(S.String),
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
  identifier: "CreateIntegrationMessage",
}) as any as S.Schema<CreateIntegrationMessage>;
export interface CreateOptionGroupResult {
  OptionGroup?: OptionGroup;
}
export const CreateOptionGroupResult = S.suspend(() =>
  S.Struct({ OptionGroup: S.optional(OptionGroup) }).pipe(ns),
).annotations({
  identifier: "CreateOptionGroupResult",
}) as any as S.Schema<CreateOptionGroupResult>;
export interface SwitchoverDetail {
  SourceMember?: string;
  TargetMember?: string;
  Status?: string;
}
export const SwitchoverDetail = S.suspend(() =>
  S.Struct({
    SourceMember: S.optional(S.String),
    TargetMember: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "SwitchoverDetail",
}) as any as S.Schema<SwitchoverDetail>;
export type SwitchoverDetailList = SwitchoverDetail[];
export const SwitchoverDetailList = S.Array(SwitchoverDetail);
export interface BlueGreenDeploymentTask {
  Name?: string;
  Status?: string;
}
export const BlueGreenDeploymentTask = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "BlueGreenDeploymentTask",
}) as any as S.Schema<BlueGreenDeploymentTask>;
export type BlueGreenDeploymentTaskList = BlueGreenDeploymentTask[];
export const BlueGreenDeploymentTaskList = S.Array(BlueGreenDeploymentTask);
export interface BlueGreenDeployment {
  BlueGreenDeploymentIdentifier?: string;
  BlueGreenDeploymentName?: string;
  Source?: string;
  Target?: string;
  SwitchoverDetails?: SwitchoverDetail[];
  Tasks?: BlueGreenDeploymentTask[];
  Status?: string;
  StatusDetails?: string;
  CreateTime?: Date;
  DeleteTime?: Date;
  TagList?: Tag[];
}
export const BlueGreenDeployment = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BlueGreenDeployment",
}) as any as S.Schema<BlueGreenDeployment>;
export interface DeleteBlueGreenDeploymentResponse {
  BlueGreenDeployment?: BlueGreenDeployment;
}
export const DeleteBlueGreenDeploymentResponse = S.suspend(() =>
  S.Struct({ BlueGreenDeployment: S.optional(BlueGreenDeployment) }).pipe(ns),
).annotations({
  identifier: "DeleteBlueGreenDeploymentResponse",
}) as any as S.Schema<DeleteBlueGreenDeploymentResponse>;
export interface DeleteDBClusterSnapshotResult {
  DBClusterSnapshot?: DBClusterSnapshot;
}
export const DeleteDBClusterSnapshotResult = S.suspend(() =>
  S.Struct({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }).pipe(ns),
).annotations({
  identifier: "DeleteDBClusterSnapshotResult",
}) as any as S.Schema<DeleteDBClusterSnapshotResult>;
export interface DeleteDBInstanceResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const DeleteDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "DeleteDBInstanceResult",
}) as any as S.Schema<DeleteDBInstanceResult>;
export interface DeleteDBProxyEndpointResponse {
  DBProxyEndpoint?: DBProxyEndpoint;
}
export const DeleteDBProxyEndpointResponse = S.suspend(() =>
  S.Struct({ DBProxyEndpoint: S.optional(DBProxyEndpoint) }).pipe(ns),
).annotations({
  identifier: "DeleteDBProxyEndpointResponse",
}) as any as S.Schema<DeleteDBProxyEndpointResponse>;
export interface DeleteDBSnapshotResult {
  DBSnapshot?: DBSnapshot & {
    AdditionalStorageVolumes: (AdditionalStorageVolume & {
      VolumeName: string;
    })[];
  };
}
export const DeleteDBSnapshotResult = S.suspend(() =>
  S.Struct({ DBSnapshot: S.optional(DBSnapshot) }).pipe(ns),
).annotations({
  identifier: "DeleteDBSnapshotResult",
}) as any as S.Schema<DeleteDBSnapshotResult>;
export interface DeleteEventSubscriptionResult {
  EventSubscription?: EventSubscription;
}
export const DeleteEventSubscriptionResult = S.suspend(() =>
  S.Struct({ EventSubscription: S.optional(EventSubscription) }).pipe(ns),
).annotations({
  identifier: "DeleteEventSubscriptionResult",
}) as any as S.Schema<DeleteEventSubscriptionResult>;
export interface DeleteGlobalClusterResult {
  GlobalCluster?: GlobalCluster;
}
export const DeleteGlobalClusterResult = S.suspend(() =>
  S.Struct({ GlobalCluster: S.optional(GlobalCluster) }).pipe(ns),
).annotations({
  identifier: "DeleteGlobalClusterResult",
}) as any as S.Schema<DeleteGlobalClusterResult>;
export interface DeleteTenantDatabaseResult {
  TenantDatabase?: TenantDatabase;
}
export const DeleteTenantDatabaseResult = S.suspend(() =>
  S.Struct({ TenantDatabase: S.optional(TenantDatabase) }).pipe(ns),
).annotations({
  identifier: "DeleteTenantDatabaseResult",
}) as any as S.Schema<DeleteTenantDatabaseResult>;
export interface AccountAttributesMessage {
  AccountQuotas?: AccountQuota[];
}
export const AccountAttributesMessage = S.suspend(() =>
  S.Struct({ AccountQuotas: S.optional(AccountQuotaList) }).pipe(ns),
).annotations({
  identifier: "AccountAttributesMessage",
}) as any as S.Schema<AccountAttributesMessage>;
export interface DescribeBlueGreenDeploymentsRequest {
  BlueGreenDeploymentIdentifier?: string;
  Filters?: Filter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeBlueGreenDeploymentsRequest = S.suspend(() =>
  S.Struct({
    BlueGreenDeploymentIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
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
  identifier: "DescribeBlueGreenDeploymentsRequest",
}) as any as S.Schema<DescribeBlueGreenDeploymentsRequest>;
export interface DBClusterAutomatedBackupMessage {
  Marker?: string;
  DBClusterAutomatedBackups?: DBClusterAutomatedBackup[];
}
export const DBClusterAutomatedBackupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBClusterAutomatedBackups: S.optional(DBClusterAutomatedBackupList),
  }).pipe(ns),
).annotations({
  identifier: "DBClusterAutomatedBackupMessage",
}) as any as S.Schema<DBClusterAutomatedBackupMessage>;
export interface DBClusterBacktrackMessage {
  Marker?: string;
  DBClusterBacktracks?: DBClusterBacktrack[];
}
export const DBClusterBacktrackMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBClusterBacktracks: S.optional(DBClusterBacktrackList),
  }).pipe(ns),
).annotations({
  identifier: "DBClusterBacktrackMessage",
}) as any as S.Schema<DBClusterBacktrackMessage>;
export interface DBClusterEndpointMessage {
  Marker?: string;
  DBClusterEndpoints?: DBClusterEndpoint[];
}
export const DBClusterEndpointMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBClusterEndpoints: S.optional(DBClusterEndpointList),
  }).pipe(ns),
).annotations({
  identifier: "DBClusterEndpointMessage",
}) as any as S.Schema<DBClusterEndpointMessage>;
export interface DBClusterParameterGroupsMessage {
  Marker?: string;
  DBClusterParameterGroups?: DBClusterParameterGroup[];
}
export const DBClusterParameterGroupsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBClusterParameterGroups: S.optional(DBClusterParameterGroupList),
  }).pipe(ns),
).annotations({
  identifier: "DBClusterParameterGroupsMessage",
}) as any as S.Schema<DBClusterParameterGroupsMessage>;
export interface DBClusterParameterGroupDetails {
  Parameters?: Parameter[];
  Marker?: string;
}
export const DBClusterParameterGroupDetails = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(ParametersList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DBClusterParameterGroupDetails",
}) as any as S.Schema<DBClusterParameterGroupDetails>;
export interface DBClusterMessage {
  Marker?: string;
  DBClusters?: DBCluster[];
}
export const DBClusterMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBClusters: S.optional(DBClusterList),
  }).pipe(ns),
).annotations({
  identifier: "DBClusterMessage",
}) as any as S.Schema<DBClusterMessage>;
export interface DBClusterSnapshotMessage {
  Marker?: string;
  DBClusterSnapshots?: DBClusterSnapshot[];
}
export const DBClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBClusterSnapshots: S.optional(DBClusterSnapshotList),
  }).pipe(ns),
).annotations({
  identifier: "DBClusterSnapshotMessage",
}) as any as S.Schema<DBClusterSnapshotMessage>;
export interface DBEngineVersionMessage {
  Marker?: string;
  DBEngineVersions?: DBEngineVersion[];
}
export const DBEngineVersionMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBEngineVersions: S.optional(DBEngineVersionList),
  }).pipe(ns),
).annotations({
  identifier: "DBEngineVersionMessage",
}) as any as S.Schema<DBEngineVersionMessage>;
export interface DBInstanceAutomatedBackupMessage {
  Marker?: string;
  DBInstanceAutomatedBackups?: (DBInstanceAutomatedBackup & {
    AdditionalStorageVolumes: (AdditionalStorageVolume & {
      VolumeName: string;
    })[];
  })[];
}
export const DBInstanceAutomatedBackupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBInstanceAutomatedBackups: S.optional(DBInstanceAutomatedBackupList),
  }).pipe(ns),
).annotations({
  identifier: "DBInstanceAutomatedBackupMessage",
}) as any as S.Schema<DBInstanceAutomatedBackupMessage>;
export interface DBInstanceMessage {
  Marker?: string;
  DBInstances?: (DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  })[];
}
export const DBInstanceMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBInstances: S.optional(DBInstanceList),
  }).pipe(ns),
).annotations({
  identifier: "DBInstanceMessage",
}) as any as S.Schema<DBInstanceMessage>;
export interface DBParameterGroupsMessage {
  Marker?: string;
  DBParameterGroups?: DBParameterGroup[];
}
export const DBParameterGroupsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBParameterGroups: S.optional(DBParameterGroupList),
  }).pipe(ns),
).annotations({
  identifier: "DBParameterGroupsMessage",
}) as any as S.Schema<DBParameterGroupsMessage>;
export interface DBParameterGroupDetails {
  Parameters?: Parameter[];
  Marker?: string;
}
export const DBParameterGroupDetails = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(ParametersList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DBParameterGroupDetails",
}) as any as S.Schema<DBParameterGroupDetails>;
export interface DescribeDBProxiesResponse {
  DBProxies?: DBProxy[];
  Marker?: string;
}
export const DescribeDBProxiesResponse = S.suspend(() =>
  S.Struct({
    DBProxies: S.optional(DBProxyList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDBProxiesResponse",
}) as any as S.Schema<DescribeDBProxiesResponse>;
export interface DescribeDBProxyEndpointsResponse {
  DBProxyEndpoints?: DBProxyEndpoint[];
  Marker?: string;
}
export const DescribeDBProxyEndpointsResponse = S.suspend(() =>
  S.Struct({
    DBProxyEndpoints: S.optional(DBProxyEndpointList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDBProxyEndpointsResponse",
}) as any as S.Schema<DescribeDBProxyEndpointsResponse>;
export interface DBSecurityGroupMessage {
  Marker?: string;
  DBSecurityGroups?: DBSecurityGroup[];
}
export const DBSecurityGroupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBSecurityGroups: S.optional(DBSecurityGroups),
  }).pipe(ns),
).annotations({
  identifier: "DBSecurityGroupMessage",
}) as any as S.Schema<DBSecurityGroupMessage>;
export interface DescribeDBShardGroupsResponse {
  DBShardGroups?: DBShardGroup[];
  Marker?: string;
}
export const DescribeDBShardGroupsResponse = S.suspend(() =>
  S.Struct({
    DBShardGroups: S.optional(DBShardGroupsList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDBShardGroupsResponse",
}) as any as S.Schema<DescribeDBShardGroupsResponse>;
export interface DBSnapshotMessage {
  Marker?: string;
  DBSnapshots?: (DBSnapshot & {
    AdditionalStorageVolumes: (AdditionalStorageVolume & {
      VolumeName: string;
    })[];
  })[];
}
export const DBSnapshotMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBSnapshots: S.optional(DBSnapshotList),
  }).pipe(ns),
).annotations({
  identifier: "DBSnapshotMessage",
}) as any as S.Schema<DBSnapshotMessage>;
export interface DBSubnetGroupMessage {
  Marker?: string;
  DBSubnetGroups?: DBSubnetGroup[];
}
export const DBSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBSubnetGroups: S.optional(DBSubnetGroups),
  }).pipe(ns),
).annotations({
  identifier: "DBSubnetGroupMessage",
}) as any as S.Schema<DBSubnetGroupMessage>;
export interface EngineDefaults {
  DBParameterGroupFamily?: string;
  Marker?: string;
  Parameters?: Parameter[];
}
export const EngineDefaults = S.suspend(() =>
  S.Struct({
    DBParameterGroupFamily: S.optional(S.String),
    Marker: S.optional(S.String),
    Parameters: S.optional(ParametersList),
  }),
).annotations({
  identifier: "EngineDefaults",
}) as any as S.Schema<EngineDefaults>;
export interface DescribeEngineDefaultParametersResult {
  EngineDefaults?: EngineDefaults;
}
export const DescribeEngineDefaultParametersResult = S.suspend(() =>
  S.Struct({ EngineDefaults: S.optional(EngineDefaults) }).pipe(ns),
).annotations({
  identifier: "DescribeEngineDefaultParametersResult",
}) as any as S.Schema<DescribeEngineDefaultParametersResult>;
export interface EventSubscriptionsMessage {
  Marker?: string;
  EventSubscriptionsList?: EventSubscription[];
}
export const EventSubscriptionsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    EventSubscriptionsList: S.optional(EventSubscriptionsList),
  }).pipe(ns),
).annotations({
  identifier: "EventSubscriptionsMessage",
}) as any as S.Schema<EventSubscriptionsMessage>;
export interface ExportTasksMessage {
  Marker?: string;
  ExportTasks?: ExportTask[];
}
export const ExportTasksMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ExportTasks: S.optional(ExportTasksList),
  }).pipe(ns),
).annotations({
  identifier: "ExportTasksMessage",
}) as any as S.Schema<ExportTasksMessage>;
export interface GlobalClustersMessage {
  Marker?: string;
  GlobalClusters?: GlobalCluster[];
}
export const GlobalClustersMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    GlobalClusters: S.optional(GlobalClusterList),
  }).pipe(ns),
).annotations({
  identifier: "GlobalClustersMessage",
}) as any as S.Schema<GlobalClustersMessage>;
export interface DescribeIntegrationsResponse {
  Marker?: string;
  Integrations?: (Integration & {
    Errors: (IntegrationError & { ErrorCode: string })[];
  })[];
}
export const DescribeIntegrationsResponse = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Integrations: S.optional(IntegrationList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeIntegrationsResponse",
}) as any as S.Schema<DescribeIntegrationsResponse>;
export interface OptionGroups {
  OptionGroupsList?: OptionGroup[];
  Marker?: string;
}
export const OptionGroups = S.suspend(() =>
  S.Struct({
    OptionGroupsList: S.optional(OptionGroupsList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "OptionGroups" }) as any as S.Schema<OptionGroups>;
export interface PendingMaintenanceActionsMessage {
  PendingMaintenanceActions?: ResourcePendingMaintenanceActions[];
  Marker?: string;
}
export const PendingMaintenanceActionsMessage = S.suspend(() =>
  S.Struct({
    PendingMaintenanceActions: S.optional(PendingMaintenanceActions),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PendingMaintenanceActionsMessage",
}) as any as S.Schema<PendingMaintenanceActionsMessage>;
export interface TenantDatabasesMessage {
  Marker?: string;
  TenantDatabases?: TenantDatabase[];
}
export const TenantDatabasesMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    TenantDatabases: S.optional(TenantDatabasesList),
  }).pipe(ns),
).annotations({
  identifier: "TenantDatabasesMessage",
}) as any as S.Schema<TenantDatabasesMessage>;
export interface DisableHttpEndpointResponse {
  ResourceArn?: string;
  HttpEndpointEnabled?: boolean;
}
export const DisableHttpEndpointResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    HttpEndpointEnabled: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "DisableHttpEndpointResponse",
}) as any as S.Schema<DisableHttpEndpointResponse>;
export interface DownloadDBLogFilePortionDetails {
  LogFileData?: string | redacted.Redacted<string>;
  Marker?: string;
  AdditionalDataPending?: boolean;
}
export const DownloadDBLogFilePortionDetails = S.suspend(() =>
  S.Struct({
    LogFileData: S.optional(SensitiveString),
    Marker: S.optional(S.String),
    AdditionalDataPending: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "DownloadDBLogFilePortionDetails",
}) as any as S.Schema<DownloadDBLogFilePortionDetails>;
export interface EnableHttpEndpointResponse {
  ResourceArn?: string;
  HttpEndpointEnabled?: boolean;
}
export const EnableHttpEndpointResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    HttpEndpointEnabled: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "EnableHttpEndpointResponse",
}) as any as S.Schema<EnableHttpEndpointResponse>;
export interface FailoverDBClusterResult {
  DBCluster?: DBCluster;
}
export const FailoverDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "FailoverDBClusterResult",
}) as any as S.Schema<FailoverDBClusterResult>;
export interface FailoverGlobalClusterResult {
  GlobalCluster?: GlobalCluster;
}
export const FailoverGlobalClusterResult = S.suspend(() =>
  S.Struct({ GlobalCluster: S.optional(GlobalCluster) }).pipe(ns),
).annotations({
  identifier: "FailoverGlobalClusterResult",
}) as any as S.Schema<FailoverGlobalClusterResult>;
export interface TagListMessage {
  TagList?: Tag[];
}
export const TagListMessage = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "TagListMessage",
}) as any as S.Schema<TagListMessage>;
export interface ModifyActivityStreamResponse {
  KmsKeyId?: string;
  KinesisStreamName?: string;
  Status?: ActivityStreamStatus;
  Mode?: ActivityStreamMode;
  EngineNativeAuditFieldsIncluded?: boolean;
  PolicyStatus?: ActivityStreamPolicyStatus;
}
export const ModifyActivityStreamResponse = S.suspend(() =>
  S.Struct({
    KmsKeyId: S.optional(S.String),
    KinesisStreamName: S.optional(S.String),
    Status: S.optional(ActivityStreamStatus),
    Mode: S.optional(ActivityStreamMode),
    EngineNativeAuditFieldsIncluded: S.optional(S.Boolean),
    PolicyStatus: S.optional(ActivityStreamPolicyStatus),
  }).pipe(ns),
).annotations({
  identifier: "ModifyActivityStreamResponse",
}) as any as S.Schema<ModifyActivityStreamResponse>;
export interface Certificate {
  CertificateIdentifier?: string;
  CertificateType?: string;
  Thumbprint?: string;
  ValidFrom?: Date;
  ValidTill?: Date;
  CertificateArn?: string;
  CustomerOverride?: boolean;
  CustomerOverrideValidTill?: Date;
}
export const Certificate = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export interface ModifyCertificatesResult {
  Certificate?: Certificate;
}
export const ModifyCertificatesResult = S.suspend(() =>
  S.Struct({ Certificate: S.optional(Certificate) }).pipe(ns),
).annotations({
  identifier: "ModifyCertificatesResult",
}) as any as S.Schema<ModifyCertificatesResult>;
export interface DBClusterCapacityInfo {
  DBClusterIdentifier?: string;
  PendingCapacity?: number;
  CurrentCapacity?: number;
  SecondsBeforeTimeout?: number;
  TimeoutAction?: string;
}
export const DBClusterCapacityInfo = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    PendingCapacity: S.optional(S.Number),
    CurrentCapacity: S.optional(S.Number),
    SecondsBeforeTimeout: S.optional(S.Number),
    TimeoutAction: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DBClusterCapacityInfo",
}) as any as S.Schema<DBClusterCapacityInfo>;
export interface ModifyDBClusterMessage {
  DBClusterIdentifier?: string;
  NewDBClusterIdentifier?: string;
  ApplyImmediately?: boolean;
  BackupRetentionPeriod?: number;
  DBClusterParameterGroupName?: string;
  VpcSecurityGroupIds?: string[];
  Port?: number;
  MasterUserPassword?: string | redacted.Redacted<string>;
  OptionGroupName?: string;
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  BacktrackWindow?: number;
  CloudwatchLogsExportConfiguration?: CloudwatchLogsExportConfiguration;
  EngineVersion?: string;
  AllowMajorVersionUpgrade?: boolean;
  DBInstanceParameterGroupName?: string;
  Domain?: string;
  DomainIAMRoleName?: string;
  ScalingConfiguration?: ScalingConfiguration;
  DeletionProtection?: boolean;
  EnableHttpEndpoint?: boolean;
  CopyTagsToSnapshot?: boolean;
  EnableGlobalWriteForwarding?: boolean;
  DBClusterInstanceClass?: string;
  AllocatedStorage?: number;
  StorageType?: string;
  Iops?: number;
  AutoMinorVersionUpgrade?: boolean;
  NetworkType?: string;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  DatabaseInsightsMode?: DatabaseInsightsMode;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  ManageMasterUserPassword?: boolean;
  RotateMasterUserPassword?: boolean;
  EnableLocalWriteForwarding?: boolean;
  MasterUserSecretKmsKeyId?: string;
  EngineMode?: string;
  AllowEngineModeChange?: boolean;
  AwsBackupRecoveryPointArn?: string;
  EnableLimitlessDatabase?: boolean;
  CACertificateIdentifier?: string;
  MasterUserAuthenticationType?: MasterUserAuthenticationType;
}
export const ModifyDBClusterMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
    NewDBClusterIdentifier: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
    BackupRetentionPeriod: S.optional(S.Number),
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Port: S.optional(S.Number),
    MasterUserPassword: S.optional(SensitiveString),
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
    DatabaseInsightsMode: S.optional(DatabaseInsightsMode),
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
    MasterUserAuthenticationType: S.optional(MasterUserAuthenticationType),
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
  identifier: "ModifyDBClusterMessage",
}) as any as S.Schema<ModifyDBClusterMessage>;
export interface ModifyDBClusterParameterGroupMessage {
  DBClusterParameterGroupName?: string;
  Parameters?: Parameter[];
}
export const ModifyDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.optional(S.String),
    Parameters: S.optional(ParametersList),
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
  identifier: "ModifyDBClusterParameterGroupMessage",
}) as any as S.Schema<ModifyDBClusterParameterGroupMessage>;
export interface DBClusterSnapshotAttribute {
  AttributeName?: string;
  AttributeValues?: string[];
}
export const DBClusterSnapshotAttribute = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    AttributeValues: S.optional(AttributeValueList),
  }),
).annotations({
  identifier: "DBClusterSnapshotAttribute",
}) as any as S.Schema<DBClusterSnapshotAttribute>;
export type DBClusterSnapshotAttributeList = DBClusterSnapshotAttribute[];
export const DBClusterSnapshotAttributeList = S.Array(
  DBClusterSnapshotAttribute.pipe(
    T.XmlName("DBClusterSnapshotAttribute"),
  ).annotations({ identifier: "DBClusterSnapshotAttribute" }),
);
export interface DBClusterSnapshotAttributesResult {
  DBClusterSnapshotIdentifier?: string;
  DBClusterSnapshotAttributes?: DBClusterSnapshotAttribute[];
}
export const DBClusterSnapshotAttributesResult = S.suspend(() =>
  S.Struct({
    DBClusterSnapshotIdentifier: S.optional(S.String),
    DBClusterSnapshotAttributes: S.optional(DBClusterSnapshotAttributeList),
  }),
).annotations({
  identifier: "DBClusterSnapshotAttributesResult",
}) as any as S.Schema<DBClusterSnapshotAttributesResult>;
export interface ModifyDBClusterSnapshotAttributeResult {
  DBClusterSnapshotAttributesResult?: DBClusterSnapshotAttributesResult;
}
export const ModifyDBClusterSnapshotAttributeResult = S.suspend(() =>
  S.Struct({
    DBClusterSnapshotAttributesResult: S.optional(
      DBClusterSnapshotAttributesResult,
    ),
  }).pipe(ns),
).annotations({
  identifier: "ModifyDBClusterSnapshotAttributeResult",
}) as any as S.Schema<ModifyDBClusterSnapshotAttributeResult>;
export interface ModifyDBInstanceMessage {
  DBInstanceIdentifier?: string;
  AllocatedStorage?: number;
  DBInstanceClass?: string;
  DBSubnetGroupName?: string;
  DBSecurityGroups?: string[];
  VpcSecurityGroupIds?: string[];
  ApplyImmediately?: boolean;
  MasterUserPassword?: string | redacted.Redacted<string>;
  DBParameterGroupName?: string;
  BackupRetentionPeriod?: number;
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  MultiAZ?: boolean;
  EngineVersion?: string;
  AllowMajorVersionUpgrade?: boolean;
  AutoMinorVersionUpgrade?: boolean;
  LicenseModel?: string;
  Iops?: number;
  StorageThroughput?: number;
  OptionGroupName?: string;
  NewDBInstanceIdentifier?: string;
  StorageType?: string;
  TdeCredentialArn?: string;
  TdeCredentialPassword?: string | redacted.Redacted<string>;
  CACertificateIdentifier?: string;
  Domain?: string;
  DomainFqdn?: string;
  DomainOu?: string;
  DomainAuthSecretArn?: string;
  DomainDnsIps?: string[];
  DisableDomain?: boolean;
  CopyTagsToSnapshot?: boolean;
  MonitoringInterval?: number;
  DBPortNumber?: number;
  PubliclyAccessible?: boolean;
  MonitoringRoleArn?: string;
  DomainIAMRoleName?: string;
  PromotionTier?: number;
  EnableIAMDatabaseAuthentication?: boolean;
  DatabaseInsightsMode?: DatabaseInsightsMode;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  PerformanceInsightsRetentionPeriod?: number;
  CloudwatchLogsExportConfiguration?: CloudwatchLogsExportConfiguration;
  ProcessorFeatures?: ProcessorFeature[];
  UseDefaultProcessorFeatures?: boolean;
  DeletionProtection?: boolean;
  MaxAllocatedStorage?: number;
  CertificateRotationRestart?: boolean;
  ReplicaMode?: ReplicaMode;
  AutomationMode?: AutomationMode;
  ResumeFullAutomationModeMinutes?: number;
  EnableCustomerOwnedIp?: boolean;
  NetworkType?: string;
  AwsBackupRecoveryPointArn?: string;
  ManageMasterUserPassword?: boolean;
  RotateMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
  MultiTenant?: boolean;
  DedicatedLogVolume?: boolean;
  Engine?: string;
  TagSpecifications?: TagSpecification[];
  MasterUserAuthenticationType?: MasterUserAuthenticationType;
  AdditionalStorageVolumes?: ModifyAdditionalStorageVolume[];
}
export const ModifyDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    DBInstanceClass: S.optional(S.String),
    DBSubnetGroupName: S.optional(S.String),
    DBSecurityGroups: S.optional(DBSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    ApplyImmediately: S.optional(S.Boolean),
    MasterUserPassword: S.optional(SensitiveString),
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
    TdeCredentialPassword: S.optional(SensitiveString),
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
    DatabaseInsightsMode: S.optional(DatabaseInsightsMode),
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
    ReplicaMode: S.optional(ReplicaMode),
    AutomationMode: S.optional(AutomationMode),
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
    MasterUserAuthenticationType: S.optional(MasterUserAuthenticationType),
    AdditionalStorageVolumes: S.optional(ModifyAdditionalStorageVolumesList),
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
  identifier: "ModifyDBInstanceMessage",
}) as any as S.Schema<ModifyDBInstanceMessage>;
export interface DBParameterGroupNameMessage {
  DBParameterGroupName?: string;
}
export const DBParameterGroupNameMessage = S.suspend(() =>
  S.Struct({ DBParameterGroupName: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DBParameterGroupNameMessage",
}) as any as S.Schema<DBParameterGroupNameMessage>;
export interface ModifyDBProxyResponse {
  DBProxy?: DBProxy;
}
export const ModifyDBProxyResponse = S.suspend(() =>
  S.Struct({ DBProxy: S.optional(DBProxy) }).pipe(ns),
).annotations({
  identifier: "ModifyDBProxyResponse",
}) as any as S.Schema<ModifyDBProxyResponse>;
export interface ModifyDBProxyEndpointResponse {
  DBProxyEndpoint?: DBProxyEndpoint;
}
export const ModifyDBProxyEndpointResponse = S.suspend(() =>
  S.Struct({ DBProxyEndpoint: S.optional(DBProxyEndpoint) }).pipe(ns),
).annotations({
  identifier: "ModifyDBProxyEndpointResponse",
}) as any as S.Schema<ModifyDBProxyEndpointResponse>;
export interface ModifyDBProxyTargetGroupRequest {
  TargetGroupName?: string;
  DBProxyName?: string;
  ConnectionPoolConfig?: ConnectionPoolConfiguration;
  NewName?: string;
}
export const ModifyDBProxyTargetGroupRequest = S.suspend(() =>
  S.Struct({
    TargetGroupName: S.optional(S.String),
    DBProxyName: S.optional(S.String),
    ConnectionPoolConfig: S.optional(ConnectionPoolConfiguration),
    NewName: S.optional(S.String),
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
  identifier: "ModifyDBProxyTargetGroupRequest",
}) as any as S.Schema<ModifyDBProxyTargetGroupRequest>;
export interface ModifyDBRecommendationMessage {
  RecommendationId?: string;
  Locale?: string;
  Status?: string;
  RecommendedActionUpdates?: RecommendedActionUpdate[];
}
export const ModifyDBRecommendationMessage = S.suspend(() =>
  S.Struct({
    RecommendationId: S.optional(S.String),
    Locale: S.optional(S.String),
    Status: S.optional(S.String),
    RecommendedActionUpdates: S.optional(RecommendedActionUpdateList),
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
  identifier: "ModifyDBRecommendationMessage",
}) as any as S.Schema<ModifyDBRecommendationMessage>;
export interface ModifyDBSnapshotResult {
  DBSnapshot?: DBSnapshot & {
    AdditionalStorageVolumes: (AdditionalStorageVolume & {
      VolumeName: string;
    })[];
  };
}
export const ModifyDBSnapshotResult = S.suspend(() =>
  S.Struct({ DBSnapshot: S.optional(DBSnapshot) }).pipe(ns),
).annotations({
  identifier: "ModifyDBSnapshotResult",
}) as any as S.Schema<ModifyDBSnapshotResult>;
export interface DBSnapshotAttribute {
  AttributeName?: string;
  AttributeValues?: string[];
}
export const DBSnapshotAttribute = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    AttributeValues: S.optional(AttributeValueList),
  }),
).annotations({
  identifier: "DBSnapshotAttribute",
}) as any as S.Schema<DBSnapshotAttribute>;
export type DBSnapshotAttributeList = DBSnapshotAttribute[];
export const DBSnapshotAttributeList = S.Array(
  DBSnapshotAttribute.pipe(T.XmlName("DBSnapshotAttribute")).annotations({
    identifier: "DBSnapshotAttribute",
  }),
);
export interface DBSnapshotAttributesResult {
  DBSnapshotIdentifier?: string;
  DBSnapshotAttributes?: DBSnapshotAttribute[];
}
export const DBSnapshotAttributesResult = S.suspend(() =>
  S.Struct({
    DBSnapshotIdentifier: S.optional(S.String),
    DBSnapshotAttributes: S.optional(DBSnapshotAttributeList),
  }),
).annotations({
  identifier: "DBSnapshotAttributesResult",
}) as any as S.Schema<DBSnapshotAttributesResult>;
export interface ModifyDBSnapshotAttributeResult {
  DBSnapshotAttributesResult?: DBSnapshotAttributesResult;
}
export const ModifyDBSnapshotAttributeResult = S.suspend(() =>
  S.Struct({
    DBSnapshotAttributesResult: S.optional(DBSnapshotAttributesResult),
  }).pipe(ns),
).annotations({
  identifier: "ModifyDBSnapshotAttributeResult",
}) as any as S.Schema<ModifyDBSnapshotAttributeResult>;
export interface ModifyDBSubnetGroupResult {
  DBSubnetGroup?: DBSubnetGroup;
}
export const ModifyDBSubnetGroupResult = S.suspend(() =>
  S.Struct({ DBSubnetGroup: S.optional(DBSubnetGroup) }).pipe(ns),
).annotations({
  identifier: "ModifyDBSubnetGroupResult",
}) as any as S.Schema<ModifyDBSubnetGroupResult>;
export interface ModifyEventSubscriptionResult {
  EventSubscription?: EventSubscription;
}
export const ModifyEventSubscriptionResult = S.suspend(() =>
  S.Struct({ EventSubscription: S.optional(EventSubscription) }).pipe(ns),
).annotations({
  identifier: "ModifyEventSubscriptionResult",
}) as any as S.Schema<ModifyEventSubscriptionResult>;
export interface ModifyGlobalClusterResult {
  GlobalCluster?: GlobalCluster;
}
export const ModifyGlobalClusterResult = S.suspend(() =>
  S.Struct({ GlobalCluster: S.optional(GlobalCluster) }).pipe(ns),
).annotations({
  identifier: "ModifyGlobalClusterResult",
}) as any as S.Schema<ModifyGlobalClusterResult>;
export interface ModifyTenantDatabaseResult {
  TenantDatabase?: TenantDatabase;
}
export const ModifyTenantDatabaseResult = S.suspend(() =>
  S.Struct({ TenantDatabase: S.optional(TenantDatabase) }).pipe(ns),
).annotations({
  identifier: "ModifyTenantDatabaseResult",
}) as any as S.Schema<ModifyTenantDatabaseResult>;
export interface PromoteReadReplicaResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const PromoteReadReplicaResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "PromoteReadReplicaResult",
}) as any as S.Schema<PromoteReadReplicaResult>;
export interface PromoteReadReplicaDBClusterResult {
  DBCluster?: DBCluster;
}
export const PromoteReadReplicaDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "PromoteReadReplicaDBClusterResult",
}) as any as S.Schema<PromoteReadReplicaDBClusterResult>;
export interface RecurringCharge {
  RecurringChargeAmount?: number;
  RecurringChargeFrequency?: string;
}
export const RecurringCharge = S.suspend(() =>
  S.Struct({
    RecurringChargeAmount: S.optional(S.Number),
    RecurringChargeFrequency: S.optional(S.String),
  }),
).annotations({
  identifier: "RecurringCharge",
}) as any as S.Schema<RecurringCharge>;
export type RecurringChargeList = RecurringCharge[];
export const RecurringChargeList = S.Array(
  RecurringCharge.pipe(T.XmlName("RecurringCharge")).annotations({
    identifier: "RecurringCharge",
  }),
);
export interface ReservedDBInstance {
  ReservedDBInstanceId?: string;
  ReservedDBInstancesOfferingId?: string;
  DBInstanceClass?: string;
  StartTime?: Date;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  CurrencyCode?: string;
  DBInstanceCount?: number;
  ProductDescription?: string;
  OfferingType?: string;
  MultiAZ?: boolean;
  State?: string;
  RecurringCharges?: RecurringCharge[];
  ReservedDBInstanceArn?: string;
  LeaseId?: string;
}
export const ReservedDBInstance = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ReservedDBInstance",
}) as any as S.Schema<ReservedDBInstance>;
export interface PurchaseReservedDBInstancesOfferingResult {
  ReservedDBInstance?: ReservedDBInstance;
}
export const PurchaseReservedDBInstancesOfferingResult = S.suspend(() =>
  S.Struct({ ReservedDBInstance: S.optional(ReservedDBInstance) }).pipe(ns),
).annotations({
  identifier: "PurchaseReservedDBInstancesOfferingResult",
}) as any as S.Schema<PurchaseReservedDBInstancesOfferingResult>;
export interface RebootDBClusterResult {
  DBCluster?: DBCluster;
}
export const RebootDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "RebootDBClusterResult",
}) as any as S.Schema<RebootDBClusterResult>;
export interface RebootDBInstanceResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const RebootDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "RebootDBInstanceResult",
}) as any as S.Schema<RebootDBInstanceResult>;
export type TargetType =
  | "RDS_INSTANCE"
  | "RDS_SERVERLESS_ENDPOINT"
  | "TRACKED_CLUSTER"
  | (string & {});
export const TargetType = S.String;
export type TargetRole = "READ_WRITE" | "READ_ONLY" | "UNKNOWN" | (string & {});
export const TargetRole = S.String;
export type TargetState =
  | "REGISTERING"
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "UNUSED"
  | (string & {});
export const TargetState = S.String;
export type TargetHealthReason =
  | "UNREACHABLE"
  | "CONNECTION_FAILED"
  | "AUTH_FAILURE"
  | "PENDING_PROXY_CAPACITY"
  | "INVALID_REPLICATION_STATE"
  | "PROMOTED"
  | (string & {});
export const TargetHealthReason = S.String;
export interface TargetHealth {
  State?: TargetState;
  Reason?: TargetHealthReason;
  Description?: string;
}
export const TargetHealth = S.suspend(() =>
  S.Struct({
    State: S.optional(TargetState),
    Reason: S.optional(TargetHealthReason),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "TargetHealth" }) as any as S.Schema<TargetHealth>;
export interface DBProxyTarget {
  TargetArn?: string;
  Endpoint?: string;
  TrackedClusterId?: string;
  RdsResourceId?: string;
  Port?: number;
  Type?: TargetType;
  Role?: TargetRole;
  TargetHealth?: TargetHealth;
}
export const DBProxyTarget = S.suspend(() =>
  S.Struct({
    TargetArn: S.optional(S.String),
    Endpoint: S.optional(S.String),
    TrackedClusterId: S.optional(S.String),
    RdsResourceId: S.optional(S.String),
    Port: S.optional(S.Number),
    Type: S.optional(TargetType),
    Role: S.optional(TargetRole),
    TargetHealth: S.optional(TargetHealth),
  }),
).annotations({
  identifier: "DBProxyTarget",
}) as any as S.Schema<DBProxyTarget>;
export type TargetList = DBProxyTarget[];
export const TargetList = S.Array(DBProxyTarget);
export interface RegisterDBProxyTargetsResponse {
  DBProxyTargets?: DBProxyTarget[];
}
export const RegisterDBProxyTargetsResponse = S.suspend(() =>
  S.Struct({ DBProxyTargets: S.optional(TargetList) }).pipe(ns),
).annotations({
  identifier: "RegisterDBProxyTargetsResponse",
}) as any as S.Schema<RegisterDBProxyTargetsResponse>;
export interface RemoveFromGlobalClusterResult {
  GlobalCluster?: GlobalCluster;
}
export const RemoveFromGlobalClusterResult = S.suspend(() =>
  S.Struct({ GlobalCluster: S.optional(GlobalCluster) }).pipe(ns),
).annotations({
  identifier: "RemoveFromGlobalClusterResult",
}) as any as S.Schema<RemoveFromGlobalClusterResult>;
export interface RemoveSourceIdentifierFromSubscriptionResult {
  EventSubscription?: EventSubscription;
}
export const RemoveSourceIdentifierFromSubscriptionResult = S.suspend(() =>
  S.Struct({ EventSubscription: S.optional(EventSubscription) }).pipe(ns),
).annotations({
  identifier: "RemoveSourceIdentifierFromSubscriptionResult",
}) as any as S.Schema<RemoveSourceIdentifierFromSubscriptionResult>;
export interface DBClusterParameterGroupNameMessage {
  DBClusterParameterGroupName?: string;
}
export const DBClusterParameterGroupNameMessage = S.suspend(() =>
  S.Struct({ DBClusterParameterGroupName: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DBClusterParameterGroupNameMessage",
}) as any as S.Schema<DBClusterParameterGroupNameMessage>;
export interface RestoreDBClusterFromS3Result {
  DBCluster?: DBCluster;
}
export const RestoreDBClusterFromS3Result = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "RestoreDBClusterFromS3Result",
}) as any as S.Schema<RestoreDBClusterFromS3Result>;
export interface RestoreDBClusterFromSnapshotResult {
  DBCluster?: DBCluster;
}
export const RestoreDBClusterFromSnapshotResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "RestoreDBClusterFromSnapshotResult",
}) as any as S.Schema<RestoreDBClusterFromSnapshotResult>;
export interface RestoreDBClusterToPointInTimeResult {
  DBCluster?: DBCluster;
}
export const RestoreDBClusterToPointInTimeResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "RestoreDBClusterToPointInTimeResult",
}) as any as S.Schema<RestoreDBClusterToPointInTimeResult>;
export interface RestoreDBInstanceFromDBSnapshotResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const RestoreDBInstanceFromDBSnapshotResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "RestoreDBInstanceFromDBSnapshotResult",
}) as any as S.Schema<RestoreDBInstanceFromDBSnapshotResult>;
export interface RestoreDBInstanceFromS3Result {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const RestoreDBInstanceFromS3Result = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "RestoreDBInstanceFromS3Result",
}) as any as S.Schema<RestoreDBInstanceFromS3Result>;
export interface RestoreDBInstanceToPointInTimeResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const RestoreDBInstanceToPointInTimeResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "RestoreDBInstanceToPointInTimeResult",
}) as any as S.Schema<RestoreDBInstanceToPointInTimeResult>;
export interface RevokeDBSecurityGroupIngressResult {
  DBSecurityGroup?: DBSecurityGroup;
}
export const RevokeDBSecurityGroupIngressResult = S.suspend(() =>
  S.Struct({ DBSecurityGroup: S.optional(DBSecurityGroup) }).pipe(ns),
).annotations({
  identifier: "RevokeDBSecurityGroupIngressResult",
}) as any as S.Schema<RevokeDBSecurityGroupIngressResult>;
export interface StartActivityStreamResponse {
  KmsKeyId?: string;
  KinesisStreamName?: string;
  Status?: ActivityStreamStatus;
  Mode?: ActivityStreamMode;
  EngineNativeAuditFieldsIncluded?: boolean;
  ApplyImmediately?: boolean;
}
export const StartActivityStreamResponse = S.suspend(() =>
  S.Struct({
    KmsKeyId: S.optional(S.String),
    KinesisStreamName: S.optional(S.String),
    Status: S.optional(ActivityStreamStatus),
    Mode: S.optional(ActivityStreamMode),
    EngineNativeAuditFieldsIncluded: S.optional(S.Boolean),
    ApplyImmediately: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "StartActivityStreamResponse",
}) as any as S.Schema<StartActivityStreamResponse>;
export interface StartDBClusterResult {
  DBCluster?: DBCluster;
}
export const StartDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "StartDBClusterResult",
}) as any as S.Schema<StartDBClusterResult>;
export interface StartDBInstanceResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const StartDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "StartDBInstanceResult",
}) as any as S.Schema<StartDBInstanceResult>;
export interface StartDBInstanceAutomatedBackupsReplicationResult {
  DBInstanceAutomatedBackup?: DBInstanceAutomatedBackup & {
    AdditionalStorageVolumes: (AdditionalStorageVolume & {
      VolumeName: string;
    })[];
  };
}
export const StartDBInstanceAutomatedBackupsReplicationResult = S.suspend(() =>
  S.Struct({
    DBInstanceAutomatedBackup: S.optional(DBInstanceAutomatedBackup),
  }).pipe(ns),
).annotations({
  identifier: "StartDBInstanceAutomatedBackupsReplicationResult",
}) as any as S.Schema<StartDBInstanceAutomatedBackupsReplicationResult>;
export interface StopActivityStreamResponse {
  KmsKeyId?: string;
  KinesisStreamName?: string;
  Status?: ActivityStreamStatus;
}
export const StopActivityStreamResponse = S.suspend(() =>
  S.Struct({
    KmsKeyId: S.optional(S.String),
    KinesisStreamName: S.optional(S.String),
    Status: S.optional(ActivityStreamStatus),
  }).pipe(ns),
).annotations({
  identifier: "StopActivityStreamResponse",
}) as any as S.Schema<StopActivityStreamResponse>;
export interface StopDBClusterResult {
  DBCluster?: DBCluster;
}
export const StopDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "StopDBClusterResult",
}) as any as S.Schema<StopDBClusterResult>;
export interface StopDBInstanceResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const StopDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "StopDBInstanceResult",
}) as any as S.Schema<StopDBInstanceResult>;
export interface StopDBInstanceAutomatedBackupsReplicationResult {
  DBInstanceAutomatedBackup?: DBInstanceAutomatedBackup & {
    AdditionalStorageVolumes: (AdditionalStorageVolume & {
      VolumeName: string;
    })[];
  };
}
export const StopDBInstanceAutomatedBackupsReplicationResult = S.suspend(() =>
  S.Struct({
    DBInstanceAutomatedBackup: S.optional(DBInstanceAutomatedBackup),
  }).pipe(ns),
).annotations({
  identifier: "StopDBInstanceAutomatedBackupsReplicationResult",
}) as any as S.Schema<StopDBInstanceAutomatedBackupsReplicationResult>;
export interface SwitchoverBlueGreenDeploymentResponse {
  BlueGreenDeployment?: BlueGreenDeployment;
}
export const SwitchoverBlueGreenDeploymentResponse = S.suspend(() =>
  S.Struct({ BlueGreenDeployment: S.optional(BlueGreenDeployment) }).pipe(ns),
).annotations({
  identifier: "SwitchoverBlueGreenDeploymentResponse",
}) as any as S.Schema<SwitchoverBlueGreenDeploymentResponse>;
export interface SwitchoverGlobalClusterResult {
  GlobalCluster?: GlobalCluster;
}
export const SwitchoverGlobalClusterResult = S.suspend(() =>
  S.Struct({ GlobalCluster: S.optional(GlobalCluster) }).pipe(ns),
).annotations({
  identifier: "SwitchoverGlobalClusterResult",
}) as any as S.Schema<SwitchoverGlobalClusterResult>;
export interface SwitchoverReadReplicaResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const SwitchoverReadReplicaResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "SwitchoverReadReplicaResult",
}) as any as S.Schema<SwitchoverReadReplicaResult>;
export type OptionsDependedOn = string[];
export const OptionsDependedOn = S.Array(
  S.String.pipe(T.XmlName("OptionName")),
);
export type OptionsConflictsWith = string[];
export const OptionsConflictsWith = S.Array(
  S.String.pipe(T.XmlName("OptionConflictName")),
);
export type ActivityStreamModeList = string[];
export const ActivityStreamModeList = S.Array(S.String);
export type OptionSettingsList = OptionSetting[];
export const OptionSettingsList = S.Array(
  OptionSetting.pipe(T.XmlName("OptionSetting")).annotations({
    identifier: "OptionSetting",
  }),
);
export type BlueGreenDeploymentList = BlueGreenDeployment[];
export const BlueGreenDeploymentList = S.Array(BlueGreenDeployment);
export type CertificateList = Certificate[];
export const CertificateList = S.Array(
  Certificate.pipe(T.XmlName("Certificate")).annotations({
    identifier: "Certificate",
  }),
);
export interface DescribeDBLogFilesDetails {
  LogFileName?: string;
  LastWritten?: number;
  Size?: number;
}
export const DescribeDBLogFilesDetails = S.suspend(() =>
  S.Struct({
    LogFileName: S.optional(S.String),
    LastWritten: S.optional(S.Number),
    Size: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribeDBLogFilesDetails",
}) as any as S.Schema<DescribeDBLogFilesDetails>;
export type DescribeDBLogFilesList = DescribeDBLogFilesDetails[];
export const DescribeDBLogFilesList = S.Array(
  DescribeDBLogFilesDetails.pipe(
    T.XmlName("DescribeDBLogFilesDetails"),
  ).annotations({ identifier: "DescribeDBLogFilesDetails" }),
);
export interface DBSnapshotTenantDatabase {
  DBSnapshotIdentifier?: string;
  DBInstanceIdentifier?: string;
  DbiResourceId?: string;
  EngineName?: string;
  SnapshotType?: string;
  TenantDatabaseCreateTime?: Date;
  TenantDBName?: string;
  MasterUsername?: string;
  TenantDatabaseResourceId?: string;
  CharacterSetName?: string;
  DBSnapshotTenantDatabaseARN?: string;
  NcharCharacterSetName?: string;
  TagList?: Tag[];
}
export const DBSnapshotTenantDatabase = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DBSnapshotTenantDatabase",
}) as any as S.Schema<DBSnapshotTenantDatabase>;
export type DBSnapshotTenantDatabasesList = DBSnapshotTenantDatabase[];
export const DBSnapshotTenantDatabasesList = S.Array(
  DBSnapshotTenantDatabase.pipe(
    T.XmlName("DBSnapshotTenantDatabase"),
  ).annotations({ identifier: "DBSnapshotTenantDatabase" }),
);
export interface EventCategoriesMap {
  SourceType?: string;
  EventCategories?: string[];
}
export const EventCategoriesMap = S.suspend(() =>
  S.Struct({
    SourceType: S.optional(S.String),
    EventCategories: S.optional(EventCategoriesList),
  }),
).annotations({
  identifier: "EventCategoriesMap",
}) as any as S.Schema<EventCategoriesMap>;
export type EventCategoriesMapList = EventCategoriesMap[];
export const EventCategoriesMapList = S.Array(
  EventCategoriesMap.pipe(T.XmlName("EventCategoriesMap")).annotations({
    identifier: "EventCategoriesMap",
  }),
);
export interface Event {
  SourceIdentifier?: string;
  SourceType?: SourceType;
  Message?: string;
  EventCategories?: string[];
  Date?: Date;
  SourceArn?: string;
}
export const Event = S.suspend(() =>
  S.Struct({
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(SourceType),
    Message: S.optional(S.String),
    EventCategories: S.optional(EventCategoriesList),
    Date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SourceArn: S.optional(S.String),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type EventList = Event[];
export const EventList = S.Array(
  Event.pipe(T.XmlName("Event")).annotations({ identifier: "Event" }),
);
export interface ReservedDBInstancesOffering {
  ReservedDBInstancesOfferingId?: string;
  DBInstanceClass?: string;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  CurrencyCode?: string;
  ProductDescription?: string;
  OfferingType?: string;
  MultiAZ?: boolean;
  RecurringCharges?: RecurringCharge[];
}
export const ReservedDBInstancesOffering = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ReservedDBInstancesOffering",
}) as any as S.Schema<ReservedDBInstancesOffering>;
export type ReservedDBInstancesOfferingList = ReservedDBInstancesOffering[];
export const ReservedDBInstancesOfferingList = S.Array(
  ReservedDBInstancesOffering.pipe(
    T.XmlName("ReservedDBInstancesOffering"),
  ).annotations({ identifier: "ReservedDBInstancesOffering" }),
);
export interface SourceRegion {
  RegionName?: string;
  Endpoint?: string;
  Status?: string;
  SupportsDBInstanceAutomatedBackupsReplication?: boolean;
}
export const SourceRegion = S.suspend(() =>
  S.Struct({
    RegionName: S.optional(S.String),
    Endpoint: S.optional(S.String),
    Status: S.optional(S.String),
    SupportsDBInstanceAutomatedBackupsReplication: S.optional(S.Boolean),
  }),
).annotations({ identifier: "SourceRegion" }) as any as S.Schema<SourceRegion>;
export type SourceRegionList = SourceRegion[];
export const SourceRegionList = S.Array(
  SourceRegion.pipe(T.XmlName("SourceRegion")).annotations({
    identifier: "SourceRegion",
  }),
);
export interface OptionConfiguration {
  OptionName?: string;
  Port?: number;
  OptionVersion?: string;
  DBSecurityGroupMemberships?: string[];
  VpcSecurityGroupMemberships?: string[];
  OptionSettings?: OptionSetting[];
}
export const OptionConfiguration = S.suspend(() =>
  S.Struct({
    OptionName: S.optional(S.String),
    Port: S.optional(S.Number),
    OptionVersion: S.optional(S.String),
    DBSecurityGroupMemberships: S.optional(DBSecurityGroupNameList),
    VpcSecurityGroupMemberships: S.optional(VpcSecurityGroupIdList),
    OptionSettings: S.optional(OptionSettingsList),
  }),
).annotations({
  identifier: "OptionConfiguration",
}) as any as S.Schema<OptionConfiguration>;
export type OptionConfigurationList = OptionConfiguration[];
export const OptionConfigurationList = S.Array(
  OptionConfiguration.pipe(T.XmlName("OptionConfiguration")).annotations({
    identifier: "OptionConfiguration",
  }),
);
export type LifecycleSupportName =
  | "open-source-rds-standard-support"
  | "open-source-rds-extended-support"
  | (string & {});
export const LifecycleSupportName = S.String;
export interface AddSourceIdentifierToSubscriptionResult {
  EventSubscription?: EventSubscription;
}
export const AddSourceIdentifierToSubscriptionResult = S.suspend(() =>
  S.Struct({ EventSubscription: S.optional(EventSubscription) }).pipe(ns),
).annotations({
  identifier: "AddSourceIdentifierToSubscriptionResult",
}) as any as S.Schema<AddSourceIdentifierToSubscriptionResult>;
export interface CopyDBClusterParameterGroupResult {
  DBClusterParameterGroup?: DBClusterParameterGroup;
}
export const CopyDBClusterParameterGroupResult = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroup: S.optional(DBClusterParameterGroup),
  }).pipe(ns),
).annotations({
  identifier: "CopyDBClusterParameterGroupResult",
}) as any as S.Schema<CopyDBClusterParameterGroupResult>;
export interface CopyDBClusterSnapshotResult {
  DBClusterSnapshot?: DBClusterSnapshot;
}
export const CopyDBClusterSnapshotResult = S.suspend(() =>
  S.Struct({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }).pipe(ns),
).annotations({
  identifier: "CopyDBClusterSnapshotResult",
}) as any as S.Schema<CopyDBClusterSnapshotResult>;
export interface CopyDBParameterGroupResult {
  DBParameterGroup?: DBParameterGroup;
}
export const CopyDBParameterGroupResult = S.suspend(() =>
  S.Struct({ DBParameterGroup: S.optional(DBParameterGroup) }).pipe(ns),
).annotations({
  identifier: "CopyDBParameterGroupResult",
}) as any as S.Schema<CopyDBParameterGroupResult>;
export interface CopyDBSnapshotResult {
  DBSnapshot?: DBSnapshot & {
    AdditionalStorageVolumes: (AdditionalStorageVolume & {
      VolumeName: string;
    })[];
  };
}
export const CopyDBSnapshotResult = S.suspend(() =>
  S.Struct({ DBSnapshot: S.optional(DBSnapshot) }).pipe(ns),
).annotations({
  identifier: "CopyDBSnapshotResult",
}) as any as S.Schema<CopyDBSnapshotResult>;
export interface CreateDBClusterResult {
  DBCluster?: DBCluster;
}
export const CreateDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "CreateDBClusterResult",
}) as any as S.Schema<CreateDBClusterResult>;
export interface CreateDBInstanceResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const CreateDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "CreateDBInstanceResult",
}) as any as S.Schema<CreateDBInstanceResult>;
export interface CreateDBProxyResponse {
  DBProxy?: DBProxy;
}
export const CreateDBProxyResponse = S.suspend(() =>
  S.Struct({ DBProxy: S.optional(DBProxy) }).pipe(ns),
).annotations({
  identifier: "CreateDBProxyResponse",
}) as any as S.Schema<CreateDBProxyResponse>;
export interface CreateDBProxyEndpointResponse {
  DBProxyEndpoint?: DBProxyEndpoint;
}
export const CreateDBProxyEndpointResponse = S.suspend(() =>
  S.Struct({ DBProxyEndpoint: S.optional(DBProxyEndpoint) }).pipe(ns),
).annotations({
  identifier: "CreateDBProxyEndpointResponse",
}) as any as S.Schema<CreateDBProxyEndpointResponse>;
export interface DeleteDBInstanceAutomatedBackupResult {
  DBInstanceAutomatedBackup?: DBInstanceAutomatedBackup & {
    AdditionalStorageVolumes: (AdditionalStorageVolume & {
      VolumeName: string;
    })[];
  };
}
export const DeleteDBInstanceAutomatedBackupResult = S.suspend(() =>
  S.Struct({
    DBInstanceAutomatedBackup: S.optional(DBInstanceAutomatedBackup),
  }).pipe(ns),
).annotations({
  identifier: "DeleteDBInstanceAutomatedBackupResult",
}) as any as S.Schema<DeleteDBInstanceAutomatedBackupResult>;
export interface DescribeBlueGreenDeploymentsResponse {
  BlueGreenDeployments?: BlueGreenDeployment[];
  Marker?: string;
}
export const DescribeBlueGreenDeploymentsResponse = S.suspend(() =>
  S.Struct({
    BlueGreenDeployments: S.optional(BlueGreenDeploymentList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeBlueGreenDeploymentsResponse",
}) as any as S.Schema<DescribeBlueGreenDeploymentsResponse>;
export interface CertificateMessage {
  DefaultCertificateForNewLaunches?: string;
  Certificates?: Certificate[];
  Marker?: string;
}
export const CertificateMessage = S.suspend(() =>
  S.Struct({
    DefaultCertificateForNewLaunches: S.optional(S.String),
    Certificates: S.optional(CertificateList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CertificateMessage",
}) as any as S.Schema<CertificateMessage>;
export interface DescribeDBLogFilesResponse {
  DescribeDBLogFiles?: DescribeDBLogFilesDetails[];
  Marker?: string;
}
export const DescribeDBLogFilesResponse = S.suspend(() =>
  S.Struct({
    DescribeDBLogFiles: S.optional(DescribeDBLogFilesList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDBLogFilesResponse",
}) as any as S.Schema<DescribeDBLogFilesResponse>;
export interface DBSnapshotTenantDatabasesMessage {
  Marker?: string;
  DBSnapshotTenantDatabases?: DBSnapshotTenantDatabase[];
}
export const DBSnapshotTenantDatabasesMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBSnapshotTenantDatabases: S.optional(DBSnapshotTenantDatabasesList),
  }).pipe(ns),
).annotations({
  identifier: "DBSnapshotTenantDatabasesMessage",
}) as any as S.Schema<DBSnapshotTenantDatabasesMessage>;
export interface DescribeEngineDefaultClusterParametersResult {
  EngineDefaults?: EngineDefaults;
}
export const DescribeEngineDefaultClusterParametersResult = S.suspend(() =>
  S.Struct({ EngineDefaults: S.optional(EngineDefaults) }).pipe(ns),
).annotations({
  identifier: "DescribeEngineDefaultClusterParametersResult",
}) as any as S.Schema<DescribeEngineDefaultClusterParametersResult>;
export interface EventCategoriesMessage {
  EventCategoriesMapList?: EventCategoriesMap[];
}
export const EventCategoriesMessage = S.suspend(() =>
  S.Struct({ EventCategoriesMapList: S.optional(EventCategoriesMapList) }).pipe(
    ns,
  ),
).annotations({
  identifier: "EventCategoriesMessage",
}) as any as S.Schema<EventCategoriesMessage>;
export interface EventsMessage {
  Marker?: string;
  Events?: Event[];
}
export const EventsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Events: S.optional(EventList),
  }).pipe(ns),
).annotations({
  identifier: "EventsMessage",
}) as any as S.Schema<EventsMessage>;
export interface ReservedDBInstancesOfferingMessage {
  Marker?: string;
  ReservedDBInstancesOfferings?: ReservedDBInstancesOffering[];
}
export const ReservedDBInstancesOfferingMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ReservedDBInstancesOfferings: S.optional(ReservedDBInstancesOfferingList),
  }).pipe(ns),
).annotations({
  identifier: "ReservedDBInstancesOfferingMessage",
}) as any as S.Schema<ReservedDBInstancesOfferingMessage>;
export interface SourceRegionMessage {
  Marker?: string;
  SourceRegions?: SourceRegion[];
}
export const SourceRegionMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    SourceRegions: S.optional(SourceRegionList),
  }).pipe(ns),
).annotations({
  identifier: "SourceRegionMessage",
}) as any as S.Schema<SourceRegionMessage>;
export interface ModifyDBClusterResult {
  DBCluster?: DBCluster;
}
export const ModifyDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "ModifyDBClusterResult",
}) as any as S.Schema<ModifyDBClusterResult>;
export interface ModifyDBInstanceResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const ModifyDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "ModifyDBInstanceResult",
}) as any as S.Schema<ModifyDBInstanceResult>;
export interface ConnectionPoolConfigurationInfo {
  MaxConnectionsPercent?: number;
  MaxIdleConnectionsPercent?: number;
  ConnectionBorrowTimeout?: number;
  SessionPinningFilters?: string[];
  InitQuery?: string;
}
export const ConnectionPoolConfigurationInfo = S.suspend(() =>
  S.Struct({
    MaxConnectionsPercent: S.optional(S.Number),
    MaxIdleConnectionsPercent: S.optional(S.Number),
    ConnectionBorrowTimeout: S.optional(S.Number),
    SessionPinningFilters: S.optional(StringList),
    InitQuery: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectionPoolConfigurationInfo",
}) as any as S.Schema<ConnectionPoolConfigurationInfo>;
export interface DBProxyTargetGroup {
  DBProxyName?: string;
  TargetGroupName?: string;
  TargetGroupArn?: string;
  IsDefault?: boolean;
  Status?: string;
  ConnectionPoolConfig?: ConnectionPoolConfigurationInfo;
  CreatedDate?: Date;
  UpdatedDate?: Date;
}
export const DBProxyTargetGroup = S.suspend(() =>
  S.Struct({
    DBProxyName: S.optional(S.String),
    TargetGroupName: S.optional(S.String),
    TargetGroupArn: S.optional(S.String),
    IsDefault: S.optional(S.Boolean),
    Status: S.optional(S.String),
    ConnectionPoolConfig: S.optional(ConnectionPoolConfigurationInfo),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "DBProxyTargetGroup",
}) as any as S.Schema<DBProxyTargetGroup>;
export interface ModifyDBProxyTargetGroupResponse {
  DBProxyTargetGroup?: DBProxyTargetGroup;
}
export const ModifyDBProxyTargetGroupResponse = S.suspend(() =>
  S.Struct({ DBProxyTargetGroup: S.optional(DBProxyTargetGroup) }).pipe(ns),
).annotations({
  identifier: "ModifyDBProxyTargetGroupResponse",
}) as any as S.Schema<ModifyDBProxyTargetGroupResponse>;
export interface RecommendedActionParameter {
  Key?: string;
  Value?: string;
}
export const RecommendedActionParameter = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "RecommendedActionParameter",
}) as any as S.Schema<RecommendedActionParameter>;
export type RecommendedActionParameterList = RecommendedActionParameter[];
export const RecommendedActionParameterList = S.Array(
  RecommendedActionParameter,
);
export interface ScalarReferenceDetails {
  Value?: number;
}
export const ScalarReferenceDetails = S.suspend(() =>
  S.Struct({ Value: S.optional(S.Number) }),
).annotations({
  identifier: "ScalarReferenceDetails",
}) as any as S.Schema<ScalarReferenceDetails>;
export interface ReferenceDetails {
  ScalarReferenceDetails?: ScalarReferenceDetails;
}
export const ReferenceDetails = S.suspend(() =>
  S.Struct({ ScalarReferenceDetails: S.optional(ScalarReferenceDetails) }),
).annotations({
  identifier: "ReferenceDetails",
}) as any as S.Schema<ReferenceDetails>;
export interface MetricReference {
  Name?: string;
  ReferenceDetails?: ReferenceDetails;
}
export const MetricReference = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ReferenceDetails: S.optional(ReferenceDetails),
  }),
).annotations({
  identifier: "MetricReference",
}) as any as S.Schema<MetricReference>;
export type MetricReferenceList = MetricReference[];
export const MetricReferenceList = S.Array(MetricReference);
export interface PerformanceInsightsMetricDimensionGroup {
  Dimensions?: string[];
  Group?: string;
  Limit?: number;
}
export const PerformanceInsightsMetricDimensionGroup = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(StringList),
    Group: S.optional(S.String),
    Limit: S.optional(S.Number),
  }),
).annotations({
  identifier: "PerformanceInsightsMetricDimensionGroup",
}) as any as S.Schema<PerformanceInsightsMetricDimensionGroup>;
export interface PerformanceInsightsMetricQuery {
  GroupBy?: PerformanceInsightsMetricDimensionGroup;
  Metric?: string;
}
export const PerformanceInsightsMetricQuery = S.suspend(() =>
  S.Struct({
    GroupBy: S.optional(PerformanceInsightsMetricDimensionGroup),
    Metric: S.optional(S.String),
  }),
).annotations({
  identifier: "PerformanceInsightsMetricQuery",
}) as any as S.Schema<PerformanceInsightsMetricQuery>;
export interface MetricQuery {
  PerformanceInsightsMetricQuery?: PerformanceInsightsMetricQuery;
}
export const MetricQuery = S.suspend(() =>
  S.Struct({
    PerformanceInsightsMetricQuery: S.optional(PerformanceInsightsMetricQuery),
  }),
).annotations({ identifier: "MetricQuery" }) as any as S.Schema<MetricQuery>;
export interface Metric {
  Name?: string;
  References?: MetricReference[];
  StatisticsDetails?: string;
  MetricQuery?: MetricQuery;
}
export const Metric = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    References: S.optional(MetricReferenceList),
    StatisticsDetails: S.optional(S.String),
    MetricQuery: S.optional(MetricQuery),
  }),
).annotations({ identifier: "Metric" }) as any as S.Schema<Metric>;
export type MetricList = Metric[];
export const MetricList = S.Array(Metric);
export interface PerformanceIssueDetails {
  StartTime?: Date;
  EndTime?: Date;
  Metrics?: Metric[];
  Analysis?: string;
}
export const PerformanceIssueDetails = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Metrics: S.optional(MetricList),
    Analysis: S.optional(S.String),
  }),
).annotations({
  identifier: "PerformanceIssueDetails",
}) as any as S.Schema<PerformanceIssueDetails>;
export interface IssueDetails {
  PerformanceIssueDetails?: PerformanceIssueDetails;
}
export const IssueDetails = S.suspend(() =>
  S.Struct({ PerformanceIssueDetails: S.optional(PerformanceIssueDetails) }),
).annotations({ identifier: "IssueDetails" }) as any as S.Schema<IssueDetails>;
export interface ContextAttribute {
  Key?: string;
  Value?: string;
}
export const ContextAttribute = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "ContextAttribute",
}) as any as S.Schema<ContextAttribute>;
export type ContextAttributeList = ContextAttribute[];
export const ContextAttributeList = S.Array(ContextAttribute);
export interface RecommendedAction {
  ActionId?: string;
  Title?: string;
  Description?: string;
  Operation?: string;
  Parameters?: RecommendedActionParameter[];
  ApplyModes?: string[];
  Status?: string;
  IssueDetails?: IssueDetails;
  ContextAttributes?: ContextAttribute[];
}
export const RecommendedAction = S.suspend(() =>
  S.Struct({
    ActionId: S.optional(S.String),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    Operation: S.optional(S.String),
    Parameters: S.optional(RecommendedActionParameterList),
    ApplyModes: S.optional(StringList),
    Status: S.optional(S.String),
    IssueDetails: S.optional(IssueDetails),
    ContextAttributes: S.optional(ContextAttributeList),
  }),
).annotations({
  identifier: "RecommendedAction",
}) as any as S.Schema<RecommendedAction>;
export type RecommendedActionList = RecommendedAction[];
export const RecommendedActionList = S.Array(RecommendedAction);
export interface DocLink {
  Text?: string;
  Url?: string;
}
export const DocLink = S.suspend(() =>
  S.Struct({ Text: S.optional(S.String), Url: S.optional(S.String) }),
).annotations({ identifier: "DocLink" }) as any as S.Schema<DocLink>;
export type DocLinkList = DocLink[];
export const DocLinkList = S.Array(DocLink);
export interface DBRecommendation {
  RecommendationId?: string;
  TypeId?: string;
  Severity?: string;
  ResourceArn?: string;
  Status?: string;
  CreatedTime?: Date;
  UpdatedTime?: Date;
  Detection?: string;
  Recommendation?: string;
  Description?: string;
  Reason?: string;
  RecommendedActions?: RecommendedAction[];
  Category?: string;
  Source?: string;
  TypeDetection?: string;
  TypeRecommendation?: string;
  Impact?: string;
  AdditionalInfo?: string;
  Links?: DocLink[];
  IssueDetails?: IssueDetails;
}
export const DBRecommendation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DBRecommendation",
}) as any as S.Schema<DBRecommendation>;
export interface DBRecommendationMessage {
  DBRecommendation?: DBRecommendation;
}
export const DBRecommendationMessage = S.suspend(() =>
  S.Struct({ DBRecommendation: S.optional(DBRecommendation) }).pipe(ns),
).annotations({
  identifier: "DBRecommendationMessage",
}) as any as S.Schema<DBRecommendationMessage>;
export interface ModifyOptionGroupMessage {
  OptionGroupName?: string;
  OptionsToInclude?: OptionConfiguration[];
  OptionsToRemove?: string[];
  ApplyImmediately?: boolean;
}
export const ModifyOptionGroupMessage = S.suspend(() =>
  S.Struct({
    OptionGroupName: S.optional(S.String),
    OptionsToInclude: S.optional(OptionConfigurationList),
    OptionsToRemove: S.optional(OptionNamesList),
    ApplyImmediately: S.optional(S.Boolean),
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
  identifier: "ModifyOptionGroupMessage",
}) as any as S.Schema<ModifyOptionGroupMessage>;
export interface SupportedEngineLifecycle {
  LifecycleSupportName?: LifecycleSupportName;
  LifecycleSupportStartDate?: Date;
  LifecycleSupportEndDate?: Date;
}
export const SupportedEngineLifecycle = S.suspend(() =>
  S.Struct({
    LifecycleSupportName: S.optional(LifecycleSupportName),
    LifecycleSupportStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    LifecycleSupportEndDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "SupportedEngineLifecycle",
}) as any as S.Schema<SupportedEngineLifecycle>;
export type SupportedEngineLifecycleList = SupportedEngineLifecycle[];
export const SupportedEngineLifecycleList = S.Array(
  SupportedEngineLifecycle.pipe(
    T.XmlName("SupportedEngineLifecycle"),
  ).annotations({ identifier: "SupportedEngineLifecycle" }),
);
export interface OptionVersion {
  Version?: string;
  IsDefault?: boolean;
}
export const OptionVersion = S.suspend(() =>
  S.Struct({ Version: S.optional(S.String), IsDefault: S.optional(S.Boolean) }),
).annotations({
  identifier: "OptionVersion",
}) as any as S.Schema<OptionVersion>;
export type OptionGroupOptionVersionsList = OptionVersion[];
export const OptionGroupOptionVersionsList = S.Array(
  OptionVersion.pipe(T.XmlName("OptionVersion")).annotations({
    identifier: "OptionVersion",
  }),
);
export type AvailabilityZoneList = AvailabilityZone[];
export const AvailabilityZoneList = S.Array(
  AvailabilityZone.pipe(T.XmlName("AvailabilityZone")).annotations({
    identifier: "AvailabilityZone",
  }),
);
export interface AvailableProcessorFeature {
  Name?: string;
  DefaultValue?: string;
  AllowedValues?: string;
}
export const AvailableProcessorFeature = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    DefaultValue: S.optional(S.String),
    AllowedValues: S.optional(S.String),
  }),
).annotations({
  identifier: "AvailableProcessorFeature",
}) as any as S.Schema<AvailableProcessorFeature>;
export type AvailableProcessorFeatureList = AvailableProcessorFeature[];
export const AvailableProcessorFeatureList = S.Array(
  AvailableProcessorFeature.pipe(
    T.XmlName("AvailableProcessorFeature"),
  ).annotations({ identifier: "AvailableProcessorFeature" }),
);
export interface AvailableAdditionalStorageVolumesOption {
  SupportsStorageAutoscaling?: boolean;
  SupportsStorageThroughput?: boolean;
  SupportsIops?: boolean;
  StorageType?: string;
  MinStorageSize?: number;
  MaxStorageSize?: number;
  MinIops?: number;
  MaxIops?: number;
  MinIopsPerGib?: number;
  MaxIopsPerGib?: number;
  MinStorageThroughput?: number;
  MaxStorageThroughput?: number;
}
export const AvailableAdditionalStorageVolumesOption = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "AvailableAdditionalStorageVolumesOption",
}) as any as S.Schema<AvailableAdditionalStorageVolumesOption>;
export type AvailableAdditionalStorageVolumesOptionList =
  AvailableAdditionalStorageVolumesOption[];
export const AvailableAdditionalStorageVolumesOptionList = S.Array(
  AvailableAdditionalStorageVolumesOption.pipe(
    T.XmlName("AvailableAdditionalStorageVolumesOption"),
  ).annotations({ identifier: "AvailableAdditionalStorageVolumesOption" }),
);
export interface DBMajorEngineVersion {
  Engine?: string;
  MajorEngineVersion?: string;
  SupportedEngineLifecycles?: SupportedEngineLifecycle[];
}
export const DBMajorEngineVersion = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
    SupportedEngineLifecycles: S.optional(SupportedEngineLifecycleList),
  }),
).annotations({
  identifier: "DBMajorEngineVersion",
}) as any as S.Schema<DBMajorEngineVersion>;
export type DBMajorEngineVersionsList = DBMajorEngineVersion[];
export const DBMajorEngineVersionsList = S.Array(
  DBMajorEngineVersion.pipe(T.XmlName("DBMajorEngineVersion")).annotations({
    identifier: "DBMajorEngineVersion",
  }),
);
export type TargetGroupList = DBProxyTargetGroup[];
export const TargetGroupList = S.Array(DBProxyTargetGroup);
export interface OrderableDBInstanceOption {
  Engine?: string;
  EngineVersion?: string;
  DBInstanceClass?: string;
  LicenseModel?: string;
  AvailabilityZoneGroup?: string;
  AvailabilityZones?: AvailabilityZone[];
  MultiAZCapable?: boolean;
  ReadReplicaCapable?: boolean;
  Vpc?: boolean;
  SupportsStorageEncryption?: boolean;
  StorageType?: string;
  SupportsIops?: boolean;
  SupportsStorageThroughput?: boolean;
  SupportsEnhancedMonitoring?: boolean;
  SupportsIAMDatabaseAuthentication?: boolean;
  SupportsPerformanceInsights?: boolean;
  MinStorageSize?: number;
  MaxStorageSize?: number;
  MinIopsPerDbInstance?: number;
  MaxIopsPerDbInstance?: number;
  MinIopsPerGib?: number;
  MaxIopsPerGib?: number;
  MinStorageThroughputPerDbInstance?: number;
  MaxStorageThroughputPerDbInstance?: number;
  MinStorageThroughputPerIops?: number;
  MaxStorageThroughputPerIops?: number;
  AvailableProcessorFeatures?: AvailableProcessorFeature[];
  SupportedEngineModes?: string[];
  SupportsStorageAutoscaling?: boolean;
  SupportsKerberosAuthentication?: boolean;
  OutpostCapable?: boolean;
  SupportedActivityStreamModes?: string[];
  SupportsGlobalDatabases?: boolean;
  SupportedNetworkTypes?: string[];
  SupportsClusters?: boolean;
  SupportsDedicatedLogVolume?: boolean;
  SupportsHttpEndpoint?: boolean;
  SupportsAdditionalStorageVolumes?: boolean;
  AvailableAdditionalStorageVolumesOptions?: AvailableAdditionalStorageVolumesOption[];
}
export const OrderableDBInstanceOption = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "OrderableDBInstanceOption",
}) as any as S.Schema<OrderableDBInstanceOption>;
export type OrderableDBInstanceOptionsList = OrderableDBInstanceOption[];
export const OrderableDBInstanceOptionsList = S.Array(
  OrderableDBInstanceOption.pipe(
    T.XmlName("OrderableDBInstanceOption"),
  ).annotations({ identifier: "OrderableDBInstanceOption" }),
);
export type ReservedDBInstanceList = ReservedDBInstance[];
export const ReservedDBInstanceList = S.Array(
  ReservedDBInstance.pipe(T.XmlName("ReservedDBInstance")).annotations({
    identifier: "ReservedDBInstance",
  }),
);
export interface MinimumEngineVersionPerAllowedValue {
  AllowedValue?: string;
  MinimumEngineVersion?: string;
}
export const MinimumEngineVersionPerAllowedValue = S.suspend(() =>
  S.Struct({
    AllowedValue: S.optional(S.String),
    MinimumEngineVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "MinimumEngineVersionPerAllowedValue",
}) as any as S.Schema<MinimumEngineVersionPerAllowedValue>;
export type MinimumEngineVersionPerAllowedValueList =
  MinimumEngineVersionPerAllowedValue[];
export const MinimumEngineVersionPerAllowedValueList = S.Array(
  MinimumEngineVersionPerAllowedValue.pipe(
    T.XmlName("MinimumEngineVersionPerAllowedValue"),
  ).annotations({ identifier: "MinimumEngineVersionPerAllowedValue" }),
);
export interface Range {
  From?: number;
  To?: number;
  Step?: number;
}
export const Range = S.suspend(() =>
  S.Struct({
    From: S.optional(S.Number),
    To: S.optional(S.Number),
    Step: S.optional(S.Number),
  }),
).annotations({ identifier: "Range" }) as any as S.Schema<Range>;
export type RangeList = Range[];
export const RangeList = S.Array(
  Range.pipe(T.XmlName("Range")).annotations({ identifier: "Range" }),
);
export interface DoubleRange {
  From?: number;
  To?: number;
}
export const DoubleRange = S.suspend(() =>
  S.Struct({ From: S.optional(S.Number), To: S.optional(S.Number) }),
).annotations({ identifier: "DoubleRange" }) as any as S.Schema<DoubleRange>;
export type DoubleRangeList = DoubleRange[];
export const DoubleRangeList = S.Array(
  DoubleRange.pipe(T.XmlName("DoubleRange")).annotations({
    identifier: "DoubleRange",
  }),
);
export interface ValidStorageOptions {
  StorageType?: string;
  StorageSize?: Range[];
  ProvisionedIops?: Range[];
  IopsToStorageRatio?: DoubleRange[];
  ProvisionedStorageThroughput?: Range[];
  StorageThroughputToIopsRatio?: DoubleRange[];
  SupportsStorageAutoscaling?: boolean;
}
export const ValidStorageOptions = S.suspend(() =>
  S.Struct({
    StorageType: S.optional(S.String),
    StorageSize: S.optional(RangeList),
    ProvisionedIops: S.optional(RangeList),
    IopsToStorageRatio: S.optional(DoubleRangeList),
    ProvisionedStorageThroughput: S.optional(RangeList),
    StorageThroughputToIopsRatio: S.optional(DoubleRangeList),
    SupportsStorageAutoscaling: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ValidStorageOptions",
}) as any as S.Schema<ValidStorageOptions>;
export type ValidStorageOptionsList = ValidStorageOptions[];
export const ValidStorageOptionsList = S.Array(
  ValidStorageOptions.pipe(T.XmlName("ValidStorageOptions")).annotations({
    identifier: "ValidStorageOptions",
  }),
);
export interface ValidVolumeOptions {
  VolumeName?: string;
  Storage?: ValidStorageOptions[];
}
export const ValidVolumeOptions = S.suspend(() =>
  S.Struct({
    VolumeName: S.optional(S.String),
    Storage: S.optional(ValidStorageOptionsList),
  }),
).annotations({
  identifier: "ValidVolumeOptions",
}) as any as S.Schema<ValidVolumeOptions>;
export type ValidVolumeOptionsList = ValidVolumeOptions[];
export const ValidVolumeOptionsList = S.Array(ValidVolumeOptions);
export interface ApplyPendingMaintenanceActionResult {
  ResourcePendingMaintenanceActions?: ResourcePendingMaintenanceActions;
}
export const ApplyPendingMaintenanceActionResult = S.suspend(() =>
  S.Struct({
    ResourcePendingMaintenanceActions: S.optional(
      ResourcePendingMaintenanceActions,
    ),
  }).pipe(ns),
).annotations({
  identifier: "ApplyPendingMaintenanceActionResult",
}) as any as S.Schema<ApplyPendingMaintenanceActionResult>;
export interface AuthorizeDBSecurityGroupIngressResult {
  DBSecurityGroup?: DBSecurityGroup;
}
export const AuthorizeDBSecurityGroupIngressResult = S.suspend(() =>
  S.Struct({ DBSecurityGroup: S.optional(DBSecurityGroup) }).pipe(ns),
).annotations({
  identifier: "AuthorizeDBSecurityGroupIngressResult",
}) as any as S.Schema<AuthorizeDBSecurityGroupIngressResult>;
export interface CopyOptionGroupResult {
  OptionGroup?: OptionGroup;
}
export const CopyOptionGroupResult = S.suspend(() =>
  S.Struct({ OptionGroup: S.optional(OptionGroup) }).pipe(ns),
).annotations({
  identifier: "CopyOptionGroupResult",
}) as any as S.Schema<CopyOptionGroupResult>;
export interface CreateBlueGreenDeploymentResponse {
  BlueGreenDeployment?: BlueGreenDeployment;
}
export const CreateBlueGreenDeploymentResponse = S.suspend(() =>
  S.Struct({ BlueGreenDeployment: S.optional(BlueGreenDeployment) }).pipe(ns),
).annotations({
  identifier: "CreateBlueGreenDeploymentResponse",
}) as any as S.Schema<CreateBlueGreenDeploymentResponse>;
export interface CreateGlobalClusterResult {
  GlobalCluster?: GlobalCluster;
}
export const CreateGlobalClusterResult = S.suspend(() =>
  S.Struct({ GlobalCluster: S.optional(GlobalCluster) }).pipe(ns),
).annotations({
  identifier: "CreateGlobalClusterResult",
}) as any as S.Schema<CreateGlobalClusterResult>;
export interface CreateTenantDatabaseResult {
  TenantDatabase?: TenantDatabase;
}
export const CreateTenantDatabaseResult = S.suspend(() =>
  S.Struct({ TenantDatabase: S.optional(TenantDatabase) }).pipe(ns),
).annotations({
  identifier: "CreateTenantDatabaseResult",
}) as any as S.Schema<CreateTenantDatabaseResult>;
export interface DeleteDBClusterResult {
  DBCluster?: DBCluster;
}
export const DeleteDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "DeleteDBClusterResult",
}) as any as S.Schema<DeleteDBClusterResult>;
export interface DeleteDBClusterAutomatedBackupResult {
  DBClusterAutomatedBackup?: DBClusterAutomatedBackup;
}
export const DeleteDBClusterAutomatedBackupResult = S.suspend(() =>
  S.Struct({
    DBClusterAutomatedBackup: S.optional(DBClusterAutomatedBackup),
  }).pipe(ns),
).annotations({
  identifier: "DeleteDBClusterAutomatedBackupResult",
}) as any as S.Schema<DeleteDBClusterAutomatedBackupResult>;
export interface DeleteDBProxyResponse {
  DBProxy?: DBProxy;
}
export const DeleteDBProxyResponse = S.suspend(() =>
  S.Struct({ DBProxy: S.optional(DBProxy) }).pipe(ns),
).annotations({
  identifier: "DeleteDBProxyResponse",
}) as any as S.Schema<DeleteDBProxyResponse>;
export interface DescribeDBClusterSnapshotAttributesResult {
  DBClusterSnapshotAttributesResult?: DBClusterSnapshotAttributesResult;
}
export const DescribeDBClusterSnapshotAttributesResult = S.suspend(() =>
  S.Struct({
    DBClusterSnapshotAttributesResult: S.optional(
      DBClusterSnapshotAttributesResult,
    ),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDBClusterSnapshotAttributesResult",
}) as any as S.Schema<DescribeDBClusterSnapshotAttributesResult>;
export interface DescribeDBMajorEngineVersionsResponse {
  DBMajorEngineVersions?: (DBMajorEngineVersion & {
    SupportedEngineLifecycles: (SupportedEngineLifecycle & {
      LifecycleSupportName: LifecycleSupportName;
      LifecycleSupportStartDate: Date;
      LifecycleSupportEndDate: Date;
    })[];
  })[];
  Marker?: string;
}
export const DescribeDBMajorEngineVersionsResponse = S.suspend(() =>
  S.Struct({
    DBMajorEngineVersions: S.optional(DBMajorEngineVersionsList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDBMajorEngineVersionsResponse",
}) as any as S.Schema<DescribeDBMajorEngineVersionsResponse>;
export interface DescribeDBProxyTargetGroupsResponse {
  TargetGroups?: DBProxyTargetGroup[];
  Marker?: string;
}
export const DescribeDBProxyTargetGroupsResponse = S.suspend(() =>
  S.Struct({
    TargetGroups: S.optional(TargetGroupList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDBProxyTargetGroupsResponse",
}) as any as S.Schema<DescribeDBProxyTargetGroupsResponse>;
export interface DescribeDBProxyTargetsResponse {
  Targets?: DBProxyTarget[];
  Marker?: string;
}
export const DescribeDBProxyTargetsResponse = S.suspend(() =>
  S.Struct({
    Targets: S.optional(TargetList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDBProxyTargetsResponse",
}) as any as S.Schema<DescribeDBProxyTargetsResponse>;
export interface DescribeDBSnapshotAttributesResult {
  DBSnapshotAttributesResult?: DBSnapshotAttributesResult;
}
export const DescribeDBSnapshotAttributesResult = S.suspend(() =>
  S.Struct({
    DBSnapshotAttributesResult: S.optional(DBSnapshotAttributesResult),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDBSnapshotAttributesResult",
}) as any as S.Schema<DescribeDBSnapshotAttributesResult>;
export interface OrderableDBInstanceOptionsMessage {
  OrderableDBInstanceOptions?: OrderableDBInstanceOption[];
  Marker?: string;
}
export const OrderableDBInstanceOptionsMessage = S.suspend(() =>
  S.Struct({
    OrderableDBInstanceOptions: S.optional(OrderableDBInstanceOptionsList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "OrderableDBInstanceOptionsMessage",
}) as any as S.Schema<OrderableDBInstanceOptionsMessage>;
export interface ReservedDBInstanceMessage {
  Marker?: string;
  ReservedDBInstances?: ReservedDBInstance[];
}
export const ReservedDBInstanceMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ReservedDBInstances: S.optional(ReservedDBInstanceList),
  }).pipe(ns),
).annotations({
  identifier: "ReservedDBInstanceMessage",
}) as any as S.Schema<ReservedDBInstanceMessage>;
export interface ModifyOptionGroupResult {
  OptionGroup?: OptionGroup;
}
export const ModifyOptionGroupResult = S.suspend(() =>
  S.Struct({ OptionGroup: S.optional(OptionGroup) }).pipe(ns),
).annotations({
  identifier: "ModifyOptionGroupResult",
}) as any as S.Schema<ModifyOptionGroupResult>;
export interface OptionGroupOptionSetting {
  SettingName?: string;
  SettingDescription?: string;
  DefaultValue?: string;
  ApplyType?: string;
  AllowedValues?: string;
  IsModifiable?: boolean;
  IsRequired?: boolean;
  MinimumEngineVersionPerAllowedValue?: MinimumEngineVersionPerAllowedValue[];
}
export const OptionGroupOptionSetting = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "OptionGroupOptionSetting",
}) as any as S.Schema<OptionGroupOptionSetting>;
export type OptionGroupOptionSettingsList = OptionGroupOptionSetting[];
export const OptionGroupOptionSettingsList = S.Array(
  OptionGroupOptionSetting.pipe(
    T.XmlName("OptionGroupOptionSetting"),
  ).annotations({ identifier: "OptionGroupOptionSetting" }),
);
export interface ValidAdditionalStorageOptions {
  SupportsAdditionalStorageVolumes?: boolean;
  Volumes?: ValidVolumeOptions[];
}
export const ValidAdditionalStorageOptions = S.suspend(() =>
  S.Struct({
    SupportsAdditionalStorageVolumes: S.optional(S.Boolean),
    Volumes: S.optional(ValidVolumeOptionsList),
  }),
).annotations({
  identifier: "ValidAdditionalStorageOptions",
}) as any as S.Schema<ValidAdditionalStorageOptions>;
export interface OptionGroupOption {
  Name?: string;
  Description?: string;
  EngineName?: string;
  MajorEngineVersion?: string;
  MinimumRequiredMinorEngineVersion?: string;
  PortRequired?: boolean;
  DefaultPort?: number;
  OptionsDependedOn?: string[];
  OptionsConflictsWith?: string[];
  Persistent?: boolean;
  Permanent?: boolean;
  RequiresAutoMinorEngineVersionUpgrade?: boolean;
  VpcOnly?: boolean;
  SupportsOptionVersionDowngrade?: boolean;
  OptionGroupOptionSettings?: OptionGroupOptionSetting[];
  OptionGroupOptionVersions?: OptionVersion[];
  CopyableCrossAccount?: boolean;
}
export const OptionGroupOption = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "OptionGroupOption",
}) as any as S.Schema<OptionGroupOption>;
export type OptionGroupOptionsList = OptionGroupOption[];
export const OptionGroupOptionsList = S.Array(
  OptionGroupOption.pipe(T.XmlName("OptionGroupOption")).annotations({
    identifier: "OptionGroupOption",
  }),
);
export interface ValidDBInstanceModificationsMessage {
  Storage?: ValidStorageOptions[];
  ValidProcessorFeatures?: AvailableProcessorFeature[];
  SupportsDedicatedLogVolume?: boolean;
  AdditionalStorage?: ValidAdditionalStorageOptions;
}
export const ValidDBInstanceModificationsMessage = S.suspend(() =>
  S.Struct({
    Storage: S.optional(ValidStorageOptionsList),
    ValidProcessorFeatures: S.optional(AvailableProcessorFeatureList),
    SupportsDedicatedLogVolume: S.optional(S.Boolean),
    AdditionalStorage: S.optional(ValidAdditionalStorageOptions),
  }),
).annotations({
  identifier: "ValidDBInstanceModificationsMessage",
}) as any as S.Schema<ValidDBInstanceModificationsMessage>;
export interface CreateDBInstanceReadReplicaResult {
  DBInstance?: DBInstance & {
    PendingModifiedValues: PendingModifiedValues & {
      AdditionalStorageVolumes: (AdditionalStorageVolume & {
        VolumeName: string;
      })[];
    };
  };
}
export const CreateDBInstanceReadReplicaResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "CreateDBInstanceReadReplicaResult",
}) as any as S.Schema<CreateDBInstanceReadReplicaResult>;
export interface CreateDBSubnetGroupResult {
  DBSubnetGroup?: DBSubnetGroup;
}
export const CreateDBSubnetGroupResult = S.suspend(() =>
  S.Struct({ DBSubnetGroup: S.optional(DBSubnetGroup) }).pipe(ns),
).annotations({
  identifier: "CreateDBSubnetGroupResult",
}) as any as S.Schema<CreateDBSubnetGroupResult>;
export interface OptionGroupOptionsMessage {
  OptionGroupOptions?: OptionGroupOption[];
  Marker?: string;
}
export const OptionGroupOptionsMessage = S.suspend(() =>
  S.Struct({
    OptionGroupOptions: S.optional(OptionGroupOptionsList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "OptionGroupOptionsMessage",
}) as any as S.Schema<OptionGroupOptionsMessage>;
export interface DescribeValidDBInstanceModificationsResult {
  ValidDBInstanceModificationsMessage?: ValidDBInstanceModificationsMessage;
}
export const DescribeValidDBInstanceModificationsResult = S.suspend(() =>
  S.Struct({
    ValidDBInstanceModificationsMessage: S.optional(
      ValidDBInstanceModificationsMessage,
    ),
  }).pipe(ns),
).annotations({
  identifier: "DescribeValidDBInstanceModificationsResult",
}) as any as S.Schema<DescribeValidDBInstanceModificationsResult>;
export type DBRecommendationList = DBRecommendation[];
export const DBRecommendationList = S.Array(DBRecommendation);
export interface DBRecommendationsMessage {
  DBRecommendations?: DBRecommendation[];
  Marker?: string;
}
export const DBRecommendationsMessage = S.suspend(() =>
  S.Struct({
    DBRecommendations: S.optional(DBRecommendationList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DBRecommendationsMessage",
}) as any as S.Schema<DBRecommendationsMessage>;

//# Errors
export class DBClusterNotFoundFault extends S.TaggedError<DBClusterNotFoundFault>()(
  "DBClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBClusterNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBInstanceNotFoundFault extends S.TaggedError<DBInstanceNotFoundFault>()(
  "DBInstanceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class CustomDBEngineVersionNotFoundFault extends S.TaggedError<CustomDBEngineVersionNotFoundFault>()(
  "CustomDBEngineVersionNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomDBEngineVersionNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterEndpointNotFoundFault extends S.TaggedError<DBClusterEndpointNotFoundFault>()(
  "DBClusterEndpointNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterEndpointNotFoundFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBParameterGroupNotFoundFault extends S.TaggedError<DBParameterGroupNotFoundFault>()(
  "DBParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBParameterGroupNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBSecurityGroupNotFoundFault extends S.TaggedError<DBSecurityGroupNotFoundFault>()(
  "DBSecurityGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSecurityGroupNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBShardGroupNotFoundFault extends S.TaggedError<DBShardGroupNotFoundFault>()(
  "DBShardGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBShardGroupNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBSubnetGroupNotFoundFault extends S.TaggedError<DBSubnetGroupNotFoundFault>()(
  "DBSubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidOptionGroupStateFault extends S.TaggedError<InvalidOptionGroupStateFault>()(
  "InvalidOptionGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidOptionGroupStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBProxyNotFoundFault extends S.TaggedError<DBProxyNotFoundFault>()(
  "DBProxyNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBProxyNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBShardGroupAlreadyExistsFault extends S.TaggedError<DBShardGroupAlreadyExistsFault>()(
  "DBShardGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBShardGroupAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IntegrationConflictOperationFault extends S.TaggedError<IntegrationConflictOperationFault>()(
  "IntegrationConflictOperationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationConflictOperationFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class BlueGreenDeploymentNotFoundFault extends S.TaggedError<BlueGreenDeploymentNotFoundFault>()(
  "BlueGreenDeploymentNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "BlueGreenDeploymentNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterRoleAlreadyExistsFault extends S.TaggedError<DBClusterRoleAlreadyExistsFault>()(
  "DBClusterRoleAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterRoleAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBInstanceRoleAlreadyExistsFault extends S.TaggedError<DBInstanceRoleAlreadyExistsFault>()(
  "DBInstanceRoleAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBInstanceRoleAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBClusterStateFault extends S.TaggedError<InvalidDBClusterStateFault>()(
  "InvalidDBClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ExportTaskNotFoundFault extends S.TaggedError<ExportTaskNotFoundFault>()(
  "ExportTaskNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ExportTaskNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBClusterEndpointAlreadyExistsFault extends S.TaggedError<DBClusterEndpointAlreadyExistsFault>()(
  "DBClusterEndpointAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterEndpointAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBParameterGroupAlreadyExistsFault extends S.TaggedError<DBParameterGroupAlreadyExistsFault>()(
  "DBParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBParameterGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterSnapshotAlreadyExistsFault extends S.TaggedError<DBClusterSnapshotAlreadyExistsFault>()(
  "DBClusterSnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterSnapshotAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSecurityGroupAlreadyExistsFault extends S.TaggedError<DBSecurityGroupAlreadyExistsFault>()(
  "DBSecurityGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSecurityGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSnapshotAlreadyExistsFault extends S.TaggedError<DBSnapshotAlreadyExistsFault>()(
  "DBSnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EventSubscriptionQuotaExceededFault extends S.TaggedError<EventSubscriptionQuotaExceededFault>()(
  "EventSubscriptionQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventSubscriptionQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class IntegrationAlreadyExistsFault extends S.TaggedError<IntegrationAlreadyExistsFault>()(
  "IntegrationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class OptionGroupAlreadyExistsFault extends S.TaggedError<OptionGroupAlreadyExistsFault>()(
  "OptionGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OptionGroupAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidCustomDBEngineVersionStateFault extends S.TaggedError<InvalidCustomDBEngineVersionStateFault>()(
  "InvalidCustomDBEngineVersionStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCustomDBEngineVersionStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBClusterEndpointStateFault extends S.TaggedError<InvalidDBClusterEndpointStateFault>()(
  "InvalidDBClusterEndpointStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterEndpointStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBParameterGroupStateFault extends S.TaggedError<InvalidDBParameterGroupStateFault>()(
  "InvalidDBParameterGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBParameterGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterSnapshotNotFoundFault extends S.TaggedError<DBClusterSnapshotNotFoundFault>()(
  "DBClusterSnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterSnapshotNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class DBInstanceAutomatedBackupQuotaExceededFault extends S.TaggedError<DBInstanceAutomatedBackupQuotaExceededFault>()(
  "DBInstanceAutomatedBackupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBInstanceAutomatedBackupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBProxyEndpointNotFoundFault extends S.TaggedError<DBProxyEndpointNotFoundFault>()(
  "DBProxyEndpointNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBProxyEndpointNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBSecurityGroupStateFault extends S.TaggedError<InvalidDBSecurityGroupStateFault>()(
  "InvalidDBSecurityGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBSecurityGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSnapshotNotFoundFault extends S.TaggedError<DBSnapshotNotFoundFault>()(
  "DBSnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBSubnetGroupStateFault extends S.TaggedError<InvalidDBSubnetGroupStateFault>()(
  "InvalidDBSubnetGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBSubnetGroupStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidEventSubscriptionStateFault extends S.TaggedError<InvalidEventSubscriptionStateFault>()(
  "InvalidEventSubscriptionStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidEventSubscriptionState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class GlobalClusterNotFoundFault extends S.TaggedError<GlobalClusterNotFoundFault>()(
  "GlobalClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class OptionGroupNotFoundFault extends S.TaggedError<OptionGroupNotFoundFault>()(
  "OptionGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "OptionGroupNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBProxyTargetGroupNotFoundFault extends S.TaggedError<DBProxyTargetGroupNotFoundFault>()(
  "DBProxyTargetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBProxyTargetGroupNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterAutomatedBackupNotFoundFault extends S.TaggedError<DBClusterAutomatedBackupNotFoundFault>()(
  "DBClusterAutomatedBackupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterAutomatedBackupNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterBacktrackNotFoundFault extends S.TaggedError<DBClusterBacktrackNotFoundFault>()(
  "DBClusterBacktrackNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterBacktrackNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class DBInstanceAutomatedBackupNotFoundFault extends S.TaggedError<DBInstanceAutomatedBackupNotFoundFault>()(
  "DBInstanceAutomatedBackupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBInstanceAutomatedBackupNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class SubscriptionNotFoundFault extends S.TaggedError<SubscriptionNotFoundFault>()(
  "SubscriptionNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class IntegrationNotFoundFault extends S.TaggedError<IntegrationNotFoundFault>()(
  "IntegrationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "IntegrationNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundFault extends S.TaggedError<ResourceNotFoundFault>()(
  "ResourceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidResourceStateFault extends S.TaggedError<InvalidResourceStateFault>()(
  "InvalidResourceStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidResourceStateFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBInstanceNotReadyFault extends S.TaggedError<DBInstanceNotReadyFault>()(
  "DBInstanceNotReadyFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceNotReady", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBInstanceStateFault extends S.TaggedError<InvalidDBInstanceStateFault>()(
  "InvalidDBInstanceStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBInstanceState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CertificateNotFoundFault extends S.TaggedError<CertificateNotFoundFault>()(
  "CertificateNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "CertificateNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBClusterCapacityFault extends S.TaggedError<InvalidDBClusterCapacityFault>()(
  "InvalidDBClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterCapacityFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBProxyAlreadyExistsFault extends S.TaggedError<DBProxyAlreadyExistsFault>()(
  "DBProxyAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBProxyAlreadyExistsFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBProxyEndpointAlreadyExistsFault extends S.TaggedError<DBProxyEndpointAlreadyExistsFault>()(
  "DBProxyEndpointAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBProxyEndpointAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSubnetGroupDoesNotCoverEnoughAZs extends S.TaggedError<DBSubnetGroupDoesNotCoverEnoughAZs>()(
  "DBSubnetGroupDoesNotCoverEnoughAZs",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupDoesNotCoverEnoughAZs",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class GlobalClusterAlreadyExistsFault extends S.TaggedError<GlobalClusterAlreadyExistsFault>()(
  "GlobalClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedDBInstanceAlreadyExistsFault extends S.TaggedError<ReservedDBInstanceAlreadyExistsFault>()(
  "ReservedDBInstanceAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedDBInstanceAlreadyExists",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class DBProxyTargetAlreadyRegisteredFault extends S.TaggedError<DBProxyTargetAlreadyRegisteredFault>()(
  "DBProxyTargetAlreadyRegisteredFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBProxyTargetAlreadyRegisteredFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SourceNotFoundFault extends S.TaggedError<SourceNotFoundFault>()(
  "SourceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SourceNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBClusterAlreadyExistsFault extends S.TaggedError<DBClusterAlreadyExistsFault>()(
  "DBClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AuthorizationNotFoundFault extends S.TaggedError<AuthorizationNotFoundFault>()(
  "AuthorizationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AuthorizationNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidBlueGreenDeploymentStateFault extends S.TaggedError<InvalidBlueGreenDeploymentStateFault>()(
  "InvalidBlueGreenDeploymentStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidBlueGreenDeploymentStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterRoleNotFoundFault extends S.TaggedError<DBClusterRoleNotFoundFault>()(
  "DBClusterRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBClusterRoleNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBInstanceRoleNotFoundFault extends S.TaggedError<DBInstanceRoleNotFoundFault>()(
  "DBInstanceRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceRoleNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBShardGroupStateFault extends S.TaggedError<InvalidDBShardGroupStateFault>()(
  "InvalidDBShardGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBShardGroupState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBClusterRoleQuotaExceededFault extends S.TaggedError<DBClusterRoleQuotaExceededFault>()(
  "DBClusterRoleQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterRoleQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBInstanceRoleQuotaExceededFault extends S.TaggedError<DBInstanceRoleQuotaExceededFault>()(
  "DBInstanceRoleQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBInstanceRoleQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidExportTaskStateFault extends S.TaggedError<InvalidExportTaskStateFault>()(
  "InvalidExportTaskStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidExportTaskStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CustomAvailabilityZoneNotFoundFault extends S.TaggedError<CustomAvailabilityZoneNotFoundFault>()(
  "CustomAvailabilityZoneNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomAvailabilityZoneNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class CreateCustomDBEngineVersionFault extends S.TaggedError<CreateCustomDBEngineVersionFault>()(
  "CreateCustomDBEngineVersionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CreateCustomDBEngineVersionFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterEndpointQuotaExceededFault extends S.TaggedError<DBClusterEndpointQuotaExceededFault>()(
  "DBClusterEndpointQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterEndpointQuotaExceededFault",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class DBParameterGroupQuotaExceededFault extends S.TaggedError<DBParameterGroupQuotaExceededFault>()(
  "DBParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBClusterSnapshotStateFault extends S.TaggedError<InvalidDBClusterSnapshotStateFault>()(
  "InvalidDBClusterSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterSnapshotStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSecurityGroupNotSupportedFault extends S.TaggedError<DBSecurityGroupNotSupportedFault>()(
  "DBSecurityGroupNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSecurityGroupNotSupported",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SNSInvalidTopicFault extends S.TaggedError<SNSInvalidTopicFault>()(
  "SNSInvalidTopicFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSInvalidTopic", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IntegrationQuotaExceededFault extends S.TaggedError<IntegrationQuotaExceededFault>()(
  "IntegrationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class OptionGroupQuotaExceededFault extends S.TaggedError<OptionGroupQuotaExceededFault>()(
  "OptionGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OptionGroupQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBProxyEndpointStateFault extends S.TaggedError<InvalidDBProxyEndpointStateFault>()(
  "InvalidDBProxyEndpointStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBProxyEndpointStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBSnapshotStateFault extends S.TaggedError<InvalidDBSnapshotStateFault>()(
  "InvalidDBSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSnapshotState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBSubnetStateFault extends S.TaggedError<InvalidDBSubnetStateFault>()(
  "InvalidDBSubnetStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSubnetStateFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidGlobalClusterStateFault extends S.TaggedError<InvalidGlobalClusterStateFault>()(
  "InvalidGlobalClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidGlobalClusterStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBProxyTargetNotFoundFault extends S.TaggedError<DBProxyTargetNotFoundFault>()(
  "DBProxyTargetNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBProxyTargetNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedDBInstancesOfferingNotFoundFault extends S.TaggedError<ReservedDBInstancesOfferingNotFoundFault>()(
  "ReservedDBInstancesOfferingNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedDBInstancesOfferingNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class DBLogFileNotFoundFault extends S.TaggedError<DBLogFileNotFoundFault>()(
  "DBLogFileNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBLogFileNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBProxyStateFault extends S.TaggedError<InvalidDBProxyStateFault>()(
  "InvalidDBProxyStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBProxyStateFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBSubnetQuotaExceededFault extends S.TaggedError<DBSubnetQuotaExceededFault>()(
  "DBSubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedDBInstanceQuotaExceededFault extends S.TaggedError<ReservedDBInstanceQuotaExceededFault>()(
  "ReservedDBInstanceQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedDBInstanceQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InsufficientAvailableIPsInSubnetFault extends S.TaggedError<InsufficientAvailableIPsInSubnetFault>()(
  "InsufficientAvailableIPsInSubnetFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientAvailableIPsInSubnetFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterParameterGroupNotFoundFault extends S.TaggedError<DBClusterParameterGroupNotFoundFault>()(
  "DBClusterParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterParameterGroupNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class BackupPolicyNotFoundFault extends S.TaggedError<BackupPolicyNotFoundFault>()(
  "BackupPolicyNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "BackupPolicyNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class KMSKeyNotAccessibleFault extends S.TaggedError<KMSKeyNotAccessibleFault>()(
  "KMSKeyNotAccessibleFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSKeyNotAccessibleFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TenantDatabaseNotFoundFault extends S.TaggedError<TenantDatabaseNotFoundFault>()(
  "TenantDatabaseNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TenantDatabaseNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class SnapshotQuotaExceededFault extends S.TaggedError<SnapshotQuotaExceededFault>()(
  "SnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ExportTaskAlreadyExistsFault extends S.TaggedError<ExportTaskAlreadyExistsFault>()(
  "ExportTaskAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ExportTaskAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBInstanceAutomatedBackupStateFault extends S.TaggedError<InvalidDBInstanceAutomatedBackupStateFault>()(
  "InvalidDBInstanceAutomatedBackupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBInstanceAutomatedBackupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSnapshotTenantDatabaseNotFoundFault extends S.TaggedError<DBSnapshotTenantDatabaseNotFoundFault>()(
  "DBSnapshotTenantDatabaseNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSnapshotTenantDatabaseNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidIntegrationStateFault extends S.TaggedError<InvalidIntegrationStateFault>()(
  "InvalidIntegrationStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidIntegrationStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBProxyQuotaExceededFault extends S.TaggedError<DBProxyQuotaExceededFault>()(
  "DBProxyQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBProxyQuotaExceededFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBProxyEndpointQuotaExceededFault extends S.TaggedError<DBProxyEndpointQuotaExceededFault>()(
  "DBProxyEndpointQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBProxyEndpointQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InsufficientDBInstanceCapacityFault extends S.TaggedError<InsufficientDBInstanceCapacityFault>()(
  "InsufficientDBInstanceCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDBInstanceCapacity",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AuthorizationAlreadyExistsFault extends S.TaggedError<AuthorizationAlreadyExistsFault>()(
  "AuthorizationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthorizationAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class BlueGreenDeploymentAlreadyExistsFault extends S.TaggedError<BlueGreenDeploymentAlreadyExistsFault>()(
  "BlueGreenDeploymentAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "BlueGreenDeploymentAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CustomDBEngineVersionAlreadyExistsFault extends S.TaggedError<CustomDBEngineVersionAlreadyExistsFault>()(
  "CustomDBEngineVersionAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomDBEngineVersionAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSecurityGroupQuotaExceededFault extends S.TaggedError<DBSecurityGroupQuotaExceededFault>()(
  "DBSecurityGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "QuotaExceeded.DBSecurityGroup",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SNSNoAuthorizationFault extends S.TaggedError<SNSNoAuthorizationFault>()(
  "SNSNoAuthorizationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSNoAuthorization", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class GlobalClusterQuotaExceededFault extends S.TaggedError<GlobalClusterQuotaExceededFault>()(
  "GlobalClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBClusterAutomatedBackupQuotaExceededFault extends S.TaggedError<DBClusterAutomatedBackupQuotaExceededFault>()(
  "DBClusterAutomatedBackupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterAutomatedBackupQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBClusterAutomatedBackupStateFault extends S.TaggedError<InvalidDBClusterAutomatedBackupStateFault>()(
  "InvalidDBClusterAutomatedBackupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterAutomatedBackupStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedDBInstanceNotFoundFault extends S.TaggedError<ReservedDBInstanceNotFoundFault>()(
  "ReservedDBInstanceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedDBInstanceNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBClusterQuotaExceededFault extends S.TaggedError<DBClusterQuotaExceededFault>()(
  "DBClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterQuotaExceededFault",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class DBInstanceAlreadyExistsFault extends S.TaggedError<DBInstanceAlreadyExistsFault>()(
  "DBInstanceAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class MaxDBShardGroupLimitReached extends S.TaggedError<MaxDBShardGroupLimitReached>()(
  "MaxDBShardGroupLimitReached",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "MaxDBShardGroupLimitReached",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SharedSnapshotQuotaExceededFault extends S.TaggedError<SharedSnapshotQuotaExceededFault>()(
  "SharedSnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SharedSnapshotQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class IamRoleMissingPermissionsFault extends S.TaggedError<IamRoleMissingPermissionsFault>()(
  "IamRoleMissingPermissionsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "IamRoleMissingPermissions", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class StorageTypeNotSupportedFault extends S.TaggedError<StorageTypeNotSupportedFault>()(
  "StorageTypeNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageTypeNotSupported", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TenantDatabaseAlreadyExistsFault extends S.TaggedError<TenantDatabaseAlreadyExistsFault>()(
  "TenantDatabaseAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TenantDatabaseAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class VpcEncryptionControlViolationException extends S.TaggedError<VpcEncryptionControlViolationException>()(
  "VpcEncryptionControlViolationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "VpcEncryptionControlViolationException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AuthorizationQuotaExceededFault extends S.TaggedError<AuthorizationQuotaExceededFault>()(
  "AuthorizationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthorizationQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CustomDBEngineVersionQuotaExceededFault extends S.TaggedError<CustomDBEngineVersionQuotaExceededFault>()(
  "CustomDBEngineVersionQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomDBEngineVersionQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSubnetGroupAlreadyExistsFault extends S.TaggedError<DBSubnetGroupAlreadyExistsFault>()(
  "DBSubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SNSTopicArnNotFoundFault extends S.TaggedError<SNSTopicArnNotFoundFault>()(
  "SNSTopicArnNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSTopicArnNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class SubnetAlreadyInUse extends S.TaggedError<SubnetAlreadyInUse>()(
  "SubnetAlreadyInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetAlreadyInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DomainNotFoundFault extends S.TaggedError<DomainNotFoundFault>()(
  "DomainNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DomainNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class NetworkTypeNotSupported extends S.TaggedError<NetworkTypeNotSupported>()(
  "NetworkTypeNotSupported",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NetworkTypeNotSupported", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IamRoleNotFoundFault extends S.TaggedError<IamRoleNotFoundFault>()(
  "IamRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "IamRoleNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InstanceQuotaExceededFault extends S.TaggedError<InstanceQuotaExceededFault>()(
  "InstanceQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InstanceQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBUpgradeDependencyFailureFault extends S.TaggedError<DBUpgradeDependencyFailureFault>()(
  "DBUpgradeDependencyFailureFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBUpgradeDependencyFailure",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSubnetGroupNotAllowedFault extends S.TaggedError<DBSubnetGroupNotAllowedFault>()(
  "DBSubnetGroupNotAllowedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupNotAllowedFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TenantDatabaseQuotaExceededFault extends S.TaggedError<TenantDatabaseQuotaExceededFault>()(
  "TenantDatabaseQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TenantDatabaseQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class Ec2ImagePropertiesNotSupportedFault extends S.TaggedError<Ec2ImagePropertiesNotSupportedFault>()(
  "Ec2ImagePropertiesNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "Ec2ImagePropertiesNotSupportedFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSubnetGroupQuotaExceededFault extends S.TaggedError<DBSubnetGroupQuotaExceededFault>()(
  "DBSubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubscriptionAlreadyExistFault extends S.TaggedError<SubscriptionAlreadyExistFault>()(
  "SubscriptionAlreadyExistFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionAlreadyExist", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientStorageClusterCapacityFault extends S.TaggedError<InsufficientStorageClusterCapacityFault>()(
  "InsufficientStorageClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientStorageClusterCapacity",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class UnsupportedDBEngineVersionFault extends S.TaggedError<UnsupportedDBEngineVersionFault>()(
  "UnsupportedDBEngineVersionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnsupportedDBEngineVersion",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubscriptionCategoryNotFoundFault extends S.TaggedError<SubscriptionCategoryNotFoundFault>()(
  "SubscriptionCategoryNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SubscriptionCategoryNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidExportOnlyFault extends S.TaggedError<InvalidExportOnlyFault>()(
  "InvalidExportOnlyFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidExportOnly", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SourceClusterNotSupportedFault extends S.TaggedError<SourceClusterNotSupportedFault>()(
  "SourceClusterNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SourceClusterNotSupportedFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidRestoreFault extends S.TaggedError<InvalidRestoreFault>()(
  "InvalidRestoreFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRestoreFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientDBClusterCapacityFault extends S.TaggedError<InsufficientDBClusterCapacityFault>()(
  "InsufficientDBClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDBClusterCapacityFault",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class StorageQuotaExceededFault extends S.TaggedError<StorageQuotaExceededFault>()(
  "StorageQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ProvisionedIopsNotAvailableInAZFault extends S.TaggedError<ProvisionedIopsNotAvailableInAZFault>()(
  "ProvisionedIopsNotAvailableInAZFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ProvisionedIopsNotAvailableInAZFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBSubnetGroupFault extends S.TaggedError<InvalidDBSubnetGroupFault>()(
  "InvalidDBSubnetGroupFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSubnetGroupFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidS3BucketFault extends S.TaggedError<InvalidS3BucketFault>()(
  "InvalidS3BucketFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3BucketFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidExportSourceStateFault extends S.TaggedError<InvalidExportSourceStateFault>()(
  "InvalidExportSourceStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidExportSourceState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SourceDatabaseNotSupportedFault extends S.TaggedError<SourceDatabaseNotSupportedFault>()(
  "SourceDatabaseNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SourceDatabaseNotSupportedFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class StorageTypeNotAvailableFault extends S.TaggedError<StorageTypeNotAvailableFault>()(
  "StorageTypeNotAvailableFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "StorageTypeNotAvailableFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class PointInTimeRestoreNotEnabledFault extends S.TaggedError<PointInTimeRestoreNotEnabledFault>()(
  "PointInTimeRestoreNotEnabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "PointInTimeRestoreNotEnabled",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all of the attributes for a customer account. The attributes include Amazon RDS quotas for the account, such as the number of DB instances allowed. The description for a quota includes the quota name, current usage toward that quota, and the quota's maximum value.
 *
 * This command doesn't take any parameters.
 */
export const describeAccountAttributes: (
  input: DescribeAccountAttributesMessage,
) => effect.Effect<
  AccountAttributesMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountAttributesMessage,
  output: AccountAttributesMessage,
  errors: [],
}));
/**
 * Returns information about endpoints for an Amazon Aurora DB cluster.
 *
 * This action only applies to Aurora DB clusters.
 */
export const describeDBClusterEndpoints: {
  (
    input: DescribeDBClusterEndpointsMessage,
  ): effect.Effect<
    DBClusterEndpointMessage,
    DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClusterEndpointsMessage,
  ) => stream.Stream<
    DBClusterEndpointMessage,
    DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClusterEndpointsMessage,
  ) => stream.Stream<
    DBClusterEndpoint,
    DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBClusterEndpointsMessage,
  output: DBClusterEndpointMessage,
  errors: [DBClusterNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBClusterEndpoints",
    pageSize: "MaxRecords",
  } as const,
}));
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
export const describeDBClusterParameterGroups: {
  (
    input: DescribeDBClusterParameterGroupsMessage,
  ): effect.Effect<
    DBClusterParameterGroupsMessage,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClusterParameterGroupsMessage,
  ) => stream.Stream<
    DBClusterParameterGroupsMessage,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClusterParameterGroupsMessage,
  ) => stream.Stream<
    DBClusterParameterGroup,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBClusterParameterGroupsMessage,
  output: DBClusterParameterGroupsMessage,
  errors: [DBParameterGroupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBClusterParameterGroups",
    pageSize: "MaxRecords",
  } as const,
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
export const describeDBClusterParameters: {
  (
    input: DescribeDBClusterParametersMessage,
  ): effect.Effect<
    DBClusterParameterGroupDetails,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClusterParametersMessage,
  ) => stream.Stream<
    DBClusterParameterGroupDetails,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClusterParametersMessage,
  ) => stream.Stream<
    Parameter,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBClusterParametersMessage,
  output: DBClusterParameterGroupDetails,
  errors: [DBParameterGroupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Parameters",
    pageSize: "MaxRecords",
  } as const,
}));
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
export const describeDBClusters: {
  (
    input: DescribeDBClustersMessage,
  ): effect.Effect<
    DBClusterMessage,
    DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClustersMessage,
  ) => stream.Stream<
    DBClusterMessage,
    DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClustersMessage,
  ) => stream.Stream<
    DBCluster,
    DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBClustersMessage,
  output: DBClusterMessage,
  errors: [DBClusterNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBClusters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Describes the properties of specific versions of DB engines.
 */
export const describeDBEngineVersions: {
  (
    input: DescribeDBEngineVersionsMessage,
  ): effect.Effect<
    DBEngineVersionMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBEngineVersionsMessage,
  ) => stream.Stream<
    DBEngineVersionMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBEngineVersionsMessage,
  ) => stream.Stream<
    DBEngineVersion,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBEngineVersionsMessage,
  output: DBEngineVersionMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBEngineVersions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Describes provisioned RDS instances. This API supports pagination.
 *
 * This operation can also return information for Amazon Neptune DB instances and Amazon DocumentDB instances.
 */
export const describeDBInstances: {
  (
    input: DescribeDBInstancesMessage,
  ): effect.Effect<
    DBInstanceMessage,
    DBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBInstancesMessage,
  ) => stream.Stream<
    DBInstanceMessage,
    DBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBInstancesMessage,
  ) => stream.Stream<
    DBInstance,
    DBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBInstancesMessage,
  output: DBInstanceMessage,
  errors: [DBInstanceNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBInstances",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a list of `DBParameterGroup` descriptions. If a `DBParameterGroupName` is specified,
 * the list will contain only the description of the specified DB parameter group.
 */
export const describeDBParameterGroups: {
  (
    input: DescribeDBParameterGroupsMessage,
  ): effect.Effect<
    DBParameterGroupsMessage,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBParameterGroupsMessage,
  ) => stream.Stream<
    DBParameterGroupsMessage,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBParameterGroupsMessage,
  ) => stream.Stream<
    DBParameterGroup,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBParameterGroupsMessage,
  output: DBParameterGroupsMessage,
  errors: [DBParameterGroupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBParameterGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns the detailed parameter list for a particular DB parameter group.
 */
export const describeDBParameters: {
  (
    input: DescribeDBParametersMessage,
  ): effect.Effect<
    DBParameterGroupDetails,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBParametersMessage,
  ) => stream.Stream<
    DBParameterGroupDetails,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBParametersMessage,
  ) => stream.Stream<
    Parameter,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBParametersMessage,
  output: DBParameterGroupDetails,
  errors: [DBParameterGroupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Parameters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about DB proxies.
 */
export const describeDBProxies: {
  (
    input: DescribeDBProxiesRequest,
  ): effect.Effect<
    DescribeDBProxiesResponse,
    DBProxyNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBProxiesRequest,
  ) => stream.Stream<
    DescribeDBProxiesResponse,
    DBProxyNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBProxiesRequest,
  ) => stream.Stream<
    DBProxy,
    DBProxyNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBProxiesRequest,
  output: DescribeDBProxiesResponse,
  errors: [DBProxyNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBProxies",
    pageSize: "MaxRecords",
  } as const,
}));
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
export const describeDBSecurityGroups: {
  (
    input: DescribeDBSecurityGroupsMessage,
  ): effect.Effect<
    DBSecurityGroupMessage,
    DBSecurityGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBSecurityGroupsMessage,
  ) => stream.Stream<
    DBSecurityGroupMessage,
    DBSecurityGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBSecurityGroupsMessage,
  ) => stream.Stream<
    DBSecurityGroup,
    DBSecurityGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBSecurityGroupsMessage,
  output: DBSecurityGroupMessage,
  errors: [DBSecurityGroupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBSecurityGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Describes existing Aurora Limitless Database DB shard groups.
 */
export const describeDBShardGroups: (
  input: DescribeDBShardGroupsMessage,
) => effect.Effect<
  DescribeDBShardGroupsResponse,
  DBClusterNotFoundFault | DBShardGroupNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDBShardGroupsMessage,
  output: DescribeDBShardGroupsResponse,
  errors: [DBClusterNotFoundFault, DBShardGroupNotFoundFault],
}));
/**
 * Returns a list of DBSubnetGroup descriptions. If a DBSubnetGroupName is specified, the list will contain only the descriptions of the specified DBSubnetGroup.
 *
 * For an overview of CIDR ranges, go to the
 * Wikipedia Tutorial.
 */
export const describeDBSubnetGroups: {
  (
    input: DescribeDBSubnetGroupsMessage,
  ): effect.Effect<
    DBSubnetGroupMessage,
    DBSubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBSubnetGroupsMessage,
  ) => stream.Stream<
    DBSubnetGroupMessage,
    DBSubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBSubnetGroupsMessage,
  ) => stream.Stream<
    DBSubnetGroup,
    DBSubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBSubnetGroupsMessage,
  output: DBSubnetGroupMessage,
  errors: [DBSubnetGroupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBSubnetGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns the default engine and system parameter information for the specified database engine.
 */
export const describeEngineDefaultParameters: {
  (
    input: DescribeEngineDefaultParametersMessage,
  ): effect.Effect<
    DescribeEngineDefaultParametersResult,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEngineDefaultParametersMessage,
  ) => stream.Stream<
    DescribeEngineDefaultParametersResult,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEngineDefaultParametersMessage,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEngineDefaultParametersMessage,
  output: DescribeEngineDefaultParametersResult,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "EngineDefaults.Marker",
    items: "EngineDefaults.Parameters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Describes the tenant databases in a DB instance that uses the multi-tenant
 * configuration. Only RDS for Oracle CDB instances are supported.
 */
export const describeTenantDatabases: {
  (
    input: DescribeTenantDatabasesMessage,
  ): effect.Effect<
    TenantDatabasesMessage,
    DBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTenantDatabasesMessage,
  ) => stream.Stream<
    TenantDatabasesMessage,
    DBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTenantDatabasesMessage,
  ) => stream.Stream<
    TenantDatabase,
    DBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTenantDatabasesMessage,
  output: TenantDatabasesMessage,
  errors: [DBInstanceNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "TenantDatabases",
    pageSize: "MaxRecords",
  } as const,
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
export const backtrackDBCluster: (
  input: BacktrackDBClusterMessage,
) => effect.Effect<
  DBClusterBacktrack,
  DBClusterNotFoundFault | InvalidDBClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BacktrackDBClusterMessage,
  output: DBClusterBacktrack,
  errors: [DBClusterNotFoundFault, InvalidDBClusterStateFault],
}));
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
export const deleteCustomDBEngineVersion: (
  input: DeleteCustomDBEngineVersionMessage,
) => effect.Effect<
  DBEngineVersion,
  | CustomDBEngineVersionNotFoundFault
  | InvalidCustomDBEngineVersionStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomDBEngineVersionMessage,
  output: DBEngineVersion,
  errors: [
    CustomDBEngineVersionNotFoundFault,
    InvalidCustomDBEngineVersionStateFault,
  ],
}));
/**
 * Deletes a custom endpoint and removes it from an Amazon Aurora DB cluster.
 *
 * This action only applies to Aurora DB clusters.
 */
export const deleteDBClusterEndpoint: (
  input: DeleteDBClusterEndpointMessage,
) => effect.Effect<
  DBClusterEndpoint,
  | DBClusterEndpointNotFoundFault
  | InvalidDBClusterEndpointStateFault
  | InvalidDBClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBClusterEndpointMessage,
  output: DBClusterEndpoint,
  errors: [
    DBClusterEndpointNotFoundFault,
    InvalidDBClusterEndpointStateFault,
    InvalidDBClusterStateFault,
  ],
}));
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
export const deleteDBClusterParameterGroup: (
  input: DeleteDBClusterParameterGroupMessage,
) => effect.Effect<
  DeleteDBClusterParameterGroupResponse,
  | DBParameterGroupNotFoundFault
  | InvalidDBParameterGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBClusterParameterGroupMessage,
  output: DeleteDBClusterParameterGroupResponse,
  errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
}));
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
export const deleteDBSecurityGroup: (
  input: DeleteDBSecurityGroupMessage,
) => effect.Effect<
  DeleteDBSecurityGroupResponse,
  | DBSecurityGroupNotFoundFault
  | InvalidDBSecurityGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBSecurityGroupMessage,
  output: DeleteDBSecurityGroupResponse,
  errors: [DBSecurityGroupNotFoundFault, InvalidDBSecurityGroupStateFault],
}));
/**
 * Deletes an existing option group.
 */
export const deleteOptionGroup: (
  input: DeleteOptionGroupMessage,
) => effect.Effect<
  DeleteOptionGroupResponse,
  InvalidOptionGroupStateFault | OptionGroupNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOptionGroupMessage,
  output: DeleteOptionGroupResponse,
  errors: [InvalidOptionGroupStateFault, OptionGroupNotFoundFault],
}));
/**
 * Describes one or more blue/green deployments.
 *
 * For more information, see Using Amazon RDS Blue/Green Deployments
 * for database updates in the *Amazon RDS User Guide* and
 *
 * Using Amazon RDS Blue/Green Deployments for database updates in the Amazon Aurora
 * User Guide.
 */
export const describeBlueGreenDeployments: {
  (
    input: DescribeBlueGreenDeploymentsRequest,
  ): effect.Effect<
    DescribeBlueGreenDeploymentsResponse,
    BlueGreenDeploymentNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeBlueGreenDeploymentsRequest,
  ) => stream.Stream<
    DescribeBlueGreenDeploymentsResponse,
    BlueGreenDeploymentNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeBlueGreenDeploymentsRequest,
  ) => stream.Stream<
    BlueGreenDeployment,
    BlueGreenDeploymentNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeBlueGreenDeploymentsRequest,
  output: DescribeBlueGreenDeploymentsResponse,
  errors: [BlueGreenDeploymentNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "BlueGreenDeployments",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Displays backups for both current and deleted DB clusters. For example, use this operation to find details
 * about automated backups for previously deleted clusters. Current clusters are returned for both the
 * `DescribeDBClusterAutomatedBackups` and `DescribeDBClusters` operations.
 *
 * All parameters are optional.
 */
export const describeDBClusterAutomatedBackups: {
  (
    input: DescribeDBClusterAutomatedBackupsMessage,
  ): effect.Effect<
    DBClusterAutomatedBackupMessage,
    DBClusterAutomatedBackupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClusterAutomatedBackupsMessage,
  ) => stream.Stream<
    DBClusterAutomatedBackupMessage,
    DBClusterAutomatedBackupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClusterAutomatedBackupsMessage,
  ) => stream.Stream<
    DBClusterAutomatedBackup,
    DBClusterAutomatedBackupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBClusterAutomatedBackupsMessage,
  output: DBClusterAutomatedBackupMessage,
  errors: [DBClusterAutomatedBackupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBClusterAutomatedBackups",
    pageSize: "MaxRecords",
  } as const,
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
export const describeDBClusterBacktracks: {
  (
    input: DescribeDBClusterBacktracksMessage,
  ): effect.Effect<
    DBClusterBacktrackMessage,
    DBClusterBacktrackNotFoundFault | DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClusterBacktracksMessage,
  ) => stream.Stream<
    DBClusterBacktrackMessage,
    DBClusterBacktrackNotFoundFault | DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClusterBacktracksMessage,
  ) => stream.Stream<
    DBClusterBacktrack,
    DBClusterBacktrackNotFoundFault | DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBClusterBacktracksMessage,
  output: DBClusterBacktrackMessage,
  errors: [DBClusterBacktrackNotFoundFault, DBClusterNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBClusterBacktracks",
    pageSize: "MaxRecords",
  } as const,
}));
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
export const describeDBInstanceAutomatedBackups: {
  (
    input: DescribeDBInstanceAutomatedBackupsMessage,
  ): effect.Effect<
    DBInstanceAutomatedBackupMessage,
    DBInstanceAutomatedBackupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBInstanceAutomatedBackupsMessage,
  ) => stream.Stream<
    DBInstanceAutomatedBackupMessage,
    DBInstanceAutomatedBackupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBInstanceAutomatedBackupsMessage,
  ) => stream.Stream<
    DBInstanceAutomatedBackup,
    DBInstanceAutomatedBackupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBInstanceAutomatedBackupsMessage,
  output: DBInstanceAutomatedBackupMessage,
  errors: [DBInstanceAutomatedBackupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBInstanceAutomatedBackups",
    pageSize: "MaxRecords",
  } as const,
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
export const describeDBSnapshotTenantDatabases: {
  (
    input: DescribeDBSnapshotTenantDatabasesMessage,
  ): effect.Effect<
    DBSnapshotTenantDatabasesMessage,
    DBSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBSnapshotTenantDatabasesMessage,
  ) => stream.Stream<
    DBSnapshotTenantDatabasesMessage,
    DBSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBSnapshotTenantDatabasesMessage,
  ) => stream.Stream<
    DBSnapshotTenantDatabase,
    DBSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBSnapshotTenantDatabasesMessage,
  output: DBSnapshotTenantDatabasesMessage,
  errors: [DBSnapshotNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBSnapshotTenantDatabases",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns the default engine and system parameter information for the cluster database engine.
 *
 * For more information on Amazon Aurora, see
 *
 * What is Amazon Aurora? in the *Amazon Aurora User Guide*.
 */
export const describeEngineDefaultClusterParameters: (
  input: DescribeEngineDefaultClusterParametersMessage,
) => effect.Effect<
  DescribeEngineDefaultClusterParametersResult,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeEventCategories: (
  input: DescribeEventCategoriesMessage,
) => effect.Effect<
  EventCategoriesMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventCategoriesMessage,
  output: EventCategoriesMessage,
  errors: [],
}));
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
export const describeEvents: {
  (
    input: DescribeEventsMessage,
  ): effect.Effect<
    EventsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventsMessage,
  ) => stream.Stream<
    EventsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventsMessage,
  ) => stream.Stream<
    Event,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventsMessage,
  output: EventsMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Events",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Lists all the subscription descriptions for a customer account. The description for a subscription includes
 * `SubscriptionName`, `SNSTopicARN`, `CustomerID`, `SourceType`, `SourceID`, `CreationTime`, and `Status`.
 *
 * If you specify a `SubscriptionName`, lists the description for that subscription.
 */
export const describeEventSubscriptions: {
  (
    input: DescribeEventSubscriptionsMessage,
  ): effect.Effect<
    EventSubscriptionsMessage,
    SubscriptionNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventSubscriptionsMessage,
  ) => stream.Stream<
    EventSubscriptionsMessage,
    SubscriptionNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventSubscriptionsMessage,
  ) => stream.Stream<
    EventSubscription,
    SubscriptionNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventSubscriptionsMessage,
  output: EventSubscriptionsMessage,
  errors: [SubscriptionNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "EventSubscriptionsList",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Describe one or more zero-ETL integrations with Amazon Redshift.
 */
export const describeIntegrations: {
  (
    input: DescribeIntegrationsMessage,
  ): effect.Effect<
    DescribeIntegrationsResponse,
    IntegrationNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeIntegrationsMessage,
  ) => stream.Stream<
    DescribeIntegrationsResponse,
    IntegrationNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeIntegrationsMessage,
  ) => stream.Stream<
    Integration,
    IntegrationNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeIntegrationsMessage,
  output: DescribeIntegrationsResponse,
  errors: [IntegrationNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Integrations",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a list of resources (for example, DB instances) that have at least one pending maintenance action.
 *
 * This API follows an eventual consistency model. This means that the result of the
 * `DescribePendingMaintenanceActions` command might not be immediately
 * visible to all subsequent RDS commands. Keep this in mind when you use
 * `DescribePendingMaintenanceActions` immediately after using a previous
 * API command such as `ApplyPendingMaintenanceActions`.
 */
export const describePendingMaintenanceActions: {
  (
    input: DescribePendingMaintenanceActionsMessage,
  ): effect.Effect<
    PendingMaintenanceActionsMessage,
    ResourceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePendingMaintenanceActionsMessage,
  ) => stream.Stream<
    PendingMaintenanceActionsMessage,
    ResourceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribePendingMaintenanceActionsMessage,
  ) => stream.Stream<
    ResourcePendingMaintenanceActions,
    ResourceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePendingMaintenanceActionsMessage,
  output: PendingMaintenanceActionsMessage,
  errors: [ResourceNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "PendingMaintenanceActions",
    pageSize: "MaxRecords",
  } as const,
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
export const describeSourceRegions: {
  (
    input: DescribeSourceRegionsMessage,
  ): effect.Effect<
    SourceRegionMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSourceRegionsMessage,
  ) => stream.Stream<
    SourceRegionMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSourceRegionsMessage,
  ) => stream.Stream<
    SourceRegion,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSourceRegionsMessage,
  output: SourceRegionMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "SourceRegions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Disables the HTTP endpoint for the specified DB cluster. Disabling this endpoint disables RDS Data API.
 *
 * For more information, see Using RDS Data API in the
 * *Amazon Aurora User Guide*.
 *
 * This operation applies only to Aurora Serverless v2 and provisioned DB clusters. To disable the HTTP endpoint for Aurora Serverless v1 DB clusters,
 * use the `EnableHttpEndpoint` parameter of the `ModifyDBCluster` operation.
 */
export const disableHttpEndpoint: (
  input: DisableHttpEndpointRequest,
) => effect.Effect<
  DisableHttpEndpointResponse,
  InvalidResourceStateFault | ResourceNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableHttpEndpointRequest,
  output: DisableHttpEndpointResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Changes the audit policy state of a database activity stream to either locked (default) or unlocked. A locked policy is read-only,
 * whereas an unlocked policy is read/write. If your activity stream is started and locked, you can unlock it, customize your audit policy,
 * and then lock your activity stream. Restarting the activity stream isn't required. For more information, see Modifying a database activity stream in the
 * *Amazon RDS User Guide*.
 *
 * This operation is supported for RDS for Oracle and Microsoft SQL Server.
 */
export const modifyActivityStream: (
  input: ModifyActivityStreamRequest,
) => effect.Effect<
  ModifyActivityStreamResponse,
  | DBInstanceNotFoundFault
  | InvalidDBInstanceStateFault
  | ResourceNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyActivityStreamRequest,
  output: ModifyActivityStreamResponse,
  errors: [
    DBInstanceNotFoundFault,
    InvalidDBInstanceStateFault,
    ResourceNotFoundFault,
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
export const modifyCertificates: (
  input: ModifyCertificatesMessage,
) => effect.Effect<
  ModifyCertificatesResult,
  CertificateNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const modifyCurrentDBClusterCapacity: (
  input: ModifyCurrentDBClusterCapacityMessage,
) => effect.Effect<
  DBClusterCapacityInfo,
  | DBClusterNotFoundFault
  | InvalidDBClusterCapacityFault
  | InvalidDBClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyCurrentDBClusterCapacityMessage,
  output: DBClusterCapacityInfo,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterCapacityFault,
    InvalidDBClusterStateFault,
  ],
}));
/**
 * Updates the recommendation status and recommended action status for the specified recommendation.
 */
export const modifyDBRecommendation: (
  input: ModifyDBRecommendationMessage,
) => effect.Effect<
  DBRecommendationMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBRecommendationMessage,
  output: DBRecommendationMessage,
  errors: [],
}));
/**
 * Removes a source identifier from an existing RDS event notification subscription.
 */
export const removeSourceIdentifierFromSubscription: (
  input: RemoveSourceIdentifierFromSubscriptionMessage,
) => effect.Effect<
  RemoveSourceIdentifierFromSubscriptionResult,
  SourceNotFoundFault | SubscriptionNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveSourceIdentifierFromSubscriptionMessage,
  output: RemoveSourceIdentifierFromSubscriptionResult,
  errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
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
export const switchoverBlueGreenDeployment: (
  input: SwitchoverBlueGreenDeploymentRequest,
) => effect.Effect<
  SwitchoverBlueGreenDeploymentResponse,
  | BlueGreenDeploymentNotFoundFault
  | InvalidBlueGreenDeploymentStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SwitchoverBlueGreenDeploymentRequest,
  output: SwitchoverBlueGreenDeploymentResponse,
  errors: [
    BlueGreenDeploymentNotFoundFault,
    InvalidBlueGreenDeploymentStateFault,
  ],
}));
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
export const removeRoleFromDBCluster: (
  input: RemoveRoleFromDBClusterMessage,
) => effect.Effect<
  RemoveRoleFromDBClusterResponse,
  | DBClusterNotFoundFault
  | DBClusterRoleNotFoundFault
  | InvalidDBClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveRoleFromDBClusterMessage,
  output: RemoveRoleFromDBClusterResponse,
  errors: [
    DBClusterNotFoundFault,
    DBClusterRoleNotFoundFault,
    InvalidDBClusterStateFault,
  ],
}));
/**
 * Disassociates an Amazon Web Services Identity and Access Management (IAM) role from a DB instance.
 */
export const removeRoleFromDBInstance: (
  input: RemoveRoleFromDBInstanceMessage,
) => effect.Effect<
  RemoveRoleFromDBInstanceResponse,
  | DBInstanceNotFoundFault
  | DBInstanceRoleNotFoundFault
  | InvalidDBInstanceStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveRoleFromDBInstanceMessage,
  output: RemoveRoleFromDBInstanceResponse,
  errors: [
    DBInstanceNotFoundFault,
    DBInstanceRoleNotFoundFault,
    InvalidDBInstanceStateFault,
  ],
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
export const failoverDBCluster: (
  input: FailoverDBClusterMessage,
) => effect.Effect<
  FailoverDBClusterResult,
  | DBClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FailoverDBClusterMessage,
  output: FailoverDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * Modifies the settings of an Aurora Limitless Database DB shard group. You can change one or more settings by
 * specifying these parameters and the new values in the request.
 */
export const modifyDBShardGroup: (
  input: ModifyDBShardGroupMessage,
) => effect.Effect<
  DBShardGroup,
  | DBShardGroupAlreadyExistsFault
  | DBShardGroupNotFoundFault
  | InvalidDBClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBShardGroupMessage,
  output: DBShardGroup,
  errors: [
    DBShardGroupAlreadyExistsFault,
    DBShardGroupNotFoundFault,
    InvalidDBClusterStateFault,
  ],
}));
/**
 * Promotes a read replica DB cluster to a standalone DB cluster.
 */
export const promoteReadReplicaDBCluster: (
  input: PromoteReadReplicaDBClusterMessage,
) => effect.Effect<
  PromoteReadReplicaDBClusterResult,
  DBClusterNotFoundFault | InvalidDBClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PromoteReadReplicaDBClusterMessage,
  output: PromoteReadReplicaDBClusterResult,
  errors: [DBClusterNotFoundFault, InvalidDBClusterStateFault],
}));
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
export const rebootDBCluster: (
  input: RebootDBClusterMessage,
) => effect.Effect<
  RebootDBClusterResult,
  | DBClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBClusterMessage,
  output: RebootDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
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
export const stopActivityStream: (
  input: StopActivityStreamRequest,
) => effect.Effect<
  StopActivityStreamResponse,
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | ResourceNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns information about a snapshot or cluster export to Amazon S3. This API operation supports
 * pagination.
 */
export const describeExportTasks: {
  (
    input: DescribeExportTasksMessage,
  ): effect.Effect<
    ExportTasksMessage,
    ExportTaskNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeExportTasksMessage,
  ) => stream.Stream<
    ExportTasksMessage,
    ExportTaskNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeExportTasksMessage,
  ) => stream.Stream<
    ExportTask,
    ExportTaskNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeExportTasksMessage,
  output: ExportTasksMessage,
  errors: [ExportTaskNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ExportTasks",
    pageSize: "MaxRecords",
  } as const,
}));
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
export const modifyCustomDBEngineVersion: (
  input: ModifyCustomDBEngineVersionMessage,
) => effect.Effect<
  DBEngineVersion,
  | CustomDBEngineVersionNotFoundFault
  | InvalidCustomDBEngineVersionStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyCustomDBEngineVersionMessage,
  output: DBEngineVersion,
  errors: [
    CustomDBEngineVersionNotFoundFault,
    InvalidCustomDBEngineVersionStateFault,
  ],
}));
/**
 * Modifies the properties of an endpoint in an Amazon Aurora DB cluster.
 *
 * This operation only applies to Aurora DB clusters.
 */
export const modifyDBClusterEndpoint: (
  input: ModifyDBClusterEndpointMessage,
) => effect.Effect<
  DBClusterEndpoint,
  | DBClusterEndpointNotFoundFault
  | DBInstanceNotFoundFault
  | InvalidDBClusterEndpointStateFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBClusterEndpointMessage,
  output: DBClusterEndpoint,
  errors: [
    DBClusterEndpointNotFoundFault,
    DBInstanceNotFoundFault,
    InvalidDBClusterEndpointStateFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
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
export const modifyDBClusterParameterGroup: (
  input: ModifyDBClusterParameterGroupMessage,
) => effect.Effect<
  DBClusterParameterGroupNameMessage,
  | DBParameterGroupNotFoundFault
  | InvalidDBParameterGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const modifyDBParameterGroup: (
  input: ModifyDBParameterGroupMessage,
) => effect.Effect<
  DBParameterGroupNameMessage,
  | DBParameterGroupNotFoundFault
  | InvalidDBParameterGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBParameterGroupMessage,
  output: DBParameterGroupNameMessage,
  errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
}));
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
export const resetDBClusterParameterGroup: (
  input: ResetDBClusterParameterGroupMessage,
) => effect.Effect<
  DBClusterParameterGroupNameMessage,
  | DBParameterGroupNotFoundFault
  | InvalidDBParameterGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetDBClusterParameterGroupMessage,
  output: DBClusterParameterGroupNameMessage,
  errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
}));
/**
 * Deletes a specified DB parameter group. The DB parameter group to be deleted can't be associated with any DB instances.
 */
export const deleteDBParameterGroup: (
  input: DeleteDBParameterGroupMessage,
) => effect.Effect<
  DeleteDBParameterGroupResponse,
  | DBParameterGroupNotFoundFault
  | InvalidDBParameterGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBParameterGroupMessage,
  output: DeleteDBParameterGroupResponse,
  errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
}));
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
export const resetDBParameterGroup: (
  input: ResetDBParameterGroupMessage,
) => effect.Effect<
  DBParameterGroupNameMessage,
  | DBParameterGroupNotFoundFault
  | InvalidDBParameterGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetDBParameterGroupMessage,
  output: DBParameterGroupNameMessage,
  errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
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
export const describeDBClusterSnapshots: {
  (
    input: DescribeDBClusterSnapshotsMessage,
  ): effect.Effect<
    DBClusterSnapshotMessage,
    DBClusterSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClusterSnapshotsMessage,
  ) => stream.Stream<
    DBClusterSnapshotMessage,
    DBClusterSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClusterSnapshotsMessage,
  ) => stream.Stream<
    DBClusterSnapshot,
    DBClusterSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBClusterSnapshotsMessage,
  output: DBClusterSnapshotMessage,
  errors: [DBClusterSnapshotNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBClusterSnapshots",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about DB proxy endpoints.
 */
export const describeDBProxyEndpoints: {
  (
    input: DescribeDBProxyEndpointsRequest,
  ): effect.Effect<
    DescribeDBProxyEndpointsResponse,
    DBProxyEndpointNotFoundFault | DBProxyNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBProxyEndpointsRequest,
  ) => stream.Stream<
    DescribeDBProxyEndpointsResponse,
    DBProxyEndpointNotFoundFault | DBProxyNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBProxyEndpointsRequest,
  ) => stream.Stream<
    DBProxyEndpoint,
    DBProxyEndpointNotFoundFault | DBProxyNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBProxyEndpointsRequest,
  output: DescribeDBProxyEndpointsResponse,
  errors: [DBProxyEndpointNotFoundFault, DBProxyNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBProxyEndpoints",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * You might need to reboot your DB shard group, usually for maintenance reasons. For example, if you make certain modifications, reboot
 * the DB shard group for the changes to take effect.
 *
 * This operation applies only to Aurora Limitless Database DBb shard groups.
 */
export const rebootDBShardGroup: (
  input: RebootDBShardGroupMessage,
) => effect.Effect<
  DBShardGroup,
  DBShardGroupNotFoundFault | InvalidDBShardGroupStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBShardGroupMessage,
  output: DBShardGroup,
  errors: [DBShardGroupNotFoundFault, InvalidDBShardGroupStateFault],
}));
/**
 * Returns information about DB snapshots. This API action supports pagination.
 */
export const describeDBSnapshots: {
  (
    input: DescribeDBSnapshotsMessage,
  ): effect.Effect<
    DBSnapshotMessage,
    DBSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBSnapshotsMessage,
  ) => stream.Stream<
    DBSnapshotMessage,
    DBSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBSnapshotsMessage,
  ) => stream.Stream<
    DBSnapshot,
    DBSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBSnapshotsMessage,
  output: DBSnapshotMessage,
  errors: [DBSnapshotNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBSnapshots",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about Aurora global database clusters. This API supports pagination.
 *
 * For more information on Amazon Aurora, see What is Amazon Aurora? in the
 * *Amazon Aurora User Guide*.
 *
 * This action only applies to Aurora DB clusters.
 */
export const describeGlobalClusters: {
  (
    input: DescribeGlobalClustersMessage,
  ): effect.Effect<
    GlobalClustersMessage,
    GlobalClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeGlobalClustersMessage,
  ) => stream.Stream<
    GlobalClustersMessage,
    GlobalClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeGlobalClustersMessage,
  ) => stream.Stream<
    GlobalCluster,
    GlobalClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeGlobalClustersMessage,
  output: GlobalClustersMessage,
  errors: [GlobalClusterNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "GlobalClusters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Describes the available option groups.
 */
export const describeOptionGroups: {
  (
    input: DescribeOptionGroupsMessage,
  ): effect.Effect<
    OptionGroups,
    OptionGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOptionGroupsMessage,
  ) => stream.Stream<
    OptionGroups,
    OptionGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOptionGroupsMessage,
  ) => stream.Stream<
    OptionGroup,
    OptionGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOptionGroupsMessage,
  output: OptionGroups,
  errors: [OptionGroupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "OptionGroupsList",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Deletes an RDS event notification subscription.
 */
export const deleteEventSubscription: (
  input: DeleteEventSubscriptionMessage,
) => effect.Effect<
  DeleteEventSubscriptionResult,
  InvalidEventSubscriptionStateFault | SubscriptionNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventSubscriptionMessage,
  output: DeleteEventSubscriptionResult,
  errors: [InvalidEventSubscriptionStateFault, SubscriptionNotFoundFault],
}));
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
export const enableHttpEndpoint: (
  input: EnableHttpEndpointRequest,
) => effect.Effect<
  EnableHttpEndpointResponse,
  InvalidResourceStateFault | ResourceNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableHttpEndpointRequest,
  output: EnableHttpEndpointResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Returns a list of DB log files for the DB instance.
 *
 * This command doesn't apply to RDS Custom.
 */
export const describeDBLogFiles: {
  (
    input: DescribeDBLogFilesMessage,
  ): effect.Effect<
    DescribeDBLogFilesResponse,
    DBInstanceNotFoundFault | DBInstanceNotReadyFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBLogFilesMessage,
  ) => stream.Stream<
    DescribeDBLogFilesResponse,
    DBInstanceNotFoundFault | DBInstanceNotReadyFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBLogFilesMessage,
  ) => stream.Stream<
    DescribeDBLogFilesDetails,
    DBInstanceNotFoundFault | DBInstanceNotReadyFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBLogFilesMessage,
  output: DescribeDBLogFilesResponse,
  errors: [DBInstanceNotFoundFault, DBInstanceNotReadyFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DescribeDBLogFiles",
    pageSize: "MaxRecords",
  } as const,
}));
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
export const promoteReadReplica: (
  input: PromoteReadReplicaMessage,
) => effect.Effect<
  PromoteReadReplicaResult,
  DBInstanceNotFoundFault | InvalidDBInstanceStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PromoteReadReplicaMessage,
  output: PromoteReadReplicaResult,
  errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
}));
/**
 * Stops automated backup replication for a DB instance.
 *
 * This command doesn't apply to RDS Custom, Aurora MySQL, and Aurora PostgreSQL.
 *
 * For more information, see
 * Replicating Automated Backups to Another Amazon Web Services Region in the *Amazon RDS User Guide.*
 */
export const stopDBInstanceAutomatedBackupsReplication: (
  input: StopDBInstanceAutomatedBackupsReplicationMessage,
) => effect.Effect<
  StopDBInstanceAutomatedBackupsReplicationResult,
  DBInstanceNotFoundFault | InvalidDBInstanceStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDBInstanceAutomatedBackupsReplicationMessage,
  output: StopDBInstanceAutomatedBackupsReplicationResult,
  errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
}));
/**
 * Switches over an Oracle standby database in an Oracle Data Guard environment, making it the new
 * primary database. Issue this command in the Region that hosts the current standby database.
 */
export const switchoverReadReplica: (
  input: SwitchoverReadReplicaMessage,
) => effect.Effect<
  SwitchoverReadReplicaResult,
  DBInstanceNotFoundFault | InvalidDBInstanceStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SwitchoverReadReplicaMessage,
  output: SwitchoverReadReplicaResult,
  errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
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
export const describeCertificates: {
  (
    input: DescribeCertificatesMessage,
  ): effect.Effect<
    CertificateMessage,
    CertificateNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCertificatesMessage,
  ) => stream.Stream<
    CertificateMessage,
    CertificateNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCertificatesMessage,
  ) => stream.Stream<
    Certificate,
    CertificateNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCertificatesMessage,
  output: CertificateMessage,
  errors: [CertificateNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Certificates",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Adds a source identifier to an existing RDS event notification subscription.
 */
export const addSourceIdentifierToSubscription: (
  input: AddSourceIdentifierToSubscriptionMessage,
) => effect.Effect<
  AddSourceIdentifierToSubscriptionResult,
  SourceNotFoundFault | SubscriptionNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddSourceIdentifierToSubscriptionMessage,
  output: AddSourceIdentifierToSubscriptionResult,
  errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
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
export const revokeDBSecurityGroupIngress: (
  input: RevokeDBSecurityGroupIngressMessage,
) => effect.Effect<
  RevokeDBSecurityGroupIngressResult,
  | AuthorizationNotFoundFault
  | DBSecurityGroupNotFoundFault
  | InvalidDBSecurityGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeDBSecurityGroupIngressMessage,
  output: RevokeDBSecurityGroupIngressResult,
  errors: [
    AuthorizationNotFoundFault,
    DBSecurityGroupNotFoundFault,
    InvalidDBSecurityGroupStateFault,
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
export const deleteBlueGreenDeployment: (
  input: DeleteBlueGreenDeploymentRequest,
) => effect.Effect<
  DeleteBlueGreenDeploymentResponse,
  | BlueGreenDeploymentNotFoundFault
  | InvalidBlueGreenDeploymentStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBlueGreenDeploymentRequest,
  output: DeleteBlueGreenDeploymentResponse,
  errors: [
    BlueGreenDeploymentNotFoundFault,
    InvalidBlueGreenDeploymentStateFault,
  ],
}));
/**
 * Deletes an Aurora Limitless Database DB shard group.
 */
export const deleteDBShardGroup: (
  input: DeleteDBShardGroupMessage,
) => effect.Effect<
  DBShardGroup,
  | DBShardGroupNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBShardGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBShardGroupMessage,
  output: DBShardGroup,
  errors: [
    DBShardGroupNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBShardGroupStateFault,
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
export const stopDBCluster: (
  input: StopDBClusterMessage,
) => effect.Effect<
  StopDBClusterResult,
  | DBClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBShardGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associates an Identity and Access Management (IAM) role with a DB cluster.
 */
export const addRoleToDBCluster: (
  input: AddRoleToDBClusterMessage,
) => effect.Effect<
  AddRoleToDBClusterResponse,
  | DBClusterNotFoundFault
  | DBClusterRoleAlreadyExistsFault
  | DBClusterRoleQuotaExceededFault
  | InvalidDBClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addRoleToDBInstance: (
  input: AddRoleToDBInstanceMessage,
) => effect.Effect<
  AddRoleToDBInstanceResponse,
  | DBInstanceNotFoundFault
  | DBInstanceRoleAlreadyExistsFault
  | DBInstanceRoleQuotaExceededFault
  | InvalidDBInstanceStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const applyPendingMaintenanceAction: (
  input: ApplyPendingMaintenanceActionMessage,
) => effect.Effect<
  ApplyPendingMaintenanceActionResult,
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | ResourceNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelExportTask: (
  input: CancelExportTaskMessage,
) => effect.Effect<
  ExportTask,
  ExportTaskNotFoundFault | InvalidExportTaskStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelExportTaskMessage,
  output: ExportTask,
  errors: [ExportTaskNotFoundFault, InvalidExportTaskStateFault],
}));
/**
 * Creates a new custom endpoint and associates it with an Amazon Aurora DB cluster.
 *
 * This action applies only to Aurora DB clusters.
 */
export const createDBClusterEndpoint: (
  input: CreateDBClusterEndpointMessage,
) => effect.Effect<
  DBClusterEndpoint,
  | DBClusterEndpointAlreadyExistsFault
  | DBClusterEndpointQuotaExceededFault
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const createDBClusterParameterGroup: (
  input: CreateDBClusterParameterGroupMessage,
) => effect.Effect<
  CreateDBClusterParameterGroupResult,
  | DBParameterGroupAlreadyExistsFault
  | DBParameterGroupQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBClusterParameterGroupMessage,
  output: CreateDBClusterParameterGroupResult,
  errors: [
    DBParameterGroupAlreadyExistsFault,
    DBParameterGroupQuotaExceededFault,
  ],
}));
/**
 * Creates a new option group. You can create up to 20 option groups.
 *
 * This command doesn't apply to RDS Custom.
 */
export const createOptionGroup: (
  input: CreateOptionGroupMessage,
) => effect.Effect<
  CreateOptionGroupResult,
  OptionGroupAlreadyExistsFault | OptionGroupQuotaExceededFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOptionGroupMessage,
  output: CreateOptionGroupResult,
  errors: [OptionGroupAlreadyExistsFault, OptionGroupQuotaExceededFault],
}));
/**
 * Deletes a `DBProxyEndpoint`. Doing so removes the ability to access the DB proxy using the
 * endpoint that you defined. The endpoint that you delete might have provided capabilities such as read/write
 * or read-only operations, or using a different VPC than the DB proxy's default VPC.
 */
export const deleteDBProxyEndpoint: (
  input: DeleteDBProxyEndpointRequest,
) => effect.Effect<
  DeleteDBProxyEndpointResponse,
  | DBProxyEndpointNotFoundFault
  | InvalidDBProxyEndpointStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBProxyEndpointRequest,
  output: DeleteDBProxyEndpointResponse,
  errors: [DBProxyEndpointNotFoundFault, InvalidDBProxyEndpointStateFault],
}));
/**
 * Deletes a DB snapshot. If the snapshot is being copied, the copy operation is
 * terminated.
 *
 * The DB snapshot must be in the `available` state to be deleted.
 */
export const deleteDBSnapshot: (
  input: DeleteDBSnapshotMessage,
) => effect.Effect<
  DeleteDBSnapshotResult,
  DBSnapshotNotFoundFault | InvalidDBSnapshotStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBSnapshotMessage,
  output: DeleteDBSnapshotResult,
  errors: [DBSnapshotNotFoundFault, InvalidDBSnapshotStateFault],
}));
/**
 * Deletes a DB subnet group.
 *
 * The specified database subnet group must not be associated with any DB instances.
 */
export const deleteDBSubnetGroup: (
  input: DeleteDBSubnetGroupMessage,
) => effect.Effect<
  DeleteDBSubnetGroupResponse,
  | DBSubnetGroupNotFoundFault
  | InvalidDBSubnetGroupStateFault
  | InvalidDBSubnetStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBSubnetGroupMessage,
  output: DeleteDBSubnetGroupResponse,
  errors: [
    DBSubnetGroupNotFoundFault,
    InvalidDBSubnetGroupStateFault,
    InvalidDBSubnetStateFault,
  ],
}));
/**
 * Deletes a global database cluster. The primary and secondary clusters must already be detached or
 * destroyed first.
 *
 * This action only applies to Aurora DB clusters.
 */
export const deleteGlobalCluster: (
  input: DeleteGlobalClusterMessage,
) => effect.Effect<
  DeleteGlobalClusterResult,
  GlobalClusterNotFoundFault | InvalidGlobalClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlobalClusterMessage,
  output: DeleteGlobalClusterResult,
  errors: [GlobalClusterNotFoundFault, InvalidGlobalClusterStateFault],
}));
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
export const describeDBClusterSnapshotAttributes: (
  input: DescribeDBClusterSnapshotAttributesMessage,
) => effect.Effect<
  DescribeDBClusterSnapshotAttributesResult,
  DBClusterSnapshotNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDBClusterSnapshotAttributesMessage,
  output: DescribeDBClusterSnapshotAttributesResult,
  errors: [DBClusterSnapshotNotFoundFault],
}));
/**
 * Describes the properties of specific major versions of DB engines.
 */
export const describeDBMajorEngineVersions: {
  (
    input: DescribeDBMajorEngineVersionsRequest,
  ): effect.Effect<
    DescribeDBMajorEngineVersionsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBMajorEngineVersionsRequest,
  ) => stream.Stream<
    DescribeDBMajorEngineVersionsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBMajorEngineVersionsRequest,
  ) => stream.Stream<
    DBMajorEngineVersion,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBMajorEngineVersionsRequest,
  output: DescribeDBMajorEngineVersionsResponse,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBMajorEngineVersions",
    pageSize: "MaxRecords",
  } as const,
}));
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
export const describeDBSnapshotAttributes: (
  input: DescribeDBSnapshotAttributesMessage,
) => effect.Effect<
  DescribeDBSnapshotAttributesResult,
  DBSnapshotNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDBSnapshotAttributesMessage,
  output: DescribeDBSnapshotAttributesResult,
  errors: [DBSnapshotNotFoundFault],
}));
/**
 * Describes the orderable DB instance options for a specified DB engine.
 */
export const describeOrderableDBInstanceOptions: {
  (
    input: DescribeOrderableDBInstanceOptionsMessage,
  ): effect.Effect<
    OrderableDBInstanceOptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOrderableDBInstanceOptionsMessage,
  ) => stream.Stream<
    OrderableDBInstanceOptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOrderableDBInstanceOptionsMessage,
  ) => stream.Stream<
    OrderableDBInstanceOption,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOrderableDBInstanceOptionsMessage,
  output: OrderableDBInstanceOptionsMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "OrderableDBInstanceOptions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Lists available reserved DB instance offerings.
 */
export const describeReservedDBInstancesOfferings: {
  (
    input: DescribeReservedDBInstancesOfferingsMessage,
  ): effect.Effect<
    ReservedDBInstancesOfferingMessage,
    ReservedDBInstancesOfferingNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedDBInstancesOfferingsMessage,
  ) => stream.Stream<
    ReservedDBInstancesOfferingMessage,
    ReservedDBInstancesOfferingNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedDBInstancesOfferingsMessage,
  ) => stream.Stream<
    ReservedDBInstancesOffering,
    ReservedDBInstancesOfferingNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedDBInstancesOfferingsMessage,
  output: ReservedDBInstancesOfferingMessage,
  errors: [ReservedDBInstancesOfferingNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReservedDBInstancesOfferings",
    pageSize: "MaxRecords",
  } as const,
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
export const downloadDBLogFilePortion: {
  (
    input: DownloadDBLogFilePortionMessage,
  ): effect.Effect<
    DownloadDBLogFilePortionDetails,
    | DBInstanceNotFoundFault
    | DBInstanceNotReadyFault
    | DBLogFileNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DownloadDBLogFilePortionMessage,
  ) => stream.Stream<
    DownloadDBLogFilePortionDetails,
    | DBInstanceNotFoundFault
    | DBInstanceNotReadyFault
    | DBLogFileNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DownloadDBLogFilePortionMessage,
  ) => stream.Stream<
    unknown,
    | DBInstanceNotFoundFault
    | DBInstanceNotReadyFault
    | DBLogFileNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DownloadDBLogFilePortionMessage,
  output: DownloadDBLogFilePortionDetails,
  errors: [
    DBInstanceNotFoundFault,
    DBInstanceNotReadyFault,
    DBLogFileNotFoundFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    pageSize: "NumberOfLines",
  } as const,
}));
/**
 * Changes the settings for an existing DB proxy.
 */
export const modifyDBProxy: (
  input: ModifyDBProxyRequest,
) => effect.Effect<
  ModifyDBProxyResponse,
  | DBProxyAlreadyExistsFault
  | DBProxyNotFoundFault
  | InvalidDBProxyStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const modifyOptionGroup: (
  input: ModifyOptionGroupMessage,
) => effect.Effect<
  ModifyOptionGroupResult,
  InvalidOptionGroupStateFault | OptionGroupNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyOptionGroupMessage,
  output: ModifyOptionGroupResult,
  errors: [InvalidOptionGroupStateFault, OptionGroupNotFoundFault],
}));
/**
 * Purchases a reserved DB instance offering.
 */
export const purchaseReservedDBInstancesOffering: (
  input: PurchaseReservedDBInstancesOfferingMessage,
) => effect.Effect<
  PurchaseReservedDBInstancesOfferingResult,
  | ReservedDBInstanceAlreadyExistsFault
  | ReservedDBInstanceQuotaExceededFault
  | ReservedDBInstancesOfferingNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const registerDBProxyTargets: (
  input: RegisterDBProxyTargetsRequest,
) => effect.Effect<
  RegisterDBProxyTargetsResponse,
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | DBProxyNotFoundFault
  | DBProxyTargetAlreadyRegisteredFault
  | DBProxyTargetGroupNotFoundFault
  | InsufficientAvailableIPsInSubnetFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBProxyStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startActivityStream: (
  input: StartActivityStreamRequest,
) => effect.Effect<
  StartActivityStreamResponse,
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | KMSKeyNotAccessibleFault
  | ResourceNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDBParameterGroup: (
  input: CreateDBParameterGroupMessage,
) => effect.Effect<
  CreateDBParameterGroupResult,
  | DBParameterGroupAlreadyExistsFault
  | DBParameterGroupQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBParameterGroupMessage,
  output: CreateDBParameterGroupResult,
  errors: [
    DBParameterGroupAlreadyExistsFault,
    DBParameterGroupQuotaExceededFault,
  ],
}));
/**
 * Copies the specified DB cluster parameter group.
 *
 * You can't copy a default DB cluster parameter group. Instead, create a new custom DB cluster parameter group, which copies
 * the default parameters and values for the specified DB cluster parameter group family.
 */
export const copyDBClusterParameterGroup: (
  input: CopyDBClusterParameterGroupMessage,
) => effect.Effect<
  CopyDBClusterParameterGroupResult,
  | DBParameterGroupAlreadyExistsFault
  | DBParameterGroupNotFoundFault
  | DBParameterGroupQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyDBClusterParameterGroupMessage,
  output: CopyDBClusterParameterGroupResult,
  errors: [
    DBParameterGroupAlreadyExistsFault,
    DBParameterGroupNotFoundFault,
    DBParameterGroupQuotaExceededFault,
  ],
}));
/**
 * Copies the specified DB parameter group.
 *
 * You can't copy a default DB parameter group. Instead, create a new custom DB parameter group, which copies the default
 * parameters and values for the specified DB parameter group family.
 */
export const copyDBParameterGroup: (
  input: CopyDBParameterGroupMessage,
) => effect.Effect<
  CopyDBParameterGroupResult,
  | DBParameterGroupAlreadyExistsFault
  | DBParameterGroupNotFoundFault
  | DBParameterGroupQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyDBParameterGroupMessage,
  output: CopyDBParameterGroupResult,
  errors: [
    DBParameterGroupAlreadyExistsFault,
    DBParameterGroupNotFoundFault,
    DBParameterGroupQuotaExceededFault,
  ],
}));
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
export const deleteDBClusterSnapshot: (
  input: DeleteDBClusterSnapshotMessage,
) => effect.Effect<
  DeleteDBClusterSnapshotResult,
  | DBClusterSnapshotNotFoundFault
  | InvalidDBClusterSnapshotStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBClusterSnapshotMessage,
  output: DeleteDBClusterSnapshotResult,
  errors: [DBClusterSnapshotNotFoundFault, InvalidDBClusterSnapshotStateFault],
}));
/**
 * Deletes a tenant database from your DB instance. This command only applies to RDS for
 * Oracle container database (CDB) instances.
 *
 * You can't delete a tenant database when it is the only tenant in the DB
 * instance.
 */
export const deleteTenantDatabase: (
  input: DeleteTenantDatabaseMessage,
) => effect.Effect<
  DeleteTenantDatabaseResult,
  | DBInstanceNotFoundFault
  | DBSnapshotAlreadyExistsFault
  | InvalidDBInstanceStateFault
  | TenantDatabaseNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTenantDatabaseMessage,
  output: DeleteTenantDatabaseResult,
  errors: [
    DBInstanceNotFoundFault,
    DBSnapshotAlreadyExistsFault,
    InvalidDBInstanceStateFault,
    TenantDatabaseNotFoundFault,
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
export const stopDBInstance: (
  input: StopDBInstanceMessage,
) => effect.Effect<
  StopDBInstanceResult,
  | DBInstanceNotFoundFault
  | DBSnapshotAlreadyExistsFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Copies the specified option group.
 */
export const copyOptionGroup: (
  input: CopyOptionGroupMessage,
) => effect.Effect<
  CopyOptionGroupResult,
  | OptionGroupAlreadyExistsFault
  | OptionGroupNotFoundFault
  | OptionGroupQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyOptionGroupMessage,
  output: CopyOptionGroupResult,
  errors: [
    OptionGroupAlreadyExistsFault,
    OptionGroupNotFoundFault,
    OptionGroupQuotaExceededFault,
  ],
}));
/**
 * Removes metadata tags from an Amazon RDS resource.
 *
 * For an overview on tagging an Amazon RDS resource,
 * see Tagging Amazon RDS Resources in the *Amazon RDS User Guide*
 * or Tagging Amazon Aurora and Amazon RDS Resources in the *Amazon Aurora User Guide*.
 */
export const removeTagsFromResource: (
  input: RemoveTagsFromResourceMessage,
) => effect.Effect<
  RemoveTagsFromResourceResponse,
  | BlueGreenDeploymentNotFoundFault
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | DBProxyEndpointNotFoundFault
  | DBProxyNotFoundFault
  | DBProxyTargetGroupNotFoundFault
  | DBShardGroupNotFoundFault
  | DBSnapshotNotFoundFault
  | DBSnapshotTenantDatabaseNotFoundFault
  | IntegrationNotFoundFault
  | InvalidDBClusterEndpointStateFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | TenantDatabaseNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Changes the settings for an existing DB proxy endpoint.
 */
export const modifyDBProxyEndpoint: (
  input: ModifyDBProxyEndpointRequest,
) => effect.Effect<
  ModifyDBProxyEndpointResponse,
  | DBProxyEndpointAlreadyExistsFault
  | DBProxyEndpointNotFoundFault
  | InvalidDBProxyEndpointStateFault
  | InvalidDBProxyStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBProxyEndpointRequest,
  output: ModifyDBProxyEndpointResponse,
  errors: [
    DBProxyEndpointAlreadyExistsFault,
    DBProxyEndpointNotFoundFault,
    InvalidDBProxyEndpointStateFault,
    InvalidDBProxyStateFault,
  ],
}));
/**
 * Updates a manual DB snapshot with a new engine version. The snapshot can be encrypted
 * or unencrypted, but not shared or public.
 *
 * Amazon RDS supports upgrading DB snapshots for MariaDB, MySQL, PostgreSQL, and Oracle. This operation
 * doesn't apply to RDS Custom or RDS for Db2.
 */
export const modifyDBSnapshot: (
  input: ModifyDBSnapshotMessage,
) => effect.Effect<
  ModifyDBSnapshotResult,
  | DBSnapshotNotFoundFault
  | InvalidDBSnapshotStateFault
  | KMSKeyNotAccessibleFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBSnapshotMessage,
  output: ModifyDBSnapshotResult,
  errors: [
    DBSnapshotNotFoundFault,
    InvalidDBSnapshotStateFault,
    KMSKeyNotAccessibleFault,
  ],
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
export const copyDBSnapshot: (
  input: CopyDBSnapshotMessage,
) => effect.Effect<
  CopyDBSnapshotResult,
  | CustomAvailabilityZoneNotFoundFault
  | DBSnapshotAlreadyExistsFault
  | DBSnapshotNotFoundFault
  | InvalidDBSnapshotStateFault
  | KMSKeyNotAccessibleFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies a setting for an Amazon Aurora global database cluster. You can change one or more database configuration
 * parameters by specifying these parameters and the new values in the request. For more information on
 * Amazon Aurora, see What is Amazon Aurora? in the
 * *Amazon Aurora User Guide*.
 *
 * This operation only applies to Aurora global database clusters.
 */
export const modifyGlobalCluster: (
  input: ModifyGlobalClusterMessage,
) => effect.Effect<
  ModifyGlobalClusterResult,
  | GlobalClusterAlreadyExistsFault
  | GlobalClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidGlobalClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const failoverGlobalCluster: (
  input: FailoverGlobalClusterMessage,
) => effect.Effect<
  FailoverGlobalClusterResult,
  | DBClusterNotFoundFault
  | GlobalClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidGlobalClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FailoverGlobalClusterMessage,
  output: FailoverGlobalClusterResult,
  errors: [
    DBClusterNotFoundFault,
    GlobalClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidGlobalClusterStateFault,
  ],
}));
/**
 * Detaches an Aurora secondary cluster from an Aurora global database cluster. The cluster becomes a
 * standalone cluster with read-write capability instead of being read-only and receiving data from a
 * primary cluster in a different Region.
 *
 * This operation only applies to Aurora DB clusters.
 */
export const removeFromGlobalCluster: (
  input: RemoveFromGlobalClusterMessage,
) => effect.Effect<
  RemoveFromGlobalClusterResult,
  | DBClusterNotFoundFault
  | GlobalClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidGlobalClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveFromGlobalClusterMessage,
  output: RemoveFromGlobalClusterResult,
  errors: [
    DBClusterNotFoundFault,
    GlobalClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidGlobalClusterStateFault,
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
export const switchoverGlobalCluster: (
  input: SwitchoverGlobalClusterMessage,
) => effect.Effect<
  SwitchoverGlobalClusterResult,
  | DBClusterNotFoundFault
  | GlobalClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidGlobalClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SwitchoverGlobalClusterMessage,
  output: SwitchoverGlobalClusterResult,
  errors: [
    DBClusterNotFoundFault,
    GlobalClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidGlobalClusterStateFault,
  ],
}));
/**
 * Modifies a zero-ETL integration with Amazon Redshift.
 */
export const modifyIntegration: (
  input: ModifyIntegrationMessage,
) => effect.Effect<
  Integration,
  | IntegrationConflictOperationFault
  | IntegrationNotFoundFault
  | InvalidIntegrationStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationConflictOperationFault,
    IntegrationNotFoundFault,
    InvalidIntegrationStateFault,
  ],
}));
/**
 * Modifies the properties of a `DBProxyTargetGroup`.
 */
export const modifyDBProxyTargetGroup: (
  input: ModifyDBProxyTargetGroupRequest,
) => effect.Effect<
  ModifyDBProxyTargetGroupResponse,
  | DBProxyNotFoundFault
  | DBProxyTargetGroupNotFoundFault
  | InvalidDBProxyStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBProxyTargetGroupRequest,
  output: ModifyDBProxyTargetGroupResponse,
  errors: [
    DBProxyNotFoundFault,
    DBProxyTargetGroupNotFoundFault,
    InvalidDBProxyStateFault,
  ],
}));
/**
 * Deletes an existing DB proxy.
 */
export const deleteDBProxy: (
  input: DeleteDBProxyRequest,
) => effect.Effect<
  DeleteDBProxyResponse,
  DBProxyNotFoundFault | InvalidDBProxyStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBProxyRequest,
  output: DeleteDBProxyResponse,
  errors: [DBProxyNotFoundFault, InvalidDBProxyStateFault],
}));
/**
 * Remove the association between one or more `DBProxyTarget` data structures and a `DBProxyTargetGroup`.
 */
export const deregisterDBProxyTargets: (
  input: DeregisterDBProxyTargetsRequest,
) => effect.Effect<
  DeregisterDBProxyTargetsResponse,
  | DBProxyNotFoundFault
  | DBProxyTargetGroupNotFoundFault
  | DBProxyTargetNotFoundFault
  | InvalidDBProxyStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterDBProxyTargetsRequest,
  output: DeregisterDBProxyTargetsResponse,
  errors: [
    DBProxyNotFoundFault,
    DBProxyTargetGroupNotFoundFault,
    DBProxyTargetNotFoundFault,
    InvalidDBProxyStateFault,
  ],
}));
/**
 * Returns information about DB proxy target groups, represented by `DBProxyTargetGroup` data structures.
 */
export const describeDBProxyTargetGroups: {
  (
    input: DescribeDBProxyTargetGroupsRequest,
  ): effect.Effect<
    DescribeDBProxyTargetGroupsResponse,
    | DBProxyNotFoundFault
    | DBProxyTargetGroupNotFoundFault
    | InvalidDBProxyStateFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBProxyTargetGroupsRequest,
  ) => stream.Stream<
    DescribeDBProxyTargetGroupsResponse,
    | DBProxyNotFoundFault
    | DBProxyTargetGroupNotFoundFault
    | InvalidDBProxyStateFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBProxyTargetGroupsRequest,
  ) => stream.Stream<
    DBProxyTargetGroup,
    | DBProxyNotFoundFault
    | DBProxyTargetGroupNotFoundFault
    | InvalidDBProxyStateFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBProxyTargetGroupsRequest,
  output: DescribeDBProxyTargetGroupsResponse,
  errors: [
    DBProxyNotFoundFault,
    DBProxyTargetGroupNotFoundFault,
    InvalidDBProxyStateFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "TargetGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about `DBProxyTarget` objects. This API supports pagination.
 */
export const describeDBProxyTargets: {
  (
    input: DescribeDBProxyTargetsRequest,
  ): effect.Effect<
    DescribeDBProxyTargetsResponse,
    | DBProxyNotFoundFault
    | DBProxyTargetGroupNotFoundFault
    | DBProxyTargetNotFoundFault
    | InvalidDBProxyStateFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBProxyTargetsRequest,
  ) => stream.Stream<
    DescribeDBProxyTargetsResponse,
    | DBProxyNotFoundFault
    | DBProxyTargetGroupNotFoundFault
    | DBProxyTargetNotFoundFault
    | InvalidDBProxyStateFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBProxyTargetsRequest,
  ) => stream.Stream<
    DBProxyTarget,
    | DBProxyNotFoundFault
    | DBProxyTargetGroupNotFoundFault
    | DBProxyTargetNotFoundFault
    | InvalidDBProxyStateFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBProxyTargetsRequest,
  output: DescribeDBProxyTargetsResponse,
  errors: [
    DBProxyNotFoundFault,
    DBProxyTargetGroupNotFoundFault,
    DBProxyTargetNotFoundFault,
    InvalidDBProxyStateFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Targets",
    pageSize: "MaxRecords",
  } as const,
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
export const rebootDBInstance: (
  input: RebootDBInstanceMessage,
) => effect.Effect<
  RebootDBInstanceResult,
  | DBInstanceNotFoundFault
  | InvalidDBInstanceStateFault
  | KMSKeyNotAccessibleFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBInstanceMessage,
  output: RebootDBInstanceResult,
  errors: [
    DBInstanceNotFoundFault,
    InvalidDBInstanceStateFault,
    KMSKeyNotAccessibleFault,
  ],
}));
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
export const deleteDBInstance: (
  input: DeleteDBInstanceMessage,
) => effect.Effect<
  DeleteDBInstanceResult,
  | DBInstanceAutomatedBackupQuotaExceededFault
  | DBInstanceNotFoundFault
  | DBSnapshotAlreadyExistsFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | KMSKeyNotAccessibleFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a zero-ETL integration with Amazon Redshift.
 */
export const createIntegration: (
  input: CreateIntegrationMessage,
) => effect.Effect<
  Integration,
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | IntegrationAlreadyExistsFault
  | IntegrationConflictOperationFault
  | IntegrationQuotaExceededFault
  | KMSKeyNotAccessibleFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a snapshot of a DB instance. The source DB instance must be in the `available` or
 * `storage-optimization` state.
 */
export const createDBSnapshot: (
  input: CreateDBSnapshotMessage,
) => effect.Effect<
  CreateDBSnapshotResult,
  | DBInstanceNotFoundFault
  | DBSnapshotAlreadyExistsFault
  | InvalidDBInstanceStateFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a snapshot of a DB cluster.
 *
 * For more information on Amazon Aurora, see What is Amazon
 * Aurora? in the *Amazon Aurora User Guide*.
 *
 * For more information on Multi-AZ DB clusters, see Multi-AZ DB
 * cluster deployments in the Amazon RDS User
 * Guide.
 */
export const createDBClusterSnapshot: (
  input: CreateDBClusterSnapshotMessage,
) => effect.Effect<
  CreateDBClusterSnapshotResult,
  | DBClusterNotFoundFault
  | DBClusterSnapshotAlreadyExistsFault
  | InvalidDBClusterSnapshotStateFault
  | InvalidDBClusterStateFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBClusterSnapshotMessage,
  output: CreateDBClusterSnapshotResult,
  errors: [
    DBClusterNotFoundFault,
    DBClusterSnapshotAlreadyExistsFault,
    InvalidDBClusterSnapshotStateFault,
    InvalidDBClusterStateFault,
    SnapshotQuotaExceededFault,
  ],
}));
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
export const copyDBClusterSnapshot: (
  input: CopyDBClusterSnapshotMessage,
) => effect.Effect<
  CopyDBClusterSnapshotResult,
  | DBClusterSnapshotAlreadyExistsFault
  | DBClusterSnapshotNotFoundFault
  | InvalidDBClusterSnapshotStateFault
  | InvalidDBClusterStateFault
  | KMSKeyNotAccessibleFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes automated backups using the `DbiResourceId` value of the source DB instance or the Amazon Resource Name (ARN) of the automated backups.
 */
export const deleteDBInstanceAutomatedBackup: (
  input: DeleteDBInstanceAutomatedBackupMessage,
) => effect.Effect<
  DeleteDBInstanceAutomatedBackupResult,
  | DBInstanceAutomatedBackupNotFoundFault
  | InvalidDBInstanceAutomatedBackupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBInstanceAutomatedBackupMessage,
  output: DeleteDBInstanceAutomatedBackupResult,
  errors: [
    DBInstanceAutomatedBackupNotFoundFault,
    InvalidDBInstanceAutomatedBackupStateFault,
  ],
}));
/**
 * Adds metadata tags to an Amazon RDS resource. These tags can also be used with cost allocation reporting to track cost associated with Amazon RDS resources, or used in a Condition statement in an IAM policy for Amazon RDS.
 *
 * For an overview on tagging your relational database resources,
 * see Tagging Amazon RDS Resources
 * or Tagging Amazon Aurora and Amazon RDS Resources.
 */
export const addTagsToResource: (
  input: AddTagsToResourceMessage,
) => effect.Effect<
  AddTagsToResourceResponse,
  | BlueGreenDeploymentNotFoundFault
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | DBProxyEndpointNotFoundFault
  | DBProxyNotFoundFault
  | DBProxyTargetGroupNotFoundFault
  | DBShardGroupNotFoundFault
  | DBSnapshotNotFoundFault
  | DBSnapshotTenantDatabaseNotFoundFault
  | IntegrationNotFoundFault
  | InvalidDBClusterEndpointStateFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | TenantDatabaseNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all tags on an Amazon RDS resource.
 *
 * For an overview on tagging an Amazon RDS resource,
 * see Tagging Amazon RDS Resources in the *Amazon RDS User Guide*
 * or Tagging Amazon Aurora and Amazon RDS Resources in the *Amazon Aurora User Guide*.
 */
export const listTagsForResource: (
  input: ListTagsForResourceMessage,
) => effect.Effect<
  TagListMessage,
  | BlueGreenDeploymentNotFoundFault
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | DBProxyEndpointNotFoundFault
  | DBProxyNotFoundFault
  | DBProxyTargetGroupNotFoundFault
  | DBShardGroupNotFoundFault
  | DBSnapshotNotFoundFault
  | DBSnapshotTenantDatabaseNotFoundFault
  | IntegrationNotFoundFault
  | TenantDatabaseNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a zero-ETL integration with Amazon Redshift.
 */
export const deleteIntegration: (
  input: DeleteIntegrationMessage,
) => effect.Effect<
  Integration,
  | IntegrationConflictOperationFault
  | IntegrationNotFoundFault
  | InvalidIntegrationStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationConflictOperationFault,
    IntegrationNotFoundFault,
    InvalidIntegrationStateFault,
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
export const createDBSecurityGroup: (
  input: CreateDBSecurityGroupMessage,
) => effect.Effect<
  CreateDBSecurityGroupResult,
  | DBSecurityGroupAlreadyExistsFault
  | DBSecurityGroupNotSupportedFault
  | DBSecurityGroupQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBSecurityGroupMessage,
  output: CreateDBSecurityGroupResult,
  errors: [
    DBSecurityGroupAlreadyExistsFault,
    DBSecurityGroupNotSupportedFault,
    DBSecurityGroupQuotaExceededFault,
  ],
}));
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
export const createGlobalCluster: (
  input: CreateGlobalClusterMessage,
) => effect.Effect<
  CreateGlobalClusterResult,
  | DBClusterNotFoundFault
  | GlobalClusterAlreadyExistsFault
  | GlobalClusterQuotaExceededFault
  | InvalidDBClusterStateFault
  | InvalidDBShardGroupStateFault
  | ResourceNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDBCluster: (
  input: DeleteDBClusterMessage,
) => effect.Effect<
  DeleteDBClusterResult,
  | DBClusterAutomatedBackupQuotaExceededFault
  | DBClusterNotFoundFault
  | DBClusterSnapshotAlreadyExistsFault
  | InvalidDBClusterSnapshotStateFault
  | InvalidDBClusterStateFault
  | InvalidGlobalClusterStateFault
  | KMSKeyNotAccessibleFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDBClusterAutomatedBackup: (
  input: DeleteDBClusterAutomatedBackupMessage,
) => effect.Effect<
  DeleteDBClusterAutomatedBackupResult,
  | DBClusterAutomatedBackupNotFoundFault
  | InvalidDBClusterAutomatedBackupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeOptionGroupOptions: {
  (
    input: DescribeOptionGroupOptionsMessage,
  ): effect.Effect<
    OptionGroupOptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOptionGroupOptionsMessage,
  ) => stream.Stream<
    OptionGroupOptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOptionGroupOptionsMessage,
  ) => stream.Stream<
    OptionGroupOption,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOptionGroupOptionsMessage,
  output: OptionGroupOptionsMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "OptionGroupOptions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about reserved DB instances for this account, or about a specified reserved DB instance.
 */
export const describeReservedDBInstances: {
  (
    input: DescribeReservedDBInstancesMessage,
  ): effect.Effect<
    ReservedDBInstanceMessage,
    ReservedDBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedDBInstancesMessage,
  ) => stream.Stream<
    ReservedDBInstanceMessage,
    ReservedDBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedDBInstancesMessage,
  ) => stream.Stream<
    ReservedDBInstance,
    ReservedDBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedDBInstancesMessage,
  output: ReservedDBInstanceMessage,
  errors: [ReservedDBInstanceNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReservedDBInstances",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * You can call `DescribeValidDBInstanceModifications` to learn what modifications you can make to
 * your DB instance. You can use this information when you call `ModifyDBInstance`.
 *
 * This command doesn't apply to RDS Custom.
 */
export const describeValidDBInstanceModifications: (
  input: DescribeValidDBInstanceModificationsMessage,
) => effect.Effect<
  DescribeValidDBInstanceModificationsResult,
  DBInstanceNotFoundFault | InvalidDBInstanceStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeValidDBInstanceModificationsMessage,
  output: DescribeValidDBInstanceModificationsResult,
  errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
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
export const modifyDBClusterSnapshotAttribute: (
  input: ModifyDBClusterSnapshotAttributeMessage,
) => effect.Effect<
  ModifyDBClusterSnapshotAttributeResult,
  | DBClusterSnapshotNotFoundFault
  | InvalidDBClusterSnapshotStateFault
  | SharedSnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBClusterSnapshotAttributeMessage,
  output: ModifyDBClusterSnapshotAttributeResult,
  errors: [
    DBClusterSnapshotNotFoundFault,
    InvalidDBClusterSnapshotStateFault,
    SharedSnapshotQuotaExceededFault,
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
export const startDBInstanceAutomatedBackupsReplication: (
  input: StartDBInstanceAutomatedBackupsReplicationMessage,
) => effect.Effect<
  StartDBInstanceAutomatedBackupsReplicationResult,
  | DBInstanceAutomatedBackupQuotaExceededFault
  | DBInstanceNotFoundFault
  | InvalidDBInstanceAutomatedBackupStateFault
  | InvalidDBInstanceStateFault
  | KMSKeyNotAccessibleFault
  | StorageTypeNotSupportedFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new DB proxy.
 */
export const createDBProxy: (
  input: CreateDBProxyRequest,
) => effect.Effect<
  CreateDBProxyResponse,
  | DBProxyAlreadyExistsFault
  | DBProxyQuotaExceededFault
  | InvalidSubnet
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBProxyRequest,
  output: CreateDBProxyResponse,
  errors: [DBProxyAlreadyExistsFault, DBProxyQuotaExceededFault, InvalidSubnet],
}));
/**
 * Creates a `DBProxyEndpoint`. Only applies to proxies that are associated with Aurora DB clusters.
 * You can use DB proxy endpoints to specify read/write or read-only access to the DB cluster. You can also use
 * DB proxy endpoints to access a DB proxy through a different VPC than the proxy's default VPC.
 */
export const createDBProxyEndpoint: (
  input: CreateDBProxyEndpointRequest,
) => effect.Effect<
  CreateDBProxyEndpointResponse,
  | DBProxyEndpointAlreadyExistsFault
  | DBProxyEndpointQuotaExceededFault
  | DBProxyNotFoundFault
  | InvalidDBProxyStateFault
  | InvalidSubnet
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBProxyEndpointRequest,
  output: CreateDBProxyEndpointResponse,
  errors: [
    DBProxyEndpointAlreadyExistsFault,
    DBProxyEndpointQuotaExceededFault,
    DBProxyNotFoundFault,
    InvalidDBProxyStateFault,
    InvalidSubnet,
  ],
}));
/**
 * Modifies an existing tenant database in a DB instance. You can change the tenant
 * database name or the master user password. This operation is supported only for RDS for
 * Oracle CDB instances using the multi-tenant configuration.
 */
export const modifyTenantDatabase: (
  input: ModifyTenantDatabaseMessage,
) => effect.Effect<
  ModifyTenantDatabaseResult,
  | DBInstanceNotFoundFault
  | InvalidDBInstanceStateFault
  | KMSKeyNotAccessibleFault
  | TenantDatabaseAlreadyExistsFault
  | TenantDatabaseNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyTenantDatabaseMessage,
  output: ModifyTenantDatabaseResult,
  errors: [
    DBInstanceNotFoundFault,
    InvalidDBInstanceStateFault,
    KMSKeyNotAccessibleFault,
    TenantDatabaseAlreadyExistsFault,
    TenantDatabaseNotFoundFault,
  ],
}));
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
export const startDBCluster: (
  input: StartDBClusterMessage,
) => effect.Effect<
  StartDBClusterResult,
  | DBClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBShardGroupStateFault
  | KMSKeyNotAccessibleFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const modifyDBSnapshotAttribute: (
  input: ModifyDBSnapshotAttributeMessage,
) => effect.Effect<
  ModifyDBSnapshotAttributeResult,
  | DBSnapshotNotFoundFault
  | InvalidDBSnapshotStateFault
  | SharedSnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBSnapshotAttributeMessage,
  output: ModifyDBSnapshotAttributeResult,
  errors: [
    DBSnapshotNotFoundFault,
    InvalidDBSnapshotStateFault,
    SharedSnapshotQuotaExceededFault,
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
export const startDBInstance: (
  input: StartDBInstanceMessage,
) => effect.Effect<
  StartDBInstanceResult,
  | AuthorizationNotFoundFault
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | InsufficientDBInstanceCapacityFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const authorizeDBSecurityGroupIngress: (
  input: AuthorizeDBSecurityGroupIngressMessage,
) => effect.Effect<
  AuthorizeDBSecurityGroupIngressResult,
  | AuthorizationAlreadyExistsFault
  | AuthorizationQuotaExceededFault
  | DBSecurityGroupNotFoundFault
  | InvalidDBSecurityGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies an existing DB subnet group. DB subnet groups must contain at least one subnet in at least two AZs in the Amazon Web Services Region.
 */
export const modifyDBSubnetGroup: (
  input: ModifyDBSubnetGroupMessage,
) => effect.Effect<
  ModifyDBSubnetGroupResult,
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | DBSubnetQuotaExceededFault
  | InvalidDBSubnetGroupStateFault
  | InvalidSubnet
  | SubnetAlreadyInUse
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a tenant database in a DB instance that uses the multi-tenant configuration.
 * Only RDS for Oracle container database (CDB) instances are supported.
 */
export const createTenantDatabase: (
  input: CreateTenantDatabaseMessage,
) => effect.Effect<
  CreateTenantDatabaseResult,
  | DBInstanceNotFoundFault
  | InvalidDBInstanceStateFault
  | KMSKeyNotAccessibleFault
  | TenantDatabaseAlreadyExistsFault
  | TenantDatabaseQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTenantDatabaseMessage,
  output: CreateTenantDatabaseResult,
  errors: [
    DBInstanceNotFoundFault,
    InvalidDBInstanceStateFault,
    KMSKeyNotAccessibleFault,
    TenantDatabaseAlreadyExistsFault,
    TenantDatabaseQuotaExceededFault,
  ],
}));
/**
 * Creates a custom DB engine version (CEV).
 */
export const createCustomDBEngineVersion: (
  input: CreateCustomDBEngineVersionMessage,
) => effect.Effect<
  DBEngineVersion,
  | CreateCustomDBEngineVersionFault
  | CustomDBEngineVersionAlreadyExistsFault
  | CustomDBEngineVersionNotFoundFault
  | CustomDBEngineVersionQuotaExceededFault
  | Ec2ImagePropertiesNotSupportedFault
  | InvalidCustomDBEngineVersionStateFault
  | KMSKeyNotAccessibleFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new DB subnet group. DB subnet groups must contain at least one subnet in at least two AZs in the Amazon Web Services Region.
 */
export const createDBSubnetGroup: (
  input: CreateDBSubnetGroupMessage,
) => effect.Effect<
  CreateDBSubnetGroupResult,
  | DBSubnetGroupAlreadyExistsFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupQuotaExceededFault
  | DBSubnetQuotaExceededFault
  | InvalidSubnet
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new DB shard group for Aurora Limitless Database. You must enable Aurora Limitless Database to create a DB shard group.
 *
 * Valid for: Aurora DB clusters only
 */
export const createDBShardGroup: (
  input: CreateDBShardGroupMessage,
) => effect.Effect<
  DBShardGroup,
  | DBClusterNotFoundFault
  | DBShardGroupAlreadyExistsFault
  | InvalidDBClusterStateFault
  | InvalidVPCNetworkStateFault
  | MaxDBShardGroupLimitReached
  | NetworkTypeNotSupported
  | UnsupportedDBEngineVersionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies an existing RDS event notification subscription. You can't modify the source identifiers using this call. To change
 * source identifiers for a subscription, use the `AddSourceIdentifierToSubscription` and `RemoveSourceIdentifierFromSubscription` calls.
 *
 * You can see a list of the event categories for a given source type (`SourceType`)
 * in Events in the *Amazon RDS User Guide*
 * or by using the `DescribeEventCategories` operation.
 */
export const modifyEventSubscription: (
  input: ModifyEventSubscriptionMessage,
) => effect.Effect<
  ModifyEventSubscriptionResult,
  | EventSubscriptionQuotaExceededFault
  | SNSInvalidTopicFault
  | SNSNoAuthorizationFault
  | SNSTopicArnNotFoundFault
  | SubscriptionCategoryNotFoundFault
  | SubscriptionNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDBInstance: (
  input: CreateDBInstanceMessage,
) => effect.Effect<
  CreateDBInstanceResult,
  | AuthorizationNotFoundFault
  | BackupPolicyNotFoundFault
  | CertificateNotFoundFault
  | DBClusterNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBParameterGroupNotFoundFault
  | DBSecurityGroupNotFoundFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | DomainNotFoundFault
  | InstanceQuotaExceededFault
  | InsufficientDBInstanceCapacityFault
  | InvalidDBClusterStateFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | ProvisionedIopsNotAvailableInAZFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | TenantDatabaseQuotaExceededFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDBInstanceReadReplica: (
  input: CreateDBInstanceReadReplicaMessage,
) => effect.Effect<
  CreateDBInstanceReadReplicaResult,
  | CertificateNotFoundFault
  | DBClusterNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBInstanceNotFoundFault
  | DBParameterGroupNotFoundFault
  | DBSecurityGroupNotFoundFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotAllowedFault
  | DBSubnetGroupNotFoundFault
  | DomainNotFoundFault
  | InstanceQuotaExceededFault
  | InsufficientDBInstanceCapacityFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBSubnetGroupFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | ProvisionedIopsNotAvailableInAZFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | TenantDatabaseQuotaExceededFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createEventSubscription: (
  input: CreateEventSubscriptionMessage,
) => effect.Effect<
  CreateEventSubscriptionResult,
  | EventSubscriptionQuotaExceededFault
  | SNSInvalidTopicFault
  | SNSNoAuthorizationFault
  | SNSTopicArnNotFoundFault
  | SourceNotFoundFault
  | SubscriptionAlreadyExistFault
  | SubscriptionCategoryNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restoreDBInstanceFromS3: (
  input: RestoreDBInstanceFromS3Message,
) => effect.Effect<
  RestoreDBInstanceFromS3Result,
  | AuthorizationNotFoundFault
  | BackupPolicyNotFoundFault
  | CertificateNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBParameterGroupNotFoundFault
  | DBSecurityGroupNotFoundFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | InstanceQuotaExceededFault
  | InsufficientDBInstanceCapacityFault
  | InvalidS3BucketFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | ProvisionedIopsNotAvailableInAZFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restoreDBClusterToPointInTime: (
  input: RestoreDBClusterToPointInTimeMessage,
) => effect.Effect<
  RestoreDBClusterToPointInTimeResult,
  | DBClusterAlreadyExistsFault
  | DBClusterAutomatedBackupNotFoundFault
  | DBClusterNotFoundFault
  | DBClusterParameterGroupNotFoundFault
  | DBClusterQuotaExceededFault
  | DBClusterSnapshotNotFoundFault
  | DBSubnetGroupNotFoundFault
  | DomainNotFoundFault
  | InsufficientDBClusterCapacityFault
  | InsufficientDBInstanceCapacityFault
  | InsufficientStorageClusterCapacityFault
  | InvalidDBClusterSnapshotStateFault
  | InvalidDBClusterStateFault
  | InvalidDBSnapshotStateFault
  | InvalidRestoreFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restoreDBClusterFromSnapshot: (
  input: RestoreDBClusterFromSnapshotMessage,
) => effect.Effect<
  RestoreDBClusterFromSnapshotResult,
  | DBClusterAlreadyExistsFault
  | DBClusterParameterGroupNotFoundFault
  | DBClusterQuotaExceededFault
  | DBClusterSnapshotNotFoundFault
  | DBSnapshotNotFoundFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | DomainNotFoundFault
  | InsufficientDBClusterCapacityFault
  | InsufficientDBInstanceCapacityFault
  | InsufficientStorageClusterCapacityFault
  | InvalidDBClusterSnapshotStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBSnapshotStateFault
  | InvalidRestoreFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies settings for a DB instance.
 * You can change one or more database configuration parameters by specifying these parameters and the new values in the request.
 * To learn what modifications you can make to your DB instance,
 * call `DescribeValidDBInstanceModifications`
 * before you call `ModifyDBInstance`.
 */
export const modifyDBInstance: (
  input: ModifyDBInstanceMessage,
) => effect.Effect<
  ModifyDBInstanceResult,
  | AuthorizationNotFoundFault
  | BackupPolicyNotFoundFault
  | CertificateNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBInstanceNotFoundFault
  | DBParameterGroupNotFoundFault
  | DBSecurityGroupNotFoundFault
  | DBUpgradeDependencyFailureFault
  | DomainNotFoundFault
  | InsufficientDBInstanceCapacityFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBSecurityGroupStateFault
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | ProvisionedIopsNotAvailableInAZFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | TenantDatabaseQuotaExceededFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restoreDBInstanceFromDBSnapshot: (
  input: RestoreDBInstanceFromDBSnapshotMessage,
) => effect.Effect<
  RestoreDBInstanceFromDBSnapshotResult,
  | AuthorizationNotFoundFault
  | BackupPolicyNotFoundFault
  | CertificateNotFoundFault
  | DBClusterSnapshotNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBParameterGroupNotFoundFault
  | DBSecurityGroupNotFoundFault
  | DBSnapshotNotFoundFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | DomainNotFoundFault
  | InstanceQuotaExceededFault
  | InsufficientDBInstanceCapacityFault
  | InvalidDBSnapshotStateFault
  | InvalidRestoreFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | ProvisionedIopsNotAvailableInAZFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | TenantDatabaseQuotaExceededFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDBCluster: (
  input: CreateDBClusterMessage,
) => effect.Effect<
  CreateDBClusterResult,
  | DBClusterAlreadyExistsFault
  | DBClusterNotFoundFault
  | DBClusterParameterGroupNotFoundFault
  | DBClusterQuotaExceededFault
  | DBInstanceNotFoundFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | DomainNotFoundFault
  | GlobalClusterNotFoundFault
  | InsufficientDBInstanceCapacityFault
  | InsufficientStorageClusterCapacityFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBSubnetGroupFault
  | InvalidDBSubnetGroupStateFault
  | InvalidGlobalClusterStateFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restoreDBClusterFromS3: (
  input: RestoreDBClusterFromS3Message,
) => effect.Effect<
  RestoreDBClusterFromS3Result,
  | DBClusterAlreadyExistsFault
  | DBClusterNotFoundFault
  | DBClusterParameterGroupNotFoundFault
  | DBClusterQuotaExceededFault
  | DBSubnetGroupNotFoundFault
  | DomainNotFoundFault
  | InsufficientStorageClusterCapacityFault
  | InvalidDBClusterStateFault
  | InvalidDBSubnetGroupStateFault
  | InvalidS3BucketFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startExportTask: (
  input: StartExportTaskMessage,
) => effect.Effect<
  ExportTask,
  | DBClusterNotFoundFault
  | DBClusterSnapshotNotFoundFault
  | DBSnapshotNotFoundFault
  | ExportTaskAlreadyExistsFault
  | IamRoleMissingPermissionsFault
  | IamRoleNotFoundFault
  | InvalidExportOnlyFault
  | InvalidExportSourceStateFault
  | InvalidS3BucketFault
  | KMSKeyNotAccessibleFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBlueGreenDeployment: (
  input: CreateBlueGreenDeploymentRequest,
) => effect.Effect<
  CreateBlueGreenDeploymentResponse,
  | BlueGreenDeploymentAlreadyExistsFault
  | DBClusterNotFoundFault
  | DBClusterParameterGroupNotFoundFault
  | DBClusterQuotaExceededFault
  | DBInstanceNotFoundFault
  | DBParameterGroupNotFoundFault
  | InstanceQuotaExceededFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | SourceClusterNotSupportedFault
  | SourceDatabaseNotSupportedFault
  | StorageQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const modifyDBCluster: (
  input: ModifyDBClusterMessage,
) => effect.Effect<
  ModifyDBClusterResult,
  | DBClusterAlreadyExistsFault
  | DBClusterNotFoundFault
  | DBClusterParameterGroupNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBParameterGroupNotFoundFault
  | DBSubnetGroupNotFoundFault
  | DomainNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBSecurityGroupStateFault
  | InvalidDBSubnetGroupStateFault
  | InvalidGlobalClusterStateFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | StorageQuotaExceededFault
  | StorageTypeNotAvailableFault
  | StorageTypeNotSupportedFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restoreDBInstanceToPointInTime: (
  input: RestoreDBInstanceToPointInTimeMessage,
) => effect.Effect<
  RestoreDBInstanceToPointInTimeResult,
  | AuthorizationNotFoundFault
  | BackupPolicyNotFoundFault
  | CertificateNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBInstanceAutomatedBackupNotFoundFault
  | DBInstanceNotFoundFault
  | DBParameterGroupNotFoundFault
  | DBSecurityGroupNotFoundFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | DomainNotFoundFault
  | InstanceQuotaExceededFault
  | InsufficientDBInstanceCapacityFault
  | InvalidDBInstanceStateFault
  | InvalidRestoreFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | NetworkTypeNotSupported
  | OptionGroupNotFoundFault
  | PointInTimeRestoreNotEnabledFault
  | ProvisionedIopsNotAvailableInAZFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | TenantDatabaseQuotaExceededFault
  | VpcEncryptionControlViolationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Describes the recommendations to resolve the issues for your DB instances, DB clusters, and DB parameter groups.
 */
export const describeDBRecommendations: {
  (
    input: DescribeDBRecommendationsMessage,
  ): effect.Effect<
    DBRecommendationsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBRecommendationsMessage,
  ) => stream.Stream<
    DBRecommendationsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBRecommendationsMessage,
  ) => stream.Stream<
    DBRecommendation,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDBRecommendationsMessage,
  output: DBRecommendationsMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DBRecommendations",
    pageSize: "MaxRecords",
  } as const,
}));
