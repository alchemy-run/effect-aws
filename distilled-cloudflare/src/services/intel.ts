/**
 * Cloudflare INTEL API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service intel
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Asn
// =============================================================================

export interface GetAsnRequest {
  /** Identifier. */
  accountId: string;
}

export const GetAsnRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/asn/{asn}" }),
) as unknown as Schema.Schema<GetAsnRequest>;

export type GetAsnResponse = unknown;

export const GetAsnResponse = Schema.Unknown as unknown as Schema.Schema<GetAsnResponse>;

export const getAsn = API.make(() => ({
  input: GetAsnRequest,
  output: GetAsnResponse,
  errors: [],
}));

// =============================================================================
// AsnSubnet
// =============================================================================

export interface GetAsnSubnetRequest {
  /** Identifier. */
  accountId: string;
}

export const GetAsnSubnetRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/asn/{asn}/subnets" }),
) as unknown as Schema.Schema<GetAsnSubnetRequest>;

export interface GetAsnSubnetResponse {
  asn?: number;
  /** Total results returned based on your search parameters. */
  count?: number;
  ipCountTotal?: number;
  /** Current page within paginated list of results. */
  page?: number;
  /** Number of results per page of results. */
  perPage?: number;
  subnets?: string[];
}

export const GetAsnSubnetResponse = Schema.Struct({
  asn: Schema.optional(Schema.Number),
  count: Schema.optional(Schema.Number),
  ipCountTotal: Schema.optional(Schema.Number).pipe(T.JsonName("ip_count_total")),
  page: Schema.optional(Schema.Number),
  perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
  subnets: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<GetAsnSubnetResponse>;

export const getAsnSubnet = API.make(() => ({
  input: GetAsnSubnetRequest,
  output: GetAsnSubnetResponse,
  errors: [],
}));

// =============================================================================
// AttackSurfaceReportIssue
// =============================================================================

export interface ClassAttackSurfaceReportIssueRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: */
  dismissed?: boolean;
  /** Query param: */
  issueClass?: string[];
  /** Query param: */
  "issueClass~neq"?: string[];
  /** Query param: */
  issueType?: (
    | "compliance_violation"
    | "email_security"
    | "exposed_infrastructure"
    | "insecure_configuration"
    | "weak_authentication"
  )[];
  /** Query param: */
  "issueType~neq"?: (
    | "compliance_violation"
    | "email_security"
    | "exposed_infrastructure"
    | "insecure_configuration"
    | "weak_authentication"
  )[];
  /** Query param: */
  product?: string[];
  /** Query param: */
  "product~neq"?: string[];
  /** Query param: */
  severity?: ("low" | "moderate" | "critical")[];
  /** Query param: */
  "severity~neq"?: ("low" | "moderate" | "critical")[];
  /** Query param: */
  subject?: string[];
  /** Query param: */
  "subject~neq"?: string[];
}

export const ClassAttackSurfaceReportIssueRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  dismissed: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("dismissed")),
  issueClass: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("issue_class")),
  "issueClass~neq": Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("'issue_class~neq'"),
  ),
  issueType: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "compliance_violation",
        "email_security",
        "exposed_infrastructure",
        "insecure_configuration",
        "weak_authentication",
      ),
    ),
  ).pipe(T.HttpQuery("issue_type")),
  "issueType~neq": Schema.optional(
    Schema.Array(
      Schema.Literal(
        "compliance_violation",
        "email_security",
        "exposed_infrastructure",
        "insecure_configuration",
        "weak_authentication",
      ),
    ),
  ).pipe(T.HttpQuery("'issue_type~neq'")),
  product: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("product")),
  "product~neq": Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("'product~neq'")),
  severity: Schema.optional(Schema.Array(Schema.Literal("low", "moderate", "critical"))).pipe(
    T.HttpQuery("severity"),
  ),
  "severity~neq": Schema.optional(Schema.Array(Schema.Literal("low", "moderate", "critical"))).pipe(
    T.HttpQuery("'severity~neq'"),
  ),
  subject: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("subject")),
  "subject~neq": Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("'subject~neq'")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/intel/attack-surface-report/issues/class",
  }),
) as unknown as Schema.Schema<ClassAttackSurfaceReportIssueRequest>;

export type ClassAttackSurfaceReportIssueResponse = { count?: number; value?: string }[];

