import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Wisdom",
  serviceShapeName: "WisdomService",
});
const auth = T.AwsAuthSigv4({ name: "wisdom" });
const ver = T.ServiceVersion("2020-10-19");
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
                        url: "https://wisdom-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://wisdom-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://wisdom.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://wisdom.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export const RecommendationIdList = S.Array(S.String);
export const Channels = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class GetAssistantRequest extends S.Class<GetAssistantRequest>(
  "GetAssistantRequest",
)(
  { assistantId: S.String.pipe(T.HttpLabel("assistantId")) },
  T.all(
    T.Http({ method: "GET", uri: "/assistants/{assistantId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssistantRequest extends S.Class<DeleteAssistantRequest>(
  "DeleteAssistantRequest",
)(
  { assistantId: S.String.pipe(T.HttpLabel("assistantId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/assistants/{assistantId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssistantResponse extends S.Class<DeleteAssistantResponse>(
  "DeleteAssistantResponse",
)({}) {}
export class ListAssistantsRequest extends S.Class<ListAssistantsRequest>(
  "ListAssistantsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assistants" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecommendationsRequest extends S.Class<GetRecommendationsRequest>(
  "GetRecommendationsRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    waitTimeSeconds: S.optional(S.Number).pipe(T.HttpQuery("waitTimeSeconds")),
  },
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
) {}
export class NotifyRecommendationsReceivedRequest extends S.Class<NotifyRecommendationsReceivedRequest>(
  "NotifyRecommendationsReceivedRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    recommendationIds: RecommendationIdList,
  },
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
) {}
export class QueryAssistantRequest extends S.Class<QueryAssistantRequest>(
  "QueryAssistantRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    queryText: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/query" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssistantAssociationRequest extends S.Class<GetAssistantAssociationRequest>(
  "GetAssistantAssociationRequest",
)(
  {
    assistantAssociationId: S.String.pipe(
      T.HttpLabel("assistantAssociationId"),
    ),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  },
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
) {}
export class DeleteAssistantAssociationRequest extends S.Class<DeleteAssistantAssociationRequest>(
  "DeleteAssistantAssociationRequest",
)(
  {
    assistantAssociationId: S.String.pipe(
      T.HttpLabel("assistantAssociationId"),
    ),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  },
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
) {}
export class DeleteAssistantAssociationResponse extends S.Class<DeleteAssistantAssociationResponse>(
  "DeleteAssistantAssociationResponse",
)({}) {}
export class ListAssistantAssociationsRequest extends S.Class<ListAssistantAssociationsRequest>(
  "ListAssistantAssociationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assistants/{assistantId}/associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateSessionRequest extends S.Class<CreateSessionRequest>(
  "CreateSessionRequest",
)(
  {
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/sessions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionRequest extends S.Class<GetSessionRequest>(
  "GetSessionRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  },
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
) {}
export class GetKnowledgeBaseRequest extends S.Class<GetKnowledgeBaseRequest>(
  "GetKnowledgeBaseRequest",
)(
  { knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")) },
  T.all(
    T.Http({ method: "GET", uri: "/knowledgeBases/{knowledgeBaseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKnowledgeBaseRequest extends S.Class<DeleteKnowledgeBaseRequest>(
  "DeleteKnowledgeBaseRequest",
)(
  { knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/knowledgeBases/{knowledgeBaseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKnowledgeBaseResponse extends S.Class<DeleteKnowledgeBaseResponse>(
  "DeleteKnowledgeBaseResponse",
)({}) {}
export class ListKnowledgeBasesRequest extends S.Class<ListKnowledgeBasesRequest>(
  "ListKnowledgeBasesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/knowledgeBases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteImportJobRequest extends S.Class<DeleteImportJobRequest>(
  "DeleteImportJobRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    importJobId: S.String.pipe(T.HttpLabel("importJobId")),
  },
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
) {}
export class DeleteImportJobResponse extends S.Class<DeleteImportJobResponse>(
  "DeleteImportJobResponse",
)({}) {}
export class GetImportJobRequest extends S.Class<GetImportJobRequest>(
  "GetImportJobRequest",
)(
  {
    importJobId: S.String.pipe(T.HttpLabel("importJobId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class ListImportJobsRequest extends S.Class<ListImportJobsRequest>(
  "ListImportJobsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class RemoveKnowledgeBaseTemplateUriRequest extends S.Class<RemoveKnowledgeBaseTemplateUriRequest>(
  "RemoveKnowledgeBaseTemplateUriRequest",
)(
  { knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")) },
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
) {}
export class RemoveKnowledgeBaseTemplateUriResponse extends S.Class<RemoveKnowledgeBaseTemplateUriResponse>(
  "RemoveKnowledgeBaseTemplateUriResponse",
)({}) {}
export class Filter extends S.Class<Filter>("Filter")({
  field: S.String,
  operator: S.String,
  value: S.String,
}) {}
export const FilterList = S.Array(Filter);
export class SearchExpression extends S.Class<SearchExpression>(
  "SearchExpression",
)({ filters: FilterList }) {}
export class SearchContentRequest extends S.Class<SearchContentRequest>(
  "SearchContentRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: SearchExpression,
  },
  T.all(
    T.Http({ method: "POST", uri: "/knowledgeBases/{knowledgeBaseId}/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartContentUploadRequest extends S.Class<StartContentUploadRequest>(
  "StartContentUploadRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentType: S.String,
    presignedUrlTimeToLive: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/knowledgeBases/{knowledgeBaseId}/upload" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKnowledgeBaseTemplateUriRequest extends S.Class<UpdateKnowledgeBaseTemplateUriRequest>(
  "UpdateKnowledgeBaseTemplateUriRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    templateUri: S.String,
  },
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
) {}
export const ContentMetadata = S.Record({ key: S.String, value: S.String });
export class CreateContentRequest extends S.Class<CreateContentRequest>(
  "CreateContentRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    name: S.String,
    title: S.optional(S.String),
    overrideLinkOutUri: S.optional(S.String),
    metadata: S.optional(ContentMetadata),
    uploadId: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  },
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
) {}
export class GetContentRequest extends S.Class<GetContentRequest>(
  "GetContentRequest",
)(
  {
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class UpdateContentRequest extends S.Class<UpdateContentRequest>(
  "UpdateContentRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    revisionId: S.optional(S.String),
    title: S.optional(S.String),
    overrideLinkOutUri: S.optional(S.String),
    removeOverrideLinkOutUri: S.optional(S.Boolean),
    metadata: S.optional(ContentMetadata),
    uploadId: S.optional(S.String),
  },
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
) {}
export class DeleteContentRequest extends S.Class<DeleteContentRequest>(
  "DeleteContentRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
  },
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
) {}
export class DeleteContentResponse extends S.Class<DeleteContentResponse>(
  "DeleteContentResponse",
)({}) {}
export class ListContentsRequest extends S.Class<ListContentsRequest>(
  "ListContentsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class GetContentSummaryRequest extends S.Class<GetContentSummaryRequest>(
  "GetContentSummaryRequest",
)(
  {
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class GetQuickResponseRequest extends S.Class<GetQuickResponseRequest>(
  "GetQuickResponseRequest",
)(
  {
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export const QuickResponseDataProvider = S.Union(
  S.Struct({ content: S.String }),
);
export const GroupingValues = S.Array(S.String);
export class GroupingConfiguration extends S.Class<GroupingConfiguration>(
  "GroupingConfiguration",
)({ criteria: S.optional(S.String), values: S.optional(GroupingValues) }) {}
export class UpdateQuickResponseRequest extends S.Class<UpdateQuickResponseRequest>(
  "UpdateQuickResponseRequest",
)(
  {
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
  },
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
) {}
export class DeleteQuickResponseRequest extends S.Class<DeleteQuickResponseRequest>(
  "DeleteQuickResponseRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
  },
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
) {}
export class DeleteQuickResponseResponse extends S.Class<DeleteQuickResponseResponse>(
  "DeleteQuickResponseResponse",
)({}) {}
export class ListQuickResponsesRequest extends S.Class<ListQuickResponsesRequest>(
  "ListQuickResponsesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class ServerSideEncryptionConfiguration extends S.Class<ServerSideEncryptionConfiguration>(
  "ServerSideEncryptionConfiguration",
)({ kmsKeyId: S.optional(S.String) }) {}
export const AssistantAssociationInputData = S.Union(
  S.Struct({ knowledgeBaseId: S.String }),
);
export class RenderingConfiguration extends S.Class<RenderingConfiguration>(
  "RenderingConfiguration",
)({ templateUri: S.optional(S.String) }) {}
export const ContactAttributes = S.Record({ key: S.String, value: S.String });
export const ObjectFieldsList = S.Array(S.String);
export const QuickResponseQueryValueList = S.Array(S.String);
export const QuickResponseFilterValueList = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class CreateAssistantRequest extends S.Class<CreateAssistantRequest>(
  "CreateAssistantRequest",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    type: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAssistantAssociationRequest extends S.Class<CreateAssistantAssociationRequest>(
  "CreateAssistantAssociationRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    associationType: S.String,
    association: AssistantAssociationInputData,
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SessionIntegrationConfiguration extends S.Class<SessionIntegrationConfiguration>(
  "SessionIntegrationConfiguration",
)({ topicIntegrationArn: S.optional(S.String) }) {}
export class SessionData extends S.Class<SessionData>("SessionData")({
  sessionArn: S.String,
  sessionId: S.String,
  name: S.String,
  description: S.optional(S.String),
  tags: S.optional(Tags),
  integrationConfiguration: S.optional(SessionIntegrationConfiguration),
}) {}
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({ session: S.optional(SessionData) }) {}
export class AppIntegrationsConfiguration extends S.Class<AppIntegrationsConfiguration>(
  "AppIntegrationsConfiguration",
)({
  appIntegrationArn: S.String,
  objectFields: S.optional(ObjectFieldsList),
}) {}
export const SourceConfiguration = S.Union(
  S.Struct({ appIntegrations: AppIntegrationsConfiguration }),
);
export class KnowledgeBaseData extends S.Class<KnowledgeBaseData>(
  "KnowledgeBaseData",
)({
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
}) {}
export class UpdateKnowledgeBaseTemplateUriResponse extends S.Class<UpdateKnowledgeBaseTemplateUriResponse>(
  "UpdateKnowledgeBaseTemplateUriResponse",
)({ knowledgeBase: S.optional(KnowledgeBaseData) }) {}
export class ContentData extends S.Class<ContentData>("ContentData")({
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
  url: S.String,
  urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class GetContentResponse extends S.Class<GetContentResponse>(
  "GetContentResponse",
)({ content: S.optional(ContentData) }) {}
export class UpdateContentResponse extends S.Class<UpdateContentResponse>(
  "UpdateContentResponse",
)({ content: S.optional(ContentData) }) {}
export class ContentSummary extends S.Class<ContentSummary>("ContentSummary")({
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
}) {}
export const ContentSummaryList = S.Array(ContentSummary);
export class ListContentsResponse extends S.Class<ListContentsResponse>(
  "ListContentsResponse",
)({ contentSummaries: ContentSummaryList, nextToken: S.optional(S.String) }) {}
export class GetContentSummaryResponse extends S.Class<GetContentSummaryResponse>(
  "GetContentSummaryResponse",
)({ contentSummary: S.optional(ContentSummary) }) {}
export class CreateQuickResponseRequest extends S.Class<CreateQuickResponseRequest>(
  "CreateQuickResponseRequest",
)(
  {
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
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  },
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
) {}
export const QuickResponseContentProvider = S.Union(
  S.Struct({ content: S.String }),
);
export class QuickResponseContents extends S.Class<QuickResponseContents>(
  "QuickResponseContents",
)({
  plainText: S.optional(QuickResponseContentProvider),
  markdown: S.optional(QuickResponseContentProvider),
}) {}
export class QuickResponseData extends S.Class<QuickResponseData>(
  "QuickResponseData",
)({
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
}) {}
export class UpdateQuickResponseResponse extends S.Class<UpdateQuickResponseResponse>(
  "UpdateQuickResponseResponse",
)({ quickResponse: S.optional(QuickResponseData) }) {}
export class QuickResponseQueryField extends S.Class<QuickResponseQueryField>(
  "QuickResponseQueryField",
)({
  name: S.String,
  values: QuickResponseQueryValueList,
  operator: S.String,
  allowFuzziness: S.optional(S.Boolean),
  priority: S.optional(S.String),
}) {}
export const QuickResponseQueryFieldList = S.Array(QuickResponseQueryField);
export class QuickResponseFilterField extends S.Class<QuickResponseFilterField>(
  "QuickResponseFilterField",
)({
  name: S.String,
  values: S.optional(QuickResponseFilterValueList),
  operator: S.String,
  includeNoExistence: S.optional(S.Boolean),
}) {}
export const QuickResponseFilterFieldList = S.Array(QuickResponseFilterField);
export class QuickResponseOrderField extends S.Class<QuickResponseOrderField>(
  "QuickResponseOrderField",
)({ name: S.String, order: S.optional(S.String) }) {}
export class AssistantIntegrationConfiguration extends S.Class<AssistantIntegrationConfiguration>(
  "AssistantIntegrationConfiguration",
)({ topicIntegrationArn: S.optional(S.String) }) {}
export class AssistantSummary extends S.Class<AssistantSummary>(
  "AssistantSummary",
)({
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
}) {}
export const AssistantList = S.Array(AssistantSummary);
export class NotifyRecommendationsReceivedError extends S.Class<NotifyRecommendationsReceivedError>(
  "NotifyRecommendationsReceivedError",
)({ recommendationId: S.optional(S.String), message: S.optional(S.String) }) {}
export const NotifyRecommendationsReceivedErrorList = S.Array(
  NotifyRecommendationsReceivedError,
);
export class ContentReference extends S.Class<ContentReference>(
  "ContentReference",
)({
  knowledgeBaseArn: S.optional(S.String),
  knowledgeBaseId: S.optional(S.String),
  contentArn: S.optional(S.String),
  contentId: S.optional(S.String),
}) {}
export class Highlight extends S.Class<Highlight>("Highlight")({
  beginOffsetInclusive: S.optional(S.Number),
  endOffsetExclusive: S.optional(S.Number),
}) {}
export const Highlights = S.Array(Highlight);
export class DocumentText extends S.Class<DocumentText>("DocumentText")({
  text: S.optional(S.String),
  highlights: S.optional(Highlights),
}) {}
export class Document extends S.Class<Document>("Document")({
  contentReference: ContentReference,
  title: S.optional(DocumentText),
  excerpt: S.optional(DocumentText),
}) {}
export class ResultData extends S.Class<ResultData>("ResultData")({
  resultId: S.String,
  document: Document,
  relevanceScore: S.optional(S.Number),
}) {}
export const QueryResultsList = S.Array(ResultData);
export class KnowledgeBaseAssociationData extends S.Class<KnowledgeBaseAssociationData>(
  "KnowledgeBaseAssociationData",
)({
  knowledgeBaseId: S.optional(S.String),
  knowledgeBaseArn: S.optional(S.String),
}) {}
export const AssistantAssociationOutputData = S.Union(
  S.Struct({ knowledgeBaseAssociation: KnowledgeBaseAssociationData }),
);
export class AssistantAssociationSummary extends S.Class<AssistantAssociationSummary>(
  "AssistantAssociationSummary",
)({
  assistantAssociationId: S.String,
  assistantAssociationArn: S.String,
  assistantId: S.String,
  assistantArn: S.String,
  associationType: S.String,
  associationData: AssistantAssociationOutputData,
  tags: S.optional(Tags),
}) {}
export const AssistantAssociationSummaryList = S.Array(
  AssistantAssociationSummary,
);
export class KnowledgeBaseSummary extends S.Class<KnowledgeBaseSummary>(
  "KnowledgeBaseSummary",
)({
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
}) {}
export const KnowledgeBaseList = S.Array(KnowledgeBaseSummary);
export class ConnectConfiguration extends S.Class<ConnectConfiguration>(
  "ConnectConfiguration",
)({ instanceId: S.optional(S.String) }) {}
export const Configuration = S.Union(
  S.Struct({ connectConfiguration: ConnectConfiguration }),
);
export class ExternalSourceConfiguration extends S.Class<ExternalSourceConfiguration>(
  "ExternalSourceConfiguration",
)({ source: S.String, configuration: Configuration }) {}
export class ImportJobData extends S.Class<ImportJobData>("ImportJobData")({
  importJobId: S.String,
  knowledgeBaseId: S.String,
  uploadId: S.String,
  knowledgeBaseArn: S.String,
  importJobType: S.String,
  status: S.String,
  url: S.String,
  failedRecordReport: S.optional(S.String),
  urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  metadata: S.optional(ContentMetadata),
  externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
}) {}
export class ImportJobSummary extends S.Class<ImportJobSummary>(
  "ImportJobSummary",
)({
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
}) {}
export const ImportJobList = S.Array(ImportJobSummary);
export class QuickResponseSearchExpression extends S.Class<QuickResponseSearchExpression>(
  "QuickResponseSearchExpression",
)({
  queries: S.optional(QuickResponseQueryFieldList),
  filters: S.optional(QuickResponseFilterFieldList),
  orderOnField: S.optional(QuickResponseOrderField),
}) {}
export const Headers = S.Record({ key: S.String, value: S.String });
export class QuickResponseSummary extends S.Class<QuickResponseSummary>(
  "QuickResponseSummary",
)({
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
}) {}
export const QuickResponseSummaryList = S.Array(QuickResponseSummary);
export class AssistantData extends S.Class<AssistantData>("AssistantData")({
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
}) {}
export class CreateAssistantResponse extends S.Class<CreateAssistantResponse>(
  "CreateAssistantResponse",
)({ assistant: S.optional(AssistantData) }) {}
export class ListAssistantsResponse extends S.Class<ListAssistantsResponse>(
  "ListAssistantsResponse",
)({ assistantSummaries: AssistantList, nextToken: S.optional(S.String) }) {}
export class NotifyRecommendationsReceivedResponse extends S.Class<NotifyRecommendationsReceivedResponse>(
  "NotifyRecommendationsReceivedResponse",
)({
  recommendationIds: S.optional(RecommendationIdList),
  errors: S.optional(NotifyRecommendationsReceivedErrorList),
}) {}
export class QueryAssistantResponse extends S.Class<QueryAssistantResponse>(
  "QueryAssistantResponse",
)({ results: QueryResultsList, nextToken: S.optional(S.String) }) {}
export class SearchSessionsRequest extends S.Class<SearchSessionsRequest>(
  "SearchSessionsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    searchExpression: SearchExpression,
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/searchSessions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssistantAssociationData extends S.Class<AssistantAssociationData>(
  "AssistantAssociationData",
)({
  assistantAssociationId: S.String,
  assistantAssociationArn: S.String,
  assistantId: S.String,
  assistantArn: S.String,
  associationType: S.String,
  associationData: AssistantAssociationOutputData,
  tags: S.optional(Tags),
}) {}
export class CreateAssistantAssociationResponse extends S.Class<CreateAssistantAssociationResponse>(
  "CreateAssistantAssociationResponse",
)({ assistantAssociation: S.optional(AssistantAssociationData) }) {}
export class ListAssistantAssociationsResponse extends S.Class<ListAssistantAssociationsResponse>(
  "ListAssistantAssociationsResponse",
)({
  assistantAssociationSummaries: AssistantAssociationSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateKnowledgeBaseRequest extends S.Class<CreateKnowledgeBaseRequest>(
  "CreateKnowledgeBaseRequest",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    knowledgeBaseType: S.String,
    sourceConfiguration: S.optional(SourceConfiguration),
    renderingConfiguration: S.optional(RenderingConfiguration),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    description: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/knowledgeBases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKnowledgeBaseResponse extends S.Class<GetKnowledgeBaseResponse>(
  "GetKnowledgeBaseResponse",
)({ knowledgeBase: S.optional(KnowledgeBaseData) }) {}
export class ListKnowledgeBasesResponse extends S.Class<ListKnowledgeBasesResponse>(
  "ListKnowledgeBasesResponse",
)({
  knowledgeBaseSummaries: KnowledgeBaseList,
  nextToken: S.optional(S.String),
}) {}
export class GetImportJobResponse extends S.Class<GetImportJobResponse>(
  "GetImportJobResponse",
)({ importJob: S.optional(ImportJobData) }) {}
export class ListImportJobsResponse extends S.Class<ListImportJobsResponse>(
  "ListImportJobsResponse",
)({ importJobSummaries: ImportJobList, nextToken: S.optional(S.String) }) {}
export class SearchContentResponse extends S.Class<SearchContentResponse>(
  "SearchContentResponse",
)({ contentSummaries: ContentSummaryList, nextToken: S.optional(S.String) }) {}
export class SearchQuickResponsesRequest extends S.Class<SearchQuickResponsesRequest>(
  "SearchQuickResponsesRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: QuickResponseSearchExpression,
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    attributes: S.optional(ContactAttributes),
  },
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
) {}
export class StartContentUploadResponse extends S.Class<StartContentUploadResponse>(
  "StartContentUploadResponse",
)({
  uploadId: S.String,
  url: S.String,
  urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  headersToInclude: Headers,
}) {}
export class CreateContentResponse extends S.Class<CreateContentResponse>(
  "CreateContentResponse",
)({ content: S.optional(ContentData) }) {}
export class CreateQuickResponseResponse extends S.Class<CreateQuickResponseResponse>(
  "CreateQuickResponseResponse",
)({ quickResponse: S.optional(QuickResponseData) }) {}
export class ListQuickResponsesResponse extends S.Class<ListQuickResponsesResponse>(
  "ListQuickResponsesResponse",
)({
  quickResponseSummaries: QuickResponseSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class QueryRecommendationTriggerData extends S.Class<QueryRecommendationTriggerData>(
  "QueryRecommendationTriggerData",
)({ text: S.optional(S.String) }) {}
export class GetAssistantResponse extends S.Class<GetAssistantResponse>(
  "GetAssistantResponse",
)({ assistant: S.optional(AssistantData) }) {}
export class CreateSessionResponse extends S.Class<CreateSessionResponse>(
  "CreateSessionResponse",
)({ session: S.optional(SessionData) }) {}
export class CreateKnowledgeBaseResponse extends S.Class<CreateKnowledgeBaseResponse>(
  "CreateKnowledgeBaseResponse",
)({ knowledgeBase: S.optional(KnowledgeBaseData) }) {}
export class StartImportJobRequest extends S.Class<StartImportJobRequest>(
  "StartImportJobRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    importJobType: S.String,
    uploadId: S.String,
    clientToken: S.optional(S.String),
    metadata: S.optional(ContentMetadata),
    externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
  },
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
) {}
export const RecommendationTriggerData = S.Union(
  S.Struct({ query: QueryRecommendationTriggerData }),
);
export const ContactAttributeKeys = S.Array(S.String);
export class RecommendationTrigger extends S.Class<RecommendationTrigger>(
  "RecommendationTrigger",
)({
  id: S.String,
  type: S.String,
  source: S.String,
  data: RecommendationTriggerData,
  recommendationIds: RecommendationIdList,
}) {}
export const RecommendationTriggerList = S.Array(RecommendationTrigger);
export class SessionSummary extends S.Class<SessionSummary>("SessionSummary")({
  sessionId: S.String,
  sessionArn: S.String,
  assistantId: S.String,
  assistantArn: S.String,
}) {}
export const SessionSummaries = S.Array(SessionSummary);
export class QuickResponseSearchResultData extends S.Class<QuickResponseSearchResultData>(
  "QuickResponseSearchResultData",
)({
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
}) {}
export const QuickResponseSearchResultsList = S.Array(
  QuickResponseSearchResultData,
);
export class SearchSessionsResponse extends S.Class<SearchSessionsResponse>(
  "SearchSessionsResponse",
)({ sessionSummaries: SessionSummaries, nextToken: S.optional(S.String) }) {}
export class GetAssistantAssociationResponse extends S.Class<GetAssistantAssociationResponse>(
  "GetAssistantAssociationResponse",
)({ assistantAssociation: S.optional(AssistantAssociationData) }) {}
export class SearchQuickResponsesResponse extends S.Class<SearchQuickResponsesResponse>(
  "SearchQuickResponsesResponse",
)({
  results: QuickResponseSearchResultsList,
  nextToken: S.optional(S.String),
}) {}
export class StartImportJobResponse extends S.Class<StartImportJobResponse>(
  "StartImportJobResponse",
)({ importJob: S.optional(ImportJobData) }) {}
export class GetQuickResponseResponse extends S.Class<GetQuickResponseResponse>(
  "GetQuickResponseResponse",
)({ quickResponse: S.optional(QuickResponseData) }) {}
export class RecommendationData extends S.Class<RecommendationData>(
  "RecommendationData",
)({
  recommendationId: S.String,
  document: Document,
  relevanceScore: S.optional(S.Number),
  relevanceLevel: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const RecommendationList = S.Array(RecommendationData);
export class GetRecommendationsResponse extends S.Class<GetRecommendationsResponse>(
  "GetRecommendationsResponse",
)({
  recommendations: RecommendationList,
  triggers: S.optional(RecommendationTriggerList),
}) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  { message: S.optional(S.String) },
  T.Retryable(),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes an assistant.
 */
export const deleteAssistant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAssistants = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAssistantsRequest,
    output: ListAssistantsResponse,
    errors: [AccessDeniedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "assistantSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Removes the specified recommendations from the specified assistant's queue of newly
 * available recommendations. You can use this API in conjunction with GetRecommendations and a `waitTimeSeconds` input for long-polling
 * behavior and avoiding duplicate recommendations.
 */
export const notifyRecommendationsReceived =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAssistantAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listKnowledgeBases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListKnowledgeBasesRequest,
    output: ListKnowledgeBasesResponse,
    errors: [AccessDeniedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "knowledgeBaseSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves the started import job.
 */
export const getImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImportJobsRequest,
    output: ListImportJobsResponse,
    errors: [AccessDeniedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "importJobSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Searches for content in a specified knowledge base. Can be used to get a specific content
 * resource by its name.
 */
export const searchContent = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Get a URL to upload content to a knowledge base. To upload content, first make a PUT
 * request to the returned URL with your file, making sure to include the required headers. Then
 * use CreateContent to finalize the content creation process or UpdateContent to modify an existing resource. You can only upload content to a
 * knowledge base of type CUSTOM.
 */
export const startContentUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateQuickResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listQuickResponses = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Adds the specified tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, TooManyTagsException],
}));
/**
 * Retrieves information for a specified session.
 */
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateKnowledgeBaseTemplateUri =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listContents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves summary information about the content.
 */
export const getContentSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAssistantAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAssistantAssociationRequest,
    output: DeleteAssistantAssociationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Removes a URI template from a knowledge base.
 */
export const removeKnowledgeBaseTemplateUri =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteQuickResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAssistant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const queryAssistant = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Creates a session. A session is a contextual container used for generating
 * recommendations. Amazon Connect creates a new Wisdom session for each contact on which
 * Wisdom is enabled.
 */
export const createSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSessionRequest,
  output: CreateSessionResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Creates an Amazon Connect Wisdom assistant.
 */
export const createAssistant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAssistantAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAssistantAssociationRequest,
    output: CreateAssistantAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Creates Wisdom content. Before to calling this API, use StartContentUpload to
 * upload an asset.
 */
export const createContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createQuickResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchSessions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves information about an assistant association.
 */
export const getAssistantAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAssistantAssociationRequest,
    output: GetAssistantAssociationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Searches existing Wisdom quick responses in a Wisdom knowledge base.
 */
export const searchQuickResponses =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQuickResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecommendationsRequest,
  output: GetRecommendationsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
