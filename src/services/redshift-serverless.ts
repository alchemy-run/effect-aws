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
const svc = T.AwsApiService({
  sdkId: "Redshift Serverless",
  serviceShapeName: "RedshiftServerless",
});
const auth = T.AwsAuthSigv4({ name: "redshift-serverless" });
const ver = T.ServiceVersion("2021-04-21");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://redshift-serverless-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://redshift-serverless-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://redshift-serverless.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://redshift-serverless.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type WorkgroupName = string;
export type CustomDomainName = string;
export type CustomDomainCertificateArnString = string;
export type DbName = string;
export type TrackName = string;
export type PaginationToken = string;
export type AmazonResourceName = string;
export type TagKey = string;
export type SubnetId = string;
export type VpcSecurityGroupId = string;
export type OwnerAccount = string;
export type SourceArn = string;
export type NamespaceName = string;
export type DbUser = string | redacted.Redacted<string>;
export type DbPassword = string | redacted.Redacted<string>;
export type IamRoleArn = string;
export type LogExport = string;
export type KmsKeyId = string;
export type RedshiftIdcApplicationArn = string;
export type LakehouseRegistration = string;
export type CatalogNameString = string;
export type LakehouseIdcRegistration = string;
export type Capacity = number;
export type OfferingId = string;
export type ReservationId = string;
export type ScheduledActionName = string;
export type UsageLimitUsageType = string;
export type UsageLimitPeriod = string;
export type UsageLimitBreachAction = string;
export type SecurityGroupId = string;
export type IpAddressType = string;
export type TagValue = string;
export type ParameterKey = string;
export type ParameterValue = string;
export type PerformanceTargetStatus = string;
export type SnapshotNamePrefix = string;
export type ManagedWorkgroupName = string;
export type NamespaceStatus = string;
export type SnapshotStatus = string;
export type ReservationArn = string;
export type Status = string;
export type Duration = number;
export type Charge = number;
export type CurrencyCode = string;
export type OfferingType = string;
export type State = string;
export type WorkgroupStatus = string;

//# Schemas
export type WorkgroupNameList = string[];
export const WorkgroupNameList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type VpcSecurityGroupIdList = string[];
export const VpcSecurityGroupIdList = S.Array(S.String);
export type IamRoleArnList = string[];
export const IamRoleArnList = S.Array(S.String);
export type LogExportList = string[];
export const LogExportList = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface CreateCustomDomainAssociationRequest {
  workgroupName: string;
  customDomainName: string;
  customDomainCertificateArn: string;
}
export const CreateCustomDomainAssociationRequest = S.suspend(() =>
  S.Struct({
    workgroupName: S.String,
    customDomainName: S.String,
    customDomainCertificateArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCustomDomainAssociationRequest",
}) as any as S.Schema<CreateCustomDomainAssociationRequest>;
export interface DeleteCustomDomainAssociationRequest {
  workgroupName: string;
  customDomainName: string;
}
export const DeleteCustomDomainAssociationRequest = S.suspend(() =>
  S.Struct({ workgroupName: S.String, customDomainName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCustomDomainAssociationRequest",
}) as any as S.Schema<DeleteCustomDomainAssociationRequest>;
export interface DeleteCustomDomainAssociationResponse {}
export const DeleteCustomDomainAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomDomainAssociationResponse",
}) as any as S.Schema<DeleteCustomDomainAssociationResponse>;
export interface DeleteResourcePolicyRequest {
  resourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface GetCredentialsRequest {
  dbName?: string;
  durationSeconds?: number;
  workgroupName?: string;
  customDomainName?: string;
}
export const GetCredentialsRequest = S.suspend(() =>
  S.Struct({
    dbName: S.optional(S.String),
    durationSeconds: S.optional(S.Number),
    workgroupName: S.optional(S.String),
    customDomainName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCredentialsRequest",
}) as any as S.Schema<GetCredentialsRequest>;
export interface GetCustomDomainAssociationRequest {
  customDomainName: string;
  workgroupName: string;
}
export const GetCustomDomainAssociationRequest = S.suspend(() =>
  S.Struct({ customDomainName: S.String, workgroupName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCustomDomainAssociationRequest",
}) as any as S.Schema<GetCustomDomainAssociationRequest>;
export interface GetIdentityCenterAuthTokenRequest {
  workgroupNames: string[];
}
export const GetIdentityCenterAuthTokenRequest = S.suspend(() =>
  S.Struct({ workgroupNames: WorkgroupNameList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetIdentityCenterAuthTokenRequest",
}) as any as S.Schema<GetIdentityCenterAuthTokenRequest>;
export interface GetResourcePolicyRequest {
  resourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface GetTrackRequest {
  trackName: string;
}
export const GetTrackRequest = S.suspend(() =>
  S.Struct({ trackName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTrackRequest",
}) as any as S.Schema<GetTrackRequest>;
export interface ListCustomDomainAssociationsRequest {
  nextToken?: string;
  maxResults?: number;
  customDomainName?: string;
  customDomainCertificateArn?: string;
}
export const ListCustomDomainAssociationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    customDomainName: S.optional(S.String),
    customDomainCertificateArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCustomDomainAssociationsRequest",
}) as any as S.Schema<ListCustomDomainAssociationsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTracksRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListTracksRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTracksRequest",
}) as any as S.Schema<ListTracksRequest>;
export interface PutResourcePolicyRequest {
  resourceArn: string;
  policy: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, policy: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateCustomDomainAssociationRequest {
  workgroupName: string;
  customDomainName: string;
  customDomainCertificateArn: string;
}
export const UpdateCustomDomainAssociationRequest = S.suspend(() =>
  S.Struct({
    workgroupName: S.String,
    customDomainName: S.String,
    customDomainCertificateArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCustomDomainAssociationRequest",
}) as any as S.Schema<UpdateCustomDomainAssociationRequest>;
export interface CreateEndpointAccessRequest {
  endpointName: string;
  subnetIds: string[];
  workgroupName: string;
  vpcSecurityGroupIds?: string[];
  ownerAccount?: string;
}
export const CreateEndpointAccessRequest = S.suspend(() =>
  S.Struct({
    endpointName: S.String,
    subnetIds: SubnetIdList,
    workgroupName: S.String,
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    ownerAccount: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEndpointAccessRequest",
}) as any as S.Schema<CreateEndpointAccessRequest>;
export interface DeleteEndpointAccessRequest {
  endpointName: string;
}
export const DeleteEndpointAccessRequest = S.suspend(() =>
  S.Struct({ endpointName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEndpointAccessRequest",
}) as any as S.Schema<DeleteEndpointAccessRequest>;
export interface GetEndpointAccessRequest {
  endpointName: string;
}
export const GetEndpointAccessRequest = S.suspend(() =>
  S.Struct({ endpointName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEndpointAccessRequest",
}) as any as S.Schema<GetEndpointAccessRequest>;
export interface ListEndpointAccessRequest {
  nextToken?: string;
  maxResults?: number;
  workgroupName?: string;
  vpcId?: string;
  ownerAccount?: string;
}
export const ListEndpointAccessRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    workgroupName: S.optional(S.String),
    vpcId: S.optional(S.String),
    ownerAccount: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEndpointAccessRequest",
}) as any as S.Schema<ListEndpointAccessRequest>;
export interface UpdateEndpointAccessRequest {
  endpointName: string;
  vpcSecurityGroupIds?: string[];
}
export const UpdateEndpointAccessRequest = S.suspend(() =>
  S.Struct({
    endpointName: S.String,
    vpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEndpointAccessRequest",
}) as any as S.Schema<UpdateEndpointAccessRequest>;
export interface ListManagedWorkgroupsRequest {
  sourceArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListManagedWorkgroupsRequest = S.suspend(() =>
  S.Struct({
    sourceArn: S.optional(S.String),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListManagedWorkgroupsRequest",
}) as any as S.Schema<ListManagedWorkgroupsRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateNamespaceRequest {
  namespaceName: string;
  adminUsername?: string | redacted.Redacted<string>;
  adminUserPassword?: string | redacted.Redacted<string>;
  dbName?: string;
  kmsKeyId?: string;
  defaultIamRoleArn?: string;
  iamRoles?: string[];
  logExports?: string[];
  tags?: Tag[];
  manageAdminPassword?: boolean;
  adminPasswordSecretKmsKeyId?: string;
  redshiftIdcApplicationArn?: string;
}
export const CreateNamespaceRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    adminUsername: S.optional(SensitiveString),
    adminUserPassword: S.optional(SensitiveString),
    dbName: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    defaultIamRoleArn: S.optional(S.String),
    iamRoles: S.optional(IamRoleArnList),
    logExports: S.optional(LogExportList),
    tags: S.optional(TagList),
    manageAdminPassword: S.optional(S.Boolean),
    adminPasswordSecretKmsKeyId: S.optional(S.String),
    redshiftIdcApplicationArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateNamespaceRequest",
}) as any as S.Schema<CreateNamespaceRequest>;
export interface GetNamespaceRequest {
  namespaceName: string;
}
export const GetNamespaceRequest = S.suspend(() =>
  S.Struct({ namespaceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetNamespaceRequest",
}) as any as S.Schema<GetNamespaceRequest>;
export interface UpdateNamespaceRequest {
  namespaceName: string;
  adminUserPassword?: string | redacted.Redacted<string>;
  adminUsername?: string | redacted.Redacted<string>;
  kmsKeyId?: string;
  defaultIamRoleArn?: string;
  iamRoles?: string[];
  logExports?: string[];
  manageAdminPassword?: boolean;
  adminPasswordSecretKmsKeyId?: string;
}
export const UpdateNamespaceRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    adminUserPassword: S.optional(SensitiveString),
    adminUsername: S.optional(SensitiveString),
    kmsKeyId: S.optional(S.String),
    defaultIamRoleArn: S.optional(S.String),
    iamRoles: S.optional(IamRoleArnList),
    logExports: S.optional(LogExportList),
    manageAdminPassword: S.optional(S.Boolean),
    adminPasswordSecretKmsKeyId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateNamespaceRequest",
}) as any as S.Schema<UpdateNamespaceRequest>;
export interface DeleteNamespaceRequest {
  namespaceName: string;
  finalSnapshotName?: string;
  finalSnapshotRetentionPeriod?: number;
}
export const DeleteNamespaceRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    finalSnapshotName: S.optional(S.String),
    finalSnapshotRetentionPeriod: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteNamespaceRequest",
}) as any as S.Schema<DeleteNamespaceRequest>;
export interface ListNamespacesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListNamespacesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListNamespacesRequest",
}) as any as S.Schema<ListNamespacesRequest>;
export interface UpdateLakehouseConfigurationRequest {
  namespaceName: string;
  lakehouseRegistration?: string;
  catalogName?: string;
  lakehouseIdcRegistration?: string;
  lakehouseIdcApplicationArn?: string;
  dryRun?: boolean;
}
export const UpdateLakehouseConfigurationRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    lakehouseRegistration: S.optional(S.String),
    catalogName: S.optional(S.String),
    lakehouseIdcRegistration: S.optional(S.String),
    lakehouseIdcApplicationArn: S.optional(S.String),
    dryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLakehouseConfigurationRequest",
}) as any as S.Schema<UpdateLakehouseConfigurationRequest>;
export interface ConvertRecoveryPointToSnapshotRequest {
  recoveryPointId: string;
  snapshotName: string;
  retentionPeriod?: number;
  tags?: Tag[];
}
export const ConvertRecoveryPointToSnapshotRequest = S.suspend(() =>
  S.Struct({
    recoveryPointId: S.String,
    snapshotName: S.String,
    retentionPeriod: S.optional(S.Number),
    tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ConvertRecoveryPointToSnapshotRequest",
}) as any as S.Schema<ConvertRecoveryPointToSnapshotRequest>;
export interface GetRecoveryPointRequest {
  recoveryPointId: string;
}
export const GetRecoveryPointRequest = S.suspend(() =>
  S.Struct({ recoveryPointId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRecoveryPointRequest",
}) as any as S.Schema<GetRecoveryPointRequest>;
export interface ListRecoveryPointsRequest {
  nextToken?: string;
  maxResults?: number;
  startTime?: Date;
  endTime?: Date;
  namespaceName?: string;
  namespaceArn?: string;
}
export const ListRecoveryPointsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    namespaceName: S.optional(S.String),
    namespaceArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRecoveryPointsRequest",
}) as any as S.Schema<ListRecoveryPointsRequest>;
export interface RestoreFromRecoveryPointRequest {
  recoveryPointId: string;
  namespaceName: string;
  workgroupName: string;
}
export const RestoreFromRecoveryPointRequest = S.suspend(() =>
  S.Struct({
    recoveryPointId: S.String,
    namespaceName: S.String,
    workgroupName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RestoreFromRecoveryPointRequest",
}) as any as S.Schema<RestoreFromRecoveryPointRequest>;
export interface RestoreTableFromRecoveryPointRequest {
  namespaceName: string;
  workgroupName: string;
  recoveryPointId: string;
  sourceDatabaseName: string;
  sourceSchemaName?: string;
  sourceTableName: string;
  targetDatabaseName?: string;
  targetSchemaName?: string;
  newTableName: string;
  activateCaseSensitiveIdentifier?: boolean;
}
export const RestoreTableFromRecoveryPointRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    workgroupName: S.String,
    recoveryPointId: S.String,
    sourceDatabaseName: S.String,
    sourceSchemaName: S.optional(S.String),
    sourceTableName: S.String,
    targetDatabaseName: S.optional(S.String),
    targetSchemaName: S.optional(S.String),
    newTableName: S.String,
    activateCaseSensitiveIdentifier: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RestoreTableFromRecoveryPointRequest",
}) as any as S.Schema<RestoreTableFromRecoveryPointRequest>;
export interface CreateReservationRequest {
  capacity: number;
  offeringId: string;
  clientToken?: string;
}
export const CreateReservationRequest = S.suspend(() =>
  S.Struct({
    capacity: S.Number,
    offeringId: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateReservationRequest",
}) as any as S.Schema<CreateReservationRequest>;
export interface GetReservationRequest {
  reservationId: string;
}
export const GetReservationRequest = S.suspend(() =>
  S.Struct({ reservationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetReservationRequest",
}) as any as S.Schema<GetReservationRequest>;
export interface GetReservationOfferingRequest {
  offeringId: string;
}
export const GetReservationOfferingRequest = S.suspend(() =>
  S.Struct({ offeringId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetReservationOfferingRequest",
}) as any as S.Schema<GetReservationOfferingRequest>;
export interface ListReservationOfferingsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListReservationOfferingsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListReservationOfferingsRequest",
}) as any as S.Schema<ListReservationOfferingsRequest>;
export interface ListReservationsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListReservationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListReservationsRequest",
}) as any as S.Schema<ListReservationsRequest>;
export interface DeleteScheduledActionRequest {
  scheduledActionName: string;
}
export const DeleteScheduledActionRequest = S.suspend(() =>
  S.Struct({ scheduledActionName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteScheduledActionRequest",
}) as any as S.Schema<DeleteScheduledActionRequest>;
export interface GetScheduledActionRequest {
  scheduledActionName: string;
}
export const GetScheduledActionRequest = S.suspend(() =>
  S.Struct({ scheduledActionName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetScheduledActionRequest",
}) as any as S.Schema<GetScheduledActionRequest>;
export interface ListScheduledActionsRequest {
  nextToken?: string;
  maxResults?: number;
  namespaceName?: string;
}
export const ListScheduledActionsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    namespaceName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListScheduledActionsRequest",
}) as any as S.Schema<ListScheduledActionsRequest>;
export interface CreateSnapshotScheduleActionParameters {
  namespaceName: string;
  snapshotNamePrefix: string;
  retentionPeriod?: number;
  tags?: Tag[];
}
export const CreateSnapshotScheduleActionParameters = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    snapshotNamePrefix: S.String,
    retentionPeriod: S.optional(S.Number),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "CreateSnapshotScheduleActionParameters",
}) as any as S.Schema<CreateSnapshotScheduleActionParameters>;
export type TargetAction = {
  createSnapshot: CreateSnapshotScheduleActionParameters;
};
export const TargetAction = S.Union(
  S.Struct({ createSnapshot: CreateSnapshotScheduleActionParameters }),
);
export type Schedule =
  | { at: Date; cron?: never }
  | { at?: never; cron: string };
