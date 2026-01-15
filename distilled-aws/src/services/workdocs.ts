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
const ns = T.XmlNamespace("https://aws.amazon.com/api/v1/");
const svc = T.AwsApiService({
  sdkId: "WorkDocs",
  serviceShapeName: "AWSGorillaBoyService",
});
const auth = T.AwsAuthSigv4({ name: "workdocs" });
const ver = T.ServiceVersion("2016-05-01");
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
              `https://workdocs-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://workdocs-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://workdocs.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://workdocs.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AuthenticationHeaderType = string | redacted.Redacted<string>;
export type ResourceIdType = string;
export type DocumentVersionIdType = string;
export type IdType = string;
export type CommentIdType = string;
export type CommentTextType = string | redacted.Redacted<string>;
export type ResourceNameType = string | redacted.Redacted<string>;
export type SharedLabel = string;
export type SubscriptionEndPointType = string;
export type UsernameType = string | redacted.Redacted<string>;
export type EmailAddressType = string | redacted.Redacted<string>;
export type UserAttributeValueType = string | redacted.Redacted<string>;
export type PasswordType = string | redacted.Redacted<string>;
export type TimeZoneIdType = string;
export type CustomMetadataKeyType = string;
export type ActivityNamesFilterType = string;
export type LimitType = number;
export type SearchMarkerType = string;
export type MarkerType = string;
export type PageMarkerType = string;
export type FieldNamesType = string;
export type SearchQueryType = string | redacted.Redacted<string>;
export type PositiveIntegerType = number;
export type UserIdsType = string;
export type DocumentContentType = string;
export type SizeType = number;
export type SearchResultsLimitType = number;
export type NextMarkerType = string;
export type MessageType = string | redacted.Redacted<string>;
export type CustomMetadataValueType = string;
export type PositiveSizeType = number;
export type SearchLabel = string;
export type SearchAncestorId = string;
export type ErrorMessageType = string;
export type LongType = number;
export type HashType = string;
export type GroupNameType = string;
export type UrlType = string | redacted.Redacted<string>;
export type ExceptionCodeType = string;
export type HeaderNameType = string;
export type HeaderValueType = string;
export type ResponseItemWebUrl = string | redacted.Redacted<string>;

//# Schemas
export type CommentVisibilityType = "PUBLIC" | "PRIVATE" | (string & {});
export const CommentVisibilityType = S.String;
export type SharedLabels = string[];
export const SharedLabels = S.Array(S.String);
export type SubscriptionProtocolType = "HTTPS" | "SQS" | (string & {});
export const SubscriptionProtocolType = S.String;
export type SubscriptionType = "ALL" | (string & {});
export const SubscriptionType = S.String;
export type CustomMetadataKeyList = string[];
export const CustomMetadataKeyList = S.Array(S.String);
export type ResourceSortType = "DATE" | "NAME" | (string & {});
export const ResourceSortType = S.String;
export type OrderType = "ASCENDING" | "DESCENDING" | (string & {});
export const OrderType = S.String;
export type FolderContentType = "ALL" | "DOCUMENT" | "FOLDER" | (string & {});
export const FolderContentType = S.String;
export type UserFilterType = "ALL" | "ACTIVE_PENDING" | (string & {});
export const UserFilterType = S.String;
export type UserSortType =
  | "USER_NAME"
  | "FULL_NAME"
  | "STORAGE_LIMIT"
  | "USER_STATUS"
  | "STORAGE_USED"
  | (string & {});
export const UserSortType = S.String;
export type ResourceCollectionType = "SHARED_WITH_ME" | (string & {});
export const ResourceCollectionType = S.String;
export type PrincipalType =
  | "USER"
  | "GROUP"
  | "INVITE"
  | "ANONYMOUS"
  | "ORGANIZATION"
  | (string & {});
export const PrincipalType = S.String;
export type SearchQueryScopeType = "NAME" | "CONTENT" | (string & {});
export const SearchQueryScopeType = S.String;
export type SearchQueryScopeTypeList = SearchQueryScopeType[];
export const SearchQueryScopeTypeList = S.Array(SearchQueryScopeType);
export type AdditionalResponseFieldType = "WEBURL" | (string & {});
export const AdditionalResponseFieldType = S.String;
export type AdditionalResponseFieldsList = AdditionalResponseFieldType[];
export const AdditionalResponseFieldsList = S.Array(
  AdditionalResponseFieldType,
);
export type ResourceStateType =
  | "ACTIVE"
  | "RESTORING"
  | "RECYCLING"
  | "RECYCLED"
  | (string & {});
export const ResourceStateType = S.String;
export type DocumentVersionStatus = "ACTIVE" | (string & {});
export const DocumentVersionStatus = S.String;
export type UserType =
  | "USER"
  | "ADMIN"
  | "POWERUSER"
  | "MINIMALUSER"
  | "WORKSPACESUSER"
  | (string & {});
export const UserType = S.String;
export type LocaleType =
  | "en"
  | "fr"
  | "ko"
  | "de"
  | "es"
  | "ja"
  | "ru"
  | "zh_CN"
  | "zh_TW"
  | "pt_BR"
  | "default"
  | (string & {});
export const LocaleType = S.String;
export type BooleanEnumType = "TRUE" | "FALSE" | (string & {});
export const BooleanEnumType = S.String;
export interface AbortDocumentVersionUploadRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  VersionId: string;
}
export const AbortDocumentVersionUploadRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "AbortDocumentVersionUploadRequest",
}) as any as S.Schema<AbortDocumentVersionUploadRequest>;
export interface AbortDocumentVersionUploadResponse {}
export const AbortDocumentVersionUploadResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AbortDocumentVersionUploadResponse",
}) as any as S.Schema<AbortDocumentVersionUploadResponse>;
export interface ActivateUserRequest {
  UserId: string;
  AuthenticationToken?: string | redacted.Redacted<string>;
}
export const ActivateUserRequest = S.suspend(() =>
  S.Struct({
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/api/v1/users/{UserId}/activation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ActivateUserRequest",
}) as any as S.Schema<ActivateUserRequest>;
export interface CreateCommentRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  VersionId: string;
  ParentId?: string;
  ThreadId?: string;
  Text: string | redacted.Redacted<string>;
  Visibility?: CommentVisibilityType;
  NotifyCollaborators?: boolean;
}
export const CreateCommentRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    ParentId: S.optional(S.String),
    ThreadId: S.optional(S.String),
    Text: SensitiveString,
    Visibility: S.optional(CommentVisibilityType),
    NotifyCollaborators: S.optional(S.Boolean),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateCommentRequest",
}) as any as S.Schema<CreateCommentRequest>;
export interface CreateFolderRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  Name?: string | redacted.Redacted<string>;
  ParentFolderId: string;
}
export const CreateFolderRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    Name: S.optional(SensitiveString),
    ParentFolderId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/api/v1/folders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFolderRequest",
}) as any as S.Schema<CreateFolderRequest>;
export interface CreateLabelsRequest {
  ResourceId: string;
  Labels: string[];
  AuthenticationToken?: string | redacted.Redacted<string>;
}
export const CreateLabelsRequest = S.suspend(() =>
  S.Struct({
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    Labels: SharedLabels,
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/api/v1/resources/{ResourceId}/labels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLabelsRequest",
}) as any as S.Schema<CreateLabelsRequest>;
export interface CreateLabelsResponse {}
export const CreateLabelsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateLabelsResponse",
}) as any as S.Schema<CreateLabelsResponse>;
export interface CreateNotificationSubscriptionRequest {
  OrganizationId: string;
  Endpoint: string;
  Protocol: SubscriptionProtocolType;
  SubscriptionType: SubscriptionType;
}
export const CreateNotificationSubscriptionRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String.pipe(T.HttpLabel("OrganizationId")),
    Endpoint: S.String,
    Protocol: SubscriptionProtocolType,
    SubscriptionType: SubscriptionType,
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateNotificationSubscriptionRequest",
}) as any as S.Schema<CreateNotificationSubscriptionRequest>;
export interface DeactivateUserRequest {
  UserId: string;
  AuthenticationToken?: string | redacted.Redacted<string>;
}
export const DeactivateUserRequest = S.suspend(() =>
  S.Struct({
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/api/v1/users/{UserId}/activation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeactivateUserRequest",
}) as any as S.Schema<DeactivateUserRequest>;
export interface DeactivateUserResponse {}
export const DeactivateUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeactivateUserResponse",
}) as any as S.Schema<DeactivateUserResponse>;
export interface DeleteCommentRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  VersionId: string;
  CommentId: string;
}
export const DeleteCommentRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    CommentId: S.String.pipe(T.HttpLabel("CommentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCommentRequest",
}) as any as S.Schema<DeleteCommentRequest>;
export interface DeleteCommentResponse {}
export const DeleteCommentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCommentResponse",
}) as any as S.Schema<DeleteCommentResponse>;
export interface DeleteCustomMetadataRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  ResourceId: string;
  VersionId?: string;
  Keys?: string[];
  DeleteAll?: boolean;
}
export const DeleteCustomMetadataRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    Keys: S.optional(CustomMetadataKeyList).pipe(T.HttpQuery("keys")),
    DeleteAll: S.optional(S.Boolean).pipe(T.HttpQuery("deleteAll")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCustomMetadataRequest",
}) as any as S.Schema<DeleteCustomMetadataRequest>;
export interface DeleteCustomMetadataResponse {}
export const DeleteCustomMetadataResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCustomMetadataResponse",
}) as any as S.Schema<DeleteCustomMetadataResponse>;
export interface DeleteDocumentRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
}
export const DeleteDocumentRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/api/v1/documents/{DocumentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDocumentRequest",
}) as any as S.Schema<DeleteDocumentRequest>;
export interface DeleteDocumentResponse {}
export const DeleteDocumentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDocumentResponse",
}) as any as S.Schema<DeleteDocumentResponse>;
export interface DeleteDocumentVersionRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  VersionId: string;
  DeletePriorVersions: boolean;
}
export const DeleteDocumentVersionRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    DeletePriorVersions: S.Boolean.pipe(T.HttpQuery("deletePriorVersions")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDocumentVersionRequest",
}) as any as S.Schema<DeleteDocumentVersionRequest>;
export interface DeleteDocumentVersionResponse {}
export const DeleteDocumentVersionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDocumentVersionResponse",
}) as any as S.Schema<DeleteDocumentVersionResponse>;
export interface DeleteFolderRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  FolderId: string;
}
export const DeleteFolderRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/api/v1/folders/{FolderId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFolderRequest",
}) as any as S.Schema<DeleteFolderRequest>;
export interface DeleteFolderResponse {}
export const DeleteFolderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteFolderResponse",
}) as any as S.Schema<DeleteFolderResponse>;
export interface DeleteFolderContentsRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  FolderId: string;
}
export const DeleteFolderContentsRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/api/v1/folders/{FolderId}/contents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFolderContentsRequest",
}) as any as S.Schema<DeleteFolderContentsRequest>;
export interface DeleteFolderContentsResponse {}
export const DeleteFolderContentsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteFolderContentsResponse",
}) as any as S.Schema<DeleteFolderContentsResponse>;
export interface DeleteLabelsRequest {
  ResourceId: string;
  AuthenticationToken?: string | redacted.Redacted<string>;
  Labels?: string[];
  DeleteAll?: boolean;
}
export const DeleteLabelsRequest = S.suspend(() =>
  S.Struct({
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    Labels: S.optional(SharedLabels).pipe(T.HttpQuery("labels")),
    DeleteAll: S.optional(S.Boolean).pipe(T.HttpQuery("deleteAll")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/api/v1/resources/{ResourceId}/labels",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLabelsRequest",
}) as any as S.Schema<DeleteLabelsRequest>;
export interface DeleteLabelsResponse {}
export const DeleteLabelsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLabelsResponse",
}) as any as S.Schema<DeleteLabelsResponse>;
export interface DeleteNotificationSubscriptionRequest {
  SubscriptionId: string;
  OrganizationId: string;
}
export const DeleteNotificationSubscriptionRequest = S.suspend(() =>
  S.Struct({
    SubscriptionId: S.String.pipe(T.HttpLabel("SubscriptionId")),
    OrganizationId: S.String.pipe(T.HttpLabel("OrganizationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteNotificationSubscriptionRequest",
}) as any as S.Schema<DeleteNotificationSubscriptionRequest>;
export interface DeleteNotificationSubscriptionResponse {}
export const DeleteNotificationSubscriptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteNotificationSubscriptionResponse",
}) as any as S.Schema<DeleteNotificationSubscriptionResponse>;
export interface DeleteUserRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  UserId: string;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/api/v1/users/{UserId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUserRequest",
}) as any as S.Schema<DeleteUserRequest>;
export interface DeleteUserResponse {}
export const DeleteUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserResponse",
}) as any as S.Schema<DeleteUserResponse>;
export interface DescribeActivitiesRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  StartTime?: Date;
  EndTime?: Date;
  OrganizationId?: string;
  ActivityTypes?: string;
  ResourceId?: string;
  UserId?: string;
  IncludeIndirectActivities?: boolean;
  Limit?: number;
  Marker?: string;
}
export const DescribeActivitiesRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/activities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeActivitiesRequest",
}) as any as S.Schema<DescribeActivitiesRequest>;
export interface DescribeCommentsRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  VersionId: string;
  Limit?: number;
  Marker?: string;
}
export const DescribeCommentsRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeCommentsRequest",
}) as any as S.Schema<DescribeCommentsRequest>;
export interface DescribeDocumentVersionsRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  Marker?: string;
  Limit?: number;
  Include?: string;
  Fields?: string;
}
export const DescribeDocumentVersionsRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Include: S.optional(S.String).pipe(T.HttpQuery("include")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/documents/{DocumentId}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDocumentVersionsRequest",
}) as any as S.Schema<DescribeDocumentVersionsRequest>;
export interface DescribeFolderContentsRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  FolderId: string;
  Sort?: ResourceSortType;
  Order?: OrderType;
  Limit?: number;
  Marker?: string;
  Type?: FolderContentType;
  Include?: string;
}
export const DescribeFolderContentsRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Sort: S.optional(ResourceSortType).pipe(T.HttpQuery("sort")),
    Order: S.optional(OrderType).pipe(T.HttpQuery("order")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Type: S.optional(FolderContentType).pipe(T.HttpQuery("type")),
    Include: S.optional(S.String).pipe(T.HttpQuery("include")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/folders/{FolderId}/contents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFolderContentsRequest",
}) as any as S.Schema<DescribeFolderContentsRequest>;
export interface DescribeGroupsRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  SearchQuery: string | redacted.Redacted<string>;
  OrganizationId?: string;
  Marker?: string;
  Limit?: number;
}
export const DescribeGroupsRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    SearchQuery: SensitiveString.pipe(T.HttpQuery("searchQuery")),
    OrganizationId: S.optional(S.String).pipe(T.HttpQuery("organizationId")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeGroupsRequest",
}) as any as S.Schema<DescribeGroupsRequest>;
export interface DescribeNotificationSubscriptionsRequest {
  OrganizationId: string;
  Marker?: string;
  Limit?: number;
}
export const DescribeNotificationSubscriptionsRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String.pipe(T.HttpLabel("OrganizationId")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeNotificationSubscriptionsRequest",
}) as any as S.Schema<DescribeNotificationSubscriptionsRequest>;
export interface DescribeResourcePermissionsRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  ResourceId: string;
  PrincipalId?: string;
  Limit?: number;
  Marker?: string;
}
export const DescribeResourcePermissionsRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    PrincipalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeResourcePermissionsRequest",
}) as any as S.Schema<DescribeResourcePermissionsRequest>;
export interface DescribeRootFoldersRequest {
  AuthenticationToken: string | redacted.Redacted<string>;
  Limit?: number;
  Marker?: string;
}
export const DescribeRootFoldersRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: SensitiveString.pipe(T.HttpHeader("Authentication")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/me/root" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRootFoldersRequest",
}) as any as S.Schema<DescribeRootFoldersRequest>;
export interface DescribeUsersRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  OrganizationId?: string;
  UserIds?: string;
  Query?: string | redacted.Redacted<string>;
  Include?: UserFilterType;
  Order?: OrderType;
  Sort?: UserSortType;
  Marker?: string;
  Limit?: number;
  Fields?: string;
}
export const DescribeUsersRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    OrganizationId: S.optional(S.String).pipe(T.HttpQuery("organizationId")),
    UserIds: S.optional(S.String).pipe(T.HttpQuery("userIds")),
    Query: S.optional(SensitiveString).pipe(T.HttpQuery("query")),
    Include: S.optional(UserFilterType).pipe(T.HttpQuery("include")),
    Order: S.optional(OrderType).pipe(T.HttpQuery("order")),
    Sort: S.optional(UserSortType).pipe(T.HttpQuery("sort")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeUsersRequest",
}) as any as S.Schema<DescribeUsersRequest>;
export interface GetCurrentUserRequest {
  AuthenticationToken: string | redacted.Redacted<string>;
}
export const GetCurrentUserRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: SensitiveString.pipe(T.HttpHeader("Authentication")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/me" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCurrentUserRequest",
}) as any as S.Schema<GetCurrentUserRequest>;
export interface GetDocumentRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  IncludeCustomMetadata?: boolean;
}
export const GetDocumentRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    IncludeCustomMetadata: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeCustomMetadata"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/documents/{DocumentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDocumentRequest",
}) as any as S.Schema<GetDocumentRequest>;
export interface GetDocumentPathRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  Limit?: number;
  Fields?: string;
  Marker?: string;
}
export const GetDocumentPathRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/documents/{DocumentId}/path" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDocumentPathRequest",
}) as any as S.Schema<GetDocumentPathRequest>;
export interface GetDocumentVersionRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  VersionId: string;
  Fields?: string;
  IncludeCustomMetadata?: boolean;
}
export const GetDocumentVersionRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
    IncludeCustomMetadata: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeCustomMetadata"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDocumentVersionRequest",
}) as any as S.Schema<GetDocumentVersionRequest>;
export interface GetFolderRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  FolderId: string;
  IncludeCustomMetadata?: boolean;
}
export const GetFolderRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    IncludeCustomMetadata: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeCustomMetadata"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/folders/{FolderId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFolderRequest",
}) as any as S.Schema<GetFolderRequest>;
export interface GetFolderPathRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  FolderId: string;
  Limit?: number;
  Fields?: string;
  Marker?: string;
}
export const GetFolderPathRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Fields: S.optional(S.String).pipe(T.HttpQuery("fields")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/folders/{FolderId}/path" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFolderPathRequest",
}) as any as S.Schema<GetFolderPathRequest>;
export interface GetResourcesRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  UserId?: string;
  CollectionType?: ResourceCollectionType;
  Limit?: number;
  Marker?: string;
}
export const GetResourcesRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    UserId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    CollectionType: S.optional(ResourceCollectionType).pipe(
      T.HttpQuery("collectionType"),
    ),
    Limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/api/v1/resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcesRequest",
}) as any as S.Schema<GetResourcesRequest>;
export interface InitiateDocumentVersionUploadRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  Id?: string;
  Name?: string | redacted.Redacted<string>;
  ContentCreatedTimestamp?: Date;
  ContentModifiedTimestamp?: Date;
  ContentType?: string;
  DocumentSizeInBytes?: number;
  ParentFolderId?: string;
}
export const InitiateDocumentVersionUploadRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    Id: S.optional(S.String),
    Name: S.optional(SensitiveString),
    ContentCreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ContentModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ContentType: S.optional(S.String),
    DocumentSizeInBytes: S.optional(S.Number),
    ParentFolderId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/api/v1/documents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InitiateDocumentVersionUploadRequest",
}) as any as S.Schema<InitiateDocumentVersionUploadRequest>;
export interface RemoveAllResourcePermissionsRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  ResourceId: string;
}
export const RemoveAllResourcePermissionsRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "RemoveAllResourcePermissionsRequest",
}) as any as S.Schema<RemoveAllResourcePermissionsRequest>;
export interface RemoveAllResourcePermissionsResponse {}
export const RemoveAllResourcePermissionsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveAllResourcePermissionsResponse",
}) as any as S.Schema<RemoveAllResourcePermissionsResponse>;
export interface RemoveResourcePermissionRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  ResourceId: string;
  PrincipalId: string;
  PrincipalType?: PrincipalType;
}
export const RemoveResourcePermissionRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    PrincipalId: S.String.pipe(T.HttpLabel("PrincipalId")),
    PrincipalType: S.optional(PrincipalType).pipe(T.HttpQuery("type")),
  }).pipe(
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
  ),
).annotations({
  identifier: "RemoveResourcePermissionRequest",
}) as any as S.Schema<RemoveResourcePermissionRequest>;
export interface RemoveResourcePermissionResponse {}
export const RemoveResourcePermissionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveResourcePermissionResponse",
}) as any as S.Schema<RemoveResourcePermissionResponse>;
export interface RestoreDocumentVersionsRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
}
export const RestoreDocumentVersionsRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "RestoreDocumentVersionsRequest",
}) as any as S.Schema<RestoreDocumentVersionsRequest>;
export interface RestoreDocumentVersionsResponse {}
export const RestoreDocumentVersionsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RestoreDocumentVersionsResponse",
}) as any as S.Schema<RestoreDocumentVersionsResponse>;
export interface UpdateDocumentRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  Name?: string | redacted.Redacted<string>;
  ParentFolderId?: string;
  ResourceState?: ResourceStateType;
}
export const UpdateDocumentRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    Name: S.optional(SensitiveString),
    ParentFolderId: S.optional(S.String),
    ResourceState: S.optional(ResourceStateType),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PATCH", uri: "/api/v1/documents/{DocumentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDocumentRequest",
}) as any as S.Schema<UpdateDocumentRequest>;
export interface UpdateDocumentResponse {}
export const UpdateDocumentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDocumentResponse",
}) as any as S.Schema<UpdateDocumentResponse>;
export interface UpdateDocumentVersionRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  DocumentId: string;
  VersionId: string;
  VersionStatus?: DocumentVersionStatus;
}
export const UpdateDocumentVersionRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    DocumentId: S.String.pipe(T.HttpLabel("DocumentId")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
    VersionStatus: S.optional(DocumentVersionStatus),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDocumentVersionRequest",
}) as any as S.Schema<UpdateDocumentVersionRequest>;
export interface UpdateDocumentVersionResponse {}
export const UpdateDocumentVersionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDocumentVersionResponse",
}) as any as S.Schema<UpdateDocumentVersionResponse>;
export interface UpdateFolderRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  FolderId: string;
  Name?: string | redacted.Redacted<string>;
  ParentFolderId?: string;
  ResourceState?: ResourceStateType;
}
export const UpdateFolderRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Name: S.optional(SensitiveString),
    ParentFolderId: S.optional(S.String),
    ResourceState: S.optional(ResourceStateType),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PATCH", uri: "/api/v1/folders/{FolderId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFolderRequest",
}) as any as S.Schema<UpdateFolderRequest>;
export interface UpdateFolderResponse {}
export const UpdateFolderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateFolderResponse",
}) as any as S.Schema<UpdateFolderResponse>;
export type StorageType = "UNLIMITED" | "QUOTA" | (string & {});
export const StorageType = S.String;
export interface StorageRuleType {
  StorageAllocatedInBytes?: number;
  StorageType?: StorageType;
}
export const StorageRuleType = S.suspend(() =>
  S.Struct({
    StorageAllocatedInBytes: S.optional(S.Number),
    StorageType: S.optional(StorageType),
  }),
).annotations({
  identifier: "StorageRuleType",
}) as any as S.Schema<StorageRuleType>;
export interface UpdateUserRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  UserId: string;
  GivenName?: string | redacted.Redacted<string>;
  Surname?: string | redacted.Redacted<string>;
  Type?: UserType;
  StorageRule?: StorageRuleType;
  TimeZoneId?: string;
  Locale?: LocaleType;
  GrantPoweruserPrivileges?: BooleanEnumType;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    GivenName: S.optional(SensitiveString),
    Surname: S.optional(SensitiveString),
    Type: S.optional(UserType),
    StorageRule: S.optional(StorageRuleType),
    TimeZoneId: S.optional(S.String),
    Locale: S.optional(LocaleType),
    GrantPoweruserPrivileges: S.optional(BooleanEnumType),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PATCH", uri: "/api/v1/users/{UserId}" }),
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
export type RoleType =
  | "VIEWER"
  | "CONTRIBUTOR"
  | "OWNER"
  | "COOWNER"
  | (string & {});
export const RoleType = S.String;
export type LanguageCodeType =
  | "AR"
  | "BG"
  | "BN"
  | "DA"
  | "DE"
  | "CS"
  | "EL"
  | "EN"
  | "ES"
  | "FA"
  | "FI"
  | "FR"
  | "HI"
  | "HU"
  | "ID"
  | "IT"
  | "JA"
  | "KO"
  | "LT"
  | "LV"
  | "NL"
  | "NO"
  | "PT"
  | "RO"
  | "RU"
  | "SV"
  | "SW"
  | "TH"
  | "TR"
  | "ZH"
  | "DEFAULT"
  | (string & {});
export const LanguageCodeType = S.String;
export type TextLocaleTypeList = LanguageCodeType[];
export const TextLocaleTypeList = S.Array(LanguageCodeType);
export type ContentCategoryType =
  | "IMAGE"
  | "DOCUMENT"
  | "PDF"
  | "SPREADSHEET"
  | "PRESENTATION"
  | "AUDIO"
  | "VIDEO"
  | "SOURCE_CODE"
  | "OTHER"
  | (string & {});
export const ContentCategoryType = S.String;
export type SearchContentCategoryTypeList = ContentCategoryType[];
export const SearchContentCategoryTypeList = S.Array(ContentCategoryType);
export type SearchResourceType =
  | "FOLDER"
  | "DOCUMENT"
  | "COMMENT"
  | "DOCUMENT_VERSION"
  | (string & {});
export const SearchResourceType = S.String;
export type SearchResourceTypeList = SearchResourceType[];
export const SearchResourceTypeList = S.Array(SearchResourceType);
export type SearchLabelList = string[];
export const SearchLabelList = S.Array(S.String);
export type SearchAncestorIdList = string[];
export const SearchAncestorIdList = S.Array(S.String);
export type SearchCollectionType = "OWNED" | "SHARED_WITH_ME" | (string & {});
export const SearchCollectionType = S.String;
export type SearchCollectionTypeList = SearchCollectionType[];
export const SearchCollectionTypeList = S.Array(SearchCollectionType);
export type OrderByFieldType =
  | "RELEVANCE"
  | "NAME"
  | "SIZE"
  | "CREATED_TIMESTAMP"
  | "MODIFIED_TIMESTAMP"
  | (string & {});
export const OrderByFieldType = S.String;
export type SortOrder = "ASC" | "DESC" | (string & {});
export const SortOrder = S.String;
export interface SharePrincipal {
  Id: string;
  Type: PrincipalType;
  Role: RoleType;
}
export const SharePrincipal = S.suspend(() =>
  S.Struct({ Id: S.String, Type: PrincipalType, Role: RoleType }),
).annotations({
  identifier: "SharePrincipal",
}) as any as S.Schema<SharePrincipal>;
export type SharePrincipalList = SharePrincipal[];
export const SharePrincipalList = S.Array(SharePrincipal);
export interface NotificationOptions {
  SendEmail?: boolean;
  EmailMessage?: string | redacted.Redacted<string>;
}
export const NotificationOptions = S.suspend(() =>
  S.Struct({
    SendEmail: S.optional(S.Boolean),
    EmailMessage: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "NotificationOptions",
}) as any as S.Schema<NotificationOptions>;
export type CustomMetadataMap = { [key: string]: string | undefined };
export const CustomMetadataMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type EntityIdList = string[];
export const EntityIdList = S.Array(S.String);
export type UserStatusType = "ACTIVE" | "INACTIVE" | "PENDING" | (string & {});
export const UserStatusType = S.String;
export interface UserStorageMetadata {
  StorageUtilizedInBytes?: number;
  StorageRule?: StorageRuleType;
}
export const UserStorageMetadata = S.suspend(() =>
  S.Struct({
    StorageUtilizedInBytes: S.optional(S.Number),
    StorageRule: S.optional(StorageRuleType),
  }),
).annotations({
  identifier: "UserStorageMetadata",
}) as any as S.Schema<UserStorageMetadata>;
export interface User {
  Id?: string;
  Username?: string | redacted.Redacted<string>;
  EmailAddress?: string | redacted.Redacted<string>;
  GivenName?: string | redacted.Redacted<string>;
  Surname?: string | redacted.Redacted<string>;
  OrganizationId?: string;
  RootFolderId?: string;
  RecycleBinFolderId?: string;
  Status?: UserStatusType;
  Type?: UserType;
  CreatedTimestamp?: Date;
  ModifiedTimestamp?: Date;
  TimeZoneId?: string;
  Locale?: LocaleType;
  Storage?: UserStorageMetadata;
}
export const User = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Username: S.optional(SensitiveString),
    EmailAddress: S.optional(SensitiveString),
    GivenName: S.optional(SensitiveString),
    Surname: S.optional(SensitiveString),
    OrganizationId: S.optional(S.String),
    RootFolderId: S.optional(S.String),
    RecycleBinFolderId: S.optional(S.String),
    Status: S.optional(UserStatusType),
    Type: S.optional(UserType),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TimeZoneId: S.optional(S.String),
    Locale: S.optional(LocaleType),
    Storage: S.optional(UserStorageMetadata),
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type CommentStatusType =
  | "DRAFT"
  | "PUBLISHED"
  | "DELETED"
  | (string & {});
export const CommentStatusType = S.String;
export interface Comment {
  CommentId: string;
  ParentId?: string;
  ThreadId?: string;
  Text?: string | redacted.Redacted<string>;
  Contributor?: User;
  CreatedTimestamp?: Date;
  Status?: CommentStatusType;
  Visibility?: CommentVisibilityType;
  RecipientId?: string;
}
export const Comment = S.suspend(() =>
  S.Struct({
    CommentId: S.String,
    ParentId: S.optional(S.String),
    ThreadId: S.optional(S.String),
    Text: S.optional(SensitiveString),
    Contributor: S.optional(User),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Status: S.optional(CommentStatusType),
    Visibility: S.optional(CommentVisibilityType),
    RecipientId: S.optional(S.String),
  }),
).annotations({ identifier: "Comment" }) as any as S.Schema<Comment>;
export type CommentList = Comment[];
export const CommentList = S.Array(Comment);
export interface FolderMetadata {
  Id?: string;
  Name?: string | redacted.Redacted<string>;
  CreatorId?: string;
  ParentFolderId?: string;
  CreatedTimestamp?: Date;
  ModifiedTimestamp?: Date;
  ResourceState?: ResourceStateType;
  Signature?: string;
  Labels?: string[];
  Size?: number;
  LatestVersionSize?: number;
}
export const FolderMetadata = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(SensitiveString),
    CreatorId: S.optional(S.String),
    ParentFolderId: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResourceState: S.optional(ResourceStateType),
    Signature: S.optional(S.String),
    Labels: S.optional(SharedLabels),
    Size: S.optional(S.Number),
    LatestVersionSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "FolderMetadata",
}) as any as S.Schema<FolderMetadata>;
export type FolderMetadataList = FolderMetadata[];
export const FolderMetadataList = S.Array(FolderMetadata);
export interface Subscription {
  SubscriptionId?: string;
  EndPoint?: string;
  Protocol?: SubscriptionProtocolType;
}
export const Subscription = S.suspend(() =>
  S.Struct({
    SubscriptionId: S.optional(S.String),
    EndPoint: S.optional(S.String),
    Protocol: S.optional(SubscriptionProtocolType),
  }),
).annotations({ identifier: "Subscription" }) as any as S.Schema<Subscription>;
export type SubscriptionList = Subscription[];
export const SubscriptionList = S.Array(Subscription);
export type OrganizationUserList = User[];
export const OrganizationUserList = S.Array(User);
export interface SearchSortResult {
  Field?: OrderByFieldType;
  Order?: SortOrder;
}
export const SearchSortResult = S.suspend(() =>
  S.Struct({
    Field: S.optional(OrderByFieldType),
    Order: S.optional(SortOrder),
  }),
).annotations({
  identifier: "SearchSortResult",
}) as any as S.Schema<SearchSortResult>;
export type SearchResultSortList = SearchSortResult[];
export const SearchResultSortList = S.Array(SearchSortResult);
export type PrincipalRoleType =
  | "VIEWER"
  | "CONTRIBUTOR"
  | "OWNER"
  | "COOWNER"
  | (string & {});
export const PrincipalRoleType = S.String;
export type SearchPrincipalRoleList = PrincipalRoleType[];
export const SearchPrincipalRoleList = S.Array(PrincipalRoleType);
export interface AddResourcePermissionsRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  ResourceId: string;
  Principals: SharePrincipal[];
  NotificationOptions?: NotificationOptions;
}
export const AddResourcePermissionsRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    Principals: SharePrincipalList,
    NotificationOptions: S.optional(NotificationOptions),
  }).pipe(
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
  ),
).annotations({
  identifier: "AddResourcePermissionsRequest",
}) as any as S.Schema<AddResourcePermissionsRequest>;
export interface CreateCustomMetadataRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  ResourceId: string;
  VersionId?: string;
  CustomMetadata: { [key: string]: string | undefined };
}
export const CreateCustomMetadataRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionid")),
    CustomMetadata: CustomMetadataMap,
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateCustomMetadataRequest",
}) as any as S.Schema<CreateCustomMetadataRequest>;
export interface CreateCustomMetadataResponse {}
export const CreateCustomMetadataResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateCustomMetadataResponse",
}) as any as S.Schema<CreateCustomMetadataResponse>;
export interface CreateUserRequest {
  OrganizationId?: string;
  Username: string | redacted.Redacted<string>;
  EmailAddress?: string | redacted.Redacted<string>;
  GivenName: string | redacted.Redacted<string>;
  Surname: string | redacted.Redacted<string>;
  Password: string | redacted.Redacted<string>;
  TimeZoneId?: string;
  StorageRule?: StorageRuleType;
  AuthenticationToken?: string | redacted.Redacted<string>;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.optional(S.String),
    Username: SensitiveString,
    EmailAddress: S.optional(SensitiveString),
    GivenName: SensitiveString,
    Surname: SensitiveString,
    Password: SensitiveString,
    TimeZoneId: S.optional(S.String),
    StorageRule: S.optional(StorageRuleType),
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/api/v1/users" }),
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
export interface DescribeCommentsResponse {
  Comments?: Comment[];
  Marker?: string;
}
export const DescribeCommentsResponse = S.suspend(() =>
  S.Struct({
    Comments: S.optional(CommentList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeCommentsResponse",
}) as any as S.Schema<DescribeCommentsResponse>;
export interface DescribeNotificationSubscriptionsResponse {
  Subscriptions?: Subscription[];
  Marker?: string;
}
export const DescribeNotificationSubscriptionsResponse = S.suspend(() =>
  S.Struct({
    Subscriptions: S.optional(SubscriptionList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeNotificationSubscriptionsResponse",
}) as any as S.Schema<DescribeNotificationSubscriptionsResponse>;
export interface DescribeRootFoldersResponse {
  Folders?: FolderMetadata[];
  Marker?: string;
}
export const DescribeRootFoldersResponse = S.suspend(() =>
  S.Struct({
    Folders: S.optional(FolderMetadataList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRootFoldersResponse",
}) as any as S.Schema<DescribeRootFoldersResponse>;
export interface DescribeUsersResponse {
  Users?: User[];
  TotalNumberOfUsers?: number;
  Marker?: string;
}
export const DescribeUsersResponse = S.suspend(() =>
  S.Struct({
    Users: S.optional(OrganizationUserList),
    TotalNumberOfUsers: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeUsersResponse",
}) as any as S.Schema<DescribeUsersResponse>;
export interface GetCurrentUserResponse {
  User?: User;
}
export const GetCurrentUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }).pipe(ns),
).annotations({
  identifier: "GetCurrentUserResponse",
}) as any as S.Schema<GetCurrentUserResponse>;
export type DocumentStatusType = "INITIALIZED" | "ACTIVE" | (string & {});
export const DocumentStatusType = S.String;
export type DocumentThumbnailType =
  | "SMALL"
  | "SMALL_HQ"
  | "LARGE"
  | (string & {});
export const DocumentThumbnailType = S.String;
export type DocumentThumbnailUrlMap = {
  [key in DocumentThumbnailType]?: string | redacted.Redacted<string>;
};
export const DocumentThumbnailUrlMap = S.partial(
  S.Record({
    key: DocumentThumbnailType,
    value: S.UndefinedOr(SensitiveString),
  }),
);
export type DocumentSourceType = "ORIGINAL" | "WITH_COMMENTS" | (string & {});
export const DocumentSourceType = S.String;
export type DocumentSourceUrlMap = {
  [key in DocumentSourceType]?: string | redacted.Redacted<string>;
};
export const DocumentSourceUrlMap = S.partial(
  S.Record({ key: DocumentSourceType, value: S.UndefinedOr(SensitiveString) }),
);
export interface DocumentVersionMetadata {
  Id?: string;
  Name?: string | redacted.Redacted<string>;
  ContentType?: string;
  Size?: number;
  Signature?: string;
  Status?: DocumentStatusType;
  CreatedTimestamp?: Date;
  ModifiedTimestamp?: Date;
  ContentCreatedTimestamp?: Date;
  ContentModifiedTimestamp?: Date;
  CreatorId?: string;
  Thumbnail?: { [key: string]: string | redacted.Redacted<string> | undefined };
  Source?: { [key: string]: string | redacted.Redacted<string> | undefined };
}
export const DocumentVersionMetadata = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(SensitiveString),
    ContentType: S.optional(S.String),
    Size: S.optional(S.Number),
    Signature: S.optional(S.String),
    Status: S.optional(DocumentStatusType),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
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
  }),
).annotations({
  identifier: "DocumentVersionMetadata",
}) as any as S.Schema<DocumentVersionMetadata>;
export interface DocumentMetadata {
  Id?: string;
  CreatorId?: string;
  ParentFolderId?: string;
  CreatedTimestamp?: Date;
  ModifiedTimestamp?: Date;
  LatestVersionMetadata?: DocumentVersionMetadata;
  ResourceState?: ResourceStateType;
  Labels?: string[];
}
export const DocumentMetadata = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    CreatorId: S.optional(S.String),
    ParentFolderId: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestVersionMetadata: S.optional(DocumentVersionMetadata),
    ResourceState: S.optional(ResourceStateType),
    Labels: S.optional(SharedLabels),
  }),
).annotations({
  identifier: "DocumentMetadata",
}) as any as S.Schema<DocumentMetadata>;
export interface GetDocumentResponse {
  Metadata?: DocumentMetadata;
  CustomMetadata?: { [key: string]: string | undefined };
}
export const GetDocumentResponse = S.suspend(() =>
  S.Struct({
    Metadata: S.optional(DocumentMetadata),
    CustomMetadata: S.optional(CustomMetadataMap),
  }).pipe(ns),
).annotations({
  identifier: "GetDocumentResponse",
}) as any as S.Schema<GetDocumentResponse>;
export interface GetDocumentVersionResponse {
  Metadata?: DocumentVersionMetadata;
  CustomMetadata?: { [key: string]: string | undefined };
}
export const GetDocumentVersionResponse = S.suspend(() =>
  S.Struct({
    Metadata: S.optional(DocumentVersionMetadata),
    CustomMetadata: S.optional(CustomMetadataMap),
  }).pipe(ns),
).annotations({
  identifier: "GetDocumentVersionResponse",
}) as any as S.Schema<GetDocumentVersionResponse>;
export interface GetFolderResponse {
  Metadata?: FolderMetadata;
  CustomMetadata?: { [key: string]: string | undefined };
}
export const GetFolderResponse = S.suspend(() =>
  S.Struct({
    Metadata: S.optional(FolderMetadata),
    CustomMetadata: S.optional(CustomMetadataMap),
  }).pipe(ns),
).annotations({
  identifier: "GetFolderResponse",
}) as any as S.Schema<GetFolderResponse>;
export interface ResourcePathComponent {
  Id?: string;
  Name?: string | redacted.Redacted<string>;
}
export const ResourcePathComponent = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Name: S.optional(SensitiveString) }),
).annotations({
  identifier: "ResourcePathComponent",
}) as any as S.Schema<ResourcePathComponent>;
export type ResourcePathComponentList = ResourcePathComponent[];
export const ResourcePathComponentList = S.Array(ResourcePathComponent);
export interface ResourcePath {
  Components?: ResourcePathComponent[];
}
export const ResourcePath = S.suspend(() =>
  S.Struct({ Components: S.optional(ResourcePathComponentList) }),
).annotations({ identifier: "ResourcePath" }) as any as S.Schema<ResourcePath>;
export interface GetFolderPathResponse {
  Path?: ResourcePath;
}
export const GetFolderPathResponse = S.suspend(() =>
  S.Struct({ Path: S.optional(ResourcePath) }).pipe(ns),
).annotations({
  identifier: "GetFolderPathResponse",
}) as any as S.Schema<GetFolderPathResponse>;
export type DocumentMetadataList = DocumentMetadata[];
export const DocumentMetadataList = S.Array(DocumentMetadata);
export interface GetResourcesResponse {
  Folders?: FolderMetadata[];
  Documents?: DocumentMetadata[];
  Marker?: string;
}
export const GetResourcesResponse = S.suspend(() =>
  S.Struct({
    Folders: S.optional(FolderMetadataList),
    Documents: S.optional(DocumentMetadataList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetResourcesResponse",
}) as any as S.Schema<GetResourcesResponse>;
export interface UpdateUserResponse {
  User?: User;
}
export const UpdateUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }).pipe(ns),
).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export type ActivityType =
  | "DOCUMENT_CHECKED_IN"
  | "DOCUMENT_CHECKED_OUT"
  | "DOCUMENT_RENAMED"
  | "DOCUMENT_VERSION_UPLOADED"
  | "DOCUMENT_VERSION_DELETED"
  | "DOCUMENT_VERSION_VIEWED"
  | "DOCUMENT_VERSION_DOWNLOADED"
  | "DOCUMENT_RECYCLED"
  | "DOCUMENT_RESTORED"
  | "DOCUMENT_REVERTED"
  | "DOCUMENT_SHARED"
  | "DOCUMENT_UNSHARED"
  | "DOCUMENT_SHARE_PERMISSION_CHANGED"
  | "DOCUMENT_SHAREABLE_LINK_CREATED"
  | "DOCUMENT_SHAREABLE_LINK_REMOVED"
  | "DOCUMENT_SHAREABLE_LINK_PERMISSION_CHANGED"
  | "DOCUMENT_MOVED"
  | "DOCUMENT_COMMENT_ADDED"
  | "DOCUMENT_COMMENT_DELETED"
  | "DOCUMENT_ANNOTATION_ADDED"
  | "DOCUMENT_ANNOTATION_DELETED"
  | "FOLDER_CREATED"
  | "FOLDER_DELETED"
  | "FOLDER_RENAMED"
  | "FOLDER_RECYCLED"
  | "FOLDER_RESTORED"
  | "FOLDER_SHARED"
  | "FOLDER_UNSHARED"
  | "FOLDER_SHARE_PERMISSION_CHANGED"
  | "FOLDER_SHAREABLE_LINK_CREATED"
  | "FOLDER_SHAREABLE_LINK_REMOVED"
  | "FOLDER_SHAREABLE_LINK_PERMISSION_CHANGED"
  | "FOLDER_MOVED"
  | (string & {});
export const ActivityType = S.String;
export interface SearchPrincipalType {
  Id: string;
  Roles?: PrincipalRoleType[];
}
export const SearchPrincipalType = S.suspend(() =>
  S.Struct({ Id: S.String, Roles: S.optional(SearchPrincipalRoleList) }),
).annotations({
  identifier: "SearchPrincipalType",
}) as any as S.Schema<SearchPrincipalType>;
export type SearchPrincipalTypeList = SearchPrincipalType[];
export const SearchPrincipalTypeList = S.Array(SearchPrincipalType);
export interface LongRangeType {
  StartValue?: number;
  EndValue?: number;
}
export const LongRangeType = S.suspend(() =>
  S.Struct({
    StartValue: S.optional(S.Number),
    EndValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "LongRangeType",
}) as any as S.Schema<LongRangeType>;
export interface DateRangeType {
  StartValue?: Date;
  EndValue?: Date;
}
export const DateRangeType = S.suspend(() =>
  S.Struct({
    StartValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DateRangeType",
}) as any as S.Schema<DateRangeType>;
export interface GroupMetadata {
  Id?: string;
  Name?: string;
}
export const GroupMetadata = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "GroupMetadata",
}) as any as S.Schema<GroupMetadata>;
export type GroupMetadataList = GroupMetadata[];
export const GroupMetadataList = S.Array(GroupMetadata);
export interface Filters {
  TextLocales?: LanguageCodeType[];
  ContentCategories?: ContentCategoryType[];
  ResourceTypes?: SearchResourceType[];
  Labels?: string[];
  Principals?: SearchPrincipalType[];
  AncestorIds?: string[];
  SearchCollectionTypes?: SearchCollectionType[];
  SizeRange?: LongRangeType;
  CreatedRange?: DateRangeType;
  ModifiedRange?: DateRangeType;
}
export const Filters = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Filters" }) as any as S.Schema<Filters>;
export interface UserMetadata {
  Id?: string;
  Username?: string | redacted.Redacted<string>;
  GivenName?: string | redacted.Redacted<string>;
  Surname?: string | redacted.Redacted<string>;
  EmailAddress?: string | redacted.Redacted<string>;
}
export const UserMetadata = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Username: S.optional(SensitiveString),
    GivenName: S.optional(SensitiveString),
    Surname: S.optional(SensitiveString),
    EmailAddress: S.optional(SensitiveString),
  }),
).annotations({ identifier: "UserMetadata" }) as any as S.Schema<UserMetadata>;
export type UserMetadataList = UserMetadata[];
export const UserMetadataList = S.Array(UserMetadata);
export type ResourceType = "FOLDER" | "DOCUMENT" | (string & {});
export const ResourceType = S.String;
export type RolePermissionType = "DIRECT" | "INHERITED" | (string & {});
export const RolePermissionType = S.String;
export interface CreateCommentResponse {
  Comment?: Comment;
}
export const CreateCommentResponse = S.suspend(() =>
  S.Struct({ Comment: S.optional(Comment) }).pipe(ns),
).annotations({
  identifier: "CreateCommentResponse",
}) as any as S.Schema<CreateCommentResponse>;
export interface CreateFolderResponse {
  Metadata?: FolderMetadata;
}
export const CreateFolderResponse = S.suspend(() =>
  S.Struct({ Metadata: S.optional(FolderMetadata) }).pipe(ns),
).annotations({
  identifier: "CreateFolderResponse",
}) as any as S.Schema<CreateFolderResponse>;
export interface CreateNotificationSubscriptionResponse {
  Subscription?: Subscription;
}
export const CreateNotificationSubscriptionResponse = S.suspend(() =>
  S.Struct({ Subscription: S.optional(Subscription) }).pipe(ns),
).annotations({
  identifier: "CreateNotificationSubscriptionResponse",
}) as any as S.Schema<CreateNotificationSubscriptionResponse>;
export interface CreateUserResponse {
  User?: User;
}
export const CreateUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }).pipe(ns),
).annotations({
  identifier: "CreateUserResponse",
}) as any as S.Schema<CreateUserResponse>;
export interface DescribeFolderContentsResponse {
  Folders?: FolderMetadata[];
  Documents?: DocumentMetadata[];
  Marker?: string;
}
export const DescribeFolderContentsResponse = S.suspend(() =>
  S.Struct({
    Folders: S.optional(FolderMetadataList),
    Documents: S.optional(DocumentMetadataList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeFolderContentsResponse",
}) as any as S.Schema<DescribeFolderContentsResponse>;
export interface DescribeGroupsResponse {
  Groups?: GroupMetadata[];
  Marker?: string;
}
export const DescribeGroupsResponse = S.suspend(() =>
  S.Struct({
    Groups: S.optional(GroupMetadataList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeGroupsResponse",
}) as any as S.Schema<DescribeGroupsResponse>;
export interface SearchResourcesRequest {
  AuthenticationToken?: string | redacted.Redacted<string>;
  QueryText?: string | redacted.Redacted<string>;
  QueryScopes?: SearchQueryScopeType[];
  OrganizationId?: string;
  AdditionalResponseFields?: AdditionalResponseFieldType[];
  Filters?: Filters;
  OrderBy?: SearchSortResult[];
  Limit?: number;
  Marker?: string;
}
export const SearchResourcesRequest = S.suspend(() =>
  S.Struct({
    AuthenticationToken: S.optional(SensitiveString).pipe(
      T.HttpHeader("Authentication"),
    ),
    QueryText: S.optional(SensitiveString),
    QueryScopes: S.optional(SearchQueryScopeTypeList),
    OrganizationId: S.optional(S.String),
    AdditionalResponseFields: S.optional(AdditionalResponseFieldsList),
    Filters: S.optional(Filters),
    OrderBy: S.optional(SearchResultSortList),
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/api/v1/search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchResourcesRequest",
}) as any as S.Schema<SearchResourcesRequest>;
export type ShareStatusType = "SUCCESS" | "FAILURE" | (string & {});
export const ShareStatusType = S.String;
export interface Participants {
  Users?: UserMetadata[];
  Groups?: GroupMetadata[];
}
export const Participants = S.suspend(() =>
  S.Struct({
    Users: S.optional(UserMetadataList),
    Groups: S.optional(GroupMetadataList),
  }),
).annotations({ identifier: "Participants" }) as any as S.Schema<Participants>;
export interface ResourceMetadata {
  Type?: ResourceType;
  Name?: string | redacted.Redacted<string>;
  OriginalName?: string | redacted.Redacted<string>;
  Id?: string;
  VersionId?: string;
  Owner?: UserMetadata;
  ParentId?: string;
}
export const ResourceMetadata = S.suspend(() =>
  S.Struct({
    Type: S.optional(ResourceType),
    Name: S.optional(SensitiveString),
    OriginalName: S.optional(SensitiveString),
    Id: S.optional(S.String),
    VersionId: S.optional(S.String),
    Owner: S.optional(UserMetadata),
    ParentId: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceMetadata",
}) as any as S.Schema<ResourceMetadata>;
export interface CommentMetadata {
  CommentId?: string;
  Contributor?: User;
  CreatedTimestamp?: Date;
  CommentStatus?: CommentStatusType;
  RecipientId?: string;
  ContributorId?: string;
}
export const CommentMetadata = S.suspend(() =>
  S.Struct({
    CommentId: S.optional(S.String),
    Contributor: S.optional(User),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CommentStatus: S.optional(CommentStatusType),
    RecipientId: S.optional(S.String),
    ContributorId: S.optional(S.String),
  }),
).annotations({
  identifier: "CommentMetadata",
}) as any as S.Schema<CommentMetadata>;
export interface PermissionInfo {
  Role?: RoleType;
  Type?: RolePermissionType;
}
export const PermissionInfo = S.suspend(() =>
  S.Struct({
    Role: S.optional(RoleType),
    Type: S.optional(RolePermissionType),
  }),
).annotations({
  identifier: "PermissionInfo",
}) as any as S.Schema<PermissionInfo>;
export type PermissionInfoList = PermissionInfo[];
export const PermissionInfoList = S.Array(PermissionInfo);
export type SignedHeaderMap = { [key: string]: string | undefined };
export const SignedHeaderMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface ShareResult {
  PrincipalId?: string;
  InviteePrincipalId?: string;
  Role?: RoleType;
  Status?: ShareStatusType;
  ShareId?: string;
  StatusMessage?: string | redacted.Redacted<string>;
}
export const ShareResult = S.suspend(() =>
  S.Struct({
    PrincipalId: S.optional(S.String),
    InviteePrincipalId: S.optional(S.String),
    Role: S.optional(RoleType),
    Status: S.optional(ShareStatusType),
    ShareId: S.optional(S.String),
    StatusMessage: S.optional(SensitiveString),
  }),
).annotations({ identifier: "ShareResult" }) as any as S.Schema<ShareResult>;
export type ShareResultsList = ShareResult[];
export const ShareResultsList = S.Array(ShareResult);
export interface Activity {
  Type?: ActivityType;
  TimeStamp?: Date;
  IsIndirectActivity?: boolean;
  OrganizationId?: string;
  Initiator?: UserMetadata;
  Participants?: Participants;
  ResourceMetadata?: ResourceMetadata;
  OriginalParent?: ResourceMetadata;
  CommentMetadata?: CommentMetadata;
}
export const Activity = S.suspend(() =>
  S.Struct({
    Type: S.optional(ActivityType),
    TimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IsIndirectActivity: S.optional(S.Boolean),
    OrganizationId: S.optional(S.String),
    Initiator: S.optional(UserMetadata),
    Participants: S.optional(Participants),
    ResourceMetadata: S.optional(ResourceMetadata),
    OriginalParent: S.optional(ResourceMetadata),
    CommentMetadata: S.optional(CommentMetadata),
  }),
).annotations({ identifier: "Activity" }) as any as S.Schema<Activity>;
export type UserActivities = Activity[];
export const UserActivities = S.Array(Activity);
export type DocumentVersionMetadataList = DocumentVersionMetadata[];
export const DocumentVersionMetadataList = S.Array(DocumentVersionMetadata);
export interface Principal {
  Id?: string;
  Type?: PrincipalType;
  Roles?: PermissionInfo[];
}
export const Principal = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.optional(PrincipalType),
    Roles: S.optional(PermissionInfoList),
  }),
).annotations({ identifier: "Principal" }) as any as S.Schema<Principal>;
export type PrincipalList = Principal[];
export const PrincipalList = S.Array(Principal);
export interface UploadMetadata {
  UploadUrl?: string | redacted.Redacted<string>;
  SignedHeaders?: { [key: string]: string | undefined };
}
export const UploadMetadata = S.suspend(() =>
  S.Struct({
    UploadUrl: S.optional(SensitiveString),
    SignedHeaders: S.optional(SignedHeaderMap),
  }),
).annotations({
  identifier: "UploadMetadata",
}) as any as S.Schema<UploadMetadata>;
export interface ActivateUserResponse {
  User?: User;
}
export const ActivateUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }).pipe(ns),
).annotations({
  identifier: "ActivateUserResponse",
}) as any as S.Schema<ActivateUserResponse>;
export interface AddResourcePermissionsResponse {
  ShareResults?: ShareResult[];
}
export const AddResourcePermissionsResponse = S.suspend(() =>
  S.Struct({ ShareResults: S.optional(ShareResultsList) }).pipe(ns),
).annotations({
  identifier: "AddResourcePermissionsResponse",
}) as any as S.Schema<AddResourcePermissionsResponse>;
export interface DescribeActivitiesResponse {
  UserActivities?: Activity[];
  Marker?: string;
}
export const DescribeActivitiesResponse = S.suspend(() =>
  S.Struct({
    UserActivities: S.optional(UserActivities),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeActivitiesResponse",
}) as any as S.Schema<DescribeActivitiesResponse>;
export interface DescribeDocumentVersionsResponse {
  DocumentVersions?: DocumentVersionMetadata[];
  Marker?: string;
}
export const DescribeDocumentVersionsResponse = S.suspend(() =>
  S.Struct({
    DocumentVersions: S.optional(DocumentVersionMetadataList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDocumentVersionsResponse",
}) as any as S.Schema<DescribeDocumentVersionsResponse>;
export interface DescribeResourcePermissionsResponse {
  Principals?: Principal[];
  Marker?: string;
}
export const DescribeResourcePermissionsResponse = S.suspend(() =>
  S.Struct({
    Principals: S.optional(PrincipalList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeResourcePermissionsResponse",
}) as any as S.Schema<DescribeResourcePermissionsResponse>;
export interface GetDocumentPathResponse {
  Path?: ResourcePath;
}
export const GetDocumentPathResponse = S.suspend(() =>
  S.Struct({ Path: S.optional(ResourcePath) }).pipe(ns),
).annotations({
  identifier: "GetDocumentPathResponse",
}) as any as S.Schema<GetDocumentPathResponse>;
export interface InitiateDocumentVersionUploadResponse {
  Metadata?: DocumentMetadata;
  UploadMetadata?: UploadMetadata;
}
export const InitiateDocumentVersionUploadResponse = S.suspend(() =>
  S.Struct({
    Metadata: S.optional(DocumentMetadata),
    UploadMetadata: S.optional(UploadMetadata),
  }).pipe(ns),
).annotations({
  identifier: "InitiateDocumentVersionUploadResponse",
}) as any as S.Schema<InitiateDocumentVersionUploadResponse>;
export type ResponseItemType =
  | "DOCUMENT"
  | "FOLDER"
  | "COMMENT"
  | "DOCUMENT_VERSION"
  | (string & {});
export const ResponseItemType = S.String;
export interface ResponseItem {
  ResourceType?: ResponseItemType;
  WebUrl?: string | redacted.Redacted<string>;
  DocumentMetadata?: DocumentMetadata;
  FolderMetadata?: FolderMetadata;
  CommentMetadata?: CommentMetadata;
  DocumentVersionMetadata?: DocumentVersionMetadata;
}
export const ResponseItem = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(ResponseItemType),
    WebUrl: S.optional(SensitiveString),
    DocumentMetadata: S.optional(DocumentMetadata),
    FolderMetadata: S.optional(FolderMetadata),
    CommentMetadata: S.optional(CommentMetadata),
    DocumentVersionMetadata: S.optional(DocumentVersionMetadata),
  }),
).annotations({ identifier: "ResponseItem" }) as any as S.Schema<ResponseItem>;
export type ResponseItemsList = ResponseItem[];
export const ResponseItemsList = S.Array(ResponseItem);
export interface SearchResourcesResponse {
  Items?: ResponseItem[];
  Marker?: string;
}
export const SearchResourcesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ResponseItemsList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "SearchResourcesResponse",
}) as any as S.Schema<SearchResourcesResponse>;

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class EntityNotExistsException extends S.TaggedError<EntityNotExistsException>()(
  "EntityNotExistsException",
  { Message: S.optional(S.String), EntityIds: S.optional(EntityIdList) },
).pipe(C.withBadRequestError) {}
export class DocumentLockedForCommentsException extends S.TaggedError<DocumentLockedForCommentsException>()(
  "DocumentLockedForCommentsException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ConflictingOperationException extends S.TaggedError<ConflictingOperationException>()(
  "ConflictingOperationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class FailedDependencyException extends S.TaggedError<FailedDependencyException>()(
  "FailedDependencyException",
  { Message: S.optional(S.String) },
) {}
export class CustomMetadataLimitExceededException extends S.TaggedError<CustomMetadataLimitExceededException>()(
  "CustomMetadataLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DeactivatingLastSystemUserException extends S.TaggedError<DeactivatingLastSystemUserException>()(
  "DeactivatingLastSystemUserException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EntityAlreadyExistsException extends S.TaggedError<EntityAlreadyExistsException>()(
  "EntityAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class ProhibitedStateException extends S.TaggedError<ProhibitedStateException>()(
  "ProhibitedStateException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidPasswordException extends S.TaggedError<InvalidPasswordException>()(
  "InvalidPasswordException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InvalidCommentOperationException extends S.TaggedError<InvalidCommentOperationException>()(
  "InvalidCommentOperationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class UnauthorizedResourceAccessException extends S.TaggedError<UnauthorizedResourceAccessException>()(
  "UnauthorizedResourceAccessException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError, C.withAuthError) {}
export class IllegalUserStateException extends S.TaggedError<IllegalUserStateException>()(
  "IllegalUserStateException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class UnauthorizedOperationException extends S.TaggedError<UnauthorizedOperationException>()(
  "UnauthorizedOperationException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class TooManyLabelsException extends S.TaggedError<TooManyLabelsException>()(
  "TooManyLabelsException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class RequestedEntityTooLargeException extends S.TaggedError<RequestedEntityTooLargeException>()(
  "RequestedEntityTooLargeException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManySubscriptionsException extends S.TaggedError<TooManySubscriptionsException>()(
  "TooManySubscriptionsException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class DraftUploadOutOfSyncException extends S.TaggedError<DraftUploadOutOfSyncException>()(
  "DraftUploadOutOfSyncException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceAlreadyCheckedOutException extends S.TaggedError<ResourceAlreadyCheckedOutException>()(
  "ResourceAlreadyCheckedOutException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class StorageLimitExceededException extends S.TaggedError<StorageLimitExceededException>()(
  "StorageLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class StorageLimitWillExceedException extends S.TaggedError<StorageLimitWillExceedException>()(
  "StorageLimitWillExceedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the specified notification subscriptions.
 */
export const describeNotificationSubscriptions: {
  (
    input: DescribeNotificationSubscriptionsRequest,
  ): effect.Effect<
    DescribeNotificationSubscriptionsResponse,
    | EntityNotExistsException
    | ServiceUnavailableException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeNotificationSubscriptionsRequest,
  ) => stream.Stream<
    DescribeNotificationSubscriptionsResponse,
    | EntityNotExistsException
    | ServiceUnavailableException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeNotificationSubscriptionsRequest,
  ) => stream.Stream<
    Subscription,
    | EntityNotExistsException
    | ServiceUnavailableException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeNotificationSubscriptionsRequest,
  output: DescribeNotificationSubscriptionsResponse,
  errors: [
    EntityNotExistsException,
    ServiceUnavailableException,
    UnauthorizedResourceAccessException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Subscriptions",
    pageSize: "Limit",
  } as const,
}));
/**
 * Deletes custom metadata from the specified resource.
 */
export const deleteCustomMetadata: (
  input: DeleteCustomMetadataRequest,
) => effect.Effect<
  DeleteCustomMetadataResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Adds the specified list of labels to the given resource (a document or
 * folder)
 */
export const createLabels: (
  input: CreateLabelsRequest,
) => effect.Effect<
  CreateLabelsResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | ServiceUnavailableException
  | TooManyLabelsException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteNotificationSubscription: (
  input: DeleteNotificationSubscriptionRequest,
) => effect.Effect<
  DeleteNotificationSubscriptionResponse,
  | EntityNotExistsException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFolderContents: {
  (
    input: DescribeFolderContentsRequest,
  ): effect.Effect<
    DescribeFolderContentsResponse,
    | EntityNotExistsException
    | FailedDependencyException
    | InvalidArgumentException
    | ProhibitedStateException
    | ServiceUnavailableException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeFolderContentsRequest,
  ) => stream.Stream<
    DescribeFolderContentsResponse,
    | EntityNotExistsException
    | FailedDependencyException
    | InvalidArgumentException
    | ProhibitedStateException
    | ServiceUnavailableException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeFolderContentsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotExistsException
    | FailedDependencyException
    | InvalidArgumentException
    | ProhibitedStateException
    | ServiceUnavailableException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    pageSize: "Limit",
  } as const,
}));
/**
 * Removes all the permissions from the specified resource.
 */
export const removeAllResourcePermissions: (
  input: RemoveAllResourcePermissionsRequest,
) => effect.Effect<
  RemoveAllResourcePermissionsResponse,
  | FailedDependencyException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deactivateUser: (
  input: DeactivateUserRequest,
) => effect.Effect<
  DeactivateUserResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteUser: (
  input: DeleteUserRequest,
) => effect.Effect<
  DeleteUserResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeResourcePermission: (
  input: RemoveResourcePermissionRequest,
) => effect.Effect<
  RemoveResourcePermissionResponse,
  | FailedDependencyException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveResourcePermissionRequest,
  output: RemoveResourcePermissionResponse,
  errors: [
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
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
export const getCurrentUser: (
  input: GetCurrentUserRequest,
) => effect.Effect<
  GetCurrentUserResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFolderPath: (
  input: GetFolderPathRequest,
) => effect.Effect<
  GetFolderPathResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeGroups: {
  (
    input: DescribeGroupsRequest,
  ): effect.Effect<
    DescribeGroupsResponse,
    | FailedDependencyException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeGroupsRequest,
  ) => stream.Stream<
    DescribeGroupsResponse,
    | FailedDependencyException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeGroupsRequest,
  ) => stream.Stream<
    GroupMetadata,
    | FailedDependencyException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeGroupsRequest,
  output: DescribeGroupsResponse,
  errors: [
    FailedDependencyException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Groups",
    pageSize: "Limit",
  } as const,
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
export const describeRootFolders: {
  (
    input: DescribeRootFoldersRequest,
  ): effect.Effect<
    DescribeRootFoldersResponse,
    | FailedDependencyException
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRootFoldersRequest,
  ) => stream.Stream<
    DescribeRootFoldersResponse,
    | FailedDependencyException
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRootFoldersRequest,
  ) => stream.Stream<
    FolderMetadata,
    | FailedDependencyException
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRootFoldersRequest,
  output: DescribeRootFoldersResponse,
  errors: [
    FailedDependencyException,
    InvalidArgumentException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Folders",
    pageSize: "Limit",
  } as const,
}));
/**
 * Retrieves version metadata for the specified document.
 */
export const getDocumentVersion: (
  input: GetDocumentVersionRequest,
) => effect.Effect<
  GetDocumentVersionResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | InvalidPasswordException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFolder: (
  input: DeleteFolderRequest,
) => effect.Effect<
  DeleteFolderResponse,
  | ConcurrentModificationException
  | ConflictingOperationException
  | EntityNotExistsException
  | FailedDependencyException
  | LimitExceededException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restoreDocumentVersions: (
  input: RestoreDocumentVersionsRequest,
) => effect.Effect<
  RestoreDocumentVersionsResponse,
  | ConcurrentModificationException
  | ConflictingOperationException
  | EntityNotExistsException
  | FailedDependencyException
  | InvalidOperationException
  | ProhibitedStateException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Changes the status of the document version to ACTIVE.
 *
 * Amazon WorkDocs also sets its document container to ACTIVE. This is the last step
 * in a document upload, after the client uploads the document to an S3-presigned URL
 * returned by InitiateDocumentVersionUpload.
 */
export const updateDocumentVersion: (
  input: UpdateDocumentVersionRequest,
) => effect.Effect<
  UpdateDocumentVersionResponse,
  | ConcurrentModificationException
  | EntityNotExistsException
  | FailedDependencyException
  | InvalidOperationException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the specified attributes of the specified folder. The user must have access
 * to both the folder and its parent folder, if applicable.
 */
export const updateFolder: (
  input: UpdateFolderRequest,
) => effect.Effect<
  UpdateFolderResponse,
  | ConcurrentModificationException
  | ConflictingOperationException
  | EntityAlreadyExistsException
  | EntityNotExistsException
  | FailedDependencyException
  | LimitExceededException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFolder: (
  input: CreateFolderRequest,
) => effect.Effect<
  CreateFolderResponse,
  | ConcurrentModificationException
  | ConflictingOperationException
  | EntityAlreadyExistsException
  | EntityNotExistsException
  | FailedDependencyException
  | LimitExceededException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createUser: (
  input: CreateUserRequest,
) => effect.Effect<
  CreateUserResponse,
  | EntityAlreadyExistsException
  | FailedDependencyException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteLabels: (
  input: DeleteLabelsRequest,
) => effect.Effect<
  DeleteLabelsResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const abortDocumentVersionUpload: (
  input: AbortDocumentVersionUploadRequest,
) => effect.Effect<
  AbortDocumentVersionUploadResponse,
  | ConcurrentModificationException
  | EntityNotExistsException
  | FailedDependencyException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes the specified comment from the document version.
 */
export const deleteComment: (
  input: DeleteCommentRequest,
) => effect.Effect<
  DeleteCommentResponse,
  | DocumentLockedForCommentsException
  | EntityNotExistsException
  | FailedDependencyException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFolderContents: (
  input: DeleteFolderContentsRequest,
) => effect.Effect<
  DeleteFolderContentsResponse,
  | ConflictingOperationException
  | EntityNotExistsException
  | FailedDependencyException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * List all the comments for the specified document version.
 */
export const describeComments: {
  (
    input: DescribeCommentsRequest,
  ): effect.Effect<
    DescribeCommentsResponse,
    | EntityNotExistsException
    | FailedDependencyException
    | ProhibitedStateException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCommentsRequest,
  ) => stream.Stream<
    DescribeCommentsResponse,
    | EntityNotExistsException
    | FailedDependencyException
    | ProhibitedStateException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCommentsRequest,
  ) => stream.Stream<
    Comment,
    | EntityNotExistsException
    | FailedDependencyException
    | ProhibitedStateException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Comments",
    pageSize: "Limit",
  } as const,
}));
/**
 * Adds one or more custom properties to the specified resource (a folder, document,
 * or version).
 */
export const createCustomMetadata: (
  input: CreateCustomMetadataRequest,
) => effect.Effect<
  CreateCustomMetadataResponse,
  | CustomMetadataLimitExceededException
  | EntityNotExistsException
  | FailedDependencyException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Permanently deletes the specified document and its associated metadata.
 */
export const deleteDocument: (
  input: DeleteDocumentRequest,
) => effect.Effect<
  DeleteDocumentResponse,
  | ConcurrentModificationException
  | ConflictingOperationException
  | EntityNotExistsException
  | FailedDependencyException
  | LimitExceededException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDocumentVersion: (
  input: DeleteDocumentVersionRequest,
) => effect.Effect<
  DeleteDocumentVersionResponse,
  | ConcurrentModificationException
  | ConflictingOperationException
  | EntityNotExistsException
  | FailedDependencyException
  | InvalidOperationException
  | ProhibitedStateException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the specified attributes of a document. The user must have access to both
 * the document and its parent folder, if applicable.
 */
export const updateDocument: (
  input: UpdateDocumentRequest,
) => effect.Effect<
  UpdateDocumentResponse,
  | ConcurrentModificationException
  | ConflictingOperationException
  | EntityAlreadyExistsException
  | EntityNotExistsException
  | FailedDependencyException
  | LimitExceededException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDocument: (
  input: GetDocumentRequest,
) => effect.Effect<
  GetDocumentResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | InvalidArgumentException
  | InvalidPasswordException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFolder: (
  input: GetFolderRequest,
) => effect.Effect<
  GetFolderResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | InvalidArgumentException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResources: (
  input: GetResourcesRequest,
) => effect.Effect<
  GetResourcesResponse,
  | FailedDependencyException
  | InvalidArgumentException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const activateUser: (
  input: ActivateUserRequest,
) => effect.Effect<
  ActivateUserResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addResourcePermissions: (
  input: AddResourcePermissionsRequest,
) => effect.Effect<
  AddResourcePermissionsResponse,
  | FailedDependencyException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddResourcePermissionsRequest,
  output: AddResourcePermissionsResponse,
  errors: [
    FailedDependencyException,
    ProhibitedStateException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
}));
/**
 * Adds a new comment to the specified document version.
 */
export const createComment: (
  input: CreateCommentRequest,
) => effect.Effect<
  CreateCommentResponse,
  | DocumentLockedForCommentsException
  | EntityNotExistsException
  | FailedDependencyException
  | InvalidCommentOperationException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeActivities: {
  (
    input: DescribeActivitiesRequest,
  ): effect.Effect<
    DescribeActivitiesResponse,
    | FailedDependencyException
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeActivitiesRequest,
  ) => stream.Stream<
    DescribeActivitiesResponse,
    | FailedDependencyException
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeActivitiesRequest,
  ) => stream.Stream<
    Activity,
    | FailedDependencyException
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeActivitiesRequest,
  output: DescribeActivitiesResponse,
  errors: [
    FailedDependencyException,
    InvalidArgumentException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "UserActivities",
    pageSize: "Limit",
  } as const,
}));
/**
 * Retrieves the document versions for the specified document.
 *
 * By default, only active versions are returned.
 */
export const describeDocumentVersions: {
  (
    input: DescribeDocumentVersionsRequest,
  ): effect.Effect<
    DescribeDocumentVersionsResponse,
    | EntityNotExistsException
    | FailedDependencyException
    | InvalidArgumentException
    | InvalidPasswordException
    | ProhibitedStateException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDocumentVersionsRequest,
  ) => stream.Stream<
    DescribeDocumentVersionsResponse,
    | EntityNotExistsException
    | FailedDependencyException
    | InvalidArgumentException
    | InvalidPasswordException
    | ProhibitedStateException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDocumentVersionsRequest,
  ) => stream.Stream<
    DocumentVersionMetadata,
    | EntityNotExistsException
    | FailedDependencyException
    | InvalidArgumentException
    | InvalidPasswordException
    | ProhibitedStateException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "DocumentVersions",
    pageSize: "Limit",
  } as const,
}));
/**
 * Describes the permissions of a specified resource.
 */
export const describeResourcePermissions: {
  (
    input: DescribeResourcePermissionsRequest,
  ): effect.Effect<
    DescribeResourcePermissionsResponse,
    | FailedDependencyException
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeResourcePermissionsRequest,
  ) => stream.Stream<
    DescribeResourcePermissionsResponse,
    | FailedDependencyException
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeResourcePermissionsRequest,
  ) => stream.Stream<
    Principal,
    | FailedDependencyException
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeResourcePermissionsRequest,
  output: DescribeResourcePermissionsResponse,
  errors: [
    FailedDependencyException,
    InvalidArgumentException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Principals",
    pageSize: "Limit",
  } as const,
}));
/**
 * Retrieves the path information (the hierarchy from the root folder) for the
 * requested document.
 *
 * By default, Amazon WorkDocs returns a maximum of 100 levels upwards from the
 * requested document and only includes the IDs of the parent folders in the path. You can
 * limit the maximum number of levels. You can also request the names of the parent
 * folders.
 */
export const getDocumentPath: (
  input: GetDocumentPathRequest,
) => effect.Effect<
  GetDocumentPathResponse,
  | EntityNotExistsException
  | FailedDependencyException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateUser: (
  input: UpdateUserRequest,
) => effect.Effect<
  UpdateUserResponse,
  | DeactivatingLastSystemUserException
  | EntityNotExistsException
  | FailedDependencyException
  | IllegalUserStateException
  | InvalidArgumentException
  | ProhibitedStateException
  | ServiceUnavailableException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeUsers: {
  (
    input: DescribeUsersRequest,
  ): effect.Effect<
    DescribeUsersResponse,
    | EntityNotExistsException
    | FailedDependencyException
    | InvalidArgumentException
    | RequestedEntityTooLargeException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeUsersRequest,
  ) => stream.Stream<
    DescribeUsersResponse,
    | EntityNotExistsException
    | FailedDependencyException
    | InvalidArgumentException
    | RequestedEntityTooLargeException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeUsersRequest,
  ) => stream.Stream<
    User,
    | EntityNotExistsException
    | FailedDependencyException
    | InvalidArgumentException
    | RequestedEntityTooLargeException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Users",
    pageSize: "Limit",
  } as const,
}));
/**
 * Configure Amazon WorkDocs to use Amazon SNS notifications. The endpoint receives a
 * confirmation message, and must confirm the subscription.
 *
 * For more information, see Setting up notifications for an IAM user or role in the Amazon WorkDocs Developer
 * Guide.
 */
export const createNotificationSubscription: (
  input: CreateNotificationSubscriptionRequest,
) => effect.Effect<
  CreateNotificationSubscriptionResponse,
  | InvalidArgumentException
  | ServiceUnavailableException
  | TooManySubscriptionsException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchResources: {
  (
    input: SearchResourcesRequest,
  ): effect.Effect<
    SearchResourcesResponse,
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchResourcesRequest,
  ) => stream.Stream<
    SearchResourcesResponse,
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchResourcesRequest,
  ) => stream.Stream<
    ResponseItem,
    | InvalidArgumentException
    | ServiceUnavailableException
    | UnauthorizedOperationException
    | UnauthorizedResourceAccessException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchResourcesRequest,
  output: SearchResourcesResponse,
  errors: [
    InvalidArgumentException,
    ServiceUnavailableException,
    UnauthorizedOperationException,
    UnauthorizedResourceAccessException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Items",
    pageSize: "Limit",
  } as const,
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
export const initiateDocumentVersionUpload: (
  input: InitiateDocumentVersionUploadRequest,
) => effect.Effect<
  InitiateDocumentVersionUploadResponse,
  | DraftUploadOutOfSyncException
  | EntityAlreadyExistsException
  | EntityNotExistsException
  | FailedDependencyException
  | InvalidArgumentException
  | InvalidPasswordException
  | LimitExceededException
  | ProhibitedStateException
  | ResourceAlreadyCheckedOutException
  | ServiceUnavailableException
  | StorageLimitExceededException
  | StorageLimitWillExceedException
  | UnauthorizedOperationException
  | UnauthorizedResourceAccessException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
