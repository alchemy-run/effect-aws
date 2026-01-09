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
const svc = T.AwsApiService({
  sdkId: "Neptune",
  serviceShapeName: "AmazonRDSv19",
});
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
export type GlobalClusterIdentifier = string;
export type SensitiveString = string | redacted.Redacted<string>;
export type ExceptionMessage = string;

//# Schemas
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
export type StringList = string[];
export const StringList = S.Array(S.String);
export type DBSecurityGroupNameList = string[];
export const DBSecurityGroupNameList = S.Array(
  S.String.pipe(T.XmlName("DBSecurityGroupName")),
);
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
  | (string & {});
export const SourceType = S.String;
export type AttributeValueList = string[];
export const AttributeValueList = S.Array(
  S.String.pipe(T.XmlName("AttributeValue")),
);
export type KeyList = string[];
export const KeyList = S.Array(S.String);
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
  PreSignedUrl?: string;
  CopyTags?: boolean;
  Tags?: Tag[];
}
export const CopyDBClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    SourceDBClusterSnapshotIdentifier: S.optional(S.String),
    TargetDBClusterSnapshotIdentifier: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
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
export interface CreateDBInstanceMessage {
  DBName?: string;
  DBInstanceIdentifier?: string;
  AllocatedStorage?: number;
  DBInstanceClass?: string;
  Engine?: string;
  MasterUsername?: string;
  MasterUserPassword?: string;
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
  OptionGroupName?: string;
  CharacterSetName?: string;
  PubliclyAccessible?: boolean;
  Tags?: Tag[];
  DBClusterIdentifier?: string;
  StorageType?: string;
  TdeCredentialArn?: string;
  TdeCredentialPassword?: string | redacted.Redacted<string>;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  Domain?: string;
  CopyTagsToSnapshot?: boolean;
  MonitoringInterval?: number;
  MonitoringRoleArn?: string;
  DomainIAMRoleName?: string;
  PromotionTier?: number;
  Timezone?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  EnableCloudwatchLogsExports?: string[];
  DeletionProtection?: boolean;
}
export const CreateDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBName: S.optional(S.String),
    DBInstanceIdentifier: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    DBInstanceClass: S.optional(S.String),
    Engine: S.optional(S.String),
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
    OptionGroupName: S.optional(S.String),
    CharacterSetName: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    DBClusterIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    TdeCredentialArn: S.optional(S.String),
    TdeCredentialPassword: S.optional(SensitiveString),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    Domain: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    PromotionTier: S.optional(S.Number),
    Timezone: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
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
  DeletionProtection?: boolean;
  StorageEncrypted?: boolean;
}
export const CreateGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
    SourceDBClusterIdentifier: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    StorageEncrypted: S.optional(S.Boolean),
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
export interface DeleteDBClusterMessage {
  DBClusterIdentifier?: string;
  SkipFinalSnapshot?: boolean;
  FinalDBSnapshotIdentifier?: string;
}
export const DeleteDBClusterMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.optional(S.String),
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
  identifier: "DeleteDBClusterMessage",
}) as any as S.Schema<DeleteDBClusterMessage>;
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
}
export const DeleteDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
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
  identifier: "DeleteDBInstanceMessage",
}) as any as S.Schema<DeleteDBInstanceMessage>;
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
}
export const DescribeDBClustersMessage = S.suspend(() =>
  S.Struct({
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
export interface DescribeGlobalClustersMessage {
  GlobalClusterIdentifier?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeGlobalClustersMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
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
export interface DescribeOrderableDBInstanceOptionsMessage {
  Engine?: string;
  EngineVersion?: string;
  DBInstanceClass?: string;
  LicenseModel?: string;
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
export interface ModifyDBInstanceMessage {
  DBInstanceIdentifier?: string;
  AllocatedStorage?: number;
  DBInstanceClass?: string;
  DBSubnetGroupName?: string;
  DBSecurityGroups?: string[];
  VpcSecurityGroupIds?: string[];
  ApplyImmediately?: boolean;
  MasterUserPassword?: string;
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
  OptionGroupName?: string;
  NewDBInstanceIdentifier?: string;
  StorageType?: string;
  TdeCredentialArn?: string;
  TdeCredentialPassword?: string | redacted.Redacted<string>;
  CACertificateIdentifier?: string;
  Domain?: string;
  CopyTagsToSnapshot?: boolean;
  MonitoringInterval?: number;
  DBPortNumber?: number;
  PubliclyAccessible?: boolean;
  MonitoringRoleArn?: string;
  DomainIAMRoleName?: string;
  PromotionTier?: number;
  EnableIAMDatabaseAuthentication?: boolean;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  CloudwatchLogsExportConfiguration?: CloudwatchLogsExportConfiguration;
  DeletionProtection?: boolean;
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
    OptionGroupName: S.optional(S.String),
    NewDBInstanceIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    TdeCredentialArn: S.optional(S.String),
    TdeCredentialPassword: S.optional(SensitiveString),
    CACertificateIdentifier: S.optional(S.String),
    Domain: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    MonitoringInterval: S.optional(S.Number),
    DBPortNumber: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    MonitoringRoleArn: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    PromotionTier: S.optional(S.Number),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    CloudwatchLogsExportConfiguration: S.optional(
      CloudwatchLogsExportConfiguration,
    ),
    DeletionProtection: S.optional(S.Boolean),
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
export type ApplyMethod = "immediate" | "pending-reboot" | (string & {});
export const ApplyMethod = S.String;
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
}
export const ServerlessV2ScalingConfiguration = S.suspend(() =>
  S.Struct({
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServerlessV2ScalingConfiguration",
}) as any as S.Schema<ServerlessV2ScalingConfiguration>;
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
  EnableCloudwatchLogsExports?: string[];
  DBClusterParameterGroupName?: string;
  DeletionProtection?: boolean;
  CopyTagsToSnapshot?: boolean;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  StorageType?: string;
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
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DBClusterParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
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
  EnableCloudwatchLogsExports?: string[];
  DBClusterParameterGroupName?: string;
  DeletionProtection?: boolean;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  StorageType?: string;
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
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DBClusterParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
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
export type ReadReplicaIdentifierList = string[];
export const ReadReplicaIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaIdentifier")),
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
export interface ClusterPendingModifiedValues {
  PendingCloudwatchLogsExports?: PendingCloudwatchLogsExports;
  DBClusterIdentifier?: string;
  IAMDatabaseAuthenticationEnabled?: boolean;
  EngineVersion?: string;
  BackupRetentionPeriod?: number;
  StorageType?: string;
  AllocatedStorage?: number;
  Iops?: number;
}
export const ClusterPendingModifiedValues = S.suspend(() =>
  S.Struct({
    PendingCloudwatchLogsExports: S.optional(PendingCloudwatchLogsExports),
    DBClusterIdentifier: S.optional(S.String),
    IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    StorageType: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    Iops: S.optional(S.Number),
  }),
).annotations({
  identifier: "ClusterPendingModifiedValues",
}) as any as S.Schema<ClusterPendingModifiedValues>;
export interface ServerlessV2ScalingConfigurationInfo {
  MinCapacity?: number;
  MaxCapacity?: number;
}
export const ServerlessV2ScalingConfigurationInfo = S.suspend(() =>
  S.Struct({
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServerlessV2ScalingConfigurationInfo",
}) as any as S.Schema<ServerlessV2ScalingConfigurationInfo>;
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
  MultiAZ?: boolean;
  Engine?: string;
  EngineVersion?: string;
  LatestRestorableTime?: Date;
  Port?: number;
  MasterUsername?: string;
  DBClusterOptionGroupMemberships?: DBClusterOptionGroupStatus[];
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  ReplicationSourceIdentifier?: string;
  ReadReplicaIdentifiers?: string[];
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
  CopyTagsToSnapshot?: boolean;
  EnabledCloudwatchLogsExports?: string[];
  PendingModifiedValues?: ClusterPendingModifiedValues;
  DeletionProtection?: boolean;
  CrossAccountClone?: boolean;
  AutomaticRestartTime?: Date;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfigurationInfo;
  GlobalClusterIdentifier?: string;
  IOOptimizedNextAllowedModificationTime?: Date;
  StorageType?: string;
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
    ReplicationSourceIdentifier: S.optional(S.String),
    ReadReplicaIdentifiers: S.optional(ReadReplicaIdentifierList),
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
    CopyTagsToSnapshot: S.optional(S.Boolean),
    EnabledCloudwatchLogsExports: S.optional(LogTypeList),
    PendingModifiedValues: S.optional(ClusterPendingModifiedValues),
    DeletionProtection: S.optional(S.Boolean),
    CrossAccountClone: S.optional(S.Boolean),
    AutomaticRestartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfigurationInfo,
    ),
    GlobalClusterIdentifier: S.optional(S.String),
    IOOptimizedNextAllowedModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    StorageType: S.optional(S.String),
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
  StorageType?: string;
}
export const DBClusterSnapshot = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    DBClusterSnapshotIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    SnapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Engine: S.optional(S.String),
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
    StorageType: S.optional(S.String),
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
export interface Subnet {
  SubnetIdentifier?: string;
  SubnetAvailabilityZone?: AvailabilityZone;
  SubnetStatus?: string;
}
export const Subnet = S.suspend(() =>
  S.Struct({
    SubnetIdentifier: S.optional(S.String),
    SubnetAvailabilityZone: S.optional(AvailabilityZone),
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
}
export const DBSubnetGroup = S.suspend(() =>
  S.Struct({
    DBSubnetGroupName: S.optional(S.String),
    DBSubnetGroupDescription: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetGroupStatus: S.optional(S.String),
    Subnets: S.optional(SubnetList),
    DBSubnetGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DBSubnetGroup",
}) as any as S.Schema<DBSubnetGroup>;
export interface PendingModifiedValues {
  DBInstanceClass?: string;
  AllocatedStorage?: number;
  MasterUserPassword?: string;
  Port?: number;
  BackupRetentionPeriod?: number;
  MultiAZ?: boolean;
  EngineVersion?: string;
  LicenseModel?: string;
  Iops?: number;
  DBInstanceIdentifier?: string;
  StorageType?: string;
  CACertificateIdentifier?: string;
  DBSubnetGroupName?: string;
  PendingCloudwatchLogsExports?: PendingCloudwatchLogsExports;
}
export const PendingModifiedValues = S.suspend(() =>
  S.Struct({
    DBInstanceClass: S.optional(S.String),
    AllocatedStorage: S.optional(S.Number),
    MasterUserPassword: S.optional(S.String),
    Port: S.optional(S.Number),
    BackupRetentionPeriod: S.optional(S.Number),
    MultiAZ: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    Iops: S.optional(S.Number),
    DBInstanceIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
    DBSubnetGroupName: S.optional(S.String),
    PendingCloudwatchLogsExports: S.optional(PendingCloudwatchLogsExports),
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
export interface DomainMembership {
  Domain?: string;
  Status?: string;
  FQDN?: string;
  IAMRoleName?: string;
}
export const DomainMembership = S.suspend(() =>
  S.Struct({
    Domain: S.optional(S.String),
    Status: S.optional(S.String),
    FQDN: S.optional(S.String),
    IAMRoleName: S.optional(S.String),
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
  PendingModifiedValues?: PendingModifiedValues;
  LatestRestorableTime?: Date;
  MultiAZ?: boolean;
  EngineVersion?: string;
  AutoMinorVersionUpgrade?: boolean;
  ReadReplicaSourceDBInstanceIdentifier?: string;
  ReadReplicaDBInstanceIdentifiers?: string[];
  ReadReplicaDBClusterIdentifiers?: string[];
  LicenseModel?: string;
  Iops?: number;
  OptionGroupMemberships?: OptionGroupMembership[];
  CharacterSetName?: string;
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
  PerformanceInsightsEnabled?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  EnabledCloudwatchLogsExports?: string[];
  DeletionProtection?: boolean;
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
    LicenseModel: S.optional(S.String),
    Iops: S.optional(S.Number),
    OptionGroupMemberships: S.optional(OptionGroupMembershipList),
    CharacterSetName: S.optional(S.String),
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
    PerformanceInsightsEnabled: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    EnabledCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
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
export type ReadersArnList = string[];
export const ReadersArnList = S.Array(S.String);
export interface GlobalClusterMember {
  DBClusterArn?: string;
  Readers?: string[];
  IsWriter?: boolean;
}
export const GlobalClusterMember = S.suspend(() =>
  S.Struct({
    DBClusterArn: S.optional(S.String),
    Readers: S.optional(ReadersArnList),
    IsWriter: S.optional(S.Boolean),
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
  StorageEncrypted?: boolean;
  DeletionProtection?: boolean;
  GlobalClusterMembers?: GlobalClusterMember[];
  FailoverState?: FailoverState;
}
export const GlobalCluster = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
    GlobalClusterResourceId: S.optional(S.String),
    GlobalClusterArn: S.optional(S.String),
    Status: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    StorageEncrypted: S.optional(S.Boolean),
    DeletionProtection: S.optional(S.Boolean),
    GlobalClusterMembers: S.optional(GlobalClusterMemberList),
    FailoverState: S.optional(FailoverState),
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
  CopyTagsToSnapshot?: boolean;
  DatabaseName?: string;
  DBClusterIdentifier?: string;
  DBClusterParameterGroupName?: string;
  VpcSecurityGroupIds?: string[];
  DBSubnetGroupName?: string;
  Engine?: string;
  EngineVersion?: string;
  Port?: number;
  MasterUsername?: string;
  MasterUserPassword?: string;
  OptionGroupName?: string;
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  ReplicationSourceIdentifier?: string;
  Tags?: Tag[];
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  PreSignedUrl?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  EnableCloudwatchLogsExports?: string[];
  DeletionProtection?: boolean;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  GlobalClusterIdentifier?: string;
  StorageType?: string;
}
export const CreateDBClusterMessage = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    BackupRetentionPeriod: S.optional(S.Number),
    CharacterSetName: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    DatabaseName: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    DBSubnetGroupName: S.optional(S.String),
    Engine: S.optional(S.String),
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
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    GlobalClusterIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
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
export interface CreateDBClusterEndpointOutput {
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
export const CreateDBClusterEndpointOutput = S.suspend(() =>
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
  identifier: "CreateDBClusterEndpointOutput",
}) as any as S.Schema<CreateDBClusterEndpointOutput>;
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
export interface CreateDBParameterGroupResult {
  DBParameterGroup?: DBParameterGroup;
}
export const CreateDBParameterGroupResult = S.suspend(() =>
  S.Struct({ DBParameterGroup: S.optional(DBParameterGroup) }).pipe(ns),
).annotations({
  identifier: "CreateDBParameterGroupResult",
}) as any as S.Schema<CreateDBParameterGroupResult>;
export interface CreateEventSubscriptionResult {
  EventSubscription?: EventSubscription;
}
export const CreateEventSubscriptionResult = S.suspend(() =>
  S.Struct({ EventSubscription: S.optional(EventSubscription) }).pipe(ns),
).annotations({
  identifier: "CreateEventSubscriptionResult",
}) as any as S.Schema<CreateEventSubscriptionResult>;
export interface DeleteDBClusterEndpointOutput {
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
export const DeleteDBClusterEndpointOutput = S.suspend(() =>
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
  identifier: "DeleteDBClusterEndpointOutput",
}) as any as S.Schema<DeleteDBClusterEndpointOutput>;
export interface DeleteDBClusterSnapshotResult {
  DBClusterSnapshot?: DBClusterSnapshot;
}
export const DeleteDBClusterSnapshotResult = S.suspend(() =>
  S.Struct({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }).pipe(ns),
).annotations({
  identifier: "DeleteDBClusterSnapshotResult",
}) as any as S.Schema<DeleteDBClusterSnapshotResult>;
export interface DeleteDBInstanceResult {
  DBInstance?: DBInstance;
}
export const DeleteDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "DeleteDBInstanceResult",
}) as any as S.Schema<DeleteDBInstanceResult>;
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
export interface DBInstanceMessage {
  Marker?: string;
  DBInstances?: DBInstance[];
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
export interface ModifyDBClusterMessage {
  DBClusterIdentifier?: string;
  NewDBClusterIdentifier?: string;
  ApplyImmediately?: boolean;
  BackupRetentionPeriod?: number;
  DBClusterParameterGroupName?: string;
  VpcSecurityGroupIds?: string[];
  Port?: number;
  MasterUserPassword?: string;
  OptionGroupName?: string;
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  EnableIAMDatabaseAuthentication?: boolean;
  CloudwatchLogsExportConfiguration?: CloudwatchLogsExportConfiguration;
  EngineVersion?: string;
  AllowMajorVersionUpgrade?: boolean;
  DBInstanceParameterGroupName?: string;
  DeletionProtection?: boolean;
  CopyTagsToSnapshot?: boolean;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  StorageType?: string;
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
    MasterUserPassword: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    CloudwatchLogsExportConfiguration: S.optional(
      CloudwatchLogsExportConfiguration,
    ),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
    DBInstanceParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
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
export interface ModifyDBClusterEndpointOutput {
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
export const ModifyDBClusterEndpointOutput = S.suspend(() =>
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
  identifier: "ModifyDBClusterEndpointOutput",
}) as any as S.Schema<ModifyDBClusterEndpointOutput>;
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
export interface ModifyDBInstanceResult {
  DBInstance?: DBInstance;
}
export const ModifyDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "ModifyDBInstanceResult",
}) as any as S.Schema<ModifyDBInstanceResult>;
export interface DBParameterGroupNameMessage {
  DBParameterGroupName?: string;
}
export const DBParameterGroupNameMessage = S.suspend(() =>
  S.Struct({ DBParameterGroupName: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DBParameterGroupNameMessage",
}) as any as S.Schema<DBParameterGroupNameMessage>;
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
export interface PromoteReadReplicaDBClusterResult {
  DBCluster?: DBCluster;
}
export const PromoteReadReplicaDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "PromoteReadReplicaDBClusterResult",
}) as any as S.Schema<PromoteReadReplicaDBClusterResult>;
export interface RebootDBInstanceResult {
  DBInstance?: DBInstance;
}
export const RebootDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "RebootDBInstanceResult",
}) as any as S.Schema<RebootDBInstanceResult>;
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
export interface StartDBClusterResult {
  DBCluster?: DBCluster;
}
export const StartDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "StartDBClusterResult",
}) as any as S.Schema<StartDBClusterResult>;
export interface StopDBClusterResult {
  DBCluster?: DBCluster;
}
export const StopDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "StopDBClusterResult",
}) as any as S.Schema<StopDBClusterResult>;
export interface SwitchoverGlobalClusterResult {
  GlobalCluster?: GlobalCluster;
}
export const SwitchoverGlobalClusterResult = S.suspend(() =>
  S.Struct({ GlobalCluster: S.optional(GlobalCluster) }).pipe(ns),
).annotations({
  identifier: "SwitchoverGlobalClusterResult",
}) as any as S.Schema<SwitchoverGlobalClusterResult>;
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
export interface CreateDBClusterResult {
  DBCluster?: DBCluster;
}
export const CreateDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "CreateDBClusterResult",
}) as any as S.Schema<CreateDBClusterResult>;
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
export interface ModifyDBClusterResult {
  DBCluster?: DBCluster;
}
export const ModifyDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "ModifyDBClusterResult",
}) as any as S.Schema<ModifyDBClusterResult>;
export interface UpgradeTarget {
  Engine?: string;
  EngineVersion?: string;
  Description?: string;
  AutoUpgrade?: boolean;
  IsMajorVersionUpgrade?: boolean;
  SupportsGlobalDatabases?: boolean;
}
export const UpgradeTarget = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    Description: S.optional(S.String),
    AutoUpgrade: S.optional(S.Boolean),
    IsMajorVersionUpgrade: S.optional(S.Boolean),
    SupportsGlobalDatabases: S.optional(S.Boolean),
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
export type AvailabilityZoneList = AvailabilityZone[];
export const AvailabilityZoneList = S.Array(
  AvailabilityZone.pipe(T.XmlName("AvailabilityZone")).annotations({
    identifier: "AvailabilityZone",
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
  }),
).annotations({
  identifier: "DBClusterEndpoint",
}) as any as S.Schema<DBClusterEndpoint>;
export type DBClusterEndpointList = DBClusterEndpoint[];
export const DBClusterEndpointList = S.Array(
  DBClusterEndpoint.pipe(T.XmlName("DBClusterEndpointList")).annotations({
    identifier: "DBClusterEndpoint",
  }),
);
export interface DBEngineVersion {
  Engine?: string;
  EngineVersion?: string;
  DBParameterGroupFamily?: string;
  DBEngineDescription?: string;
  DBEngineVersionDescription?: string;
  DefaultCharacterSet?: CharacterSet;
  SupportedCharacterSets?: CharacterSet[];
  ValidUpgradeTarget?: UpgradeTarget[];
  SupportedTimezones?: Timezone[];
  ExportableLogTypes?: string[];
  SupportsLogExportsToCloudwatchLogs?: boolean;
  SupportsReadReplica?: boolean;
  SupportsGlobalDatabases?: boolean;
}
export const DBEngineVersion = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DBParameterGroupFamily: S.optional(S.String),
    DBEngineDescription: S.optional(S.String),
    DBEngineVersionDescription: S.optional(S.String),
    DefaultCharacterSet: S.optional(CharacterSet),
    SupportedCharacterSets: S.optional(SupportedCharacterSetsList),
    ValidUpgradeTarget: S.optional(ValidUpgradeTargetList),
    SupportedTimezones: S.optional(SupportedTimezonesList),
    ExportableLogTypes: S.optional(LogTypeList),
    SupportsLogExportsToCloudwatchLogs: S.optional(S.Boolean),
    SupportsReadReplica: S.optional(S.Boolean),
    SupportsGlobalDatabases: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DBEngineVersion",
}) as any as S.Schema<DBEngineVersion>;
export type DBEngineVersionList = DBEngineVersion[];
export const DBEngineVersionList = S.Array(
  DBEngineVersion.pipe(T.XmlName("DBEngineVersion")).annotations({
    identifier: "DBEngineVersion",
  }),
);
export interface OrderableDBInstanceOption {
  Engine?: string;
  EngineVersion?: string;
  DBInstanceClass?: string;
  LicenseModel?: string;
  AvailabilityZones?: AvailabilityZone[];
  MultiAZCapable?: boolean;
  ReadReplicaCapable?: boolean;
  Vpc?: boolean;
  SupportsStorageEncryption?: boolean;
  StorageType?: string;
  SupportsIops?: boolean;
  SupportsEnhancedMonitoring?: boolean;
  SupportsIAMDatabaseAuthentication?: boolean;
  SupportsPerformanceInsights?: boolean;
  MinStorageSize?: number;
  MaxStorageSize?: number;
  MinIopsPerDbInstance?: number;
  MaxIopsPerDbInstance?: number;
  MinIopsPerGib?: number;
  MaxIopsPerGib?: number;
  SupportsGlobalDatabases?: boolean;
}
export const OrderableDBInstanceOption = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    AvailabilityZones: S.optional(AvailabilityZoneList),
    MultiAZCapable: S.optional(S.Boolean),
    ReadReplicaCapable: S.optional(S.Boolean),
    Vpc: S.optional(S.Boolean),
    SupportsStorageEncryption: S.optional(S.Boolean),
    StorageType: S.optional(S.String),
    SupportsIops: S.optional(S.Boolean),
    SupportsEnhancedMonitoring: S.optional(S.Boolean),
    SupportsIAMDatabaseAuthentication: S.optional(S.Boolean),
    SupportsPerformanceInsights: S.optional(S.Boolean),
    MinStorageSize: S.optional(S.Number),
    MaxStorageSize: S.optional(S.Number),
    MinIopsPerDbInstance: S.optional(S.Number),
    MaxIopsPerDbInstance: S.optional(S.Number),
    MinIopsPerGib: S.optional(S.Number),
    MaxIopsPerGib: S.optional(S.Number),
    SupportsGlobalDatabases: S.optional(S.Boolean),
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
export interface CreateDBSubnetGroupResult {
  DBSubnetGroup?: DBSubnetGroup;
}
export const CreateDBSubnetGroupResult = S.suspend(() =>
  S.Struct({ DBSubnetGroup: S.optional(DBSubnetGroup) }).pipe(ns),
).annotations({
  identifier: "CreateDBSubnetGroupResult",
}) as any as S.Schema<CreateDBSubnetGroupResult>;
export interface CreateGlobalClusterResult {
  GlobalCluster?: GlobalCluster;
}
export const CreateGlobalClusterResult = S.suspend(() =>
  S.Struct({ GlobalCluster: S.optional(GlobalCluster) }).pipe(ns),
).annotations({
  identifier: "CreateGlobalClusterResult",
}) as any as S.Schema<CreateGlobalClusterResult>;
export interface DeleteDBClusterResult {
  DBCluster?: DBCluster;
}
export const DeleteDBClusterResult = S.suspend(() =>
  S.Struct({ DBCluster: S.optional(DBCluster) }).pipe(ns),
).annotations({
  identifier: "DeleteDBClusterResult",
}) as any as S.Schema<DeleteDBClusterResult>;
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
export interface ValidStorageOptions {
  StorageType?: string;
  StorageSize?: Range[];
  ProvisionedIops?: Range[];
  IopsToStorageRatio?: DoubleRange[];
}
export const ValidStorageOptions = S.suspend(() =>
  S.Struct({
    StorageType: S.optional(S.String),
    StorageSize: S.optional(RangeList),
    ProvisionedIops: S.optional(RangeList),
    IopsToStorageRatio: S.optional(DoubleRangeList),
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
export interface ValidDBInstanceModificationsMessage {
  Storage?: ValidStorageOptions[];
}
export const ValidDBInstanceModificationsMessage = S.suspend(() =>
  S.Struct({ Storage: S.optional(ValidStorageOptionsList) }),
).annotations({
  identifier: "ValidDBInstanceModificationsMessage",
}) as any as S.Schema<ValidDBInstanceModificationsMessage>;
export interface CreateDBInstanceResult {
  DBInstance?: DBInstance;
}
export const CreateDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "CreateDBInstanceResult",
}) as any as S.Schema<CreateDBInstanceResult>;
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

//# Errors
export class DBClusterNotFoundFault extends S.TaggedError<DBClusterNotFoundFault>()(
  "DBClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBClusterNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBParameterGroupNotFoundFault extends S.TaggedError<DBParameterGroupNotFoundFault>()(
  "DBParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBParameterGroupNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBSubnetGroupNotFoundFault extends S.TaggedError<DBSubnetGroupNotFoundFault>()(
  "DBSubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupNotFoundFault",
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
export class DBInstanceNotFoundFault extends S.TaggedError<DBInstanceNotFoundFault>()(
  "DBInstanceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceNotFound", httpResponseCode: 404 }),
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
export class EventSubscriptionQuotaExceededFault extends S.TaggedError<EventSubscriptionQuotaExceededFault>()(
  "EventSubscriptionQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventSubscriptionQuotaExceeded",
    httpResponseCode: 400,
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
export class SubscriptionNotFoundFault extends S.TaggedError<SubscriptionNotFoundFault>()(
  "SubscriptionNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundFault extends S.TaggedError<ResourceNotFoundFault>()(
  "ResourceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBClusterStateFault extends S.TaggedError<InvalidDBClusterStateFault>()(
  "InvalidDBClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AuthorizationNotFoundFault extends S.TaggedError<AuthorizationNotFoundFault>()(
  "AuthorizationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AuthorizationNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBSubnetGroupDoesNotCoverEnoughAZs extends S.TaggedError<DBSubnetGroupDoesNotCoverEnoughAZs>()(
  "DBSubnetGroupDoesNotCoverEnoughAZs",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupDoesNotCoverEnoughAZs",
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
export class DBClusterRoleNotFoundFault extends S.TaggedError<DBClusterRoleNotFoundFault>()(
  "DBClusterRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBClusterRoleNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBClusterRoleQuotaExceededFault extends S.TaggedError<DBClusterRoleQuotaExceededFault>()(
  "DBClusterRoleQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterRoleQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSnapshotNotFoundFault extends S.TaggedError<DBSnapshotNotFoundFault>()(
  "DBSnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotNotFound", httpResponseCode: 404 }),
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
export class SNSInvalidTopicFault extends S.TaggedError<SNSInvalidTopicFault>()(
  "SNSInvalidTopicFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSInvalidTopic", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBClusterEndpointStateFault extends S.TaggedError<InvalidDBClusterEndpointStateFault>()(
  "InvalidDBClusterEndpointStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterEndpointStateFault",
    httpResponseCode: 400,
  }),
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
export class DBSubnetQuotaExceededFault extends S.TaggedError<DBSubnetQuotaExceededFault>()(
  "DBSubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetQuotaExceededFault",
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
export class DBSnapshotAlreadyExistsFault extends S.TaggedError<DBSnapshotAlreadyExistsFault>()(
  "DBSnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SnapshotQuotaExceededFault extends S.TaggedError<SnapshotQuotaExceededFault>()(
  "SnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBSubnetGroupAlreadyExistsFault extends S.TaggedError<DBSubnetGroupAlreadyExistsFault>()(
  "DBSubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SNSNoAuthorizationFault extends S.TaggedError<SNSNoAuthorizationFault>()(
  "SNSNoAuthorizationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSNoAuthorization", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class GlobalClusterAlreadyExistsFault extends S.TaggedError<GlobalClusterAlreadyExistsFault>()(
  "GlobalClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBInstanceAlreadyExistsFault extends S.TaggedError<DBInstanceAlreadyExistsFault>()(
  "DBInstanceAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceAlreadyExists", httpResponseCode: 400 }),
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
export class KMSKeyNotAccessibleFault extends S.TaggedError<KMSKeyNotAccessibleFault>()(
  "KMSKeyNotAccessibleFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSKeyNotAccessibleFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SharedSnapshotQuotaExceededFault extends S.TaggedError<SharedSnapshotQuotaExceededFault>()(
  "SharedSnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SharedSnapshotQuotaExceeded",
    httpResponseCode: 400,
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
export class DBSubnetGroupQuotaExceededFault extends S.TaggedError<DBSubnetGroupQuotaExceededFault>()(
  "DBSubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SNSTopicArnNotFoundFault extends S.TaggedError<SNSTopicArnNotFoundFault>()(
  "SNSTopicArnNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSTopicArnNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class GlobalClusterQuotaExceededFault extends S.TaggedError<GlobalClusterQuotaExceededFault>()(
  "GlobalClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSecurityGroupNotFoundFault extends S.TaggedError<DBSecurityGroupNotFoundFault>()(
  "DBSecurityGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSecurityGroupNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class SubnetAlreadyInUse extends S.TaggedError<SubnetAlreadyInUse>()(
  "SubnetAlreadyInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetAlreadyInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientDBClusterCapacityFault extends S.TaggedError<InsufficientDBClusterCapacityFault>()(
  "InsufficientDBClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDBClusterCapacityFault",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InsufficientStorageClusterCapacityFault extends S.TaggedError<InsufficientStorageClusterCapacityFault>()(
  "InsufficientStorageClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientStorageClusterCapacity",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubscriptionAlreadyExistFault extends S.TaggedError<SubscriptionAlreadyExistFault>()(
  "SubscriptionAlreadyExistFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionAlreadyExist", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBUpgradeDependencyFailureFault extends S.TaggedError<DBUpgradeDependencyFailureFault>()(
  "DBUpgradeDependencyFailureFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBUpgradeDependencyFailure",
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
export class DomainNotFoundFault extends S.TaggedError<DomainNotFoundFault>()(
  "DomainNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DomainNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class StorageQuotaExceededFault extends S.TaggedError<StorageQuotaExceededFault>()(
  "StorageQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBSnapshotStateFault extends S.TaggedError<InvalidDBSnapshotStateFault>()(
  "InvalidDBSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSnapshotState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InstanceQuotaExceededFault extends S.TaggedError<InstanceQuotaExceededFault>()(
  "InstanceQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InstanceQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class StorageTypeNotSupportedFault extends S.TaggedError<StorageTypeNotSupportedFault>()(
  "StorageTypeNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageTypeNotSupported", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidRestoreFault extends S.TaggedError<InvalidRestoreFault>()(
  "InvalidRestoreFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRestoreFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientDBInstanceCapacityFault extends S.TaggedError<InsufficientDBInstanceCapacityFault>()(
  "InsufficientDBInstanceCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDBInstanceCapacity",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class OptionGroupNotFoundFault extends S.TaggedError<OptionGroupNotFoundFault>()(
  "OptionGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "OptionGroupNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ProvisionedIopsNotAvailableInAZFault extends S.TaggedError<ProvisionedIopsNotAvailableInAZFault>()(
  "ProvisionedIopsNotAvailableInAZFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ProvisionedIopsNotAvailableInAZFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of `DBClusterParameterGroup` descriptions. If a
 * `DBClusterParameterGroupName` parameter is specified, the list will contain only
 * the description of the specified DB cluster parameter group.
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
 * Returns information about provisioned DB clusters, and supports
 * pagination.
 *
 * This operation can also return information for Amazon RDS clusters
 * and Amazon DocDB clusters.
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
 * Returns a list of `DBParameterGroup` descriptions. If a
 * `DBParameterGroupName` is specified, the list will contain only the description of
 * the specified DB parameter group.
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
 * Returns a list of DBSubnetGroup descriptions. If a DBSubnetGroupName is specified, the
 * list will contain only the descriptions of the specified DBSubnetGroup.
 *
 * For an overview of CIDR ranges, go to the Wikipedia Tutorial.
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
 * Returns the default engine and system parameter information for the specified database
 * engine.
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
 * Deletes a specified DB cluster parameter group. The DB cluster parameter group to be
 * deleted can't be associated with any DB clusters.
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
 * Returns the default engine and system parameter information for the cluster database
 * engine.
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
 * Displays a list of categories for all event source types, or, if specified, for a
 * specified source type.
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
 * Returns events related to DB instances, DB security groups, DB snapshots, and DB parameter
 * groups for the past 14 days. Events specific to a particular DB instance, DB security group,
 * database snapshot, or DB parameter group can be obtained by providing the name as a parameter.
 * By default, the past hour of events are returned.
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
 * Lists all the subscription descriptions for a customer account. The description for a
 * subscription includes SubscriptionName, SNSTopicARN, CustomerID, SourceType, SourceID,
 * CreationTime, and Status.
 *
 * If you specify a SubscriptionName, lists the description for that subscription.
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
 * Returns a list of resources (for example, DB instances) that have at least one pending
 * maintenance action.
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
 * Removes a source identifier from an existing event notification subscription.
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
 * Disassociates an Identity and Access Management (IAM) role from a DB cluster.
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
 * Returns information about provisioned instances, and supports pagination.
 *
 * This operation can also return information for Amazon RDS instances
 * and Amazon DocDB instances.
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
 * Modifies the parameters of a DB cluster parameter group. To modify more than one
 * parameter, submit a list of the following: `ParameterName`,
 * `ParameterValue`, and `ApplyMethod`. A maximum of 20 parameters can be
 * modified in a single request.
 *
 * Changes to dynamic parameters are applied immediately. Changes to static parameters
 * require a reboot without failover to the DB cluster associated with the parameter group
 * before the change can take effect.
 *
 * After you create a DB cluster parameter group, you should wait at least 5 minutes before
 * creating your first DB cluster that uses that DB cluster parameter group as the default
 * parameter group. This allows Amazon Neptune to fully complete the create action before the
 * parameter group is used as the default for a new DB cluster. This is especially important
 * for parameters that are critical when creating the default database for a DB cluster, such
 * as the character set for the default database defined by the
 * `character_set_database` parameter. You can use the Parameter
 * Groups option of the Amazon Neptune console or the DescribeDBClusterParameters command to verify that your DB cluster parameter
 * group has been created or modified.
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
 * Changes to dynamic parameters are applied immediately. Changes to static parameters
 * require a reboot without failover to the DB instance associated with the parameter group
 * before the change can take effect.
 *
 * After you modify a DB parameter group, you should wait at least 5 minutes before
 * creating your first DB instance that uses that DB parameter group as the default parameter
 * group. This allows Amazon Neptune to fully complete the modify action before the parameter
 * group is used as the default for a new DB instance. This is especially important for
 * parameters that are critical when creating the default database for a DB instance, such as
 * the character set for the default database defined by the
 * `character_set_database` parameter. You can use the Parameter
 * Groups option of the Amazon Neptune console or the
 * *DescribeDBParameters* command to verify that your DB parameter group has
 * been created or modified.
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
 * Modifies the parameters of a DB cluster parameter group to the default value. To reset
 * specific parameters submit a list of the following: `ParameterName` and
 * `ApplyMethod`. To reset the entire DB cluster parameter group, specify the
 * `DBClusterParameterGroupName` and `ResetAllParameters` parameters.
 *
 * When resetting the entire group, dynamic parameters are updated immediately and static
 * parameters are set to `pending-reboot` to take effect on the next DB instance
 * restart or RebootDBInstance request. You must call RebootDBInstance for every DB instance in your DB cluster
 * that you want the updated static parameter to apply to.
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
 * Deletes a specified DBParameterGroup. The DBParameterGroup to be deleted can't be
 * associated with any DB instances.
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
 * Modifies the parameters of a DB parameter group to the engine/system default value. To
 * reset specific parameters, provide a list of the following: `ParameterName` and
 * `ApplyMethod`. To reset the entire DB parameter group, specify the
 * `DBParameterGroup` name and `ResetAllParameters` parameters. When
 * resetting the entire group, dynamic parameters are updated immediately and static parameters
 * are set to `pending-reboot` to take effect on the next DB instance restart or
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
 * Returns information about DB cluster snapshots. This API action supports
 * pagination.
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
 * Returns information about Neptune global database clusters. This API
 * supports pagination.
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
 * Deletes an event notification subscription.
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
 * Not supported.
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
 * Adds a source identifier to an existing event notification subscription.
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
 * Associates an Identity and Access Management (IAM) role with an
 * Neptune DB cluster.
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
 * Adds metadata tags to an Amazon Neptune resource. These tags can also be used with cost
 * allocation reporting to track cost associated with Amazon Neptune resources, or used in a
 * Condition statement in an IAM policy for Amazon Neptune.
 */
export const addTagsToResource: (
  input: AddTagsToResourceMessage,
) => effect.Effect<
  AddTagsToResourceResponse,
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | DBSnapshotNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceMessage,
  output: AddTagsToResourceResponse,
  errors: [
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    DBSnapshotNotFoundFault,
  ],
}));
/**
 * Applies a pending maintenance action to a resource (for example, to a DB instance).
 */
export const applyPendingMaintenanceAction: (
  input: ApplyPendingMaintenanceActionMessage,
) => effect.Effect<
  ApplyPendingMaintenanceActionResult,
  ResourceNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApplyPendingMaintenanceActionMessage,
  output: ApplyPendingMaintenanceActionResult,
  errors: [ResourceNotFoundFault],
}));
/**
 * Creates a new DB cluster parameter group.
 *
 * Parameters in a DB cluster parameter group apply to all of the instances in a DB
 * cluster.
 *
 * A DB cluster parameter group is initially created with the default
 * parameters for the database engine used by instances in the DB cluster.
 * To provide custom values for any of the parameters, you must modify the
 * group after creating it using ModifyDBClusterParameterGroup.
 * Once you've created a DB cluster parameter group, you need to associate it
 * with your DB cluster using ModifyDBCluster.
 * When you associate a new DB cluster parameter group with a running DB cluster,
 * you need to reboot the DB instances in the DB cluster without failover for the
 * new DB cluster parameter group and associated settings to take effect.
 *
 * After you create a DB cluster parameter group, you should wait at least
 * 5 minutes before creating your first DB cluster that uses that DB cluster
 * parameter group as the default parameter group. This allows Amazon Neptune
 * to fully complete the create action before the DB cluster parameter group
 * is used as the default for a new DB cluster. This is especially important for
 * parameters that are critical when creating the default database for a DB
 * cluster, such as the character set for the default database defined by the
 * `character_set_database` parameter. You can use the Parameter
 * Groups option of the Amazon Neptune
 * console or the DescribeDBClusterParameters
 * command to verify that your DB cluster parameter group has been created or modified.
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
 * Deletes a custom endpoint and removes it from an Amazon Neptune DB cluster.
 */
export const deleteDBClusterEndpoint: (
  input: DeleteDBClusterEndpointMessage,
) => effect.Effect<
  DeleteDBClusterEndpointOutput,
  | DBClusterEndpointNotFoundFault
  | InvalidDBClusterEndpointStateFault
  | InvalidDBClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBClusterEndpointMessage,
  output: DeleteDBClusterEndpointOutput,
  errors: [
    DBClusterEndpointNotFoundFault,
    InvalidDBClusterEndpointStateFault,
    InvalidDBClusterStateFault,
  ],
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
 * Deletes a global database. The primary and all secondary clusters must
 * already be detached or deleted first.
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
 * Returns information about endpoints for an Amazon Neptune DB cluster.
 *
 * This operation can also return information for Amazon RDS clusters
 * and Amazon DocDB clusters.
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
 * Returns a list of DB cluster snapshot attribute names and values for a manual DB cluster
 * snapshot.
 *
 * When sharing snapshots with other Amazon accounts,
 * `DescribeDBClusterSnapshotAttributes` returns the `restore` attribute
 * and a list of IDs for the Amazon accounts that are authorized to copy or restore the manual DB
 * cluster snapshot. If `all` is included in the list of values for the
 * `restore` attribute, then the manual DB cluster snapshot is public and can be
 * copied or restored by all Amazon accounts.
 *
 * To add or remove access for an Amazon account to copy or restore a manual DB cluster
 * snapshot, or to make the manual DB cluster snapshot public or private, use the ModifyDBClusterSnapshotAttribute API action.
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
 * Returns a list of the available DB engines.
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
 * Returns a list of orderable DB instance options for the specified engine.
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
 * Forces a failover for a DB cluster.
 *
 * A failover for a DB cluster promotes one of the Read Replicas (read-only instances) in the
 * DB cluster to be the primary instance (the cluster writer).
 *
 * Amazon Neptune will automatically fail over to a Read Replica, if one exists, when the
 * primary instance fails. You can force a failover when you want to simulate a failure of a
 * primary instance for testing. Because each instance in a DB cluster has its own endpoint
 * address, you will need to clean up and re-establish any existing connections that use those
 * endpoint addresses when the failover is complete.
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
 * Lists all tags on an Amazon Neptune resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceMessage,
) => effect.Effect<
  TagListMessage,
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | DBSnapshotNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceMessage,
  output: TagListMessage,
  errors: [
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    DBSnapshotNotFoundFault,
  ],
}));
/**
 * Removes metadata tags from an Amazon Neptune resource.
 */
export const removeTagsFromResource: (
  input: RemoveTagsFromResourceMessage,
) => effect.Effect<
  RemoveTagsFromResourceResponse,
  | DBClusterNotFoundFault
  | DBInstanceNotFoundFault
  | DBSnapshotNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsFromResourceMessage,
  output: RemoveTagsFromResourceResponse,
  errors: [
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    DBSnapshotNotFoundFault,
  ],
}));
/**
 * Creates a new DB parameter group.
 *
 * A DB parameter group is initially created with the default parameters for the database
 * engine used by the DB instance. To provide custom values for any of the parameters, you must
 * modify the group after creating it using *ModifyDBParameterGroup*. Once
 * you've created a DB parameter group, you need to associate it with your DB instance using
 * *ModifyDBInstance*. When you associate a new DB parameter group with a
 * running DB instance, you need to reboot the DB instance without failover for the new DB
 * parameter group and associated settings to take effect.
 *
 * After you create a DB parameter group, you should wait at least 5 minutes before
 * creating your first DB instance that uses that DB parameter group as the default parameter
 * group. This allows Amazon Neptune to fully complete the create action before the parameter
 * group is used as the default for a new DB instance. This is especially important for
 * parameters that are critical when creating the default database for a DB instance, such as
 * the character set for the default database defined by the
 * `character_set_database` parameter. You can use the Parameter
 * Groups option of the Amazon Neptune console or the
 * *DescribeDBParameters* command to verify that your DB parameter group has
 * been created or modified.
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
 * Deletes a DB cluster snapshot. If the snapshot is being copied, the copy operation is
 * terminated.
 *
 * The DB cluster snapshot must be in the `available` state to be
 * deleted.
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
 * Modifies the properties of an endpoint in an Amazon Neptune DB cluster.
 */
