import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "BackupSearch",
  serviceShapeName: "CryoBackupSearchService",
});
const auth = T.AwsAuthSigv4({ name: "backup-search" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      rules: [
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
                  ],
                  endpoint: {
                    url: "https://backup-search-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://backup-search.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeys = S.Array(S.String);
export class ListSearchJobBackupsInput extends S.Class<ListSearchJobBackupsInput>(
  "ListSearchJobBackupsInput",
)(
  {
    SearchJobIdentifier: S.String.pipe(T.HttpLabel("SearchJobIdentifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/search-jobs/{SearchJobIdentifier}/backups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSearchJobResultsInput extends S.Class<ListSearchJobResultsInput>(
  "ListSearchJobResultsInput",
)(
  {
    SearchJobIdentifier: S.String.pipe(T.HttpLabel("SearchJobIdentifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/search-jobs/{SearchJobIdentifier}/search-results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export class GetSearchJobInput extends S.Class<GetSearchJobInput>(
  "GetSearchJobInput",
)(
  { SearchJobIdentifier: S.String.pipe(T.HttpLabel("SearchJobIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/search-jobs/{SearchJobIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSearchJobInput extends S.Class<StopSearchJobInput>(
  "StopSearchJobInput",
)(
  { SearchJobIdentifier: S.String.pipe(T.HttpLabel("SearchJobIdentifier")) },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/search-jobs/{SearchJobIdentifier}/actions/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSearchJobOutput extends S.Class<StopSearchJobOutput>(
  "StopSearchJobOutput",
)({}) {}
export class ListSearchJobsInput extends S.Class<ListSearchJobsInput>(
  "ListSearchJobsInput",
)(
  {
    ByStatus: S.optional(S.String).pipe(T.HttpQuery("Status")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/search-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSearchResultExportJobInput extends S.Class<GetSearchResultExportJobInput>(
  "GetSearchResultExportJobInput",
)(
  { ExportJobIdentifier: S.String.pipe(T.HttpLabel("ExportJobIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/export-search-jobs/{ExportJobIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSearchResultExportJobsInput extends S.Class<ListSearchResultExportJobsInput>(
  "ListSearchResultExportJobsInput",
)(
  {
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
    SearchJobIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("SearchJobIdentifier"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/export-search-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResourceTypeList = S.Array(S.String);
export const ResourceArnList = S.Array(S.String);
export const RecoveryPointArnList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String }).pipe(
  T.Sparse(),
);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export class S3ExportSpecification extends S.Class<S3ExportSpecification>(
  "S3ExportSpecification",
)({ DestinationBucket: S.String, DestinationPrefix: S.optional(S.String) }) {}
export const ExportSpecification = S.Union(
  S.Struct({ s3ExportSpecification: S3ExportSpecification }),
);
export class GetSearchResultExportJobOutput extends S.Class<GetSearchResultExportJobOutput>(
  "GetSearchResultExportJobOutput",
)({
  ExportJobIdentifier: S.String,
  ExportJobArn: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StatusMessage: S.optional(S.String),
  ExportSpecification: S.optional(ExportSpecification),
  SearchJobArn: S.optional(S.String),
}) {}
export class BackupCreationTimeFilter extends S.Class<BackupCreationTimeFilter>(
  "BackupCreationTimeFilter",
)({
  CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class StringCondition extends S.Class<StringCondition>(
  "StringCondition",
)({ Value: S.String, Operator: S.optional(S.String) }) {}
export const StringConditionList = S.Array(StringCondition);
export class LongCondition extends S.Class<LongCondition>("LongCondition")({
  Value: S.Number,
  Operator: S.optional(S.String),
}) {}
export const LongConditionList = S.Array(LongCondition);
export class TimeCondition extends S.Class<TimeCondition>("TimeCondition")({
  Value: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Operator: S.optional(S.String),
}) {}
export const TimeConditionList = S.Array(TimeCondition);
export class EBSItemFilter extends S.Class<EBSItemFilter>("EBSItemFilter")({
  FilePaths: S.optional(StringConditionList),
  Sizes: S.optional(LongConditionList),
  CreationTimes: S.optional(TimeConditionList),
  LastModificationTimes: S.optional(TimeConditionList),
}) {}
export const EBSItemFilters = S.Array(EBSItemFilter);
export class SearchJobBackupsResult extends S.Class<SearchJobBackupsResult>(
  "SearchJobBackupsResult",
)({
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  ResourceType: S.optional(S.String),
  BackupResourceArn: S.optional(S.String),
  SourceResourceArn: S.optional(S.String),
  IndexCreationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  BackupCreationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const SearchJobBackupsResults = S.Array(SearchJobBackupsResult);
export class SearchScope extends S.Class<SearchScope>("SearchScope")({
  BackupResourceTypes: ResourceTypeList,
  BackupResourceCreationTime: S.optional(BackupCreationTimeFilter),
  SourceResourceArns: S.optional(ResourceArnList),
  BackupResourceArns: S.optional(RecoveryPointArnList),
  BackupResourceTags: S.optional(TagMap),
}) {}
export class SearchScopeSummary extends S.Class<SearchScopeSummary>(
  "SearchScopeSummary",
)({
  TotalRecoveryPointsToScanCount: S.optional(S.Number),
  TotalItemsToScanCount: S.optional(S.Number),
}) {}
export class CurrentSearchProgress extends S.Class<CurrentSearchProgress>(
  "CurrentSearchProgress",
)({
  RecoveryPointsScannedCount: S.optional(S.Number),
  ItemsScannedCount: S.optional(S.Number),
  ItemsMatchedCount: S.optional(S.Number),
}) {}
export class SearchJobSummary extends S.Class<SearchJobSummary>(
  "SearchJobSummary",
)({
  SearchJobIdentifier: S.optional(S.String),
  SearchJobArn: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SearchScopeSummary: S.optional(SearchScopeSummary),
  StatusMessage: S.optional(S.String),
}) {}
export const SearchJobs = S.Array(SearchJobSummary);
export class ExportJobSummary extends S.Class<ExportJobSummary>(
  "ExportJobSummary",
)({
  ExportJobIdentifier: S.String,
  ExportJobArn: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StatusMessage: S.optional(S.String),
  SearchJobArn: S.optional(S.String),
}) {}
export const ExportJobSummaries = S.Array(ExportJobSummary);
export class ListSearchJobBackupsOutput extends S.Class<ListSearchJobBackupsOutput>(
  "ListSearchJobBackupsOutput",
)({ Results: SearchJobBackupsResults, NextToken: S.optional(S.String) }) {}
export class S3ItemFilter extends S.Class<S3ItemFilter>("S3ItemFilter")({
  ObjectKeys: S.optional(StringConditionList),
  Sizes: S.optional(LongConditionList),
  CreationTimes: S.optional(TimeConditionList),
  VersionIds: S.optional(StringConditionList),
  ETags: S.optional(StringConditionList),
}) {}
export const S3ItemFilters = S.Array(S3ItemFilter);
export class ItemFilters extends S.Class<ItemFilters>("ItemFilters")({
  S3ItemFilters: S.optional(S3ItemFilters),
  EBSItemFilters: S.optional(EBSItemFilters),
}) {}
export class GetSearchJobOutput extends S.Class<GetSearchJobOutput>(
  "GetSearchJobOutput",
)({
  Name: S.optional(S.String),
  SearchScopeSummary: S.optional(SearchScopeSummary),
  CurrentSearchProgress: S.optional(CurrentSearchProgress),
  StatusMessage: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.String,
  SearchScope: SearchScope,
  ItemFilters: ItemFilters,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  SearchJobIdentifier: S.String,
  SearchJobArn: S.String,
}) {}
export class ListSearchJobsOutput extends S.Class<ListSearchJobsOutput>(
  "ListSearchJobsOutput",
)({ SearchJobs: SearchJobs, NextToken: S.optional(S.String) }) {}
export class StartSearchResultExportJobInput extends S.Class<StartSearchResultExportJobInput>(
  "StartSearchResultExportJobInput",
)(
  {
    SearchJobIdentifier: S.String,
    ExportSpecification: ExportSpecification,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagMap),
    RoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/export-search-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSearchResultExportJobsOutput extends S.Class<ListSearchResultExportJobsOutput>(
  "ListSearchResultExportJobsOutput",
)({ ExportJobs: ExportJobSummaries, NextToken: S.optional(S.String) }) {}
export class S3ResultItem extends S.Class<S3ResultItem>("S3ResultItem")({
  BackupResourceArn: S.optional(S.String),
  SourceResourceArn: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
  ObjectKey: S.optional(S.String),
  ObjectSize: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ETag: S.optional(S.String),
  VersionId: S.optional(S.String),
}) {}
export class EBSResultItem extends S.Class<EBSResultItem>("EBSResultItem")({
  BackupResourceArn: S.optional(S.String),
  SourceResourceArn: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
  FileSystemIdentifier: S.optional(S.String),
  FilePath: S.optional(S.String),
  FileSize: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ResultItem = S.Union(
  S.Struct({ S3ResultItem: S3ResultItem }),
  S.Struct({ EBSResultItem: EBSResultItem }),
);
export const Results = S.Array(ResultItem);
export class ListSearchJobResultsOutput extends S.Class<ListSearchJobResultsOutput>(
  "ListSearchJobResultsOutput",
)({ Results: Results, NextToken: S.optional(S.String) }) {}
export class StartSearchJobInput extends S.Class<StartSearchJobInput>(
  "StartSearchJobInput",
)(
  {
    Tags: S.optional(TagMap),
    Name: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    ClientToken: S.optional(S.String),
    SearchScope: SearchScope,
    ItemFilters: S.optional(ItemFilters),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/search-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartSearchResultExportJobOutput extends S.Class<StartSearchResultExportJobOutput>(
  "StartSearchResultExportJobOutput",
)({ ExportJobArn: S.optional(S.String), ExportJobIdentifier: S.String }) {}
export class StartSearchJobOutput extends S.Class<StartSearchJobOutput>(
  "StartSearchJobOutput",
)({
  SearchJobArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SearchJobIdentifier: S.optional(S.String),
}) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}

//# Operations
/**
 * This operation removes tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * This operations ends a search job.
 *
 * Only a search job with a status of `RUNNING` can be stopped.
 */
export const stopSearchJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopSearchJobInput,
  output: StopSearchJobOutput,
  errors: [ConflictException, ResourceNotFoundException],
}));
/**
 * This operation retrieves the metadata of an export job.
 *
 * An export job is an operation that transmits the results of a search job to a specified S3 bucket in a .csv file.
 *
 * An export job allows you to retain results of a search beyond the search job's scheduled retention of 7 days.
 */
export const getSearchResultExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSearchResultExportJobInput,
    output: GetSearchResultExportJobOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * This operation returns the tags for a resource type.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * This operation puts tags on the resource you indicate.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * This operation returns a list of all backups (recovery points) in a paginated format that were included in the search job.
 *
 * If a search does not display an expected backup in the results, you can call this operation to display each backup included in the search. Any backups that were not included because they have a `FAILED` status from a permissions issue will be displayed, along with a status message.
 *
 * Only recovery points with a backup index that has a status of `ACTIVE` will be included in search results. If the index has any other status, its status will be displayed along with a status message.
 */
export const listSearchJobBackups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSearchJobBackupsInput,
    output: ListSearchJobBackupsOutput,
    errors: [ResourceNotFoundException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Results",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This operation retrieves metadata of a search job, including its progress.
 */
export const getSearchJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSearchJobInput,
  output: GetSearchJobOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * This operation returns a list of search jobs belonging to an account.
 */
export const listSearchJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSearchJobsInput,
    output: ListSearchJobsOutput,
    errors: [],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "SearchJobs",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This operation returns a list of a specified search job.
 */
export const listSearchJobResults =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSearchJobResultsInput,
    output: ListSearchJobResultsOutput,
    errors: [ResourceNotFoundException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Results",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This operation exports search results of a search job to a specified destination S3 bucket.
 */
export const listSearchResultExportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSearchResultExportJobsInput,
    output: ListSearchResultExportJobsOutput,
    errors: [ResourceNotFoundException, ServiceQuotaExceededException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ExportJobs",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This operations starts a job to export the results of search job to a designated S3 bucket.
 */
export const startSearchResultExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartSearchResultExportJobInput,
    output: StartSearchResultExportJobOutput,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
    ],
  }),
);
/**
 * This operation creates a search job which returns recovery points filtered by SearchScope and items filtered by ItemFilters.
 *
 * You can optionally include ClientToken, EncryptionKeyArn, Name, and/or Tags.
 */
export const startSearchJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSearchJobInput,
  output: StartSearchJobOutput,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
