import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials as Creds } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "finspace data",
  serviceShapeName: "AWSHabaneroPublicAPI",
});
const auth = T.AwsAuthSigv4({ name: "finspace-api" });
const ver = T.ServiceVersion("2020-07-13");
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
              `https://finspace-api-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://finspace-api-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://finspace-api.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://finspace-api.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PermissionGroupId = string;
export type UserId = string;
export type ClientToken = string;
export type DatasetId = string;
export type DatasetTitle = string;
export type DatasetDescription = string;
export type AliasString = string;
export type StringValueLength1to255 = string;
export type TimestampEpoch = number;
export type PermissionGroupName = string | redacted.Redacted<string>;
export type PermissionGroupDescription = string | redacted.Redacted<string>;
export type Email = string | redacted.Redacted<string>;
export type FirstName = string | redacted.Redacted<string>;
export type LastName = string | redacted.Redacted<string>;
export type RoleArn = string;
export type ChangesetId = string;
export type DataViewId = string;
export type SessionDuration = number;
export type IdType = string;
export type ResultLimit = number;
export type PaginationToken = string;
export type StringMapKey = string;
export type StringMapValue = string;
export type OwnerName = string;
export type PhoneNumber = string;
export type DataViewDestinationType = string;
export type StatusCode = number;
export type ChangesetArn = string;
export type DatasetArn = string;
export type DataViewArn = string;
export type StringValueLength1to1024 = string;
export type StringValueLength1to63 = string;
export type Password = string | redacted.Redacted<string>;
export type StringValueLength1to250 = string;
export type ColumnName = string;
export type ErrorMessage = string;
export type AccessKeyId = string;
export type SecretAccessKey = string | redacted.Redacted<string>;
export type SessionToken = string | redacted.Redacted<string>;
export type S3BucketName = string;
export type S3Key = string;
export type StringValueLength1to2552 = string;
export type StringValueMaxLength1000 = string;
export type ColumnDescription = string;
export type ErrorMessage2 = string;

//# Schemas
export type ChangeType = "REPLACE" | "APPEND" | "MODIFY" | (string & {});
export const ChangeType = S.String;
export type DatasetKind = "TABULAR" | "NON_TABULAR" | (string & {});
export const DatasetKind = S.String;
export type SortColumnList = string[];
export const SortColumnList = S.Array(S.String);
export type PartitionColumnList = string[];
export const PartitionColumnList = S.Array(S.String);
export type ApplicationPermission =
  | "CreateDataset"
  | "ManageClusters"
  | "ManageUsersAndGroups"
  | "ManageAttributeSets"
  | "ViewAuditData"
  | "AccessNotebooks"
  | "GetTemporaryCredentials"
  | (string & {});
export const ApplicationPermission = S.String;
export type ApplicationPermissionList = ApplicationPermission[];
export const ApplicationPermissionList = S.Array(ApplicationPermission);
export type UserType = "SUPER_USER" | "APP_USER" | (string & {});
export const UserType = S.String;
export type ApiAccess = "ENABLED" | "DISABLED" | (string & {});
export const ApiAccess = S.String;
export type LocationType = "INGESTION" | "SAGEMAKER" | (string & {});
export const LocationType = S.String;
export interface AssociateUserToPermissionGroupRequest {
  permissionGroupId: string;
  userId: string;
  clientToken?: string;
}
export const AssociateUserToPermissionGroupRequest = S.suspend(() =>
  S.Struct({
    permissionGroupId: S.String.pipe(T.HttpLabel("permissionGroupId")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/permission-group/{permissionGroupId}/users/{userId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateUserToPermissionGroupRequest",
}) as any as S.Schema<AssociateUserToPermissionGroupRequest>;
export interface CreatePermissionGroupRequest {
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  applicationPermissions: ApplicationPermission[];
  clientToken?: string;
}
export const CreatePermissionGroupRequest = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    applicationPermissions: ApplicationPermissionList,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/permission-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePermissionGroupRequest",
}) as any as S.Schema<CreatePermissionGroupRequest>;
export interface CreateUserRequest {
  emailAddress: string | redacted.Redacted<string>;
  type: UserType;
  firstName?: string | redacted.Redacted<string>;
  lastName?: string | redacted.Redacted<string>;
  apiAccess?: ApiAccess;
  apiAccessPrincipalArn?: string;
  clientToken?: string;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    emailAddress: SensitiveString,
    type: UserType,
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    apiAccess: S.optional(ApiAccess),
    apiAccessPrincipalArn: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUserRequest",
}) as any as S.Schema<CreateUserRequest>;
export interface DeleteDatasetRequest {
  clientToken?: string;
  datasetId: string;
}
export const DeleteDatasetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/datasetsv2/{datasetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDatasetRequest",
}) as any as S.Schema<DeleteDatasetRequest>;
export interface DeletePermissionGroupRequest {
  permissionGroupId: string;
  clientToken?: string;
}
export const DeletePermissionGroupRequest = S.suspend(() =>
  S.Struct({
    permissionGroupId: S.String.pipe(T.HttpLabel("permissionGroupId")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/permission-group/{permissionGroupId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePermissionGroupRequest",
}) as any as S.Schema<DeletePermissionGroupRequest>;
export interface DisableUserRequest {
  userId: string;
  clientToken?: string;
}
export const DisableUserRequest = S.suspend(() =>
  S.Struct({
    userId: S.String.pipe(T.HttpLabel("userId")),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user/{userId}/disable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableUserRequest",
}) as any as S.Schema<DisableUserRequest>;
export interface DisassociateUserFromPermissionGroupRequest {
  permissionGroupId: string;
  userId: string;
  clientToken?: string;
}
export const DisassociateUserFromPermissionGroupRequest = S.suspend(() =>
  S.Struct({
    permissionGroupId: S.String.pipe(T.HttpLabel("permissionGroupId")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/permission-group/{permissionGroupId}/users/{userId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateUserFromPermissionGroupRequest",
}) as any as S.Schema<DisassociateUserFromPermissionGroupRequest>;
export interface EnableUserRequest {
  userId: string;
  clientToken?: string;
}
export const EnableUserRequest = S.suspend(() =>
  S.Struct({
    userId: S.String.pipe(T.HttpLabel("userId")),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user/{userId}/enable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableUserRequest",
}) as any as S.Schema<EnableUserRequest>;
export interface GetChangesetRequest {
  datasetId: string;
  changesetId: string;
}
export const GetChangesetRequest = S.suspend(() =>
  S.Struct({
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
    changesetId: S.String.pipe(T.HttpLabel("changesetId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/datasets/{datasetId}/changesetsv2/{changesetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChangesetRequest",
}) as any as S.Schema<GetChangesetRequest>;
export interface GetDatasetRequest {
  datasetId: string;
}
export const GetDatasetRequest = S.suspend(() =>
  S.Struct({ datasetId: S.String.pipe(T.HttpLabel("datasetId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasetsv2/{datasetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDatasetRequest",
}) as any as S.Schema<GetDatasetRequest>;
export interface GetDataViewRequest {
  dataViewId: string;
  datasetId: string;
}
export const GetDataViewRequest = S.suspend(() =>
  S.Struct({
    dataViewId: S.String.pipe(T.HttpLabel("dataViewId")),
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/datasets/{datasetId}/dataviewsv2/{dataViewId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataViewRequest",
}) as any as S.Schema<GetDataViewRequest>;
export interface GetExternalDataViewAccessDetailsRequest {
  dataViewId: string;
  datasetId: string;
}
export const GetExternalDataViewAccessDetailsRequest = S.suspend(() =>
  S.Struct({
    dataViewId: S.String.pipe(T.HttpLabel("dataViewId")),
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/datasets/{datasetId}/dataviewsv2/{dataViewId}/external-access-details",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExternalDataViewAccessDetailsRequest",
}) as any as S.Schema<GetExternalDataViewAccessDetailsRequest>;
export interface GetPermissionGroupRequest {
  permissionGroupId: string;
}
export const GetPermissionGroupRequest = S.suspend(() =>
  S.Struct({
    permissionGroupId: S.String.pipe(T.HttpLabel("permissionGroupId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/permission-group/{permissionGroupId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPermissionGroupRequest",
}) as any as S.Schema<GetPermissionGroupRequest>;
export interface GetProgrammaticAccessCredentialsRequest {
  durationInMinutes?: number;
  environmentId: string;
}
export const GetProgrammaticAccessCredentialsRequest = S.suspend(() =>
  S.Struct({
    durationInMinutes: S.optional(S.Number).pipe(
      T.HttpQuery("durationInMinutes"),
    ),
    environmentId: S.String.pipe(T.HttpQuery("environmentId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/credentials/programmatic" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProgrammaticAccessCredentialsRequest",
}) as any as S.Schema<GetProgrammaticAccessCredentialsRequest>;
export interface GetUserRequest {
  userId: string;
}
export const GetUserRequest = S.suspend(() =>
  S.Struct({ userId: S.String.pipe(T.HttpLabel("userId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/user/{userId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUserRequest",
}) as any as S.Schema<GetUserRequest>;
export interface GetWorkingLocationRequest {
  locationType?: LocationType;
}
export const GetWorkingLocationRequest = S.suspend(() =>
  S.Struct({ locationType: S.optional(LocationType) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workingLocationV1" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkingLocationRequest",
}) as any as S.Schema<GetWorkingLocationRequest>;
export interface ListChangesetsRequest {
  datasetId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListChangesetsRequest = S.suspend(() =>
  S.Struct({
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets/{datasetId}/changesetsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChangesetsRequest",
}) as any as S.Schema<ListChangesetsRequest>;
export interface ListDatasetsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListDatasetsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasetsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDatasetsRequest",
}) as any as S.Schema<ListDatasetsRequest>;
export interface ListDataViewsRequest {
  datasetId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataViewsRequest = S.suspend(() =>
  S.Struct({
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets/{datasetId}/dataviewsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataViewsRequest",
}) as any as S.Schema<ListDataViewsRequest>;
export interface ListPermissionGroupsRequest {
  nextToken?: string;
  maxResults: number;
}
export const ListPermissionGroupsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/permission-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPermissionGroupsRequest",
}) as any as S.Schema<ListPermissionGroupsRequest>;
export interface ListPermissionGroupsByUserRequest {
  userId: string;
  nextToken?: string;
  maxResults: number;
}
export const ListPermissionGroupsByUserRequest = S.suspend(() =>
  S.Struct({
    userId: S.String.pipe(T.HttpLabel("userId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/user/{userId}/permission-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPermissionGroupsByUserRequest",
}) as any as S.Schema<ListPermissionGroupsByUserRequest>;
export interface ListUsersRequest {
  nextToken?: string;
  maxResults: number;
}
export const ListUsersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/user" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUsersRequest",
}) as any as S.Schema<ListUsersRequest>;
export interface ListUsersByPermissionGroupRequest {
  permissionGroupId: string;
  nextToken?: string;
  maxResults: number;
}
export const ListUsersByPermissionGroupRequest = S.suspend(() =>
  S.Struct({
    permissionGroupId: S.String.pipe(T.HttpLabel("permissionGroupId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/permission-group/{permissionGroupId}/users",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUsersByPermissionGroupRequest",
}) as any as S.Schema<ListUsersByPermissionGroupRequest>;
export interface ResetUserPasswordRequest {
  userId: string;
  clientToken?: string;
}
export const ResetUserPasswordRequest = S.suspend(() =>
  S.Struct({
    userId: S.String.pipe(T.HttpLabel("userId")),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/user/{userId}/password" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetUserPasswordRequest",
}) as any as S.Schema<ResetUserPasswordRequest>;
export type SourceParams = { [key: string]: string | undefined };
export const SourceParams = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type FormatParams = { [key: string]: string | undefined };
export const FormatParams = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface UpdateChangesetRequest {
  clientToken?: string;
  datasetId: string;
  changesetId: string;
  sourceParams: { [key: string]: string | undefined };
  formatParams: { [key: string]: string | undefined };
}
export const UpdateChangesetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
    changesetId: S.String.pipe(T.HttpLabel("changesetId")),
    sourceParams: SourceParams,
    formatParams: FormatParams,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/datasets/{datasetId}/changesetsv2/{changesetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChangesetRequest",
}) as any as S.Schema<UpdateChangesetRequest>;
export type ColumnDataType =
  | "STRING"
  | "CHAR"
  | "INTEGER"
  | "TINYINT"
  | "SMALLINT"
  | "BIGINT"
  | "FLOAT"
  | "DOUBLE"
  | "DATE"
  | "DATETIME"
  | "BOOLEAN"
  | "BINARY"
  | (string & {});
export const ColumnDataType = S.String;
export interface ColumnDefinition {
  dataType?: ColumnDataType;
  columnName?: string;
  columnDescription?: string;
}
export const ColumnDefinition = S.suspend(() =>
  S.Struct({
    dataType: S.optional(ColumnDataType),
    columnName: S.optional(S.String),
    columnDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "ColumnDefinition",
}) as any as S.Schema<ColumnDefinition>;
export type ColumnList = ColumnDefinition[];
export const ColumnList = S.Array(ColumnDefinition);
export type ColumnNameList = string[];
export const ColumnNameList = S.Array(S.String);
export interface SchemaDefinition {
  columns?: ColumnDefinition[];
  primaryKeyColumns?: string[];
}
export const SchemaDefinition = S.suspend(() =>
  S.Struct({
    columns: S.optional(ColumnList),
    primaryKeyColumns: S.optional(ColumnNameList),
  }),
).annotations({
  identifier: "SchemaDefinition",
}) as any as S.Schema<SchemaDefinition>;
export interface SchemaUnion {
  tabularSchemaConfig?: SchemaDefinition;
}
export const SchemaUnion = S.suspend(() =>
  S.Struct({ tabularSchemaConfig: S.optional(SchemaDefinition) }),
).annotations({ identifier: "SchemaUnion" }) as any as S.Schema<SchemaUnion>;
export interface UpdateDatasetRequest {
  clientToken?: string;
  datasetId: string;
  datasetTitle: string;
  kind: DatasetKind;
  datasetDescription?: string;
  alias?: string;
  schemaDefinition?: SchemaUnion;
}
export const UpdateDatasetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
    datasetTitle: S.String,
    kind: DatasetKind,
    datasetDescription: S.optional(S.String),
    alias: S.optional(S.String),
    schemaDefinition: S.optional(SchemaUnion),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/datasetsv2/{datasetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDatasetRequest",
}) as any as S.Schema<UpdateDatasetRequest>;
export interface UpdatePermissionGroupRequest {
  permissionGroupId: string;
  name?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  applicationPermissions?: ApplicationPermission[];
  clientToken?: string;
}
export const UpdatePermissionGroupRequest = S.suspend(() =>
  S.Struct({
    permissionGroupId: S.String.pipe(T.HttpLabel("permissionGroupId")),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    applicationPermissions: S.optional(ApplicationPermissionList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/permission-group/{permissionGroupId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePermissionGroupRequest",
}) as any as S.Schema<UpdatePermissionGroupRequest>;
export interface UpdateUserRequest {
  userId: string;
  type?: UserType;
  firstName?: string | redacted.Redacted<string>;
  lastName?: string | redacted.Redacted<string>;
  apiAccess?: ApiAccess;
  apiAccessPrincipalArn?: string;
  clientToken?: string;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    userId: S.String.pipe(T.HttpLabel("userId")),
    type: S.optional(UserType),
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    apiAccess: S.optional(ApiAccess),
    apiAccessPrincipalArn: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/user/{userId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUserRequest",
}) as any as S.Schema<UpdateUserRequest>;
export type ExportFileFormat = "PARQUET" | "DELIMITED_TEXT" | (string & {});
export const ExportFileFormat = S.String;
export interface DatasetOwnerInfo {
  name?: string;
  phoneNumber?: string;
  email?: string | redacted.Redacted<string>;
}
export const DatasetOwnerInfo = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    phoneNumber: S.optional(S.String),
    email: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "DatasetOwnerInfo",
}) as any as S.Schema<DatasetOwnerInfo>;
export type IngestionStatus =
  | "PENDING"
  | "FAILED"
  | "SUCCESS"
  | "RUNNING"
  | "STOP_REQUESTED"
  | (string & {});
export const IngestionStatus = S.String;
export type DatasetStatus =
  | "PENDING"
  | "FAILED"
  | "SUCCESS"
  | "RUNNING"
  | (string & {});
export const DatasetStatus = S.String;
export type DataViewStatus =
  | "RUNNING"
  | "STARTING"
  | "FAILED"
  | "CANCELLED"
  | "TIMEOUT"
  | "SUCCESS"
  | "PENDING"
  | "FAILED_CLEANUP_FAILED"
  | (string & {});
export const DataViewStatus = S.String;
export type UserStatus = "CREATING" | "ENABLED" | "DISABLED" | (string & {});
export const UserStatus = S.String;
export type PermissionGroupMembershipStatus =
  | "ADDITION_IN_PROGRESS"
  | "ADDITION_SUCCESS"
  | "REMOVAL_IN_PROGRESS"
  | (string & {});
export const PermissionGroupMembershipStatus = S.String;
export interface PermissionGroup {
  permissionGroupId?: string;
  name?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  applicationPermissions?: ApplicationPermission[];
  createTime?: number;
  lastModifiedTime?: number;
  membershipStatus?: PermissionGroupMembershipStatus;
}
export const PermissionGroup = S.suspend(() =>
  S.Struct({
    permissionGroupId: S.optional(S.String),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    applicationPermissions: S.optional(ApplicationPermissionList),
    createTime: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
    membershipStatus: S.optional(PermissionGroupMembershipStatus),
  }),
).annotations({
  identifier: "PermissionGroup",
}) as any as S.Schema<PermissionGroup>;
export type PermissionGroupList = PermissionGroup[];
export const PermissionGroupList = S.Array(PermissionGroup);
export interface AssociateUserToPermissionGroupResponse {
  statusCode?: number;
}
export const AssociateUserToPermissionGroupResponse = S.suspend(() =>
  S.Struct({ statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()) }),
).annotations({
  identifier: "AssociateUserToPermissionGroupResponse",
}) as any as S.Schema<AssociateUserToPermissionGroupResponse>;
export interface CreateChangesetRequest {
  clientToken?: string;
  datasetId: string;
  changeType: ChangeType;
  sourceParams: { [key: string]: string | undefined };
  formatParams: { [key: string]: string | undefined };
}
export const CreateChangesetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
    changeType: ChangeType,
    sourceParams: SourceParams,
    formatParams: FormatParams,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasets/{datasetId}/changesetsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChangesetRequest",
}) as any as S.Schema<CreateChangesetRequest>;
export interface CreatePermissionGroupResponse {
  permissionGroupId?: string;
}
export const CreatePermissionGroupResponse = S.suspend(() =>
  S.Struct({ permissionGroupId: S.optional(S.String) }),
).annotations({
  identifier: "CreatePermissionGroupResponse",
}) as any as S.Schema<CreatePermissionGroupResponse>;
export interface CreateUserResponse {
  userId?: string;
}
export const CreateUserResponse = S.suspend(() =>
  S.Struct({ userId: S.optional(S.String) }),
).annotations({
  identifier: "CreateUserResponse",
}) as any as S.Schema<CreateUserResponse>;
export interface DeleteDatasetResponse {
  datasetId?: string;
}
export const DeleteDatasetResponse = S.suspend(() =>
  S.Struct({ datasetId: S.optional(S.String) }),
).annotations({
  identifier: "DeleteDatasetResponse",
}) as any as S.Schema<DeleteDatasetResponse>;
export interface DeletePermissionGroupResponse {
  permissionGroupId?: string;
}
export const DeletePermissionGroupResponse = S.suspend(() =>
  S.Struct({ permissionGroupId: S.optional(S.String) }),
).annotations({
  identifier: "DeletePermissionGroupResponse",
}) as any as S.Schema<DeletePermissionGroupResponse>;
export interface DisableUserResponse {
  userId?: string;
}
export const DisableUserResponse = S.suspend(() =>
  S.Struct({ userId: S.optional(S.String) }),
).annotations({
  identifier: "DisableUserResponse",
}) as any as S.Schema<DisableUserResponse>;
export interface DisassociateUserFromPermissionGroupResponse {
  statusCode?: number;
}
export const DisassociateUserFromPermissionGroupResponse = S.suspend(() =>
  S.Struct({ statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()) }),
).annotations({
  identifier: "DisassociateUserFromPermissionGroupResponse",
}) as any as S.Schema<DisassociateUserFromPermissionGroupResponse>;
export interface EnableUserResponse {
  userId?: string;
}
export const EnableUserResponse = S.suspend(() =>
  S.Struct({ userId: S.optional(S.String) }),
).annotations({
  identifier: "EnableUserResponse",
}) as any as S.Schema<EnableUserResponse>;
export interface GetDatasetResponse {
  datasetId?: string;
  datasetArn?: string;
  datasetTitle?: string;
  kind?: DatasetKind;
  datasetDescription?: string;
  createTime?: number;
  lastModifiedTime?: number;
  schemaDefinition?: SchemaUnion;
  alias?: string;
  status?: DatasetStatus;
}
export const GetDatasetResponse = S.suspend(() =>
  S.Struct({
    datasetId: S.optional(S.String),
    datasetArn: S.optional(S.String),
    datasetTitle: S.optional(S.String),
    kind: S.optional(DatasetKind),
    datasetDescription: S.optional(S.String),
    createTime: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
    schemaDefinition: S.optional(SchemaUnion),
    alias: S.optional(S.String),
    status: S.optional(DatasetStatus),
  }),
).annotations({
  identifier: "GetDatasetResponse",
}) as any as S.Schema<GetDatasetResponse>;
export interface GetUserResponse {
  userId?: string;
  status?: UserStatus;
  firstName?: string | redacted.Redacted<string>;
  lastName?: string | redacted.Redacted<string>;
  emailAddress?: string | redacted.Redacted<string>;
  type?: UserType;
  apiAccess?: ApiAccess;
  apiAccessPrincipalArn?: string;
  createTime?: number;
  lastEnabledTime?: number;
  lastDisabledTime?: number;
  lastModifiedTime?: number;
  lastLoginTime?: number;
}
export const GetUserResponse = S.suspend(() =>
  S.Struct({
    userId: S.optional(S.String),
    status: S.optional(UserStatus),
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    emailAddress: S.optional(SensitiveString),
    type: S.optional(UserType),
    apiAccess: S.optional(ApiAccess),
    apiAccessPrincipalArn: S.optional(S.String),
    createTime: S.optional(S.Number),
    lastEnabledTime: S.optional(S.Number),
    lastDisabledTime: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
    lastLoginTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetUserResponse",
}) as any as S.Schema<GetUserResponse>;
export interface GetWorkingLocationResponse {
  s3Uri?: string;
  s3Path?: string;
  s3Bucket?: string;
}
export const GetWorkingLocationResponse = S.suspend(() =>
  S.Struct({
    s3Uri: S.optional(S.String),
    s3Path: S.optional(S.String),
    s3Bucket: S.optional(S.String),
  }),
).annotations({
  identifier: "GetWorkingLocationResponse",
}) as any as S.Schema<GetWorkingLocationResponse>;
export interface ListPermissionGroupsResponse {
  permissionGroups?: PermissionGroup[];
  nextToken?: string;
}
export const ListPermissionGroupsResponse = S.suspend(() =>
  S.Struct({
    permissionGroups: S.optional(PermissionGroupList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPermissionGroupsResponse",
}) as any as S.Schema<ListPermissionGroupsResponse>;
export interface ResetUserPasswordResponse {
  userId?: string;
  temporaryPassword?: string | redacted.Redacted<string>;
}
export const ResetUserPasswordResponse = S.suspend(() =>
  S.Struct({
    userId: S.optional(S.String),
    temporaryPassword: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ResetUserPasswordResponse",
}) as any as S.Schema<ResetUserPasswordResponse>;
export interface UpdateChangesetResponse {
  changesetId?: string;
  datasetId?: string;
}
export const UpdateChangesetResponse = S.suspend(() =>
  S.Struct({
    changesetId: S.optional(S.String),
    datasetId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateChangesetResponse",
}) as any as S.Schema<UpdateChangesetResponse>;
export interface UpdateDatasetResponse {
  datasetId?: string;
}
export const UpdateDatasetResponse = S.suspend(() =>
  S.Struct({ datasetId: S.optional(S.String) }),
).annotations({
  identifier: "UpdateDatasetResponse",
}) as any as S.Schema<UpdateDatasetResponse>;
export interface UpdatePermissionGroupResponse {
  permissionGroupId?: string;
}
export const UpdatePermissionGroupResponse = S.suspend(() =>
  S.Struct({ permissionGroupId: S.optional(S.String) }),
).annotations({
  identifier: "UpdatePermissionGroupResponse",
}) as any as S.Schema<UpdatePermissionGroupResponse>;
export interface UpdateUserResponse {
  userId?: string;
}
export const UpdateUserResponse = S.suspend(() =>
  S.Struct({ userId: S.optional(S.String) }),
).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export interface ResourcePermission {
  permission?: string;
}
export const ResourcePermission = S.suspend(() =>
  S.Struct({ permission: S.optional(S.String) }),
).annotations({
  identifier: "ResourcePermission",
}) as any as S.Schema<ResourcePermission>;
export type ResourcePermissionsList = ResourcePermission[];
export const ResourcePermissionsList = S.Array(ResourcePermission);
export type S3DestinationFormatOptions = { [key: string]: string | undefined };
export const S3DestinationFormatOptions = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type ErrorCategory =
  | "VALIDATION"
  | "SERVICE_QUOTA_EXCEEDED"
  | "ACCESS_DENIED"
  | "RESOURCE_NOT_FOUND"
  | "THROTTLING"
  | "INTERNAL_SERVICE_EXCEPTION"
  | "CANCELLED"
  | "USER_RECOVERABLE"
  | (string & {});
export const ErrorCategory = S.String;
export interface PermissionGroupParams {
  permissionGroupId?: string;
  datasetPermissions?: ResourcePermission[];
}
export const PermissionGroupParams = S.suspend(() =>
  S.Struct({
    permissionGroupId: S.optional(S.String),
    datasetPermissions: S.optional(ResourcePermissionsList),
  }),
).annotations({
  identifier: "PermissionGroupParams",
}) as any as S.Schema<PermissionGroupParams>;
export interface DataViewDestinationTypeParams {
  destinationType: string;
  s3DestinationExportFileFormat?: ExportFileFormat;
  s3DestinationExportFileFormatOptions?: { [key: string]: string | undefined };
}
export const DataViewDestinationTypeParams = S.suspend(() =>
  S.Struct({
    destinationType: S.String,
    s3DestinationExportFileFormat: S.optional(ExportFileFormat),
    s3DestinationExportFileFormatOptions: S.optional(
      S3DestinationFormatOptions,
    ),
  }),
).annotations({
  identifier: "DataViewDestinationTypeParams",
}) as any as S.Schema<DataViewDestinationTypeParams>;
export interface ChangesetErrorInfo {
  errorMessage?: string;
  errorCategory?: ErrorCategory;
}
export const ChangesetErrorInfo = S.suspend(() =>
  S.Struct({
    errorMessage: S.optional(S.String),
    errorCategory: S.optional(ErrorCategory),
  }),
).annotations({
  identifier: "ChangesetErrorInfo",
}) as any as S.Schema<ChangesetErrorInfo>;
export interface DataViewErrorInfo {
  errorMessage?: string;
  errorCategory?: ErrorCategory;
}
export const DataViewErrorInfo = S.suspend(() =>
  S.Struct({
    errorMessage: S.optional(S.String),
    errorCategory: S.optional(ErrorCategory),
  }),
).annotations({
  identifier: "DataViewErrorInfo",
}) as any as S.Schema<DataViewErrorInfo>;
export interface AwsCredentials {
  accessKeyId?: string;
  secretAccessKey?: string | redacted.Redacted<string>;
  sessionToken?: string | redacted.Redacted<string>;
  expiration?: number;
}
export const AwsCredentials = S.suspend(() =>
  S.Struct({
    accessKeyId: S.optional(S.String),
    secretAccessKey: S.optional(SensitiveString),
    sessionToken: S.optional(SensitiveString),
    expiration: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsCredentials",
}) as any as S.Schema<AwsCredentials>;
export interface S3Location {
  bucket: string;
  key: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ bucket: S.String, key: S.String }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface Credentials {
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
}
export const Credentials = S.suspend(() =>
  S.Struct({
    accessKeyId: S.optional(S.String),
    secretAccessKey: S.optional(S.String),
    sessionToken: S.optional(S.String),
  }),
).annotations({ identifier: "Credentials" }) as any as S.Schema<Credentials>;
export interface ChangesetSummary {
  changesetId?: string;
  changesetArn?: string;
  datasetId?: string;
  changeType?: ChangeType;
  sourceParams?: { [key: string]: string | undefined };
  formatParams?: { [key: string]: string | undefined };
  createTime?: number;
  status?: IngestionStatus;
  errorInfo?: ChangesetErrorInfo;
  activeUntilTimestamp?: number;
  activeFromTimestamp?: number;
  updatesChangesetId?: string;
  updatedByChangesetId?: string;
}
export const ChangesetSummary = S.suspend(() =>
  S.Struct({
    changesetId: S.optional(S.String),
    changesetArn: S.optional(S.String),
    datasetId: S.optional(S.String),
    changeType: S.optional(ChangeType),
    sourceParams: S.optional(SourceParams),
    formatParams: S.optional(FormatParams),
    createTime: S.optional(S.Number),
    status: S.optional(IngestionStatus),
    errorInfo: S.optional(ChangesetErrorInfo),
    activeUntilTimestamp: S.optional(S.Number),
    activeFromTimestamp: S.optional(S.Number),
    updatesChangesetId: S.optional(S.String),
    updatedByChangesetId: S.optional(S.String),
  }),
).annotations({
  identifier: "ChangesetSummary",
}) as any as S.Schema<ChangesetSummary>;
export type ChangesetList = ChangesetSummary[];
export const ChangesetList = S.Array(ChangesetSummary);
export interface Dataset {
  datasetId?: string;
  datasetArn?: string;
  datasetTitle?: string;
  kind?: DatasetKind;
  datasetDescription?: string;
  ownerInfo?: DatasetOwnerInfo;
  createTime?: number;
  lastModifiedTime?: number;
  schemaDefinition?: SchemaUnion;
  alias?: string;
}
export const Dataset = S.suspend(() =>
  S.Struct({
    datasetId: S.optional(S.String),
    datasetArn: S.optional(S.String),
    datasetTitle: S.optional(S.String),
    kind: S.optional(DatasetKind),
    datasetDescription: S.optional(S.String),
    ownerInfo: S.optional(DatasetOwnerInfo),
    createTime: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
    schemaDefinition: S.optional(SchemaUnion),
    alias: S.optional(S.String),
  }),
).annotations({ identifier: "Dataset" }) as any as S.Schema<Dataset>;
export type DatasetList = Dataset[];
export const DatasetList = S.Array(Dataset);
export interface DataViewSummary {
  dataViewId?: string;
  dataViewArn?: string;
  datasetId?: string;
  asOfTimestamp?: number;
  partitionColumns?: string[];
  sortColumns?: string[];
  status?: DataViewStatus;
  errorInfo?: DataViewErrorInfo;
  destinationTypeProperties?: DataViewDestinationTypeParams;
  autoUpdate?: boolean;
  createTime?: number;
  lastModifiedTime?: number;
}
export const DataViewSummary = S.suspend(() =>
  S.Struct({
    dataViewId: S.optional(S.String),
    dataViewArn: S.optional(S.String),
    datasetId: S.optional(S.String),
    asOfTimestamp: S.optional(S.Number),
    partitionColumns: S.optional(PartitionColumnList),
    sortColumns: S.optional(SortColumnList),
    status: S.optional(DataViewStatus),
    errorInfo: S.optional(DataViewErrorInfo),
    destinationTypeProperties: S.optional(DataViewDestinationTypeParams),
    autoUpdate: S.optional(S.Boolean),
    createTime: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataViewSummary",
}) as any as S.Schema<DataViewSummary>;
export type DataViewList = DataViewSummary[];
export const DataViewList = S.Array(DataViewSummary);
export interface PermissionGroupByUser {
  permissionGroupId?: string;
  name?: string | redacted.Redacted<string>;
  membershipStatus?: PermissionGroupMembershipStatus;
}
export const PermissionGroupByUser = S.suspend(() =>
  S.Struct({
    permissionGroupId: S.optional(S.String),
    name: S.optional(SensitiveString),
    membershipStatus: S.optional(PermissionGroupMembershipStatus),
  }),
).annotations({
  identifier: "PermissionGroupByUser",
}) as any as S.Schema<PermissionGroupByUser>;
export type PermissionGroupByUserList = PermissionGroupByUser[];
export const PermissionGroupByUserList = S.Array(PermissionGroupByUser);
export interface User {
  userId?: string;
  status?: UserStatus;
  firstName?: string | redacted.Redacted<string>;
  lastName?: string | redacted.Redacted<string>;
  emailAddress?: string | redacted.Redacted<string>;
  type?: UserType;
  apiAccess?: ApiAccess;
  apiAccessPrincipalArn?: string;
  createTime?: number;
  lastEnabledTime?: number;
  lastDisabledTime?: number;
  lastModifiedTime?: number;
  lastLoginTime?: number;
}
export const User = S.suspend(() =>
  S.Struct({
    userId: S.optional(S.String),
    status: S.optional(UserStatus),
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    emailAddress: S.optional(SensitiveString),
    type: S.optional(UserType),
    apiAccess: S.optional(ApiAccess),
    apiAccessPrincipalArn: S.optional(S.String),
    createTime: S.optional(S.Number),
    lastEnabledTime: S.optional(S.Number),
    lastDisabledTime: S.optional(S.Number),
    lastModifiedTime: S.optional(S.Number),
    lastLoginTime: S.optional(S.Number),
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type UserList = User[];
export const UserList = S.Array(User);
export interface UserByPermissionGroup {
  userId?: string;
  status?: UserStatus;
  firstName?: string | redacted.Redacted<string>;
  lastName?: string | redacted.Redacted<string>;
  emailAddress?: string | redacted.Redacted<string>;
  type?: UserType;
  apiAccess?: ApiAccess;
  apiAccessPrincipalArn?: string;
  membershipStatus?: PermissionGroupMembershipStatus;
}
export const UserByPermissionGroup = S.suspend(() =>
  S.Struct({
    userId: S.optional(S.String),
    status: S.optional(UserStatus),
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    emailAddress: S.optional(SensitiveString),
    type: S.optional(UserType),
    apiAccess: S.optional(ApiAccess),
    apiAccessPrincipalArn: S.optional(S.String),
    membershipStatus: S.optional(PermissionGroupMembershipStatus),
  }),
).annotations({
  identifier: "UserByPermissionGroup",
}) as any as S.Schema<UserByPermissionGroup>;
export type UserByPermissionGroupList = UserByPermissionGroup[];
export const UserByPermissionGroupList = S.Array(UserByPermissionGroup);
export interface CreateChangesetResponse {
  datasetId?: string;
  changesetId?: string;
}
export const CreateChangesetResponse = S.suspend(() =>
  S.Struct({
    datasetId: S.optional(S.String),
    changesetId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateChangesetResponse",
}) as any as S.Schema<CreateChangesetResponse>;
export interface CreateDataViewRequest {
  clientToken?: string;
  datasetId: string;
  autoUpdate?: boolean;
  sortColumns?: string[];
  partitionColumns?: string[];
  asOfTimestamp?: number;
  destinationTypeParams: DataViewDestinationTypeParams;
}
export const CreateDataViewRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
    autoUpdate: S.optional(S.Boolean),
    sortColumns: S.optional(SortColumnList),
    partitionColumns: S.optional(PartitionColumnList),
    asOfTimestamp: S.optional(S.Number),
    destinationTypeParams: DataViewDestinationTypeParams,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasets/{datasetId}/dataviewsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataViewRequest",
}) as any as S.Schema<CreateDataViewRequest>;
export interface GetChangesetResponse {
  changesetId?: string;
  changesetArn?: string;
  datasetId?: string;
  changeType?: ChangeType;
  sourceParams?: { [key: string]: string | undefined };
  formatParams?: { [key: string]: string | undefined };
  createTime?: number;
  status?: IngestionStatus;
  errorInfo?: ChangesetErrorInfo;
  activeUntilTimestamp?: number;
  activeFromTimestamp?: number;
  updatesChangesetId?: string;
  updatedByChangesetId?: string;
}
export const GetChangesetResponse = S.suspend(() =>
  S.Struct({
    changesetId: S.optional(S.String),
    changesetArn: S.optional(S.String),
    datasetId: S.optional(S.String),
    changeType: S.optional(ChangeType),
    sourceParams: S.optional(SourceParams),
    formatParams: S.optional(FormatParams),
    createTime: S.optional(S.Number),
    status: S.optional(IngestionStatus),
    errorInfo: S.optional(ChangesetErrorInfo),
    activeUntilTimestamp: S.optional(S.Number),
    activeFromTimestamp: S.optional(S.Number),
    updatesChangesetId: S.optional(S.String),
    updatedByChangesetId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetChangesetResponse",
}) as any as S.Schema<GetChangesetResponse>;
export interface GetDataViewResponse {
  autoUpdate?: boolean;
  partitionColumns?: string[];
  datasetId?: string;
  asOfTimestamp?: number;
  errorInfo?: DataViewErrorInfo;
  lastModifiedTime?: number;
  createTime?: number;
  sortColumns?: string[];
  dataViewId?: string;
  dataViewArn?: string;
  destinationTypeParams?: DataViewDestinationTypeParams;
  status?: DataViewStatus;
}
export const GetDataViewResponse = S.suspend(() =>
  S.Struct({
    autoUpdate: S.optional(S.Boolean),
    partitionColumns: S.optional(PartitionColumnList),
    datasetId: S.optional(S.String),
    asOfTimestamp: S.optional(S.Number),
    errorInfo: S.optional(DataViewErrorInfo),
    lastModifiedTime: S.optional(S.Number),
    createTime: S.optional(S.Number),
    sortColumns: S.optional(SortColumnList),
    dataViewId: S.optional(S.String),
    dataViewArn: S.optional(S.String),
    destinationTypeParams: S.optional(DataViewDestinationTypeParams),
    status: S.optional(DataViewStatus),
  }),
).annotations({
  identifier: "GetDataViewResponse",
}) as any as S.Schema<GetDataViewResponse>;
export interface GetExternalDataViewAccessDetailsResponse {
  credentials?: AwsCredentials;
  s3Location?: S3Location;
}
export const GetExternalDataViewAccessDetailsResponse = S.suspend(() =>
  S.Struct({
    credentials: S.optional(AwsCredentials),
    s3Location: S.optional(S3Location),
  }),
).annotations({
  identifier: "GetExternalDataViewAccessDetailsResponse",
}) as any as S.Schema<GetExternalDataViewAccessDetailsResponse>;
export interface GetPermissionGroupResponse {
  permissionGroup?: PermissionGroup;
}
export const GetPermissionGroupResponse = S.suspend(() =>
  S.Struct({ permissionGroup: S.optional(PermissionGroup) }),
).annotations({
  identifier: "GetPermissionGroupResponse",
}) as any as S.Schema<GetPermissionGroupResponse>;
export interface GetProgrammaticAccessCredentialsResponse {
  credentials?: Credentials;
  durationInMinutes?: number;
}
export const GetProgrammaticAccessCredentialsResponse = S.suspend(() =>
  S.Struct({
    credentials: S.optional(Credentials),
    durationInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetProgrammaticAccessCredentialsResponse",
}) as any as S.Schema<GetProgrammaticAccessCredentialsResponse>;
export interface ListChangesetsResponse {
  changesets?: ChangesetSummary[];
  nextToken?: string;
}
export const ListChangesetsResponse = S.suspend(() =>
  S.Struct({
    changesets: S.optional(ChangesetList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChangesetsResponse",
}) as any as S.Schema<ListChangesetsResponse>;
export interface ListDatasetsResponse {
  datasets?: Dataset[];
  nextToken?: string;
}
export const ListDatasetsResponse = S.suspend(() =>
  S.Struct({
    datasets: S.optional(DatasetList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatasetsResponse",
}) as any as S.Schema<ListDatasetsResponse>;
export interface ListDataViewsResponse {
  nextToken?: string;
  dataViews?: DataViewSummary[];
}
export const ListDataViewsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    dataViews: S.optional(DataViewList),
  }),
).annotations({
  identifier: "ListDataViewsResponse",
}) as any as S.Schema<ListDataViewsResponse>;
export interface ListPermissionGroupsByUserResponse {
  permissionGroups?: PermissionGroupByUser[];
  nextToken?: string;
}
export const ListPermissionGroupsByUserResponse = S.suspend(() =>
  S.Struct({
    permissionGroups: S.optional(PermissionGroupByUserList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPermissionGroupsByUserResponse",
}) as any as S.Schema<ListPermissionGroupsByUserResponse>;
export interface ListUsersResponse {
  users?: User[];
  nextToken?: string;
}
export const ListUsersResponse = S.suspend(() =>
  S.Struct({ users: S.optional(UserList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListUsersResponse",
}) as any as S.Schema<ListUsersResponse>;
export interface ListUsersByPermissionGroupResponse {
  users?: UserByPermissionGroup[];
  nextToken?: string;
}
export const ListUsersByPermissionGroupResponse = S.suspend(() =>
  S.Struct({
    users: S.optional(UserByPermissionGroupList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUsersByPermissionGroupResponse",
}) as any as S.Schema<ListUsersByPermissionGroupResponse>;
export interface CreateDatasetRequest {
  clientToken?: string;
  datasetTitle: string;
  kind: DatasetKind;
  datasetDescription?: string;
  ownerInfo?: DatasetOwnerInfo;
  permissionGroupParams: PermissionGroupParams;
  alias?: string;
  schemaDefinition?: SchemaUnion;
}
export const CreateDatasetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    datasetTitle: S.String,
    kind: DatasetKind,
    datasetDescription: S.optional(S.String),
    ownerInfo: S.optional(DatasetOwnerInfo),
    permissionGroupParams: PermissionGroupParams,
    alias: S.optional(S.String),
    schemaDefinition: S.optional(SchemaUnion),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasetsv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDatasetRequest",
}) as any as S.Schema<CreateDatasetRequest>;
export interface CreateDataViewResponse {
  datasetId?: string;
  dataViewId?: string;
}
export const CreateDataViewResponse = S.suspend(() =>
  S.Struct({
    datasetId: S.optional(S.String),
    dataViewId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDataViewResponse",
}) as any as S.Schema<CreateDataViewResponse>;
export interface CreateDatasetResponse {
  datasetId?: string;
}
export const CreateDatasetResponse = S.suspend(() =>
  S.Struct({ datasetId: S.optional(S.String) }),
).annotations({
  identifier: "CreateDatasetResponse",
}) as any as S.Schema<CreateDatasetResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String), reason: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String), reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Request programmatic credentials to use with FinSpace SDK. For more information, see Step 2. Access credentials programmatically using IAM access key id and secret access key.
 */
export const getProgrammaticAccessCredentials: (
  input: GetProgrammaticAccessCredentialsRequest,
) => effect.Effect<
  GetProgrammaticAccessCredentialsResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProgrammaticAccessCredentialsRequest,
  output: GetProgrammaticAccessCredentialsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get information about a Changeset.
 */
export const getChangeset: (
  input: GetChangesetRequest,
) => effect.Effect<
  GetChangesetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChangesetRequest,
  output: GetChangesetResponse,
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
 * Gets information about a Dataview.
 */
export const getDataView: (
  input: GetDataViewRequest,
) => effect.Effect<
  GetDataViewResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataViewRequest,
  output: GetDataViewResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the FinSpace Changesets for a Dataset.
 */
export const listChangesets: {
  (
    input: ListChangesetsRequest,
  ): effect.Effect<
    ListChangesetsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChangesetsRequest,
  ) => stream.Stream<
    ListChangesetsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChangesetsRequest,
  ) => stream.Stream<
    ChangesetSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChangesetsRequest,
  output: ListChangesetsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "changesets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all of the active Datasets that a user has access to.
 */
export const listDatasets: {
  (
    input: ListDatasetsRequest,
  ): effect.Effect<
    ListDatasetsResponse,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    ListDatasetsResponse,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    Dataset,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "datasets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all available Dataviews for a Dataset.
 */
export const listDataViews: {
  (
    input: ListDataViewsRequest,
  ): effect.Effect<
    ListDataViewsResponse,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataViewsRequest,
  ) => stream.Stream<
    ListDataViewsResponse,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataViewsRequest,
  ) => stream.Stream<
    DataViewSummary,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataViewsRequest,
  output: ListDataViewsResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "dataViews",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Denies access to the FinSpace web application and API for the specified user.
 */
export const disableUser: (
  input: DisableUserRequest,
) => effect.Effect<
  DisableUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableUserRequest,
  output: DisableUserResponse,
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
 * Removes a user from a permission group.
 */
export const disassociateUserFromPermissionGroup: (
  input: DisassociateUserFromPermissionGroupRequest,
) => effect.Effect<
  DisassociateUserFromPermissionGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateUserFromPermissionGroupRequest,
  output: DisassociateUserFromPermissionGroupResponse,
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
 * Returns information about a Dataset.
 */
export const getDataset: (
  input: GetDatasetRequest,
) => effect.Effect<
  GetDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDatasetRequest,
  output: GetDatasetResponse,
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
 * Resets the password for a specified user ID and generates a temporary one. Only a superuser can reset password for other users. Resetting the password immediately invalidates the previous password associated with the user.
 */
export const resetUserPassword: (
  input: ResetUserPasswordRequest,
) => effect.Effect<
  ResetUserPasswordResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetUserPasswordRequest,
  output: ResetUserPasswordResponse,
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
 * Updates a FinSpace Changeset.
 */
export const updateChangeset: (
  input: UpdateChangesetRequest,
) => effect.Effect<
  UpdateChangesetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChangesetRequest,
  output: UpdateChangesetResponse,
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
 * Updates a FinSpace Dataset.
 */
export const updateDataset: (
  input: UpdateDatasetRequest,
) => effect.Effect<
  UpdateDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetRequest,
  output: UpdateDatasetResponse,
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
 * Modifies the details of a permission group. You cannot modify a `permissionGroupID`.
 */
export const updatePermissionGroup: (
  input: UpdatePermissionGroupRequest,
) => effect.Effect<
  UpdatePermissionGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePermissionGroupRequest,
  output: UpdatePermissionGroupResponse,
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
 * Modifies the details of the specified user. You cannot update the `userId` for a user.
 */
export const updateUser: (
  input: UpdateUserRequest,
) => effect.Effect<
  UpdateUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
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
 * Retrieves the details of a specific permission group.
 */
export const getPermissionGroup: (
  input: GetPermissionGroupRequest,
) => effect.Effect<
  GetPermissionGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPermissionGroupRequest,
  output: GetPermissionGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the permission groups that are associated with a specific user.
 */
export const listPermissionGroupsByUser: (
  input: ListPermissionGroupsByUserRequest,
) => effect.Effect<
  ListPermissionGroupsByUserResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPermissionGroupsByUserRequest,
  output: ListPermissionGroupsByUserResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists details of all the users in a specific permission group.
 */
export const listUsersByPermissionGroup: (
  input: ListUsersByPermissionGroupRequest,
) => effect.Effect<
  ListUsersByPermissionGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUsersByPermissionGroupRequest,
  output: ListUsersByPermissionGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details for a specific user.
 */
export const getUser: (
  input: GetUserRequest,
) => effect.Effect<
  GetUserResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserRequest,
  output: GetUserResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a user to a permission group to grant permissions for actions a user can perform in FinSpace.
 */
export const associateUserToPermissionGroup: (
  input: AssociateUserToPermissionGroupRequest,
) => effect.Effect<
  AssociateUserToPermissionGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateUserToPermissionGroupRequest,
  output: AssociateUserToPermissionGroupResponse,
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
 * Creates a group of permissions for various actions that a user can perform in FinSpace.
 */
export const createPermissionGroup: (
  input: CreatePermissionGroupRequest,
) => effect.Effect<
  CreatePermissionGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePermissionGroupRequest,
  output: CreatePermissionGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new user in FinSpace.
 */
export const createUser: (
  input: CreateUserRequest,
) => effect.Effect<
  CreateUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a FinSpace Dataset.
 */
export const deleteDataset: (
  input: DeleteDatasetRequest,
) => effect.Effect<
  DeleteDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a permission group. This action is irreversible.
 */
export const deletePermissionGroup: (
  input: DeletePermissionGroupRequest,
) => effect.Effect<
  DeletePermissionGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePermissionGroupRequest,
  output: DeletePermissionGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Allows the specified user to access the FinSpace web application and API.
 */
export const enableUser: (
  input: EnableUserRequest,
) => effect.Effect<
  EnableUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableUserRequest,
  output: EnableUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a Dataview for a Dataset.
 */
export const createDataView: (
  input: CreateDataViewRequest,
) => effect.Effect<
  CreateDataViewResponse,
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataViewRequest,
  output: CreateDataViewResponse,
  errors: [
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new FinSpace Dataset.
 */
export const createDataset: (
  input: CreateDatasetRequest,
) => effect.Effect<
  CreateDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all available users in FinSpace.
 */
export const listUsers: {
  (
    input: ListUsersRequest,
  ): effect.Effect<
    ListUsersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsersRequest,
  ) => stream.Stream<
    ListUsersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsersRequest,
  ) => stream.Stream<
    User,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "users",
    pageSize: "maxResults",
  } as const,
}));
/**
 * A temporary Amazon S3 location, where you can copy your files from a source location to stage or use
 * as a scratch space in FinSpace notebook.
 */
export const getWorkingLocation: (
  input: GetWorkingLocationRequest,
) => effect.Effect<
  GetWorkingLocationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkingLocationRequest,
  output: GetWorkingLocationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all available permission groups in FinSpace.
 */
export const listPermissionGroups: {
  (
    input: ListPermissionGroupsRequest,
  ): effect.Effect<
    ListPermissionGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPermissionGroupsRequest,
  ) => stream.Stream<
    ListPermissionGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPermissionGroupsRequest,
  ) => stream.Stream<
    PermissionGroup,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPermissionGroupsRequest,
  output: ListPermissionGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "permissionGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the credentials to access the external Dataview from an S3 location. To call this API:
 *
 * - You must retrieve the programmatic credentials.
 *
 * - You must be a member of a FinSpace user group, where the dataset that you want to access has `Read Dataset Data` permissions.
 */
export const getExternalDataViewAccessDetails: (
  input: GetExternalDataViewAccessDetailsRequest,
) => effect.Effect<
  GetExternalDataViewAccessDetailsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExternalDataViewAccessDetailsRequest,
  output: GetExternalDataViewAccessDetailsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Changeset in a FinSpace Dataset.
 */
export const createChangeset: (
  input: CreateChangesetRequest,
) => effect.Effect<
  CreateChangesetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChangesetRequest,
  output: CreateChangesetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