export const modifyDBClusterEndpoint: (
  input: ModifyDBClusterEndpointMessage,
) => effect.Effect<
  ModifyDBClusterEndpointOutput,
  | DBClusterEndpointNotFoundFault
  | DBInstanceNotFoundFault
  | InvalidDBClusterEndpointStateFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBClusterEndpointMessage,
  output: ModifyDBClusterEndpointOutput,
  errors: [
    DBClusterEndpointNotFoundFault,
    DBInstanceNotFoundFault,
    InvalidDBClusterEndpointStateFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * Initiates the failover process for a Neptune global database.
 *
 * A failover for a Neptune global database promotes one of secondary
 * read-only DB clusters to be the primary DB cluster and demotes the
 * primary DB cluster to being a secondary (read-only) DB cluster. In other
 * words, the role of the current primary DB cluster and the selected
 * target secondary DB cluster are switched. The selected secondary DB cluster
 * assumes full read/write capabilities for the Neptune global database.
 *
 * This action applies **only** to
 * Neptune global databases. This action is only intended for use on healthy
 * Neptune global databases with healthy Neptune DB clusters and no region-wide
 * outages, to test disaster recovery scenarios or to reconfigure the global
 * database topology.
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
 * Modify a setting for an Amazon Neptune global cluster. You can change one
 * or more database configuration parameters by specifying these parameters
 * and their new values in the request.
 */
export const modifyGlobalCluster: (
  input: ModifyGlobalClusterMessage,
) => effect.Effect<
  ModifyGlobalClusterResult,
  GlobalClusterNotFoundFault | InvalidGlobalClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyGlobalClusterMessage,
  output: ModifyGlobalClusterResult,
  errors: [GlobalClusterNotFoundFault, InvalidGlobalClusterStateFault],
}));
/**
 * Detaches a Neptune DB cluster from a Neptune global database. A secondary
 * cluster becomes a normal standalone cluster with read-write capability
 * instead of being read-only, and no longer receives data from a the
 * primary cluster.
 */
