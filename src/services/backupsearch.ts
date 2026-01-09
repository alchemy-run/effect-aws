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
  sdkId: "BackupSearch",
  serviceShapeName: "CryoBackupSearchService",
});
const auth = T.AwsAuthSigv4({ name: "backup-search" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
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
        if (UseFIPS === true) {
          return e(
            `https://backup-search-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://backup-search.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type GenericId = string;
export type EncryptionKeyArn = string;
export type IamRoleArn = string;
export type RecoveryPoint = string;
export type SearchJobArn = string;
export type ExportJobArn = string;
export type ObjectKey = string | redacted.Redacted<string>;
export type FilePath = string | redacted.Redacted<string>;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type SearchJobState =
  | "RUNNING"
  | "COMPLETED"
  | "STOPPING"
  | "STOPPED"
  | "FAILED"
  | (string & {});
export const SearchJobState = S.String;
export type ExportJobStatus =
  | "RUNNING"
  | "FAILED"
  | "COMPLETED"
  | (string & {});
export const ExportJobStatus = S.String;
export interface ListSearchJobBackupsInput {
  SearchJobIdentifier: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListSearchJobBackupsInput = S.suspend(() =>
  S.Struct({
    SearchJobIdentifier: S.String.pipe(T.HttpLabel("SearchJobIdentifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSearchJobBackupsInput",
}) as any as S.Schema<ListSearchJobBackupsInput>;
export interface ListSearchJobResultsInput {
  SearchJobIdentifier: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListSearchJobResultsInput = S.suspend(() =>
  S.Struct({
    SearchJobIdentifier: S.String.pipe(T.HttpLabel("SearchJobIdentifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSearchJobResultsInput",
}) as any as S.Schema<ListSearchJobResultsInput>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export interface GetSearchJobInput {
  SearchJobIdentifier: string;
}
export const GetSearchJobInput = S.suspend(() =>
  S.Struct({
    SearchJobIdentifier: S.String.pipe(T.HttpLabel("SearchJobIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/search-jobs/{SearchJobIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSearchJobInput",
}) as any as S.Schema<GetSearchJobInput>;
export interface StopSearchJobInput {
  SearchJobIdentifier: string;
}
export const StopSearchJobInput = S.suspend(() =>
  S.Struct({
    SearchJobIdentifier: S.String.pipe(T.HttpLabel("SearchJobIdentifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopSearchJobInput",
}) as any as S.Schema<StopSearchJobInput>;
export interface StopSearchJobOutput {}
export const StopSearchJobOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopSearchJobOutput",
}) as any as S.Schema<StopSearchJobOutput>;
export interface ListSearchJobsInput {
  ByStatus?: SearchJobState;
  NextToken?: string;
  MaxResults?: number;
}
export const ListSearchJobsInput = S.suspend(() =>
  S.Struct({
    ByStatus: S.optional(SearchJobState).pipe(T.HttpQuery("Status")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/search-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSearchJobsInput",
}) as any as S.Schema<ListSearchJobsInput>;
export interface GetSearchResultExportJobInput {
  ExportJobIdentifier: string;
}
export const GetSearchResultExportJobInput = S.suspend(() =>
  S.Struct({
    ExportJobIdentifier: S.String.pipe(T.HttpLabel("ExportJobIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/export-search-jobs/{ExportJobIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSearchResultExportJobInput",
}) as any as S.Schema<GetSearchResultExportJobInput>;
export interface ListSearchResultExportJobsInput {
  Status?: ExportJobStatus;
  SearchJobIdentifier?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListSearchResultExportJobsInput = S.suspend(() =>
  S.Struct({
    Status: S.optional(ExportJobStatus).pipe(T.HttpQuery("Status")),
    SearchJobIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("SearchJobIdentifier"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/export-search-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSearchResultExportJobsInput",
}) as any as S.Schema<ListSearchResultExportJobsInput>;
export type ResourceType = "S3" | "EBS" | (string & {});
export const ResourceType = S.String;
export type ResourceTypeList = ResourceType[];
export const ResourceTypeList = S.Array(ResourceType);
export type ResourceArnList = string[];
export const ResourceArnList = S.Array(S.String);
export type RecoveryPointArnList = string[];
export const RecoveryPointArnList = S.Array(S.String);
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
}).pipe(T.Sparse());
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export interface S3ExportSpecification {
  DestinationBucket: string;
  DestinationPrefix?: string;
}
export const S3ExportSpecification = S.suspend(() =>
  S.Struct({
    DestinationBucket: S.String,
    DestinationPrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ExportSpecification",
}) as any as S.Schema<S3ExportSpecification>;
export type ExportSpecification = {
  s3ExportSpecification: S3ExportSpecification;
};
export const ExportSpecification = S.Union(
  S.Struct({ s3ExportSpecification: S3ExportSpecification }),
);
export interface GetSearchResultExportJobOutput {
  ExportJobIdentifier: string;
  ExportJobArn?: string;
  Status?: ExportJobStatus;
  CreationTime?: Date;
  CompletionTime?: Date;
  StatusMessage?: string;
  ExportSpecification?: ExportSpecification;
  SearchJobArn?: string;
}
export const GetSearchResultExportJobOutput = S.suspend(() =>
  S.Struct({
    ExportJobIdentifier: S.String,
    ExportJobArn: S.optional(S.String),
    Status: S.optional(ExportJobStatus),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StatusMessage: S.optional(S.String),
    ExportSpecification: S.optional(ExportSpecification),
    SearchJobArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSearchResultExportJobOutput",
}) as any as S.Schema<GetSearchResultExportJobOutput>;
export interface BackupCreationTimeFilter {
  CreatedAfter?: Date;
  CreatedBefore?: Date;
}
export const BackupCreationTimeFilter = S.suspend(() =>
  S.Struct({
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "BackupCreationTimeFilter",
}) as any as S.Schema<BackupCreationTimeFilter>;
export type StringConditionOperator =
  | "EQUALS_TO"
  | "NOT_EQUALS_TO"
  | "CONTAINS"
  | "DOES_NOT_CONTAIN"
  | "BEGINS_WITH"
  | "ENDS_WITH"
  | "DOES_NOT_BEGIN_WITH"
  | "DOES_NOT_END_WITH"
  | (string & {});
export const StringConditionOperator = S.String;
export interface StringCondition {
  Value: string;
  Operator?: StringConditionOperator;
}
export const StringCondition = S.suspend(() =>
  S.Struct({ Value: S.String, Operator: S.optional(StringConditionOperator) }),
).annotations({
  identifier: "StringCondition",
}) as any as S.Schema<StringCondition>;
export type StringConditionList = StringCondition[];
export const StringConditionList = S.Array(StringCondition);
export type LongConditionOperator =
  | "EQUALS_TO"
  | "NOT_EQUALS_TO"
  | "LESS_THAN_EQUAL_TO"
  | "GREATER_THAN_EQUAL_TO"
  | (string & {});
export const LongConditionOperator = S.String;
export interface LongCondition {
  Value: number;
  Operator?: LongConditionOperator;
}
export const LongCondition = S.suspend(() =>
  S.Struct({ Value: S.Number, Operator: S.optional(LongConditionOperator) }),
).annotations({
  identifier: "LongCondition",
}) as any as S.Schema<LongCondition>;
export type LongConditionList = LongCondition[];
export const LongConditionList = S.Array(LongCondition);
export type TimeConditionOperator =
  | "EQUALS_TO"
  | "NOT_EQUALS_TO"
  | "LESS_THAN_EQUAL_TO"
  | "GREATER_THAN_EQUAL_TO"
  | (string & {});
export const TimeConditionOperator = S.String;
export interface TimeCondition {
  Value: Date;
  Operator?: TimeConditionOperator;
}
export const TimeCondition = S.suspend(() =>
  S.Struct({
    Value: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Operator: S.optional(TimeConditionOperator),
  }),
).annotations({
  identifier: "TimeCondition",
}) as any as S.Schema<TimeCondition>;
export type TimeConditionList = TimeCondition[];
export const TimeConditionList = S.Array(TimeCondition);
export interface EBSItemFilter {
  FilePaths?: StringCondition[];
  Sizes?: LongCondition[];
  CreationTimes?: TimeCondition[];
  LastModificationTimes?: TimeCondition[];
}
export const EBSItemFilter = S.suspend(() =>
  S.Struct({
    FilePaths: S.optional(StringConditionList),
    Sizes: S.optional(LongConditionList),
    CreationTimes: S.optional(TimeConditionList),
    LastModificationTimes: S.optional(TimeConditionList),
  }),
).annotations({
  identifier: "EBSItemFilter",
}) as any as S.Schema<EBSItemFilter>;
export type EBSItemFilters = EBSItemFilter[];
export const EBSItemFilters = S.Array(EBSItemFilter);
export interface SearchJobBackupsResult {
  Status?: SearchJobState;
  StatusMessage?: string;
  ResourceType?: ResourceType;
  BackupResourceArn?: string;
  SourceResourceArn?: string;
  IndexCreationTime?: Date;
  BackupCreationTime?: Date;
}
export const SearchJobBackupsResult = S.suspend(() =>
  S.Struct({
    Status: S.optional(SearchJobState),
    StatusMessage: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
    BackupResourceArn: S.optional(S.String),
    SourceResourceArn: S.optional(S.String),
    IndexCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BackupCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "SearchJobBackupsResult",
}) as any as S.Schema<SearchJobBackupsResult>;
export type SearchJobBackupsResults = SearchJobBackupsResult[];
export const SearchJobBackupsResults = S.Array(SearchJobBackupsResult);
export interface SearchScope {
  BackupResourceTypes: ResourceType[];
  BackupResourceCreationTime?: BackupCreationTimeFilter;
  SourceResourceArns?: string[];
  BackupResourceArns?: string[];
  BackupResourceTags?: { [key: string]: string | undefined };
}
export const SearchScope = S.suspend(() =>
  S.Struct({
    BackupResourceTypes: ResourceTypeList,
    BackupResourceCreationTime: S.optional(BackupCreationTimeFilter),
    SourceResourceArns: S.optional(ResourceArnList),
    BackupResourceArns: S.optional(RecoveryPointArnList),
    BackupResourceTags: S.optional(TagMap),
  }),
).annotations({ identifier: "SearchScope" }) as any as S.Schema<SearchScope>;
export interface SearchScopeSummary {
  TotalRecoveryPointsToScanCount?: number;
  TotalItemsToScanCount?: number;
}
export const SearchScopeSummary = S.suspend(() =>
  S.Struct({
    TotalRecoveryPointsToScanCount: S.optional(S.Number),
    TotalItemsToScanCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "SearchScopeSummary",
}) as any as S.Schema<SearchScopeSummary>;
export interface CurrentSearchProgress {
  RecoveryPointsScannedCount?: number;
  ItemsScannedCount?: number;
  ItemsMatchedCount?: number;
}
export const CurrentSearchProgress = S.suspend(() =>
  S.Struct({
    RecoveryPointsScannedCount: S.optional(S.Number),
    ItemsScannedCount: S.optional(S.Number),
    ItemsMatchedCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "CurrentSearchProgress",
}) as any as S.Schema<CurrentSearchProgress>;
export interface SearchJobSummary {
  SearchJobIdentifier?: string;
  SearchJobArn?: string;
  Name?: string;
  Status?: SearchJobState;
  CreationTime?: Date;
  CompletionTime?: Date;
  SearchScopeSummary?: SearchScopeSummary;
  StatusMessage?: string;
}
export const SearchJobSummary = S.suspend(() =>
  S.Struct({
    SearchJobIdentifier: S.optional(S.String),
    SearchJobArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(SearchJobState),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SearchScopeSummary: S.optional(SearchScopeSummary),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchJobSummary",
}) as any as S.Schema<SearchJobSummary>;
export type SearchJobs = SearchJobSummary[];
export const SearchJobs = S.Array(SearchJobSummary);
export interface ExportJobSummary {
  ExportJobIdentifier: string;
  ExportJobArn?: string;
  Status?: ExportJobStatus;
  CreationTime?: Date;
  CompletionTime?: Date;
  StatusMessage?: string;
  SearchJobArn?: string;
}
export const ExportJobSummary = S.suspend(() =>
  S.Struct({
    ExportJobIdentifier: S.String,
    ExportJobArn: S.optional(S.String),
    Status: S.optional(ExportJobStatus),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StatusMessage: S.optional(S.String),
    SearchJobArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ExportJobSummary",
}) as any as S.Schema<ExportJobSummary>;
export type ExportJobSummaries = ExportJobSummary[];
export const ExportJobSummaries = S.Array(ExportJobSummary);
export interface ListSearchJobBackupsOutput {
  Results: SearchJobBackupsResult[];
  NextToken?: string;
}
export const ListSearchJobBackupsOutput = S.suspend(() =>
  S.Struct({
    Results: SearchJobBackupsResults,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSearchJobBackupsOutput",
}) as any as S.Schema<ListSearchJobBackupsOutput>;
export interface S3ItemFilter {
  ObjectKeys?: StringCondition[];
  Sizes?: LongCondition[];
  CreationTimes?: TimeCondition[];
  VersionIds?: StringCondition[];
  ETags?: StringCondition[];
}
export const S3ItemFilter = S.suspend(() =>
  S.Struct({
    ObjectKeys: S.optional(StringConditionList),
    Sizes: S.optional(LongConditionList),
    CreationTimes: S.optional(TimeConditionList),
    VersionIds: S.optional(StringConditionList),
    ETags: S.optional(StringConditionList),
  }),
).annotations({ identifier: "S3ItemFilter" }) as any as S.Schema<S3ItemFilter>;
export type S3ItemFilters = S3ItemFilter[];
export const S3ItemFilters = S.Array(S3ItemFilter);
export interface ItemFilters {
  S3ItemFilters?: S3ItemFilter[];
  EBSItemFilters?: EBSItemFilter[];
}
export const ItemFilters = S.suspend(() =>
  S.Struct({
    S3ItemFilters: S.optional(S3ItemFilters),
    EBSItemFilters: S.optional(EBSItemFilters),
  }),
).annotations({ identifier: "ItemFilters" }) as any as S.Schema<ItemFilters>;
export interface GetSearchJobOutput {
  Name?: string;
  SearchScopeSummary?: SearchScopeSummary;
  CurrentSearchProgress?: CurrentSearchProgress;
  StatusMessage?: string;
  EncryptionKeyArn?: string;
  CompletionTime?: Date;
  Status: SearchJobState;
  SearchScope: SearchScope;
  ItemFilters: ItemFilters;
  CreationTime: Date;
  SearchJobIdentifier: string;
  SearchJobArn: string;
}
export const GetSearchJobOutput = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    SearchScopeSummary: S.optional(SearchScopeSummary),
    CurrentSearchProgress: S.optional(CurrentSearchProgress),
    StatusMessage: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: SearchJobState,
    SearchScope: SearchScope,
    ItemFilters: ItemFilters,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    SearchJobIdentifier: S.String,
    SearchJobArn: S.String,
  }),
).annotations({
  identifier: "GetSearchJobOutput",
}) as any as S.Schema<GetSearchJobOutput>;
export interface ListSearchJobsOutput {
  SearchJobs: SearchJobSummary[];
  NextToken?: string;
}
export const ListSearchJobsOutput = S.suspend(() =>
  S.Struct({ SearchJobs: SearchJobs, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSearchJobsOutput",
}) as any as S.Schema<ListSearchJobsOutput>;
export interface StartSearchResultExportJobInput {
  SearchJobIdentifier: string;
  ExportSpecification: ExportSpecification;
  ClientToken?: string;
  Tags?: { [key: string]: string | undefined };
  RoleArn?: string;
}
export const StartSearchResultExportJobInput = S.suspend(() =>
  S.Struct({
    SearchJobIdentifier: S.String,
    ExportSpecification: ExportSpecification,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagMap),
    RoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/export-search-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSearchResultExportJobInput",
}) as any as S.Schema<StartSearchResultExportJobInput>;
export interface ListSearchResultExportJobsOutput {
  ExportJobs: ExportJobSummary[];
  NextToken?: string;
}
export const ListSearchResultExportJobsOutput = S.suspend(() =>
  S.Struct({ ExportJobs: ExportJobSummaries, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSearchResultExportJobsOutput",
}) as any as S.Schema<ListSearchResultExportJobsOutput>;
export interface S3ResultItem {
  BackupResourceArn?: string;
  SourceResourceArn?: string;
  BackupVaultName?: string;
  ObjectKey?: string | redacted.Redacted<string>;
  ObjectSize?: number;
  CreationTime?: Date;
  ETag?: string;
  VersionId?: string;
}
export const S3ResultItem = S.suspend(() =>
  S.Struct({
    BackupResourceArn: S.optional(S.String),
    SourceResourceArn: S.optional(S.String),
    BackupVaultName: S.optional(S.String),
    ObjectKey: S.optional(SensitiveString),
    ObjectSize: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ETag: S.optional(S.String),
    VersionId: S.optional(S.String),
  }),
).annotations({ identifier: "S3ResultItem" }) as any as S.Schema<S3ResultItem>;
export interface EBSResultItem {
  BackupResourceArn?: string;
  SourceResourceArn?: string;
  BackupVaultName?: string;
  FileSystemIdentifier?: string;
  FilePath?: string | redacted.Redacted<string>;
  FileSize?: number;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const EBSResultItem = S.suspend(() =>
  S.Struct({
    BackupResourceArn: S.optional(S.String),
    SourceResourceArn: S.optional(S.String),
    BackupVaultName: S.optional(S.String),
    FileSystemIdentifier: S.optional(S.String),
    FilePath: S.optional(SensitiveString),
    FileSize: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "EBSResultItem",
}) as any as S.Schema<EBSResultItem>;
export type ResultItem =
  | { S3ResultItem: S3ResultItem; EBSResultItem?: never }
  | { S3ResultItem?: never; EBSResultItem: EBSResultItem };
export const ResultItem = S.Union(
  S.Struct({ S3ResultItem: S3ResultItem }),
  S.Struct({ EBSResultItem: EBSResultItem }),
);
export type Results = ResultItem[];
export const Results = S.Array(ResultItem);
export interface ListSearchJobResultsOutput {
  Results: ResultItem[];
  NextToken?: string;
}
export const ListSearchJobResultsOutput = S.suspend(() =>
  S.Struct({ Results: Results, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSearchJobResultsOutput",
}) as any as S.Schema<ListSearchJobResultsOutput>;
export interface StartSearchJobInput {
  Tags?: { [key: string]: string | undefined };
  Name?: string;
  EncryptionKeyArn?: string;
  ClientToken?: string;
  SearchScope: SearchScope;
  ItemFilters?: ItemFilters;
}
export const StartSearchJobInput = S.suspend(() =>
  S.Struct({
    Tags: S.optional(TagMap),
    Name: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    ClientToken: S.optional(S.String),
    SearchScope: SearchScope,
    ItemFilters: S.optional(ItemFilters),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/search-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSearchJobInput",
}) as any as S.Schema<StartSearchJobInput>;
export interface StartSearchResultExportJobOutput {
  ExportJobArn?: string;
  ExportJobIdentifier: string;
}
export const StartSearchResultExportJobOutput = S.suspend(() =>
  S.Struct({
    ExportJobArn: S.optional(S.String),
    ExportJobIdentifier: S.String,
  }),
).annotations({
  identifier: "StartSearchResultExportJobOutput",
}) as any as S.Schema<StartSearchResultExportJobOutput>;
export interface StartSearchJobOutput {
  SearchJobArn?: string;
  CreationTime?: Date;
  SearchJobIdentifier?: string;
}
export const StartSearchJobOutput = S.suspend(() =>
  S.Struct({
    SearchJobArn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SearchJobIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "StartSearchJobOutput",
}) as any as S.Schema<StartSearchJobOutput>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * This operation removes tags from the specified resource.
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
 * This operations ends a search job.
 *
 * Only a search job with a status of `RUNNING` can be stopped.
 */
export const stopSearchJob: (
  input: StopSearchJobInput,
) => effect.Effect<
  StopSearchJobOutput,
  ConflictException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSearchResultExportJob: (
  input: GetSearchResultExportJobInput,
) => effect.Effect<
  GetSearchResultExportJobOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSearchResultExportJobInput,
  output: GetSearchResultExportJobOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * This operation returns the tags for a resource type.
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
 * This operation puts tags on the resource you indicate.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSearchJobBackups: {
  (
    input: ListSearchJobBackupsInput,
  ): effect.Effect<
    ListSearchJobBackupsOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSearchJobBackupsInput,
  ) => stream.Stream<
    ListSearchJobBackupsOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSearchJobBackupsInput,
  ) => stream.Stream<
    SearchJobBackupsResult,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getSearchJob: (
  input: GetSearchJobInput,
) => effect.Effect<
  GetSearchJobOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSearchJobInput,
  output: GetSearchJobOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * This operation returns a list of search jobs belonging to an account.
 */
export const listSearchJobs: {
  (
    input: ListSearchJobsInput,
  ): effect.Effect<
    ListSearchJobsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSearchJobsInput,
  ) => stream.Stream<
    ListSearchJobsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSearchJobsInput,
  ) => stream.Stream<
    SearchJobSummary,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSearchJobsInput,
  output: ListSearchJobsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SearchJobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation returns a list of a specified search job.
 */
export const listSearchJobResults: {
  (
    input: ListSearchJobResultsInput,
  ): effect.Effect<
    ListSearchJobResultsOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSearchJobResultsInput,
  ) => stream.Stream<
    ListSearchJobResultsOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSearchJobResultsInput,
  ) => stream.Stream<
    ResultItem,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSearchResultExportJobs: {
  (
    input: ListSearchResultExportJobsInput,
  ): effect.Effect<
    ListSearchResultExportJobsOutput,
    ResourceNotFoundException | ServiceQuotaExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSearchResultExportJobsInput,
  ) => stream.Stream<
    ListSearchResultExportJobsOutput,
    ResourceNotFoundException | ServiceQuotaExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSearchResultExportJobsInput,
  ) => stream.Stream<
    ExportJobSummary,
    ResourceNotFoundException | ServiceQuotaExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startSearchResultExportJob: (
  input: StartSearchResultExportJobInput,
) => effect.Effect<
  StartSearchResultExportJobOutput,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSearchResultExportJobInput,
  output: StartSearchResultExportJobOutput,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * This operation creates a search job which returns recovery points filtered by SearchScope and items filtered by ItemFilters.
 *
 * You can optionally include ClientToken, EncryptionKeyArn, Name, and/or Tags.
 */
export const startSearchJob: (
  input: StartSearchJobInput,
) => effect.Effect<
  StartSearchJobOutput,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSearchJobInput,
  output: StartSearchJobOutput,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