export const Schedule = S.Union(
  S.Struct({ at: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ cron: S.String }),
);
export interface UpdateScheduledActionRequest {
  scheduledActionName: string;
  targetAction?: TargetAction;
  schedule?: Schedule;
  roleArn?: string;
  enabled?: boolean;
  scheduledActionDescription?: string;
  startTime?: Date;
  endTime?: Date;
}
export const UpdateScheduledActionRequest = S.suspend(() =>
  S.Struct({
    scheduledActionName: S.String,
    targetAction: S.optional(TargetAction),
    schedule: S.optional(Schedule),
    roleArn: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    scheduledActionDescription: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateScheduledActionRequest",
}) as any as S.Schema<UpdateScheduledActionRequest>;
export interface CreateSnapshotRequest {
  namespaceName: string;
  snapshotName: string;
  retentionPeriod?: number;
  tags?: Tag[];
}
export const CreateSnapshotRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    snapshotName: S.String,
    retentionPeriod: S.optional(S.Number),
    tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSnapshotRequest",
}) as any as S.Schema<CreateSnapshotRequest>;
export interface CreateSnapshotCopyConfigurationRequest {
  namespaceName: string;
  destinationRegion: string;
  snapshotRetentionPeriod?: number;
  destinationKmsKeyId?: string;
}
export const CreateSnapshotCopyConfigurationRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    destinationRegion: S.String,
    snapshotRetentionPeriod: S.optional(S.Number),
    destinationKmsKeyId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSnapshotCopyConfigurationRequest",
}) as any as S.Schema<CreateSnapshotCopyConfigurationRequest>;
export interface DeleteSnapshotRequest {
  snapshotName: string;
}
export const DeleteSnapshotRequest = S.suspend(() =>
  S.Struct({ snapshotName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSnapshotRequest",
}) as any as S.Schema<DeleteSnapshotRequest>;
export interface DeleteSnapshotCopyConfigurationRequest {
  snapshotCopyConfigurationId: string;
}
export const DeleteSnapshotCopyConfigurationRequest = S.suspend(() =>
  S.Struct({ snapshotCopyConfigurationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSnapshotCopyConfigurationRequest",
}) as any as S.Schema<DeleteSnapshotCopyConfigurationRequest>;
export interface GetSnapshotRequest {
  snapshotName?: string;
  ownerAccount?: string;
  snapshotArn?: string;
}
export const GetSnapshotRequest = S.suspend(() =>
  S.Struct({
    snapshotName: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    snapshotArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSnapshotRequest",
}) as any as S.Schema<GetSnapshotRequest>;
export interface GetTableRestoreStatusRequest {
  tableRestoreRequestId: string;
}
export const GetTableRestoreStatusRequest = S.suspend(() =>
  S.Struct({ tableRestoreRequestId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTableRestoreStatusRequest",
}) as any as S.Schema<GetTableRestoreStatusRequest>;
export interface ListSnapshotCopyConfigurationsRequest {
  namespaceName?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSnapshotCopyConfigurationsRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.optional(S.String),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSnapshotCopyConfigurationsRequest",
}) as any as S.Schema<ListSnapshotCopyConfigurationsRequest>;
export interface ListSnapshotsRequest {
  nextToken?: string;
  maxResults?: number;
  namespaceName?: string;
  namespaceArn?: string;
  ownerAccount?: string;
  startTime?: Date;
  endTime?: Date;
}
export const ListSnapshotsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    namespaceName: S.optional(S.String),
    namespaceArn: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSnapshotsRequest",
}) as any as S.Schema<ListSnapshotsRequest>;
export interface ListTableRestoreStatusRequest {
  nextToken?: string;
  maxResults?: number;
  namespaceName?: string;
  workgroupName?: string;
}
export const ListTableRestoreStatusRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    namespaceName: S.optional(S.String),
    workgroupName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTableRestoreStatusRequest",
}) as any as S.Schema<ListTableRestoreStatusRequest>;
export interface RestoreFromSnapshotRequest {
  namespaceName: string;
  workgroupName: string;
  snapshotName?: string;
  snapshotArn?: string;
  ownerAccount?: string;
  manageAdminPassword?: boolean;
  adminPasswordSecretKmsKeyId?: string;
}
export const RestoreFromSnapshotRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    workgroupName: S.String,
    snapshotName: S.optional(S.String),
    snapshotArn: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    manageAdminPassword: S.optional(S.Boolean),
    adminPasswordSecretKmsKeyId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RestoreFromSnapshotRequest",
}) as any as S.Schema<RestoreFromSnapshotRequest>;
export interface RestoreTableFromSnapshotRequest {
  namespaceName: string;
  workgroupName: string;
  snapshotName: string;
  sourceDatabaseName: string;
  sourceSchemaName?: string;
  sourceTableName: string;
  targetDatabaseName?: string;
  targetSchemaName?: string;
  newTableName: string;
  activateCaseSensitiveIdentifier?: boolean;
}
export const RestoreTableFromSnapshotRequest = S.suspend(() =>
  S.Struct({
    namespaceName: S.String,
    workgroupName: S.String,
    snapshotName: S.String,
    sourceDatabaseName: S.String,
    sourceSchemaName: S.optional(S.String),
    sourceTableName: S.String,
    targetDatabaseName: S.optional(S.String),
    targetSchemaName: S.optional(S.String),
    newTableName: S.String,
    activateCaseSensitiveIdentifier: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RestoreTableFromSnapshotRequest",
}) as any as S.Schema<RestoreTableFromSnapshotRequest>;
export interface UpdateSnapshotRequest {
  snapshotName: string;
  retentionPeriod?: number;
}
export const UpdateSnapshotRequest = S.suspend(() =>
  S.Struct({
    snapshotName: S.String,
    retentionPeriod: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSnapshotRequest",
}) as any as S.Schema<UpdateSnapshotRequest>;
export interface UpdateSnapshotCopyConfigurationRequest {
  snapshotCopyConfigurationId: string;
  snapshotRetentionPeriod?: number;
}
export const UpdateSnapshotCopyConfigurationRequest = S.suspend(() =>
  S.Struct({
    snapshotCopyConfigurationId: S.String,
    snapshotRetentionPeriod: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSnapshotCopyConfigurationRequest",
}) as any as S.Schema<UpdateSnapshotCopyConfigurationRequest>;
export interface CreateUsageLimitRequest {
  resourceArn: string;
  usageType: string;
  amount: number;
  period?: string;
  breachAction?: string;
}
export const CreateUsageLimitRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    usageType: S.String,
    amount: S.Number,
    period: S.optional(S.String),
    breachAction: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateUsageLimitRequest",
}) as any as S.Schema<CreateUsageLimitRequest>;
export interface DeleteUsageLimitRequest {
  usageLimitId: string;
}
export const DeleteUsageLimitRequest = S.suspend(() =>
  S.Struct({ usageLimitId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteUsageLimitRequest",
}) as any as S.Schema<DeleteUsageLimitRequest>;
export interface GetUsageLimitRequest {
  usageLimitId: string;
}
export const GetUsageLimitRequest = S.suspend(() =>
  S.Struct({ usageLimitId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetUsageLimitRequest",
}) as any as S.Schema<GetUsageLimitRequest>;
export interface ListUsageLimitsRequest {
  resourceArn?: string;
  usageType?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListUsageLimitsRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    usageType: S.optional(S.String),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListUsageLimitsRequest",
}) as any as S.Schema<ListUsageLimitsRequest>;
export interface UpdateUsageLimitRequest {
  usageLimitId: string;
  amount?: number;
  breachAction?: string;
}
export const UpdateUsageLimitRequest = S.suspend(() =>
  S.Struct({
    usageLimitId: S.String,
    amount: S.optional(S.Number),
    breachAction: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateUsageLimitRequest",
}) as any as S.Schema<UpdateUsageLimitRequest>;
export interface GetWorkgroupRequest {
  workgroupName: string;
}
export const GetWorkgroupRequest = S.suspend(() =>
  S.Struct({ workgroupName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetWorkgroupRequest",
}) as any as S.Schema<GetWorkgroupRequest>;
export interface ConfigParameter {
  parameterKey?: string;
  parameterValue?: string;
}
export const ConfigParameter = S.suspend(() =>
  S.Struct({
    parameterKey: S.optional(S.String),
    parameterValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigParameter",
}) as any as S.Schema<ConfigParameter>;
export type ConfigParameterList = ConfigParameter[];
export const ConfigParameterList = S.Array(ConfigParameter);
export interface PerformanceTarget {
  status?: string;
  level?: number;
}
export const PerformanceTarget = S.suspend(() =>
  S.Struct({ status: S.optional(S.String), level: S.optional(S.Number) }),
).annotations({
  identifier: "PerformanceTarget",
}) as any as S.Schema<PerformanceTarget>;
export interface UpdateWorkgroupRequest {
  workgroupName: string;
  baseCapacity?: number;
  enhancedVpcRouting?: boolean;
  configParameters?: ConfigParameter[];
  publiclyAccessible?: boolean;
  subnetIds?: string[];
  securityGroupIds?: string[];
  port?: number;
  maxCapacity?: number;
  ipAddressType?: string;
  pricePerformanceTarget?: PerformanceTarget;
  trackName?: string;
}
export const UpdateWorkgroupRequest = S.suspend(() =>
  S.Struct({
    workgroupName: S.String,
    baseCapacity: S.optional(S.Number),
    enhancedVpcRouting: S.optional(S.Boolean),
    configParameters: S.optional(ConfigParameterList),
    publiclyAccessible: S.optional(S.Boolean),
    subnetIds: S.optional(SubnetIdList),
    securityGroupIds: S.optional(SecurityGroupIdList),
    port: S.optional(S.Number),
    maxCapacity: S.optional(S.Number),
    ipAddressType: S.optional(S.String),
    pricePerformanceTarget: S.optional(PerformanceTarget),
    trackName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateWorkgroupRequest",
}) as any as S.Schema<UpdateWorkgroupRequest>;
export interface DeleteWorkgroupRequest {
  workgroupName: string;
}
export const DeleteWorkgroupRequest = S.suspend(() =>
  S.Struct({ workgroupName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWorkgroupRequest",
}) as any as S.Schema<DeleteWorkgroupRequest>;
export interface ListWorkgroupsRequest {
  nextToken?: string;
  maxResults?: number;
  ownerAccount?: string;
}
export const ListWorkgroupsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ownerAccount: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWorkgroupsRequest",
}) as any as S.Schema<ListWorkgroupsRequest>;
export interface UpdateTarget {
  trackName?: string;
  workgroupVersion?: string;
}
export const UpdateTarget = S.suspend(() =>
  S.Struct({
    trackName: S.optional(S.String),
    workgroupVersion: S.optional(S.String),
  }),
).annotations({ identifier: "UpdateTarget" }) as any as S.Schema<UpdateTarget>;
export type UpdateTargetsList = UpdateTarget[];
export const UpdateTargetsList = S.Array(UpdateTarget);
export interface ServerlessTrack {
  trackName?: string;
  workgroupVersion?: string;
  updateTargets?: UpdateTarget[];
}
export const ServerlessTrack = S.suspend(() =>
  S.Struct({
    trackName: S.optional(S.String),
    workgroupVersion: S.optional(S.String),
    updateTargets: S.optional(UpdateTargetsList),
  }),
).annotations({
  identifier: "ServerlessTrack",
}) as any as S.Schema<ServerlessTrack>;
export type TrackList = ServerlessTrack[];
export const TrackList = S.Array(ServerlessTrack);
export interface VpcSecurityGroupMembership {
  vpcSecurityGroupId?: string;
  status?: string;
}
export const VpcSecurityGroupMembership = S.suspend(() =>
  S.Struct({
    vpcSecurityGroupId: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcSecurityGroupMembership",
}) as any as S.Schema<VpcSecurityGroupMembership>;
export type VpcSecurityGroupMembershipList = VpcSecurityGroupMembership[];
export const VpcSecurityGroupMembershipList = S.Array(
  VpcSecurityGroupMembership,
);
export interface NetworkInterface {
  networkInterfaceId?: string;
  subnetId?: string;
  privateIpAddress?: string;
  availabilityZone?: string;
  ipv6Address?: string;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    networkInterfaceId: S.optional(S.String),
    subnetId: S.optional(S.String),
    privateIpAddress: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    ipv6Address: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaceList = NetworkInterface[];
export const NetworkInterfaceList = S.Array(NetworkInterface);
export interface VpcEndpoint {
  vpcEndpointId?: string;
  vpcId?: string;
  networkInterfaces?: NetworkInterface[];
}
export const VpcEndpoint = S.suspend(() =>
  S.Struct({
    vpcEndpointId: S.optional(S.String),
    vpcId: S.optional(S.String),
    networkInterfaces: S.optional(NetworkInterfaceList),
  }),
).annotations({ identifier: "VpcEndpoint" }) as any as S.Schema<VpcEndpoint>;
export interface EndpointAccess {
  endpointName?: string;
  endpointStatus?: string;
  workgroupName?: string;
  endpointCreateTime?: Date;
  port?: number;
  address?: string;
  subnetIds?: string[];
  vpcSecurityGroups?: VpcSecurityGroupMembership[];
  vpcEndpoint?: VpcEndpoint;
  endpointArn?: string;
}
export const EndpointAccess = S.suspend(() =>
  S.Struct({
    endpointName: S.optional(S.String),
    endpointStatus: S.optional(S.String),
    workgroupName: S.optional(S.String),
    endpointCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    port: S.optional(S.Number),
    address: S.optional(S.String),
    subnetIds: S.optional(SubnetIdList),
    vpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
    vpcEndpoint: S.optional(VpcEndpoint),
    endpointArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EndpointAccess",
}) as any as S.Schema<EndpointAccess>;
export type EndpointAccessList = EndpointAccess[];
export const EndpointAccessList = S.Array(EndpointAccess);
export interface Namespace {
  namespaceArn?: string;
  namespaceId?: string;
  namespaceName?: string;
  adminUsername?: string | redacted.Redacted<string>;
  dbName?: string;
  kmsKeyId?: string;
  defaultIamRoleArn?: string;
  iamRoles?: string[];
  logExports?: string[];
  status?: string;
  creationDate?: Date;
  adminPasswordSecretArn?: string;
  adminPasswordSecretKmsKeyId?: string;
  lakehouseRegistrationStatus?: string;
  catalogArn?: string;
}
export const Namespace = S.suspend(() =>
  S.Struct({
    namespaceArn: S.optional(S.String),
    namespaceId: S.optional(S.String),
    namespaceName: S.optional(S.String),
    adminUsername: S.optional(SensitiveString),
    dbName: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    defaultIamRoleArn: S.optional(S.String),
    iamRoles: S.optional(IamRoleArnList),
    logExports: S.optional(LogExportList),
    status: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    adminPasswordSecretArn: S.optional(S.String),
    adminPasswordSecretKmsKeyId: S.optional(S.String),
    lakehouseRegistrationStatus: S.optional(S.String),
    catalogArn: S.optional(S.String),
  }),
).annotations({ identifier: "Namespace" }) as any as S.Schema<Namespace>;
export type NamespaceList = Namespace[];
export const NamespaceList = S.Array(Namespace);
export interface RecoveryPoint {
  recoveryPointId?: string;
  recoveryPointCreateTime?: Date;
  totalSizeInMegaBytes?: number;
  namespaceName?: string;
  workgroupName?: string;
  namespaceArn?: string;
}
export const RecoveryPoint = S.suspend(() =>
  S.Struct({
    recoveryPointId: S.optional(S.String),
    recoveryPointCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    totalSizeInMegaBytes: S.optional(S.Number),
    namespaceName: S.optional(S.String),
    workgroupName: S.optional(S.String),
    namespaceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "RecoveryPoint",
}) as any as S.Schema<RecoveryPoint>;
export type RecoveryPointList = RecoveryPoint[];
export const RecoveryPointList = S.Array(RecoveryPoint);
export interface ReservationOffering {
  offeringId?: string;
  duration?: number;
  upfrontCharge?: number;
  hourlyCharge?: number;
  currencyCode?: string;
  offeringType?: string;
}
export const ReservationOffering = S.suspend(() =>
  S.Struct({
    offeringId: S.optional(S.String),
    duration: S.optional(S.Number),
    upfrontCharge: S.optional(S.Number),
    hourlyCharge: S.optional(S.Number),
    currencyCode: S.optional(S.String),
    offeringType: S.optional(S.String),
  }),
).annotations({
  identifier: "ReservationOffering",
}) as any as S.Schema<ReservationOffering>;
export type ReservationOfferingsList = ReservationOffering[];
export const ReservationOfferingsList = S.Array(ReservationOffering);
export interface Reservation {
  reservationId?: string;
  reservationArn?: string;
  startDate?: Date;
  endDate?: Date;
  capacity?: number;
  offering?: ReservationOffering;
  status?: string;
}
export const Reservation = S.suspend(() =>
  S.Struct({
    reservationId: S.optional(S.String),
    reservationArn: S.optional(S.String),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    capacity: S.optional(S.Number),
    offering: S.optional(ReservationOffering),
    status: S.optional(S.String),
  }),
).annotations({ identifier: "Reservation" }) as any as S.Schema<Reservation>;
export type ReservationsList = Reservation[];
export const ReservationsList = S.Array(Reservation);
export interface SnapshotCopyConfiguration {
  snapshotCopyConfigurationId?: string;
  snapshotCopyConfigurationArn?: string;
  namespaceName?: string;
  destinationRegion?: string;
  snapshotRetentionPeriod?: number;
  destinationKmsKeyId?: string;
}
export const SnapshotCopyConfiguration = S.suspend(() =>
  S.Struct({
    snapshotCopyConfigurationId: S.optional(S.String),
    snapshotCopyConfigurationArn: S.optional(S.String),
    namespaceName: S.optional(S.String),
    destinationRegion: S.optional(S.String),
    snapshotRetentionPeriod: S.optional(S.Number),
    destinationKmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "SnapshotCopyConfiguration",
}) as any as S.Schema<SnapshotCopyConfiguration>;
export type SnapshotCopyConfigurations = SnapshotCopyConfiguration[];
export const SnapshotCopyConfigurations = S.Array(SnapshotCopyConfiguration);
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export interface Snapshot {
  namespaceName?: string;
  namespaceArn?: string;
  snapshotName?: string;
  snapshotCreateTime?: Date;
  adminUsername?: string;
  status?: string;
  kmsKeyId?: string;
  ownerAccount?: string;
  totalBackupSizeInMegaBytes?: number;
  actualIncrementalBackupSizeInMegaBytes?: number;
  backupProgressInMegaBytes?: number;
  currentBackupRateInMegaBytesPerSecond?: number;
  estimatedSecondsToCompletion?: number;
  elapsedTimeInSeconds?: number;
  snapshotRetentionPeriod?: number;
  snapshotRemainingDays?: number;
  snapshotRetentionStartTime?: Date;
  snapshotArn?: string;
  accountsWithRestoreAccess?: string[];
  accountsWithProvisionedRestoreAccess?: string[];
  adminPasswordSecretArn?: string;
  adminPasswordSecretKmsKeyId?: string;
}
export const Snapshot = S.suspend(() =>
  S.Struct({
    namespaceName: S.optional(S.String),
    namespaceArn: S.optional(S.String),
    snapshotName: S.optional(S.String),
    snapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    adminUsername: S.optional(S.String),
    status: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    totalBackupSizeInMegaBytes: S.optional(S.Number),
    actualIncrementalBackupSizeInMegaBytes: S.optional(S.Number),
    backupProgressInMegaBytes: S.optional(S.Number),
    currentBackupRateInMegaBytesPerSecond: S.optional(S.Number),
    estimatedSecondsToCompletion: S.optional(S.Number),
    elapsedTimeInSeconds: S.optional(S.Number),
    snapshotRetentionPeriod: S.optional(S.Number),
    snapshotRemainingDays: S.optional(S.Number),
    snapshotRetentionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    snapshotArn: S.optional(S.String),
    accountsWithRestoreAccess: S.optional(AccountIdList),
    accountsWithProvisionedRestoreAccess: S.optional(AccountIdList),
    adminPasswordSecretArn: S.optional(S.String),
    adminPasswordSecretKmsKeyId: S.optional(S.String),
  }),
).annotations({ identifier: "Snapshot" }) as any as S.Schema<Snapshot>;
export type SnapshotList = Snapshot[];
export const SnapshotList = S.Array(Snapshot);
export interface TableRestoreStatus {
  tableRestoreRequestId?: string;
  status?: string;
  message?: string;
  requestTime?: Date;
  namespaceName?: string;
  workgroupName?: string;
  snapshotName?: string;
  progressInMegaBytes?: number;
  totalDataInMegaBytes?: number;
  sourceDatabaseName?: string;
  sourceSchemaName?: string;
  sourceTableName?: string;
  targetDatabaseName?: string;
  targetSchemaName?: string;
  newTableName?: string;
  recoveryPointId?: string;
}
export const TableRestoreStatus = S.suspend(() =>
  S.Struct({
    tableRestoreRequestId: S.optional(S.String),
    status: S.optional(S.String),
    message: S.optional(S.String),
    requestTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    namespaceName: S.optional(S.String),
    workgroupName: S.optional(S.String),
    snapshotName: S.optional(S.String),
    progressInMegaBytes: S.optional(S.Number),
    totalDataInMegaBytes: S.optional(S.Number),
    sourceDatabaseName: S.optional(S.String),
    sourceSchemaName: S.optional(S.String),
    sourceTableName: S.optional(S.String),
    targetDatabaseName: S.optional(S.String),
    targetSchemaName: S.optional(S.String),
    newTableName: S.optional(S.String),
    recoveryPointId: S.optional(S.String),
  }),
).annotations({
  identifier: "TableRestoreStatus",
}) as any as S.Schema<TableRestoreStatus>;
export type TableRestoreStatusList = TableRestoreStatus[];
export const TableRestoreStatusList = S.Array(TableRestoreStatus);
export interface UsageLimit {
  usageLimitId?: string;
  usageLimitArn?: string;
  resourceArn?: string;
  usageType?: string;
  amount?: number;
  period?: string;
  breachAction?: string;
}
export const UsageLimit = S.suspend(() =>
  S.Struct({
    usageLimitId: S.optional(S.String),
    usageLimitArn: S.optional(S.String),
    resourceArn: S.optional(S.String),
    usageType: S.optional(S.String),
    amount: S.optional(S.Number),
    period: S.optional(S.String),
    breachAction: S.optional(S.String),
  }),
).annotations({ identifier: "UsageLimit" }) as any as S.Schema<UsageLimit>;
export type UsageLimits = UsageLimit[];
export const UsageLimits = S.Array(UsageLimit);
export type VpcEndpointList = VpcEndpoint[];
export const VpcEndpointList = S.Array(VpcEndpoint);
export interface Endpoint {
  address?: string;
  port?: number;
  vpcEndpoints?: VpcEndpoint[];
}
export const Endpoint = S.suspend(() =>
  S.Struct({
    address: S.optional(S.String),
    port: S.optional(S.Number),
    vpcEndpoints: S.optional(VpcEndpointList),
  }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export type VpcIds = string[];
export const VpcIds = S.Array(S.String);
export interface Workgroup {
  workgroupId?: string;
  workgroupArn?: string;
  workgroupName?: string;
  namespaceName?: string;
  baseCapacity?: number;
  enhancedVpcRouting?: boolean;
  configParameters?: ConfigParameter[];
  securityGroupIds?: string[];
  subnetIds?: string[];
  status?: string;
  endpoint?: Endpoint;
  publiclyAccessible?: boolean;
  creationDate?: Date;
  port?: number;
  customDomainName?: string;
  customDomainCertificateArn?: string;
  customDomainCertificateExpiryTime?: Date;
  workgroupVersion?: string;
  patchVersion?: string;
  maxCapacity?: number;
  crossAccountVpcs?: string[];
  ipAddressType?: string;
  pricePerformanceTarget?: PerformanceTarget;
  trackName?: string;
  pendingTrackName?: string;
}
export const Workgroup = S.suspend(() =>
  S.Struct({
    workgroupId: S.optional(S.String),
    workgroupArn: S.optional(S.String),
    workgroupName: S.optional(S.String),
    namespaceName: S.optional(S.String),
    baseCapacity: S.optional(S.Number),
    enhancedVpcRouting: S.optional(S.Boolean),
    configParameters: S.optional(ConfigParameterList),
    securityGroupIds: S.optional(SecurityGroupIdList),
    subnetIds: S.optional(SubnetIdList),
    status: S.optional(S.String),
    endpoint: S.optional(Endpoint),
    publiclyAccessible: S.optional(S.Boolean),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    port: S.optional(S.Number),
    customDomainName: S.optional(S.String),
    customDomainCertificateArn: S.optional(S.String),
    customDomainCertificateExpiryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    workgroupVersion: S.optional(S.String),
    patchVersion: S.optional(S.String),
    maxCapacity: S.optional(S.Number),
    crossAccountVpcs: S.optional(VpcIds),
    ipAddressType: S.optional(S.String),
    pricePerformanceTarget: S.optional(PerformanceTarget),
    trackName: S.optional(S.String),
    pendingTrackName: S.optional(S.String),
  }),
).annotations({ identifier: "Workgroup" }) as any as S.Schema<Workgroup>;
export type WorkgroupList = Workgroup[];
export const WorkgroupList = S.Array(Workgroup);
export interface CreateCustomDomainAssociationResponse {
  customDomainName?: string;
  workgroupName?: string;
  customDomainCertificateArn?: string;
  customDomainCertificateExpiryTime?: Date;
}
export const CreateCustomDomainAssociationResponse = S.suspend(() =>
  S.Struct({
    customDomainName: S.optional(S.String),
    workgroupName: S.optional(S.String),
    customDomainCertificateArn: S.optional(S.String),
    customDomainCertificateExpiryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "CreateCustomDomainAssociationResponse",
}) as any as S.Schema<CreateCustomDomainAssociationResponse>;
export interface GetCredentialsResponse {
  dbUser?: string | redacted.Redacted<string>;
  dbPassword?: string | redacted.Redacted<string>;
  expiration?: Date;
  nextRefreshTime?: Date;
}
export const GetCredentialsResponse = S.suspend(() =>
  S.Struct({
    dbUser: S.optional(SensitiveString),
    dbPassword: S.optional(SensitiveString),
    expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    nextRefreshTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetCredentialsResponse",
}) as any as S.Schema<GetCredentialsResponse>;
export interface GetCustomDomainAssociationResponse {
  customDomainName?: string;
  workgroupName?: string;
  customDomainCertificateArn?: string;
  customDomainCertificateExpiryTime?: Date;
}
export const GetCustomDomainAssociationResponse = S.suspend(() =>
  S.Struct({
    customDomainName: S.optional(S.String),
    workgroupName: S.optional(S.String),
    customDomainCertificateArn: S.optional(S.String),
    customDomainCertificateExpiryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "GetCustomDomainAssociationResponse",
}) as any as S.Schema<GetCustomDomainAssociationResponse>;
export interface GetIdentityCenterAuthTokenResponse {
  token?: string;
  expirationTime?: Date;
}
export const GetIdentityCenterAuthTokenResponse = S.suspend(() =>
  S.Struct({
    token: S.optional(S.String).pipe(T.JsonName("Token")),
    expirationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("ExpirationTime")),
  }),
).annotations({
  identifier: "GetIdentityCenterAuthTokenResponse",
}) as any as S.Schema<GetIdentityCenterAuthTokenResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTracksResponse {
  tracks?: ServerlessTrack[];
  nextToken?: string;
}
export const ListTracksResponse = S.suspend(() =>
  S.Struct({ tracks: S.optional(TrackList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTracksResponse",
}) as any as S.Schema<ListTracksResponse>;
export interface ResourcePolicy {
  resourceArn?: string;
  policy?: string;
}
export const ResourcePolicy = S.suspend(() =>
  S.Struct({ resourceArn: S.optional(S.String), policy: S.optional(S.String) }),
).annotations({
  identifier: "ResourcePolicy",
}) as any as S.Schema<ResourcePolicy>;
export interface PutResourcePolicyResponse {
  resourcePolicy?: ResourcePolicy;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({ resourcePolicy: S.optional(ResourcePolicy) }),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UpdateCustomDomainAssociationResponse {
  customDomainName?: string;
  workgroupName?: string;
  customDomainCertificateArn?: string;
  customDomainCertificateExpiryTime?: Date;
}
export const UpdateCustomDomainAssociationResponse = S.suspend(() =>
  S.Struct({
    customDomainName: S.optional(S.String),
    workgroupName: S.optional(S.String),
    customDomainCertificateArn: S.optional(S.String),
    customDomainCertificateExpiryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "UpdateCustomDomainAssociationResponse",
}) as any as S.Schema<UpdateCustomDomainAssociationResponse>;
export interface DeleteEndpointAccessResponse {
  endpoint?: EndpointAccess;
}
export const DeleteEndpointAccessResponse = S.suspend(() =>
  S.Struct({ endpoint: S.optional(EndpointAccess) }),
).annotations({
  identifier: "DeleteEndpointAccessResponse",
}) as any as S.Schema<DeleteEndpointAccessResponse>;
export interface GetEndpointAccessResponse {
  endpoint?: EndpointAccess;
}
export const GetEndpointAccessResponse = S.suspend(() =>
  S.Struct({ endpoint: S.optional(EndpointAccess) }),
).annotations({
  identifier: "GetEndpointAccessResponse",
}) as any as S.Schema<GetEndpointAccessResponse>;
export interface ListEndpointAccessResponse {
  nextToken?: string;
  endpoints: EndpointAccess[];
}
export const ListEndpointAccessResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), endpoints: EndpointAccessList }),
).annotations({
  identifier: "ListEndpointAccessResponse",
}) as any as S.Schema<ListEndpointAccessResponse>;
export interface UpdateEndpointAccessResponse {
  endpoint?: EndpointAccess;
}
export const UpdateEndpointAccessResponse = S.suspend(() =>
  S.Struct({ endpoint: S.optional(EndpointAccess) }),
).annotations({
  identifier: "UpdateEndpointAccessResponse",
}) as any as S.Schema<UpdateEndpointAccessResponse>;
export interface GetNamespaceResponse {
  namespace: Namespace;
}
export const GetNamespaceResponse = S.suspend(() =>
  S.Struct({ namespace: Namespace }),
).annotations({
  identifier: "GetNamespaceResponse",
}) as any as S.Schema<GetNamespaceResponse>;
export interface UpdateNamespaceResponse {
  namespace: Namespace;
}
export const UpdateNamespaceResponse = S.suspend(() =>
  S.Struct({ namespace: Namespace }),
).annotations({
  identifier: "UpdateNamespaceResponse",
}) as any as S.Schema<UpdateNamespaceResponse>;
export interface DeleteNamespaceResponse {
  namespace: Namespace;
}
export const DeleteNamespaceResponse = S.suspend(() =>
  S.Struct({ namespace: Namespace }),
).annotations({
  identifier: "DeleteNamespaceResponse",
}) as any as S.Schema<DeleteNamespaceResponse>;
export interface ListNamespacesResponse {
  nextToken?: string;
  namespaces: Namespace[];
}
export const ListNamespacesResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), namespaces: NamespaceList }),
).annotations({
  identifier: "ListNamespacesResponse",
}) as any as S.Schema<ListNamespacesResponse>;
export interface UpdateLakehouseConfigurationResponse {
  namespaceName?: string;
  lakehouseIdcApplicationArn?: string;
  lakehouseRegistrationStatus?: string;
  catalogArn?: string;
}
export const UpdateLakehouseConfigurationResponse = S.suspend(() =>
  S.Struct({
    namespaceName: S.optional(S.String),
    lakehouseIdcApplicationArn: S.optional(S.String),
    lakehouseRegistrationStatus: S.optional(S.String),
    catalogArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateLakehouseConfigurationResponse",
}) as any as S.Schema<UpdateLakehouseConfigurationResponse>;
export interface ListRecoveryPointsResponse {
  recoveryPoints?: RecoveryPoint[];
  nextToken?: string;
}
export const ListRecoveryPointsResponse = S.suspend(() =>
  S.Struct({
    recoveryPoints: S.optional(RecoveryPointList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecoveryPointsResponse",
}) as any as S.Schema<ListRecoveryPointsResponse>;
export interface RestoreFromRecoveryPointResponse {
  recoveryPointId?: string;
  namespace?: Namespace;
}
export const RestoreFromRecoveryPointResponse = S.suspend(() =>
  S.Struct({
    recoveryPointId: S.optional(S.String),
    namespace: S.optional(Namespace),
  }),
).annotations({
  identifier: "RestoreFromRecoveryPointResponse",
}) as any as S.Schema<RestoreFromRecoveryPointResponse>;
export interface GetReservationResponse {
  reservation: Reservation;
}
export const GetReservationResponse = S.suspend(() =>
  S.Struct({ reservation: Reservation }),
).annotations({
  identifier: "GetReservationResponse",
}) as any as S.Schema<GetReservationResponse>;
export interface ListReservationOfferingsResponse {
  reservationOfferingsList: ReservationOffering[];
  nextToken?: string;
}
export const ListReservationOfferingsResponse = S.suspend(() =>
  S.Struct({
    reservationOfferingsList: ReservationOfferingsList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReservationOfferingsResponse",
}) as any as S.Schema<ListReservationOfferingsResponse>;
export interface ListReservationsResponse {
  reservationsList: Reservation[];
  nextToken?: string;
}
export const ListReservationsResponse = S.suspend(() =>
  S.Struct({
    reservationsList: ReservationsList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReservationsResponse",
}) as any as S.Schema<ListReservationsResponse>;
export type NextInvocationsList = Date[];
export const NextInvocationsList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export interface ScheduledActionResponse {
  scheduledActionName?: string;
  schedule?: Schedule;
  scheduledActionDescription?: string;
  nextInvocations?: Date[];
  roleArn?: string;
  state?: string;
  startTime?: Date;
  endTime?: Date;
  targetAction?: TargetAction;
  namespaceName?: string;
  scheduledActionUuid?: string;
}
export const ScheduledActionResponse = S.suspend(() =>
  S.Struct({
    scheduledActionName: S.optional(S.String),
    schedule: S.optional(Schedule),
    scheduledActionDescription: S.optional(S.String),
    nextInvocations: S.optional(NextInvocationsList),
    roleArn: S.optional(S.String),
    state: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    targetAction: S.optional(TargetAction),
    namespaceName: S.optional(S.String),
    scheduledActionUuid: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduledActionResponse",
}) as any as S.Schema<ScheduledActionResponse>;
export interface GetScheduledActionResponse {
  scheduledAction?: ScheduledActionResponse;
}
export const GetScheduledActionResponse = S.suspend(() =>
  S.Struct({ scheduledAction: S.optional(ScheduledActionResponse) }),
).annotations({
  identifier: "GetScheduledActionResponse",
}) as any as S.Schema<GetScheduledActionResponse>;
export interface UpdateScheduledActionResponse {
  scheduledAction?: ScheduledActionResponse;
}
export const UpdateScheduledActionResponse = S.suspend(() =>
  S.Struct({ scheduledAction: S.optional(ScheduledActionResponse) }),
).annotations({
  identifier: "UpdateScheduledActionResponse",
}) as any as S.Schema<UpdateScheduledActionResponse>;
export interface CreateSnapshotResponse {
  snapshot?: Snapshot;
}
export const CreateSnapshotResponse = S.suspend(() =>
  S.Struct({ snapshot: S.optional(Snapshot) }),
).annotations({
  identifier: "CreateSnapshotResponse",
}) as any as S.Schema<CreateSnapshotResponse>;
export interface DeleteSnapshotResponse {
  snapshot?: Snapshot;
}
export const DeleteSnapshotResponse = S.suspend(() =>
  S.Struct({ snapshot: S.optional(Snapshot) }),
).annotations({
  identifier: "DeleteSnapshotResponse",
}) as any as S.Schema<DeleteSnapshotResponse>;
export interface DeleteSnapshotCopyConfigurationResponse {
  snapshotCopyConfiguration: SnapshotCopyConfiguration;
}
export const DeleteSnapshotCopyConfigurationResponse = S.suspend(() =>
  S.Struct({ snapshotCopyConfiguration: SnapshotCopyConfiguration }),
).annotations({
  identifier: "DeleteSnapshotCopyConfigurationResponse",
}) as any as S.Schema<DeleteSnapshotCopyConfigurationResponse>;
export interface GetSnapshotResponse {
  snapshot?: Snapshot;
}
export const GetSnapshotResponse = S.suspend(() =>
  S.Struct({ snapshot: S.optional(Snapshot) }),
).annotations({
  identifier: "GetSnapshotResponse",
}) as any as S.Schema<GetSnapshotResponse>;
export interface GetTableRestoreStatusResponse {
  tableRestoreStatus?: TableRestoreStatus;
}
export const GetTableRestoreStatusResponse = S.suspend(() =>
  S.Struct({ tableRestoreStatus: S.optional(TableRestoreStatus) }),
).annotations({
  identifier: "GetTableRestoreStatusResponse",
}) as any as S.Schema<GetTableRestoreStatusResponse>;
export interface ListSnapshotCopyConfigurationsResponse {
  nextToken?: string;
  snapshotCopyConfigurations: SnapshotCopyConfiguration[];
}
export const ListSnapshotCopyConfigurationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    snapshotCopyConfigurations: SnapshotCopyConfigurations,
  }),
).annotations({
  identifier: "ListSnapshotCopyConfigurationsResponse",
}) as any as S.Schema<ListSnapshotCopyConfigurationsResponse>;
export interface ListSnapshotsResponse {
  nextToken?: string;
  snapshots?: Snapshot[];
}
export const ListSnapshotsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    snapshots: S.optional(SnapshotList),
  }),
).annotations({
  identifier: "ListSnapshotsResponse",
}) as any as S.Schema<ListSnapshotsResponse>;
export interface ListTableRestoreStatusResponse {
  nextToken?: string;
  tableRestoreStatuses?: TableRestoreStatus[];
}
export const ListTableRestoreStatusResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    tableRestoreStatuses: S.optional(TableRestoreStatusList),
  }),
).annotations({
  identifier: "ListTableRestoreStatusResponse",
}) as any as S.Schema<ListTableRestoreStatusResponse>;
export interface RestoreFromSnapshotResponse {
  snapshotName?: string;
  ownerAccount?: string;
  namespace?: Namespace;
}
export const RestoreFromSnapshotResponse = S.suspend(() =>
  S.Struct({
    snapshotName: S.optional(S.String),
    ownerAccount: S.optional(S.String),
    namespace: S.optional(Namespace),
  }),
).annotations({
  identifier: "RestoreFromSnapshotResponse",
}) as any as S.Schema<RestoreFromSnapshotResponse>;
export interface RestoreTableFromSnapshotResponse {
  tableRestoreStatus?: TableRestoreStatus;
}
export const RestoreTableFromSnapshotResponse = S.suspend(() =>
  S.Struct({ tableRestoreStatus: S.optional(TableRestoreStatus) }),
).annotations({
  identifier: "RestoreTableFromSnapshotResponse",
}) as any as S.Schema<RestoreTableFromSnapshotResponse>;
export interface UpdateSnapshotResponse {
  snapshot?: Snapshot;
}
export const UpdateSnapshotResponse = S.suspend(() =>
  S.Struct({ snapshot: S.optional(Snapshot) }),
).annotations({
  identifier: "UpdateSnapshotResponse",
}) as any as S.Schema<UpdateSnapshotResponse>;
export interface UpdateSnapshotCopyConfigurationResponse {
  snapshotCopyConfiguration: SnapshotCopyConfiguration;
}
export const UpdateSnapshotCopyConfigurationResponse = S.suspend(() =>
  S.Struct({ snapshotCopyConfiguration: SnapshotCopyConfiguration }),
).annotations({
  identifier: "UpdateSnapshotCopyConfigurationResponse",
}) as any as S.Schema<UpdateSnapshotCopyConfigurationResponse>;
export interface DeleteUsageLimitResponse {
  usageLimit?: UsageLimit;
}
export const DeleteUsageLimitResponse = S.suspend(() =>
  S.Struct({ usageLimit: S.optional(UsageLimit) }),
).annotations({
  identifier: "DeleteUsageLimitResponse",
}) as any as S.Schema<DeleteUsageLimitResponse>;
export interface GetUsageLimitResponse {
  usageLimit?: UsageLimit;
}
export const GetUsageLimitResponse = S.suspend(() =>
  S.Struct({ usageLimit: S.optional(UsageLimit) }),
).annotations({
  identifier: "GetUsageLimitResponse",
}) as any as S.Schema<GetUsageLimitResponse>;
export interface ListUsageLimitsResponse {
  usageLimits?: UsageLimit[];
  nextToken?: string;
}
export const ListUsageLimitsResponse = S.suspend(() =>
  S.Struct({
    usageLimits: S.optional(UsageLimits),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUsageLimitsResponse",
}) as any as S.Schema<ListUsageLimitsResponse>;
export interface UpdateUsageLimitResponse {
  usageLimit?: UsageLimit;
}
export const UpdateUsageLimitResponse = S.suspend(() =>
  S.Struct({ usageLimit: S.optional(UsageLimit) }),
).annotations({
  identifier: "UpdateUsageLimitResponse",
}) as any as S.Schema<UpdateUsageLimitResponse>;
export interface CreateWorkgroupRequest {
  workgroupName: string;
  namespaceName: string;
  baseCapacity?: number;
  enhancedVpcRouting?: boolean;
  configParameters?: ConfigParameter[];
  securityGroupIds?: string[];
  subnetIds?: string[];
  publiclyAccessible?: boolean;
  tags?: Tag[];
  port?: number;
  maxCapacity?: number;
  pricePerformanceTarget?: PerformanceTarget;
  ipAddressType?: string;
  trackName?: string;
}
export const CreateWorkgroupRequest = S.suspend(() =>
  S.Struct({
    workgroupName: S.String,
    namespaceName: S.String,
    baseCapacity: S.optional(S.Number),
    enhancedVpcRouting: S.optional(S.Boolean),
    configParameters: S.optional(ConfigParameterList),
    securityGroupIds: S.optional(SecurityGroupIdList),
    subnetIds: S.optional(SubnetIdList),
    publiclyAccessible: S.optional(S.Boolean),
    tags: S.optional(TagList),
    port: S.optional(S.Number),
    maxCapacity: S.optional(S.Number),
    pricePerformanceTarget: S.optional(PerformanceTarget),
    ipAddressType: S.optional(S.String),
    trackName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWorkgroupRequest",
}) as any as S.Schema<CreateWorkgroupRequest>;
export interface UpdateWorkgroupResponse {
  workgroup: Workgroup;
}
export const UpdateWorkgroupResponse = S.suspend(() =>
  S.Struct({ workgroup: Workgroup }),
).annotations({
  identifier: "UpdateWorkgroupResponse",
}) as any as S.Schema<UpdateWorkgroupResponse>;
export interface DeleteWorkgroupResponse {
  workgroup: Workgroup;
}
export const DeleteWorkgroupResponse = S.suspend(() =>
  S.Struct({ workgroup: Workgroup }),
).annotations({
  identifier: "DeleteWorkgroupResponse",
}) as any as S.Schema<DeleteWorkgroupResponse>;
export interface ListWorkgroupsResponse {
  nextToken?: string;
  workgroups: Workgroup[];
}
export const ListWorkgroupsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), workgroups: WorkgroupList }),
).annotations({
  identifier: "ListWorkgroupsResponse",
}) as any as S.Schema<ListWorkgroupsResponse>;
export type ManagedWorkgroupStatus =
  | "CREATING"
  | "DELETING"
  | "MODIFYING"
  | "AVAILABLE"
  | "NOT_AVAILABLE"
  | (string & {});
export const ManagedWorkgroupStatus = S.String;
export interface Association {
  customDomainCertificateArn?: string;
  customDomainCertificateExpiryTime?: Date;
  customDomainName?: string;
  workgroupName?: string;
}
export const Association = S.suspend(() =>
  S.Struct({
    customDomainCertificateArn: S.optional(S.String),
    customDomainCertificateExpiryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    customDomainName: S.optional(S.String),
    workgroupName: S.optional(S.String),
  }),
).annotations({ identifier: "Association" }) as any as S.Schema<Association>;
export type AssociationList = Association[];
export const AssociationList = S.Array(Association);
export interface ManagedWorkgroupListItem {
  managedWorkgroupName?: string;
  managedWorkgroupId?: string;
  sourceArn?: string;
  status?: ManagedWorkgroupStatus;
  creationDate?: Date;
}
export const ManagedWorkgroupListItem = S.suspend(() =>
  S.Struct({
    managedWorkgroupName: S.optional(S.String),
    managedWorkgroupId: S.optional(S.String),
    sourceArn: S.optional(S.String),
    status: S.optional(ManagedWorkgroupStatus),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ManagedWorkgroupListItem",
}) as any as S.Schema<ManagedWorkgroupListItem>;
export type ManagedWorkgroups = ManagedWorkgroupListItem[];
export const ManagedWorkgroups = S.Array(ManagedWorkgroupListItem);
export interface ScheduledActionAssociation {
  namespaceName?: string;
  scheduledActionName?: string;
}
export const ScheduledActionAssociation = S.suspend(() =>
  S.Struct({
    namespaceName: S.optional(S.String),
    scheduledActionName: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduledActionAssociation",
}) as any as S.Schema<ScheduledActionAssociation>;
export type ScheduledActionsList = ScheduledActionAssociation[];
export const ScheduledActionsList = S.Array(ScheduledActionAssociation);
export interface GetResourcePolicyResponse {
  resourcePolicy?: ResourcePolicy;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({ resourcePolicy: S.optional(ResourcePolicy) }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface ListCustomDomainAssociationsResponse {
  nextToken?: string;
  associations?: Association[];
}
export const ListCustomDomainAssociationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    associations: S.optional(AssociationList),
  }),
).annotations({
  identifier: "ListCustomDomainAssociationsResponse",
}) as any as S.Schema<ListCustomDomainAssociationsResponse>;
export interface ListManagedWorkgroupsResponse {
  nextToken?: string;
  managedWorkgroups?: ManagedWorkgroupListItem[];
}
export const ListManagedWorkgroupsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    managedWorkgroups: S.optional(ManagedWorkgroups),
  }),
).annotations({
  identifier: "ListManagedWorkgroupsResponse",
}) as any as S.Schema<ListManagedWorkgroupsResponse>;
export interface CreateNamespaceResponse {
  namespace?: Namespace;
}
export const CreateNamespaceResponse = S.suspend(() =>
  S.Struct({ namespace: S.optional(Namespace) }),
).annotations({
  identifier: "CreateNamespaceResponse",
}) as any as S.Schema<CreateNamespaceResponse>;
export interface ConvertRecoveryPointToSnapshotResponse {
  snapshot?: Snapshot;
}
export const ConvertRecoveryPointToSnapshotResponse = S.suspend(() =>
  S.Struct({ snapshot: S.optional(Snapshot) }),
).annotations({
  identifier: "ConvertRecoveryPointToSnapshotResponse",
}) as any as S.Schema<ConvertRecoveryPointToSnapshotResponse>;
export interface GetRecoveryPointResponse {
  recoveryPoint?: RecoveryPoint;
}
export const GetRecoveryPointResponse = S.suspend(() =>
  S.Struct({ recoveryPoint: S.optional(RecoveryPoint) }),
).annotations({
  identifier: "GetRecoveryPointResponse",
}) as any as S.Schema<GetRecoveryPointResponse>;
export interface RestoreTableFromRecoveryPointResponse {
  tableRestoreStatus?: TableRestoreStatus;
}
export const RestoreTableFromRecoveryPointResponse = S.suspend(() =>
  S.Struct({ tableRestoreStatus: S.optional(TableRestoreStatus) }),
).annotations({
  identifier: "RestoreTableFromRecoveryPointResponse",
}) as any as S.Schema<RestoreTableFromRecoveryPointResponse>;
export interface CreateReservationResponse {
  reservation?: Reservation;
}
export const CreateReservationResponse = S.suspend(() =>
  S.Struct({ reservation: S.optional(Reservation) }),
).annotations({
  identifier: "CreateReservationResponse",
}) as any as S.Schema<CreateReservationResponse>;
export interface GetReservationOfferingResponse {
  reservationOffering: ReservationOffering;
}
export const GetReservationOfferingResponse = S.suspend(() =>
  S.Struct({ reservationOffering: ReservationOffering }),
).annotations({
  identifier: "GetReservationOfferingResponse",
}) as any as S.Schema<GetReservationOfferingResponse>;
export interface CreateScheduledActionRequest {
  scheduledActionName: string;
  targetAction: TargetAction;
  schedule: Schedule;
  roleArn: string;
  namespaceName: string;
  enabled?: boolean;
  scheduledActionDescription?: string;
  startTime?: Date;
  endTime?: Date;
}
export const CreateScheduledActionRequest = S.suspend(() =>
  S.Struct({
    scheduledActionName: S.String,
    targetAction: TargetAction,
    schedule: Schedule,
    roleArn: S.String,
    namespaceName: S.String,
    enabled: S.optional(S.Boolean),
    scheduledActionDescription: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateScheduledActionRequest",
}) as any as S.Schema<CreateScheduledActionRequest>;
export interface DeleteScheduledActionResponse {
  scheduledAction?: ScheduledActionResponse;
}
export const DeleteScheduledActionResponse = S.suspend(() =>
  S.Struct({ scheduledAction: S.optional(ScheduledActionResponse) }),
).annotations({
  identifier: "DeleteScheduledActionResponse",
}) as any as S.Schema<DeleteScheduledActionResponse>;
export interface ListScheduledActionsResponse {
  nextToken?: string;
  scheduledActions?: ScheduledActionAssociation[];
}
export const ListScheduledActionsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    scheduledActions: S.optional(ScheduledActionsList),
  }),
).annotations({
  identifier: "ListScheduledActionsResponse",
}) as any as S.Schema<ListScheduledActionsResponse>;
export interface CreateSnapshotCopyConfigurationResponse {
  snapshotCopyConfiguration: SnapshotCopyConfiguration;
}
export const CreateSnapshotCopyConfigurationResponse = S.suspend(() =>
  S.Struct({ snapshotCopyConfiguration: SnapshotCopyConfiguration }),
).annotations({
  identifier: "CreateSnapshotCopyConfigurationResponse",
}) as any as S.Schema<CreateSnapshotCopyConfigurationResponse>;
export interface CreateUsageLimitResponse {
  usageLimit?: UsageLimit;
}
export const CreateUsageLimitResponse = S.suspend(() =>
  S.Struct({ usageLimit: S.optional(UsageLimit) }),
).annotations({
  identifier: "CreateUsageLimitResponse",
}) as any as S.Schema<CreateUsageLimitResponse>;
export interface CreateWorkgroupResponse {
  workgroup?: Workgroup;
}
export const CreateWorkgroupResponse = S.suspend(() =>
  S.Struct({ workgroup: S.optional(Workgroup) }),
).annotations({
  identifier: "CreateWorkgroupResponse",
}) as any as S.Schema<CreateWorkgroupResponse>;
export interface GetTrackResponse {
  track?: ServerlessTrack;
}
export const GetTrackResponse = S.suspend(() =>
  S.Struct({ track: S.optional(ServerlessTrack) }),
).annotations({
  identifier: "GetTrackResponse",
}) as any as S.Schema<GetTrackResponse>;
export interface CreateScheduledActionResponse {
  scheduledAction?: ScheduledActionResponse;
}
export const CreateScheduledActionResponse = S.suspend(() =>
  S.Struct({ scheduledAction: S.optional(ScheduledActionResponse) }),
).annotations({
  identifier: "CreateScheduledActionResponse",
}) as any as S.Schema<CreateScheduledActionResponse>;
export interface GetWorkgroupResponse {
  workgroup: Workgroup;
}
export const GetWorkgroupResponse = S.suspend(() =>
  S.Struct({ workgroup: Workgroup }),
).annotations({
  identifier: "GetWorkgroupResponse",
}) as any as S.Schema<GetWorkgroupResponse>;
export interface CreateEndpointAccessResponse {
  endpoint?: EndpointAccess;
}
export const CreateEndpointAccessResponse = S.suspend(() =>
  S.Struct({ endpoint: S.optional(EndpointAccess) }),
).annotations({
  identifier: "CreateEndpointAccessResponse",
}) as any as S.Schema<CreateEndpointAccessResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { code: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidPaginationException extends S.TaggedError<InvalidPaginationException>()(
  "InvalidPaginationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { code: S.optional(S.String), message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class InsufficientCapacityException extends S.TaggedError<InsufficientCapacityException>()(
  "InsufficientCapacityException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withBadRequestError, C.withRetryableError) {}
export class DryRunException extends S.TaggedError<DryRunException>()(
  "DryRunException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class Ipv6CidrBlockNotFoundException extends S.TaggedError<Ipv6CidrBlockNotFoundException>()(
  "Ipv6CidrBlockNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns information about a list of specified managed workgroups in your account.
 */
export const listManagedWorkgroups: {
  (
    input: ListManagedWorkgroupsRequest,
  ): effect.Effect<
    ListManagedWorkgroupsResponse,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedWorkgroupsRequest,
  ) => stream.Stream<
    ListManagedWorkgroupsResponse,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedWorkgroupsRequest,
  ) => stream.Stream<
    ManagedWorkgroupListItem,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListManagedWorkgroupsRequest,
  output: ListManagedWorkgroupsResponse,
  errors: [AccessDeniedException, InternalServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "managedWorkgroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a list of specified namespaces.
 */
export const listNamespaces: {
  (
    input: ListNamespacesRequest,
  ): effect.Effect<
    ListNamespacesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNamespacesRequest,
  ) => stream.Stream<
    ListNamespacesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNamespacesRequest,
  ) => stream.Stream<
    Namespace,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNamespacesRequest,
  output: ListNamespacesResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "namespaces",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a recovery point.
 */
export const getRecoveryPoint: (
  input: GetRecoveryPointRequest,
) => effect.Effect<
  GetRecoveryPointResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecoveryPointRequest,
  output: GetRecoveryPointResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Restores a table from a recovery point to your Amazon Redshift Serverless instance. You can't use this operation to restore tables with interleaved sort keys.
 */
export const restoreTableFromRecoveryPoint: (
  input: RestoreTableFromRecoveryPointRequest,
) => effect.Effect<
  RestoreTableFromRecoveryPointResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreTableFromRecoveryPointRequest,
  output: RestoreTableFromRecoveryPointResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the current reservation offerings in your account.
 */
export const listReservationOfferings: {
  (
    input: ListReservationOfferingsRequest,
  ): effect.Effect<
    ListReservationOfferingsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReservationOfferingsRequest,
  ) => stream.Stream<
    ListReservationOfferingsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReservationOfferingsRequest,
  ) => stream.Stream<
    ReservationOffering,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReservationOfferingsRequest,
  output: ListReservationOfferingsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "reservationOfferingsList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes a scheduled action.
 */
export const deleteScheduledAction: (
  input: DeleteScheduledActionRequest,
) => effect.Effect<
  DeleteScheduledActionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduledActionRequest,
  output: DeleteScheduledActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of scheduled actions. You can use the flags to filter the list of returned scheduled actions.
 */
export const listScheduledActions: {
  (
    input: ListScheduledActionsRequest,
  ): effect.Effect<
    ListScheduledActionsResponse,
    | InternalServerException
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListScheduledActionsRequest,
  ) => stream.Stream<
    ListScheduledActionsResponse,
    | InternalServerException
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListScheduledActionsRequest,
  ) => stream.Stream<
    ScheduledActionAssociation,
    | InternalServerException
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListScheduledActionsRequest,
  output: ListScheduledActionsResponse,
  errors: [
    InternalServerException,
    InvalidPaginationException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "scheduledActions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about a specific custom domain association.
 */
export const getCustomDomainAssociation: (
  input: GetCustomDomainAssociationRequest,
) => effect.Effect<
  GetCustomDomainAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomDomainAssociationRequest,
  output: GetCustomDomainAssociationResponse,
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
 * Updates an Amazon Redshift Serverless certificate associated with a custom domain.
 */
export const updateCustomDomainAssociation: (
  input: UpdateCustomDomainAssociationRequest,
) => effect.Effect<
  UpdateCustomDomainAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomDomainAssociationRequest,
  output: UpdateCustomDomainAssociationResponse,
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
 * Deletes an Amazon Redshift Serverless managed VPC endpoint.
 */
export const deleteEndpointAccess: (
  input: DeleteEndpointAccessRequest,
) => effect.Effect<
  DeleteEndpointAccessResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointAccessRequest,
  output: DeleteEndpointAccessResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information, such as the name, about a VPC endpoint.
 */
export const getEndpointAccess: (
  input: GetEndpointAccessRequest,
) => effect.Effect<
  GetEndpointAccessResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEndpointAccessRequest,
  output: GetEndpointAccessResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns an array of `EndpointAccess` objects and relevant information.
 */
export const listEndpointAccess: {
  (
    input: ListEndpointAccessRequest,
  ): effect.Effect<
    ListEndpointAccessResponse,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEndpointAccessRequest,
  ) => stream.Stream<
    ListEndpointAccessResponse,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEndpointAccessRequest,
  ) => stream.Stream<
    EndpointAccess,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEndpointAccessRequest,
  output: ListEndpointAccessResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "endpoints",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an Amazon Redshift Serverless managed endpoint.
 */
export const updateEndpointAccess: (
  input: UpdateEndpointAccessRequest,
) => effect.Effect<
  UpdateEndpointAccessResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEndpointAccessRequest,
  output: UpdateEndpointAccessResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a namespace with the specified settings. Unless required, you can't update multiple parameters in one request. For example, you must specify both `adminUsername` and `adminUserPassword` to update either field, but you can't update both `kmsKeyId` and `logExports` in a single request.
 */
export const updateNamespace: (
  input: UpdateNamespaceRequest,
) => effect.Effect<
  UpdateNamespaceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNamespaceRequest,
  output: UpdateNamespaceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a namespace from Amazon Redshift Serverless. Before you delete the namespace, you can create a final snapshot that has all of the data within the namespace.
 */
export const deleteNamespace: (
  input: DeleteNamespaceRequest,
) => effect.Effect<
  DeleteNamespaceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamespaceRequest,
  output: DeleteNamespaceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Restore the data from a recovery point.
 */
export const restoreFromRecoveryPoint: (
  input: RestoreFromRecoveryPointRequest,
) => effect.Effect<
  RestoreFromRecoveryPointResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreFromRecoveryPointRequest,
  output: RestoreFromRecoveryPointResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a scheduled action.
 */
export const updateScheduledAction: (
  input: UpdateScheduledActionRequest,
) => effect.Effect<
  UpdateScheduledActionResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScheduledActionRequest,
  output: UpdateScheduledActionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a snapshot from Amazon Redshift Serverless.
 */
export const deleteSnapshot: (
  input: DeleteSnapshotRequest,
) => effect.Effect<
  DeleteSnapshotResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotRequest,
  output: DeleteSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a snapshot copy configuration
 */
export const deleteSnapshotCopyConfiguration: (
  input: DeleteSnapshotCopyConfigurationRequest,
) => effect.Effect<
  DeleteSnapshotCopyConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotCopyConfigurationRequest,
  output: DeleteSnapshotCopyConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of snapshot copy configurations.
 */
export const listSnapshotCopyConfigurations: {
  (
    input: ListSnapshotCopyConfigurationsRequest,
  ): effect.Effect<
    ListSnapshotCopyConfigurationsResponse,
    | ConflictException
    | InternalServerException
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSnapshotCopyConfigurationsRequest,
  ) => stream.Stream<
    ListSnapshotCopyConfigurationsResponse,
    | ConflictException
    | InternalServerException
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSnapshotCopyConfigurationsRequest,
  ) => stream.Stream<
    SnapshotCopyConfiguration,
    | ConflictException
    | InternalServerException
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSnapshotCopyConfigurationsRequest,
  output: ListSnapshotCopyConfigurationsResponse,
  errors: [
    ConflictException,
    InternalServerException,
    InvalidPaginationException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "snapshotCopyConfigurations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Restores a table from a snapshot to your Amazon Redshift Serverless instance. You can't use this operation to restore tables with interleaved sort keys.
 */
export const restoreTableFromSnapshot: (
  input: RestoreTableFromSnapshotRequest,
) => effect.Effect<
  RestoreTableFromSnapshotResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreTableFromSnapshotRequest,
  output: RestoreTableFromSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a snapshot.
 */
export const updateSnapshot: (
  input: UpdateSnapshotRequest,
) => effect.Effect<
  UpdateSnapshotResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSnapshotRequest,
  output: UpdateSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a snapshot copy configuration.
 */
export const updateSnapshotCopyConfiguration: (
  input: UpdateSnapshotCopyConfigurationRequest,
) => effect.Effect<
  UpdateSnapshotCopyConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSnapshotCopyConfigurationRequest,
  output: UpdateSnapshotCopyConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a usage limit from Amazon Redshift Serverless.
 */
export const deleteUsageLimit: (
  input: DeleteUsageLimitRequest,
) => effect.Effect<
  DeleteUsageLimitResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUsageLimitRequest,
  output: DeleteUsageLimitResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a usage limit.
 */
export const getUsageLimit: (
  input: GetUsageLimitRequest,
) => effect.Effect<
  GetUsageLimitResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsageLimitRequest,
  output: GetUsageLimitResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all usage limits within Amazon Redshift Serverless.
 */
export const listUsageLimits: {
  (
    input: ListUsageLimitsRequest,
  ): effect.Effect<
    ListUsageLimitsResponse,
    | ConflictException
    | InternalServerException
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsageLimitsRequest,
  ) => stream.Stream<
    ListUsageLimitsResponse,
    | ConflictException
    | InternalServerException
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsageLimitsRequest,
  ) => stream.Stream<
    UsageLimit,
    | ConflictException
    | InternalServerException
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsageLimitsRequest,
  output: ListUsageLimitsResponse,
  errors: [
    ConflictException,
    InternalServerException,
    InvalidPaginationException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "usageLimits",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Update a usage limit in Amazon Redshift Serverless. You can't update the usage type or period of a usage limit.
 */
export const updateUsageLimit: (
  input: UpdateUsageLimitRequest,
) => effect.Effect<
  UpdateUsageLimitResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUsageLimitRequest,
  output: UpdateUsageLimitResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a workgroup.
 */
export const deleteWorkgroup: (
  input: DeleteWorkgroupRequest,
) => effect.Effect<
  DeleteWorkgroupResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkgroupRequest,
  output: DeleteWorkgroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a custom domain association for Amazon Redshift Serverless.
 */
export const createCustomDomainAssociation: (
  input: CreateCustomDomainAssociationRequest,
) => effect.Effect<
  CreateCustomDomainAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomDomainAssociationRequest,
  output: CreateCustomDomainAssociationResponse,
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
 * Returns a database user name and temporary password with temporary authorization to log in to Amazon Redshift Serverless.
 *
 * By default, the temporary credentials expire in 900 seconds. You can optionally specify a duration between 900 seconds (15 minutes) and 3600 seconds (60 minutes).
 *
 * The Identity and Access Management (IAM) user or role that runs GetCredentials must have an IAM policy attached that allows access to all necessary actions and resources.
 *
 * If the `DbName` parameter is specified, the IAM policy must allow access to the resource dbname for the specified database name.
 */
export const getCredentials: (
  input: GetCredentialsRequest,
) => effect.Effect<
  GetCredentialsResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCredentialsRequest,
  output: GetCredentialsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags assigned to a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a namespace in Amazon Redshift Serverless.
 */
export const getNamespace: (
  input: GetNamespaceRequest,
) => effect.Effect<
  GetNamespaceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNamespaceRequest,
  output: GetNamespaceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets an Amazon Redshift Serverless reservation. A reservation gives you the option to commit to a specified number of Redshift Processing Units (RPUs) for a year at a discount from Serverless on-demand (OD) rates.
 */
export const getReservation: (
  input: GetReservationRequest,
) => effect.Effect<
  GetReservationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReservationRequest,
  output: GetReservationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a scheduled action.
 */
export const getScheduledAction: (
  input: GetScheduledActionRequest,
) => effect.Effect<
  GetScheduledActionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetScheduledActionRequest,
  output: GetScheduledActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific snapshot.
 */
export const getSnapshot: (
  input: GetSnapshotRequest,
) => effect.Effect<
  GetSnapshotResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSnapshotRequest,
  output: GetSnapshotResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a `TableRestoreStatus` object.
 */
export const getTableRestoreStatus: (
  input: GetTableRestoreStatusRequest,
) => effect.Effect<
  GetTableRestoreStatusResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableRestoreStatusRequest,
  output: GetTableRestoreStatusResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns a list of snapshots.
 */
export const listSnapshots: {
  (
    input: ListSnapshotsRequest,
  ): effect.Effect<
    ListSnapshotsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSnapshotsRequest,
  ) => stream.Stream<
    ListSnapshotsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSnapshotsRequest,
  ) => stream.Stream<
    Snapshot,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSnapshotsRequest,
  output: ListSnapshotsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "snapshots",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes a tag or set of tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a custom domain association for Amazon Redshift Serverless.
 */
