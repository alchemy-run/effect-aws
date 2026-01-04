import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "CodeGuru Security",
  serviceShapeName: "AwsCodeGuruSecurity",
});
const auth = T.AwsAuthSigv4({ name: "codeguru-security" });
const ver = T.ServiceVersion("2018-05-10");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://codeguru-security-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://codeguru-security-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://codeguru-security.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://codeguru-security.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetAccountConfigurationRequest extends S.Class<GetAccountConfigurationRequest>(
  "GetAccountConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/accountConfiguration/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagKeyList = S.Array(S.String);
export class CreateUploadUrlRequest extends S.Class<CreateUploadUrlRequest>(
  "CreateUploadUrlRequest",
)(
  { scanName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/uploadUrl" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingsRequest extends S.Class<GetFindingsRequest>(
  "GetFindingsRequest",
)(
  {
    scanName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/findings/{scanName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMetricsSummaryRequest extends S.Class<GetMetricsSummaryRequest>(
  "GetMetricsSummaryRequest",
)(
  {
    date: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("date"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/metrics/summary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetScanRequest extends S.Class<GetScanRequest>("GetScanRequest")(
  {
    scanName: S.String.pipe(T.HttpLabel()),
    runId: S.optional(S.String).pipe(T.HttpQuery("runId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/scans/{scanName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFindingsMetricsRequest extends S.Class<ListFindingsMetricsRequest>(
  "ListFindingsMetricsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startDate"),
    ),
    endDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endDate"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/metrics/findings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListScansRequest extends S.Class<ListScansRequest>(
  "ListScansRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "GET", uri: "/scans" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
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
export class EncryptionConfig extends S.Class<EncryptionConfig>(
  "EncryptionConfig",
)({ kmsKeyArn: S.optional(S.String) }) {}
export class UpdateAccountConfigurationRequest extends S.Class<UpdateAccountConfigurationRequest>(
  "UpdateAccountConfigurationRequest",
)(
  { encryptionConfig: EncryptionConfig },
  T.all(
    T.Http({ method: "PUT", uri: "/updateAccountConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FindingIdentifier extends S.Class<FindingIdentifier>(
  "FindingIdentifier",
)({ scanName: S.String, findingId: S.String }) {}
export const FindingIdentifiers = S.Array(FindingIdentifier);
export const ResourceId = S.Union(S.Struct({ codeArtifactId: S.String }));
export class BatchGetFindingsRequest extends S.Class<BatchGetFindingsRequest>(
  "BatchGetFindingsRequest",
)(
  { findingIdentifiers: FindingIdentifiers },
  T.all(
    T.Http({ method: "POST", uri: "/batchGetFindings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateScanRequest extends S.Class<CreateScanRequest>(
  "CreateScanRequest",
)(
  {
    clientToken: S.optional(S.String),
    resourceId: ResourceId,
    scanName: S.String,
    scanType: S.optional(S.String),
    analysisType: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/scans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAccountConfigurationResponse extends S.Class<GetAccountConfigurationResponse>(
  "GetAccountConfigurationResponse",
)({ encryptionConfig: EncryptionConfig }) {}
export class GetScanResponse extends S.Class<GetScanResponse>(
  "GetScanResponse",
)({
  scanName: S.String,
  runId: S.String,
  scanState: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  analysisType: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  numberOfRevisions: S.optional(S.Number),
  scanNameArn: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class UpdateAccountConfigurationResponse extends S.Class<UpdateAccountConfigurationResponse>(
  "UpdateAccountConfigurationResponse",
)({ encryptionConfig: EncryptionConfig }) {}
export const DetectorTags = S.Array(S.String);
export class ScanNameWithFindingNum extends S.Class<ScanNameWithFindingNum>(
  "ScanNameWithFindingNum",
)({ scanName: S.optional(S.String), findingNumber: S.optional(S.Number) }) {}
export const ScansWithMostOpenCriticalFindings = S.Array(
  ScanNameWithFindingNum,
);
export const RequestHeaderMap = S.Record({ key: S.String, value: S.String });
export class FindingMetricsValuePerSeverity extends S.Class<FindingMetricsValuePerSeverity>(
  "FindingMetricsValuePerSeverity",
)({
  info: S.optional(S.Number),
  low: S.optional(S.Number),
  medium: S.optional(S.Number),
  high: S.optional(S.Number),
  critical: S.optional(S.Number),
}) {}
export class AccountFindingsMetric extends S.Class<AccountFindingsMetric>(
  "AccountFindingsMetric",
)({
  date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  newFindings: S.optional(FindingMetricsValuePerSeverity),
  closedFindings: S.optional(FindingMetricsValuePerSeverity),
  openFindings: S.optional(FindingMetricsValuePerSeverity),
  meanTimeToClose: S.optional(FindingMetricsValuePerSeverity),
}) {}
export const FindingsMetricList = S.Array(AccountFindingsMetric);
export class ScanSummary extends S.Class<ScanSummary>("ScanSummary")({
  scanState: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  scanName: S.String,
  runId: S.String,
  scanNameArn: S.optional(S.String),
}) {}
export const ScanSummaries = S.Array(ScanSummary);
export const ReferenceUrls = S.Array(S.String);
export const RelatedVulnerabilities = S.Array(S.String);
export class CreateScanResponse extends S.Class<CreateScanResponse>(
  "CreateScanResponse",
)({
  scanName: S.String,
  runId: S.String,
  resourceId: ResourceId,
  scanState: S.String,
  scanNameArn: S.optional(S.String),
}) {}
export class CreateUploadUrlResponse extends S.Class<CreateUploadUrlResponse>(
  "CreateUploadUrlResponse",
)({
  s3Url: S.String,
  requestHeaders: RequestHeaderMap,
  codeArtifactId: S.String,
}) {}
export class ListFindingsMetricsResponse extends S.Class<ListFindingsMetricsResponse>(
  "ListFindingsMetricsResponse",
)({
  findingsMetrics: S.optional(FindingsMetricList),
  nextToken: S.optional(S.String),
}) {}
export class ListScansResponse extends S.Class<ListScansResponse>(
  "ListScansResponse",
)({ summaries: S.optional(ScanSummaries), nextToken: S.optional(S.String) }) {}
export class Resource extends S.Class<Resource>("Resource")({
  id: S.optional(S.String),
  subResourceId: S.optional(S.String),
}) {}
export class CategoryWithFindingNum extends S.Class<CategoryWithFindingNum>(
  "CategoryWithFindingNum",
)({
  categoryName: S.optional(S.String),
  findingNumber: S.optional(S.Number),
}) {}
export const CategoriesWithMostFindings = S.Array(CategoryWithFindingNum);
export const ScansWithMostOpenFindings = S.Array(ScanNameWithFindingNum);
export class BatchGetFindingsError extends S.Class<BatchGetFindingsError>(
  "BatchGetFindingsError",
)({
  scanName: S.String,
  findingId: S.String,
  errorCode: S.String,
  message: S.String,
}) {}
export const BatchGetFindingsErrors = S.Array(BatchGetFindingsError);
export class MetricsSummary extends S.Class<MetricsSummary>("MetricsSummary")({
  date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  openFindings: S.optional(FindingMetricsValuePerSeverity),
  categoriesWithMostFindings: S.optional(CategoriesWithMostFindings),
  scansWithMostOpenFindings: S.optional(ScansWithMostOpenFindings),
  scansWithMostOpenCriticalFindings: S.optional(
    ScansWithMostOpenCriticalFindings,
  ),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  text: S.optional(S.String),
  url: S.optional(S.String),
}) {}
export class SuggestedFix extends S.Class<SuggestedFix>("SuggestedFix")({
  description: S.optional(S.String),
  code: S.optional(S.String),
}) {}
export const SuggestedFixes = S.Array(SuggestedFix);
export class CodeLine extends S.Class<CodeLine>("CodeLine")({
  number: S.optional(S.Number),
  content: S.optional(S.String),
}) {}
export const CodeSnippet = S.Array(CodeLine);
export class FilePath extends S.Class<FilePath>("FilePath")({
  name: S.optional(S.String),
  path: S.optional(S.String),
  startLine: S.optional(S.Number),
  endLine: S.optional(S.Number),
  codeSnippet: S.optional(CodeSnippet),
}) {}
export class Vulnerability extends S.Class<Vulnerability>("Vulnerability")({
  referenceUrls: S.optional(ReferenceUrls),
  relatedVulnerabilities: S.optional(RelatedVulnerabilities),
  id: S.optional(S.String),
  filePath: S.optional(FilePath),
  itemCount: S.optional(S.Number),
}) {}
export class Remediation extends S.Class<Remediation>("Remediation")({
  recommendation: S.optional(Recommendation),
  suggestedFixes: S.optional(SuggestedFixes),
}) {}
export class Finding extends S.Class<Finding>("Finding")({
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  description: S.optional(S.String),
  generatorId: S.optional(S.String),
  id: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  type: S.optional(S.String),
  status: S.optional(S.String),
  resource: S.optional(Resource),
  vulnerability: S.optional(Vulnerability),
  severity: S.optional(S.String),
  remediation: S.optional(Remediation),
  title: S.optional(S.String),
  detectorTags: S.optional(DetectorTags),
  detectorId: S.optional(S.String),
  detectorName: S.optional(S.String),
  ruleId: S.optional(S.String),
}) {}
export const Findings = S.Array(Finding);
export class BatchGetFindingsResponse extends S.Class<BatchGetFindingsResponse>(
  "BatchGetFindingsResponse",
)({ findings: Findings, failedFindings: BatchGetFindingsErrors }) {}
export class GetMetricsSummaryResponse extends S.Class<GetMetricsSummaryResponse>(
  "GetMetricsSummaryResponse",
)({ metricsSummary: S.optional(MetricsSummary) }) {}
export class GetFindingsResponse extends S.Class<GetFindingsResponse>(
  "GetFindingsResponse",
)({ findings: S.optional(Findings), nextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
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

//# Operations
/**
 * Use to remove one or more tags from an existing scan.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Use to update the encryption configuration for an account.
 */
export const updateAccountConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountConfigurationRequest,
    output: UpdateAccountConfigurationResponse,
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
 * Use to create a scan using code uploaded to an Amazon S3 bucket.
 */
export const createScan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Generates a pre-signed URL, request headers used to upload a code resource, and code artifact identifier for the uploaded resource.
 *
 * You can upload your code resource to the URL with the request headers using any HTTP client.
 */
export const createUploadUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Use to get the encryption configuration for an account.
 */
export const getAccountConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccountConfigurationRequest,
    output: GetAccountConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns details about a scan, including whether or not a scan has completed.
 */
export const getScan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns metrics about all findings in an account within a specified time range.
 */
export const listFindingsMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFindingsMetricsRequest,
  output: ListFindingsMetricsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all scans in an account. Does not return `EXPRESS` scans.
 */
export const listScans = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListScansRequest,
  output: ListScansResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all tags associated with a scan.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of requested findings from standard scans.
 */
export const batchGetFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMetricsSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Use to add one or more tags to an existing scan.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of all findings generated by a particular scan.
 */
export const getFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
