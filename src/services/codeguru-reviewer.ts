import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CodeGuru Reviewer",
  serviceShapeName: "AWSGuruFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "codeguru-reviewer" });
const ver = T.ServiceVersion("2019-09-19");
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
                        url: "https://codeguru-reviewer-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://codeguru-reviewer-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://codeguru-reviewer.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://codeguru-reviewer.{Region}.{PartitionResult#dnsSuffix}",
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
export const ProviderTypes = S.Array(S.String);
export const JobStates = S.Array(S.String);
export const RepositoryNames = S.Array(S.String);
export const UserIds = S.Array(S.String);
export const RecommendationIds = S.Array(S.String);
export const RepositoryAssociationStates = S.Array(S.String);
export const Names = S.Array(S.String);
export const Owners = S.Array(S.String);
export const Reactions = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DescribeCodeReviewRequest extends S.Class<DescribeCodeReviewRequest>(
  "DescribeCodeReviewRequest",
)(
  { CodeReviewArn: S.String.pipe(T.HttpLabel("CodeReviewArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/codereviews/{CodeReviewArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRecommendationFeedbackRequest extends S.Class<DescribeRecommendationFeedbackRequest>(
  "DescribeRecommendationFeedbackRequest",
)(
  {
    CodeReviewArn: S.String.pipe(T.HttpLabel("CodeReviewArn")),
    RecommendationId: S.String.pipe(T.HttpQuery("RecommendationId")),
    UserId: S.optional(S.String).pipe(T.HttpQuery("UserId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/feedback/{CodeReviewArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRepositoryAssociationRequest extends S.Class<DescribeRepositoryAssociationRequest>(
  "DescribeRepositoryAssociationRequest",
)(
  { AssociationArn: S.String.pipe(T.HttpLabel("AssociationArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/associations/{AssociationArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateRepositoryRequest extends S.Class<DisassociateRepositoryRequest>(
  "DisassociateRepositoryRequest",
)(
  { AssociationArn: S.String.pipe(T.HttpLabel("AssociationArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/associations/{AssociationArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCodeReviewsRequest extends S.Class<ListCodeReviewsRequest>(
  "ListCodeReviewsRequest",
)(
  {
    ProviderTypes: S.optional(ProviderTypes).pipe(T.HttpQuery("ProviderTypes")),
    States: S.optional(JobStates).pipe(T.HttpQuery("States")),
    RepositoryNames: S.optional(RepositoryNames).pipe(
      T.HttpQuery("RepositoryNames"),
    ),
    Type: S.String.pipe(T.HttpQuery("Type")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/codereviews" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecommendationFeedbackRequest extends S.Class<ListRecommendationFeedbackRequest>(
  "ListRecommendationFeedbackRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    CodeReviewArn: S.String.pipe(T.HttpLabel("CodeReviewArn")),
    UserIds: S.optional(UserIds).pipe(T.HttpQuery("UserIds")),
    RecommendationIds: S.optional(RecommendationIds).pipe(
      T.HttpQuery("RecommendationIds"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/feedback/{CodeReviewArn}/RecommendationFeedback",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecommendationsRequest extends S.Class<ListRecommendationsRequest>(
  "ListRecommendationsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    CodeReviewArn: S.String.pipe(T.HttpLabel("CodeReviewArn")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/codereviews/{CodeReviewArn}/Recommendations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRepositoryAssociationsRequest extends S.Class<ListRepositoryAssociationsRequest>(
  "ListRepositoryAssociationsRequest",
)(
  {
    ProviderTypes: S.optional(ProviderTypes).pipe(T.HttpQuery("ProviderType")),
    States: S.optional(RepositoryAssociationStates).pipe(T.HttpQuery("State")),
    Names: S.optional(Names).pipe(T.HttpQuery("Name")),
    Owners: S.optional(Owners).pipe(T.HttpQuery("Owner")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/associations" }),
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
export class PutRecommendationFeedbackRequest extends S.Class<PutRecommendationFeedbackRequest>(
  "PutRecommendationFeedbackRequest",
)(
  { CodeReviewArn: S.String, RecommendationId: S.String, Reactions: Reactions },
  T.all(
    T.Http({ method: "PUT", uri: "/feedback" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRecommendationFeedbackResponse extends S.Class<PutRecommendationFeedbackResponse>(
  "PutRecommendationFeedbackResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), Tags: TagMap },
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
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export const AnalysisTypes = S.Array(S.String);
export class KMSKeyDetails extends S.Class<KMSKeyDetails>("KMSKeyDetails")({
  KMSKeyId: S.optional(S.String),
  EncryptionOption: S.optional(S.String),
}) {}
export class CodeArtifacts extends S.Class<CodeArtifacts>("CodeArtifacts")({
  SourceCodeArtifactsObjectKey: S.String,
  BuildArtifactsObjectKey: S.optional(S.String),
}) {}
export class S3RepositoryDetails extends S.Class<S3RepositoryDetails>(
  "S3RepositoryDetails",
)({
  BucketName: S.optional(S.String),
  CodeArtifacts: S.optional(CodeArtifacts),
}) {}
export class RepositoryAssociation extends S.Class<RepositoryAssociation>(
  "RepositoryAssociation",
)({
  AssociationId: S.optional(S.String),
  AssociationArn: S.optional(S.String),
  ConnectionArn: S.optional(S.String),
  Name: S.optional(S.String),
  Owner: S.optional(S.String),
  ProviderType: S.optional(S.String),
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
  LastUpdatedTimeStamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CreatedTimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  KMSKeyDetails: S.optional(KMSKeyDetails),
  S3RepositoryDetails: S.optional(S3RepositoryDetails),
}) {}
export class DisassociateRepositoryResponse extends S.Class<DisassociateRepositoryResponse>(
  "DisassociateRepositoryResponse",
)({
  RepositoryAssociation: S.optional(RepositoryAssociation),
  Tags: S.optional(TagMap),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class CodeCommitRepository extends S.Class<CodeCommitRepository>(
  "CodeCommitRepository",
)({ Name: S.String }) {}
export class ThirdPartySourceRepository extends S.Class<ThirdPartySourceRepository>(
  "ThirdPartySourceRepository",
)({ Name: S.String, ConnectionArn: S.String, Owner: S.String }) {}
export class S3Repository extends S.Class<S3Repository>("S3Repository")({
  Name: S.String,
  BucketName: S.String,
}) {}
export class Repository extends S.Class<Repository>("Repository")({
  CodeCommit: S.optional(CodeCommitRepository),
  Bitbucket: S.optional(ThirdPartySourceRepository),
  GitHubEnterpriseServer: S.optional(ThirdPartySourceRepository),
  S3Bucket: S.optional(S3Repository),
}) {}
export class RecommendationFeedback extends S.Class<RecommendationFeedback>(
  "RecommendationFeedback",
)({
  CodeReviewArn: S.optional(S.String),
  RecommendationId: S.optional(S.String),
  Reactions: S.optional(Reactions),
  UserId: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimeStamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class RecommendationFeedbackSummary extends S.Class<RecommendationFeedbackSummary>(
  "RecommendationFeedbackSummary",
)({
  RecommendationId: S.optional(S.String),
  Reactions: S.optional(Reactions),
  UserId: S.optional(S.String),
}) {}
export const RecommendationFeedbackSummaries = S.Array(
  RecommendationFeedbackSummary,
);
export class RepositoryAssociationSummary extends S.Class<RepositoryAssociationSummary>(
  "RepositoryAssociationSummary",
)({
  AssociationArn: S.optional(S.String),
  ConnectionArn: S.optional(S.String),
  LastUpdatedTimeStamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AssociationId: S.optional(S.String),
  Name: S.optional(S.String),
  Owner: S.optional(S.String),
  ProviderType: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const RepositoryAssociationSummaries = S.Array(
  RepositoryAssociationSummary,
);
export class RepositoryHeadSourceCodeType extends S.Class<RepositoryHeadSourceCodeType>(
  "RepositoryHeadSourceCodeType",
)({ BranchName: S.String }) {}
export const RuleTags = S.Array(S.String);
export class AssociateRepositoryRequest extends S.Class<AssociateRepositoryRequest>(
  "AssociateRepositoryRequest",
)(
  {
    Repository: Repository,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagMap),
    KMSKeyDetails: S.optional(KMSKeyDetails),
  },
  T.all(
    T.Http({ method: "POST", uri: "/associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRecommendationFeedbackResponse extends S.Class<DescribeRecommendationFeedbackResponse>(
  "DescribeRecommendationFeedbackResponse",
)({ RecommendationFeedback: S.optional(RecommendationFeedback) }) {}
export class ListRecommendationFeedbackResponse extends S.Class<ListRecommendationFeedbackResponse>(
  "ListRecommendationFeedbackResponse",
)({
  RecommendationFeedbackSummaries: S.optional(RecommendationFeedbackSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListRepositoryAssociationsResponse extends S.Class<ListRepositoryAssociationsResponse>(
  "ListRepositoryAssociationsResponse",
)({
  RepositoryAssociationSummaries: S.optional(RepositoryAssociationSummaries),
  NextToken: S.optional(S.String),
}) {}
export class Metrics extends S.Class<Metrics>("Metrics")({
  MeteredLinesOfCodeCount: S.optional(S.Number),
  SuppressedLinesOfCodeCount: S.optional(S.Number),
  FindingsCount: S.optional(S.Number),
}) {}
export class MetricsSummary extends S.Class<MetricsSummary>("MetricsSummary")({
  MeteredLinesOfCodeCount: S.optional(S.Number),
  SuppressedLinesOfCodeCount: S.optional(S.Number),
  FindingsCount: S.optional(S.Number),
}) {}
export class RuleMetadata extends S.Class<RuleMetadata>("RuleMetadata")({
  RuleId: S.optional(S.String),
  RuleName: S.optional(S.String),
  ShortDescription: S.optional(S.String),
  LongDescription: S.optional(S.String),
  RuleTags: S.optional(RuleTags),
}) {}
export class CommitDiffSourceCodeType extends S.Class<CommitDiffSourceCodeType>(
  "CommitDiffSourceCodeType",
)({
  SourceCommit: S.optional(S.String),
  DestinationCommit: S.optional(S.String),
  MergeBaseCommit: S.optional(S.String),
}) {}
export class BranchDiffSourceCodeType extends S.Class<BranchDiffSourceCodeType>(
  "BranchDiffSourceCodeType",
)({ SourceBranchName: S.String, DestinationBranchName: S.String }) {}
export class S3BucketRepository extends S.Class<S3BucketRepository>(
  "S3BucketRepository",
)({ Name: S.String, Details: S.optional(S3RepositoryDetails) }) {}
export class EventInfo extends S.Class<EventInfo>("EventInfo")({
  Name: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export class RequestMetadata extends S.Class<RequestMetadata>(
  "RequestMetadata",
)({
  RequestId: S.optional(S.String),
  Requester: S.optional(S.String),
  EventInfo: S.optional(EventInfo),
  VendorName: S.optional(S.String),
}) {}
export class SourceCodeType extends S.Class<SourceCodeType>("SourceCodeType")({
  CommitDiff: S.optional(CommitDiffSourceCodeType),
  RepositoryHead: S.optional(RepositoryHeadSourceCodeType),
  BranchDiff: S.optional(BranchDiffSourceCodeType),
  S3BucketRepository: S.optional(S3BucketRepository),
  RequestMetadata: S.optional(RequestMetadata),
}) {}
export class CodeReview extends S.Class<CodeReview>("CodeReview")({
  Name: S.optional(S.String),
  CodeReviewArn: S.optional(S.String),
  RepositoryName: S.optional(S.String),
  Owner: S.optional(S.String),
  ProviderType: S.optional(S.String),
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimeStamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Type: S.optional(S.String),
  PullRequestId: S.optional(S.String),
  SourceCodeType: S.optional(SourceCodeType),
  AssociationArn: S.optional(S.String),
  Metrics: S.optional(Metrics),
  AnalysisTypes: S.optional(AnalysisTypes),
  ConfigFileState: S.optional(S.String),
}) {}
export class CodeReviewSummary extends S.Class<CodeReviewSummary>(
  "CodeReviewSummary",
)({
  Name: S.optional(S.String),
  CodeReviewArn: S.optional(S.String),
  RepositoryName: S.optional(S.String),
  Owner: S.optional(S.String),
  ProviderType: S.optional(S.String),
  State: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimeStamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Type: S.optional(S.String),
  PullRequestId: S.optional(S.String),
  MetricsSummary: S.optional(MetricsSummary),
  SourceCodeType: S.optional(SourceCodeType),
}) {}
export const CodeReviewSummaries = S.Array(CodeReviewSummary);
export class RecommendationSummary extends S.Class<RecommendationSummary>(
  "RecommendationSummary",
)({
  FilePath: S.optional(S.String),
  RecommendationId: S.optional(S.String),
  StartLine: S.optional(S.Number),
  EndLine: S.optional(S.Number),
  Description: S.optional(S.String),
  RecommendationCategory: S.optional(S.String),
  RuleMetadata: S.optional(RuleMetadata),
  Severity: S.optional(S.String),
}) {}
export const RecommendationSummaries = S.Array(RecommendationSummary);
export class AssociateRepositoryResponse extends S.Class<AssociateRepositoryResponse>(
  "AssociateRepositoryResponse",
)({
  RepositoryAssociation: S.optional(RepositoryAssociation),
  Tags: S.optional(TagMap),
}) {}
export class DescribeCodeReviewResponse extends S.Class<DescribeCodeReviewResponse>(
  "DescribeCodeReviewResponse",
)({ CodeReview: S.optional(CodeReview) }) {}
export class ListCodeReviewsResponse extends S.Class<ListCodeReviewsResponse>(
  "ListCodeReviewsResponse",
)({
  CodeReviewSummaries: S.optional(CodeReviewSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListRecommendationsResponse extends S.Class<ListRecommendationsResponse>(
  "ListRecommendationsResponse",
)({
  RecommendationSummaries: S.optional(RecommendationSummaries),
  NextToken: S.optional(S.String),
}) {}
export class DescribeRepositoryAssociationResponse extends S.Class<DescribeRepositoryAssociationResponse>(
  "DescribeRepositoryAssociationResponse",
)({
  RepositoryAssociation: S.optional(RepositoryAssociation),
  Tags: S.optional(TagMap),
}) {}
export class RepositoryAnalysis extends S.Class<RepositoryAnalysis>(
  "RepositoryAnalysis",
)({
  RepositoryHead: S.optional(RepositoryHeadSourceCodeType),
  SourceCodeType: S.optional(SourceCodeType),
}) {}
export class CodeReviewType extends S.Class<CodeReviewType>("CodeReviewType")({
  RepositoryAnalysis: RepositoryAnalysis,
  AnalysisTypes: S.optional(AnalysisTypes),
}) {}
export class CreateCodeReviewRequest extends S.Class<CreateCodeReviewRequest>(
  "CreateCodeReviewRequest",
)(
  {
    Name: S.String,
    RepositoryAssociationArn: S.String,
    Type: CodeReviewType,
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/codereviews" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCodeReviewResponse extends S.Class<CreateCodeReviewResponse>(
  "CreateCodeReviewResponse",
)({ CodeReview: S.optional(CodeReview) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Adds one or more tags to an associated repository.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Stores customer feedback for a CodeGuru Reviewer recommendation. When this API is called again with
 * different reactions the previous feedback is overwritten.
 */
export const putRecommendationFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRecommendationFeedbackRequest,
    output: PutRecommendationFeedbackResponse,
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
 * Describes the customer feedback for a CodeGuru Reviewer recommendation.
 */
export const describeRecommendationFeedback =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRecommendationFeedbackRequest,
    output: DescribeRecommendationFeedbackResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of RecommendationFeedbackSummary objects that contain customer recommendation
 * feedback for all CodeGuru Reviewer users.
 */
export const listRecommendationFeedback =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRecommendationFeedbackRequest,
    output: ListRecommendationFeedbackResponse,
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
 * Use to associate an Amazon Web Services CodeCommit repository or a repository managed by Amazon Web Services
 * CodeStar Connections with Amazon CodeGuru Reviewer. When you associate a repository, CodeGuru Reviewer reviews
 * source code changes in the repository's pull requests and provides automatic
 * recommendations. You can view recommendations using the CodeGuru Reviewer console. For more
 * information, see Recommendations in
 * Amazon CodeGuru Reviewer in the *Amazon CodeGuru Reviewer User Guide.*
 *
 * If you associate a CodeCommit or S3 repository, it must be in the same Amazon Web Services Region and
 * Amazon Web Services account where its CodeGuru Reviewer code reviews are configured.
 *
 * Bitbucket and GitHub Enterprise Server repositories are managed by Amazon Web Services CodeStar
 * Connections to connect to CodeGuru Reviewer. For more information, see Associate a
 * repository in the *Amazon CodeGuru Reviewer User Guide.*
 *
 * You cannot use the CodeGuru Reviewer SDK or the Amazon Web Services CLI to associate a GitHub repository with
 * Amazon CodeGuru Reviewer. To associate a GitHub repository, use the console. For more information, see
 * Getting started with
 * CodeGuru Reviewer in the *CodeGuru Reviewer User Guide.*
 */
export const associateRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateRepositoryRequest,
  output: AssociateRepositoryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the metadata associated with the code review along with its status.
 */
export const describeCodeReview = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCodeReviewRequest,
  output: DescribeCodeReviewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the code reviews that the customer has created in the past 90 days.
 */
export const listCodeReviews = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCodeReviewsRequest,
    output: ListCodeReviewsResponse,
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
  }),
);
/**
 * Returns the list of all recommendations for a completed code review.
 */
export const listRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRecommendationsRequest,
    output: ListRecommendationsResponse,
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
 * Removes the association between Amazon CodeGuru Reviewer and a repository.
 */
export const disassociateRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateRepositoryRequest,
    output: DisassociateRepositoryResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      NotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes a tag from an associated repository.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the list of tags associated with an associated repository resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of RepositoryAssociationSummary objects that contain summary information about a
 * repository association. You can filter the returned list by ProviderType, Name, State, and Owner.
 */
export const listRepositoryAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRepositoryAssociationsRequest,
    output: ListRepositoryAssociationsResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RepositoryAssociationSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a RepositoryAssociation object that contains information about the requested
 * repository association.
 */
export const describeRepositoryAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRepositoryAssociationRequest,
    output: DescribeRepositoryAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      NotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Use to create a code review with a CodeReviewType of
 * `RepositoryAnalysis`. This type of code review analyzes all code under a
 * specified branch in an associated repository. `PullRequest` code reviews are
 * automatically triggered by a pull request.
 */
export const createCodeReview = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCodeReviewRequest,
  output: CreateCodeReviewResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