export const deleteCustomDomainAssociation: (
  input: DeleteCustomDomainAssociationRequest,
) => effect.Effect<
  DeleteCustomDomainAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomDomainAssociationRequest,
  output: DeleteCustomDomainAssociationResponse,
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
 * Returns information about an array of `TableRestoreStatus` objects.
 */
export const listTableRestoreStatus: {
  (
    input: ListTableRestoreStatusRequest,
  ): effect.Effect<
    ListTableRestoreStatusResponse,
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTableRestoreStatusRequest,
  ) => stream.Stream<
    ListTableRestoreStatusResponse,
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTableRestoreStatusRequest,
  ) => stream.Stream<
    TableRestoreStatus,
    | InvalidPaginationException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTableRestoreStatusRequest,
  output: ListTableRestoreStatusResponse,
  errors: [
    InvalidPaginationException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tableRestoreStatuses",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists custom domain associations for Amazon Redshift Serverless.
 */
export const listCustomDomainAssociations: {
  (
    input: ListCustomDomainAssociationsRequest,
  ): effect.Effect<
    ListCustomDomainAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidPaginationException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomDomainAssociationsRequest,
  ) => stream.Stream<
    ListCustomDomainAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidPaginationException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomDomainAssociationsRequest,
  ) => stream.Stream<
    Association,
    | AccessDeniedException
    | InternalServerException
    | InvalidPaginationException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomDomainAssociationsRequest,
  output: ListCustomDomainAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidPaginationException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "associations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns an array of recovery points.
 */
