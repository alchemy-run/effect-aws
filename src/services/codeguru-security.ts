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
  sdkId: "CodeGuru Security",
  serviceShapeName: "AwsCodeGuruSecurity",
});
const auth = T.AwsAuthSigv4({ name: "codeguru-security" });
const ver = T.ServiceVersion("2018-05-10");
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
              `https://codeguru-security-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://codeguru-security-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://codeguru-security.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://codeguru-security.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClientToken = string;
export type ScanName = string;
export type NextToken = string;
export type Uuid = string;
export type ScanNameArn = string;
export type TagKey = string;
export type TagValue = string;
export type KmsKeyArn = string;
export type S3Url = string | redacted.Redacted<string>;
export type ErrorMessage = string;
export type HeaderKey = string;
export type HeaderValue = string;

//# Schemas
export interface GetAccountConfigurationRequest {}
export const GetAccountConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accountConfiguration/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountConfigurationRequest",
}) as any as S.Schema<GetAccountConfigurationRequest>;
export type ScanType = "Standard" | "Express";
export const ScanType = S.Literal("Standard", "Express");
export type AnalysisType = "Security" | "All";
export const AnalysisType = S.Literal("Security", "All");
export type Status = "Closed" | "Open" | "All";
export const Status = S.Literal("Closed", "Open", "All");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateUploadUrlRequest {
  scanName: string;
}
export const CreateUploadUrlRequest = S.suspend(() =>
  S.Struct({ scanName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/uploadUrl" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUploadUrlRequest",
}) as any as S.Schema<CreateUploadUrlRequest>;
export interface GetFindingsRequest {
  scanName: string;
  nextToken?: string;
  maxResults?: number;
  status?: Status;
}
export const GetFindingsRequest = S.suspend(() =>
  S.Struct({
    scanName: S.String.pipe(T.HttpLabel("scanName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(Status).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/findings/{scanName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingsRequest",
}) as any as S.Schema<GetFindingsRequest>;
export interface GetMetricsSummaryRequest {
  date: Date;
}
export const GetMetricsSummaryRequest = S.suspend(() =>
  S.Struct({
    date: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("date"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/metrics/summary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMetricsSummaryRequest",
}) as any as S.Schema<GetMetricsSummaryRequest>;
export interface GetScanRequest {
  scanName: string;
  runId?: string;
}
export const GetScanRequest = S.suspend(() =>
  S.Struct({
    scanName: S.String.pipe(T.HttpLabel("scanName")),
    runId: S.optional(S.String).pipe(T.HttpQuery("runId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/scans/{scanName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetScanRequest",
}) as any as S.Schema<GetScanRequest>;
export interface ListFindingsMetricsRequest {
  nextToken?: string;
  maxResults?: number;
  startDate: Date;
  endDate: Date;
}
export const ListFindingsMetricsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startDate"),
    ),
    endDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endDate"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/metrics/findings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFindingsMetricsRequest",
}) as any as S.Schema<ListFindingsMetricsRequest>;
export interface ListScansRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListScansRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/scans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListScansRequest",
}) as any as S.Schema<ListScansRequest>;
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
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
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
export interface EncryptionConfig {
  kmsKeyArn?: string;
}
export const EncryptionConfig = S.suspend(() =>
  S.Struct({ kmsKeyArn: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionConfig",
}) as any as S.Schema<EncryptionConfig>;
export interface UpdateAccountConfigurationRequest {
  encryptionConfig: EncryptionConfig;
}
export const UpdateAccountConfigurationRequest = S.suspend(() =>
  S.Struct({ encryptionConfig: EncryptionConfig }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/updateAccountConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountConfigurationRequest",
}) as any as S.Schema<UpdateAccountConfigurationRequest>;
export interface FindingIdentifier {
  scanName: string;
  findingId: string;
}
export const FindingIdentifier = S.suspend(() =>
  S.Struct({ scanName: S.String, findingId: S.String }),
).annotations({
  identifier: "FindingIdentifier",
}) as any as S.Schema<FindingIdentifier>;
export type FindingIdentifiers = FindingIdentifier[];
export const FindingIdentifiers = S.Array(FindingIdentifier);
export type ResourceId = { codeArtifactId: string };
export const ResourceId = S.Union(S.Struct({ codeArtifactId: S.String }));
export type ScanState = "InProgress" | "Successful" | "Failed";
export const ScanState = S.Literal("InProgress", "Successful", "Failed");
export interface BatchGetFindingsRequest {
  findingIdentifiers: FindingIdentifier[];
}
export const BatchGetFindingsRequest = S.suspend(() =>
  S.Struct({ findingIdentifiers: FindingIdentifiers }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/batchGetFindings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetFindingsRequest",
}) as any as S.Schema<BatchGetFindingsRequest>;
export interface CreateScanRequest {
  clientToken?: string;
  resourceId: ResourceId;
  scanName: string;
  scanType?: ScanType;
  analysisType?: AnalysisType;
  tags?: { [key: string]: string };
}
export const CreateScanRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    resourceId: ResourceId,
    scanName: S.String,
    scanType: S.optional(ScanType),
    analysisType: S.optional(AnalysisType),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/scans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateScanRequest",
}) as any as S.Schema<CreateScanRequest>;
export interface GetAccountConfigurationResponse {
  encryptionConfig: EncryptionConfig;
}
export const GetAccountConfigurationResponse = S.suspend(() =>
  S.Struct({ encryptionConfig: EncryptionConfig }),
).annotations({
  identifier: "GetAccountConfigurationResponse",
}) as any as S.Schema<GetAccountConfigurationResponse>;
export interface GetScanResponse {
  scanName: string;
  runId: string;
  scanState: ScanState;
  createdAt: Date;
  analysisType: AnalysisType;
  updatedAt?: Date;
  numberOfRevisions?: number;
  scanNameArn?: string;
  errorMessage?: string;
}
export const GetScanResponse = S.suspend(() =>
  S.Struct({
    scanName: S.String,
    runId: S.String,
    scanState: ScanState,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    analysisType: AnalysisType,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    numberOfRevisions: S.optional(S.Number),
    scanNameArn: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "GetScanResponse",
}) as any as S.Schema<GetScanResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateAccountConfigurationResponse {
  encryptionConfig: EncryptionConfig;
}
export const UpdateAccountConfigurationResponse = S.suspend(() =>
  S.Struct({ encryptionConfig: EncryptionConfig }),
).annotations({
  identifier: "UpdateAccountConfigurationResponse",
}) as any as S.Schema<UpdateAccountConfigurationResponse>;
export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";
export const Severity = S.Literal("Critical", "High", "Medium", "Low", "Info");
export type DetectorTags = string[];
export const DetectorTags = S.Array(S.String);
export interface ScanNameWithFindingNum {
  scanName?: string;
  findingNumber?: number;
}
export const ScanNameWithFindingNum = S.suspend(() =>
  S.Struct({
    scanName: S.optional(S.String),
    findingNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "ScanNameWithFindingNum",
}) as any as S.Schema<ScanNameWithFindingNum>;
export type ScansWithMostOpenCriticalFindings = ScanNameWithFindingNum[];
export const ScansWithMostOpenCriticalFindings = S.Array(
  ScanNameWithFindingNum,
);
export type RequestHeaderMap = { [key: string]: string };
export const RequestHeaderMap = S.Record({ key: S.String, value: S.String });
export interface FindingMetricsValuePerSeverity {
  info?: number;
  low?: number;
  medium?: number;
  high?: number;
  critical?: number;
}
export const FindingMetricsValuePerSeverity = S.suspend(() =>
  S.Struct({
    info: S.optional(S.Number),
    low: S.optional(S.Number),
    medium: S.optional(S.Number),
    high: S.optional(S.Number),
    critical: S.optional(S.Number),
  }),
).annotations({
  identifier: "FindingMetricsValuePerSeverity",
}) as any as S.Schema<FindingMetricsValuePerSeverity>;
export interface AccountFindingsMetric {
  date?: Date;
  newFindings?: FindingMetricsValuePerSeverity;
  closedFindings?: FindingMetricsValuePerSeverity;
  openFindings?: FindingMetricsValuePerSeverity;
  meanTimeToClose?: FindingMetricsValuePerSeverity;
}
export const AccountFindingsMetric = S.suspend(() =>
  S.Struct({
    date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    newFindings: S.optional(FindingMetricsValuePerSeverity),
    closedFindings: S.optional(FindingMetricsValuePerSeverity),
    openFindings: S.optional(FindingMetricsValuePerSeverity),
    meanTimeToClose: S.optional(FindingMetricsValuePerSeverity),
  }),
).annotations({
  identifier: "AccountFindingsMetric",
}) as any as S.Schema<AccountFindingsMetric>;
export type FindingsMetricList = AccountFindingsMetric[];
export const FindingsMetricList = S.Array(AccountFindingsMetric);
export interface ScanSummary {
  scanState: ScanState;
  createdAt: Date;
  updatedAt?: Date;
  scanName: string;
  runId: string;
  scanNameArn?: string;
}
export const ScanSummary = S.suspend(() =>
  S.Struct({
    scanState: ScanState,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    scanName: S.String,
    runId: S.String,
    scanNameArn: S.optional(S.String),
  }),
).annotations({ identifier: "ScanSummary" }) as any as S.Schema<ScanSummary>;
export type ScanSummaries = ScanSummary[];
export const ScanSummaries = S.Array(ScanSummary);
export type ReferenceUrls = string[];
export const ReferenceUrls = S.Array(S.String);
export type RelatedVulnerabilities = string[];
export const RelatedVulnerabilities = S.Array(S.String);
export interface CreateScanResponse {
  scanName: string;
  runId: string;
  resourceId: ResourceId;
  scanState: ScanState;
  scanNameArn?: string;
}
export const CreateScanResponse = S.suspend(() =>
  S.Struct({
    scanName: S.String,
    runId: S.String,
    resourceId: ResourceId,
    scanState: ScanState,
    scanNameArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateScanResponse",
}) as any as S.Schema<CreateScanResponse>;
export interface CreateUploadUrlResponse {
  s3Url: string | redacted.Redacted<string>;
  requestHeaders: { [key: string]: string };
  codeArtifactId: string;
}
export const CreateUploadUrlResponse = S.suspend(() =>
  S.Struct({
    s3Url: SensitiveString,
    requestHeaders: RequestHeaderMap,
    codeArtifactId: S.String,
  }),
).annotations({
  identifier: "CreateUploadUrlResponse",
}) as any as S.Schema<CreateUploadUrlResponse>;
export interface ListFindingsMetricsResponse {
  findingsMetrics?: AccountFindingsMetric[];
  nextToken?: string;
}
export const ListFindingsMetricsResponse = S.suspend(() =>
  S.Struct({
    findingsMetrics: S.optional(FindingsMetricList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFindingsMetricsResponse",
}) as any as S.Schema<ListFindingsMetricsResponse>;
export interface ListScansResponse {
  summaries?: ScanSummary[];
  nextToken?: string;
}
export const ListScansResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(ScanSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListScansResponse",
}) as any as S.Schema<ListScansResponse>;
export type ErrorCode =
  | "DUPLICATE_IDENTIFIER"
  | "ITEM_DOES_NOT_EXIST"
  | "INTERNAL_ERROR"
  | "INVALID_FINDING_ID"
  | "INVALID_SCAN_NAME";
export const ErrorCode = S.Literal(
  "DUPLICATE_IDENTIFIER",
  "ITEM_DOES_NOT_EXIST",
  "INTERNAL_ERROR",
  "INVALID_FINDING_ID",
  "INVALID_SCAN_NAME",
);
export interface Resource {
  id?: string;
  subResourceId?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), subResourceId: S.optional(S.String) }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export interface CategoryWithFindingNum {
  categoryName?: string;
  findingNumber?: number;
}
export const CategoryWithFindingNum = S.suspend(() =>
  S.Struct({
    categoryName: S.optional(S.String),
    findingNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "CategoryWithFindingNum",
}) as any as S.Schema<CategoryWithFindingNum>;
export type CategoriesWithMostFindings = CategoryWithFindingNum[];
export const CategoriesWithMostFindings = S.Array(CategoryWithFindingNum);
export type ScansWithMostOpenFindings = ScanNameWithFindingNum[];
export const ScansWithMostOpenFindings = S.Array(ScanNameWithFindingNum);
export interface BatchGetFindingsError {
  scanName: string;
  findingId: string;
  errorCode: ErrorCode;
  message: string;
}
export const BatchGetFindingsError = S.suspend(() =>
  S.Struct({
    scanName: S.String,
    findingId: S.String,
    errorCode: ErrorCode,
    message: S.String,
  }),
).annotations({
  identifier: "BatchGetFindingsError",
}) as any as S.Schema<BatchGetFindingsError>;
export type BatchGetFindingsErrors = BatchGetFindingsError[];
export const BatchGetFindingsErrors = S.Array(BatchGetFindingsError);
export interface MetricsSummary {
  date?: Date;
  openFindings?: FindingMetricsValuePerSeverity;
  categoriesWithMostFindings?: CategoryWithFindingNum[];
  scansWithMostOpenFindings?: ScanNameWithFindingNum[];
  scansWithMostOpenCriticalFindings?: ScanNameWithFindingNum[];
}
export const MetricsSummary = S.suspend(() =>
  S.Struct({
    date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    openFindings: S.optional(FindingMetricsValuePerSeverity),
    categoriesWithMostFindings: S.optional(CategoriesWithMostFindings),
    scansWithMostOpenFindings: S.optional(ScansWithMostOpenFindings),
    scansWithMostOpenCriticalFindings: S.optional(
      ScansWithMostOpenCriticalFindings,
    ),
  }),
).annotations({
  identifier: "MetricsSummary",
}) as any as S.Schema<MetricsSummary>;
export interface Recommendation {
  text?: string;
  url?: string;
}
export const Recommendation = S.suspend(() =>
  S.Struct({ text: S.optional(S.String), url: S.optional(S.String) }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export interface SuggestedFix {
  description?: string;
  code?: string;
}
export const SuggestedFix = S.suspend(() =>
  S.Struct({ description: S.optional(S.String), code: S.optional(S.String) }),
).annotations({ identifier: "SuggestedFix" }) as any as S.Schema<SuggestedFix>;
export type SuggestedFixes = SuggestedFix[];
export const SuggestedFixes = S.Array(SuggestedFix);
export interface CodeLine {
  number?: number;
  content?: string;
}
export const CodeLine = S.suspend(() =>
  S.Struct({ number: S.optional(S.Number), content: S.optional(S.String) }),
).annotations({ identifier: "CodeLine" }) as any as S.Schema<CodeLine>;
export type CodeSnippet = CodeLine[];
export const CodeSnippet = S.Array(CodeLine);
export interface FilePath {
  name?: string;
  path?: string;
  startLine?: number;
  endLine?: number;
  codeSnippet?: CodeLine[];
}
export const FilePath = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    path: S.optional(S.String),
    startLine: S.optional(S.Number),
    endLine: S.optional(S.Number),
    codeSnippet: S.optional(CodeSnippet),
  }),
).annotations({ identifier: "FilePath" }) as any as S.Schema<FilePath>;
export interface Vulnerability {
  referenceUrls?: string[];
  relatedVulnerabilities?: string[];
  id?: string;
  filePath?: FilePath;
  itemCount?: number;
}
export const Vulnerability = S.suspend(() =>
  S.Struct({
    referenceUrls: S.optional(ReferenceUrls),
    relatedVulnerabilities: S.optional(RelatedVulnerabilities),
    id: S.optional(S.String),
    filePath: S.optional(FilePath),
    itemCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "Vulnerability",
}) as any as S.Schema<Vulnerability>;
export interface Remediation {
  recommendation?: Recommendation;
  suggestedFixes?: SuggestedFix[];
}
export const Remediation = S.suspend(() =>
  S.Struct({
    recommendation: S.optional(Recommendation),
    suggestedFixes: S.optional(SuggestedFixes),
  }),
).annotations({ identifier: "Remediation" }) as any as S.Schema<Remediation>;
export interface Finding {
  createdAt?: Date;
  description?: string;
  generatorId?: string;
  id?: string;
  updatedAt?: Date;
  type?: string;
  status?: Status;
  resource?: Resource;
  vulnerability?: Vulnerability;
  severity?: Severity;
  remediation?: Remediation;
  title?: string;
  detectorTags?: string[];
  detectorId?: string;
  detectorName?: string;
  ruleId?: string;
}
export const Finding = S.suspend(() =>
  S.Struct({
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    description: S.optional(S.String),
    generatorId: S.optional(S.String),
    id: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    type: S.optional(S.String),
    status: S.optional(Status),
    resource: S.optional(Resource),
    vulnerability: S.optional(Vulnerability),
    severity: S.optional(Severity),
    remediation: S.optional(Remediation),
    title: S.optional(S.String),
    detectorTags: S.optional(DetectorTags),
    detectorId: S.optional(S.String),
    detectorName: S.optional(S.String),
    ruleId: S.optional(S.String),
  }),
).annotations({ identifier: "Finding" }) as any as S.Schema<Finding>;
export type Findings = Finding[];
export const Findings = S.Array(Finding);
export interface BatchGetFindingsResponse {
  findings: Finding[];
  failedFindings: BatchGetFindingsError[];
}
export const BatchGetFindingsResponse = S.suspend(() =>
  S.Struct({ findings: Findings, failedFindings: BatchGetFindingsErrors }),
).annotations({
  identifier: "BatchGetFindingsResponse",
}) as any as S.Schema<BatchGetFindingsResponse>;
export interface GetMetricsSummaryResponse {
  metricsSummary?: MetricsSummary;
}
export const GetMetricsSummaryResponse = S.suspend(() =>
  S.Struct({ metricsSummary: S.optional(MetricsSummary) }),
).annotations({
  identifier: "GetMetricsSummaryResponse",
}) as any as S.Schema<GetMetricsSummaryResponse>;
export type ValidationExceptionReason =
  | "unknownOperation"
  | "cannotParse"
  | "fieldValidationFailed"
  | "other"
  | "lambdaCodeShaMisMatch";
export const ValidationExceptionReason = S.Literal(
  "unknownOperation",
  "cannotParse",
  "fieldValidationFailed",
  "other",
  "lambdaCodeShaMisMatch",
);
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface GetFindingsResponse {
  findings?: Finding[];
  nextToken?: string;
}
export const GetFindingsResponse = S.suspend(() =>
  S.Struct({ findings: S.optional(Findings), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetFindingsResponse",
}) as any as S.Schema<GetFindingsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    errorCode: S.String,
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    errorCode: S.String,
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
  },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { error: S.optional(S.String), message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    errorCode: S.String,
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    errorCode: S.String,
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    errorCode: S.String,
    message: S.String,
    reason: ValidationExceptionReason,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Use to get the encryption configuration for an account.
 */
export const getAccountConfiguration: (
  input: GetAccountConfigurationRequest,
) => effect.Effect<
  GetAccountConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountConfigurationRequest,
  output: GetAccountConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use to remove one or more tags from an existing scan.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all tags associated with a scan.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | ConflictException
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use to create a scan using code uploaded to an Amazon S3 bucket.
 */
export const createScan: (
  input: CreateScanRequest,
) => effect.Effect<
  CreateScanResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScanRequest,
  output: CreateScanResponse,
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
 * Returns details about a scan, including whether or not a scan has completed.
 */
export const getScan: (
  input: GetScanRequest,
) => effect.Effect<
  GetScanResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetScanRequest,
  output: GetScanResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use to add one or more tags to an existing scan.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
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
 * Generates a pre-signed URL, request headers used to upload a code resource, and code artifact identifier for the uploaded resource.
 *
 * You can upload your code resource to the URL with the request headers using any HTTP client.
 */
export const createUploadUrl: (
  input: CreateUploadUrlRequest,
) => effect.Effect<
  CreateUploadUrlResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUploadUrlRequest,
  output: CreateUploadUrlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns metrics about all findings in an account within a specified time range.
 */
export const listFindingsMetrics: {
  (
    input: ListFindingsMetricsRequest,
  ): effect.Effect<
    ListFindingsMetricsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFindingsMetricsRequest,
  ) => stream.Stream<
    ListFindingsMetricsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFindingsMetricsRequest,
  ) => stream.Stream<
    AccountFindingsMetric,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFindingsMetricsRequest,
  output: ListFindingsMetricsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "findingsMetrics",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all scans in an account. Does not return `EXPRESS` scans.
 */
export const listScans: {
  (
    input: ListScansRequest,
  ): effect.Effect<
    ListScansResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListScansRequest,
  ) => stream.Stream<
    ListScansResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListScansRequest,
  ) => stream.Stream<
    ScanSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListScansRequest,
  output: ListScansResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of requested findings from standard scans.
 */
export const batchGetFindings: (
  input: BatchGetFindingsRequest,
) => effect.Effect<
  BatchGetFindingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetFindingsRequest,
  output: BatchGetFindingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a summary of metrics for an account from a specified date, including number of open findings, the categories with most findings, the scans with most open findings, and scans with most open critical findings.
 */
export const getMetricsSummary: (
  input: GetMetricsSummaryRequest,
) => effect.Effect<
  GetMetricsSummaryResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetricsSummaryRequest,
  output: GetMetricsSummaryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use to update the encryption configuration for an account.
 */
export const updateAccountConfiguration: (
  input: UpdateAccountConfigurationRequest,
) => effect.Effect<
  UpdateAccountConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountConfigurationRequest,
  output: UpdateAccountConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all findings generated by a particular scan.
 */
export const getFindings: {
  (
    input: GetFindingsRequest,
  ): effect.Effect<
    GetFindingsResponse,
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
    input: GetFindingsRequest,
  ) => stream.Stream<
    GetFindingsResponse,
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
    input: GetFindingsRequest,
  ) => stream.Stream<
    Finding,
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
  input: GetFindingsRequest,
  output: GetFindingsResponse,
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
    items: "findings",
    pageSize: "maxResults",
  } as const,
}));
