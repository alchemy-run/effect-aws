import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "kendra",
  serviceShapeName: "AWSKendraFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "kendra" });
const ver = T.ServiceVersion("2019-02-03");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://kendra-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://kendra-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://kendra.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://kendra.{Region}.{PartitionResult#dnsSuffix}",
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
export const DocumentIdList = S.Array(S.String);
export const FeaturedResultsSetIdList = S.Array(S.String);
export const QueryTextList = S.Array(S.String);
export class EntityConfiguration extends S.Class<EntityConfiguration>(
  "EntityConfiguration",
)({ EntityId: S.String, EntityType: S.String }) {}
export const DisassociateEntityList = S.Array(EntityConfiguration);
export const EntityIdsList = S.Array(S.String);
export const SuggestionTypes = S.Array(S.String);
export const DocumentAttributeKeyList = S.Array(S.String);
export class SortingConfiguration extends S.Class<SortingConfiguration>(
  "SortingConfiguration",
)({ DocumentAttributeKey: S.String, SortOrder: S.String }) {}
export const SortingConfigurationList = S.Array(SortingConfiguration);
export const TagKeyList = S.Array(S.String);
export class BatchDeleteFeaturedResultsSetRequest extends S.Class<BatchDeleteFeaturedResultsSetRequest>(
  "BatchDeleteFeaturedResultsSetRequest",
)(
  { IndexId: S.String, FeaturedResultsSetIds: FeaturedResultsSetIdList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ClearQuerySuggestionsRequest extends S.Class<ClearQuerySuggestionsRequest>(
  "ClearQuerySuggestionsRequest",
)(
  { IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ClearQuerySuggestionsResponse extends S.Class<ClearQuerySuggestionsResponse>(
  "ClearQuerySuggestionsResponse",
)({}) {}
export class S3Path extends S.Class<S3Path>("S3Path")({
  Bucket: S.String,
  Key: S.String,
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateQuerySuggestionsBlockListRequest extends S.Class<CreateQuerySuggestionsBlockListRequest>(
  "CreateQuerySuggestionsBlockListRequest",
)(
  {
    IndexId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    SourceS3Path: S3Path,
    ClientToken: S.optional(S.String),
    RoleArn: S.String,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateThesaurusRequest extends S.Class<CreateThesaurusRequest>(
  "CreateThesaurusRequest",
)(
  {
    IndexId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    RoleArn: S.String,
    Tags: S.optional(TagList),
    SourceS3Path: S3Path,
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccessControlConfigurationRequest extends S.Class<DeleteAccessControlConfigurationRequest>(
  "DeleteAccessControlConfigurationRequest",
)(
  { IndexId: S.String, Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccessControlConfigurationResponse extends S.Class<DeleteAccessControlConfigurationResponse>(
  "DeleteAccessControlConfigurationResponse",
)({}) {}
export class DeleteDataSourceRequest extends S.Class<DeleteDataSourceRequest>(
  "DeleteDataSourceRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDataSourceResponse extends S.Class<DeleteDataSourceResponse>(
  "DeleteDataSourceResponse",
)({}) {}
export class DeleteExperienceRequest extends S.Class<DeleteExperienceRequest>(
  "DeleteExperienceRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteExperienceResponse extends S.Class<DeleteExperienceResponse>(
  "DeleteExperienceResponse",
)({}) {}
export class DeleteFaqRequest extends S.Class<DeleteFaqRequest>(
  "DeleteFaqRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFaqResponse extends S.Class<DeleteFaqResponse>(
  "DeleteFaqResponse",
)({}) {}
export class DeleteIndexRequest extends S.Class<DeleteIndexRequest>(
  "DeleteIndexRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIndexResponse extends S.Class<DeleteIndexResponse>(
  "DeleteIndexResponse",
)({}) {}
export class DeletePrincipalMappingRequest extends S.Class<DeletePrincipalMappingRequest>(
  "DeletePrincipalMappingRequest",
)(
  {
    IndexId: S.String,
    DataSourceId: S.optional(S.String),
    GroupId: S.String,
    OrderingId: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePrincipalMappingResponse extends S.Class<DeletePrincipalMappingResponse>(
  "DeletePrincipalMappingResponse",
)({}) {}
export class DeleteQuerySuggestionsBlockListRequest extends S.Class<DeleteQuerySuggestionsBlockListRequest>(
  "DeleteQuerySuggestionsBlockListRequest",
)(
  { IndexId: S.String, Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteQuerySuggestionsBlockListResponse extends S.Class<DeleteQuerySuggestionsBlockListResponse>(
  "DeleteQuerySuggestionsBlockListResponse",
)({}) {}
export class DeleteThesaurusRequest extends S.Class<DeleteThesaurusRequest>(
  "DeleteThesaurusRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteThesaurusResponse extends S.Class<DeleteThesaurusResponse>(
  "DeleteThesaurusResponse",
)({}) {}
export class DescribeAccessControlConfigurationRequest extends S.Class<DescribeAccessControlConfigurationRequest>(
  "DescribeAccessControlConfigurationRequest",
)(
  { IndexId: S.String, Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataSourceRequest extends S.Class<DescribeDataSourceRequest>(
  "DescribeDataSourceRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExperienceRequest extends S.Class<DescribeExperienceRequest>(
  "DescribeExperienceRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFaqRequest extends S.Class<DescribeFaqRequest>(
  "DescribeFaqRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFeaturedResultsSetRequest extends S.Class<DescribeFeaturedResultsSetRequest>(
  "DescribeFeaturedResultsSetRequest",
)(
  { IndexId: S.String, FeaturedResultsSetId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeIndexRequest extends S.Class<DescribeIndexRequest>(
  "DescribeIndexRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePrincipalMappingRequest extends S.Class<DescribePrincipalMappingRequest>(
  "DescribePrincipalMappingRequest",
)(
  { IndexId: S.String, DataSourceId: S.optional(S.String), GroupId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeQuerySuggestionsBlockListRequest extends S.Class<DescribeQuerySuggestionsBlockListRequest>(
  "DescribeQuerySuggestionsBlockListRequest",
)(
  { IndexId: S.String, Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeQuerySuggestionsConfigRequest extends S.Class<DescribeQuerySuggestionsConfigRequest>(
  "DescribeQuerySuggestionsConfigRequest",
)(
  { IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeThesaurusRequest extends S.Class<DescribeThesaurusRequest>(
  "DescribeThesaurusRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateEntitiesFromExperienceRequest extends S.Class<DisassociateEntitiesFromExperienceRequest>(
  "DisassociateEntitiesFromExperienceRequest",
)(
  { Id: S.String, IndexId: S.String, EntityList: DisassociateEntityList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociatePersonasFromEntitiesRequest extends S.Class<DisassociatePersonasFromEntitiesRequest>(
  "DisassociatePersonasFromEntitiesRequest",
)(
  { Id: S.String, IndexId: S.String, EntityIds: EntityIdsList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSnapshotsRequest extends S.Class<GetSnapshotsRequest>(
  "GetSnapshotsRequest",
)(
  {
    IndexId: S.String,
    Interval: S.String,
    MetricType: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccessControlConfigurationsRequest extends S.Class<ListAccessControlConfigurationsRequest>(
  "ListAccessControlConfigurationsRequest",
)(
  {
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDataSourcesRequest extends S.Class<ListDataSourcesRequest>(
  "ListDataSourcesRequest",
)(
  {
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEntityPersonasRequest extends S.Class<ListEntityPersonasRequest>(
  "ListEntityPersonasRequest",
)(
  {
    Id: S.String,
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExperienceEntitiesRequest extends S.Class<ListExperienceEntitiesRequest>(
  "ListExperienceEntitiesRequest",
)(
  { Id: S.String, IndexId: S.String, NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExperiencesRequest extends S.Class<ListExperiencesRequest>(
  "ListExperiencesRequest",
)(
  {
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFaqsRequest extends S.Class<ListFaqsRequest>(
  "ListFaqsRequest",
)(
  {
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFeaturedResultsSetsRequest extends S.Class<ListFeaturedResultsSetsRequest>(
  "ListFeaturedResultsSetsRequest",
)(
  {
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGroupsOlderThanOrderingIdRequest extends S.Class<ListGroupsOlderThanOrderingIdRequest>(
  "ListGroupsOlderThanOrderingIdRequest",
)(
  {
    IndexId: S.String,
    DataSourceId: S.optional(S.String),
    OrderingId: S.Number,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIndicesRequest extends S.Class<ListIndicesRequest>(
  "ListIndicesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListQuerySuggestionsBlockListsRequest extends S.Class<ListQuerySuggestionsBlockListsRequest>(
  "ListQuerySuggestionsBlockListsRequest",
)(
  {
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListThesauriRequest extends S.Class<ListThesauriRequest>(
  "ListThesauriRequest",
)(
  {
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const DocumentAttributeStringListValue = S.Array(S.String);
export class DocumentAttributeValue extends S.Class<DocumentAttributeValue>(
  "DocumentAttributeValue",
)({
  StringValue: S.optional(S.String),
  StringListValue: S.optional(DocumentAttributeStringListValue),
  LongValue: S.optional(S.Number),
  DateValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DocumentAttribute extends S.Class<DocumentAttribute>(
  "DocumentAttribute",
)({ Key: S.String, Value: DocumentAttributeValue }) {}
export class AttributeFilter extends S.Class<AttributeFilter>(
  "AttributeFilter",
)({
  AndAllFilters: S.optional(S.suspend(() => AttributeFilterList)),
  OrAllFilters: S.optional(S.suspend(() => AttributeFilterList)),
  NotFilter: S.optional(
    S.suspend((): S.Schema<AttributeFilter, any> => AttributeFilter),
  ),
  EqualsTo: S.optional(DocumentAttribute),
  ContainsAll: S.optional(DocumentAttribute),
  ContainsAny: S.optional(DocumentAttribute),
  GreaterThan: S.optional(DocumentAttribute),
  GreaterThanOrEquals: S.optional(DocumentAttribute),
  LessThan: S.optional(DocumentAttribute),
  LessThanOrEquals: S.optional(DocumentAttribute),
}) {}
export const ValueImportanceMap = S.Record({ key: S.String, value: S.Number });
export class Relevance extends S.Class<Relevance>("Relevance")({
  Freshness: S.optional(S.Boolean),
  Importance: S.optional(S.Number),
  Duration: S.optional(S.String),
  RankOrder: S.optional(S.String),
  ValueImportanceMap: S.optional(ValueImportanceMap),
}) {}
export class DocumentRelevanceConfiguration extends S.Class<DocumentRelevanceConfiguration>(
  "DocumentRelevanceConfiguration",
)({ Name: S.String, Relevance: Relevance }) {}
export const DocumentRelevanceOverrideConfigurationList = S.Array(
  DocumentRelevanceConfiguration,
);
export const Groups = S.Array(S.String);
export class DataSourceGroup extends S.Class<DataSourceGroup>(
  "DataSourceGroup",
)({ GroupId: S.String, DataSourceId: S.String }) {}
export const DataSourceGroups = S.Array(DataSourceGroup);
export class UserContext extends S.Class<UserContext>("UserContext")({
  Token: S.optional(S.String),
  UserId: S.optional(S.String),
  Groups: S.optional(Groups),
  DataSourceGroups: S.optional(DataSourceGroups),
}) {}
export class RetrieveRequest extends S.Class<RetrieveRequest>(
  "RetrieveRequest",
)(
  {
    IndexId: S.String,
    QueryText: S.String,
    AttributeFilter: S.optional(AttributeFilter),
    RequestedDocumentAttributes: S.optional(DocumentAttributeKeyList),
    DocumentRelevanceOverrideConfigurations: S.optional(
      DocumentRelevanceOverrideConfigurationList,
    ),
    PageNumber: S.optional(S.Number),
    PageSize: S.optional(S.Number),
    UserContext: S.optional(UserContext),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDataSourceSyncJobRequest extends S.Class<StartDataSourceSyncJobRequest>(
  "StartDataSourceSyncJobRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDataSourceSyncJobRequest extends S.Class<StopDataSourceSyncJobRequest>(
  "StopDataSourceSyncJobRequest",
)(
  { Id: S.String, IndexId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDataSourceSyncJobResponse extends S.Class<StopDataSourceSyncJobResponse>(
  "StopDataSourceSyncJobResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class Principal extends S.Class<Principal>("Principal")({
  Name: S.String,
  Type: S.String,
  Access: S.String,
  DataSourceId: S.optional(S.String),
}) {}
export const PrincipalList = S.Array(Principal);
export class HierarchicalPrincipal extends S.Class<HierarchicalPrincipal>(
  "HierarchicalPrincipal",
)({ PrincipalList: PrincipalList }) {}
export const HierarchicalPrincipalList = S.Array(HierarchicalPrincipal);
export class UpdateAccessControlConfigurationRequest extends S.Class<UpdateAccessControlConfigurationRequest>(
  "UpdateAccessControlConfigurationRequest",
)(
  {
    IndexId: S.String,
    Id: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    AccessControlList: S.optional(PrincipalList),
    HierarchicalAccessControlList: S.optional(HierarchicalPrincipalList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAccessControlConfigurationResponse extends S.Class<UpdateAccessControlConfigurationResponse>(
  "UpdateAccessControlConfigurationResponse",
)({}) {}
export const DataSourceInclusionsExclusionsStrings = S.Array(S.String);
export class DocumentsMetadataConfiguration extends S.Class<DocumentsMetadataConfiguration>(
  "DocumentsMetadataConfiguration",
)({ S3Prefix: S.optional(S.String) }) {}
export class AccessControlListConfiguration extends S.Class<AccessControlListConfiguration>(
  "AccessControlListConfiguration",
)({ KeyPath: S.optional(S.String) }) {}
export class S3DataSourceConfiguration extends S.Class<S3DataSourceConfiguration>(
  "S3DataSourceConfiguration",
)({
  BucketName: S.String,
  InclusionPrefixes: S.optional(DataSourceInclusionsExclusionsStrings),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  DocumentsMetadataConfiguration: S.optional(DocumentsMetadataConfiguration),
  AccessControlListConfiguration: S.optional(AccessControlListConfiguration),
}) {}
export const SharePointUrlList = S.Array(S.String);
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export class DataSourceVpcConfiguration extends S.Class<DataSourceVpcConfiguration>(
  "DataSourceVpcConfiguration",
)({ SubnetIds: SubnetIdList, SecurityGroupIds: SecurityGroupIdList }) {}
export class DataSourceToIndexFieldMapping extends S.Class<DataSourceToIndexFieldMapping>(
  "DataSourceToIndexFieldMapping",
)({
  DataSourceFieldName: S.String,
  DateFieldFormat: S.optional(S.String),
  IndexFieldName: S.String,
}) {}
export const DataSourceToIndexFieldMappingList = S.Array(
  DataSourceToIndexFieldMapping,
);
export class ProxyConfiguration extends S.Class<ProxyConfiguration>(
  "ProxyConfiguration",
)({ Host: S.String, Port: S.Number, Credentials: S.optional(S.String) }) {}
export class SharePointConfiguration extends S.Class<SharePointConfiguration>(
  "SharePointConfiguration",
)({
  SharePointVersion: S.String,
  Urls: SharePointUrlList,
  SecretArn: S.String,
  CrawlAttachments: S.optional(S.Boolean),
  UseChangeLog: S.optional(S.Boolean),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  DocumentTitleFieldName: S.optional(S.String),
  DisableLocalGroups: S.optional(S.Boolean),
  SslCertificateS3Path: S.optional(S3Path),
  AuthenticationType: S.optional(S.String),
  ProxyConfiguration: S.optional(ProxyConfiguration),
}) {}
export class ConnectionConfiguration extends S.Class<ConnectionConfiguration>(
  "ConnectionConfiguration",
)({
  DatabaseHost: S.String,
  DatabasePort: S.Number,
  DatabaseName: S.String,
  TableName: S.String,
  SecretArn: S.String,
}) {}
export const ChangeDetectingColumns = S.Array(S.String);
export class ColumnConfiguration extends S.Class<ColumnConfiguration>(
  "ColumnConfiguration",
)({
  DocumentIdColumnName: S.String,
  DocumentDataColumnName: S.String,
  DocumentTitleColumnName: S.optional(S.String),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  ChangeDetectingColumns: ChangeDetectingColumns,
}) {}
export class AclConfiguration extends S.Class<AclConfiguration>(
  "AclConfiguration",
)({ AllowedGroupsColumnName: S.String }) {}
export class SqlConfiguration extends S.Class<SqlConfiguration>(
  "SqlConfiguration",
)({ QueryIdentifiersEnclosingOption: S.optional(S.String) }) {}
export class DatabaseConfiguration extends S.Class<DatabaseConfiguration>(
  "DatabaseConfiguration",
)({
  DatabaseEngineType: S.String,
  ConnectionConfiguration: ConnectionConfiguration,
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
  ColumnConfiguration: ColumnConfiguration,
  AclConfiguration: S.optional(AclConfiguration),
  SqlConfiguration: S.optional(SqlConfiguration),
}) {}
export class SalesforceStandardObjectConfiguration extends S.Class<SalesforceStandardObjectConfiguration>(
  "SalesforceStandardObjectConfiguration",
)({
  Name: S.String,
  DocumentDataFieldName: S.String,
  DocumentTitleFieldName: S.optional(S.String),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
}) {}
export const SalesforceStandardObjectConfigurationList = S.Array(
  SalesforceStandardObjectConfiguration,
);
export const SalesforceKnowledgeArticleStateList = S.Array(S.String);
export class SalesforceStandardKnowledgeArticleTypeConfiguration extends S.Class<SalesforceStandardKnowledgeArticleTypeConfiguration>(
  "SalesforceStandardKnowledgeArticleTypeConfiguration",
)({
  DocumentDataFieldName: S.String,
  DocumentTitleFieldName: S.optional(S.String),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
}) {}
export class SalesforceCustomKnowledgeArticleTypeConfiguration extends S.Class<SalesforceCustomKnowledgeArticleTypeConfiguration>(
  "SalesforceCustomKnowledgeArticleTypeConfiguration",
)({
  Name: S.String,
  DocumentDataFieldName: S.String,
  DocumentTitleFieldName: S.optional(S.String),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
}) {}
export const SalesforceCustomKnowledgeArticleTypeConfigurationList = S.Array(
  SalesforceCustomKnowledgeArticleTypeConfiguration,
);
export class SalesforceKnowledgeArticleConfiguration extends S.Class<SalesforceKnowledgeArticleConfiguration>(
  "SalesforceKnowledgeArticleConfiguration",
)({
  IncludedStates: SalesforceKnowledgeArticleStateList,
  StandardKnowledgeArticleTypeConfiguration: S.optional(
    SalesforceStandardKnowledgeArticleTypeConfiguration,
  ),
  CustomKnowledgeArticleTypeConfigurations: S.optional(
    SalesforceCustomKnowledgeArticleTypeConfigurationList,
  ),
}) {}
export const SalesforceChatterFeedIncludeFilterTypes = S.Array(S.String);
export class SalesforceChatterFeedConfiguration extends S.Class<SalesforceChatterFeedConfiguration>(
  "SalesforceChatterFeedConfiguration",
)({
  DocumentDataFieldName: S.String,
  DocumentTitleFieldName: S.optional(S.String),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  IncludeFilterTypes: S.optional(SalesforceChatterFeedIncludeFilterTypes),
}) {}
export class SalesforceStandardObjectAttachmentConfiguration extends S.Class<SalesforceStandardObjectAttachmentConfiguration>(
  "SalesforceStandardObjectAttachmentConfiguration",
)({
  DocumentTitleFieldName: S.optional(S.String),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
}) {}
export class SalesforceConfiguration extends S.Class<SalesforceConfiguration>(
  "SalesforceConfiguration",
)({
  ServerUrl: S.String,
  SecretArn: S.String,
  StandardObjectConfigurations: S.optional(
    SalesforceStandardObjectConfigurationList,
  ),
  KnowledgeArticleConfiguration: S.optional(
    SalesforceKnowledgeArticleConfiguration,
  ),
  ChatterFeedConfiguration: S.optional(SalesforceChatterFeedConfiguration),
  CrawlAttachments: S.optional(S.Boolean),
  StandardObjectAttachmentConfiguration: S.optional(
    SalesforceStandardObjectAttachmentConfiguration,
  ),
  IncludeAttachmentFilePatterns: S.optional(
    DataSourceInclusionsExclusionsStrings,
  ),
  ExcludeAttachmentFilePatterns: S.optional(
    DataSourceInclusionsExclusionsStrings,
  ),
}) {}
export const OneDriveUserList = S.Array(S.String);
export class OneDriveUsers extends S.Class<OneDriveUsers>("OneDriveUsers")({
  OneDriveUserList: S.optional(OneDriveUserList),
  OneDriveUserS3Path: S.optional(S3Path),
}) {}
export class OneDriveConfiguration extends S.Class<OneDriveConfiguration>(
  "OneDriveConfiguration",
)({
  TenantDomain: S.String,
  SecretArn: S.String,
  OneDriveUsers: OneDriveUsers,
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  DisableLocalGroups: S.optional(S.Boolean),
}) {}
export class ServiceNowKnowledgeArticleConfiguration extends S.Class<ServiceNowKnowledgeArticleConfiguration>(
  "ServiceNowKnowledgeArticleConfiguration",
)({
  CrawlAttachments: S.optional(S.Boolean),
  IncludeAttachmentFilePatterns: S.optional(
    DataSourceInclusionsExclusionsStrings,
  ),
  ExcludeAttachmentFilePatterns: S.optional(
    DataSourceInclusionsExclusionsStrings,
  ),
  DocumentDataFieldName: S.String,
  DocumentTitleFieldName: S.optional(S.String),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  FilterQuery: S.optional(S.String),
}) {}
export class ServiceNowServiceCatalogConfiguration extends S.Class<ServiceNowServiceCatalogConfiguration>(
  "ServiceNowServiceCatalogConfiguration",
)({
  CrawlAttachments: S.optional(S.Boolean),
  IncludeAttachmentFilePatterns: S.optional(
    DataSourceInclusionsExclusionsStrings,
  ),
  ExcludeAttachmentFilePatterns: S.optional(
    DataSourceInclusionsExclusionsStrings,
  ),
  DocumentDataFieldName: S.String,
  DocumentTitleFieldName: S.optional(S.String),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
}) {}
export class ServiceNowConfiguration extends S.Class<ServiceNowConfiguration>(
  "ServiceNowConfiguration",
)({
  HostUrl: S.String,
  SecretArn: S.String,
  ServiceNowBuildVersion: S.String,
  KnowledgeArticleConfiguration: S.optional(
    ServiceNowKnowledgeArticleConfiguration,
  ),
  ServiceCatalogConfiguration: S.optional(
    ServiceNowServiceCatalogConfiguration,
  ),
  AuthenticationType: S.optional(S.String),
}) {}
export const ConfluenceSpaceList = S.Array(S.String);
export class ConfluenceSpaceToIndexFieldMapping extends S.Class<ConfluenceSpaceToIndexFieldMapping>(
  "ConfluenceSpaceToIndexFieldMapping",
)({
  DataSourceFieldName: S.optional(S.String),
  DateFieldFormat: S.optional(S.String),
  IndexFieldName: S.optional(S.String),
}) {}
export const ConfluenceSpaceFieldMappingsList = S.Array(
  ConfluenceSpaceToIndexFieldMapping,
);
export class ConfluenceSpaceConfiguration extends S.Class<ConfluenceSpaceConfiguration>(
  "ConfluenceSpaceConfiguration",
)({
  CrawlPersonalSpaces: S.optional(S.Boolean),
  CrawlArchivedSpaces: S.optional(S.Boolean),
  IncludeSpaces: S.optional(ConfluenceSpaceList),
  ExcludeSpaces: S.optional(ConfluenceSpaceList),
  SpaceFieldMappings: S.optional(ConfluenceSpaceFieldMappingsList),
}) {}
export class ConfluencePageToIndexFieldMapping extends S.Class<ConfluencePageToIndexFieldMapping>(
  "ConfluencePageToIndexFieldMapping",
)({
  DataSourceFieldName: S.optional(S.String),
  DateFieldFormat: S.optional(S.String),
  IndexFieldName: S.optional(S.String),
}) {}
export const ConfluencePageFieldMappingsList = S.Array(
  ConfluencePageToIndexFieldMapping,
);
export class ConfluencePageConfiguration extends S.Class<ConfluencePageConfiguration>(
  "ConfluencePageConfiguration",
)({ PageFieldMappings: S.optional(ConfluencePageFieldMappingsList) }) {}
export class ConfluenceBlogToIndexFieldMapping extends S.Class<ConfluenceBlogToIndexFieldMapping>(
  "ConfluenceBlogToIndexFieldMapping",
)({
  DataSourceFieldName: S.optional(S.String),
  DateFieldFormat: S.optional(S.String),
  IndexFieldName: S.optional(S.String),
}) {}
export const ConfluenceBlogFieldMappingsList = S.Array(
  ConfluenceBlogToIndexFieldMapping,
);
export class ConfluenceBlogConfiguration extends S.Class<ConfluenceBlogConfiguration>(
  "ConfluenceBlogConfiguration",
)({ BlogFieldMappings: S.optional(ConfluenceBlogFieldMappingsList) }) {}
export class ConfluenceAttachmentToIndexFieldMapping extends S.Class<ConfluenceAttachmentToIndexFieldMapping>(
  "ConfluenceAttachmentToIndexFieldMapping",
)({
  DataSourceFieldName: S.optional(S.String),
  DateFieldFormat: S.optional(S.String),
  IndexFieldName: S.optional(S.String),
}) {}
export const ConfluenceAttachmentFieldMappingsList = S.Array(
  ConfluenceAttachmentToIndexFieldMapping,
);
export class ConfluenceAttachmentConfiguration extends S.Class<ConfluenceAttachmentConfiguration>(
  "ConfluenceAttachmentConfiguration",
)({
  CrawlAttachments: S.optional(S.Boolean),
  AttachmentFieldMappings: S.optional(ConfluenceAttachmentFieldMappingsList),
}) {}
export class ConfluenceConfiguration extends S.Class<ConfluenceConfiguration>(
  "ConfluenceConfiguration",
)({
  ServerUrl: S.String,
  SecretArn: S.String,
  Version: S.String,
  SpaceConfiguration: S.optional(ConfluenceSpaceConfiguration),
  PageConfiguration: S.optional(ConfluencePageConfiguration),
  BlogConfiguration: S.optional(ConfluenceBlogConfiguration),
  AttachmentConfiguration: S.optional(ConfluenceAttachmentConfiguration),
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ProxyConfiguration: S.optional(ProxyConfiguration),
  AuthenticationType: S.optional(S.String),
}) {}
export const ExcludeMimeTypesList = S.Array(S.String);
export const ExcludeUserAccountsList = S.Array(S.String);
export const ExcludeSharedDrivesList = S.Array(S.String);
export class GoogleDriveConfiguration extends S.Class<GoogleDriveConfiguration>(
  "GoogleDriveConfiguration",
)({
  SecretArn: S.String,
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  ExcludeMimeTypes: S.optional(ExcludeMimeTypesList),
  ExcludeUserAccounts: S.optional(ExcludeUserAccountsList),
  ExcludeSharedDrives: S.optional(ExcludeSharedDrivesList),
}) {}
export const SeedUrlList = S.Array(S.String);
export class SeedUrlConfiguration extends S.Class<SeedUrlConfiguration>(
  "SeedUrlConfiguration",
)({ SeedUrls: SeedUrlList, WebCrawlerMode: S.optional(S.String) }) {}
export const SiteMapsList = S.Array(S.String);
export class SiteMapsConfiguration extends S.Class<SiteMapsConfiguration>(
  "SiteMapsConfiguration",
)({ SiteMaps: SiteMapsList }) {}
export class Urls extends S.Class<Urls>("Urls")({
  SeedUrlConfiguration: S.optional(SeedUrlConfiguration),
  SiteMapsConfiguration: S.optional(SiteMapsConfiguration),
}) {}
export class BasicAuthenticationConfiguration extends S.Class<BasicAuthenticationConfiguration>(
  "BasicAuthenticationConfiguration",
)({ Host: S.String, Port: S.Number, Credentials: S.String }) {}
export const BasicAuthenticationConfigurationList = S.Array(
  BasicAuthenticationConfiguration,
);
export class AuthenticationConfiguration extends S.Class<AuthenticationConfiguration>(
  "AuthenticationConfiguration",
)({ BasicAuthentication: S.optional(BasicAuthenticationConfigurationList) }) {}
export class WebCrawlerConfiguration extends S.Class<WebCrawlerConfiguration>(
  "WebCrawlerConfiguration",
)({
  Urls: Urls,
  CrawlDepth: S.optional(S.Number),
  MaxLinksPerPage: S.optional(S.Number),
  MaxContentSizePerPageInMegaBytes: S.optional(S.Number),
  MaxUrlsPerMinuteCrawlRate: S.optional(S.Number),
  UrlInclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  UrlExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ProxyConfiguration: S.optional(ProxyConfiguration),
  AuthenticationConfiguration: S.optional(AuthenticationConfiguration),
}) {}
export class WorkDocsConfiguration extends S.Class<WorkDocsConfiguration>(
  "WorkDocsConfiguration",
)({
  OrganizationId: S.String,
  CrawlComments: S.optional(S.Boolean),
  UseChangeLog: S.optional(S.Boolean),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
}) {}
export class FsxConfiguration extends S.Class<FsxConfiguration>(
  "FsxConfiguration",
)({
  FileSystemId: S.String,
  FileSystemType: S.String,
  VpcConfiguration: DataSourceVpcConfiguration,
  SecretArn: S.optional(S.String),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
}) {}
export const SlackEntityList = S.Array(S.String);
export const PrivateChannelFilter = S.Array(S.String);
export const PublicChannelFilter = S.Array(S.String);
export class SlackConfiguration extends S.Class<SlackConfiguration>(
  "SlackConfiguration",
)({
  TeamId: S.String,
  SecretArn: S.String,
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
  SlackEntityList: SlackEntityList,
  UseChangeLog: S.optional(S.Boolean),
  CrawlBotMessage: S.optional(S.Boolean),
  ExcludeArchived: S.optional(S.Boolean),
  SinceCrawlDate: S.String,
  LookBackPeriod: S.optional(S.Number),
  PrivateChannelFilter: S.optional(PrivateChannelFilter),
  PublicChannelFilter: S.optional(PublicChannelFilter),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
}) {}
export class BoxConfiguration extends S.Class<BoxConfiguration>(
  "BoxConfiguration",
)({
  EnterpriseId: S.String,
  SecretArn: S.String,
  UseChangeLog: S.optional(S.Boolean),
  CrawlComments: S.optional(S.Boolean),
  CrawlTasks: S.optional(S.Boolean),
  CrawlWebLinks: S.optional(S.Boolean),
  FileFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  TaskFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  CommentFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  WebLinkFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
}) {}
export const FolderIdList = S.Array(S.String);
export class QuipConfiguration extends S.Class<QuipConfiguration>(
  "QuipConfiguration",
)({
  Domain: S.String,
  SecretArn: S.String,
  CrawlFileComments: S.optional(S.Boolean),
  CrawlChatRooms: S.optional(S.Boolean),
  CrawlAttachments: S.optional(S.Boolean),
  FolderIds: S.optional(FolderIdList),
  ThreadFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  MessageFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  AttachmentFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
}) {}
export const Project = S.Array(S.String);
export const IssueType = S.Array(S.String);
export const JiraStatus = S.Array(S.String);
export const IssueSubEntityFilter = S.Array(S.String);
export class JiraConfiguration extends S.Class<JiraConfiguration>(
  "JiraConfiguration",
)({
  JiraAccountUrl: S.String,
  SecretArn: S.String,
  UseChangeLog: S.optional(S.Boolean),
  Project: S.optional(Project),
  IssueType: S.optional(IssueType),
  Status: S.optional(JiraStatus),
  IssueSubEntityFilter: S.optional(IssueSubEntityFilter),
  AttachmentFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  CommentFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  IssueFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  ProjectFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  WorkLogFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
}) {}
export class SaaSConfiguration extends S.Class<SaaSConfiguration>(
  "SaaSConfiguration",
)({ OrganizationName: S.String, HostUrl: S.String }) {}
export class OnPremiseConfiguration extends S.Class<OnPremiseConfiguration>(
  "OnPremiseConfiguration",
)({
  HostUrl: S.String,
  OrganizationName: S.String,
  SslCertificateS3Path: S3Path,
}) {}
export class GitHubDocumentCrawlProperties extends S.Class<GitHubDocumentCrawlProperties>(
  "GitHubDocumentCrawlProperties",
)({
  CrawlRepositoryDocuments: S.optional(S.Boolean),
  CrawlIssue: S.optional(S.Boolean),
  CrawlIssueComment: S.optional(S.Boolean),
  CrawlIssueCommentAttachment: S.optional(S.Boolean),
  CrawlPullRequest: S.optional(S.Boolean),
  CrawlPullRequestComment: S.optional(S.Boolean),
  CrawlPullRequestCommentAttachment: S.optional(S.Boolean),
}) {}
export const RepositoryNames = S.Array(S.String);
export const StringList = S.Array(S.String);
export class GitHubConfiguration extends S.Class<GitHubConfiguration>(
  "GitHubConfiguration",
)({
  SaaSConfiguration: S.optional(SaaSConfiguration),
  OnPremiseConfiguration: S.optional(OnPremiseConfiguration),
  Type: S.optional(S.String),
  SecretArn: S.String,
  UseChangeLog: S.optional(S.Boolean),
  GitHubDocumentCrawlProperties: S.optional(GitHubDocumentCrawlProperties),
  RepositoryFilter: S.optional(RepositoryNames),
  InclusionFolderNamePatterns: S.optional(StringList),
  InclusionFileTypePatterns: S.optional(StringList),
  InclusionFileNamePatterns: S.optional(StringList),
  ExclusionFolderNamePatterns: S.optional(StringList),
  ExclusionFileTypePatterns: S.optional(StringList),
  ExclusionFileNamePatterns: S.optional(StringList),
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
  GitHubRepositoryConfigurationFieldMappings: S.optional(
    DataSourceToIndexFieldMappingList,
  ),
  GitHubCommitConfigurationFieldMappings: S.optional(
    DataSourceToIndexFieldMappingList,
  ),
  GitHubIssueDocumentConfigurationFieldMappings: S.optional(
    DataSourceToIndexFieldMappingList,
  ),
  GitHubIssueCommentConfigurationFieldMappings: S.optional(
    DataSourceToIndexFieldMappingList,
  ),
  GitHubIssueAttachmentConfigurationFieldMappings: S.optional(
    DataSourceToIndexFieldMappingList,
  ),
  GitHubPullRequestCommentConfigurationFieldMappings: S.optional(
    DataSourceToIndexFieldMappingList,
  ),
  GitHubPullRequestDocumentConfigurationFieldMappings: S.optional(
    DataSourceToIndexFieldMappingList,
  ),
  GitHubPullRequestDocumentAttachmentConfigurationFieldMappings: S.optional(
    DataSourceToIndexFieldMappingList,
  ),
}) {}
export const EntityFilter = S.Array(S.String);
export class AlfrescoConfiguration extends S.Class<AlfrescoConfiguration>(
  "AlfrescoConfiguration",
)({
  SiteUrl: S.String,
  SiteId: S.String,
  SecretArn: S.String,
  SslCertificateS3Path: S3Path,
  CrawlSystemFolders: S.optional(S.Boolean),
  CrawlComments: S.optional(S.Boolean),
  EntityFilter: S.optional(EntityFilter),
  DocumentLibraryFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  BlogFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  WikiFieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
}) {}
export class TemplateConfiguration extends S.Class<TemplateConfiguration>(
  "TemplateConfiguration",
)({ Template: S.optional(S.Any) }) {}
export class DataSourceConfiguration extends S.Class<DataSourceConfiguration>(
  "DataSourceConfiguration",
)({
  S3Configuration: S.optional(S3DataSourceConfiguration),
  SharePointConfiguration: S.optional(SharePointConfiguration),
  DatabaseConfiguration: S.optional(DatabaseConfiguration),
  SalesforceConfiguration: S.optional(SalesforceConfiguration),
  OneDriveConfiguration: S.optional(OneDriveConfiguration),
  ServiceNowConfiguration: S.optional(ServiceNowConfiguration),
  ConfluenceConfiguration: S.optional(ConfluenceConfiguration),
  GoogleDriveConfiguration: S.optional(GoogleDriveConfiguration),
  WebCrawlerConfiguration: S.optional(WebCrawlerConfiguration),
  WorkDocsConfiguration: S.optional(WorkDocsConfiguration),
  FsxConfiguration: S.optional(FsxConfiguration),
  SlackConfiguration: S.optional(SlackConfiguration),
  BoxConfiguration: S.optional(BoxConfiguration),
  QuipConfiguration: S.optional(QuipConfiguration),
  JiraConfiguration: S.optional(JiraConfiguration),
  GitHubConfiguration: S.optional(GitHubConfiguration),
  AlfrescoConfiguration: S.optional(AlfrescoConfiguration),
  TemplateConfiguration: S.optional(TemplateConfiguration),
}) {}
export class DocumentAttributeCondition extends S.Class<DocumentAttributeCondition>(
  "DocumentAttributeCondition",
)({
  ConditionDocumentAttributeKey: S.String,
  Operator: S.String,
  ConditionOnValue: S.optional(DocumentAttributeValue),
}) {}
export class DocumentAttributeTarget extends S.Class<DocumentAttributeTarget>(
  "DocumentAttributeTarget",
)({
  TargetDocumentAttributeKey: S.optional(S.String),
  TargetDocumentAttributeValueDeletion: S.optional(S.Boolean),
  TargetDocumentAttributeValue: S.optional(DocumentAttributeValue),
}) {}
export class InlineCustomDocumentEnrichmentConfiguration extends S.Class<InlineCustomDocumentEnrichmentConfiguration>(
  "InlineCustomDocumentEnrichmentConfiguration",
)({
  Condition: S.optional(DocumentAttributeCondition),
  Target: S.optional(DocumentAttributeTarget),
  DocumentContentDeletion: S.optional(S.Boolean),
}) {}
export const InlineCustomDocumentEnrichmentConfigurationList = S.Array(
  InlineCustomDocumentEnrichmentConfiguration,
);
export class HookConfiguration extends S.Class<HookConfiguration>(
  "HookConfiguration",
)({
  InvocationCondition: S.optional(DocumentAttributeCondition),
  LambdaArn: S.String,
  S3Bucket: S.String,
}) {}
export class CustomDocumentEnrichmentConfiguration extends S.Class<CustomDocumentEnrichmentConfiguration>(
  "CustomDocumentEnrichmentConfiguration",
)({
  InlineConfigurations: S.optional(
    InlineCustomDocumentEnrichmentConfigurationList,
  ),
  PreExtractionHookConfiguration: S.optional(HookConfiguration),
  PostExtractionHookConfiguration: S.optional(HookConfiguration),
  RoleArn: S.optional(S.String),
}) {}
export class UpdateDataSourceRequest extends S.Class<UpdateDataSourceRequest>(
  "UpdateDataSourceRequest",
)(
  {
    Id: S.String,
    Name: S.optional(S.String),
    IndexId: S.String,
    Configuration: S.optional(DataSourceConfiguration),
    VpcConfiguration: S.optional(DataSourceVpcConfiguration),
    Description: S.optional(S.String),
    Schedule: S.optional(S.String),
    RoleArn: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    CustomDocumentEnrichmentConfiguration: S.optional(
      CustomDocumentEnrichmentConfiguration,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDataSourceResponse extends S.Class<UpdateDataSourceResponse>(
  "UpdateDataSourceResponse",
)({}) {}
export const DataSourceIdList = S.Array(S.String);
export const FaqIdsList = S.Array(S.String);
export class ContentSourceConfiguration extends S.Class<ContentSourceConfiguration>(
  "ContentSourceConfiguration",
)({
  DataSourceIds: S.optional(DataSourceIdList),
  FaqIds: S.optional(FaqIdsList),
  DirectPutContent: S.optional(S.Boolean),
}) {}
export class UserIdentityConfiguration extends S.Class<UserIdentityConfiguration>(
  "UserIdentityConfiguration",
)({ IdentityAttributeName: S.optional(S.String) }) {}
export class ExperienceConfiguration extends S.Class<ExperienceConfiguration>(
  "ExperienceConfiguration",
)({
  ContentSourceConfiguration: S.optional(ContentSourceConfiguration),
  UserIdentityConfiguration: S.optional(UserIdentityConfiguration),
}) {}
export class UpdateExperienceRequest extends S.Class<UpdateExperienceRequest>(
  "UpdateExperienceRequest",
)(
  {
    Id: S.String,
    Name: S.optional(S.String),
    IndexId: S.String,
    RoleArn: S.optional(S.String),
    Configuration: S.optional(ExperienceConfiguration),
    Description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateExperienceResponse extends S.Class<UpdateExperienceResponse>(
  "UpdateExperienceResponse",
)({}) {}
export class FeaturedDocument extends S.Class<FeaturedDocument>(
  "FeaturedDocument",
)({ Id: S.optional(S.String) }) {}
export const FeaturedDocumentList = S.Array(FeaturedDocument);
export class UpdateFeaturedResultsSetRequest extends S.Class<UpdateFeaturedResultsSetRequest>(
  "UpdateFeaturedResultsSetRequest",
)(
  {
    IndexId: S.String,
    FeaturedResultsSetId: S.String,
    FeaturedResultsSetName: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    QueryTexts: S.optional(QueryTextList),
    FeaturedDocuments: S.optional(FeaturedDocumentList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateQuerySuggestionsBlockListRequest extends S.Class<UpdateQuerySuggestionsBlockListRequest>(
  "UpdateQuerySuggestionsBlockListRequest",
)(
  {
    IndexId: S.String,
    Id: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    SourceS3Path: S.optional(S3Path),
    RoleArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateQuerySuggestionsBlockListResponse extends S.Class<UpdateQuerySuggestionsBlockListResponse>(
  "UpdateQuerySuggestionsBlockListResponse",
)({}) {}
export class UpdateThesaurusRequest extends S.Class<UpdateThesaurusRequest>(
  "UpdateThesaurusRequest",
)(
  {
    Id: S.String,
    Name: S.optional(S.String),
    IndexId: S.String,
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    SourceS3Path: S.optional(S3Path),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateThesaurusResponse extends S.Class<UpdateThesaurusResponse>(
  "UpdateThesaurusResponse",
)({}) {}
export type AttributeFilterList = AttributeFilter[];
export const AttributeFilterList = S.Array(
  S.suspend((): S.Schema<AttributeFilter, any> => AttributeFilter),
) as any as S.Schema<AttributeFilterList>;
export const AssociateEntityList = S.Array(EntityConfiguration);
export class EntityPersonaConfiguration extends S.Class<EntityPersonaConfiguration>(
  "EntityPersonaConfiguration",
)({ EntityId: S.String, Persona: S.String }) {}
export const EntityPersonaConfigurationList = S.Array(
  EntityPersonaConfiguration,
);
export class DataSourceSyncJobMetricTarget extends S.Class<DataSourceSyncJobMetricTarget>(
  "DataSourceSyncJobMetricTarget",
)({ DataSourceId: S.String, DataSourceSyncJobId: S.optional(S.String) }) {}
export const DocumentAttributeList = S.Array(DocumentAttribute);
export class Document extends S.Class<Document>("Document")({
  Id: S.String,
  Title: S.optional(S.String),
  Blob: S.optional(T.Blob),
  S3Path: S.optional(S3Path),
  Attributes: S.optional(DocumentAttributeList),
  AccessControlList: S.optional(PrincipalList),
  HierarchicalAccessControlList: S.optional(HierarchicalPrincipalList),
  ContentType: S.optional(S.String),
  AccessControlConfigurationId: S.optional(S.String),
}) {}
export const DocumentList = S.Array(Document);
export class ServerSideEncryptionConfiguration extends S.Class<ServerSideEncryptionConfiguration>(
  "ServerSideEncryptionConfiguration",
)({ KmsKeyId: S.optional(S.String) }) {}
export class UserGroupResolutionConfiguration extends S.Class<UserGroupResolutionConfiguration>(
  "UserGroupResolutionConfiguration",
)({ UserGroupResolutionMode: S.String }) {}
export class AttributeSuggestionsGetConfig extends S.Class<AttributeSuggestionsGetConfig>(
  "AttributeSuggestionsGetConfig",
)({
  SuggestionAttributes: S.optional(DocumentAttributeKeyList),
  AdditionalResponseAttributes: S.optional(DocumentAttributeKeyList),
  AttributeFilter: S.optional(AttributeFilter),
  UserContext: S.optional(UserContext),
}) {}
export const SnapshotsDataHeaderFields = S.Array(S.String);
export const SnapshotsDataRecord = S.Array(S.String);
export const SnapshotsDataRecords = S.Array(SnapshotsDataRecord);
export class TimeRange extends S.Class<TimeRange>("TimeRange")({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Facet extends S.Class<Facet>("Facet")({
  DocumentAttributeKey: S.optional(S.String),
  Facets: S.optional(S.suspend(() => FacetList)),
  MaxResults: S.optional(S.Number),
}) {}
export type FacetList = Facet[];
export const FacetList = S.Array(
  S.suspend((): S.Schema<Facet, any> => Facet),
) as any as S.Schema<FacetList>;
export class SpellCorrectionConfiguration extends S.Class<SpellCorrectionConfiguration>(
  "SpellCorrectionConfiguration",
)({ IncludeQuerySpellCheckSuggestions: S.Boolean }) {}
export class ClickFeedback extends S.Class<ClickFeedback>("ClickFeedback")({
  ResultId: S.String,
  ClickTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ClickFeedbackList = S.Array(ClickFeedback);
export class RelevanceFeedback extends S.Class<RelevanceFeedback>(
  "RelevanceFeedback",
)({ ResultId: S.String, RelevanceValue: S.String }) {}
export const RelevanceFeedbackList = S.Array(RelevanceFeedback);
export class CapacityUnitsConfiguration extends S.Class<CapacityUnitsConfiguration>(
  "CapacityUnitsConfiguration",
)({ StorageCapacityUnits: S.Number, QueryCapacityUnits: S.Number }) {}
export class AssociateEntitiesToExperienceRequest extends S.Class<AssociateEntitiesToExperienceRequest>(
  "AssociateEntitiesToExperienceRequest",
)(
  { Id: S.String, IndexId: S.String, EntityList: AssociateEntityList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociatePersonasToEntitiesRequest extends S.Class<AssociatePersonasToEntitiesRequest>(
  "AssociatePersonasToEntitiesRequest",
)(
  { Id: S.String, IndexId: S.String, Personas: EntityPersonaConfigurationList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDeleteDocumentRequest extends S.Class<BatchDeleteDocumentRequest>(
  "BatchDeleteDocumentRequest",
)(
  {
    IndexId: S.String,
    DocumentIdList: DocumentIdList,
    DataSourceSyncJobMetricTarget: S.optional(DataSourceSyncJobMetricTarget),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAccessControlConfigurationRequest extends S.Class<CreateAccessControlConfigurationRequest>(
  "CreateAccessControlConfigurationRequest",
)(
  {
    IndexId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    AccessControlList: S.optional(PrincipalList),
    HierarchicalAccessControlList: S.optional(HierarchicalPrincipalList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFaqRequest extends S.Class<CreateFaqRequest>(
  "CreateFaqRequest",
)(
  {
    IndexId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    S3Path: S3Path,
    RoleArn: S.String,
    Tags: S.optional(TagList),
    FileFormat: S.optional(S.String),
    ClientToken: S.optional(S.String),
    LanguageCode: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFeaturedResultsSetRequest extends S.Class<CreateFeaturedResultsSetRequest>(
  "CreateFeaturedResultsSetRequest",
)(
  {
    IndexId: S.String,
    FeaturedResultsSetName: S.String,
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Status: S.optional(S.String),
    QueryTexts: S.optional(QueryTextList),
    FeaturedDocuments: S.optional(FeaturedDocumentList),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateQuerySuggestionsBlockListResponse extends S.Class<CreateQuerySuggestionsBlockListResponse>(
  "CreateQuerySuggestionsBlockListResponse",
)({ Id: S.optional(S.String) }) {}
export class CreateThesaurusResponse extends S.Class<CreateThesaurusResponse>(
  "CreateThesaurusResponse",
)({ Id: S.optional(S.String) }) {}
export class DescribeAccessControlConfigurationResponse extends S.Class<DescribeAccessControlConfigurationResponse>(
  "DescribeAccessControlConfigurationResponse",
)({
  Name: S.String,
  Description: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  AccessControlList: S.optional(PrincipalList),
  HierarchicalAccessControlList: S.optional(HierarchicalPrincipalList),
}) {}
export class DescribeDataSourceResponse extends S.Class<DescribeDataSourceResponse>(
  "DescribeDataSourceResponse",
)({
  Id: S.optional(S.String),
  IndexId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Configuration: S.optional(DataSourceConfiguration),
  VpcConfiguration: S.optional(DataSourceVpcConfiguration),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  Schedule: S.optional(S.String),
  RoleArn: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  CustomDocumentEnrichmentConfiguration: S.optional(
    CustomDocumentEnrichmentConfiguration,
  ),
}) {}
export class DescribeFaqResponse extends S.Class<DescribeFaqResponse>(
  "DescribeFaqResponse",
)({
  Id: S.optional(S.String),
  IndexId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  S3Path: S.optional(S3Path),
  Status: S.optional(S.String),
  RoleArn: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  FileFormat: S.optional(S.String),
  LanguageCode: S.optional(S.String),
}) {}
export class DescribeQuerySuggestionsBlockListResponse extends S.Class<DescribeQuerySuggestionsBlockListResponse>(
  "DescribeQuerySuggestionsBlockListResponse",
)({
  IndexId: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceS3Path: S.optional(S3Path),
  ItemCount: S.optional(S.Number),
  FileSizeBytes: S.optional(S.Number),
  RoleArn: S.optional(S.String),
}) {}
export class DescribeThesaurusResponse extends S.Class<DescribeThesaurusResponse>(
  "DescribeThesaurusResponse",
)({
  Id: S.optional(S.String),
  IndexId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RoleArn: S.optional(S.String),
  SourceS3Path: S.optional(S3Path),
  FileSizeBytes: S.optional(S.Number),
  TermCount: S.optional(S.Number),
  SynonymRuleCount: S.optional(S.Number),
}) {}
export class FailedEntity extends S.Class<FailedEntity>("FailedEntity")({
  EntityId: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const FailedEntityList = S.Array(FailedEntity);
export class DisassociatePersonasFromEntitiesResponse extends S.Class<DisassociatePersonasFromEntitiesResponse>(
  "DisassociatePersonasFromEntitiesResponse",
)({ FailedEntityList: S.optional(FailedEntityList) }) {}
export class GetQuerySuggestionsRequest extends S.Class<GetQuerySuggestionsRequest>(
  "GetQuerySuggestionsRequest",
)(
  {
    IndexId: S.String,
    QueryText: S.String,
    MaxSuggestionsCount: S.optional(S.Number),
    SuggestionTypes: S.optional(SuggestionTypes),
    AttributeSuggestionsConfig: S.optional(AttributeSuggestionsGetConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSnapshotsResponse extends S.Class<GetSnapshotsResponse>(
  "GetSnapshotsResponse",
)({
  SnapShotTimeFilter: S.optional(TimeRange),
  SnapshotsDataHeader: S.optional(SnapshotsDataHeaderFields),
  SnapshotsData: S.optional(SnapshotsDataRecords),
  NextToken: S.optional(S.String),
}) {}
export class ListDataSourceSyncJobsRequest extends S.Class<ListDataSourceSyncJobsRequest>(
  "ListDataSourceSyncJobsRequest",
)(
  {
    Id: S.String,
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StartTimeFilter: S.optional(TimeRange),
    StatusFilter: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class StartDataSourceSyncJobResponse extends S.Class<StartDataSourceSyncJobResponse>(
  "StartDataSourceSyncJobResponse",
)({ ExecutionId: S.optional(S.String) }) {}
export class SubmitFeedbackRequest extends S.Class<SubmitFeedbackRequest>(
  "SubmitFeedbackRequest",
)(
  {
    IndexId: S.String,
    QueryId: S.String,
    ClickFeedbackItems: S.optional(ClickFeedbackList),
    RelevanceFeedbackItems: S.optional(RelevanceFeedbackList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SubmitFeedbackResponse extends S.Class<SubmitFeedbackResponse>(
  "SubmitFeedbackResponse",
)({}) {}
export class JwtTokenTypeConfiguration extends S.Class<JwtTokenTypeConfiguration>(
  "JwtTokenTypeConfiguration",
)({
  KeyLocation: S.String,
  URL: S.optional(S.String),
  SecretManagerArn: S.optional(S.String),
  UserNameAttributeField: S.optional(S.String),
  GroupAttributeField: S.optional(S.String),
  Issuer: S.optional(S.String),
  ClaimRegex: S.optional(S.String),
}) {}
export class JsonTokenTypeConfiguration extends S.Class<JsonTokenTypeConfiguration>(
  "JsonTokenTypeConfiguration",
)({ UserNameAttributeField: S.String, GroupAttributeField: S.String }) {}
export class MemberGroup extends S.Class<MemberGroup>("MemberGroup")({
  GroupId: S.String,
  DataSourceId: S.optional(S.String),
}) {}
export const MemberGroups = S.Array(MemberGroup);
export class MemberUser extends S.Class<MemberUser>("MemberUser")({
  UserId: S.String,
}) {}
export const MemberUsers = S.Array(MemberUser);
export class ExpandConfiguration extends S.Class<ExpandConfiguration>(
  "ExpandConfiguration",
)({
  MaxResultItemsToExpand: S.optional(S.Number),
  MaxExpandedResultsPerItem: S.optional(S.Number),
}) {}
export class Search extends S.Class<Search>("Search")({
  Facetable: S.optional(S.Boolean),
  Searchable: S.optional(S.Boolean),
  Displayable: S.optional(S.Boolean),
  Sortable: S.optional(S.Boolean),
}) {}
export class SuggestableConfig extends S.Class<SuggestableConfig>(
  "SuggestableConfig",
)({
  AttributeName: S.optional(S.String),
  Suggestable: S.optional(S.Boolean),
}) {}
export const SuggestableConfigList = S.Array(SuggestableConfig);
export const AssociateEntitiesToExperienceFailedEntityList =
  S.Array(FailedEntity);
export class BatchDeleteFeaturedResultsSetError extends S.Class<BatchDeleteFeaturedResultsSetError>(
  "BatchDeleteFeaturedResultsSetError",
)({ Id: S.String, ErrorCode: S.String, ErrorMessage: S.String }) {}
export const BatchDeleteFeaturedResultsSetErrors = S.Array(
  BatchDeleteFeaturedResultsSetError,
);
export class UserTokenConfiguration extends S.Class<UserTokenConfiguration>(
  "UserTokenConfiguration",
)({
  JwtTokenTypeConfiguration: S.optional(JwtTokenTypeConfiguration),
  JsonTokenTypeConfiguration: S.optional(JsonTokenTypeConfiguration),
}) {}
export const UserTokenConfigurationList = S.Array(UserTokenConfiguration);
export class ExperienceEndpoint extends S.Class<ExperienceEndpoint>(
  "ExperienceEndpoint",
)({ EndpointType: S.optional(S.String), Endpoint: S.optional(S.String) }) {}
export const ExperienceEndpoints = S.Array(ExperienceEndpoint);
export class FeaturedDocumentWithMetadata extends S.Class<FeaturedDocumentWithMetadata>(
  "FeaturedDocumentWithMetadata",
)({
  Id: S.optional(S.String),
  Title: S.optional(S.String),
  URI: S.optional(S.String),
}) {}
export const FeaturedDocumentWithMetadataList = S.Array(
  FeaturedDocumentWithMetadata,
);
export class FeaturedDocumentMissing extends S.Class<FeaturedDocumentMissing>(
  "FeaturedDocumentMissing",
)({ Id: S.optional(S.String) }) {}
export const FeaturedDocumentMissingList = S.Array(FeaturedDocumentMissing);
export class GroupOrderingIdSummary extends S.Class<GroupOrderingIdSummary>(
  "GroupOrderingIdSummary",
)({
  Status: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReceivedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  OrderingId: S.optional(S.Number),
  FailureReason: S.optional(S.String),
}) {}
export const GroupOrderingIdSummaries = S.Array(GroupOrderingIdSummary);
export class AttributeSuggestionsDescribeConfig extends S.Class<AttributeSuggestionsDescribeConfig>(
  "AttributeSuggestionsDescribeConfig",
)({
  SuggestableConfigList: S.optional(SuggestableConfigList),
  AttributeSuggestionsMode: S.optional(S.String),
}) {}
export class AccessControlConfigurationSummary extends S.Class<AccessControlConfigurationSummary>(
  "AccessControlConfigurationSummary",
)({ Id: S.String }) {}
export const AccessControlConfigurationSummaryList = S.Array(
  AccessControlConfigurationSummary,
);
export class DataSourceSummary extends S.Class<DataSourceSummary>(
  "DataSourceSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  LanguageCode: S.optional(S.String),
}) {}
export const DataSourceSummaryList = S.Array(DataSourceSummary);
export class PersonasSummary extends S.Class<PersonasSummary>(
  "PersonasSummary",
)({
  EntityId: S.optional(S.String),
  Persona: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PersonasSummaryList = S.Array(PersonasSummary);
export class ExperiencesSummary extends S.Class<ExperiencesSummary>(
  "ExperiencesSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  Endpoints: S.optional(ExperienceEndpoints),
}) {}
export const ExperiencesSummaryList = S.Array(ExperiencesSummary);
export class FaqSummary extends S.Class<FaqSummary>("FaqSummary")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FileFormat: S.optional(S.String),
  LanguageCode: S.optional(S.String),
}) {}
export const FaqSummaryItems = S.Array(FaqSummary);
export class FeaturedResultsSetSummary extends S.Class<FeaturedResultsSetSummary>(
  "FeaturedResultsSetSummary",
)({
  FeaturedResultsSetId: S.optional(S.String),
  FeaturedResultsSetName: S.optional(S.String),
  Status: S.optional(S.String),
  LastUpdatedTimestamp: S.optional(S.Number),
  CreationTimestamp: S.optional(S.Number),
}) {}
export const FeaturedResultsSetSummaryItems = S.Array(
  FeaturedResultsSetSummary,
);
export class GroupSummary extends S.Class<GroupSummary>("GroupSummary")({
  GroupId: S.optional(S.String),
  OrderingId: S.optional(S.Number),
}) {}
export const ListOfGroupSummaries = S.Array(GroupSummary);
export class IndexConfigurationSummary extends S.Class<IndexConfigurationSummary>(
  "IndexConfigurationSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Edition: S.optional(S.String),
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Status: S.String,
}) {}
export const IndexConfigurationSummaryList = S.Array(IndexConfigurationSummary);
export class QuerySuggestionsBlockListSummary extends S.Class<QuerySuggestionsBlockListSummary>(
  "QuerySuggestionsBlockListSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ItemCount: S.optional(S.Number),
}) {}
export const QuerySuggestionsBlockListSummaryItems = S.Array(
  QuerySuggestionsBlockListSummary,
);
export class ThesaurusSummary extends S.Class<ThesaurusSummary>(
  "ThesaurusSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ThesaurusSummaryItems = S.Array(ThesaurusSummary);
export class GroupMembers extends S.Class<GroupMembers>("GroupMembers")({
  MemberGroups: S.optional(MemberGroups),
  MemberUsers: S.optional(MemberUsers),
  S3PathforGroupMembers: S.optional(S3Path),
}) {}
export class CollapseConfiguration extends S.Class<CollapseConfiguration>(
  "CollapseConfiguration",
)({
  DocumentAttributeKey: S.String,
  SortingConfigurations: S.optional(SortingConfigurationList),
  MissingAttributeKeyStrategy: S.optional(S.String),
  Expand: S.optional(S.Boolean),
  ExpandConfiguration: S.optional(ExpandConfiguration),
}) {}
export class FeaturedResultsSet extends S.Class<FeaturedResultsSet>(
  "FeaturedResultsSet",
)({
  FeaturedResultsSetId: S.optional(S.String),
  FeaturedResultsSetName: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  QueryTexts: S.optional(QueryTextList),
  FeaturedDocuments: S.optional(FeaturedDocumentList),
  LastUpdatedTimestamp: S.optional(S.Number),
  CreationTimestamp: S.optional(S.Number),
}) {}
export class DocumentMetadataConfiguration extends S.Class<DocumentMetadataConfiguration>(
  "DocumentMetadataConfiguration",
)({
  Name: S.String,
  Type: S.String,
  Relevance: S.optional(Relevance),
  Search: S.optional(Search),
}) {}
export const DocumentMetadataConfigurationList = S.Array(
  DocumentMetadataConfiguration,
);
export class AttributeSuggestionsUpdateConfig extends S.Class<AttributeSuggestionsUpdateConfig>(
  "AttributeSuggestionsUpdateConfig",
)({
  SuggestableConfigList: S.optional(SuggestableConfigList),
  AttributeSuggestionsMode: S.optional(S.String),
}) {}
export class AssociateEntitiesToExperienceResponse extends S.Class<AssociateEntitiesToExperienceResponse>(
  "AssociateEntitiesToExperienceResponse",
)({
  FailedEntityList: S.optional(AssociateEntitiesToExperienceFailedEntityList),
}) {}
export class AssociatePersonasToEntitiesResponse extends S.Class<AssociatePersonasToEntitiesResponse>(
  "AssociatePersonasToEntitiesResponse",
)({ FailedEntityList: S.optional(FailedEntityList) }) {}
export class BatchDeleteFeaturedResultsSetResponse extends S.Class<BatchDeleteFeaturedResultsSetResponse>(
  "BatchDeleteFeaturedResultsSetResponse",
)({ Errors: BatchDeleteFeaturedResultsSetErrors }) {}
export class CreateAccessControlConfigurationResponse extends S.Class<CreateAccessControlConfigurationResponse>(
  "CreateAccessControlConfigurationResponse",
)({ Id: S.String }) {}
export class CreateExperienceRequest extends S.Class<CreateExperienceRequest>(
  "CreateExperienceRequest",
)(
  {
    Name: S.String,
    IndexId: S.String,
    RoleArn: S.optional(S.String),
    Configuration: S.optional(ExperienceConfiguration),
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFaqResponse extends S.Class<CreateFaqResponse>(
  "CreateFaqResponse",
)({ Id: S.optional(S.String) }) {}
export class CreateFeaturedResultsSetResponse extends S.Class<CreateFeaturedResultsSetResponse>(
  "CreateFeaturedResultsSetResponse",
)({ FeaturedResultsSet: S.optional(FeaturedResultsSet) }) {}
export class CreateIndexRequest extends S.Class<CreateIndexRequest>(
  "CreateIndexRequest",
)(
  {
    Name: S.String,
    Edition: S.optional(S.String),
    RoleArn: S.String,
    ServerSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
    UserTokenConfigurations: S.optional(UserTokenConfigurationList),
    UserContextPolicy: S.optional(S.String),
    UserGroupResolutionConfiguration: S.optional(
      UserGroupResolutionConfiguration,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExperienceResponse extends S.Class<DescribeExperienceResponse>(
  "DescribeExperienceResponse",
)({
  Id: S.optional(S.String),
  IndexId: S.optional(S.String),
  Name: S.optional(S.String),
  Endpoints: S.optional(ExperienceEndpoints),
  Configuration: S.optional(ExperienceConfiguration),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  RoleArn: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class DescribeFeaturedResultsSetResponse extends S.Class<DescribeFeaturedResultsSetResponse>(
  "DescribeFeaturedResultsSetResponse",
)({
  FeaturedResultsSetId: S.optional(S.String),
  FeaturedResultsSetName: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  QueryTexts: S.optional(QueryTextList),
  FeaturedDocumentsWithMetadata: S.optional(FeaturedDocumentWithMetadataList),
  FeaturedDocumentsMissing: S.optional(FeaturedDocumentMissingList),
  LastUpdatedTimestamp: S.optional(S.Number),
  CreationTimestamp: S.optional(S.Number),
}) {}
export class DescribePrincipalMappingResponse extends S.Class<DescribePrincipalMappingResponse>(
  "DescribePrincipalMappingResponse",
)({
  IndexId: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  GroupId: S.optional(S.String),
  GroupOrderingIdSummaries: S.optional(GroupOrderingIdSummaries),
}) {}
export class DescribeQuerySuggestionsConfigResponse extends S.Class<DescribeQuerySuggestionsConfigResponse>(
  "DescribeQuerySuggestionsConfigResponse",
)({
  Mode: S.optional(S.String),
  Status: S.optional(S.String),
  QueryLogLookBackWindowInDays: S.optional(S.Number),
  IncludeQueriesWithoutUserInformation: S.optional(S.Boolean),
  MinimumNumberOfQueryingUsers: S.optional(S.Number),
  MinimumQueryCount: S.optional(S.Number),
  LastSuggestionsBuildTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastClearTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TotalSuggestionsCount: S.optional(S.Number),
  AttributeSuggestionsConfig: S.optional(AttributeSuggestionsDescribeConfig),
}) {}
export class DisassociateEntitiesFromExperienceResponse extends S.Class<DisassociateEntitiesFromExperienceResponse>(
  "DisassociateEntitiesFromExperienceResponse",
)({ FailedEntityList: S.optional(FailedEntityList) }) {}
export class ListAccessControlConfigurationsResponse extends S.Class<ListAccessControlConfigurationsResponse>(
  "ListAccessControlConfigurationsResponse",
)({
  NextToken: S.optional(S.String),
  AccessControlConfigurations: AccessControlConfigurationSummaryList,
}) {}
export class ListDataSourcesResponse extends S.Class<ListDataSourcesResponse>(
  "ListDataSourcesResponse",
)({
  SummaryItems: S.optional(DataSourceSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListEntityPersonasResponse extends S.Class<ListEntityPersonasResponse>(
  "ListEntityPersonasResponse",
)({
  SummaryItems: S.optional(PersonasSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListExperiencesResponse extends S.Class<ListExperiencesResponse>(
  "ListExperiencesResponse",
)({
  SummaryItems: S.optional(ExperiencesSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListFaqsResponse extends S.Class<ListFaqsResponse>(
  "ListFaqsResponse",
)({
  NextToken: S.optional(S.String),
  FaqSummaryItems: S.optional(FaqSummaryItems),
}) {}
export class ListFeaturedResultsSetsResponse extends S.Class<ListFeaturedResultsSetsResponse>(
  "ListFeaturedResultsSetsResponse",
)({
  FeaturedResultsSetSummaryItems: S.optional(FeaturedResultsSetSummaryItems),
  NextToken: S.optional(S.String),
}) {}
export class ListGroupsOlderThanOrderingIdResponse extends S.Class<ListGroupsOlderThanOrderingIdResponse>(
  "ListGroupsOlderThanOrderingIdResponse",
)({
  GroupsSummaries: S.optional(ListOfGroupSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListIndicesResponse extends S.Class<ListIndicesResponse>(
  "ListIndicesResponse",
)({
  IndexConfigurationSummaryItems: S.optional(IndexConfigurationSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListQuerySuggestionsBlockListsResponse extends S.Class<ListQuerySuggestionsBlockListsResponse>(
  "ListQuerySuggestionsBlockListsResponse",
)({
  BlockListSummaryItems: S.optional(QuerySuggestionsBlockListSummaryItems),
  NextToken: S.optional(S.String),
}) {}
export class ListThesauriResponse extends S.Class<ListThesauriResponse>(
  "ListThesauriResponse",
)({
  NextToken: S.optional(S.String),
  ThesaurusSummaryItems: S.optional(ThesaurusSummaryItems),
}) {}
export class PutPrincipalMappingRequest extends S.Class<PutPrincipalMappingRequest>(
  "PutPrincipalMappingRequest",
)(
  {
    IndexId: S.String,
    DataSourceId: S.optional(S.String),
    GroupId: S.String,
    GroupMembers: GroupMembers,
    OrderingId: S.optional(S.Number),
    RoleArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutPrincipalMappingResponse extends S.Class<PutPrincipalMappingResponse>(
  "PutPrincipalMappingResponse",
)({}) {}
export class UpdateFeaturedResultsSetResponse extends S.Class<UpdateFeaturedResultsSetResponse>(
  "UpdateFeaturedResultsSetResponse",
)({ FeaturedResultsSet: S.optional(FeaturedResultsSet) }) {}
export class UpdateIndexRequest extends S.Class<UpdateIndexRequest>(
  "UpdateIndexRequest",
)(
  {
    Id: S.String,
    Name: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Description: S.optional(S.String),
    DocumentMetadataConfigurationUpdates: S.optional(
      DocumentMetadataConfigurationList,
    ),
    CapacityUnits: S.optional(CapacityUnitsConfiguration),
    UserTokenConfigurations: S.optional(UserTokenConfigurationList),
    UserContextPolicy: S.optional(S.String),
    UserGroupResolutionConfiguration: S.optional(
      UserGroupResolutionConfiguration,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateIndexResponse extends S.Class<UpdateIndexResponse>(
  "UpdateIndexResponse",
)({}) {}
export class UpdateQuerySuggestionsConfigRequest extends S.Class<UpdateQuerySuggestionsConfigRequest>(
  "UpdateQuerySuggestionsConfigRequest",
)(
  {
    IndexId: S.String,
    Mode: S.optional(S.String),
    QueryLogLookBackWindowInDays: S.optional(S.Number),
    IncludeQueriesWithoutUserInformation: S.optional(S.Boolean),
    MinimumNumberOfQueryingUsers: S.optional(S.Number),
    MinimumQueryCount: S.optional(S.Number),
    AttributeSuggestionsConfig: S.optional(AttributeSuggestionsUpdateConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateQuerySuggestionsConfigResponse extends S.Class<UpdateQuerySuggestionsConfigResponse>(
  "UpdateQuerySuggestionsConfigResponse",
)({}) {}
export class FaqStatistics extends S.Class<FaqStatistics>("FaqStatistics")({
  IndexedQuestionAnswersCount: S.Number,
}) {}
export class TextDocumentStatistics extends S.Class<TextDocumentStatistics>(
  "TextDocumentStatistics",
)({ IndexedTextDocumentsCount: S.Number, IndexedTextBytes: S.Number }) {}
export class EntityDisplayData extends S.Class<EntityDisplayData>(
  "EntityDisplayData",
)({
  UserName: S.optional(S.String),
  GroupName: S.optional(S.String),
  IdentifiedUserName: S.optional(S.String),
  FirstName: S.optional(S.String),
  LastName: S.optional(S.String),
}) {}
export class ScoreAttributes extends S.Class<ScoreAttributes>(
  "ScoreAttributes",
)({ ScoreConfidence: S.optional(S.String) }) {}
export class BatchDeleteDocumentResponseFailedDocument extends S.Class<BatchDeleteDocumentResponseFailedDocument>(
  "BatchDeleteDocumentResponseFailedDocument",
)({
  Id: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const BatchDeleteDocumentResponseFailedDocuments = S.Array(
  BatchDeleteDocumentResponseFailedDocument,
);
export class DocumentInfo extends S.Class<DocumentInfo>("DocumentInfo")({
  DocumentId: S.String,
  Attributes: S.optional(DocumentAttributeList),
}) {}
export const DocumentInfoList = S.Array(DocumentInfo);
export class IndexStatistics extends S.Class<IndexStatistics>(
  "IndexStatistics",
)({
  FaqStatistics: FaqStatistics,
  TextDocumentStatistics: TextDocumentStatistics,
}) {}
export class ExperienceEntitiesSummary extends S.Class<ExperienceEntitiesSummary>(
  "ExperienceEntitiesSummary",
)({
  EntityId: S.optional(S.String),
  EntityType: S.optional(S.String),
  DisplayData: S.optional(EntityDisplayData),
}) {}
export const ExperienceEntitiesSummaryList = S.Array(ExperienceEntitiesSummary);
export class RetrieveResultItem extends S.Class<RetrieveResultItem>(
  "RetrieveResultItem",
)({
  Id: S.optional(S.String),
  DocumentId: S.optional(S.String),
  DocumentTitle: S.optional(S.String),
  Content: S.optional(S.String),
  DocumentURI: S.optional(S.String),
  DocumentAttributes: S.optional(DocumentAttributeList),
  ScoreAttributes: S.optional(ScoreAttributes),
}) {}
export const RetrieveResultItemList = S.Array(RetrieveResultItem);
export class BatchDeleteDocumentResponse extends S.Class<BatchDeleteDocumentResponse>(
  "BatchDeleteDocumentResponse",
)({
  FailedDocuments: S.optional(BatchDeleteDocumentResponseFailedDocuments),
}) {}
export class BatchGetDocumentStatusRequest extends S.Class<BatchGetDocumentStatusRequest>(
  "BatchGetDocumentStatusRequest",
)(
  { IndexId: S.String, DocumentInfoList: DocumentInfoList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchPutDocumentRequest extends S.Class<BatchPutDocumentRequest>(
  "BatchPutDocumentRequest",
)(
  {
    IndexId: S.String,
    RoleArn: S.optional(S.String),
    Documents: DocumentList,
    CustomDocumentEnrichmentConfiguration: S.optional(
      CustomDocumentEnrichmentConfiguration,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateExperienceResponse extends S.Class<CreateExperienceResponse>(
  "CreateExperienceResponse",
)({ Id: S.String }) {}
export class CreateIndexResponse extends S.Class<CreateIndexResponse>(
  "CreateIndexResponse",
)({ Id: S.optional(S.String) }) {}
export class DescribeIndexResponse extends S.Class<DescribeIndexResponse>(
  "DescribeIndexResponse",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Edition: S.optional(S.String),
  RoleArn: S.optional(S.String),
  ServerSideEncryptionConfiguration: S.optional(
    ServerSideEncryptionConfiguration,
  ),
  Status: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DocumentMetadataConfigurations: S.optional(DocumentMetadataConfigurationList),
  IndexStatistics: S.optional(IndexStatistics),
  ErrorMessage: S.optional(S.String),
  CapacityUnits: S.optional(CapacityUnitsConfiguration),
  UserTokenConfigurations: S.optional(UserTokenConfigurationList),
  UserContextPolicy: S.optional(S.String),
  UserGroupResolutionConfiguration: S.optional(
    UserGroupResolutionConfiguration,
  ),
}) {}
export class ListExperienceEntitiesResponse extends S.Class<ListExperienceEntitiesResponse>(
  "ListExperienceEntitiesResponse",
)({
  SummaryItems: S.optional(ExperienceEntitiesSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class QueryRequest extends S.Class<QueryRequest>("QueryRequest")(
  {
    IndexId: S.String,
    QueryText: S.optional(S.String),
    AttributeFilter: S.optional(AttributeFilter),
    Facets: S.optional(FacetList),
    RequestedDocumentAttributes: S.optional(DocumentAttributeKeyList),
    QueryResultTypeFilter: S.optional(S.String),
    DocumentRelevanceOverrideConfigurations: S.optional(
      DocumentRelevanceOverrideConfigurationList,
    ),
    PageNumber: S.optional(S.Number),
    PageSize: S.optional(S.Number),
    SortingConfiguration: S.optional(SortingConfiguration),
    SortingConfigurations: S.optional(SortingConfigurationList),
    UserContext: S.optional(UserContext),
    VisitorId: S.optional(S.String),
    SpellCorrectionConfiguration: S.optional(SpellCorrectionConfiguration),
    CollapseConfiguration: S.optional(CollapseConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RetrieveResult extends S.Class<RetrieveResult>("RetrieveResult")({
  QueryId: S.optional(S.String),
  ResultItems: S.optional(RetrieveResultItemList),
}) {}
export class SourceDocument extends S.Class<SourceDocument>("SourceDocument")({
  DocumentId: S.optional(S.String),
  SuggestionAttributes: S.optional(DocumentAttributeKeyList),
  AdditionalAttributes: S.optional(DocumentAttributeList),
}) {}
export const SourceDocuments = S.Array(SourceDocument);
export class DataSourceSyncJobMetrics extends S.Class<DataSourceSyncJobMetrics>(
  "DataSourceSyncJobMetrics",
)({
  DocumentsAdded: S.optional(S.String),
  DocumentsModified: S.optional(S.String),
  DocumentsDeleted: S.optional(S.String),
  DocumentsFailed: S.optional(S.String),
  DocumentsScanned: S.optional(S.String),
}) {}
export class ConflictingItem extends S.Class<ConflictingItem>(
  "ConflictingItem",
)({
  QueryText: S.optional(S.String),
  SetName: S.optional(S.String),
  SetId: S.optional(S.String),
}) {}
export const ConflictingItems = S.Array(ConflictingItem);
export class DataSourceSyncJob extends S.Class<DataSourceSyncJob>(
  "DataSourceSyncJob",
)({
  ExecutionId: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  DataSourceErrorCode: S.optional(S.String),
  Metrics: S.optional(DataSourceSyncJobMetrics),
}) {}
export const DataSourceSyncJobHistoryList = S.Array(DataSourceSyncJob);
export class CreateDataSourceRequest extends S.Class<CreateDataSourceRequest>(
  "CreateDataSourceRequest",
)(
  {
    Name: S.String,
    IndexId: S.String,
    Type: S.String,
    Configuration: S.optional(DataSourceConfiguration),
    VpcConfiguration: S.optional(DataSourceVpcConfiguration),
    Description: S.optional(S.String),
    Schedule: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    CustomDocumentEnrichmentConfiguration: S.optional(
      CustomDocumentEnrichmentConfiguration,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDataSourceSyncJobsResponse extends S.Class<ListDataSourceSyncJobsResponse>(
  "ListDataSourceSyncJobsResponse",
)({
  History: S.optional(DataSourceSyncJobHistoryList),
  NextToken: S.optional(S.String),
}) {}
export class SuggestionHighlight extends S.Class<SuggestionHighlight>(
  "SuggestionHighlight",
)({ BeginOffset: S.optional(S.Number), EndOffset: S.optional(S.Number) }) {}
export const SuggestionHighlightList = S.Array(SuggestionHighlight);
export class BatchGetDocumentStatusResponseError extends S.Class<BatchGetDocumentStatusResponseError>(
  "BatchGetDocumentStatusResponseError",
)({
  DocumentId: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const BatchGetDocumentStatusResponseErrors = S.Array(
  BatchGetDocumentStatusResponseError,
);
export class Status extends S.Class<Status>("Status")({
  DocumentId: S.optional(S.String),
  DocumentStatus: S.optional(S.String),
  FailureCode: S.optional(S.String),
  FailureReason: S.optional(S.String),
}) {}
export const DocumentStatusList = S.Array(Status);
export class BatchPutDocumentResponseFailedDocument extends S.Class<BatchPutDocumentResponseFailedDocument>(
  "BatchPutDocumentResponseFailedDocument",
)({
  Id: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const BatchPutDocumentResponseFailedDocuments = S.Array(
  BatchPutDocumentResponseFailedDocument,
);
export class Warning extends S.Class<Warning>("Warning")({
  Message: S.optional(S.String),
  Code: S.optional(S.String),
}) {}
export const WarningList = S.Array(Warning);
export class Highlight extends S.Class<Highlight>("Highlight")({
  BeginOffset: S.Number,
  EndOffset: S.Number,
  TopAnswer: S.optional(S.Boolean),
  Type: S.optional(S.String),
}) {}
export const HighlightList = S.Array(Highlight);
export class TextWithHighlights extends S.Class<TextWithHighlights>(
  "TextWithHighlights",
)({ Text: S.optional(S.String), Highlights: S.optional(HighlightList) }) {}
export class AdditionalResultAttributeValue extends S.Class<AdditionalResultAttributeValue>(
  "AdditionalResultAttributeValue",
)({ TextWithHighlightsValue: S.optional(TextWithHighlights) }) {}
export class AdditionalResultAttribute extends S.Class<AdditionalResultAttribute>(
  "AdditionalResultAttribute",
)({
  Key: S.String,
  ValueType: S.String,
  Value: AdditionalResultAttributeValue,
}) {}
export const AdditionalResultAttributeList = S.Array(AdditionalResultAttribute);
export class FeaturedResultsItem extends S.Class<FeaturedResultsItem>(
  "FeaturedResultsItem",
)({
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  AdditionalAttributes: S.optional(AdditionalResultAttributeList),
  DocumentId: S.optional(S.String),
  DocumentTitle: S.optional(TextWithHighlights),
  DocumentExcerpt: S.optional(TextWithHighlights),
  DocumentURI: S.optional(S.String),
  DocumentAttributes: S.optional(DocumentAttributeList),
  FeedbackToken: S.optional(S.String),
}) {}
export const FeaturedResultsItemList = S.Array(FeaturedResultsItem);
export class SuggestionTextWithHighlights extends S.Class<SuggestionTextWithHighlights>(
  "SuggestionTextWithHighlights",
)({
  Text: S.optional(S.String),
  Highlights: S.optional(SuggestionHighlightList),
}) {}
export class BatchGetDocumentStatusResponse extends S.Class<BatchGetDocumentStatusResponse>(
  "BatchGetDocumentStatusResponse",
)({
  Errors: S.optional(BatchGetDocumentStatusResponseErrors),
  DocumentStatusList: S.optional(DocumentStatusList),
}) {}
export class BatchPutDocumentResponse extends S.Class<BatchPutDocumentResponse>(
  "BatchPutDocumentResponse",
)({ FailedDocuments: S.optional(BatchPutDocumentResponseFailedDocuments) }) {}
export class CreateDataSourceResponse extends S.Class<CreateDataSourceResponse>(
  "CreateDataSourceResponse",
)({ Id: S.String }) {}
export class SuggestionValue extends S.Class<SuggestionValue>(
  "SuggestionValue",
)({ Text: S.optional(SuggestionTextWithHighlights) }) {}
export class DocumentAttributeValueCountPair extends S.Class<DocumentAttributeValueCountPair>(
  "DocumentAttributeValueCountPair",
)({
  DocumentAttributeValue: S.optional(DocumentAttributeValue),
  Count: S.optional(S.Number),
  FacetResults: S.optional(S.suspend(() => FacetResultList)),
}) {}
export type DocumentAttributeValueCountPairList =
  DocumentAttributeValueCountPair[];
export const DocumentAttributeValueCountPairList = S.Array(
  S.suspend(
    (): S.Schema<DocumentAttributeValueCountPair, any> =>
      DocumentAttributeValueCountPair,
  ),
) as any as S.Schema<DocumentAttributeValueCountPairList>;
export class Correction extends S.Class<Correction>("Correction")({
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
  Term: S.optional(S.String),
  CorrectedTerm: S.optional(S.String),
}) {}
export const CorrectionList = S.Array(Correction);
export class Suggestion extends S.Class<Suggestion>("Suggestion")({
  Id: S.optional(S.String),
  Value: S.optional(SuggestionValue),
  SourceDocuments: S.optional(SourceDocuments),
}) {}
export const SuggestionList = S.Array(Suggestion);
export class FacetResult extends S.Class<FacetResult>("FacetResult")({
  DocumentAttributeKey: S.optional(S.String),
  DocumentAttributeValueType: S.optional(S.String),
  DocumentAttributeValueCountPairs: S.optional(
    S.suspend(() => DocumentAttributeValueCountPairList),
  ),
}) {}
export type FacetResultList = FacetResult[];
export const FacetResultList = S.Array(
  S.suspend((): S.Schema<FacetResult, any> => FacetResult),
) as any as S.Schema<FacetResultList>;
export class SpellCorrectedQuery extends S.Class<SpellCorrectedQuery>(
  "SpellCorrectedQuery",
)({
  SuggestedQueryText: S.optional(S.String),
  Corrections: S.optional(CorrectionList),
}) {}
export const SpellCorrectedQueryList = S.Array(SpellCorrectedQuery);
export class ExpandedResultItem extends S.Class<ExpandedResultItem>(
  "ExpandedResultItem",
)({
  Id: S.optional(S.String),
  DocumentId: S.optional(S.String),
  DocumentTitle: S.optional(TextWithHighlights),
  DocumentExcerpt: S.optional(TextWithHighlights),
  DocumentURI: S.optional(S.String),
  DocumentAttributes: S.optional(DocumentAttributeList),
}) {}
export const ExpandedResultList = S.Array(ExpandedResultItem);
export class GetQuerySuggestionsResponse extends S.Class<GetQuerySuggestionsResponse>(
  "GetQuerySuggestionsResponse",
)({
  QuerySuggestionsId: S.optional(S.String),
  Suggestions: S.optional(SuggestionList),
}) {}
export class CollapsedResultDetail extends S.Class<CollapsedResultDetail>(
  "CollapsedResultDetail",
)({
  DocumentAttribute: DocumentAttribute,
  ExpandedResults: S.optional(ExpandedResultList),
}) {}
export class TableCell extends S.Class<TableCell>("TableCell")({
  Value: S.optional(S.String),
  TopAnswer: S.optional(S.Boolean),
  Highlighted: S.optional(S.Boolean),
  Header: S.optional(S.Boolean),
}) {}
export const TableCellList = S.Array(TableCell);
export class TableRow extends S.Class<TableRow>("TableRow")({
  Cells: S.optional(TableCellList),
}) {}
export const TableRowList = S.Array(TableRow);
export class TableExcerpt extends S.Class<TableExcerpt>("TableExcerpt")({
  Rows: S.optional(TableRowList),
  TotalNumberOfRows: S.optional(S.Number),
}) {}
export class QueryResultItem extends S.Class<QueryResultItem>(
  "QueryResultItem",
)({
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  Format: S.optional(S.String),
  AdditionalAttributes: S.optional(AdditionalResultAttributeList),
  DocumentId: S.optional(S.String),
  DocumentTitle: S.optional(TextWithHighlights),
  DocumentExcerpt: S.optional(TextWithHighlights),
  DocumentURI: S.optional(S.String),
  DocumentAttributes: S.optional(DocumentAttributeList),
  ScoreAttributes: S.optional(ScoreAttributes),
  FeedbackToken: S.optional(S.String),
  TableExcerpt: S.optional(TableExcerpt),
  CollapsedResultDetail: S.optional(CollapsedResultDetail),
}) {}
export const QueryResultItemList = S.Array(QueryResultItem);
export class QueryResult extends S.Class<QueryResult>("QueryResult")({
  QueryId: S.optional(S.String),
  ResultItems: S.optional(QueryResultItemList),
  FacetResults: S.optional(FacetResultList),
  TotalNumberOfResults: S.optional(S.Number),
  Warnings: S.optional(WarningList),
  SpellCorrectedQueries: S.optional(SpellCorrectedQueryList),
  FeaturedResultsItems: S.optional(FeaturedResultsItemList),
}) {}

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
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class ResourceAlreadyExistException extends S.TaggedError<ResourceAlreadyExistException>()(
  "ResourceAlreadyExistException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
) {}
export class FeaturedResultsConflictException extends S.TaggedError<FeaturedResultsConflictException>()(
  "FeaturedResultsConflictException",
  {},
) {}

//# Operations
/**
 * Deletes a group so that all users that belong to the group can no
 * longer access documents only available to that group.
 *
 * For example, after deleting the group "Summer Interns", all interns who belonged to
 * that group no longer see intern-only documents in their search results.
 *
 * If you want to delete or replace users or sub groups of a group, you need to use the
 * `PutPrincipalMapping` operation. For example, if a user in the group
 * "Engineering" leaves the engineering team and another user takes their place, you
 * provide an updated list of users or sub groups that belong to the "Engineering" group
 * when calling `PutPrincipalMapping`. You can update your internal list of
 * users or sub groups and input this list when calling
 * `PutPrincipalMapping`.
 *
 * `DeletePrincipalMapping` is currently not supported in the Amazon Web Services GovCloud (US-West) region.
 */
export const deletePrincipalMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePrincipalMappingRequest,
    output: DeletePrincipalMappingResponse,
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
 * Deletes a block list used for query suggestions for an index.
 *
 * A deleted block list might not take effect right away. Amazon Kendra
 * needs to refresh the entire suggestions list to add back the
 * queries that were previously blocked.
 *
 * `DeleteQuerySuggestionsBlockList` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const deleteQuerySuggestionsBlockList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteQuerySuggestionsBlockListRequest,
    output: DeleteQuerySuggestionsBlockListResponse,
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
 * Deletes an Amazon Kendra thesaurus.
 */
export const deleteThesaurus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThesaurusRequest,
  output: DeleteThesaurusResponse,
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
 * Stops a synchronization job that is currently running. You can't stop a scheduled
 * synchronization job.
 */
export const stopDataSourceSyncJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopDataSourceSyncJobRequest,
    output: StopDataSourceSyncJobResponse,
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
 * Removes a tag from an index, FAQ, data source, or other resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an Amazon Kendra data source connector.
 */
export const updateDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates your Amazon Kendra experience such as a search application. For more information on
 * creating a search application experience, see Building a
 * search experience with no code.
 */
export const updateExperience = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExperienceRequest,
  output: UpdateExperienceResponse,
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
 * Updates a block list used for query suggestions for an index.
 *
 * Updates to a block list might not take effect right away. Amazon Kendra
 * needs to refresh the entire suggestions list to apply any updates to the
 * block list. Other changes not related to the block list apply immediately.
 *
 * If a block list is updating, then you need to wait for the first update to
 * finish before submitting another update.
 *
 * Amazon Kendra supports partial updates, so you only need to provide the fields
 * you want to update.
 *
 * `UpdateQuerySuggestionsBlockList` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const updateQuerySuggestionsBlockList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateQuerySuggestionsBlockListRequest,
    output: UpdateQuerySuggestionsBlockListResponse,
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
 * Updates a thesaurus for an index.
 */
export const updateThesaurus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThesaurusRequest,
  output: UpdateThesaurusResponse,
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
 * Clears existing query suggestions from an index.
 *
 * This deletes existing suggestions only, not the queries
 * in the query log. After you clear suggestions, Amazon Kendra learns
 * new suggestions based on new queries added to the query log
 * from the time you cleared suggestions. If you do not see any
 * new suggestions, then please allow Amazon Kendra to collect
 * enough queries to learn new suggestions.
 *
 * `ClearQuerySuggestions` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const clearQuerySuggestions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ClearQuerySuggestionsRequest,
    output: ClearQuerySuggestionsResponse,
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
 * Creates a block list to exlcude certain queries from suggestions.
 *
 * Any query that contains words or phrases specified in the block
 * list is blocked or filtered out from being shown as a suggestion.
 *
 * You need to provide the file location of your block list text file
 * in your S3 bucket. In your text file, enter each block word or phrase
 * on a separate line.
 *
 * For information on the current quota limits for block lists, see
 * Quotas
 * for Amazon Kendra.
 *
 * `CreateQuerySuggestionsBlockList` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 *
 * For an example of creating a block list for query suggestions using the
 * Python SDK, see Query
 * suggestions block list.
 */
export const createQuerySuggestionsBlockList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateQuerySuggestionsBlockListRequest,
    output: CreateQuerySuggestionsBlockListResponse,
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
 * Creates a thesaurus for an index. The thesaurus
 * contains a list of synonyms in Solr format.
 *
 * For an example of adding a thesaurus file to an index, see
 * Adding
 * custom synonyms to an index.
 */
export const createThesaurus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThesaurusRequest,
  output: CreateThesaurusResponse,
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
 * Deletes an access control configuration that you created for your documents in an
 * index. This includes user and group access information for your documents. This is
 * useful for user context filtering, where search results are filtered based on the user
 * or their group access to documents.
 */
export const deleteAccessControlConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAccessControlConfigurationRequest,
    output: DeleteAccessControlConfigurationResponse,
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
 * Deletes an Amazon Kendra data source connector. An exception is not thrown if the
 * data source is already being deleted. While the data source is being deleted, the
 * `Status` field returned by a call to the `DescribeDataSource` API is
 * set to `DELETING`. For more information, see Deleting Data Sources.
 *
 * Deleting an entire data source or re-syncing your index after deleting specific documents
 * from a data source could take up to an hour or more, depending on the number of documents you
 * want to delete.
 */
export const deleteDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes your Amazon Kendra experience such as a search application. For more information on
 * creating a search application experience, see Building a search
 * experience with no code.
 */
export const deleteExperience = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExperienceRequest,
  output: DeleteExperienceResponse,
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
 * Removes a FAQ from an index.
 */
export const deleteFaq = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFaqRequest,
  output: DeleteFaqResponse,
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
 * Deletes an Amazon Kendra index. An exception is not thrown if the index is already
 * being deleted. While the index is being deleted, the `Status` field returned by a
 * call to the `DescribeIndex` API is set to `DELETING`.
 */
export const deleteIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets information about an access control configuration that you created for your
 * documents in an index. This includes user and group access information for your
 * documents. This is useful for user context filtering, where search results are filtered
 * based on the user or their group access to documents.
 */
export const describeAccessControlConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAccessControlConfigurationRequest,
    output: DescribeAccessControlConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets information about an Amazon Kendra data source connector.
 */
export const describeDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDataSourceRequest,
  output: DescribeDataSourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a FAQ.
 */
export const describeFaq = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFaqRequest,
  output: DescribeFaqResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a block list used for query suggestions for
 * an index.
 *
 * This is used to check the current settings that are applied to a
 * block list.
 *
 * `DescribeQuerySuggestionsBlockList` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const describeQuerySuggestionsBlockList =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeQuerySuggestionsBlockListRequest,
    output: DescribeQuerySuggestionsBlockListResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets information about an Amazon Kendra thesaurus.
 */
export const describeThesaurus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThesaurusRequest,
  output: DescribeThesaurusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the specific permissions of users or groups in your IAM Identity Center
 * identity source with access to your Amazon Kendra experience. You can create an Amazon Kendra
 * experience such as a search application. For more information on creating a
 * search application experience, see Building a
 * search experience with no code.
 */
export const disassociatePersonasFromEntities =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociatePersonasFromEntitiesRequest,
    output: DisassociatePersonasFromEntitiesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets a list of tags associated with a resource. Indexes, FAQs, data sources, and
 * other resources can have tags associated with them.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to provide feedback to Amazon Kendra to improve the
 * performance of your index.
 *
 * `SubmitFeedback` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const submitFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitFeedbackRequest,
  output: SubmitFeedbackResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds the specified tag to the specified index, FAQ, data source, or other resource. If
 * the tag already exists, the existing value is replaced with the new value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an access control configuration for your documents in an index. This includes
 * user and group access information for your documents. This is useful for user context
 * filtering, where search results are filtered based on the user or their group access to
 * documents.
 *
 * You can update an access control configuration you created without indexing all of
 * your documents again. For example, your index contains top-secret company documents that
 * only certain employees or users should access. You created an 'allow' access control
 * configuration for one user who recently joined the 'top-secret' team, switching from a
 * team with 'deny' access to top-secret documents. However, the user suddenly returns to
 * their previous team and should no longer have access to top secret documents. You can
 * update the access control configuration to re-configure access control for your
 * documents as circumstances change.
 *
 * You call the BatchPutDocument API to
 * apply the updated access control configuration, with the
 * `AccessControlConfigurationId` included in the Document
 * object. If you use an S3 bucket as a data source, you synchronize your data source to
 * apply the `AccessControlConfigurationId` in the `.metadata.json`
 * file. Amazon Kendra currently only supports access control configuration for S3
 * data sources and documents indexed using the `BatchPutDocument` API.
 *
 * You can't configure access control using
 * `CreateAccessControlConfiguration` for an Amazon Kendra Gen AI Enterprise
 * Edition index. Amazon Kendra will return a `ValidationException` error for a
 * `Gen_AI_ENTERPRISE_EDITION` index.
 */
export const updateAccessControlConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAccessControlConfigurationRequest,
    output: UpdateAccessControlConfigurationResponse,
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
 * Defines the specific permissions of users or groups in your IAM Identity Center
 * identity source with access to your Amazon Kendra experience. You can create an Amazon Kendra
 * experience such as a search application. For more information on creating a
 * search application experience, see Building
 * a search experience with no code.
 */
export const associatePersonasToEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociatePersonasToEntitiesRequest,
    output: AssociatePersonasToEntitiesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceAlreadyExistException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes one or more sets of featured results. Features results are placed
 * above all other results for certain queries. If there's an exact match of a
 * query, then one or more specific documents are featured in the search results.
 */
export const batchDeleteFeaturedResultsSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDeleteFeaturedResultsSetRequest,
    output: BatchDeleteFeaturedResultsSetResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates an access configuration for your documents. This includes user and group
 * access information for your documents. This is useful for user context filtering, where
 * search results are filtered based on the user or their group access to documents.
 *
 * You can use this to re-configure your existing document level access control without
 * indexing all of your documents again. For example, your index contains top-secret
 * company documents that only certain employees or users should access. One of these users
 * leaves the company or switches to a team that should be blocked from accessing
 * top-secret documents. The user still has access to top-secret documents because the user
 * had access when your documents were previously indexed. You can create a specific access
 * control configuration for the user with deny access. You can later update the access
 * control configuration to allow access if the user returns to the company and re-joins
 * the 'top-secret' team. You can re-configure access control for your documents as
 * circumstances change.
 *
 * To apply your access control configuration to certain documents, you call the BatchPutDocument API with the `AccessControlConfigurationId`
 * included in the Document object. If you use an S3 bucket as a data source, you update the
 * `.metadata.json` with the `AccessControlConfigurationId` and
 * synchronize your data source. Amazon Kendra currently only supports access control
 * configuration for S3 data sources and documents indexed using the
 * `BatchPutDocument` API.
 *
 * You can't configure access control using
 * `CreateAccessControlConfiguration` for an Amazon Kendra Gen AI Enterprise
 * Edition index. Amazon Kendra will return a `ValidationException` error for a
 * `Gen_AI_ENTERPRISE_EDITION` index.
 */
export const createAccessControlConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAccessControlConfigurationRequest,
    output: CreateAccessControlConfigurationResponse,
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
 * Creates a set of frequently ask questions (FAQs) using a specified FAQ file stored
 * in an Amazon S3 bucket.
 *
 * Adding FAQs to an index is an asynchronous operation.
 *
 * For an example of adding an FAQ to an index using Python and Java SDKs, see Using your FAQ file.
 */
export const createFaq = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFaqRequest,
  output: CreateFaqResponse,
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
 * Gets information about your Amazon Kendra experience such as a search application.
 * For more information on creating a search application experience,
 * see Building
 * a search experience with no code.
 */
export const describeExperience = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExperienceRequest,
  output: DescribeExperienceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a set of featured results. Features results are placed
 * above all other results for certain queries. If there's an exact match of a query,
 * then one or more specific documents are featured in the search results.
 */
export const describeFeaturedResultsSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFeaturedResultsSetRequest,
    output: DescribeFeaturedResultsSetResponse,
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
 * Describes the processing of `PUT` and `DELETE` actions for
 * mapping users to their groups. This includes information on the status of actions
 * currently processing or yet to be processed, when actions were last updated, when
 * actions were received by Amazon Kendra, the latest action that should process and
 * apply after other actions, and useful error messages if an action could not be
 * processed.
 *
 * `DescribePrincipalMapping` is currently not supported in the Amazon Web Services GovCloud (US-West) region.
 */
export const describePrincipalMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePrincipalMappingRequest,
    output: DescribePrincipalMappingResponse,
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
 * Gets information on the settings of query suggestions for an index.
 *
 * This is used to check the current settings applied
 * to query suggestions.
 *
 * `DescribeQuerySuggestionsConfig` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const describeQuerySuggestionsConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeQuerySuggestionsConfigRequest,
    output: DescribeQuerySuggestionsConfigResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Prevents users or groups in your IAM Identity Center identity source
 * from accessing your Amazon Kendra experience. You can create an Amazon Kendra experience
 * such as a search application. For more information on creating a search
 * application experience, see Building
 * a search experience with no code.
 */
export const disassociateEntitiesFromExperience =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateEntitiesFromExperienceRequest,
    output: DisassociateEntitiesFromExperienceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves search metrics data. The data provides a snapshot of how your users interact
 * with your search application and how effective the application is.
 */
export const getSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSnapshotsRequest,
  output: GetSnapshotsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists one or more access control configurations for an index. This includes user and
 * group access information for your documents. This is useful for user context filtering,
 * where search results are filtered based on the user or their group access to
 * documents.
 */
export const listAccessControlConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAccessControlConfigurationsRequest,
    output: ListAccessControlConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the data source connectors that you have created.
 */
export const listDataSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataSourcesRequest,
  output: ListDataSourcesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists specific permissions of users and groups with access to your
 * Amazon Kendra experience.
 */
export const listEntityPersonas = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEntityPersonasRequest,
  output: ListEntityPersonasResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists one or more Amazon Kendra experiences. You can create an Amazon Kendra experience such
 * as a search application. For more information on creating a search application
 * experience, see Building a
 * search experience with no code.
 */
export const listExperiences = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExperiencesRequest,
  output: ListExperiencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of FAQs associated with an index.
 */
export const listFaqs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFaqsRequest,
  output: ListFaqsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all your sets of featured results for a given index. Features results
 * are placed above all other results for certain queries. If there's an exact match
 * of a query, then one or more specific documents are featured in the search results.
 */
export const listFeaturedResultsSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFeaturedResultsSetsRequest,
    output: ListFeaturedResultsSetsResponse,
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
 * Provides a list of groups that are mapped to users before a given ordering or
 * timestamp identifier.
 *
 * `ListGroupsOlderThanOrderingId` is currently not supported in the Amazon Web Services GovCloud (US-West) region.
 */
export const listGroupsOlderThanOrderingId =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListGroupsOlderThanOrderingIdRequest,
    output: ListGroupsOlderThanOrderingIdResponse,
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
 * Lists the Amazon Kendra indexes that you created.
 */
export const listIndices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIndicesRequest,
  output: ListIndicesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the block lists used for query suggestions for an index.
 *
 * For information on the current quota limits for block lists, see
 * Quotas
 * for Amazon Kendra.
 *
 * `ListQuerySuggestionsBlockLists` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const listQuerySuggestionsBlockLists =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListQuerySuggestionsBlockListsRequest,
    output: ListQuerySuggestionsBlockListsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the thesauri for an index.
 */
export const listThesauri = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListThesauriRequest,
  output: ListThesauriResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Maps users to their groups so that you only need to provide the user ID when you issue
 * the query.
 *
 * You can also map sub groups to groups. For example, the group "Company Intellectual
 * Property Teams" includes sub groups "Research" and "Engineering". These sub groups
 * include their own list of users or people who work in these teams. Only users who work
 * in research and engineering, and therefore belong in the intellectual property group,
 * can see top-secret company documents in their search results.
 *
 * This is useful for user context filtering, where search results are filtered based on
 * the user or their group access to documents. For more information, see Filtering on
 * user context.
 *
 * If more than five `PUT` actions for a group are currently processing, a
 * validation exception is thrown.
 */
export const putPrincipalMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPrincipalMappingRequest,
  output: PutPrincipalMappingResponse,
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
 * Starts a synchronization job for a data source connector. If a synchronization job is
 * already in progress, Amazon Kendra returns a `ResourceInUseException`
 * exception.
 *
 * Re-syncing your data source with your index after modifying, adding, or deleting
 * documents from your data source respository could take up to an hour or more, depending on
 * the number of documents to sync.
 */
export const startDataSourceSyncJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartDataSourceSyncJobRequest,
    output: StartDataSourceSyncJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a set of featured results. Features results are placed
 * above
 * all other results for certain queries. You map specific queries to specific documents
 * for featuring in the results. If a query contains an exact match of a query, then one
 * or more specific documents are featured in the search results.
 */
export const updateFeaturedResultsSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFeaturedResultsSetRequest,
    output: UpdateFeaturedResultsSetResponse,
    errors: [
      AccessDeniedException,
      FeaturedResultsConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an Amazon Kendra index.
 */
export const updateIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the settings of query suggestions for an index.
 *
 * Amazon Kendra supports partial updates, so you only need to provide
 * the fields you want to update.
 *
 * If an update is currently processing, you
 * need to wait for the update to finish before making another update.
 *
 * Updates to query suggestions settings might not take effect right away.
 * The time for your updated settings to take effect depends on the updates
 * made and the number of search queries in your index.
 *
 * You can still enable/disable query suggestions at any time.
 *
 * `UpdateQuerySuggestionsConfig` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const updateQuerySuggestionsConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateQuerySuggestionsConfigRequest,
    output: UpdateQuerySuggestionsConfigResponse,
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
 * Grants users or groups in your IAM Identity Center identity source access
 * to your Amazon Kendra experience. You can create an Amazon Kendra experience such as a
 * search application. For more information on creating a search application
 * experience, see Building
 * a search experience with no code.
 */
export const associateEntitiesToExperience =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateEntitiesToExperienceRequest,
    output: AssociateEntitiesToExperienceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceAlreadyExistException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Removes one or more documents from an index. The documents must have been added with
 * the `BatchPutDocument` API.
 *
 * The documents are deleted asynchronously. You can see the progress of the deletion by
 * using Amazon Web Services
 * CloudWatch. Any error messages related to the processing of the batch are sent to
 * your Amazon Web Services
 * CloudWatch log. You can also use the `BatchGetDocumentStatus` API to
 * monitor the progress of deleting your documents.
 *
 * Deleting documents from an index using `BatchDeleteDocument` could take up
 * to an hour or more, depending on the number of documents you want to delete.
 */
export const batchDeleteDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an Amazon Kendra experience such as a search application. For more information
 * on creating a search application experience, including using the Python and Java SDKs,
 * see Building a
 * search experience with no code.
 */
export const createExperience = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExperienceRequest,
  output: CreateExperienceResponse,
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
 * Creates an Amazon Kendra index. Index creation is an asynchronous API. To determine
 * if index creation has completed, check the `Status` field returned from a call to
 * `DescribeIndex`. The `Status` field is set to `ACTIVE` when
 * the index is ready to use.
 *
 * Once the index is active, you can index your documents using the
 * `BatchPutDocument` API or using one of the supported data sources.
 *
 * For an example of creating an index and data source using the Python SDK, see Getting started with Python
 * SDK. For an example of creating an index and data source using the Java SDK, see
 * Getting started with Java
 * SDK.
 */
export const createIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexRequest,
  output: CreateIndexResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceAlreadyExistException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about an Amazon Kendra index.
 */
export const describeIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIndexRequest,
  output: DescribeIndexResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists users or groups in your IAM Identity Center identity source that are
 * granted access to your Amazon Kendra experience. You can create an Amazon Kendra experience
 * such as a search application. For more information on creating a search
 * application experience, see Building
 * a search experience with no code.
 */
export const listExperienceEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListExperienceEntitiesRequest,
    output: ListExperienceEntitiesResponse,
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
 * Retrieves relevant passages or text excerpts given an input query.
 *
 * This API is similar to the Query API. However, by
 * default, the `Query` API only returns excerpt passages of up to 100 token
 * words. With the `Retrieve` API, you can retrieve longer passages of up to 200
 * token words and up to 100 semantically relevant passages. This doesn't include
 * question-answer or FAQ type responses from your index. The passages are text excerpts
 * that can be semantically extracted from multiple documents and multiple parts of the
 * same document. If in extreme cases your documents produce zero passages using the
 * `Retrieve` API, you can alternatively use the `Query` API and
 * its types of responses.
 *
 * You can also do the following:
 *
 * - Override boosting at the index level
 *
 * - Filter based on document fields or attributes
 *
 * - Filter based on the user or their group access to documents
 *
 * - View the confidence score bucket for a retrieved passage result. The
 * confidence bucket provides a relative ranking that indicates how confident
 * Amazon Kendra is that the response is relevant to the query.
 *
 * Confidence score buckets are currently available only for English.
 *
 * You can also include certain fields in the response that might provide useful
 * additional information.
 *
 * The `Retrieve` API shares the number of query capacity
 * units that you set for your index. For more information on what's included
 * in a single capacity unit and the default base capacity for an index, see Adjusting
 * capacity.
 *
 * If you're using an Amazon Kendra Gen AI Enterprise Edition index, you can only use
 * `ATTRIBUTE_FILTER` to filter search results by user context. If
 * you're using an Amazon Kendra Gen AI Enterprise Edition index and you try to use
 * `USER_TOKEN` to configure user context policy, Amazon Kendra returns a
 * `ValidationException` error.
 */
export const retrieve = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetrieveRequest,
  output: RetrieveResult,
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
 * Creates a set of featured results to display at the top of the search results page.
 * Featured results are placed above all other results for certain queries. You map
 * specific queries to specific documents for featuring in the results. If a query
 * contains an exact match, then one or more specific documents are featured in the
 * search results.
 *
 * You can create up to 50 sets of featured results per index. You can request to
 * increase this limit by contacting Support.
 */
export const createFeaturedResultsSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFeaturedResultsSetRequest,
    output: CreateFeaturedResultsSetResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      FeaturedResultsConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets statistics about synchronizing a data source connector.
 */
export const listDataSourceSyncJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns the indexing status for one or more documents submitted with the
 * BatchPutDocument API.
 *
 * When you use the `BatchPutDocument` API, documents are indexed
 * asynchronously. You can use the `BatchGetDocumentStatus` API to get the
 * current status of a list of documents so that you can determine if they have been
 * successfully indexed.
 *
 * You can also use the `BatchGetDocumentStatus` API to check the status of
 * the
 * BatchDeleteDocument API. When a document is deleted from the index, Amazon Kendra returns `NOT_FOUND` as the status.
 */
export const batchGetDocumentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetDocumentStatusRequest,
    output: BatchGetDocumentStatusResponse,
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
 * Adds one or more documents to an index.
 *
 * The `BatchPutDocument` API enables you to ingest inline documents or a set
 * of documents stored in an Amazon S3 bucket. Use this API to ingest your text and
 * unstructured text into an index, add custom attributes to the documents, and to attach
 * an access control list to the documents added to the index.
 *
 * The documents are indexed asynchronously. You can see the progress of the batch using
 * Amazon Web Services
 * CloudWatch. Any error messages related to processing the batch are sent to your
 * Amazon Web Services
 * CloudWatch log. You can also use the `BatchGetDocumentStatus` API to
 * monitor the progress of indexing your documents.
 *
 * For an example of ingesting inline documents using Python and Java SDKs, see Adding files
 * directly to an index.
 */
export const batchPutDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a data source connector that you want to use with an Amazon Kendra
 * index.
 *
 * You specify a name, data source connector type and description for your data source. You
 * also specify configuration information for the data source connector.
 *
 * `CreateDataSource` is a synchronous operation. The operation returns 200 if the
 * data source was successfully created. Otherwise, an exception is raised.
 *
 * For an example of creating an index and data source using the Python SDK, see Getting started with Python
 * SDK. For an example of creating an index and data source using the Java SDK, see
 * Getting started with Java
 * SDK.
 */
export const createDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataSourceRequest,
  output: CreateDataSourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceAlreadyExistException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Fetches the queries that are suggested to your users.
 *
 * `GetQuerySuggestions` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const getQuerySuggestions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQuerySuggestionsRequest,
  output: GetQuerySuggestionsResponse,
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
 * Searches an index given an input query.
 *
 * If you are working with large language models (LLMs) or implementing retrieval
 * augmented generation (RAG) systems, you can use Amazon Kendra's Retrieve API, which can return longer semantically relevant passages. We
 * recommend using the `Retrieve` API instead of filing a service limit increase
 * to increase the `Query` API document excerpt length.
 *
 * You can configure boosting or relevance tuning at the query level to override boosting
 * at the index level, filter based on document fields/attributes and faceted search, and
 * filter based on the user or their group access to documents. You can also include certain
 * fields in the response that might provide useful additional information.
 *
 * A query response contains three types of results.
 *
 * - Relevant suggested answers. The answers can be either a text excerpt or table
 * excerpt. The answer can be highlighted in the excerpt.
 *
 * - Matching FAQs or questions-answer from your FAQ file.
 *
 * - Relevant documents. This result type includes an excerpt of the document with the
 * document title. The searched terms can be highlighted in the excerpt.
 *
 * You can specify that the query return only one type of result using the
 * `QueryResultTypeFilter` parameter. Each query returns the 100 most relevant
 * results. If you filter result type to only question-answers, a maximum of four results are
 * returned. If you filter result type to only answers, a maximum of three results are
 * returned.
 *
 * If you're using an Amazon Kendra Gen AI Enterprise Edition index, you can only use
 * `ATTRIBUTE_FILTER` to filter search results by user context. If you're
 * using an Amazon Kendra Gen AI Enterprise Edition index and you try to use
 * `USER_TOKEN` to configure user context policy, Amazon Kendra returns a
 * `ValidationException` error.
 */
export const query = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: QueryRequest,
  output: QueryResult,
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