export const listRecoveryPoints: {
  (
    input: ListRecoveryPointsRequest,
  ): effect.Effect<
    ListRecoveryPointsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecoveryPointsRequest,
  ) => stream.Stream<
    ListRecoveryPointsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecoveryPointsRequest,
  ) => stream.Stream<
    RecoveryPoint,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecoveryPointsRequest,
  output: ListRecoveryPointsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recoveryPoints",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a list of specified workgroups.
 */
export const listWorkgroups: {
  (
    input: ListWorkgroupsRequest,
  ): effect.Effect<
    ListWorkgroupsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkgroupsRequest,
  ) => stream.Stream<
    ListWorkgroupsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkgroupsRequest,
  ) => stream.Stream<
    Workgroup,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkgroupsRequest,
  output: ListWorkgroupsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "workgroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes the specified resource policy.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a resource policy.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of Reservation objects.
 */
export const listReservations: {
  (
    input: ListReservationsRequest,
  ): effect.Effect<
    ListReservationsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReservationsRequest,
  ) => stream.Stream<
    ListReservationsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReservationsRequest,
  ) => stream.Stream<
    Reservation,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReservationsRequest,
  output: ListReservationsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "reservationsList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the Amazon Redshift Serverless versions.
 */
export const listTracks: {
  (
    input: ListTracksRequest,
  ): effect.Effect<
    ListTracksResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidPaginationException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTracksRequest,
  ) => stream.Stream<
    ListTracksResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidPaginationException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTracksRequest,
  ) => stream.Stream<
    ServerlessTrack,
    | AccessDeniedException
    | InternalServerException
    | InvalidPaginationException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTracksRequest,
  output: ListTracksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidPaginationException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tracks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the reservation offering. The offering determines the payment schedule for the reservation.
 */
