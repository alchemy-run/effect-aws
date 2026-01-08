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
  sdkId: "Wisdom",
  serviceShapeName: "WisdomService",
});
const auth = T.AwsAuthSigv4({ name: "wisdom" });
const ver = T.ServiceVersion("2020-10-19");
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
              `https://wisdom-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://wisdom-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://wisdom.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://wisdom.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type TagKey = string;
export type ClientToken = string;
export type Name = string;
export type AssistantType = string;
export type Description = string;
export type UuidOrArn = string;
export type NextToken = string;
export type MaxResults = number;
export type WaitTimeSeconds = number;
export type QueryText = string | redacted.Redacted<string>;
export type AssociationType = string;
export type NonEmptyString = string;
export type KnowledgeBaseType = string;
export type Uuid = string;
export type ContentType = string;
export type TimeToLive = number;
export type ImportJobType = string;
export type UploadId = string;
export type Uri = string;
export type ContentTitle = string;
export type QuickResponseName = string;
export type QuickResponseType = string;
export type QuickResponseDescription = string;
export type ShortCutKey = string;
export type Channel = string | redacted.Redacted<string>;
export type LanguageCode = string;
export type TagValue = string;
export type ContactAttributeKey = string;
export type ContactAttributeValue = string;
export type ExternalSource = string;
export type QuickResponseContent = string | redacted.Redacted<string>;
export type GroupingCriteria = string | redacted.Redacted<string>;
export type GroupingValue = string | redacted.Redacted<string>;
export type Url = string | redacted.Redacted<string>;
export type FilterField = string;
export type FilterOperator = string;
export type GenericArn = string;
export type QuickResponseQueryValue = string;
export type QuickResponseQueryOperator = string;
export type Priority = string;
export type QuickResponseFilterValue = string;
export type QuickResponseFilterOperator = string;
export type Order = string;
export type AssistantStatus = string;
export type RelevanceScore = number;
export type RelevanceLevel = string;
export type RecommendationType = string;
export type RecommendationTriggerType = string;
export type RecommendationSourceType = string;
export type NotifyRecommendationsReceivedErrorMessage = string;
export type KnowledgeBaseStatus = string;
export type ImportJobStatus = string;
export type ContentStatus = string;
export type QuickResponseStatus = string;
export type SensitiveString = string | redacted.Redacted<string>;
export type HighlightOffset = number;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type RecommendationIdList = string[];
export const RecommendationIdList = S.Array(S.String);
export type Channels = string | redacted.Redacted<string>[];
export const Channels = S.Array(SensitiveString);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface GetAssistantRequest {
  assistantId: string;
}
export const GetAssistantRequest = S.suspend(() =>
  S.Struct({ assistantId: S.String.pipe(T.HttpLabel("assistantId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assistants/{assistantId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssistantRequest",
}) as any as S.Schema<GetAssistantRequest>;
export interface DeleteAssistantRequest {
  assistantId: string;
}
export const DeleteAssistantRequest = S.suspend(() =>
  S.Struct({ assistantId: S.String.pipe(T.HttpLabel("assistantId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/assistants/{assistantId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssistantRequest",
}) as any as S.Schema<DeleteAssistantRequest>;
export interface DeleteAssistantResponse {}
export const DeleteAssistantResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssistantResponse",
}) as any as S.Schema<DeleteAssistantResponse>;
export interface ListAssistantsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListAssistantsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assistants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssistantsRequest",
}) as any as S.Schema<ListAssistantsRequest>;
export interface GetRecommendationsRequest {
  assistantId: string;
  sessionId: string;
  maxResults?: number;
  waitTimeSeconds?: number;
}
export const GetRecommendationsRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    waitTimeSeconds: S.optional(S.Number).pipe(T.HttpQuery("waitTimeSeconds")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/sessions/{sessionId}/recommendations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecommendationsRequest",
}) as any as S.Schema<GetRecommendationsRequest>;
export interface NotifyRecommendationsReceivedRequest {
  assistantId: string;
  sessionId: string;
  recommendationIds: string[];
}
export const NotifyRecommendationsReceivedRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    recommendationIds: RecommendationIdList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/sessions/{sessionId}/recommendations/notify",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "NotifyRecommendationsReceivedRequest",
}) as any as S.Schema<NotifyRecommendationsReceivedRequest>;
export interface QueryAssistantRequest {
  assistantId: string;
  queryText: string | redacted.Redacted<string>;
  nextToken?: string;
  maxResults?: number;
}
export const QueryAssistantRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    queryText: SensitiveString,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/query" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "QueryAssistantRequest",
}) as any as S.Schema<QueryAssistantRequest>;
export interface GetAssistantAssociationRequest {
  assistantAssociationId: string;
  assistantId: string;
}
export const GetAssistantAssociationRequest = S.suspend(() =>
  S.Struct({
    assistantAssociationId: S.String.pipe(
      T.HttpLabel("assistantAssociationId"),
    ),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/associations/{assistantAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssistantAssociationRequest",
}) as any as S.Schema<GetAssistantAssociationRequest>;
export interface DeleteAssistantAssociationRequest {
  assistantAssociationId: string;
  assistantId: string;
}
export const DeleteAssistantAssociationRequest = S.suspend(() =>
  S.Struct({
    assistantAssociationId: S.String.pipe(
      T.HttpLabel("assistantAssociationId"),
    ),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assistants/{assistantId}/associations/{assistantAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssistantAssociationRequest",
}) as any as S.Schema<DeleteAssistantAssociationRequest>;
export interface DeleteAssistantAssociationResponse {}
export const DeleteAssistantAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssistantAssociationResponse",
}) as any as S.Schema<DeleteAssistantAssociationResponse>;
export interface ListAssistantAssociationsRequest {
  nextToken?: string;
  maxResults?: number;
  assistantId: string;
}
export const ListAssistantAssociationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assistants/{assistantId}/associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssistantAssociationsRequest",
}) as any as S.Schema<ListAssistantAssociationsRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateSessionRequest {
  clientToken?: string;
  assistantId: string;
  name: string;
  description?: string;
  tags?: { [key: string]: string };
}
export const CreateSessionRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/sessions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSessionRequest",
}) as any as S.Schema<CreateSessionRequest>;
export interface GetSessionRequest {
  assistantId: string;
  sessionId: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/sessions/{sessionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSessionRequest",
}) as any as S.Schema<GetSessionRequest>;
export interface GetKnowledgeBaseRequest {
  knowledgeBaseId: string;
}
export const GetKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/knowledgeBases/{knowledgeBaseId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKnowledgeBaseRequest",
}) as any as S.Schema<GetKnowledgeBaseRequest>;
export interface DeleteKnowledgeBaseRequest {
  knowledgeBaseId: string;
}
export const DeleteKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/knowledgeBases/{knowledgeBaseId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKnowledgeBaseRequest",
}) as any as S.Schema<DeleteKnowledgeBaseRequest>;
export interface DeleteKnowledgeBaseResponse {}
export const DeleteKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteKnowledgeBaseResponse",
}) as any as S.Schema<DeleteKnowledgeBaseResponse>;
export interface ListKnowledgeBasesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListKnowledgeBasesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/knowledgeBases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKnowledgeBasesRequest",
}) as any as S.Schema<ListKnowledgeBasesRequest>;
export interface DeleteImportJobRequest {
  knowledgeBaseId: string;
  importJobId: string;
}
export const DeleteImportJobRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    importJobId: S.String.pipe(T.HttpLabel("importJobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/importJobs/{importJobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteImportJobRequest",
}) as any as S.Schema<DeleteImportJobRequest>;
export interface DeleteImportJobResponse {}
export const DeleteImportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteImportJobResponse",
}) as any as S.Schema<DeleteImportJobResponse>;
export interface GetImportJobRequest {
  importJobId: string;
  knowledgeBaseId: string;
}
export const GetImportJobRequest = S.suspend(() =>
  S.Struct({
    importJobId: S.String.pipe(T.HttpLabel("importJobId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/importJobs/{importJobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImportJobRequest",
}) as any as S.Schema<GetImportJobRequest>;
export interface ListImportJobsRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
}
export const ListImportJobsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/importJobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImportJobsRequest",
}) as any as S.Schema<ListImportJobsRequest>;
export interface RemoveKnowledgeBaseTemplateUriRequest {
  knowledgeBaseId: string;
}
export const RemoveKnowledgeBaseTemplateUriRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/templateUri",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveKnowledgeBaseTemplateUriRequest",
}) as any as S.Schema<RemoveKnowledgeBaseTemplateUriRequest>;
export interface RemoveKnowledgeBaseTemplateUriResponse {}
export const RemoveKnowledgeBaseTemplateUriResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveKnowledgeBaseTemplateUriResponse",
}) as any as S.Schema<RemoveKnowledgeBaseTemplateUriResponse>;
export interface Filter {
  field: string;
  operator: string;
  value: string;
}
export const Filter = S.suspend(() =>
  S.Struct({ field: S.String, operator: S.String, value: S.String }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface SearchExpression {
  filters: Filter[];
}
export const SearchExpression = S.suspend(() =>
  S.Struct({ filters: FilterList }),
).annotations({
  identifier: "SearchExpression",
}) as any as S.Schema<SearchExpression>;
export interface SearchContentRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
  searchExpression: SearchExpression;
}
export const SearchContentRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: SearchExpression,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/search",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchContentRequest",
}) as any as S.Schema<SearchContentRequest>;
export interface StartContentUploadRequest {
  knowledgeBaseId: string;
  contentType: string;
  presignedUrlTimeToLive?: number;
}
export const StartContentUploadRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentType: S.String,
    presignedUrlTimeToLive: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/upload",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartContentUploadRequest",
}) as any as S.Schema<StartContentUploadRequest>;
export interface UpdateKnowledgeBaseTemplateUriRequest {
  knowledgeBaseId: string;
  templateUri: string;
}
export const UpdateKnowledgeBaseTemplateUriRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    templateUri: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/templateUri",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKnowledgeBaseTemplateUriRequest",
}) as any as S.Schema<UpdateKnowledgeBaseTemplateUriRequest>;
export type ContentMetadata = { [key: string]: string };
export const ContentMetadata = S.Record({ key: S.String, value: S.String });
export interface CreateContentRequest {
  knowledgeBaseId: string;
  name: string;
  title?: string;
  overrideLinkOutUri?: string;
  metadata?: { [key: string]: string };
  uploadId: string;
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateContentRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    name: S.String,
    title: S.optional(S.String),
    overrideLinkOutUri: S.optional(S.String),
    metadata: S.optional(ContentMetadata),
    uploadId: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContentRequest",
}) as any as S.Schema<CreateContentRequest>;
export interface GetContentRequest {
  contentId: string;
  knowledgeBaseId: string;
}
export const GetContentRequest = S.suspend(() =>
  S.Struct({
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContentRequest",
}) as any as S.Schema<GetContentRequest>;
export interface UpdateContentRequest {
  knowledgeBaseId: string;
  contentId: string;
  revisionId?: string;
  title?: string;
  overrideLinkOutUri?: string;
  removeOverrideLinkOutUri?: boolean;
  metadata?: { [key: string]: string };
  uploadId?: string;
}
export const UpdateContentRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    revisionId: S.optional(S.String),
    title: S.optional(S.String),
    overrideLinkOutUri: S.optional(S.String),
    removeOverrideLinkOutUri: S.optional(S.Boolean),
    metadata: S.optional(ContentMetadata),
    uploadId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateContentRequest",
}) as any as S.Schema<UpdateContentRequest>;
export interface DeleteContentRequest {
  knowledgeBaseId: string;
  contentId: string;
}
export const DeleteContentRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContentRequest",
}) as any as S.Schema<DeleteContentRequest>;
export interface DeleteContentResponse {}
export const DeleteContentResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteContentResponse",
}) as any as S.Schema<DeleteContentResponse>;
export interface ListContentsRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
}
export const ListContentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListContentsRequest",
}) as any as S.Schema<ListContentsRequest>;
export interface GetContentSummaryRequest {
  contentId: string;
  knowledgeBaseId: string;
}
export const GetContentSummaryRequest = S.suspend(() =>
  S.Struct({
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}/summary",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContentSummaryRequest",
}) as any as S.Schema<GetContentSummaryRequest>;
export interface GetQuickResponseRequest {
  quickResponseId: string;
  knowledgeBaseId: string;
}
export const GetQuickResponseRequest = S.suspend(() =>
  S.Struct({
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses/{quickResponseId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQuickResponseRequest",
}) as any as S.Schema<GetQuickResponseRequest>;
export type QuickResponseDataProvider = {
  content: string | redacted.Redacted<string>;
};
export const QuickResponseDataProvider = S.Union(
  S.Struct({ content: SensitiveString }),
);
export type GroupingValues = string | redacted.Redacted<string>[];
export const GroupingValues = S.Array(SensitiveString);
export interface GroupingConfiguration {
  criteria?: string | redacted.Redacted<string>;
  values?: string | redacted.Redacted<string>[];
}
export const GroupingConfiguration = S.suspend(() =>
  S.Struct({
    criteria: S.optional(SensitiveString),
    values: S.optional(GroupingValues),
  }),
).annotations({
  identifier: "GroupingConfiguration",
}) as any as S.Schema<GroupingConfiguration>;
export interface UpdateQuickResponseRequest {
  knowledgeBaseId: string;
  quickResponseId: string;
  name?: string;
  content?: QuickResponseDataProvider;
  contentType?: string;
  groupingConfiguration?: GroupingConfiguration;
  removeGroupingConfiguration?: boolean;
  description?: string;
  removeDescription?: boolean;
  shortcutKey?: string;
  removeShortcutKey?: boolean;
  isActive?: boolean;
  channels?: string | redacted.Redacted<string>[];
  language?: string;
}
export const UpdateQuickResponseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
    name: S.optional(S.String),
    content: S.optional(QuickResponseDataProvider),
    contentType: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
    removeGroupingConfiguration: S.optional(S.Boolean),
    description: S.optional(S.String),
    removeDescription: S.optional(S.Boolean),
    shortcutKey: S.optional(S.String),
    removeShortcutKey: S.optional(S.Boolean),
    isActive: S.optional(S.Boolean),
    channels: S.optional(Channels),
    language: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses/{quickResponseId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateQuickResponseRequest",
}) as any as S.Schema<UpdateQuickResponseRequest>;
export interface DeleteQuickResponseRequest {
  knowledgeBaseId: string;
  quickResponseId: string;
}
export const DeleteQuickResponseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses/{quickResponseId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteQuickResponseRequest",
}) as any as S.Schema<DeleteQuickResponseRequest>;
export interface DeleteQuickResponseResponse {}
export const DeleteQuickResponseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteQuickResponseResponse",
}) as any as S.Schema<DeleteQuickResponseResponse>;
export interface ListQuickResponsesRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
}
export const ListQuickResponsesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQuickResponsesRequest",
}) as any as S.Schema<ListQuickResponsesRequest>;
export interface ServerSideEncryptionConfiguration {
  kmsKeyId?: string;
}
export const ServerSideEncryptionConfiguration = S.suspend(() =>
  S.Struct({ kmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "ServerSideEncryptionConfiguration",
}) as any as S.Schema<ServerSideEncryptionConfiguration>;
export type AssistantAssociationInputData = { knowledgeBaseId: string };
export const AssistantAssociationInputData = S.Union(
  S.Struct({ knowledgeBaseId: S.String }),
);
export interface RenderingConfiguration {
  templateUri?: string;
}
export const RenderingConfiguration = S.suspend(() =>
  S.Struct({ templateUri: S.optional(S.String) }),
).annotations({
  identifier: "RenderingConfiguration",
}) as any as S.Schema<RenderingConfiguration>;
export type ContactAttributes = { [key: string]: string };
export const ContactAttributes = S.Record({ key: S.String, value: S.String });
export type ObjectFieldsList = string[];
export const ObjectFieldsList = S.Array(S.String);
export type QuickResponseQueryValueList = string[];
export const QuickResponseQueryValueList = S.Array(S.String);
export type QuickResponseFilterValueList = string[];
export const QuickResponseFilterValueList = S.Array(S.String);
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface CreateAssistantRequest {
  clientToken?: string;
  name: string;
  type: string;
  description?: string;
  tags?: { [key: string]: string };
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
}
export const CreateAssistantRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    name: S.String,
    type: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssistantRequest",
}) as any as S.Schema<CreateAssistantRequest>;
export interface CreateAssistantAssociationRequest {
  assistantId: string;
  associationType: string;
  association: AssistantAssociationInputData;
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateAssistantAssociationRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    associationType: S.String,
    association: AssistantAssociationInputData,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssistantAssociationRequest",
}) as any as S.Schema<CreateAssistantAssociationRequest>;
export interface SessionIntegrationConfiguration {
  topicIntegrationArn?: string;
}
export const SessionIntegrationConfiguration = S.suspend(() =>
  S.Struct({ topicIntegrationArn: S.optional(S.String) }),
).annotations({
  identifier: "SessionIntegrationConfiguration",
}) as any as S.Schema<SessionIntegrationConfiguration>;
export interface SessionData {
  sessionArn: string;
  sessionId: string;
  name: string;
  description?: string;
  tags?: { [key: string]: string };
  integrationConfiguration?: SessionIntegrationConfiguration;
}
export const SessionData = S.suspend(() =>
  S.Struct({
    sessionArn: S.String,
    sessionId: S.String,
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    integrationConfiguration: S.optional(SessionIntegrationConfiguration),
  }),
).annotations({ identifier: "SessionData" }) as any as S.Schema<SessionData>;
export interface GetSessionResponse {
  session?: SessionData;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({ session: S.optional(SessionData) }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface AppIntegrationsConfiguration {
  appIntegrationArn: string;
  objectFields?: string[];
}
export const AppIntegrationsConfiguration = S.suspend(() =>
  S.Struct({
    appIntegrationArn: S.String,
    objectFields: S.optional(ObjectFieldsList),
  }),
).annotations({
  identifier: "AppIntegrationsConfiguration",
}) as any as S.Schema<AppIntegrationsConfiguration>;
export type SourceConfiguration = {
  appIntegrations: AppIntegrationsConfiguration;
};
export const SourceConfiguration = S.Union(
  S.Struct({ appIntegrations: AppIntegrationsConfiguration }),
);
export interface KnowledgeBaseData {
  knowledgeBaseId: string;
  knowledgeBaseArn: string;
  name: string;
  knowledgeBaseType: string;
  status: string;
  lastContentModificationTime?: Date;
  sourceConfiguration?: SourceConfiguration;
  renderingConfiguration?: RenderingConfiguration;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  description?: string;
  tags?: { [key: string]: string };
}
export const KnowledgeBaseData = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    knowledgeBaseArn: S.String,
    name: S.String,
    knowledgeBaseType: S.String,
    status: S.String,
    lastContentModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    sourceConfiguration: S.optional(SourceConfiguration),
    renderingConfiguration: S.optional(RenderingConfiguration),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    description: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "KnowledgeBaseData",
}) as any as S.Schema<KnowledgeBaseData>;
export interface UpdateKnowledgeBaseTemplateUriResponse {
  knowledgeBase?: KnowledgeBaseData;
}
export const UpdateKnowledgeBaseTemplateUriResponse = S.suspend(() =>
  S.Struct({ knowledgeBase: S.optional(KnowledgeBaseData) }),
).annotations({
  identifier: "UpdateKnowledgeBaseTemplateUriResponse",
}) as any as S.Schema<UpdateKnowledgeBaseTemplateUriResponse>;
export interface ContentData {
  contentArn: string;
  contentId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  revisionId: string;
  title: string;
  contentType: string;
  status: string;
  metadata: { [key: string]: string };
  tags?: { [key: string]: string };
  linkOutUri?: string;
  url: string | redacted.Redacted<string>;
  urlExpiry: Date;
}
export const ContentData = S.suspend(() =>
  S.Struct({
    contentArn: S.String,
    contentId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    revisionId: S.String,
    title: S.String,
    contentType: S.String,
    status: S.String,
    metadata: ContentMetadata,
    tags: S.optional(Tags),
    linkOutUri: S.optional(S.String),
    url: SensitiveString,
    urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "ContentData" }) as any as S.Schema<ContentData>;
export interface GetContentResponse {
  content?: ContentData;
}
export const GetContentResponse = S.suspend(() =>
  S.Struct({ content: S.optional(ContentData) }),
).annotations({
  identifier: "GetContentResponse",
}) as any as S.Schema<GetContentResponse>;
export interface UpdateContentResponse {
  content?: ContentData;
}
export const UpdateContentResponse = S.suspend(() =>
  S.Struct({ content: S.optional(ContentData) }),
).annotations({
  identifier: "UpdateContentResponse",
}) as any as S.Schema<UpdateContentResponse>;
export interface ContentSummary {
  contentArn: string;
  contentId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  revisionId: string;
  title: string;
  contentType: string;
  status: string;
  metadata: { [key: string]: string };
  tags?: { [key: string]: string };
}
export const ContentSummary = S.suspend(() =>
  S.Struct({
    contentArn: S.String,
    contentId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    revisionId: S.String,
    title: S.String,
    contentType: S.String,
    status: S.String,
    metadata: ContentMetadata,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "ContentSummary",
}) as any as S.Schema<ContentSummary>;
export type ContentSummaryList = ContentSummary[];
export const ContentSummaryList = S.Array(ContentSummary);
export interface ListContentsResponse {
  contentSummaries: ContentSummary[];
  nextToken?: string;
}
export const ListContentsResponse = S.suspend(() =>
  S.Struct({
    contentSummaries: ContentSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListContentsResponse",
}) as any as S.Schema<ListContentsResponse>;
export interface GetContentSummaryResponse {
  contentSummary?: ContentSummary;
}
export const GetContentSummaryResponse = S.suspend(() =>
  S.Struct({ contentSummary: S.optional(ContentSummary) }),
).annotations({
  identifier: "GetContentSummaryResponse",
}) as any as S.Schema<GetContentSummaryResponse>;
export interface CreateQuickResponseRequest {
  knowledgeBaseId: string;
  name: string;
  content: QuickResponseDataProvider;
  contentType?: string;
  groupingConfiguration?: GroupingConfiguration;
  description?: string;
  shortcutKey?: string;
  isActive?: boolean;
  channels?: string | redacted.Redacted<string>[];
  language?: string;
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateQuickResponseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    name: S.String,
    content: QuickResponseDataProvider,
    contentType: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
    description: S.optional(S.String),
    shortcutKey: S.optional(S.String),
    isActive: S.optional(S.Boolean),
    channels: S.optional(Channels),
    language: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateQuickResponseRequest",
}) as any as S.Schema<CreateQuickResponseRequest>;
export type QuickResponseContentProvider = {
  content: string | redacted.Redacted<string>;
};
export const QuickResponseContentProvider = S.Union(
  S.Struct({ content: SensitiveString }),
);
export interface QuickResponseContents {
  plainText?: QuickResponseContentProvider;
  markdown?: QuickResponseContentProvider;
}
export const QuickResponseContents = S.suspend(() =>
  S.Struct({
    plainText: S.optional(QuickResponseContentProvider),
    markdown: S.optional(QuickResponseContentProvider),
  }),
).annotations({
  identifier: "QuickResponseContents",
}) as any as S.Schema<QuickResponseContents>;
export interface QuickResponseData {
  quickResponseArn: string;
  quickResponseId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  contentType: string;
  status: string;
  createdTime: Date;
  lastModifiedTime: Date;
  contents?: QuickResponseContents;
  description?: string;
  groupingConfiguration?: GroupingConfiguration;
  shortcutKey?: string;
  lastModifiedBy?: string;
  isActive?: boolean;
  channels?: string | redacted.Redacted<string>[];
  language?: string;
  tags?: { [key: string]: string };
}
export const QuickResponseData = S.suspend(() =>
  S.Struct({
    quickResponseArn: S.String,
    quickResponseId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    contentType: S.String,
    status: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    contents: S.optional(QuickResponseContents),
    description: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
    shortcutKey: S.optional(S.String),
    lastModifiedBy: S.optional(S.String),
    isActive: S.optional(S.Boolean),
    channels: S.optional(Channels),
    language: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "QuickResponseData",
}) as any as S.Schema<QuickResponseData>;
export interface UpdateQuickResponseResponse {
  quickResponse?: QuickResponseData;
}
export const UpdateQuickResponseResponse = S.suspend(() =>
  S.Struct({ quickResponse: S.optional(QuickResponseData) }),
).annotations({
  identifier: "UpdateQuickResponseResponse",
}) as any as S.Schema<UpdateQuickResponseResponse>;
export interface QuickResponseQueryField {
  name: string;
  values: string[];
  operator: string;
  allowFuzziness?: boolean;
  priority?: string;
}
export const QuickResponseQueryField = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: QuickResponseQueryValueList,
    operator: S.String,
    allowFuzziness: S.optional(S.Boolean),
    priority: S.optional(S.String),
  }),
).annotations({
  identifier: "QuickResponseQueryField",
}) as any as S.Schema<QuickResponseQueryField>;
export type QuickResponseQueryFieldList = QuickResponseQueryField[];
export const QuickResponseQueryFieldList = S.Array(QuickResponseQueryField);
export interface QuickResponseFilterField {
  name: string;
  values?: string[];
  operator: string;
  includeNoExistence?: boolean;
}
export const QuickResponseFilterField = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: S.optional(QuickResponseFilterValueList),
    operator: S.String,
    includeNoExistence: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "QuickResponseFilterField",
}) as any as S.Schema<QuickResponseFilterField>;
export type QuickResponseFilterFieldList = QuickResponseFilterField[];
export const QuickResponseFilterFieldList = S.Array(QuickResponseFilterField);
export interface QuickResponseOrderField {
  name: string;
  order?: string;
}
export const QuickResponseOrderField = S.suspend(() =>
  S.Struct({ name: S.String, order: S.optional(S.String) }),
).annotations({
  identifier: "QuickResponseOrderField",
}) as any as S.Schema<QuickResponseOrderField>;
export interface AssistantIntegrationConfiguration {
  topicIntegrationArn?: string;
}
export const AssistantIntegrationConfiguration = S.suspend(() =>
  S.Struct({ topicIntegrationArn: S.optional(S.String) }),
).annotations({
  identifier: "AssistantIntegrationConfiguration",
}) as any as S.Schema<AssistantIntegrationConfiguration>;
export interface AssistantSummary {
  assistantId: string;
  assistantArn: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  tags?: { [key: string]: string };
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  integrationConfiguration?: AssistantIntegrationConfiguration;
}
export const AssistantSummary = S.suspend(() =>
  S.Struct({
    assistantId: S.String,
    assistantArn: S.String,
    name: S.String,
    type: S.String,
    status: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    integrationConfiguration: S.optional(AssistantIntegrationConfiguration),
  }),
).annotations({
  identifier: "AssistantSummary",
}) as any as S.Schema<AssistantSummary>;
export type AssistantList = AssistantSummary[];
export const AssistantList = S.Array(AssistantSummary);
export interface NotifyRecommendationsReceivedError {
  recommendationId?: string;
  message?: string;
}
export const NotifyRecommendationsReceivedError = S.suspend(() =>
  S.Struct({
    recommendationId: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "NotifyRecommendationsReceivedError",
}) as any as S.Schema<NotifyRecommendationsReceivedError>;
export type NotifyRecommendationsReceivedErrorList =
  NotifyRecommendationsReceivedError[];
export const NotifyRecommendationsReceivedErrorList = S.Array(
  NotifyRecommendationsReceivedError,
);
export interface ContentReference {
  knowledgeBaseArn?: string;
  knowledgeBaseId?: string;
  contentArn?: string;
  contentId?: string;
}
export const ContentReference = S.suspend(() =>
  S.Struct({
    knowledgeBaseArn: S.optional(S.String),
    knowledgeBaseId: S.optional(S.String),
    contentArn: S.optional(S.String),
    contentId: S.optional(S.String),
  }),
).annotations({
  identifier: "ContentReference",
}) as any as S.Schema<ContentReference>;
export interface Highlight {
  beginOffsetInclusive?: number;
  endOffsetExclusive?: number;
}
export const Highlight = S.suspend(() =>
  S.Struct({
    beginOffsetInclusive: S.optional(S.Number),
    endOffsetExclusive: S.optional(S.Number),
  }),
).annotations({ identifier: "Highlight" }) as any as S.Schema<Highlight>;
export type Highlights = Highlight[];
export const Highlights = S.Array(Highlight);
export interface DocumentText {
  text?: string | redacted.Redacted<string>;
  highlights?: Highlight[];
}
export const DocumentText = S.suspend(() =>
  S.Struct({
    text: S.optional(SensitiveString),
    highlights: S.optional(Highlights),
  }),
).annotations({ identifier: "DocumentText" }) as any as S.Schema<DocumentText>;
export interface Document {
  contentReference: ContentReference;
  title?: DocumentText;
  excerpt?: DocumentText;
}
export const Document = S.suspend(() =>
  S.Struct({
    contentReference: ContentReference,
    title: S.optional(DocumentText),
    excerpt: S.optional(DocumentText),
  }),
).annotations({ identifier: "Document" }) as any as S.Schema<Document>;
export interface ResultData {
  resultId: string;
  document: Document;
  relevanceScore?: number;
}
export const ResultData = S.suspend(() =>
  S.Struct({
    resultId: S.String,
    document: Document,
    relevanceScore: S.optional(S.Number),
  }),
).annotations({ identifier: "ResultData" }) as any as S.Schema<ResultData>;
export type QueryResultsList = ResultData[];
export const QueryResultsList = S.Array(ResultData);
export interface KnowledgeBaseAssociationData {
  knowledgeBaseId?: string;
  knowledgeBaseArn?: string;
}
export const KnowledgeBaseAssociationData = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.optional(S.String),
    knowledgeBaseArn: S.optional(S.String),
  }),
).annotations({
  identifier: "KnowledgeBaseAssociationData",
}) as any as S.Schema<KnowledgeBaseAssociationData>;
export type AssistantAssociationOutputData = {
  knowledgeBaseAssociation: KnowledgeBaseAssociationData;
};
export const AssistantAssociationOutputData = S.Union(
  S.Struct({ knowledgeBaseAssociation: KnowledgeBaseAssociationData }),
);
export interface AssistantAssociationSummary {
  assistantAssociationId: string;
  assistantAssociationArn: string;
  assistantId: string;
  assistantArn: string;
  associationType: string;
  associationData: AssistantAssociationOutputData;
  tags?: { [key: string]: string };
}
export const AssistantAssociationSummary = S.suspend(() =>
  S.Struct({
    assistantAssociationId: S.String,
    assistantAssociationArn: S.String,
    assistantId: S.String,
    assistantArn: S.String,
    associationType: S.String,
    associationData: AssistantAssociationOutputData,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "AssistantAssociationSummary",
}) as any as S.Schema<AssistantAssociationSummary>;
export type AssistantAssociationSummaryList = AssistantAssociationSummary[];
export const AssistantAssociationSummaryList = S.Array(
  AssistantAssociationSummary,
);
export interface KnowledgeBaseSummary {
  knowledgeBaseId: string;
  knowledgeBaseArn: string;
  name: string;
  knowledgeBaseType: string;
  status: string;
  sourceConfiguration?: SourceConfiguration;
  renderingConfiguration?: RenderingConfiguration;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  description?: string;
  tags?: { [key: string]: string };
}
export const KnowledgeBaseSummary = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    knowledgeBaseArn: S.String,
    name: S.String,
    knowledgeBaseType: S.String,
    status: S.String,
    sourceConfiguration: S.optional(SourceConfiguration),
    renderingConfiguration: S.optional(RenderingConfiguration),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    description: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "KnowledgeBaseSummary",
}) as any as S.Schema<KnowledgeBaseSummary>;
export type KnowledgeBaseList = KnowledgeBaseSummary[];
export const KnowledgeBaseList = S.Array(KnowledgeBaseSummary);
export interface ConnectConfiguration {
  instanceId?: string;
}
export const ConnectConfiguration = S.suspend(() =>
  S.Struct({ instanceId: S.optional(S.String) }),
).annotations({
  identifier: "ConnectConfiguration",
}) as any as S.Schema<ConnectConfiguration>;
export type Configuration = { connectConfiguration: ConnectConfiguration };
export const Configuration = S.Union(
  S.Struct({ connectConfiguration: ConnectConfiguration }),
);
export interface ExternalSourceConfiguration {
  source: string;
  configuration: Configuration;
}
export const ExternalSourceConfiguration = S.suspend(() =>
  S.Struct({ source: S.String, configuration: Configuration }),
).annotations({
  identifier: "ExternalSourceConfiguration",
}) as any as S.Schema<ExternalSourceConfiguration>;
export interface ImportJobData {
  importJobId: string;
  knowledgeBaseId: string;
  uploadId: string;
  knowledgeBaseArn: string;
  importJobType: string;
  status: string;
  url: string | redacted.Redacted<string>;
  failedRecordReport?: string | redacted.Redacted<string>;
  urlExpiry: Date;
  createdTime: Date;
  lastModifiedTime: Date;
  metadata?: { [key: string]: string };
  externalSourceConfiguration?: ExternalSourceConfiguration;
}
export const ImportJobData = S.suspend(() =>
  S.Struct({
    importJobId: S.String,
    knowledgeBaseId: S.String,
    uploadId: S.String,
    knowledgeBaseArn: S.String,
    importJobType: S.String,
    status: S.String,
    url: SensitiveString,
    failedRecordReport: S.optional(SensitiveString),
    urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metadata: S.optional(ContentMetadata),
    externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
  }),
).annotations({
  identifier: "ImportJobData",
}) as any as S.Schema<ImportJobData>;
export interface ImportJobSummary {
  importJobId: string;
  knowledgeBaseId: string;
  uploadId: string;
  knowledgeBaseArn: string;
  importJobType: string;
  status: string;
  createdTime: Date;
  lastModifiedTime: Date;
  metadata?: { [key: string]: string };
  externalSourceConfiguration?: ExternalSourceConfiguration;
}
export const ImportJobSummary = S.suspend(() =>
  S.Struct({
    importJobId: S.String,
    knowledgeBaseId: S.String,
    uploadId: S.String,
    knowledgeBaseArn: S.String,
    importJobType: S.String,
    status: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metadata: S.optional(ContentMetadata),
    externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
  }),
).annotations({
  identifier: "ImportJobSummary",
}) as any as S.Schema<ImportJobSummary>;
export type ImportJobList = ImportJobSummary[];
export const ImportJobList = S.Array(ImportJobSummary);
export interface QuickResponseSearchExpression {
  queries?: QuickResponseQueryField[];
  filters?: QuickResponseFilterField[];
  orderOnField?: QuickResponseOrderField;
}
export const QuickResponseSearchExpression = S.suspend(() =>
  S.Struct({
    queries: S.optional(QuickResponseQueryFieldList),
    filters: S.optional(QuickResponseFilterFieldList),
    orderOnField: S.optional(QuickResponseOrderField),
  }),
).annotations({
  identifier: "QuickResponseSearchExpression",
}) as any as S.Schema<QuickResponseSearchExpression>;
export type Headers = { [key: string]: string };
export const Headers = S.Record({ key: S.String, value: S.String });
export interface QuickResponseSummary {
  quickResponseArn: string;
  quickResponseId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  contentType: string;
  status: string;
  createdTime: Date;
  lastModifiedTime: Date;
  description?: string;
  lastModifiedBy?: string;
  isActive?: boolean;
  channels?: string | redacted.Redacted<string>[];
  tags?: { [key: string]: string };
}
export const QuickResponseSummary = S.suspend(() =>
  S.Struct({
    quickResponseArn: S.String,
    quickResponseId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    contentType: S.String,
    status: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    description: S.optional(S.String),
    lastModifiedBy: S.optional(S.String),
    isActive: S.optional(S.Boolean),
    channels: S.optional(Channels),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "QuickResponseSummary",
}) as any as S.Schema<QuickResponseSummary>;
export type QuickResponseSummaryList = QuickResponseSummary[];
export const QuickResponseSummaryList = S.Array(QuickResponseSummary);
export interface AssistantData {
  assistantId: string;
  assistantArn: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  tags?: { [key: string]: string };
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  integrationConfiguration?: AssistantIntegrationConfiguration;
}
export const AssistantData = S.suspend(() =>
  S.Struct({
    assistantId: S.String,
    assistantArn: S.String,
    name: S.String,
    type: S.String,
    status: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    integrationConfiguration: S.optional(AssistantIntegrationConfiguration),
  }),
).annotations({
  identifier: "AssistantData",
}) as any as S.Schema<AssistantData>;
export interface CreateAssistantResponse {
  assistant?: AssistantData;
}
export const CreateAssistantResponse = S.suspend(() =>
  S.Struct({ assistant: S.optional(AssistantData) }),
).annotations({
  identifier: "CreateAssistantResponse",
}) as any as S.Schema<CreateAssistantResponse>;
export interface ListAssistantsResponse {
  assistantSummaries: AssistantSummary[];
  nextToken?: string;
}
export const ListAssistantsResponse = S.suspend(() =>
  S.Struct({
    assistantSummaries: AssistantList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssistantsResponse",
}) as any as S.Schema<ListAssistantsResponse>;
export interface NotifyRecommendationsReceivedResponse {
  recommendationIds?: string[];
  errors?: NotifyRecommendationsReceivedError[];
}
export const NotifyRecommendationsReceivedResponse = S.suspend(() =>
  S.Struct({
    recommendationIds: S.optional(RecommendationIdList),
    errors: S.optional(NotifyRecommendationsReceivedErrorList),
  }),
).annotations({
  identifier: "NotifyRecommendationsReceivedResponse",
}) as any as S.Schema<NotifyRecommendationsReceivedResponse>;
export interface QueryAssistantResponse {
  results: ResultData[];
  nextToken?: string;
}
export const QueryAssistantResponse = S.suspend(() =>
  S.Struct({ results: QueryResultsList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "QueryAssistantResponse",
}) as any as S.Schema<QueryAssistantResponse>;
export interface SearchSessionsRequest {
  nextToken?: string;
  maxResults?: number;
  assistantId: string;
  searchExpression: SearchExpression;
}
export const SearchSessionsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    searchExpression: SearchExpression,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/searchSessions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchSessionsRequest",
}) as any as S.Schema<SearchSessionsRequest>;
export interface AssistantAssociationData {
  assistantAssociationId: string;
  assistantAssociationArn: string;
  assistantId: string;
  assistantArn: string;
  associationType: string;
  associationData: AssistantAssociationOutputData;
  tags?: { [key: string]: string };
}
export const AssistantAssociationData = S.suspend(() =>
  S.Struct({
    assistantAssociationId: S.String,
    assistantAssociationArn: S.String,
    assistantId: S.String,
    assistantArn: S.String,
    associationType: S.String,
    associationData: AssistantAssociationOutputData,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "AssistantAssociationData",
}) as any as S.Schema<AssistantAssociationData>;
export interface CreateAssistantAssociationResponse {
  assistantAssociation?: AssistantAssociationData;
}
export const CreateAssistantAssociationResponse = S.suspend(() =>
  S.Struct({ assistantAssociation: S.optional(AssistantAssociationData) }),
).annotations({
  identifier: "CreateAssistantAssociationResponse",
}) as any as S.Schema<CreateAssistantAssociationResponse>;
export interface ListAssistantAssociationsResponse {
  assistantAssociationSummaries: AssistantAssociationSummary[];
  nextToken?: string;
}
export const ListAssistantAssociationsResponse = S.suspend(() =>
  S.Struct({
    assistantAssociationSummaries: AssistantAssociationSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssistantAssociationsResponse",
}) as any as S.Schema<ListAssistantAssociationsResponse>;
export interface CreateKnowledgeBaseRequest {
  clientToken?: string;
  name: string;
  knowledgeBaseType: string;
  sourceConfiguration?: SourceConfiguration;
  renderingConfiguration?: RenderingConfiguration;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  description?: string;
  tags?: { [key: string]: string };
}
export const CreateKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    name: S.String,
    knowledgeBaseType: S.String,
    sourceConfiguration: S.optional(SourceConfiguration),
    renderingConfiguration: S.optional(RenderingConfiguration),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    description: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/knowledgeBases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKnowledgeBaseRequest",
}) as any as S.Schema<CreateKnowledgeBaseRequest>;
export interface GetKnowledgeBaseResponse {
  knowledgeBase?: KnowledgeBaseData;
}
export const GetKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ knowledgeBase: S.optional(KnowledgeBaseData) }),
).annotations({
  identifier: "GetKnowledgeBaseResponse",
}) as any as S.Schema<GetKnowledgeBaseResponse>;
export interface ListKnowledgeBasesResponse {
  knowledgeBaseSummaries: KnowledgeBaseSummary[];
  nextToken?: string;
}
export const ListKnowledgeBasesResponse = S.suspend(() =>
  S.Struct({
    knowledgeBaseSummaries: KnowledgeBaseList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKnowledgeBasesResponse",
}) as any as S.Schema<ListKnowledgeBasesResponse>;
export interface GetImportJobResponse {
  importJob?: ImportJobData;
}
export const GetImportJobResponse = S.suspend(() =>
  S.Struct({ importJob: S.optional(ImportJobData) }),
).annotations({
  identifier: "GetImportJobResponse",
}) as any as S.Schema<GetImportJobResponse>;
export interface ListImportJobsResponse {
  importJobSummaries: ImportJobSummary[];
  nextToken?: string;
}
export const ListImportJobsResponse = S.suspend(() =>
  S.Struct({
    importJobSummaries: ImportJobList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListImportJobsResponse",
}) as any as S.Schema<ListImportJobsResponse>;
export interface SearchContentResponse {
  contentSummaries: ContentSummary[];
  nextToken?: string;
}
export const SearchContentResponse = S.suspend(() =>
  S.Struct({
    contentSummaries: ContentSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchContentResponse",
}) as any as S.Schema<SearchContentResponse>;
export interface SearchQuickResponsesRequest {
  knowledgeBaseId: string;
  searchExpression: QuickResponseSearchExpression;
  nextToken?: string;
  maxResults?: number;
  attributes?: { [key: string]: string };
}
export const SearchQuickResponsesRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: QuickResponseSearchExpression,
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    attributes: S.optional(ContactAttributes),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/search/quickResponses",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchQuickResponsesRequest",
}) as any as S.Schema<SearchQuickResponsesRequest>;
export interface StartContentUploadResponse {
  uploadId: string;
  url: string | redacted.Redacted<string>;
  urlExpiry: Date;
  headersToInclude: { [key: string]: string };
}
export const StartContentUploadResponse = S.suspend(() =>
  S.Struct({
    uploadId: S.String,
    url: SensitiveString,
    urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    headersToInclude: Headers,
  }),
).annotations({
  identifier: "StartContentUploadResponse",
}) as any as S.Schema<StartContentUploadResponse>;
export interface CreateContentResponse {
  content?: ContentData;
}
export const CreateContentResponse = S.suspend(() =>
  S.Struct({ content: S.optional(ContentData) }),
).annotations({
  identifier: "CreateContentResponse",
}) as any as S.Schema<CreateContentResponse>;
export interface CreateQuickResponseResponse {
  quickResponse?: QuickResponseData;
}
export const CreateQuickResponseResponse = S.suspend(() =>
  S.Struct({ quickResponse: S.optional(QuickResponseData) }),
).annotations({
  identifier: "CreateQuickResponseResponse",
}) as any as S.Schema<CreateQuickResponseResponse>;
export interface ListQuickResponsesResponse {
  quickResponseSummaries: QuickResponseSummary[];
  nextToken?: string;
}
export const ListQuickResponsesResponse = S.suspend(() =>
  S.Struct({
    quickResponseSummaries: QuickResponseSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListQuickResponsesResponse",
}) as any as S.Schema<ListQuickResponsesResponse>;
export interface QueryRecommendationTriggerData {
  text?: string | redacted.Redacted<string>;
}
export const QueryRecommendationTriggerData = S.suspend(() =>
  S.Struct({ text: S.optional(SensitiveString) }),
).annotations({
  identifier: "QueryRecommendationTriggerData",
}) as any as S.Schema<QueryRecommendationTriggerData>;
export interface GetAssistantResponse {
  assistant?: AssistantData;
}
export const GetAssistantResponse = S.suspend(() =>
  S.Struct({ assistant: S.optional(AssistantData) }),
).annotations({
  identifier: "GetAssistantResponse",
}) as any as S.Schema<GetAssistantResponse>;
export interface CreateSessionResponse {
  session?: SessionData;
}
export const CreateSessionResponse = S.suspend(() =>
  S.Struct({ session: S.optional(SessionData) }),
).annotations({
  identifier: "CreateSessionResponse",
}) as any as S.Schema<CreateSessionResponse>;
export interface CreateKnowledgeBaseResponse {
  knowledgeBase?: KnowledgeBaseData;
}
export const CreateKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ knowledgeBase: S.optional(KnowledgeBaseData) }),
).annotations({
  identifier: "CreateKnowledgeBaseResponse",
}) as any as S.Schema<CreateKnowledgeBaseResponse>;
export interface StartImportJobRequest {
  knowledgeBaseId: string;
  importJobType: string;
  uploadId: string;
  clientToken?: string;
  metadata?: { [key: string]: string };
  externalSourceConfiguration?: ExternalSourceConfiguration;
}
export const StartImportJobRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    importJobType: S.String,
    uploadId: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    metadata: S.optional(ContentMetadata),
    externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/importJobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartImportJobRequest",
}) as any as S.Schema<StartImportJobRequest>;
export type RecommendationTriggerData = {
  query: QueryRecommendationTriggerData;
};
export const RecommendationTriggerData = S.Union(
  S.Struct({ query: QueryRecommendationTriggerData }),
);
export type ContactAttributeKeys = string[];
export const ContactAttributeKeys = S.Array(S.String);
export interface RecommendationTrigger {
  id: string;
  type: string;
  source: string;
  data: RecommendationTriggerData;
  recommendationIds: string[];
}
export const RecommendationTrigger = S.suspend(() =>
  S.Struct({
    id: S.String,
    type: S.String,
    source: S.String,
    data: RecommendationTriggerData,
    recommendationIds: RecommendationIdList,
  }),
).annotations({
  identifier: "RecommendationTrigger",
}) as any as S.Schema<RecommendationTrigger>;
export type RecommendationTriggerList = RecommendationTrigger[];
export const RecommendationTriggerList = S.Array(RecommendationTrigger);
export interface SessionSummary {
  sessionId: string;
  sessionArn: string;
  assistantId: string;
  assistantArn: string;
}
export const SessionSummary = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    assistantId: S.String,
    assistantArn: S.String,
  }),
).annotations({
  identifier: "SessionSummary",
}) as any as S.Schema<SessionSummary>;
export type SessionSummaries = SessionSummary[];
export const SessionSummaries = S.Array(SessionSummary);
export interface QuickResponseSearchResultData {
  quickResponseArn: string;
  quickResponseId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  contentType: string;
  status: string;
  contents: QuickResponseContents;
  createdTime: Date;
  lastModifiedTime: Date;
  isActive: boolean;
  description?: string;
  groupingConfiguration?: GroupingConfiguration;
  shortcutKey?: string;
  lastModifiedBy?: string;
  channels?: string | redacted.Redacted<string>[];
  language?: string;
  attributesNotInterpolated?: string[];
  attributesInterpolated?: string[];
  tags?: { [key: string]: string };
}
export const QuickResponseSearchResultData = S.suspend(() =>
  S.Struct({
    quickResponseArn: S.String,
    quickResponseId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    contentType: S.String,
    status: S.String,
    contents: QuickResponseContents,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    isActive: S.Boolean,
    description: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
    shortcutKey: S.optional(S.String),
    lastModifiedBy: S.optional(S.String),
    channels: S.optional(Channels),
    language: S.optional(S.String),
    attributesNotInterpolated: S.optional(ContactAttributeKeys),
    attributesInterpolated: S.optional(ContactAttributeKeys),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "QuickResponseSearchResultData",
}) as any as S.Schema<QuickResponseSearchResultData>;
export type QuickResponseSearchResultsList = QuickResponseSearchResultData[];
export const QuickResponseSearchResultsList = S.Array(
  QuickResponseSearchResultData,
);
export interface SearchSessionsResponse {
  sessionSummaries: SessionSummary[];
  nextToken?: string;
}
export const SearchSessionsResponse = S.suspend(() =>
  S.Struct({
    sessionSummaries: SessionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchSessionsResponse",
}) as any as S.Schema<SearchSessionsResponse>;
export interface GetAssistantAssociationResponse {
  assistantAssociation?: AssistantAssociationData;
}
export const GetAssistantAssociationResponse = S.suspend(() =>
  S.Struct({ assistantAssociation: S.optional(AssistantAssociationData) }),
).annotations({
  identifier: "GetAssistantAssociationResponse",
}) as any as S.Schema<GetAssistantAssociationResponse>;
export interface SearchQuickResponsesResponse {
  results: QuickResponseSearchResultData[];
  nextToken?: string;
}
export const SearchQuickResponsesResponse = S.suspend(() =>
  S.Struct({
    results: QuickResponseSearchResultsList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchQuickResponsesResponse",
}) as any as S.Schema<SearchQuickResponsesResponse>;
export interface StartImportJobResponse {
  importJob?: ImportJobData;
}
export const StartImportJobResponse = S.suspend(() =>
  S.Struct({ importJob: S.optional(ImportJobData) }),
).annotations({
  identifier: "StartImportJobResponse",
}) as any as S.Schema<StartImportJobResponse>;
export interface GetQuickResponseResponse {
  quickResponse?: QuickResponseData;
}
export const GetQuickResponseResponse = S.suspend(() =>
  S.Struct({ quickResponse: S.optional(QuickResponseData) }),
).annotations({
  identifier: "GetQuickResponseResponse",
}) as any as S.Schema<GetQuickResponseResponse>;
export interface RecommendationData {
  recommendationId: string;
  document: Document;
  relevanceScore?: number;
  relevanceLevel?: string;
  type?: string;
}
export const RecommendationData = S.suspend(() =>
  S.Struct({
    recommendationId: S.String,
    document: Document,
    relevanceScore: S.optional(S.Number),
    relevanceLevel: S.optional(S.String),
    type: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationData",
}) as any as S.Schema<RecommendationData>;
export type RecommendationList = RecommendationData[];
export const RecommendationList = S.Array(RecommendationData);
export interface GetRecommendationsResponse {
  recommendations: RecommendationData[];
  triggers?: RecommendationTrigger[];
}
export const GetRecommendationsResponse = S.suspend(() =>
  S.Struct({
    recommendations: RecommendationList,
    triggers: S.optional(RecommendationTriggerList),
  }),
).annotations({
  identifier: "GetRecommendationsResponse",
}) as any as S.Schema<GetRecommendationsResponse>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withTimeoutError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes an assistant.
 */
export const deleteAssistant: (
  input: DeleteAssistantRequest,
) => effect.Effect<
  DeleteAssistantResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssistantRequest,
  output: DeleteAssistantResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists information about assistants.
 */
export const listAssistants: {
  (
    input: ListAssistantsRequest,
  ): effect.Effect<
    ListAssistantsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssistantsRequest,
  ) => stream.Stream<
    ListAssistantsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssistantsRequest,
  ) => stream.Stream<
    AssistantSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssistantsRequest,
  output: ListAssistantsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assistantSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes the specified recommendations from the specified assistant's queue of newly
 * available recommendations. You can use this API in conjunction with GetRecommendations and a `waitTimeSeconds` input for long-polling
 * behavior and avoiding duplicate recommendations.
 */
export const notifyRecommendationsReceived: (
  input: NotifyRecommendationsReceivedRequest,
) => effect.Effect<
  NotifyRecommendationsReceivedResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyRecommendationsReceivedRequest,
  output: NotifyRecommendationsReceivedResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists information about assistant associations.
 */
export const listAssistantAssociations: {
  (
    input: ListAssistantAssociationsRequest,
  ): effect.Effect<
    ListAssistantAssociationsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssistantAssociationsRequest,
  ) => stream.Stream<
    ListAssistantAssociationsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssistantAssociationsRequest,
  ) => stream.Stream<
    AssistantAssociationSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssistantAssociationsRequest,
  output: ListAssistantAssociationsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assistantAssociationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about the knowledge base.
 */
export const getKnowledgeBase: (
  input: GetKnowledgeBaseRequest,
) => effect.Effect<
  GetKnowledgeBaseResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKnowledgeBaseRequest,
  output: GetKnowledgeBaseResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the knowledge bases.
 */
export const listKnowledgeBases: {
  (
    input: ListKnowledgeBasesRequest,
  ): effect.Effect<
    ListKnowledgeBasesResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKnowledgeBasesRequest,
  ) => stream.Stream<
    ListKnowledgeBasesResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKnowledgeBasesRequest,
  ) => stream.Stream<
    KnowledgeBaseSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKnowledgeBasesRequest,
  output: ListKnowledgeBasesResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "knowledgeBaseSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the started import job.
 */
export const getImportJob: (
  input: GetImportJobRequest,
) => effect.Effect<
  GetImportJobResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportJobRequest,
  output: GetImportJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists information about import jobs.
 */
export const listImportJobs: {
  (
    input: ListImportJobsRequest,
  ): effect.Effect<
    ListImportJobsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportJobsRequest,
  ) => stream.Stream<
    ListImportJobsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImportJobsRequest,
  ) => stream.Stream<
    ImportJobSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportJobsRequest,
  output: ListImportJobsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "importJobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for content in a specified knowledge base. Can be used to get a specific content
 * resource by its name.
 */
export const searchContent: {
  (
    input: SearchContentRequest,
  ): effect.Effect<
    SearchContentResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchContentRequest,
  ) => stream.Stream<
    SearchContentResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchContentRequest,
  ) => stream.Stream<
    ContentSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchContentRequest,
  output: SearchContentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "contentSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get a URL to upload content to a knowledge base. To upload content, first make a PUT
 * request to the returned URL with your file, making sure to include the required headers. Then
 * use CreateContent to finalize the content creation process or UpdateContent to modify an existing resource. You can only upload content to a
 * knowledge base of type CUSTOM.
 */
export const startContentUpload: (
  input: StartContentUploadRequest,
) => effect.Effect<
  StartContentUploadResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartContentUploadRequest,
  output: StartContentUploadResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates information about the content.
 */
export const updateContent: (
  input: UpdateContentRequest,
) => effect.Effect<
  UpdateContentResponse,
  | AccessDeniedException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContentRequest,
  output: UpdateContentResponse,
  errors: [
    AccessDeniedException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates an existing Wisdom quick response.
 */
export const updateQuickResponse: (
  input: UpdateQuickResponseRequest,
) => effect.Effect<
  UpdateQuickResponseResponse,
  | AccessDeniedException
  | ConflictException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQuickResponseRequest,
  output: UpdateQuickResponseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists information about quick response.
 */
export const listQuickResponses: {
  (
    input: ListQuickResponsesRequest,
  ): effect.Effect<
    ListQuickResponsesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQuickResponsesRequest,
  ) => stream.Stream<
    ListQuickResponsesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQuickResponsesRequest,
  ) => stream.Stream<
    QuickResponseSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQuickResponsesRequest,
  output: ListQuickResponsesResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "quickResponseSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds the specified tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | TooManyTagsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, TooManyTagsException],
}));
/**
 * Retrieves information for a specified session.
 */
export const getSession: (
  input: GetSessionRequest,
) => effect.Effect<
  GetSessionResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the template URI of a knowledge base. This is only supported for knowledge bases
 * of type EXTERNAL. Include a single variable in `${variable}` format; this
 * interpolated by Wisdom using ingested content. For example, if you ingest a Salesforce
 * article, it has an `Id` value, and you can set the template URI to
 * `https://myInstanceName.lightning.force.com/lightning/r/Knowledge__kav/*${Id}*\/view`.
 */