export const removeFromGlobalCluster: (
  input: RemoveFromGlobalClusterMessage,
) => effect.Effect<
  RemoveFromGlobalClusterResult,
  | DBClusterNotFoundFault
  | GlobalClusterNotFoundFault
  | InvalidGlobalClusterStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveFromGlobalClusterMessage,
  output: RemoveFromGlobalClusterResult,
  errors: [
    DBClusterNotFoundFault,
    GlobalClusterNotFoundFault,
    InvalidGlobalClusterStateFault,
  ],
}));
/**
 * Switches over the specified secondary DB cluster to be the new primary DB cluster in the global
 * database cluster. Switchover operations were previously called "managed planned failovers."
 *
 * Promotes the specified secondary cluster to assume full read/write capabilities and demotes the current
 * primary cluster to a secondary (read-only) cluster, maintaining the original replication topology. All secondary
 * clusters are synchronized with the primary at the beginning of the process so the new primary continues operations
 * for the global database without losing any data. Your database is unavailable for a short time while the primary
 * and selected secondary clusters are assuming their new roles.
 *
 * This operation is intended for controlled environments, for operations such as "regional rotation" or
 * to fall back to the original primary after a global database failover.
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
 * You might need to reboot your DB instance, usually for maintenance reasons. For example,
 * if you make certain modifications, or if you change the DB parameter group associated with the
 * DB instance, you must reboot the instance for the changes to take effect.
 *
 * Rebooting a DB instance restarts the database engine service. Rebooting a DB instance
 * results in a momentary outage, during which the DB instance status is set to rebooting.
 */