export const getReservationOffering: (
  input: GetReservationOfferingRequest,
) => effect.Effect<
  GetReservationOfferingResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReservationOfferingRequest,
  output: GetReservationOfferingResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a namespace in Amazon Redshift Serverless.
 */
export const createNamespace: (
  input: CreateNamespaceRequest,
) => effect.Effect<
  CreateNamespaceResponse,
  | ConflictException
  | InternalServerException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNamespaceRequest,
  output: CreateNamespaceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Converts a recovery point to a snapshot. For more information about recovery points and snapshots, see Working with snapshots and recovery points.
 */
export const convertRecoveryPointToSnapshot: (
  input: ConvertRecoveryPointToSnapshotRequest,
) => effect.Effect<
  ConvertRecoveryPointToSnapshotResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConvertRecoveryPointToSnapshotRequest,
  output: ConvertRecoveryPointToSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates a scheduled action. A scheduled action contains a schedule and an Amazon Redshift API action. For example, you can create a schedule of when to run the `CreateSnapshot` API operation.
 */
export const createScheduledAction: (
  input: CreateScheduledActionRequest,
) => effect.Effect<
  CreateScheduledActionResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScheduledActionRequest,
  output: CreateScheduledActionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific workgroup.
 */
export const getWorkgroup: (
  input: GetWorkgroupRequest,
) => effect.Effect<
  GetWorkgroupResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkgroupRequest,
  output: GetWorkgroupResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns an Identity Center authentication token for accessing Amazon Redshift Serverless workgroups.
 *
 * The token provides secure access to data within the specified workgroups using Identity Center identity propagation. The token expires after a specified duration and must be refreshed for continued access.
 *
 * The Identity and Access Management (IAM) user or role that runs GetIdentityCenterAuthToken must have appropriate permissions to access the specified workgroups and Identity Center integration must be configured for the workgroups.
 */
