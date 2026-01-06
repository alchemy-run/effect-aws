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
const ns = T.XmlNamespace("http://cloudsearch.amazonaws.com/doc/2013-01-01/");
const svc = T.AwsApiService({
  sdkId: "CloudSearch Domain",
  serviceShapeName: "AmazonCloudSearch2013",
});
const auth = T.AwsAuthSigv4({ name: "cloudsearch" });
const ver = T.ServiceVersion("2013-01-01");
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
                        url: "https://cloudsearchdomain-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cloudsearchdomain-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cloudsearchdomain.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cloudsearchdomain.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type Cursor = string;
export type Expr = string;
export type Facet = string;
export type FilterQuery = string;
export type Highlight = string;
export type Query = string;
export type QueryOptions = string;
export type Return = string;
export type Size = number;
export type Sort = string;
export type Start = number;
export type Stat = string;
export type Suggester = string;
export type SuggestionsSize = number;
export type Adds = number;
export type Deletes = number;
export type Long = number;
export type Double = number;

//# Schemas
export interface SearchRequest {
  cursor?: string;
  expr?: string;
  facet?: string;
  filterQuery?: string;
  highlight?: string;
  partial?: boolean;
  query: string;
  queryOptions?: string;
  queryParser?: string;
  return?: string;
  size?: number;
  sort?: string;
  start?: number;
  stats?: string;
}
export const SearchRequest = S.suspend(() =>
  S.Struct({
    cursor: S.optional(S.String).pipe(T.HttpQuery("cursor")),
    expr: S.optional(S.String).pipe(T.HttpQuery("expr")),
    facet: S.optional(S.String).pipe(T.HttpQuery("facet")),
    filterQuery: S.optional(S.String).pipe(T.HttpQuery("fq")),
    highlight: S.optional(S.String).pipe(T.HttpQuery("highlight")),
    partial: S.optional(S.Boolean).pipe(T.HttpQuery("partial")),
    query: S.String.pipe(T.HttpQuery("q")),
    queryOptions: S.optional(S.String).pipe(T.HttpQuery("q.options")),
    queryParser: S.optional(S.String).pipe(T.HttpQuery("q.parser")),
    return: S.optional(S.String).pipe(T.HttpQuery("return")),
    size: S.optional(S.Number).pipe(T.HttpQuery("size")),
    sort: S.optional(S.String).pipe(T.HttpQuery("sort")),
    start: S.optional(S.Number).pipe(T.HttpQuery("start")),
    stats: S.optional(S.String).pipe(T.HttpQuery("stats")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-01-01/search?format=sdk&pretty=true",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchRequest",
}) as any as S.Schema<SearchRequest>;
export interface SuggestRequest {
  query: string;
  suggester: string;
  size?: number;
}
export const SuggestRequest = S.suspend(() =>
  S.Struct({
    query: S.String.pipe(T.HttpQuery("q")),
    suggester: S.String.pipe(T.HttpQuery("suggester")),
    size: S.optional(S.Number).pipe(T.HttpQuery("size")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/2013-01-01/suggest?format=sdk&pretty=true",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SuggestRequest",
}) as any as S.Schema<SuggestRequest>;
export interface UploadDocumentsRequest {
  documents: T.StreamingInputBody;
  contentType: string;
}
export const UploadDocumentsRequest = S.suspend(() =>
  S.Struct({
    documents: T.StreamingInput.pipe(T.HttpPayload()),
    contentType: S.String.pipe(T.HttpHeader("Content-Type")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2013-01-01/documents/batch?format=sdk" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UploadDocumentsRequest",
}) as any as S.Schema<UploadDocumentsRequest>;
export interface SearchStatus {
  timems?: number;
  rid?: string;
}
export const SearchStatus = S.suspend(() =>
  S.Struct({ timems: S.optional(S.Number), rid: S.optional(S.String) }),
).annotations({ identifier: "SearchStatus" }) as any as S.Schema<SearchStatus>;
export interface SuggestStatus {
  timems?: number;
  rid?: string;
}
export const SuggestStatus = S.suspend(() =>
  S.Struct({ timems: S.optional(S.Number), rid: S.optional(S.String) }),
).annotations({
  identifier: "SuggestStatus",
}) as any as S.Schema<SuggestStatus>;
export interface DocumentServiceWarning {
  message?: string;
}
export const DocumentServiceWarning = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "DocumentServiceWarning",
}) as any as S.Schema<DocumentServiceWarning>;
export type DocumentServiceWarnings = DocumentServiceWarning[];
export const DocumentServiceWarnings = S.Array(DocumentServiceWarning);
export interface UploadDocumentsResponse {
  status?: string;
  adds?: number;
  deletes?: number;
  warnings?: DocumentServiceWarnings;
}
export const UploadDocumentsResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    adds: S.optional(S.Number),
    deletes: S.optional(S.Number),
    warnings: S.optional(DocumentServiceWarnings),
  }).pipe(ns),
).annotations({
  identifier: "UploadDocumentsResponse",
}) as any as S.Schema<UploadDocumentsResponse>;
export interface FieldStats {
  min?: string;
  max?: string;
  count?: number;
  missing?: number;
  sum?: number;
  sumOfSquares?: number;
  mean?: string;
  stddev?: number;
}
export const FieldStats = S.suspend(() =>
  S.Struct({
    min: S.optional(S.String),
    max: S.optional(S.String),
    count: S.optional(S.Number),
    missing: S.optional(S.Number),
    sum: S.optional(S.Number),
    sumOfSquares: S.optional(S.Number),
    mean: S.optional(S.String),
    stddev: S.optional(S.Number),
  }),
).annotations({ identifier: "FieldStats" }) as any as S.Schema<FieldStats>;
export interface SuggestionMatch {
  suggestion?: string;
  score?: number;
  id?: string;
}
export const SuggestionMatch = S.suspend(() =>
  S.Struct({
    suggestion: S.optional(S.String),
    score: S.optional(S.Number),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "SuggestionMatch",
}) as any as S.Schema<SuggestionMatch>;
export type Suggestions = SuggestionMatch[];
export const Suggestions = S.Array(SuggestionMatch);
export type FieldValue = string[];
export const FieldValue = S.Array(S.String);
export type Stats = { [key: string]: FieldStats };
export const Stats = S.Record({ key: S.String, value: FieldStats });
export interface SuggestModel {
  query?: string;
  found?: number;
  suggestions?: Suggestions;
}
export const SuggestModel = S.suspend(() =>
  S.Struct({
    query: S.optional(S.String),
    found: S.optional(S.Number),
    suggestions: S.optional(Suggestions),
  }),
).annotations({ identifier: "SuggestModel" }) as any as S.Schema<SuggestModel>;
export type Fields = { [key: string]: FieldValue };
export const Fields = S.Record({ key: S.String, value: FieldValue });
export type Exprs = { [key: string]: string };
export const Exprs = S.Record({ key: S.String, value: S.String });
export type Highlights = { [key: string]: string };
export const Highlights = S.Record({ key: S.String, value: S.String });
export interface Bucket {
  value?: string;
  count?: number;
}
export const Bucket = S.suspend(() =>
  S.Struct({ value: S.optional(S.String), count: S.optional(S.Number) }),
).annotations({ identifier: "Bucket" }) as any as S.Schema<Bucket>;
export type BucketList = Bucket[];
export const BucketList = S.Array(Bucket);
export interface SuggestResponse {
  status?: SuggestStatus;
  suggest?: SuggestModel;
}
export const SuggestResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(SuggestStatus),
    suggest: S.optional(SuggestModel),
  }).pipe(ns),
).annotations({
  identifier: "SuggestResponse",
}) as any as S.Schema<SuggestResponse>;
export interface Hit {
  id?: string;
  fields?: Fields;
  exprs?: Exprs;
  highlights?: Highlights;
}
export const Hit = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    fields: S.optional(Fields),
    exprs: S.optional(Exprs),
    highlights: S.optional(Highlights),
  }),
).annotations({ identifier: "Hit" }) as any as S.Schema<Hit>;
export type HitList = Hit[];
export const HitList = S.Array(Hit);
export interface BucketInfo {
  buckets?: BucketList;
}
export const BucketInfo = S.suspend(() =>
  S.Struct({ buckets: S.optional(BucketList) }),
).annotations({ identifier: "BucketInfo" }) as any as S.Schema<BucketInfo>;
export interface Hits {
  found?: number;
  start?: number;
  cursor?: string;
  hit?: HitList;
}
export const Hits = S.suspend(() =>
  S.Struct({
    found: S.optional(S.Number),
    start: S.optional(S.Number),
    cursor: S.optional(S.String),
    hit: S.optional(HitList),
  }),
).annotations({ identifier: "Hits" }) as any as S.Schema<Hits>;
export type Facets = { [key: string]: BucketInfo };
export const Facets = S.Record({ key: S.String, value: BucketInfo });
export interface SearchResponse {
  status?: SearchStatus;
  hits?: Hits;
  facets?: Facets;
  stats?: Stats;
}
export const SearchResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(SearchStatus),
    hits: S.optional(Hits),
    facets: S.optional(Facets),
    stats: S.optional(Stats),
  }).pipe(ns),
).annotations({
  identifier: "SearchResponse",
}) as any as S.Schema<SearchResponse>;