export const updateKnowledgeBaseTemplateUri: (
  input: UpdateKnowledgeBaseTemplateUriRequest,
) => effect.Effect<
  UpdateKnowledgeBaseTemplateUriResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKnowledgeBaseTemplateUriRequest,
  output: UpdateKnowledgeBaseTemplateUriResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves content, including a pre-signed URL to download the content.
 */
export const getContent: (
  input: GetContentRequest,
) => effect.Effect<
  GetContentResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContentRequest,
  output: GetContentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the content.
 */
export const listContents: {
  (
    input: ListContentsRequest,
  ): effect.Effect<
    ListContentsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListContentsRequest,
  ) => stream.Stream<
    ListContentsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListContentsRequest,
  ) => stream.Stream<
    ContentSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListContentsRequest,
  output: ListContentsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "contentSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves summary information about the content.
 */
export const getContentSummary: (
  input: GetContentSummaryRequest,
) => effect.Effect<
  GetContentSummaryResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContentSummaryRequest,
  output: GetContentSummaryResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an assistant association.
 */
export const deleteAssistantAssociation: (
  input: DeleteAssistantAssociationRequest,
) => effect.Effect<
  DeleteAssistantAssociationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssistantAssociationRequest,
  output: DeleteAssistantAssociationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes a URI template from a knowledge base.
 */