export const rebootDBInstance: (
  input: RebootDBInstanceMessage,
) => effect.Effect<
  RebootDBInstanceResult,
  DBInstanceNotFoundFault | InvalidDBInstanceStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBInstanceMessage,
  output: RebootDBInstanceResult,
  errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
}));
/**
 * Starts an Amazon Neptune DB cluster that was stopped using the Amazon
 * console, the Amazon CLI stop-db-cluster command, or the StopDBCluster API.
 */
export const startDBCluster: (
  input: StartDBClusterMessage,
) => effect.Effect<
  StartDBClusterResult,
  | DBClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDBClusterMessage,
  output: StartDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * Stops an Amazon Neptune DB cluster. When you stop a DB cluster, Neptune
 * retains the DB cluster's metadata, including its endpoints and DB parameter
 * groups.
 *
 * Neptune also retains the transaction logs so you can do a point-in-time
 * restore if necessary.
 */
export const stopDBCluster: (
  input: StopDBClusterMessage,
) => effect.Effect<
  StopDBClusterResult,
  | DBClusterNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDBClusterMessage,
  output: StopDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * Creates a new custom endpoint and associates it with an Amazon Neptune DB cluster.
 */
export const createDBClusterEndpoint: (
  input: CreateDBClusterEndpointMessage,
) => effect.Effect<
  CreateDBClusterEndpointOutput,
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
  output: CreateDBClusterEndpointOutput,
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
 * Creates a snapshot of a DB cluster.
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
 * You can call DescribeValidDBInstanceModifications
 * to learn what modifications you can make to your DB instance. You can use this
 * information when you call ModifyDBInstance.
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
 * Copies a snapshot of a DB cluster.
 *
 * To copy a DB cluster snapshot from a shared manual DB cluster snapshot,
 * `SourceDBClusterSnapshotIdentifier` must be the Amazon Resource Name (ARN) of the
 * shared DB cluster snapshot.
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
 * Adds an attribute and values to, or removes an attribute and values from, a manual DB
 * cluster snapshot.
 *
 * To share a manual DB cluster snapshot with other Amazon accounts, specify
 * `restore` as the `AttributeName` and use the `ValuesToAdd`
 * parameter to add a list of IDs of the Amazon accounts that are authorized to restore the manual
 * DB cluster snapshot. Use the value `all` to make the manual DB cluster snapshot
 * public, which means that it can be copied or restored by all Amazon accounts. Do not add the
 * `all` value for any manual DB cluster snapshots that contain private information
 * that you don't want available to all Amazon accounts. If a manual DB cluster snapshot is
 * encrypted, it can be shared, but only by specifying a list of authorized Amazon account IDs for
 * the `ValuesToAdd` parameter. You can't use `all` as a value for that
 * parameter in this case.
 *
 * To view which Amazon accounts have access to copy or restore a manual DB cluster snapshot, or
 * whether a manual DB cluster snapshot public or private, use the DescribeDBClusterSnapshotAttributes API action.
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
 * The DeleteDBCluster action deletes a previously provisioned DB cluster. When you delete a
 * DB cluster, all automated backups for that DB cluster are deleted and can't be recovered.
 * Manual DB cluster snapshots of the specified DB cluster are not deleted.
 *
 * Note that the DB Cluster cannot be deleted if deletion protection is enabled. To
 * delete it, you must first set its `DeletionProtection` field to
 * `False`.
 */
