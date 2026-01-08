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
const svc = T.AwsApiService({
  sdkId: "QBusiness",
  serviceShapeName: "ExpertQ",
});
const auth = T.AwsAuthSigv4({ name: "qbusiness" });
const ver = T.ServiceVersion("2023-11-27");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseFIPS = false, Endpoint } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
          if (UseFIPS === true) {
            if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
              return e(
                `https://qbusiness-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              );
            }
            return err(
              "FIPS is enabled but this partition does not support FIPS",
            );
          }
          return e(
            `https://qbusiness.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://qbusiness-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        return e(
          `https://qbusiness.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ApplicationId = string;
export type StatementId = string;
export type QIamAction = string;
export type PrincipalRoleArn = string;
export type IndexId = string;
export type ExecutionId = string;
export type RoleArn = string;
export type SubscriptionId = string;
export type UserId = string;
export type ConversationId = string;
export type MessageId = string;
export type ClientToken = string;
export type UserMessage = string;
export type DocumentId = string;
export type DataSourceId = string;
export type WebExperienceId = string;
export type SessionDurationInMinutes = number;
export type DisplayName = string;
export type AttachmentId = string;
export type ChatResponseConfigurationId = string;
export type GroupName = string;
export type MaxResultsIntegerForGetTopicConfigurations = number;
export type NextToken = string;
export type MediaId = string;
export type MaxResultsIntegerForListAttachments = number;
export type Integer = number;
export type MaxResultsIntegerForListConversations = number;
export type MaxResultsIntegerForListDataSourcesSyncJobs = number;
export type MaxResultsIntegerForListDocuments = number;
export type MaxResultsIntegerForListGroupsRequest = number;
export type MaxResultsIntegerForListMessages = number;
export type PluginId = string;
export type MaxResultsIntegerForListPluginActions = number;
export type MaxResultsIntegerForListPluginTypeActions = number;
export type MaxResultsIntegerForListPluginTypeMetadata = number;
export type MaxResultsIntegerForListSubscriptions = number;
export type AmazonResourceName = string;
export type SystemMessageId = string;
export type QueryText = string;
export type MaxResults = number;
export type TagKey = string;
export type ApplicationName = string;
export type IAMIdentityProviderArn = string;
export type InstanceArn = string;
export type ClientIdForOIDC = string;
export type Description = string;
export type MaxResultsIntegerForListApplications = number;
export type DataAccessorName = string | Redacted.Redacted<string>;
export type DataAccessorId = string;
export type NextToken1500 = string;
export type MaxResultsIntegerForListDataAccessors = number;
export type IndexName = string;
export type MaxResultsIntegerForListIndices = number;
export type DataSourceName = string;
export type SyncSchedule = string;
export type MaxResultsIntegerForListDataSources = number;
export type PluginName = string;
export type Url = string;
export type MaxResultsIntegerForListPlugins = number;
export type RetrieverName = string;
export type RetrieverId = string;
export type MaxResultsIntegerForListRetrieversRequest = number;
export type WebExperienceTitle = string;
export type WebExperienceSubtitle = string;
export type WebExperienceWelcomeMessage = string;
export type Origin = string;
export type MaxResultsIntegerForListWebExperiencesRequest = number;
export type PermissionConditionKey = string;
export type PermissionConditionValue = string;
export type Title = string;
export type AttachmentName = string;
export type ActionPayloadFieldNameSeparator = string;
export type TagValue = string;
export type UserIdentifier = string;
export type GroupIdentifier = string;
export type MessageUsefulnessComment = string;
export type BlockedPhrase = string;
export type SystemMessageOverride = string;
export type TopicConfigurationName = string;
export type TopicDescription = string;
export type ExampleChatMessage = string;
export type KmsKeyId = string | Redacted.Redacted<string>;
export type ClientNamespace = string;
export type DataAccessorExternalId = string;
export type IndexCapacityInteger = number;
export type DocumentMetadataConfigurationName = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type PluginDescription = string;
export type BrowserExtension = string;
export type CustomCSSUrl = string;
export type LogoUrl = string;
export type FontUrl = string;
export type FaviconUrl = string;
export type SubscriptionArn = string;
export type ErrorMessage = string;
export type ChatResponseConfigurationArn = string;
export type ApplicationArn = string;
export type IdcApplicationArn = string;
export type DataAccessorArn = string;
export type IndexArn = string;
export type DataSourceArn = string;
export type PluginArn = string;
export type RetrieverArn = string;
export type WebExperienceArn = string;
export type DocumentAttributeKey = string;
export type ActionPayloadFieldKey = string;
export type AuthResponseKey = string;
export type AuthResponseValue = string;
export type DataSourceUserId = string;
export type S3BucketName = string;
export type S3ObjectKey = string;
export type LambdaArn = string;
export type SecretArn = string;
export type Payload = string | Redacted.Redacted<string>;
export type Long = number;
export type KendraIndexId = string;
export type SamlAuthenticationUrl = string;
export type SamlMetadataXML = string;
export type SamlAttribute = string;
export type ResponseConfigurationSummary = string;
export type ConversationTitle = string;
export type MessageBody = string;
export type DocumentAttributeStringValue = string;
export type Instruction = string;
export type IdcTrustedTokenIssuerArn = string;
export type MetricValue = string;
export type IndexedTextBytes = number;
export type IndexedTextDocument = number;
export type SourceAttributionMediaId = string;
export type BoostingDurationInSeconds = number;
export type SnippetExcerptText = string;

//# Schemas
export type QIamActions = string[];
export const QIamActions = S.Array(S.String);
export type UserGroups = string[];
export const UserGroups = S.Array(S.String);
export type DataSourceIds = string[];
export const DataSourceIds = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type ClientIdsForOIDC = string[];
export const ClientIdsForOIDC = S.Array(S.String);
export type WebExperienceOrigins = string[];
export const WebExperienceOrigins = S.Array(S.String);
export interface CancelSubscriptionRequest {
  applicationId: string;
  subscriptionId: string;
}
export const CancelSubscriptionRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    subscriptionId: S.String.pipe(T.HttpLabel("subscriptionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/subscriptions/{subscriptionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelSubscriptionRequest",
}) as any as S.Schema<CancelSubscriptionRequest>;
export interface CheckDocumentAccessRequest {
  applicationId: string;
  indexId: string;
  userId: string;
  documentId: string;
  dataSourceId?: string;
}
export const CheckDocumentAccessRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    documentId: S.String.pipe(T.HttpLabel("documentId")),
    dataSourceId: S.optional(S.String).pipe(T.HttpQuery("dataSourceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/index/{indexId}/users/{userId}/documents/{documentId}/check-document-access",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CheckDocumentAccessRequest",
}) as any as S.Schema<CheckDocumentAccessRequest>;
export interface CreateAnonymousWebExperienceUrlRequest {
  applicationId: string;
  webExperienceId: string;
  sessionDurationInMinutes?: number;
}
export const CreateAnonymousWebExperienceUrlRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    webExperienceId: S.String.pipe(T.HttpLabel("webExperienceId")),
    sessionDurationInMinutes: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/experiences/{webExperienceId}/anonymous-url",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAnonymousWebExperienceUrlRequest",
}) as any as S.Schema<CreateAnonymousWebExperienceUrlRequest>;
export interface DeleteAttachmentRequest {
  applicationId: string;
  conversationId: string;
  attachmentId: string;
  userId?: string;
}
export const DeleteAttachmentRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    conversationId: S.String.pipe(T.HttpLabel("conversationId")),
    attachmentId: S.String.pipe(T.HttpLabel("attachmentId")),
    userId: S.optional(S.String).pipe(T.HttpQuery("userId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/conversations/{conversationId}/attachments/{attachmentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAttachmentRequest",
}) as any as S.Schema<DeleteAttachmentRequest>;
export interface DeleteAttachmentResponse {}
export const DeleteAttachmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAttachmentResponse",
}) as any as S.Schema<DeleteAttachmentResponse>;
export interface DeleteChatControlsConfigurationRequest {
  applicationId: string;
}
export const DeleteChatControlsConfigurationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/chatcontrols",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChatControlsConfigurationRequest",
}) as any as S.Schema<DeleteChatControlsConfigurationRequest>;
export interface DeleteChatControlsConfigurationResponse {}
export const DeleteChatControlsConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChatControlsConfigurationResponse",
}) as any as S.Schema<DeleteChatControlsConfigurationResponse>;
export interface DeleteChatResponseConfigurationRequest {
  applicationId: string;
  chatResponseConfigurationId: string;
}
export const DeleteChatResponseConfigurationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    chatResponseConfigurationId: S.String.pipe(
      T.HttpLabel("chatResponseConfigurationId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/chatresponseconfigurations/{chatResponseConfigurationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChatResponseConfigurationRequest",
}) as any as S.Schema<DeleteChatResponseConfigurationRequest>;
export interface DeleteChatResponseConfigurationResponse {}
export const DeleteChatResponseConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChatResponseConfigurationResponse",
}) as any as S.Schema<DeleteChatResponseConfigurationResponse>;
export interface DeleteConversationRequest {
  conversationId: string;
  applicationId: string;
  userId?: string;
}
export const DeleteConversationRequest = S.suspend(() =>
  S.Struct({
    conversationId: S.String.pipe(T.HttpLabel("conversationId")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.optional(S.String).pipe(T.HttpQuery("userId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/conversations/{conversationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConversationRequest",
}) as any as S.Schema<DeleteConversationRequest>;
export interface DeleteConversationResponse {}
export const DeleteConversationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConversationResponse",
}) as any as S.Schema<DeleteConversationResponse>;
export interface DeleteGroupRequest {
  applicationId: string;
  indexId: string;
  groupName: string;
  dataSourceId?: string;
}
export const DeleteGroupRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    groupName: S.String.pipe(T.HttpLabel("groupName")),
    dataSourceId: S.optional(S.String).pipe(T.HttpQuery("dataSourceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/indices/{indexId}/groups/{groupName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGroupRequest",
}) as any as S.Schema<DeleteGroupRequest>;
export interface DeleteGroupResponse {}
export const DeleteGroupResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteGroupResponse",
}) as any as S.Schema<DeleteGroupResponse>;
export interface DeleteUserRequest {
  applicationId: string;
  userId: string;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.String.pipe(T.HttpLabel("userId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/users/{userId}",
      }),
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
export const DeleteUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteUserResponse",
}) as any as S.Schema<DeleteUserResponse>;
export interface DisassociatePermissionRequest {
  applicationId: string;
  statementId: string;
}
export const DisassociatePermissionRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    statementId: S.String.pipe(T.HttpLabel("statementId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/policy/{statementId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociatePermissionRequest",
}) as any as S.Schema<DisassociatePermissionRequest>;
export interface DisassociatePermissionResponse {}
export const DisassociatePermissionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociatePermissionResponse",
}) as any as S.Schema<DisassociatePermissionResponse>;
export interface GetChatControlsConfigurationRequest {
  applicationId: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetChatControlsConfigurationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/chatcontrols",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChatControlsConfigurationRequest",
}) as any as S.Schema<GetChatControlsConfigurationRequest>;
export interface GetChatResponseConfigurationRequest {
  applicationId: string;
  chatResponseConfigurationId: string;
}
export const GetChatResponseConfigurationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    chatResponseConfigurationId: S.String.pipe(
      T.HttpLabel("chatResponseConfigurationId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/chatresponseconfigurations/{chatResponseConfigurationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChatResponseConfigurationRequest",
}) as any as S.Schema<GetChatResponseConfigurationRequest>;
export interface GetDocumentContentRequest {
  applicationId: string;
  indexId: string;
  dataSourceId?: string;
  documentId: string;
  outputFormat?: string;
}
export const GetDocumentContentRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    dataSourceId: S.optional(S.String).pipe(T.HttpQuery("dataSourceId")),
    documentId: S.String.pipe(T.HttpLabel("documentId")),
    outputFormat: S.optional(S.String).pipe(T.HttpQuery("outputFormat")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/index/{indexId}/documents/{documentId}/content",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDocumentContentRequest",
}) as any as S.Schema<GetDocumentContentRequest>;
export interface GetGroupRequest {
  applicationId: string;
  indexId: string;
  groupName: string;
  dataSourceId?: string;
}
export const GetGroupRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    groupName: S.String.pipe(T.HttpLabel("groupName")),
    dataSourceId: S.optional(S.String).pipe(T.HttpQuery("dataSourceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/indices/{indexId}/groups/{groupName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGroupRequest",
}) as any as S.Schema<GetGroupRequest>;
export interface GetMediaRequest {
  applicationId: string;
  conversationId: string;
  messageId: string;
  mediaId: string;
}
export const GetMediaRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    conversationId: S.String.pipe(T.HttpLabel("conversationId")),
    messageId: S.String.pipe(T.HttpLabel("messageId")),
    mediaId: S.String.pipe(T.HttpLabel("mediaId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/conversations/{conversationId}/messages/{messageId}/media/{mediaId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMediaRequest",
}) as any as S.Schema<GetMediaRequest>;
export interface GetPolicyRequest {
  applicationId: string;
}
export const GetPolicyRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{applicationId}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPolicyRequest",
}) as any as S.Schema<GetPolicyRequest>;
export interface GetUserRequest {
  applicationId: string;
  userId: string;
}
export const GetUserRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.String.pipe(T.HttpLabel("userId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/users/{userId}",
      }),
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
export interface ListAttachmentsRequest {
  applicationId: string;
  conversationId?: string;
  userId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAttachmentsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    conversationId: S.optional(S.String).pipe(T.HttpQuery("conversationId")),
    userId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/attachments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAttachmentsRequest",
}) as any as S.Schema<ListAttachmentsRequest>;
export interface ListChatResponseConfigurationsRequest {
  applicationId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListChatResponseConfigurationsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/chatresponseconfigurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChatResponseConfigurationsRequest",
}) as any as S.Schema<ListChatResponseConfigurationsRequest>;
export interface ListConversationsRequest {
  applicationId: string;
  userId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListConversationsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/conversations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConversationsRequest",
}) as any as S.Schema<ListConversationsRequest>;
export interface ListDataSourceSyncJobsRequest {
  dataSourceId: string;
  applicationId: string;
  indexId: string;
  nextToken?: string;
  maxResults?: number;
  startTime?: Date;
  endTime?: Date;
  statusFilter?: string;
}
export const ListDataSourceSyncJobsRequest = S.suspend(() =>
  S.Struct({
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endTime"),
    ),
    statusFilter: S.optional(S.String).pipe(T.HttpQuery("syncStatus")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/indices/{indexId}/datasources/{dataSourceId}/syncjobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSourceSyncJobsRequest",
}) as any as S.Schema<ListDataSourceSyncJobsRequest>;
export interface ListDocumentsRequest {
  applicationId: string;
  indexId: string;
  dataSourceIds?: DataSourceIds;
  nextToken?: string;
  maxResults?: number;
}
export const ListDocumentsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    dataSourceIds: S.optional(DataSourceIds).pipe(T.HttpQuery("dataSourceIds")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/index/{indexId}/documents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDocumentsRequest",
}) as any as S.Schema<ListDocumentsRequest>;
export interface ListGroupsRequest {
  applicationId: string;
  indexId: string;
  updatedEarlierThan: Date;
  dataSourceId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListGroupsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    updatedEarlierThan: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("updatedEarlierThan"),
    ),
    dataSourceId: S.optional(S.String).pipe(T.HttpQuery("dataSourceId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/indices/{indexId}/groups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGroupsRequest",
}) as any as S.Schema<ListGroupsRequest>;
export interface ListMessagesRequest {
  conversationId: string;
  applicationId: string;
  userId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListMessagesRequest = S.suspend(() =>
  S.Struct({
    conversationId: S.String.pipe(T.HttpLabel("conversationId")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/conversations/{conversationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMessagesRequest",
}) as any as S.Schema<ListMessagesRequest>;
export interface ListPluginActionsRequest {
  applicationId: string;
  pluginId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPluginActionsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    pluginId: S.String.pipe(T.HttpLabel("pluginId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/plugins/{pluginId}/actions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPluginActionsRequest",
}) as any as S.Schema<ListPluginActionsRequest>;
export interface ListPluginTypeActionsRequest {
  pluginType: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPluginTypeActionsRequest = S.suspend(() =>
  S.Struct({
    pluginType: S.String.pipe(T.HttpLabel("pluginType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/pluginTypes/{pluginType}/actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPluginTypeActionsRequest",
}) as any as S.Schema<ListPluginTypeActionsRequest>;
export interface ListPluginTypeMetadataRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListPluginTypeMetadataRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/pluginTypeMetadata" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPluginTypeMetadataRequest",
}) as any as S.Schema<ListPluginTypeMetadataRequest>;
export interface ListSubscriptionsRequest {
  applicationId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSubscriptionsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/subscriptions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubscriptionsRequest",
}) as any as S.Schema<ListSubscriptionsRequest>;
export interface ListTagsForResourceRequest {
  resourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String.pipe(T.HttpLabel("resourceARN")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/tags/{resourceARN}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface StartDataSourceSyncJobRequest {
  dataSourceId: string;
  applicationId: string;
  indexId: string;
}
export const StartDataSourceSyncJobRequest = S.suspend(() =>
  S.Struct({
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/indices/{indexId}/datasources/{dataSourceId}/startsync",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDataSourceSyncJobRequest",
}) as any as S.Schema<StartDataSourceSyncJobRequest>;
export interface StopDataSourceSyncJobRequest {
  dataSourceId: string;
  applicationId: string;
  indexId: string;
}
export const StopDataSourceSyncJobRequest = S.suspend(() =>
  S.Struct({
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/indices/{indexId}/datasources/{dataSourceId}/stopsync",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopDataSourceSyncJobRequest",
}) as any as S.Schema<StopDataSourceSyncJobRequest>;
export interface StopDataSourceSyncJobResponse {}
export const StopDataSourceSyncJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopDataSourceSyncJobResponse",
}) as any as S.Schema<StopDataSourceSyncJobResponse>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface TagResourceRequest {
  resourceARN: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceARN: S.String.pipe(T.HttpLabel("resourceARN")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags/{resourceARN}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceARN: string;
  tagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceARN: S.String.pipe(T.HttpLabel("resourceARN")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/tags/{resourceARN}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface InstructionCollection {
  responseLength?: string;
  targetAudience?: string;
  perspective?: string;
  outputStyle?: string;
  identity?: string;
  tone?: string;
  customInstructions?: string;
  examples?: string;
}
export const InstructionCollection = S.suspend(() =>
  S.Struct({
    responseLength: S.optional(S.String),
    targetAudience: S.optional(S.String),
    perspective: S.optional(S.String),
    outputStyle: S.optional(S.String),
    identity: S.optional(S.String),
    tone: S.optional(S.String),
    customInstructions: S.optional(S.String),
    examples: S.optional(S.String),
  }),
).annotations({
  identifier: "InstructionCollection",
}) as any as S.Schema<InstructionCollection>;
export interface ResponseConfiguration {
  instructionCollection?: InstructionCollection;
}
export const ResponseConfiguration = S.suspend(() =>
  S.Struct({ instructionCollection: S.optional(InstructionCollection) }),
).annotations({
  identifier: "ResponseConfiguration",
}) as any as S.Schema<ResponseConfiguration>;
export type ResponseConfigurations = { [key: string]: ResponseConfiguration };
export const ResponseConfigurations = S.Record({
  key: S.String,
  value: ResponseConfiguration,
});
export interface UpdateChatResponseConfigurationRequest {
  applicationId: string;
  chatResponseConfigurationId: string;
  displayName?: string;
  responseConfigurations: ResponseConfigurations;
  clientToken?: string;
}
export const UpdateChatResponseConfigurationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    chatResponseConfigurationId: S.String.pipe(
      T.HttpLabel("chatResponseConfigurationId"),
    ),
    displayName: S.optional(S.String),
    responseConfigurations: ResponseConfigurations,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/chatresponseconfigurations/{chatResponseConfigurationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChatResponseConfigurationRequest",
}) as any as S.Schema<UpdateChatResponseConfigurationRequest>;
export interface UpdateChatResponseConfigurationResponse {}
export const UpdateChatResponseConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateChatResponseConfigurationResponse",
}) as any as S.Schema<UpdateChatResponseConfigurationResponse>;
export interface UpdateSubscriptionRequest {
  applicationId: string;
  subscriptionId: string;
  type: string;
}
export const UpdateSubscriptionRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    subscriptionId: S.String.pipe(T.HttpLabel("subscriptionId")),
    type: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/subscriptions/{subscriptionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSubscriptionRequest",
}) as any as S.Schema<UpdateSubscriptionRequest>;
export interface UserAlias {
  indexId?: string;
  dataSourceId?: string;
  userId: string;
}
export const UserAlias = S.suspend(() =>
  S.Struct({
    indexId: S.optional(S.String),
    dataSourceId: S.optional(S.String),
    userId: S.String,
  }),
).annotations({ identifier: "UserAlias" }) as any as S.Schema<UserAlias>;
export type UserAliases = UserAlias[];
export const UserAliases = S.Array(UserAlias);
export interface UpdateUserRequest {
  applicationId: string;
  userId: string;
  userAliasesToUpdate?: UserAliases;
  userAliasesToDelete?: UserAliases;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    userAliasesToUpdate: S.optional(UserAliases),
    userAliasesToDelete: S.optional(UserAliases),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/users/{userId}",
      }),
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
export interface GetApplicationRequest {
  applicationId: string;
}
export const GetApplicationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{applicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationRequest",
}) as any as S.Schema<GetApplicationRequest>;
export interface DeleteApplicationRequest {
  applicationId: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/applications/{applicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface ListApplicationsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface GetDataAccessorRequest {
  applicationId: string;
  dataAccessorId: string;
}
export const GetDataAccessorRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    dataAccessorId: S.String.pipe(T.HttpLabel("dataAccessorId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/dataaccessors/{dataAccessorId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataAccessorRequest",
}) as any as S.Schema<GetDataAccessorRequest>;
export type DocumentAttributeStringListValue = string[];
export const DocumentAttributeStringListValue = S.Array(S.String);
export type DocumentAttributeValue =
  | { stringValue: string }
  | { stringListValue: DocumentAttributeStringListValue }
  | { longValue: number }
  | { dateValue: Date };
export const DocumentAttributeValue = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ stringListValue: DocumentAttributeStringListValue }),
  S.Struct({ longValue: S.Number }),
  S.Struct({ dateValue: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
);
export interface DocumentAttribute {
  name: string;
  value: (typeof DocumentAttributeValue)["Type"];
}
export const DocumentAttribute = S.suspend(() =>
  S.Struct({ name: S.String, value: DocumentAttributeValue }),
).annotations({
  identifier: "DocumentAttribute",
}) as any as S.Schema<DocumentAttribute>;
export interface AttributeFilter {
  andAllFilters?: AttributeFilters;
  orAllFilters?: AttributeFilters;
  notFilter?: AttributeFilter;
  equalsTo?: DocumentAttribute;
  containsAll?: DocumentAttribute;
  containsAny?: DocumentAttribute;
  greaterThan?: DocumentAttribute;
  greaterThanOrEquals?: DocumentAttribute;
  lessThan?: DocumentAttribute;
  lessThanOrEquals?: DocumentAttribute;
}
export const AttributeFilter = S.suspend(() =>
  S.Struct({
    andAllFilters: S.optional(
      S.suspend(() => AttributeFilters).annotations({
        identifier: "AttributeFilters",
      }),
    ),
    orAllFilters: S.optional(
      S.suspend(() => AttributeFilters).annotations({
        identifier: "AttributeFilters",
      }),
    ),
    notFilter: S.optional(
      S.suspend(
        (): S.Schema<AttributeFilter, any> => AttributeFilter,
      ).annotations({ identifier: "AttributeFilter" }),
    ),
    equalsTo: S.optional(DocumentAttribute),
    containsAll: S.optional(DocumentAttribute),
    containsAny: S.optional(DocumentAttribute),
    greaterThan: S.optional(DocumentAttribute),
    greaterThanOrEquals: S.optional(DocumentAttribute),
    lessThan: S.optional(DocumentAttribute),
    lessThanOrEquals: S.optional(DocumentAttribute),
  }),
).annotations({
  identifier: "AttributeFilter",
}) as any as S.Schema<AttributeFilter>;
export interface ActionFilterConfiguration {
  documentAttributeFilter: AttributeFilter;
}
export const ActionFilterConfiguration = S.suspend(() =>
  S.Struct({ documentAttributeFilter: AttributeFilter }),
).annotations({
  identifier: "ActionFilterConfiguration",
}) as any as S.Schema<ActionFilterConfiguration>;
export interface ActionConfiguration {
  action: string;
  filterConfiguration?: ActionFilterConfiguration;
}
export const ActionConfiguration = S.suspend(() =>
  S.Struct({
    action: S.String,
    filterConfiguration: S.optional(ActionFilterConfiguration),
  }),
).annotations({
  identifier: "ActionConfiguration",
}) as any as S.Schema<ActionConfiguration>;
export type ActionConfigurationList = ActionConfiguration[];
export const ActionConfigurationList = S.Array(ActionConfiguration);
export interface DataAccessorIdcTrustedTokenIssuerConfiguration {
  idcTrustedTokenIssuerArn: string;
}
export const DataAccessorIdcTrustedTokenIssuerConfiguration = S.suspend(() =>
  S.Struct({ idcTrustedTokenIssuerArn: S.String }),
).annotations({
  identifier: "DataAccessorIdcTrustedTokenIssuerConfiguration",
}) as any as S.Schema<DataAccessorIdcTrustedTokenIssuerConfiguration>;
export type DataAccessorAuthenticationConfiguration = {
  idcTrustedTokenIssuerConfiguration: DataAccessorIdcTrustedTokenIssuerConfiguration;
};
export const DataAccessorAuthenticationConfiguration = S.Union(
  S.Struct({
    idcTrustedTokenIssuerConfiguration:
      DataAccessorIdcTrustedTokenIssuerConfiguration,
  }),
);
export type DataAccessorExternalIds = string[];
export const DataAccessorExternalIds = S.Array(S.String);
export interface DataAccessorAuthenticationDetail {
  authenticationType: string;
  authenticationConfiguration?: (typeof DataAccessorAuthenticationConfiguration)["Type"];
  externalIds?: DataAccessorExternalIds;
}
export const DataAccessorAuthenticationDetail = S.suspend(() =>
  S.Struct({
    authenticationType: S.String,
    authenticationConfiguration: S.optional(
      DataAccessorAuthenticationConfiguration,
    ),
    externalIds: S.optional(DataAccessorExternalIds),
  }),
).annotations({
  identifier: "DataAccessorAuthenticationDetail",
}) as any as S.Schema<DataAccessorAuthenticationDetail>;
export interface UpdateDataAccessorRequest {
  applicationId: string;
  dataAccessorId: string;
  actionConfigurations: ActionConfigurationList;
  authenticationDetail?: DataAccessorAuthenticationDetail;
  displayName?: string | Redacted.Redacted<string>;
}
export const UpdateDataAccessorRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    dataAccessorId: S.String.pipe(T.HttpLabel("dataAccessorId")),
    actionConfigurations: ActionConfigurationList,
    authenticationDetail: S.optional(DataAccessorAuthenticationDetail),
    displayName: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/dataaccessors/{dataAccessorId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataAccessorRequest",
}) as any as S.Schema<UpdateDataAccessorRequest>;
export interface UpdateDataAccessorResponse {}
export const UpdateDataAccessorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDataAccessorResponse",
}) as any as S.Schema<UpdateDataAccessorResponse>;
export interface DeleteDataAccessorRequest {
  applicationId: string;
  dataAccessorId: string;
}
export const DeleteDataAccessorRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    dataAccessorId: S.String.pipe(T.HttpLabel("dataAccessorId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/dataaccessors/{dataAccessorId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataAccessorRequest",
}) as any as S.Schema<DeleteDataAccessorRequest>;
export interface DeleteDataAccessorResponse {}
export const DeleteDataAccessorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataAccessorResponse",
}) as any as S.Schema<DeleteDataAccessorResponse>;
export interface ListDataAccessorsRequest {
  applicationId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataAccessorsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/dataaccessors",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataAccessorsRequest",
}) as any as S.Schema<ListDataAccessorsRequest>;
export interface GetIndexRequest {
  applicationId: string;
  indexId: string;
}
export const GetIndexRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/indices/{indexId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIndexRequest",
}) as any as S.Schema<GetIndexRequest>;
export interface DeleteIndexRequest {
  applicationId: string;
  indexId: string;
}
export const DeleteIndexRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/indices/{indexId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIndexRequest",
}) as any as S.Schema<DeleteIndexRequest>;
export interface DeleteIndexResponse {}
export const DeleteIndexResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteIndexResponse",
}) as any as S.Schema<DeleteIndexResponse>;
export interface ListIndicesRequest {
  applicationId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListIndicesRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{applicationId}/indices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIndicesRequest",
}) as any as S.Schema<ListIndicesRequest>;
export interface GetDataSourceRequest {
  applicationId: string;
  indexId: string;
  dataSourceId: string;
}
export const GetDataSourceRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/indices/{indexId}/datasources/{dataSourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataSourceRequest",
}) as any as S.Schema<GetDataSourceRequest>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface DataSourceVpcConfiguration {
  subnetIds: SubnetIds;
  securityGroupIds: SecurityGroupIds;
}
export const DataSourceVpcConfiguration = S.suspend(() =>
  S.Struct({ subnetIds: SubnetIds, securityGroupIds: SecurityGroupIds }),
).annotations({
  identifier: "DataSourceVpcConfiguration",
}) as any as S.Schema<DataSourceVpcConfiguration>;
export interface DocumentAttributeCondition {
  key: string;
  operator: string;
  value?: (typeof DocumentAttributeValue)["Type"];
}
export const DocumentAttributeCondition = S.suspend(() =>
  S.Struct({
    key: S.String,
    operator: S.String,
    value: S.optional(DocumentAttributeValue),
  }),
).annotations({
  identifier: "DocumentAttributeCondition",
}) as any as S.Schema<DocumentAttributeCondition>;
export interface DocumentAttributeTarget {
  key: string;
  value?: (typeof DocumentAttributeValue)["Type"];
  attributeValueOperator?: string;
}
export const DocumentAttributeTarget = S.suspend(() =>
  S.Struct({
    key: S.String,
    value: S.optional(DocumentAttributeValue),
    attributeValueOperator: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentAttributeTarget",
}) as any as S.Schema<DocumentAttributeTarget>;
export interface InlineDocumentEnrichmentConfiguration {
  condition?: DocumentAttributeCondition;
  target?: DocumentAttributeTarget;
  documentContentOperator?: string;
}
export const InlineDocumentEnrichmentConfiguration = S.suspend(() =>
  S.Struct({
    condition: S.optional(DocumentAttributeCondition),
    target: S.optional(DocumentAttributeTarget),
    documentContentOperator: S.optional(S.String),
  }),
).annotations({
  identifier: "InlineDocumentEnrichmentConfiguration",
}) as any as S.Schema<InlineDocumentEnrichmentConfiguration>;
export type InlineDocumentEnrichmentConfigurations =
  InlineDocumentEnrichmentConfiguration[];
export const InlineDocumentEnrichmentConfigurations = S.Array(
  InlineDocumentEnrichmentConfiguration,
);
export interface HookConfiguration {
  invocationCondition?: DocumentAttributeCondition;
  lambdaArn?: string;
  s3BucketName?: string;
  roleArn?: string;
}
export const HookConfiguration = S.suspend(() =>
  S.Struct({
    invocationCondition: S.optional(DocumentAttributeCondition),
    lambdaArn: S.optional(S.String),
    s3BucketName: S.optional(S.String),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "HookConfiguration",
}) as any as S.Schema<HookConfiguration>;
export interface DocumentEnrichmentConfiguration {
  inlineConfigurations?: InlineDocumentEnrichmentConfigurations;
  preExtractionHookConfiguration?: HookConfiguration;
  postExtractionHookConfiguration?: HookConfiguration;
}
export const DocumentEnrichmentConfiguration = S.suspend(() =>
  S.Struct({
    inlineConfigurations: S.optional(InlineDocumentEnrichmentConfigurations),
    preExtractionHookConfiguration: S.optional(HookConfiguration),
    postExtractionHookConfiguration: S.optional(HookConfiguration),
  }),
).annotations({
  identifier: "DocumentEnrichmentConfiguration",
}) as any as S.Schema<DocumentEnrichmentConfiguration>;
export interface ImageExtractionConfiguration {
  imageExtractionStatus: string;
}
export const ImageExtractionConfiguration = S.suspend(() =>
  S.Struct({ imageExtractionStatus: S.String }),
).annotations({
  identifier: "ImageExtractionConfiguration",
}) as any as S.Schema<ImageExtractionConfiguration>;
export interface AudioExtractionConfiguration {
  audioExtractionStatus: string;
}
export const AudioExtractionConfiguration = S.suspend(() =>
  S.Struct({ audioExtractionStatus: S.String }),
).annotations({
  identifier: "AudioExtractionConfiguration",
}) as any as S.Schema<AudioExtractionConfiguration>;
export interface VideoExtractionConfiguration {
  videoExtractionStatus: string;
}
export const VideoExtractionConfiguration = S.suspend(() =>
  S.Struct({ videoExtractionStatus: S.String }),
).annotations({
  identifier: "VideoExtractionConfiguration",
}) as any as S.Schema<VideoExtractionConfiguration>;
export interface MediaExtractionConfiguration {
  imageExtractionConfiguration?: ImageExtractionConfiguration;
  audioExtractionConfiguration?: AudioExtractionConfiguration;
  videoExtractionConfiguration?: VideoExtractionConfiguration;
}
export const MediaExtractionConfiguration = S.suspend(() =>
  S.Struct({
    imageExtractionConfiguration: S.optional(ImageExtractionConfiguration),
    audioExtractionConfiguration: S.optional(AudioExtractionConfiguration),
    videoExtractionConfiguration: S.optional(VideoExtractionConfiguration),
  }),
).annotations({
  identifier: "MediaExtractionConfiguration",
}) as any as S.Schema<MediaExtractionConfiguration>;
export interface UpdateDataSourceRequest {
  applicationId: string;
  indexId: string;
  dataSourceId: string;
  displayName?: string;
  configuration?: any;
  vpcConfiguration?: DataSourceVpcConfiguration;
  description?: string;
  syncSchedule?: string;
  roleArn?: string;
  documentEnrichmentConfiguration?: DocumentEnrichmentConfiguration;
  mediaExtractionConfiguration?: MediaExtractionConfiguration;
}
export const UpdateDataSourceRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    displayName: S.optional(S.String),
    configuration: S.optional(S.Any),
    vpcConfiguration: S.optional(DataSourceVpcConfiguration),
    description: S.optional(S.String),
    syncSchedule: S.optional(S.String),
    roleArn: S.optional(S.String),
    documentEnrichmentConfiguration: S.optional(
      DocumentEnrichmentConfiguration,
    ),
    mediaExtractionConfiguration: S.optional(MediaExtractionConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/indices/{indexId}/datasources/{dataSourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataSourceRequest",
}) as any as S.Schema<UpdateDataSourceRequest>;
export interface UpdateDataSourceResponse {}
export const UpdateDataSourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDataSourceResponse",
}) as any as S.Schema<UpdateDataSourceResponse>;
export interface DeleteDataSourceRequest {
  applicationId: string;
  indexId: string;
  dataSourceId: string;
}
export const DeleteDataSourceRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/indices/{indexId}/datasources/{dataSourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataSourceRequest",
}) as any as S.Schema<DeleteDataSourceRequest>;
export interface DeleteDataSourceResponse {}
export const DeleteDataSourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataSourceResponse",
}) as any as S.Schema<DeleteDataSourceResponse>;
export interface ListDataSourcesRequest {
  applicationId: string;
  indexId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataSourcesRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/indices/{indexId}/datasources",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSourcesRequest",
}) as any as S.Schema<ListDataSourcesRequest>;
export interface GetPluginRequest {
  applicationId: string;
  pluginId: string;
}
export const GetPluginRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    pluginId: S.String.pipe(T.HttpLabel("pluginId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/plugins/{pluginId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPluginRequest",
}) as any as S.Schema<GetPluginRequest>;
export interface S3 {
  bucket: string;
  key: string;
}
export const S3 = S.suspend(() =>
  S.Struct({ bucket: S.String, key: S.String }),
).annotations({ identifier: "S3" }) as any as S.Schema<S3>;
export type APISchema =
  | { payload: string | Redacted.Redacted<string> }
  | { s3: S3 };
export const APISchema = S.Union(
  S.Struct({ payload: SensitiveString }),
  S.Struct({ s3: S3 }),
);
export interface CustomPluginConfiguration {
  description: string;
  apiSchemaType: string;
  apiSchema?: (typeof APISchema)["Type"];
}
export const CustomPluginConfiguration = S.suspend(() =>
  S.Struct({
    description: S.String,
    apiSchemaType: S.String,
    apiSchema: S.optional(APISchema),
  }),
).annotations({
  identifier: "CustomPluginConfiguration",
}) as any as S.Schema<CustomPluginConfiguration>;
export interface BasicAuthConfiguration {
  secretArn: string;
  roleArn: string;
}
export const BasicAuthConfiguration = S.suspend(() =>
  S.Struct({ secretArn: S.String, roleArn: S.String }),
).annotations({
  identifier: "BasicAuthConfiguration",
}) as any as S.Schema<BasicAuthConfiguration>;
export interface OAuth2ClientCredentialConfiguration {
  secretArn: string;
  roleArn: string;
  authorizationUrl?: string;
  tokenUrl?: string;
}
export const OAuth2ClientCredentialConfiguration = S.suspend(() =>
  S.Struct({
    secretArn: S.String,
    roleArn: S.String,
    authorizationUrl: S.optional(S.String),
    tokenUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "OAuth2ClientCredentialConfiguration",
}) as any as S.Schema<OAuth2ClientCredentialConfiguration>;
export interface NoAuthConfiguration {}
export const NoAuthConfiguration = S.suspend(() => S.Struct({})).annotations({
  identifier: "NoAuthConfiguration",
}) as any as S.Schema<NoAuthConfiguration>;
export interface IdcAuthConfiguration {
  idcApplicationArn: string;
  roleArn: string;
}
export const IdcAuthConfiguration = S.suspend(() =>
  S.Struct({ idcApplicationArn: S.String, roleArn: S.String }),
).annotations({
  identifier: "IdcAuthConfiguration",
}) as any as S.Schema<IdcAuthConfiguration>;
export type PluginAuthConfiguration =
  | { basicAuthConfiguration: BasicAuthConfiguration }
  | { oAuth2ClientCredentialConfiguration: OAuth2ClientCredentialConfiguration }
  | { noAuthConfiguration: NoAuthConfiguration }
  | { idcAuthConfiguration: IdcAuthConfiguration };
export const PluginAuthConfiguration = S.Union(
  S.Struct({ basicAuthConfiguration: BasicAuthConfiguration }),
  S.Struct({
    oAuth2ClientCredentialConfiguration: OAuth2ClientCredentialConfiguration,
  }),
  S.Struct({ noAuthConfiguration: NoAuthConfiguration }),
  S.Struct({ idcAuthConfiguration: IdcAuthConfiguration }),
);
export interface UpdatePluginRequest {
  applicationId: string;
  pluginId: string;
  displayName?: string;
  state?: string;
  serverUrl?: string;
  customPluginConfiguration?: CustomPluginConfiguration;
  authConfiguration?: (typeof PluginAuthConfiguration)["Type"];
}
export const UpdatePluginRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    pluginId: S.String.pipe(T.HttpLabel("pluginId")),
    displayName: S.optional(S.String),
    state: S.optional(S.String),
    serverUrl: S.optional(S.String),
    customPluginConfiguration: S.optional(CustomPluginConfiguration),
    authConfiguration: S.optional(PluginAuthConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/plugins/{pluginId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePluginRequest",
}) as any as S.Schema<UpdatePluginRequest>;
export interface UpdatePluginResponse {}
export const UpdatePluginResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdatePluginResponse",
}) as any as S.Schema<UpdatePluginResponse>;
export interface DeletePluginRequest {
  applicationId: string;
  pluginId: string;
}
export const DeletePluginRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    pluginId: S.String.pipe(T.HttpLabel("pluginId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/plugins/{pluginId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePluginRequest",
}) as any as S.Schema<DeletePluginRequest>;
export interface DeletePluginResponse {}
export const DeletePluginResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePluginResponse",
}) as any as S.Schema<DeletePluginResponse>;
export interface ListPluginsRequest {
  applicationId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPluginsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{applicationId}/plugins" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPluginsRequest",
}) as any as S.Schema<ListPluginsRequest>;
export interface GetRetrieverRequest {
  applicationId: string;
  retrieverId: string;
}
export const GetRetrieverRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    retrieverId: S.String.pipe(T.HttpLabel("retrieverId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/retrievers/{retrieverId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRetrieverRequest",
}) as any as S.Schema<GetRetrieverRequest>;
export interface NumberAttributeBoostingConfiguration {
  boostingLevel: string;
  boostingType?: string;
}
export const NumberAttributeBoostingConfiguration = S.suspend(() =>
  S.Struct({ boostingLevel: S.String, boostingType: S.optional(S.String) }),
).annotations({
  identifier: "NumberAttributeBoostingConfiguration",
}) as any as S.Schema<NumberAttributeBoostingConfiguration>;
export type StringAttributeValueBoosting = { [key: string]: string };
export const StringAttributeValueBoosting = S.Record({
  key: S.String,
  value: S.String,
});
export interface StringAttributeBoostingConfiguration {
  boostingLevel: string;
  attributeValueBoosting?: StringAttributeValueBoosting;
}
export const StringAttributeBoostingConfiguration = S.suspend(() =>
  S.Struct({
    boostingLevel: S.String,
    attributeValueBoosting: S.optional(StringAttributeValueBoosting),
  }),
).annotations({
  identifier: "StringAttributeBoostingConfiguration",
}) as any as S.Schema<StringAttributeBoostingConfiguration>;
export interface DateAttributeBoostingConfiguration {
  boostingLevel: string;
  boostingDurationInSeconds?: number;
}
export const DateAttributeBoostingConfiguration = S.suspend(() =>
  S.Struct({
    boostingLevel: S.String,
    boostingDurationInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "DateAttributeBoostingConfiguration",
}) as any as S.Schema<DateAttributeBoostingConfiguration>;
export interface StringListAttributeBoostingConfiguration {
  boostingLevel: string;
}
export const StringListAttributeBoostingConfiguration = S.suspend(() =>
  S.Struct({ boostingLevel: S.String }),
).annotations({
  identifier: "StringListAttributeBoostingConfiguration",
}) as any as S.Schema<StringListAttributeBoostingConfiguration>;
export type DocumentAttributeBoostingConfiguration =
  | { numberConfiguration: NumberAttributeBoostingConfiguration }
  | { stringConfiguration: StringAttributeBoostingConfiguration }
  | { dateConfiguration: DateAttributeBoostingConfiguration }
  | { stringListConfiguration: StringListAttributeBoostingConfiguration };
export const DocumentAttributeBoostingConfiguration = S.Union(
  S.Struct({ numberConfiguration: NumberAttributeBoostingConfiguration }),
  S.Struct({ stringConfiguration: StringAttributeBoostingConfiguration }),
  S.Struct({ dateConfiguration: DateAttributeBoostingConfiguration }),
  S.Struct({
    stringListConfiguration: StringListAttributeBoostingConfiguration,
  }),
);
export type DocumentAttributeBoostingOverrideMap = {
  [key: string]: (typeof DocumentAttributeBoostingConfiguration)["Type"];
};
export const DocumentAttributeBoostingOverrideMap = S.Record({
  key: S.String,
  value: DocumentAttributeBoostingConfiguration,
});
export interface NativeIndexConfiguration {
  indexId: string;
  version?: number;
  boostingOverride?: DocumentAttributeBoostingOverrideMap;
}
export const NativeIndexConfiguration = S.suspend(() =>
  S.Struct({
    indexId: S.String,
    version: S.optional(S.Number),
    boostingOverride: S.optional(DocumentAttributeBoostingOverrideMap),
  }),
).annotations({
  identifier: "NativeIndexConfiguration",
}) as any as S.Schema<NativeIndexConfiguration>;
export interface KendraIndexConfiguration {
  indexId: string;
}
export const KendraIndexConfiguration = S.suspend(() =>
  S.Struct({ indexId: S.String }),
).annotations({
  identifier: "KendraIndexConfiguration",
}) as any as S.Schema<KendraIndexConfiguration>;
export type RetrieverConfiguration =
  | { nativeIndexConfiguration: NativeIndexConfiguration }
  | { kendraIndexConfiguration: KendraIndexConfiguration };
export const RetrieverConfiguration = S.Union(
  S.Struct({ nativeIndexConfiguration: NativeIndexConfiguration }),
  S.Struct({ kendraIndexConfiguration: KendraIndexConfiguration }),
);
export interface UpdateRetrieverRequest {
  applicationId: string;
  retrieverId: string;
  configuration?: (typeof RetrieverConfiguration)["Type"];
  displayName?: string;
  roleArn?: string;
}
export const UpdateRetrieverRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    retrieverId: S.String.pipe(T.HttpLabel("retrieverId")),
    configuration: S.optional(RetrieverConfiguration),
    displayName: S.optional(S.String),
    roleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/retrievers/{retrieverId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRetrieverRequest",
}) as any as S.Schema<UpdateRetrieverRequest>;
export interface UpdateRetrieverResponse {}
export const UpdateRetrieverResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateRetrieverResponse",
}) as any as S.Schema<UpdateRetrieverResponse>;
export interface DeleteRetrieverRequest {
  applicationId: string;
  retrieverId: string;
}
export const DeleteRetrieverRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    retrieverId: S.String.pipe(T.HttpLabel("retrieverId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/retrievers/{retrieverId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRetrieverRequest",
}) as any as S.Schema<DeleteRetrieverRequest>;
export interface DeleteRetrieverResponse {}
export const DeleteRetrieverResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRetrieverResponse",
}) as any as S.Schema<DeleteRetrieverResponse>;
export interface ListRetrieversRequest {
  applicationId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListRetrieversRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/retrievers",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRetrieversRequest",
}) as any as S.Schema<ListRetrieversRequest>;
export interface GetWebExperienceRequest {
  applicationId: string;
  webExperienceId: string;
}
export const GetWebExperienceRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    webExperienceId: S.String.pipe(T.HttpLabel("webExperienceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/experiences/{webExperienceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWebExperienceRequest",
}) as any as S.Schema<GetWebExperienceRequest>;
export interface DeleteWebExperienceRequest {
  applicationId: string;
  webExperienceId: string;
}
export const DeleteWebExperienceRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    webExperienceId: S.String.pipe(T.HttpLabel("webExperienceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/experiences/{webExperienceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWebExperienceRequest",
}) as any as S.Schema<DeleteWebExperienceRequest>;
export interface DeleteWebExperienceResponse {}
export const DeleteWebExperienceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWebExperienceResponse",
}) as any as S.Schema<DeleteWebExperienceResponse>;
export interface ListWebExperiencesRequest {
  applicationId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListWebExperiencesRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/experiences",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWebExperiencesRequest",
}) as any as S.Schema<ListWebExperiencesRequest>;
export type PermissionConditionValues = string[];
export const PermissionConditionValues = S.Array(S.String);
export interface EndOfInputEvent {}
export const EndOfInputEvent = S.suspend(() => S.Struct({})).annotations({
  identifier: "EndOfInputEvent",
}) as any as S.Schema<EndOfInputEvent>;
export type AttributeFilters = AttributeFilter[];
export const AttributeFilters = S.Array(
  S.suspend((): S.Schema<AttributeFilter, any> => AttributeFilter).annotations({
    identifier: "AttributeFilter",
  }),
) as any as S.Schema<AttributeFilters>;
export type BlockedPhrases = string[];
export const BlockedPhrases = S.Array(S.String);
export type ExampleChatMessages = string[];
export const ExampleChatMessages = S.Array(S.String);
export type BrowserExtensionList = string[];
export const BrowserExtensionList = S.Array(S.String);
export interface PermissionCondition {
  conditionOperator: string;
  conditionKey: string;
  conditionValues: PermissionConditionValues;
}
export const PermissionCondition = S.suspend(() =>
  S.Struct({
    conditionOperator: S.String,
    conditionKey: S.String,
    conditionValues: PermissionConditionValues,
  }),
).annotations({
  identifier: "PermissionCondition",
}) as any as S.Schema<PermissionCondition>;
export type PermissionConditions = PermissionCondition[];
export const PermissionConditions = S.Array(PermissionCondition);
export interface DeleteDocument {
  documentId: string;
}
export const DeleteDocument = S.suspend(() =>
  S.Struct({ documentId: S.String }),
).annotations({
  identifier: "DeleteDocument",
}) as any as S.Schema<DeleteDocument>;
export type DeleteDocuments = DeleteDocument[];
export const DeleteDocuments = S.Array(DeleteDocument);
export type SubscriptionPrincipal = { user: string } | { group: string };
export const SubscriptionPrincipal = S.Union(
  S.Struct({ user: S.String }),
  S.Struct({ group: S.String }),
);
export interface ErrorDetail {
  errorMessage?: string;
  errorCode?: string;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export interface GroupStatusDetail {
  status?: string;
  lastUpdatedAt?: Date;
  errorDetail?: ErrorDetail;
}
export const GroupStatusDetail = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    errorDetail: S.optional(ErrorDetail),
  }),
).annotations({
  identifier: "GroupStatusDetail",
}) as any as S.Schema<GroupStatusDetail>;
export type GroupStatusDetails = GroupStatusDetail[];
export const GroupStatusDetails = S.Array(GroupStatusDetail);
export interface MessageUsefulnessFeedback {
  usefulness: string;
  reason?: string;
  comment?: string;
  submittedAt: Date;
}
export const MessageUsefulnessFeedback = S.suspend(() =>
  S.Struct({
    usefulness: S.String,
    reason: S.optional(S.String),
    comment: S.optional(S.String),
    submittedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "MessageUsefulnessFeedback",
}) as any as S.Schema<MessageUsefulnessFeedback>;
export interface OrchestrationConfiguration {
  control: string;
}
export const OrchestrationConfiguration = S.suspend(() =>
  S.Struct({ control: S.String }),
).annotations({
  identifier: "OrchestrationConfiguration",
}) as any as S.Schema<OrchestrationConfiguration>;
export interface BlockedPhrasesConfigurationUpdate {
  blockedPhrasesToCreateOrUpdate?: BlockedPhrases;
  blockedPhrasesToDelete?: BlockedPhrases;
  systemMessageOverride?: string;
}
export const BlockedPhrasesConfigurationUpdate = S.suspend(() =>
  S.Struct({
    blockedPhrasesToCreateOrUpdate: S.optional(BlockedPhrases),
    blockedPhrasesToDelete: S.optional(BlockedPhrases),
    systemMessageOverride: S.optional(S.String),
  }),
).annotations({
  identifier: "BlockedPhrasesConfigurationUpdate",
}) as any as S.Schema<BlockedPhrasesConfigurationUpdate>;
export interface CreatorModeConfiguration {
  creatorModeControl: string;
}
export const CreatorModeConfiguration = S.suspend(() =>
  S.Struct({ creatorModeControl: S.String }),
).annotations({
  identifier: "CreatorModeConfiguration",
}) as any as S.Schema<CreatorModeConfiguration>;
export interface HallucinationReductionConfiguration {
  hallucinationReductionControl?: string;
}
export const HallucinationReductionConfiguration = S.suspend(() =>
  S.Struct({ hallucinationReductionControl: S.optional(S.String) }),
).annotations({
  identifier: "HallucinationReductionConfiguration",
}) as any as S.Schema<HallucinationReductionConfiguration>;
export interface EncryptionConfiguration {
  kmsKeyId?: string | Redacted.Redacted<string>;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ kmsKeyId: S.optional(SensitiveString) }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface AttachmentsConfiguration {
  attachmentsControlMode: string;
}
export const AttachmentsConfiguration = S.suspend(() =>
  S.Struct({ attachmentsControlMode: S.String }),
).annotations({
  identifier: "AttachmentsConfiguration",
}) as any as S.Schema<AttachmentsConfiguration>;
export interface QAppsConfiguration {
  qAppsControlMode: string;
}
export const QAppsConfiguration = S.suspend(() =>
  S.Struct({ qAppsControlMode: S.String }),
).annotations({
  identifier: "QAppsConfiguration",
}) as any as S.Schema<QAppsConfiguration>;
export interface PersonalizationConfiguration {
  personalizationControlMode: string;
}
export const PersonalizationConfiguration = S.suspend(() =>
  S.Struct({ personalizationControlMode: S.String }),
).annotations({
  identifier: "PersonalizationConfiguration",
}) as any as S.Schema<PersonalizationConfiguration>;
export interface QuickSightConfiguration {
  clientNamespace: string;
}
export const QuickSightConfiguration = S.suspend(() =>
  S.Struct({ clientNamespace: S.String }),
).annotations({
  identifier: "QuickSightConfiguration",
}) as any as S.Schema<QuickSightConfiguration>;
export interface AutoSubscriptionConfiguration {
  autoSubscribe: string;
  defaultSubscriptionType?: string;
}
export const AutoSubscriptionConfiguration = S.suspend(() =>
  S.Struct({
    autoSubscribe: S.String,
    defaultSubscriptionType: S.optional(S.String),
  }),
).annotations({
  identifier: "AutoSubscriptionConfiguration",
}) as any as S.Schema<AutoSubscriptionConfiguration>;
export interface IndexCapacityConfiguration {
  units?: number;
}
export const IndexCapacityConfiguration = S.suspend(() =>
  S.Struct({ units: S.optional(S.Number) }),
).annotations({
  identifier: "IndexCapacityConfiguration",
}) as any as S.Schema<IndexCapacityConfiguration>;
export interface DocumentAttributeConfiguration {
  name?: string;
  type?: string;
  search?: string;
}
export const DocumentAttributeConfiguration = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    search: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentAttributeConfiguration",
}) as any as S.Schema<DocumentAttributeConfiguration>;
export type DocumentAttributeConfigurations = DocumentAttributeConfiguration[];
export const DocumentAttributeConfigurations = S.Array(
  DocumentAttributeConfiguration,
);
export interface BrowserExtensionConfiguration {
  enabledBrowserExtensions: BrowserExtensionList;
}
export const BrowserExtensionConfiguration = S.suspend(() =>
  S.Struct({ enabledBrowserExtensions: BrowserExtensionList }),
).annotations({
  identifier: "BrowserExtensionConfiguration",
}) as any as S.Schema<BrowserExtensionConfiguration>;
export interface CustomizationConfiguration {
  customCSSUrl?: string;
  logoUrl?: string;
  fontUrl?: string;
  faviconUrl?: string;
}
export const CustomizationConfiguration = S.suspend(() =>
  S.Struct({
    customCSSUrl: S.optional(S.String),
    logoUrl: S.optional(S.String),
    fontUrl: S.optional(S.String),
    faviconUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomizationConfiguration",
}) as any as S.Schema<CustomizationConfiguration>;
export interface AssociatePermissionRequest {
  applicationId: string;
  statementId: string;
  actions: QIamActions;
  conditions?: PermissionConditions;
  principal: string;
}
export const AssociatePermissionRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    statementId: S.String,
    actions: QIamActions,
    conditions: S.optional(PermissionConditions),
    principal: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications/{applicationId}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociatePermissionRequest",
}) as any as S.Schema<AssociatePermissionRequest>;
export interface BatchDeleteDocumentRequest {
  applicationId: string;
  indexId: string;
  documents: DeleteDocuments;
  dataSourceSyncId?: string;
}
export const BatchDeleteDocumentRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    documents: DeleteDocuments,
    dataSourceSyncId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/indices/{indexId}/documents/delete",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteDocumentRequest",
}) as any as S.Schema<BatchDeleteDocumentRequest>;
export interface CreateAnonymousWebExperienceUrlResponse {
  anonymousUrl?: string;
}
export const CreateAnonymousWebExperienceUrlResponse = S.suspend(() =>
  S.Struct({ anonymousUrl: S.optional(S.String) }),
).annotations({
  identifier: "CreateAnonymousWebExperienceUrlResponse",
}) as any as S.Schema<CreateAnonymousWebExperienceUrlResponse>;
export interface CreateSubscriptionRequest {
  applicationId: string;
  principal: (typeof SubscriptionPrincipal)["Type"];
  type: string;
  clientToken?: string;
}
export const CreateSubscriptionRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    principal: SubscriptionPrincipal,
    type: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/subscriptions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSubscriptionRequest",
}) as any as S.Schema<CreateSubscriptionRequest>;
export interface CreateUserRequest {
  applicationId: string;
  userId: string;
  userAliases?: UserAliases;
  clientToken?: string;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.String,
    userAliases: S.optional(UserAliases),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications/{applicationId}/users" }),
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
export interface CreateUserResponse {}
export const CreateUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateUserResponse",
}) as any as S.Schema<CreateUserResponse>;
export interface GetDocumentContentResponse {
  presignedUrl: string;
  mimeType: string;
}
export const GetDocumentContentResponse = S.suspend(() =>
  S.Struct({ presignedUrl: S.String, mimeType: S.String }),
).annotations({
  identifier: "GetDocumentContentResponse",
}) as any as S.Schema<GetDocumentContentResponse>;
export interface GetMediaResponse {
  mediaBytes?: Uint8Array;
  mediaMimeType?: string;
}
export const GetMediaResponse = S.suspend(() =>
  S.Struct({
    mediaBytes: S.optional(T.Blob),
    mediaMimeType: S.optional(S.String),
  }),
).annotations({
  identifier: "GetMediaResponse",
}) as any as S.Schema<GetMediaResponse>;
export interface GetPolicyResponse {
  policy?: string;
}
export const GetPolicyResponse = S.suspend(() =>
  S.Struct({ policy: S.optional(S.String) }),
).annotations({
  identifier: "GetPolicyResponse",
}) as any as S.Schema<GetPolicyResponse>;
export interface GetUserResponse {
  userAliases?: UserAliases;
}
export const GetUserResponse = S.suspend(() =>
  S.Struct({ userAliases: S.optional(UserAliases) }),
).annotations({
  identifier: "GetUserResponse",
}) as any as S.Schema<GetUserResponse>;
export interface ActionSummary {
  actionIdentifier?: string;
  displayName?: string;
  instructionExample?: string;
  description?: string;
}
export const ActionSummary = S.suspend(() =>
  S.Struct({
    actionIdentifier: S.optional(S.String),
    displayName: S.optional(S.String),
    instructionExample: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionSummary",
}) as any as S.Schema<ActionSummary>;
export type Actions = ActionSummary[];
export const Actions = S.Array(ActionSummary);
export interface ListPluginTypeActionsResponse {
  nextToken?: string;
  items?: Actions;
}
export const ListPluginTypeActionsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), items: S.optional(Actions) }),
).annotations({
  identifier: "ListPluginTypeActionsResponse",
}) as any as S.Schema<ListPluginTypeActionsResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutFeedbackRequest {
  applicationId: string;
  userId?: string;
  conversationId: string;
  messageId: string;
  messageCopiedAt?: Date;
  messageUsefulness?: MessageUsefulnessFeedback;
}
export const PutFeedbackRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    conversationId: S.String.pipe(T.HttpLabel("conversationId")),
    messageId: S.String.pipe(T.HttpLabel("messageId")),
    messageCopiedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    messageUsefulness: S.optional(MessageUsefulnessFeedback),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/conversations/{conversationId}/messages/{messageId}/feedback",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFeedbackRequest",
}) as any as S.Schema<PutFeedbackRequest>;
export interface PutFeedbackResponse {}
export const PutFeedbackResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutFeedbackResponse",
}) as any as S.Schema<PutFeedbackResponse>;
export interface StartDataSourceSyncJobResponse {
  executionId?: string;
}
export const StartDataSourceSyncJobResponse = S.suspend(() =>
  S.Struct({ executionId: S.optional(S.String) }),
).annotations({
  identifier: "StartDataSourceSyncJobResponse",
}) as any as S.Schema<StartDataSourceSyncJobResponse>;
export interface SubscriptionDetails {
  type?: string;
}
export const SubscriptionDetails = S.suspend(() =>
  S.Struct({ type: S.optional(S.String) }),
).annotations({
  identifier: "SubscriptionDetails",
}) as any as S.Schema<SubscriptionDetails>;
export interface UpdateSubscriptionResponse {
  subscriptionArn?: string;
  currentSubscription?: SubscriptionDetails;
  nextSubscription?: SubscriptionDetails;
}
export const UpdateSubscriptionResponse = S.suspend(() =>
  S.Struct({
    subscriptionArn: S.optional(S.String),
    currentSubscription: S.optional(SubscriptionDetails),
    nextSubscription: S.optional(SubscriptionDetails),
  }),
).annotations({
  identifier: "UpdateSubscriptionResponse",
}) as any as S.Schema<UpdateSubscriptionResponse>;
export interface UpdateUserResponse {
  userAliasesAdded?: UserAliases;
  userAliasesUpdated?: UserAliases;
  userAliasesDeleted?: UserAliases;
}
export const UpdateUserResponse = S.suspend(() =>
  S.Struct({
    userAliasesAdded: S.optional(UserAliases),
    userAliasesUpdated: S.optional(UserAliases),
    userAliasesDeleted: S.optional(UserAliases),
  }),
).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export interface CreateApplicationRequest {
  displayName: string;
  roleArn?: string;
  identityType?: string;
  iamIdentityProviderArn?: string;
  identityCenterInstanceArn?: string;
  clientIdsForOIDC?: ClientIdsForOIDC;
  description?: string;
  encryptionConfiguration?: EncryptionConfiguration;
  tags?: Tags;
  clientToken?: string;
  attachmentsConfiguration?: AttachmentsConfiguration;
  qAppsConfiguration?: QAppsConfiguration;
  personalizationConfiguration?: PersonalizationConfiguration;
  quickSightConfiguration?: QuickSightConfiguration;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    displayName: S.String,
    roleArn: S.optional(S.String),
    identityType: S.optional(S.String),
    iamIdentityProviderArn: S.optional(S.String),
    identityCenterInstanceArn: S.optional(S.String),
    clientIdsForOIDC: S.optional(ClientIdsForOIDC),
    description: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    tags: S.optional(Tags),
    clientToken: S.optional(S.String),
    attachmentsConfiguration: S.optional(AttachmentsConfiguration),
    qAppsConfiguration: S.optional(QAppsConfiguration),
    personalizationConfiguration: S.optional(PersonalizationConfiguration),
    quickSightConfiguration: S.optional(QuickSightConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface UpdateApplicationRequest {
  applicationId: string;
  identityCenterInstanceArn?: string;
  displayName?: string;
  description?: string;
  roleArn?: string;
  attachmentsConfiguration?: AttachmentsConfiguration;
  qAppsConfiguration?: QAppsConfiguration;
  personalizationConfiguration?: PersonalizationConfiguration;
  autoSubscriptionConfiguration?: AutoSubscriptionConfiguration;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    identityCenterInstanceArn: S.optional(S.String),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    roleArn: S.optional(S.String),
    attachmentsConfiguration: S.optional(AttachmentsConfiguration),
    qAppsConfiguration: S.optional(QAppsConfiguration),
    personalizationConfiguration: S.optional(PersonalizationConfiguration),
    autoSubscriptionConfiguration: S.optional(AutoSubscriptionConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/applications/{applicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface UpdateApplicationResponse {}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface GetDataAccessorResponse {
  displayName?: string | Redacted.Redacted<string>;
  dataAccessorId?: string;
  dataAccessorArn?: string;
  applicationId?: string;
  idcApplicationArn?: string;
  principal?: string;
  actionConfigurations?: ActionConfigurationList;
  authenticationDetail?: DataAccessorAuthenticationDetail;
  createdAt?: Date;
  updatedAt?: Date;
}
export const GetDataAccessorResponse = S.suspend(() =>
  S.Struct({
    displayName: S.optional(SensitiveString),
    dataAccessorId: S.optional(S.String),
    dataAccessorArn: S.optional(S.String),
    applicationId: S.optional(S.String),
    idcApplicationArn: S.optional(S.String),
    principal: S.optional(S.String),
    actionConfigurations: S.optional(ActionConfigurationList),
    authenticationDetail: S.optional(DataAccessorAuthenticationDetail),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetDataAccessorResponse",
}) as any as S.Schema<GetDataAccessorResponse>;
export interface CreateIndexRequest {
  applicationId: string;
  displayName: string;
  description?: string;
  type?: string;
  tags?: Tags;
  capacityConfiguration?: IndexCapacityConfiguration;
  clientToken?: string;
}
export const CreateIndexRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    displayName: S.String,
    description: S.optional(S.String),
    type: S.optional(S.String),
    tags: S.optional(Tags),
    capacityConfiguration: S.optional(IndexCapacityConfiguration),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications/{applicationId}/indices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIndexRequest",
}) as any as S.Schema<CreateIndexRequest>;
export interface UpdateIndexRequest {
  applicationId: string;
  indexId: string;
  displayName?: string;
  description?: string;
  capacityConfiguration?: IndexCapacityConfiguration;
  documentAttributeConfigurations?: DocumentAttributeConfigurations;
}
export const UpdateIndexRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    capacityConfiguration: S.optional(IndexCapacityConfiguration),
    documentAttributeConfigurations: S.optional(
      DocumentAttributeConfigurations,
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/indices/{indexId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIndexRequest",
}) as any as S.Schema<UpdateIndexRequest>;
export interface UpdateIndexResponse {}
export const UpdateIndexResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateIndexResponse",
}) as any as S.Schema<UpdateIndexResponse>;
export interface GetDataSourceResponse {
  applicationId?: string;
  indexId?: string;
  dataSourceId?: string;
  dataSourceArn?: string;
  displayName?: string;
  type?: string;
  configuration?: any;
  vpcConfiguration?: DataSourceVpcConfiguration;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  status?: string;
  syncSchedule?: string;
  roleArn?: string;
  error?: ErrorDetail;
  documentEnrichmentConfiguration?: DocumentEnrichmentConfiguration;
  mediaExtractionConfiguration?: MediaExtractionConfiguration;
}
export const GetDataSourceResponse = S.suspend(() =>
  S.Struct({
    applicationId: S.optional(S.String),
    indexId: S.optional(S.String),
    dataSourceId: S.optional(S.String),
    dataSourceArn: S.optional(S.String),
    displayName: S.optional(S.String),
    type: S.optional(S.String),
    configuration: S.optional(S.Any),
    vpcConfiguration: S.optional(DataSourceVpcConfiguration),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    description: S.optional(S.String),
    status: S.optional(S.String),
    syncSchedule: S.optional(S.String),
    roleArn: S.optional(S.String),
    error: S.optional(ErrorDetail),
    documentEnrichmentConfiguration: S.optional(
      DocumentEnrichmentConfiguration,
    ),
    mediaExtractionConfiguration: S.optional(MediaExtractionConfiguration),
  }),
).annotations({
  identifier: "GetDataSourceResponse",
}) as any as S.Schema<GetDataSourceResponse>;
export interface GetPluginResponse {
  applicationId?: string;
  pluginId?: string;
  displayName?: string;
  type?: string;
  serverUrl?: string;
  authConfiguration?: (typeof PluginAuthConfiguration)["Type"];
  customPluginConfiguration?: CustomPluginConfiguration;
  buildStatus?: string;
  pluginArn?: string;
  state?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const GetPluginResponse = S.suspend(() =>
  S.Struct({
    applicationId: S.optional(S.String),
    pluginId: S.optional(S.String),
    displayName: S.optional(S.String),
    type: S.optional(S.String),
    serverUrl: S.optional(S.String),
    authConfiguration: S.optional(PluginAuthConfiguration),
    customPluginConfiguration: S.optional(CustomPluginConfiguration),
    buildStatus: S.optional(S.String),
    pluginArn: S.optional(S.String),
    state: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetPluginResponse",
}) as any as S.Schema<GetPluginResponse>;
export interface GetRetrieverResponse {
  applicationId?: string;
  retrieverId?: string;
  retrieverArn?: string;
  type?: string;
  status?: string;
  displayName?: string;
  configuration?: (typeof RetrieverConfiguration)["Type"];
  roleArn?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const GetRetrieverResponse = S.suspend(() =>
  S.Struct({
    applicationId: S.optional(S.String),
    retrieverId: S.optional(S.String),
    retrieverArn: S.optional(S.String),
    type: S.optional(S.String),
    status: S.optional(S.String),
    displayName: S.optional(S.String),
    configuration: S.optional(RetrieverConfiguration),
    roleArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetRetrieverResponse",
}) as any as S.Schema<GetRetrieverResponse>;
export interface SamlProviderConfiguration {
  authenticationUrl: string;
}
export const SamlProviderConfiguration = S.suspend(() =>
  S.Struct({ authenticationUrl: S.String }),
).annotations({
  identifier: "SamlProviderConfiguration",
}) as any as S.Schema<SamlProviderConfiguration>;
export interface OpenIDConnectProviderConfiguration {
  secretsArn: string;
  secretsRole: string;
}
export const OpenIDConnectProviderConfiguration = S.suspend(() =>
  S.Struct({ secretsArn: S.String, secretsRole: S.String }),
).annotations({
  identifier: "OpenIDConnectProviderConfiguration",
}) as any as S.Schema<OpenIDConnectProviderConfiguration>;
export type IdentityProviderConfiguration =
  | { samlConfiguration: SamlProviderConfiguration }
  | { openIDConnectConfiguration: OpenIDConnectProviderConfiguration };
export const IdentityProviderConfiguration = S.Union(
  S.Struct({ samlConfiguration: SamlProviderConfiguration }),
  S.Struct({ openIDConnectConfiguration: OpenIDConnectProviderConfiguration }),
);
export interface SamlConfiguration {
  metadataXML: string;
  roleArn: string;
  userIdAttribute: string;
  userGroupAttribute?: string;
}
export const SamlConfiguration = S.suspend(() =>
  S.Struct({
    metadataXML: S.String,
    roleArn: S.String,
    userIdAttribute: S.String,
    userGroupAttribute: S.optional(S.String),
  }),
).annotations({
  identifier: "SamlConfiguration",
}) as any as S.Schema<SamlConfiguration>;
export type WebExperienceAuthConfiguration = {
  samlConfiguration: SamlConfiguration;
};
export const WebExperienceAuthConfiguration = S.Union(
  S.Struct({ samlConfiguration: SamlConfiguration }),
);
export interface GetWebExperienceResponse {
  applicationId?: string;
  webExperienceId?: string;
  webExperienceArn?: string;
  defaultEndpoint?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;
  samplePromptsControlMode?: string;
  origins?: WebExperienceOrigins;
  roleArn?: string;
  identityProviderConfiguration?: (typeof IdentityProviderConfiguration)["Type"];
  authenticationConfiguration?: (typeof WebExperienceAuthConfiguration)["Type"];
  error?: ErrorDetail;
  browserExtensionConfiguration?: BrowserExtensionConfiguration;
  customizationConfiguration?: CustomizationConfiguration;
}
export const GetWebExperienceResponse = S.suspend(() =>
  S.Struct({
    applicationId: S.optional(S.String),
    webExperienceId: S.optional(S.String),
    webExperienceArn: S.optional(S.String),
    defaultEndpoint: S.optional(S.String),
    status: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    title: S.optional(S.String),
    subtitle: S.optional(S.String),
    welcomeMessage: S.optional(S.String),
    samplePromptsControlMode: S.optional(S.String),
    origins: S.optional(WebExperienceOrigins),
    roleArn: S.optional(S.String),
    identityProviderConfiguration: S.optional(IdentityProviderConfiguration),
    authenticationConfiguration: S.optional(WebExperienceAuthConfiguration),
    error: S.optional(ErrorDetail),
    browserExtensionConfiguration: S.optional(BrowserExtensionConfiguration),
    customizationConfiguration: S.optional(CustomizationConfiguration),
  }),
).annotations({
  identifier: "GetWebExperienceResponse",
}) as any as S.Schema<GetWebExperienceResponse>;
export type DocumentContent = { blob: Uint8Array } | { s3: S3 };
export const DocumentContent = S.Union(
  S.Struct({ blob: T.Blob }),
  S.Struct({ s3: S3 }),
);
export interface PluginConfiguration {
  pluginId: string;
}
export const PluginConfiguration = S.suspend(() =>
  S.Struct({ pluginId: S.String }),
).annotations({
  identifier: "PluginConfiguration",
}) as any as S.Schema<PluginConfiguration>;
export type ChatModeConfiguration = {
  pluginConfiguration: PluginConfiguration;
};
export const ChatModeConfiguration = S.Union(
  S.Struct({ pluginConfiguration: PluginConfiguration }),
);
export interface ConfigurationEvent {
  chatMode?: string;
  chatModeConfiguration?: (typeof ChatModeConfiguration)["Type"];
  attributeFilter?: AttributeFilter;
}
export const ConfigurationEvent = S.suspend(() =>
  S.Struct({
    chatMode: S.optional(S.String),
    chatModeConfiguration: S.optional(ChatModeConfiguration),
    attributeFilter: S.optional(AttributeFilter),
  }),
).annotations({
  identifier: "ConfigurationEvent",
}) as any as S.Schema<ConfigurationEvent>;
export interface TextInputEvent {
  userMessage: string;
}
export const TextInputEvent = S.suspend(() =>
  S.Struct({ userMessage: S.String }),
).annotations({
  identifier: "TextInputEvent",
}) as any as S.Schema<TextInputEvent>;
export interface ConversationSource {
  conversationId: string;
  attachmentId: string;
}
export const ConversationSource = S.suspend(() =>
  S.Struct({ conversationId: S.String, attachmentId: S.String }),
).annotations({
  identifier: "ConversationSource",
}) as any as S.Schema<ConversationSource>;
export type CopyFromSource = { conversation: ConversationSource };
export const CopyFromSource = S.Union(
  S.Struct({ conversation: ConversationSource }),
);
export interface AttachmentInput {
  data?: Uint8Array;
  name?: string;
  copyFrom?: (typeof CopyFromSource)["Type"];
}
export const AttachmentInput = S.suspend(() =>
  S.Struct({
    data: S.optional(T.Blob),
    name: S.optional(S.String),
    copyFrom: S.optional(CopyFromSource),
  }),
).annotations({
  identifier: "AttachmentInput",
}) as any as S.Schema<AttachmentInput>;
export interface AttachmentInputEvent {
  attachment?: AttachmentInput;
}
export const AttachmentInputEvent = S.suspend(() =>
  S.Struct({ attachment: S.optional(AttachmentInput) }),
).annotations({
  identifier: "AttachmentInputEvent",
}) as any as S.Schema<AttachmentInputEvent>;
export interface ActionExecutionPayloadField {
  value: any;
}
export const ActionExecutionPayloadField = S.suspend(() =>
  S.Struct({ value: S.Any }),
).annotations({
  identifier: "ActionExecutionPayloadField",
}) as any as S.Schema<ActionExecutionPayloadField>;
export type ActionExecutionPayload = {
  [key: string]: ActionExecutionPayloadField;
};
export const ActionExecutionPayload = S.Record({
  key: S.String,
  value: ActionExecutionPayloadField,
});
export interface ActionExecutionEvent {
  pluginId: string;
  payload: ActionExecutionPayload;
  payloadFieldNameSeparator: string;
}
export const ActionExecutionEvent = S.suspend(() =>
  S.Struct({
    pluginId: S.String,
    payload: ActionExecutionPayload,
    payloadFieldNameSeparator: S.String,
  }),
).annotations({
  identifier: "ActionExecutionEvent",
}) as any as S.Schema<ActionExecutionEvent>;
export type AuthorizationResponseMap = { [key: string]: string };
export const AuthorizationResponseMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface AuthChallengeResponseEvent {
  responseMap: AuthorizationResponseMap;
}
export const AuthChallengeResponseEvent = S.suspend(() =>
  S.Struct({ responseMap: AuthorizationResponseMap }),
).annotations({
  identifier: "AuthChallengeResponseEvent",
}) as any as S.Schema<AuthChallengeResponseEvent>;
export interface MemberGroup {
  groupName: string;
  type?: string;
}
export const MemberGroup = S.suspend(() =>
  S.Struct({ groupName: S.String, type: S.optional(S.String) }),
).annotations({ identifier: "MemberGroup" }) as any as S.Schema<MemberGroup>;
export type MemberGroups = MemberGroup[];
export const MemberGroups = S.Array(MemberGroup);
export interface MemberUser {
  userId: string;
  type?: string;
}
export const MemberUser = S.suspend(() =>
  S.Struct({ userId: S.String, type: S.optional(S.String) }),
).annotations({ identifier: "MemberUser" }) as any as S.Schema<MemberUser>;
export type MemberUsers = MemberUser[];
export const MemberUsers = S.Array(MemberUser);
export interface RetrieverContentSource {
  retrieverId: string;
}
export const RetrieverContentSource = S.suspend(() =>
  S.Struct({ retrieverId: S.String }),
).annotations({
  identifier: "RetrieverContentSource",
}) as any as S.Schema<RetrieverContentSource>;
export type UserIds = string[];
export const UserIds = S.Array(S.String);
export const ChatInputStream = T.InputEventStream(
  S.Union(
    S.Struct({ configurationEvent: ConfigurationEvent }),
    S.Struct({ textEvent: TextInputEvent }),
    S.Struct({ attachmentEvent: AttachmentInputEvent }),
    S.Struct({ actionExecutionEvent: ActionExecutionEvent }),
    S.Struct({ endOfInputEvent: EndOfInputEvent }),
    S.Struct({ authChallengeResponseEvent: AuthChallengeResponseEvent }),
  ),
);
export interface AuthChallengeResponse {
  responseMap: AuthorizationResponseMap;
}
export const AuthChallengeResponse = S.suspend(() =>
  S.Struct({ responseMap: AuthorizationResponseMap }),
).annotations({
  identifier: "AuthChallengeResponse",
}) as any as S.Schema<AuthChallengeResponse>;
export interface AssociatedGroup {
  name?: string;
  type?: string;
}
export const AssociatedGroup = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), type: S.optional(S.String) }),
).annotations({
  identifier: "AssociatedGroup",
}) as any as S.Schema<AssociatedGroup>;
export type AssociatedGroups = AssociatedGroup[];
export const AssociatedGroups = S.Array(AssociatedGroup);
export interface AssociatedUser {
  id?: string;
  type?: string;
}
export const AssociatedUser = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), type: S.optional(S.String) }),
).annotations({
  identifier: "AssociatedUser",
}) as any as S.Schema<AssociatedUser>;
export type AssociatedUsers = AssociatedUser[];
export const AssociatedUsers = S.Array(AssociatedUser);
export interface AppliedOrchestrationConfiguration {
  control: string;
}
export const AppliedOrchestrationConfiguration = S.suspend(() =>
  S.Struct({ control: S.String }),
).annotations({
  identifier: "AppliedOrchestrationConfiguration",
}) as any as S.Schema<AppliedOrchestrationConfiguration>;
export interface BlockedPhrasesConfiguration {
  blockedPhrases?: BlockedPhrases;
  systemMessageOverride?: string;
}
export const BlockedPhrasesConfiguration = S.suspend(() =>
  S.Struct({
    blockedPhrases: S.optional(BlockedPhrases),
    systemMessageOverride: S.optional(S.String),
  }),
).annotations({
  identifier: "BlockedPhrasesConfiguration",
}) as any as S.Schema<BlockedPhrasesConfiguration>;
export interface AppliedCreatorModeConfiguration {
  creatorModeControl: string;
}
export const AppliedCreatorModeConfiguration = S.suspend(() =>
  S.Struct({ creatorModeControl: S.String }),
).annotations({
  identifier: "AppliedCreatorModeConfiguration",
}) as any as S.Schema<AppliedCreatorModeConfiguration>;
export interface ChatResponseConfigurationDetail {
  responseConfigurations?: ResponseConfigurations;
  responseConfigurationSummary?: string;
  status?: string;
  error?: ErrorDetail;
  updatedAt?: Date;
}
export const ChatResponseConfigurationDetail = S.suspend(() =>
  S.Struct({
    responseConfigurations: S.optional(ResponseConfigurations),
    responseConfigurationSummary: S.optional(S.String),
    status: S.optional(S.String),
    error: S.optional(ErrorDetail),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ChatResponseConfigurationDetail",
}) as any as S.Schema<ChatResponseConfigurationDetail>;
export interface Attachment {
  attachmentId?: string;
  conversationId?: string;
  name?: string;
  copyFrom?: (typeof CopyFromSource)["Type"];
  fileType?: string;
  fileSize?: number;
  md5chksum?: string;
  createdAt?: Date;
  status?: string;
  error?: ErrorDetail;
}
export const Attachment = S.suspend(() =>
  S.Struct({
    attachmentId: S.optional(S.String),
    conversationId: S.optional(S.String),
    name: S.optional(S.String),
    copyFrom: S.optional(CopyFromSource),
    fileType: S.optional(S.String),
    fileSize: S.optional(S.Number),
    md5chksum: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    error: S.optional(ErrorDetail),
  }),
).annotations({ identifier: "Attachment" }) as any as S.Schema<Attachment>;
export type AttachmentList = Attachment[];
export const AttachmentList = S.Array(Attachment);
export interface ChatResponseConfiguration {
  chatResponseConfigurationId: string;
  chatResponseConfigurationArn: string;
  displayName: string;
  responseConfigurationSummary?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const ChatResponseConfiguration = S.suspend(() =>
  S.Struct({
    chatResponseConfigurationId: S.String,
    chatResponseConfigurationArn: S.String,
    displayName: S.String,
    responseConfigurationSummary: S.optional(S.String),
    status: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ChatResponseConfiguration",
}) as any as S.Schema<ChatResponseConfiguration>;
export type ChatResponseConfigurations = ChatResponseConfiguration[];
export const ChatResponseConfigurations = S.Array(ChatResponseConfiguration);
export interface Conversation {
  conversationId?: string;
  title?: string;
  startTime?: Date;
}
export const Conversation = S.suspend(() =>
  S.Struct({
    conversationId: S.optional(S.String),
    title: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Conversation" }) as any as S.Schema<Conversation>;
export type Conversations = Conversation[];
export const Conversations = S.Array(Conversation);
export interface DocumentDetails {
  documentId?: string;
  status?: string;
  error?: ErrorDetail;
  createdAt?: Date;
  updatedAt?: Date;
}
export const DocumentDetails = S.suspend(() =>
  S.Struct({
    documentId: S.optional(S.String),
    status: S.optional(S.String),
    error: S.optional(ErrorDetail),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DocumentDetails",
}) as any as S.Schema<DocumentDetails>;
export type DocumentDetailList = DocumentDetails[];
export const DocumentDetailList = S.Array(DocumentDetails);
export interface GroupSummary {
  groupName?: string;
}
export const GroupSummary = S.suspend(() =>
  S.Struct({ groupName: S.optional(S.String) }),
).annotations({ identifier: "GroupSummary" }) as any as S.Schema<GroupSummary>;
export type GroupSummaryList = GroupSummary[];
export const GroupSummaryList = S.Array(GroupSummary);
export interface PluginTypeMetadataSummary {
  type?: string;
  category?: string;
  description?: string;
}
export const PluginTypeMetadataSummary = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    category: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "PluginTypeMetadataSummary",
}) as any as S.Schema<PluginTypeMetadataSummary>;
export type ListPluginTypeMetadataSummaries = PluginTypeMetadataSummary[];
export const ListPluginTypeMetadataSummaries = S.Array(
  PluginTypeMetadataSummary,
);
export interface Subscription {
  subscriptionId?: string;
  subscriptionArn?: string;
  principal?: (typeof SubscriptionPrincipal)["Type"];
  currentSubscription?: SubscriptionDetails;
  nextSubscription?: SubscriptionDetails;
}
export const Subscription = S.suspend(() =>
  S.Struct({
    subscriptionId: S.optional(S.String),
    subscriptionArn: S.optional(S.String),
    principal: S.optional(SubscriptionPrincipal),
    currentSubscription: S.optional(SubscriptionDetails),
    nextSubscription: S.optional(SubscriptionDetails),
  }),
).annotations({ identifier: "Subscription" }) as any as S.Schema<Subscription>;
export type Subscriptions = Subscription[];
export const Subscriptions = S.Array(Subscription);
export interface GroupMembers {
  memberGroups?: MemberGroups;
  memberUsers?: MemberUsers;
  s3PathForGroupMembers?: S3;
}
export const GroupMembers = S.suspend(() =>
  S.Struct({
    memberGroups: S.optional(MemberGroups),
    memberUsers: S.optional(MemberUsers),
    s3PathForGroupMembers: S.optional(S3),
  }),
).annotations({ identifier: "GroupMembers" }) as any as S.Schema<GroupMembers>;
export type ContentSource = { retriever: RetrieverContentSource };
export const ContentSource = S.Union(
  S.Struct({ retriever: RetrieverContentSource }),
);
export interface AppliedAttachmentsConfiguration {
  attachmentsControlMode?: string;
}
export const AppliedAttachmentsConfiguration = S.suspend(() =>
  S.Struct({ attachmentsControlMode: S.optional(S.String) }),
).annotations({
  identifier: "AppliedAttachmentsConfiguration",
}) as any as S.Schema<AppliedAttachmentsConfiguration>;
export interface Application {
  displayName?: string;
  applicationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  identityType?: string;
  quickSightConfiguration?: QuickSightConfiguration;
}
export const Application = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    applicationId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    identityType: S.optional(S.String),
    quickSightConfiguration: S.optional(QuickSightConfiguration),
  }),
).annotations({ identifier: "Application" }) as any as S.Schema<Application>;
export type Applications = Application[];
export const Applications = S.Array(Application);
export interface DataAccessor {
  displayName?: string | Redacted.Redacted<string>;
  dataAccessorId?: string;
  dataAccessorArn?: string;
  idcApplicationArn?: string;
  principal?: string;
  authenticationDetail?: DataAccessorAuthenticationDetail;
  createdAt?: Date;
  updatedAt?: Date;
}
export const DataAccessor = S.suspend(() =>
  S.Struct({
    displayName: S.optional(SensitiveString),
    dataAccessorId: S.optional(S.String),
    dataAccessorArn: S.optional(S.String),
    idcApplicationArn: S.optional(S.String),
    principal: S.optional(S.String),
    authenticationDetail: S.optional(DataAccessorAuthenticationDetail),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "DataAccessor" }) as any as S.Schema<DataAccessor>;
export type DataAccessors = DataAccessor[];
export const DataAccessors = S.Array(DataAccessor);
export interface Index {
  displayName?: string;
  indexId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}
export const Index = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    indexId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
  }),
).annotations({ identifier: "Index" }) as any as S.Schema<Index>;
export type Indices = Index[];
export const Indices = S.Array(Index);
export interface DataSource {
  displayName?: string;
  dataSourceId?: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}
export const DataSource = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    dataSourceId: S.optional(S.String),
    type: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
  }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export type DataSources = DataSource[];
export const DataSources = S.Array(DataSource);
export interface Plugin {
  pluginId?: string;
  displayName?: string;
  type?: string;
  serverUrl?: string;
  state?: string;
  buildStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const Plugin = S.suspend(() =>
  S.Struct({
    pluginId: S.optional(S.String),
    displayName: S.optional(S.String),
    type: S.optional(S.String),
    serverUrl: S.optional(S.String),
    state: S.optional(S.String),
    buildStatus: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Plugin" }) as any as S.Schema<Plugin>;
export type Plugins = Plugin[];
export const Plugins = S.Array(Plugin);
export interface Retriever {
  applicationId?: string;
  retrieverId?: string;
  type?: string;
  status?: string;
  displayName?: string;
}
export const Retriever = S.suspend(() =>
  S.Struct({
    applicationId: S.optional(S.String),
    retrieverId: S.optional(S.String),
    type: S.optional(S.String),
    status: S.optional(S.String),
    displayName: S.optional(S.String),
  }),
).annotations({ identifier: "Retriever" }) as any as S.Schema<Retriever>;
export type Retrievers = Retriever[];
export const Retrievers = S.Array(Retriever);
export interface WebExperience {
  webExperienceId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  defaultEndpoint?: string;
  status?: string;
}
export const WebExperience = S.suspend(() =>
  S.Struct({
    webExperienceId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    defaultEndpoint: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "WebExperience",
}) as any as S.Schema<WebExperience>;
export type WebExperiences = WebExperience[];
export const WebExperiences = S.Array(WebExperience);
export interface UsersAndGroups {
  userIds?: UserIds;
  userGroups?: UserGroups;
}
export const UsersAndGroups = S.suspend(() =>
  S.Struct({
    userIds: S.optional(UserIds),
    userGroups: S.optional(UserGroups),
  }),
).annotations({
  identifier: "UsersAndGroups",
}) as any as S.Schema<UsersAndGroups>;
export interface AssociatePermissionResponse {
  statement?: string;
}
export const AssociatePermissionResponse = S.suspend(() =>
  S.Struct({ statement: S.optional(S.String) }),
).annotations({
  identifier: "AssociatePermissionResponse",
}) as any as S.Schema<AssociatePermissionResponse>;
export interface CancelSubscriptionResponse {
  subscriptionArn?: string;
  currentSubscription?: SubscriptionDetails;
  nextSubscription?: SubscriptionDetails;
}
export const CancelSubscriptionResponse = S.suspend(() =>
  S.Struct({
    subscriptionArn: S.optional(S.String),
    currentSubscription: S.optional(SubscriptionDetails),
    nextSubscription: S.optional(SubscriptionDetails),
  }),
).annotations({
  identifier: "CancelSubscriptionResponse",
}) as any as S.Schema<CancelSubscriptionResponse>;
export interface ChatInput {
  applicationId: string;
  userId?: string;
  userGroups?: UserGroups;
  conversationId?: string;
  parentMessageId?: string;
  clientToken?: string;
  inputStream?: (typeof ChatInputStream)["Type"];
}
export const ChatInput = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    userGroups: S.optional(UserGroups).pipe(T.HttpQuery("userGroups")),
    conversationId: S.optional(S.String).pipe(T.HttpQuery("conversationId")),
    parentMessageId: S.optional(S.String).pipe(T.HttpQuery("parentMessageId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    inputStream: S.optional(ChatInputStream).pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/conversations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "ChatInput" }) as any as S.Schema<ChatInput>;
export interface CreateSubscriptionResponse {
  subscriptionId?: string;
  subscriptionArn?: string;
  currentSubscription?: SubscriptionDetails;
  nextSubscription?: SubscriptionDetails;
}
export const CreateSubscriptionResponse = S.suspend(() =>
  S.Struct({
    subscriptionId: S.optional(S.String),
    subscriptionArn: S.optional(S.String),
    currentSubscription: S.optional(SubscriptionDetails),
    nextSubscription: S.optional(SubscriptionDetails),
  }),
).annotations({
  identifier: "CreateSubscriptionResponse",
}) as any as S.Schema<CreateSubscriptionResponse>;
export interface ContentBlockerRule {
  systemMessageOverride?: string;
}
export const ContentBlockerRule = S.suspend(() =>
  S.Struct({ systemMessageOverride: S.optional(S.String) }),
).annotations({
  identifier: "ContentBlockerRule",
}) as any as S.Schema<ContentBlockerRule>;
export interface EligibleDataSource {
  indexId?: string;
  dataSourceId?: string;
}
export const EligibleDataSource = S.suspend(() =>
  S.Struct({
    indexId: S.optional(S.String),
    dataSourceId: S.optional(S.String),
  }),
).annotations({
  identifier: "EligibleDataSource",
}) as any as S.Schema<EligibleDataSource>;
export type EligibleDataSources = EligibleDataSource[];
export const EligibleDataSources = S.Array(EligibleDataSource);
export interface ContentRetrievalRule {
  eligibleDataSources?: EligibleDataSources;
}
export const ContentRetrievalRule = S.suspend(() =>
  S.Struct({ eligibleDataSources: S.optional(EligibleDataSources) }),
).annotations({
  identifier: "ContentRetrievalRule",
}) as any as S.Schema<ContentRetrievalRule>;
export type RuleConfiguration =
  | { contentBlockerRule: ContentBlockerRule }
  | { contentRetrievalRule: ContentRetrievalRule };
export const RuleConfiguration = S.Union(
  S.Struct({ contentBlockerRule: ContentBlockerRule }),
  S.Struct({ contentRetrievalRule: ContentRetrievalRule }),
);
export interface Rule {
  includedUsersAndGroups?: UsersAndGroups;
  excludedUsersAndGroups?: UsersAndGroups;
  ruleType: string;
  ruleConfiguration?: (typeof RuleConfiguration)["Type"];
}
export const Rule = S.suspend(() =>
  S.Struct({
    includedUsersAndGroups: S.optional(UsersAndGroups),
    excludedUsersAndGroups: S.optional(UsersAndGroups),
    ruleType: S.String,
    ruleConfiguration: S.optional(RuleConfiguration),
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type Rules = Rule[];
export const Rules = S.Array(Rule);
export interface TopicConfiguration {
  name: string;
  description?: string;
  exampleChatMessages?: ExampleChatMessages;
  rules: Rules;
}
export const TopicConfiguration = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    exampleChatMessages: S.optional(ExampleChatMessages),
    rules: Rules,
  }),
).annotations({
  identifier: "TopicConfiguration",
}) as any as S.Schema<TopicConfiguration>;
export type TopicConfigurations = TopicConfiguration[];
export const TopicConfigurations = S.Array(TopicConfiguration);
export interface GetChatControlsConfigurationResponse {
  responseScope?: string;
  orchestrationConfiguration?: AppliedOrchestrationConfiguration;
  blockedPhrases?: BlockedPhrasesConfiguration;
  topicConfigurations?: TopicConfigurations;
  creatorModeConfiguration?: AppliedCreatorModeConfiguration;
  nextToken?: string;
  hallucinationReductionConfiguration?: HallucinationReductionConfiguration;
}
export const GetChatControlsConfigurationResponse = S.suspend(() =>
  S.Struct({
    responseScope: S.optional(S.String),
    orchestrationConfiguration: S.optional(AppliedOrchestrationConfiguration),
    blockedPhrases: S.optional(BlockedPhrasesConfiguration),
    topicConfigurations: S.optional(TopicConfigurations),
    creatorModeConfiguration: S.optional(AppliedCreatorModeConfiguration),
    nextToken: S.optional(S.String),
    hallucinationReductionConfiguration: S.optional(
      HallucinationReductionConfiguration,
    ),
  }),
).annotations({
  identifier: "GetChatControlsConfigurationResponse",
}) as any as S.Schema<GetChatControlsConfigurationResponse>;
export interface GetChatResponseConfigurationResponse {
  chatResponseConfigurationId?: string;
  chatResponseConfigurationArn?: string;
  displayName?: string;
  createdAt?: Date;
  inUseConfiguration?: ChatResponseConfigurationDetail;
  lastUpdateConfiguration?: ChatResponseConfigurationDetail;
}
export const GetChatResponseConfigurationResponse = S.suspend(() =>
  S.Struct({
    chatResponseConfigurationId: S.optional(S.String),
    chatResponseConfigurationArn: S.optional(S.String),
    displayName: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    inUseConfiguration: S.optional(ChatResponseConfigurationDetail),
    lastUpdateConfiguration: S.optional(ChatResponseConfigurationDetail),
  }),
).annotations({
  identifier: "GetChatResponseConfigurationResponse",
}) as any as S.Schema<GetChatResponseConfigurationResponse>;
export interface GetGroupResponse {
  status?: GroupStatusDetail;
  statusHistory?: GroupStatusDetails;
}
export const GetGroupResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(GroupStatusDetail),
    statusHistory: S.optional(GroupStatusDetails),
  }),
).annotations({
  identifier: "GetGroupResponse",
}) as any as S.Schema<GetGroupResponse>;
export interface ListAttachmentsResponse {
  attachments?: AttachmentList;
  nextToken?: string;
}
export const ListAttachmentsResponse = S.suspend(() =>
  S.Struct({
    attachments: S.optional(AttachmentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAttachmentsResponse",
}) as any as S.Schema<ListAttachmentsResponse>;
export interface ListChatResponseConfigurationsResponse {
  chatResponseConfigurations?: ChatResponseConfigurations;
  nextToken?: string;
}
export const ListChatResponseConfigurationsResponse = S.suspend(() =>
  S.Struct({
    chatResponseConfigurations: S.optional(ChatResponseConfigurations),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChatResponseConfigurationsResponse",
}) as any as S.Schema<ListChatResponseConfigurationsResponse>;
export interface ListConversationsResponse {
  nextToken?: string;
  conversations?: Conversations;
}
export const ListConversationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    conversations: S.optional(Conversations),
  }),
).annotations({
  identifier: "ListConversationsResponse",
}) as any as S.Schema<ListConversationsResponse>;
export interface ListDocumentsResponse {
  documentDetailList?: DocumentDetailList;
  nextToken?: string;
}
export const ListDocumentsResponse = S.suspend(() =>
  S.Struct({
    documentDetailList: S.optional(DocumentDetailList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDocumentsResponse",
}) as any as S.Schema<ListDocumentsResponse>;
export interface ListGroupsResponse {
  nextToken?: string;
  items?: GroupSummaryList;
}
export const ListGroupsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(GroupSummaryList),
  }),
).annotations({
  identifier: "ListGroupsResponse",
}) as any as S.Schema<ListGroupsResponse>;
export interface ListPluginActionsResponse {
  nextToken?: string;
  items?: Actions;
}
export const ListPluginActionsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), items: S.optional(Actions) }),
).annotations({
  identifier: "ListPluginActionsResponse",
}) as any as S.Schema<ListPluginActionsResponse>;
export interface ListPluginTypeMetadataResponse {
  nextToken?: string;
  items?: ListPluginTypeMetadataSummaries;
}
export const ListPluginTypeMetadataResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(ListPluginTypeMetadataSummaries),
  }),
).annotations({
  identifier: "ListPluginTypeMetadataResponse",
}) as any as S.Schema<ListPluginTypeMetadataResponse>;
export interface ListSubscriptionsResponse {
  nextToken?: string;
  subscriptions?: Subscriptions;
}
export const ListSubscriptionsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    subscriptions: S.optional(Subscriptions),
  }),
).annotations({
  identifier: "ListSubscriptionsResponse",
}) as any as S.Schema<ListSubscriptionsResponse>;
export interface PutGroupRequest {
  applicationId: string;
  indexId: string;
  groupName: string;
  dataSourceId?: string;
  type: string;
  groupMembers: GroupMembers;
  roleArn?: string;
}
export const PutGroupRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    groupName: S.String,
    dataSourceId: S.optional(S.String),
    type: S.String,
    groupMembers: GroupMembers,
    roleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/indices/{indexId}/groups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutGroupRequest",
}) as any as S.Schema<PutGroupRequest>;
export interface PutGroupResponse {}
export const PutGroupResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutGroupResponse",
}) as any as S.Schema<PutGroupResponse>;
export interface SearchRelevantContentRequest {
  applicationId: string;
  queryText: string;
  contentSource: (typeof ContentSource)["Type"];
  attributeFilter?: AttributeFilter;
  maxResults?: number;
  nextToken?: string;
}
export const SearchRelevantContentRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    queryText: S.String,
    contentSource: ContentSource,
    attributeFilter: S.optional(AttributeFilter),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/relevant-content",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchRelevantContentRequest",
}) as any as S.Schema<SearchRelevantContentRequest>;
export interface CreateApplicationResponse {
  applicationId?: string;
  applicationArn?: string;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({
    applicationId: S.optional(S.String),
    applicationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface GetApplicationResponse {
  displayName?: string;
  applicationId?: string;
  applicationArn?: string;
  identityType?: string;
  iamIdentityProviderArn?: string;
  identityCenterApplicationArn?: string;
  roleArn?: string;
  status?: string;
  description?: string;
  encryptionConfiguration?: EncryptionConfiguration;
  createdAt?: Date;
  updatedAt?: Date;
  error?: ErrorDetail;
  attachmentsConfiguration?: AppliedAttachmentsConfiguration;
  qAppsConfiguration?: QAppsConfiguration;
  personalizationConfiguration?: PersonalizationConfiguration;
  autoSubscriptionConfiguration?: AutoSubscriptionConfiguration;
  clientIdsForOIDC?: ClientIdsForOIDC;
  quickSightConfiguration?: QuickSightConfiguration;
}
export const GetApplicationResponse = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    applicationId: S.optional(S.String),
    applicationArn: S.optional(S.String),
    identityType: S.optional(S.String),
    iamIdentityProviderArn: S.optional(S.String),
    identityCenterApplicationArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    status: S.optional(S.String),
    description: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    error: S.optional(ErrorDetail),
    attachmentsConfiguration: S.optional(AppliedAttachmentsConfiguration),
    qAppsConfiguration: S.optional(QAppsConfiguration),
    personalizationConfiguration: S.optional(PersonalizationConfiguration),
    autoSubscriptionConfiguration: S.optional(AutoSubscriptionConfiguration),
    clientIdsForOIDC: S.optional(ClientIdsForOIDC),
    quickSightConfiguration: S.optional(QuickSightConfiguration),
  }),
).annotations({
  identifier: "GetApplicationResponse",
}) as any as S.Schema<GetApplicationResponse>;
export interface ListApplicationsResponse {
  nextToken?: string;
  applications?: Applications;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    applications: S.optional(Applications),
  }),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface ListDataAccessorsResponse {
  dataAccessors?: DataAccessors;
  nextToken?: string;
}
export const ListDataAccessorsResponse = S.suspend(() =>
  S.Struct({
    dataAccessors: S.optional(DataAccessors),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataAccessorsResponse",
}) as any as S.Schema<ListDataAccessorsResponse>;
export interface CreateIndexResponse {
  indexId?: string;
  indexArn?: string;
}
export const CreateIndexResponse = S.suspend(() =>
  S.Struct({ indexId: S.optional(S.String), indexArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateIndexResponse",
}) as any as S.Schema<CreateIndexResponse>;
export interface ListIndicesResponse {
  nextToken?: string;
  indices?: Indices;
}
export const ListIndicesResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), indices: S.optional(Indices) }),
).annotations({
  identifier: "ListIndicesResponse",
}) as any as S.Schema<ListIndicesResponse>;
export interface ListDataSourcesResponse {
  dataSources?: DataSources;
  nextToken?: string;
}
export const ListDataSourcesResponse = S.suspend(() =>
  S.Struct({
    dataSources: S.optional(DataSources),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataSourcesResponse",
}) as any as S.Schema<ListDataSourcesResponse>;
export interface CreatePluginRequest {
  applicationId: string;
  displayName: string;
  type: string;
  authConfiguration: (typeof PluginAuthConfiguration)["Type"];
  serverUrl?: string;
  customPluginConfiguration?: CustomPluginConfiguration;
  tags?: Tags;
  clientToken?: string;
}
export const CreatePluginRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    displayName: S.String,
    type: S.String,
    authConfiguration: PluginAuthConfiguration,
    serverUrl: S.optional(S.String),
    customPluginConfiguration: S.optional(CustomPluginConfiguration),
    tags: S.optional(Tags),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications/{applicationId}/plugins" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePluginRequest",
}) as any as S.Schema<CreatePluginRequest>;
export interface ListPluginsResponse {
  nextToken?: string;
  plugins?: Plugins;
}
export const ListPluginsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), plugins: S.optional(Plugins) }),
).annotations({
  identifier: "ListPluginsResponse",
}) as any as S.Schema<ListPluginsResponse>;
export interface ListRetrieversResponse {
  retrievers?: Retrievers;
  nextToken?: string;
}
export const ListRetrieversResponse = S.suspend(() =>
  S.Struct({
    retrievers: S.optional(Retrievers),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRetrieversResponse",
}) as any as S.Schema<ListRetrieversResponse>;
export interface CreateWebExperienceRequest {
  applicationId: string;
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;
  samplePromptsControlMode?: string;
  origins?: WebExperienceOrigins;
  roleArn?: string;
  tags?: Tags;
  clientToken?: string;
  identityProviderConfiguration?: (typeof IdentityProviderConfiguration)["Type"];
  browserExtensionConfiguration?: BrowserExtensionConfiguration;
  customizationConfiguration?: CustomizationConfiguration;
}
export const CreateWebExperienceRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    title: S.optional(S.String),
    subtitle: S.optional(S.String),
    welcomeMessage: S.optional(S.String),
    samplePromptsControlMode: S.optional(S.String),
    origins: S.optional(WebExperienceOrigins),
    roleArn: S.optional(S.String),
    tags: S.optional(Tags),
    clientToken: S.optional(S.String),
    identityProviderConfiguration: S.optional(IdentityProviderConfiguration),
    browserExtensionConfiguration: S.optional(BrowserExtensionConfiguration),
    customizationConfiguration: S.optional(CustomizationConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/experiences",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWebExperienceRequest",
}) as any as S.Schema<CreateWebExperienceRequest>;
export interface UpdateWebExperienceRequest {
  applicationId: string;
  webExperienceId: string;
  roleArn?: string;
  authenticationConfiguration?: (typeof WebExperienceAuthConfiguration)["Type"];
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;
  samplePromptsControlMode?: string;
  identityProviderConfiguration?: (typeof IdentityProviderConfiguration)["Type"];
  origins?: WebExperienceOrigins;
  browserExtensionConfiguration?: BrowserExtensionConfiguration;
  customizationConfiguration?: CustomizationConfiguration;
}
export const UpdateWebExperienceRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    webExperienceId: S.String.pipe(T.HttpLabel("webExperienceId")),
    roleArn: S.optional(S.String),
    authenticationConfiguration: S.optional(WebExperienceAuthConfiguration),
    title: S.optional(S.String),
    subtitle: S.optional(S.String),
    welcomeMessage: S.optional(S.String),
    samplePromptsControlMode: S.optional(S.String),
    identityProviderConfiguration: S.optional(IdentityProviderConfiguration),
    origins: S.optional(WebExperienceOrigins),
    browserExtensionConfiguration: S.optional(BrowserExtensionConfiguration),
    customizationConfiguration: S.optional(CustomizationConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{applicationId}/experiences/{webExperienceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWebExperienceRequest",
}) as any as S.Schema<UpdateWebExperienceRequest>;
export interface UpdateWebExperienceResponse {}
export const UpdateWebExperienceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateWebExperienceResponse",
}) as any as S.Schema<UpdateWebExperienceResponse>;
export interface ListWebExperiencesResponse {
  webExperiences?: WebExperiences;
  nextToken?: string;
}
export const ListWebExperiencesResponse = S.suspend(() =>
  S.Struct({
    webExperiences: S.optional(WebExperiences),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWebExperiencesResponse",
}) as any as S.Schema<ListWebExperiencesResponse>;
export type DocumentAttributes = DocumentAttribute[];
export const DocumentAttributes = S.Array(DocumentAttribute);
export interface DataSourceSyncJobMetrics {
  documentsAdded?: string;
  documentsModified?: string;
  documentsDeleted?: string;
  documentsFailed?: string;
  documentsScanned?: string;
}
export const DataSourceSyncJobMetrics = S.suspend(() =>
  S.Struct({
    documentsAdded: S.optional(S.String),
    documentsModified: S.optional(S.String),
    documentsDeleted: S.optional(S.String),
    documentsFailed: S.optional(S.String),
    documentsScanned: S.optional(S.String),
  }),
).annotations({
  identifier: "DataSourceSyncJobMetrics",
}) as any as S.Schema<DataSourceSyncJobMetrics>;
export interface AttachmentOutput {
  name?: string;
  status?: string;
  error?: ErrorDetail;
  attachmentId?: string;
  conversationId?: string;
}
export const AttachmentOutput = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    status: S.optional(S.String),
    error: S.optional(ErrorDetail),
    attachmentId: S.optional(S.String),
    conversationId: S.optional(S.String),
  }),
).annotations({
  identifier: "AttachmentOutput",
}) as any as S.Schema<AttachmentOutput>;
export type AttachmentsOutput = AttachmentOutput[];
export const AttachmentsOutput = S.Array(AttachmentOutput);
export interface TextDocumentStatistics {
  indexedTextBytes?: number;
  indexedTextDocumentCount?: number;
}
export const TextDocumentStatistics = S.suspend(() =>
  S.Struct({
    indexedTextBytes: S.optional(S.Number),
    indexedTextDocumentCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "TextDocumentStatistics",
}) as any as S.Schema<TextDocumentStatistics>;
export interface FailedDocument {
  id?: string;
  error?: ErrorDetail;
  dataSourceId?: string;
}
export const FailedDocument = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    error: S.optional(ErrorDetail),
    dataSourceId: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedDocument",
}) as any as S.Schema<FailedDocument>;
export type FailedDocuments = FailedDocument[];
export const FailedDocuments = S.Array(FailedDocument);
export type AttachmentsInput = AttachmentInput[];
export const AttachmentsInput = S.Array(AttachmentInput);
export interface ActionExecution {
  pluginId: string;
  payload: ActionExecutionPayload;
  payloadFieldNameSeparator: string;
}
export const ActionExecution = S.suspend(() =>
  S.Struct({
    pluginId: S.String,
    payload: ActionExecutionPayload,
    payloadFieldNameSeparator: S.String,
  }),
).annotations({
  identifier: "ActionExecution",
}) as any as S.Schema<ActionExecution>;
export interface DataSourceSyncJob {
  executionId?: string;
  startTime?: Date;
  endTime?: Date;
  status?: string;
  error?: ErrorDetail;
  dataSourceErrorCode?: string;
  metrics?: DataSourceSyncJobMetrics;
}
export const DataSourceSyncJob = S.suspend(() =>
  S.Struct({
    executionId: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    error: S.optional(ErrorDetail),
    dataSourceErrorCode: S.optional(S.String),
    metrics: S.optional(DataSourceSyncJobMetrics),
  }),
).annotations({
  identifier: "DataSourceSyncJob",
}) as any as S.Schema<DataSourceSyncJob>;
export type DataSourceSyncJobs = DataSourceSyncJob[];
export const DataSourceSyncJobs = S.Array(DataSourceSyncJob);
export interface IndexStatistics {
  textDocumentStatistics?: TextDocumentStatistics;
}
export const IndexStatistics = S.suspend(() =>
  S.Struct({ textDocumentStatistics: S.optional(TextDocumentStatistics) }),
).annotations({
  identifier: "IndexStatistics",
}) as any as S.Schema<IndexStatistics>;
export interface BatchDeleteDocumentResponse {
  failedDocuments?: FailedDocuments;
}
export const BatchDeleteDocumentResponse = S.suspend(() =>
  S.Struct({ failedDocuments: S.optional(FailedDocuments) }),
).annotations({
  identifier: "BatchDeleteDocumentResponse",
}) as any as S.Schema<BatchDeleteDocumentResponse>;
export interface PrincipalUser {
  id?: string;
  access: string;
  membershipType?: string;
}
export const PrincipalUser = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    access: S.String,
    membershipType: S.optional(S.String),
  }),
).annotations({
  identifier: "PrincipalUser",
}) as any as S.Schema<PrincipalUser>;
export interface PrincipalGroup {
  name?: string;
  access: string;
  membershipType?: string;
}
export const PrincipalGroup = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    access: S.String,
    membershipType: S.optional(S.String),
  }),
).annotations({
  identifier: "PrincipalGroup",
}) as any as S.Schema<PrincipalGroup>;
export interface ChatSyncInput {
  applicationId: string;
  userId?: string;
  userGroups?: UserGroups;
  userMessage?: string;
  attachments?: AttachmentsInput;
  actionExecution?: ActionExecution;
  authChallengeResponse?: AuthChallengeResponse;
  conversationId?: string;
  parentMessageId?: string;
  attributeFilter?: AttributeFilter;
  chatMode?: string;
  chatModeConfiguration?: (typeof ChatModeConfiguration)["Type"];
  clientToken?: string;
}
export const ChatSyncInput = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    userId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    userGroups: S.optional(UserGroups).pipe(T.HttpQuery("userGroups")),
    userMessage: S.optional(S.String),
    attachments: S.optional(AttachmentsInput),
    actionExecution: S.optional(ActionExecution),
    authChallengeResponse: S.optional(AuthChallengeResponse),
    conversationId: S.optional(S.String),
    parentMessageId: S.optional(S.String),
    attributeFilter: S.optional(AttributeFilter),
    chatMode: S.optional(S.String),
    chatModeConfiguration: S.optional(ChatModeConfiguration),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/conversations?sync",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ChatSyncInput",
}) as any as S.Schema<ChatSyncInput>;
export interface CreateChatResponseConfigurationRequest {
  applicationId: string;
  displayName: string;
  clientToken?: string;
  responseConfigurations: ResponseConfigurations;
  tags?: Tags;
}
export const CreateChatResponseConfigurationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    displayName: S.String,
    clientToken: S.optional(S.String),
    responseConfigurations: ResponseConfigurations,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/chatresponseconfigurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChatResponseConfigurationRequest",
}) as any as S.Schema<CreateChatResponseConfigurationRequest>;
export interface ListDataSourceSyncJobsResponse {
  history?: DataSourceSyncJobs;
  nextToken?: string;
}
export const ListDataSourceSyncJobsResponse = S.suspend(() =>
  S.Struct({
    history: S.optional(DataSourceSyncJobs),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataSourceSyncJobsResponse",
}) as any as S.Schema<ListDataSourceSyncJobsResponse>;
export interface CreateDataAccessorRequest {
  applicationId: string;
  principal: string;
  actionConfigurations: ActionConfigurationList;
  clientToken?: string;
  displayName: string | Redacted.Redacted<string>;
  authenticationDetail?: DataAccessorAuthenticationDetail;
  tags?: Tags;
}
export const CreateDataAccessorRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    principal: S.String,
    actionConfigurations: ActionConfigurationList,
    clientToken: S.optional(S.String),
    displayName: SensitiveString,
    authenticationDetail: S.optional(DataAccessorAuthenticationDetail),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/dataaccessors",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataAccessorRequest",
}) as any as S.Schema<CreateDataAccessorRequest>;
export interface GetIndexResponse {
  applicationId?: string;
  indexId?: string;
  displayName?: string;
  indexArn?: string;
  status?: string;
  type?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  capacityConfiguration?: IndexCapacityConfiguration;
  documentAttributeConfigurations?: DocumentAttributeConfigurations;
  error?: ErrorDetail;
  indexStatistics?: IndexStatistics;
}
export const GetIndexResponse = S.suspend(() =>
  S.Struct({
    applicationId: S.optional(S.String),
    indexId: S.optional(S.String),
    displayName: S.optional(S.String),
    indexArn: S.optional(S.String),
    status: S.optional(S.String),
    type: S.optional(S.String),
    description: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    capacityConfiguration: S.optional(IndexCapacityConfiguration),
    documentAttributeConfigurations: S.optional(
      DocumentAttributeConfigurations,
    ),
    error: S.optional(ErrorDetail),
    indexStatistics: S.optional(IndexStatistics),
  }),
).annotations({
  identifier: "GetIndexResponse",
}) as any as S.Schema<GetIndexResponse>;
export interface CreateDataSourceRequest {
  applicationId: string;
  indexId: string;
  displayName: string;
  configuration: any;
  vpcConfiguration?: DataSourceVpcConfiguration;
  description?: string;
  tags?: Tags;
  syncSchedule?: string;
  roleArn?: string;
  clientToken?: string;
  documentEnrichmentConfiguration?: DocumentEnrichmentConfiguration;
  mediaExtractionConfiguration?: MediaExtractionConfiguration;
}
export const CreateDataSourceRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    displayName: S.String,
    configuration: S.Any,
    vpcConfiguration: S.optional(DataSourceVpcConfiguration),
    description: S.optional(S.String),
    tags: S.optional(Tags),
    syncSchedule: S.optional(S.String),
    roleArn: S.optional(S.String),
    clientToken: S.optional(S.String),
    documentEnrichmentConfiguration: S.optional(
      DocumentEnrichmentConfiguration,
    ),
    mediaExtractionConfiguration: S.optional(MediaExtractionConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/indices/{indexId}/datasources",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataSourceRequest",
}) as any as S.Schema<CreateDataSourceRequest>;
export interface CreatePluginResponse {
  pluginId?: string;
  pluginArn?: string;
  buildStatus?: string;
}
export const CreatePluginResponse = S.suspend(() =>
  S.Struct({
    pluginId: S.optional(S.String),
    pluginArn: S.optional(S.String),
    buildStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "CreatePluginResponse",
}) as any as S.Schema<CreatePluginResponse>;
export interface CreateWebExperienceResponse {
  webExperienceId?: string;
  webExperienceArn?: string;
}
export const CreateWebExperienceResponse = S.suspend(() =>
  S.Struct({
    webExperienceId: S.optional(S.String),
    webExperienceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateWebExperienceResponse",
}) as any as S.Schema<CreateWebExperienceResponse>;
export type Principal = { user: PrincipalUser } | { group: PrincipalGroup };
export const Principal = S.Union(
  S.Struct({ user: PrincipalUser }),
  S.Struct({ group: PrincipalGroup }),
);
export type Principals = (typeof Principal)["Type"][];
export const Principals = S.Array(Principal);
export interface DocumentAclUser {
  id?: string;
  type?: string;
}
export const DocumentAclUser = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), type: S.optional(S.String) }),
).annotations({
  identifier: "DocumentAclUser",
}) as any as S.Schema<DocumentAclUser>;
export type DocumentAclUsers = DocumentAclUser[];
export const DocumentAclUsers = S.Array(DocumentAclUser);
export interface DocumentAclGroup {
  name?: string;
  type?: string;
}
export const DocumentAclGroup = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), type: S.optional(S.String) }),
).annotations({
  identifier: "DocumentAclGroup",
}) as any as S.Schema<DocumentAclGroup>;
export type DocumentAclGroups = DocumentAclGroup[];
export const DocumentAclGroups = S.Array(DocumentAclGroup);
export interface SnippetExcerpt {
  text?: string;
}
export const SnippetExcerpt = S.suspend(() =>
  S.Struct({ text: S.optional(S.String) }),
).annotations({
  identifier: "SnippetExcerpt",
}) as any as S.Schema<SnippetExcerpt>;
export interface AccessControl {
  principals: Principals;
  memberRelation?: string;
}
export const AccessControl = S.suspend(() =>
  S.Struct({ principals: Principals, memberRelation: S.optional(S.String) }),
).annotations({
  identifier: "AccessControl",
}) as any as S.Schema<AccessControl>;
export type AccessControls = AccessControl[];
export const AccessControls = S.Array(AccessControl);
export interface DocumentAclCondition {
  memberRelation?: string;
  users?: DocumentAclUsers;
  groups?: DocumentAclGroups;
}
export const DocumentAclCondition = S.suspend(() =>
  S.Struct({
    memberRelation: S.optional(S.String),
    users: S.optional(DocumentAclUsers),
    groups: S.optional(DocumentAclGroups),
  }),
).annotations({
  identifier: "DocumentAclCondition",
}) as any as S.Schema<DocumentAclCondition>;
export type DocumentAclConditions = DocumentAclCondition[];
export const DocumentAclConditions = S.Array(DocumentAclCondition);
export interface CreateChatResponseConfigurationResponse {
  chatResponseConfigurationId: string;
  chatResponseConfigurationArn: string;
}
export const CreateChatResponseConfigurationResponse = S.suspend(() =>
  S.Struct({
    chatResponseConfigurationId: S.String,
    chatResponseConfigurationArn: S.String,
  }),
).annotations({
  identifier: "CreateChatResponseConfigurationResponse",
}) as any as S.Schema<CreateChatResponseConfigurationResponse>;
export interface ImageSourceDetails {
  mediaId?: string;
  mediaMimeType?: string;
}
export const ImageSourceDetails = S.suspend(() =>
  S.Struct({
    mediaId: S.optional(S.String),
    mediaMimeType: S.optional(S.String),
  }),
).annotations({
  identifier: "ImageSourceDetails",
}) as any as S.Schema<ImageSourceDetails>;
export interface AudioSourceDetails {
  mediaId?: string;
  mediaMimeType?: string;
  startTimeMilliseconds?: number;
  endTimeMilliseconds?: number;
  audioExtractionType?: string;
}
export const AudioSourceDetails = S.suspend(() =>
  S.Struct({
    mediaId: S.optional(S.String),
    mediaMimeType: S.optional(S.String),
    startTimeMilliseconds: S.optional(S.Number),
    endTimeMilliseconds: S.optional(S.Number),
    audioExtractionType: S.optional(S.String),
  }),
).annotations({
  identifier: "AudioSourceDetails",
}) as any as S.Schema<AudioSourceDetails>;
export interface VideoSourceDetails {
  mediaId?: string;
  mediaMimeType?: string;
  startTimeMilliseconds?: number;
  endTimeMilliseconds?: number;
  videoExtractionType?: string;
}
export const VideoSourceDetails = S.suspend(() =>
  S.Struct({
    mediaId: S.optional(S.String),
    mediaMimeType: S.optional(S.String),
    startTimeMilliseconds: S.optional(S.Number),
    endTimeMilliseconds: S.optional(S.Number),
    videoExtractionType: S.optional(S.String),
  }),
).annotations({
  identifier: "VideoSourceDetails",
}) as any as S.Schema<VideoSourceDetails>;
export interface ActionReviewPayloadFieldAllowedValue {
  value?: any;
  displayValue?: any;
}
export const ActionReviewPayloadFieldAllowedValue = S.suspend(() =>
  S.Struct({ value: S.optional(S.Any), displayValue: S.optional(S.Any) }),
).annotations({
  identifier: "ActionReviewPayloadFieldAllowedValue",
}) as any as S.Schema<ActionReviewPayloadFieldAllowedValue>;
export type ActionReviewPayloadFieldAllowedValues =
  ActionReviewPayloadFieldAllowedValue[];
export const ActionReviewPayloadFieldAllowedValues = S.Array(
  ActionReviewPayloadFieldAllowedValue,
);
export interface CreateDataAccessorResponse {
  dataAccessorId: string;
  idcApplicationArn: string;
  dataAccessorArn: string;
}
export const CreateDataAccessorResponse = S.suspend(() =>
  S.Struct({
    dataAccessorId: S.String,
    idcApplicationArn: S.String,
    dataAccessorArn: S.String,
  }),
).annotations({
  identifier: "CreateDataAccessorResponse",
}) as any as S.Schema<CreateDataAccessorResponse>;
export interface CreateDataSourceResponse {
  dataSourceId?: string;
  dataSourceArn?: string;
}
export const CreateDataSourceResponse = S.suspend(() =>
  S.Struct({
    dataSourceId: S.optional(S.String),
    dataSourceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDataSourceResponse",
}) as any as S.Schema<CreateDataSourceResponse>;
export interface AccessConfiguration {
  accessControls: AccessControls;
  memberRelation?: string;
}
export const AccessConfiguration = S.suspend(() =>
  S.Struct({
    accessControls: AccessControls,
    memberRelation: S.optional(S.String),
  }),
).annotations({
  identifier: "AccessConfiguration",
}) as any as S.Schema<AccessConfiguration>;
export interface TextOutputEvent {
  systemMessageType?: string;
  conversationId?: string;
  userMessageId?: string;
  systemMessageId?: string;
  systemMessage?: string;
}
export const TextOutputEvent = S.suspend(() =>
  S.Struct({
    systemMessageType: S.optional(S.String),
    conversationId: S.optional(S.String),
    userMessageId: S.optional(S.String),
    systemMessageId: S.optional(S.String),
    systemMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "TextOutputEvent",
}) as any as S.Schema<TextOutputEvent>;
export type SourceDetails =
  | { imageSourceDetails: ImageSourceDetails }
  | { audioSourceDetails: AudioSourceDetails }
  | { videoSourceDetails: VideoSourceDetails };
export const SourceDetails = S.Union(
  S.Struct({ imageSourceDetails: ImageSourceDetails }),
  S.Struct({ audioSourceDetails: AudioSourceDetails }),
  S.Struct({ videoSourceDetails: VideoSourceDetails }),
);
export interface TextSegment {
  beginOffset?: number;
  endOffset?: number;
  snippetExcerpt?: SnippetExcerpt;
  mediaId?: string;
  mediaMimeType?: string;
  sourceDetails?: (typeof SourceDetails)["Type"];
}
export const TextSegment = S.suspend(() =>
  S.Struct({
    beginOffset: S.optional(S.Number),
    endOffset: S.optional(S.Number),
    snippetExcerpt: S.optional(SnippetExcerpt),
    mediaId: S.optional(S.String),
    mediaMimeType: S.optional(S.String),
    sourceDetails: S.optional(SourceDetails),
  }),
).annotations({ identifier: "TextSegment" }) as any as S.Schema<TextSegment>;
export type TextSegmentList = TextSegment[];
export const TextSegmentList = S.Array(TextSegment);
export interface SourceAttribution {
  title?: string;
  snippet?: string;
  url?: string;
  citationNumber?: number;
  updatedAt?: Date;
  textMessageSegments?: TextSegmentList;
  documentId?: string;
  indexId?: string;
  datasourceId?: string;
}
export const SourceAttribution = S.suspend(() =>
  S.Struct({
    title: S.optional(S.String),
    snippet: S.optional(S.String),
    url: S.optional(S.String),
    citationNumber: S.optional(S.Number),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    textMessageSegments: S.optional(TextSegmentList),
    documentId: S.optional(S.String),
    indexId: S.optional(S.String),
    datasourceId: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceAttribution",
}) as any as S.Schema<SourceAttribution>;
export type SourceAttributions = SourceAttribution[];
export const SourceAttributions = S.Array(SourceAttribution).pipe(T.Sparse());
export interface MetadataEvent {
  conversationId?: string;
  userMessageId?: string;
  systemMessageId?: string;
  sourceAttributions?: SourceAttributions;
  finalTextMessage?: string;
}
export const MetadataEvent = S.suspend(() =>
  S.Struct({
    conversationId: S.optional(S.String),
    userMessageId: S.optional(S.String),
    systemMessageId: S.optional(S.String),
    sourceAttributions: S.optional(SourceAttributions),
    finalTextMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "MetadataEvent",
}) as any as S.Schema<MetadataEvent>;
export interface ActionReviewPayloadField {
  displayName?: string;
  displayOrder?: number;
  displayDescription?: string;
  type?: string;
  value?: any;
  allowedValues?: ActionReviewPayloadFieldAllowedValues;
  allowedFormat?: string;
  arrayItemJsonSchema?: any;
  required?: boolean;
}
export const ActionReviewPayloadField = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    displayOrder: S.optional(S.Number),
    displayDescription: S.optional(S.String),
    type: S.optional(S.String),
    value: S.optional(S.Any),
    allowedValues: S.optional(ActionReviewPayloadFieldAllowedValues),
    allowedFormat: S.optional(S.String),
    arrayItemJsonSchema: S.optional(S.Any),
    required: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ActionReviewPayloadField",
}) as any as S.Schema<ActionReviewPayloadField>;
export type ActionReviewPayload = { [key: string]: ActionReviewPayloadField };
export const ActionReviewPayload = S.Record({
  key: S.String,
  value: ActionReviewPayloadField,
});
export interface ActionReviewEvent {
  conversationId?: string;
  userMessageId?: string;
  systemMessageId?: string;
  pluginId?: string;
  pluginType?: string;
  payload?: ActionReviewPayload;
  payloadFieldNameSeparator?: string;
}
export const ActionReviewEvent = S.suspend(() =>
  S.Struct({
    conversationId: S.optional(S.String),
    userMessageId: S.optional(S.String),
    systemMessageId: S.optional(S.String),
    pluginId: S.optional(S.String),
    pluginType: S.optional(S.String),
    payload: S.optional(ActionReviewPayload),
    payloadFieldNameSeparator: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionReviewEvent",
}) as any as S.Schema<ActionReviewEvent>;
export interface FailedAttachmentEvent {
  conversationId?: string;
  userMessageId?: string;
  systemMessageId?: string;
  attachment?: AttachmentOutput;
}
export const FailedAttachmentEvent = S.suspend(() =>
  S.Struct({
    conversationId: S.optional(S.String),
    userMessageId: S.optional(S.String),
    systemMessageId: S.optional(S.String),
    attachment: S.optional(AttachmentOutput),
  }),
).annotations({
  identifier: "FailedAttachmentEvent",
}) as any as S.Schema<FailedAttachmentEvent>;
export interface AuthChallengeRequestEvent {
  authorizationUrl: string;
}
export const AuthChallengeRequestEvent = S.suspend(() =>
  S.Struct({ authorizationUrl: S.String }),
).annotations({
  identifier: "AuthChallengeRequestEvent",
}) as any as S.Schema<AuthChallengeRequestEvent>;
export interface DocumentAclMembership {
  memberRelation?: string;
  conditions?: DocumentAclConditions;
}
export const DocumentAclMembership = S.suspend(() =>
  S.Struct({
    memberRelation: S.optional(S.String),
    conditions: S.optional(DocumentAclConditions),
  }),
).annotations({
  identifier: "DocumentAclMembership",
}) as any as S.Schema<DocumentAclMembership>;
export interface ScoreAttributes {
  scoreConfidence?: string;
}
export const ScoreAttributes = S.suspend(() =>
  S.Struct({ scoreConfidence: S.optional(S.String) }),
).annotations({
  identifier: "ScoreAttributes",
}) as any as S.Schema<ScoreAttributes>;
export interface Document {
  id: string;
  attributes?: DocumentAttributes;
  content?: (typeof DocumentContent)["Type"];
  contentType?: string;
  title?: string;
  accessConfiguration?: AccessConfiguration;
  documentEnrichmentConfiguration?: DocumentEnrichmentConfiguration;
  mediaExtractionConfiguration?: MediaExtractionConfiguration;
}
export const Document = S.suspend(() =>
  S.Struct({
    id: S.String,
    attributes: S.optional(DocumentAttributes),
    content: S.optional(DocumentContent),
    contentType: S.optional(S.String),
    title: S.optional(S.String),
    accessConfiguration: S.optional(AccessConfiguration),
    documentEnrichmentConfiguration: S.optional(
      DocumentEnrichmentConfiguration,
    ),
    mediaExtractionConfiguration: S.optional(MediaExtractionConfiguration),
  }),
).annotations({ identifier: "Document" }) as any as S.Schema<Document>;
export type Documents = Document[];
export const Documents = S.Array(Document);
export const ChatOutputStream = T.EventStream(
  S.Union(
    S.Struct({ textEvent: TextOutputEvent }),
    S.Struct({ metadataEvent: MetadataEvent }),
    S.Struct({ actionReviewEvent: ActionReviewEvent }),
    S.Struct({ failedAttachmentEvent: FailedAttachmentEvent }),
    S.Struct({ authChallengeRequestEvent: AuthChallengeRequestEvent }),
  ),
);
export interface AuthChallengeRequest {
  authorizationUrl: string;
}
export const AuthChallengeRequest = S.suspend(() =>
  S.Struct({ authorizationUrl: S.String }),
).annotations({
  identifier: "AuthChallengeRequest",
}) as any as S.Schema<AuthChallengeRequest>;
export interface DocumentAcl {
  allowlist?: DocumentAclMembership;
  denyList?: DocumentAclMembership;
}
export const DocumentAcl = S.suspend(() =>
  S.Struct({
    allowlist: S.optional(DocumentAclMembership),
    denyList: S.optional(DocumentAclMembership),
  }),
).annotations({ identifier: "DocumentAcl" }) as any as S.Schema<DocumentAcl>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFields = ValidationExceptionField[];
export const ValidationExceptionFields = S.Array(ValidationExceptionField);
export interface RelevantContent {
  content?: string;
  documentId?: string;
  documentTitle?: string;
  documentUri?: string;
  documentAttributes?: DocumentAttributes;
  scoreAttributes?: ScoreAttributes;
}
export const RelevantContent = S.suspend(() =>
  S.Struct({
    content: S.optional(S.String),
    documentId: S.optional(S.String),
    documentTitle: S.optional(S.String),
    documentUri: S.optional(S.String),
    documentAttributes: S.optional(DocumentAttributes),
    scoreAttributes: S.optional(ScoreAttributes),
  }),
).annotations({
  identifier: "RelevantContent",
}) as any as S.Schema<RelevantContent>;
export type RelevantContentList = RelevantContent[];
export const RelevantContentList = S.Array(RelevantContent);
export interface BatchPutDocumentRequest {
  applicationId: string;
  indexId: string;
  documents: Documents;
  roleArn?: string;
  dataSourceSyncId?: string;
}
export const BatchPutDocumentRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    indexId: S.String.pipe(T.HttpLabel("indexId")),
    documents: Documents,
    roleArn: S.optional(S.String),
    dataSourceSyncId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/indices/{indexId}/documents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchPutDocumentRequest",
}) as any as S.Schema<BatchPutDocumentRequest>;
export interface ChatOutput {
  outputStream?: (typeof ChatOutputStream)["Type"];
}
export const ChatOutput = S.suspend(() =>
  S.Struct({
    outputStream: S.optional(ChatOutputStream).pipe(T.HttpPayload()),
  }),
).annotations({ identifier: "ChatOutput" }) as any as S.Schema<ChatOutput>;
export interface ActionReview {
  pluginId?: string;
  pluginType?: string;
  payload?: ActionReviewPayload;
  payloadFieldNameSeparator?: string;
}
export const ActionReview = S.suspend(() =>
  S.Struct({
    pluginId: S.optional(S.String),
    pluginType: S.optional(S.String),
    payload: S.optional(ActionReviewPayload),
    payloadFieldNameSeparator: S.optional(S.String),
  }),
).annotations({ identifier: "ActionReview" }) as any as S.Schema<ActionReview>;
export interface ChatSyncOutput {
  conversationId?: string;
  systemMessage?: string;
  systemMessageId?: string;
  userMessageId?: string;
  actionReview?: ActionReview;
  authChallengeRequest?: AuthChallengeRequest;
  sourceAttributions?: SourceAttributions;
  failedAttachments?: AttachmentsOutput;
}
export const ChatSyncOutput = S.suspend(() =>
  S.Struct({
    conversationId: S.optional(S.String),
    systemMessage: S.optional(S.String),
    systemMessageId: S.optional(S.String),
    userMessageId: S.optional(S.String),
    actionReview: S.optional(ActionReview),
    authChallengeRequest: S.optional(AuthChallengeRequest),
    sourceAttributions: S.optional(SourceAttributions),
    failedAttachments: S.optional(AttachmentsOutput),
  }),
).annotations({
  identifier: "ChatSyncOutput",
}) as any as S.Schema<ChatSyncOutput>;
export interface CheckDocumentAccessResponse {
  userGroups?: AssociatedGroups;
  userAliases?: AssociatedUsers;
  hasAccess?: boolean;
  documentAcl?: DocumentAcl;
}
export const CheckDocumentAccessResponse = S.suspend(() =>
  S.Struct({
    userGroups: S.optional(AssociatedGroups),
    userAliases: S.optional(AssociatedUsers),
    hasAccess: S.optional(S.Boolean),
    documentAcl: S.optional(DocumentAcl),
  }),
).annotations({
  identifier: "CheckDocumentAccessResponse",
}) as any as S.Schema<CheckDocumentAccessResponse>;
export interface SearchRelevantContentResponse {
  relevantContent?: RelevantContentList;
  nextToken?: string;
}
export const SearchRelevantContentResponse = S.suspend(() =>
  S.Struct({
    relevantContent: S.optional(RelevantContentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchRelevantContentResponse",
}) as any as S.Schema<SearchRelevantContentResponse>;
export interface UpdateChatControlsConfigurationRequest {
  applicationId: string;
  clientToken?: string;
  responseScope?: string;
  orchestrationConfiguration?: OrchestrationConfiguration;
  blockedPhrasesConfigurationUpdate?: BlockedPhrasesConfigurationUpdate;
  topicConfigurationsToCreateOrUpdate?: TopicConfigurations;
  topicConfigurationsToDelete?: TopicConfigurations;
  creatorModeConfiguration?: CreatorModeConfiguration;
  hallucinationReductionConfiguration?: HallucinationReductionConfiguration;
}
export const UpdateChatControlsConfigurationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    clientToken: S.optional(S.String),
    responseScope: S.optional(S.String),
    orchestrationConfiguration: S.optional(OrchestrationConfiguration),
    blockedPhrasesConfigurationUpdate: S.optional(
      BlockedPhrasesConfigurationUpdate,
    ),
    topicConfigurationsToCreateOrUpdate: S.optional(TopicConfigurations),
    topicConfigurationsToDelete: S.optional(TopicConfigurations),
    creatorModeConfiguration: S.optional(CreatorModeConfiguration),
    hallucinationReductionConfiguration: S.optional(
      HallucinationReductionConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/applications/{applicationId}/chatcontrols",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChatControlsConfigurationRequest",
}) as any as S.Schema<UpdateChatControlsConfigurationRequest>;
export interface UpdateChatControlsConfigurationResponse {}
export const UpdateChatControlsConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateChatControlsConfigurationResponse",
}) as any as S.Schema<UpdateChatControlsConfigurationResponse>;
export interface Message {
  messageId?: string;
  body?: string;
  time?: Date;
  type?: string;
  attachments?: AttachmentsOutput;
  sourceAttribution?: SourceAttributions;
  actionReview?: ActionReview;
  actionExecution?: ActionExecution;
}
export const Message = S.suspend(() =>
  S.Struct({
    messageId: S.optional(S.String),
    body: S.optional(S.String),
    time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    type: S.optional(S.String),
    attachments: S.optional(AttachmentsOutput),
    sourceAttribution: S.optional(SourceAttributions),
    actionReview: S.optional(ActionReview),
    actionExecution: S.optional(ActionExecution),
  }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export type Messages = Message[];
export const Messages = S.Array(Message);
export interface BatchPutDocumentResponse {
  failedDocuments?: FailedDocuments;
}
export const BatchPutDocumentResponse = S.suspend(() =>
  S.Struct({ failedDocuments: S.optional(FailedDocuments) }),
).annotations({
  identifier: "BatchPutDocumentResponse",
}) as any as S.Schema<BatchPutDocumentResponse>;
export interface ListMessagesResponse {
  messages?: Messages;
  nextToken?: string;
}
export const ListMessagesResponse = S.suspend(() =>
  S.Struct({ messages: S.optional(Messages), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMessagesResponse",
}) as any as S.Schema<ListMessagesResponse>;
export interface CreateRetrieverRequest {
  applicationId: string;
  type: string;
  displayName: string;
  configuration: (typeof RetrieverConfiguration)["Type"];
  roleArn?: string;
  clientToken?: string;
  tags?: Tags;
}
export const CreateRetrieverRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    type: S.String,
    displayName: S.String,
    configuration: RetrieverConfiguration,
    roleArn: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/retrievers",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRetrieverRequest",
}) as any as S.Schema<CreateRetrieverRequest>;
export interface CreateRetrieverResponse {
  retrieverId?: string;
  retrieverArn?: string;
}
export const CreateRetrieverResponse = S.suspend(() =>
  S.Struct({
    retrieverId: S.optional(S.String),
    retrieverArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateRetrieverResponse",
}) as any as S.Schema<CreateRetrieverResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class LicenseNotFoundException extends S.TaggedError<LicenseNotFoundException>()(
  "LicenseNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withQuotaError) {}
export class MediaTooLargeException extends S.TaggedError<MediaTooLargeException>()(
  "MediaTooLargeException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fields: S.optional(ValidationExceptionFields),
  },
).pipe(C.withBadRequestError) {}
export class ExternalResourceException extends S.TaggedError<ExternalResourceException>()(
  "ExternalResourceException",
  { message: S.String },
) {}

//# Operations
/**
 * Lists metadata for all Amazon Q Business plugin types.
 */
export const listPluginTypeMetadata: {
  (
    input: ListPluginTypeMetadataRequest,
  ): Effect.Effect<
    ListPluginTypeMetadataResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPluginTypeMetadataRequest,
  ) => Stream.Stream<
    ListPluginTypeMetadataResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPluginTypeMetadataRequest,
  ) => Stream.Stream<
    PluginTypeMetadataSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPluginTypeMetadataRequest,
  output: ListPluginTypeMetadataResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for relevant content in a Amazon Q Business application based on a query. This operation takes a search query text, the Amazon Q Business application identifier, and optional filters (such as content source and maximum results) as input. It returns a list of relevant content items, where each item includes the content text, the unique document identifier, the document title, the document URI, any relevant document attributes, and score attributes indicating the confidence level of the relevance.
 */
export const searchRelevantContent: {
  (
    input: SearchRelevantContentRequest,
  ): Effect.Effect<
    SearchRelevantContentResponse,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchRelevantContentRequest,
  ) => Stream.Stream<
    SearchRelevantContentResponse,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchRelevantContentRequest,
  ) => Stream.Stream<
    RelevantContent,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchRelevantContentRequest,
  output: SearchRelevantContentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LicenseNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "relevantContent",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a set of chat controls configured for an existing Amazon Q Business application.
 */
export const updateChatControlsConfiguration: (
  input: UpdateChatControlsConfigurationRequest,
) => Effect.Effect<
  UpdateChatControlsConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChatControlsConfigurationRequest,
  output: UpdateChatControlsConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about an existing Amazon Q Business index.
 */
export const getIndex: (
  input: GetIndexRequest,
) => Effect.Effect<
  GetIndexResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexRequest,
  output: GetIndexResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of attachments associated with an Amazon Q Business web experience or a list of attachements associated with a specific Amazon Q Business conversation.
 */
export const listAttachments: {
  (
    input: ListAttachmentsRequest,
  ): Effect.Effect<
    ListAttachmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttachmentsRequest,
  ) => Stream.Stream<
    ListAttachmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttachmentsRequest,
  ) => Stream.Stream<
    Attachment,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttachmentsRequest,
  output: ListAttachmentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LicenseNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "attachments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists one or more Amazon Q Business conversations.
 */
export const listConversations: {
  (
    input: ListConversationsRequest,
  ): Effect.Effect<
    ListConversationsResponse,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConversationsRequest,
  ) => Stream.Stream<
    ListConversationsResponse,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConversationsRequest,
  ) => Stream.Stream<
    Conversation,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConversationsRequest,
  output: ListConversationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LicenseNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "conversations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes an Amazon Q Business web experience conversation.
 */
export const deleteConversation: (
  input: DeleteConversationRequest,
) => Effect.Effect<
  DeleteConversationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | LicenseNotFoundException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConversationRequest,
  output: DeleteConversationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LicenseNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves detailed information about a specific chat response configuration from an Amazon Q Business application. This operation returns the complete configuration settings and metadata.
 */
export const getChatResponseConfiguration: (
  input: GetChatResponseConfigurationRequest,
) => Effect.Effect<
  GetChatResponseConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChatResponseConfigurationRequest,
  output: GetChatResponseConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the universally unique identifier (UUID) associated with a local user in a data source.
 */
export const getUser: (
  input: GetUserRequest,
) => Effect.Effect<
  GetUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserRequest,
  output: GetUserResponse,
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
 * Retrieves a list of all chat response configurations available in a specified Amazon Q Business application. This operation returns summary information about each configuration to help administrators manage and select appropriate response settings.
 */
export const listChatResponseConfigurations: {
  (
    input: ListChatResponseConfigurationsRequest,
  ): Effect.Effect<
    ListChatResponseConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChatResponseConfigurationsRequest,
  ) => Stream.Stream<
    ListChatResponseConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChatResponseConfigurationsRequest,
  ) => Stream.Stream<
    ChatResponseConfiguration,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChatResponseConfigurationsRequest,
  output: ListChatResponseConfigurationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "chatResponseConfigurations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * A list of documents attached to an index.
 */
export const listDocuments: {
  (
    input: ListDocumentsRequest,
  ): Effect.Effect<
    ListDocumentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDocumentsRequest,
  ) => Stream.Stream<
    ListDocumentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDocumentsRequest,
  ) => Stream.Stream<
    DocumentDetails,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDocumentsRequest,
  output: ListDocumentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "documentDetailList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Provides a list of groups that are mapped to users.
 */
export const listGroups: {
  (
    input: ListGroupsRequest,
  ): Effect.Effect<
    ListGroupsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsRequest,
  ) => Stream.Stream<
    ListGroupsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsRequest,
  ) => Stream.Stream<
    GroupSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
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
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists configured Amazon Q Business actions for a specific plugin in an Amazon Q Business application.
 */
export const listPluginActions: {
  (
    input: ListPluginActionsRequest,
  ): Effect.Effect<
    ListPluginActionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPluginActionsRequest,
  ) => Stream.Stream<
    ListPluginActionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPluginActionsRequest,
  ) => Stream.Stream<
    ActionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPluginActionsRequest,
  output: ListPluginActionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all subscriptions created in an Amazon Q Business application.
 */
export const listSubscriptions: {
  (
    input: ListSubscriptionsRequest,
  ): Effect.Effect<
    ListSubscriptionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubscriptionsRequest,
  ) => Stream.Stream<
    ListSubscriptionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSubscriptionsRequest,
  ) => Stream.Stream<
    Subscription,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubscriptionsRequest,
  output: ListSubscriptionsResponse,
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
    items: "subscriptions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about an existing Amazon Q Business application.
 */
export const getApplication: (
  input: GetApplicationRequest,
) => Effect.Effect<
  GetApplicationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the data accessors for a Amazon Q Business application. This operation returns a paginated list of data accessor summaries, including the friendly name, unique identifier, ARN, associated IAM role, and creation/update timestamps for each data accessor.
 */
export const listDataAccessors: {
  (
    input: ListDataAccessorsRequest,
  ): Effect.Effect<
    ListDataAccessorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataAccessorsRequest,
  ) => Stream.Stream<
    ListDataAccessorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataAccessorsRequest,
  ) => Stream.Stream<
    DataAccessor,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataAccessorsRequest,
  output: ListDataAccessorsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "dataAccessors",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the Amazon Q Business indices you have created.
 */
export const listIndices: {
  (
    input: ListIndicesRequest,
  ): Effect.Effect<
    ListIndicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIndicesRequest,
  ) => Stream.Stream<
    ListIndicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIndicesRequest,
  ) => Stream.Stream<
    Index,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIndicesRequest,
  output: ListIndicesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "indices",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the Amazon Q Business data source connectors that you have created.
 */
export const listDataSources: {
  (
    input: ListDataSourcesRequest,
  ): Effect.Effect<
    ListDataSourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSourcesRequest,
  ) => Stream.Stream<
    ListDataSourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSourcesRequest,
  ) => Stream.Stream<
    DataSource,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataSourcesRequest,
  output: ListDataSourcesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "dataSources",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists configured Amazon Q Business plugins.
 */
export const listPlugins: {
  (
    input: ListPluginsRequest,
  ): Effect.Effect<
    ListPluginsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPluginsRequest,
  ) => Stream.Stream<
    ListPluginsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPluginsRequest,
  ) => Stream.Stream<
    Plugin,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPluginsRequest,
  output: ListPluginsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "plugins",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the retriever used by an Amazon Q Business application.
 */
export const listRetrievers: {
  (
    input: ListRetrieversRequest,
  ): Effect.Effect<
    ListRetrieversResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRetrieversRequest,
  ) => Stream.Stream<
    ListRetrieversResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRetrieversRequest,
  ) => Stream.Stream<
    Retriever,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRetrieversRequest,
  output: ListRetrieversResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "retrievers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an Amazon Q Business web experience.
 */
export const updateWebExperience: (
  input: UpdateWebExperienceRequest,
) => Effect.Effect<
  UpdateWebExperienceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWebExperienceRequest,
  output: UpdateWebExperienceResponse,
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
 * Lists one or more Amazon Q Business Web Experiences.
 */
export const listWebExperiences: {
  (
    input: ListWebExperiencesRequest,
  ): Effect.Effect<
    ListWebExperiencesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWebExperiencesRequest,
  ) => Stream.Stream<
    ListWebExperiencesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWebExperiencesRequest,
  ) => Stream.Stream<
    WebExperience,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWebExperiencesRequest,
  output: ListWebExperiencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "webExperiences",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the content of a document that was ingested into Amazon Q Business. This API validates user authorization against document ACLs before returning a pre-signed URL for secure document access. You can download or view source documents referenced in chat responses through the URL.
 */
export const getDocumentContent: (
  input: GetDocumentContentRequest,
) => Effect.Effect<
  GetDocumentContentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentContentRequest,
  output: GetDocumentContentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the current permission policy for a Amazon Q Business application. The policy is returned as a JSON-formatted string and defines the IAM actions that are allowed or denied for the application's resources.
 */
export const getPolicy: (
  input: GetPolicyRequest,
) => Effect.Effect<
  GetPolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of tags associated with a specified resource. Amazon Q Business applications and data sources can have tags associated with them.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
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
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables your end user to provide feedback on their Amazon Q Business generated chat responses.
 */
export const putFeedback: (
  input: PutFeedbackRequest,
) => Effect.Effect<
  PutFeedbackResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFeedbackRequest,
  output: PutFeedbackResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a specified data accessor. This operation returns details about the data accessor, including its display name, unique identifier, Amazon Resource Name (ARN), the associated Amazon Q Business application and IAM Identity Center application, the IAM role for the ISV, the action configurations, and the timestamps for when the data accessor was created and last updated.
 */
export const getDataAccessor: (
  input: GetDataAccessorRequest,
) => Effect.Effect<
  GetDataAccessorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataAccessorRequest,
  output: GetDataAccessorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about an existing Amazon Q Business data source connector.
 */
export const getDataSource: (
  input: GetDataSourceRequest,
) => Effect.Effect<
  GetDataSourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceRequest,
  output: GetDataSourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about an existing Amazon Q Business plugin.
 */
export const getPlugin: (
  input: GetPluginRequest,
) => Effect.Effect<
  GetPluginResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPluginRequest,
  output: GetPluginResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about an existing retriever used by an Amazon Q Business application.
 */
export const getRetriever: (
  input: GetRetrieverRequest,
) => Effect.Effect<
  GetRetrieverResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRetrieverRequest,
  output: GetRetrieverResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about an existing Amazon Q Business web experience.
 */
export const getWebExperience: (
  input: GetWebExperienceRequest,
) => Effect.Effect<
  GetWebExperienceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWebExperienceRequest,
  output: GetWebExperienceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes chat controls configured for an existing Amazon Q Business application.
 */
export const deleteChatControlsConfiguration: (
  input: DeleteChatControlsConfigurationRequest,
) => Effect.Effect<
  DeleteChatControlsConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChatControlsConfigurationRequest,
  output: DeleteChatControlsConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from an Amazon Q Business application or a data source.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
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
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Unsubscribes a user or a group from their pricing tier in an Amazon Q Business application. An unsubscribed user or group loses all Amazon Q Business feature access at the start of next month.
 */
export const cancelSubscription: (
  input: CancelSubscriptionRequest,
) => Effect.Effect<
  CancelSubscriptionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelSubscriptionRequest,
  output: CancelSubscriptionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the pricing tier for an Amazon Q Business subscription. Upgrades are instant. Downgrades apply at the start of the next month. Subscription tier determines feature access for the user. For more information on subscriptions and pricing tiers, see Amazon Q Business pricing.
 */
export const updateSubscription: (
  input: UpdateSubscriptionRequest,
) => Effect.Effect<
  UpdateSubscriptionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubscriptionRequest,
  output: UpdateSubscriptionResponse,
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
 * Updates an existing Amazon Q Business application.
 *
 * Amazon Q Business applications may securely transmit data for processing across Amazon Web Services Regions within your geography. For more information, see Cross region inference in Amazon Q Business.
 *
 * An Amazon Q Apps service-linked role will be created if it's absent in the Amazon Web Services account when `QAppsConfiguration` is enabled in the request. For more information, see Using service-linked roles for Q Apps.
 */
export const updateApplication: (
  input: UpdateApplicationRequest,
) => Effect.Effect<
  UpdateApplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
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
 * Deletes a specified chat response configuration from an Amazon Q Business application.
 */
export const deleteChatResponseConfiguration: (
  input: DeleteChatResponseConfigurationRequest,
) => Effect.Effect<
  DeleteChatResponseConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChatResponseConfigurationRequest,
  output: DeleteChatResponseConfigurationResponse,
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
 * Deletes a group so that all users and sub groups that belong to the group can no longer access documents only available to that group. For example, after deleting the group "Summer Interns", all interns who belonged to that group no longer see intern-only documents in their chat results.
 *
 * If you want to delete, update, or replace users or sub groups of a group, you need to use the `PutGroup` operation. For example, if a user in the group "Engineering" leaves the engineering team and another user takes their place, you provide an updated list of users or sub groups that belong to the "Engineering" group when calling `PutGroup`.
 */
export const deleteGroup: (
  input: DeleteGroupRequest,
) => Effect.Effect<
  DeleteGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
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
 * Deletes a user by email id.
 */
export const deleteUser: (
  input: DeleteUserRequest,
) => Effect.Effect<
  DeleteUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
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
 * Removes a permission policy from a Amazon Q Business application, revoking the cross-account access that was previously granted to an ISV. This operation deletes the specified policy statement from the application's permission policy.
 */
export const disassociatePermission: (
  input: DisassociatePermissionRequest,
) => Effect.Effect<
  DisassociatePermissionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociatePermissionRequest,
  output: DisassociatePermissionResponse,
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
 * Stops an Amazon Q Business data source connector synchronization job already in progress.
 */
export const stopDataSourceSyncJob: (
  input: StopDataSourceSyncJobRequest,
) => Effect.Effect<
  StopDataSourceSyncJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDataSourceSyncJobRequest,
  output: StopDataSourceSyncJobResponse,
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
 * Adds the specified tag to the specified Amazon Q Business application or data source resource. If the tag already exists, the existing value is replaced with the new value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
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
 * Updates an existing chat response configuration in an Amazon Q Business application. This operation allows administrators to modify configuration settings, display name, and response parameters to refine how the system generates responses.
 */
export const updateChatResponseConfiguration: (
  input: UpdateChatResponseConfigurationRequest,
) => Effect.Effect<
  UpdateChatResponseConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChatResponseConfigurationRequest,
  output: UpdateChatResponseConfigurationResponse,
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
 * Deletes an Amazon Q Business application.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => Effect.Effect<
  DeleteApplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
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
 * Updates an existing data accessor. This operation allows modifying the action configurations (the allowed actions and associated filters) and the display name of the data accessor. It does not allow changing the IAM role associated with the data accessor or other core properties of the data accessor.
 */
export const updateDataAccessor: (
  input: UpdateDataAccessorRequest,
) => Effect.Effect<
  UpdateDataAccessorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataAccessorRequest,
  output: UpdateDataAccessorResponse,
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
 * Deletes a specified data accessor. This operation permanently removes the data accessor and its associated IAM Identity Center application. Any access granted to the ISV through this data accessor will be revoked.
 */
export const deleteDataAccessor: (
  input: DeleteDataAccessorRequest,
) => Effect.Effect<
  DeleteDataAccessorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataAccessorRequest,
  output: DeleteDataAccessorResponse,
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
 * Deletes an Amazon Q Business index.
 */
export const deleteIndex: (
  input: DeleteIndexRequest,
) => Effect.Effect<
  DeleteIndexResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexRequest,
  output: DeleteIndexResponse,
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
 * Updates an existing Amazon Q Business data source connector.
 */
export const updateDataSource: (
  input: UpdateDataSourceRequest,
) => Effect.Effect<
  UpdateDataSourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSourceRequest,
  output: UpdateDataSourceResponse,
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
 * Deletes an Amazon Q Business data source connector. While the data source is being deleted, the `Status` field returned by a call to the `DescribeDataSource` API is set to `DELETING`.
 */
export const deleteDataSource: (
  input: DeleteDataSourceRequest,
) => Effect.Effect<
  DeleteDataSourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSourceRequest,
  output: DeleteDataSourceResponse,
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
 * Deletes an Amazon Q Business plugin.
 */
export const deletePlugin: (
  input: DeletePluginRequest,
) => Effect.Effect<
  DeletePluginResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePluginRequest,
  output: DeletePluginResponse,
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
 * Deletes the retriever used by an Amazon Q Business application.
 */
export const deleteRetriever: (
  input: DeleteRetrieverRequest,
) => Effect.Effect<
  DeleteRetrieverResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRetrieverRequest,
  output: DeleteRetrieverResponse,
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
 * Deletes an Amazon Q Business web experience.
 */
export const deleteWebExperience: (
  input: DeleteWebExperienceRequest,
) => Effect.Effect<
  DeleteWebExperienceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWebExperienceRequest,
  output: DeleteWebExperienceResponse,
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
 * Subscribes an IAM Identity Center user or a group to a pricing tier for an Amazon Q Business application.
 *
 * Amazon Q Business offers two subscription tiers: `Q_LITE` and `Q_BUSINESS`. Subscription tier determines feature access for the user. For more information on subscriptions and pricing tiers, see Amazon Q Business pricing.
 *
 * For an example IAM role policy for assigning subscriptions, see Set up required permissions in the Amazon Q Business User Guide.
 */
export const createSubscription: (
  input: CreateSubscriptionRequest,
) => Effect.Effect<
  CreateSubscriptionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriptionRequest,
  output: CreateSubscriptionResponse,
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
 * Describes a group by group name.
 */
export const getGroup: (
  input: GetGroupRequest,
) => Effect.Effect<
  GetGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupRequest,
  output: GetGroupResponse,
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
 * Asynchronously deletes one or more documents added using the `BatchPutDocument` API from an Amazon Q Business index.
 *
 * You can see the progress of the deletion, and any error messages related to the process, by using CloudWatch.
 */
export const batchDeleteDocument: (
  input: BatchDeleteDocumentRequest,
) => Effect.Effect<
  BatchDeleteDocumentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteDocumentRequest,
  output: BatchDeleteDocumentResponse,
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
 * Deletes an attachment associated with a specific Amazon Q Business conversation.
 */
export const deleteAttachment: (
  input: DeleteAttachmentRequest,
) => Effect.Effect<
  DeleteAttachmentResponse,
  | AccessDeniedException
  | InternalServerException
  | LicenseNotFoundException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAttachmentRequest,
  output: DeleteAttachmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LicenseNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists Amazon Q Business applications.
 *
 * Amazon Q Business applications may securely transmit data for processing across Amazon Web Services Regions within your geography. For more information, see Cross region inference in Amazon Q Business.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): Effect.Effect<
    ListApplicationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    ListApplicationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    Application,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "applications",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists configured Amazon Q Business actions for any plugin type—both built-in and custom.
 */
export const listPluginTypeActions: {
  (
    input: ListPluginTypeActionsRequest,
  ): Effect.Effect<
    ListPluginTypeActionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPluginTypeActionsRequest,
  ) => Stream.Stream<
    ListPluginTypeActionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPluginTypeActionsRequest,
  ) => Stream.Stream<
    ActionSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPluginTypeActionsRequest,
  output: ListPluginTypeActionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about chat controls configured for an existing Amazon Q Business application.
 */
export const getChatControlsConfiguration: {
  (
    input: GetChatControlsConfigurationRequest,
  ): Effect.Effect<
    GetChatControlsConfigurationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetChatControlsConfigurationRequest,
  ) => Stream.Stream<
    GetChatControlsConfigurationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetChatControlsConfigurationRequest,
  ) => Stream.Stream<
    TopicConfiguration,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetChatControlsConfigurationRequest,
  output: GetChatControlsConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "topicConfigurations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get information about an Amazon Q Business data source connector synchronization.
 */
export const listDataSourceSyncJobs: {
  (
    input: ListDataSourceSyncJobsRequest,
  ): Effect.Effect<
    ListDataSourceSyncJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSourceSyncJobsRequest,
  ) => Stream.Stream<
    ListDataSourceSyncJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSourceSyncJobsRequest,
  ) => Stream.Stream<
    DataSourceSyncJob,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataSourceSyncJobsRequest,
  output: ListDataSourceSyncJobsResponse,
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
    items: "history",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an Amazon Q Business plugin.
 */
export const createPlugin: (
  input: CreatePluginRequest,
) => Effect.Effect<
  CreatePluginResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePluginRequest,
  output: CreatePluginResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the image bytes corresponding to a media object. If you have implemented your own application with the Chat and ChatSync APIs, and have enabled content extraction from visual data in Amazon Q Business, you use the GetMedia API operation to download the images so you can show them in your UI with responses.
 *
 * For more information, see Extracting semantic meaning from images and visuals.
 */
export const getMedia: (
  input: GetMediaRequest,
) => Effect.Effect<
  GetMediaResponse,
  | AccessDeniedException
  | InternalServerException
  | LicenseNotFoundException
  | MediaTooLargeException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMediaRequest,
  output: GetMediaResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LicenseNotFoundException,
    MediaTooLargeException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q Business web experience.
 */
export const createWebExperience: (
  input: CreateWebExperienceRequest,
) => Effect.Effect<
  CreateWebExperienceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWebExperienceRequest,
  output: CreateWebExperienceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create, or updates, a mapping of users—who have access to a document—to groups.
 *
 * You can also map sub groups to groups. For example, the group "Company Intellectual Property Teams" includes sub groups "Research" and "Engineering". These sub groups include their own list of users or people who work in these teams. Only users who work in research and engineering, and therefore belong in the intellectual property group, can see top-secret company documents in their Amazon Q Business chat results.
 *
 * There are two options for creating groups, either passing group members inline or using an S3 file via the S3PathForGroupMembers field. For inline groups, there is a limit of 1000 members per group and for provided S3 files there is a limit of 100 thousand members. When creating a group using an S3 file, you provide both an S3 file and a `RoleArn` for Amazon Q Buisness to access the file.
 */
export const putGroup: (
  input: PutGroupRequest,
) => Effect.Effect<
  PutGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutGroupRequest,
  output: PutGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q Business application.
 *
 * There are new tiers for Amazon Q Business. Not all features in Amazon Q Business Pro are also available in Amazon Q Business Lite. For information on what's included in Amazon Q Business Lite and what's included in Amazon Q Business Pro, see Amazon Q Business tiers. You must use the Amazon Q Business console to assign subscription tiers to users.
 *
 * An Amazon Q Apps service linked role will be created if it's absent in the Amazon Web Services account when `QAppsConfiguration` is enabled in the request. For more information, see Using service-linked roles for Q Apps.
 *
 * When you create an application, Amazon Q Business may securely transmit data for processing from your selected Amazon Web Services region, but within your geography. For more information, see Cross region inference in Amazon Q Business.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => Effect.Effect<
  CreateApplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q Business index.
 *
 * To determine if index creation has completed, check the `Status` field returned from a call to `DescribeIndex`. The `Status` field is set to `ACTIVE` when the index is ready to use.
 *
 * Once the index is active, you can index your documents using the `BatchPutDocument` API or the `CreateDataSource` API.
 */
export const createIndex: (
  input: CreateIndexRequest,
) => Effect.Effect<
  CreateIndexResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexRequest,
  output: CreateIndexResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a unique URL for anonymous Amazon Q Business web experience. This URL can only be used once and must be used within 5 minutes after it's generated.
 */
export const createAnonymousWebExperienceUrl: (
  input: CreateAnonymousWebExperienceUrlRequest,
) => Effect.Effect<
  CreateAnonymousWebExperienceUrlResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAnonymousWebExperienceUrlRequest,
  output: CreateAnonymousWebExperienceUrlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a data source connector synchronization job. If a synchronization job is already in progress, Amazon Q Business returns a `ConflictException`.
 */
export const startDataSourceSyncJob: (
  input: StartDataSourceSyncJobRequest,
) => Effect.Effect<
  StartDataSourceSyncJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDataSourceSyncJobRequest,
  output: StartDataSourceSyncJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a information associated with a user id.
 */
export const updateUser: (
  input: UpdateUserRequest,
) => Effect.Effect<
  UpdateUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an Amazon Q Business index.
 */
export const updateIndex: (
  input: UpdateIndexRequest,
) => Effect.Effect<
  UpdateIndexResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexRequest,
  output: UpdateIndexResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an Amazon Q Business plugin.
 */
export const updatePlugin: (
  input: UpdatePluginRequest,
) => Effect.Effect<
  UpdatePluginResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePluginRequest,
  output: UpdatePluginResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the retriever used for your Amazon Q Business application.
 */
export const updateRetriever: (
  input: UpdateRetrieverRequest,
) => Effect.Effect<
  UpdateRetrieverResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRetrieverRequest,
  output: UpdateRetrieverResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a universally unique identifier (UUID) mapped to a list of local user ids within an application.
 */
export const createUser: (
  input: CreateUserRequest,
) => Effect.Effect<
  CreateUserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds or updates a permission policy for a Amazon Q Business application, allowing cross-account access for an ISV. This operation creates a new policy statement for the specified Amazon Q Business application. The policy statement defines the IAM actions that the ISV is allowed to perform on the Amazon Q Business application's resources.
 */
export const associatePermission: (
  input: AssociatePermissionRequest,
) => Effect.Effect<
  AssociatePermissionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociatePermissionRequest,
  output: AssociatePermissionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new chat response configuration for an Amazon Q Business application. This operation establishes a set of parameters that define how the system generates and formats responses to user queries in chat interactions.
 */
export const createChatResponseConfiguration: (
  input: CreateChatResponseConfigurationRequest,
) => Effect.Effect<
  CreateChatResponseConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChatResponseConfigurationRequest,
  output: CreateChatResponseConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new data accessor for an ISV to access data from a Amazon Q Business application. The data accessor is an entity that represents the ISV's access to the Amazon Q Business application's data. It includes the IAM role ARN for the ISV, a friendly name, and a set of action configurations that define the specific actions the ISV is allowed to perform and any associated data filters. When the data accessor is created, an IAM Identity Center application is also created to manage the ISV's identity and authentication for accessing the Amazon Q Business application.
 */
export const createDataAccessor: (
  input: CreateDataAccessorRequest,
) => Effect.Effect<
  CreateDataAccessorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataAccessorRequest,
  output: CreateDataAccessorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a data source connector for an Amazon Q Business application.
 *
 * `CreateDataSource` is a synchronous operation. The operation returns 200 if the data source was successfully created. Otherwise, an exception is raised.
 */
export const createDataSource: (
  input: CreateDataSourceRequest,
) => Effect.Effect<
  CreateDataSourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataSourceRequest,
  output: CreateDataSourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Verifies if a user has access permissions for a specified document and returns the actual ACL attached to the document. Resolves user access on the document via user aliases and groups when verifying user access.
 */
export const checkDocumentAccess: (
  input: CheckDocumentAccessRequest,
) => Effect.Effect<
  CheckDocumentAccessResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckDocumentAccessRequest,
  output: CheckDocumentAccessResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds one or more documents to an Amazon Q Business index.
 *
 * You use this API to:
 *
 * - ingest your structured and unstructured documents and documents stored in an Amazon S3 bucket into an Amazon Q Business index.
 *
 * - add custom attributes to documents in an Amazon Q Business index.
 *
 * - attach an access control list to the documents added to an Amazon Q Business index.
 *
 * You can see the progress of the deletion, and any error messages related to the process, by using CloudWatch.
 */
export const batchPutDocument: (
  input: BatchPutDocumentRequest,
) => Effect.Effect<
  BatchPutDocumentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutDocumentRequest,
  output: BatchPutDocumentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts or continues a streaming Amazon Q Business conversation.
 */
export const chat: (
  input: ChatInput,
) => Effect.Effect<
  ChatOutput,
  | AccessDeniedException
  | ConflictException
  | ExternalResourceException
  | InternalServerException
  | LicenseNotFoundException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChatInput,
  output: ChatOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExternalResourceException,
    InternalServerException,
    LicenseNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of messages associated with an Amazon Q Business web experience.
 */
export const listMessages: {
  (
    input: ListMessagesRequest,
  ): Effect.Effect<
    ListMessagesResponse,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMessagesRequest,
  ) => Stream.Stream<
    ListMessagesResponse,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMessagesRequest,
  ) => Stream.Stream<
    Message,
    | AccessDeniedException
    | InternalServerException
    | LicenseNotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMessagesRequest,
  output: ListMessagesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LicenseNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "messages",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts or continues a non-streaming Amazon Q Business conversation.
 */
export const chatSync: (
  input: ChatSyncInput,
) => Effect.Effect<
  ChatSyncOutput,
  | AccessDeniedException
  | ConflictException
  | ExternalResourceException
  | InternalServerException
  | LicenseNotFoundException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChatSyncInput,
  output: ChatSyncOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExternalResourceException,
    InternalServerException,
    LicenseNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a retriever to your Amazon Q Business application.
 */
export const createRetriever: (
  input: CreateRetrieverRequest,
) => Effect.Effect<
  CreateRetrieverResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRetrieverRequest,
  output: CreateRetrieverResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
