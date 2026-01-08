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
const ns = T.XmlNamespace("http://redshift.amazonaws.com/doc/2012-12-01/");
const svc = T.AwsApiService({
  sdkId: "Redshift",
  serviceShapeName: "RedshiftServiceVersion20121201",
});
const auth = T.AwsAuthSigv4({ name: "redshift" });
const ver = T.ServiceVersion("2012-12-01");
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
              `https://redshift-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://redshift.${Region}.amazonaws.com`);
            }
            return e(
              `https://redshift-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://redshift.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://redshift.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PartnerIntegrationAccountId = string;
export type PartnerIntegrationClusterIdentifier = string;
export type PartnerIntegrationDatabaseName = string;
export type PartnerIntegrationPartnerName = string;
export type AuthenticationProfileNameString = string;
export type SensitiveString = string | redacted.Redacted<string>;
export type CatalogNameString = string;
export type CustomDomainNameString = string;
export type CustomDomainCertificateArnString = string;
export type SourceArn = string;
export type TargetArn = string;
export type IntegrationName = string;
export type IntegrationDescription = string;
export type RedshiftIdcApplicationName = string;
export type IdentityNamespaceString = string;
export type IdcDisplayNameString = string;
export type IntegrationArn = string;
export type InboundIntegrationArn = string;
export type S3KeyPrefixValue = string;
export type PartnerIntegrationStatusMessage = string;
export type ExceptionMessage = string;
export type Description = string;

//# Schemas
export interface DescribeStorageRequest {}
export const DescribeStorageRequest = S.suspend(() =>
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
  identifier: "DescribeStorageRequest",
}) as any as S.Schema<DescribeStorageRequest>;
export type VpcIdentifierList = string[];
export const VpcIdentifierList = S.Array(
  S.String.pipe(T.XmlName("VpcIdentifier")),
);
export interface DeleteClusterSnapshotMessage {
  SnapshotIdentifier?: string;
  SnapshotClusterIdentifier?: string;
}
export const DeleteClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    SnapshotIdentifier: S.optional(S.String),
    SnapshotClusterIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterSnapshotMessage",
}) as any as S.Schema<DeleteClusterSnapshotMessage>;
export type DeleteClusterSnapshotMessageList = DeleteClusterSnapshotMessage[];
export const DeleteClusterSnapshotMessageList = S.Array(
  DeleteClusterSnapshotMessage.pipe(
    T.XmlName("DeleteClusterSnapshotMessage"),
  ).annotations({ identifier: "DeleteClusterSnapshotMessage" }),
);
export type SnapshotIdentifierList = string[];
export const SnapshotIdentifierList = S.Array(
  S.String.pipe(T.XmlName("String")),
);
export type ClusterSecurityGroupNameList = string[];
export const ClusterSecurityGroupNameList = S.Array(
  S.String.pipe(T.XmlName("ClusterSecurityGroupName")),
);
export type VpcSecurityGroupIdList = string[];
export const VpcSecurityGroupIdList = S.Array(
  S.String.pipe(T.XmlName("VpcSecurityGroupId")),
);
export type IamRoleArnList = string[];
export const IamRoleArnList = S.Array(S.String.pipe(T.XmlName("IamRoleArn")));
export type AquaConfigurationStatus = "enabled" | "disabled" | "auto";
export const AquaConfigurationStatus = S.Literal("enabled", "disabled", "auto");
export type SubnetIdentifierList = string[];
export const SubnetIdentifierList = S.Array(
  S.String.pipe(T.XmlName("SubnetIdentifier")),
);
export type SourceIdsList = string[];
export const SourceIdsList = S.Array(S.String.pipe(T.XmlName("SourceId")));
export type EventCategoriesList = string[];
export const EventCategoriesList = S.Array(
  S.String.pipe(T.XmlName("EventCategory")),
);
export type ApplicationType = "None" | "Lakehouse";
export const ApplicationType = S.Literal("None", "Lakehouse");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String.pipe(T.XmlName("TagKey")));
export type ScheduleDefinitionList = string[];
export const ScheduleDefinitionList = S.Array(
  S.String.pipe(T.XmlName("ScheduleDefinition")),
);
export type UsageLimitFeatureType =
  | "spectrum"
  | "concurrency-scaling"
  | "cross-region-datasharing";
export const UsageLimitFeatureType = S.Literal(
  "spectrum",
  "concurrency-scaling",
  "cross-region-datasharing",
);
export type UsageLimitLimitType = "time" | "data-scanned";
export const UsageLimitLimitType = S.Literal("time", "data-scanned");
export type UsageLimitPeriod = "daily" | "weekly" | "monthly";
export const UsageLimitPeriod = S.Literal("daily", "weekly", "monthly");
export type UsageLimitBreachAction = "log" | "emit-metric" | "disable";
export const UsageLimitBreachAction = S.Literal(
  "log",
  "emit-metric",
  "disable",
);
export type ConsumerIdentifierList = string[];
export const ConsumerIdentifierList = S.Array(S.String);
export type AttributeNameList = string[];
export const AttributeNameList = S.Array(
  S.String.pipe(T.XmlName("AttributeName")),
);
export type TagValueList = string[];
export const TagValueList = S.Array(S.String.pipe(T.XmlName("TagValue")));
export type DataShareStatusForConsumer = "ACTIVE" | "AVAILABLE";
export const DataShareStatusForConsumer = S.Literal("ACTIVE", "AVAILABLE");
export type DataShareStatusForProducer =
  | "ACTIVE"
  | "AUTHORIZED"
  | "PENDING_AUTHORIZATION"
  | "DEAUTHORIZED"
  | "REJECTED";
export const DataShareStatusForProducer = S.Literal(
  "ACTIVE",
  "AUTHORIZED",
  "PENDING_AUTHORIZATION",
  "DEAUTHORIZED",
  "REJECTED",
);
export type SourceType =
  | "cluster"
  | "cluster-parameter-group"
  | "cluster-security-group"
  | "cluster-snapshot"
  | "scheduled-action";
export const SourceType = S.Literal(
  "cluster",
  "cluster-parameter-group",
  "cluster-security-group",
  "cluster-snapshot",
  "scheduled-action",
);
export type ActionType =
  | "restore-cluster"
  | "recommend-node-config"
  | "resize-cluster";
export const ActionType = S.Literal(
  "restore-cluster",
  "recommend-node-config",
  "resize-cluster",
);
export type ScheduledActionTypeValues =
  | "ResizeCluster"
  | "PauseCluster"
  | "ResumeCluster";
export const ScheduledActionTypeValues = S.Literal(
  "ResizeCluster",
  "PauseCluster",
  "ResumeCluster",
);
export type LogDestinationType = "s3" | "cloudwatch";
export const LogDestinationType = S.Literal("s3", "cloudwatch");
export type LogTypeList = string[];
export const LogTypeList = S.Array(S.String);
export type DbGroupList = string[];
export const DbGroupList = S.Array(S.String.pipe(T.XmlName("DbGroup")));
export type ClusterIdentifierList = string[];
export const ClusterIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ClusterIdentifier")),
);
export type ReservedNodeExchangeActionType =
  | "restore-cluster"
  | "resize-cluster";
export const ReservedNodeExchangeActionType = S.Literal(
  "restore-cluster",
  "resize-cluster",
);
export type LakehouseRegistration = "Register" | "Deregister";
export const LakehouseRegistration = S.Literal("Register", "Deregister");
export type LakehouseIdcRegistration = "Associate" | "Disassociate";
export const LakehouseIdcRegistration = S.Literal("Associate", "Disassociate");
export type PartnerIntegrationStatus =
  | "Active"
  | "Inactive"
  | "RuntimeFailure"
  | "ConnectionFailure";
export const PartnerIntegrationStatus = S.Literal(
  "Active",
  "Inactive",
  "RuntimeFailure",
  "ConnectionFailure",
);
export interface AcceptReservedNodeExchangeInputMessage {
  ReservedNodeId?: string;
  TargetReservedNodeOfferingId?: string;
}
export const AcceptReservedNodeExchangeInputMessage = S.suspend(() =>
  S.Struct({
    ReservedNodeId: S.optional(S.String),
    TargetReservedNodeOfferingId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptReservedNodeExchangeInputMessage",
}) as any as S.Schema<AcceptReservedNodeExchangeInputMessage>;
export interface PartnerIntegrationInputMessage {
  AccountId?: string;
  ClusterIdentifier?: string;
  DatabaseName?: string;
  PartnerName?: string;
}
export const PartnerIntegrationInputMessage = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    PartnerName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PartnerIntegrationInputMessage",
}) as any as S.Schema<PartnerIntegrationInputMessage>;
export interface AssociateDataShareConsumerMessage {
  DataShareArn?: string;
  AssociateEntireAccount?: boolean;
  ConsumerArn?: string;
  ConsumerRegion?: string;
  AllowWrites?: boolean;
}
export const AssociateDataShareConsumerMessage = S.suspend(() =>
  S.Struct({
    DataShareArn: S.optional(S.String),
    AssociateEntireAccount: S.optional(S.Boolean),
    ConsumerArn: S.optional(S.String),
    ConsumerRegion: S.optional(S.String),
    AllowWrites: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateDataShareConsumerMessage",
}) as any as S.Schema<AssociateDataShareConsumerMessage>;
export interface AuthorizeClusterSecurityGroupIngressMessage {
  ClusterSecurityGroupName?: string;
  CIDRIP?: string;
  EC2SecurityGroupName?: string;
  EC2SecurityGroupOwnerId?: string;
}
export const AuthorizeClusterSecurityGroupIngressMessage = S.suspend(() =>
  S.Struct({
    ClusterSecurityGroupName: S.optional(S.String),
    CIDRIP: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
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
  identifier: "AuthorizeClusterSecurityGroupIngressMessage",
}) as any as S.Schema<AuthorizeClusterSecurityGroupIngressMessage>;
export interface AuthorizeDataShareMessage {
  DataShareArn?: string;
  ConsumerIdentifier?: string;
  AllowWrites?: boolean;
}
export const AuthorizeDataShareMessage = S.suspend(() =>
  S.Struct({
    DataShareArn: S.optional(S.String),
    ConsumerIdentifier: S.optional(S.String),
    AllowWrites: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AuthorizeDataShareMessage",
}) as any as S.Schema<AuthorizeDataShareMessage>;
export interface AuthorizeEndpointAccessMessage {
  ClusterIdentifier?: string;
  Account?: string;
  VpcIds?: string[];
}
export const AuthorizeEndpointAccessMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    Account: S.optional(S.String),
    VpcIds: S.optional(VpcIdentifierList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AuthorizeEndpointAccessMessage",
}) as any as S.Schema<AuthorizeEndpointAccessMessage>;
export interface AuthorizeSnapshotAccessMessage {
  SnapshotIdentifier?: string;
  SnapshotArn?: string;
  SnapshotClusterIdentifier?: string;
  AccountWithRestoreAccess?: string;
}
export const AuthorizeSnapshotAccessMessage = S.suspend(() =>
  S.Struct({
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    SnapshotClusterIdentifier: S.optional(S.String),
    AccountWithRestoreAccess: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AuthorizeSnapshotAccessMessage",
}) as any as S.Schema<AuthorizeSnapshotAccessMessage>;
export interface BatchDeleteClusterSnapshotsRequest {
  Identifiers?: DeleteClusterSnapshotMessage[];
}
export const BatchDeleteClusterSnapshotsRequest = S.suspend(() =>
  S.Struct({ Identifiers: S.optional(DeleteClusterSnapshotMessageList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteClusterSnapshotsRequest",
}) as any as S.Schema<BatchDeleteClusterSnapshotsRequest>;
export interface BatchModifyClusterSnapshotsMessage {
  SnapshotIdentifierList?: string[];
  ManualSnapshotRetentionPeriod?: number;
  Force?: boolean;
}
export const BatchModifyClusterSnapshotsMessage = S.suspend(() =>
  S.Struct({
    SnapshotIdentifierList: S.optional(SnapshotIdentifierList),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    Force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchModifyClusterSnapshotsMessage",
}) as any as S.Schema<BatchModifyClusterSnapshotsMessage>;
export interface CancelResizeMessage {
  ClusterIdentifier?: string;
}
export const CancelResizeMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelResizeMessage",
}) as any as S.Schema<CancelResizeMessage>;
export interface CopyClusterSnapshotMessage {
  SourceSnapshotIdentifier?: string;
  SourceSnapshotClusterIdentifier?: string;
  TargetSnapshotIdentifier?: string;
  ManualSnapshotRetentionPeriod?: number;
}
export const CopyClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    SourceSnapshotIdentifier: S.optional(S.String),
    SourceSnapshotClusterIdentifier: S.optional(S.String),
    TargetSnapshotIdentifier: S.optional(S.String),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CopyClusterSnapshotMessage",
}) as any as S.Schema<CopyClusterSnapshotMessage>;
export interface CreateAuthenticationProfileMessage {
  AuthenticationProfileName?: string;
  AuthenticationProfileContent?: string;
}
export const CreateAuthenticationProfileMessage = S.suspend(() =>
  S.Struct({
    AuthenticationProfileName: S.optional(S.String),
    AuthenticationProfileContent: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAuthenticationProfileMessage",
}) as any as S.Schema<CreateAuthenticationProfileMessage>;
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
export interface CreateClusterParameterGroupMessage {
  ParameterGroupName?: string;
  ParameterGroupFamily?: string;
  Description?: string;
  Tags?: Tag[];
}
export const CreateClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
    ParameterGroupFamily: S.optional(S.String),
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
  identifier: "CreateClusterParameterGroupMessage",
}) as any as S.Schema<CreateClusterParameterGroupMessage>;
export interface CreateClusterSecurityGroupMessage {
  ClusterSecurityGroupName?: string;
  Description?: string;
  Tags?: Tag[];
}
export const CreateClusterSecurityGroupMessage = S.suspend(() =>
  S.Struct({
    ClusterSecurityGroupName: S.optional(S.String),
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
  identifier: "CreateClusterSecurityGroupMessage",
}) as any as S.Schema<CreateClusterSecurityGroupMessage>;
export interface CreateClusterSnapshotMessage {
  SnapshotIdentifier?: string;
  ClusterIdentifier?: string;
  ManualSnapshotRetentionPeriod?: number;
  Tags?: Tag[];
}
export const CreateClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    SnapshotIdentifier: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
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
  identifier: "CreateClusterSnapshotMessage",
}) as any as S.Schema<CreateClusterSnapshotMessage>;
export interface CreateClusterSubnetGroupMessage {
  ClusterSubnetGroupName?: string;
  Description?: string;
  SubnetIds?: string[];
  Tags?: Tag[];
}
export const CreateClusterSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    ClusterSubnetGroupName: S.optional(S.String),
    Description: S.optional(S.String),
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
  identifier: "CreateClusterSubnetGroupMessage",
}) as any as S.Schema<CreateClusterSubnetGroupMessage>;
export interface CreateCustomDomainAssociationMessage {
  CustomDomainName?: string;
  CustomDomainCertificateArn?: string;
  ClusterIdentifier?: string;
}
export const CreateCustomDomainAssociationMessage = S.suspend(() =>
  S.Struct({
    CustomDomainName: S.optional(S.String),
    CustomDomainCertificateArn: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomDomainAssociationMessage",
}) as any as S.Schema<CreateCustomDomainAssociationMessage>;
export interface CreateEndpointAccessMessage {
  ClusterIdentifier?: string;
  ResourceOwner?: string;
  EndpointName?: string;
  SubnetGroupName?: string;
  VpcSecurityGroupIds?: string[];
}
export const CreateEndpointAccessMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    EndpointName: S.optional(S.String),
    SubnetGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEndpointAccessMessage",
}) as any as S.Schema<CreateEndpointAccessMessage>;
export interface CreateEventSubscriptionMessage {
  SubscriptionName?: string;
  SnsTopicArn?: string;
  SourceType?: string;
  SourceIds?: string[];
  EventCategories?: string[];
  Severity?: string;
  Enabled?: boolean;
  Tags?: Tag[];
}
export const CreateEventSubscriptionMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    SourceType: S.optional(S.String),
    SourceIds: S.optional(SourceIdsList),
    EventCategories: S.optional(EventCategoriesList),
    Severity: S.optional(S.String),
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
export interface CreateHsmClientCertificateMessage {
  HsmClientCertificateIdentifier?: string;
  Tags?: Tag[];
}
export const CreateHsmClientCertificateMessage = S.suspend(() =>
  S.Struct({
    HsmClientCertificateIdentifier: S.optional(S.String),
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
  identifier: "CreateHsmClientCertificateMessage",
}) as any as S.Schema<CreateHsmClientCertificateMessage>;
export interface CreateHsmConfigurationMessage {
  HsmConfigurationIdentifier?: string;
  Description?: string;
  HsmIpAddress?: string;
  HsmPartitionName?: string;
  HsmPartitionPassword?: string;
  HsmServerPublicCertificate?: string;
  Tags?: Tag[];
}
export const CreateHsmConfigurationMessage = S.suspend(() =>
  S.Struct({
    HsmConfigurationIdentifier: S.optional(S.String),
    Description: S.optional(S.String),
    HsmIpAddress: S.optional(S.String),
    HsmPartitionName: S.optional(S.String),
    HsmPartitionPassword: S.optional(S.String),
    HsmServerPublicCertificate: S.optional(S.String),
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
  identifier: "CreateHsmConfigurationMessage",
}) as any as S.Schema<CreateHsmConfigurationMessage>;
export interface CreateSnapshotCopyGrantMessage {
  SnapshotCopyGrantName?: string;
  KmsKeyId?: string;
  Tags?: Tag[];
}
export const CreateSnapshotCopyGrantMessage = S.suspend(() =>
  S.Struct({
    SnapshotCopyGrantName: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
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
  identifier: "CreateSnapshotCopyGrantMessage",
}) as any as S.Schema<CreateSnapshotCopyGrantMessage>;
export interface CreateSnapshotScheduleMessage {
  ScheduleDefinitions?: string[];
  ScheduleIdentifier?: string;
  ScheduleDescription?: string;
  Tags?: Tag[];
  DryRun?: boolean;
  NextInvocations?: number;
}
export const CreateSnapshotScheduleMessage = S.suspend(() =>
  S.Struct({
    ScheduleDefinitions: S.optional(ScheduleDefinitionList),
    ScheduleIdentifier: S.optional(S.String),
    ScheduleDescription: S.optional(S.String),
    Tags: S.optional(TagList),
    DryRun: S.optional(S.Boolean),
    NextInvocations: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSnapshotScheduleMessage",
}) as any as S.Schema<CreateSnapshotScheduleMessage>;
export interface CreateTagsMessage {
  ResourceName?: string;
  Tags?: Tag[];
}
export const CreateTagsMessage = S.suspend(() =>
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
  identifier: "CreateTagsMessage",
}) as any as S.Schema<CreateTagsMessage>;
export interface CreateTagsResponse {}
export const CreateTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateTagsResponse",
}) as any as S.Schema<CreateTagsResponse>;
export interface CreateUsageLimitMessage {
  ClusterIdentifier?: string;
  FeatureType?: UsageLimitFeatureType;
  LimitType?: UsageLimitLimitType;
  Amount?: number;
  Period?: UsageLimitPeriod;
  BreachAction?: UsageLimitBreachAction;
  Tags?: Tag[];
}
export const CreateUsageLimitMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    FeatureType: S.optional(UsageLimitFeatureType),
    LimitType: S.optional(UsageLimitLimitType),
    Amount: S.optional(S.Number),
    Period: S.optional(UsageLimitPeriod),
    BreachAction: S.optional(UsageLimitBreachAction),
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
  identifier: "CreateUsageLimitMessage",
}) as any as S.Schema<CreateUsageLimitMessage>;
export interface DeauthorizeDataShareMessage {
  DataShareArn?: string;
  ConsumerIdentifier?: string;
}
export const DeauthorizeDataShareMessage = S.suspend(() =>
  S.Struct({
    DataShareArn: S.optional(S.String),
    ConsumerIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeauthorizeDataShareMessage",
}) as any as S.Schema<DeauthorizeDataShareMessage>;
export interface DeleteAuthenticationProfileMessage {
  AuthenticationProfileName?: string;
}
export const DeleteAuthenticationProfileMessage = S.suspend(() =>
  S.Struct({ AuthenticationProfileName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAuthenticationProfileMessage",
}) as any as S.Schema<DeleteAuthenticationProfileMessage>;
export interface DeleteClusterMessage {
  ClusterIdentifier?: string;
  SkipFinalClusterSnapshot?: boolean;
  FinalClusterSnapshotIdentifier?: string;
  FinalClusterSnapshotRetentionPeriod?: number;
}
export const DeleteClusterMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    SkipFinalClusterSnapshot: S.optional(S.Boolean),
    FinalClusterSnapshotIdentifier: S.optional(S.String),
    FinalClusterSnapshotRetentionPeriod: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterMessage",
}) as any as S.Schema<DeleteClusterMessage>;
export interface DeleteClusterParameterGroupMessage {
  ParameterGroupName?: string;
}
export const DeleteClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({ ParameterGroupName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterParameterGroupMessage",
}) as any as S.Schema<DeleteClusterParameterGroupMessage>;
export interface DeleteClusterParameterGroupResponse {}
export const DeleteClusterParameterGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteClusterParameterGroupResponse",
}) as any as S.Schema<DeleteClusterParameterGroupResponse>;
export interface DeleteClusterSecurityGroupMessage {
  ClusterSecurityGroupName?: string;
}
export const DeleteClusterSecurityGroupMessage = S.suspend(() =>
  S.Struct({ ClusterSecurityGroupName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterSecurityGroupMessage",
}) as any as S.Schema<DeleteClusterSecurityGroupMessage>;
export interface DeleteClusterSecurityGroupResponse {}
export const DeleteClusterSecurityGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteClusterSecurityGroupResponse",
}) as any as S.Schema<DeleteClusterSecurityGroupResponse>;
export interface DeleteClusterSubnetGroupMessage {
  ClusterSubnetGroupName?: string;
}
export const DeleteClusterSubnetGroupMessage = S.suspend(() =>
  S.Struct({ ClusterSubnetGroupName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterSubnetGroupMessage",
}) as any as S.Schema<DeleteClusterSubnetGroupMessage>;
export interface DeleteClusterSubnetGroupResponse {}
export const DeleteClusterSubnetGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteClusterSubnetGroupResponse",
}) as any as S.Schema<DeleteClusterSubnetGroupResponse>;
export interface DeleteCustomDomainAssociationMessage {
  ClusterIdentifier?: string;
  CustomDomainName?: string;
}
export const DeleteCustomDomainAssociationMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    CustomDomainName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomDomainAssociationMessage",
}) as any as S.Schema<DeleteCustomDomainAssociationMessage>;
export interface DeleteCustomDomainAssociationResponse {}
export const DeleteCustomDomainAssociationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCustomDomainAssociationResponse",
}) as any as S.Schema<DeleteCustomDomainAssociationResponse>;
export interface DeleteEndpointAccessMessage {
  EndpointName?: string;
}
export const DeleteEndpointAccessMessage = S.suspend(() =>
  S.Struct({ EndpointName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEndpointAccessMessage",
}) as any as S.Schema<DeleteEndpointAccessMessage>;
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
export interface DeleteEventSubscriptionResponse {}
export const DeleteEventSubscriptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEventSubscriptionResponse",
}) as any as S.Schema<DeleteEventSubscriptionResponse>;
export interface DeleteHsmClientCertificateMessage {
  HsmClientCertificateIdentifier?: string;
}
export const DeleteHsmClientCertificateMessage = S.suspend(() =>
  S.Struct({ HsmClientCertificateIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteHsmClientCertificateMessage",
}) as any as S.Schema<DeleteHsmClientCertificateMessage>;
export interface DeleteHsmClientCertificateResponse {}
export const DeleteHsmClientCertificateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteHsmClientCertificateResponse",
}) as any as S.Schema<DeleteHsmClientCertificateResponse>;
export interface DeleteHsmConfigurationMessage {
  HsmConfigurationIdentifier?: string;
}
export const DeleteHsmConfigurationMessage = S.suspend(() =>
  S.Struct({ HsmConfigurationIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteHsmConfigurationMessage",
}) as any as S.Schema<DeleteHsmConfigurationMessage>;
export interface DeleteHsmConfigurationResponse {}
export const DeleteHsmConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteHsmConfigurationResponse",
}) as any as S.Schema<DeleteHsmConfigurationResponse>;
export interface DeleteIntegrationMessage {
  IntegrationArn?: string;
}
export const DeleteIntegrationMessage = S.suspend(() =>
  S.Struct({ IntegrationArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
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
export interface PartnerIntegrationOutputMessage {
  DatabaseName?: string;
  PartnerName?: string;
}
export const PartnerIntegrationOutputMessage = S.suspend(() =>
  S.Struct({
    DatabaseName: S.optional(S.String),
    PartnerName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PartnerIntegrationOutputMessage",
}) as any as S.Schema<PartnerIntegrationOutputMessage>;
export interface DeleteRedshiftIdcApplicationMessage {
  RedshiftIdcApplicationArn?: string;
}
export const DeleteRedshiftIdcApplicationMessage = S.suspend(() =>
  S.Struct({ RedshiftIdcApplicationArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRedshiftIdcApplicationMessage",
}) as any as S.Schema<DeleteRedshiftIdcApplicationMessage>;
export interface DeleteRedshiftIdcApplicationResponse {}
export const DeleteRedshiftIdcApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRedshiftIdcApplicationResponse",
}) as any as S.Schema<DeleteRedshiftIdcApplicationResponse>;
export interface DeleteResourcePolicyMessage {
  ResourceArn?: string;
}
export const DeleteResourcePolicyMessage = S.suspend(() =>
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
  identifier: "DeleteResourcePolicyMessage",
}) as any as S.Schema<DeleteResourcePolicyMessage>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteScheduledActionMessage {
  ScheduledActionName?: string;
}
export const DeleteScheduledActionMessage = S.suspend(() =>
  S.Struct({ ScheduledActionName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteScheduledActionMessage",
}) as any as S.Schema<DeleteScheduledActionMessage>;
export interface DeleteScheduledActionResponse {}
export const DeleteScheduledActionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteScheduledActionResponse",
}) as any as S.Schema<DeleteScheduledActionResponse>;
export interface DeleteSnapshotCopyGrantMessage {
  SnapshotCopyGrantName?: string;
}
export const DeleteSnapshotCopyGrantMessage = S.suspend(() =>
  S.Struct({ SnapshotCopyGrantName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSnapshotCopyGrantMessage",
}) as any as S.Schema<DeleteSnapshotCopyGrantMessage>;
export interface DeleteSnapshotCopyGrantResponse {}
export const DeleteSnapshotCopyGrantResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSnapshotCopyGrantResponse",
}) as any as S.Schema<DeleteSnapshotCopyGrantResponse>;
export interface DeleteSnapshotScheduleMessage {
  ScheduleIdentifier?: string;
}
export const DeleteSnapshotScheduleMessage = S.suspend(() =>
  S.Struct({ ScheduleIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSnapshotScheduleMessage",
}) as any as S.Schema<DeleteSnapshotScheduleMessage>;
export interface DeleteSnapshotScheduleResponse {}
export const DeleteSnapshotScheduleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSnapshotScheduleResponse",
}) as any as S.Schema<DeleteSnapshotScheduleResponse>;
export interface DeleteTagsMessage {
  ResourceName?: string;
  TagKeys?: string[];
}
export const DeleteTagsMessage = S.suspend(() =>
  S.Struct({
    ResourceName: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTagsMessage",
}) as any as S.Schema<DeleteTagsMessage>;
export interface DeleteTagsResponse {}
export const DeleteTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTagsResponse",
}) as any as S.Schema<DeleteTagsResponse>;
export interface DeleteUsageLimitMessage {
  UsageLimitId?: string;
}
export const DeleteUsageLimitMessage = S.suspend(() =>
  S.Struct({ UsageLimitId: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUsageLimitMessage",
}) as any as S.Schema<DeleteUsageLimitMessage>;
export interface DeleteUsageLimitResponse {}
export const DeleteUsageLimitResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUsageLimitResponse",
}) as any as S.Schema<DeleteUsageLimitResponse>;
export interface DescribeAccountAttributesMessage {
  AttributeNames?: string[];
}
export const DescribeAccountAttributesMessage = S.suspend(() =>
  S.Struct({ AttributeNames: S.optional(AttributeNameList) }).pipe(
    T.all(
      ns,
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
export interface DescribeAuthenticationProfilesMessage {
  AuthenticationProfileName?: string;
}
export const DescribeAuthenticationProfilesMessage = S.suspend(() =>
  S.Struct({ AuthenticationProfileName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAuthenticationProfilesMessage",
}) as any as S.Schema<DescribeAuthenticationProfilesMessage>;
export interface DescribeClusterDbRevisionsMessage {
  ClusterIdentifier?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeClusterDbRevisionsMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
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
  identifier: "DescribeClusterDbRevisionsMessage",
}) as any as S.Schema<DescribeClusterDbRevisionsMessage>;
export interface DescribeClusterParameterGroupsMessage {
  ParameterGroupName?: string;
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeClusterParameterGroupsMessage = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterParameterGroupsMessage",
}) as any as S.Schema<DescribeClusterParameterGroupsMessage>;
export interface DescribeClusterParametersMessage {
  ParameterGroupName?: string;
  Source?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeClusterParametersMessage = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
    Source: S.optional(S.String),
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
  identifier: "DescribeClusterParametersMessage",
}) as any as S.Schema<DescribeClusterParametersMessage>;
export interface DescribeClustersMessage {
  ClusterIdentifier?: string;
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeClustersMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClustersMessage",
}) as any as S.Schema<DescribeClustersMessage>;
export interface DescribeClusterSecurityGroupsMessage {
  ClusterSecurityGroupName?: string;
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeClusterSecurityGroupsMessage = S.suspend(() =>
  S.Struct({
    ClusterSecurityGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterSecurityGroupsMessage",
}) as any as S.Schema<DescribeClusterSecurityGroupsMessage>;
export interface DescribeClusterSubnetGroupsMessage {
  ClusterSubnetGroupName?: string;
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeClusterSubnetGroupsMessage = S.suspend(() =>
  S.Struct({
    ClusterSubnetGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterSubnetGroupsMessage",
}) as any as S.Schema<DescribeClusterSubnetGroupsMessage>;
export interface DescribeClusterTracksMessage {
  MaintenanceTrackName?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeClusterTracksMessage = S.suspend(() =>
  S.Struct({
    MaintenanceTrackName: S.optional(S.String),
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
  identifier: "DescribeClusterTracksMessage",
}) as any as S.Schema<DescribeClusterTracksMessage>;
export interface DescribeClusterVersionsMessage {
  ClusterVersion?: string;
  ClusterParameterGroupFamily?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeClusterVersionsMessage = S.suspend(() =>
  S.Struct({
    ClusterVersion: S.optional(S.String),
    ClusterParameterGroupFamily: S.optional(S.String),
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
  identifier: "DescribeClusterVersionsMessage",
}) as any as S.Schema<DescribeClusterVersionsMessage>;
export interface DescribeCustomDomainAssociationsMessage {
  CustomDomainName?: string;
  CustomDomainCertificateArn?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeCustomDomainAssociationsMessage = S.suspend(() =>
  S.Struct({
    CustomDomainName: S.optional(S.String),
    CustomDomainCertificateArn: S.optional(S.String),
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
  identifier: "DescribeCustomDomainAssociationsMessage",
}) as any as S.Schema<DescribeCustomDomainAssociationsMessage>;
export interface DescribeDataSharesMessage {
  DataShareArn?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDataSharesMessage = S.suspend(() =>
  S.Struct({
    DataShareArn: S.optional(S.String),
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
  identifier: "DescribeDataSharesMessage",
}) as any as S.Schema<DescribeDataSharesMessage>;
export interface DescribeDataSharesForConsumerMessage {
  ConsumerArn?: string;
  Status?: DataShareStatusForConsumer;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDataSharesForConsumerMessage = S.suspend(() =>
  S.Struct({
    ConsumerArn: S.optional(S.String),
    Status: S.optional(DataShareStatusForConsumer),
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
  identifier: "DescribeDataSharesForConsumerMessage",
}) as any as S.Schema<DescribeDataSharesForConsumerMessage>;
export interface DescribeDataSharesForProducerMessage {
  ProducerArn?: string;
  Status?: DataShareStatusForProducer;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDataSharesForProducerMessage = S.suspend(() =>
  S.Struct({
    ProducerArn: S.optional(S.String),
    Status: S.optional(DataShareStatusForProducer),
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
  identifier: "DescribeDataSharesForProducerMessage",
}) as any as S.Schema<DescribeDataSharesForProducerMessage>;
export interface DescribeDefaultClusterParametersMessage {
  ParameterGroupFamily?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeDefaultClusterParametersMessage = S.suspend(() =>
  S.Struct({
    ParameterGroupFamily: S.optional(S.String),
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
  identifier: "DescribeDefaultClusterParametersMessage",
}) as any as S.Schema<DescribeDefaultClusterParametersMessage>;
export interface DescribeEndpointAccessMessage {
  ClusterIdentifier?: string;
  ResourceOwner?: string;
  EndpointName?: string;
  VpcId?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEndpointAccessMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    EndpointName: S.optional(S.String),
    VpcId: S.optional(S.String),
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
  identifier: "DescribeEndpointAccessMessage",
}) as any as S.Schema<DescribeEndpointAccessMessage>;
export interface DescribeEndpointAuthorizationMessage {
  ClusterIdentifier?: string;
  Account?: string;
  Grantee?: boolean;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEndpointAuthorizationMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    Account: S.optional(S.String),
    Grantee: S.optional(S.Boolean),
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
  identifier: "DescribeEndpointAuthorizationMessage",
}) as any as S.Schema<DescribeEndpointAuthorizationMessage>;
export interface DescribeEventCategoriesMessage {
  SourceType?: string;
}
export const DescribeEventCategoriesMessage = S.suspend(() =>
  S.Struct({ SourceType: S.optional(S.String) }).pipe(
    T.all(
      ns,
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
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeEventSubscriptionsMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
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
export interface DescribeHsmClientCertificatesMessage {
  HsmClientCertificateIdentifier?: string;
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeHsmClientCertificatesMessage = S.suspend(() =>
  S.Struct({
    HsmClientCertificateIdentifier: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeHsmClientCertificatesMessage",
}) as any as S.Schema<DescribeHsmClientCertificatesMessage>;
export interface DescribeHsmConfigurationsMessage {
  HsmConfigurationIdentifier?: string;
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeHsmConfigurationsMessage = S.suspend(() =>
  S.Struct({
    HsmConfigurationIdentifier: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeHsmConfigurationsMessage",
}) as any as S.Schema<DescribeHsmConfigurationsMessage>;
export interface DescribeInboundIntegrationsMessage {
  IntegrationArn?: string;
  TargetArn?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeInboundIntegrationsMessage = S.suspend(() =>
  S.Struct({
    IntegrationArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
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
  identifier: "DescribeInboundIntegrationsMessage",
}) as any as S.Schema<DescribeInboundIntegrationsMessage>;
export interface DescribeLoggingStatusMessage {
  ClusterIdentifier?: string;
}
export const DescribeLoggingStatusMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLoggingStatusMessage",
}) as any as S.Schema<DescribeLoggingStatusMessage>;
export interface DescribeOrderableClusterOptionsMessage {
  ClusterVersion?: string;
  NodeType?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeOrderableClusterOptionsMessage = S.suspend(() =>
  S.Struct({
    ClusterVersion: S.optional(S.String),
    NodeType: S.optional(S.String),
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
  identifier: "DescribeOrderableClusterOptionsMessage",
}) as any as S.Schema<DescribeOrderableClusterOptionsMessage>;
export interface DescribePartnersInputMessage {
  AccountId?: string;
  ClusterIdentifier?: string;
  DatabaseName?: string;
  PartnerName?: string;
}
export const DescribePartnersInputMessage = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    PartnerName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePartnersInputMessage",
}) as any as S.Schema<DescribePartnersInputMessage>;
export interface DescribeRedshiftIdcApplicationsMessage {
  RedshiftIdcApplicationArn?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeRedshiftIdcApplicationsMessage = S.suspend(() =>
  S.Struct({
    RedshiftIdcApplicationArn: S.optional(S.String),
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
  identifier: "DescribeRedshiftIdcApplicationsMessage",
}) as any as S.Schema<DescribeRedshiftIdcApplicationsMessage>;
export interface DescribeReservedNodeExchangeStatusInputMessage {
  ReservedNodeId?: string;
  ReservedNodeExchangeRequestId?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeReservedNodeExchangeStatusInputMessage = S.suspend(() =>
  S.Struct({
    ReservedNodeId: S.optional(S.String),
    ReservedNodeExchangeRequestId: S.optional(S.String),
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
  identifier: "DescribeReservedNodeExchangeStatusInputMessage",
}) as any as S.Schema<DescribeReservedNodeExchangeStatusInputMessage>;
export interface DescribeReservedNodeOfferingsMessage {
  ReservedNodeOfferingId?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeReservedNodeOfferingsMessage = S.suspend(() =>
  S.Struct({
    ReservedNodeOfferingId: S.optional(S.String),
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
  identifier: "DescribeReservedNodeOfferingsMessage",
}) as any as S.Schema<DescribeReservedNodeOfferingsMessage>;
export interface DescribeReservedNodesMessage {
  ReservedNodeId?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeReservedNodesMessage = S.suspend(() =>
  S.Struct({
    ReservedNodeId: S.optional(S.String),
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
  identifier: "DescribeReservedNodesMessage",
}) as any as S.Schema<DescribeReservedNodesMessage>;
export interface DescribeResizeMessage {
  ClusterIdentifier?: string;
}
export const DescribeResizeMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeResizeMessage",
}) as any as S.Schema<DescribeResizeMessage>;
export interface DescribeSnapshotCopyGrantsMessage {
  SnapshotCopyGrantName?: string;
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeSnapshotCopyGrantsMessage = S.suspend(() =>
  S.Struct({
    SnapshotCopyGrantName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSnapshotCopyGrantsMessage",
}) as any as S.Schema<DescribeSnapshotCopyGrantsMessage>;
export interface DescribeSnapshotSchedulesMessage {
  ClusterIdentifier?: string;
  ScheduleIdentifier?: string;
  TagKeys?: string[];
  TagValues?: string[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeSnapshotSchedulesMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    ScheduleIdentifier: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
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
  identifier: "DescribeSnapshotSchedulesMessage",
}) as any as S.Schema<DescribeSnapshotSchedulesMessage>;
export interface CustomerStorageMessage {
  TotalBackupSizeInMegaBytes?: number;
  TotalProvisionedStorageInMegaBytes?: number;
}
export const CustomerStorageMessage = S.suspend(() =>
  S.Struct({
    TotalBackupSizeInMegaBytes: S.optional(S.Number),
    TotalProvisionedStorageInMegaBytes: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "CustomerStorageMessage",
}) as any as S.Schema<CustomerStorageMessage>;
export interface DescribeTableRestoreStatusMessage {
  ClusterIdentifier?: string;
  TableRestoreRequestId?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeTableRestoreStatusMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    TableRestoreRequestId: S.optional(S.String),
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
  identifier: "DescribeTableRestoreStatusMessage",
}) as any as S.Schema<DescribeTableRestoreStatusMessage>;
export interface DescribeTagsMessage {
  ResourceName?: string;
  ResourceType?: string;
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeTagsMessage = S.suspend(() =>
  S.Struct({
    ResourceName: S.optional(S.String),
    ResourceType: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTagsMessage",
}) as any as S.Schema<DescribeTagsMessage>;
export interface DescribeUsageLimitsMessage {
  UsageLimitId?: string;
  ClusterIdentifier?: string;
  FeatureType?: UsageLimitFeatureType;
  MaxRecords?: number;
  Marker?: string;
  TagKeys?: string[];
  TagValues?: string[];
}
export const DescribeUsageLimitsMessage = S.suspend(() =>
  S.Struct({
    UsageLimitId: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    FeatureType: S.optional(UsageLimitFeatureType),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeUsageLimitsMessage",
}) as any as S.Schema<DescribeUsageLimitsMessage>;
export interface DisableLoggingMessage {
  ClusterIdentifier?: string;
}
export const DisableLoggingMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableLoggingMessage",
}) as any as S.Schema<DisableLoggingMessage>;
export interface DisableSnapshotCopyMessage {
  ClusterIdentifier?: string;
}
export const DisableSnapshotCopyMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableSnapshotCopyMessage",
}) as any as S.Schema<DisableSnapshotCopyMessage>;
export interface DisassociateDataShareConsumerMessage {
  DataShareArn?: string;
  DisassociateEntireAccount?: boolean;
  ConsumerArn?: string;
  ConsumerRegion?: string;
}
export const DisassociateDataShareConsumerMessage = S.suspend(() =>
  S.Struct({
    DataShareArn: S.optional(S.String),
    DisassociateEntireAccount: S.optional(S.Boolean),
    ConsumerArn: S.optional(S.String),
    ConsumerRegion: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateDataShareConsumerMessage",
}) as any as S.Schema<DisassociateDataShareConsumerMessage>;
export interface EnableLoggingMessage {
  ClusterIdentifier?: string;
  BucketName?: string;
  S3KeyPrefix?: string;
  LogDestinationType?: LogDestinationType;
  LogExports?: string[];
}
export const EnableLoggingMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    LogDestinationType: S.optional(LogDestinationType),
    LogExports: S.optional(LogTypeList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableLoggingMessage",
}) as any as S.Schema<EnableLoggingMessage>;
export interface EnableSnapshotCopyMessage {
  ClusterIdentifier?: string;
  DestinationRegion?: string;
  RetentionPeriod?: number;
  SnapshotCopyGrantName?: string;
  ManualSnapshotRetentionPeriod?: number;
}
export const EnableSnapshotCopyMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    DestinationRegion: S.optional(S.String),
    RetentionPeriod: S.optional(S.Number),
    SnapshotCopyGrantName: S.optional(S.String),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableSnapshotCopyMessage",
}) as any as S.Schema<EnableSnapshotCopyMessage>;
export interface FailoverPrimaryComputeInputMessage {
  ClusterIdentifier?: string;
}
export const FailoverPrimaryComputeInputMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "FailoverPrimaryComputeInputMessage",
}) as any as S.Schema<FailoverPrimaryComputeInputMessage>;
export interface GetClusterCredentialsMessage {
  DbUser?: string;
  DbName?: string;
  ClusterIdentifier?: string;
  DurationSeconds?: number;
  AutoCreate?: boolean;
  DbGroups?: string[];
  CustomDomainName?: string;
}
export const GetClusterCredentialsMessage = S.suspend(() =>
  S.Struct({
    DbUser: S.optional(S.String),
    DbName: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    DurationSeconds: S.optional(S.Number),
    AutoCreate: S.optional(S.Boolean),
    DbGroups: S.optional(DbGroupList),
    CustomDomainName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClusterCredentialsMessage",
}) as any as S.Schema<GetClusterCredentialsMessage>;
export interface GetClusterCredentialsWithIAMMessage {
  DbName?: string;
  ClusterIdentifier?: string;
  DurationSeconds?: number;
  CustomDomainName?: string;
}
export const GetClusterCredentialsWithIAMMessage = S.suspend(() =>
  S.Struct({
    DbName: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    DurationSeconds: S.optional(S.Number),
    CustomDomainName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClusterCredentialsWithIAMMessage",
}) as any as S.Schema<GetClusterCredentialsWithIAMMessage>;
export interface GetIdentityCenterAuthTokenRequest {
  ClusterIds?: string[];
}
export const GetIdentityCenterAuthTokenRequest = S.suspend(() =>
  S.Struct({ ClusterIds: S.optional(ClusterIdentifierList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdentityCenterAuthTokenRequest",
}) as any as S.Schema<GetIdentityCenterAuthTokenRequest>;
export interface GetReservedNodeExchangeConfigurationOptionsInputMessage {
  ActionType?: ReservedNodeExchangeActionType;
  ClusterIdentifier?: string;
  SnapshotIdentifier?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const GetReservedNodeExchangeConfigurationOptionsInputMessage =
  S.suspend(() =>
    S.Struct({
      ActionType: S.optional(ReservedNodeExchangeActionType),
      ClusterIdentifier: S.optional(S.String),
      SnapshotIdentifier: S.optional(S.String),
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
    identifier: "GetReservedNodeExchangeConfigurationOptionsInputMessage",
  }) as any as S.Schema<GetReservedNodeExchangeConfigurationOptionsInputMessage>;
export interface GetReservedNodeExchangeOfferingsInputMessage {
  ReservedNodeId?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const GetReservedNodeExchangeOfferingsInputMessage = S.suspend(() =>
  S.Struct({
    ReservedNodeId: S.optional(S.String),
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
  identifier: "GetReservedNodeExchangeOfferingsInputMessage",
}) as any as S.Schema<GetReservedNodeExchangeOfferingsInputMessage>;
export interface GetResourcePolicyMessage {
  ResourceArn?: string;
}
export const GetResourcePolicyMessage = S.suspend(() =>
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
  identifier: "GetResourcePolicyMessage",
}) as any as S.Schema<GetResourcePolicyMessage>;
export interface ListRecommendationsMessage {
  ClusterIdentifier?: string;
  NamespaceArn?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const ListRecommendationsMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    NamespaceArn: S.optional(S.String),
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
  identifier: "ListRecommendationsMessage",
}) as any as S.Schema<ListRecommendationsMessage>;
export interface ModifyAquaInputMessage {
  ClusterIdentifier?: string;
  AquaConfigurationStatus?: AquaConfigurationStatus;
}
export const ModifyAquaInputMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    AquaConfigurationStatus: S.optional(AquaConfigurationStatus),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyAquaInputMessage",
}) as any as S.Schema<ModifyAquaInputMessage>;
export interface ModifyAuthenticationProfileMessage {
  AuthenticationProfileName?: string;
  AuthenticationProfileContent?: string;
}
export const ModifyAuthenticationProfileMessage = S.suspend(() =>
  S.Struct({
    AuthenticationProfileName: S.optional(S.String),
    AuthenticationProfileContent: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyAuthenticationProfileMessage",
}) as any as S.Schema<ModifyAuthenticationProfileMessage>;
export interface ModifyClusterMessage {
  ClusterIdentifier?: string;
  ClusterType?: string;
  NodeType?: string;
  NumberOfNodes?: number;
  ClusterSecurityGroups?: string[];
  VpcSecurityGroupIds?: string[];
  MasterUserPassword?: string | redacted.Redacted<string>;
  ClusterParameterGroupName?: string;
  AutomatedSnapshotRetentionPeriod?: number;
  ManualSnapshotRetentionPeriod?: number;
  PreferredMaintenanceWindow?: string;
  ClusterVersion?: string;
  AllowVersionUpgrade?: boolean;
  HsmClientCertificateIdentifier?: string;
  HsmConfigurationIdentifier?: string;
  NewClusterIdentifier?: string;
  PubliclyAccessible?: boolean;
  ElasticIp?: string;
  EnhancedVpcRouting?: boolean;
  MaintenanceTrackName?: string;
  Encrypted?: boolean;
  KmsKeyId?: string;
  AvailabilityZoneRelocation?: boolean;
  AvailabilityZone?: string;
  Port?: number;
  ManageMasterPassword?: boolean;
  MasterPasswordSecretKmsKeyId?: string;
  IpAddressType?: string;
  MultiAZ?: boolean;
}
export const ModifyClusterMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    ClusterType: S.optional(S.String),
    NodeType: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    ClusterSecurityGroups: S.optional(ClusterSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    MasterUserPassword: S.optional(SensitiveString),
    ClusterParameterGroupName: S.optional(S.String),
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    PreferredMaintenanceWindow: S.optional(S.String),
    ClusterVersion: S.optional(S.String),
    AllowVersionUpgrade: S.optional(S.Boolean),
    HsmClientCertificateIdentifier: S.optional(S.String),
    HsmConfigurationIdentifier: S.optional(S.String),
    NewClusterIdentifier: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    ElasticIp: S.optional(S.String),
    EnhancedVpcRouting: S.optional(S.Boolean),
    MaintenanceTrackName: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    AvailabilityZoneRelocation: S.optional(S.Boolean),
    AvailabilityZone: S.optional(S.String),
    Port: S.optional(S.Number),
    ManageMasterPassword: S.optional(S.Boolean),
    MasterPasswordSecretKmsKeyId: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyClusterMessage",
}) as any as S.Schema<ModifyClusterMessage>;
export interface ModifyClusterDbRevisionMessage {
  ClusterIdentifier?: string;
  RevisionTarget?: string;
}
export const ModifyClusterDbRevisionMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    RevisionTarget: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyClusterDbRevisionMessage",
}) as any as S.Schema<ModifyClusterDbRevisionMessage>;
export interface ModifyClusterIamRolesMessage {
  ClusterIdentifier?: string;
  AddIamRoles?: string[];
  RemoveIamRoles?: string[];
  DefaultIamRoleArn?: string;
}
export const ModifyClusterIamRolesMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    AddIamRoles: S.optional(IamRoleArnList),
    RemoveIamRoles: S.optional(IamRoleArnList),
    DefaultIamRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyClusterIamRolesMessage",
}) as any as S.Schema<ModifyClusterIamRolesMessage>;
export interface ModifyClusterMaintenanceMessage {
  ClusterIdentifier?: string;
  DeferMaintenance?: boolean;
  DeferMaintenanceIdentifier?: string;
  DeferMaintenanceStartTime?: Date;
  DeferMaintenanceEndTime?: Date;
  DeferMaintenanceDuration?: number;
}
export const ModifyClusterMaintenanceMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    DeferMaintenance: S.optional(S.Boolean),
    DeferMaintenanceIdentifier: S.optional(S.String),
    DeferMaintenanceStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    DeferMaintenanceEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    DeferMaintenanceDuration: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyClusterMaintenanceMessage",
}) as any as S.Schema<ModifyClusterMaintenanceMessage>;
export interface ModifyClusterSnapshotMessage {
  SnapshotIdentifier?: string;
  ManualSnapshotRetentionPeriod?: number;
  Force?: boolean;
}
export const ModifyClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    SnapshotIdentifier: S.optional(S.String),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    Force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyClusterSnapshotMessage",
}) as any as S.Schema<ModifyClusterSnapshotMessage>;
export interface ModifyClusterSnapshotScheduleMessage {
  ClusterIdentifier?: string;
  ScheduleIdentifier?: string;
  DisassociateSchedule?: boolean;
}
export const ModifyClusterSnapshotScheduleMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    ScheduleIdentifier: S.optional(S.String),
    DisassociateSchedule: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyClusterSnapshotScheduleMessage",
}) as any as S.Schema<ModifyClusterSnapshotScheduleMessage>;
export interface ModifyClusterSnapshotScheduleResponse {}
export const ModifyClusterSnapshotScheduleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ModifyClusterSnapshotScheduleResponse",
}) as any as S.Schema<ModifyClusterSnapshotScheduleResponse>;
export interface ModifyClusterSubnetGroupMessage {
  ClusterSubnetGroupName?: string;
  Description?: string;
  SubnetIds?: string[];
}
export const ModifyClusterSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    ClusterSubnetGroupName: S.optional(S.String),
    Description: S.optional(S.String),
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
  identifier: "ModifyClusterSubnetGroupMessage",
}) as any as S.Schema<ModifyClusterSubnetGroupMessage>;
export interface ModifyCustomDomainAssociationMessage {
  CustomDomainName?: string;
  CustomDomainCertificateArn?: string;
  ClusterIdentifier?: string;
}
export const ModifyCustomDomainAssociationMessage = S.suspend(() =>
  S.Struct({
    CustomDomainName: S.optional(S.String),
    CustomDomainCertificateArn: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyCustomDomainAssociationMessage",
}) as any as S.Schema<ModifyCustomDomainAssociationMessage>;
export interface ModifyEndpointAccessMessage {
  EndpointName?: string;
  VpcSecurityGroupIds?: string[];
}
export const ModifyEndpointAccessMessage = S.suspend(() =>
  S.Struct({
    EndpointName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyEndpointAccessMessage",
}) as any as S.Schema<ModifyEndpointAccessMessage>;
export interface ModifyEventSubscriptionMessage {
  SubscriptionName?: string;
  SnsTopicArn?: string;
  SourceType?: string;
  SourceIds?: string[];
  EventCategories?: string[];
  Severity?: string;
  Enabled?: boolean;
}
export const ModifyEventSubscriptionMessage = S.suspend(() =>
  S.Struct({
    SubscriptionName: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    SourceType: S.optional(S.String),
    SourceIds: S.optional(SourceIdsList),
    EventCategories: S.optional(EventCategoriesList),
    Severity: S.optional(S.String),
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
export interface ModifyIntegrationMessage {
  IntegrationArn?: string;
  Description?: string;
  IntegrationName?: string;
}
export const ModifyIntegrationMessage = S.suspend(() =>
  S.Struct({
    IntegrationArn: S.optional(S.String),
    Description: S.optional(S.String),
    IntegrationName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
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
export interface ModifyLakehouseConfigurationMessage {
  ClusterIdentifier?: string;
  LakehouseRegistration?: LakehouseRegistration;
  CatalogName?: string;
  LakehouseIdcRegistration?: LakehouseIdcRegistration;
  LakehouseIdcApplicationArn?: string;
  DryRun?: boolean;
}
export const ModifyLakehouseConfigurationMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    LakehouseRegistration: S.optional(LakehouseRegistration),
    CatalogName: S.optional(S.String),
    LakehouseIdcRegistration: S.optional(LakehouseIdcRegistration),
    LakehouseIdcApplicationArn: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyLakehouseConfigurationMessage",
}) as any as S.Schema<ModifyLakehouseConfigurationMessage>;
export type AuthorizedAudienceList = string[];
export const AuthorizedAudienceList = S.Array(S.String);
export interface AuthorizedTokenIssuer {
  TrustedTokenIssuerArn?: string;
  AuthorizedAudiencesList?: string[];
}
export const AuthorizedTokenIssuer = S.suspend(() =>
  S.Struct({
    TrustedTokenIssuerArn: S.optional(S.String),
    AuthorizedAudiencesList: S.optional(AuthorizedAudienceList),
  }),
).annotations({
  identifier: "AuthorizedTokenIssuer",
}) as any as S.Schema<AuthorizedTokenIssuer>;
export type AuthorizedTokenIssuerList = AuthorizedTokenIssuer[];
export const AuthorizedTokenIssuerList = S.Array(AuthorizedTokenIssuer);
export type ServiceAuthorization = "Enabled" | "Disabled";
export const ServiceAuthorization = S.Literal("Enabled", "Disabled");
export interface LakeFormationQuery {
  Authorization?: ServiceAuthorization;
}
export const LakeFormationQuery = S.suspend(() =>
  S.Struct({ Authorization: S.optional(ServiceAuthorization) }),
).annotations({
  identifier: "LakeFormationQuery",
}) as any as S.Schema<LakeFormationQuery>;
export type LakeFormationScopeUnion = {
  LakeFormationQuery: LakeFormationQuery;
};
export const LakeFormationScopeUnion = S.Union(
  S.Struct({ LakeFormationQuery: LakeFormationQuery }),
);
export type LakeFormationServiceIntegrations = LakeFormationScopeUnion[];
export const LakeFormationServiceIntegrations = S.Array(
  LakeFormationScopeUnion,
);
export interface ReadWriteAccess {
  Authorization?: ServiceAuthorization;
}
export const ReadWriteAccess = S.suspend(() =>
  S.Struct({ Authorization: S.optional(ServiceAuthorization) }),
).annotations({
  identifier: "ReadWriteAccess",
}) as any as S.Schema<ReadWriteAccess>;
export type S3AccessGrantsScopeUnion = { ReadWriteAccess: ReadWriteAccess };
export const S3AccessGrantsScopeUnion = S.Union(
  S.Struct({ ReadWriteAccess: ReadWriteAccess }),
);
export type S3AccessGrantsServiceIntegrations = S3AccessGrantsScopeUnion[];
export const S3AccessGrantsServiceIntegrations = S.Array(
  S3AccessGrantsScopeUnion,
);
export interface Connect {
  Authorization?: ServiceAuthorization;
}
export const Connect = S.suspend(() =>
  S.Struct({ Authorization: S.optional(ServiceAuthorization) }),
).annotations({ identifier: "Connect" }) as any as S.Schema<Connect>;
export type RedshiftScopeUnion = { Connect: Connect };
export const RedshiftScopeUnion = S.Union(S.Struct({ Connect: Connect }));
export type RedshiftServiceIntegrations = RedshiftScopeUnion[];
export const RedshiftServiceIntegrations = S.Array(RedshiftScopeUnion);
export type ServiceIntegrationsUnion =
  | { LakeFormation: LakeFormationScopeUnion[] }
  | { S3AccessGrants: S3AccessGrantsScopeUnion[] }
  | { Redshift: RedshiftScopeUnion[] };
export const ServiceIntegrationsUnion = S.Union(
  S.Struct({ LakeFormation: LakeFormationServiceIntegrations }),
  S.Struct({ S3AccessGrants: S3AccessGrantsServiceIntegrations }),
  S.Struct({ Redshift: RedshiftServiceIntegrations }),
);
export type ServiceIntegrationList = ServiceIntegrationsUnion[];
export const ServiceIntegrationList = S.Array(ServiceIntegrationsUnion);
export interface ModifyRedshiftIdcApplicationMessage {
  RedshiftIdcApplicationArn?: string;
  IdentityNamespace?: string;
  IamRoleArn?: string;
  IdcDisplayName?: string;
  AuthorizedTokenIssuerList?: AuthorizedTokenIssuer[];
  ServiceIntegrations?: ServiceIntegrationsUnion[];
}
export const ModifyRedshiftIdcApplicationMessage = S.suspend(() =>
  S.Struct({
    RedshiftIdcApplicationArn: S.optional(S.String),
    IdentityNamespace: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
    IdcDisplayName: S.optional(S.String),
    AuthorizedTokenIssuerList: S.optional(AuthorizedTokenIssuerList),
    ServiceIntegrations: S.optional(ServiceIntegrationList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyRedshiftIdcApplicationMessage",
}) as any as S.Schema<ModifyRedshiftIdcApplicationMessage>;
export interface ResizeClusterMessage {
  ClusterIdentifier?: string;
  ClusterType?: string;
  NodeType?: string;
  NumberOfNodes?: number;
  Classic?: boolean;
  ReservedNodeId?: string;
  TargetReservedNodeOfferingId?: string;
}
export const ResizeClusterMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    ClusterType: S.optional(S.String),
    NodeType: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    Classic: S.optional(S.Boolean),
    ReservedNodeId: S.optional(S.String),
    TargetReservedNodeOfferingId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResizeClusterMessage",
}) as any as S.Schema<ResizeClusterMessage>;
export interface PauseClusterMessage {
  ClusterIdentifier?: string;
}
export const PauseClusterMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PauseClusterMessage",
}) as any as S.Schema<PauseClusterMessage>;
export interface ResumeClusterMessage {
  ClusterIdentifier?: string;
}
export const ResumeClusterMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResumeClusterMessage",
}) as any as S.Schema<ResumeClusterMessage>;
export interface ScheduledActionType {
  ResizeCluster?: ResizeClusterMessage;
  PauseCluster?: PauseClusterMessage;
  ResumeCluster?: ResumeClusterMessage;
}
export const ScheduledActionType = S.suspend(() =>
  S.Struct({
    ResizeCluster: S.optional(ResizeClusterMessage),
    PauseCluster: S.optional(PauseClusterMessage),
    ResumeCluster: S.optional(ResumeClusterMessage),
  }),
).annotations({
  identifier: "ScheduledActionType",
}) as any as S.Schema<ScheduledActionType>;
export interface ModifyScheduledActionMessage {
  ScheduledActionName?: string;
  TargetAction?: ScheduledActionType;
  Schedule?: string;
  IamRole?: string;
  ScheduledActionDescription?: string;
  StartTime?: Date;
  EndTime?: Date;
  Enable?: boolean;
}
export const ModifyScheduledActionMessage = S.suspend(() =>
  S.Struct({
    ScheduledActionName: S.optional(S.String),
    TargetAction: S.optional(ScheduledActionType),
    Schedule: S.optional(S.String),
    IamRole: S.optional(S.String),
    ScheduledActionDescription: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Enable: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyScheduledActionMessage",
}) as any as S.Schema<ModifyScheduledActionMessage>;
export interface ModifySnapshotCopyRetentionPeriodMessage {
  ClusterIdentifier?: string;
  RetentionPeriod?: number;
  Manual?: boolean;
}
export const ModifySnapshotCopyRetentionPeriodMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    RetentionPeriod: S.optional(S.Number),
    Manual: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifySnapshotCopyRetentionPeriodMessage",
}) as any as S.Schema<ModifySnapshotCopyRetentionPeriodMessage>;
export interface ModifySnapshotScheduleMessage {
  ScheduleIdentifier?: string;
  ScheduleDefinitions?: string[];
}
export const ModifySnapshotScheduleMessage = S.suspend(() =>
  S.Struct({
    ScheduleIdentifier: S.optional(S.String),
    ScheduleDefinitions: S.optional(ScheduleDefinitionList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifySnapshotScheduleMessage",
}) as any as S.Schema<ModifySnapshotScheduleMessage>;
export interface ModifyUsageLimitMessage {
  UsageLimitId?: string;
  Amount?: number;
  BreachAction?: UsageLimitBreachAction;
}
export const ModifyUsageLimitMessage = S.suspend(() =>
  S.Struct({
    UsageLimitId: S.optional(S.String),
    Amount: S.optional(S.Number),
    BreachAction: S.optional(UsageLimitBreachAction),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyUsageLimitMessage",
}) as any as S.Schema<ModifyUsageLimitMessage>;
export interface PurchaseReservedNodeOfferingMessage {
  ReservedNodeOfferingId?: string;
  NodeCount?: number;
}
export const PurchaseReservedNodeOfferingMessage = S.suspend(() =>
  S.Struct({
    ReservedNodeOfferingId: S.optional(S.String),
    NodeCount: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PurchaseReservedNodeOfferingMessage",
}) as any as S.Schema<PurchaseReservedNodeOfferingMessage>;
export interface PutResourcePolicyMessage {
  ResourceArn?: string;
  Policy?: string;
}
export const PutResourcePolicyMessage = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Policy: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyMessage",
}) as any as S.Schema<PutResourcePolicyMessage>;
export interface RebootClusterMessage {
  ClusterIdentifier?: string;
}
export const RebootClusterMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RebootClusterMessage",
}) as any as S.Schema<RebootClusterMessage>;
export interface ServerlessIdentifier {
  NamespaceIdentifier?: string;
  WorkgroupIdentifier?: string;
}
export const ServerlessIdentifier = S.suspend(() =>
  S.Struct({
    NamespaceIdentifier: S.optional(S.String),
    WorkgroupIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "ServerlessIdentifier",
}) as any as S.Schema<ServerlessIdentifier>;
export interface ProvisionedIdentifier {
  ClusterIdentifier?: string;
}
export const ProvisionedIdentifier = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "ProvisionedIdentifier",
}) as any as S.Schema<ProvisionedIdentifier>;
export type NamespaceIdentifierUnion =
  | { ServerlessIdentifier: ServerlessIdentifier }
  | { ProvisionedIdentifier: ProvisionedIdentifier };
export const NamespaceIdentifierUnion = S.Union(
  S.Struct({ ServerlessIdentifier: ServerlessIdentifier }),
  S.Struct({ ProvisionedIdentifier: ProvisionedIdentifier }),
);
export interface RegisterNamespaceInputMessage {
  NamespaceIdentifier?: NamespaceIdentifierUnion;
  ConsumerIdentifiers?: string[];
}
export const RegisterNamespaceInputMessage = S.suspend(() =>
  S.Struct({
    NamespaceIdentifier: S.optional(NamespaceIdentifierUnion),
    ConsumerIdentifiers: S.optional(ConsumerIdentifierList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterNamespaceInputMessage",
}) as any as S.Schema<RegisterNamespaceInputMessage>;
export interface RejectDataShareMessage {
  DataShareArn?: string;
}
export const RejectDataShareMessage = S.suspend(() =>
  S.Struct({ DataShareArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectDataShareMessage",
}) as any as S.Schema<RejectDataShareMessage>;
export type ParameterApplyType = "static" | "dynamic";
export const ParameterApplyType = S.Literal("static", "dynamic");
export interface Parameter {
  ParameterName?: string;
  ParameterValue?: string;
  Description?: string;
  Source?: string;
  DataType?: string;
  AllowedValues?: string;
  ApplyType?: ParameterApplyType;
  IsModifiable?: boolean;
  MinimumEngineVersion?: string;
}
export const Parameter = S.suspend(() =>
  S.Struct({
    ParameterName: S.optional(S.String),
    ParameterValue: S.optional(S.String),
    Description: S.optional(S.String),
    Source: S.optional(S.String),
    DataType: S.optional(S.String),
    AllowedValues: S.optional(S.String),
    ApplyType: S.optional(ParameterApplyType),
    IsModifiable: S.optional(S.Boolean),
    MinimumEngineVersion: S.optional(S.String),
  }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type ParametersList = Parameter[];
export const ParametersList = S.Array(
  Parameter.pipe(T.XmlName("Parameter")).annotations({
    identifier: "Parameter",
  }),
);
export interface ResetClusterParameterGroupMessage {
  ParameterGroupName?: string;
  ResetAllParameters?: boolean;
  Parameters?: Parameter[];
}
export const ResetClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
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
  identifier: "ResetClusterParameterGroupMessage",
}) as any as S.Schema<ResetClusterParameterGroupMessage>;
export interface RestoreFromClusterSnapshotMessage {
  ClusterIdentifier?: string;
  SnapshotIdentifier?: string;
  SnapshotArn?: string;
  SnapshotClusterIdentifier?: string;
  Port?: number;
  AvailabilityZone?: string;
  AllowVersionUpgrade?: boolean;
  ClusterSubnetGroupName?: string;
  PubliclyAccessible?: boolean;
  OwnerAccount?: string;
  HsmClientCertificateIdentifier?: string;
  HsmConfigurationIdentifier?: string;
  ElasticIp?: string;
  ClusterParameterGroupName?: string;
  ClusterSecurityGroups?: string[];
  VpcSecurityGroupIds?: string[];
  PreferredMaintenanceWindow?: string;
  AutomatedSnapshotRetentionPeriod?: number;
  ManualSnapshotRetentionPeriod?: number;
  KmsKeyId?: string;
  NodeType?: string;
  EnhancedVpcRouting?: boolean;
  AdditionalInfo?: string;
  IamRoles?: string[];
  MaintenanceTrackName?: string;
  SnapshotScheduleIdentifier?: string;
  NumberOfNodes?: number;
  AvailabilityZoneRelocation?: boolean;
  AquaConfigurationStatus?: AquaConfigurationStatus;
  DefaultIamRoleArn?: string;
  ReservedNodeId?: string;
  TargetReservedNodeOfferingId?: string;
  Encrypted?: boolean;
  ManageMasterPassword?: boolean;
  MasterPasswordSecretKmsKeyId?: string;
  IpAddressType?: string;
  MultiAZ?: boolean;
  CatalogName?: string;
  RedshiftIdcApplicationArn?: string;
}
export const RestoreFromClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    SnapshotClusterIdentifier: S.optional(S.String),
    Port: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    AllowVersionUpgrade: S.optional(S.Boolean),
    ClusterSubnetGroupName: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    OwnerAccount: S.optional(S.String),
    HsmClientCertificateIdentifier: S.optional(S.String),
    HsmConfigurationIdentifier: S.optional(S.String),
    ElasticIp: S.optional(S.String),
    ClusterParameterGroupName: S.optional(S.String),
    ClusterSecurityGroups: S.optional(ClusterSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    PreferredMaintenanceWindow: S.optional(S.String),
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    KmsKeyId: S.optional(S.String),
    NodeType: S.optional(S.String),
    EnhancedVpcRouting: S.optional(S.Boolean),
    AdditionalInfo: S.optional(S.String),
    IamRoles: S.optional(IamRoleArnList),
    MaintenanceTrackName: S.optional(S.String),
    SnapshotScheduleIdentifier: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    AvailabilityZoneRelocation: S.optional(S.Boolean),
    AquaConfigurationStatus: S.optional(AquaConfigurationStatus),
    DefaultIamRoleArn: S.optional(S.String),
    ReservedNodeId: S.optional(S.String),
    TargetReservedNodeOfferingId: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    ManageMasterPassword: S.optional(S.Boolean),
    MasterPasswordSecretKmsKeyId: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    CatalogName: S.optional(S.String),
    RedshiftIdcApplicationArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RestoreFromClusterSnapshotMessage",
}) as any as S.Schema<RestoreFromClusterSnapshotMessage>;
export interface RestoreTableFromClusterSnapshotMessage {
  ClusterIdentifier?: string;
  SnapshotIdentifier?: string;
  SourceDatabaseName?: string;
  SourceSchemaName?: string;
  SourceTableName?: string;
  TargetDatabaseName?: string;
  TargetSchemaName?: string;
  NewTableName?: string;
  EnableCaseSensitiveIdentifier?: boolean;
}
export const RestoreTableFromClusterSnapshotMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    SnapshotIdentifier: S.optional(S.String),
    SourceDatabaseName: S.optional(S.String),
    SourceSchemaName: S.optional(S.String),
    SourceTableName: S.optional(S.String),
    TargetDatabaseName: S.optional(S.String),
    TargetSchemaName: S.optional(S.String),
    NewTableName: S.optional(S.String),
    EnableCaseSensitiveIdentifier: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RestoreTableFromClusterSnapshotMessage",
}) as any as S.Schema<RestoreTableFromClusterSnapshotMessage>;
export interface RevokeClusterSecurityGroupIngressMessage {
  ClusterSecurityGroupName?: string;
  CIDRIP?: string;
  EC2SecurityGroupName?: string;
  EC2SecurityGroupOwnerId?: string;
}
export const RevokeClusterSecurityGroupIngressMessage = S.suspend(() =>
  S.Struct({
    ClusterSecurityGroupName: S.optional(S.String),
    CIDRIP: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
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
  identifier: "RevokeClusterSecurityGroupIngressMessage",
}) as any as S.Schema<RevokeClusterSecurityGroupIngressMessage>;
export interface RevokeEndpointAccessMessage {
  ClusterIdentifier?: string;
  Account?: string;
  VpcIds?: string[];
  Force?: boolean;
}
export const RevokeEndpointAccessMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    Account: S.optional(S.String),
    VpcIds: S.optional(VpcIdentifierList),
    Force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeEndpointAccessMessage",
}) as any as S.Schema<RevokeEndpointAccessMessage>;
export interface RevokeSnapshotAccessMessage {
  SnapshotIdentifier?: string;
  SnapshotArn?: string;
  SnapshotClusterIdentifier?: string;
  AccountWithRestoreAccess?: string;
}
export const RevokeSnapshotAccessMessage = S.suspend(() =>
  S.Struct({
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    SnapshotClusterIdentifier: S.optional(S.String),
    AccountWithRestoreAccess: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeSnapshotAccessMessage",
}) as any as S.Schema<RevokeSnapshotAccessMessage>;
export interface RotateEncryptionKeyMessage {
  ClusterIdentifier?: string;
}
export const RotateEncryptionKeyMessage = S.suspend(() =>
  S.Struct({ ClusterIdentifier: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RotateEncryptionKeyMessage",
}) as any as S.Schema<RotateEncryptionKeyMessage>;
export interface UpdatePartnerStatusInputMessage {
  AccountId?: string;
  ClusterIdentifier?: string;
  DatabaseName?: string;
  PartnerName?: string;
  Status?: PartnerIntegrationStatus;
  StatusMessage?: string;
}
export const UpdatePartnerStatusInputMessage = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    PartnerName: S.optional(S.String),
    Status: S.optional(PartnerIntegrationStatus),
    StatusMessage: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePartnerStatusInputMessage",
}) as any as S.Schema<UpdatePartnerStatusInputMessage>;
export type SnapshotAttributeToSortBy =
  | "SOURCE_TYPE"
  | "TOTAL_SIZE"
  | "CREATE_TIME";
export const SnapshotAttributeToSortBy = S.Literal(
  "SOURCE_TYPE",
  "TOTAL_SIZE",
  "CREATE_TIME",
);
export type SortByOrder = "ASC" | "DESC";
export const SortByOrder = S.Literal("ASC", "DESC");
export type DescribeIntegrationsFilterName =
  | "integration-arn"
  | "source-arn"
  | "source-types"
  | "status";
export const DescribeIntegrationsFilterName = S.Literal(
  "integration-arn",
  "source-arn",
  "source-types",
  "status",
);
export type DescribeIntegrationsFilterValueList = string[];
export const DescribeIntegrationsFilterValueList = S.Array(
  S.String.pipe(T.XmlName("Value")),
);
export type NodeConfigurationOptionsFilterName =
  | "NodeType"
  | "NumberOfNodes"
  | "EstimatedDiskUtilizationPercent"
  | "Mode";
export const NodeConfigurationOptionsFilterName = S.Literal(
  "NodeType",
  "NumberOfNodes",
  "EstimatedDiskUtilizationPercent",
  "Mode",
);
export type OperatorType = "eq" | "lt" | "gt" | "le" | "ge" | "in" | "between";
export const OperatorType = S.Literal(
  "eq",
  "lt",
  "gt",
  "le",
  "ge",
  "in",
  "between",
);
export type ValueStringList = string[];
export const ValueStringList = S.Array(S.String.pipe(T.XmlName("item")));
export type ScheduledActionFilterName = "cluster-identifier" | "iam-role";
export const ScheduledActionFilterName = S.Literal(
  "cluster-identifier",
  "iam-role",
);
export type DataShareType = "INTERNAL";
export const DataShareType = S.Literal("INTERNAL");
export type AuthorizationStatus = "Authorized" | "Revoking";
export const AuthorizationStatus = S.Literal("Authorized", "Revoking");
export interface SnapshotErrorMessage {
  SnapshotIdentifier?: string;
  SnapshotClusterIdentifier?: string;
  FailureCode?: string;
  FailureReason?: string;
}
export const SnapshotErrorMessage = S.suspend(() =>
  S.Struct({
    SnapshotIdentifier: S.optional(S.String),
    SnapshotClusterIdentifier: S.optional(S.String),
    FailureCode: S.optional(S.String),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "SnapshotErrorMessage",
}) as any as S.Schema<SnapshotErrorMessage>;
export type BatchSnapshotOperationErrors = SnapshotErrorMessage[];
export const BatchSnapshotOperationErrors = S.Array(
  SnapshotErrorMessage.pipe(T.XmlName("SnapshotErrorMessage")).annotations({
    identifier: "SnapshotErrorMessage",
  }),
);
export type ImportTablesCompleted = string[];
export const ImportTablesCompleted = S.Array(S.String);
export type ImportTablesInProgress = string[];
export const ImportTablesInProgress = S.Array(S.String);
export type ImportTablesNotStarted = string[];
export const ImportTablesNotStarted = S.Array(S.String);
export type EncryptionContextMap = { [key: string]: string };
export const EncryptionContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export type ScheduledSnapshotTimeList = Date[];
export const ScheduledSnapshotTimeList = S.Array(
  S.Date.pipe(T.TimestampFormat("date-time")).pipe(T.XmlName("SnapshotTime")),
);
export type ZeroETLIntegrationStatus =
  | "creating"
  | "active"
  | "modifying"
  | "failed"
  | "deleting"
  | "syncing"
  | "needs_attention";
export const ZeroETLIntegrationStatus = S.Literal(
  "creating",
  "active",
  "modifying",
  "failed",
  "deleting",
  "syncing",
  "needs_attention",
);
export interface ClusterParameterGroup {
  ParameterGroupName?: string;
  ParameterGroupFamily?: string;
  Description?: string;
  Tags?: Tag[];
}
export const ClusterParameterGroup = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
    ParameterGroupFamily: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "ClusterParameterGroup",
}) as any as S.Schema<ClusterParameterGroup>;
export type ParameterGroupList = ClusterParameterGroup[];
export const ParameterGroupList = S.Array(
  ClusterParameterGroup.pipe(T.XmlName("ClusterParameterGroup")).annotations({
    identifier: "ClusterParameterGroup",
  }),
);
export interface NetworkInterface {
  NetworkInterfaceId?: string;
  SubnetId?: string;
  PrivateIpAddress?: string;
  AvailabilityZone?: string;
  Ipv6Address?: string;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    NetworkInterfaceId: S.optional(S.String),
    SubnetId: S.optional(S.String),
    PrivateIpAddress: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    Ipv6Address: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaceList = NetworkInterface[];
export const NetworkInterfaceList = S.Array(
  NetworkInterface.pipe(T.XmlName("NetworkInterface")).annotations({
    identifier: "NetworkInterface",
  }),
);
export interface VpcEndpoint {
  VpcEndpointId?: string;
  VpcId?: string;
  NetworkInterfaces?: NetworkInterface[];
}
export const VpcEndpoint = S.suspend(() =>
  S.Struct({
    VpcEndpointId: S.optional(S.String),
    VpcId: S.optional(S.String),
    NetworkInterfaces: S.optional(NetworkInterfaceList),
  }),
).annotations({ identifier: "VpcEndpoint" }) as any as S.Schema<VpcEndpoint>;
export type VpcEndpointsList = VpcEndpoint[];
export const VpcEndpointsList = S.Array(
  VpcEndpoint.pipe(T.XmlName("VpcEndpoint")).annotations({
    identifier: "VpcEndpoint",
  }),
);
export interface Endpoint {
  Address?: string;
  Port?: number;
  VpcEndpoints?: VpcEndpoint[];
}
export const Endpoint = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    Port: S.optional(S.Number),
    VpcEndpoints: S.optional(VpcEndpointsList),
  }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export interface ClusterSecurityGroupMembership {
  ClusterSecurityGroupName?: string;
  Status?: string;
}
export const ClusterSecurityGroupMembership = S.suspend(() =>
  S.Struct({
    ClusterSecurityGroupName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterSecurityGroupMembership",
}) as any as S.Schema<ClusterSecurityGroupMembership>;
export type ClusterSecurityGroupMembershipList =
  ClusterSecurityGroupMembership[];
export const ClusterSecurityGroupMembershipList = S.Array(
  ClusterSecurityGroupMembership.pipe(
    T.XmlName("ClusterSecurityGroup"),
  ).annotations({ identifier: "ClusterSecurityGroupMembership" }),
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
  VpcSecurityGroupMembership.pipe(T.XmlName("VpcSecurityGroup")).annotations({
    identifier: "VpcSecurityGroupMembership",
  }),
);
export interface ClusterParameterStatus {
  ParameterName?: string;
  ParameterApplyStatus?: string;
  ParameterApplyErrorDescription?: string;
}
export const ClusterParameterStatus = S.suspend(() =>
  S.Struct({
    ParameterName: S.optional(S.String),
    ParameterApplyStatus: S.optional(S.String),
    ParameterApplyErrorDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterParameterStatus",
}) as any as S.Schema<ClusterParameterStatus>;
export type ClusterParameterStatusList = ClusterParameterStatus[];
export const ClusterParameterStatusList = S.Array(ClusterParameterStatus);
export interface ClusterParameterGroupStatus {
  ParameterGroupName?: string;
  ParameterApplyStatus?: string;
  ClusterParameterStatusList?: ClusterParameterStatus[];
}
export const ClusterParameterGroupStatus = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
    ParameterApplyStatus: S.optional(S.String),
    ClusterParameterStatusList: S.optional(ClusterParameterStatusList),
  }),
).annotations({
  identifier: "ClusterParameterGroupStatus",
}) as any as S.Schema<ClusterParameterGroupStatus>;
export type ClusterParameterGroupStatusList = ClusterParameterGroupStatus[];
export const ClusterParameterGroupStatusList = S.Array(
  ClusterParameterGroupStatus.pipe(
    T.XmlName("ClusterParameterGroup"),
  ).annotations({ identifier: "ClusterParameterGroupStatus" }),
);
export interface PendingModifiedValues {
  MasterUserPassword?: string | redacted.Redacted<string>;
  NodeType?: string;
  NumberOfNodes?: number;
  ClusterType?: string;
  ClusterVersion?: string;
  AutomatedSnapshotRetentionPeriod?: number;
  ClusterIdentifier?: string;
  PubliclyAccessible?: boolean;
  EnhancedVpcRouting?: boolean;
  MaintenanceTrackName?: string;
  EncryptionType?: string;
}
export const PendingModifiedValues = S.suspend(() =>
  S.Struct({
    MasterUserPassword: S.optional(SensitiveString),
    NodeType: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    ClusterType: S.optional(S.String),
    ClusterVersion: S.optional(S.String),
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    ClusterIdentifier: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    EnhancedVpcRouting: S.optional(S.Boolean),
    MaintenanceTrackName: S.optional(S.String),
    EncryptionType: S.optional(S.String),
  }),
).annotations({
  identifier: "PendingModifiedValues",
}) as any as S.Schema<PendingModifiedValues>;
export interface RestoreStatus {
  Status?: string;
  CurrentRestoreRateInMegaBytesPerSecond?: number;
  SnapshotSizeInMegaBytes?: number;
  ProgressInMegaBytes?: number;
  ElapsedTimeInSeconds?: number;
  EstimatedTimeToCompletionInSeconds?: number;
}
export const RestoreStatus = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    CurrentRestoreRateInMegaBytesPerSecond: S.optional(S.Number),
    SnapshotSizeInMegaBytes: S.optional(S.Number),
    ProgressInMegaBytes: S.optional(S.Number),
    ElapsedTimeInSeconds: S.optional(S.Number),
    EstimatedTimeToCompletionInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "RestoreStatus",
}) as any as S.Schema<RestoreStatus>;
export interface DataTransferProgress {
  Status?: string;
  CurrentRateInMegaBytesPerSecond?: number;
  TotalDataInMegaBytes?: number;
  DataTransferredInMegaBytes?: number;
  EstimatedTimeToCompletionInSeconds?: number;
  ElapsedTimeInSeconds?: number;
}
export const DataTransferProgress = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    CurrentRateInMegaBytesPerSecond: S.optional(S.Number),
    TotalDataInMegaBytes: S.optional(S.Number),
    DataTransferredInMegaBytes: S.optional(S.Number),
    EstimatedTimeToCompletionInSeconds: S.optional(S.Number),
    ElapsedTimeInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataTransferProgress",
}) as any as S.Schema<DataTransferProgress>;
export interface HsmStatus {
  HsmClientCertificateIdentifier?: string;
  HsmConfigurationIdentifier?: string;
  Status?: string;
}
export const HsmStatus = S.suspend(() =>
  S.Struct({
    HsmClientCertificateIdentifier: S.optional(S.String),
    HsmConfigurationIdentifier: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({ identifier: "HsmStatus" }) as any as S.Schema<HsmStatus>;
export interface ClusterSnapshotCopyStatus {
  DestinationRegion?: string;
  RetentionPeriod?: number;
  ManualSnapshotRetentionPeriod?: number;
  SnapshotCopyGrantName?: string;
}
export const ClusterSnapshotCopyStatus = S.suspend(() =>
  S.Struct({
    DestinationRegion: S.optional(S.String),
    RetentionPeriod: S.optional(S.Number),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    SnapshotCopyGrantName: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterSnapshotCopyStatus",
}) as any as S.Schema<ClusterSnapshotCopyStatus>;
export interface ClusterNode {
  NodeRole?: string;
  PrivateIPAddress?: string;
  PublicIPAddress?: string;
}
export const ClusterNode = S.suspend(() =>
  S.Struct({
    NodeRole: S.optional(S.String),
    PrivateIPAddress: S.optional(S.String),
    PublicIPAddress: S.optional(S.String),
  }),
).annotations({ identifier: "ClusterNode" }) as any as S.Schema<ClusterNode>;
export type ClusterNodesList = ClusterNode[];
export const ClusterNodesList = S.Array(ClusterNode);
export interface ElasticIpStatus {
  ElasticIp?: string;
  Status?: string;
}
export const ElasticIpStatus = S.suspend(() =>
  S.Struct({ ElasticIp: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "ElasticIpStatus",
}) as any as S.Schema<ElasticIpStatus>;
export interface ClusterIamRole {
  IamRoleArn?: string;
  ApplyStatus?: string;
}
export const ClusterIamRole = S.suspend(() =>
  S.Struct({
    IamRoleArn: S.optional(S.String),
    ApplyStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterIamRole",
}) as any as S.Schema<ClusterIamRole>;
export type ClusterIamRoleList = ClusterIamRole[];
export const ClusterIamRoleList = S.Array(
  ClusterIamRole.pipe(T.XmlName("ClusterIamRole")).annotations({
    identifier: "ClusterIamRole",
  }),
);
export type PendingActionsList = string[];
export const PendingActionsList = S.Array(S.String);
export interface DeferredMaintenanceWindow {
  DeferMaintenanceIdentifier?: string;
  DeferMaintenanceStartTime?: Date;
  DeferMaintenanceEndTime?: Date;
}
export const DeferredMaintenanceWindow = S.suspend(() =>
  S.Struct({
    DeferMaintenanceIdentifier: S.optional(S.String),
    DeferMaintenanceStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    DeferMaintenanceEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "DeferredMaintenanceWindow",
}) as any as S.Schema<DeferredMaintenanceWindow>;
export type DeferredMaintenanceWindowsList = DeferredMaintenanceWindow[];
export const DeferredMaintenanceWindowsList = S.Array(
  DeferredMaintenanceWindow.pipe(
    T.XmlName("DeferredMaintenanceWindow"),
  ).annotations({ identifier: "DeferredMaintenanceWindow" }),
);
export type ScheduleState = "MODIFYING" | "ACTIVE" | "FAILED";
export const ScheduleState = S.Literal("MODIFYING", "ACTIVE", "FAILED");
export interface ResizeInfo {
  ResizeType?: string;
  AllowCancelResize?: boolean;
}
export const ResizeInfo = S.suspend(() =>
  S.Struct({
    ResizeType: S.optional(S.String),
    AllowCancelResize: S.optional(S.Boolean),
  }),
).annotations({ identifier: "ResizeInfo" }) as any as S.Schema<ResizeInfo>;
export type AquaStatus = "enabled" | "disabled" | "applying";
export const AquaStatus = S.Literal("enabled", "disabled", "applying");
export interface AquaConfiguration {
  AquaStatus?: AquaStatus;
  AquaConfigurationStatus?: AquaConfigurationStatus;
}
export const AquaConfiguration = S.suspend(() =>
  S.Struct({
    AquaStatus: S.optional(AquaStatus),
    AquaConfigurationStatus: S.optional(AquaConfigurationStatus),
  }),
).annotations({
  identifier: "AquaConfiguration",
}) as any as S.Schema<AquaConfiguration>;
export type ReservedNodeExchangeStatusType =
  | "REQUESTED"
  | "PENDING"
  | "IN_PROGRESS"
  | "RETRYING"
  | "SUCCEEDED"
  | "FAILED";
export const ReservedNodeExchangeStatusType = S.Literal(
  "REQUESTED",
  "PENDING",
  "IN_PROGRESS",
  "RETRYING",
  "SUCCEEDED",
  "FAILED",
);
export interface ReservedNodeExchangeStatus {
  ReservedNodeExchangeRequestId?: string;
  Status?: ReservedNodeExchangeStatusType;
  RequestTime?: Date;
  SourceReservedNodeId?: string;
  SourceReservedNodeType?: string;
  SourceReservedNodeCount?: number;
  TargetReservedNodeOfferingId?: string;
  TargetReservedNodeType?: string;
  TargetReservedNodeCount?: number;
}
export const ReservedNodeExchangeStatus = S.suspend(() =>
  S.Struct({
    ReservedNodeExchangeRequestId: S.optional(S.String),
    Status: S.optional(ReservedNodeExchangeStatusType),
    RequestTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SourceReservedNodeId: S.optional(S.String),
    SourceReservedNodeType: S.optional(S.String),
    SourceReservedNodeCount: S.optional(S.Number),
    TargetReservedNodeOfferingId: S.optional(S.String),
    TargetReservedNodeType: S.optional(S.String),
    TargetReservedNodeCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ReservedNodeExchangeStatus",
}) as any as S.Schema<ReservedNodeExchangeStatus>;
export interface SecondaryClusterInfo {
  AvailabilityZone?: string;
  ClusterNodes?: ClusterNode[];
}
export const SecondaryClusterInfo = S.suspend(() =>
  S.Struct({
    AvailabilityZone: S.optional(S.String),
    ClusterNodes: S.optional(ClusterNodesList),
  }),
).annotations({
  identifier: "SecondaryClusterInfo",
}) as any as S.Schema<SecondaryClusterInfo>;
export interface Cluster {
  ClusterIdentifier?: string;
  NodeType?: string;
  ClusterStatus?: string;
  ClusterAvailabilityStatus?: string;
  ModifyStatus?: string;
  MasterUsername?: string;
  DBName?: string;
  Endpoint?: Endpoint;
  ClusterCreateTime?: Date;
  AutomatedSnapshotRetentionPeriod?: number;
  ManualSnapshotRetentionPeriod?: number;
  ClusterSecurityGroups?: ClusterSecurityGroupMembership[];
  VpcSecurityGroups?: VpcSecurityGroupMembership[];
  ClusterParameterGroups?: ClusterParameterGroupStatus[];
  ClusterSubnetGroupName?: string;
  VpcId?: string;
  AvailabilityZone?: string;
  PreferredMaintenanceWindow?: string;
  PendingModifiedValues?: PendingModifiedValues;
  ClusterVersion?: string;
  AllowVersionUpgrade?: boolean;
  NumberOfNodes?: number;
  PubliclyAccessible?: boolean;
  Encrypted?: boolean;
  RestoreStatus?: RestoreStatus;
  DataTransferProgress?: DataTransferProgress;
  HsmStatus?: HsmStatus;
  ClusterSnapshotCopyStatus?: ClusterSnapshotCopyStatus;
  ClusterPublicKey?: string;
  ClusterNodes?: ClusterNode[];
  ElasticIpStatus?: ElasticIpStatus;
  ClusterRevisionNumber?: string;
  Tags?: Tag[];
  KmsKeyId?: string;
  EnhancedVpcRouting?: boolean;
  IamRoles?: ClusterIamRole[];
  PendingActions?: string[];
  MaintenanceTrackName?: string;
  ElasticResizeNumberOfNodeOptions?: string;
  DeferredMaintenanceWindows?: DeferredMaintenanceWindow[];
  SnapshotScheduleIdentifier?: string;
  SnapshotScheduleState?: ScheduleState;
  ExpectedNextSnapshotScheduleTime?: Date;
  ExpectedNextSnapshotScheduleTimeStatus?: string;
  NextMaintenanceWindowStartTime?: Date;
  ResizeInfo?: ResizeInfo;
  AvailabilityZoneRelocationStatus?: string;
  ClusterNamespaceArn?: string;
  TotalStorageCapacityInMegaBytes?: number;
  AquaConfiguration?: AquaConfiguration;
  DefaultIamRoleArn?: string;
  ReservedNodeExchangeStatus?: ReservedNodeExchangeStatus;
  CustomDomainName?: string;
  CustomDomainCertificateArn?: string;
  CustomDomainCertificateExpiryDate?: Date;
  MasterPasswordSecretArn?: string;
  MasterPasswordSecretKmsKeyId?: string;
  IpAddressType?: string;
  MultiAZ?: string;
  MultiAZSecondary?: SecondaryClusterInfo;
  LakehouseRegistrationStatus?: string;
  CatalogArn?: string;
}
export const Cluster = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    NodeType: S.optional(S.String),
    ClusterStatus: S.optional(S.String),
    ClusterAvailabilityStatus: S.optional(S.String),
    ModifyStatus: S.optional(S.String),
    MasterUsername: S.optional(S.String),
    DBName: S.optional(S.String),
    Endpoint: S.optional(Endpoint),
    ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    ClusterSecurityGroups: S.optional(ClusterSecurityGroupMembershipList),
    VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
    ClusterParameterGroups: S.optional(ClusterParameterGroupStatusList),
    ClusterSubnetGroupName: S.optional(S.String),
    VpcId: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    PendingModifiedValues: S.optional(PendingModifiedValues),
    ClusterVersion: S.optional(S.String),
    AllowVersionUpgrade: S.optional(S.Boolean),
    NumberOfNodes: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    Encrypted: S.optional(S.Boolean),
    RestoreStatus: S.optional(RestoreStatus),
    DataTransferProgress: S.optional(DataTransferProgress),
    HsmStatus: S.optional(HsmStatus),
    ClusterSnapshotCopyStatus: S.optional(ClusterSnapshotCopyStatus),
    ClusterPublicKey: S.optional(S.String),
    ClusterNodes: S.optional(ClusterNodesList),
    ElasticIpStatus: S.optional(ElasticIpStatus),
    ClusterRevisionNumber: S.optional(S.String),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnhancedVpcRouting: S.optional(S.Boolean),
    IamRoles: S.optional(ClusterIamRoleList),
    PendingActions: S.optional(PendingActionsList),
    MaintenanceTrackName: S.optional(S.String),
    ElasticResizeNumberOfNodeOptions: S.optional(S.String),
    DeferredMaintenanceWindows: S.optional(DeferredMaintenanceWindowsList),
    SnapshotScheduleIdentifier: S.optional(S.String),
    SnapshotScheduleState: S.optional(ScheduleState),
    ExpectedNextSnapshotScheduleTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ExpectedNextSnapshotScheduleTimeStatus: S.optional(S.String),
    NextMaintenanceWindowStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ResizeInfo: S.optional(ResizeInfo),
    AvailabilityZoneRelocationStatus: S.optional(S.String),
    ClusterNamespaceArn: S.optional(S.String),
    TotalStorageCapacityInMegaBytes: S.optional(S.Number),
    AquaConfiguration: S.optional(AquaConfiguration),
    DefaultIamRoleArn: S.optional(S.String),
    ReservedNodeExchangeStatus: S.optional(ReservedNodeExchangeStatus),
    CustomDomainName: S.optional(S.String),
    CustomDomainCertificateArn: S.optional(S.String),
    CustomDomainCertificateExpiryDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    MasterPasswordSecretArn: S.optional(S.String),
    MasterPasswordSecretKmsKeyId: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    MultiAZ: S.optional(S.String),
    MultiAZSecondary: S.optional(SecondaryClusterInfo),
    LakehouseRegistrationStatus: S.optional(S.String),
    CatalogArn: S.optional(S.String),
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export type ClusterList = Cluster[];
export const ClusterList = S.Array(
  Cluster.pipe(T.XmlName("Cluster")).annotations({ identifier: "Cluster" }),
);
export interface EC2SecurityGroup {
  Status?: string;
  EC2SecurityGroupName?: string;
  EC2SecurityGroupOwnerId?: string;
  Tags?: Tag[];
}
export const EC2SecurityGroup = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
    EC2SecurityGroupOwnerId: S.optional(S.String),
    Tags: S.optional(TagList),
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
  Tags?: Tag[];
}
export const IPRange = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    CIDRIP: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({ identifier: "IPRange" }) as any as S.Schema<IPRange>;
export type IPRangeList = IPRange[];
export const IPRangeList = S.Array(
  IPRange.pipe(T.XmlName("IPRange")).annotations({ identifier: "IPRange" }),
);
export interface ClusterSecurityGroup {
  ClusterSecurityGroupName?: string;
  Description?: string;
  EC2SecurityGroups?: EC2SecurityGroup[];
  IPRanges?: IPRange[];
  Tags?: Tag[];
}
export const ClusterSecurityGroup = S.suspend(() =>
  S.Struct({
    ClusterSecurityGroupName: S.optional(S.String),
    Description: S.optional(S.String),
    EC2SecurityGroups: S.optional(EC2SecurityGroupList),
    IPRanges: S.optional(IPRangeList),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "ClusterSecurityGroup",
}) as any as S.Schema<ClusterSecurityGroup>;
export type ClusterSecurityGroups = ClusterSecurityGroup[];
export const ClusterSecurityGroups = S.Array(
  ClusterSecurityGroup.pipe(T.XmlName("ClusterSecurityGroup")).annotations({
    identifier: "ClusterSecurityGroup",
  }),
);
export interface SnapshotSortingEntity {
  Attribute?: SnapshotAttributeToSortBy;
  SortOrder?: SortByOrder;
}
export const SnapshotSortingEntity = S.suspend(() =>
  S.Struct({
    Attribute: S.optional(SnapshotAttributeToSortBy),
    SortOrder: S.optional(SortByOrder),
  }),
).annotations({
  identifier: "SnapshotSortingEntity",
}) as any as S.Schema<SnapshotSortingEntity>;
export type SnapshotSortingEntityList = SnapshotSortingEntity[];
export const SnapshotSortingEntityList = S.Array(
  SnapshotSortingEntity.pipe(T.XmlName("SnapshotSortingEntity")).annotations({
    identifier: "SnapshotSortingEntity",
  }),
);
export interface SupportedPlatform {
  Name?: string;
}
export const SupportedPlatform = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "SupportedPlatform",
}) as any as S.Schema<SupportedPlatform>;
export type SupportedPlatformsList = SupportedPlatform[];
export const SupportedPlatformsList = S.Array(
  SupportedPlatform.pipe(T.XmlName("SupportedPlatform")).annotations({
    identifier: "SupportedPlatform",
  }),
);
export interface AvailabilityZone {
  Name?: string;
  SupportedPlatforms?: SupportedPlatform[];
}
export const AvailabilityZone = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    SupportedPlatforms: S.optional(SupportedPlatformsList),
  }),
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
export interface ClusterSubnetGroup {
  ClusterSubnetGroupName?: string;
  Description?: string;
  VpcId?: string;
  SubnetGroupStatus?: string;
  Subnets?: Subnet[];
  Tags?: Tag[];
  SupportedClusterIpAddressTypes?: string[];
}
export const ClusterSubnetGroup = S.suspend(() =>
  S.Struct({
    ClusterSubnetGroupName: S.optional(S.String),
    Description: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetGroupStatus: S.optional(S.String),
    Subnets: S.optional(SubnetList),
    Tags: S.optional(TagList),
    SupportedClusterIpAddressTypes: S.optional(ValueStringList),
  }),
).annotations({
  identifier: "ClusterSubnetGroup",
}) as any as S.Schema<ClusterSubnetGroup>;
export type ClusterSubnetGroups = ClusterSubnetGroup[];
export const ClusterSubnetGroups = S.Array(
  ClusterSubnetGroup.pipe(T.XmlName("ClusterSubnetGroup")).annotations({
    identifier: "ClusterSubnetGroup",
  }),
);
export type DataShareStatus =
  | "ACTIVE"
  | "PENDING_AUTHORIZATION"
  | "AUTHORIZED"
  | "DEAUTHORIZED"
  | "REJECTED"
  | "AVAILABLE";
export const DataShareStatus = S.Literal(
  "ACTIVE",
  "PENDING_AUTHORIZATION",
  "AUTHORIZED",
  "DEAUTHORIZED",
  "REJECTED",
  "AVAILABLE",
);
export interface DataShareAssociation {
  ConsumerIdentifier?: string;
  Status?: DataShareStatus;
  ConsumerRegion?: string;
  CreatedDate?: Date;
  StatusChangeDate?: Date;
  ProducerAllowedWrites?: boolean;
  ConsumerAcceptedWrites?: boolean;
}
export const DataShareAssociation = S.suspend(() =>
  S.Struct({
    ConsumerIdentifier: S.optional(S.String),
    Status: S.optional(DataShareStatus),
    ConsumerRegion: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StatusChangeDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ProducerAllowedWrites: S.optional(S.Boolean),
    ConsumerAcceptedWrites: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DataShareAssociation",
}) as any as S.Schema<DataShareAssociation>;
export type DataShareAssociationList = DataShareAssociation[];
export const DataShareAssociationList = S.Array(DataShareAssociation);
export interface DataShare {
  DataShareArn?: string;
  ProducerArn?: string;
  AllowPubliclyAccessibleConsumers?: boolean;
  DataShareAssociations?: DataShareAssociation[];
  ManagedBy?: string;
  DataShareType?: DataShareType;
}
export const DataShare = S.suspend(() =>
  S.Struct({
    DataShareArn: S.optional(S.String),
    ProducerArn: S.optional(S.String),
    AllowPubliclyAccessibleConsumers: S.optional(S.Boolean),
    DataShareAssociations: S.optional(DataShareAssociationList),
    ManagedBy: S.optional(S.String),
    DataShareType: S.optional(DataShareType),
  }).pipe(ns),
).annotations({ identifier: "DataShare" }) as any as S.Schema<DataShare>;
export type DataShareList = DataShare[];
export const DataShareList = S.Array(DataShare);
export interface EndpointAccess {
  ClusterIdentifier?: string;
  ResourceOwner?: string;
  SubnetGroupName?: string;
  EndpointStatus?: string;
  EndpointName?: string;
  EndpointCreateTime?: Date;
  Port?: number;
  Address?: string;
  VpcSecurityGroups?: VpcSecurityGroupMembership[];
  VpcEndpoint?: VpcEndpoint;
}
export const EndpointAccess = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    SubnetGroupName: S.optional(S.String),
    EndpointStatus: S.optional(S.String),
    EndpointName: S.optional(S.String),
    EndpointCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Port: S.optional(S.Number),
    Address: S.optional(S.String),
    VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
    VpcEndpoint: S.optional(VpcEndpoint),
  }).pipe(ns),
).annotations({
  identifier: "EndpointAccess",
}) as any as S.Schema<EndpointAccess>;
export type EndpointAccesses = EndpointAccess[];
export const EndpointAccesses = S.Array(EndpointAccess);
export interface EndpointAuthorization {
  Grantor?: string;
  Grantee?: string;
  ClusterIdentifier?: string;
  AuthorizeTime?: Date;
  ClusterStatus?: string;
  Status?: AuthorizationStatus;
  AllowedAllVPCs?: boolean;
  AllowedVPCs?: string[];
  EndpointCount?: number;
}
export const EndpointAuthorization = S.suspend(() =>
  S.Struct({
    Grantor: S.optional(S.String),
    Grantee: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    AuthorizeTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ClusterStatus: S.optional(S.String),
    Status: S.optional(AuthorizationStatus),
    AllowedAllVPCs: S.optional(S.Boolean),
    AllowedVPCs: S.optional(VpcIdentifierList),
    EndpointCount: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "EndpointAuthorization",
}) as any as S.Schema<EndpointAuthorization>;
export type EndpointAuthorizations = EndpointAuthorization[];
export const EndpointAuthorizations = S.Array(EndpointAuthorization);
export interface EventSubscription {
  CustomerAwsId?: string;
  CustSubscriptionId?: string;
  SnsTopicArn?: string;
  Status?: string;
  SubscriptionCreationTime?: Date;
  SourceType?: string;
  SourceIdsList?: string[];
  EventCategoriesList?: string[];
  Severity?: string;
  Enabled?: boolean;
  Tags?: Tag[];
}
export const EventSubscription = S.suspend(() =>
  S.Struct({
    CustomerAwsId: S.optional(S.String),
    CustSubscriptionId: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    Status: S.optional(S.String),
    SubscriptionCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    SourceType: S.optional(S.String),
    SourceIdsList: S.optional(SourceIdsList),
    EventCategoriesList: S.optional(EventCategoriesList),
    Severity: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
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
export interface HsmClientCertificate {
  HsmClientCertificateIdentifier?: string;
  HsmClientCertificatePublicKey?: string;
  Tags?: Tag[];
}
export const HsmClientCertificate = S.suspend(() =>
  S.Struct({
    HsmClientCertificateIdentifier: S.optional(S.String),
    HsmClientCertificatePublicKey: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "HsmClientCertificate",
}) as any as S.Schema<HsmClientCertificate>;
export type HsmClientCertificateList = HsmClientCertificate[];
export const HsmClientCertificateList = S.Array(
  HsmClientCertificate.pipe(T.XmlName("HsmClientCertificate")).annotations({
    identifier: "HsmClientCertificate",
  }),
);
export interface HsmConfiguration {
  HsmConfigurationIdentifier?: string;
  Description?: string;
  HsmIpAddress?: string;
  HsmPartitionName?: string;
  Tags?: Tag[];
}
export const HsmConfiguration = S.suspend(() =>
  S.Struct({
    HsmConfigurationIdentifier: S.optional(S.String),
    Description: S.optional(S.String),
    HsmIpAddress: S.optional(S.String),
    HsmPartitionName: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "HsmConfiguration",
}) as any as S.Schema<HsmConfiguration>;
export type HsmConfigurationList = HsmConfiguration[];
export const HsmConfigurationList = S.Array(
  HsmConfiguration.pipe(T.XmlName("HsmConfiguration")).annotations({
    identifier: "HsmConfiguration",
  }),
);
export interface DescribeIntegrationsFilter {
  Name?: DescribeIntegrationsFilterName;
  Values?: string[];
}
export const DescribeIntegrationsFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(DescribeIntegrationsFilterName),
    Values: S.optional(DescribeIntegrationsFilterValueList),
  }),
).annotations({
  identifier: "DescribeIntegrationsFilter",
}) as any as S.Schema<DescribeIntegrationsFilter>;
export type DescribeIntegrationsFilterList = DescribeIntegrationsFilter[];
export const DescribeIntegrationsFilterList = S.Array(
  DescribeIntegrationsFilter.pipe(
    T.XmlName("DescribeIntegrationsFilter"),
  ).annotations({ identifier: "DescribeIntegrationsFilter" }),
);
export interface NodeConfigurationOptionsFilter {
  Name?: NodeConfigurationOptionsFilterName;
  Operator?: OperatorType;
  Values?: string[];
}
export const NodeConfigurationOptionsFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(NodeConfigurationOptionsFilterName),
    Operator: S.optional(OperatorType),
    Values: S.optional(ValueStringList).pipe(T.XmlName("Value")),
  }),
).annotations({
  identifier: "NodeConfigurationOptionsFilter",
}) as any as S.Schema<NodeConfigurationOptionsFilter>;
export type NodeConfigurationOptionsFilterList =
  NodeConfigurationOptionsFilter[];
export const NodeConfigurationOptionsFilterList = S.Array(
  NodeConfigurationOptionsFilter.pipe(
    T.XmlName("NodeConfigurationOptionsFilter"),
  ).annotations({ identifier: "NodeConfigurationOptionsFilter" }),
);
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
export type ReservedNodeOfferingType = "Regular" | "Upgradable";
export const ReservedNodeOfferingType = S.Literal("Regular", "Upgradable");
export interface ReservedNode {
  ReservedNodeId?: string;
  ReservedNodeOfferingId?: string;
  NodeType?: string;
  StartTime?: Date;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  CurrencyCode?: string;
  NodeCount?: number;
  State?: string;
  OfferingType?: string;
  RecurringCharges?: RecurringCharge[];
  ReservedNodeOfferingType?: ReservedNodeOfferingType;
}
export const ReservedNode = S.suspend(() =>
  S.Struct({
    ReservedNodeId: S.optional(S.String),
    ReservedNodeOfferingId: S.optional(S.String),
    NodeType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    UsagePrice: S.optional(S.Number),
    CurrencyCode: S.optional(S.String),
    NodeCount: S.optional(S.Number),
    State: S.optional(S.String),
    OfferingType: S.optional(S.String),
    RecurringCharges: S.optional(RecurringChargeList),
    ReservedNodeOfferingType: S.optional(ReservedNodeOfferingType),
  }),
).annotations({ identifier: "ReservedNode" }) as any as S.Schema<ReservedNode>;
export type ReservedNodeList = ReservedNode[];
export const ReservedNodeList = S.Array(
  ReservedNode.pipe(T.XmlName("ReservedNode")).annotations({
    identifier: "ReservedNode",
  }),
);
export interface ScheduledActionFilter {
  Name?: ScheduledActionFilterName;
  Values?: string[];
}
export const ScheduledActionFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(ScheduledActionFilterName),
    Values: S.optional(ValueStringList),
  }),
).annotations({
  identifier: "ScheduledActionFilter",
}) as any as S.Schema<ScheduledActionFilter>;
export type ScheduledActionFilterList = ScheduledActionFilter[];
export const ScheduledActionFilterList = S.Array(
  ScheduledActionFilter.pipe(T.XmlName("ScheduledActionFilter")).annotations({
    identifier: "ScheduledActionFilter",
  }),
);
export interface SnapshotCopyGrant {
  SnapshotCopyGrantName?: string;
  KmsKeyId?: string;
  Tags?: Tag[];
}
export const SnapshotCopyGrant = S.suspend(() =>
  S.Struct({
    SnapshotCopyGrantName: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "SnapshotCopyGrant",
}) as any as S.Schema<SnapshotCopyGrant>;
export type SnapshotCopyGrantList = SnapshotCopyGrant[];
export const SnapshotCopyGrantList = S.Array(
  SnapshotCopyGrant.pipe(T.XmlName("SnapshotCopyGrant")).annotations({
    identifier: "SnapshotCopyGrant",
  }),
);
export interface ClusterAssociatedToSchedule {
  ClusterIdentifier?: string;
  ScheduleAssociationState?: ScheduleState;
}
export const ClusterAssociatedToSchedule = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    ScheduleAssociationState: S.optional(ScheduleState),
  }),
).annotations({
  identifier: "ClusterAssociatedToSchedule",
}) as any as S.Schema<ClusterAssociatedToSchedule>;
export type AssociatedClusterList = ClusterAssociatedToSchedule[];
export const AssociatedClusterList = S.Array(
  ClusterAssociatedToSchedule.pipe(
    T.XmlName("ClusterAssociatedToSchedule"),
  ).annotations({ identifier: "ClusterAssociatedToSchedule" }),
);
export interface SnapshotSchedule {
  ScheduleDefinitions?: string[];
  ScheduleIdentifier?: string;
  ScheduleDescription?: string;
  Tags?: Tag[];
  NextInvocations?: Date[];
  AssociatedClusterCount?: number;
  AssociatedClusters?: ClusterAssociatedToSchedule[];
}
export const SnapshotSchedule = S.suspend(() =>
  S.Struct({
    ScheduleDefinitions: S.optional(ScheduleDefinitionList),
    ScheduleIdentifier: S.optional(S.String),
    ScheduleDescription: S.optional(S.String),
    Tags: S.optional(TagList),
    NextInvocations: S.optional(ScheduledSnapshotTimeList),
    AssociatedClusterCount: S.optional(S.Number),
    AssociatedClusters: S.optional(AssociatedClusterList),
  }).pipe(ns),
).annotations({
  identifier: "SnapshotSchedule",
}) as any as S.Schema<SnapshotSchedule>;
export type SnapshotScheduleList = SnapshotSchedule[];
export const SnapshotScheduleList = S.Array(
  SnapshotSchedule.pipe(T.XmlName("SnapshotSchedule")).annotations({
    identifier: "SnapshotSchedule",
  }),
);
export interface UsageLimit {
  UsageLimitId?: string;
  ClusterIdentifier?: string;
  FeatureType?: UsageLimitFeatureType;
  LimitType?: UsageLimitLimitType;
  Amount?: number;
  Period?: UsageLimitPeriod;
  BreachAction?: UsageLimitBreachAction;
  Tags?: Tag[];
}
export const UsageLimit = S.suspend(() =>
  S.Struct({
    UsageLimitId: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    FeatureType: S.optional(UsageLimitFeatureType),
    LimitType: S.optional(UsageLimitLimitType),
    Amount: S.optional(S.Number),
    Period: S.optional(UsageLimitPeriod),
    BreachAction: S.optional(UsageLimitBreachAction),
    Tags: S.optional(TagList),
  }).pipe(ns),
).annotations({ identifier: "UsageLimit" }) as any as S.Schema<UsageLimit>;
export type UsageLimits = UsageLimit[];
export const UsageLimits = S.Array(UsageLimit);
export type ScheduledActionState = "ACTIVE" | "DISABLED";
export const ScheduledActionState = S.Literal("ACTIVE", "DISABLED");
export type ScheduledActionTimeList = Date[];
export const ScheduledActionTimeList = S.Array(
  S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.XmlName("ScheduledActionTime"),
  ),
);
export type NamespaceRegistrationStatus = "Registering" | "Deregistering";
export const NamespaceRegistrationStatus = S.Literal(
  "Registering",
  "Deregistering",
);
export interface BatchModifyClusterSnapshotsOutputMessage {
  Resources?: string[];
  Errors?: SnapshotErrorMessage[];
}
export const BatchModifyClusterSnapshotsOutputMessage = S.suspend(() =>
  S.Struct({
    Resources: S.optional(SnapshotIdentifierList),
    Errors: S.optional(BatchSnapshotOperationErrors),
  }).pipe(ns),
).annotations({
  identifier: "BatchModifyClusterSnapshotsOutputMessage",
}) as any as S.Schema<BatchModifyClusterSnapshotsOutputMessage>;
export interface ResizeProgressMessage {
  TargetNodeType?: string;
  TargetNumberOfNodes?: number;
  TargetClusterType?: string;
  Status?: string;
  ImportTablesCompleted?: string[];
  ImportTablesInProgress?: string[];
  ImportTablesNotStarted?: string[];
  AvgResizeRateInMegaBytesPerSecond?: number;
  TotalResizeDataInMegaBytes?: number;
  ProgressInMegaBytes?: number;
  ElapsedTimeInSeconds?: number;
  EstimatedTimeToCompletionInSeconds?: number;
  ResizeType?: string;
  Message?: string;
  TargetEncryptionType?: string;
  DataTransferProgressPercent?: number;
}
export const ResizeProgressMessage = S.suspend(() =>
  S.Struct({
    TargetNodeType: S.optional(S.String),
    TargetNumberOfNodes: S.optional(S.Number),
    TargetClusterType: S.optional(S.String),
    Status: S.optional(S.String),
    ImportTablesCompleted: S.optional(ImportTablesCompleted),
    ImportTablesInProgress: S.optional(ImportTablesInProgress),
    ImportTablesNotStarted: S.optional(ImportTablesNotStarted),
    AvgResizeRateInMegaBytesPerSecond: S.optional(S.Number),
    TotalResizeDataInMegaBytes: S.optional(S.Number),
    ProgressInMegaBytes: S.optional(S.Number),
    ElapsedTimeInSeconds: S.optional(S.Number),
    EstimatedTimeToCompletionInSeconds: S.optional(S.Number),
    ResizeType: S.optional(S.String),
    Message: S.optional(S.String),
    TargetEncryptionType: S.optional(S.String),
    DataTransferProgressPercent: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "ResizeProgressMessage",
}) as any as S.Schema<ResizeProgressMessage>;
export interface AccountWithRestoreAccess {
  AccountId?: string;
  AccountAlias?: string;
}
export const AccountWithRestoreAccess = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    AccountAlias: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountWithRestoreAccess",
}) as any as S.Schema<AccountWithRestoreAccess>;
export type AccountsWithRestoreAccessList = AccountWithRestoreAccess[];
export const AccountsWithRestoreAccessList = S.Array(
  AccountWithRestoreAccess.pipe(
    T.XmlName("AccountWithRestoreAccess"),
  ).annotations({ identifier: "AccountWithRestoreAccess" }),
);
export type RestorableNodeTypeList = string[];
export const RestorableNodeTypeList = S.Array(
  S.String.pipe(T.XmlName("NodeType")),
);
export interface Snapshot {
  SnapshotIdentifier?: string;
  ClusterIdentifier?: string;
  SnapshotCreateTime?: Date;
  Status?: string;
  Port?: number;
  AvailabilityZone?: string;
  ClusterCreateTime?: Date;
  MasterUsername?: string;
  ClusterVersion?: string;
  EngineFullVersion?: string;
  SnapshotType?: string;
  NodeType?: string;
  NumberOfNodes?: number;
  DBName?: string;
  VpcId?: string;
  Encrypted?: boolean;
  KmsKeyId?: string;
  EncryptedWithHSM?: boolean;
  AccountsWithRestoreAccess?: AccountWithRestoreAccess[];
  OwnerAccount?: string;
  TotalBackupSizeInMegaBytes?: number;
  ActualIncrementalBackupSizeInMegaBytes?: number;
  BackupProgressInMegaBytes?: number;
  CurrentBackupRateInMegaBytesPerSecond?: number;
  EstimatedSecondsToCompletion?: number;
  ElapsedTimeInSeconds?: number;
  SourceRegion?: string;
  Tags?: Tag[];
  RestorableNodeTypes?: string[];
  EnhancedVpcRouting?: boolean;
  MaintenanceTrackName?: string;
  ManualSnapshotRetentionPeriod?: number;
  ManualSnapshotRemainingDays?: number;
  SnapshotRetentionStartTime?: Date;
  MasterPasswordSecretArn?: string;
  MasterPasswordSecretKmsKeyId?: string;
  SnapshotArn?: string;
}
export const Snapshot = S.suspend(() =>
  S.Struct({
    SnapshotIdentifier: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    SnapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(S.String),
    Port: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    MasterUsername: S.optional(S.String),
    ClusterVersion: S.optional(S.String),
    EngineFullVersion: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    NodeType: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    DBName: S.optional(S.String),
    VpcId: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    EncryptedWithHSM: S.optional(S.Boolean),
    AccountsWithRestoreAccess: S.optional(AccountsWithRestoreAccessList),
    OwnerAccount: S.optional(S.String),
    TotalBackupSizeInMegaBytes: S.optional(S.Number),
    ActualIncrementalBackupSizeInMegaBytes: S.optional(S.Number),
    BackupProgressInMegaBytes: S.optional(S.Number),
    CurrentBackupRateInMegaBytesPerSecond: S.optional(S.Number),
    EstimatedSecondsToCompletion: S.optional(S.Number),
    ElapsedTimeInSeconds: S.optional(S.Number),
    SourceRegion: S.optional(S.String),
    Tags: S.optional(TagList),
    RestorableNodeTypes: S.optional(RestorableNodeTypeList),
    EnhancedVpcRouting: S.optional(S.Boolean),
    MaintenanceTrackName: S.optional(S.String),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    ManualSnapshotRemainingDays: S.optional(S.Number),
    SnapshotRetentionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    MasterPasswordSecretArn: S.optional(S.String),
    MasterPasswordSecretKmsKeyId: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
  }),
).annotations({ identifier: "Snapshot" }) as any as S.Schema<Snapshot>;
export interface CopyClusterSnapshotResult {
  Snapshot?: Snapshot;
}
export const CopyClusterSnapshotResult = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "CopyClusterSnapshotResult",
}) as any as S.Schema<CopyClusterSnapshotResult>;
export interface CreateAuthenticationProfileResult {
  AuthenticationProfileName?: string;
  AuthenticationProfileContent?: string;
}
export const CreateAuthenticationProfileResult = S.suspend(() =>
  S.Struct({
    AuthenticationProfileName: S.optional(S.String),
    AuthenticationProfileContent: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateAuthenticationProfileResult",
}) as any as S.Schema<CreateAuthenticationProfileResult>;
export interface CreateClusterMessage {
  DBName?: string;
  ClusterIdentifier?: string;
  ClusterType?: string;
  NodeType?: string;
  MasterUsername?: string;
  MasterUserPassword?: string | redacted.Redacted<string>;
  ClusterSecurityGroups?: string[];
  VpcSecurityGroupIds?: string[];
  ClusterSubnetGroupName?: string;
  AvailabilityZone?: string;
  PreferredMaintenanceWindow?: string;
  ClusterParameterGroupName?: string;
  AutomatedSnapshotRetentionPeriod?: number;
  ManualSnapshotRetentionPeriod?: number;
  Port?: number;
  ClusterVersion?: string;
  AllowVersionUpgrade?: boolean;
  NumberOfNodes?: number;
  PubliclyAccessible?: boolean;
  Encrypted?: boolean;
  HsmClientCertificateIdentifier?: string;
  HsmConfigurationIdentifier?: string;
  ElasticIp?: string;
  Tags?: Tag[];
  KmsKeyId?: string;
  EnhancedVpcRouting?: boolean;
  AdditionalInfo?: string;
  IamRoles?: string[];
  MaintenanceTrackName?: string;
  SnapshotScheduleIdentifier?: string;
  AvailabilityZoneRelocation?: boolean;
  AquaConfigurationStatus?: AquaConfigurationStatus;
  DefaultIamRoleArn?: string;
  LoadSampleData?: string;
  ManageMasterPassword?: boolean;
  MasterPasswordSecretKmsKeyId?: string;
  IpAddressType?: string;
  MultiAZ?: boolean;
  RedshiftIdcApplicationArn?: string;
  CatalogName?: string;
}
export const CreateClusterMessage = S.suspend(() =>
  S.Struct({
    DBName: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    ClusterType: S.optional(S.String),
    NodeType: S.optional(S.String),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(SensitiveString),
    ClusterSecurityGroups: S.optional(ClusterSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    ClusterSubnetGroupName: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    ClusterParameterGroupName: S.optional(S.String),
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    Port: S.optional(S.Number),
    ClusterVersion: S.optional(S.String),
    AllowVersionUpgrade: S.optional(S.Boolean),
    NumberOfNodes: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    Encrypted: S.optional(S.Boolean),
    HsmClientCertificateIdentifier: S.optional(S.String),
    HsmConfigurationIdentifier: S.optional(S.String),
    ElasticIp: S.optional(S.String),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnhancedVpcRouting: S.optional(S.Boolean),
    AdditionalInfo: S.optional(S.String),
    IamRoles: S.optional(IamRoleArnList),
    MaintenanceTrackName: S.optional(S.String),
    SnapshotScheduleIdentifier: S.optional(S.String),
    AvailabilityZoneRelocation: S.optional(S.Boolean),
    AquaConfigurationStatus: S.optional(AquaConfigurationStatus),
    DefaultIamRoleArn: S.optional(S.String),
    LoadSampleData: S.optional(S.String),
    ManageMasterPassword: S.optional(S.Boolean),
    MasterPasswordSecretKmsKeyId: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    RedshiftIdcApplicationArn: S.optional(S.String),
    CatalogName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateClusterMessage",
}) as any as S.Schema<CreateClusterMessage>;
export interface CreateClusterSecurityGroupResult {
  ClusterSecurityGroup?: ClusterSecurityGroup;
}
export const CreateClusterSecurityGroupResult = S.suspend(() =>
  S.Struct({ ClusterSecurityGroup: S.optional(ClusterSecurityGroup) }).pipe(ns),
).annotations({
  identifier: "CreateClusterSecurityGroupResult",
}) as any as S.Schema<CreateClusterSecurityGroupResult>;
export interface CreateClusterSnapshotResult {
  Snapshot?: Snapshot;
}
export const CreateClusterSnapshotResult = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "CreateClusterSnapshotResult",
}) as any as S.Schema<CreateClusterSnapshotResult>;
export interface CreateCustomDomainAssociationResult {
  CustomDomainName?: string;
  CustomDomainCertificateArn?: string;
  ClusterIdentifier?: string;
  CustomDomainCertExpiryTime?: string;
}
export const CreateCustomDomainAssociationResult = S.suspend(() =>
  S.Struct({
    CustomDomainName: S.optional(S.String),
    CustomDomainCertificateArn: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    CustomDomainCertExpiryTime: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateCustomDomainAssociationResult",
}) as any as S.Schema<CreateCustomDomainAssociationResult>;
export interface CreateIntegrationMessage {
  SourceArn?: string;
  TargetArn?: string;
  IntegrationName?: string;
  KMSKeyId?: string;
  TagList?: Tag[];
  AdditionalEncryptionContext?: { [key: string]: string };
  Description?: string;
}
export const CreateIntegrationMessage = S.suspend(() =>
  S.Struct({
    SourceArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    IntegrationName: S.optional(S.String),
    KMSKeyId: S.optional(S.String),
    TagList: S.optional(TagList),
    AdditionalEncryptionContext: S.optional(EncryptionContextMap),
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
export interface CreateScheduledActionMessage {
  ScheduledActionName?: string;
  TargetAction?: ScheduledActionType;
  Schedule?: string;
  IamRole?: string;
  ScheduledActionDescription?: string;
  StartTime?: Date;
  EndTime?: Date;
  Enable?: boolean;
}
export const CreateScheduledActionMessage = S.suspend(() =>
  S.Struct({
    ScheduledActionName: S.optional(S.String),
    TargetAction: S.optional(ScheduledActionType),
    Schedule: S.optional(S.String),
    IamRole: S.optional(S.String),
    ScheduledActionDescription: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Enable: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateScheduledActionMessage",
}) as any as S.Schema<CreateScheduledActionMessage>;
export interface DeleteAuthenticationProfileResult {
  AuthenticationProfileName?: string;
}
export const DeleteAuthenticationProfileResult = S.suspend(() =>
  S.Struct({ AuthenticationProfileName: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteAuthenticationProfileResult",
}) as any as S.Schema<DeleteAuthenticationProfileResult>;
export interface DeleteClusterSnapshotResult {
  Snapshot?: Snapshot;
}
export const DeleteClusterSnapshotResult = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "DeleteClusterSnapshotResult",
}) as any as S.Schema<DeleteClusterSnapshotResult>;
export interface ClusterParameterGroupsMessage {
  Marker?: string;
  ParameterGroups?: ClusterParameterGroup[];
}
export const ClusterParameterGroupsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ParameterGroups: S.optional(ParameterGroupList),
  }).pipe(ns),
).annotations({
  identifier: "ClusterParameterGroupsMessage",
}) as any as S.Schema<ClusterParameterGroupsMessage>;
export interface ClusterParameterGroupDetails {
  Parameters?: Parameter[];
  Marker?: string;
}
export const ClusterParameterGroupDetails = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(ParametersList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ClusterParameterGroupDetails",
}) as any as S.Schema<ClusterParameterGroupDetails>;
export interface ClustersMessage {
  Marker?: string;
  Clusters?: Cluster[];
}
export const ClustersMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Clusters: S.optional(ClusterList),
  }).pipe(ns),
).annotations({
  identifier: "ClustersMessage",
}) as any as S.Schema<ClustersMessage>;
export interface ClusterSecurityGroupMessage {
  Marker?: string;
  ClusterSecurityGroups?: ClusterSecurityGroup[];
}
export const ClusterSecurityGroupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ClusterSecurityGroups: S.optional(ClusterSecurityGroups),
  }).pipe(ns),
).annotations({
  identifier: "ClusterSecurityGroupMessage",
}) as any as S.Schema<ClusterSecurityGroupMessage>;
export interface DescribeClusterSnapshotsMessage {
  ClusterIdentifier?: string;
  SnapshotIdentifier?: string;
  SnapshotArn?: string;
  SnapshotType?: string;
  StartTime?: Date;
  EndTime?: Date;
  MaxRecords?: number;
  Marker?: string;
  OwnerAccount?: string;
  TagKeys?: string[];
  TagValues?: string[];
  ClusterExists?: boolean;
  SortingEntities?: SnapshotSortingEntity[];
}
export const DescribeClusterSnapshotsMessage = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    OwnerAccount: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
    ClusterExists: S.optional(S.Boolean),
    SortingEntities: S.optional(SnapshotSortingEntityList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterSnapshotsMessage",
}) as any as S.Schema<DescribeClusterSnapshotsMessage>;
export interface ClusterSubnetGroupMessage {
  Marker?: string;
  ClusterSubnetGroups?: ClusterSubnetGroup[];
}
export const ClusterSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ClusterSubnetGroups: S.optional(ClusterSubnetGroups),
  }).pipe(ns),
).annotations({
  identifier: "ClusterSubnetGroupMessage",
}) as any as S.Schema<ClusterSubnetGroupMessage>;
export interface DescribeDataSharesResult {
  DataShares?: DataShare[];
  Marker?: string;
}
export const DescribeDataSharesResult = S.suspend(() =>
  S.Struct({
    DataShares: S.optional(DataShareList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDataSharesResult",
}) as any as S.Schema<DescribeDataSharesResult>;
export interface DescribeDataSharesForConsumerResult {
  DataShares?: DataShare[];
  Marker?: string;
}
export const DescribeDataSharesForConsumerResult = S.suspend(() =>
  S.Struct({
    DataShares: S.optional(DataShareList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDataSharesForConsumerResult",
}) as any as S.Schema<DescribeDataSharesForConsumerResult>;
export interface DescribeDataSharesForProducerResult {
  DataShares?: DataShare[];
  Marker?: string;
}
export const DescribeDataSharesForProducerResult = S.suspend(() =>
  S.Struct({
    DataShares: S.optional(DataShareList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDataSharesForProducerResult",
}) as any as S.Schema<DescribeDataSharesForProducerResult>;
export interface EndpointAccessList {
  EndpointAccessList?: EndpointAccess[];
  Marker?: string;
}
export const EndpointAccessList = S.suspend(() =>
  S.Struct({
    EndpointAccessList: S.optional(EndpointAccesses),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EndpointAccessList",
}) as any as S.Schema<EndpointAccessList>;
export interface EndpointAuthorizationList {
  EndpointAuthorizationList?: EndpointAuthorization[];
  Marker?: string;
}
export const EndpointAuthorizationList = S.suspend(() =>
  S.Struct({
    EndpointAuthorizationList: S.optional(EndpointAuthorizations),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EndpointAuthorizationList",
}) as any as S.Schema<EndpointAuthorizationList>;
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
export interface HsmClientCertificateMessage {
  Marker?: string;
  HsmClientCertificates?: HsmClientCertificate[];
}
export const HsmClientCertificateMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    HsmClientCertificates: S.optional(HsmClientCertificateList),
  }).pipe(ns),
).annotations({
  identifier: "HsmClientCertificateMessage",
}) as any as S.Schema<HsmClientCertificateMessage>;
export interface HsmConfigurationMessage {
  Marker?: string;
  HsmConfigurations?: HsmConfiguration[];
}
export const HsmConfigurationMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    HsmConfigurations: S.optional(HsmConfigurationList),
  }).pipe(ns),
).annotations({
  identifier: "HsmConfigurationMessage",
}) as any as S.Schema<HsmConfigurationMessage>;
export interface DescribeIntegrationsMessage {
  IntegrationArn?: string;
  MaxRecords?: number;
  Marker?: string;
  Filters?: DescribeIntegrationsFilter[];
}
export const DescribeIntegrationsMessage = S.suspend(() =>
  S.Struct({
    IntegrationArn: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    Filters: S.optional(DescribeIntegrationsFilterList),
  }).pipe(
    T.all(
      ns,
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
export interface LoggingStatus {
  LoggingEnabled?: boolean;
  BucketName?: string;
  S3KeyPrefix?: string;
  LastSuccessfulDeliveryTime?: Date;
  LastFailureTime?: Date;
  LastFailureMessage?: string;
  LogDestinationType?: LogDestinationType;
  LogExports?: string[];
}
export const LoggingStatus = S.suspend(() =>
  S.Struct({
    LoggingEnabled: S.optional(S.Boolean),
    BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    LastSuccessfulDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    LastFailureTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastFailureMessage: S.optional(S.String),
    LogDestinationType: S.optional(LogDestinationType),
    LogExports: S.optional(LogTypeList),
  }).pipe(ns),
).annotations({
  identifier: "LoggingStatus",
}) as any as S.Schema<LoggingStatus>;
export interface DescribeNodeConfigurationOptionsMessage {
  ActionType?: ActionType;
  ClusterIdentifier?: string;
  SnapshotIdentifier?: string;
  SnapshotArn?: string;
  OwnerAccount?: string;
  Filters?: NodeConfigurationOptionsFilter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeNodeConfigurationOptionsMessage = S.suspend(() =>
  S.Struct({
    ActionType: S.optional(ActionType),
    ClusterIdentifier: S.optional(S.String),
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    OwnerAccount: S.optional(S.String),
    Filters: S.optional(NodeConfigurationOptionsFilterList).pipe(
      T.XmlName("Filter"),
    ),
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
  identifier: "DescribeNodeConfigurationOptionsMessage",
}) as any as S.Schema<DescribeNodeConfigurationOptionsMessage>;
export interface ReservedNodesMessage {
  Marker?: string;
  ReservedNodes?: ReservedNode[];
}
export const ReservedNodesMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ReservedNodes: S.optional(ReservedNodeList),
  }).pipe(ns),
).annotations({
  identifier: "ReservedNodesMessage",
}) as any as S.Schema<ReservedNodesMessage>;
export interface DescribeScheduledActionsMessage {
  ScheduledActionName?: string;
  TargetActionType?: ScheduledActionTypeValues;
  StartTime?: Date;
  EndTime?: Date;
  Active?: boolean;
  Filters?: ScheduledActionFilter[];
  Marker?: string;
  MaxRecords?: number;
}
export const DescribeScheduledActionsMessage = S.suspend(() =>
  S.Struct({
    ScheduledActionName: S.optional(S.String),
    TargetActionType: S.optional(ScheduledActionTypeValues),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Active: S.optional(S.Boolean),
    Filters: S.optional(ScheduledActionFilterList),
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
  identifier: "DescribeScheduledActionsMessage",
}) as any as S.Schema<DescribeScheduledActionsMessage>;
export interface SnapshotCopyGrantMessage {
  Marker?: string;
  SnapshotCopyGrants?: SnapshotCopyGrant[];
}
export const SnapshotCopyGrantMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    SnapshotCopyGrants: S.optional(SnapshotCopyGrantList),
  }).pipe(ns),
).annotations({
  identifier: "SnapshotCopyGrantMessage",
}) as any as S.Schema<SnapshotCopyGrantMessage>;
export interface DescribeSnapshotSchedulesOutputMessage {
  SnapshotSchedules?: SnapshotSchedule[];
  Marker?: string;
}
export const DescribeSnapshotSchedulesOutputMessage = S.suspend(() =>
  S.Struct({
    SnapshotSchedules: S.optional(SnapshotScheduleList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSnapshotSchedulesOutputMessage",
}) as any as S.Schema<DescribeSnapshotSchedulesOutputMessage>;
export interface UsageLimitList {
  UsageLimits?: UsageLimit[];
  Marker?: string;
}
export const UsageLimitList = S.suspend(() =>
  S.Struct({
    UsageLimits: S.optional(UsageLimits),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UsageLimitList",
}) as any as S.Schema<UsageLimitList>;
export interface DisableSnapshotCopyResult {
  Cluster?: Cluster;
}
export const DisableSnapshotCopyResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "DisableSnapshotCopyResult",
}) as any as S.Schema<DisableSnapshotCopyResult>;
export interface EnableSnapshotCopyResult {
  Cluster?: Cluster;
}
export const EnableSnapshotCopyResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "EnableSnapshotCopyResult",
}) as any as S.Schema<EnableSnapshotCopyResult>;
export interface FailoverPrimaryComputeResult {
  Cluster?: Cluster;
}
export const FailoverPrimaryComputeResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "FailoverPrimaryComputeResult",
}) as any as S.Schema<FailoverPrimaryComputeResult>;
export interface ClusterCredentials {
  DbUser?: string;
  DbPassword?: string | redacted.Redacted<string>;
  Expiration?: Date;
}
export const ClusterCredentials = S.suspend(() =>
  S.Struct({
    DbUser: S.optional(S.String),
    DbPassword: S.optional(SensitiveString),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }).pipe(ns),
).annotations({
  identifier: "ClusterCredentials",
}) as any as S.Schema<ClusterCredentials>;
export interface ClusterExtendedCredentials {
  DbUser?: string;
  DbPassword?: string | redacted.Redacted<string>;
  Expiration?: Date;
  NextRefreshTime?: Date;
}
export const ClusterExtendedCredentials = S.suspend(() =>
  S.Struct({
    DbUser: S.optional(S.String),
    DbPassword: S.optional(SensitiveString),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NextRefreshTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }).pipe(ns),
).annotations({
  identifier: "ClusterExtendedCredentials",
}) as any as S.Schema<ClusterExtendedCredentials>;
export interface GetIdentityCenterAuthTokenResponse {
  Token?: string | redacted.Redacted<string>;
  ExpirationTime?: Date;
}
export const GetIdentityCenterAuthTokenResponse = S.suspend(() =>
  S.Struct({
    Token: S.optional(SensitiveString),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }).pipe(ns),
).annotations({
  identifier: "GetIdentityCenterAuthTokenResponse",
}) as any as S.Schema<GetIdentityCenterAuthTokenResponse>;
export interface ReservedNodeOffering {
  ReservedNodeOfferingId?: string;
  NodeType?: string;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  CurrencyCode?: string;
  OfferingType?: string;
  RecurringCharges?: RecurringCharge[];
  ReservedNodeOfferingType?: ReservedNodeOfferingType;
}
export const ReservedNodeOffering = S.suspend(() =>
  S.Struct({
    ReservedNodeOfferingId: S.optional(S.String),
    NodeType: S.optional(S.String),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    UsagePrice: S.optional(S.Number),
    CurrencyCode: S.optional(S.String),
    OfferingType: S.optional(S.String),
    RecurringCharges: S.optional(RecurringChargeList),
    ReservedNodeOfferingType: S.optional(ReservedNodeOfferingType),
  }),
).annotations({
  identifier: "ReservedNodeOffering",
}) as any as S.Schema<ReservedNodeOffering>;
export type ReservedNodeOfferingList = ReservedNodeOffering[];
export const ReservedNodeOfferingList = S.Array(
  ReservedNodeOffering.pipe(T.XmlName("ReservedNodeOffering")).annotations({
    identifier: "ReservedNodeOffering",
  }),
);
export interface GetReservedNodeExchangeOfferingsOutputMessage {
  Marker?: string;
  ReservedNodeOfferings?: ReservedNodeOffering[];
}
export const GetReservedNodeExchangeOfferingsOutputMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ReservedNodeOfferings: S.optional(ReservedNodeOfferingList),
  }).pipe(ns),
).annotations({
  identifier: "GetReservedNodeExchangeOfferingsOutputMessage",
}) as any as S.Schema<GetReservedNodeExchangeOfferingsOutputMessage>;
export interface ModifyAuthenticationProfileResult {
  AuthenticationProfileName?: string;
  AuthenticationProfileContent?: string;
}
export const ModifyAuthenticationProfileResult = S.suspend(() =>
  S.Struct({
    AuthenticationProfileName: S.optional(S.String),
    AuthenticationProfileContent: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ModifyAuthenticationProfileResult",
}) as any as S.Schema<ModifyAuthenticationProfileResult>;
export interface ModifyClusterResult {
  Cluster?: Cluster;
}
export const ModifyClusterResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "ModifyClusterResult",
}) as any as S.Schema<ModifyClusterResult>;
export interface ModifyClusterDbRevisionResult {
  Cluster?: Cluster;
}
export const ModifyClusterDbRevisionResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "ModifyClusterDbRevisionResult",
}) as any as S.Schema<ModifyClusterDbRevisionResult>;
export interface ModifyClusterIamRolesResult {
  Cluster?: Cluster;
}
export const ModifyClusterIamRolesResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "ModifyClusterIamRolesResult",
}) as any as S.Schema<ModifyClusterIamRolesResult>;
export interface ModifyClusterMaintenanceResult {
  Cluster?: Cluster;
}
export const ModifyClusterMaintenanceResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "ModifyClusterMaintenanceResult",
}) as any as S.Schema<ModifyClusterMaintenanceResult>;
export interface ModifyClusterParameterGroupMessage {
  ParameterGroupName?: string;
  Parameters?: Parameter[];
}
export const ModifyClusterParameterGroupMessage = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
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
  identifier: "ModifyClusterParameterGroupMessage",
}) as any as S.Schema<ModifyClusterParameterGroupMessage>;
export interface ModifyClusterSnapshotResult {
  Snapshot?: Snapshot;
}
export const ModifyClusterSnapshotResult = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "ModifyClusterSnapshotResult",
}) as any as S.Schema<ModifyClusterSnapshotResult>;
export interface ModifyClusterSubnetGroupResult {
  ClusterSubnetGroup?: ClusterSubnetGroup;
}
export const ModifyClusterSubnetGroupResult = S.suspend(() =>
  S.Struct({ ClusterSubnetGroup: S.optional(ClusterSubnetGroup) }).pipe(ns),
).annotations({
  identifier: "ModifyClusterSubnetGroupResult",
}) as any as S.Schema<ModifyClusterSubnetGroupResult>;
export interface ModifyCustomDomainAssociationResult {
  CustomDomainName?: string;
  CustomDomainCertificateArn?: string;
  ClusterIdentifier?: string;
  CustomDomainCertExpiryTime?: string;
}
export const ModifyCustomDomainAssociationResult = S.suspend(() =>
  S.Struct({
    CustomDomainName: S.optional(S.String),
    CustomDomainCertificateArn: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    CustomDomainCertExpiryTime: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ModifyCustomDomainAssociationResult",
}) as any as S.Schema<ModifyCustomDomainAssociationResult>;
export interface ModifyEventSubscriptionResult {
  EventSubscription?: EventSubscription;
}
export const ModifyEventSubscriptionResult = S.suspend(() =>
  S.Struct({ EventSubscription: S.optional(EventSubscription) }).pipe(ns),
).annotations({
  identifier: "ModifyEventSubscriptionResult",
}) as any as S.Schema<ModifyEventSubscriptionResult>;
export interface LakehouseConfiguration {
  ClusterIdentifier?: string;
  LakehouseIdcApplicationArn?: string;
  LakehouseRegistrationStatus?: string;
  CatalogArn?: string;
}
export const LakehouseConfiguration = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    LakehouseIdcApplicationArn: S.optional(S.String),
    LakehouseRegistrationStatus: S.optional(S.String),
    CatalogArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "LakehouseConfiguration",
}) as any as S.Schema<LakehouseConfiguration>;
export interface RedshiftIdcApplication {
  IdcInstanceArn?: string;
  RedshiftIdcApplicationName?: string;
  RedshiftIdcApplicationArn?: string;
  IdentityNamespace?: string;
  IdcDisplayName?: string;
  IamRoleArn?: string;
  IdcManagedApplicationArn?: string;
  IdcOnboardStatus?: string;
  AuthorizedTokenIssuerList?: AuthorizedTokenIssuer[];
  ServiceIntegrations?: ServiceIntegrationsUnion[];
  ApplicationType?: ApplicationType;
  Tags?: Tag[];
  SsoTagKeys?: string[];
}
export const RedshiftIdcApplication = S.suspend(() =>
  S.Struct({
    IdcInstanceArn: S.optional(S.String),
    RedshiftIdcApplicationName: S.optional(S.String),
    RedshiftIdcApplicationArn: S.optional(S.String),
    IdentityNamespace: S.optional(S.String),
    IdcDisplayName: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
    IdcManagedApplicationArn: S.optional(S.String),
    IdcOnboardStatus: S.optional(S.String),
    AuthorizedTokenIssuerList: S.optional(AuthorizedTokenIssuerList),
    ServiceIntegrations: S.optional(ServiceIntegrationList),
    ApplicationType: S.optional(ApplicationType),
    Tags: S.optional(TagList),
    SsoTagKeys: S.optional(TagKeyList),
  }),
).annotations({
  identifier: "RedshiftIdcApplication",
}) as any as S.Schema<RedshiftIdcApplication>;
export interface ModifyRedshiftIdcApplicationResult {
  RedshiftIdcApplication?: RedshiftIdcApplication;
}
export const ModifyRedshiftIdcApplicationResult = S.suspend(() =>
  S.Struct({ RedshiftIdcApplication: S.optional(RedshiftIdcApplication) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ModifyRedshiftIdcApplicationResult",
}) as any as S.Schema<ModifyRedshiftIdcApplicationResult>;
export interface ScheduledAction {
  ScheduledActionName?: string;
  TargetAction?: ScheduledActionType & {
    ResizeCluster: ResizeClusterMessage & { ClusterIdentifier: string };
    PauseCluster: PauseClusterMessage & { ClusterIdentifier: string };
    ResumeCluster: ResumeClusterMessage & { ClusterIdentifier: string };
  };
  Schedule?: string;
  IamRole?: string;
  ScheduledActionDescription?: string;
  State?: ScheduledActionState;
  NextInvocations?: Date[];
  StartTime?: Date;
  EndTime?: Date;
}
export const ScheduledAction = S.suspend(() =>
  S.Struct({
    ScheduledActionName: S.optional(S.String),
    TargetAction: S.optional(ScheduledActionType),
    Schedule: S.optional(S.String),
    IamRole: S.optional(S.String),
    ScheduledActionDescription: S.optional(S.String),
    State: S.optional(ScheduledActionState),
    NextInvocations: S.optional(ScheduledActionTimeList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }).pipe(ns),
).annotations({
  identifier: "ScheduledAction",
}) as any as S.Schema<ScheduledAction>;
export interface ModifySnapshotCopyRetentionPeriodResult {
  Cluster?: Cluster;
}
export const ModifySnapshotCopyRetentionPeriodResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "ModifySnapshotCopyRetentionPeriodResult",
}) as any as S.Schema<ModifySnapshotCopyRetentionPeriodResult>;
export interface PauseClusterResult {
  Cluster?: Cluster;
}
export const PauseClusterResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "PauseClusterResult",
}) as any as S.Schema<PauseClusterResult>;
export interface PurchaseReservedNodeOfferingResult {
  ReservedNode?: ReservedNode;
}
export const PurchaseReservedNodeOfferingResult = S.suspend(() =>
  S.Struct({ ReservedNode: S.optional(ReservedNode) }).pipe(ns),
).annotations({
  identifier: "PurchaseReservedNodeOfferingResult",
}) as any as S.Schema<PurchaseReservedNodeOfferingResult>;
export interface ResourcePolicy {
  ResourceArn?: string;
  Policy?: string;
}
export const ResourcePolicy = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String), Policy: S.optional(S.String) }),
).annotations({
  identifier: "ResourcePolicy",
}) as any as S.Schema<ResourcePolicy>;
export interface PutResourcePolicyResult {
  ResourcePolicy?: ResourcePolicy;
}
export const PutResourcePolicyResult = S.suspend(() =>
  S.Struct({ ResourcePolicy: S.optional(ResourcePolicy) }).pipe(ns),
).annotations({
  identifier: "PutResourcePolicyResult",
}) as any as S.Schema<PutResourcePolicyResult>;
export interface RebootClusterResult {
  Cluster?: Cluster;
}
export const RebootClusterResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "RebootClusterResult",
}) as any as S.Schema<RebootClusterResult>;
export interface RegisterNamespaceOutputMessage {
  Status?: NamespaceRegistrationStatus;
}
export const RegisterNamespaceOutputMessage = S.suspend(() =>
  S.Struct({ Status: S.optional(NamespaceRegistrationStatus) }).pipe(ns),
).annotations({
  identifier: "RegisterNamespaceOutputMessage",
}) as any as S.Schema<RegisterNamespaceOutputMessage>;
export interface ClusterParameterGroupNameMessage {
  ParameterGroupName?: string;
  ParameterGroupStatus?: string;
}
export const ClusterParameterGroupNameMessage = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
    ParameterGroupStatus: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ClusterParameterGroupNameMessage",
}) as any as S.Schema<ClusterParameterGroupNameMessage>;
export interface ResizeClusterResult {
  Cluster?: Cluster;
}
export const ResizeClusterResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "ResizeClusterResult",
}) as any as S.Schema<ResizeClusterResult>;
export interface RestoreFromClusterSnapshotResult {
  Cluster?: Cluster;
}
export const RestoreFromClusterSnapshotResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "RestoreFromClusterSnapshotResult",
}) as any as S.Schema<RestoreFromClusterSnapshotResult>;
export type TableRestoreStatusType =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED";
export const TableRestoreStatusType = S.Literal(
  "PENDING",
  "IN_PROGRESS",
  "SUCCEEDED",
  "FAILED",
  "CANCELED",
);
export interface TableRestoreStatus {
  TableRestoreRequestId?: string;
  Status?: TableRestoreStatusType;
  Message?: string;
  RequestTime?: Date;
  ProgressInMegaBytes?: number;
  TotalDataInMegaBytes?: number;
  ClusterIdentifier?: string;
  SnapshotIdentifier?: string;
  SourceDatabaseName?: string;
  SourceSchemaName?: string;
  SourceTableName?: string;
  TargetDatabaseName?: string;
  TargetSchemaName?: string;
  NewTableName?: string;
}
export const TableRestoreStatus = S.suspend(() =>
  S.Struct({
    TableRestoreRequestId: S.optional(S.String),
    Status: S.optional(TableRestoreStatusType),
    Message: S.optional(S.String),
    RequestTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ProgressInMegaBytes: S.optional(S.Number),
    TotalDataInMegaBytes: S.optional(S.Number),
    ClusterIdentifier: S.optional(S.String),
    SnapshotIdentifier: S.optional(S.String),
    SourceDatabaseName: S.optional(S.String),
    SourceSchemaName: S.optional(S.String),
    SourceTableName: S.optional(S.String),
    TargetDatabaseName: S.optional(S.String),
    TargetSchemaName: S.optional(S.String),
    NewTableName: S.optional(S.String),
  }),
).annotations({
  identifier: "TableRestoreStatus",
}) as any as S.Schema<TableRestoreStatus>;
export interface RestoreTableFromClusterSnapshotResult {
  TableRestoreStatus?: TableRestoreStatus;
}
export const RestoreTableFromClusterSnapshotResult = S.suspend(() =>
  S.Struct({ TableRestoreStatus: S.optional(TableRestoreStatus) }).pipe(ns),
).annotations({
  identifier: "RestoreTableFromClusterSnapshotResult",
}) as any as S.Schema<RestoreTableFromClusterSnapshotResult>;
export interface ResumeClusterResult {
  Cluster?: Cluster;
}
export const ResumeClusterResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "ResumeClusterResult",
}) as any as S.Schema<ResumeClusterResult>;
export interface RevokeClusterSecurityGroupIngressResult {
  ClusterSecurityGroup?: ClusterSecurityGroup;
}
export const RevokeClusterSecurityGroupIngressResult = S.suspend(() =>
  S.Struct({ ClusterSecurityGroup: S.optional(ClusterSecurityGroup) }).pipe(ns),
).annotations({
  identifier: "RevokeClusterSecurityGroupIngressResult",
}) as any as S.Schema<RevokeClusterSecurityGroupIngressResult>;
export interface RevokeSnapshotAccessResult {
  Snapshot?: Snapshot;
}
export const RevokeSnapshotAccessResult = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "RevokeSnapshotAccessResult",
}) as any as S.Schema<RevokeSnapshotAccessResult>;
export interface RotateEncryptionKeyResult {
  Cluster?: Cluster;
}
export const RotateEncryptionKeyResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "RotateEncryptionKeyResult",
}) as any as S.Schema<RotateEncryptionKeyResult>;
export type ImpactRankingType = "HIGH" | "MEDIUM" | "LOW";
export const ImpactRankingType = S.Literal("HIGH", "MEDIUM", "LOW");
export type BatchSnapshotOperationErrorList = SnapshotErrorMessage[];
export const BatchSnapshotOperationErrorList = S.Array(
  SnapshotErrorMessage.pipe(T.XmlName("SnapshotErrorMessage")).annotations({
    identifier: "SnapshotErrorMessage",
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
export interface AuthenticationProfile {
  AuthenticationProfileName?: string;
  AuthenticationProfileContent?: string;
}
export const AuthenticationProfile = S.suspend(() =>
  S.Struct({
    AuthenticationProfileName: S.optional(S.String),
    AuthenticationProfileContent: S.optional(S.String),
  }),
).annotations({
  identifier: "AuthenticationProfile",
}) as any as S.Schema<AuthenticationProfile>;
export type AuthenticationProfileList = AuthenticationProfile[];
export const AuthenticationProfileList = S.Array(AuthenticationProfile);
export type SnapshotList = Snapshot[];
export const SnapshotList = S.Array(
  Snapshot.pipe(T.XmlName("Snapshot")).annotations({ identifier: "Snapshot" }),
);
export interface ClusterVersion {
  ClusterVersion?: string;
  ClusterParameterGroupFamily?: string;
  Description?: string;
}
export const ClusterVersion = S.suspend(() =>
  S.Struct({
    ClusterVersion: S.optional(S.String),
    ClusterParameterGroupFamily: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterVersion",
}) as any as S.Schema<ClusterVersion>;
export type ClusterVersionList = ClusterVersion[];
export const ClusterVersionList = S.Array(
  ClusterVersion.pipe(T.XmlName("ClusterVersion")).annotations({
    identifier: "ClusterVersion",
  }),
);
export interface DefaultClusterParameters {
  ParameterGroupFamily?: string;
  Marker?: string;
  Parameters?: Parameter[];
}
export const DefaultClusterParameters = S.suspend(() =>
  S.Struct({
    ParameterGroupFamily: S.optional(S.String),
    Marker: S.optional(S.String),
    Parameters: S.optional(ParametersList),
  }),
).annotations({
  identifier: "DefaultClusterParameters",
}) as any as S.Schema<DefaultClusterParameters>;
export interface Event {
  SourceIdentifier?: string;
  SourceType?: SourceType;
  Message?: string;
  EventCategories?: string[];
  Severity?: string;
  Date?: Date;
  EventId?: string;
}
export const Event = S.suspend(() =>
  S.Struct({
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(SourceType),
    Message: S.optional(S.String),
    EventCategories: S.optional(EventCategoriesList),
    Severity: S.optional(S.String),
    Date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EventId: S.optional(S.String),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type EventList = Event[];
export const EventList = S.Array(
  Event.pipe(T.XmlName("Event")).annotations({ identifier: "Event" }),
);
export interface InboundIntegration {
  IntegrationArn?: string;
  SourceArn?: string;
  TargetArn?: string;
  Status?: ZeroETLIntegrationStatus;
  Errors?: IntegrationError[];
  CreateTime?: Date;
}
export const InboundIntegration = S.suspend(() =>
  S.Struct({
    IntegrationArn: S.optional(S.String),
    SourceArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    Status: S.optional(ZeroETLIntegrationStatus),
    Errors: S.optional(IntegrationErrorList),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "InboundIntegration",
}) as any as S.Schema<InboundIntegration>;
export type InboundIntegrationList = InboundIntegration[];
export const InboundIntegrationList = S.Array(
  InboundIntegration.pipe(T.XmlName("InboundIntegration")).annotations({
    identifier: "InboundIntegration",
  }),
);
export interface Integration {
  IntegrationArn?: string;
  IntegrationName?: string;
  SourceArn?: string;
  TargetArn?: string;
  Status?: ZeroETLIntegrationStatus;
  Errors?: (IntegrationError & { ErrorCode: string })[];
  CreateTime?: Date;
  Description?: string;
  KMSKeyId?: string;
  AdditionalEncryptionContext?: { [key: string]: string };
  Tags?: Tag[];
}
export const Integration = S.suspend(() =>
  S.Struct({
    IntegrationArn: S.optional(S.String),
    IntegrationName: S.optional(S.String),
    SourceArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    Status: S.optional(ZeroETLIntegrationStatus),
    Errors: S.optional(IntegrationErrorList),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    KMSKeyId: S.optional(S.String),
    AdditionalEncryptionContext: S.optional(EncryptionContextMap),
    Tags: S.optional(TagList),
  }).pipe(ns),
).annotations({ identifier: "Integration" }) as any as S.Schema<Integration>;
export type IntegrationList = Integration[];
export const IntegrationList = S.Array(
  Integration.pipe(T.XmlName("Integration")).annotations({
    identifier: "Integration",
  }),
);
export interface PartnerIntegrationInfo {
  DatabaseName?: string;
  PartnerName?: string;
  Status?: PartnerIntegrationStatus;
  StatusMessage?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const PartnerIntegrationInfo = S.suspend(() =>
  S.Struct({
    DatabaseName: S.optional(S.String),
    PartnerName: S.optional(S.String),
    Status: S.optional(PartnerIntegrationStatus),
    StatusMessage: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "PartnerIntegrationInfo",
}) as any as S.Schema<PartnerIntegrationInfo>;
export type PartnerIntegrationInfoList = PartnerIntegrationInfo[];
export const PartnerIntegrationInfoList = S.Array(
  PartnerIntegrationInfo.pipe(T.XmlName("PartnerIntegrationInfo")).annotations({
    identifier: "PartnerIntegrationInfo",
  }),
);
export type RedshiftIdcApplicationList = RedshiftIdcApplication[];
export const RedshiftIdcApplicationList = S.Array(RedshiftIdcApplication);
export type ReservedNodeExchangeStatusList = ReservedNodeExchangeStatus[];
export const ReservedNodeExchangeStatusList = S.Array(
  ReservedNodeExchangeStatus.pipe(
    T.XmlName("ReservedNodeExchangeStatus"),
  ).annotations({ identifier: "ReservedNodeExchangeStatus" }),
);
export type ScheduledActionList = ScheduledAction[];
export const ScheduledActionList = S.Array(
  ScheduledAction.pipe(T.XmlName("ScheduledAction")).annotations({
    identifier: "ScheduledAction",
  }),
);
export type TableRestoreStatusList = TableRestoreStatus[];
export const TableRestoreStatusList = S.Array(
  TableRestoreStatus.pipe(T.XmlName("TableRestoreStatus")).annotations({
    identifier: "TableRestoreStatus",
  }),
);
export interface TaggedResource {
  Tag?: Tag;
  ResourceName?: string;
  ResourceType?: string;
}
export const TaggedResource = S.suspend(() =>
  S.Struct({
    Tag: S.optional(Tag),
    ResourceName: S.optional(S.String),
    ResourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "TaggedResource",
}) as any as S.Schema<TaggedResource>;
export type TaggedResourceList = TaggedResource[];
export const TaggedResourceList = S.Array(
  TaggedResource.pipe(T.XmlName("TaggedResource")).annotations({
    identifier: "TaggedResource",
  }),
);
export interface ReservedNodeConfigurationOption {
  SourceReservedNode?: ReservedNode;
  TargetReservedNodeCount?: number;
  TargetReservedNodeOffering?: ReservedNodeOffering;
}
export const ReservedNodeConfigurationOption = S.suspend(() =>
  S.Struct({
    SourceReservedNode: S.optional(ReservedNode),
    TargetReservedNodeCount: S.optional(S.Number),
    TargetReservedNodeOffering: S.optional(ReservedNodeOffering),
  }),
).annotations({
  identifier: "ReservedNodeConfigurationOption",
}) as any as S.Schema<ReservedNodeConfigurationOption>;
export type ReservedNodeConfigurationOptionList =
  ReservedNodeConfigurationOption[];
export const ReservedNodeConfigurationOptionList = S.Array(
  ReservedNodeConfigurationOption.pipe(
    T.XmlName("ReservedNodeConfigurationOption"),
  ).annotations({ identifier: "ReservedNodeConfigurationOption" }),
);
export type RecommendedActionType = "SQL" | "CLI";
export const RecommendedActionType = S.Literal("SQL", "CLI");
export interface BatchDeleteClusterSnapshotsResult {
  Resources?: string[];
  Errors?: SnapshotErrorMessage[];
}
export const BatchDeleteClusterSnapshotsResult = S.suspend(() =>
  S.Struct({
    Resources: S.optional(SnapshotIdentifierList),
    Errors: S.optional(BatchSnapshotOperationErrorList),
  }).pipe(ns),
).annotations({
  identifier: "BatchDeleteClusterSnapshotsResult",
}) as any as S.Schema<BatchDeleteClusterSnapshotsResult>;
export interface CreateClusterResult {
  Cluster?: Cluster;
}
export const CreateClusterResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "CreateClusterResult",
}) as any as S.Schema<CreateClusterResult>;
export interface CreateClusterParameterGroupResult {
  ClusterParameterGroup?: ClusterParameterGroup;
}
export const CreateClusterParameterGroupResult = S.suspend(() =>
  S.Struct({ ClusterParameterGroup: S.optional(ClusterParameterGroup) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CreateClusterParameterGroupResult",
}) as any as S.Schema<CreateClusterParameterGroupResult>;
export interface CreateEventSubscriptionResult {
  EventSubscription?: EventSubscription;
}
export const CreateEventSubscriptionResult = S.suspend(() =>
  S.Struct({ EventSubscription: S.optional(EventSubscription) }).pipe(ns),
).annotations({
  identifier: "CreateEventSubscriptionResult",
}) as any as S.Schema<CreateEventSubscriptionResult>;
export interface CreateHsmClientCertificateResult {
  HsmClientCertificate?: HsmClientCertificate;
}
export const CreateHsmClientCertificateResult = S.suspend(() =>
  S.Struct({ HsmClientCertificate: S.optional(HsmClientCertificate) }).pipe(ns),
).annotations({
  identifier: "CreateHsmClientCertificateResult",
}) as any as S.Schema<CreateHsmClientCertificateResult>;
export interface CreateHsmConfigurationResult {
  HsmConfiguration?: HsmConfiguration;
}
export const CreateHsmConfigurationResult = S.suspend(() =>
  S.Struct({ HsmConfiguration: S.optional(HsmConfiguration) }).pipe(ns),
).annotations({
  identifier: "CreateHsmConfigurationResult",
}) as any as S.Schema<CreateHsmConfigurationResult>;
export interface CreateSnapshotCopyGrantResult {
  SnapshotCopyGrant?: SnapshotCopyGrant;
}
export const CreateSnapshotCopyGrantResult = S.suspend(() =>
  S.Struct({ SnapshotCopyGrant: S.optional(SnapshotCopyGrant) }).pipe(ns),
).annotations({
  identifier: "CreateSnapshotCopyGrantResult",
}) as any as S.Schema<CreateSnapshotCopyGrantResult>;
export interface DeregisterNamespaceInputMessage {
  NamespaceIdentifier?: NamespaceIdentifierUnion;
  ConsumerIdentifiers?: string[];
}
export const DeregisterNamespaceInputMessage = S.suspend(() =>
  S.Struct({
    NamespaceIdentifier: S.optional(NamespaceIdentifierUnion),
    ConsumerIdentifiers: S.optional(ConsumerIdentifierList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterNamespaceInputMessage",
}) as any as S.Schema<DeregisterNamespaceInputMessage>;
export interface DescribeAuthenticationProfilesResult {
  AuthenticationProfiles?: AuthenticationProfile[];
}
export const DescribeAuthenticationProfilesResult = S.suspend(() =>
  S.Struct({
    AuthenticationProfiles: S.optional(AuthenticationProfileList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAuthenticationProfilesResult",
}) as any as S.Schema<DescribeAuthenticationProfilesResult>;
export interface SnapshotMessage {
  Marker?: string;
  Snapshots?: Snapshot[];
}
export const SnapshotMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Snapshots: S.optional(SnapshotList),
  }).pipe(ns),
).annotations({
  identifier: "SnapshotMessage",
}) as any as S.Schema<SnapshotMessage>;
export interface ClusterVersionsMessage {
  Marker?: string;
  ClusterVersions?: ClusterVersion[];
}
export const ClusterVersionsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ClusterVersions: S.optional(ClusterVersionList),
  }).pipe(ns),
).annotations({
  identifier: "ClusterVersionsMessage",
}) as any as S.Schema<ClusterVersionsMessage>;
export interface DescribeDefaultClusterParametersResult {
  DefaultClusterParameters?: DefaultClusterParameters;
}
export const DescribeDefaultClusterParametersResult = S.suspend(() =>
  S.Struct({
    DefaultClusterParameters: S.optional(DefaultClusterParameters),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDefaultClusterParametersResult",
}) as any as S.Schema<DescribeDefaultClusterParametersResult>;
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
export interface InboundIntegrationsMessage {
  Marker?: string;
  InboundIntegrations?: (InboundIntegration & {
    Errors: (IntegrationError & { ErrorCode: string })[];
  })[];
}
export const InboundIntegrationsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    InboundIntegrations: S.optional(InboundIntegrationList),
  }).pipe(ns),
).annotations({
  identifier: "InboundIntegrationsMessage",
}) as any as S.Schema<InboundIntegrationsMessage>;
export interface IntegrationsMessage {
  Marker?: string;
  Integrations?: (Integration & {
    Errors: (IntegrationError & { ErrorCode: string })[];
  })[];
}
export const IntegrationsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Integrations: S.optional(IntegrationList),
  }).pipe(ns),
).annotations({
  identifier: "IntegrationsMessage",
}) as any as S.Schema<IntegrationsMessage>;
export interface DescribePartnersOutputMessage {
  PartnerIntegrationInfoList?: PartnerIntegrationInfo[];
}
export const DescribePartnersOutputMessage = S.suspend(() =>
  S.Struct({
    PartnerIntegrationInfoList: S.optional(PartnerIntegrationInfoList),
  }).pipe(ns),
).annotations({
  identifier: "DescribePartnersOutputMessage",
}) as any as S.Schema<DescribePartnersOutputMessage>;
export interface DescribeRedshiftIdcApplicationsResult {
  RedshiftIdcApplications?: RedshiftIdcApplication[];
  Marker?: string;
}
export const DescribeRedshiftIdcApplicationsResult = S.suspend(() =>
  S.Struct({
    RedshiftIdcApplications: S.optional(RedshiftIdcApplicationList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRedshiftIdcApplicationsResult",
}) as any as S.Schema<DescribeRedshiftIdcApplicationsResult>;
export interface DescribeReservedNodeExchangeStatusOutputMessage {
  ReservedNodeExchangeStatusDetails?: ReservedNodeExchangeStatus[];
  Marker?: string;
}
export const DescribeReservedNodeExchangeStatusOutputMessage = S.suspend(() =>
  S.Struct({
    ReservedNodeExchangeStatusDetails: S.optional(
      ReservedNodeExchangeStatusList,
    ),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeReservedNodeExchangeStatusOutputMessage",
}) as any as S.Schema<DescribeReservedNodeExchangeStatusOutputMessage>;
export interface ReservedNodeOfferingsMessage {
  Marker?: string;
  ReservedNodeOfferings?: ReservedNodeOffering[];
}
export const ReservedNodeOfferingsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ReservedNodeOfferings: S.optional(ReservedNodeOfferingList),
  }).pipe(ns),
).annotations({
  identifier: "ReservedNodeOfferingsMessage",
}) as any as S.Schema<ReservedNodeOfferingsMessage>;
export interface ScheduledActionsMessage {
  Marker?: string;
  ScheduledActions?: (ScheduledAction & {
    TargetAction: ScheduledActionType & {
      ResizeCluster: ResizeClusterMessage & { ClusterIdentifier: string };
      PauseCluster: PauseClusterMessage & { ClusterIdentifier: string };
      ResumeCluster: ResumeClusterMessage & { ClusterIdentifier: string };
    };
  })[];
}
export const ScheduledActionsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ScheduledActions: S.optional(ScheduledActionList),
  }).pipe(ns),
).annotations({
  identifier: "ScheduledActionsMessage",
}) as any as S.Schema<ScheduledActionsMessage>;
export interface TableRestoreStatusMessage {
  TableRestoreStatusDetails?: TableRestoreStatus[];
  Marker?: string;
}
export const TableRestoreStatusMessage = S.suspend(() =>
  S.Struct({
    TableRestoreStatusDetails: S.optional(TableRestoreStatusList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "TableRestoreStatusMessage",
}) as any as S.Schema<TableRestoreStatusMessage>;
export interface TaggedResourceListMessage {
  TaggedResources?: TaggedResource[];
  Marker?: string;
}
export const TaggedResourceListMessage = S.suspend(() =>
  S.Struct({
    TaggedResources: S.optional(TaggedResourceList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "TaggedResourceListMessage",
}) as any as S.Schema<TaggedResourceListMessage>;
export interface GetReservedNodeExchangeConfigurationOptionsOutputMessage {
  Marker?: string;
  ReservedNodeConfigurationOptionList?: ReservedNodeConfigurationOption[];
}
export const GetReservedNodeExchangeConfigurationOptionsOutputMessage =
  S.suspend(() =>
    S.Struct({
      Marker: S.optional(S.String),
      ReservedNodeConfigurationOptionList: S.optional(
        ReservedNodeConfigurationOptionList,
      ),
    }).pipe(ns),
  ).annotations({
    identifier: "GetReservedNodeExchangeConfigurationOptionsOutputMessage",
  }) as any as S.Schema<GetReservedNodeExchangeConfigurationOptionsOutputMessage>;
export interface GetResourcePolicyResult {
  ResourcePolicy?: ResourcePolicy;
}
export const GetResourcePolicyResult = S.suspend(() =>
  S.Struct({ ResourcePolicy: S.optional(ResourcePolicy) }).pipe(ns),
).annotations({
  identifier: "GetResourcePolicyResult",
}) as any as S.Schema<GetResourcePolicyResult>;
export interface ModifyAquaOutputMessage {
  AquaConfiguration?: AquaConfiguration;
}
export const ModifyAquaOutputMessage = S.suspend(() =>
  S.Struct({ AquaConfiguration: S.optional(AquaConfiguration) }).pipe(ns),
).annotations({
  identifier: "ModifyAquaOutputMessage",
}) as any as S.Schema<ModifyAquaOutputMessage>;
export interface AttributeValueTarget {
  AttributeValue?: string;
}
export const AttributeValueTarget = S.suspend(() =>
  S.Struct({ AttributeValue: S.optional(S.String) }),
).annotations({
  identifier: "AttributeValueTarget",
}) as any as S.Schema<AttributeValueTarget>;
export type AttributeValueList = AttributeValueTarget[];
export const AttributeValueList = S.Array(
  AttributeValueTarget.pipe(T.XmlName("AttributeValueTarget")).annotations({
    identifier: "AttributeValueTarget",
  }),
);
export interface RevisionTarget {
  DatabaseRevision?: string;
  Description?: string;
  DatabaseRevisionReleaseDate?: Date;
}
export const RevisionTarget = S.suspend(() =>
  S.Struct({
    DatabaseRevision: S.optional(S.String),
    Description: S.optional(S.String),
    DatabaseRevisionReleaseDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "RevisionTarget",
}) as any as S.Schema<RevisionTarget>;
export type RevisionTargetsList = RevisionTarget[];
export const RevisionTargetsList = S.Array(
  RevisionTarget.pipe(T.XmlName("RevisionTarget")).annotations({
    identifier: "RevisionTarget",
  }),
);
export interface CertificateAssociation {
  CustomDomainName?: string;
  ClusterIdentifier?: string;
}
export const CertificateAssociation = S.suspend(() =>
  S.Struct({
    CustomDomainName: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "CertificateAssociation",
}) as any as S.Schema<CertificateAssociation>;
export type CertificateAssociationList = CertificateAssociation[];
export const CertificateAssociationList = S.Array(
  CertificateAssociation.pipe(T.XmlName("CertificateAssociation")).annotations({
    identifier: "CertificateAssociation",
  }),
);
export interface EventInfoMap {
  EventId?: string;
  EventCategories?: string[];
  EventDescription?: string;
  Severity?: string;
}
export const EventInfoMap = S.suspend(() =>
  S.Struct({
    EventId: S.optional(S.String),
    EventCategories: S.optional(EventCategoriesList),
    EventDescription: S.optional(S.String),
    Severity: S.optional(S.String),
  }),
).annotations({ identifier: "EventInfoMap" }) as any as S.Schema<EventInfoMap>;
export type EventInfoMapList = EventInfoMap[];
export const EventInfoMapList = S.Array(
  EventInfoMap.pipe(T.XmlName("EventInfoMap")).annotations({
    identifier: "EventInfoMap",
  }),
);
export type Mode = "standard" | "high-performance";
export const Mode = S.Literal("standard", "high-performance");
export interface RecommendedAction {
  Text?: string;
  Database?: string;
  Command?: string;
  Type?: RecommendedActionType;
}
export const RecommendedAction = S.suspend(() =>
  S.Struct({
    Text: S.optional(S.String),
    Database: S.optional(S.String),
    Command: S.optional(S.String),
    Type: S.optional(RecommendedActionType),
  }),
).annotations({
  identifier: "RecommendedAction",
}) as any as S.Schema<RecommendedAction>;
export type RecommendedActionList = RecommendedAction[];
export const RecommendedActionList = S.Array(
  RecommendedAction.pipe(T.XmlName("RecommendedAction")).annotations({
    identifier: "RecommendedAction",
  }),
);
export interface ReferenceLink {
  Text?: string;
  Link?: string;
}
export const ReferenceLink = S.suspend(() =>
  S.Struct({ Text: S.optional(S.String), Link: S.optional(S.String) }),
).annotations({
  identifier: "ReferenceLink",
}) as any as S.Schema<ReferenceLink>;
export type ReferenceLinkList = ReferenceLink[];
export const ReferenceLinkList = S.Array(
  ReferenceLink.pipe(T.XmlName("ReferenceLink")).annotations({
    identifier: "ReferenceLink",
  }),
);
export interface AccountAttribute {
  AttributeName?: string;
  AttributeValues?: AttributeValueTarget[];
}
export const AccountAttribute = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    AttributeValues: S.optional(AttributeValueList),
  }),
).annotations({
  identifier: "AccountAttribute",
}) as any as S.Schema<AccountAttribute>;
export type AttributeList = AccountAttribute[];
export const AttributeList = S.Array(
  AccountAttribute.pipe(T.XmlName("AccountAttribute")).annotations({
    identifier: "AccountAttribute",
  }),
);
export interface ClusterDbRevision {
  ClusterIdentifier?: string;
  CurrentDatabaseRevision?: string;
  DatabaseRevisionReleaseDate?: Date;
  RevisionTargets?: RevisionTarget[];
}
export const ClusterDbRevision = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    CurrentDatabaseRevision: S.optional(S.String),
    DatabaseRevisionReleaseDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    RevisionTargets: S.optional(RevisionTargetsList),
  }),
).annotations({
  identifier: "ClusterDbRevision",
}) as any as S.Schema<ClusterDbRevision>;
export type ClusterDbRevisionsList = ClusterDbRevision[];
export const ClusterDbRevisionsList = S.Array(
  ClusterDbRevision.pipe(T.XmlName("ClusterDbRevision")).annotations({
    identifier: "ClusterDbRevision",
  }),
);
export interface Association {
  CustomDomainCertificateArn?: string;
  CustomDomainCertificateExpiryDate?: Date;
  CertificateAssociations?: CertificateAssociation[];
}
export const Association = S.suspend(() =>
  S.Struct({
    CustomDomainCertificateArn: S.optional(S.String),
    CustomDomainCertificateExpiryDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    CertificateAssociations: S.optional(CertificateAssociationList),
  }),
).annotations({ identifier: "Association" }) as any as S.Schema<Association>;
export type AssociationList = Association[];
export const AssociationList = S.Array(
  Association.pipe(T.XmlName("Association")).annotations({
    identifier: "Association",
  }),
);
export interface EventCategoriesMap {
  SourceType?: string;
  Events?: EventInfoMap[];
}
export const EventCategoriesMap = S.suspend(() =>
  S.Struct({
    SourceType: S.optional(S.String),
    Events: S.optional(EventInfoMapList),
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
export interface NodeConfigurationOption {
  NodeType?: string;
  NumberOfNodes?: number;
  EstimatedDiskUtilizationPercent?: number;
  Mode?: Mode;
}
export const NodeConfigurationOption = S.suspend(() =>
  S.Struct({
    NodeType: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    EstimatedDiskUtilizationPercent: S.optional(S.Number),
    Mode: S.optional(Mode),
  }),
).annotations({
  identifier: "NodeConfigurationOption",
}) as any as S.Schema<NodeConfigurationOption>;
export type NodeConfigurationOptionList = NodeConfigurationOption[];
export const NodeConfigurationOptionList = S.Array(
  NodeConfigurationOption.pipe(
    T.XmlName("NodeConfigurationOption"),
  ).annotations({ identifier: "NodeConfigurationOption" }),
);
export interface Recommendation {
  Id?: string;
  ClusterIdentifier?: string;
  NamespaceArn?: string;
  CreatedAt?: Date;
  RecommendationType?: string;
  Title?: string;
  Description?: string;
  Observation?: string;
  ImpactRanking?: ImpactRankingType;
  RecommendationText?: string;
  RecommendedActions?: RecommendedAction[];
  ReferenceLinks?: ReferenceLink[];
}
export const Recommendation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    NamespaceArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    RecommendationType: S.optional(S.String),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    Observation: S.optional(S.String),
    ImpactRanking: S.optional(ImpactRankingType),
    RecommendationText: S.optional(S.String),
    RecommendedActions: S.optional(RecommendedActionList),
    ReferenceLinks: S.optional(ReferenceLinkList),
  }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export type RecommendationList = Recommendation[];
export const RecommendationList = S.Array(
  Recommendation.pipe(T.XmlName("Recommendation")).annotations({
    identifier: "Recommendation",
  }),
);
export interface SupportedOperation {
  OperationName?: string;
}
export const SupportedOperation = S.suspend(() =>
  S.Struct({ OperationName: S.optional(S.String) }),
).annotations({
  identifier: "SupportedOperation",
}) as any as S.Schema<SupportedOperation>;
export type SupportedOperationList = SupportedOperation[];
export const SupportedOperationList = S.Array(
  SupportedOperation.pipe(T.XmlName("SupportedOperation")).annotations({
    identifier: "SupportedOperation",
  }),
);
export interface AcceptReservedNodeExchangeOutputMessage {
  ExchangedReservedNode?: ReservedNode;
}
export const AcceptReservedNodeExchangeOutputMessage = S.suspend(() =>
  S.Struct({ ExchangedReservedNode: S.optional(ReservedNode) }).pipe(ns),
).annotations({
  identifier: "AcceptReservedNodeExchangeOutputMessage",
}) as any as S.Schema<AcceptReservedNodeExchangeOutputMessage>;
export interface AuthorizeClusterSecurityGroupIngressResult {
  ClusterSecurityGroup?: ClusterSecurityGroup;
}
export const AuthorizeClusterSecurityGroupIngressResult = S.suspend(() =>
  S.Struct({ ClusterSecurityGroup: S.optional(ClusterSecurityGroup) }).pipe(ns),
).annotations({
  identifier: "AuthorizeClusterSecurityGroupIngressResult",
}) as any as S.Schema<AuthorizeClusterSecurityGroupIngressResult>;
export interface AuthorizeSnapshotAccessResult {
  Snapshot?: Snapshot;
}
export const AuthorizeSnapshotAccessResult = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "AuthorizeSnapshotAccessResult",
}) as any as S.Schema<AuthorizeSnapshotAccessResult>;
export interface CreateClusterSubnetGroupResult {
  ClusterSubnetGroup?: ClusterSubnetGroup;
}
export const CreateClusterSubnetGroupResult = S.suspend(() =>
  S.Struct({ ClusterSubnetGroup: S.optional(ClusterSubnetGroup) }).pipe(ns),
).annotations({
  identifier: "CreateClusterSubnetGroupResult",
}) as any as S.Schema<CreateClusterSubnetGroupResult>;
export interface CreateRedshiftIdcApplicationMessage {
  IdcInstanceArn?: string;
  RedshiftIdcApplicationName?: string;
  IdentityNamespace?: string;
  IdcDisplayName?: string;
  IamRoleArn?: string;
  AuthorizedTokenIssuerList?: AuthorizedTokenIssuer[];
  ServiceIntegrations?: ServiceIntegrationsUnion[];
  ApplicationType?: ApplicationType;
  Tags?: Tag[];
  SsoTagKeys?: string[];
}
export const CreateRedshiftIdcApplicationMessage = S.suspend(() =>
  S.Struct({
    IdcInstanceArn: S.optional(S.String),
    RedshiftIdcApplicationName: S.optional(S.String),
    IdentityNamespace: S.optional(S.String),
    IdcDisplayName: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
    AuthorizedTokenIssuerList: S.optional(AuthorizedTokenIssuerList),
    ServiceIntegrations: S.optional(ServiceIntegrationList),
    ApplicationType: S.optional(ApplicationType),
    Tags: S.optional(TagList),
    SsoTagKeys: S.optional(TagKeyList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRedshiftIdcApplicationMessage",
}) as any as S.Schema<CreateRedshiftIdcApplicationMessage>;
export interface DeregisterNamespaceOutputMessage {
  Status?: NamespaceRegistrationStatus;
}
export const DeregisterNamespaceOutputMessage = S.suspend(() =>
  S.Struct({ Status: S.optional(NamespaceRegistrationStatus) }).pipe(ns),
).annotations({
  identifier: "DeregisterNamespaceOutputMessage",
}) as any as S.Schema<DeregisterNamespaceOutputMessage>;
export interface AccountAttributeList {
  AccountAttributes?: AccountAttribute[];
}
export const AccountAttributeList = S.suspend(() =>
  S.Struct({ AccountAttributes: S.optional(AttributeList) }).pipe(ns),
).annotations({
  identifier: "AccountAttributeList",
}) as any as S.Schema<AccountAttributeList>;
export interface ClusterDbRevisionsMessage {
  Marker?: string;
  ClusterDbRevisions?: ClusterDbRevision[];
}
export const ClusterDbRevisionsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ClusterDbRevisions: S.optional(ClusterDbRevisionsList),
  }).pipe(ns),
).annotations({
  identifier: "ClusterDbRevisionsMessage",
}) as any as S.Schema<ClusterDbRevisionsMessage>;
export interface CustomDomainAssociationsMessage {
  Marker?: string;
  Associations?: Association[];
}
export const CustomDomainAssociationsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Associations: S.optional(AssociationList),
  }).pipe(ns),
).annotations({
  identifier: "CustomDomainAssociationsMessage",
}) as any as S.Schema<CustomDomainAssociationsMessage>;
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
export interface NodeConfigurationOptionsMessage {
  NodeConfigurationOptionList?: NodeConfigurationOption[];
  Marker?: string;
}
export const NodeConfigurationOptionsMessage = S.suspend(() =>
  S.Struct({
    NodeConfigurationOptionList: S.optional(NodeConfigurationOptionList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "NodeConfigurationOptionsMessage",
}) as any as S.Schema<NodeConfigurationOptionsMessage>;
export interface ListRecommendationsResult {
  Recommendations?: Recommendation[];
  Marker?: string;
}
export const ListRecommendationsResult = S.suspend(() =>
  S.Struct({
    Recommendations: S.optional(RecommendationList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRecommendationsResult",
}) as any as S.Schema<ListRecommendationsResult>;
export interface UpdateTarget {
  MaintenanceTrackName?: string;
  DatabaseVersion?: string;
  SupportedOperations?: SupportedOperation[];
}
export const UpdateTarget = S.suspend(() =>
  S.Struct({
    MaintenanceTrackName: S.optional(S.String),
    DatabaseVersion: S.optional(S.String),
    SupportedOperations: S.optional(SupportedOperationList),
  }),
).annotations({ identifier: "UpdateTarget" }) as any as S.Schema<UpdateTarget>;
export type EligibleTracksToUpdateList = UpdateTarget[];
export const EligibleTracksToUpdateList = S.Array(
  UpdateTarget.pipe(T.XmlName("UpdateTarget")).annotations({
    identifier: "UpdateTarget",
  }),
);
export type AvailabilityZoneList = AvailabilityZone[];
export const AvailabilityZoneList = S.Array(
  AvailabilityZone.pipe(T.XmlName("AvailabilityZone")).annotations({
    identifier: "AvailabilityZone",
  }),
);
export interface MaintenanceTrack {
  MaintenanceTrackName?: string;
  DatabaseVersion?: string;
  UpdateTargets?: UpdateTarget[];
}
export const MaintenanceTrack = S.suspend(() =>
  S.Struct({
    MaintenanceTrackName: S.optional(S.String),
    DatabaseVersion: S.optional(S.String),
    UpdateTargets: S.optional(EligibleTracksToUpdateList),
  }),
).annotations({
  identifier: "MaintenanceTrack",
}) as any as S.Schema<MaintenanceTrack>;
export type TrackList = MaintenanceTrack[];
export const TrackList = S.Array(
  MaintenanceTrack.pipe(T.XmlName("MaintenanceTrack")).annotations({
    identifier: "MaintenanceTrack",
  }),
);
export interface OrderableClusterOption {
  ClusterVersion?: string;
  ClusterType?: string;
  NodeType?: string;
  AvailabilityZones?: AvailabilityZone[];
}
export const OrderableClusterOption = S.suspend(() =>
  S.Struct({
    ClusterVersion: S.optional(S.String),
    ClusterType: S.optional(S.String),
    NodeType: S.optional(S.String),
    AvailabilityZones: S.optional(AvailabilityZoneList),
  }),
).annotations({
  identifier: "OrderableClusterOption",
}) as any as S.Schema<OrderableClusterOption>;
export type OrderableClusterOptionsList = OrderableClusterOption[];
export const OrderableClusterOptionsList = S.Array(
  OrderableClusterOption.pipe(T.XmlName("OrderableClusterOption")).annotations({
    identifier: "OrderableClusterOption",
  }),
);
export interface CreateRedshiftIdcApplicationResult {
  RedshiftIdcApplication?: RedshiftIdcApplication;
}
export const CreateRedshiftIdcApplicationResult = S.suspend(() =>
  S.Struct({ RedshiftIdcApplication: S.optional(RedshiftIdcApplication) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CreateRedshiftIdcApplicationResult",
}) as any as S.Schema<CreateRedshiftIdcApplicationResult>;
export interface DeleteClusterResult {
  Cluster?: Cluster;
}
export const DeleteClusterResult = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "DeleteClusterResult",
}) as any as S.Schema<DeleteClusterResult>;
export interface TrackListMessage {
  MaintenanceTracks?: MaintenanceTrack[];
  Marker?: string;
}
export const TrackListMessage = S.suspend(() =>
  S.Struct({
    MaintenanceTracks: S.optional(TrackList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "TrackListMessage",
}) as any as S.Schema<TrackListMessage>;
export interface OrderableClusterOptionsMessage {
  OrderableClusterOptions?: OrderableClusterOption[];
  Marker?: string;
}
export const OrderableClusterOptionsMessage = S.suspend(() =>
  S.Struct({
    OrderableClusterOptions: S.optional(OrderableClusterOptionsList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "OrderableClusterOptionsMessage",
}) as any as S.Schema<OrderableClusterOptionsMessage>;

//# Errors
export class ClusterNotFoundFault extends S.TaggedError<ClusterNotFoundFault>()(
  "ClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidDataShareFault extends S.TaggedError<InvalidDataShareFault>()(
  "InvalidDataShareFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDataShareFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterStateFault extends S.TaggedError<InvalidClusterStateFault>()(
  "InvalidClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidClusterState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ClusterParameterGroupNotFoundFault extends S.TaggedError<ClusterParameterGroupNotFoundFault>()(
  "ClusterParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterParameterGroupNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterSecurityGroupNotFoundFault extends S.TaggedError<ClusterSecurityGroupNotFoundFault>()(
  "ClusterSecurityGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSecurityGroupNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterSubnetGroupNotFoundFault extends S.TaggedError<ClusterSubnetGroupNotFoundFault>()(
  "ClusterSubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSubnetGroupNotFoundFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidSubscriptionStateFault extends S.TaggedError<InvalidSubscriptionStateFault>()(
  "InvalidSubscriptionStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidSubscriptionStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class HsmClientCertificateNotFoundFault extends S.TaggedError<HsmClientCertificateNotFoundFault>()(
  "HsmClientCertificateNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmClientCertificateNotFoundFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class HsmConfigurationNotFoundFault extends S.TaggedError<HsmConfigurationNotFoundFault>()(
  "HsmConfigurationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmConfigurationNotFoundFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DependentServiceAccessDeniedFault extends S.TaggedError<DependentServiceAccessDeniedFault>()(
  "DependentServiceAccessDeniedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DependentServiceAccessDenied",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class ResourceNotFoundFault extends S.TaggedError<ResourceNotFoundFault>()(
  "ResourceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ScheduledActionNotFoundFault extends S.TaggedError<ScheduledActionNotFoundFault>()(
  "ScheduledActionNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ScheduledActionNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidSnapshotCopyGrantStateFault extends S.TaggedError<InvalidSnapshotCopyGrantStateFault>()(
  "InvalidSnapshotCopyGrantStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidSnapshotCopyGrantStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterSnapshotScheduleStateFault extends S.TaggedError<InvalidClusterSnapshotScheduleStateFault>()(
  "InvalidClusterSnapshotScheduleStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidClusterSnapshotScheduleState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidTagFault extends S.TaggedError<InvalidTagFault>()(
  "InvalidTagFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTagFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class UnsupportedOperationFault extends S.TaggedError<UnsupportedOperationFault>()(
  "UnsupportedOperationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedOperation", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class BucketNotFoundFault extends S.TaggedError<BucketNotFoundFault>()(
  "BucketNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "BucketNotFoundFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IntegrationAlreadyExistsFault extends S.TaggedError<IntegrationAlreadyExistsFault>()(
  "IntegrationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidScheduleFault extends S.TaggedError<InvalidScheduleFault>()(
  "InvalidScheduleFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSchedule", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidUsageLimitFault extends S.TaggedError<InvalidUsageLimitFault>()(
  "InvalidUsageLimitFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidUsageLimit", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class PartnerNotFoundFault extends S.TaggedError<PartnerNotFoundFault>()(
  "PartnerNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "PartnerNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class EndpointAuthorizationAlreadyExistsFault extends S.TaggedError<EndpointAuthorizationAlreadyExistsFault>()(
  "EndpointAuthorizationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointAuthorizationAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class BatchModifyClusterSnapshotsLimitExceededFault extends S.TaggedError<BatchModifyClusterSnapshotsLimitExceededFault>()(
  "BatchModifyClusterSnapshotsLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "BatchModifyClusterSnapshotsLimitExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterSnapshotAlreadyExistsFault extends S.TaggedError<ClusterSnapshotAlreadyExistsFault>()(
  "ClusterSnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSnapshotAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AuthenticationProfileAlreadyExistsFault extends S.TaggedError<AuthenticationProfileAlreadyExistsFault>()(
  "AuthenticationProfileAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthenticationProfileAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterSecurityGroupAlreadyExistsFault extends S.TaggedError<ClusterSecurityGroupAlreadyExistsFault>()(
  "ClusterSecurityGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSecurityGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CustomCnameAssociationFault extends S.TaggedError<CustomCnameAssociationFault>()(
  "CustomCnameAssociationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomCnameAssociationFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidScheduledActionFault extends S.TaggedError<InvalidScheduledActionFault>()(
  "InvalidScheduledActionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidScheduledAction", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AuthenticationProfileNotFoundFault extends S.TaggedError<AuthenticationProfileNotFoundFault>()(
  "AuthenticationProfileNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthenticationProfileNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterParameterGroupStateFault extends S.TaggedError<InvalidClusterParameterGroupStateFault>()(
  "InvalidClusterParameterGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidClusterParameterGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterSecurityGroupStateFault extends S.TaggedError<InvalidClusterSecurityGroupStateFault>()(
  "InvalidClusterSecurityGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidClusterSecurityGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterSnapshotNotFoundFault extends S.TaggedError<ClusterSnapshotNotFoundFault>()(
  "ClusterSnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterSnapshotNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterSubnetGroupStateFault extends S.TaggedError<InvalidClusterSubnetGroupStateFault>()(
  "InvalidClusterSubnetGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidClusterSubnetGroupStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubscriptionNotFoundFault extends S.TaggedError<SubscriptionNotFoundFault>()(
  "SubscriptionNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidHsmClientCertificateStateFault extends S.TaggedError<InvalidHsmClientCertificateStateFault>()(
  "InvalidHsmClientCertificateStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidHsmClientCertificateStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidHsmConfigurationStateFault extends S.TaggedError<InvalidHsmConfigurationStateFault>()(
  "InvalidHsmConfigurationStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidHsmConfigurationStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DependentServiceUnavailableFault extends S.TaggedError<DependentServiceUnavailableFault>()(
  "DependentServiceUnavailableFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DependentServiceUnavailableFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class UnauthorizedOperation extends S.TaggedError<UnauthorizedOperation>()(
  "UnauthorizedOperation",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnauthorizedOperation", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SnapshotCopyGrantNotFoundFault extends S.TaggedError<SnapshotCopyGrantNotFoundFault>()(
  "SnapshotCopyGrantNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotCopyGrantNotFoundFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SnapshotScheduleNotFoundFault extends S.TaggedError<SnapshotScheduleNotFoundFault>()(
  "SnapshotScheduleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotScheduleNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class UsageLimitNotFoundFault extends S.TaggedError<UsageLimitNotFoundFault>()(
  "UsageLimitNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UsageLimitNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidNamespaceFault extends S.TaggedError<InvalidNamespaceFault>()(
  "InvalidNamespaceFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNamespaceFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EndpointNotFoundFault extends S.TaggedError<EndpointNotFoundFault>()(
  "EndpointNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "EndpointNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class SnapshotCopyAlreadyDisabledFault extends S.TaggedError<SnapshotCopyAlreadyDisabledFault>()(
  "SnapshotCopyAlreadyDisabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotCopyAlreadyDisabledFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InsufficientS3BucketPolicyFault extends S.TaggedError<InsufficientS3BucketPolicyFault>()(
  "InsufficientS3BucketPolicyFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientS3BucketPolicyFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CopyToRegionDisabledFault extends S.TaggedError<CopyToRegionDisabledFault>()(
  "CopyToRegionDisabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "CopyToRegionDisabledFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class RedshiftInvalidParameterFault extends S.TaggedError<RedshiftInvalidParameterFault>()(
  "RedshiftInvalidParameterFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "RedshiftInvalidParameter", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ClusterAlreadyExistsFault extends S.TaggedError<ClusterAlreadyExistsFault>()(
  "ClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ClusterOnLatestRevisionFault extends S.TaggedError<ClusterOnLatestRevisionFault>()(
  "ClusterOnLatestRevisionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterOnLatestRevision", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ClusterSubnetQuotaExceededFault extends S.TaggedError<ClusterSubnetQuotaExceededFault>()(
  "ClusterSubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSubnetQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SNSInvalidTopicFault extends S.TaggedError<SNSInvalidTopicFault>()(
  "SNSInvalidTopicFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSInvalidTopic", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IntegrationConflictOperationFault extends S.TaggedError<IntegrationConflictOperationFault>()(
  "IntegrationConflictOperationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationConflictOperationFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidRetentionPeriodFault extends S.TaggedError<InvalidRetentionPeriodFault>()(
  "InvalidRetentionPeriodFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidRetentionPeriodFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedNodeAlreadyExistsFault extends S.TaggedError<ReservedNodeAlreadyExistsFault>()(
  "ReservedNodeAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedNodeAlreadyExists", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ConflictPolicyUpdateFault extends S.TaggedError<ConflictPolicyUpdateFault>()(
  "ConflictPolicyUpdateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConflictPolicyUpdateFault", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class AccessToSnapshotDeniedFault extends S.TaggedError<AccessToSnapshotDeniedFault>()(
  "AccessToSnapshotDeniedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessToSnapshotDenied", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientClusterCapacityFault extends S.TaggedError<InsufficientClusterCapacityFault>()(
  "InsufficientClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientClusterCapacity",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AuthorizationNotFoundFault extends S.TaggedError<AuthorizationNotFoundFault>()(
  "AuthorizationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AuthorizationNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class DependentServiceRequestThrottlingFault extends S.TaggedError<DependentServiceRequestThrottlingFault>()(
  "DependentServiceRequestThrottlingFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DependentServiceRequestThrottlingFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ResizeNotFoundFault extends S.TaggedError<ResizeNotFoundFault>()(
  "ResizeNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResizeNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class EndpointAuthorizationNotFoundFault extends S.TaggedError<EndpointAuthorizationNotFoundFault>()(
  "EndpointAuthorizationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointAuthorizationNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class TagLimitExceededFault extends S.TaggedError<TagLimitExceededFault>()(
  "TagLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagLimitExceededFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class LimitExceededFault extends S.TaggedError<LimitExceededFault>()(
  "LimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceededFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class UnauthorizedPartnerIntegrationFault extends S.TaggedError<UnauthorizedPartnerIntegrationFault>()(
  "UnauthorizedPartnerIntegrationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnauthorizedPartnerIntegration",
    httpResponseCode: 401,
  }),
).pipe(C.withAuthError) {}
export class EndpointAuthorizationsPerClusterLimitExceededFault extends S.TaggedError<EndpointAuthorizationsPerClusterLimitExceededFault>()(
  "EndpointAuthorizationsPerClusterLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointAuthorizationsPerClusterLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class BatchDeleteRequestSizeExceededFault extends S.TaggedError<BatchDeleteRequestSizeExceededFault>()(
  "BatchDeleteRequestSizeExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "BatchDeleteRequestSizeExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AuthenticationProfileQuotaExceededFault extends S.TaggedError<AuthenticationProfileQuotaExceededFault>()(
  "AuthenticationProfileQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthenticationProfileQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterParameterGroupAlreadyExistsFault extends S.TaggedError<ClusterParameterGroupAlreadyExistsFault>()(
  "ClusterParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterParameterGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterSecurityGroupQuotaExceededFault extends S.TaggedError<ClusterSecurityGroupQuotaExceededFault>()(
  "ClusterSecurityGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "QuotaExceeded.ClusterSecurityGroup",
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
export class HsmClientCertificateAlreadyExistsFault extends S.TaggedError<HsmClientCertificateAlreadyExistsFault>()(
  "HsmClientCertificateAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmClientCertificateAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class HsmConfigurationAlreadyExistsFault extends S.TaggedError<HsmConfigurationAlreadyExistsFault>()(
  "HsmConfigurationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmConfigurationAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ScheduledActionAlreadyExistsFault extends S.TaggedError<ScheduledActionAlreadyExistsFault>()(
  "ScheduledActionAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ScheduledActionAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ScheduleDefinitionTypeUnsupportedFault extends S.TaggedError<ScheduleDefinitionTypeUnsupportedFault>()(
  "ScheduleDefinitionTypeUnsupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ScheduleDefinitionTypeUnsupported",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidAuthenticationProfileRequestFault extends S.TaggedError<InvalidAuthenticationProfileRequestFault>()(
  "InvalidAuthenticationProfileRequestFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidAuthenticationProfileRequestFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterSnapshotStateFault extends S.TaggedError<InvalidClusterSnapshotStateFault>()(
  "InvalidClusterSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidClusterSnapshotState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterSubnetStateFault extends S.TaggedError<InvalidClusterSubnetStateFault>()(
  "InvalidClusterSubnetStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidClusterSubnetStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class RedshiftIdcApplicationNotExistsFault extends S.TaggedError<RedshiftIdcApplicationNotExistsFault>()(
  "RedshiftIdcApplicationNotExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "RedshiftIdcApplicationNotExists",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class IntegrationNotFoundFault extends S.TaggedError<IntegrationNotFoundFault>()(
  "IntegrationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "IntegrationNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ReservedNodeExchangeNotFoundFault extends S.TaggedError<ReservedNodeExchangeNotFoundFault>()(
  "ReservedNodeExchangeNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedNodeExchangeNotFond",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedNodeOfferingNotFoundFault extends S.TaggedError<ReservedNodeOfferingNotFoundFault>()(
  "ReservedNodeOfferingNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedNodeOfferingNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class TableRestoreNotFoundFault extends S.TaggedError<TableRestoreNotFoundFault>()(
  "TableRestoreNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TableRestoreNotFoundFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidS3BucketNameFault extends S.TaggedError<InvalidS3BucketNameFault>()(
  "InvalidS3BucketNameFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3BucketNameFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidReservedNodeStateFault extends S.TaggedError<InvalidReservedNodeStateFault>()(
  "InvalidReservedNodeStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidReservedNodeState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidPolicyFault extends S.TaggedError<InvalidPolicyFault>()(
  "InvalidPolicyFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidPolicyFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SNSNoAuthorizationFault extends S.TaggedError<SNSNoAuthorizationFault>()(
  "SNSNoAuthorizationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSNoAuthorization", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IntegrationConflictStateFault extends S.TaggedError<IntegrationConflictStateFault>()(
  "IntegrationConflictStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationConflictStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SnapshotCopyDisabledFault extends S.TaggedError<SnapshotCopyDisabledFault>()(
  "SnapshotCopyDisabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotCopyDisabledFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ClusterQuotaExceededFault extends S.TaggedError<ClusterQuotaExceededFault>()(
  "ClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidAuthorizationStateFault extends S.TaggedError<InvalidAuthorizationStateFault>()(
  "InvalidAuthorizationStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidAuthorizationState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ClusterSnapshotQuotaExceededFault extends S.TaggedError<ClusterSnapshotQuotaExceededFault>()(
  "ClusterSnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSnapshotQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CustomDomainAssociationNotFoundFault extends S.TaggedError<CustomDomainAssociationNotFoundFault>()(
  "CustomDomainAssociationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomDomainAssociationNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ScheduledActionTypeUnsupportedFault extends S.TaggedError<ScheduledActionTypeUnsupportedFault>()(
  "ScheduledActionTypeUnsupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ScheduledActionTypeUnsupported",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InProgressTableRestoreQuotaExceededFault extends S.TaggedError<InProgressTableRestoreQuotaExceededFault>()(
  "InProgressTableRestoreQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InProgressTableRestoreQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedNodeNotFoundFault extends S.TaggedError<ReservedNodeNotFoundFault>()(
  "ReservedNodeNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedNodeNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class SnapshotScheduleUpdateInProgressFault extends S.TaggedError<SnapshotScheduleUpdateInProgressFault>()(
  "SnapshotScheduleUpdateInProgressFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotScheduleUpdateInProgress",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidEndpointStateFault extends S.TaggedError<InvalidEndpointStateFault>()(
  "InvalidEndpointStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidEndpointState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IntegrationQuotaExceededFault extends S.TaggedError<IntegrationQuotaExceededFault>()(
  "IntegrationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class UsageLimitAlreadyExistsFault extends S.TaggedError<UsageLimitAlreadyExistsFault>()(
  "UsageLimitAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UsageLimitAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SnapshotCopyGrantAlreadyExistsFault extends S.TaggedError<SnapshotCopyGrantAlreadyExistsFault>()(
  "SnapshotCopyGrantAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotCopyGrantAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class IncompatibleOrderableOptions extends S.TaggedError<IncompatibleOrderableOptions>()(
  "IncompatibleOrderableOptions",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IncompatibleOrderableOptions",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterTrackFault extends S.TaggedError<InvalidClusterTrackFault>()(
  "InvalidClusterTrackFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidClusterTrack", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AuthorizationAlreadyExistsFault extends S.TaggedError<AuthorizationAlreadyExistsFault>()(
  "AuthorizationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthorizationAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterParameterGroupQuotaExceededFault extends S.TaggedError<ClusterParameterGroupQuotaExceededFault>()(
  "ClusterParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterSubnetGroupAlreadyExistsFault extends S.TaggedError<ClusterSubnetGroupAlreadyExistsFault>()(
  "ClusterSubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSubnetGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AccessToClusterDeniedFault extends S.TaggedError<AccessToClusterDeniedFault>()(
  "AccessToClusterDeniedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessToClusterDenied", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class HsmClientCertificateQuotaExceededFault extends S.TaggedError<HsmClientCertificateQuotaExceededFault>()(
  "HsmClientCertificateQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmClientCertificateQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class HsmConfigurationQuotaExceededFault extends S.TaggedError<HsmConfigurationQuotaExceededFault>()(
  "HsmConfigurationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmConfigurationQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ScheduledActionQuotaExceededFault extends S.TaggedError<ScheduledActionQuotaExceededFault>()(
  "ScheduledActionQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ScheduledActionQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SnapshotScheduleAlreadyExistsFault extends S.TaggedError<SnapshotScheduleAlreadyExistsFault>()(
  "SnapshotScheduleAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotScheduleAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidS3KeyPrefixFault extends S.TaggedError<InvalidS3KeyPrefixFault>()(
  "InvalidS3KeyPrefixFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3KeyPrefixFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ReservedNodeAlreadyMigratedFault extends S.TaggedError<ReservedNodeAlreadyMigratedFault>()(
  "ReservedNodeAlreadyMigratedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedNodeAlreadyMigrated",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SNSTopicArnNotFoundFault extends S.TaggedError<SNSTopicArnNotFoundFault>()(
  "SNSTopicArnNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSTopicArnNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidTableRestoreArgumentFault extends S.TaggedError<InvalidTableRestoreArgumentFault>()(
  "InvalidTableRestoreArgumentFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidTableRestoreArgument",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedNodeQuotaExceededFault extends S.TaggedError<ReservedNodeQuotaExceededFault>()(
  "ReservedNodeQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedNodeQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NumberOfNodesPerClusterLimitExceededFault extends S.TaggedError<NumberOfNodesPerClusterLimitExceededFault>()(
  "NumberOfNodesPerClusterLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NumberOfNodesPerClusterLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class IntegrationSourceNotFoundFault extends S.TaggedError<IntegrationSourceNotFoundFault>()(
  "IntegrationSourceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationSourceNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class SnapshotCopyGrantQuotaExceededFault extends S.TaggedError<SnapshotCopyGrantQuotaExceededFault>()(
  "SnapshotCopyGrantQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotCopyGrantQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SnapshotCopyAlreadyEnabledFault extends S.TaggedError<SnapshotCopyAlreadyEnabledFault>()(
  "SnapshotCopyAlreadyEnabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotCopyAlreadyEnabledFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidElasticIpFault extends S.TaggedError<InvalidElasticIpFault>()(
  "InvalidElasticIpFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidElasticIpFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetAlreadyInUse extends S.TaggedError<SubnetAlreadyInUse>()(
  "SubnetAlreadyInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetAlreadyInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AuthorizationQuotaExceededFault extends S.TaggedError<AuthorizationQuotaExceededFault>()(
  "AuthorizationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthorizationQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterSubnetGroupQuotaExceededFault extends S.TaggedError<ClusterSubnetGroupQuotaExceededFault>()(
  "ClusterSubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSubnetGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class EndpointAlreadyExistsFault extends S.TaggedError<EndpointAlreadyExistsFault>()(
  "EndpointAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "EndpointAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class RedshiftIdcApplicationAlreadyExistsFault extends S.TaggedError<RedshiftIdcApplicationAlreadyExistsFault>()(
  "RedshiftIdcApplicationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "RedshiftIdcApplicationAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SnapshotScheduleQuotaExceededFault extends S.TaggedError<SnapshotScheduleQuotaExceededFault>()(
  "SnapshotScheduleQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotScheduleQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SourceNotFoundFault extends S.TaggedError<SourceNotFoundFault>()(
  "SourceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SourceNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class NumberOfNodesQuotaExceededFault extends S.TaggedError<NumberOfNodesQuotaExceededFault>()(
  "NumberOfNodesQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NumberOfNodesQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class IntegrationTargetNotFoundFault extends S.TaggedError<IntegrationTargetNotFoundFault>()(
  "IntegrationTargetNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationTargetNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class UnknownSnapshotCopyRegionFault extends S.TaggedError<UnknownSnapshotCopyRegionFault>()(
  "UnknownSnapshotCopyRegionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnknownSnapshotCopyRegionFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class Ipv6CidrBlockNotFoundFault extends S.TaggedError<Ipv6CidrBlockNotFoundFault>()(
  "Ipv6CidrBlockNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "Ipv6CidrBlockNotFoundFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidRestoreFault extends S.TaggedError<InvalidRestoreFault>()(
  "InvalidRestoreFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRestore", httpResponseCode: 406 }),
).pipe(C.withBadRequestError) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class EndpointsPerAuthorizationLimitExceededFault extends S.TaggedError<EndpointsPerAuthorizationLimitExceededFault>()(
  "EndpointsPerAuthorizationLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointsPerAuthorizationLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class RedshiftIdcApplicationQuotaExceededFault extends S.TaggedError<RedshiftIdcApplicationQuotaExceededFault>()(
  "RedshiftIdcApplicationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "RedshiftIdcApplicationQuotaExceeded",
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
export class UnsupportedOptionFault extends S.TaggedError<UnsupportedOptionFault>()(
  "UnsupportedOptionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedOptionFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubscriptionAlreadyExistFault extends S.TaggedError<SubscriptionAlreadyExistFault>()(
  "SubscriptionAlreadyExistFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionAlreadyExist", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TableLimitExceededFault extends S.TaggedError<TableLimitExceededFault>()(
  "TableLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TableLimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EndpointsPerClusterLimitExceededFault extends S.TaggedError<EndpointsPerClusterLimitExceededFault>()(
  "EndpointsPerClusterLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointsPerClusterLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubscriptionEventIdNotFoundFault extends S.TaggedError<SubscriptionEventIdNotFoundFault>()(
  "SubscriptionEventIdNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SubscriptionEventIdNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class SubscriptionSeverityNotFoundFault extends S.TaggedError<SubscriptionSeverityNotFoundFault>()(
  "SubscriptionSeverityNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SubscriptionSeverityNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns account level backups storage size and provisional storage.
 */
export const describeStorage: (
  input: DescribeStorageRequest,
) => effect.Effect<
  CustomerStorageMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStorageRequest,
  output: CustomerStorageMessage,
  errors: [],
}));
/**
 * From a data producer account, authorizes the sharing of a datashare with one or more
 * consumer accounts or managing entities. To authorize a datashare for a data consumer,
 * the producer account must have the correct access permissions.
 */
export const authorizeDataShare: (
  input: AuthorizeDataShareMessage,
) => effect.Effect<
  DataShare,
  InvalidDataShareFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AuthorizeDataShareMessage,
  output: DataShare,
  errors: [InvalidDataShareFault],
}));
/**
 * Deletes tags from a resource. You must provide the ARN of the resource
 * from which you want to delete the tag or tags.
 */
export const deleteTags: (
  input: DeleteTagsMessage,
) => effect.Effect<
  DeleteTagsResponse,
  InvalidTagFault | ResourceNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsMessage,
  output: DeleteTagsResponse,
  errors: [InvalidTagFault, ResourceNotFoundFault],
}));
/**
 * Returns a list of Amazon Redshift parameter groups, including parameter groups you
 * created and the default parameter group. For each parameter group, the response includes
 * the parameter group name, description, and parameter group family name. You can
 * optionally specify a name to retrieve the description of a specific parameter
 * group.
 *
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all parameter groups that match any combination of the specified keys and values. For
 * example, if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all parameter groups that
 * have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, parameter groups are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeClusterParameterGroups: {
  (
    input: DescribeClusterParameterGroupsMessage,
  ): effect.Effect<
    ClusterParameterGroupsMessage,
    ClusterParameterGroupNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClusterParameterGroupsMessage,
  ) => stream.Stream<
    ClusterParameterGroupsMessage,
    ClusterParameterGroupNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClusterParameterGroupsMessage,
  ) => stream.Stream<
    ClusterParameterGroup,
    ClusterParameterGroupNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClusterParameterGroupsMessage,
  output: ClusterParameterGroupsMessage,
  errors: [ClusterParameterGroupNotFoundFault, InvalidTagFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ParameterGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a detailed list of parameters contained within the specified Amazon Redshift
 * parameter group. For each parameter the response includes information such as parameter
 * name, description, data type, value, whether the parameter value is modifiable, and so
 * on.
 *
 * You can specify *source* filter to retrieve parameters of only
 * specific type. For example, to retrieve parameters that were modified by a user action
 * such as from ModifyClusterParameterGroup, you can specify
 * *source* equal to *user*.
 *
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeClusterParameters: {
  (
    input: DescribeClusterParametersMessage,
  ): effect.Effect<
    ClusterParameterGroupDetails,
    ClusterParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClusterParametersMessage,
  ) => stream.Stream<
    ClusterParameterGroupDetails,
    ClusterParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClusterParametersMessage,
  ) => stream.Stream<
    Parameter,
    ClusterParameterGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClusterParametersMessage,
  output: ClusterParameterGroupDetails,
  errors: [ClusterParameterGroupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Parameters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns properties of provisioned clusters including general cluster properties,
 * cluster database properties, maintenance and backup properties, and security and access
 * properties. This operation supports pagination.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all clusters that match any combination of the specified keys and values. For example,
 * if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all clusters that have any
 * combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, clusters are returned
 * regardless of whether they have tag keys or values associated with them.
 */
export const describeClusters: {
  (
    input: DescribeClustersMessage,
  ): effect.Effect<
    ClustersMessage,
    ClusterNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClustersMessage,
  ) => stream.Stream<
    ClustersMessage,
    ClusterNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClustersMessage,
  ) => stream.Stream<
    Cluster,
    ClusterNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClustersMessage,
  output: ClustersMessage,
  errors: [ClusterNotFoundFault, InvalidTagFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Clusters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about Amazon Redshift security groups. If the name of a security
 * group is specified, the response will contain only information about only that security
 * group.
 *
 * For information about managing security groups, go to
 * Amazon Redshift Cluster Security Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all security groups that match any combination of the specified keys and values. For
 * example, if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all security groups that
 * have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, security groups are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeClusterSecurityGroups: {
  (
    input: DescribeClusterSecurityGroupsMessage,
  ): effect.Effect<
    ClusterSecurityGroupMessage,
    ClusterSecurityGroupNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClusterSecurityGroupsMessage,
  ) => stream.Stream<
    ClusterSecurityGroupMessage,
    ClusterSecurityGroupNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClusterSecurityGroupsMessage,
  ) => stream.Stream<
    ClusterSecurityGroup,
    ClusterSecurityGroupNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClusterSecurityGroupsMessage,
  output: ClusterSecurityGroupMessage,
  errors: [ClusterSecurityGroupNotFoundFault, InvalidTagFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ClusterSecurityGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns one or more cluster subnet group objects, which contain metadata about your
 * cluster subnet groups. By default, this operation returns information about all cluster
 * subnet groups that are defined in your Amazon Web Services account.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all subnet groups that match any combination of the specified keys and values. For
 * example, if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all subnet groups that have
 * any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, subnet groups are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeClusterSubnetGroups: {
  (
    input: DescribeClusterSubnetGroupsMessage,
  ): effect.Effect<
    ClusterSubnetGroupMessage,
    ClusterSubnetGroupNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClusterSubnetGroupsMessage,
  ) => stream.Stream<
    ClusterSubnetGroupMessage,
    ClusterSubnetGroupNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClusterSubnetGroupsMessage,
  ) => stream.Stream<
    ClusterSubnetGroup,
    ClusterSubnetGroupNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClusterSubnetGroupsMessage,
  output: ClusterSubnetGroupMessage,
  errors: [ClusterSubnetGroupNotFoundFault, InvalidTagFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ClusterSubnetGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Shows the status of any inbound or outbound datashares available in the specified
 * account.
 */
export const describeDataShares: {
  (
    input: DescribeDataSharesMessage,
  ): effect.Effect<
    DescribeDataSharesResult,
    InvalidDataShareFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDataSharesMessage,
  ) => stream.Stream<
    DescribeDataSharesResult,
    InvalidDataShareFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDataSharesMessage,
  ) => stream.Stream<
    DataShare,
    InvalidDataShareFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDataSharesMessage,
  output: DescribeDataSharesResult,
  errors: [InvalidDataShareFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DataShares",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Describes an endpoint authorization.
 */
export const describeEndpointAuthorization: {
  (
    input: DescribeEndpointAuthorizationMessage,
  ): effect.Effect<
    EndpointAuthorizationList,
    ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEndpointAuthorizationMessage,
  ) => stream.Stream<
    EndpointAuthorizationList,
    ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEndpointAuthorizationMessage,
  ) => stream.Stream<
    EndpointAuthorization,
    ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEndpointAuthorizationMessage,
  output: EndpointAuthorizationList,
  errors: [ClusterNotFoundFault, UnsupportedOperationFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "EndpointAuthorizationList",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about the specified HSM client certificate. If no certificate
 * ID is specified, returns information about all the HSM certificates owned by your Amazon Web Services account.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all HSM client certificates that match any combination of the specified keys and values.
 * For example, if you have `owner` and `environment` for tag keys,
 * and `admin` and `test` for tag values, all HSM client certificates
 * that have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, HSM client certificates
 * are returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeHsmClientCertificates: {
  (
    input: DescribeHsmClientCertificatesMessage,
  ): effect.Effect<
    HsmClientCertificateMessage,
    HsmClientCertificateNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeHsmClientCertificatesMessage,
  ) => stream.Stream<
    HsmClientCertificateMessage,
    HsmClientCertificateNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeHsmClientCertificatesMessage,
  ) => stream.Stream<
    HsmClientCertificate,
    HsmClientCertificateNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeHsmClientCertificatesMessage,
  output: HsmClientCertificateMessage,
  errors: [HsmClientCertificateNotFoundFault, InvalidTagFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "HsmClientCertificates",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about the specified Amazon Redshift HSM configuration. If no
 * configuration ID is specified, returns information about all the HSM configurations
 * owned by your Amazon Web Services account.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all HSM connections that match any combination of the specified keys and values. For
 * example, if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all HSM connections that
 * have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, HSM connections are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeHsmConfigurations: {
  (
    input: DescribeHsmConfigurationsMessage,
  ): effect.Effect<
    HsmConfigurationMessage,
    HsmConfigurationNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeHsmConfigurationsMessage,
  ) => stream.Stream<
    HsmConfigurationMessage,
    HsmConfigurationNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeHsmConfigurationsMessage,
  ) => stream.Stream<
    HsmConfiguration,
    HsmConfigurationNotFoundFault | InvalidTagFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeHsmConfigurationsMessage,
  output: HsmConfigurationMessage,
  errors: [HsmConfigurationNotFoundFault, InvalidTagFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "HsmConfigurations",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Describes whether information, such as queries and connection attempts, is being
 * logged for the specified Amazon Redshift cluster.
 */
export const describeLoggingStatus: (
  input: DescribeLoggingStatusMessage,
) => effect.Effect<
  LoggingStatus,
  ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoggingStatusMessage,
  output: LoggingStatus,
  errors: [ClusterNotFoundFault, UnsupportedOperationFault],
}));
/**
 * Returns a list of snapshot schedules.
 */
export const describeSnapshotSchedules: {
  (
    input: DescribeSnapshotSchedulesMessage,
  ): effect.Effect<
    DescribeSnapshotSchedulesOutputMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSnapshotSchedulesMessage,
  ) => stream.Stream<
    DescribeSnapshotSchedulesOutputMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSnapshotSchedulesMessage,
  ) => stream.Stream<
    SnapshotSchedule,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSnapshotSchedulesMessage,
  output: DescribeSnapshotSchedulesOutputMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "SnapshotSchedules",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Shows usage limits on a cluster.
 * Results are filtered based on the combination of input usage limit identifier, cluster identifier, and feature type parameters:
 *
 * - If usage limit identifier, cluster identifier, and feature type are not provided,
 * then all usage limit objects for the current account in the current region are returned.
 *
 * - If usage limit identifier is provided,
 * then the corresponding usage limit object is returned.
 *
 * - If cluster identifier is provided,
 * then all usage limit objects for the specified cluster are returned.
 *
 * - If cluster identifier and feature type are provided,
 * then all usage limit objects for the combination of cluster and feature are returned.
 */
export const describeUsageLimits: {
  (
    input: DescribeUsageLimitsMessage,
  ): effect.Effect<
    UsageLimitList,
    ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeUsageLimitsMessage,
  ) => stream.Stream<
    UsageLimitList,
    ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeUsageLimitsMessage,
  ) => stream.Stream<
    UsageLimit,
    ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeUsageLimitsMessage,
  output: UsageLimitList,
  errors: [ClusterNotFoundFault, UnsupportedOperationFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "UsageLimits",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a database user name and temporary password with temporary authorization to
 * log on to an Amazon Redshift database. The action returns the database user name
 * prefixed with `IAM:` if `AutoCreate` is `False` or
 * `IAMA:` if `AutoCreate` is `True`. You can
 * optionally specify one or more database user groups that the user will join at log on.
 * By default, the temporary credentials expire in 900 seconds. You can optionally specify
 * a duration between 900 seconds (15 minutes) and 3600 seconds (60 minutes). For more
 * information, see Using IAM Authentication
 * to Generate Database User Credentials in the Amazon Redshift Cluster Management Guide.
 *
 * The Identity and Access Management (IAM) user or role that runs
 * GetClusterCredentials must have an IAM policy attached that allows access to all
 * necessary actions and resources. For more information about permissions, see Resource Policies for GetClusterCredentials in the
 * Amazon Redshift Cluster Management Guide.
 *
 * If the `DbGroups` parameter is specified, the IAM policy must allow the
 * `redshift:JoinGroup` action with access to the listed
 * `dbgroups`.
 *
 * In addition, if the `AutoCreate` parameter is set to `True`,
 * then the policy must include the `redshift:CreateClusterUser`
 * permission.
 *
 * If the `DbName` parameter is specified, the IAM policy must allow access
 * to the resource `dbname` for the specified database name.
 */
export const getClusterCredentials: (
  input: GetClusterCredentialsMessage,
) => effect.Effect<
  ClusterCredentials,
  ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterCredentialsMessage,
  output: ClusterCredentials,
  errors: [ClusterNotFoundFault, UnsupportedOperationFault],
}));
/**
 * Returns a database user name and temporary password with temporary authorization to
 * log in to an Amazon Redshift database.
 * The database user is mapped 1:1 to the source Identity and Access Management (IAM) identity.
 * For more information about IAM identities, see IAM Identities (users, user groups, and roles) in the
 * Amazon Web Services Identity and Access Management User Guide.
 *
 * The Identity and Access Management (IAM) identity that runs
 * this operation must have an IAM policy attached that allows access to all
 * necessary actions and resources.
 * For more information about permissions, see Using identity-based policies (IAM policies) in the
 * Amazon Redshift Cluster Management Guide.
 */
export const getClusterCredentialsWithIAM: (
  input: GetClusterCredentialsWithIAMMessage,
) => effect.Effect<
  ClusterExtendedCredentials,
  ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterCredentialsWithIAMMessage,
  output: ClusterExtendedCredentials,
  errors: [ClusterNotFoundFault, UnsupportedOperationFault],
}));
/**
 * Modifies the list of Identity and Access Management (IAM) roles that can be
 * used by the cluster to access other Amazon Web Services services.
 *
 * The maximum number of IAM roles that you can associate is subject to a quota.
 * For more information, go to Quotas and limits
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const modifyClusterIamRoles: (
  input: ModifyClusterIamRolesMessage,
) => effect.Effect<
  ModifyClusterIamRolesResult,
  ClusterNotFoundFault | InvalidClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterIamRolesMessage,
  output: ModifyClusterIamRolesResult,
  errors: [ClusterNotFoundFault, InvalidClusterStateFault],
}));
/**
 * Modifies the maintenance settings of a cluster.
 */
export const modifyClusterMaintenance: (
  input: ModifyClusterMaintenanceMessage,
) => effect.Effect<
  ModifyClusterMaintenanceResult,
  ClusterNotFoundFault | InvalidClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterMaintenanceMessage,
  output: ModifyClusterMaintenanceResult,
  errors: [ClusterNotFoundFault, InvalidClusterStateFault],
}));
/**
 * Pauses a cluster.
 */
export const pauseCluster: (
  input: PauseClusterMessage,
) => effect.Effect<
  PauseClusterResult,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PauseClusterMessage,
  output: PauseClusterResult,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Reboots a cluster. This action is taken as soon as possible. It results in a
 * momentary outage to the cluster, during which the cluster status is set to
 * `rebooting`. A cluster event is created when the reboot is completed. Any
 * pending cluster modifications (see ModifyCluster) are applied at this
 * reboot.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const rebootCluster: (
  input: RebootClusterMessage,
) => effect.Effect<
  RebootClusterResult,
  ClusterNotFoundFault | InvalidClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootClusterMessage,
  output: RebootClusterResult,
  errors: [ClusterNotFoundFault, InvalidClusterStateFault],
}));
/**
 * Stops logging information, such as queries and connection attempts, for the
 * specified Amazon Redshift cluster.
 */
export const disableLogging: (
  input: DisableLoggingMessage,
) => effect.Effect<
  LoggingStatus,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableLoggingMessage,
  output: LoggingStatus,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * From a datashare producer account, removes authorization from the specified datashare.
 */
export const deauthorizeDataShare: (
  input: DeauthorizeDataShareMessage,
) => effect.Effect<
  DataShare,
  InvalidDataShareFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeauthorizeDataShareMessage,
  output: DataShare,
  errors: [InvalidDataShareFault],
}));
/**
 * From a datashare consumer account, rejects the specified datashare.
 */
export const rejectDataShare: (
  input: RejectDataShareMessage,
) => effect.Effect<
  DataShare,
  InvalidDataShareFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectDataShareMessage,
  output: DataShare,
  errors: [InvalidDataShareFault],
}));
/**
 * Deletes the resource policy for a specified resource.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyMessage,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  ResourceNotFoundFault | UnsupportedOperationFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyMessage,
  output: DeleteResourcePolicyResponse,
  errors: [ResourceNotFoundFault, UnsupportedOperationFault],
}));
/**
 * Used to create a custom domain name for a cluster. Properties include the custom domain name, the
 * cluster the custom domain is associated with, and the certificate Amazon Resource Name (ARN).
 */
export const createCustomDomainAssociation: (
  input: CreateCustomDomainAssociationMessage,
) => effect.Effect<
  CreateCustomDomainAssociationResult,
  | ClusterNotFoundFault
  | CustomCnameAssociationFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomDomainAssociationMessage,
  output: CreateCustomDomainAssociationResult,
  errors: [
    ClusterNotFoundFault,
    CustomCnameAssociationFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Deletes a specified Amazon Redshift parameter group.
 *
 * You cannot delete a parameter group if it is associated with a
 * cluster.
 */
export const deleteClusterParameterGroup: (
  input: DeleteClusterParameterGroupMessage,
) => effect.Effect<
  DeleteClusterParameterGroupResponse,
  | ClusterParameterGroupNotFoundFault
  | InvalidClusterParameterGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterParameterGroupMessage,
  output: DeleteClusterParameterGroupResponse,
  errors: [
    ClusterParameterGroupNotFoundFault,
    InvalidClusterParameterGroupStateFault,
  ],
}));
/**
 * Deletes an Amazon Redshift security group.
 *
 * You cannot delete a security group that is associated with any clusters. You
 * cannot delete the default security group.
 *
 * For information about managing security groups, go to
 * Amazon Redshift Cluster Security Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 */
export const deleteClusterSecurityGroup: (
  input: DeleteClusterSecurityGroupMessage,
) => effect.Effect<
  DeleteClusterSecurityGroupResponse,
  | ClusterSecurityGroupNotFoundFault
  | InvalidClusterSecurityGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterSecurityGroupMessage,
  output: DeleteClusterSecurityGroupResponse,
  errors: [
    ClusterSecurityGroupNotFoundFault,
    InvalidClusterSecurityGroupStateFault,
  ],
}));
/**
 * Deletes an Amazon Redshift event notification subscription.
 */
export const deleteEventSubscription: (
  input: DeleteEventSubscriptionMessage,
) => effect.Effect<
  DeleteEventSubscriptionResponse,
  InvalidSubscriptionStateFault | SubscriptionNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventSubscriptionMessage,
  output: DeleteEventSubscriptionResponse,
  errors: [InvalidSubscriptionStateFault, SubscriptionNotFoundFault],
}));
/**
 * Deletes the specified HSM client certificate.
 */
export const deleteHsmClientCertificate: (
  input: DeleteHsmClientCertificateMessage,
) => effect.Effect<
  DeleteHsmClientCertificateResponse,
  | HsmClientCertificateNotFoundFault
  | InvalidHsmClientCertificateStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHsmClientCertificateMessage,
  output: DeleteHsmClientCertificateResponse,
  errors: [
    HsmClientCertificateNotFoundFault,
    InvalidHsmClientCertificateStateFault,
  ],
}));
/**
 * Deletes the specified Amazon Redshift HSM configuration.
 */
export const deleteHsmConfiguration: (
  input: DeleteHsmConfigurationMessage,
) => effect.Effect<
  DeleteHsmConfigurationResponse,
  | HsmConfigurationNotFoundFault
  | InvalidHsmConfigurationStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHsmConfigurationMessage,
  output: DeleteHsmConfigurationResponse,
  errors: [HsmConfigurationNotFoundFault, InvalidHsmConfigurationStateFault],
}));
/**
 * Deletes a scheduled action.
 */
export const deleteScheduledAction: (
  input: DeleteScheduledActionMessage,
) => effect.Effect<
  DeleteScheduledActionResponse,
  ScheduledActionNotFoundFault | UnauthorizedOperation | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduledActionMessage,
  output: DeleteScheduledActionResponse,
  errors: [ScheduledActionNotFoundFault, UnauthorizedOperation],
}));
/**
 * Deletes the specified snapshot copy grant.
 */
export const deleteSnapshotCopyGrant: (
  input: DeleteSnapshotCopyGrantMessage,
) => effect.Effect<
  DeleteSnapshotCopyGrantResponse,
  | InvalidSnapshotCopyGrantStateFault
  | SnapshotCopyGrantNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotCopyGrantMessage,
  output: DeleteSnapshotCopyGrantResponse,
  errors: [InvalidSnapshotCopyGrantStateFault, SnapshotCopyGrantNotFoundFault],
}));
/**
 * Deletes a snapshot schedule.
 */
export const deleteSnapshotSchedule: (
  input: DeleteSnapshotScheduleMessage,
) => effect.Effect<
  DeleteSnapshotScheduleResponse,
  | InvalidClusterSnapshotScheduleStateFault
  | SnapshotScheduleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotScheduleMessage,
  output: DeleteSnapshotScheduleResponse,
  errors: [
    InvalidClusterSnapshotScheduleStateFault,
    SnapshotScheduleNotFoundFault,
  ],
}));
/**
 * Deletes a usage limit from a cluster.
 */
export const deleteUsageLimit: (
  input: DeleteUsageLimitMessage,
) => effect.Effect<
  DeleteUsageLimitResponse,
  UnsupportedOperationFault | UsageLimitNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUsageLimitMessage,
  output: DeleteUsageLimitResponse,
  errors: [UnsupportedOperationFault, UsageLimitNotFoundFault],
}));
/**
 * Returns one or more snapshot objects, which contain metadata about your cluster
 * snapshots. By default, this operation returns information about all snapshots of all
 * clusters that are owned by your Amazon Web Services account. No information is returned for
 * snapshots owned by inactive Amazon Web Services accounts.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all snapshots that match any combination of the specified keys and values. For example,
 * if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all snapshots that have any
 * combination of those values are returned. Only snapshots that you own are returned in
 * the response; shared snapshots are not returned with the tag key and tag value request
 * parameters.
 *
 * If both tag keys and values are omitted from the request, snapshots are returned
 * regardless of whether they have tag keys or values associated with them.
 */
export const describeClusterSnapshots: {
  (
    input: DescribeClusterSnapshotsMessage,
  ): effect.Effect<
    SnapshotMessage,
    | ClusterNotFoundFault
    | ClusterSnapshotNotFoundFault
    | InvalidTagFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClusterSnapshotsMessage,
  ) => stream.Stream<
    SnapshotMessage,
    | ClusterNotFoundFault
    | ClusterSnapshotNotFoundFault
    | InvalidTagFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClusterSnapshotsMessage,
  ) => stream.Stream<
    Snapshot,
    | ClusterNotFoundFault
    | ClusterSnapshotNotFoundFault
    | InvalidTagFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClusterSnapshotsMessage,
  output: SnapshotMessage,
  errors: [
    ClusterNotFoundFault,
    ClusterSnapshotNotFoundFault,
    InvalidTagFault,
    UnsupportedOperationFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Snapshots",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns descriptions of the available Amazon Redshift cluster versions. You can call this
 * operation even before creating any clusters to learn more about the Amazon Redshift versions.
 *
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeClusterVersions: {
  (
    input: DescribeClusterVersionsMessage,
  ): effect.Effect<
    ClusterVersionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClusterVersionsMessage,
  ) => stream.Stream<
    ClusterVersionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClusterVersionsMessage,
  ) => stream.Stream<
    ClusterVersion,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClusterVersionsMessage,
  output: ClusterVersionsMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ClusterVersions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a list of datashares where the account identifier being called is a consumer account identifier.
 */
export const describeDataSharesForConsumer: {
  (
    input: DescribeDataSharesForConsumerMessage,
  ): effect.Effect<
    DescribeDataSharesForConsumerResult,
    InvalidNamespaceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDataSharesForConsumerMessage,
  ) => stream.Stream<
    DescribeDataSharesForConsumerResult,
    InvalidNamespaceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDataSharesForConsumerMessage,
  ) => stream.Stream<
    DataShare,
    InvalidNamespaceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDataSharesForConsumerMessage,
  output: DescribeDataSharesForConsumerResult,
  errors: [InvalidNamespaceFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DataShares",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a list of parameter settings for the specified parameter group
 * family.
 *
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeDefaultClusterParameters: {
  (
    input: DescribeDefaultClusterParametersMessage,
  ): effect.Effect<
    DescribeDefaultClusterParametersResult,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDefaultClusterParametersMessage,
  ) => stream.Stream<
    DescribeDefaultClusterParametersResult,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDefaultClusterParametersMessage,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDefaultClusterParametersMessage,
  output: DescribeDefaultClusterParametersResult,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "DefaultClusterParameters.Marker",
    items: "DefaultClusterParameters.Parameters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Describes a Redshift-managed VPC endpoint.
 */
export const describeEndpointAccess: {
  (
    input: DescribeEndpointAccessMessage,
  ): effect.Effect<
    EndpointAccessList,
    | ClusterNotFoundFault
    | EndpointNotFoundFault
    | InvalidClusterStateFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEndpointAccessMessage,
  ) => stream.Stream<
    EndpointAccessList,
    | ClusterNotFoundFault
    | EndpointNotFoundFault
    | InvalidClusterStateFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEndpointAccessMessage,
  ) => stream.Stream<
    EndpointAccess,
    | ClusterNotFoundFault
    | EndpointNotFoundFault
    | InvalidClusterStateFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEndpointAccessMessage,
  output: EndpointAccessList,
  errors: [
    ClusterNotFoundFault,
    EndpointNotFoundFault,
    InvalidClusterStateFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "EndpointAccessList",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns events related to clusters, security groups, snapshots, and parameter
 * groups for the past 14 days. Events specific to a particular cluster, security group,
 * snapshot or parameter group can be obtained by providing the name as a parameter. By
 * default, the past hour of events are returned.
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
 * Describes properties of scheduled actions.
 */
export const describeScheduledActions: {
  (
    input: DescribeScheduledActionsMessage,
  ): effect.Effect<
    ScheduledActionsMessage,
    ScheduledActionNotFoundFault | UnauthorizedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeScheduledActionsMessage,
  ) => stream.Stream<
    ScheduledActionsMessage,
    ScheduledActionNotFoundFault | UnauthorizedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeScheduledActionsMessage,
  ) => stream.Stream<
    ScheduledAction,
    ScheduledActionNotFoundFault | UnauthorizedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeScheduledActionsMessage,
  output: ScheduledActionsMessage,
  errors: [ScheduledActionNotFoundFault, UnauthorizedOperation],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ScheduledActions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a list of tags. You can return tags from a specific resource by specifying
 * an ARN, or you can return all tags for a given type of resource, such as clusters,
 * snapshots, and so on.
 *
 * The following are limitations for `DescribeTags`:
 *
 * - You cannot specify an ARN and a resource-type value together in the same
 * request.
 *
 * - You cannot use the `MaxRecords` and `Marker`
 * parameters together with the ARN parameter.
 *
 * - The `MaxRecords` parameter can be a range from 10 to 50 results
 * to return in a request.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all resources that match any combination of the specified keys and values. For example,
 * if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all resources that have any
 * combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, resources are returned
 * regardless of whether they have tag keys or values associated with them.
 */
export const describeTags: {
  (
    input: DescribeTagsMessage,
  ): effect.Effect<
    TaggedResourceListMessage,
    InvalidTagFault | ResourceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTagsMessage,
  ) => stream.Stream<
    TaggedResourceListMessage,
    InvalidTagFault | ResourceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTagsMessage,
  ) => stream.Stream<
    TaggedResource,
    InvalidTagFault | ResourceNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTagsMessage,
  output: TaggedResourceListMessage,
  errors: [InvalidTagFault, ResourceNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "TaggedResources",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Disables the automatic copying of snapshots from one region to another region for a
 * specified cluster.
 *
 * If your cluster and its snapshots are encrypted using an encrypted symmetric key
 * from Key Management Service, use DeleteSnapshotCopyGrant to delete the grant that
 * grants Amazon Redshift permission to the key in the destination region.
 */
export const disableSnapshotCopy: (
  input: DisableSnapshotCopyMessage,
) => effect.Effect<
  DisableSnapshotCopyResult,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | SnapshotCopyAlreadyDisabledFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableSnapshotCopyMessage,
  output: DisableSnapshotCopyResult,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    SnapshotCopyAlreadyDisabledFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Generates an encrypted authentication token that propagates the caller's
 * Amazon Web Services IAM Identity Center identity to Amazon Redshift clusters. This API extracts the
 * Amazon Web Services IAM Identity Center identity from enhanced credentials and creates a secure token
 * that Amazon Redshift drivers can use for authentication.
 *
 * The token is encrypted using Key Management Service (KMS) and can only be
 * decrypted by the specified Amazon Redshift clusters. The token contains the caller's
 * Amazon Web Services IAM Identity Center identity information and is valid for a limited time period.
 *
 * This API is exclusively for use with Amazon Web Services IAM Identity Center enhanced credentials. If the
 * caller is not using enhanced credentials with embedded Amazon Web Services IAM Identity Center identity, the API will
 * return an error.
 */
export const getIdentityCenterAuthToken: (
  input: GetIdentityCenterAuthTokenRequest,
) => effect.Effect<
  GetIdentityCenterAuthTokenResponse,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | RedshiftInvalidParameterFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityCenterAuthTokenRequest,
  output: GetIdentityCenterAuthTokenResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    RedshiftInvalidParameterFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * This operation is retired. Calling this operation does not change AQUA configuration. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator).
 */
export const modifyAquaConfiguration: (
  input: ModifyAquaInputMessage,
) => effect.Effect<
  ModifyAquaOutputMessage,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyAquaInputMessage,
  output: ModifyAquaOutputMessage,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Modifies the database revision of a cluster. The database revision is a unique
 * revision of the database running in a cluster.
 */
export const modifyClusterDbRevision: (
  input: ModifyClusterDbRevisionMessage,
) => effect.Effect<
  ModifyClusterDbRevisionResult,
  | ClusterNotFoundFault
  | ClusterOnLatestRevisionFault
  | InvalidClusterStateFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterDbRevisionMessage,
  output: ModifyClusterDbRevisionResult,
  errors: [
    ClusterNotFoundFault,
    ClusterOnLatestRevisionFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Resumes a paused cluster.
 */
export const resumeCluster: (
  input: ResumeClusterMessage,
) => effect.Effect<
  ResumeClusterResult,
  | ClusterNotFoundFault
  | InsufficientClusterCapacityFault
  | InvalidClusterStateFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeClusterMessage,
  output: ResumeClusterResult,
  errors: [
    ClusterNotFoundFault,
    InsufficientClusterCapacityFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Revokes an ingress rule in an Amazon Redshift security group for a previously authorized
 * IP range or Amazon EC2 security group. To add an ingress rule, see AuthorizeClusterSecurityGroupIngress.
 * For information about managing security groups, go to
 * Amazon Redshift Cluster Security Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 */
export const revokeClusterSecurityGroupIngress: (
  input: RevokeClusterSecurityGroupIngressMessage,
) => effect.Effect<
  RevokeClusterSecurityGroupIngressResult,
  | AuthorizationNotFoundFault
  | ClusterSecurityGroupNotFoundFault
  | InvalidClusterSecurityGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeClusterSecurityGroupIngressMessage,
  output: RevokeClusterSecurityGroupIngressResult,
  errors: [
    AuthorizationNotFoundFault,
    ClusterSecurityGroupNotFoundFault,
    InvalidClusterSecurityGroupStateFault,
  ],
}));
/**
 * Rotates the encryption keys for a cluster.
 */
export const rotateEncryptionKey: (
  input: RotateEncryptionKeyMessage,
) => effect.Effect<
  RotateEncryptionKeyResult,
  | ClusterNotFoundFault
  | DependentServiceRequestThrottlingFault
  | InvalidClusterStateFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RotateEncryptionKeyMessage,
  output: RotateEncryptionKeyResult,
  errors: [
    ClusterNotFoundFault,
    DependentServiceRequestThrottlingFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Returns information about the last resize operation for the specified cluster. If
 * no resize operation has ever been initiated for the specified cluster, a HTTP
 * 404 error is returned. If a resize operation was initiated and completed, the
 * status of the resize remains as `SUCCEEDED` until the next resize.
 *
 * A resize operation can be requested using ModifyCluster and
 * specifying a different number or type of nodes for the cluster.
 */
export const describeResize: (
  input: DescribeResizeMessage,
) => effect.Effect<
  ResizeProgressMessage,
  | ClusterNotFoundFault
  | ResizeNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResizeMessage,
  output: ResizeProgressMessage,
  errors: [
    ClusterNotFoundFault,
    ResizeNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Modifies the parameters of a parameter group. For the parameters parameter, it can't contain ASCII characters.
 *
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const modifyClusterParameterGroup: (
  input: ModifyClusterParameterGroupMessage,
) => effect.Effect<
  ClusterParameterGroupNameMessage,
  | ClusterParameterGroupNotFoundFault
  | InvalidClusterParameterGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterParameterGroupMessage,
  output: ClusterParameterGroupNameMessage,
  errors: [
    ClusterParameterGroupNotFoundFault,
    InvalidClusterParameterGroupStateFault,
  ],
}));
/**
 * Sets one or more parameters of the specified parameter group to their default
 * values and sets the source values of the parameters to "engine-default". To reset the
 * entire parameter group specify the *ResetAllParameters* parameter.
 * For parameter changes to take effect you must reboot any associated clusters.
 */
export const resetClusterParameterGroup: (
  input: ResetClusterParameterGroupMessage,
) => effect.Effect<
  ClusterParameterGroupNameMessage,
  | ClusterParameterGroupNotFoundFault
  | InvalidClusterParameterGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetClusterParameterGroupMessage,
  output: ClusterParameterGroupNameMessage,
  errors: [
    ClusterParameterGroupNotFoundFault,
    InvalidClusterParameterGroupStateFault,
  ],
}));
/**
 * Lists descriptions of all the Amazon Redshift event notification subscriptions for a
 * customer account. If you specify a subscription name, lists the description for that
 * subscription.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all event notification subscriptions that match any combination of the specified keys
 * and values. For example, if you have `owner` and `environment` for
 * tag keys, and `admin` and `test` for tag values, all subscriptions
 * that have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, subscriptions are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeEventSubscriptions: {
  (
    input: DescribeEventSubscriptionsMessage,
  ): effect.Effect<
    EventSubscriptionsMessage,
    InvalidTagFault | SubscriptionNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventSubscriptionsMessage,
  ) => stream.Stream<
    EventSubscriptionsMessage,
    InvalidTagFault | SubscriptionNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventSubscriptionsMessage,
  ) => stream.Stream<
    EventSubscription,
    InvalidTagFault | SubscriptionNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventSubscriptionsMessage,
  output: EventSubscriptionsMessage,
  errors: [InvalidTagFault, SubscriptionNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "EventSubscriptionsList",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Fails over the primary compute unit of the specified Multi-AZ cluster to another Availability Zone.
 */
export const failoverPrimaryCompute: (
  input: FailoverPrimaryComputeInputMessage,
) => effect.Effect<
  FailoverPrimaryComputeResult,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FailoverPrimaryComputeInputMessage,
  output: FailoverPrimaryComputeResult,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Returns a list of snapshot copy grants owned by the Amazon Web Services account in the destination
 * region.
 *
 * For more information about managing snapshot copy grants, go to
 * Amazon Redshift Database Encryption
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeSnapshotCopyGrants: {
  (
    input: DescribeSnapshotCopyGrantsMessage,
  ): effect.Effect<
    SnapshotCopyGrantMessage,
    InvalidTagFault | SnapshotCopyGrantNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSnapshotCopyGrantsMessage,
  ) => stream.Stream<
    SnapshotCopyGrantMessage,
    InvalidTagFault | SnapshotCopyGrantNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSnapshotCopyGrantsMessage,
  ) => stream.Stream<
    SnapshotCopyGrant,
    InvalidTagFault | SnapshotCopyGrantNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSnapshotCopyGrantsMessage,
  output: SnapshotCopyGrantMessage,
  errors: [InvalidTagFault, SnapshotCopyGrantNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "SnapshotCopyGrants",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Modifies a snapshot schedule for a cluster.
 */
export const modifyClusterSnapshotSchedule: (
  input: ModifyClusterSnapshotScheduleMessage,
) => effect.Effect<
  ModifyClusterSnapshotScheduleResponse,
  | ClusterNotFoundFault
  | InvalidClusterSnapshotScheduleStateFault
  | SnapshotScheduleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterSnapshotScheduleMessage,
  output: ModifyClusterSnapshotScheduleResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterSnapshotScheduleStateFault,
    SnapshotScheduleNotFoundFault,
  ],
}));
/**
 * Adds tags to a cluster.
 *
 * A resource can have up to 50 tags. If you try to create more than 50 tags for a
 * resource, you will receive an error and the attempt will fail.
 *
 * If you specify a key that already exists for the resource, the value for that key
 * will be updated with the new value.
 */
export const createTags: (
  input: CreateTagsMessage,
) => effect.Effect<
  CreateTagsResponse,
  | InvalidClusterStateFault
  | InvalidTagFault
  | ResourceNotFoundFault
  | TagLimitExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTagsMessage,
  output: CreateTagsResponse,
  errors: [
    InvalidClusterStateFault,
    InvalidTagFault,
    ResourceNotFoundFault,
    TagLimitExceededFault,
  ],
}));
/**
 * Modifies a usage limit in a cluster.
 * You can't modify the feature type or period of a usage limit.
 */
export const modifyUsageLimit: (
  input: ModifyUsageLimitMessage,
) => effect.Effect<
  UsageLimit,
  | InvalidUsageLimitFault
  | UnsupportedOperationFault
  | UsageLimitNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyUsageLimitMessage,
  output: UsageLimit,
  errors: [
    InvalidUsageLimitFault,
    UnsupportedOperationFault,
    UsageLimitNotFoundFault,
  ],
}));
/**
 * Returns a list of datashares when the account identifier being called is a producer account identifier.
 */
export const describeDataSharesForProducer: {
  (
    input: DescribeDataSharesForProducerMessage,
  ): effect.Effect<
    DescribeDataSharesForProducerResult,
    InvalidNamespaceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDataSharesForProducerMessage,
  ) => stream.Stream<
    DescribeDataSharesForProducerResult,
    InvalidNamespaceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDataSharesForProducerMessage,
  ) => stream.Stream<
    DataShare,
    InvalidNamespaceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDataSharesForProducerMessage,
  output: DescribeDataSharesForProducerResult,
  errors: [InvalidNamespaceFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DataShares",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Registers a cluster or serverless namespace to the Amazon Web Services Glue Data Catalog.
 */
export const registerNamespace: (
  input: RegisterNamespaceInputMessage,
) => effect.Effect<
  RegisterNamespaceOutputMessage,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidNamespaceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterNamespaceInputMessage,
  output: RegisterNamespaceOutputMessage,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidNamespaceFault,
  ],
}));
/**
 * From a datashare consumer account, remove association for the specified datashare.
 */
export const disassociateDataShareConsumer: (
  input: DisassociateDataShareConsumerMessage,
) => effect.Effect<
  DataShare,
  InvalidDataShareFault | InvalidNamespaceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateDataShareConsumerMessage,
  output: DataShare,
  errors: [InvalidDataShareFault, InvalidNamespaceFault],
}));
/**
 * From a datashare consumer account, associates a datashare with the
 * account (AssociateEntireAccount) or the specified namespace (ConsumerArn). If you make this association, the consumer
 * can consume the datashare.
 */
export const associateDataShareConsumer: (
  input: AssociateDataShareConsumerMessage,
) => effect.Effect<
  DataShare,
  InvalidDataShareFault | InvalidNamespaceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateDataShareConsumerMessage,
  output: DataShare,
  errors: [InvalidDataShareFault, InvalidNamespaceFault],
}));
/**
 * Modifies the settings for a set of cluster snapshots.
 */
export const batchModifyClusterSnapshots: (
  input: BatchModifyClusterSnapshotsMessage,
) => effect.Effect<
  BatchModifyClusterSnapshotsOutputMessage,
  | BatchModifyClusterSnapshotsLimitExceededFault
  | InvalidRetentionPeriodFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchModifyClusterSnapshotsMessage,
  output: BatchModifyClusterSnapshotsOutputMessage,
  errors: [
    BatchModifyClusterSnapshotsLimitExceededFault,
    InvalidRetentionPeriodFault,
  ],
}));
/**
 * Removes the ability of the specified Amazon Web Services account to restore the specified
 * snapshot. If the account is currently restoring the snapshot, the restore will run to
 * completion.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const revokeSnapshotAccess: (
  input: RevokeSnapshotAccessMessage,
) => effect.Effect<
  RevokeSnapshotAccessResult,
  | AccessToSnapshotDeniedFault
  | AuthorizationNotFoundFault
  | ClusterSnapshotNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeSnapshotAccessMessage,
  output: RevokeSnapshotAccessResult,
  errors: [
    AccessToSnapshotDeniedFault,
    AuthorizationNotFoundFault,
    ClusterSnapshotNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Cancels a resize operation for a cluster.
 */
export const cancelResize: (
  input: CancelResizeMessage,
) => effect.Effect<
  ResizeProgressMessage,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | ResizeNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelResizeMessage,
  output: ResizeProgressMessage,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    ResizeNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Adds a partner integration to a cluster.
 * This operation authorizes a partner to push status updates for the specified database.
 * To complete the integration, you also set up the integration on the partner website.
 */
export const addPartner: (
  input: PartnerIntegrationInputMessage,
) => effect.Effect<
  PartnerIntegrationOutputMessage,
  | ClusterNotFoundFault
  | PartnerNotFoundFault
  | UnauthorizedPartnerIntegrationFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PartnerIntegrationInputMessage,
  output: PartnerIntegrationOutputMessage,
  errors: [
    ClusterNotFoundFault,
    PartnerNotFoundFault,
    UnauthorizedPartnerIntegrationFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Deletes a set of cluster snapshots.
 */
export const batchDeleteClusterSnapshots: (
  input: BatchDeleteClusterSnapshotsRequest,
) => effect.Effect<
  BatchDeleteClusterSnapshotsResult,
  BatchDeleteRequestSizeExceededFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteClusterSnapshotsRequest,
  output: BatchDeleteClusterSnapshotsResult,
  errors: [BatchDeleteRequestSizeExceededFault],
}));
/**
 * Creates a new Amazon Redshift security group. You use security groups to control access
 * to non-VPC clusters.
 *
 * For information about managing security groups, go to
 * Amazon Redshift Cluster Security Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 */
export const createClusterSecurityGroup: (
  input: CreateClusterSecurityGroupMessage,
) => effect.Effect<
  CreateClusterSecurityGroupResult,
  | ClusterSecurityGroupAlreadyExistsFault
  | ClusterSecurityGroupQuotaExceededFault
  | InvalidTagFault
  | TagLimitExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterSecurityGroupMessage,
  output: CreateClusterSecurityGroupResult,
  errors: [
    ClusterSecurityGroupAlreadyExistsFault,
    ClusterSecurityGroupQuotaExceededFault,
    InvalidTagFault,
    TagLimitExceededFault,
  ],
}));
/**
 * Deletes an authentication profile.
 */
export const deleteAuthenticationProfile: (
  input: DeleteAuthenticationProfileMessage,
) => effect.Effect<
  DeleteAuthenticationProfileResult,
  | AuthenticationProfileNotFoundFault
  | InvalidAuthenticationProfileRequestFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAuthenticationProfileMessage,
  output: DeleteAuthenticationProfileResult,
  errors: [
    AuthenticationProfileNotFoundFault,
    InvalidAuthenticationProfileRequestFault,
  ],
}));
/**
 * Deletes the specified manual snapshot. The snapshot must be in the
 * `available` state, with no other users authorized to access the snapshot.
 *
 * Unlike automated snapshots, manual snapshots are retained even after you delete
 * your cluster. Amazon Redshift does not delete your manual snapshots. You must delete manual
 * snapshot explicitly to avoid getting charged. If other accounts are authorized to access
 * the snapshot, you must revoke all of the authorizations before you can delete the
 * snapshot.
 */
export const deleteClusterSnapshot: (
  input: DeleteClusterSnapshotMessage,
) => effect.Effect<
  DeleteClusterSnapshotResult,
  | ClusterSnapshotNotFoundFault
  | InvalidClusterSnapshotStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterSnapshotMessage,
  output: DeleteClusterSnapshotResult,
  errors: [ClusterSnapshotNotFoundFault, InvalidClusterSnapshotStateFault],
}));
/**
 * Deletes the specified cluster subnet group.
 */
export const deleteClusterSubnetGroup: (
  input: DeleteClusterSubnetGroupMessage,
) => effect.Effect<
  DeleteClusterSubnetGroupResponse,
  | ClusterSubnetGroupNotFoundFault
  | InvalidClusterSubnetGroupStateFault
  | InvalidClusterSubnetStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterSubnetGroupMessage,
  output: DeleteClusterSubnetGroupResponse,
  errors: [
    ClusterSubnetGroupNotFoundFault,
    InvalidClusterSubnetGroupStateFault,
    InvalidClusterSubnetStateFault,
  ],
}));
/**
 * Deletes an Amazon Redshift IAM Identity Center application.
 */
export const deleteRedshiftIdcApplication: (
  input: DeleteRedshiftIdcApplicationMessage,
) => effect.Effect<
  DeleteRedshiftIdcApplicationResponse,
  | DependentServiceAccessDeniedFault
  | DependentServiceUnavailableFault
  | RedshiftIdcApplicationNotExistsFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRedshiftIdcApplicationMessage,
  output: DeleteRedshiftIdcApplicationResponse,
  errors: [
    DependentServiceAccessDeniedFault,
    DependentServiceUnavailableFault,
    RedshiftIdcApplicationNotExistsFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Deregisters a cluster or serverless namespace from the Amazon Web Services Glue Data Catalog.
 */
export const deregisterNamespace: (
  input: DeregisterNamespaceInputMessage,
) => effect.Effect<
  DeregisterNamespaceOutputMessage,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidNamespaceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterNamespaceInputMessage,
  output: DeregisterNamespaceOutputMessage,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidNamespaceFault,
  ],
}));
/**
 * Returns a list of attributes attached to an account
 */
export const describeAccountAttributes: (
  input: DescribeAccountAttributesMessage,
) => effect.Effect<
  AccountAttributeList,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountAttributesMessage,
  output: AccountAttributeList,
  errors: [],
}));
/**
 * Returns an array of `ClusterDbRevision` objects.
 */
export const describeClusterDbRevisions: {
  (
    input: DescribeClusterDbRevisionsMessage,
  ): effect.Effect<
    ClusterDbRevisionsMessage,
    ClusterNotFoundFault | InvalidClusterStateFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClusterDbRevisionsMessage,
  ) => stream.Stream<
    ClusterDbRevisionsMessage,
    ClusterNotFoundFault | InvalidClusterStateFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClusterDbRevisionsMessage,
  ) => stream.Stream<
    ClusterDbRevision,
    ClusterNotFoundFault | InvalidClusterStateFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClusterDbRevisionsMessage,
  output: ClusterDbRevisionsMessage,
  errors: [ClusterNotFoundFault, InvalidClusterStateFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ClusterDbRevisions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Displays a list of event categories for all event source types, or for a specified
 * source type. For a list of the event categories and source types, go to Amazon Redshift Event
 * Notifications.
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
 * Returns a list of inbound integrations.
 */
export const describeInboundIntegrations: {
  (
    input: DescribeInboundIntegrationsMessage,
  ): effect.Effect<
    InboundIntegrationsMessage,
    | IntegrationNotFoundFault
    | InvalidNamespaceFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInboundIntegrationsMessage,
  ) => stream.Stream<
    InboundIntegrationsMessage,
    | IntegrationNotFoundFault
    | InvalidNamespaceFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInboundIntegrationsMessage,
  ) => stream.Stream<
    InboundIntegration,
    | IntegrationNotFoundFault
    | InvalidNamespaceFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInboundIntegrationsMessage,
  output: InboundIntegrationsMessage,
  errors: [
    IntegrationNotFoundFault,
    InvalidNamespaceFault,
    UnsupportedOperationFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "InboundIntegrations",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns properties of possible node configurations such as node type, number of nodes, and
 * disk usage for the specified action type.
 */
export const describeNodeConfigurationOptions: {
  (
    input: DescribeNodeConfigurationOptionsMessage,
  ): effect.Effect<
    NodeConfigurationOptionsMessage,
    | AccessToSnapshotDeniedFault
    | ClusterNotFoundFault
    | ClusterSnapshotNotFoundFault
    | InvalidClusterSnapshotStateFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeNodeConfigurationOptionsMessage,
  ) => stream.Stream<
    NodeConfigurationOptionsMessage,
    | AccessToSnapshotDeniedFault
    | ClusterNotFoundFault
    | ClusterSnapshotNotFoundFault
    | InvalidClusterSnapshotStateFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeNodeConfigurationOptionsMessage,
  ) => stream.Stream<
    NodeConfigurationOption,
    | AccessToSnapshotDeniedFault
    | ClusterNotFoundFault
    | ClusterSnapshotNotFoundFault
    | InvalidClusterSnapshotStateFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeNodeConfigurationOptionsMessage,
  output: NodeConfigurationOptionsMessage,
  errors: [
    AccessToSnapshotDeniedFault,
    ClusterNotFoundFault,
    ClusterSnapshotNotFoundFault,
    InvalidClusterSnapshotStateFault,
    UnsupportedOperationFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "NodeConfigurationOptionList",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a list of the available reserved node offerings by Amazon Redshift with their
 * descriptions including the node type, the fixed and recurring costs of reserving the
 * node and duration the node will be reserved for you. These descriptions help you
 * determine which reserve node offering you want to purchase. You then use the unique
 * offering ID in you call to PurchaseReservedNodeOffering to reserve one
 * or more nodes for your Amazon Redshift cluster.
 *
 * For more information about reserved node offerings, go to
 * Purchasing Reserved Nodes
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeReservedNodeOfferings: {
  (
    input: DescribeReservedNodeOfferingsMessage,
  ): effect.Effect<
    ReservedNodeOfferingsMessage,
    | DependentServiceUnavailableFault
    | ReservedNodeOfferingNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedNodeOfferingsMessage,
  ) => stream.Stream<
    ReservedNodeOfferingsMessage,
    | DependentServiceUnavailableFault
    | ReservedNodeOfferingNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedNodeOfferingsMessage,
  ) => stream.Stream<
    ReservedNodeOffering,
    | DependentServiceUnavailableFault
    | ReservedNodeOfferingNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedNodeOfferingsMessage,
  output: ReservedNodeOfferingsMessage,
  errors: [
    DependentServiceUnavailableFault,
    ReservedNodeOfferingNotFoundFault,
    UnsupportedOperationFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReservedNodeOfferings",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Lists the status of one or more table restore requests made using the RestoreTableFromClusterSnapshot API action. If you don't specify a value
 * for the `TableRestoreRequestId` parameter, then
 * `DescribeTableRestoreStatus` returns the status of all table restore
 * requests ordered by the date and time of the request in ascending order. Otherwise
 * `DescribeTableRestoreStatus` returns the status of the table specified by
 * `TableRestoreRequestId`.
 */
export const describeTableRestoreStatus: {
  (
    input: DescribeTableRestoreStatusMessage,
  ): effect.Effect<
    TableRestoreStatusMessage,
    ClusterNotFoundFault | TableRestoreNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTableRestoreStatusMessage,
  ) => stream.Stream<
    TableRestoreStatusMessage,
    ClusterNotFoundFault | TableRestoreNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTableRestoreStatusMessage,
  ) => stream.Stream<
    TableRestoreStatus,
    ClusterNotFoundFault | TableRestoreNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTableRestoreStatusMessage,
  output: TableRestoreStatusMessage,
  errors: [ClusterNotFoundFault, TableRestoreNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "TableRestoreStatusDetails",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Get the resource policy for a specified resource.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyMessage,
) => effect.Effect<
  GetResourcePolicyResult,
  | InvalidPolicyFault
  | ResourceNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyMessage,
  output: GetResourcePolicyResult,
  errors: [
    InvalidPolicyFault,
    ResourceNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * List the Amazon Redshift Advisor recommendations for one or multiple Amazon Redshift clusters in an Amazon Web Services account.
 */
export const listRecommendations: {
  (
    input: ListRecommendationsMessage,
  ): effect.Effect<
    ListRecommendationsResult,
    ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendationsMessage,
  ) => stream.Stream<
    ListRecommendationsResult,
    ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendationsMessage,
  ) => stream.Stream<
    Recommendation,
    ClusterNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommendationsMessage,
  output: ListRecommendationsResult,
  errors: [ClusterNotFoundFault, UnsupportedOperationFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Recommendations",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Modifies a zero-ETL integration or S3 event integration with Amazon Redshift.
 */
export const modifyIntegration: (
  input: ModifyIntegrationMessage,
) => effect.Effect<
  Integration,
  | IntegrationAlreadyExistsFault
  | IntegrationConflictOperationFault
  | IntegrationConflictStateFault
  | IntegrationNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationAlreadyExistsFault,
    IntegrationConflictOperationFault,
    IntegrationConflictStateFault,
    IntegrationNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Modifies the number of days to retain snapshots in the destination Amazon Web Services Region after
 * they are copied from the source Amazon Web Services Region. By default, this operation only changes the
 * retention period of copied automated snapshots. The retention periods for both new and
 * existing copied automated snapshots are updated with the new retention period. You can
 * set the manual option to change only the retention periods of copied manual snapshots.
 * If you set this option, only newly copied manual snapshots have the new retention
 * period.
 */
export const modifySnapshotCopyRetentionPeriod: (
  input: ModifySnapshotCopyRetentionPeriodMessage,
) => effect.Effect<
  ModifySnapshotCopyRetentionPeriodResult,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidRetentionPeriodFault
  | SnapshotCopyDisabledFault
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifySnapshotCopyRetentionPeriodMessage,
  output: ModifySnapshotCopyRetentionPeriodResult,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidRetentionPeriodFault,
    SnapshotCopyDisabledFault,
    UnauthorizedOperation,
  ],
}));
/**
 * Returns information about the partner integrations defined for a cluster.
 */
export const describePartners: (
  input: DescribePartnersInputMessage,
) => effect.Effect<
  DescribePartnersOutputMessage,
  | ClusterNotFoundFault
  | UnauthorizedPartnerIntegrationFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePartnersInputMessage,
  output: DescribePartnersOutputMessage,
  errors: [
    ClusterNotFoundFault,
    UnauthorizedPartnerIntegrationFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Deletes a partner integration from a cluster. Data can still flow to the cluster until the integration is deleted at the partner's website.
 */
export const deletePartner: (
  input: PartnerIntegrationInputMessage,
) => effect.Effect<
  PartnerIntegrationOutputMessage,
  | ClusterNotFoundFault
  | PartnerNotFoundFault
  | UnauthorizedPartnerIntegrationFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PartnerIntegrationInputMessage,
  output: PartnerIntegrationOutputMessage,
  errors: [
    ClusterNotFoundFault,
    PartnerNotFoundFault,
    UnauthorizedPartnerIntegrationFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Updates the status of a partner integration.
 */
export const updatePartnerStatus: (
  input: UpdatePartnerStatusInputMessage,
) => effect.Effect<
  PartnerIntegrationOutputMessage,
  | ClusterNotFoundFault
  | PartnerNotFoundFault
  | UnauthorizedPartnerIntegrationFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePartnerStatusInputMessage,
  output: PartnerIntegrationOutputMessage,
  errors: [
    ClusterNotFoundFault,
    PartnerNotFoundFault,
    UnauthorizedPartnerIntegrationFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Creates a manual snapshot of the specified cluster. The cluster must be in the
 * `available` state.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const createClusterSnapshot: (
  input: CreateClusterSnapshotMessage,
) => effect.Effect<
  CreateClusterSnapshotResult,
  | ClusterNotFoundFault
  | ClusterSnapshotAlreadyExistsFault
  | ClusterSnapshotQuotaExceededFault
  | InvalidClusterStateFault
  | InvalidRetentionPeriodFault
  | InvalidTagFault
  | TagLimitExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterSnapshotMessage,
  output: CreateClusterSnapshotResult,
  errors: [
    ClusterNotFoundFault,
    ClusterSnapshotAlreadyExistsFault,
    ClusterSnapshotQuotaExceededFault,
    InvalidClusterStateFault,
    InvalidRetentionPeriodFault,
    InvalidTagFault,
    TagLimitExceededFault,
  ],
}));
/**
 * Modifies an authentication profile.
 */
export const modifyAuthenticationProfile: (
  input: ModifyAuthenticationProfileMessage,
) => effect.Effect<
  ModifyAuthenticationProfileResult,
  | AuthenticationProfileNotFoundFault
  | AuthenticationProfileQuotaExceededFault
  | InvalidAuthenticationProfileRequestFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyAuthenticationProfileMessage,
  output: ModifyAuthenticationProfileResult,
  errors: [
    AuthenticationProfileNotFoundFault,
    AuthenticationProfileQuotaExceededFault,
    InvalidAuthenticationProfileRequestFault,
  ],
}));
/**
 * Contains information for changing a custom domain association.
 */
export const modifyCustomDomainAssociation: (
  input: ModifyCustomDomainAssociationMessage,
) => effect.Effect<
  ModifyCustomDomainAssociationResult,
  | ClusterNotFoundFault
  | CustomCnameAssociationFault
  | CustomDomainAssociationNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyCustomDomainAssociationMessage,
  output: ModifyCustomDomainAssociationResult,
  errors: [
    ClusterNotFoundFault,
    CustomCnameAssociationFault,
    CustomDomainAssociationNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Modifies a scheduled action.
 */
export const modifyScheduledAction: (
  input: ModifyScheduledActionMessage,
) => effect.Effect<
  ScheduledAction,
  | ClusterNotFoundFault
  | InvalidScheduledActionFault
  | InvalidScheduleFault
  | ScheduledActionNotFoundFault
  | ScheduledActionTypeUnsupportedFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyScheduledActionMessage,
  output: ScheduledAction,
  errors: [
    ClusterNotFoundFault,
    InvalidScheduledActionFault,
    InvalidScheduleFault,
    ScheduledActionNotFoundFault,
    ScheduledActionTypeUnsupportedFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Describes an authentication profile.
 */
export const describeAuthenticationProfiles: (
  input: DescribeAuthenticationProfilesMessage,
) => effect.Effect<
  DescribeAuthenticationProfilesResult,
  | AuthenticationProfileNotFoundFault
  | InvalidAuthenticationProfileRequestFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAuthenticationProfilesMessage,
  output: DescribeAuthenticationProfilesResult,
  errors: [
    AuthenticationProfileNotFoundFault,
    InvalidAuthenticationProfileRequestFault,
  ],
}));
/**
 * Creates an authentication profile with the specified parameters.
 */
export const createAuthenticationProfile: (
  input: CreateAuthenticationProfileMessage,
) => effect.Effect<
  CreateAuthenticationProfileResult,
  | AuthenticationProfileAlreadyExistsFault
  | AuthenticationProfileQuotaExceededFault
  | InvalidAuthenticationProfileRequestFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAuthenticationProfileMessage,
  output: CreateAuthenticationProfileResult,
  errors: [
    AuthenticationProfileAlreadyExistsFault,
    AuthenticationProfileQuotaExceededFault,
    InvalidAuthenticationProfileRequestFault,
  ],
}));
/**
 * Modifies the settings for a snapshot.
 *
 * This exanmple modifies the manual retention period setting for a cluster snapshot.
 */
export const modifyClusterSnapshot: (
  input: ModifyClusterSnapshotMessage,
) => effect.Effect<
  ModifyClusterSnapshotResult,
  | ClusterSnapshotNotFoundFault
  | InvalidClusterSnapshotStateFault
  | InvalidRetentionPeriodFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterSnapshotMessage,
  output: ModifyClusterSnapshotResult,
  errors: [
    ClusterSnapshotNotFoundFault,
    InvalidClusterSnapshotStateFault,
    InvalidRetentionPeriodFault,
  ],
}));
/**
 * Returns the descriptions of the reserved nodes.
 */
export const describeReservedNodes: {
  (
    input: DescribeReservedNodesMessage,
  ): effect.Effect<
    ReservedNodesMessage,
    DependentServiceUnavailableFault | ReservedNodeNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedNodesMessage,
  ) => stream.Stream<
    ReservedNodesMessage,
    DependentServiceUnavailableFault | ReservedNodeNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedNodesMessage,
  ) => stream.Stream<
    ReservedNode,
    DependentServiceUnavailableFault | ReservedNodeNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedNodesMessage,
  output: ReservedNodesMessage,
  errors: [DependentServiceUnavailableFault, ReservedNodeNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReservedNodes",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Lists the Amazon Redshift IAM Identity Center applications.
 */
export const describeRedshiftIdcApplications: {
  (
    input: DescribeRedshiftIdcApplicationsMessage,
  ): effect.Effect<
    DescribeRedshiftIdcApplicationsResult,
    | DependentServiceAccessDeniedFault
    | DependentServiceUnavailableFault
    | RedshiftIdcApplicationNotExistsFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRedshiftIdcApplicationsMessage,
  ) => stream.Stream<
    DescribeRedshiftIdcApplicationsResult,
    | DependentServiceAccessDeniedFault
    | DependentServiceUnavailableFault
    | RedshiftIdcApplicationNotExistsFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRedshiftIdcApplicationsMessage,
  ) => stream.Stream<
    RedshiftIdcApplication,
    | DependentServiceAccessDeniedFault
    | DependentServiceUnavailableFault
    | RedshiftIdcApplicationNotExistsFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRedshiftIdcApplicationsMessage,
  output: DescribeRedshiftIdcApplicationsResult,
  errors: [
    DependentServiceAccessDeniedFault,
    DependentServiceUnavailableFault,
    RedshiftIdcApplicationNotExistsFault,
    UnsupportedOperationFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "RedshiftIdcApplications",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Modifies the lakehouse configuration for a cluster. This operation allows you to manage Amazon Redshift federated permissions and Amazon Web Services IAM Identity Center trusted identity propagation.
 */
export const modifyLakehouseConfiguration: (
  input: ModifyLakehouseConfigurationMessage,
) => effect.Effect<
  LakehouseConfiguration,
  | ClusterNotFoundFault
  | DependentServiceAccessDeniedFault
  | DependentServiceUnavailableFault
  | InvalidClusterStateFault
  | RedshiftIdcApplicationNotExistsFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyLakehouseConfigurationMessage,
  output: LakehouseConfiguration,
  errors: [
    ClusterNotFoundFault,
    DependentServiceAccessDeniedFault,
    DependentServiceUnavailableFault,
    InvalidClusterStateFault,
    RedshiftIdcApplicationNotExistsFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Changes an existing Amazon Redshift IAM Identity Center application.
 */
export const modifyRedshiftIdcApplication: (
  input: ModifyRedshiftIdcApplicationMessage,
) => effect.Effect<
  ModifyRedshiftIdcApplicationResult,
  | DependentServiceAccessDeniedFault
  | DependentServiceUnavailableFault
  | RedshiftIdcApplicationNotExistsFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyRedshiftIdcApplicationMessage,
  output: ModifyRedshiftIdcApplicationResult,
  errors: [
    DependentServiceAccessDeniedFault,
    DependentServiceUnavailableFault,
    RedshiftIdcApplicationNotExistsFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Modifies a snapshot schedule. Any schedule associated with a cluster is modified
 * asynchronously.
 */
export const modifySnapshotSchedule: (
  input: ModifySnapshotScheduleMessage,
) => effect.Effect<
  SnapshotSchedule,
  | InvalidScheduleFault
  | SnapshotScheduleNotFoundFault
  | SnapshotScheduleUpdateInProgressFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifySnapshotScheduleMessage,
  output: SnapshotSchedule,
  errors: [
    InvalidScheduleFault,
    SnapshotScheduleNotFoundFault,
    SnapshotScheduleUpdateInProgressFault,
  ],
}));
/**
 * Deletes a Redshift-managed VPC endpoint.
 */
export const deleteEndpointAccess: (
  input: DeleteEndpointAccessMessage,
) => effect.Effect<
  EndpointAccess,
  | ClusterNotFoundFault
  | EndpointNotFoundFault
  | InvalidClusterSecurityGroupStateFault
  | InvalidClusterStateFault
  | InvalidEndpointStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointAccessMessage,
  output: EndpointAccess,
  errors: [
    ClusterNotFoundFault,
    EndpointNotFoundFault,
    InvalidClusterSecurityGroupStateFault,
    InvalidClusterStateFault,
    InvalidEndpointStateFault,
  ],
}));
/**
 * Describes one or more zero-ETL or S3 event integrations with Amazon Redshift.
 */
export const describeIntegrations: {
  (
    input: DescribeIntegrationsMessage,
  ): effect.Effect<
    IntegrationsMessage,
    IntegrationNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeIntegrationsMessage,
  ) => stream.Stream<
    IntegrationsMessage,
    IntegrationNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeIntegrationsMessage,
  ) => stream.Stream<
    Integration,
    IntegrationNotFoundFault | UnsupportedOperationFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeIntegrationsMessage,
  output: IntegrationsMessage,
  errors: [IntegrationNotFoundFault, UnsupportedOperationFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Integrations",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Updates the resource policy for a specified resource.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyMessage,
) => effect.Effect<
  PutResourcePolicyResult,
  | ConflictPolicyUpdateFault
  | InvalidPolicyFault
  | ResourceNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyMessage,
  output: PutResourcePolicyResult,
  errors: [
    ConflictPolicyUpdateFault,
    InvalidPolicyFault,
    ResourceNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Deletes a zero-ETL integration or S3 event integration with Amazon Redshift.
 */
export const deleteIntegration: (
  input: DeleteIntegrationMessage,
) => effect.Effect<
  Integration,
  | IntegrationConflictOperationFault
  | IntegrationConflictStateFault
  | IntegrationNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationConflictOperationFault,
    IntegrationConflictStateFault,
    IntegrationNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Creates a usage limit for a specified Amazon Redshift feature on a cluster.
 * The usage limit is identified by the returned usage limit identifier.
 */
export const createUsageLimit: (
  input: CreateUsageLimitMessage,
) => effect.Effect<
  UsageLimit,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidUsageLimitFault
  | LimitExceededFault
  | TagLimitExceededFault
  | UnsupportedOperationFault
  | UsageLimitAlreadyExistsFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUsageLimitMessage,
  output: UsageLimit,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidUsageLimitFault,
    LimitExceededFault,
    TagLimitExceededFault,
    UnsupportedOperationFault,
    UsageLimitAlreadyExistsFault,
  ],
}));
/**
 * Grants access to a cluster.
 */
export const authorizeEndpointAccess: (
  input: AuthorizeEndpointAccessMessage,
) => effect.Effect<
  EndpointAuthorization,
  | ClusterNotFoundFault
  | EndpointAuthorizationAlreadyExistsFault
  | EndpointAuthorizationsPerClusterLimitExceededFault
  | InvalidAuthorizationStateFault
  | InvalidClusterStateFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AuthorizeEndpointAccessMessage,
  output: EndpointAuthorization,
  errors: [
    ClusterNotFoundFault,
    EndpointAuthorizationAlreadyExistsFault,
    EndpointAuthorizationsPerClusterLimitExceededFault,
    InvalidAuthorizationStateFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Copies the specified automated cluster snapshot to a new manual cluster snapshot.
 * The source must be an automated snapshot and it must be in the available
 * state.
 *
 * When you delete a cluster, Amazon Redshift deletes any automated snapshots of the
 * cluster. Also, when the retention period of the snapshot expires, Amazon Redshift
 * automatically deletes it. If you want to keep an automated snapshot for a longer period,
 * you can make a manual copy of the snapshot. Manual snapshots are retained until you
 * delete them.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const copyClusterSnapshot: (
  input: CopyClusterSnapshotMessage,
) => effect.Effect<
  CopyClusterSnapshotResult,
  | ClusterNotFoundFault
  | ClusterSnapshotAlreadyExistsFault
  | ClusterSnapshotNotFoundFault
  | ClusterSnapshotQuotaExceededFault
  | InvalidClusterSnapshotStateFault
  | InvalidRetentionPeriodFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyClusterSnapshotMessage,
  output: CopyClusterSnapshotResult,
  errors: [
    ClusterNotFoundFault,
    ClusterSnapshotAlreadyExistsFault,
    ClusterSnapshotNotFoundFault,
    ClusterSnapshotQuotaExceededFault,
    InvalidClusterSnapshotStateFault,
    InvalidRetentionPeriodFault,
  ],
}));
/**
 * Contains information about deleting a custom domain association for a cluster.
 */
export const deleteCustomDomainAssociation: (
  input: DeleteCustomDomainAssociationMessage,
) => effect.Effect<
  DeleteCustomDomainAssociationResponse,
  | ClusterNotFoundFault
  | CustomCnameAssociationFault
  | CustomDomainAssociationNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomDomainAssociationMessage,
  output: DeleteCustomDomainAssociationResponse,
  errors: [
    ClusterNotFoundFault,
    CustomCnameAssociationFault,
    CustomDomainAssociationNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Contains information about custom domain associations for a cluster.
 */
export const describeCustomDomainAssociations: {
  (
    input: DescribeCustomDomainAssociationsMessage,
  ): effect.Effect<
    CustomDomainAssociationsMessage,
    | CustomDomainAssociationNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCustomDomainAssociationsMessage,
  ) => stream.Stream<
    CustomDomainAssociationsMessage,
    | CustomDomainAssociationNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCustomDomainAssociationsMessage,
  ) => stream.Stream<
    Association,
    | CustomDomainAssociationNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCustomDomainAssociationsMessage,
  output: CustomDomainAssociationsMessage,
  errors: [CustomDomainAssociationNotFoundFault, UnsupportedOperationFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Associations",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns exchange status details and associated metadata for a reserved-node
 * exchange. Statuses include such values as in progress and requested.
 */
export const describeReservedNodeExchangeStatus: {
  (
    input: DescribeReservedNodeExchangeStatusInputMessage,
  ): effect.Effect<
    DescribeReservedNodeExchangeStatusOutputMessage,
    | ReservedNodeExchangeNotFoundFault
    | ReservedNodeNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedNodeExchangeStatusInputMessage,
  ) => stream.Stream<
    DescribeReservedNodeExchangeStatusOutputMessage,
    | ReservedNodeExchangeNotFoundFault
    | ReservedNodeNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedNodeExchangeStatusInputMessage,
  ) => stream.Stream<
    ReservedNodeExchangeStatus,
    | ReservedNodeExchangeNotFoundFault
    | ReservedNodeNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedNodeExchangeStatusInputMessage,
  output: DescribeReservedNodeExchangeStatusOutputMessage,
  errors: [
    ReservedNodeExchangeNotFoundFault,
    ReservedNodeNotFoundFault,
    UnsupportedOperationFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReservedNodeExchangeStatusDetails",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Modifies a Redshift-managed VPC endpoint.
 */
export const modifyEndpointAccess: (
  input: ModifyEndpointAccessMessage,
) => effect.Effect<
  EndpointAccess,
  | ClusterNotFoundFault
  | EndpointNotFoundFault
  | InvalidClusterSecurityGroupStateFault
  | InvalidClusterStateFault
  | InvalidEndpointStateFault
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyEndpointAccessMessage,
  output: EndpointAccess,
  errors: [
    ClusterNotFoundFault,
    EndpointNotFoundFault,
    InvalidClusterSecurityGroupStateFault,
    InvalidClusterStateFault,
    InvalidEndpointStateFault,
    UnauthorizedOperation,
  ],
}));
/**
 * Revokes access to a cluster.
 */
export const revokeEndpointAccess: (
  input: RevokeEndpointAccessMessage,
) => effect.Effect<
  EndpointAuthorization,
  | ClusterNotFoundFault
  | EndpointAuthorizationNotFoundFault
  | EndpointNotFoundFault
  | InvalidAuthorizationStateFault
  | InvalidClusterSecurityGroupStateFault
  | InvalidClusterStateFault
  | InvalidEndpointStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeEndpointAccessMessage,
  output: EndpointAuthorization,
  errors: [
    ClusterNotFoundFault,
    EndpointAuthorizationNotFoundFault,
    EndpointNotFoundFault,
    InvalidAuthorizationStateFault,
    InvalidClusterSecurityGroupStateFault,
    InvalidClusterStateFault,
    InvalidEndpointStateFault,
  ],
}));
/**
 * Creates an Amazon Redshift parameter group.
 *
 * Creating parameter groups is independent of creating clusters. You can associate a
 * cluster with a parameter group when you create the cluster. You can also associate an
 * existing cluster with a parameter group after the cluster is created by using ModifyCluster.
 *
 * Parameters in the parameter group define specific behavior that applies to the
 * databases you create on the cluster.
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const createClusterParameterGroup: (
  input: CreateClusterParameterGroupMessage,
) => effect.Effect<
  CreateClusterParameterGroupResult,
  | ClusterParameterGroupAlreadyExistsFault
  | ClusterParameterGroupQuotaExceededFault
  | InvalidTagFault
  | TagLimitExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterParameterGroupMessage,
  output: CreateClusterParameterGroupResult,
  errors: [
    ClusterParameterGroupAlreadyExistsFault,
    ClusterParameterGroupQuotaExceededFault,
    InvalidTagFault,
    TagLimitExceededFault,
  ],
}));
/**
 * Creates an HSM client certificate that an Amazon Redshift cluster will use to connect to
 * the client's HSM in order to store and retrieve the keys used to encrypt the cluster
 * databases.
 *
 * The command returns a public key, which you must store in the HSM. In addition to
 * creating the HSM certificate, you must create an Amazon Redshift HSM configuration that
 * provides a cluster the information needed to store and use encryption keys in the HSM.
 * For more information, go to Hardware Security Modules
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const createHsmClientCertificate: (
  input: CreateHsmClientCertificateMessage,
) => effect.Effect<
  CreateHsmClientCertificateResult,
  | HsmClientCertificateAlreadyExistsFault
  | HsmClientCertificateQuotaExceededFault
  | InvalidTagFault
  | TagLimitExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHsmClientCertificateMessage,
  output: CreateHsmClientCertificateResult,
  errors: [
    HsmClientCertificateAlreadyExistsFault,
    HsmClientCertificateQuotaExceededFault,
    InvalidTagFault,
    TagLimitExceededFault,
  ],
}));
/**
 * Creates an HSM configuration that contains the information required by an Amazon Redshift
 * cluster to store and use database encryption keys in a Hardware Security Module (HSM).
 * After creating the HSM configuration, you can specify it as a parameter when creating a
 * cluster. The cluster will then store its encryption keys in the HSM.
 *
 * In addition to creating an HSM configuration, you must also create an HSM client
 * certificate. For more information, go to Hardware Security Modules
 * in the Amazon Redshift Cluster Management Guide.
 */
export const createHsmConfiguration: (
  input: CreateHsmConfigurationMessage,
) => effect.Effect<
  CreateHsmConfigurationResult,
  | HsmConfigurationAlreadyExistsFault
  | HsmConfigurationQuotaExceededFault
  | InvalidTagFault
  | TagLimitExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHsmConfigurationMessage,
  output: CreateHsmConfigurationResult,
  errors: [
    HsmConfigurationAlreadyExistsFault,
    HsmConfigurationQuotaExceededFault,
    InvalidTagFault,
    TagLimitExceededFault,
  ],
}));
/**
 * Creates a scheduled action. A scheduled action contains a schedule and an Amazon Redshift API action.
 * For example, you can create a schedule of when to run the `ResizeCluster` API operation.
 */
export const createScheduledAction: (
  input: CreateScheduledActionMessage,
) => effect.Effect<
  ScheduledAction,
  | ClusterNotFoundFault
  | InvalidScheduledActionFault
  | InvalidScheduleFault
  | ScheduledActionAlreadyExistsFault
  | ScheduledActionQuotaExceededFault
  | ScheduledActionTypeUnsupportedFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScheduledActionMessage,
  output: ScheduledAction,
  errors: [
    ClusterNotFoundFault,
    InvalidScheduledActionFault,
    InvalidScheduleFault,
    ScheduledActionAlreadyExistsFault,
    ScheduledActionQuotaExceededFault,
    ScheduledActionTypeUnsupportedFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Deletes a previously provisioned cluster without its final snapshot being created. A successful response from the web
 * service indicates that the request was received correctly. Use DescribeClusters to monitor the status of the deletion. The delete
 * operation cannot be canceled or reverted once submitted.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * If you want to shut down the cluster and retain it for future use, set
 * *SkipFinalClusterSnapshot* to `false` and specify a
 * name for *FinalClusterSnapshotIdentifier*. You can later restore this
 * snapshot to resume using the cluster. If a final cluster snapshot is requested, the
 * status of the cluster will be "final-snapshot" while the snapshot is being taken, then
 * it's "deleting" once Amazon Redshift begins deleting the cluster.
 *
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const deleteCluster: (
  input: DeleteClusterMessage,
) => effect.Effect<
  DeleteClusterResult,
  | ClusterNotFoundFault
  | ClusterSnapshotAlreadyExistsFault
  | ClusterSnapshotQuotaExceededFault
  | InvalidClusterStateFault
  | InvalidRetentionPeriodFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterMessage,
  output: DeleteClusterResult,
  errors: [
    ClusterNotFoundFault,
    ClusterSnapshotAlreadyExistsFault,
    ClusterSnapshotQuotaExceededFault,
    InvalidClusterStateFault,
    InvalidRetentionPeriodFault,
  ],
}));
/**
 * Returns a list of all the available maintenance tracks.
 */
export const describeClusterTracks: {
  (
    input: DescribeClusterTracksMessage,
  ): effect.Effect<
    TrackListMessage,
    InvalidClusterTrackFault | UnauthorizedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClusterTracksMessage,
  ) => stream.Stream<
    TrackListMessage,
    InvalidClusterTrackFault | UnauthorizedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClusterTracksMessage,
  ) => stream.Stream<
    MaintenanceTrack,
    InvalidClusterTrackFault | UnauthorizedOperation | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClusterTracksMessage,
  output: TrackListMessage,
  errors: [InvalidClusterTrackFault, UnauthorizedOperation],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "MaintenanceTracks",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a list of orderable cluster options. Before you create a new cluster you
 * can use this operation to find what options are available, such as the EC2 Availability
 * Zones (AZ) in the specific Amazon Web Services Region that you can specify, and the node types you can
 * request. The node types differ by available storage, memory, CPU and price. With the
 * cost involved you might want to obtain a list of cluster options in the specific region
 * and specify values when creating a cluster.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeOrderableClusterOptions: {
  (
    input: DescribeOrderableClusterOptionsMessage,
  ): effect.Effect<
    OrderableClusterOptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOrderableClusterOptionsMessage,
  ) => stream.Stream<
    OrderableClusterOptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOrderableClusterOptionsMessage,
  ) => stream.Stream<
    OrderableClusterOption,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOrderableClusterOptionsMessage,
  output: OrderableClusterOptionsMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "OrderableClusterOptions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Starts logging information, such as queries and connection attempts, for the
 * specified Amazon Redshift cluster.
 */
export const enableLogging: (
  input: EnableLoggingMessage,
) => effect.Effect<
  LoggingStatus,
  | BucketNotFoundFault
  | ClusterNotFoundFault
  | InsufficientS3BucketPolicyFault
  | InvalidClusterStateFault
  | InvalidS3BucketNameFault
  | InvalidS3KeyPrefixFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableLoggingMessage,
  output: LoggingStatus,
  errors: [
    BucketNotFoundFault,
    ClusterNotFoundFault,
    InsufficientS3BucketPolicyFault,
    InvalidClusterStateFault,
    InvalidS3BucketNameFault,
    InvalidS3KeyPrefixFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Gets the configuration options for the reserved-node exchange. These options
 * include information about the source reserved node and target reserved node offering.
 * Details include the node type, the price, the node count, and the offering type.
 */
export const getReservedNodeExchangeConfigurationOptions: {
  (
    input: GetReservedNodeExchangeConfigurationOptionsInputMessage,
  ): effect.Effect<
    GetReservedNodeExchangeConfigurationOptionsOutputMessage,
    | ClusterNotFoundFault
    | ClusterSnapshotNotFoundFault
    | DependentServiceUnavailableFault
    | InvalidReservedNodeStateFault
    | ReservedNodeAlreadyMigratedFault
    | ReservedNodeNotFoundFault
    | ReservedNodeOfferingNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetReservedNodeExchangeConfigurationOptionsInputMessage,
  ) => stream.Stream<
    GetReservedNodeExchangeConfigurationOptionsOutputMessage,
    | ClusterNotFoundFault
    | ClusterSnapshotNotFoundFault
    | DependentServiceUnavailableFault
    | InvalidReservedNodeStateFault
    | ReservedNodeAlreadyMigratedFault
    | ReservedNodeNotFoundFault
    | ReservedNodeOfferingNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetReservedNodeExchangeConfigurationOptionsInputMessage,
  ) => stream.Stream<
    ReservedNodeConfigurationOption,
    | ClusterNotFoundFault
    | ClusterSnapshotNotFoundFault
    | DependentServiceUnavailableFault
    | InvalidReservedNodeStateFault
    | ReservedNodeAlreadyMigratedFault
    | ReservedNodeNotFoundFault
    | ReservedNodeOfferingNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetReservedNodeExchangeConfigurationOptionsInputMessage,
  output: GetReservedNodeExchangeConfigurationOptionsOutputMessage,
  errors: [
    ClusterNotFoundFault,
    ClusterSnapshotNotFoundFault,
    DependentServiceUnavailableFault,
    InvalidReservedNodeStateFault,
    ReservedNodeAlreadyMigratedFault,
    ReservedNodeNotFoundFault,
    ReservedNodeOfferingNotFoundFault,
    UnsupportedOperationFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReservedNodeConfigurationOptionList",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Creates a new table from a table in an Amazon Redshift cluster snapshot. You must
 * create the new table within the Amazon Redshift cluster that the snapshot was taken
 * from.
 *
 * You cannot use `RestoreTableFromClusterSnapshot` to restore a table with
 * the same name as an existing table in an Amazon Redshift cluster. That is, you cannot
 * overwrite an existing table in a cluster with a restored table. If you want to replace
 * your original table with a new, restored table, then rename or drop your original table
 * before you call `RestoreTableFromClusterSnapshot`. When you have renamed your
 * original table, then you can pass the original name of the table as the
 * `NewTableName` parameter value in the call to
 * `RestoreTableFromClusterSnapshot`. This way, you can replace the original
 * table with the table created from the snapshot.
 *
 * You can't use this operation to restore tables with
 * interleaved sort keys.
 */
export const restoreTableFromClusterSnapshot: (
  input: RestoreTableFromClusterSnapshotMessage,
) => effect.Effect<
  RestoreTableFromClusterSnapshotResult,
  | ClusterNotFoundFault
  | ClusterSnapshotNotFoundFault
  | InProgressTableRestoreQuotaExceededFault
  | InvalidClusterSnapshotStateFault
  | InvalidClusterStateFault
  | InvalidTableRestoreArgumentFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreTableFromClusterSnapshotMessage,
  output: RestoreTableFromClusterSnapshotResult,
  errors: [
    ClusterNotFoundFault,
    ClusterSnapshotNotFoundFault,
    InProgressTableRestoreQuotaExceededFault,
    InvalidClusterSnapshotStateFault,
    InvalidClusterStateFault,
    InvalidTableRestoreArgumentFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Allows you to purchase reserved nodes. Amazon Redshift offers a predefined set of
 * reserved node offerings. You can purchase one or more of the offerings. You can call the
 * DescribeReservedNodeOfferings API to obtain the available reserved
 * node offerings. You can call this API by providing a specific reserved node offering and
 * the number of nodes you want to reserve.
 *
 * For more information about reserved node offerings, go to
 * Purchasing Reserved Nodes
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const purchaseReservedNodeOffering: (
  input: PurchaseReservedNodeOfferingMessage,
) => effect.Effect<
  PurchaseReservedNodeOfferingResult,
  | ReservedNodeAlreadyExistsFault
  | ReservedNodeOfferingNotFoundFault
  | ReservedNodeQuotaExceededFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseReservedNodeOfferingMessage,
  output: PurchaseReservedNodeOfferingResult,
  errors: [
    ReservedNodeAlreadyExistsFault,
    ReservedNodeOfferingNotFoundFault,
    ReservedNodeQuotaExceededFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Returns an array of DC2 ReservedNodeOfferings that matches the payment type, term,
 * and usage price of the given DC1 reserved node.
 */
export const getReservedNodeExchangeOfferings: {
  (
    input: GetReservedNodeExchangeOfferingsInputMessage,
  ): effect.Effect<
    GetReservedNodeExchangeOfferingsOutputMessage,
    | DependentServiceUnavailableFault
    | InvalidReservedNodeStateFault
    | ReservedNodeAlreadyMigratedFault
    | ReservedNodeNotFoundFault
    | ReservedNodeOfferingNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetReservedNodeExchangeOfferingsInputMessage,
  ) => stream.Stream<
    GetReservedNodeExchangeOfferingsOutputMessage,
    | DependentServiceUnavailableFault
    | InvalidReservedNodeStateFault
    | ReservedNodeAlreadyMigratedFault
    | ReservedNodeNotFoundFault
    | ReservedNodeOfferingNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetReservedNodeExchangeOfferingsInputMessage,
  ) => stream.Stream<
    ReservedNodeOffering,
    | DependentServiceUnavailableFault
    | InvalidReservedNodeStateFault
    | ReservedNodeAlreadyMigratedFault
    | ReservedNodeNotFoundFault
    | ReservedNodeOfferingNotFoundFault
    | UnsupportedOperationFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetReservedNodeExchangeOfferingsInputMessage,
  output: GetReservedNodeExchangeOfferingsOutputMessage,
  errors: [
    DependentServiceUnavailableFault,
    InvalidReservedNodeStateFault,
    ReservedNodeAlreadyMigratedFault,
    ReservedNodeNotFoundFault,
    ReservedNodeOfferingNotFoundFault,
    UnsupportedOperationFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReservedNodeOfferings",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Exchanges a DC1 Reserved Node for a DC2 Reserved Node with no changes to the
 * configuration (term, payment type, or number of nodes) and no additional costs.
 */
export const acceptReservedNodeExchange: (
  input: AcceptReservedNodeExchangeInputMessage,
) => effect.Effect<
  AcceptReservedNodeExchangeOutputMessage,
  | DependentServiceUnavailableFault
  | InvalidReservedNodeStateFault
  | ReservedNodeAlreadyExistsFault
  | ReservedNodeAlreadyMigratedFault
  | ReservedNodeNotFoundFault
  | ReservedNodeOfferingNotFoundFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptReservedNodeExchangeInputMessage,
  output: AcceptReservedNodeExchangeOutputMessage,
  errors: [
    DependentServiceUnavailableFault,
    InvalidReservedNodeStateFault,
    ReservedNodeAlreadyExistsFault,
    ReservedNodeAlreadyMigratedFault,
    ReservedNodeNotFoundFault,
    ReservedNodeOfferingNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Creates a snapshot copy grant that permits Amazon Redshift to use an encrypted symmetric key
 * from Key Management Service (KMS) to encrypt copied snapshots in a
 * destination region.
 *
 * For more information about managing snapshot copy grants, go to
 * Amazon Redshift Database Encryption
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const createSnapshotCopyGrant: (
  input: CreateSnapshotCopyGrantMessage,
) => effect.Effect<
  CreateSnapshotCopyGrantResult,
  | DependentServiceRequestThrottlingFault
  | InvalidTagFault
  | LimitExceededFault
  | SnapshotCopyGrantAlreadyExistsFault
  | SnapshotCopyGrantQuotaExceededFault
  | TagLimitExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotCopyGrantMessage,
  output: CreateSnapshotCopyGrantResult,
  errors: [
    DependentServiceRequestThrottlingFault,
    InvalidTagFault,
    LimitExceededFault,
    SnapshotCopyGrantAlreadyExistsFault,
    SnapshotCopyGrantQuotaExceededFault,
    TagLimitExceededFault,
  ],
}));
/**
 * Modifies a cluster subnet group to include the specified list of VPC subnets. The
 * operation replaces the existing list of subnets with the new list of subnets.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that
 * you own in a Region from reaching or being reached from the internet through internet
 * gateways and egress-only internet gateways. If a subnet group for a
 * provisioned cluster is in an account with VPC BPA turned on, the following capabilities
 * are blocked:
 *
 * - Creating a public cluster
 *
 * - Restoring a public cluster
 *
 * - Modifying a private cluster to be public
 *
 * - Adding a subnet with VPC BPA turned on to the subnet group when there's at
 * least one public cluster within the group
 *
 * For more information about VPC BPA, see Block public access to VPCs and
 * subnets in the *Amazon VPC User Guide*.
 */
export const modifyClusterSubnetGroup: (
  input: ModifyClusterSubnetGroupMessage,
) => effect.Effect<
  ModifyClusterSubnetGroupResult,
  | ClusterSubnetGroupNotFoundFault
  | ClusterSubnetQuotaExceededFault
  | DependentServiceRequestThrottlingFault
  | InvalidSubnet
  | SubnetAlreadyInUse
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterSubnetGroupMessage,
  output: ModifyClusterSubnetGroupResult,
  errors: [
    ClusterSubnetGroupNotFoundFault,
    ClusterSubnetQuotaExceededFault,
    DependentServiceRequestThrottlingFault,
    InvalidSubnet,
    SubnetAlreadyInUse,
    UnauthorizedOperation,
  ],
}));
/**
 * Adds an inbound (ingress) rule to an Amazon Redshift security group. Depending on whether
 * the application accessing your cluster is running on the Internet or an Amazon EC2
 * instance, you can authorize inbound access to either a Classless Interdomain Routing
 * (CIDR)/Internet Protocol (IP) range or to an Amazon EC2 security group. You can add as
 * many as 20 ingress rules to an Amazon Redshift security group.
 *
 * If you authorize access to an Amazon EC2 security group, specify
 * *EC2SecurityGroupName* and
 * *EC2SecurityGroupOwnerId*. The Amazon EC2 security group and
 * Amazon Redshift cluster must be in the same Amazon Web Services Region.
 *
 * If you authorize access to a CIDR/IP address range, specify
 * *CIDRIP*. For an overview of CIDR blocks, see the Wikipedia
 * article on Classless Inter-Domain Routing.
 *
 * You must also associate the security group with a cluster so that clients running
 * on these IP addresses or the EC2 instance are authorized to connect to the cluster. For
 * information about managing security groups, go to Working with Security
 * Groups in the *Amazon Redshift Cluster Management Guide*.
 */
export const authorizeClusterSecurityGroupIngress: (
  input: AuthorizeClusterSecurityGroupIngressMessage,
) => effect.Effect<
  AuthorizeClusterSecurityGroupIngressResult,
  | AuthorizationAlreadyExistsFault
  | AuthorizationQuotaExceededFault
  | ClusterSecurityGroupNotFoundFault
  | InvalidClusterSecurityGroupStateFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AuthorizeClusterSecurityGroupIngressMessage,
  output: AuthorizeClusterSecurityGroupIngressResult,
  errors: [
    AuthorizationAlreadyExistsFault,
    AuthorizationQuotaExceededFault,
    ClusterSecurityGroupNotFoundFault,
    InvalidClusterSecurityGroupStateFault,
  ],
}));
/**
 * Creates a new Amazon Redshift subnet group. You must provide a list of one or more
 * subnets in your existing Amazon Virtual Private Cloud (Amazon VPC) when creating
 * Amazon Redshift subnet group.
 *
 * For information about subnet groups, go to
 * Amazon Redshift Cluster Subnet Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 */
export const createClusterSubnetGroup: (
  input: CreateClusterSubnetGroupMessage,
) => effect.Effect<
  CreateClusterSubnetGroupResult,
  | ClusterSubnetGroupAlreadyExistsFault
  | ClusterSubnetGroupQuotaExceededFault
  | ClusterSubnetQuotaExceededFault
  | DependentServiceRequestThrottlingFault
  | InvalidSubnet
  | InvalidTagFault
  | TagLimitExceededFault
  | UnauthorizedOperation
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterSubnetGroupMessage,
  output: CreateClusterSubnetGroupResult,
  errors: [
    ClusterSubnetGroupAlreadyExistsFault,
    ClusterSubnetGroupQuotaExceededFault,
    ClusterSubnetQuotaExceededFault,
    DependentServiceRequestThrottlingFault,
    InvalidSubnet,
    InvalidTagFault,
    TagLimitExceededFault,
    UnauthorizedOperation,
  ],
}));
/**
 * Create a snapshot schedule that can be associated to a cluster and which overrides the default system backup schedule.
 */
export const createSnapshotSchedule: (
  input: CreateSnapshotScheduleMessage,
) => effect.Effect<
  SnapshotSchedule,
  | InvalidScheduleFault
  | InvalidTagFault
  | ScheduleDefinitionTypeUnsupportedFault
  | SnapshotScheduleAlreadyExistsFault
  | SnapshotScheduleQuotaExceededFault
  | TagLimitExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotScheduleMessage,
  output: SnapshotSchedule,
  errors: [
    InvalidScheduleFault,
    InvalidTagFault,
    ScheduleDefinitionTypeUnsupportedFault,
    SnapshotScheduleAlreadyExistsFault,
    SnapshotScheduleQuotaExceededFault,
    TagLimitExceededFault,
  ],
}));
/**
 * Authorizes the specified Amazon Web Services account to restore the specified
 * snapshot.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const authorizeSnapshotAccess: (
  input: AuthorizeSnapshotAccessMessage,
) => effect.Effect<
  AuthorizeSnapshotAccessResult,
  | AuthorizationAlreadyExistsFault
  | AuthorizationQuotaExceededFault
  | ClusterSnapshotNotFoundFault
  | DependentServiceRequestThrottlingFault
  | InvalidClusterSnapshotStateFault
  | LimitExceededFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AuthorizeSnapshotAccessMessage,
  output: AuthorizeSnapshotAccessResult,
  errors: [
    AuthorizationAlreadyExistsFault,
    AuthorizationQuotaExceededFault,
    ClusterSnapshotNotFoundFault,
    DependentServiceRequestThrottlingFault,
    InvalidClusterSnapshotStateFault,
    LimitExceededFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Creates a zero-ETL integration or S3 event integration with Amazon Redshift.
 */
export const createIntegration: (
  input: CreateIntegrationMessage,
) => effect.Effect<
  Integration,
  | IntegrationAlreadyExistsFault
  | IntegrationConflictOperationFault
  | IntegrationQuotaExceededFault
  | IntegrationSourceNotFoundFault
  | IntegrationTargetNotFoundFault
  | InvalidClusterStateFault
  | InvalidTagFault
  | TagLimitExceededFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationAlreadyExistsFault,
    IntegrationConflictOperationFault,
    IntegrationQuotaExceededFault,
    IntegrationSourceNotFoundFault,
    IntegrationTargetNotFoundFault,
    InvalidClusterStateFault,
    InvalidTagFault,
    TagLimitExceededFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Enables the automatic copy of snapshots from one region to another region for a
 * specified cluster.
 */
export const enableSnapshotCopy: (
  input: EnableSnapshotCopyMessage,
) => effect.Effect<
  EnableSnapshotCopyResult,
  | ClusterNotFoundFault
  | CopyToRegionDisabledFault
  | DependentServiceRequestThrottlingFault
  | IncompatibleOrderableOptions
  | InvalidClusterStateFault
  | InvalidRetentionPeriodFault
  | LimitExceededFault
  | SnapshotCopyAlreadyEnabledFault
  | SnapshotCopyGrantNotFoundFault
  | UnauthorizedOperation
  | UnknownSnapshotCopyRegionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableSnapshotCopyMessage,
  output: EnableSnapshotCopyResult,
  errors: [
    ClusterNotFoundFault,
    CopyToRegionDisabledFault,
    DependentServiceRequestThrottlingFault,
    IncompatibleOrderableOptions,
    InvalidClusterStateFault,
    InvalidRetentionPeriodFault,
    LimitExceededFault,
    SnapshotCopyAlreadyEnabledFault,
    SnapshotCopyGrantNotFoundFault,
    UnauthorizedOperation,
    UnknownSnapshotCopyRegionFault,
  ],
}));
/**
 * Creates a new cluster with the specified parameters.
 *
 * To create a cluster in Virtual Private Cloud (VPC), you must provide a cluster
 * subnet group name. The cluster subnet group identifies the subnets of your VPC that
 * Amazon Redshift uses when creating the cluster.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that
 * you own in a Region from reaching or being reached from the internet through internet
 * gateways and egress-only internet gateways. If a subnet group for a
 * provisioned cluster is in an account with VPC BPA turned on, the following capabilities
 * are blocked:
 *
 * - Creating a public cluster
 *
 * - Restoring a public cluster
 *
 * - Modifying a private cluster to be public
 *
 * - Adding a subnet with VPC BPA turned on to the subnet group when there's at
 * least one public cluster within the group
 *
 * For more information about VPC BPA, see Block public access to VPCs and
 * subnets in the *Amazon VPC User Guide*.
 */
export const createCluster: (
  input: CreateClusterMessage,
) => effect.Effect<
  CreateClusterResult,
  | ClusterAlreadyExistsFault
  | ClusterParameterGroupNotFoundFault
  | ClusterQuotaExceededFault
  | ClusterSecurityGroupNotFoundFault
  | ClusterSubnetGroupNotFoundFault
  | DependentServiceAccessDeniedFault
  | DependentServiceRequestThrottlingFault
  | DependentServiceUnavailableFault
  | HsmClientCertificateNotFoundFault
  | HsmConfigurationNotFoundFault
  | InsufficientClusterCapacityFault
  | InvalidClusterSubnetGroupStateFault
  | InvalidClusterTrackFault
  | InvalidElasticIpFault
  | InvalidRetentionPeriodFault
  | InvalidSubnet
  | InvalidTagFault
  | InvalidVPCNetworkStateFault
  | Ipv6CidrBlockNotFoundFault
  | LimitExceededFault
  | NumberOfNodesPerClusterLimitExceededFault
  | NumberOfNodesQuotaExceededFault
  | RedshiftIdcApplicationNotExistsFault
  | SnapshotScheduleNotFoundFault
  | TagLimitExceededFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterMessage,
  output: CreateClusterResult,
  errors: [
    ClusterAlreadyExistsFault,
    ClusterParameterGroupNotFoundFault,
    ClusterQuotaExceededFault,
    ClusterSecurityGroupNotFoundFault,
    ClusterSubnetGroupNotFoundFault,
    DependentServiceAccessDeniedFault,
    DependentServiceRequestThrottlingFault,
    DependentServiceUnavailableFault,
    HsmClientCertificateNotFoundFault,
    HsmConfigurationNotFoundFault,
    InsufficientClusterCapacityFault,
    InvalidClusterSubnetGroupStateFault,
    InvalidClusterTrackFault,
    InvalidElasticIpFault,
    InvalidRetentionPeriodFault,
    InvalidSubnet,
    InvalidTagFault,
    InvalidVPCNetworkStateFault,
    Ipv6CidrBlockNotFoundFault,
    LimitExceededFault,
    NumberOfNodesPerClusterLimitExceededFault,
    NumberOfNodesQuotaExceededFault,
    RedshiftIdcApplicationNotExistsFault,
    SnapshotScheduleNotFoundFault,
    TagLimitExceededFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Creates a new cluster from a snapshot. By default, Amazon Redshift creates the resulting
 * cluster with the same configuration as the original cluster from which the snapshot was
 * created, except that the new cluster is created with the default cluster security and
 * parameter groups. After Amazon Redshift creates the cluster, you can use the ModifyCluster API to associate a different security group and different
 * parameter group with the restored cluster. If you are using a DS node type, you can also
 * choose to change to another DS node type of the same size during restore.
 *
 * If you restore a cluster into a VPC, you must provide a cluster subnet group where
 * you want the cluster restored.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that
 * you own in a Region from reaching or being reached from the internet through internet
 * gateways and egress-only internet gateways. If a subnet group for a
 * provisioned cluster is in an account with VPC BPA turned on, the following capabilities
 * are blocked:
 *
 * - Creating a public cluster
 *
 * - Restoring a public cluster
 *
 * - Modifying a private cluster to be public
 *
 * - Adding a subnet with VPC BPA turned on to the subnet group when there's at
 * least one public cluster within the group
 *
 * For more information about VPC BPA, see Block public access to VPCs and
 * subnets in the *Amazon VPC User Guide*.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const restoreFromClusterSnapshot: (
  input: RestoreFromClusterSnapshotMessage,
) => effect.Effect<
  RestoreFromClusterSnapshotResult,
  | AccessToSnapshotDeniedFault
  | ClusterAlreadyExistsFault
  | ClusterParameterGroupNotFoundFault
  | ClusterQuotaExceededFault
  | ClusterSecurityGroupNotFoundFault
  | ClusterSnapshotNotFoundFault
  | ClusterSubnetGroupNotFoundFault
  | DependentServiceAccessDeniedFault
  | DependentServiceRequestThrottlingFault
  | DependentServiceUnavailableFault
  | HsmClientCertificateNotFoundFault
  | HsmConfigurationNotFoundFault
  | InsufficientClusterCapacityFault
  | InvalidClusterSnapshotStateFault
  | InvalidClusterSubnetGroupStateFault
  | InvalidClusterTrackFault
  | InvalidElasticIpFault
  | InvalidReservedNodeStateFault
  | InvalidRestoreFault
  | InvalidSubnet
  | InvalidTagFault
  | InvalidVPCNetworkStateFault
  | Ipv6CidrBlockNotFoundFault
  | LimitExceededFault
  | NumberOfNodesPerClusterLimitExceededFault
  | NumberOfNodesQuotaExceededFault
  | RedshiftIdcApplicationNotExistsFault
  | ReservedNodeAlreadyExistsFault
  | ReservedNodeAlreadyMigratedFault
  | ReservedNodeNotFoundFault
  | ReservedNodeOfferingNotFoundFault
  | SnapshotScheduleNotFoundFault
  | TagLimitExceededFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreFromClusterSnapshotMessage,
  output: RestoreFromClusterSnapshotResult,
  errors: [
    AccessToSnapshotDeniedFault,
    ClusterAlreadyExistsFault,
    ClusterParameterGroupNotFoundFault,
    ClusterQuotaExceededFault,
    ClusterSecurityGroupNotFoundFault,
    ClusterSnapshotNotFoundFault,
    ClusterSubnetGroupNotFoundFault,
    DependentServiceAccessDeniedFault,
    DependentServiceRequestThrottlingFault,
    DependentServiceUnavailableFault,
    HsmClientCertificateNotFoundFault,
    HsmConfigurationNotFoundFault,
    InsufficientClusterCapacityFault,
    InvalidClusterSnapshotStateFault,
    InvalidClusterSubnetGroupStateFault,
    InvalidClusterTrackFault,
    InvalidElasticIpFault,
    InvalidReservedNodeStateFault,
    InvalidRestoreFault,
    InvalidSubnet,
    InvalidTagFault,
    InvalidVPCNetworkStateFault,
    Ipv6CidrBlockNotFoundFault,
    LimitExceededFault,
    NumberOfNodesPerClusterLimitExceededFault,
    NumberOfNodesQuotaExceededFault,
    RedshiftIdcApplicationNotExistsFault,
    ReservedNodeAlreadyExistsFault,
    ReservedNodeAlreadyMigratedFault,
    ReservedNodeNotFoundFault,
    ReservedNodeOfferingNotFoundFault,
    SnapshotScheduleNotFoundFault,
    TagLimitExceededFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Creates an Amazon Redshift application for use with IAM Identity Center.
 */
export const createRedshiftIdcApplication: (
  input: CreateRedshiftIdcApplicationMessage,
) => effect.Effect<
  CreateRedshiftIdcApplicationResult,
  | DependentServiceAccessDeniedFault
  | DependentServiceUnavailableFault
  | InvalidTagFault
  | RedshiftIdcApplicationAlreadyExistsFault
  | RedshiftIdcApplicationQuotaExceededFault
  | TagLimitExceededFault
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRedshiftIdcApplicationMessage,
  output: CreateRedshiftIdcApplicationResult,
  errors: [
    DependentServiceAccessDeniedFault,
    DependentServiceUnavailableFault,
    InvalidTagFault,
    RedshiftIdcApplicationAlreadyExistsFault,
    RedshiftIdcApplicationQuotaExceededFault,
    TagLimitExceededFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Changes the size of the cluster. You can change the cluster's type, or change the
 * number or type of nodes. The default behavior is to use the elastic resize method. With
 * an elastic resize, your cluster is available for read and write operations more quickly
 * than with the classic resize method.
 *
 * Elastic resize operations have the following restrictions:
 *
 * - You can only resize clusters of the following types:
 *
 * - dc2.large
 *
 * - dc2.8xlarge
 *
 * - ra3.large
 *
 * - ra3.xlplus
 *
 * - ra3.4xlarge
 *
 * - ra3.16xlarge
 *
 * - The type of nodes that you add must match the node type for the
 * cluster.
 */
export const resizeCluster: (
  input: ResizeClusterMessage,
) => effect.Effect<
  ResizeClusterResult,
  | ClusterNotFoundFault
  | DependentServiceUnavailableFault
  | InsufficientClusterCapacityFault
  | InvalidClusterStateFault
  | InvalidReservedNodeStateFault
  | LimitExceededFault
  | NumberOfNodesPerClusterLimitExceededFault
  | NumberOfNodesQuotaExceededFault
  | ReservedNodeAlreadyExistsFault
  | ReservedNodeAlreadyMigratedFault
  | ReservedNodeNotFoundFault
  | ReservedNodeOfferingNotFoundFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | UnsupportedOptionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResizeClusterMessage,
  output: ResizeClusterResult,
  errors: [
    ClusterNotFoundFault,
    DependentServiceUnavailableFault,
    InsufficientClusterCapacityFault,
    InvalidClusterStateFault,
    InvalidReservedNodeStateFault,
    LimitExceededFault,
    NumberOfNodesPerClusterLimitExceededFault,
    NumberOfNodesQuotaExceededFault,
    ReservedNodeAlreadyExistsFault,
    ReservedNodeAlreadyMigratedFault,
    ReservedNodeNotFoundFault,
    ReservedNodeOfferingNotFoundFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
    UnsupportedOptionFault,
  ],
}));
/**
 * Modifies the settings for a cluster.
 *
 * You can also change node type and the number of nodes to scale up or down the
 * cluster. When resizing a cluster, you must specify both the number of nodes and the node
 * type even if one of the parameters does not change.
 *
 * You can add another security or
 * parameter group, or change the admin user password. Resetting a cluster password or modifying the security groups associated with a cluster do not need a reboot. However, modifying a parameter group requires a reboot for parameters to take effect.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that
 * you own in a Region from reaching or being reached from the internet through internet
 * gateways and egress-only internet gateways. If a subnet group for a
 * provisioned cluster is in an account with VPC BPA turned on, the following capabilities
 * are blocked:
 *
 * - Creating a public cluster
 *
 * - Restoring a public cluster
 *
 * - Modifying a private cluster to be public
 *
 * - Adding a subnet with VPC BPA turned on to the subnet group when there's at
 * least one public cluster within the group
 *
 * For more information about VPC BPA, see Block public access to VPCs and
 * subnets in the *Amazon VPC User Guide*.
 */
export const modifyCluster: (
  input: ModifyClusterMessage,
) => effect.Effect<
  ModifyClusterResult,
  | ClusterAlreadyExistsFault
  | ClusterNotFoundFault
  | ClusterParameterGroupNotFoundFault
  | ClusterSecurityGroupNotFoundFault
  | CustomCnameAssociationFault
  | DependentServiceRequestThrottlingFault
  | HsmClientCertificateNotFoundFault
  | HsmConfigurationNotFoundFault
  | InsufficientClusterCapacityFault
  | InvalidClusterSecurityGroupStateFault
  | InvalidClusterStateFault
  | InvalidClusterTrackFault
  | InvalidElasticIpFault
  | InvalidRetentionPeriodFault
  | Ipv6CidrBlockNotFoundFault
  | LimitExceededFault
  | NumberOfNodesPerClusterLimitExceededFault
  | NumberOfNodesQuotaExceededFault
  | TableLimitExceededFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | UnsupportedOptionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterMessage,
  output: ModifyClusterResult,
  errors: [
    ClusterAlreadyExistsFault,
    ClusterNotFoundFault,
    ClusterParameterGroupNotFoundFault,
    ClusterSecurityGroupNotFoundFault,
    CustomCnameAssociationFault,
    DependentServiceRequestThrottlingFault,
    HsmClientCertificateNotFoundFault,
    HsmConfigurationNotFoundFault,
    InsufficientClusterCapacityFault,
    InvalidClusterSecurityGroupStateFault,
    InvalidClusterStateFault,
    InvalidClusterTrackFault,
    InvalidElasticIpFault,
    InvalidRetentionPeriodFault,
    Ipv6CidrBlockNotFoundFault,
    LimitExceededFault,
    NumberOfNodesPerClusterLimitExceededFault,
    NumberOfNodesQuotaExceededFault,
    TableLimitExceededFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
    UnsupportedOptionFault,
  ],
}));
/**
 * Creates a Redshift-managed VPC endpoint.
 */
export const createEndpointAccess: (
  input: CreateEndpointAccessMessage,
) => effect.Effect<
  EndpointAccess,
  | AccessToClusterDeniedFault
  | ClusterNotFoundFault
  | ClusterSubnetGroupNotFoundFault
  | EndpointAlreadyExistsFault
  | EndpointsPerAuthorizationLimitExceededFault
  | EndpointsPerClusterLimitExceededFault
  | InvalidClusterSecurityGroupStateFault
  | InvalidClusterStateFault
  | UnauthorizedOperation
  | UnsupportedOperationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEndpointAccessMessage,
  output: EndpointAccess,
  errors: [
    AccessToClusterDeniedFault,
    ClusterNotFoundFault,
    ClusterSubnetGroupNotFoundFault,
    EndpointAlreadyExistsFault,
    EndpointsPerAuthorizationLimitExceededFault,
    EndpointsPerClusterLimitExceededFault,
    InvalidClusterSecurityGroupStateFault,
    InvalidClusterStateFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Modifies an existing Amazon Redshift event notification subscription.
 */
export const modifyEventSubscription: (
  input: ModifyEventSubscriptionMessage,
) => effect.Effect<
  ModifyEventSubscriptionResult,
  | InvalidSubscriptionStateFault
  | SNSInvalidTopicFault
  | SNSNoAuthorizationFault
  | SNSTopicArnNotFoundFault
  | SourceNotFoundFault
  | SubscriptionCategoryNotFoundFault
  | SubscriptionEventIdNotFoundFault
  | SubscriptionNotFoundFault
  | SubscriptionSeverityNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyEventSubscriptionMessage,
  output: ModifyEventSubscriptionResult,
  errors: [
    InvalidSubscriptionStateFault,
    SNSInvalidTopicFault,
    SNSNoAuthorizationFault,
    SNSTopicArnNotFoundFault,
    SourceNotFoundFault,
    SubscriptionCategoryNotFoundFault,
    SubscriptionEventIdNotFoundFault,
    SubscriptionNotFoundFault,
    SubscriptionSeverityNotFoundFault,
  ],
}));
/**
 * Creates an Amazon Redshift event notification subscription. This action requires an ARN
 * (Amazon Resource Name) of an Amazon SNS topic created by either the Amazon Redshift console,
 * the Amazon SNS console, or the Amazon SNS API. To obtain an ARN with Amazon SNS, you
 * must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in
 * the SNS console.
 *
 * You can specify the source type, and lists of Amazon Redshift source IDs, event
 * categories, and event severities. Notifications will be sent for all events you want
 * that match those criteria. For example, you can specify source type = cluster, source ID
 * = my-cluster-1 and mycluster2, event categories = Availability, Backup, and severity =
 * ERROR. The subscription will only send notifications for those ERROR events in the
 * Availability and Backup categories for the specified clusters.
 *
 * If you specify both the source type and source IDs, such as source type = cluster
 * and source identifier = my-cluster-1, notifications will be sent for all the cluster
 * events for my-cluster-1. If you specify a source type but do not specify a source
 * identifier, you will receive notice of the events for the objects of that type in your
 * Amazon Web Services account. If you do not specify either the SourceType nor the SourceIdentifier, you
 * will be notified of events generated from all Amazon Redshift sources belonging to your Amazon Web Services account. You must specify a source type if you specify a source ID.
 */
export const createEventSubscription: (
  input: CreateEventSubscriptionMessage,
) => effect.Effect<
  CreateEventSubscriptionResult,
  | EventSubscriptionQuotaExceededFault
  | InvalidTagFault
  | SNSInvalidTopicFault
  | SNSNoAuthorizationFault
  | SNSTopicArnNotFoundFault
  | SourceNotFoundFault
  | SubscriptionAlreadyExistFault
  | SubscriptionCategoryNotFoundFault
  | SubscriptionEventIdNotFoundFault
  | SubscriptionSeverityNotFoundFault
  | TagLimitExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventSubscriptionMessage,
  output: CreateEventSubscriptionResult,
  errors: [
    EventSubscriptionQuotaExceededFault,
    InvalidTagFault,
    SNSInvalidTopicFault,
    SNSNoAuthorizationFault,
    SNSTopicArnNotFoundFault,
    SourceNotFoundFault,
    SubscriptionAlreadyExistFault,
    SubscriptionCategoryNotFoundFault,
    SubscriptionEventIdNotFoundFault,
    SubscriptionSeverityNotFoundFault,
    TagLimitExceededFault,
  ],
}));