export const deleteDBCluster: (
  input: DeleteDBClusterMessage,
) => effect.Effect<
  DeleteDBClusterResult,
  | DBClusterNotFoundFault
  | DBClusterSnapshotAlreadyExistsFault
  | InvalidDBClusterSnapshotStateFault
  | InvalidDBClusterStateFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBClusterMessage,
  output: DeleteDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    DBClusterSnapshotAlreadyExistsFault,
    InvalidDBClusterSnapshotStateFault,
    InvalidDBClusterStateFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * The DeleteDBInstance action deletes a previously provisioned DB instance. When you delete
 * a DB instance, all automated backups for that instance are deleted and can't be recovered.
 * Manual DB snapshots of the DB instance to be deleted by `DeleteDBInstance` are not
 * deleted.
 *
 * If you request a final DB snapshot the status of the Amazon Neptune DB instance is
 * `deleting` until the DB snapshot is created. The API action
 * `DescribeDBInstance` is used to monitor the status of this operation. The action
 * can't be canceled or reverted once submitted.
 *
 * Note that when a DB instance is in a failure state and has a status of
 * `failed`, `incompatible-restore`, or `incompatible-network`,
 * you can only delete it when the `SkipFinalSnapshot` parameter is set to
 * `true`.
 *
 * You can't delete a DB instance if it is the only instance in the DB cluster, or
 * if it has deletion protection enabled.
 */
