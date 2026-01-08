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
  sdkId: "LakeFormation",
  serviceShapeName: "AWSLakeFormation",
});
const auth = T.AwsAuthSigv4({ name: "lakeformation" });
const ver = T.ServiceVersion("2017-03-31");
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
              `https://lakeformation-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://lakeformation-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://lakeformation.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://lakeformation.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CatalogIdString = string;
export type SAMLAssertionString = string;
export type IAMRoleArn = string;
export type IAMSAMLProviderArn = string;
export type CredentialTimeoutDurationSecondInteger = number;
export type TransactionIdString = string;
export type IdentityCenterInstanceArn = string;
export type LFTagKey = string;
export type LFTagValue = string;
export type NameString = string;
export type DescriptionString = string;
export type ResourceArnString = string;
export type IdentityString = string;
export type Token = string;
export type PageSize = number;
export type GetQueryStateRequestQueryIdString = string;
export type GetQueryStatisticsRequestQueryIdString = string;
export type BooleanNullable = boolean;
export type PredicateString = string;
export type TokenString = string;
export type PathString = string;
export type GetWorkUnitResultsRequestQueryIdString = string;
export type GetWorkUnitResultsRequestWorkUnitIdLong = number;
export type SyntheticGetWorkUnitResultsRequestWorkUnitTokenString =
  | string
  | redacted.Redacted<string>;
export type GetWorkUnitsRequestQueryIdString = string;
export type TrueFalseString = string;
export type SearchPageSize = number;
export type SyntheticStartQueryPlanningRequestQueryString =
  | string
  | redacted.Redacted<string>;
export type Identifier = string;
export type VersionString = string;
export type ScopeTarget = string;
export type DataLakePrincipalString = string;
export type ExpressionString = string;
export type URI = string;
export type ETagString = string;
export type ValueString = string;
export type AuditContextString = string;
export type HashString = string;
export type NullableString = string;
export type StringValue = string;
export type QueryPlanningContextDatabaseNameString = string;
export type AccessKeyIdString = string;
export type SecretAccessKeyString = string;
export type SessionTokenString = string;
export type ExpirationTimestamp = Date;
export type MessageString = string;
export type ApplicationArn = string;
export type RAMResourceShareArn = string;
export type ErrorMessageString = string;
export type QueryIdString = string;
export type ContextKey = string;
export type ContextValue = string;
export type KeyString = string;
export type ParametersMapValue = string;
export type ObjectSize = number;
export type PartitionValueString = string;
export type StorageOptimizerConfigKey = string;
export type StorageOptimizerConfigValue = string;
export type LastModifiedTimestamp = Date;
export type NumberOfMilliseconds = number;
export type NumberOfBytes = number;
export type NumberOfItems = number;
export type WorkUnitIdLong = number;
export type WorkUnitTokenString = string;
export type Result = string;

//# Schemas
export interface GetDataLakePrincipalRequest {}
export const GetDataLakePrincipalRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetDataLakePrincipal" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataLakePrincipalRequest",
}) as any as S.Schema<GetDataLakePrincipalRequest>;
export type TagValueList = string[];
export const TagValueList = S.Array(S.String);
export type Permission =
  | "ALL"
  | "SELECT"
  | "ALTER"
  | "DROP"
  | "DELETE"
  | "INSERT"
  | "DESCRIBE"
  | "CREATE_DATABASE"
  | "CREATE_TABLE"
  | "DATA_LOCATION_ACCESS"
  | "CREATE_LF_TAG"
  | "ASSOCIATE"
  | "GRANT_WITH_LF_TAG_EXPRESSION"
  | "CREATE_LF_TAG_EXPRESSION"
  | "CREATE_CATALOG"
  | "SUPER_USER";
export const Permission = S.Literal(
  "ALL",
  "SELECT",
  "ALTER",
  "DROP",
  "DELETE",
  "INSERT",
  "DESCRIBE",
  "CREATE_DATABASE",
  "CREATE_TABLE",
  "DATA_LOCATION_ACCESS",
  "CREATE_LF_TAG",
  "ASSOCIATE",
  "GRANT_WITH_LF_TAG_EXPRESSION",
  "CREATE_LF_TAG_EXPRESSION",
  "CREATE_CATALOG",
  "SUPER_USER",
);
export type PermissionList = Permission[];
export const PermissionList = S.Array(Permission);
export type PermissionType =
  | "COLUMN_PERMISSION"
  | "CELL_FILTER_PERMISSION"
  | "NESTED_PERMISSION"
  | "NESTED_CELL_PERMISSION";
export const PermissionType = S.Literal(
  "COLUMN_PERMISSION",
  "CELL_FILTER_PERMISSION",
  "NESTED_PERMISSION",
  "NESTED_CELL_PERMISSION",
);
export type PermissionTypeList = PermissionType[];
export const PermissionTypeList = S.Array(PermissionType);
export type ResourceShareType = "FOREIGN" | "ALL";
export const ResourceShareType = S.Literal("FOREIGN", "ALL");
export type DataLakeResourceType =
  | "CATALOG"
  | "DATABASE"
  | "TABLE"
  | "DATA_LOCATION"
  | "LF_TAG"
  | "LF_TAG_POLICY"
  | "LF_TAG_POLICY_DATABASE"
  | "LF_TAG_POLICY_TABLE"
  | "LF_NAMED_TAG_EXPRESSION";
export const DataLakeResourceType = S.Literal(
  "CATALOG",
  "DATABASE",
  "TABLE",
  "DATA_LOCATION",
  "LF_TAG",
  "LF_TAG_POLICY",
  "LF_TAG_POLICY_DATABASE",
  "LF_TAG_POLICY_TABLE",
  "LF_NAMED_TAG_EXPRESSION",
);
export type OptimizerType = "COMPACTION" | "GARBAGE_COLLECTION" | "ALL";
export const OptimizerType = S.Literal(
  "COMPACTION",
  "GARBAGE_COLLECTION",
  "ALL",
);
export type TransactionStatusFilter =
  | "ALL"
  | "COMPLETED"
  | "ACTIVE"
  | "COMMITTED"
  | "ABORTED";
export const TransactionStatusFilter = S.Literal(
  "ALL",
  "COMPLETED",
  "ACTIVE",
  "COMMITTED",
  "ABORTED",
);
export type TransactionType = "READ_AND_WRITE" | "READ_ONLY";
export const TransactionType = S.Literal("READ_AND_WRITE", "READ_ONLY");
export type ApplicationStatus = "ENABLED" | "DISABLED";
export const ApplicationStatus = S.Literal("ENABLED", "DISABLED");
export interface AssumeDecoratedRoleWithSAMLRequest {
  SAMLAssertion: string;
  RoleArn: string;
  PrincipalArn: string;
  DurationSeconds?: number;
}
export const AssumeDecoratedRoleWithSAMLRequest = S.suspend(() =>
  S.Struct({
    SAMLAssertion: S.String,
    RoleArn: S.String,
    PrincipalArn: S.String,
    DurationSeconds: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AssumeDecoratedRoleWithSAML" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssumeDecoratedRoleWithSAMLRequest",
}) as any as S.Schema<AssumeDecoratedRoleWithSAMLRequest>;
export interface DataLakePrincipal {
  DataLakePrincipalIdentifier?: string;
}
export const DataLakePrincipal = S.suspend(() =>
  S.Struct({ DataLakePrincipalIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "DataLakePrincipal",
}) as any as S.Schema<DataLakePrincipal>;
export interface CatalogResource {
  Id?: string;
}
export const CatalogResource = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "CatalogResource",
}) as any as S.Schema<CatalogResource>;
export interface DatabaseResource {
  CatalogId?: string;
  Name: string;
}
export const DatabaseResource = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String), Name: S.String }),
).annotations({
  identifier: "DatabaseResource",
}) as any as S.Schema<DatabaseResource>;
export interface TableWildcard {}
export const TableWildcard = S.suspend(() => S.Struct({})).annotations({
  identifier: "TableWildcard",
}) as any as S.Schema<TableWildcard>;
export interface TableResource {
  CatalogId?: string;
  DatabaseName: string;
  Name?: string;
  TableWildcard?: TableWildcard;
}
export const TableResource = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.optional(S.String),
    TableWildcard: S.optional(TableWildcard),
  }),
).annotations({
  identifier: "TableResource",
}) as any as S.Schema<TableResource>;
export type ColumnNames = string[];
export const ColumnNames = S.Array(S.String);
export interface ColumnWildcard {
  ExcludedColumnNames?: string[];
}
export const ColumnWildcard = S.suspend(() =>
  S.Struct({ ExcludedColumnNames: S.optional(ColumnNames) }),
).annotations({
  identifier: "ColumnWildcard",
}) as any as S.Schema<ColumnWildcard>;
export interface TableWithColumnsResource {
  CatalogId?: string;
  DatabaseName: string;
  Name: string;
  ColumnNames?: string[];
  ColumnWildcard?: ColumnWildcard;
}
export const TableWithColumnsResource = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.String,
    ColumnNames: S.optional(ColumnNames),
    ColumnWildcard: S.optional(ColumnWildcard),
  }),
).annotations({
  identifier: "TableWithColumnsResource",
}) as any as S.Schema<TableWithColumnsResource>;
export interface DataLocationResource {
  CatalogId?: string;
  ResourceArn: string;
}
export const DataLocationResource = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String), ResourceArn: S.String }),
).annotations({
  identifier: "DataLocationResource",
}) as any as S.Schema<DataLocationResource>;
export interface DataCellsFilterResource {
  TableCatalogId?: string;
  DatabaseName?: string;
  TableName?: string;
  Name?: string;
}
export const DataCellsFilterResource = S.suspend(() =>
  S.Struct({
    TableCatalogId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    TableName: S.optional(S.String),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "DataCellsFilterResource",
}) as any as S.Schema<DataCellsFilterResource>;
export interface LFTagKeyResource {
  CatalogId?: string;
  TagKey: string;
  TagValues: string[];
}
export const LFTagKeyResource = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    TagKey: S.String,
    TagValues: TagValueList,
  }),
).annotations({
  identifier: "LFTagKeyResource",
}) as any as S.Schema<LFTagKeyResource>;
export type ResourceType = "DATABASE" | "TABLE";
export const ResourceType = S.Literal("DATABASE", "TABLE");
export interface LFTag {
  TagKey: string;
  TagValues: string[];
}
export const LFTag = S.suspend(() =>
  S.Struct({ TagKey: S.String, TagValues: TagValueList }),
).annotations({ identifier: "LFTag" }) as any as S.Schema<LFTag>;
export type Expression = LFTag[];
export const Expression = S.Array(LFTag);
export interface LFTagPolicyResource {
  CatalogId?: string;
  ResourceType: ResourceType;
  Expression?: LFTag[];
  ExpressionName?: string;
}
export const LFTagPolicyResource = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    ResourceType: ResourceType,
    Expression: S.optional(Expression),
    ExpressionName: S.optional(S.String),
  }),
).annotations({
  identifier: "LFTagPolicyResource",
}) as any as S.Schema<LFTagPolicyResource>;
export interface LFTagExpressionResource {
  CatalogId?: string;
  Name: string;
}
export const LFTagExpressionResource = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String), Name: S.String }),
).annotations({
  identifier: "LFTagExpressionResource",
}) as any as S.Schema<LFTagExpressionResource>;
export interface Resource {
  Catalog?: CatalogResource;
  Database?: DatabaseResource;
  Table?: TableResource;
  TableWithColumns?: TableWithColumnsResource;
  DataLocation?: DataLocationResource;
  DataCellsFilter?: DataCellsFilterResource;
  LFTag?: LFTagKeyResource;
  LFTagPolicy?: LFTagPolicyResource;
  LFTagExpression?: LFTagExpressionResource;
}
export const Resource = S.suspend(() =>
  S.Struct({
    Catalog: S.optional(CatalogResource),
    Database: S.optional(DatabaseResource),
    Table: S.optional(TableResource),
    TableWithColumns: S.optional(TableWithColumnsResource),
    DataLocation: S.optional(DataLocationResource),
    DataCellsFilter: S.optional(DataCellsFilterResource),
    LFTag: S.optional(LFTagKeyResource),
    LFTagPolicy: S.optional(LFTagPolicyResource),
    LFTagExpression: S.optional(LFTagExpressionResource),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export interface Condition {
  Expression?: string;
}
export const Condition = S.suspend(() =>
  S.Struct({ Expression: S.optional(S.String) }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export interface BatchPermissionsRequestEntry {
  Id: string;
  Principal?: DataLakePrincipal;
  Resource?: Resource;
  Permissions?: Permission[];
  Condition?: Condition;
  PermissionsWithGrantOption?: Permission[];
}
export const BatchPermissionsRequestEntry = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Principal: S.optional(DataLakePrincipal),
    Resource: S.optional(Resource),
    Permissions: S.optional(PermissionList),
    Condition: S.optional(Condition),
    PermissionsWithGrantOption: S.optional(PermissionList),
  }),
).annotations({
  identifier: "BatchPermissionsRequestEntry",
}) as any as S.Schema<BatchPermissionsRequestEntry>;
export type BatchPermissionsRequestEntryList = BatchPermissionsRequestEntry[];
export const BatchPermissionsRequestEntryList = S.Array(
  BatchPermissionsRequestEntry,
);
export interface BatchRevokePermissionsRequest {
  CatalogId?: string;
  Entries: BatchPermissionsRequestEntry[];
}
export const BatchRevokePermissionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Entries: BatchPermissionsRequestEntryList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchRevokePermissions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchRevokePermissionsRequest",
}) as any as S.Schema<BatchRevokePermissionsRequest>;
export interface CancelTransactionRequest {
  TransactionId: string;
}
export const CancelTransactionRequest = S.suspend(() =>
  S.Struct({ TransactionId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CancelTransaction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelTransactionRequest",
}) as any as S.Schema<CancelTransactionRequest>;
export interface CancelTransactionResponse {}
export const CancelTransactionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelTransactionResponse",
}) as any as S.Schema<CancelTransactionResponse>;
export interface CommitTransactionRequest {
  TransactionId: string;
}
export const CommitTransactionRequest = S.suspend(() =>
  S.Struct({ TransactionId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CommitTransaction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CommitTransactionRequest",
}) as any as S.Schema<CommitTransactionRequest>;
export interface CreateLFTagRequest {
  CatalogId?: string;
  TagKey: string;
  TagValues: string[];
}
export const CreateLFTagRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    TagKey: S.String,
    TagValues: TagValueList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateLFTag" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLFTagRequest",
}) as any as S.Schema<CreateLFTagRequest>;
export interface CreateLFTagResponse {}
export const CreateLFTagResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateLFTagResponse",
}) as any as S.Schema<CreateLFTagResponse>;
export interface DeleteDataCellsFilterRequest {
  TableCatalogId?: string;
  DatabaseName?: string;
  TableName?: string;
  Name?: string;
}
export const DeleteDataCellsFilterRequest = S.suspend(() =>
  S.Struct({
    TableCatalogId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    TableName: S.optional(S.String),
    Name: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteDataCellsFilter" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataCellsFilterRequest",
}) as any as S.Schema<DeleteDataCellsFilterRequest>;
export interface DeleteDataCellsFilterResponse {}
export const DeleteDataCellsFilterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataCellsFilterResponse",
}) as any as S.Schema<DeleteDataCellsFilterResponse>;
export interface DeleteLakeFormationIdentityCenterConfigurationRequest {
  CatalogId?: string;
}
export const DeleteLakeFormationIdentityCenterConfigurationRequest = S.suspend(
  () =>
    S.Struct({ CatalogId: S.optional(S.String) }).pipe(
      T.all(
        T.Http({
          method: "POST",
          uri: "/DeleteLakeFormationIdentityCenterConfiguration",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DeleteLakeFormationIdentityCenterConfigurationRequest",
}) as any as S.Schema<DeleteLakeFormationIdentityCenterConfigurationRequest>;
export interface DeleteLakeFormationIdentityCenterConfigurationResponse {}
export const DeleteLakeFormationIdentityCenterConfigurationResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DeleteLakeFormationIdentityCenterConfigurationResponse",
}) as any as S.Schema<DeleteLakeFormationIdentityCenterConfigurationResponse>;
export interface DeleteLakeFormationOptInRequest {
  Principal: DataLakePrincipal;
  Resource: Resource;
  Condition?: Condition;
}
export const DeleteLakeFormationOptInRequest = S.suspend(() =>
  S.Struct({
    Principal: DataLakePrincipal,
    Resource: Resource,
    Condition: S.optional(Condition),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteLakeFormationOptIn" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLakeFormationOptInRequest",
}) as any as S.Schema<DeleteLakeFormationOptInRequest>;
export interface DeleteLakeFormationOptInResponse {}
export const DeleteLakeFormationOptInResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLakeFormationOptInResponse",
}) as any as S.Schema<DeleteLakeFormationOptInResponse>;
export interface DeleteLFTagRequest {
  CatalogId?: string;
  TagKey: string;
}
export const DeleteLFTagRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String), TagKey: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteLFTag" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLFTagRequest",
}) as any as S.Schema<DeleteLFTagRequest>;
export interface DeleteLFTagResponse {}
export const DeleteLFTagResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteLFTagResponse",
}) as any as S.Schema<DeleteLFTagResponse>;
export interface DeleteLFTagExpressionRequest {
  Name: string;
  CatalogId?: string;
}
export const DeleteLFTagExpressionRequest = S.suspend(() =>
  S.Struct({ Name: S.String, CatalogId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteLFTagExpression" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLFTagExpressionRequest",
}) as any as S.Schema<DeleteLFTagExpressionRequest>;
export interface DeleteLFTagExpressionResponse {}
export const DeleteLFTagExpressionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLFTagExpressionResponse",
}) as any as S.Schema<DeleteLFTagExpressionResponse>;
export interface DeregisterResourceRequest {
  ResourceArn: string;
}
export const DeregisterResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeregisterResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterResourceRequest",
}) as any as S.Schema<DeregisterResourceRequest>;
export interface DeregisterResourceResponse {}
export const DeregisterResourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterResourceResponse",
}) as any as S.Schema<DeregisterResourceResponse>;
export interface DescribeLakeFormationIdentityCenterConfigurationRequest {
  CatalogId?: string;
}
export const DescribeLakeFormationIdentityCenterConfigurationRequest =
  S.suspend(() =>
    S.Struct({ CatalogId: S.optional(S.String) }).pipe(
      T.all(
        T.Http({
          method: "POST",
          uri: "/DescribeLakeFormationIdentityCenterConfiguration",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "DescribeLakeFormationIdentityCenterConfigurationRequest",
  }) as any as S.Schema<DescribeLakeFormationIdentityCenterConfigurationRequest>;
export interface DescribeResourceRequest {
  ResourceArn: string;
}
export const DescribeResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeResourceRequest",
}) as any as S.Schema<DescribeResourceRequest>;
export interface DescribeTransactionRequest {
  TransactionId: string;
}
export const DescribeTransactionRequest = S.suspend(() =>
  S.Struct({ TransactionId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeTransaction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTransactionRequest",
}) as any as S.Schema<DescribeTransactionRequest>;
export interface ExtendTransactionRequest {
  TransactionId?: string;
}
export const ExtendTransactionRequest = S.suspend(() =>
  S.Struct({ TransactionId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ExtendTransaction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExtendTransactionRequest",
}) as any as S.Schema<ExtendTransactionRequest>;
export interface ExtendTransactionResponse {}
export const ExtendTransactionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ExtendTransactionResponse",
}) as any as S.Schema<ExtendTransactionResponse>;
export interface GetDataCellsFilterRequest {
  TableCatalogId: string;
  DatabaseName: string;
  TableName: string;
  Name: string;
}
export const GetDataCellsFilterRequest = S.suspend(() =>
  S.Struct({
    TableCatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Name: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetDataCellsFilter" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataCellsFilterRequest",
}) as any as S.Schema<GetDataCellsFilterRequest>;
export interface GetDataLakePrincipalResponse {
  Identity?: string;
}
export const GetDataLakePrincipalResponse = S.suspend(() =>
  S.Struct({ Identity: S.optional(S.String) }),
).annotations({
  identifier: "GetDataLakePrincipalResponse",
}) as any as S.Schema<GetDataLakePrincipalResponse>;
export interface GetDataLakeSettingsRequest {
  CatalogId?: string;
}
export const GetDataLakeSettingsRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetDataLakeSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataLakeSettingsRequest",
}) as any as S.Schema<GetDataLakeSettingsRequest>;
export interface GetEffectivePermissionsForPathRequest {
  CatalogId?: string;
  ResourceArn: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetEffectivePermissionsForPathRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    ResourceArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetEffectivePermissionsForPath" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEffectivePermissionsForPathRequest",
}) as any as S.Schema<GetEffectivePermissionsForPathRequest>;
export interface GetLFTagRequest {
  CatalogId?: string;
  TagKey: string;
}
export const GetLFTagRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String), TagKey: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetLFTag" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLFTagRequest",
}) as any as S.Schema<GetLFTagRequest>;
export interface GetLFTagExpressionRequest {
  Name: string;
  CatalogId?: string;
}
export const GetLFTagExpressionRequest = S.suspend(() =>
  S.Struct({ Name: S.String, CatalogId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetLFTagExpression" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLFTagExpressionRequest",
}) as any as S.Schema<GetLFTagExpressionRequest>;
export interface GetQueryStateRequest {
  QueryId: string;
}
export const GetQueryStateRequest = S.suspend(() =>
  S.Struct({ QueryId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetQueryState" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQueryStateRequest",
}) as any as S.Schema<GetQueryStateRequest>;
export interface GetQueryStatisticsRequest {
  QueryId: string;
}
export const GetQueryStatisticsRequest = S.suspend(() =>
  S.Struct({ QueryId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetQueryStatistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQueryStatisticsRequest",
}) as any as S.Schema<GetQueryStatisticsRequest>;
export interface GetResourceLFTagsRequest {
  CatalogId?: string;
  Resource: Resource;
  ShowAssignedLFTags?: boolean;
}
export const GetResourceLFTagsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Resource: Resource,
    ShowAssignedLFTags: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetResourceLFTags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceLFTagsRequest",
}) as any as S.Schema<GetResourceLFTagsRequest>;
export interface GetTableObjectsRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  TransactionId?: string;
  QueryAsOfTime?: Date;
  PartitionPredicate?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetTableObjectsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    TransactionId: S.optional(S.String),
    QueryAsOfTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PartitionPredicate: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTableObjects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTableObjectsRequest",
}) as any as S.Schema<GetTableObjectsRequest>;
export interface GetWorkUnitResultsRequest {
  QueryId: string;
  WorkUnitId: number;
  WorkUnitToken: string | redacted.Redacted<string>;
}
export const GetWorkUnitResultsRequest = S.suspend(() =>
  S.Struct({
    QueryId: S.String,
    WorkUnitId: S.Number,
    WorkUnitToken: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetWorkUnitResults" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkUnitResultsRequest",
}) as any as S.Schema<GetWorkUnitResultsRequest>;
export interface GetWorkUnitsRequest {
  NextToken?: string;
  PageSize?: number;
  QueryId: string;
}
export const GetWorkUnitsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    QueryId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetWorkUnits" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkUnitsRequest",
}) as any as S.Schema<GetWorkUnitsRequest>;
export interface GrantPermissionsRequest {
  CatalogId?: string;
  Principal: DataLakePrincipal;
  Resource: Resource;
  Permissions: Permission[];
  Condition?: Condition;
  PermissionsWithGrantOption?: Permission[];
}
export const GrantPermissionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Principal: DataLakePrincipal,
    Resource: Resource,
    Permissions: PermissionList,
    Condition: S.optional(Condition),
    PermissionsWithGrantOption: S.optional(PermissionList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GrantPermissions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GrantPermissionsRequest",
}) as any as S.Schema<GrantPermissionsRequest>;
export interface GrantPermissionsResponse {}
export const GrantPermissionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "GrantPermissionsResponse",
}) as any as S.Schema<GrantPermissionsResponse>;
export interface ListLakeFormationOptInsRequest {
  Principal?: DataLakePrincipal;
  Resource?: Resource;
  MaxResults?: number;
  NextToken?: string;
}
export const ListLakeFormationOptInsRequest = S.suspend(() =>
  S.Struct({
    Principal: S.optional(DataLakePrincipal),
    Resource: S.optional(Resource),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListLakeFormationOptIns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLakeFormationOptInsRequest",
}) as any as S.Schema<ListLakeFormationOptInsRequest>;
export interface ListLFTagExpressionsRequest {
  CatalogId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListLFTagExpressionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListLFTagExpressions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLFTagExpressionsRequest",
}) as any as S.Schema<ListLFTagExpressionsRequest>;
export interface ListLFTagsRequest {
  CatalogId?: string;
  ResourceShareType?: ResourceShareType;
  MaxResults?: number;
  NextToken?: string;
}
export const ListLFTagsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    ResourceShareType: S.optional(ResourceShareType),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListLFTags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLFTagsRequest",
}) as any as S.Schema<ListLFTagsRequest>;
export interface ListPermissionsRequest {
  CatalogId?: string;
  Principal?: DataLakePrincipal;
  ResourceType?: DataLakeResourceType;
  Resource?: Resource;
  NextToken?: string;
  MaxResults?: number;
  IncludeRelated?: string;
}
export const ListPermissionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Principal: S.optional(DataLakePrincipal),
    ResourceType: S.optional(DataLakeResourceType),
    Resource: S.optional(Resource),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    IncludeRelated: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListPermissions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPermissionsRequest",
}) as any as S.Schema<ListPermissionsRequest>;
export interface ListTableStorageOptimizersRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  StorageOptimizerType?: OptimizerType;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTableStorageOptimizersRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    StorageOptimizerType: S.optional(OptimizerType),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTableStorageOptimizers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTableStorageOptimizersRequest",
}) as any as S.Schema<ListTableStorageOptimizersRequest>;
export interface ListTransactionsRequest {
  CatalogId?: string;
  StatusFilter?: TransactionStatusFilter;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTransactionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    StatusFilter: S.optional(TransactionStatusFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTransactions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTransactionsRequest",
}) as any as S.Schema<ListTransactionsRequest>;
export interface RegisterResourceRequest {
  ResourceArn: string;
  UseServiceLinkedRole?: boolean;
  RoleArn?: string;
  WithFederation?: boolean;
  HybridAccessEnabled?: boolean;
  WithPrivilegedAccess?: boolean;
}
export const RegisterResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    UseServiceLinkedRole: S.optional(S.Boolean),
    RoleArn: S.optional(S.String),
    WithFederation: S.optional(S.Boolean),
    HybridAccessEnabled: S.optional(S.Boolean),
    WithPrivilegedAccess: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/RegisterResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterResourceRequest",
}) as any as S.Schema<RegisterResourceRequest>;
export interface RegisterResourceResponse {}
export const RegisterResourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RegisterResourceResponse",
}) as any as S.Schema<RegisterResourceResponse>;
export interface LFTagPair {
  CatalogId?: string;
  TagKey: string;
  TagValues: string[];
}
export const LFTagPair = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    TagKey: S.String,
    TagValues: TagValueList,
  }),
).annotations({ identifier: "LFTagPair" }) as any as S.Schema<LFTagPair>;
export type LFTagsList = LFTagPair[];
export const LFTagsList = S.Array(LFTagPair);
export interface RemoveLFTagsFromResourceRequest {
  CatalogId?: string;
  Resource: Resource;
  LFTags: LFTagPair[];
}
export const RemoveLFTagsFromResourceRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Resource: Resource,
    LFTags: LFTagsList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/RemoveLFTagsFromResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveLFTagsFromResourceRequest",
}) as any as S.Schema<RemoveLFTagsFromResourceRequest>;
export interface RevokePermissionsRequest {
  CatalogId?: string;
  Principal: DataLakePrincipal;
  Resource: Resource;
  Permissions: Permission[];
  Condition?: Condition;
  PermissionsWithGrantOption?: Permission[];
}
export const RevokePermissionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Principal: DataLakePrincipal,
    Resource: Resource,
    Permissions: PermissionList,
    Condition: S.optional(Condition),
    PermissionsWithGrantOption: S.optional(PermissionList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/RevokePermissions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokePermissionsRequest",
}) as any as S.Schema<RevokePermissionsRequest>;
export interface RevokePermissionsResponse {}
export const RevokePermissionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RevokePermissionsResponse",
}) as any as S.Schema<RevokePermissionsResponse>;
export interface SearchDatabasesByLFTagsRequest {
  NextToken?: string;
  MaxResults?: number;
  CatalogId?: string;
  Expression: LFTag[];
}
export const SearchDatabasesByLFTagsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CatalogId: S.optional(S.String),
    Expression: Expression,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/SearchDatabasesByLFTags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchDatabasesByLFTagsRequest",
}) as any as S.Schema<SearchDatabasesByLFTagsRequest>;
export interface SearchTablesByLFTagsRequest {
  NextToken?: string;
  MaxResults?: number;
  CatalogId?: string;
  Expression: LFTag[];
}
export const SearchTablesByLFTagsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CatalogId: S.optional(S.String),
    Expression: Expression,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/SearchTablesByLFTags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchTablesByLFTagsRequest",
}) as any as S.Schema<SearchTablesByLFTagsRequest>;
export interface StartTransactionRequest {
  TransactionType?: TransactionType;
}
export const StartTransactionRequest = S.suspend(() =>
  S.Struct({ TransactionType: S.optional(TransactionType) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartTransaction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartTransactionRequest",
}) as any as S.Schema<StartTransactionRequest>;
export interface AllRowsWildcard {}
export const AllRowsWildcard = S.suspend(() => S.Struct({})).annotations({
  identifier: "AllRowsWildcard",
}) as any as S.Schema<AllRowsWildcard>;
export interface RowFilter {
  FilterExpression?: string;
  AllRowsWildcard?: AllRowsWildcard;
}
export const RowFilter = S.suspend(() =>
  S.Struct({
    FilterExpression: S.optional(S.String),
    AllRowsWildcard: S.optional(AllRowsWildcard),
  }),
).annotations({ identifier: "RowFilter" }) as any as S.Schema<RowFilter>;
export interface DataCellsFilter {
  TableCatalogId: string;
  DatabaseName: string;
  TableName: string;
  Name: string;
  RowFilter?: RowFilter;
  ColumnNames?: string[];
  ColumnWildcard?: ColumnWildcard;
  VersionId?: string;
}
export const DataCellsFilter = S.suspend(() =>
  S.Struct({
    TableCatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Name: S.String,
    RowFilter: S.optional(RowFilter),
    ColumnNames: S.optional(ColumnNames),
    ColumnWildcard: S.optional(ColumnWildcard),
    VersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DataCellsFilter",
}) as any as S.Schema<DataCellsFilter>;
export interface UpdateDataCellsFilterRequest {
  TableData: DataCellsFilter;
}
export const UpdateDataCellsFilterRequest = S.suspend(() =>
  S.Struct({ TableData: DataCellsFilter }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateDataCellsFilter" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataCellsFilterRequest",
}) as any as S.Schema<UpdateDataCellsFilterRequest>;
export interface UpdateDataCellsFilterResponse {}
export const UpdateDataCellsFilterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDataCellsFilterResponse",
}) as any as S.Schema<UpdateDataCellsFilterResponse>;
export type DataLakePrincipalList = DataLakePrincipal[];
export const DataLakePrincipalList = S.Array(DataLakePrincipal);
export type ServiceAuthorization = "ENABLED" | "DISABLED";
export const ServiceAuthorization = S.Literal("ENABLED", "DISABLED");
export interface RedshiftConnect {
  Authorization: ServiceAuthorization;
}
export const RedshiftConnect = S.suspend(() =>
  S.Struct({ Authorization: ServiceAuthorization }),
).annotations({
  identifier: "RedshiftConnect",
}) as any as S.Schema<RedshiftConnect>;
export type RedshiftScopeUnion = { RedshiftConnect: RedshiftConnect };
export const RedshiftScopeUnion = S.Union(
  S.Struct({ RedshiftConnect: RedshiftConnect }),
);
export type RedshiftServiceIntegrations = RedshiftScopeUnion[];
export const RedshiftServiceIntegrations = S.Array(RedshiftScopeUnion);
export type ServiceIntegrationUnion = { Redshift: RedshiftScopeUnion[] };
export const ServiceIntegrationUnion = S.Union(
  S.Struct({ Redshift: RedshiftServiceIntegrations }),
);
export type ServiceIntegrationList = ServiceIntegrationUnion[];
export const ServiceIntegrationList = S.Array(ServiceIntegrationUnion);
export type EnableStatus = "ENABLED" | "DISABLED";
export const EnableStatus = S.Literal("ENABLED", "DISABLED");
export type ScopeTargets = string[];
export const ScopeTargets = S.Array(S.String);
export interface ExternalFilteringConfiguration {
  Status: EnableStatus;
  AuthorizedTargets: string[];
}
export const ExternalFilteringConfiguration = S.suspend(() =>
  S.Struct({ Status: EnableStatus, AuthorizedTargets: ScopeTargets }),
).annotations({
  identifier: "ExternalFilteringConfiguration",
}) as any as S.Schema<ExternalFilteringConfiguration>;
export interface UpdateLakeFormationIdentityCenterConfigurationRequest {
  CatalogId?: string;
  ShareRecipients?: DataLakePrincipal[];
  ServiceIntegrations?: ServiceIntegrationUnion[];
  ApplicationStatus?: ApplicationStatus;
  ExternalFiltering?: ExternalFilteringConfiguration;
}
export const UpdateLakeFormationIdentityCenterConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      CatalogId: S.optional(S.String),
      ShareRecipients: S.optional(DataLakePrincipalList),
      ServiceIntegrations: S.optional(ServiceIntegrationList),
      ApplicationStatus: S.optional(ApplicationStatus),
      ExternalFiltering: S.optional(ExternalFilteringConfiguration),
    }).pipe(
      T.all(
        T.Http({
          method: "POST",
          uri: "/UpdateLakeFormationIdentityCenterConfiguration",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "UpdateLakeFormationIdentityCenterConfigurationRequest",
}) as any as S.Schema<UpdateLakeFormationIdentityCenterConfigurationRequest>;
export interface UpdateLakeFormationIdentityCenterConfigurationResponse {}
export const UpdateLakeFormationIdentityCenterConfigurationResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "UpdateLakeFormationIdentityCenterConfigurationResponse",
}) as any as S.Schema<UpdateLakeFormationIdentityCenterConfigurationResponse>;
export interface UpdateLFTagRequest {
  CatalogId?: string;
  TagKey: string;
  TagValuesToDelete?: string[];
  TagValuesToAdd?: string[];
}
export const UpdateLFTagRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    TagKey: S.String,
    TagValuesToDelete: S.optional(TagValueList),
    TagValuesToAdd: S.optional(TagValueList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateLFTag" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLFTagRequest",
}) as any as S.Schema<UpdateLFTagRequest>;
export interface UpdateLFTagResponse {}
export const UpdateLFTagResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateLFTagResponse",
}) as any as S.Schema<UpdateLFTagResponse>;
export interface UpdateLFTagExpressionRequest {
  Name: string;
  Description?: string;
  CatalogId?: string;
  Expression: LFTag[];
}
export const UpdateLFTagExpressionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    CatalogId: S.optional(S.String),
    Expression: Expression,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateLFTagExpression" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLFTagExpressionRequest",
}) as any as S.Schema<UpdateLFTagExpressionRequest>;
export interface UpdateLFTagExpressionResponse {}
export const UpdateLFTagExpressionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLFTagExpressionResponse",
}) as any as S.Schema<UpdateLFTagExpressionResponse>;
export interface UpdateResourceRequest {
  RoleArn: string;
  ResourceArn: string;
  WithFederation?: boolean;
  HybridAccessEnabled?: boolean;
}
export const UpdateResourceRequest = S.suspend(() =>
  S.Struct({
    RoleArn: S.String,
    ResourceArn: S.String,
    WithFederation: S.optional(S.Boolean),
    HybridAccessEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourceRequest",
}) as any as S.Schema<UpdateResourceRequest>;
export interface UpdateResourceResponse {}
export const UpdateResourceResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateResourceResponse" },
) as any as S.Schema<UpdateResourceResponse>;
export type ValueStringList = string[];
export const ValueStringList = S.Array(S.String);
export type FieldNameString = "RESOURCE_ARN" | "ROLE_ARN" | "LAST_MODIFIED";
export const FieldNameString = S.Literal(
  "RESOURCE_ARN",
  "ROLE_ARN",
  "LAST_MODIFIED",
);
export type ComparisonOperator =
  | "EQ"
  | "NE"
  | "LE"
  | "LT"
  | "GE"
  | "GT"
  | "CONTAINS"
  | "NOT_CONTAINS"
  | "BEGINS_WITH"
  | "IN"
  | "BETWEEN";
export const ComparisonOperator = S.Literal(
  "EQ",
  "NE",
  "LE",
  "LT",
  "GE",
  "GT",
  "CONTAINS",
  "NOT_CONTAINS",
  "BEGINS_WITH",
  "IN",
  "BETWEEN",
);
export type StringValueList = string[];
export const StringValueList = S.Array(S.String);
export type TrustedResourceOwners = string[];
export const TrustedResourceOwners = S.Array(S.String);
export type AuthorizedSessionTagValueList = string[];
export const AuthorizedSessionTagValueList = S.Array(S.String);
export type TransactionStatus =
  | "ACTIVE"
  | "COMMITTED"
  | "ABORTED"
  | "COMMIT_IN_PROGRESS";
export const TransactionStatus = S.Literal(
  "ACTIVE",
  "COMMITTED",
  "ABORTED",
  "COMMIT_IN_PROGRESS",
);
export interface VirtualObject {
  Uri: string;
  ETag?: string;
}
export const VirtualObject = S.suspend(() =>
  S.Struct({ Uri: S.String, ETag: S.optional(S.String) }),
).annotations({
  identifier: "VirtualObject",
}) as any as S.Schema<VirtualObject>;
export type VirtualObjectList = VirtualObject[];
export const VirtualObjectList = S.Array(VirtualObject);
export type QueryStateString =
  | "PENDING"
  | "WORKUNITS_AVAILABLE"
  | "ERROR"
  | "FINISHED"
  | "EXPIRED";
export const QueryStateString = S.Literal(
  "PENDING",
  "WORKUNITS_AVAILABLE",
  "ERROR",
  "FINISHED",
  "EXPIRED",
);
export interface PartitionValueList {
  Values: string[];
}
export const PartitionValueList = S.suspend(() =>
  S.Struct({ Values: ValueStringList }),
).annotations({
  identifier: "PartitionValueList",
}) as any as S.Schema<PartitionValueList>;
export interface AuditContext {
  AdditionalAuditContext?: string;
}
export const AuditContext = S.suspend(() =>
  S.Struct({ AdditionalAuditContext: S.optional(S.String) }),
).annotations({ identifier: "AuditContext" }) as any as S.Schema<AuditContext>;
export interface FilterCondition {
  Field?: FieldNameString;
  ComparisonOperator?: ComparisonOperator;
  StringValueList?: string[];
}
export const FilterCondition = S.suspend(() =>
  S.Struct({
    Field: S.optional(FieldNameString),
    ComparisonOperator: S.optional(ComparisonOperator),
    StringValueList: S.optional(StringValueList),
  }),
).annotations({
  identifier: "FilterCondition",
}) as any as S.Schema<FilterCondition>;
export type FilterConditionList = FilterCondition[];
export const FilterConditionList = S.Array(FilterCondition);
export interface TransactionDescription {
  TransactionId?: string;
  TransactionStatus?: TransactionStatus;
  TransactionStartTime?: Date;
  TransactionEndTime?: Date;
}
export const TransactionDescription = S.suspend(() =>
  S.Struct({
    TransactionId: S.optional(S.String),
    TransactionStatus: S.optional(TransactionStatus),
    TransactionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TransactionEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "TransactionDescription",
}) as any as S.Schema<TransactionDescription>;
export type TransactionDescriptionList = TransactionDescription[];
export const TransactionDescriptionList = S.Array(TransactionDescription);
export type PartitionValuesList = string[];
export const PartitionValuesList = S.Array(S.String);
export interface AssumeDecoratedRoleWithSAMLResponse {
  AccessKeyId?: string;
  SecretAccessKey?: string;
  SessionToken?: string;
  Expiration?: Date;
}
export const AssumeDecoratedRoleWithSAMLResponse = S.suspend(() =>
  S.Struct({
    AccessKeyId: S.optional(S.String),
    SecretAccessKey: S.optional(S.String),
    SessionToken: S.optional(S.String),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AssumeDecoratedRoleWithSAMLResponse",
}) as any as S.Schema<AssumeDecoratedRoleWithSAMLResponse>;
export interface BatchGrantPermissionsRequest {
  CatalogId?: string;
  Entries: BatchPermissionsRequestEntry[];
}
export const BatchGrantPermissionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Entries: BatchPermissionsRequestEntryList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchGrantPermissions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGrantPermissionsRequest",
}) as any as S.Schema<BatchGrantPermissionsRequest>;
export interface CommitTransactionResponse {
  TransactionStatus?: TransactionStatus;
}
export const CommitTransactionResponse = S.suspend(() =>
  S.Struct({ TransactionStatus: S.optional(TransactionStatus) }),
).annotations({
  identifier: "CommitTransactionResponse",
}) as any as S.Schema<CommitTransactionResponse>;
export interface CreateLakeFormationOptInRequest {
  Principal: DataLakePrincipal;
  Resource: Resource;
  Condition?: Condition;
}
export const CreateLakeFormationOptInRequest = S.suspend(() =>
  S.Struct({
    Principal: DataLakePrincipal,
    Resource: Resource,
    Condition: S.optional(Condition),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateLakeFormationOptIn" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLakeFormationOptInRequest",
}) as any as S.Schema<CreateLakeFormationOptInRequest>;
export interface CreateLakeFormationOptInResponse {}
export const CreateLakeFormationOptInResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateLakeFormationOptInResponse",
}) as any as S.Schema<CreateLakeFormationOptInResponse>;
export interface CreateLFTagExpressionRequest {
  Name: string;
  Description?: string;
  CatalogId?: string;
  Expression: LFTag[];
}
export const CreateLFTagExpressionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    CatalogId: S.optional(S.String),
    Expression: Expression,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateLFTagExpression" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLFTagExpressionRequest",
}) as any as S.Schema<CreateLFTagExpressionRequest>;
export interface CreateLFTagExpressionResponse {}
export const CreateLFTagExpressionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateLFTagExpressionResponse",
}) as any as S.Schema<CreateLFTagExpressionResponse>;
export interface DeleteObjectsOnCancelRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  TransactionId: string;
  Objects: VirtualObject[];
}
export const DeleteObjectsOnCancelRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    TransactionId: S.String,
    Objects: VirtualObjectList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteObjectsOnCancel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteObjectsOnCancelRequest",
}) as any as S.Schema<DeleteObjectsOnCancelRequest>;
export interface DeleteObjectsOnCancelResponse {}
export const DeleteObjectsOnCancelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteObjectsOnCancelResponse",
}) as any as S.Schema<DeleteObjectsOnCancelResponse>;
export interface DescribeLakeFormationIdentityCenterConfigurationResponse {
  CatalogId?: string;
  InstanceArn?: string;
  ApplicationArn?: string;
  ExternalFiltering?: ExternalFilteringConfiguration;
  ShareRecipients?: DataLakePrincipal[];
  ServiceIntegrations?: ServiceIntegrationUnion[];
  ResourceShare?: string;
}
export const DescribeLakeFormationIdentityCenterConfigurationResponse =
  S.suspend(() =>
    S.Struct({
      CatalogId: S.optional(S.String),
      InstanceArn: S.optional(S.String),
      ApplicationArn: S.optional(S.String),
      ExternalFiltering: S.optional(ExternalFilteringConfiguration),
      ShareRecipients: S.optional(DataLakePrincipalList),
      ServiceIntegrations: S.optional(ServiceIntegrationList),
      ResourceShare: S.optional(S.String),
    }),
  ).annotations({
    identifier: "DescribeLakeFormationIdentityCenterConfigurationResponse",
  }) as any as S.Schema<DescribeLakeFormationIdentityCenterConfigurationResponse>;
export interface GetDataCellsFilterResponse {
  DataCellsFilter?: DataCellsFilter;
}
export const GetDataCellsFilterResponse = S.suspend(() =>
  S.Struct({ DataCellsFilter: S.optional(DataCellsFilter) }),
).annotations({
  identifier: "GetDataCellsFilterResponse",
}) as any as S.Schema<GetDataCellsFilterResponse>;
export interface PrincipalPermissions {
  Principal?: DataLakePrincipal;
  Permissions?: Permission[];
}
export const PrincipalPermissions = S.suspend(() =>
  S.Struct({
    Principal: S.optional(DataLakePrincipal),
    Permissions: S.optional(PermissionList),
  }),
).annotations({
  identifier: "PrincipalPermissions",
}) as any as S.Schema<PrincipalPermissions>;
export type PrincipalPermissionsList = PrincipalPermissions[];
export const PrincipalPermissionsList = S.Array(PrincipalPermissions);
export type ParametersMap = { [key: string]: string };
export const ParametersMap = S.Record({ key: S.String, value: S.String });
export interface DataLakeSettings {
  DataLakeAdmins?: DataLakePrincipal[];
  ReadOnlyAdmins?: DataLakePrincipal[];
  CreateDatabaseDefaultPermissions?: PrincipalPermissions[];
  CreateTableDefaultPermissions?: PrincipalPermissions[];
  Parameters?: { [key: string]: string };
  TrustedResourceOwners?: string[];
  AllowExternalDataFiltering?: boolean;
  AllowFullTableExternalDataAccess?: boolean;
  ExternalDataFilteringAllowList?: DataLakePrincipal[];
  AuthorizedSessionTagValueList?: string[];
}
export const DataLakeSettings = S.suspend(() =>
  S.Struct({
    DataLakeAdmins: S.optional(DataLakePrincipalList),
    ReadOnlyAdmins: S.optional(DataLakePrincipalList),
    CreateDatabaseDefaultPermissions: S.optional(PrincipalPermissionsList),
    CreateTableDefaultPermissions: S.optional(PrincipalPermissionsList),
    Parameters: S.optional(ParametersMap),
    TrustedResourceOwners: S.optional(TrustedResourceOwners),
    AllowExternalDataFiltering: S.optional(S.Boolean),
    AllowFullTableExternalDataAccess: S.optional(S.Boolean),
    ExternalDataFilteringAllowList: S.optional(DataLakePrincipalList),
    AuthorizedSessionTagValueList: S.optional(AuthorizedSessionTagValueList),
  }),
).annotations({
  identifier: "DataLakeSettings",
}) as any as S.Schema<DataLakeSettings>;
export interface GetDataLakeSettingsResponse {
  DataLakeSettings?: DataLakeSettings;
}
export const GetDataLakeSettingsResponse = S.suspend(() =>
  S.Struct({ DataLakeSettings: S.optional(DataLakeSettings) }),
).annotations({
  identifier: "GetDataLakeSettingsResponse",
}) as any as S.Schema<GetDataLakeSettingsResponse>;
export interface GetLFTagResponse {
  CatalogId?: string;
  TagKey?: string;
  TagValues?: string[];
}
export const GetLFTagResponse = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    TagKey: S.optional(S.String),
    TagValues: S.optional(TagValueList),
  }),
).annotations({
  identifier: "GetLFTagResponse",
}) as any as S.Schema<GetLFTagResponse>;
export interface GetLFTagExpressionResponse {
  Name?: string;
  Description?: string;
  CatalogId?: string;
  Expression?: LFTag[];
}
export const GetLFTagExpressionResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CatalogId: S.optional(S.String),
    Expression: S.optional(Expression),
  }),
).annotations({
  identifier: "GetLFTagExpressionResponse",
}) as any as S.Schema<GetLFTagExpressionResponse>;
export interface GetQueryStateResponse {
  Error?: string;
  State: QueryStateString;
}
export const GetQueryStateResponse = S.suspend(() =>
  S.Struct({ Error: S.optional(S.String), State: QueryStateString }),
).annotations({
  identifier: "GetQueryStateResponse",
}) as any as S.Schema<GetQueryStateResponse>;
export interface GetTemporaryGluePartitionCredentialsRequest {
  TableArn: string;
  Partition: PartitionValueList;
  Permissions?: Permission[];
  DurationSeconds?: number;
  AuditContext?: AuditContext;
  SupportedPermissionTypes?: PermissionType[];
}
export const GetTemporaryGluePartitionCredentialsRequest = S.suspend(() =>
  S.Struct({
    TableArn: S.String,
    Partition: PartitionValueList,
    Permissions: S.optional(PermissionList),
    DurationSeconds: S.optional(S.Number),
    AuditContext: S.optional(AuditContext),
    SupportedPermissionTypes: S.optional(PermissionTypeList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTemporaryGluePartitionCredentials" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTemporaryGluePartitionCredentialsRequest",
}) as any as S.Schema<GetTemporaryGluePartitionCredentialsRequest>;
export interface GetWorkUnitResultsResponse {
  ResultStream?: T.StreamingOutputBody;
}
export const GetWorkUnitResultsResponse = S.suspend(() =>
  S.Struct({
    ResultStream: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetWorkUnitResultsResponse",
}) as any as S.Schema<GetWorkUnitResultsResponse>;
export interface ListDataCellsFilterRequest {
  Table?: TableResource;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDataCellsFilterRequest = S.suspend(() =>
  S.Struct({
    Table: S.optional(TableResource),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListDataCellsFilter" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataCellsFilterRequest",
}) as any as S.Schema<ListDataCellsFilterRequest>;
export interface ListLFTagsResponse {
  LFTags?: LFTagPair[];
  NextToken?: string;
}
export const ListLFTagsResponse = S.suspend(() =>
  S.Struct({ LFTags: S.optional(LFTagsList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListLFTagsResponse",
}) as any as S.Schema<ListLFTagsResponse>;
export type ResourceShareList = string[];
export const ResourceShareList = S.Array(S.String);
export interface DetailsMap {
  ResourceShare?: string[];
}
export const DetailsMap = S.suspend(() =>
  S.Struct({ ResourceShare: S.optional(ResourceShareList) }),
).annotations({ identifier: "DetailsMap" }) as any as S.Schema<DetailsMap>;
export interface PrincipalResourcePermissions {
  Principal?: DataLakePrincipal;
  Resource?: Resource;
  Condition?: Condition;
  Permissions?: Permission[];
  PermissionsWithGrantOption?: Permission[];
  AdditionalDetails?: DetailsMap;
  LastUpdated?: Date;
  LastUpdatedBy?: string;
}
export const PrincipalResourcePermissions = S.suspend(() =>
  S.Struct({
    Principal: S.optional(DataLakePrincipal),
    Resource: S.optional(Resource),
    Condition: S.optional(Condition),
    Permissions: S.optional(PermissionList),
    PermissionsWithGrantOption: S.optional(PermissionList),
    AdditionalDetails: S.optional(DetailsMap),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "PrincipalResourcePermissions",
}) as any as S.Schema<PrincipalResourcePermissions>;
export type PrincipalResourcePermissionsList = PrincipalResourcePermissions[];
export const PrincipalResourcePermissionsList = S.Array(
  PrincipalResourcePermissions,
);
export interface ListPermissionsResponse {
  PrincipalResourcePermissions?: PrincipalResourcePermissions[];
  NextToken?: string;
}
export const ListPermissionsResponse = S.suspend(() =>
  S.Struct({
    PrincipalResourcePermissions: S.optional(PrincipalResourcePermissionsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPermissionsResponse",
}) as any as S.Schema<ListPermissionsResponse>;
export interface ListResourcesRequest {
  FilterConditionList?: FilterCondition[];
  MaxResults?: number;
  NextToken?: string;
}
export const ListResourcesRequest = S.suspend(() =>
  S.Struct({
    FilterConditionList: S.optional(FilterConditionList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListResources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourcesRequest",
}) as any as S.Schema<ListResourcesRequest>;
export interface ListTransactionsResponse {
  Transactions?: TransactionDescription[];
  NextToken?: string;
}
export const ListTransactionsResponse = S.suspend(() =>
  S.Struct({
    Transactions: S.optional(TransactionDescriptionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTransactionsResponse",
}) as any as S.Schema<ListTransactionsResponse>;
export interface StartTransactionResponse {
  TransactionId?: string;
}
export const StartTransactionResponse = S.suspend(() =>
  S.Struct({ TransactionId: S.optional(S.String) }),
).annotations({
  identifier: "StartTransactionResponse",
}) as any as S.Schema<StartTransactionResponse>;
export type AdditionalContextMap = { [key: string]: string };
export const AdditionalContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export type QueryParameterMap = { [key: string]: string };
export const QueryParameterMap = S.Record({ key: S.String, value: S.String });
export interface AddObjectInput {
  Uri: string;
  ETag: string;
  Size: number;
  PartitionValues?: string[];
}
export const AddObjectInput = S.suspend(() =>
  S.Struct({
    Uri: S.String,
    ETag: S.String,
    Size: S.Number,
    PartitionValues: S.optional(PartitionValuesList),
  }),
).annotations({
  identifier: "AddObjectInput",
}) as any as S.Schema<AddObjectInput>;
export interface DeleteObjectInput {
  Uri: string;
  ETag?: string;
  PartitionValues?: string[];
}
export const DeleteObjectInput = S.suspend(() =>
  S.Struct({
    Uri: S.String,
    ETag: S.optional(S.String),
    PartitionValues: S.optional(PartitionValuesList),
  }),
).annotations({
  identifier: "DeleteObjectInput",
}) as any as S.Schema<DeleteObjectInput>;
export type StorageOptimizerConfig = { [key: string]: string };
export const StorageOptimizerConfig = S.Record({
  key: S.String,
  value: S.String,
});
export interface ResourceInfo {
  ResourceArn?: string;
  RoleArn?: string;
  LastModified?: Date;
  WithFederation?: boolean;
  HybridAccessEnabled?: boolean;
  WithPrivilegedAccess?: boolean;
}
export const ResourceInfo = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    RoleArn: S.optional(S.String),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    WithFederation: S.optional(S.Boolean),
    HybridAccessEnabled: S.optional(S.Boolean),
    WithPrivilegedAccess: S.optional(S.Boolean),
  }),
).annotations({ identifier: "ResourceInfo" }) as any as S.Schema<ResourceInfo>;
export interface ExecutionStatistics {
  AverageExecutionTimeMillis?: number;
  DataScannedBytes?: number;
  WorkUnitsExecutedCount?: number;
}
export const ExecutionStatistics = S.suspend(() =>
  S.Struct({
    AverageExecutionTimeMillis: S.optional(S.Number),
    DataScannedBytes: S.optional(S.Number),
    WorkUnitsExecutedCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExecutionStatistics",
}) as any as S.Schema<ExecutionStatistics>;
export interface PlanningStatistics {
  EstimatedDataToScanBytes?: number;
  PlanningTimeMillis?: number;
  QueueTimeMillis?: number;
  WorkUnitsGeneratedCount?: number;
}
export const PlanningStatistics = S.suspend(() =>
  S.Struct({
    EstimatedDataToScanBytes: S.optional(S.Number),
    PlanningTimeMillis: S.optional(S.Number),
    QueueTimeMillis: S.optional(S.Number),
    WorkUnitsGeneratedCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "PlanningStatistics",
}) as any as S.Schema<PlanningStatistics>;
export interface ColumnLFTag {
  Name?: string;
  LFTags?: LFTagPair[];
}
export const ColumnLFTag = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), LFTags: S.optional(LFTagsList) }),
).annotations({ identifier: "ColumnLFTag" }) as any as S.Schema<ColumnLFTag>;
export type ColumnLFTagsList = ColumnLFTag[];
export const ColumnLFTagsList = S.Array(ColumnLFTag);
export interface QuerySessionContext {
  QueryId?: string;
  QueryStartTime?: Date;
  ClusterId?: string;
  QueryAuthorizationId?: string;
  AdditionalContext?: { [key: string]: string };
}
export const QuerySessionContext = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    QueryStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ClusterId: S.optional(S.String),
    QueryAuthorizationId: S.optional(S.String),
    AdditionalContext: S.optional(AdditionalContextMap),
  }),
).annotations({
  identifier: "QuerySessionContext",
}) as any as S.Schema<QuerySessionContext>;
export interface WorkUnitRange {
  WorkUnitIdMax: number;
  WorkUnitIdMin: number;
  WorkUnitToken: string;
}
export const WorkUnitRange = S.suspend(() =>
  S.Struct({
    WorkUnitIdMax: S.Number,
    WorkUnitIdMin: S.Number,
    WorkUnitToken: S.String,
  }),
).annotations({
  identifier: "WorkUnitRange",
}) as any as S.Schema<WorkUnitRange>;
export type WorkUnitRangeList = WorkUnitRange[];
export const WorkUnitRangeList = S.Array(WorkUnitRange);
export type DataCellsFilterList = DataCellsFilter[];
export const DataCellsFilterList = S.Array(DataCellsFilter);
export interface LakeFormationOptInsInfo {
  Resource?: Resource;
  Principal?: DataLakePrincipal;
  Condition?: Condition;
  LastModified?: Date;
  LastUpdatedBy?: string;
}
export const LakeFormationOptInsInfo = S.suspend(() =>
  S.Struct({
    Resource: S.optional(Resource),
    Principal: S.optional(DataLakePrincipal),
    Condition: S.optional(Condition),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "LakeFormationOptInsInfo",
}) as any as S.Schema<LakeFormationOptInsInfo>;
export type LakeFormationOptInsInfoList = LakeFormationOptInsInfo[];
export const LakeFormationOptInsInfoList = S.Array(LakeFormationOptInsInfo);
export interface LFTagExpression {
  Name?: string;
  Description?: string;
  CatalogId?: string;
  Expression?: LFTag[];
}
export const LFTagExpression = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CatalogId: S.optional(S.String),
    Expression: S.optional(Expression),
  }),
).annotations({
  identifier: "LFTagExpression",
}) as any as S.Schema<LFTagExpression>;
export type LFTagExpressionsList = LFTagExpression[];
export const LFTagExpressionsList = S.Array(LFTagExpression);
export type ResourceInfoList = ResourceInfo[];
export const ResourceInfoList = S.Array(ResourceInfo);
export interface StorageOptimizer {
  StorageOptimizerType?: OptimizerType;
  Config?: { [key: string]: string };
  ErrorMessage?: string;
  Warnings?: string;
  LastRunDetails?: string;
}
export const StorageOptimizer = S.suspend(() =>
  S.Struct({
    StorageOptimizerType: S.optional(OptimizerType),
    Config: S.optional(StorageOptimizerConfig),
    ErrorMessage: S.optional(S.String),
    Warnings: S.optional(S.String),
    LastRunDetails: S.optional(S.String),
  }),
).annotations({
  identifier: "StorageOptimizer",
}) as any as S.Schema<StorageOptimizer>;
export type StorageOptimizerList = StorageOptimizer[];
export const StorageOptimizerList = S.Array(StorageOptimizer);
export interface ErrorDetail {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export interface LFTagError {
  LFTag?: LFTagPair;
  Error?: ErrorDetail;
}
export const LFTagError = S.suspend(() =>
  S.Struct({ LFTag: S.optional(LFTagPair), Error: S.optional(ErrorDetail) }),
).annotations({ identifier: "LFTagError" }) as any as S.Schema<LFTagError>;
export type LFTagErrors = LFTagError[];
export const LFTagErrors = S.Array(LFTagError);
export interface TaggedDatabase {
  Database?: DatabaseResource;
  LFTags?: LFTagPair[];
}
export const TaggedDatabase = S.suspend(() =>
  S.Struct({
    Database: S.optional(DatabaseResource),
    LFTags: S.optional(LFTagsList),
  }),
).annotations({
  identifier: "TaggedDatabase",
}) as any as S.Schema<TaggedDatabase>;
export type DatabaseLFTagsList = TaggedDatabase[];
export const DatabaseLFTagsList = S.Array(TaggedDatabase);
export interface TaggedTable {
  Table?: TableResource;
  LFTagOnDatabase?: LFTagPair[];
  LFTagsOnTable?: LFTagPair[];
  LFTagsOnColumns?: ColumnLFTag[];
}
export const TaggedTable = S.suspend(() =>
  S.Struct({
    Table: S.optional(TableResource),
    LFTagOnDatabase: S.optional(LFTagsList),
    LFTagsOnTable: S.optional(LFTagsList),
    LFTagsOnColumns: S.optional(ColumnLFTagsList),
  }),
).annotations({ identifier: "TaggedTable" }) as any as S.Schema<TaggedTable>;
export type TableLFTagsList = TaggedTable[];
export const TableLFTagsList = S.Array(TaggedTable);
export interface QueryPlanningContext {
  CatalogId?: string;
  DatabaseName: string;
  QueryAsOfTime?: Date;
  QueryParameters?: { [key: string]: string };
  TransactionId?: string;
}
export const QueryPlanningContext = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    QueryAsOfTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    QueryParameters: S.optional(QueryParameterMap),
    TransactionId: S.optional(S.String),
  }),
).annotations({
  identifier: "QueryPlanningContext",
}) as any as S.Schema<QueryPlanningContext>;
export interface WriteOperation {
  AddObject?: AddObjectInput;
  DeleteObject?: DeleteObjectInput;
}
export const WriteOperation = S.suspend(() =>
  S.Struct({
    AddObject: S.optional(AddObjectInput),
    DeleteObject: S.optional(DeleteObjectInput),
  }),
).annotations({
  identifier: "WriteOperation",
}) as any as S.Schema<WriteOperation>;
export type WriteOperationList = WriteOperation[];
export const WriteOperationList = S.Array(WriteOperation);
export type StorageOptimizerConfigMap = {
  [key in OptimizerType]?: { [key: string]: string };
};
export const StorageOptimizerConfigMap = S.partial(
  S.Record({ key: OptimizerType, value: StorageOptimizerConfig }),
);
export interface AddLFTagsToResourceRequest {
  CatalogId?: string;
  Resource: Resource;
  LFTags: LFTagPair[];
}
export const AddLFTagsToResourceRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Resource: Resource,
    LFTags: LFTagsList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AddLFTagsToResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddLFTagsToResourceRequest",
}) as any as S.Schema<AddLFTagsToResourceRequest>;
export interface BatchPermissionsFailureEntry {
  RequestEntry?: BatchPermissionsRequestEntry;
  Error?: ErrorDetail;
}
export const BatchPermissionsFailureEntry = S.suspend(() =>
  S.Struct({
    RequestEntry: S.optional(BatchPermissionsRequestEntry),
    Error: S.optional(ErrorDetail),
  }),
).annotations({
  identifier: "BatchPermissionsFailureEntry",
}) as any as S.Schema<BatchPermissionsFailureEntry>;
export type BatchPermissionsFailureList = BatchPermissionsFailureEntry[];
export const BatchPermissionsFailureList = S.Array(
  BatchPermissionsFailureEntry,
);
export interface BatchGrantPermissionsResponse {
  Failures?: BatchPermissionsFailureEntry[];
}
export const BatchGrantPermissionsResponse = S.suspend(() =>
  S.Struct({ Failures: S.optional(BatchPermissionsFailureList) }),
).annotations({
  identifier: "BatchGrantPermissionsResponse",
}) as any as S.Schema<BatchGrantPermissionsResponse>;
export interface CreateDataCellsFilterRequest {
  TableData: DataCellsFilter;
}
export const CreateDataCellsFilterRequest = S.suspend(() =>
  S.Struct({ TableData: DataCellsFilter }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateDataCellsFilter" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataCellsFilterRequest",
}) as any as S.Schema<CreateDataCellsFilterRequest>;
export interface CreateDataCellsFilterResponse {}
export const CreateDataCellsFilterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateDataCellsFilterResponse",
}) as any as S.Schema<CreateDataCellsFilterResponse>;
export interface DescribeResourceResponse {
  ResourceInfo?: ResourceInfo;
}
export const DescribeResourceResponse = S.suspend(() =>
  S.Struct({ ResourceInfo: S.optional(ResourceInfo) }),
).annotations({
  identifier: "DescribeResourceResponse",
}) as any as S.Schema<DescribeResourceResponse>;
export interface DescribeTransactionResponse {
  TransactionDescription?: TransactionDescription;
}
export const DescribeTransactionResponse = S.suspend(() =>
  S.Struct({ TransactionDescription: S.optional(TransactionDescription) }),
).annotations({
  identifier: "DescribeTransactionResponse",
}) as any as S.Schema<DescribeTransactionResponse>;
export interface GetQueryStatisticsResponse {
  ExecutionStatistics?: ExecutionStatistics;
  PlanningStatistics?: PlanningStatistics;
  QuerySubmissionTime?: Date;
}
export const GetQueryStatisticsResponse = S.suspend(() =>
  S.Struct({
    ExecutionStatistics: S.optional(ExecutionStatistics),
    PlanningStatistics: S.optional(PlanningStatistics),
    QuerySubmissionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "GetQueryStatisticsResponse",
}) as any as S.Schema<GetQueryStatisticsResponse>;
export interface GetResourceLFTagsResponse {
  LFTagOnDatabase?: LFTagPair[];
  LFTagsOnTable?: LFTagPair[];
  LFTagsOnColumns?: ColumnLFTag[];
}
export const GetResourceLFTagsResponse = S.suspend(() =>
  S.Struct({
    LFTagOnDatabase: S.optional(LFTagsList),
    LFTagsOnTable: S.optional(LFTagsList),
    LFTagsOnColumns: S.optional(ColumnLFTagsList),
  }),
).annotations({
  identifier: "GetResourceLFTagsResponse",
}) as any as S.Schema<GetResourceLFTagsResponse>;
export interface GetTemporaryGluePartitionCredentialsResponse {
  AccessKeyId?: string;
  SecretAccessKey?: string;
  SessionToken?: string;
  Expiration?: Date;
}
export const GetTemporaryGluePartitionCredentialsResponse = S.suspend(() =>
  S.Struct({
    AccessKeyId: S.optional(S.String),
    SecretAccessKey: S.optional(S.String),
    SessionToken: S.optional(S.String),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetTemporaryGluePartitionCredentialsResponse",
}) as any as S.Schema<GetTemporaryGluePartitionCredentialsResponse>;
export interface GetTemporaryGlueTableCredentialsRequest {
  TableArn: string;
  Permissions?: Permission[];
  DurationSeconds?: number;
  AuditContext?: AuditContext;
  SupportedPermissionTypes?: PermissionType[];
  S3Path?: string;
  QuerySessionContext?: QuerySessionContext;
}
export const GetTemporaryGlueTableCredentialsRequest = S.suspend(() =>
  S.Struct({
    TableArn: S.String,
    Permissions: S.optional(PermissionList),
    DurationSeconds: S.optional(S.Number),
    AuditContext: S.optional(AuditContext),
    SupportedPermissionTypes: S.optional(PermissionTypeList),
    S3Path: S.optional(S.String),
    QuerySessionContext: S.optional(QuerySessionContext),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTemporaryGlueTableCredentials" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTemporaryGlueTableCredentialsRequest",
}) as any as S.Schema<GetTemporaryGlueTableCredentialsRequest>;
export interface GetWorkUnitsResponse {
  NextToken?: string;
  QueryId: string;
  WorkUnitRanges: WorkUnitRange[];
}
export const GetWorkUnitsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    QueryId: S.String,
    WorkUnitRanges: WorkUnitRangeList,
  }),
).annotations({
  identifier: "GetWorkUnitsResponse",
}) as any as S.Schema<GetWorkUnitsResponse>;
export interface ListDataCellsFilterResponse {
  DataCellsFilters?: DataCellsFilter[];
  NextToken?: string;
}
export const ListDataCellsFilterResponse = S.suspend(() =>
  S.Struct({
    DataCellsFilters: S.optional(DataCellsFilterList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataCellsFilterResponse",
}) as any as S.Schema<ListDataCellsFilterResponse>;
export interface ListLakeFormationOptInsResponse {
  LakeFormationOptInsInfoList?: LakeFormationOptInsInfo[];
  NextToken?: string;
}
export const ListLakeFormationOptInsResponse = S.suspend(() =>
  S.Struct({
    LakeFormationOptInsInfoList: S.optional(LakeFormationOptInsInfoList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLakeFormationOptInsResponse",
}) as any as S.Schema<ListLakeFormationOptInsResponse>;
export interface ListLFTagExpressionsResponse {
  LFTagExpressions?: LFTagExpression[];
  NextToken?: string;
}
export const ListLFTagExpressionsResponse = S.suspend(() =>
  S.Struct({
    LFTagExpressions: S.optional(LFTagExpressionsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLFTagExpressionsResponse",
}) as any as S.Schema<ListLFTagExpressionsResponse>;
export interface ListResourcesResponse {
  ResourceInfoList?: ResourceInfo[];
  NextToken?: string;
}
export const ListResourcesResponse = S.suspend(() =>
  S.Struct({
    ResourceInfoList: S.optional(ResourceInfoList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourcesResponse",
}) as any as S.Schema<ListResourcesResponse>;
export interface ListTableStorageOptimizersResponse {
  StorageOptimizerList?: StorageOptimizer[];
  NextToken?: string;
}
export const ListTableStorageOptimizersResponse = S.suspend(() =>
  S.Struct({
    StorageOptimizerList: S.optional(StorageOptimizerList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTableStorageOptimizersResponse",
}) as any as S.Schema<ListTableStorageOptimizersResponse>;
export interface PutDataLakeSettingsRequest {
  CatalogId?: string;
  DataLakeSettings: DataLakeSettings;
}
export const PutDataLakeSettingsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DataLakeSettings: DataLakeSettings,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutDataLakeSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDataLakeSettingsRequest",
}) as any as S.Schema<PutDataLakeSettingsRequest>;
export interface PutDataLakeSettingsResponse {}
export const PutDataLakeSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutDataLakeSettingsResponse",
}) as any as S.Schema<PutDataLakeSettingsResponse>;
export interface RemoveLFTagsFromResourceResponse {
  Failures?: LFTagError[];
}
export const RemoveLFTagsFromResourceResponse = S.suspend(() =>
  S.Struct({ Failures: S.optional(LFTagErrors) }),
).annotations({
  identifier: "RemoveLFTagsFromResourceResponse",
}) as any as S.Schema<RemoveLFTagsFromResourceResponse>;
export interface SearchDatabasesByLFTagsResponse {
  NextToken?: string;
  DatabaseList?: TaggedDatabase[];
}
export const SearchDatabasesByLFTagsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DatabaseList: S.optional(DatabaseLFTagsList),
  }),
).annotations({
  identifier: "SearchDatabasesByLFTagsResponse",
}) as any as S.Schema<SearchDatabasesByLFTagsResponse>;
export interface SearchTablesByLFTagsResponse {
  NextToken?: string;
  TableList?: TaggedTable[];
}
export const SearchTablesByLFTagsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    TableList: S.optional(TableLFTagsList),
  }),
).annotations({
  identifier: "SearchTablesByLFTagsResponse",
}) as any as S.Schema<SearchTablesByLFTagsResponse>;
export interface StartQueryPlanningRequest {
  QueryPlanningContext: QueryPlanningContext;
  QueryString: string | redacted.Redacted<string>;
}
export const StartQueryPlanningRequest = S.suspend(() =>
  S.Struct({
    QueryPlanningContext: QueryPlanningContext,
    QueryString: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartQueryPlanning" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartQueryPlanningRequest",
}) as any as S.Schema<StartQueryPlanningRequest>;
export interface UpdateTableObjectsRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  TransactionId?: string;
  WriteOperations: WriteOperation[];
}
export const UpdateTableObjectsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    TransactionId: S.optional(S.String),
    WriteOperations: WriteOperationList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateTableObjects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTableObjectsRequest",
}) as any as S.Schema<UpdateTableObjectsRequest>;
export interface UpdateTableObjectsResponse {}
export const UpdateTableObjectsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTableObjectsResponse",
}) as any as S.Schema<UpdateTableObjectsResponse>;
export interface UpdateTableStorageOptimizerRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  StorageOptimizerConfig: { [key: string]: { [key: string]: string } };
}
export const UpdateTableStorageOptimizerRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    StorageOptimizerConfig: StorageOptimizerConfigMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateTableStorageOptimizer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTableStorageOptimizerRequest",
}) as any as S.Schema<UpdateTableStorageOptimizerRequest>;
export interface TableObject {
  Uri?: string;
  ETag?: string;
  Size?: number;
}
export const TableObject = S.suspend(() =>
  S.Struct({
    Uri: S.optional(S.String),
    ETag: S.optional(S.String),
    Size: S.optional(S.Number),
  }),
).annotations({ identifier: "TableObject" }) as any as S.Schema<TableObject>;
export type TableObjectList = TableObject[];
export const TableObjectList = S.Array(TableObject);
export interface PartitionObjects {
  PartitionValues?: string[];
  Objects?: TableObject[];
}
export const PartitionObjects = S.suspend(() =>
  S.Struct({
    PartitionValues: S.optional(PartitionValuesList),
    Objects: S.optional(TableObjectList),
  }),
).annotations({
  identifier: "PartitionObjects",
}) as any as S.Schema<PartitionObjects>;
export type PartitionedTableObjectsList = PartitionObjects[];
export const PartitionedTableObjectsList = S.Array(PartitionObjects);
export type PathStringList = string[];
export const PathStringList = S.Array(S.String);
export interface AddLFTagsToResourceResponse {
  Failures?: LFTagError[];
}
export const AddLFTagsToResourceResponse = S.suspend(() =>
  S.Struct({ Failures: S.optional(LFTagErrors) }),
).annotations({
  identifier: "AddLFTagsToResourceResponse",
}) as any as S.Schema<AddLFTagsToResourceResponse>;
export interface BatchRevokePermissionsResponse {
  Failures?: BatchPermissionsFailureEntry[];
}
export const BatchRevokePermissionsResponse = S.suspend(() =>
  S.Struct({ Failures: S.optional(BatchPermissionsFailureList) }),
).annotations({
  identifier: "BatchRevokePermissionsResponse",
}) as any as S.Schema<BatchRevokePermissionsResponse>;
export interface CreateLakeFormationIdentityCenterConfigurationRequest {
  CatalogId?: string;
  InstanceArn?: string;
  ExternalFiltering?: ExternalFilteringConfiguration;
  ShareRecipients?: DataLakePrincipal[];
  ServiceIntegrations?: ServiceIntegrationUnion[];
}
export const CreateLakeFormationIdentityCenterConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      CatalogId: S.optional(S.String),
      InstanceArn: S.optional(S.String),
      ExternalFiltering: S.optional(ExternalFilteringConfiguration),
      ShareRecipients: S.optional(DataLakePrincipalList),
      ServiceIntegrations: S.optional(ServiceIntegrationList),
    }).pipe(
      T.all(
        T.Http({
          method: "POST",
          uri: "/CreateLakeFormationIdentityCenterConfiguration",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "CreateLakeFormationIdentityCenterConfigurationRequest",
}) as any as S.Schema<CreateLakeFormationIdentityCenterConfigurationRequest>;
export interface GetEffectivePermissionsForPathResponse {
  Permissions?: PrincipalResourcePermissions[];
  NextToken?: string;
}
export const GetEffectivePermissionsForPathResponse = S.suspend(() =>
  S.Struct({
    Permissions: S.optional(PrincipalResourcePermissionsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEffectivePermissionsForPathResponse",
}) as any as S.Schema<GetEffectivePermissionsForPathResponse>;
export interface GetTableObjectsResponse {
  Objects?: PartitionObjects[];
  NextToken?: string;
}
export const GetTableObjectsResponse = S.suspend(() =>
  S.Struct({
    Objects: S.optional(PartitionedTableObjectsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTableObjectsResponse",
}) as any as S.Schema<GetTableObjectsResponse>;
export interface GetTemporaryGlueTableCredentialsResponse {
  AccessKeyId?: string;
  SecretAccessKey?: string;
  SessionToken?: string;
  Expiration?: Date;
  VendedS3Path?: string[];
}
export const GetTemporaryGlueTableCredentialsResponse = S.suspend(() =>
  S.Struct({
    AccessKeyId: S.optional(S.String),
    SecretAccessKey: S.optional(S.String),
    SessionToken: S.optional(S.String),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    VendedS3Path: S.optional(PathStringList),
  }),
).annotations({
  identifier: "GetTemporaryGlueTableCredentialsResponse",
}) as any as S.Schema<GetTemporaryGlueTableCredentialsResponse>;
export interface StartQueryPlanningResponse {
  QueryId: string;
}
export const StartQueryPlanningResponse = S.suspend(() =>
  S.Struct({ QueryId: S.String }),
).annotations({
  identifier: "StartQueryPlanningResponse",
}) as any as S.Schema<StartQueryPlanningResponse>;
export interface UpdateTableStorageOptimizerResponse {
  Result?: string;
}
export const UpdateTableStorageOptimizerResponse = S.suspend(() =>
  S.Struct({ Result: S.optional(S.String) }),
).annotations({
  identifier: "UpdateTableStorageOptimizerResponse",
}) as any as S.Schema<UpdateTableStorageOptimizerResponse>;
export interface CreateLakeFormationIdentityCenterConfigurationResponse {
  ApplicationArn?: string;
}
export const CreateLakeFormationIdentityCenterConfigurationResponse = S.suspend(
  () => S.Struct({ ApplicationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLakeFormationIdentityCenterConfigurationResponse",
}) as any as S.Schema<CreateLakeFormationIdentityCenterConfigurationResponse>;

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class EntityNotFoundException extends S.TaggedError<EntityNotFoundException>()(
  "EntityNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ExpiredException extends S.TaggedError<ExpiredException>()(
  "ExpiredException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { Message: S.optional(S.String) },
) {}
export class GlueEncryptionException extends S.TaggedError<GlueEncryptionException>()(
  "GlueEncryptionException",
  { Message: S.optional(S.String) },
) {}
export class OperationTimeoutException extends S.TaggedError<OperationTimeoutException>()(
  "OperationTimeoutException",
  { Message: S.optional(S.String) },
) {}
export class StatisticsNotReadyYetException extends S.TaggedError<StatisticsNotReadyYetException>()(
  "StatisticsNotReadyYetException",
  { Message: S.optional(S.String) },
) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  { Message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class WorkUnitsNotReadyYetException extends S.TaggedError<WorkUnitsNotReadyYetException>()(
  "WorkUnitsNotReadyYetException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNumberLimitExceededException extends S.TaggedError<ResourceNumberLimitExceededException>()(
  "ResourceNumberLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class TransactionCanceledException extends S.TaggedError<TransactionCanceledException>()(
  "TransactionCanceledException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TransactionCommitInProgressException extends S.TaggedError<TransactionCommitInProgressException>()(
  "TransactionCommitInProgressException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotReadyException extends S.TaggedError<ResourceNotReadyException>()(
  "ResourceNotReadyException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PermissionTypeMismatchException extends S.TaggedError<PermissionTypeMismatchException>()(
  "PermissionTypeMismatchException",
  { Message: S.optional(S.String) },
) {}
export class TransactionCommittedException extends S.TaggedError<TransactionCommittedException>()(
  "TransactionCommittedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Grants permissions to the principal to access metadata in the Data Catalog and data organized in underlying data storage such as Amazon S3.
 *
 * For information about permissions, see Security and Access Control to Metadata and Data.
 */
export const grantPermissions: (
  input: GrantPermissionsRequest,
) => effect.Effect<
  GrantPermissionsResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GrantPermissionsRequest,
  output: GrantPermissionsResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InvalidInputException,
  ],
}));
/**
 * Retrieves the list of the data lake administrators of a Lake Formation-managed data lake.
 */
export const getDataLakeSettings: (
  input: GetDataLakeSettingsRequest,
) => effect.Effect<
  GetDataLakeSettingsResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataLakeSettingsRequest,
  output: GetDataLakeSettingsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Returns the state of a query previously submitted. Clients are expected to poll `GetQueryState` to monitor the current state of the planning before retrieving the work units. A query state is only visible to the principal that made the initial call to `StartQueryPlanning`.
 */
export const getQueryState: (
  input: GetQueryStateRequest,
) => effect.Effect<
  GetQueryStateResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryStateRequest,
  output: GetQueryStateResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Revokes permissions to the principal to access metadata in the Data Catalog and data organized in underlying data storage such as Amazon S3.
 */
export const revokePermissions: (
  input: RevokePermissionsRequest,
) => effect.Effect<
  RevokePermissionsResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokePermissionsRequest,
  output: RevokePermissionsResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InvalidInputException,
  ],
}));
/**
 * Returns the configuration of all storage optimizers associated with a specified table.
 */
export const listTableStorageOptimizers: {
  (
    input: ListTableStorageOptimizersRequest,
  ): effect.Effect<
    ListTableStorageOptimizersResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTableStorageOptimizersRequest,
  ) => stream.Stream<
    ListTableStorageOptimizersResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTableStorageOptimizersRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTableStorageOptimizersRequest,
  output: ListTableStorageOptimizersResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Sets the list of data lake administrators who have admin privileges on all resources managed by Lake Formation. For more information on admin privileges, see Granting Lake Formation Permissions.
 *
 * This API replaces the current list of data lake admins with the new list being passed. To add an admin, fetch the current list and add the new admin to that list and pass that list in this API.
 */
export const putDataLakeSettings: (
  input: PutDataLakeSettingsRequest,
) => effect.Effect<
  PutDataLakeSettingsResponse,
  InternalServiceException | InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDataLakeSettingsRequest,
  output: PutDataLakeSettingsResponse,
  errors: [InternalServiceException, InvalidInputException],
}));
/**
 * Updates the configuration of the storage optimizers for a table.
 */
export const updateTableStorageOptimizer: (
  input: UpdateTableStorageOptimizerRequest,
) => effect.Effect<
  UpdateTableStorageOptimizerResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTableStorageOptimizerRequest,
  output: UpdateTableStorageOptimizerResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Removes an LF-tag from the resource. Only database, table, or tableWithColumns resource are allowed. To tag columns, use the column inclusion list in `tableWithColumns` to specify column input.
 */
export const removeLFTagsFromResource: (
  input: RemoveLFTagsFromResourceRequest,
) => effect.Effect<
  RemoveLFTagsFromResourceResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveLFTagsFromResourceRequest,
  output: RemoveLFTagsFromResourceResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * This operation allows a search on `DATABASE` resources by `TagCondition`. This operation is used by admins who want to grant user permissions on certain `TagConditions`. Before making a grant, the admin can use `SearchDatabasesByTags` to find all resources where the given `TagConditions` are valid to verify whether the returned resources can be shared.
 */
export const searchDatabasesByLFTags: {
  (
    input: SearchDatabasesByLFTagsRequest,
  ): effect.Effect<
    SearchDatabasesByLFTagsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchDatabasesByLFTagsRequest,
  ) => stream.Stream<
    SearchDatabasesByLFTagsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchDatabasesByLFTagsRequest,
  ) => stream.Stream<
    TaggedDatabase,
    | AccessDeniedException
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchDatabasesByLFTagsRequest,
  output: SearchDatabasesByLFTagsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DatabaseList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation allows a search on `TABLE` resources by `LFTag`s. This will be used by admins who want to grant user permissions on certain LF-tags. Before making a grant, the admin can use `SearchTablesByLFTags` to find all resources where the given `LFTag`s are valid to verify whether the returned resources can be shared.
 */
export const searchTablesByLFTags: {
  (
    input: SearchTablesByLFTagsRequest,
  ): effect.Effect<
    SearchTablesByLFTagsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchTablesByLFTagsRequest,
  ) => stream.Stream<
    SearchTablesByLFTagsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchTablesByLFTagsRequest,
  ) => stream.Stream<
    TaggedTable,
    | AccessDeniedException
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchTablesByLFTagsRequest,
  output: SearchTablesByLFTagsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TableList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the work units resulting from the query. Work units can be executed in any order and in parallel.
 */
export const getWorkUnitResults: (
  input: GetWorkUnitResultsRequest,
) => effect.Effect<
  GetWorkUnitResultsResponse,
  | AccessDeniedException
  | ExpiredException
  | InternalServiceException
  | InvalidInputException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkUnitResultsRequest,
  output: GetWorkUnitResultsResponse,
  errors: [
    AccessDeniedException,
    ExpiredException,
    InternalServiceException,
    InvalidInputException,
    ThrottledException,
  ],
}));
/**
 * Retrieves the work units generated by the `StartQueryPlanning` operation.
 */
export const getWorkUnits: {
  (
    input: GetWorkUnitsRequest,
  ): effect.Effect<
    GetWorkUnitsResponse,
    | AccessDeniedException
    | ExpiredException
    | InternalServiceException
    | InvalidInputException
    | WorkUnitsNotReadyYetException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetWorkUnitsRequest,
  ) => stream.Stream<
    GetWorkUnitsResponse,
    | AccessDeniedException
    | ExpiredException
    | InternalServiceException
    | InvalidInputException
    | WorkUnitsNotReadyYetException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetWorkUnitsRequest,
  ) => stream.Stream<
    WorkUnitRange,
    | AccessDeniedException
    | ExpiredException
    | InternalServiceException
    | InvalidInputException
    | WorkUnitsNotReadyYetException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetWorkUnitsRequest,
  output: GetWorkUnitsResponse,
  errors: [
    AccessDeniedException,
    ExpiredException,
    InternalServiceException,
    InvalidInputException,
    WorkUnitsNotReadyYetException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WorkUnitRanges",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Retrieves the instance ARN and application ARN for the connection.
 */
export const describeLakeFormationIdentityCenterConfiguration: (
  input: DescribeLakeFormationIdentityCenterConfigurationRequest,
) => effect.Effect<
  DescribeLakeFormationIdentityCenterConfigurationResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLakeFormationIdentityCenterConfigurationRequest,
  output: DescribeLakeFormationIdentityCenterConfigurationResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns a data cells filter.
 */
export const getDataCellsFilter: (
  input: GetDataCellsFilterRequest,
) => effect.Effect<
  GetDataCellsFilterResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataCellsFilterRequest,
  output: GetDataCellsFilterResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns an LF-tag definition.
 */
export const getLFTag: (
  input: GetLFTagRequest,
) => effect.Effect<
  GetLFTagResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLFTagRequest,
  output: GetLFTagResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns the details about the LF-Tag expression. The caller must be a data lake admin or must have `DESCRIBE` permission on the LF-Tag expression resource.
 */
export const getLFTagExpression: (
  input: GetLFTagExpressionRequest,
) => effect.Effect<
  GetLFTagExpressionResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLFTagExpressionRequest,
  output: GetLFTagExpressionResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Lists LF-tags that the requester has permission to view.
 */
export const listLFTags: {
  (
    input: ListLFTagsRequest,
  ): effect.Effect<
    ListLFTagsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLFTagsRequest,
  ) => stream.Stream<
    ListLFTagsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLFTagsRequest,
  ) => stream.Stream<
    LFTagPair,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLFTagsRequest,
  output: ListLFTagsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "LFTags",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of the principal permissions on the resource, filtered by the permissions of the caller. For example, if you are granted an ALTER permission, you are able to see only the principal permissions for ALTER.
 *
 * This operation returns only those permissions that have been explicitly granted. If both
 * `Principal` and `Resource` parameters are provided, the response
 * returns effective permissions rather than the explicitly granted permissions.
 *
 * For information about permissions, see Security and Access Control to Metadata and Data.
 */
export const listPermissions: {
  (
    input: ListPermissionsRequest,
  ): effect.Effect<
    ListPermissionsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPermissionsRequest,
  ) => stream.Stream<
    ListPermissionsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPermissionsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPermissionsRequest,
  output: ListPermissionsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns metadata about transactions and their status. To prevent the response from growing indefinitely, only uncommitted transactions and those available for time-travel queries are returned.
 *
 * This operation can help you identify uncommitted transactions or to get information about transactions.
 */
export const listTransactions: {
  (
    input: ListTransactionsRequest,
  ): effect.Effect<
    ListTransactionsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTransactionsRequest,
  ) => stream.Stream<
    ListTransactionsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTransactionsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTransactionsRequest,
  output: ListTransactionsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Starts a new transaction and returns its transaction ID. Transaction IDs are opaque objects that you can use to identify a transaction.
 */
export const startTransaction: (
  input: StartTransactionRequest,
) => effect.Effect<
  StartTransactionResponse,
  InternalServiceException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTransactionRequest,
  output: StartTransactionResponse,
  errors: [InternalServiceException, OperationTimeoutException],
}));
/**
 * Deletes a data cell filter.
 */
export const deleteDataCellsFilter: (
  input: DeleteDataCellsFilterRequest,
) => effect.Effect<
  DeleteDataCellsFilterResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataCellsFilterRequest,
  output: DeleteDataCellsFilterResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes an IAM Identity Center connection with Lake Formation.
 */
export const deleteLakeFormationIdentityCenterConfiguration: (
  input: DeleteLakeFormationIdentityCenterConfigurationRequest,
) => effect.Effect<
  DeleteLakeFormationIdentityCenterConfigurationResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLakeFormationIdentityCenterConfigurationRequest,
  output: DeleteLakeFormationIdentityCenterConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Remove the Lake Formation permissions enforcement of the given databases, tables, and principals.
 */
export const deleteLakeFormationOptIn: (
  input: DeleteLakeFormationOptInRequest,
) => effect.Effect<
  DeleteLakeFormationOptInResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLakeFormationOptInRequest,
  output: DeleteLakeFormationOptInResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes an LF-tag by its key name. The operation fails if the specified tag key doesn't
 * exist. When you delete an LF-Tag:
 *
 * - The associated LF-Tag policy becomes invalid.
 *
 * - Resources that had this tag assigned will no longer have the tag policy applied to
 * them.
 */
export const deleteLFTag: (
  input: DeleteLFTagRequest,
) => effect.Effect<
  DeleteLFTagResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLFTagRequest,
  output: DeleteLFTagResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes the LF-Tag expression. The caller must be a data lake admin or have `DROP` permissions on the LF-Tag expression.
 * Deleting a LF-Tag expression will also delete all `LFTagPolicy` permissions referencing the LF-Tag expression.
 */
export const deleteLFTagExpression: (
  input: DeleteLFTagExpressionRequest,
) => effect.Effect<
  DeleteLFTagExpressionResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLFTagExpressionRequest,
  output: DeleteLFTagExpressionResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns the identity of the invoking principal.
 */
export const getDataLakePrincipal: (
  input: GetDataLakePrincipalRequest,
) => effect.Effect<
  GetDataLakePrincipalResponse,
  | AccessDeniedException
  | InternalServiceException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataLakePrincipalRequest,
  output: GetDataLakePrincipalResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates a data cell filter.
 */
export const updateDataCellsFilter: (
  input: UpdateDataCellsFilterRequest,
) => effect.Effect<
  UpdateDataCellsFilterResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataCellsFilterRequest,
  output: UpdateDataCellsFilterResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates the IAM Identity Center connection parameters.
 */
export const updateLakeFormationIdentityCenterConfiguration: (
  input: UpdateLakeFormationIdentityCenterConfigurationRequest,
) => effect.Effect<
  UpdateLakeFormationIdentityCenterConfigurationResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLakeFormationIdentityCenterConfigurationRequest,
  output: UpdateLakeFormationIdentityCenterConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates the list of possible values for the specified LF-tag key. If the LF-tag does not exist, the operation throws an EntityNotFoundException. The values in the delete key values will be deleted from list of possible values. If any value in the delete key values is attached to a resource, then API errors out with a 400 Exception - "Update not allowed". Untag the attribute before deleting the LF-tag key's value.
 */
export const updateLFTag: (
  input: UpdateLFTagRequest,
) => effect.Effect<
  UpdateLFTagResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLFTagRequest,
  output: UpdateLFTagResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Allows a caller to assume an IAM role decorated as the SAML user specified in the SAML assertion included in the request. This decoration allows Lake Formation to enforce access policies against the SAML users and groups. This API operation requires SAML federation setup in the caller’s account as it can only be called with valid SAML assertions.
 * Lake Formation does not scope down the permission of the assumed role. All permissions attached to the role via the SAML federation setup will be included in the role session.
 *
 * This decorated role is expected to access data in Amazon S3 by getting temporary access from Lake Formation which is authorized via the virtual API `GetDataAccess`.
 * Therefore, all SAML roles that can be assumed via `AssumeDecoratedRoleWithSAML` must at a minimum include `lakeformation:GetDataAccess` in their role policies.
 * A typical IAM policy attached to such a role would include the following actions:
 *
 * - glue:*Database*
 *
 * - glue:*Table*
 *
 * - glue:*Partition*
 *
 * - glue:*UserDefinedFunction*
 *
 * - lakeformation:GetDataAccess
 */
export const assumeDecoratedRoleWithSAML: (
  input: AssumeDecoratedRoleWithSAMLRequest,
) => effect.Effect<
  AssumeDecoratedRoleWithSAMLResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssumeDecoratedRoleWithSAMLRequest,
  output: AssumeDecoratedRoleWithSAMLResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates the data access role used for vending access to the given (registered) resource in Lake Formation.
 */
export const updateResource: (
  input: UpdateResourceRequest,
) => effect.Effect<
  UpdateResourceResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceRequest,
  output: UpdateResourceResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Batch operation to grant permissions to the principal.
 */
export const batchGrantPermissions: (
  input: BatchGrantPermissionsRequest,
) => effect.Effect<
  BatchGrantPermissionsResponse,
  InvalidInputException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGrantPermissionsRequest,
  output: BatchGrantPermissionsResponse,
  errors: [InvalidInputException, OperationTimeoutException],
}));
/**
 * Deregisters the resource as managed by the Data Catalog.
 *
 * When you deregister a path, Lake Formation removes the path from the inline policy attached to your service-linked role.
 */
export const deregisterResource: (
  input: DeregisterResourceRequest,
) => effect.Effect<
  DeregisterResourceResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterResourceRequest,
  output: DeregisterResourceResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the current data access role for the given resource registered in Lake Formation.
 */
export const describeResource: (
  input: DescribeResourceRequest,
) => effect.Effect<
  DescribeResourceResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourceRequest,
  output: DescribeResourceResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns the details of a single transaction.
 */
export const describeTransaction: (
  input: DescribeTransactionRequest,
) => effect.Effect<
  DescribeTransactionResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTransactionRequest,
  output: DescribeTransactionResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Lists all the data cell filters on a table.
 */
export const listDataCellsFilter: {
  (
    input: ListDataCellsFilterRequest,
  ): effect.Effect<
    ListDataCellsFilterResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataCellsFilterRequest,
  ) => stream.Stream<
    ListDataCellsFilterResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataCellsFilterRequest,
  ) => stream.Stream<
    DataCellsFilter,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataCellsFilterRequest,
  output: ListDataCellsFilterResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DataCellsFilters",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve the current list of resources and principals that are opt in to enforce Lake Formation permissions.
 */
export const listLakeFormationOptIns: {
  (
    input: ListLakeFormationOptInsRequest,
  ): effect.Effect<
    ListLakeFormationOptInsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLakeFormationOptInsRequest,
  ) => stream.Stream<
    ListLakeFormationOptInsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLakeFormationOptInsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLakeFormationOptInsRequest,
  output: ListLakeFormationOptInsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the LF-Tag expressions in caller’s account filtered based on caller's permissions. Data Lake and read only admins implicitly can see all tag expressions in their account, else caller needs DESCRIBE permissions on tag expression.
 */
export const listLFTagExpressions: {
  (
    input: ListLFTagExpressionsRequest,
  ): effect.Effect<
    ListLFTagExpressionsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLFTagExpressionsRequest,
  ) => stream.Stream<
    ListLFTagExpressionsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLFTagExpressionsRequest,
  ) => stream.Stream<
    LFTagExpression,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLFTagExpressionsRequest,
  output: ListLFTagExpressionsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "LFTagExpressions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the resources registered to be managed by the Data Catalog.
 */
export const listResources: {
  (
    input: ListResourcesRequest,
  ): effect.Effect<
    ListResourcesResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcesRequest,
  ) => stream.Stream<
    ListResourcesResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourcesRequest,
  output: ListResourcesResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Attaches one or more LF-tags to an existing resource.
 */
export const addLFTagsToResource: (
  input: AddLFTagsToResourceRequest,
) => effect.Effect<
  AddLFTagsToResourceResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddLFTagsToResourceRequest,
  output: AddLFTagsToResourceResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Batch operation to revoke permissions from the principal.
 */
export const batchRevokePermissions: (
  input: BatchRevokePermissionsRequest,
) => effect.Effect<
  BatchRevokePermissionsResponse,
  InvalidInputException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchRevokePermissionsRequest,
  output: BatchRevokePermissionsResponse,
  errors: [InvalidInputException, OperationTimeoutException],
}));
/**
 * Returns the Lake Formation permissions for a specified table or database resource located
 * at a path in Amazon S3. `GetEffectivePermissionsForPath` will not return databases and tables if the catalog is encrypted.
 */
export const getEffectivePermissionsForPath: {
  (
    input: GetEffectivePermissionsForPathRequest,
  ): effect.Effect<
    GetEffectivePermissionsForPathResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetEffectivePermissionsForPathRequest,
  ) => stream.Stream<
    GetEffectivePermissionsForPathResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetEffectivePermissionsForPathRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetEffectivePermissionsForPathRequest,
  output: GetEffectivePermissionsForPathResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the LF-tags applied to a resource.
 */
export const getResourceLFTags: (
  input: GetResourceLFTagsRequest,
) => effect.Effect<
  GetResourceLFTagsResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceLFTagsRequest,
  output: GetResourceLFTagsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Submits a request to process a query statement.
 *
 * This operation generates work units that can be retrieved with the `GetWorkUnits` operation as soon as the query state is WORKUNITS_AVAILABLE or FINISHED.
 */
export const startQueryPlanning: (
  input: StartQueryPlanningRequest,
) => effect.Effect<
  StartQueryPlanningResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidInputException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartQueryPlanningRequest,
  output: StartQueryPlanningResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
    ThrottledException,
  ],
}));
/**
 * Retrieves statistics on the planning and execution of a query.
 */
export const getQueryStatistics: (
  input: GetQueryStatisticsRequest,
) => effect.Effect<
  GetQueryStatisticsResponse,
  | AccessDeniedException
  | ExpiredException
  | InternalServiceException
  | InvalidInputException
  | StatisticsNotReadyYetException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryStatisticsRequest,
  output: GetQueryStatisticsResponse,
  errors: [
    AccessDeniedException,
    ExpiredException,
    InternalServiceException,
    InvalidInputException,
    StatisticsNotReadyYetException,
    ThrottledException,
  ],
}));
/**
 * Creates an IAM Identity Center connection with Lake Formation to allow IAM Identity Center users and groups to access Data Catalog resources.
 */
export const createLakeFormationIdentityCenterConfiguration: (
  input: CreateLakeFormationIdentityCenterConfigurationRequest,
) => effect.Effect<
  CreateLakeFormationIdentityCenterConfigurationResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | ConcurrentModificationException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLakeFormationIdentityCenterConfigurationRequest,
  output: CreateLakeFormationIdentityCenterConfigurationResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    ConcurrentModificationException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Registers the resource as managed by the Data Catalog.
 *
 * To add or update data, Lake Formation needs read/write access to the chosen data location. Choose a role that you know has permission to do this, or choose the AWSServiceRoleForLakeFormationDataAccess service-linked role. When you register the first Amazon S3 path, the service-linked role and a new inline policy are created on your behalf. Lake Formation adds the first path to the inline policy and attaches it to the service-linked role. When you register subsequent paths, Lake Formation adds the path to the existing policy.
 *
 * The following request registers a new location and gives Lake Formation permission to use the service-linked role to access that location.
 *
 * ResourceArn = arn:aws:s3:::my-bucket/
 * UseServiceLinkedRole = true
 *
 * If `UseServiceLinkedRole` is not set to true, you must provide or set the `RoleArn`:
 *
 * `arn:aws:iam::12345:role/my-data-access-role`
 */
export const registerResource: (
  input: RegisterResourceRequest,
) => effect.Effect<
  RegisterResourceResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterResourceRequest,
  output: RegisterResourceResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * This API is identical to `GetTemporaryTableCredentials` except that this is used when the target Data Catalog resource is of type Partition. Lake Formation restricts the permission of the vended credentials with the same scope down policy which restricts access to a single Amazon S3 prefix.
 */
export const getTemporaryGluePartitionCredentials: (
  input: GetTemporaryGluePartitionCredentialsRequest,
) => effect.Effect<
  GetTemporaryGluePartitionCredentialsResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | PermissionTypeMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemporaryGluePartitionCredentialsRequest,
  output: GetTemporaryGluePartitionCredentialsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    PermissionTypeMismatchException,
  ],
}));
/**
 * Updates the name of the LF-Tag expression to the new description and expression body provided.
 * Updating a LF-Tag expression immediately changes the permission boundaries of all existing `LFTagPolicy` permission grants that reference the given LF-Tag expression.
 */
export const updateLFTagExpression: (
  input: UpdateLFTagExpressionRequest,
) => effect.Effect<
  UpdateLFTagExpressionResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLFTagExpressionRequest,
  output: UpdateLFTagExpressionResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Enforce Lake Formation permissions for the given databases, tables, and principals.
 */
export const createLakeFormationOptIn: (
  input: CreateLakeFormationOptInRequest,
) => effect.Effect<
  CreateLakeFormationOptInResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLakeFormationOptInRequest,
  output: CreateLakeFormationOptInResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates an LF-tag with the specified name and values.
 */
export const createLFTag: (
  input: CreateLFTagRequest,
) => effect.Effect<
  CreateLFTagResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLFTagRequest,
  output: CreateLFTagResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a new LF-Tag expression with the provided name, description, catalog ID, and
 * expression body. This call fails if a LF-Tag expression with the same name already exists in
 * the caller’s account or if the underlying LF-Tags don't exist. To call this API operation,
 * caller needs the following Lake Formation permissions:
 *
 * `CREATE_LF_TAG_EXPRESSION` on the root catalog resource.
 *
 * `GRANT_WITH_LF_TAG_EXPRESSION` on all underlying LF-Tag key:value pairs
 * included in the expression.
 */
export const createLFTagExpression: (
  input: CreateLFTagExpressionRequest,
) => effect.Effect<
  CreateLFTagExpressionResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLFTagExpressionRequest,
  output: CreateLFTagExpressionResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a data cell filter to allow one to grant access to certain columns on certain rows.
 */
export const createDataCellsFilter: (
  input: CreateDataCellsFilterRequest,
) => effect.Effect<
  CreateDataCellsFilterResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataCellsFilterRequest,
  output: CreateDataCellsFilterResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Attempts to commit the specified transaction. Returns an exception if the transaction was previously aborted. This API action is idempotent if called multiple times for the same transaction.
 */
export const commitTransaction: (
  input: CommitTransactionRequest,
) => effect.Effect<
  CommitTransactionResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | TransactionCanceledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CommitTransactionRequest,
  output: CommitTransactionResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    TransactionCanceledException,
  ],
}));
/**
 * Allows a caller in a secure environment to assume a role with permission to access Amazon S3. In order to vend such credentials, Lake Formation assumes the role associated with a registered location, for example an Amazon S3 bucket, with a scope down policy which restricts the access to a single prefix.
 *
 * To call this API, the role that the service assumes must have `lakeformation:GetDataAccess` permission on the resource.
 */
export const getTemporaryGlueTableCredentials: (
  input: GetTemporaryGlueTableCredentialsRequest,
) => effect.Effect<
  GetTemporaryGlueTableCredentialsResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | PermissionTypeMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemporaryGlueTableCredentialsRequest,
  output: GetTemporaryGlueTableCredentialsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    PermissionTypeMismatchException,
  ],
}));
/**
 * Attempts to cancel the specified transaction. Returns an exception if the transaction was previously committed.
 */
export const cancelTransaction: (
  input: CancelTransactionRequest,
) => effect.Effect<
  CancelTransactionResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | TransactionCommitInProgressException
  | TransactionCommittedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelTransactionRequest,
  output: CancelTransactionResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    TransactionCommitInProgressException,
    TransactionCommittedException,
  ],
}));
/**
 * For a specific governed table, provides a list of Amazon S3 objects that will be written during the current transaction and that can be automatically deleted
 * if the transaction is canceled. Without this call, no Amazon S3 objects are automatically deleted when a transaction cancels.
 *
 * The Glue ETL library function `write_dynamic_frame.from_catalog()` includes an option to automatically
 * call `DeleteObjectsOnCancel` before writes. For more information, see
 * Rolling Back Amazon S3 Writes.
 */
export const deleteObjectsOnCancel: (
  input: DeleteObjectsOnCancelRequest,
) => effect.Effect<
  DeleteObjectsOnCancelResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNotReadyException
  | TransactionCanceledException
  | TransactionCommittedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteObjectsOnCancelRequest,
  output: DeleteObjectsOnCancelResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNotReadyException,
    TransactionCanceledException,
    TransactionCommittedException,
  ],
}));
/**
 * Indicates to the service that the specified transaction is still active and should not be treated as idle and aborted.
 *
 * Write transactions that remain idle for a long period are automatically aborted unless explicitly extended.
 */
export const extendTransaction: (
  input: ExtendTransactionRequest,
) => effect.Effect<
  ExtendTransactionResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | TransactionCanceledException
  | TransactionCommitInProgressException
  | TransactionCommittedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExtendTransactionRequest,
  output: ExtendTransactionResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    TransactionCanceledException,
    TransactionCommitInProgressException,
    TransactionCommittedException,
  ],
}));
/**
 * Updates the manifest of Amazon S3 objects that make up the specified governed table.
 */
export const updateTableObjects: (
  input: UpdateTableObjectsRequest,
) => effect.Effect<
  UpdateTableObjectsResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNotReadyException
  | TransactionCanceledException
  | TransactionCommitInProgressException
  | TransactionCommittedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTableObjectsRequest,
  output: UpdateTableObjectsResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNotReadyException,
    TransactionCanceledException,
    TransactionCommitInProgressException,
    TransactionCommittedException,
  ],
}));
/**
 * Returns the set of Amazon S3 objects that make up the specified governed table. A transaction ID or timestamp can be specified for time-travel queries.
 */
export const getTableObjects: {
  (
    input: GetTableObjectsRequest,
  ): effect.Effect<
    GetTableObjectsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | ResourceNotReadyException
    | TransactionCanceledException
    | TransactionCommittedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTableObjectsRequest,
  ) => stream.Stream<
    GetTableObjectsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | ResourceNotReadyException
    | TransactionCanceledException
    | TransactionCommittedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTableObjectsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | ResourceNotReadyException
    | TransactionCanceledException
    | TransactionCommittedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetTableObjectsRequest,
  output: GetTableObjectsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNotReadyException,
    TransactionCanceledException,
    TransactionCommittedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