export const removeKnowledgeBaseTemplateUri: (
  input: RemoveKnowledgeBaseTemplateUriRequest,
) => effect.Effect<
  RemoveKnowledgeBaseTemplateUriResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveKnowledgeBaseTemplateUriRequest,
  output: RemoveKnowledgeBaseTemplateUriResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the content.
 */
export const deleteContent: (
  input: DeleteContentRequest,
) => effect.Effect<
  DeleteContentResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContentRequest,
  output: DeleteContentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a quick response.
 */
export const deleteQuickResponse: (
  input: DeleteQuickResponseRequest,
) => effect.Effect<
  DeleteQuickResponseResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQuickResponseRequest,
  output: DeleteQuickResponseResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the knowledge base.
 *
 * When you use this API to delete an external knowledge base such as Salesforce or
 * ServiceNow, you must also delete the Amazon AppIntegrations
 * DataIntegration. This is because you can't reuse the DataIntegration after it's been
 * associated with an external knowledge base. However, you can delete and recreate it. See
 * DeleteDataIntegration and CreateDataIntegration in the Amazon AppIntegrations API
 * Reference.
 */
export const deleteKnowledgeBase: (
  input: DeleteKnowledgeBaseRequest,
) => effect.Effect<
  DeleteKnowledgeBaseResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKnowledgeBaseRequest,
  output: DeleteKnowledgeBaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the quick response import job.
 */