export const deleteDBInstance: (
  input: DeleteDBInstanceMessage,
) => effect.Effect<
  DeleteDBInstanceResult,
  | DBInstanceNotFoundFault
  | DBSnapshotAlreadyExistsFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBInstanceMessage,
  output: DeleteDBInstanceResult,
  errors: [
    DBInstanceNotFoundFault,
    DBSnapshotAlreadyExistsFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * Creates a new DB subnet group. DB subnet groups must contain at least one subnet in at
 * least two AZs in the Amazon Region.
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
 * Creates a Neptune global database spread across multiple Amazon Regions.
 * The global database contains a single primary cluster with read-write
 * capability, and read-only secondary clusters that receive data from the
 * primary cluster through high-speed replication performed by the Neptune
 * storage subsystem.
 *
 * You can create a global database that is initially empty, and then
 * add a primary cluster and secondary clusters to it, or you can specify
 * an existing Neptune cluster during the create operation to become the
 * primary cluster of the global database.
 */
export const createGlobalCluster: (
  input: CreateGlobalClusterMessage,
) => effect.Effect<
  CreateGlobalClusterResult,
  | DBClusterNotFoundFault
  | GlobalClusterAlreadyExistsFault
  | GlobalClusterQuotaExceededFault
  | InvalidDBClusterStateFault
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
  ],
}));
/**
 * Modifies an existing DB subnet group. DB subnet groups must contain at least one subnet in
 * at least two AZs in the Amazon Region.
 */
