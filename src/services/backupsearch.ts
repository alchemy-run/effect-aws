import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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
    SearchJobIdentifier: S.String.pipe(T.HttpLabel()),
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
    SearchJobIdentifier: S.String.pipe(T.HttpLabel()),
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
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
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
    ResourceArn: S.String.pipe(T.HttpLabel()),
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
export const TagMap = S.Record({ key: S.String, value: S.String });
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: TagMap },
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
export class ListSearchJobBackupsOutput extends S.Class<ListSearchJobBackupsOutput>(
  "ListSearchJobBackupsOutput",
)({ Results: SearchJobBackupsResults, NextToken: S.optional(S.String) }) {}
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

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}

//# Operations
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
 * This operation removes tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * This operation returns a list of all backups (recovery points) in a paginated format that were included in the search job.
 *
 * If a search does not display an expected backup in the results, you can call this operation to display each backup included in the search. Any backups that were not included because they have a `FAILED` status from a permissions issue will be displayed, along with a status message.
 *
 * Only recovery points with a backup index that has a status of `ACTIVE` will be included in search results. If the index has any other status, its status will be displayed along with a status message.
 */
export const listSearchJobBackups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSearchJobBackupsInput,
    output: ListSearchJobBackupsOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * This operation returns a list of a specified search job.
 */
export const listSearchJobResults = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSearchJobResultsInput,
    output: ListSearchJobResultsOutput,
    errors: [ResourceNotFoundException],
  }),
);