export const ClassAttackSurfaceReportIssueResponse = Schema.Array(
  Schema.Struct({
    count: Schema.optional(Schema.Number),
    value: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<ClassAttackSurfaceReportIssueResponse>;

export const classAttackSurfaceReportIssue = API.make(() => ({
  input: ClassAttackSurfaceReportIssueRequest,
  output: ClassAttackSurfaceReportIssueResponse,
  errors: [],
}));

export interface DismissAttackSurfaceReportIssueRequest {
  issueId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  dismiss?: boolean;
}

export const DismissAttackSurfaceReportIssueRequest = Schema.Struct({
  issueId: Schema.String.pipe(T.HttpPath("issueId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  dismiss: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/intel/attack-surface-report/{issueId}/dismiss",
  }),
) as unknown as Schema.Schema<DismissAttackSurfaceReportIssueRequest>;

export interface DismissAttackSurfaceReportIssueResponse {
  errors: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  messages: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  /** Whether the API call was successful. */
  success: true;
}

export const DismissAttackSurfaceReportIssueResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(T.JsonName("documentation_url")),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(T.JsonName("documentation_url")),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DismissAttackSurfaceReportIssueResponse>;

export const dismissAttackSurfaceReportIssue = API.make(() => ({
  input: DismissAttackSurfaceReportIssueRequest,
  output: DismissAttackSurfaceReportIssueResponse,
  errors: [],
}));

export interface SeverityAttackSurfaceReportIssueRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: */
  dismissed?: boolean;
  /** Query param: */
  issueClass?: string[];
  /** Query param: */
  "issueClass~neq"?: string[];
  /** Query param: */
  issueType?: (
    | "compliance_violation"
    | "email_security"
    | "exposed_infrastructure"
    | "insecure_configuration"
    | "weak_authentication"
  )[];
  /** Query param: */
  "issueType~neq"?: (
    | "compliance_violation"
    | "email_security"
    | "exposed_infrastructure"
    | "insecure_configuration"
    | "weak_authentication"
  )[];
  /** Query param: */
  product?: string[];
  /** Query param: */
  "product~neq"?: string[];
  /** Query param: */
  severity?: ("low" | "moderate" | "critical")[];
  /** Query param: */
  "severity~neq"?: ("low" | "moderate" | "critical")[];
  /** Query param: */
  subject?: string[];
  /** Query param: */
  "subject~neq"?: string[];
}

export const SeverityAttackSurfaceReportIssueRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  dismissed: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("dismissed")),
  issueClass: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("issue_class")),
  "issueClass~neq": Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("'issue_class~neq'"),
  ),
  issueType: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "compliance_violation",
        "email_security",
        "exposed_infrastructure",
        "insecure_configuration",
        "weak_authentication",
      ),
    ),
  ).pipe(T.HttpQuery("issue_type")),
  "issueType~neq": Schema.optional(
    Schema.Array(
      Schema.Literal(
        "compliance_violation",
        "email_security",
        "exposed_infrastructure",
        "insecure_configuration",
        "weak_authentication",
      ),
    ),
  ).pipe(T.HttpQuery("'issue_type~neq'")),
  product: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("product")),
  "product~neq": Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("'product~neq'")),
  severity: Schema.optional(Schema.Array(Schema.Literal("low", "moderate", "critical"))).pipe(
    T.HttpQuery("severity"),
  ),
  "severity~neq": Schema.optional(Schema.Array(Schema.Literal("low", "moderate", "critical"))).pipe(
    T.HttpQuery("'severity~neq'"),
  ),
  subject: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("subject")),
  "subject~neq": Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("'subject~neq'")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/intel/attack-surface-report/issues/severity",
  }),
) as unknown as Schema.Schema<SeverityAttackSurfaceReportIssueRequest>;

export type SeverityAttackSurfaceReportIssueResponse = { count?: number; value?: string }[];

export const SeverityAttackSurfaceReportIssueResponse = Schema.Array(
  Schema.Struct({
    count: Schema.optional(Schema.Number),
    value: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<SeverityAttackSurfaceReportIssueResponse>;

export const severityAttackSurfaceReportIssue = API.make(() => ({
  input: SeverityAttackSurfaceReportIssueRequest,
  output: SeverityAttackSurfaceReportIssueResponse,
  errors: [],
}));

export interface TypeAttackSurfaceReportIssueRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: */
  dismissed?: boolean;
  /** Query param: */
  issueClass?: string[];
  /** Query param: */
  "issueClass~neq"?: string[];
  /** Query param: */
  issueType?: (
    | "compliance_violation"
    | "email_security"
    | "exposed_infrastructure"
    | "insecure_configuration"
    | "weak_authentication"
  )[];
  /** Query param: */
  "issueType~neq"?: (
    | "compliance_violation"
    | "email_security"
    | "exposed_infrastructure"
    | "insecure_configuration"
    | "weak_authentication"
  )[];
  /** Query param: */
  product?: string[];
  /** Query param: */
  "product~neq"?: string[];
  /** Query param: */
  severity?: ("low" | "moderate" | "critical")[];
  /** Query param: */
  "severity~neq"?: ("low" | "moderate" | "critical")[];
  /** Query param: */
  subject?: string[];
  /** Query param: */
  "subject~neq"?: string[];
}

export const TypeAttackSurfaceReportIssueRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  dismissed: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("dismissed")),
  issueClass: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("issue_class")),
  "issueClass~neq": Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("'issue_class~neq'"),
  ),
  issueType: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "compliance_violation",
        "email_security",
        "exposed_infrastructure",
        "insecure_configuration",
        "weak_authentication",
      ),
    ),
  ).pipe(T.HttpQuery("issue_type")),
  "issueType~neq": Schema.optional(
    Schema.Array(
      Schema.Literal(
        "compliance_violation",
        "email_security",
        "exposed_infrastructure",
        "insecure_configuration",
        "weak_authentication",
      ),
    ),
  ).pipe(T.HttpQuery("'issue_type~neq'")),
  product: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("product")),
  "product~neq": Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("'product~neq'")),
  severity: Schema.optional(Schema.Array(Schema.Literal("low", "moderate", "critical"))).pipe(
    T.HttpQuery("severity"),
  ),
  "severity~neq": Schema.optional(Schema.Array(Schema.Literal("low", "moderate", "critical"))).pipe(
    T.HttpQuery("'severity~neq'"),
  ),
  subject: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("subject")),
  "subject~neq": Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("'subject~neq'")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/attack-surface-report/issues/type" }),
) as unknown as Schema.Schema<TypeAttackSurfaceReportIssueRequest>;