export const modifyDBSubnetGroup: (
  input: ModifyDBSubnetGroupMessage,
) => effect.Effect<
  ModifyDBSubnetGroupResult,
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | DBSubnetQuotaExceededFault
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
    InvalidSubnet,
    SubnetAlreadyInUse,
  ],
}));
/**
 * Modifies an existing event notification subscription. Note that you can't modify the
 * source identifiers using this call; to change source identifiers for a subscription, use the
 * AddSourceIdentifierToSubscription and RemoveSourceIdentifierFromSubscription calls.
 *
 * You can see a list of the event categories for a given SourceType
 * by using the **DescribeEventCategories** action.
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
 * Creates an event notification subscription. This action requires a topic ARN (Amazon
 * Resource Name) created by either the Neptune console, the SNS console, or the SNS API. To
 * obtain an ARN with SNS, you must create a topic in Amazon SNS and subscribe to the topic. The
 * ARN is displayed in the SNS console.
 *
 * You can specify the type of source (SourceType) you want to be notified of, provide a list
 * of Neptune sources (SourceIds) that triggers the events, and provide a list of event
 * categories (EventCategories) for events you want to be notified of. For example, you can
 * specify SourceType = db-instance, SourceIds = mydbinstance1, mydbinstance2 and EventCategories
 * = Availability, Backup.
 *
 * If you specify both the SourceType and SourceIds, such as SourceType = db-instance and
 * SourceIdentifier = myDBInstance1, you are notified of all the db-instance events for the
 * specified source. If you specify a SourceType but do not specify a SourceIdentifier, you
 * receive notice of the events for that source type for all your Neptune sources. If you do not
 * specify either the SourceType nor the SourceIdentifier, you are notified of events generated
 * from all Neptune sources belonging to your customer account.
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
 * Creates a new Amazon Neptune DB cluster.
 *
 * You can use the `ReplicationSourceIdentifier` parameter to create the DB
 * cluster as a Read Replica of another DB cluster or Amazon Neptune DB instance.
 *
 * Note that when you create a new cluster using `CreateDBCluster` directly,
 * deletion protection is disabled by default (when you create a new production cluster in
 * the console, deletion protection is enabled by default). You can only delete a DB
 * cluster if its `DeletionProtection` field is set to `false`.
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
  | GlobalClusterNotFoundFault
  | InsufficientStorageClusterCapacityFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBSubnetGroupStateFault
  | InvalidGlobalClusterStateFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | StorageQuotaExceededFault
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
    GlobalClusterNotFoundFault,
    InsufficientStorageClusterCapacityFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidDBSubnetGroupStateFault,
    InvalidGlobalClusterStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Modify a setting for a DB cluster. You can change one or more database configuration
 * parameters by specifying these parameters and the new values in the request.
 */