export const getIdentityCenterAuthToken: (
  input: GetIdentityCenterAuthTokenRequest,
) => effect.Effect<
  GetIdentityCenterAuthTokenResponse,
  | AccessDeniedException
  | ConflictException
  | DryRunException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityCenterAuthTokenRequest,
  output: GetIdentityCenterAuthTokenResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DryRunException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Redshift Serverless reservation, which gives you the option to commit to a specified number of Redshift Processing Units (RPUs) for a year at a discount from Serverless on-demand (OD) rates.
 */
export const createReservation: (
  input: CreateReservationRequest,
) => effect.Effect<
  CreateReservationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReservationRequest,
  output: CreateReservationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates a snapshot copy configuration that lets you copy snapshots to another Amazon Web Services Region.
 */
export const createSnapshotCopyConfiguration: (
  input: CreateSnapshotCopyConfigurationRequest,
) => effect.Effect<
  CreateSnapshotCopyConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotCopyConfigurationRequest,
  output: CreateSnapshotCopyConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a usage limit for a specified Amazon Redshift Serverless usage type. The usage limit is identified by the returned usage limit identifier.
 */
export const createUsageLimit: (
  input: CreateUsageLimitRequest,
) => effect.Effect<
  CreateUsageLimitResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUsageLimitRequest,
  output: CreateUsageLimitResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a resource policy. Currently, you can use policies to share snapshots across Amazon Web Services accounts.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a snapshot of all databases in a namespace. For more information about snapshots, see Working with snapshots and recovery points.
 */
