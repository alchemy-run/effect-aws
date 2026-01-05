import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("https://aws.amazon.com/api/v1/");
const svc = T.AwsApiService({
  sdkId: "WorkDocs",
  serviceShapeName: "AWSGorillaBoyService",
});
const auth = T.AwsAuthSigv4({ name: "workdocs" });
const ver = T.ServiceVersion("2016-05-01");
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
                        url: "https://workdocs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://workdocs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://workdocs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://workdocs.{Region}.{PartitionResult#dnsSuffix}",
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
export const SharedLabels = S.Array(S.String);
export const CustomMetadataKeyList = S.Array(S.String);
export const SearchQueryScopeTypeList = S.Array(S.String);
export const AdditionalResponseFieldsList = S.Array(S.String);
export class AbortDocumentVersionUploadRequest extends S.Class<AbortDocumentVersionUploadRequest>(
  "AbortDocumentVersionUploadRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/api/v1/documents/{DocumentId}/versions/{VersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AbortDocumentVersionUploadResponse extends S.Class<AbortDocumentVersionUploadResponse>(
  "AbortDocumentVersionUploadResponse",
)({}, ns) {}
export class ActivateUserRequest extends S.Class<ActivateUserRequest>(
  "ActivateUserRequest",
)(
  {
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/api/v1/users/{UserId}/activation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCommentRequest extends S.Class<CreateCommentRequest>(
  "CreateCommentRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    ParentId: S.optional(S.String),
    ThreadId: S.optional(S.String),
    Text: S.String,
    Visibility: S.optional(S.String),
    NotifyCollaborators: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/api/v1/documents/{DocumentId}/versions/{VersionId}/comment",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFolderRequest extends S.Class<CreateFolderRequest>(
  "CreateFolderRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    Name: S.optional(S.String),
    ParentFolderId: S.String,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/api/v1/folders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLabelsRequest extends S.Class<CreateLabelsRequest>(
  "CreateLabelsRequest",
)(
  {
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    Labels: SharedLabels,
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/api/v1/resources/{ResourceId}/labels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLabelsResponse extends S.Class<CreateLabelsResponse>(
  "CreateLabelsResponse",
)({}, ns) {}
export class CreateNotificationSubscriptionRequest extends S.Class<CreateNotificationSubscriptionRequest>(
  "CreateNotificationSubscriptionRequest",
)(
  {
    OrganizationId: S.String.pipe(T.HttpLabel("OrganizationId")),
    Endpoint: S.String,
    Protocol: S.String,
    SubscriptionType: S.String,
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/api/v1/organizations/{OrganizationId}/subscriptions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeactivateUserRequest extends S.Class<DeactivateUserRequest>(
  "DeactivateUserRequest",
)(
  {
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/api/v1/users/{UserId}/activation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeactivateUserResponse extends S.Class<DeactivateUserResponse>(
  "DeactivateUserResponse",
)({}, ns) {}
export class DeleteCommentRequest extends S.Class<DeleteCommentRequest>(
  "DeleteCommentRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    CommentId: S.String.pipe(T.HttpLabel("CommentId")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/api/v1/documents/{DocumentId}/versions/{VersionId}/comment/{CommentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCommentResponse extends S.Class<DeleteCommentResponse>(
  "DeleteCommentResponse",
)({}, ns) {}
export class DeleteCustomMetadataRequest extends S.Class<DeleteCustomMetadataRequest>(
  "DeleteCustomMetadataRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    Keys: S.optional(CustomMetadataKeyList).pipe(T.HttpQuery("keys")),
    DeleteAll: S.optional(S.Boolean).pipe(T.HttpQuery("deleteAll")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/api/v1/resources/{ResourceId}/customMetadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomMetadataResponse extends S.Class<DeleteCustomMetadataResponse>(
  "DeleteCustomMetadataResponse",
)({}, ns) {}
export class DeleteDocumentRequest extends S.Class<DeleteDocumentRequest>(
  "DeleteDocumentRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/api/v1/documents/{DocumentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDocumentResponse extends S.Class<DeleteDocumentResponse>(
  "DeleteDocumentResponse",
)({}, ns) {}
export class DeleteDocumentVersionRequest extends S.Class<DeleteDocumentVersionRequest>(
  "DeleteDocumentVersionRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    DeletePriorVersions: S.Boolean.pipe(T.HttpQuery("deletePriorVersions")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/api/v1/documentVersions/{DocumentId}/versions/{VersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDocumentVersionResponse extends S.Class<DeleteDocumentVersionResponse>(
  "DeleteDocumentVersionResponse",
)({}, ns) {}
export class DeleteFolderRequest extends S.Class<DeleteFolderRequest>(
  "DeleteFolderRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/api/v1/folders/{FolderId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFolderResponse extends S.Class<DeleteFolderResponse>(
  "DeleteFolderResponse",
)({}, ns) {}
export class DeleteFolderContentsRequest extends S.Class<DeleteFolderContentsRequest>(
  "DeleteFolderContentsRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/api/v1/folders/{FolderId}/contents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFolderContentsResponse extends S.Class<DeleteFolderContentsResponse>(
  "DeleteFolderContentsResponse",
)({}, ns) {}
export class DeleteLabelsRequest extends S.Class<DeleteLabelsRequest>(
  "DeleteLabelsRequest",
)(
  {
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    Labels: S.optional(SharedLabels).pipe(T.HttpQuery("labels")),
    DeleteAll: S.optional(S.Boolean).pipe(T.HttpQuery("deleteAll")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/api/v1/resources/{ResourceId}/labels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLabelsResponse extends S.Class<DeleteLabelsResponse>(
  "DeleteLabelsResponse",
)({}, ns) {}
export class DeleteNotificationSubscriptionRequest extends S.Class<DeleteNotificationSubscriptionRequest>(
  "DeleteNotificationSubscriptionRequest",
)(
  {
    SubscriptionId: S.String.pipe(T.HttpLabel("SubscriptionId")),
    OrganizationId: S.String.pipe(T.HttpLabel("OrganizationId")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/api/v1/organizations/{OrganizationId}/subscriptions/{SubscriptionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNotificationSubscriptionResponse extends S.Class<DeleteNotificationSubscriptionResponse>(
  "DeleteNotificationSubscriptionResponse",
)({}, ns) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/api/v1/users/{UserId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserResponse extends S.Class<DeleteUserResponse>(
  "DeleteUserResponse",
)({}, ns) {}
export class DescribeActivitiesRequest extends S.Class<DescribeActivitiesRequest>(
  "DescribeActivitiesRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startTime"),
    ),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endTime"),
    ),
    OrganizationId: S.optional(S.String).pipe(T.HttpQuery("organizationId")),
    ActivityTypes: S.optional(S.String).pipe(T.HttpQuery("activityTypes")),
    ResourceId: S.optional(S.String).pipe(T.HttpQuery("resourceId")),
    UserId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    IncludeIndirectActivities: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeIndirectActivities"),
    ),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/activities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCommentsRequest extends S.Class<DescribeCommentsRequest>(
  "DescribeCommentsRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/api/v1/documents/{DocumentId}/versions/{VersionId}/comments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDocumentVersionsRequest extends S.Class<DescribeDocumentVersionsRequest>(
  "DescribeDocumentVersionsRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Include: S.optional(S.String).pipe(T.HttpQuery("include")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/documents/{DocumentId}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFolderContentsRequest extends S.Class<DescribeFolderContentsRequest>(
  "DescribeFolderContentsRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Sort: S.optional(S.String).pipe(T.HttpQuery("sort")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Type: S.optional(S.String).pipe(T.HttpQuery("type")),
    Include: S.optional(S.String).pipe(T.HttpQuery("include")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/folders/{FolderId}/contents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGroupsRequest extends S.Class<DescribeGroupsRequest>(
  "DescribeGroupsRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    SearchQuery: S.String.pipe(T.HttpQuery("searchQuery")),
    OrganizationId: S.optional(S.String).pipe(T.HttpQuery("organizationId")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeNotificationSubscriptionsRequest extends S.Class<DescribeNotificationSubscriptionsRequest>(
  "DescribeNotificationSubscriptionsRequest",
)(
  {
    OrganizationId: S.String.pipe(T.HttpLabel("OrganizationId")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/api/v1/organizations/{OrganizationId}/subscriptions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeResourcePermissionsRequest extends S.Class<DescribeResourcePermissionsRequest>(
  "DescribeResourcePermissionsRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    PrincipalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/api/v1/resources/{ResourceId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRootFoldersRequest extends S.Class<DescribeRootFoldersRequest>(
  "DescribeRootFoldersRequest",
)(
  {
    AuthenticationToken: S.String.pipe(T.HttpHeader("Authentication")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/me/root" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeUsersRequest extends S.Class<DescribeUsersRequest>(
  "DescribeUsersRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    OrganizationId: S.optional(S.String).pipe(T.HttpQuery("organizationId")),
    UserIds: S.optional(S.String).pipe(T.HttpQuery("userIds")),
    Query: S.optional(S.String).pipe(T.HttpQuery("query")),
    Include: S.optional(S.String).pipe(T.HttpQuery("include")),
    Order: S.optional(S.String).pipe(T.HttpQuery("order")),
    Sort: S.optional(S.String).pipe(T.HttpQuery("sort")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCurrentUserRequest extends S.Class<GetCurrentUserRequest>(
  "GetCurrentUserRequest",
)(
  { AuthenticationToken: S.String.pipe(T.HttpHeader("Authentication")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/me" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDocumentRequest extends S.Class<GetDocumentRequest>(
  "GetDocumentRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    IncludeCustomMetadata: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeCustomMetadata"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/documents/{DocumentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDocumentPathRequest extends S.Class<GetDocumentPathRequest>(
  "GetDocumentPathRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/documents/{DocumentId}/path" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDocumentVersionRequest extends S.Class<GetDocumentVersionRequest>(
  "GetDocumentVersionRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
    IncludeCustomMetadata: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeCustomMetadata"),
    ),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/api/v1/documents/{DocumentId}/versions/{VersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFolderRequest extends S.Class<GetFolderRequest>(
  "GetFolderRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    IncludeCustomMetadata: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeCustomMetadata"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/folders/{FolderId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFolderPathRequest extends S.Class<GetFolderPathRequest>(
  "GetFolderPathRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/folders/{FolderId}/path" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcesRequest extends S.Class<GetResourcesRequest>(
  "GetResourcesRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    UserId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    CollectionType: S.optional(S.String).pipe(T.HttpQuery("collectionType")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/api/v1/resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InitiateDocumentVersionUploadRequest extends S.Class<InitiateDocumentVersionUploadRequest>(
  "InitiateDocumentVersionUploadRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    ContentCreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ContentModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ContentType: S.optional(S.String),
    DocumentSizeInBytes: S.optional(S.Number),
    ParentFolderId: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/api/v1/documents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveAllResourcePermissionsRequest extends S.Class<RemoveAllResourcePermissionsRequest>(
  "RemoveAllResourcePermissionsRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/api/v1/resources/{ResourceId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveAllResourcePermissionsResponse extends S.Class<RemoveAllResourcePermissionsResponse>(
  "RemoveAllResourcePermissionsResponse",
)({}, ns) {}
export class RemoveResourcePermissionRequest extends S.Class<RemoveResourcePermissionRequest>(
  "RemoveResourcePermissionRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    PrincipalId: S.String.pipe(T.HttpLabel("PrincipalId")),
    PrincipalType: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/api/v1/resources/{ResourceId}/permissions/{PrincipalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveResourcePermissionResponse extends S.Class<RemoveResourcePermissionResponse>(
  "RemoveResourcePermissionResponse",
)({}, ns) {}
export class RestoreDocumentVersionsRequest extends S.Class<RestoreDocumentVersionsRequest>(
  "RestoreDocumentVersionsRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/api/v1/documentVersions/restore/{DocumentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestoreDocumentVersionsResponse extends S.Class<RestoreDocumentVersionsResponse>(
  "RestoreDocumentVersionsResponse",
)({}, ns) {}
export class UpdateDocumentRequest extends S.Class<UpdateDocumentRequest>(
  "UpdateDocumentRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    Name: S.optional(S.String),
    ParentFolderId: S.optional(S.String),
    ResourceState: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "PATCH", uri: "/api/v1/documents/{DocumentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDocumentResponse extends S.Class<UpdateDocumentResponse>(
  "UpdateDocumentResponse",
)({}, ns) {}
export class UpdateDocumentVersionRequest extends S.Class<UpdateDocumentVersionRequest>(
  "UpdateDocumentVersionRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    VersionStatus: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "PATCH",
      uri: "/api/v1/documents/{DocumentId}/versions/{VersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDocumentVersionResponse extends S.Class<UpdateDocumentVersionResponse>(
  "UpdateDocumentVersionResponse",
)({}, ns) {}
export class UpdateFolderRequest extends S.Class<UpdateFolderRequest>(
  "UpdateFolderRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Name: S.optional(S.String),
    ParentFolderId: S.optional(S.String),
    ResourceState: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "PATCH", uri: "/api/v1/folders/{FolderId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFolderResponse extends S.Class<UpdateFolderResponse>(
  "UpdateFolderResponse",
)({}, ns) {}
export class StorageRuleType extends S.Class<StorageRuleType>(
  "StorageRuleType",
)({
  StorageAllocatedInBytes: S.optional(S.Number),
  StorageType: S.optional(S.String),
}) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    GivenName: S.optional(S.String),
    Surname: S.optional(S.String),
    Type: S.optional(S.String),
    StorageRule: S.optional(StorageRuleType),
    TimeZoneId: S.optional(S.String),
    Locale: S.optional(S.String),
    GrantPoweruserPrivileges: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "PATCH", uri: "/api/v1/users/{UserId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TextLocaleTypeList = S.Array(S.String);
export const SearchContentCategoryTypeList = S.Array(S.String);
export const SearchResourceTypeList = S.Array(S.String);
export const SearchLabelList = S.Array(S.String);
export const SearchAncestorIdList = S.Array(S.String);
export const SearchCollectionTypeList = S.Array(S.String);
export class SharePrincipal extends S.Class<SharePrincipal>("SharePrincipal")({
  Id: S.String,
  Type: S.String,
  Role: S.String,
}) {}
export const SharePrincipalList = S.Array(SharePrincipal);
export class NotificationOptions extends S.Class<NotificationOptions>(
  "NotificationOptions",
)({ SendEmail: S.optional(S.Boolean), EmailMessage: S.optional(S.String) }) {}
export const CustomMetadataMap = S.Record({ key: S.String, value: S.String });
export const EntityIdList = S.Array(S.String);
export class UserStorageMetadata extends S.Class<UserStorageMetadata>(
  "UserStorageMetadata",
)({
  StorageUtilizedInBytes: S.optional(S.Number),
  StorageRule: S.optional(StorageRuleType),
}) {}
export class User extends S.Class<User>("User")({
  Id: S.optional(S.String),
  Username: S.optional(S.String),
  EmailAddress: S.optional(S.String),
  GivenName: S.optional(S.String),
  Surname: S.optional(S.String),
  OrganizationId: S.optional(S.String),
  RootFolderId: S.optional(S.String),
  RecycleBinFolderId: S.optional(S.String),
  Status: S.optional(S.String),
  Type: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TimeZoneId: S.optional(S.String),
  Locale: S.optional(S.String),
  Storage: S.optional(UserStorageMetadata),
}) {}
export class Comment extends S.Class<Comment>("Comment")({
  CommentId: S.String,
  ParentId: S.optional(S.String),
  ThreadId: S.optional(S.String),
  Text: S.optional(S.String),
  Contributor: S.optional(User),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  Visibility: S.optional(S.String),
  RecipientId: S.optional(S.String),
}) {}
export const CommentList = S.Array(Comment);
export class FolderMetadata extends S.Class<FolderMetadata>("FolderMetadata")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  CreatorId: S.optional(S.String),
  ParentFolderId: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ResourceState: S.optional(S.String),
  Signature: S.optional(S.String),
  Labels: S.optional(SharedLabels),
  Size: S.optional(S.Number),
  LatestVersionSize: S.optional(S.Number),
}) {}
export const FolderMetadataList = S.Array(FolderMetadata);
export class Subscription extends S.Class<Subscription>("Subscription")({
  SubscriptionId: S.optional(S.String),
  EndPoint: S.optional(S.String),
  Protocol: S.optional(S.String),
}) {}
export const SubscriptionList = S.Array(Subscription);
export const OrganizationUserList = S.Array(User);
export class SearchSortResult extends S.Class<SearchSortResult>(
  "SearchSortResult",
)({ Field: S.optional(S.String), Order: S.optional(S.String) }) {}
export const SearchResultSortList = S.Array(SearchSortResult);
export const SearchPrincipalRoleList = S.Array(S.String);
export class AddResourcePermissionsRequest extends S.Class<AddResourcePermissionsRequest>(
  "AddResourcePermissionsRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    Principals: SharePrincipalList,
    NotificationOptions: S.optional(NotificationOptions),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/api/v1/resources/{ResourceId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCustomMetadataRequest extends S.Class<CreateCustomMetadataRequest>(
  "CreateCustomMetadataRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionid")),
    CustomMetadata: CustomMetadataMap,
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/api/v1/resources/{ResourceId}/customMetadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCustomMetadataResponse extends S.Class<CreateCustomMetadataResponse>(
  "CreateCustomMetadataResponse",
)({}, ns) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    OrganizationId: S.optional(S.String),
    Username: S.String,
    EmailAddress: S.optional(S.String),
    GivenName: S.String,
    Surname: S.String,
    Password: S.String,
    TimeZoneId: S.optional(S.String),
    StorageRule: S.optional(StorageRuleType),
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/api/v1/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCommentsResponse extends S.Class<DescribeCommentsResponse>(
  "DescribeCommentsResponse",
)({ Comments: S.optional(CommentList), Marker: S.optional(S.String) }, ns) {}
export class DescribeNotificationSubscriptionsResponse extends S.Class<DescribeNotificationSubscriptionsResponse>(
  "DescribeNotificationSubscriptionsResponse",
)(
  { Subscriptions: S.optional(SubscriptionList), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeRootFoldersResponse extends S.Class<DescribeRootFoldersResponse>(
  "DescribeRootFoldersResponse",
)(
  { Folders: S.optional(FolderMetadataList), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeUsersResponse extends S.Class<DescribeUsersResponse>(
  "DescribeUsersResponse",
)(
  {
    Users: S.optional(OrganizationUserList),
    TotalNumberOfUsers: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class GetCurrentUserResponse extends S.Class<GetCurrentUserResponse>(
  "GetCurrentUserResponse",
)({ User: S.optional(User) }, ns) {}
export const DocumentThumbnailUrlMap = S.Record({
  key: S.String,
  value: S.String,
});
export const DocumentSourceUrlMap = S.Record({
  key: S.String,
  value: S.String,
});
export class DocumentVersionMetadata extends S.Class<DocumentVersionMetadata>(
  "DocumentVersionMetadata",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  ContentType: S.optional(S.String),
  Size: S.optional(S.Number),
  Signature: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ContentCreatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ContentModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CreatorId: S.optional(S.String),
  Thumbnail: S.optional(DocumentThumbnailUrlMap),
  Source: S.optional(DocumentSourceUrlMap),
}) {}
export class DocumentMetadata extends S.Class<DocumentMetadata>(
  "DocumentMetadata",
)({
  Id: S.optional(S.String),
  CreatorId: S.optional(S.String),
  ParentFolderId: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LatestVersionMetadata: S.optional(DocumentVersionMetadata),
  ResourceState: S.optional(S.String),
  Labels: S.optional(SharedLabels),
}) {}
export class GetDocumentResponse extends S.Class<GetDocumentResponse>(
  "GetDocumentResponse",
)(
  {
    Metadata: S.optional(DocumentMetadata),
    CustomMetadata: S.optional(CustomMetadataMap),
  },
  ns,
) {}
export class GetDocumentVersionResponse extends S.Class<GetDocumentVersionResponse>(
  "GetDocumentVersionResponse",
)(
  {
    Metadata: S.optional(DocumentVersionMetadata),
    CustomMetadata: S.optional(CustomMetadataMap),
  },
  ns,
) {}
export class GetFolderResponse extends S.Class<GetFolderResponse>(
  "GetFolderResponse",
)(
  {
    Metadata: S.optional(FolderMetadata),
    CustomMetadata: S.optional(CustomMetadataMap),
  },
  ns,
) {}
export class ResourcePathComponent extends S.Class<ResourcePathComponent>(
  "ResourcePathComponent",
)({ Id: S.optional(S.String), Name: S.optional(S.String) }) {}
export const ResourcePathComponentList = S.Array(ResourcePathComponent);
export class ResourcePath extends S.Class<ResourcePath>("ResourcePath")({
  Components: S.optional(ResourcePathComponentList),
}) {}
export class GetFolderPathResponse extends S.Class<GetFolderPathResponse>(
  "GetFolderPathResponse",
)({ Path: S.optional(ResourcePath) }, ns) {}
export const DocumentMetadataList = S.Array(DocumentMetadata);
export class GetResourcesResponse extends S.Class<GetResourcesResponse>(
  "GetResourcesResponse",
)(
  {
    Folders: S.optional(FolderMetadataList),
    Documents: S.optional(DocumentMetadataList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({ User: S.optional(User) }, ns) {}
export class SearchPrincipalType extends S.Class<SearchPrincipalType>(
  "SearchPrincipalType",
)({ Id: S.String, Roles: S.optional(SearchPrincipalRoleList) }) {}
export const SearchPrincipalTypeList = S.Array(SearchPrincipalType);
export class LongRangeType extends S.Class<LongRangeType>("LongRangeType")({
  StartValue: S.optional(S.Number),
  EndValue: S.optional(S.Number),
}) {}
export class DateRangeType extends S.Class<DateRangeType>("DateRangeType")({
  StartValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GroupMetadata extends S.Class<GroupMetadata>("GroupMetadata")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const GroupMetadataList = S.Array(GroupMetadata);
export class Filters extends S.Class<Filters>("Filters")({
  TextLocales: S.optional(TextLocaleTypeList),
  ContentCategories: S.optional(SearchContentCategoryTypeList),
  ResourceTypes: S.optional(SearchResourceTypeList),
  Labels: S.optional(SearchLabelList),
  Principals: S.optional(SearchPrincipalTypeList),
  AncestorIds: S.optional(SearchAncestorIdList),
  SearchCollectionTypes: S.optional(SearchCollectionTypeList),
  SizeRange: S.optional(LongRangeType),
  CreatedRange: S.optional(DateRangeType),
  ModifiedRange: S.optional(DateRangeType),
}) {}
export class UserMetadata extends S.Class<UserMetadata>("UserMetadata")({
  Id: S.optional(S.String),
  Username: S.optional(S.String),
  GivenName: S.optional(S.String),
  Surname: S.optional(S.String),
  EmailAddress: S.optional(S.String),
}) {}
export const UserMetadataList = S.Array(UserMetadata);
export class CreateCommentResponse extends S.Class<CreateCommentResponse>(
  "CreateCommentResponse",
)({ Comment: S.optional(Comment) }, ns) {}
export class CreateFolderResponse extends S.Class<CreateFolderResponse>(
  "CreateFolderResponse",
)({ Metadata: S.optional(FolderMetadata) }, ns) {}
export class CreateNotificationSubscriptionResponse extends S.Class<CreateNotificationSubscriptionResponse>(
  "CreateNotificationSubscriptionResponse",
)({ Subscription: S.optional(Subscription) }, ns) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({ User: S.optional(User) }, ns) {}
export class DescribeFolderContentsResponse extends S.Class<DescribeFolderContentsResponse>(
  "DescribeFolderContentsResponse",
)(
  {
    Folders: S.optional(FolderMetadataList),
    Documents: S.optional(DocumentMetadataList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeGroupsResponse extends S.Class<DescribeGroupsResponse>(
  "DescribeGroupsResponse",
)(
  { Groups: S.optional(GroupMetadataList), Marker: S.optional(S.String) },
  ns,
) {}
export class SearchResourcesRequest extends S.Class<SearchResourcesRequest>(
  "SearchResourcesRequest",
)(
  {
    AuthenticationToken: S.optional(S.String).pipe(
      T.HttpHeader("Authentication"),
    ),
    QueryText: S.optional(S.String),
    QueryScopes: S.optional(SearchQueryScopeTypeList),
    OrganizationId: S.optional(S.String),
    AdditionalResponseFields: S.optional(AdditionalResponseFieldsList),
    Filters: S.optional(Filters),
    OrderBy: S.optional(SearchResultSortList),
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/api/v1/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Participants extends S.Class<Participants>("Participants")({
  Users: S.optional(UserMetadataList),
  Groups: S.optional(GroupMetadataList),
}) {}
export class ResourceMetadata extends S.Class<ResourceMetadata>(
  "ResourceMetadata",
)({
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  OriginalName: S.optional(S.String),
  Id: S.optional(S.String),
  VersionId: S.optional(S.String),
  Owner: S.optional(UserMetadata),
  ParentId: S.optional(S.String),
}) {}
export class CommentMetadata extends S.Class<CommentMetadata>(
  "CommentMetadata",
)({
  CommentId: S.optional(S.String),
  Contributor: S.optional(User),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CommentStatus: S.optional(S.String),
  RecipientId: S.optional(S.String),
  ContributorId: S.optional(S.String),
}) {}
export class PermissionInfo extends S.Class<PermissionInfo>("PermissionInfo")({
  Role: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const PermissionInfoList = S.Array(PermissionInfo);
export const SignedHeaderMap = S.Record({ key: S.String, value: S.String });
export class ShareResult extends S.Class<ShareResult>("ShareResult")({
  PrincipalId: S.optional(S.String),
  InviteePrincipalId: S.optional(S.String),
  Role: S.optional(S.String),
  Status: S.optional(S.String),
  ShareId: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export const ShareResultsList = S.Array(ShareResult);
export class Activity extends S.Class<Activity>("Activity")({
  Type: S.optional(S.String),
  TimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IsIndirectActivity: S.optional(S.Boolean),
  OrganizationId: S.optional(S.String),
  Initiator: S.optional(UserMetadata),
  Participants: S.optional(Participants),
  ResourceMetadata: S.optional(ResourceMetadata),
  OriginalParent: S.optional(ResourceMetadata),
  CommentMetadata: S.optional(CommentMetadata),
}) {}
export const UserActivities = S.Array(Activity);
export const DocumentVersionMetadataList = S.Array(DocumentVersionMetadata);
export class Principal extends S.Class<Principal>("Principal")({
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  Roles: S.optional(PermissionInfoList),
}) {}
export const PrincipalList = S.Array(Principal);
export class UploadMetadata extends S.Class<UploadMetadata>("UploadMetadata")({
  UploadUrl: S.optional(S.String),
  SignedHeaders: S.optional(SignedHeaderMap),
}) {}
export class ActivateUserResponse extends S.Class<ActivateUserResponse>(
  "ActivateUserResponse",
)({ User: S.optional(User) }, ns) {}
export class AddResourcePermissionsResponse extends S.Class<AddResourcePermissionsResponse>(
  "AddResourcePermissionsResponse",
)({ ShareResults: S.optional(ShareResultsList) }, ns) {}
export class DescribeActivitiesResponse extends S.Class<DescribeActivitiesResponse>(
  "DescribeActivitiesResponse",
)(
  { UserActivities: S.optional(UserActivities), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeDocumentVersionsResponse extends S.Class<DescribeDocumentVersionsResponse>(
  "DescribeDocumentVersionsResponse",
)(
  {
    DocumentVersions: S.optional(DocumentVersionMetadataList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeResourcePermissionsResponse extends S.Class<DescribeResourcePermissionsResponse>(
  "DescribeResourcePermissionsResponse",
)(
  { Principals: S.optional(PrincipalList), Marker: S.optional(S.String) },
  ns,
) {}
export class GetDocumentPathResponse extends S.Class<GetDocumentPathResponse>(
  "GetDocumentPathResponse",
)({ Path: S.optional(ResourcePath) }, ns) {}
export class InitiateDocumentVersionUploadResponse extends S.Class<InitiateDocumentVersionUploadResponse>(
  "InitiateDocumentVersionUploadResponse",
)(
  {
    Metadata: S.optional(DocumentMetadata),
    UploadMetadata: S.optional(UploadMetadata),
  },
  ns,
) {}
export class ResponseItem extends S.Class<ResponseItem>("ResponseItem")({
  ResourceType: S.optional(S.String),
  WebUrl: S.optional(S.String),
  DocumentMetadata: S.optional(DocumentMetadata),
  FolderMetadata: S.optional(FolderMetadata),
  CommentMetadata: S.optional(CommentMetadata),
  DocumentVersionMetadata: S.optional(DocumentVersionMetadata),
}) {}
export const ResponseItemsList = S.Array(ResponseItem);
export class SearchResourcesResponse extends S.Class<SearchResourcesResponse>(
  "SearchResourcesResponse",
)({ Items: S.optional(ResponseItemsList), Marker: S.optional(S.String) }, ns) {}

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
) {}
export class EntityNotExistsException extends S.TaggedError<EntityNotExistsException>()(
  "EntityNotExistsException",
  { Message: S.optional(S.String), EntityIds: S.optional(EntityIdList) },
) {}
export class DocumentLockedForCommentsException extends S.TaggedError<DocumentLockedForCommentsException>()(
  "DocumentLockedForCommentsException",
  { Message: S.optional(S.String) },
) {}
export class ConflictingOperationException extends S.TaggedError<ConflictingOperationException>()(
  "ConflictingOperationException",
  { Message: S.optional(S.String) },
) {}
export class FailedDependencyException extends S.TaggedError<FailedDependencyException>()(
  "FailedDependencyException",
  { Message: S.optional(S.String) },
) {}
export class CustomMetadataLimitExceededException extends S.TaggedError<CustomMetadataLimitExceededException>()(
  "CustomMetadataLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class DeactivatingLastSystemUserException extends S.TaggedError<DeactivatingLastSystemUserException>()(
  "DeactivatingLastSystemUserException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { Message: S.optional(S.String) },
) {}
export class EntityAlreadyExistsException extends S.TaggedError<EntityAlreadyExistsException>()(
  "EntityAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}
export class ProhibitedStateException extends S.TaggedError<ProhibitedStateException>()(
  "ProhibitedStateException",
  { Message: S.optional(S.String) },
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
) {}
export class InvalidPasswordException extends S.TaggedError<InvalidPasswordException>()(
  "InvalidPasswordException",
  { Message: S.optional(S.String) },
) {}
export class InvalidCommentOperationException extends S.TaggedError<InvalidCommentOperationException>()(
  "InvalidCommentOperationException",
  { Message: S.optional(S.String) },
) {}
export class UnauthorizedResourceAccessException extends S.TaggedError<UnauthorizedResourceAccessException>()(
  "UnauthorizedResourceAccessException",
  { Message: S.optional(S.String) },
) {}
export class IllegalUserStateException extends S.TaggedError<IllegalUserStateException>()(
  "IllegalUserStateException",
  { Message: S.optional(S.String) },
) {}
export class UnauthorizedOperationException extends S.TaggedError<UnauthorizedOperationException>()(
  "UnauthorizedOperationException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class TooManyLabelsException extends S.TaggedError<TooManyLabelsException>()(
  "TooManyLabelsException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class RequestedEntityTooLargeException extends S.TaggedError<RequestedEntityTooLargeException>()(
  "RequestedEntityTooLargeException",
  { Message: S.optional(S.String) },
) {}
export class TooManySubscriptionsException extends S.TaggedError<TooManySubscriptionsException>()(
  "TooManySubscriptionsException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class DraftUploadOutOfSyncException extends S.TaggedError<DraftUploadOutOfSyncException>()(
  "DraftUploadOutOfSyncException",
  { Message: S.optional(S.String) },
) {}
export class ResourceAlreadyCheckedOutException extends S.TaggedError<ResourceAlreadyCheckedOutException>()(
  "ResourceAlreadyCheckedOutException",
  { Message: S.optional(S.String) },
) {}
export class StorageLimitExceededException extends S.TaggedError<StorageLimitExceededException>()(
  "StorageLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class StorageLimitWillExceedException extends S.TaggedError<StorageLimitWillExceedException>()(
  "StorageLimitWillExceedException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the specified notification subscriptions.
 */
export const describeNotificationSubscriptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeNotificationSubscriptionsRequest,
    output: DescribeNotificationSubscriptionsResponse,
    errors: [
      EntityNotExistsException,
      ServiceUnavailableException,
      UnauthorizedResourceAccessException,
    ],
  }));
/**
 * Deletes custom metadata from the specified resource.
 */
export const deleteCustomMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCustomMetadataRequest,
    output: DeleteCustomMetadataResponse,
    errors: [
      EntityNotExistsException,
      FailedDependencyException,
      ProhibitedStateException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Adds the specified list of labels to the given resource (a document or
 * folder)
 */
export const createLabels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLabelsRequest,
  output: CreateLabelsResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    ServiceUnavailableException,
    TooManyLabelsException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Deletes the specified subscription from the specified organization.
 */
export const deleteNotificationSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteNotificationSubscriptionRequest,
    output: DeleteNotificationSubscriptionResponse,
    errors: [
      EntityNotExistsException,
      ProhibitedStateException,
      ServiceUnavailableException,
      UnauthorizedResourceAccessException,
    ],
  }));
/**
 * Describes the contents of the specified folder, including its documents and
 * subfolders.
 *
 * By default, Amazon WorkDocs returns the first 100 active document and folder
 * metadata items. If there are more results, the response includes a marker that you can
 * use to request the next set of results. You can also request initialized
 * documents.
 */
export const describeFolderContents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFolderContentsRequest,
    output: DescribeFolderContentsResponse,
    errors: [
      EntityNotExistsException,
      FailedDependencyException,
      InvalidArgumentException,
      ProhibitedStateException,
      ServiceUnavailableException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Removes all the permissions from the specified resource.
 */
export const removeAllResourcePermissions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveAllResourcePermissionsRequest,
    output: RemoveAllResourcePermissionsResponse,
    errors: [
      FailedDependencyException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }));
/**
 * Deactivates the specified user, which revokes the user's access to Amazon
 * WorkDocs.
 */
export const deactivateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateUserRequest,
  output: DeactivateUserResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Deletes the specified user from a Simple AD or Microsoft AD directory.
 *
 * Deleting a user immediately and permanently deletes all content in that user's folder structure. Site retention policies do NOT apply to this type of deletion.
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Removes the permission for the specified principal from the specified
 * resource.
 */
export const removeResourcePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveResourcePermissionRequest,
    output: RemoveResourcePermissionResponse,
    errors: [
      FailedDependencyException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Retrieves details of the current user for whom the authentication token was
 * generated. This is not a valid action for SigV4 (administrative API) clients.
 *
 * This action requires an authentication token. To get an authentication token,
 * register an application with Amazon WorkDocs. For more information, see Authentication and Access
 * Control for User Applications in the
 * Amazon
 * WorkDocs Developer Guide.
 */
export const getCurrentUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCurrentUserRequest,
  output: GetCurrentUserResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Retrieves the path information (the hierarchy from the root folder) for the
 * specified folder.
 *
 * By default, Amazon WorkDocs returns a maximum of 100 levels upwards from the
 * requested folder and only includes the IDs of the parent folders in the path. You can
 * limit the maximum number of levels. You can also request the parent folder
 * names.
 */
export const getFolderPath = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFolderPathRequest,
  output: GetFolderPathResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Describes the groups specified by the query. Groups are defined by the underlying
 * Active Directory.
 */
export const describeGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGroupsRequest,
  output: DescribeGroupsResponse,
  errors: [
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Describes the current user's special folders; the `RootFolder` and the
 * `RecycleBin`. `RootFolder` is the root of user's files and
 * folders and `RecycleBin` is the root of recycled items. This is not a valid
 * action for SigV4 (administrative API) clients.
 *
 * This action requires an authentication token. To get an authentication token,
 * register an application with Amazon WorkDocs. For more information, see Authentication and Access
 * Control for User Applications in the
 * Amazon
 * WorkDocs Developer Guide.
 */
export const describeRootFolders = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRootFoldersRequest,
  output: DescribeRootFoldersResponse,
  errors: [
    FailedDependencyException,
    InvalidArgumentException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Retrieves version metadata for the specified document.
 */
export const getDocumentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentVersionRequest,
  output: GetDocumentVersionResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    InvalidPasswordException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Permanently deletes the specified folder and its contents.
 */
export const deleteFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFolderRequest,
  output: DeleteFolderResponse,
  errors: [
    ConcurrentModificationException,
    ConflictingOperationException,
    EntityNotExistsException,
    FailedDependencyException,
    LimitExceededException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Recovers a deleted version of an Amazon WorkDocs document.
 */
export const restoreDocumentVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreDocumentVersionsRequest,
    output: RestoreDocumentVersionsResponse,
    errors: [
      ConcurrentModificationException,
      ConflictingOperationException,
      EntityNotExistsException,
      FailedDependencyException,
      InvalidOperationException,
      ProhibitedStateException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Changes the status of the document version to ACTIVE.
 *
 * Amazon WorkDocs also sets its document container to ACTIVE. This is the last step
 * in a document upload, after the client uploads the document to an S3-presigned URL
 * returned by InitiateDocumentVersionUpload.
 */
export const updateDocumentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDocumentVersionRequest,
    output: UpdateDocumentVersionResponse,
    errors: [
      ConcurrentModificationException,
      EntityNotExistsException,
      FailedDependencyException,
      InvalidOperationException,
      ProhibitedStateException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Updates the specified attributes of the specified folder. The user must have access
 * to both the folder and its parent folder, if applicable.
 */
export const updateFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFolderRequest,
  output: UpdateFolderResponse,
  errors: [
    ConcurrentModificationException,
    ConflictingOperationException,
    EntityAlreadyExistsException,
    EntityNotExistsException,
    FailedDependencyException,
    LimitExceededException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Creates a folder with the specified name and parent folder.
 */
export const createFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFolderRequest,
  output: CreateFolderResponse,
  errors: [
    ConcurrentModificationException,
    ConflictingOperationException,
    EntityAlreadyExistsException,
    EntityNotExistsException,
    FailedDependencyException,
    LimitExceededException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Creates a user in a Simple AD or Microsoft AD directory. The status of a newly
 * created user is "ACTIVE". New users can access Amazon WorkDocs.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    EntityAlreadyExistsException,
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Deletes the specified list of labels from a resource.
 */
export const deleteLabels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLabelsRequest,
  output: DeleteLabelsResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Aborts the upload of the specified document version that was previously initiated
 * by InitiateDocumentVersionUpload. The client should make this call
 * only when it no longer intends to upload the document version, or fails to do
 * so.
 */
export const abortDocumentVersionUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AbortDocumentVersionUploadRequest,
    output: AbortDocumentVersionUploadResponse,
    errors: [
      ConcurrentModificationException,
      EntityNotExistsException,
      FailedDependencyException,
      ProhibitedStateException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Deletes the specified comment from the document version.
 */
export const deleteComment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCommentRequest,
  output: DeleteCommentResponse,
  errors: [
    DocumentLockedForCommentsException,
    EntityNotExistsException,
    FailedDependencyException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Deletes the contents of the specified folder.
 */
export const deleteFolderContents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFolderContentsRequest,
    output: DeleteFolderContentsResponse,
    errors: [
      ConflictingOperationException,
      EntityNotExistsException,
      FailedDependencyException,
      ProhibitedStateException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * List all the comments for the specified document version.
 */
export const describeComments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCommentsRequest,
  output: DescribeCommentsResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Adds one or more custom properties to the specified resource (a folder, document,
 * or version).
 */
export const createCustomMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCustomMetadataRequest,
    output: CreateCustomMetadataResponse,
    errors: [
      CustomMetadataLimitExceededException,
      EntityNotExistsException,
      FailedDependencyException,
      ProhibitedStateException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Permanently deletes the specified document and its associated metadata.
 */
export const deleteDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDocumentRequest,
  output: DeleteDocumentResponse,
  errors: [
    ConcurrentModificationException,
    ConflictingOperationException,
    EntityNotExistsException,
    FailedDependencyException,
    LimitExceededException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Deletes a specific version of a document.
 */
export const deleteDocumentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDocumentVersionRequest,
    output: DeleteDocumentVersionResponse,
    errors: [
      ConcurrentModificationException,
      ConflictingOperationException,
      EntityNotExistsException,
      FailedDependencyException,
      InvalidOperationException,
      ProhibitedStateException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Updates the specified attributes of a document. The user must have access to both
 * the document and its parent folder, if applicable.
 */
export const updateDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDocumentRequest,
  output: UpdateDocumentResponse,
  errors: [
    ConcurrentModificationException,
    ConflictingOperationException,
    EntityAlreadyExistsException,
    EntityNotExistsException,
    FailedDependencyException,
    LimitExceededException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Retrieves details of a document.
 */
export const getDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentRequest,
  output: GetDocumentResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    InvalidArgumentException,
    InvalidPasswordException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Retrieves the metadata of the specified folder.
 */
export const getFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFolderRequest,
  output: GetFolderResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    InvalidArgumentException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Retrieves a collection of resources, including folders and documents. The only
 * `CollectionType` supported is `SHARED_WITH_ME`.
 */
export const getResources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcesRequest,
  output: GetResourcesResponse,
  errors: [
    FailedDependencyException,
    InvalidArgumentException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Activates the specified user. Only active users can access Amazon
 * WorkDocs.
 */
export const activateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateUserRequest,
  output: ActivateUserResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Creates a set of permissions for the specified folder or document. The resource
 * permissions are overwritten if the principals already have different
 * permissions.
 */
export const addResourcePermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddResourcePermissionsRequest,
    output: AddResourcePermissionsResponse,
    errors: [
      FailedDependencyException,
      ProhibitedStateException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Adds a new comment to the specified document version.
 */
export const createComment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCommentRequest,
  output: CreateCommentResponse,
  errors: [
    DocumentLockedForCommentsException,
    EntityNotExistsException,
    FailedDependencyException,
    InvalidCommentOperationException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Describes the user activities in a specified time period.
 */
export const describeActivities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeActivitiesRequest,
  output: DescribeActivitiesResponse,
  errors: [
    FailedDependencyException,
    InvalidArgumentException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Retrieves the document versions for the specified document.
 *
 * By default, only active versions are returned.
 */
export const describeDocumentVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDocumentVersionsRequest,
    output: DescribeDocumentVersionsResponse,
    errors: [
      EntityNotExistsException,
      FailedDependencyException,
      InvalidArgumentException,
      InvalidPasswordException,
      ProhibitedStateException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Describes the permissions of a specified resource.
 */
export const describeResourcePermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeResourcePermissionsRequest,
    output: DescribeResourcePermissionsResponse,
    errors: [
      FailedDependencyException,
      InvalidArgumentException,
      ServiceUnavailableException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }),
);
/**
 * Retrieves the path information (the hierarchy from the root folder) for the
 * requested document.
 *
 * By default, Amazon WorkDocs returns a maximum of 100 levels upwards from the
 * requested document and only includes the IDs of the parent folders in the path. You can
 * limit the maximum number of levels. You can also request the names of the parent
 * folders.
 */
export const getDocumentPath = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentPathRequest,
  output: GetDocumentPathResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Updates the specified attributes of the specified user, and grants or revokes
 * administrative privileges to the Amazon WorkDocs site.
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    DeactivatingLastSystemUserException,
    EntityNotExistsException,
    FailedDependencyException,
    IllegalUserStateException,
    InvalidArgumentException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Describes the specified users. You can describe all users or filter the results
 * (for example, by status or organization).
 *
 * By default, Amazon WorkDocs returns the first 24 active or pending users. If there
 * are more results, the response includes a marker that you can use to request the next
 * set of results.
 */
export const describeUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUsersRequest,
  output: DescribeUsersResponse,
  errors: [
    EntityNotExistsException,
    FailedDependencyException,
    InvalidArgumentException,
    RequestedEntityTooLargeException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Configure Amazon WorkDocs to use Amazon SNS notifications. The endpoint receives a
 * confirmation message, and must confirm the subscription.
 *
 * For more information, see Setting up notifications for an IAM user or role in the Amazon WorkDocs Developer
 * Guide.
 */
export const createNotificationSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateNotificationSubscriptionRequest,
    output: CreateNotificationSubscriptionResponse,
    errors: [
      InvalidArgumentException,
      ServiceUnavailableException,
      TooManySubscriptionsException,
      UnauthorizedResourceAccessException,
    ],
  }));
/**
 * Searches metadata and the content of folders, documents, document versions, and comments.
 */
export const searchResources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchResourcesRequest,
  output: SearchResourcesResponse,
  errors: [
    InvalidArgumentException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Creates a new document object and version object.
 *
 * The client specifies the parent folder ID and name of the document to upload. The
 * ID is optionally specified when creating a new version of an existing document. This is
 * the first step to upload a document. Next, upload the document to the URL returned from
 * the call, and then call UpdateDocumentVersion.
 *
 * To cancel the document upload, call AbortDocumentVersionUpload.
 */
export const initiateDocumentVersionUpload =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: InitiateDocumentVersionUploadRequest,
    output: InitiateDocumentVersionUploadResponse,
    errors: [
      DraftUploadOutOfSyncException,
      EntityAlreadyExistsException,
      EntityNotExistsException,
      FailedDependencyException,
      InvalidArgumentException,
      InvalidPasswordException,
      LimitExceededException,
      ProhibitedStateException,
      ResourceAlreadyCheckedOutException,
      ServiceUnavailableException,
      StorageLimitExceededException,
      StorageLimitWillExceedException,
      UnauthorizedOperationException,
      UnauthorizedResourceAccessException,
    ],
  }));