export type TypeAttackSurfaceReportIssueResponse = { count?: number; value?: string }[];

export const TypeAttackSurfaceReportIssueResponse = Schema.Array(
  Schema.Struct({
    count: Schema.optional(Schema.Number),
    value: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<TypeAttackSurfaceReportIssueResponse>;

export const typeAttackSurfaceReportIssue = API.make(() => ({
  input: TypeAttackSurfaceReportIssueRequest,
  output: TypeAttackSurfaceReportIssueResponse,
  errors: [],
}));

// =============================================================================
// Domain
// =============================================================================

export interface GetDomainRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: */
  domain?: string;
}

export const GetDomainRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  domain: Schema.optional(Schema.String).pipe(T.HttpQuery("domain")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/domain" }),
) as unknown as Schema.Schema<GetDomainRequest>;

export interface GetDomainResponse {
  /** Additional information related to the host name. */
  additionalInformation?: { suspectedMalwareFamily?: string };
  /** Application that the hostname belongs to. */
  application?: { id?: number; name?: string };
  contentCategories?: { id?: number; name?: string; superCategoryId?: number }[];
  domain?: string;
  inheritedContentCategories?: { id?: number; name?: string; superCategoryId?: number }[];
  /** Domain from which `inherited_content_categories` and `inherited_risk_types` are inherited, if applicable. */
  inheritedFrom?: string;
  inheritedRiskTypes?: { id?: number; name?: string; superCategoryId?: number }[];
  /** Global Cloudflare 100k ranking for the last 30 days, if available for the hostname. The top ranked domain is 1, the lowest ranked domain is 100,000. */
  popularityRank?: number;
  /** Specifies a list of references to one or more IP addresses or domain names that the domain name currently resolves to. */
  resolvesToRefs?: { id?: string; value?: string }[];
  /** Hostname risk score, which is a value between 0 (lowest risk) to 1 (highest risk). */
  riskScore?: number;
  riskTypes?: { id?: number; name?: string; superCategoryId?: number }[];
}

export const GetDomainResponse = Schema.Struct({
  additionalInformation: Schema.optional(
    Schema.Struct({
      suspectedMalwareFamily: Schema.optional(Schema.String).pipe(
        T.JsonName("suspected_malware_family"),
      ),
    }),
  ).pipe(T.JsonName("additional_information")),
  application: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.Number),
      name: Schema.optional(Schema.String),
    }),
  ),
  contentCategories: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.Number),
        name: Schema.optional(Schema.String),
        superCategoryId: Schema.optional(Schema.Number).pipe(T.JsonName("super_category_id")),
      }),
    ),
  ).pipe(T.JsonName("content_categories")),
  domain: Schema.optional(Schema.String),
  inheritedContentCategories: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.Number),
        name: Schema.optional(Schema.String),
        superCategoryId: Schema.optional(Schema.Number).pipe(T.JsonName("super_category_id")),
      }),
    ),
  ).pipe(T.JsonName("inherited_content_categories")),
  inheritedFrom: Schema.optional(Schema.String).pipe(T.JsonName("inherited_from")),
  inheritedRiskTypes: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.Number),
        name: Schema.optional(Schema.String),
        superCategoryId: Schema.optional(Schema.Number).pipe(T.JsonName("super_category_id")),
      }),
    ),
  ).pipe(T.JsonName("inherited_risk_types")),
  popularityRank: Schema.optional(Schema.Number).pipe(T.JsonName("popularity_rank")),
  resolvesToRefs: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("resolves_to_refs")),
  riskScore: Schema.optional(Schema.Number).pipe(T.JsonName("risk_score")),
  riskTypes: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.Number),
        name: Schema.optional(Schema.String),
        superCategoryId: Schema.optional(Schema.Number).pipe(T.JsonName("super_category_id")),
      }),
    ),
  ).pipe(T.JsonName("risk_types")),
}) as unknown as Schema.Schema<GetDomainResponse>;

export const getDomain = API.make(() => ({
  input: GetDomainRequest,
  output: GetDomainResponse,
  errors: [],
}));

// =============================================================================
// DomainBulk
// =============================================================================

export interface GetDomainBulkRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Accepts multiple values like `?domain=cloudflare.com&domain=example.com`. */
  domain?: string[];
}

export const GetDomainBulkRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  domain: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("domain")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/domain/bulk" }),
) as unknown as Schema.Schema<GetDomainBulkRequest>;

export type GetDomainBulkResponse = unknown;

export const GetDomainBulkResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDomainBulkResponse>;

export const getDomainBulk = API.make(() => ({
  input: GetDomainBulkRequest,
  output: GetDomainBulkResponse,
  errors: [],
}));