export const createSnapshot: (
  input: CreateSnapshotRequest,
) => effect.Effect<
  CreateSnapshotResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotRequest,
  output: CreateSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Restores a namespace from a snapshot.
 */
export const restoreFromSnapshot: (
  input: RestoreFromSnapshotRequest,
) => effect.Effect<
  RestoreFromSnapshotResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreFromSnapshotRequest,
  output: RestoreFromSnapshotResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Modifies the lakehouse configuration for a namespace. This operation allows you to manage Amazon Redshift federated permissions and Amazon Web Services IAM Identity Center trusted identity propagation.
 */
export const updateLakehouseConfiguration: (
  input: UpdateLakehouseConfigurationRequest,
) => effect.Effect<
  UpdateLakehouseConfigurationResponse,
  | ConflictException
  | DryRunException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLakehouseConfigurationRequest,
  output: UpdateLakehouseConfigurationResponse,
  errors: [
    ConflictException,
    DryRunException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Get the Redshift Serverless version for a specified track.
 */
export const getTrack: (
  input: GetTrackRequest,
) => effect.Effect<
  GetTrackResponse,
  | AccessDeniedException
  | ConflictException
  | DryRunException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrackRequest,
  output: GetTrackResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DryRunException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Redshift Serverless managed VPC endpoint.
 */
export const createEndpointAccess: (
  input: CreateEndpointAccessRequest,
) => effect.Effect<
  CreateEndpointAccessResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEndpointAccessRequest,
  output: CreateEndpointAccessResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an workgroup in Amazon Redshift Serverless.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that you own in a Region from reaching or being reached from the internet through internet gateways and egress-only internet gateways. If a workgroup is in an account with VPC BPA turned on, the following capabilities are blocked:
 *
 * - Creating a public access workgroup
 *
 * - Modifying a private workgroup to public
 *
 * - Adding a subnet with VPC BPA turned on to the workgroup when the workgroup is public
 *
 * For more information about VPC BPA, see Block public access to VPCs and subnets in the *Amazon VPC User Guide*.
 */
export const createWorkgroup: (
  input: CreateWorkgroupRequest,
) => effect.Effect<
  CreateWorkgroupResponse,
  | ConflictException
  | InsufficientCapacityException
  | InternalServerException
  | Ipv6CidrBlockNotFoundException
  | ResourceNotFoundException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkgroupRequest,
  output: CreateWorkgroupResponse,
  errors: [
    ConflictException,
    InsufficientCapacityException,
    InternalServerException,
    Ipv6CidrBlockNotFoundException,
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Updates a workgroup with the specified configuration settings. You can't update multiple parameters in one request. For example, you can update `baseCapacity` or `port` in a single request, but you can't update both in the same request.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that you own in a Region from reaching or being reached from the internet through internet gateways and egress-only internet gateways. If a workgroup is in an account with VPC BPA turned on, the following capabilities are blocked:
 *
 * - Creating a public access workgroup
 *
 * - Modifying a private workgroup to public
 *
 * - Adding a subnet with VPC BPA turned on to the workgroup when the workgroup is public
 *
 * For more information about VPC BPA, see Block public access to VPCs and subnets in the *Amazon VPC User Guide*.
 */
export const updateWorkgroup: (
  input: UpdateWorkgroupRequest,
) => effect.Effect<
  UpdateWorkgroupResponse,
  | ConflictException
  | InsufficientCapacityException
  | InternalServerException
  | Ipv6CidrBlockNotFoundException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkgroupRequest,
  output: UpdateWorkgroupResponse,
  errors: [
    ConflictException,
    InsufficientCapacityException,
    InternalServerException,
    Ipv6CidrBlockNotFoundException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