export const deleteImportJob: (
  input: DeleteImportJobRequest,
) => effect.Effect<
  DeleteImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImportJobRequest,
  output: DeleteImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an assistant.
 */
export const getAssistant: (
  input: GetAssistantRequest,
) => effect.Effect<
  GetAssistantResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssistantRequest,
  output: GetAssistantResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Performs a manual search against the specified assistant. To retrieve recommendations for
 * an assistant, use GetRecommendations.
 */
export const queryAssistant: {
  (
    input: QueryAssistantRequest,
  ): effect.Effect<
    QueryAssistantResponse,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: QueryAssistantRequest,
  ) => stream.Stream<
    QueryAssistantResponse,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: QueryAssistantRequest,
  ) => stream.Stream<
    ResultData,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: QueryAssistantRequest,
  output: QueryAssistantResponse,
  errors: [
    AccessDeniedException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "results",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a session. A session is a contextual container used for generating
 * recommendations. Amazon Connect creates a new Wisdom session for each contact on which
 * Wisdom is enabled.
 */
export const createSession: (
  input: CreateSessionRequest,
) => effect.Effect<
  CreateSessionResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSessionRequest,
  output: CreateSessionResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Creates an Amazon Connect Wisdom assistant.
 */
export const createAssistant: (
  input: CreateAssistantRequest,
) => effect.Effect<
  CreateAssistantResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssistantRequest,
  output: CreateAssistantResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an association between an Amazon Connect Wisdom assistant and another resource. Currently, the
 * only supported association is with a knowledge base. An assistant can have only a single
 * association.
 */
export const createAssistantAssociation: (
  input: CreateAssistantAssociationRequest,
) => effect.Effect<
  CreateAssistantAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssistantAssociationRequest,
  output: CreateAssistantAssociationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates Wisdom content. Before to calling this API, use StartContentUpload to
 * upload an asset.
 */
export const createContent: (
  input: CreateContentRequest,
) => effect.Effect<
  CreateContentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContentRequest,
  output: CreateContentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a Wisdom quick response.
 */
export const createQuickResponse: (
  input: CreateQuickResponseRequest,
) => effect.Effect<
  CreateQuickResponseResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQuickResponseRequest,
  output: CreateQuickResponseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a knowledge base.
 *
 * When using this API, you cannot reuse Amazon AppIntegrations
 * DataIntegrations with external knowledge bases such as Salesforce and ServiceNow. If you do,
 * you'll get an `InvalidRequestException` error.
 *
 * For example, you're programmatically managing your external knowledge base, and you want
 * to add or remove one of the fields that is being ingested from Salesforce. Do the
 * following:
 *
 * - Call DeleteKnowledgeBase.
 *
 * - Call DeleteDataIntegration.
 *
 * - Call CreateDataIntegration to recreate the DataIntegration or a create different
 * one.
 *
 * - Call CreateKnowledgeBase.
 */
export const createKnowledgeBase: (
  input: CreateKnowledgeBaseRequest,
) => effect.Effect<
  CreateKnowledgeBaseResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKnowledgeBaseRequest,
  output: CreateKnowledgeBaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Searches for sessions.
 */
export const searchSessions: {
  (
    input: SearchSessionsRequest,
  ): effect.Effect<
    SearchSessionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchSessionsRequest,
  ) => stream.Stream<
    SearchSessionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchSessionsRequest,
  ) => stream.Stream<
    SessionSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchSessionsRequest,
  output: SearchSessionsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "sessionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about an assistant association.
 */
