import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "finspace data",
  serviceShapeName: "AWSHabaneroPublicAPI",
});
const auth = T.AwsAuthSigv4({ name: "finspace-api" });
const ver = T.ServiceVersion("2020-07-13");
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
                        url: "https://finspace-api-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://finspace-api-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://finspace-api.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://finspace-api.{Region}.{PartitionResult#dnsSuffix}",
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
export const SortColumnList = S.Array(S.String);
export const PartitionColumnList = S.Array(S.String);
export const ApplicationPermissionList = S.Array(S.String);
export class AssociateUserToPermissionGroupRequest extends S.Class<AssociateUserToPermissionGroupRequest>(
  "AssociateUserToPermissionGroupRequest",
)(
  {
    permissionGroupId: S.String.pipe(T.HttpLabel()),
    userId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String),
  },
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
) {}
export class CreatePermissionGroupRequest extends S.Class<CreatePermissionGroupRequest>(
  "CreatePermissionGroupRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    applicationPermissions: ApplicationPermissionList,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/permission-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    emailAddress: S.String,
    type: S.String,
    firstName: S.optional(S.String),
    lastName: S.optional(S.String),
    apiAccess: S.optional(S.String),
    apiAccessPrincipalArn: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/user" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatasetRequest extends S.Class<DeleteDatasetRequest>(
  "DeleteDatasetRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    datasetId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/datasetsv2/{datasetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePermissionGroupRequest extends S.Class<DeletePermissionGroupRequest>(
  "DeletePermissionGroupRequest",
)(
  {
    permissionGroupId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/permission-group/{permissionGroupId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableUserRequest extends S.Class<DisableUserRequest>(
  "DisableUserRequest",
)(
  { userId: S.String.pipe(T.HttpLabel()), clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/user/{userId}/disable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateUserFromPermissionGroupRequest extends S.Class<DisassociateUserFromPermissionGroupRequest>(
  "DisassociateUserFromPermissionGroupRequest",
)(
  {
    permissionGroupId: S.String.pipe(T.HttpLabel()),
    userId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
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
) {}
export class EnableUserRequest extends S.Class<EnableUserRequest>(
  "EnableUserRequest",
)(
  { userId: S.String.pipe(T.HttpLabel()), clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/user/{userId}/enable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChangesetRequest extends S.Class<GetChangesetRequest>(
  "GetChangesetRequest",
)(
  {
    datasetId: S.String.pipe(T.HttpLabel()),
    changesetId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetDatasetRequest extends S.Class<GetDatasetRequest>(
  "GetDatasetRequest",
)(
  { datasetId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/datasetsv2/{datasetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataViewRequest extends S.Class<GetDataViewRequest>(
  "GetDataViewRequest",
)(
  {
    dataViewId: S.String.pipe(T.HttpLabel()),
    datasetId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetExternalDataViewAccessDetailsRequest extends S.Class<GetExternalDataViewAccessDetailsRequest>(
  "GetExternalDataViewAccessDetailsRequest",
)(
  {
    dataViewId: S.String.pipe(T.HttpLabel()),
    datasetId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetPermissionGroupRequest extends S.Class<GetPermissionGroupRequest>(
  "GetPermissionGroupRequest",
)(
  { permissionGroupId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/permission-group/{permissionGroupId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProgrammaticAccessCredentialsRequest extends S.Class<GetProgrammaticAccessCredentialsRequest>(
  "GetProgrammaticAccessCredentialsRequest",
)(
  {
    durationInMinutes: S.optional(S.Number).pipe(
      T.HttpQuery("durationInMinutes"),
    ),
    environmentId: S.String.pipe(T.HttpQuery("environmentId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/credentials/programmatic" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUserRequest extends S.Class<GetUserRequest>("GetUserRequest")(
  { userId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/user/{userId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkingLocationRequest extends S.Class<GetWorkingLocationRequest>(
  "GetWorkingLocationRequest",
)(
  { locationType: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/workingLocationV1" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListChangesetsRequest extends S.Class<ListChangesetsRequest>(
  "ListChangesetsRequest",
)(
  {
    datasetId: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/datasets/{datasetId}/changesetsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDatasetsRequest extends S.Class<ListDatasetsRequest>(
  "ListDatasetsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/datasetsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataViewsRequest extends S.Class<ListDataViewsRequest>(
  "ListDataViewsRequest",
)(
  {
    datasetId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/datasets/{datasetId}/dataviewsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPermissionGroupsRequest extends S.Class<ListPermissionGroupsRequest>(
  "ListPermissionGroupsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/permission-group" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPermissionGroupsByUserRequest extends S.Class<ListPermissionGroupsByUserRequest>(
  "ListPermissionGroupsByUserRequest",
)(
  {
    userId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/user/{userId}/permission-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "GET", uri: "/user" }), svc, auth, proto, ver, rules),
) {}
export class ListUsersByPermissionGroupRequest extends S.Class<ListUsersByPermissionGroupRequest>(
  "ListUsersByPermissionGroupRequest",
)(
  {
    permissionGroupId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.Number.pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ResetUserPasswordRequest extends S.Class<ResetUserPasswordRequest>(
  "ResetUserPasswordRequest",
)(
  { userId: S.String.pipe(T.HttpLabel()), clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/user/{userId}/password" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SourceParams = S.Record({ key: S.String, value: S.String });
export const FormatParams = S.Record({ key: S.String, value: S.String });
export class UpdateChangesetRequest extends S.Class<UpdateChangesetRequest>(
  "UpdateChangesetRequest",
)(
  {
    clientToken: S.optional(S.String),
    datasetId: S.String.pipe(T.HttpLabel()),
    changesetId: S.String.pipe(T.HttpLabel()),
    sourceParams: SourceParams,
    formatParams: FormatParams,
  },
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
) {}
export class ColumnDefinition extends S.Class<ColumnDefinition>(
  "ColumnDefinition",
)({
  dataType: S.optional(S.String),
  columnName: S.optional(S.String),
  columnDescription: S.optional(S.String),
}) {}
export const ColumnList = S.Array(ColumnDefinition);
export const ColumnNameList = S.Array(S.String);
export class SchemaDefinition extends S.Class<SchemaDefinition>(
  "SchemaDefinition",
)({
  columns: S.optional(ColumnList),
  primaryKeyColumns: S.optional(ColumnNameList),
}) {}
export class SchemaUnion extends S.Class<SchemaUnion>("SchemaUnion")({
  tabularSchemaConfig: S.optional(SchemaDefinition),
}) {}
export class UpdateDatasetRequest extends S.Class<UpdateDatasetRequest>(
  "UpdateDatasetRequest",
)(
  {
    clientToken: S.optional(S.String),
    datasetId: S.String.pipe(T.HttpLabel()),
    datasetTitle: S.String,
    kind: S.String,
    datasetDescription: S.optional(S.String),
    alias: S.optional(S.String),
    schemaDefinition: S.optional(SchemaUnion),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/datasetsv2/{datasetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePermissionGroupRequest extends S.Class<UpdatePermissionGroupRequest>(
  "UpdatePermissionGroupRequest",
)(
  {
    permissionGroupId: S.String.pipe(T.HttpLabel()),
    name: S.optional(S.String),
    description: S.optional(S.String),
    applicationPermissions: S.optional(ApplicationPermissionList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/permission-group/{permissionGroupId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    userId: S.String.pipe(T.HttpLabel()),
    type: S.optional(S.String),
    firstName: S.optional(S.String),
    lastName: S.optional(S.String),
    apiAccess: S.optional(S.String),
    apiAccessPrincipalArn: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/user/{userId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DatasetOwnerInfo extends S.Class<DatasetOwnerInfo>(
  "DatasetOwnerInfo",
)({
  name: S.optional(S.String),
  phoneNumber: S.optional(S.String),
  email: S.optional(S.String),
}) {}
export class PermissionGroup extends S.Class<PermissionGroup>(
  "PermissionGroup",
)({
  permissionGroupId: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  applicationPermissions: S.optional(ApplicationPermissionList),
  createTime: S.optional(S.Number),
  lastModifiedTime: S.optional(S.Number),
  membershipStatus: S.optional(S.String),
}) {}
export const PermissionGroupList = S.Array(PermissionGroup);
export class AssociateUserToPermissionGroupResponse extends S.Class<AssociateUserToPermissionGroupResponse>(
  "AssociateUserToPermissionGroupResponse",
)({ statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()) }) {}
export class CreateChangesetRequest extends S.Class<CreateChangesetRequest>(
  "CreateChangesetRequest",
)(
  {
    clientToken: S.optional(S.String),
    datasetId: S.String.pipe(T.HttpLabel()),
    changeType: S.String,
    sourceParams: SourceParams,
    formatParams: FormatParams,
  },
  T.all(
    T.Http({ method: "POST", uri: "/datasets/{datasetId}/changesetsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePermissionGroupResponse extends S.Class<CreatePermissionGroupResponse>(
  "CreatePermissionGroupResponse",
)({ permissionGroupId: S.optional(S.String) }) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({ userId: S.optional(S.String) }) {}
export class DeleteDatasetResponse extends S.Class<DeleteDatasetResponse>(
  "DeleteDatasetResponse",
)({ datasetId: S.optional(S.String) }) {}
export class DeletePermissionGroupResponse extends S.Class<DeletePermissionGroupResponse>(
  "DeletePermissionGroupResponse",
)({ permissionGroupId: S.optional(S.String) }) {}
export class DisableUserResponse extends S.Class<DisableUserResponse>(
  "DisableUserResponse",
)({ userId: S.optional(S.String) }) {}
export class DisassociateUserFromPermissionGroupResponse extends S.Class<DisassociateUserFromPermissionGroupResponse>(
  "DisassociateUserFromPermissionGroupResponse",
)({ statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()) }) {}
export class EnableUserResponse extends S.Class<EnableUserResponse>(
  "EnableUserResponse",
)({ userId: S.optional(S.String) }) {}
export class GetDatasetResponse extends S.Class<GetDatasetResponse>(
  "GetDatasetResponse",
)({
  datasetId: S.optional(S.String),
  datasetArn: S.optional(S.String),
  datasetTitle: S.optional(S.String),
  kind: S.optional(S.String),
  datasetDescription: S.optional(S.String),
  createTime: S.optional(S.Number),
  lastModifiedTime: S.optional(S.Number),
  schemaDefinition: S.optional(SchemaUnion),
  alias: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class GetUserResponse extends S.Class<GetUserResponse>(
  "GetUserResponse",
)({
  userId: S.optional(S.String),
  status: S.optional(S.String),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  emailAddress: S.optional(S.String),
  type: S.optional(S.String),
  apiAccess: S.optional(S.String),
  apiAccessPrincipalArn: S.optional(S.String),
  createTime: S.optional(S.Number),
  lastEnabledTime: S.optional(S.Number),
  lastDisabledTime: S.optional(S.Number),
  lastModifiedTime: S.optional(S.Number),
  lastLoginTime: S.optional(S.Number),
}) {}
export class GetWorkingLocationResponse extends S.Class<GetWorkingLocationResponse>(
  "GetWorkingLocationResponse",
)({
  s3Uri: S.optional(S.String),
  s3Path: S.optional(S.String),
  s3Bucket: S.optional(S.String),
}) {}
export class ListPermissionGroupsResponse extends S.Class<ListPermissionGroupsResponse>(
  "ListPermissionGroupsResponse",
)({
  permissionGroups: S.optional(PermissionGroupList),
  nextToken: S.optional(S.String),
}) {}
export class ResetUserPasswordResponse extends S.Class<ResetUserPasswordResponse>(
  "ResetUserPasswordResponse",
)({ userId: S.optional(S.String), temporaryPassword: S.optional(S.String) }) {}
export class UpdateChangesetResponse extends S.Class<UpdateChangesetResponse>(
  "UpdateChangesetResponse",
)({ changesetId: S.optional(S.String), datasetId: S.optional(S.String) }) {}
export class UpdateDatasetResponse extends S.Class<UpdateDatasetResponse>(
  "UpdateDatasetResponse",
)({ datasetId: S.optional(S.String) }) {}
export class UpdatePermissionGroupResponse extends S.Class<UpdatePermissionGroupResponse>(
  "UpdatePermissionGroupResponse",
)({ permissionGroupId: S.optional(S.String) }) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({ userId: S.optional(S.String) }) {}
export class ResourcePermission extends S.Class<ResourcePermission>(
  "ResourcePermission",
)({ permission: S.optional(S.String) }) {}
export const ResourcePermissionsList = S.Array(ResourcePermission);
export const S3DestinationFormatOptions = S.Record({
  key: S.String,
  value: S.String,
});
export class PermissionGroupParams extends S.Class<PermissionGroupParams>(
  "PermissionGroupParams",
)({
  permissionGroupId: S.optional(S.String),
  datasetPermissions: S.optional(ResourcePermissionsList),
}) {}
export class DataViewDestinationTypeParams extends S.Class<DataViewDestinationTypeParams>(
  "DataViewDestinationTypeParams",
)({
  destinationType: S.String,
  s3DestinationExportFileFormat: S.optional(S.String),
  s3DestinationExportFileFormatOptions: S.optional(S3DestinationFormatOptions),
}) {}
export class ChangesetErrorInfo extends S.Class<ChangesetErrorInfo>(
  "ChangesetErrorInfo",
)({
  errorMessage: S.optional(S.String),
  errorCategory: S.optional(S.String),
}) {}
export class DataViewErrorInfo extends S.Class<DataViewErrorInfo>(
  "DataViewErrorInfo",
)({
  errorMessage: S.optional(S.String),
  errorCategory: S.optional(S.String),
}) {}
export class AwsCredentials extends S.Class<AwsCredentials>("AwsCredentials")({
  accessKeyId: S.optional(S.String),
  secretAccessKey: S.optional(S.String),
  sessionToken: S.optional(S.String),
  expiration: S.optional(S.Number),
}) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucket: S.String,
  key: S.String,
}) {}
export class Credentials extends S.Class<Credentials>("Credentials")({
  accessKeyId: S.optional(S.String),
  secretAccessKey: S.optional(S.String),
  sessionToken: S.optional(S.String),
}) {}
export class ChangesetSummary extends S.Class<ChangesetSummary>(
  "ChangesetSummary",
)({
  changesetId: S.optional(S.String),
  changesetArn: S.optional(S.String),
  datasetId: S.optional(S.String),
  changeType: S.optional(S.String),
  sourceParams: S.optional(SourceParams),
  formatParams: S.optional(FormatParams),
  createTime: S.optional(S.Number),
  status: S.optional(S.String),
  errorInfo: S.optional(ChangesetErrorInfo),
  activeUntilTimestamp: S.optional(S.Number),
  activeFromTimestamp: S.optional(S.Number),
  updatesChangesetId: S.optional(S.String),
  updatedByChangesetId: S.optional(S.String),
}) {}
export const ChangesetList = S.Array(ChangesetSummary);
export class Dataset extends S.Class<Dataset>("Dataset")({
  datasetId: S.optional(S.String),
  datasetArn: S.optional(S.String),
  datasetTitle: S.optional(S.String),
  kind: S.optional(S.String),
  datasetDescription: S.optional(S.String),
  ownerInfo: S.optional(DatasetOwnerInfo),
  createTime: S.optional(S.Number),
  lastModifiedTime: S.optional(S.Number),
  schemaDefinition: S.optional(SchemaUnion),
  alias: S.optional(S.String),
}) {}
export const DatasetList = S.Array(Dataset);
export class DataViewSummary extends S.Class<DataViewSummary>(
  "DataViewSummary",
)({
  dataViewId: S.optional(S.String),
  dataViewArn: S.optional(S.String),
  datasetId: S.optional(S.String),
  asOfTimestamp: S.optional(S.Number),
  partitionColumns: S.optional(PartitionColumnList),
  sortColumns: S.optional(SortColumnList),
  status: S.optional(S.String),
  errorInfo: S.optional(DataViewErrorInfo),
  destinationTypeProperties: S.optional(DataViewDestinationTypeParams),
  autoUpdate: S.optional(S.Boolean),
  createTime: S.optional(S.Number),
  lastModifiedTime: S.optional(S.Number),
}) {}
export const DataViewList = S.Array(DataViewSummary);
export class PermissionGroupByUser extends S.Class<PermissionGroupByUser>(
  "PermissionGroupByUser",
)({
  permissionGroupId: S.optional(S.String),
  name: S.optional(S.String),
  membershipStatus: S.optional(S.String),
}) {}
export const PermissionGroupByUserList = S.Array(PermissionGroupByUser);
export class User extends S.Class<User>("User")({
  userId: S.optional(S.String),
  status: S.optional(S.String),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  emailAddress: S.optional(S.String),
  type: S.optional(S.String),
  apiAccess: S.optional(S.String),
  apiAccessPrincipalArn: S.optional(S.String),
  createTime: S.optional(S.Number),
  lastEnabledTime: S.optional(S.Number),
  lastDisabledTime: S.optional(S.Number),
  lastModifiedTime: S.optional(S.Number),
  lastLoginTime: S.optional(S.Number),
}) {}
export const UserList = S.Array(User);
export class UserByPermissionGroup extends S.Class<UserByPermissionGroup>(
  "UserByPermissionGroup",
)({
  userId: S.optional(S.String),
  status: S.optional(S.String),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  emailAddress: S.optional(S.String),
  type: S.optional(S.String),
  apiAccess: S.optional(S.String),
  apiAccessPrincipalArn: S.optional(S.String),
  membershipStatus: S.optional(S.String),
}) {}
export const UserByPermissionGroupList = S.Array(UserByPermissionGroup);
export class CreateChangesetResponse extends S.Class<CreateChangesetResponse>(
  "CreateChangesetResponse",
)({ datasetId: S.optional(S.String), changesetId: S.optional(S.String) }) {}
export class CreateDataViewRequest extends S.Class<CreateDataViewRequest>(
  "CreateDataViewRequest",
)(
  {
    clientToken: S.optional(S.String),
    datasetId: S.String.pipe(T.HttpLabel()),
    autoUpdate: S.optional(S.Boolean),
    sortColumns: S.optional(SortColumnList),
    partitionColumns: S.optional(PartitionColumnList),
    asOfTimestamp: S.optional(S.Number),
    destinationTypeParams: DataViewDestinationTypeParams,
  },
  T.all(
    T.Http({ method: "POST", uri: "/datasets/{datasetId}/dataviewsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChangesetResponse extends S.Class<GetChangesetResponse>(
  "GetChangesetResponse",
)({
  changesetId: S.optional(S.String),
  changesetArn: S.optional(S.String),
  datasetId: S.optional(S.String),
  changeType: S.optional(S.String),
  sourceParams: S.optional(SourceParams),
  formatParams: S.optional(FormatParams),
  createTime: S.optional(S.Number),
  status: S.optional(S.String),
  errorInfo: S.optional(ChangesetErrorInfo),
  activeUntilTimestamp: S.optional(S.Number),
  activeFromTimestamp: S.optional(S.Number),
  updatesChangesetId: S.optional(S.String),
  updatedByChangesetId: S.optional(S.String),
}) {}
export class GetDataViewResponse extends S.Class<GetDataViewResponse>(
  "GetDataViewResponse",
)({
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
  status: S.optional(S.String),
}) {}
export class GetExternalDataViewAccessDetailsResponse extends S.Class<GetExternalDataViewAccessDetailsResponse>(
  "GetExternalDataViewAccessDetailsResponse",
)({
  credentials: S.optional(AwsCredentials),
  s3Location: S.optional(S3Location),
}) {}
export class GetPermissionGroupResponse extends S.Class<GetPermissionGroupResponse>(
  "GetPermissionGroupResponse",
)({ permissionGroup: S.optional(PermissionGroup) }) {}
export class GetProgrammaticAccessCredentialsResponse extends S.Class<GetProgrammaticAccessCredentialsResponse>(
  "GetProgrammaticAccessCredentialsResponse",
)({
  credentials: S.optional(Credentials),
  durationInMinutes: S.optional(S.Number),
}) {}
export class ListChangesetsResponse extends S.Class<ListChangesetsResponse>(
  "ListChangesetsResponse",
)({ changesets: S.optional(ChangesetList), nextToken: S.optional(S.String) }) {}
export class ListDatasetsResponse extends S.Class<ListDatasetsResponse>(
  "ListDatasetsResponse",
)({ datasets: S.optional(DatasetList), nextToken: S.optional(S.String) }) {}
export class ListDataViewsResponse extends S.Class<ListDataViewsResponse>(
  "ListDataViewsResponse",
)({ nextToken: S.optional(S.String), dataViews: S.optional(DataViewList) }) {}
export class ListPermissionGroupsByUserResponse extends S.Class<ListPermissionGroupsByUserResponse>(
  "ListPermissionGroupsByUserResponse",
)({
  permissionGroups: S.optional(PermissionGroupByUserList),
  nextToken: S.optional(S.String),
}) {}
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({ users: S.optional(UserList), nextToken: S.optional(S.String) }) {}
export class ListUsersByPermissionGroupResponse extends S.Class<ListUsersByPermissionGroupResponse>(
  "ListUsersByPermissionGroupResponse",
)({
  users: S.optional(UserByPermissionGroupList),
  nextToken: S.optional(S.String),
}) {}
export class CreateDatasetRequest extends S.Class<CreateDatasetRequest>(
  "CreateDatasetRequest",
)(
  {
    clientToken: S.optional(S.String),
    datasetTitle: S.String,
    kind: S.String,
    datasetDescription: S.optional(S.String),
    ownerInfo: S.optional(DatasetOwnerInfo),
    permissionGroupParams: PermissionGroupParams,
    alias: S.optional(S.String),
    schemaDefinition: S.optional(SchemaUnion),
  },
  T.all(
    T.Http({ method: "POST", uri: "/datasetsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataViewResponse extends S.Class<CreateDataViewResponse>(
  "CreateDataViewResponse",
)({ datasetId: S.optional(S.String), dataViewId: S.optional(S.String) }) {}
export class CreateDatasetResponse extends S.Class<CreateDatasetResponse>(
  "CreateDatasetResponse",
)({ datasetId: S.optional(S.String) }) {}

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
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}

//# Operations
/**
 * Removes a user from a permission group.
 */
export const disassociateUserFromPermissionGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Allows the specified user to access the FinSpace web application and API.
 */
export const enableUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns information about a Dataset.
 */
export const getDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves details for a specific user.
 */
export const getUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * A temporary Amazon S3 location, where you can copy your files from a source location to stage or use
 * as a scratch space in FinSpace notebook.
 */
export const getWorkingLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPermissionGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPermissionGroupsRequest,
    output: ListPermissionGroupsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Resets the password for a specified user ID and generates a temporary one. Only a superuser can reset password for other users. Resetting the password immediately invalidates the previous password associated with the user.
 */
export const resetUserPassword = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateChangeset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePermissionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Modifies the details of the specified user. You cannot update the `userId` for a user.
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds a user to a permission group to grant permissions for actions a user can perform in FinSpace.
 */
export const associateUserToPermissionGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new Changeset in a FinSpace Dataset.
 */
export const createChangeset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Creates a group of permissions for various actions that a user can perform in FinSpace.
 */
export const createPermissionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a new user in FinSpace.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePermissionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Denies access to the FinSpace web application and API for the specified user.
 */
export const disableUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Get information about a Changeset.
 */
export const getChangeset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns the credentials to access the external Dataview from an S3 location. To call this API:
 *
 * - You must retrieve the programmatic credentials.
 *
 * - You must be a member of a FinSpace user group, where the dataset that you want to access has `Read Dataset Data` permissions.
 */
export const getExternalDataViewAccessDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the details of a specific permission group.
 */
export const getPermissionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Request programmatic credentials to use with FinSpace SDK. For more information, see Step 2. Access credentials programmatically using IAM access key id and secret access key.
 */
export const getProgrammaticAccessCredentials =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the FinSpace Changesets for a Dataset.
 */
export const listChangesets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists all of the active Datasets that a user has access to.
 */
export const listDatasets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all available Dataviews for a Dataset.
 */
export const listDataViews = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataViewsRequest,
  output: ListDataViewsResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the permission groups that are associated with a specific user.
 */
export const listPermissionGroupsByUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPermissionGroupsByUserRequest,
    output: ListPermissionGroupsByUserResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all available users in FinSpace.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists details of all the users in a specific permission group.
 */
export const listUsersByPermissionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListUsersByPermissionGroupRequest,
    output: ListUsersByPermissionGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a Dataview for a Dataset.
 */
export const createDataView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
