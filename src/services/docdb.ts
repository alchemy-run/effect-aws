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
const ns = T.XmlNamespace("http://rds.amazonaws.com/doc/2014-10-31/");
const svc = T.AwsApiService({
  sdkId: "DocDB",
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
export type IntegerOptional = number;
export type GlobalClusterIdentifier = string;
export type DBClusterIdentifier = string;
export type DoubleOptional = number;
export type ExceptionMessage = string;
export type Integer = number;

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
export type AttributeValueList = string[];
export const AttributeValueList = S.Array(
  S.String.pipe(T.XmlName("AttributeValue")),
);
export type KeyList = string[];
export const KeyList = S.Array(S.String);
export interface AddSourceIdentifierToSubscriptionMessage {
  SubscriptionName: string;
  SourceIdentifier: string;
}
export const AddSourceIdentifierToSubscriptionMessage = S.suspend(() =>
  S.Struct({ SubscriptionName: S.String, SourceIdentifier: S.String }).pipe(
    T.all(
      ns,
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
  ResourceIdentifier: string;
  ApplyAction: string;
  OptInType: string;
}
export const ApplyPendingMaintenanceActionMessage = S.suspend(() =>
  S.Struct({
    ResourceIdentifier: S.String,
    ApplyAction: S.String,
    OptInType: S.String,
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
  SourceDBClusterParameterGroupIdentifier: string;
  TargetDBClusterParameterGroupIdentifier: string;
  TargetDBClusterParameterGroupDescription: string;
  Tags?: TagList;
}
export const CopyDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    SourceDBClusterParameterGroupIdentifier: S.String,
    TargetDBClusterParameterGroupIdentifier: S.String,
    TargetDBClusterParameterGroupDescription: S.String,
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
  SourceDBClusterSnapshotIdentifier: string;
  TargetDBClusterSnapshotIdentifier: string;
  KmsKeyId?: string;
  PreSignedUrl?: string;
  CopyTags?: boolean;
  Tags?: TagList;
}
export const CopyDBClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    SourceDBClusterSnapshotIdentifier: S.String,
    TargetDBClusterSnapshotIdentifier: S.String,
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
export interface CreateDBClusterParameterGroupMessage {
  DBClusterParameterGroupName: string;
  DBParameterGroupFamily: string;
  Description: string;
  Tags?: TagList;
}
export const CreateDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.String,
    DBParameterGroupFamily: S.String,
    Description: S.String,
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
  DBClusterSnapshotIdentifier: string;
  DBClusterIdentifier: string;
  Tags?: TagList;
}
export const CreateDBClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    DBClusterSnapshotIdentifier: S.String,
    DBClusterIdentifier: S.String,
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
  DBInstanceIdentifier: string;
  DBInstanceClass: string;
  Engine: string;
  AvailabilityZone?: string;
  PreferredMaintenanceWindow?: string;
  AutoMinorVersionUpgrade?: boolean;
  Tags?: TagList;
  DBClusterIdentifier: string;
  CopyTagsToSnapshot?: boolean;
  PromotionTier?: number;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  CACertificateIdentifier?: string;
}
export const CreateDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.String,
    DBInstanceClass: S.String,
    Engine: S.String,
    AvailabilityZone: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    DBClusterIdentifier: S.String,
    CopyTagsToSnapshot: S.optional(S.Boolean),
    PromotionTier: S.optional(S.Number),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
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
export interface CreateDBSubnetGroupMessage {
  DBSubnetGroupName: string;
  DBSubnetGroupDescription: string;
  SubnetIds: SubnetIdentifierList;
  Tags?: TagList;
}
export const CreateDBSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    DBSubnetGroupName: S.String,
    DBSubnetGroupDescription: S.String,
    SubnetIds: SubnetIdentifierList,
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
  SubscriptionName: string;
  SnsTopicArn: string;
  SourceType?: string;
  EventCategories?: EventCategoriesList;
  SourceIds?: SourceIdsList;
  Enabled?: boolean;
  Tags?: TagList;
}
export const CreateEventSubscriptionMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.String,
    SnsTopicArn: S.String,
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
  GlobalClusterIdentifier: string;
  SourceDBClusterIdentifier?: string;
  Engine?: string;
  EngineVersion?: string;
  DeletionProtection?: boolean;
  DatabaseName?: string;
  StorageEncrypted?: boolean;
}
export const CreateGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.String,
    SourceDBClusterIdentifier: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    DatabaseName: S.optional(S.String),
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
  DBClusterIdentifier: string;
  SkipFinalSnapshot?: boolean;
  FinalDBSnapshotIdentifier?: string;
}
export const DeleteDBClusterMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.String,
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
export interface DeleteDBClusterParameterGroupMessage {
  DBClusterParameterGroupName: string;
}
export const DeleteDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({ DBClusterParameterGroupName: S.String }).pipe(
    T.all(
      ns,
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
  DBClusterSnapshotIdentifier: string;
}
export const DeleteDBClusterSnapshotMessage = S.suspend(() =>
  S.Struct({ DBClusterSnapshotIdentifier: S.String }).pipe(
    T.all(
      ns,
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
  DBInstanceIdentifier: string;
}
export const DeleteDBInstanceMessage = S.suspend(() =>
  S.Struct({ DBInstanceIdentifier: S.String }).pipe(
    T.all(
      ns,
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
export interface DeleteDBSubnetGroupMessage {
  DBSubnetGroupName: string;
}
export const DeleteDBSubnetGroupMessage = S.suspend(() =>
  S.Struct({ DBSubnetGroupName: S.String }).pipe(
    T.all(
      ns,
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
  SubscriptionName: string;
}
export const DeleteEventSubscriptionMessage = S.suspend(() =>
  S.Struct({ SubscriptionName: S.String }).pipe(
    T.all(
      ns,
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
  GlobalClusterIdentifier: string;
}
export const DeleteGlobalClusterMessage = S.suspend(() =>
  S.Struct({ GlobalClusterIdentifier: S.String }).pipe(
    T.all(
      ns,
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
  Name: string;
  Values: FilterValueList;
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(
  Filter.pipe(T.XmlName("Filter")).annotations({ identifier: "Filter" }),
);
export interface DescribeDBClusterParameterGroupsMessage {
  DBClusterParameterGroupName?: string;
  Filters?: FilterList;
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
  DBClusterParameterGroupName: string;
  Source?: string;
  Filters?: FilterList;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDBClusterParametersMessage = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.String,
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
  Filters?: FilterList;
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
  DBClusterSnapshotIdentifier: string;
}
export const DescribeDBClusterSnapshotAttributesMessage = S.suspend(() =>
  S.Struct({ DBClusterSnapshotIdentifier: S.String }).pipe(
    T.all(
      ns,
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
  Filters?: FilterList;
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
  Filters?: FilterList;
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
  Filters?: FilterList;
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
export interface DescribeDBSubnetGroupsMessage {
  DBSubnetGroupName?: string;
  Filters?: FilterList;
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
  DBParameterGroupFamily: string;
  Filters?: FilterList;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEngineDefaultClusterParametersMessage = S.suspend(() =>
  S.Struct({
    DBParameterGroupFamily: S.String,
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
export interface DescribeEventCategoriesMessage {
  SourceType?: string;
  Filters?: FilterList;
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
  SourceType?: string;
  StartTime?: Date;
  EndTime?: Date;
  Duration?: number;
  EventCategories?: EventCategoriesList;
  Filters?: FilterList;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEventsMessage = S.suspend(() =>
  S.Struct({
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(S.String),
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
  Filters?: FilterList;
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
  Filters?: FilterList;
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
export interface DescribeOrderableDBInstanceOptionsMessage {
  Engine: string;
  EngineVersion?: string;
  DBInstanceClass?: string;
  LicenseModel?: string;
  Vpc?: boolean;
  Filters?: FilterList;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeOrderableDBInstanceOptionsMessage = S.suspend(() =>
  S.Struct({
    Engine: S.String,
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
  Filters?: FilterList;
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
  GlobalClusterIdentifier: string;
  TargetDbClusterIdentifier: string;
  AllowDataLoss?: boolean;
  Switchover?: boolean;
}
export const FailoverGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.String,
    TargetDbClusterIdentifier: S.String,
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
  ResourceName: string;
  Filters?: FilterList;
}
export const ListTagsForResourceMessage = S.suspend(() =>
  S.Struct({ ResourceName: S.String, Filters: S.optional(FilterList) }).pipe(
    T.all(
      ns,
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
export interface ModifyDBClusterSnapshotAttributeMessage {
  DBClusterSnapshotIdentifier: string;
  AttributeName: string;
  ValuesToAdd?: AttributeValueList;
  ValuesToRemove?: AttributeValueList;
}
export const ModifyDBClusterSnapshotAttributeMessage = S.suspend(() =>
  S.Struct({
    DBClusterSnapshotIdentifier: S.String,
    AttributeName: S.String,
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
export interface ModifyDBInstanceMessage {
  DBInstanceIdentifier: string;
  DBInstanceClass?: string;
  ApplyImmediately?: boolean;
  PreferredMaintenanceWindow?: string;
  AutoMinorVersionUpgrade?: boolean;
  NewDBInstanceIdentifier?: string;
  CACertificateIdentifier?: string;
  CopyTagsToSnapshot?: boolean;
  PromotionTier?: number;
  EnablePerformanceInsights?: boolean;
  PerformanceInsightsKMSKeyId?: string;
  CertificateRotationRestart?: boolean;
}
export const ModifyDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.String,
    DBInstanceClass: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
    PreferredMaintenanceWindow: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    NewDBInstanceIdentifier: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    PromotionTier: S.optional(S.Number),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    CertificateRotationRestart: S.optional(S.Boolean),
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
export interface ModifyDBSubnetGroupMessage {
  DBSubnetGroupName: string;
  DBSubnetGroupDescription?: string;
  SubnetIds: SubnetIdentifierList;
}
export const ModifyDBSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    DBSubnetGroupName: S.String,
    DBSubnetGroupDescription: S.optional(S.String),
    SubnetIds: SubnetIdentifierList,
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
  SubscriptionName: string;
  SnsTopicArn?: string;
  SourceType?: string;
  EventCategories?: EventCategoriesList;
  Enabled?: boolean;
}
export const ModifyEventSubscriptionMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.String,
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
  GlobalClusterIdentifier: string;
  NewGlobalClusterIdentifier?: string;
  DeletionProtection?: boolean;
}
export const ModifyGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.String,
    NewGlobalClusterIdentifier: S.optional(S.String),
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
  identifier: "ModifyGlobalClusterMessage",
}) as any as S.Schema<ModifyGlobalClusterMessage>;
export interface RebootDBInstanceMessage {
  DBInstanceIdentifier: string;
  ForceFailover?: boolean;
}
export const RebootDBInstanceMessage = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.String,
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
  GlobalClusterIdentifier: string;
  DbClusterIdentifier: string;
}
export const RemoveFromGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.String,
    DbClusterIdentifier: S.String,
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
export interface RemoveSourceIdentifierFromSubscriptionMessage {
  SubscriptionName: string;
  SourceIdentifier: string;
}
export const RemoveSourceIdentifierFromSubscriptionMessage = S.suspend(() =>
  S.Struct({ SubscriptionName: S.String, SourceIdentifier: S.String }).pipe(
    T.all(
      ns,
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
  ResourceName: string;
  TagKeys: KeyList;
}
export const RemoveTagsFromResourceMessage = S.suspend(() =>
  S.Struct({ ResourceName: S.String, TagKeys: KeyList }).pipe(
    T.all(
      ns,
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
  ApplyMethod?: string;
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
    ApplyMethod: S.optional(S.String),
  }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type ParametersList = Parameter[];
export const ParametersList = S.Array(
  Parameter.pipe(T.XmlName("Parameter")).annotations({
    identifier: "Parameter",
  }),
);
export interface ResetDBClusterParameterGroupMessage {
  DBClusterParameterGroupName: string;
  ResetAllParameters?: boolean;
  Parameters?: ParametersList;
}
export const ResetDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.String,
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
  AvailabilityZones?: AvailabilityZones;
  DBClusterIdentifier: string;
  SnapshotIdentifier: string;
  Engine: string;
  EngineVersion?: string;
  Port?: number;
  DBSubnetGroupName?: string;
  VpcSecurityGroupIds?: VpcSecurityGroupIdList;
  Tags?: TagList;
  KmsKeyId?: string;
  EnableCloudwatchLogsExports?: LogTypeList;
  DeletionProtection?: boolean;
  DBClusterParameterGroupName?: string;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  StorageType?: string;
  NetworkType?: string;
}
export const RestoreDBClusterFromSnapshotMessage = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    DBClusterIdentifier: S.String,
    SnapshotIdentifier: S.String,
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    DBSubnetGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    DBClusterParameterGroupName: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
    NetworkType: S.optional(S.String),
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
  DBClusterIdentifier: string;
  RestoreType?: string;
  SourceDBClusterIdentifier: string;
  RestoreToTime?: Date;
  UseLatestRestorableTime?: boolean;
  Port?: number;
  DBSubnetGroupName?: string;
  VpcSecurityGroupIds?: VpcSecurityGroupIdList;
  Tags?: TagList;
  KmsKeyId?: string;
  EnableCloudwatchLogsExports?: LogTypeList;
  DeletionProtection?: boolean;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  StorageType?: string;
  NetworkType?: string;
}
export const RestoreDBClusterToPointInTimeMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.String,
    RestoreType: S.optional(S.String),
    SourceDBClusterIdentifier: S.String,
    RestoreToTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UseLatestRestorableTime: S.optional(S.Boolean),
    Port: S.optional(S.Number),
    DBSubnetGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
    NetworkType: S.optional(S.String),
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
  DBClusterIdentifier: string;
}
export const StartDBClusterMessage = S.suspend(() =>
  S.Struct({ DBClusterIdentifier: S.String }).pipe(
    T.all(
      ns,
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
  DBClusterIdentifier: string;
}
export const StopDBClusterMessage = S.suspend(() =>
  S.Struct({ DBClusterIdentifier: S.String }).pipe(
    T.all(
      ns,
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
  GlobalClusterIdentifier: string;
  TargetDbClusterIdentifier: string;
}
export const SwitchoverGlobalClusterMessage = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.String,
    TargetDbClusterIdentifier: S.String,
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
}
export const DBClusterRole = S.suspend(() =>
  S.Struct({ RoleArn: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "DBClusterRole",
}) as any as S.Schema<DBClusterRole>;
export type DBClusterRoles = DBClusterRole[];
export const DBClusterRoles = S.Array(
  DBClusterRole.pipe(T.XmlName("DBClusterRole")).annotations({
    identifier: "DBClusterRole",
  }),
);
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
export interface ClusterMasterUserSecret {
  SecretArn?: string;
  SecretStatus?: string;
  KmsKeyId?: string;
}
export const ClusterMasterUserSecret = S.suspend(() =>
  S.Struct({
    SecretArn: S.optional(S.String),
    SecretStatus: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterMasterUserSecret",
}) as any as S.Schema<ClusterMasterUserSecret>;
export interface DBCluster {
  AvailabilityZones?: AvailabilityZones;
  BackupRetentionPeriod?: number;
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
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  ReplicationSourceIdentifier?: string;
  ReadReplicaIdentifiers?: ReadReplicaIdentifierList;
  DBClusterMembers?: DBClusterMemberList;
  VpcSecurityGroups?: VpcSecurityGroupMembershipList;
  HostedZoneId?: string;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  DbClusterResourceId?: string;
  DBClusterArn?: string;
  AssociatedRoles?: DBClusterRoles;
  CloneGroupId?: string;
  ClusterCreateTime?: Date;
  EnabledCloudwatchLogsExports?: LogTypeList;
  DeletionProtection?: boolean;
  IOOptimizedNextAllowedModificationTime?: Date;
  StorageType?: string;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfigurationInfo;
  MasterUserSecret?: ClusterMasterUserSecret;
  NetworkType?: string;
}
export const DBCluster = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    BackupRetentionPeriod: S.optional(S.Number),
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
    CloneGroupId: S.optional(S.String),
    ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EnabledCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    IOOptimizedNextAllowedModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    StorageType: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfigurationInfo,
    ),
    MasterUserSecret: S.optional(ClusterMasterUserSecret),
    NetworkType: S.optional(S.String),
  }),
).annotations({ identifier: "DBCluster" }) as any as S.Schema<DBCluster>;
export type DBClusterList = DBCluster[];
export const DBClusterList = S.Array(
  DBCluster.pipe(T.XmlName("DBCluster")).annotations({
    identifier: "DBCluster",
  }),
);
export interface DBClusterSnapshot {
  AvailabilityZones?: AvailabilityZones;
  DBClusterSnapshotIdentifier?: string;
  DBClusterIdentifier?: string;
  SnapshotCreateTime?: Date;
  Engine?: string;
  Status?: string;
  Port?: number;
  VpcId?: string;
  ClusterCreateTime?: Date;
  MasterUsername?: string;
  EngineVersion?: string;
  SnapshotType?: string;
  PercentProgress?: number;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  DBClusterSnapshotArn?: string;
  SourceDBClusterSnapshotArn?: string;
  StorageType?: string;
}
export const DBClusterSnapshot = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    DBClusterSnapshotIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    SnapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Engine: S.optional(S.String),
    Status: S.optional(S.String),
    Port: S.optional(S.Number),
    VpcId: S.optional(S.String),
    ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    MasterUsername: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    PercentProgress: S.optional(S.Number),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    DBClusterSnapshotArn: S.optional(S.String),
    SourceDBClusterSnapshotArn: S.optional(S.String),
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
export type NetworkTypeList = string[];
export const NetworkTypeList = S.Array(S.String);
export interface DBSubnetGroup {
  DBSubnetGroupName?: string;
  DBSubnetGroupDescription?: string;
  VpcId?: string;
  SubnetGroupStatus?: string;
  Subnets?: SubnetList;
  DBSubnetGroupArn?: string;
  SupportedNetworkTypes?: NetworkTypeList;
}
export const DBSubnetGroup = S.suspend(() =>
  S.Struct({
    DBSubnetGroupName: S.optional(S.String),
    DBSubnetGroupDescription: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetGroupStatus: S.optional(S.String),
    Subnets: S.optional(SubnetList),
    DBSubnetGroupArn: S.optional(S.String),
    SupportedNetworkTypes: S.optional(NetworkTypeList),
  }),
).annotations({
  identifier: "DBSubnetGroup",
}) as any as S.Schema<DBSubnetGroup>;
export interface PendingCloudwatchLogsExports {
  LogTypesToEnable?: LogTypeList;
  LogTypesToDisable?: LogTypeList;
}
export const PendingCloudwatchLogsExports = S.suspend(() =>
  S.Struct({
    LogTypesToEnable: S.optional(LogTypeList),
    LogTypesToDisable: S.optional(LogTypeList),
  }),
).annotations({
  identifier: "PendingCloudwatchLogsExports",
}) as any as S.Schema<PendingCloudwatchLogsExports>;
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
export interface DBInstance {
  DBInstanceIdentifier?: string;
  DBInstanceClass?: string;
  Engine?: string;
  DBInstanceStatus?: string;
  Endpoint?: Endpoint;
  InstanceCreateTime?: Date;
  PreferredBackupWindow?: string;
  BackupRetentionPeriod?: number;
  VpcSecurityGroups?: VpcSecurityGroupMembershipList;
  AvailabilityZone?: string;
  DBSubnetGroup?: DBSubnetGroup;
  PreferredMaintenanceWindow?: string;
  PendingModifiedValues?: PendingModifiedValues;
  LatestRestorableTime?: Date;
  EngineVersion?: string;
  AutoMinorVersionUpgrade?: boolean;
  PubliclyAccessible?: boolean;
  StatusInfos?: DBInstanceStatusInfoList;
  DBClusterIdentifier?: string;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  DbiResourceId?: string;
  CACertificateIdentifier?: string;
  CopyTagsToSnapshot?: boolean;
  PromotionTier?: number;
  DBInstanceArn?: string;
  EnabledCloudwatchLogsExports?: LogTypeList;
  CertificateDetails?: CertificateDetails;
  PerformanceInsightsEnabled?: boolean;
  PerformanceInsightsKMSKeyId?: string;
}
export const DBInstance = S.suspend(() =>
  S.Struct({
    DBInstanceIdentifier: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    Engine: S.optional(S.String),
    DBInstanceStatus: S.optional(S.String),
    Endpoint: S.optional(Endpoint),
    InstanceCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PreferredBackupWindow: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
    AvailabilityZone: S.optional(S.String),
    DBSubnetGroup: S.optional(DBSubnetGroup),
    PreferredMaintenanceWindow: S.optional(S.String),
    PendingModifiedValues: S.optional(PendingModifiedValues),
    LatestRestorableTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    EngineVersion: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    PubliclyAccessible: S.optional(S.Boolean),
    StatusInfos: S.optional(DBInstanceStatusInfoList),
    DBClusterIdentifier: S.optional(S.String),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    DbiResourceId: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    PromotionTier: S.optional(S.Number),
    DBInstanceArn: S.optional(S.String),
    EnabledCloudwatchLogsExports: S.optional(LogTypeList),
    CertificateDetails: S.optional(CertificateDetails),
    PerformanceInsightsEnabled: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
  }),
).annotations({ identifier: "DBInstance" }) as any as S.Schema<DBInstance>;
export type DBInstanceList = DBInstance[];
export const DBInstanceList = S.Array(
  DBInstance.pipe(T.XmlName("DBInstance")).annotations({
    identifier: "DBInstance",
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
  SourceIdsList?: SourceIdsList;
  EventCategoriesList?: EventCategoriesList;
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
  Readers?: ReadersArnList;
  IsWriter?: boolean;
  SynchronizationStatus?: string;
}
export const GlobalClusterMember = S.suspend(() =>
  S.Struct({
    DBClusterArn: S.optional(S.String),
    Readers: S.optional(ReadersArnList),
    IsWriter: S.optional(S.Boolean),
    SynchronizationStatus: S.optional(S.String),
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
export interface FailoverState {
  Status?: string;
  FromDbClusterArn?: string;
  ToDbClusterArn?: string;
  IsDataLossAllowed?: boolean;
}
export const FailoverState = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
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
  DatabaseName?: string;
  StorageEncrypted?: boolean;
  DeletionProtection?: boolean;
  GlobalClusterMembers?: GlobalClusterMemberList;
  FailoverState?: FailoverState;
  TagList?: TagList;
}
export const GlobalCluster = S.suspend(() =>
  S.Struct({
    GlobalClusterIdentifier: S.optional(S.String),
    GlobalClusterResourceId: S.optional(S.String),
    GlobalClusterArn: S.optional(S.String),
    Status: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    StorageEncrypted: S.optional(S.Boolean),
    DeletionProtection: S.optional(S.Boolean),
    GlobalClusterMembers: S.optional(GlobalClusterMemberList),
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
  PendingMaintenanceActionDetails?: PendingMaintenanceActionDetails;
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
export interface CloudwatchLogsExportConfiguration {
  EnableLogTypes?: LogTypeList;
  DisableLogTypes?: LogTypeList;
}
export const CloudwatchLogsExportConfiguration = S.suspend(() =>
  S.Struct({
    EnableLogTypes: S.optional(LogTypeList),
    DisableLogTypes: S.optional(LogTypeList),
  }),
).annotations({
  identifier: "CloudwatchLogsExportConfiguration",
}) as any as S.Schema<CloudwatchLogsExportConfiguration>;
export interface AddTagsToResourceMessage {
  ResourceName: string;
  Tags: TagList;
}
export const AddTagsToResourceMessage = S.suspend(() =>
  S.Struct({ ResourceName: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
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
  AvailabilityZones?: AvailabilityZones;
  BackupRetentionPeriod?: number;
  DBClusterIdentifier: string;
  DBClusterParameterGroupName?: string;
  VpcSecurityGroupIds?: VpcSecurityGroupIdList;
  DBSubnetGroupName?: string;
  Engine: string;
  EngineVersion?: string;
  Port?: number;
  MasterUsername?: string;
  MasterUserPassword?: string;
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  Tags?: TagList;
  StorageEncrypted?: boolean;
  KmsKeyId?: string;
  PreSignedUrl?: string;
  EnableCloudwatchLogsExports?: LogTypeList;
  DeletionProtection?: boolean;
  GlobalClusterIdentifier?: string;
  StorageType?: string;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  ManageMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
  NetworkType?: string;
}
export const CreateDBClusterMessage = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(AvailabilityZones),
    BackupRetentionPeriod: S.optional(S.Number),
    DBClusterIdentifier: S.String,
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    DBSubnetGroupName: S.optional(S.String),
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    Tags: S.optional(TagList),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    GlobalClusterIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    NetworkType: S.optional(S.String),
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
export interface CreateEventSubscriptionResult {
  EventSubscription?: EventSubscription;
}
export const CreateEventSubscriptionResult = S.suspend(() =>
  S.Struct({ EventSubscription: S.optional(EventSubscription) }).pipe(ns),
).annotations({
  identifier: "CreateEventSubscriptionResult",
}) as any as S.Schema<CreateEventSubscriptionResult>;
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
export interface DescribeCertificatesMessage {
  CertificateIdentifier?: string;
  Filters?: FilterList;
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
export interface DBClusterParameterGroupsMessage {
  Marker?: string;
  DBClusterParameterGroups?: DBClusterParameterGroupList;
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
  Parameters?: ParametersList;
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
  DBClusters?: DBClusterList;
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
  DBClusterSnapshots?: DBClusterSnapshotList;
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
  DBInstances?: DBInstanceList;
}
export const DBInstanceMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBInstances: S.optional(DBInstanceList),
  }).pipe(ns),
).annotations({
  identifier: "DBInstanceMessage",
}) as any as S.Schema<DBInstanceMessage>;
export interface DBSubnetGroupMessage {
  Marker?: string;
  DBSubnetGroups?: DBSubnetGroups;
}
export const DBSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    DBSubnetGroups: S.optional(DBSubnetGroups),
  }).pipe(ns),
).annotations({
  identifier: "DBSubnetGroupMessage",
}) as any as S.Schema<DBSubnetGroupMessage>;
export interface EventSubscriptionsMessage {
  Marker?: string;
  EventSubscriptionsList?: EventSubscriptionsList;
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
  GlobalClusters?: GlobalClusterList;
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
  PendingMaintenanceActions?: PendingMaintenanceActions;
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
  TagList?: TagList;
}
export const TagListMessage = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "TagListMessage",
}) as any as S.Schema<TagListMessage>;
export interface ModifyDBClusterMessage {
  DBClusterIdentifier: string;
  NewDBClusterIdentifier?: string;
  ApplyImmediately?: boolean;
  BackupRetentionPeriod?: number;
  DBClusterParameterGroupName?: string;
  VpcSecurityGroupIds?: VpcSecurityGroupIdList;
  Port?: number;
  MasterUserPassword?: string;
  PreferredBackupWindow?: string;
  PreferredMaintenanceWindow?: string;
  CloudwatchLogsExportConfiguration?: CloudwatchLogsExportConfiguration;
  EngineVersion?: string;
  AllowMajorVersionUpgrade?: boolean;
  DeletionProtection?: boolean;
  StorageType?: string;
  ServerlessV2ScalingConfiguration?: ServerlessV2ScalingConfiguration;
  ManageMasterUserPassword?: boolean;
  MasterUserSecretKmsKeyId?: string;
  RotateMasterUserPassword?: boolean;
  NetworkType?: string;
}
export const ModifyDBClusterMessage = S.suspend(() =>
  S.Struct({
    DBClusterIdentifier: S.String,
    NewDBClusterIdentifier: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
    BackupRetentionPeriod: S.optional(S.Number),
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Port: S.optional(S.Number),
    MasterUserPassword: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    CloudwatchLogsExportConfiguration: S.optional(
      CloudwatchLogsExportConfiguration,
    ),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
    DeletionProtection: S.optional(S.Boolean),
    StorageType: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    RotateMasterUserPassword: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
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
  DBClusterParameterGroupName: string;
  Parameters: ParametersList;
}
export const ModifyDBClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    DBClusterParameterGroupName: S.String,
    Parameters: ParametersList,
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
  AttributeValues?: AttributeValueList;
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
  DBClusterSnapshotAttributes?: DBClusterSnapshotAttributeList;
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
export type CACertificateIdentifiersList = string[];
export const CACertificateIdentifiersList = S.Array(S.String);
export interface EngineDefaults {
  DBParameterGroupFamily?: string;
  Marker?: string;
  Parameters?: ParametersList;
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
export interface EventCategoriesMap {
  SourceType?: string;
  EventCategories?: EventCategoriesList;
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
  SourceType?: string;
  Message?: string;
  EventCategories?: EventCategoriesList;
  Date?: Date;
  SourceArn?: string;
}
export const Event = S.suspend(() =>
  S.Struct({
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(S.String),
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
  EventCategoriesMapList?: EventCategoriesMapList;
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
  Events?: EventList;
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
}
export const UpgradeTarget = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    Description: S.optional(S.String),
    AutoUpgrade: S.optional(S.Boolean),
    IsMajorVersionUpgrade: S.optional(S.Boolean),
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
export type AvailabilityZoneList = AvailabilityZone[];
export const AvailabilityZoneList = S.Array(
  AvailabilityZone.pipe(T.XmlName("AvailabilityZone")).annotations({
    identifier: "AvailabilityZone",
  }),
);
export interface Certificate {
  CertificateIdentifier?: string;
  CertificateType?: string;
  Thumbprint?: string;
  ValidFrom?: Date;
  ValidTill?: Date;
  CertificateArn?: string;
}
export const Certificate = S.suspend(() =>
  S.Struct({
    CertificateIdentifier: S.optional(S.String),
    CertificateType: S.optional(S.String),
    Thumbprint: S.optional(S.String),
    ValidFrom: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ValidTill: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CertificateArn: S.optional(S.String),
  }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export type CertificateList = Certificate[];
export const CertificateList = S.Array(
  Certificate.pipe(T.XmlName("Certificate")).annotations({
    identifier: "Certificate",
  }),
);
export interface DBEngineVersion {
  Engine?: string;
  EngineVersion?: string;
  DBParameterGroupFamily?: string;
  DBEngineDescription?: string;
  DBEngineVersionDescription?: string;
  ValidUpgradeTarget?: ValidUpgradeTargetList;
  ExportableLogTypes?: LogTypeList;
  SupportsLogExportsToCloudwatchLogs?: boolean;
  SupportedCACertificateIdentifiers?: CACertificateIdentifiersList;
  SupportsCertificateRotationWithoutRestart?: boolean;
  ServerlessV2FeaturesSupport?: ServerlessV2FeaturesSupport;
}
export const DBEngineVersion = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DBParameterGroupFamily: S.optional(S.String),
    DBEngineDescription: S.optional(S.String),
    DBEngineVersionDescription: S.optional(S.String),
    ValidUpgradeTarget: S.optional(ValidUpgradeTargetList),
    ExportableLogTypes: S.optional(LogTypeList),
    SupportsLogExportsToCloudwatchLogs: S.optional(S.Boolean),
    SupportedCACertificateIdentifiers: S.optional(CACertificateIdentifiersList),
    SupportsCertificateRotationWithoutRestart: S.optional(S.Boolean),
    ServerlessV2FeaturesSupport: S.optional(ServerlessV2FeaturesSupport),
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
  AvailabilityZones?: AvailabilityZoneList;
  Vpc?: boolean;
  StorageType?: string;
}
export const OrderableDBInstanceOption = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    AvailabilityZones: S.optional(AvailabilityZoneList),
    Vpc: S.optional(S.Boolean),
    StorageType: S.optional(S.String),
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
export interface CertificateMessage {
  Certificates?: CertificateList;
  Marker?: string;
}
export const CertificateMessage = S.suspend(() =>
  S.Struct({
    Certificates: S.optional(CertificateList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CertificateMessage",
}) as any as S.Schema<CertificateMessage>;
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
  DBEngineVersions?: DBEngineVersionList;
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
  OrderableDBInstanceOptions?: OrderableDBInstanceOptionsList;
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
export interface CreateDBInstanceResult {
  DBInstance?: DBInstance;
}
export const CreateDBInstanceResult = S.suspend(() =>
  S.Struct({ DBInstance: S.optional(DBInstance) }).pipe(ns),
).annotations({
  identifier: "CreateDBInstanceResult",
}) as any as S.Schema<CreateDBInstanceResult>;

//# Errors
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
export class DBClusterNotFoundFault extends S.TaggedError<DBClusterNotFoundFault>()(
  "DBClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBClusterNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBParameterGroupAlreadyExistsFault extends S.TaggedError<DBParameterGroupAlreadyExistsFault>()(
  "DBParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBParameterGroupAlreadyExists",
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
export class DBInstanceNotFoundFault extends S.TaggedError<DBInstanceNotFoundFault>()(
  "DBInstanceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceNotFound", httpResponseCode: 404 }),
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
export class InvalidDBClusterStateFault extends S.TaggedError<InvalidDBClusterStateFault>()(
  "InvalidDBClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterStateFault",
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
export class DBParameterGroupQuotaExceededFault extends S.TaggedError<DBParameterGroupQuotaExceededFault>()(
  "DBParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SNSInvalidTopicFault extends S.TaggedError<SNSInvalidTopicFault>()(
  "SNSInvalidTopicFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSInvalidTopic", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidDBClusterSnapshotStateFault extends S.TaggedError<InvalidDBClusterSnapshotStateFault>()(
  "InvalidDBClusterSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterSnapshotStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DBSnapshotAlreadyExistsFault extends S.TaggedError<DBSnapshotAlreadyExistsFault>()(
  "DBSnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotAlreadyExists", httpResponseCode: 400 }),
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
export class DBClusterQuotaExceededFault extends S.TaggedError<DBClusterQuotaExceededFault>()(
  "DBClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterQuotaExceededFault",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class InvalidDBInstanceStateFault extends S.TaggedError<InvalidDBInstanceStateFault>()(
  "InvalidDBInstanceStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBInstanceState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DBSnapshotNotFoundFault extends S.TaggedError<DBSnapshotNotFoundFault>()(
  "DBSnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DBClusterParameterGroupNotFoundFault extends S.TaggedError<DBClusterParameterGroupNotFoundFault>()(
  "DBClusterParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterParameterGroupNotFound",
    httpResponseCode: 404,
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
export class SharedSnapshotQuotaExceededFault extends S.TaggedError<SharedSnapshotQuotaExceededFault>()(
  "SharedSnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SharedSnapshotQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SnapshotQuotaExceededFault extends S.TaggedError<SnapshotQuotaExceededFault>()(
  "SnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KMSKeyNotAccessibleFault extends S.TaggedError<KMSKeyNotAccessibleFault>()(
  "KMSKeyNotAccessibleFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSKeyNotAccessibleFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientStorageClusterCapacityFault extends S.TaggedError<InsufficientStorageClusterCapacityFault>()(
  "InsufficientStorageClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientStorageClusterCapacity",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InsufficientDBClusterCapacityFault extends S.TaggedError<InsufficientDBClusterCapacityFault>()(
  "InsufficientDBClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDBClusterCapacityFault",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
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
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidDBSnapshotStateFault extends S.TaggedError<InvalidDBSnapshotStateFault>()(
  "InvalidDBSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSnapshotState", httpResponseCode: 400 }),
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
export class InstanceQuotaExceededFault extends S.TaggedError<InstanceQuotaExceededFault>()(
  "InstanceQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InstanceQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NetworkTypeNotSupported extends S.TaggedError<NetworkTypeNotSupported>()(
  "NetworkTypeNotSupported",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NetworkTypeNotSupported", httpResponseCode: 400 }),
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
export class StorageQuotaExceededFault extends S.TaggedError<StorageQuotaExceededFault>()(
  "StorageQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class StorageTypeNotSupportedFault extends S.TaggedError<StorageTypeNotSupportedFault>()(
  "StorageTypeNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageTypeNotSupported", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of `DBClusterParameterGroup` descriptions. If a `DBClusterParameterGroupName` parameter is specified, the list contains only the description of the specified cluster parameter group.
 */
export const describeDBClusterParameterGroups: {
  (
    input: DescribeDBClusterParameterGroupsMessage,
  ): Effect.Effect<
    DBClusterParameterGroupsMessage,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClusterParameterGroupsMessage,
  ) => Stream.Stream<
    DBClusterParameterGroupsMessage,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClusterParameterGroupsMessage,
  ) => Stream.Stream<
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
 * Returns the detailed parameter list for a particular cluster parameter
 * group.
 */
export const describeDBClusterParameters: {
  (
    input: DescribeDBClusterParametersMessage,
  ): Effect.Effect<
    DBClusterParameterGroupDetails,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClusterParametersMessage,
  ) => Stream.Stream<
    DBClusterParameterGroupDetails,
    DBParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClusterParametersMessage,
  ) => Stream.Stream<
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
 * Returns a list of `DBSubnetGroup` descriptions. If a
 * `DBSubnetGroupName` is specified, the list will contain only the descriptions of the specified `DBSubnetGroup`.
 */
export const describeDBSubnetGroups: {
  (
    input: DescribeDBSubnetGroupsMessage,
  ): Effect.Effect<
    DBSubnetGroupMessage,
    DBSubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBSubnetGroupsMessage,
  ) => Stream.Stream<
    DBSubnetGroupMessage,
    DBSubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBSubnetGroupsMessage,
  ) => Stream.Stream<
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
 * Returns information about provisioned Amazon DocumentDB clusters. This API
 * operation supports pagination. For certain management features
 * such as cluster and instance lifecycle management, Amazon DocumentDB leverages
 * operational technology that is shared with Amazon RDS and Amazon
 * Neptune. Use the `filterName=engine,Values=docdb` filter
 * parameter to return only Amazon DocumentDB clusters.
 */
export const describeDBClusters: {
  (
    input: DescribeDBClustersMessage,
  ): Effect.Effect<
    DBClusterMessage,
    DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClustersMessage,
  ) => Stream.Stream<
    DBClusterMessage,
    DBClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClustersMessage,
  ) => Stream.Stream<
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
 * Deletes a specified cluster parameter group. The cluster parameter group to be deleted can't be associated with any clusters.
 */
export const deleteDBClusterParameterGroup: (
  input: DeleteDBClusterParameterGroupMessage,
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
  EventCategoriesMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventCategoriesMessage,
  output: EventCategoriesMessage,
  errors: [],
}));
/**
 * Returns events related to instances, security groups, snapshots, and DB parameter groups for the past 14 days. You can obtain events specific to a particular DB instance, security group, snapshot, or parameter group by providing the name as a parameter. By default, the events of the past hour are returned.
 */
export const describeEvents: {
  (
    input: DescribeEventsMessage,
  ): Effect.Effect<
    EventsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventsMessage,
  ) => Stream.Stream<
    EventsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventsMessage,
  ) => Stream.Stream<
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
 * Lists all the subscription descriptions for a customer account. The description for a subscription includes `SubscriptionName`, `SNSTopicARN`, `CustomerID`, `SourceType`, `SourceID`, `CreationTime`, and `Status`.
 *
 * If you specify a `SubscriptionName`, lists the description for that subscription.
 */
export const describeEventSubscriptions: {
  (
    input: DescribeEventSubscriptionsMessage,
  ): Effect.Effect<
    EventSubscriptionsMessage,
    SubscriptionNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventSubscriptionsMessage,
  ) => Stream.Stream<
    EventSubscriptionsMessage,
    SubscriptionNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventSubscriptionsMessage,
  ) => Stream.Stream<
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
 * Returns a list of resources (for example, instances) that have at least one pending
 * maintenance action.
 */
export const describePendingMaintenanceActions: {
  (
    input: DescribePendingMaintenanceActionsMessage,
  ): Effect.Effect<
    PendingMaintenanceActionsMessage,
    ResourceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePendingMaintenanceActionsMessage,
  ) => Stream.Stream<
    PendingMaintenanceActionsMessage,
    ResourceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribePendingMaintenanceActionsMessage,
  ) => Stream.Stream<
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
 * Removes a source identifier from an existing Amazon DocumentDB event notification
 * subscription.
 */
export const removeSourceIdentifierFromSubscription: (
  input: RemoveSourceIdentifierFromSubscriptionMessage,
) => Effect.Effect<
  RemoveSourceIdentifierFromSubscriptionResult,
  SourceNotFoundFault | SubscriptionNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveSourceIdentifierFromSubscriptionMessage,
  output: RemoveSourceIdentifierFromSubscriptionResult,
  errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
}));
/**
 * Modifies the parameters of a cluster parameter group. To modify more than one
 * parameter, submit a list of the following: `ParameterName`,
 * `ParameterValue`, and `ApplyMethod`. A maximum of 20
 * parameters can be modified in a single request.
 *
 * Changes to dynamic parameters are applied immediately. Changes to static
 * parameters require a reboot or maintenance window
 *
 * before the change can take effect.
 *
 * After you create a cluster parameter group, you should wait at least 5 minutes
 * before creating your first cluster that uses that cluster parameter group as
 * the default parameter group. This allows Amazon DocumentDB to fully complete the create action
 * before the parameter group is used as the default for a new cluster. This step is
 * especially important for parameters that are critical when creating the default
 * database for a cluster, such as the character set for the default database
 * defined by the `character_set_database` parameter.
 */
export const modifyDBClusterParameterGroup: (
  input: ModifyDBClusterParameterGroupMessage,
) => Effect.Effect<
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
 * Modifies the parameters of a cluster parameter group to the default value. To
 * reset specific parameters, submit a list of the following: `ParameterName`
 * and `ApplyMethod`. To reset the entire cluster parameter group, specify
 * the `DBClusterParameterGroupName` and `ResetAllParameters`
 * parameters.
 *
 * When you reset the entire group, dynamic parameters are updated immediately and
 * static parameters are set to `pending-reboot` to take effect on the next DB
 * instance reboot.
 */
export const resetDBClusterParameterGroup: (
  input: ResetDBClusterParameterGroupMessage,
) => Effect.Effect<
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
 * Returns information about cluster snapshots. This API operation supports pagination.
 */
export const describeDBClusterSnapshots: {
  (
    input: DescribeDBClusterSnapshotsMessage,
  ): Effect.Effect<
    DBClusterSnapshotMessage,
    DBClusterSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBClusterSnapshotsMessage,
  ) => Stream.Stream<
    DBClusterSnapshotMessage,
    DBClusterSnapshotNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBClusterSnapshotsMessage,
  ) => Stream.Stream<
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
 * Returns information about provisioned Amazon DocumentDB instances. This API supports pagination.
 */
export const describeDBInstances: {
  (
    input: DescribeDBInstancesMessage,
  ): Effect.Effect<
    DBInstanceMessage,
    DBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBInstancesMessage,
  ) => Stream.Stream<
    DBInstanceMessage,
    DBInstanceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBInstancesMessage,
  ) => Stream.Stream<
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
 * Returns information about Amazon DocumentDB global clusters. This API supports pagination.
 *
 * This action only applies to Amazon DocumentDB clusters.
 */
export const describeGlobalClusters: {
  (
    input: DescribeGlobalClustersMessage,
  ): Effect.Effect<
    GlobalClustersMessage,
    GlobalClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeGlobalClustersMessage,
  ) => Stream.Stream<
    GlobalClustersMessage,
    GlobalClusterNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeGlobalClustersMessage,
  ) => Stream.Stream<
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
 * Deletes an Amazon DocumentDB event notification subscription.
 */
export const deleteEventSubscription: (
  input: DeleteEventSubscriptionMessage,
) => Effect.Effect<
  DeleteEventSubscriptionResult,
  InvalidEventSubscriptionStateFault | SubscriptionNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventSubscriptionMessage,
  output: DeleteEventSubscriptionResult,
  errors: [InvalidEventSubscriptionStateFault, SubscriptionNotFoundFault],
}));
/**
 * Adds a source identifier to an existing event notification
 * subscription.
 */
export const addSourceIdentifierToSubscription: (
  input: AddSourceIdentifierToSubscriptionMessage,
) => Effect.Effect<
  AddSourceIdentifierToSubscriptionResult,
  SourceNotFoundFault | SubscriptionNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddSourceIdentifierToSubscriptionMessage,
  output: AddSourceIdentifierToSubscriptionResult,
  errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
}));
/**
 * Creates a new cluster parameter group.
 *
 * Parameters in a cluster parameter group apply to all of the
 * instances in a cluster.
 *
 * A cluster parameter group is initially created with the default
 * parameters for the database engine used by instances in the cluster.
 * In Amazon DocumentDB, you cannot make modifications directly to the
 * `default.docdb3.6` cluster parameter group. If your
 * Amazon DocumentDB cluster is using the default cluster parameter group and you
 * want to modify a value in it, you must first
 * create a new parameter group
 * or
 * copy an existing parameter group,
 * modify it, and then apply the modified parameter group to your
 * cluster. For the new cluster parameter group and associated settings
 * to take effect, you must then reboot the instances in the cluster
 * without failover. For more information,
 * see
 * Modifying Amazon DocumentDB Cluster Parameter Groups.
 */
export const createDBClusterParameterGroup: (
  input: CreateDBClusterParameterGroupMessage,
) => Effect.Effect<
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
 * Deletes a cluster snapshot. If the snapshot is being copied, the copy operation is terminated.
 *
 * The cluster snapshot must be in the `available` state to be deleted.
 */
export const deleteDBClusterSnapshot: (
  input: DeleteDBClusterSnapshotMessage,
) => Effect.Effect<
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
 * Deletes a subnet group.
 *
 * The specified database subnet group must not be associated with any DB
 * instances.
 */
export const deleteDBSubnetGroup: (
  input: DeleteDBSubnetGroupMessage,
) => Effect.Effect<
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
 * Deletes a global cluster. The primary and secondary clusters must already be detached or deleted before attempting to delete a global cluster.
 *
 * This action only applies to Amazon DocumentDB clusters.
 */
export const deleteGlobalCluster: (
  input: DeleteGlobalClusterMessage,
) => Effect.Effect<
  DeleteGlobalClusterResult,
  GlobalClusterNotFoundFault | InvalidGlobalClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlobalClusterMessage,
  output: DeleteGlobalClusterResult,
  errors: [GlobalClusterNotFoundFault, InvalidGlobalClusterStateFault],
}));
/**
 * Returns a list of cluster snapshot attribute names and values for a manual DB
 * cluster snapshot.
 *
 * When you share snapshots with other Amazon Web Services accounts,
 * `DescribeDBClusterSnapshotAttributes` returns the `restore` attribute and a list of IDs for the Amazon Web Services accounts that are authorized to copy or restore the manual cluster snapshot. If `all` is included in the list of values for the `restore` attribute, then the manual cluster snapshot is public and can be copied or restored by all Amazon Web Services accounts.
 */
export const describeDBClusterSnapshotAttributes: (
  input: DescribeDBClusterSnapshotAttributesMessage,
) => Effect.Effect<
  DescribeDBClusterSnapshotAttributesResult,
  DBClusterSnapshotNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDBClusterSnapshotAttributesMessage,
  output: DescribeDBClusterSnapshotAttributesResult,
  errors: [DBClusterSnapshotNotFoundFault],
}));
/**
 * Returns a list of the available engines.
 */
export const describeDBEngineVersions: {
  (
    input: DescribeDBEngineVersionsMessage,
  ): Effect.Effect<
    DBEngineVersionMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDBEngineVersionsMessage,
  ) => Stream.Stream<
    DBEngineVersionMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDBEngineVersionsMessage,
  ) => Stream.Stream<
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
 * Returns a list of orderable instance options for the specified engine.
 */
export const describeOrderableDBInstanceOptions: {
  (
    input: DescribeOrderableDBInstanceOptionsMessage,
  ): Effect.Effect<
    OrderableDBInstanceOptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOrderableDBInstanceOptionsMessage,
  ) => Stream.Stream<
    OrderableDBInstanceOptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOrderableDBInstanceOptionsMessage,
  ) => Stream.Stream<
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
 * Restarts the stopped cluster that is specified by `DBClusterIdentifier`.
 * For more information, see Stopping and
 * Starting an Amazon DocumentDB Cluster.
 */
export const startDBCluster: (
  input: StartDBClusterMessage,
) => Effect.Effect<
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
 * Copies the specified cluster parameter group.
 */
export const copyDBClusterParameterGroup: (
  input: CopyDBClusterParameterGroupMessage,
) => Effect.Effect<
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
 * Removes metadata tags from an Amazon DocumentDB resource.
 */
export const removeTagsFromResource: (
  input: RemoveTagsFromResourceMessage,
) => Effect.Effect<
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
 * Modify a setting for an Amazon DocumentDB global cluster. You can change one or more configuration parameters (for example: deletion protection), or the global cluster identifier by specifying these parameters and the new values in the request.
 *
 * This action only applies to Amazon DocumentDB clusters.
 */
export const modifyGlobalCluster: (
  input: ModifyGlobalClusterMessage,
) => Effect.Effect<
  ModifyGlobalClusterResult,
  GlobalClusterNotFoundFault | InvalidGlobalClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyGlobalClusterMessage,
  output: ModifyGlobalClusterResult,
  errors: [GlobalClusterNotFoundFault, InvalidGlobalClusterStateFault],
}));
/**
 * Switches over the specified secondary Amazon DocumentDB cluster to be the new primary Amazon DocumentDB cluster in the global database cluster.
 */
export const switchoverGlobalCluster: (
  input: SwitchoverGlobalClusterMessage,
) => Effect.Effect<
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
 * Promotes the specified secondary DB cluster to be the primary DB cluster in the global cluster when failing over a global cluster occurs.
 *
 * Use this operation to respond to an unplanned event, such as a regional disaster in the primary region.
 * Failing over can result in a loss of write transaction data that wasn't replicated to the chosen secondary before the failover event occurred.
 * However, the recovery process that promotes a DB instance on the chosen seconday DB cluster to be the primary writer DB instance guarantees that the data is in a transactionally consistent state.
 */
export const failoverGlobalCluster: (
  input: FailoverGlobalClusterMessage,
) => Effect.Effect<
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
 * Detaches an Amazon DocumentDB secondary cluster from a global cluster. The cluster becomes a standalone cluster with read-write capability instead of being read-only and receiving data from a primary in a different region.
 *
 * This action only applies to Amazon DocumentDB clusters.
 */
export const removeFromGlobalCluster: (
  input: RemoveFromGlobalClusterMessage,
) => Effect.Effect<
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
 * Returns a list of certificate authority (CA) certificates provided by Amazon DocumentDB for this Amazon Web Services account.
 */
export const describeCertificates: {
  (
    input: DescribeCertificatesMessage,
  ): Effect.Effect<
    CertificateMessage,
    CertificateNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCertificatesMessage,
  ) => Stream.Stream<
    CertificateMessage,
    CertificateNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCertificatesMessage,
  ) => Stream.Stream<
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
 * You might need to reboot your instance, usually for maintenance reasons. For
 * example, if you make certain changes, or if you change the cluster parameter group
 * that is associated with the instance, you must reboot the instance for the changes to
 * take effect.
 *
 * Rebooting an instance restarts the database engine service. Rebooting an instance
 * results in a momentary outage, during which the instance status is set to
 * *rebooting*.
 */
export const rebootDBInstance: (
  input: RebootDBInstanceMessage,
) => Effect.Effect<
  RebootDBInstanceResult,
  DBInstanceNotFoundFault | InvalidDBInstanceStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBInstanceMessage,
  output: RebootDBInstanceResult,
  errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
}));
/**
 * Stops the running cluster that is specified by `DBClusterIdentifier`. The
 * cluster must be in the *available* state. For more information, see
 * Stopping and
 * Starting an Amazon DocumentDB Cluster.
 */
export const stopDBCluster: (
  input: StopDBClusterMessage,
) => Effect.Effect<
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
 * Forces a failover for a cluster.
 *
 * A failover for a cluster promotes one of the Amazon DocumentDB replicas (read-only instances) in the cluster to be the primary instance (the cluster writer).
 *
 * If the primary instance fails, Amazon DocumentDB automatically fails over to an Amazon DocumentDB replica, if one exists. You can force a failover when you want to simulate a failure of a primary instance for testing.
 */
export const failoverDBCluster: (
  input: FailoverDBClusterMessage,
) => Effect.Effect<
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
 * Applies a pending maintenance action to a resource (for example,
 * to an Amazon DocumentDB instance).
 */
export const applyPendingMaintenanceAction: (
  input: ApplyPendingMaintenanceActionMessage,
) => Effect.Effect<
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
 * Adds metadata tags to an Amazon DocumentDB resource. You can use these tags
 * with cost allocation reporting to track costs that are associated
 * with Amazon DocumentDB resources or in a `Condition` statement in
 * an Identity and Access Management (IAM) policy for Amazon DocumentDB.
 */
export const addTagsToResource: (
  input: AddTagsToResourceMessage,
) => Effect.Effect<
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
 * Lists all tags on an Amazon DocumentDB resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceMessage,
) => Effect.Effect<
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
 * Adds an attribute and values to, or removes an attribute and values from, a manual cluster snapshot.
 *
 * To share a manual cluster snapshot with other Amazon Web Services accounts, specify `restore` as the `AttributeName`, and use the `ValuesToAdd` parameter to add a list of IDs of the Amazon Web Services accounts that are authorized to restore the manual cluster snapshot. Use the value `all` to make the manual cluster snapshot public, which means that it can be copied or restored by all Amazon Web Services accounts. Do not add the `all` value for any manual cluster snapshots that contain private information that you don't want available to all Amazon Web Services accounts. If a manual cluster snapshot is encrypted, it can be shared, but only by specifying a list of authorized Amazon Web Services account IDs for the `ValuesToAdd` parameter. You can't use `all` as a value for that parameter in this case.
 */
export const modifyDBClusterSnapshotAttribute: (
  input: ModifyDBClusterSnapshotAttributeMessage,
) => Effect.Effect<
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
 * Creates a snapshot of a cluster.
 */
export const createDBClusterSnapshot: (
  input: CreateDBClusterSnapshotMessage,
) => Effect.Effect<
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
 * Copies a snapshot of a cluster.
 *
 * To copy a cluster snapshot from a shared manual cluster snapshot,
 * `SourceDBClusterSnapshotIdentifier` must be the Amazon
 * Resource Name (ARN) of the shared cluster snapshot. You can only
 * copy a shared DB cluster snapshot, whether encrypted or not, in the
 * same Amazon Web Services Region.
 *
 * To cancel the copy operation after it is in progress, delete the
 * target cluster snapshot identified by
 * `TargetDBClusterSnapshotIdentifier` while that cluster
 * snapshot is in the *copying* status.
 */
export const copyDBClusterSnapshot: (
  input: CopyDBClusterSnapshotMessage,
) => Effect.Effect<
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
 * Deletes a previously provisioned cluster. When you delete a cluster, all automated backups for that cluster are deleted and can't be recovered. Manual DB cluster snapshots of the specified cluster are not deleted.
 */
export const deleteDBCluster: (
  input: DeleteDBClusterMessage,
) => Effect.Effect<
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
 * Deletes a previously provisioned instance.
 */
export const deleteDBInstance: (
  input: DeleteDBInstanceMessage,
) => Effect.Effect<
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
 * Creates a new subnet group. subnet groups must contain at least one subnet in at
 * least two Availability Zones in the Amazon Web Services Region.
 */
export const createDBSubnetGroup: (
  input: CreateDBSubnetGroupMessage,
) => Effect.Effect<
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
 * Creates an Amazon DocumentDB global cluster that can span multiple multiple Amazon Web Services Regions.
 * The global cluster contains one primary cluster with read-write capability, and up-to 10 read-only secondary clusters. Global clusters uses storage-based fast replication across regions with latencies less than one second, using dedicated infrastructure with no impact to your workload’s performance.
 *
 * You can create a global cluster that is initially empty, and then add a primary and a secondary to it.
 * Or you can specify an existing cluster during the create operation, and this cluster becomes the primary of the global cluster.
 *
 * This action only applies to Amazon DocumentDB clusters.
 */
export const createGlobalCluster: (
  input: CreateGlobalClusterMessage,
) => Effect.Effect<
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
 * Modifies an existing subnet group. subnet groups must contain at least one subnet in at least two Availability Zones in the Amazon Web Services Region.
 */
export const modifyDBSubnetGroup: (
  input: ModifyDBSubnetGroupMessage,
) => Effect.Effect<
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
 * Modifies an existing Amazon DocumentDB event notification subscription.
 */
export const modifyEventSubscription: (
  input: ModifyEventSubscriptionMessage,
) => Effect.Effect<
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
 * Creates an Amazon DocumentDB event notification subscription. This action requires a topic Amazon Resource Name (ARN) created by using the Amazon DocumentDB console, the Amazon SNS console, or the Amazon SNS API. To obtain an ARN with Amazon SNS, you must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in the Amazon SNS console.
 *
 * You can specify the type of source (`SourceType`) that you want to be notified of. You can also provide a list of Amazon DocumentDB sources (`SourceIds`) that trigger the events, and you can provide a list of event categories (`EventCategories`) for events that you want to be notified of. For example, you can specify `SourceType = db-instance`, `SourceIds = mydbinstance1, mydbinstance2` and `EventCategories = Availability, Backup`.
 *
 * If you specify both the `SourceType` and `SourceIds` (such as `SourceType = db-instance` and `SourceIdentifier = myDBInstance1`), you are notified of all the `db-instance` events for the specified source. If you specify a `SourceType` but do not specify a `SourceIdentifier`, you receive notice of the events for that source type for all your Amazon DocumentDB sources. If you do not specify either the `SourceType` or the `SourceIdentifier`, you are notified of events generated from all Amazon DocumentDB sources belonging to your customer account.
 */
export const createEventSubscription: (
  input: CreateEventSubscriptionMessage,
) => Effect.Effect<
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
 * Creates a new Amazon DocumentDB cluster.
 */
export const createDBCluster: (
  input: CreateDBClusterMessage,
) => Effect.Effect<
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
  | NetworkTypeNotSupported
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
    NetworkTypeNotSupported,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Restores a cluster to an arbitrary point in time. Users can restore to any point in
 * time before `LatestRestorableTime` for up to
 * `BackupRetentionPeriod` days. The target cluster is created from the
 * source cluster with the same configuration as the original cluster, except that
 * the new cluster is created with the default security group.
 */
export const restoreDBClusterToPointInTime: (
  input: RestoreDBClusterToPointInTimeMessage,
) => Effect.Effect<
  RestoreDBClusterToPointInTimeResult,
  | DBClusterAlreadyExistsFault
  | DBClusterNotFoundFault
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
  | NetworkTypeNotSupported
  | StorageQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreDBClusterToPointInTimeMessage,
  output: RestoreDBClusterToPointInTimeResult,
  errors: [
    DBClusterAlreadyExistsFault,
    DBClusterNotFoundFault,
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
    NetworkTypeNotSupported,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Modifies a setting for an Amazon DocumentDB cluster. You can change one or more database
 * configuration parameters by specifying these parameters and the new values in the
 * request.
 */
export const modifyDBCluster: (
  input: ModifyDBClusterMessage,
) => Effect.Effect<
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
  | NetworkTypeNotSupported
  | StorageQuotaExceededFault
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
    NetworkTypeNotSupported,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Creates a new cluster from a snapshot or cluster snapshot.
 *
 * If a snapshot is specified, the target cluster is created from the source DB snapshot with a default configuration and default security group.
 *
 * If a cluster snapshot is specified, the target cluster is created from the source cluster restore point with the same configuration as the original source DB cluster, except that the new cluster is created with the default security group.
 */
export const restoreDBClusterFromSnapshot: (
  input: RestoreDBClusterFromSnapshotMessage,
) => Effect.Effect<
  RestoreDBClusterFromSnapshotResult,
  | DBClusterAlreadyExistsFault
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
  | NetworkTypeNotSupported
  | StorageQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreDBClusterFromSnapshotMessage,
  output: RestoreDBClusterFromSnapshotResult,
  errors: [
    DBClusterAlreadyExistsFault,
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
    NetworkTypeNotSupported,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Modifies settings for an instance. You can change one or more database configuration parameters by specifying these parameters and the new values in the request.
 */
export const modifyDBInstance: (
  input: ModifyDBInstanceMessage,
) => Effect.Effect<
  ModifyDBInstanceResult,
  | AuthorizationNotFoundFault
  | CertificateNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBInstanceNotFoundFault
  | DBParameterGroupNotFoundFault
  | DBSecurityGroupNotFoundFault
  | DBUpgradeDependencyFailureFault
  | InsufficientDBInstanceCapacityFault
  | InvalidDBInstanceStateFault
  | InvalidDBSecurityGroupStateFault
  | InvalidVPCNetworkStateFault
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
    InsufficientDBInstanceCapacityFault,
    InvalidDBInstanceStateFault,
    InvalidDBSecurityGroupStateFault,
    InvalidVPCNetworkStateFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));
/**
 * Creates a new instance.
 */
export const createDBInstance: (
  input: CreateDBInstanceMessage,
) => Effect.Effect<
  CreateDBInstanceResult,
  | AuthorizationNotFoundFault
  | DBClusterNotFoundFault
  | DBInstanceAlreadyExistsFault
  | DBParameterGroupNotFoundFault
  | DBSecurityGroupNotFoundFault
  | DBSubnetGroupDoesNotCoverEnoughAZs
  | DBSubnetGroupNotFoundFault
  | InstanceQuotaExceededFault
  | InsufficientDBInstanceCapacityFault
  | InvalidDBClusterStateFault
  | InvalidSubnet
  | InvalidVPCNetworkStateFault
  | KMSKeyNotAccessibleFault
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
    InstanceQuotaExceededFault,
    InsufficientDBInstanceCapacityFault,
    InvalidDBClusterStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));
