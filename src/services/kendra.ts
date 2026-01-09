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
  sdkId: "kendra",
  serviceShapeName: "AWSKendraFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "kendra" });
const ver = T.ServiceVersion("2019-02-03");
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
              `https://kendra-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://kendra-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://kendra.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://kendra.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ExperienceId = string;
export type IndexId = string;
export type DocumentId = string;
export type FeaturedResultsSetId = string;
export type RoleArn = string;
export type AccessControlConfigurationName = string;
export type Description = string;
export type ClientTokenName = string;
export type DataSourceName = string;
export type ScanSchedule = string;
export type LanguageCode = string;
export type ExperienceName = string;
export type FaqName = string;
export type FeaturedResultsSetName = string;
export type FeaturedResultsSetDescription = string;
export type QueryText = string;
export type IndexName = string;
export type QuerySuggestionsBlockListName = string;
export type ThesaurusName = string;
export type AccessControlConfigurationId = string;
export type DataSourceId = string;
export type FaqId = string;
export type GroupId = string;
export type PrincipalOrderingId = number;
export type QuerySuggestionsBlockListId = string;
export type ThesaurusId = string;
export type EntityId = string;
export type SuggestionQueryText = string;
export type NextToken = string;
export type MaxResultsIntegerForListAccessControlConfigurationsRequest = number;
export type MaxResultsIntegerForListDataSourcesRequest = number;
export type MaxResultsIntegerForListDataSourceSyncJobsRequest = number;
export type MaxResultsIntegerForListEntityPersonasRequest = number;
export type MaxResultsIntegerForListExperiencesRequest = number;
export type MaxResultsIntegerForListFaqsRequest = number;
export type MaxResultsIntegerForListFeaturedResultsSetsRequest = number;
export type MaxResultsIntegerForListPrincipalsRequest = number;
export type MaxResultsIntegerForListIndicesRequest = number;
export type MaxResultsIntegerForListQuerySuggestionsBlockLists = number;
export type AmazonResourceName = string;
export type MaxResultsIntegerForListThesauriRequest = number;
export type DocumentAttributeKey = string;
export type VisitorId = string;
export type QueryId = string;
export type TagKey = string;
export type ObjectBoolean = boolean;
export type MinimumNumberOfQueryingUsers = number;
export type MinimumQueryCount = number;
export type DataSourceSyncJobId = string;
export type Title = string;
export type PrincipalName = string;
export type SubnetId = string;
export type VpcSecurityGroupId = string;
export type TagValue = string;
export type S3BucketName = string;
export type S3ObjectKey = string;
export type KmsKeyId = string | redacted.Redacted<string>;
export type TopDocumentAttributeValueCountPairsSize = number;
export type DocumentMetadataConfigurationName = string;
export type Token = string;
export type ResultId = string;
export type StorageCapacityUnit = number;
export type QueryCapacityUnit = number;
export type ErrorMessage = string;
export type LambdaArn = string;
export type DataSourceInclusionsExclusionsStringsMember = string;
export type Url = string;
export type SecretArn = string;
export type DataSourceFieldName = string;
export type TenantDomain = string;
export type ServiceNowHostUrl = string;
export type MimeType = string;
export type UserAccount = string;
export type SharedDriveId = string;
export type CrawlDepth = number;
export type MaxLinksPerPage = number;
export type MaxContentSizePerPageInMegaBytes = number;
export type MaxUrlsPerMinuteCrawlRate = number;
export type OrganizationId = string;
export type FileSystemId = string;
export type TeamId = string;
export type SinceCrawlDate = string;
export type LookBackPeriod = number;
export type EnterpriseId = string;
export type Domain = string;
export type FolderId = string;
export type JiraAccountUrl = string;
export type RepositoryName = string;
export type SiteUrl = string;
export type SiteId = string;
export type Template = unknown;
export type IdentityAttributeName = string;
export type UserNameAttributeField = string;
export type GroupAttributeField = string;
export type Issuer = string;
export type ClaimRegex = string;
export type UserId = string;
export type DocumentMetadataBoolean = boolean;
export type Importance = number;
export type Duration = string;
export type Endpoint = string;
export type FailureReason = string;
export type DocumentTitle = string;
export type Content = string;
export type DocumentAttributeStringValue = string;
export type DataSourceDateFieldFormat = string;
export type IndexFieldName = string;
export type Host = string;
export type Port = number;
export type DatabaseHost = string;
export type DatabasePort = number;
export type DatabaseName = string;
export type TableName = string;
export type ColumnName = string;
export type OneDriveUser = string;
export type ServiceNowKnowledgeArticleFilterQuery = string;
export type ConfluenceSpaceIdentifier = string;
export type OrganizationName = string;
export type ValueImportanceMapKey = string;
export type QuerySuggestionsId = string;
export type IndexedQuestionAnswersCount = number;
export type IndexedTextDocumentsCount = number;
export type IndexedTextBytes = number;
export type NameType = string | redacted.Redacted<string>;
export type SalesforceCustomKnowledgeArticleTypeName = string;
export type SeedUrl = string;
export type SiteMap = string;
export type MetricValue = string;
export type FeedbackToken = string;
export type WarningMessage = string;
export type SuggestedQueryText = string;

//# Schemas
export type DocumentIdList = string[];
export const DocumentIdList = S.Array(S.String);
export type FeaturedResultsSetIdList = string[];
export const FeaturedResultsSetIdList = S.Array(S.String);
export type DataSourceType =
  | "S3"
  | "SHAREPOINT"
  | "DATABASE"
  | "SALESFORCE"
  | "ONEDRIVE"
  | "SERVICENOW"
  | "CUSTOM"
  | "CONFLUENCE"
  | "GOOGLEDRIVE"
  | "WEBCRAWLER"
  | "WORKDOCS"
  | "FSX"
  | "SLACK"
  | "BOX"
  | "QUIP"
  | "JIRA"
  | "GITHUB"
  | "ALFRESCO"
  | "TEMPLATE"
  | (string & {});
export const DataSourceType = S.String;
export type FaqFileFormat = "CSV" | "CSV_WITH_HEADER" | "JSON" | (string & {});
export const FaqFileFormat = S.String;
export type FeaturedResultsSetStatus = "ACTIVE" | "INACTIVE" | (string & {});
export const FeaturedResultsSetStatus = S.String;
export type QueryTextList = string[];
export const QueryTextList = S.Array(S.String);
export type IndexEdition =
  | "DEVELOPER_EDITION"
  | "ENTERPRISE_EDITION"
  | "GEN_AI_ENTERPRISE_EDITION"
  | (string & {});
export const IndexEdition = S.String;
export type UserContextPolicy =
  | "ATTRIBUTE_FILTER"
  | "USER_TOKEN"
  | (string & {});
export const UserContextPolicy = S.String;
export type EntityType = "USER" | "GROUP" | (string & {});
export const EntityType = S.String;
export interface EntityConfiguration {
  EntityId: string;
  EntityType: EntityType;
}
export const EntityConfiguration = S.suspend(() =>
  S.Struct({ EntityId: S.String, EntityType: EntityType }),
).annotations({
  identifier: "EntityConfiguration",
}) as any as S.Schema<EntityConfiguration>;
export type DisassociateEntityList = EntityConfiguration[];
export const DisassociateEntityList = S.Array(EntityConfiguration);
export type EntityIdsList = string[];
export const EntityIdsList = S.Array(S.String);
export type SuggestionType = "QUERY" | "DOCUMENT_ATTRIBUTES" | (string & {});
export const SuggestionType = S.String;
export type SuggestionTypes = SuggestionType[];
export const SuggestionTypes = S.Array(SuggestionType);
export type Interval =
  | "THIS_MONTH"
  | "THIS_WEEK"
  | "ONE_WEEK_AGO"
  | "TWO_WEEKS_AGO"
  | "ONE_MONTH_AGO"
  | "TWO_MONTHS_AGO"
  | (string & {});
export const Interval = S.String;
export type MetricType =
  | "QUERIES_BY_COUNT"
  | "QUERIES_BY_ZERO_CLICK_RATE"
  | "QUERIES_BY_ZERO_RESULT_RATE"
  | "DOCS_BY_CLICK_COUNT"
  | "AGG_QUERY_DOC_METRICS"
  | "TREND_QUERY_DOC_METRICS"
  | (string & {});
export const MetricType = S.String;
export type DataSourceSyncJobStatus =
  | "FAILED"
  | "SUCCEEDED"
  | "SYNCING"
  | "INCOMPLETE"
  | "STOPPING"
  | "ABORTED"
  | "SYNCING_INDEXING"
  | (string & {});
export const DataSourceSyncJobStatus = S.String;
export type DocumentAttributeKeyList = string[];
export const DocumentAttributeKeyList = S.Array(S.String);
export type QueryResultType =
  | "DOCUMENT"
  | "QUESTION_ANSWER"
  | "ANSWER"
  | (string & {});
export const QueryResultType = S.String;
export type SortOrder = "DESC" | "ASC" | (string & {});
export const SortOrder = S.String;
export interface SortingConfiguration {
  DocumentAttributeKey: string;
  SortOrder: SortOrder;
}
export const SortingConfiguration = S.suspend(() =>
  S.Struct({ DocumentAttributeKey: S.String, SortOrder: SortOrder }),
).annotations({
  identifier: "SortingConfiguration",
}) as any as S.Schema<SortingConfiguration>;
export type SortingConfigurationList = SortingConfiguration[];
export const SortingConfigurationList = S.Array(SortingConfiguration);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type Mode = "ENABLED" | "LEARN_ONLY" | (string & {});
export const Mode = S.String;
export interface BatchDeleteFeaturedResultsSetRequest {
  IndexId: string;
  FeaturedResultsSetIds: string[];
}
export const BatchDeleteFeaturedResultsSetRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    FeaturedResultsSetIds: FeaturedResultsSetIdList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDeleteFeaturedResultsSetRequest",
}) as any as S.Schema<BatchDeleteFeaturedResultsSetRequest>;
export interface ClearQuerySuggestionsRequest {
  IndexId: string;
}
export const ClearQuerySuggestionsRequest = S.suspend(() =>
  S.Struct({ IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ClearQuerySuggestionsRequest",
}) as any as S.Schema<ClearQuerySuggestionsRequest>;
export interface ClearQuerySuggestionsResponse {}
export const ClearQuerySuggestionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ClearQuerySuggestionsResponse",
}) as any as S.Schema<ClearQuerySuggestionsResponse>;
export interface S3Path {
  Bucket: string;
  Key: string;
}
export const S3Path = S.suspend(() =>
  S.Struct({ Bucket: S.String, Key: S.String }),
).annotations({ identifier: "S3Path" }) as any as S.Schema<S3Path>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateQuerySuggestionsBlockListRequest {
  IndexId: string;
  Name: string;
  Description?: string;
  SourceS3Path: S3Path;
  ClientToken?: string;
  RoleArn: string;
  Tags?: Tag[];
}
export const CreateQuerySuggestionsBlockListRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    SourceS3Path: S3Path,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    RoleArn: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateQuerySuggestionsBlockListRequest",
}) as any as S.Schema<CreateQuerySuggestionsBlockListRequest>;
export interface CreateThesaurusRequest {
  IndexId: string;
  Name: string;
  Description?: string;
  RoleArn: string;
  Tags?: Tag[];
  SourceS3Path: S3Path;
  ClientToken?: string;
}
export const CreateThesaurusRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    RoleArn: S.String,
    Tags: S.optional(TagList),
    SourceS3Path: S3Path,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateThesaurusRequest",
}) as any as S.Schema<CreateThesaurusRequest>;
export interface DeleteAccessControlConfigurationRequest {
  IndexId: string;
  Id: string;
}
export const DeleteAccessControlConfigurationRequest = S.suspend(() =>
  S.Struct({ IndexId: S.String, Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAccessControlConfigurationRequest",
}) as any as S.Schema<DeleteAccessControlConfigurationRequest>;
export interface DeleteAccessControlConfigurationResponse {}
export const DeleteAccessControlConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccessControlConfigurationResponse",
}) as any as S.Schema<DeleteAccessControlConfigurationResponse>;
export interface DeleteDataSourceRequest {
  Id: string;
  IndexId: string;
}
export const DeleteDataSourceRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
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
export interface DeleteExperienceRequest {
  Id: string;
  IndexId: string;
}
export const DeleteExperienceRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteExperienceRequest",
}) as any as S.Schema<DeleteExperienceRequest>;
export interface DeleteExperienceResponse {}
export const DeleteExperienceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteExperienceResponse",
}) as any as S.Schema<DeleteExperienceResponse>;
export interface DeleteFaqRequest {
  Id: string;
  IndexId: string;
}
export const DeleteFaqRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFaqRequest",
}) as any as S.Schema<DeleteFaqRequest>;
export interface DeleteFaqResponse {}
export const DeleteFaqResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFaqResponse",
}) as any as S.Schema<DeleteFaqResponse>;
export interface DeleteIndexRequest {
  Id: string;
}
export const DeleteIndexRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteIndexRequest",
}) as any as S.Schema<DeleteIndexRequest>;
export interface DeleteIndexResponse {}
export const DeleteIndexResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteIndexResponse",
}) as any as S.Schema<DeleteIndexResponse>;
export interface DeletePrincipalMappingRequest {
  IndexId: string;
  DataSourceId?: string;
  GroupId: string;
  OrderingId?: number;
}
export const DeletePrincipalMappingRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    DataSourceId: S.optional(S.String),
    GroupId: S.String,
    OrderingId: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePrincipalMappingRequest",
}) as any as S.Schema<DeletePrincipalMappingRequest>;
export interface DeletePrincipalMappingResponse {}
export const DeletePrincipalMappingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePrincipalMappingResponse",
}) as any as S.Schema<DeletePrincipalMappingResponse>;
export interface DeleteQuerySuggestionsBlockListRequest {
  IndexId: string;
  Id: string;
}
export const DeleteQuerySuggestionsBlockListRequest = S.suspend(() =>
  S.Struct({ IndexId: S.String, Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteQuerySuggestionsBlockListRequest",
}) as any as S.Schema<DeleteQuerySuggestionsBlockListRequest>;
export interface DeleteQuerySuggestionsBlockListResponse {}
export const DeleteQuerySuggestionsBlockListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteQuerySuggestionsBlockListResponse",
}) as any as S.Schema<DeleteQuerySuggestionsBlockListResponse>;
export interface DeleteThesaurusRequest {
  Id: string;
  IndexId: string;
}
export const DeleteThesaurusRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteThesaurusRequest",
}) as any as S.Schema<DeleteThesaurusRequest>;
export interface DeleteThesaurusResponse {}
export const DeleteThesaurusResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteThesaurusResponse",
}) as any as S.Schema<DeleteThesaurusResponse>;
export interface DescribeAccessControlConfigurationRequest {
  IndexId: string;
  Id: string;
}
export const DescribeAccessControlConfigurationRequest = S.suspend(() =>
  S.Struct({ IndexId: S.String, Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAccessControlConfigurationRequest",
}) as any as S.Schema<DescribeAccessControlConfigurationRequest>;
export interface DescribeDataSourceRequest {
  Id: string;
  IndexId: string;
}
export const DescribeDataSourceRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDataSourceRequest",
}) as any as S.Schema<DescribeDataSourceRequest>;
export interface DescribeExperienceRequest {
  Id: string;
  IndexId: string;
}
export const DescribeExperienceRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeExperienceRequest",
}) as any as S.Schema<DescribeExperienceRequest>;
export interface DescribeFaqRequest {
  Id: string;
  IndexId: string;
}
export const DescribeFaqRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFaqRequest",
}) as any as S.Schema<DescribeFaqRequest>;
export interface DescribeFeaturedResultsSetRequest {
  IndexId: string;
  FeaturedResultsSetId: string;
}
export const DescribeFeaturedResultsSetRequest = S.suspend(() =>
  S.Struct({ IndexId: S.String, FeaturedResultsSetId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFeaturedResultsSetRequest",
}) as any as S.Schema<DescribeFeaturedResultsSetRequest>;
export interface DescribeIndexRequest {
  Id: string;
}
export const DescribeIndexRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeIndexRequest",
}) as any as S.Schema<DescribeIndexRequest>;
export interface DescribePrincipalMappingRequest {
  IndexId: string;
  DataSourceId?: string;
  GroupId: string;
}
export const DescribePrincipalMappingRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    DataSourceId: S.optional(S.String),
    GroupId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePrincipalMappingRequest",
}) as any as S.Schema<DescribePrincipalMappingRequest>;
export interface DescribeQuerySuggestionsBlockListRequest {
  IndexId: string;
  Id: string;
}
export const DescribeQuerySuggestionsBlockListRequest = S.suspend(() =>
  S.Struct({ IndexId: S.String, Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeQuerySuggestionsBlockListRequest",
}) as any as S.Schema<DescribeQuerySuggestionsBlockListRequest>;
export interface DescribeQuerySuggestionsConfigRequest {
  IndexId: string;
}
export const DescribeQuerySuggestionsConfigRequest = S.suspend(() =>
  S.Struct({ IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeQuerySuggestionsConfigRequest",
}) as any as S.Schema<DescribeQuerySuggestionsConfigRequest>;
export interface DescribeThesaurusRequest {
  Id: string;
  IndexId: string;
}
export const DescribeThesaurusRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeThesaurusRequest",
}) as any as S.Schema<DescribeThesaurusRequest>;
export interface DisassociateEntitiesFromExperienceRequest {
  Id: string;
  IndexId: string;
  EntityList: EntityConfiguration[];
}
export const DisassociateEntitiesFromExperienceRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    IndexId: S.String,
    EntityList: DisassociateEntityList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateEntitiesFromExperienceRequest",
}) as any as S.Schema<DisassociateEntitiesFromExperienceRequest>;
export interface DisassociatePersonasFromEntitiesRequest {
  Id: string;
  IndexId: string;
  EntityIds: string[];
}
export const DisassociatePersonasFromEntitiesRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String, EntityIds: EntityIdsList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociatePersonasFromEntitiesRequest",
}) as any as S.Schema<DisassociatePersonasFromEntitiesRequest>;
export interface GetSnapshotsRequest {
  IndexId: string;
  Interval: Interval;
  MetricType: MetricType;
  NextToken?: string;
  MaxResults?: number;
}
export const GetSnapshotsRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    Interval: Interval,
    MetricType: MetricType,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSnapshotsRequest",
}) as any as S.Schema<GetSnapshotsRequest>;
export interface ListAccessControlConfigurationsRequest {
  IndexId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAccessControlConfigurationsRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAccessControlConfigurationsRequest",
}) as any as S.Schema<ListAccessControlConfigurationsRequest>;
export interface ListDataSourcesRequest {
  IndexId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDataSourcesRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataSourcesRequest",
}) as any as S.Schema<ListDataSourcesRequest>;
export interface ListEntityPersonasRequest {
  Id: string;
  IndexId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListEntityPersonasRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEntityPersonasRequest",
}) as any as S.Schema<ListEntityPersonasRequest>;
export interface ListExperienceEntitiesRequest {
  Id: string;
  IndexId: string;
  NextToken?: string;
}
export const ListExperienceEntitiesRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    IndexId: S.String,
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExperienceEntitiesRequest",
}) as any as S.Schema<ListExperienceEntitiesRequest>;
export interface ListExperiencesRequest {
  IndexId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListExperiencesRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExperiencesRequest",
}) as any as S.Schema<ListExperiencesRequest>;
export interface ListFaqsRequest {
  IndexId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListFaqsRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFaqsRequest",
}) as any as S.Schema<ListFaqsRequest>;
export interface ListFeaturedResultsSetsRequest {
  IndexId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListFeaturedResultsSetsRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFeaturedResultsSetsRequest",
}) as any as S.Schema<ListFeaturedResultsSetsRequest>;
export interface ListGroupsOlderThanOrderingIdRequest {
  IndexId: string;
  DataSourceId?: string;
  OrderingId: number;
  NextToken?: string;
  MaxResults?: number;
}
export const ListGroupsOlderThanOrderingIdRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    DataSourceId: S.optional(S.String),
    OrderingId: S.Number,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListGroupsOlderThanOrderingIdRequest",
}) as any as S.Schema<ListGroupsOlderThanOrderingIdRequest>;
export interface ListIndicesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListIndicesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListIndicesRequest",
}) as any as S.Schema<ListIndicesRequest>;
export interface ListQuerySuggestionsBlockListsRequest {
  IndexId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListQuerySuggestionsBlockListsRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListQuerySuggestionsBlockListsRequest",
}) as any as S.Schema<ListQuerySuggestionsBlockListsRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListThesauriRequest {
  IndexId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListThesauriRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListThesauriRequest",
}) as any as S.Schema<ListThesauriRequest>;
export type DocumentAttributeStringListValue = string[];
export const DocumentAttributeStringListValue = S.Array(S.String);
export interface DocumentAttributeValue {
  StringValue?: string;
  StringListValue?: string[];
  LongValue?: number;
  DateValue?: Date;
}
export const DocumentAttributeValue = S.suspend(() =>
  S.Struct({
    StringValue: S.optional(S.String),
    StringListValue: S.optional(DocumentAttributeStringListValue),
    LongValue: S.optional(S.Number),
    DateValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DocumentAttributeValue",
}) as any as S.Schema<DocumentAttributeValue>;
export interface DocumentAttribute {
  Key: string;
  Value: DocumentAttributeValue;
}
export const DocumentAttribute = S.suspend(() =>
  S.Struct({ Key: S.String, Value: DocumentAttributeValue }),
).annotations({
  identifier: "DocumentAttribute",
}) as any as S.Schema<DocumentAttribute>;
export interface AttributeFilter {
  AndAllFilters?: AttributeFilter[];
  OrAllFilters?: AttributeFilter[];
  NotFilter?: AttributeFilter;
  EqualsTo?: DocumentAttribute;
  ContainsAll?: DocumentAttribute;
  ContainsAny?: DocumentAttribute;
  GreaterThan?: DocumentAttribute;
  GreaterThanOrEquals?: DocumentAttribute;
  LessThan?: DocumentAttribute;
  LessThanOrEquals?: DocumentAttribute;
}
export const AttributeFilter = S.suspend(() =>
  S.Struct({
    AndAllFilters: S.optional(
      S.suspend(() => AttributeFilterList).annotations({
        identifier: "AttributeFilterList",
      }),
    ),
    OrAllFilters: S.optional(
      S.suspend(() => AttributeFilterList).annotations({
        identifier: "AttributeFilterList",
      }),
    ),
    NotFilter: S.optional(
      S.suspend(
        (): S.Schema<AttributeFilter, any> => AttributeFilter,
      ).annotations({ identifier: "AttributeFilter" }),
    ),
    EqualsTo: S.optional(DocumentAttribute),
    ContainsAll: S.optional(DocumentAttribute),
    ContainsAny: S.optional(DocumentAttribute),
    GreaterThan: S.optional(DocumentAttribute),
    GreaterThanOrEquals: S.optional(DocumentAttribute),
    LessThan: S.optional(DocumentAttribute),
    LessThanOrEquals: S.optional(DocumentAttribute),
  }),
).annotations({
  identifier: "AttributeFilter",
}) as any as S.Schema<AttributeFilter>;
export type Order = "ASCENDING" | "DESCENDING" | (string & {});
export const Order = S.String;
export type ValueImportanceMap = { [key: string]: number | undefined };
export const ValueImportanceMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.Number),
});
export interface Relevance {
  Freshness?: boolean;
  Importance?: number;
  Duration?: string;
  RankOrder?: Order;
  ValueImportanceMap?: { [key: string]: number | undefined };
}
export const Relevance = S.suspend(() =>
  S.Struct({
    Freshness: S.optional(S.Boolean),
    Importance: S.optional(S.Number),
    Duration: S.optional(S.String),
    RankOrder: S.optional(Order),
    ValueImportanceMap: S.optional(ValueImportanceMap),
  }),
).annotations({ identifier: "Relevance" }) as any as S.Schema<Relevance>;
export interface DocumentRelevanceConfiguration {
  Name: string;
  Relevance: Relevance;
}
export const DocumentRelevanceConfiguration = S.suspend(() =>
  S.Struct({ Name: S.String, Relevance: Relevance }),
).annotations({
  identifier: "DocumentRelevanceConfiguration",
}) as any as S.Schema<DocumentRelevanceConfiguration>;
export type DocumentRelevanceOverrideConfigurationList =
  DocumentRelevanceConfiguration[];
export const DocumentRelevanceOverrideConfigurationList = S.Array(
  DocumentRelevanceConfiguration,
);
export type Groups = string[];
export const Groups = S.Array(S.String);
export interface DataSourceGroup {
  GroupId: string;
  DataSourceId: string;
}
export const DataSourceGroup = S.suspend(() =>
  S.Struct({ GroupId: S.String, DataSourceId: S.String }),
).annotations({
  identifier: "DataSourceGroup",
}) as any as S.Schema<DataSourceGroup>;
export type DataSourceGroups = DataSourceGroup[];
export const DataSourceGroups = S.Array(DataSourceGroup);
export interface UserContext {
  Token?: string;
  UserId?: string;
  Groups?: string[];
  DataSourceGroups?: DataSourceGroup[];
}
export const UserContext = S.suspend(() =>
  S.Struct({
    Token: S.optional(S.String),
    UserId: S.optional(S.String),
    Groups: S.optional(Groups),
    DataSourceGroups: S.optional(DataSourceGroups),
  }),
).annotations({ identifier: "UserContext" }) as any as S.Schema<UserContext>;
export interface RetrieveRequest {
  IndexId: string;
  QueryText: string;
  AttributeFilter?: AttributeFilter;
  RequestedDocumentAttributes?: string[];
  DocumentRelevanceOverrideConfigurations?: DocumentRelevanceConfiguration[];
  PageNumber?: number;
  PageSize?: number;
  UserContext?: UserContext;
}
export const RetrieveRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RetrieveRequest",
}) as any as S.Schema<RetrieveRequest>;
export interface StartDataSourceSyncJobRequest {
  Id: string;
  IndexId: string;
}
export const StartDataSourceSyncJobRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartDataSourceSyncJobRequest",
}) as any as S.Schema<StartDataSourceSyncJobRequest>;
export interface StopDataSourceSyncJobRequest {
  Id: string;
  IndexId: string;
}
export const StopDataSourceSyncJobRequest = S.suspend(() =>
  S.Struct({ Id: S.String, IndexId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
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
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type PrincipalType = "USER" | "GROUP" | (string & {});
export const PrincipalType = S.String;
export type ReadAccessType = "ALLOW" | "DENY" | (string & {});
export const ReadAccessType = S.String;
export interface Principal {
  Name: string;
  Type: PrincipalType;
  Access: ReadAccessType;
  DataSourceId?: string;
}
export const Principal = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: PrincipalType,
    Access: ReadAccessType,
    DataSourceId: S.optional(S.String),
  }),
).annotations({ identifier: "Principal" }) as any as S.Schema<Principal>;
export type PrincipalList = Principal[];
export const PrincipalList = S.Array(Principal);
export interface HierarchicalPrincipal {
  PrincipalList: Principal[];
}
export const HierarchicalPrincipal = S.suspend(() =>
  S.Struct({ PrincipalList: PrincipalList }),
).annotations({
  identifier: "HierarchicalPrincipal",
}) as any as S.Schema<HierarchicalPrincipal>;
export type HierarchicalPrincipalList = HierarchicalPrincipal[];
export const HierarchicalPrincipalList = S.Array(HierarchicalPrincipal);
export interface UpdateAccessControlConfigurationRequest {
  IndexId: string;
  Id: string;
  Name?: string;
  Description?: string;
  AccessControlList?: Principal[];
  HierarchicalAccessControlList?: HierarchicalPrincipal[];
}
export const UpdateAccessControlConfigurationRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    Id: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    AccessControlList: S.optional(PrincipalList),
    HierarchicalAccessControlList: S.optional(HierarchicalPrincipalList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAccessControlConfigurationRequest",
}) as any as S.Schema<UpdateAccessControlConfigurationRequest>;
export interface UpdateAccessControlConfigurationResponse {}
export const UpdateAccessControlConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAccessControlConfigurationResponse",
}) as any as S.Schema<UpdateAccessControlConfigurationResponse>;
export type DataSourceInclusionsExclusionsStrings = string[];
export const DataSourceInclusionsExclusionsStrings = S.Array(S.String);
export interface DocumentsMetadataConfiguration {
  S3Prefix?: string;
}
export const DocumentsMetadataConfiguration = S.suspend(() =>
  S.Struct({ S3Prefix: S.optional(S.String) }),
).annotations({
  identifier: "DocumentsMetadataConfiguration",
}) as any as S.Schema<DocumentsMetadataConfiguration>;
export interface AccessControlListConfiguration {
  KeyPath?: string;
}
export const AccessControlListConfiguration = S.suspend(() =>
  S.Struct({ KeyPath: S.optional(S.String) }),
).annotations({
  identifier: "AccessControlListConfiguration",
}) as any as S.Schema<AccessControlListConfiguration>;
export interface S3DataSourceConfiguration {
  BucketName: string;
  InclusionPrefixes?: string[];
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  DocumentsMetadataConfiguration?: DocumentsMetadataConfiguration;
  AccessControlListConfiguration?: AccessControlListConfiguration;
}
export const S3DataSourceConfiguration = S.suspend(() =>
  S.Struct({
    BucketName: S.String,
    InclusionPrefixes: S.optional(DataSourceInclusionsExclusionsStrings),
    InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    DocumentsMetadataConfiguration: S.optional(DocumentsMetadataConfiguration),
    AccessControlListConfiguration: S.optional(AccessControlListConfiguration),
  }),
).annotations({
  identifier: "S3DataSourceConfiguration",
}) as any as S.Schema<S3DataSourceConfiguration>;
export type SharePointVersion =
  | "SHAREPOINT_2013"
  | "SHAREPOINT_2016"
  | "SHAREPOINT_ONLINE"
  | "SHAREPOINT_2019"
  | (string & {});
export const SharePointVersion = S.String;
export type SharePointUrlList = string[];
export const SharePointUrlList = S.Array(S.String);
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface DataSourceVpcConfiguration {
  SubnetIds: string[];
  SecurityGroupIds: string[];
}
export const DataSourceVpcConfiguration = S.suspend(() =>
  S.Struct({ SubnetIds: SubnetIdList, SecurityGroupIds: SecurityGroupIdList }),
).annotations({
  identifier: "DataSourceVpcConfiguration",
}) as any as S.Schema<DataSourceVpcConfiguration>;
export interface DataSourceToIndexFieldMapping {
  DataSourceFieldName: string;
  DateFieldFormat?: string;
  IndexFieldName: string;
}
export const DataSourceToIndexFieldMapping = S.suspend(() =>
  S.Struct({
    DataSourceFieldName: S.String,
    DateFieldFormat: S.optional(S.String),
    IndexFieldName: S.String,
  }),
).annotations({
  identifier: "DataSourceToIndexFieldMapping",
}) as any as S.Schema<DataSourceToIndexFieldMapping>;
export type DataSourceToIndexFieldMappingList = DataSourceToIndexFieldMapping[];
export const DataSourceToIndexFieldMappingList = S.Array(
  DataSourceToIndexFieldMapping,
);
export type SharePointOnlineAuthenticationType =
  | "HTTP_BASIC"
  | "OAUTH2"
  | (string & {});
export const SharePointOnlineAuthenticationType = S.String;
export interface ProxyConfiguration {
  Host: string;
  Port: number;
  Credentials?: string;
}
export const ProxyConfiguration = S.suspend(() =>
  S.Struct({
    Host: S.String,
    Port: S.Number,
    Credentials: S.optional(S.String),
  }),
).annotations({
  identifier: "ProxyConfiguration",
}) as any as S.Schema<ProxyConfiguration>;
export interface SharePointConfiguration {
  SharePointVersion: SharePointVersion;
  Urls: string[];
  SecretArn: string;
  CrawlAttachments?: boolean;
  UseChangeLog?: boolean;
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  VpcConfiguration?: DataSourceVpcConfiguration;
  FieldMappings?: DataSourceToIndexFieldMapping[];
  DocumentTitleFieldName?: string;
  DisableLocalGroups?: boolean;
  SslCertificateS3Path?: S3Path;
  AuthenticationType?: SharePointOnlineAuthenticationType;
  ProxyConfiguration?: ProxyConfiguration;
}
export const SharePointConfiguration = S.suspend(() =>
  S.Struct({
    SharePointVersion: SharePointVersion,
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
    AuthenticationType: S.optional(SharePointOnlineAuthenticationType),
    ProxyConfiguration: S.optional(ProxyConfiguration),
  }),
).annotations({
  identifier: "SharePointConfiguration",
}) as any as S.Schema<SharePointConfiguration>;
export type DatabaseEngineType =
  | "RDS_AURORA_MYSQL"
  | "RDS_AURORA_POSTGRESQL"
  | "RDS_MYSQL"
  | "RDS_POSTGRESQL"
  | (string & {});
export const DatabaseEngineType = S.String;
export interface ConnectionConfiguration {
  DatabaseHost: string;
  DatabasePort: number;
  DatabaseName: string;
  TableName: string;
  SecretArn: string;
}
export const ConnectionConfiguration = S.suspend(() =>
  S.Struct({
    DatabaseHost: S.String,
    DatabasePort: S.Number,
    DatabaseName: S.String,
    TableName: S.String,
    SecretArn: S.String,
  }),
).annotations({
  identifier: "ConnectionConfiguration",
}) as any as S.Schema<ConnectionConfiguration>;
export type ChangeDetectingColumns = string[];
export const ChangeDetectingColumns = S.Array(S.String);
export interface ColumnConfiguration {
  DocumentIdColumnName: string;
  DocumentDataColumnName: string;
  DocumentTitleColumnName?: string;
  FieldMappings?: DataSourceToIndexFieldMapping[];
  ChangeDetectingColumns: string[];
}
export const ColumnConfiguration = S.suspend(() =>
  S.Struct({
    DocumentIdColumnName: S.String,
    DocumentDataColumnName: S.String,
    DocumentTitleColumnName: S.optional(S.String),
    FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
    ChangeDetectingColumns: ChangeDetectingColumns,
  }),
).annotations({
  identifier: "ColumnConfiguration",
}) as any as S.Schema<ColumnConfiguration>;
export interface AclConfiguration {
  AllowedGroupsColumnName: string;
}
export const AclConfiguration = S.suspend(() =>
  S.Struct({ AllowedGroupsColumnName: S.String }),
).annotations({
  identifier: "AclConfiguration",
}) as any as S.Schema<AclConfiguration>;
export type QueryIdentifiersEnclosingOption =
  | "DOUBLE_QUOTES"
  | "NONE"
  | (string & {});
export const QueryIdentifiersEnclosingOption = S.String;
export interface SqlConfiguration {
  QueryIdentifiersEnclosingOption?: QueryIdentifiersEnclosingOption;
}
export const SqlConfiguration = S.suspend(() =>
  S.Struct({
    QueryIdentifiersEnclosingOption: S.optional(
      QueryIdentifiersEnclosingOption,
    ),
  }),
).annotations({
  identifier: "SqlConfiguration",
}) as any as S.Schema<SqlConfiguration>;
export interface DatabaseConfiguration {
  DatabaseEngineType: DatabaseEngineType;
  ConnectionConfiguration: ConnectionConfiguration;
  VpcConfiguration?: DataSourceVpcConfiguration;
  ColumnConfiguration: ColumnConfiguration;
  AclConfiguration?: AclConfiguration;
  SqlConfiguration?: SqlConfiguration;
}
export const DatabaseConfiguration = S.suspend(() =>
  S.Struct({
    DatabaseEngineType: DatabaseEngineType,
    ConnectionConfiguration: ConnectionConfiguration,
    VpcConfiguration: S.optional(DataSourceVpcConfiguration),
    ColumnConfiguration: ColumnConfiguration,
    AclConfiguration: S.optional(AclConfiguration),
    SqlConfiguration: S.optional(SqlConfiguration),
  }),
).annotations({
  identifier: "DatabaseConfiguration",
}) as any as S.Schema<DatabaseConfiguration>;
export type SalesforceStandardObjectName =
  | "ACCOUNT"
  | "CAMPAIGN"
  | "CASE"
  | "CONTACT"
  | "CONTRACT"
  | "DOCUMENT"
  | "GROUP"
  | "IDEA"
  | "LEAD"
  | "OPPORTUNITY"
  | "PARTNER"
  | "PRICEBOOK"
  | "PRODUCT"
  | "PROFILE"
  | "SOLUTION"
  | "TASK"
  | "USER"
  | (string & {});
export const SalesforceStandardObjectName = S.String;
export interface SalesforceStandardObjectConfiguration {
  Name: SalesforceStandardObjectName;
  DocumentDataFieldName: string;
  DocumentTitleFieldName?: string;
  FieldMappings?: DataSourceToIndexFieldMapping[];
}
export const SalesforceStandardObjectConfiguration = S.suspend(() =>
  S.Struct({
    Name: SalesforceStandardObjectName,
    DocumentDataFieldName: S.String,
    DocumentTitleFieldName: S.optional(S.String),
    FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  }),
).annotations({
  identifier: "SalesforceStandardObjectConfiguration",
}) as any as S.Schema<SalesforceStandardObjectConfiguration>;
export type SalesforceStandardObjectConfigurationList =
  SalesforceStandardObjectConfiguration[];
export const SalesforceStandardObjectConfigurationList = S.Array(
  SalesforceStandardObjectConfiguration,
);
export type SalesforceKnowledgeArticleState =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | (string & {});
export const SalesforceKnowledgeArticleState = S.String;
export type SalesforceKnowledgeArticleStateList =
  SalesforceKnowledgeArticleState[];
export const SalesforceKnowledgeArticleStateList = S.Array(
  SalesforceKnowledgeArticleState,
);
export interface SalesforceStandardKnowledgeArticleTypeConfiguration {
  DocumentDataFieldName: string;
  DocumentTitleFieldName?: string;
  FieldMappings?: DataSourceToIndexFieldMapping[];
}
export const SalesforceStandardKnowledgeArticleTypeConfiguration = S.suspend(
  () =>
    S.Struct({
      DocumentDataFieldName: S.String,
      DocumentTitleFieldName: S.optional(S.String),
      FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
    }),
).annotations({
  identifier: "SalesforceStandardKnowledgeArticleTypeConfiguration",
}) as any as S.Schema<SalesforceStandardKnowledgeArticleTypeConfiguration>;
export interface SalesforceCustomKnowledgeArticleTypeConfiguration {
  Name: string;
  DocumentDataFieldName: string;
  DocumentTitleFieldName?: string;
  FieldMappings?: DataSourceToIndexFieldMapping[];
}
export const SalesforceCustomKnowledgeArticleTypeConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DocumentDataFieldName: S.String,
    DocumentTitleFieldName: S.optional(S.String),
    FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  }),
).annotations({
  identifier: "SalesforceCustomKnowledgeArticleTypeConfiguration",
}) as any as S.Schema<SalesforceCustomKnowledgeArticleTypeConfiguration>;
export type SalesforceCustomKnowledgeArticleTypeConfigurationList =
  SalesforceCustomKnowledgeArticleTypeConfiguration[];
export const SalesforceCustomKnowledgeArticleTypeConfigurationList = S.Array(
  SalesforceCustomKnowledgeArticleTypeConfiguration,
);
export interface SalesforceKnowledgeArticleConfiguration {
  IncludedStates: SalesforceKnowledgeArticleState[];
  StandardKnowledgeArticleTypeConfiguration?: SalesforceStandardKnowledgeArticleTypeConfiguration;
  CustomKnowledgeArticleTypeConfigurations?: SalesforceCustomKnowledgeArticleTypeConfiguration[];
}
export const SalesforceKnowledgeArticleConfiguration = S.suspend(() =>
  S.Struct({
    IncludedStates: SalesforceKnowledgeArticleStateList,
    StandardKnowledgeArticleTypeConfiguration: S.optional(
      SalesforceStandardKnowledgeArticleTypeConfiguration,
    ),
    CustomKnowledgeArticleTypeConfigurations: S.optional(
      SalesforceCustomKnowledgeArticleTypeConfigurationList,
    ),
  }),
).annotations({
  identifier: "SalesforceKnowledgeArticleConfiguration",
}) as any as S.Schema<SalesforceKnowledgeArticleConfiguration>;
export type SalesforceChatterFeedIncludeFilterType =
  | "ACTIVE_USER"
  | "STANDARD_USER"
  | (string & {});
export const SalesforceChatterFeedIncludeFilterType = S.String;
export type SalesforceChatterFeedIncludeFilterTypes =
  SalesforceChatterFeedIncludeFilterType[];
export const SalesforceChatterFeedIncludeFilterTypes = S.Array(
  SalesforceChatterFeedIncludeFilterType,
);
export interface SalesforceChatterFeedConfiguration {
  DocumentDataFieldName: string;
  DocumentTitleFieldName?: string;
  FieldMappings?: DataSourceToIndexFieldMapping[];
  IncludeFilterTypes?: SalesforceChatterFeedIncludeFilterType[];
}
export const SalesforceChatterFeedConfiguration = S.suspend(() =>
  S.Struct({
    DocumentDataFieldName: S.String,
    DocumentTitleFieldName: S.optional(S.String),
    FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
    IncludeFilterTypes: S.optional(SalesforceChatterFeedIncludeFilterTypes),
  }),
).annotations({
  identifier: "SalesforceChatterFeedConfiguration",
}) as any as S.Schema<SalesforceChatterFeedConfiguration>;
export interface SalesforceStandardObjectAttachmentConfiguration {
  DocumentTitleFieldName?: string;
  FieldMappings?: DataSourceToIndexFieldMapping[];
}
export const SalesforceStandardObjectAttachmentConfiguration = S.suspend(() =>
  S.Struct({
    DocumentTitleFieldName: S.optional(S.String),
    FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  }),
).annotations({
  identifier: "SalesforceStandardObjectAttachmentConfiguration",
}) as any as S.Schema<SalesforceStandardObjectAttachmentConfiguration>;
export interface SalesforceConfiguration {
  ServerUrl: string;
  SecretArn: string;
  StandardObjectConfigurations?: SalesforceStandardObjectConfiguration[];
  KnowledgeArticleConfiguration?: SalesforceKnowledgeArticleConfiguration;
  ChatterFeedConfiguration?: SalesforceChatterFeedConfiguration;
  CrawlAttachments?: boolean;
  StandardObjectAttachmentConfiguration?: SalesforceStandardObjectAttachmentConfiguration;
  IncludeAttachmentFilePatterns?: string[];
  ExcludeAttachmentFilePatterns?: string[];
}
export const SalesforceConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "SalesforceConfiguration",
}) as any as S.Schema<SalesforceConfiguration>;
export type OneDriveUserList = string[];
export const OneDriveUserList = S.Array(S.String);
export interface OneDriveUsers {
  OneDriveUserList?: string[];
  OneDriveUserS3Path?: S3Path;
}
export const OneDriveUsers = S.suspend(() =>
  S.Struct({
    OneDriveUserList: S.optional(OneDriveUserList),
    OneDriveUserS3Path: S.optional(S3Path),
  }),
).annotations({
  identifier: "OneDriveUsers",
}) as any as S.Schema<OneDriveUsers>;
export interface OneDriveConfiguration {
  TenantDomain: string;
  SecretArn: string;
  OneDriveUsers: OneDriveUsers;
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  FieldMappings?: DataSourceToIndexFieldMapping[];
  DisableLocalGroups?: boolean;
}
export const OneDriveConfiguration = S.suspend(() =>
  S.Struct({
    TenantDomain: S.String,
    SecretArn: S.String,
    OneDriveUsers: OneDriveUsers,
    InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
    DisableLocalGroups: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "OneDriveConfiguration",
}) as any as S.Schema<OneDriveConfiguration>;
export type ServiceNowBuildVersionType = "LONDON" | "OTHERS" | (string & {});
export const ServiceNowBuildVersionType = S.String;
export interface ServiceNowKnowledgeArticleConfiguration {
  CrawlAttachments?: boolean;
  IncludeAttachmentFilePatterns?: string[];
  ExcludeAttachmentFilePatterns?: string[];
  DocumentDataFieldName: string;
  DocumentTitleFieldName?: string;
  FieldMappings?: DataSourceToIndexFieldMapping[];
  FilterQuery?: string;
}
export const ServiceNowKnowledgeArticleConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ServiceNowKnowledgeArticleConfiguration",
}) as any as S.Schema<ServiceNowKnowledgeArticleConfiguration>;
export interface ServiceNowServiceCatalogConfiguration {
  CrawlAttachments?: boolean;
  IncludeAttachmentFilePatterns?: string[];
  ExcludeAttachmentFilePatterns?: string[];
  DocumentDataFieldName: string;
  DocumentTitleFieldName?: string;
  FieldMappings?: DataSourceToIndexFieldMapping[];
}
export const ServiceNowServiceCatalogConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ServiceNowServiceCatalogConfiguration",
}) as any as S.Schema<ServiceNowServiceCatalogConfiguration>;
export type ServiceNowAuthenticationType =
  | "HTTP_BASIC"
  | "OAUTH2"
  | (string & {});
export const ServiceNowAuthenticationType = S.String;
export interface ServiceNowConfiguration {
  HostUrl: string;
  SecretArn: string;
  ServiceNowBuildVersion: ServiceNowBuildVersionType;
  KnowledgeArticleConfiguration?: ServiceNowKnowledgeArticleConfiguration;
  ServiceCatalogConfiguration?: ServiceNowServiceCatalogConfiguration;
  AuthenticationType?: ServiceNowAuthenticationType;
}
export const ServiceNowConfiguration = S.suspend(() =>
  S.Struct({
    HostUrl: S.String,
    SecretArn: S.String,
    ServiceNowBuildVersion: ServiceNowBuildVersionType,
    KnowledgeArticleConfiguration: S.optional(
      ServiceNowKnowledgeArticleConfiguration,
    ),
    ServiceCatalogConfiguration: S.optional(
      ServiceNowServiceCatalogConfiguration,
    ),
    AuthenticationType: S.optional(ServiceNowAuthenticationType),
  }),
).annotations({
  identifier: "ServiceNowConfiguration",
}) as any as S.Schema<ServiceNowConfiguration>;
export type ConfluenceVersion = "CLOUD" | "SERVER" | (string & {});
export const ConfluenceVersion = S.String;
export type ConfluenceSpaceList = string[];
export const ConfluenceSpaceList = S.Array(S.String);
export type ConfluenceSpaceFieldName =
  | "DISPLAY_URL"
  | "ITEM_TYPE"
  | "SPACE_KEY"
  | "URL"
  | (string & {});
export const ConfluenceSpaceFieldName = S.String;
export interface ConfluenceSpaceToIndexFieldMapping {
  DataSourceFieldName?: ConfluenceSpaceFieldName;
  DateFieldFormat?: string;
  IndexFieldName?: string;
}
export const ConfluenceSpaceToIndexFieldMapping = S.suspend(() =>
  S.Struct({
    DataSourceFieldName: S.optional(ConfluenceSpaceFieldName),
    DateFieldFormat: S.optional(S.String),
    IndexFieldName: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfluenceSpaceToIndexFieldMapping",
}) as any as S.Schema<ConfluenceSpaceToIndexFieldMapping>;
export type ConfluenceSpaceFieldMappingsList =
  ConfluenceSpaceToIndexFieldMapping[];
export const ConfluenceSpaceFieldMappingsList = S.Array(
  ConfluenceSpaceToIndexFieldMapping,
);
export interface ConfluenceSpaceConfiguration {
  CrawlPersonalSpaces?: boolean;
  CrawlArchivedSpaces?: boolean;
  IncludeSpaces?: string[];
  ExcludeSpaces?: string[];
  SpaceFieldMappings?: ConfluenceSpaceToIndexFieldMapping[];
}
export const ConfluenceSpaceConfiguration = S.suspend(() =>
  S.Struct({
    CrawlPersonalSpaces: S.optional(S.Boolean),
    CrawlArchivedSpaces: S.optional(S.Boolean),
    IncludeSpaces: S.optional(ConfluenceSpaceList),
    ExcludeSpaces: S.optional(ConfluenceSpaceList),
    SpaceFieldMappings: S.optional(ConfluenceSpaceFieldMappingsList),
  }),
).annotations({
  identifier: "ConfluenceSpaceConfiguration",
}) as any as S.Schema<ConfluenceSpaceConfiguration>;
export type ConfluencePageFieldName =
  | "AUTHOR"
  | "CONTENT_STATUS"
  | "CREATED_DATE"
  | "DISPLAY_URL"
  | "ITEM_TYPE"
  | "LABELS"
  | "MODIFIED_DATE"
  | "PARENT_ID"
  | "SPACE_KEY"
  | "SPACE_NAME"
  | "URL"
  | "VERSION"
  | (string & {});
export const ConfluencePageFieldName = S.String;
export interface ConfluencePageToIndexFieldMapping {
  DataSourceFieldName?: ConfluencePageFieldName;
  DateFieldFormat?: string;
  IndexFieldName?: string;
}
export const ConfluencePageToIndexFieldMapping = S.suspend(() =>
  S.Struct({
    DataSourceFieldName: S.optional(ConfluencePageFieldName),
    DateFieldFormat: S.optional(S.String),
    IndexFieldName: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfluencePageToIndexFieldMapping",
}) as any as S.Schema<ConfluencePageToIndexFieldMapping>;
export type ConfluencePageFieldMappingsList =
  ConfluencePageToIndexFieldMapping[];
export const ConfluencePageFieldMappingsList = S.Array(
  ConfluencePageToIndexFieldMapping,
);
export interface ConfluencePageConfiguration {
  PageFieldMappings?: ConfluencePageToIndexFieldMapping[];
}
export const ConfluencePageConfiguration = S.suspend(() =>
  S.Struct({ PageFieldMappings: S.optional(ConfluencePageFieldMappingsList) }),
).annotations({
  identifier: "ConfluencePageConfiguration",
}) as any as S.Schema<ConfluencePageConfiguration>;
export type ConfluenceBlogFieldName =
  | "AUTHOR"
  | "DISPLAY_URL"
  | "ITEM_TYPE"
  | "LABELS"
  | "PUBLISH_DATE"
  | "SPACE_KEY"
  | "SPACE_NAME"
  | "URL"
  | "VERSION"
  | (string & {});
export const ConfluenceBlogFieldName = S.String;
export interface ConfluenceBlogToIndexFieldMapping {
  DataSourceFieldName?: ConfluenceBlogFieldName;
  DateFieldFormat?: string;
  IndexFieldName?: string;
}
export const ConfluenceBlogToIndexFieldMapping = S.suspend(() =>
  S.Struct({
    DataSourceFieldName: S.optional(ConfluenceBlogFieldName),
    DateFieldFormat: S.optional(S.String),
    IndexFieldName: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfluenceBlogToIndexFieldMapping",
}) as any as S.Schema<ConfluenceBlogToIndexFieldMapping>;
export type ConfluenceBlogFieldMappingsList =
  ConfluenceBlogToIndexFieldMapping[];
export const ConfluenceBlogFieldMappingsList = S.Array(
  ConfluenceBlogToIndexFieldMapping,
);
export interface ConfluenceBlogConfiguration {
  BlogFieldMappings?: ConfluenceBlogToIndexFieldMapping[];
}
export const ConfluenceBlogConfiguration = S.suspend(() =>
  S.Struct({ BlogFieldMappings: S.optional(ConfluenceBlogFieldMappingsList) }),
).annotations({
  identifier: "ConfluenceBlogConfiguration",
}) as any as S.Schema<ConfluenceBlogConfiguration>;
export type ConfluenceAttachmentFieldName =
  | "AUTHOR"
  | "CONTENT_TYPE"
  | "CREATED_DATE"
  | "DISPLAY_URL"
  | "FILE_SIZE"
  | "ITEM_TYPE"
  | "PARENT_ID"
  | "SPACE_KEY"
  | "SPACE_NAME"
  | "URL"
  | "VERSION"
  | (string & {});
export const ConfluenceAttachmentFieldName = S.String;
export interface ConfluenceAttachmentToIndexFieldMapping {
  DataSourceFieldName?: ConfluenceAttachmentFieldName;
  DateFieldFormat?: string;
  IndexFieldName?: string;
}
export const ConfluenceAttachmentToIndexFieldMapping = S.suspend(() =>
  S.Struct({
    DataSourceFieldName: S.optional(ConfluenceAttachmentFieldName),
    DateFieldFormat: S.optional(S.String),
    IndexFieldName: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfluenceAttachmentToIndexFieldMapping",
}) as any as S.Schema<ConfluenceAttachmentToIndexFieldMapping>;
export type ConfluenceAttachmentFieldMappingsList =
  ConfluenceAttachmentToIndexFieldMapping[];
export const ConfluenceAttachmentFieldMappingsList = S.Array(
  ConfluenceAttachmentToIndexFieldMapping,
);
export interface ConfluenceAttachmentConfiguration {
  CrawlAttachments?: boolean;
  AttachmentFieldMappings?: ConfluenceAttachmentToIndexFieldMapping[];
}
export const ConfluenceAttachmentConfiguration = S.suspend(() =>
  S.Struct({
    CrawlAttachments: S.optional(S.Boolean),
    AttachmentFieldMappings: S.optional(ConfluenceAttachmentFieldMappingsList),
  }),
).annotations({
  identifier: "ConfluenceAttachmentConfiguration",
}) as any as S.Schema<ConfluenceAttachmentConfiguration>;
export type ConfluenceAuthenticationType = "HTTP_BASIC" | "PAT" | (string & {});
export const ConfluenceAuthenticationType = S.String;
export interface ConfluenceConfiguration {
  ServerUrl: string;
  SecretArn: string;
  Version: ConfluenceVersion;
  SpaceConfiguration?: ConfluenceSpaceConfiguration;
  PageConfiguration?: ConfluencePageConfiguration;
  BlogConfiguration?: ConfluenceBlogConfiguration;
  AttachmentConfiguration?: ConfluenceAttachmentConfiguration;
  VpcConfiguration?: DataSourceVpcConfiguration;
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  ProxyConfiguration?: ProxyConfiguration;
  AuthenticationType?: ConfluenceAuthenticationType;
}
export const ConfluenceConfiguration = S.suspend(() =>
  S.Struct({
    ServerUrl: S.String,
    SecretArn: S.String,
    Version: ConfluenceVersion,
    SpaceConfiguration: S.optional(ConfluenceSpaceConfiguration),
    PageConfiguration: S.optional(ConfluencePageConfiguration),
    BlogConfiguration: S.optional(ConfluenceBlogConfiguration),
    AttachmentConfiguration: S.optional(ConfluenceAttachmentConfiguration),
    VpcConfiguration: S.optional(DataSourceVpcConfiguration),
    InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    ProxyConfiguration: S.optional(ProxyConfiguration),
    AuthenticationType: S.optional(ConfluenceAuthenticationType),
  }),
).annotations({
  identifier: "ConfluenceConfiguration",
}) as any as S.Schema<ConfluenceConfiguration>;
export type ExcludeMimeTypesList = string[];
export const ExcludeMimeTypesList = S.Array(S.String);
export type ExcludeUserAccountsList = string[];
export const ExcludeUserAccountsList = S.Array(S.String);
export type ExcludeSharedDrivesList = string[];
export const ExcludeSharedDrivesList = S.Array(S.String);
export interface GoogleDriveConfiguration {
  SecretArn: string;
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  FieldMappings?: DataSourceToIndexFieldMapping[];
  ExcludeMimeTypes?: string[];
  ExcludeUserAccounts?: string[];
  ExcludeSharedDrives?: string[];
}
export const GoogleDriveConfiguration = S.suspend(() =>
  S.Struct({
    SecretArn: S.String,
    InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
    ExcludeMimeTypes: S.optional(ExcludeMimeTypesList),
    ExcludeUserAccounts: S.optional(ExcludeUserAccountsList),
    ExcludeSharedDrives: S.optional(ExcludeSharedDrivesList),
  }),
).annotations({
  identifier: "GoogleDriveConfiguration",
}) as any as S.Schema<GoogleDriveConfiguration>;
export type SeedUrlList = string[];
export const SeedUrlList = S.Array(S.String);
export type WebCrawlerMode =
  | "HOST_ONLY"
  | "SUBDOMAINS"
  | "EVERYTHING"
  | (string & {});
export const WebCrawlerMode = S.String;
export interface SeedUrlConfiguration {
  SeedUrls: string[];
  WebCrawlerMode?: WebCrawlerMode;
}
export const SeedUrlConfiguration = S.suspend(() =>
  S.Struct({
    SeedUrls: SeedUrlList,
    WebCrawlerMode: S.optional(WebCrawlerMode),
  }),
).annotations({
  identifier: "SeedUrlConfiguration",
}) as any as S.Schema<SeedUrlConfiguration>;
export type SiteMapsList = string[];
export const SiteMapsList = S.Array(S.String);
export interface SiteMapsConfiguration {
  SiteMaps: string[];
}
export const SiteMapsConfiguration = S.suspend(() =>
  S.Struct({ SiteMaps: SiteMapsList }),
).annotations({
  identifier: "SiteMapsConfiguration",
}) as any as S.Schema<SiteMapsConfiguration>;
export interface Urls {
  SeedUrlConfiguration?: SeedUrlConfiguration;
  SiteMapsConfiguration?: SiteMapsConfiguration;
}
export const Urls = S.suspend(() =>
  S.Struct({
    SeedUrlConfiguration: S.optional(SeedUrlConfiguration),
    SiteMapsConfiguration: S.optional(SiteMapsConfiguration),
  }),
).annotations({ identifier: "Urls" }) as any as S.Schema<Urls>;
export interface BasicAuthenticationConfiguration {
  Host: string;
  Port: number;
  Credentials: string;
}
export const BasicAuthenticationConfiguration = S.suspend(() =>
  S.Struct({ Host: S.String, Port: S.Number, Credentials: S.String }),
).annotations({
  identifier: "BasicAuthenticationConfiguration",
}) as any as S.Schema<BasicAuthenticationConfiguration>;
export type BasicAuthenticationConfigurationList =
  BasicAuthenticationConfiguration[];
export const BasicAuthenticationConfigurationList = S.Array(
  BasicAuthenticationConfiguration,
);
export interface AuthenticationConfiguration {
  BasicAuthentication?: BasicAuthenticationConfiguration[];
}
export const AuthenticationConfiguration = S.suspend(() =>
  S.Struct({
    BasicAuthentication: S.optional(BasicAuthenticationConfigurationList),
  }),
).annotations({
  identifier: "AuthenticationConfiguration",
}) as any as S.Schema<AuthenticationConfiguration>;
export interface WebCrawlerConfiguration {
  Urls: Urls;
  CrawlDepth?: number;
  MaxLinksPerPage?: number;
  MaxContentSizePerPageInMegaBytes?: number;
  MaxUrlsPerMinuteCrawlRate?: number;
  UrlInclusionPatterns?: string[];
  UrlExclusionPatterns?: string[];
  ProxyConfiguration?: ProxyConfiguration;
  AuthenticationConfiguration?: AuthenticationConfiguration;
}
export const WebCrawlerConfiguration = S.suspend(() =>
  S.Struct({
    Urls: Urls,
    CrawlDepth: S.optional(S.Number),
    MaxLinksPerPage: S.optional(S.Number),
    MaxContentSizePerPageInMegaBytes: S.optional(S.Number),
    MaxUrlsPerMinuteCrawlRate: S.optional(S.Number),
    UrlInclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    UrlExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    ProxyConfiguration: S.optional(ProxyConfiguration),
    AuthenticationConfiguration: S.optional(AuthenticationConfiguration),
  }),
).annotations({
  identifier: "WebCrawlerConfiguration",
}) as any as S.Schema<WebCrawlerConfiguration>;
export interface WorkDocsConfiguration {
  OrganizationId: string;
  CrawlComments?: boolean;
  UseChangeLog?: boolean;
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  FieldMappings?: DataSourceToIndexFieldMapping[];
}
export const WorkDocsConfiguration = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    CrawlComments: S.optional(S.Boolean),
    UseChangeLog: S.optional(S.Boolean),
    InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  }),
).annotations({
  identifier: "WorkDocsConfiguration",
}) as any as S.Schema<WorkDocsConfiguration>;
export type FsxFileSystemType = "WINDOWS" | (string & {});
export const FsxFileSystemType = S.String;
export interface FsxConfiguration {
  FileSystemId: string;
  FileSystemType: FsxFileSystemType;
  VpcConfiguration: DataSourceVpcConfiguration;
  SecretArn?: string;
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  FieldMappings?: DataSourceToIndexFieldMapping[];
}
export const FsxConfiguration = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String,
    FileSystemType: FsxFileSystemType,
    VpcConfiguration: DataSourceVpcConfiguration,
    SecretArn: S.optional(S.String),
    InclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    ExclusionPatterns: S.optional(DataSourceInclusionsExclusionsStrings),
    FieldMappings: S.optional(DataSourceToIndexFieldMappingList),
  }),
).annotations({
  identifier: "FsxConfiguration",
}) as any as S.Schema<FsxConfiguration>;
export type SlackEntity =
  | "PUBLIC_CHANNEL"
  | "PRIVATE_CHANNEL"
  | "GROUP_MESSAGE"
  | "DIRECT_MESSAGE"
  | (string & {});
export const SlackEntity = S.String;
export type SlackEntityList = SlackEntity[];
export const SlackEntityList = S.Array(SlackEntity);
export type PrivateChannelFilter = string[];
export const PrivateChannelFilter = S.Array(S.String);
export type PublicChannelFilter = string[];
export const PublicChannelFilter = S.Array(S.String);
export interface SlackConfiguration {
  TeamId: string;
  SecretArn: string;
  VpcConfiguration?: DataSourceVpcConfiguration;
  SlackEntityList: SlackEntity[];
  UseChangeLog?: boolean;
  CrawlBotMessage?: boolean;
  ExcludeArchived?: boolean;
  SinceCrawlDate: string;
  LookBackPeriod?: number;
  PrivateChannelFilter?: string[];
  PublicChannelFilter?: string[];
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  FieldMappings?: DataSourceToIndexFieldMapping[];
}
export const SlackConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "SlackConfiguration",
}) as any as S.Schema<SlackConfiguration>;
export interface BoxConfiguration {
  EnterpriseId: string;
  SecretArn: string;
  UseChangeLog?: boolean;
  CrawlComments?: boolean;
  CrawlTasks?: boolean;
  CrawlWebLinks?: boolean;
  FileFieldMappings?: DataSourceToIndexFieldMapping[];
  TaskFieldMappings?: DataSourceToIndexFieldMapping[];
  CommentFieldMappings?: DataSourceToIndexFieldMapping[];
  WebLinkFieldMappings?: DataSourceToIndexFieldMapping[];
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  VpcConfiguration?: DataSourceVpcConfiguration;
}
export const BoxConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BoxConfiguration",
}) as any as S.Schema<BoxConfiguration>;
export type FolderIdList = string[];
export const FolderIdList = S.Array(S.String);
export interface QuipConfiguration {
  Domain: string;
  SecretArn: string;
  CrawlFileComments?: boolean;
  CrawlChatRooms?: boolean;
  CrawlAttachments?: boolean;
  FolderIds?: string[];
  ThreadFieldMappings?: DataSourceToIndexFieldMapping[];
  MessageFieldMappings?: DataSourceToIndexFieldMapping[];
  AttachmentFieldMappings?: DataSourceToIndexFieldMapping[];
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  VpcConfiguration?: DataSourceVpcConfiguration;
}
export const QuipConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "QuipConfiguration",
}) as any as S.Schema<QuipConfiguration>;
export type Project = string[];
export const Project = S.Array(S.String);
export type IssueType = string[];
export const IssueType = S.Array(S.String);
export type JiraStatus = string[];
export const JiraStatus = S.Array(S.String);
export type IssueSubEntity =
  | "COMMENTS"
  | "ATTACHMENTS"
  | "WORKLOGS"
  | (string & {});
export const IssueSubEntity = S.String;
export type IssueSubEntityFilter = IssueSubEntity[];
export const IssueSubEntityFilter = S.Array(IssueSubEntity);
export interface JiraConfiguration {
  JiraAccountUrl: string;
  SecretArn: string;
  UseChangeLog?: boolean;
  Project?: string[];
  IssueType?: string[];
  Status?: string[];
  IssueSubEntityFilter?: IssueSubEntity[];
  AttachmentFieldMappings?: DataSourceToIndexFieldMapping[];
  CommentFieldMappings?: DataSourceToIndexFieldMapping[];
  IssueFieldMappings?: DataSourceToIndexFieldMapping[];
  ProjectFieldMappings?: DataSourceToIndexFieldMapping[];
  WorkLogFieldMappings?: DataSourceToIndexFieldMapping[];
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  VpcConfiguration?: DataSourceVpcConfiguration;
}
export const JiraConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "JiraConfiguration",
}) as any as S.Schema<JiraConfiguration>;
export interface SaaSConfiguration {
  OrganizationName: string;
  HostUrl: string;
}
export const SaaSConfiguration = S.suspend(() =>
  S.Struct({ OrganizationName: S.String, HostUrl: S.String }),
).annotations({
  identifier: "SaaSConfiguration",
}) as any as S.Schema<SaaSConfiguration>;
export interface OnPremiseConfiguration {
  HostUrl: string;
  OrganizationName: string;
  SslCertificateS3Path: S3Path;
}
export const OnPremiseConfiguration = S.suspend(() =>
  S.Struct({
    HostUrl: S.String,
    OrganizationName: S.String,
    SslCertificateS3Path: S3Path,
  }),
).annotations({
  identifier: "OnPremiseConfiguration",
}) as any as S.Schema<OnPremiseConfiguration>;
export type Type = "SAAS" | "ON_PREMISE" | (string & {});
export const Type = S.String;
export interface GitHubDocumentCrawlProperties {
  CrawlRepositoryDocuments?: boolean;
  CrawlIssue?: boolean;
  CrawlIssueComment?: boolean;
  CrawlIssueCommentAttachment?: boolean;
  CrawlPullRequest?: boolean;
  CrawlPullRequestComment?: boolean;
  CrawlPullRequestCommentAttachment?: boolean;
}
export const GitHubDocumentCrawlProperties = S.suspend(() =>
  S.Struct({
    CrawlRepositoryDocuments: S.optional(S.Boolean),
    CrawlIssue: S.optional(S.Boolean),
    CrawlIssueComment: S.optional(S.Boolean),
    CrawlIssueCommentAttachment: S.optional(S.Boolean),
    CrawlPullRequest: S.optional(S.Boolean),
    CrawlPullRequestComment: S.optional(S.Boolean),
    CrawlPullRequestCommentAttachment: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GitHubDocumentCrawlProperties",
}) as any as S.Schema<GitHubDocumentCrawlProperties>;
export type RepositoryNames = string[];
export const RepositoryNames = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface GitHubConfiguration {
  SaaSConfiguration?: SaaSConfiguration;
  OnPremiseConfiguration?: OnPremiseConfiguration;
  Type?: Type;
  SecretArn: string;
  UseChangeLog?: boolean;
  GitHubDocumentCrawlProperties?: GitHubDocumentCrawlProperties;
  RepositoryFilter?: string[];
  InclusionFolderNamePatterns?: string[];
  InclusionFileTypePatterns?: string[];
  InclusionFileNamePatterns?: string[];
  ExclusionFolderNamePatterns?: string[];
  ExclusionFileTypePatterns?: string[];
  ExclusionFileNamePatterns?: string[];
  VpcConfiguration?: DataSourceVpcConfiguration;
  GitHubRepositoryConfigurationFieldMappings?: DataSourceToIndexFieldMapping[];
  GitHubCommitConfigurationFieldMappings?: DataSourceToIndexFieldMapping[];
  GitHubIssueDocumentConfigurationFieldMappings?: DataSourceToIndexFieldMapping[];
  GitHubIssueCommentConfigurationFieldMappings?: DataSourceToIndexFieldMapping[];
  GitHubIssueAttachmentConfigurationFieldMappings?: DataSourceToIndexFieldMapping[];
  GitHubPullRequestCommentConfigurationFieldMappings?: DataSourceToIndexFieldMapping[];
  GitHubPullRequestDocumentConfigurationFieldMappings?: DataSourceToIndexFieldMapping[];
  GitHubPullRequestDocumentAttachmentConfigurationFieldMappings?: DataSourceToIndexFieldMapping[];
}
export const GitHubConfiguration = S.suspend(() =>
  S.Struct({
    SaaSConfiguration: S.optional(SaaSConfiguration),
    OnPremiseConfiguration: S.optional(OnPremiseConfiguration),
    Type: S.optional(Type),
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
  }),
).annotations({
  identifier: "GitHubConfiguration",
}) as any as S.Schema<GitHubConfiguration>;
export type AlfrescoEntity =
  | "wiki"
  | "blog"
  | "documentLibrary"
  | (string & {});
export const AlfrescoEntity = S.String;
export type EntityFilter = AlfrescoEntity[];
export const EntityFilter = S.Array(AlfrescoEntity);
export interface AlfrescoConfiguration {
  SiteUrl: string;
  SiteId: string;
  SecretArn: string;
  SslCertificateS3Path: S3Path;
  CrawlSystemFolders?: boolean;
  CrawlComments?: boolean;
  EntityFilter?: AlfrescoEntity[];
  DocumentLibraryFieldMappings?: DataSourceToIndexFieldMapping[];
  BlogFieldMappings?: DataSourceToIndexFieldMapping[];
  WikiFieldMappings?: DataSourceToIndexFieldMapping[];
  InclusionPatterns?: string[];
  ExclusionPatterns?: string[];
  VpcConfiguration?: DataSourceVpcConfiguration;
}
export const AlfrescoConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "AlfrescoConfiguration",
}) as any as S.Schema<AlfrescoConfiguration>;
export interface TemplateConfiguration {
  Template?: any;
}
export const TemplateConfiguration = S.suspend(() =>
  S.Struct({ Template: S.optional(S.Any) }),
).annotations({
  identifier: "TemplateConfiguration",
}) as any as S.Schema<TemplateConfiguration>;
export interface DataSourceConfiguration {
  S3Configuration?: S3DataSourceConfiguration;
  SharePointConfiguration?: SharePointConfiguration;
  DatabaseConfiguration?: DatabaseConfiguration;
  SalesforceConfiguration?: SalesforceConfiguration;
  OneDriveConfiguration?: OneDriveConfiguration;
  ServiceNowConfiguration?: ServiceNowConfiguration;
  ConfluenceConfiguration?: ConfluenceConfiguration;
  GoogleDriveConfiguration?: GoogleDriveConfiguration;
  WebCrawlerConfiguration?: WebCrawlerConfiguration;
  WorkDocsConfiguration?: WorkDocsConfiguration;
  FsxConfiguration?: FsxConfiguration;
  SlackConfiguration?: SlackConfiguration;
  BoxConfiguration?: BoxConfiguration;
  QuipConfiguration?: QuipConfiguration;
  JiraConfiguration?: JiraConfiguration;
  GitHubConfiguration?: GitHubConfiguration;
  AlfrescoConfiguration?: AlfrescoConfiguration;
  TemplateConfiguration?: TemplateConfiguration;
}
export const DataSourceConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DataSourceConfiguration",
}) as any as S.Schema<DataSourceConfiguration>;
export type ConditionOperator =
  | "GreaterThan"
  | "GreaterThanOrEquals"
  | "LessThan"
  | "LessThanOrEquals"
  | "Equals"
  | "NotEquals"
  | "Contains"
  | "NotContains"
  | "Exists"
  | "NotExists"
  | "BeginsWith"
  | (string & {});
export const ConditionOperator = S.String;
export interface DocumentAttributeCondition {
  ConditionDocumentAttributeKey: string;
  Operator: ConditionOperator;
  ConditionOnValue?: DocumentAttributeValue;
}
export const DocumentAttributeCondition = S.suspend(() =>
  S.Struct({
    ConditionDocumentAttributeKey: S.String,
    Operator: ConditionOperator,
    ConditionOnValue: S.optional(DocumentAttributeValue),
  }),
).annotations({
  identifier: "DocumentAttributeCondition",
}) as any as S.Schema<DocumentAttributeCondition>;
export interface DocumentAttributeTarget {
  TargetDocumentAttributeKey?: string;
  TargetDocumentAttributeValueDeletion?: boolean;
  TargetDocumentAttributeValue?: DocumentAttributeValue;
}
export const DocumentAttributeTarget = S.suspend(() =>
  S.Struct({
    TargetDocumentAttributeKey: S.optional(S.String),
    TargetDocumentAttributeValueDeletion: S.optional(S.Boolean),
    TargetDocumentAttributeValue: S.optional(DocumentAttributeValue),
  }),
).annotations({
  identifier: "DocumentAttributeTarget",
}) as any as S.Schema<DocumentAttributeTarget>;
export interface InlineCustomDocumentEnrichmentConfiguration {
  Condition?: DocumentAttributeCondition;
  Target?: DocumentAttributeTarget;
  DocumentContentDeletion?: boolean;
}
export const InlineCustomDocumentEnrichmentConfiguration = S.suspend(() =>
  S.Struct({
    Condition: S.optional(DocumentAttributeCondition),
    Target: S.optional(DocumentAttributeTarget),
    DocumentContentDeletion: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "InlineCustomDocumentEnrichmentConfiguration",
}) as any as S.Schema<InlineCustomDocumentEnrichmentConfiguration>;
export type InlineCustomDocumentEnrichmentConfigurationList =
  InlineCustomDocumentEnrichmentConfiguration[];
export const InlineCustomDocumentEnrichmentConfigurationList = S.Array(
  InlineCustomDocumentEnrichmentConfiguration,
);
export interface HookConfiguration {
  InvocationCondition?: DocumentAttributeCondition;
  LambdaArn: string;
  S3Bucket: string;
}
export const HookConfiguration = S.suspend(() =>
  S.Struct({
    InvocationCondition: S.optional(DocumentAttributeCondition),
    LambdaArn: S.String,
    S3Bucket: S.String,
  }),
).annotations({
  identifier: "HookConfiguration",
}) as any as S.Schema<HookConfiguration>;
export interface CustomDocumentEnrichmentConfiguration {
  InlineConfigurations?: InlineCustomDocumentEnrichmentConfiguration[];
  PreExtractionHookConfiguration?: HookConfiguration;
  PostExtractionHookConfiguration?: HookConfiguration;
  RoleArn?: string;
}
export const CustomDocumentEnrichmentConfiguration = S.suspend(() =>
  S.Struct({
    InlineConfigurations: S.optional(
      InlineCustomDocumentEnrichmentConfigurationList,
    ),
    PreExtractionHookConfiguration: S.optional(HookConfiguration),
    PostExtractionHookConfiguration: S.optional(HookConfiguration),
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomDocumentEnrichmentConfiguration",
}) as any as S.Schema<CustomDocumentEnrichmentConfiguration>;
export interface UpdateDataSourceRequest {
  Id: string;
  Name?: string;
  IndexId: string;
  Configuration?: DataSourceConfiguration;
  VpcConfiguration?: DataSourceVpcConfiguration;
  Description?: string;
  Schedule?: string;
  RoleArn?: string;
  LanguageCode?: string;
  CustomDocumentEnrichmentConfiguration?: CustomDocumentEnrichmentConfiguration;
}
export const UpdateDataSourceRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
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
export type DataSourceIdList = string[];
export const DataSourceIdList = S.Array(S.String);
export type FaqIdsList = string[];
export const FaqIdsList = S.Array(S.String);
export interface ContentSourceConfiguration {
  DataSourceIds?: string[];
  FaqIds?: string[];
  DirectPutContent?: boolean;
}
export const ContentSourceConfiguration = S.suspend(() =>
  S.Struct({
    DataSourceIds: S.optional(DataSourceIdList),
    FaqIds: S.optional(FaqIdsList),
    DirectPutContent: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ContentSourceConfiguration",
}) as any as S.Schema<ContentSourceConfiguration>;
export interface UserIdentityConfiguration {
  IdentityAttributeName?: string;
}
export const UserIdentityConfiguration = S.suspend(() =>
  S.Struct({ IdentityAttributeName: S.optional(S.String) }),
).annotations({
  identifier: "UserIdentityConfiguration",
}) as any as S.Schema<UserIdentityConfiguration>;
export interface ExperienceConfiguration {
  ContentSourceConfiguration?: ContentSourceConfiguration;
  UserIdentityConfiguration?: UserIdentityConfiguration;
}
export const ExperienceConfiguration = S.suspend(() =>
  S.Struct({
    ContentSourceConfiguration: S.optional(ContentSourceConfiguration),
    UserIdentityConfiguration: S.optional(UserIdentityConfiguration),
  }),
).annotations({
  identifier: "ExperienceConfiguration",
}) as any as S.Schema<ExperienceConfiguration>;
export interface UpdateExperienceRequest {
  Id: string;
  Name?: string;
  IndexId: string;
  RoleArn?: string;
  Configuration?: ExperienceConfiguration;
  Description?: string;
}
export const UpdateExperienceRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.optional(S.String),
    IndexId: S.String,
    RoleArn: S.optional(S.String),
    Configuration: S.optional(ExperienceConfiguration),
    Description: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateExperienceRequest",
}) as any as S.Schema<UpdateExperienceRequest>;
export interface UpdateExperienceResponse {}
export const UpdateExperienceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateExperienceResponse",
}) as any as S.Schema<UpdateExperienceResponse>;
export interface FeaturedDocument {
  Id?: string;
}
export const FeaturedDocument = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "FeaturedDocument",
}) as any as S.Schema<FeaturedDocument>;
export type FeaturedDocumentList = FeaturedDocument[];
export const FeaturedDocumentList = S.Array(FeaturedDocument);
export interface UpdateFeaturedResultsSetRequest {
  IndexId: string;
  FeaturedResultsSetId: string;
  FeaturedResultsSetName?: string;
  Description?: string;
  Status?: FeaturedResultsSetStatus;
  QueryTexts?: string[];
  FeaturedDocuments?: FeaturedDocument[];
}
export const UpdateFeaturedResultsSetRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    FeaturedResultsSetId: S.String,
    FeaturedResultsSetName: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(FeaturedResultsSetStatus),
    QueryTexts: S.optional(QueryTextList),
    FeaturedDocuments: S.optional(FeaturedDocumentList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFeaturedResultsSetRequest",
}) as any as S.Schema<UpdateFeaturedResultsSetRequest>;
export interface UpdateQuerySuggestionsBlockListRequest {
  IndexId: string;
  Id: string;
  Name?: string;
  Description?: string;
  SourceS3Path?: S3Path;
  RoleArn?: string;
}
export const UpdateQuerySuggestionsBlockListRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    Id: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    SourceS3Path: S.optional(S3Path),
    RoleArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateQuerySuggestionsBlockListRequest",
}) as any as S.Schema<UpdateQuerySuggestionsBlockListRequest>;
export interface UpdateQuerySuggestionsBlockListResponse {}
export const UpdateQuerySuggestionsBlockListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateQuerySuggestionsBlockListResponse",
}) as any as S.Schema<UpdateQuerySuggestionsBlockListResponse>;
export interface UpdateThesaurusRequest {
  Id: string;
  Name?: string;
  IndexId: string;
  Description?: string;
  RoleArn?: string;
  SourceS3Path?: S3Path;
}
export const UpdateThesaurusRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.optional(S.String),
    IndexId: S.String,
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    SourceS3Path: S.optional(S3Path),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateThesaurusRequest",
}) as any as S.Schema<UpdateThesaurusRequest>;
export interface UpdateThesaurusResponse {}
export const UpdateThesaurusResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateThesaurusResponse",
}) as any as S.Schema<UpdateThesaurusResponse>;
export type Persona = "OWNER" | "VIEWER" | (string & {});
export const Persona = S.String;
export type ContentType =
  | "PDF"
  | "HTML"
  | "MS_WORD"
  | "PLAIN_TEXT"
  | "PPT"
  | "RTF"
  | "XML"
  | "XSLT"
  | "MS_EXCEL"
  | "CSV"
  | "JSON"
  | "MD"
  | (string & {});
export const ContentType = S.String;
export type UserGroupResolutionMode = "AWS_SSO" | "NONE" | (string & {});
export const UserGroupResolutionMode = S.String;
export type AttributeFilterList = AttributeFilter[];
export const AttributeFilterList = S.Array(
  S.suspend((): S.Schema<AttributeFilter, any> => AttributeFilter).annotations({
    identifier: "AttributeFilter",
  }),
) as any as S.Schema<AttributeFilterList>;
export type MissingAttributeKeyStrategy =
  | "IGNORE"
  | "COLLAPSE"
  | "EXPAND"
  | (string & {});
export const MissingAttributeKeyStrategy = S.String;
export type RelevanceType = "RELEVANT" | "NOT_RELEVANT" | (string & {});
export const RelevanceType = S.String;
export type DocumentAttributeValueType =
  | "STRING_VALUE"
  | "STRING_LIST_VALUE"
  | "LONG_VALUE"
  | "DATE_VALUE"
  | (string & {});
export const DocumentAttributeValueType = S.String;
export type AttributeSuggestionsMode = "ACTIVE" | "INACTIVE" | (string & {});
export const AttributeSuggestionsMode = S.String;
export type AssociateEntityList = EntityConfiguration[];
export const AssociateEntityList = S.Array(EntityConfiguration);
export interface EntityPersonaConfiguration {
  EntityId: string;
  Persona: Persona;
}
export const EntityPersonaConfiguration = S.suspend(() =>
  S.Struct({ EntityId: S.String, Persona: Persona }),
).annotations({
  identifier: "EntityPersonaConfiguration",
}) as any as S.Schema<EntityPersonaConfiguration>;
export type EntityPersonaConfigurationList = EntityPersonaConfiguration[];
export const EntityPersonaConfigurationList = S.Array(
  EntityPersonaConfiguration,
);
export interface DataSourceSyncJobMetricTarget {
  DataSourceId: string;
  DataSourceSyncJobId?: string;
}
export const DataSourceSyncJobMetricTarget = S.suspend(() =>
  S.Struct({
    DataSourceId: S.String,
    DataSourceSyncJobId: S.optional(S.String),
  }),
).annotations({
  identifier: "DataSourceSyncJobMetricTarget",
}) as any as S.Schema<DataSourceSyncJobMetricTarget>;
export type DocumentAttributeList = DocumentAttribute[];
export const DocumentAttributeList = S.Array(DocumentAttribute);
export interface Document {
  Id: string;
  Title?: string;
  Blob?: Uint8Array;
  S3Path?: S3Path;
  Attributes?: DocumentAttribute[];
  AccessControlList?: Principal[];
  HierarchicalAccessControlList?: HierarchicalPrincipal[];
  ContentType?: ContentType;
  AccessControlConfigurationId?: string;
}
export const Document = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Title: S.optional(S.String),
    Blob: S.optional(T.Blob),
    S3Path: S.optional(S3Path),
    Attributes: S.optional(DocumentAttributeList),
    AccessControlList: S.optional(PrincipalList),
    HierarchicalAccessControlList: S.optional(HierarchicalPrincipalList),
    ContentType: S.optional(ContentType),
    AccessControlConfigurationId: S.optional(S.String),
  }),
).annotations({ identifier: "Document" }) as any as S.Schema<Document>;
export type DocumentList = Document[];
export const DocumentList = S.Array(Document);
export interface ServerSideEncryptionConfiguration {
  KmsKeyId?: string | redacted.Redacted<string>;
}
export const ServerSideEncryptionConfiguration = S.suspend(() =>
  S.Struct({ KmsKeyId: S.optional(SensitiveString) }),
).annotations({
  identifier: "ServerSideEncryptionConfiguration",
}) as any as S.Schema<ServerSideEncryptionConfiguration>;
export interface UserGroupResolutionConfiguration {
  UserGroupResolutionMode: UserGroupResolutionMode;
}
export const UserGroupResolutionConfiguration = S.suspend(() =>
  S.Struct({ UserGroupResolutionMode: UserGroupResolutionMode }),
).annotations({
  identifier: "UserGroupResolutionConfiguration",
}) as any as S.Schema<UserGroupResolutionConfiguration>;
export type DataSourceStatus =
  | "CREATING"
  | "DELETING"
  | "FAILED"
  | "UPDATING"
  | "ACTIVE"
  | (string & {});
export const DataSourceStatus = S.String;
export type ExperienceStatus =
  | "CREATING"
  | "ACTIVE"
  | "DELETING"
  | "FAILED"
  | (string & {});
export const ExperienceStatus = S.String;
export type FaqStatus =
  | "CREATING"
  | "UPDATING"
  | "ACTIVE"
  | "DELETING"
  | "FAILED"
  | (string & {});
export const FaqStatus = S.String;
export type IndexStatus =
  | "CREATING"
  | "ACTIVE"
  | "DELETING"
  | "FAILED"
  | "UPDATING"
  | "SYSTEM_UPDATING"
  | (string & {});
export const IndexStatus = S.String;
export type QuerySuggestionsBlockListStatus =
  | "ACTIVE"
  | "CREATING"
  | "DELETING"
  | "UPDATING"
  | "ACTIVE_BUT_UPDATE_FAILED"
  | "FAILED"
  | (string & {});
export const QuerySuggestionsBlockListStatus = S.String;
export type QuerySuggestionsStatus = "ACTIVE" | "UPDATING" | (string & {});
export const QuerySuggestionsStatus = S.String;
export type ThesaurusStatus =
  | "CREATING"
  | "ACTIVE"
  | "DELETING"
  | "UPDATING"
  | "ACTIVE_BUT_UPDATE_FAILED"
  | "FAILED"
  | (string & {});
export const ThesaurusStatus = S.String;
export interface AttributeSuggestionsGetConfig {
  SuggestionAttributes?: string[];
  AdditionalResponseAttributes?: string[];
  AttributeFilter?: AttributeFilter;
  UserContext?: UserContext;
}
export const AttributeSuggestionsGetConfig = S.suspend(() =>
  S.Struct({
    SuggestionAttributes: S.optional(DocumentAttributeKeyList),
    AdditionalResponseAttributes: S.optional(DocumentAttributeKeyList),
    AttributeFilter: S.optional(AttributeFilter),
    UserContext: S.optional(UserContext),
  }),
).annotations({
  identifier: "AttributeSuggestionsGetConfig",
}) as any as S.Schema<AttributeSuggestionsGetConfig>;
export type SnapshotsDataHeaderFields = string[];
export const SnapshotsDataHeaderFields = S.Array(S.String);
export type SnapshotsDataRecord = string[];
export const SnapshotsDataRecord = S.Array(S.String);
export type SnapshotsDataRecords = string[][];
export const SnapshotsDataRecords = S.Array(SnapshotsDataRecord);
export interface TimeRange {
  StartTime?: Date;
  EndTime?: Date;
}
export const TimeRange = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TimeRange" }) as any as S.Schema<TimeRange>;
export interface Facet {
  DocumentAttributeKey?: string;
  Facets?: Facet[];
  MaxResults?: number;
}
export const Facet = S.suspend(() =>
  S.Struct({
    DocumentAttributeKey: S.optional(S.String),
    Facets: S.optional(
      S.suspend(() => FacetList).annotations({ identifier: "FacetList" }),
    ),
    MaxResults: S.optional(S.Number),
  }),
).annotations({ identifier: "Facet" }) as any as S.Schema<Facet>;
export type FacetList = Facet[];
export const FacetList = S.Array(
  S.suspend((): S.Schema<Facet, any> => Facet).annotations({
    identifier: "Facet",
  }),
) as any as S.Schema<FacetList>;
export interface SpellCorrectionConfiguration {
  IncludeQuerySpellCheckSuggestions: boolean;
}
export const SpellCorrectionConfiguration = S.suspend(() =>
  S.Struct({ IncludeQuerySpellCheckSuggestions: S.Boolean }),
).annotations({
  identifier: "SpellCorrectionConfiguration",
}) as any as S.Schema<SpellCorrectionConfiguration>;
export interface ClickFeedback {
  ResultId: string;
  ClickTime: Date;
}
export const ClickFeedback = S.suspend(() =>
  S.Struct({
    ResultId: S.String,
    ClickTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ClickFeedback",
}) as any as S.Schema<ClickFeedback>;
export type ClickFeedbackList = ClickFeedback[];
export const ClickFeedbackList = S.Array(ClickFeedback);
export interface RelevanceFeedback {
  ResultId: string;
  RelevanceValue: RelevanceType;
}
export const RelevanceFeedback = S.suspend(() =>
  S.Struct({ ResultId: S.String, RelevanceValue: RelevanceType }),
).annotations({
  identifier: "RelevanceFeedback",
}) as any as S.Schema<RelevanceFeedback>;
export type RelevanceFeedbackList = RelevanceFeedback[];
export const RelevanceFeedbackList = S.Array(RelevanceFeedback);
export interface CapacityUnitsConfiguration {
  StorageCapacityUnits: number;
  QueryCapacityUnits: number;
}
export const CapacityUnitsConfiguration = S.suspend(() =>
  S.Struct({ StorageCapacityUnits: S.Number, QueryCapacityUnits: S.Number }),
).annotations({
  identifier: "CapacityUnitsConfiguration",
}) as any as S.Schema<CapacityUnitsConfiguration>;
export type KeyLocation = "URL" | "SECRET_MANAGER" | (string & {});
export const KeyLocation = S.String;
export interface AssociateEntitiesToExperienceRequest {
  Id: string;
  IndexId: string;
  EntityList: EntityConfiguration[];
}
export const AssociateEntitiesToExperienceRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    IndexId: S.String,
    EntityList: AssociateEntityList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateEntitiesToExperienceRequest",
}) as any as S.Schema<AssociateEntitiesToExperienceRequest>;
export interface AssociatePersonasToEntitiesRequest {
  Id: string;
  IndexId: string;
  Personas: EntityPersonaConfiguration[];
}
export const AssociatePersonasToEntitiesRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    IndexId: S.String,
    Personas: EntityPersonaConfigurationList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociatePersonasToEntitiesRequest",
}) as any as S.Schema<AssociatePersonasToEntitiesRequest>;
export interface BatchDeleteDocumentRequest {
  IndexId: string;
  DocumentIdList: string[];
  DataSourceSyncJobMetricTarget?: DataSourceSyncJobMetricTarget;
}
export const BatchDeleteDocumentRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    DocumentIdList: DocumentIdList,
    DataSourceSyncJobMetricTarget: S.optional(DataSourceSyncJobMetricTarget),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDeleteDocumentRequest",
}) as any as S.Schema<BatchDeleteDocumentRequest>;
export interface CreateAccessControlConfigurationRequest {
  IndexId: string;
  Name: string;
  Description?: string;
  AccessControlList?: Principal[];
  HierarchicalAccessControlList?: HierarchicalPrincipal[];
  ClientToken?: string;
}
export const CreateAccessControlConfigurationRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    AccessControlList: S.optional(PrincipalList),
    HierarchicalAccessControlList: S.optional(HierarchicalPrincipalList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAccessControlConfigurationRequest",
}) as any as S.Schema<CreateAccessControlConfigurationRequest>;
export interface CreateFaqRequest {
  IndexId: string;
  Name: string;
  Description?: string;
  S3Path: S3Path;
  RoleArn: string;
  Tags?: Tag[];
  FileFormat?: FaqFileFormat;
  ClientToken?: string;
  LanguageCode?: string;
}
export const CreateFaqRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    S3Path: S3Path,
    RoleArn: S.String,
    Tags: S.optional(TagList),
    FileFormat: S.optional(FaqFileFormat),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    LanguageCode: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFaqRequest",
}) as any as S.Schema<CreateFaqRequest>;
export interface CreateFeaturedResultsSetRequest {
  IndexId: string;
  FeaturedResultsSetName: string;
  Description?: string;
  ClientToken?: string;
  Status?: FeaturedResultsSetStatus;
  QueryTexts?: string[];
  FeaturedDocuments?: FeaturedDocument[];
  Tags?: Tag[];
}
export const CreateFeaturedResultsSetRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    FeaturedResultsSetName: S.String,
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Status: S.optional(FeaturedResultsSetStatus),
    QueryTexts: S.optional(QueryTextList),
    FeaturedDocuments: S.optional(FeaturedDocumentList),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFeaturedResultsSetRequest",
}) as any as S.Schema<CreateFeaturedResultsSetRequest>;
export interface CreateQuerySuggestionsBlockListResponse {
  Id?: string;
}
export const CreateQuerySuggestionsBlockListResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateQuerySuggestionsBlockListResponse",
}) as any as S.Schema<CreateQuerySuggestionsBlockListResponse>;
export interface CreateThesaurusResponse {
  Id?: string;
}
export const CreateThesaurusResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateThesaurusResponse",
}) as any as S.Schema<CreateThesaurusResponse>;
export interface DescribeAccessControlConfigurationResponse {
  Name: string;
  Description?: string;
  ErrorMessage?: string;
  AccessControlList?: Principal[];
  HierarchicalAccessControlList?: HierarchicalPrincipal[];
}
export const DescribeAccessControlConfigurationResponse = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    AccessControlList: S.optional(PrincipalList),
    HierarchicalAccessControlList: S.optional(HierarchicalPrincipalList),
  }),
).annotations({
  identifier: "DescribeAccessControlConfigurationResponse",
}) as any as S.Schema<DescribeAccessControlConfigurationResponse>;
export interface DescribeDataSourceResponse {
  Id?: string;
  IndexId?: string;
  Name?: string;
  Type?: DataSourceType;
  Configuration?: DataSourceConfiguration;
  VpcConfiguration?: DataSourceVpcConfiguration;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Description?: string;
  Status?: DataSourceStatus;
  Schedule?: string;
  RoleArn?: string;
  ErrorMessage?: string;
  LanguageCode?: string;
  CustomDocumentEnrichmentConfiguration?: CustomDocumentEnrichmentConfiguration;
}
export const DescribeDataSourceResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    IndexId: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(DataSourceType),
    Configuration: S.optional(DataSourceConfiguration),
    VpcConfiguration: S.optional(DataSourceVpcConfiguration),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    Status: S.optional(DataSourceStatus),
    Schedule: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    CustomDocumentEnrichmentConfiguration: S.optional(
      CustomDocumentEnrichmentConfiguration,
    ),
  }),
).annotations({
  identifier: "DescribeDataSourceResponse",
}) as any as S.Schema<DescribeDataSourceResponse>;
export interface DescribeFaqResponse {
  Id?: string;
  IndexId?: string;
  Name?: string;
  Description?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  S3Path?: S3Path;
  Status?: FaqStatus;
  RoleArn?: string;
  ErrorMessage?: string;
  FileFormat?: FaqFileFormat;
  LanguageCode?: string;
}
export const DescribeFaqResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    IndexId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    S3Path: S.optional(S3Path),
    Status: S.optional(FaqStatus),
    RoleArn: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    FileFormat: S.optional(FaqFileFormat),
    LanguageCode: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeFaqResponse",
}) as any as S.Schema<DescribeFaqResponse>;
export interface DescribeQuerySuggestionsBlockListResponse {
  IndexId?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  Status?: QuerySuggestionsBlockListStatus;
  ErrorMessage?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  SourceS3Path?: S3Path;
  ItemCount?: number;
  FileSizeBytes?: number;
  RoleArn?: string;
}
export const DescribeQuerySuggestionsBlockListResponse = S.suspend(() =>
  S.Struct({
    IndexId: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(QuerySuggestionsBlockListStatus),
    ErrorMessage: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SourceS3Path: S.optional(S3Path),
    ItemCount: S.optional(S.Number),
    FileSizeBytes: S.optional(S.Number),
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeQuerySuggestionsBlockListResponse",
}) as any as S.Schema<DescribeQuerySuggestionsBlockListResponse>;
export interface DescribeThesaurusResponse {
  Id?: string;
  IndexId?: string;
  Name?: string;
  Description?: string;
  Status?: ThesaurusStatus;
  ErrorMessage?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  RoleArn?: string;
  SourceS3Path?: S3Path;
  FileSizeBytes?: number;
  TermCount?: number;
  SynonymRuleCount?: number;
}
export const DescribeThesaurusResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    IndexId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(ThesaurusStatus),
    ErrorMessage: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RoleArn: S.optional(S.String),
    SourceS3Path: S.optional(S3Path),
    FileSizeBytes: S.optional(S.Number),
    TermCount: S.optional(S.Number),
    SynonymRuleCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribeThesaurusResponse",
}) as any as S.Schema<DescribeThesaurusResponse>;
export interface FailedEntity {
  EntityId?: string;
  ErrorMessage?: string;
}
export const FailedEntity = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "FailedEntity" }) as any as S.Schema<FailedEntity>;
export type FailedEntityList = FailedEntity[];
export const FailedEntityList = S.Array(FailedEntity);
export interface DisassociatePersonasFromEntitiesResponse {
  FailedEntityList?: FailedEntity[];
}
export const DisassociatePersonasFromEntitiesResponse = S.suspend(() =>
  S.Struct({ FailedEntityList: S.optional(FailedEntityList) }),
).annotations({
  identifier: "DisassociatePersonasFromEntitiesResponse",
}) as any as S.Schema<DisassociatePersonasFromEntitiesResponse>;
export interface GetQuerySuggestionsRequest {
  IndexId: string;
  QueryText: string;
  MaxSuggestionsCount?: number;
  SuggestionTypes?: SuggestionType[];
  AttributeSuggestionsConfig?: AttributeSuggestionsGetConfig;
}
export const GetQuerySuggestionsRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    QueryText: S.String,
    MaxSuggestionsCount: S.optional(S.Number),
    SuggestionTypes: S.optional(SuggestionTypes),
    AttributeSuggestionsConfig: S.optional(AttributeSuggestionsGetConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetQuerySuggestionsRequest",
}) as any as S.Schema<GetQuerySuggestionsRequest>;
export interface GetSnapshotsResponse {
  SnapShotTimeFilter?: TimeRange;
  SnapshotsDataHeader?: string[];
  SnapshotsData?: string[][];
  NextToken?: string;
}
export const GetSnapshotsResponse = S.suspend(() =>
  S.Struct({
    SnapShotTimeFilter: S.optional(TimeRange),
    SnapshotsDataHeader: S.optional(SnapshotsDataHeaderFields),
    SnapshotsData: S.optional(SnapshotsDataRecords),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSnapshotsResponse",
}) as any as S.Schema<GetSnapshotsResponse>;
export interface ListDataSourceSyncJobsRequest {
  Id: string;
  IndexId: string;
  NextToken?: string;
  MaxResults?: number;
  StartTimeFilter?: TimeRange;
  StatusFilter?: DataSourceSyncJobStatus;
}
export const ListDataSourceSyncJobsRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    IndexId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StartTimeFilter: S.optional(TimeRange),
    StatusFilter: S.optional(DataSourceSyncJobStatus),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataSourceSyncJobsRequest",
}) as any as S.Schema<ListDataSourceSyncJobsRequest>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartDataSourceSyncJobResponse {
  ExecutionId?: string;
}
export const StartDataSourceSyncJobResponse = S.suspend(() =>
  S.Struct({ ExecutionId: S.optional(S.String) }),
).annotations({
  identifier: "StartDataSourceSyncJobResponse",
}) as any as S.Schema<StartDataSourceSyncJobResponse>;
export interface SubmitFeedbackRequest {
  IndexId: string;
  QueryId: string;
  ClickFeedbackItems?: ClickFeedback[];
  RelevanceFeedbackItems?: RelevanceFeedback[];
}
export const SubmitFeedbackRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    QueryId: S.String,
    ClickFeedbackItems: S.optional(ClickFeedbackList),
    RelevanceFeedbackItems: S.optional(RelevanceFeedbackList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SubmitFeedbackRequest",
}) as any as S.Schema<SubmitFeedbackRequest>;
export interface SubmitFeedbackResponse {}
export const SubmitFeedbackResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "SubmitFeedbackResponse" },
) as any as S.Schema<SubmitFeedbackResponse>;
export type ErrorCode = "InternalError" | "InvalidRequest" | (string & {});
export const ErrorCode = S.String;
export interface JwtTokenTypeConfiguration {
  KeyLocation: KeyLocation;
  URL?: string;
  SecretManagerArn?: string;
  UserNameAttributeField?: string;
  GroupAttributeField?: string;
  Issuer?: string;
  ClaimRegex?: string;
}
export const JwtTokenTypeConfiguration = S.suspend(() =>
  S.Struct({
    KeyLocation: KeyLocation,
    URL: S.optional(S.String),
    SecretManagerArn: S.optional(S.String),
    UserNameAttributeField: S.optional(S.String),
    GroupAttributeField: S.optional(S.String),
    Issuer: S.optional(S.String),
    ClaimRegex: S.optional(S.String),
  }),
).annotations({
  identifier: "JwtTokenTypeConfiguration",
}) as any as S.Schema<JwtTokenTypeConfiguration>;
export interface JsonTokenTypeConfiguration {
  UserNameAttributeField: string;
  GroupAttributeField: string;
}
export const JsonTokenTypeConfiguration = S.suspend(() =>
  S.Struct({ UserNameAttributeField: S.String, GroupAttributeField: S.String }),
).annotations({
  identifier: "JsonTokenTypeConfiguration",
}) as any as S.Schema<JsonTokenTypeConfiguration>;
export type EndpointType = "HOME" | (string & {});
export const EndpointType = S.String;
export type PrincipalMappingStatus =
  | "FAILED"
  | "SUCCEEDED"
  | "PROCESSING"
  | "DELETING"
  | "DELETED"
  | (string & {});
export const PrincipalMappingStatus = S.String;
export interface MemberGroup {
  GroupId: string;
  DataSourceId?: string;
}
export const MemberGroup = S.suspend(() =>
  S.Struct({ GroupId: S.String, DataSourceId: S.optional(S.String) }),
).annotations({ identifier: "MemberGroup" }) as any as S.Schema<MemberGroup>;
export type MemberGroups = MemberGroup[];
export const MemberGroups = S.Array(MemberGroup);
export interface MemberUser {
  UserId: string;
}
export const MemberUser = S.suspend(() =>
  S.Struct({ UserId: S.String }),
).annotations({ identifier: "MemberUser" }) as any as S.Schema<MemberUser>;
export type MemberUsers = MemberUser[];
export const MemberUsers = S.Array(MemberUser);
export interface ExpandConfiguration {
  MaxResultItemsToExpand?: number;
  MaxExpandedResultsPerItem?: number;
}
export const ExpandConfiguration = S.suspend(() =>
  S.Struct({
    MaxResultItemsToExpand: S.optional(S.Number),
    MaxExpandedResultsPerItem: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExpandConfiguration",
}) as any as S.Schema<ExpandConfiguration>;
export interface Search {
  Facetable?: boolean;
  Searchable?: boolean;
  Displayable?: boolean;
  Sortable?: boolean;
}
export const Search = S.suspend(() =>
  S.Struct({
    Facetable: S.optional(S.Boolean),
    Searchable: S.optional(S.Boolean),
    Displayable: S.optional(S.Boolean),
    Sortable: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Search" }) as any as S.Schema<Search>;
export interface SuggestableConfig {
  AttributeName?: string;
  Suggestable?: boolean;
}
export const SuggestableConfig = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    Suggestable: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SuggestableConfig",
}) as any as S.Schema<SuggestableConfig>;
export type SuggestableConfigList = SuggestableConfig[];
export const SuggestableConfigList = S.Array(SuggestableConfig);
export type AssociateEntitiesToExperienceFailedEntityList = FailedEntity[];
export const AssociateEntitiesToExperienceFailedEntityList =
  S.Array(FailedEntity);
export interface BatchDeleteFeaturedResultsSetError {
  Id: string;
  ErrorCode: ErrorCode;
  ErrorMessage: string;
}
export const BatchDeleteFeaturedResultsSetError = S.suspend(() =>
  S.Struct({ Id: S.String, ErrorCode: ErrorCode, ErrorMessage: S.String }),
).annotations({
  identifier: "BatchDeleteFeaturedResultsSetError",
}) as any as S.Schema<BatchDeleteFeaturedResultsSetError>;
export type BatchDeleteFeaturedResultsSetErrors =
  BatchDeleteFeaturedResultsSetError[];
export const BatchDeleteFeaturedResultsSetErrors = S.Array(
  BatchDeleteFeaturedResultsSetError,
);
export interface UserTokenConfiguration {
  JwtTokenTypeConfiguration?: JwtTokenTypeConfiguration;
  JsonTokenTypeConfiguration?: JsonTokenTypeConfiguration;
}
export const UserTokenConfiguration = S.suspend(() =>
  S.Struct({
    JwtTokenTypeConfiguration: S.optional(JwtTokenTypeConfiguration),
    JsonTokenTypeConfiguration: S.optional(JsonTokenTypeConfiguration),
  }),
).annotations({
  identifier: "UserTokenConfiguration",
}) as any as S.Schema<UserTokenConfiguration>;
export type UserTokenConfigurationList = UserTokenConfiguration[];
export const UserTokenConfigurationList = S.Array(UserTokenConfiguration);
export interface ExperienceEndpoint {
  EndpointType?: EndpointType;
  Endpoint?: string;
}
export const ExperienceEndpoint = S.suspend(() =>
  S.Struct({
    EndpointType: S.optional(EndpointType),
    Endpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "ExperienceEndpoint",
}) as any as S.Schema<ExperienceEndpoint>;
export type ExperienceEndpoints = ExperienceEndpoint[];
export const ExperienceEndpoints = S.Array(ExperienceEndpoint);
export interface FeaturedDocumentWithMetadata {
  Id?: string;
  Title?: string;
  URI?: string;
}
export const FeaturedDocumentWithMetadata = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Title: S.optional(S.String),
    URI: S.optional(S.String),
  }),
).annotations({
  identifier: "FeaturedDocumentWithMetadata",
}) as any as S.Schema<FeaturedDocumentWithMetadata>;
export type FeaturedDocumentWithMetadataList = FeaturedDocumentWithMetadata[];
export const FeaturedDocumentWithMetadataList = S.Array(
  FeaturedDocumentWithMetadata,
);
export interface FeaturedDocumentMissing {
  Id?: string;
}
export const FeaturedDocumentMissing = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "FeaturedDocumentMissing",
}) as any as S.Schema<FeaturedDocumentMissing>;
export type FeaturedDocumentMissingList = FeaturedDocumentMissing[];
export const FeaturedDocumentMissingList = S.Array(FeaturedDocumentMissing);
export interface GroupOrderingIdSummary {
  Status?: PrincipalMappingStatus;
  LastUpdatedAt?: Date;
  ReceivedAt?: Date;
  OrderingId?: number;
  FailureReason?: string;
}
export const GroupOrderingIdSummary = S.suspend(() =>
  S.Struct({
    Status: S.optional(PrincipalMappingStatus),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ReceivedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    OrderingId: S.optional(S.Number),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GroupOrderingIdSummary",
}) as any as S.Schema<GroupOrderingIdSummary>;
export type GroupOrderingIdSummaries = GroupOrderingIdSummary[];
export const GroupOrderingIdSummaries = S.Array(GroupOrderingIdSummary);
export interface AttributeSuggestionsDescribeConfig {
  SuggestableConfigList?: SuggestableConfig[];
  AttributeSuggestionsMode?: AttributeSuggestionsMode;
}
export const AttributeSuggestionsDescribeConfig = S.suspend(() =>
  S.Struct({
    SuggestableConfigList: S.optional(SuggestableConfigList),
    AttributeSuggestionsMode: S.optional(AttributeSuggestionsMode),
  }),
).annotations({
  identifier: "AttributeSuggestionsDescribeConfig",
}) as any as S.Schema<AttributeSuggestionsDescribeConfig>;
export interface AccessControlConfigurationSummary {
  Id: string;
}
export const AccessControlConfigurationSummary = S.suspend(() =>
  S.Struct({ Id: S.String }),
).annotations({
  identifier: "AccessControlConfigurationSummary",
}) as any as S.Schema<AccessControlConfigurationSummary>;
export type AccessControlConfigurationSummaryList =
  AccessControlConfigurationSummary[];
export const AccessControlConfigurationSummaryList = S.Array(
  AccessControlConfigurationSummary,
);
export interface DataSourceSummary {
  Name?: string;
  Id?: string;
  Type?: DataSourceType;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Status?: DataSourceStatus;
  LanguageCode?: string;
}
export const DataSourceSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Type: S.optional(DataSourceType),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(DataSourceStatus),
    LanguageCode: S.optional(S.String),
  }),
).annotations({
  identifier: "DataSourceSummary",
}) as any as S.Schema<DataSourceSummary>;
export type DataSourceSummaryList = DataSourceSummary[];
export const DataSourceSummaryList = S.Array(DataSourceSummary);
export interface PersonasSummary {
  EntityId?: string;
  Persona?: Persona;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const PersonasSummary = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(S.String),
    Persona: S.optional(Persona),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PersonasSummary",
}) as any as S.Schema<PersonasSummary>;
export type PersonasSummaryList = PersonasSummary[];
export const PersonasSummaryList = S.Array(PersonasSummary);
export interface ExperiencesSummary {
  Name?: string;
  Id?: string;
  CreatedAt?: Date;
  Status?: ExperienceStatus;
  Endpoints?: ExperienceEndpoint[];
}
export const ExperiencesSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(ExperienceStatus),
    Endpoints: S.optional(ExperienceEndpoints),
  }),
).annotations({
  identifier: "ExperiencesSummary",
}) as any as S.Schema<ExperiencesSummary>;
export type ExperiencesSummaryList = ExperiencesSummary[];
export const ExperiencesSummaryList = S.Array(ExperiencesSummary);
export interface FaqSummary {
  Id?: string;
  Name?: string;
  Status?: FaqStatus;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  FileFormat?: FaqFileFormat;
  LanguageCode?: string;
}
export const FaqSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(FaqStatus),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FileFormat: S.optional(FaqFileFormat),
    LanguageCode: S.optional(S.String),
  }),
).annotations({ identifier: "FaqSummary" }) as any as S.Schema<FaqSummary>;
export type FaqSummaryItems = FaqSummary[];
export const FaqSummaryItems = S.Array(FaqSummary);
export interface FeaturedResultsSetSummary {
  FeaturedResultsSetId?: string;
  FeaturedResultsSetName?: string;
  Status?: FeaturedResultsSetStatus;
  LastUpdatedTimestamp?: number;
  CreationTimestamp?: number;
}
export const FeaturedResultsSetSummary = S.suspend(() =>
  S.Struct({
    FeaturedResultsSetId: S.optional(S.String),
    FeaturedResultsSetName: S.optional(S.String),
    Status: S.optional(FeaturedResultsSetStatus),
    LastUpdatedTimestamp: S.optional(S.Number),
    CreationTimestamp: S.optional(S.Number),
  }),
).annotations({
  identifier: "FeaturedResultsSetSummary",
}) as any as S.Schema<FeaturedResultsSetSummary>;
export type FeaturedResultsSetSummaryItems = FeaturedResultsSetSummary[];
export const FeaturedResultsSetSummaryItems = S.Array(
  FeaturedResultsSetSummary,
);
export interface GroupSummary {
  GroupId?: string;
  OrderingId?: number;
}
export const GroupSummary = S.suspend(() =>
  S.Struct({ GroupId: S.optional(S.String), OrderingId: S.optional(S.Number) }),
).annotations({ identifier: "GroupSummary" }) as any as S.Schema<GroupSummary>;
export type ListOfGroupSummaries = GroupSummary[];
export const ListOfGroupSummaries = S.Array(GroupSummary);
export interface IndexConfigurationSummary {
  Name?: string;
  Id?: string;
  Edition?: IndexEdition;
  CreatedAt: Date;
  UpdatedAt: Date;
  Status: IndexStatus;
}
export const IndexConfigurationSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Edition: S.optional(IndexEdition),
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: IndexStatus,
  }),
).annotations({
  identifier: "IndexConfigurationSummary",
}) as any as S.Schema<IndexConfigurationSummary>;
export type IndexConfigurationSummaryList = IndexConfigurationSummary[];
export const IndexConfigurationSummaryList = S.Array(IndexConfigurationSummary);
export interface QuerySuggestionsBlockListSummary {
  Id?: string;
  Name?: string;
  Status?: QuerySuggestionsBlockListStatus;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ItemCount?: number;
}
export const QuerySuggestionsBlockListSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(QuerySuggestionsBlockListStatus),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ItemCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "QuerySuggestionsBlockListSummary",
}) as any as S.Schema<QuerySuggestionsBlockListSummary>;
export type QuerySuggestionsBlockListSummaryItems =
  QuerySuggestionsBlockListSummary[];
export const QuerySuggestionsBlockListSummaryItems = S.Array(
  QuerySuggestionsBlockListSummary,
);
export interface ThesaurusSummary {
  Id?: string;
  Name?: string;
  Status?: ThesaurusStatus;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const ThesaurusSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(ThesaurusStatus),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ThesaurusSummary",
}) as any as S.Schema<ThesaurusSummary>;
export type ThesaurusSummaryItems = ThesaurusSummary[];
export const ThesaurusSummaryItems = S.Array(ThesaurusSummary);
export interface GroupMembers {
  MemberGroups?: MemberGroup[];
  MemberUsers?: MemberUser[];
  S3PathforGroupMembers?: S3Path;
}
export const GroupMembers = S.suspend(() =>
  S.Struct({
    MemberGroups: S.optional(MemberGroups),
    MemberUsers: S.optional(MemberUsers),
    S3PathforGroupMembers: S.optional(S3Path),
  }),
).annotations({ identifier: "GroupMembers" }) as any as S.Schema<GroupMembers>;
export interface CollapseConfiguration {
  DocumentAttributeKey: string;
  SortingConfigurations?: SortingConfiguration[];
  MissingAttributeKeyStrategy?: MissingAttributeKeyStrategy;
  Expand?: boolean;
  ExpandConfiguration?: ExpandConfiguration;
}
export const CollapseConfiguration = S.suspend(() =>
  S.Struct({
    DocumentAttributeKey: S.String,
    SortingConfigurations: S.optional(SortingConfigurationList),
    MissingAttributeKeyStrategy: S.optional(MissingAttributeKeyStrategy),
    Expand: S.optional(S.Boolean),
    ExpandConfiguration: S.optional(ExpandConfiguration),
  }),
).annotations({
  identifier: "CollapseConfiguration",
}) as any as S.Schema<CollapseConfiguration>;
export interface FeaturedResultsSet {
  FeaturedResultsSetId?: string;
  FeaturedResultsSetName?: string;
  Description?: string;
  Status?: FeaturedResultsSetStatus;
  QueryTexts?: string[];
  FeaturedDocuments?: FeaturedDocument[];
  LastUpdatedTimestamp?: number;
  CreationTimestamp?: number;
}
export const FeaturedResultsSet = S.suspend(() =>
  S.Struct({
    FeaturedResultsSetId: S.optional(S.String),
    FeaturedResultsSetName: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(FeaturedResultsSetStatus),
    QueryTexts: S.optional(QueryTextList),
    FeaturedDocuments: S.optional(FeaturedDocumentList),
    LastUpdatedTimestamp: S.optional(S.Number),
    CreationTimestamp: S.optional(S.Number),
  }),
).annotations({
  identifier: "FeaturedResultsSet",
}) as any as S.Schema<FeaturedResultsSet>;
export interface DocumentMetadataConfiguration {
  Name: string;
  Type: DocumentAttributeValueType;
  Relevance?: Relevance;
  Search?: Search;
}
export const DocumentMetadataConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: DocumentAttributeValueType,
    Relevance: S.optional(Relevance),
    Search: S.optional(Search),
  }),
).annotations({
  identifier: "DocumentMetadataConfiguration",
}) as any as S.Schema<DocumentMetadataConfiguration>;
export type DocumentMetadataConfigurationList = DocumentMetadataConfiguration[];
export const DocumentMetadataConfigurationList = S.Array(
  DocumentMetadataConfiguration,
);
export interface AttributeSuggestionsUpdateConfig {
  SuggestableConfigList?: SuggestableConfig[];
  AttributeSuggestionsMode?: AttributeSuggestionsMode;
}
export const AttributeSuggestionsUpdateConfig = S.suspend(() =>
  S.Struct({
    SuggestableConfigList: S.optional(SuggestableConfigList),
    AttributeSuggestionsMode: S.optional(AttributeSuggestionsMode),
  }),
).annotations({
  identifier: "AttributeSuggestionsUpdateConfig",
}) as any as S.Schema<AttributeSuggestionsUpdateConfig>;
export type ScoreConfidence =
  | "VERY_HIGH"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "NOT_AVAILABLE"
  | (string & {});
export const ScoreConfidence = S.String;
export interface AssociateEntitiesToExperienceResponse {
  FailedEntityList?: FailedEntity[];
}
export const AssociateEntitiesToExperienceResponse = S.suspend(() =>
  S.Struct({
    FailedEntityList: S.optional(AssociateEntitiesToExperienceFailedEntityList),
  }),
).annotations({
  identifier: "AssociateEntitiesToExperienceResponse",
}) as any as S.Schema<AssociateEntitiesToExperienceResponse>;
export interface AssociatePersonasToEntitiesResponse {
  FailedEntityList?: FailedEntity[];
}
export const AssociatePersonasToEntitiesResponse = S.suspend(() =>
  S.Struct({ FailedEntityList: S.optional(FailedEntityList) }),
).annotations({
  identifier: "AssociatePersonasToEntitiesResponse",
}) as any as S.Schema<AssociatePersonasToEntitiesResponse>;
export interface BatchDeleteFeaturedResultsSetResponse {
  Errors: BatchDeleteFeaturedResultsSetError[];
}
export const BatchDeleteFeaturedResultsSetResponse = S.suspend(() =>
  S.Struct({ Errors: BatchDeleteFeaturedResultsSetErrors }),
).annotations({
  identifier: "BatchDeleteFeaturedResultsSetResponse",
}) as any as S.Schema<BatchDeleteFeaturedResultsSetResponse>;
export interface CreateAccessControlConfigurationResponse {
  Id: string;
}
export const CreateAccessControlConfigurationResponse = S.suspend(() =>
  S.Struct({ Id: S.String }),
).annotations({
  identifier: "CreateAccessControlConfigurationResponse",
}) as any as S.Schema<CreateAccessControlConfigurationResponse>;
export interface CreateExperienceRequest {
  Name: string;
  IndexId: string;
  RoleArn?: string;
  Configuration?: ExperienceConfiguration;
  Description?: string;
  ClientToken?: string;
}
export const CreateExperienceRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    IndexId: S.String,
    RoleArn: S.optional(S.String),
    Configuration: S.optional(ExperienceConfiguration),
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateExperienceRequest",
}) as any as S.Schema<CreateExperienceRequest>;
export interface CreateFaqResponse {
  Id?: string;
}
export const CreateFaqResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateFaqResponse",
}) as any as S.Schema<CreateFaqResponse>;
export interface CreateFeaturedResultsSetResponse {
  FeaturedResultsSet?: FeaturedResultsSet;
}
export const CreateFeaturedResultsSetResponse = S.suspend(() =>
  S.Struct({ FeaturedResultsSet: S.optional(FeaturedResultsSet) }),
).annotations({
  identifier: "CreateFeaturedResultsSetResponse",
}) as any as S.Schema<CreateFeaturedResultsSetResponse>;
export interface CreateIndexRequest {
  Name: string;
  Edition?: IndexEdition;
  RoleArn: string;
  ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  Description?: string;
  ClientToken?: string;
  Tags?: Tag[];
  UserTokenConfigurations?: UserTokenConfiguration[];
  UserContextPolicy?: UserContextPolicy;
  UserGroupResolutionConfiguration?: UserGroupResolutionConfiguration;
}
export const CreateIndexRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Edition: S.optional(IndexEdition),
    RoleArn: S.String,
    ServerSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    Description: S.optional(S.String),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
    UserTokenConfigurations: S.optional(UserTokenConfigurationList),
    UserContextPolicy: S.optional(UserContextPolicy),
    UserGroupResolutionConfiguration: S.optional(
      UserGroupResolutionConfiguration,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateIndexRequest",
}) as any as S.Schema<CreateIndexRequest>;
export interface DescribeExperienceResponse {
  Id?: string;
  IndexId?: string;
  Name?: string;
  Endpoints?: ExperienceEndpoint[];
  Configuration?: ExperienceConfiguration;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Description?: string;
  Status?: ExperienceStatus;
  RoleArn?: string;
  ErrorMessage?: string;
}
export const DescribeExperienceResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    IndexId: S.optional(S.String),
    Name: S.optional(S.String),
    Endpoints: S.optional(ExperienceEndpoints),
    Configuration: S.optional(ExperienceConfiguration),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    Status: S.optional(ExperienceStatus),
    RoleArn: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeExperienceResponse",
}) as any as S.Schema<DescribeExperienceResponse>;
export interface DescribeFeaturedResultsSetResponse {
  FeaturedResultsSetId?: string;
  FeaturedResultsSetName?: string;
  Description?: string;
  Status?: FeaturedResultsSetStatus;
  QueryTexts?: string[];
  FeaturedDocumentsWithMetadata?: FeaturedDocumentWithMetadata[];
  FeaturedDocumentsMissing?: FeaturedDocumentMissing[];
  LastUpdatedTimestamp?: number;
  CreationTimestamp?: number;
}
export const DescribeFeaturedResultsSetResponse = S.suspend(() =>
  S.Struct({
    FeaturedResultsSetId: S.optional(S.String),
    FeaturedResultsSetName: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(FeaturedResultsSetStatus),
    QueryTexts: S.optional(QueryTextList),
    FeaturedDocumentsWithMetadata: S.optional(FeaturedDocumentWithMetadataList),
    FeaturedDocumentsMissing: S.optional(FeaturedDocumentMissingList),
    LastUpdatedTimestamp: S.optional(S.Number),
    CreationTimestamp: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribeFeaturedResultsSetResponse",
}) as any as S.Schema<DescribeFeaturedResultsSetResponse>;
export interface DescribePrincipalMappingResponse {
  IndexId?: string;
  DataSourceId?: string;
  GroupId?: string;
  GroupOrderingIdSummaries?: GroupOrderingIdSummary[];
}
export const DescribePrincipalMappingResponse = S.suspend(() =>
  S.Struct({
    IndexId: S.optional(S.String),
    DataSourceId: S.optional(S.String),
    GroupId: S.optional(S.String),
    GroupOrderingIdSummaries: S.optional(GroupOrderingIdSummaries),
  }),
).annotations({
  identifier: "DescribePrincipalMappingResponse",
}) as any as S.Schema<DescribePrincipalMappingResponse>;
export interface DescribeQuerySuggestionsConfigResponse {
  Mode?: Mode;
  Status?: QuerySuggestionsStatus;
  QueryLogLookBackWindowInDays?: number;
  IncludeQueriesWithoutUserInformation?: boolean;
  MinimumNumberOfQueryingUsers?: number;
  MinimumQueryCount?: number;
  LastSuggestionsBuildTime?: Date;
  LastClearTime?: Date;
  TotalSuggestionsCount?: number;
  AttributeSuggestionsConfig?: AttributeSuggestionsDescribeConfig;
}
export const DescribeQuerySuggestionsConfigResponse = S.suspend(() =>
  S.Struct({
    Mode: S.optional(Mode),
    Status: S.optional(QuerySuggestionsStatus),
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
  }),
).annotations({
  identifier: "DescribeQuerySuggestionsConfigResponse",
}) as any as S.Schema<DescribeQuerySuggestionsConfigResponse>;
export interface DisassociateEntitiesFromExperienceResponse {
  FailedEntityList?: FailedEntity[];
}
export const DisassociateEntitiesFromExperienceResponse = S.suspend(() =>
  S.Struct({ FailedEntityList: S.optional(FailedEntityList) }),
).annotations({
  identifier: "DisassociateEntitiesFromExperienceResponse",
}) as any as S.Schema<DisassociateEntitiesFromExperienceResponse>;
export interface ListAccessControlConfigurationsResponse {
  NextToken?: string;
  AccessControlConfigurations: AccessControlConfigurationSummary[];
}
export const ListAccessControlConfigurationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    AccessControlConfigurations: AccessControlConfigurationSummaryList,
  }),
).annotations({
  identifier: "ListAccessControlConfigurationsResponse",
}) as any as S.Schema<ListAccessControlConfigurationsResponse>;
export interface ListDataSourcesResponse {
  SummaryItems?: DataSourceSummary[];
  NextToken?: string;
}
export const ListDataSourcesResponse = S.suspend(() =>
  S.Struct({
    SummaryItems: S.optional(DataSourceSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataSourcesResponse",
}) as any as S.Schema<ListDataSourcesResponse>;
export interface ListEntityPersonasResponse {
  SummaryItems?: PersonasSummary[];
  NextToken?: string;
}
export const ListEntityPersonasResponse = S.suspend(() =>
  S.Struct({
    SummaryItems: S.optional(PersonasSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEntityPersonasResponse",
}) as any as S.Schema<ListEntityPersonasResponse>;
export interface ListExperiencesResponse {
  SummaryItems?: ExperiencesSummary[];
  NextToken?: string;
}
export const ListExperiencesResponse = S.suspend(() =>
  S.Struct({
    SummaryItems: S.optional(ExperiencesSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExperiencesResponse",
}) as any as S.Schema<ListExperiencesResponse>;
export interface ListFaqsResponse {
  NextToken?: string;
  FaqSummaryItems?: FaqSummary[];
}
export const ListFaqsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    FaqSummaryItems: S.optional(FaqSummaryItems),
  }),
).annotations({
  identifier: "ListFaqsResponse",
}) as any as S.Schema<ListFaqsResponse>;
export interface ListFeaturedResultsSetsResponse {
  FeaturedResultsSetSummaryItems?: FeaturedResultsSetSummary[];
  NextToken?: string;
}
export const ListFeaturedResultsSetsResponse = S.suspend(() =>
  S.Struct({
    FeaturedResultsSetSummaryItems: S.optional(FeaturedResultsSetSummaryItems),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFeaturedResultsSetsResponse",
}) as any as S.Schema<ListFeaturedResultsSetsResponse>;
export interface ListGroupsOlderThanOrderingIdResponse {
  GroupsSummaries?: GroupSummary[];
  NextToken?: string;
}
export const ListGroupsOlderThanOrderingIdResponse = S.suspend(() =>
  S.Struct({
    GroupsSummaries: S.optional(ListOfGroupSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGroupsOlderThanOrderingIdResponse",
}) as any as S.Schema<ListGroupsOlderThanOrderingIdResponse>;
export interface ListIndicesResponse {
  IndexConfigurationSummaryItems?: IndexConfigurationSummary[];
  NextToken?: string;
}
export const ListIndicesResponse = S.suspend(() =>
  S.Struct({
    IndexConfigurationSummaryItems: S.optional(IndexConfigurationSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIndicesResponse",
}) as any as S.Schema<ListIndicesResponse>;
export interface ListQuerySuggestionsBlockListsResponse {
  BlockListSummaryItems?: QuerySuggestionsBlockListSummary[];
  NextToken?: string;
}
export const ListQuerySuggestionsBlockListsResponse = S.suspend(() =>
  S.Struct({
    BlockListSummaryItems: S.optional(QuerySuggestionsBlockListSummaryItems),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListQuerySuggestionsBlockListsResponse",
}) as any as S.Schema<ListQuerySuggestionsBlockListsResponse>;
export interface ListThesauriResponse {
  NextToken?: string;
  ThesaurusSummaryItems?: ThesaurusSummary[];
}
export const ListThesauriResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ThesaurusSummaryItems: S.optional(ThesaurusSummaryItems),
  }),
).annotations({
  identifier: "ListThesauriResponse",
}) as any as S.Schema<ListThesauriResponse>;
export interface PutPrincipalMappingRequest {
  IndexId: string;
  DataSourceId?: string;
  GroupId: string;
  GroupMembers: GroupMembers;
  OrderingId?: number;
  RoleArn?: string;
}
export const PutPrincipalMappingRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    DataSourceId: S.optional(S.String),
    GroupId: S.String,
    GroupMembers: GroupMembers,
    OrderingId: S.optional(S.Number),
    RoleArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutPrincipalMappingRequest",
}) as any as S.Schema<PutPrincipalMappingRequest>;
export interface PutPrincipalMappingResponse {}
export const PutPrincipalMappingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutPrincipalMappingResponse",
}) as any as S.Schema<PutPrincipalMappingResponse>;
export interface UpdateFeaturedResultsSetResponse {
  FeaturedResultsSet?: FeaturedResultsSet;
}
export const UpdateFeaturedResultsSetResponse = S.suspend(() =>
  S.Struct({ FeaturedResultsSet: S.optional(FeaturedResultsSet) }),
).annotations({
  identifier: "UpdateFeaturedResultsSetResponse",
}) as any as S.Schema<UpdateFeaturedResultsSetResponse>;
export interface UpdateIndexRequest {
  Id: string;
  Name?: string;
  RoleArn?: string;
  Description?: string;
  DocumentMetadataConfigurationUpdates?: DocumentMetadataConfiguration[];
  CapacityUnits?: CapacityUnitsConfiguration;
  UserTokenConfigurations?: UserTokenConfiguration[];
  UserContextPolicy?: UserContextPolicy;
  UserGroupResolutionConfiguration?: UserGroupResolutionConfiguration;
}
export const UpdateIndexRequest = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Description: S.optional(S.String),
    DocumentMetadataConfigurationUpdates: S.optional(
      DocumentMetadataConfigurationList,
    ),
    CapacityUnits: S.optional(CapacityUnitsConfiguration),
    UserTokenConfigurations: S.optional(UserTokenConfigurationList),
    UserContextPolicy: S.optional(UserContextPolicy),
    UserGroupResolutionConfiguration: S.optional(
      UserGroupResolutionConfiguration,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateIndexRequest",
}) as any as S.Schema<UpdateIndexRequest>;
export interface UpdateIndexResponse {}
export const UpdateIndexResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateIndexResponse",
}) as any as S.Schema<UpdateIndexResponse>;
export interface UpdateQuerySuggestionsConfigRequest {
  IndexId: string;
  Mode?: Mode;
  QueryLogLookBackWindowInDays?: number;
  IncludeQueriesWithoutUserInformation?: boolean;
  MinimumNumberOfQueryingUsers?: number;
  MinimumQueryCount?: number;
  AttributeSuggestionsConfig?: AttributeSuggestionsUpdateConfig;
}
export const UpdateQuerySuggestionsConfigRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    Mode: S.optional(Mode),
    QueryLogLookBackWindowInDays: S.optional(S.Number),
    IncludeQueriesWithoutUserInformation: S.optional(S.Boolean),
    MinimumNumberOfQueryingUsers: S.optional(S.Number),
    MinimumQueryCount: S.optional(S.Number),
    AttributeSuggestionsConfig: S.optional(AttributeSuggestionsUpdateConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateQuerySuggestionsConfigRequest",
}) as any as S.Schema<UpdateQuerySuggestionsConfigRequest>;
export interface UpdateQuerySuggestionsConfigResponse {}
export const UpdateQuerySuggestionsConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateQuerySuggestionsConfigResponse",
}) as any as S.Schema<UpdateQuerySuggestionsConfigResponse>;
export interface FaqStatistics {
  IndexedQuestionAnswersCount: number;
}
export const FaqStatistics = S.suspend(() =>
  S.Struct({ IndexedQuestionAnswersCount: S.Number }),
).annotations({
  identifier: "FaqStatistics",
}) as any as S.Schema<FaqStatistics>;
export interface TextDocumentStatistics {
  IndexedTextDocumentsCount: number;
  IndexedTextBytes: number;
}
export const TextDocumentStatistics = S.suspend(() =>
  S.Struct({ IndexedTextDocumentsCount: S.Number, IndexedTextBytes: S.Number }),
).annotations({
  identifier: "TextDocumentStatistics",
}) as any as S.Schema<TextDocumentStatistics>;
export interface EntityDisplayData {
  UserName?: string | redacted.Redacted<string>;
  GroupName?: string | redacted.Redacted<string>;
  IdentifiedUserName?: string | redacted.Redacted<string>;
  FirstName?: string | redacted.Redacted<string>;
  LastName?: string | redacted.Redacted<string>;
}
export const EntityDisplayData = S.suspend(() =>
  S.Struct({
    UserName: S.optional(SensitiveString),
    GroupName: S.optional(SensitiveString),
    IdentifiedUserName: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EntityDisplayData",
}) as any as S.Schema<EntityDisplayData>;
export interface ScoreAttributes {
  ScoreConfidence?: ScoreConfidence;
}
export const ScoreAttributes = S.suspend(() =>
  S.Struct({ ScoreConfidence: S.optional(ScoreConfidence) }),
).annotations({
  identifier: "ScoreAttributes",
}) as any as S.Schema<ScoreAttributes>;
export interface BatchDeleteDocumentResponseFailedDocument {
  Id?: string;
  DataSourceId?: string;
  ErrorCode?: ErrorCode;
  ErrorMessage?: string;
}
export const BatchDeleteDocumentResponseFailedDocument = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    DataSourceId: S.optional(S.String),
    ErrorCode: S.optional(ErrorCode),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDeleteDocumentResponseFailedDocument",
}) as any as S.Schema<BatchDeleteDocumentResponseFailedDocument>;
export type BatchDeleteDocumentResponseFailedDocuments =
  BatchDeleteDocumentResponseFailedDocument[];
export const BatchDeleteDocumentResponseFailedDocuments = S.Array(
  BatchDeleteDocumentResponseFailedDocument,
);
export interface DocumentInfo {
  DocumentId: string;
  Attributes?: DocumentAttribute[];
}
export const DocumentInfo = S.suspend(() =>
  S.Struct({
    DocumentId: S.String,
    Attributes: S.optional(DocumentAttributeList),
  }),
).annotations({ identifier: "DocumentInfo" }) as any as S.Schema<DocumentInfo>;
export type DocumentInfoList = DocumentInfo[];
export const DocumentInfoList = S.Array(DocumentInfo);
export interface IndexStatistics {
  FaqStatistics: FaqStatistics;
  TextDocumentStatistics: TextDocumentStatistics;
}
export const IndexStatistics = S.suspend(() =>
  S.Struct({
    FaqStatistics: FaqStatistics,
    TextDocumentStatistics: TextDocumentStatistics,
  }),
).annotations({
  identifier: "IndexStatistics",
}) as any as S.Schema<IndexStatistics>;
export interface ExperienceEntitiesSummary {
  EntityId?: string;
  EntityType?: EntityType;
  DisplayData?: EntityDisplayData;
}
export const ExperienceEntitiesSummary = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(S.String),
    EntityType: S.optional(EntityType),
    DisplayData: S.optional(EntityDisplayData),
  }),
).annotations({
  identifier: "ExperienceEntitiesSummary",
}) as any as S.Schema<ExperienceEntitiesSummary>;
export type ExperienceEntitiesSummaryList = ExperienceEntitiesSummary[];
export const ExperienceEntitiesSummaryList = S.Array(ExperienceEntitiesSummary);
export interface RetrieveResultItem {
  Id?: string;
  DocumentId?: string;
  DocumentTitle?: string;
  Content?: string;
  DocumentURI?: string;
  DocumentAttributes?: DocumentAttribute[];
  ScoreAttributes?: ScoreAttributes;
}
export const RetrieveResultItem = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    DocumentId: S.optional(S.String),
    DocumentTitle: S.optional(S.String),
    Content: S.optional(S.String),
    DocumentURI: S.optional(S.String),
    DocumentAttributes: S.optional(DocumentAttributeList),
    ScoreAttributes: S.optional(ScoreAttributes),
  }),
).annotations({
  identifier: "RetrieveResultItem",
}) as any as S.Schema<RetrieveResultItem>;
export type RetrieveResultItemList = RetrieveResultItem[];
export const RetrieveResultItemList = S.Array(RetrieveResultItem);
export interface BatchDeleteDocumentResponse {
  FailedDocuments?: BatchDeleteDocumentResponseFailedDocument[];
}
export const BatchDeleteDocumentResponse = S.suspend(() =>
  S.Struct({
    FailedDocuments: S.optional(BatchDeleteDocumentResponseFailedDocuments),
  }),
).annotations({
  identifier: "BatchDeleteDocumentResponse",
}) as any as S.Schema<BatchDeleteDocumentResponse>;
export interface BatchGetDocumentStatusRequest {
  IndexId: string;
  DocumentInfoList: DocumentInfo[];
}
export const BatchGetDocumentStatusRequest = S.suspend(() =>
  S.Struct({ IndexId: S.String, DocumentInfoList: DocumentInfoList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetDocumentStatusRequest",
}) as any as S.Schema<BatchGetDocumentStatusRequest>;
export interface BatchPutDocumentRequest {
  IndexId: string;
  RoleArn?: string;
  Documents: Document[];
  CustomDocumentEnrichmentConfiguration?: CustomDocumentEnrichmentConfiguration;
}
export const BatchPutDocumentRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    RoleArn: S.optional(S.String),
    Documents: DocumentList,
    CustomDocumentEnrichmentConfiguration: S.optional(
      CustomDocumentEnrichmentConfiguration,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchPutDocumentRequest",
}) as any as S.Schema<BatchPutDocumentRequest>;
export interface CreateExperienceResponse {
  Id: string;
}
export const CreateExperienceResponse = S.suspend(() =>
  S.Struct({ Id: S.String }),
).annotations({
  identifier: "CreateExperienceResponse",
}) as any as S.Schema<CreateExperienceResponse>;
export interface CreateIndexResponse {
  Id?: string;
}
export const CreateIndexResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateIndexResponse",
}) as any as S.Schema<CreateIndexResponse>;
export interface DescribeIndexResponse {
  Name?: string;
  Id?: string;
  Edition?: IndexEdition;
  RoleArn?: string;
  ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  Status?: IndexStatus;
  Description?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  DocumentMetadataConfigurations?: DocumentMetadataConfiguration[];
  IndexStatistics?: IndexStatistics;
  ErrorMessage?: string;
  CapacityUnits?: CapacityUnitsConfiguration;
  UserTokenConfigurations?: UserTokenConfiguration[];
  UserContextPolicy?: UserContextPolicy;
  UserGroupResolutionConfiguration?: UserGroupResolutionConfiguration;
}
export const DescribeIndexResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Edition: S.optional(IndexEdition),
    RoleArn: S.optional(S.String),
    ServerSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    Status: S.optional(IndexStatus),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DocumentMetadataConfigurations: S.optional(
      DocumentMetadataConfigurationList,
    ),
    IndexStatistics: S.optional(IndexStatistics),
    ErrorMessage: S.optional(S.String),
    CapacityUnits: S.optional(CapacityUnitsConfiguration),
    UserTokenConfigurations: S.optional(UserTokenConfigurationList),
    UserContextPolicy: S.optional(UserContextPolicy),
    UserGroupResolutionConfiguration: S.optional(
      UserGroupResolutionConfiguration,
    ),
  }),
).annotations({
  identifier: "DescribeIndexResponse",
}) as any as S.Schema<DescribeIndexResponse>;
export interface ListExperienceEntitiesResponse {
  SummaryItems?: ExperienceEntitiesSummary[];
  NextToken?: string;
}
export const ListExperienceEntitiesResponse = S.suspend(() =>
  S.Struct({
    SummaryItems: S.optional(ExperienceEntitiesSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExperienceEntitiesResponse",
}) as any as S.Schema<ListExperienceEntitiesResponse>;
export interface QueryRequest {
  IndexId: string;
  QueryText?: string;
  AttributeFilter?: AttributeFilter;
  Facets?: Facet[];
  RequestedDocumentAttributes?: string[];
  QueryResultTypeFilter?: QueryResultType;
  DocumentRelevanceOverrideConfigurations?: DocumentRelevanceConfiguration[];
  PageNumber?: number;
  PageSize?: number;
  SortingConfiguration?: SortingConfiguration;
  SortingConfigurations?: SortingConfiguration[];
  UserContext?: UserContext;
  VisitorId?: string;
  SpellCorrectionConfiguration?: SpellCorrectionConfiguration;
  CollapseConfiguration?: CollapseConfiguration;
}
export const QueryRequest = S.suspend(() =>
  S.Struct({
    IndexId: S.String,
    QueryText: S.optional(S.String),
    AttributeFilter: S.optional(AttributeFilter),
    Facets: S.optional(FacetList),
    RequestedDocumentAttributes: S.optional(DocumentAttributeKeyList),
    QueryResultTypeFilter: S.optional(QueryResultType),
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({ identifier: "QueryRequest" }) as any as S.Schema<QueryRequest>;
export interface RetrieveResult {
  QueryId?: string;
  ResultItems?: RetrieveResultItem[];
}
export const RetrieveResult = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    ResultItems: S.optional(RetrieveResultItemList),
  }),
).annotations({
  identifier: "RetrieveResult",
}) as any as S.Schema<RetrieveResult>;
export interface SourceDocument {
  DocumentId?: string;
  SuggestionAttributes?: string[];
  AdditionalAttributes?: DocumentAttribute[];
}
export const SourceDocument = S.suspend(() =>
  S.Struct({
    DocumentId: S.optional(S.String),
    SuggestionAttributes: S.optional(DocumentAttributeKeyList),
    AdditionalAttributes: S.optional(DocumentAttributeList),
  }),
).annotations({
  identifier: "SourceDocument",
}) as any as S.Schema<SourceDocument>;
export type SourceDocuments = SourceDocument[];
export const SourceDocuments = S.Array(SourceDocument);
export interface DataSourceSyncJobMetrics {
  DocumentsAdded?: string;
  DocumentsModified?: string;
  DocumentsDeleted?: string;
  DocumentsFailed?: string;
  DocumentsScanned?: string;
}
export const DataSourceSyncJobMetrics = S.suspend(() =>
  S.Struct({
    DocumentsAdded: S.optional(S.String),
    DocumentsModified: S.optional(S.String),
    DocumentsDeleted: S.optional(S.String),
    DocumentsFailed: S.optional(S.String),
    DocumentsScanned: S.optional(S.String),
  }),
).annotations({
  identifier: "DataSourceSyncJobMetrics",
}) as any as S.Schema<DataSourceSyncJobMetrics>;
export interface ConflictingItem {
  QueryText?: string;
  SetName?: string;
  SetId?: string;
}
export const ConflictingItem = S.suspend(() =>
  S.Struct({
    QueryText: S.optional(S.String),
    SetName: S.optional(S.String),
    SetId: S.optional(S.String),
  }),
).annotations({
  identifier: "ConflictingItem",
}) as any as S.Schema<ConflictingItem>;
export type ConflictingItems = ConflictingItem[];
export const ConflictingItems = S.Array(ConflictingItem);
export interface DataSourceSyncJob {
  ExecutionId?: string;
  StartTime?: Date;
  EndTime?: Date;
  Status?: DataSourceSyncJobStatus;
  ErrorMessage?: string;
  ErrorCode?: ErrorCode;
  DataSourceErrorCode?: string;
  Metrics?: DataSourceSyncJobMetrics;
}
export const DataSourceSyncJob = S.suspend(() =>
  S.Struct({
    ExecutionId: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(DataSourceSyncJobStatus),
    ErrorMessage: S.optional(S.String),
    ErrorCode: S.optional(ErrorCode),
    DataSourceErrorCode: S.optional(S.String),
    Metrics: S.optional(DataSourceSyncJobMetrics),
  }),
).annotations({
  identifier: "DataSourceSyncJob",
}) as any as S.Schema<DataSourceSyncJob>;
export type DataSourceSyncJobHistoryList = DataSourceSyncJob[];
export const DataSourceSyncJobHistoryList = S.Array(DataSourceSyncJob);
export interface CreateDataSourceRequest {
  Name: string;
  IndexId: string;
  Type: DataSourceType;
  Configuration?: DataSourceConfiguration;
  VpcConfiguration?: DataSourceVpcConfiguration;
  Description?: string;
  Schedule?: string;
  RoleArn?: string;
  Tags?: Tag[];
  ClientToken?: string;
  LanguageCode?: string;
  CustomDocumentEnrichmentConfiguration?: CustomDocumentEnrichmentConfiguration;
}
export const CreateDataSourceRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    IndexId: S.String,
    Type: DataSourceType,
    Configuration: S.optional(DataSourceConfiguration),
    VpcConfiguration: S.optional(DataSourceVpcConfiguration),
    Description: S.optional(S.String),
    Schedule: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    LanguageCode: S.optional(S.String),
    CustomDocumentEnrichmentConfiguration: S.optional(
      CustomDocumentEnrichmentConfiguration,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDataSourceRequest",
}) as any as S.Schema<CreateDataSourceRequest>;
export interface ListDataSourceSyncJobsResponse {
  History?: DataSourceSyncJob[];
  NextToken?: string;
}
export const ListDataSourceSyncJobsResponse = S.suspend(() =>
  S.Struct({
    History: S.optional(DataSourceSyncJobHistoryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataSourceSyncJobsResponse",
}) as any as S.Schema<ListDataSourceSyncJobsResponse>;
export type DocumentStatus =
  | "NOT_FOUND"
  | "PROCESSING"
  | "INDEXED"
  | "UPDATED"
  | "FAILED"
  | "UPDATE_FAILED"
  | (string & {});
export const DocumentStatus = S.String;
export type QueryResultFormat = "TABLE" | "TEXT" | (string & {});
export const QueryResultFormat = S.String;
export type WarningCode = "QUERY_LANGUAGE_INVALID_SYNTAX" | (string & {});
export const WarningCode = S.String;
export interface SuggestionHighlight {
  BeginOffset?: number;
  EndOffset?: number;
}
export const SuggestionHighlight = S.suspend(() =>
  S.Struct({
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
  }),
).annotations({
  identifier: "SuggestionHighlight",
}) as any as S.Schema<SuggestionHighlight>;
export type SuggestionHighlightList = SuggestionHighlight[];
export const SuggestionHighlightList = S.Array(SuggestionHighlight);
export interface BatchGetDocumentStatusResponseError {
  DocumentId?: string;
  DataSourceId?: string;
  ErrorCode?: ErrorCode;
  ErrorMessage?: string;
}
export const BatchGetDocumentStatusResponseError = S.suspend(() =>
  S.Struct({
    DocumentId: S.optional(S.String),
    DataSourceId: S.optional(S.String),
    ErrorCode: S.optional(ErrorCode),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetDocumentStatusResponseError",
}) as any as S.Schema<BatchGetDocumentStatusResponseError>;
export type BatchGetDocumentStatusResponseErrors =
  BatchGetDocumentStatusResponseError[];
export const BatchGetDocumentStatusResponseErrors = S.Array(
  BatchGetDocumentStatusResponseError,
);
export interface Status {
  DocumentId?: string;
  DocumentStatus?: DocumentStatus;
  FailureCode?: string;
  FailureReason?: string;
}
export const Status = S.suspend(() =>
  S.Struct({
    DocumentId: S.optional(S.String),
    DocumentStatus: S.optional(DocumentStatus),
    FailureCode: S.optional(S.String),
    FailureReason: S.optional(S.String),
  }),
).annotations({ identifier: "Status" }) as any as S.Schema<Status>;
export type DocumentStatusList = Status[];
export const DocumentStatusList = S.Array(Status);
export interface BatchPutDocumentResponseFailedDocument {
  Id?: string;
  DataSourceId?: string;
  ErrorCode?: ErrorCode;
  ErrorMessage?: string;
}
export const BatchPutDocumentResponseFailedDocument = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    DataSourceId: S.optional(S.String),
    ErrorCode: S.optional(ErrorCode),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchPutDocumentResponseFailedDocument",
}) as any as S.Schema<BatchPutDocumentResponseFailedDocument>;
export type BatchPutDocumentResponseFailedDocuments =
  BatchPutDocumentResponseFailedDocument[];
export const BatchPutDocumentResponseFailedDocuments = S.Array(
  BatchPutDocumentResponseFailedDocument,
);
export interface Warning {
  Message?: string;
  Code?: WarningCode;
}
export const Warning = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String), Code: S.optional(WarningCode) }),
).annotations({ identifier: "Warning" }) as any as S.Schema<Warning>;
export type WarningList = Warning[];
export const WarningList = S.Array(Warning);
export type AdditionalResultAttributeValueType =
  | "TEXT_WITH_HIGHLIGHTS_VALUE"
  | (string & {});
export const AdditionalResultAttributeValueType = S.String;
export type HighlightType = "STANDARD" | "THESAURUS_SYNONYM" | (string & {});
export const HighlightType = S.String;
export interface Highlight {
  BeginOffset: number;
  EndOffset: number;
  TopAnswer?: boolean;
  Type?: HighlightType;
}
export const Highlight = S.suspend(() =>
  S.Struct({
    BeginOffset: S.Number,
    EndOffset: S.Number,
    TopAnswer: S.optional(S.Boolean),
    Type: S.optional(HighlightType),
  }),
).annotations({ identifier: "Highlight" }) as any as S.Schema<Highlight>;
export type HighlightList = Highlight[];
export const HighlightList = S.Array(Highlight);
export interface TextWithHighlights {
  Text?: string;
  Highlights?: Highlight[];
}
export const TextWithHighlights = S.suspend(() =>
  S.Struct({
    Text: S.optional(S.String),
    Highlights: S.optional(HighlightList),
  }),
).annotations({
  identifier: "TextWithHighlights",
}) as any as S.Schema<TextWithHighlights>;
export interface AdditionalResultAttributeValue {
  TextWithHighlightsValue?: TextWithHighlights;
}
export const AdditionalResultAttributeValue = S.suspend(() =>
  S.Struct({ TextWithHighlightsValue: S.optional(TextWithHighlights) }),
).annotations({
  identifier: "AdditionalResultAttributeValue",
}) as any as S.Schema<AdditionalResultAttributeValue>;
export interface AdditionalResultAttribute {
  Key: string;
  ValueType: AdditionalResultAttributeValueType;
  Value: AdditionalResultAttributeValue;
}
export const AdditionalResultAttribute = S.suspend(() =>
  S.Struct({
    Key: S.String,
    ValueType: AdditionalResultAttributeValueType,
    Value: AdditionalResultAttributeValue,
  }),
).annotations({
  identifier: "AdditionalResultAttribute",
}) as any as S.Schema<AdditionalResultAttribute>;
export type AdditionalResultAttributeList = AdditionalResultAttribute[];
export const AdditionalResultAttributeList = S.Array(AdditionalResultAttribute);
export interface FeaturedResultsItem {
  Id?: string;
  Type?: QueryResultType;
  AdditionalAttributes?: AdditionalResultAttribute[];
  DocumentId?: string;
  DocumentTitle?: TextWithHighlights;
  DocumentExcerpt?: TextWithHighlights;
  DocumentURI?: string;
  DocumentAttributes?: DocumentAttribute[];
  FeedbackToken?: string;
}
export const FeaturedResultsItem = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.optional(QueryResultType),
    AdditionalAttributes: S.optional(AdditionalResultAttributeList),
    DocumentId: S.optional(S.String),
    DocumentTitle: S.optional(TextWithHighlights),
    DocumentExcerpt: S.optional(TextWithHighlights),
    DocumentURI: S.optional(S.String),
    DocumentAttributes: S.optional(DocumentAttributeList),
    FeedbackToken: S.optional(S.String),
  }),
).annotations({
  identifier: "FeaturedResultsItem",
}) as any as S.Schema<FeaturedResultsItem>;
export type FeaturedResultsItemList = FeaturedResultsItem[];
export const FeaturedResultsItemList = S.Array(FeaturedResultsItem);
export interface SuggestionTextWithHighlights {
  Text?: string;
  Highlights?: SuggestionHighlight[];
}
export const SuggestionTextWithHighlights = S.suspend(() =>
  S.Struct({
    Text: S.optional(S.String),
    Highlights: S.optional(SuggestionHighlightList),
  }),
).annotations({
  identifier: "SuggestionTextWithHighlights",
}) as any as S.Schema<SuggestionTextWithHighlights>;
export interface BatchGetDocumentStatusResponse {
  Errors?: BatchGetDocumentStatusResponseError[];
  DocumentStatusList?: Status[];
}
export const BatchGetDocumentStatusResponse = S.suspend(() =>
  S.Struct({
    Errors: S.optional(BatchGetDocumentStatusResponseErrors),
    DocumentStatusList: S.optional(DocumentStatusList),
  }),
).annotations({
  identifier: "BatchGetDocumentStatusResponse",
}) as any as S.Schema<BatchGetDocumentStatusResponse>;
export interface BatchPutDocumentResponse {
  FailedDocuments?: BatchPutDocumentResponseFailedDocument[];
}
export const BatchPutDocumentResponse = S.suspend(() =>
  S.Struct({
    FailedDocuments: S.optional(BatchPutDocumentResponseFailedDocuments),
  }),
).annotations({
  identifier: "BatchPutDocumentResponse",
}) as any as S.Schema<BatchPutDocumentResponse>;
export interface CreateDataSourceResponse {
  Id: string;
}
export const CreateDataSourceResponse = S.suspend(() =>
  S.Struct({ Id: S.String }),
).annotations({
  identifier: "CreateDataSourceResponse",
}) as any as S.Schema<CreateDataSourceResponse>;
export interface SuggestionValue {
  Text?: SuggestionTextWithHighlights;
}
export const SuggestionValue = S.suspend(() =>
  S.Struct({ Text: S.optional(SuggestionTextWithHighlights) }),
).annotations({
  identifier: "SuggestionValue",
}) as any as S.Schema<SuggestionValue>;
export interface DocumentAttributeValueCountPair {
  DocumentAttributeValue?: DocumentAttributeValue;
  Count?: number;
  FacetResults?: FacetResult[];
}
export const DocumentAttributeValueCountPair = S.suspend(() =>
  S.Struct({
    DocumentAttributeValue: S.optional(DocumentAttributeValue),
    Count: S.optional(S.Number),
    FacetResults: S.optional(
      S.suspend(() => FacetResultList).annotations({
        identifier: "FacetResultList",
      }),
    ),
  }),
).annotations({
  identifier: "DocumentAttributeValueCountPair",
}) as any as S.Schema<DocumentAttributeValueCountPair>;
export type DocumentAttributeValueCountPairList =
  DocumentAttributeValueCountPair[];
export const DocumentAttributeValueCountPairList = S.Array(
  S.suspend(
    (): S.Schema<DocumentAttributeValueCountPair, any> =>
      DocumentAttributeValueCountPair,
  ).annotations({ identifier: "DocumentAttributeValueCountPair" }),
) as any as S.Schema<DocumentAttributeValueCountPairList>;
export interface Correction {
  BeginOffset?: number;
  EndOffset?: number;
  Term?: string;
  CorrectedTerm?: string;
}
export const Correction = S.suspend(() =>
  S.Struct({
    BeginOffset: S.optional(S.Number),
    EndOffset: S.optional(S.Number),
    Term: S.optional(S.String),
    CorrectedTerm: S.optional(S.String),
  }),
).annotations({ identifier: "Correction" }) as any as S.Schema<Correction>;
export type CorrectionList = Correction[];
export const CorrectionList = S.Array(Correction);
export interface Suggestion {
  Id?: string;
  Value?: SuggestionValue;
  SourceDocuments?: SourceDocument[];
}
export const Suggestion = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Value: S.optional(SuggestionValue),
    SourceDocuments: S.optional(SourceDocuments),
  }),
).annotations({ identifier: "Suggestion" }) as any as S.Schema<Suggestion>;
export type SuggestionList = Suggestion[];
export const SuggestionList = S.Array(Suggestion);
export interface FacetResult {
  DocumentAttributeKey?: string;
  DocumentAttributeValueType?: DocumentAttributeValueType;
  DocumentAttributeValueCountPairs?: DocumentAttributeValueCountPair[];
}
export const FacetResult = S.suspend(() =>
  S.Struct({
    DocumentAttributeKey: S.optional(S.String),
    DocumentAttributeValueType: S.optional(DocumentAttributeValueType),
    DocumentAttributeValueCountPairs: S.optional(
      S.suspend(() => DocumentAttributeValueCountPairList).annotations({
        identifier: "DocumentAttributeValueCountPairList",
      }),
    ),
  }),
).annotations({ identifier: "FacetResult" }) as any as S.Schema<FacetResult>;
export type FacetResultList = FacetResult[];
export const FacetResultList = S.Array(
  S.suspend((): S.Schema<FacetResult, any> => FacetResult).annotations({
    identifier: "FacetResult",
  }),
) as any as S.Schema<FacetResultList>;
export interface SpellCorrectedQuery {
  SuggestedQueryText?: string;
  Corrections?: Correction[];
}
export const SpellCorrectedQuery = S.suspend(() =>
  S.Struct({
    SuggestedQueryText: S.optional(S.String),
    Corrections: S.optional(CorrectionList),
  }),
).annotations({
  identifier: "SpellCorrectedQuery",
}) as any as S.Schema<SpellCorrectedQuery>;
export type SpellCorrectedQueryList = SpellCorrectedQuery[];
export const SpellCorrectedQueryList = S.Array(SpellCorrectedQuery);
export interface ExpandedResultItem {
  Id?: string;
  DocumentId?: string;
  DocumentTitle?: TextWithHighlights;
  DocumentExcerpt?: TextWithHighlights;
  DocumentURI?: string;
  DocumentAttributes?: DocumentAttribute[];
}
export const ExpandedResultItem = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    DocumentId: S.optional(S.String),
    DocumentTitle: S.optional(TextWithHighlights),
    DocumentExcerpt: S.optional(TextWithHighlights),
    DocumentURI: S.optional(S.String),
    DocumentAttributes: S.optional(DocumentAttributeList),
  }),
).annotations({
  identifier: "ExpandedResultItem",
}) as any as S.Schema<ExpandedResultItem>;
export type ExpandedResultList = ExpandedResultItem[];
export const ExpandedResultList = S.Array(ExpandedResultItem);
export interface GetQuerySuggestionsResponse {
  QuerySuggestionsId?: string;
  Suggestions?: Suggestion[];
}
export const GetQuerySuggestionsResponse = S.suspend(() =>
  S.Struct({
    QuerySuggestionsId: S.optional(S.String),
    Suggestions: S.optional(SuggestionList),
  }),
).annotations({
  identifier: "GetQuerySuggestionsResponse",
}) as any as S.Schema<GetQuerySuggestionsResponse>;
export interface CollapsedResultDetail {
  DocumentAttribute: DocumentAttribute;
  ExpandedResults?: ExpandedResultItem[];
}
export const CollapsedResultDetail = S.suspend(() =>
  S.Struct({
    DocumentAttribute: DocumentAttribute,
    ExpandedResults: S.optional(ExpandedResultList),
  }),
).annotations({
  identifier: "CollapsedResultDetail",
}) as any as S.Schema<CollapsedResultDetail>;
export interface TableCell {
  Value?: string;
  TopAnswer?: boolean;
  Highlighted?: boolean;
  Header?: boolean;
}
export const TableCell = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String),
    TopAnswer: S.optional(S.Boolean),
    Highlighted: S.optional(S.Boolean),
    Header: S.optional(S.Boolean),
  }),
).annotations({ identifier: "TableCell" }) as any as S.Schema<TableCell>;
export type TableCellList = TableCell[];
export const TableCellList = S.Array(TableCell);
export interface TableRow {
  Cells?: TableCell[];
}
export const TableRow = S.suspend(() =>
  S.Struct({ Cells: S.optional(TableCellList) }),
).annotations({ identifier: "TableRow" }) as any as S.Schema<TableRow>;
export type TableRowList = TableRow[];
export const TableRowList = S.Array(TableRow);
export interface TableExcerpt {
  Rows?: TableRow[];
  TotalNumberOfRows?: number;
}
export const TableExcerpt = S.suspend(() =>
  S.Struct({
    Rows: S.optional(TableRowList),
    TotalNumberOfRows: S.optional(S.Number),
  }),
).annotations({ identifier: "TableExcerpt" }) as any as S.Schema<TableExcerpt>;
export interface QueryResultItem {
  Id?: string;
  Type?: QueryResultType;
  Format?: QueryResultFormat;
  AdditionalAttributes?: AdditionalResultAttribute[];
  DocumentId?: string;
  DocumentTitle?: TextWithHighlights;
  DocumentExcerpt?: TextWithHighlights;
  DocumentURI?: string;
  DocumentAttributes?: DocumentAttribute[];
  ScoreAttributes?: ScoreAttributes;
  FeedbackToken?: string;
  TableExcerpt?: TableExcerpt;
  CollapsedResultDetail?: CollapsedResultDetail;
}
export const QueryResultItem = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.optional(QueryResultType),
    Format: S.optional(QueryResultFormat),
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
  }),
).annotations({
  identifier: "QueryResultItem",
}) as any as S.Schema<QueryResultItem>;
export type QueryResultItemList = QueryResultItem[];
export const QueryResultItemList = S.Array(QueryResultItem);
export interface QueryResult {
  QueryId?: string;
  ResultItems?: QueryResultItem[];
  FacetResults?: FacetResult[];
  TotalNumberOfResults?: number;
  Warnings?: Warning[];
  SpellCorrectedQueries?: SpellCorrectedQuery[];
  FeaturedResultsItems?: FeaturedResultsItem[];
}
export const QueryResult = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    ResultItems: S.optional(QueryResultItemList),
    FacetResults: S.optional(FacetResultList),
    TotalNumberOfResults: S.optional(S.Number),
    Warnings: S.optional(WarningList),
    SpellCorrectedQueries: S.optional(SpellCorrectedQueryList),
    FeaturedResultsItems: S.optional(FeaturedResultsItemList),
  }),
).annotations({ identifier: "QueryResult" }) as any as S.Schema<QueryResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistException extends S.TaggedError<ResourceAlreadyExistException>()(
  "ResourceAlreadyExistException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FeaturedResultsConflictException extends S.TaggedError<FeaturedResultsConflictException>()(
  "FeaturedResultsConflictException",
  {
    Message: S.optional(S.String),
    ConflictingItems: S.optional(ConflictingItems),
  },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Retrieves search metrics data. The data provides a snapshot of how your users interact
 * with your search application and how effective the application is.
 */
export const getSnapshots: {
  (
    input: GetSnapshotsRequest,
  ): effect.Effect<
    GetSnapshotsResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSnapshotsRequest,
  ) => stream.Stream<
    GetSnapshotsResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSnapshotsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSnapshotsRequest,
  output: GetSnapshotsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the Amazon Kendra indexes that you created.
 */
export const listIndices: {
  (
    input: ListIndicesRequest,
  ): effect.Effect<
    ListIndicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIndicesRequest,
  ) => stream.Stream<
    ListIndicesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIndicesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
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
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
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
export const retrieve: (
  input: RetrieveRequest,
) => effect.Effect<
  RetrieveResult,
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
 * Updates a set of featured results. Features results are placed
 * above
 * all other results for certain queries. You map specific queries to specific documents
 * for featuring in the results. If a query contains an exact match of a query, then one
 * or more specific documents are featured in the search results.
 */
export const updateFeaturedResultsSet: (
  input: UpdateFeaturedResultsSetRequest,
) => effect.Effect<
  UpdateFeaturedResultsSetResponse,
  | AccessDeniedException
  | FeaturedResultsConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startDataSourceSyncJob: (
  input: StartDataSourceSyncJobRequest,
) => effect.Effect<
  StartDataSourceSyncJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
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
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of tags associated with a resource. Indexes, FAQs, data sources, and
 * other resources can have tags associated with them.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceUnavailableException
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
    ResourceUnavailableException,
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
export const associateEntitiesToExperience: (
  input: AssociateEntitiesToExperienceRequest,
) => effect.Effect<
  AssociateEntitiesToExperienceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceAlreadyExistException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets information about your Amazon Kendra experience such as a search application.
 * For more information on creating a search application experience,
 * see Building
 * a search experience with no code.
 */
export const describeExperience: (
  input: DescribeExperienceRequest,
) => effect.Effect<
  DescribeExperienceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFeaturedResultsSet: (
  input: DescribeFeaturedResultsSetRequest,
) => effect.Effect<
  DescribeFeaturedResultsSetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFeaturedResultsSetRequest,
  output: DescribeFeaturedResultsSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
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
export const describePrincipalMapping: (
  input: DescribePrincipalMappingRequest,
) => effect.Effect<
  DescribePrincipalMappingResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePrincipalMappingRequest,
  output: DescribePrincipalMappingResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information on the settings of query suggestions for an index.
 *
 * This is used to check the current settings applied
 * to query suggestions.
 *
 * `DescribeQuerySuggestionsConfig` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const describeQuerySuggestionsConfig: (
  input: DescribeQuerySuggestionsConfigRequest,
) => effect.Effect<
  DescribeQuerySuggestionsConfigResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateEntitiesFromExperience: (
  input: DisassociateEntitiesFromExperienceRequest,
) => effect.Effect<
  DisassociateEntitiesFromExperienceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists one or more access control configurations for an index. This includes user and
 * group access information for your documents. This is useful for user context filtering,
 * where search results are filtered based on the user or their group access to
 * documents.
 */
export const listAccessControlConfigurations: {
  (
    input: ListAccessControlConfigurationsRequest,
  ): effect.Effect<
    ListAccessControlConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessControlConfigurationsRequest,
  ) => stream.Stream<
    ListAccessControlConfigurationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessControlConfigurationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessControlConfigurationsRequest,
  output: ListAccessControlConfigurationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the data source connectors that you have created.
 */
export const listDataSources: {
  (
    input: ListDataSourcesRequest,
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
    unknown,
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
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists specific permissions of users and groups with access to your
 * Amazon Kendra experience.
 */
export const listEntityPersonas: {
  (
    input: ListEntityPersonasRequest,
  ): effect.Effect<
    ListEntityPersonasResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEntityPersonasRequest,
  ) => stream.Stream<
    ListEntityPersonasResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEntityPersonasRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEntityPersonasRequest,
  output: ListEntityPersonasResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists one or more Amazon Kendra experiences. You can create an Amazon Kendra experience such
 * as a search application. For more information on creating a search application
 * experience, see Building a
 * search experience with no code.
 */
export const listExperiences: {
  (
    input: ListExperiencesRequest,
  ): effect.Effect<
    ListExperiencesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExperiencesRequest,
  ) => stream.Stream<
    ListExperiencesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExperiencesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExperiencesRequest,
  output: ListExperiencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets a list of FAQs associated with an index.
 */
export const listFaqs: {
  (
    input: ListFaqsRequest,
  ): effect.Effect<
    ListFaqsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFaqsRequest,
  ) => stream.Stream<
    ListFaqsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFaqsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFaqsRequest,
  output: ListFaqsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all your sets of featured results for a given index. Features results
 * are placed above all other results for certain queries. If there's an exact match
 * of a query, then one or more specific documents are featured in the search results.
 */
export const listFeaturedResultsSets: (
  input: ListFeaturedResultsSetsRequest,
) => effect.Effect<
  ListFeaturedResultsSetsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFeaturedResultsSetsRequest,
  output: ListFeaturedResultsSetsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides a list of groups that are mapped to users before a given ordering or
 * timestamp identifier.
 *
 * `ListGroupsOlderThanOrderingId` is currently not supported in the Amazon Web Services GovCloud (US-West) region.
 */
export const listGroupsOlderThanOrderingId: {
  (
    input: ListGroupsOlderThanOrderingIdRequest,
  ): effect.Effect<
    ListGroupsOlderThanOrderingIdResponse,
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
    input: ListGroupsOlderThanOrderingIdRequest,
  ) => stream.Stream<
    ListGroupsOlderThanOrderingIdResponse,
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
    input: ListGroupsOlderThanOrderingIdRequest,
  ) => stream.Stream<
    unknown,
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
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
export const listQuerySuggestionsBlockLists: {
  (
    input: ListQuerySuggestionsBlockListsRequest,
  ): effect.Effect<
    ListQuerySuggestionsBlockListsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQuerySuggestionsBlockListsRequest,
  ) => stream.Stream<
    ListQuerySuggestionsBlockListsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQuerySuggestionsBlockListsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQuerySuggestionsBlockListsRequest,
  output: ListQuerySuggestionsBlockListsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the thesauri for an index.
 */
export const listThesauri: {
  (
    input: ListThesauriRequest,
  ): effect.Effect<
    ListThesauriResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThesauriRequest,
  ) => stream.Stream<
    ListThesauriResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThesauriRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThesauriRequest,
  output: ListThesauriResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
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
export const updateQuerySuggestionsConfig: (
  input: UpdateQuerySuggestionsConfigRequest,
) => effect.Effect<
  UpdateQuerySuggestionsConfigResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an access control configuration that you created for your documents in an
 * index. This includes user and group access information for your documents. This is
 * useful for user context filtering, where search results are filtered based on the user
 * or their group access to documents.
 */
export const deleteAccessControlConfiguration: (
  input: DeleteAccessControlConfigurationRequest,
) => effect.Effect<
  DeleteAccessControlConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDataSource: (
  input: DeleteDataSourceRequest,
) => effect.Effect<
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
 * Deletes your Amazon Kendra experience such as a search application. For more information on
 * creating a search application experience, see Building a search
 * experience with no code.
 */
export const deleteExperience: (
  input: DeleteExperienceRequest,
) => effect.Effect<
  DeleteExperienceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFaq: (
  input: DeleteFaqRequest,
) => effect.Effect<
  DeleteFaqResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteIndex: (
  input: DeleteIndexRequest,
) => effect.Effect<
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
export const deletePrincipalMapping: (
  input: DeletePrincipalMappingRequest,
) => effect.Effect<
  DeletePrincipalMappingResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const deleteQuerySuggestionsBlockList: (
  input: DeleteQuerySuggestionsBlockListRequest,
) => effect.Effect<
  DeleteQuerySuggestionsBlockListResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteThesaurus: (
  input: DeleteThesaurusRequest,
) => effect.Effect<
  DeleteThesaurusResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an Amazon Kendra data source connector.
 */
export const updateDataSource: (
  input: UpdateDataSourceRequest,
) => effect.Effect<
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
 * Updates your Amazon Kendra experience such as a search application. For more information on
 * creating a search application experience, see Building a
 * search experience with no code.
 */
export const updateExperience: (
  input: UpdateExperienceRequest,
) => effect.Effect<
  UpdateExperienceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateQuerySuggestionsBlockList: (
  input: UpdateQuerySuggestionsBlockListRequest,
) => effect.Effect<
  UpdateQuerySuggestionsBlockListResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateThesaurus: (
  input: UpdateThesaurusRequest,
) => effect.Effect<
  UpdateThesaurusResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets information about an Amazon Kendra data source connector.
 */
export const describeDataSource: (
  input: DescribeDataSourceRequest,
) => effect.Effect<
  DescribeDataSourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeFaq: (
  input: DescribeFaqRequest,
) => effect.Effect<
  DescribeFaqResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeQuerySuggestionsBlockList: (
  input: DescribeQuerySuggestionsBlockListRequest,
) => effect.Effect<
  DescribeQuerySuggestionsBlockListResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeThesaurus: (
  input: DescribeThesaurusRequest,
) => effect.Effect<
  DescribeThesaurusResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociatePersonasFromEntities: (
  input: DisassociatePersonasFromEntitiesRequest,
) => effect.Effect<
  DisassociatePersonasFromEntitiesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Enables you to provide feedback to Amazon Kendra to improve the
 * performance of your index.
 *
 * `SubmitFeedback` is currently not supported in the
 * Amazon Web Services GovCloud (US-West) region.
 */
export const submitFeedback: (
  input: SubmitFeedbackRequest,
) => effect.Effect<
  SubmitFeedbackResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ResourceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Stops a synchronization job that is currently running. You can't stop a scheduled
 * synchronization job.
 */
export const stopDataSourceSyncJob: (
  input: StopDataSourceSyncJobRequest,
) => effect.Effect<
  StopDataSourceSyncJobResponse,
  | AccessDeniedException
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more sets of featured results. Features results are placed
 * above all other results for certain queries. If there's an exact match of a
 * query, then one or more specific documents are featured in the search results.
 */
export const batchDeleteFeaturedResultsSet: (
  input: BatchDeleteFeaturedResultsSetRequest,
) => effect.Effect<
  BatchDeleteFeaturedResultsSetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const clearQuerySuggestions: (
  input: ClearQuerySuggestionsRequest,
) => effect.Effect<
  ClearQuerySuggestionsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteDocument: (
  input: BatchDeleteDocumentRequest,
) => effect.Effect<
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
 * Gets information about an access control configuration that you created for your
 * documents in an index. This includes user and group access information for your
 * documents. This is useful for user context filtering, where search results are filtered
 * based on the user or their group access to documents.
 */
export const describeAccessControlConfiguration: (
  input: DescribeAccessControlConfigurationRequest,
) => effect.Effect<
  DescribeAccessControlConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets information about an Amazon Kendra index.
 */
export const describeIndex: (
  input: DescribeIndexRequest,
) => effect.Effect<
  DescribeIndexResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listExperienceEntities: {
  (
    input: ListExperienceEntitiesRequest,
  ): effect.Effect<
    ListExperienceEntitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExperienceEntitiesRequest,
  ) => stream.Stream<
    ListExperienceEntitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExperienceEntitiesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExperienceEntitiesRequest,
  output: ListExperienceEntitiesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
}));
/**
 * Adds the specified tag to the specified index, FAQ, data source, or other resource. If
 * the tag already exists, the existing value is replaced with the new value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes a tag from an index, FAQ, data source, or other resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceUnavailableException
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
    ResourceUnavailableException,
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
export const associatePersonasToEntities: (
  input: AssociatePersonasToEntitiesRequest,
) => effect.Effect<
  AssociatePersonasToEntitiesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceAlreadyExistException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFeaturedResultsSet: (
  input: CreateFeaturedResultsSetRequest,
) => effect.Effect<
  CreateFeaturedResultsSetResponse,
  | AccessDeniedException
  | ConflictException
  | FeaturedResultsConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets statistics about synchronizing a data source connector.
 */
export const listDataSourceSyncJobs: {
  (
    input: ListDataSourceSyncJobsRequest,
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
    unknown,
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
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
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
export const putPrincipalMapping: (
  input: PutPrincipalMappingRequest,
) => effect.Effect<
  PutPrincipalMappingResponse,
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
 * Updates an Amazon Kendra index.
 */
export const updateIndex: (
  input: UpdateIndexRequest,
) => effect.Effect<
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
export const createQuerySuggestionsBlockList: (
  input: CreateQuerySuggestionsBlockListRequest,
) => effect.Effect<
  CreateQuerySuggestionsBlockListResponse,
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
export const createThesaurus: (
  input: CreateThesaurusRequest,
) => effect.Effect<
  CreateThesaurusResponse,
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
export const updateAccessControlConfiguration: (
  input: UpdateAccessControlConfigurationRequest,
) => effect.Effect<
  UpdateAccessControlConfigurationResponse,
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
export const createAccessControlConfiguration: (
  input: CreateAccessControlConfigurationRequest,
) => effect.Effect<
  CreateAccessControlConfigurationResponse,
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
export const createFaq: (
  input: CreateFaqRequest,
) => effect.Effect<
  CreateFaqResponse,
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
 * Creates an Amazon Kendra experience such as a search application. For more information
 * on creating a search application experience, including using the Python and Java SDKs,
 * see Building a
 * search experience with no code.
 */
export const createExperience: (
  input: CreateExperienceRequest,
) => effect.Effect<
  CreateExperienceResponse,
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
export const createIndex: (
  input: CreateIndexRequest,
) => effect.Effect<
  CreateIndexResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceAlreadyExistException
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
    ResourceAlreadyExistException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
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
export const batchGetDocumentStatus: (
  input: BatchGetDocumentStatusRequest,
) => effect.Effect<
  BatchGetDocumentStatusResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const batchPutDocument: (
  input: BatchPutDocumentRequest,
) => effect.Effect<
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
export const createDataSource: (
  input: CreateDataSourceRequest,
) => effect.Effect<
  CreateDataSourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceAlreadyExistException
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
export const getQuerySuggestions: (
  input: GetQuerySuggestionsRequest,
) => effect.Effect<
  GetQuerySuggestionsResponse,
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
export const query: (
  input: QueryRequest,
) => effect.Effect<
  QueryResult,
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