//# Errors
export class DocumentServiceException extends S.TaggedError<DocumentServiceException>()(
  "DocumentServiceException",
  { status: S.optional(S.String), message: S.optional(S.String) },
) {}
export class SearchException extends S.TaggedError<SearchException>()(
  "SearchException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Posts a batch of documents to a search domain for indexing. A document batch is a collection of add and delete operations that represent the documents you want to add, update, or delete from your domain. Batches can be described in either JSON or XML. Each item that you want Amazon CloudSearch to return as a search result (such as a product) is represented as a document. Every document has a unique ID and one or more fields that contain the data that you want to search and return in results. Individual documents cannot contain more than 1 MB of data. The entire batch cannot exceed 5 MB. To get the best possible upload performance, group add and delete operations in batches that are close the 5 MB limit. Submitting a large volume of single-document batches can overload a domain's document service.
 *
 * The endpoint for submitting `UploadDocuments` requests is domain-specific. To get the document endpoint for your domain, use the Amazon CloudSearch configuration service `DescribeDomains` action. A domain's endpoints are also displayed on the domain dashboard in the Amazon CloudSearch console.
 *
 * For more information about formatting your data for Amazon CloudSearch, see Preparing Your Data in the *Amazon CloudSearch Developer Guide*.
 * For more information about uploading data for indexing, see Uploading Data in the *Amazon CloudSearch Developer Guide*.
 */
export const uploadDocuments: (
  input: UploadDocumentsRequest,
) => Effect.Effect<
  UploadDocumentsResponse,
  DocumentServiceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadDocumentsRequest,
  output: UploadDocumentsResponse,
  errors: [DocumentServiceException],
}));
/**
 * Retrieves autocomplete suggestions for a partial query string. You can use suggestions enable you to display likely matches before users finish typing. In Amazon CloudSearch, suggestions are based on the contents of a particular text field. When you request suggestions, Amazon CloudSearch finds all of the documents whose values in the suggester field start with the specified query string. The beginning of the field must match the query string to be considered a match.
 *
 * For more information about configuring suggesters and retrieving suggestions, see Getting Suggestions in the *Amazon CloudSearch Developer Guide*.
 *
 * The endpoint for submitting `Suggest` requests is domain-specific. You submit suggest requests to a domain's search endpoint. To get the search endpoint for your domain, use the Amazon CloudSearch configuration service `DescribeDomains` action. A domain's endpoints are also displayed on the domain dashboard in the Amazon CloudSearch console.
 */