export const getAssistantAssociation: (
  input: GetAssistantAssociationRequest,
) => effect.Effect<
  GetAssistantAssociationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssistantAssociationRequest,
  output: GetAssistantAssociationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Searches existing Wisdom quick responses in a Wisdom knowledge base.
 */
export const searchQuickResponses: {
  (
    input: SearchQuickResponsesRequest,
  ): effect.Effect<
    SearchQuickResponsesResponse,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchQuickResponsesRequest,
  ) => stream.Stream<
    SearchQuickResponsesResponse,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchQuickResponsesRequest,
  ) => stream.Stream<
    QuickResponseSearchResultData,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchQuickResponsesRequest,
  output: SearchQuickResponsesResponse,
  errors: [
    AccessDeniedException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "results",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Start an asynchronous job to import Wisdom resources from an uploaded source file. Before calling this API, use StartContentUpload to
 * upload an asset that contains the resource data.
 *
 * - For importing Wisdom quick responses, you need to upload a csv file including the quick responses. For information about how to format the csv file for importing quick responses, see Import quick responses.
 */
export const startImportJob: (
  input: StartImportJobRequest,
) => effect.Effect<
  StartImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportJobRequest,
  output: StartImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Retrieves the quick response.
 */
export const getQuickResponse: (
  input: GetQuickResponseRequest,
) => effect.Effect<
  GetQuickResponseResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQuickResponseRequest,
  output: GetQuickResponseResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves recommendations for the specified session. To avoid retrieving the same
 * recommendations in subsequent calls, use NotifyRecommendationsReceived. This API supports long-polling behavior with the
 * `waitTimeSeconds` parameter. Short poll is the default behavior and only returns
 * recommendations already available. To perform a manual query against an assistant, use QueryAssistant.
 */
export const getRecommendations: (
  input: GetRecommendationsRequest,
) => effect.Effect<
  GetRecommendationsResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecommendationsRequest,
  output: GetRecommendationsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