export const modifyDBCluster: (
  input: ModifyDBClusterMessage,
) => effect.Effect<
  ModifyDBClusterResult,
  | DBClusterAlreadyExistsFault
  | DBClusterNotFoundFault
  | DBClusterParameterGroupNotFoundFault
  | DBSubnetGroupNotFoundFault
  | InvalidDBClusterStateFault
  | InvalidDBInstanceStateFault
  | InvalidDBSecurityGroupStateFault
  | InvalidDBSubnetGroupStateFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBClusterMessage,
  output: ModifyDBClusterResult,
  errors: [
    DBClusterAlreadyExistsFault,
    DBClusterNotFoundFault,
    DBClusterParameterGroupNotFoundFault,
    DBSubnetGroupNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidDBSecurityGroupStateFault,
    InvalidDBSubnetGroupStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));
/**
 * Restores a DB cluster to an arbitrary point in time. Users can restore to any point in
 * time before `LatestRestorableTime` for up to `BackupRetentionPeriod`
 * days. The target DB cluster is created from the source DB cluster with the same configuration
 * as the original DB cluster, except that the new DB cluster is created with the default DB
 * security group.
 *
 * This action only restores the DB cluster, not the DB instances for that DB cluster. You
 * must invoke the CreateDBInstance action to create DB instances for the
 * restored DB cluster, specifying the identifier of the restored DB cluster in
 * `DBClusterIdentifier`. You can create DB instances only after the
 * `RestoreDBClusterToPointInTime` action has completed and the DB cluster is
 * available.
 */
export const restoreDBClusterToPointInTime: (
  input: RestoreDBClusterToPointInTimeMessage,
) => effect.Effect<
  RestoreDBClusterToPointInTimeResult,
  | DBClusterAlreadyExistsFault
  | DBClusterNotFoundFault
  | DBClusterParameterGroupNotFoundFault
  | DBClusterQuotaExceededFault
  | DBClusterSnapshotNotFoundFault
  | DBSubnetGroupNotFoundFault
  | InsufficientDBClusterCapacityFault
  | InsufficientStorageClusterCapacityFault
  | InvalidDBClusterSnapshotStateFault
  | InvalidDBClusterStateFault
  | InvalidDBSnapshotStateFault
  | InvalidRestoreFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | OptionGroupNotFoundFault
  | StorageQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreDBClusterToPointInTimeMessage,
  output: RestoreDBClusterToPointInTimeResult,
  errors: [
    DBClusterAlreadyExistsFault,
    DBClusterNotFoundFault,
    DBClusterParameterGroupNotFoundFault,
    DBClusterQuotaExceededFault,
    DBClusterSnapshotNotFoundFault,
    DBSubnetGroupNotFoundFault,
    InsufficientDBClusterCapacityFault,
    InsufficientStorageClusterCapacityFault,
    InvalidDBClusterSnapshotStateFault,
    InvalidDBClusterStateFault,
    InvalidDBSnapshotStateFault,
    InvalidRestoreFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    OptionGroupNotFoundFault,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
 *
 * If a DB snapshot is specified, the target DB cluster is created from the source DB
 * snapshot with a default configuration and default security group.
 *
 * If a DB cluster snapshot is specified, the target DB cluster is created from the source DB
 * cluster restore point with the same configuration as the original source DB cluster, except
 * that the new DB cluster is created with the default security group.
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
  | DBSubnetGroupNotFoundFault
  | InsufficientDBClusterCapacityFault
  | InsufficientStorageClusterCapacityFault
  | InvalidDBClusterSnapshotStateFault
  | InvalidDBSnapshotStateFault
  | InvalidRestoreFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
  | OptionGroupNotFoundFault
  | StorageQuotaExceededFault
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
    DBSubnetGroupNotFoundFault,
    InsufficientDBClusterCapacityFault,
    InsufficientStorageClusterCapacityFault,
    InvalidDBClusterSnapshotStateFault,
    InvalidDBSnapshotStateFault,
    InvalidRestoreFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    OptionGroupNotFoundFault,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Modifies settings for a DB instance. You can change one or more database configuration
 * parameters by specifying these parameters and the new values in the request. To learn what
 * modifications you can make to your DB instance, call DescribeValidDBInstanceModifications before you call ModifyDBInstance.
 */
export const modifyDBInstance: (
  input: ModifyDBInstanceMessage,
) => effect.Effect<
  ModifyDBInstanceResult,
  | AuthorizationNotFoundFault
  | CertificateNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBInstanceNotFoundFault
  | DBParameterGroupNotFoundFault
  | DBSecurityGroupNotFoundFault
  | DBUpgradeDependencyFailureFault
  | DomainNotFoundFault
  | InsufficientDBInstanceCapacityFault
  | InvalidDBInstanceStateFault
  | InvalidDBSecurityGroupStateFault
  | InvalidVPCNetworkStateFault
  | OptionGroupNotFoundFault
  | ProvisionedIopsNotAvailableInAZFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBInstanceMessage,
  output: ModifyDBInstanceResult,
  errors: [
    AuthorizationNotFoundFault,
    CertificateNotFoundFault,
    DBInstanceAlreadyExistsFault,
    DBInstanceNotFoundFault,
    DBParameterGroupNotFoundFault,
    DBSecurityGroupNotFoundFault,
    DBUpgradeDependencyFailureFault,
    DomainNotFoundFault,
    InsufficientDBInstanceCapacityFault,
    InvalidDBInstanceStateFault,
    InvalidDBSecurityGroupStateFault,
    InvalidVPCNetworkStateFault,
    OptionGroupNotFoundFault,
    ProvisionedIopsNotAvailableInAZFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));
/**
 * Creates a new DB instance.
 */
export const createDBInstance: (
  input: CreateDBInstanceMessage,
) => effect.Effect<
  CreateDBInstanceResult,
  | AuthorizationNotFoundFault
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
  | OptionGroupNotFoundFault
  | ProvisionedIopsNotAvailableInAZFault
  | StorageQuotaExceededFault
  | StorageTypeNotSupportedFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBInstanceMessage,
  output: CreateDBInstanceResult,
  errors: [
    AuthorizationNotFoundFault,
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
    OptionGroupNotFoundFault,
    ProvisionedIopsNotAvailableInAZFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));