export const suggest: (
  input: SuggestRequest,
) => Effect.Effect<
  SuggestResponse,
  SearchException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SuggestRequest,
  output: SuggestResponse,
  errors: [SearchException],
}));
/**
 * Retrieves a list of documents that match the specified search criteria. How you specify the search criteria depends on which query parser you use. Amazon CloudSearch supports four query parsers:
 *
 * - `simple`: search all `text` and `text-array` fields for the specified string. Search for phrases, individual terms, and prefixes.
 *
 * - `structured`: search specific fields, construct compound queries using Boolean operators, and use advanced features such as term boosting and proximity searching.
 *
 * - `lucene`: specify search criteria using the Apache Lucene query parser syntax.
 *
 * - `dismax`: specify search criteria using the simplified subset of the Apache Lucene query parser syntax defined by the DisMax query parser.
 *
 * For more information, see Searching Your Data in the *Amazon CloudSearch Developer Guide*.
 *
 * The endpoint for submitting `Search` requests is domain-specific. You submit search requests to a domain's search endpoint. To get the search endpoint for your domain, use the Amazon CloudSearch configuration service `DescribeDomains` action. A domain's endpoints are also displayed on the domain dashboard in the Amazon CloudSearch console.
 */
export const search: (
  input: SearchRequest,
) => Effect.Effect<
  SearchResponse,
  SearchException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchRequest,
  output: SearchResponse,
  errors: [SearchException],
}));