// =============================================================================
// DomainHistory
// =============================================================================

export interface GetDomainHistoryRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: */
  domain?: string;
}

export const GetDomainHistoryRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  domain: Schema.optional(Schema.String).pipe(T.HttpQuery("domain")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/domain-history" }),
) as unknown as Schema.Schema<GetDomainHistoryRequest>;

export type GetDomainHistoryResponse = unknown;

export const GetDomainHistoryResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDomainHistoryResponse>;

export const getDomainHistory = API.make(() => ({
  input: GetDomainHistoryRequest,
  output: GetDomainHistoryResponse,
  errors: [],
}));

// =============================================================================
// IndicatorFeed
// =============================================================================

export interface GetIndicatorFeedRequest {
  feedId: number;
  /** Identifier */
  accountId: string;
}

export const GetIndicatorFeedRequest = Schema.Struct({
  feedId: Schema.Number.pipe(T.HttpPath("feedId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/indicator-feeds/{feedId}" }),
) as unknown as Schema.Schema<GetIndicatorFeedRequest>;

export interface GetIndicatorFeedResponse {
  /** The unique identifier for the indicator feed */
  id?: number;
  /** The date and time when the data entry was created */
  createdOn?: string;
  /** The description of the example test */
  description?: string;
  /** Whether the indicator feed can be attributed to a provider */
  isAttributable?: boolean;
  /** Whether the indicator feed can be downloaded */
  isDownloadable?: boolean;
  /** Whether the indicator feed is exposed to customers */
  isPublic?: boolean;
  /** Status of the latest snapshot uploaded */
  latestUploadStatus?: "Mirroring" | "Unifying" | "Loading" | "Provisioning" | "Complete" | "Error";
  /** The date and time when the data entry was last modified */
  modifiedOn?: string;
  /** The name of the indicator feed */
  name?: string;
  /** The unique identifier for the provider */
  providerId?: string;
  /** The provider of the indicator feed */
  providerName?: string;
}

export const GetIndicatorFeedResponse = Schema.Struct({
  id: Schema.optional(Schema.Number),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  isAttributable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_attributable")),
  isDownloadable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_downloadable")),
  isPublic: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_public")),
  latestUploadStatus: Schema.optional(
    Schema.Literal("Mirroring", "Unifying", "Loading", "Provisioning", "Complete", "Error"),
  ).pipe(T.JsonName("latest_upload_status")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  providerId: Schema.optional(Schema.String).pipe(T.JsonName("provider_id")),
  providerName: Schema.optional(Schema.String).pipe(T.JsonName("provider_name")),
}) as unknown as Schema.Schema<GetIndicatorFeedResponse>;

export const getIndicatorFeed = API.make(() => ({
  input: GetIndicatorFeedRequest,
  output: GetIndicatorFeedResponse,
  errors: [],
}));

export interface CreateIndicatorFeedRequest {
  /** Path param: Identifier */
  accountId: string;
  /** Body param: The description of the example test */
  description?: string;
  /** Body param: The name of the indicator feed */
  name?: string;
}

export const CreateIndicatorFeedRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  description: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/intel/indicator-feeds" }),
) as unknown as Schema.Schema<CreateIndicatorFeedRequest>;

export interface CreateIndicatorFeedResponse {
  /** The unique identifier for the indicator feed */
  id?: number;
  /** The date and time when the data entry was created */
  createdOn?: string;
  /** The description of the example test */
  description?: string;
  /** Whether the indicator feed can be attributed to a provider */
  isAttributable?: boolean;
  /** Whether the indicator feed can be downloaded */
  isDownloadable?: boolean;
  /** Whether the indicator feed is exposed to customers */
  isPublic?: boolean;
  /** The date and time when the data entry was last modified */
  modifiedOn?: string;
  /** The name of the indicator feed */
  name?: string;
}

export const CreateIndicatorFeedResponse = Schema.Struct({
  id: Schema.optional(Schema.Number),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  isAttributable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_attributable")),
  isDownloadable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_downloadable")),
  isPublic: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_public")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateIndicatorFeedResponse>;

export const createIndicatorFeed = API.make(() => ({
  input: CreateIndicatorFeedRequest,
  output: CreateIndicatorFeedResponse,
  errors: [],
}));

export interface UpdateIndicatorFeedRequest {
  feedId: number;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: The new description of the feed */
  description?: string;
  /** Body param: The new is_attributable value of the feed */
  isAttributable?: boolean;
  /** Body param: The new is_downloadable value of the feed */
  isDownloadable?: boolean;
  /** Body param: The new is_public value of the feed */
  isPublic?: boolean;
  /** Body param: The new name of the feed */
  name?: string;
}

export const UpdateIndicatorFeedRequest = Schema.Struct({
  feedId: Schema.Number.pipe(T.HttpPath("feedId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  description: Schema.optional(Schema.String),
  isAttributable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_attributable")),
  isDownloadable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_downloadable")),
  isPublic: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_public")),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/intel/indicator-feeds/{feedId}" }),
) as unknown as Schema.Schema<UpdateIndicatorFeedRequest>;

export interface UpdateIndicatorFeedResponse {
  /** The unique identifier for the indicator feed */
  id?: number;
  /** The date and time when the data entry was created */
  createdOn?: string;
  /** The description of the example test */
  description?: string;
  /** Whether the indicator feed can be attributed to a provider */
  isAttributable?: boolean;
  /** Whether the indicator feed can be downloaded */
  isDownloadable?: boolean;
  /** Whether the indicator feed is exposed to customers */
  isPublic?: boolean;
  /** The date and time when the data entry was last modified */
  modifiedOn?: string;
  /** The name of the indicator feed */
  name?: string;
}

export const UpdateIndicatorFeedResponse = Schema.Struct({
  id: Schema.optional(Schema.Number),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  isAttributable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_attributable")),
  isDownloadable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_downloadable")),
  isPublic: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_public")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateIndicatorFeedResponse>;

export const updateIndicatorFeed = API.make(() => ({
  input: UpdateIndicatorFeedRequest,
  output: UpdateIndicatorFeedResponse,
  errors: [],
}));

export interface DataIndicatorFeedRequest {
  feedId: number;
  /** Identifier */
  accountId: string;
}

export const DataIndicatorFeedRequest = Schema.Struct({
  feedId: Schema.Number.pipe(T.HttpPath("feedId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/indicator-feeds/{feedId}/data" }),
) as unknown as Schema.Schema<DataIndicatorFeedRequest>;

export type DataIndicatorFeedResponse = unknown;

export const DataIndicatorFeedResponse =
  Schema.Unknown as unknown as Schema.Schema<DataIndicatorFeedResponse>;

export const dataIndicatorFeed = API.make(() => ({
  input: DataIndicatorFeedRequest,
  output: DataIndicatorFeedResponse,
  errors: [],
}));

// =============================================================================
// IndicatorFeedPermission
// =============================================================================

export interface ListIndicatorFeedPermissionsRequest {
  /** Identifier */
  accountId: string;
}

export const ListIndicatorFeedPermissionsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/indicator-feeds/permissions/view" }),
) as unknown as Schema.Schema<ListIndicatorFeedPermissionsRequest>;

export type ListIndicatorFeedPermissionsResponse = {
  id?: number;
  description?: string;
  isAttributable?: boolean;
  isDownloadable?: boolean;
  isPublic?: boolean;
  name?: string;
}[];

export const ListIndicatorFeedPermissionsResponse = Schema.Array(
  Schema.Struct({
    id: Schema.optional(Schema.Number),
    description: Schema.optional(Schema.String),
    isAttributable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_attributable")),
    isDownloadable: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_downloadable")),
    isPublic: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_public")),
    name: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<ListIndicatorFeedPermissionsResponse>;

export const listIndicatorFeedPermissions = API.make(() => ({
  input: ListIndicatorFeedPermissionsRequest,
  output: ListIndicatorFeedPermissionsResponse,
  errors: [],
}));

export interface CreateIndicatorFeedPermissionRequest {
  /** Path param: Identifier */
  accountId: string;
  /** Body param: The Cloudflare account tag of the account to change permissions on */
  accountTag?: string;
  /** Body param: The ID of the feed to add/remove permissions on */
  feedId?: number;
}

export const CreateIndicatorFeedPermissionRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
  feedId: Schema.optional(Schema.Number).pipe(T.JsonName("feed_id")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/intel/indicator-feeds/permissions/add" }),
) as unknown as Schema.Schema<CreateIndicatorFeedPermissionRequest>;

export interface CreateIndicatorFeedPermissionResponse {
  /** Whether the update succeeded or not */
  success?: boolean;
}

export const CreateIndicatorFeedPermissionResponse = Schema.Struct({
  success: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<CreateIndicatorFeedPermissionResponse>;

export const createIndicatorFeedPermission = API.make(() => ({
  input: CreateIndicatorFeedPermissionRequest,
  output: CreateIndicatorFeedPermissionResponse,
  errors: [],
}));

export interface DeleteIndicatorFeedPermissionRequest {
  /** Path param: Identifier */
  accountId: string;
  /** Body param: The Cloudflare account tag of the account to change permissions on */
  accountTag?: string;
  /** Body param: The ID of the feed to add/remove permissions on */
  feedId?: number;
}

export const DeleteIndicatorFeedPermissionRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
  feedId: Schema.optional(Schema.Number).pipe(T.JsonName("feed_id")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/intel/indicator-feeds/permissions/remove",
  }),
) as unknown as Schema.Schema<DeleteIndicatorFeedPermissionRequest>;

export interface DeleteIndicatorFeedPermissionResponse {
  /** Whether the update succeeded or not */
  success?: boolean;
}

export const DeleteIndicatorFeedPermissionResponse = Schema.Struct({
  success: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<DeleteIndicatorFeedPermissionResponse>;

export const deleteIndicatorFeedPermission = API.make(() => ({
  input: DeleteIndicatorFeedPermissionRequest,
  output: DeleteIndicatorFeedPermissionResponse,
  errors: [],
}));

// =============================================================================
// IndicatorFeedSnapshot
// =============================================================================

export interface PutIndicatorFeedSnapshotRequest {
  feedId: number;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: The file to upload */
  source?: string;
}

export const PutIndicatorFeedSnapshotRequest = Schema.Struct({
  feedId: Schema.Number.pipe(T.HttpPath("feedId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  source: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/intel/indicator-feeds/{feedId}/snapshot" }),
) as unknown as Schema.Schema<PutIndicatorFeedSnapshotRequest>;

export interface PutIndicatorFeedSnapshotResponse {
  /** Feed id */
  fileId?: number;
  /** Name of the file unified in our system */
  filename?: string;
  /** Current status of upload, should be unified */
  status?: string;
}

export const PutIndicatorFeedSnapshotResponse = Schema.Struct({
  fileId: Schema.optional(Schema.Number).pipe(T.JsonName("file_id")),
  filename: Schema.optional(Schema.String),
  status: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PutIndicatorFeedSnapshotResponse>;

export const putIndicatorFeedSnapshot = API.make(() => ({
  input: PutIndicatorFeedSnapshotRequest,
  output: PutIndicatorFeedSnapshotResponse,
  errors: [],
}));

// =============================================================================
// Ip
// =============================================================================

export interface GetIpRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: */
  ipv4?: string;
  /** Query param: */
  ipv6?: string;
}

export const GetIpRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ipv4: Schema.optional(Schema.String).pipe(T.HttpQuery("ipv4")),
  ipv6: Schema.optional(Schema.String).pipe(T.HttpQuery("ipv6")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/ip" }),
) as unknown as Schema.Schema<GetIpRequest>;

export type GetIpResponse = unknown;

export const GetIpResponse = Schema.Unknown as unknown as Schema.Schema<GetIpResponse>;

export const getIp = API.make(() => ({
  input: GetIpRequest,
  output: GetIpResponse,
  errors: [],
}));

// =============================================================================
// Miscategorization
// =============================================================================

export interface CreateMiscategorizationRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Content category IDs to add. */
  contentAdds?: number[];
  /** Body param: Content category IDs to remove. */
  contentRemoves?: number[];
  /** Body param: */
  indicatorType?: "domain" | "ipv4" | "ipv6" | "url";
  /** Body param: Provide only if indicator_type is `ipv4` or `ipv6`. */
  ip?: string | null;
  /** Body param: Security category IDs to add. */
  securityAdds?: number[];
  /** Body param: Security category IDs to remove. */
  securityRemoves?: number[];
  /** Body param: Provide only if indicator_type is `domain` or `url`. Example if indicator_type is `domain`: `example.com`. Example if indicator_type is `url`: `https://example.com/news/`. */
  url?: string;
}

export const CreateMiscategorizationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  contentAdds: Schema.optional(Schema.Array(Schema.Number)).pipe(T.JsonName("content_adds")),
  contentRemoves: Schema.optional(Schema.Array(Schema.Number)).pipe(T.JsonName("content_removes")),
  indicatorType: Schema.optional(Schema.Literal("domain", "ipv4", "ipv6", "url")).pipe(
    T.JsonName("indicator_type"),
  ),
  ip: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  securityAdds: Schema.optional(Schema.Array(Schema.Number)).pipe(T.JsonName("security_adds")),
  securityRemoves: Schema.optional(Schema.Array(Schema.Number)).pipe(
    T.JsonName("security_removes"),
  ),
  url: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/intel/miscategorization" }),
) as unknown as Schema.Schema<CreateMiscategorizationRequest>;

export interface CreateMiscategorizationResponse {
  errors: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  messages: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  /** Whether the API call was successful. */
  success: true;
}

export const CreateMiscategorizationResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(T.JsonName("documentation_url")),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(T.JsonName("documentation_url")),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<CreateMiscategorizationResponse>;

export const createMiscategorization = API.make(() => ({
  input: CreateMiscategorizationRequest,
  output: CreateMiscategorizationResponse,
  errors: [],
}));

// =============================================================================
// Whoi
// =============================================================================

export interface GetWhoiRequest {
  /** Path param: Use to uniquely identify or reference the resource. */
  accountId: string;
  /** Query param: */
  domain?: string;
}

export const GetWhoiRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  domain: Schema.optional(Schema.String).pipe(T.HttpQuery("domain")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/intel/whois" }),
) as unknown as Schema.Schema<GetWhoiRequest>;

export interface GetWhoiResponse {
  dnssec: boolean;
  domain: string;
  extension: string;
  found: boolean;
  nameservers: string[];
  punycode: string;
  registrant: string;
  registrar: string;
  id?: string;
  administrativeCity?: string;
  administrativeCountry?: string;
  administrativeEmail?: string;
  administrativeFax?: string;
  administrativeFaxExt?: string;
  administrativeId?: string;
  administrativeName?: string;
  administrativeOrg?: string;
  administrativePhone?: string;
  administrativePhoneExt?: string;
  administrativePostalCode?: string;
  administrativeProvince?: string;
  administrativeReferralUrl?: string;
  administrativeStreet?: string;
  billingCity?: string;
  billingCountry?: string;
  billingEmail?: string;
  billingFax?: string;
  billingFaxExt?: string;
  billingId?: string;
  billingName?: string;
  billingOrg?: string;
  billingPhone?: string;
  billingPhoneExt?: string;
  billingPostalCode?: string;
  billingProvince?: string;
  billingReferralUrl?: string;
  billingStreet?: string;
  createdDate?: string;
  createdDateRaw?: string;
  expirationDate?: string;
  expirationDateRaw?: string;
  registrantCity?: string;
  registrantCountry?: string;
  registrantEmail?: string;
  registrantFax?: string;
  registrantFaxExt?: string;
  registrantId?: string;
  registrantName?: string;
  registrantOrg?: string;
  registrantPhone?: string;
  registrantPhoneExt?: string;
  registrantPostalCode?: string;
  registrantProvince?: string;
  registrantReferralUrl?: string;
  registrantStreet?: string;
  registrarCity?: string;
  registrarCountry?: string;
  registrarEmail?: string;
  registrarFax?: string;
  registrarFaxExt?: string;
  registrarId?: string;
  registrarName?: string;
  registrarOrg?: string;
  registrarPhone?: string;
  registrarPhoneExt?: string;
  registrarPostalCode?: string;
  registrarProvince?: string;
  registrarReferralUrl?: string;
  registrarStreet?: string;
  status?: string[];
  technicalCity?: string;
  technicalCountry?: string;
  technicalEmail?: string;
  technicalFax?: string;
  technicalFaxExt?: string;
  technicalId?: string;
  technicalName?: string;
  technicalOrg?: string;
  technicalPhone?: string;
  technicalPhoneExt?: string;
  technicalPostalCode?: string;
  technicalProvince?: string;
  technicalReferralUrl?: string;
  technicalStreet?: string;
  updatedDate?: string;
  updatedDateRaw?: string;
  whoisServer?: string;
}

export const GetWhoiResponse = Schema.Struct({
  dnssec: Schema.Boolean,
  domain: Schema.String,
  extension: Schema.String,
  found: Schema.Boolean,
  nameservers: Schema.Array(Schema.String),
  punycode: Schema.String,
  registrant: Schema.String,
  registrar: Schema.String,
  id: Schema.optional(Schema.String),
  administrativeCity: Schema.optional(Schema.String).pipe(T.JsonName("administrative_city")),
  administrativeCountry: Schema.optional(Schema.String).pipe(T.JsonName("administrative_country")),
  administrativeEmail: Schema.optional(Schema.String).pipe(T.JsonName("administrative_email")),
  administrativeFax: Schema.optional(Schema.String).pipe(T.JsonName("administrative_fax")),
  administrativeFaxExt: Schema.optional(Schema.String).pipe(T.JsonName("administrative_fax_ext")),
  administrativeId: Schema.optional(Schema.String).pipe(T.JsonName("administrative_id")),
  administrativeName: Schema.optional(Schema.String).pipe(T.JsonName("administrative_name")),
  administrativeOrg: Schema.optional(Schema.String).pipe(T.JsonName("administrative_org")),
  administrativePhone: Schema.optional(Schema.String).pipe(T.JsonName("administrative_phone")),
  administrativePhoneExt: Schema.optional(Schema.String).pipe(
    T.JsonName("administrative_phone_ext"),
  ),
  administrativePostalCode: Schema.optional(Schema.String).pipe(
    T.JsonName("administrative_postal_code"),
  ),
  administrativeProvince: Schema.optional(Schema.String).pipe(
    T.JsonName("administrative_province"),
  ),
  administrativeReferralUrl: Schema.optional(Schema.String).pipe(
    T.JsonName("administrative_referral_url"),
  ),
  administrativeStreet: Schema.optional(Schema.String).pipe(T.JsonName("administrative_street")),
  billingCity: Schema.optional(Schema.String).pipe(T.JsonName("billing_city")),
  billingCountry: Schema.optional(Schema.String).pipe(T.JsonName("billing_country")),
  billingEmail: Schema.optional(Schema.String).pipe(T.JsonName("billing_email")),
  billingFax: Schema.optional(Schema.String).pipe(T.JsonName("billing_fax")),
  billingFaxExt: Schema.optional(Schema.String).pipe(T.JsonName("billing_fax_ext")),
  billingId: Schema.optional(Schema.String).pipe(T.JsonName("billing_id")),
  billingName: Schema.optional(Schema.String).pipe(T.JsonName("billing_name")),
  billingOrg: Schema.optional(Schema.String).pipe(T.JsonName("billing_org")),
  billingPhone: Schema.optional(Schema.String).pipe(T.JsonName("billing_phone")),
  billingPhoneExt: Schema.optional(Schema.String).pipe(T.JsonName("billing_phone_ext")),
  billingPostalCode: Schema.optional(Schema.String).pipe(T.JsonName("billing_postal_code")),
  billingProvince: Schema.optional(Schema.String).pipe(T.JsonName("billing_province")),
  billingReferralUrl: Schema.optional(Schema.String).pipe(T.JsonName("billing_referral_url")),
  billingStreet: Schema.optional(Schema.String).pipe(T.JsonName("billing_street")),
  createdDate: Schema.optional(Schema.String).pipe(T.JsonName("created_date")),
  createdDateRaw: Schema.optional(Schema.String).pipe(T.JsonName("created_date_raw")),
  expirationDate: Schema.optional(Schema.String).pipe(T.JsonName("expiration_date")),
  expirationDateRaw: Schema.optional(Schema.String).pipe(T.JsonName("expiration_date_raw")),
  registrantCity: Schema.optional(Schema.String).pipe(T.JsonName("registrant_city")),
  registrantCountry: Schema.optional(Schema.String).pipe(T.JsonName("registrant_country")),
  registrantEmail: Schema.optional(Schema.String).pipe(T.JsonName("registrant_email")),
  registrantFax: Schema.optional(Schema.String).pipe(T.JsonName("registrant_fax")),
  registrantFaxExt: Schema.optional(Schema.String).pipe(T.JsonName("registrant_fax_ext")),
  registrantId: Schema.optional(Schema.String).pipe(T.JsonName("registrant_id")),
  registrantName: Schema.optional(Schema.String).pipe(T.JsonName("registrant_name")),
  registrantOrg: Schema.optional(Schema.String).pipe(T.JsonName("registrant_org")),
  registrantPhone: Schema.optional(Schema.String).pipe(T.JsonName("registrant_phone")),
  registrantPhoneExt: Schema.optional(Schema.String).pipe(T.JsonName("registrant_phone_ext")),
  registrantPostalCode: Schema.optional(Schema.String).pipe(T.JsonName("registrant_postal_code")),
  registrantProvince: Schema.optional(Schema.String).pipe(T.JsonName("registrant_province")),
  registrantReferralUrl: Schema.optional(Schema.String).pipe(T.JsonName("registrant_referral_url")),
  registrantStreet: Schema.optional(Schema.String).pipe(T.JsonName("registrant_street")),
  registrarCity: Schema.optional(Schema.String).pipe(T.JsonName("registrar_city")),
  registrarCountry: Schema.optional(Schema.String).pipe(T.JsonName("registrar_country")),
  registrarEmail: Schema.optional(Schema.String).pipe(T.JsonName("registrar_email")),
  registrarFax: Schema.optional(Schema.String).pipe(T.JsonName("registrar_fax")),
  registrarFaxExt: Schema.optional(Schema.String).pipe(T.JsonName("registrar_fax_ext")),
  registrarId: Schema.optional(Schema.String).pipe(T.JsonName("registrar_id")),
  registrarName: Schema.optional(Schema.String).pipe(T.JsonName("registrar_name")),
  registrarOrg: Schema.optional(Schema.String).pipe(T.JsonName("registrar_org")),
  registrarPhone: Schema.optional(Schema.String).pipe(T.JsonName("registrar_phone")),
  registrarPhoneExt: Schema.optional(Schema.String).pipe(T.JsonName("registrar_phone_ext")),
  registrarPostalCode: Schema.optional(Schema.String).pipe(T.JsonName("registrar_postal_code")),
  registrarProvince: Schema.optional(Schema.String).pipe(T.JsonName("registrar_province")),
  registrarReferralUrl: Schema.optional(Schema.String).pipe(T.JsonName("registrar_referral_url")),
  registrarStreet: Schema.optional(Schema.String).pipe(T.JsonName("registrar_street")),
  status: Schema.optional(Schema.Array(Schema.String)),
  technicalCity: Schema.optional(Schema.String).pipe(T.JsonName("technical_city")),
  technicalCountry: Schema.optional(Schema.String).pipe(T.JsonName("technical_country")),
  technicalEmail: Schema.optional(Schema.String).pipe(T.JsonName("technical_email")),
  technicalFax: Schema.optional(Schema.String).pipe(T.JsonName("technical_fax")),
  technicalFaxExt: Schema.optional(Schema.String).pipe(T.JsonName("technical_fax_ext")),
  technicalId: Schema.optional(Schema.String).pipe(T.JsonName("technical_id")),
  technicalName: Schema.optional(Schema.String).pipe(T.JsonName("technical_name")),
  technicalOrg: Schema.optional(Schema.String).pipe(T.JsonName("technical_org")),
  technicalPhone: Schema.optional(Schema.String).pipe(T.JsonName("technical_phone")),
  technicalPhoneExt: Schema.optional(Schema.String).pipe(T.JsonName("technical_phone_ext")),
  technicalPostalCode: Schema.optional(Schema.String).pipe(T.JsonName("technical_postal_code")),
  technicalProvince: Schema.optional(Schema.String).pipe(T.JsonName("technical_province")),
  technicalReferralUrl: Schema.optional(Schema.String).pipe(T.JsonName("technical_referral_url")),
  technicalStreet: Schema.optional(Schema.String).pipe(T.JsonName("technical_street")),
  updatedDate: Schema.optional(Schema.String).pipe(T.JsonName("updated_date")),
  updatedDateRaw: Schema.optional(Schema.String).pipe(T.JsonName("updated_date_raw")),
  whoisServer: Schema.optional(Schema.String).pipe(T.JsonName("whois_server")),
}) as unknown as Schema.Schema<GetWhoiResponse>;

export const getWhoi = API.make(() => ({
  input: GetWhoiRequest,
  output: GetWhoiResponse,
  errors: [],
}));
